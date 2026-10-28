---
name: market-research
description: This skill should be used when the user asks about "compensation benchmarks", "salary data", "market trends", "talent supply and demand", "hiring landscape", "market research for recruiting", "compensation analysis", "talent availability", "hiring difficulty", "market rate", or needs to understand the labor market dynamics for a specific role, function, or geography.
---

# Market Research for Recruiting Sourcing

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **The job description** (yours): the role's title, team, duties and level, as a job post or plain notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the job description. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose

Analyze labor market dynamics to inform sourcing strategy and stakeholder conversations. Provide data-driven insights on compensation ranges, talent supply/demand, hiring difficulty, and market trends. Market research transforms sourcing from guesswork into strategic, evidence-based talent acquisition.

## Research Dimensions

### Compensation Analysis

Build compensation intelligence by triangulating multiple sources:

**Data Sources (by reliability):**
1. **Internal data** - Current employee comp, recent offers (most relevant)
2. **Offer data** - Rejected/accepted offers with candidate feedback
3. **Survey data** - Radford, Mercer, Culpepper, Carta (structured, lagging)
4. **Crowdsourced** - Levels.fyi, Glassdoor, Blind, Payscale (directional, noisy)
5. **Job postings** - Published salary ranges where legally required (Colorado, NYC, CA, EU)
6. **Recruiter intelligence** - Competitive offers seen in market (anecdotal, current)

**Compensation Structure:**
- **Base salary** - Fixed annual pay by level/location
- **Variable/bonus** - Target bonus percentage, attainment rates
- **Equity** - RSU/option grants, vesting schedules, refresh grants
- **Total compensation** - All-in annual value including benefits
- **Sign-on** - One-time payments to offset candidate costs

**Segmentation:**
- By geography (city/region, with cost-of-living adjustments)
- By company stage (startup, growth, enterprise, FAANG)
- By seniority level (junior through executive)
- By specialization (premium for niche skills)

### Talent Supply & Demand

**Supply indicators:**
- LinkedIn talent pool sizes for given search criteria
- Number of "open to work" candidates in the segment
- Active applicant volume on job boards
- Candidate response rates to outreach
- Average time candidates spend on market

**Demand indicators:**
- Number of open roles for the profile (LinkedIn, Indeed, Glassdoor)
- Job posting growth rate over past 6-12 months
- Average time-to-fill for similar roles (every figure must name its source, or be marked "not found"; never fill it from memory)
- Number of companies actively hiring for the role
- Recruiter activity in the space (InMail volume, outreach frequency)

**Supply/Demand Ratio:**
- **Employer-driven market** (supply > demand): More qualified, available candidates than roles; employers hold the power, with lower urgency and more selectivity
- **Candidate-driven market** (demand > supply): More roles than qualified, available candidates; candidates hold the power, so hiring is urgent and competitive offers are needed
- **Balanced market**: Supply roughly matches demand; standard processes work

**Before you call the market either way:**
- **Count qualified, available supply, not raw volume.** Applicant counts, "open to work" badges and pool sizes include people who lack the must-have skills, live outside the area or are not really looking. Say what share of a pool meets the role's must-haves, and how you judged it. If you cannot judge it, say the supply figure is an upper bound.
- **Match the scope.** Supply and demand figures must cover the same role definition, seniority, location (or remote area) and time period. If one source counts all "software engineers" nationwide and the other counts senior roles in one city, do not divide one by the other. Narrow one to fit the other, or report them side by side without a ratio.
- **State it as an estimate.** Give the figures, their sources and dates, and how confident you are. If the evidence is thin or mixed, call it "unclear" rather than picking a side.

### Hiring Difficulty Assessment

Rate hiring difficulty on a scale with these factors:

| Factor | Low Difficulty | High Difficulty |
|--------|---------------|-----------------|
| Pool size | Large (1000+) | Small (<100) |
| Demand | Few competitors hiring | Many competitors hiring |
| Comp expectations | Aligned with budget | Above budget range |
| Location requirements | Remote/flexible | Specific city, in-office |
| Skill rarity | Common skill set | Niche/emerging skills |
| Brand strength | Strong employer brand | Unknown/weak brand |
| Time pressure | Flexible timeline | Urgent fill needed |

### Market Trends

Track and report on:

- **Emerging skills** - New technologies/frameworks gaining adoption
- **Declining skills** - Technologies being deprecated or replaced
- **Workforce shifts** - Remote work trends, gig economy, contractor preferences
- **Regulatory changes** - Pay transparency laws, immigration policy, labor regulations
- **Economic factors** - Layoff trends, funding cycles, hiring freezes/surges
- **Industry movements** - Consolidation, new entrants, pivots

## Research Process

### Step 1: Define Research Scope

Clearly specify:
- Role/function being researched
- Geographic markets of interest
- Seniority range
- Key comparison companies or segments
- Specific questions to answer

### Step 2: Gather Data

Scope rule: no scraping. LinkedIn and job-board figures come only from numbers the user pastes, or from pages the AI can open without a login. Never ask for a login and respect each site's terms. If a figure is not available, write "not found".

Sources the AI may read without a login: public job postings that show a pay range, company career pages, public salary survey reports and government labour statistics, and press articles. Sources the AI must skip unless the user pastes the numbers: LinkedIn search results and talent pool counts, Glassdoor pages that ask you to sign in or contribute, and Blind. If a page asks for a login, a sign-up or a "contribute to see more" step, stop and write "not available".

Work through this checklist in order. For every source you use, record: the source name, its date, the sample size (if shown), and whether the pay figure is base pay or total pay.
1. Web search for recent salary surveys and reports
2. LinkedIn for pool sizing and demand signals, only from numbers the user pastes or pages open without a login. If a source is not available, write "not available" and use posted job ranges instead.
3. Job boards for posted salary ranges and posting volume (public pages only)
4. Industry reports for trends and benchmarks
5. Community discussions for qualitative signals
6. Write the source table: source, date, sample size, base or total pay

### Step 3: Analyze & Synthesize

- Cross-reference multiple sources to establish ranges
- Identify outliers and understand why they exist
- Note data recency and reliability
- Segment by relevant dimensions (geography, seniority, company type)

### Step 4: Frame Recommendations

- Position findings relative to the hiring company's context
- Highlight trade-offs, but only ones the data shows (the form is "a higher budget widens the pool"); never give a made-up multiplier
- Provide actionable recommendations for sourcing strategy
- Flag risks and market challenges

## Output Format

### Market Research Report Structure

**1. Executive Summary**
- Key findings in 3-5 bullet points
- Overall hiring difficulty rating
- Top recommendation

**2. Compensation Landscape**
- Salary ranges by level (P25, P50, P75, P90)
- Total compensation breakdown
- Geographic variations
- Comparison to hiring company's range

**3. Supply & Demand Analysis**
- Estimated talent pool size
- Active demand (competing open roles)
- Supply/demand characterization
- Trend direction (improving or worsening)

**4. Competitive Landscape**
- Top companies hiring for similar roles
- Employer brand comparison
- Compensation positioning
- Unique selling points vs. competitors

**5. Recommendations**
- Sourcing strategy implications
- Compensation positioning advice
- Timeline expectations
- Risk mitigations

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Job post writer](https://useaiblocks.com/skills/job-post-writer).
- The [Hiring search brief writer](https://useaiblocks.com/skills/hiring-search-brief-writer).
- The [Job offer planner](https://useaiblocks.com/skills/job-offer-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Data Presentation

When presenting compensation data, use clear ranges. The layout below uses placeholders only. Fill every figure from a source you can name, or write "not found":

```
[ROLE] - [LOCATION]
┌─────────────────────────────────────────────┐
│ Base Salary                                 │
│ P25: [figure from named source]             │
│ P50: [figure from named source]             │
│ P75: [figure from named source]             │
│                                             │
│ Total Compensation (incl. equity + bonus)   │
│ P25: [figure from named source]             │
│ P50: [figure from named source]             │
│ P75: [figure from named source]             │
└─────────────────────────────────────────────┘
Sources: [named sources and the year of each]
```

Always note:
- Data sources and recency
- Sample size where available
- Geographic basis
- Whether ranges are base or total comp

## Additional Resources

### Reference Files

You are **stongly encouraged** to read the reference files

For detailed methodology:
- **`references/data-sources-guide.md`** - Complete guide to compensation and market data sources with access methods
- **`references/report-templates.md`** - Markdown and HTML templates for market research reports
