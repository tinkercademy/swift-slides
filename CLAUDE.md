# Swift Slides Project - AI Agent Instructions

## Project Overview
This is a **Next.js-based educational slides platform** for the Swift Explorer programme, teaching app design and Swift development to students. The project uses Reveal.js for presentations and organizes content in Markdown files.

## Critical Context for AI Agents

### Technology Stack
- **Framework**: Next.js 15.1.7 with App Router
- **UI**: React 19 with TypeScript 5.8.3
- **Slides**: Reveal.js 5.1.0
- **Styling**: SCSS modules
- **Package Manager**: Bun (preferred) or npm

### Project Structure
```
swift-slides/
├── public/
│   ├── markdown/        # Slide content (DO NOT EDIT unless fixing content)
│   │   ├── track-a/     # App Design track
│   │   ├── track-b/     # Swift Development track  
│   │   ├── track-c/     # Advanced Projects track
│   │   └── track-x/     # Get Started track
│   ├── assets/          # Images and resources
│   └── covers/          # Track and unit thumbnails
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   └── styles/         # Global styles and themes
└── scripts/            # Build and utility scripts
```

## Working Guidelines

### 1. Content Editing Rules

#### Markdown Slides (`/public/markdown/`)
- **Slide separator**: Use `---` for new slides, `---vertical---` for vertical slides
- **Image paths**: Always use absolute paths from `/assets/`
- **Light/Dark images**: Use `.light.` and `.dark.` suffixes for theme-specific images
- **Code blocks**: Use proper language identifiers for syntax highlighting

Example slide format:
```markdown
## Slide Title

Content here

```swift
// Code example
let message = "Hello, Swift!"
```

---

## Next Slide
```

#### Track Color Themes
- **Track A (App Design)**: Blue (`#007AFF`)
- **Track B (Swift Dev)**: Green (`#34C759`)
- **Track C (Advanced)**: Pink (`#FF2D55`)
- **Track X (Get Started)**: Red (`#FF3B30`)

### 2. Development Commands

```bash
# Always use these commands
bun install          # Install dependencies
bun run dev          # Start dev server (localhost:3000)
bun run build        # Build for production
bun run lint         # Check code quality
bun run lint:fix     # Auto-fix linting issues
```

### 3. Common Tasks

#### Adding New Slides
1. Create markdown file in `/public/markdown/<track-id>/<unit-name>.md`
2. Add unit metadata to `/src/app/tracks/[slug]/units.json`
3. Add cover image to `/public/covers/<track-id>/<unit-name>.jpg`

#### Fixing Broken Images
1. Check if image exists in `/public/assets/`
2. Verify path in markdown starts with `/assets/`
3. For theme-specific images, ensure both `.light.` and `.dark.` versions exist

#### Updating Navigation
- Unit progression: Edit `/src/app/tracks/[slug]/[unit]/UnitNavigation.tsx`
- Track overview: Edit `/src/app/tracks/[slug]/page.tsx`
- Main navigation: Edit `/src/components/Navbar.tsx`

### 4. Reveal.js Integration

**IMPORTANT**: Reveal.js runs client-side only. When modifying slide components:
- Keep initialization in `useEffect` hooks
- Use dynamic imports with `ssr: false`
- Don't modify the triple-wrapper pattern in `RevealSlides.tsx`

### 5. Code Style Requirements

#### TypeScript
- Use strict typing (no `any` unless absolutely necessary)
- Define interfaces for all props
- Export types from component files

#### React Components
- Use functional components with hooks
- Keep components in `/src/components/`
- Use CSS modules for styling (`.module.scss` files)

#### SCSS/Styling
- Use color variables from `_colors.scss`
- Mobile-first responsive design
- Follow existing BEM-like naming patterns

### 6. Testing Changes

Before committing:
1. Run `bun run lint` - Must pass with zero errors
2. Run `bun run build` - Must build successfully
3. Test slides at `/tracks/<track-id>/<unit-id>`
4. Verify navigation works (next/previous units)
5. Check both light and dark themes
6. Test on mobile viewport

### 7. Common Issues and Solutions

#### Issue: Slides not loading
- Check markdown file path in `data-markdown` attribute
- Verify file exists at exact path
- Check browser console for 404 errors

#### Issue: Images not showing
- Verify image path starts with `/assets/`
- Check file exists in `/public/assets/`
- For theme-specific: ensure both `.light.` and `.dark.` versions exist

#### Issue: Build failures
- Run `bun run lint:fix` first
- Check for TypeScript errors: `bun run type-check`
- Clear `.next` folder: `rm -rf .next`

### 8. Performance Considerations

- **Images**: Keep under 500KB, use WebP when possible
- **Markdown files**: Split large presentations into multiple units
- **Code blocks**: Limit to 50 lines per block for readability

### 9. Accessibility Requirements

- All images must have descriptive alt text
- Use semantic HTML in custom components
- Maintain keyboard navigation support
- Ensure color contrast meets WCAG AA standards

### 10. Git Workflow

```bash
# Feature development
git checkout -b feature/description
# Make changes
bun run lint
bun run build
git add .
git commit -m "feat: add new feature"

# Bug fixes
git checkout -b fix/description
# Fix issue
bun run lint
bun run build
git add .
git commit -m "fix: resolve issue"
```

## Critical Warnings

⚠️ **DO NOT**:
- Modify Reveal.js core files
- Change the triple-wrapper pattern in RevealSlides
- Edit generated files in `.next/` or `out/`
- Commit without running lint and build
- Remove legacy URL redirects (breaks existing links)

✅ **ALWAYS**:
- Run `bun run lint` before committing
- Test on both light and dark themes
- Verify mobile responsiveness
- Keep markdown files focused (one concept per slide)
- Maintain consistent track color themes

## Quick Reference

### File Paths
- Slides: `/public/markdown/<track>/<unit>.md`
- Images: `/public/assets/<category>/<image>.png`
- Covers: `/public/covers/<track>/<unit>.jpg`
- Components: `/src/components/<Component>.tsx`
- Styles: `/src/styles/<style>.module.scss`

### URL Structure
- Track overview: `/tracks/<track-id>`
- Unit slides: `/tracks/<track-id>/<unit-id>`
- Playground: `/playground`
- Legacy redirects: `/<unit>.html` → `/tracks/<track>/<unit>`

### Track IDs
- `track-a`: App Design and Prototyping
- `track-b`: App Development with Swift
- `track-c`: Advanced Projects
- `track-x`: Get Started with Swift

## Contact for Issues

For slide content issues: Review existing patterns in `/public/markdown/`
For technical issues: Check `/scripts/` for utility scripts
For build issues: Verify Node.js 18+ and Bun are installed
- We're in SGT, i.e. UTC+8