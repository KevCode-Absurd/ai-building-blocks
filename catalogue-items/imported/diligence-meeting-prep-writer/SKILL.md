---
name: dd-meeting-prep
description: Prepare for due diligence meetings — management presentations, expert network calls, customer references, and advisor sessions. Generates targeted question lists, benchmarks to reference, and red flags to probe. Use before any diligence meeting or call. Triggers on "prep for management meeting", "diligence call prep", "expert call questions", "customer reference questions", or "meeting prep for [company]".
---

# Diligence Meeting Prep

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [India deal due diligence planner](https://useaiblocks.com/skills/due-diligence-checklist-builder). Bring your question.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

### Step 1: Meeting Context

Ask the user for:
- **Meeting type**: Management presentation, expert call, customer reference, advisor check-in, site visit
- **Attendees**: Who from the target company or third party
- **Topic focus**: Full business overview, or specific workstream (financial, commercial, operational, tech)
- **What you already know**: Prior meetings, CIM, data room findings
- **Key concerns**: Specific issues to probe

For expert and customer calls: do not ask for confidential or material non-public information, and follow the firm's and the expert network's rules.

### Step 2: Generate Question List

Organize questions by priority and topic. Structure depends on meeting type:

#### Management Presentation
**Business Overview (warm-up)**
- Walk us through the founding story and key milestones
- How do you describe the business to someone unfamiliar with the space?
- What are you most proud of? What would you do differently?

**Revenue & Growth**
- Walk us through revenue by customer/segment/geography
- What's driving growth? Price vs. volume vs. new customers
- What does the sales cycle look like? How has win rate trended?
- Where do you see the biggest growth opportunities in the next 3-5 years?

**Competitive Positioning**
- Who do you lose deals to and why?
- What's your moat? How defensible is it?
- How do customers evaluate you vs. alternatives?

**Operations & Team**
- Walk us through the org chart — who are the key people?
- What roles are you hiring for? What's been hardest to fill?
- What keeps you up at night operationally?

**Financial Deep-Dive**
- Walk us through the margin bridge — what's changed and why?
- Any one-time or non-recurring items we should understand?
- How do you think about capex — maintenance vs. growth?
- Working capital seasonality?

**Forward Look**
- Walk us through the budget/plan for next year
- What assumptions are you most/least confident in?
- What would need to go right/wrong to significantly beat/miss plan?

#### Expert Network Call
- How do you view [company]'s positioning in the market?
- What are the secular trends driving this space?
- Who are the strongest competitors and why?
- What risks should an investor be aware of?
- If you were buying this business, what would you diligence most carefully?

#### Customer Reference Call
- How did you find [company] and why did you choose them?
- What alternatives did you evaluate?
- What do they do well? Where could they improve?
- How likely are you to renew/expand? What would change that?
- If they raised prices 10-20%, how would you react?

### Step 3: Benchmarks & Context

For each key topic, provide relevant benchmarks. Every benchmark must carry a named source, or be labelled "unverified". Never state an industry figure as fact without one:
- Industry growth rates and margin profiles
- Comparable company metrics (only from a comps analysis the user supplied)
- Data points from the CIM or data room that warrant follow-up
- Discrepancies between different data sources to clarify

### Step 4: Red Flags to Probe

Based on what's known, flag specific areas to dig into:
- Inconsistencies in the CIM or financials
- Customer concentration or churn signals
- Management team gaps or recent departures
- Unusual accounting treatments
- Missing data room items

### Step 5: Output

One-page meeting prep doc:
1. **Meeting logistics**: Who, when, where, duration
2. **Objectives**: Top 3 things you need to learn from this meeting
3. **Question list**: Prioritized, grouped by topic (star the must-asks)
4. **Benchmarks**: Key numbers to reference
5. **Red flags**: Specific items to probe
6. **Follow-up items**: What to request after the meeting

After the meeting, write up your notes and send the follow-up request to the company.

## Important Notes

- Lead with open-ended questions — let management talk, then follow up on specifics
- Don't lead the witness — ask neutral questions, not "isn't it true that..."
- Take notes on body language and confidence levels, not just answers
- Always end with: "What haven't we asked about that we should?"
- Keep the question list to 15-20 max — you won't get through more in a 60-90 min session

- **Runbook:** [`references/runbook-dd-prep.md`](references/runbook-dd-prep.md) — the end-to-end walkthrough (which skills to load in what order, and the output contract).

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Financial statement and budget reviewer](https://useaiblocks.com/skills/financial-statement-analyst).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

Changed by AI Blocks (2026-10-28): refreshed the generated Before you start and After this guidance from catalogue metadata.
