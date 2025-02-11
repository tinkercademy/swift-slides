import { tracks } from "@/data/curriculum";
import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";

import styles from "./page.module.scss";
import { getColorFromTrack } from "./track";

export default function TracksPage() {
  return (
    <div>
      <div className={styles.headers}>
        <h1>Tracks</h1>
      </div>
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
              color={getColorFromTrack(track.id)} />
          )
        })}
      </CurriculumGridContainer>
    </div>
  )
}