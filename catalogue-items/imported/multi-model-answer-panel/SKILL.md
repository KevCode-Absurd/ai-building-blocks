---
name: llm-council
description: "Run Fireworks-hosted open-weight model councils that compare responses and synthesize a final answer."
allowed-tools: Read, Write, Bash, AskUserQuestion
category: "ai-agents"
risk: "safe"
source: "official"
source_repo: "dair-ai/dair-academy-plugins"
source_type: "official"
date_added: "2026-06-19"
author: "DAIR.AI"
license: "MIT"
license_source: "https://github.com/dair-ai/dair-academy-plugins/blob/main/README.md#license"
tags:
  - dair-academy
  - ai
  - workflow
tools:
  - claude-code
  - codex-cli
  - cursor
---

# LLM Council (Fireworks AI)

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use

Use when one question is hard or important enough that you want several open models to answer it, rank each other's answers without seeing names, and have one chairman model write the final answer. Do not use it for questions with one checkable answer, or when cost or speed matters more than a second opinion.


_Source: [dair-ai/dair-academy-plugins](https://github.com/dair-ai/dair-academy-plugins) (the author lists MIT; we share this copy under CC BY 4.0, see the Licence note at the end)._

This skill implements Karpathy's LLM Council concept where multiple open-weight LLMs deliberate on a query, powered entirely by Fireworks AI:

1. **Phase 1**: All models respond to the query independently (parallel)
2. **Phase 2**: Models rank each other's anonymized responses
3. **Phase 3**: A Chairman LLM synthesizes the final answer

All inference runs through **Fireworks AI** using open-weight models. The speed and pricing of Fireworks makes it practical to run multi-model deliberation that would be slow or expensive on other providers.

## Before you start

You need all of these. If one is missing, say which one and stop. Do not make up answers.

1. **A question.** If the user has not given one, ask for it once.
2. **A Fireworks AI account and API key** in the `FIREWORKS_API_KEY` setting. Fireworks charges per token, so more models and longer questions cost more. Never ask the user to paste the key into the chat.
3. **A place to run Python 3 with the `requests` package.** The steps call the Fireworks API from the user's own machine.

If the user has no key or cannot run code, offer the manual version in "No code, no key" below.

## Steps

Follow `references/detailed-guide.md` for the commands. In short:

1. Check the key is set (pre-flight check in the guide).
2. Ask the user which 3 to 5 models sit on the council and which one is chairman. If your tool cannot show choices, list the model names in chat and ask.
3. Phase 1: every council model answers the question alone, in parallel. Save each raw answer.
4. Phase 2: each model ranks all answers, shown as Response A, B, C with names removed. Save each ranking.
5. Phase 3: the chairman reads every answer and every ranking, then writes the final answer. Save it.
6. Show the full result, read back from the saved files.

## Output format

Show the result in this order, and save the same text as `final_output.md`:

1. **Header.** The question, the council models and the chairman.
2. **Phase 1: individual responses.** One block per model: its letter, its name, how long it took, its token count and its full answer.
3. **Phase 2: cross-model rankings.** The letter-to-model key, then each model's ranking from best to worst with a one or two sentence reason for each.
4. **Phase 3: the chairman's final answer.** One combined answer that keeps the strongest points, settles contradictions and notes where the models agreed.
5. **Session folder.** The path to the saved files: `config.json`, `phase1_responses.json`, `phase2_rankings.json`, `phase3_synthesis.txt` and `final_output.md`.

If a model fails, show its error in place of its answer, say so in the header, and carry on with the rest. If the chairman fails, show the answers and rankings and say there is no final answer.

## No code, no key

If the user cannot run code or has no Fireworks key, say plainly that the automatic panel cannot run. Offer this manual version instead, and label it as manual in your reply:

1. The user pastes the same question into 3 different AI chats and copies each answer.
2. They paste all three answers into one chat, labelled A, B and C with no model names.
3. You rank them and give a combined answer. Say that this is a single-model ranking, not a true panel.

## CRITICAL RULES

1. **ALWAYS use AskUserQuestion** to let the user select council models (multiselect) and the Chairman model
2. **ALWAYS save raw responses to files** - never summarize or truncate API outputs
3. **ALWAYS show full transparency** - display all individual responses, all rankings, AND the final synthesis
4. **NEVER skip the ranking phase** - it is essential to the council deliberation process
5. **Read from files for display** - ensures content is shown unmodified
6. **ALWAYS display the final output to the user** after Phase 3 completes

## Limitations

- The models listed in the guide may change or be retired. If a model is not available, drop it and tell the user.
- A chairman can still be wrong. The final answer is a summary of what the models said, not a fact check.

- Requires the upstream tool, account, API key, or local setup when the workflow names one.
- Does not authorize destructive, production, paid, or external-message actions without explicit user approval.
- Validate generated artifacts or recommendations against the user's real sources before treating them as final.

## Licence note

The upstream author (DAIR.AI) lists this skill as MIT. The collection it was copied from lists its written content as CC BY 4.0 unless an upstream notice says otherwise (see `LICENSE-CONTENT`). Keep the credit to DAIR.AI and sickn33 either way.
