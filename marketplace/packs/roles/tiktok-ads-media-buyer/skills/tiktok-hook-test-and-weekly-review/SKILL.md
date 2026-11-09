---
name: tiktok-hook-test-and-weekly-review
description: Run TikTok hook and format tests one change at a time, with named hooks, kill rules set before launch and a dated test log, then read the weekly Ads Manager export to call each ad pause, keep or scale. Reads watch-time, click rate and cost per result over time, checks results against shop orders, spots tired ads, and ends with an ordered action list for the client to approve. Use every week on a live account, or when costs jump.
---

# TikTok hook test and weekly review

## When to use

- Every week on a live TikTok account.
- When cost per sale or sign-up jumps.
- When planning the next round of creative tests.

## What you need

- Ads Manager export for the last 14 days, by day and ad: spend, impressions, clicks, click-through rate, video play and watch-time columns, conversions, cost per conversion, conversion value, and the attribution setting used.
- Shop orders or sign-ups by day for the same dates.
- The test log: hook names, formats, lengths, start dates, kill rules.
- Break-even cost per sale or sign-up.

**Access:** level 1 for the review. Level 2 to draft new tests or paused ads. Level 3 to pause, scale or launch within the agreed limits.

## Steps

### 1. Check the numbers can be trusted
- Compare TikTok conversions with shop orders by day. A steady gap is workable; a jumping gap means tracking broke on some days.
- If conversions dropped to near zero overnight, check the Pixel and Events API before touching any ad.

### 2. Read each ad
For each live ad, write one row: hook name, format, length, days live, spend, watch-time trend, click-through rate, cost per result, and the result against break-even.

### 3. Apply the kill rules
- Each test cell already has a kill rule set before launch. Apply it as written. Do not change a rule after seeing the numbers.
- Ads over break-even after the agreed spend or time: pause.
- Ads under break-even with steady or rising volume: keep.
- Ads well under break-even over the agreed period: propose scaling, in the step size the client agreed.

### 4. Diagnose with the funnel
- **People leave in the first seconds:** the opening is the problem. Test a new hook on the same body.
- **People watch but don't click:** the offer or call to action is weak, or the product isn't clear.
- **People click but don't buy:** the landing page, price or checkout is the problem; new creative won't fix it.
- **Costs rise on a winner while watch time and click rate fall:** the ad is tiring. Brief a fresh hook in the same angle.
- **Costs rise on all ads at once with steady engagement:** check the market (season, competition) before blaming creative.

### 5. Plan the next test
- One change per test: a new hook on the same body, or the same hook in a new format, or a new length. Not all three.
- Name each new hook. Write its first two seconds as its own line.
- Set the kill rule now, from break-even.
- Mark any AI-made realistic person, voice or scene for the AIGC disclosure.

### 6. Write the action list
Order: the one ad to scale, the one to stop, then other changes. Each item: what, why, expected effect, undo, and "inside your limits" or "needs your yes".

### 7. Update the log
Add every result and decision to the test log with the date. A good log turns into a list of hook patterns that work for this brand.

## Checks

- The attribution setting is named wherever a result is quoted.
- Shop numbers were compared before any scaling call.
- Kill rules were applied as written.
- Each new test changes one thing.
- Anything above the cap, a new audience from a customer list, or a creator's post as a Spark Ad is marked "needs your yes".

## Output format

1. Top line: the one ad to scale and the one to stop.
2. Trust check: TikTok versus shop, by day.
3. Test log table: hook, format, length, days, spend, watch-time trend, CTR, cost per result, decision.
4. Diagnosis notes.
5. Next test plan with kill rules.
6. Action list for approval.

## Example of good output (short)

*Illustrative structure, not a real business: a coffee subscription. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Scale:** "Kettle click". **Stop:** "Office hero".
>
> **Trust check:** TikTok shows 46 sign-ups for the week; the shop shows 41. Gap steady all week. OK to read.
>
> | Hook | Format | Length | Days | Spend | Watch time | CTR | Cost per sign-up | Decision |
> |---|---|---|---|---|---|---|---|---|
> | Kettle click | Demo | 14 s | 9 | 310 USD | Rising | 1.4% | 11 USD | Scale one step |
> | Office hero | Talking head | 28 s | 9 | 280 USD | Falling | 0.6% | 31 USD | Stop (kill rule: above 18 USD after agreed spend) |
>
> **Next test:** keep the "Kettle click" body; new opening "Tuesday, 7:02 a.m." as its own line; same length. Kill rule: stop above 18 USD per sign-up after the agreed spend.
>
> **Needs your yes:** none. All items are inside your limits.
