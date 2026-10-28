---
name: "code-tour"
description: "Use when the user asks to create a CodeTour .tour file — persona-targeted, step-by-step walkthroughs that link to real files and line numbers. Trigger for: create a tour, onboarding tour, architecture tour, PR review tour, explain how X works, vibe check, RCA tour, contributor guide, or any structured code walkthrough request."
---

# Code Tour

Create **CodeTour** files — persona-targeted, step-by-step walkthroughs of a codebase that link directly to files and line numbers. CodeTour files live in `.tours/` and work with the [VS Code CodeTour extension](https://github.com/microsoft/codetour).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

A great tour is a **narrative** — a story told to a specific person about what matters, why it matters, and what to do next. Only create `.tour` JSON files. Never modify source code.

## When to Use This Skill

- User asks to create a code tour, onboarding tour, or architecture walkthrough
- User says "tour for this PR", "explain how X works", "vibe check", "RCA tour"
- User wants a contributor guide, security review, or bug investigation walkthrough
- Any request for a structured walkthrough with file/line anchors

## Core Workflow

### 1. Discover the repo

Before asking anything, explore the codebase:

In parallel: list root directory, read README, check config files.
Then: identify language(s), framework(s), project purpose. Map folder structure 1-2 levels deep. Find entry points — every path in the tour must be real.

If the repo has fewer than 5 source files, create a quick-depth tour regardless of persona — there's not enough to warrant a deep one.

### 2. Infer the intent

One message should be enough. Infer persona, depth, and focus silently.

| User says | Persona | Depth |
|-----------|---------|-------|
| "tour for this PR" | pr-reviewer | standard |
| "why did X break" / "RCA" | rca-investigator | standard |
| "onboarding" / "new joiner" | new-joiner | standard |
| "quick tour" / "vibe check" | vibecoder | quick |
| "architecture" | architect | deep |
| "security" / "auth review" | security-reviewer | standard |
| (no qualifier) | new-joiner | standard |

When intent is ambiguous, default to **new-joiner** persona at **standard** depth — it's the most generally useful.

### 3. Read actual files

**Every file path and line number must be verified.** A tour pointing to the wrong line is worse than no tour.

### 4. Write the tour

Save to `.tours/<persona>-<focus>.tour`.

```json
{
  "$schema": "https://aka.ms/codetour-schema",
  "title": "Descriptive Title — Persona / Goal",
  "description": "Who this is for and what they'll understand after.",
  "ref": "<current-branch-or-commit>",
  "steps": []
}
```

### Step types

| Type | When to use | Example |
|------|-------------|---------|
| **Content** | Intro/closing only (max 2) | `{ "title": "Welcome", "description": "..." }` |
| **Directory** | Orient to a module | `{ "directory": "src/services", "title": "..." }` |
| **File + line** | The workhorse | `{ "file": "src/auth.ts", "line": 42, "title": "..." }` |
| **Selection** | Highlight a code block | `{ "file": "...", "selection": {...}, "title": "..." }` |
| **Pattern** | Regex match (volatile files) | `{ "file": "...", "pattern": "class App", "title": "..." }` |
| **URI** | Link to PR, issue, doc | `{ "uri": "https://...", "title": "..." }` |

### Step count

| Depth | Steps | Use for |
|-------|-------|---------|
| Quick | 5-8 | Vibecoder, fast exploration |
| Standard | 9-13 | Most personas |
| Deep | 14-18 | Architect, RCA |

### Writing descriptions — SMIG formula

- **S — Situation**: What is the reader looking at?
- **M — Mechanism**: How does this code work?
- **I — Implication**: Why does this matter for this persona?
- **G — Gotcha**: What would a smart person get wrong?

### 5. Validate

- [ ] Every `file` path relative to repo root (no leading `/` or `./`)
- [ ] Every `file` confirmed to exist
- [ ] Every `line` verified by reading the file
- [ ] First step has `file` or `directory` anchor
- [ ] At most 2 content-only steps
- [ ] `nextTour` matches another tour's `title` exactly if set

## Personas

| Persona | Goal | Must cover |
|---------|------|------------|
| **Vibecoder** | Get the vibe fast | Entry point, main modules. Max 8 steps. |
| **New joiner** | Structured ramp-up | Directories, setup, business context |
| **Bug fixer** | Root cause fast | Trigger -> fault points -> tests |
| **RCA investigator** | Why did it fail | Causality chain, observability anchors |
| **Feature explainer** | End-to-end | UI -> API -> backend -> storage |
| **PR reviewer** | Review correctly | Change story, invariants, risky areas |
| **Architect** | Shape and rationale | Boundaries, tradeoffs, extension points |
| **Security reviewer** | Trust boundaries | Auth flow, validation, secret handling |
| **Refactorer** | Safe restructuring | Seams, hidden deps, extraction order |
| **External contributor** | Contribute safely | Safe areas, conventions, landmines |

## Narrative Arc

1. **Orientation** — `file` or `directory` step (never content-only first step — blank in VS Code)
2. **High-level map** — 1-3 directory steps showing major modules
3. **Core path** — file/line steps, the heart of the tour
4. **Closing** — what the reader can now do, suggested follow-ups

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| **File listing** — "this file contains the models" | Tell a story. Each step depends on the previous. |
| **Generic descriptions** | Name the specific pattern unique to this codebase. |
| **Line number guessing** | Never write a line you didn't verify by reading. |
| **Too many steps** for quick depth | Actually cut steps. |
| **Hallucinated files** | If it doesn't exist, skip the step. |
| **Recap closing** — "we covered X, Y, Z" | Tell the reader what they can now *do*. |
| **Content-only first step** | Anchor step 1 to a file or directory. |

## Cross-References

- Related: `engineering/codebase-onboarding` — for broader onboarding beyond tours
- Related: `engineering/pr-review-expert` — for automated PR review workflows
- CodeTour extension: [microsoft/codetour](https://github.com/microsoft/codetour)
- Real-world tours: [coder/code-server](https://github.com/coder/code-server/blob/main/.tours/contributing.tour)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Codebase onboarding guide writer](https://useaiblocks.com/skills/codebase-onboarding-guide-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
