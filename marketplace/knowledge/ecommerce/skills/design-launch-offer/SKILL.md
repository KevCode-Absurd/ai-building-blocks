---
name: design-launch-offer
description: "A launch offer for a new product or a new store that pulls in the first buyers without teaching them to wait for discounts: the launch price, the one launch perk (founding-buyer gift, early access, second-order credit, numbered first batch or a capped intro price), who qualifies, the hard end date, the stock cap, what happens on full-price day, and the contribution per order and break-even ROAS of each option. Starts from the price the product can defend before reviews exist, picks the perk by what stops a first buyer, and keeps every scarcity and end-date claim true. Use before launching a product, a new range or a new store, or when a launch is planned around a big discount."
---

# Launch offer design

**You get:** a one-page launch offer sheet: the launch price, one launch perk with its exact terms, start and end date, who qualifies, the unit cap, the cost and contribution per order, the break-even ROAS, the full-price-day plan, and three offer lines for ads, page and email, all checked against margin and stock.

## When to use

- A new product, range or store goes live in the next 2 to 8 weeks.
- The team plans to "launch at 30% off" and nobody has checked what that teaches buyers.
- A waitlist or pre-order is building and needs a reward that is not a discount.
- A launch underperformed and the team must decide whether price or proof is the problem.

## Not for

- The ads, teaser and last-call creative for the launch: use `product-launch-creative-kit`.
- The launch email sequence: use `write-product-launch-email-sequence`.
- Testing demand before buying stock: use `validate-demand-before-buying-stock`.
- Setting the long-term price itself: use `set-prices-from-costs-and-competitors`, then come back.

## What you need

Required:

1. **Product cost sheet:** landed cost per unit, delivery cost per order, payment fees, expected return and RTO rate (from similar products if new).
2. **Planned full price** and the prices of 3 to 5 close alternatives buyers will compare (live URLs, checked on the day).
3. **Launch stock:** units arriving, date, and the restock lead time.
4. **What proof exists:** reviews from testers, press, creator use, founder story, test results with their source.
5. **Expected ad cost per purchase**, from current campaigns or `store-meta-math`.

Optional: waitlist or email list size, past launch results, best-selling existing product to pair with.

If costs are missing, stop and run `build-sku-profit-sheet` or `calculate-landed-cost-per-unit`. Setting up discount codes, gifts or pre-orders needs draft access (level 2); going live needs the client's yes.

## Before you start: the gates

1. **Contribution per order at full price is known** (price minus delivered cost). Fail: stop; no launch offer can be checked.
2. **Stock and restock.** Selling out is fine only if restock lands within about two weeks; longer gaps waste the launch traffic [ORG-0038]. Fail: cap the offer to the units you have and plan a waitlist for the rest.
3. **Cash.** The launch budget (ads, gifts, samples) plus the stock bill must fit the cash plan; check with `build-13-week-cash-forecast`.
4. **Truth.** Every end date, unit cap and "first batch" claim must be real. False urgency and limited-stock claims you cannot prove are misleading under India's ASCI rules [ADC-6147] and US law. Fail: drop the claim.

## Steps

### 1. Name what stops the first buyer

A new product has no reviews, no track record and an unfamiliar price. Pick the main barrier from tester feedback, waitlist replies, pre-launch survey or chats:

- **"Will it work for me?"** (no proof) leads to risk reversal, a sampler or trial size, or a founding-buyer review programme.
- **"Is it worth this price?"** (unfamiliar price) leads to a price check (step 2) and value framing, not a deep cut.
- **"Why now?"** (no reason to act) leads to a real launch window, numbered first batch or early access.

### 2. Check the price can stand before reviews exist

Compare the planned price with the alternatives buyers see. A premium price needs visible proof. One apparel brand launched at a luxury price with no reviews, sold a tenth of its day-one plan, then cut step by step to about 69 dollars and sold out within weeks, refunding the difference to day-one buyers [OFF-0070]. If the price sits well above alternatives and proof is thin, either lower the everyday price now (and keep it) or delay until proof exists. Do not launch high and "discount to normal": that teaches buyers the list price is fake.

### 3. Pick one launch perk

Rank these by contribution per order and by what they teach buyers. Use only one; stacking perks makes the full price look like a penalty later.

| Perk | Best for | Teaches buyers |
|---|---|---|
| Founding-buyer gift (useful add-on, listed for sale at its real price) | proof gap, first order | value, not waiting |
| Credit on the second order | consumables, refills | to come back [OFF-0012] |
| Early access for the waitlist, full price | strong waitlist | to join the list |
| Numbered first batch, full price | design or craft products | that it sells out |
| Capped intro price (first N units or first X days) | price-sensitive category | to buy early, only if the cap is real |
| Trial or sample size, buyer asks for it | "will it work for me" | to try, not to wait [OFF-0057] |

Rules:

- Choose the entry product and perk by which first purchase leads fastest to a second one; a gift pays when it cuts cost per new customer by more than it costs [OFF-0073].
- A waitlist with product rewards for referrals can grow the list faster than cash rewards [ORG-0030].
- If the perk is a discount, keep it 15 to 20% at most and check it against `how-deep-can-we-discount`. Small codes often lose money without moving buyers [OFF-0014].
- In the US, a "free" gift needs a stable paid price and terms stated up front [OFF-6500].

### 4. Cost the perk

For each shortlisted perk:

- Contribution per order = launch price minus delivered cost minus perk cost.
- Break-even ROAS = launch price / contribution per order. A deep launch discount can double or triple it [OFF-0065].
- Units the perk can cover = cap x perk cost; check the cash.

Pick the perk with the best contribution per order that still answers the barrier from step 1. Runner-up in one line.

### 5. Write the terms so they cannot leak

- Start date, end date and time, time zone.
- Who qualifies (waitlist, first N orders, everyone).
- Cap (units or orders), and what the page says when the cap is reached.
- One use per customer; does not stack with other codes.
- What happens on full-price day: the page, ads and emails switch on that date, the perk is removed and is not brought back for at least the rest of the season.

### 6. Plan full-price day and the restock

- The day after the window, the price and offer must match everywhere: product page, cart, ads, catalog feed, emails.
- If the first batch sells out, a restock announcement can itself sell strongly [WLD-0012]; collect back-in-stock sign-ups instead of discounting.
- Book a check at day 14: conversion and contribution at full price against the launch window. If full price does not convert, the problem is price or proof, not the end of the discount.

### 7. India and US notes

- **India:** offer the perk on prepaid orders, or add a small COD fee shown on the product page, to protect against RTO on a new product; collect the waitlist on WhatsApp only with clear opt-in; never show a launch price against an MRP the product was never sold at. Launching inside a festival week means competing with deep discounts; a gift or early access usually reads better than another percentage.
- **US:** an "introductory price" must actually rise when stated; do not compare to a "regular" price that was never charged [OFF-6145].

## Checks before you hand it over

- The launch price is compared with live alternatives, with dates.
- Exactly one perk is chosen, with its contribution per order and break-even ROAS.
- The end date, cap and full-price-day switch are written down.
- Every scarcity or "first batch" claim can be proven with stock records.
- Stock covers the cap, and restock timing is stated.
- No discount deeper than the product's safe ceiling.
- Nothing was set live without a client yes.

## Output

**One-screen summary:** launch price, chosen perk, window, cap, contribution per order and break-even ROAS, why this perk (the barrier it answers), runner-up in one line.

**Launch offer sheet:**

| Field | Value |
|---|---|
| Product and variant | |
| Full price (net of GST or before sales tax) | |
| Launch price | |
| Perk and its real price or cost | |
| Who qualifies | |
| Start and end (date, time, zone) | |
| Cap and sold-out message | |
| Delivered cost per order | |
| Contribution per order (launch / full price) | |
| Break-even ROAS (launch / full price) | |
| Stock on hand, restock date | |
| Full-price-day switch list (page, cart, feed, ads, emails) | |
| Day-14 check: metric and pass line | |

**Offer lines:** one line each for ad, product page and email, stating exact terms and end date. **Assumptions:** where the cap, end date or perk cost was not given, the figure used, one line each.

## Common mistakes

- **Launching high, then "discounting to normal".** Step 2 fixes the everyday price first.
- **Stacking perks.** Step 3 allows one.
- **Fake scarcity.** The gates and step 5 tie every cap to stock records.
- **Discount that never ends.** Step 5 sets the switch date and step 6 checks it happened everywhere.
- **Reading a weak full-price week as "needs another sale".** Step 6 asks whether price or proof is the gap.
- **Ignoring restock.** Gate 2 caps the offer to real stock.

## Sources

- OFF-0070: luxury launch price without proof failed; lower price sold out.
- ORG-0038: selling out is fine only if restock is fast.
- ORG-0030: referral waitlist with product rewards.
- OFF-0012: put the bonus on the second order.
- OFF-0057: samples work when the buyer asks for them.
- OFF-0073: gifts pay when they cut cost per new customer.
- OFF-0014, OFF-0065: small codes lose money; deep ones raise break-even ROAS.
- WLD-0012: restock announcements sell.
- ADC-6147, OFF-6145, OFF-6500: false urgency, genuine former prices, free-offer terms.

What makes this skill ours: the price is tested against what a store with no reviews can defend before any perk is chosen; the perk is picked by the barrier stopping the first buyer and by what it teaches buyers, not by habit; one perk only, with a written full-price-day switch; and every cap and end date must be provable from stock records.
