---
name: write-product-titles-for-store-and-marketplaces
description: "Writes a set of titles for each product, one per channel: the store product title and SEO title, the Google Shopping feed title, the Amazon title and the title format for Indian marketplaces such as Flipkart, Myntra, Nykaa and Meesho, each built from the same checked attribute sheet and each within that channel's written rules (length, banned characters, repeated words, promotional text). Front-loads the words buyers search, keeps brand placement right per channel, and returns a sheet with character counts and a pass or fail rule check per title. Use when listing on a new channel, when titles were copied from the supplier, or when feed or marketplace titles get rejected or truncated."
---

# Product titles for store and marketplaces

**You get:** a title sheet with, for every product, a store title, an SEO title, a Google Shopping title, an Amazon title and an Indian marketplace title, each with its character count and a pass or fail check against that channel's rules, ready for the client to approve and upload by feed, flat file or seller panel.

## When to use

- The store is about to list on Amazon, Flipkart, Myntra, Nykaa or Meesho.
- Google Merchant Center or Amazon flags or rewrites titles.
- Titles are supplier codes or brand names that tell buyers nothing.
- One product has five different names across channels.

## Not for

- Rewriting Google feed titles from search term reports with feed rules: `write-product-feed-titles-that-match-searches` (it can start from this sheet).
- Full Amazon listings with bullets, backend terms and A+ content: `write-amazon-listing`.
- Choosing marketplaces or setting marketplace prices: `choose-next-marketplace` and `list-on-indian-marketplaces`.
- TikTok Shop listings: `optimize-tiktok-shop-listings`.

## What you need

Required (read access, level 1):

1. **Shopify products export**: Handle, Title, Vendor, Type, Tags, Option names and values, Variant SKU, barcode, and spec metafields.
2. **Attribute facts** per product: product type, brand, material, size or capacity, colour, count or pack size, key feature, who it is for.
3. **Search words**: Google Search Console queries per product, Shopify search terms, Google Ads search terms report, or Amazon search terms report if the store sells there. With none of these, use Google Keyword Planner (free with an Ads account) or marketplace search suggestions.
4. **Channel rules on the day**: Google's title specification, Amazon's title policy and the category style guide in Seller Central, and each Indian marketplace's listing guidelines from the seller panel.

Optional: current feed diagnostics, marketplace suppressed listings report, return reasons that show buyers misunderstood the product.

If a channel's current rules cannot be opened, do not write for that channel; note it. Uploading titles needs draft access (level 2) through the feed app, flat file or seller panel; the client approves before any change goes live.

## Before you start: the gates

1. **Attributes are true.** Every word in a title is backed by the attribute sheet. A title never claims a material, size, pack count or feature the product does not have. Fail: fix the data first.
2. **Rules are current.** The channel rules used are dated this month. Google allows titles up to 150 characters but shoppers usually see the first 70 or fewer, and bans promotional text, capitals for emphasis and symbols [GAD-6123]. Amazon, since January 2025, caps most categories at 200 characters with spaces, bans ! $ ? _ { } ^ ¬ ¦ unless in the brand, and allows no word more than twice [AMZ-6160]. Fail: recheck before writing.
3. **No rival brands as keywords.** Titles never include a competitor's brand name. Fail: remove it.
4. **Worth listing.** Products going to a marketplace have positive gross profit per order after that marketplace's fees (from `list-on-indian-marketplaces` or `build-sku-profit-sheet`). Fail: do not write the marketplace title.

## Steps

1. **Build the attribute sheet.** One row per product (and per variant where titles differ by variant), one column per attribute. Fill from the export and spec metafields. Mark gaps.
2. **Find the head term per product.** From search data, pick the phrase buyers use most for this product type ("cotton kurta set", "insulated water bottle"). Prefer the buyer's word over the store's internal name. Products with many ways to describe them give more long-tail room [AMZ-0003].
3. **Write the store title.** Human-readable, short: product name plus the one attribute that tells variants apart, usually 3 to 8 words. Example pattern: "Linen Shirt, Relaxed Fit". Brand names are usually not needed on the store's own pages.
4. **Write the SEO title.** Head term first, a key attribute, then brand: about 60 characters, matching the store's collection title style [SEO-0005]. Use wording from the fan-out searches assistants run, where known [AEO-0016].
5. **Write the Google Shopping title.** Order attributes by what buyers type: product type, material, colour, fit or size, key feature, then brand last unless the brand is well known and searched [GAD-0009]. Keep the matching words inside the first 70 characters; aim for about 100 to 120 characters total when there are enough true attributes. Lead with search terms proven in the store's own search term reports when available [GAD-0044]. Title, price and main image drive most Shopping performance in one agency's view [GAD-0019], so the title deserves this care. No price, sale or shipping words.
6. **Write the Amazon title.** Use the attribute order the category style guide gives; a common order is brand, product type, key feature, material, size, colour, pack count. Check character count with spaces, banned characters and repeated words. Check the category style guide in Seller Central, which can be shorter than 200. Pull extra search words into bullets and backend terms in `write-amazon-listing`, not into the title.
7. **Write the Indian marketplace title.** Flipkart, Myntra, Nykaa and Meesho often build or check titles from attribute fields; fill the attributes in the seller panel first, then write the title in the order the category template shows (usually brand, product type, key attributes, pack or size). Use the English buyer term plus common Indian terms where buyers use them ("kurta", "dupatta", "atta"). No claims like "best" or "No.1".
8. **Check every title.** For each channel: count characters, scan banned characters, count repeated words, scan for promotional words, compare against the attribute sheet. Record pass or fail.
9. **Roll out in waves.** Change titles in batches (for example the top 20% of products by sales first), then compare impressions, clicks and conversion for 2 to 4 weeks against the previous period before the rest; big title changes are best rolled out gradually [GAD-0044].
10. **US notes.** Amazon.com and Google US follow the rules above; state units in the system buyers use (oz, inches) with metric where the category expects both.

## Checks before you hand it over

- Every title word is backed by the attribute sheet.
- Every Google title is 150 characters or fewer, with the head term inside the first 70, and no promotional text or capitals for emphasis.
- Every Amazon title is within its category limit, has no banned characters and no word used three times.
- No competitor brand names anywhere.
- Marketplace titles exist only for products that pass the fee-adjusted profit gate.
- Each channel's rules source is dated this month.
- A rollout plan with a first wave and a read date exists.

## Output

**Summary (one screen):** products covered, channels, rules versions used, titles failing checks before rewrite and after, products held for missing attributes, and the first rollout wave.

**Title sheet:**

| Handle | Head term | Store title | SEO title (chars) | Google title (chars, first-70 check) | Amazon title (chars, banned chars, repeats) | India marketplace title (chars) | Pass or fail per channel |
|---|---|---|---|---|---|---|---|

**Attribute sheet:** handle, product type, brand, material, colour, size, pack, key feature, audience, source.

**Rules log:** channel, rule, limit, source link, date checked.

**Rollout plan:** wave, products, upload method, start date, read date, metric.

**Gaps:** products with a missing attribute (that attribute is left out of the title), products kept off a marketplace and why, one line each.

## Common mistakes

- **Keyword stuffing.** Step 8 counts repeated words; Amazon allows two at most.
- **Brand first on Google for an unknown brand.** Step 5 puts brand last unless searched.
- **Promotional words in feed titles.** Gate 2 and step 8 remove them.
- **Titles claiming attributes the product lacks.** Gate 1 ties every word to the sheet.
- **Changing every title at once.** Step 9 rolls out in waves.
- **Old rules.** Gate 2 requires rules dated this month.

## Sources

- GAD-6123: Google title limits, first 70 characters, no promotional text.
- AMZ-6160: Amazon's 2025 title rules.
- AMZ-0003: products with many descriptions have long-tail room.
- SEO-0005: collection title pattern of about 60 characters.
- AEO-0016: use assistant fan-out wording in titles.
- GAD-0009: Shopping title attribute order, brand last.
- GAD-0044: lead with proven search terms; roll out gradually.
- GAD-0019: title, price and image drive Shopping performance.

What makes this skill ours: every channel's title is built from one checked attribute sheet, so the product is described the same true way everywhere; each title carries a character count and a rule check against rules dated this month; marketplace titles are written only for products that make money after fees; and changes roll out in measured waves.
