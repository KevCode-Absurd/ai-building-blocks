---
name: build-meta-campaign-launch-sheet
description: "A launch sheet that writes down every setting of a new Meta campaign, each ad set and each ad (objective, budget type, bid strategy, dataset and event, attribution, location, exclusions, placements, identity, text, destination, URL tags, enhancements) with the reason for each choice, for the client to approve line by line before anything goes live. Derives the budget and cost goal from gross profit per purchase, checks stock, cash and tracking first, and builds the campaign as a paused draft only after the yes. Use before any new Meta sales campaign: a store's first campaign, a new market, a new product line, a peak sale campaign or a rebuild."
---

# Meta campaign launch sheet

**You get:** one launch sheet (a table per level: campaign, ad sets, ads) with every Meta setting filled in, a reason for each non-default choice, a one-screen approval summary, and a paused draft built to match it once the client says yes.

## When to use

- A store is about to run its first Meta sales campaign.
- A new campaign is needed for a new country, a new product category with different margins, or a peak sale.
- An account is being rebuilt and each new campaign must be signed off before it replaces an old one.
- The client or an agency wants a written record of what was set and why, so later changes can be traced.

## Not for

- Deciding how much to spend this quarter and on which stage: use `store-meta-plan`, then bring its budget here.
- Adding new ads to a campaign that is already running: use `add-new-ads-to-live-campaign`, and `ad-launch-prepublish-check` for the per-ad checks.
- An Advantage+ sales campaign with its existing-customer cap: use `set-up-advantage-plus-sales-campaign`, which uses this sheet's format.
- Fixing the pixel or Conversions API: use `store-meta-capi` first.

## What you need

Required:

1. **Gross profit per purchase** for the products advertised, from `store-meta-math` or `build-sku-profit-sheet`: price after discount, landed cost, shipping, payment fees, returns and, where the store offers pay on delivery, failed-delivery losses.
2. **Meta Ads Manager export** of the last 90 days at campaign, ad set and ad level (if the account has history): objective, optimisation event, attribution setting, spend, purchases, purchase value.
3. **Shopify (or WooCommerce) order export** for the same 90 days: Name, Created at, Total, Payment Method, Customer Id, Lineitem sku, to check Meta's purchases against real orders.
4. **The campaign's job in one line** from the client: which products, which market, which month, what monthly spend cap.
5. **The creative ready to run**: files, primary text, headline, landing URL for each ad.
6. **Stock on hand** for each advertised SKU and its reorder lead time.

Optional: the naming rule from `creative-naming-and-tagging-system`, a customer list export (email, phone) for exclusions, creator permissions for partnership ads.

If 1 is missing, stop and get it; a budget or cost goal without it is a guess. If 2 is missing (new account), use the defaults in step 3 and mark them "to review after 14 days". Writing the sheet needs read access (level 1). Building the paused draft needs draft access (level 2). Publishing is the client's yes, every time.

## Before you start: the gates

1. **Profit known.** Pass when gross profit per purchase is computed from delivered costs [MEA-0037]. Fail: write the sheet without a budget or cost goal and stop there.
2. **Tracking trusted.** Pass when Meta's purchases for the last 14 days are within about 20% of store orders from Meta (practitioner default, test it) and the purchase event fires once per order. Fail: hand off to `store-meta-capi`; data comes before structure and creative [ADC-0028].
3. **Stock and cash.** Pass when every advertised SKU has more days of cover than its reorder lead time and the month's spend cap is cash the owner can lose without missing a supplier or payroll payment. Fail on a SKU: leave it out of the campaign [ADC-0023].
4. **Policy.** Pass when nothing sold needs a special ad category or a restricted-goods authorisation. Fail: name the rule that applies and get it cleared before building (see `fix-rejected-ads-and-account-restrictions`).
5. **Access.** Pass when the client has confirmed the ad account, Page, Instagram account and dataset to use, and the access level. Never ask for a password.

## Steps

### 1. Decide if this needs a new campaign at all

Add a campaign only for business complexity (a new country, a sub-brand, a category with different margins or its own sales target), never because spend grew [ADC-0030]. Each extra campaign splits the conversion data Meta learns from. If the job fits inside a live campaign, stop and use `add-new-ads-to-live-campaign`.

### 2. Fix the money lines

From gross profit per purchase (GP):

- **Break-even cost per purchase** = GP on the first order.
- **Target cost per purchase** = GP divided by the target ratio the client accepts. Practitioner bands: first-order GP over cost per new customer under 1 loses money, 1 to 2 holds, 2 to 3 is the zone to scale [MEA-0032]. Repeat-heavy stores may accept a lower first-order ratio only with cohort proof.
- **Daily budget** = target purchases a week x target cost per purchase / 7. Meta's learning needs about 50 optimisation events in 7 days; if the budget cannot reach that, say so and plan to judge on a longer window instead of chasing it [ADC-0066]. Below about 1,000 a day of spend, daily swings are noise; judge on 7 days or more [ADC-0064].

### 3. Fill the campaign level

| Field | Default for a store sales campaign | Why |
|---|---|---|
| Buying type | Auction | Reach and frequency buying is for awareness work |
| Objective | Sales | The store wants purchases |
| Special ad category | None, unless gate 4 says otherwise | Normal retail products need none |
| Budget | Advantage campaign budget (campaign level) once there are 2 or more ad sets; under about 10,000 a month either works [ADC-0067] | Lets Meta move money to what converts |
| Bid strategy | Highest volume to start; a cost per result goal only with `cost-capped-campaigns` | Caps without history choke delivery |
| Campaign spending limit | The month's cap from the client | A hard stop on the platform side |
| A/B test | Off | Tests are designed in `store-meta-test` |

### 4. Fill each ad set

Group ad sets by concept (persona, angle, offer), not by launch date [ADC-0058]. Split by format only in new accounts [ADC-0060].

| Field | Default | Why |
|---|---|---|
| Conversion location | Website (or website and WhatsApp in chat-first markets, see step 7) | Where the order happens |
| Performance goal | Maximise conversions, event Purchase | Optimise on the outcome, not clicks |
| Dataset | The store's one pixel or dataset | Two datasets split the signal |
| Attribution setting | 7-day click (add 1-day engaged view only if the client reports that way) [MEA-0042] [ADC-0027] | View credit inflates reported results |
| Schedule | Start date and time in the store's time zone; no end date for evergreen | Clean reads by date |
| Location | Countries or regions the store ships to and can fulfil on time | Hard control |
| Minimum age, language | Only if the product or law needs them | Hard controls [ADC-0055] |
| Exclusions | Purchasers in the last 180 days and the customer list [ADC-0015] [ADC-0025] | Prospecting money should find new buyers |
| Audience suggestions | Broad, with age, gender and interests left as suggestions | Meta treats them as hints anyway [ADC-0055] |
| Placements | Advantage+ placements | Each placement gets its own asset in step 5 |

### 5. Fill each ad

| Field | What to write |
|---|---|
| Identity | Facebook Page and Instagram account; partnership ads only with creator permission (`run-creator-partnership-ads`) |
| Format | Single image or video; carousel only if each card earns its place |
| Media | One asset per ratio: 4:5 or 1:1 for feed, 9:16 for stories and reels, text inside the safe area |
| Primary text, headline | Final words, checked by `check-ad-copy-for-policy-and-claims` |
| Call to action | Shop now, or Order now for a single product |
| Website URL | The exact page, live, in stock, at the advertised price |
| URL parameters | utm_source, utm_medium, utm_campaign, utm_content with Meta's dynamic name values, per `set-up-utm-tracking-for-all-channels` |
| Tracking | The same dataset as the ad set |
| Creative enhancements | Each one listed on or off; off unless the client approved it |
| Flexible or multi-asset formats | Off; they hide which creative worked [ADC-0065] |

### 6. Name everything

Use the store's naming rule, or: campaign `PROSP | UK | sales | broad | CBO`, ad set `P01 | persona | angle | offer | 2026-11-20`, ad `P01-A | format | hook | v1`. Names carry the facts a later reader needs without opening the settings.

### 7. Market notes

- **Pay on delivery stores:** if many orders are paid on delivery, the Purchase event rewards orders that are later refused; read `meta-ads-for-cod-stores` before choosing the optimisation event.
- **All markets:** landing pages must show prices the way the market expects (VAT included in the UK and EU) and the payment options the ad promises. If ads send people to WhatsApp or Messenger, record how those orders are counted. Write ads in the language the buyer reads; an ad set in another of your buyers' languages is a separate concept, not a translation toggle.
- **US:** check state shipping limits for regulated products, and that any "free shipping" or "sale" line in the ad matches the live page.
- **EU:** ads aimed at EU buyers show the advertiser and payer details under the Digital Services Act; fill the "beneficiary and payer" fields.

### 8. Get the yes, then build paused

Send the summary and the sheet. Ask for one reply: approve all, or the line numbers to change. Build the draft paused exactly as approved, export it from Ads Manager, and compare the export with the sheet line by line. Any difference is fixed before it goes back for the switch-on.

## Checks before you hand it over

- Gross profit per purchase, break-even cost and target cost are on the sheet with their source.
- The new campaign has a business reason from step 1, not "more spend".
- Every field at every level has a value; no "default" left unexplained.
- Existing customers are excluded from every prospecting ad set.
- Attribution, dataset and optimisation event match across all ad sets.
- Every landing URL was opened on a phone the day the sheet was sent, product in stock at the advertised price.
- The paused draft export matches the approved sheet line for line.
- Nothing is live without the client's written yes.

## Output

**Approval summary (one screen):** campaign job, products, market, dates, daily and monthly budget, target and break-even cost per purchase, number of ad sets and ads, exclusions, what is held back and why, and the one yes needed.

**Launch sheet:** three tables.

- Campaign: Field, Value, Reason, Approved (Y or line to change).
- Ad sets: Ad set name, Concept, Conversion location, Event, Attribution, Location, Exclusions, Placements, Daily minimum or share, Approved.
- Ads: Ad name, Ad set, Identity, Format, Media per ratio, Primary text, Headline, CTA, URL, URL parameters, Enhancements on, Approved.

**Build log:** date, who built, export file name, differences found, fixed (Y/N).

## Common mistakes

- **A new campaign for every idea.** Step 1 asks for a business reason [ADC-0030].
- **Budget from a round number.** Step 2 sets it from profit and the learning volume [ADC-0066].
- **Interest stacks treated as hard targeting.** Step 4 keeps only the hard controls hard [ADC-0055].
- **Existing customers inside prospecting.** Step 4 excludes them by default [ADC-0015].
- **Enhancements switched on by default.** Step 5 lists each one for approval.
- **A draft that drifts from what was approved.** Step 8 compares the export with the sheet.

## Sources

- ADC-0015: existing customers defined and excluded from prospecting.
- ADC-0023: no ads into a stock-out.
- ADC-0025: exclude existing customers from cold campaigns, 7-day click.
- ADC-0027: 7-day click plus 1-day engaged view as an option.
- ADC-0028: fix data before structure and creative.
- ADC-0030: add campaigns for business complexity only.
- ADC-0055: hard controls versus suggestions on broad targeting.
- ADC-0058: ad sets grouped by concept.
- ADC-0060: format splits only in new accounts.
- ADC-0064: small accounts judged on 7 days or more.
- ADC-0065: flexible ads hide what worked.
- ADC-0066: test budget from target conversions and the 50-in-7-days rule.
- ADC-0067: campaign budget versus ad set budget by size.
- MEA-0032: first-order profit over acquisition cost bands.
- MEA-0037: gross margin from delivered cost.
- MEA-0042: report on 7-day click, not 1-day view.

What makes this skill ours: every setting has a written reason and an approval box; the budget and cost goal come from delivered gross profit, not a round number; a new campaign must earn its place against consolidation; and the built draft is checked against the signed sheet before anyone switches it on.

## Selling in India

- If most orders are COD, read `meta-ads-for-cod-stores` before choosing the optimisation event.
- Landing pages show prices with GST and the payment options the ad promises (COD, UPI).
- A Hindi or Tamil ad set is its own concept.
