import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";
import { Breadcrumb } from "@/components/breadcrumb";
import { tracks } from "@/data/curriculum";
import { getColorFromTrack } from "../page";
import { notFound } from "next/navigation";

import styles from "./page.module.scss"

export default async function UnitsPage({ params }: { params: Promise<{ trackId: string }> }) {
    const trackId = (await params).trackId
    const track = tracks.find(e => e.id === trackId)

    if (track === undefined) {
        notFound()
    }

    return (
        <div>
            <div className={styles.headers}>
                <Breadcrumb />
                <h1>{track.title}</h1>
            </div>
            <CurriculumGridContainer>
                {track.units.map(unit => {
                    return (
                        <CurriculumCard
                            key={unit.id}
                            title={unit.title}
                            subtitle={unit.subtitle}
                            description={unit.description}
                            imgURL={`/covers/${track.id}/${unit.id}.png`}
                            pageURL={unit.id}
                            color={getColorFromTrack(track?.id)} />
                    )
                })}
            </CurriculumGridContainer>
        </div>
    );
}