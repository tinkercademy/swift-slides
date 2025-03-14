import { Metadata } from "next";

import { tracks } from "../../../public/curriculum";
import { getColorFromTrack } from "./track";

import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGrid } from "@/components/curriculumGrid/curriculumGrid";

export default async function TracksPage() {
  return (
    <div>
      <CurriculumGrid>
        {tracks.map((track) => {
          return (
            <CurriculumCard
              key={track.id}
              title={track.title}
              subtitle={track.subtitle}
              description={track.description}
              imgURL={`/covers/${track.id}/track.png`}
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