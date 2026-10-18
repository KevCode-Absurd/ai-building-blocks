# Site

The AI Building Blocks website: homepage, library, block pages, kits, the canvas (workflow builder) and the handoff pack export. See `docs/PRD.md`.

Vite + React + TypeScript, built to static files. No server; what people save (kits, workflows) is kept in their browser by `src/lib/store.ts`, the one file to change when free accounts arrive.

```bash
npm install
npm run dev        # builds the data index from ../catalogue-items, then serves on http://localhost:5180
npm run build      # static site in dist/
```

| Path | What it is |
|---|---|
| `scripts/build-index.mjs` | Reads `catalogue-items/**` into `public/data/blocks.json` and copies each SKILL.md to `public/skills/` (both generated, not committed) |
| `scripts/import-examples.mjs` | One-off copy of the reviewed example pictures from a local Creative Engine checkout (read-only) into `public/examples/` |
| `src/lib/handoff.ts` | The deterministic handoff export: order, HANDOFF.md, workflow.json, zip |
| `src/pages/Canvas.tsx` | The drag-and-drop canvas (React Flow) |

Examples are made from public information and are not affiliated with the brand shown.
