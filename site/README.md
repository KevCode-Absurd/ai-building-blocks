# Site

The AI Building Blocks website: one page, light by default with a dark mode. Header, "Making humanity AI native" and two buttons, then the library (Prompts, Skills, Workflows, Agents; anything opens in a side drawer, `?block=<slug>`) and the builder (drag-and-drop canvas with the handoff download). See `docs/PRD.md`.

Vite + React + TypeScript, built to static files. No server; what people save (kits, workflows) is kept in their browser by `src/lib/store.ts`, the one file to change when free accounts arrive.

```bash
npm install
npm run dev        # builds the data index from ../catalogue-items, then serves on http://localhost:5180
npm run build      # static site in dist/
npm run test:e2e   # Playwright end-to-end tests (uses the installed Chrome; PW_CHANNEL=msedge for Edge)
```

| Path | What it is |
|---|---|
| `scripts/build-index.mjs` | Reads `catalogue-items/**` into `public/data/blocks.json` and copies each SKILL.md to `public/skills/` (both generated, not committed) |
| `src/lib/handoff.ts` | The deterministic handoff export: order, HANDOFF.md, workflow.json, zip |
| `src/App.tsx` | The page and its sections |
| `src/Builder.tsx` | The drag-and-drop canvas (React Flow), loaded after the page |
| `src/BlockDrawer.tsx` | A block or workflow in the side drawer |
| `e2e/site.spec.ts` | End-to-end tests: hero, no brands or jargon, theme, navigation, type tabs, search and filters, drawer, kits, builder, handoff zip, phone width |

The page shows no brand names or brand pictures (decided 18 Oct).

## Deploy

Live at https://useaiblocks.com on Cloudflare Pages (free), built from `main` on every push. Pages project settings: root directory `site`, build command `npm run build`, output directory `dist`; Node comes from `site/.nvmrc`. Cloudflare serves `index.html` for any path the site doesn't have, so links like `/blocks/<slug>` open the app; that's why the build makes no `404.html`.
