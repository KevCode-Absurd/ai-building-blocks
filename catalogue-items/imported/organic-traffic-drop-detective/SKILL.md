---
name: seo-traffic-diagnosis
description: "Diagnose organic traffic changes (drops, stalls, or unexpected wins) using Ahrefs MCP plus Search Console data. Use this skill when traffic suddenly dropped, has been flat despite investment, after an algorithm update, after a migration or deploy, or when a competitor seems to be taking share. Triggers on traffic dropped, traffic decline, traffic stalled, organic decline, lost rankings, why is traffic down, algorithm update, post-migration traffic loss, traffic diagnosis. Also triggers when stakeholders are panicking about an organic traffic number they cannot explain. A panic about tracking, event, or dashboard setup is a measurement problem, not a traffic problem: route those to `analytics-strategy`."
category: seo-audit-suite
catalog_summary: "Diagnose drops, stalls, or wins via 5-layer root cause analysis"
display_order: 5
---

# SEO Traffic Diagnosis

Diagnose why organic traffic moved (down, flat, or unexpectedly up) using Ahrefs MCP combined with Search Console and analytics data. Stack-agnostic. Produces a root-cause diagnosis and an action plan.

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A search query report** (yours): an export from Google Search Console or the Google Ads search terms report, for set dates.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a search query report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Organic traffic dropped sharply
- Organic traffic has been flat for months despite content investment
- After a known Google algorithm update
- After a migration, replatform, or domain change
- After a deploy that touched routing, redirects, or rendering
- When a competitor is visibly taking organic share
- When a single page dropped from a ranked position
- When stakeholders need an explanation, fast

## When NOT to use

- Routine performance reporting (use `analytics-strategy`)
- Pre-emptive content planning (use `seo-content-gap-audit`)
- Backlink-only investigations (use `seo-backlink-audit`)
- Technical issue triage outside of traffic concerns (use `seo-site-health-audit`)

---

> Added by AI Blocks: this skill needs a paid Ahrefs account and Search Console access. Similarweb is optional and also paid. If your AI cannot connect to them, ask the person to paste or upload exports from each, and say plainly what is missing and what it limits.

## Required inputs

- Description of the symptom (what changed, when, magnitude)
- Date the change started (best estimate)
- Recent SEO history: deploys, migrations, content changes, link campaigns
- Access to Ahrefs MCP, Search Console, and analytics
- Confirmation the change is real (not a tracking artifact)

---

## The framework: 5 layers of diagnosis

A traffic change has one or more root causes. Move through the layers in order. Stop when you have enough evidence.

### Layer 1: Confirm the change is real

Before diagnosing, rule out:

- Tracking gaps (analytics outages, tag manager issues)
- Bot traffic changes
- Reporting comparison errors (different date ranges, wrong segment)
- Seasonality (compare year-over-year, not just month-over-month)
- Holiday or weekday effects

Cross-check Search Console clicks against analytics organic sessions. Significant divergence often points to a tracking issue, not a real traffic change.

### Layer 2: Localize the change

Where is the change happening?

Segment by:

- Country and language
- Device (mobile, desktop, tablet)
- Page or section (homepage, blog, product, category)
- Query type (branded vs non-branded)
- Landing page

A change in one segment requires different diagnosis than a change everywhere.

The table says where to look first, not what the cause is. Each row assumes Layer 1 already ruled out tracking, reporting and seasonal effects for that segment. A cause is only confirmed by the evidence in Layers 3 to 5.

| Pattern | Look first at (candidates, not conclusions) |
| --- | --- |
| One country dropped | Local algorithm update, hreflang issue, geo redirect issue, local demand or holiday |
| Mobile dropped, desktop flat | Mobile usability or page speed regression, mobile SERP layout change |
| One section dropped | Topical algorithm update, section-specific quality or technical issue, falling demand for that topic |
| Branded queries dropped | Fewer people searching the brand name (check impressions and search demand: less advertising, PR fading, seasonal demand), SERP changes on brand terms, site outage, reputation, manual action |
| Non-branded dropped | Ranking losses, falling search demand, SERP features (ads, AI overviews, snippets) taking clicks, technical issues on the ranking pages |
| Single page dropped | Page-level issue: content, technical, or competitive |
| Sitewide dropped | Sitewide issue: penalty, technical, migration, or algorithm |

To tell a demand change from a ranking change, compare impressions and average position in Search Console for the same queries: impressions down with steady position points to less demand; position down points to ranking.

### Layer 3: Page-level analysis

For affected pages, audit:

- Position changes per ranked keyword (Ahrefs Rank Tracker history)
- SERP composition changes (more ads, AI overviews, featured snippets, video)
- Click-through rate changes
- Index status (Search Console coverage)
- Crawl errors and accessibility
- Recent content changes
- Internal link changes
- Backlink changes (lost links, redirect chains)

A page can lose traffic without losing rank if SERP composition changed.

### Layer 4: Technical analysis

Did anything break technically?

Check:

- Robots.txt changes
- Canonical tag changes
- Meta robots changes (accidental noindex)
- Redirect chains and loops
- Render issues (especially for JS-heavy frameworks)
- Site speed regressions
- Hreflang errors
- Sitemap freshness
- HTTP status codes (4xx, 5xx spikes)
- Server log evidence of crawl behavior changes

Recent deploys are the prime suspect. Compare deploy dates to traffic change dates.

### Layer 5: External analysis

If layers 1-4 do not explain the change, look outward.

- Algorithm update calendar (cross-reference timing)
- Competitor moves (new content, new SERP features they captured)
- Industry trend (declining search demand for the topic)
- Manual action (Search Console security and manual actions)
- Negative SEO (sudden link velocity changes)

External-factor diagnosis benefits from competitive context: did your traffic drop while competitors held steady (suggests an algorithm-specific issue), or did the entire vertical lose ground (suggests a user-behavior shift)? Similarweb shows competitor traffic trends; Ahrefs shows competitor SERP movement; pairing both surfaces whether the issue is yours alone or the category's.

---

## Workflow

1. **Confirm the symptom.** Get exact dates, magnitude, segment if known.
2. **Validate the data.** Layer 1 checks. Rule out tracking and seasonality.
3. **Localize.** Layer 2. Segment until the pattern is clear.
4. **Page-level dive.** Layer 3 on the most affected pages.
5. **Technical check.** Layer 4. Recent deploys, robots, canonicals, redirects.
6. **External check.** Layer 5. Algorithm updates, competitors, industry.
7. **Build the hypothesis.** State the cause as a single sentence.
8. **Validate the hypothesis.** Find the evidence that confirms or refutes it. See [`references/diagnosis-checklist.md`](references/diagnosis-checklist.md).
9. **Action plan.** Specific fixes mapped to specific evidence.
10. **Communicate.** Write up the diagnosis. Stakeholders want clarity, not exhaustive analysis.

---

## Failure patterns

- **Jumping to algorithm update.** "It must be the algorithm" is the lazy answer. Eliminate technical and page-level causes first.
- **Solving the wrong problem.** A drop diagnosed as "content quality" when the real cause was an accidental noindex on a deploy. Validate the hypothesis before fixing.
- **No baseline for "normal."** Without a baseline, every fluctuation looks alarming. Establish what normal noise looks like before reacting.
- **Treating one page as the site.** Site-wide and page-level diagnoses are different. Confirm scope first.
- **Ignoring branded vs non-branded.** Split them, because the likely causes and owners differ: branded drops often trace to brand demand (marketing, PR), non-branded drops to rankings or search demand (SEO). The split narrows the search. It does not prove a cause: check seasonality, measurement and demand for that segment before you assign it.
- **Comparing wrong date ranges.** Comparing 28 days to the previous 28 days during a holiday distorts the picture. Use year-over-year for seasonal businesses.
- **Stopping at correlation.** A deploy and a drop on the same day is a strong correlation, not proof. Find the mechanism.
- **Single-source diagnosis.** Ahrefs sees position. Search Console sees clicks and queries. Analytics sees behavior. Logs see crawl. Use them together.
- **Premature reassurance.** Telling stakeholders "it is just an algorithm update, will recover" without evidence sets up a worse conversation later.

---

## Output format

A diagnosis document with:

1. **Summary.** What changed, when, magnitude, root cause in one paragraph.
2. **The symptom.** Charts and segment breakdowns.
3. **Layer-by-layer findings.** What each layer ruled in or out.
4. **Root cause hypothesis.** Single statement with evidence.
5. **Action plan.** Ordered fixes with owners and timelines.
6. **Recovery forecast.** Realistic expectations on timeline and ceiling.
7. **Monitoring plan.** What to watch for confirmation of recovery.

Length: 4-10 pages. Stakeholders read this fast.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [TikTok ad test reader](https://useaiblocks.com/skills/tiktok-ad-test-reader). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If required data is unavailable

This skill's output depends on data, measurements, or tool results it cannot generate on its own. When a required input, tool, or data source is unavailable or unverifiable, the sanctioned output is the deliverable with the gap stated: what was needed, what was actually obtained or verified, and which parts of the output are affected. Fabricating, estimating, or interpolating a required number to complete the deliverable is never sanctioned. A stated gap is a complete answer.

---

## Reference files

- [`references/diagnosis-checklist.md`](references/diagnosis-checklist.md) - Layer-by-layer diagnostic checklist with the specific data to pull at each layer and how to interpret each signal.
