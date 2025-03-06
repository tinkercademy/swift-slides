import { Breadcrumb } from "@/components/breadcrumb";
import { tracks } from "@/data/curriculum";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { RevealjsClientWrapper } from "../../../../components/revealjsWrapper/revealjsClientWrapper";

import "./slide.scss";
import "./xcode-dark.scss";

import styles from "./page.module.scss";
import QRCode from "react-qr-code";
import { ImagePlus } from "@/components/imagePlus";

async function resolveParams(params: Promise<{ trackId: string, unitId: string }>) {
    const { trackId, unitId } = await params
    const track = tracks.find(e => e.id === trackId)
    const unit = track?.units.find(e => e.id === unitId)

    if (track === undefined || unit === undefined) {
        notFound()
    }

    return { track, unit }
}

export default async function SlidesPage({ params, searchParams }: { params: Promise<{ trackId: string, unitId: string }>, searchParams: Promise<{ "print-pdf"?: boolean }> }) {

    const { track, unit } = await resolveParams(params)
    const isPrint = (await searchParams)["print-pdf"] !== undefined

    const currentURL = (await headers()).get('referer')

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
        <div className={isPrint ? "is-print" : undefined}>
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
                    <section>
                        <div style={{ display: "flex" }}>
                            <div>
                                <h1>Get the Slides</h1>
                                <h2>Scan the QR code to access the slide deck.</h2>
                            </div>
                            <div style={{ padding: 16, width: 500, background: "#fff" }}>
                                {currentURL && (
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={currentURL}
                                        viewBox={`0 0 256 256`}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                    <section>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            <ImagePlus
                                className={styles.tinkerLogo}
                                src="/assets/tinkercademy_long_light.png"
                                darkSrc="/assets/tinkercademy_long_dark.png"
                                width={3680 / 7}
                                height={576 / 7}
                                alt="Tinkercademy Logo" />
                            <p>Swift Coding Club • Track A</p>
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