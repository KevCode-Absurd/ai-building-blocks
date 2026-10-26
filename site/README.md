# AI Building Blocks site

Community publishing: creators submit private skill/workflow drafts for backend review; independent reviewers publish approved submissions. Stars influence browse rankings with counters hidden by default. See [setup, safety limits and review operations](../docs/COMMUNITY-PUBLISHING.md) for migration `0009`, reviewer configuration and validation.

Preact, TypeScript and Vite, with React Flow for the workflow builder. The library has searchable prompts, skills, workflows, agents and minds. Items have permanent pages, source downloads and deterministic workflow packs. Signed-in kits, workflows, business context and council drafts sync to the account; guest saves remain in the browser. See [persistence and workspace access](../docs/PERSISTENCE-AND-WORKSPACE-ACCESS.md) for migration, recovery, access restrictions and release checks.

Cloudflare Workers Static Assets serves the prerendered site, calculators and saved Mercatura tour. The Worker router reuses the existing API handlers for comments, shared spaces and composition through D1. Development uses the same handlers with temporary memory stores; restarting the Vite development server clears those stores.

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

API security setup and private staging requirements are in [APP-SECURITY.md](../docs/APP-SECURITY.md). Deployed anonymous writes require real Turnstile configuration and rate-limit bindings; public version previews are disabled. The named staging hostname requires a private access header on every route, including assets.

Integration is pending. A GitHub push does not prove that a live deployment or domain is configured. Follow [the launch handoff](../docs/CLOUDFLARE-LAUNCH-2026-10-22.md) for project settings, D1 migrations, secrets, preview verification and rollback.

`wrangler.example.jsonc` targets Workers Static Assets on Workers Paid: 100,000 files per version, with a 95,000-file build guard. Copy it to ignored `wrangler.jsonc` and replace production/staging database IDs before using account commands. Staging uses a separate database. Never commit salts, team tokens, local state or a populated configuration. Only `/api` and `/api/*` run the application Worker before assets; `_redirects` and `_headers` retain existing URL and cache behavior. Legacy `_routes.json` is excluded by `.assetsignore`.

Use `npm run worker:dry-run` for offline packaging. `npm run worker:local-config` generates the ignored test configuration; migrate it with `wrangler d1 migrations apply COMMENTS --local --config wrangler.local.jsonc`, then `npm run worker:dev`. Run `node tools/check-cloudflare-local.mjs` from the repo root against that local server. `npm run worker:staging` and `npm run worker:deploy` deploy the populated staging/production configuration after account setup and verification. See the handoff for the short persistence path needed on this Windows checkout.

Key code: `scripts/build-index.mjs` (catalogue), `scripts/prerender.mjs` (HTML and tour), `src/lib/handoff.ts` (exports), `src/Builder.tsx` (canvas), `src/server/` (API rules), `functions/api/` (Cloudflare adapters), and `e2e/` (browser tests).

## Workflow composer

AI composition now requires a Clerk session while remaining free. The public library,
canvas and browser assembly remain open. See `../docs/FREE-WORKFLOW-ACCOUNTS.md` for
the linked application, local setup, production rollout and usage reporting. Apply
`migrations/0005_composer_accounts.sql` after the existing composer migration before
deploying the new backend. Do not enable AI with development Clerk keys on the public domain.

`/compose` offers free assembly and AI composition, without a paywall. Free assembly runs in the browser: weighted catalogue search, synonyms, reviewed domain recipes, typed dependencies and explicit input conversions. The existing builder uses the reviewed free methods for supported goals too. Users can edit, reorder, add or remove steps; export/import `workflow.edit.json`; open the canvas; and download the README, handoff, input list and complete skill assets.

The AI route sends the request, explicitly added context and retrieved block descriptions to the selected provider. Saved business context is opt-in. It creates a pack, rather than executing skills or scheduling agents. The service defaults to GPT-6 Luna with structured output, semantic retrieval, one quality critique and at most one repair. The 23 October final tuned sample and separate regression set passed 19/20 and 10/10 independent plan checks. The n8n example is flagged for review. The 20-example run averaged $0.00132 in calculated generation usage including routing/review/repair ($0.00150 without input-cache discounts); these are not production success-rate estimates or execution costs. Model selection is server-owned. `WORKFLOW_DEFAULT_MODEL` accepts `claude-haiku-5-5`, `claude-sonnet-5-5`, `gpt-6.1-sol` or `gpt-6-luna` for controlled testing. Clients cannot override it and GET exposes availability only. Current exact recommendations are in `../reports/2026-10-23-luna-workflows/index.html`; the older Sol comparison remains historical evidence in `../reports/2026-10-22-workflow-fresh20.html`.

Local Vite development reads only named provider/configuration values from the repo's `.env` or existing parent `.env`. Keys stay on the server and are never `VITE_` variables. The dev ledger is in memory and resets on restart. The defaults are $10/day across AI generation and voice transcription, five attempted generations per account/day, and ten attempts per IP/day. Failed and pending attempts count; retries of a completed request do not. Limits reset at 00:00 UTC (05:30 India time). WORKFLOW_DAILY_ATTEMPT_LIMIT configures the account allowance. Hosting/request charges are separate. Request and context limits are 10,000 and 4,000 characters. Duplicate request IDs are served from the ledger; transport failures with unknown billing retain their reservation.

For production, apply `migrations/0004_composer.sql`, bind that D1 database as `COMPOSER`, and add provider keys as Cloudflare server secrets. Set `WORKFLOW_COMPOSER_ENABLED=true`, a random `WORKFLOW_SALT`, `WORKFLOW_DAILY_CAP_USD=10` (or a deliberately chosen cap), and optionally `WORKFLOW_DEFAULT_MODEL=gpt-6.1-sol`. AI composition stays disabled without enablement, storage or the chosen key. Free assembly still works. Do not expose the in-memory dev ledger as a production spend control. Monitor reservations and review unknown-outcome failures before releasing their budget. Job results contain user requests and plans: choose and implement an appropriate retention policy before a public launch.

Run `npm run test:unit` for planner, provider-adapter, API, ledger and catalogue checks. `npx playwright test e2e/composer.spec.ts` uses recorded real-model plans for ten full ZIP-export checks without provider calls. `npx playwright test --config playwright.composer.config.ts` explicitly enables one paid model-to-browser-to-ZIP smoke test on a stable local server. It uses installed Chrome and the dev cap; its report records usage, calculated cost, ZIP contents and browser errors.

From the repo root, `node tools/benchmark-workflows.mjs --label YOUR-NEW-LABEL --cap 22` tests twelve models on the same ten tasks and blind-grades valid plans. Existing local credentials are required. Use `--models MODEL-ID,MODEL-ID` or `--cases CASE-ID` for a subset. Failed attempts count toward spend when usage is known; unknown transport charges are identified separately. A changed planner requires a fresh label. Inputs, source snapshots and a fingerprint are saved under ignored `runs/workflow-benchmark/`. Judging is offline evaluation, not a cost attached to each customer pack. Ten tasks do not establish a production failure rate. The current pilot grades plans and handoff packs; it does not verify that every final website, campaign or other executed outcome succeeds.

Voice input captures microphone audio through Web Audio and sends canonical 16 kHz mono PCM WAV to the protected /api/transcribe Worker endpoint. OpenAI whisper-1 returns editable text; nothing is auto-submitted to the composer. A cumulative five-minute visit limit and 10,000-character request cap apply. The server verifies duration from actual samples and reserves transcription cost atomically against the shared daily composer cap. Turnstile, same-origin checks, request IDs and API/AI rate limiters protect paid calls. Audio and transcripts are not stored in the server usage ledger. Unsupported or denied microphone access keeps typing available. tools/check-voice-browser.mjs verifies actual Chrome capture with a synthetic fixture and one real provider call; the ordinary voice browser and unit tests use fixtures without provider calls.

The new20-request benchmark uses --suite fresh. Baseline runs are composer-fresh20-baseline (Haiku/Sonnet/free) and composer-fresh20-openai-baseline (Sol/Luna/free). Follow-up fixes are explicitly in-sample. The Luna response adapter now extracts final_answer instead of concatenating intermediate commentary; generation failure rates before that fix include this integration defect. See the fresh20 report for measured results and limits.

For all 20 fresh free requests through browser ZIP export, run `npx playwright test e2e/composer-fresh.spec.ts --config playwright.stable.config.ts --workers 3`. The final measured repair run is `composer-fresh20-free-repaired`, balanced initial comparison `composer-fresh20-baseline-balanced`, paid follow-up `composer-fresh20-improved`, and final Luna output-cap retest `composer-fresh20-luna-8k`. Run `node tools/report-workflow-fresh.mjs` from the repository root to regenerate the comparative evidence without API calls.


First-output planning now uses general artifact/producer contracts, required-producer retrieval, explicit recurring setup, Luna low reasoning and schema-enforced existing limits. The first-output report at `../reports/2026-10-23-luna-first-output/index.html` contains twenty untouched first responses, without completion badges. See `../docs/LUNA-WORKFLOW-QUALITY.md` for costs, evidence and unresolved gaps. Production keeps its existing review/repair defense; first-output measurements exclude it.
