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

## How to run this skill

AI Blocks added these notes, and one line under Examples. The rest of the original skill below is unchanged. Where a note here disagrees with it, follow the note.

### What you need
Required:
- The seed topic, product or service.
- The target market and language.

Optional, and it makes the report better:
- What the content is for: blog posts, landing pages, product pages or paid campaigns.
- The site URL, and three to five rival sites, for the gap step.
- A keyword export from a keyword tool, or a Google Search Console export, for real numbers.

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

3. **Gather search metrics for each keyword.** Estimate monthly search volume, keyword difficulty (0–100 scale), cost-per-click for paid reference, and trend direction (rising, stable, declining). Pull click-through rate estimates where available. Note seasonal patterns — for example, "tax software" peaks in January–April while "sunscreen" peaks in May–July.

4. **Classify search intent for every keyword.** Categorize each keyword as informational (learn), navigational (find a specific site), commercial investigation (compare options), or transactional (buy/sign up). This mapping determines the correct content format: blog posts for informational, comparison pages for commercial, and product/landing pages for transactional.

5. **Perform competitor keyword gap analysis.** Identify 3–5 organic competitors and compare their ranking keywords against the user's current keyword portfolio. Highlight keywords where competitors rank but the user does not — these are content gap opportunities. Also flag keywords where the user ranks on page 2 (positions 11–20) that could move to page 1 with targeted optimization.

6. **Deliver a structured keyword strategy report.** Organize keywords into thematic clusters mapped to content pillars. Prioritize clusters by a composite score of volume, difficulty, intent alignment, and business value. Include specific content recommendations for each cluster — suggested titles, target word counts, and internal linking opportunities.

## Usage

Provide the agent with a seed keyword or topic, your website URL (optional, for gap analysis), and your target audience. The agent returns a full keyword research report with prioritized clusters and content recommendations.

**Prompt:** `Perform keyword research for the topic "AI-powered customer support" targeting SaaS companies in the US market. My site is https://supportbot.io.`

## Examples

All the figures, rankings and sites in the two examples below are invented to show the layout. They are not real data. Do not copy them into a report.

### Example 1: SaaS Product Keyword Research

**Request:** Research keywords for a project management SaaS product targeting remote teams.

**Keyword Table:**

| Keyword | Monthly Volume | Difficulty | CPC | Intent | Priority |
|---------|---------------|------------|-----|--------|----------|
| project management software | 40,500 | 78 | $12.40 | Commercial | Medium |
| best project management tools for remote teams | 3,600 | 45 | $8.20 | Commercial | High |
| how to manage remote team projects | 2,900 | 32 | $3.10 | Informational | High |
| free project management app | 8,100 | 62 | $6.50 | Transactional | Medium |
| asana vs monday vs trello | 5,400 | 55 | $9.80 | Commercial | Medium |
| remote team collaboration tools | 4,200 | 48 | $7.30 | Commercial | High |
| project management for startups | 1,800 | 28 | $5.60 | Commercial | High |
| kanban board software | 6,700 | 58 | $7.90 | Transactional | Medium |
| how to create a project timeline | 3,100 | 22 | $2.40 | Informational | High |
| project management best practices 2025 | 1,200 | 18 | $1.80 | Informational | High |

**Cluster Recommendation:** Group "best project management tools for remote teams," "remote team collaboration tools," and "project management for startups" into a **Remote Work Tools** content pillar. Create a comprehensive comparison guide (2,500+ words) as the pillar page, with supporting blog posts for each long-tail variation.

### Example 2: Content Gap Analysis

**Request:** Compare keyword portfolio of `supportbot.io` against competitors `intercom.com` and `zendesk.com`.

**Gap Analysis:**

| Keyword | supportbot.io Rank | intercom.com Rank | zendesk.com Rank | Opportunity |
|---------|-------------------|-------------------|------------------|-------------|
| ai chatbot for customer service | Not ranking | #4 | #7 | **Create new pillar page** |
| automated ticket routing | Not ranking | #8 | #3 | **Create feature page + blog post** |
| customer support metrics | #18 | #5 | #2 | **Optimize existing page — page 2 → page 1** |
| help desk software comparison | Not ranking | #6 | #1 | **Create comparison landing page** |
| reduce support ticket volume | #15 | #11 | #9 | **Update and expand existing content** |
| chatbot vs live chat | Not ranking | #3 | #12 | **Create informational blog post** |

**Recommendations:**
- Highest-impact opportunity: Create a pillar page targeting "ai chatbot for customer service" (3,600 vol, difficulty 42). Both competitors rank but neither holds position #1.
- Quick win: The page ranking #18 for "customer support metrics" needs updated statistics, expanded sections on CSAT and NPS, and 3–5 internal links from related content.

## Best Practices

- **Start with commercial and transactional intent keywords.** These drive revenue directly. Layer in informational keywords to build topical authority and capture top-of-funnel traffic over time.
- **Target keywords with difficulty scores below your site's Domain Authority.** A site with DA 30 should focus on keywords with difficulty under 35 to achieve realistic first-page rankings within 3–6 months.
- **Group keywords into clusters, not individual targets.** A single page should target a primary keyword plus 5–10 semantically related terms. This matches how search engines understand topics.
- **Validate volume estimates with multiple signals.** Search volume data from any single tool can be inaccurate by 30–50%. Cross-reference with Google Trends, Search Console impression data, and paid campaign data when available.
- **Revisit keyword research quarterly.** Search behavior shifts with trends, product launches, and algorithm updates. Re-run gap analysis each quarter to catch emerging opportunities.
- **Map every keyword to a specific URL or planned content piece.** Keywords without assigned content are wasted research. Maintain a keyword-to-URL mapping sheet as a living document.

## Edge Cases

- **Zero-volume keywords with high conversion intent.** Long-tail keywords like "best CRM for 3-person real estate teams" may show zero volume in tools but drive highly qualified traffic. Estimate value from related keyword clusters and business alignment rather than volume alone.
- **Branded competitor keywords.** Targeting "Zendesk alternatives" is a valid strategy, but the user should create genuinely comparative content rather than misleading pages. Some brands actively monitor and DMCA misuse of their trademarks.
- **Highly seasonal or trending keywords.** For topics driven by events (elections, product launches, holidays), standard volume averages are misleading. Use Google Trends to identify the spike window and plan content publication 4–6 weeks before the peak.
- **Multilingual or regional keyword variations.** The same product may be searched differently by region — "mobile phone" (UK) vs "cell phone" (US). Run separate research per locale and avoid assuming translation equivalence.
- **YMYL (Your Money or Your Life) topics.** Keywords in health, finance, and legal niches face stricter E-E-A-T requirements. Content must demonstrate author expertise and cite authoritative sources, or it will not rank regardless of keyword targeting.
