---
name: plan-monthly-email-calendar
description: "A month of email and SMS (and WhatsApp in India) campaign sends with a date, day, channel, segment, theme, featured products, offer and gross profit goal for each, sized to the store's revenue and list health, tied to stock cover so nothing sold out gets promoted, and checked against the profit plan so discount sends stay within one or two a month. Includes the month's dated moments for India and the US, subscriber exclusions, and an approval column. Use at the start of each month, before a launch or sale month, or when campaigns are planned the day they go out."
---

# Monthly email and SMS calendar

**You get:** a calendar sheet for one month with every campaign send (date, day, time, channel, segment, theme, products, offer, gross profit goal, writer, approval status), a one-screen summary, and the stock and profit checks that each send passed.

## When to use

- Campaigns are decided on the morning they go out.
- Sends are mostly discounts and the owner worries about margin.
- A launch, restock or seasonal moment is coming and email and SMS need to line up with it.
- At the start of each month, after the month's profit plan and stock report are ready.

## Not for

- The twelve-month sale and promotion plan: use `plan-yearly-sale-calendar`.
- Day-by-day planning of a big sale week: use `plan-peak-sale-week`.
- Writing each campaign: use `write-promo-campaign-email` or `email-copy-from-store-history`.
- Automated flows: use `email-sms-flow-plan`.

## What you need

Required (read access, level 1):

1. **Last 90 days of campaign results** from the email tool: send date, segment, recipients, click rate, placed order rate, revenue per recipient, unsubscribe and spam rates, per channel.
2. **Stock report**: units on hand and days of cover per SKU, and incoming stock dates.
3. **The month's profit plan**: revenue and gross profit targets, the discount depths allowed (from `how-deep-can-we-discount`), and the sale dates from `plan-yearly-sale-calendar` if there is one.
4. **Segment sizes** from `build-klaviyo-segments`.
5. **Launches and content**: new products, restocks, reviews, press, blog posts or videos ready this month.

Optional: SMS and WhatsApp message costs per market, founder availability for plain-text emails.

If the profit plan is missing, allow no more than one discount send and mark the month "no profit plan". Scheduling campaigns needs draft access (level 2); every send needs the client's yes in the approval column.

## Before you start: the gates

1. **Inbox health.** Pass when 90-day engaged campaigns open at 50% or more; consistent opens under 30 to 35% point to placement trouble [EML-0059]. Fail: plan fewer sends to the 30-day engaged group until it recovers.
2. **Gross profit per order** known for featured products. Fail: feature only full-price, healthy-margin products and no offers.
3. **Stock.** Each featured SKU needs days of cover beyond the send date plus delivery promise. Selling into a stock-out can hurt more than skipping the send; one brand even hid in-stock items and skipped peak email to avoid selling out [OPS-0019].
4. **Capacity.** Ask how many campaigns the team can write, design and check per week. The calendar never exceeds it.

## Steps

### 1. Set the send count

| Monthly revenue | Email campaigns a week |
|---|---|
| Under about 50k | 2 to 3 |
| 50k to 200k | 3 to 4 |
| Over 200k | 4 to 5 |

These bands come from one practitioner's rule; add sends only while opens stay above 30% [EML-0041]. Testing across many brands found 1 to 2 a week under-earns and 5 to 7 lifts unsubscribes and then plateaus [EML-0017] [EML-0063]. Use the store's own last 90 days: if click rate and unsubscribes held when sends rose, hold or add one; if unsubscribes or complaints climbed, step back [EML-0014].

SMS campaigns: about one a week, two for large brands, kept to launches, sales and restocks [EML-0025] [EML-0039]. India WhatsApp broadcasts: two to four a month to opted-in, engaged buyers (practitioner default, test it); automated journeys earn far more per message than broadcasts [EML-0048].

### 2. Mark the month's moments

List every dated moment first: product launches, restocks, the sale dates from the yearly plan, paydays if the store sees them in orders, and seasonal dates.

- **India:** festival dates move each year; check the current year's calendar for Diwali, Raksha Bandhan, Holi, Eid, Onam, Pongal and regional festivals in the store's main states. Plan for courier cutoffs before each.
- **US:** Valentine's Day, Mother's Day, Father's Day, back to school, Black Friday and Cyber Monday, holiday shipping cutoffs.

Every quarter should have one moment the store owns, not only the big shared ones [EML-0055].

### 3. Fill the theme mix

A practitioner mix: roughly equal shares of education, social proof, brand or community, and product highlights, with one or two sale emails a month, and about three or four designed emails per plain-text one [EML-0016]. Non-discount campaigns on one small topic each kept engagement up in one client's move from two to four sends a week [EML-0022].

| Theme | What it is | Typical product link |
|---|---|---|
| Education | How to use, routines, buying guides | Product used in it |
| Social proof | Reviews, photos, before and after, press | Reviewed product |
| Brand | Founder note, how it is made, values | Bestseller |
| Product | Launch, restock, bestsellers, bundles | The product |
| Offer | Sale or promotion from the profit plan | Only healthy-stock, healthy-margin SKUs |

### 4. Tie each send to stock and profit

For every send, pick featured products in this order: products with plenty of days of cover and above-average gross margin; then new launches; never products under the cover threshold.

For offer sends:

- Use only discount depths the profit plan allows; model each depth's break-even before use [OFF-0065].
- Keep straight sitewide discounts to once or twice a year, on high-margin or slow stock [OFF-0008].
- Write the offer's real end date and keep it.

Gross profit goal per send = recipients x the segment's past placed order rate x gross profit per order after any discount. Add the sends; compare with the month's retention gross profit target. Mark it "attributed planning figure".

### 5. Assign segments

Default audience is the 90-day engaged segment, sent broad about 80% of the time; use narrower segments for the rest (VIP early access, one-time buyers for second-order sends, at-risk buyers) [EML-0052]. Exclude active subscribers from sitewide sales, and give them a better subscriber-only offer if the sale is big [EML-0001] [OFF-0043]. Exclude Do not market every time.

### 6. Set days and times

Spread sends across the week; avoid two sends to the same person on one day. Use the store's own best send hours from the last 90 days. SMS sends in daytime windows (practitioner default: late morning or late afternoon [EML-0025]), and never at night in the recipient's time zone; US federal rules bar telephone solicitation before 8 a.m. or after 9 p.m. local time [EML-6323].

### 7. Add the review loop

Week 4 of the calendar holds a 30-minute review: each send's click rate, placed order rate and revenue per recipient against its goal, and one change for next month.

## Checks before you hand it over

- Send count per week fits the revenue band, list health and team capacity.
- Every featured SKU has stock cover past the send date plus delivery.
- Discount sends are no more than the profit plan allows, with break-even checked.
- Every send has a segment, with subscriber and Do not market exclusions.
- No person gets two sends in one day.
- SMS sends fall in daytime recipient hours.
- The gross profit goals add up and are labelled attributed.
- Every row has an approval cell left for the client.

## Output

1. **One-screen summary:** total sends by channel, the month's moments, the one or two offer sends with their depth, the gross profit goal, and anything at stock risk.
2. **Calendar sheet** (`email-calendar-<month>.csv`): Date, Day, Time, Channel, Segment, Exclusions, Theme, Subject idea, Featured SKUs, Stock cover check, Offer and end date, Gross profit goal, Writer, Designer, Status, Client approval.
3. **Stock check tab:** SKU, Days of cover, Incoming date, Featured on, OK to promote.
4. **Review tab** (filled in week 4): Send, Goal, Actual click rate, Placed order rate, Revenue per recipient, Change next month.

## Common mistakes

- **Planning on the day.** The calendar is set at the start of the month.
- **Promoting low-stock products.** Step 4 checks cover for every send.
- **A discount every week.** Step 3 holds offers to one or two a month.
- **Whole-list sends.** Step 5 defaults to the engaged segment.
- **Sale emails to subscribers.** Step 5 excludes them.
- **Texts at night.** Step 6 keeps SMS to daytime hours.

## Sources

- EML-0041, EML-0017, EML-0063, EML-0014, EML-0022: send counts and cadence.
- EML-0025, EML-0039: SMS cadence and timing.
- EML-0016: theme mix and plain-text share.
- EML-0052: send broad to engaged.
- EML-0059: inbox floor.
- EML-0001, OFF-0043: subscriber exclusions and offers.
- EML-0048: WhatsApp journeys beat broadcasts.
- EML-0055: own one moment per quarter.
- EML-6323: US 8 a.m. to 9 p.m. window.
- OFF-0008, OFF-0065: discount limits and break-even.
- OPS-0019: do not sell into a stock-out.

What makes this skill ours: every send is checked against stock cover before it is planned; offer sends come only from the profit plan's allowed depths; each send carries an attributed gross profit goal that adds up to the month's target; and India's moving festival dates and courier cutoffs are planned from the current year's calendar.
