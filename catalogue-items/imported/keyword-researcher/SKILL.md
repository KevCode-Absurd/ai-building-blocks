---
name: keyword-research
description: Conduct comprehensive keyword research to identify high-value search terms, map search intent, and uncover content gaps for SEO and content marketing. Use when the user requests keyword research or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Keyword Research

This skill enables an AI agent to perform end-to-end keyword research for any niche, product, or content initiative. The agent starts from seed keywords, expands into long-tail variations, classifies search intent, analyzes competitor keyword portfolios, and delivers a prioritized keyword strategy. The output helps content teams, SEO specialists, and product marketers target the right search terms to drive qualified organic traffic.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Google Search Console:** It is free and shows the real searches that already bring people to your site.
- **Google Trends:** It is free and shows whether a term is rising, steady or seasonal.
- **A paid keyword tool such as Semrush or Ahrefs:** It gives real volume, difficulty and rival rankings to paste in.
<!-- /needs -->

## How to run this skill

AI Blocks added these notes, and one line under Examples. The rest of the original skill below is unchanged. Where a note here disagrees with it, follow the note.

### What you need
Required:
- The seed topic, product or service.
- The target market and language.

Optional, and it makes the report better:
- What the content is for: blog posts, landing pages, product pages or paid campaigns.
- The site URL, and three to five rival sites, for the gap step.
- A keyword export from a keyword tool, or a Google Search Console export, for real numbers. A keyword list from an earlier step, such as the keyword research planner, also works here; treat its figures as estimates unless it names a source.

### If something is missing
- Ask once for the topic and the market. If you still do not have them, write `MISSING: <what>` and stop. Do not guess a market.
- Never invent a search volume, difficulty, cost, trend or ranking.

### Where the numbers come from
- Steps 3 and 5 ask for volume, difficulty, cost per click, trend and rival rankings. A chat AI has no live search data. Use the figures in the person's export if they gave one. Otherwise give a rough band (for example "low", "medium", "high") and label every figure `estimate`.
- Without an export or a paid keyword tool, rival rankings cannot be known. Say so. Name the terms rivals appear to cover from their pages, and mark the gap list `unverified`.
- Page-two terms (positions 11 to 20) can only be named from the person's own data. Do not list them without it.
- End the report with a line that says which numbers came from the person's data and which are estimates, and tell them to check the top terms in a keyword tool before they write.

### What you hand back
- Follow the report layout in step 6: a keyword table, a gap table, keyword groups tied to content pillars, and content ideas for each group.
- Finish with `CHECKS MISSED:` and list any step you could not do, or write "none".

## Workflow

1. **Collect seed keywords and define scope.** Gather initial seed keywords from the user's product description, existing content, and business goals. Identify the target market, geographic region, and language. Clarify whether the research is for blog content, landing pages, product pages, or paid campaigns, as this affects intent priorities.

2. **Expand into long-tail and related keywords.** Use autocomplete patterns, "People Also Ask" queries, and semantic variations to build a broad keyword list. Generate question-based keywords (who, what, how, why), comparison keywords ("X vs Y"), and modifier keywords (best, top, free, cheap, review). Aim for 50–200 candidate keywords per seed term depending on niche competitiveness.

3. **Gather search metrics for each keyword.** Use volume, keyword difficulty (0–100 scale), cost-per-click and trend direction (rising, stable, declining) from the person's export if they gave one. Otherwise give a rough band (low, medium, high) and label every figure `estimate`. Never invent exact numbers. Note seasonal patterns — for example, "tax software" peaks in January–April while "sunscreen" peaks in May–July.

4. **Classify search intent for every keyword.** Categorize each keyword as informational (learn), navigational (find a specific site), commercial investigation (compare options), or transactional (buy/sign up). This mapping determines the correct content format: blog posts for informational, comparison pages for commercial, and product/landing pages for transactional.

5. **Perform competitor keyword gap analysis.** Identify 3–5 organic competitors. If the person gave ranking data, compare the rivals' ranking keywords against the user's keyword portfolio and highlight keywords where competitors rank but the user does not. If not, name the terms rivals appear to cover from their pages and mark the gap list `unverified`. Flag page 2 keywords (positions 11–20) only from the person's own data.

6. **Deliver a structured keyword strategy report.** Organize keywords into thematic clusters mapped to content pillars. Prioritize clusters by a composite score of volume, difficulty, intent alignment, and business value. Include specific content recommendations for each cluster — suggested titles, target word counts, and internal linking opportunities.

## Usage

Provide the agent with a seed keyword or topic, your website URL (optional, for gap analysis), and your target audience. The agent returns a full keyword research report with prioritized clusters and content recommendations.

**Prompt:** `Perform keyword research for the topic "[YOUR TOPIC]" targeting [YOUR AUDIENCE] in the [YOUR MARKET] market. My site is [YOUR WEBSITE].`

## Examples

Everything in the two examples below is a placeholder that shows the layout. There are no real figures, rankings or sites. Never copy a placeholder into a report.

### Example 1: Keyword Research

**Request:** Research keywords for [YOUR PRODUCT] targeting [YOUR AUDIENCE].

**Keyword Table:**

| Keyword | Monthly Volume | Difficulty | CPC | Intent | Priority |
|---------|---------------|------------|-----|--------|----------|
| [KEYWORD 1] | [VOLUME OR ESTIMATE BAND] | [DIFFICULTY] | [CPC] | [Commercial / Informational / Transactional / Navigational] | [High / Medium / Low] |
| [KEYWORD 2] | [VOLUME OR ESTIMATE BAND] | [DIFFICULTY] | [CPC] | [INTENT] | [PRIORITY] |
| [KEYWORD 3] | [VOLUME OR ESTIMATE BAND] | [DIFFICULTY] | [CPC] | [INTENT] | [PRIORITY] |

Source of the numbers: [YOUR EXPORT or ESTIMATE]

**Cluster Recommendation:** Group [KEYWORD 1], [KEYWORD 2] and [KEYWORD 3] into a **[PILLAR NAME]** content pillar. Create a comparison or guide page of [LENGTH] as the pillar page, with supporting posts for each long-tail variation.

### Example 2: Content Gap Analysis

**Request:** Compare the keyword portfolio of [YOUR SITE] against [RIVAL SITE 1] and [RIVAL SITE 2].

**Gap Analysis** (rival ranks only from the person's own data; otherwise mark `unverified`):

| Keyword | Your Rank | Rival 1 Rank | Rival 2 Rank | Opportunity |
|---------|-----------|--------------|--------------|-------------|
| [KEYWORD A] | Not ranking | [RANK] | [RANK] | Create new pillar page |
| [KEYWORD B] | [YOUR PAGE-TWO RANK] | [RANK] | [RANK] | Optimize existing page, page 2 to page 1 |
| [KEYWORD C] | Not ranking | [RANK] | [RANK] | Create comparison or blog page |

**Recommendations:**
- Highest-impact opportunity: [WHICH KEYWORD AND WHY, based on the data above].
- Quick win: [WHICH EXISTING PAGE TO UPDATE AND WHAT TO ADD].

## Best Practices

- **Start with commercial and transactional intent keywords.** These drive revenue directly. Layer in informational keywords to build topical authority and capture top-of-funnel traffic over time.
- **Target keywords with difficulty scores below your site's Domain Authority.** As a rough rule of thumb from the original author, a newer site should aim for lower-difficulty terms first. Treat any exact cut-off or timeline as a guess.
- **Group keywords into clusters, not individual targets.** A single page should target a primary keyword plus 5–10 semantically related terms. This matches how search engines understand topics.
- **Validate volume estimates with multiple signals.** Search volume data from any single tool can be inaccurate by a wide margin. Cross-reference with Google Trends, Search Console impression data, and paid campaign data when available.
- **Revisit keyword research on a regular schedule (the original author suggests quarterly).** Search behavior shifts with trends, product launches, and algorithm updates. Re-run gap analysis each quarter to catch emerging opportunities.
- **Map every keyword to a specific URL or planned content piece.** Keywords without assigned content are wasted research. Maintain a keyword-to-URL mapping sheet as a living document.

## Edge Cases

- **Zero-volume keywords with high conversion intent.** Long-tail keywords like "best CRM for 3-person real estate teams" may show zero volume in tools but drive highly qualified traffic. Estimate value from related keyword clusters and business alignment rather than volume alone.
- **Branded competitor keywords.** Targeting "Zendesk alternatives" is a valid strategy, but the user should create genuinely comparative content rather than misleading pages. Some brands actively monitor and DMCA misuse of their trademarks.
- **Highly seasonal or trending keywords.** For topics driven by events (elections, product launches, holidays), standard volume averages are misleading. Use Google Trends to identify the spike window and plan content publication 4–6 weeks before the peak.
- **Multilingual or regional keyword variations.** The same product may be searched differently by region — "mobile phone" (UK) vs "cell phone" (US). Run separate research per locale and avoid assuming translation equivalence.
- **YMYL (Your Money or Your Life) topics.** Keywords in health, finance, and legal niches face stricter E-E-A-T requirements. Content must demonstrate author expertise and cite authoritative sources, or it will not rank regardless of keyword targeting.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Content brief writer](https://useaiblocks.com/skills/content-brief-writer). It takes the keyword list.
- The [Search intent keyword mapper](https://useaiblocks.com/skills/search-intent-keyword-mapper). It takes the plan.
- The [Keyword to post outline writer](https://useaiblocks.com/prompts/keyword-to-post-outline-writer). It takes the keyword list and plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
