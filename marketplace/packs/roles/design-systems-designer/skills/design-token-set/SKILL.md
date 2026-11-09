---
name: design-token-set
description: Builds a complete design token set from a brand brief, pasted CSS or a Figma export - primitives, semantic tokens and light and dark values - and writes it as W3C DTCG 2025.10 JSON, CSS custom properties, a Tailwind CSS v4 theme or a Figma variables table, with a mapping from every old value and a contrast ratio for every text pair. Use it when colours and sizes are scattered across files, when adding dark mode or a second brand, or when designers and developers need the same names.
---

# Design token set

## When to use

- Colours, font sizes and spacings are copied by hand between screens and nobody knows which value is right.
- The team is adding dark mode, a high-contrast theme or a second brand.
- Designers use Figma variables and developers use CSS or Tailwind, and the names do not match.
- A developer asks for "the tokens" and there is only a brand PDF.

Not for choosing a brand look from scratch (see the brand identity designer kit) or building the component library in code (see the front-end developer kit).

## What you need

1. **The current values:** pasted CSS or SCSS, a Tailwind config or theme, a Figma variables or styles export, or a brand sheet with hex codes and fonts.
2. **The outputs wanted:** DTCG JSON, CSS custom properties, a Tailwind v4 `@theme` block, a Figma variables table, or several. Ask which tools will read the file and which version.
3. **Themes:** light only, light and dark, high contrast, more than one brand.
4. **Platforms:** web, iOS, Android. If Figma variables will be read in code, the code names for each.
5. **Access I have:** the level the client grants in each tool (1 read, 2 read and draft, 3 read, write and publish). Until they answer, work at level 1.

## Steps

1. **Collect every value.** List each colour, font family, size, weight, line height, spacing, radius, shadow and duration, with where it is used. Normalise colours to 6-digit hex.
2. **Group near-duplicates.** Put values that look the same side by side (`#F5F5F5` and `#F6F6F6`; 15 px and 16 px). Propose one survivor per group and say why.
3. **Build primitives.** A colour scale per hue with plain names (`color.blue.600`), a type scale, a spacing scale on one base unit the team chooses, radii, shadows and durations. Keep only steps that will be used.
4. **Build semantic tokens on top.** Name each by its job: `color.text.default`, `color.text.muted`, `color.surface.page`, `color.surface.raised`, `color.border.input`, `color.action.primary`, `color.action.primary-text`, `color.status.danger`, `color.focus.ring`, `space.inset.md`, `radius.control`. Each points to a primitive with an alias such as `{color.blue.600}`. Components use semantic tokens only.
5. **Map themes.** For dark mode, choose a dark value for each semantic token; do not invert. For a second brand, override only the tokens that differ. In DTCG, use `$extends` or a resolver file; in Figma, use modes, or extended collections where the plan has them [knowledge.md, section 3].
6. **Check contrast in every theme.** For every text token on every surface it can sit on, compute the WCAG ratio: 4.5:1 for normal text, 3:1 for large text. For input borders, control icons and the focus ring, 3:1 against adjacent colours. Do not round: 4.49 fails. Fix failures by changing the token value and record old and new ratios.
7. **Write the files.** One complete code block per file, no gaps:
   - **DTCG JSON:** `.tokens.json`, `$type` on groups, `$value` on tokens, `$description` on semantic tokens, colours as objects with `colorSpace`, `components` and a `hex` fallback, dimensions with `px` or `rem`. Check names contain no `.`, `{` or `}` and do not start with `$`.
   - **CSS:** custom properties on `:root`, dark values under `[data-theme="dark"]` and inside `@media (prefers-color-scheme: dark)` if the client wants to follow the system.
   - **Tailwind v4:** an `@theme` block using the namespaces (`--color-*`, `--font-*`, `--text-*`, `--spacing`, `--radius-*`), `--color-*: initial` if the client wants only their colours, and `@theme inline` where a variable points to another.
   - **Figma table:** collection, group, variable, type, value per mode, alias, scope and code syntax per platform.
8. **Write the mapping table.** Old value, where it was used, new token. Nothing from step 1 may be missing.
9. **Show one example of use**, such as a button in CSS using only semantic tokens.
10. **Deliver at the right level.** Level 1: hand over the files. Level 2: open a pull request with the token files, or build the variables in a branch or "DRAFT" page of the Figma file. Level 3: after the client confirms the action list and limits, merge the approved pull request or publish the library update, and log each action.

## Checks

- Every value from step 1 is kept, merged or mapped.
- Every semantic token has a value in every theme and a description.
- Every text pair and every non-text pair has a ratio, in every theme, and passes.
- Names follow one pattern; no token is named by look at the semantic layer.
- JSON is valid; hex codes have six digits; units are present on every dimension.
- If a tool reads only part of DTCG (Figma imports colour in sRGB or HSL, dimensions in px, durations in s), the note says what was left out.
- Any level 2 or 3 action is in the action log.

## Output format

1. Scope: sources used, themes, outputs, access level.
2. Audit summary: counts before and after, near-duplicate groups.
3. Token files, one code block each.
4. Contrast table: pair, theme, ratio, pass or fixed.
5. Mapping table: old value, where used, new token.
6. Example of use.
7. Open questions and action log.

## Example of good output (short)

*Illustrative structure, not a real business: an event ticketing app. Access I have: level 1 (pasted CSS). Copy the shape, never the content: every fact comes from the client's own context.*

Audit: 11 greys in use, merged to 4 primitives. One grey, `#9AA3AF` text on white, measured 2.55:1, replaced by `color.text.muted`.

Excerpt of the DTCG file (`color.slate.600` is `#5B6470`, defined in the full file):

```json
{
  "color": {
    "$type": "color",
    "blue": { "600": { "$value": { "colorSpace": "srgb", "components": [0.141, 0.341, 0.773], "hex": "#2457c5" } } },
    "text": {
      "muted": { "$value": "{color.slate.600}", "$description": "Secondary text on page and raised surfaces" }
    }
  }
}
```

| Pair | Light | Dark |
|---|---|---|
| text.default on surface.page | #1B1F24 on #FFFFFF, 16.56:1 | #E8EAED on #121417, 15.31:1 |
| text.muted on surface.page | #5B6470 on #FFFFFF, 6.00:1 | #A9B1BC on #121417, 8.52:1 |
| action.primary-text on action.primary | #FFFFFF on #2457C5, 6.47:1 | #121417 on #7FA6F5, 7.62:1 |
| border.input on surface.page (3:1) | #8A94A3, 3.07:1 | #5C6673, 3.17:1 |

| Old value | Used in | New token |
|---|---|---|
| #9AA3AF | Event card dates, footer links | color.text.muted (fixed from 2.55:1) |
| #F6F6F6 | Checkout panel | color.surface.raised |
