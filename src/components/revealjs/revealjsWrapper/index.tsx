import React, { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealNotes from "reveal.js/plugin/notes/notes";

import "./slides.scss";

export function RevealjsWrapper({ children }: { children: React.ReactNode }) {
    const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
    const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance

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
            //
            // TODO: This can be beneficial for future changes when the slide can be made small-screen/full-screen

            document.body.classList.remove('reveal-viewport');
        });

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                }
            } catch (e) {
                console.warn("Reveal.js destroy call failed.", e);
            }
        };
    }, []);

    return (
        <div className="reveal-viewport">
            <div className="reveal" ref={deckDivRef}>
                {children}
            </div>
        </div>
    )
}