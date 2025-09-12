# TODO - Swift Slides Project

## 🚨 Missing Images (Priority: High)

### 📍 Interactive Tracker Available
**View the missing images tracker with direct links to broken slides:**  
`http://localhost:3000/missing-images-tracker.html`

This page shows all 22 missing images with clickable links to view each broken slide directly.

### Track B - Unit 04A: Arrays, Previews, and Structs (7 images)

**URL**: `http://localhost:3000/tracks/track_b/unit_04A` or `http://explore.swiftin.sg/tracks/track_b/unit_04A`

**Markdown**: `/public/markdown/track_b/arrays.md`

Missing array visualization diagrams:
- [ ] `/public/markdown/track_b/assets/array-diagram.png`
- [ ] `/public/markdown/track_b/assets/visualising-arrays-0.png`
- [ ] `/public/markdown/track_b/assets/visualising-arrays-1.png`
- [ ] `/public/markdown/track_b/assets/visualising-arrays-2.png`
- [ ] `/public/markdown/track_b/assets/visualising-arrays-3.png`
- [ ] `/public/markdown/track_b/assets/visualising-arrays-4.png`
- [ ] `/public/markdown/track_b/assets/visualising-arrays-5.png`

**Action Required**: Create array visualization diagrams showing how arrays work in Swift.

### Track X - Placeholder Images (15 images)

#### Unit 05: About Me App
**URL**: `http://localhost:3000/tracks/track_x/unit_05` or `http://explore.swiftin.sg/tracks/track_x/unit_05`  
**Markdown**: `/public/markdown/track_x/about-me-app.md`  
**Status**: ⚠️ Unit is disabled in curriculum (won't appear in navigation)

| Slide # | Missing Image | Context | View at |
|---------|--------------|---------|---------|
| 1 | `placeholder_getting_started_about_me.png` | Getting Started | `#/0` |
| 3 | `placeholder_tabs_in_app.png` | Tabs in the App | `#/2` |
| 4 | `placeholder_hands_on_about_me.png` | Hands-On | `#/3` |
| 6 | `placeholder_editing_tab_labels.png` | Changing Tab Labels | `#/5` |
| 7 | `placeholder_adding_images_to_tabs.png` | Adding Images to Tabs | `#/6` |
| 9 | `placeholder_changing_accent_colors.png` | Changing Accent Colors | `#/8` |
| 10 | `placeholder_styling_text.png` | Styling the Text | `#/9` |

#### Unit 03: Initialisation, Function, Parameters
**URL**: `http://localhost:3000/tracks/track_x/unit_03` or `http://explore.swiftin.sg/tracks/track_x/unit_03`  
**Markdown**: `/public/markdown/track_x/initialisation-func-parameters.md`  
**Status**: ⚠️ Unit is disabled in curriculum (won't appear in navigation)

| Slide # | Missing Image | Context | View at |
|---------|--------------|---------|---------|
| 2 | `placeholder_initialisation.png` | Initialisation | `#/1` |
| 3 | `placeholder_hands_on_initialisation.png` | Hands-On (Initialisation) | `#/2` |
| 4 | `placeholder_functions.png` | Functions | `#/3` |
| 5 | `placeholder_hands_on_functions.png` | Hands-On (Functions) | `#/4` |
| 6 | `placeholder_parameters.png` | Parameters | `#/5` |
| 7 | `placeholder_hands_on_parameters.png` | Hands-On (Parameters) | `#/6` |

#### Getting Started with Apps (Not mapped to any unit)
**Markdown**: `/public/markdown/track_x/getting-started-with-apps.md`  
**Status**: ❌ Not accessible via UI (no unit uses this markdown file)

| Slide # | Missing Image | Context |
|---------|--------------|---------|
| 2 | `placeholder_swiftui_basics.png` | SwiftUI Basics |
| 3 | `placeholder_getting_started.png` | Getting Started |

**Note**: This file appears to be incomplete/unused. Unit 04 "Getting Started With Code" incorrectly points to `initialisation-func-parameters.md` instead.

**Action Required**:
1. Create actual screenshots/diagrams for these placeholders
2. OR temporarily comment out the image references in the markdown files
3. Fix the mapping for Unit 04 if `getting-started-with-apps.md` should be used

## ✅ Recently Completed

### Image Optimization (Completed)
- [x] Migrated all UI images from PNG to WebP format
- [x] Implemented lazy loading for Reveal.js images
- [x] Added image preloading for critical assets
- [x] Set up browser caching headers for static assets
- [x] Created image optimization scripts

### Performance Improvements (Completed)
- [x] Reduced image sizes by ~30% with WebP conversion
- [x] Added compression to Next.js responses
- [x] Configured optimal image device sizes

## 🔧 Optional Improvements

### Storage Optimization
- [ ] Remove redundant PNG files that have WebP versions (saves ~1.5MB)
  - Run: `find public/assets/logos public/covers -name "*.png" -exec rm {} \;`
  - Note: Keep these as backups if preferred

### Further Image Optimization
- [ ] Convert markdown slide images (278 PNGs) to WebP format
- [ ] Install and run advanced compression tools:
  ```bash
  ./scripts/install-image-tools.sh
  ./scripts/optimize-images-advanced.sh
  ```

### Content Improvements
- [ ] Review and update Track X content with actual screenshots
- [ ] Add proper array visualization diagrams for Track B
- [ ] Consider adding more visual examples to other tracks

## 📝 Notes

- All critical UI images (logos, covers, placeholders) are working correctly with WebP
- The missing images are only in slide content, not affecting the main UI
- Browser support for WebP is at 99%+ globally
- Current total image size: ~3.1MB (could be reduced further)

## 🚀 Quick Commands

```bash
# Validate all images
node scripts/validate-images.js

# Optimize images (JavaScript-based)
bun run optimize-images

# Start development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint
```

---

*Last updated: 2025-09-12*