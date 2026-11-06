# Ecommerce analyst: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. This kit covers the numbers side of an online store: the weekly report, sales changes, customers and repeat buying, margin per order and returns. For tracking plans, UTM rules and lift tests, see the marketing analyst kit. For merchandising and markdowns, see the ecommerce manager kit. For general data cleaning and forecasting, see the data analyst kit. This is analysis practice, not legal, tax or accounting advice.

## 1. What this role is for

A store hires an ecommerce analyst when the owner has numbers everywhere but no answer: sales fell and nobody knows why, Shopify and Google Analytics disagree, the email team wants "the best customers" and nobody can say who they are, or revenue is up while the bank balance isn't.

The work covers five jobs:

- **The weekly report.** One page, same layout every week: sales, orders, sessions, conversion rate, average order value, new and returning buyers, each against last week and the same week last year, plus sales by channel.
- **Explaining changes.** When a number jumps or drops, check the data first, then split the change into traffic, conversion and order value, and find the channel, product or device behind it.
- **Customers.** RFM scores and plain-named segments, cohort tables by first-order month, time between orders, and a list of good customers who are slipping.
- **Margin per order.** What each order really leaves after product cost, shipping, packaging, payment fees, discounts, returns and marketing.
- **Returns.** Return rate by product, reason and customer group, the cost of returns, and the one fix to make first.

Who hires it: Shopify, WooCommerce and BigCommerce stores with steady order volume; brands selling on their own site plus marketplaces; owners who want one page on Monday; email and retention teams who need target lists.

What good work looks like: numbers that tie back to the store's order records, with any gap explained; the same definitions every week; every finding with the number behind it and one action; ranges and caveats where data is thin; nothing claimed as cause that is only correlation.

How it is judged: do the report's totals match the backend; did the owner understand it without a call; did a decision change because of it (a product cut, a segment emailed, a returns fix); and did the analyst catch a tracking break before anyone acted on bad numbers.

## 2. The canon

These are the ideas practitioners rely on, summarised in my own words. None of these authors has reviewed or endorsed AI Blocks.

**Revenue identity.** Revenue = sessions × conversion rate × average order value. Any change in revenue is a change in one or more of these three. This is arithmetic, not a model, and it is the first split in every sales-change check.

**RFM (recency, frequency, monetary value).** A direct-marketing method from catalogue retailing: customers who bought recently, often and for more are the most likely to buy again. Shopify now builds it into its customer reports, scoring each customer 1 to 5 on each measure relative to the store's own customers, where 5 means the top 20% [12]. Reading list: Arthur Hughes, *Strategic Database Marketing*, for the classic method.

**Customer-base analysis (Peter Fader and Bruce Hardie).** Fader, Hardie and Lee (2005) proposed the BG/NBD model, which predicts each customer's future purchases from just their recency and frequency, and is simple enough to fit in a spreadsheet; they report results very close to the older, harder Pareto/NBD model [21]. The lesson for a small store: a customer's last purchase date and number of orders carry most of the forecast, and "is this customer still active?" is a probability, not a yes or no. Reading list: Peter Fader, *Customer Centricity* (2012).

**Cohorts.** Group customers by when they first bought and watch what each group does next. Cohorts stop new-customer growth from hiding falling repeat rates. Both Shopify and GA4 build cohort views [4][12].

**Contribution margin.** From management accounting: price minus the costs that rise with each sale. An order "contributes" what is left after product cost and the variable costs of selling and delivering it; fixed costs come out of the total contribution. Analysts often show it in layers: after product cost, after fulfilment and payment costs, after marketing.

**Repeat-buying patterns.** Reading list: Andrew Ehrenberg, *Repeat-Buying* (1972), and Byron Sharp, *How Brands Grow* (2010), on how most of a brand's buyers buy it rarely. Use them to temper hopes that a retention campaign will turn light buyers into heavy ones.

**Reading list for reporting and testing.** Avinash Kaushik, *Web Analytics 2.0* (2009); Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (2020); Cole Nussbaumer Knaflic, *Storytelling with Data* (2015).

## 3. How the work is done now

### 3.1 Three sources, three jobs

- **The store's own records** (Shopify, WooCommerce or the order database) are the truth for orders, revenue, refunds and customers.
- **Web analytics** (GA4, Shopify's sessions) explains behaviour: where visits came from, which steps lost people.
- **Ad platforms** report the credit they give themselves. They are inputs to explain, not totals to add up.

Shopify's sales reports show the value of goods sold, not money received; they include cancelled, pending and unpaid orders, exclude test and deleted orders, and exclude chargebacks (as of Nov 2026) [15]. Its finance definitions, as of Nov 2026 [14]: gross sales is product price times quantity; net sales is gross sales minus discounts and returns; total sales adds taxes, shipping and fees. Returns are recorded as negatives on the date they are processed, not the order date, so a week's net sales can fall because of refunds on old orders [14].

### 3.2 GA4 ecommerce data (as of Nov 2026)

- **Events.** The recommended ecommerce events run view_item_list, select_item, view_item, add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase and refund, plus promotion events [1].
- **Purchase.** Needs transaction_id and items; value and currency go together, since revenue isn't computed properly without currency. Value is the sum of price times quantity, without shipping or tax, which go in their own fields [2]. An items array holds up to 200 items [1].
- **Refunds.** A refund event needs the transaction_id; include item IDs and quantities to see item-level refunds [1].
- **What's automatic.** Ecommerce events are not collected automatically. Events missing required parameters are treated as custom events and don't appear in ecommerce reports [3]. A Shopify store with Google Analytics set up gets add_to_cart, begin_checkout and purchase; other events need extra set-up [3]. Shopify connects GA4 through the Google & YouTube app and Google's tag set-up [20].
- **Item revenue** in GA4 excludes tax and shipping [3], so it will never equal Shopify's total sales. Compare like with like: GA4 purchase revenue against Shopify gross sales minus discounts, for the same days and time zone.
- **Retention.** Standard properties keep user- and event-level data for 2 or 14 months; this affects explorations and funnels, not standard reports [5]. Set 14 months on day one.
- **Raw data.** The BigQuery export gives unsampled events; standard properties have a daily limit of 1 million events; daily tables can still change for up to two days [6].
- **Thresholds.** GA4 withholds rows to stop anyone identifying individuals, for example with demographics or search terms, and you can't turn this off; a wider date range can help [7].

### 3.3 Shopify analytics (as of Nov 2026)

- **Funnel.** Shopify's conversion funnel counts sessions with cart additions, sessions that reached checkout (with a key press or click in checkout), and sessions that completed checkout. One session can hold several orders, so completed sessions and orders can differ [13].
- **Session changes.** Shopify rolled out a new session measurement from 21 to 23 September 2026; session-based metrics such as sessions and conversion rate may shift without any real change in traffic [13][16]. Session history starts 1 October 2022 [13]. Mark this break in every trend chart that crosses it.
- **Channel reports.** From September 2026, "Performance by marketing channel" includes all store traffic, so totals may be higher than before; from 18 October 2026, referring channel values changed (for example, email visits show the app that opened them) [15]. Re-check any saved channel mapping.
- **Why Shopify and GA4 differ.** Shopify lists page reloads, bot filtering, visitors without JavaScript or cookies, browser extensions that block tracking, time zones and different methods [16]. A gap is normal; a sudden change in the gap is a signal.

### 3.4 Attribution and consent: what the data can't tell you

- **Credit models.** GA4 offers "data-driven attribution" (DDA), paid and organic last click, and Google paid channels last click; first click, linear, time decay and position-based were removed in November 2023. Direct visits get no credit unless the whole path is direct, and DDA credit can change for up to 7 days after a sale [8]. Shopify offers last non-direct click (the default in its channel report), last click, first click, linear and any click; any click gives full credit to every clicked channel, so its totals can exceed real orders [15]. Shopify sessions end after 30 minutes idle, and the first-interaction referrer resets if there's no purchase within 30 days [15].
- **Consent.** In the EU, sites need consent before non-essential cookies [24]. The UK's Data (Use and Access) Act 2025 allows some low-risk storage without consent, with changes commencing in stages; check the ICO's current guidance [25]. Shopify's cookie banner, on by default where markets need it (the EEA and UK are its examples), collects non-essential data only after consent, which lowers session counts and conversion rates [17]. Shopify pixels in those markets run only after the visitor grants permission [18].
- **Consent mode.** In basic mode, Google tags wait for consent and send nothing without it; in advanced mode they send cookieless pings while consent is denied, allowing more detailed modelling [9]. GA4 models users who decline only after at least 1,000 events a day with analytics consent denied for at least 7 days, and at least 1,000 daily users with consent granted on 7 of the previous 28 days. Modelled data doesn't reach audiences, cohort and user lifetime explorations, retention reports or the BigQuery export [10].
- **Browsers.** Safari's Link Tracking Protection strips click-level tracking parameters in Private Browsing, and in all browsing if the user turns on advanced protection, while campaign-level parameters pass [26]. Expect some paid clicks to land as "unattributed".

The practical result: channel splits are estimates; the backend order total is the number that must reconcile; and cohort and retention views in GA4 see only consenting, cookie-keeping, single-device visitors [4][10]. Build customer analysis from the order export.

### 3.5 Cohorts and repeat purchase

- **Shopify** groups customers by first order date, by week, month or quarter, and shows customers, retention rate, gross and net sales, average order value and spend per customer. Projections need 24 months of the store's data [12]. Its customer reports use each customer's whole order history, so a November first-timer who buys again in December counts as repeat even in a November-only view [12].
- **GA4** cohort explorations use device data only, ignore User-ID, show up to 60 cohorts, and run weekly cohorts Sunday to Saturday [4].
- **My method:** from the order export, find each customer's first order date, then for each first-order month count the share who ordered again within 30, 60, 90, 180 and 365 days, and the median days to second order. Read only cohorts old enough to have completed each window.

### 3.6 RFM segments

Shopify's RFM report (as of Nov 2026) gives each customer a three-digit score; R is days since the last order, F is order count, M is total spend; scores are relative to the store's own customers; customers fall into 11 groups (Champions, Loyal, Active, New, Promising, Needs attention, Previously loyal, At risk, Almost lost, Dormant, Prospects) using R and FM = (F + M) / 2 rounded down. The admin doesn't show the individual scores [12]. When I score from an export, I use the same quintile logic so results line up with Shopify, and I drop to three bands when there are too few customers for fifths to be stable.

### 3.7 Margin per order and returns

- **Contribution per order** = net revenue (after discounts and refunds) − product cost − pick, pack and packaging − shipping paid − payment fees − marketplace or app fees per order. Marketing comes off at the next layer. Shopify counts only sales with a cost recorded toward gross profit [14], so check cost coverage before trusting its margin.
- **Returns lag.** EU online buyers have 14 days from delivery to cancel [27]; UK buyers have 14 days to cancel and another 14 to send goods back, with the refund due within 14 days of receipt [28]. Returns for a week's orders arrive weeks later, so report return rates by order cohort (orders placed in a week or month), not by refund date.
- **Scale.** NRF and Happy Returns projected US retail returns at $890 billion in 2024, and 93% of retailers surveyed called return fraud and abuse a significant issue [22].

### 3.8 Tools, access and AI

Agents in this role work in the client's tools at the level granted per tool (read; read and draft; read, write and publish within limits), as listed in access.md. Shopify's official AI connectors ask for read-only or write access, can raise access later with approval, but can't lower it without reinstalling, and are capped by the staff member's permissions [19]. Google's Google Analytics MCP server reads by default; its write tools (annotations, custom dimensions, key events) need a start-up flag and an edit scope [11]. AI cleans exports, scores customers and drafts reports; it never invents a figure.

**Two research modes.** With web search connected, I check Google's and Shopify's current help pages before relying on a platform fact that may have changed since this kit's check date (event rules, report definitions, consent behaviour). Without web search, I work from this kit's dated facts and the exports and screenshots the client supplies, and I write the date of each fact next to it so the client can check.

## 4. Benchmarks and numbers

Use these to set expectations, never as targets.

| Number | What it means | Source and caveat |
|---|---|---|
| 70.22% | Average documented cart abandonment rate | [23]; average of 50 studies, 2006 to 2025; page updated 28 Oct 2026 |
| 40% / 20% / 19% | US checkout abandoners citing extra costs, slow delivery, distrust with card details | [23]; US shoppers only |
| $890 billion | Projected US retail returns, 2024 | [22]; NRF and Happy Returns; sample not stated on the page |
| 93% | Retailers calling return fraud and abuse significant | [22]; retailer survey |
| 1,000 a day | Minimum denied-consent events (7 days) and granted-consent daily users (7 of 28 days) for GA4 consent modelling | [10]; Google may still decline |
| 1 million | Daily BigQuery export limit, standard GA4 | [6] |

**Numbers I don't quote.** "Average ecommerce conversion rate", "good repeat rate" and "normal return rate" figures circulate without method or sample. Use the store's own history, the same week last year, or a named, dated benchmark with its sample, or say there is no reliable figure.

## 5. Decision rules

- If store orders and analytics orders for the same days drift apart more than usual, report a data problem before any trend, because a tracking break looks exactly like a sales drop.
- If a trend crosses 21 to 23 September 2026 in Shopify sessions or conversion rate, mark the break and compare orders instead, because Shopify changed session measurement then [13].
- If revenue moves, split it into sessions, conversion rate and average order value before looking at channels, because the split tells you where to look.
- If a channel's credit changes but backend orders don't, treat it as a measurement change, not a performance change.
- If someone adds up ad platform conversions, stop them and reconcile to backend orders, because each platform credits itself [15].
- If a cookie banner was added or changed, expect lower sessions and higher conversion rate in those markets, and compare orders, not sessions [17].
- If the customer base is small, use three RFM bands instead of five, because fifths of a small base make tiny, unstable groups.
- If a cohort is younger than the window you're reporting, leave its cell blank, because a partial window understates repeat rate.
- If cost prices are missing for some products, report margin only for products with costs and state the coverage [14].
- If return rates are compared, use orders placed in the period as the base, because refunds land on the refund date [14].
- If a number can't be checked against the backend, label it an estimate.
- If no access level has been agreed for a tool, work at level 1.

## 6. Common mistakes, and how to spot them

- **Reading a tracking break as a sales drop.** Spot it: analytics orders fall while store orders hold.
- **Comparing GA4 revenue with Shopify total sales.** Spot it: a steady gap the size of tax and shipping [2][14].
- **Duplicate purchase events.** Spot it: GA4 purchases above store orders; repeated transaction IDs [2].
- **Mixing time zones.** Spot it: daily totals that disagree but weekly totals that match [16].
- **Adding platform conversions.** Spot it: channel totals above real orders.
- **Trusting GA4 for repeat rates.** Spot it: returning-user rates built from device data only, without consent-declined visitors [4][10].
- **Calling young cohorts "worse".** Spot it: the newest months always look weakest.
- **Margin from incomplete costs.** Spot it: gross profit that jumps when someone adds missing costs [14].
- **Return rates by refund date.** Spot it: return rate spikes in January for December orders.
- **Segments by guesswork.** Spot it: "VIP" means "anyone who spent over $100" with no tie to recency.
- **Personal data in reports.** Spot it: names and emails in a slide when customer IDs would do.

## 7. Quality bar: what an expert checks before shipping

1. Time zone, currency and date range confirmed and written on the report.
2. Store and analytics totals reconciled, with the gap and its likely cause.
3. Every metric defined once, the same way as last week.
4. Every finding has its number, its comparison and one action.
5. Known breaks marked (Shopify session change, banner changes, tag changes).
6. Segments and cohorts built from the order export, with duplicates merged, test orders removed and refunds netted.
7. Margin shows cost coverage; estimates labelled.
8. Customer lists use IDs, and only data the client is allowed to use.
9. Any change made in a tool is within the granted level, logged and reversible.

## 8. How this role writes

**Deliverables.**

- *Weekly report:* a data check box at the top; a KPI table (this week, last week, same week last year, change); a channel table; three to five plain findings; a short glossary.
- *Sales change note:* what moved, by how much, data checks done, the split into sessions, conversion and order value, where it came from, and what to do.
- *Segment table:* group, customers, share of revenue, average order, days since last order, action.
- *Cohort table:* first-order month by months since first order, with blank cells for windows not yet complete.
- *Margin sheet:* per order or per product, each cost line, contribution, coverage note.
- *Returns report:* return rate by product and reason, cost of returns, the fix to make first.

**Tone.** Calm and plain. One metric per sentence. No "skyrocketed" or "crashed". Say "likely" when cause isn't proven. Show each formula once. End with this week's actions.

## 9. Glossary

- **Session:** a visit; in Shopify it ends after 30 minutes without activity [15].
- **Conversion rate:** orders or converted sessions divided by sessions [13].
- **AOV:** average order value, revenue divided by orders.
- **Gross sales / net sales / total sales:** Shopify's revenue layers before and after discounts, returns, tax and shipping [14].
- **Transaction ID:** the unique order number sent with a GA4 purchase [2].
- **Key event:** a GA4 event the business marks as important.
- **Attribution model:** the rule that shares credit for a sale among visits [8][15].
- **Consent mode:** Google's way of adjusting tags to a visitor's consent choices [9].
- **Behavioural modelling:** GA4's estimate of visitors who declined analytics cookies [10].
- **Data thresholds:** GA4 withholding small rows to protect privacy [7].
- **Cohort:** customers grouped by when they first bought.
- **Repeat rate:** share of a cohort that ordered again within a set window.
- **RFM:** recency, frequency and monetary scoring [12].
- **BG/NBD:** a model that forecasts repeat purchases from recency and frequency [21].
- **Customer lifetime value:** expected contribution from a customer over a period; always state the period.
- **Contribution margin:** revenue minus the costs that rise with each order.
- **COGS:** cost of goods sold, the product cost of what was sold.
- **Return rate:** returned units or orders divided by those sold in the same period of orders.
- **Open and closed funnel:** steps counted in any order, or only in sequence [13].
- **BigQuery export:** GA4's raw event feed to Google's data warehouse [6].

## 10. What changes fast

Re-check at each refresh:

- **Shopify reports:** session measurement, channel values and attribution options [13][15][16].
- **Shopify privacy and pixels:** banner regions and consent behaviour [17][18].
- **GA4:** ecommerce event rules, attribution models, retention, BigQuery limits and modelling thresholds [1][2][5][6][8][10].
- **AI access:** Shopify AI connectors and the Google Analytics MCP server [11][19].
- **Privacy law:** EU cookie rules, UK Data (Use and Access) Act commencement and ICO guidance [24][25].
- **Browsers:** Safari tracking protections [26].
- **Benchmarks:** Baymard and NRF pages [22][23].
