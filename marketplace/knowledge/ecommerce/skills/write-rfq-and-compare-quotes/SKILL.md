---
name: write-rfq-and-compare-quotes
description: "A request for quote ready to send to every shortlisted supplier, and a side-by-side sheet that turns their different answers into one comparable landed cost per unit, with payment terms, lead time, minimums and risk scored, and one recommended supplier. Use after a supplier shortlist exists, before a first order or a re-order, or when a supplier raises prices and the store wants to test the market. Works for overseas imports and Indian domestic suppliers."
---

# Request for quote and quote comparison

**You get:** one request for quote (RFQ) document and message to send to 3 to 5 suppliers, and a comparison sheet that ranks their answers on landed cost per unit at the planned order size, terms and risk, with one recommendation.

## When to use

- A shortlist exists and the store needs real prices before ordering.
- A re-order is coming and the store wants to check its price against the market.
- A supplier announced a price rise.
- Quotes came back in different formats (ex-works, FOB, delivered, with and without packaging) and nobody can compare them.

## Not for

- Finding and vetting the suppliers: use `find-and-vet-suppliers`.
- Writing the full factory spec: use `write-product-spec-sheet-for-factory` (the RFQ attaches it).
- The detailed per-unit cost build with duty and freight: use `calculate-landed-cost-per-unit` (this skill uses its sheet).
- Bargaining after quotes arrive: use `negotiate-moq-and-price`.

## What you need

Required:

1. **Shortlist** of 3 to 5 suppliers with contacts.
2. **Spec sheet** or, for a stock product, the listing link plus your changes (logo, colour, packaging).
3. **Quantities to quote**: the first order and two larger tiers, for example 500, 1,000 and 3,000.
4. **Delivery point**: your warehouse or 3PL address, and whether you want ex-works, FOB or delivered pricing.
5. **Land-by date.**

Optional: the current supplier's invoice (for a re-quote), freight forwarder rates, last year's order volumes.

If the spec is missing, do not send an RFQ for a custom product: quotes against a vague brief cannot be compared, because each factory fills the gaps its own way [COG-0005]. For a stock product, a link and a written list of changes is enough. Sending RFQs is done from the client's account at level 2 after the client approves the text. Nothing in the RFQ commits the store to buy; say so in it.

## Before you start: the gates

1. **Target landed cost.** Pass: the store knows the most it can pay per unit delivered and still hit its gross profit per order. Fail: run `calculate-landed-cost-per-unit` backwards from the selling price first.
2. **Cash.** Pass: the deposit for the smallest tier fits the cash forecast. Fail: ask for a smaller first tier.
3. **Tax and duty basis.** Pass: HSN or HS code for the product is agreed, so duty can be looked up the same way for every quote. Fail: ask a customs broker for the code before comparing.

## Steps

### 1. Fix the quote format before you send

Every supplier answers in your format, or the comparison fails. The RFQ asks for:

- Unit price at each of the three quantities [COG-0010] (one case moved from 7.80 to about 4.00 per unit on a bulk order, and to 2.00 at 10,000 units).
- Price basis: ex-works (EXW) or free on board (FOB) at a named port, using the Incoterms term in writing.
- One-off costs: moulds, tooling, plates, screens, sample fees, and whether they are refunded on order.
- Packaging included: retail box, inner bag, master carton, labels, inserts.
- Carton details: units per carton, carton size and gross weight. Freight is priced on these.
- Production lead time from deposit and from sample approval.
- Payment terms: deposit percentage, balance timing, accepted methods.
- Defect policy: what they replace or refund, and how.
- Certificates and test reports for this product.
- Quote valid until.

At higher volumes, also ask for a cost breakdown by component, labour, overhead and margin; one buyer's rule is to ask for it once yearly cost of goods passes about 1 million dollars [COG-0001]. Below that, ask for the main material cost line only.

### 2. Write the RFQ message

Short, exact, with numbers. State that you are getting several quotes; factories price more honestly when they know there are alternatives [COG-0003]. Give a reply-by date (five working days is a practitioner default). Ask for a single PDF or the filled table.

### 3. Log answers as they come

Record reply time and whether they answered every field. A supplier who skips fields in a quote will skip them in production. Chase once; no reply after the deadline drops them.

### 4. Normalise to landed cost per unit

For each quote and each quantity, build the cost to your shelf with `calculate-landed-cost-per-unit`. The rule: everything until the goods are on your shelf goes in, including inbound freight, duty and the retail box; outbound shipping to customers does not [FIN-0007]. Spread one-off tooling over the first order's units, and say so.

Two duty traps change the ranking:

- **US:** duty is charged on the price paid excluding international freight and insurance, plus packing, commissions, and any moulds or tools you supply [COG-6262]. So an FOB and a delivered quote must be cut back to the same base.
- **India:** customs duty is a cost, but IGST paid at import comes back as input tax credit for a GST-registered store [COG-6260]. For domestic suppliers, GST on the invoice is also creditable if the supplier files correctly; compare ex-GST prices and check the supplier's GSTIN.

### 5. Score terms and risk

Payment terms are money. Float equals the payment terms minus the time from order to stock on your shelf; net 90 on a 30-day lead time gives 60 days [FIN-0005]. A 30% deposit and 70% before shipping gives no float. Put a cash cost on each: deposit amount x days paid before stock sells.

Lead time matters as much as price: production of 20 to 30 days plus sea freight of 30 to 40 days door to door is typical, air is 7 to 10 days [COG-0008]. A cheaper quote that lands after your sale date costs the sale.

Score risk 1 to 5 on: spec answered fully, certificates seen, sample quality (if already received), reply speed, defect policy in writing, and country or route risk.

### 6. Recommend one

Rank by landed cost per unit at the quantity you will really buy, then apply two vetoes: lead time that misses the land-by date, and a risk score under 3. Name the winner, the runner-up in one line, and what to push for in negotiation (the gap between first and second on the line that differs most).

## Checks before you hand it over

- Every quote is shown at the same quantity, the same price basis and the same delivery point.
- Tooling and sample fees are spread over units, with the unit count stated.
- Duty is calculated on the correct base for the destination country.
- GST or IGST is treated as creditable only if the store is registered and can claim it.
- Each quote shows its payment terms as days of cash tied up.
- Lead time is checked against the land-by date.
- The recommendation names one supplier and one runner-up.
- No RFQ went out without the client's approval of the text.

## Output

**One-screen summary:** recommended supplier, landed cost per unit at the order quantity, deposit and terms, lead time, top risk, and the one thing to negotiate. Runner-up in a line.

**RFQ document (to fill and send):**

| Field | Your answer |
|---|---|
| Product and spec version | |
| Quantities to quote | 500 / 1,000 / 3,000 (edit) |
| Price basis | EXW or FOB (named port) |
| Unit price at each quantity | |
| Moulds, tooling, sample fees (refundable?) | |
| Packaging included | |
| Units per carton, carton size, gross weight | |
| Production lead time | |
| Payment terms and method | |
| Defect policy | |
| Certificates for this product | |
| Quote valid until | |

**RFQ message:** "We are sourcing [product] for [market]. Spec attached, version [x]. Please quote in the attached table for [quantities], [basis], by [date]. We are asking several suppliers. This is a request for price only and not an order."

**Comparison sheet:**

| Supplier | Qty | Unit price | Basis | Tooling per unit | Packaging per unit | Freight per unit | Duty per unit | Other import costs per unit | Landed cost per unit | Deposit % | Days of cash tied up | Lead time to shelf | Meets land-by date | Risk score | Rank |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Comparing unit prices.** A low ex-works price can be the highest landed cost. Step 4 compares cost to shelf.
- **One quantity only.** Step 1 asks for three tiers, so the store sees the price breaks.
- **Ignoring terms.** Step 5 turns deposits into days of cash.
- **Duty on the wrong base.** Step 4 sets the base by country.
- **Counting GST as cost or as free.** Step 4 depends on registration and credit.
- **Letting tooling hide.** Step 4 spreads it over the first order.

## Sources

- COG-0001: ask for component-level cost breakdown at scale.
- COG-0003: let factories know you have competing quotes.
- COG-0005: exact specs; vague words let factories decide.
- COG-0008: production plus freight lead times.
- COG-0010: bulk tiers cut unit cost sharply.
- FIN-0005: float is payment terms minus lead time.
- FIN-0007: all in until it is on the shelf.
- COG-6260 (proposed): India IGST on imports creditable, customs duty not.
- COG-6262 (proposed): US duty base excludes international freight, adds packing and assists.

What makes this skill ours: quotes are forced into one format before they arrive; every quote is compared as landed cost at the quantity the store will really buy; deposits become days of cash; and duty and GST are treated by the rules of the destination country rather than one generic percentage.
