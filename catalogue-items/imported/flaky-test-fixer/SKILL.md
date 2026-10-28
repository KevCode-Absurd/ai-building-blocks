---
name: "fix"
description: >-
  Fix failing or flaky Playwright tests. Use when user says "fix test",
  "flaky test", "test failing", "debug test", "test broken", "test passes
  sometimes", or "intermittent failure".
---

# Fix Failing or Flaky Tests

Diagnose and fix a Playwright test that fails or passes intermittently using a systematic taxonomy.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A test report** (yours): what was tested, what passed, what failed and why.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A test report** with the [GitHub check failure fixer](https://useaiblocks.com/skills/ci-failure-fixer). Bring a codebase, a test report (optional), a code change (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a test report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Input

`$ARGUMENTS` contains:
- A test file path: `e2e/login.spec.ts`
- A test name: `"should redirect after login"`
- A description: `"the checkout test fails in CI but passes locally"`

## Steps

### 1. Reproduce the Failure

Run the test to capture the error:

```bash
npx playwright test <file> --reporter=list
```

If the test passes, it's likely flaky. Run burn-in:

```bash
npx playwright test <file> --repeat-each=10 --reporter=list
```

If it still passes, try with parallel workers:

```bash
npx playwright test --fully-parallel --workers=4 --repeat-each=5
```

### 2. Capture Trace

Run with full tracing:

```bash
npx playwright test <file> --trace=on --retries=0
```

Open the trace with `npx playwright show-trace <path to trace.zip>` and read the timeline: which action failed, what the page looked like, and which network calls were still running.

### 3. Categorize the Failure

Load `flaky-taxonomy.md` from this skill directory.

Every failing test falls into one of four categories:

| Category | Symptom | Diagnosis |
|---|---|---|
| **Timing/Async** | Fails intermittently everywhere | `--repeat-each=20` reproduces locally |
| **Test Isolation** | Fails in suite, passes alone | `--workers=1 --grep "test name"` passes |
| **Environment** | Fails in CI, passes locally | Compare CI vs local screenshots/traces |
| **Infrastructure** | Random, no pattern | Error references browser internals |

### 4. Apply Targeted Fix

**Timing/Async:**
- Replace `waitForTimeout()` with web-first assertions
- Add `await` to missing Playwright calls
- Wait for specific network responses before asserting
- Use `toBeVisible()` before interacting with elements

**Test Isolation:**
- Remove shared mutable state between tests
- Create test data per-test via API or fixtures
- Use unique identifiers (timestamps, random strings) for test data
- Check for database state leaks

**Environment:**
- Match viewport sizes between local and CI
- Account for font rendering differences in screenshots
- Use `docker` locally to match CI environment
- Check for timezone-dependent assertions

**Infrastructure:**
- Increase timeout for slow CI runners
- Add retries in CI config (`retries: 2`) only as a last resort, after you have found the cause. Retries hide flakes, they do not fix them
- Check for browser OOM (reduce parallel workers)
- Ensure browser dependencies are installed

### 5. Verify the Fix

Run the test 10 times to confirm stability:

```bash
npx playwright test <file> --repeat-each=10 --reporter=list
```

All 10 must pass. If any fail, go back to step 3.

### 6. Prevent Recurrence

Suggest:
- Add to CI with `retries: 2` if not already
- Enable `trace: 'on-first-retry'` in config
- Add the fix pattern to project's test conventions doc

## Next

Once the test is stable, commit the fix with the trace as evidence and re-run the full suite in CI. If the flake returns, keep the new trace and run these steps again from step 1.

## Output

- Root cause category and specific issue
- The fix applied (with diff)
- Verification result (10/10 passes)
- Prevention recommendation

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Persistent bug debugger](https://useaiblocks.com/skills/fix-loop-breaker). It takes the code change.
- The [Bug root cause finder](https://useaiblocks.com/skills/bug-root-cause-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
