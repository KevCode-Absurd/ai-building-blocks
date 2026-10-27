---
name: earnings-preview
description: Build pre-earnings analysis with estimate models, scenario frameworks, and key metrics to watch. Use before a company reports quarterly earnings to prepare positioning notes, set up bull/bear scenarios, and identify what will move the stock. Triggers on "earnings preview", "what to watch for [company] earnings", "pre-earnings", "earnings setup", or "preview Q[X] for [company]".
---

# Earnings Preview

## When not to use

- The company has already reported: use Earnings recap writer instead.
- The user wants a buy or sell view: this is research support only, so point them to a licensed adviser or broker note.
- The user wants a data-built report with charts and a source appendix: use Earnings preview writer for a US ticker, or Earnings preview report builder for India for an Indian company.

## Before you start

You need:

1. **The company and the reporting quarter.** Ask once if either is missing.
2. **Consensus numbers.** Revenue, EPS and any segment figures. Use the ones the user gives you. If they gave none, find them by web search. If you cannot search, ask the user to paste them and stop. Do not write consensus from memory.
3. **The user's view or position** (optional). Use it to rank what to watch.

**Rules for every consensus figure:**

- Name its source and the date you saw it. A figure with no source and date goes in the table as `unverified`.
- If two sources disagree, show both and say which you used.
- If search returns nothing usable, write `n/a, no source found`. Do not fill the cell.

**Tools.** This works in a plain chat if the user pastes the numbers. Web search makes it faster. Options data for the implied move needs an options feed, which is usually a paid or API source. If you do not have one, write `n/a, no options data` in that line.

**Not investment advice.** This is research support. The scenario table shows ways results could land and how a share price might react. It is not a forecast, a recommendation or a trade call. Say so at the end. For a decision, the company's own results release or a licensed broker note is the better source.

**Scope.** Listed companies only. For a private or unlisted company there is no consensus. Say so and stop.

## If the company is Indian

The companion files this skill once pointed to (`india-market-conventions`, `india-market-data`, `NOT-ADAPTABLE.md`) are not in this folder. These two rules are the part that matters. Use them for an Indian company, and ignore them otherwise.

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` = Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year. Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format `#,##0,," Cr"`: each trailing comma divides by 1,000, so it shows lakh under a crore label (a 100× error). Divide by `10000000` in a live formula and label the column `Total Revenue (₹ Cr)`.

If something has no Indian equivalent, say so. Never put in a stand-in and present it as the real thing.

## Workflow

### Step 1: Gather Context

- Identify the company and reporting quarter
- Pull consensus estimates via web search or from the user (revenue, EPS, key segment metrics), each with source and date
- Find the earnings date and time (pre-market vs. after-hours). If you cannot confirm it, say `date not confirmed`.
- Review the company's prior quarter earnings call for any guidance or commentary. If you have no transcript or summary, say so and skip this line.

### Step 2: Key Metrics Framework

Build a "what to watch" framework specific to the company:

**Financial Metrics:**
- Revenue vs. consensus (total and by segment)
- EPS vs. consensus
- Margins (gross, operating, net) — expanding or contracting?
- Free cash flow
- Forward guidance vs. consensus

**Operational Metrics** (sector-specific):
- Tech/SaaS: ARR, net retention, RPO, customer count
- Retail: Same-store sales, traffic, basket size
- Industrials: Backlog, book-to-bill, price vs. volume
- Financials: NIM, credit quality, loan growth, fee income
- Healthcare: Scripts, patient volumes, pipeline updates

### Step 3: Scenario Analysis

Build 3 scenarios with stock price implications. Fill the table from the consensus you sourced, and show how each case differs from it. Label any number you made up as an assumption, not a fact.

| Scenario | Revenue | EPS | Key Driver | Stock Reaction |
|----------|---------|-----|------------|----------------|
| Bull | <vs consensus> | <vs consensus> | <driver> | <direction, labelled as a possible reaction> |
| Base | | | | |
| Bear | | | | |

For each scenario:
- What would need to happen operationally
- What management commentary would signal this
- Historical context — how has the stock moved on similar prints? Only if you found it. Otherwise write `not checked`.

### Step 4: Catalyst Checklist

Identify the 3-5 things that will determine the stock's reaction:

1. [Metric] vs. [consensus/whisper number] — why it matters
2. [Guidance item] — what the buy-side expects to hear
3. [Narrative shift] — any strategic changes, M&A, restructuring

### Step 5: Output

One-page earnings preview with:
- Company, quarter, earnings date
- Consensus estimates table, with source and date on each row
- Key metrics to watch (ranked by importance)
- Bull/base/bear scenario table
- Catalyst checklist
- Trading setup: recent stock performance, implied move from options (if you have an options source)
- Gaps: every `unverified` or `n/a` figure and what the user should check
- The line "Research support, not investment advice."

Next step to state at the end: after the company reports, compare the real results with the base, bull and bear cases.

## Important Notes

- Consensus estimates change — always note the source and date of estimates
- "Whisper numbers" from buy-side surveys are often more relevant than published consensus. They are rarely public, so only use one if the user gives it
- Historical earnings reactions help calibrate expectations (search for "[company] earnings reaction history")
- Options-implied move tells you what the market expects — compare to your scenarios

- **Runbook:** [`references/runbook-earnings-preview.md`](references/runbook-earnings-preview.md) — the end-to-end walkthrough (which skills to load in what order, and the output contract).
