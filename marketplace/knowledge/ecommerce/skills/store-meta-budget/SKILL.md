---
name: store-meta-budget
description: "A full Meta media-buying plan read on store profit, not platform ROAS. Checks tracking per ad set against store orders, finds past winners (paused ones too) to relaunch first, ranks every audience segment on the data and funds the one that wins, weights new creative to the proven format and message with enough volume to feed the budget, then accounts for the whole budget: supported profitable opportunities funded within cash and stock limits, unspent cash with an evidence-based release rule, learning-phase limits (about 50 events in 7 days), stock and cash ceilings. Each ad set gets a Scale, Hold, Trim or Cut verdict that matches its number and one rule read on store numbers. Use weekly, before raising spend, when results slip, and before sale periods."
---

# Meta media buying from store profit

**You get:** a Meta plan built on store numbers: tracking health per ad set, past winners to relaunch, every audience segment ranked with the winner funded, the formats and messages to make more of, a full budget that adds up, a Scale, Hold, Trim or Cut verdict and one rule per ad set, and a change list ranked by profit for the least work.

A campaign earns more budget only when the store profits on the extra sales and has the stock and cash to back them.

## When to use

- The weekly budget review.
- The owner wants to spend more and asks where it should go.
- Cost per purchase has risen for a week or more and something must change.
- A product is running low, or slow stock needs to turn into cash.
- Planning budgets for a sale period.

## Not for

- Building the profit lines: run `store-meta-math` first.
- A deep tracking fix: use `store-meta-capi`; this skill reads its result.
- Writing the ads themselves: hand the format and message calls to `store-meta-concepts`.
- Planning a new account from scratch: use `store-meta-plan`.

## What you need

Required:

1. **Ads Manager export**, last 28 and last 7 days, campaign, ad set and ad level, paused items included: Delivery (Learning, Learning limited), Attribution setting, Budget, Bid strategy, Amount spent, Purchases, Purchase value, Cost per purchase, Frequency, Reach, and the products each sells. Add the longest history the account has at ad level, so past winners show.
2. **Breakdowns** by age, gender, region, placement and device for the same window.
3. **Store orders** by UTM campaign and content, to set the store-vs-platform gap per ad set.
4. **Money lines** from `store-meta-math`: gross profit per purchase, break-even and target cost per purchase, cash and stock ceilings.
5. **Stock**: days of cover and reorder lead time per advertised product.
6. **The client's limits**: the budget for the period, products to protect or clear.

Optional: post-purchase survey answers, existing-customer count matched in Meta, the creative log with format and angle per ad.

Access: level 1 to analyse and plan. Level 2 to draft edits as unpublished changes. Every budget, bid or status change needs the client's explicit yes, asked in your message, not in the plan; never spend past the stated budget.

## Before you start: the gates

1. **Gross profit per purchase known.** Fail: no Scale or Cut on profit; act only on clear breakages and send the client to `store-meta-math`.
2. **Cash and stock limits stated.** Fail: no Scale verdicts; Hold, Trim and Cut can still go ahead.
3. **Tracking can be read.** Store orders by UTM, or a gap the brief gives, exist for the main ad sets. Fail: step 1 becomes the fix, and the plan holds zero-spend only for the days the fix needs.

## Steps

Follow the house rules, chiefly **Org context first**, **Map every signal to an asset**, **Look it up before you decide**, **Only the brief's facts run the business** and **One basis per number**. Before step 1, write the org context (every segment the data ranks, each with its number) and the signal-to-asset map. Run `node tools/ask-knowledge.mjs` once per signal and once per decision below, and log each query, the card ids and the call in `context/trace.md`. Every figure goes in `context/numbers.json`. Use days relative to the start; a calendar date only when the brief gives one.

### 1. Tracking

- Check Meta gets about one Purchase per store order: browser and server events share one event_id so they count once [MEA-0006]. Data integrity comes before structure and budget [ADC-0028].
- Report on 7-day click, or 7-day click plus 1-day engaged view; one-day views inflate reported return [MEA-0042] [ADC-0027].
- Use the store-vs-platform gap the brief gives, per ad set where given; prospecting, retargeting and catalog ads differ. Never average two gaps into a midpoint. If the brief gives none, work it per ad set: store orders tagged to it divided by Meta's purchases.
- Put targets on Meta's basis once: Meta-basis target cost = store target cost x that ad set's gap. Judge every verdict on store numbers.
- An ad set with broken tracking holds its budget until fixed; ad sets with working tracking carry on.

### 2. What worked before

- List every ad and ad set, paused included, whose store-basis cost per purchase beat target after spend of at least 3 times target cost [ADC-0039]. Note why each stopped: fatigue, stock, season or budget.
- Relaunch these first, with fresh cuts of the same concept: a new hook, first frame, length or format. Relaunching old winners to widen the live ad count cut acquisition cost in one large account [ADC-0013].
- A winner still live is scaled where it is; never paused to relaunch elsewhere [ADC-0067].
- A winner paused for stock comes back when cover passes lead time.

### 3. Audiences

- Rank every segment the data splits: age band, gender, region, placement, device, and each ad set's audience (broad, lookalike, interest, customer list). Use spend, store-basis purchases and cost per purchase, and rank only segments with at least 3 times target cost of spend.
- Name the winner. It gets its own ad set or its own creative that names it in the copy [ADC-0032]. On broad targeting, age bands and interests are only suggestions, so creative does the steering [ADC-0055].
- No age, gender or interest floor the data does not support. Exclude a segment only when it lost on enough spend.
- Existing customers: excluded from prospecting, with their spend set in money: matched customers x CPM / 1,000 x the monthly frequency wanted [ADC-0068]. About 10 ads a month is plenty [ADC-0042]. Catalog ads take product viewers who did not add to cart; retargeting takes recent add to cart and checkout visitors; both exclude recent buyers.

### 4. Formats and messaging

- Rank past ads by format (video, static, carousel, creator, founder) and by angle or hook, on store-basis cost at meaningful spend. The cheapest format and angle at scale is the proven style.
- At least half of all new creative is in the proven style. When one concept carries most spend, shift output toward it rather than starving it [ADC-0061].
- Volume to feed the budget: new ads needed each week = weekly spend on new ads / (3 x target cost per purchase), because each needs about that much to be judged [ADC-0039]. Name that number.
- Messaging comes from the org context: the customers' own words, the top objection answered, one message per winning segment. No style the owner called tired. Hand the briefs to `store-meta-concepts`.

### 5. Budget

Account for the whole available budget: proposed spend plus explicitly unspent cash must add up. Available budget is a ceiling, never an obligation to spend.
- Fund proven winners from day one where tracking works. No zero-spend setup days unless tracking is missing, and then only the days the fix needs.
- Unspent cash may be up to 100% when tracking, contribution, inventory or cash evidence does not support spend. Give a release rule on verified store numbers, for example "release to the scale ad set once its store-basis cost stays under target for 7 days".
- About 70% on proven ads and 30% on new ads when the account is profitable; 90/10 when it is not [ADC-0053]. Under about 50,000 a month, run one concept campaign, one scaling campaign and small customer retargeting [ADC-0041].
- Learning: an ad set needs about 50 optimisation events in the 7 days after a significant edit. Weekly budget to leave learning = 50 x cost per purchase. If the store cannot fund that per ad set, run fewer ad sets. Concept ad sets can be read on 3 times target cost [ADC-0039] or a budget set from 20 conversions [ADC-0066].
- Ceilings: no push on a product with less cover than lead time [ADC-0023]; the total fits cash. Scale stops where the marginal cost of the last raise reaches break-even, even if the average looks fine [ADC-0049].
- Bids: default to highest volume; add a cost goal at the Meta-basis target only when scaling runs into losses. Products with very different margins get their own campaigns [ADC-0022].
- Sale periods: recompute break-even for the discount and write the rules before the sale.

### 6. Verdicts

One label per ad set, and it matches its number in every table and note:
- **Scale** (budget goes up): store-basis cost at or under target on 7 and 28 days, not in learning, last raise's marginal cost under break-even, cover longer than lead time. A small ad set with cost below target is only a scaling candidate; validate marginal economics, attribution maturity and inventory/cash capacity. Cost above target is not evidence of under-spending.
- **Hold** (same budget): between target and break-even, in learning, at a ceiling, or under 7 days of data.
- **Trim** (lower, above zero): above target with marginal cost rising, or a hero product kept alive at less spend.
- **Cut** (zero): store-basis cost above break-even for 14 days after spend of 3 times target, a concept at 3 times target with 0 or 1 purchases [ADC-0039], or a product about to sell out.

Read at least 7 days; below about 1,000 a day, daily swings are noise [ADC-0064]. Judge creative at ad set level [ADC-0059], and never switch off weak ads inside a winning ad set [ADC-0009]. Clearance stock is judged at break-even [FIN-0026].

### 7. Rules

One rule per ad set, in one line, read on store numbers, never on Meta's reported cost alone. For example: "Scale 20 to 30% every 3 to 4 days while store-basis cost per purchase over 7 days stays under target; Cut to zero if it passes break-even after 3 times target spend." No Meta source fixes a raise size [ADC-0056], so the rule is set by marginal cost.

### 8. Add up and hand over

- Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` and fix every FAIL. Budgets add to the period's total; summary counts come from the table.
- Forecast before and after on store numbers, with at most one assumed input, named.
- Rank the change list by profit gained per hour of work: usually a tracking fix, a relaunched winner and a Cut first, then Scale steps, then new creative.
- Add a test or holdout only when the brief asks or tracking cannot answer the question.
- Where cash-on-delivery refusals cost a lot, show profit per prepaid and per cash order and name the checkout lever that hides cash on delivery above an order value [SET-6187].

### 9. Three scenarios, concentration and structure traps

When the owner asks "what if we move money around?", show three plans that each add up to the same total:

- **Freed money first.** Freed budget = Trim cuts + Cut ad sets. It goes first to Scale ad sets, then to new concept tests, never to Hold ad sets without a written reason.
- **Trim size.** A starting point for a Trim: new budget = current budget x (store-basis target cost / current store-basis cost), so the ad set is funded at the rate it earns.
- **Three plans.** Conservative puts 50% of the freed money into Scale ad sets, moderate 75% (the default), aggressive 100%. Haircut the projected sales of each extra step by 10 to 20%, because the last sales cost more than the average [ADC-0049]. Projected gains are ceilings, not promises.
- **Concentration.** No single campaign above about 60% of the period's budget unless it is the only campaign; under budget optimisation about 4% of ads can take about 64% of spend, which is efficient but fragile [ADC-6215]. Say so when one ad takes over half of an ad set's spend, and make sure a replacement concept is in the pipeline.
- **Revert rule.** If store-basis cost per purchase worsens by more than 30% within 48 hours of a raise, go back to the previous budget; otherwise no edit for 72 hours after a raise.

Structure traps to check before a budget move:
- **Avoid budget optimisation at very high order value with few orders.** Around 5 orders a day on a big-ticket product, Meta allocates on clicks and hold rate, which barely track return; use ad set budgets [ADC-6183] [ADC-6252].
- **Do not split out a placement, age band or region because its breakdown ROAS looks higher.** Meta spends on marginal return, so that slice usually has no room to grow; spreading spend to lower-ROAS ads is usually right [ADC-6233].
- **Budget optimisation or ad set budgets is a risk choice.** Many buyers rotate into budget optimisation for the November and December peak, then back to ad set budgets in the new year to force spend through tests [ADC-6208] [ADC-6188].
- **No bid strategy testing below about 200,000 a month** of Meta spend; the hour is worth more on creative [ADC-6230] [ADC-6200].

## Checks before you hand it over

- Tracking: each ad set's gap comes from the brief or store orders, never a midpoint.
- Every past winner is relaunched or has a one-line reason.
- Every segment is ranked; the winner has its own ad set or creative; no unsupported age or interest floor.
- At least half the new creative is in the proven style, with the weekly ad count named.
- Proposed spend plus unspent cash reconciles to the available budget; every release rule is evidence-based and fits stock/cash limits.
- Every verdict label matches its number; every ad set has one rule on store numbers.
- `numbers.cjs` shows no FAIL; each decision reads in two plain lines.
- Each scenario adds to the same total budget, and freed money is placed before new money.
- No campaign tops about 60% of budget without a stated reason.

## Output

**Summary, one screen:** spend now and planned, verdict counts, forecast change in profit after ads, and the one limit that binds.

**Each decision in two lines:** what to do, and why with one number.

**Table "Budget":** Ad set, Now a day, New a day, Verdict, Rule. A total row equals the budget.

**Table "Relaunch":** Past winner, Store cost per purchase, Why it stopped, Fresh cut.

**Table "Segments":** Segment, Spend, Store cost per purchase, Rank, What it gets.

**Change list:** Order, Change, Profit effect, Effort, Review day.

**Appendix file** `meta-budget-working.csv`: gaps, learning status, cover, marginal cost per ad set.

## Common mistakes

- **Judging on Meta's numbers.** Step 1 puts every target on the store basis.
- **Leaving paused winners paused.** Step 2 relaunches them first.
- **Guessing an age floor.** Step 3 ranks segments on the data.
- **Too little creative in the style that works.** Step 4 sizes weekly volume to the budget.
- **Spending because budget exists.** Step 5 permits holding all cash when no supported opportunity exists and records the evidence needed to release it.
- **A Cut label on an ad set that still spends.** Step 6 ties labels to numbers.
- **Splitting a placement or age band off a breakdown report.** Its high ROAS rarely survives more spend [ADC-6233].
- **Budget optimisation on a big-ticket product with a handful of orders a day.** It optimises on clicks, not return [ADC-6183].

## Sources

- ADC-0009: do not cut weak ads inside a winning ad set.
- ADC-0013: relaunching old winners cut acquisition cost.
- ADC-0022: maximise conversions favours the cheapest product.
- ADC-0023: tie spend to stock cover.
- ADC-0027, MEA-0042: click-based attribution.
- ADC-0028: data integrity first.
- ADC-0032, ADC-0055: segment in the copy; broad targeting controls.
- ADC-0034: scale toward break-even on business profit.
- ADC-0039, ADC-0066: concept reads and budgets.
- ADC-0041, ADC-0053: account shape; proven versus new split.
- ADC-0042, ADC-0068: existing-customer spend.
- ADC-0049: marginal versus average cost.
- ADC-0056: no Meta source for a fixed raise size.
- ADC-0059, ADC-0064: ad set level, 7 days or more.
- ADC-0061: feed the concept that carries spend.
- ADC-0067: scale a winner where it is.
- FIN-0026: clearance at break-even.
- MEA-0006: event_id dedup.
- SET-6187: Shopify can hide payment methods at checkout.
- Meta documentation: learning phase of about 50 optimisation events in 7 days.
- ADC-6183: avoid budget optimisation at high order value and few orders.
- ADC-6188: budget optimisation versus ad set budgets is a risk choice.
- ADC-6200: bid strategy testing only at large spend.
- ADC-6208: rotate into budget optimisation for Q4.
- ADC-6215: 4% of ads hold about 64% of spend.
- ADC-6230: daily tweaks add little.
- ADC-6233: do not split off a breakdown slice.
- ADC-6252: high order value, few purchases.

What this skill adds: every call on store numbers, past winners relaunched before anything new, segments ranked on the data instead of guessed floors, creative volume sized to the budget, and a whole-budget plan with labels that match their numbers.
