'use client';

import { useEffect, useRef, useState } from 'react';
import { FaExpand, FaCompress, FaPrint, FaPenToSquare } from "react-icons/fa6";
import Reveal from 'reveal.js';
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealNotes from "reveal.js/plugin/notes/notes";

import styles from "./styles.module.scss";
import "./slides.scss";
import { ActionsBar } from '../../actionsBar';
import { getColorFromTrack, TrackEntry, UnitEntry } from '@/app/tracks/track';
import { useDarkMode } from "@/hooks/useDarkMode";

function handleOpenWithQuery(name: string, value: string) {
    const url = new URL(window.location.href)
    url.searchParams.append(name, value);
    window.open(url, "_blank")
}

export function RevealjsNoSSRWrapper({ children, isPrint, track, unit }: { children: React.ReactNode, isPrint: boolean, track: TrackEntry, unit: UnitEntry }) {
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const { isDarkMode, setDarkMode } = useDarkMode()

    const color = getColorFromTrack(!!track.id ? track.id : undefined);
    const themeStyles = {
        "--r-link-color": !isDarkMode ? `var(--colors-${color}-darklink)` : `var(--colors-${color}-link)`,
        "--r-link-color-dark": isDarkMode ? `var(--colors-${color}-darklink)` : `var(--colors-${color}-link)`,
        "--r-link-color-hover": isDarkMode ? `var(--colors-${color}-darklink)` : `var(--colors-${color}-link)`,
        "--r-hover-shadow-color": `var(--colors-${color}-hovershadow)`,
        "--r-selection-background-color": `var(--colors-${color}-selectbg)`,
        "--r-gradient": `var(--colors-${color}-gradient)`,
    } as React.CSSProperties;

    useEffect(() => {
        // Prevents double initialization in strict mode
        if (deckRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current!, {
            transition: "slide",
            width: 1920,
            height: 1080,
            hash: true,
            embedded: true,
            slideNumber: "c",
            plugins: [RevealMarkdown, RevealHighlight, RevealNotes]
        });

        deckRef.current.initialize()

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                }
            } catch (_e) {
                console.warn("Reveal.js destroy call failed.");
            }
        };
    }, [deckRef]);

    useEffect(() => {
        if (deckRef.current?.isReady()) {
            deckRef.current.layout()

            if (isFullScreen) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
        };
    }, [isFullScreen])

    useEffect(() => {
        if (isPrint) {
            setIsFullScreen(true)
            setDarkMode(false)
            setTimeout(() => {
                window.print()
                window.close()
            }, 2000); // Allow time for page to load before printing
        }
    }, [isPrint, setDarkMode])

    return (
        <div
            className={`${styles.embedPlayer} ${isFullScreen ? styles.fullscreen : ""} ${isPrint ? styles.print : ""}`}
            style={{ ...themeStyles, position: isFullScreen ? "static" : "relative" }}>
            {!isPrint && (
                <div className={styles.actions}>
                    <ActionsBar actions={[
                        {
                            name: "fullscreen",
                            onClick: () => { setIsFullScreen(!isFullScreen) },
                            icon: isFullScreen ? FaCompress : FaExpand,
                        },
                        {
                            name: "print",
                            onClick: () => { handleOpenWithQuery("print-pdf", "true") },
                            icon: FaPrint,
                        },
                        {
                            name: "edit",
                            hoverText: "Suggest edits",
                            onClick: () => {
                                window.open(`https://github.com/tinkercademy/swift-slides/tree/main/public/markdown/${track.id}/${unit.markdownId}.md`, "_blank")
                            },
                            icon: FaPenToSquare,
                        }
                    ]} />
                </div>
            )}
            <div className={styles.deckContainer}>
                <div className={`reveal ${isPrint ? "print" : ""}`} ref={deckDivRef}> {/* className="reveal reveal-viewport slide embedded center has-vertical-slides has-horizontal-slides ready" */}
                    {children}
                </div>
            </div>
        </div>
    )
}