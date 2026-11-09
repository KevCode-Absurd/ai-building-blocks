---
name: ui-review-before-after
description: Reviews built or designed screens for visual quality - hierarchy, alignment, spacing, type, colour, contrast, states, platform fit and consistency - and writes each issue as a before-and-after note with the reason and the exact value to change, ranked so fixes on the main task come first. Use it when a product "looks off" and nobody can say why, before a launch, or after a developer has built from a design.
---

# UI review with before-and-after notes

## When to use

- The product works but looks unfinished or inconsistent, and the team wants a fix list, not a redesign.
- Before a launch or a demo, to catch visual slips.
- After build, to compare the built screen with the design.
- When a client asks "what would a designer change?".

This is a visual review. For a usability review of a flow, see the UX designer kit's usability-review skill.

## What you need

1. **The screens:** screenshots of each screen and state, a live link, or a design file. For built screens, phone and desktop captures, light and dark.
2. **The rules:** foundations, design system or brand rules, if any. If none exist, say so: the review then proposes values.
3. **The main task** on each screen.
4. **Platform:** web, iOS, Android.
5. **Access I have:** the level per tool. A review needs level 1 only.

## Steps

1. **Squint first.** Blur or shrink each screen and note what stands out first. If it is not the main content or main action, that is the first issue.
2. **Hierarchy.** Count the type sizes and weights on the screen. Check that one thing leads and that headings, labels and body are clearly different.
3. **Alignment and grid.** Find elements off the shared edges, uneven gutters, and items that should line up but do not.
4. **Spacing.** Check that space inside groups is smaller than space between groups, and that the same relationship uses the same value everywhere. Measure in px, pt or dp.
5. **Type.** Line length, line height, weights, truncation, orphans in headings, text that clips at larger sizes.
6. **Colour and contrast.** Measure text pairs (4.5:1, or 3:1 for large text), input borders, icons and focus rings (3:1). Look for colour-only meaning, too many accent colours, and brand colours used for text where they fail.
7. **States.** Look for missing hover, focus, pressed, disabled, loading, error and empty states. Check focus is visible and not hidden behind sticky bars.
8. **Platform fit.** iOS: system text styles, 44 by 44 pt controls, safe areas, Liquid Glass only on controls. Android: Material roles and 48 by 48 dp targets. Web: works at 320 CSS pixels and with user text spacing.
9. **Consistency.** The same component looks the same everywhere; values match the foundations; no one-off styles.
10. **Write each issue** as: where, what is wrong, why it matters (who it hurts or what it costs), before value, after value. Use exact values, never "a bit more".
11. **Rank.** Severity high (blocks or misleads on the main task, or fails contrast on text), medium (slows people, looks broken), low (polish). Main-task screens first.
12. **Deliver at the right level.** Level 1: the review. Level 2: add the notes as comments on the frames or in a "DRAFT" page, prepare tickets as a draft list, or open a pull request with the CSS fixes. Level 3: after the client confirms the action list and limits, apply the agreed fixes to the shared file or merge the approved pull request, and create tickets; log each action.

## Checks

- Every issue has a location, reason, before value and after value.
- Contrast claims show the measured ratio.
- Nothing that needs a screen I did not see is guessed; it is marked "need to see".
- Fixes use foundation values, or propose a new value with a reason.
- The list is ranked, and the top fixes are on the main task.
- Any level 2 or 3 action is logged.

## Output format

1. Scope: screens, platform, themes, rules used, access level.
2. Summary: three to five lines on the biggest problems.
3. Issue table: number, where, issue, why, before, after, severity.
4. Top five fixes in order, with owner role and effort.
5. Things to check on screens not shared.
6. Action log.

## Example of good output (short)

*Illustrative structure, not a real business: a yoga studio booking app; web, light theme; access I have: level 1 (screenshots). Copy the shape, never the content: every fact comes from the client's own context.*

**Summary.** The main button is the faintest thing on the booking screen, form fields are hard to see, and spacing between class cards changes from card to card.

| # | Where | Issue | Why | Before | After | Severity |
|---|---|---|---|---|---|---|
| 1 | Booking, "Book" button | White on mint fails contrast | Main action is hard to read | #FFFFFF on #12B886, 2.55:1 | #FFFFFF on #0E7C66, 5.13:1 | High |
| 2 | Sign-up form, inputs | Border is the only edge and is too faint | People cannot see where to type | #D0D5DD on #FFFFFF, 1.47:1 | #7D8794, 3.64:1 | High |
| 3 | Sign-up form, placeholder | Placeholder used as label, too light | Hint vanishes on typing; fails text contrast | #9CA3AF, 2.54:1, no label | Visible label above; hint #667085, 4.97:1 | High |
| 4 | Class list | Card gaps vary | Looks unfinished | 12, 18, 20 px | 16 px everywhere | Low |
