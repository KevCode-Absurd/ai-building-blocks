---
name: equity-research
description: Generate an equity research snapshot combining analyst consensus estimates, reported fundamentals, price history, and macro backdrop into a structured research note. Use when researching a stock, comparing estimates to actuals, assessing a company's financial quality or valuation, or building an investment case. Uses free sources (Alpha Vantage estimates, SEC EDGAR XBRL, yfinance, FRED).
---

# Equity Research Analysis

## India rules (read first)

This skill is set up for **Indian markets**. The helper files the original skill pointed to (`india-market-conventions`, `india-market-data`, `market-data-sources`) and its `NOT-ADAPTABLE.md` list are **not included here**. Use the rules below instead. Two rules cause most Indian errors:

- **Fiscal year is April to March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` = Apr to Jun 2025. Label periods `Q3 FY26 (Oct-Dec 25)`, never a bare calendar year. Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10^5) and crore (10^7).** Never use the Excel format `#,##0,," Cr"`. Each trailing comma divides by 1,000, so that format shows **lakh under a crore label: a 100x error**. Divide by `10000000` in a live formula and label the column `Total Revenue (Rs Cr)`.

If a measure has no Indian source or no Indian match, say so. Never swap in a stand-in and present it as the real thing. For a non-Indian company, say which fiscal year and currency you used.

You are an expert equity research analyst. Combine consensus estimates, reported fundamentals, price history, and macro data from free sources into structured research snapshots. Route the data into a coherent investment narrative; the thesis is yours to synthesize.

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
- **Claude:** It can run the code, hold all the tables in one note and keep source labels.
- **ChatGPT:** Its web and data analysis tools can pull data and chart price history.
<!-- /needs -->

## What you need

- A company name and its ticker in Yahoo form. For Indian stocks use `.NS` (NSE) or `.BO` (BSE), for example `RELIANCE.NS`. If only a name is given, ask once for the ticker.
- A way to run Python and reach the web. If your AI has neither, say so, and ask the user to paste the figures. Do not write numbers from memory.
- A free Alpha Vantage key for consensus estimates (25 requests a day on the free plan). The user gets it from Alpha Vantage's site. Without a key, use the yfinance fallback below.
- Optional: peers to compare, the user's own view on the stock, the sector.

If anything needed is missing, ask once. Then mark the section `MISSING: <what>` and go on. Never invent a figure.

## Core Principles

Every piece of data must connect to an investment thesis. Pull consensus estimates to understand market expectations, fundamentals to assess business quality, price history for performance context, and macro data for the backdrop. The key question is always: where might consensus be wrong? Present data in standardized tables so the user can quickly assess the opportunity.

## Data sources (free)

- **Consensus estimates**: Alpha Vantage `EARNINGS_ESTIMATES` (free key, 25 req/day, IBES-sourced: avg/high/low, analyst count, 7/30/60/90-day-ago revisions, revenue estimates, FY and FQ). Coverage of Indian companies may be thin. No-key fallback: `yfinance` `earnings_estimate` / `revenue_estimate` / `eps_trend` / `eps_revisions`.
- **Reported financials, Indian companies**: `yfinance` annual statements for the `.NS` or `.BO` ticker (fiscal year ends March). These come from Yahoo Finance, an unofficial source, so for figures you will rely on, check them against the company's annual report or BSE/NSE filings.
- **Reported financials, US companies**: SEC EDGAR XBRL `https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json`. This does not cover Indian listed companies. Do not use it for them.
- **Prices and beta**: `yfinance` (`Ticker.history`, snapshot `beta`, `info`), or stooq / FMP.
- **Macro backdrop**: for India use IMF DataMapper or World Bank, or figures the user pastes from the RBI. FRED keyless CSV `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<SERIES>` covers US series.

yfinance is an unofficial library with no tie to Yahoo. Yahoo may limit or block it, and its terms may restrict how the data is used. Ask the user before you install any package. Say that in the output.

Not covered: full statements of non-US filers from EDGAR, and any measure with no free Indian source.

## Workflow

1. **Consensus Snapshot:** Pull consensus via Alpha Vantage `EARNINGS_ESTIMATES` (or `yfinance.earnings_estimate`) for FY1 and FY2 estimates (EPS, Revenue, EBITDA, DPS). Note analyst count and dispersion.
2. **Historical Fundamentals:** For Indian companies pull the last 3-5 fiscal years from yfinance annual statements. For US companies use SEC EDGAR XBRL `companyfacts`. Extract revenue growth, margins, leverage, returns (ROE, ROIC).
3. **Price Performance:** Pull price history via `yfinance` for 1Y history. Compute YTD return, 1Y return, 52-week range position, beta.
4. **Recent Price Detail:** Pull recent price detail via `yfinance` for 3M daily data. Assess volume trends and recent momentum.
5. **Macro Context:** Pull macro for GDP, CPI, and policy rate in the company's primary market (see macro sources above). Summarize whether macro is tailwind or headwind.
6. **Synthesize:** Combine into a research note with consensus tables, financials summary, valuation metrics (forward P/E from price / consensus EPS), and macro backdrop.

## Data integrity (non-negotiable)

**Never fabricate a market datum.** A plausible-looking yield, spread, or option vol is worse than no number, because it is indistinguishable from a real one to whoever reads the output. If a field cannot be sourced:

1. State that it is unavailable and name the blocker (no free source / rate limit / needs a key).
2. Ask the user for it, or mark the cell `n/a: <reason>`.
3. Carry the provenance (source + retrieval date) on every figure.

All free sources here are end-of-day or delayed. None are real-time. Say so in the output rather than letting the tables imply live pricing.

## Output Format

### Consensus Estimates
| Metric | FY1 | FY2 | # Analysts | Dispersion |
|--------|-----|-----|------------|------------|
| EPS | ... | ... | ... | ...% |
| Revenue (Rs Cr) | ... | ... | ... | ...% |
| EBITDA (Rs Cr) | ... | ... | ... | ...% |

### Financials Summary
| Metric | FY-2 | FY-1 | FY0 (LTM) | Trend |
|--------|------|------|-----------|-------|
| Revenue (Rs Cr) | ... | ... | ... | ... |
| Gross Margin | ... | ... | ... | ... |
| Operating Margin | ... | ... | ... | ... |
| ROE | ... | ... | ... | ... |
| Net Debt/EBITDA | ... | ... | ... | ... |

Label each column with its fiscal year, for example `FY25 (Apr 24-Mar 25)`.

### Valuation Summary
| Metric | Current | Context |
|--------|---------|---------|
| Forward P/E | ... | vs sector/history |
| EV/EBITDA | ... | vs sector/history |
| Dividend Yield | ... | ... |

### Investment Thesis
Conclude with: a research view (positive, neutral or negative) and why, an indicative value range with the method and the assumptions behind it, key bull case (1-2 sentences), key bear case (1-2 sentences), upcoming catalysts, and conviction level (high/medium/low).

Write this as research, not advice. Do not tell the user to buy, sell or hold. End the note with: "Research only, not investment advice. Check figures against company filings before you rely on them."

### Sources and gaps
List each source with its retrieval date, every `MISSING` or `n/a` cell and why, and any check you skipped as `CHECKS MISSED:` (or "none").

## After this

Suggest: read the next results release against the consensus table, or run the Stock trading cost checker if the user is thinking of a large order in a thinly traded name.
