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
import {
  renderSlideReviewAnnotationChrome,
  renderSlideReviewAnnotationRuntime,
  renderSlideReviewAnnotationStyles,
} from "./lib/slide-review-annotations";

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
  const annotationStyles = renderSlideReviewAnnotationStyles();
  const annotationChrome = renderSlideReviewAnnotationChrome({
    clearButtonTitle: "Clear all comments from this preview",
    primaryActionLabel: "Done",
    promptSubtitle: "This text is deterministic and editable before you copy it.",
  });
  const annotationRuntime = renderSlideReviewAnnotationRuntime();

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
      body.dark { background: #1a1a1a; color: #e5e5e5; }
      body.dark .tester-hint, body.dark .slide-hash { color: #a3a3a3; }
      body.dark .slide-heading { color: #d4d4d4; }
      body.dark .slide-image { background: #262626; border-color: #404040; }
      body.dark .theme-toggle { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .theme-toggle:hover { background: #333; }
${annotationStyles}
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
    ${annotationChrome}

    <script>
      const previewData = ${previewDataJson};
${annotationRuntime}
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
      const moonSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 384 512" fill="currentColor"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
      const sunSvg = '<svg aria-hidden="true" width="1.25em" height="1.25em" viewBox="0 0 512 512" fill="currentColor"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';

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

      const annotations = SlideReviewShared.createSlideReviewAnnotations({
        buildPromptText(comments) {
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
        },
        clearConfirmText: "Clear all comments from this preview? This cannot be undone.",
        commentStorageKey,
        copyFailureText: "Copy failed. Select the text manually and copy it.",
        copySuccessText: "Copied to clipboard.",
        createComment(options, text, themeLabel, utils) {
          return {
            band: options.band,
            createdAt: Date.now(),
            id: utils.createCommentId(),
            imageHeight: options.imageHeight,
            imageWidth: options.imageWidth,
            naturalX: options.naturalX,
            naturalY: options.naturalY,
            region: options.region,
            slideIndex: options.slideIndex,
            text,
            theme: themeLabel,
            xPercent: options.xPercent,
            yPercent: options.yPercent,
          };
        },
        discardDraftConfirmText: "Discard this comment draft?",
        discardExistingConfirmText: "Discard changes to this comment?",
        emptyCommentAlertText: "Add a comment first, or cancel this note.",
        getEditorCopy(options, utils) {
          const slide = slideMap.get(options.slideIndex);
          if (!slide) {
            return null;
          }

          return {
            meta:
              slide.heading +
              " • " +
              slide.hash +
              " • " +
              utils.formatPercent(options.xPercent) +
              " from left, " +
              utils.formatPercent(options.yPercent) +
              " from top",
            title: "Slide " + (slide.index + 1) + " comment",
          };
        },
        getEditorHost(options) {
          return panelMap.get(options.slideIndex) || null;
        },
        getThemeLabel() {
          return getThemeLabel();
        },
        normaliseComment(comment, utils) {
          if (!comment || typeof comment !== "object") {
            return null;
          }

          const slideIndex = Number(comment.slideIndex);
          if (!slideMap.has(slideIndex)) {
            return null;
          }

          const xPercent = utils.clamp(Number(comment.xPercent), 0, 100);
          const yPercent = utils.clamp(Number(comment.yPercent), 0, 100);
          const imageWidth = Math.max(1, Number(comment.imageWidth) || 1);
          const imageHeight = Math.max(1, Number(comment.imageHeight) || 1);
          const text = typeof comment.text === "string" ? comment.text.trim() : "";

          if (!text) {
            return null;
          }

          return {
            band: typeof comment.band === "string" ? comment.band : utils.describeBand(yPercent),
            createdAt: Number(comment.createdAt) || Date.now(),
            id:
              typeof comment.id === "string" && comment.id.length > 0
                ? comment.id
                : utils.createCommentId(),
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
                : utils.describeRegion(xPercent, yPercent),
            slideIndex,
            text,
            theme:
              comment.theme === "dark" || comment.theme === "light"
                ? comment.theme
                : "light",
            xPercent: utils.roundToTenths(xPercent),
            yPercent: utils.roundToTenths(yPercent),
          };
        },
        primaryActionLabel: "Done",
        renderMarkers({ comments, createMarkerButton, openExistingComment }) {
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

            layer.appendChild(
              createMarkerButton(comment, index, (event) => {
                event.stopPropagation();
                openExistingComment(comment.id);
              })
            );
          });
        },
      });

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
          const image = panel.querySelector(".slide-image");
          const rect = panel.getBoundingClientRect();
          const x = SlideReviewShared.clamp(event.clientX - rect.left, 0, rect.width);
          const y = SlideReviewShared.clamp(event.clientY - rect.top, 0, rect.height);
          const xPercent = rect.width === 0 ? 0 : SlideReviewShared.roundToTenths((x / rect.width) * 100);
          const yPercent = rect.height === 0 ? 0 : SlideReviewShared.roundToTenths((y / rect.height) * 100);
          const imageWidth = Math.max(1, image?.naturalWidth || previewData.captureViewport.width);
          const imageHeight = Math.max(1, image?.naturalHeight || previewData.captureViewport.height);

          annotations.openCommentEditor({
            anchorX: x,
            anchorY: y,
            band: SlideReviewShared.describeBand(yPercent),
            commentId: null,
            imageHeight,
            imageWidth,
            naturalX: Math.round((xPercent / 100) * imageWidth),
            naturalY: Math.round((yPercent / 100) * imageHeight),
            region: SlideReviewShared.describeRegion(xPercent, yPercent),
            slideIndex,
            text: "",
            theme: getThemeLabel(),
            xPercent,
            yPercent,
          });
        });
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

      annotations.init();
    </script>
  </body>
</html>
`;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html.replace(/[ \t]+$/gm, ""));
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
