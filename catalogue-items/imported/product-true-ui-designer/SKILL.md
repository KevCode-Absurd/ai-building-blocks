---
name: anti-ui-slop
description: "Stop coding agents from shipping generic UI. Extend the product's design system, use UIZZE evidence only when useful, cover required states, and inspect the rendered result."
category: frontend
risk: safe
source: https://github.com/uizze/uizze/tree/main/skills/anti-ui-slop
source_repo: uizze/uizze
source_type: official
date_added: "2026-08-16"
author: UIZZE
tags: [ui, ux, frontend, design, anti-ui-slop]
tools: [claude, codex, cursor, copilot]
license: MIT
license_source: https://github.com/uizze/uizze/blob/main/LICENSE
---

# Stop Making UI Slop

Build product-specific UI. UIZZE (https://uizze.com), the author, says its catalogue holds 800,000+ real web and iOS screens. That figure is theirs and is not checked here.

## Overview

Use the product brief, existing interface, components, and local design system
before reaching for outside references. UIZZE evidence is optional: it should
answer a concrete visual question, not turn every interface task into a research
project.

## When to Use

Use this skill when designing, implementing, redesigning, critiquing, or doing a
pre-ship review of a web or iOS interface.

## When NOT to Use

- Android, desktop apps or print: this skill covers web and iOS.
- A brand-new product with no design system, no components and no brief: write a style guide first, then come back.
- Only the words on the screen: this skill does not review wording.
- Backend, data or API work with no interface.

## Inputs

Ask once, in one message, for anything not given:
- The product brief and the screen's purpose (required)
- Web or iOS (required)
- Access to the project's components, tokens and existing screens, as files or pasted code (strongly advised)
- A reference or screenshot you like (optional)

If there is no brief, ask for it and stop. If there is no design system or code to read, say so in the output, use plain defaults, and mark each choice as "chosen by me". Never invent users, metrics, testimonials or product data.

## Work From the Product

1. Identify the screen's real job, primary user and action, required content,
   and important loading, empty, error, success, disabled, and permission states.
2. Reuse the repository's components, semantic tokens, typography, spacing, and
   interaction conventions before adding a new abstraction or visual language.
3. For a new interface or major redesign, write a short design contract covering
   hierarchy, workflow shape, allowed components, required states, responsive
   behavior, and observable acceptance criteria. Keep smaller changes smaller.
4. Use product-specific labels and data. Do not invent metrics, activity,
   testimonials, users, or placeholder workflows to make a layout look complete.

## Optional UIZZE Evidence

The free skill and public catalogue work without an account, token, dependency,
script, or executable. If a concrete unresolved visual question would benefit
from evidence, use the smallest relevant set of screens or materials.

The optional authenticated UIZZE MCP exposes exactly `find_ui_references` and
`find_ui_materials`. It needs a UIZZE account. Pricing is not stated in the source, so check uizze.com before relying on it. Use it only when those tools are actually available. If a
search returns nothing, continue silently from repository evidence. Never claim
an MCP-backed result that was not returned by the host.

Treat references as evidence, not templates. Transfer useful decisions about
hierarchy, density, navigation, controls, responsive behavior, and state
handling; never copy another product's branding, proprietary text, imagery, or
exact layout.

Install the current free skill directly from its canonical source. This is optional and runs a command from uizze.com in a terminal on your computer. Read what it does first, and skip it if you only want the steps in this file:

```bash
npx skills add https://uizze.com --skill anti-ui-slop
```

## Finish

When the environment supports it, render and inspect the result once. Fix
observable breakage such as clipping, overlap, distorted media, inaccessible or
inert controls, missing required states, and unintentional responsive behavior.
Run the project's normal checks and keep the handoff concise.

If you cannot render or run anything, say so, and review the code or design by reading it only.

## Output format

```
Screen job: <who uses it, their main action, the content needed>
Design contract (new screens and big redesigns only)
- Hierarchy: <what is first, second, third>
- Workflow: <steps from start to done>
- Parts reused: <components and tokens from your system>
- New parts: <only if none fits, and why>
- Small screens: <what changes>
- Done when: <checks you can observe>
States
| State | Shown when | What the user sees | Next action |
| loading, empty, error, success, disabled, permission | <trigger> | <content> | <button or link> |
Built or changed: <files, or the design in words>
Review of the rendered result: <what you checked, what was broken, what you fixed>
Fix before shipping: 1. <fix> 2. <fix>
References used: <UIZZE results, or "none">
Assumed: <anything chosen without evidence>
```

## Limitations

- This workflow does not replace product validation, accessibility review,
  security review, or project-specific tests.
- UIZZE evidence is optional and may legitimately return no useful result.
- A reference is not permission to copy another product's identity or assets.
