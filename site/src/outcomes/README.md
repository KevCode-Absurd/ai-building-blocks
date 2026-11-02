# Outcome orchestrator

Turns "my business isn't doing well" into a finished, measured result, run by our specialists inside the owner's own AI. The plan and the reasons behind it are in `docs/OUTCOMES-PRD.md`. This folder is block 1.

| File | What it does |
|---|---|
| `playbook-contract.mjs` | The playbook format and its rules: 11 stage kinds in order, decisions always need the owner, live actions need approval of each action, nothing is built before the owner chooses. |
| `playbooks/` | `reduce-paid-acquisition-cost` (rising CPA on paid social) and `generic-outcome` (anything else; its first question routes vague problems to a specific playbook). `index.mjs` is the registry and matcher. |
| `engagement.mjs` | One owner's job: state per stage, gates, autonomy, missing-data blocking, the brief, the stage prompts and the files for `outcomes/<id>/`. |
| `records.mjs` | Decisions (passing over the top option needs a reason) and experiments (registered before launch; low volume means INCONCLUSIVE; a broken guardrail is never a WIN). Returns lines to append, learning candidates and an anonymised outcome report. |
| `outcome-mcp.mjs` | Five tools: `list_outcome_playbooks`, `start_outcome`, `advance_outcome`, `record_outcome_decision`, `record_outcome_experiment`. |

Everything is stateless. The host keeps `engagement.json` and sends it back with its `engagement_sha256`; a changed file is refused. No model, storage, schedule or account access runs here.

## Try it

The five tools are in the local MCP preview (`site/scripts/scoping-mcp-preview.mjs`, Node 24). Add it to Claude Code, Claude Desktop or Codex as a stdio server, then say what's wrong:

```text
My business isn't doing too well.
```

```bash
node --test site/test/outcomes.test.mjs
```

## Add a playbook

1. Copy `playbooks/reduce-paid-acquisition-cost.mjs`. Name real role IDs and catalogue method slugs; the test checks every one exists.
2. Register it in `playbooks/index.mjs`, and add a route option to `generic-outcome.mjs` that points at it.
3. Write the hypotheses an expert would test first, each with a rule that supports it and one that refutes it.
