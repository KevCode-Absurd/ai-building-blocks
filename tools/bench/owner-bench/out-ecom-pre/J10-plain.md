# Plum Goodness: three bundles, the free shipping line, and how to test them

## The short version

- Launch three bundles built on the pairs people already buy, priced as a clear ladder: **Serum + Lip Balm ₹749**, **Hair Wash Duo ₹749**, **Vitamin C Glow Routine ₹999**.
- Move free shipping from ₹499 to **₹599**, not ₹699. At ₹599 the vitamin C serum on its own still ships free. That protects your best reorder.
- Test bundles first for 4 weeks, then the threshold for 4 weeks. Judge both on profit per visitor, not on order value alone.

## What I assumed

- **Volume.** Your pair table implies about 16,000 multi-item orders in 90 days. At 31% of orders, that is about **17,000 orders a month**. Monthly pairs: face wash + serum 1,033, shampoo + conditioner 467.
- **Product cost** = price × (1 − category margin). Lip balm is costed as makeup (55%, ₹90), the safe choice. Serum ₹192, face wash ₹110, shampoo and conditioner ₹152 each.
- **"Profit"** means price plus any fee, minus product cost, minus ₹70 shipping.
- COD is 40% of orders in every price band.

## The three bundles

| Bundle | What's in it | Price (separately) | Saves | Main shopper | Job it does |
|---|---|---|---|---|---|
| Serum + Lip Balm | Vitamin C serum, lip balm | ₹749 (₹798) | ₹49 | Ishita | Smallest step up from the one product people reorder |
| Hair Wash Duo | Shampoo, conditioner | ₹749 (₹798) | ₹49, plus no ₹49 fee vs shampoo alone | One-item shoppers | Turns a ₹399 order that pays a fee into a free-shipping order |
| Vitamin C Glow Routine | Green tea face wash, vitamin C serum, lip balm | ₹999 (₹1,143) | ₹144 (13%) | Kavya | Answers "which face wash goes with the serum" and builds a full routine basket |

On the serum page, show a ladder: serum ₹599, serum + lip balm ₹749, full routine ₹999. One clear choice per step, nothing that looks like a clearance pile.

### 1. Serum + Lip Balm, ₹749

- **Job:** Ishita reorders the serum only. This adds what people already add (lip balm + any item is your second most common pair). It is a small, known step: ₹150 more.
- **Money:** profit ₹398 vs ₹337 for serum alone, so **+₹61** per step-up. Shoppers who already buy both cost ₹49 each. If 1 in 4 of your 533 monthly lip balm pairs includes the serum, that is about ₹6,500 a month. Break-even: about **107 step-ups a month**.
- **Page line:** "Your favourite vitamin C serum, plus a lip balm for just ₹150 more. 100% vegan, always."

### 2. Hair Wash Duo, ₹749

- **Job:** shampoo alone costs ₹399 + ₹49 shipping. For ₹301 more, the shopper gets conditioner and no fee. It also moves COD orders from the under-₹500 band (29% refused) to the ₹500 to 999 band (17%).
- **Money:** profit ₹376 vs ₹226 for shampoo alone, so **+₹150** per step-up. Current pair buyers switching cost ₹49 × 467 = about ₹22,900 a month. Break-even: about **153 step-ups a month**. Each COD step-up also saves about ₹15.60 in expected refusal cost.
- **Page line:** "Shampoo and conditioner that work together. Save ₹49 and get free shipping."

### 3. Vitamin C Glow Routine, ₹999

- **Job:** Kavya's answer: cleanse, glow, lip care, in one box. The third item is on purpose. A plain face wash + serum deal would just discount 1,033 orders a month that already happen. This makes a bigger basket, not a cheaper one.
- **Money:** profit ₹537. That is **+₹200** vs a serum-only order and ₹35 less than today's pair at full price (₹572). If every pair buyer switched, that costs about ₹36,200 a month. Break-even: about **181 step-ups a month**.
- **Why not a ₹849 duo?** Each step-up would earn only +₹140, and break-even would need about 700 a month. Too high.
- **Page line:** "Not sure which face wash goes with your serum? This one. Three steps, ₹144 saved."

A body lotion + body wash duo is the natural next bundle if these work.

## Free shipping: move to ₹599

**Today:** shipping costs ₹11.9 lakh a month. The ₹49 fee on the 40% of orders under ₹499 brings back ₹3.3 lakh. Net: **₹8.6 lakh a month, about ₹50 an order**. COD refusals add about ₹1.8 lakh, over half from orders under ₹500.

**Who ₹599 affects:** only orders from ₹499 to ₹598. The serum alone stays free. I assume this slice is about 6% of orders (about 1,000 a month). Check it in your order export first.

**Money at ₹599**, assuming 45% add an item (about ₹109 profit, like a lip balm), 40% pay the ₹49, and 15% walk away (₹271 profit lost on a typical ₹550 order):

| Outcome | Orders | Effect per month |
|---|---|---|
| Add an item | 450 | +₹49,000 |
| Pay ₹49 | 400 | +₹19,600 |
| Walk away | 150 | −₹40,700 |
| **Net** | | **about +₹28,000 a month (₹3.4 lakh a year)** |

It stays profitable while fewer than about **1 in 4** of these shoppers walk away (about 15% if nobody adds an item).

**Why not ₹699?** It puts the fee on the serum-only order, Ishita's one reorder, and touches about 4,250 orders a month. With 60% paying, 25% adding and 15% walking, it earns about +₹26,000, no more than ₹599. At 20% walking, it loses about ₹56,000 a month. Four times the shoppers at risk for the same gain.

**Why move at all?** Every bundle clears ₹599, so the new line mostly asks small two-item carts to add a little. Low risk, honest, and worth about ₹3.4 lakh a year.

In the cart, show "Add ₹X more for free shipping" with a simple progress bar. No timers.

## How to test both safely

**Order of work.** Bundles first (weeks 1 to 4), then the threshold (weeks 5 to 8). Change both at once and you cannot tell which moved the numbers. Keep the ₹49 fee, COD rules and other offers fixed, and run no sitewide sale during the tests.

**Main score:** profit per visitor (margin plus fees, minus shipping and refusal cost, divided by visitors). AOV alone can rise while profit falls.

**Bundle test**
- Split visitors 50/50. One half sees bundles on the serum, face wash, shampoo and conditioner pages and in the cart.
- Track: take rate per bundle; how many buyers already bought that pair before; serum-only order share; COD refusals on bundle orders.
- Pass: each bundle beats its break-even (107, 153, 181 step-ups a month) and profit per visitor is up.
- Stop: if profit per visitor is down more than 3% after 2 weeks, pull and reprice. Cut the discount first.

**Threshold test**
- Split visitors 50/50, ₹499 vs ₹599, same group on return visits. If anyone asks support, honour ₹499.
- Run a full 4 weeks to cover a month of pay days and pocket money.
- Track: conversion rate; stalled carts between ₹499 and ₹598; serum reorder rate; shipping complaints.
- Stop: if more than 1 in 4 carts in that range are abandoned, or serum reorders drop, go back to ₹499.

**Brand checks:** every bundle page says "100% vegan, always", shows price and savings in rupees, and has no timers, "only 2 left" or "chemical-free" claims.
