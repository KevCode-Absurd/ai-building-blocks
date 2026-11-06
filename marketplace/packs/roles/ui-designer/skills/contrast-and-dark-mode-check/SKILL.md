---
name: contrast-and-dark-mode-check
description: Lists every text and interface colour pair in an app or website, measures each WCAG 2.2 contrast ratio unrounded (4.5:1 text, 3:1 large text, 3:1 borders, icons and focus rings) in light and dark, fixes each failure with the nearest passing value, and maps every colour role to a dark mode value with Apple's and Material's dark mode guidance applied. Use it before launch, when adding dark mode, when brand colours change, or when a contrast complaint comes in.
---

# Contrast and dark mode check

## When to use

- Before a launch or a redesign goes live.
- When adding dark mode or a high-contrast theme.
- When brand colours change.
- After a complaint or an automated scan flags low contrast. Low-contrast text was found on most home pages in WebAIM's 2026 scan, so expect to find some.

For print and social graphics, use the graphic designer kit's contrast-and-legibility-check skill. For token files, hand results to the design systems designer kit.

## What you need

1. **Colours:** the palette or colour roles in hex, a CSS or theme file, or Figma variables with light and dark modes.
2. **Where colours meet:** screenshots of key screens, or a list of which text and icon colours sit on which surfaces.
3. **Text sizes and weights** for each pair, to know if the 3:1 large-text rule applies (18 pt / 24 px, or 14 pt / about 18.5 px bold).
4. **Platforms:** web, iOS, Android. Brand colours that must not change.
5. **Access I have:** the level per tool. Until the client answers, work at level 1.

## Steps

1. **List the pairs.** Every text role on every surface it can sit on (page, card, raised surface, sheet, tinted chip, image overlay). Every non-text part that identifies a control or state: input borders when they are the only edge, checkbox and radio outlines and marks, toggle tracks and thumbs, icons used as buttons, focus rings, selected tab indicators, chart lines that carry meaning.
2. **Measure.** Use the WCAG relative luminance formula. Do not round: 4.49:1 fails 4.5:1. Note exceptions: disabled controls, logos, pure decoration.
3. **Mark results.** Text: 4.5:1, or 3:1 for large text. Non-text: 3:1 against adjacent colours. Focus: visible, and as a design target at least 2 px with 3:1 change between focused and unfocused.
4. **Check colour-only meaning.** Error, success, selected and link states need a second cue: text, icon, weight or underline.
5. **Fix failures.** For each failure, give the nearest passing value in the same hue, and say what else uses that colour. If a brand colour cannot change, use it only where it passes (large text, fills with dark text) and add a darker or lighter text variant.
6. **Map dark mode.** For each colour role choose a dark value; do not invert. Keep surfaces dark grey rather than pure black unless asked; make raised surfaces lighter than the page (Apple's brighter foreground backgrounds, Material's tonal elevation). Soften brand colours that glow. Aim higher than the minimum for small text; Apple recommends 7:1 for custom colours.
7. **Measure dark mode** with the same pair list.
8. **Check system settings.** On Apple platforms, check with Increase Contrast and Reduce Transparency, and give increased-contrast variants for custom colours. On the web, follow `prefers-color-scheme` rather than forcing one theme.
9. **Check real content:** photos with white backgrounds, charts, shadows, brand logos, text over images.
10. **Deliver at the right level.** Level 1: the tables. Level 2: add light and dark modes to the Figma variables in a "DRAFT" page or branch, or open a pull request with the CSS changes. Level 3: after the client confirms the action list and limits, apply to the shared variables or merge the approved pull request; log each action.

## Checks

- Every pair has a ratio in every theme, measured, not estimated.
- Every failure has a fix, and the fix's ratio is shown.
- Disabled and decorative exceptions are named, not assumed.
- Dark mode has a value for every role, not just backgrounds and text.
- Colour-only meaning is removed.
- No claim that the product "is compliant"; this is a check against WCAG 2.2 contrast criteria.
- Any level 2 or 3 action is logged.

## Output format

1. Scope: palette source, screens, platforms, themes, access level.
2. Pair table: pair, element, size and weight, rule (4.5, 3 or 3 non-text), light ratio, dark ratio, result.
3. Fixes: old value, new value, new ratio, where else it is used.
4. Dark mode role map: role, light, dark, notes.
5. System setting and real-content notes.
6. Open questions and action log.

## Example of good output (short)

*Fernleaf Studio is a made-up yoga studio booking app used only to show the format. Access I have: level 1 (CSS and screenshots).*

| Pair | Rule | Light | Dark | Result |
|---|---|---|---|---|
| text.default on page | 4.5 | #1A1D1F on #FFFFFF, 16.94:1 | #E6ECEA on #101413, 15.51:1 | Pass |
| on-primary on primary | 4.5 | #FFFFFF on #12B886, 2.55:1 | #0B1F1A on #5FD3B5, 9.36:1 | Light fails |
| placeholder on input | 4.5 | #9CA3AF on #FFFFFF, 2.54:1 | not set | Fails; no dark value |
| input border on page | 3 (non-text) | #D0D5DD, 1.47:1 | #6E7C78, 4.26:1 | Light fails |
| focus ring on page | 3 (non-text) | #1D4ED8, 6.70:1 | #93C5FD, 10.29:1 | Pass |
| danger text on page | 4.5 | #B42318, 6.57:1 | #FF8A7A, 8.10:1 | Pass |

**Fixes.** Primary #12B886 → #0E7C66 (white text 5.13:1); also used on the "Book" button and active tab. Placeholder #9CA3AF → #667085 (4.97:1) and a visible label. Input border #D0D5DD → #7D8794 (3.64:1).
