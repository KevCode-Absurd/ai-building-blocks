---
name: which-number-to-trust
description: Explains in plain words why GA4, each ad platform and the store or CRM report different numbers of sales, puts every claim side by side against the backend total, checks the basics that inflate or hide credit, and says which number to use for which decision (total budget, channel split, creative), with a marketing efficiency ratio and a list of channels that need a lift test. Use when platforms together claim more sales than happened, when an agency's report and GA4 disagree, or when an owner asks "which number do I trust?"
---

# Which number to trust

Every tool counts by its own rules. This skill does not crown one tool. It lines the claims up, explains each gap, ties everything to the count the business can bank, and matches each decision to the number that fits it.

## When to use

- Google Ads, Meta and GA4 each claim a share of sales that adds up to more than the real orders.
- The agency's report shows a return GA4 does not.
- A channel looks great in its own dashboard and invisible in GA4, or the other way round.
- Before a budget meeting, so everyone argues from the same table.

## What you need

1. The same date range from every source (four to eight weeks works; avoid ranges that cross a tracking or attribution change).
2. Backend totals: orders and revenue (after refunds) or booked jobs, by day.
3. GA4: key events and revenue by session source, medium and campaign, plus the attribution model and lookback windows in use.
4. Each ad platform: spend, conversions and conversion value by campaign, with its attribution setting.
5. Any "How did you hear about us?" answers.
6. Known changes in the period: site or checkout changes, consent banner changes, campaigns started or stopped.

**Access:** level 1 is enough for the whole analysis (read the accounts or the exports). Level 2 to save the reconciliation as a draft report in Data Studio or a sheet; level 3 to share it with the agreed people or to fix settings found in step 4 (for example unwanted referrals) within your limits. Changing which conversions an ad platform bids on always needs a fresh yes.

## Steps

### 1. Build the claims table
One row per source: what it counts as a conversion, its count, its value, its attribution rule (model, click window, view window, count every or one), and its date basis. Put the backend total at the top. Add a row "sum of platform claims".

### 2. Explain the gap, reason by reason
Work through the usual causes and say which ones show up in these numbers:
- **Different credit rules.** GA4 uses data-driven attribution or last click across all channels; each ad platform credits its own interactions, often including people who only saw an ad.
- **Different windows.** Lookbacks differ by tool and setting; GA4 defaults to 90 days for most key events.
- **Different dates.** Google Ads reports a conversion on the date of the ad interaction; GA4 and the store report the date of the sale. Short ranges magnify this.
- **Double counting.** One sale credited by several platforms; or a purchase tag firing twice.
- **Untracked and declined.** Visits from people who declined cookies, from untagged links, from apps that strip referrers.
- **Late and removed.** Conversions that arrive after the export, and invalid clicks removed later.

### 3. Check the basics in the data
- UTMs on every paid link, in lowercase, with mediums that fit GA4 channels.
- Self-referrals and payment or booking domains showing as sources.
- Direct traffic that looks too high next to past periods.
- Unassigned or "(not set)" rows and their share of key events.
- GA4 purchases against backend orders (duplicate transaction IDs).
Each issue gets a line: what it is, how much it moves, how to fix.

### 4. Tie to the backend
- Backend revenue and orders are the anchor. Show GA4's total as a share of backend and the platforms' sum as a share of backend.
- Work out the marketing efficiency ratio: backend revenue ÷ total marketing spend (ads, agency fees, tools if the client wants a full view). Show the working.
- Show self-reported source shares next to GA4 channel shares, as a separate signal.

### 5. Match each decision to a number
| Decision | Number to use | Why |
|---|---|---|
| Total marketing budget | Backend revenue, MER, contribution margin | Independent of every tool's credit rules |
| Split between channels | GA4 cross-channel credit, corrected by lift tests where available | One rule applied to all channels |
| Creative, audience and bid choices inside one platform | That platform's own reports | Like-for-like comparison |
| Keep or cut a doubtful channel | A holdout or lift test | Credit is not cause |

### 6. Flag channels for testing
List channels where spend is large and the evidence is only credit: brand search, retargeting, view-through-heavy social. For each, name the test (see `geo-holdout-lift-test`) and what it would decide.

### 7. Write shared definitions
Define spend, sale, lead, revenue (before or after refunds and tax), cost per sale and MER once, with the source and owner of each, so the client and the agency count the same way.

## Checks

- Every figure has a source and the same date range.
- The backend total is shown and every other number is compared with it.
- Each gap reason is either shown in the data or marked "possible, not checked".
- Each credit rule is described in general terms, with a note to check the client's own settings.
- No claim says a channel "caused" sales without a test.
- No return is promised.

## Output format

1. One-paragraph answer: which number to trust for what
2. Claims table (backend first, sum of claims last)
3. Gap reasons, each with evidence or "not checked"
4. Data fixes, ranked by how much they move the numbers
5. MER with workings, and self-reported sources
6. Decision table
7. Channels to test, with the question each test answers
8. Shared definitions
9. Access used and anything left for the client to approve

## Example of good output (short)

*Illustrative structure, not a real business: an online furniture shop. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Short answer.** You had 131 orders in October (Shopify, after refunds). Google Ads claims 120 and Meta 95: together 215, or 164% of real orders, because both credit the same buyers and Meta also counts people who saw an ad without clicking. GA4 credits 118 orders to tagged channels and 13 to direct. Plan the total budget from Shopify revenue and MER; compare campaigns inside each platform with that platform's own numbers; do not add the platforms together.
>
> **MER.** Revenue £58,950 ÷ marketing spend £9,000 = 6.6. Last October: 5.9.
>
> **Fix first.** 9 orders show "checkout.paymentsite.example / referral" as their source. Add the payment domain to unwanted referrals (level 3, on your list) so those sales go back to the channel that sent the buyer.
>
> **Test next.** Brand search takes 30% of Google spend and GA4 gives it 41 orders, but most of these people searched for you by name. A three-week regional holdout would show how many would have bought anyway.
