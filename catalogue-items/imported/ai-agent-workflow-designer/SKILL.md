---
name: "agent-workflow-designer"
description: "Design production-grade multi-agent workflows with clear pattern choice (sequential, parallel, hierarchical), handoff contracts, failure handling, and cost/context controls. Use when architecting a multi-step agent pipeline, choosing between single-agent vs multi-agent approaches, or refactoring an LLM workflow that suffers from context bloat or unreliable handoffs."
---

# Agent Workflow Designer

**Tier:** POWERFUL  
**Category:** Engineering  
**Domain:** Multi-Agent Systems / AI Orchestration

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Design production-grade multi-agent workflows with clear pattern choice, handoff contracts, failure handling, and cost/context controls.

## Core Capabilities

- Workflow pattern selection for multi-step agent systems
- Skeleton config generation for fast workflow bootstrapping
- Context and cost discipline across long-running flows
- Error recovery and retry strategy scaffolding
- Documentation pointers for operational pattern tradeoffs

---

## When to Use

- A single prompt is insufficient for task complexity
- You need specialist agents with explicit boundaries
- You want deterministic workflow structure before implementation
- You need validation loops for quality or safety gates

---

## Quick Start

> **AI Blocks note:** two routes. **In a plain chat** (no scripts): describe the job, steps, volumes, and the time and cost limits, then ask for the design in the pattern that fits. Ask for these sections: Pattern (with reasons), Agent roles, Handoffs, Timeouts and retries, Cost limits, and Checks between steps. Skip the commands below. **With the full folder** (an AI that can run code and read files): the commands below run `scripts/workflow_scaffolder.py` and the AI can read `references/workflow-patterns.md`. Both are included in this item's folder.

```bash
# Generate a sequential workflow skeleton
python3 scripts/workflow_scaffolder.py sequential --name content-pipeline

# Generate an orchestrator workflow and save it
python3 scripts/workflow_scaffolder.py orchestrator --name incident-triage --output workflows/incident-triage.json
```

---

## Pattern Map

- `sequential`: strict step-by-step dependency chain
- `parallel`: fan-out/fan-in for independent subtasks
- `router`: dispatch by intent/type with fallback
- `orchestrator`: planner coordinates specialists with dependencies
- `evaluator`: generator + quality gate loop

Detailed templates: `references/workflow-patterns.md`

---

## Recommended Workflow

1. Select pattern based on dependency shape and risk profile.
2. Scaffold config via `scripts/workflow_scaffolder.py`.
3. Define handoff contract fields for every edge.
4. Add retry/timeouts and output validation gates.
5. Dry-run with small context budgets before scaling.

---

## Common Pitfalls

- Over-orchestrating tasks solvable by one well-structured prompt
- Missing timeout/retry policies for external-model calls
- Passing full upstream context instead of targeted artifacts
- Ignoring per-step cost accumulation

## Best Practices

1. Start with the smallest pattern that can satisfy requirements.
2. Keep handoff payloads explicit and bounded.
3. Validate intermediate outputs before fan-in synthesis.
4. Enforce budget and timeout limits in every step.
