# AI Building Blocks site

Preact, TypeScript and Vite, with React Flow for the workflow builder. The library has searchable prompts, skills, workflows, agents and minds. Items have permanent pages, source downloads and deterministic workflow packs. Kits, business context and council drafts are saved in the browser.

Cloudflare Pages serves the prerendered site, calculators and saved Mercatura tour. Pages Functions handle comments and shared spaces through D1. Development uses the same handlers with temporary memory stores; restarting the development server clears those stores.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run test:unit
npm run test:e2e
npm run seo
```

Use Node 22 from `.nvmrc`. Generated indexes, skill assets and `dist/` are rebuilt from the repository. Display copy comes from `../catalogue-items/display-copy.yaml`; imported source instructions remain unchanged. Playwright uses installed Chrome; `PW_CHANNEL=msedge` selects Edge.

The library initially renders 16 cards. Show more adds 16. Builder and other large pages load separately. The production build includes a real 404 page, search metadata, job hubs and `/example-app/`; that saved tour is excluded from search.

## Cloudflare integration

Integration is pending. A GitHub push does not prove that a live deployment or domain is configured. Follow [the launch handoff](../docs/CLOUDFLARE-LAUNCH-2026-10-22.md) for project settings, D1 migrations, secrets, preview verification and rollback.

`wrangler.example.jsonc` is a template. Copy it to ignored `wrangler.jsonc` and replace its database IDs before using account commands. Never commit salts, team tokens, local state or a populated configuration. Only `/api/*` invokes Functions, as defined in `public/_routes.json`.

Key code: `scripts/build-index.mjs` (catalogue), `scripts/prerender.mjs` (HTML and tour), `src/lib/handoff.ts` (exports), `src/Builder.tsx` (canvas), `src/server/` (API rules), `functions/api/` (Cloudflare adapters), and `e2e/` (browser tests).
