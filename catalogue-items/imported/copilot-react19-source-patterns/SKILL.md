---
name: react19-source-patterns
description: 'Reference for React 19 source-file migration patterns, including API changes, ref handling, and context updates.'
---

# React 19 Source Migration Patterns

Reference for every source-file migration required for React 19.

## Quick Reference Table

| Pattern | Action | Reference |
|---|---|---|
| `ReactDOM.render(...)` | → `createRoot().render()` | See references/api-migrations.md |
| `ReactDOM.hydrate(...)` | → `hydrateRoot(...)` | See references/api-migrations.md |
| `unmountComponentAtNode` | → `root.unmount()` | Inline fix |
| `ReactDOM.findDOMNode` | → direct ref | Inline fix |
| `forwardRef(...)` wrapper | → ref as direct prop | See references/api-migrations.md |
| Function component `.defaultProps` | → ES6 default params | See references/api-migrations.md |
| Class component `static defaultProps` | Keep; React 19 still supports it | See references/api-migrations.md |
| `useRef()` no arg | → `useRef(null)` | Inline fix  add `null` |
| Legacy Context | → `createContext` | [→ api-migrations.md#legacy-context](references/api-migrations.md#legacy-context) |
| String refs `this.refs.x` | → `createRef()` | [→ api-migrations.md#string-refs](references/api-migrations.md#string-refs) |
| `import React from 'react'` (unused) | Remove | Only if no `React.` usage in file |

## PropTypes Rule

Do **not** remove `.propTypes` assignments. The `prop-types` package still works as a standalone validator. React 19 only removes the built-in runtime checking from the React package  the package itself remains valid.

Add this comment above any `.propTypes` block:
```jsx
// NOTE: React 19 no longer runs propTypes validation at runtime.
// PropTypes kept for documentation and IDE tooling only.
```

## Read the Reference

For full before/after code for each migration, read **`references/api-migrations.md`**. It contains the complete patterns including edge cases for `forwardRef` with `useImperativeHandle`, `defaultProps` null vs undefined behavior, and legacy context provider/consumer cross-file migrations.


## Inputs, guard rails and what to return

Added by AI Blocks. The method above is unchanged.

**You need:** source files that may use the old APIs. Start with the entry file that calls `ReactDOM`.

**If something is missing:**
- No code pasted: ask once for the entry file and a few source files. Do not write changes from memory.
- Only part of the app is pasted: change only what you can see. List the rest as "NOT SEEN".
- A third-party package may use an old API: say so under "Check by hand". Do not claim the package is fine or broken without evidence.
- `references/api-migrations.md` is not available: use the table above. Say the edge cases (forwardRef with useImperativeHandle, defaultProps null versus undefined) were not checked against the reference.
- If none of the old APIs appear, say so and stop.

**Return in this order:**
1. **Old APIs found**: file, old API, new pattern.
2. **Rewritten code**: before and after, per file.
3. **propTypes kept**: files where the note was added.
4. **Check by hand**: items marked NOT SEEN or CHECK.

Do not change test files here. Point the user to the React 19 test migration helper for those. Tell the user to run the app and tests on their own machine.
