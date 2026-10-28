---
name: debugging
description: Systematically diagnose and fix software bugs by analyzing error messages, stack traces, logs, and runtime behavior across multiple languages. Use when the user requests debugging or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills contributors
  version: 1.0.0
---

# Debugging

This skill equips an AI agent with a systematic methodology for diagnosing and resolving software bugs. Rather than guessing at fixes, the agent follows a structured process — reproduce, isolate, diagnose, fix, verify — to find root causes and produce reliable corrections. It handles a wide range of bug categories including logic errors, runtime exceptions, race conditions, memory leaks, and performance regressions across multiple languages and runtime environments.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Reproduce the problem.** Confirm the bug is observable and repeatable. Gather the exact error message, stack trace, log output, or description of unexpected behavior. Identify the minimum input or sequence of steps that triggers the issue. If the bug is intermittent, note the frequency and any environmental conditions (load, timing, specific data) that correlate with its appearance.

2. **Isolate the fault location.** Use the stack trace, error message, and code structure to narrow down the region of code responsible. Trace data flow backward from the point of failure to find where the value diverged from expectations. Eliminate unrelated code paths by checking whether the bug persists when components are stubbed out or bypassed. For large codebases, use binary search strategies — disable half the system, check if the bug still occurs, and repeat.

3. **Diagnose the root cause.** Once the faulty region is identified, determine exactly why the code misbehaves. Common root causes include: incorrect assumptions about input (null, empty, out-of-range), state mutation from another thread or from async tasks that interleave on one thread, stale cache or memoized value, incorrect operator precedence, missing await on an async call, or a dependency version incompatibility. Distinguish the root cause from its symptoms — a NullPointerException is a symptom; the root cause may be a missing validation three function calls earlier.

4. **Develop and apply the fix.** Write the smallest change that addresses the root cause without introducing side effects. If the fix involves changing a shared interface, trace all callers to ensure compatibility. Prefer defensive fixes that handle the error class broadly (e.g., adding input validation) over narrow patches that only address the single observed failure.

5. **Verify the fix and prevent regression.** Run the reproduction steps again to confirm the bug is resolved. Write or update a test case that encodes the previously-failing scenario so the bug cannot silently return. Check that existing tests still pass. If the bug was in a critical path, consider adding logging or monitoring to detect similar issues in the future.

## Supported Technologies

| Category          | Tools and Techniques                                              |
|-------------------|-------------------------------------------------------------------|
| Stack traces      | Python tracebacks, Java/JS stack traces, Go panic output, Rust backtraces |
| Logging           | Python `logging`, JavaScript `console`, structured JSON logs      |
| Debuggers         | `pdb` / `ipdb`, Chrome DevTools, `gdb` / `lldb`, `dlv` (Go)     |
| Profiling         | `cProfile`, `py-spy`, Chrome Performance tab, `pprof`            |
| Memory analysis   | `tracemalloc`, `heapq`, Valgrind, Chrome Heap Snapshots          |
| Concurrency       | Thread dumps, `asyncio` debug mode, Go race detector (`-race`)   |

## Usage

Provide one or more of the following inputs:

- **Code snippet or file path** containing the buggy code.
- **Error message or stack trace** — paste the full output, not a summary.
- **Description of unexpected behavior** — what you expected versus what happened.
- **Steps to reproduce** — the exact commands, inputs, or user actions that trigger the bug.
- **Logs** — relevant log output from before and during the failure.

The more context you provide, the faster and more accurately the agent can diagnose the issue.

## Examples

### Example 1 — Debugging a field that goes wrong under load in Python async code

**Bug report:** "Sometimes the response is missing the `user_profile` field, but only under load."

Buggy code in `src/api/handler.py`:

```python
import asyncio
import aiohttp

user_cache = {}

async def fetch_user(session, user_id):
    if user_id in user_cache:
        return user_cache[user_id]
    async with session.get(f"https://api.example.com/users/{user_id}") as resp:
        data = await resp.json()
    user_cache[user_id] = data
    return data

async def build_response(user_id):
    async with aiohttp.ClientSession() as session:
        profile, orders = await asyncio.gather(
            fetch_user(session, user_id),
            fetch_orders(session, user_id),
        )
    return {"user_profile": profile, "orders": orders}
```

**Agent diagnosis (hypotheses until reproduced):**

First, read the code against the report. `build_response` always returns a dict with a `user_profile` key, so the key itself cannot go missing. The report most likely means the value is empty or lacks the expected fields. Ask for one bad response before going further.

- **Hypothesis A (fits "only under load"):** `fetch_user` never checks `resp.status`. Under load the user API may answer with an error such as 429 (rate limited) or 503 and a small JSON error body. That body is stored in `user_cache` as if it were a profile, and every later request for that user gets it back.
- **Hypothesis B (a contributing factor):** when several requests for the same `user_id` miss the cache at once, each one interleaves at the `await` and issues its own HTTP call (a cache stampede). This wastes calls and adds load on the user API, which makes error answers more likely. On its own it does not remove fields: every write stores a complete JSON value.
- **Ruled out:** "dictionary changed size during iteration" needs code that loops over the dict while it changes. Nothing here iterates over `user_cache`, so that error does not apply.

**Reproduce before fixing:** point the code at a stub server that returns 429 with `{"error": "rate limited"}` for some requests, run 50 concurrent `build_response` calls for one user, and assert that `user_profile` has the expected fields. Also log `resp.status` and count HTTP calls per user. If the test fails and the cache holds the error body, Hypothesis A is confirmed. If the call count is above 1, B is confirmed too.

**Root cause (once the test reproduces it):** error responses are cached as if they were valid profiles, made more frequent by duplicate concurrent fetches.

**Fix:**

```python
import asyncio
import aiohttp

user_cache = {}
cache_locks = {}

async def fetch_user(session, user_id):
    # No await between the check and the insert, so this is safe in asyncio
    lock = cache_locks.setdefault(user_id, asyncio.Lock())

    async with lock:
        if user_id in user_cache:
            return user_cache[user_id]
        async with session.get(f"https://api.example.com/users/{user_id}") as resp:
            resp.raise_for_status()      # never treat an error body as a profile
            data = await resp.json()
        user_cache[user_id] = data       # only successful answers are cached
        return data
```

`raise_for_status()` stops error answers from being cached. The per-key lock means only one coroutine fetches a given user at a time; others wait and then read from the cache. Rerun the reproduction test: it should pass, with one HTTP call per user. If it still fails, the hypotheses were wrong, so go back to step 2 and isolate further.

### Example 2 — Debugging a memory leak in a Node.js server

**Bug report:** "Server memory usage grows from 150 MB to 2 GB over 24 hours, then crashes with OOM."

Buggy code in `src/server.js`:

```javascript
const express = require("express");
const app = express();

const requestLog = [];

app.use((req, res, next) => {
  requestLog.push({
    method: req.method,
    url: req.url,
    headers: { ...req.headers },
    timestamp: new Date(),
  });
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", requestCount: requestLog.length });
});

app.listen(3000);
```

**Agent diagnosis:**

The `requestLog` array is a module-level variable that grows without bound. Every incoming request appends an object containing a full copy of the request headers. At 1000 requests per minute with an average header size of 2 KB, this accumulates roughly 2.8 GB per day — matching the reported OOM timeline.

**Root cause:** Unbounded in-memory array that is never pruned or rotated.

**Fix:**

```javascript
const express = require("express");
const app = express();

const MAX_LOG_SIZE = 10000;
const requestLog = [];

app.use((req, res, next) => {
  if (requestLog.length >= MAX_LOG_SIZE) {
    requestLog.shift();
  }
  requestLog.push({
    method: req.method,
    url: req.url,
    timestamp: new Date(),
  });
  next();
});
```

Key changes: (1) cap the array at a fixed size and evict the oldest entry, (2) stop storing full headers — log only what is needed, (3) for production use, replace the in-memory array with a proper logging pipeline (e.g., write to a log file or send to an external service).

**Verification:** Run a load test with `autocannon -d 60 http://localhost:3000/health` and monitor memory via `process.memoryUsage()`. Memory should plateau at the cap size rather than climbing linearly.

## Best Practices

- **Read the entire stack trace, bottom to top.** The root cause is often in the deepest application frame, not the top-level exception. Framework frames can be skipped, but your code frames should be read in order.
- **Change one thing at a time.** When testing a hypothesis, make a single modification and re-run. Changing multiple things simultaneously makes it impossible to determine which change had the effect.
- **Use logging strategically.** Insert log statements at the entry and exit of suspect functions, printing key variable values. Remove or reduce log verbosity after the bug is fixed.
- **Check recent changes first.** If the bug appeared after a specific deployment or commit, `git bisect` or reviewing the recent diff is often the fastest path to the root cause.
- **Reproduce before fixing.** Never apply a fix to a bug you cannot reproduce. Without reproduction, you cannot verify the fix works, and you risk introducing a change that masks the symptom without addressing the cause.
- **Write a regression test.** Every fixed bug should produce a new test case that fails before the fix and passes after. This is the most reliable way to prevent the same bug from returning.

## Edge Cases

- **Heisenbugs:** Some bugs disappear when debugging tools are attached (e.g., timing changes from breakpoints mask race conditions). For these, use logging or tracing instead of interactive debuggers, and consider running with the language's race detector if available.
- **Environment-specific bugs:** A bug that only appears in production may depend on OS version, memory limits, network latency, or configuration that differs from development. The agent will ask for environment details and suggest reproducing with matching constraints (e.g., Docker with memory limits).
- **Third-party library bugs:** If the root cause is in a dependency rather than application code, the fix may involve upgrading the library, applying a workaround, or pinning a known-good version. The agent will check changelogs and issue trackers before recommending a path.
- **Compiler or runtime bugs:** Rarely, the bug is in the language runtime itself. The agent will exhaust application-level explanations first, then suggest testing on a different runtime version if no application-level cause is found.
- **Corrupted state:** If the bug involves corrupted data (e.g., a half-written database row), diagnosis requires examining the data alongside the code. The agent will ask for sample data or database state to correlate with the code path analysis.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Failing test fixer](https://useaiblocks.com/skills/failing-test-fixer).
- The [Flaky test fixer](https://useaiblocks.com/skills/flaky-test-fixer).
- The [GitHub check failure fixer](https://useaiblocks.com/skills/ci-failure-fixer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
