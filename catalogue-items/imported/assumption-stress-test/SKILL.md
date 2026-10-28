---
name: "stress-test"
description: "/em:stress-test — Business assumption stress testing. Use before betting on a plan whose core assumptions are unvalidated — e.g. stress-testing 'enterprise buyers will tolerate a 6-month pilot' or a hockey-stick revenue model."
---

# /em:stress-test — Business Assumption Stress Testing

**Command:** `/em:stress-test <assumption>` in tools that support it. In a plain chat there is no command. Paste your assumption as one sentence and ask the AI to follow this skill.

Take any business assumption and break it before the market does. Revenue projections. Market size. Competitive moat. Hiring velocity. Customer retention.

If you have a plan, take the assumptions to test from it. If you have notes from an idea stress-test panel, start with the weak points they named.

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A plan** (yours): the goals, steps, constraints and dates for this work.

**Makes it better (optional):**
- **Your notes** (yours): what to keep, change or drop.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a plan, your notes. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Why Most Assumptions Are Wrong

Founders are optimists by nature. That's a feature — you need optimism to start something from nothing. But it becomes a liability when assumptions in business models get inflated by the same optimism that got you started.

**The most dangerous assumptions are the ones everyone agrees on.**

When the whole team believes the [MARKET SIZE] market is real, when every investor call goes well so you assume the round will close, when your model shows [ARR TARGET] ARR by December and nobody questions it — that's when you're most exposed.

Stress testing isn't pessimism. It's calibration.

---

## The Stress-Test Methodology

### Step 1: Isolate the Assumption

State it explicitly. Not "our market is large" but "the total addressable market for [PRODUCT TYPE] in [SEGMENT AND REGION] is [AMOUNT]."

The more specific the assumption, the more testable it is. Vague assumptions are unfalsifiable — and therefore useless.

**Common assumption types:**
- **Market size** — TAM, SAM, SOM; growth rate; customer segments
- **Customer behavior** — willingness to pay, churn, expansion, referrals
- **Revenue model** — conversion rates, deal size, sales cycle, CAC
- **Competitive position** — moat durability, competitor response speed, switching cost
- **Execution** — team velocity, hire timeline, product timeline, operational scaling
- **Macro** — regulatory environment, economic conditions, technology availability

### Step 2: Find the Counter-Evidence

For every assumption, actively search for evidence that it's wrong.

Ask:
- Who has tried this and failed?
- What data contradicts this assumption?
- What does the bear case look like?
- If a smart skeptic was looking at this, what would they point to?
- What's the base rate for assumptions like this?

**Sources of counter-evidence:**
- Comparable companies that failed in adjacent markets
- Customer churn data from similar businesses
- Historical accuracy of similar forecasts
- Industry reports with conflicting data
- What competitors who tried this found

The goal isn't to find a reason to stop — it's to surface what you don't know.

**Label every counter-evidence point.** Mark each one as "from your data", "from memory, verify before use" or "needs a source". Never give a figure, a company name or a study without one of these labels. Do not invent comparable failures, statistics or sources. If you cannot name a real one, say what kind of evidence to look for instead.

### Step 3: Model the Downside

Most plans model the base case and the upside. Stress testing means modeling the downside explicitly.

**For quantitative assumptions (revenue, growth, conversion):**

| Scenario | Assumption Value | Probability | Impact |
|----------|-----------------|-------------|--------|
| Base case | [Original value] | ? | |
| Bear case | -30% | ? | |
| Stress case | -50% | ? | |
| Catastrophic | -80% | ? | |

Key question at each level: **Does the business survive? Does the plan make sense?**

**For qualitative assumptions (moat, product-market fit, team capability):**

- What's the earliest signal this assumption is wrong?
- How long would it take you to notice?
- What happens between when it breaks and when you detect it?

### Step 4: Calculate Sensitivity

Some assumptions matter more than others. Sensitivity analysis answers: **if this one assumption changes, how much does the outcome change?**

Example: 
- If CAC doubles, how does that change runway?
- If churn goes from 5% to 10%, how does that change NRR in 24 months?
- If the deal cycle is 6 months instead of 3, how does that affect Q3 revenue?

High sensitivity = the assumption is a key lever. Wrong = big problem.

### Step 5: Propose the Hedge

For every high-risk assumption, there should be a hedge:

- **Validation hedge** — test it before betting on it (pilot, customer conversation, small experiment)
- **Contingency hedge** — if it's wrong, what's plan B?
- **Early warning hedge** — what's the leading indicator that would tell you it's breaking before it's too late to act?

---

## Stress Test Patterns by Assumption Type

### Revenue Projections

**Common failures:**
- Bottom-up model assumes 100% of pipeline converts
- Doesn't account for deal slippage, churn, seasonality
- New channel assumed to work before tested at scale

**Stress questions:**
- What's your actual historical win rate on pipeline?
- If your top 3 deals slip to next quarter, what happens to the number?
- What's the model look like if your new sales rep takes 4 months to ramp, not 2?
- If expansion revenue doesn't materialize, what's the growth rate?

**Test:** Build the revenue model from historical win rates, not hoped-for ones.

### Market Size

**Common failures:**
- TAM calculated top-down from industry reports without bottoms-up validation
- Conflating total market with serviceable market
- Assuming 100% of SAM is reachable

**Stress questions:**
- How many companies in your ICP actually exist and can you name them?
- What's your serviceable obtainable market in year 1-3?
- What percentage of your ICP is currently spending on any solution to this problem?
- What does "winning" look like and what market share does that require?

**Test:** Build a list of target accounts. Count them. Multiply by ACV. That's your SAM.

### Competitive Moat

**Common failures:**
- Moat is technology advantage that can be built in 6 months
- Network effects that haven't yet materialized
- Data advantage that requires scale you don't have

**Stress questions:**
- If a well-funded competitor copied your best feature in 90 days, what do customers do?
- What's your retention rate among customers who have tried alternatives?
- Is the moat real today or theoretical at scale?
- What would it cost a competitor to reach feature parity?

**Test:** Ask churned customers why they left and whether a competitor could have kept them.

### Hiring Plan

**Common failures:**
- Time-to-hire assumes standard recruiting cycle, not current market
- Ramp time not modeled (3-6 months before full productivity)
- Key hire dependency: plan only works if specific person is hired

**Stress questions:**
- What happens if the VP Sales hire takes 5 months, not 2?
- What does execution look like if you only hire 70% of planned headcount?
- Which single person, if they left tomorrow, would most damage the plan?
- Is the plan achievable with current team if hiring freezes?

**Test:** Model the plan with 0 net new hires. What still works?

### Competitive Response

**Common failures:**
- Assumes incumbents won't respond (they will if you're winning)
- Underestimates speed of response
- Doesn't model resource asymmetry

**Stress questions:**
- If the market leader copies your product in 6 months, how does pricing change?
- What's your response if a competitor raises [AMOUNT] to attack your space?
- Which of your customers have vendor relationships with your competitors?

---

## The Stress Test Output

```
ASSUMPTION: [Exact statement]
SOURCE: [Where this came from — model, investor pitch, team gut feel]

COUNTER-EVIDENCE
• [Specific evidence that challenges this assumption]
• [Comparable failure case]
• [Data point that contradicts the assumption]

DOWNSIDE MODEL
• Bear case (-30%): [Impact on plan]
• Stress case (-50%): [Impact on plan]
• Catastrophic (-80%): [Impact on plan — does the business survive?]

SENSITIVITY
This assumption has [HIGH / MEDIUM / LOW] sensitivity.
A 10% change → [X] change in outcome.

HEDGE
• Validation: [How to test this before betting on it]
• Contingency: [Plan B if it's wrong]
• Early warning: [Leading indicator to watch — and at what threshold to act]

NEXT STEPS
• [What to do with this result, for example: take the validation hedge into a pilot, or update the plan model before any investor meeting]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Decide what to do** with the [Ruin risk stress tester](https://useaiblocks.com/skills/ruin-risk-stress-tester).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
