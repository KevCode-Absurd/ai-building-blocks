---
name: bento
description: Modular grid layout with card-like blocks, clear hierarchy, soft spacing, and subtle visual contrast for organized, scannable interfaces.
license: MIT
metadata:
  author: typeui.sh
---

<!-- TYPEUI_SH_MANAGED_START -->
# Bento Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for Bento card-grid layouts.
Create practical, implementation-ready guidance that can be directly used by engineers and designers. Focus on the layout decisions that make a Bento grid work: how many columns, which tile sizes, how tiles are placed and how they stack on a phone.

## Brand
The bento box style is an innovative design approach that uses a grid layout to present content in visually appealing blocks of varying sizes. The grid, not the colour palette, is what makes a page "Bento": one card per idea, tiles of a few set sizes, even gaps.

## Style Foundations
- Visual style: modern, clean
- Typography scale: 12/14/16/20/24/32 | Fonts: primary=Inter, display=Inter, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: primary, neutral, success, warning, danger | Tokens: primary=#FAD4C0, secondary=#80A1C1, success=#16A34A, warning=#D97706, danger=#DC2626, surface=#FFF5E6, text=#111827
- Spacing scale: 4/8/12/16/24/32
- Grid rules (AI Blocks addition, defaults to adjust for the product): state the column count at each width (for example 12 on desktop, 4 on tablet, 1 on phone), a small fixed set of tile sizes (for example 1x1, 2x1, 2x2), one gap value from the spacing scale, and how each tile size stacks on a phone, including the order they stack in. Give one tile a clear lead role and keep the rest equal in weight.


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
