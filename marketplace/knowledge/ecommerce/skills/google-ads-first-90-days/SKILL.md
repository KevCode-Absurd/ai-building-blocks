---
name: google-ads-first-90-days
description: "A 90-day Google Ads plan for a new store or a new Google account: whether Google should come first at all, what to set up before spending, which campaigns to launch in week one (usually brand and a Shopping campaign on 5 to 10 best sellers), the budget for each month worked from the store's gross profit per purchase and cash, and the data triggers for adding each later campaign type (Search, Smart Bidding, target ROAS, remarketing, Performance Max, Demand Gen, YouTube). Each month ends with a go, hold or stop rule. Use when a store is starting Google Ads, restarting after a bad first try, or has a new account with no history."
---

# Google Ads for a new store: first 90 days

**You get:** a dated 90-day plan on one sheet: set-up tasks with owners, the launch campaigns, a month-by-month budget with the sum shown, the purchase counts that unlock each next campaign type, and a go, hold or stop rule at days 30, 60 and 90.

## When to use

- A store is about to spend its first money on Google Ads.
- A first attempt burned money and the owner wants a clean restart.
- The account is new, with no conversion history, even if the store is not.
- The owner asks "what do I launch first, and when do I add Performance Max?"

## Not for

- Building the Search campaign itself: use `build-google-search-campaign`.
- Setting up the store before launch: use `launch-new-shopify-store-checklist`.
- An account that already has months of data: use `google-ads-account-audit`, then `google-ads-weekly-routine`.
- Setting the total ad budget across channels: use `set-ad-budget-from-profit-target`.

## What you need

Required:

1. **Gross profit per purchase** for the top products, from `store-meta-math` or `build-sku-profit-sheet`.
2. **Product list** with prices, stock and gross margin per product (Shopify product export plus costs).
3. **Monthly cash** the client can put into Google for three months, and fulfilment capacity per week.
4. **Search demand check**: Keyword Planner volumes for the main product types (free in Google Ads), and Search Console if the site has history.
5. **Accounts**: Google Ads and Merchant Center, owned by the client, with billing set by the client.

Optional: Meta results, if the store already runs Meta; email list size.

Access: the client creates accounts and signs in; never ask for passwords. Draft access to build paused campaigns. Every launch and every budget step needs the client's yes.

## Before you start: the gates

1. **Search demand.** People search for the product type or the problem it solves. If the category is new and nobody searches for it, Google will be a small channel and Meta or creators should lead [GAD-0022]. Fail: plan brand and Shopping only, at a small budget, and say so.
2. **Profit.** Gross profit per purchase is known. Fail: stop and run `store-meta-math`.
3. **Tracking.** One primary purchase action with real order values and enhanced conversions, checked by `check-google-ads-conversion-tracking` [MEA-0017].
4. **Feed.** Merchant Center approved, products live, under 5% disapproved (practitioner default). Fail: `fix-merchant-center-disapprovals` first.
5. **Cash for 90 days.** The client can carry month 1 and 2 budgets even if they lose money while learning. Fail: cut the plan to brand and Shopping only.

## Steps

### 1. Days 1 to 7: set up, spend nothing

- Link Google Ads, Merchant Center, GA4 and the YouTube channel. Install the store's Google channel app or tags; one primary purchase.
- Set shared negative lists (waste words) and a brand negative list for non-brand campaigns [GAD-0028].
- Account settings: auto-apply recommendations off; Search partners and Display off in Search campaigns [GAD-0042].
- Feed titles on the top 10 products rewritten with `write-product-feed-titles-that-match-searches` if they are manufacturer names.
- India: billing set with GST details so invoices are usable; add GST on Google invoices to ad cost when judging profit. Note which pin codes the store ships to and how cash on delivery is handled.

### 2. Days 8 to 30: launch two campaigns

| Campaign | Setting | Why |
|---|---|---|
| Brand Search | Exact and phrase brand terms, capped CPC, small daily budget | Cheap, protects the name; see `protect-brand-search-terms` |
| Standard Shopping, hero products | 5 to 10 best sellers with stock and good margin; Maximize clicks with a max CPC cap, or manual CPC | Start narrow with the products most likely to sell [GAD-0030] [GAD-0031] |

Shopping usually carries most store sales on Google [GAD-0054], so it comes before non-brand Search. Add non-brand Search for the top two or three product types only if Shopping cannot cover them (for example, products that need explaining).

Review search terms weekly in the first 30 days; that is when campaigns wander most. Hand it to `google-search-term-mining`.

### 3. Set the budget for each month

Work the money first:
- Break-even CPA = gross profit per purchase; break-even ROAS = 1 / gross margin [GAD-0023].
- **Month 1 budget** = break-even CPA x 20 purchases, plus the brand budget (practitioner default, test it). This buys enough data to reach the first bidding switch.
- **Month 2 budget** = month 1 budget, raised by up to 20% at a time only where campaigns spend their full budget and sit at or under target CPA [GAD-0023].
- **Month 3 budget** = month 2, plus the first new campaign type unlocked in step 4, each with its own test budget.

Show the three-month total next to the client's cash limit. If the total is over, cut products, not bids.

Accept that month 1 may run below break-even while bidding learns; month 2 must be at or near break-even; by month 3 the account must show a path to profit, or the plan holds.

### 4. Add each campaign type only when its trigger is met

| Next step | Trigger | Card |
|---|---|---|
| Shopping bidding: Maximize clicks to Maximize conversion value | 15 to 20 purchases in the campaign | [GAD-0030] |
| Target ROAS | 30 to 50 purchases a month in the campaign; target at or just below trailing 30-day ROAS; hold 2 to 3 weeks between changes | [GAD-0021] |
| More products in Shopping | Hero products profitable; next tier by margin, using custom labels | [GAD-0031] |
| Remarketing (Display or Demand Gen to site visitors) | 4 to 6 weeks of traffic | [GAD-0030] |
| Performance Max | About 100 purchases in the account, a clean feed, 30 to 50 purchases a month and enough daily budget; brand excluded | [GAD-0033] [GAD-0026] |
| Splitting Shopping by product tiers | Catalogue of about 30 or more products with enough sales per tier | [GAD-0001] |
| Demand Gen or YouTube | Core campaigns profitable for 30 days and cash for a 10 times target CPA daily budget | see `set-up-demand-gen-campaign` |

Some practitioners leave target ROAS off new Performance Max for about three months [GAD-0016]; that only suits stores whose cash and margin can absorb unconstrained spend. For a small store, follow the triggers above.

### 5. Day 30, 60 and 90 reviews

At each review, read results on store data and conversion-time columns:

| Review | Go | Hold | Stop |
|---|---|---|---|
| Day 30 | 15 or more purchases and cost per purchase within 1.5 times break-even | Fewer purchases but improving weekly | No purchases after spending 3 times break-even CPA on Shopping (practitioner default, test it) |
| Day 60 | At or near break-even on non-brand | Within 20% of break-even and improving | Worse than day 30 |
| Day 90 | Above break-even; scale by the triggers | At break-even; fix feed, pages or offer before more spend | Below break-even with tracking trusted: pause non-brand and rethink product, price or channel |

Higher repeat value can justify a lower first-order target, but only when repeat rates are measured, not assumed [GAD-0032].

## Checks before you hand it over

- The search demand gate is answered with real volumes.
- Every budget traces back to gross profit per purchase, with the three-month sum next to the cash limit.
- Launch is brand plus narrow Shopping unless a stated reason changes it.
- Each later campaign type has a numeric trigger, not a date alone.
- Day 30, 60 and 90 rules are written before launch.
- Tracking and feed gates passed, with evidence.
- Nothing launches or scales without the client's yes.

## Output

1. **One-screen summary:** Google's role for this store, what launches first, the three-month budget against cash, and the next decision date.
2. **90-day plan sheet:** Week, Task, Campaign, Owner, Trigger or date, Done.
3. **Budget sheet:** Month, Campaign, Daily budget, Monthly budget, Basis (formula), Running total, Cash limit.
4. **Trigger table:** the step 4 table with a Current count column.
5. **Review template:** Review day, Purchases, Cost per purchase, Gross profit after ad cost, Verdict (go, hold, stop), Next action.

## Common mistakes

- **Launching Performance Max on day one.** Step 4 waits for about 100 purchases [GAD-0033].
- **The whole catalogue in Shopping at once.** Step 2 starts with heroes [GAD-0031].
- **Target ROAS before there is data.** Step 4 waits for 30 to 50 purchases a month [GAD-0021].
- **Budget from a round number.** Step 3 works it from break-even and purchases needed.
- **Raising budget before profit.** Step 5's day 60 rule holds it.
- **Starting Google for a product nobody searches.** Gate 1 says so first [GAD-0022].

## Sources

- GAD-0001: about 30 products before splitting Shopping widely.
- GAD-0016: leaving target ROAS off new Performance Max, and when that fails.
- GAD-0021: target ROAS at 30 to 50 purchases a month.
- GAD-0022: Google's share depends on search demand.
- GAD-0023: break-even ROAS and budget steps.
- GAD-0026: Performance Max entry conditions.
- GAD-0028: brand negatives in non-brand campaigns.
- GAD-0030: Shopping start on best sellers; bidding switches; remarketing timing.
- GAD-0031: concentrate cold spend on the best products.
- GAD-0032: lower targets only with measured repeat value.
- GAD-0033: Performance Max after about 100 purchases.
- GAD-0042: setting leaks to switch off at launch.
- GAD-0054: Shopping carries most store sales on Google.
- MEA-0017: one primary purchase action.

What makes this skill ours: it first asks whether Google should lead at all for this product; every month's budget is worked from gross profit per purchase and checked against the client's cash; each new campaign type unlocks on a purchase count, not a calendar date; and day 30, 60 and 90 go, hold or stop rules are written before the first rupee or dollar is spent.
