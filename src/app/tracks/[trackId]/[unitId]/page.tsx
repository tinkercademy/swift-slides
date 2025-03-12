import { Breadcrumb } from "@/components/breadcrumb";
import { tracks } from "@/data/curriculum";

import { notFound } from "next/navigation";
import { RevealjsClientWrapper } from "../../../../components/revealjsWrapper/revealjsClientWrapper";
import { ResponsiveImage } from "@/components/responsiveImage";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import "./slide.scss";
import "./xcode-dark.scss";

import styles from "./page.module.scss";
import { SlidesQRCode } from "@/components/slidesQrCode";

async function resolveParams(params: Promise<{ trackId: string, unitId: string }>) {
    const { trackId, unitId } = await params
    const track = tracks.find(e => e.id === trackId)
    const unit = track?.units.find(e => e.id === unitId)

    if (!track || !unit) {
        notFound()
    }

    return { track, unit }
}

export default async function SlidesPage({ params, searchParams }: { params: Promise<{ trackId: string, unitId: string }>, searchParams: Promise<{ "print-pdf"?: boolean }> }) {

    const { track, unit } = await resolveParams(params)
    const isPrint = (await searchParams)["print-pdf"] !== undefined

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
            <div className={styles.printCover} style={!isPrint ? { display: "none" } : {}}>
                <div className={styles.loader} />
            </div>
            <div className={styles.headers}>
                <Breadcrumb />
                <h1>{track?.title}</h1>
            </div>
            <RevealjsClientWrapper isPrint={isPrint}>
                <div className="slides">
                    <section id="slide-view" data-markdown={`/markdown/${track?.id}/${unit?.markdownId}.md`} data-separator-vertical="^\n---vertical---" data-separator-notes="^Note:" />
                    <section >
                        <div style={{ display: "flex" }}>
                            <div>
                                <h1>Get the Slides</h1>
                                <h2>Scan the QR code to access the slide deck.</h2>
                            </div>
                            <SlidesQRCode />
                        </div>
                    </section>
                    <section>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <ResponsiveImage
                                className={styles.tinkerLogo}
                                src="/assets/logos/tinkercademy_long_light.png"
                                darkSrc="/assets/logos/tinkercademy_long_dark.png"
                                width={3680 / 7}
                                height={576 / 7}
                                alt="Tinkercademy Logo" />
                            <p>Swift Coding Club • Track {track.id.slice(-1).toUpperCase()}</p>
                        </div>
                    </section>
                </div>
                <div className={styles.copyright}>
                    <small>Copyright © {new Date().getFullYear()} Tinkertanker Pte Ltd. All Rights Reserved.</small>
                </div>
            </RevealjsClientWrapper>
        </div>
    )
}

export async function generateStaticParams() {
    return tracks.map((track) => track.units.map((unit) => ({
        trackId: track.id,
        unitId: unit.id
    }))).flat()
}