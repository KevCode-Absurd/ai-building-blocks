---
name: accio-and-alibaba-sourcing-prompts
description: "Paste-ready sourcing requests for Accio (Alibaba's AI sourcing agent), Alibaba.com RFQs, enquiries to domestic supplier directories (Thomasnet, Europages and similar), and messages for 1688, Global Sources and Made-in-China, all built from one written spec, plus a checklist for reading and verifying what comes back: badge and audit report, factory or trader, Trade Assurance or other payment cover, MOQ, samples, lead time and Incoterm. Use when the store has decided what to make and needs suppliers to answer in one comparable format, when an owner wants to use Accio but does not know what to type, or when replies from a marketplace are too many and too vague to compare."
---

# Accio and Alibaba sourcing prompts

**You get:** a prompt pack (one Accio request, one Alibaba.com RFQ, one domestic directory enquiry, and short messages for 1688, Global Sources and Made-in-China), every one filled from the same spec, and a reply check sheet that marks each supplier keep, ask or cut with the reason, ready for `write-rfq-and-compare-quotes`.

## When to use

- The product is chosen and the store needs real suppliers to quote on the same terms.
- The owner wants to try Accio and needs the exact request to type and the limits to set.
- A marketplace RFQ brought 30 replies in 30 formats and nobody can tell factory from trader.
- A store wants to compare a supplier in its own country or region with a price from a factory in China.

## Not for

- Deciding if the product is worth selling: use `validate-demand-before-buying-stock` first.
- The full red-flag vetting of a shortlist: use `find-and-vet-suppliers` (this skill feeds it).
- Comparing quotes as landed cost: use `write-rfq-and-compare-quotes` and `calculate-landed-cost-per-unit`.
- Writing the factory spec from scratch: use `write-product-spec-sheet-for-factory`.
- Bargaining once quotes are in: use `negotiate-moq-and-price`.
- Longer supplier messages in Chinese, with back-translation: use `bilingual-supplier-messages`.

## What you need

Required:

1. **Spec in writing:** product, material, size, weight, colours, logo method, packaging, and the certificates and labels the selling market needs (for example CPSC rules such as children's product certificates in the US, UKCA or CE marking and the UK and EU product safety rules in Europe, and your market's labelling rules elsewhere). For a stock product, the listing link plus a written list of changes.
2. **Quantities:** first order and two larger tiers (for example 300, 1,000 and 3,000).
3. **Target landed cost per unit** from `calculate-landed-cost-per-unit`, worked back from the selling price.
4. **Delivery point and Incoterm:** warehouse or 3PL address, and whether you want EXW, FOB at a named port, or delivered (DDP) prices.
5. **Land-by date.**

Optional: a competitor product to match on quality, the 1-star reviews of rival products (what must not go wrong), a freight forwarder's rate card.

Access: the owner creates and signs in to the Accio, Alibaba.com and supplier directory accounts; the agent never handles passwords. At level 2 the agent fills requests as drafts. Sending any request, letting Accio contact suppliers, and every payment need the owner's yes in chat. Nothing in a request commits the store to buy, and each one says so.

## Before you start: the gates

1. **Spec is complete.** Pass: every field above has an answer or "supplier to propose". Fail: stop. A vague request lets each factory fill the gaps its own way, and the quotes cannot be compared.
2. **Cost ceiling known.** Pass: the most the store can pay per unit landed is written down. Fail: run `calculate-landed-cost-per-unit` backwards first.
3. **Not a copy.** Pass: the product does not copy a registered brand, design or patent. Fail: stop; this skill does not source copies.
4. **Who sends.** Pass: the owner has said which account sends and approved the text. Fail: keep everything as drafts.

## Steps

### 1. Write the one-line brief once

Every prompt below is built from this block, so suppliers answer the same question.

```
Product: [name], [material], [size], [weight], [colours]
Custom: [logo method and position], [packaging: retail box / polybag / insert]
Quantities: [Q1] / [Q2] / [Q3] units
Price basis: [EXW / FOB named port / DDP to city]
Ship to: [city, country]   Land by: [date]
Must have: [certificates], [test reports], [materials to avoid]
Target: under [price] per unit at [Q2] (do not share if you plan to negotiate hard)
```

### 2. The Accio request

Accio Work is Alibaba's AI business agent. Its Sourcing Toolkit uses an official Alibaba.com connector to match suppliers, compare offers, send bulk enquiries, negotiate and, if you let it, place orders. The owner reviews matches, picks targets and authorises outreach; payments need the owner's explicit approval, and permission choices are logged. Treat its comparisons as a first pass: Accio's own pages do not say it checks suppliers independently.

Paste this as one message, filled from step 1:

```
Find Alibaba.com suppliers for [product]. Spec: [spec block].
Requirements: Verified Supplier, makes the product in its own factory (not a trading company), OEM and logo printing supported, MOQ no higher than [Q1], ships to [country].
For each match, show: company name, years on Alibaba.com, badge and who audited it, factory location, main products, MOQ, unit price at [Q1] / [Q2] / [Q3], price basis, sample cost and time, production lead time, Trade Assurance available (yes/no), certificates listed.
Rank by fit to the spec, then price at [Q2]. Show 10. Do not contact anyone yet.
```

Then, after the owner picks the names:

```
For suppliers [list], check: does the business licence match the company name; do their export records and stated main products match [product]; how long have they made it; any complaints or disputes shown. Give a keep, ask or cut for each with the reason.
```

Only after the owner's yes:

```
Send this enquiry to [list] only: [RFQ text from step 3]. Do not agree a price, sample payment or order. Report every reply in one table.
```

When quotes are in and the owner has set target, fallback and walk-away numbers in `negotiate-moq-and-price`, Accio can run the first rounds of talks inside hard limits:

```
Negotiate with [suppliers] on [product], spec version [x], price basis [FCA or FOB port].
Order of asks: 1) [ask] in return for [give]; 2) [ask] in return for [give].
You may say these numbers: [target and fallback only]. Share competing prices, never competing supplier names.
Ask each supplier whether its price includes Chinese VAT.
You may not accept any price, MOQ, sample payment, deposit or order. If a supplier reaches [fallback] or better, reply "acceptable in principle, pending owner approval" and stop.
If a supplier will not move past [fallback], thank them and stop.
Report each reply as: supplier, ask, answer, new number, price basis, next step.
```

Never paste the walk-away or the landed cost ceiling into Accio.

### 3. The Alibaba.com RFQ (also works for Global Sources and Made-in-China)

```
We are sourcing [product] for [market]. Spec attached, version [x].
Please quote in this table: unit price at [Q1] / [Q2] / [Q3]; price basis [EXW or FOB port]; mould, plate or sample fees and whether refunded on order; packaging included; units per carton, carton size and gross weight; production lead time from deposit and from sample approval; payment terms; defect policy; certificates and test reports for this product; quote valid until.
Please say whether the price includes Chinese VAT (含税) or not (不含税).
Please confirm you manufacture this item yourselves and send 3 photos or a short video of it on your line.
We are asking several suppliers. This is a request for price only, not an order. Reply by [date].
```

On Alibaba.com, ask that any order runs as a Trade Assurance order paid through the platform: that is what holds the money in escrow until delivery is confirmed and gives a refund route for non-shipment, late or defective goods.

Know what that cover needs and where it stops:

- A bank wire keeps protection only when sent to the bank details Alibaba.com shows at checkout, never to details a supplier sends in chat.
- Refund claims must be made within 30 days of delivery (60 days for Enterprise buyers), so inspect as soon as goods land. In a dispute you can ask Alibaba.com to step in 3 days after applying, and a claim closes if you go silent for 7 days.
- The on-time delivery guarantee pays 10% delay compensation capped at 100 dollars, and only on eligible orders shipped with Alibaba.com Logistics. Easy Return covers defective, wrong or damaged goods only in listed countries and on orders under 3,000 dollars.
- Write the spec version, quality standard, inspection and ship date into the order itself, since a claim is judged on what the order says.

For container goods, ask for FCA (named terminal or factory) prices beside FOB; ICC keeps FOB for bulk cargo loaded onto a ship.

Sample request message (after the owner picks 2 or 3 suppliers):

```
Please make [2] samples to our spec, version [x], and quote the sample fee, courier cost to [city], and making time. Will the sample fee be refunded on the bulk order? Please create a Trade Assurance sample order so we can pay on Alibaba.com.
```

### 4. The 1688 message

1688 is China's domestic wholesale site, in Chinese, with prices for buyers inside China. Use it to learn the factory-gate price range, then buy through a sourcing agent or a supplier that also sells for export. Keep the message short, in simple Chinese (a translation of the RFQ's quantity, spec and carton lines), and never pay a 1688 seller directly from abroad without an agent who can inspect.

Prices on 1688 are often tax included (含税, with China's 13% VAT on most goods) and exclude export packing and port charges, so take the VAT out before comparing. A short message for the agent to send:

```
您好，请问这款产品按以下规格的价格：[材质]、[尺寸]、[重量]、[颜色]、[包装]。数量[1,000]件，不含税单价是多少？起订量、交期和外箱尺寸也请告知。谢谢！
```

Back-translation: "Hello, what is the price of this product to this spec: [material], [size], [weight], [colour], [packing]? For [1,000] pcs, what is the unit price excluding tax? Please also tell us the MOQ, lead time and outer carton size. Thank you!" For longer talks use `bilingual-supplier-messages`.

Plan around Chinese New Year: factories lose 2 to 4 weeks (in 2027 the holiday runs 5 to 13 February), so place orders that must land before April by mid-December and inspect the first lots after the holiday closely.

### 5. The domestic supplier enquiry

For suppliers in the store's own country or region, found through a directory such as Thomasnet (North America), Europages or Kompass (Europe), or a trade show list:

```
Hello. We need [product], [spec], [Q1] units to start, delivered to [city, region].
Please share: price per unit at [Q1] / [Q2] / [Q3] before sales tax or VAT, the tax rate you will charge, your company and VAT or tax registration number, MOQ, sample cost, dispatch time, freight to [city], payment terms, and photos of your own unit.
Invoices must carry your registered company name and tax number so we can reclaim any VAT we are due. This is a price enquiry, not an order.
```

Send from the store's own account and only to suppliers' listed business contacts. Ask for prices before sales tax or VAT so they compare with imports.

### 6. Read and verify every reply

Mark each supplier keep, ask or cut on this list:

| Check | Keep | Ask | Cut |
|---|---|---|---|
| Factory or trader | Own line shown in photos or a live video walk | Says "factory" but only stock photos | Will not show the line |
| Badge (Alibaba, Global Sources, Made-in-China) | Third-party audit report seen, dated within about a year | Badge but no report shared | Badge is a business registration check only and the supplier claims it is a factory audit |
| Business match | Licence name matches the account and the bank name | Small mismatch explained in writing | Pays to a personal or third-party account |
| Trade Assurance (Alibaba) | Offered for this order | Only for part of the order | Asks to pay off-platform |
| Bank details (Alibaba) | Pays only to the details shown at Alibaba.com checkout | Asks to confirm details by phone first | Sends new bank details in chat |
| Tax in price | Says 含税 or 不含税 clearly | Unclear, asked once | Will not say |
| Domestic directory supplier | Company registration and tax number that match the invoice | Listed but not verified | No company or tax number, or wants payment to a personal account |
| MOQ | At or under Q1 | Above Q1 but negotiable | Far above, with no tiers |
| Samples | Paid sample within 2 weeks | Sample only after deposit | No samples |
| Price | Within about 20% of the middle quote | Far under the rest, with a reason | Far under the rest, no reason |
| Answers | Every RFQ field filled | One or two fields missing | Skips half, chased once, no reply |

Most platform payment cover is narrow: it often covers non-delivery or a clear breach of the agreed terms, not every quality dispute, and domestic directories usually offer none. So for custom goods, the sample and an inspection are the protection.

### 7. Hand over

Keep three to five. Put every quote into the comparison sheet in `write-rfq-and-compare-quotes`, plan samples in `order-samples-and-quality-check`, and leave the owner the brief block, prompts and check table so the next search is theirs.

## Checks before you hand it over

- Every prompt and RFQ is filled from the same brief block, with the same quantities and price basis.
- Accio was told not to contact anyone until the owner picked names and said yes.
- Any Accio negotiation brief has hard limits, cannot accept anything, and carries no walk-away or ceiling.
- Every China quote says whether it includes VAT, and every Alibaba.com order pays only to checkout bank details.
- Each request says it is a price request, not an order.
- Every supplier has keep, ask or cut on every row of the check table, with the reason.
- Badges are recorded with who audited and the report date, not just the icon.
- No deposit, sample payment or order was made by the agent.
- Domestic quotes are before sales tax or VAT, with the supplier's tax number noted.

## Output

**One-screen summary:** platforms used, replies received, suppliers kept (3 to 5) with one line each, the top risk, and what to ask next.

**Prompt pack** (`sourcing-prompts.md`): the brief block, the Accio find, verify and send messages, the Alibaba.com RFQ, the 1688 note, and the domestic supplier enquiry.

**Reply check sheet** (`supplier-replies.csv`):

| Supplier | Platform | Link | Factory or trader | Badge, auditor, report date | Trade Assurance or other cover | MOQ | Price at Q1 / Q2 / Q3 | Basis | Sample cost and days | Lead time | Fields missing | Verdict | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Typing the product name only into Accio.** Step 2 sends the full spec, limits and the "do not contact" line.
- **Trusting the badge icon.** Step 6 asks who audited and for the dated report.
- **Paying off-platform for a better price.** It drops Trade Assurance cover; step 6 cuts it.
- **Comparing EXW with DDP.** Step 1 fixes one basis for everyone.
- **Using 1688 prices as an import quote.** Step 4 uses them as a price range only.
- **Counting reclaimable VAT as cost.** Step 5 asks for prices before tax and the supplier's tax number.
- **Letting Accio close the deal.** Step 2 lets it report numbers, never accept them.
- **Missing the Trade Assurance claim window.** Step 3 diaries 30 days from delivery.

## Sources

- Accio Work help center, Sourcing Toolkit section: https://www.accio.com/wow/doc-help-center.html
- Accio Work official agents and example sourcing prompts: https://www.accio.com/wow/agents.html
- Alibaba.com Trade Assurance: https://tradeassurance.alibaba.com/
- Alibaba.com seller blog on supplier badges and buyer protection: https://seller.alibaba.com/businessblogs/which-wholesale-platforms-verify-their-suppliers-badges-samples-and-buyer-protection-policies-compared-px002dh5g
- Alibaba.com Trade Assurance, Money-back policy: https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm
- Alibaba.com Trade Assurance, Shipping and logistics: https://tradeassurance.alibaba.com/ta/ShippingAndLogistics.htm
- Alibaba.com Trade Assurance, Payment: https://tradeassurance.alibaba.com/ta/Payment.htm
- Alibaba.com, Trade Assurance for suppliers: https://activity.alibaba.com/ggs/trade_assurance.html
- ICC Academy, Incoterms 2020: FCA or FOB?: https://academy.iccwbo.org/incoterms/article/incoterms-2020-fca-or-fob/
- Value-Added Tax Law of the People's Republic of China (LexisNexis China, English): https://www.lexiscn.com/law/law-english-1-5601651-T.html
- State Council notice on 2027 public holidays: https://www.news.cn/politics/20261105/f90cd6ad4df94ab4833b141e52ccfc13/c.html
- QualityInspection.org, Chinese New Year: how to manage the disruption: https://qualityinspection.org/chinese-new-year-production-planning/

What makes this skill ours: one brief block feeds every platform so the answers can be compared; Accio is used as a fast first pass with the owner's yes before any contact and never as proof a supplier is real; badges are judged by the dated report behind them; and domestic suppliers are compared before sales tax or VAT with the tax number checked, beside imports on the same quantities.

## Selling in India

- For domestic Indian suppliers, use IndiaMART or TradeIndia in place of the step 5 directory. Ask for price ex-GST, the GST rate and HSN code, and the supplier's GSTIN, and say bills must carry the GSTIN so the store can claim input credit.
- Keep a supplier with TrustSEAL and an active GSTIN that matches the bill; ask when only GST is verified; cut one with no GSTIN or who wants UPI to a personal number.
- IndiaMART's payment protection covers only full non-delivery by TrustSEAL suppliers, paid into their verified business account and claimed within 60 days. It excludes quality disputes, partial or late delivery and custom-made orders.
- Product certificates for India include BIS where a Quality Control Order applies and Legal Metrology pack labels.
- Source: IndiaMART Buyer Payment Protection Plan terms: https://help.indiamart.com/knowledge-base/payment-protection-plan/
