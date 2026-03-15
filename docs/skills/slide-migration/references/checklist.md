# Slide Migration Checklist

## Before editing

- Confirm the unit route in `public/curriculum.ts`
- Confirm the markdown deck path in `public/markdown/<track>/<markdownId>.md`
- Scan the full deck for repeated HTML patterns
- Identify which slides map to:
  - `layout-steps-media`
  - `layout-media-centre`
  - `layout-two-up`
  - `layout-gallery-4`
  - `layout-code-focus`

## During conversion

- Keep slide separators unchanged unless you have a deliberate reason
- Keep headings and code examples stable unless the content really changed
- Replace wrapper HTML with Reveal comments and plain markdown where possible
- Keep two-up images as consecutive markdown image lines
- Keep Swift code captions in markdown
- Leave embeds in raw HTML when markdown is not enough
- For coloured inline text, use `<span class="focus-highlight">` (or a shared class in `slides.scss`) instead of inline styles

## After conversion

- Run `bun run parity:slides -- --base-ref main --unit <track>/<unit-or-markdown-id>`
- Open the generated `report.html`
- Check for:
  - clipped images
  - image/text overlap
  - undersized single-image slides
  - broken two-up slides
  - content drift
- Run `bun run lint`
- Run `bun run build`

## Handoff

- Include the converted file path
- Include the parity report HTML path (always provide this so the user can open `report.html`)
- Include lint/build status
- List the remaining known differences
