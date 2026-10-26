---
name: react18-string-refs
description: 'Provides exact migration patterns for React string refs (ref="name" + this.refs.name) to React.createRef() in class components. Use this skill whenever migrating string ref usage - including single element refs, multiple refs in a component, refs in lists, callback refs, and refs passed to child components. Always use this skill before writing any ref migration code - the multiple-refs-in-list pattern is particularly tricky and this skill prevents the most common mistakes. Use it for React 18.3.1 migration (string refs warn) and React 19 migration (string refs removed).'
---

# React 18 String Refs Migration

String refs (`ref="myInput"` + `this.refs.myInput`) were deprecated in React 16.3, warn in React 18.3.1, and are **removed in React 19**.

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
