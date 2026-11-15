---
name: store-meta-ads
description: "Front door for an online store's Meta (Facebook and Instagram) ads work. Turns the owner's words into the right job, collects one store context sheet (platform, gross profit per purchase, spend, markets, stock and cash limits, sale calendar), checks the money, cash and tracking gates, and runs the store-meta skills in order: tracking trust, money, structure, creative. Use when an owner says 'ROAS dropped', 'ads are not spending', 'scale for Black Friday or our peak season' or 'we are launching a product', or when the job is unclear."
---

# Meta ads for an online store: start here

**You get:** a one-screen route for the store's Meta ads work, a filled store context sheet, a money table with break-even lines, and a route plan of skills to run in order.

This skill builds nothing itself. It turns what the owner says into the right job, collects the shared facts once, and orders the jobs so no one decides on bad numbers.

## When to use

- The owner names a symptom, not a job: "ROAS dropped", "sales are down", "ads are not spending".
- The owner wants several things at once.
- A new store or ad account comes in and no context sheet exists yet.
- A big sale (Black Friday and Cyber Monday, the holidays, a local festival, end of season) is within the next three months.

## Not for

- The job is already clear: go straight to it, such as `store-meta-audit` for a full check.
- A quick break-even or budget sum: use `store-meta-math`.
- Explaining why Meta and Shopify disagree on sales: use `store-meta-attribution`.
- Ad images from an approved brief: use `store-meta-ad-images`.

## What you need

**The context sheet.** Ask once, in one message, at most three questions. Compute or read the rest.

| Field | Required | Source | If missing |
|---|---|---|---|
| Store platform (Shopify, WooCommerce, other) | Yes | Owner | Ask |
| Order value after discounts, before tax | Yes | Order export | Compute |
| Landed product cost per order (unit, freight, duty) | Yes | Shopify "Cost per item" | Ask; money gate fails without it |
| Outbound shipping and pick-pack per order | Yes | Courier or 3PL invoices | Ask |
| Payment fees | Yes | Payment provider | Use published rate |
| Refund rate and cost of one return | Yes | Order export | Compute |
| Failed delivery rate, return rate and payment failure or fraud rate (and pay on delivery share where offered) | Always | Courier, returns app or payment provider report | Ask |
| Meta spend per month, last 3 months; other paid channels | Yes | Ads Manager | Read |
| Markets and currency | Yes | Ad sets | Read |
| Stock on hand and reorder lead time, top 10 SKUs | For scaling or sales | Inventory report | Ask |
| Cash limit: most the store can spend on ads a month | For scaling or sales | Owner | Ask |
| Sale calendar, next 90 days, with offers | For sale plans | Owner | Ask |
| Goal for 90 days: profit now, or growth at break-even | Yes | Owner | Assume profit now |

**The standard exports**, pulled once and shared with every skill:

1. Meta Ads Manager export, last 90 days, by day, at ad set level (ad level for creative jobs): campaign name, ad set name, ad name, delivery, attribution setting, amount spent, impressions, reach, frequency, CPM, link clicks, CTR (link), purchases, purchase conversion value, cost per purchase, purchase ROAS. Add the 7-day click and 1-day view columns from "Compare attribution settings".
2. Shopify order export, same 90 days: Name, Created at, Financial Status, Subtotal, Shipping, Taxes, Total, Discount Amount, Refunded Amount, Payment Method, Email (to tag new versus returning), Lineitem sku, Lineitem quantity. WooCommerce: the matching CSV fields.
3. Events Manager screenshot of the Purchase event: browser and server events, event match quality, deduplication.
4. The live store URL, and the catalog name in Commerce Manager if catalog ads run.

Still missing after one ask: work at reduced confidence and say so on the first line. **Access:** level 1 (read) only; routed skills say when they need draft or publish.

## Before you start: the gates

1. **Money gate.** Gross profit per purchase is known or computed in Step 3. If it fails, route only to jobs that do not rank options (`store-meta-capi`, `store-meta-attribution`, `store-meta-landing`, `store-meta-brand-dna`). No budget, kill, scale or test ranking until it passes.
2. **Cash and stock gate.** The monthly cash limit and stock cover for the advertised SKUs are stated. If it fails, no scale plan, sale plan or budget increase. Diagnosis can still run.
3. **Tracking gate.** Meta purchases on 7-day click sit in a stable, explained range against Shopify paid orders for the last 30 days. Practitioner default, test it: Meta above store orders, or the ratio moving more than 20 points week to week, is a fail. If it fails, run `store-meta-capi` and `store-meta-attribution` first; other jobs may run, but their rankings are marked provisional.

## Steps

### 1. Name the real job

Match the owner's words to a route. When two rows fit, take the one higher in the run order (Step 5).

| The owner says | It usually means | Run first | Then |
|---|---|---|---|
| "ROAS dropped", "sales fell" | Demand, tracking, stock or offer changed | `store-meta-deep-dive` | `store-meta-capi` if the Meta to store ratio moved; `store-meta-creative-review` if ads are tired |
| "Meta shows more (or fewer) sales than Shopify" | Window, view credit, double counting or lost server events | `store-meta-attribution` | `store-meta-capi` |
| "Ads are not spending", "stuck in learning" | Payment, account or ad review block; cap too tight; too many small ad sets | `store-meta-audit` (delivery and policy checks) | `store-meta-budget` |
| "Scale for Black Friday" or "our peak season" | Cash, stock and offer plan before budget | `store-meta-math` | `store-meta-plan`, `store-meta-budget`, `store-meta-concepts` |
| "We are launching a new product" | New SKU money, page, ads, read plan | `store-meta-math` | `store-meta-landing`, `store-meta-product-photos`, `store-meta-concepts`, `store-meta-ad-images`, `store-meta-test` |
| "Take over the account", "is our agency any good" | Health check ranked by money | `store-meta-audit` | What its week list names |
| "Ads are tired", "what do we make next" | Creative supply and fatigue | `store-meta-creative-review` | `store-meta-competitor`, `store-meta-concepts` |
| "Clicks but no sales" | Page, offer or stock problem | `store-meta-landing` | `store-meta-test` |
| "How much can we spend", "what ROAS do we need" | Break-even and ceiling | `store-meta-math` | `store-meta-budget` |
| "Is ad A better than ad B", "should we test this" | Test sizing | `store-meta-test` | |
| "We have never run Meta ads" | A first plan | `store-meta-plan` | `store-meta-brand-dna`, `store-meta-concepts` |
| "Is our pixel or CAPI right" | Event quality and deduplication | `store-meta-capi` | `store-meta-attribution` |
| "Our ads do not look like us" | Brand look and voice | `store-meta-brand-dna` | `store-meta-concepts` |
| "We need better product photos" | Photo set for ads | `store-meta-product-photos` | `store-meta-ad-images` |

### 2. Build the context sheet once

Save it as `context/store-meta-context.md` (value, source, date per field). Every routed skill reads it; update it when price, stock or offer changes.

### 3. Work out the money

Gross profit per purchase = order value after discount (before tax) minus landed product cost, shipping and pick-pack, payment fees and expected returns cost. Use delivered cost, not product margin: a "70% margin" product can be 24% once shipping, fees and allowances are in [MEA-0023] [MEA-0037]. Measure cash collected as Shopify Net sales plus Shipping charges, not Total sales [MEA-0010].

- Break-even ROAS = Meta purchase value per order / gross profit per purchase. Check what value the store sends to Meta (subtotal, or total with shipping and tax) and use the same definition on top.
- Break-even cost per purchase = gross profit per purchase.
- Failed deliveries and unpaid orders: Meta counts the purchase when the order is placed, before it is delivered or paid. Some orders never turn into cash: parcels that come back undelivered, payments that fail or are reversed, and pay on delivery orders the buyer refuses, where that option is offered. Effective gross profit = gross profit x (1 minus failed order rate) minus failed order rate x (forward plus return shipping), on the store's own rates.
- Target cost per purchase. Default: first-order gross profit minus the profit per order the owner wants, because first-order margin at or above acquisition cost is the safe floor [MEA-0026]. Only if the store has 12 months of real repeat data: target = 90-day gross profit per customer / 2 to 3 [MEA-0020] [MEA-0024].

Worked example (any currency): order value 2,000; landed cost 600; shipping and pick-pack 120; fees 40; returns 25. Gross profit 1,215. Break-even ROAS 1.65. With 8% of orders failing (undelivered, refused or payment reversed) and 240 lost shipping per failed order: effective gross profit 1,099, break-even ROAS 1.82.

### 4. Name the number that decides

- **Budget decisions:** acquisition MER from Shopify, new-customer revenue divided by ad spend, against break-even [MEA-0025] [MEA-0039]. Read it weekly on small accounts.
- **Comparisons inside Meta:** 7-day click ROAS or cost per purchase; in audits 30 to 50% of reported ROAS came from 1-day view credit [MEA-0042]. [ADC-0027] keeps 1-day engaged view; both drop plain view, so 7-day click decides and engaged view is a second column for video-heavy accounts.
- **Health only:** blended MER (all revenue / all ad spend); returning buyers inflate it.
- **Measurement depth by size:** under about $5M a year, 7-day click plus a new-customer dashboard; add Meta lift studies from about $5M; geo-lift tests from about $20M [MEA-0041].

### 5. Set the run order

Fix data first, structure second, creative third: creative moves results most but takes longest to change [ADC-0028].

| Stage | Skills | Move on when |
|---|---|---|
| 1. Tracking trust | `store-meta-capi`, `store-meta-attribution` | Tracking gate passes |
| 2. Money | `store-meta-math`, `store-meta-budget` | Break-even, target and cash limit written; kill and scale rules set |
| 3. Structure | `store-meta-audit` or `store-meta-deep-dive`, `store-meta-plan` | Campaigns, exclusions and catalog product sets fixed |
| 4. Creative and pages | `store-meta-creative-review`, `store-meta-competitor`, `store-meta-brand-dna`, `store-meta-concepts`, `store-meta-product-photos`, `store-meta-ad-images`, `store-meta-landing`, `store-meta-test` | Running |

Later stages may draft in parallel, but no later-stage decision (pause, scale, crown a winner) is made while an earlier stage fails.

### 6. Sale periods

- Spread spend: put about 31 to 43% of September to December paid budget into September and October, and plan November near 1.8x October [ADC-0048]. These figures come from Black Friday data; for other peak seasons (holidays, local festivals, a brand's own big sale), apply the same logic to the store's own daily sales from last year and mark it "practitioner default, test it".
- Stock: never plan sale spend that empties the shelves; an empty catalog forces ads off and a slow restart [OPS-0019]. When a SKU has fewer days of stock than its reorder lead time, raise its target or pause its ads [ADC-0023].
- Cash: sale spend fits the cash limit; a big month's returns land the month after [MEA-0011].
- Ad volume: a fast November ramp can hit the per-page ad limit; set up extra pages first [ADC-0045].
- Reading results: in November, delayed purchases roughly double the gap between 1-day and 30-day click revenue, so pre-sale spend looks weak on the day [ADC-0046].

### 7. Hand off and merge

Send each skill the context sheet and only the exports it needs. When outputs disagree, the earlier stage wins: a tracking verdict beats a creative "winner".

### 8. Approvals

Never spend, launch, pause, change budgets, publish or message customers without the owner's explicit yes. Each such step is a numbered approval line with its access level.

## Checks before you hand it over

1. The request is restated in the owner's words and mapped to one route with a run order.
2. Gross profit per purchase is shown with inputs and sources, or the money gate is marked failed.
3. Break-even ROAS uses the same revenue definition as the purchase value sent to Meta.
4. Cash limit and stock cover are stated, or no scale or sale step appears.
5. The tracking gate shows the two numbers compared and the dates.
6. Each decision names its deciding number.
7. Every live action is an approval line, never a done step.

## Output

1. **One screen first:** You asked / What it really is / Run order (one line per skill) / Gates (pass or fail) / What I need from you (three items at most).
2. **Context sheet:** field, value, source, date.
3. **Money table:** each input with source; then gross profit per purchase, break-even ROAS, break-even cost per purchase, target cost per purchase.
4. **Route plan:** order, skill, question it answers, inputs, access level, done when. Files: `context/store-meta-context.md`, `meta-route-plan.md`.

## Common mistakes

- **Treating "ROAS dropped" as a creative problem.** Step 5 checks tracking and money first.
- **Using product margin as gross margin.** Step 3 uses delivered cost to the door.
- **Scaling into a stock-out before a sale.** The cash and stock gate blocks it.
- **Counting orders as revenue before they are delivered and paid.** Step 3 adjusts for failed deliveries and unpaid orders.
- **Reading the 1-day view default as truth.** Step 4 names 7-day click and acquisition MER.
- **Handling "ads not spending" as a budget problem.** Check payment, account status, rejected ads and catalog errors first.

## Sources

- [MEA-0010]: cash collected is Net sales plus Shipping.
- [MEA-0011]: returns land on the refund date, after big months.
- [MEA-0020]: CAC target from time-bound lifetime gross profit.
- [MEA-0023]: product margin is not gross margin.
- [MEA-0024]: gross profit per customer over CAC bands.
- [MEA-0025]: acquisition MER over blended MER.
- [MEA-0026]: first-order contribution at or above CAC.
- [MEA-0037]: gross margin is delivered cost to the door.
- [MEA-0039]: KPI paid media on acquisition MER.
- [MEA-0041]: measurement ladder by revenue size.
- [MEA-0042]: report on 7-day click; view credit inflates.
- [ADC-0023]: tie ad targets to days of stock.
- [ADC-0027]: 7-day click plus 1-day engaged view.
- [ADC-0028]: fix data, then structure, then creative.
- [ADC-0045]: per-page ad limits in November.
- [ADC-0046]: November attribution delay.
- [ADC-0048]: September to December budget split.
- [OPS-0019]: selling out at peak forces a restart.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: routes the owner's own words to one of 16 store skills in a fixed trust, money, structure, creative order; computes gross profit per purchase and break-even ROAS, with failed deliveries, returns and unpaid orders, before any option is ranked; blocks scale and sale plans without stock cover and a cash limit; names the number that decides each choice instead of an industry benchmark.

## Selling in India

- Cash on delivery is common there. Work out the share of COD orders and the return to origin (RTO) rate before you trust any ROAS; Ishita has the full method.
- Diwali is the main peak. Use last year's daily sales around it to plan the ramp, as step 6 describes for Black Friday.
