---
name: plan-yearly-sale-calendar
description: "A twelve-month promotion calendar for a store: every sale and full-price moment by date, the mechanic and depth of each, the products in and out, the stock that must be on hand and the purchase-order date to get it there, and a yearly discount budget that caps how much gross profit promotions may give away. Built from the store's own weekly sales history, each product's discount ceiling, supplier lead times, cash and the retail calendars of each market the store sells to. Limits sitewide sales, keeps 'was' prices and free offers legal, and plans full-price moments between sales so buyers do not learn to wait. Use at the start of a year or season, when the store runs a sale every month, or when stock keeps arriving after the sale it was bought for."
---

# Yearly sale calendar

**You get:** a twelve-month calendar sheet with one row per promotion or full-price moment (dates, mechanic, depth, products in and out, stock needed and PO date, expected contribution, owner, approval date), a yearly discount budget with a running total against its cap, and a one-screen summary of the year.

## When to use

- Planning the coming year or the next two quarters.
- The store discounts so often that full-price weeks have gone quiet.
- Stock for a big sale keeps arriving late, or sells out before the peak.
- The owner wants to know how much margin promotions cost last year and what to allow this year.

## Not for

- The day-by-day plan for one big sale week: use `plan-peak-sale-week`.
- The discount ceiling per product: use `how-deep-can-we-discount` (this skill reads its output).
- The monthly email and SMS schedule: use `plan-monthly-email-calendar`.
- Creative for one gifting season: use `seasonal-gifting-creative-plan`.

## What you need

Required (read access):

1. **Shopify order export**, 12 to 24 months: Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Code, Discount Amount, Subtotal. Group by week.
2. **Past promotions list**: name, dates, mechanic, depth, products. Rebuild it from discount codes if nobody kept one.
3. **Discount ceiling sheet** from `how-deep-can-we-discount`.
4. **Supplier lead times** (production plus transit) and minimum order per SKU, from POs or `set-reorder-points-and-safety-stock`.
5. **Cash plan** for the year or the next 13 weeks (`build-13-week-cash-forecast`).
6. **Planned launches and restocks.**

Optional: cohort repeat data by month (`cohort-repeat-and-ltv-analysis`), marketplace event dates the store joins, warehouse capacity per day.

If history is under 6 months, plan one quarter only and mark the rest "draft". Creating codes or scheduling price changes needs draft access (level 2) and a client yes for each event.

## Before you start: the gates

1. **Ceilings exist.** Every product in a sale has a discount ceiling from delivered cost. Fail: no depth is planned for that product.
2. **Cash and stock can carry the peaks.** The biggest event's stock bill must fit the cash plan in the month it is paid. Fail: shrink the event or move the PO.
3. **Capacity.** Peak orders per day must fit the warehouse and support team, with a written pick-time promise from the 3PL [OPS-0015]. Fail: cap the event or add staff.
4. **Legal timing.** A "was" price needs a real period at that price before the sale [OFF-6145]. In the US, one product size should not carry a free-gift offer more than 6 months in any 12 [OFF-6500]. In the EU, a price cut must be shown against the lowest price of the prior 30 days, and UK rules expect the 'was' price to be a genuine, recent selling price.

## Steps

### 1. Read last year

From the order export, chart weekly gross profit (not revenue) and mark every promotion. For each, note: discount money given away, orders, new customers, and what happened in the two weeks after (did sales dip as buyers waited?). Add up the year's discount money as a share of gross profit. This is the baseline the cap is set against.

### 2. Mark the fixed dates

Lay out the year by week and add:

- **Every market:** national holidays, local festivals, end-of-season sales, and the big marketplace event sales if the store sells there (dates change each year; confirm them).
- **US:** Valentine's Day, Mother's Day, Memorial Day, Fourth of July, Prime Day if on Amazon, Labor Day, Black Friday to Cyber Monday, holiday shipping cutoffs, after-Christmas.
- **UK and EU:** Valentine's Day, Mothering Sunday (UK, March) and Mother's Day (May in many EU countries), Easter, summer and winter sales (set dates in some countries, such as France), Prime Day if on Amazon, Singles' Day, Black Friday to Cyber Monday, Christmas postal cutoffs, Boxing Day.
- **Canada and Australia:** Boxing Day in both; Thanksgiving in October in Canada; end of financial year sales in June and Click Frenzy in Australia.
- The store's own dates: founding day, launches, restocks.

Keep only the dates where the store's buyers actually buy (check last year's weeks), not every holiday.

### 3. Set the yearly discount budget

- Agree a cap with the owner: the discount money the year may spend, as a share of planned gross profit. Use last year's share as the start and lower it if margins were squeezed. There is no universal number; practitioner default is to hold or cut it, never raise it without cohort proof.
- Limit straight sitewide discounts to once or twice a year, aimed at high-margin or slow stock [OFF-0008].
- Every other promotion uses a cheaper mechanic: gift with purchase, bundle, free shipping threshold, early access, category sale.

### 4. Place the events

For each chosen date write: mechanic, depth (never above any included product's ceiling), products in, products out, audience (everyone, list only, subscribers, past buyers).

Rules:

- **Space sales.** Leave full-price weeks between events so the regular price stays real; a product always on sale has no regular price.
- **Fill the gaps with full-price moments:** launches, restocks, gift guides, new content, bundles. A restock can sell as hard as a sale [WLD-0012].
- **Protect subscribers.** During a sitewide sale give subscribers a better subscriber-only offer, or they cancel to buy the public deal [OFF-0043].
- **Pre-build a ladder** for the biggest event (deeper discount, gift, free shipping, bundle) with each rung's break-even worked out, so nobody improvises on the day [OFF-0068] [OFF-0069].
- **Price the peak's customers fairly.** If the store's November buyers repeat less than other months, set a lower cost-per-customer allowance for that event [MEA-0035].
- **Start building demand before the peak.** Ad spend weeks before a big sale can pay back during it; measure it with a window that includes the sale [MEA-0034].

### 5. Work back the stock

For each event:

- Units needed = normal weekly sales x weeks of the event x expected lift from a similar past event (or the break-even lift if none) + safety stock.
- PO date = event start minus supplier lead time minus inbound and receiving buffer.
- Customs and paperwork checked well before the peak; one missing document can strand peak stock [OPS-0001].
- If stock cannot arrive, drop the product from the event; never advertise what cannot ship.
- Decide what happens if a hero product sells out before the peak. One fast-growing brand hid in-stock items rather than sell out into December [OPS-0019]; choose a cap per product in advance.

### 6. Run the budget total

Add each event's expected discount money (discount per order x expected orders) to a running total. When the total passes the cap, cut depth, shorten an event or switch it to a cheaper mechanic. Show the expected contribution of each event, not just revenue.

### 7. Set the review rhythm

- Each event gets an approval date (4 to 6 weeks before for big events) and an after-sale read within 14 days: contribution, new customers, dip after, stock left.
- Review the calendar each quarter and move events that underperformed into cheaper mechanics.

## Checks before you hand it over

- Every event's depth is at or below the lowest ceiling of its products.
- The yearly discount total is shown against the agreed cap and stays under it.
- Sitewide straight discounts appear at most twice.
- Each event has stock needed, PO date and a capacity check.
- Full-price moments sit between sales; no product is discounted back to back.
- "Was" prices and free offers meet the timing rules for each market.
- Every event has an owner, approval date and after-sale read date.

## Output

**One-screen summary:** number of events by mechanic, sitewide sales count, yearly discount budget and planned total, the three biggest events with expected contribution, stock and PO risks, and one change from last year.

**Calendar sheet** (`sale-calendar.csv` or Google Sheet):

| Event | Start | End | Market | Type (sale, gift, bundle, early access, full-price moment) | Depth or perk | Products in | Products out | Audience | Ceiling check | Units needed | PO date | Capacity check | Expected orders | Expected discount money | Running discount total | Expected contribution | Owner | Approval date | After-sale read date |

**Budget block:** last year's discount money and share of gross profit, this year's cap, running total by quarter.

**Assumptions:** the cap, marketplace event dates and supplier PO dates used where not given, one line each with what moves if it changes.

## Common mistakes

- **Planning on revenue.** Step 1 charts gross profit and step 6 shows contribution per event.
- **A sale every month.** Step 3 caps the budget and step 4 spaces sales with full-price moments.
- **One depth for all.** Step 4 checks every included product's ceiling.
- **Stock that lands after the sale.** Step 5 works back PO dates from lead time.
- **Subscribers cancelling to buy the sale.** Step 4 gives them a better private offer.
- **No after-sale read.** Step 7 books it, so next year's calendar learns.

## Sources

- OFF-0008: sitewide discounts once or twice a year.
- OFF-0068, OFF-0069: pre-built offer ladder with break-even per rung.
- OFF-0043: subscriber-only offer during sitewide sales.
- MEA-0035, MEA-0034: November cohorts and preseason spend.
- WLD-0012: restocks as full-price moments.
- OPS-0001, OPS-0015, OPS-0019: customs, 3PL pick promises, sell-out risk at peak.
- OFF-6145, OFF-6500: genuine former prices; US free-offer frequency.

What makes this skill ours: the year gets a discount budget measured in gross profit with a running total, not a list of holidays; every event is checked against each product's own ceiling; stock is worked back to a PO date and a capacity check; and full-price moments are planned between sales so the regular price stays real and legal.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Plan Republic Day, Holi, end-of-season sales, Independence Day, Raksha Bandhan, Navratri and Dussehra, Diwali, wedding season, and the big marketplace festival sales if the store sells there (dates change each year; confirm them).
