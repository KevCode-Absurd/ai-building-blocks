---
name: react18-string-refs
description: 'Provides exact migration patterns for React string refs (ref="name" + this.refs.name) to React.createRef() in class components. Use this skill whenever migrating string ref usage - including single element refs, multiple refs in a component, refs in lists, callback refs, and refs passed to child components. Always use this skill before writing any ref migration code - the multiple-refs-in-list pattern is particularly tricky and this skill prevents the most common mistakes. Use it for React 18.3.1 migration (string refs warn) and React 19 migration (string refs removed).'
---

# React 18 String Refs Migration

String refs (`ref="myInput"` + `this.refs.myInput`) were deprecated in React 16.3, warn in React 18.3.1, and are **removed in React 19**.

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
- **Claude, ChatGPT or Gemini:** Any chat AI can read a component and convert refs. Upload the skill folder if it accepts files.
- **An AI coding tool in your project:** It can run the two searches and change several files at once.
<!-- /needs -->

## Quick Pattern Map

| Pattern | Reference |
|---|---|
| Single ref on a DOM element | [→ patterns.md#single-ref](references/patterns.md#single-ref) |
| Multiple refs in one component | [→ patterns.md#multiple-refs](references/patterns.md#multiple-refs) |
| Refs in a list / dynamic refs | [→ patterns.md#list-refs](references/patterns.md#list-refs) |
| Callback refs (alternative approach) | [→ patterns.md#callback-refs](references/patterns.md#callback-refs) |
| Ref passed to a child component | [→ patterns.md#forwarded-refs](references/patterns.md#forwarded-refs) |

## Scan Command

```bash
# Find all string ref assignments in JSX
grep -rn 'ref="' src/ --include="*.js" --include="*.jsx" | grep -v "\.test\."

# Find all this.refs accessors
grep -rn "this\.refs\." src/ --include="*.js" --include="*.jsx" | grep -v "\.test\."
```

Both should be migrated together - find the `ref="name"` and the `this.refs.name` accesses for each component as a pair.

## The Migration Rule

Every string ref migrates to `React.createRef()`:

1. Add `refName = React.createRef();` as a class field (or in constructor)
2. Replace `ref="refName"` → `ref={this.refName}` in JSX
3. Replace `this.refs.refName` → `this.refName.current` everywhere

Read `references/patterns.md` for the full before/after for each case.


## Inputs, guard rails and what to return

Added by AI Blocks. The method above is unchanged.

**You need:** at least one class component that uses `ref="name"` or `this.refs`.

**If something is missing:**
- No code pasted: ask once for the component. Do not write a migration from memory.
- A `ref="name"` has no matching `this.refs.name` in the code you can see: it may be read in another file or a parent. Mark it "CHECK" and ask. Do not delete it.
- A ref is passed to a child component that you cannot see: mark it "CHECK" and say which child file you need.
- The `references/patterns.md` file is not available: use the migration rule above. Say the list and child cases were not checked against the reference. Do not invent a pattern for them.
- If there are no string refs, say so and stop.

**Return in this order:**
1. **Refs found**: component, ref name, where it is set, where it is read.
2. **Pattern used**: single, multiple, list, callback or child.
3. **Rewritten code**.
4. **Check by hand**: items marked CHECK.
5. **Verify**: the two scan commands to run again. Both should return nothing.

Tell the user to run their tests and try the screen on their own machine.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
