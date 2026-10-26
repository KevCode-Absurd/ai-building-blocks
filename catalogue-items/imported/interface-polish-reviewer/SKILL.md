---
name: emil-design-eng
description: "Use when designing or reviewing polished product UI with Emil Kowalski-inspired animation, interaction, and component craft guidance."
category: frontend
risk: safe
source: community
source_repo: emilkowalski/skills
source_type: community
date_added: "2026-06-25"
author: Emil Kowalski
license: MIT
license_source: "https://github.com/emilkowalski/skills/blob/main/LICENSE.txt"
tags: [frontend, design, ui, animation, motion]
tools: [claude, cursor, codex, antigravity]
---

# Design Engineering

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use

- Use when the user asks for UI polish, product design critique, animation direction, or high-craft component decisions.
- Use when reviewing frontend code for motion quality, easing, duration, physicality, interaction feedback, or subtle interface details.
- Use when building or refining React, Tailwind, CSS, or Framer Motion interfaces where taste and perceived quality matter.

## When Not to Use

- Your brand system or platform sets its own motion rules: follow those first.
- You want spacing, type and layout slips in code: use the interface polish checker skill.
- You want to build a screen from nothing: use the polished interface builder skill.
- You want sign-off on accessibility or real-device motion: test on devices and with a specialist.

## How to Run This Skill

1. Read the detailed guide first (references/detailed-guide.md). In a chat AI, paste it in after this file.
2. If the user has given nothing to review, use the greeting from the guide, then ask once for: the screen, component or code (required), the framework such as React, Tailwind, CSS or Framer Motion, and the feeling they want (optional). If they already gave code or a description, skip the greeting and start the review.
3. Review only what you were shown. If you got a screenshot or a description with no code, say that motion and timing cannot be judged from a still, and limit notes to states and small details. Never invent code you were not shown.
4. Give the result in this order: the Before / After / Why table the guide requires, one row per issue; then the top 3 to 5 changes ranked by how much they improve the feel, each with its reason; then a line on what already works; then a "Next step" line.
5. Treat the guide as judgement, not law. If the user's brand system or platform sets a different rule, follow theirs and say so.

## Limitations

- This skill provides design engineering judgment; it does not replace project-specific product requirements, accessibility testing, or real-device motion review.
- Verify framework versions, installed dependencies, and rendered behavior before treating animation or UI recommendations as production-ready.
- Do not apply these rules mechanically when an existing brand system, platform convention, or user requirement calls for a different interaction language.

## Licence Note

The front matter above shows the licence the original author declared (MIT). The collection this skill came from says its written content is CC BY 4.0 (see LICENSE-CONTENT). Keep the credit to Emil Kowalski either way.
