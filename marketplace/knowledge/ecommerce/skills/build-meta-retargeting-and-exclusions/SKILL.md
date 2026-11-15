---
name: build-meta-retargeting-and-exclusions
description: "The Meta audience map for a store: which custom audiences to build (purchasers, customer list, lapsed buyers, site visitors, add-to-carts), which campaigns use or exclude each one, how much money goes to existing customers worked out from customer count, frequency and CPM, and a plain verdict on whether retargeting deserves its own budget at all or should ride inside prospecting. Includes frequency warning lines, a different-product rule for retargeting, a holdout test plan for the doubtful cases, and notes on phone-based customer lists. Use when setting up or cleaning a Meta account, when retargeting looks too good to be true, or when existing customers soak up prospecting money."
---

# Meta retargeting and exclusion audiences

**You get:** an audience build list with exact definitions, a use-or-exclude matrix for every campaign, a written verdict on separate retargeting budget (yes, small, or none) with the money figure behind it, and the frequency lines to watch.

## When to use

- Setting up a new account's audiences before the first campaigns.
- Prospecting reports great results but store new-customer orders do not move.
- A retargeting campaign takes a big share of spend and reports a high return.
- The owner asks "should we retarget?" or "how much should go to past buyers?"

## Not for

- The Advantage+ campaign's built-in cap: use `set-up-advantage-plus-sales-campaign`, which takes its audience definitions from here.
- Catalog feed and product sets: use `set-up-meta-catalog-sales-ads`.
- Email, SMS and WhatsApp to past buyers, usually the cheaper channel: use `email-sms-flow-plan`.
- A formal lift test with cells and a decision rule: use `store-meta-test` (this skill says when one is needed).

## What you need

Required:

1. **Meta Ads Manager export**, last 90 days, by campaign and ad set: spend, impressions, reach, frequency, purchases, purchase value, and the audience segment breakdown (new, engaged, existing) if shown.
2. **Shopify order export**, last 24 months: Customer Id, Email, Phone, Created at, Total, Lineitem sku. Gives customer counts, repeat rate and days between orders.
3. **Current custom audiences** list (Audiences in Ads Manager) with their definitions and sizes.
4. **Gross profit per order** from `store-meta-math`, split for first and repeat orders if possible.
5. **CPM** for the store's main country, last 30 days, from the export.

Optional: email and WhatsApp reach of past buyers, the post-purchase survey.

If 2 is missing, you can still build the audiences but cannot size the money: mark the budget "to size". Building audiences and uploading a customer list need draft access (level 2) and a privacy notice that covers it. Changing live campaigns' exclusions is a live change: client's yes first.

## Before you start: the gates

1. **Profit known.** Pass with gross profit per order. Fail: build audiences only, no budget verdict.
2. **Tracking.** Pass when purchase and add-to-cart events fire and match store orders roughly. Fail: website audiences will be wrong; `store-meta-capi` first.
3. **Consent.** Pass when the customer list was collected under a notice allowing advertising use, and is uploaded through Meta's own hashing. Fail: use pixel-based purchaser audiences only.
4. **Repeat behaviour known.** Pass when the order export gives repeat rate and median days to second order. Fail: treat the store as low-repeat until shown otherwise.

## Steps

### 1. Build the audience list

| Audience | Definition | Why |
|---|---|---|
| Existing customers | Customer list (email and phone) plus website purchasers in last 180 days [ADC-0015] | The group to cap or exclude |
| Lapsed buyers | Purchased 181 days to 2 years ago, not since | Not excluded from cold campaigns; they act like new buyers [ADC-0025] |
| Engaged | Website visitors in 30 days plus add-to-carts in 90 days [ADC-0015] | For reporting, and retargeting if step 4 says yes |
| Checkout starters | Initiated checkout in 14 days, no purchase | Small, high-intent; only for stores with enough volume |
| Active subscribers | From the subscription app's export | Excluded from discount ads |

Skip any audience under about 1,000 people; it will not deliver evenly (practitioner default, test it).

### 2. Write the use-or-exclude matrix

| Campaign | Existing customers | Lapsed | Engaged | Subscribers |
|---|---|---|---|---|
| Prospecting (incl. Advantage+) | Exclude [ADC-0025] | Allow | Allow | Exclude |
| Existing-customer campaign or capped ad set | Include, capped | Allow | No | Exclude from offers |
| Visitor retargeting (only if step 4 says yes) | Exclude | Exclude | Include | Exclude |
| Catalog retargeting | Exclude | Allow | Include | Exclude |

On broad targeting, exclusions are hard controls while age, gender and interests are suggestions [ADC-0055]. So the exclusions in this matrix are the main lever you have.

### 3. Size existing-customer spend in money

Monthly money = existing customers x desired monthly frequency x CPM / 1,000 [ADC-0068] [ADC-0020].

- Repeat-buy products (consumables, fashion): 4 to 7 views a month [ADC-0020].
- One-off products (furniture, mattresses): near zero.
- Warning lines: 7-day frequency above 8 [ADC-0021], or about 30 in 30 days [ADC-0029], means overspend. Audits often find past buyers seeing 20 to 100 ads a month when about 10 is plenty, so budgets can often fall about 90% [ADC-0042].

Then check the same people can be reached by email, SMS or WhatsApp. Owned channels cost far less per message; paid spend on existing customers is for those not reachable or not opening.

### 4. Decide: separate retargeting budget or none

Default verdict: **no separate visitor retargeting budget.** Broad prospecting already shows ads to warm visitors, and separate visitor retargeting mostly buys sales that were coming anyway [ADC-0040]. Under about 50,000 a month of spend, the structure is concept testing, one scaling campaign and minimal customer retargeting [ADC-0041].

A small separate budget earns its place only if all three hold:

1. The store sells repeat-buy or new-arrival products (fashion, consumables).
2. Prospecting frequency on the engaged audience is low (under about 2 in 7 days, practitioner default).
3. A holdout test (step 6) shows extra orders, or the client accepts the spend as a test.

Write the verdict as one of: none, existing-customer only (capped), or existing plus visitor (capped), with the money figure for each.

### 5. Shape what retargeting shows

- Show people who viewed and did not buy a different, related product, not the same one again [ADC-0033].
- For fashion, keep new arrivals and catalog ads in separate ad sets under the existing-customer campaign, or the catalog takes all the spend.
- Keep catalog retargeting well below the share of spend auditors often find [ADC-0026].
- Never show a discount to active subscribers or people who just paid full price.

### 6. Plan the proof

Reported retargeting returns run high because view credit and existing buyers inflate them [MEA-0042]. If retargeting spend is above about 10% of Meta spend, plan a conversion lift test or a 4-week holdout through `store-meta-test` before keeping it. Report on 7-day click, and split the store P&L into first-time and returning customers so returning profit does not hide acquisition losses [MEA-0055].

### 7. Apply and log

List each change (audience created, exclusion added, campaign paused or capped) in order. The client approves the list; exclusions on live campaigns go in one sitting, logged in `daily-ad-account-review`'s decision log.

### 8. Market notes

- **Phone-first markets:** many buyers give a phone number, not email; upload phones in full international format with the country code. Buyers who refused delivery are not customers: exclude refused or failed-delivery orders from the "existing customers" list and consider them for a separate exclusion. Click-to-WhatsApp ad engagers can form their own engaged audience.
- **US:** include both email and phone in the customer list for better match; honour opt-outs from state privacy laws by removing those customers before each upload.
- **UK and EU:** upload only customers whose data you may use for ads under GDPR, and remove anyone who objected to marketing.

### 9. Prove the existing-customer spend with a cut test

The money formula in step 3 sets a ceiling; a cut test shows how much of it earns its keep [ADC-6274].

- **Agree the floor first.** Before any cut, write the sales floor with the owner: for example "pause the cut if existing-customer orders fall more than 10% against the prior 7-day baseline, read daily". No floor, no test.
- **Cut about 30%** of the existing-customer campaign for 14 days. Cost per extra sale = spend removed / store orders lost. If that number is above the existing-customer cost ceiling, keep the cut and move the money to acquisition. One account cut from 1,000 a day to 700 and kept 47 of 50 conversions [ADC-6274].
- **Set a lower cost ceiling** for existing customers than for new ones, about half the new-customer target, because many would buy anyway [ADC-0020] [ADC-6273].
- **Read frequency by its own window**, never merged: 30-day frequency at about 7 or under, or 7-day at about 8 or under, is in range. About 1 on 30 days means the layer is underspent; about 30 means heavy overspend [ADC-0029] [ADC-6190].
- **Followers and engagers who never bought** sit between cold and existing customers. They are more worth reaching than buyers, less than cold people. Leave them inside the cold campaign's reach; do not give them their own budget unless a lift test backs it.
- **Email-to-Meta sync.** Check the email platform's customer list sync each month. When it breaks, existing customers are treated as new in cold campaigns and every exclusion leaks [ADC-6227].
- **Email attribution is view-like.** A 5-day open plus 5-day click window credits emails the way view-through credits ads. Use email revenue as a trend line, never to argue for more retargeting spend.
- **When a separate retargeting layer is approved,** run it as one consolidated ad set, not separate cart, checkout and visitor ad sets, which only raise CPMs [ADC-6214]. Order the ads: first answer the top reason visitors gave for not buying, in their words; then proof that backs that answer; then a different product that fits what they viewed, picked from a pairing table with margin [ADC-0033]. Judge it on 7-day click or incremental results, never headline ROAS [ADC-6290].

## Checks before you hand it over

- Every audience has a written definition and a size.
- Existing customers are excluded from every prospecting campaign and ad set.
- Lapsed buyers over 180 days are not excluded from prospecting.
- Existing-customer spend is a money figure from the formula, not a percentage.
- The retargeting verdict is one of three, with the reason and the money.
- Frequency warning lines are on the watch list.
- A proof plan exists if retargeting is above about 10% of spend.
- No live exclusion change without the client's yes.
- Any existing-customer cut test has a written sales floor, a daily read and a 14-day end date before it starts.
- Frequency is reported with its window (7-day or 30-day) and never mixed.

## Output

**Summary (one screen):** audiences to build, the retargeting verdict, monthly money for existing customers, changes to live campaigns, the yes needed.

**Audience build list:** Name, Source, Definition, Window, Size, Refresh.

**Use-or-exclude matrix:** Campaign by audience, Include / Exclude / Allow, Reason.

**Money sheet:** Existing customers, Frequency target, CPM, Monthly money, Current spend on them, Change.

**Watch list:** Audience, 7-day frequency, 30-day frequency, Warning line, Action.

## Common mistakes

- **Excluding everyone who ever bought.** Step 1 leaves lapsed buyers in [ADC-0025].
- **Retargeting by habit.** Step 4 makes "none" the default [ADC-0040].
- **A percentage instead of money.** Step 3 sizes it from people and frequency [ADC-0068].
- **Same product shown again and again.** Step 5 rotates a related product [ADC-0033].
- **Trusting retargeting's reported return.** Step 6 asks for a holdout [MEA-0042].
- **Paying to reach people the email list reaches.** Step 3 checks owned channels first.
- **Cutting existing-customer spend with no floor.** A cut test without an agreed stop line is just a cut; write the floor first.
- **Splitting retargeting into cart, checkout and visitor ad sets.** One consolidated ad set, steered by frequency, costs less [ADC-6214].

## Sources

- ADC-0015: existing and engaged audience definitions.
- ADC-0020, ADC-0068: existing-customer spend in money.
- ADC-0021, ADC-0029, ADC-0042: frequency warning lines and overspend.
- ADC-0025: exclude existing customers but not lapsed ones.
- ADC-0026: cap catalog ad share.
- ADC-0033: retarget with a different product.
- ADC-0040: skip separate visitor retargeting.
- ADC-0041: structure under 50,000 a month.
- ADC-0055: exclusions are hard controls.
- MEA-0042: view credit inflates reported return.
- MEA-0055: separate first-time and returning P&Ls.
- ADC-6274: cut test that kept 47 of 50 conversions.
- ADC-6273: existing-customer CPA about half the new-customer target.
- ADC-6190: overspend above about 8 a month.
- ADC-6227: check the email to Meta sync.
- ADC-6214: retargeting as a capped, merged support layer.
- ADC-6290: judge DPA and retargeting on incremental columns.

What makes this skill ours: "no separate retargeting budget" is the default and must be argued away with three conditions; existing-customer money is sized from customer count, frequency and CPM; refused deliveries are kept out of the customer list; and owned channels are checked before paying to reach past buyers.

## Selling in India

- Upload phones with country code 91.
- Exclude refused COD or RTO orders from the "existing customers" list.
