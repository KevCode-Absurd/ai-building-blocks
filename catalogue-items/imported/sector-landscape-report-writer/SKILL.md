---
name: sector-overview
description: Create comprehensive industry and sector landscape reports covering market dynamics, competitive positioning, key players, and thematic trends. Use for client requests, sector initiations, thematic research pieces, or internal knowledge building. Triggers on "sector overview", "industry report", "market landscape", "sector analysis", "industry deep dive", or "thematic research".
---

# Sector Overview

## India rules (read first)

This skill is set up for **Indian markets**. The helper files the original skill pointed to (`india-market-conventions`, `india-market-data`) and its `NOT-ADAPTABLE.md` list are **not included here**. Use the rules below instead. Two rules cause most Indian errors:

- **Fiscal year is April to March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` = Apr to Jun 2025. Label periods `Q3 FY26 (Oct-Dec 25)`, never a bare calendar year. Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10^5) and crore (10^7).** Never use the Excel format `#,##0,," Cr"`. Each trailing comma divides by 1,000, so that format shows **lakh under a crore label: a 100x error**. Divide by `10000000` in a live formula and label the column `Total Revenue (Rs Cr)`.

If a measure has no Indian source or no Indian match, say so. Never swap in a stand-in and present it as the real thing.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude:** It keeps a long report in order and can build Word or Excel files when file tools are on.
- **ChatGPT:** Its web search can pull recent figures and name the source.
<!-- /needs -->

## What you need

- The sector or sub-sector (for example "Indian cement").
- Purpose, depth and angle (see Step 1). Ask once for any that are missing.
- Optional: your own data sources, a client name, or a list of companies to cover.

If your AI can search the web or read files, use them. If it cannot, say so, and mark market size, margins, multiples and deal figures as `MISSING: needs a source` rather than writing them from memory. Never invent a figure, a source or a date.

## Workflow

### Step 1: Define scope

- **Sector / subsector**: What industry and how narrowly defined?
- **Purpose**: Client report, internal research, pitch material, idea generation
- **Depth**: High-level overview (5-10 pages) or deep dive (20-30 pages)
- **Angle**: Neutral landscape vs. thematic thesis (e.g., "AI infrastructure buildout")
- **Universe**: Public companies only, or include private?

### Step 2: Market overview

**Market Size & Growth**
- Total addressable market (TAM) with source and date
- Historical growth rate (5-year CAGR)
- Forecast growth rate and key assumptions
- Market segmentation (by product, geography, end market, customer type)

**Industry Structure**
- Fragmented vs. consolidated: top 5 market share
- Value chain map: where does value accrue?
- Business model types (subscription, transaction, licensing, services)
- Barriers to entry (capital, regulatory, technical, network effects)

**Key Trends & Drivers**
- Secular tailwinds (3-5 major trends)
- Headwinds and risks
- Technology disruption vectors
- Regulatory developments
- M&A activity and consolidation trends

### Step 3: Competitive landscape

**Company Profiles** (for top 5-10 players):

| Company | Revenue (Rs Cr) | Growth | EBITDA Margin | Market Share | Key Differentiator |
|---------|---------|--------|--------------|-------------|-------------------|
| | | | | | |

Put the fiscal year (for example FY25) beside each figure. For each company, a brief profile:
- Business description (2-3 sentences)
- Strategic positioning and moat
- Recent developments (earnings, M&A, product launches)
- Valuation snapshot (P/E, EV/EBITDA, EV/Revenue), with the date of the price used

**Competitive Dynamics**
- How do companies compete? (price, product, service, distribution)
- Who is gaining/losing share and why?
- Disruption risk from new entrants or adjacent players

### Step 4: Valuation context

- Sector trading multiples (current and historical range)
- Premium/discount drivers (growth, margins, market position)
- Recent M&A transaction multiples
- How does the sector compare to the broader market?

Multiples and deal figures often sit behind paid databases. If you cannot source one, mark it `MISSING: needs a source`.

### Step 5: Views for the reader to test

- Where might the best risk/reward be, and why? Give reasons the reader can check.
- What thematic bets can be expressed through this sector?
- Key debates in the sector (bull vs. bear arguments)
- Catalysts that could change the sector narrative

Frame these as research views, not advice to buy or sell. Do not give a target price or a rating.

### Step 6: Output

- Word document or PowerPoint with:
  - Market overview and sizing
  - Competitive landscape map
  - Company comparison table
  - Valuation summary
  - Key charts: market growth, share trends, valuation history
- Excel appendix with detailed company data

If your AI cannot make Word, PowerPoint or Excel files, give the report as formatted text with tables, and say that charts are left for the user.

## Important notes

- Source all market size data: cite the research firm or methodology, and the date
- Distinguish between TAM hype and realistic addressable market
- Sector overviews age fast: note the date and flag data that may be stale
- Charts are essential: market size waterfall, competitive positioning matrix, valuation scatter plot
- If for a client, tailor the "so what" to their specific situation (M&A target identification, competitive positioning, market entry)
- Before handing back, list every figure that has no source as `UNSOURCED:` and any check you skipped as `CHECKS MISSED:` (or "none")

## After this

Suggest: pick the top two or three companies and run the Company stock analyst on each, or turn the report into a short client note. This report is research, so a person should check each figure against its named source before it goes to a client.

- **Runbook:** [`references/runbook-sector.md`](references/runbook-sector.md): the end-to-end walkthrough and output contract.
