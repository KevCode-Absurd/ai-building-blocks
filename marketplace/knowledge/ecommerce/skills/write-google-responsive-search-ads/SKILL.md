---
name: write-google-responsive-search-ads
description: "Writes Google responsive search ads for a store: fifteen headlines and four descriptions per ad group, each within Google's character limits, pinned only where a line must always show, and matched word for word to the keywords and the landing page the ad sends people to. Builds every line from the store's real search terms, product facts, prices and policies, checks them against Google's editorial rules, and delivers an upload-ready sheet with character counts and display paths. Use when building or refreshing a Search campaign, when ad strength is poor, or when click-through is weak on non-brand terms."
---

# Google responsive search ads

**You get:** an upload sheet with, for each ad group, 15 headlines (30 characters max) and 4 descriptions (90 max), two display paths, pin settings, character counts and the landing URL, plus a one-screen summary of the angle per ad group, ready for the client to approve and paste into Google Ads or Google Ads Editor.

## When to use

- A new Search campaign needs ads for each ad group (the structure comes from `build-google-search-campaign`).
- Ads show "Poor" or "Average" ad strength, or headlines repeat each other.
- Non-brand click-through is low, or the ad promises something the page does not show.
- Prices, offers, delivery promises or policies changed and the old ads are now wrong.

## Not for

- Choosing keywords, match types or the campaign structure: use `build-google-search-campaign` or `google-keyword-tiers`.
- Performance Max or Shopping text: use `write-pmax-and-shopping-asset-text`.
- Finding new search terms and negatives: use `google-search-term-mining`.
- Fixing Quality Score from the page side: use `google-quality-score-triage`.

## What you need

Required:

1. **Ad group list** with keywords per group (Google Ads Editor export or the campaign plan).
2. **Search terms report**, last 30 to 90 days: Search term, Ad group, Clicks, Conversions, Cost. These are the buyer's own words.
3. **Landing URL per ad group** and the live page: its headline, price, offer, delivery and returns lines.
4. **Product facts file** (from `product-claims-profile` if it exists): what is proven, what is banned.
5. **Gross profit per order** for the products in each group (see the gates).

Optional: past ad asset report (Asset, Performance label, Impressions, CTR), competitor ads seen on the results page, review highlights.

If the search terms report is missing (new account), use the keyword list plus Keyword Planner terms and say the ads are built on planned, not proven, terms. Writing needs read access (level 1). Loading the ads paused needs draft access (level 2). The client approves before any ad goes live.

## Before you start: the gates

1. **Gross profit per order known.** Pass when product cost, shipping, fees and returns are counted [MEA-0037]. Fail: do not put a discount or "free shipping" line in any headline until `store-meta-math` gives the number. Copy can still be written for price-neutral angles.
2. **Page matches.** Each landing URL is live, in stock, and shows the price and offer the ads will name. Fail: write for a page that works, or stop that ad group and say why.
3. **One theme per ad group.** If one group mixes unrelated intents (for example "gift for dad" and "bulk wholesale"), the ads cannot match both. Fail: hand back to `build-google-search-campaign` with the split.
4. **Category rules.** Health, supplements, alcohol, finance-like claims (pay later, EMI) and medical words carry extra policy limits. Run `check-ad-copy-for-policy-and-claims` on the final bank if any apply.

## Steps

### 1. Read each ad group's intent in the buyer's words

Sort the search terms in the group by conversions, then clicks. Write down:

- the 3 to 5 phrases buyers actually type (keep their wording, plurals and spelling);
- the job behind them: problem ("heel pain shoes"), product ("ceramic frying pan"), comparison ("X vs Y"), price ("under 2000"), or gift ("gift for wife");
- what the page must show for that buyer to stay.

Ads written to the problem a buyer typed can lift click-through on cold traffic; one agency saw about 8% CTR on problem queries with problem-led copy [GAD-0025]. Treat that as one account's result, not a target.

### 2. Plan the 15 headlines as five jobs

Google allows up to 15 headlines of 30 characters and 4 descriptions of 90 [GAD-6140]. Fill them on purpose, not to hit the count. Give each headline one job, three of each:

| Job | Count | Rule |
|---|---|---|
| Keyword match | 3 | The group's main term, close to how buyers type it. At least one headline carries a keyword [GAD-6140]. |
| Benefit or result | 3 | What changes for the buyer, in plain words, only from proven facts. |
| Proof | 3 | Review count and rating, years in business, a test result, a named material. Only numbers the store can show today. |
| Offer and risk | 3 | Price or "from" price, delivery time, returns window, COD or warranty. Only what the page shows. |
| Call to action or call-out | 3 | "Shop men's sizes 6 to 12", "Order by 2pm, ships today". |

Every headline must read well on its own and next to any other, because Google mixes them [GAD-6140]. No headline should depend on the one before it.

### 3. Write the 4 descriptions

Each 90 characters or fewer, each a full sentence:

1. Main benefit plus the keyword idea.
2. Proof: the strongest checkable fact.
3. Offer and risk reversal: price, delivery, returns, payment options.
4. Who it is for, or the reason to buy now (only a real reason: a real end date, a real restock).

### 4. Decide pinning

Default: no pins. Google says pinning hurts ad strength for most advertisers and that pinning every slot stops other lines showing [GAD-6140]. Pin only when:

- a line must always show (a required disclaimer, a regulated claim's qualifier): pin it to headline 1, headline 2 or description 1, the slots that always show [GAD-6140];
- brand rules require the brand name first.

When you pin, put 2 or 3 different lines on that slot, never one [GAD-6140].

### 5. Decide how many to load

Write all 15 and 4. Then choose:

- **Ad group with 30 or more conversions a month:** load all 15 and 4. Google advises as many unique headlines as possible [GAD-6140].
- **Low-volume group:** one practitioner loads about 8 headlines and 2 descriptions so combinations get real impressions [GAD-0052]. Load the 8 strongest across the five jobs, keep the rest as spares for the next refresh. Practitioner default, test it.

Run two ads per ad group with different angles and their own landing URL where the page allows, as Google suggests [GAD-6140].

### 6. Display paths and landing match

Two paths of up to 15 characters each, from the keyword: `/running-shoes/wide-fit`. Then check three-way match: the main keyword appears in headlines, in the path, and in the page's first screen. If the page headline does not say what the ad says, flag the page fix to the page owner rather than bending the ad away from the search.

### 7. Run the editorial pass

Google disapproves misused capitals, gimmicky punctuation or repetition, extra spaces, phone numbers in ad text and ads that do not name the business or product [ADC-6142]. Remove:

- ALL CAPS words (a trademark styled in capitals is the exception), "!!!", "FREE FREE";
- the same phrase repeated across headlines in the group;
- any line a buyer would not understand without the others.

Then cut machine-sounding phrasing with `machine-copy-scrubber` if the draft was AI-written.

### 8. Price and offer truth

- Prices: in India say whether GST is included; quoted prices should include charges that apply to most buyers [ADC-6147]. In the US, write "plus tax" only if the page does.
- "Free shipping" or "free delivery" only if it is free for the buyers the ad reaches, or state the line ("Free delivery over 999").
- "COD available" only if COD is live for the pincodes the campaign targets.
- No "was" price unless that price was genuinely charged [OFF-6145].
- Delivery promises ("ships today", "2-day delivery") must match the courier's real times for the target region.

### 9. Brand and non-brand ads stay apart

Brand ad groups can lead with the store name and returns or delivery promises. Non-brand groups lead with the buyer's problem or product words; the brand name goes lower or into the path. Keep brand terms out of non-brand groups as negatives [GAD-0028].

### 10. Plan the read

Judge headlines on store results, not CTR alone. CPA equals CPC divided by conversion rate, so a headline that lifts CTR but brings worse buyers raises cost per order [GAD-0038]. After about 30 days, read the asset report: replace lines rated Low with spares from step 5, one change per group per round.

## Checks before you hand it over

- Every headline is 30 characters or fewer and every description 90 or fewer, counted with spaces, with the count shown.
- Each ad group has 15 headlines and 4 descriptions written, with the load choice stated.
- At least 3 headlines carry the group's keyword in the buyer's words.
- Every number, price, delivery time and policy matches the live page today.
- No pins, or 2 to 3 lines per pinned slot with the reason given.
- No ALL CAPS, repeated phrases, phone numbers or exclamation runs.
- Any headline read alone, in any order, still makes sense.
- Nothing was loaded live; the sheet is marked for client approval.

## Output

**1. One-screen summary:** ad groups, the buyer intent for each, the lead angle, the load choice (15/4 or 8/2), pins used, and anything the page must fix to match.

**2. Upload sheet** (one row per asset, works in Google Ads Editor):

| Campaign | Ad group | Final URL | Path 1 | Path 2 | Asset type | Text | Characters | Job | Pin | Load now (Y/N) | Source of fact |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Search NB | Wide fit running shoes | /collections/wide-fit | running-shoes | wide-fit | Headline | Wide Fit Running Shoes | 22 | Keyword | none | Y | search terms report |

**3. Spare bank:** unloaded headlines and descriptions, tagged by job, for the 30-day refresh.

**4. To confirm:** any fact that needs the client's yes (a delivery promise, a review count date).

## Common mistakes

- **Filling 15 headlines with near-copies.** Step 2 gives each line a separate job.
- **Headlines that only work in order.** Step 2 requires each to stand alone, because Google mixes them.
- **Pinning everything to control the message.** Step 4 pins only what must always show, with 2 to 3 options.
- **Offers the page does not show.** The page gate and step 8 tie every offer to the live page.
- **Judging on CTR.** Step 10 reads cost per order through conversion rate.
- **One ad for a mixed ad group.** The theme gate sends it back for a split.

## Sources

- GAD-6140: RSA limits (15 x 30, 4 x 90), pinning advice, unique headlines, two ads per group.
- GAD-0052: one practitioner loads 8 headlines and 2 descriptions so combinations get tested.
- GAD-0025: problem-led copy on problem queries reached high CTR in one account.
- GAD-0028: keep brand and non-brand apart with brand negatives.
- GAD-0038: CPA = CPC / conversion rate, so CPC and CTR alone mislead.
- ADC-6142: Google editorial rules on capitals, punctuation, repetition, phone numbers.
- ADC-6147: quoted prices should include charges most buyers pay (India).
- OFF-6145: a "was" price must be one genuinely charged.
- MEA-0037: gross margin uses delivered cost, not product cost.

What makes this skill ours: headlines are planned as five jobs built from the store's own search terms report rather than a template list; the load choice (15/4 or 8/2) follows the ad group's conversion volume; every offer, delivery and COD line is checked against the live page and target region; and lines are judged on cost per order, not click-through.
