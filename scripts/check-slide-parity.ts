#!/usr/bin/env bun

import { createWriteStream } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

import sharp from "sharp";
import { chromium, type Browser, type Page } from "playwright";

import { tracks } from "../public/curriculum";

type ParsedArgs = {
  baseRef: string;
  outputDir: string;
  port: number;
  units: string[];
  visualThreshold: number;
};

type SlideSummary = {
  content: string;
  coordinate: {
    h: number;
    v: number;
  };
  codeBlockCount: number;
  hash: string;
  heading: string | null;
  images: string[];
  index: number;
  links: string[];
};

type SlideComparison = {
  baseline: SlideSummary | null;
  current: SlideSummary | null;
  diffs: string[];
  index: number;
  visual: null | {
    baselinePath: string | null;
    baselinePathDark: string | null;
    changedPixels: number;
    currentPath: string | null;
    currentPathDark: string | null;
    diffPath: string | null;
    diffRatio: number | null;
    sizeMismatch: null | {
      baseline: {
        height: number;
        width: number;
      };
      current: {
        height: number;
        width: number;
      };
    };
    withinThreshold: boolean;
  };
};

type UnitRun = {
  currentMarkdownPath: string;
  route: string;
  tempBaselinePath: string;
  tempCurrentPath: string;
  unitTitle: string;
};

type ParityReportUnit = {
  baseRef: string;
  currentMarkdownPath: string;
  route: string;
  slides: SlideComparison[];
  title: string;
};

type ParityReport = {
  baseRef: string;
  generatedAt: string;
  outputDir: string;
  units: ParityReportUnit[];
  visualThreshold: number;
};

const ROOT_DIR = process.cwd();
const PARITY_PUBLIC_DIR = path.join(ROOT_DIR, "public", "markdown", "_parity");
const DEFAULT_OUTPUT_DIR = path.join(
  ROOT_DIR,
  "output",
  "playwright",
  "slide-parity"
);
const REVEAL_HORIZONTAL_OFFSET = 1;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, milliseconds);
  });
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    baseRef: "HEAD^",
    outputDir: DEFAULT_OUTPUT_DIR,
    port: 3301,
    units: [],
    visualThreshold: 0.01,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const nextValue = argv[index + 1];

    if (!token.startsWith("--")) {
      continue;
    }

    switch (token) {
      case "--base-ref":
        if (!nextValue) {
          throw new Error("--base-ref requires a value");
        }
        args.baseRef = nextValue;
        index += 1;
        break;
      case "--output-dir":
        if (!nextValue) {
          throw new Error("--output-dir requires a value");
        }
        args.outputDir = path.resolve(ROOT_DIR, nextValue);
        index += 1;
        break;
      case "--port":
        if (!nextValue) {
          throw new Error("--port requires a value");
        }
        args.port = Number.parseInt(nextValue, 10);
        index += 1;
        break;
      case "--unit":
        if (!nextValue) {
          throw new Error("--unit requires a value like track_b/01-name-card");
        }
        args.units.push(nextValue);
        index += 1;
        break;
      case "--visual-threshold":
        if (!nextValue) {
          throw new Error("--visual-threshold requires a numeric value");
        }
        args.visualThreshold = Number.parseFloat(nextValue);
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!args.units.length) {
    throw new Error(
      "Provide at least one --unit value, for example --unit track_b/01-name-card"
    );
  }

  if (!Number.isFinite(args.port) || args.port <= 0) {
    throw new Error(`Invalid port: ${args.port}`);
  }

  if (!Number.isFinite(args.visualThreshold) || args.visualThreshold < 0) {
    throw new Error(
      `Invalid visual threshold: ${args.visualThreshold}. Use a number >= 0.`
    );
  }

  return args;
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function sanitisePathPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "n/a";
  }

  return `${(value * 100).toFixed(2)}%`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function serialiseForInlineScript(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

function extractMatches(content: string, expression: RegExp): string[] {
  return Array.from(content.matchAll(expression), (match) => match[1] ?? match[2])
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim());
}

function normaliseList(values: string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function firstHeading(content: string): string | null {
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("<!--")) {
      continue;
    }

    const headingMatch = line.match(/^#{1,6}\s+(.*)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }

  return null;
}

function splitSlides(markdown: string): SlideSummary[] {
  const slides: SlideSummary[] = [];
  const lines = markdown.split(/\r?\n/);
  let currentLines: string[] = [];
  let horizontalIndex = 0;
  let verticalIndex = 0;
  let fenceMarker: string | null = null;

  const pushSlide = () => {
    const content = currentLines.join("\n").trim();
    const index = slides.length;
    const revealH = horizontalIndex + REVEAL_HORIZONTAL_OFFSET;
    const revealV = verticalIndex;

    slides.push({
      content,
      coordinate: {
        h: revealH,
        v: revealV,
      },
      codeBlockCount: (content.match(/(^|\n)(```|~~~)/g) ?? []).length / 2,
      hash: `#/${revealH}/${revealV}`,
      heading: firstHeading(content),
      images: normaliseList(
        extractMatches(
          content,
          /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<img[^>]*src=["']([^"']+)["']/g
        )
      ),
      index,
      links: normaliseList(
        extractMatches(
          content,
          /(?<!\!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<a[^>]*href=["']([^"']+)["']/g
        )
      ),
    });

    currentLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const fenceMatch = trimmed.match(/^(```|~~~)/);

    if (fenceMatch) {
      if (fenceMarker === fenceMatch[1]) {
        fenceMarker = null;
      } else if (!fenceMarker) {
        fenceMarker = fenceMatch[1];
      }
    }

    if (!fenceMarker && trimmed === "---") {
      pushSlide();
      horizontalIndex += 1;
      verticalIndex = 0;
      continue;
    }

    if (!fenceMarker && trimmed === "---vertical---") {
      pushSlide();
      verticalIndex += 1;
      continue;
    }

    currentLines.push(line);
  }

  pushSlide();
  return slides;
}

function compareSlides(
  baselineSlides: SlideSummary[],
  currentSlides: SlideSummary[]
): SlideComparison[] {
  const maxSlides = Math.max(baselineSlides.length, currentSlides.length);
  const comparisons: SlideComparison[] = [];

  for (let index = 0; index < maxSlides; index += 1) {
    const baseline = baselineSlides[index] ?? null;
    const current = currentSlides[index] ?? null;
    const diffs: string[] = [];

    if (!baseline) {
      diffs.push("Slide only exists in current deck");
    } else if (!current) {
      diffs.push("Slide only exists in baseline deck");
    } else {
      if ((baseline.heading ?? "") !== (current.heading ?? "")) {
        diffs.push(
          `Heading changed: "${baseline.heading ?? "(none)"}" -> "${current.heading ?? "(none)"}"`
        );
      }

      if (baseline.codeBlockCount !== current.codeBlockCount) {
        diffs.push(
          `Code block count changed: ${baseline.codeBlockCount} -> ${current.codeBlockCount}`
        );
      }

      if (baseline.images.join(" | ") !== current.images.join(" | ")) {
        diffs.push("Image references changed");
      }

      if (baseline.links.join(" | ") !== current.links.join(" | ")) {
        diffs.push("Link references changed");
      }
    }

    comparisons.push({
      baseline,
      current,
      diffs,
      index,
      visual: null,
    });
  }

  return comparisons;
}

async function execCapture(command: string, args: string[]): Promise<string> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", rejectPromise);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise(stdout);
        return;
      }

      rejectPromise(
        new Error(
          [`Command failed: ${command} ${args.join(" ")}`, stderr.trim()].join("\n")
        )
      );
    });
  });
}

async function readBaselineMarkdown(
  baseRef: string,
  relativeMarkdownPath: string
): Promise<string> {
  return execCapture("git", ["show", `${baseRef}:${toPosixPath(relativeMarkdownPath)}`]);
}

function resolveUnit(route: string): {
  markdownPath: string;
  route: string;
  trackId: string;
  unitId: string;
  unitTitle: string;
} {
  const [trackId, unitKey] = route.split("/");

  if (!trackId || !unitKey) {
    throw new Error(`Invalid unit route "${route}". Expected track/unit.`);
  }

  const track = tracks.find((entry) => entry.id === trackId);
  const unit = track?.units.find(
    (entry) =>
      entry.id === unitKey ||
      entry.markdownId === unitKey ||
      entry.legacyMarkdownIds?.includes(unitKey)
  );

  if (!track || !unit) {
    throw new Error(`Unable to resolve unit "${route}" from public/curriculum.ts`);
  }

  return {
    markdownPath: path.join("public", "markdown", trackId, `${unit.markdownId}.md`),
    route: `${trackId}/${unit.id}`,
    trackId,
    unitId: unit.id,
    unitTitle: unit.title,
  };
}

async function prepareUnitRun(
  baseRef: string,
  route: string,
  runSlug: string
): Promise<UnitRun> {
  const {
    markdownPath,
    route: resolvedRoute,
    trackId,
    unitId,
    unitTitle,
  } = resolveUnit(route);
  const currentMarkdownPath = path.join(ROOT_DIR, markdownPath);
  const baselineMarkdown = await readBaselineMarkdown(baseRef, markdownPath);
  const currentMarkdown = await readFile(currentMarkdownPath, "utf8");
  const tempDir = path.join(PARITY_PUBLIC_DIR, runSlug, trackId, unitId);

  await mkdir(tempDir, { recursive: true });

  const tempBaselinePath = path.join(tempDir, "baseline.md");
  const tempCurrentPath = path.join(tempDir, "current.md");

  await writeFile(tempBaselinePath, baselineMarkdown);
  await writeFile(tempCurrentPath, currentMarkdown);

  return {
    currentMarkdownPath,
    route: resolvedRoute,
    tempBaselinePath,
    tempCurrentPath,
    unitTitle,
  };
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch (_error) {
      // Ignore while the server is booting.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function startServer(
  port: number,
  logFilePath: string
): Promise<ReturnType<typeof spawn>> {
  await mkdir(path.dirname(logFilePath), { recursive: true });

  const logStream = createWriteStream(logFilePath, { flags: "a" });
  const bunBinary = process.execPath.includes("bun") ? process.execPath : "bun";
  const child = spawn(
    bunBinary,
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  child.stdout?.pipe(logStream);
  child.stderr?.pipe(logStream);

  try {
    await waitForServer(`http://127.0.0.1:${port}`, 60_000);
  } catch (error) {
    child.kill("SIGTERM");
    throw error;
  }

  return child;
}

async function stopServer(child: ReturnType<typeof spawn>): Promise<void> {
  if (child.killed) {
    return;
  }

  child.kill("SIGTERM");

  await new Promise<void>((resolvePromise) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolvePromise();
    }, 5_000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolvePromise();
    });
  });
}

async function preparePage(page: Page, url: string, label: string): Promise<void> {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".reveal.ready", { timeout: 60_000 });
  await waitForVisibleSlideAssets(page, label);
}

async function waitForVisibleSlideAssets(page: Page, label: string): Promise<void> {
  try {
    await page.waitForFunction(() => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>(".slides .present img")
      );
      return images.every((image) => image.complete);
    }, undefined, { timeout: 15_000 });
  } catch (_error) {
    console.warn(`Warning: timed out waiting for visible images on ${label}.`);
  }
}

async function captureSlide(page: Page, outputPath: string): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await page.locator(".reveal").screenshot({
    animations: "disabled",
    path: outputPath,
  });
}

async function diffImages(
  baselinePath: string,
  currentPath: string,
  diffPath: string
): Promise<{
  changedPixels: number;
  diffPath: string | null;
  diffRatio: number | null;
  sizeMismatch: null | {
    baseline: {
      height: number;
      width: number;
    };
    current: {
      height: number;
      width: number;
    };
  };
}> {
  const [baselineImage, currentImage] = await Promise.all([
    sharp(baselinePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(currentPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);

  if (
    baselineImage.info.width !== currentImage.info.width ||
    baselineImage.info.height !== currentImage.info.height
  ) {
    return {
      changedPixels: 0,
      diffPath: null,
      diffRatio: null,
      sizeMismatch: {
        baseline: {
          height: baselineImage.info.height,
          width: baselineImage.info.width,
        },
        current: {
          height: currentImage.info.height,
          width: currentImage.info.width,
        },
      },
    };
  }

  const diffBuffer = Buffer.alloc(baselineImage.data.length);
  let changedPixels = 0;
  const totalPixels = baselineImage.info.width * baselineImage.info.height;

  for (let index = 0; index < baselineImage.data.length; index += 4) {
    const redDiff = Math.abs(baselineImage.data[index] - currentImage.data[index]);
    const greenDiff = Math.abs(
      baselineImage.data[index + 1] - currentImage.data[index + 1]
    );
    const blueDiff = Math.abs(
      baselineImage.data[index + 2] - currentImage.data[index + 2]
    );
    const alphaDiff = Math.abs(
      baselineImage.data[index + 3] - currentImage.data[index + 3]
    );
    const maxDiff = Math.max(redDiff, greenDiff, blueDiff, alphaDiff);

    if (maxDiff > 16) {
      changedPixels += 1;
    }

    diffBuffer[index] = redDiff;
    diffBuffer[index + 1] = greenDiff;
    diffBuffer[index + 2] = blueDiff;
    diffBuffer[index + 3] = 255;
  }

  const diffRatio = totalPixels === 0 ? 0 : changedPixels / totalPixels;

  if (changedPixels > 0) {
    await mkdir(path.dirname(diffPath), { recursive: true });
    await sharp(diffBuffer, {
      raw: {
        channels: 4,
        height: baselineImage.info.height,
        width: baselineImage.info.width,
      },
    })
      .png()
      .toFile(diffPath);
  }

  return {
    changedPixels,
    diffPath: changedPixels > 0 ? diffPath : null,
    diffRatio,
    sizeMismatch: null,
  };
}

async function getPresentSlideSignature(page: Page): Promise<string> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".slides .present"))
      .map((element) => element.outerHTML)
      .join("\n")
  );
}

async function advanceSlide(page: Page, label: string): Promise<void> {
  const previousSignature = await getPresentSlideSignature(page);

  await page.locator(".reveal").click();
  await page.keyboard.press("Space");
  await page.waitForFunction(
    (signature) =>
      Array.from(document.querySelectorAll(".slides .present"))
        .map((element) => element.outerHTML)
        .join("\n") !== signature,
    previousSignature,
    { timeout: 60_000 }
  );
  await waitForVisibleSlideAssets(page, label);
  await page.waitForTimeout(200);
}

function markdownOverridePath(filePath: string): string {
  const relative = path.relative(path.join(ROOT_DIR, "public"), filePath);
  return `/${toPosixPath(relative)}`;
}

function buildUnitUrl(
  port: number,
  route: string,
  markdownPath: string
): string {
  const url = new URL(`http://127.0.0.1:${port}/tracks/${route}`);
  url.searchParams.set("markdown", markdownOverridePath(markdownPath));
  url.hash = "#/slide-view";
  return url.toString();
}

function hasRemainingSlide(
  comparisons: SlideComparison[],
  fromIndex: number,
  variant: "baseline" | "current"
): boolean {
  return comparisons.slice(fromIndex + 1).some((comparison) => Boolean(comparison[variant]));
}

function summariseDeckComparisons(comparisons: SlideComparison[]): {
  manifestMismatchCount: number;
  visualMismatchCount: number;
} {
  return comparisons.reduce(
    (summary, comparison) => {
      if (comparison.diffs.length > 0) {
        summary.manifestMismatchCount += 1;
      }

      if (comparison.visual && !comparison.visual.withinThreshold) {
        summary.visualMismatchCount += 1;
      }

      return summary;
    },
    {
      manifestMismatchCount: 0,
      visualMismatchCount: 0,
    }
  );
}

async function runVisualComparisons(
  browser: Browser,
  outputDir: string,
  port: number,
  unitRun: UnitRun,
  comparisons: SlideComparison[],
  visualThreshold: number
): Promise<void> {
  const context = await browser.newContext({
    colorScheme: "light",
    viewport: {
      height: 1200,
      width: 1600,
    },
  });

  await context.addInitScript(() => {
    window.localStorage.setItem("isDarkMode", "false");
  });

  const baselinePage = await context.newPage();
  const currentPage = await context.newPage();
  const baselineUrl = buildUnitUrl(port, unitRun.route, unitRun.tempBaselinePath);
  const currentUrl = buildUnitUrl(port, unitRun.route, unitRun.tempCurrentPath);
  const unitOutputDir = path.join(outputDir, sanitisePathPart(unitRun.route));

  await preparePage(baselinePage, baselineUrl, `${unitRun.route} baseline`);
  await preparePage(currentPage, currentUrl, `${unitRun.route} current`);

  for (const comparison of comparisons) {
    if (!comparison.baseline || !comparison.current) {
      comparison.visual = {
        baselinePath: null,
        baselinePathDark: null,
        changedPixels: 0,
        currentPath: null,
        currentPathDark: null,
        diffPath: null,
        diffRatio: null,
        sizeMismatch: null,
        withinThreshold: false,
      };
      continue;
    }

    const slideSlug = `${String(comparison.index + 1).padStart(2, "0")}-${sanitisePathPart(
      comparison.current.heading ?? comparison.baseline.heading ?? "slide"
    )}`;
    const baselineShot = path.join(unitOutputDir, "baseline", `${slideSlug}.png`);
    const currentShot = path.join(unitOutputDir, "current", `${slideSlug}.png`);
    const diffShot = path.join(unitOutputDir, "diff", `${slideSlug}.png`);

    await captureSlide(baselinePage, baselineShot);
    await captureSlide(currentPage, currentShot);

    const diff = await diffImages(baselineShot, currentShot, diffShot);

    comparison.visual = {
      baselinePath: path.relative(outputDir, baselineShot),
      baselinePathDark: null,
      changedPixels: diff.changedPixels,
      currentPath: path.relative(outputDir, currentShot),
      currentPathDark: null,
      diffPath: diff.diffPath ? path.relative(outputDir, diff.diffPath) : null,
      diffRatio: diff.diffRatio,
      sizeMismatch: diff.sizeMismatch,
      withinThreshold:
        diff.sizeMismatch === null &&
        diff.diffRatio !== null &&
        diff.diffRatio <= visualThreshold,
    };

    if (hasRemainingSlide(comparisons, comparison.index, "baseline")) {
      await advanceSlide(
        baselinePage,
        `${unitRun.route} baseline slide ${comparison.index + 2}`
      );
    }

    if (hasRemainingSlide(comparisons, comparison.index, "current")) {
      await advanceSlide(
        currentPage,
        `${unitRun.route} current slide ${comparison.index + 2}`
      );
    }
  }

  await context.close();

  // Dark-mode pass: use a separate context so addInitScript can set isDarkMode "true" on load.
  // (The light context's addInitScript runs on every load including reload, so reload would overwrite "true".)
  const darkContext = await browser.newContext({
    colorScheme: "dark",
    viewport: { height: 1200, width: 1600 },
  });
  await darkContext.addInitScript(() => {
    window.localStorage.setItem("isDarkMode", "true");
  });

  const baselinePageDark = await darkContext.newPage();
  const currentPageDark = await darkContext.newPage();

  await preparePage(baselinePageDark, baselineUrl, `${unitRun.route} baseline (dark)`);
  await preparePage(currentPageDark, currentUrl, `${unitRun.route} current (dark)`);
  await baselinePageDark.waitForSelector(".dark", { timeout: 15_000 });
  await currentPageDark.waitForSelector(".dark", { timeout: 15_000 });
  await waitForVisibleSlideAssets(baselinePageDark, `${unitRun.route} baseline (dark)`);
  await waitForVisibleSlideAssets(currentPageDark, `${unitRun.route} current (dark)`);

  for (const comparison of comparisons) {
    if (!comparison.baseline || !comparison.current || !comparison.visual) continue;

    const slideSlug = `${String(comparison.index + 1).padStart(2, "0")}-${sanitisePathPart(
      comparison.current.heading ?? comparison.baseline.heading ?? "slide"
    )}`;
    const baselineDarkShot = path.join(unitOutputDir, "baseline-dark", `${slideSlug}.png`);
    const currentDarkShot = path.join(unitOutputDir, "current-dark", `${slideSlug}.png`);

    const baselineSlideUrl = `${baselineUrl.replace(/#.*$/, "")}#/${comparison.index + REVEAL_HORIZONTAL_OFFSET}/0`;
    const currentSlideUrl = `${currentUrl.replace(/#.*$/, "")}#/${comparison.index + REVEAL_HORIZONTAL_OFFSET}/0`;
    await baselinePageDark.goto(baselineSlideUrl, { waitUntil: "networkidle" });
    await currentPageDark.goto(currentSlideUrl, { waitUntil: "networkidle" });
    await delay(400);

    await captureSlide(baselinePageDark, baselineDarkShot);
    await captureSlide(currentPageDark, currentDarkShot);

    comparison.visual.baselinePathDark = path.relative(outputDir, baselineDarkShot);
    comparison.visual.currentPathDark = path.relative(outputDir, currentDarkShot);
  }

  await darkContext.close();
}

async function writeReport(outputPath: string, report: unknown): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
}

function renderSlideRow(slide: SlideComparison, unitIndex: number): string {
  const heading = slide.current?.heading ?? slide.baseline?.heading ?? "Untitled";
  const visual = slide.visual;
  const baselineLight = visual?.baselinePath ?? null;
  const baselineDark = visual?.baselinePathDark ?? null;
  const currentLight = visual?.currentPath ?? null;
  const currentDark = visual?.currentPathDark ?? null;

  const beforePanel =
    baselineLight || baselineDark
      ? `<button type="button" class="slide-panel before-panel" data-src-light="${escapeHtml(baselineLight ?? "")}" data-src-dark="${escapeHtml(baselineDark ?? "")}" data-modal-label="Before — Slide ${slide.index + 1}: ${escapeHtml(heading)}">
        <img src="${escapeHtml(baselineLight ?? baselineDark ?? "")}" alt="Before" data-src-light="${escapeHtml(baselineLight ?? "")}" data-src-dark="${escapeHtml(baselineDark ?? "")}" />
      </button>`
      : `<div class="slide-panel empty">—</div>`;

  const afterPanel =
    currentLight || currentDark
      ? `<div class="slide-panel after-panel" data-slide-index="${slide.index}" data-unit-index="${unitIndex}" title="Click to leave feedback">
        <img src="${escapeHtml(currentLight ?? currentDark ?? "")}" alt="After" data-src-light="${escapeHtml(currentLight ?? "")}" data-src-dark="${escapeHtml(currentDark ?? "")}" />
        <div class="marker-layer" data-slide-index="${slide.index}" data-unit-index="${unitIndex}" aria-hidden="true"></div>
      </div>`
      : `<div class="slide-panel empty">—</div>`;

  return `
    <section class="slide-row" data-slide-index="${slide.index}" data-unit-index="${unitIndex}">
      <h2 class="slide-heading">${slide.index + 1}. ${escapeHtml(heading)}</h2>
      <div class="slide-comparison">
        ${beforePanel}
        <span class="divider">|</span>
        ${afterPanel}
      </div>
    </section>
  `;
}

function writeHtmlReport(
  outputPath: string,
  report: ParityReport,
  runId: string
): Promise<void> {
  const unitTitle = report.units.map((u) => u.title).join(" · ");
  const slidesHtml = report.units.flatMap((unit, unitIndex) => unit.slides.map((s) => renderSlideRow(s, unitIndex))).join("");
  const appViewUrl = `/parity-reports/${runId}`;

  const reportMeta = {
    baseRef: report.baseRef,
    generatedAt: report.generatedAt,
    runId,
    units: report.units.map((u) => ({
      currentMarkdownPath: u.currentMarkdownPath,
      route: u.route,
      slides: u.slides.map((s) => ({
        diffs: s.diffs,
        hash: s.current?.hash ?? s.baseline?.hash ?? "",
        heading: s.current?.heading ?? s.baseline?.heading ?? "Untitled",
        index: s.index,
        visualDiffPercent: s.visual?.diffRatio != null ? `${(s.visual.diffRatio * 100).toFixed(2)}%` : null,
      })),
      title: u.title,
    })),
  };
  const reportMetaJson = serialiseForInlineScript(reportMeta);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Slide Parity Report</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, sans-serif; background: #f5f5f5; color: #333; padding: 24px; }
      .hint { margin: 0 0 16px; font-size: 0.9rem; color: #666; }
      .hint a { color: inherit; }
      .unit-overview { margin: 0 0 32px; font-size: 1.5rem; font-weight: 600; }
      .slide-row { margin-bottom: 32px; }
      .slide-heading { margin: 0 0 12px; font-size: 1rem; font-weight: 600; }
      .slide-comparison { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: stretch; width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #eee; }
      .slide-panel { display: block; padding: 0; border: none; background: #fafafa; min-height: 200px; }
      .before-panel { cursor: pointer; }
      .before-panel:hover { background: #f0f0f0; }
      .after-panel { position: relative; cursor: crosshair; }
      .after-panel:hover { background: #f0f0f0; }
      .slide-panel img { display: block; width: 100%; height: auto; object-fit: contain; }
      .slide-panel.empty { cursor: default; display: grid; place-items: center; color: #999; font-size: 1.5rem; }
      .divider { padding: 0 16px; display: grid; place-items: center; background: #f5f5f5; color: #999; font-weight: 600; }
      .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; padding: 24px; z-index: 999; }
      .modal.open { display: flex; }
      .modal-content { max-width: 95vw; max-height: 95vh; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.3); }
      .modal-content img { display: block; max-width: 95vw; max-height: 85vh; object-fit: contain; }
      .modal-header { padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
      .modal-close { padding: 8px 12px; border: none; background: #eee; border-radius: 6px; cursor: pointer; font: inherit; }
      .modal-close:hover { background: #e0e0e0; }
      .report-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
      .theme-toggle { padding: 8px; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font: inherit; color: #333; line-height: 1; }
      .theme-toggle:hover { background: #f0f0f0; }
      body.dark { background: #1a1a1a; color: #e5e5e5; }
      body.dark .hint { color: #a3a3a3; }
      body.dark .unit-overview { color: #e5e5e5; }
      body.dark .slide-heading { color: #d4d4d4; }
      body.dark .slide-comparison { background: #262626; border-color: #404040; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      body.dark .slide-panel { background: #262626; }
      body.dark .slide-panel:hover { background: #333; }
      body.dark .slide-panel.empty { color: #737373; }
      body.dark .divider { background: #1a1a1a; color: #737373; }
      body.dark .modal-content { background: #262626; box-shadow: 0 24px 48px rgba(0,0,0,0.6); }
      body.dark .modal-header { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .modal-close { background: #404040; color: #e5e5e5; }
      body.dark .modal-close:hover { background: #525252; }
      body.dark .theme-toggle { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .theme-toggle:hover { background: #333; }
      .marker-layer { position: absolute; inset: 0; pointer-events: none; }
      .comment-marker { position: absolute; transform: translate(-50%, -50%); pointer-events: auto; width: 28px; height: 28px; border: none; border-radius: 999px; background: #2563eb; color: #fff; cursor: pointer; font-size: 0.8rem; font-weight: 700; box-shadow: 0 6px 16px rgba(37,99,235,0.28); z-index: 5; }
      .comment-marker:hover { background: #1d4ed8; }
      .annotation-editor { position: absolute; z-index: 20; width: min(340px, calc(100vw - 48px)); padding: 14px; border: 1px solid #ddd; border-radius: 12px; background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.18); display: grid; gap: 10px; }
      .annotation-editor[hidden] { display: none; }
      .annotation-editor-header { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
      .annotation-editor-title { margin: 0; font-size: 0.95rem; font-weight: 600; }
      .annotation-editor-meta { margin: 4px 0 0; color: #666; font-size: 0.82rem; }
      .annotation-editor-close { border: none; background: transparent; color: #666; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0; }
      .annotation-editor-close:hover { color: #111; }
      .annotation-editor textarea { width: 100%; min-height: 100px; padding: 10px 12px; border: 1px solid #d4d4d4; border-radius: 10px; resize: vertical; font: inherit; }
      .annotation-editor textarea:focus, .prompt-textarea:focus { outline: 2px solid rgba(37,99,235,0.35); outline-offset: 0; border-color: #2563eb; }
      .annotation-editor-actions { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
      .btn-secondary, .btn-primary, .page-generate, .copy-button { border: none; border-radius: 10px; cursor: pointer; padding: 10px 14px; font: inherit; }
      .btn-secondary { background: #eee; color: #333; }
      .btn-secondary:hover { background: #e0e0e0; }
      .btn-primary, .page-generate, .copy-button { background: #2563eb; color: #fff; }
      .btn-primary:hover, .page-generate:hover, .copy-button:hover { background: #1d4ed8; }
      .btn-destructive { margin-right: auto; background: #fee2e2; color: #b91c1c; }
      .btn-destructive:hover { background: #fecaca; }
      .page-fab-row { position: fixed; right: 24px; bottom: 24px; z-index: 40; display: flex; align-items: center; gap: 10px; }
      .page-clear { border: none; border-radius: 10px; cursor: pointer; padding: 10px 14px; background: #fee2e2; color: #b91c1c; font: inherit; }
      .page-clear:hover { background: #fecaca; }
      .page-generate { box-shadow: 0 20px 30px rgba(37,99,235,0.25); }
      .page-generate[hidden], .page-clear[hidden] { display: none; }
      .prompt-modal { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.65); display: none; align-items: center; justify-content: center; padding: 24px; }
      .prompt-modal.open { display: flex; }
      .prompt-card { width: min(960px, 100%); max-height: calc(100vh - 48px); overflow: auto; border-radius: 16px; background: #fff; box-shadow: 0 24px 48px rgba(0,0,0,0.25); padding: 20px; display: grid; gap: 14px; }
      .prompt-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      .prompt-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
      .prompt-subtitle { margin: 6px 0 0; color: #666; }
      .prompt-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .prompt-clear-btn { margin-right: auto; }
      .prompt-close { border: none; background: transparent; color: #666; cursor: pointer; font-size: 1.3rem; line-height: 1; padding: 0; }
      .prompt-close:hover { color: #111; }
      .copy-button { display: inline-flex; gap: 8px; align-items: center; }
      .copy-button svg { width: 1rem; height: 1rem; }
      .prompt-textarea { width: 100%; min-height: 420px; padding: 14px 16px; border-radius: 12px; border: 1px solid #d4d4d4; resize: vertical; background: #fff; color: #111; font: inherit; }
      .prompt-copy-status { margin: 0; min-height: 1.2em; color: #2563eb; font-size: 0.9rem; }
      body.dark .annotation-editor, body.dark .prompt-card { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .annotation-editor-close, body.dark .prompt-close { color: #a3a3a3; }
      body.dark .annotation-editor-close:hover, body.dark .prompt-close:hover { color: #fff; }
      body.dark .annotation-editor textarea, body.dark .prompt-textarea { background: #171717; color: #f5f5f5; border-color: #404040; }
      body.dark .annotation-editor-meta, body.dark .prompt-subtitle { color: #a3a3a3; }
      body.dark .btn-secondary { background: #404040; color: #e5e5e5; }
      body.dark .btn-secondary:hover { background: #525252; }
      body.dark .btn-destructive { background: #7f1d1d; color: #fee2e2; }
      body.dark .btn-destructive:hover { background: #991b1b; }
      body.dark .page-clear { background: #7f1d1d; color: #fee2e2; }
      body.dark .page-clear:hover { background: #991b1b; }
      body.dark .page-generate, body.dark .btn-primary, body.dark .copy-button { background: #3b82f6; }
      body.dark .page-generate:hover, body.dark .btn-primary:hover, body.dark .copy-button:hover { background: #2563eb; }
      body.dark .prompt-copy-status { color: #93c5fd; }
    </style>
  </head>
  <body>
    <div class="report-header">
      <h1 class="unit-overview">${escapeHtml(unitTitle)}</h1>
      <button type="button" id="theme-toggle" class="theme-toggle" aria-label="Switch to Dark Mode" title="Switch to Dark Mode">
        <span id="theme-icon" aria-hidden="true"></span>
      </button>
    </div>
    <p class="hint">Click the <strong>After</strong> screenshot to leave feedback. Click <strong>Before</strong> to enlarge. Use <strong>Generate prompt</strong> to export comments.</p>
    ${slidesHtml}
    <div class="page-fab-row">
      <button type="button" id="page-clear" class="page-clear" hidden title="Clear all comments">Clear</button>
      <button type="button" id="page-generate" class="page-generate" hidden>Generate prompt</button>
    </div>

    <div id="annotation-editor" class="annotation-editor" hidden>
      <div class="annotation-editor-header">
        <div>
          <p id="annotation-editor-title" class="annotation-editor-title">Slide comment</p>
          <p id="annotation-editor-meta" class="annotation-editor-meta"></p>
        </div>
        <button type="button" id="annotation-close" class="annotation-editor-close" aria-label="Cancel" title="Cancel">&#215;</button>
      </div>
      <textarea id="annotation-text" placeholder="Describe what needs to change."></textarea>
      <div class="annotation-editor-actions">
        <button type="button" id="annotation-delete" class="btn-secondary btn-destructive" hidden>Delete</button>
        <button type="button" id="annotation-cancel" class="btn-secondary">Cancel</button>
        <button type="button" id="annotation-save" class="btn-primary">Done</button>
      </div>
    </div>

    <div id="prompt-modal" class="prompt-modal" aria-hidden="true">
      <div class="prompt-card">
        <div class="prompt-header">
          <div>
            <h2 class="prompt-title">Agent Prompt</h2>
            <p class="prompt-subtitle">Editable prompt summarising your parity review feedback.</p>
          </div>
          <div class="prompt-actions">
            <button type="button" id="prompt-clear" class="btn-secondary prompt-clear-btn" title="Clear all comments">Clear</button>
            <button type="button" id="prompt-copy" class="copy-button">
              <svg aria-hidden="true" viewBox="0 0 448 512" fill="currentColor"><path d="M384 336l-192 0c-35.3 0-64-28.7-64-64l0-192c0-17.7 14.3-32 32-32l140.1 0L416 163.9 416 304c0 17.7-14.3 32-32 32zM128 368c0 17.7 14.3 32 32 32l224 0c35.3 0 64-28.7 64-64l0-140.1c0-17-6.7-33.3-18.7-45.3L313.4 34.7c-12-12-28.3-18.7-45.3-18.7L160 16c-35.3 0-64 28.7-64 64l0 16-32 0c-35.3 0-64 28.7-64 64L0 384c0 61.9 50.1 112 112 112l208 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-208 0c-26.5 0-48-21.5-48-48l0-224 32 0 0 112c0 53 43 96 96 96l112 0 0 16z"/></svg>
              <span>Copy</span>
            </button>
            <button type="button" id="prompt-close" class="prompt-close" aria-label="Close" title="Close">&#215;</button>
          </div>
        </div>
        <textarea id="prompt-textarea" class="prompt-textarea" spellcheck="false"></textarea>
        <p id="prompt-copy-status" class="prompt-copy-status" aria-live="polite"></p>
      </div>
    </div>

    <div class="modal" id="modal" aria-hidden="true">
      <div class="modal-content">
        <div class="modal-header">
          <span id="modal-label"></span>
          <button type="button" class="modal-close" id="modal-close">Close</button>
        </div>
        <img id="modal-img" alt="" />
      </div>
    </div>
    <script>
      const reportData = \${reportMetaJson};
      const commentStorageKey = "parity-comments::" + reportData.runId;

      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = document.getElementById("theme-icon");
      const pageGenerate = document.getElementById("page-generate");
      const pageClear = document.getElementById("page-clear");
      const annotationEditor = document.getElementById("annotation-editor");
      const annotationTitle = document.getElementById("annotation-editor-title");
      const annotationMeta = document.getElementById("annotation-editor-meta");
      const annotationText = document.getElementById("annotation-text");
      const annotationSave = document.getElementById("annotation-save");
      const annotationCancel = document.getElementById("annotation-cancel");
      const annotationDelete = document.getElementById("annotation-delete");
      const annotationClose = document.getElementById("annotation-close");
      const promptModal = document.getElementById("prompt-modal");
      const promptTextarea = document.getElementById("prompt-textarea");
      const promptCopy = document.getElementById("prompt-copy");
      const promptClear = document.getElementById("prompt-clear");
      const promptClose = document.getElementById("prompt-close");
      const promptCopyStatus = document.getElementById("prompt-copy-status");
      const modal = document.getElementById("modal");
      const modalImg = document.getElementById("modal-img");
      const modalLabel = document.getElementById("modal-label");
      const modalClose = document.getElementById("modal-close");

      const moonSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 384 512" fill="currentColor"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
      const sunSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 512 512" fill="currentColor"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';

      const afterPanelMap = new Map(
        Array.from(document.querySelectorAll(".after-panel")).map((p) => [
          p.dataset.unitIndex + ":" + p.dataset.slideIndex, p
        ])
      );
      let comments = [];
      let editorState = null;

      function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
      function roundToTenths(v) { return Math.round(v * 10) / 10; }
      function fmtPct(v) { return roundToTenths(v).toFixed(1) + "%"; }
      function isDark() { return document.body.classList.contains("dark"); }
      function getThemeLabel() { return isDark() ? "dark" : "light"; }

      function applyTheme(dark) {
        document.body.classList.toggle("dark", dark);
        themeIcon.innerHTML = dark ? sunSvg : moonSvg;
        const label = dark ? "Switch to Light Mode" : "Switch to Dark Mode";
        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
        try { localStorage.setItem("isDarkMode", JSON.stringify(dark)); } catch (_) {}
      }
      function updateImagesForTheme(dark) {
        document.querySelectorAll(".slide-panel img[data-src-light], .slide-panel img[data-src-dark]").forEach((img) => {
          const src = dark ? (img.dataset.srcDark || img.dataset.srcLight) : (img.dataset.srcLight || img.dataset.srcDark);
          if (src) img.src = src;
        });
      }

      function describeBand(y) { return y < 20 ? "top band" : y > 80 ? "bottom band" : "main content area"; }
      function describeRegion(x, y) {
        const h = x < 33.34 ? "left" : x > 66.66 ? "right" : "centre";
        const v = y < 33.34 ? "top" : y > 66.66 ? "bottom" : "middle";
        if (h === "centre" && v === "middle") return "centre";
        if (h === "centre") return v + "-centre";
        if (v === "middle") return "middle-" + h;
        return v + "-" + h;
      }

      function loadComments() {
        try { const r = localStorage.getItem(commentStorageKey); if (!r) return []; const p = JSON.parse(r); return Array.isArray(p) ? p.filter(c => c && c.text) : []; } catch (_) { return []; }
      }
      function persistComments() {
        try { localStorage.setItem(commentStorageKey, JSON.stringify(comments)); } catch (_) {}
      }

      function updateFab() {
        if (comments.length === 0) { pageGenerate.hidden = true; pageClear.hidden = true; pageGenerate.textContent = "Generate prompt"; return; }
        pageGenerate.hidden = false; pageClear.hidden = false;
        pageGenerate.textContent = "Generate prompt (" + comments.length + ")";
      }

      function renderMarkers() {
        document.querySelectorAll(".marker-layer").forEach(l => { l.textContent = ""; });
        comments.forEach((c, i) => {
          const panel = afterPanelMap.get(c.unitIndex + ":" + c.slideIndex);
          if (!panel) return;
          const layer = panel.querySelector(".marker-layer");
          if (!layer) return;
          const m = document.createElement("button");
          m.type = "button"; m.className = "comment-marker";
          m.textContent = String(i + 1);
          m.style.left = c.xPercent + "%"; m.style.top = c.yPercent + "%";
          m.title = "Comment " + (i + 1) + ": " + c.text;
          m.addEventListener("click", (e) => { e.stopPropagation(); openExistingComment(c.id); });
          layer.appendChild(m);
        });
        updateFab();
      }

      function closeEditor(reason) {
        if (!editorState) return true;
        if ((reason === "cancel" || reason === "switch") && !window.confirm(editorState.commentId ? "Discard changes?" : "Discard this draft?")) return false;
        annotationEditor.hidden = true;
        if (annotationEditor.parentElement) annotationEditor.parentElement.removeChild(annotationEditor);
        editorState = null; annotationText.value = "";
        return true;
      }

      function positionEditor(panel, ax, ay) {
        annotationEditor.style.left = "12px"; annotationEditor.style.top = "12px"; annotationEditor.style.visibility = "hidden";
        requestAnimationFrame(() => {
          const m = 12;
          const ml = Math.max(m, panel.clientWidth - annotationEditor.offsetWidth - m);
          const mt = Math.max(m, panel.clientHeight - annotationEditor.offsetHeight - m);
          annotationEditor.style.left = clamp(ax + 12, m, ml) + "px";
          annotationEditor.style.top = clamp(ay + 12, m, mt) + "px";
          annotationEditor.style.visibility = "visible"; annotationText.focus();
        });
      }

      function openCommentEditor(opts) {
        if (!closeEditor("switch")) return;
        const unit = reportData.units[opts.unitIndex];
        const slide = unit && unit.slides[opts.slideIndex];
        const panel = afterPanelMap.get(opts.unitIndex + ":" + opts.slideIndex);
        if (!slide || !panel) return;
        editorState = opts;
        annotationTitle.textContent = unit.title + " — Slide " + (slide.index + 1);
        annotationMeta.textContent = slide.heading + " " + slide.hash + " • " + fmtPct(opts.xPercent) + " from left, " + fmtPct(opts.yPercent) + " from top";
        annotationText.value = opts.text || "";
        annotationDelete.hidden = !opts.commentId;
        panel.appendChild(annotationEditor);
        annotationEditor.hidden = false;
        positionEditor(panel, opts.anchorX, opts.anchorY);
      }

      function openExistingComment(id) {
        const c = comments.find(e => e.id === id);
        if (!c) return;
        const panel = afterPanelMap.get(c.unitIndex + ":" + c.slideIndex);
        if (!panel) return;
        openCommentEditor({
          anchorX: (c.xPercent / 100) * panel.clientWidth,
          anchorY: (c.yPercent / 100) * panel.clientHeight,
          band: c.band, commentId: c.id, region: c.region,
          slideIndex: c.slideIndex, text: c.text, theme: c.theme,
          unitIndex: c.unitIndex, xPercent: c.xPercent, yPercent: c.yPercent,
        });
      }

      function saveComment() {
        if (!editorState) return;
        const text = annotationText.value.trim();
        if (!text) { window.alert("Add a comment first, or cancel."); annotationText.focus(); return; }
        if (editorState.commentId) {
          comments = comments.map(c => c.id === editorState.commentId ? { ...c, text } : c);
        } else {
          comments.push({
            band: editorState.band, createdAt: Date.now(),
            id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
            region: editorState.region, slideIndex: editorState.slideIndex,
            text, theme: getThemeLabel(), unitIndex: editorState.unitIndex,
            xPercent: editorState.xPercent, yPercent: editorState.yPercent,
          });
        }
        persistComments(); renderMarkers(); closeEditor("save");
      }

      function deleteComment() {
        if (!editorState || !editorState.commentId) return;
        if (!window.confirm("Delete this comment?")) return;
        comments = comments.filter(c => c.id !== editorState.commentId);
        persistComments(); renderMarkers(); closeEditor("delete");
      }

      function buildPromptText() {
        const ordered = comments.slice().sort((a, b) => a.createdAt - b.createdAt);
        const tick = String.fromCharCode(96);
        const lines = [];
        lines.push("Apply parity review feedback to the migrated slide decks.");
        lines.push("");
        lines.push("Base ref: " + tick + reportData.baseRef + tick + "  Generated: " + reportData.generatedAt);
        lines.push("Comments: " + ordered.length);
        lines.push("");
        lines.push("Follow repo slide authoring rules (markdown-first, shared layouts, preserve flow).");
        lines.push("");
        ordered.forEach((c, i) => {
          const unit = reportData.units[c.unitIndex];
          const slide = unit && unit.slides[c.slideIndex];
          if (!unit || !slide) return;
          const diffNote = slide.visualDiffPercent ? " (visual diff " + slide.visualDiffPercent + ")" : "";
          lines.push((i + 1) + ". " + tick + unit.route + tick + " slide " + (slide.index + 1) + " " + tick + slide.heading + tick + " " + slide.hash + diffNote + " — " + c.region + ", " + c.band + ", " + c.theme + " mode");
          lines.push("   Source: " + tick + unit.currentMarkdownPath + tick);
          lines.push("   Comment:");
          c.text.split(/\\r?\\n/).forEach(l => { lines.push("     " + l); });
        });
        lines.push("");
        lines.push("Outcome: fix each issue; regenerate parity report when done.");
        return lines.join("\\n");
      }

      function openPromptModal() {
        promptTextarea.value = buildPromptText();
        promptCopyStatus.textContent = "";
        promptModal.classList.add("open"); promptModal.setAttribute("aria-hidden", "false");
        promptTextarea.focus();
      }
      function closePromptModal() {
        promptModal.classList.remove("open"); promptModal.setAttribute("aria-hidden", "true");
      }
      function clearAllComments() {
        if (!window.confirm("Clear all comments? This cannot be undone.")) return;
        comments = []; persistComments(); renderMarkers();
        if (promptModal.classList.contains("open")) closePromptModal();
      }
      async function copyPrompt() {
        try { await navigator.clipboard.writeText(promptTextarea.value); promptCopyStatus.textContent = "Copied."; }
        catch (_) { promptTextarea.select(); document.execCommand("copy"); promptCopyStatus.textContent = "Copied."; }
      }

      // Theme toggle
      themeToggle.addEventListener("click", () => { applyTheme(!isDark()); updateImagesForTheme(isDark()); });
      try { const s = localStorage.getItem("isDarkMode"); applyTheme(s !== null ? JSON.parse(s) === true : false); updateImagesForTheme(isDark()); } catch (_) { applyTheme(false); }

      // Before panels: click to enlarge
      document.querySelectorAll(".before-panel").forEach((btn) => {
        btn.addEventListener("click", () => {
          const dark = isDark();
          const key = dark ? "srcDark" : "srcLight";
          modalImg.src = (btn.dataset[key] || "").trim() || (dark ? btn.dataset.srcLight : btn.dataset.srcDark) || "";
          modalLabel.textContent = btn.dataset.modalLabel || "";
          modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
        });
      });
      function closeModalFn() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
      modalClose.addEventListener("click", closeModalFn);
      modal.addEventListener("click", (e) => { if (e.target === modal) closeModalFn(); });

      // After panels: click to comment
      document.querySelectorAll(".after-panel").forEach((panel) => {
        panel.addEventListener("click", (e) => {
          if (e.target.closest(".annotation-editor") || e.target.closest(".comment-marker")) return;
          const rect = panel.getBoundingClientRect();
          const x = clamp(e.clientX - rect.left, 0, rect.width);
          const y = clamp(e.clientY - rect.top, 0, rect.height);
          const xPct = rect.width === 0 ? 0 : roundToTenths((x / rect.width) * 100);
          const yPct = rect.height === 0 ? 0 : roundToTenths((y / rect.height) * 100);
          openCommentEditor({
            anchorX: x, anchorY: y, band: describeBand(yPct), commentId: null,
            region: describeRegion(xPct, yPct), slideIndex: Number(panel.dataset.slideIndex),
            text: "", theme: getThemeLabel(), unitIndex: Number(panel.dataset.unitIndex),
            xPercent: xPct, yPercent: yPct,
          });
        });
      });

      annotationEditor.addEventListener("click", (e) => { e.stopPropagation(); });
      annotationSave.addEventListener("click", saveComment);
      annotationCancel.addEventListener("click", () => { closeEditor("cancel"); });
      annotationClose.addEventListener("click", () => { closeEditor("cancel"); });
      annotationDelete.addEventListener("click", deleteComment);
      pageGenerate.addEventListener("click", () => { if (closeEditor("switch")) openPromptModal(); });
      pageClear.addEventListener("click", clearAllComments);
      promptClear.addEventListener("click", clearAllComments);
      promptCopy.addEventListener("click", copyPrompt);
      promptClose.addEventListener("click", closePromptModal);
      promptModal.addEventListener("click", (e) => { if (e.target === promptModal) closePromptModal(); });

      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (promptModal.classList.contains("open")) { e.preventDefault(); closePromptModal(); return; }
        if (modal.classList.contains("open")) { e.preventDefault(); closeModalFn(); return; }
        if (!annotationEditor.hidden) { e.preventDefault(); closeEditor("cancel"); }
      });

      comments = loadComments();
      renderMarkers();
    </script>
  </body>
</html>
`;

  return writeFile(outputPath, html);
}

function printDeckSummary(
  route: string,
  unitTitle: string,
  baselineSlides: SlideSummary[],
  currentSlides: SlideSummary[],
  comparisons: SlideComparison[]
): void {
  const summary = summariseDeckComparisons(comparisons);

  console.log(`\n${route} — ${unitTitle}`);
  console.log(`  Slides: ${baselineSlides.length} baseline / ${currentSlides.length} current`);
  console.log(`  Manifest mismatches: ${summary.manifestMismatchCount}`);
  console.log(`  Visual mismatches: ${summary.visualMismatchCount}`);

  const sampleDifferences = comparisons.filter((entry) => entry.diffs.length > 0).slice(0, 3);
  for (const difference of sampleDifferences) {
    console.log(
      `  Slide ${difference.index + 1}: ${difference.diffs.join("; ")}`
    );
  }

  const visualDifferences = comparisons
    .filter((entry) => entry.visual && !entry.visual.withinThreshold)
    .slice(0, 3);

  for (const difference of visualDifferences) {
    if (difference.visual?.sizeMismatch) {
      console.log(
        `  Slide ${difference.index + 1}: screenshot size mismatch ${difference.visual.sizeMismatch.baseline.width}x${difference.visual.sizeMismatch.baseline.height} vs ${difference.visual.sizeMismatch.current.width}x${difference.visual.sizeMismatch.current.height}`
      );
      continue;
    }

    console.log(
      `  Slide ${difference.index + 1}: visual diff ${formatPercent(
        difference.visual?.diffRatio ?? null
      )}`
    );
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const runSlug = new Date().toISOString().replace(/[:.]/g, "-");
  const outputDir = path.join(args.outputDir, runSlug);
  const tempParityDir = path.join(PARITY_PUBLIC_DIR, runSlug);
  const serverLogFile = path.join(outputDir, "server.log");

  await mkdir(outputDir, { recursive: true });

  const unitRuns = await Promise.all(
    args.units.map((route) => prepareUnitRun(args.baseRef, route, runSlug))
  );

  let serverProcess: ReturnType<typeof spawn> | null = null;
  let browser: Browser | null = null;

  try {
    serverProcess = await startServer(args.port, serverLogFile);
    browser = await chromium.launch({ headless: true });

    const reportUnits: ParityReportUnit[] = [];

    for (const unitRun of unitRuns) {
      const baselineMarkdown = await readFile(unitRun.tempBaselinePath, "utf8");
      const currentMarkdown = await readFile(unitRun.tempCurrentPath, "utf8");
      const baselineSlides = splitSlides(baselineMarkdown);
      const currentSlides = splitSlides(currentMarkdown);
      const comparisons = compareSlides(
        baselineSlides,
        currentSlides
      );

      await runVisualComparisons(
        browser,
        outputDir,
        args.port,
        unitRun,
        comparisons,
        args.visualThreshold
      );

      printDeckSummary(
        unitRun.route,
        unitRun.unitTitle,
        baselineSlides,
        currentSlides,
        comparisons
      );

      reportUnits.push({
        baseRef: args.baseRef,
        currentMarkdownPath: path.relative(ROOT_DIR, unitRun.currentMarkdownPath),
        route: unitRun.route,
        slides: comparisons,
        title: unitRun.unitTitle,
      });
    }

    const report: ParityReport = {
      baseRef: args.baseRef,
      generatedAt: new Date().toISOString(),
      outputDir: path.relative(ROOT_DIR, outputDir),
      units: reportUnits,
      visualThreshold: args.visualThreshold,
    };

    await writeReport(path.join(outputDir, "report.json"), report);
    await writeHtmlReport(path.join(outputDir, "report.html"), report, runSlug);

    const parityPublic = path.join(ROOT_DIR, "public", "parity-reports", runSlug);
    await mkdir(path.dirname(parityPublic), { recursive: true });
    await cp(outputDir, parityPublic, { recursive: true });

    console.log(`\nReport written to ${path.relative(ROOT_DIR, outputDir)}/report.json`);
    console.log(`HTML report written to ${path.relative(ROOT_DIR, outputDir)}/report.html`);
    console.log(`View in app (uses site theme toggle): /parity-reports/${runSlug}`);
  } finally {
    if (browser) {
      await browser.close();
    }

    if (serverProcess) {
      await stopServer(serverProcess);
    }

    await rm(tempParityDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
