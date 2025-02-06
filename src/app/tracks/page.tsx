import styles from "./page.module.scss";
import { tracks } from "@/data/curriculum";
import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import Image from "next/image";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";

export function getColorFromTrack(trackId: string): string {
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
        {tracks.map(track => (
          <CurriculumCard key={track.id} color={getColorFromTrack(track.id)} entry={track} />
        ))}
      </CurriculumGridContainer>
    </div>
  )
}

{/* <h2 class="titleh2">subtitle</h2>
<h1 class="titleh1">title</h1> */}
