---
name: glassmorphism
description: Frosted glass effect with translucent layers, subtle blur, and luminous borders for depth and modern elegance.
license: MIT
metadata:
  author: typeui.sh
---

<!-- TYPEUI_SH_MANAGED_START -->
# Glassmorphism Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for Glassmorphism.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand
Ask once, in a single message, for anything below that was not given:
- What the product is and who uses it (required)
- Platform: web, iOS, Android or several
- Brand colours and fonts that must stay (if none, use the defaults in Style Foundations)
- Screens or components to cover first
If an answer is still missing, write MISSING next to it and use the defaults. Never invent a brand name, users, numbers or quotes.

Style idea: translucent layers, subtle blur and luminous borders for depth (glassmorphism).

## Style Foundations
- Visual style: clean, translucent, frosted glass (glassmorphism)
- Typography scale: write exact sizes for each step (see Contrast and Font Checks) | Fonts: primary=Plus Jakarta Sans, display=Plus Jakarta Sans, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: primary, neutral, success, warning, danger, info, surface/subtle layers | Placeholder tokens, replace with the user's brand colours: primary=#1856FF, secondary=#3A344E, success=#07CA6B, warning=#E89558, danger=#EA2143, surface=#FFFFFF, text=#141414
- Spacing scale: 4/8/12/16/24/32 (default, adjust to the product)


## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus states

## Writing Tone
concise, confident, helpful, clear, friendly, professional

## Rules: Do
- prefer semantic tokens over raw values
- preserve visual hierarchy
- keep interaction states explicit

## Rules: Don't
- avoid low contrast text
- avoid inconsistent spacing rhythm
- avoid decorative motion without purpose
- avoid ambiguous labels
- avoid mixing glass with other styles on one screen, such as heavy drop shadows or flat solid blocks

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

## Glass Rules to Cover
- Define three layers (base, raised, overlay). For each give a blur radius in px, a background colour with its opacity, a light border colour and a shadow.
- Test text against the worst spot behind the glass: the lightest and the darkest part of the background, not the average. If a pair fails, put the text on a more opaque layer.
- Say what each layer looks like when blur is not available, or when the user turns on reduced transparency or high contrast: a solid colour with the same text colour.
- Say how many blurred layers one screen may have, as a number the team can check.

## Contrast and Font Checks
- Test every text and background pair in the guide. Normal text needs 4.5:1. Large text (24px, or 18.5px bold) and meaningful borders or icons need 3:1. Show the ratio next to each pair in the token table. If you cannot work it out, write "unchecked".
- On white, text #141414 is about 18.4:1 and primary #1856FF is about 5.5:1, so both work as text. White text on primary also passes (about 5.5:1). Dark text on primary does not (about 3.4:1).
- Danger #EA2143 is about 4.4:1, just under 4.5:1. Darken it a little for small text, or keep it for large text.
- Success #07CA6B (about 2.2:1) and warning #E89558 (about 2.4:1) fail even as icons on white. Use them as fills with dark text on top (#141414 gives about 8.5:1 and 7.8:1) and add a label or icon.
- The colours and fonts here are placeholders, not the user's brand. If the user gave their own, use theirs and test them the same way.
- Write exact sizes for each type step and say how they shrink on a phone.

## When Not to Use
- The brand already has a written style guide: extend that guide instead.
- You want a flat, solid look with no see-through layers: use the minimal style guide skill.
- You want soft, raised and pressed-in surfaces: use the soft shadow style guide skill. For chunky, puffy shapes use the soft clay style guide skill.
- Your background is a busy photo or video where text cannot be kept readable: choose a solid style instead.

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

## After the Guide
End with a 'Next step' line: hand the guide to your designer or developer, or paste it into your coding AI's project instructions so new screens follow it.

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
