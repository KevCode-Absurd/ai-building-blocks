---
name: safe-refactor
description: Cleans up one messy or legacy file or module without changing what it does - long PHP, Python or JavaScript files, jQuery moved to plain JavaScript, JavaScript converted to TypeScript - by first listing everything other code depends on, writing characterisation tests that pin today's outputs (even odd ones), then moving in small named steps (rename, extract function, extract module, remove duplication, modernise syntax) with tests green after each, and handing over the final files, an old-to-new map and a one-move-per-commit plan. Use it for code nobody wants to touch.
---

# Safe refactor

## When to use

- A file of hundreds of lines that everyone avoids.
- Code written by someone who left, with no tests.
- jQuery that should become plain JavaScript, or JavaScript that should become TypeScript.
- Before adding a feature to code that is too tangled to change safely.

Not for full rewrites or adding features during the clean-up. I run your test suite only where my AI tool can run commands in your project.

## What you need

1. The whole file or module, not just the ugly part.
2. Who calls it: a search of the codebase for its function names, routes, events or exports.
3. Language and framework versions, and the test tool (or none yet).
4. Real example inputs and outputs, with personal data removed.
5. What must not change (URLs, function names, output formats, file formats, database columns) and what hurts most today.

**Access:** level 1 to read the code; level 2 to make the commits on a branch and open a pull request; level 3 to merge it after review, within your limits.

## Steps

### 1. Describe what it does today

Read the whole file and write its behaviour as plain numbered steps. List every public entry point: exported functions and classes, URLs, DOM ids and events, CLI arguments, outputs, file and data formats other code depends on.

### 2. Agree the two lists

- **Must not change:** from the owner and the dependency search.
- **Hurts most:** what slows people down or causes bugs.
These set the order of work.

### 3. Write characterisation tests first

Feed in real inputs and record the current outputs as the expected values, even where they look wrong. If the code is hard to test, find a seam: a place to pass in a dependency, wrap a global or capture output without changing behaviour. For browser code, record the DOM before and after each user action.

Where today's behaviour looks like a bug, keep it, pin it in a test, and list it as a decision for the owner. Fixing it is a separate change.

### 4. Plan the moves

Small named steps, each ending with the tests passing:
1. Rename unclear variables and functions (inside the file first).
2. Extract functions from long blocks.
3. Remove duplication.
4. Extract modules for separate concerns.
5. Modernise syntax (for example `let`/`const`, arrow functions, `querySelector` for jQuery selectors, type annotations).
6. Delete dead code, only after a search shows nothing calls it.

### 5. For specific moves

- **jQuery to plain JavaScript:** keep DOM ids, classes and event behaviour the same; replace `$(document).ready` with `DOMContentLoaded` or a deferred script; handle collections that jQuery looped over silently; check animations and AJAX error handling.
- **JavaScript to TypeScript:** start with types for the data shapes, keep the same exports, avoid `any` except at real boundaries, and list each bug the types expose rather than fixing it silently.
- **Old PHP or Python to a supported version:** clear deprecation warnings first; keep behaviour; flag functions removed in the target version.

### 6. Write the final files and the map

Show the final files in full and a table mapping each old function to its new home.

### 7. Write the commit plan

One move per commit, with the test command after each. **Level 2:** make the commits on a branch and open the pull request. The pull request description explains that behaviour is unchanged and links the characterisation tests.

## Checks before handing over

- Every public name still exists, or is in the change table for the owner to approve.
- Characterisation tests cover each entry point and the odd behaviours.
- No behaviour changes are hidden in the refactor; suspected bugs are listed separately.
- No new library without a version and a reason.
- Before-and-after counts (lines, functions) come from the real code, not estimates.
- The commit plan has one move per commit and a test command after each.
- Nothing claims the tests were run unless you shared the output.

## Output format

1. What the code does today, in numbered steps.
2. Public entry points and must-not-change list.
3. Characterisation tests.
4. Planned moves in order.
5. Final files in full.
6. Old-to-new map.
7. Suspected bugs kept as-is, for the owner to decide.
8. Commit plan.

## Example of good output (short)

*Illustrative structure, not a real business: a tutoring agency with a 700-line `booking.js` written in jQuery. Copy the shape, never the content: every fact comes from the client's own context.*

> **Must not change.** DOM ids `#slot-picker`, `#confirm-btn`; the `booking:confirmed` event the analytics script listens for; the POST body sent to `/api/bookings`.
>
> **Odd behaviour pinned.** Selecting the same slot twice sends two requests (test `sends_duplicate_request_on_double_select`). Listed as a decision: fix in a separate pull request.
>
> | Old | New | Notes |
> |---|---|---|
> | `$('#slot-picker').on('change', ...)` inline handler (lines 40-212) | `slots.js` `handleSlotChange()` | Same event, same DOM updates |
> | `formatPrice()` copied three times | `format.js` `formatPrice()` | Duplicates removed |
>
> **Commit plan.** 1) Add characterisation tests. 2) Extract `handleSlotChange`. 3) Remove duplicate `formatPrice`. 4) Replace jQuery selectors. 5) Replace `$.ajax` with `fetch`, keeping the POST body identical. Run `npm test` after each.
