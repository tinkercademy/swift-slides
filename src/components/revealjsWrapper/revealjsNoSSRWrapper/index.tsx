'use client';

import { useEffect, useRef, useState } from 'react';
import { FaExpand, FaCompress, FaPrint, FaUpRightFromSquare, FaSun, FaMoon } from "react-icons/fa6";
import Reveal from 'reveal.js';
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealNotes from "reveal.js/plugin/notes/notes";

import styles from "./styles.module.scss";
import "./slides.scss";
import { ActionsBar } from '../../actionsBar';
import { useDarkMode } from 'usehooks-ts';

function handleOpenWithQuery(name: string, value: string) {
    const url = new URL(window.location.href)
    url.searchParams.append(name, value);
    window.open(url, "_blank")
}

export function RevealjsNoSSRWrapper({ children, isPrint }: { children: React.ReactNode, isPrint: boolean }) {
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);
    const { toggle: toggleDarkMode, isDarkMode } = useDarkMode()

    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        // Prevents double initialization in strict mode
        if (deckRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current!, {
            transition: "slide",
            width: 1920,
            height: 1080,
            hash: true,
            plugins: [RevealMarkdown, RevealHighlight, RevealNotes]
        });

        // TODO: fix calling .initialize() crashes mobile slides
        deckRef.current.initialize().then(async () => {
            // As a workaround for Next.js App router Layouts, Reveal.js content is placed in an absolute div overlayed above the preexisting Layout.
            // However, Reveal.js automatically sets <body> as the container for all Reveal.js content with .reveal-viewport
            // Hence, we forcefully remove .reveal-viewport from <body> after page has loaded and instead add it to the div.
            // Similarly, .reveal-full-page for <html> tag.
            //
            // TODO: This can be beneficial for future changes when the slide can be made small-screen/full-screen

            document.body.classList.remove('reveal-viewport');
            document.documentElement.classList.remove('reveal-full-page');
        });

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy(); // TODO: Fix issue where Reveal deck cannot be destroyed
                    deckRef.current = null;
                }
            } catch {
                console.warn("Reveal.js destroy call failed.");
            }
        };
    }, [deckRef]);

    useEffect(() => {
        deckRef.current?.layout()
        if (isFullScreen) {
            document.documentElement.classList.add('reveal-full-page');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
            document.documentElement.classList.remove('reveal-full-page');
        }
    }, [isFullScreen])

    useEffect(() => {
        if (isPrint) {
            setIsFullScreen(true)
            setTimeout(() => {
                window.print()
                window.close()
            }, 2000);
        }
    }, [isPrint])

    return (
        <div className={styles.revealViewportWrapper} style={{ position: isFullScreen ? "static" : "relative" }}>
            {!isPrint && <ActionsBar actions={[
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
                },
                {
                    name: "theme",
                    onClick: () => { toggleDarkMode() },
                    icon: ( isDarkMode ? <FaSun /> : <FaMoon /> )
                }
            ]} />}
            <div className="reveal-viewport">
                <div className="reveal" ref={deckDivRef}>
                    {children}
                </div>
            </div>
        </div>
    )
}