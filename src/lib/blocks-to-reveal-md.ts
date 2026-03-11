import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export interface ConversionResult {
  markdown: string;
  slideCount: number;
  suggestedFilename: string;
  imageBlocks: ImageBlock[];
}

export interface ImageBlock {
  blockId: string;
  notionUrl: string;
  isNotionHosted: boolean;
  suggestedFilename: string;
}

const ASSETS_FOLDER = "assets";

function extractText(richText: RichTextItemResponse[]): string {
  return richText.map((rt) => rt.plain_text).join("").trim();
}

function slugifyTitle(pageTitle: string): string {
  const slug = pageTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return slug || "untitled";
}

function buildSuggestedFilename(pageTitle: string, unit?: string): string {
  const slug = slugifyTitle(pageTitle);
  return unit ? `${unit}-${slug}.md` : `${slug}.md`;
}

function collapseBlankLines(lines: string[]): string {
  const output: string[] = [];
  let previousWasBlank = false;

  for (const line of lines) {
    const normalized = line.trim().length === 0 ? "" : line;

    if (normalized.length === 0 && previousWasBlank) {
      continue;
    }

    output.push(normalized);
    previousWasBlank = normalized.length === 0;
  }

  while (output.length > 0 && output[output.length - 1] === "") {
    output.pop();
  }

  return output.join("\n");
}

function calloutIcon(callout: { icon: { type: string; emoji?: string } | null }): string {
  if (!callout.icon) {
    return "";
  }

  if (callout.icon.type === "emoji") {
    return callout.icon.emoji ?? "";
  }

  return "";
}

function buildLocalImagePath(track: string | undefined, unit: string | undefined, filename: string): string {
  const parts = ["", ASSETS_FOLDER];

  if (track) {
    parts.push(track);
  }

  if (unit) {
    parts.push(unit);
  }

  parts.push(filename);
  return parts.join("/");
}

export function blocksToRevealMd(
  blocks: BlockObjectResponse[],
  pageTitle: string,
  options: {
    track?: string;
    unit?: string;
  } = {},
): ConversionResult {
  const lines: string[] = [`## ${pageTitle}`];
  const imageBlocks: ImageBlock[] = [];
  let imageCounter = 0;

  for (const block of blocks) {
    switch (block.type) {
      case "heading_1": {
        const text = extractText(block.heading_1.rich_text);
        if (text) {
          lines.push("---", "", `## ${text}`);
        }
        break;
      }
      case "heading_2": {
        const text = extractText(block.heading_2.rich_text);
        if (text) {
          lines.push(`### ${text}`);
        }
        break;
      }
      case "heading_3": {
        const text = extractText(block.heading_3.rich_text);
        if (text) {
          lines.push(`#### ${text}`);
        }
        break;
      }
      case "paragraph": {
        const text = extractText(block.paragraph.rich_text);
        lines.push(text);
        break;
      }
      case "bulleted_list_item": {
        const text = extractText(block.bulleted_list_item.rich_text);
        if (text) {
          lines.push(`- ${text}`);
        }
        break;
      }
      case "numbered_list_item": {
        const text = extractText(block.numbered_list_item.rich_text);
        if (text) {
          lines.push(`1. ${text}`);
        }
        break;
      }
      case "code": {
        const language = block.code.language;
        const content = extractText(block.code.rich_text);
        lines.push(`\`\`\`${language}`, content, "\`\`\`");
        break;
      }
      case "divider": {
        lines.push("---vertical---");
        break;
      }
      case "callout": {
        const text = extractText(block.callout.rich_text);
        if (text) {
          const icon = calloutIcon(block.callout);
          lines.push(icon ? `> ${icon} ${text}` : `> ${text}`);
        }
        break;
      }
      case "quote": {
        const text = extractText(block.quote.rich_text);
        if (text) {
          lines.push(`> ${text}`);
        }
        break;
      }
      case "to_do": {
        const text = extractText(block.to_do.rich_text);
        if (text) {
          lines.push(`- [${block.to_do.checked ? "x" : " "}] ${text}`);
        }
        break;
      }
      case "image": {
        imageCounter += 1;

        const suggestedFilename = `image-${String(imageCounter).padStart(3, "0")}.png`;
        const caption = extractText(block.image.caption) || "image";

        if (block.image.type === "external") {
          const notionUrl = block.image.external.url;
          lines.push(`![${caption}](${notionUrl})`);
          imageBlocks.push({
            blockId: block.id,
            notionUrl,
            isNotionHosted: false,
            suggestedFilename,
          });
        }

        if (block.image.type === "file") {
          const notionUrl = block.image.file.url;
          const isNotionHosted = notionUrl.includes("prod-files-secure.s3.amazonaws.com");
          const localPath = buildLocalImagePath(options.track, options.unit, suggestedFilename);

          lines.push(`![${caption}](${localPath})`);
          imageBlocks.push({
            blockId: block.id,
            notionUrl,
            isNotionHosted,
            suggestedFilename,
          });
        }

        break;
      }
      case "toggle": {
        const text = extractText(block.toggle.rich_text);
        if (text) {
          lines.push(text);
        }
        break;
      }
      case "child_page":
      case "embed":
      case "bookmark":
        break;
      default:
        break;
    }
  }

  const separatorCount = lines.filter((line) => line === "---" || line === "---vertical---").length;

  return {
    markdown: collapseBlankLines(lines),
    slideCount: separatorCount + 1,
    suggestedFilename: buildSuggestedFilename(pageTitle, options.unit),
    imageBlocks,
  };
}
