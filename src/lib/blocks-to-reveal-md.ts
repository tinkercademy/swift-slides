import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { isolateImageSlidesInMarkdown } from "@/lib/isolate-image-slides";

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

const NOTION_COLOR_STYLES: Record<
  string,
  {
    text: string;
    background: string;
  }
> = {
  gray: { text: "#6b7280", background: "rgba(107, 114, 128, 0.2)" },
  brown: { text: "#92400e", background: "rgba(146, 64, 14, 0.2)" },
  orange: { text: "#c2410c", background: "rgba(194, 65, 12, 0.2)" },
  yellow: { text: "#a16207", background: "rgba(161, 98, 7, 0.2)" },
  green: { text: "#15803d", background: "rgba(21, 128, 61, 0.2)" },
  blue: { text: "#1d4ed8", background: "rgba(29, 78, 216, 0.2)" },
  purple: { text: "#7e22ce", background: "rgba(126, 34, 206, 0.2)" },
  pink: { text: "#be185d", background: "rgba(190, 24, 93, 0.2)" },
  red: { text: "#b91c1c", background: "rgba(185, 28, 28, 0.2)" },
};

function extractPlainText(
  richText: RichTextItemResponse[],
  options: {
    trim?: boolean;
  } = {},
): string {
  const { trim = true } = options;
  const output = richText.map((rt) => rt.plain_text).join("");
  return trim ? output.trim() : output;
}

function escapeInlineCodeText(text: string): string {
  return text.replace(/`/g, "\\`");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeLinkTarget(url: string): string {
  return url.replace(/ /g, "%20").replace(/\)/g, "%29");
}

function colorStyle(color: RichTextItemResponse["annotations"]["color"]): string | null {
  if (color === "default") {
    return null;
  }

  if (color.endsWith("_background")) {
    const baseColor = color.replace(/_background$/, "");
    const style = NOTION_COLOR_STYLES[baseColor];
    if (!style) {
      return null;
    }

    return `background-color: ${style.background}; color: ${style.text}; border-radius: 0.15em; padding: 0 0.15em;`;
  }

  const style = NOTION_COLOR_STYLES[color];
  if (!style) {
    return null;
  }

  return `color: ${style.text};`;
}

function annotateText(text: string, annotations: RichTextItemResponse["annotations"]): string {
  if (!text) {
    return "";
  }

  let output = text;

  if (annotations.code) {
    output = `\`${escapeInlineCodeText(output)}\``;
  } else {
    if (annotations.bold) {
      output = `**${output}**`;
    }
    if (annotations.italic) {
      output = `*${output}*`;
    }
    if (annotations.strikethrough) {
      output = `~~${output}~~`;
    }
    if (annotations.underline) {
      output = `<u>${output}</u>`;
    }
  }

  const style = colorStyle(annotations.color);
  if (style) {
    return `<span style="${style}">${output}</span>`;
  }

  return output;
}

function renderRichTextItem(item: RichTextItemResponse): string {
  if (!item.plain_text) {
    return "";
  }

  const baseText = escapeHtml(item.plain_text);
  const annotated = annotateText(baseText, item.annotations);
  const href = item.href;

  if (href) {
    return `[${annotated}](${escapeLinkTarget(href)})`;
  }

  return annotated;
}

function extractRichText(
  richText: RichTextItemResponse[],
  options: {
    trim?: boolean;
  } = {},
): string {
  const { trim = true } = options;
  const output = richText.map((item) => renderRichTextItem(item)).join("");
  return trim ? output.trim() : output;
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

function lastNonBlankLine(lines: string[]): string | undefined {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const value = lines[index];
    if (value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function ensureHorizontalSlideBreak(lines: string[]): void {
  const lastLine = lastNonBlankLine(lines);
  if (!lastLine || lastLine === "---") {
    return;
  }

  lines.push("---");
}

export function blocksToRevealMd(
  blocks: BlockObjectResponse[],
  pageTitle: string,
  options: {
    track?: string;
    unit?: string;
  } = {},
): ConversionResult {
  const lines: string[] = [`# ${escapeHtml(pageTitle)}`];
  const imageBlocks: ImageBlock[] = [];
  let imageCounter = 0;
  let shouldStartNewSlideBeforeNextContent = false;

  const appendLine = (line: string): void => {
    if (
      shouldStartNewSlideBeforeNextContent &&
      line.trim().length > 0 &&
      line !== "---"
    ) {
      ensureHorizontalSlideBreak(lines);
      shouldStartNewSlideBeforeNextContent = false;
    }

    lines.push(line);
  };

  const appendLines = (...contentLines: string[]): void => {
    contentLines.forEach((line) => {
      appendLine(line);
    });
  };

  for (const block of blocks) {
    switch (block.type) {
      case "heading_1": {
        const text = extractRichText(block.heading_1.rich_text);
        if (text) {
          appendLines("---", "", `# ${text}`);
        }
        break;
      }
      case "heading_2": {
        const text = extractRichText(block.heading_2.rich_text);
        if (text) {
          appendLine(`## ${text}`);
        }
        break;
      }
      case "heading_3": {
        const text = extractRichText(block.heading_3.rich_text);
        if (text) {
          appendLine(`### ${text}`);
        }
        break;
      }
      case "paragraph": {
        const text = extractRichText(block.paragraph.rich_text);
        appendLine(text);
        break;
      }
      case "bulleted_list_item": {
        const text = extractRichText(block.bulleted_list_item.rich_text);
        if (text) {
          appendLine(`- ${text}`);
        }
        break;
      }
      case "numbered_list_item": {
        const text = extractRichText(block.numbered_list_item.rich_text);
        if (text) {
          appendLine(`1. ${text}`);
        }
        break;
      }
      case "code": {
        const language = block.code.language;
        const content = extractPlainText(block.code.rich_text, { trim: false });
        appendLines(`\`\`\`${language}`, content, "\`\`\`");
        break;
      }
      case "divider": {
        appendLine("---vertical---");
        break;
      }
      case "callout": {
        const text = extractRichText(block.callout.rich_text);
        if (text) {
          const icon = calloutIcon(block.callout);
          appendLine(icon ? `> ${icon} ${text}` : `> ${text}`);
        }
        break;
      }
      case "quote": {
        const text = extractRichText(block.quote.rich_text);
        if (text) {
          appendLine(`> ${text}`);
        }
        break;
      }
      case "to_do": {
        const text = extractRichText(block.to_do.rich_text);
        if (text) {
          appendLine(`- [${block.to_do.checked ? "x" : " "}] ${text}`);
        }
        break;
      }
      case "image": {
        imageCounter += 1;

        const suggestedFilename = `image-${String(imageCounter).padStart(3, "0")}.png`;
        const caption = extractPlainText(block.image.caption) || "image";

        if (block.image.type === "external") {
          const notionUrl = block.image.external.url;
          ensureHorizontalSlideBreak(lines);
          appendLine(`![${caption}](${notionUrl})`);
          shouldStartNewSlideBeforeNextContent = true;
          imageBlocks.push({
            blockId: block.id,
            notionUrl,
            isNotionHosted: false,
            suggestedFilename,
          });
        }

        if (block.image.type === "file") {
          const notionUrl = block.image.file.url;
          // Notion "file" image blocks are temporary signed URLs that should be downloaded
          // to local assets for stable slide rendering.
          const isNotionHosted = true;
          const localPath = buildLocalImagePath(options.track, options.unit, suggestedFilename);

          ensureHorizontalSlideBreak(lines);
          appendLine(`![${caption}](${localPath})`);
          shouldStartNewSlideBeforeNextContent = true;
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
        const text = extractRichText(block.toggle.rich_text);
        if (text) {
          appendLine(text);
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
    markdown: isolateImageSlidesInMarkdown(collapseBlankLines(lines)),
    slideCount: separatorCount + 1,
    suggestedFilename: buildSuggestedFilename(pageTitle, options.unit),
    imageBlocks,
  };
}
