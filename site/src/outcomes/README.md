# Outcome orchestrator

Turns "my business isn't doing well" into a finished, measured result, run by our specialists inside the owner's own AI. There are no playbooks per outcome: for each job the host AI pins the outcome down, researches how experts in that industry do it (the owner's memory, our catalogue, the web) and composes a plan from our specialists and items. We check the plan against our rules and the live catalogue; the owner approves it; then it runs. The plan and the reasons behind it are in `docs/OUTCOMES-PRD.md`.

| File | What it does |
|---|---|
| `method.mjs` | The method, written once for every outcome: the brief frame, research protocol, stage kinds and composition rules. |
| `plan-contract.mjs` | Checks the brief, the research and the composed plan: 11 stage kinds in order, every research step carried out or dropped with a reason, at least one source outside our catalogue, decisions always need the owner, live actions need approval of each action, nothing is built before the owner chooses. Catalogue gaps are allowed and reported. |
| `engagement.mjs` | One owner's job through DEFINE → RESEARCH → PLAN_REVIEW → RUN: plan approval, revisions that keep unchanged finished stages, gates, autonomy, missing-data blocking, stage prompts, the files for `outcomes/<id>/` and the anonymised plan pattern. Refuses anything that looks like an API key. |
| `records.mjs` | Decisions (passing over the top option needs a reason) and experiments (registered before launch; low volume means INCONCLUSIVE; a broken guardrail is never a WIN). Returns lines to append, learning candidates and an anonymised outcome report. |
| `outcome-mcp.mjs` | The tool registry (`OUTCOME_TOOLS`, one entry per tool; add a tool by appending one): `start_outcome`, `advance_outcome`, `record_outcome_decision`, `record_outcome_experiment`, plus the catalogue resolver that checks a submitted plan's specialists and items and suggests the nearest real id. Every argument problem comes back at once with its field path. |
| `outcome-schema.mjs` | The tools' input JSON Schemas, built from the validators' field lists (`FIELDS` in plan-contract.mjs, `EVENT_FIELDS` in engagement.mjs). |
| `schema-check.mjs` | Checks arguments against those schemas, collecting every problem with its path and a did-you-mean. |
| `examples/rising-cpa.mjs` | A worked example of a good brief, research and plan, offered with `include_example`. Illustrative, not a playbook. |
| `evals/` | 30 golden requests across six industries (`cases.mjs`), what an expert would cover for each (`expect.mjs`, never shown to hosts), the scorer and the broken-plan controls (`rubric.mjs`), recorded runs (`recorded/`) and the scorecard that gates releases (`SCORECARD.md`). |

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

## Making it better

Don't add playbooks. Improve the method (`method.mjs`), the rules (`plan-contract.mjs`) or the specialists and items plans are built from. Good plans come back as plan patterns, shared only with the owner's consent, and become catalogue workflows that later research finds.
