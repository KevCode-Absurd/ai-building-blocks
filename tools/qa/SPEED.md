# Browser speed measurements

Run one build or browser measurement at a time on the laptop. Use the public production site for the final comparison. A local Vite preview has no production compression or edge cache.

`measure-speed.mjs` runs Lighthouse sequentially on the home page, a job hub, a skill and the planner, on mobile and desktop. Use three repetitions when comparing releases. It writes the full reports and a small JSON summary under `reports/`.

```powershell
node tools/qa/measure-speed.mjs --runtime <local-lighthouse-runtime> --repeats 3 --out reports/speed-final
```

The runtime directory must contain the official `lighthouse` and `chrome-launcher` packages. It is separate from application dependencies. The current audit uses Lighthouse 13.5.0 and the installed Chrome.

`measure-web-vitals.mjs` uses the official `web-vitals` browser library, a fresh Chrome context for each visit, and real typing and menu interactions. Mobile sessions use a 412 × 823 viewport, 4× CPU slowdown and a 1.6 Mbps connection with 150 ms latency. Desktop sessions use a 1440 × 900 viewport without throttling. Non-read requests are blocked; tests never submit a workflow or call a model.

```powershell
node tools/qa/measure-web-vitals.mjs --runtime <local-web-vitals-runtime> --repeats 3 --out reports/vitals-final
```

That runtime must contain the official `web-vitals` package (6.2.3 for this audit). Both commands accept `--routes`, `--profiles`, and `--origin http://127.0.0.1:5191` for diagnosis. Keep baseline and final output in different folders.

Report navigation load time, first contentful paint, largest contentful paint, layout shift and sampled interaction latency. Lighthouse total blocking time is not INP. Controlled interactions are not real-user field percentiles. PageSpeed Insights or Search Console must supply any field-data claim; report unavailable data honestly. Compare repeated results and investigate the actual request or long task before changing code. Do not change content, recommendation floors, privacy rules or account behavior to improve a score.

## Ecommerce release checks

The audit tools also accept `https://agents.useaiblocks.com`, its staging origin and the isolated Worker at `http://127.0.0.1:5290`. Complete the build before starting the local Worker: asset generation triggers reloads and invalidates measurements. Do not run benchmarks or another browser audit concurrently with a speed measurement.

`node tools/qa/check-ecommerce-release.mjs --origin http://127.0.0.1:5290 --out <private-evidence-folder>` checks the source roster against all ecommerce pages, server metadata, public download availability, selected ZIP bytes, mobile/desktop search, keyboard tabs, retrieval and download controls. It blocks browser writes. Use the final built candidate when comparing served ZIP hashes. Inspect its screenshots; automatic overflow checks do not establish visual quality.

For speed use `/e-commerce,/agents/lindsey-meta-media-buyer,/connect`, mobile and desktop, three sequential repeats. Assess each route/profile median, not a cherry-picked run: performance at least 90, LCP at most 2500 ms and CLS at most 0.1. Record every run and any outlier. Public production SEO and accessibility scores should each be at least 95. Local/staging intentionally disallows indexing; inspect the individual SEO audits and expect that single indexability exclusion instead of weakening production checks. Preserve failed attempts separately and remeasure changed pages. Local results do not establish edge performance or field INP. Run production readbacks and repeated speed checks after deployment as well.

These web checks supplement the agent output reviews and unit/export checks. None substitutes for the other or authorizes paid model calls, authenticated account actions, live customer messages or ads.

## Wait for seeded directory content after deployment

A successful Worker upload does not mean the seeded directory is current. Production's 15-minute scheduled task calls `seedIfContentChanged`, which refreshes changed house profiles and house runner packages; public roster caches can take another minute. Do not accept the old roster, or a matching count with stale profiles, as a completed release. Check scheduled-task errors if the bounded wait expires.

After the intended deployment, an authorized operator captures a read-only D1 result with `SELECT id, kind, status, content_hash FROM personas WHERE kind = 'house' ORDER BY id` from the matching production or staging database. Save Wrangler's JSON output in a private evidence folder. No profile text, credentials or customer records are needed. Refresh this file after the cron; the helper rereads it each attempt. Preserve earlier captures separately.

```powershell
node tools/qa/wait-ecommerce-release.mjs --origin https://agents.useaiblocks.com --out <private-report.json> --d1-readback <private-d1-result.json> --d1-database ai-blocks-agents --deployed-at <deployment-completed-UTC-ISO-time> --timeout-seconds 1200 --interval-seconds 30
```

The helper performs only public GET requests, sequentially with at least 1.1 seconds between request starts. A 429 waits for `Retry-After` (60 seconds when absent), within the same deadline. Run it alone; allow at least 300 seconds for a full 78-profile pass with rate-limit recovery. It compares the exact source roster, every source-controlled public profile field, and every expected house `content_hash` computed with the application's `personaHash`. Enriched job/toolbox fields are excluded from the public comparison; the full hash includes hidden methods. The database name must match the origin and the snapshot file must be newer than the declared deployment and under 30 minutes old. These bindings are operator-supplied evidence, not cryptographic authentication; the report records them and the snapshot hash. Use the release checkout, not a different branch.

Exit 0 (`READY`) requires all checks. Exit 1 means bounded timeout; exit 2 means invalid input or public-only results that cannot certify hidden methods. Public APIs deliberately omit `profile.method`, so omitting the D1 snapshot never produces a full pass. Do not use a static pack download as proof that database profiles were seeded. Keep this check separate from pack-byte, UI, SEO, speed and output-quality evidence. A rollback changes the code content fingerprint too; its subsequent cron can refresh old content, so verify against the version intentionally left live.
