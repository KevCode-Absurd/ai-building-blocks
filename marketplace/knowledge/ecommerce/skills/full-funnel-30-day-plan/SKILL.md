---
name: full-funnel-30-day-plan
description: "Plan one month of ads and email so new, warm and ready-to-buy shoppers each get the right message, all month, not one stage per week: a dated calendar of ad creative and emails by stage, SMS or WhatsApp sends, one offer timeline, and a budget split worked out from the store's own gross profit per purchase, cash, stock, audience sizes and past results instead of a fixed percentage. Existing-customer ad spend is set in money from audience size, cost per thousand and frequency; testing spend from target cost per purchase; email volume from revenue band and list health. Platform-neutral, with India payment and delivery notes. Use at the start of each month or before a sale."
---

# 30-day plan across ads and email

**You get:** a dated 30-day calendar of ads, emails and texts by shopper stage, a budget table built from gross profit, one offer timeline, and creative and email brief lists, ready for the month.

A month plan answers three questions with the store's own numbers: how much can we spend and where, what does each kind of shopper see, and what goes out on which day. Cold, warm and ready-to-buy shoppers exist every day, so every stage runs all month; the split falls out of the store's margin, cash and audiences.

## When to use

- Start of a month, to set the ad budget split and the email and SMS calendar together.
- The store only runs cold ads, or ads and email send clashing offers.
- A sale or launch falls inside the month.
- Cold, warm and existing-customer spend has never been sized on purpose.

## Not for

- A Meta-only structure by store stage: use `store-meta-plan`.
- Scale, hold or cut calls per Meta campaign: use `store-meta-budget`.
- Writing the ads: use `store-meta-concepts` and `ad-copy-test-sets`.
- Building email flows in depth: this plan checks they exist and briefs them.

## What you need

**Required**

- Shopify order export, last 90 days: Created at, Name, Total, Subtotal, Discount amount, Shipping, Lineitem sku, Lineitem quantity, Customer ID or email, Financial status.
- Costs per SKU (product, shipping, payment fees, pick-pack, return rate), or gross profit per purchase.
- The month's cash limit for ads; stock on hand with reorder lead times per SKU.
- Meta export by campaign and ad set, last 60 days: spend, impressions, reach, frequency, CPM, purchases, cost per purchase, attribution setting. Google or TikTok exports if they run.
- Email platform reports (Klaviyo as the example): list and segment sizes; 90 days of campaign opens, clicks, unsubscribes, revenue per recipient; flow list with status and trigger.
- Products, offers and dates planned for the month.

**Optional**

- Customer list size on Meta and match rate; SMS or WhatsApp list size; survey answers; top objections.

**Missing input:** ask once. Without costs, stop. Without email reports, plan ads only and say so.

**Access.** Level 1, read. Paused campaigns or draft emails need level 2 and a yes. Sending, launching or changing budgets needs the owner's yes each time.

## Before you start: the gates

1. **Gross profit per purchase known** per hero SKU: price after discount minus product cost, shipping, fees, pick-pack and returns [MEA-0037]. Fail: compute it here; without costs, stop.
2. **Cash limit stated.** Fail: plan at last month's spend and mark the plan "not funded".
3. **Stock covers the plan.** A SKU with fewer days of stock than its reorder lead time gets no prospecting push [ADC-0023]. Fail: drop or swap it.
4. **Capacity.** Someone can make the creative and emails on the calendar. Fail: cut the calendar to what can be made.
5. **Tracking.** Meta purchases within about 20% of Shopify paid-social orders (practitioner default, test it), read on 7-day click [MEA-0042]. Fail: judge the month on store-side new-customer revenue only.

## Steps

### 1. Set the money frame

From the order export: new-customer orders and revenue, first-order gross profit, last month's ad spend. Compute:

- Acquisition cost = ad spend / new customers.
- First-order gross profit / acquisition cost: under 1 loses money, 1 to 2 hold, 2 to 3 scale, over 3 underspending [MEA-0032]. Strong-repeat stores may accept less if 90-day gross profit covers it.
- New-customer revenue / ad spend as the headline measure, not blended revenue [MEA-0039].

Monthly ad ceiling = the lower of the cash limit and the spend at which that ratio stays in its band. Scaling toward break-even is fine only if cash and stock can carry it [ADC-0034]; growth funded by stock loans can wipe out profit [FIN-0011].

### 2. Size each budget line from the store's data

| Line | How to size it |
|---|---|
| Existing customers | Matched customers x CPM / 1,000 x monthly frequency wanted [ADC-0068]. Keep under about 7 per 30 days [ADC-0040]; about 10 a month is plenty [ADC-0042]. Repeat-buy stores with strong email often need almost none. |
| Warm (30-day visitors, 90-day add-to-carts) | Same formula; 30-day frequency near 14 on engaged people means cut [ADC-0029]. Catalog and retargeting returns look high partly because these people would buy anyway, so cap this line rather than feeding it. |
| Testing | New concepts x 3 x target cost per purchase [ADC-0039]. About 30% of spend when profitable, 10% when not [ADC-0053]. |
| Prospecting (cold) | The ceiling minus the lines above. |

Under about $50k a month on Meta: concept testing, one scaling campaign, minimal customer retargeting [ADC-0041]. Exclude existing customers from prospecting [ADC-0015].

### 3. Choose creative by stage

For broad prospecting, weight new creative toward people who do not yet know the problem or the product, about 80% [MCR-0057]; a small store below its warm demand can start with product, proof and offer ads.

| Stage | Ad creative | Emails |
|---|---|---|
| Cold | Product in a real routine; a short education piece on a common mistake; the origin story; a demo under 30 seconds | Welcome series (story, what makes it different); one useful how-to; "what most people get wrong" |
| Warm | Specific results from real, dated reviews; one objection per ad (price, ingredients, delivery); review compilations; versus the usual way | Case story from a real customer; top question answered honestly; comparison with the category norm; founder credibility |
| Ready to buy | Product, price and reason to act now; free shipping or bonus; catalog ads, capped | Cart and checkout flows; browse flow; post-purchase cross-sell; win-back |

Urgency only when real: a true deadline or stock count. Testimonials never claim a medical result. Concepts this month = testing line / (3 x target cost per purchase); cold needs the most new creative, ready-to-buy ads mostly stay evergreen.

### 4. Check the email base before the calendar

- Flows live and triggering, at baseline length: welcome about 8 emails over 7 to 14 days, cart and checkout 6 to 8, browse abandon several, win-back from twice the average days between orders [EML-0019]. Cart email 1 is a reminder with no discount; later emails answer the main objection; any discount waits until about email 5 with a real expiry [EML-0044]. A thank-you with a cross-sell soon after the order starts the second purchase [EML-0062]. Missing flows go to the top of week 1.
- Engaged segment: a real open or click in 180 days, or sign-up or visit in 14 days [EML-0011].
- Campaigns: about 2 to 3 a week under $50k monthly revenue, 3 to 4 above, 4 to 5 above $200k, adding sends only while opens stay over 30% [EML-0041]. Mix education, social proof, brand and product features, with one or two sale emails a month [EML-0016].
- SMS: about one campaign a week, kept for launches, sales and restocks [EML-0025].

### 5. Lay one offer timeline

One offer at a time across ads, email and site; ads name the offer the page shows. Before a sale keep evergreen ads running and add offer-badged copies [MCR-0069]. If a SKU may sell out, do not push it at the peak [OPS-0019].

### 6. Build the calendar

Four weeks, every stage live every week. Each row: date, channel, stage, asset, product, offer, audience or segment, budget or send size, owner, status.

### 7. India and similar markets

- Gross profit per purchase uses delivered orders; subtract return-to-origin losses on cash-on-delivery orders (practitioner default: use the store's own RTO rate by pin code band).
- Nudge prepaid and UPI in email and WhatsApp to cut cash-on-delivery share; confirm cash-on-delivery orders by WhatsApp before dispatch.
- Automated WhatsApp journeys report far higher click rates than broadcasts [EML-0048]; opted-in contacts only.
- Plan around the buyer's festive dates; GST-compliant invoices with every order.

### 8. Set the weekly read and the adjust rules

Each Monday: new-customer revenue / spend, first-order gross profit / acquisition cost, frequency per line, email revenue per recipient and unsubscribes, stock cover. Email revenue on default open windows overstates impact [EML-0056]. Adjust: cost per purchase rising with cold frequency up means new cold creative; cart flow recovering few orders means fix flow content before adding discounts; warm frequency over its cap means cut warm spend.

## Checks before you hand it over

1. Budget lines add up to the monthly ceiling, under the cash limit.
2. Every line shows its formula and inputs.
3. Every stage has ads and emails in every week.
4. No advertised SKU has stock cover below its lead time.
5. Ads, email, SMS and site show the same offer on the same dates; urgency is real.
6. Email volume matches the revenue band and list health; flows checked first.
7. Nothing sends, launches or spends without a yes.
8. A fixed-percentage, one-stage-per-week plan would not beat this one on fit.

## Output

1. **One-screen summary:** ceiling, split by line, concepts to test, emails and texts planned, the offer, the Monday read.
2. **Money frame table:** measure, last month, target band.
3. **Budget table:** line, formula, inputs, monthly amount, daily amount.
4. **Calendar:** date, channel, stage, asset, product, offer, audience, budget or send size, owner, status.
5. **Creative and email brief lists** by stage.
6. **To confirm:** short list for the owner.

## Common mistakes

- **One stage per week.** Step 6 runs all stages every week.
- **A fixed 60/30/10 split.** Step 2 sizes lines from the store's numbers.
- **Feeding retargeting because its return looks high.** Step 2 caps it.
- **Pushing a SKU about to sell out.** Gate 3 and step 5 stop it.
- **A discount in the first cart email.** Step 4 holds it back.
- **Judging email on attributed revenue.** Step 8 reads clicks and orders.

## Sources

- [MEA-0037]: gross margin is delivered cost.
- [ADC-0023]: tie ad targets to stock cover.
- [MEA-0042]: report Meta on 7-day click.
- [MEA-0032]: first-purchase gross profit bands.
- [MEA-0039]: new-customer revenue per ad spend.
- [ADC-0034]: scale toward break-even when cash allows.
- [FIN-0011]: stock-funded growth can erase profit.
- [ADC-0068]: existing-customer spend in money.
- [ADC-0040]: customer frequency under 7 in 30 days.
- [ADC-0042]: about 10 ads a month per customer is plenty.
- [ADC-0029]: engaged frequency near 14 is overspend.
- [ADC-0039]: judge after 3x target cost per purchase.
- [ADC-0053]: 70/30 proven to test when profitable.
- [ADC-0041]: simple structure under $50k a month.
- [ADC-0015]: segments and customer exclusion.
- [MCR-0057]: weight creative toward unaware buyers.
- [EML-0019]: baseline flow lengths.
- [EML-0044]: hold the discount until late.
- [EML-0062]: post-purchase cross-sell soon after the order.
- [EML-0011]: engaged segment definition.
- [EML-0041]: campaigns per week by revenue.
- [EML-0016]: campaign content mix.
- [EML-0025]: SMS about once a week.
- [MCR-0069]: keep evergreen ads through a sale.
- [OPS-0019]: do not push stock that will sell out.
- [EML-0048]: WhatsApp journeys out-click broadcasts.
- [EML-0056]: attributed email revenue overstates impact.

What makes this skill ours: the budget split is computed line by line from gross profit, cash, stock, audience sizes and frequency; every stage runs every week with matched ads and emails; flows are checked before campaigns; one offer timeline binds ads, email and site; and India notes cover cash on delivery, return to origin and WhatsApp.
