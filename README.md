# Swift Slides

Slides website for the Swift Explorer programme, built with Next.js and Reveal.js.

## Getting started

### Requirements
- Node.js 22.x
- [Bun](https://bun.sh) or npm

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

The site will be available at [http://localhost:3000](http://localhost:3000).

### Production build
```bash
bun run build
bun run start
```

## Project structure

```text
src/
  app/          Next.js App Router pages and global styles
    tracks/     [trackId]/[unitId] slide pages
    playground/ Interactive playground
  components/   Reusable React components
  hooks/        Custom hooks
public/
  assets/       Shared icons, logos, and other global assets
  markdown/     Slide content in Markdown, grouped by track
  curriculum.ts Track and unit definitions
```

`public/curriculum.ts` is the source of truth for tracks, units, and slide routes. Each unit points at a markdown deck via `markdownId`.

## Updating lesson content

1. Edit `public/curriculum.ts` and add a new unit or update an existing one.
2. Create or update the slide deck at `public/markdown/<track>/<markdownId>.md`.
3. Put shared assets in `public/assets/`.
4. Put unit-specific assets beside the deck under `public/markdown/<track>/assets/` when that keeps the content more legible.
5. Update `src/app/tracks/track.ts` only if you need a new track colour mapping.

## Authoring slides

Use plain markdown first. Reach for Reveal.js comments and the shared layout classes before adding raw HTML.

### Slide separators
- Use `---` for a new horizontal slide.
- Use `---vertical---` for a new vertical slide.

### Preferred authoring order
1. Plain markdown for headings, lists, links, images, and code fences.
2. Reveal.js markdown comments for slide or element attributes.
3. Raw HTML only for embeds such as `iframe` or `video`, or for genuinely bespoke layouts.

### Slide template classes

These classes are defined in `src/components/revealjsWrapper/revealjsNoSSRWrapper/slides.scss` and can be applied with Reveal markdown comments:

- `layout-steps-media`: heading or list content on the left, one image or media item on the right
- `layout-media-centre`: one centred image or media item, optionally with a heading or short intro
- `layout-two-up`: two side-by-side screenshots or code blocks
- `layout-gallery-4`: simple four-item image grid
- `layout-code-focus`: code-heavy slides with a consistent caption area

### Which layout to utilise

Use these as the default patterns before reaching for custom HTML.

#### `layout-steps-media`

Best for step-by-step instructions with one supporting screenshot.

```md
<!-- .slide: class="layout-steps-media" -->
## Importing Images

1. Open the sidebar.
2. Tap **Add File**.
3. Select **Photo**.

![The Assets section with an imported photo.](/markdown/track_b/assets/playgrounds-image-asset.png)
```

#### `layout-media-centre`

Best for one large image, diagram, or screenshot that should dominate the slide.

```md
<!-- .slide: class="layout-media-centre" -->
## What's in the Toolbar

![Annotated Playgrounds toolbar.](/markdown/track_b/assets/annotated-playgrounds-toolbar.png)
<!-- .element: class="r-stretch" -->
```

#### `layout-two-up`

Best for before-and-after comparisons or two screenshots shown together.

```md
<!-- .slide: class="layout-two-up" -->
## Rename the App

1. Tap and hold on the app playground.
2. Enter a descriptive name.

![Press-and-hold menu.](/markdown/track_b/assets/shapes-rename-app1-ss.jpg)
![Rename pop-up.](/markdown/track_b/assets/shapes-rename-app2-ss.jpg)
```

#### `layout-gallery-4`

Best for four related visuals that should share the same weight.

```md
<!-- .slide: class="layout-gallery-4" -->
## Shape Options

![Capsule example.](/markdown/track_b/assets/capsule-example.png)
![Circle example.](/markdown/track_b/assets/circle-example.png)
![Ellipse example.](/markdown/track_b/assets/ellipse-example.png)
![Rectangle example.](/markdown/track_b/assets/rectangle-example.png)
```

#### `layout-code-focus`

Best for code-first teaching slides with a short title and consistent file caption.

````md
<!-- .slide: class="layout-code-focus" -->
## Tip: Rounded Rectangle

```swift
RoundedRectangle(cornerRadius: 20)
```

![Swift](/assets/swift-logo.svg) ContentView.swift
````

### Reveal element helpers

Use Reveal's built-in helper classes through markdown comments instead of wrapper HTML:

- `fragment`: reveal a list item or paragraph one step at a time
- `r-stretch`: let media grow to fill the available slide height
- `r-fit-text`: shrink large text to fit the slide width
- `r-stack`: layer multiple images in the same position

```md
- First point <!-- .element: class="fragment" -->
- Second point <!-- .element: class="fragment" -->
```

```md
![Annotated screenshot](/markdown/track_b/assets/example.png)
<!-- .element: class="r-stretch" -->
```

### Reveal.js markdown comments

```md
<!-- .slide: class="layout-steps-media" -->
## Create a Playground App

1. Press the ![New Project Button](/markdown/track_b/assets/new-project-button.png) icon to create a new app
2. Hold down on the newly created app and tap **Rename**
3. Name it **Name Card**
4. Tap on the app to open it

![Playgrounds new project screen](/markdown/track_b/assets/new-project.png)
```

```md
![Toolbar screenshot](/markdown/track_b/assets/annotated-playgrounds-toolbar.png)
<!-- .element: class="r-stretch" -->
```

```md
- First point <!-- .element: class="fragment" -->
- Second point <!-- .element: class="fragment" -->
```

### Shared markdown conventions

- Use `![Swift](/assets/swift-logo.svg) ContentView.swift` for Swift code captions.
- Shared UI icons under `/assets/icons/` and the standard Swift logo caption pattern pick up default sizing automatically when the markdown image does not set `height` or `width`.
- If a slide needs a custom-sized icon or logo, set `height` or `width` explicitly in HTML and it will opt out of the shared defaults.
- Prefer descriptive alt text for all images.

### Canonical examples

These decks show the intended markdown-first patterns:

- `public/markdown/track_b/01-name-card.md`
- `public/markdown/track_b/01a-stacks-and-shapes.md`

For a repeatable migration workflow, including parity-review expectations and the required handoff format, see `docs/skills/slide-migration/SKILL.md`.

## Reveal.js and Next.js

Slides are rendered with Reveal.js inside a client component. `src/app/tracks/[trackId]/[unitId]/page.tsx` wraps `RevealjsClientWrapper`, which dynamically imports the non-SSR wrapper so the slideshow can access browser APIs. The markdown deck is loaded via Reveal's `data-markdown` support on the slide section.

## Theming

Colours are defined in `src/app/_colors.scss` and mapped to CSS variables in `src/app/_theme.scss`. `ThemeManager` toggles the `dark` or `light` class based on `useDarkMode`, allowing runtime theme switching.

## Parity checker

When migrating a deck from HTML-heavy markdown to the shared layouts, use the parity checker before moving on to the next unit.

### What it checks

- Structure parity: slide count, headings, image references, links, and code block counts
- Visual parity: per-slide screenshots and diff images rendered through the real Reveal route

### Run it

```bash
bun run parity:slides -- --unit track_b/01-name-card
```

Compare multiple units against the previous Git revision:

```bash
bun run parity:slides -- \
  --base-ref HEAD^ \
  --unit track_b/01-name-card \
  --unit track_b/01a-stacks-and-shapes
```

### Output

- Reports and screenshots are written to `output/playwright/slide-parity/<timestamp>/`
- Open `report.html` for the human-friendly review
- Use `report.json` for machine-readable output
- Diff images are grouped by unit under `baseline/`, `current/`, and `diff/`

### Notes

- The checker defaults to comparing against `HEAD^`
- `--unit` accepts either the public route ID such as `track_b/unit_01` or the markdown ID such as `track_b/01-name-card`
- It temporarily writes generated markdown under `public/markdown/_parity/` and cleans it up after the run
- Use `--visual-threshold <number>` if you want a stricter or looser screenshot diff threshold

## Contributing

1. Create a short-lived branch for your work.
2. Run `bun run lint` and `bun run build` before committing.
3. Test the affected deck at `/tracks/<trackId>/<unitId>`.
4. Check light mode, dark mode, and print view when you touch slide styling or markdown layouts.
