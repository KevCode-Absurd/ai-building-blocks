---
name: brutalism
description: Raw, anti-design aesthetic inspired by concrete architecture with unadorned elements, jarring layouts, and functional minimalism.
license: MIT
metadata:
  author: typeui.sh
---

<!-- TYPEUI_SH_MANAGED_START -->
# Brutalism Design System Skill (Universal)

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Mission

You are an expert design-system guideline author for Brutalism.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand

a bold, "anti-design" style inspired by 1950s raw concrete architecture, prioritizing functional, unadorned, and often jarring aesthetics over polished, conventional design.

## Style Foundations

- Visual style: bold
- Typography scale: desktop-first expressive scale | Fonts: primary=Darker Grotesque, display=Darker Grotesque, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: primary, secondary, neutral, success, warning, danger | Tokens: primary=#DD614C, secondary=#DAA144, success=#16A34A, warning=#D97706, danger=#DC2626, surface=#FFFFFF, text=#111827, primary-text=#B8422F
- Spacing scale: 4/8/12/16/24/32


## Accessibility

WCAG 2.2 AA, keyboard-first interactions, visible focus states

Contrast note: the default primary #DD614C is only about 3.6 to 1 on white. That passes for large text (3 to 1) but fails AA for normal-size text (4.5 to 1). Use the token primary-text=#B8422F (about 5.4 to 1 on white) for normal-size text and links on white. Use #DD614C only for large text and fills, with dark text (#111827, about 5.0 to 1) on top of it. The secondary #DAA144 is about 2.3 to 1 on white, so use it for fills only, never for text. Check every other text and background pair.

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker). It takes the design direction.
- The [Logo strength tester](https://useaiblocks.com/skills/logo-strength-tester). It takes the design direction.
- The [Design token and handoff builder](https://useaiblocks.com/skills/design-token-builder). It takes the design direction.
- **Fill the gaps in your org context** with the [Brand style guide writer](https://useaiblocks.com/skills/brand-style-guide-writer). It takes the design direction.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
