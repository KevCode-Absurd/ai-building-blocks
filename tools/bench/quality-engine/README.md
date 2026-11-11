# Quality benchmark

The referee for every change to how agents work (QUALITY-ENGINE.md, rule 10). A change to the work method, the
checker or a pack ships only if it wins this benchmark blind against a plain model.

## What is here

| File | What it is |
|---|---|
| `QUALITY-ENGINE.md` | Archived v2.1 method. The v3 method is in `marketplace/packs/shared/tools/quality/QUALITY-ENGINE-v3.md`. |
| `CHECKER.md` | How the engine's own reviewer judges: as the client and as a field expert, calibrated against outside judges. |
| `tasks.json` | 16 real requests for two real businesses: Grüns (gruns.co, 10 tasks) and Linear (linear.app, 6 fresh tasks). |
| `judge-brief.md` | Panel A's brief for blind judges. |
| `judge-brief-independent.md` | Panel B's brief, written by an agent that knew nothing about the method, with bias guards. |
| `bench.mjs` | `pack` makes the blind pairs and keeps the key; `tally` writes the results by set, panel, judge model and task. |

The hand-over check used in step 6 is the same tool every pack carries: `marketplace/packs/shared/tools/check-handover.mjs`.

## How to run it

Runs happen on your own machine and model account: no hosted jobs, no CI.

1. Make a run folder. For each task, put a plain model's answer in `<run>/plain/<id>/final.<ext>` (the request alone,
   one pass) and the engine's in `<run>/engine/<id>/final.<ext>`.
2. `node tools/bench/quality-engine/bench.mjs pack <run>`.
3. Start at least 5 fresh judges (mixed models: Opus and Sonnet), each told only its judge id and its brief, with the
   brief's `<run folder>` set to your run. Use ids j1 to j5 for Panel A and i1 to i3 for Panel B.
4. Audit that no judge opened anything outside `<run>/judge/` (their tool calls), then
   `node tools/bench/quality-engine/bench.mjs tally <run>`.

Report the fresh set separately: tasks used to tune the engine are a development set, not a test.

## Results so far (11 Nov 2026)

| Version | Engine win rate (blind) | Notes |
|---|---|---|
| v1 | 46% of 50 | More accurate, but blanks, dense writing and a checker grading its own style |
| v2 | 85% of 80 | Ten fixes; outputs ran 2 to 4 times longer than plain answers |
| v2.1 | 88% of 128 | Length near the plain answer; Linear (fresh) 98%, Grüns 83%; Panel A 89%, Panel B 88% |

Limits: the judges are AI, not customers; the engine spends far more compute than one plain attempt; the checker was
calibrated on v1's judge verdicts.

## Separate Codex continuation

The original v3 runs stopped at Claude's weekly usage limit. The owner approved a separately labelled Codex continuation on 11 Nov 2026. Its results are kept apart from the earlier Opus/Sonnet benchmark.

- `tasks-v3.json` freezes 40 tasks across six companies: 16 practice and 24 held-out.
- `judge-brief-v3.md` and `judge-brief-independent-v3.md` preserve both blind panels. The second brief was authored before the continuation by an agent that did not see the methods.
- `v3-bench.mjs` packs anonymous X/Y pairs, requires phone and desktop screenshots for both versions of every HTML page, freezes source and screenshot hashes, and refuses incomplete or duplicate judging. It reports a seeded task-clustered bootstrap interval.
- Both generation arms use Codex. The engine may use the fresh request-only answer as its plain candidate; internal critique is labelled SAME-CONTEXT. External judges get fresh contexts and see no method files or key.
- Four judges cover every task, two per brief. The promotion gate is a strict majority of wins overall and on held-out tasks, with no mean clarity regression. Ties do not count as wins.
- Single-model AI preferences do not establish customer acceptance, business lift or a replication of the mixed-model Claude results.

With a run folder containing `tasks.json`, `codex/plain/<id>/final.*` and `codex/v3/<id>/final.*`:

```text
node tools/bench/quality-engine/v3-bench.mjs pack <run> P1 v3 <absolute renderer path>
node tools/bench/quality-engine/v3-bench.mjs tally <run> P1
```

The renderer is `marketplace/packs/shared/tools/quality/render.cjs`. Run from a host with Playwright and Chromium installed, or set `PW_CHANNEL=chrome` to use installed Chrome. Judges write `<run>/verdicts/P1/<judge>.json` using ids j1, j2, i1, i2. Keep `<run>/keys/` closed until all verdicts are in. To evaluate the 24-task v2.1 continuation, use a new panel name and the arm `v21`.
