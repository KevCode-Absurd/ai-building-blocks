---
name: cim-builder
description: Structure and draft a Confidential Information Memorandum for sell-side M&A processes. Organizes company information into a professional, investor-ready document with consistent formatting and narrative flow. Use when preparing sell-side materials, drafting a CIM, or organizing company data for a sale process. Triggers on "CIM", "confidential information memorandum", "offering memorandum", "info memo", "draft CIM", or "sell-side materials".
---

# CIM Builder

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **Financial statements** (yours): the income statement, balance sheet and cash flow statement, for the periods you have.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, financial statements, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## India

This skill operates on **Indian markets**. The companion skills
`india-market-conventions` and `india-market-data` are not included in this item,
so the two rules below are your conventions. For market figures, use only what the
user gives you and name the source; never fill a figure from memory. Two rules
cause most Indian errors:

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` =
  Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
  Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format
  `#,##0,," Cr"` — each trailing comma divides by 1,000, so that format displays
  **lakh under a crore label: a 100× error**. Divide by `10000000` in a live
  formula and label the column `Total Revenue (₹ Cr)`.

The original lists what has no Indian equivalent in `NOT-ADAPTABLE.md`, which is not
included here. Where a US-style item has no Indian equivalent, name the gap —
never substitute a proxy and present it as the real thing.

## Workflow

### Step 1: Gather Source Materials

Ask for available inputs:
- Management presentations
- Historical financials (3-5 years)
- Budget/forecast
- Company website and marketing materials
- Customer data (anonymized if needed)
- Org chart
- Prior presentations or board decks
- Quality of earnings report (if available)

### Step 2: CIM Structure

Standard CIM table of contents:

**I. Executive Summary** (2-3 pages)
- Company overview — what they do, why they win
- Investment highlights (5-7 key selling points)
- Financial summary — headline revenue, EBITDA, growth, margins
- Transaction overview — what's being sold, indicative timeline

**II. Company Overview** (3-5 pages)
- History and founding story
- Mission and value proposition
- Products and services description
- Business model and revenue streams
- Key differentiators and competitive advantages

**III. Industry Overview** (3-5 pages)
- Market size and growth dynamics (TAM/SAM/SOM)
- Key industry trends and tailwinds
- Competitive landscape
- Regulatory environment
- Barriers to entry

**IV. Growth Opportunities** (2-3 pages)
- Organic growth levers (new products, markets, pricing)
- M&A / add-on opportunities
- Operational improvements
- Technology investments
- White space analysis

**V. Customers & Sales** (3-5 pages)
- Customer overview (number, segments, geography)
- Top customer analysis (anonymized if pre-LOI)
- Customer concentration and retention metrics
- Sales process and go-to-market strategy
- Pipeline and backlog

**VI. Operations** (2-3 pages)
- Organizational structure
- Key personnel
- Facilities and geographic footprint
- Technology and systems
- Supply chain / vendor relationships

**VII. Financial Overview** (5-8 pages)
- Historical income statement (3-5 years)
- Revenue analysis — by segment, geography, customer type
- EBITDA bridge and margin analysis
- Balance sheet overview
- Cash flow summary
- Capital expenditure history
- Working capital analysis
- Management forecast / budget (if included)

**VIII. Appendix**
- Detailed financial statements
- Customer list (anonymized)
- Product catalog
- Management bios

### Step 3: Drafting Guidelines

- **Tone**: Professional, factual, compelling but not hyperbolic
- **Narrative**: Tell a story — why this business is attractive, defensible, and positioned for growth
- **Data-driven**: Support every claim with data. "Strong growth" → "Revenue grew at a [X]% CAGR from [YEAR] to [YEAR]" (use only the figure the accounts give)
- **Visuals**: Charts and graphs for financial trends, market size, competitive positioning
- **Length**: 40-60 pages total — enough detail to inform first-round bids, not so long buyers won't read it
- **Confidentiality**: Include a disclaimer page. Anonymize sensitive customer data unless seller approves

### Step 4: Output

- Word document (.docx) with professional formatting
- Separate Excel appendix with detailed financials
- Charts and exhibits embedded in the document

## Important Notes

- The CIM is a sales document — lead with strengths, but don't hide material issues (buyers will find them in diligence)
- Investment highlights should address the 3 things every buyer cares about: growth potential, margin profile, and defensibility
- Financial normalization / pro forma adjustments should be clearly labeled and explained
- Work with legal on the confidentiality disclaimer and any regulatory disclosures
- Get management to review for factual accuracy before distribution
- The CIM sets expectations on valuation — make sure the narrative supports the asking price

- **Runbook:** [`references/runbook-cim.md`](references/runbook-cim.md) — the end-to-end walkthrough (which skills to load in what order, and the output contract).

Changed by AI Blocks (2026-10-28): wrote the India fiscal-year and lakh/crore rules into the India section, because the companion skills and NOT-ADAPTABLE.md are not included in this item.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Indian company sale teaser writer](https://useaiblocks.com/skills/anonymous-company-teaser-writer). It takes the document.
- The [Sale process letter drafter](https://useaiblocks.com/skills/sale-process-letter-drafter).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
