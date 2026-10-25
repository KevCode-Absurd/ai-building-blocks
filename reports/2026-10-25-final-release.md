# Final production release — 25 October 2026

## Result

- GitHub branch `codex/mobile-speed-psi` pushed at commit `3774f61ab` (`Speed up homepage and add agency agent catalogue`).
- Cloudflare Worker `ai-building-blocks` deployed to `https://useaiblocks.com` and `https://www.useaiblocks.com`; final corrected version `00f60059-1944-4a08-8234-ab5f6dbc2124` is at 100% traffic (Wrangler deployment listing, 2026-10-25). The initial version `9f881e92-9a77-483c-acf1-b0e710860ea0` was superseded after a byte-integrity audit found discovery-file drift.
- Final frozen upload manifest: 29,421 entries, 680,334,499 bytes total; SHA-256 `962ea05ee96e382f745d9e9764d9444aede922231fbe708847d709b8982116a1`. The first upload sent 7,112 new/changed assets (2,090.14 KiB; 438.10 KiB gzip); the corrected rollout reused those already-uploaded asset bytes.
- A post-deploy audit found 51 of 73 protected `sitemap`/`robots`/`llms` files differed from `release-2026-10-25-discovery-final`. I restored only those 73 files from that frozen baseline, verified each baseline SHA-256 locally, and deployed the corrected package. Read-only live verification then passed **73/73** files; evidence is in `2026-10-25-final-discovery-live.json`.
- Existing frozen catalogue baseline was preserved and 283 reviewed agent profiles were added.
- Production bindings: 28 before and after; comparison passed. AI remains enabled and daily cap remains `$10`. No migration, D1 write, secret change or Worker-source change was part of this static asset release.

## Verification

- Exact corrected frozen release asset browser matrix: **39/39 passed** across desktop and mobile after restoring the 73 discovery files. Covers first screen before the delayed globe, progressive catalogue loading, compact non-text-wall startup, catalogue fallback, diagram select/delete/undo/space-pan behavior, and workflow help. The static test server used port 5195.
- Agency profile static checks: **283/283** source hashes, licences, archives, pages, search documents and API resources passed. Four representative desktop/mobile browser flows passed. Live read-only GET verification: **283 profiles / 1,135 requests passed**; evidence is in `2026-10-25-final-agency-live.json`.
- Final-version production smoke test: **27/27 passed**, read-only, zero provider calls. It verified the root and critical public pages, production catalogue bytes, public API model picker allowlist, Turnstile/auth configuration, anonymous access guards, D1 reads, redirects and security headers. Evidence is in `cloudflare-production-smoke.json`.
- Controlled local mobile comparison (three cold runs each; 390×844, DPR 2, 4× CPU throttling, 1.6 Mbps / 150 ms; synthetic auth/API; not field PSI): heading visible 1,902→1,709 ms (−10.1%); FCP 1,204→1,096 ms (−9.0%); LCP 1,780→1,484 ms (−16.6%); longest main-thread task 768→169 ms (−78.0%); JS+CSS+catalogue transfer 704,588→129,495 bytes (−81.6%). Full catalogue is no longer fetched on initial home visit; it loads on library/search/filter/action/scroll. Detailed methods and caveats: `2026-10-25-progressive-home-speed-release.md`.

## Test caveats

- The complete unit suite is **225 passed / 11 failed of 236**. Failures include route-count and Composer request-size/provider/idempotency expectations. The full legacy end-to-end suite is **496 passed / 6 skipped / 308 failed of 810**; the broad failures include stale content/initial-card and old UI-label/selector expectations as well as other legacy account/navigation/persistence/workflow checks. These suites are not green and need separate triage. Targeted exact-release checks above passed; no claim is made that all account/API workflows have been end-to-end verified by this release.
- The production build succeeded before freezing the static candidate. Its working build included 5,288 local catalogue records; the frozen release was assembled from the live 4,995-record baseline and exactly 283 additions (5,278 total), rather than deploying unrelated local generated catalogue drift.
- Fresh public mobile PageSpeed Insights lab run after the corrected deployment: [report](https://pagespeed.web.dev/analysis/https-useaiblocks-com/gva14qosqw?form_factor=mobile), captured 2026-10-25 16:44:15 Asia/Kolkata for version `00f60059-1944-4a08-8234-ab5f6dbc2124`. Performance **94**; FCP **1.8 s** (1,810 ms), LCP **2.4 s** (2,414 ms), TBT **70 ms** (71 ms), CLS **0**, Speed Index **4.16 s**. This is a Lighthouse lab run, not field/user data. The captured audit also identifies 18.3 KiB estimated unused CSS in the deployed 21.4 KiB main stylesheet; no CSS change was made after the measurement.
- The unauthenticated PSI API call separately returned HTTP 429 because its project quota is zero, but the public PageSpeed web UI produced the linked report. The UI screenshot and capture are retained in the companion task’s evidence folder.

## Rollback

Previous verified Worker version: `1e38049b-4107-4d93-95ff-d27ba1ec4e76` (100% before this release). Per `docs/CLOUDFLARE-LAUNCH-2026-10-22.md`, restore code with `npx wrangler rollback 1e38049b-4107-4d93-95ff-d27ba1ec4e76`. This static release did not migrate or write D1; rollback does not revert any later database changes. Verify traffic and bindings after rollback.
