---
name: lead-scoring
description: Score and prioritize leads based on firmographic fit and behavioral engagement signals, producing ranked tiers for sales team focus. Use when the user requests lead scoring or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Lead Scoring

Score and prioritize inbound and outbound leads by combining firmographic fit (how closely a lead matches your ideal customer profile) with behavioral engagement signals (actions that indicate purchase intent). This skill builds scoring rubrics, assigns weighted points, calculates composite scores, and segments leads into actionable tiers — Hot, Warm, and Cold — so sales teams focus time on the highest-converting opportunities.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your lead list** (yours): your leads or open deals, exported from your CRM or a sheet.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Your lead list** with the [Prospect account researcher](https://useaiblocks.com/skills/prospect-list-builder). It uses your brand file.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your lead list. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Define ICP Criteria** — Establish the firmographic attributes of your ideal customer: target industries, company size ranges, revenue bands, geographic regions, and technology stack indicators. Each attribute gets a weight reflecting its predictive importance based on historical conversion data.

2. **Assign Fit Scores** — Score each lead's company against ICP criteria. A perfect-fit lead earns maximum fit points; partial matches earn proportional scores. Negative scoring applies for explicit disqualifiers (e.g., company size below minimum threshold, industries you don't serve, students or competitors).

3. **Track Engagement Signals** — Capture behavioral signals from marketing automation, CRM, and product analytics: email opens/clicks, website page visits (especially pricing and case study pages), content downloads, webinar attendance, demo requests, free trial signups, and reply sentiment. Weight each signal by its correlation to closed-won deals.

4. **Calculate Composite Score** — Combine fit score (typically 0–50 points) and engagement score (typically 0–50 points) into a composite score (0–100). Apply decay to engagement signals older than 30 days to ensure the score reflects current intent, not stale activity.

5. **Rank and Segment into Tiers** — Sort leads by composite score and assign tiers: Hot (75–100), Warm (40–74), Cold (0–39). Route Hot leads to SDRs for immediate outreach, Warm leads to nurture sequences, and Cold leads to low-touch automated campaigns. Review tier thresholds quarterly against actual conversion rates and adjust.

## Usage

Provide your ICP definition, the engagement signals you track, and a list of leads with their attributes. The skill outputs a scoring rubric and scored/ranked lead list.

**Example prompt:**
> Build a lead scoring model for [YOUR PRODUCT]. ICP: [YOUR TARGET COMPANIES, SIZE, REGION AND TECH]. Score these [NUMBER] leads and assign Hot/Warm/Cold tiers.

## Examples

### Example 1: Building a Lead Scoring Rubric

**Input:** B2B analytics platform targeting mid-market SaaS companies.

**Fit Scoring Rubric (0–50 points):**

| Criterion | Weight | Scoring Rules |
|---|---|---|
| Company size | 15 pts | 200–500 emp: 15 · 50–199 emp: 10 · 501–1000 emp: 5 · <50 or >1000: 0 |
| Industry | 10 pts | SaaS/Software: 10 · Fintech/E-commerce: 7 · Other tech: 4 · Non-tech: 0 |
| Funding stage | 10 pts | Series A–C: 10 · Seed: 5 · Public/Pre-seed: 2 |
| Geography | 5 pts | US/Canada: 5 · UK/EU: 3 · Other: 1 |
| Tech stack | 10 pts | Snowflake or BigQuery: 10 · Redshift: 6 · No cloud DW: 0 |

**Engagement Scoring Rubric (0–50 points):**

| Signal | Points | Decay |
|---|---|---|
| Demo requested | 20 pts | None (one-time event) |
| Pricing page visit | 8 pts | Halved after 14 days |
| Case study download | 6 pts | Halved after 21 days |
| Email link clicked | 3 pts (per click, max 12) | Halved after 14 days |
| Webinar attended | 7 pts | Halved after 30 days |
| Blog visit | 1 pt (per visit, max 5) | Expires after 30 days |

The signal maximums above add up to 58, but the engagement score is capped at 50. Add up the signals after decay, then cut the total at 50. Show the raw total and the capped total so the reader can see when the cap applied.

**Tier Thresholds:**

| Tier | Score Range | Action |
|---|---|---|
| Hot | 75–100 | Immediate SDR outreach within 4 hours |
| Warm | 40–74 | Enroll in high-touch nurture sequence |
| Cold | 0–39 | Low-touch automated drip campaign |

---

### Example 2: Scoring a Batch of Leads

**Input:** [NUMBER] leads with attributes and recent activity.

All names and numbers below are placeholders that show the layout. Work out every score from the Example 1 rubric, and show the points for each row so the reader can check the sum. An industry or tech stack the rubric does not list gets the lowest non-zero row for that criterion (for example "Other tech: 4"), and you say that you did it. Geography is never below 1 point.

**Scored Output:**

| Lead | Company | Employees | Industry | Funding | Geography | Tech Stack | Fit Score (max 50) | Key Engagement | Eng. Score (max 50) | **Total** | **Tier** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [LEAD 1] | [COMPANY 1] | [EMPLOYEES] | [INDUSTRY] | [FUNDING] | [REGION] | [TECH STACK] | [FIT POINTS] | [SIGNALS AFTER DECAY] | [ENGAGEMENT POINTS] | **[TOTAL]** | [Hot / Warm / Cold] |
| [LEAD 2] | [COMPANY 2] | [EMPLOYEES] | [INDUSTRY] | [FUNDING] | [REGION] | [TECH STACK] | [FIT POINTS] | [SIGNALS AFTER DECAY] | [ENGAGEMENT POINTS] | **[TOTAL]** | [Hot / Warm / Cold] |

**Summary:** [NUMBER] Hot leads (route to SDR), [NUMBER] Warm leads (nurture sequence), [NUMBER] Cold leads (automated drip). Call out any lead with a high fit score and low engagement, and say what would move them forward.

## Best Practices

- Weight your scoring model on historical closed-won data, not intuition — run a correlation analysis between lead attributes and conversion to calibrate point values.
- Apply score decay to engagement signals so that a lead who was active 6 months ago doesn't rank above a lead showing intent today.
- Include negative scoring for explicit disqualifiers (competitors, students, non-target geographies) to keep noise out of the Hot tier.
- Review and recalibrate tier thresholds quarterly; as your ICP evolves and marketing channels shift, static thresholds drift from reality.
- Separate fit and engagement scores in your reporting so reps can distinguish "great company, not engaged yet" from "engaged lead at a poor-fit company."
- Set a minimum fit score threshold (e.g., 15 points) below which no amount of engagement can push a lead to Hot — this prevents poor-fit leads from wasting SDR time.

## Edge Cases

- **High engagement, zero fit** — A lead who downloads every resource but works at a 5-person agency outside your ICP. Cap their maximum tier at Warm regardless of engagement score to avoid wasting sales cycles.
- **Perfect fit, no engagement** — A lead matching ICP criteria exactly but showing no behavioral signals. Flag for outbound prospecting rather than inbound follow-up; they may not know you exist yet.
- **Duplicate leads from the same company** — When multiple contacts at one company score independently, consolidate into an account-level score to avoid double-counting the same buying intent.
- **Engagement signal spam** — A lead who opens every email and visits every page may be a researcher, bot, or competitor. Set engagement score caps per signal type and flag anomalous activity patterns for manual review.
- **Scoring model cold-start** — For new products or markets without historical conversion data, start with a simple unweighted model, collect 90 days of pipeline data, then recalibrate weights based on actual outcomes.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Sales prospecting schedule planner](https://useaiblocks.com/skills/prospecting-block-planner). It takes the lead list.
- The [Sales lead priority ranker](https://useaiblocks.com/skills/who-to-call-first-ranker). It takes the lead list.
- The [Lead grader](https://useaiblocks.com/skills/lead-grader). It takes the lead list.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
