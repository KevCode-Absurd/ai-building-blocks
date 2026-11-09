---
name: screen-visual-spec
description: Writes the visual spec for one or more app or web screens - reading order, alignment, spacing between groups, the type style and colour role of every element, and how each element looks in every state and at each breakpoint, in light and dark - using the product's foundations, so a developer can build it without guessing. Use it after the wireframe or flow is agreed and before build, or when a screen has been built and needs exact values to match.
---

# Screen visual spec

## When to use

- A wireframe or rough screen is agreed and now needs exact visual values for build.
- A developer has built a screen from a sketch and it does not look right; they need numbers.
- A new screen must match the rest of the product.

Needs foundations (type, spacing, colour roles, components). If there are none, run the ui-foundations-and-component-sheet skill first. If the content and flow are not agreed, use the UX designer kit's text wireframe spec first.

## What you need

1. **The screen content:** a wireframe, screenshots, or a list of what is on the screen and the one main action.
2. **Foundations and components:** type scale, spacing scale, colour roles, component sheet or design system.
3. **Platforms and breakpoints**, and whether dark mode is in scope.
4. **Real content examples:** longest names, prices, dates, translations if any, empty and error messages.
5. **Access I have:** the level per tool. Until the client answers, work at level 1.

## Steps

1. **Set the reading order.** Write what the eye should see first, second and third, and the one main action. Everything else is quieter.
2. **Block out zones** top to bottom: navigation, header, main content groups, actions, footer or tab bar. Respect safe areas on phones and keep controls separate from content.
3. **Align.** Pick the alignment edges and keep every element on them. Indent only to show that an item belongs under another.
4. **Space.** Give the spacing token between every pair of neighbours: smallest inside a group, larger between groups, largest between sections. Space should show grouping before lines or boxes do.
5. **Type per element.** Assign a named type style to every text element. Note maximum lines and what happens to overflow (wrap, then truncate with the full text available).
6. **Colour per element.** Assign a colour role to every element, never a raw hex. Keep strong colour for the main action and status.
7. **States per element.** For every interactive element and every element that shows live data: default, hover, focus, pressed, selected, disabled, loading, error, empty, success, as relevant. For the screen: empty, loading (skeleton or spinner and where), error, partial data, offline, no permission.
8. **Breakpoints.** For each breakpoint, what moves, stacks, hides or changes size. Include the narrowest width (320 CSS pixels on the web) and the largest Dynamic Type size on iOS.
9. **Dark mode.** Confirm each role's dark value works on this screen: images with white backgrounds, charts, shadows on dark surfaces.
10. **Check.** Contrast for every text and non-text pair on the screen, target sizes, focus order and that focus is never fully hidden by sticky bars.
11. **Deliver at the right level.** Level 1: the spec as tables. Level 2: annotate the frames in a "DRAFT" page or branch of the Figma file (Dev Mode annotations next to each element), or open a pull request with the CSS changes. Level 3: after the client confirms the action list and limits, apply to the shared file pages or merge the approved pull request; log each action.

## Checks

- Every element has a type style, colour role, spacing above and below, and states.
- Every value comes from the foundations; any new value is flagged with a reason.
- The main action is the most prominent interactive element.
- Long, empty and error content is shown, not only the happy path.
- Contrast and target sizes pass in light and dark.
- Nothing is invented about the product: placeholder content is marked as placeholder.
- Any level 2 or 3 action is logged.

## Output format

1. Scope: screens, platforms, breakpoints, themes, access level.
2. Reading order and main action.
3. Zone list.
4. Element table: element, type style, colour role, spacing above / below, alignment, max lines, states.
5. Screen states: empty, loading, error, offline, no permission.
6. Breakpoint notes.
7. Contrast and target checks.
8. Open questions and action log.

## Example of good output (short)

*Illustrative structure, not a real business: a yoga studio booking app; screen: class detail, iPhone; access I have: level 2 in Figma ("DRAFT" page). Copy the shape, never the content: every fact comes from the client's own context.*

**Reading order:** class name, then time and teacher, then "Book this class". Price and cancellation rules are secondary.

| Element | Type style | Colour role | Space above / below | States |
|---|---|---|---|---|
| Class name | title-lg | text.default | 16 / 4 | Wraps to 2 lines, then truncates |
| Time and teacher | body | text.muted (#475467, 7.69:1) | 4 / 24 | none |
| Spots left chip | label | on chip: action.primary on #E7F4F0 (4.54:1) | 0 / 24 | "Full" uses text and icon, not colour only |
| Book this class | label | action.primary / on-primary (5.13:1) | 24 / safe area + 16 | loading: spinner replaces label, width fixed; disabled when full, label "Join waitlist" |

**Largest text size:** time and teacher stack on two lines; button grows in height, never clips.

**Action log:** 6 Nov, annotated 3 frames on page "DRAFT – class detail" in the client's app file. Result: done.
