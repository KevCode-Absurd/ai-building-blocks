---
name: quote-levelling-and-supplier-scoring
description: Puts messy quotes on one basis and picks a supplier - converts every quote to the same unit, quantity, currency, delivery point and period, marks gaps as unknown, works out landed cost per unit or total cost of ownership over one to three years, scores each supplier against the weights agreed before quotes arrived with a one-line reason per score, tests what would change the answer and writes a one-page decision memo. Use it when quotes, tariffs or vendor proposals are hard to compare, for software and agency choices, energy and telecoms quotes, or factory quotes. The award itself needs the client's fresh yes.
---

# Quote levelling and supplier scoring

A cheap headline price often hides freight, minimums, set-up fees or a price rise at renewal. This skill makes every quote say the same thing, then scores suppliers on the criteria the client agreed before seeing prices.

## When to use

- Two to ten quotes or proposals have come back and they do not line up.
- A software, agency or service choice needs a defensible pick.
- Energy, water or telecoms quotes need comparing at the client's real usage.
- An owner or partner wants a one-page reason for the choice.

## What you need

1. All quotes, proposals or price pages as received (files, emails or pasted text).
2. The agreed criteria and weights from the `sourcing-plan-and-rfq` skill. If none exist, agree them with the client now and note that this happened after quotes arrived.
3. The basis to convert to: quantity, unit, currency, delivery point, period (one to three years for services).
4. Client-supplied figures for freight, insurance, duty and taxes, exchange rate and defect allowance, or permission to mark them as assumptions.
5. For utilities: 12 months of usage per meter.
6. Due diligence results, if already done.

## Steps

### 1. Extract every quote into one table
One row per supplier, one column per reply-table field. Copy figures exactly and cite where each came from (file, page, line). Anything not stated is "unknown", never zero.

### 2. Convert to one basis
- **Unit and quantity:** price at the client's real quantity, using the supplier's quantity breaks. Round up to minimums and case packs and show the extra units.
- **Currency:** one exchange rate, dated, for all quotes.
- **Delivery point:** for imports, use the Incoterms rule and place each supplier quoted. Add the costs the client will carry from that point: freight, insurance, duty and taxes (client's figures), clearance and local delivery.
- **Period:** for services and software, cost over the agreed period, including set-up, per-user or usage fees, add-ons needed to meet the must-haves, support, training, the stated or likely price at renewal, and the cost to leave (exit fees, data export, notice).
- **Utilities:** each tariff priced at the client's actual monthly usage, with unit rates and standing charges split out, plus contract length, exit fees and what happens at the end of the term.

### 3. Work out the real cost
- **Goods:** landed cost per sellable unit = (price × quantity ordered + freight + insurance + duty + other charges) ÷ units expected to pass inspection.
- **Services:** total cost of ownership over the period, and the cost per month or per user.
Show every sum so the client can check it.

### 4. List gaps and risks
For each supplier: the unknowns, vague answers, terms that cost money later (auto-renewal, price-review clauses, high exit fees, low liability caps), single-source risk, and any red flag from due diligence. Write the question that would settle each one.

### 5. Score against the agreed weights
Score each criterion from 1 to 5 with a one-line reason tied to the evidence. Multiply by the weight and total. A supplier that fails a must-have is out, whatever its score; say so rather than scoring it.

### 6. Test the answer
- Would the pick change if the top-weighted criterion moved by ten points?
- Would it change if one unknown turned out badly?
- Is the winning margin bigger than the uncertainty in the figures?
Say plainly what would change the answer.

### 7. Write the decision memo
One page: the recommendation (or a shortlist of two to sample or negotiate with), why, the real cost, the main risks and how to reduce them, open questions, and next steps. At level 2 the memo and scoring sheet go into the client's shared folder; at level 3 the agreed tabs of the live comparison file are updated. Telling a supplier they have won is an award and needs the client's fresh yes.

## Checks

- Every figure traces to a quote or a client-supplied assumption, labelled as such.
- No unknown was counted as zero.
- Minimums, case packs and quantity breaks are applied.
- Weights match those agreed; any change is explained.
- Must-have failures are excluded, not scored low.
- The sensitivity test is written down.
- No supplier was told the outcome without the client's yes.

## Output format

1. Levelled table: supplier, basis, each cost line, total, cost per unit or per month, unknowns.
2. Scoring table: criterion, weight, score per supplier with reason, weighted total.
3. Gaps, risks and questions per supplier.
4. Sensitivity note: what would change the answer.
5. Decision memo (one page).

## Example of good output (short)

*Illustrative structure, not a real business: a group of three dental clinics in Ohio choosing a patient booking system. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Basis:** 3 clinics, 14 users, 3 years, USD.
>
> | | Vendor A | Vendor B | Vendor C |
> |---|---|---|---|
> | Set-up | $2,400 | $0 | $1,200 |
> | Licences, 3 years | $15,120 | $18,144 | $12,600 |
> | Text reminders add-on (must-have) | included | included | $3,024 |
> | Price at renewal (year 2 and 3) | capped at 5% | not stated: unknown | 3% stated |
> | Data export on exit | free CSV | $1,500 fee | free CSV |
> | **3-year cost** | **$17,520 + cap** | **$19,644 + unknown rise** | **$16,824 + 3%** |
>
> **Scores (weights agreed 3 Mar):** A 4.1, B 3.2, C 3.9. B lost points on the unknown renewal price and the exit fee.
> **What would change the answer:** C scored lower on fit because its link to the clinics' billing system may need $3,000 of middleware it lists as optional. If C confirms in writing that it works without it, C moves ahead of A.
> **Recommendation:** negotiate with A and C in parallel; ask A to waive set-up and C to confirm the integration.
