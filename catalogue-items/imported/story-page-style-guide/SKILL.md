---
name: storytelling
description: Narrative-driven design using visuals, copy, and interaction to guide users through engaging, emotionally resonant journeys.
license: MIT
metadata:
  author: typeui.sh
---

## How to run this skill

AI Blocks added these notes. The original skill below is unchanged. Where a note here disagrees with it, follow the note.

### What you need
- A short version of the story the page tells.
- The mood or feeling wanted, and who the page is for.
- Optional: brand colours and fonts to keep.

### If something is missing
- Ask once for the story and the audience. If you still do not have them, write `MISSING: <what>` at the top and go on with clearly marked assumptions.
- Never invent facts about the product, its customers or its claims.

### Read the original's Brand line like this
- The Brand line below is garbled. It means: use storytelling techniques to make a page that feels engaging, clear and emotional, and that guides the visitor through one journey using visuals, copy and interaction. Write the design idea for this user's story instead of repeating that line.
- Add a short story flow to the guide: the parts of the page in order, and the job each part does for the visitor.

### Make the defaults fit the story
- The fonts and colours under Style Foundations (Inter, Abril Fatface, `#3B82F6`, `#8B5CF6`) are the original author's starting point. Replace them with the person's brand values when given. If none are given, say they are placeholders.
- The original sets the visual style to "playful". Change it to match the mood the user asked for.

### Check contrast before you hand it back
- For every text and background pair, work out the contrast ratio and write it next to the pair. Normal text needs 4.5 to 1. Large text and parts of the interface need 3 to 1.
- With the original colours, white text on the blue `#3B82F6` is about 3.7 to 1 and on the purple `#8B5CF6` about 4.2 to 1. Both fail for normal text. Darken them for any button with white text, or use large text only.
- If you change a colour, work the ratio out again. Do not guess.

### What you hand back
- Open with the one-line design idea, then follow the Required Output Structure below.
- Finish with `CHECKS MISSED:` and list any check you could not do, or write "none".
- Say that the guide is rules only. A designer or developer builds the page from it.

<!-- TYPEUI_SH_MANAGED_START -->
# Storytelling Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for Storytelling.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand
a narrative techniques to create engaging, intuitive, and emotionally resonant digital experiences. It guides users through a cohesive journey using visuals, copy, and interaction, transforming functional interfaces into memorable experiences.

## Style Foundations
- Visual style: playful
- Typography scale: desktop-first expressive scale | Fonts: primary=Inter, display=Abril Fatface, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: primary, neutral, success, warning, danger | Tokens: primary=#3B82F6, secondary=#8B5CF6, success=#16A34A, warning=#D97706, danger=#DC2626, surface=#FFFFFF, text=#111827
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
