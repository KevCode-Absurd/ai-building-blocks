---
name: prioritize-growth-backlog
description: "A ranked do-next list from every growth idea the team and its agents have: each idea logged with its evidence, sorted into three lanes (fix what is broken, settle a big unknown cheaply, grow), and the growth ideas scored on expected profit per month (chance it works x size of the effect x gross profit per order x traffic it touches), confidence from counted evidence, money cost, effort hours and cash. Overlapping ideas are merged, the person who proposed an idea does not score it, and work in progress is capped per owner. Ends with the top five to start now, what waits, and what is dropped. Use when ideas pile up from audits, agents and the founder, or before planning a quarter."
---

# Prioritise the growth backlog

**You get:** a backlog sheet with every idea logged, laned and scored, and a one-screen do-next list: the top five to start now with owner and start date, the next ten waiting, and the ideas dropped with a one-line reason.

## When to use

- Audits, agents and the founder have produced more ideas than the team can do.
- Every idea is "high priority" and nothing gets finished.
- A 90-day plan needs its three bets chosen.
- The team keeps starting new work before old work is read.

## Not for

- Writing the 90-day plan around the chosen bets: use `store-90-day-growth-plan`.
- Ranking only store split-test ideas with sample sizes: use `design-store-ab-test`.
- Turning audit findings into a funding deck: use `audit-to-action-deck`.
- Checking which past recommendations worked: use `recommendation-scorekeeping` (this skill reads its hit rates).

## What you need

Required (read access):

1. **Every idea in one place**: audit findings, agent recommendations, founder notes, support and review themes. For each, who proposed it and where it came from.
2. **Gross profit per order** (and per product, where an idea touches one product) from `build-sku-profit-sheet`.
3. **Traffic and orders** by page and channel for the last 30 to 90 days (Shopify Analytics or GA4, ad managers).
4. **Team capacity**: owners (people and agents) and their hours per week.
5. **Cash available** for the next 90 days.

Optional: past hit rates by idea type from `recommendation-scorekeeping`, test results, heatmaps, surveys.

If gross profit per order is missing, the top item is building it and no growth idea is scored. This skill needs read access only; starting any item that spends money, changes the store or messages customers needs the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Fail: build it first; lane 1 items can still be ranked.
2. **One log.** Every idea is in the same sheet with a source. Ideas only in someone's head are not ranked.
3. **Scorer is not the proposer.** The person or agent who proposed an idea does not score it; self-scored frameworks rate everything high and drop nothing [CRO-0013]. Fail: assign another scorer.

## Steps

### 1. Clean the log

- Merge duplicates and ideas that change the same result (an ad, page and offer for one product become one initiative with one baseline).
- Rewrite each idea as "change X on Y so that Z", with the page, product or channel named.
- Drop ideas with no evidence at all into a "parking" tab; they come back only with evidence.

### 2. Sort into three lanes

- **Lane 1, fix what is broken:** checkout or payment failures, wrong prices or stock, promises the store does not keep, broken tracking, policy or legal risk. These go first, ranked by how many buyers they hit and how badly. No profit guess is needed. Broken data comes first of all, because every later score depends on it [ADC-0028].
- **Lane 2, settle a big unknown cheaply:** a small test or research step whose answer changes a big decision (does this product sell at all, is price or proof the barrier).
- **Lane 3, grow:** improvements to a journey that already works. Scored in step 3.

### 3. Score lane 3 ideas

For each idea:

- **Size of effect if it works:** a percentage change on one number (conversion, order value, repeat rate, cost per new customer), taken from the evidence, not hope.
- **Chance it works:** start from base rates. Only about 10 to 20% of well-run tests produce a clear winner [CRO-0012]; a 30 to 35% win rate is very good [CRO-0020]. Raise the chance only with evidence: one point for each independent piece (store data, buyer words from surveys or reviews, a result elsewhere in this store, a public card that fits its conditions). An idea with fewer than two pieces stays at the base rate and cannot enter the top five [CRO-0013]. If `recommendation-scorekeeping` shows a hit rate for this idea type, use it.
- **Expected profit per month** = chance x effect x gross profit per order x monthly orders or sessions it touches [CRO-0013]. Weight by gross profit, not revenue: an idea that shifts sales to low-margin products can raise revenue and cut profit.
- **Money cost** (one-off and monthly), **effort hours**, **cash needed** and **time to a readable result**.

### 4. Rank

- Lane 1 first, by reach and severity.
- Then one or two lane 2 items whose answer unlocks big lane 3 ideas.
- Then lane 3 by expected profit per month minus monthly cost, divided by effort hours. Break ties by faster time to result, then by how easy the change is to undo.
- Check cash: if the top items together need more cash than is free, drop the lowest until they fit.

### 5. Cap work in progress

Each owner gets at most two items in progress at once (practitioner default, test it). The top five are the items that fit owners' capacity, not the top five scores regardless of who must do them. A store with little traffic may run one test and ship the rest as watched changes [CRO-0011].

### 6. Write the do-next list

For each of the top five: the change, lane, owner (agent and approver), start date, what "done" means, the signal to read and when, and expected profit range. List the next ten in order. List dropped ideas with a one-line reason.

### 7. Set the rhythm

Re-rank every two weeks; collect new ideas through one form or one tab in between [OPS-0021]. When an item finishes, record the result in `recommendation-scorekeeping` so next round's chances use real hit rates.

### 8. India and US notes

- **India:** include RTO losses in gross profit per order, so ideas that cut RTO (prepaid nudges, address checks, COD confirmation on WhatsApp) are valued at their real worth. Ideas needing new language versions count translation and review hours in effort.
- **US:** ideas touching claims, reviews or pricing carry a compliance check in their effort hours.

## Checks before you hand it over

- Every idea has a source and a "change X on Y so that Z" line.
- Duplicates and overlapping ideas are merged.
- Lane 1 items sit at the top regardless of score.
- Every lane 3 score shows chance, effect, gross profit per order and reach, with evidence counted.
- No idea with fewer than two pieces of evidence is in the top five.
- No scorer scored their own idea.
- The top five fit owners' hours and the cash available.
- Each top item has an owner, start date, done definition and read date.

## Output

**One-screen do-next list:** top five (change, owner, start, expected profit range, read date), next ten in order, dropped ideas with reasons, and the date of the next re-rank.

**Backlog sheet** (`growth-backlog.csv` or Google Sheet):

| ID | Idea (change X on Y so that Z) | Source | Proposed by | Scored by | Lane | Number it moves | Effect if it works | Evidence (count and list) | Chance | Gross profit per order | Reach per month | Expected profit per month | One-off cost | Monthly cost | Effort hours | Cash needed | Time to result | Score | Rank | Owner | Status | Start | Read date | Result |

**To confirm:** owners' hours, cash available, any lane 1 item the client wants to accept as a known risk.

## Common mistakes

- **Everyone scores their own idea.** The gates assign a different scorer.
- **Guessing the chance high.** Step 3 starts from base rates and counts evidence.
- **Revenue instead of profit.** Step 3 weights by gross profit per order.
- **Ranking growth above broken checkout.** Step 2 puts lane 1 first.
- **Five top items for one person.** Step 5 caps work in progress.
- **Never re-ranking.** Step 7 sets a two-week rhythm and feeds results back.

## Sources

- CRO-0013: rank by expected gross profit; two pieces of evidence; self-scoring fails.
- CRO-0012, CRO-0020: base rates for winning tests.
- CRO-0011: order-volume gates for testing.
- OPS-0021: collect requests by form and prioritise every other week.
- ADC-0028: fix data first, structure second, creative third.

What makes this skill ours: broken things and cheap answers to big unknowns are ranked before growth ideas; every growth score starts from honest base rates and only rises with counted evidence; the person who proposes an idea never scores it; and the top five must fit real owners' hours and the cash on hand.
