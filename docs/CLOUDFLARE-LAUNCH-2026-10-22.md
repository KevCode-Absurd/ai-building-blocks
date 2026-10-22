# Workers Static Assets launch handoff — 22 October 2026

## R9 startup and session fix — live and verified

Kevin subsequently requested a quick animated loading screen. Candidate4 uses a themed assembling-block mark until the actual route is ready, supports reduced motion and saved light mode, preserves readable no-JavaScript pages and provides recovery if scripts/styles fail. Optional home/Space data does not delay startup. All12 focused actual-built browser checks pass, including lazy routes, old links, anchors, mobile, no-JavaScript and failure recovery. Earlier failed candidate checks remain in reports. Staging version `6c556ca3-f730-4a30-b249-ac51328e342d` matches frozen HTML/catalogue bytes and passes6 read-only checks.

A real human-verified AI attempt exposed an expired session token before provider access; the production composer ledger remained empty. The frontend now acquires its sign-in token immediately after human verification. The regression failed on the original code and all4 focused auth cases pass with the fix. The R9 build retains the reviewed Worker, catalogue and four package hashes. Production keeps free generation with the USD10 global UTC-day reservation budget. Source and evidence were pushed as `9d93068a` before publishing the exact staged snapshot. Production version `fcc0a974-2fce-4a16-8acb-0294a9ab6448` passes all27 production smoke checks and all12 actual live startup browser checks; all20 binding fingerprints are preserved. The initial text flash is resolved. One actual AI workflow canary is being handled separately in the auth chat after this session-timing fix. See `reports/cloudflare-r9-release.json`, `reports/startup-loading-candidate4/checks.json` and `reports/auth-token-timing-regression.json`.

## Public launch verified — 22 October

The finalized source and staging evidence were pushed as `badde294` and `56269425` before domain activation. Both production domains are attached to Worker version `87a8bdfb-ee9a-4341-9fa0-66214986b3f1`. All 27 production smoke checks and four exact ZIP downloads pass. Apex and www have valid TLS; www redirects to the apex with paths/queries preserved. Always Use HTTPS was enabled in the authenticated Cloudflare dashboard after a final check found unencrypted apex HTTP200; both HTTP hosts now return301 to HTTPS. Cloudflare DNS shows All set with no recommendations. Actual owner Google login and authenticated usage survive a reload. See `reports/cloudflare-production-smoke.json`, `cloudflare-production-artifact-downloads.json`, `cloudflare-production-https.json` and `cloudflare-production-google-login.json`. The historical preparation sections below retain their original chronology.

The original launch checks made no model calls. Kevin subsequently requested free AI generation with a global USD10/day limit and one real workflow test. Config/helper commit `0a6a3fd6` was pushed first, then version `d24c827d-ba6f-4fc8-b22f-b0dacdb4478e` enabled generation and the USD10 global UTC-day reservation cap. It retains identical R8 Worker code/assets and every prior binding, adding only the intended encrypted default-provider key. All27 production smoke checks pass again, including enabled availability and private metadata; tokenless composition is403. Exactly one real authenticated synthetic workflow was submitted; its real Turnstile checkbox awaits Kevin in the auth chat. No paid provider request has run yet. See `reports/cloudflare-production-ai-enable.json` and `reports/2026-10-22-production-launch.json`. This is an application reservation limit, not a provider-account billing cap. The initial unstyled text flash remains explicitly deferred by Kevin. Google OAuth uses basic identity scopes; the console remains External/Testing, so only the observed owner callback is claimed here.

Launch target: today, 22 October 2026 (Asia/Kolkata). The selected platform is **Workers Static Assets on Workers Paid Standard ($5/month minimum)**. Account authentication is working, and the account owner confirmed Paid is active. Separate staging/production databases have all three migrations. The release scope has expanded to include skill replacement/custom uploads and Turnstile/rate/preview protection; the deployment owner is building a complete immutable release before retrying upload. The prior upload's file disappearance came from a concurrent frontend-only rebuild removing prerendered pages. All source owners have now frozen writes. Live verification starts only after the confirmed deployed version. The current account/deployment record is `reports/cloudflare-live-release.json`; local reports alone do not certify a live release.

## Customer experience and capacity

Keep `https://useaiblocks.com` and all existing paths. The same frontend build, skill assets, ZIP downloads, calculators and saved Mercatura tour are served by the asset service. `_redirects` retains old-name 301s and the `/space`, `/people` and `/s/*` rewrites. `_headers` retains cache/security headers. Automatic HTML handling preserves extensionless pages and directory indexes; unknown pages use the real 404 page. There is no global SPA fallback.

`src/worker.ts` invokes the existing comments, spaces and composer adapters for `/api/*`. These use the same server rules and D1 bindings. Matching static assets bypass the application Worker. Missing typed block paths use a catalogue lookup to repair the canonical address; unknown slugs retain a real 404. `public/.assetsignore` excludes legacy Pages routing metadata from public assets; `_routes.json` does not control Workers routing. Internal rewrites target extensionless asset addresses so Workers does not redirect away from a shared token or space page.

Leave `assets.not_found_handling` unset: missing requests must reach the Worker for canonical repair. Its fallback fetches the same `/404` asset and returns it with HTTP 404. `assets_navigation_has_no_effect` makes missing browser navigations follow that routing too. Setting automatic asset `404-page` handling bypasses this repair and is deliberately not used.

Workers Paid supports **100,000 asset files per version**, with a **25 MiB per-file maximum**. The build and readiness checks use a 95,000-file guard. `CF_PLAN` and `PAGES_WRANGLER_MAJOR_VERSION` are no longer used. Verify the paid subscription before uploading more than 20,000 files. See [Workers limits](https://developers.cloudflare.com/workers/platform/limits/#static-assets).

The $5 minimum covers hosting/runtime allowances, with metered overages. External AI provider calls are billed separately. `WORKFLOW_DAILY_CAP_USD=2` is an application allowance based on estimated provider prices; it does not cap Cloudflare's total bill or guarantee a provider billing ceiling. Paid AI defaults to disabled. See [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

## 1. Verify the account and prepare configuration

Use Node 22 from `site/.nvmrc`. From `site/`:

```sh
npx wrangler login
npx wrangler whoami
npx wrangler d1 list
```

Select the intended Cloudflare account and confirm Workers Paid Standard is active. Inspect existing Workers, Pages projects and the production database in the dashboard to avoid duplicates. If there are multiple accounts, set `CLOUDFLARE_ACCOUNT_ID` explicitly for the intended account. The later authenticated inventory found one account, an active `useaiblocks.com` zone, no prior AI Blocks Worker/domain binding, and no existing D1 databases. The initial unauthenticated preparation result is superseded. Paid was confirmed by the account owner; the subscription API itself returned 403.

Copy `wrangler.example.jsonc` to ignored `wrangler.jsonc`. Replace the three production D1 placeholders with the existing production database ID, and the three staging placeholders with a separate test database ID. Within each environment, `COMMENTS`, `SPACES` and `COMPOSER` all point to the same database. Keep staging and production distinct. The template has no custom-domain route: cutover comes after preview verification.

If a database does not exist, create only the missing one:

```sh
npx wrangler d1 create ai-blocks
npx wrangler d1 create ai-blocks-staging
```

Back up/export existing production data before schema changes. Apply all three migrations (`0001_comments.sql`, `0002_spaces.sql`, `0004_composer.sql`); the numbering gap is intentional. They add tables/indexes without deleting current data.

```sh
npx wrangler d1 migrations apply COMMENTS --remote --env staging
npx wrangler d1 migrations list COMMENTS --remote --env staging
npx wrangler d1 migrations apply COMMENTS --remote
npx wrangler d1 migrations list COMMENTS --remote
```

Reuse the existing production D1 database and exact existing `COMMENTS_SALT`, `COMMENTS_TEAM_TOKEN`, `SPACES_SALT` and `SPACES_TEAM_TOKEN`. Changing salts can break access to existing spaces. Retaining the same HTTPS domain preserves browser-stored owner keys, kits, drafts and preferences. Copying the frontend alone is insufficient to preserve customer data.

## 2. Build, package and test

Review the complete launch changes, including untracked imports, composer files, Worker router and migrations. Git integration only includes committed/pushed files. From the repository root:

```sh
npm --prefix site ci
npm --prefix site run build
npm --prefix site run test:unit
node tools/check-cloudflare-ready.mjs
npm --prefix site run worker:dry-run
```

`worker:dry-run` uses the checked-in template to bundle the Worker and validate the asset configuration without uploading or requiring account credentials. The readiness report is `reports/cloudflare-launch-readiness.json`; it does not certify account billing, remote bindings or DNS.

Local emulator steps from `site/`:

```sh
npm run worker:local-config
npx wrangler d1 migrations apply COMMENTS --local --config wrangler.local.jsonc
npm run worker:dev
```

From another terminal at the repository root, run `node tools/check-cloudflare-local.mjs`. It verifies D1 persistence, authorization, sharing/link rotation, deep links, 301s, downloads, headers, 404s and disabled AI metadata without provider calls. The generated local config uses dummy IDs and test secrets; never deploy it or copy its secrets into production.

On this Windows checkout, the default configuration/temp/persistence paths are too long for reliable local runtime startup. Generate the config in a shorter directory and start Wrangler there. From `site/`, this PowerShell sequence reproduces the verified setup:

```powershell
$sitePath = (Get-Location).Path
$workerTestDir = 'C:\Users\kevin\.codex\visualizations\2026\10\22\01a161be-5eaa-7132-941f-374637f7e2aa'
npm run worker:local-config -- --directory $workerTestDir
Push-Location $workerTestDir
$env:CLOUDFLARE_CF_FETCH_ENABLED = 'false'
node "$sitePath\node_modules\wrangler\bin\wrangler.js" d1 migrations apply COMMENTS --local --config wrangler.local.jsonc --persist-to .workers-state
node "$sitePath\node_modules\wrangler\bin\wrangler.js" dev --config wrangler.local.jsonc --port 5183 --ip 127.0.0.1 --inspector-port 9237 --persist-to .workers-state
# After stopping the server:
Pop-Location
```

The local runtime needs permission to open loopback ports. These settings apply only to local verification. Use `npx playwright test --config playwright.worker.config.ts e2e/composer.spec.ts e2e/audience-starters.spec.ts` from `site/` to check the production build in that running emulator without regenerating assets.

## 3. Deploy staging and connect secrets

From `site/`, after replacing the staging placeholders:

```sh
npm run worker:staging
npx wrangler secret put COMMENTS_SALT --env staging
npx wrangler secret put COMMENTS_TEAM_TOKEN --env staging
npx wrangler secret put SPACES_SALT --env staging
npx wrangler secret put SPACES_TEAM_TOKEN --env staging
```

Use separate random test secrets in staging. Record the staging `workers.dev` URL returned by Wrangler and verify it before attaching the production domain. For production, use the same secret commands without `--env staging`, preserving existing values. Store secrets in the team's password manager; never in Git, `VITE_` variables, build logs or screenshots.

For paid AI, add `WORKFLOW_SALT` and `OPENAI_API_KEY`. The current release selects `gpt-6.1-sol` on the server, rejects client model overrides, and exposes only `{enabled:boolean}` at `GET /api/compose`. Free assembly works with paid AI disabled. Provider benchmarks are recorded separately from hosting verification. Enabling the live paid feature requires a working production provider secret and a bounded staging request that verifies D1 job persistence and duplicate protection. Then set `WORKFLOW_COMPOSER_ENABLED=true` in the intended environment and redeploy. Production and staging variables/secrets are separate.

For optional Workers Builds, use repository root `site`, build command `npm run build`, and deployment command `npx wrangler deploy`. Supply a populated account configuration via the approved deployment environment. The checked-in example is deliberately not the active production config; a GitHub push alone does not establish a live deployment.

## 4. Verify the experience before cutover

The live runner `tools/check-cloudflare-staging.mjs` requires `CF_STAGING_URL` to be the exact HTTPS staging Workers origin and `CF_STAGING_ISOLATED=true`. It verifies all three staging D1 bindings use a valid database ID distinct from production before making requests. It checks the deployed catalogue/skill/ZIP bytes against the immutable snapshot before synthetic fixture mutations. It removes its private item and hides its test comment when the staging moderation token is supplied in-process. The empty test space is recorded for optional database cleanup. Never print the token or pass it to the browser runner.

The security release accepts a private preview header or a signed 15-minute host-only browser session on staging requests. Load `PREVIEW_ACCESS_TOKEN` from ignored staging secret storage into `CF_PREVIEW_ACCESS_TOKEN` in-process. Browser fixtures inject the header only into requests to the verified staging origin; global browser headers would expose it to third-party Turnstile requests and must not be used. The hosting runner also authenticates once through `/__preview/login` and supplies the Secure/HttpOnly/SameSite=Strict cookie in memory so native attachment downloads receive preview access. Traces and video are off. `CF_RELEASE_DIST` points to the immutable deployed asset snapshot, and `CF_STAGING_VERSION` records the deployment owner's confirmed version.

The API runner refuses unauthenticated synthetic creation: it checks missing/wrong preview access and missing or forged real Turnstile tokens. The separate bounded AI burst runner never reaches a provider. Positive persistence/sharing checks consume `CF_STAGING_FIXTURES`, an ignored JSON file. Automated real-widget attempts returned Cloudflare error 600010 before success or POST, so no positive database-write pass is claimed. Use the normal owner browser instead: personally run `tools/open-private-staging.ps1`, create the exact synthetic space/comment requested by the security chat, and reload. After the owner explicitly copies the synthetic space's private link, `tools/capture-staging-owner-fixtures.mjs` reads it once in process, verifies the exact staging origin and synthetic name, reads back both records, writes the ignored fixture file, and clears the unchanged clipboard. Never paste private links into chat. Without verified fixtures the API report remains explicitly partial. No Turnstile bypass or automated CAPTCHA retry is enabled.

Both real widgets and separate server secrets are configured. Staging has nine server secrets including its development Clerk pair, preview credential and Turnstile secret; production has eight including the live Clerk pair. The private browser-login route is disabled in production. Production disables Workers and version preview URLs. Staging enables only its named Workers URL behind the whole-origin gate, with an exact API hostname allowlist and `assets.run_worker_first=true` so static assets are protected too. Both environments use the read/write/AI rate-limit bindings. The selected release keeps paid AI off.

Use `site/playwright.staging.config.ts` against the same verified origin for composer, fresh-workflow, audience, and selected site regressions. It has no build or local server step. These checks intentionally make no paid provider calls. Reports are `reports/cloudflare-staging-api-check.json` and `reports/cloudflare-staging-browser-check.json` after execution; their existence and results must be checked before claiming success.

- Open `/`, `/how-it-works`, `/minds`, `/tools`, `/compose`, `/space`, `/people`, a skill page and a shared-space URL directly. Verify an old skill address redirects and an unknown page returns HTTP 404.
- Check desktop/phone widths, keyboard navigation, search, 16-card pagination, workflow editing, canvas and exported ZIP contents. Compare the same pages and downloads with the previous deployment.
- Post/reload a comment; verify unauthorized moderation is refused. Create a space, save/reload an item, test read-only sharing and link rotation, and confirm private items stay off `/people`.
- Verify the same-origin `/example-app/` tour, its back link and its exclusion from indexing. The saved tour does not run new AI work.
- Check free composition and the model metadata endpoint with AI disabled. In staging, enable only the chosen provider and run a bounded paid request. Verify D1 job persistence and duplicate-request protection; confirm the budget limit leaves free assembly available. Do not exhaust the production allowance for testing.
- Inspect cache/security headers, browser errors, representative page timings and Worker CPU use. Record the tested revision, staging URL and measurements. Hosting similarity is not a measured performance guarantee.

## 5. Production deployment and the same domain

For today's release the deployment owner prepared ignored `site/wrangler.production.jsonc`, with all three bindings pointing to production database `ai-blocks` (`a886eeae-4014-4da2-842f-a5bebc4d7f71`). Its migrations are applied. Staging remains on `ai-blocks-staging` (`eeb9d0d4-cbed-4751-8df4-1aaf81fd6cb3`). Pass the deployment owner's frozen production configuration to production commands; the default active configuration was populated for staging and still has production placeholders. Production secrets are uploaded, including the separate live Clerk pair. The production Worker is uploaded without a public route; the current version and cutover state are recorded in `reports/cloudflare-live-release.json`.

Deploy the verified revision from `site/` without changing DNS first:

```sh
npx wrangler deploy --config wrangler.production.jsonc --env=
npx wrangler deployments list --config wrangler.production.jsonc --env=
```

Configure production secrets and verify the returned Worker URL. Confirm the domain's authoritative DNS is managed by Cloudflare; Workers custom domains require that. Preserve `useaiblocks.com` and its existing canonical URLs. If the domain is currently attached to Pages, record its current association and DNS records, then remove/replace the conflicting Pages association only at cutover and attach it to the Worker through Settings > Domains & Routes. Do not delete the Pages project or production database.

After cutover, verify TLS, root/deep links, redirects, real customer data access, APIs and downloads on the final domain. Check an existing browser's saved space rather than relying only on newly created fixtures. Do not submit an unverified domain to search engines.

## Verification snapshot and remaining release work

Current staging R8 is `80bc2a97-5835-4936-bd81-8c994a9552b6`, production preload `87a8bdfb-ee9a-4341-9fa0-66214986b3f1`. Both use the reviewed R7 Worker SHA `892f4aaae4cfd8dc723acc5ddf17f714c59416ee66b3d932057e590f76410d2c`. R8 adds truthful copy-failure handling and a manual private-device-link fallback on the space page. Its 96 unit checks, type check, build, 21 live API checks and four exact ZIP downloads pass. Real widget-created spaces and comments originated on R7; the unchanged backend, owner-confirmed reloads, R8 persistence and positive ownership/sharing checks are recorded explicitly in `reports/cloudflare-staging-real-writes.json`. No new R8 CAPTCHA creation is claimed. The API run removed its private item and hid both duplicate synthetic comments. Independent read-only reconciliation confirmed the owner key, old-link invalidation, rotated shared access, both hidden comments and two empty test spaces. Bounded cleanup removed the two exact empty test spaces, confirmed both test comments hidden and removed the ignored synthetic credential file. Under the final V3 ownership lock, the primary content/release chat owns cleanup, the mailbox chat owns the final Git push and guarded publication, and the hosting chat owns real-write proof. Current aggregate evidence is `reports/cloudflare-staging-final-check-summary.json`.

The earlier fully tested R6 frontend is version `74ec9f2e-07e4-4512-89bb-cb4e3aa842d3`. All **145 hosting/customer browser cases pass in one serial run** (667 seconds, zero failed/skipped/flaky), and **62 composer/replacement cases are covered successfully**: 53 initial passes plus all nine memory-affected cases passing on serial rerun against the same version. The four mocked account UI cases pass. This gives **211 successful baseline browser cases**, with **96 unit checks** passing. The initial concurrent R6 run hit local Node out-of-memory and Chrome insufficient-resource errors; that evidence remains in `reports/cloudflare-staging-browser-r6-resource-failure.json`. The successful rerun used one browser worker. Routing, exact asset downloads and signed private-preview authentication pass on R6. All 14 then-available API read/negative checks passed; the bounded staging AI probe reached HTTP 429 with Retry-After and no provider calls. This is historical regression coverage, not a claim that all 211 cases were rerun on R8.

Earlier staging R7 was `2ff0def4-30ae-41f6-abe6-0cbcadffdd10`, Worker SHA `892f4aaae4cfd8dc723acc5ddf17f714c59416ee66b3d932057e590f76410d2c`. It retained all R6 assets and 21 bindings. Live index, composer document and catalogue bytes matched R6. The update corrected the login document's referrer policy and synchronized the already tested planner function in the bundled namespace. The native form regression, 27 focused unit checks and type checking passed. All five actual live native-form checks passed without preview-header injection or an Origin override, including cookie-only login, reload, and refusal of a protected write without Turnstile. R7 routing and all 14 then-available API read/negative checks passed. Rate limiting is unchanged, so R6's bounded 429 evidence is retained without another burst near the owner's verification.

**The real-write and positive API gates now pass on the current R8 verification version**, with honest R7 creation lineage. The earlier real-browser login 403 is resolved: the old `no-referrer` policy generated `Origin: null`; the login document uses `same-origin`, with null and foreign origins still rejected. The remaining publication steps are bounded empty-space cleanup, final Git push, domain/TLS activation and final-domain smoke checks, including real customer sign-in. Paid AI remains off; no paid model calls were made during these checks.

The historical R4/R5 release contained **4,359 entries, 4,479 prerendered pages and 18,614 files**. The R5 backend passed **95 unit checks** and type checking. Coverage then comprised 210 ordinary browser cases, before the additional R6 planner regression. R4's first broad run passed 133/145; all twelve initial failures passed on the targeted R5 rerun. The actual legacy Apps 404 is fixed; test corrections and their reasons are recorded in `reports/cloudflare-staging-failure-resolution.json`, with the original failures preserved. R4 composer 61/61 and auth 4/4 passed. R6 results above supersede these earlier baselines. Auth and security UI mocks do not replace real provider authentication or Turnstile-protected persistence.

The earlier combined release contained **4,356 published entries and 18,603 files**. Its build, 45 unit tests and 37 composer browser cases passed locally; that earlier record is `reports/2026-10-22-composer-release-check.json`. The upload scan counted directories too. Those local results are historical and do not replace verification of the expanded release.

The earlier migration snapshot contains **4,355 published entries and 18,600 files**. Its full baseline build and 41 combined unit tests passed. After the final fallback adjustment, all five focused Worker router tests passed. `reports/cloudflare-workers-migration.json` deliberately retains that historical baseline.

The local Workers/D1 emulator passed 16 API/asset checks. Focused desktop/mobile browser verification covered 25 cases: 24 passed in the final combined run, and the canonical-link case passed on rerun after excluding Chrome's expected console message for the deliberately visited HTTP 404 document. All unexpected console errors remain failures. The audience chat separately passed four browser cases and 27 responsive views after its mobile filter fix. Reports: `reports/cloudflare-workers-migration.json`, `reports/cloudflare-local-api-check.json`, `reports/cloudflare-workers-browser-check.json`, `reports/cloudflare-workers-canonical-browser-check.json` and `reports/audience-browser-check.json`.

Authentication and owner-confirmed Workers Paid are ready. Separate staging and production D1 databases have all four migrations applied, and both environments' secrets are uploaded. Production is uploaded without a public route. Remaining release work is final-version browser/API verification, the normal-browser positive database-write and sharing gate, the bounded staging rate check, and then the production domain/TLS cutover and final-domain smoke checks. The deployment chat owns builds, immutable snapshots and cutover. A queued test or uploaded unrouted Worker is not a passing production result. Today's release keeps paid AI disabled.

Historical R8 deferral, superseded by Kevin's later explicit R9 request above: navigation briefly shows a wall of text before the final layout settles. He confirmed the Make my space interface is visible and explicitly asked to change this later. Keep the current frozen release unchanged during write verification. In the next UI update, investigate initial CSS loading and prerender-to-client route transitions, including the `/space` rewrite; the cause is not yet established. Show a short, accessible loading state until the initial route and styles are ready, then reveal the stable layout without the text flash. Preserve deep links, indexing, useful no-JavaScript content and recovery from a failed script load. Verify fresh navigation and reload at desktop and phone widths.

## Rollback

Record the prior Worker deployment ID before future deployments. Roll back a Worker release with `npx wrangler rollback <VERSION_ID>` after checking the desired version. If the initial move fails, restore the recorded Pages domain association/DNS while leaving its previous deployment intact. Worker rollback alone does not restore domain ownership to Pages.

Keep production D1 bindings and salts unchanged during rollback. Code rollback does not undo D1 writes or migrations; preserve backups. Stop new paid AI work by setting the production enablement flag to `false` and redeploying; requests already started may still be billed. Check account-wide Workers, D1 and provider usage after launch.

Sources: [Pages-to-Workers migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/), [asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/), [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/), [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/).
