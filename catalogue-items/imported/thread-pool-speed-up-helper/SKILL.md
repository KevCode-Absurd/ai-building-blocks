---
name: matlab-use-thread-pool
description: >
  Speed up local parfor, parfeval, or spmd by switching to a thread-based
  parallel pool. Trigger when a user describes slow or disappointing local
  parallel performance, even if they don't mention threads. Symptoms: parfor
  on a laptop/workstation is slower than expected or "only slightly faster
  than for"; parfor scales poorly with the number of workers; ticBytes/tocBytes,
  the Parallel Pool dashboard, mpiprofile, or system tools show large
  per-worker data transfer; large broadcast variables or sliced inputs
  make iterations slow; opening a process pool dominates a short workload;
  user mentions serialisation or data transfer overhead.
  Also trigger on any question about whether code or a function works
  on a thread pool. For non-pool MATLAB performance work (vectorisation,
  preallocation, profiling), defer to matlab-optimize-performance.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
compatibility: ">=R2020a"
metadata:
  author: MathWorks
  version: "1.0"
---

# Use a Thread-Based Parallel Pool

Recommend starting a thread pool using `parpool("Threads")` instead of
using the default process-based pool to speed up local `parfor` /
`parfeval` / `spmd` code.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- User asks to improve performance of `parfor`, `parfeval`, or `spmd` on
  a local machine.
- Code passes large arrays into iterations or broadcasts them across
  workers; user mentions slow start-up, serialization, or data transfer.
- User asks "Processes or Threads?" or wants Threads as the default.

## When NOT to Use

- User is running on a **cluster** -- thread pools are local-only.
- Code uses `parsim` or other Simulink parallel features -- those
  require a process-based pool.
- Code uses `distributed` or `codistributed` arrays.
- User wants `backgroundPool` -- that's for running work
  asynchronously (e.g. keeping an app responsive while a computation
  runs), not for parallel speed-up. All MATLAB users have 1 worker in
  the background pool; users with a Parallel Computing Toolbox license
  have multiple workers.

For general MATLAB performance tuning (vectorisation, preallocation,
profiling), see `matlab-optimize-performance` (if available).

## Workflow

1. **Try it on a thread pool.** Don't scan the code first -- just run
   it. Only create a thread pool if the current pool isn't already a
   thread pool. Avoid unconditionally deleting whichever pool the user
   has open. The conditional snippet below is a development
   convenience -- not something to bake into shipped code:

   If a process pool is already open, ask the user before running this,
   because it closes that pool (and any work running on it).

   ```matlab
   % Development-time helper: ensure a thread pool is active
   pool = gcp("nocreate");
   if ~isempty(pool) && ~isa(pool, "parallel.ThreadPool")
       warning("Closing the open process pool to start a thread pool.");
       delete(pool);
       pool = [];
   end
   if isempty(pool)
       parpool("Threads");
   end
   ```

   The existing `parfor` / `parfeval` / `spmd` block does not need to
   change. Thread pools are a drop-in replacement, not a refactor.

2. **Read the diagnostic if it errors.** Unsupported features fail
   loudly -- MATLAB tells you what isn't allowed and to use a
   process-based pool instead. Recommend `parpool("Processes")`. No
   silent wrong answers, no guessing.

3. **Offer the persistent option** if the user wants to use a thread
   pool "always" or "every time": suggest setting Threads as the
   default profile via `parallel.defaultProfile("Threads")` (R2022b+).
   Persists across sessions; no startup script needed.

## What threads actually save

Be precise. Broadcast variables are zero-copy on threads (the win).
Sliced inputs/outputs (`X(:,:,i)`) still allocate and copy --
threads only skip the serialize/IPC cost, not the slice itself.
Don't say "zero-copy" or "shared memory eliminates the cost
entirely" without qualifying it.

## Convention

**Always run it, never guess.** This is the single most important
rule in this skill.

LLM training data is incomplete and stale. Thread-based workers
gained support for many functions across releases, and new support
is added regularly. Do **not** assert a function is unsupported on
threads from memory, by analogy to similar functions, or because
it's not on the skill's short blocker list. Reasoning about thread
support without running is the biggest failure mode for this skill
-- it has pushed users to a process pool unnecessarily.

The default action is to run the code on a thread pool and read
the diagnostic if it errors. Don't pre-scan the code looking for
blockers. Most functions you'd reach for (`load`, FFT, `imgaussfilt`,
numeric and basic I/O primitives) work on threads.

Only if you genuinely cannot run the code (planning context, code
review, user can't execute right now) should you fall back to
documentation. Use an appropriate documentation skill (if available)
to fetch the function's reference page and read its **Extended
Capabilities -> Thread-Based Environment** section. Even then: an
absent or older entry is not proof the function won't run -- some
thread support is undocumented. When in doubt, try it.

----

Copyright 2026 The MathWorks, Inc.

----

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [MATLAB speed tuner](https://useaiblocks.com/skills/matlab-speed-tuner).
- The [MATLAB memory efficiency reviewer](https://useaiblocks.com/skills/matlab-memory-saver).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
