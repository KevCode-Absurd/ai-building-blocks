---
name: snapchat-creative-test-and-weekly-review
description: Run Snapchat creative tests one change at a time, with named concepts, kill rules set before launch and a dated test log, then read the weekly Ads Manager export to call each ad pause, keep or scale. Waits for late conversions before calling anything, names the attribution window, reads swipe rate, engaged views and cost per sale over time, checks results against shop orders, checks Dynamic Ads and catalog health, spots tired ads, and ends with an ordered action list for the client to approve. Use every week on a live account, or when costs jump.
---

# Snapchat creative test and weekly review

## When to use

- Every week on a live Snapchat account.
- When cost per sale jumps.
- When planning the next round of creative tests.

## What you need

- Ads Manager export for the last 14 days, by day and ad: spend, impressions, swipes, swipe rate, video views, engaged views, purchases, cost per purchase, purchase value, and the attribution window used.
- Shop orders by day for the same dates.
- The test log: concept names, formats, lengths, start dates, kill rules.
- Break-even cost per sale.
- Catalog diagnostics, if Dynamic Ads run.

**Access:** level 1 for the review. Level 2 to draft new tests as paused ads. Level 3 to pause, scale or launch within the agreed limits.

## Steps

### 1. Check the numbers can be trusted
- Compare Snap purchases with shop orders by day. A steady gap is workable; a jumping gap means tracking broke on some days.
- If purchases dropped to near zero, check the Pixel, the Conversions API and the Shopify data sharing setting before touching any ad.
- Leave out the last two days from any call: metrics finalise 48 hours after each day, and Advanced Conversions add results up to 36 hours late.

### 2. Read each ad
For each live ad, write one row: concept name, format, length, days live, spend, swipe rate, engaged-view trend, cost per sale, and the result against break-even.

### 3. Apply the kill rules
- Each test cell already has a kill rule set before launch. Apply it as written. Do not change a rule after seeing the numbers.
- Ads over break-even after the agreed spend or time: pause.
- Ads under break-even with steady or rising volume: keep.
- Ads well under break-even over the agreed period: propose scaling, in the step size the client agreed.

### 4. Diagnose with the funnel
- **Few engaged views:** the opening is the problem. Test a new first two seconds on the same body.
- **People watch but don't swipe:** the offer or call to action is weak, or the product isn't clear.
- **People swipe but don't buy:** the landing page, price, delivery cost or checkout is the problem; new creative won't fix it.
- **Costs rise on a winner while swipe rate and engaged views fall:** the ad is tiring. Brief a fresh opening in the same angle.
- **Costs rise on all ads at once with steady engagement:** check the season, a sale period such as Diwali or Black Friday, and tracking before blaming creative.
- **Dynamic Ads stop:** check the catalog sync, stock and the Pixel to catalog match rate.

### 5. Plan the next test
- One change per test: a new opening on the same body, or the same concept in a new format (Story, Collection, Sponsored Snaps), or a new length. Not all three.
- Name each new concept. Write its first two seconds as its own line.
- Keep text inside the safe zone; sound on with captions.
- Set the kill rule now, from break-even.

### 6. Write the action list
Order: the one ad to scale, the one to stop, then other changes. Each item: what, why, expected effect, undo, and "inside your limits" or "needs your yes".

### 7. Update the log
Add every result and decision to the test log with the date. A good log turns into a list of concepts that work for this brand.

## Checks

- The attribution window is named wherever a result is quoted.
- The last two days were left out of every call.
- Shop numbers were compared before any scaling call.
- Kill rules were applied as written.
- Each new test changes one thing.
- Anything above the cap, a new audience from a customer list, a creator's post as an ad, or a new country or state for a restricted product is marked "needs your yes".

## Output format

1. Top line: the one ad to scale and the one to stop.
2. Trust check: Snap against the shop, by day.
3. Test log table: concept, format, length, days, spend, swipe rate, engaged views, cost per sale, decision.
4. Diagnosis notes, including catalog health if Dynamic Ads run.
5. Next test plan with kill rules.
6. Action list for approval.

## Example of good output (short)

*Illustrative structure, not a real business: a US sneaker cleaning kit. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Scale:** "Muddy to mint". **Stop:** "Founder story".
>
> **Trust check (28-day swipe, 1-day view):** Snap shows 64 purchases for days 1 to 12; the shop shows 58. Gap steady. Days 13 and 14 left out while late conversions arrive.
>
> | Concept | Format | Length | Days | Spend | Swipe rate | Engaged views | Cost per sale | Decision |
> |---|---|---|---|---|---|---|---|---|
> | Muddy to mint | Single video | 6 s | 12 | 420 USD | 1.1% | Rising | 14 USD | Scale one step |
> | Founder story | Single video | 25 s | 12 | 390 USD | 0.4% | Falling | 39 USD | Stop (kill rule: above 22 USD after agreed spend) |
>
> **Next test:** keep the "Muddy to mint" body as a Collection Ad with the three kit sizes below. Kill rule: stop above 22 USD per sale after the agreed spend.
>
> **Needs your yes:** none. All items are inside your limits.
