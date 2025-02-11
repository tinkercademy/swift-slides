import styles from "./page.module.scss";
import { tracks } from "@/data/curriculum";
import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import Image from "next/image";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";

export function getColorFromTrack(trackId: string): "blue" | "green" | "pink" | "red" {
  switch (trackId) {
    case "track_a": return "blue"
    case "track_b": return "green"
    case "track_c": return "pink"
    case "track_x": return "red"
    default: return "red"
  }
}

export default function TracksPage() {
  return (
    <div>
      <h1>Curriculum</h1>
      <CurriculumGridContainer>
        {tracks.map(track => {
          return (
            <CurriculumCard
              key={track.id}
              title={track.title}
              subtitle={track.subtitle}
              description={track.description}
              imgURL={`/covers/${track.id}.png`}
              pageURL={track.id}
              color={getColorFromTrack(track.id)} />
          )
        })}
      </CurriculumGridContainer>
    </div>
  )
}