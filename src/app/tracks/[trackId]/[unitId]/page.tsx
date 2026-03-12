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

export default async function SlidesPage({
  params,
}: {
  params: Promise<{ trackId: string; unitId: string }>;
}) {
  const { track, unit, unitIndex } = await resolveParams(params);
  const markdownPath = path.join(
    process.cwd(),
    "public",
    "markdown",
    track.id,
    `${unit.markdownId}.md`,
  );

  let markdownContent: string;
  try {
    const rawMarkdownContent = await fs.readFile(markdownPath, "utf8");
    markdownContent = isolateImageSlidesInMarkdown(rawMarkdownContent);
  } catch {
    notFound();
  }

  return (
    <Suspense fallback={<div />}>
      <SlidesPageClient
        track={track}
        unit={unit}
        unitIndex={unitIndex}
        markdownContent={markdownContent}
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
