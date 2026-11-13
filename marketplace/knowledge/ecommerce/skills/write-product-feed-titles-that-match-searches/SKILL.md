---
name: write-product-feed-titles-that-match-searches
description: "Rewrites a store's Google Merchant Center feed titles and descriptions from the words buyers really search, taken from the store's own Shopping and Performance Max search terms, Search Console and Keyword Planner, so products show for more of the right searches. Sets one title pattern per product type, puts searched words in the first 70 characters, keeps every title inside Google's rules, and ships the change as a supplemental feed or feed rules without touching the store's own product pages. Rolls out in two halves so the lift can be read. Use when Shopping impressions are low, titles are copied from the manufacturer or Shopify, or after search term mining finds words the feed lacks."
---

# Product feed titles that match searches

**You get:** a supplemental feed sheet (Item ID, new title, new description, product type) for the chosen products, one title pattern per product type with the searched words it is built from, a rules check on every row, and a two-half rollout plan with the date to read results.

## When to use

- Shopping or Performance Max impressions are low for products that should sell.
- Feed titles are the Shopify product name ("The Aurora") or a manufacturer code.
- `google-search-term-mining` found buyer words that no title contains.
- A new product type is going into Shopping and needs a title pattern.

## Not for

- Titles for the store's own pages, Amazon or Indian marketplaces: use `write-product-titles-for-store-and-marketplaces`.
- Disapproved products: fix them first with `fix-merchant-center-disapprovals`.
- Choosing which products to push: use `google-shopping-product-tiers`.
- SEO keyword mapping for collection pages: use `keyword-research-for-collections-and-products`.

## What you need

Required (read access):

1. **Feed export** from Merchant Center: Item ID, Title, Description, Brand, Product type, Google product category, Color, Size, Material, Gender, Age group, Custom labels.
2. **Search terms, last 90 days**: Shopping search terms report and Performance Max search term insights (Search term or category, Impressions, Clicks, Conversions, Conv. value).
3. **Item performance, last 90 days**: Item ID, Impressions, Clicks, Cost, Conversions, Conv. value.
4. **Product facts**: what each product is made of, sizes, use, who it is for, from the product page or `product-claims-profile`.

Optional: Search Console queries (free) for product and collection pages; Keyword Planner volumes for 20 to 50 seed terms; one rival's Shopping listings for the same product, screenshot.

If there is no search term history (new account), build patterns from Search Console and Keyword Planner, and mark them "unproven" until 30 days of data exist.

Access: draft access to add a supplemental feed or feed rules in Merchant Center; the client approves before it is linked to the live feed.

## Before you start: the gates

1. **Feed health.** Fewer than 5% of target products disapproved (practitioner default). Fail: run `fix-merchant-center-disapprovals` first; better titles cannot help a product that does not show.
2. **Profit.** Gross profit per product known or a store-wide margin, so effort goes to products that earn.
3. **Rules.** Every title must pass Google's title rules [GAD-6123]. Nothing in a title may claim a property the product does not have.
4. **Brand strength.** If buyers search the brand or model first (well-known brands, electronics), the pattern keeps brand first [GAD-0009]. Decide this before writing.

## Steps

### 1. Choose the products

Start with products that have impressions but a low click-through rate against their product type, and products with stock and good gross profit but few impressions. Leave products with steady sales and strong click-through alone in the first round.

### 2. Pull the buyer words

From the search terms, keep queries with clicks or conversions and group them by product type. For each group, list:
- **Product type words** buyers use (for example "kurta" versus "tunic", "water bottle" versus "flask").
- **Attribute words**: material, colour, size, fit, capacity, pack count.
- **Use and buyer words**: "for men", "for office", "for gym", "for kids".
- **Words that never convert** (to keep out).

India: keep the words buyers type, including Hinglish and transliterated terms ("cotton kurta for men", "steel bottle 1 litre"). Use regional-language words only where buyers really search them and the page shows them. US: include sizing systems and spelling buyers use (colour versus color follows the market).

Search terms reports show the words of shoppers who saw an ad, not everyone; check top groups against Keyword Planner volume before building a pattern on them.

### 3. Set one pattern per product type

Default order for generic or unbranded goods: product type, then the key attributes buyers search (material, colour, size or fit), then the key feature or use, brand last [GAD-0009]. Put searched words in the first 70 characters, because buyers usually notice only the first 70 or fewer [GAD-6123]. Write titles for matching, not prose: adjective, product, who it is for, selling point, use, specifics [GAD-0017].

| Product type | Pattern | Example shape |
|---|---|---|
| Apparel, own brand | Type, material, fit, colour, size, brand | Men's linen kurta, regular fit, white, size M, Storename |
| Home goods | Type, material, size, feature, brand | Brass bedside table lamp, dimmable, touch control, Storename |
| Consumables | Type, key benefit word only if allowed, size or count, brand | Green tea, 100 bags, Storename |
| Known brand or model | Brand, model, type, key spec | Brand Model X wireless earbuds, 30 hour battery |

Keep the same order across the whole product type, so the pattern stays consistent.

### 4. Write titles and descriptions

- Titles: 1 to 150 characters, aim about 120, searched words first [GAD-6123] [GAD-0009]. No price, sale words, shipping or delivery text, company slogans, capital letters for emphasis or symbols [GAD-6123]. Variant details (size, colour) must match the landing page.
- Descriptions: up to 5,000 characters, with the most useful details in the first 160 to 500, no promotional text, no links, no comparisons with other products (Merchant Center Help, description attribute). Lead with what it is, what it is made of, who it is for and how it is used.
- AI-written descriptions must be submitted the way Google asks for AI-generated text (the structured description attribute marked as algorithmic media), per Merchant Center Help. Every fact must still come from the product page.
- Never stuff terms the product does not match; that lowers click-through and can trigger policy issues [GAD-0017].

### 5. Ship through the feed, not the store pages

- Build a supplemental feed (a Google Sheet works, free) with Item ID, title, description and product type, linked to the primary feed. This overrides fields without touching Shopify.
- Or use Merchant Center feed rules, for example: title = product type + material + colour + size + brand, from existing attributes.
- Check the store's Google channel app or feed app does not overwrite the supplemental feed on its next sync.

### 6. Roll out in two halves and read the lift

- Split chosen products into two matched halves by past impressions. Switch half A first, half B four weeks later. Rewrite gradually rather than all at once [GAD-0044].
- After four weeks, compare half A against half B and against its own previous four weeks: impressions, click-through rate, conversions and gross profit per product.
- Keep the change if gross profit per product rose; revert or rewrite where impressions rose but click-through fell (wrong searches).
- Title, image and price drive most Shopping results [GAD-0019]; if titles do not move a product, look at the main image and price next.

## Checks before you hand it over

- Every title is 150 characters or fewer, with searched words in the first 70.
- No title or description contains price, sale, shipping or delivery text, caps for emphasis, links or symbols.
- Every attribute in a title (size, colour, material, capacity) matches the landing page.
- Each pattern lists the search terms it was built from, with clicks or volume.
- AI-written descriptions are flagged the way Google requires.
- The supplemental feed will not be overwritten by the store's feed app.
- The rollout plan has two halves, dates and a read date; nothing is linked live without the client's yes.

## Output

1. **One-screen summary:** products changed, patterns used, the top five search words added, rollout dates and the read date.
2. **Pattern sheet:** Product type, Pattern, Search terms used, Clicks or volume, Words kept out.
3. **Supplemental feed sheet:** Item ID, Old title, New title, Characters, New description (first 500 characters shown), Product type, Half (A or B), Rules check (pass or fail).
4. **Feed rules list** (if rules are used instead): Rule, Attribute, Source fields, Example output.
5. **Results sheet for week 4:** Item ID, Half, Impressions before and after, Click-through rate before and after, Conversions, Gross profit, Keep or revert.

## Common mistakes

- **Brand first on an unknown brand.** Nobody searches it yet; step 3 puts it last [GAD-0009].
- **Keyword stuffing.** Step 4 keeps only words the product matches.
- **Sale text in titles.** Google does not allow it [GAD-6123]; offers go in their own attributes.
- **Changing every title at once.** Step 6 rolls out in halves so the lift can be read [GAD-0044].
- **Editing Shopify product names for Google.** Step 5 uses a supplemental feed so the store's pages stay written for people.
- **Judging on impressions.** Step 6 judges on gross profit.

## Sources

- GAD-0009: title order, searched attributes first, brand last for generic goods.
- GAD-0017: titles written for matching, built from searched terms.
- GAD-0019: price, title and image drive most Shopping results.
- GAD-0044: lead with proven search terms, roll changes out gradually.
- GAD-6123: Google's title length and content rules.

What makes this skill ours: patterns come from the store's own converting search terms, checked against volume; changes ship as a supplemental feed so store pages stay written for people; the rollout is split in halves and judged on gross profit per product; and India's Hinglish and transliterated search words are kept where buyers really use them.
