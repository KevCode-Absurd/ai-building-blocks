---
name: acreadiness-assess
description: 'Run the AgentRC readiness assessment on the current repository and produce a static HTML dashboard at reports/index.html. Wraps `npx github:microsoft/agentrc readiness` and hands off rendering to the @ai-readiness-reporter custom agent. Supports policies (--policy) for org-specific scoring. Use when asked to assess, audit, or score the AI readiness of a repo.'
argument-hint: "[--policy <path-or-pkg>] [--per-area] — e.g. /acreadiness-assess, /acreadiness-assess --policy ./policies/strict.json"
---

# /acreadiness-assess — AI-readiness assessment

Use this skill whenever the user asks for an **AI-readiness assessment**, a **readiness check**, an **audit**, or wants to **see how AI-ready** their repository is.

This skill is the *Measure* step in AgentRC's **Measure → Generate → Maintain** loop. The result is a self-contained HTML dashboard the user can open with `file://` or commit to the repo.

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

## Steps

1. **Confirm prerequisites.** Before anything else, ask the user to confirm that their company allows the repo contents to be sent to the AI tool in use. Do not continue without a yes. Also ask the user to confirm that .env files, keys and other secrets are removed from the repo copy being scanned, because the scan does not skip them. Node 20+ must be on PATH. If unsure, run `node --version`.

2. **Decide on a policy** (optional but encouraged):
   - If the user provided `--policy <source>`, capture it.
   - Otherwise check `agentrc.config.json` for a `policies` array.
   - If neither, run with no policy (built-in defaults).
   - For a primer on policies, suggest the `acreadiness-policy` skill.

3. **Run the readiness scan** in the repo root with structured output:
   ```bash
   npx -y github:microsoft/agentrc#<TAG OR COMMIT> readiness --json [--policy <source>] [--per-area]
   ```
   Replace `<TAG OR COMMIT>` with a release tag or commit the user picked from github.com/microsoft/agentrc. If they are unsure, suggest the newest tag on github.com/microsoft/agentrc/releases that is not marked pre-release, and show its release notes before running it. Do not run the command without a pin. Never use the unpinned form `github:microsoft/agentrc`, because it runs whatever the upstream repo serves today. If the user cannot pick a pin, stop and say so. The scan reads the repo's files, so confirm the user is happy for that code to be processed by the AI tool in use.
   The `CommandResult<T>` JSON envelope is your input for the next step.

4. **Hand off to the `ai-readiness-reporter` custom agent** to interpret the JSON and produce `reports/index.html`. If that agent is not installed, do this step yourself: read `report-template.html`, fill it in from the JSON, and write `reports/index.html`. The agent renders via the bundled template `report-template.html` (shipped alongside this skill) so every report has an identical look & feel. The agent:
   - Reads the bundled `report-template.html` and substitutes placeholders with real data.
   - Inlines all CSS, ships a single static file (works under `file://`).
   - Renders maturity level, overall score, grade, pass-rate vs threshold.
   - Breaks down all 9 pillars across **Repo Health** (8) and **AI Setup** (1) with *what it measures*, *why it matters for AI*, *current state*, and *a specific recommendation*.
   - Tags every pillar with an **AI relevance** badge (High / Medium / Low).
   - Surfaces **Extras** separately (they never affect the score).
   - Shows the **Active Policy** including any disabled/overridden criteria and thresholds.
   - Produces a **Prioritised Remediation Plan** (🔴 Fix First / 🟡 Fix Next / 🔵 Plan).
   - Embeds the raw AgentRC JSON for reuse.

5. **Tell the user where the report lives** (`reports/index.html`) and how to open it. Summarise in chat: maturity level, overall score, top three lowest pillars, and the single highest-leverage next action (almost always: run the `acreadiness-generate-instructions` skill).

## Notes

- AgentRC also has a built-in HTML renderer (`--visual` / `--output report.html`) but its output is intentionally generic. This skill produces a tailored, opinionated dashboard via the custom agent — closer to a code review than a metrics dump.
- For CI gating, recommend `agentrc readiness --fail-level <n>` (1–5).
- The skill never modifies repository files other than creating `reports/index.html`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Coding agent readiness test planner](https://useaiblocks.com/skills/copilot-acreadiness-policy). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
