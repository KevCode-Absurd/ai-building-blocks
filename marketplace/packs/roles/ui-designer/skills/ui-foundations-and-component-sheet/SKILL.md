---
name: ui-foundations-and-component-sheet
description: Sets the visual foundations for an app or website - type scale with sizes, weights and line heights, spacing scale, grid and breakpoints, colour roles in hex for light and dark, radius and elevation - fitted to the platform (web, Apple HIG or Material 3), then writes a component style sheet for buttons, inputs, cards and other parts with exact values for every state. Use it when screens work but look unfinished, before designing new screens, or when developers ask "what size, what colour?".
---

# UI foundations and component style sheet

## When to use

- A product works but looks unfinished: sizes, colours and spacing vary from screen to screen.
- A team is about to design or build new screens and has no written visual rules.
- Developers are building from a UI kit and need the product's own values.
- Before a contrast and dark mode check, so there is something to check.

For token files and versioned libraries, hand the result to the design systems designer kit. For flows and wireframes, see the UX designer kit.

## What you need

1. **Screens:** screenshots, a live link, a design file link, or the CSS or theme file.
2. **Brand:** colours (hex), fonts and their licences, logo, any brand rules that cannot change.
3. **Platforms:** web (which breakpoints), iOS, Android, or several.
4. **Existing kit or system,** if any: Material, an Apple UI kit, Tailwind, a company library.
5. **Who uses it and the main task,** so the hierarchy serves that task.
6. **Access I have:** the level per tool (1 read, 2 read and draft, 3 read, write and publish). Until the client answers, work at level 1.

## Steps

1. **Read the platform first.** For iOS, start from Apple's text styles and Dynamic Type, the default 17 pt body and 44 by 44 pt controls. For Android, start from Material 3 colour roles and its 15-style type scale, and pick the styles you need. For the web, start from the brand and the WCAG 2.2 rules.
2. **Type scale.** Choose a base body size and a ratio or a hand-tuned set. Name each style by job (display, heading, title, body, label, caption) and give size, line height, weight and letter spacing. Use as few styles as the content needs. Check line length: body text columns around 45 to 90 characters. Avoid thin weights at small sizes.
3. **Spacing scale.** One base unit and a short set of steps (for example 4, 8, 12, 16, 24, 32, 48). Say what each is for: inside controls, between related items, between groups, between sections.
4. **Grid and breakpoints.** Columns, gutters and margins per breakpoint, including the narrowest phone width (320 CSS pixels on the web). On Apple platforms, use size classes and safe areas instead of device sizes.
5. **Colour roles.** Background, surface, raised surface, text default, text muted, border, input border, primary action and the text on it, secondary action, link, focus ring, danger, warning, success, info, disabled. Give each a light hex and a dark hex. Do not invert for dark mode. On Android, map to M3 roles (primary, on-primary, primary-container and so on).
6. **Radius and elevation.** A few radii (control, card, sheet, full) and a few elevation levels with shadow or tonal values. In dark mode, show raised surfaces with a lighter tone, not only a shadow.
7. **Check contrast** for every text role on every surface it can sit on, in light and dark: 4.5:1 for normal text, 3:1 for large text, 3:1 for input borders, control icons and focus rings. Fix failures now (use the contrast-and-dark-mode-check skill for a full table).
8. **Component style sheet.** For each component (button in each emphasis, text input, select, checkbox, radio, switch, link, card, tag or chip, alert, tabs, modal or sheet, list row, navigation bar), give height, padding, radius, type style, colour roles, icon size and gap for each state: default, hover, focus, pressed, selected, disabled, loading, error. Focus ring: at least 2 px, 3:1 against what is next to it. Targets: at least 24 by 24 CSS pixels on the web, 44 by 44 pt on iOS, 48 by 48 dp on Android.
9. **Show one example screen** using only the foundations, to prove they work together.
10. **Deliver at the right level.** Level 1: tables and a short note. Level 2: build the styles, variables (with light and dark modes) and a component sheet page in a "DRAFT" page or branch of the Figma file; or open a pull request with a CSS or theme file. Level 3: after the client confirms the action list and limits, apply to the shared file pages or merge the approved pull request; log each action.

## Checks

- Every value is exact (pt, px, dp, sp or hex), and every component uses only foundation values.
- Every colour role has light and dark values, and every pair passes.
- Every component has every state, including focus and disabled.
- Targets meet the platform size.
- Text containers can grow with larger text sizes and user text spacing.
- Fonts used are licensed for the platforms named.
- Any level 2 or 3 action is logged.

## Output format

1. Scope: platforms, sources, access level.
2. Type scale table: style, size, line height, weight, letter spacing, use.
3. Spacing table: step, value, use.
4. Grid table per breakpoint.
5. Colour roles table: role, light hex, dark hex, pairs and ratios.
6. Radius and elevation tables.
7. Component style sheet: one table per component, rows by state.
8. Example screen notes.
9. Open questions and action log.

## Example of good output (short)

*Fernleaf Studio is a made-up yoga studio booking app used only to show the format. Platforms: iOS and web. Access I have: level 1 (screenshots and CSS).*

| Style | Size / line height | Weight | Use |
|---|---|---|---|
| title-lg | 28 / 34 | Semibold | Screen titles |
| body | 17 / 24 (iOS), 16 / 24 (web) | Regular | Class descriptions |
| label | 15 / 20 | Medium | Buttons, tabs |

| Role | Light | Dark | Check |
|---|---|---|---|
| action.primary / on-primary | #0E7C66 / #FFFFFF | #5FD3B5 / #0B1F1A | 5.13:1 / 9.36:1 |
| border.input on surface | #7D8794 on #FFFFFF | #6E7C78 on #101413 | 3.64:1 / 4.26:1 |

**Button, primary, md**

| State | Height | Padding | Container | Label | Other |
|---|---|---|---|---|---|
| default | 44 | 0 x 20 | action.primary | on-primary, label | radius 10 |
| focus | 44 | 0 x 20 | action.primary | on-primary | 2 px ring #1D4ED8 offset 2 (6.70:1 on white) |
| disabled | 44 | 0 x 20 | #E4E7EC | #98A2B3 | exempt from contrast; not the only cue: label reads "Choose a class first" |
