---
name: agentic
description: Conversational AI-first interface with minimal controls, clear outcomes, and delegated task flows for agentic workflows.
license: MIT
metadata:
  author: typeui.sh
---

<!-- TYPEUI_SH_MANAGED_START -->
# Agentic Design System Skill (Universal)

## Mission
You are an expert design-system guideline author for Agentic.
Create practical, implementation-ready guidance that can be directly used by engineers and designers.

## Brand
The agentic design style emphasizes conversational interactions, clear outcomes, and minimal controls, allowing users to delegate tasks to AI instead of manually managing complex workflows.

Ask once, in a single message, for anything below that was not given:
- What the product is and who uses it (required)
- Platform: web, iOS, Android or several
- Fonts or colors that must stay (if none, use the defaults in Style Foundations)
- Screens or components to cover first
If an answer is still missing, write MISSING next to it and use the defaults. Never invent a brand name, users, numbers or quotes.

## Style Foundations
- Visual style: modern, bold
- Typography scale: 14/16/18/24/32/40 | Fonts: primary=Playfair Display, display=Playfair Display, mono=JetBrains Mono | weights=100, 200, 300, 400, 500, 600, 700, 800, 900
- Color palette: surface/subtle layers | Tokens: primary=#FF5701, secondary=#F6F6F1, success=#16A34A, warning=#D97706, danger=#DC2626, surface=#FFFFFF, text=#111827
- Spacing scale: 8pt baseline grid


## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus states, semantic HTML before ARIA, screen-reader tested labels, reduced-motion support, 44px+ touch targets, high-contrast support

## Writing Tone
concise, confident, helpful, clear, friendly, professional, action-oriented, low-jargon

## Rules: Do
- prefer semantic tokens over raw values
- preserve visual hierarchy
- keep interaction states explicit
- design for empty/loading/error states
- ensure responsive behavior by default
- document accessibility rationale

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

## Contrast and Font Checks
- Test every text and background pair in the guide. Normal text needs 4.5:1. Large text (24px, or 18.5px bold) and meaningful borders or icons need 3:1. Show the ratio next to each pair in the token table. If you cannot work it out, write "unchecked".
- The default text color passes easily: #111827 on white is about 17.7:1. The default primary #FF5701 does not pass as text on white or as a fill behind white text (about 3.2:1). Use dark text (#111827, about 5.6:1) on a primary fill, and use primary on white only for large text, icons and borders. Success #16A34A (about 3.3:1) and warning #D97706 (about 3.2:1) have the same limit. Danger #DC2626 passes (about 4.8:1).
- Playfair Display is a serif with high contrast between thick and thin strokes. Keep it for headings and large text. If the person wants a sans-serif for message text, suggest it as an option and label it as a change from the default.
- Use only font weights each font really comes in (Google Fonts lists them). The weight list in Style Foundations is a maximum, not a promise.

## When Not to Use
- A product with no conversation-first screen, such as a dashboard or a shop: use a general brand style guide.
- A product that must keep its own brand fonts and colors: extend your own guide and use this one only as a pattern.
- A reading-heavy or story-led page: use the magazine layout or story-led page guide.

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

## After the Guide
End with a "Next step" line: hand the guide to your designer or developer, run the QA checklist in code review, or paste the guide into your coding AI's project instructions so new screens follow it.
