import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGridContainer } from "@/components/curriculumGrid/curriculumGridContainer";
import { Breadcrumb } from "@/components/breadcrumb";
import { SearchBar } from "@/components/searchBar";
import { tracks } from "@/data/curriculum";
import { notFound, redirect } from "next/navigation";

import styles from "./page.module.scss"
import { getColorFromTrack } from "../track";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default async function UnitsPage({ params, searchParams }: { params: Promise<{ trackId: string }>, searchParams: Promise<{ deck?: string, search?: string }> }) {

    // Lookup the relevant track and list relevant units
    const trackId = (await params).trackId
    const track = tracks.find(e => e.id === trackId)
    if (track === undefined) {
        notFound()
    }

    // Temporary redirect for legacy presentation links (see next.config.ts)
    const markdownId = (await searchParams)?.deck
    const unitId = track.units.find(e => e.markdownId === markdownId)?.id
    if (unitId !== undefined) {
        redirect(`/tracks/${trackId}/${unitId}`, )
    }

    // Check if search term is present and matches any units
    const searchTerm = (await searchParams)?.search || "";
    const filteredUnits = track.units.filter(unit =>
        unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className={styles.flexbox}>
                <div className={styles.headers}>
                    <Breadcrumb />
                    <h1>{track.title}</h1>
                </div>
                <SearchBar searchTerm={searchTerm} />
            </div>
            <CurriculumGridContainer>
                {filteredUnits.length > 0 ? filteredUnits.map(unit => {
                    return (
                        <CurriculumCard
                            key={unit.id}
                            title={unit.title}
                            subtitle={unit.subtitle}
                            description={unit.description}
                            imgURL={`/covers/${track.id}/${unit.id}.png`}
                            pageURL={unit.id}
                            color={getColorFromTrack(track?.id)}
                            disabled={unit.disabled} />
                    )
                }) : (
                    <div className={styles.noResults}>
                        <FaMagnifyingGlass />
                        <h2>No Results for &quot;{searchTerm}&quot;</h2>
                        <p>Check the spelling or try a new search.</p>
                    </div>
                )}
            </CurriculumGridContainer>
        </div>
    );
}

export async function generateStaticParams() {
    return tracks.map((track) => ({
        trackId: track.id
    })).flat()
}