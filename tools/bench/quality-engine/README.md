# Quality benchmark

The referee for every change to how agents work (QUALITY-ENGINE.md, rule 10). A change to the work method, the
checker or a pack ships only if it wins this benchmark blind against a plain model.

## What is here

| File | What it is |
|---|---|
| `QUALITY-ENGINE.md` | The method being tested (v2.1). Packs carry its short form in `marketplace/packs/shared/WORK-METHOD.md`. |
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
