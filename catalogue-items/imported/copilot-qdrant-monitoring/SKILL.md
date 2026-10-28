---
name: qdrant-monitoring
description: "Guides Qdrant monitoring and observability setup. Use when someone asks 'how to monitor Qdrant', 'what metrics to track', 'is Qdrant healthy', 'optimizer stuck', 'why is memory growing', 'requests are slow', or needs to set up Prometheus, Grafana, or health checks. Also use when debugging production issues that require metric analysis."
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Qdrant Monitoring

Qdrant monitoring allows tracking performance and health of your deployment, and identifying issues before they become outages. First determine whether you need to set up monitoring or diagnose an active issue.

- Understand available metrics [Monitoring docs](https://search.qdrant.tech/md/documentation/operations/monitoring/)

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Qdrant cluster capacity planner](https://useaiblocks.com/skills/copilot-qdrant-scaling). Bring your question, a codebase (optional).
2. **A plan** with the [Qdrant search relevance investigator](https://useaiblocks.com/skills/copilot-qdrant-search-quality). Bring your question, a codebase (optional), a plan (optional).
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Prometheus and Grafana:** They collect and chart Qdrant metrics, and Qdrant publishes example setups for both.
- **Claude or ChatGPT with web access:** They can open the Qdrant docs the skill links to.
<!-- /needs -->

## What you need

Ask once for anything not given:

- Where Qdrant runs: self-hosted, Kubernetes, Qdrant Cloud or Hybrid Cloud.
- The Qdrant version. Some checks need v1.17 or later.
- The mode: set up monitoring, or diagnose a problem happening now.
- For a problem: the symptom, when it started, and any metric values you have (optional).
- What is already in place, such as Prometheus, Grafana or log tools (optional).

If you cannot open the linked docs, say so and work from this file only.

## What you hand back

For setup, in this order: Metrics to collect, Health checks, Alerts (each with why it matters), Log plan.
For a problem: Likely cause, Number to check (the metric or endpoint that proves it), Fix to try, What not to touch.
Always end with Next steps: the first three actions, in order.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Qdrant search relevance investigator](https://useaiblocks.com/skills/copilot-qdrant-search-quality). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

Write `MISSING: <what>` and ask once. Never invent metric values, versions or thresholds. If the person gives no numbers, say which number to read first and stop there.


## Monitoring Setup

Prometheus scraping, health probes, Hybrid Cloud specifics, alerting, and log centralization. [Monitoring Setup](setup/SKILL.md)


## Debugging with Metrics

Optimizer stuck, memory growth, slow requests. Using metrics to diagnose active production issues. [Debugging with Metrics](debugging/SKILL.md)
