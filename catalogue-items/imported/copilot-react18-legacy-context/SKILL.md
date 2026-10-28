---
name: react18-legacy-context
description: 'Provides the complete migration pattern for React legacy context API (contextTypes, childContextTypes, getChildContext) to the modern createContext API. Use this skill whenever migrating legacy context in class components - this is always a cross-file migration requiring the provider AND all consumers to be updated together. Use it before touching any contextTypes or childContextTypes code, because migrating only the provider without the consumers (or vice versa) will cause a runtime failure. Always read this skill before writing any context migration - the cross-file coordination steps here prevent the most common context migration bugs.'
---

# React 18 Legacy Context Migration

Legacy context (`contextTypes`, `childContextTypes`, `getChildContext`) was deprecated in React 16.3 and warns in React 18.3.1. It is **removed in React 19**.

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
- **Claude, ChatGPT or Gemini:** Any chat AI can plan the order of the change from pasted files. Upload the skill folder if it accepts files.
- **An AI coding tool in your project:** It can run the searches and change several files in one go.
<!-- /needs -->

## This Is Always a Cross-File Migration

Unlike most other migrations that touch one file at a time, context migration requires coordinating:
1. Create the context object (usually a new file)
2. Update the **provider** component
3. Update **every consumer** component

Missing any consumer leaves the app broken - it will read from the wrong context or get `undefined`.

## Migration Steps (Always Follow This Order)

```
Step 1: Find the provider (childContextTypes + getChildContext)
Step 2: Find ALL consumers (contextTypes)
Step 3: Create the context file
Step 4: Update the provider
Step 5: Update each consumer (class components → contextType, function components → useContext)
Step 6: Verify - run the app, check no legacy context warnings remain
```

## Scan Commands

```bash
# Find all providers
grep -rn "childContextTypes\|getChildContext" src/ --include="*.js" --include="*.jsx" | grep -v "\.test\."

# Find all consumers
grep -rn "contextTypes\s*=" src/ --include="*.js" --include="*.jsx" | grep -v "\.test\."

# Find this.context usage (may be legacy or modern - check which)
grep -rn "this\.context\." src/ --include="*.js" --include="*.jsx" | grep -v "\.test\."
```

## Reference Files

- **`references/single-context.md`** - complete migration for one context (theme, auth, etc.) with provider + class consumer + function consumer
- **`references/multi-context.md`** - apps with multiple legacy contexts (nested providers, multiple consumers of different contexts)
- **`references/context-file-template.md`** - the standard file structure for a new context module


## Inputs, guard rails and what to return

Added by AI Blocks. The method above is unchanged.

**You need:** the provider file and every consumer file. If the user cannot paste them all, ask for the search results from the Scan Commands above, then ask for the files they list.

**If something is missing:**
- No provider found: say so. Do not create a provider from a guess.
- A consumer file is named in the search but not pasted: list it as "NOT SEEN" and do not change it. Say that migrating the provider alone will break that consumer.
- You cannot tell if `this.context` is old or new: mark it "CHECK" and ask. Do not assume.
- The `references/` folder is not available: use the steps above and say the full examples were not available. Do not invent a different pattern.

**Return in this order:**
1. **Provider and consumers found**: file names, and what values the context carries.
2. **Context file**: the new file.
3. **Updated provider**.
4. **Updated consumers**: one per file.
5. **Check by hand**: anything "NOT SEEN" or "CHECK".
6. **Verify**: the searches to run again. They should return no legacy context.

Tell the user to apply the provider and all consumers together, then run the app and tests on their own machine.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
