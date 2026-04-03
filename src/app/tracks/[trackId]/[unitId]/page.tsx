import fs from "node:fs/promises";
import path from "node:path";
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { tracks } from "../../../../../public/curriculum";
import { isolateImageSlidesInMarkdown } from "@/lib/isolate-image-slides";
import { TrackEntry, UnitEntry } from "../../track";
import { withSapUnits } from "../../sapUnits";
import { SlidesPageClient } from "./SlidesPageClient";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const PUBLIC_MARKDOWN_ROOT = path.join(PUBLIC_ROOT, "markdown");

type ResolvedMarkdownSource = {
  filePath: string;
  publicPath: string;
};

async function resolveParams(
  params: Promise<{ trackId: string; unitId: string }>
): Promise<{ track: TrackEntry; unit: UnitEntry; unitIndex: number; }> {
  const { trackId, unitId } = await params;
  const baseTrack = tracks.find((e) => e.id === trackId);
  const track = baseTrack ? withSapUnits(baseTrack) : undefined;
  const unitIndex = track?.units.findIndex((e: UnitEntry) => e.id === unitId);
  if (!track || unitIndex === undefined || unitIndex === -1) {
    notFound();
  }
  const unit = track.units[unitIndex]
  return { track, unit, unitIndex };
}

function resolveMarkdownPath(
  track: TrackEntry,
  unit: UnitEntry,
  markdownOverride: string | string[] | undefined,
): ResolvedMarkdownSource {
  const defaultPublicPath = `/markdown/${track.id}/${unit.markdownId}.md`;
  const defaultSource = {
    filePath: path.join(PUBLIC_MARKDOWN_ROOT, track.id, `${unit.markdownId}.md`),
    publicPath: defaultPublicPath,
  };

  if (typeof markdownOverride !== "string" || !markdownOverride.startsWith("/markdown/")) {
    return defaultSource;
  }

  const overridePath = path.resolve(PUBLIC_ROOT, `.${markdownOverride}`);
  if (
    !overridePath.startsWith(`${PUBLIC_MARKDOWN_ROOT}${path.sep}`) ||
    path.extname(overridePath) !== ".md"
  ) {
    return defaultSource;
  }

  return {
    filePath: overridePath,
    publicPath: markdownOverride,
  };
}

export default async function SlidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ trackId: string; unitId: string }>;
  searchParams: Promise<{ markdown?: string | string[] }>;
}) {
  const { track, unit, unitIndex } = await resolveParams(params);
  const { markdown } = await searchParams;
  const markdownSource = resolveMarkdownPath(track, unit, markdown);

  let inlineMarkdownContent: string | null = null;
  try {
    const rawMarkdownContent = await fs.readFile(markdownSource.filePath, "utf8");
    const isolatedMarkdownContent = isolateImageSlidesInMarkdown(rawMarkdownContent);
    inlineMarkdownContent =
      isolatedMarkdownContent === rawMarkdownContent
        ? null
        : isolatedMarkdownContent;
  } catch {
    notFound();
  }

  return (
    <Suspense fallback={<div />}>
      <SlidesPageClient
        track={track}
        unit={unit}
        unitIndex={unitIndex}
        inlineMarkdownContent={inlineMarkdownContent}
        markdownPath={markdownSource.publicPath}
      />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return tracks
    .map((track) => withSapUnits(track))
    .map((track) =>
      track.units.map((unit: UnitEntry) => ({
        trackId: track.id,
        unitId: unit.id,
      }))
    )
    .flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string; unitId: string }>;
}): Promise<Metadata> {
  const { unit } = await resolveParams(params);

  return {
    title: unit.title,
  };
}
