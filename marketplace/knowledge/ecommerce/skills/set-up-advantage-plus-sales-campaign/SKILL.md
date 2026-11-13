---
name: set-up-advantage-plus-sales-campaign
description: "A ready-to-approve Meta Advantage+ sales campaign for a store: a fit check first, an existing-customer audience and a spend cap on it sized in money from customer count, frequency and CPM, the settings that keep the campaign counted as Advantage+, a creative set with enough real variety, and a dated checklist for the first 14 days that reads new-customer results against store orders. Uses Meta's current two ad set method for the cap, since the old percentage field is gone for new campaigns. Use when a store wants Meta's most automated sales campaign without letting it spend the budget on people who already bought."
---

# Advantage+ sales campaign setup

**You get:** a fit verdict, a filled settings sheet for one Advantage+ sales campaign with two ad sets (existing customers capped, everyone else excluding them), the creative list, and a 14-day check calendar, all ready for the client's yes.

## When to use

- The store has purchase history on Meta and wants to move prospecting into an Advantage+ sales campaign.
- An Advantage+ campaign already runs but reports far better results than store orders show.
- An old Advantage+ shopping campaign used the existing-customer percentage and must be rebuilt.
- A new market or product line gets its own Advantage+ campaign.

## Not for

- Any other campaign type: use `build-meta-campaign-launch-sheet`.
- Scaling the campaign once it works: use `store-meta-budget` and `scale-readiness-check`.
- Separate retargeting and the full audience map: use `build-meta-retargeting-and-exclusions`.
- Catalog ads inside or beside it: use `set-up-meta-catalog-sales-ads`.

## What you need

Required:

1. **Gross profit per purchase** by product, from `store-meta-math` or `build-sku-profit-sheet`.
2. **Meta Ads Manager export**, last 90 days, campaign and ad level, with the breakdown by audience segment if the account shows it (new, engaged, existing).
3. **Shopify order export**, last 12 months: Customer Id, Email, Phone, Created at, Total, Lineitem sku, Payment Method. This builds the customer list and the new-customer check.
4. **Customer count** active in the last 180 days, and repeat rate.
5. **Creative pool**: every ad available, tagged by concept and format.
6. **Monthly spend cap** from the client.

Optional: CPM for the store's country from the last 30 days, post-purchase survey answers.

If 2 has no audience breakdown, use store new-customer orders as the check. If 3 is missing, the cap cannot be sized: stop. Uploading a customer list and building the draft need draft access (level 2) and the client's consent rules for the list. Publishing needs the client's yes.

## Before you start: the gates

1. **Profit known.** Pass with gross profit per purchase per product [MEA-0037]. Fail: stop.
2. **Tracking.** Pass when the purchase event matches store orders within about 20% over 14 days and deduplicates pixel and server events. Fail: `store-meta-capi` first [ADC-0028].
3. **Volume.** Pass when the planned budget can buy about 50 purchases a week at target cost [ADC-0066]. Fail: start with a simpler campaign from `build-meta-campaign-launch-sheet`, or accept a longer read window in writing.
4. **Margins similar.** Pass when advertised products have gross margins within about 10 points of each other. Fail: Meta will push spend to the cheapest purchase, not the most profitable [ADC-0022]; split by margin group.
5. **Consent.** Pass when the customer list was collected under the store's privacy notice and is uploaded through Meta's hashing. Fail: leave the list out and use the purchase audience only.

## Steps

### 1. Check the fit

Advantage+ sales suits a store with one main country, enough purchases, and a wide creative pool. The risk is spend drifting to existing customers and view-through credit: one top-spending Advantage+ ad showed 12.84 ROAS overall, about 5 on new customers and 1.71 on incremental attribution [ADC-0024]. If the export shows more than about a third of spend on existing customers, the cap in step 3 is the main fix.

### 2. Define the audiences

- **Existing customers:** the uploaded customer list plus website purchasers in the last 180 days [ADC-0015]. Leave buyers lapsed about 2 years out of the definition; they behave like new buyers [ADC-0025].
- **Engaged (for reporting):** website visitors in 30 days and add-to-carts in 90 days [ADC-0015].
- Refresh the customer list monthly, or connect it through the store platform's Meta integration so it updates on its own.

### 3. Size the existing-customer cap in money

Monthly cap = existing customers x desired monthly frequency x CPM / 1,000 [ADC-0068] [ADC-0020].

- Frequency: 4 to 7 a month for repeat-buy products [ADC-0020]; near 0 for furniture and other one-off buys.
- Worked example (illustrative): 8,000 customers x 5 x 300 rupees CPM / 1,000 = 12,000 rupees a month, about 400 a day.
- Warning lines: 7-day frequency above 8 on existing customers [ADC-0021], or about 30 in 30 days [ADC-0029], means overspend; about 10 views in 30 days is plenty for most stores [ADC-0042].

### 4. Build the two ad sets

Meta no longer accepts the existing-customer percentage on new Advantage+ campaigns. Its documented method [ADC-6080]:

- **Ad set A, existing customers:** includes the existing-customer audience as a hard rule (not a suggestion), with a daily spend cap from step 3.
- **Ad set B, new customers:** a copy of A that excludes the same audience. This is where nearly all budget goes.
- Budget at campaign level (Advantage campaign budget). Same ads in both.

Then check the three levers that keep it Advantage+ [ADC-6080]: campaign budget on, Advantage+ audience on in at least one ad set (B), no placement targeting or exclusions at ad set level. Ads Manager labels can differ from the API; confirm on the live setup screen that it still shows as Advantage+.

### 5. Fill the settings

| Field | Value |
|---|---|
| Objective | Sales, website (plus WhatsApp in India only if those orders are tracked) |
| Event | Purchase (see `meta-ads-for-cod-stores` for COD-heavy stores) |
| Attribution | 7-day click [MEA-0042] |
| Bid strategy | Highest volume to start; a cost goal only via `cost-capped-campaigns` |
| Daily budget | Target purchases a week x target cost / 7 |
| Location | Ship-to countries only |
| Placements | Advantage+ placements |
| Creative enhancements | Each listed; off unless approved |
| Flexible ad format | Off [ADC-0065] |

### 6. Assemble the creative set

- Too few live ads can cap the whole account [ADC-0013]. Start with at least 8 ads across at least 4 concepts and 2 formats (practitioner default, test it).
- Ads that differ only in colour or pose count as one [MCR-0078].
- Most volume should speak to people who do not know the product yet; an account of product-aware ads stays warm and frequency climbs [MCR-0057].
- Keep catalog ads out at launch: their reported return leans on existing customers [ADC-0010].

### 7. Set up the reads before launch

- **New-customer cost** from ad set B, on 7-day click.
- **Store check:** new-customer revenue from Shopify (first orders) divided by Meta spend, the acquisition MER [MEA-0025].
- **Survey check:** if Meta is about half of spend, about half of "where did you hear about us" answers should name it [MEA-0045].

### 8. The first 14 days

| Day | Check | Action if it fails |
|---|---|---|
| 1 | All ads approved and delivering | Fix rejections (`fix-rejected-ads-and-account-restrictions`) |
| 3 | Spend pacing; ad set A within its cap; frequency on A | Lower A's cap if 7-day frequency passes 8 |
| 7 | B's cost per purchase vs target; acquisition MER vs last 30 days | No edits unless tracking broke; note it |
| 7 | Spend share by ad | Normal if a few ads take most [ADC-0014] |
| 10 | Store new-customer orders vs Meta new-customer purchases | Investigate if gap above 30% (practitioner default) |
| 14 | Keep, adjust or stop, against the target | Hand to `store-meta-budget` |

Under about 1,000 a day of spend, read on 7-day windows only [ADC-0064].

### 9. India and US notes

- **India:** COD-heavy stores should consider optimising on confirmed orders (`meta-ads-for-cod-stores`). Upload customer phones with country code 91; many Indian buyers give phone, not email. Prices on landing pages include GST.
- **US:** state the 7-day click basis in every report; the default with view credit can show a much higher number.

## Checks before you hand it over

- The fit check and its numbers are on the sheet.
- The existing-customer audience is defined, with its sources and refresh plan.
- The cap is in money with the formula shown, not a percentage.
- Both ad sets exist, B excludes A's audience, and the campaign still shows as Advantage+.
- At least 8 ads across 4 concepts, no look-alikes, flexible format off.
- The 14-day calendar has dates and owners.
- Nothing goes live without the client's yes.

## Output

**Summary (one screen):** fit verdict, budget, cap and its maths, ads count, target cost, how results will be read, first check date, the yes needed.

**Settings sheet:** Level, Field, Value, Reason, Approved.

**Creative list:** Ad name, Concept, Format, Ratio files, Landing URL, Differs from nearest by.

**14-day calendar:** Date, Check, Number seen, Pass/fail, Action, Owner.

## Common mistakes

- **Trusting the blended number.** Step 7 reads new customers and store orders [ADC-0024].
- **A cap as a guess.** Step 3 sizes it from customers, frequency and CPM [ADC-0068].
- **Breaking Advantage+ by adding placement exclusions.** Step 4 checks the levers [ADC-6080].
- **Mixed-margin products in one campaign.** Gate 4 splits them [ADC-0022].
- **Too few ads.** Step 6 sets a floor [ADC-0013].

## Sources

- ADC-0010: catalog ad returns lean on existing customers.
- ADC-0013: too few live ads cap an account.
- ADC-0014: spend concentrates in few ads.
- ADC-0015: existing and engaged audience definitions.
- ADC-0020, ADC-0068: existing-customer spend in money.
- ADC-0021, ADC-0029, ADC-0042: frequency warning lines.
- ADC-0022: optimisation favours the cheapest purchase.
- ADC-0024: Advantage+ results split by audience and attribution.
- ADC-0025: lapsed buyers and 7-day click for cold campaigns.
- ADC-0028: data before structure.
- ADC-0064: read small accounts on 7 days.
- ADC-0065: flexible ads hide what worked.
- ADC-0066: about 50 events in 7 days.
- ADC-6080: two ad set cap and Advantage+ levers (proposed card).
- MCR-0057, MCR-0078: creative mix and look-alikes.
- MEA-0025, MEA-0045: acquisition MER and survey checks.
- MEA-0037, MEA-0042: delivered margin; 7-day click reporting.

What makes this skill ours: the existing-customer cap is sized in money from the store's own customer count, not a default percentage; it uses Meta's current two ad set method and checks the campaign still counts as Advantage+; and the first two weeks are judged on store new-customer orders, not Meta's blended return.
