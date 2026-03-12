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

## Notion import
For the full SAP import workflow (token setup, commands, overwrite flow, local preview, and publish), see `notion-import.md`.

**Placeholder disclaimer:** command examples that end with `--unit unit_01` or `--unit unit_02` use placeholder unit IDs. Replace those with the actual unit ID you are importing/updating.

## Reveal.js and Next.js
Slides are rendered with Reveal.js inside a client component.  `src/app/tracks/[trackId]/[unitId]/page.tsx` wraps the `RevealjsClientWrapper`, which dynamically imports the non‑SSR wrapper so the slideshow can access browser APIs.  The wrapper reads the Markdown file via data attributes on a `<section>` element.

## Slide navigation and controls

### How slide sections work
1. Horizontal slides are the main sequence of slides.
2. Vertical slides are sub-slides under a single horizontal slide.
3. In markdown:
   - `---` creates a new horizontal slide.
   - `---vertical---` creates a new vertical slide inside the same horizontal stack.
4. Runtime overflow handling may auto-split long markdown slides into vertical sub-slides.

### Navigation behavior in this app
1. **Next step** goes through vertical sub-slides first, then moves to the next horizontal slide.
2. **Previous step** goes upward through vertical sub-slides first, then moves to the previous horizontal slide.
3. Reveal.js default arrow controls are still available for direct directional navigation.

### Controls legend (matches numbered screenshot)
1. Top-right **left circular arrow**: previous meaningful step (custom).
2. Top-right **right circular arrow**: next meaningful step (custom).
3. Bottom-right **left arrow**: previous horizontal slide.
4. Bottom-right **up arrow**: previous vertical slide.
5. Bottom-right **right arrow**: next horizontal slide.
6. Bottom-right **down arrow**: next vertical slide.

### Screenshot placeholder
Replace this line with your final image path:

```md
![Slide Controls Reference](./docs/images/slide-controls-reference.png)
```

## Theming
Colors are defined in `src/app/_colors.scss` and mapped to CSS variables in `src/app/_theme.scss`.  The `ThemeManager` component toggles the `dark` or `light` class based on `useDarkMode`, allowing runtime theme switching.

## Contributing
1. Fork this repository and create a feature branch.
2. Install dependencies with Bun or npm.
3. Run `bun run lint` (or `npm run lint`) before committing.
4. Open a pull request describing your changes.
