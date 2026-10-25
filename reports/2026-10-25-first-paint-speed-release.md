# First paint and globe performance release

**Status:** deployed and live-verified on 2026-10-25. Production Worker version: `2f704bc0-9280-4928-890a-f87888aa169f`. Previous verified version: `46ccb863-c0f8-4200-bc1e-42280d8aefeb`.

## User-visible changes

- Replaced the text-heavy boot screen with the small “AI Blocks” mark and a short animated progress cue. The page content is covered while the app starts, then the app replaces the boot screen without a duplicate heading.
- Rendered the homepage heading and search before requesting the decorative globe. On a live mobile browser, the heading was ready at 695 ms; no globe request had started. The globe request started at 1,627 ms and finished at 1,779 ms, while the heading stayed unchanged.
- Reduced the globe point count, mobile canvas resolution and idle frame rate. Globe motion is slower. The workflow diagram toolbar remains; only its instruction sentence is hidden.

## Tests and live checks

- Production build: passed.
- Unit suite: 511 passed, 0 failed.
- Focused desktop/mobile production-bundle E2E: 31 passed, 0 failed, 1 expected skip. Covered startup without a text wall, delayed auth/globe, responsive navigation, library search, workflow help and diagram controls.
- Live read-only browser checks: homepage (mobile), tools, Minds, API/MCP docs and composer all returned HTTP 200, with no browser exceptions or server errors. Cloudflare version, Worker hash, live settings and bindings match the frozen candidate. No migrations, database writes or provider calls.
- Broader legacy E2E attempts were not clean and are not counted as passes. Some tests use retired account-link/compose-tab selectors; one such persistence selector failed the same way against the old production preview. The static QA server intentionally returns 503 for unmocked protected APIs, so API-dependent tests need an API-capable local fixture to complete.

## Performance comparison

Three cold Chrome runs per scenario, identical local production assets, mobile emulation at 390×844 with DPR 2, no network/CPU throttling. These are local measurements, not field Web Vitals.

| Mobile scenario | Before | After | Change |
| --- | ---: | ---: | ---: |
| Homepage search interactive | 366.9 ms | 280.0 ms | 86.9 ms faster (23.7%) |
| Homepage with optional starter delayed 1.5 s | 1,677.1 ms | 255.7 ms | 1,421.4 ms faster (84.8%) |
| Decoded JS on homepage | 227,293 B | 219,566 B | 7,727 B lower (3.4%) |
| Long-task blocking on homepage | 83 ms | 62 ms | 21 ms lower (25.3%) |

The optional starter test delays only that payload. The measurement does not represent real-user latency or a PageSpeed score.

## Deployment and rollback

- New Cloudflare version: `2f704bc0-9280-4928-890a-f87888aa169f`.
- Previous verified version: `46ccb863-c0f8-4200-bc1e-42280d8aefeb`.
- Live Worker code, bindings, secrets/settings fingerprints and databases were preserved. This was a static asset release; no D1 migration or data write ran.
- Roll back by activating the previous Worker version `46ccb863-c0f8-4200-bc1e-42280d8aefeb` in Cloudflare Workers Versions. Its frozen asset snapshot remains in the local ignored release archive `site/.wrangler/releases/release-2026-10-24-minds-browse`.

Evidence: `2026-10-25-first-paint-mobile-fast.json`, `2026-10-25-first-paint-speed-release.json`, `2026-10-25-speed-comparison.json` and the live verification record in the frozen release archive.
