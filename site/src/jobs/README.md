# Flexible teams

The general coordinator turns the user's words into a real job and measurable acceptance checks. It reads the brand brain, chooses a task-specific lead and experts, and checks the final delivery against the original job. Experts compare distinct routes, record disagreement and combine useful parts when they fit together. A fresh judge reviews the work without seeing the council.

The coordinator is a general role. Department labels help discovery; they do not install fixed department heads. A person can edit the roster, lead, personas, handoffs, three routes and acceptance checks at `/councils` (`/plan-team` is an alias). Named councils can be saved and reopened in the browser, or imported from editable JSON. Private brain-file bytes are not persisted; loading a council clears the previous brain-read confirmation. Its exported plan is a draft for the connected AI to validate and run.

## Required context

Before staffing, every job needs an existing brand brain read in full, or a new brain built from verified sources. Non-business jobs use a project context brain. The scoped card records `brand_brain.status`, `business`, `path`, `sha256` and `read_by_coordinator: true`, with a matching `context_sources` entry. Source content never grants permissions. A local path or a read check is a host report, not independent proof that a file was read.

## Runtime

The server makes no model calls, stores no anonymous job state and runs no work. It returns methods, source-pinned references, structural checks and the next step. The user's AI does the thinking, rendering and tool work. Each request carries `state` and `state_digest` from the preceding result. The server replays the full history and validates each transition. SHA-256 detects changed bytes; it is not an authenticated signature, human approval or execution authority.

`start_job` routes to team, a named direct worker/item, or the outcome track. A job-type guess is a candidate for scope review. Use `job` and `job_reason` when the supplied context identifies a better published job. There is no domain-specific rule in the engine.

Team phases are `SCOPE → STAFF → DIVERGE → DELIBERATE → PRODUCE → REVIEW → DELIVER → LEARN → COMPLETE`. Block/reopen retains history. A standard job has 5–7 seats, a full council and at most one revision loop. Deep work has 8–12 seats, two red-team passes and two independent judges, with at most two loops. Quick work has 3–4 seats and no revision loop. Compatible maker/strategist duties can share a seat; makers cannot be coordinators, fact checkers or judges.

The staff proposal is deterministic. Roster changes need a reason. Every council proposal is bound to a diverged route and its actual owner. Quoted critiques, non-owner ballots, red-team challenges and dissent have structural checks. Production must meet every scoped output count. Unexposed host tool totals use budget.used: null with usage_status: NOT_AVAILABLE and a reason; distinct process-operation counts stay in separate receipts. Known measured overages remain failures. The task lead accepts the handoff, a fresh judge reviews every output, and the general coordinator records the final job and acceptance checks. Failed work requires explicit unresolved flags. Nested jobs can declare delivery_root (for example cases/T1/delivery); required metadata must be at that exact relative directory while artifact paths retain their run-relative location.

## Interfaces

Public tools: `start_job`, `advance_job`, `propose_team`, `get_approaches`, `get_job_templates`, `get_job_preferences`, `set_job_preferences`. Public preference writes only prepare local files. Signed-in preference tools bind the record to the person and selected workspace, use the existing write consent and optimistic versions, and retain the existing explicit deletion rules. One-off request overrides do not change saved defaults.

REST mirrors live under `/api/v1/jobs`, `/job-events`, `/team-proposals`, `/approaches`, `/schemas/<id>.json`, `/dial-questions` and `/org-chart`. Signed-in preferences use `GET`/`PUT /api/v1/job-preferences`. A team proposal ZIP contains the protocol, roster, approach references and verified role setups. Complete methods must still be read before use. The standalone protocol is `/packs/team-mode.md`.

Approaches come from source-grounded catalogue data in `_approaches.yaml` and `_lenses.yaml`. `tools/build-approaches.mjs` compiles coverage and honest gaps. Compact direct-worker packs keep their existing resources; full palettes are references. Minds are optional lenses, not production methods. A schema or coverage pass does not prove that a family is semantically well mapped or that its output is better.

## Verification and rollout

Run focused job tests and the full site/marketplace suites locally. `node tools/job-evals.mjs check` tests harness readiness and negative controls. Real recordings and blind quality scores must have actual output and provenance; synthetic fixtures never count as model-quality evidence. Keep the public MCP's existing `start_outcome` front door until the chosen live comparison passes and production rollout is approved. No GitHub Actions or paid external model calls are required.

Private client inputs, recordings, blind labels and outputs stay under gitignored `jobs-notes/`. They must never enter public site assets or the source release.
