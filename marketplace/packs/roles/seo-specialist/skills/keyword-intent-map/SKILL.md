---
name: keyword-intent-map
description: Builds a keyword map that groups searches by shared intent, checks each group against the live results page, scores groups by business value, chance of winning and effort, and assigns each group to one existing or new URL so pages do not compete. Use when a client needs a content or page plan, before a site rebuild, when two pages fight for the same query, or when a keyword tool export of thousands of terms needs turning into decisions.
---

# Keyword intent map

A keyword list is not a plan. A keyword map is: each group of searches that one page should answer, the intent behind it, the page that owns it, and the order to work on them. This skill turns raw keyword data and customer language into that map.

## When to use

- Planning content or new pages for a site.
- Before a redesign or new information architecture.
- When Search Console shows two URLs alternating for the same query (cannibalisation).
- When a client hands over a 5,000-row export and asks "what should we write?"

## What you need

**Access:** level 1 for every step, because the map is a document and changes nothing. Level 2 to save it in your shared folder or SEO tool. Level 3 to set up rank tracking for the groups in your SEO tool, within your unit limits.

1. **What the business sells**, to whom, in which countries or towns, and its margins or deal sizes by product line.
2. **Customer language:** reviews, sales call notes, support tickets, site search terms (any of these).
3. **Search Console query and page export** (last 12 months, ideally 16) so you start from what already gets impressions.
4. **Keyword tool export** (Ahrefs, Semrush or Google Keyword Planner) for seed topics, with volume, difficulty and current ranking URL.
5. **List of existing URLs** (sitemap or crawl).
6. **Competitors** the client loses customers to, plus the sites that rank where the client wants to rank (often different).

## Steps

### 1. Seed from the customer, not the tool
Write 10 to 30 seed topics from products, services, problems customers describe and questions sales hears. Add the client's existing Search Console queries with impressions. Only then expand seeds in the keyword tool. Remove terms the business cannot serve (wrong country, product it does not sell, jobs-to-be-done it cannot meet).

### 2. Clean
Remove duplicates, misspellings that the tool lists separately, and branded terms of competitors unless the client wants comparison pages. Tag branded versus non-branded.

### 3. Group by shared results, not by similar words
Two queries belong on one page if Google ranks mostly the same URLs for both. Practical method: for each candidate group, check the top 10 results of the head term and two or three variants. If four or more of the top 10 URLs overlap, keep them together. If not, split. Many keyword tools offer clustering by results overlap; spot-check their output on the groups that matter.

### 4. Label intent from the results page
For each group record: intent (informational, commercial investigation, transactional, navigational, local), the winning page type (guide, category page, product page, comparison, tool, location page), features shown (AI Overview, map pack, shopping, video, forums, "People also ask") and freshness. The page type Google ranks is the page type you need.

### 5. Score each group
Score 1 to 5 on each:
- **Business value:** how close the intent is to buying, times what a customer is worth. A small transactional group can beat a large informational one.
- **Chance of winning:** compare the client's site with the sites that rank (topic depth, links and mentions, page quality). A page of big brands and government sites is a 1.
- **Effort:** inverted (5 = easy). Updating a page that already ranks 8th is easier than a new page.
Add a note when an AI Overview answers the query fully on the results page: expect fewer clicks, so weigh the group for visibility and brand rather than traffic.

### 6. Assign each group to one URL
- If an existing page already gets impressions for the group, it owns the group. Improve it rather than starting again.
- If two existing pages split the group, pick the stronger one, merge the other into it and redirect.
- If no page fits, propose a new URL with page type and a working title.
- One primary group per URL. Secondary groups may sit on the same page only if the results overlap.

### 7. Order the work
Sort by total score, then group into waves: quick wins (existing pages in positions 5 to 20 with high value), core pages (money pages and categories), supporting content (guides that link to money pages), and later bets.

### 8. Plan internal links
For each money page, list the supporting pages that should link to it, with anchor text drawn from the group's main terms in natural phrasing.

## Checks before you ship

- Every group has exactly one owning URL; no URL owns two unrelated groups.
- Groups were checked against live results, not only tool clustering.
- Volumes are labelled as estimates; Search Console figures are labelled as actual impressions.
- Branded and non-branded terms are separated.
- The plan does not propose near-duplicate pages for each small wording variant or town name without real local substance; that risks scaled content abuse.
- Each wave has a rough effort estimate and an owner.

## Output format

A table (spreadsheet-ready), one row per group:

group name | primary query | example variants | monthly volume (estimate) | current impressions (Search Console) | intent | winning page type | SERP features | value | chance | effort | total | owning URL (existing or new) | action (improve, merge, create, skip) | wave

Then a short note: the top five moves, groups deliberately skipped and why, and the internal link plan for the top money pages.

## Example of good output (made for this kit, not a real client)

> | Group | Primary query | Intent | Winning page type | Features | Value | Chance | Effort | Owning URL | Action | Wave |
> |---|---|---|---|---|---|---|---|---|---|---|
> | Emergency boiler repair | emergency boiler repair leeds | Local, transactional | Service page | Map pack | 5 | 4 | 5 | /boiler-repair/leeds/ (ranks 9th) | Improve: add prices, response times, reviews | 1 |
> | Boiler pressure loss | boiler losing pressure | Informational | Guide, video | AI Overview, PAA, video | 2 | 3 | 4 | New: /guides/boiler-losing-pressure/ | Create; link to repair page | 3 |
> | Boiler service cost | boiler service cost | Commercial | Price guide | AI Overview | 4 | 3 | 4 | /boiler-service/ and /blog/service-prices/ split clicks | Merge blog post into service page, 301 | 1 |
>
> **Top moves:** fix the two merges in wave 1; improve the Leeds repair page, which already earns 1,900 impressions a month at average position 9.
>
> **Skipped:** "how do boilers work" (huge volume, pure information, results full of encyclopaedias and an AI Overview, no route to a booking).
