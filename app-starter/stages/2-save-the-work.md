# Stage 2 · Save the work

**You get:** every result kept, with its history, so nothing is lost and work can be approved.

## Build
- A database on my computer. SQLite is enough for now; plan tables so they can move to Postgres in stage 8.
- Tables, at least: `runs` (skill, inputs, answer, status, cost, model, created_at) and `approvals` (run, decision, note, who, when).
- A list of past runs with a status: Draft, Needs you, Approved, Rejected.
- Open a run to see its inputs and answer. Approve or reject it with a note. Run again from the same inputs.
- Record which version of the skill made each run (a hash of the file is enough), so a better skill never rewrites old results.

## Keep it small
- No search, tags or folders unless the brief asks for them.
- Fill in `templates/DATA-MODEL.md` as you add tables.

## Done means
- Restart the app and every run is still there.
- I can approve and reject, and the list shows it.
- Tests: saving, loading, approving; a run keeps its skill version.
