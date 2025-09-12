import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { tracks } from "../../../../public/curriculum";
import fs from "node:fs";
import path from "node:path";
import { getColorFromTrack, TrackEntry, UnitEntry } from "../track";

import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGrid } from "@/components/curriculumGrid/curriculumGrid";
import { Breadcrumb } from "@/components/breadcrumb";
import { SearchBar } from "@/components/searchBar";

import styles from "./page.module.scss";

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
  searchParams,
}: {
  params: Promise<{ trackId: string }>;
  searchParams: Promise<{ deck?: string; search?: string }>;
}) {
  // Lookup the relevant track
  const { track } = await resolveParams(params);

  // Temporary redirect for legacy presentation links (see next.config.ts)
  const markdownId = (await searchParams)?.deck;
  const unitId = track.units.find((e) => e.markdownId === markdownId)?.id;
  if (!!unitId) {
    redirect(`/tracks/${track.id}/${unitId}`);
  }

  // Check if search term is present and matches any units
  const searchTerm = (await searchParams)?.search || "";
  const filteredUnits = track.units.filter(
    (unit: UnitEntry) =>
      unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.idDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div>
      <div className={styles.flexbox}>
        <div className={styles.headers}>
          <Breadcrumb />
          <h1>{track.title}</h1>
        </div>
        <SearchBar searchTerm={searchTerm} />
      </div>
      <CurriculumGrid>
        {filteredUnits.length > 0 ? (
          filteredUnits.map((unit: UnitEntry) => {
            const fileName = `${unit.id}.webp`;
            const rel = `/covers/${track.id}/${fileName}`;
            const imgURL = availableCovers.has(fileName)
              ? rel
              : "/covers/placeholder.webp";
            return (
              <CurriculumCard
                key={unit.id}
                title={unit.title}
                subtitle={unit.idDisplay}
                description={unit.subtitle}
                imgURL={imgURL}
                pageURL={unit.id}
                color={getColorFromTrack(track?.id)}
                disabled={unit.disabled}
              />
            );
          })
        ) : (
          <div className={styles.noResults}>
            <FaMagnifyingGlass />
            <h2>No Results for &quot;{searchTerm}&quot;</h2>
            <p>Check the spelling or try a new search.</p>
          </div>
        )}
      </CurriculumGrid>
    </div>
  );
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
