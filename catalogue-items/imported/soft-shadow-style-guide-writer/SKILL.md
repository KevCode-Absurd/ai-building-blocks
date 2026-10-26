---
name: neumorphism
description: Soft, extruded UI elements with inner and outer shadows on monochromatic surfaces for a tactile, embedded look.
license: MIT
metadata:
  author: typeui.sh
---

## How to run this skill

AI Blocks added these notes. The original skill below is unchanged. Where a note here disagrees with it, follow the note.

### What you need
- A short description of the product, and who will use it.
- Optional: surface and accent colours to keep, and any accessibility needs.

### If something is missing
- Ask once for the product and the users. If you still do not have them, write `MISSING: <what>` at the top and go on with clearly marked assumptions.
- Never invent facts about the product, its customers or its claims.

### Replace what the original left in
- The heading says "Neumorphism club" and the Brand line says "Join the private club where people are building, monetizing, and marketing products with AI". That is the original author's example, not the user's product. Never copy it into the guide. Use the user's product and audience.
- The fonts and colours under Style Foundations (Space Mono, `#006666`, `#E7E5E4`) are a starting point. Replace them with the person's brand values when given. If none are given, say they are placeholders.
- The original lists "high-contrast" as the visual style, but this look is soft. Write it as soft depth that still meets contrast: soft shadows for depth, and enough colour, border or label that nothing relies on a faint shadow alone.

### Write the shadow rules
- Pick one base surface colour. Write shadows for three looks: raised, pressed (inset) and flat.
- Write each shadow as offset, blur and colour, for both the light side and the dark side, so a developer can copy it. Check the light and dark shadow colours against the surface.
- Say how raised, pressed, hover, focus and disabled differ, and what stops people confusing a disabled part with a normal one.

### Check contrast before you hand it back
- For every text, icon and focus outline, work out the contrast ratio against its background and write it next to the pair. Normal text needs 4.5 to 1. Large text, icons and focus outlines need 3 to 1.
- With the original colours on the surface `#E7E5E4`, the text colour `#1E2938` is about 11.7 to 1 and the teal `#006666` is about 5.4 to 1. The green `#00A63D`, orange `#FE9900` and red `#FF2157` are about 2.6, 1.7 and 3.0 to 1, so they cannot carry small text. Use darker shades, and add an icon and a text label.
- If you change a colour, work the ratio out again. Do not guess.

### What you hand back
- Open with the one-line design idea, then follow the Required Output Structure below, with a section for the shadow rules and a short list of where not to use the style.
- Finish with `CHECKS MISSED:` and list any check you could not do, or write "none".
- Say that the guide is rules only. A designer or developer builds the screens from it.

<!-- TYPEUI_SH_MANAGED_START -->
# Neumorphism club Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for neumorphism.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand
Join the private club where people are building, monetizing, and marketing products with AI.

## Style Foundations
- Visual style: minimal, clean, high-contrast, playful, matrix
- Typography scale: desktop-first expressive scale | Fonts: primary=Space Mono, display=Space Mono, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: primary, secondary, success, warning, danger, info | Tokens: primary=#006666, secondary=#F1F2F5, success=#00A63D, warning=#FE9900, danger=#FF2157, surface=#E7E5E4, text=#1E2938
- Spacing scale: compact density mode


## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus states, semantic HTML before ARIA, screen-reader tested labels

## Writing Tone
concise, confident, helpful, clear, friendly

## Rules: Do
- prefer semantic tokens over raw values
- preserve visual hierarchy
- keep interaction states explicit
- design for empty/loading/error states
- ensure responsive behavior by default

## Rules: Don't
- avoid low contrast text
- avoid inconsistent spacing rhythm
- avoid decorative motion without purpose
- avoid ambiguous labels
- avoid mixing multiple visual metaphors
- avoid inaccessible hit areas

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
