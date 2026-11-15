---
name: find-and-vet-suppliers
description: "A shortlist of three to five vetted suppliers for one product, found on Alibaba, Global Sources, local B2B directories, trade fairs or local markets, each checked against a written list of red flags and scored, with the reason each one stayed or was cut. Use when the store needs a first supplier for a product it has decided to sell, wants a backup to a single supplier, or wants to move production to cut cost. Ends with the RFQ hand-off, not an order."
---

# Find and vet suppliers

**You get:** a supplier shortlist sheet with 3 to 5 vetted suppliers (and every rejected one with its reason), a red-flag check for each, and the list of who receives the request for quote next.

## When to use

- The store has decided to sell a product and has no supplier yet.
- The store relies on one supplier and needs a tested backup.
- Cost or lead time has to come down and the owner wants to look at other factories or countries.
- A supplier has started missing dates, slipping quality or going quiet.

## Not for

- Deciding whether the product is worth selling at all: use `validate-demand-before-buying-stock` first.
- Writing the request for quote and comparing prices: use `write-rfq-and-compare-quotes` (this skill hands it the shortlist).
- Rating suppliers you already buy from: use `supplier-scorecard`.
- Choosing a warehouse or 3PL: use `choose-3pl-or-self-fulfil`.

## What you need

Required:

1. **The product in one paragraph**: what it is, materials, size, target retail price and the countries it will sell in.
2. **Target landed cost per unit**: from `calculate-landed-cost-per-unit` run backwards from the selling price, or the owner's number.
3. **First order size and budget**: units and cash available for the first purchase order.
4. **Customisation needed**: logo only, custom packaging, or a new design (if new, a spec sheet from `write-product-spec-sheet-for-factory` should exist or be planned).

Optional: a competitor's product to copy the quality level of, the 1-star reviews of competing products, current supplier invoices if this is a switch.

If the target landed cost is missing, compute a rough ceiling: retail price minus the gross profit the store needs per order minus delivery costs. Do not shortlist without one. This skill needs only read access (level 1) to the store; contacting suppliers is done from the client's own sourcing account at level 2, and the client approves each first message template before it goes out. No deposits, sample payments or contracts without the client's yes.

## Before you start: the gates

1. **Margin ceiling known.** Pass: a target landed cost per unit exists. Fail: stop and compute it first; a cheap supplier for a product that cannot make money is wasted work.
2. **Cash for the first order.** Pass: the first order (units x target cost, plus freight and duty) fits the cash forecast in `build-13-week-cash-forecast`. Fail: plan a smaller first run or a domestic supplier with a lower minimum.
3. **Legal to sell.** Pass: the product's rules are listed for every market it will sell in. US: children's products, electronics, cosmetics and food contact items have their own rules (CPSC, FCC, FDA). UK and EU: many products need CE or UKCA marking and a named responsible person in the market. Other markets have their own safety marks. For imports, the store needs its importer number (for example an EORI number in the UK and EU) and its tax number on the customs entry. List the rules and confirm with the owner's adviser. Fail: any supplier who cannot supply the required certificate is out before scoring.
4. **Someone to run it.** Pass: a named person on the store side will answer suppliers within a working day for the next four weeks.

## Steps

### 1. Write the must-haves and the deal-breakers

Before searching, write five lines the client signs off: product and spec level, target landed cost, first order units, certificates required, and the latest date stock must land. Every supplier is judged against these, not against how good their page looks.

If competing products exist, read their 1-star reviews and turn the repeated complaints into must-haves for your supplier, for example "zip must not split" or "colour must match photos" [AMZ-0002].

### 2. Search wide, in the right places

Aim to contact 10 to 15 suppliers so that 3 to 5 survive; one founder starts sampling from that many verified factories [COG-0007]. Mix the channels:

| Channel | Best for | Watch for |
|---|---|---|
| Alibaba.com | Overseas factories, custom and private label | Traders posing as factories |
| Regional B2B directories (Thomasnet in the US, Europages in Europe) | Local makers and wholesalers, lower minimums, local-currency pricing | Listings that are resellers |
| Local markets and clusters | Fast samples, small runs, visiting in person | No paperwork, no tax invoice |
| Trade fairs | Meeting the owner, seeing the work | Fair prices that change later |
| Who makes for the leaders | Better factories in the category | Requires digging |

Find who makes for the leading brands in the category (pack labels, import records, trade press, asking around), then check their capacity and certificates; good manufacturers are often found this way rather than through listings [COG-0012]. Choosing a country is a trade of lead time against cost; one practitioner put one move at about 30% longer lead time for about 30% lower cost [COG-0004]. Only split production across countries once volume can carry it.

How wide to go depends on the product: for an off-the-shelf item, contacting 10 to 50 factories is fine; for a sensitive new design, qualify one or two first and share drawings only after an NNN is signed (`nnn-agreement-for-china-factories`). Accio can do the first pass on Alibaba.com with the find and verify prompts in `accio-and-alibaba-sourcing-prompts`, but treat its matches as leads, not proof a supplier is real.

### 3. Send one screening message

Ask the same five questions of everyone so answers compare: Are you the factory or a trader? Which similar products have you made, with photos? Minimum order and price at that minimum? Production lead time? Which certificates do you hold for this product? Ask for a video call or a live video walk of the line. Keep their email and a messaging contact (WhatsApp or WeChat) as well as platform chat, because platform chats go quiet.

### 4. Check each one against the red flags

Mark each flag pass or fail. Two fails, or any one starred fail, cuts the supplier.

| Red flag | How to check |
|---|---|
| Asks to be paid off-platform or to a different company name * | Platform protection only covers orders paid through the platform [COG-6265] |
| Bank account name differs from the business name * | Compare the invoice, licence and bank details |
| Tax or VAT number does not match the legal name or is inactive * | Free checks: EU VIES for VAT numbers, the UK VAT number check, Australia's ABN Lookup, or your country's tax portal |
| Cannot show the required certificate for this product * | Ask for the certificate and check it with the issuer |
| Will not do a video walk-through of the floor | Request a live call, not recorded clips |
| Price far below every other quote | Ask what material or step is different |
| Vague answers to spec questions | Ask one exact spec question and see if they answer it |
| Very new account, no export history to your country | Platform profile, references from buyers |
| Slow replies (more than two working days) during the sale | Log response times from the first message |
| Sends new bank details in chat for an Alibaba.com order * | On Alibaba.com, pay only to the bank details shown at checkout |
| Badge shown as a factory audit, but only a business registration check behind it | Ask who audited and for the dated report |
| Will not say who makes the product, or plans to subcontract | Ask for the factory address and do a video walk there |

For a supplier you will spend serious money with, a third-party factory audit before the first order covers capacity, process, machinery and quality system; one inspection firm lists about 398 dollars per man-day with a report in 2 days. Pay only the company that signs the contract, into its own company account; payments to Hong Kong, personal, broker or related-company accounts raise fraud risk and weaken any claim.

### 5. Score the survivors

Score 1 to 5 on each: fit to spec, price against target, minimum order against your first order, lead time against your land-by date, communication, certificates and paperwork. Weight fit and paperwork double (practitioner default, test it). Keep the top 3 to 5.

Score evidence, not claims: give credit for similar past work only when the supplier shows product names or photos you can check, and for certificates only when you have checked them with the issuer. A red flag that could harm customers or the store (a false certificate, hidden subcontracting) means "do not use" whatever the score.

### 6. Plan the backup from day one

Keep at least two suppliers live through sampling. Letting a factory know you have alternatives and real competing quotes keeps price and quality honest [COG-0003]. A new, cheaper supplier earns volume only after a small trial order, about 500 units in one case, because a switch to a cheaper factory with untested quality can deliver mostly faulty stock [COG-0009].

Map the dependency: list every product with its supplier and that supplier's share of the store's volume. Any product with one source is a risk to reduce, starting with the products that earn the most gross profit. For a one-product store, that can mean confirming a second source exists and holding some safety stock, not splitting the order yet.

### 7. Note what the money looks like

For each survivor, note the payment terms they offer. Terms longer than your production plus shipping time give the store float; terms shorter mean cash is tied up before stock sells [FIN-0005]. This feeds the negotiation in `negotiate-moq-and-price`.

### 8. Hand off

Send the shortlist to `write-rfq-and-compare-quotes` and the sample plan to `order-samples-and-quality-check`.

## Market notes

- **All markets:** small makers often quote ex-works with tax extra; confirm the tax rate and the HS code on the quote. Ask for a tax invoice and the shipping documents when goods move. Many want an advance by bank transfer; keep any advance small until a sample has passed.
- **UK, EU, Canada and Australia imports:** customs duty is a cost, while import VAT or goods and services tax paid at the border can usually come back as a credit for a registered store; confirm with the accountant.
- **US imports:** duty-free entry for small shipments ended in August 2025, so even sample shipments carry duty [COG-6261].

## Checks before you hand it over

- Every supplier contacted is on the sheet, kept or cut, with a reason.
- No kept supplier has a starred red flag.
- Payment goes only to the company that signs, through the platform's own bank details where a platform is used.
- Every single-source product is named on the dependency map.
- Each kept supplier's certificate for this product has been seen, not promised.
- At least two kept suppliers are in different companies (no trader and factory pair that are the same source).
- Minimum order and lead time are compared against the client's first order and land-by date.
- Payment terms and payment route are recorded for each.
- No money was paid and no message sent without the client's approval.

## Output

**One-screen summary:** the recommended first-choice supplier and backup, why, their price at minimum, lead time, and the top risk for each. Runner-up in one line.

**Supplier shortlist sheet:**

| Supplier | Channel | Factory or trader | Country and city | Products made | MOQ | Price at MOQ | Lead time | Certificates seen | Payment terms and route | Response time | Red flags failed | Score | Keep or cut | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Screening message template:** the five questions from step 3, with the product paragraph and must-haves pasted in.

**Next steps list:** who gets the request for quote, who gets a sample order, and the date each answer is due.

## Common mistakes

- **Shortlisting by page polish.** Step 1 judges against signed must-haves.
- **One supplier only.** Step 6 keeps two live and trials the new one small.
- **Paying off-platform for a discount.** Step 4 treats it as a starred red flag.
- **Trusting a certificate photo.** Step 4 checks it with the issuer.
- **Hunting for the lowest price.** Step 5 weights fit and paperwork double; the cheapest quote often hides a cheaper material.
- **Forgetting the rules.** Gate 3 cuts suppliers who cannot meet each market's product safety rules before scoring.
- **Sending a new design to 20 factories.** Step 2 qualifies one or two first and signs an NNN.
- **Paying bank details sent in chat.** Step 4 pays only the signing company, through the platform's own details.

## Sources

- AMZ-0002: turn competitors' 1-star complaints into the supplier spec.
- COG-0003: keep factories aware of backups and competing quotes.
- COG-0004: moving country trades lead time against cost.
- COG-0007: message 10 to 15 factories; judge who follows instructions.
- COG-0009: expect defects; trial a cheaper new supplier with about 500 units.
- COG-0012: find makers through who supplies leading brands, then vet capacity and certificates.
- FIN-0005: supplier float is payment terms minus lead time.
- COG-6261 (proposed): US de minimis ended for all countries in August 2025.
- COG-6265 (proposed): platform protection only when paid through the platform.
- QualityInspection.org, When should you request quotations from Chinese factories?: https://qualityinspection.org/request-quotations/
- Alibaba.com Trade Assurance, Payment: https://tradeassurance.alibaba.com/ta/Payment.htm
- V-Trust, Factory Audit service: https://www.v-trust.com/en/our-services/supplier-evaluation/factory-audit-service-in-china-india-vietnam-malaysia-thailand-bangladesh-pakistan-indonesia-cambodia
- Harris Sliwoski, China Manufacturing Contracts and payment terms: https://harris-sliwoski.com/chinalawblog/china-manufacturing-and-the-huge-impact-of-payment-terms/
- Harris Sliwoski, NDAs Do Not Work for China, but NNN Agreements Do: https://harris-sliwoski.com/chinalawblog/ndas-do-not-work-for-china-but-nnn-agreements-do/

What makes this skill ours: the shortlist starts from a target landed cost and signed deal-breakers rather than search results; local checks (tax number match, product safety marks, small advances) sit beside the global ones; starred red flags cut a supplier outright; and the backup supplier is planned from the first day instead of after the first failure.

## Selling in India

- IndiaMART and TradeIndia list Indian makers and wholesalers with lower minimums and rupee pricing; watch for resellers.
- Red flag: the GSTIN does not match the legal name or is inactive. Check it free with "Search Taxpayer" on the GST portal.
- Check whether a Quality Control Order makes the BIS mark compulsory for the product [COG-6266].
- For imports the store needs an Importer Exporter Code and its GSTIN on the bill of entry [COG-6260]. Customs duty is a cost, while IGST paid at import can come back as input tax credit for a GST-registered store.
- Suppliers often quote ex-works with GST extra; confirm the GST rate and HSN code. Ask for a tax invoice and an e-way bill. Keep any UPI advance small until a sample passes.

Sources: COG-6260 (proposed): IGST on imports is creditable, customs duty is not. COG-6266 (proposed): Quality Control Orders make BIS marks compulsory for listed products.
