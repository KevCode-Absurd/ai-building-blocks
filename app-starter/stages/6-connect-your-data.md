# Stage 6 · Connect your data

**You get:** the app reads from your other tools (ad accounts, a store, analytics, a sheet), so nobody copies and pastes. Plus routines: runs on a schedule.

## Build
- **Read only first.** Ask for the smallest permission that reads what the brief needs. Writing to another tool needs its own stage and my OK.
- **Connections screen.** For each tool: connected or not, which account, last refresh, and what's missing to connect. Be honest when it isn't connected.
- **Sign in to the tool the proper way** (OAuth with a one-use state value). Store tokens encrypted, never in the browser, and bind each account to one workspace.
- **A Refresh button** that pulls fresh data, shows its steps, and has a cool-down so it can't be spammed.
- **Routines.** Let an owner schedule a workflow ("every Monday at 9"). Each scheduled run is a normal job, with the same caps and gates.
- **Keep a copy.** Save what was pulled and when, so a result can always show the data it was made from.

## Keep it small
- One tool at a time, the one the brief needs most.
- Do the sums in code, not with the AI. The AI explains; code counts.

## Done means
- I connect one tool and see fresh data after pressing Refresh.
- A routine runs on time and shows up like any other run.
- Tests: tokens are never sent to the browser; a disconnected tool shows a clear message, not an error.
