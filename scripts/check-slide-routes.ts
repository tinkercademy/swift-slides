#!/usr/bin/env bun

import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

import { chromium, type Browser, type BrowserContext } from "playwright";

import { tracks } from "../public/curriculum";
import { resolveDevServerCommand } from "./lib/dev-server";

const ROOT_DIR = process.cwd();
const DEFAULT_OUTPUT_ROOT = path.join(
  ROOT_DIR,
  "output",
  "playwright",
  "slide-route-check"
);
const DEFAULT_PORT = 3306;
const PAGE_GOTO_TIMEOUT_MS = 120_000;
const REVEAL_READY_TIMEOUT_MS = 30_000;
const WRAPPER_SLIDE_COUNT = 4;
const TRACKED_LOCAL_PATH_PREFIXES = ["/markdown/", "/assets/", "/covers/"];

type ParsedArgs = {
  failFast: boolean;
  outputDir: string;
  port: number;
  units: string[];
};

type SlideTarget = {
  markdownPath: string;
  route: string;
  slug: string;
  title: string;
};

type CapturedRequest = {
  error: string | null;
  method: string;
  resourceType: string;
  url: string;
};

type CapturedResponse = {
  resourceType: string;
  status: number;
  url: string;
};

type LocalAssetReference = {
  attr: string;
  tagName: string;
  url: string;
};

type RouteDiagnostics = {
  currentHash: string;
  hasPresentSlide: boolean;
  lessonSlideCount: number;
  localAssetUrls: LocalAssetReference[];
  presentSlideText: string | null;
  ready: boolean;
  totalSlides: number;
};

type AssetCheck = {
  method: "GET" | "HEAD";
  status: number;
  url: string;
};

type RouteResult = {
  assetChecks: AssetCheck[];
  consoleErrors: string[];
  diagnostics: RouteDiagnostics;
  durationMs: number;
  failureMessages: string[];
  htmlPath: string | null;
  markdownFailures: CapturedResponse[];
  pageErrors: string[];
  requestFailures: CapturedRequest[];
  responseFailures: CapturedResponse[];
  route: string;
  screenshotPath: string | null;
  status: "failed" | "passed";
  title: string;
  tracePath: string | null;
};

type ReportSummary = {
  failed: number;
  passed: number;
  total: number;
};

type Report = {
  generatedAt: string;
  outputDir: string;
  results: RouteResult[];
  serverLogPath: string;
  summary: ReportSummary;
};

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, milliseconds);
  });
}

function timestampSlug(value: Date): string {
  return value.toISOString().replaceAll(":", "-");
}

function relativeFromRoot(filePath: string): string {
  return path.relative(ROOT_DIR, filePath) || ".";
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    failFast: false,
    outputDir: path.join(
      DEFAULT_OUTPUT_ROOT,
      `${timestampSlug(new Date())}-${process.pid}`
    ),
    port: DEFAULT_PORT,
    units: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const nextValue = argv[index + 1];

    switch (token) {
      case "--fail-fast":
        args.failFast = true;
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
          throw new Error("--unit requires a value like track_b/unit_01");
        }
        args.units.push(nextValue);
        index += 1;
        break;
      default:
        if (token.startsWith("--")) {
          throw new Error(`Unknown argument: ${token}`);
        }
    }
  }

  if (!Number.isFinite(args.port) || args.port <= 0) {
    throw new Error(`Invalid port: ${args.port}`);
  }

  return args;
}

function resolveUnit(input: string): SlideTarget {
  const [trackId, unitKey] = input.split("/");

  if (!trackId || !unitKey) {
    throw new Error(`Invalid unit "${input}". Expected track/unit.`);
  }

  const track = tracks.find((entry) => entry.id === trackId);
  const unit = track?.units.find(
    (entry) =>
      entry.id === unitKey ||
      entry.markdownId === unitKey ||
      entry.legacyMarkdownIds?.includes(unitKey)
  );

  if (!track || !unit) {
    throw new Error(`Unable to resolve unit "${input}" from public/curriculum.ts`);
  }

  return {
    markdownPath: `/markdown/${track.id}/${unit.markdownId}.md`,
    route: `/tracks/${track.id}/${unit.id}`,
    slug: `${track.id}-${unit.id}`,
    title: unit.title,
  };
}

function resolveTargets(unitFilters: string[]): SlideTarget[] {
  if (!unitFilters.length) {
    return tracks.flatMap((track) =>
      track.units.map((unit) =>
        resolveUnit(`${track.id}/${unit.id}`)
      )
    );
  }

  return unitFilters.map((value) => resolveUnit(value));
}

function isTrackedLocalPath(pathname: string): boolean {
  return TRACKED_LOCAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function toTrackedLocalPath(value: string, baseUrl: string): string | null {
  try {
    const url = new URL(value, baseUrl);

    if (url.origin !== new URL(baseUrl).origin) {
      return null;
    }

    if (!isTrackedLocalPath(url.pathname)) {
      return null;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
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
  const devServer = resolveDevServerCommand(port);
  const child = spawn(devServer.command, devServer.args, {
    cwd: ROOT_DIR,
    stdio: ["ignore", "pipe", "pipe"],
  });

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
    }, 10_000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolvePromise();
    });
  });
}

async function collectDiagnostics(pageUrl: string, context: BrowserContext): Promise<RouteDiagnostics> {
  const page = context.pages()[0];

  return page.evaluate((currentPageUrl) => {
    const slides = Array.from(
      document.querySelectorAll<HTMLElement>(".slides > section")
    );
    const lessonSlides = Array.from(
      document.querySelectorAll<HTMLElement>(".slides section#slide-view")
    );
    const baseUrl = new URL(currentPageUrl);
    const localAssetMap = new Map<string, LocalAssetReference>();

    lessonSlides.forEach((slide) => {
      slide
        .querySelectorAll<HTMLElement>("img, source, video, audio")
        .forEach((element) => {
          const candidates = [
            { attr: "src", value: element.getAttribute("src") },
            { attr: "srcset", value: element.getAttribute("srcset") },
            { attr: "poster", value: element.getAttribute("poster") },
          ];

          candidates.forEach(({ attr, value }) => {
            if (!value) {
              return;
            }

            const entries =
              attr === "srcset"
                ? value
                    .split(",")
                    .map((entry) => entry.trim().split(/\s+/)[0] ?? "")
                    .filter(Boolean)
                : [value];

            for (const rawEntry of entries) {
              if (
                !rawEntry ||
                rawEntry.startsWith("data:") ||
                rawEntry.startsWith("blob:")
              ) {
                continue;
              }

              try {
                const resolved = new URL(rawEntry, baseUrl);

                if (resolved.origin !== baseUrl.origin) {
                  continue;
                }

                if (
                  !resolved.pathname.startsWith("/markdown/") &&
                  !resolved.pathname.startsWith("/assets/") &&
                  !resolved.pathname.startsWith("/covers/")
                ) {
                  continue;
                }

                const absoluteUrl = resolved.toString();

                if (!localAssetMap.has(absoluteUrl)) {
                  localAssetMap.set(absoluteUrl, {
                    attr,
                    tagName: element.tagName,
                    url: absoluteUrl,
                  });
                }
              } catch {
                // Ignore malformed URLs.
              }
            }
          });
        });
    });

    return {
      currentHash: window.location.hash,
      hasPresentSlide: Boolean(document.querySelector(".slides > section.present")),
      lessonSlideCount: lessonSlides.length,
      localAssetUrls: [...localAssetMap.values()],
      presentSlideText:
        document
          .querySelector(".slides > section.present")
          ?.textContent?.trim()
          .slice(0, 160) ?? null,
      ready: document.querySelector(".reveal")?.classList.contains("ready") ?? false,
      totalSlides: slides.length,
    };
  }, pageUrl);
}

async function validateAsset(url: string): Promise<AssetCheck> {
  let response = await fetch(url, { method: "HEAD" });
  let method: "GET" | "HEAD" = "HEAD";

  if (response.status === 405 || response.status === 501) {
    response = await fetch(url);
    method = "GET";
  }

  return {
    method,
    status: response.status,
    url,
  };
}

function isBenignRequestFailure(
  failure: CapturedRequest,
  successfulAssetPaths: Set<string>
): boolean {
  return (
    failure.resourceType === "media" &&
    failure.error === "net::ERR_ABORTED" &&
    (successfulAssetPaths.has(failure.url) || failure.url.startsWith("/markdown/"))
  );
}

async function runRouteCheck(
  browser: Browser,
  baseUrl: string,
  outputDir: string,
  target: SlideTarget
): Promise<RouteResult> {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
  });
  const page = await context.newPage();
  const requestFailures: CapturedRequest[] = [];
  const responseFailures: CapturedResponse[] = [];
  const markdownResponses: CapturedResponse[] = [];
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(String(error));
  });

  page.on("requestfailed", (request) => {
    const trackedPath = toTrackedLocalPath(request.url(), baseUrl);
    if (!trackedPath) {
      return;
    }

    requestFailures.push({
      error: request.failure()?.errorText ?? null,
      method: request.method(),
      resourceType: request.resourceType(),
      url: trackedPath,
    });
  });

  page.on("response", (response) => {
    const trackedPath = toTrackedLocalPath(response.url(), baseUrl);
    if (!trackedPath) {
      return;
    }

    const capturedResponse = {
      resourceType: response.request().resourceType(),
      status: response.status(),
      url: trackedPath,
    } satisfies CapturedResponse;

    if (trackedPath.endsWith(".md")) {
      markdownResponses.push(capturedResponse);
    }

    if (response.status() >= 400) {
      responseFailures.push(capturedResponse);
    }
  });

  const routeUrl = `${baseUrl}${target.route}`;
  const startedAt = Date.now();
  let htmlPath: string | null = null;
  let screenshotPath: string | null = null;
  let tracePath: string | null = null;
  let diagnostics: RouteDiagnostics = {
    currentHash: "",
    hasPresentSlide: false,
    lessonSlideCount: 0,
    localAssetUrls: [],
    presentSlideText: null,
    ready: false,
    totalSlides: 0,
  };
  let assetChecks: AssetCheck[] = [];
  const failureMessages: string[] = [];

  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    await page.goto(routeUrl, {
      timeout: PAGE_GOTO_TIMEOUT_MS,
      waitUntil: "domcontentloaded",
    });

    try {
      await page.waitForFunction(
        () => document.querySelector(".reveal.ready") !== null,
        { timeout: REVEAL_READY_TIMEOUT_MS }
      );
    } catch {
      failureMessages.push(
        `Reveal never reached a ready state within ${REVEAL_READY_TIMEOUT_MS}ms`
      );
    }

    await page.waitForTimeout(1_000);
    diagnostics = await collectDiagnostics(routeUrl, context);
    assetChecks = await Promise.all(
      diagnostics.localAssetUrls.map((asset) => validateAsset(asset.url))
    );

    const markdownFailures = markdownResponses.filter(
      (response) => response.url === target.markdownPath && response.status >= 400
    );
    const failedAssetChecks = assetChecks.filter((check) => check.status >= 400);
    const successfulAssetPaths = new Set(
      assetChecks
        .filter((check) => check.status < 400)
        .map((check) => {
          const url = new URL(check.url);
          return `${url.pathname}${url.search}`;
        })
    );
    const actionableRequestFailures = requestFailures.filter(
      (failure) => !isBenignRequestFailure(failure, successfulAssetPaths)
    );

    if (!diagnostics.ready) {
      failureMessages.push("Reveal deck did not report ready");
    }

    if (!diagnostics.hasPresentSlide) {
      failureMessages.push("No current slide was marked present");
    }

    if (diagnostics.lessonSlideCount === 0) {
      failureMessages.push("Markdown lesson slides were not rendered");
    }

    if (diagnostics.totalSlides <= WRAPPER_SLIDE_COUNT) {
      failureMessages.push(
        `Expected more than ${WRAPPER_SLIDE_COUNT} total slides after markdown parsing, received ${diagnostics.totalSlides}`
      );
    }

    if (markdownFailures.length > 0) {
      failureMessages.push(
        `Markdown request failed: ${markdownFailures
          .map((response) => `${response.url} (${response.status})`)
          .join(", ")}`
      );
    }

    if (pageErrors.length > 0) {
      failureMessages.push(
        `Page errors: ${pageErrors.join(" | ")}`
      );
    }

    if (actionableRequestFailures.length > 0) {
      failureMessages.push(
        `Network request failures: ${actionableRequestFailures
          .map((request) => request.url)
          .join(", ")}`
      );
    }

    if (responseFailures.length > 0) {
      failureMessages.push(
        `HTTP failures: ${responseFailures
          .map((response) => `${response.url} (${response.status})`)
          .join(", ")}`
      );
    }

    if (failedAssetChecks.length > 0) {
      failureMessages.push(
        `Local asset checks failed: ${failedAssetChecks
          .map((asset) => `${asset.url} (${asset.status})`)
          .join(", ")}`
      );
    }

    if (failureMessages.length > 0) {
      const failureDir = path.join(outputDir, "failures", target.slug);
      await mkdir(failureDir, { recursive: true });

      htmlPath = path.join(failureDir, "page.html");
      screenshotPath = path.join(failureDir, "deck.png");
      tracePath = path.join(failureDir, "trace.zip");

      await writeFile(htmlPath, await page.content(), "utf8");

      const revealRoot = page.locator(".reveal");
      if ((await revealRoot.count()) > 0) {
        await revealRoot.screenshot({ path: screenshotPath });
      } else {
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }
    }
  } finally {
    if (failureMessages.length > 0) {
      tracePath ??= path.join(outputDir, "failures", target.slug, "trace.zip");
      await mkdir(path.dirname(tracePath), { recursive: true });
      await context.tracing.stop({ path: tracePath });
    } else {
      await context.tracing.stop();
    }

    await context.close();
  }

  const markdownFailures = responseFailures.filter((response) =>
    response.url.endsWith(".md")
  );

  return {
    assetChecks,
    consoleErrors,
    diagnostics,
    durationMs: Date.now() - startedAt,
    failureMessages,
    htmlPath: htmlPath ? relativeFromRoot(htmlPath) : null,
    markdownFailures,
    pageErrors,
    requestFailures,
    responseFailures,
    route: target.route,
    screenshotPath: screenshotPath ? relativeFromRoot(screenshotPath) : null,
    status: failureMessages.length > 0 ? "failed" : "passed",
    title: target.title,
    tracePath: tracePath ? relativeFromRoot(tracePath) : null,
  };
}

function createReport(results: RouteResult[], outputDir: string, serverLogPath: string): Report {
  const summary = results.reduce<ReportSummary>(
    (accumulator, result) => {
      accumulator.total += 1;
      if (result.status === "passed") {
        accumulator.passed += 1;
      } else {
        accumulator.failed += 1;
      }

      return accumulator;
    },
    { failed: 0, passed: 0, total: 0 }
  );

  return {
    generatedAt: new Date().toISOString(),
    outputDir: relativeFromRoot(outputDir),
    results,
    serverLogPath: relativeFromRoot(serverLogPath),
    summary,
  };
}

function printSummary(report: Report): void {
  console.log("");
  console.log(
    `Checked ${report.summary.total} routes: ${report.summary.passed} passed, ${report.summary.failed} failed`
  );
  console.log(`Report: ${path.join(report.outputDir, "report.json")}`);

  if (report.summary.failed === 0) {
    return;
  }

  console.log("");
  console.log("Failures:");
  for (const result of report.results.filter((entry) => entry.status === "failed")) {
    console.log(`- ${result.route}: ${result.failureMessages[0] ?? "unknown failure"}`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const targets = resolveTargets(args.units);
  const outputDir = args.outputDir;
  const serverLogPath = path.join(outputDir, "server.log");

  await mkdir(outputDir, { recursive: true });

  console.log(
    `Checking ${targets.length} slide route${targets.length === 1 ? "" : "s"} on port ${args.port}`
  );

  const server = await startServer(args.port, serverLogPath);
  const browser = await chromium.launch({ headless: true });
  const baseUrl = `http://127.0.0.1:${args.port}`;
  const results: RouteResult[] = [];

  try {
    for (const target of targets) {
      console.log(`- ${target.route}`);
      const result = await runRouteCheck(browser, baseUrl, outputDir, target);
      results.push(result);

      if (result.status === "failed" && args.failFast) {
        break;
      }
    }
  } finally {
    await browser.close();
    await stopServer(server);
  }

  const report = createReport(results, outputDir, serverLogPath);
  const reportPath = path.join(outputDir, "report.json");
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  printSummary(report);

  if (report.summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
