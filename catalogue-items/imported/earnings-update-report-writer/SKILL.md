---
name: earnings-analysis
description: Create professional equity research earnings update reports (8-12 pages, 3,000-5,000 words) analyzing quarterly results for companies already under coverage. Fast-turnaround format focusing on beat/miss analysis, key metrics, updated estimates, and revised thesis. Includes 1-3 summary tables and 8-12 charts. Use when user requests "earnings update", "quarterly update", "earnings analysis", "Q1/Q2/Q3/Q4 results", or post-earnings report.
---

# Equity Research Earnings Update

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Financial statements** (yours): the income statement, balance sheet and cash flow statement, for the periods you have.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Your data** (yours): the data files, with their format and where they came from.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A document** with the [Earnings recap writer](https://useaiblocks.com/skills/earnings-recap-writer). Bring your question.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for financial statements, your question, your data. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## India

This skill operates on **Indian markets**. The rules below are all you need. Two rules cause
most Indian errors:

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` =
  Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
  Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format
  `#,##0,," Cr"` — each trailing comma divides by 1,000, so that format displays
  **million under a crore label: a 10× error**. Divide by `10000000` in a live
  formula and label the column `Total Revenue (₹ Cr)`.

**Sources.** Take figures only from these, and only ones you opened: the company's results filing on BSE or NSE, the results press release, the investor presentation, the concall transcript, and the consensus the user gives you. If the user has no consensus, say so and do not make one up.

**Gaps.** Some US items have no Indian equivalent, such as 10-Q and 10-K forms, SEC filings and EDGAR links. Name the gap. Never substitute a proxy and present it as the real thing.

**Wording from the US original.** The reference files may still say 10-Q, SEC, EDGAR or dollars. For an Indian company, use the exchange results filing (BSE or NSE), the results press release, the investor presentation and the concall transcript instead, and show amounts in ₹ crore. Do not cite a US form for an Indian issuer.

**Links.** Only link a document you actually opened. Never guess or complete a URL. If you did not open the page, write the document name and date with no link.

**Rating and price target.** A rating and a price target make this a research report. In India that is regulated, so it needs the disclosures and the compliance review that your firm and SEBI's research analyst rules require. Ask the user for their disclosure text and add it as given. Do not write disclosures yourself, and do not publish before a compliance reviewer has read it.

Create professional **EARNINGS UPDATE REPORTS** analyzing quarterly results for companies already under coverage, following institutional standards (JPMorgan, Goldman Sachs, Morgan Stanley format).

**Key Characteristics:**
- **Length**: 8-12 pages
- **Word Count**: 3,000-5,000 words
- **Tables**: 1-3 summary tables (NOT comprehensive)
- **Figures**: 8-12 charts
- **Turnaround**: 1-2 days (within 24-48 hours of earnings)
- **Audience**: Clients already familiar with the company
- **Focus**: What's NEW - beat/miss, updated estimates, thesis impact
- **Font**: Times New Roman throughout (unless user specifies otherwise)

## When to Use

Use when the user requests:
- "Create an earnings update for [Company] Q3 FY26"
- "Analyze [Company]'s quarterly results"
- "Post-earnings report for [Company]"
- "Q1/Q2/Q3/Q4 update for [Company]"

**Do NOT use if:**
- User requests "initiation report" → Use different skill
- User requests "flash note" or "quick take" → Different format
- Company is not already covered → Need initiation first

## Critical Requirements

### 1. Speed & Timeliness
- Publish within 24-48 hours of earnings release
- Focus on NEW information only
- Don't rehash company background extensively

### 2. Beat/Miss Analysis
- Lead with whether company beat or missed estimates
- Quantify variances (for example, "Revenue beat by ₹[AMOUNT] crore or [PERCENT]%"). Use only figures from the filing and the consensus the user gave you.
- Explain WHY results differed from expectations

### 3. Summary Format
- Keep tables to 1-3 (summary only, not comprehensive)
- No full P&L/Cash Flow/Balance Sheet (just key metrics)
- Assume reader has seen initiation report

### 4. Citations & Source Attribution ⭐⭐⭐ MANDATORY

**CRITICAL**: Properly cite all data with SPECIFIC sources and CLICKABLE HYPERLINKS.

**Include specific citations WITH CLICKABLE LINKS in every figure and table:**

```
Source: Q[N] FY[YY] results filing on [BSE or NSE], filed [DATE]; company results press release
        [Hyperlink "results filing" to the exchange page you opened]
        [Hyperlink "press release" to the company page you opened]
```

**HOW HYPERLINKS SHOULD APPEAR IN WORD:**
- Document names appear as blue, underlined clickable links
- Reader can Ctrl+Click to open source directly
- Not plain text URLs - formatted hyperlinks with display text

**REQUIRED SOURCES LIST:**

Cite in every earnings update:
- ✅ Earnings release (with date and URL)
- ✅ Exchange results filing from BSE or NSE (with filing date and link)
- ✅ Earnings call (concall) transcript (with date)
- ✅ Investor presentation/supplemental materials (if available)
- ✅ Consensus estimates source with date. Bloomberg and FactSet are paid services and optional. The user can paste consensus from any source they already have, and you must say where it came from.
- ✅ Prior guidance (from previous quarter's materials)

**REFERENCE SECTION WITH CLICKABLE HYPERLINKS:**

Include "Sources" section at end of report:

```
SOURCES & REFERENCES

Earnings Materials (Q[N] FY[YY]):
• Results press release ([DATE])
  [Hyperlink to the company page you opened]

• Exchange results filing on BSE or NSE (filed [DATE])
  [Hyperlink to the exchange page you opened]

• Concall transcript ([DATE])
  [Hyperlink to the transcript page you opened]

• Investor presentation ([DATE])
  [Hyperlink to the file you opened]
```

**VERIFICATION CHECKLIST:**
- [ ] Every figure has source with specific document and date
- [ ] Every table has source with document reference
- [ ] Beat/miss analysis cites consensus source with date
- [ ] Guidance changes cite current and prior guidance sources
- [ ] Key statistics have footnotes
- [ ] Sources section lists all materials with URLs
- [ ] ALL URLs are CLICKABLE HYPERLINKS (not plain text)
- [ ] All exchange filings hyperlinked to the BSE or NSE page you opened

### 5. Updated Estimates
- Update forward estimates based on results
- Show old vs. new estimates clearly
- Explain what changed and why

## High-Level Workflow

Steps in order: 1) collect the BSE or NSE results filing, press release, concall transcript and consensus; 2) check that their dates match the quarter you are updating (the one the user named, or the latest if they did not name one); 3) build the beat or miss table against consensus; 4) update estimates and check the thesis; 5) draft the report and charts; 6) compliance review before anyone publishes it. The five phases below give the detail.

The earnings update process follows 5 phases:

### Phase 1: Data Collection (30-60 minutes)

**🚨🚨🚨 CRITICAL: TRAINING DATA IS OUTDATED 🚨🚨🚨**

**FIRST, FIX THE PERIOD (added by AI Blocks):**
- **The user named a quarter** (for example "Q2 FY24"): that quarter is the target, even if it is years old. Search for that quarter's results filing, press release and concall by name. Check that each document is for that quarter. Never swap in a newer quarter, and never reject the request because the release is more than 3 months old. Say in the report that it is a historical update and give the release date.
- **The user asked for the latest quarter, or did not name one**: the target is the most recent quarter the company has reported. Use the 3-month check below to make sure you found it.
- **You cannot tell which they mean**: ask once before you collect anything.

**BEFORE STARTING - COMPLETE THESE 4 STEPS IN ORDER:**
1. **CHECK TODAY'S DATE** - Write down the current date
2. **SEARCH FOR THE TARGET QUARTER** - Use web search: "[Company] Q[N] FY[YY] results" for a named quarter, or "[Company] latest earnings results" for the latest
3. **VERIFY THE DATE** - Named quarter: confirm the documents are for that quarter. Latest quarter: confirm the release is within the last 3 months
4. **CHECK TRANSCRIPT DATE** - Verify transcript date matches release date

**COMMON MISTAKE**: Using outdated earnings calls from training data instead of searching. For a named older quarter, the other mistake is replacing it with the latest one.

**REQUIREMENTS:**
- ✅ Search for the target quarter - do NOT rely on training data
- ✅ Write down today's date, the target quarter and the release date found
- ✅ Latest-quarter requests only: verify release date is within 3 months of today, and if it is older, search again
- ✅ Named-quarter requests: verify every document is for that quarter, whatever its age
- ✅ Verify transcript date matches release date
- ✅ If dates don't match the target quarter, search again

**See [references/workflow.md](references/workflow.md)** for detailed search procedures and verification steps.

### Phase 2: Analysis (2-3 hours)
- Beat/miss analysis for each key metric
- Segment/geographic/product breakdown
- Margin and guidance analysis
- Update financial model and estimates

**See [references/workflow.md](references/workflow.md)** for detailed analysis framework.

### Phase 3: Chart Generation (1-2 hours)
Create 8-12 charts focusing on quarterly trends and what's new:
- Quarterly revenue progression
- Quarterly EPS progression
- Quarterly margin trends
- Revenue by segment/geography
- Key operating metrics
- Beat/miss summary
- Estimate revisions
- Valuation charts

**See [references/workflow.md](references/workflow.md)** for chart specifications.

### Phase 4: Report Creation (2-3 hours)
Create 8-12 page DOCX report with specific structure.

**See [references/report-structure.md](references/report-structure.md)** for complete page-by-page templates and formatting requirements.

**High-level structure:**
- Page 1: Earnings summary with rating and price target
- Pages 2-3: Detailed results analysis
- Pages 4-5: Key metrics & guidance
- Pages 6-7: Updated investment thesis
- Pages 8-10: Valuation & estimates
- Pages 11-12: Appendix (optional)

### Phase 5: Quality Check & Delivery (30 minutes)
Verify content, formatting, accuracy, and timeliness before delivery.

**See [references/best-practices.md](references/best-practices.md)** for quality checklist and common mistakes to avoid.

## Output Specification

**Primary Deliverable**: DOCX report (8-12 pages)
**File Name**: `[Company]_Q[Quarter]_[Year]_Earnings_Update.docx`
**Example**: `[Company]_Q2_FY26_Earnings_Update.docx`

**Contents:**
- Page 1: Summary with rating, price target, key takeaways
- Pages 2-3: Detailed results analysis
- Pages 4-5: Key metrics and guidance
- Pages 6-7: Updated thesis assessment
- Pages 8-10: Valuation and estimates
- Pages 11-12: Appendix (optional)
- 8-12 embedded charts
- 1-3 summary tables
- Complete sources section with clickable hyperlinks

**Optional Deliverable**: XLS model update (optional for earnings updates)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [India business sale memo writer](https://useaiblocks.com/skills/sale-memorandum-drafter). It takes the document.
- The [Employee option dilution calculator](https://useaiblocks.com/skills/treasury-stock-option-dilution). It takes the document.
- The [Excess earnings calculator](https://useaiblocks.com/skills/one-period-residual-income-bridge). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Key Differences from Initiation Report

| Aspect | Earnings Update | Initiation Report |
|--------|----------------|-------------------|
| **Length** | 8-12 pages | 30-50 pages |
| **Words** | 3,000-5,000 | 10,000-15,000 |
| **Tables** | 1-3 summary | 12-20 comprehensive |
| **Figures** | 8-12 | 25-35 |
| **Turnaround** | 1-2 days | 3-6 weeks |
| **Scope** | Quarterly results | Complete company |
| **Focus** | What's NEW | Everything |
| **Company Background** | Brief mention | 6-10 pages |
| **XLS Model** | Optional | Required |

## Resources

### references/workflow.md
Detailed Phase 1-5 instructions with step-by-step procedures for data collection, analysis, chart generation, and report creation.

### references/report-structure.md
Complete page-by-page templates, table formats, and formatting requirements for the DOCX report.

### references/best-practices.md
Examples of good/bad headlines, tips for success, common mistakes to avoid, and comprehensive quality checklist.

## Dependencies

**Required:**
- Python (matplotlib, pandas, seaborn) for chart generation
- DOCX skill for report creation

**Optional:**
- XLS skill for model updates (not required for earnings updates)

- **Runbook:** [`references/runbook-earnings.md`](references/runbook-earnings.md) — the end-to-end walkthrough (which skills to load in what order, and the output contract).

Changed by AI Blocks (2026-10-28): a quarter the user names is now used as asked, even if it is old; the latest-quarter and 3-month checks apply only when the user asks for the latest quarter or names none.
Changed by AI Blocks (2026-10-28): refreshed the generated Before you start and After this guidance from catalogue metadata.
