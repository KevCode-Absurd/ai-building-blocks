---
name: acreadiness-assess
description: 'Run the AgentRC readiness assessment on the current repository and produce a static HTML dashboard at reports/index.html. Wraps `npx github:microsoft/agentrc readiness` and hands off rendering to the @ai-readiness-reporter custom agent. Supports policies (--policy) for org-specific scoring. Use when asked to assess, audit, or score the AI readiness of a repo.'
argument-hint: "[--policy <path-or-pkg>] [--per-area] — e.g. /acreadiness-assess, /acreadiness-assess --policy ./policies/strict.json"
---

# /acreadiness-assess — AI-readiness assessment

Use this skill whenever the user asks for an **AI-readiness assessment**, a **readiness check**, an **audit**, or wants to **see how AI-ready** their repository is.

This skill is the *Measure* step in AgentRC's **Measure → Generate → Maintain** loop. The result is a self-contained HTML dashboard the user can open with `file://` or commit to the repo.

## Steps

1. **Confirm prerequisites.** Before anything else, ask the user to confirm that their company allows the repo contents to be sent to the AI tool in use. Do not continue without a yes. Node 20+ must be on PATH. If unsure, run `node --version`.

2. **Decide on a policy** (optional but encouraged):
   - If the user provided `--policy <source>`, capture it.
   - Otherwise check `agentrc.config.json` for a `policies` array.
   - If neither, run with no policy (built-in defaults).
   - For a primer on policies, suggest the `acreadiness-policy` skill.

3. **Run the readiness scan** in the repo root with structured output:
   ```bash
   npx -y github:microsoft/agentrc#<TAG OR COMMIT> readiness --json [--policy <source>] [--per-area]
   ```
   Replace `<TAG OR COMMIT>` with a release tag or commit the user picked from github.com/microsoft/agentrc. Do not run the command without a pin. Never use the unpinned form `github:microsoft/agentrc`, because it runs whatever the upstream repo serves today. If the user cannot pick a pin, stop and say so. The scan reads the repo's files, so confirm the user is happy for that code to be processed by the AI tool in use.
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
