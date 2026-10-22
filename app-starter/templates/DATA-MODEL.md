# Data model

Your AI keeps this up to date as it adds tables. One row per table.

| Table | What one row is | Key fields | Belongs to | Who can read | Who can change |
|---|---|---|---|---|---|
| runs | One skill run | skill, skill_version, inputs, answer, status, cost, model, created_by, created_at | workspace (from stage 5) | Members and viewers | The person who made it, owners |
| approvals | A yes or no on a run | run, decision, note, decided_by, decided_at | workspace | Members and viewers | Members allowed to approve |
| jobs | One step of a workflow run | workflow_run, step, state, result, error | workspace | Members | The runner |
| workspaces | A team, client or brand | name, created_by | none | Its members | Owners |
| memberships | A person in a workspace | person, workspace, role | workspace | Owners | Owners |
| connections | A link to another tool | tool, account, token (encrypted), last_refresh | workspace | Owners | Owners |
| usage | One paid call | person, model, cost, at | workspace | Owners | The app only |

Rules:
- Every row records who made it and when.
- From stage 5, every query filters by workspace, and every change goes through `can()`.
- Tokens and keys never leave the server.
