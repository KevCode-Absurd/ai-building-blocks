---
name: portfolio-monitoring
description: Track and analyze portfolio company performance against plan. Ingests monthly/quarterly financial packages (Excel, PDF), extracts KPIs, flags variances to budget, and produces summary dashboards. Use when reviewing portfolio company financials, preparing board materials, or monitoring covenant compliance. Triggers on "review portfolio company", "monthly financials", "how is [company] performing", "covenant check", or "portfolio update".
---

# Portfolio Monitoring

## India rules (read first)

This skill is set up for **Indian companies**. The helper files the original skill pointed to (`india-market-conventions`, `india-market-data`) and its `NOT-ADAPTABLE.md` list are **not included here**. Use the rules below instead. Two rules cause most Indian errors:

- **Fiscal year is April to March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` = Apr to Jun 2025. Label periods `Q3 FY26 (Oct-Dec 25)`, never a bare calendar year. Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10^5) and crore (10^7).** Never use the Excel format `#,##0,," Cr"`. Each trailing comma divides by 1,000, so two commas divide by 1,000,000 and the format shows **millions (ten lakh) under a crore label: a 10x error**. For example, Rs 1 crore (10,000,000) would display as "10 Cr". Divide by `10000000` in a live formula and label the column `Total Revenue (Rs Cr)`.

If a figure has no Indian source or no matching measure, say so. Never swap in a stand-in and present it as the real thing. If the pack is not Indian, say which convention you used instead.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Financial statements** (yours): the income statement, balance sheet and cash flow statement, for the periods you have.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for financial statements, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude:** It reads Excel and PDF packs well and keeps long tables in order.
- **ChatGPT:** Its file upload handles spreadsheets, and it can chart a trend.
<!-- /needs -->

## What you need

- The company's financial pack for the period: Excel, PDF or CSV.
- The budget or plan for the same period.
- Optional: the prior period's pack, the company's sector, and the covenant levels from the credit agreement.

If the budget is missing, ask once. If you still do not have it, mark every variance `MISSING: budget` and show actuals only. Never make up a budget, a covenant level or a sector KPI.

## Workflow

### Step 1: Ingest the financial pack

- Read the pack. List what you found: sheets or pages, reporting period, currency and unit (rupee, lakh, crore).
- Extract: Revenue, EBITDA, cash balance, debt outstanding, capex, working capital.
- Find the reporting period and set it against the prior period and the budget/plan.
- If a number is unclear or two pages disagree, flag it. Do not pick one quietly.

### Step 2: KPI extraction and variance analysis

Key metrics to track (adapt to the company's sector):

**Financial KPIs:**
- Revenue vs. budget (amount and %)
- EBITDA and EBITDA margin vs. budget
- Cash balance and net debt
- Leverage ratio (Net Debt / LTM EBITDA)
- Interest coverage ratio
- Capex vs. budget
- Free cash flow

**Operational KPIs** (ask the user, or infer from the data and say so):
- Customer count / revenue per customer
- Employee headcount / revenue per employee
- Backlog / pipeline
- Churn / retention rates

### Step 3: Flag and summarize

- **Green**: within 5% of plan
- **Yellow**: 5-15% below plan, flag for discussion
- **Red**: more than 15% below plan, or covenant breach risk, needs attention now

Output a concise summary:
1. One-paragraph executive summary ("Company X is tracking [ahead/behind/on] plan...")
2. KPI table with actual vs. budget vs. prior period
3. Red/yellow flags with context
4. Covenant compliance status (if covenant levels were given; otherwise `MISSING: covenant terms`)
5. Questions for management

### Step 4: Trend analysis

If more than one period is provided:
- Show key metrics over time (revenue, EBITDA, cash) as a table, and as a chart if your AI can draw one
- Say whether each is accelerating, slowing or flat
- Compare against the underwriting case if the user gave it

## Important notes

- Always ask for the budget/plan to compare against if not provided
- Don't assume sector-specific KPIs. Ask what matters for this company
- If covenant levels aren't known, ask the user for the credit agreement terms
- Output should be board-ready: concise, factual, no fluff
- Check every figure against the pack before you hand it back. List any you could not check as `CHECKS MISSED:` (or "none")

## Limits

This is a monitoring summary from the pack you were given. It does not audit the numbers, and it is not a legal reading of a credit agreement. A person should check red flags and covenant status against the source documents before they go to a board or a lender.

## After this

Suggest: send the questions for management to the company, then rerun next period with this month's pack as the prior period. For a deeper value view of one company, use the DCF model builder for India.

- **Runbook:** [`references/runbook-portfolio.md`](references/runbook-portfolio.md): the end-to-end walkthrough and output contract.

Changed by AI Blocks (2026-10-28): corrected the Excel crore-format warning (two trailing commas show millions, a 10x error, not lakh and 100x).
