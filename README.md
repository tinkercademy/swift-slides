# Swift Slides

Slides website for the Swift Explorer programme built with Next.js and Reveal.js.

## Getting started

### Requirements
- Node.js 18+
- [Bun](https://bun.sh) for installing dependencies (npm also works).

### Install and run
```bash

bun install
bun run dev
```
Or with npm:
```bash
npm install
npm run dev
```
The site will be available at <http://localhost:3000>.

### Production build
```bash
bun run build
bun run start
```

## Project structure
```
src/
  app/          Next.js App Router pages and global styles
    tracks/     [trackId]/[unitId] slide pages
    playground/ Interactive playground
  components/   Reusable React components
  hooks/        Custom hooks
public/
  assets/       Static images
  markdown/     Slide content in Markdown
  curriculum.ts Track and unit definitions
```

Markdown files for the slides live under `public/markdown/<track>`.
Curriculum data is defined in `public/curriculum.ts` and referenced by the pages in `src/app/tracks`.

## Updating lesson content
1. Edit `public/curriculum.ts` and add a new track object or extend an existing one with additional units.  Each unit entry specifies the `markdownId` for its slide deck.
2. Create the slide deck in `public/markdown/<track>/<markdownId>.md`.  Use `---vertical---` to split vertical slides if needed.
3. Place any images referenced in the Markdown under `public/assets`.
4. Update `src/app/tracks/track.ts` if you need to assign a new color for the track.

## Reveal.js and Next.js
Slides are rendered with Reveal.js inside a client component.  `src/app/tracks/[trackId]/[unitId]/page.tsx` wraps the `RevealjsClientWrapper`, which dynamically imports the non‑SSR wrapper so the slideshow can access browser APIs.  The wrapper reads the Markdown file via data attributes on a `<section>` element.

## Theming
Colors are defined in `src/app/_colors.scss` and mapped to CSS variables in `src/app/_theme.scss`.  The `ThemeManager` component toggles the `dark` or `light` class based on `useDarkMode`, allowing runtime theme switching.

## Contributing
1. Fork this repository and create a feature branch.
2. Install dependencies with Bun or npm.
3. Run `bun run lint` (or `npm run lint`) before committing.
4. Open a pull request describing your changes.
