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
