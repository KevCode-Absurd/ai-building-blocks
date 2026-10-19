# Stage 3 · Run the workflow

**You get:** several skills in order, each handing its result to the next, as jobs you can watch.

## Build
- The workflow as a small file: an ordered list of steps, each naming its skill, what it reads (my inputs or an earlier step's result) and what it saves. If I have a workflow folder with `HANDOFF.md` and `workflow.json`, read that.
- A job runner: each step is a job with a state (Queued, Running, Waiting for approval, Done, Failed). Run steps in order. Save each step's result before the next starts.
- Approval gates: steps marked "check" or "paid" wait for a person before the next step runs.
- If a step fails, show why, and let me run it again without redoing the steps before it.
- A screen that shows the steps as a row or a board, with each one's state and result.

## Keep it small
- Run jobs inside the app for now. A separate job service comes in stage 8 only if the brief needs it.
- The code follows the list in order. It doesn't decide what runs next.

## Done means
- I start the workflow once and watch each step finish.
- It stops at a gate and waits for me.
- Tests: order is kept; a failed step can be rerun alone; a gate blocks the next step.
