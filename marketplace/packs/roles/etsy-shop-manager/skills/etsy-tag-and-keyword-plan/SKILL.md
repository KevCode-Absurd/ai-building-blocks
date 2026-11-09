---
name: etsy-tag-and-keyword-plan
description: Builds a shop-wide tag and keyword plan for an Etsy shop from its own Etsy Stats search terms, Marketplace Insights results and buyer messages - phrases grouped by product type and buyer need (gift, colour, occasion, recipient), which listings use which phrases, which tags to drop, and which shop sections the groups suggest. Works with web search connected (checks live Insights and Etsy's help pages) or without it (works from the screenshots the owner supplies). Use before a listing rewrite, when visits fall, or when tags were copied from a competitor.
---

# Etsy tag and keyword plan

Tags work best when they are the phrases real buyers type, spread across the shop so listings do not all compete for the same words. This skill finds those phrases in the shop's own data and assigns them, so every one of 13 tag slots per listing earns its place.

Access levels for this skill: reading Stats, Insights and listings is level 1, usually from screenshots, because Etsy's Shared access does not reach Stats (as of November 2026). Writing the plan is level 2. Applying tags to listings is level 3 within the agreed limits, normally through the etsy-listing-rewrite skill.

## When to use

- Before rewriting listings.
- Visits from Etsy search have fallen year over year.
- Tags were copied from another shop, or most listings share the same tags.
- A new product type is joining the shop.

## What you need

- **Access I have:** level and limits.
- Etsy Stats screenshots: "How shoppers found you", Etsy search terms for the last 90 days and the same period last year, listing views, favourites and orders.
- Marketplace Insights results for the shop's main product types (15 keyword searches a week on the standard tier as of November 2026; the owner may need to run them over two weeks).
- The listings CSV with current tags.
- Buyer messages and reviews, for the words buyers use.
- **Research mode.** With web search connected, check Etsy's help pages on tags and attributes for changes before starting. Without it, work from what the owner supplies and say which facts you could not recheck.

## Steps

1. **Collect phrases.** List every search term from Stats with its visits, and every term from Insights with its search and listing counts. Add buyer words from messages and reviews ("for my sister", "matches our tiles").
2. **Clean the list.** Merge spelling variants and plurals into one line. Remove phrases that describe items the shop does not sell, and brand or trademark terms the shop has no right to use.
3. **Group by product type.** Mugs, bowls, vases; or prints, cards, stickers.
4. **Tag each phrase by buyer need.** What it is, style, material or colour, use or room, recipient, occasion, personalisation.
5. **Mark the strength of each phrase.**
   - *Proven:* brought visits and orders in Stats.
   - *Promising:* high searches with relatively few listings in Insights.
   - *Crowded:* many listings for the searches.
   - *Unknown:* buyer words with no data yet.
   Do not invent search volumes; quote only what Stats and Insights show.
6. **Check attributes first.** For each group, list the attributes the category offers. Any phrase an attribute covers (a plain colour, a material) goes in the attribute, freeing a tag slot.
7. **Assign phrases to listings.** Each listing gets: the lead buyer phrase for its title, and 13 tag phrases mixing proven, promising and long-tail. Spread phrases so near-identical listings do not all carry the same 13 tags. Keep each tag within 20 characters.
8. **List tags to drop.** Single generic words, phrases already covered by attributes, phrases describing other sellers' products, and phrases that brought views but never favourites or orders over a long period.
9. **Suggest sections.** Strong groups often make good shop sections (by product type, occasion or recipient).
10. **Set the review.** Recheck the plan after 30 days and at the same point next year, using the same Stats views.

## Checks

- Every phrase comes from Stats, Insights, or buyers' own words; none is invented.
- Volumes and counts are quoted exactly as the tools showed them, with dates.
- No other brand's trademark is used as a tag.
- Attributes carry the terms they can, before tags.
- Each listing has 13 different tags, each within 20 characters.
- Near-identical listings do not all share the same tags.
- The plan says which data was missing and what was assumed.

## Output format

1. **Phrase table:** phrase, product group, buyer need, strength, source (Stats or Insights, with date), visits or counts as shown.
2. **Attribute map:** per group, the attributes to set.
3. **Listing assignment:** listing, lead phrase for the title, 13 tags.
4. **Drop list:** current tags to remove, with the reason.
5. **Section ideas.**
6. **Gaps and assumptions.**

## Example of good output (short)

*Illustrative structure, not a real business: a print shop. Copy the shape, never the content: every fact comes from the client's own context.*

| Phrase | Group | Need | Strength | Source |
|---|---|---|---|---|
| botanical print set | Prints | What it is | Proven | Stats, Aug to Oct 2026: 212 visits, 9 orders |
| kitchen wall art | Prints | Room | Promising | Insights, 2 Nov 2026: many searches, fewer listings |
| gift for gardener | Prints | Recipient | Unknown | Three buyer messages |
| green | Prints | Colour | Use attribute | Colour attribute covers it |

**Drop list:** "art" (single generic word); "print" (covered by the category); "watercolor painting" (the shop sells giclée prints, not original paintings).

**Gaps:** no Insights data for cards yet; the owner will run four searches next week.
