#!/usr/bin/env bun

import { createWriteStream } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

import sharp from "sharp";
import { chromium, type Browser, type Page } from "playwright";

import { tracks } from "../public/curriculum";
import {
  renderSlideReviewAnnotationChrome,
  renderSlideReviewAnnotationRuntime,
  renderSlideReviewAnnotationStyles,
} from "./lib/slide-review-annotations";

type ParsedArgs = {
  baseRef: string;
  outputDir: string;
  port: number;
  units: string[];
  visualThreshold: number;
};

const PAGE_GOTO_TIMEOUT_MS = 120_000;

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
  await page.goto(url, {
    timeout: PAGE_GOTO_TIMEOUT_MS,
    waitUntil: "domcontentloaded",
  });
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
    await baselinePageDark.goto(baselineSlideUrl, {
      timeout: PAGE_GOTO_TIMEOUT_MS,
      waitUntil: "domcontentloaded",
    });
    await currentPageDark.goto(currentSlideUrl, {
      timeout: PAGE_GOTO_TIMEOUT_MS,
      waitUntil: "domcontentloaded",
    });
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
      ? `<div class="slide-panel after-panel" data-slide-index="${slide.index}" data-unit-index="${unitIndex}" data-src-light="${escapeHtml(currentLight ?? "")}" data-src-dark="${escapeHtml(currentDark ?? "")}" data-modal-label="After — Slide ${slide.index + 1}: ${escapeHtml(heading)}" title="Click to enlarge, then leave feedback" role="button" tabindex="0">
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
  const annotationStyles = renderSlideReviewAnnotationStyles();
  const annotationChrome = renderSlideReviewAnnotationChrome({
    clearButtonTitle: "Clear all comments",
    primaryActionLabel: "Generate prompt",
    promptSubtitle: "Editable prompt summarising your parity review feedback.",
  });
  const annotationRuntime = renderSlideReviewAnnotationRuntime();

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
      .after-panel { position: relative; cursor: zoom-in; }
      .after-panel:hover { background: #f0f0f0; }
      .after-panel:focus-visible { outline: 2px solid #2563eb; outline-offset: -2px; }
      .slide-panel img { display: block; width: 100%; height: auto; object-fit: contain; }
      .slide-panel.empty { cursor: default; display: grid; place-items: center; color: #999; font-size: 1.5rem; }
      .divider { padding: 0 16px; display: grid; place-items: center; background: #f5f5f5; color: #999; font-weight: 600; }
      .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; padding: 24px; z-index: 999; }
      .modal.open { display: flex; }
      .modal-content { max-width: 95vw; max-height: 95vh; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.3); display: grid; }
      .modal-header { padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
      .modal-copy { min-width: 0; }
      .modal-label { display: block; font-weight: 600; }
      .modal-hint { display: block; margin-top: 4px; color: #666; font-size: 0.9rem; }
      .modal-body { padding: 16px; display: flex; align-items: center; justify-content: center; overflow: auto; max-height: calc(95vh - 74px); }
      .modal-image-shell { position: relative; display: inline-block; line-height: 0; max-width: min(calc(95vw - 64px), 1600px); }
      .modal-image-shell img { display: block; max-width: 100%; max-height: calc(95vh - 122px); width: auto; height: auto; object-fit: contain; }
      .modal-image-shell.commentable { cursor: crosshair; }
      .modal-image-shell.commentable:hover { box-shadow: 0 0 0 1px rgba(37,99,235,0.25); border-radius: 8px; }
      .modal-marker-layer[hidden] { display: none; }
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
      body.dark .modal-hint { color: #a3a3a3; }
      body.dark .modal-close { background: #404040; color: #e5e5e5; }
      body.dark .modal-close:hover { background: #525252; }
      body.dark .theme-toggle { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .theme-toggle:hover { background: #333; }
${annotationStyles}
    </style>
  </head>
  <body>
    <div class="report-header">
      <h1 class="unit-overview">${escapeHtml(unitTitle)}</h1>
      <button type="button" id="theme-toggle" class="theme-toggle" aria-label="Switch to Dark Mode" title="Switch to Dark Mode">
        <span id="theme-icon" aria-hidden="true"></span>
      </button>
    </div>
    <p class="hint">Click <strong>After</strong> to enlarge it, then click inside the modal image to leave feedback. Click <strong>Before</strong> to enlarge it. Use <strong>Generate prompt</strong> to export comments.</p>
    ${slidesHtml}
    ${annotationChrome}

    <div class="modal" id="modal" aria-hidden="true">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-copy">
            <span id="modal-label" class="modal-label"></span>
            <span id="modal-hint" class="modal-hint"></span>
          </div>
          <button type="button" class="modal-close" id="modal-close">Close</button>
        </div>
        <div class="modal-body">
          <div id="modal-image-shell" class="modal-image-shell">
            <img id="modal-img" alt="" />
            <div id="modal-marker-layer" class="marker-layer modal-marker-layer" aria-hidden="true" hidden></div>
          </div>
        </div>
      </div>
    </div>
    <script>
      const reportData = ${reportMetaJson};
${annotationRuntime}
      const commentStorageKey = "parity-comments::" + reportData.runId;

      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = document.getElementById("theme-icon");
      const modal = document.getElementById("modal");
      const modalImg = document.getElementById("modal-img");
      const modalLabel = document.getElementById("modal-label");
      const modalHint = document.getElementById("modal-hint");
      const modalImageShell = document.getElementById("modal-image-shell");
      const modalMarkerLayer = document.getElementById("modal-marker-layer");
      const modalClose = document.getElementById("modal-close");

      const moonSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 384 512" fill="currentColor"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
      const sunSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 512 512" fill="currentColor"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';

      const afterPanelMap = new Map(
        Array.from(document.querySelectorAll(".after-panel")).map((p) => [
          p.dataset.unitIndex + ":" + p.dataset.slideIndex, p
        ])
      );
      const markerLayerMap = new Map(
        Array.from(afterPanelMap.entries()).map(([key, panel]) => [
          key, panel.querySelector(".marker-layer")
        ])
      );
      let modalState = null;

      function keyFor(unitIndex, slideIndex) { return unitIndex + ":" + slideIndex; }
      function isDark() { return document.body.classList.contains("dark"); }
      function getThemeLabel() { return isDark() ? "dark" : "light"; }
      function resolvePanelImageSrc(panel, dark) {
        const key = dark ? "srcDark" : "srcLight";
        return (panel.dataset[key] || "").trim() || (dark ? panel.dataset.srcLight : panel.dataset.srcDark) || "";
      }

      function applyTheme(dark) {
        document.body.classList.toggle("dark", dark);
        themeIcon.innerHTML = dark ? sunSvg : moonSvg;
        const label = dark ? "Switch to Light Mode" : "Switch to Dark Mode";
        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
        try { localStorage.setItem("isDarkMode", JSON.stringify(dark)); } catch (_) {}
      }
      function updateModalImageForTheme(dark) {
        if (!modalState) return;
        const src = resolvePanelImageSrc(modalState.sourceEl, dark);
        if (src) modalImg.src = src;
      }
      function updateImagesForTheme(dark) {
        document.querySelectorAll(".slide-panel img[data-src-light], .slide-panel img[data-src-dark]").forEach((img) => {
          const src = dark ? (img.dataset.srcDark || img.dataset.srcLight) : (img.dataset.srcLight || img.dataset.srcDark);
          if (src) img.src = src;
        });
        updateModalImageForTheme(dark);
      }
      function getCommentHost(options) {
        if (
          modalState &&
          modalState.kind === "after" &&
          modal.classList.contains("open") &&
          modalState.unitIndex === options.unitIndex &&
          modalState.slideIndex === options.slideIndex
        ) {
          return modalImageShell;
        }
        return afterPanelMap.get(keyFor(options.unitIndex, options.slideIndex)) || null;
      }

      const annotations = SlideReviewShared.createSlideReviewAnnotations({
        buildPromptText(comments) {
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
          ordered.forEach((comment, index) => {
            const unit = reportData.units[comment.unitIndex];
            const slide = unit && unit.slides[comment.slideIndex];
            if (!unit || !slide) return;
            const diffNote = slide.visualDiffPercent ? " (visual diff " + slide.visualDiffPercent + ")" : "";
            lines.push((index + 1) + ". " + tick + unit.route + tick + " slide " + (slide.index + 1) + " " + tick + slide.heading + tick + " " + slide.hash + diffNote + " — " + comment.region + ", " + comment.band + ", " + comment.theme + " mode");
            lines.push("   Source: " + tick + unit.currentMarkdownPath + tick);
            lines.push("   Comment:");
            comment.text.split(/\\r?\\n/).forEach((line) => { lines.push("     " + line); });
          });
          lines.push("");
          lines.push("Outcome: fix each issue; regenerate parity report when done.");
          return lines.join("\\n");
        },
        clearConfirmText: "Clear all comments? This cannot be undone.",
        commentStorageKey,
        copySuccessText: "Copied.",
        createComment(options, text, themeLabel, utils) {
          return {
            band: options.band,
            createdAt: Date.now(),
            id: utils.createCommentId(),
            region: options.region,
            slideIndex: options.slideIndex,
            text,
            theme: themeLabel,
            unitIndex: options.unitIndex,
            xPercent: options.xPercent,
            yPercent: options.yPercent,
          };
        },
        getEditorCopy(options, utils) {
          const unit = reportData.units[options.unitIndex];
          const slide = unit && unit.slides[options.slideIndex];
          if (!unit || !slide) {
            return null;
          }

          return {
            meta:
              slide.heading +
              " " +
              slide.hash +
              " • " +
              utils.formatPercent(options.xPercent) +
              " from left, " +
              utils.formatPercent(options.yPercent) +
              " from top",
            title: unit.title + " — Slide " + (slide.index + 1),
          };
        },
        getEditorHost(options) {
          return getCommentHost(options);
        },
        getThemeLabel() {
          return getThemeLabel();
        },
        onEscape(event) {
          if (!modal.classList.contains("open")) {
            return;
          }
          event.preventDefault();
          closeModalFn();
        },
        primaryActionLabel: "Generate prompt",
        renderMarkers({ comments, createMarkerButton, openExistingComment }) {
          markerLayerMap.forEach((layer) => { if (layer) layer.textContent = ""; });
          modalMarkerLayer.textContent = "";

          comments.forEach((comment, index) => {
            const key = keyFor(comment.unitIndex, comment.slideIndex);
            const panel = afterPanelMap.get(key);
            const layer = markerLayerMap.get(key);

            if (panel && layer) {
              layer.appendChild(
                createMarkerButton(comment, index, (event) => {
                  event.stopPropagation();
                  openAfterModal(panel, comment.id);
                })
              );
            }

            if (
              modalState &&
              modalState.kind === "after" &&
              modalState.unitIndex === comment.unitIndex &&
              modalState.slideIndex === comment.slideIndex &&
              !modalMarkerLayer.hidden
            ) {
              modalMarkerLayer.appendChild(
                createMarkerButton(comment, index, (event) => {
                  event.stopPropagation();
                  openExistingComment(comment.id);
                })
              );
            }
          });
        },
      });

      function whenModalImageReady(callback) {
        if (modalImg.complete && modalImg.naturalWidth > 0) {
          callback();
          return;
        }
        modalImg.addEventListener("load", callback, { once: true });
      }

      function syncModalView() {
        if (!modalState) return;
        const isAfter = modalState.kind === "after";
        modalLabel.textContent = modalState.sourceEl.dataset.modalLabel || "";
        modalHint.textContent = isAfter ? "Click the enlarged image to leave feedback." : "";
        modalImageShell.classList.toggle("commentable", isAfter);
        modalMarkerLayer.hidden = !isAfter;
        updateModalImageForTheme(isDark());
        annotations.renderMarkers();
      }

      function openBeforeModal(button) {
        if (!annotations.closeEditor("switch")) return;
        modalState = { kind: "before", sourceEl: button };
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        syncModalView();
      }

      function openAfterModal(panel, focusCommentId = null) {
        if (!annotations.closeEditor("switch")) return;
        modalState = {
          kind: "after",
          sourceEl: panel,
          slideIndex: Number(panel.dataset.slideIndex),
          unitIndex: Number(panel.dataset.unitIndex),
        };
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        syncModalView();

        if (focusCommentId) {
          whenModalImageReady(() => {
            if (!modalState || modalState.kind !== "after") return;
            annotations.openExistingComment(focusCommentId);
          });
        }
      }

      function closeModalFn(reason = "cancel") {
        if (annotations.isEditorInHost(modalImageShell) && !annotations.closeEditor(reason)) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        modalImg.removeAttribute("src");
        modalHint.textContent = "";
        modalState = null;
        annotations.renderMarkers();
      }

      themeToggle.addEventListener("click", () => {
        applyTheme(!isDark());
        updateImagesForTheme(isDark());
      });
      try {
        const saved = localStorage.getItem("isDarkMode");
        applyTheme(saved !== null ? JSON.parse(saved) === true : false);
        updateImagesForTheme(isDark());
      } catch (_) {
        applyTheme(false);
      }

      document.querySelectorAll(".before-panel").forEach((button) => {
        button.addEventListener("click", () => {
          openBeforeModal(button);
        });
      });

      document.querySelectorAll(".after-panel").forEach((panel) => {
        panel.addEventListener("click", (event) => {
          if (event.target.closest(".comment-marker")) return;
          openAfterModal(panel);
        });
        panel.addEventListener("keydown", (event) => {
          if (event.target !== panel) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          openAfterModal(panel);
        });
      });

      modalImageShell.addEventListener("click", (event) => {
        if (!modalState || modalState.kind !== "after") return;
        if (event.target.closest(".annotation-editor") || event.target.closest(".comment-marker")) return;
        const rect = modalImageShell.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = SlideReviewShared.clamp(event.clientX - rect.left, 0, rect.width);
        const y = SlideReviewShared.clamp(event.clientY - rect.top, 0, rect.height);
        const xPercent = SlideReviewShared.roundToTenths((x / rect.width) * 100);
        const yPercent = SlideReviewShared.roundToTenths((y / rect.height) * 100);
        annotations.openCommentEditor({
          anchorX: x,
          anchorY: y,
          band: SlideReviewShared.describeBand(yPercent),
          commentId: null,
          region: SlideReviewShared.describeRegion(xPercent, yPercent),
          slideIndex: modalState.slideIndex,
          text: "",
          theme: getThemeLabel(),
          unitIndex: modalState.unitIndex,
          xPercent,
          yPercent,
        });
      });

      modalImg.addEventListener("load", () => {
        annotations.renderMarkers();
        annotations.repositionEditor();
      });

      window.addEventListener("resize", () => {
        annotations.repositionEditor();
      });

      modalClose.addEventListener("click", () => { closeModalFn(); });
      modal.addEventListener("click", (event) => { if (event.target === modal) closeModalFn(); });

      annotations.init();
    </script>
  </body>
</html>
`;

  return writeFile(outputPath, html.replace(/[ \t]+$/gm, ""));
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
