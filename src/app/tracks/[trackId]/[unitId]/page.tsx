'use client'
// https://github.com/vercel/next.js/discussions/43631

import dynamic from "next/dynamic";
import { TrackCurriculumEntry, UnitCurriculumEntry } from "../../track";
import { Breadcrumb } from "@/components/breadcrumb";
import { tracks } from "@/data/curriculum";
import { useEffect, useState } from "react";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import { notFound } from "next/navigation";

import "./slide.scss";
import "./xcode-dark.scss";

import styles from "./page.module.scss";

const RevealjsWrapper = dynamic(() =>
    import('@/components/revealjs/revealjsWrapper').then(module => module.RevealjsWrapper),
    { ssr: false }
);

export default function SlidesPage({ params }: { params: Promise<{ trackId: string, unitId: string }> }) {
    const [track, setTrack] = useState<TrackCurriculumEntry>()
    const [unit, setUnit] = useState<UnitCurriculumEntry>();

    useEffect(() => {
        (async () => {
            const { trackId, unitId } = await params
            const track = tracks.find(e => e.id === trackId)
            const unit = track?.units.find(e => e.id === unitId)

            if (track === undefined || unit === undefined) {
                notFound()
            }

            setTrack(track)
            setUnit(unit)
        })() // TODO: update to use Suspense
    }, []);

    return (
        <div>
            <div className={styles.headers}>
                <Breadcrumb />
                <h1>{track?.title}</h1>
            </div>
            <RevealjsWrapper>
            <div className="slides">
                <section id="slide-view" data-markdown={`/markdown/${track?.id}/${unit?.markdownId}.md`} data-separator-vertical="^\n---vertical---" data-separator-notes="^Note:" />
                <section>
                    <div style={{ display: "flex" }}>
                        <div>
                            <h1>Get the Slides</h1>
                            <h2>Scan the QR code to access the slide deck.</h2>
                        </div>
                        <img id="qr-image" style={{ borderRadius: "8%", width: 600 }} />
                    </div>
                </section>
                <section>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <img src="/assets/tinkercademy-long.png" alt="Tinkercademy Logo" width="50%" />
                        <p>Swift Coding Club • Track A</p>
                    </div>
                </section>
            </div>
            <div style={{ height: "100%", display: "flex", alignItems: "flex-end", position: "fixed", zIndex: 8, pointerEvents: "none" }}>
                <small style={{ margin: 32 }}>© 2022-2024 Tinkertanker Pte Ltd. All Rights Reserved.</small>
            </div>
        </RevealjsWrapper>
        </div>
    )
}