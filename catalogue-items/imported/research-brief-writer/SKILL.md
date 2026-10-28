---
name: research-prompt
description: "Turn vague research needs into one precise deep-research prompt with context and output criteria."
category: research
risk: safe
source: community
source_repo: davidondrej/skills
source_type: community
date_added: "2026-07-07"
author: davidondrej
tags: [research, prompting, briefs]
tools: [claude, codex]
license: "MIT"
license_source: "https://github.com/davidondrej/skills/blob/main/LICENSE"
---

# Research Prompt

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

## When to Use

- Use when the user wants a deep-research brief or researcher prompt.
- Use when a vague research question needs to become one precise self-contained paragraph.

Goal: turn a vague research need into ONE self-contained paragraph that a researcher with zero prior knowledge of the project can act on with zero back-and-forth.

## Rules

- **One paragraph.** No headers, no bullet list in the deliverable.
- **Prompt the job, not the topic.** Give search handles (timeframe, ranking, source type, decision logic) — not just a subject.
- **Assume zero prior knowledge.** Write for a researcher who has never heard of the project. Open by explaining, in plain English, what the project/product is, why it exists, and the current situation — so they understand what's going on, what we need, and why we need it.
- **Lead with the goal + decision.** Right after that explainer, state the single question the research must answer and the decision/use it informs.
- **Embed all context.** Names, dates, product, prior known facts, constraints. The researcher must not need to ask anything or guess.
- **Number the sub-questions inline** (1, 2, 3…) so coverage is explicit. Keep to 3–6. One mission per prompt — don't cram unrelated questions.
- **State constraints.** What to include, what to avoid (e.g. "only non-Chinese competitors", "no marketing fluff").
- **Source hierarchy.** Prefer primary sources (official docs, GitHub, papers, filings, changelogs); forums/X/Reddit are weak signal only, never factual proof.
- **Contradiction handling.** If sources conflict, separate confirmed facts / inference / unresolved uncertainty — don't force fake consensus. Flag low-confidence claims for verification.
- **Completion bar (define "done").** Don't stop at the first plausible answer. Corroborate each key claim with multiple independent primary sources where they exist; where sources are scarce, say so explicitly instead of padding. Keep going until every numbered sub-question is covered to this bar.
- **Gap round before finishing.** Require a final self-critique pass: list gaps, contradictions, and any single-source claims, then run another round of searches to close them — repeat until clean.
- **Constrain output hard, method loosely.** Be strict on the deliverable; leave the search path flexible so the researcher can explore.
- **Demand a fixed output per finding:** source link + specific claim + one-line "why it matters / why a viewer should care".
- Verifiable, citable facts only. No opinions.
- **Last sentence:** instruct them to output everything into a single detailed markdown file.

## Process

1. Pull context from the relevant project files / conversation (dates, names, known facts, audience, end use), and write a 1–2 sentence plain-English explainer of what the project is and why it exists for a reader who knows nothing.
2. Identify the ONE question the research answers.
3. Draft 3–6 numbered sub-questions that fully cover it.
4. Add include/avoid constraints + the per-finding output format.
5. Compress to one clean paragraph. Cut filler.

## Template

> [For a reader with zero prior knowledge: in 1–2 plain-English sentences, what the project/product is, why it exists, and the current situation.] Research [TOPIC + key identifying facts] to answer one question: [THE QUESTION] — for [DECISION / END USE]. Find: (1) …; (2) …; (3) …; (4) …. [Constraints: include X, avoid Y.] Prefer primary sources; treat forums/social as weak signal only; if sources conflict, separate fact from inference and flag what needs verification. Don't stop at the first plausible answer: corroborate each key claim with multiple independent primary sources where they exist (and say so explicitly where they don't), continuing until every numbered question is covered to that bar. Before finishing, do a self-critique pass — list gaps, contradictions, and any single-source claims, then run another round of searches to close them, repeating until clean. For each point, give the source link, the specific claim, and a one-line "why it matters". No marketing fluff — verifiable, citable facts only. Output everything into a single detailed markdown file.

## Executing the prompt

This step is optional. To run the finished prompt with an AI researcher, the author's route is DeepAPI `POST /v1/research/deep` (follow the `deep-research` skill). That route needs an API key and a paid service. The free route: copy the brief and paste it into a deep research tool yourself. Only use DeepAPI if the user asks for it and has a key.

## Example

**User request:**

> Turn vague research needs into one precise deep-research prompt with context and output criteria.

## Limitations

- Adapted from `davidondrej/skills`; verify local paths, tools, credentials, and agent features before acting.
- For commands, remote access, scheduling, browser automation, or file-changing workflows, get explicit user approval and confirm the target environment first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Deep reading map builder](https://useaiblocks.com/skills/deep-reading-map-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
