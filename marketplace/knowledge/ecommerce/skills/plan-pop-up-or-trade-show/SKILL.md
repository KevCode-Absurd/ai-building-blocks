---
name: plan-pop-up-or-trade-show
description: "A go or no-go plan for one pop-up shop, market stall or trade show: the full cost table, a break-even line in units or wholesale orders, the stock list, a staff rota, payment and tax set-up, consented lead capture, and a scorecard to judge it afterwards. Sets the event's one objective first (sell to shoppers or meet retail buyers), checks break-even against realistic footfall before money is committed, protects online stock, and measures any halo on online sales against a city that did not get the event. Use when the store is offered a stall, booth or pop-up space, or wants to test selling in person."
---

# Pop-up shop or trade show plan

**You get:** a one-page go or no-go for one event with costs, the break-even line and the realistic sales range side by side, plus a stock list, staff rota, payment and lead capture set-up and a post-event scorecard, ready for the client to approve before any booking fee is paid.

## When to use

- The store has been offered a pop-up space, a stall at a market or a booth at a trade show.
- The owner wants to test whether the product sells in person in a city with many online buyers.
- The brand wants to meet retail buyers in one place for wholesale orders.
- A past event "felt good" but nobody knows whether it made money.

## Not for

- A permanent shop or long lease: model it with `build-13-week-cash-forecast` and `monthly-store-pnl`; one-off events only here.
- Pitching shops after the show: use `find-and-pitch-retail-stockists` and `b2b-sales-follow-up-sequence`.
- Stunts whose payoff is attention, not sales: ask the `barnaby-wild-bets` agent, and keep it out of baseline plans.
- Event creative and social posts: use `seasonal-gifting-creative-plan` or the creative team.

## What you need

Required:

1. **Event offer**: dates, hours, space size, fee, deposit, what is included (table, power, lighting, Wi-Fi), cancellation terms, and the organiser's footfall numbers from past editions, with how they were counted.
2. **Gross profit per unit** at event prices for the SKUs to bring, from `build-sku-profit-sheet`.
3. **Stock on hand and reorder points** per SKU.
4. **Shopify order export** by city and pincode or zip, to see how many buyers live near the event.
5. **Quotes** for travel, stay, transport of stock and fixtures, display build or rental.

For trade shows add: the exhibitor list from last year, the buyer types the organiser invites, and the store's wholesale price list from `build-wholesale-price-list-and-terms`.

If footfall data is missing, ask the organiser in writing; without it, use the conservative range in step 3 and say so. Planning needs read access. Booking, paying deposits and buying fixtures are the client's actions, approved line by line.

## Before you start: the gates

1. **Gross profit per unit at the event.** Pass when it includes card and UPI fees, bags and packaging, and any discount offered at the stall [MEA-0037]. Fail: compute it first.
2. **Cash.** Fees, deposits and travel are paid before a single sale. Pass when the cash forecast survives the full cost even if sales are zero. Fail: no-go, or a cheaper format.
3. **Stock.** Pass when event stock can leave without taking any SKU below its online reorder point.
4. **Rules.** India: selling from a temporary stall in another state can need GST registration as a casual taxable person before the event; confirm with a chartered accountant. US: many states and cities need a temporary seller's permit to collect sales tax at events; check the event state. Leads: WhatsApp only with opt-in [EML-6320]; follow-up emails to US buyers follow CAN-SPAM [EML-6385].

## Steps

### 1. Pick one objective

- **Consumer pop-up or market:** sell units and collect consented contacts.
- **Trade show:** get in front of category buyers and leave with wholesale orders or booked follow-ups. If the store can already reach those buyers directly, a show may not be worth its cost and team time; decide on the objective, not habit.

Write the objective and the one number that judges it.

### 2. List every cost

Space fee, deposit at risk, display and signage, transport of stock and fixtures both ways, travel and stay, staff pay and food, samples and testers, payment devices, permits and registration, insurance if required, event-only print, wastage and damage. Add 10% for surprises (practitioner default).

### 3. Draw the break-even line

- **Pop-up:** break-even units = total cost / gross profit per unit at the event.
- **Trade show:** break-even opening orders = total cost / gross profit per average opening order. Count reorders only if past stockists actually reorder, using their real rate.

Realistic sales range: organiser footfall x share who stop x share of stoppers who buy. Practitioner defaults for planning, test them: 5 to 15% stop, 10 to 30% of those buy. Use the low end for the decision.

**Go** when the low-end range covers break-even. **No-go** when only the high end does. Physical retail is usually judged near break-even plus any lift online [FIN-0024]; treat that lift as upside, never inside break-even.

### 4. Plan the stock

- Bring best sellers plus 1 or 2 items that demo well.
- Quantity per SKU = mid-range expected units x 1.3 (practitioner default buffer), capped by the reorder-point gate.
- Pack testers and display units separately; they are cost, not stock.
- Keep a live count sheet by SKU for each day.

### 5. Plan staff

- At least two people at all times, so one can sell while one restocks or takes payment.
- Rota with breaks; nobody alone with cash.
- One-page brief: a 3-line demo, the price, the one event offer if any, how to take payment, how to capture contact details with consent.

### 6. Set up payments and tax

- Card reader plus UPI QR in India; card reader and mobile wallet in the US. Test both on the venue's network; carry an offline option.
- Cash float and a closing count.
- Ring every sale through the store's point-of-sale or a sales log so stock and tax reports stay right. Issue invoices where buyers ask; B2B buyers at trade shows need a GST tax invoice in India [FIN-6380].

### 7. Capture leads with consent

- **Shoppers:** QR code to a sign-up page tagged with UTMs for this event (`set-up-utm-tracking-for-all-channels`). Offer one event-only code to track later online orders.
- **WhatsApp:** only with an explicit tick or message from the shopper saying they want updates [EML-6320].
- **Trade buyers:** note name, shop, city, products of interest, next step and date. Follow up within 2 working days (practitioner default) through `b2b-sales-follow-up-sequence`. Offer samples to buyers who ask, not to everyone [OFF-0057].

### 8. Measure the halo

Physical presence can lift online sales near the location [MCR-0067]. Compare online orders from the event city for 30 days after with the 30 days before, against a similar city with no event. Count only the gap, and report it separately from event profit.

### 9. Score it afterwards

Within 7 days: units, revenue, gross profit, total cost, net result, contacts captured, opt-in rate, orders on the event code, wholesale orders and booked meetings, halo estimate, and a verdict: repeat, change or stop.

## Checks before you hand it over

- The objective is one line with one judging number.
- Every cost line has a quote or a marked estimate, plus the 10% buffer.
- Break-even and the low-end sales range sit side by side, and the go or no-go follows from them.
- No SKU drops below its online reorder point.
- Tax registration or permit needs for the event location are listed for the client to confirm.
- Lead capture has consent wording and UTM-tagged links.
- The halo test names a comparison city.
- Nothing is booked or paid without the client's yes.

## Output

1. **One-screen summary:** objective, total cost, break-even units or orders, low and mid sales range, go or no-go, and the runner-up option (a smaller format or skipping) in one line.
2. **Cost table:** Item, Quote or estimate, Amount, Paid when, Refundable (yes or no).
3. **Break-even sheet:** Gross profit per unit or per order, Total cost, Break-even, Footfall, Stop rate, Buy rate, Low and mid range.
4. **Stock list:** SKU, Units to bring, Online stock after, Reorder point, Testers.
5. **Staff rota:** Day, Hours, Names, Roles, Breaks.
6. **Lead capture kit:** sign-up URL with UTMs, consent line, event code, trade buyer note fields.
7. **Scorecard:** the metrics in step 9 with the verdict.

## Common mistakes

- **No single objective.** Step 1 picks one and its number.
- **Break-even on organiser footfall at face value.** Step 3 uses low-end stop and buy rates.
- **Counting the halo as profit.** Steps 3 and 8 keep it separate and measured [FIN-0024].
- **Emptying online stock.** Step 4 caps by the reorder point.
- **Contacts without consent.** Step 7 records opt-in before any WhatsApp message.
- **Slow follow-up after a trade show.** Step 7 sets 2 working days.

## Sources

- MEA-0037: gross profit includes payment fees and packaging.
- FIN-0024: physical stores judged near break-even plus online halo.
- MCR-0067: physical presence lifted nearby online sales.
- OFF-0057: samples pay when requested.
- EML-6320: WhatsApp opt-in and opt-out rules.
- EML-6385: CAN-SPAM for follow-up emails.
- FIN-6380: India GST tax invoice for trade buyers.

What makes this skill ours: the decision uses the low end of a footfall model, not the organiser's best case; the online halo is measured against a city without the event and kept out of break-even; event stock can never starve the website; and tax registration for selling in another state is flagged before booking.
