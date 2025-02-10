import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";
import { tracks } from "@/data/curriculum";
import { getColorFromTrack } from "../page";

import styles from "./page.module.scss"
import { notFound } from "next/navigation";

export default async function UnitsPage({ params }: { params: Promise<{ trackId: string }> }) {
    const trackId = (await params).trackId
    const track = tracks.find(e => e.id === trackId)

    if (track === undefined) {
        notFound()
    }
    
    return (
        <div>
            <h2>{track.subtitle}</h2>
            <h1 className={styles.title}>{track.title}</h1>
            <CurriculumGridContainer>
                {track.units.map(unit => (
                    <CurriculumCard key={unit.id} color={getColorFromTrack(track?.id)} entry={unit} />
                ))}
            </CurriculumGridContainer>
        </div>
    );
}