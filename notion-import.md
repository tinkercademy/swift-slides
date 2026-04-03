# Notion Import Guide (SAP Materials)

This guide covers the full flow for importing Notion content into the SAP track slides.

**Placeholder disclaimer:** command examples that end with `--unit unit_01` or `--unit unit_02` use placeholder unit IDs. Replace those with the actual unit ID you are importing/updating.

## 1) Create a Notion integration (one-time)

1. Go to [Notion Integrations](https://www.notion.so/profile/integrations/internal).
2. Click **Build integrations**.
3. Click **+ New integration**.
4. Choose **Internal integration**.
5. Pick the workspace and complete setup.
6. Copy the **Internal Integration Secret** (`ntn_...`) and store it securely.

## 2) Add your token to this project (one-time)

Run from project root:

```bash
printf 'NOTION_TOKEN=ntn_your_token_here\n' > .env
```

Notes:
- `.env` must stay local and should not be committed.
- If you already have a `.env`, just update the `NOTION_TOKEN` line.

If this step is missed, imports fail with access errors.

## 3) Import a unit

Base command:

```bash
npx tsx scripts/notion-to-md.ts --url "<NOTION_PAGE_URL_OR_PAGE_ID>" --track track_sap --unit unit_01
```

What this writes:
- `public/markdown/track_sap/unit_01.md`
- `public/assets/track_sap/unit_01/*` (downloaded Notion images)

## 4) Update an existing unit (overwrite)

Use `--overwrite` when re-syncing a unit you already imported:

```bash
npx tsx scripts/notion-to-md.ts --url "<NOTION_PAGE_URL_OR_PAGE_ID>" --track track_sap --unit unit_01 --overwrite
```

## 5) Preview conversion only (no files written)

```bash
npx tsx scripts/notion-to-md.ts --url "<NOTION_PAGE_URL_OR_PAGE_ID>" --track track_sap --unit unit_01 --dry-run
```

## 6) View slides locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000/tracks/track_sap
```

If updates do not appear, hard refresh:
- macOS: `Cmd + Shift + R`

## 7) Publish your imported materials

```bash
git status
git add public/markdown/track_sap/unit_01.md public/assets/track_sap/unit_01
git commit -m "Sync SAP unit_01 from Notion"
git push
```

If your team uses PR flow, open and merge the PR after push.

## 8) Common command patterns

Import a new unit:

```bash
npx tsx scripts/notion-to-md.ts --url "<PAGE_URL>" --track track_sap --unit unit_02
```

Re-import same unit:

```bash
npx tsx scripts/notion-to-md.ts --url "<PAGE_URL>" --track track_sap --unit unit_02 --overwrite
```

Hard reset a unit import (optional):

```bash
rm -rf public/assets/track_sap/unit_02
npx tsx scripts/notion-to-md.ts --url "<PAGE_URL>" --track track_sap --unit unit_02 --overwrite
```

## 9) Troubleshooting

`NOTION_TOKEN not found`
- Ensure `.env` exists in project root and includes `NOTION_TOKEN=...`.

`Object not found` or `Restricted resource`
- Integration does not have access to that page or parent database.

Images not showing
- Re-run import with `--overwrite`.
- Confirm importer output says it found and downloaded Notion-hosted images.
- Confirm files exist under `public/assets/track_sap/<unit_id>`.

Imported file exists but route does not open
- Use `unit_XX` style IDs (`unit_01`, `unit_02`, etc.).
- Open route `/tracks/track_sap/<unit_id>`.
