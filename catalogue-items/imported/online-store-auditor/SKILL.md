---
name: store-audit
description: Use when reviewing an online store as a whole — homepage, category pages, channel mix, or trust — e.g. "review my store", "audit my homepage", "Instagram or Google Ads?", "should we say we're a small team", "how should we label recommendations", "carousel or grid", "how do we look more trustworthy", "should we sell on Amazon too". For one product page, use product-page; for cart or checkout, use checkout-ux.
---

# Store audit

Make the site-wide calls that depend on what you sell and what kind of company you are. Most follow from one classification, so classify first.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your website** (yours): the link to your site or the page.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your website. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Where marketing budget goes (social, search, comparison sites, marketplaces)
- Homepage/category layout, carousels, recommendation labels, visual style
- Which trust signals to show
- Whether to list on a marketplace

## When not to use

- A single product page → `product-page`
- A cart, checkout, or payment form → `checkout-ux`
- Shipping, returns, loyalty, retargeting → `post-purchase`
- Prices or discounts → `pricing` / `discounts`

## Inputs

Collect, or state your assumption:

- The product and who buys it (for the classification)
- Company size and whether the product is high-tech
- Current channel mix, homepage layout, recommendation label
- Gross margin; any verifiable sustainability practice; marketplace presence

> **Classify the product first.** *Hedonic* = bought for enjoyment, pleasure, or the experience (chocolate, fashion, decor, travel, spa, perfume). *Utilitarian* = bought to do a job, judged on function and value (detergent, appliances, insect repellent, tools, accounting software). If it's mixed, decide by what the buyer is optimizing for at the moment of purchase.

## Procedure

> Added by AI Blocks: effect sizes below come from specific studies, named after each rule and listed in full in reference.md (in this folder). A dagger means no primary source is on file, so it is a practitioner tip. Your store may see a different result. Show which figures are measured and which are tips, and do not present any as a promise.

Work in this order: classify the product (if the store sells both kinds, classify each product group, run the rules for each group, and give one overall call only when one group makes most of the revenue), go through rules 1 to 9 and skip any that do not fit, then write the priority table.

1. **Channels by product type.** Hedonic → social media and your own product pages; the journey is impulsive and starts on social. Utilitarian → search ads, comparison sites, third-party reviews, deal sites; the buyer compares for value. (Source: Li et al. 2020.)
2. **Recommendation labels.** The label must say who really chose the products. Utilitarian → an algorithm-based label ("Recommended based on your browsing") fits, because buyers trust machines on function. Hedonic → buyers prefer human picks, so if this matters, have real people choose or review a pick list and label that ("Picked by our team"). Never put a human label on picks an algorithm made: that misleads the buyer. If the picks stay algorithmic, keep an honest algorithm label or a neutral one ("You might also like"). Ask who makes the picks before you recommend a label. (Source: Longoni & Cian 2020.)
3. **Layout direction.** Horizontal (carousel) makes people weigh quality and the primary feature — 26% more chose the pricier, higher-quality laptop. Vertical (scroll) makes them price-sensitive. Horizontal where quality should win, vertical where you compete on price. (Source: Mukherjee 2022.)
4. **Visual style.** Structured (straight lines, symmetry, geometry) reads reliable; unstructured (rounded, incomplete, unpredictable) reads fun. Match the brand: matched perfume ads got 39% more clicks. † (Practitioner tip, no primary source.)
5. **Cost transparency.** If margin ≤ ~55%, show a per-product cost breakdown (materials, labor, shipping, packaging, development); group beyond ~8 categories. Sales were 22% higher for a $115 wallet with one. (Source: Mohan, Buell & John 2020.)
6. **Company size.** Small, low-tech → say so prominently; buyers infer motivated staff and better quality. Small, high-tech → show R&D effort. Large, low-tech → show employee passion. (Source: Woolley, Kupor & Liu 2022.)
7. **Warranty.** Offer one far longer than the category norm (10-year hoodie): 34.8% more bought (UNVERIFIED: attributed to a Journal of Business Research study, but the authors are not on file in reference.md. Do not quote this figure without checking the study). Best for buyers who know the category but not your brand. For consumables, the equivalent would be an unusually strong effectiveness or satisfaction guarantee, but that is untested. Only offer a warranty or guarantee you can honour. Check it against real product results first.
8. **Sustainability.** Only state a sustainability claim if you hold evidence for it, such as a certification or supplier records. Check local advertising and green-claims rules before you put it on packaging. If it is real, state it on product and packaging. One unsourced figure says 6.4% higher revenue across 10 million grocery sales, and that people enjoy the product more when they know. Small businesses may gain most. † (Practitioner tip, no primary source. Do not quote the number.)
9. **Marketplaces.** If unknown, list on a major marketplace: 1 in 71 marketplace sales creates a direct customer; acquisition cost averages 24% of revenue vs 30–100% direct. Give a reason to switch, within marketplace rules. (Source: Maier & Wieringa 2021.)

## Output

Table: priority, area, recommendation, rule + number. Then what to leave alone, and why.

## Next steps

Start with the top row of the priority table and change one thing at a time. For a weak area, run a focused review: product-page (Product page auditor), checkout-ux (Checkout page auditor), post-purchase (Post-purchase experience) or pricing (Pricing strategist). If one is not in your library, ask for a review of that part on its own.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Online store pricing planner](https://useaiblocks.com/skills/price-position-planner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common mistakes

- Removing an "algorithm" label as fake — for utilitarian products it outperforms. For hedonic products, add real human curation before you use a human label; never relabel algorithm picks as human.
- Calling carousels weak in general — direction sets whether quality or price wins.
- Choosing search over social on intent alone — the rule is product type; hedonic starts on social.
- Hiding that you're small — for low-tech products it raises perceived quality.
- Hiding costs to protect margin — the effect holds to 55%.

## Quick reference

| Situation | Do |
|---|---|
| Hedonic | Social + product pages; human-curated recs, labeled as such (only if people really pick them) |
| Utilitarian | Search, comparison, review, deal sites; algorithm-labeled recs |
| Quality should win / price should win | Horizontal / vertical layout |
| Margin ≤ 55% | Cost breakdown, ≤ 8 categories |
| Small, low-tech / small, high-tech | Say you're small / show R&D |
| Unknown brand | Extraordinary warranty; marketplace listing |

† No primary citation on file for this rule — a practitioner tip, not a measured finding.

Evidence and effect sizes: see [reference.md](reference.md).
