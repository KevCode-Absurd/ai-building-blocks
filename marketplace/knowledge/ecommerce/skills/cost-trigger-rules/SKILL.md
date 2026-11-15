---
name: cost-trigger-rules
description: "A one-page rule table for every cost driver (each material, container freight, exchange rate, tariff): its watch line and its action line, worked back from the margin floor, the move each one starts (buy ahead, reprice, renegotiate or re-source), the teammate who owns it, the cash check it needs, and index-linked price wording for the supplier. Use when cost moves keep catching the team out and nobody agrees when to act, or before signing a supply deal where prices can move."
---

# Cost trigger rules: buy ahead, reprice, renegotiate or re-source

**You get:** a one-page trigger table the whole team works from, the maths behind each line, a playbook for each of the four moves, and clause wording for an index-linked price, ready to run with `weekly-cost-watch-routine`.

## When to use

- A freight spike or currency drop hit margin last year and the team argued for weeks about what to do.
- Material prices are climbing and the owner wants to know at what point to act.
- A supplier wants to tie price to a material index.
- Before a peak season buy, to agree the rules in advance.

## Not for

- Reading the price series each week: use `weekly-cost-watch-routine`.
- The negotiation itself: use `negotiate-moq-and-price` with Wenhao.
- Running a price test after a reprice: use `run-a-price-test`.
- Finding a new supplier: use `find-and-vet-suppliers` with Tunde.
- Cash planning in full: use `build-13-week-cash-forecast` with Hemant.

## What you need

Required:

1. **The series map** from `weekly-cost-watch-routine`: each driver, its weight in COGS per SKU and its lag to invoices.
2. **Margin floor per SKU**: the lowest gross margin per order the owner accepts.
3. **Monthly units per SKU** and current stock cover in weeks.
4. **Cash on hand and the 13-week cash forecast.**
5. **Current supply terms**: price hold dates, any index clause, payment terms.

Optional: past volatility of each series, storage cost per unit per month, competitor prices.

Akosua drafts the rules at level 2. The rules start a conversation with the owner; they never move money, prices or orders on their own. Every move needs the owner's yes.

## Before you start: the gates

1. **Margin floor agreed.** Pass: the owner has written a floor per SKU. Fail: stop; without it every line is a guess.
2. **Owners named.** Pass: each move has a teammate who will act. Fail: name them first; a rule with no owner is ignored.
3. **Cash visible.** Pass: the cash forecast is current. Fail: buy-ahead rules cannot be set.

## Steps

### 1. Work the action line back from the margin floor

For each driver and SKU: how far can the driver move before gross margin per order hits the floor?

action move % = (current margin per unit - floor margin per unit) / (line cost x share driven by the driver)

Example: margin above floor is 0.60 per unit, cotton drives 1.50 of the cost with a 50% share. 0.60 / (1.50 x 0.5) = 80%. Cotton would have to rise 80% to breach the floor on this SKU, so cotton is a low-priority driver here. Freight on a bulky SKU often breaches first.

### 2. Set the watch line from noise, not nerves

Watch line = the move that sits outside normal noise: about 1.28 x monthly volatility x square root of the months to your next order (an 80% band). Inside it, do nothing. Between watch and action, prepare. Past action, act. If the watch line is above the action line, the SKU is fragile: flag it for `cost-down-levers-with-return-risk` now.

Two readings in a row past a line count as a cross (house rule, test it).

### 3. Pick the move for each line

| Situation | Move | Owner | Cash check |
|---|---|---|---|
| Driver rising, stock cover short, storage cheap | Buy ahead: pull the next order forward or order more | Omar, with Hemant | Total yearly cost (price + holding + storage) must fall; cash must stay above the forecast floor |
| Rise looks lasting, competitors have moved | Reprice | Brendan and Radek, with the owner | Test the new price first where volume allows |
| Rise is in the supplier's quote but not in the market series | Renegotiate | Wenhao, from Douglas's should-cost | None, but have the second quote ready |
| Rise is structural (tariff on the origin, freight lane broken) | Re-source or move origin | Tunde, with Sheila for duty and lead time | Model the extra stock a longer lead time needs |
| Driver falling past the watch line | Renegotiate down, or hold price and bank the margin | Wenhao, Radek | None |

### 4. Write the buy-ahead rule with its limit

Buy ahead only if the saving beats the cost of holding: holding cost per unit per month x months held. A price break is worth taking only when total yearly cost falls; in a textbook case a 4% discount raised total cost about 2.5% because of holding. Cap any buy-ahead at the stock the store can sell within its cover window and pay for without breaking the cash floor.

### 5. Write the index-linked price clause

When a supplier wants a material-linked price, write it so it moves both ways and only by the share the input drives:

- Base price and base month, the named index with its title and code, adjustment dates.
- Adjusted price = base price x (current index / base index) for the indexed share only. If 70% of a 1,000 price is indexed and the index rises 5.2%, the price rises 36.40, not 52.
- Several inputs: fixed weights that sum to 1.
- Say which release counts (first or final), because some indexes are revised for up to four months.

Have a lawyer check the clause before it goes into a supply agreement.

### 6. Put tariffs and dates on the same page

Tariff and duty changes are date triggers, not price triggers. List each known date (a review closing, an exclusion ending, a de minimis change) with the SKU cost if it lands, for the broker to confirm. Add holiday closures: plan Chinese New Year as 2 to 4 weeks lost and order by mid-December.

### 7. Review the rules each quarter

Check how often each line fired and whether the move worked. Widen a line that fires on noise; tighten one that fired too late.

## Checks before you hand it over

- Every action line is worked back from a written margin floor, with the maths shown.
- Every watch line uses the series' own volatility.
- Every move has an owner from the team and a cash check.
- Buy-ahead rules are capped by cover window and cash.
- Index clauses move both ways and index only the driven share.
- Nothing in the rules moves money, prices or orders without the owner's yes.

## Output

**Trigger table (one page):**

| Driver | Series and code | SKUs most exposed | Watch line | Action line | Move at watch | Move at action | Owner | Cash check | Last reading |
|---|---|---|---|---|---|---|---|---|---|

**Fragile SKUs:** SKUs where the watch line is above the action line, with the margin left per unit.

**Date triggers:** date, what changes, SKUs, cost per unit if it lands, who confirms.

**Clause wording:** the index-linked price paragraph, filled for this supplier, marked "for lawyer review".

## Common mistakes

- **Lines set by gut.** Step 1 works them back from the margin floor.
- **Acting on noise.** Step 2 sets the watch line from volatility and needs two readings.
- **Buying ahead with cash the store needs.** Step 4 caps it.
- **An index clause that only goes up.** Step 5 makes it move both ways.
- **Rules with no owner.** Gate 2 names one for every move.

## Sources

- COG-6287: the cash cycle, not ads, limits small brands.
- COG-6291: paying more for longer terms can be a dear loan.
- COG-6294: attack the cash conversion cycle when cash limits growth.
- FIN-0005: float is payment terms minus lead time.
- BLS, Price Adjustment Guide for Contracting Parties: https://www.bls.gov/ppi/publications/price-adjustment-guide-for-contracting-parties.htm
- Forecasting: Principles and Practice, 5.5 Prediction intervals: https://otexts.com/fpp3/prediction-intervals.html
- University of Houston, Operations Management Chapter 3: Inventory Management: https://www.bauer.uh.edu/egardner/3301H%20Operations%20Management/OM%20Text/3INVENTORY%20MANAGEMENT-1.pdf
- QualityInspection.org, Chinese New Year: how to manage the disruption: https://qualityinspection.org/chinese-new-year-production-planning/
- USTR, China Section 301 four-year review: https://ustr.gov/trade-topics/enforcement/section-301-investigations/section-301-china-technology-transfer/china-section-301-tariff-actions-and-exclusion-process/four-year-review

What makes this skill ours: every line is worked back from the store's own margin floor and the series' own noise; each line already names the move, the teammate and the cash check, so nobody argues when it fires; and index clauses move both ways on the driven share only.
