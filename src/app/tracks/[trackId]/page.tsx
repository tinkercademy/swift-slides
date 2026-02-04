import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tracks } from "../../../../public/curriculum";
import fs from "node:fs";
import path from "node:path";
import { TrackEntry, UnitEntry } from "../track";

import { TrackUnitsClient } from "./TrackUnitsClient";

async function resolveParams(
  params: Promise<{ trackId: string }>
): Promise<{ track: TrackEntry }> {
  const { trackId } = await params;
  const track = tracks.find((e) => e.id === trackId);
  if (!track) {
    notFound();
  }
  return { track };
}

export default async function UnitsPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  // Lookup the relevant track
  const { track } = await resolveParams(params);

  // Pre-compute available webp cover filenames for this track to avoid repeated fs checks
  const availableCovers = new Set<string>();
  try {
    const dir = path.join(process.cwd(), "public", "covers", track.id);
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith(".webp")) {
        availableCovers.add(e.name);
      }
    }
  } catch {
    // directory might not exist; fall back to empty set
  }

  const unitCards = track.units.map((unit: UnitEntry) => {
    const fileName = `${unit.id}.webp`;
    const rel = `/covers/${track.id}/${fileName}`;
    const imgURL = availableCovers.has(fileName)
      ? rel
      : "/covers/placeholder.webp";

    return {
      id: unit.id,
      title: unit.title,
      idDisplay: unit.idDisplay,
      subtitle: unit.subtitle,
      description: unit.description,
      imgURL,
      disabled: unit.disabled,
    };
  });

  return <TrackUnitsClient track={track} unitCards={unitCards} />;
}

export async function generateStaticParams() {
  return tracks
    .map((track) => ({
      trackId: track.id,
    }))
    .flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string }>;
}): Promise<Metadata> {
  const { track } = await resolveParams(params);

  return {
    title: track.title,
  };
}
