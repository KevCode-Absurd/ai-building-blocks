---
name: write-pmax-and-shopping-asset-text
description: "Writes the text for each Performance Max asset group in a store's account: headlines, long headlines, descriptions and business name, inside Google's counts and character limits, each group built around one product type and the words buyers search for it. First decides whether an asset group should carry text at all or run feed-only, then writes from the store's search terms, product facts and live offers, checks Google's editorial rules, and delivers an upload sheet per asset group. Use when launching Performance Max, splitting asset groups by product type, or when asset text is generic, repeated or out of date."
---

# Performance Max asset text

**You get:** one upload sheet per asset group with up to 15 headlines (30 characters, one of 15 or fewer), up to 5 long headlines (90), up to 5 descriptions (90), the business name, call to action and final URL, each with its character count and source, plus a one-screen note saying which asset groups should run with text and which feed-only.

## When to use

- A Performance Max campaign is being built or rebuilt with asset groups by product type.
- Asset text is one generic set copied across every asset group.
- Google shows low asset ratings or "Poor" ad strength on a text-led asset group.
- Prices, offers, delivery or the range changed and the text no longer matches.

## Not for

- Deciding whether Performance Max is working or where its money goes: use `google-pmax-diagnostics`.
- Feed titles and descriptions inside Merchant Center: use `write-product-feed-titles-that-match-searches`.
- Search campaign ads: use `write-google-responsive-search-ads`.
- Which products to push or pause in Shopping: use `google-shopping-product-tiers`.

## What you need

Required:

1. **Asset group list** with the listing group (products or product types) each one covers.
2. **Search terms insight** for the campaign (Insights tab, Search terms or categories) or, for a new campaign, the Search search terms report and Keyword Planner terms for each product type.
3. **Product facts** per product type: materials, sizes, uses, proof, prices, from `product-claims-profile` if it exists.
4. **Live offer and policy lines**: delivery times, returns window, payment options (cards, wallets, pay later, local methods, pay on delivery where offered), current promotion with dates.
5. **Gross profit per order** by product type.

Optional: current asset report with performance labels; image and video list per asset group (text must suit the images it will sit beside).

Writing needs read access (level 1); creating or editing asset groups needs draft access (level 2); the client approves before anything goes live.

## Before you start: the gates

1. **Gross profit per order by product type.** Pass when delivered costs are counted [MEA-0037]. Fail: write no discount or free-shipping text until `store-meta-math` gives the margin.
2. **Feed clean.** Disapproved or out-of-stock products in the listing group make any text pointless. Fail: send to `fix-merchant-center-disapprovals` first.
3. **Text or feed-only.** Decide per asset group in step 1 before writing. A feed-only group needs no text.
4. **One product type per asset group.** A group mixing unrelated products cannot have matched text; split asset groups by product type with matching listing groups [GAD-0046]. Fail: propose the split.

## Steps

### 1. Decide which asset groups get text

Text, images and video let Performance Max serve on YouTube, Display, Gmail and Discover as well as Shopping. Some practitioners run feed-only asset groups (no text, images or video, auto-generated assets off) so spend stays on Shopping and Search [GAD-0006] [GAD-0014], and switch to feed-only when spend drifts into YouTube and Gmail [GAD-0048]. Decide per group:

| Situation | Choice |
|---|---|
| No good video or lifestyle images, or past spend leaked to Display and YouTube with weak store sales | Feed-only: write nothing, note that auto-generated assets must be off |
| Strong images and video, a product type with a clear buyer problem, and tracking the client trusts | Full text, written below |
| Unsure | Full text for the top product type only, feed-only for the rest, read after 30 days |

Write the choice and reason in the summary. Google's minimum text counts apply to asset groups without a feed attached [GAD-6141], so a feed-attached retail group can run with less.

### 2. Gather the words per asset group

From search terms for that product type, list the 5 to 10 phrases buyers use: product words ("cotton pyjama set"), attribute words ("plus size", "for oily skin"), use words ("for office"), and gift words ("gift for her") if they appear. Google uses this text across many surfaces, so it should name the product type plainly, not only the brand.

### 3. Write to Google's counts

Google's specs per asset group [GAD-6141]:

| Asset | Limit | Write |
|---|---|---|
| Headlines | 30 characters, 3 to 15, 11+ recommended, one of 15 or fewer | 11 to 15 |
| Long headlines | 90 characters, 1 to 5, 2+ recommended, ideally 30+ characters | 5 |
| Descriptions | 90 characters, 2 to 5, 4+ recommended | 5 |
| Business name | 25 characters, must match the domain or verified business name | 1 |

Spread headlines across jobs: 3 product-type names in buyer words, 3 benefits, 2 proof, 2 offer or risk (delivery, returns, payment), 1 to 2 short call-outs of 15 characters or fewer ("Wide Fit Shoes"), 1 brand line.

Long headlines carry a full idea for Display and YouTube placements, where they often show alone: product type plus benefit plus proof, as one sentence.

Descriptions: one benefit, one proof, one offer and risk line, one who-it-is-for line, one use or care line.

### 4. Keep text true for every product in the group

Performance Max can pair any line with any product in the listing group. So:

- no single product's price in a headline unless every product in the group sells at or above it ("From 799" only if 799 is the lowest live price);
- no colour, size or material that some products lack;
- no "bestseller" unless the store's own sales data shows it for the group.

### 5. Match the business name and URL

Business name: exactly the domain or verified name, no promotion ("Store Name Sale" is refused) [GAD-6141]. Final URL: the collection page for that product type, not the homepage. If final URL expansion is on, note it, because Google may send people to pages the text was not written for.

### 6. Editorial and offer pass

Remove ALL CAPS, repeated phrases across assets, gimmicky punctuation and phone numbers [ADC-6142]. Check each offer line against the live site: delivery promise by region, returns window, payment terms, tax wording ("incl. VAT" in the UK and EU, "plus tax" in the US only if the site says so). No "was" price unless genuinely charged [OFF-6145].

### 7. Fit text to the images

For each asset group, read the image set. If images show the product on white, text can carry the use and benefit. If images show people using it, text can carry proof and offer. Never describe something the images or product do not show.

### 8. Market notes

- **Any market:** name payment ease where true ("Pay in 3 with Klarna", "PayPal accepted"); for each language your buyers use, add an asset group in that language only if the store's site serves that language, written or checked by a native speaker. Google counts characters the same across languages, with double-width scripts counting 2 [GAD-6141].
- **US:** shipping speed and free returns carry weight in Shopping; Google's store quality signals include shipping speed and cost and a 30-day-plus returns window [GAD-0018]. Write those lines only if true.

### 9. Plan the read

After 30 days, read asset performance labels and store orders by asset group. Replace Low-rated text, one swap per group. Judge the asset group on gross profit from store orders, not Google's reported ROAS alone; `google-pmax-diagnostics` does that read.

## Checks before you hand it over

- Each asset group is marked text or feed-only, with the reason.
- Text groups meet Google's counts, with at least one headline of 15 characters or fewer.
- Every character count is shown and within limits.
- No line names a price, colour, size or claim that is false for any product in the listing group.
- Business name matches the domain or verified name, with no promotion.
- Every offer, delivery and payment line matches the live site today.
- No ALL CAPS, repeats across assets or phone numbers.
- Nothing published; the sheet is marked for client approval.

## Output

**1. One-screen summary:** asset groups, product type and listing group for each, text or feed-only and why, lead angle per text group, page or feed fixes needed.

**2. Upload sheet per asset group:**

| Campaign | Asset group | Listing group | Final URL | Asset type | Text | Characters | Job | True for all products (Y/N) | Source |
|---|---|---|---|---|---|---|---|---|---|
| PMax Footwear | Wide fit running | product_type = wide-fit-running | /collections/wide-fit | Headline | Wide Fit Running Shoes | 22 | Product name | Y | search terms |
| PMax Footwear | Wide fit running | product_type = wide-fit-running | /collections/wide-fit | Long headline | Wide fit running shoes in sizes 6 to 12, with free returns for 30 days | 69 | Product + risk | Y | returns policy page |

**3. Settings note:** business name, call to action, final URL expansion on or off, auto-generated assets on or off (off for feed-only groups).

**4. Assumptions:** one line each, at most three, only where an unknown changes what to do. A fact with no source is left out.

## Common mistakes

- **One text set pasted into every asset group.** Step 2 writes from each product type's own search words.
- **Writing text for a group that should be feed-only.** Step 1 decides first.
- **A single product's price or colour in a shared headline.** Step 4 checks every line is true for every product in the group.
- **Promotional business name.** Step 5 keeps it to the domain or verified name.
- **Judging text by Google's ROAS.** Step 9 reads store gross profit.

## Sources

- GAD-6141: Performance Max text counts and limits, short headline, business name rule.
- GAD-0006, GAD-0014: feed-only asset groups keep spend on Shopping and Search.
- GAD-0048: switch to feed-only when spend drifts to YouTube and Gmail.
- GAD-0046: split asset groups by product type with matching listing groups.
- GAD-0018: Google store quality signals include shipping and a 30-day-plus returns window.
- ADC-6142: Google editorial rules.
- OFF-6145: a "was" price must be genuine.
- MEA-0037: margin from delivered cost.

What makes this skill ours: it decides text or feed-only per asset group before writing a word; every line is tested as true for every product in the listing group, not just the hero; payment, tax and delivery lines are checked for each market and region; and the text is judged on store gross profit, not Google's own ROAS.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Name payment ease where true ("COD and UPI available"); check COD and prepaid terms and "incl. GST" wording against the live site. For regional targeting, write the business name and product terms in English and add a Hindi or regional language asset group only if the store's site serves that language, handed to `write-ad-copy-in-indian-languages`.
