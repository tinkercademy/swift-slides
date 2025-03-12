'use client';

import { useEffect, useRef, useState } from 'react';
import { FaExpand, FaCompress, FaPrint, FaUpRightFromSquare } from "react-icons/fa6";
import Reveal from 'reveal.js';
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealNotes from "reveal.js/plugin/notes/notes";

import styles from "./styles.module.scss";
import "./slides.scss";
import { ActionsBar } from '../../actionsBar';

function handleOpenWithQuery(name: string, value: string) {
    const url = new URL(window.location.href)
    url.searchParams.append(name, value);
    window.open(url, "_blank")
}

export function RevealjsNoSSRWrapper({ children, isPrint }: { children: React.ReactNode, isPrint: boolean }) {
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        // Prevents double initialization in strict mode
        if (deckRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current!, {
            transition: "slide",
            width: 1920,
            height: 1080,
            hash: true,
            embedded: true,
            plugins: [RevealMarkdown, RevealHighlight, RevealNotes]
        });

        deckRef.current.initialize()

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                }
            } catch (e) {
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
            setTimeout(() => {
                window.print()
                window.close()
            }, 2000); // Allow time for page to load before printing
        }
    }, [isPrint])

    return (
        <div
            className={`${styles.embedPlayer} ${isFullScreen ? styles.fullscreen : ""} ${isPrint ? styles.print : ""}`}
            style={{ position: isFullScreen ? "static" : "relative" }}>
            {!isPrint && (
                <div className={styles.actions}>
                    <ActionsBar actions={[
                        {
                            name: "fullscreen",
                            onClick: () => { setIsFullScreen(!isFullScreen) },
                            icon: isFullScreen ? <FaCompress /> : <FaExpand />
                        },
                        {
                            name: "print",
                            onClick: () => { handleOpenWithQuery("print-pdf", "true") },
                            icon: <FaPrint />
                        },
                        {
                            name: "popout",
                            onClick: () => { handleOpenWithQuery("fullscreen", "true") },
                            icon: <FaUpRightFromSquare />
                        }
                    ]} />
                </div>
            )}
            <div className={styles.deckContainer}>
                <div className="reveal" ref={deckDivRef}> {/* className="reveal reveal-viewport slide embedded center has-vertical-slides has-horizontal-slides ready" */}
                    {children}
                </div>
            </div>
        </div>
    )
}