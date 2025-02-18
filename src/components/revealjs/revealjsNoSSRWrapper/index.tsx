'use client';

import { useEffect, useRef, useState } from 'react';
import { FaExpand } from "react-icons/fa";
import Reveal from 'reveal.js';
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealNotes from "reveal.js/plugin/notes/notes";

import "./slides.scss";

export function RevealjsNoSSRWrapper({ children }: { children: React.ReactNode }) {
    const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
    const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance

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
    }, []);

    useEffect(() => {
        deckRef.current?.layout()
        if (isFullScreen) {
            document.documentElement.classList.add('reveal-full-page');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
            document.documentElement.classList.remove('reveal-full-page');
        }
    }, [isFullScreen])

    return (
        <div className="reveal-viewport-wrapper" style={{ position: isFullScreen ? "static" : "relative" }}>
            <div className="expand" onClick={() => { setIsFullScreen(!isFullScreen) }}><FaExpand /></div>
            <div className="reveal-viewport">
                <div className="reveal" ref={deckDivRef}>
                    {children}
                </div>
            </div>
        </div>
    )
}