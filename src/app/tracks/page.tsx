import { tracks } from "@/data/curriculum";
import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";

import { getColorFromTrack } from "./track";

export default function TracksPage() {
  return (
    <div>
      <CurriculumGridContainer>
        {tracks.map(track => {
          return (
            <CurriculumCard
              key={track.id}
              title={track.title}
              subtitle={track.subtitle}
              description={track.description}
              imgURL={`/covers/${track.id}/track.png`}
              pageURL={track.id}
              color={getColorFromTrack(track.id)}
              disabled={track.disabled} />
          )
        })}
      </CurriculumGridContainer>
    </div>
  )
}