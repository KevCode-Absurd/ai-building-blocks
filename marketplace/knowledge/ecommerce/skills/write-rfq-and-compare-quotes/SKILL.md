---
name: write-rfq-and-compare-quotes
description: "A request for quote ready to send to every shortlisted supplier, and a side-by-side sheet that turns their different answers into one comparable landed cost per unit, with payment terms, lead time, minimums and risk scored, and one recommended supplier. Use after a supplier shortlist exists, before a first order or a re-order, or when a supplier raises prices and the store wants to test the market. Works for overseas imports and domestic suppliers in any market."
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
- Tax in the price: for suppliers in China, whether the price includes Chinese VAT (含税) or not (不含税). Most goods carry 13% VAT inside China, so a tax-included price is not comparable with an export price.
- For container goods, ask for FCA (named terminal or factory) as well as or instead of FOB: ICC keeps FOB for bulk cargo loaded onto a ship. Avoid EXW across a border: export clearance and loading then sit with you, and the origin charges FOB would include become your cost.
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

How many to ask and what to share: for an off-the-shelf item, asking 10 or more factories is normal; with more than 5 comparable quotes you can see the average market price, and with about 20 you see it well, but only if every factory quotes the same spec, quantity, packing and Incoterm. For a sensitive new design, qualify one or two factories first and share drawings only after an NNN is signed (`nnn-agreement-for-china-factories`). Do not put a target price in the RFQ; share it only with the shortlist in `negotiate-moq-and-price`. On Alibaba.com or Accio, use the ready RFQ and messages in `accio-and-alibaba-sourcing-prompts`; for China suppliers who read English poorly, send the RFQ with a Chinese copy from `bilingual-supplier-messages`.

### 3. Log answers as they come

Record reply time and whether they answered every field. A supplier who skips fields in a quote will skip them in production. Chase once; no reply after the deadline drops them.

Mark outliers before you rank. Drop quotes about 20% above or below the average from the market benchmark, and treat a quote far below the rest as a warning, not a win: factories filling idle capacity or short of cash tend to cut materials, checks or staff after you commit, or ask for more money later. Ask that supplier what material or step differs. Overpaying 20% on the factory price wastes about 10 to 15% of landed cost, so the benchmark matters.

### 4. Normalise to landed cost per unit

For each quote and each quantity, build the cost to your shelf with `calculate-landed-cost-per-unit`. The rule: everything until the goods are on your shelf goes in, including inbound freight, duty and the retail box; outbound shipping to customers does not [FIN-0007]. Spread one-off tooling over the first order's units, and say so.

Quotes on different Incoterms are not comparable until you add what each leaves to you. An EXW quote leaves export clearance, terminal and document fees and loading to the buyer, while FOB and FCA include them; compare forwarder quotes only line by line on the same Incoterm. A DDP quote means the seller clears import in your country, which some countries do not allow foreign firms to do; check with your broker before you rank it.

Two duty traps change the ranking:

- **US:** duty is charged on the price paid excluding international freight and insurance, plus packing, commissions, and any moulds or tools you supply [COG-6262]. So an FOB and a delivered quote must be cut back to the same base.
- **UK, EU, Australia and other VAT markets:** customs duty is a cost, but import VAT (or the local import sales tax) is usually reclaimable for a VAT-registered store. For domestic suppliers, VAT on the invoice is reclaimable too if the store is registered; compare prices before VAT and check the supplier's VAT number.

### 5. Score terms and risk

Payment terms are money. Float equals the payment terms minus the time from order to stock on your shelf; net 90 on a 30-day lead time gives 60 days [FIN-0005]. A 30% deposit and 70% before shipping gives no float. Put a cash cost on each: deposit amount x days paid before stock sells.

Lead time matters as much as price: production of 20 to 30 days plus sea freight of 30 to 40 days door to door is typical, air is 7 to 10 days [COG-0008]. A cheaper quote that lands after your sale date costs the sale.

Score risk 1 to 5 on: spec answered fully, certificates seen, sample quality (if already received), reply speed, defect policy in writing, and country or route risk.

### 6. Recommend one

Rank by landed cost per unit at the quantity you will really buy, then apply two vetoes: lead time that misses the land-by date, and a risk score under 3. Name the winner, the runner-up in one line, and what to push for in negotiation (the gap between first and second on the line that differs most).

When a should-cost sheet exists (`should-cost-model-per-bom-line`), add each quote's gap to should-cost in money and percent beside its landed cost. The supplier closest to should-cost with a full answer is often a safer pick than the cheapest, and the gap lines become the negotiation questions.

## Checks before you hand it over

- Every quote is shown at the same quantity, the same price basis and the same delivery point.
- Each China quote says whether it includes VAT (含税 or 不含税), and EXW quotes carry their origin charges.
- Outliers about 20% from the average are flagged, and a quote far below the rest has a question attached.
- Tooling and sample fees are spread over units, with the unit count stated.
- Duty is calculated on the correct base for the destination country.
- VAT or import VAT is treated as reclaimable only if the store is registered and can claim it.
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
- **Counting VAT as cost or as free.** Step 4 depends on registration and credit.
- **Letting tooling hide.** Step 4 spreads it over the first order.
- **Taking the cheapest quote as a win.** Step 3 treats a far-low quote as a warning and asks why.
- **Mixing EXW, FOB and DDP.** Step 4 adds what each leaves to you before ranking.

## Sources

- COG-0001: ask for component-level cost breakdown at scale.
- COG-0003: let factories know you have competing quotes.
- COG-0005: exact specs; vague words let factories decide.
- COG-0008: production plus freight lead times.
- COG-0010: bulk tiers cut unit cost sharply.
- FIN-0005: float is payment terms minus lead time.
- FIN-0007: all in until it is on the shelf.
- COG-6262 (proposed): US duty base excludes international freight, adds packing and assists.
- ICC Academy, Incoterms 2020: FCA or FOB?: https://academy.iccwbo.org/incoterms/article/incoterms-2020-fca-or-fob/
- ICC Academy, Incoterms 2020: EXW or FCA?: https://academy.iccwbo.org/incoterms/article/incoterms-2020-exw-or-fca/
- Flexport glossary, Origin Charges: https://www.flexport.com/glossary/origin-charges
- QualityInspection.org, China Supplier Vetting Part 10: Pricing, Negotiation, Contracts: https://qualityinspection.org/pricing-negotiation-contracts/
- QualityInspection.org, Should you tell China suppliers about your target price?: https://qualityinspection.org/target-price-chin/
- QualityInspection.org, When should you request quotations from Chinese factories?: https://qualityinspection.org/request-quotations/
- QualityInspection.org, When a Chinese Factory Quote Is Too Low: https://qualityinspection.org/when-a-chinese-factory-quote-is-too-low-the-hidden-risks-for-buyers/
- Value-Added Tax Law of the People's Republic of China (LexisNexis China, English): https://www.lexiscn.com/law/law-english-1-5601651-T.html

What makes this skill ours: quotes are forced into one format before they arrive; every quote is compared as landed cost at the quantity the store will really buy; deposits become days of cash; and duty and VAT are treated by the rules of the destination country rather than one generic percentage.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Customs duty is a cost, but IGST paid at import comes back as input tax credit for a GST-registered store [COG-6260]. For domestic suppliers, GST on the invoice is also creditable if the supplier files correctly; compare ex-GST prices and check the supplier's GSTIN.
- COG-6260 (proposed): India IGST on imports creditable, customs duty not.
