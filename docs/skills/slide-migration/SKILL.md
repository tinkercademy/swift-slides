---
name: slide-migration
description: Convert Swift Slides decks from mixed HTML plus Markdown into markdown-first Reveal templates, validate parity with the built-in checker, and produce an HTML review report for every converted unit.
---

# Slide Migration

Use this guide when converting an existing deck from the older HTML-heavy markdown style to the shared markdown-first Reveal layouts in this repo.

Keep the migration scoped to one unit at a time. The goal is not just to reduce HTML, but to preserve slide order, teaching flow, and visual intent closely enough that the parity checker can surface the remaining differences clearly.

## Quick start

1. Read `README.md` for the current layout classes and the parity checker command.
2. Open the source deck in `public/markdown/<track>/<markdownId>.md`.
3. Convert one unit at a time.
4. Run the parity checker for that unit.
5. Review the generated HTML report before declaring the unit done.

## What “done” means

A converted unit is only done when all of these are true:

- The markdown is primarily plain markdown plus Reveal comments.
- Raw HTML is only kept for embeds or genuinely custom layouts.
- The shared layout classes are used instead of bespoke wrapper `<div>` markup.
- `bun run lint` passes.
- `bun run build` passes.
- A parity report has been generated for the converted unit.
- The parity report has been reviewed and the remaining differences are understood.

## Inputs you need

- The unit route from `public/curriculum.ts`
- The markdown deck path in `public/markdown/<track>/<markdownId>.md`
- The current layout rules in `src/components/revealjsWrapper/revealjsNoSSRWrapper/slides.scss`

Note: the route id and the markdown id are not always the same. The parity checker accepts either:

- `track_b/unit_01`
- `track_b/01-name-card`

## Migration workflow

### 1. Inspect the source deck

Before editing, scan the whole deck and identify:

- repeated flexbox or wrapper HTML patterns
- code slides with Swift file captions
- slides that are really one big image
- slides with text on the left and one image on the right
- slides with two screenshots under shared text
- slides that still need raw HTML such as `iframe` or `video`

Do not start by rewriting everything blindly. Group slides by pattern first.

### 2. Choose the right template

Use these defaults:

- `layout-steps-media`
  - Use for heading or list on the left with one image on the right.
  - The shared CSS now adds extra gap between text and image and prevents tall portrait screenshots from being clipped.
- `layout-media-centre`
  - Use for one dominant image under a heading or a short line of text.
  - The shared CSS now keeps the image vertically centred and tries to let it consume the remaining height.
- `layout-two-up`
  - Use for one heading plus text followed by two screenshots side by side.
  - Keep the two images as consecutive markdown image lines. The shared CSS handles the “two images inside one paragraph” markdown case.
- `layout-gallery-4`
  - Use for four related visuals with equal weight.
- `layout-code-focus`
  - Use for code-heavy slides with a caption like `![Swift](/assets/swift-logo.svg) ContentView.swift`.

### 3. Convert to markdown-first authoring

Prefer this order:

1. Plain markdown for headings, lists, images, links, and code fences.
2. Reveal comments such as:
   - `<!-- .slide: class="layout-steps-media" -->`
   - `<!-- .element: class="r-stretch" -->`
   - `<!-- .element: class="fragment" -->`
3. Raw HTML only when markdown cannot express the slide cleanly.

### 4. Preserve the structure

While converting, keep these stable unless there is a deliberate content edit:

- slide count
- slide order
- slide separators `---` and `---vertical---`
- main headings
- code examples
- image references
- external links

The parity checker will catch many of these, but it is faster to preserve them intentionally than to debug accidental drift later.

### 5. Watch for known pitfalls

These are the issues already discovered in this repo:

- Two-up slides:
  - Adjacent markdown images can be parsed into one paragraph.
  - Use `layout-two-up` and keep the two images as consecutive markdown image lines.
  - Do not wrap them in ad-hoc HTML just to force columns unless the shared template truly cannot handle the case.
- Single-image slides:
  - Use `layout-media-centre`.
  - If a title and one short line of text sit above the image, the image should still be as tall as possible while fitting.
- Left-text right-image slides:
  - Use `layout-steps-media`.
  - The image should fit fully inside the slide height and should not be clipped at the bottom.
  - There should be clear horizontal breathing room between the text and the image.
- Swift captions:
  - Use markdown, not raw `<img>` tags, unless a one-off custom size is required.
- Icons:
  - Inline icons under `/assets/icons/` usually do not need custom HTML sizing.
- Coloured or emphasised inline text:
  - Standard markdown cannot express inline colour. Use a shared CSS class in `slides.scss` (e.g. `.focus-highlight`) and minimal HTML: `## My heading <span class="focus-highlight">highlighted term</span>`. Prefer this over inline styles or full HTML wrappers.

### 6. Prefer shared fixes over deck-specific hacks

If multiple slides fail in the same way, adjust `slides.scss` rather than patching each slide individually.

Examples of shared fixes that have already been needed:

- adding shared classes for coloured inline text (e.g. `.focus-highlight` in `slides.scss`)
- centring single-image slides vertically
- keeping two-up screenshots side by side
- adding more top breathing room
- increasing left/right gap for text-plus-image slides
- preventing portrait screenshots from clipping in `layout-steps-media`

If only one slide is unusual, then a small local exception may be fine.

## Validation workflow

### 1. Run the parity checker

For each converted unit, **always** generate a fresh HTML report. Do not wait for the user to ask: run the parity command as part of the migration handoff and include the report path in your output.

Example:

```bash
bun run parity:slides -- --base-ref main --unit track_b/01-name-card
```

For multiple units:

```bash
bun run parity:slides -- \
  --base-ref main \
  --unit track_b/01-name-card \
  --unit track_b/01a-stacks-and-shapes
```

### 2. Review the HTML report

Open:

- `output/playwright/slide-parity/<timestamp>/report.html`

For every converted unit, the agent must run the parity checker, then include the generated HTML report path in its handoff. **Regenerate the report after every change**: after finishing a migration, after any edit to `scripts/check-slide-parity.ts`, or after changing report layout/styling. Do it immediately; do not wait for the user to ask.

The report is the primary review artefact. Always provide the full path so the user can open it (e.g. `output/playwright/slide-parity/<timestamp>/report.html` or `file:///.../report.html`). Do not rely on `report.json` for human review.

### 3. What to look for in the report

Focus on:

- slides that stacked images vertically when they should be side by side
- titles or text overlapping images
- images clipped at the bottom or top
- single-image slides where the image is too small relative to the available space
- left-text/right-image slides where the gap is too tight
- accidental content changes such as heading capitalisation or removed code blocks

### 4. What counts as acceptable remaining differences

Usually acceptable:

- minor spacing changes caused by moving from bespoke HTML to shared layouts
- intentional typography clean-up
- slight positioning shifts that preserve the teaching intent

Usually not acceptable:

- missing slides
- missing images
- stacked screenshots that used to be side by side
- clipped screenshots
- title/body overlap
- obvious regressions in emphasis or readability

## Required output for every converted unit

When handing work back, include all of these:

- the converted deck path
- the parity report HTML path
- whether `bun run lint` passed
- whether `bun run build` passed
- the main remaining parity differences, if any

Use this format:

```text
Converted:
- public/markdown/<track>/<markdownId>.md

Parity report:
- output/playwright/slide-parity/<timestamp>/report.html

Validation:
- bun run lint: passed
- bun run build: passed

Remaining differences:
- <brief list>
```

## Conversion checklist

Use the detailed checklist in `references/checklist.md`.

For a full list of units to migrate (compared to main), see `references/migration-checklist.md`.
