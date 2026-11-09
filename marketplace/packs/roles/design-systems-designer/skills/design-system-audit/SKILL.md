---
name: design-system-audit
description: Takes stock of a product's interface - colours, type, spacing, radii, shadows, buttons, inputs and other parts - from screenshots, CSS, a Figma file or library analytics, counts the distinct values, groups near-duplicates, and proposes one smaller set with a keep, merge or remove call for each item. Also runs as a monthly drift check on an existing system. Use it before starting a design system, before a redesign, or when screens built by different people no longer look like one product.
---

# Design system audit

## When to use

- A product has grown through many hands and the client says "it doesn't feel like one product".
- Before building a design system, to show what exists and win agreement on a smaller set.
- Monthly, on a live system, to find new one-off values, unused components and drift.
- Before a migration, to know what will change.

Not for judging the brand direction (see the brand identity designer kit) or the usability of flows (see the UX designer kit).

## What you need

1. **The interface:** screenshots of the main screens (ideally one of each type), a live URL, the CSS or theme files, or a view link to the Figma file.
2. **The system, if one exists:** token file, Figma library, component list, docs link.
3. **Usage data, if any:** Figma library analytics (insertions and detaches; Organization plan and above), or a code search of hard-coded values.
4. **The main user and task**, so fixes can be ranked by their effect on that task.
5. **Access I have:** the level per tool. An audit needs level 1 only.

## Steps

1. **Pick the categories.** Colours, font families, font sizes, weights, line heights, spacings, radii, shadows, icons, buttons, inputs, selects, checkboxes and radios, cards, alerts and messages, modals, navigation, tables, empty states. Add categories the product needs.
2. **Collect one of each unique item.** From screenshots, crop one example per unique look; from CSS, extract every distinct value with a count of uses; from Figma, list styles, variables and local components that are not from the library. Record where each was found.
3. **Lay them side by side.** One table or board per category, near-duplicates next to each other. This view is the argument: people agree faster when they see six buttons in a row.
4. **Count.** Distinct values per category, and how many uses each has. Note values used once.
5. **Group near-duplicates and propose survivors.** For each group, name the survivor and why (most used, passes contrast, fits the scale). Keep the set as small as the product allows.
6. **Check accessibility on the survivors.** Text pairs at 4.5:1 (3:1 for large text), input borders, control icons and focus indicators at 3:1, in every theme. Flag any survivor that fails and propose a fix.
7. **Call each item.** Keep, merge into another, or remove. For components, also note missing states (focus, disabled, error, loading) and missing variants people are faking with detaches.
8. **Rank the fixes** by effect on the main task and by how many screens they touch. Fixes on the main path first.
9. **For a monthly drift check,** compare with last month: new raw values in code, new local components in design files, Dev Mode raw values where a variable exists, components with rising detaches, library components nobody inserted. Suggest keep, merge or remove for each, and whether the system needs a new variant.
10. **Hand over at the right level.** Level 1: the report. Level 2: put the inventory board in a "DRAFT" page of the Figma file or a FigJam board, and prepare fix tickets as a draft list or import file. Level 3: after the client confirms the actions and limits, create the tickets in the named project, and log each one.

## Checks

- Every category has a count, and every count can be traced to a screenshot, file or analytics view.
- No usage figures are invented; if no analytics exist, say "not measured".
- Every survivor has a reason, and every removed item says what replaces it.
- Contrast is checked for every survivor in every theme.
- Fixes are ranked, with the main task named.
- The report separates facts (counted) from proposals (judgement).

## Output format

1. Scope: screens, files and data used; date; access level.
2. Summary: three to five lines, with counts before and after.
3. Category tables: item, where found, uses, call (keep, merge, remove), survivor, reason.
4. Accessibility notes on survivors.
5. Component gaps: missing states and variants.
6. Ranked fix list: fix, screens affected, owner role, effort.
7. For monthly checks: changes since last month, with trend.
8. Open questions and action log.

## Example of good output (short)

*Illustrative structure, not a real business: a booking app for photo studios. Access I have: level 1 (CSS files and 24 screenshots). Copy the shape, never the content: every fact comes from the client's own context.*

**Summary.** 14 greys, 9 font sizes and 6 button styles in use. Proposal: 5 greys, 6 sizes, 3 button variants (primary, secondary, quiet) in two sizes.

| Item | Where found | Uses | Call | Survivor | Reason |
|---|---|---|---|---|---|
| #6B6B6B text | Booking list, footer | 41 | Keep | color.text.muted | Most used; 5.33:1 on white |
| #777777 text | Settings | 6 | Merge | color.text.muted | Looks the same; 4.48:1 on white fails |
| #999999 text | Date picker hints | 9 | Merge | color.text.muted | 2.85:1 on white fails |
| "Book now" green button | Studio page | 1 | Remove | Primary button | One-off; no reason found |

**Component gaps.** Primary button has no focus or loading state in the library; three screens fake loading with a detached instance.

**Top fix.** Merge the three greys on the booking path (12 screens). Owner: designer, then developer. Effort: small.
