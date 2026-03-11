import type Reveal from "reveal.js";

interface AutoVerticalSectionOptions {
  maxHeightRatio?: number;
  semanticHeadingTags?: string[];
}

interface MeasurementContext {
  probeSlidesContainer: HTMLDivElement;
  slideWidth: number;
  slideHeight: number;
  maxContentHeight: number;
}

const RUNTIME_SLIDE_CLASSES = new Set(["present", "past", "future", "stack"]);
const DEFAULT_SEMANTIC_HEADING_TAGS = new Set(["H2", "H3", "H4"]);

function isSectionElement(node: Element): node is HTMLElement {
  return node.tagName === "SECTION";
}

function isListElement(node: HTMLElement): boolean {
  return node.tagName === "UL" || node.tagName === "OL";
}

function isHeadingElement(node: HTMLElement): boolean {
  return /^H[1-6]$/.test(node.tagName);
}

function cleanupRuntimeSlideState(slide: HTMLElement): void {
  slide.removeAttribute("hidden");
  slide.removeAttribute("aria-hidden");
  slide.removeAttribute("style");
  slide.classList.forEach((className) => {
    if (RUNTIME_SLIDE_CLASSES.has(className)) {
      slide.classList.remove(className);
    }
  });
  if (!slide.className.trim()) {
    slide.removeAttribute("class");
  }
}

function cloneSlideShell(slide: HTMLElement): HTMLElement {
  const clone = slide.cloneNode(false) as HTMLElement;
  cleanupRuntimeSlideState(clone);
  clone.removeAttribute("id");
  return clone;
}

function cloneContentBlock(block: HTMLElement): HTMLElement {
  const clone = block.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  return clone;
}

function cloneListWithItems(listElement: HTMLElement, items: HTMLElement[]): HTMLElement {
  const listClone = listElement.cloneNode(false) as HTMLElement;
  listClone.removeAttribute("id");
  items.forEach((item) => listClone.appendChild(item.cloneNode(true)));
  return listClone;
}

function createMeasurementContext(
  revealElement: HTMLElement,
  slideWidth: number,
  slideHeight: number,
  maxContentHeight: number
): { context: MeasurementContext; teardown: () => void } {
  const root = document.createElement("div");
  root.setAttribute("data-auto-vertical-measure-root", "true");
  Object.assign(root.style, {
    position: "absolute",
    left: "-20000px",
    top: "0",
    width: `${slideWidth}px`,
    height: `${slideHeight}px`,
    visibility: "hidden",
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: "-1",
  });

  const probeSlidesContainer = document.createElement("div");
  probeSlidesContainer.className = "slides";
  Object.assign(probeSlidesContainer.style, {
    position: "relative",
    width: `${slideWidth}px`,
    height: `${slideHeight}px`,
    transform: "none",
  });

  root.appendChild(probeSlidesContainer);
  revealElement.appendChild(root);

  return {
    context: {
      probeSlidesContainer,
      slideWidth,
      slideHeight,
      maxContentHeight,
    },
    teardown: () => {
      root.remove();
    },
  };
}

function measureBlocksHeight(
  slideTemplate: HTMLElement,
  blocks: HTMLElement[],
  context: MeasurementContext
): number {
  const probeSlide = cloneSlideShell(slideTemplate);
  Object.assign(probeSlide.style, {
    position: "relative",
    display: "block",
    width: `${context.slideWidth}px`,
    height: `${context.slideHeight}px`,
    maxHeight: "none",
    minHeight: "0",
    overflow: "visible",
    transform: "none",
  });

  blocks.forEach((block) => probeSlide.appendChild(block.cloneNode(true)));
  context.probeSlidesContainer.appendChild(probeSlide);

  const measuredHeight = probeSlide.scrollHeight;
  probeSlide.remove();

  return measuredHeight;
}

function splitBlocksBySemanticHeadings(
  blocks: HTMLElement[],
  semanticHeadingTags: Set<string>
): HTMLElement[][] {
  if (blocks.length === 0) return [];

  const groups: HTMLElement[][] = [];
  let currentGroup: HTMLElement[] = [];

  blocks.forEach((block) => {
    const startsNewGroup = semanticHeadingTags.has(block.tagName);
    if (startsNewGroup && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [block];
      return;
    }
    currentGroup.push(block);
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

function splitOversizedListIntoBalancedBlocks(
  listElement: HTMLElement,
  slideTemplate: HTMLElement,
  context: MeasurementContext
): HTMLElement[] {
  const listItems = Array.from(listElement.children).filter(
    (child): child is HTMLElement => child.tagName === "LI"
  );

  if (listItems.length <= 1) {
    return [cloneContentBlock(listElement)];
  }

  const fullListClone = cloneContentBlock(listElement);
  const fullListHeight = measureBlocksHeight(slideTemplate, [fullListClone], context);
  if (fullListHeight <= context.maxContentHeight) {
    return [fullListClone];
  }

  const targetChunkCount = Math.max(2, Math.ceil(fullListHeight / context.maxContentHeight));
  const targetItemsPerChunk = Math.max(2, Math.ceil(listItems.length / targetChunkCount));

  const groupedItems: HTMLElement[][] = [];
  let index = 0;
  while (index < listItems.length) {
    let end = Math.min(listItems.length, index + targetItemsPerChunk);

    // Expand chunk while it still fits.
    while (end < listItems.length) {
      const expandedCandidate = cloneListWithItems(listElement, listItems.slice(index, end + 1));
      const expandedHeight = measureBlocksHeight(slideTemplate, [expandedCandidate], context);
      if (expandedHeight > context.maxContentHeight) break;
      end += 1;
    }

    // Shrink chunk if it still overflows.
    while (end > index + 1) {
      const candidate = cloneListWithItems(listElement, listItems.slice(index, end));
      const candidateHeight = measureBlocksHeight(slideTemplate, [candidate], context);
      if (candidateHeight <= context.maxContentHeight) break;
      end -= 1;
    }

    // Absolute fallback: at least one item per chunk.
    let chunkItems = listItems.slice(index, end);
    if (chunkItems.length === 0) {
      chunkItems = [listItems[index]];
      end = index + 1;
    }

    // Avoid orphaning a single trailing item when we can keep chunks more balanced.
    const remainingItems = listItems.length - end;
    if (remainingItems === 1 && chunkItems.length >= 3) {
      const merged = listItems.slice(index, end + 1);
      const mergedList = cloneListWithItems(listElement, merged);
      const mergedHeight = measureBlocksHeight(slideTemplate, [mergedList], context);
      if (mergedHeight <= context.maxContentHeight) {
        chunkItems = merged;
        end += 1;
      }
    }

    groupedItems.push(chunkItems);
    index = end;
  }

  if (groupedItems.length <= 1) {
    return [fullListClone];
  }

  return groupedItems.map((group) => cloneListWithItems(listElement, group));
}

function expandOversizedBlocks(
  blocks: HTMLElement[],
  slideTemplate: HTMLElement,
  context: MeasurementContext
): HTMLElement[] {
  const expanded: HTMLElement[] = [];

  blocks.forEach((block) => {
    const blockHeight = measureBlocksHeight(slideTemplate, [block], context);
    if (blockHeight <= context.maxContentHeight) {
      expanded.push(block);
      return;
    }

    if (isListElement(block)) {
      expanded.push(...splitOversizedListIntoBalancedBlocks(block, slideTemplate, context));
      return;
    }

    expanded.push(block);
  });

  return expanded;
}

function splitOversizedBlockGroup(
  blockGroup: HTMLElement[],
  slideTemplate: HTMLElement,
  context: MeasurementContext
): HTMLElement[][] {
  const expandedBlocks = expandOversizedBlocks(blockGroup, slideTemplate, context);

  const sections: HTMLElement[][] = [];
  let currentSection: HTMLElement[] = [];

  expandedBlocks.forEach((block) => {
    const candidate = [...currentSection, block];
    const candidateHeight = measureBlocksHeight(slideTemplate, candidate, context);

    if (currentSection.length > 0 && candidateHeight > context.maxContentHeight) {
      sections.push(currentSection);
      currentSection = [block];
      return;
    }

    currentSection = candidate;
  });

  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  // Rebalance tiny one-block tails if possible.
  if (sections.length > 1) {
    for (let i = sections.length - 1; i > 0; i -= 1) {
      const current = sections[i];
      const previous = sections[i - 1];
      if (current.length !== 1 || previous.length < 2) continue;

      const movedBlock = previous[previous.length - 1];
      const rebalanceCandidate = [movedBlock, ...current];
      const rebalanceHeight = measureBlocksHeight(slideTemplate, rebalanceCandidate, context);
      if (rebalanceHeight <= context.maxContentHeight) {
        previous.pop();
        sections[i] = rebalanceCandidate;
      }
    }
  }

  return sections;
}

function normalizeSlideBlocks(slide: HTMLElement, _context: MeasurementContext): HTMLElement[] {
  const directBlocks = Array.from(slide.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  );

  return directBlocks.map((block) => cloneContentBlock(block));
}

function splitIntoVerticalBlockGroups(
  slide: HTMLElement,
  normalizedBlocks: HTMLElement[],
  semanticHeadingTags: Set<string>,
  context: MeasurementContext
): HTMLElement[][] {
  const semanticGroups = splitBlocksBySemanticHeadings(normalizedBlocks, semanticHeadingTags);
  const packedGroups: HTMLElement[][] = [];

  semanticGroups.forEach((semanticGroup) => {
    const groupHeight = measureBlocksHeight(slide, semanticGroup, context);
    if (groupHeight <= context.maxContentHeight) {
      packedGroups.push(semanticGroup);
      return;
    }
    packedGroups.push(...splitOversizedBlockGroup(semanticGroup, slide, context));
  });

  if (packedGroups.length <= 1) {
    return packedGroups;
  }

  // Pack semantic chunks into final sections without overfilling.
  const finalGroups: HTMLElement[][] = [];
  let currentGroup: HTMLElement[] = [];

  packedGroups.forEach((group) => {
    const candidateGroup = [...currentGroup, ...group];
    const candidateHeight = measureBlocksHeight(slide, candidateGroup, context);

    if (currentGroup.length > 0 && candidateHeight > context.maxContentHeight) {
      finalGroups.push(currentGroup);
      currentGroup = [...group];
      return;
    }

    currentGroup = candidateGroup;
  });

  if (currentGroup.length > 0) {
    finalGroups.push(currentGroup);
  }

  return finalGroups;
}

function isEligibleMarkdownSlide(slide: HTMLElement): boolean {
  if (!slide.hasAttribute("data-markdown-parsed")) {
    return false;
  }

  if (slide.querySelector(":scope > section")) {
    return false;
  }

  return slide.childElementCount > 1;
}

function buildVerticalStack(slide: HTMLElement, blockGroups: HTMLElement[][]): HTMLElement {
  const stack = document.createElement("section");
  stack.setAttribute("data-auto-vertical-stack", "true");

  const originalId = slide.getAttribute("id");
  const sectionCount = blockGroups.length;

  blockGroups.forEach((group, index) => {
    const chunkSlide = cloneSlideShell(slide);
    if (index === 0 && originalId) {
      chunkSlide.setAttribute("id", originalId);
    }

    chunkSlide.setAttribute("data-auto-vertical-section", "true");
    chunkSlide.setAttribute("data-auto-vertical-index", String(index + 1));
    chunkSlide.setAttribute("data-auto-vertical-count", String(sectionCount));

    group.forEach((block) => chunkSlide.appendChild(block));
    stack.appendChild(chunkSlide);
  });

  return stack;
}

export function autoSectionOverflowSlides(
  deck: Reveal.Api,
  options: AutoVerticalSectionOptions = {}
): number {
  const slidesElement = deck.getSlidesElement();
  const revealElement = deck.getRevealElement();
  if (!slidesElement || !revealElement) {
    return 0;
  }

  const config = deck.getConfig();
  const slideWidth = typeof config.width === "number" ? config.width : 1920;
  const slideHeight = typeof config.height === "number" ? config.height : 1080;
  const maxHeightRatio = options.maxHeightRatio ?? 0.96;
  const maxContentHeight = Math.floor(slideHeight * maxHeightRatio);
  const semanticHeadingTags = new Set(
    (options.semanticHeadingTags ?? Array.from(DEFAULT_SEMANTIC_HEADING_TAGS)).map((tag) =>
      tag.toUpperCase()
    )
  );

  const { context, teardown } = createMeasurementContext(
    revealElement,
    slideWidth,
    slideHeight,
    maxContentHeight
  );

  const replacements: Array<{ original: HTMLElement; stack: HTMLElement }> = [];

  Array.from(slidesElement.children)
    .filter(isSectionElement)
    .forEach((slide) => {
      if (!isEligibleMarkdownSlide(slide)) {
        return;
      }

      const normalizedBlocks = normalizeSlideBlocks(slide, context);
      if (normalizedBlocks.length <= 1) {
        return;
      }

      const totalHeight = measureBlocksHeight(slide, normalizedBlocks, context);
      if (totalHeight <= context.maxContentHeight) {
        return;
      }

      const hasHeadings = normalizedBlocks.some((block) => isHeadingElement(block));
      const effectiveHeadingTags = hasHeadings
        ? semanticHeadingTags
        : new Set<string>();

      const blockGroups = splitIntoVerticalBlockGroups(
        slide,
        normalizedBlocks,
        effectiveHeadingTags,
        context
      );
      if (blockGroups.length <= 1) {
        return;
      }

      replacements.push({
        original: slide,
        stack: buildVerticalStack(slide, blockGroups),
      });
    });

  teardown();

  if (replacements.length === 0) {
    return 0;
  }

  const { h, v = 0, f } = deck.getIndices();

  replacements.forEach(({ original, stack }) => {
    original.replaceWith(stack);
  });

  deck.sync();
  deck.slide(h, v, f);
  deck.layout();

  return replacements.length;
}
