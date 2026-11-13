---
name: protect-brand-search-terms
description: "Sets up the cheapest way to keep buyers who search a store's name: first measures whether anyone is really taking those searches (rivals, resellers, marketplaces, coupon sites, affiliates), then builds a capped brand Search campaign and a low-bid brand Shopping campaign, keeps the brand out of Performance Max and non-brand campaigns, and adds a weekly watch list and a trademark complaint path for rivals using the name in their ads. Includes a holdout test to check whether brand ads add sales at all. Built paused for the client's yes. Use when a rival shows up on the store's name, when brand spend creeps up, or when nobody knows whether brand ads are needed."
---

# Protect your brand searches

**You get:** a brand protection plan for one store: an evidence table of who appears on its name, a paused brand Search and brand Shopping build with caps, the brand exclusions for every other campaign, a weekly brand watch sheet, and a trademark complaint pack if a rival uses the name in ad text.

## When to use

- A rival, reseller or marketplace listing shows above the store when someone searches its name.
- Brand cost per click or brand spend has crept up, or brand takes a growing share of the Google budget.
- Performance Max or a non-brand campaign is quietly buying brand searches and looks better than it is.
- The owner asks "do we even need to pay for our own name?"

## Not for

- Building non-brand Search: use `build-google-search-campaign`.
- Measuring how much brand traffic Performance Max takes in detail: use `google-pmax-diagnostics`.
- Legal action over a trademark: this skill prepares Google's own complaint form only; anything further goes to a trademark lawyer.
- Brand protection on Amazon: use `set-up-brand-registry-and-store`.

## What you need

Required (read access):

1. **Google Ads exports, last 90 days**: Search terms report (Search term, Campaign, Clicks, Cost, Conversions, Conv. value) and Auction insights for any brand campaign (Display URL domain, Impression share, Overlap rate, Position above rate, Top of page rate).
2. **Brand term list**: the store name, common misspellings, the name with product words, and any sub-brand or hero product names.
3. **Gross profit per purchase** from `store-meta-math`.
4. **Who sells the brand**: own store, Amazon, Flipkart or other marketplaces, wholesalers, affiliates, and their agreed rules on bidding.
5. **Trademark status**: registered or not, in which countries.

Optional: Google Search Console brand queries (impressions and clicks, free), screenshots of the brand search results on mobile in the main cities served.

If there is no brand campaign yet, Auction insights is missing; take dated screenshots of the results page for the top five brand searches, on mobile, from the main markets, at three times of day.

Access: draft access (level 2) to build the paused campaigns and exclusions. The client approves each campaign and any complaint before it is filed.

## Before you start: the gates

1. **Is there brand demand?** At least a few hundred brand searches a month in Search Console or the search terms report (practitioner default). Fail: skip the brand campaign, just add brand negatives to other campaigns, and recheck in three months.
2. **Profit known.** Gross profit per purchase is known, so the brand CPC cap can be set.
3. **Tracking.** One primary purchase action with real values [MEA-0017]. Fail: fix it first; the holdout in step 7 depends on it.
4. **Trademark facts.** Know whether and where the name is registered before promising any complaint. No legal rulings here.

## Steps

### 1. See who takes the brand searches

From Auction insights and the screenshots, list every domain on brand searches and sort each into one type:

| Type | What it means | Response |
|---|---|---|
| Rival bidding on the name, own ad text | Allowed by Google; they are buying a keyword [GAD-6120] | Brand campaign at top position |
| Rival using the store's name in ad text | Can be restricted after a trademark complaint [GAD-6120] | Complaint pack, step 6 |
| Reseller or marketplace listing | Often allowed if their page mainly sells the product and says they resell | Agree bidding rules in the reseller or affiliate terms |
| Coupon or deal site | Takes buyers who were about to buy | Brand ad with the real current offer or a clear "no codes needed" line, only if true |
| Nobody | Organic result is alone | Test whether brand ads are needed, step 7 |

### 2. Measure the cost of doing nothing

For each brand term: monthly searches, share where a rival shows above the store, and the store's organic click rate from Search Console. Lost buyers a month (rough) = brand searches x share with a rival above x a loss rate. Use 10% as the loss rate until the holdout in step 7 gives the store's own figure (practitioner default, test it). Lost gross profit = lost buyers x conversion rate x gross profit per purchase. This is the most the brand campaign should cost.

### 3. Build the brand Search campaign

- Keywords: brand terms in exact and phrase; brand plus product words in their own ad group.
- Ads: headline 1 is the store name; one headline with the real offer or proof (reviews count, delivery promise) taken from the live site; sitelinks to best sellers, new arrivals, reviews and returns. India: show "Cash on delivery" or prepaid offers only if live.
- Bidding: Target impression share, absolute top, 90 to 95%, with a max CPC cap, or manual CPC with a cap. One agency runs brand at 95% absolute top with a cap around 3 dollars [GAD-0024]; set the store's cap from step 2, never above break-even CPA x brand conversion rate.
- Budget: never limited on brand. Brand spend usually sits around 3 to 8% of Google spend [GAD-0024], and $10 to $20 a day is a common start for smaller brands [GAD-0028]; it rises legitimately when rivals bid hard. One brand's holdouts put branded search under 1% of spend [ADC-0051]; the store's own test decides.
- A higher ROAS target than non-brand is fine, but if rivals bid aggressively a high target can lose the top slot [GAD-0052]; prefer the impression share strategy then.

### 4. Build the brand Shopping campaign

Standard Shopping, all products, manual CPC around a low cap (one practitioner uses about 1 dollar), with non-brand terms as negatives, so brand product searches show the store's own listings cheaply [GAD-0027]. Set the cap from the store's own brand Shopping cost per purchase after 30 days.

### 5. Keep the brand out of everything else

- Performance Max: add the store's brand list as a brand exclusion; it covers Search and Shopping inventory [GAD-6121] [GAD-0003].
- Non-brand Search and Shopping: shared negative list of brand terms in exact match [GAD-0028].
- Check the brand list picks up other spellings and scripts; Google's brand lists match across languages, which helps for Hindi or regional-script searches in India [GAD-6121]. Add separate entries for sub-brands that share no word with the store name.
- If the brand name is also a common word, use negative keywords instead of a brand exclusion, so real non-brand searches are not blocked.

### 6. Prepare the trademark complaint pack (only for ad-text use)

When a rival puts the store's name in their ad text:
- Collect dated screenshots of the ad, the advertiser's domain, the country and the search.
- Note the trademark registration number and country.
- Fill Google's trademark complaint form for those advertisers and countries. Google restricts trademark use in ad text by direct competitors after a valid complaint; it does not stop keyword bidding [GAD-6120].
- The client files it or approves filing. If the store has no registered trademark, say so and stop here.

For resellers and affiliates, add a bidding clause to their terms: no bidding on the brand name, no brand in display URLs. This is a business agreement, not a Google rule.

### 7. Test whether brand ads add sales

Brand ads often take sales that the organic result would have won. Test before deciding the long-term budget:
- Only when no rival appears on brand searches.
- Turn brand Search off in a set of regions and keep it on in matched regions for about 3 to 4 weeks; large brands test brand search this way [MEA-0033]. Small stores can switch it off for alternate weeks instead (practitioner default, test it).
- Compare total store orders from brand-search regions, not Google-reported conversions.
- If total orders do not fall, keep brand ads paused while no rival appears and watch weekly. If they fall, keep the campaign and set the budget from the measured lift.

### 8. Watch weekly

Every week: brand impression share, top of page rate, new domains in Auction insights, brand CPC, brand spend as a share of Google spend, and brand terms leaking into non-brand search terms. Recent days under-count conversions, so read brand cost per purchase by conversion time [GAD-0035].

## Checks before you hand it over

- Every domain on brand searches is typed, with a dated screenshot or Auction insights row.
- The brand CPC cap is worked from gross profit, not copied from a benchmark.
- Brand terms are excluded from Performance Max and negative in every non-brand campaign.
- The complaint pack is used only for ad-text use, with trademark details confirmed.
- Ad claims (offers, reviews counts, delivery promises) match the live site today.
- A holdout plan exists, or the reason it cannot run (a rival on the name) is written down.
- Everything is paused until the client says yes.

## Output

1. **One-screen summary:** who takes brand searches today, lost gross profit a month if nothing is done, the recommended brand set-up and its monthly cap, and whether to run the holdout.
2. **Brand search evidence table:** Search term, Monthly searches, Domain, Type, Position above rate, Screenshot date, Response.
3. **Build sheet:** Campaign, Ad group, Keyword, Match type, Bid strategy, Max CPC cap, Daily budget, Status (Paused).
4. **Exclusion sheet:** Campaign, Brand exclusion list or Negative list, Terms, Applied (yes or no).
5. **Complaint pack:** Advertiser domain, Ad text, Country, Date, Trademark number, Filed by.
6. **Weekly brand watch sheet:** Week, Brand impression share, Top of page rate, New domains, Brand CPC, Brand share of spend, Leaks found, Action.

## Common mistakes

- **Paying top CPC for a name nobody contests.** Step 7 tests whether brand ads add orders.
- **No cap.** Smart Bidding can pay far more for a brand click than it is worth [GAD-0027]; step 3 caps it.
- **Brand inside Performance Max.** It inflates Performance Max results [GAD-0003]; step 5 excludes it.
- **Filing complaints against keyword bidding.** Google does not restrict that [GAD-6120]; step 6 is for ad text only.
- **Ignoring coupon sites and affiliates.** Step 1 types them and step 6 sets rules.
- **Judging the holdout on Google numbers.** Step 7 reads total store orders.

## Sources

- ADC-0051: one brand's holdouts put branded search under 1% of spend.
- GAD-0003: brand inside Performance Max inflates its results.
- GAD-0024: brand spend share and absolute top impression share with a cap.
- GAD-0027: low-bid brand Shopping, separate from prospecting.
- GAD-0028: brand negatives everywhere; typical brand budgets.
- GAD-0035: read recent days by conversion time.
- GAD-0052: high brand ROAS targets can lose the slot to rivals.
- GAD-6120: Google trademark policy, keywords versus ad text.
- GAD-6121: brand exclusions and how brand lists match.
- MEA-0017: one primary purchase action.
- MEA-0033: switching brand search off by region to test it.

What makes this skill ours: it first proves who is taking brand searches and what that costs in gross profit before spending anything; it splits rivals, resellers, coupon sites and affiliates into different fixes; it uses Google's own trademark rule correctly (ad text, not keywords); and it tests whether brand ads add any orders at all, judged on store sales.
