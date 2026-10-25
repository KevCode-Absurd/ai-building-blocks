# Progressive home loading and first-paint release

## Change

- Home visits now load the four reviewed starter picks first. The 5,005-record catalogue is requested when a visitor opens the library, uses search, filters, selects the workflow action, or scrolls into the library.
- The decorative globe stays behind the hero and is isolated by an error boundary, so a failed globe chunk/canvas cannot replace the usable page with recovery UI.
- If the full catalogue fails after starter picks load, the starter content remains visible with a retry action.
- The startup test harness now covers Vite source modules and production hashed chunks. The no-JavaScript fixture checks actual root markup, not a selector string in the HTML script.

## Validation

- `npm run build`: passed on 2026-10-25. Vite produced the production bundle; prerender completed 5,200 pages, and the output guard reported 27,048 files.
- Homepage, startup/loading, and platform-simplicity browser suites on the API-enabled local Vite server: **20/20 passed** after the test fixture corrections.
- The broader selected browser matrix ran before the latest test corrections: **46 passed, 16 failed, 1 skipped** out of 63. Failures covered account settings, search-worker lifecycle/count, navigation, persistence, and workflow selectors/execution. This run is not a full-suite pass; those failures need separate triage.
- Unit suite: **225 passed, 11 failed** out of 236. Failures were in route-count, config/account-boundary, idempotency/budgeting, provider-adapter, and route-count expectations. They are not reported as passing.

## Local mobile performance comparison

Three cold runs per version, 390×844 viewport, DPR 2, 4× CPU throttling, 1.6 Mbps / 150 ms network emulation, synthetic auth/API responses, local static asset snapshots, Brotli transfer. These are controlled local measurements, not field Core Web Vitals or PageSpeed Insights.

| Metric | Frozen baseline | Candidate | Change |
|---|---:|---:|---:|
| Home heading visible | 1,902 ms | 1,709 ms | −10.1% |
| First Contentful Paint | 1,204 ms | 1,096 ms | −9.0% |
| Largest Contentful Paint | 1,780 ms | 1,484 ms | −16.6% |
| Longest main-thread task | 768 ms | 169 ms | −78.0% |
| Sum of long tasks in capture window | 1,182 ms | 233 ms | −80.3% |
| Transferred JS + CSS + catalogue data | 704,588 B | 129,495 B | −81.6% |
| CSS transfer / CSS requests | 47,339 B / 5 | 23,777 B / 3 | −49.8% / −2 requests |
| Full catalogue requested on first home visit | yes | no | deferred |

The candidate's initial main bundle is 211.41 kB (72.45 kB gzip), main CSS 100.77 kB (20.11 kB gzip), and the deferred globe chunk 17.66 kB (5.50 kB gzip). The Clerk chunk remains 1.58 MB (588.72 kB gzip) and is not needed for the public first screen.

## Release state and rollback

- No claim of production deployment is made in this report. The latest verified production version before this attempt was `1e38049b-4107-4d93-95ff-d27ba1ec4e76`; its worker SHA-256 was `bc749ed3169c246afe3303bb85e5c1882ed93c5ca5beaf64f0b4e4daaad5e9fd5`.
- A fresh Cloudflare preflight using the existing Wrangler credential returned HTTP 401. Until that credential is reauthenticated, current production version/settings cannot be freshly verified and deployment must not proceed.
- The rollback target, pending a successful deployment, is the previous verified version above. No database writes, migrations, secret changes, or Worker code changes are part of this frontend candidate.
- The deployment overlay must begin from the frozen `release-2026-10-25-discovery-final` asset tree; overlay only the new root HTML and hashed JS/CSS. Keep its full catalogue and four-entry starter JSON exactly as frozen, and verify all 73 sitemap/robots/llms discovery assets byte-for-byte before upload.
- Fresh public mobile PageSpeed Insights results are not available yet; no PSI score is claimed.
