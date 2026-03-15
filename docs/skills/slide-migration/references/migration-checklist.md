# Slide Migration Checklist (vs main)

Units that need migration from HTML-heavy markdown to markdown-first Reveal templates. Compare to `main` branch.

## Already migrated

- [x] `track_a/01-keynote-intro` — Introduction to Keynote
- [x] `track_a/02-brainstorm` — Brainstorming
- [x] `track_a/03-ui-planning` — Planning your User Interface
- [x] `track_a/04-inclusive-app-design` — Inclusive App Design
- [x] `track_a/04a-designing-with-ipad-os` — Designing with iPadOS
- [x] `track_a/05-introduction-to-freeform` — Introduction to Freeform
- [x] `track_a/05a-storyboarding` — Storyboarding
- [x] `track_a/06-prototyping` — Prototyping
- [x] `track_a/06a-design-a-simple-app` — Design a Simple App
- [x] `track_a/07-get-started-with-code` — Get Started with Code
- [x] `track_b/00-ipad-and-swift` — iPad and Swift
- [x] `track_b/01-name-card` — Name Card (canonical)
- [x] `track_b/01a-stacks-and-shapes` — Stacks and Shapes (canonical)
- [x] `track_b/02-counter` — Counter
- [x] `track_b/02a-flag-raising` — Flag Raising
- [x] `track_b/03-about-me` — About Me
- [x] `track_b/04-quiz-app` — Quiz App (was already markdown-first)
- [x] `track_b/04a-arrays-previews-and-structs` — Arrays, Previews, and Structs
- [x] `track_b/04b-jokes` — Jokes
- [x] `track_b/04c-quiz-v2` — Quiz v2
- [x] `track_b/05-recipe-app` — Recipe App
- [x] `track_b/06-capstone-project` — Capstone Project
- [x] `track_x/01-commands-for-loops-and-conditionals` — Commands, For Loops and Conditionals
- [x] `track_x/02-logic-and-variable-types` — Logic and Variable Types (disabled)
- [x] `track_x/03-initialisation-function-parameters` — Initialisation, Function, Parameters (disabled)
- [x] `track_x/04-getting-started-with-code` — Getting Started With Code (disabled)
- [x] `track_x/05-about-me-app` — About me App (disabled)

## Not in curriculum (excluded)

- `track_b/chatgpt_and_apis.md`
- `track_b/list_old.md`
- `track_x/getting-started-with-apps.md`

## Parity notes

- `track_b/02a-flag-raising` and `track_b/04b-jokes`: baseline (main) times out in Playwright due to heavy HTML/video embeds; preview-only review generated.
- `track_x/01-*` and `track_x/02-*`: iPad frame overlays (decorative `iPad.png` z-index composites) were removed, so image reference changes are expected.
- All manifest heading changes are from converting inline `<img>` HTML to markdown image syntax, or from subagent-added headings on previously heading-less slides.
