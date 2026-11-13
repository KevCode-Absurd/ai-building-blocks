---
name: store-meta-budget
description: "Makes a scale, hold or cut call for every Meta campaign from the store's own profit, not platform ROAS alone. Converts break-even ROAS and target cost per purchase into Meta's reporting basis, checks each ad set against the learning phase (about 50 optimisation events in 7 days), stock cover, cash and the cost of the last extra sales, then sets new daily budgets, bid goals, existing-customer spend and the test share. Returns a decision table and a numbered change list the client approves before anything goes live. Use it weekly, before raising spend, when results slip, and when planning sale periods."
---

# Scale, hold or cut: Meta budgets from store profit

**You get:** a scale, hold or cut call for every Meta campaign based on store profit, with new daily budgets, a numbered change list for approval and review dates.

A campaign earns more budget only when the store profits on the extra sales and has the stock and cash to back them.

## When to use

- The weekly budget review.
- The owner wants to spend more and asks where it should go.
- Cost per purchase has risen for a week or more and something must be cut.
- A product is running low, or slow stock needs to turn into cash.
- Planning budgets for a sale period or the September to December run.

## Not for

- Building the profit lines: run `store-meta-math` first.
- Deciding how much of Meta's credit is real: run `store-meta-attribution` first.
- Reading a creative test or sizing one: use `store-meta-test`.
- Planning a new account structure from scratch: use `store-meta-plan`.

## What you need

Required:

1. **Ads Manager export**, last 28 days and last 7 days, campaign and ad set level. Columns: Campaign name, Ad set name, Delivery (shows Learning or Learning limited), Attribution setting, Budget, Bid strategy, Amount spent, Purchases, Purchases conversion value, Cost per purchase, Frequency, Reach, and the product set or SKUs each campaign sells.
2. **Money lines** from `store-meta-math`: break-even ROAS, break-even and target cost per purchase, marginal cost of the last raise, stock and cash spend ceilings.
3. **Store-truth factors** from `store-meta-attribution`: one for prospecting, one for retargeting and catalog ads.
4. **Stock**: units on hand, days of cover and reorder lead time for each advertised SKU, graded A (fast) to D (not moving).
5. **The client's limits**: most they will spend this month, and any SKUs to protect or clear.

Optional: activity history for the last 14 days (to see recent edits), existing-customer count matched in Meta, last month's CPM.

Access: level 1 to analyse and recommend. Level 2 to draft the changes in Ads Manager as unpublished edits. Level 3, or the client, to publish. Every budget, bid or status change needs an explicit client yes first; never raise spend past the stated monthly limit.

## Before you start: the gates

1. **Gross profit per purchase known.** Fail: make no scale or cut calls on profit. Only act on clear breakages (tracking stopped, ads rejected) and send the client to `store-meta-math`.
2. **Cash and stock limits stated.** Fail: no scale calls. Hold and cut calls can still go ahead.
3. **Tracking trustworthy.** Pass when `store-meta-attribution` produced a factor and `store-meta-capi` shows Meta receiving about one Purchase per store order. Fail: hold every campaign at its current budget except clear losses, and fix tracking first. Data integrity comes before structure and budget [ADC-0028].

## Steps

### 1. Put the targets on Meta's basis

Meta over- or under-credits by the store-truth factor, so translate once instead of adjusting every row:

- Meta-basis break-even ROAS = store break-even ROAS / factor.
- Meta-basis target cost per purchase = store target cost per purchase x factor.

Illustrative only: store break-even ROAS 2.25 and prospecting factor 0.70 give a Meta-basis break-even of 3.21. A target of 20 per purchase becomes 14 on Meta's numbers. Use the lower retargeting factor for retargeting and catalog campaigns.

Write every target as a sum from the client's numbers: order value, each cost, the factor, the result. A target set between two counts names both ends and the rule that picks the point. Never a bare percent the reader cannot rebuild.

### 2. Read the right window

Judge on at least 7 days; below about 1,000 a day of spend, day-to-day swings are noise [ADC-0064]. For campaigns raised recently, use a window covering the store's usual time from first click to purchase, because extra spend reaches people who buy days later [ADC-0056]. Judge creative at ad set level, not ad level [ADC-0059].

### 3. Check the learning phase

Meta documentation: an ad set needs about 50 optimisation events in the 7 days after its last significant edit to leave learning. Significant edits include budget changes, bid changes, targeting, creative, the optimisation event, and pausing for 7 days or more.

- Weekly budget needed to leave learning = 50 x cost per purchase. Illustrative: at 20 per purchase, 1,000 a week, about 143 a day.
- If the store cannot fund that for each ad set, run fewer ad sets. Many ad sets in Learning limited means the budget is spread too thin.
- Do not edit an ad set in learning except to stop clear losses.

Concept tests can be read on less: 3 times the target cost per purchase [ADC-0039] or a budget set from 20 conversions [ADC-0066]. Use those for test ad sets and Meta's 50 events for scale calls.

### 4. Make the call per campaign

**Scale** only when all hold:
- Meta-basis ROAS at or above target, or cost per purchase at or below the Meta-basis target, for both the last 7 and 28 days.
- Not in learning.
- The last raise had a marginal cost per purchase below break-even [ADC-0049].
- Advertised SKUs have more days of cover than reorder lead time [ADC-0023].
- The new budget fits the stock and cash ceilings from `store-meta-math`.

**Hold** when ROAS sits between break-even and target, the ad set is in learning, a ceiling is reached, or there are fewer than 7 days of data.

**Cut** (lower budget or pause) when:
- Meta-basis ROAS is below break-even over 14 days or more, after spend of at least 3 times the target cost per purchase. Practitioner default, test it.
- A new concept spends 3 times target cost per purchase with 0 or 1 purchases [ADC-0039].
- An advertised SKU will sell out before restock: raise its ROAS goal sharply or pause its ads [ADC-0023].

**Exceptions:**
- Clearance campaigns for C and D stock are judged at break-even or a small loss, not the main target [FIN-0026].
- A hero product that would lose ranking or audience learning if it went dark is held at reduced budget, not paused.
- Inside an ad set that is hitting target, do not switch off its low-ROAS ads; Meta sequences ads across views [ADC-0009].
- A campaign far above target on a small budget is under-spent; scale it toward break-even and judge the business's 30-day profit, not the ratio [ADC-0034].

### 5. Size each change

Meta documents no fixed raise percentage; the "never more than 20%" rule has no Meta source [ADC-0056]. Practitioner default, test it: for ad sets near the 50-event line, raise 20 to 30% every 3 to 4 days; for campaigns well above it, larger steps are fine. After each step, recompute marginal cost per purchase and stop when it reaches break-even. Cut losses in one step; a pause longer than 7 days restarts learning.

### 6. Set bid goals from the store's numbers

Default to highest volume. When a campaign scales into losses, add a cost per result goal at the Meta-basis target, or a ROAS goal at the Meta-basis break-even. A goal that leaves budget unspent for several days is too tight; loosen it. When products have very different margins, maximising purchases sends money to the cheapest sale, not the most profitable one; split those products into their own campaigns [ADC-0022].

### 7. Budget existing customers in money, not percent

Existing-customer spend = matched customers x CPM / 1,000 x monthly frequency wanted [ADC-0068]. Illustrative only: 20,000 matched customers, CPM 10, frequency 6 gives 1,200 a month. Audits often find existing customers seeing 20 to 100 ads a month when about 10 is plenty [ADC-0042]; a 30-day frequency near 30 on customers means overspend [ADC-0029]. Exclude existing customers from prospecting, and keep catalog retargeting small; its ROAS is the most inflated [ADC-0010]. When retargeting and catalog ads both run, split the pool so they stop paying for the same people: catalog ads for product viewers who did not add to cart, retargeting for recent add to cart and checkout visitors, both excluding recent buyers (practitioner default, test it).

### 8. Split proven and test money

When the account is profitable, about 70% on proven ads and 30% on tests; when it is not, 90/10 or pause testing [ADC-0053]. Under about 50,000 a month, run concept tests, one scaling campaign and minimal customer retargeting [ADC-0041].

### 9. Plan sale periods ahead

Put about 31 to 43% of September to December paid budget into September and October, and plan November near 1.8 times October [ADC-0048]. Recompute break-even for each sale discount with `store-meta-math`. Write scale and cut rules before the sale, on a 3-day rolling marginal read [ADC-0050]. Do not sell out into December [OPS-0019]. Late December is the cheapest auction of the quarter; plan an offer for it [ADC-0043].

### 10. Add up, forecast and hand over

- Sum the new daily budgets; the total fits the monthly limit and the stock and cash ceilings.
- Copy the summary's call counts and totals from the table; never write the headline first.
- Forecast the new split, if each ad set keeps its last cost per purchase: purchases = new budget / cost per purchase; profit after ads = purchases x gross profit per purchase minus spend. Show before and after, on Meta's count and the store's.
- When cash on delivery refusals or returns are a big cost, show gross profit per prepaid and per cash order and name the payment-mix lever: a prepaid offer in the ad and on the page, or a checkout rule hiding cash on delivery above an order value or in high-refusal areas [SET-6187]. The owner decides.
- Write each change as one approvable line.

## Checks before you hand it over

- Every campaign has exactly one call (scale, hold or cut) with the rule that triggered it.
- Calls use Meta-basis targets from step 1, not raw platform ROAS.
- No scale call on an ad set in learning or on a SKU with cover shorter than its lead time.
- Each scale step has a marginal cost per purchase check scheduled.
- The new total fits the monthly limit, stock and cash ceilings.
- Existing-customer spend is set in money with the frequency stated.
- The summary's counts and totals match the table's check line, and every target shows its working.
- The before and after forecast totals add up.
- Big refusal or return costs come with the payment-mix lever in money per order.
- Nothing is marked done; every change waits for a client yes.

## Output

**Summary, one screen:** total spend now and proposed, number of campaigns per call (from the table's check line), forecast change in profit after ads, and the one limit that binds (profit, stock, cash or learning).

**Table "Budget calls":** Campaign, Spend last 7 days, Meta ROAS (chosen basis), Factor, Store-basis ROAS, Break-even ROAS, Target cost per purchase versus actual, Purchases per ad set last 7 days, Learning status, Days of cover versus lead time, Call, Current daily budget, New daily budget, Rule used, Review date. Last row, the check line: calls counted by type, total current and new daily budget.

**Table "Forecast of the new split":** Campaign, Spend, Purchases, Profit after ads on Meta's count and on the store's count, before and after, with totals.

**Change list for approval:** number, change, access needed, risk (for example "restarts learning on one ad set"), expected effect, review date.

**File:** `meta-budget-calls.csv` or a Google Sheet.

## Common mistakes

- **Scaling on platform ROAS.** Retargeting and view credit flatter it. Step 1 converts targets to the store basis.
- **Average cost per purchase hiding a bad last raise.** Step 4 checks marginal cost [ADC-0049].
- **Selling out the hero SKU on full spend.** Step 4 ties spend to stock cover [ADC-0023].
- **Too many ad sets for the budget.** Each stays in learning. Step 3 sizes ad sets to 50 events a week.
- **Treating 20% as Meta's rule.** Step 5 uses marginal cost instead [ADC-0056].
- **Budgeting customers as a percent.** Step 7 sets it from list size and frequency.
- **Cutting a profitable ad set's weak ads.** Step 4 leaves winning ad sets alone [ADC-0009].
- **A headline that contradicts the table, or a target with no working.** Steps 1 and 10 build both from the numbers, with a profit forecast.

## Sources

- ADC-0009: do not cut low-ROAS ads inside a winning ad set.
- ADC-0010: catalog retargeting ROAS is inflated.
- ADC-0022: maximise conversions favours the cheapest product, not the most profitable.
- ADC-0023: tie ad targets to stock cover.
- ADC-0028: data integrity before structure.
- ADC-0029, ADC-0042, ADC-0068: existing-customer spend and frequency.
- ADC-0034: scale toward break-even on business profit.
- ADC-0039, ADC-0066: concept test budgets and reads.
- ADC-0041, ADC-0053: account shape and proven versus test split.
- ADC-0043, ADC-0048, ADC-0050: sale-period budgets and rules.
- ADC-0049: marginal versus average CAC.
- ADC-0056: the 20% rule has no Meta source.
- ADC-0059, ADC-0064: judge at ad set level, over 7 days or more.
- FIN-0026: slow stock may run at break-even.
- OPS-0019: do not sell out into December.
- SET-6187: Shopify checkout rules can hide or reorder payment methods.
- Meta documentation: learning phase of about 50 optimisation events in 7 days; significant edits.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill adds: calls on store profit in Meta's reporting basis; stock, cash and marginal cost as hard limits on scaling; learning-phase limits in place of fixed 20% and 3x rules; existing-customer spend in money; and a checked profit forecast of the new split.
