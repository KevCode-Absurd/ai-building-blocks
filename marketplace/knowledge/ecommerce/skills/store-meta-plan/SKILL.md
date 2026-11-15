---
name: store-meta-plan
description: "Plan an online store's Meta ads for the stage it is in: first 30 days of ads, finding a winner, scaling a winner, peak season or a new product launch. Works out gross profit per purchase, break-even ROAS and a target cost per purchase from the store's own numbers, then sizes the campaign structure, daily budget, creative supply and review dates from that money, the cash the owner can risk and the stock on hand. Use before a store starts, restarts or changes gear on Meta, or 6 to 10 weeks before a sale season or launch. Read access only; nothing goes live without a yes."
---

# Meta ads plan for an online store

**You get:** a stage-based Meta ads plan: unit economics, campaigns, weekly budget, creatives and approvals, in two files.

## When to use

- The store is about to run Meta ads for the first time, or restart after a month or more off.
- The store has spent but no ad has held at its target cost per purchase.
- One concept or product is working and the owner wants to spend more on it.
- A sale season (Black Friday to New Year, a local festival, a big local sale) is 6 to 10 weeks away.
- A new product or collection launches in the next 4 to 8 weeks.

## Not for

- Finding what is broken in an account that is already running: use `store-meta-audit`.
- Moving budget or changing bids in live campaigns this week: use `store-meta-budget`.
- Writing the ad concepts and copy this plan asks for: use `store-meta-concepts`.
- Fixing the Pixel or Conversions API: use `store-meta-capi`.

## What you need

Required:

1. **Cost sheet** for each product in the plan: price, usual discount, landed cost (purchase price, inbound freight, duty, branded box [FIN-0007]), shipping and pick-pack per order, payment fee %, return or refund rate. Shopify Products export with "Cost per item" filled, or the WooCommerce product CSV.
2. **Shopify order export**, last 90 days (12 months for peak plans): Name, Created at, Financial Status, Subtotal, Shipping, Discount Amount, Total, Refunded Amount, Lineitem name, Lineitem quantity, Payment Method, customer email or ID. Stores with many failed deliveries or paid-later orders add the courier's failed delivery report.
3. **Cash**: the monthly amount the owner can spend on ads, the most they will lose before stopping, and the date of the next stock payment.
4. **Stock**: units on hand and inbound per SKU, and reorder lead time.

Optional, raising confidence:

5. Meta Ads Manager export, last 90 days, ad level, by day: Campaign name, Ad set name, Ad name, Amount spent, Impressions, Reach, Frequency, Link clicks, Purchases, Purchases conversion value, Attribution setting.
6. Events Manager overview for the Purchase event (browser and server events, deduplication, Event Match Quality).
7. Commerce Manager catalog status: items approved, rejected, out of stock.
8. Live URLs of ad landing pages.

Missing 1 to 4: ask once, in one numbered message. Missing 5 to 8: plan at reduced confidence and say so in the first line.

**Access:** level 1 (read) for the whole plan. Level 2 (draft) only if the owner asks you to build the campaigns paused. Spending or publishing needs level 3 and a yes for each change.

## Before you start: the gates

1. **Money.** For each product, compute gross profit per purchase (GPP):
   GPP = order value after discount − landed cost − shipping and pick-pack − payment fees − (return rate × money lost per return) − for failed deliveries and unpaid orders, (failed order rate × outbound plus return shipping).
   Use cost delivered to the door, not product margin [MEA-0037] [MEA-0023]. Then break-even ROAS = order value ÷ GPP, and break-even cost per purchase = GPP.
   *Pass:* GPP known for every product. *Fail:* stop and hand over the cost sheet with blanks marked.
2. **Cash.** *Pass:* the owner has named a monthly budget and a loss limit, and the stage minimum from step 4 fits inside it. *Fail:* name a smaller stage that fits, or say Meta should wait.
3. **Stock.** *Pass:* every product has days of cover (units ÷ average daily units) longer than reorder lead time plus the stage length, or a pre-order path. A SKU short of its lead time gets a higher ROAS target or leaves the plan [ADC-0023].
4. **Tracking.** *Pass:* Purchase fires once per order with value and currency, and Meta's 7-day click purchases are not higher than store orders for the same 14 days. *Fail:* if Meta counts more purchases than the store had orders, events are doubled; send the job to `store-meta-capi` first. A new store passes on one test purchase with the right value.

## Steps

1. **Name the stage from facts, not ambition.** These cut-offs are practitioner defaults; test them.
   - *First 30 days:* under about 50 Meta purchases ever, or no ads for 60 days.
   - *Finding a winner:* has spent, but no ad set has held at or under target cost per purchase for 7 days.
   - *Scaling a winner:* at least one concept at target for 14 days on 7-day click, with stock for twice the current daily units.
   - *Peak season:* a sale within 10 weeks. Plan that window separately.
   - *New product launch:* a product with no sales history that needs its own budget.

2. **Set the target cost per purchase (CPP).** Start at GPP (first-order break-even). Go above it only when 90-day gross profit per customer in the order export pays it back [MEA-0020] and cash can wait [FIN-0029]. Judge the plan on 30- and 90-day gross profit per new customer ÷ cost per new customer: under 1 loses money, 1 to 2 hold, 2 to 3 scale [MEA-0024]. The deciding number is acquisition MER (new-customer revenue from Shopify ÷ ad spend), read weekly; Meta's 7-day click view is for in-platform reads only [MEA-0025] [MEA-0039].

3. **Check the page can pay for clicks.** Conversion rate × order value (percent sign removed) should reach about 250 to 300 at US or UK prices [MEA-0047] [OFF-0047]. Below that, fix the page with `store-meta-landing` first. Where clicks are cheap, as in many lower-priced markets, check instead that revenue per visitor × (GPP ÷ order value) beats expected cost per click.

4. **Size budgets from CPP.** Meta's documentation says an ad set leaves learning after about 50 optimisation events in 7 days, so a fully learned ad set needs about 50 × CPP a week. So plan few ad sets. Read a concept after 3 × CPP spent (3+ purchases keep, 2 wait, 0 to 1 cut) and make a firm call at 5 × CPP [ADC-0039]. Daily test budget = purchases wanted × CPP ÷ test days [ADC-0066].

5. **Pick the structure for the stage.**

| Stage | Campaigns and ad sets | Daily budget | New ads | Move on when |
|---|---|---|---|---|
| First 30 days | One sales campaign (Advantage+ sales, or manual sales with Advantage+ audience), broad, purchasers of the last 180 days excluded [ADC-0015]; no retargeting campaign yet | 10 to 50 a day to start [ADC-0052], raised to fit 3 × CPP per concept within 14 days | 3 to 5 distinct concepts, then 1 to 3 new ads every few days [ADC-0052] | A concept passes the 3 × CPP read |
| Finding a winner | One testing campaign with each batch of 4 to 8 ads as its own ad set at a minimum of 1 × CPP a day for 7 days [ADC-0007]; one scaling campaign for anything at target | Mostly tests; the 70/30 proven-to-test split [ADC-0053] starts once something is proven | One batch a week | An ad set holds target for 14 days |
| Scaling a winner | Scaling campaign with ad sets by concept (persona, angle, offer) [ADC-0058]; testing campaign; small existing-customer campaign sized in money: customers × CPM ÷ 1,000 × 4 to 7 views a month [ADC-0020] | 70% proven, 30% tests; raise toward break-even on 30-day store profit [ADC-0034], judged on what the extra customers cost [ADC-0049] | About one new ad per 1,000 of monthly spend above 20,000 a month [MCR-0059]; below that, 3 concepts at a time [MCR-0082] | Marginal cost per new customer reaches GPP |
| Peak season | Keep evergreen campaigns at about 50 to 60% of spend and add offer-badged copies [MCR-0069]; extra Facebook pages set up before the ramp [ADC-0045] | Spend 31 to 43% of the Sep to Dec budget in Sep and Oct, November near 1.8 × October [ADC-0048] | Sale creative ready 3 weeks before | Rules written in advance (below) |
| New product launch | Its own ad set or campaign, so the proven product does not starve it; existing customers reached by email first, then a small Meta audience | 3 × CPP per launch concept over 14 days | 3 concepts | Passes the 3 × CPP read, or price is reworked [FIN-0012] |

   Store rules for every stage: one cold campaign unless countries or product margins need separate budgets [ADC-0030]; split campaigns when products have very different GPP, because purchase bidding chases the cheapest sale, not the most profitable [ADC-0022]; keep catalog (dynamic product) ads small and judge them on 7-day click, as they mostly reach people about to buy anyway [ADC-0026] [ADC-0010]; build catalog product sets that leave out out-of-stock and below-target GPP items; use 7-day click plus 1-day engaged view as the attribution setting [ADC-0027].

6. **Write the scaling rules down.** The "never raise more than 20%" rule has no Meta documentation behind it [ADC-0056]. Raise in steps the owner can afford, wait at least 3 days, and judge on 7 days or more, since day-to-day swings are normal below about 1,000 a day [ADC-0064]. More than one significant edit per ad set per week restarts learning too often (practitioner default, test it).

7. **Peak and launch extras.** Recompute break-even ROAS for every discount depth before the sale; a 30% discount can triple it [OFF-0065] [OFF-0069]. Prefer a gift or multi-pack that keeps GPP positive over a deep sitewide cut [OFF-0007]. Scale on 3-day rolling marginal profit and cut after two poor reads [ADC-0050]. With thin stock, do not sell out into December [OPS-0019]. Plan a late-December offer if stock and shipping cut-offs allow [ADC-0043]. For launches, fly the first batch in and restock by sea [COG-0008]; selling out is fine only if restock takes two weeks or less [ORG-0038].

8. **Failed deliveries and unpaid orders (practitioner default, test it).** Meta counts a purchase when the order is placed, so orders that fail delivery, get refused or have payments reversed teach delivery to find more buyers like them. This is biggest where pay on delivery is offered. Compute GPP on delivered orders, judge MER on delivered revenue, and test an incentive to pay upfront on the page.

9. **Hand off creative supply.** List the concepts the stage needs as persona × angle × offer × format. A new colour or background is not a new concept [MCR-0022]; near-copies are grouped and add no reach [MCR-0078]. Send the list to `store-meta-concepts`.

## Checks before you hand it over

1. GPP, break-even ROAS and CPP are shown for every product, with the formula and inputs.
2. Every budget line is a formula from CPP, and the weekly total stays inside the owner's cash and loss limit.
3. Every advertised SKU has days of cover longer than lead time plus the stage, or it is out of the plan.
4. Every threshold carries a card id, Meta documentation, or "practitioner default, test it".
5. The deciding number (acquisition MER) is named; each campaign has an exit rule and review date.
6. Nothing is presented as launched; every live action sits in the approval list.

## Output

1. **One-screen summary:** stage, target CPP, daily budget, first three actions, review date, confidence.
2. **Unit economics table:** Product, Price, Avg discount, Landed cost, Ship and pack, Fees, Returns and failed delivery cost, GPP, Break-even ROAS, Target CPP.
3. **Campaign plan table:** Stage, Dates, Campaign, Ad set, Audience and exclusions, Optimisation event, Daily budget, Ads, Exit rule.
4. **Week-by-week budget:** Week, Spend, Purchases at target, Cash left, Units left per SKU.
5. **Creative supply list:** Concept, Persona, Angle, Offer, Format, Due date.
6. **Approval list** (numbered, with access levels) and files `META-PLAN.md`, `meta-plan.csv`.

## Common mistakes

- **Planning from product margin.** 70% can become 24% after shipping, fees and returns [MEA-0023]; the money gate uses delivered cost.
- **Copying a big-account structure.** Ten ad sets at 20 daily never leave learning; step 4 sizes from CPP.
- **Scaling a product about to run out.** The stock gate and [ADC-0023] stop it.
- **Letting catalog ads eat the budget.** They reach near-buyers and look best; step 5 caps them.
- **Same ROAS target in a sale.** Step 7 recomputes it.
- **Counting failed or unpaid orders as sales.** Step 8 prevents it.

## Sources

ADC-0007: batch ad set at 1 × CPA; ADC-0010: catalog ROAS inflated; ADC-0015: exclude 180-day buyers; ADC-0020: existing-customer spend in money; ADC-0022: split by product economics; ADC-0023: targets tied to stock; ADC-0026: cap catalog ads; ADC-0027: 7-day click default; ADC-0030: one cold campaign; ADC-0034: scale to break-even; ADC-0039: 3 × and 5 × CPA reads; ADC-0043: late-December auction; ADC-0045: page ad limits; ADC-0048: peak budget split; ADC-0049: marginal CAC; ADC-0050: written peak rules; ADC-0052: zero-to-one budget; ADC-0053: proven and test split; ADC-0056: 20% rule undocumented; ADC-0058: ad sets by concept; ADC-0064: ignore daily swings; ADC-0066: test budget formula; COG-0008: air launch, sea restock; FIN-0007: landed cost; FIN-0012: bottom-up pricing; FIN-0029: judge on longer cash; MCR-0022: colour is not a concept; MCR-0059: ads per spend; MCR-0069: evergreen through sales; MCR-0078: near-copies grouped; MCR-0082: creative by spend band; MEA-0020: CAC from gross profit; MEA-0023: true gross margin; MEA-0024: profit to CAC bands; MEA-0025: acquisition MER; MEA-0037: delivered cost; MEA-0039: KPI on acquisition MER; MEA-0047: revenue per visitor floor; OFF-0007: gift lowers break-even; OFF-0047: revenue per session floor; OFF-0065: discount triples break-even; OFF-0069: recompute per discount; OPS-0019: do not sell out at peak; ORG-0038: sell-out needs fast restock.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: it plans by store stage instead of by industry and sizes every budget from gross profit per purchase, cash and stock; it gates the plan on unit economics, cash, stock and tracking before any structure; it replaces the fixed 70/20/10 split, the 20% raise rule and "5 × CPA" ad set budgets with Meta's 50-events rule and card-backed read points; it covers peak discounts, launches and failed or unpaid orders.

## Selling in India

- Clicks are cheap in India, so use the revenue per visitor test in step 3 rather than the US or UK floor.
- Diwali is the main peak; plan its ramp from last year's daily sales.
- For COD, add the courier's RTO report and apply step 8 to COD orders.
