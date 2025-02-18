import { Breadcrumb } from "@/components/breadcrumb";
import { tracks } from "@/data/curriculum";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import { notFound } from "next/navigation";
import { RevealjsClientWrapper } from "../../../../components/revealjs/revealjsClientWrapper";
import { RevealjsNoSSRWrapper } from "@/components/revealjs/revealjsNoSSRWrapper";

import "./slide.scss";
import "./xcode-dark.scss";

import styles from "./page.module.scss";

async function resolveParams(params: Promise<{ trackId: string, unitId: string }>) {
    const { trackId, unitId } = await params
    const track = tracks.find(e => e.id === trackId)
    const unit = track?.units.find(e => e.id === unitId)

    if (track === undefined || unit === undefined) {
        notFound()
    }

    return { track, unit }
}

export default async function SlidesPage({ params }: { params: Promise<{ trackId: string, unitId: string }> }) {

    const { track, unit } = await resolveParams(params)

    // TODO: update to use Suspense

    // TODO:
    // // Add a special class to the second-to-last slide dynamically
    // 	Reveal.on('ready', function() {
    // 		const slides = document.querySelectorAll('.reveal .slides section');
    // 		if (slides.length > 1) {
    // 			const secondLastSlide = slides[slides.length - 2];
    // 			secondLastSlide.setAttribute('data-state', 'second-last-page');
    // 		}
    // 	});

    return (
        <div>
            <div className={styles.headers}>
                <Breadcrumb />
                <h1>{track?.title}</h1>
            </div>
            <RevealjsClientWrapper>
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
                    <small style={{ margin: 32 }}>© 2022-2025 Tinkertanker Pte Ltd. All Rights Reserved.</small>
                </div>
            </RevealjsClientWrapper>
        </div>
    )
}