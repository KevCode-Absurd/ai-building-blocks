---
name: idea-evaluator
description: "Evaluates an idea by hosting a multi-turn debate between a Pro and Con agent, delivering a final verdict on whether it's worth pursuing."
category: agent-orchestration
risk: safe
source: self
source_type: self
date_added: "2026-09-18"
author: Prince-1652
tags: [ideation, validation, debate, multi-agent]
tools: [claude, gemini]
---

# Idea Evaluator Orchestrator

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your idea** (yours): the product, app, business or project idea, in a line or a short paragraph.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your idea. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

The Idea Evaluator skill acts as an impartial judge for evaluating new concepts, features, or project ideas. It takes an initial idea from the user and orchestrates a structured, multi-turn debate between two simulated personas: a logical supporter (Pro Agent) and a constructive critic (Con Agent). 

By pitting these two perspectives against each other, it surfaces the strongest arguments for both sides before delivering a comprehensive final verdict on whether the idea is worth building.

## When to Use This Skill

- Use when you have a new idea but don't know if it's worth your time or effort to build.
- Use when evaluating potential features for a product to decide on priorities.
- Use when you want to rigorously stress-test an assumption before committing code.

**When not to use:** Do not use it when you need real market data. Run a short survey, talk to likely buyers or try a small sales test instead. You do not need any other files. Play both sides yourself, using the two briefs in Step 1.

## What to paste first

The idea in a few sentences. Add who it is for and any limits on time or budget. If the idea is missing, ask for it. Never invent facts about the user's market or customers.

## How It Works

When triggered with an idea, you (the AI) will act as the Orchestrator and facilitate the following workflow:

### Step 1: Initialize the Debate
You will assume the role of the Orchestrator. Introduce the debate and clearly state the idea being evaluated. Play the two participants yourself, using these briefs:
- **Pro (the logical supporter):** Argues the strongest honest case for the idea: who it helps, what problem it solves, why it could work and how it could earn money. Bases optimism on logic and stated assumptions, not enthusiasm. When it answers the critic, it offers a fix for each risk. It never just agrees.
- **Con (the constructive critic):** Names the biggest risks and flaws: market fit, cost, how hard it is to build, and what could go wrong. Bases doubts on logic, not mood. Says what would change its mind. It never just disagrees.

### Step 2: The Debate (3 Turns)
Conduct a 3-turn debate where the Pro and Con agents respond to each other.
- **Turn 1 (Initial Pitches):** Pro presents the strongest case for the idea. Con presents the strongest immediate risks and flaws.
- **Turn 2 (Rebuttals):** Pro addresses Con's risks. Con challenges Pro's optimism.
- **Turn 3 (Closing Statements):** Both agents summarize their final stance on why the idea will succeed or fail.

*Note: Ensure the agents do not blindly agree/disagree but base their arguments on logic, market realities, and technical feasibility.*

### Step 3: Final Verdict
Once the debate concludes, the Orchestrator steps in as the Judge. Provide a comprehensive summary formatted with:
- **Pros:** The strongest validated points in favor.
- **Cons:** The most critical risks identified.
- **Final Verdict:** A definitive recommendation (e.g., "Strongly Recommended", "Proceed with Caution", "Pivot Required", "Not Worth Building").
- **Why:** A brief justification summarizing the debate outcome.

## Examples

### Example 1: Evaluating a new app idea

**User:** "Evaluate this idea: A social network exclusively for houseplants where users post updates on their plant's growth."

**Agent:** (Proceeds to run the 3-turn debate between Pro and Con, followed by the Orchestrator's final verdict detailing the niche appeal versus retention challenges).

## Best Practices

- ✅ Ensure the Pro and Con agents directly address each other's points during rebuttals.
- ✅ The Orchestrator must remain strictly neutral until the Final Verdict.
- ❌ Don't let the agents devolve into generic AI pleasantries; keep the debate sharp and analytical.
- ❌ Don't skip the debate steps; the back-and-forth is crucial for deep validation.

## Limitations

- The verdict is based on simulated reasoning and logic, not actual market data or user feedback.
- This skill is for brainstorming and validation, not a guarantee of business success.

## Next steps

Turn each risk the Con side named into a small test, such as asking five likely buyers or running a small sales test. Write the verdict and the date down before you build, and check it again after the tests.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Plan and claim debate reviewer](https://useaiblocks.com/skills/idea-trial-jury).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Related Skills

Note from AI Blocks: the `source: self` lines in the header above are the author's own labels. The catalogue source and licence are listed in `item.yaml`.

- `@idea-evaluator-pro` - The supporting persona used in this debate.
- `@idea-evaluator-con` - The critical persona used in this debate.
