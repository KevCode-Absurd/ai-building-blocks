---
name: call-creative-test-winners
description: "A readout of a finished ad creative test that marks each tested concept win, lose or not enough data on store profit, not platform ROAS, and names the next three ads to make from each. Checks the test was clean (offer, page, stock and tracking unchanged), converts platform purchases to store-side gross profit after ad cost, applies a spend-based data rule before any verdict, catches false winners with high clicks and few sales, and turns each verdict into three specific follow-up ads. Use when a creative test window closes, before moving a concept into the scaling campaign, or when the team argues about which ad won."
---

# Creative test readout

**You get:** a one-page readout with every tested concept marked **win**, **lose** or **not enough data** on store gross profit after ad cost, the reason in one line, and the next three ads to make from each concept, plus a learning log row per concept for the tag sheet.

## When to use

- A creative test window has closed and someone has to call it.
- Concepts are about to move from a test ad set into the main campaign.
- The team disagrees about which ad won, or a high-click ad is being called a winner.
- A batch needs successors and nobody wrote down what each test taught.

## Not for

- Sorting all live ads into scale, keep, fix or cut: use `store-meta-creative-review`.
- Designing the test before it runs: use `store-meta-test`.
- Website A/B tests: use `read-store-ab-test-result`.
- Re-editing a video's weak seconds: use `video-ad-retention-fix` after this readout.

## What you need

Required (read access, level 1):

1. **Ad platform export** for the test window at ad level: ad name, ad set, spend, impressions, reach, frequency, link clicks, 3-second views and video plays at 25% and 50% (video), purchases, purchase value. Meta Ads Manager, TikTok Ads Manager or Google Ads.
2. **Shopify order export** for the same window: order name, created at, total, discount code, UTM fields or landing site, customer type (new or returning), and, where the store offers pay on delivery, the payment method and delivery status.
3. **Gross profit per purchase and target cost per purchase** by product, from `store-meta-math`.
4. **The test plan**: question, concepts, what was held constant, start and end dates.
5. **Change log** for the window: price, offer, page, stock and tracking changes.

Optional: the store's tag sheet, the platform's attribution comparison columns, post-purchase survey answers.

If the test plan is missing, rebuild it from ad names and the change log and say so. If tracking was broken during the window, stop: no verdicts. This job needs read access only. Moving ads, pausing or changing budgets needs draft or publish access and the client's yes.

## Before you start: the gates

1. **Profit line.** Pass when gross profit per purchase is built from delivered cost [MEA-0037]. Fail: run `store-meta-math` first.
2. **Clean test.** Pass when offer, landing page, price, stock and tracking stayed the same for all concepts in the window. Fail: mark affected concepts "not enough data: test changed" and plan a rerun.
3. **Tracking matches the store.** Pass when platform purchases sit within about 20% of store orders from that source for the window (practitioner default, test it; see `store-meta-attribution`). Fail: judge on store orders by UTM, or delay the call.
4. **Not a sale week.** If the window had heavy or uneven discounts, ad-level return mostly reflects which product was discounted; read at ad-set level and on click and cost-per-click signals only [MCR-0068], and keep verdicts provisional.

## Steps

### 1. Line up each concept's money

For each concept (sum its ads): spend, platform purchases, store-matched purchases, new-customer share, and store gross profit after ad cost = matched purchases x gross profit per purchase minus spend. Production cost goes in too when comparing formats [MCR-0023].

Pay on delivery note: where buyers can pay on delivery, a placed order is not a sale. Use delivered orders, or apply the store's failed-delivery rate by payment method before counting gross profit.

### 2. Apply the data rule

Practitioner rule for Meta prospecting: a concept needs spend of about 3 times target cost per purchase before a call; at that point 3 or more purchases keep it, 2 wait, 0 or 1 cut; 5 times target gives a firm call [ADC-0039]. Accounts with only a few orders a day may need a longer window or a higher-funnel signal; say which you used. Ads that got almost no spend are not losers; move deserving ones to a separate ad set for a fair run [ADC-0031].

### 3. Mark the verdict

- **Win:** passed the data rule, cost per purchase at or under target on store-matched purchases, and positive gross profit after ad cost (or within the owner's stated first-order loss for buyers with proven repeat value [MEA-0024]).
- **Lose:** passed the data rule and missed target, or failed the 0 to 1 purchase cut. Mark a loss that missed target by 20% or less as a near-miss (practitioner default, test it).
- **Not enough data:** under the spend bar, a "wait" result (run it on to 5 times target), test changed mid-window, or tracking gap too large.

Never mark a win on click rate, hook rate or platform ROAS alone.

### 4. Catch false winners

Check each apparent winner for a big gap between click rate and purchases. A satisfying or curious ad can pull clicks from people who never buy [MCR-0029]. Also check new-customer share: a concept whose buyers are mostly returning customers is harvesting, not finding, buyers. Mark these "win, low new share" and do not scale them as prospecting ads.

### 5. Find the part that did the work

Use the tags (buyer, angle, hook, format, offer, creator) to say which part most likely drove the result [MCR-0051]. For video, compare 3-second view rate (hook) with 50% plays (body). Strong hook and weak body points at the middle; weak hook and strong body points at the opening. Write the reason in one line.

### 6. Write the next three ads per concept

- **Win:** (1) same angle, new buyer; (2) same angle, new format; (3) same body, new hooks by a different person. Apply new formats to proven ideas before new ideas [MCR-0052]; a different presenter has revived tired winners [MCR-0047]. Each must change buyer, angle, format or offer, not colour or pose [MCR-0022].
- **Near-miss (a loss within 20% of target):** fix the weak part found in step 5, keep the rest, and test it as about 3 hook variations in its own ad set [MCR-0079].
- **Lose:** one opposite angle for the same buyer, one same angle for a different buyer, or retire the angle; record why.
- **Not enough data:** the rerun plan and spend needed.

### 7. Log the learning

One row per concept in the learning log. Keep losers; they define what the store now knows. Update the tag sheet so the next roadmap uses it.

## Checks before you hand it over

- Every concept has one verdict from the three allowed, with the rule that decided it.
- Every win is on store-matched purchases and gross profit after ad cost, not platform return.
- The data rule is stated in money for this store and was met before any win or lose.
- Test changes, tracking gaps and sale distortion are named where they apply.
- Pay-on-delivery stores counted delivered orders or adjusted for failed deliveries.
- Each concept has three next ads that each change buyer, angle, format, offer or hook.
- No ad was paused, moved or scaled without the client's yes.

## Output

**One-screen summary:** the test question, the answer in one sentence, winners and spend to move them, losers and what they taught, concepts still waiting and their rerun cost.

**Readout table:**

| Concept ID | Buyer | Angle | Format | Spend | Spend / target cost per purchase | Platform purchases | Store-matched purchases | New-customer share | Cost per purchase | Gross profit after ad cost | Hook rate | 50% play rate | Verdict | Rule that decided it | Reason (one line) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Next ads table:** Concept ID, Next ad 1, Next ad 2, Next ad 3, What each changes, Brief due.

**Learning log row:** date, concept ID, tags, verdict, reason, what to try next, what not to repeat.

**Proposed actions for approval:** each move, pause or budget change, numbered.

## Common mistakes

- **Calling it on clicks.** Steps 3 and 4 require purchases and profit, and flag high-click, low-sale ads.
- **Calling it too early.** Step 2 sets a spend bar in the store's own money.
- **Ignoring a changed test.** Gate 2 parks concepts whose offer, page or stock moved.
- **Trusting platform purchases.** Gate 3 and step 1 match them to store orders.
- **Pay-on-delivery orders counted as sales.** Step 1 counts delivered orders.
- **"Make more like it" with no detail.** Step 6 names three ads and what each changes.

## Sources

- ADC-0031: give unspent ads a fair run in their own ad set.
- ADC-0039: judge at about 3x target cost per purchase; 5x for a firm call.
- MCR-0022: a new ad must change buyer, angle or offer.
- MCR-0023: include production cost when comparing formats.
- MCR-0029: high-click ads can be false winners.
- MCR-0047: a new presenter can revive a tired winner.
- MCR-0051: tag ads on the same fields to trace winners.
- MCR-0052: new formats on proven ideas first.
- MCR-0068: sale weeks distort ad-level return.
- MCR-0079: test about 3 hook variations per new concept.
- MEA-0024: gross profit per customer over acquisition cost bands.
- MEA-0037: gross margin is delivered cost.

What makes this skill ours: every verdict is on store-matched purchases and gross profit after ad cost, with a spend bar set in the store's own money; tests that changed mid-window, sale-week distortion and failed pay-on-delivery orders are handled before anyone calls a winner; and each verdict turns into three named next ads that change one real part, so the readout feeds the next batch instead of a slide.

## Selling in India

- With COD, use delivered orders or apply the store's RTO rate by payment method before calling a winner.
