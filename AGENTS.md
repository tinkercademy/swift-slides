# Swift Slides Agent Guide

Read `README.md` first for setup, authoring examples, layout usage, and contributor workflow. Keep this file focused on repo-specific constraints that matter while editing.

## Core truths

- `public/curriculum.ts` is the source of truth for tracks, units, and slide routes.
- `src/app/tracks/[trackId]/[unitId]/page.tsx` statically generates a page for every unit in `public/curriculum.ts`, including units marked `disabled`.
- Slide decks live in `public/markdown/<track>/<markdownId>.md`.
- Shared assets belong in `public/assets/`. Deck-specific assets can live under `public/markdown/<track>/assets/` when that keeps the deck readable.
- Shared Reveal authoring helpers and layout classes live in `src/components/revealjsWrapper/revealjsNoSSRWrapper/slides.scss`.

## Editing guidance

- Prefer markdown-first Reveal authoring.
- Reach first for Reveal markdown comments such as `<!-- .slide: ... -->` and `<!-- .element: ... -->`.
- Reuse the shared layout classes before building bespoke markup:
  - `layout-steps-media`
  - `layout-media-centre`
  - `layout-two-up`
  - `layout-gallery-4`
  - `layout-code-focus`
- Treat raw HTML as an escape hatch for embeds like `iframe` and `video`, or for genuinely custom layouts.
- Follow the practical layout examples in `README.md` when choosing between `layout-steps-media`, `layout-media-centre`, `layout-two-up`, `layout-gallery-4`, and `layout-code-focus`.
- Shared icon and Swift caption styling only applies when markdown images do not set explicit `height` or `width`. Add explicit dimensions in HTML when you need a one-off size.
- Canonical markdown-first examples live in `public/markdown/track_b/01-name-card.md` and `public/markdown/track_b/01a-stacks-and-shapes.md`.

## App constraints

- Keep the current client-only Reveal.js setup intact. `SlidesPageClient` ultimately renders the no-SSR Reveal wrapper, so avoid changes that require Reveal to run during SSR.
- When changing route or availability logic, remember disabled units are still routable today because static params are generated from the full curriculum list.

## Validation

- Use `tmux` for `bun run dev` or other long-running local sessions.
- Run `bun run lint` and `bun run build`.
- Check the affected deck at `/tracks/<trackId>/<unitId>`.
- If slide content or styling changed, also verify light mode, dark mode, print view, and a narrow/mobile viewport.
