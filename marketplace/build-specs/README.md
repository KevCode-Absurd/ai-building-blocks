# Build specs: one file an owner hands to Claude

An owner gives Claude Code one file, `dist/BUILD-STORE.md` (the whole team) or `dist/agents/<agent-id>/BUILD.md` (one agent and the agents it works with), and Claude builds a working agent team in the owner's own folder: the approval gate, the job board, the processes, the data warehouse, the connectors, the schedules and the dashboard.

## What is here

| Path | What it is |
|---|---|
| `BUILD-STORE.md` | The template: the owner's summary, then Claude's build steps. `make.mjs` fills its three appendices. |
| `kit/` | Code every store gets, copied in word for word: `guard.mjs` (may this tool call run?), `actions.mjs` (plans, dry runs, owner-held file changes, schedule), `board.mjs` (stages, checks, sign-offs, hand-offs), `spend.mjs` (generation budget), `process.mjs` (checks and renders processes), `hooks.mjs` (enforces it all in Claude Code), `settings.json`, example `limits` and `goals`, and `warehouse/` (Meta sync, creative register, DuckDB views). |
| `processes/` | One JSON file per process (the source) and a readable page each (generated). |
| `access/` | Step-by-step guides for giving agents access to each platform, at read, draft and publish level. |
| `meta-ads-agent/files/` | Meta-specific parts: the tool list, the operating rules and the plan reviewer. |
| `research/` | The sourced research the processes and access guides rest on, with check dates. |
| `agents.json` | The e-commerce agents (made from the directory data). |
| `dist/` | Generated BUILD files. Do not edit by hand. |

## Rules the kit enforces in code

- A write runs only as the next step of a plan the owner approved by typing `yes <code>`, with exactly the input approved, once. A failed step stops the plan and is never retried.
- Scheduled runs (`AGENT_RUN_MODE=scheduled`) never write, apart from exact standing rules the owner set (for example posting reports to their own channel).
- Approvals, sign-offs, run records and owner-held files (limits, goals, approvers, tool list, hooks, kit code and the process files) cannot be edited by the agents; a change to an owner-held file is a file plan the owner approves.
- A stage sign-off covers the exact files shown; if a file changes, the code stops working.
- Generation spend is recorded against an estimate the owner signed off, and stops before going over.

## Commands

```bash
node --test build-specs/kit/kit.test.mjs build-specs/kit/warehouse/warehouse.test.mjs
```

```bash
AGENTS_FILE=build-specs/agents.json node build-specs/kit/process.mjs check build-specs/processes/*.json
```

```bash
node build-specs/make.mjs
```

```bash
node build-specs/make.mjs --check
```

Run them from `marketplace/`. `make.mjs` refuses to write if a process breaks a rule, an agent is in no process, or an output has an em or en dash.

## Tested so far

- Kit tests (`kit.test.mjs`, `gate.test.mjs`, 25 in all with the warehouse test): the gate, owner-held files, standing rules, the board with sign-offs and hand-offs to several channels, path forms, per-call connector fields, budgets worked out from the input, ad account and end-date limits, unlisted connector tools blocked, generation only inside a signed-off budget, pause and resume, failing closed, shell habits, stages that cannot start early, files swapped after a sign-off, plans tied to their job, and the warehouse transform (with a fake Meta).
- A partial install copied from a shipped build folder passes the same tests.
- Live in Claude Code (15 November 2026): a gated write was blocked before the yes, the owner's `yes <code>` was recorded by the prompt hook, the approved step ran once and was marked done, and a retry was blocked.
- One fresh review of a whole build folder (15 November 2026); every problem it found is fixed and has a test in `gate.test.mjs`.
- Not yet run: `views.sql` in DuckDB, the Meta sync against a real account, the hosted way, and a full process run with real agents and connectors.
