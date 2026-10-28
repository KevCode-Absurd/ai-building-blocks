---
name: moatmri
description: Analyze AI disruption pressure across a business, map competitive exposure, and produce a 90-day defensive action plan.
risk: safe
source: community
date_added: "2026-05-31"
---

# MoatMRI: AI Disruption Pressure Analysis

*Where does intelligence pressure break this system first?*

Score how much pressure AI puts on a business, picture how an AI-native rival would take its customers, and set a 90-day defence plan. Based on the moatmri skill by IntuiTek (thebrierfox/moatmri-skill), shared in the sickn33 collection. The text of this skill is licensed CC BY 4.0 (see LICENSE-CONTENT). The original author's code is MIT.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini with web search:** Web search helps it check public facts when you name a company. Without it, it uses only your notes.
<!-- /needs -->

## When to use

- "Is my business at risk from AI? Where am I most exposed?"
- "How would an AI-native startup take over my market?"
- "What should I do in the next 90 days to defend against AI disruption?"
- "Where does my competitive moat actually hold?"
- A first look at a named company before deeper research.

## When not to use

- Investment, lending or partner decisions that need audited research. This is a planning tool, not financial advice. Use a qualified analyst.
- A cheaper rival has already appeared and you want to judge that rival. Use the Disruption risk checker.
- You want market research with sources and figures. This skill gives reasoned scores, not data.

## Inputs

Ask once for what is missing. If the user can't say, write `ASSUMED:` and the assumption next to it, and keep going.

1. **Industry** (required), for example "real estate", "community banking", "law firm".
2. **Entity type** (required), for example "independent broker", "solo practitioner", "regional franchise".
3. **Target name** (optional). A named organisation for a named analysis.
4. **What the user thinks protects them today** (optional), such as proprietary data, long customer relationships, licences or local presence.

Use only what the user provides, plus public facts you can check if your AI can browse the web. Without web access, say so, and base the analysis on the user's description. For a named company, never state a fact about it (revenue, products, customers, events) unless the user gave it or you can cite where you found it. Mark each such fact "Source: <where>" or "Unverified".

## Step 1: Score the 10 pressure vectors

Score each vector from 0 to 10, where **10 means the most pressure**. For the two moat vectors (6 and 7), a strong moat means low pressure, so a strong moat scores low. Score all ten before you add anything up. Don't stop at the obvious ones.

| # | Vector | What to measure |
|---|---|---|
| 1 | labor_substitution | Which roles or functions AI can do directly |
| 2 | customer_interface | How AI changes the way customers reach this entity |
| 3 | knowledge_commoditization | Whether AI turns the expertise this entity sells into a cheap commodity |
| 4 | pricing_pressure | Whether AI lets lower-cost rivals undercut |
| 5 | supply_chain_automation | Whether AI changes input costs or supplier relationships |
| 6 | data_moat | Whether this entity holds proprietary data that AI can't copy (strong data = low score) |
| 7 | trust_relationship_moat | How far customer loyalty protects against switching (strong loyalty = low score) |
| 8 | distribution_channel_disruption | Whether AI opens new channels that bypass this entity |
| 9 | regulatory_compliance_exposure | Whether AI changes the rules or liability this entity faces |
| 10 | decision_speed_gap | Whether AI speeds up decisions in ways that leave this entity behind |

For each vector give:
- **Score** (0 to 10)
- **Headline**, one plain sentence
- **Near term**, what happens in 12 months
- **Far term**, what happens in 3 years
- **Basis**, the fact or assumption behind the score. Say "ASSUMED" if it came from you, not the user.

Do not mix up data_moat and trust_relationship_moat. They protect in different ways.

**Overall score:** the average of the ten scores. Flag any vector at 7 or above as **critical**. Say plainly that the scores are informed judgments for planning, not measurements, and should be revisited as new evidence appears.

## Step 2: The AI front-door takeover storyboard

Write six short steps showing how an AI-native competitor takes this entity's customers. Keep it specific to the industry and entity, not a generic disruption story.

1. The entry point
2. The wedge (the first 10% of the market it wins)
3. The acceleration (what makes it compound)
4. The tipping point (when the incumbent can no longer recover)
5. The aftermath
6. The survivor profile (what the entities that survive have in common)

Label the storyboard as a scenario, not a forecast.

## Step 3: The 90-day counterstrike plan

- **Track A, days 0 to 30:** immediate defence. What to stop, what to protect.
- **Track B, days 31 to 60:** build the intelligence layer. Which data and relationships to strengthen.
- **Track C, days 61 to 90:** offensive positioning. Use AI pressure as a competitive tool.

Every action must be doable within 90 days by a business of this size. Tie each action to a critical vector from Step 1. Track C is concrete action, not a three-year strategy.

## Output format

```markdown
# AI disruption pressure: <entity or industry>

**Overall pressure score:** <average> / 10  |  **Critical vectors (7+):** <list or none>
**What this is based on:** <user's description / public sources / assumptions>

## Pressure map
| # | Vector | Score | Headline | Next 12 months | Next 3 years | Basis |
|---|---|---|---|---|---|---|

## Top weak spots
1. <vector>: <why it breaks first>
2. <vector>: <why>
3. <vector>: <why>

## Where your moat holds
- <vector>: <why protection is real, and how long it may last>

## How an AI-native rival would take your customers
1. Entry point: ...
(six steps)

## 90-day plan
**Days 0 to 30:** <actions>
**Days 31 to 60:** <actions>
**Days 61 to 90:** <actions>

## Limits of this analysis
- <assumptions, unverified facts, what to check next>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Backwards planning checker](https://useaiblocks.com/skills/work-backwards-plan-checker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Best practices

- Score all ten vectors before you work out the average.
- Keep the storyboard about this industry and entity.
- Make Track C actionable within 90 days.
- Keep the overall score honest. If a vector is a guess, say so.

## Additional resources

- Original repository: [thebrierfox/moatmri-skill](https://github.com/thebrierfox/moatmri-skill)
- The original author also lists a hosted "bring your own key" tool in that repository. This skill does not need it. We have not checked what it costs or what terms apply, so check before you use it.
- Built by [IntuiTek](https://intuitek.ai).
