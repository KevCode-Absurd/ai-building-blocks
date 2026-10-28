---
name: seo-aeo-content-cluster
description: "Builds a topical authority map from business goals, search intent, existing content, and gaps, then prioritises foundational and supporting pages."
risk: safe
source: community
date_added: "2026-04-01"
---

# Content Cluster Skill

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **A shortlist** (yours): the selected options, with the reasons and criteria used.
- **A keyword list** (yours): the search keywords, with what each searcher wants and, if known, volume and difficulty.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A keyword list** with the [Search intent keyword mapper](https://useaiblocks.com/skills/search-intent-keyword-mapper). Bring your question, a shortlist (optional), a plan (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Description
Activate this skill when the user wants to build topical authority around
a subject by mapping out a pillar page and its supporting cluster articles.
Trigger phrases include: "build a content cluster", "create a topic map",
"content pillar strategy", "what should I write about for [topic]",
"cluster: [topic]", "generate a content strategy for [niche]".

---

## Input Format
```json
{
  "pillar_topic": "string — the main subject to build authority around",
  "primary_keyword": "string — the keyword the pillar page targets",
  "target_audience": "string — who this content is for",
  "existing_content": ["string — titles of pages/posts already published"],
  "target_keywords": ["string — additional keywords to work into the cluster"],
  "cluster_size": "integer — foundational pages to generate, 5–10, default 10",
  "search_intent_evidence": "string — optional browser/API research",
  "conversion_goal": "string — what the content should move readers to do"
}
```

If you already have a ranked shortlist of customer-question keywords, use it as `target_keywords` and as the first candidates for cluster articles.

For a new website, produce 5–10 foundational pages, defaulting to 10 only when there are at least 10 distinct, defensible search intents. Do not create near-duplicate pages to hit the default. Every page must solve a problem, own a query, and lead to a relevant product or next step.

---

## Output Structure

The skill must always produce output in this exact format. The tables below show 8 example rows. Produce 5 to 10 article rows in total, spread over the three priority tiers, and make the Internal Link Map list the same number of articles:
```markdown
## Pillar Page

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| Title              | [Pillar page title with primary keyword]   |
| Primary Keyword    | [keyword]                                  |
| Search Intent      | informational / transactional / commercial |
| Target Audience    | [audience]                                 |
| Page Type          | Pillar — comprehensive, high-level guide   |
| Word Count Target  | 2500–4000 words                            |
| AEO Priority       | High — this page anchors the whole cluster |

---

## Cluster Articles

### Priority 1 — Write These First
These articles build the foundation. Highest search volume if volumes were supplied, otherwise your best estimate (say so). Clear intent.

| # | Title                        | Target Keyword       | Intent          | Content Type     | Links To         |
|---|------------------------------|----------------------|-----------------|------------------|------------------|
| 1 | [Article title]              | [keyword]            | informational   | how-to guide     | Pillar Page      |
| 2 | [Article title]              | [keyword]            | informational   | explainer        | Pillar Page      |
| 3 | [Article title]              | [keyword]            | commercial      | comparison       | Pillar Page      |

---

### Priority 2 — Write These Second
These deepen authority. Medium volume (or estimated), long-tail focus.

| # | Title                        | Target Keyword       | Intent          | Content Type     | Links To         |
|---|------------------------------|----------------------|-----------------|------------------|------------------|
| 4 | [Article title]              | [keyword]            | informational   | listicle         | Art. 1, Pillar   |
| 5 | [Article title]              | [keyword]            | transactional   | case study       | Art. 3, Pillar   |
| 6 | [Article title]              | [keyword]            | informational   | FAQ page         | Art. 1, Art. 2   |

---

### Priority 3 — Write These Last
Long-tail reinforcement. Lower volume (or estimated), high conversion intent.

| # | Title                        | Target Keyword       | Intent          | Content Type     | Links To         |
|---|------------------------------|----------------------|-----------------|------------------|------------------|
| 7 | [Article title]              | [keyword]            | transactional   | review           | Pillar Page      |
| 8 | [Article title]              | [keyword]            | informational   | glossary         | Art. 2, Art. 4   |

---

## Internal Link Map

Pillar Page
├── Article 1 → links back to Pillar
├── Article 2 → links back to Pillar
├── Article 3 → links back to Pillar, links to Article 1
├── Article 4 → links to Article 1, Pillar
├── Article 5 → links to Article 3, Pillar
├── Article 6 → links to Article 1, Article 2
├── Article 7 → links to Pillar
└── Article 8 → links to Article 2, Article 4

Rule: Every cluster article must link back to the Pillar Page.
Rule: No orphan articles — every article links to at least one other article.

## Foundational Page Plan

| # | Page / Article | Problem Solved | Primary Query | Intent | Product CTA | Supporting Links |
|---|----------------|----------------|---------------|--------|-------------|------------------|
| 1 | [title] | [problem] | [query] | [intent] | [CTA] | [targets] |

Use this section for the first publishing wave. The landing page, foundational pages, and later cluster articles must not compete for the same intent.

## 20-Day Editorial Calendar

| Day | Topic / Title | Target Query | Search Intent | Article Format | Internal Link Target | External Distribution Candidate |
|-----|---------------|--------------|---------------|----------------|----------------------|--------------------------------|
| 1 | [title] | [query] | [intent] | [format] | [page] | [Medium/Hashnode/dev.to/other] |

Create 20 distinct topics after the foundation is mapped. Prefer topics that answer real questions, solve problems, support the product, and can be linked back to a foundational page.

---

## Content Gap Analysis

Topics the cluster covers that competitors likely miss:
- [Gap 1 — underserved angle on the pillar topic]
- [Gap 2 — long-tail question with no strong existing answer]
- [Gap 3 — AEO opportunity: question AI engines commonly surface]

Topics to deliberately exclude from this cluster
(belong to a different cluster):
- [Out-of-scope topic 1]
- [Out-of-scope topic 2]

---

## AEO Cluster Signals

At least 2 cluster articles must be structured as direct-answer pages:
- One FAQ page targeting 8–10 questions around the pillar topic
- One "What Is" explainer with a clean definition as the opening sentence

Direct-answer pages like these are a common format for AI-generated answers.
No result is promised.

---

## Cluster Health Checklist

- [ ] Pillar page defined with clear keyword and intent
- [ ] 5–10 foundational pages generated, default 10 when justified
- [ ] Every article has a unique target keyword (no overlap)
- [ ] Every article assigned a content type
- [ ] Every article linked back to the Pillar Page
- [ ] No orphan articles in the link map
- [ ] At least one FAQ page in the cluster
- [ ] At least one comparison or case study article
- [ ] Content gap section completed
- [ ] Every foundational page has a distinct search intent and conversion path
- [ ] 20-day editorial calendar completed without cannibalizing existing pages
```

---

## Content Types Available

When assigning content types, use only from this list:

| Type           | Best For                                        |
|----------------|-------------------------------------------------|
| how-to guide   | step-by-step processes                          |
| explainer      | concept definitions and overviews               |
| listicle       | roundups, tools, resources                      |
| comparison     | X vs Y, best options                            |
| case study     | real-world application, results                 |
| FAQ page       | question clusters, AEO targeting                |
| review         | product or service evaluation                   |
| glossary       | terminology, definitions, long-tail keywords    |
| opinion/take   | thought leadership, contrarian angles           |

---

## Execution Steps

1. Read `existing_content` — mark any titles that already exist
   so the cluster doesn't duplicate them
2. Identify the pillar topic's full semantic territory —
   what questions, angles, and sub-topics surround it
3. Run a content gap pass — what angles are underserved
   or missing entirely in this space
4. Assign each subtopic a unique keyword with no overlap
   between articles or with the pillar keyword
5. Classify each subtopic's search intent before assigning content type
6. Sort all subtopics into Priority 1, 2, and 3 tiers
   based on foundational relevance and on search volumes the user pastes
   from their own keyword tool. If no volumes are given, say the tiers
   are estimates and do not state any volume figure. Never invent one
7. Build the 5–10-page foundational plan before expanding to the 20-day calendar
8. Build the internal link map — verify no orphan articles exist
9. Flag the 2 highest AEO-opportunity articles in the cluster
10. Complete the content gap section and editorial calendar before outputting

---

## Connected Skills
- Receives output from: `seo-aeo-keyword-research`
- Feeds output to: `seo-aeo-blog-writer`, `seo-aeo-internal-linking`

## When to Use

Use when planning a pillar page, foundational pages, and supporting articles around a product, service, or topic.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Title and meta tag writer](https://useaiblocks.com/skills/title-and-meta-tag-writer).
- The [On-page SEO tuner](https://useaiblocks.com/skills/on-page-seo-tuner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations

- A content map is a prioritisation aid, not measured demand or a guarantee that every proposed topic will rank.
