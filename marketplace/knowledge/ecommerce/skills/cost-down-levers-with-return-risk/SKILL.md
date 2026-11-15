---
name: cost-down-levers-with-return-risk
description: "A ranked list of 5 to 12 cost-down levers for one product (material or gauge swap, part merge, pack-out, carton fit, volume tier, tooling spread, fewer variants per run, payment terms), each with the saving per unit and per year, the return and review risk with the evidence behind it, the test to run first, and who signs off. Use when a product's cost is too high for its margin and you need ways to cut it without more returns or bad reviews, or when a factory offers a cheaper option and you need to know what it will cost you later."
---

# Cost-down options rated for return risk

**You get:** a lever sheet with 5 to 12 options ranked by safe saving per year, each with its evidence, a return risk rating, a first test and a named sign-off, plus a one-screen pick of the two or three to start now.

## When to use

- Landed cost sits above the ceiling worked back from the selling price.
- A tariff, freight or material rise has squeezed the margin and the price cannot move yet.
- A factory offers "a cheaper version" and the owner wants to know the catch.
- Before a yearly review, to bring the factory ideas instead of only a price ask.

## Not for

- Knowing what each part should cost: use `should-cost-model-per-bom-line` first; this skill starts from it.
- Bargaining for a lower price on the same product: use `negotiate-moq-and-price`.
- Freight mode, carrier or duty work on its own: Sheila and `calculate-landed-cost-per-unit`.
- Raising the selling price: use `set-prices-from-costs-and-competitors` with Brendan.

## What you need

Required:

1. **Should-cost sheet or BOM** with cost per line (from `should-cost-model-per-bom-line`).
2. **Landed cost and the ceiling** from `calculate-landed-cost-per-unit`.
3. **Return reasons and review text** for this product for the last 6 to 12 months (Shopify returns by product and reason, marketplace returns, review exports).
4. **Yearly units** and the next order date.

Optional: carton size and units per carton, the factory's own cost-down ideas, competitor teardown notes, the product claims on the page.

Douglas drafts the list at level 2. Any change to material, grade, size or pack needs a new spec version from Maxine and a sample before it reaches a purchase order. Nothing is changed with the factory without the owner's yes.

## Before you start: the gates

1. **Return data exists.** Pass: return reasons are logged per product. Fail: you cannot rate risk; set up return reasons first (a refund issued without a return records no reason) and rate every lever "unknown risk, test first".
2. **Claims are known.** Pass: the claims on the product page and pack are listed. Fail: get them; a material swap that breaks a claim ("solid wood", "100% cotton", "BPA free") is a legal problem, not a saving.
3. **Quality is stable now.** Pass: the last lot passed inspection. Fail: fix quality first with Phuong; cutting cost on an unstable product hides the cause.

## Steps

### 1. Start from the biggest lines

Take the top lines from the should-cost sheet that make up about 80% of cost. Levers on small lines rarely matter; a 10% cut on a line worth 3% of cost saves 0.3%.

### 2. Generate levers from each family

| Family | Lever examples | What to check |
|---|---|---|
| Material | Thinner gauge, lighter fabric weight, different resin or grade, plain finish instead of coated | Strength, feel, claims, test results |
| Design | Merge two parts, fewer fasteners, simpler shape, standard part instead of custom | Function, assembly time, look |
| Pack-out | Smaller retail box, fewer inserts, flat-pack, no inner bag where safe | Damage in transit, unboxing |
| Carton fit | Carton sized so more units fit a container | Crush and drop tests |
| Volume tier | Next price tier, 12-month commitment with call-offs | Total yearly cost, cash, sell-through |
| Tooling | Multi-cavity mould, spread mould cost over a longer life | Mould ownership, upfront cash |
| Run plan | Fewer colours and sizes per run so lines run longer | Lost sales on cut variants |
| Terms and basis | Longer payment terms, FCA instead of EXW | Cost of cash, who handles export |

Ask the factory for its own ideas too. A factory that suggests a cheaper material or a step to skip knows its costs; write each idea down and rate it the same way.

### 3. Put a number on each saving

Saving per unit x yearly units = saving per year. Count one-off costs (new sample, new mould, new test report) against the first year.

Two levers need extra maths:

- **Carton fit:** ocean freight per unit = container rate / units that fit. A 40ft high cube holds about 76 cubic metres, about 13% more than a 40ft standard. At a Shanghai to Rotterdam rate of about 3,500 dollars per 40ft, 6,000 units carry about 0.58 dollars of freight each; a carton 10% smaller that fits 6,600 saves about 0.05 per unit. Rerun with the current rate.
- **Volume tier:** judge on total yearly cost (price plus ordering plus holding), not unit price. In a textbook case a 4% discount at 500 units cost about 2.5% more a year than buying smaller lots; the break-even discount there was 6.4%, which becomes your ask.
- **Run plan:** in cut and sew, raising line efficiency from 60% to 75% cuts real sewing time by 20%, and fewer colours and sizes per order help a factory get there.

### 4. Rate return and review risk with evidence

For each lever, find the return reasons and review phrases that touch the part being changed. Rate:

- **Low:** the part has no related returns or complaints, and the change is not visible or felt by the buyer.
- **Medium:** some related complaints, or the buyer can see or feel the change.
- **High:** the part already drives returns or 1 to 3 star reviews, or the change touches safety, a claim or the main reason people buy.

Quote the evidence: "12 of 41 returns say 'handle cracked'; this lever thins the handle." Squeezing cost without locking the spec invites quality fade, quiet cuts across runs; one case found an aluminium part under 90% of its specified weight. A material or grade change must also change the page and pack claims to match; never sell the cheaper version as the same spec.

### 5. Rank by safe saving

Safe saving = saving per year, kept whole for low risk, halved for medium (house rule: the test may fail), and set to zero for high until a test proves it. Rank by safe saving. High-risk levers stay on the list as "test only".

### 6. Write the first test and the sign-off for each

- **Test:** side-by-side sample against the golden sample, a drop or wash test, a small lot (a few hundred units) with a 90-day return watch against the last lot.
- **Sign-off:** owner always; Maxine for any spec change; Phuong for the defect list update; Meenakshi if a claim, label or safety test changes; Alistair for pack changes.

## Checks before you hand it over

- Every lever has a saving per unit and per year with the maths shown.
- Every risk rating quotes return reasons or reviews, or says "no data".
- No lever changes a claim without the claim change listed.
- Volume tiers are judged on total yearly cost, not unit price.
- High-risk levers are marked "test only", not counted in the headline saving.
- Each lever names a first test and a sign-off.

## Output

**One-screen summary:** current landed cost and ceiling, total safe saving per year, the two or three levers to start now, and the one to avoid.

**Lever sheet:**

| Rank | Lever | Line affected | Saving per unit | Saving per year | One-off cost | Return risk | Evidence | Claim or label change | First test | Sign-off | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Cutting the part buyers already complain about.** Step 4 checks return reasons first.
- **Counting a risky saving as banked.** Step 5 halves or zeroes it until tested.
- **Taking a price tier that costs more to hold.** Step 3 uses total yearly cost.
- **Changing material, keeping the claim.** Step 4 forces the claim change.
- **Testing on paper only.** Step 6 runs a sample and a small lot with a return watch.

## Sources

- COG-0002: volume credits from fuller use of your dedicated line.
- COG-0009: a cheaper change can deliver faulty stock; trial small first.
- COG-0010: bulk tiers cut unit cost.
- COG-0011: fixed weights in the spec catch quiet material cuts.
- CXP-0007: poor returns cut repeat purchase.
- Drewry, World Container Index (12 Nov 2026): https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry
- Ocean Network Express, Dry containers: specifications: https://www.one-line.com/en/dry-containers
- University of Houston, Operations Management Chapter 3: Inventory Management: https://www.bauer.uh.edu/egardner/3301H%20Operations%20Management/OM%20Text/3INVENTORY%20MANAGEMENT-1.pdf
- Fair Wear, Labour Minute and Product Costing Calculator guidance: https://api.fairwear.org/wp-content/uploads/2020/06/Guidance-for-Use-of-the-Fair-Wear-Labour-and-Minute-and-Product-Costing-Calculator-Final.pdf
- Knowledge at Wharton, 'Quality Fade': China's Great Business Challenge: https://knowledge.wharton.upenn.edu/podcast/knowledge-at-wharton-podcast/quality-fade-chinas-great-business-challenge/
- QualityInspection.org, China Supplier Vetting Part 10: https://qualityinspection.org/pricing-negotiation-contracts/
- Shopify Help Center, Creating returns: https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/creating-returns

What makes this skill ours: every lever carries the store's own return reasons as evidence; risky savings are discounted until a test proves them; container fit and price tiers are priced in money, not guessed; and a material change always drags its claim change with it.
