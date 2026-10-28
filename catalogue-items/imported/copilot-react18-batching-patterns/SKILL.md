---
name: react18-batching-patterns
description: 'Provides exact patterns for diagnosing and fixing automatic batching regressions in React 18 class components. Use this skill whenever a class component has multiple setState calls in an async method, inside setTimeout, inside a Promise .then() or .catch(), or in a native event handler. Use it before writing any flushSync call - the decision tree here prevents unnecessary flushSync overuse. Also use this skill when fixing test failures caused by intermediate state assertions that break after React 18 upgrade.'
---

# React 18 Automatic Batching Patterns

Reference for diagnosing and fixing the most dangerous silent breaking change in React 18 for class-component codebases.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini:** Any chat AI can read pasted code and sort the methods. Upload the skill folder if it accepts files.
- **An AI coding tool in your project:** It can run your tests after each fix and show the result.
<!-- /needs -->

## The Core Change

| Location of setState | React 17 | React 18 |
|---|---|---|
| React event handler | Batched | Batched (same) |
| setTimeout | **Immediate re-render** | **Batched** |
| Promise .then() / .catch() | **Immediate re-render** | **Batched** |
| async/await | **Immediate re-render** | **Batched** |
| Native addEventListener callback | **Immediate re-render** | **Batched** |

**Batched** means: all setState calls within that execution context flush together in a single re-render at the end. No intermediate renders occur.

## Quick Diagnosis

Read every async class method. Ask: does any code after an `await` read `this.state` to make a decision?

```
Code reads this.state after await?
  YES → Category A (silent state-read bug)
  NO, but intermediate render must be visible to user?
    YES → Category C (flushSync needed)
    NO → Category B (refactor, no flushSync)
```

For the full pattern for each category, read:
- **`references/batching-categories.md`** - Category A, B, C with full before/after code
- **`references/flushSync-guide.md`** - when to use flushSync, when NOT to, import syntax

## The flushSync Rule

**Use `flushSync` sparingly.** It forces a synchronous re-render, bypassing React 18's concurrent scheduler. Overusing it negates the performance benefits of React 18.

Only use `flushSync` when:
- The user must see an intermediate UI state before an async operation begins
- A spinner/loading state must render before a fetch starts
- Sequential UI steps have distinct visible states (progress wizard, multi-step flow)

In most cases, the fix is a **refactor** - restructuring the code to not read `this.state` after `await`. Read `references/batching-categories.md` for the correct approach per category.


## Inputs, guard rails and what to return

Added by AI Blocks. The method above is unchanged.

**You need:** at least one class component file. Also useful: the React versions before and after, and any failing test or bug description.

**If something is missing:**
- No code pasted: ask once for the class file. Do not write example code from memory.
- A method calls a function in another file that you cannot see: mark the case "NEEDS CHECK" and say which file you need. Do not guess what it sets in state.
- The `references/` folder is not available: use the tables and rules above. Tell the user the full before and after code was not available. Do not invent patterns.
- The component has no async methods: say so and stop.

**Return in this order:**
1. **Method list**: each async method, its category (A, B or C) and the reason.
2. **Fixes**: before and after code for each method that changes.
3. **flushSync used**: each call and why the user must see that state, or "none needed".
4. **Test changes**: tests that assert intermediate state, rewritten (prefer `waitFor`).
5. **Check by hand**: cases marked NEEDS CHECK.

You cannot run the tests from a chat window. Tell the user to run them in their own project.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code reviewer agent](https://useaiblocks.com/skills/agency-engineering-code-reviewer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
