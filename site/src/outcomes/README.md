# Outcome orchestrator

Turns "my business isn't doing well" into a finished, measured result, run by our specialists inside the owner's own AI. There are no playbooks per outcome: for each job the host AI pins the outcome down, researches how experts in that industry do it (the owner's memory, our catalogue, the web) and composes a plan from our specialists and items. We check the plan against our rules and the live catalogue; the owner approves it; then it runs. The plan and the reasons behind it are in `docs/OUTCOMES-PRD.md`.

| File | What it does |
|---|---|
| `method.mjs` | The method, written once for every outcome: the brief frame, research protocol, stage kinds and composition rules. |
| `plan-contract.mjs` | Checks the brief, the research and the composed plan: 11 stage kinds in order, every research step carried out or dropped with a reason, at least one source outside our catalogue, decisions always need the owner, live actions need approval of each action, nothing is built before the owner chooses. Catalogue gaps are allowed and reported. |
| `engagement.mjs` | One owner's job through DEFINE → RESEARCH → PLAN_REVIEW → RUN: plan approval, revisions that keep unchanged finished stages, gates, autonomy, missing-data blocking, stage prompts, the files for `outcomes/<id>/` and the anonymised plan pattern. Refuses anything that looks like an API key. |
| `records.mjs` | Decisions (passing over the top option needs a reason) and experiments (registered before launch; low volume means INCONCLUSIVE; a broken guardrail is never a WIN). Returns lines to append, learning candidates and an anonymised outcome report. |
| `outcome-mcp.mjs` | Four tools: `start_outcome`, `advance_outcome`, `record_outcome_decision`, `record_outcome_experiment`, plus the catalogue resolver that checks a submitted plan's specialists and items. Two opt-in tools, `read_back_outcome_experiment` and `prepare_outcome_pattern`, are routed by `callOutcomeTool` but listed separately in `outcomeLoopMcpTools`. |
| `monitoring.mjs` | Scheduled read-backs (B4): the schedule and routine prompt for a host scheduler, and the read-back that compares a reading with its registration, flags guardrail breaches and closes the test with an honest verdict. Budget ideas are proposals only. |
| `patterns.mjs` | Plans that worked (B5): the anonymiser, opt-in consent to the exact file, the review queue format, the reviewed-pattern-to-workflow-draft export and the catalogue-gap report. |
| `examples/rising-cpa.mjs` | A worked example of a good brief, research and plan, offered with `include_example`. Illustrative, not a playbook. |
| `evals/` | 30 golden requests across six industries (`cases.mjs`), what an expert would cover for each (`expect.mjs`, never shown to hosts), the scorer and the broken-plan controls (`rubric.mjs`), the harder v2 rubric (`rubric-v2.mjs`), stage-output grading (`stage-grading.mjs`), recorded runs (`recorded/`) and the scorecard that gates releases (`SCORECARD.md`). |

Everything is stateless. The host keeps `engagement.json` and sends it back with its `engagement_sha256`; the brief, research and plan are re-checked on every call. No model, storage, schedule or account access runs here.

## Try it

The four tools are in the local MCP preview (`site/scripts/scoping-mcp-preview.mjs`, Node 24). Add it to Claude Code, Claude Desktop or Codex as a stdio server, then say what you want:

```text
My business isn't doing too well.
```

```bash
node --test site/test/outcomes.test.mjs
```

## Evals

`node tools/outcome-evals.mjs score` runs in every release. Each recorded run (one per golden request, made by a host AI from the owner's words and answers only) is replayed through the four tools, scored out of 100 for coverage an expert would insist on, and broken eight ways to prove the rules still refuse it. The release stops when a run is refused, a broken copy is accepted, a case falls more than 5 points or the average falls.

```bash
node tools/outcome-evals.mjs prompt local-salon-no-shows   # the brief a host AI follows to record a run
node tools/outcome-evals.mjs check site/src/outcomes/evals/recorded/local-salon-no-shows.json
node tools/outcome-evals.mjs score --write                 # after recording runs or changing the rubric
```

When the method changes, re-record the affected runs (the scorecard marks runs from an older method). The score checks coverage, not the quality of the writing or of the work the stages would do.

### Rubric v2

v1 averages 98, so it catches drops but can't rank good plans against great ones. `rubric-v2.mjs` is harder and is reported in the scorecard, not used as a gate: checks written for this job rather than the method's or the worked example's stock checks (20), hypotheses tested on the plan's own data with figures that decide them (15), primary, dated and corroborated sources (15), the owner's minutes from stops and manual data (15), measurement with a checked baseline, a volume set in advance, a comparison and guardrail stop rules (20), independent review and named unknowns (10), specialists and items (5). Across the 30 recorded runs v2 averages about 70 with a spread of 58 to 84. A fall of more than 5 points is printed but does not block a release.

### Grading stage outputs

Plans are only half the job. `stage-grading.mjs` holds the stage-output contract (outputs at their declared paths, a `## Checks` section with evidence for every check, a citation on every figure, a verdict for every hypothesis) and deterministic checks for it. For model-graded scores, a host AI that did not do the work follows `stage-prompt` and saves a grade file; we never call a model. Each grade pins the sha256 of every file it read, so it goes stale when the work changes.

```bash
node tools/outcome-evals.mjs stage-check outcomes/<id> diagnosis              # deterministic checks
node tools/outcome-evals.mjs stage-prompt outcomes/<id> diagnosis --case <c>  # the brief for a host AI grader
node tools/outcome-evals.mjs grades                                           # validate evals/graded/<case>/<stage>.json
```

No stage work has been recorded and graded yet. To record some, run a golden case past plan approval in a host AI, keep its folder in `evals/stage-runs/<case>/`, then grade each stage in a separate host session. `score` fails on an invalid or stale grade.

## Read-backs (B4)

Once a test is registered and launched, `read_back_outcome_experiment` without a reading returns `READBACKS.md` and a routine (cron plus prompt) the owner's AI can set up as a Claude Code scheduled task or any cron-style routine, if the owner agrees. On each run the routine reads the numbers read-only and sends them back. Mid-window it reports ON_TRACK or BEHIND and never gives an early verdict; a broken guardrail returns GUARDRAIL_BREACH with `ALERTS.md` at once; after the window it returns WIN, LOSS or INCONCLUSIVE under the same rules as `record_outcome_experiment`, with the close payload ready. Budget, pause and revert ideas come back as proposals with `applied: false`. Nothing is ever changed by us or by the routine.

## Plans that worked (B5)

After a finished round, `prepare_outcome_pattern` shows the exact anonymised `PATTERN.json` (names the owner wrote, figures, links, emails, phones and postcodes removed; names public sources use, such as platforms, kept) and its sha256. Only when the owner says yes to that sha256 does it return `PATTERN-SUBMISSION.json` in the review-queue format. Nothing is sent: the owner chooses to send it. A person at AI Blocks reviews it against a checklist (`pattern-review`); only an approved submission can be exported as a catalogue workflow draft (`pattern-export`), marked `status: draft` and `published: false`, which a person edits and moves into `catalogue-items/` by hand. `node tools/outcome-evals.mjs gaps` lists stages where no specialist fit, for phase 1.

## Making it better

Don't add playbooks. Improve the method (`method.mjs`), the rules (`plan-contract.mjs`) or the specialists and items plans are built from. Good plans come back as plan patterns, shared only with the owner's consent, and become catalogue workflows that later research finds.
