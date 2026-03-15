#!/usr/bin/env bun

/**
 * Generates a single-page HTML preview of a slide deck so developers can see
 * every slide without clicking through. The preview also supports internal
 * tester annotations: click a slide, leave comments, then export a
 * deterministic agent-ready prompt that summarises the feedback.
 *
 * Usage: bun run scripts/generate-slide-preview.ts -- --unit track_a/unit_02
 *        bun run scripts/generate-slide-preview.ts -- --unit track_a/unit_02 --output output/previews/unit_02
 */

import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromium, type Browser, type Page } from "playwright";

import { tracks } from "../public/curriculum";

const ROOT_DIR = process.cwd();
const DEFAULT_OUTPUT_DIR = path.join(ROOT_DIR, "output", "playwright", "slide-preview");
const REVEAL_HORIZONTAL_OFFSET = 1;
const CAPTURE_VIEWPORT = {
  height: 1200,
  width: 1600,
};

type SlideTarget = {
  coordinate: {
    h: number;
    v: number;
  };
  hash: string;
  heading: string | null;
  index: number;
};

type SlideInfo = {
  coordinate: {
    h: number;
    v: number;
  };
  darkAbsolutePath: string | null;
  darkPath: string | null;
  hash: string;
  heading: string;
  index: number;
  lightAbsolutePath: string;
  lightPath: string;
};

type ResolvedUnit = {
  markdownPath: string;
  markdownRelativePath: string;
  route: string;
  unitTitle: string;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}

function sanitisePathPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
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

function splitSlides(markdown: string): SlideTarget[] {
  const slides: SlideTarget[] = [];
  const lines = markdown.split(/\r?\n/);
  let currentLines: string[] = [];
  let horizontalIndex = 0;
  let verticalIndex = 0;
  let fenceMarker: string | null = null;

  const pushSlide = () => {
    const content = currentLines.join("\n").trim();
    const h = horizontalIndex + REVEAL_HORIZONTAL_OFFSET;
    const v = verticalIndex;

    slides.push({
      coordinate: { h, v },
      hash: `#/${h}/${v}`,
      heading: firstHeading(content),
      index: slides.length,
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

function resolveUnit(route: string): ResolvedUnit {
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

  const markdownRelativePath = path.join(
    "public",
    "markdown",
    trackId,
    `${unit.markdownId}.md`
  );

  return {
    markdownPath: path.join(ROOT_DIR, markdownRelativePath),
    markdownRelativePath,
    route: `${trackId}/${unit.id}`,
    unitTitle: unit.title,
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
      // Ignore while the server boots.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function startServer(
  port: number,
  logPath: string
): Promise<ReturnType<typeof spawn>> {
  await mkdir(path.dirname(logPath), { recursive: true });

  const logStream = createWriteStream(logPath, { flags: "a" });
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

async function waitForVisibleSlideAssets(page: Page): Promise<void> {
  try {
    await page.waitForFunction(() => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>(".slides .present img")
      );

      return images.every((image) => image.complete);
    }, undefined, { timeout: 15_000 });
  } catch (_error) {
    // Continue even if an image is slow; the screenshot is still useful.
  }
}

async function captureSlide(page: Page, outputPath: string): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await page.locator(".reveal").screenshot({
    animations: "disabled",
    path: outputPath,
  });
}

async function runCaptures(
  browser: Browser,
  port: number,
  route: string,
  slides: SlideTarget[],
  outputDir: string
): Promise<SlideInfo[]> {
  const baseUrl = `http://127.0.0.1:${port}/tracks/${route}`;
  const slidesDir = path.join(outputDir, "slides");
  const slidesDarkDir = path.join(outputDir, "slides-dark");
  const results: SlideInfo[] = slides.map((slide) => ({
    coordinate: slide.coordinate,
    darkAbsolutePath: null,
    darkPath: null,
    hash: slide.hash,
    heading: slide.heading ?? "Untitled",
    index: slide.index,
    lightAbsolutePath: "",
    lightPath: "",
  }));

  const lightContext = await browser.newContext({
    colorScheme: "light",
    viewport: CAPTURE_VIEWPORT,
  });
  await lightContext.addInitScript(() => {
    window.localStorage.setItem("isDarkMode", "false");
  });

  const lightPage = await lightContext.newPage();

  for (const slide of slides) {
    const slideUrl = `${baseUrl}${slide.hash}`;
    const heading = slide.heading ?? "slide";
    const slug = `${String(slide.index + 1).padStart(2, "0")}-${sanitisePathPart(
      heading
    )}`;
    const lightPath = path.join(slidesDir, `${slug}.png`);

    await lightPage.goto(slideUrl, { waitUntil: "networkidle" });
    await lightPage.waitForSelector(".reveal.ready", { timeout: 60_000 });
    await waitForVisibleSlideAssets(lightPage);
    await delay(400);
    await captureSlide(lightPage, lightPath);

    results[slide.index].lightAbsolutePath = lightPath;
    results[slide.index].lightPath = path.relative(outputDir, lightPath);
  }

  await lightContext.close();

  const darkContext = await browser.newContext({
    colorScheme: "dark",
    viewport: CAPTURE_VIEWPORT,
  });
  await darkContext.addInitScript(() => {
    window.localStorage.setItem("isDarkMode", "true");
  });

  const darkPage = await darkContext.newPage();

  for (const slide of slides) {
    const slideUrl = `${baseUrl}${slide.hash}`;
    const heading = slide.heading ?? "slide";
    const slug = `${String(slide.index + 1).padStart(2, "0")}-${sanitisePathPart(
      heading
    )}`;
    const darkPath = path.join(slidesDarkDir, `${slug}.png`);

    await darkPage.goto(slideUrl, { waitUntil: "networkidle" });
    await darkPage.waitForSelector(".reveal.ready", { timeout: 60_000 });
    await darkPage.waitForSelector(".dark", { timeout: 15_000 }).catch(() => {});
    await waitForVisibleSlideAssets(darkPage);
    await delay(400);
    await captureSlide(darkPage, darkPath);

    results[slide.index].darkAbsolutePath = darkPath;
    results[slide.index].darkPath = path.relative(outputDir, darkPath);
  }

  await darkContext.close();
  return results;
}

async function writePreviewHtml(
  outputPath: string,
  unit: ResolvedUnit,
  slides: SlideInfo[]
): Promise<void> {
  const previewUrl = pathToFileURL(outputPath).href;
  const previewData = {
    captureViewport: CAPTURE_VIEWPORT,
    generatedAt: new Date().toISOString(),
    markdownPath: unit.markdownRelativePath,
    previewPath: outputPath,
    previewUrl,
    route: unit.route,
    slides: slides.map((slide) => ({
      coordinate: slide.coordinate,
      darkAbsolutePath: slide.darkAbsolutePath,
      darkPath: slide.darkPath,
      hash: slide.hash,
      heading: slide.heading,
      index: slide.index,
      lightAbsolutePath: slide.lightAbsolutePath,
      lightPath: slide.lightPath,
    })),
    totalSlides: slides.length,
    unitTitle: unit.unitTitle,
  };
  const previewDataJson = serialiseForInlineScript(previewData);

  const slidesHtml = slides
    .map(
      (slide) => `
    <section class="slide-row" data-slide-index="${slide.index}">
      <div class="slide-heading-row">
        <h2 class="slide-heading">${slide.index + 1}. ${escapeHtml(slide.heading)}</h2>
        <span class="slide-hash" title="Reveal.js slide position (horizontal/vertical index)">Reveal ${escapeHtml(slide.hash)}</span>
      </div>
      <div class="slide-panel" data-slide-index="${slide.index}" title="Click to leave tester feedback">
        <img class="slide-image" src="${escapeHtml(slide.lightPath)}" alt="Slide ${slide.index + 1}" data-src-light="${escapeHtml(slide.lightPath)}" data-src-dark="${escapeHtml(slide.darkPath ?? "")}" />
        <div class="marker-layer" data-slide-index="${slide.index}" aria-hidden="true"></div>
      </div>
    </section>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Slide Preview — ${escapeHtml(unit.unitTitle)}</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, sans-serif; background: #f5f5f5; color: #333; padding: 24px; }
      button, textarea { font: inherit; }
      .report-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 8px; }
      .report-header-main { display: grid; gap: 6px; }
      .unit-overview { margin: 0; font-size: 1.5rem; font-weight: 600; }
      .tester-hint { margin: 0; color: #666; max-width: 60rem; }
      .theme-toggle { padding: 8px; border: 1px solid #ddd; border-radius: 999px; background: #fff; cursor: pointer; color: #333; line-height: 1; }
      .theme-toggle:hover { background: #f0f0f0; }
      .slide-row { margin: 0 0 32px; }
      .slide-heading-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
      .slide-heading { margin: 0; font-size: 1rem; font-weight: 600; }
      .slide-hash { color: #666; font-size: 0.9rem; }
      .slide-panel { position: relative; width: 100%; cursor: crosshair; }
      .slide-image { display: block; width: 100%; height: auto; border-radius: 8px; border: 1px solid #eee; background: #fafafa; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
      .marker-layer { position: absolute; inset: 0; pointer-events: none; }
      .comment-marker { position: absolute; transform: translate(-50%, -50%); pointer-events: auto; width: 30px; height: 30px; border: none; border-radius: 999px; background: #2563eb; color: #fff; cursor: pointer; font-size: 0.85rem; font-weight: 700; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28); }
      .comment-marker:hover { background: #1d4ed8; }
      .annotation-editor { position: absolute; z-index: 20; width: min(340px, calc(100vw - 48px)); padding: 14px; border: 1px solid #ddd; border-radius: 12px; background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.18); display: grid; gap: 10px; }
      .annotation-editor[hidden] { display: none; }
      .annotation-editor-header { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
      .annotation-editor-title { margin: 0; font-size: 0.95rem; font-weight: 600; }
      .annotation-editor-meta { margin: 4px 0 0; color: #666; font-size: 0.82rem; }
      .annotation-editor-close { border: none; background: transparent; color: #666; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0; }
      .annotation-editor-close:hover { color: #111; }
      .annotation-editor textarea { width: 100%; min-height: 110px; padding: 10px 12px; border: 1px solid #d4d4d4; border-radius: 10px; resize: vertical; }
      .annotation-editor textarea:focus, .prompt-textarea:focus { outline: 2px solid rgba(37, 99, 235, 0.35); outline-offset: 0; border-color: #2563eb; }
      .annotation-editor-actions { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
      .button-secondary, .button-primary, .page-done, .copy-button { border: none; border-radius: 10px; cursor: pointer; padding: 10px 14px; }
      .button-secondary { background: #eee; color: #333; }
      .button-secondary:hover { background: #e0e0e0; }
      .button-primary, .page-done, .copy-button { background: #2563eb; color: #fff; }
      .button-primary:hover, .page-done:hover, .copy-button:hover { background: #1d4ed8; }
      .button-destructive { margin-right: auto; background: #fee2e2; color: #b91c1c; }
      .button-destructive:hover { background: #fecaca; }
      .page-fab-row { position: fixed; right: 24px; bottom: 24px; z-index: 40; display: flex; align-items: center; gap: 10px; }
      .page-clear { border: none; border-radius: 10px; cursor: pointer; padding: 10px 14px; background: #fee2e2; color: #b91c1c; font: inherit; }
      .page-clear:hover { background: #fecaca; }
      .page-done { box-shadow: 0 20px 30px rgba(37, 99, 235, 0.25); }
      .page-done[hidden], .page-clear[hidden] { display: none; }
      body.dark .page-clear { background: #7f1d1d; color: #fee2e2; }
      body.dark .page-clear:hover { background: #991b1b; }
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
      .prompt-textarea { width: 100%; min-height: 420px; padding: 14px 16px; border-radius: 12px; border: 1px solid #d4d4d4; resize: vertical; background: #fff; color: #111; }
      .prompt-copy-status { margin: 0; min-height: 1.2em; color: #2563eb; font-size: 0.9rem; }
      body.dark { background: #1a1a1a; color: #e5e5e5; }
      body.dark .tester-hint, body.dark .slide-hash, body.dark .annotation-editor-meta, body.dark .prompt-subtitle { color: #a3a3a3; }
      body.dark .slide-heading { color: #d4d4d4; }
      body.dark .slide-image { background: #262626; border-color: #404040; }
      body.dark .theme-toggle { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .theme-toggle:hover { background: #333; }
      body.dark .annotation-editor, body.dark .prompt-card { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .annotation-editor-close, body.dark .prompt-close { color: #a3a3a3; }
      body.dark .annotation-editor-close:hover, body.dark .prompt-close:hover { color: #fff; }
      body.dark .annotation-editor textarea, body.dark .prompt-textarea { background: #171717; color: #f5f5f5; border-color: #404040; }
      body.dark .button-secondary { background: #404040; color: #e5e5e5; }
      body.dark .button-secondary:hover { background: #525252; }
      body.dark .button-destructive { background: #7f1d1d; color: #fee2e2; }
      body.dark .button-destructive:hover { background: #991b1b; }
      body.dark .page-done, body.dark .button-primary, body.dark .copy-button { background: #3b82f6; }
      body.dark .page-done:hover, body.dark .button-primary:hover, body.dark .copy-button:hover { background: #2563eb; }
      body.dark .prompt-copy-status { color: #93c5fd; }
    </style>
  </head>
  <body>
    <div class="report-header">
      <div class="report-header-main">
        <h1 class="unit-overview">${escapeHtml(unit.unitTitle)}</h1>
        <p class="tester-hint">Click anywhere on a slide screenshot to leave internal tester feedback. Saved comments show up as numbered markers and can be edited later.</p>
      </div>
      <button type="button" id="theme-toggle" class="theme-toggle" aria-label="Switch to Dark Mode" title="Switch to Dark Mode">
        <span id="theme-icon" aria-hidden="true"></span>
      </button>
    </div>
    ${slidesHtml}
    <div class="page-fab-row">
      <button type="button" id="page-clear" class="page-clear" hidden title="Clear all comments">Clear</button>
      <button type="button" id="page-done" class="page-done" hidden>Done</button>
    </div>

    <div id="annotation-editor" class="annotation-editor" hidden>
      <div class="annotation-editor-header">
        <div>
          <p id="annotation-editor-title" class="annotation-editor-title">Slide comment</p>
          <p id="annotation-editor-meta" class="annotation-editor-meta"></p>
        </div>
        <button type="button" id="annotation-close" class="annotation-editor-close" aria-label="Cancel comment" title="Cancel comment">×</button>
      </div>
      <textarea id="annotation-text" placeholder="Describe what needs to change."></textarea>
      <div class="annotation-editor-actions">
        <button type="button" id="annotation-delete" class="button-secondary button-destructive" hidden>Delete</button>
        <button type="button" id="annotation-cancel" class="button-secondary">Cancel</button>
        <button type="button" id="annotation-save" class="button-primary">Done</button>
      </div>
    </div>

    <div id="prompt-modal" class="prompt-modal" aria-hidden="true">
      <div class="prompt-card">
        <div class="prompt-header">
          <div>
            <h2 class="prompt-title">Agent Prompt</h2>
            <p class="prompt-subtitle">This text is deterministic and editable before you copy it.</p>
          </div>
          <div class="prompt-actions">
            <button type="button" id="prompt-clear" class="button-secondary prompt-clear-btn" title="Clear all comments from this preview">Clear</button>
            <button type="button" id="prompt-copy" class="copy-button">
              <svg aria-hidden="true" viewBox="0 0 448 512" fill="currentColor"><path d="M384 336l-192 0c-35.3 0-64-28.7-64-64l0-192c0-17.7 14.3-32 32-32l140.1 0L416 163.9 416 304c0 17.7-14.3 32-32 32zM128 368c0 17.7 14.3 32 32 32l224 0c35.3 0 64-28.7 64-64l0-140.1c0-17-6.7-33.3-18.7-45.3L313.4 34.7c-12-12-28.3-18.7-45.3-18.7L160 16c-35.3 0-64 28.7-64 64l0 16-32 0c-35.3 0-64 28.7-64 64L0 384c0 61.9 50.1 112 112 112l208 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-208 0c-26.5 0-48-21.5-48-48l0-224 32 0 0 112c0 53 43 96 96 96l112 0 0 16z"/></svg>
              <span>Copy</span>
            </button>
            <button type="button" id="prompt-close" class="prompt-close" aria-label="Close prompt" title="Close prompt">×</button>
          </div>
        </div>
        <textarea id="prompt-textarea" class="prompt-textarea" spellcheck="false"></textarea>
        <p id="prompt-copy-status" class="prompt-copy-status" aria-live="polite"></p>
      </div>
    </div>

    <script>
      const previewData = ${previewDataJson};
      const commentStorageKey = "slide-preview-comments::" + previewData.route;
      const slideMap = new Map(previewData.slides.map((slide) => [slide.index, slide]));
      const panelMap = new Map(
        Array.from(document.querySelectorAll(".slide-panel")).map((panel) => [
          Number(panel.dataset.slideIndex),
          panel,
        ])
      );
      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = document.getElementById("theme-icon");
      const pageDone = document.getElementById("page-done");
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
      const moonSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 384 512" fill="currentColor"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
      const sunSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 512 512" fill="currentColor"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';
      let comments = [];
      let editorState = null;

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function roundToTenths(value) {
        return Math.round(value * 10) / 10;
      }

      function formatPercent(value) {
        return roundToTenths(value).toFixed(1) + "%";
      }

      function isDark() {
        return document.body.classList.contains("dark");
      }

      function applyTheme(dark) {
        document.body.classList.toggle("dark", dark);
        themeIcon.innerHTML = dark ? sunSvg : moonSvg;
        const label = dark ? "Switch to Light Mode" : "Switch to Dark Mode";
        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
        try {
          localStorage.setItem("isDarkMode", JSON.stringify(dark));
        } catch (_error) {}
      }

      function updateImages(dark) {
        document
          .querySelectorAll(".slide-image[data-src-light], .slide-image[data-src-dark]")
          .forEach((image) => {
            const src = dark
              ? image.dataset.srcDark || image.dataset.srcLight
              : image.dataset.srcLight || image.dataset.srcDark;

            if (src) {
              image.src = src;
            }
          });
      }

      function getThemeLabel() {
        return isDark() ? "dark" : "light";
      }

      function describeBand(yPercent) {
        if (yPercent < 20) {
          return "top band";
        }

        if (yPercent > 80) {
          return "bottom band";
        }

        return "main content area";
      }

      function describeRegion(xPercent, yPercent) {
        const horizontal =
          xPercent < 33.34 ? "left" : xPercent > 66.66 ? "right" : "centre";
        const vertical =
          yPercent < 33.34 ? "top" : yPercent > 66.66 ? "bottom" : "middle";

        if (horizontal === "centre" && vertical === "middle") {
          return "centre";
        }

        if (horizontal === "centre") {
          return vertical + "-centre";
        }

        if (vertical === "middle") {
          return "middle-" + horizontal;
        }

        return vertical + "-" + horizontal;
      }

      function loadComments() {
        try {
          const raw = localStorage.getItem(commentStorageKey);
          if (!raw) {
            return [];
          }

          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
            return [];
          }

          return parsed
            .map((comment) => normaliseComment(comment))
            .filter((comment) => Boolean(comment));
        } catch (_error) {
          return [];
        }
      }

      function normaliseComment(comment) {
        if (!comment || typeof comment !== "object") {
          return null;
        }

        const slideIndex = Number(comment.slideIndex);
        if (!slideMap.has(slideIndex)) {
          return null;
        }

        const xPercent = clamp(Number(comment.xPercent), 0, 100);
        const yPercent = clamp(Number(comment.yPercent), 0, 100);
        const imageWidth = Math.max(1, Number(comment.imageWidth) || 1);
        const imageHeight = Math.max(1, Number(comment.imageHeight) || 1);
        const text = typeof comment.text === "string" ? comment.text.trim() : "";

        if (!text) {
          return null;
        }

        return {
          band: typeof comment.band === "string" ? comment.band : describeBand(yPercent),
          createdAt: Number(comment.createdAt) || Date.now(),
          id:
            typeof comment.id === "string" && comment.id.length > 0
              ? comment.id
              : String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
          imageHeight,
          imageWidth,
          naturalX:
            Number(comment.naturalX) ||
            Math.round((xPercent / 100) * imageWidth),
          naturalY:
            Number(comment.naturalY) ||
            Math.round((yPercent / 100) * imageHeight),
          region:
            typeof comment.region === "string"
              ? comment.region
              : describeRegion(xPercent, yPercent),
          slideIndex,
          text,
          theme:
            comment.theme === "dark" || comment.theme === "light"
              ? comment.theme
              : "light",
          xPercent: roundToTenths(xPercent),
          yPercent: roundToTenths(yPercent),
        };
      }

      function persistComments() {
        try {
          localStorage.setItem(commentStorageKey, JSON.stringify(comments));
        } catch (_error) {}
      }

      function updatePageDoneButton() {
        if (comments.length === 0) {
          pageDone.hidden = true;
          pageClear.hidden = true;
          pageDone.textContent = "Done";
          return;
        }

        pageDone.hidden = false;
        pageClear.hidden = false;
        pageDone.textContent =
          "Done (" + comments.length + ")";
      }

      function renderMarkers() {
        document.querySelectorAll(".marker-layer").forEach((layer) => {
          layer.textContent = "";
        });

        comments.forEach((comment, index) => {
          const panel = panelMap.get(comment.slideIndex);
          if (!panel) {
            return;
          }

          const layer = panel.querySelector(".marker-layer");
          if (!layer) {
            return;
          }

          const marker = document.createElement("button");
          marker.type = "button";
          marker.className = "comment-marker";
          marker.textContent = String(index + 1);
          marker.style.left = comment.xPercent + "%";
          marker.style.top = comment.yPercent + "%";
          marker.title = "Comment " + (index + 1) + ": " + comment.text;
          marker.addEventListener("click", (event) => {
            event.stopPropagation();
            openExistingComment(comment.id);
          });
          layer.appendChild(marker);
        });

        updatePageDoneButton();
      }

      function getSlideClickData(panel, event) {
        const image = panel.querySelector(".slide-image");
        const rect = panel.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        const y = clamp(event.clientY - rect.top, 0, rect.height);
        const xPercent = rect.width === 0 ? 0 : roundToTenths((x / rect.width) * 100);
        const yPercent = rect.height === 0 ? 0 : roundToTenths((y / rect.height) * 100);
        const imageWidth = Math.max(1, image?.naturalWidth || previewData.captureViewport.width);
        const imageHeight = Math.max(1, image?.naturalHeight || previewData.captureViewport.height);

        return {
          anchorX: x,
          anchorY: y,
          band: describeBand(yPercent),
          imageHeight,
          imageWidth,
          naturalX: Math.round((xPercent / 100) * imageWidth),
          naturalY: Math.round((yPercent / 100) * imageHeight),
          region: describeRegion(xPercent, yPercent),
          xPercent,
          yPercent,
        };
      }

      function confirmCancelEditor() {
        if (!editorState) {
          return true;
        }

        const message = editorState.commentId
          ? "Discard changes to this comment?"
          : "Discard this comment draft?";
        return window.confirm(message);
      }

      function closeEditor(reason) {
        if (!editorState) {
          return true;
        }

        if (reason === "cancel" || reason === "switch") {
          if (!confirmCancelEditor()) {
            return false;
          }
        }

        annotationEditor.hidden = true;
        annotationEditor.style.visibility = "";
        if (annotationEditor.parentElement) {
          annotationEditor.parentElement.removeChild(annotationEditor);
        }

        editorState = null;
        annotationText.value = "";
        return true;
      }

      function positionEditor(panel, anchorX, anchorY) {
        annotationEditor.style.left = "12px";
        annotationEditor.style.top = "12px";
        annotationEditor.style.visibility = "hidden";

        requestAnimationFrame(() => {
          const margin = 12;
          const maxLeft = Math.max(
            margin,
            panel.clientWidth - annotationEditor.offsetWidth - margin
          );
          const maxTop = Math.max(
            margin,
            panel.clientHeight - annotationEditor.offsetHeight - margin
          );
          const left = clamp(anchorX + 12, margin, maxLeft);
          const top = clamp(anchorY + 12, margin, maxTop);

          annotationEditor.style.left = left + "px";
          annotationEditor.style.top = top + "px";
          annotationEditor.style.visibility = "visible";
          annotationText.focus();
        });
      }

      function openCommentEditor(options) {
        if (!closeEditor("switch")) {
          return;
        }

        const slide = slideMap.get(options.slideIndex);
        const panel = panelMap.get(options.slideIndex);

        if (!slide || !panel) {
          return;
        }

        editorState = options;
        annotationTitle.textContent =
          "Slide " + (slide.index + 1) + " comment";
        annotationMeta.textContent =
          slide.heading +
          " • " +
          slide.hash +
          " • " +
          formatPercent(options.xPercent) +
          " from left, " +
          formatPercent(options.yPercent) +
          " from top";
        annotationText.value = options.text || "";
        annotationDelete.hidden = !options.commentId;

        panel.appendChild(annotationEditor);
        annotationEditor.hidden = false;
        positionEditor(panel, options.anchorX, options.anchorY);
      }

      function openExistingComment(commentId) {
        const comment = comments.find((entry) => entry.id === commentId);
        if (!comment) {
          return;
        }

        const panel = panelMap.get(comment.slideIndex);
        if (!panel) {
          return;
        }

        openCommentEditor({
          anchorX: (comment.xPercent / 100) * panel.clientWidth,
          anchorY: (comment.yPercent / 100) * panel.clientHeight,
          band: comment.band,
          commentId: comment.id,
          imageHeight: comment.imageHeight,
          imageWidth: comment.imageWidth,
          naturalX: comment.naturalX,
          naturalY: comment.naturalY,
          region: comment.region,
          slideIndex: comment.slideIndex,
          text: comment.text,
          theme: comment.theme,
          xPercent: comment.xPercent,
          yPercent: comment.yPercent,
        });
      }

      function createCommentId() {
        return String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
      }

      function saveComment() {
        if (!editorState) {
          return;
        }

        const text = annotationText.value.trim();
        if (!text) {
          window.alert("Add a comment first, or cancel this note.");
          annotationText.focus();
          return;
        }

        if (editorState.commentId) {
          comments = comments.map((comment) =>
            comment.id === editorState.commentId
              ? { ...comment, text }
              : comment
          );
        } else {
          comments.push({
            band: editorState.band,
            createdAt: Date.now(),
            id: createCommentId(),
            imageHeight: editorState.imageHeight,
            imageWidth: editorState.imageWidth,
            naturalX: editorState.naturalX,
            naturalY: editorState.naturalY,
            region: editorState.region,
            slideIndex: editorState.slideIndex,
            text,
            theme: getThemeLabel(),
            xPercent: editorState.xPercent,
            yPercent: editorState.yPercent,
          });
        }

        persistComments();
        renderMarkers();
        closeEditor("save");
      }

      function deleteComment() {
        if (!editorState || !editorState.commentId) {
          return;
        }

        if (!window.confirm("Delete this comment?")) {
          return;
        }

        comments = comments.filter((comment) => comment.id !== editorState.commentId);
        persistComments();
        renderMarkers();
        closeEditor("delete");
      }

      function buildPromptText() {
        const orderedComments = comments.slice().sort((left, right) => left.createdAt - right.createdAt);
        const commentedSlides = new Set(orderedComments.map((comment) => comment.slideIndex));
        const lines = [];
        const tick = String.fromCharCode(96);

        lines.push("Apply internal tester feedback to this deck (deterministic; edit before copy).");
        lines.push("");
        lines.push("Unit: " + tick + previewData.route + tick + " • source: " + tick + previewData.markdownPath + tick);
        lines.push("Comments: " + orderedComments.length + " across " + commentedSlides.size + " slide" + (commentedSlides.size === 1 ? "" : "s") + ".");
        lines.push("");
        lines.push("Follow repo slide authoring rules (markdown-first, shared layouts, preserve flow). Check light and dark.");
        lines.push("");
        lines.push("Tester feedback:");

        orderedComments.forEach((comment, index) => {
          const slide = slideMap.get(comment.slideIndex);
          if (!slide) {
            return;
          }

          lines.push(
            (index + 1) +
              ". Slide " +
              (slide.index + 1) +
              " " +
              tick +
              slide.heading +
              tick +
              " (" +
              slide.hash +
              ") — " +
              comment.region +
              ", " +
              comment.band +
              ", " +
              comment.theme +
              " mode"
          );
          lines.push("   Comment:");
          comment.text.split(/\\r?\\n/).forEach((line) => {
            lines.push("     " + line);
          });
        });

        lines.push("");
        lines.push("Outcome: Update " + tick + previewData.markdownPath + tick + " (and shared styles if needed); keep unrelated content; regenerate preview when done.");

        return lines.join("\\n");
      }

      function openPromptModal() {
        promptTextarea.value = buildPromptText();
        promptCopyStatus.textContent = "";
        promptModal.classList.add("open");
        promptModal.setAttribute("aria-hidden", "false");
        promptTextarea.focus();
      }

      function closePromptModal() {
        promptModal.classList.remove("open");
        promptModal.setAttribute("aria-hidden", "true");
      }

      function clearAllComments() {
        if (!window.confirm("Clear all comments from this preview? This cannot be undone.")) {
          return;
        }
        comments = [];
        persistComments();
        renderMarkers();
        if (promptModal.classList.contains("open")) {
          closePromptModal();
        }
      }

      async function copyPrompt() {
        const value = promptTextarea.value;

        try {
          await navigator.clipboard.writeText(value);
          promptCopyStatus.textContent = "Copied to clipboard.";
        } catch (_error) {
          promptTextarea.focus();
          promptTextarea.select();
          const copied = document.execCommand("copy");
          promptCopyStatus.textContent = copied
            ? "Copied to clipboard."
            : "Copy failed. Select the text manually and copy it.";
        }
      }

      function handlePageDoneClick() {
        if (!closeEditor("switch")) {
          return;
        }

        openPromptModal();
      }

      themeToggle.addEventListener("click", () => {
        applyTheme(!isDark());
        updateImages(isDark());
      });

      Array.from(document.querySelectorAll(".slide-panel")).forEach((panel) => {
        panel.addEventListener("click", (event) => {
          if (event.target.closest(".annotation-editor") || event.target.closest(".comment-marker")) {
            return;
          }

          const slideIndex = Number(panel.dataset.slideIndex);
          const clickData = getSlideClickData(panel, event);

          openCommentEditor({
            ...clickData,
            commentId: null,
            slideIndex,
            text: "",
            theme: getThemeLabel(),
          });
        });
      });

      annotationEditor.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      annotationSave.addEventListener("click", saveComment);
      annotationCancel.addEventListener("click", () => {
        closeEditor("cancel");
      });
      annotationClose.addEventListener("click", () => {
        closeEditor("cancel");
      });
      annotationDelete.addEventListener("click", deleteComment);
      pageDone.onclick = handlePageDoneClick;
      pageDone.addEventListener("click", handlePageDoneClick);
      pageClear.addEventListener("click", clearAllComments);
      promptClear.addEventListener("click", clearAllComments);
      promptCopy.addEventListener("click", copyPrompt);
      promptClose.addEventListener("click", closePromptModal);
      promptModal.addEventListener("click", (event) => {
        if (event.target === promptModal) {
          closePromptModal();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
          return;
        }

        if (promptModal.classList.contains("open")) {
          event.preventDefault();
          closePromptModal();
          return;
        }

        if (!annotationEditor.hidden) {
          event.preventDefault();
          closeEditor("cancel");
        }
      });

      try {
        const saved = localStorage.getItem("isDarkMode");
        const dark = saved !== null ? JSON.parse(saved) === true : false;
        applyTheme(dark);
        updateImages(dark);
      } catch (_error) {
        applyTheme(false);
        updateImages(false);
      }

      comments = loadComments();
      renderMarkers();
    </script>
  </body>
</html>
`;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

function parseArgs(argv: string[]): {
  outputDir: string;
  port: number;
  unit: string;
} {
  let unit = "";
  let outputDir = DEFAULT_OUTPUT_DIR;
  let port = 3302;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--unit" && next) {
      unit = next;
      index += 1;
      continue;
    }

    if (token === "--output" && next) {
      outputDir = path.isAbsolute(next) ? next : path.join(ROOT_DIR, next);
      index += 1;
      continue;
    }

    if (token === "--port" && next) {
      port = parseInt(next, 10) || port;
      index += 1;
    }
  }

  if (!unit) {
    throw new Error("Missing --unit (e.g. track_a/unit_02)");
  }

  return { outputDir, port, unit };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const unit = resolveUnit(args.unit);
  const unitSlug = sanitisePathPart(unit.route);
  const outputDir = path.join(args.outputDir, unitSlug);
  const serverLog = path.join(outputDir, "server.log");
  const markdown = await readFile(unit.markdownPath, "utf8");
  const slides = splitSlides(markdown);

  console.log(`${unit.route} — ${unit.unitTitle}`);
  console.log(`  Slides: ${slides.length}`);
  console.log(`  Output: ${outputDir}`);

  let server: ReturnType<typeof spawn> | null = null;
  let browser: Browser | null = null;

  try {
    server = await startServer(args.port, serverLog);
    browser = await chromium.launch({ headless: true });

    const slideInfos = await runCaptures(
      browser,
      args.port,
      unit.route,
      slides,
      outputDir
    );
    const previewPath = path.join(outputDir, "preview.html");

    await writePreviewHtml(previewPath, unit, slideInfos);

    console.log(`\nPreview written to ${path.relative(ROOT_DIR, previewPath)}`);
    console.log(`Open: ${pathToFileURL(previewPath).href}`);
  } finally {
    if (browser) {
      await browser.close();
    }

    if (server) {
      await stopServer(server);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
