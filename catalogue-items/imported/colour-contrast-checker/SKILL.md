---
name: design-token-contrast
description: "Checks WCAG 2.2 contrast between the color tokens of a project (light and dark theme) and suggests the closest passing color that keeps the hue."
category: frontend
risk: safe
source: community
source_repo: Clagoss/claude-code-para-disenadores
source_type: community
date_added: "2026-10-19"
author: Clagoss
tags: [accessibility, wcag, contrast, design-tokens, css, dark-mode]
tools: [claude, cursor, gemini]
license: "MIT"
license_source: "https://github.com/Clagoss/claude-code-para-disenadores/blob/main/LICENSE"
---

# Design Token Contrast

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Design tokens** (yours): the colours, type sizes and spacing, as CSS or JSON.
- **A design direction** (yours): the page's type, colours and layout rules.
- **An image** (yours): a finished picture.
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A design direction** with the [Page typography and layout planner](https://useaiblocks.com/skills/page-grid-and-type-planner). Bring a document, a design direction (optional). It uses your brand brain.
2. **A design direction** with the [Visual system rules writer](https://useaiblocks.com/skills/visual-system-rules-writer). Bring a brief. It uses your brand brain.
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for design tokens, a design direction, an image. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your project files, run the script and apply the fix once you agree.
- **Any AI that can run Node:** The script needs Node 18 or newer. A plain chat AI can do the hand-worked version.
<!-- /needs -->

## Overview

Measures contrast on the **tokens**, not on screens: a problem fixed in a token is fixed
everywhere it is used. A Node checker, shipped as source in
[references/contraste-checker.md](references/contraste-checker.md), reads the CSS custom properties
of the project, pairs text tokens with background tokens, measures each pair in the light theme
and in dark mode, and, for every pair that fails, proposes the color with the same hue and the
nearest lightness that passes. It also proposes **one value per token** that passes against every
background it is measured on, so the fix is a single change.

WCAG 2.2 AA minimums it applies: normal text **4.5:1** (1.4.3), large text **3:1**, and UI
components and graphics such as input borders, icons and focus rings **3:1** (1.4.11).

## When to Use This Skill

- Use when the palette changes, a color is added, or a light or dark theme is about to be approved.
- Use when the user asks whether a text color is readable on its background.
- Use when an accessibility audit flags contrast and you want the fix at the token level.

## When Not to Use

- Text over photos, gradients or colours with opacity: the script reads tokens, not pixels, so check those on screen.
- A full accessibility audit: contrast is one part of WCAG. Use a full audit for the rest.
- Final sign-off on its own: ask an accessibility specialist to confirm before you publish.

## If the User Gives No CSS File

Ask once for the colour pairs instead: each text colour and the background it sits on, as hex codes, and whether each is body text, large text or a border or icon. Then work out each ratio with the WCAG formula, show the numbers you used, and say these are hand-worked, so close results (within 0.2 of the minimum) need a second check in a contrast tool. Never guess pairs the user did not give. If token names do not tell you which is text and which is background, ask.

## How It Works

### Step 1: Run the measurement

The checker ships as source, not as a committed script: save the JavaScript block in
[references/contraste-checker.md](references/contraste-checker.md) as `contraste.mjs` in a
scratch directory (no dependencies, Node 18+), then run it:

```bash
node contraste.mjs --tokens src/styles/tokens.css
```

Without `--tokens` it looks for `src/styles/tokens.css` and other common locations. The script:

- Reads `--color-*` variables in hex, `rgb()`, `hsl()` or `oklch()`, resolves `var(--other)`, and
  separates the default theme from dark mode (`prefers-color-scheme: dark`, `.dark` or
  `[data-theme=dark]`).
- Pairs tokens by name: text tokens (`text`, `foreground`, `link`, `focus`…) over background tokens
  (`background`, `bg`, `surface`, `card`, `canvas`…). Spanish token names (`texto`, `fondo`,
  `superficie`, `tarjeta`) are recognized too.
- Prints `OK` or `NO` per pair, with the ratio, the minimum and the suggestion.

If token names do not follow that pattern, write the real pairs to a JSON file and pass it with
`--pares` (the keys are `texto`, `fondo` and `tipo`, where `tipo` is `texto` or `ui`):

```json
[{"texto": "--color-gray-500", "fondo": "--color-white", "tipo": "texto"},
 {"texto": "--color-input-border", "fondo": "--color-white", "tipo": "ui"}]
```

To explore a new palette, `--todos` measures every color against every other. `--json out.json`
writes the results for further processing. The script's output is in Spanish; ratios and token
names read the same in any language.

### Reading the script output

The script prints in Spanish. The words mean:

| Script says | Means |
|---|---|
| tema claro (por defecto) | light theme (the default) |
| modo oscuro | dark mode |
| OK / NO | the pair passes / fails |
| mín. | minimum ratio needed |
| sobre | on (text colour on background colour) |
| sugerencia para | suggestion for |
| Un solo valor para | one value that passes on every background |

English sample of one result: `NO  3.54:1 (min. 4.5) --color-text #888888 on --color-background #ffffff`, then `suggestion for --color-text: #757575 -> 4.62:1`.

### Step 2: Check what the script cannot see

- Text over **images or gradients**: capture the section and check the worst spot.
- Text with **opacity**, or colors hard-coded outside the tokens (search for `#[0-9a-fA-F]{3,8}`,
  `rgb(`, `text-[#`).
- States: `hover`, `disabled` (exempt, but still distinguishable), and placeholders that carry
  information.

### Step 3: Report and propose

| Pair | Now | Minimum | Suggestion | Where it is used |
|---|---|---|---|---|

Search for the classes and `var(--color-...)` references to fill "where it is used".

## Examples

### Example 1: A gray that fails on white

```text
== tema claro (por defecto): 4 colores leídos ==
  NO  3.54:1 (mín. 4.5) --color-text #888888 sobre --color-background #ffffff
       sugerencia para --color-text: oklch(56.2% 0.000 89.9) (#757575) → 4.62:1
```

Propose `#757575` for `--color-text`, the value the script suggested. If the token also sits on other backgrounds, use the single value the script gives that passes on all of them instead. Apply
it only after the user agrees, and run the script again to show it passes.

## Best Practices

- ✅ Fix the token once instead of patching each screen.
- ✅ Offer options: darken the token, keep the color only for large text, or add a new token
  (`--color-accent-text`) for small text and keep the original for fills and borders.
- ❌ Don't change brand colors without asking.
- ❌ Don't report a theme as passing without checking dark mode too.

## Limitations

- It measures tokens, not rendered pixels: images, gradients and opacity need a visual check.
- Pairing by name is a heuristic; use `--pares` when names are unconventional.
- This skill does not replace environment-specific validation, testing, or expert review.

## Security & Safety Notes

- The script only reads the CSS or JSON file you point it to and writes a file only with `--json`.
  It makes no network requests and installs nothing. Requires Node 18+.
- It never edits tokens by itself; changes are proposed and applied after the user approves.

## Common Pitfalls

- **Problem:** A dark-mode pair shows `OK` against the light background.
  **Solution:** Make sure dark-mode variables live in a `prefers-color-scheme: dark`, `.dark` or
  `[data-theme=dark]` block so the script can separate the themes.

## Related Skills

- `@wcag-audit-patterns` - For a full WCAG 2.2 audit beyond color contrast.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Design rule consistency reviewer](https://useaiblocks.com/skills/monthly-design-system-keeper).
- The [Design token and handoff builder](https://useaiblocks.com/skills/design-token-builder). It takes the audit report.
- The [Screen usability reviewer](https://useaiblocks.com/skills/new-screen-design-reviewer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Licence Note

The licence that governs this copy is CC BY 4.0, as set out in LICENSE-CONTENT. The MIT line in the front matter above is the licence the original author declared. Keep the credit to the original author either way.
