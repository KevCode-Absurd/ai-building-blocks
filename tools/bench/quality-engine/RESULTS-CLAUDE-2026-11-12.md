# Claude blind test of Quality Engine v3.3, 12 November 2026

v3.3 adds the expert edge. Before editing, the expert lists up to three things this client needs that the plain answer lacks and checks each against a primary source. A tie at the final choice now goes to the expert version when a checked edge item survives. It passed both gates set before the run.

| Verdicts | Wins | Ties | Losses | Win rate | 95% task interval | Clarity | Accuracy | Overall |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 48 | 39 | 8 | 1 | 81.3% | 58.3% to 100% | +0.08 | +0.10 | +0.85 |

Mean changes are out of 10. Specificity rose most (+1.25), then usefulness (+0.81) and craft (+0.73).

- **Gate set for this change** (the standard approved for v3.2 on 12 Nov): more wins than losses, with no fall in mean clarity or accuracy. **Pass.**
- **Original strict gate**: more than half of all verdicts are wins, with no clarity regression. **Pass.**

By judging brief: the original brief gave 20/24 wins (clarity +0.21) and the independent brief 19/24 (clarity −0.04). All four judges picked the same winner on 11 of 12 tasks.

## What happened per task

The method edited 10 of the 12 answers. Those 10 won 39 of 40 verdicts; the one loss was a single Sonnet judge on E03, a Linear job post. In the other two, a fresh reader judged the expert additions unrequested, so the plain answer shipped byte for byte. Those were E07, a Ramp outbound sequence, and E11, Duolingo push lines. All 8 ties are those two identical pairs.

The deciding differences were checked facts that only an expert grounding step finds:
- Linear's real paid work trial in place of an invented take-home.
- Allbirds' posted return terms and its 2026 move from full-price stores to wholesale.
- SG Rewards' earn rate and 180-day expiry.
- Duolingo's free Mistakes practice from February 2026.
- Ramp's free plan and its accounting-firm invite rule.
- Grüns' 4-week cycle and 30-day guarantee.

Judges found no confident false fact in either arm.

## How it ran

- **Requests:** 12 new Markdown requests, 2 each for Grüns, Linear, Allbirds, Ramp, Sweetgreen and Duolingo. A separate agent wrote them; it saw no method, answer or result. All 12 are held-out.
- **Plain arm:** fresh Claude Opus 5.5 contexts, request only, one pass, web allowed.
- **v3.3 arm:** fresh Opus contexts given exactly what `prepare_job_context` and `start_job` return on branch `claude/top10-quality` at 302d9a749, plus the plain answer. Internal building was same-context. The final choice used a fresh subagent that saw only the request and two anonymous files.
- **Judging:** four fresh judges, j1 and i1 on Opus and j2 and i2 on Sonnet, each judged all 12 pairs with shuffled X/Y labels. j1 and j2 used `judge-brief-v3.md`; i1 and i2 used `judge-brief-independent-v3.md`. Packing and tallying used `v3-bench.mjs` (panel C33). Its report header and key say "Codex" because those words are hard-coded; this run is Claude.
- **Integrity:** the protocol (sha256 5e9bcfbf…) was frozen before any request was written. The key stayed sealed until all 48 verdicts validated. An audit of every judge tool call found nothing opened outside each judge's folder, brief and results file; one read was the judge's own oversized output, saved by the harness.

Files are in [results-claude-2026-11-12](results-claude-2026-11-12/): the protocol, requests, sealed key, raw verdicts, both answers per task, the expert's working notes and the routing each request received.

## Limits

- Claude generated and judged the answers, so this is one model family. The expert arm used far more compute than one plain pass.
- The judges are AI, not customers, and nothing here measures business results.
- 12 requests is a small set; the interval is wide.
- The set has no HTML pages.

## Found along the way

Routing on these fresh requests was weaker than on the benchmark set the router was tuned on:
- E05, a wholesale email, and E09, an agency creative brief, went to a store-email writer with the lifecycle-email card.
- E01, a support reply, also got the lifecycle-email card.
- E02, a finance decision memo, went to product management.

The expert still won those tasks, but these are routing misses to fix. They were not changed during this run.
