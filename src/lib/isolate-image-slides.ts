function lastNonBlankLineIndex(lines: string[]): number {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index].trim().length > 0) {
      return index;
    }
  }

  return -1;
}

function ensureHorizontalSlideBreak(lines: string[]): void {
  const lastIndex = lastNonBlankLineIndex(lines);
  if (lastIndex === -1) {
    return;
  }

  const lastLine = lines[lastIndex];
  if (lastLine === "---") {
    return;
  }

  if (lastLine === "---vertical---") {
    lines[lastIndex] = "---";
    return;
  }

  lines.push("---");
}

function isFenceBoundary(line: string): boolean {
  return /^```/.test(line);
}

function isSlideSeparator(line: string): boolean {
  return line === "---" || line === "---vertical---";
}

function isStandaloneMarkdownImage(line: string): boolean {
  return /^!\[[^\]]*]\([^)]+\)$/.test(line);
}

function hasLayoutSlideClass(line: string): boolean {
  return /<!--\s*\.slide:\s*[^>]*class\s*=\s*["'][^"']*layout-[^"']*["'][^>]*-->/i.test(line);
}

export function isolateImageSlidesInMarkdown(markdown: string): string {
  const inputLines = markdown.split(/\r?\n/);
  const outputLines: string[] = [];

  let inCodeFence = false;
  let inSpeakerNotes = false;
  let pendingSlideBreakAfterImage = false;
  let currentSlideHasLayoutClass = false;

  for (const line of inputLines) {
    const trimmed = line.trim();

    if (!inCodeFence && isSlideSeparator(trimmed)) {
      if (pendingSlideBreakAfterImage) {
        ensureHorizontalSlideBreak(outputLines);
        pendingSlideBreakAfterImage = false;
      } else {
        outputLines.push(trimmed);
      }

      inSpeakerNotes = false;
      currentSlideHasLayoutClass = false;
    } else if (!inCodeFence && hasLayoutSlideClass(trimmed)) {
      currentSlideHasLayoutClass = true;
      outputLines.push(line);
    } else if (!inCodeFence && isStandaloneMarkdownImage(trimmed)) {
      if (currentSlideHasLayoutClass) {
        outputLines.push(line);
      } else {
        ensureHorizontalSlideBreak(outputLines);
        outputLines.push(line);
        pendingSlideBreakAfterImage = true;
      }
    } else {
      if (
        pendingSlideBreakAfterImage &&
        !inSpeakerNotes &&
        trimmed.length > 0
      ) {
        ensureHorizontalSlideBreak(outputLines);
        pendingSlideBreakAfterImage = false;
      }

      outputLines.push(line);

      if (!inCodeFence && trimmed.startsWith("Note:")) {
        inSpeakerNotes = true;
      }
    }

    if (isFenceBoundary(trimmed)) {
      inCodeFence = !inCodeFence;
    }
  }

  return outputLines.join("\n");
}
