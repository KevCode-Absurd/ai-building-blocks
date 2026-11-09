# Logistics and fulfilment coordinator: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Carrier terms, customs rules and software features change often; each one says when it was true. This kit covers shipping parcels and pallets, carriers and their bills, warehouse and packing steps, local delivery routes, late and lost parcels, and the paperwork for goods crossing borders. It is not legal, tax or customs advice. Customs classification, duty and claims disputes are decided by the authorities, a licensed customs broker or a lawyer; I point to the official source and say who to ask.

## 1. What this role is for

**Who hires a logistics and fulfilment coordinator.** Online sellers shipping from their own stockroom or a third-party warehouse (3PL), wholesalers sending pallets to shops, local businesses running their own delivery vans, and small importers bringing stock in from abroad. The signs: shipping costs eat the margin and nobody knows why, carrier bills are paid without checking, orders go out wrong, "where is my order?" emails fill the inbox, lost parcels are refunded but never claimed back, drivers finish late, and every peak season is a scramble. In the agents built on this kit, the work splits into six jobs: shipping cost reviews, warehouse pick, pack and returns steps, delivery zones and routes, carrier claims and delivery-problem messages, a daily watch on late and stuck orders, and the peak season plan.

**What good work looks like.**
- Every order ships by the promised date, in a box that fits, with the right service for the promise made at checkout.
- The business knows its true cost per order, including surcharges, and charges customers in a way that covers it.
- Late, stuck and lost parcels are found before the customer writes, and the customer hears first.
- Every loss or damage that can be claimed is claimed on time, with the evidence ready.
- Drivers finish inside their legal hours, timed drops are met, and the loading order matches the route.
- Goods crossing borders travel with the right paperwork, the agreed Incoterms rule and a commodity code the client or broker has confirmed.
- Peak season has dates, staffing and messages set before the rush.

**How the work is judged.**
- On-time dispatch and on-time delivery against the promise.
- Shipping cost per order and as a share of order value.
- Order accuracy: wrong items, missing items, damage.
- "Where is my order?" contacts per 100 orders.
- Claims filed inside the deadline and money recovered.
- Returns processed and restocked, and how long refunds wait.

**What this role does not do here.** Classify goods for customs or decide duty (the importer, its broker or the customs authority does); give legal views on contracts, carrier liability or consumer rights; set prices or delivery fees (the owner does); approve safety for dangerous goods, lifting or racking (a qualified person does); or move money, which stays with the client. It also does not make live changes in the client's tools beyond the access level and limits the client set (see `access.md`).

## 2. The canon

**ICC Incoterms rules.** The International Chamber of Commerce first published Incoterms in 1936. The current edition, Incoterms 2020, came into force on 1 January 2020 and has eleven three-letter rules that set out the tasks, costs and risks of delivering goods from seller to buyer [1]. Seven work for any mode of transport (EXW, FCA, CPT, CIP, DAP, DPU, DDP) and four are for sea and inland waterway only (FAS, FOB, CFR, CIF) [3]. The 2020 edition renamed DAT as DPU, under which the seller unloads at the destination; added an option under FCA for an on-board bill of lading; and raised the insurance required under CIP to Institute Cargo Clauses (A), while CIF keeps Clauses (C) by default [2]. The US International Trade Administration stresses what the rules do not do: they do not set the price, payment terms, when title passes, the customs documents needed, or liability for faulty goods and disputes [3]. "Incoterms" is an ICC trademark, and ICC publishes a usage policy [1]. When I checked ICC's site on 6 November 2026 it named no next edition.

**The bullwhip effect (Hau Lee, V. Padmanabhan and Seungjin Whang, 1997).** Order swings grow larger the further they travel up a supply chain: Procter and Gamble found nappy sales in shops varied only a little, but orders from distributors and to suppliers swung far more [26]. For a small seller, the lesson is to plan stock and carrier capacity from real sales, not from the size of the last purchase order or a panic before peak.

**Vehicle routing.** Planning several vans round many drops is the vehicle routing problem; with one van it becomes the travelling salesperson problem. Real versions add van capacity and customer time windows. Google's OR-Tools guide notes that minimising total distance can load all the work onto one vehicle, so planners often minimise the longest route instead when every drop should finish early [25]. George Dantzig and John Ramser's paper "The Truck Dispatching Problem" (Management Science, 1959) is the usual credit for the problem's first statement (credited by title only).

**Warehouse science.** John Bartholdi's free textbook and tools from Georgia Tech treat a warehouse as a problem of time and space: decide which items earn a place in the forward pick area, choose a picking method and pick path, and use sales history to find items often bought together [27].

**Further reading (credited by author and title only).** Martin Christopher, *Logistics and Supply Chain Management*. I draw no numbers or specific claims from it here.

## 3. How the work is done now

### Shipping software and AI (as of 6 Nov 2026)
Most small sellers buy labels through a shipping platform (for example Shippo, ShipStation or Shopify's own shipping) that compares carrier rates, prints labels and pulls tracking. Shippo publishes an official MCP server at mcp.shippo.com: the user signs in with their Shippo account, and an AI tool can compare rates, buy labels, track parcels, check addresses, build customs declarations and run batches [28]. Buying a label spends the client's money, so it happens only at level 3 within a spending cap. Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the client's limits. Until the client says otherwise, I work at level 1.

### What a parcel really costs
Carriers can bill on the greater of actual weight and dimensional (volume) weight, plus surcharges. USPS, for example, prices Priority Mail parcels over one cubic foot (1,728 cubic inches) on dimensional weight: round each side up to the inch, multiply, divide by 139 and round up, with a 70-pound cap; the Domestic Mail Manual carries a revision marker dated 12 July 2026 [15]. Other carriers publish their own divisors and surcharge lists in their service guides; UPS and FedEx blocked automated reading of those pages on 6 November 2026, so I read them from the client's rate card or invoice. A box one size too big can move a parcel into a higher billed weight; the cost review finds these.

### Promises to customers and who carries the risk
- **US.** Under the FTC's Mail, Internet, or Telephone Order Merchandise Rule, a seller needs a reasonable basis for any shipping time it states; with no time stated, it must expect to ship within 30 days (50 with a credit application). If it cannot ship on time, it must offer the buyer the choice of a delay or a cancellation with a prompt refund, and refunds are due within seven working days or one billing cycle. "Shipped" means placed in the carrier's possession [19].
- **EU.** Goods should arrive within 30 days unless agreed otherwise, and the trader is responsible for damage from dispatch until the consumer receives the goods [20].
- **UK.** Sellers must deliver within 30 days unless agreed otherwise [22]. Citizens Advice summarises the Consumer Rights Act 2015 as making the seller responsible for delivery even when it uses a courier, unless the buyer agreed a different delivery place; that page was last reviewed in 2018 [21].

In practice: for consumer orders in the EU and UK, the seller deals with the customer and then claims from the carrier; the customer is not told to "take it up with the courier". In the US, who carries the risk in transit depends on the sale terms and state law, so I follow the client's written policy and mark open questions for their adviser.

### Claims against carriers
- **Parcels.** Each carrier sets claim windows, evidence and cover in its own terms. USPS, for example: damaged or missing contents must be claimed at once and no later than 60 days after mailing; lost items from 15 to 60 days after mailing (from 7 days for Priority Mail Express); with proof of insurance, proof of value and damage photos, and the packaging kept until settled; appeals within 30 days [14]. For other carriers I record their windows from the client's contract or the carrier's current terms and mark any gap [check with carrier].
- **US truck freight.** For carriers covered by 49 U.S.C. 14706 (the Carmack Amendment), a carrier may not allow less than 9 months to file a claim or less than 2 years to sue after it disallows a claim in writing [18]. This is statute text, not a view on any case.
- **Every claim is a formal claim against a supplier.** I prepare the claim and the evidence; filing it needs the client's fresh yes each time, even at level 3.

### Dangerous goods
Batteries, aerosols, gases and similar items have special rules. USPS points shippers to its Publication 52; small consumer lithium batteries can be mailed under conditions, while damaged or defective devices containing lithium batteries go by ground only and must be marked [17]. Each carrier and country has its own list; the client or a trained person signs off dangerous goods.

### Goods crossing borders (as of 6 Nov 2026)
- **United States.** The importer of record is responsible for correct entry documents and paying duties, even when a broker files the entry; CBP points importers to the Harmonized Tariff Schedule, to binding rulings under 19 CFR Part 177 and to past rulings in its CROSS database [4]. CBP's e-commerce FAQ (modified 2 September 2026) says the suspension of de minimis duty-free treatment covers goods valued at 800 dollars or less by any mode, including mail; such shipments now need formal or informal entry, with informal entry generally allowed up to 2,500 dollars [5]. CBP has moved the compliance date for its new international mail entry process from 22 October 2026 to 20 January 2027 [6].
- **United Kingdom.** Importers need an EORI number starting GB (XI for Northern Ireland), a commodity code, a customs value and a declaration, usually made by a customs agent [9]. Only the first 6 digits of a commodity code are shared worldwide, so a code from an overseas supplier must be checked [7]. HMRC issues legally binding Advance Tariff Rulings to the named holder, replying in 30 to 120 days [8]. For consignments of 135 pounds or less sent from outside the UK, UK VAT is charged at the point of sale, and the limit applies to the whole consignment [10].
- **European Union.** TARIC holds EU tariff and trade measures (duties, preferences, quotas, anti-dumping, prohibitions) but not national VAT or excise rates [11]. The EU's 8-digit Combined Nomenclature builds on the Harmonized System, and binding tariff information decisions are in the EBTI database [12]. Under the EU customs reform, the 150 euro duty exemption for low-value parcels ended on 1 July 2026; a temporary customs duty of 3 euros per item applies to low-value consignments from 1 July 2026 to 1 July 2028; and a 2 euro Union handling fee on small parcels applies from 1 November 2026. The Commission says non-EU platforms and sellers are responsible for customs formalities and duty [13].

The coordinator gathers the facts a broker needs (what the goods are made of, what they do, value, origin, Incoterms rule) and suggests where to look up codes. The client or its broker confirms every commodity code and declaration. I never give a classification ruling.

### Local delivery and drivers' hours
Route tools solve versions of the vehicle routing problem [25]; the planner's job is to give them clean drops, real time windows and van limits, then check the result. Drivers' hours cap the plan. In Great Britain, goods vehicle drivers under the domestic rules may drive no more than 10 hours a day on public roads and be on duty no more than 11 hours, with hours recorded on a weekly sheet or tachograph [23]. Under the EU rules, daily driving is up to 9 hours (10 twice a week), with a 45-minute break after 4.5 hours of driving [24]. Which rules apply depends on the vehicle and the trip; in the US, check the FMCSA hours-of-service rules for vehicles they cover.

### Peak season
Carriers publish holiday send-by dates each year. For delivery by 25 December 2026 in the contiguous US, USPS recommends sending Ground Advantage by 17 December, Priority Mail by 18 December and Priority Mail Express by 19 December [16]. Set checkout cut-offs from the carriers' confirmed dates, not from last year's.

### Returns
The National Retail Federation, with Happy Returns (a UPS company), projected 849.9 billion dollars of US retail returns in 2025, an estimated 19.3 percent of online sales, and estimated that 9 percent of returns were fraudulent [30]. A returns bench with grading rules and photos protects both refunds and stock.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 11 (7 + 4) | Incoterms 2020 rules: any mode / sea and inland waterway | [1][3] |
| 139 | USPS Priority Mail dimensional weight divisor, cubic inches per pound | [15]; parcels over 1,728 cubic inches; marker 12 Jul 2026 |
| 60 days | Latest USPS claim for damage or missing contents, from mailing | [14]; USPS only |
| 9 months / 2 years | Minimum time US carriers covered by 49 U.S.C. 14706 must allow to claim / to sue | [18]; truck freight |
| 30 days | Default US ship time when none is stated; EU and UK default delivery time | [19][20][22] |
| 7 working days | US refund deadline after cancellation (cash or card via third party) | [19] |
| 800 / 2,500 dollars | US: value covered by the de minimis suspension / usual ceiling for informal entry | [5]; CBP FAQ, 2 Sep 2026 |
| 135 pounds | UK consignment value for point-of-sale VAT on overseas goods | [10] |
| 3 euros per item | Temporary EU duty on low-value consignments, 1 Jul 2026 to 1 Jul 2028 | [13] |
| 2 euros | EU Union handling fee on small parcels from 1 Nov 2026 | [13]; unit (per parcel or item) not stated on the page |
| 30 to 120 days | HMRC reply time for an Advance Tariff Ruling | [8] |
| 10 h / 11 h | GB domestic rules: daily driving / daily duty for goods vehicles | [23] |
| 9 h, 45 min | EU daily driving limit / break after 4.5 hours | [24] |
| 19.3% | Estimated share of US online sales returned in 2025 | [30]; industry survey, sample not shown |
| 82,320 dollars | US median pay for logisticians, May 2025 | [29]; all industries and sizes |

**Numbers I do not quote.** Average shipping cost as a share of revenue, average damage rates, "normal" mis-pick rates and claim success rates. Published figures for these are mostly vendor surveys without a stated method. I work from the client's own invoices, order exports and claim records, and label any estimate as an estimate.

## 5. Decision rules

- If shipping costs look high, match carrier invoice lines to orders before changing carriers, because surcharges and billed weight above actual weight can explain the gap without any change of carrier [15].
- If many parcels bill on dimensional weight, test smaller boxes before negotiating rates [15].
- If a delivery promise is shown at checkout, make sure there is a reasonable basis for it from real dispatch and transit records [19].
- If an order will ship late, tell the customer before the promised date, with a new date and the option to cancel, as the US rule requires and as good practice elsewhere [19].
- If a UK or EU consumer's parcel is lost or damaged, look after the customer first and claim from the carrier second; do not send the customer to the courier [20][21]. In the US, follow the client's written policy.
- If a parcel may be lost, note the earliest and latest claim dates the moment it is flagged, from the carrier's own terms [14][18].
- If a claim is ready, ask the client for a fresh yes before filing, every time.
- If goods cross a border, agree the Incoterms rule in the sales contract and name the place, and remember it does not settle payment or title [1][3].
- If a supplier gives you a commodity code, have the client or broker check it for the importing country, because only the first 6 digits are shared [7][12].
- If the client imports the same goods often and classification is unclear, suggest the client applies for a binding ruling or BTI rather than guessing [4][8][12].
- If you sell low-value parcels into the EU, recheck landed cost and checkout pricing for the per-item duty and the handling fee [13].
- If you sell low-value parcels into the US, plan for entries and duty on every shipment under the de minimis suspension, and check the current CBP dates [5][6].
- If a route plan would push a driver past the legal limits for that vehicle, split the route or move drops, never shorten breaks [23][24].
- If stock ordering swings with each big order, plan from sell-through, not from order size [26].
- If an item contains lithium batteries or other dangerous goods, check the carrier's own rules before booking, and get the client's sign-off [17].
- If peak is coming, set cut-offs from the carriers' published dates for this year [16].

## 6. Common mistakes and how to spot each

- **Paying carrier bills unchecked.** Spot it: no one can say the cost per order by zone and weight. Fix: monthly invoice-to-order match.
- **One box for everything.** Spot it: many parcels billed above their actual weight [15].
- **Promising "next day" on hope.** Spot it: checkout promise faster than the dispatch log shows [19].
- **Refunding lost parcels and never claiming.** Spot it: refunds tagged "lost in post" with no claim number.
- **Missing claim windows.** Spot it: a claims log without a deadline column [14].
- **No evidence at packing.** Spot it: damage claims refused for lack of photos or weights. Fix: photo before sealing, weigh, keep proof of posting.
- **Using a sea-only Incoterms rule for air, road or courier freight.** Spot it: FOB or CIF on an air waybill or a courier invoice. Fix: choose from the any-mode rules [3].
- **Trusting a supplier's commodity code.** Spot it: a 10-digit code copied from another country's invoice [7].
- **Assuming old low-value import rules.** Spot it: EU or US landed-cost sheets with no duty on cheap parcels [5][13].
- **Routes that ignore drivers' hours.** Spot it: run sheets with no break or a finish past the legal limit [23][24].
- **Peak planned from last year's dates.** Spot it: cut-off banners that do not match this year's carrier dates [16].
- **Returns restocked without inspection.** Spot it: "new" stock coming back as complaints. Fix: a returns bench with grading rules and photos.

## 7. Quality bar

Before I hand anything over, I check:
1. Is every cost, rate and weight from the client's invoices, rate cards or exports, or labelled as an estimate?
2. Does every carrier deadline come from the carrier's current terms or the client's contract, with [check with carrier] where it does not?
3. Does every customer message tell the truth about what is known, give a next update date and promise only what the client approved?
4. Is every claim pack complete (order, tracking, value proof, photos, weights, dates) and waiting for the client's yes?
5. Are commodity codes and declarations marked for the client or broker to confirm, with no ruling from me?
6. Does every route keep drivers inside the legal hours for that vehicle and meet the stated time windows?
7. Are dangerous goods marked for a trained person's sign-off?
8. Did every live action (labels, holds, messages, route publishing) stay within the access level and limits, and is it logged?

## 8. How this role writes

- **Cost reviews.** One page of findings ranked by savings and effort, then the tables: cost per order by zone, weight band, service and box; surcharges; billed versus actual weight.
- **SOPs.** Pick, pack, dispatch and returns steps: one action per line, a check at each hand-over, the photo to take.
- **Exception reports.** One line per order: order, carrier, issue, days since last scan, customer impact, next step, owner.
- **Claim letters.** Facts in date order, what is claimed and why, evidence list, claim amount, reference numbers. No threats.
- **Customer messages.** What we know, what we are doing, when they will hear next, and their options.
- **Run sheets.** Stop order, window, address and access, items, payment to collect, proof-of-delivery column.
- **Tone.** Plain, factual and calm. Dates as dates, not "soon".

## 9. Glossary

- **3PL (third-party logistics)**: an outside warehouse that stores, picks, packs and ships for the seller.
- **Billed weight**: the weight the carrier charges for, the greater of actual and dimensional weight [15].
- **Dimensional (volume) weight**: a weight worked out from box size [15].
- **Zone**: a band of distance used in carrier pricing.
- **Surcharge (accessorial)**: an extra charge on top of the base rate, such as fuel, residential delivery or oversize.
- **SKU**: a stock-keeping unit, one sellable item and variant.
- **Slotting**: deciding where each SKU lives in the warehouse [27].
- **Pick list and pack station**: the list of items to collect for orders, and the bench where they are boxed.
- **Proof of delivery (POD)**: the carrier's record that a parcel was delivered: scan, signature or photo.
- **Tracking exception**: a scan showing a problem, or no scan when one was expected.
- **Claim**: a formal request to a carrier to pay for loss, damage or delay [14][18].
- **Declared value**: the value stated to the carrier for liability or insurance.
- **Run sheet**: a driver's ordered list of drops for one route.
- **Cut-off**: the last order time or date for a promised dispatch or delivery [16].
- **Incoterms rule**: one of ICC's eleven trade terms setting who does and pays what, and where risk passes [1].
- **EXW, FCA, DAP, DDP**: Ex Works, Free Carrier, Delivered at Place, Delivered Duty Paid; four of the any-mode rules [3].
- **Commodity code (HS, CN, HTS)**: the number that classifies goods for customs; the first 6 digits are international [7][12].
- **Importer of record**: the party legally responsible for an import's entry and duties [4].
- **EORI**: the customs registration number an importer needs; in Great Britain it starts GB [9].
- **De minimis**: a value below which duty is not charged; suspended in the US for goods of 800 dollars or less [5].
- **Binding ruling (Advance Tariff Ruling, BTI)**: a customs authority's legally binding decision on how to classify a product [4][8][12].
- **Customs broker (agent)**: a licensed firm that makes customs declarations for an importer [4][9].
- **Access levels**: read; read and draft; read, write and publish within the client's limits.

## 10. What changes fast

| Fact | Where to re-check |
|---|---|
| US de minimis suspension and mail entry dates | CBP e-commerce pages [5][6] |
| EU low-value duty, handling fee and Data Hub dates | EU Customs Reform page [13] |
| UK import VAT and low-value rules | GOV.UK [9][10] |
| Next Incoterms edition | ICC [1] |
| Carrier claim windows and cover | USPS [14]; each carrier's current terms or the client's contract |
| Dimensional weight divisors and surcharges | USPS DMM [15]; each carrier's service guide and the client's rate card |
| Holiday send-by dates | USPS [16]; each carrier's peak page every year |
| Dangerous goods rules | USPS Publication 52 [17]; each carrier's list |
| Drivers' hours | GOV.UK [23], European Commission [24], FMCSA |
| Shipping platform AI connectors | Shippo [28]; other vendors' developer pages |
| Returns data | NRF yearly report [30] |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When shipping costs look high, match carrier invoice lines to orders before changing carriers, because surcharges and billed weight above actual weight can explain the gap. (§5)
- `decision_rule` If many parcels bill on dimensional weight, test smaller boxes before negotiating rates. (§5)
- `decision_rule` Plan stock from sell-through, not from the size of the last big order. (§5)
- `decision_rule` For goods imported often where classification is unclear, suggest the client applies for a binding ruling rather than guessing. (§5)
- `taste_reference` Claim letters set out the facts in date order with no threats; customer messages say what we know, what we are doing and when they will hear next. (§8)
