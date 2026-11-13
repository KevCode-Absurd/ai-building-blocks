---
name: plan-product-line-extension
description: "The next product a store that already sells should add, chosen from its own evidence: what buyers ask for in reviews, tickets, chats and surveys, what first products lead to repeat orders, which buyer groups are growing, and the gross profit and cash each idea would need. Scores five to ten candidates, picks one and a runner-up, and writes a one-page launch brief (buyer, job, spec outline, price and margin, first order size, launch dates and the demand test to run first). Use when the hero product is carrying the store, repeat orders are flat, buyers keep asking for something the store does not sell, or before a supplier visit."
---

# Plan the next product

**You get:** a scored list of 5 to 10 candidate products drawn from the store's own buyers and data, one pick and a runner-up, and a one-page launch brief for the pick that a supplier, a designer and the ad team can all work from.

## When to use

- One hero product brings most of the revenue and the owner worries what happens when it slows.
- Repeat orders are flat because there is nothing else to buy.
- Buyers keep asking for a size, refill, flavour, accessory or companion product.
- Before a sourcing trip or a supplier's new-sample season.

## Not for

- A store with no sales yet: use `find-trending-products` and `niche-size-and-competition-check`.
- Testing whether buyers will pay before stock: run `validate-demand-before-buying-stock` on the pick.
- Writing the factory spec: use `write-product-spec-sheet-for-factory`.
- Ranking current products to push or cut: use `rank-products-to-push-or-cut`.

## What you need

Required:

1. **Shopify order export**, 12 months or more: Name, Email (hashed or customer ID is fine), Created at, Lineitem name, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Shipping Country or Shipping Zip.
2. **Gross profit per SKU** from `build-sku-profit-sheet`.
3. **Buyer requests:** reviews export (CSV), support tickets or chat logs (Gorgias, Zendesk, Shopify Inbox, WhatsApp Business exports), and any post-purchase survey answers.
4. **Cash limit** for a new product's first order and launch, from the owner or `build-13-week-cash-forecast`.

Optional: repeat and lifetime value by first product from `cohort-repeat-and-ltv-analysis`; site search terms with no results; supplier catalogues.

If buyer requests are missing, run a two-question post-purchase survey first (what made you buy, what almost stopped you) and note the gap [CRO-0018]. Access: read only (level 1). Supplier contact and spending wait for the client's yes.

## Before you start: the gates

1. **The hero is healthy enough.** Pass: the current hero product earns gross profit and stays in stock. Fail: fix the hero first; a second product rarely rescues a first one that loses money.
2. **Gross profit per order known** for current products [MEA-0037].
3. **Cash and capacity.** Pass: the store can fund the new first order without starving hero stock, and someone owns sourcing and launch. Fail: limit candidates to low-minimum or made-to-order options.
4. **Measured repeat.** Repeat is judged on customers acquired at least 12 months ago for 12-month value [MEA-0048]; if the store is younger, use 90 or 180 days and label it.

## Steps

### 1. Collect buyer requests and count them

Read reviews, tickets, chats and survey answers by hand. Tag each request once:

- Asked for a new size, pack, refill or format.
- Asked for a companion product ("do you also sell the case")
- Used the product for something unexpected.
- Named a product they still buy elsewhere next to this one.
- A buyer group naming itself ("as a runner", "for my baby") [AVT-0016].

Count each tag. A request named by many separate buyers beats one loud one. Keep two or three exact quotes per tag. Search site search logs for terms with no results; each is a request too.

### 2. Read the order data

- **Basket pairs:** which products are bought together, and what share of orders hold two or more items.
- **Next product:** for repeat buyers, what the second order contains after each first product.
- **Repeat by first product:** 90-day and 12-month gross profit per customer by first product [MEA-0048].
- **Category repeat:** compare with the vertical; 365-day gross profit lift over the first order runs near 110% in CPG and supplements, about 55% in fashion, near zero in furniture and homewares [MEA-0052]. A low-repeat store gains more from a new product that wins new buyers; a high-repeat store gains from refills and companions.
- **Regions:** where demand is growing (pincodes or states in India, states in the US).

### 3. List the candidates

Write 5 to 10 candidates from steps 1 and 2. Each must answer one of:

- Win new buyers on its own (a different entry product).
- Raise repeat from existing buyers (refill, consumable, companion).
- Lift order value (bundle partner, upgrade).

The hero-only risk is real: one brand's single viral product peaked and then fell faster than its other products grew [PRD-0003].

### 4. Score each candidate

| Criterion | 1 | 2 | 3 |
|---|---|---|---|
| Buyer demand (step 1 count) | a few mentions | repeated | top request |
| Data support (step 2) | none | basket or repeat sign | both |
| Gross profit per order vs cost per buyer [MEA-0019] | below | at | well above |
| New buyers, repeat or marketplace fit [PRD-0012] | one | two | three |
| Ships and stores easily [PRD-0013] | hard | fair | easy |
| Fits the brand promise | stretch | adjacent | natural |
| Cash and minimum order | over limit | at limit | well within |

Gross profit has a veto: a candidate that cannot pay for a buyer and has no repeat case is out. Change one major thing from what buyers know, not several [PRD-0002]. Products seen and talked about in use spread by word of mouth; private ones do not, so note visibility as a tiebreak [BRD-0007].

### 5. Check the brand stretch

Ask whether the new product keeps the store's name meaning one clear thing. A refill or companion sits safely under the house name; a product for a different buyer or job may need its own sub-line. When unsure, hand the question to `write-brand-positioning-and-messaging`.

### 6. Pick and write the brief

Pick the top score and a runner-up with one line each on why. Write the launch brief (Output). Price, landed cost and first order size are estimates until quotes are in; label them.

### 7. India and US notes

- India: price bands and pack sizes for marketplaces (Flipkart, Nykaa, Meesho) differ from the store; check whether the candidate can carry the COD refusal rate in its margin, and whether labels need Legal Metrology declarations or BIS marks.
- US: check category rules (FDA for food, supplements and cosmetics, CPSC for children's products) and whether the candidate can ship within the store's current box sizes.

### 8. Hand off

Send the pick to `validate-demand-before-buying-stock` before any stock is bought, then to `write-product-spec-sheet-for-factory` and `find-and-vet-suppliers`.

## Checks before you hand it over

- Every candidate links to counted buyer evidence or an order-data pattern.
- Repeat figures state the cohort window and age.
- Gross profit per order uses delivered costs; estimates are labelled.
- The pick fits within the cash limit without cutting hero stock.
- The brief names the demand test to run before any order.
- No candidate breaks a product rule in India or the US the store cannot meet.
- Runner-up is named with one line.

## Output

**One-screen summary:** the pick, the evidence (request count, order pattern), expected gross profit per order, first order cash, the demand test and its dates, and the runner-up.

**Candidate table:** Candidate, Type (new buyers, repeat, order value), Request count, Order-data signal, Est. gross profit per order, Cost per buyer floor, Score per criterion, Total, Decision.

**Launch brief (one page):**

| Field | Content |
|---|---|
| Product and one-line description | |
| Buyer and the job it does, in buyer words | |
| Evidence (counts and two quotes) | |
| What changes from the hero (one major thing) | |
| Spec outline (materials, sizes, pack) | |
| Target price and delivered gross profit per order | |
| First order size and cash needed | |
| Brand: house name or sub-line | |
| Demand test, go line, dates | |
| Launch window and channels | |
| Owner and next step | |

## Common mistakes

- **Picking what the founder likes.** Step 1 counts what buyers ask for.
- **Adding products nobody pairs.** Step 2 checks baskets and second orders.
- **Repeat read on young customers.** Gate 4 sets the cohort window.
- **Margin from product cost only.** Step 4 uses delivered costs and a veto.
- **Diluting the brand name.** Step 5 checks the stretch.
- **Ordering before testing.** Step 8 sends the pick to a demand test first.

## Sources

- CRO-0018: two-question post-purchase survey.
- MEA-0037: delivered gross margin.
- MEA-0048: rank by 12-month gross profit on mature cohorts.
- MEA-0052: 365-day repeat lift by vertical.
- MEA-0019: cost per buyer floor.
- AVT-0016: self-identifying phrases mark buyer groups.
- PRD-0003: a single hero product decays.
- PRD-0012: screen for new buyers, repeat and marketplace fit.
- PRD-0013: parcel-friendly and repeat screen.
- PRD-0002: change one major variable.
- BRD-0007: visible products spread by word of mouth.

What makes this skill ours: candidates come from counted buyer requests and second-order data, not trend lists; repeat is read only on cohorts old enough to show it; gross profit per order holds a veto; and the brief ends in a demand test, so no stock is bought on a guess.
