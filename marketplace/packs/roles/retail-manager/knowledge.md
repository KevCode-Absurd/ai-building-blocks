# Retail store manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Till system features change often; each one says when it was true. This kit covers independent shops, pop-up shops and market stalls. It is not legal, tax or employment advice. Where a law decides the answer, I point to the official source and say who to ask: Trading Standards or a consumer law adviser for customer rights, and the official labour source (or an employment adviser) for rotas.

Related kits: shop fit-out, windows and display plans are in the `interior-designer` kit; online stores are in the `ecommerce-manager` kit; sign and poster files are in the `graphic-designer` kit; written procedures are in the `operations-manager` kit.

## 1. What this role is for

**Who hires a retail store manager.** Owners of independent shops (gift, book, fashion, homeware, hardware, garden and food shops), makers and small brands selling at markets, fairs and pop-ups, and owners who run the till themselves and have no time to read the numbers. The signs: busy Saturdays and dead Tuesdays, stock that never sells, best sellers that run out, staff standing at the till while people browse, a market stall that "felt busy" but made no money, and a back room full of stock nobody has counted for a year.

In the agents built on this kit, the work splits into two families:
- **The shop:** a 12-month promotions calendar, window and in-store sign copy, in-store events, a sales readout from the till report, and a staff selling guide.
- **The stall or pop-up:** a plan for one event (budget, stock, staffing, set-up), a stall layout, stock and cash float, the market application, and a sales review after the day.

**What good work looks like.**
- Every promotion has one goal: more visits, a bigger basket, or clearing stock.
- Decisions start from the till report and the stock count, not from a hunch.
- The stock record matches what is on the shelf, and the gap (shrink) is known and shrinking.
- Signs can be read in a few seconds from where people stand, and every price claim is true.
- Staff cover follows the busy hours, breaks follow local rules, and the rota is published early.
- A stall plan shows the break-even before the owner pays the pitch fee.

**How the work is judged.**
- Footfall (people in), conversion (share of visitors who buy), average transaction value and units per transaction.
- Gross margin, sell-through and how long stock sits.
- Shrink as a share of sales.
- Staff hours against sales by hour.
- For events: profit after fees, travel, staff and stock cost.

**What this role does not do here.** Rule on consumer law, employment law or tax; sign supplier contracts; pay invoices or move money; book pitches or pay fees; decide what is safe for food, electrics or fit-out. Make live changes beyond the access level and limits the client set (see `access.md`).

## 2. The canon

**Paco Underhill, *Why We Buy: The Science of Shopping* (1999).** Underhill's firm watched shoppers on video and on foot. His lasting ideas: people need a few steps inside the door to slow down before they notice anything (so the first metre is a poor place for key stock), shoppers with full hands stop buying (so offer baskets early), and the store should be judged from the shopper's eye level and pace, not the owner's.

**Byron Sharp, *How Brands Grow* (2010).** Sharp argues that sales come from being easy to notice and easy to buy, which he calls mental and physical availability. For a shop: be open when people pass, keep best sellers in stock and visible, and make the window say what you sell.

**Pareto and ABC analysis.** A small share of lines usually brings most of the sales. Ranking lines as A, B and C by sales or margin tells you where to spend counting time, shelf space and reorder attention.

**Retail maths.** Margin is profit as a share of the selling price; markup is profit as a share of cost. Sell-through is the share of stock received that sold. Stock turn is how many times stock sells through in a year. Open-to-buy is the money left to spend on new stock after planned sales, planned markdowns and stock already on order. These are standard merchandise-planning terms; the client's own figures fill them in.

**Robert Cialdini, *Influence* (1984).** Scarcity and social proof change behaviour. In a shop that means "last few" and "best seller" signs work, which is exactly why they must be true. UK law bans false limited-time claims outright [7], and the US bans fake reviews [11].

**Richard Thaler and Cass Sunstein, *Nudge* (2008).** Choice architecture: what people see first and what is easiest to pick shapes what they choose. The till point, the end of an aisle and the table by the door are choice architecture.

**Visual merchandising.** Tony Morgan, *Visual Merchandising* (Laurence King), and Martin Pegler, *Visual Merchandising and Display* (Fairchild), teach the working rules: one focal point, a triangle or step layout so the eye travels, groups in odd numbers, colour blocking, and repetition for impact. The full display method is in the `interior-designer` kit.

**Loss prevention.** Retailers usually split shrink into theft by customers, theft by staff, paperwork and process errors, and supplier errors. Reason codes on every stock adjustment are what let you tell them apart later [15].

## 3. How the work is done now

### Till systems, counts and exports (as of 6 Nov 2026)
- **Square.** Full counts check all stock at a location; cycle counts check a subset. Square recommends counting each item variation at least every 90 days, and warns that uncounted variations are set to zero when a full count is approved, and approval is final [14]. Counts are done in the POS app by scanning, typing or prefilling by category, from several devices at once; this needs Square Plus or Premium [14]. Every stock adjustment carries a reason (damaged, lost, theft, internal use, waste, samples, vendor return, re-count, received and more, plus custom reasons) and the history exports to CSV [15]. The sell-through report shows sell-through, sales velocity and stock, and exports to CSV [16].
- **Shopify POS.** Stock counts live under Inventory > Stock counts. Staff count by scanner or by hand, and in the POS app at locations with POS Pro; a manager approves before stock levels change, and each change is logged [19]. Stocky, Shopify's older inventory app, is no longer available after 31 August 2026; Shopify points merchants to its POS and admin inventory features [20].
- **Lightspeed Retail (R-Series).** Full and partial counts by scanner, printed list or CSV import. Uncounted items sit on a Missed list and must be counted or zeroed before you reconcile; reconciling cannot be undone, and the Shrinkage page shows what was lost [21]. You can keep selling during a count, with care for items already counted.
- **Card readers at markets.** Square's offline mode stores card payments and uploads them when the device reconnects. Square recommends uploading within 24 hours; pending payments expire after 72 hours and cannot be recovered, and the seller carries any declined or expired payment [17]. In Square's US help article, offline mode was switched on for all devices in April 2026 unless the seller opted out [17].

### Connecting AI to the till (as of 6 Nov 2026)
- **Square** publishes an official MCP server, in beta. The remote server uses OAuth sign-in and reaches live (production) data; a locally run server can be set to read-only or pointed at a test sandbox [18].
- **Shopify** asks you to choose read-only or write access when you install an AI tool's official Shopify connector (details in `access.md`).
- **Lightspeed** and most other till systems: I have not found an official AI connector; exports work well.
- Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the client's limits. At level 3 that means things like approving a cycle count, logging adjustments with reasons, or changing prices on the lines and within the floors the client set. Until the client says otherwise, I work at level 1.

### Customer rights at the counter
**UK (England and Wales; check Scotland and Northern Ireland separately).**
- Under the Consumer Rights Act 2015, goods must be of satisfactory quality, fit for purpose and as described. A customer can reject faulty goods for a full refund within 30 days (less for goods with a shorter life, such as fresh food). After that the shop gets one chance to repair or replace; if that fails, the customer can claim a price reduction or a refund [1].
- A fault that shows within six months is presumed to have been there at sale unless the shop proves otherwise [1][2]. Customers have up to six years to claim (five in Scotland) [2].
- There is no legal refund for a change of mind in a shop, unless the customer bought without seeing the item. Sale items carry the same rights as full-price items [2].
- A "no refunds" sign is illegal [2]. Business Companion lists "No refunds given", "Goods can only be exchanged" and "Sold as seen" as likely to mislead and, under the Digital Markets, Competition and Consumers Act 2024, a criminal offence; adding "statutory rights unaffected" does not fix them [3]. A goodwill policy (change of mind within a set time, with a receipt) can sit on top of legal rights and can have conditions [3].
- Phone, online and click-and-collect orders paid remotely: the customer can cancel within 14 days of receiving the goods, and the refund is due within 14 days of getting them back [2].

**EU.**
- A legal guarantee of at least two years from delivery. A defect within one year is presumed to have been there at delivery (two years in some countries) [4].
- The 14-day right to cancel without a reason covers distance and off-premises sales such as online, phone and doorstep sales, with exceptions such as perishable, made-to-order and personalised goods [5]. Ordinary shop sales rely on the legal guarantee and any goodwill policy.

**US.**
- No federal law requires a written warranty. If you give one on a product over $10 it must be titled "full" or "limited", and over $15 it must be available before sale; a shop can show it near the product or offer it on request with a sign saying so [6].
- Implied warranties come from state law, and a seller who gives a written warranty cannot disclaim them; some states do not allow "as is" sales [6]. Refund and return-policy rules vary by state: check the state consumer protection office or attorney general, or ask a qualified adviser.

### Prices, offers, reviews and claims
- **UK.** The rules on unfair commercial practices in the DMCC Act 2024 have applied since 6 April 2025, and 32 practices are banned outright, including false "only today" claims, presenting legal rights as a special perk, and fake or hidden incentivised reviews [7]. A shelf price is an invitation to purchase and must show the total price, including any mandatory fee; hiding fees until later is illegal. The CMA can fine up to 10% of turnover or £300,000, whichever is greater [7][8].
- **EU.** When you announce a price reduction, the "was" price must be the lowest price you charged in at least the 30 days before the cut [9].
- **Case: Aldi Süd (Court of Justice of the EU, 26 Sep 2024).** A German consumers' association challenged brochure "price highlights" worked out from the price just before the offer. The court held that a reduction announced as a percentage or as a promotional claim must be based on the lowest price in the previous 30 days or more [9]. Lesson for shops selling in the EU: work out every "% off" from the 30-day low, not last week's price.
- **EU green claims.** Directive (EU) 2024/825, on empowering consumers for the green transition, applies from 27 September 2026 [10]. Treat every "eco", "green" or "sustainable" sign as a claim to check with the supplier's evidence and a qualified adviser.
- **US reviews.** The FTC rule on reviews took effect on 21 October 2024. It bans fake reviews, rewards that depend on a positive review, undisclosed staff or family reviews, and suppressing reviews by threats; knowing violations can bring civil penalties [11].
- **Case: Williams-Sonoma (FTC, 26 Apr 2024).** Products sold as "Made in USA" were made in China and other countries. The company agreed to a $3.175 million civil penalty, the largest in a Made in USA case [12]. Lesson: origin claims on shelf talkers come from the supplier's paperwork, never from the look of the product.
- **Case: Fender (CMA, published 29 Jun 2020).** Fender stopped online resellers from pricing its guitars below set minimums from 2013 to 2018, and was fined £4.5 million. The CMA's lesson for retailers: you set your own prices; refuse, report and take advice if a supplier insists, because resellers who go along can also face action [13].
- **US former-price claims** ("was $40, now $25") are covered by FTC guidance and state laws that I could not open for this release; ask a qualified adviser before using comparison prices in the US.

### Staff rotas: check local rules
- **UK.** A worker on more than 6 hours a day gets an uninterrupted 20-minute break, which need not be paid; 11 hours' rest between working days; and 24 hours off each week or 48 hours each fortnight. Young workers have stricter rules [26]. Check the current minimum wage rates on GOV.UK before costing a rota.
- **EU.** The Working Time Directive sets minimums: an average of 48 hours a week, a break if the working day is over 6 hours, 11 hours' daily rest, 24 hours' weekly rest and at least 4 weeks' paid leave; national laws add detail [27].
- **US.** Federal law does not require breaks. If short breaks of 5 to 20 minutes are given they are paid; meal periods of usually 30 minutes or more are not [28]. Many states and some cities add rules. Oregon, for example, requires large retail, hospitality and food employers to post schedules 14 days ahead [29]. Check the state labour office.
- **Other countries.** Check the Fair Work Ombudsman (Australia), the provincial or territorial employment standards office (Canada), and the state labour department and its shops and establishments rules (India).

### Markets and pop-ups
- In England and Wales you may need a street trading licence from the local council; trading without one can bring a fine of up to £1,000 [30]. At an organised market, ask the organiser which permits and insurance the pitch covers.
- Plan a card reader backup and know the offline rules before the day [17].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 1.6% | Average US retail shrink, FY2022 (1.4% in FY2021) | [22]; survey average across retailers; not a target for a small shop |
| $112.1 billion | US shrink in FY2022 | [22] |
| 519,516 | Police-recorded shoplifting offences, England and Wales, year to June 2026 (down 2%) | [23]; recorded crime only, not all theft |
| 28.8% | Share of Great Britain retail sales made online, September 2026 | [24]; most sales still happen in shops |
| 17.1% | Share of US retail sales made online, Q2 2026 | [25]; seasonally adjusted |
| 80% / 40% | Sell-through Square calls generally excellent / concerning | [16]; vendor rule of thumb; varies by product type |
| 90 days | Square's suggested longest gap between cycle counts of each variation | [14] |
| 30 days | UK short-term right to reject faulty goods | [1]; less for perishables |
| 6 months / 6 years | UK presumption that a fault was present / time to claim | [1][2]; 5 years in Scotland |
| 2 years | EU minimum legal guarantee | [4] |
| 14 days | UK and EU cancellation period for distance sales | [2][5] |
| 24 h / 72 h | Square offline: recommended upload time / expiry | [17] |
| 20 minutes | UK minimum break on a shift over 6 hours | [26] |

**Numbers I do not quote.** Average shop conversion rates, "most buying decisions are made in store", "eye level is buy level adds X%", and footfall benchmarks without a named method, sample and date. For the client's own shop, I use their till data and label any estimate as an estimate.

## 5. Decision rules

- If you don't know the shop's busy hours, read the till report by hour and day before planning promotions or rotas.
- If a promotion has no single goal (visits, basket size or clearance), set one before writing signs, because the sign, the offer and the measure all follow from it.
- If a line sells through slowly and ties up cash, move it to a better spot or bundle it first, then mark it down in steps, before buying more of anything.
- If a best seller keeps running out, count it more often and reorder from sales rate and supplier lead time, not from the last order size.
- If counted stock is lower than the record, check paperwork (deliveries, transfers, returns not booked) before assuming theft, and log every adjustment with a reason [15].
- If a full count is planned, count everything at that location, because uncounted items may be set to zero when the count is approved [14][21].
- If you announce a reduction in the EU, work it out from the lowest price in the previous 30 days or more [9].
- If a UK sign or post shows a price, show the total including any mandatory fee [8].
- If a sign says "limited time" or "last few", make sure it is true and stays true while the sign is up [7].
- If a customer asks for a refund, apply the legal rights first and the goodwill policy second; never let the policy wording cut legal rights [2][3].
- If a supplier tells you the lowest price you may charge, refuse, keep the message and take advice [13].
- If a rota is drafted, check breaks and rest against local rules before publishing it [26][27][28].
- If an event's break-even needs more sales than past events delivered, renegotiate, cut costs or skip it before paying the fee.
- If you take cards offline at a market, cap the amount per payment and upload as soon as signal returns [17].
- If the client grants access, ask which level for each tool, work at level 1 until they answer, and confirm the action list once before the first live change at level 3.

## 6. Common mistakes and how to spot each

- **Promotions without a goal.** Spot it: "autumn sale" with no measure. Fix: one goal and one number to watch per promotion.
- **Reading revenue, not margin.** Spot it: the "best seller" is a loss leader nobody planned. Fix: add cost price to the readout.
- **Discounts on what would sell anyway.** Spot it: markdowns on A lines in their busy season. Fix: discount slow lines; add value to fast ones.
- **Fake "was" prices.** Spot it: a "was" price the item never sold at, or a reduction from last week's raised price [9].
- **Illegal returns signs.** Spot it: "No refunds", "Exchange only" or "Sold as seen" at the till [3].
- **Counting part of the shop as a full count.** Spot it: stock of whole categories at zero after approval [14].
- **Blaming theft for paperwork errors.** Spot it: shrink spikes the week a delivery arrived. Fix: check receiving records first.
- **No reason codes.** Spot it: every adjustment says "re-count". Fix: require a reason for each [15].
- **Rota built on habit.** Spot it: three staff on a dead Tuesday morning, one on a packed Saturday afternoon.
- **Signs too small or too wordy.** Spot it: you can't read the offer from where shoppers stand.
- **Stall stock from hope.** Spot it: half the stock goes home unopened, or best sellers sell out by noon.
- **No float or card backup.** Spot it: turning away cash buyers for lack of change, or losing sales when the signal drops.

## 7. Quality bar

Before I hand anything over, I check:
1. Does every number come from the client's till, count or plan, with the date range shown, or is it labelled an estimate?
2. Does every promotion have one goal, one offer, one measure and an end date?
3. Is every price claim true: a real "was" price (30-day low in the EU), total price shown, no false urgency?
4. Do returns and guarantee words state legal rights first and the goodwill offer second?
5. Can each sign be read in a few seconds from where people stand, with the price and offer first?
6. Does the rota cover the busy hours, with breaks and rest checked against the local rules named?
7. Does the stall plan show break-even, the stock list, the float by note and coin, and a card backup?
8. Did every live change stay within the access level and limits, and is it logged?
9. Are legal, tax, food safety and employment points marked "check this with local rules" or for a qualified adviser?

## 8. How this role writes

- **Till readout.** One page: the period, top and bottom lines by sales and margin, busy and quiet hours, basket size, three actions (promote, move, reorder) and what to watch next week.
- **Promotions calendar.** A table by month: local and seasonal moments, the goal, the offer, the window theme, what to order or prepare and by when.
- **Sign copy.** Short lines: the offer or product first, the price, one reason to care, the action. Headline readable from a few metres.
- **Rota.** A grid by day and hour with names, start, finish and break, cover against expected sales, and a line on which local rules were checked.
- **Stall plan.** Budget and break-even, stock list with quantities, layout sketch in words, staffing and breaks, float, payments and backup, packing checklist.
- **Tone.** Plain, practical and short, written for a busy owner and the person on the shop floor.

## 9. Glossary

- **Footfall**: the number of people who come into the shop.
- **Conversion rate**: the share of visitors who buy.
- **Average transaction value (ATV)**: sales divided by the number of transactions; also called basket size.
- **Units per transaction (UPT)**: items sold divided by transactions.
- **Gross margin**: sales minus the cost of the goods sold, as a share of sales.
- **Markup**: profit as a share of the cost price.
- **Sell-through**: the share of stock received that has sold in a period [16].
- **Stock turn**: how many times the stock sells and is replaced in a year.
- **Open-to-buy**: money left to spend on stock after planned sales, markdowns and orders.
- **Shrink**: the gap between recorded stock and counted stock, from theft, damage or errors.
- **Full count**: counting all stock at a location [14].
- **Cycle count**: counting a part of the stock on a rolling schedule [14].
- **Reason code**: the reason logged with a stock adjustment, such as theft or damage [15].
- **ABC analysis**: ranking lines by sales or margin to decide where attention goes.
- **Markdown**: a planned price cut to clear stock.
- **Shelf talker**: a small sign on a shelf edge about one product.
- **A-board**: a folding pavement sign outside a shop.
- **Float**: the notes and coins in the till or cash box at the start.
- **Break-even**: the sales needed to cover all costs of an event or promotion.
- **Right to reject**: the UK customer's right to return faulty goods for a refund within 30 days [1].
- **Legal guarantee**: the EU minimum two-year seller liability for faults [4].
- **Drip pricing**: showing a price and adding mandatory fees later; illegal in the UK [8].
- **Access levels**: read; read and draft; read, write and publish within the client's limits.

## 10. What changes fast

| Fact | Where to re-check |
|---|---|
| Till system counting, offline and report features and plans | Square [14][15][16][17], Shopify [19][20], Lightspeed [21] help centres |
| AI connectors and MCP servers for till systems | Square developer docs [18], Shopify Help Center |
| UK consumer rights and returns wording | Business Companion [1][3], GOV.UK [2] |
| UK unfair practices, pricing and reviews guidance | CMA guidance on GOV.UK [7][8] |
| EU price reduction and green claim rules | Commission pages [10], CJEU [9], national consumer authorities |
| EU guarantees and cancellation rights | Your Europe [4][5] |
| US warranties, reviews and origin claims | FTC [6][11][12] |
| Shrink and shop theft figures | NRF [22], ONS [23] |
| Online share of retail | ONS [24], US Census [25] |
| Break, rest and scheduling rules | GOV.UK [26], European Commission [27], US DOL [28], state labour offices [29] |
| Street trading rules | GOV.UK and the local council [30] |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Read the till report by hour and day before planning promotions or rotas. (§5)
- `decision_rule` Give a promotion one goal (visits, basket size or clearance) before writing signs, because the sign, the offer and the measure all follow from it. (§5)
- `decision_rule` When a line sells slowly and ties up cash, move it or bundle it first, then mark it down in steps, before buying more of anything. (§5)
- `decision_rule` When a best seller keeps running out, count it more often and reorder from sales rate and supplier lead time, not from the last order size. (§5)
- `decision_rule` When counted stock is lower than the record, check the paperwork (deliveries, transfers, returns not booked) before assuming theft. (§5)
- `decision_rule` If an event's break-even needs more sales than past events delivered, renegotiate, cut costs or skip it before paying the fee. (§5)
