# Claude blind test of Quality Engine v3.4, 13 November 2026

v3.4 fits the job to its card:
- The card sets the questions, acceptance tests, format gates and levers.
- Grounding is sized to the card. A reply, memo or brief gets no site capture and no taste brief.
- New work counts as new, not as an edit of existing work.
- At light and standard depth, one fresh reader runs the tests and picks the final answer.
- One `qe-check` command runs every check.
- The front door is trimmed: prepare_job_context and start_job share the same context.

v3.4 passed every gate set before the run, on brands and deliverable types never benchmarked before.

| Panel | Verdicts | Wins | Ties | Losses | Win rate | 95% task interval | Clarity | Accuracy | Overall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| C34 (pre-registered, gates) | 48 | 44 | 4 | 0 | 91.7% | 75% to 100% | +0.08 | +0.73 | 7.81 → 8.63 |
| C34x (supplementary) | 48 | 44 | 4 | 0 | 91.7% | 75% to 100% | +0.15 | +1.04 | 7.63 → 8.73 |

Mean changes are out of 10. In C34, usefulness and accuracy rose most (+0.73 each), then specificity (+0.67) and craft (+0.42).

- **Ship gate**: more wins than losses, with no fall in mean clarity or accuracy. **Pass.**
- **Strict gate**: more than half of all verdicts are wins, with no clarity regression. **Pass.**

Every judge picked the same winner on every task: 8 judges on 12 tasks, across two models and two judging briefs. All 8 ties are F10, where the method shipped the plain answer byte for byte.

## What happened per task

| Task | Company | Deliverable | Shipped | Deciding difference the judges named |
|---|---|---|---|---|
| F01 | Patagonia | Product page copy | Edited | Fair Trade explained in Patagonia's own terms; an unsourced fit line replaced |
| F02 | Patagonia | Worn Wear trade-in SOP | Edited | A fill-in end-of-day count sheet; a credit script from the help center |
| F03 | Atlassian | Status-page incident update | Edited | Present tense; real status-page fields (component, status) |
| F04 | Atlassian | RFP security answers | Edited | Summary table and dated references; an undocumented early-deletion claim removed |
| F05 | Airbnb | Refund-exception decision rules | Edited | Flags that the public disruptive-events policy excludes personal illness; routes listing problems to the Rebooking and Refund Policy |
| F06 | Airbnb | Japan localisation brief | Edited | Live airbnb.jp price and date formats; invented age range and push limits removed |
| F07 | Wise | Business pricing FAQ | Edited | Fees match live wise.com; plain's "fixed fee plus percentage" was out of date |
| F08 | Wise | Board update | Edited | Plain's invented August commitment and 0.60% floor removed |
| F09 | Oatly | Host-read podcast ad | Edited | "Only say you use it if you do"; plain scripted a personal claim |
| F10 | Oatly | Press pitch | Plain | The fresh reader found no expert addition that helped, so the plain answer shipped |
| F11 | LEGO | Internal policy announcement | Edited | A box of points to confirm before posting (for example, Billund has no rail station) |
| F12 | LEGO | Supplier scorecard | Edited | Plain's spare-capacity sum was wrong (400m for 350m); LEGO's FSC licence and bag spec added |

Judges found no confident false fact in the shipped v3.4 answers. They found three in the plain answers: F07's fee model, F08's invented commitment and F12's sum.

## How it ran

- **Requests**:
  - 12 new Markdown requests, 2 each for Patagonia, Atlassian, Airbnb, Wise, Oatly and the LEGO Group.
  - All are deliverable types not used in earlier sets.
  - A separate agent wrote them and saw no method, card, answer or result. All 12 are held-out.
- **Plain arm**: fresh Claude Opus 5.5 contexts, request only, one pass, web allowed.
- **v3.4 arm**:
  - Fresh Opus contexts, given what prepare_job_context returns on branch `claude/next10-quality` at fa1f7edcd, the lead's method and the plain answer.
  - Each built, ran `qe-check`, and handed the final choice to a fresh subagent that saw only the request, the facts and two anonymous files.
  - All 12 final choices were fresh. None fell back to same-context.
- **Judging**:
  - Eight fresh judges, each on all 12 pairs with X/Y shuffled per pair.
  - C34 (the gate panel): j1 and i1 on Opus, j2 and i2 on Sonnet. j1 and j2 used `judge-brief-v3.md`; i1 and i2 used `judge-brief-independent-v3.md`, which was updated for this run's six companies.
  - C34x: four more fresh judges on the same pairs and key. It was added before packing, at the owner's request, and is reported separately.
  - Packing and tallying used `v3-bench.mjs`. Its key header says "Codex" because that word is hard-coded; this run is Claude.
- **Integrity**:
  - The protocol (sha256 9811ee88…) was frozen before any request was written.
  - The method was not edited until every v3.4 answer was written.
  - The key stayed sealed until all 48 gate verdicts validated.
  - An audit of every judge tool call found nothing opened outside each judge's folder, brief and results file. Two judges listed their panel's verdict folder while saving, which shows file names only; neither opened another judge's file.
- **Fact checking**: the Opus judges and C34x's Sonnet i2 checked facts against live sites. The other three Sonnet judges judged from what they already knew. Their verdicts matched the Opus judges' on every task.

## Cost

- **v3.4 arm**: 791,608 tokens and 227 tool calls for 12 tasks, about 66,000 tokens per task, including research and the fresh reader. This is far more than one plain pass.
- **Front door**: prepare_job_context plus start_job fell from 8,301 to 6,432 tokens per job (−23%). The shaped cards also drop the site capture and taste brief from replies, memos and briefs.

Files are in [results-claude-2026-11-13](results-claude-2026-11-13/):
- the protocol and the requests;
- the sealed key;
- raw verdicts for both panels;
- both answers per task;
- the expert's working notes;
- the routing each request received at fa1f7edcd.

## Limits

- Claude generated and judged the answers, so this covers one model family.
- The v3.4 arm read the plain answer and built on it, so the comparison is plain against plain plus the method.
- The judges are AI, not customers. Nothing here measures business results.
- 12 requests is a small set, so the interval is wide.
- The set has no HTML pages.

## Found along the way

Routing at fa1f7edcd was poor on these new deliverable types:
- 6 of 12 got the generic `_any` card (F01 to F05 and F12).
- Others got a near-miss card: F10, a press pitch, got crisis-response; F11, a policy announcement, got help-docs.
- Several got the wrong lead, for example a brand-identity designer for F01's product page and a meeting organiser for F03's status update.

The method still won because the lead picks a better card when the given one does not fit, but that costs time. After the run:
- nine new cards were added (press-pitch, rfp-response, sop, product-description, audio-ad-script, internal-announcement, vendor-scorecard, policy-doc, localisation-brief), each with a lead and two golden phrasings from brands outside this set;
- a code review's 11 findings were fixed.

On the final branch all 12 requests route to a fitting card and lead, single-lead, with no site capture for the shaped cards except F06, F07 and F09 ([routing-after.json](results-claude-2026-11-13/routing-after.json)). For example, F01 now goes to product-description with a product-page writer, F03 to crisis-response with an incident-report writer, and F10 to press-pitch with a press-release writer. Tests: 396 jobs tests pass; routing golden score old 69/76 (was 68), fresh 12/12, extra 24/24 (18 new), leads 20/20.
