'use client';

import { useEffect, useRef, useState } from 'react';
import { FaExpand, FaCompress, FaPrint, FaPenToSquare, FaCircleChevronRight } from "react-icons/fa6";
import Reveal from 'reveal.js';
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealNotes from "reveal.js/plugin/notes/notes";

import styles from "./styles.module.scss";
import "./slides.scss";
import { ActionsBar } from '../../actionsBar';
import { getColorFromTrack, TrackEntry, UnitEntry } from '@/app/tracks/track';
import { useDarkMode } from "@/hooks/useDarkMode";
import { initializeImageOptimizations } from '@/utils/imageOptimization';
import { autoSectionOverflowSlides } from '@/utils/autoVerticalSections';

function handleOpenWithQuery(name: string, value: string) {
    const url = new URL(window.location.href)
    url.searchParams.append(name, value);
    window.open(url, "_blank")
}

function advanceToNextMeaningfulStep(deckApi: Reveal.Api): boolean {
    const { h, v = 0 } = deckApi.getIndices();
    const horizontalSlides = deckApi.getHorizontalSlides();
    const currentHorizontalSlide = horizontalSlides[h];
    const verticalSections = currentHorizontalSlide
        ? Array.from(currentHorizontalSlide.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement && child.tagName === "SECTION"
        )
        : [];

    // Presentation-step order: finish all vertical sections in this slide, then advance horizontally.
    if (verticalSections.length > 1 && v < verticalSections.length - 1) {
        deckApi.slide(h, v + 1);
        return true;
    }

    if (h < horizontalSlides.length - 1) {
        deckApi.slide(h + 1, 0);
        return true;
    }

    return false;
}

export function RevealjsNoSSRWrapper({ children, isPrint, track, unit }: { children: React.ReactNode, isPrint: boolean, track: TrackEntry, unit: UnitEntry }) {
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);
    const destroyTimeoutRef = useRef<number | null>(null);

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
        // React strict mode (dev) runs effect cleanup + setup twice. Delay cleanup and cancel it
        // on immediate replay to avoid tearing down Reveal while markdown plugin async work is in-flight.
        if (destroyTimeoutRef.current !== null) {
            window.clearTimeout(destroyTimeoutRef.current);
            destroyTimeoutRef.current = null;
        }

        // Prevent double initialization and guard against missing mount node.
        if (deckRef.current || !deckDivRef.current) return;

        const deck = new Reveal(deckDivRef.current, {
            transition: "slide",
            width: 1920,
            height: 1080,
            hash: true,
            embedded: true,
            slideNumber: "c",
            navigationMode: "default",
            controls: true,
            controlsBackArrows: "visible",
            plugins: [RevealMarkdown, RevealHighlight, RevealNotes]
        });
        deckRef.current = deck;
        let autoSectionRerunTimeout: number | null = null;
        const imageLoadListeners: Array<{ image: HTMLImageElement; listener: () => void }> = [];

        const clearAutoSectionRerunTimeout = () => {
            if (autoSectionRerunTimeout !== null) {
                window.clearTimeout(autoSectionRerunTimeout);
                autoSectionRerunTimeout = null;
            }
        };

        const handleDeckClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0) return;
            const deckApi = deckRef.current;
            if (!deckApi?.isReady()) return;

            if (!(event.target instanceof Element)) return;

            // Allow normal interactions for controls, links and media.
            if (event.target.closest("a, button, input, textarea, select, label, video, audio, iframe, .controls, .progress, .slide-number")) {
                return;
            }

            const hasTextSelection = !!window.getSelection()?.toString();
            if (hasTextSelection) return;

            advanceToNextMeaningfulStep(deckApi);
        };

        let clickAdvanceTarget: HTMLElement | null = null;

        const scheduleAutoSectionOverflowPass = () => {
            clearAutoSectionRerunTimeout();
            autoSectionRerunTimeout = window.setTimeout(() => {
                autoSectionRerunTimeout = null;
                if (deckRef.current !== deck) return;
                autoSectionOverflowSlides(deck);
            }, 120);
        };

        deck.initialize()
            .then(() => {
                // A stale init can resolve after teardown; ignore in that case.
                if (deckRef.current !== deck) return;

                // Auto-split long markdown slides into vertical sections so overflow content
                // can be navigated with up/down before moving to the next horizontal slide.
                autoSectionOverflowSlides(deck);
                scheduleAutoSectionOverflowPass();

                const slidesElement = deck.getSlidesElement();
                if (slidesElement) {
                    slidesElement.querySelectorAll("img").forEach((imageElement) => {
                        if (!(imageElement instanceof HTMLImageElement)) return;
                        if (imageElement.complete) return;

                        const onImageLoad = () => {
                            scheduleAutoSectionOverflowPass();
                        };

                        imageElement.addEventListener("load", onImageLoad, { once: true });
                        imageLoadListeners.push({ image: imageElement, listener: onImageLoad });
                    });
                }

                clickAdvanceTarget = deck.getSlidesElement() ?? deck.getRevealElement();
                clickAdvanceTarget?.addEventListener("click", handleDeckClick);

                // Initialize image optimizations after Reveal is ready
                initializeImageOptimizations({
                    rootMargin: '500px', // Preload images 500px before they come into view
                    threshold: 0.01,
                    fadeIn: true
                });

                // Ensure all links inside slides open in a new tab
                // (replaces the previous <base target="_blank" /> usage which caused hydration issues)
                const container = deckDivRef.current;
                if (container) {
                    container.querySelectorAll('a[href]').forEach((el) => {
                        const a = el as HTMLAnchorElement;
                        a.setAttribute('target', '_blank');
                        a.setAttribute('rel', 'noopener noreferrer');
                    });
                }
            })
            .catch((error: unknown) => {
                // Keep runtime overlay clean for known detached-node races.
                const message = error instanceof Error ? error.message : String(error);
                const isDetachedNodeOuterHtmlError =
                    message.includes("Failed to set the 'outerHTML' property on 'Element'") &&
                    message.includes('has no parent node');
                if (!isDetachedNodeOuterHtmlError) {
                    console.error("Reveal initialization failed", error);
                }
            });

        return () => {
            clickAdvanceTarget?.removeEventListener("click", handleDeckClick);
            clearAutoSectionRerunTimeout();
            imageLoadListeners.forEach(({ image, listener }) => {
                image.removeEventListener("load", listener);
            });
            destroyTimeoutRef.current = window.setTimeout(() => {
                destroyTimeoutRef.current = null;
                try {
                    if (deckRef.current) {
                        deckRef.current.destroy();
                        deckRef.current = null;
                    }
                } catch (_e) {
                    // Silently handle Reveal.js cleanup errors
                }
            }, 0);
        };
    }, []);

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
                            name: "next",
                            hoverText: "Next step",
                            onClick: () => {
                                const deckApi = deckRef.current;
                                if (!deckApi?.isReady()) return;
                                advanceToNextMeaningfulStep(deckApi);
                            },
                            icon: FaCircleChevronRight,
                        },
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
