# Watch a live page, decide, and learn

A page that just went live is read at day 7 for health and at day 28 for results and real-visitor speed, against a rule written before any result was seen, and you choose what happens next with the numbers in front of you. The lesson is written down for the next page.

**Starts from:** A page made live by the landing page process. It keeps the same folder, so the intake, copy, preview pack and go-live record travel with it.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Day 0: baseline and decision rule | Callum (callum-reporting) | results/metrics.md, results/baseline.md, results/rule.md | metric-review | no | draft |
| 2 | Day 7: is it healthy? | Callum (callum-reporting) | results/day-7.md, results/numbers.json | day7-numbers | no | read |
| 3 | Day 28: real-visitor speed | Arjun (arjun-page-speed) | results/speed-28.md | speed-review | no | read |
| 4 | Day 28 readout | Gretchen (gretchen-store-testing) | results/readout.md | numbers-check, readout-review | no | read |
| 5 | You choose what happens next | Gretchen (gretchen-store-testing) | results/decision.md | decision-review | yes | draft |
| 6 | Write down what we learned | Callum (callum-reporting) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Day 0: baseline and decision rule

On the day the page goes live, and before any result exists, writes exactly how each number will be counted (source, formula, date range, filters) and records the baseline: the page or pages this traffic used before, for the last 4 whole weeks. Then writes the decision rule for day 28 with you in mind: what counts as better, the same, or worse, and which guardrails (refunds, checkout errors, speed) would override a good result. The rule is not changed later.

- **Needs:** intake.md; go-live-record.md; context/goals.json; GA4 through the Analytics MCP: sessions, engagement rate, add_to_cart and purchase events by landing page; ShopifyQL through the Shopify connector or CLI (read_reports): orders and sessions for the same dates
- **Makes:** results/metrics.md, results/baseline.md, results/rule.md
- **Checks:** metric-review (each metric has one source and one formula, the baseline uses whole weeks, and the rule was written before any post-launch number was read)
- **Done when:** metrics.md defines every number with its source and formula, baseline.md gives each one with dates and counts, and rule.md states the better, same and worse lines and the guardrails before any new data was read.

### 2. Day 7: is it healthy?

Seven days after go-live, checks the page is getting the traffic planned, from the sources planned, and that page views, add-to-cart and purchase events are recorded. Compares GA4 purchases with Shopify orders for the page, so a tracking fault is found early. It does not judge results yet; one week is too little. GA4 daily data can take 24 to 48 hours to settle, so the last two days are marked as not final.

- **Needs:** results/metrics.md; GA4 through the Analytics MCP; ShopifyQL through the Shopify connector or CLI
- **Makes:** results/day-7.md, results/numbers.json
- **Checks:** day7-numbers (every count, rate and gap in day-7.md recomputes from its inputs in numbers.json)
- **Done when:** day-7.md gives sessions by source, events recorded, the gap between GA4 purchases and Shopify orders, and any fault found with who fixes it.

### 3. Day 28: real-visitor speed

Reads Chrome's real-visitor data (CrUX) for the page address on phones and desktops. If the page has too few visits for page-level data, it reads the whole store's data and says so. Also runs Lighthouse 3 to 5 times on the live page and takes the middle result. Field data covers the last 28 days and runs about 2 days behind, so it names the exact window.

- **Needs:** speed.md from the landing page job; CrUX API key in the host's secret store; PageSpeed Insights API or local Lighthouse
- **Makes:** results/speed-28.md
- **Checks:** speed-review (field and lab numbers are labelled apart, the CrUX window and level (page or store) are stated, and thresholds are read at the 75th percentile)
- **Done when:** speed-28.md gives p75 LCP, INP and CLS by device with the collection window, says whether the data is page-level or store-level, and compares lab results with the pre-launch test.

### 4. Day 28 readout

Reads the four weeks against the rule written on day 0: conversion rate, add-to-cart rate, bounce rate and revenue per session, each with its counts and a 95% interval, and the guardrails. It says plainly that a before and after comparison is not a controlled test: a sale, a new ad or the season can move the numbers, and it lists anything like that from the dates. Then gives the call the rule points to.

- **Needs:** results/rule.md; results/baseline.md; results/day-7.md; results/speed-28.md; GA4 through the Analytics MCP and ShopifyQL for the 28 days
- **Makes:** results/readout.md
- **Checks:** numbers-check (every rate and total recomputes from its counts, and no column mixes two date ranges); readout-review (each number matches GA4 and Shopify for the stated dates, the gap between them is explained, and the call follows the rule written on day 0)
- **Done when:** readout.md quotes each number with counts, dates and interval, names the rule line it meets, lists outside events in the window, and gives one call.

### 5. You choose what happens next

Sets out the real options with what each costs in time and what it could change: keep the page as it is, test one change on its weakest part (a site A/B test job), fix speed (a speed fix job), rewrite the page (a new landing page job), or hide it. It recommends one, with the number that drives the choice. Nothing changes on the store at this stage.

- **Needs:** results/readout.md
- **Makes:** results/decision.md
- **Checks:** decision-review (the options are real and different, each has its effort and likely effect, and the recommendation follows from the readout)
- **Done when:** decision.md lists each option with its effort and expected effect, the recommendation with its deciding number, and the job to start for the chosen option.
- **You sign off:** You read the options and the recommendation. Reply yes with the code to accept the recommended option, or name the option you want. A new job starts only for the option you choose.

### 6. Write down what we learned

Adds a dated lesson to context/learnings.md: what the page tried (promise, opening, layout, offer), what happened against the baseline, how sure we are given the session count and outside events, and what to try next. A lesson from a small sample is marked as a hunch, not a rule. The next landing page intake must read it.

- **Needs:** results/readout.md; results/decision.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the sample, and a page writer can use it in the next brief)
- **Done when:** learning.md holds one lesson with its evidence (sessions, dates, metric change) and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **You choose what happens next:** You read the options and the recommendation. Reply yes with the code to accept the recommended option, or name the option you want. A new job starts only for the option you choose.

## How we judge it

- Main number from context/goals.json, judged only at day 28 and only with the session count stated.
- Conversion rate, add-to-cart rate, bounce rate and revenue per session for sessions that land on the page, against the baseline written on day 0.
- Real-visitor speed at the 75th percentile on phones: LCP 2.5 seconds or less, INP 200 milliseconds or less, CLS 0.1 or less.
