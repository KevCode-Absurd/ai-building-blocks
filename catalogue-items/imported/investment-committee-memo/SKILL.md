---
name: ic-memo
description: Draft a structured investment committee memo for PE deal approval. Synthesizes due diligence findings, financial analysis, and deal terms into a professional IC-ready document. Use when preparing for investment committee, writing up a deal, or creating a formal recommendation. Triggers on "write IC memo", "investment committee memo", "deal write-up", "prepare IC materials", or "recommendation memo".
---

# Investment Committee Memo

## India

This skill operates on **Indian markets**. Load **`india-market-conventions`**
before building anything, and **`india-market-data`** for sources. Two rules cause
most Indian errors:

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` =
  Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
  Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format
  `#,##0,," Cr"` — each trailing comma divides by 1,000, so that format shows
  **millions under a crore label: the number shown is 10× the real crore figure**. Divide by `10000000` in a live
  formula and label the column `Total Revenue (₹ Cr)`.

What has no Indian equivalent is listed in `NOT-ADAPTABLE.md`. Name the gap —
never substitute a proxy and present it as the real thing.

## Before you start

- **Files this skill names.** `india-market-conventions`, `india-market-data` and `NOT-ADAPTABLE.md` are not included in this folder. If you cannot load them, use the two rules above, and take every figure from what the user gives you. Say in your reply that the fuller guides were not loaded.
- **Needs.** Your AI must be able to write a Word file for the default format. If it cannot, write Markdown and say so.
- **This skill writes up the facts it is given.** It does no research. Never invent a financial, a deal term, a returns figure, a market size or a management name. Mark any missing item `MISSING` in the memo and list it in the open questions.
- **Not advice.** The memo supports a human decision. It does not replace a legal, tax or accounting review.

## Workflow

### Step 1: Gather Inputs

Collect from the user (or from prior analysis in the session):

- Company overview and business description
- A screening memo or diligence review already in the chat: use it for the findings and the call, and a valuation range for the price view. Ask only for what they leave out.
- Industry/market context
- Historical financials (3-5 years)
- Management assessment
- Deal terms (price, structure, financing)
- Due diligence findings (commercial, financial, legal, operational)
- Value creation plan / 100-day plan
- Returns analysis (base, upside, downside)

### Step 2: Draft Memo Structure

Standard IC memo format:

**I. Executive Summary** (1 page)
- Company description, deal rationale, key terms
- Recommendation and headline returns
- Top 3 risks and mitigants

**II. Company Overview** (1-2 pages)
- Business description, products/services
- Customer base and go-to-market
- Competitive positioning
- Management team

**III. Industry & Market** (1 page)
- Market size and growth
- Competitive landscape
- Secular trends / tailwinds
- Regulatory environment

**IV. Financial Analysis** (2-3 pages)
- Historical performance (revenue, EBITDA, margins, cash flow)
- Quality of earnings adjustments
- Working capital analysis
- Capex requirements

**V. Investment Thesis** (1 page)
- Why this is an attractive investment (3-5 pillars)
- Value creation levers (organic growth, margin expansion, M&A, multiple expansion)
- 100-day priorities

**VI. Deal Terms & Structure** (1 page)
- Enterprise value and implied multiples
- Sources & uses
- Capital structure / leverage
- Key legal terms

**VII. Returns Analysis** (1 page)
- Base, upside, and downside scenarios
- IRR and MOIC across scenarios
- Key assumptions driving returns
- Sensitivity analysis

**VIII. Risk Factors** (1 page)
- Key risks ranked by severity and likelihood
- Mitigants for each risk
- Deal-breaker risks (if any)

**IX. Recommendation**
- Clear recommendation: Proceed / Pass / Conditional proceed
- Key conditions or next steps

### Step 3: Output Format

- Default: Word document (.docx) with professional formatting
- Alternative: Markdown for quick review
- Include tables for financials and returns, not just prose

## Important Notes

- IC memos should be factual and balanced — present both bull and bear cases honestly
- Don't minimize risks. IC members will find them anyway; credibility matters
- Use the firm's standard memo template if the user provides one
- Financial tables should tie — check that EBITDA bridges, S&U balances, and returns math is consistent
- Ask for missing inputs once, in one list, rather than making assumptions on deal terms or returns. If the user cannot supply them, write `MISSING` and carry on.
- Returns: show IRR and MOIC only if the user gave you the cases or the inputs to work them out. Show the working. Do not make up a case.
- Put the units in every table header, for example `Revenue (₹ Cr)`, and label periods `FY25`, not `2025`.
- Add an open questions list at the end of the memo, with one line per missing or weak item.

## What you hand back

The memo in sections I to IX, then a list of open questions, then one line on what to do next: take the memo to the committee, or fill the open questions first.

- **Runbook:** [`references/runbook-ic-memo.md`](references/runbook-ic-memo.md) — the end-to-end walkthrough (which skills to load in what order, and the output contract).
