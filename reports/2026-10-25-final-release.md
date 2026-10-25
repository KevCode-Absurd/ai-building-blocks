# Final production release — 25 October 2026

## Result

- GitHub branch `codex/mobile-speed-psi` pushed at commit `3774f61ab` (`Speed up homepage and add agency agent catalogue`).
- Cloudflare Worker `ai-building-blocks` deployed to `https://useaiblocks.com` and `https://www.useaiblocks.com`; active version `9f881e92-9a77-483c-acf1-b0e710860ea0` at 100% traffic (Wrangler deployment listing, 2026-10-25).
- Frozen upload manifest: 29,421 entries, 680,412,718 bytes total; SHA-256 `6c018f85a01b88d6274d519301996dde6c68053fe34c21044518bb32454fb4a6`. Wrangler uploaded 7,112 new/changed files (2,090.14 KiB; 438.10 KiB gzip). Existing frozen catalogue baseline was preserved and 283 reviewed agent profiles were added.
- Production bindings: 28 before and after; comparison passed. AI remains enabled and daily cap remains `$10`. No migration, D1 write, secret change or Worker-source change was part of this static asset release.

## Verification

- Exact frozen release asset browser matrix: **39/39 passed** across desktop and mobile. Covers first screen before the delayed globe, progressive catalogue loading, compact non-text-wall startup, catalogue fallback, diagram select/delete/undo/space-pan behavior, and workflow help. Command and output are captured in the task run history; the static test server used port 5195.
- Agency profile static checks: **283/283** source hashes, licences, archives, pages, search documents and API resources passed. Four representative desktop/mobile browser flows passed. Live read-only GET verification: **283 profiles / 1,135 requests passed**; evidence is in `2026-10-25-final-agency-live.json`.
- Production smoke test: **27/27 passed**, read-only, zero provider calls. It verified the root and critical public pages, production catalogue bytes, public API model picker allowlist, Turnstile/auth configuration, anonymous access guards, D1 reads, redirects and security headers. Evidence is in `cloudflare-production-smoke.json`.
- Controlled local mobile comparison (three cold runs each; 390×844, DPR 2, 4× CPU throttling, 1.6 Mbps / 150 ms; synthetic auth/API; not field PSI): heading visible 1,902→1,709 ms (−10.1%); FCP 1,204→1,096 ms (−9.0%); LCP 1,780→1,484 ms (−16.6%); longest main-thread task 768→169 ms (−78.0%); JS+CSS+catalogue transfer 704,588→129,495 bytes (−81.6%). Full catalogue is no longer fetched on initial home visit; it loads on library/search/filter/action/scroll. Detailed methods and caveats: `2026-10-25-progressive-home-speed-release.md`.

## Test caveats

- The complete unit suite is **225 passed / 11 failed of 236**. Failures include route-count and Composer request-size/provider/idempotency expectations. The full legacy end-to-end suite is **496 passed / 6 skipped / 308 failed of 810**; the broad failures include stale content/initial-card and old UI-label/selector expectations as well as other legacy account/navigation/persistence/workflow checks. These suites are not green and need separate triage. Targeted exact-release checks above passed; no claim is made that all account/API workflows have been end-to-end verified by this release.
- The production build succeeded before freezing the static candidate. Its working build included 5,288 local catalogue records; the frozen release was assembled from the live 4,995-record baseline and exactly 283 additions (5,278 total), rather than deploying unrelated local generated catalogue drift.
- No PageSpeed Insights field result is available. Local emulation is not a field Core Web Vitals result.

## Rollback

Previous verified Worker version: `1e38049b-4107-4d93-95ff-d27ba1ec4e76` (100% before this release). Per `docs/CLOUDFLARE-LAUNCH-2026-10-22.md`, restore code with `npx wrangler rollback 1e38049b-4107-4d93-95ff-d27ba1ec4e76`. This static release did not migrate or write D1; rollback does not revert any later database changes. Verify traffic and bindings after rollback.
