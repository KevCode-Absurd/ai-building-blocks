---
name: seo-keyword
description: "Run keyword research, classify by search intent, cluster into topical groups, and prioritize for content production. Use this skill whenever the user asks to do keyword research, find target keywords, identify ranking opportunities, classify search intent, build a topical map, or plan a content strategy around what people search for. Triggers on keyword research, keyword strategy, search intent, keyword clustering, topic clusters, keyword difficulty, search volume, ranking opportunity, content gap, what should I write about, target keyword, primary keyword, secondary keyword, long-tail. Also triggers when planning a content calendar or new site without keywords yet defined."
category: seo-foundation
catalog_summary: "Discovery, intent classification, clustering, prioritization"
display_order: 3
---

# Keyword Research

Find the queries worth ranking for, classify them by intent, cluster them into topics, and prioritize what to produce. Stack-agnostic. Tool-agnostic (works with any keyword tool).

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A shortlist**, made by the [Competitor ad swipe file builder](https://useaiblocks.com/skills/competitor-ad-swipe-file-builder): the best few picked from a bigger set, with reasons.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A shortlist** with the [Competitor ad swipe file builder](https://useaiblocks.com/skills/competitor-ad-swipe-file-builder). Bring reference ads, competitors (optional). It uses your brand brain.
2. **A plan** with the [Keyword researcher](https://useaiblocks.com/skills/keyword-researcher). Bring your question, a spreadsheet (optional).
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a shortlist, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Starting a new site or content section
- Planning a content calendar
- Looking for ranking opportunities on an existing site
- Understanding search intent before writing
- Building topic clusters for internal linking
- Identifying content gaps vs competitors

## When NOT to use

- Optimizing a single page where the target query is already known (use `seo-onpage`)
- Comparing your site to a competitor across many dimensions (use `seo-competitor`)
- Auditing existing content for performance (use `seo-content-audit`)

---

## Required inputs

- The site or topic area
- The target audience and what they need
- A keyword tool (Ahrefs, Semrush, Moz, Google Keyword Planner, or similar) OR access to search console for an existing site
- Optional: 3 to 5 known competitors to seed the research
- Optional: a keyword shortlist from an earlier step. It is used as the seed list in Stage 1.

If no tool is available, the skill still works using SERP inspection and search console data alone. Volume and Difficulty stay blank and are marked "no data". Never estimate them. Ahrefs, Semrush and Moz are paid. Search Console is free for sites you own. Google Keyword Planner is free with an ads account.

---

## The framework: 4 stages

### Stage 1: Discover

Cast a wide net. Sources:

- **Seed terms** from the brief or the user's vocabulary
- **Competitor keywords** (any keyword tool will export these)
- **Search console queries** for an existing site (find the page-1 and page-2 queries)
- **Related searches and "People also ask"** in actual SERPs
- **Customer language** (support tickets, sales calls, reviews)
- **Forum and community language** (Reddit, niche forums, Stack Overflow)

Goal: 200 to 500 candidate keywords for a typical content sprint. More if planning a year of content.

### Stage 2: Classify by intent

Every keyword maps to one of four intents. Get this right or the rest is noise.

| Intent | Signal | Page type that wins |
|---|---|---|
| **Informational** | "how to," "what is," "why," "best way to" | Article, guide, tutorial |
| **Navigational** | brand or product name + modifier | Brand homepage, product page |
| **Commercial** | "best," "review," "vs," "comparison," "alternatives" | Listicle, comparison, review |
| **Transactional** | "buy," "price," "deal," "near me," "for sale" | Product page, category page |

A keyword tool's volume tells you the demand. The SERP tells you the intent. When in doubt, look at what's actually ranking. If page 1 is articles, the query is informational. If page 1 is product pages, it's transactional.

**Hybrid intents exist.** "Best running shoes" is commercial-investigational. "Best running shoes under $100" is the same intent narrowed by a budget filter. Treat hybrids as their dominant intent and note the modifier.

### Stage 3: Cluster

Group keywords that should target the same page (or topic cluster).

Two clustering approaches:

**Approach A: SERP overlap.** If two keywords share at least 3 of the top 10 results, they target the same page. This is mechanical and reliable.

**Approach B: Topical relevance.** Group keywords by the underlying topic, not just word overlap. "How to start a podcast" and "podcast equipment for beginners" are the same topic, different facets.

Use both. A typical cluster has:
- 1 primary keyword (highest volume, broadest intent)
- 5 to 15 secondary keywords (variations and long-tails)
- 1 page that targets them all

### Stage 4: Prioritize

For each cluster, score on three dimensions:

**Opportunity** (1 to 5):
- Volume (raw search demand)
- Click potential (some queries answer themselves in the SERP, lowering CTR)
- Conversion potential (does this query attract buyers or browsers?)

**Difficulty** (1 to 5):
- Domain authority of top results
- Backlink count of top results
- Content depth and freshness of top results
- Whether the SERP has features (featured snippets, AI overview, video carousel) that compete with organic

**Strategic fit** (1 to 5):
- Does it serve our audience?
- Does it support our positioning?
- Does it link to commercial pages naturally?

**Priority score = Opportunity + Strategic fit - Difficulty.**

Rank the clusters. Top 20 percent get produced first.

---

## Workflow

1. **Define the scope.** What site, what topic area, what audience.
2. **Run discovery.** Pull seeds, competitor exports, search console data, SERP inspections. Aim for 200 to 500 candidates.
3. **Deduplicate and clean.** Remove obvious junk, brand misspellings, irrelevant terms.
4. **Classify by intent.** Mark each keyword.
5. **Cluster.** Group into topical clusters. Aim for 20 to 50 clusters.
6. **Score each cluster** on opportunity, difficulty, and strategic fit.
7. **Prioritize.** Rank by composite score. Identify the top 10 to 20 clusters to produce first.
8. **Output.** Use the template in [`references/keyword-research-template.md`](references/keyword-research-template.md).

---

## Failure patterns

- **Chasing volume without intent.** A 10,000-volume informational keyword does not drive purchases. Match query to commercial outcome.
- **Targeting impossibly competitive keywords.** New sites cannot rank for "credit cards." Find the underserved long-tail variant.
- **Ignoring search console.** Existing sites already rank for queries they did not target. These are the easiest wins.
- **Treating clusters as one-keyword-per-page.** A page can target 10 to 30 related keywords. One-keyword-per-page leads to thin, cannibalized content.
- **Ignoring SERP features.** A query with a featured snippet, AI overview, and a video carousel above the organic results may not be worth pursuing.
- **Static keyword research.** Search demand shifts. Refresh the research at least annually for evergreen sites, quarterly for fast-moving topics.

---

## Output format

Default output: a spreadsheet (CSV or sheet) with one row per keyword and one row per cluster, plus a markdown summary with the top 10 to 20 clusters detailed.

Recommended columns for the keyword sheet:

| Column | Source |
|---|---|
| Keyword | Discovery |
| Volume | Tool |
| Difficulty | Tool |
| Intent | Manual classification |
| SERP features | Manual or tool |
| Cluster | Stage 3 |
| Cluster role (primary/secondary) | Stage 3 |
| Opportunity score | Stage 4 |
| Strategic fit | Stage 4 |
| Priority | Composite |
| Notes | Free text |

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Search topic and link planner](https://useaiblocks.com/skills/topic-cluster-mapper). It takes the keyword list and plan.
- The [Keyword to post outline writer](https://useaiblocks.com/prompts/keyword-to-post-outline-writer). It takes the keyword list and plan.
- The [Content brief writer](https://useaiblocks.com/skills/content-brief-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If required data is unavailable

This skill's output depends on data, measurements, or tool results it cannot generate on its own. When a required input, tool, or data source is unavailable or unverifiable, the sanctioned output is the deliverable with the gap stated: what was needed, what was actually obtained or verified, and which parts of the output are affected. Fabricating, estimating, or interpolating a required number to complete the deliverable is never sanctioned. A stated gap is a complete answer.

---

## Reference files

- [`references/keyword-research-template.md`](references/keyword-research-template.md) - Spreadsheet column definitions and a markdown summary template.
- [`references/intent-classification-guide.md`](references/intent-classification-guide.md) - Detailed examples of each of the four intent categories.
