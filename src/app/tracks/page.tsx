import { Metadata } from "next";

import { tracks } from "../../../public/curriculum";
import fs from "node:fs";
import path from "node:path";
import { getColorFromTrack } from "./track";

import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGrid } from "@/components/curriculumGrid/curriculumGrid";

// Helper moved outside of component to avoid re-creation per render
function coverForTrack(trackId: string) {
  const rel = `/covers/${trackId}/track.webp`;
  const abs = path.join(process.cwd(), "public", rel);
  return fs.existsSync(abs) ? rel : "/covers/placeholder.webp";
}

export default async function TracksPage() {
  return (
    <div>
      <CurriculumGrid>
        {tracks.map((track) => {
          return (
            <CurriculumCard
              key={track.id}
              title={track.title}
              subtitle={track.idDisplay}
              description={track.subtitle}
              imgURL={coverForTrack(track.id)}
              pageURL={track.id}
              color={getColorFromTrack(track.id)}
              disabled={track.disabled}
            />
          );
        })}
      </CurriculumGrid>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Tracks",
};
