---
name: plan-peak-sale-week
description: "A day-by-day operating plan for one big sale (Black Friday and Cyber Monday, Diwali, an end-of-season sale or a brand's own sale day): ad budget by channel per day, which creative runs when, every email, SMS and WhatsApp send, stock and warehouse checks, and written cost guards that say when to scale, hold or cut. Starts from break-even at each discount depth, cash and stock, sets build-up spend weeks before the sale, pre-builds an offer ladder, and ends with an after-sale read on store orders. Use three to six weeks before a peak sale, or when a sale is planned without a budget or a stock check."
---

# Peak sale week plan across channels

**You get:** one sale-week calendar from build-up to after-sale: for each day the offer, the ad budget per channel, the creative live, every email, SMS and WhatsApp send, the stock check and the cost guard, with an owner per line, ready for the owner to approve.

## When to use

- Black Friday, Cyber Monday, Diwali, Republic Day, Independence Day or a brand sale is three to six weeks away.
- The discount is chosen but nobody has planned spend, sends and stock day by day.
- Last year's sale made revenue but lost money, sold out early or broke the warehouse.
- Ads, email and site banners are run by different people and need one calendar.

## Not for

- Choosing how deep the discount can go: use `how-deep-can-we-discount` first; this plan uses its result.
- Writing the ads for the season: use `seasonal-gifting-creative-plan`.
- Writing the email copy: use `write-sale-countdown-emails`.
- Planning which sales to run across the year: use `plan-yearly-sale-calendar`.

## What you need

Required (read access, level 1):

1. **Sale facts** from the owner: dates, offer per product, discount depth, any gift or bundle, end time and time zone.
2. **Gross profit per order at each discount depth**, from `how-deep-can-we-discount` or `store-meta-math`.
3. **Last year's sale**: Shopify orders by day and hour, ad spend by channel by day, email and SMS revenue by send.
4. **Stock** per sale SKU (on hand, inbound and date) and **warehouse capacity**: orders per day the team or 3PL can pick and pack, and the courier pickup limit.
5. **Cash**: balance and payouts expected through the sale and two weeks after.
6. **Lists**: email and SMS subscriber counts, WhatsApp opted-in count, and approved WhatsApp templates.

Optional: the Meta, Google and TikTok accounts at read access, last year's returns from the sale, and customer service staffing.

If gross profit at the sale price is missing, stop and get it; a sale cannot be paced without it. Drafting campaigns, emails and banners needs draft access (level 2). Turning anything on, sending to customers or raising spend needs the owner's yes for each.

## Before you start: the gates

1. **Break-even at the sale price.** Recompute break-even ROAS for every discount depth; required ROAS rises steeply as margin falls [OFF-0069]. Fail: the offer loses money on paid orders; go back to `how-deep-can-we-discount`.
2. **Stock covers the plan.** Each hero SKU must have stock for the sale plus the weeks after, while ads still run. Selling out into December can empty the ad account and force a slow restart [OPS-0019]. Fail: lower that SKU's spend or move it out of the offer.
3. **Warehouse can ship it.** Forecast peak orders per day against pick and pack capacity. A 24 to 48 hour pick promise can slip to seven days at peak; get the promise in writing [OPS-0015]. Fail: cap daily orders through spend or extend the delivery promise on the site.
4. **Cash covers build-up spend.** Build-up spend is paid weeks before sale revenue. Fail: shorten the build-up, not the sale.
5. **Messaging rules.** SMS in India needs DLT-registered templates; WhatsApp marketing needs approved templates and opt-in; US SMS needs consent. Fail: hand off to `sms-and-whatsapp-compliance-setup` and plan email only.

## Steps

### 1. Fix the phases and dates

Write the calendar backward from the sale end:

| Phase | Typical length | Job |
|---|---|---|
| Build-up | 2 to 4 weeks before | Warm new buyers, grow lists |
| Tease and early access | 3 to 7 days before | Subscribers and VIPs first |
| Sale days | 1 to 5 days | Harvest |
| Last chance | final 24 to 48 hours | Real deadline only |
| After-sale | 1 to 3 weeks | Shipping, returns, cheaper media |

India: Diwali moves each year; set the sale to end before the last courier cutoff that still delivers before the festival, and plan gifting buyers earlier. US: Black Friday to Cyber Monday, then Christmas shipping cutoffs.

### 2. Pre-build the offer ladder

Decide the main offer and two fallbacks (deeper discount, gift, free shipping, bundle) with creative and pages ready before the sale, each with its own break-even [OFF-0068]. When unit cost is low, buy-one-get-one can earn far more per order than the same-looking 50% off [OFF-0066]. Subscribers on a subscription get a better members' offer, or they cancel to buy the public deal [OFF-0043]. The deadline must be real and kept; no countdown timer that resets.

### 3. Set build-up and sale budgets

- Do not go dark before the sale. One agency puts 31 to 43% of September-to-December spend into September and October, with November near 1.8 times October [ADC-0048]. Use this for Black Friday stores with cash to fund it; Diwali stores apply the same idea to the 3 to 4 weeks before.
- Build-up spend looks weak in real time: in November the gap between 1-day and 30-day click revenue roughly doubles [ADC-0046], and lift from pre-sale spend keeps showing after it stops [MEA-0034]. Judge build-up on new customers and list growth, not same-day ROAS.
- Sale-day budget is a ceiling, not a target. Peak reach is rarely exhausted; a stall usually means offer fatigue [ADC-0044].
- Google often gets less efficient over Black Friday while Meta improves; prepare feeds and promotions rather than raising Google on inflated ROAS [GAD-0050].
- Plan a cheap after-sale push: 16 to 31 December was the cheapest Meta auction of the quarter in one account [ADC-0043].

### 4. Plan the creative

- Keep evergreen campaigns running (about 50 to 60% of spend) and add offer-badged copies of past winners [MCR-0069].
- Count offer ads from what one ad can hold per day: a peak day needs enough winners, not enough ads [MCR-0070]. Rescale the ceilings to the store's own last peak.
- Brands ramping ad volume can hit Meta's per-page ad limit; check it before the ramp [ADC-0045].
- Do not read creative winners from sale days; product discount drives ROAS then. Read at ad set level on CTR and CPC [MCR-0068].

### 5. Schedule every send

Per day: email to which segment, SMS or WhatsApp to which opted-in segment, and the site banner. Rules (practitioner default, test it):

- Early access to subscribers and past buyers first.
- At most one SMS or WhatsApp per day in sale days, more only to people who clicked.
- Exact terms in every send: what is off, on what, until when.
- Copy goes to `write-sale-countdown-emails`; banners to `design-sale-banners-and-hero`.

India: send in the buyer's language where the store has one; submit WhatsApp templates early enough for approval.

### 6. Write the stock and operations line per day

For each hero SKU and day: forecast units, units left, and the action when stock falls below the reorder lead time (raise its target or pause its ads) [ADC-0023]. Add warehouse orders per day against capacity, courier pickup times, and support staffing. Vet the 3PL on peak throughput and a named contact [OPS-0008]. India: confirm COD orders before shipping on sale days, since failed deliveries cost two shipping legs.

### 7. Write the cost guards before the sale

- Scale on a 3-day rolling read of marginal contribution after ads: improving, raise; flat, hold; two poor reads, cut [ADC-0050].
- Set each platform's own account or campaign spending limit as a hard stop at the approved daily ceiling.
- Hourly pacing only for large accounts: spend peaks earlier in the day than revenue, so early hourly ROAS misleads [ADC-0047].
- Name who watches and who approves changes each day, including weekends.

### 8. Plan the after-sale read

Book returns daily at the expected rate, since Shopify records them on the refund date and January can show a false spike [MEA-0028]. Judge the sale on contribution after ads and returns, 14 and 30 days later. Give sale-month customers their own lower cost allowance, as their repeat can be weaker [MEA-0035].

## Checks before you hand it over

- Every day has an offer, budget per channel, creative, sends, stock action and owner.
- Every discount depth shows its break-even ROAS.
- Daily budgets add up to the approved total and stay inside cash.
- Hero SKUs have stock past the sale; any that do not have a pause rule.
- Peak orders per day are under warehouse capacity.
- Every SMS and WhatsApp send has consent and an approved template.
- Every deadline in copy matches the real end time.
- Nothing is switched on or sent without the owner's yes.

## Output

**One-screen summary:** dates, the offer and its break-even, total spend by phase and channel, expected peak orders per day against capacity, the three cost guards, and the biggest risk.

**Sale calendar** (`peak-sale-plan.csv` or a Google Sheet):

| Column | What goes in it |
|---|---|
| Date and day | Calendar date and days to sale end |
| Phase | Build-up, tease, early access, sale, last chance, after |
| Offer live | Exact terms, or none |
| Meta, Google, TikTok budget | Daily ceiling per channel |
| Creative live | Ad names or concepts on that day |
| Email | Segment and send time |
| SMS / WhatsApp | Segment, template name, send time |
| Site | Banner and page state |
| Stock check | Hero SKU units left and action |
| Warehouse | Forecast orders vs capacity |
| Guard | Scale, hold or cut line for the day |
| Owner | Person and approver |

Plus the **offer ladder** (offer, trigger to switch, break-even ROAS, page ready yes or no).

## Common mistakes

- **All-in sale week.** Step 3 funds the build-up and reads it on new customers.
- **Same break-even as normal months.** The gate recomputes it at each depth.
- **Switching off evergreen ads.** Step 4 keeps them and adds offer copies.
- **Selling out into the next month.** Gate 2 and step 6 protect stock the ads depend on.
- **Promising delivery the warehouse cannot meet.** Gate 3 checks capacity.
- **Fake deadlines.** Step 2 keeps one real end time across ads, emails and site.
- **Judging creative on sale days.** Step 4 reads CTR and CPC at ad set level.

## Sources

- OFF-0043, OFF-0066, OFF-0068, OFF-0069: subscriber offers, BOGO versus half off, offer ladder, break-even by depth.
- ADC-0023: pause or tighten SKUs short of stock.
- ADC-0043, ADC-0044, ADC-0045, ADC-0046, ADC-0047, ADC-0048, ADC-0050: Q4 pacing, reach, page limits, delayed attribution, hourly pacing, preseason share, scaling rules.
- MCR-0068, MCR-0069, MCR-0070: reading sale creative, evergreen plus offer copies, ads needed per peak day.
- GAD-0050: Google efficiency over Black Friday.
- MEA-0028, MEA-0034, MEA-0035: returns accrual, post-treatment lift, sale-month cohorts.
- OPS-0008, OPS-0015, OPS-0019: 3PL vetting, pick promises, not selling out.

What makes this skill ours: build-up spend is judged on new customers rather than same-day ROAS; every day has a written scale, hold or cut guard plus a platform spending limit as the hard stop; stock and warehouse capacity sit on the same calendar line as spend; and India's Diwali courier cutoffs, COD confirmation and DLT and WhatsApp template rules are built in.
