#!/usr/bin/env bun

import { createWriteStream } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
    changedPixels: number;
    currentPath: string | null;
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
        changedPixels: 0,
        currentPath: null,
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
      changedPixels: diff.changedPixels,
      currentPath: path.relative(outputDir, currentShot),
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
}

async function writeReport(outputPath: string, report: unknown): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
}

function renderImagePanel(
  label: string,
  imagePath: string | null,
  emptyMessage: string
): string {
  if (!imagePath) {
    return `
      <div class="image-panel">
        <div class="image-placeholder">${escapeHtml(emptyMessage)}</div>
        <p class="image-label">${escapeHtml(label)}</p>
      </div>
    `;
  }

  return `
    <figure class="image-panel">
      <button
        class="image-button"
        type="button"
        data-lightbox-label="${escapeHtml(label)}"
        data-lightbox-src="${escapeHtml(imagePath)}"
      >
        <img loading="lazy" src="${escapeHtml(imagePath)}" alt="${escapeHtml(label)}" />
      </button>
      <figcaption class="image-label">${escapeHtml(label)}</figcaption>
    </figure>
  `;
}

function renderManifestDiffs(diffs: string[]): string {
  if (!diffs.length) {
    return `<p class="manifest-empty">No structural mismatches on this slide.</p>`;
  }

  return `
    <ul class="diff-list">
      ${diffs.map((diff) => `<li>${escapeHtml(diff)}</li>`).join("\n")}
    </ul>
  `;
}

function renderSlideCard(slide: SlideComparison): string {
  const heading = slide.current?.heading ?? slide.baseline?.heading ?? "Untitled slide";
  const visual = slide.visual;
  const hasManifestMismatch = slide.diffs.length > 0;
  const hasVisualMismatch = Boolean(visual && !visual.withinThreshold);
  const isMismatch = hasManifestMismatch || hasVisualMismatch;
  const cardClasses = [
    "slide-card",
    isMismatch ? "is-mismatch" : "is-clean",
    hasManifestMismatch ? "has-manifest" : "",
    hasVisualMismatch ? "has-visual" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const summaryBits = [
    hasManifestMismatch ? `<span class="badge badge-manifest">Manifest mismatch</span>` : "",
    hasVisualMismatch ? `<span class="badge badge-visual">Visual mismatch</span>` : "",
    !isMismatch ? `<span class="badge badge-clean">Matches</span>` : "",
    visual?.diffRatio !== null && visual?.diffRatio !== undefined
      ? `<span class="metric">Diff ratio ${escapeHtml(formatPercent(visual.diffRatio))}</span>`
      : "",
    visual?.changedPixels
      ? `<span class="metric">${escapeHtml(visual.changedPixels.toLocaleString())} changed pixels</span>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const sizeMismatchMarkup = visual?.sizeMismatch
    ? `
      <p class="size-warning">
        Screenshot size mismatch: ${escapeHtml(
          `${visual.sizeMismatch.baseline.width}x${visual.sizeMismatch.baseline.height}`
        )} baseline vs ${escapeHtml(
          `${visual.sizeMismatch.current.width}x${visual.sizeMismatch.current.height}`
        )} current.
      </p>
    `
    : "";

  const baselinePanel = renderImagePanel(
    "Baseline",
    visual?.baselinePath ?? null,
    "No baseline screenshot"
  );
  const currentPanel = renderImagePanel(
    "Current",
    visual?.currentPath ?? null,
    "No current screenshot"
  );
  const diffPanel = renderImagePanel(
    "Diff",
    visual?.diffPath ?? null,
    "No diff image generated"
  );
  const diffDisclosure = `
    <details class="diff-details">
      <summary>Show diff image</summary>
      <div class="diff-panel-wrap">
        ${diffPanel}
      </div>
    </details>
  `;

  return `
    <details class="${cardClasses}" ${isMismatch ? "open" : ""}>
      <summary>
        <span class="slide-title">Slide ${escapeHtml(String(slide.index + 1))}: ${escapeHtml(heading)}</span>
        <span class="summary-meta">${summaryBits}</span>
      </summary>
      <div class="slide-body">
        <section class="manifest-block">
          <h4>Structural parity</h4>
          ${renderManifestDiffs(slide.diffs)}
        </section>
        <section class="visual-block">
          <div class="visual-header">
            <h4>Visual parity</h4>
            <p class="visual-copy">Click an image to inspect it in place and toggle between baseline and current.</p>
          </div>
          ${sizeMismatchMarkup}
          <div class="image-grid">
            ${baselinePanel}
            ${currentPanel}
          </div>
          ${diffDisclosure}
        </section>
      </div>
    </details>
  `;
}

function writeHtmlReport(outputPath: string, report: ParityReport): Promise<void> {
  const unitSummaries = report.units
    .map((unit) => {
      const summary = summariseDeckComparisons(unit.slides);
      return {
        ...unit,
        summary,
      };
    });

  const totals = unitSummaries.reduce(
    (aggregate, unit) => {
      aggregate.slideCount += unit.slides.length;
      aggregate.manifestMismatchCount += unit.summary.manifestMismatchCount;
      aggregate.visualMismatchCount += unit.summary.visualMismatchCount;
      return aggregate;
    },
    {
      manifestMismatchCount: 0,
      slideCount: 0,
      visualMismatchCount: 0,
    }
  );

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Slide Parity Report</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4efe6;
        --surface: #fffdf8;
        --surface-strong: #fff8ef;
        --text: #1d1b18;
        --muted: #6f685f;
        --border: #dfd4c5;
        --accent: #14532d;
        --accent-soft: #dff5e7;
        --warning: #b45309;
        --warning-soft: #fff2df;
        --danger: #9f1239;
        --danger-soft: #ffe4ea;
        --shadow: 0 18px 40px rgba(29, 27, 24, 0.08);
        --radius: 18px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
        background:
          radial-gradient(circle at top left, rgba(20, 83, 45, 0.08), transparent 30%),
          linear-gradient(180deg, #f7f1e7 0%, var(--bg) 100%);
        color: var(--text);
      }

      main {
        width: min(1500px, calc(100% - 48px));
        margin: 0 auto;
        padding: 40px 0 64px;
      }

      .hero,
      .unit-section,
      .summary-card {
        background: color-mix(in srgb, var(--surface) 92%, white 8%);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
      }

      .hero {
        padding: 28px 32px;
        margin-bottom: 28px;
      }

      .eyebrow {
        margin: 0 0 12px;
        font-size: 0.8rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--accent);
      }

      h1,
      h2,
      h3,
      h4,
      p {
        margin: 0;
      }

      .hero h1 {
        font-size: clamp(2rem, 4vw, 3.5rem);
        line-height: 0.95;
        margin-bottom: 14px;
      }

      .hero p {
        max-width: 70ch;
        line-height: 1.5;
        color: var(--muted);
      }

      .meta-grid,
      .summary-grid {
        display: grid;
        gap: 16px;
      }

      .meta-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        margin-top: 22px;
      }

      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-bottom: 28px;
      }

      .summary-card {
        padding: 18px 20px;
      }

      .summary-label {
        display: block;
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 10px;
      }

      .summary-value {
        font-size: clamp(1.4rem, 3vw, 2.4rem);
        line-height: 1;
      }

      .controls {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 22px;
      }

      .toggle {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 999px;
        background: var(--surface-strong);
        border: 1px solid var(--border);
        font-size: 0.95rem;
      }

      .unit-section {
        padding: 22px 22px 16px;
        margin-bottom: 24px;
      }

      .unit-header {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 18px;
      }

      .unit-title {
        display: grid;
        gap: 8px;
      }

      .unit-route {
        font-family: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, monospace;
        color: var(--muted);
        font-size: 0.92rem;
      }

      .unit-stats {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .chip,
      .badge,
      .metric {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        padding: 7px 10px;
        font-size: 0.82rem;
        border: 1px solid transparent;
        white-space: nowrap;
      }

      .chip {
        background: var(--surface-strong);
        border-color: var(--border);
      }

      .badge-manifest {
        color: var(--warning);
        background: var(--warning-soft);
        border-color: color-mix(in srgb, var(--warning) 15%, white 85%);
      }

      .badge-visual {
        color: var(--danger);
        background: var(--danger-soft);
        border-color: color-mix(in srgb, var(--danger) 15%, white 85%);
      }

      .badge-clean {
        color: var(--accent);
        background: var(--accent-soft);
        border-color: color-mix(in srgb, var(--accent) 15%, white 85%);
      }

      .metric {
        color: var(--muted);
        background: rgba(255, 255, 255, 0.78);
        border-color: var(--border);
      }

      .slides-list {
        display: grid;
        gap: 14px;
      }

      .slide-card {
        border: 1px solid var(--border);
        border-radius: 16px;
        background: rgba(255, 253, 248, 0.85);
        overflow: hidden;
      }

      .slide-card summary {
        list-style: none;
        cursor: pointer;
        padding: 16px 18px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }

      .slide-card summary::-webkit-details-marker {
        display: none;
      }

      .slide-title {
        font-weight: 700;
        font-size: 1.02rem;
      }

      .summary-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .slide-body {
        padding: 0 18px 18px;
        display: grid;
        gap: 18px;
      }

      .manifest-block,
      .visual-block {
        padding: 16px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid var(--border);
      }

      .manifest-block h4,
      .visual-header h4 {
        margin-bottom: 10px;
      }

      .visual-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: baseline;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }

      .visual-copy,
      .manifest-empty,
      .size-warning {
        color: var(--muted);
        line-height: 1.45;
      }

      .diff-list {
        margin: 0;
        padding-left: 20px;
        display: grid;
        gap: 8px;
      }

      .image-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }

      .image-panel {
        margin: 0;
        display: grid;
        gap: 10px;
      }

      .image-button,
      .image-placeholder {
        display: block;
        border-radius: 12px;
        border: 1px solid var(--border);
        overflow: hidden;
        background: #f3ede3;
      }

      .image-button {
        padding: 0;
        cursor: zoom-in;
      }

      .image-panel img {
        width: 100%;
        display: block;
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }

      .image-placeholder {
        min-height: 180px;
        display: grid;
        place-items: center;
        padding: 16px;
        text-align: center;
        color: var(--muted);
      }

      .image-label {
        font-size: 0.88rem;
        color: var(--muted);
        text-align: center;
      }

      .diff-details {
        margin-top: 14px;
        border-top: 1px solid var(--border);
        padding-top: 14px;
      }

      .diff-details summary {
        cursor: pointer;
        color: var(--muted);
        font-size: 0.95rem;
      }

      .diff-panel-wrap {
        margin-top: 12px;
        max-width: 420px;
      }

      .is-mismatch {
        border-color: color-mix(in srgb, var(--danger) 20%, var(--border) 80%);
      }

      .mismatch-only .slide-card.is-clean {
        display: none;
      }

      .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(19, 15, 10, 0.7);
        backdrop-filter: blur(10px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 28px;
        z-index: 999;
      }

      .lightbox.is-open {
        display: flex;
      }

      .lightbox-dialog {
        width: min(1500px, 100%);
        max-height: calc(100vh - 56px);
        overflow: auto;
        background: rgba(255, 252, 246, 0.98);
        border: 1px solid rgba(223, 212, 197, 0.9);
        border-radius: 24px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
        padding: 20px;
      }

      .lightbox-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .lightbox-title {
        display: grid;
        gap: 6px;
      }

      .lightbox-title strong {
        font-size: 1.1rem;
      }

      .lightbox-subtitle {
        color: var(--muted);
        font-size: 0.92rem;
      }

      .lightbox-controls {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }

      .lightbox-tabs {
        display: inline-flex;
        gap: 8px;
        padding: 6px;
        border-radius: 999px;
        background: var(--surface-strong);
        border: 1px solid var(--border);
      }

      .lightbox-tab,
      .lightbox-close {
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.8);
        color: var(--text);
        border-radius: 999px;
        padding: 10px 14px;
        font: inherit;
      }

      .lightbox-tab {
        cursor: pointer;
      }

      .lightbox-tab[data-target="diff"] {
        opacity: 0.68;
      }

      .lightbox-tab.is-active {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
        opacity: 1;
      }

      .lightbox-close {
        cursor: pointer;
      }

      .lightbox-stage {
        border-radius: 18px;
        border: 1px solid var(--border);
        background:
          linear-gradient(180deg, rgba(247, 241, 231, 0.95), rgba(244, 239, 230, 0.95));
        padding: 16px;
      }

      .lightbox-stage img {
        width: 100%;
        height: auto;
        display: none;
        border-radius: 12px;
        background: white;
      }

      .lightbox-stage img.is-visible {
        display: block;
      }

      @media (max-width: 900px) {
        main {
          width: min(100% - 24px, 1500px);
          padding-top: 24px;
        }

        .hero,
        .unit-section {
          padding-left: 18px;
          padding-right: 18px;
        }

        .slide-card summary {
          flex-direction: column;
        }

        .summary-meta {
          justify-content: flex-start;
        }
      }
    </style>
  </head>
  <body class="mismatch-only">
    <main>
      <section class="hero">
        <p class="eyebrow">Slide parity report</p>
        <h1>Review baseline vs current decks in one place</h1>
        <p>
          This report combines structural parity checks with side-by-side screenshots for each slide.
          Use it to decide whether a migration kept the old deck intact enough, or whether a visual change
          is intentional and worth keeping.
        </p>
        <div class="meta-grid">
          <article class="summary-card">
            <span class="summary-label">Generated</span>
            <span class="summary-value">${escapeHtml(report.generatedAt)}</span>
          </article>
          <article class="summary-card">
            <span class="summary-label">Base ref</span>
            <span class="summary-value">${escapeHtml(report.baseRef)}</span>
          </article>
          <article class="summary-card">
            <span class="summary-label">Visual threshold</span>
            <span class="summary-value">${escapeHtml(formatPercent(report.visualThreshold))}</span>
          </article>
        </div>
        <div class="controls">
          <label class="toggle">
            <input id="mismatch-toggle" type="checkbox" checked />
            Show mismatches only
          </label>
        </div>
      </section>

      <section class="summary-grid">
        <article class="summary-card">
          <span class="summary-label">Units</span>
          <span class="summary-value">${escapeHtml(String(unitSummaries.length))}</span>
        </article>
        <article class="summary-card">
          <span class="summary-label">Slides reviewed</span>
          <span class="summary-value">${escapeHtml(String(totals.slideCount))}</span>
        </article>
        <article class="summary-card">
          <span class="summary-label">Structural mismatches</span>
          <span class="summary-value">${escapeHtml(String(totals.manifestMismatchCount))}</span>
        </article>
        <article class="summary-card">
          <span class="summary-label">Visual mismatches</span>
          <span class="summary-value">${escapeHtml(String(totals.visualMismatchCount))}</span>
        </article>
      </section>

      ${unitSummaries
        .map((unit) => {
          const mismatchCount =
            unit.summary.manifestMismatchCount + unit.summary.visualMismatchCount;
          return `
            <section class="unit-section">
              <div class="unit-header">
                <div class="unit-title">
                  <p class="eyebrow">Unit review</p>
                  <h2>${escapeHtml(unit.title)}</h2>
                  <p class="unit-route">${escapeHtml(unit.route)} - ${escapeHtml(
                    unit.currentMarkdownPath
                  )}</p>
                </div>
                <div class="unit-stats">
                  <span class="chip">${escapeHtml(String(unit.slides.length))} slides</span>
                  <span class="chip">${escapeHtml(
                    String(unit.summary.manifestMismatchCount)
                  )} structural mismatches</span>
                  <span class="chip">${escapeHtml(
                    String(unit.summary.visualMismatchCount)
                  )} visual mismatches</span>
                  <span class="chip">${escapeHtml(String(mismatchCount))} total flags</span>
                </div>
              </div>
              <div class="slides-list">
                ${unit.slides.map((slide) => renderSlideCard(slide)).join("\n")}
              </div>
            </section>
          `;
        })
        .join("\n")}
    </main>
    <div class="lightbox" id="lightbox" aria-hidden="true">
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-heading">
        <div class="lightbox-header">
          <div class="lightbox-title">
            <strong id="lightbox-heading">Slide image</strong>
            <span class="lightbox-subtitle" id="lightbox-subtitle">Select baseline, current, or diff.</span>
          </div>
          <div class="lightbox-controls">
            <div class="lightbox-tabs" id="lightbox-tabs">
              <button class="lightbox-tab" type="button" data-target="baseline">Baseline</button>
              <button class="lightbox-tab" type="button" data-target="current">Current</button>
              <button class="lightbox-tab" type="button" data-target="diff">Diff</button>
            </div>
            <button class="lightbox-close" id="lightbox-close" type="button">Close</button>
          </div>
        </div>
        <div class="lightbox-stage">
          <img id="lightbox-image-baseline" alt="Baseline slide screenshot" />
          <img id="lightbox-image-current" alt="Current slide screenshot" />
          <img id="lightbox-image-diff" alt="Slide diff screenshot" />
        </div>
      </div>
    </div>
    <script>
      const checkbox = document.getElementById("mismatch-toggle");
      if (checkbox) {
        checkbox.addEventListener("change", () => {
          document.body.classList.toggle("mismatch-only", checkbox.checked);
        });
      }

      const lightbox = document.getElementById("lightbox");
      const lightboxHeading = document.getElementById("lightbox-heading");
      const lightboxSubtitle = document.getElementById("lightbox-subtitle");
      const lightboxClose = document.getElementById("lightbox-close");
      const lightboxTabs = Array.from(document.querySelectorAll(".lightbox-tab"));
      const lightboxImages = {
        baseline: document.getElementById("lightbox-image-baseline"),
        current: document.getElementById("lightbox-image-current"),
        diff: document.getElementById("lightbox-image-diff"),
      };
      let activeLightboxTarget = "baseline";

      function showLightboxTarget(target) {
        activeLightboxTarget = target;
        lightboxTabs.forEach((tab) => {
          tab.classList.toggle("is-active", tab.dataset.target === target);
        });

        Object.entries(lightboxImages).forEach(([key, image]) => {
          if (!image) return;
          image.classList.toggle("is-visible", key === target);
        });
      }

      function openLightbox(button) {
        const panel = button.closest(".visual-block");
        if (!panel) return;

        const buttons = Array.from(panel.querySelectorAll(".image-button"));
        const sources = {
          baseline: null,
          current: null,
          diff: null,
        };

        buttons.forEach((entry) => {
          const label = (entry.dataset.lightboxLabel || "").toLowerCase();
          if (label === "baseline" || label === "current" || label === "diff") {
            sources[label] = entry.dataset.lightboxSrc || null;
          }
        });

        const startingLabel = (button.dataset.lightboxLabel || "Baseline").trim();
        const startingTarget = startingLabel.toLowerCase();

        Object.entries(lightboxImages).forEach(([key, image]) => {
          if (!image) return;
          const source = sources[key];
          if (source) {
            image.src = source;
            image.style.display = "";
          } else {
            image.removeAttribute("src");
            image.style.display = "none";
          }
        });

        lightboxHeading.textContent = startingLabel;
        lightboxSubtitle.textContent = "Toggle between baseline and current in place. Diff is available if you need it.";
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        const fallbackTarget = sources[startingTarget]
          ? startingTarget
          : (sources.baseline && "baseline") ||
            (sources.current && "current") ||
            (sources.diff && "diff") ||
            "baseline";
        showLightboxTarget(fallbackTarget);
      }

      function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
      }

      document.querySelectorAll(".image-button").forEach((button) => {
        button.addEventListener("click", () => openLightbox(button));
      });

      lightboxTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          showLightboxTarget(tab.dataset.target || "baseline");
        });
      });

      lightboxClose?.addEventListener("click", closeLightbox);
      lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) {
          closeLightbox();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
          closeLightbox();
        }
        if (!lightbox.classList.contains("is-open")) {
          return;
        }
        if (event.key === "ArrowLeft") {
          const order = ["baseline", "current", "diff"];
          const currentIndex = order.indexOf(activeLightboxTarget);
          const nextIndex = (currentIndex + order.length - 1) % order.length;
          showLightboxTarget(order[nextIndex]);
        }
        if (event.key === "ArrowRight") {
          const order = ["baseline", "current", "diff"];
          const currentIndex = order.indexOf(activeLightboxTarget);
          const nextIndex = (currentIndex + 1) % order.length;
          showLightboxTarget(order[nextIndex]);
        }
      });
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
    await writeHtmlReport(path.join(outputDir, "report.html"), report);

    console.log(`\nReport written to ${path.relative(ROOT_DIR, outputDir)}/report.json`);
    console.log(`HTML report written to ${path.relative(ROOT_DIR, outputDir)}/report.html`);
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
