import fs from "node:fs";
import path from "node:path";

import { TrackEntry, UnitEntry } from "./track";

const SAP_TRACK_ID = "track_sap";
const SAP_MARKDOWN_ROOT = path.join(process.cwd(), "public", "markdown", SAP_TRACK_ID);
const UNIT_FILE_PATTERN = /^unit_[a-zA-Z0-9]+\.md$/;
const UNIT_ID_PATTERN = /^unit_(.+)$/;

const unitIdCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function defaultUnitTitle(unitId: string): string {
  const match = unitId.match(UNIT_ID_PATTERN);
  if (!match) {
    return unitId;
  }

  const raw = match[1];
  const pretty = raw.replace(/([a-zA-Z])(\d)/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  if (!pretty) {
    return "Imported Unit";
  }

  return `Unit ${pretty.toUpperCase()}`;
}

function defaultUnitDisplay(unitId: string): string {
  const match = unitId.match(UNIT_ID_PATTERN);
  if (!match) {
    return unitId;
  }

  return `Unit ${match[1].toUpperCase()}`;
}

function extractTitleFromMarkdown(markdownPath: string, fallback: string): string {
  try {
    const content = fs.readFileSync(markdownPath, "utf8");
    const titleMatch = content.match(/^#{1,6}\s+(.+)\s*$/m);
    if (titleMatch?.[1]) {
      return titleMatch[1].trim();
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function buildDiscoveredUnit(unitId: string): UnitEntry {
  const markdownPath = path.join(SAP_MARKDOWN_ROOT, `${unitId}.md`);
  const defaultTitle = defaultUnitTitle(unitId);

  return {
    id: unitId,
    title: extractTitleFromMarkdown(markdownPath, defaultTitle),
    idDisplay: defaultUnitDisplay(unitId),
    subtitle: "Imported from Notion for the Swift SAP Track.",
    description: "Auto-imported lesson deck from Notion.",
    markdownId: unitId,
  };
}

export function withSapUnits(track: TrackEntry): TrackEntry {
  if (track.id !== SAP_TRACK_ID) {
    return track;
  }

  let fileNames: string[] = [];
  try {
    fileNames = fs
      .readdirSync(SAP_MARKDOWN_ROOT)
      .filter((name) => UNIT_FILE_PATTERN.test(name));
  } catch {
    return track;
  }

  if (fileNames.length === 0) {
    return track;
  }

  const configuredById = new Map(track.units.map((unit) => [unit.id, unit]));
  const discoveredUnits = fileNames
    .map((name) => name.replace(/\.md$/i, ""))
    .sort((a, b) => unitIdCollator.compare(a, b))
    .map((unitId) => {
      const configured = configuredById.get(unitId);
      if (configured) {
        return {
          ...configured,
          markdownId: unitId,
        };
      }

      return buildDiscoveredUnit(unitId);
    });

  return {
    ...track,
    units: discoveredUnits,
  };
}
