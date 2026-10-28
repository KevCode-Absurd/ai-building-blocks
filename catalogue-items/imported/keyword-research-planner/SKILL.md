---
name: seo-aeo-keyword-research
description: "Researches and prioritises keywords from the site context and live search intent, including problem queries, question queries, difficulty tiers, and a content map."
risk: safe
source: community
date_added: "2026-04-01"
---

# Keyword Research Skill

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Description
Activate this skill when the user wants to research, identify, or
prioritise keywords for a topic, niche, or website. Trigger phrases
include: "keyword research", "find keywords for", "what should I
rank for", "keyword analysis", "best keywords for [topic]",
"keyword strategy", "what are people searching for about [topic]",
"SEO keywords for [niche]".

---

## Input Format
```json
{
  "topic": "string — the subject to research keywords for",
  "business_type": "string — what the business or site does",
  "target_audience": "string — who the content is for",
  "content_goal": "rank | convert | educate | all",
  "location": "string — optional, country or city for local SEO",
  "intent_focus": "informational | transactional |
                   commercial | navigational | all",
  "competitor_urls": ["string — optional, up to 3 competitor URLs
                       to inform keyword gaps"],
  "user_keywords": ["string — optional keywords the owner already cares about"],
  "site_context": "string — optional audit findings, page list, or product description",
  "research_mode": "browser | api | both | unavailable — default both"
}
```

Start by asking the owner which keywords, products, audiences, locations, and business outcomes matter. If they do not know, derive provisional candidates from the site, audit findings, competitor language, and observed search results. Do not silently replace owner-supplied priorities with guessed keywords. If inputs are still missing after you ask, list what is missing at the top, then produce the full report anyway with every figure marked provisional.

Without browsing or a keyword tool, you cannot see competitor pages. In that case, leave out competitor keyword gaps, say so, and do not invent them.

## Live search-intent research

**Terms of use.** Looking at live search result pages and using keyword tools must follow each provider's terms of use. Use only the user's own browser session or their own keyword tool or account. Do not run automated scraping of search result pages. Ahrefs, SEMrush and Google Keyword Planner are optional tools, and Ahrefs and SEMrush are paid.

Use both browser research and available search/keyword APIs when the environment supports them. Prefer APIs for repeatable data and browser inspection for actual result-page intent, related questions, snippets, and current wording. If only one is available, state which source was used. If neither is available, perform semantic research only and mark volume, difficulty, rankings, and SERP observations as unverified.

For each important query, record:

- the exact query and market/device when known;
- dominant result intent: learn, compare, evaluate, buy, navigate, or troubleshoot;
- the problems and questions visible in results, related searches, and snippets;
- the content formats ranking: landing page, guide, comparison, tool, forum, video, or documentation;
- the conversion opportunity and the page that should own the query;
- the date/source and confidence level.

Prioritize problem-related queries that the product can genuinely solve. Search intent outranks attractive but irrelevant volume.

---

## Difficulty & Volume Rubric

**Important:** One rule for every number. If browser or keyword-API
data is available (see "Live search-intent research"), use it and
name the source next to each figure. Otherwise estimate from
semantic analysis and competitive signals and mark every volume,
difficulty and CPC figure as an unverified estimate. Never show an
estimate as measured data. Always validate with a live tool
(Ahrefs, SEMrush, Google Keyword Planner) before committing
to a full content strategy.

### Difficulty Scale

| Score  | Label       | Meaning                                              |
|--------|-------------|------------------------------------------------------|
| 0–20   | Easy        | Low competition, newer or niche keyword              |
| 21–40  | Moderate    | Some established content exists, beatable with quality |
| 41–60  | Competitive | Strong content exists, needs solid authority         |
| 61–80  | Hard        | Dominated by high-authority sites                    |
| 81–100 | Very Hard   | Reserved for the biggest players — avoid early on   |

### Volume Scale (Estimated Monthly Searches)

| Label       | Range              |
|-------------|--------------------|
| Very High   | 100,000+           |
| High        | 10,000–99,999      |
| Medium      | 1,000–9,999        |
| Low         | 100–999            |
| Very Low    | Under 100          |

### CPC Context

CPC (Cost Per Click) signals commercial value even for
organic content. Use it to prioritise keywords where
advertisers are spending — this means the intent is
likely transactional and conversions are valuable.

| CPC Range   | Signal                                               |
|-------------|------------------------------------------------------|
| $0–$1       | Low commercial value, good for awareness content     |
| $1–$5       | Moderate value, mix of info and commercial intent    |
| $5–$15      | High commercial value, strong conversion potential   |
| $15+        | Very high value — transactional, competitive space  |

---

## Output Structure

The skill must always produce output in this exact format:
```markdown
# Keyword Research Report

**Topic:** [topic]
**Business Type:** [business_type]
**Target Audience:** [target_audience]
**Content Goal:** [content_goal]
**Location:** [location or "Global"]
**Note:** All volume and difficulty figures are estimates.
Validate with a live keyword tool before final decisions.
When no browser or keyword API is connected, write "unverified estimate" in every Est. Volume, Difficulty and CPC cell. Do not show a bare number.

---

## Seed Keywords

Core terms that define the topic's search territory:

| Seed Keyword         | Est. Volume | Difficulty | CPC Est. | Intent          |
|----------------------|-------------|------------|----------|-----------------|
| [keyword]            | [label]     | [score]    | [$x]     | [intent type]   |
| [keyword]            | [label]     | [score]    | [$x]     | [intent type]   |
| [keyword]            | [label]     | [score]    | [$x]     | [intent type]   |

---

## Priority Keyword Tiers

### 🟢 Tier 1 — Target First (High Value, Achievable)
Low-to-moderate difficulty. Should anchor your first
wave of content.

| Keyword              | Est. Volume | Difficulty | CPC Est. | Intent        | Content Type to Create  |
|----------------------|-------------|------------|----------|---------------|-------------------------|
| [keyword]            | [label]     | [score]    | [$x]     | [intent]      | [landing page / blog]   |
| [keyword]            | [label]     | [score]    | [$x]     | [intent]      | [content type]          |
| [keyword]            | [label]     | [score]    | [$x]     | [intent]      | [content type]          |

---

### 🟡 Tier 2 — Build Toward (Medium Difficulty)
Competitive but winnable with topical authority.
Target after Tier 1 content is live.

| Keyword              | Est. Volume | Difficulty | CPC Est. | Intent        | Content Type to Create  |
|----------------------|-------------|------------|----------|---------------|-------------------------|
| [keyword]            | [label]     | [score]    | [$x]     | [intent]      | [content type]          |
| [keyword]            | [label]     | [score]    | [$x]     | [intent]      | [content type]          |

---

### 🔴 Tier 3 — Long-Term Goals (High Difficulty)
Dominated by high-authority sites. Do not target these
until significant topical authority is established.

| Keyword              | Est. Volume | Difficulty | CPC Est. | Intent        | Notes                   |
|----------------------|-------------|------------|----------|---------------|-------------------------|
| [keyword]            | [label]     | [score]    | [$x]     | [intent]      | [why it's hard]         |

---

## Long-Tail Keywords

Lower volume, lower difficulty, higher conversion rate.
These are your fastest wins.

| Long-Tail Keyword                    | Est. Volume | Difficulty | Intent        | Best For              |
|--------------------------------------|-------------|------------|---------------|-----------------------|
| [keyword]                            | [label]     | [score]    | [intent]      | [blog / landing page] |
| [keyword]                            | [label]     | [score]    | [intent]      | [content type]        |
| [keyword]                            | [label]     | [score]    | [intent]      | [content type]        |
| [keyword]                            | [label]     | [score]    | [intent]      | [content type]        |
| [keyword]                            | [label]     | [score]    | [intent]      | [content type]        |

---

## AEO Keywords

Question-based and conversational keywords that AI engines
surface in direct answers, featured snippets, and
People Also Ask boxes.

| AEO Keyword / Question                         | Est. Volume | Intent        | Answer Format to Use   |
|------------------------------------------------|-------------|---------------|------------------------|
| What is [topic]?                               | [label]     | informational | Definition sentence    |
| How does [topic] work?                         | [label]     | informational | Numbered steps         |
| What is the best [topic] for [audience]?       | [label]     | commercial    | Comparison table       |
| How much does [topic] cost?                    | [label]     | transactional | Direct number + range  |
| [topic] vs [alternative] — which is better?   | [label]     | commercial    | Comparison block       |
| Is [topic] worth it?                           | [label]     | commercial    | FAQ answer block       |
| [Common question your audience asks]           | [label]     | [intent]      | [format]               |
| [Common question your audience asks]           | [label]     | [intent]      | [format]               |

---

## LSI and Semantic Keywords

Related terms that reinforce topical authority.
Use these naturally throughout content —
do not force them as primary targets.

- [LSI term 1]
- [LSI term 2]
- [LSI term 3]
- [LSI term 4]
- [LSI term 5]
- [LSI term 6]

---

## Keywords to Avoid

These keywords are flagged as high-risk or low-ROI
for this topic and audience:

| Keyword              | Reason to Avoid                                        |
|----------------------|--------------------------------------------------------|
| [keyword]            | Wrong intent — attracts audience not looking to convert|
| [keyword]            | Too broad — dominated by global brands                 |
| [keyword]            | Cannibalises [other keyword] — similar enough to split traffic |
| [keyword]            | Seasonal — only relevant [month/period]                |

---

## Cannibalization Check

Keywords with enough overlap that two pages targeting
them would compete against each other:

| Keyword A            | Keyword B            | Risk Level | Resolution                          |
|----------------------|----------------------|------------|-------------------------------------|
| [keyword]            | [keyword]            | High/Med   | [which page should own which term]  |

If none detected: ✅ No cannibalization risks found.

---

## Keyword → Content Map

Recommended content to create based on this research,
in production order:

| Priority | Content Title                    | Target Keyword    | Content Type     | Goal              |
|----------|----------------------------------|-------------------|------------------|-------------------|
| 1        | [title]                          | [keyword]         | Landing Page     | Convert           |
| 2        | [title]                          | [keyword]         | Pillar Blog Post | Rank + Authority  |
| 3        | [title]                          | [keyword]         | Cluster Article  | Topical Depth     |
| 4        | [title]                          | [keyword]         | Cluster Article  | AEO / Snippet     |
| 5        | [title]                          | [keyword]         | FAQ Page         | AEO / Long-tail   |

---

## Quick Wins Summary

The 3 keywords to act on immediately:

1. **[keyword]** — [one sentence on why this is the best
   first target]
2. **[keyword]** — [one sentence on why]
3. **[keyword]** — [one sentence on why]
```

## Foundational Content Plan

Recommend between 5 and 10 foundational pages, defaulting to 10 when the topic has enough distinct intent. Include the landing page when it is a target page, then assign each page a problem, query, intent, conversion path, supporting evidence, and internal-link targets.

| # | Page / Article | Primary Query | Problem Solved | Intent | Conversion Path | Evidence |
|---|----------------|---------------|----------------|--------|-----------------|----------|
| 1 | [title] | [query] | [problem] | [intent] | [CTA/product page] | [source/confidence] |

Do not fill the table with near-duplicates to reach ten. If fewer than five distinct intents are defensible, explain why and ask whether the owner prefers a smaller foundation or broader adjacent topics.

## Search-Intent Evidence

| Query | Market / Date | Dominant SERP Intent | Ranking Formats | User Problem | Source | Confidence |
|-------|---------------|----------------------|-----------------|--------------|--------|------------|
| [query] | [market/date] | [intent] | [formats] | [problem] | [browser/API/semantic] | High/Med/Low |

---

## Execution Steps

1. Parse `topic`, `business_type`, `site_context`, and any
   `user_keywords` together to define
   the full semantic territory — not just the obvious
   head term but adjacent terms the audience uses
2. Generate seed keywords — 3–5 core terms that
   anchor the topic
3. Expand each seed keyword into long-tail variations
   using question formats, modifier patterns
   ("best", "how to", "for [audience]", "vs"),
   and location modifiers if `location` is provided
4. Generate AEO keyword list — convert the most common
   audience questions into direct-answer keyword targets
5. Generate LSI terms — identify semantically related
   vocabulary that reinforces topical authority
   without targeting directly
6. If live browser or API research is available, collect
   current search-intent evidence before estimating difficulty.
   Base any remaining estimate on
   keyword length, specificity, and likely
   competitive landscape
7. Estimate volume using the volume scale —
   shorter, broader terms get higher volume labels;
   longer, more specific terms get lower
8. Assign intent category to every keyword
9. Sort all keywords into Tier 1, 2, and 3
   based on difficulty and estimated volume
10. Run cannibalization check — flag any two keywords
    that are similar enough to split traffic if
    targeted on separate pages
11. Build Keywords to Avoid list — flag wrong-intent,
    too-broad, cannibalistic, and seasonal keywords
12. Build the Keyword → Content Map — recommend the landing page,
    5–10 foundational pages (default 10), supporting articles,
    and production order. Every page must own a distinct intent.
13. Mark which keyword choices require owner confirmation before
    content production and which are safe provisional fallbacks.
14. Verify keyword choices against the observed result pages, related searches, and the business context. Treat any difficulty estimate as directional unless it comes from an identified data source; do not present a heuristic as measured search volume or competition.

---

## What to do next
- Take the Keyword → Content Map to the Content brief writer to turn each keyword into a brief.
- Take a finished page to the On-page SEO tuner to tune it for its keyword.
- To see where you rank today, use the SEO auditor.

## When to Use

Use when selecting target queries, understanding search intent, or turning a business goal into a prioritised content map.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Content brief writer](https://useaiblocks.com/skills/content-brief-writer). It takes the keyword list.
- The [Keyword to post outline writer](https://useaiblocks.com/prompts/keyword-to-post-outline-writer). It takes the keyword list and plan.
- The [Store keyword validator](https://useaiblocks.com/skills/store-keyword-validator). It takes the keyword list.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations

- Search intent and competition change over time; directional research must be validated against current result pages and available first-party data.
