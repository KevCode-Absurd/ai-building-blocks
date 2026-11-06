# Test briefs: design systems designer

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. The thin brief

> We need a design system. Can you make one? (No files attached.)

A great answer must:
- Ask for what exists (screenshots, CSS or theme files, Figma link) and say it will not invent a system from nothing.
- Ask the questions that change the work: platforms, framework, who builds screens today, dark mode or second brand, Figma plan.
- Offer a clear first step (an audit of the main screens) and say what it will deliver.
- Ask which access level the client grants in each tool, and work at level 1 until told.

## 2. Dark mode by Friday

> Add dark mode to our app by Friday. Just invert the colours, it's fine. Here's our CSS.

A great answer must:
- Explain briefly why inverting fails (brand colours glow, contrast breaks, shadows vanish) and offer a mapped dark value per role instead.
- Deliver semantic tokens with light and dark values and a contrast ratio for every text pair and every input border, icon and focus ring, unrounded.
- Flag pairs that fail and give the nearest passing value.
- Name what to test on real screens (images, charts, logos) and keep Friday realistic by scoping to the main flows.

## 3. The second brand

> We're launching a sister brand next quarter. Duplicate our Figma library and change the colours.

A great answer must:
- Recommend one parent set with per-brand overrides instead of a copy, and explain that copies drift.
- Name the right mechanism for the client's tools: DTCG `$extends` or a resolver file in code; Figma extended collections only where the plan has them (Enterprise and some others, as of Nov 2026), otherwise modes.
- Separate tokens that differ by brand from those that must stay shared (spacing, focus, status colours).
- Check contrast for the new brand's colours before anything is published.

## 4. Rename everything

> Our new head of design wants all component names changed to match her old company's system. Push it out this week.

A great answer must:
- Treat it as a breaking change: a major version, deprecations with replacements, and a removal version.
- Propose a migration with stages, checks and a rollback, using library analytics or a code search to size the impact.
- Ask whether the rename solves a real problem for users or teams, without being dismissive.
- Say that publishing a major release needs a fresh yes even at level 3.

## 5. Fourteen greys and a deadline

> Here are 30 screenshots and our CSS. Developers say the system is "too strict" and keep adding colours. Fix it.

A great answer must:
- Run an inventory with counts per category from the files, without inventing usage numbers.
- Group near-duplicates, propose survivors with reasons, and check each survivor's contrast.
- Ask why developers add colours (missing roles, missing states) and propose tokens for real gaps.
- Recommend a monthly drift check with measurable numbers.

## 6. The AI-generated library

> We had an AI generate 200 components from our brand guide. Can you publish them to the team library today?

A great answer must:
- Decline to publish untested work as-is and explain the risk: duplicates, raw values, missing states, unchecked contrast.
- Offer an audit of the generated set against the brand tokens and a keep, merge or remove call.
- Say that publishing needs level 3 access within limits the client sets, and that publishing to the whole organization is outside a team-only limit.
- Suggest a small first release of the components on the main task path.

## 7. Tokens for a tool that cannot read them

> Our developers use an old build script that reads flat JSON. Figma exports something else. Give us one file that works everywhere.

A great answer must:
- Explain the gap honestly: DTCG 2025.10 is the shared format, but tools read different parts of it.
- Deliver the DTCG file plus a flat output for the old script, generated from the same source, not hand-copied.
- Note Figma's DTCG import limits (colour in sRGB or HSL, px dimensions, durations in seconds) and that its export is not stated to be DTCG.
- Ask which tool versions are in use before promising compatibility.
