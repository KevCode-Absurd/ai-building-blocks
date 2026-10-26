---
name: prioritization-frameworks
description: "Reference guide to 9 prioritization frameworks with formulas, when-to-use guidance, and templates — RICE, ICE, Kano, MoSCoW, Opportunity Score, and more. Use when selecting a prioritization method, comparing frameworks like RICE vs ICE, or learning how different prioritization approaches work."
---

## Prioritization Frameworks Reference

A reference guide to help you select and apply the right prioritization framework for your context, and to produce a scoring table for the person's own list.

### When to Use

- A backlog is long and people rank it differently.
- The team needs a fair, repeatable way to say yes or no to requests.
- The person has customer survey data on importance and satisfaction.
- The person is unsure which method (RICE, ICE, Opportunity Score and others) fits.

### When Not to Use

- The person needs to pick between a few big strategic bets with little customer data: use the Weighted Decision Matrix from the table below, or the Strategy trade-off planner.
- The person already has a feature list and capacity and wants RICE scored with a requirements template: use the Feature priority scorer.
- The person wants to turn a feature roadmap into outcomes: use the Feature roadmap to outcomes rewriter.
- The task is a personal to-do list: use the Eisenhower Matrix and skip the rest.

### Inputs

Ask once for anything missing. If the person cannot answer, mark it MISSING in the output and carry on. Never invent scores, survey results or customer counts.

1. The list of items to rank, as problems or ideas (3 to 60 items; if more, ask for the top 20 to start).
2. Team size and how decisions get made (one owner, a group, stakeholders to convince).
3. What data exists: survey results, usage counts, reach estimates, or only opinions.
4. How much time the team has to score.

### Output

Return these sections, in this order. Keep the whole answer under about 800 words, plus the table.

1. **Recommended method**: the name, two or three sentences on why it fits this data and team, and one runner-up with the reason it ranks second.
2. **How to score**: the formula, the scale for each input (what 1 and 10 mean, or 0 to 1), and who should fill in each column.
3. **Scoring table**: one row per item, one column for each formula input, and a score column. Fill a cell only with a number the person gave. Write MISSING in every other cell. Never fill cells with guesses.
4. **How to read the ranking**: sort high to low, how to treat close scores, and one sanity check (does the top item match what the team would pick by gut? If not, find out which input is off).
5. **Next step**: what to do with the top 3 items.
6. **Missing**: every input marked MISSING and how it limits the ranking.

### Core Principle

Never allow customers to design solutions. Prioritize **problems (opportunities)**, not features.

### Choosing a method

| If the person has | Use |
|---|---|
| Survey data on importance and satisfaction for customer needs | Opportunity Score |
| Only opinions, a long list, and little time | ICE |
| Reach estimates for each item, a larger team, and time to score | RICE |
| A list of tasks that needs quick sorting | Impact vs Effort |
| Uncertain bets where risk matters | Risk vs Reward |
| Several stakeholders who must agree on criteria | Weighted Decision Matrix |
| A project with fixed requirements | MoSCoW |
| Personal tasks | Eisenhower Matrix |
| A need to understand customer expectations, not rank | Kano Model |

### Opportunity Score (Dan Olsen, *The Lean Product Playbook*)

The recommended framework for prioritizing customer problems.

Survey customers on **Importance** and **Satisfaction** for each need (normalize to 0-1 scale).

Three related formulas:
- **Current value** = Importance x Satisfaction
- **Opportunity Score** = Importance x (1 - Satisfaction)
- **Customer value created** = Importance x (S2 - S1), where S1 = satisfaction before, S2 = satisfaction after

High Importance + low Satisfaction = highest Opportunity Score = best opportunities. Plot on an Importance vs Satisfaction chart; upper-left quadrant is the sweet spot. Prioritizes customer problems, not solutions.

Check of the formula (these numbers only show the arithmetic, they are not data): Importance 0.9 and Satisfaction 0.2 give 0.9 x 0.8 = 0.72. Importance 0.9 and Satisfaction 0.8 give 0.9 x 0.2 = 0.18. The first need ranks far higher.

### ICE Framework

Useful for prioritizing initiatives and ideas. Considers not only value but also risk and economic factors.

- **I** (Impact) = How much it moves your goal for the customers it touches (1-10). Where survey data exists, use the Opportunity Score to inform this number.
- **C** (Confidence) = How confident are we? (1-10). Accounts for risk.
- **E** (Ease) = How easy is it to implement? (1-10). Accounts for economic factors.

**Score** = I x C x E. Higher = prioritize first.

Note: the original text defined Impact as Opportunity Score x number of customers. That counts reach inside Impact, so it double-counts when you later use RICE. Here Impact is one judgement, and reach is used only in RICE.

### RICE Framework

Splits ICE's Impact into two separate factors. Useful for larger teams that need more granularity.

- **R** (Reach) = Number of customers affected in a set period
- **I** (Impact) = Opportunity Score or a 1-10 judgement of value per customer
- **C** (Confidence) = How confident are we? (0-100%)
- **E** (Effort) = How much effort to implement? (person-months)

**Score** = (R x I x C) / E. Reach appears only here, never inside Impact.

### 9 Frameworks Overview

| Framework | Best For | Key Insight |
|-----------|----------|-------------|
| Eisenhower Matrix | Personal tasks | Urgent vs Important, for individual PM task management |
| Impact vs Effort | Tasks/initiatives | Simple 2x2, quick triage, not rigorous for strategic decisions |
| Risk vs Reward | Initiatives | Like Impact vs Effort but accounts for uncertainty |
| **Opportunity Score** | Customer problems | **Recommended.** Importance x (1 - Satisfaction). Normalize to 0-1. |
| Kano Model | Understanding expectations | Must-be, Performance, Attractive, Indifferent, Reverse. For understanding, not prioritizing. |
| Weighted Decision Matrix | Multi-factor decisions | Assign weights to criteria, score each option. Useful for stakeholder buy-in. |
| **ICE** | Ideas/initiatives | Impact x Confidence x Ease. Recommended for quick prioritization. |
| **RICE** | Ideas at scale | (Reach x Impact x Confidence) / Effort. Adds Reach to ICE. |
| MoSCoW | Requirements | Must/Should/Could/Won't. Caution: project management origin. |

### Templates

These are the original author's links. Open them to copy a blank template. We have not checked that they are still live.

- [Opportunity Score intro (PDF)](https://drive.google.com/file/d/1ENbYPmk1i1AKO7UnfyTuULL5GucTVufW/view)
- [Importance vs Satisfaction Template, Dan Olsen (Google Slides)](https://docs.google.com/presentation/d/1jg-LuF_3QHsf6f1nE1f98i4C0aulnRNMOO1jftgti8M/edit#slide=id.g796641d975_0_3)
- [ICE Template (Google Sheets)](https://docs.google.com/spreadsheets/d/1LUfnsPolhZgm7X2oij-7EUe0CJT-Dwr-/edit?usp=share_link&ouid=111307342557889008106&rtpof=true&sd=true)
- [RICE Template (Google Sheets)](https://docs.google.com/spreadsheets/d/1S-6QpyOz5MCrV7B67LUWdZkAzn38Eahv/edit?usp=sharing&ouid=111307342557889008106&rtpof=true&sd=true)

---

### Further Reading

- [The Product Management Frameworks Compendium + Templates](https://www.productcompass.pm/p/the-product-frameworks-compendium)
- [Kano Model: How to Delight Your Customers Without Becoming a Feature Factory](https://www.productcompass.pm/p/kano-model-how-to-delight-your-customers)
- [Continuous Product Discovery Masterclass (CPDM)](https://www.productcompass.pm/p/cpdm) (video course)
