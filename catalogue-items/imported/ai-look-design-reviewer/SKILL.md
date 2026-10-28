---
name: styleseed-design-review
description: "Reviews UI/frontend code and tells you exactly why it \"looks AI-generated\" — then how to fix it."
risk: safe
source: https://github.com/bitjaru/styleseed/tree/main/skills/styleseed-design-review
source_repo: bitjaru/styleseed
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/bitjaru/styleseed/blob/main/LICENSE
---

> **AI Blocks note (licence):** this copy is credited under the MIT licence in the `license:` line above, the author's own header (see LICENSE). sickn33's collection labels it CC BY 4.0 (LICENSE-CONTENT). Keep the credit to bitjaru and sickn33.

# StyleSeed Design Review

## Overview

A UI reads as "AI-generated" not because the components are ugly, but because the **parts
don't agree with each other** — mixed corner radii, three accent colors, pure-black text,
no hierarchy, missing states, robotic copy. This skill reviews a UI file (or a whole
directory) against a concrete design rubric, scores it 0–100, and returns a prioritized
fix list. It reviews and recommends; it never edits or deletes without you asking.

Full rule set (74 rules) and components: https://github.com/bitjaru/styleseed

## When to use

- A React / Tailwind / HTML UI "looks off," generic, or unfinished and you can't say why.
- You want a design score / pre-ship check.
- The user asks to make UI "look professional / polished / designed, not AI-generated."
- After generating UI, to verify it before shipping.

## When not to use

- Backend code. Ask a developer or a code review tool.
- A logo or brand identity. Work with a designer.
- A colour contrast check only. Use a free contrast checker.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What you need first

The AI must be able to read the project files, or be given the UI code pasted in. Ask which screen to focus on.

## How to review

Read the file(s). Score these **seven categories** (total 100); start each at full marks
and subtract for violations you can cite by line. Be specific and evidence-based.

### 1. Coherence — 20  (the #1 "AI-generated" tell)
One choice per axis, applied everywhere. Deduct for each **mixed** axis:
- mixed corner radii — e.g. a sharp card with pill buttons (−6)
- two or more accent colors used for emphasis (−5)
- **emoji used as UI icons** (🚗🧺⭐ as list/nav/status/category markers) — injects many uncontrolled hues; use one line-icon set in currentColor (−6)
- mixed shadow languages / light directions (−3)
- mixed icon families, fill modes, or stroke weights (−3)
- inconsistent control heights (buttons/inputs differ) (−3)

### 2. Color discipline — 16
- pure black (`#000` / `text-black`) text — the refined black is ~`#2A2A2A` (−4 each, cap −8)
- hardcoded hex where a semantic token exists (−2 each, cap −6)
- **a normal / OK / default ("보통") state shown in a status color** instead of neutral grey (−4)
- **status color on most/every row** (no severity hierarchy — color should mark the minority that needs attention) (−4)
- **decorative hues** — gold stars, rainbow category dots, a different color per card — instead of accent/grey (−3)
- status conveyed by color alone, no icon/text (−4)
- contrast below WCAG AA (4.5:1 body, 3:1 large/UI) (−6)

### 3. Hierarchy & typography — 16
- number and its unit not ~2:1 (48px number / 24px unit) (−4)
- everything the same size and weight, no clear primary (−5)
- arbitrary font sizes; no scale (−4)
- wrong line-height (loose on display, cramped on body) (−3)

### 4. Layout & spacing — 12
- content on a bare page background, not in cards (−6)
- off-grid spacing (7/13/19px instead of an 8px scale) (−3)
- the gap *around* a group not larger than the gap *inside* it (−3)
- the same section type repeated in a row (−4)

### 5. States — 12
- missing empty / loading / error state on a data surface (−5 each, cap −10)
- empty state with no next action; error that blames instead of helping (−4)

### 6. UX writing — 12
- buttons that don't name the action ("Submit" / "OK" instead of "Send $2,400") (−4)
- error copy that blames or uses system-speak ("Invalid input", "An error occurred") (−4)
- two terms for one concept (delete vs remove); filler words ("please", "successfully") (−2)

### 7. Motion & polish — 12
- ad-hoc fades instead of one consistent, named feel (−3)
- motion that delays content or blocks an action (−4)
- no `prefers-reduced-motion` handling on custom motion (−3)
- a single hard black shadow instead of a layered, low-opacity, tinted one (−2)

Clamp each category at 0; sum to a total. Bands: 90+ A · 80–89 B · 70–79 C · 60–69 D · <60 F.

## Output format

```
## Design Score: 72 / 100   (src/Dashboard.tsx)   C

Coherence            13/20   sharp cards (l.22) + pill buttons (l.48); 3 accent hues
Color discipline     12/16   #000 headings (l.12, 40)
Hierarchy & type     15/16   number/unit 1:1 on hero (l.18)
Layout & spacing     10/12   two identical KPI rows (l.22-31)
States                7/12   no empty/loading state on the orders list
UX writing            8/12   "Submit" button (l.55); "Invalid input" (l.61)
Motion & polish      10/12   one hard black shadow (l.22)

### Fix first (highest score gain)
1. Unify radius (pick soft 8–12px) + collapse to one accent   → +11 coherence/color
2. Add empty + loading states to the orders list              → +7  states
3. Rename "Submit" → "Send $2,400"; "Invalid input" → "Check the card number" → +6 copy

Re-score after: ~90 / 100.
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Screen usability reviewer](https://useaiblocks.com/skills/new-screen-design-reviewer).
- The [Product-specific interface designer](https://useaiblocks.com/skills/product-true-ui-designer). It takes the audit report.
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Rules

- Review from real evidence (cite line numbers); never guess.
- Order the fix list by **score gain**, not severity alone — fastest path to a better number.
- For a directory: one-line score per file, then the lowest file's full breakdown.
- **Don't auto-edit.** This skill measures and recommends. Apply fixes only when asked.
- Use it as a **quality gate**: review right after generating UI, apply the fix list, and
  re-review until the score clears ~80 *before showing the user* — no first-draft, incoherent
  UI (rainbow status lists, emoji icons, two accents, missing states) should reach them. The
  bar is a floor, not a ceiling: clear 80 and ship; don't chase 100 to delay.

---

Based on **StyleSeed** — an open-source (MIT) design engine that gives Claude Code, Cursor,
and Codex design judgment so AI-built UI stops looking generated. Full 74-rule reference,
components, brand skins, and motion: https://github.com/bitjaru/styleseed

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
