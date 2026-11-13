# Memory foam mattress page: the first five tests

## Summary

Mobile is the problem. It brings 84% of sessions but converts at 0.56%, against 1.44% on desktop. The biggest loss comes before add to cart: 403,200 mobile sessions in 30 days ended without one.

Ship four low-risk fixes this week. Then run five tests, two at a time, from 23 November to 14 February, each able to detect a 10% lift in orders per session. Start with the mobile size picker.

## What the funnel says

| Step (last 30 days) | Mobile | Desktop |
|---|---|---|
| Session to add to cart | 4.0% | 6.5% |
| Add to cart to checkout | 42.3% | 50.0% |
| Checkout to order | 33.1% | 44.2% |
| Session to order | 0.56% | 1.44% |
| Gross profit per session | ₹34 | ₹88 |

Mobile trails at every step. As a ceiling, not a forecast: if mobile add to cart matched desktop, that is about 1,469 more orders a month (₹89 lakh gross profit). If mobile checkout completion matched desktop, about 790 (₹48 lakh). Some gap is natural: many people research on a phone and buy on a laptop.

## Ship this week without testing

1. **Rating under the title:** "4.5 stars, 20,000+ reviews", tapping through to the reviews. True, already on the page, near-zero risk.
2. **Trial under the button:** "100-night trial" under Add to cart, linked to the terms. Watch the trial return rate monthly.
3. **Price labelled with its size,** so the change after picking a size reads as expected.
4. **Tracking check:** analytics purchases within 5% of real orders for the same days, and the testing tool respects the consent banner. Fix this before any test starts.

Both versions of every test carry these, so they add no bias.

## The five tests, ranked by profit at stake and evidence

### 1. Mobile size picker in two steps

- **Problem and evidence:** 30+ size combinations in one long list. Mobile add to cart is 4.0% against 6.5% on desktop, the largest loss in the funnel.
- **Change:** first pick the bed size by name (for example Single, Queen, King), then pick from the few dimensions and thicknesses for that size. Keep custom size. Pre-select nothing, to avoid wrong-size orders.
- **Hypothesis:** If size takes two short steps, more mobile visitors will order, because they find their size without scrolling a long list.
- **Main metric:** orders per mobile session. **Guardrails:** average order value; size-related returns and exchanges.

### 2. Delivery date on the product page

- **Problem and evidence:** the delivery date first appears at checkout. On mobile only 42.3% of carts reach checkout (50.0% on desktop); 4,750 reached checkout without ordering.
- **Change:** a pincode box under the size picker showing the delivery date, from the same source checkout uses.
- **Hypothesis:** If shoppers see the delivery date before adding to cart, more will finish the order, because the date no longer surprises them at checkout.
- **Main metric:** orders per session. **Guardrails:** cancellations before dispatch; share delivered by the date shown.

### 3. EMI and cash on delivery under the price

- **Problem and evidence:** EMI and COD appear only at checkout, where mobile loses two in three shoppers. On a ₹14,500 order, the monthly amount can decide the sale.
- **Change:** under the price, the lowest EMI per month for the chosen size, linked to the plans, and a line listing the payment ways checkout offers, including COD. Say "no-cost EMI" only if checkout's plans are no-cost.
- **Hypothesis:** If shoppers see EMI and COD before checkout, more will order, because how to pay is no longer an open question.
- **Main metric:** delivered or prepaid orders per session, read 3 weeks after the test ends so COD returns settle. **Guardrails:** COD share; return-to-origin rate; average order value.

### 4. Product-first hero image

- **Problem and evidence:** the hero is a bedroom with the mattress small in frame, so a phone's first screen barely shows the product. Evidence is thinner here.
- **Change:** the first image shows the mattress filling the frame, layers visible. The bedroom scene moves to second. Same file weight.
- **Hypothesis:** If the first image shows the mattress clearly, more visitors will order, because they see what they are buying at once.
- **Main metric:** orders per session. **Guardrails:** mobile load time of the first image; average order value.

### 5. Reviews above the image tiles

- **Problem and evidence:** 4.5 stars from 20,000+ reviews sit below six image tiles, so a phone shopper scrolls past six images before seeing proof.
- **Change:** move the review block (rating breakdown and the most helpful published reviews) above the tiles.
- **Hypothesis:** If proof comes before the gallery, more visitors will order, because they see what 20,000+ buyers think before they lose interest.
- **Main metric:** orders per session. **Guardrails:** page speed; average order value.

## Split, run time and minimum effect

| Test | Split | Detects (smallest lift) | Per version | Run | Dates | Gross profit a month at that lift |
|---|---|---|---|---|---|---|
| 1 Size picker | Mobile only, 50/50 | 10%: 0.560% to 0.616% | 284,400 | 6 weeks | 23 Nov to 3 Jan | ₹14.3 lakh |
| 2 Delivery date | All devices, 50/50 | 10%: 0.700% to 0.770% | 227,000 | 4 weeks | 23 Nov to 20 Dec | ₹21.3 lakh |
| 3 EMI and COD | Same as 2 | Same as 2 | 227,000 | 4 weeks, then 3 to settle | 4 Jan to 31 Jan, read 21 Feb | ₹21.3 lakh |
| 4 Hero image | Same as 2 | Same as 2 | 227,000 | 4 weeks | 21 Dec to 17 Jan | ₹21.3 lakh |
| 5 Reviews | Same as 2 | Same as 2 | 227,000 | 4 weeks | 18 Jan to 14 Feb | ₹21.3 lakh |

**The working.** Visitors per version = 16 × (1 − baseline) ÷ (baseline × lift²). Test 1: 16 × 0.9944 ÷ (0.005595 × 0.01) = 284,357. Weekly mobile sessions are 420,000 × 7 ÷ 30 = 98,000, so two versions take 5.8 weeks, rounded to 6. All-device tests: 226,971 per version at 116,667 sessions a week is 3.9 weeks, rounded to 4. An 8% lift would take 9.1 weeks on mobile and 6.1 on all devices, which is too long.

Profit at that lift = 10% more orders × ₹6,090 gross profit per order. A threshold, not a forecast.

**In plain words.** The sums use 95% confidence and 80% power. A change that does nothing will look like a winner only 1 time in 20. A real 10% lift will be caught 4 times in 5. Read each test with a two-proportion test.

## Rules for every test

1. Split by visitor, 50/50; a visitor always sees one version. Use a server-side or template split, not a script that flashes the old page.
2. Two tests run at once, each with its own random split. Lane one: test 1, then 3. Lane two: tests 2, 4, 5. At each readout, check the result holds in both versions of the other live test.
3. Read results only at the planned end; check weekly for harm only. Stop early only if a version breaks, a guardrail gets more than 10% worse, or the split drifts from 50/50 (chi-square test on visitors, day 2 and at the end).
4. Ship when orders per session rise at 95% confidence and gross profit per session rises with no guardrail breach. Flat at full sample means the effect is under 10%: keep the version that is cheaper to maintain. A loss keeps the current page.
5. Read two segments only: mobile and desktop.
6. Do not start or end a test during a sale. If one falls inside, both versions see it and the readout says so.

## Assumptions

- Sessions stand in for visitors. If the tool splits by user, rerun the sum with weekly users and orders per user.
- Gross profit per order is ₹6,090 (42% of ₹14,500), before shipping, payment fees, returns and return-to-origin. Swap in delivered profit when known.
- On-page EMI, COD and delivery data come from the systems checkout uses.
- No price change on this mattress while a test runs.
