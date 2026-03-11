import { APIErrorCode } from "@notionhq/client";
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

import { blocksToRevealMd } from "../src/lib/blocks-to-reveal-md";
import { extractPageId, fetchBlocks, fetchPage, mapNotionErrorCode } from "../src/lib/notion";

interface CliArgs {
  url?: string;
  track?: string;
  unit?: string;
  dryRun: boolean;
  overwrite: boolean;
}

const VALID_SEGMENT = /^[a-zA-Z0-9_-]+$/;
const MAX_RATE_LIMIT_RETRIES = 3;
const RATE_LIMIT_WAIT_MS = 2_000;
const CURRICULUM_TRACK_PATTERN = /^track_/;
const CURRICULUM_UNIT_PATTERN = /^unit_[a-zA-Z0-9]+$/;

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    dryRun: false,
    overwrite: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];

    if (current === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (current === "--overwrite") {
      args.overwrite = true;
      continue;
    }

    if ((current === "--url" || current === "--track" || current === "--unit") && argv[i + 1]) {
      const value = argv[i + 1];
      if (current === "--url") {
        args.url = value;
      }
      if (current === "--track") {
        args.track = value;
      }
      if (current === "--unit") {
        args.unit = value;
      }
      i += 1;
    }
  }

  return args;
}

function printUsage(): void {
  console.error(
    "Usage: npx tsx scripts/notion-to-md.ts --url <notion-url-or-id> --track <track> --unit <unit> [--dry-run] [--overwrite]",
  );
}

function resolveMarkdownFilename(track: string, unit: string, suggestedFilename: string): string {
  if (CURRICULUM_TRACK_PATTERN.test(track) && CURRICULUM_UNIT_PATTERN.test(unit)) {
    return `${unit}.md`;
  }

  return suggestedFilename;
}

function normalizeRawPageId(value: string): string | null {
  const compact = value.trim().replace(/-/g, "");
  if (!/^[a-f0-9]{32}$/i.test(compact)) {
    return null;
  }

  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join("-");
}

function parsePageId(value: string): string {
  try {
    return extractPageId(value);
  } catch {
    const rawPageId = normalizeRawPageId(value);
    if (rawPageId) {
      return rawPageId;
    }

    throw new Error("INVALID_URL");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withRateLimitRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RATE_LIMIT_RETRIES; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const errorCode = mapNotionErrorCode(error);

      if (errorCode !== APIErrorCode.RateLimited || attempt === MAX_RATE_LIMIT_RETRIES) {
        break;
      }

      await sleep(RATE_LIMIT_WAIT_MS);
    }
  }

  throw lastError;
}

function formatError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  const code = mapNotionErrorCode(error);
  if (code) {
    return code;
  }

  return "Unknown error";
}

function isAuthError(error: unknown): boolean {
  const code = mapNotionErrorCode(error);
  return code === APIErrorCode.Unauthorized;
}

function isNotFoundOrNoAccess(error: unknown): boolean {
  const code = mapNotionErrorCode(error);
  return (
    code === APIErrorCode.ObjectNotFound ||
    code === APIErrorCode.RestrictedResource ||
    code === APIErrorCode.Unauthorized
  );
}

async function confirmOverwrite(relativePath: string): Promise<boolean> {
  console.log(`⚠️   File already exists: ${relativePath}`);
  const rl = createInterface({ input, output });

  try {
    const answer = await rl.question("    Overwrite? [y/N]: ");
    return answer.trim() === "y" || answer.trim() === "Y";
  } finally {
    rl.close();
  }
}

async function downloadImage(url: string, targetPath: string): Promise<number> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);

  return Math.max(1, Math.round(buffer.byteLength / 1024));
}

async function main(): Promise<void> {
  config();

  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) {
    console.error("❌  NOTION_TOKEN not found. Add it to .env:");
    console.error("    NOTION_TOKEN=ntn_your_token_here");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));

  if (!args.url || !args.track || !args.unit) {
    printUsage();
    process.exit(1);
  }

  if (!VALID_SEGMENT.test(args.track) || !VALID_SEGMENT.test(args.unit)) {
    console.error("❌  Invalid --track or --unit. Use letters, numbers, underscores, and hyphens only.");
    process.exit(1);
  }

  let pageId: string;
  try {
    pageId = parsePageId(args.url);
  } catch {
    console.error(`❌  Invalid Notion URL or page ID: ${args.url}`);
    process.exit(1);
  }

  console.log("🔍  Fetching Notion page...");

  let pageTitle: string;
  try {
    const page = await withRateLimitRetry(() => fetchPage(pageId, token));
    pageTitle = page.title;
  } catch (error) {
    const message = formatError(error);

    if (isNotFoundOrNoAccess(error)) {
      console.error(`❌  Failed to fetch page ${pageId}: ${message}`);
    } else if (isAuthError(error)) {
      console.error(`❌  ${message}`);
    } else {
      console.error(`❌  Failed to fetch page ${pageId}: ${message}`);
    }

    process.exit(1);
  }

  console.log("📦  Fetching page blocks...");

  let blocks;
  try {
    blocks = await withRateLimitRetry(() => fetchBlocks(pageId, token));
  } catch (error) {
    const message = formatError(error);
    console.error(`❌  Failed to fetch blocks for page ${pageId}: ${message}`);
    process.exit(1);
  }

  console.log(`🧱  Converting ${blocks.length} blocks...`);

  const result = blocksToRevealMd(blocks, pageTitle, {
    track: args.track,
    unit: args.unit,
  });

  if (args.dryRun) {
    process.stdout.write(`${result.markdown}\n`);
    return;
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, "..");

  const assetsDirectory = path.join(repoRoot, "public", "assets", args.track, args.unit);
  const relativeAssetsDirectory = path.relative(repoRoot, assetsDirectory).replace(/\\/g, "/");

  const markdownDirectory = path.join(repoRoot, "public", "markdown", args.track);
  const markdownFilename = resolveMarkdownFilename(args.track, args.unit, result.suggestedFilename);
  const markdownPath = path.join(markdownDirectory, markdownFilename);
  const relativeMarkdownPath = path.relative(repoRoot, markdownPath).replace(/\\/g, "/");

  const notionHostedImages = result.imageBlocks.filter((imageBlock) => imageBlock.isNotionHosted);
  let downloadedImageCount = 0;

  if (notionHostedImages.length > 0) {
    console.log(`🖼️   Found ${notionHostedImages.length} Notion-hosted image(s) — downloading...`);
    fs.mkdirSync(assetsDirectory, { recursive: true });

    for (const imageBlock of notionHostedImages) {
      const targetPath = path.join(assetsDirectory, imageBlock.suggestedFilename);

      try {
        const sizeKb = await downloadImage(imageBlock.notionUrl, targetPath);
        console.log(`    ✅ ${imageBlock.suggestedFilename} (${sizeKb}kb)`);
        downloadedImageCount += 1;
      } catch (error) {
        console.warn(`    ⚠️  Failed to download ${imageBlock.suggestedFilename}: ${formatError(error)}`);
      }
    }
  }

  if (fs.existsSync(markdownPath) && !args.overwrite) {
    const shouldOverwrite = await confirmOverwrite(relativeMarkdownPath);
    if (!shouldOverwrite) {
      console.log("Aborted.");
      process.exit(0);
    }
  }

  try {
    fs.mkdirSync(markdownDirectory, { recursive: true });
    fs.writeFileSync(markdownPath, result.markdown, "utf8");
  } catch (error) {
    console.error(`❌  Failed to write ${relativeMarkdownPath}: ${formatError(error)}`);
    process.exit(1);
  }

  const fileId = markdownFilename.replace(/\.md$/i, "");

  console.log("✅  Done!");
  console.log(`    📄  Slides:  ${relativeMarkdownPath}`);
  console.log(`    🎨  Slides:  ${result.slideCount} horizontal slides`);

  if (downloadedImageCount > 0) {
    console.log(`    🖼️   Images:  ${downloadedImageCount} downloaded → ${relativeAssetsDirectory}`);
  }

  console.log("");
  console.log("📋  Add this to your curriculum data file:");
  console.log("──────────────────────────────────────────");
  console.log("  {");
  console.log(`    id: \"${args.unit}\",`);
  console.log(`    title: \"${pageTitle}\",`);
  console.log(`    markdownId: \"${fileId}\",`);
  console.log("  },");
  console.log("──────────────────────────────────────────");

  console.log("");
  console.log("🚀  Next steps:");

  if (downloadedImageCount > 0) {
    console.log(`    git add ${relativeMarkdownPath} ${relativeAssetsDirectory}`);
  } else {
    console.log(`    git add ${relativeMarkdownPath}`);
  }

  console.log(`    git commit -m \"Sync ${args.unit} slides from Notion\"`);
  console.log("    git push");
  console.log("    # → Live at swift-slides.vercel.app in ~30s");
}

main().catch((error) => {
  console.error(`❌  ${formatError(error)}`);
  process.exit(1);
});
