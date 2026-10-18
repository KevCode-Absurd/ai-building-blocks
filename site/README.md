# Site

The AI Building Blocks website: one page, dark by default with a light mode. Header, "Making humanity AI native", then how it works, the library (blocks open in a side drawer, `?block=<slug>`), ready workflows, the builder (drag-and-drop canvas with the handoff download), testing and get started. See `docs/PRD.md`.

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
| `e2e/site.spec.ts` | End-to-end tests: hero, no brands, theme, navigation, search, drawer, kits, builder, handoff zip, phone width |

The page shows no brand names or brand pictures (decided 18 Oct).
