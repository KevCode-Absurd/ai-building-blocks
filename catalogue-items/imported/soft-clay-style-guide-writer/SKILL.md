---
name: claymorphism
description: Soft, rounded 3D-like shapes mimicking malleable clay with playful, puffy elements and colorful surfaces.
license: MIT
metadata:
  author: typeui.sh
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **Brand brain**, made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for a brief, your brand brain. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It is text in, text out. No code or files are needed.
<!-- /needs -->

## How to run this skill

AI Blocks added these notes. The original skill below is unchanged. Where a note here disagrees with it, follow the note.

### What you need
- A short description of the product, and who will use it.
- Optional: brand colours and fonts to keep, and the platforms (web, phone) it is for.

### If something is missing
- Ask once for the product and the users. If you still do not have them, write `MISSING: <what>` at the top and go on with clearly marked assumptions.
- Never invent facts about the product, its customers or its claims.

### Make the defaults fit the product
- The fonts and colours under Style Foundations (Montserrat, Poppins, `#3B82F6`) are the original author's starting point, not your product's. Replace them with the person's brand colours and fonts when given. If none are given, say the defaults are placeholders.
- The Brand line describes the look in general. Write the design idea for this product, in your own words.
- Write down how round, how raised and how thick each shape is, so the clay look is a rule and not a mood.

### Check contrast before you hand it back
- For every text and background pair, work out the contrast ratio and write it next to the pair. Normal text needs 4.5 to 1. Large text and parts of the interface need 3 to 1.
- With the original colours, white text on the blue `#3B82F6` is about 3.7 to 1, which fails for normal text. The dark blue text colour `#1C398E` on white is about 10.4 to 1. Darken the blue for any button with white text, or use dark text on it, and say what you changed.
- If you change a colour, work the ratio out again. Do not guess.

### What you hand back
- Open with the one-line design idea, then follow the Required Output Structure below.
- Finish with `CHECKS MISSED:` and list any check you could not do, or write "none".
- Say that the guide is rules only. A designer or developer builds the screens from it.

<!-- TYPEUI_SH_MANAGED_START -->
# claymorphism Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for claymorphism.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand
a modern UI trend characterized by soft, rounded, 3D-like, "puffy" shapes that mimic malleable, colorful clay.

## Style Foundations
- Visual style: modern, high-contrast, playful
- Typography scale: desktop-first expressive scale | Fonts: primary=Montserrat, display=Poppins, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: primary, neutral, success, warning, danger | Tokens: primary=#3B82F6, secondary=#FFFFFF, success=#16A34A, warning=#D97706, danger=#DC2626, surface=#FFFFFF, text=#1C398E
- Spacing scale: 4/8/12/16/24/32


## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus states

## Writing Tone
concise, confident, helpful

## Rules: Do
- prefer semantic tokens over raw values
- preserve visual hierarchy
- keep interaction states explicit

## Rules: Don't
- avoid low contrast text
- avoid inconsistent spacing rhythm
- avoid ambiguous labels
- avoid mixing multiple visual metaphors

## Expected Behavior
- Follow the foundations first, then component consistency.
- When uncertain, prioritize accessibility and clarity over novelty.
- Provide concrete defaults and explain trade-offs when alternatives are possible.
- Keep guidance opinionated, concise, and implementation-focused.

## Guideline Authoring Workflow
1. Restate the design intent in one sentence before proposing rules.
2. Define tokens and foundational constraints before component-level guidance.
3. Specify component anatomy, states, variants, and interaction behavior.
4. Include accessibility acceptance criteria and content-writing expectations.
5. Add anti-patterns and migration notes for existing inconsistent UI.
6. End with a QA checklist that can be executed in code review.

## Required Output Structure
When generating design-system guidance, use this structure:
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Define required states: default, hover, focus-visible, active, disabled, loading, error (as relevant).
- Describe interaction behavior for keyboard, pointer, and touch.
- State spacing, typography, and color-token usage explicitly.
- Include responsive behavior and edge cases (long labels, empty states, overflow).

## Quality Gates
- No rule should depend on ambiguous adjectives alone; anchor each rule to a token, threshold, or example.
- Every accessibility statement must be testable in implementation.
- Prefer system consistency over one-off local optimizations.
- Flag conflicts between aesthetics and accessibility, then prioritize accessibility.

## Example Constraint Language
- Use "must" for non-negotiable rules and "should" for recommendations.
- Pair every do-rule with at least one concrete don't-example.
- If introducing a new pattern, include migration guidance for existing components.

<!-- TYPEUI_SH_MANAGED_END -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker). It takes the design tokens and design direction.
- The [Logo strength tester](https://useaiblocks.com/skills/logo-strength-tester). It takes the design direction.
- The [Design handoff specification writer](https://useaiblocks.com/skills/developer-handoff-spec-writer). It takes the design tokens.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
