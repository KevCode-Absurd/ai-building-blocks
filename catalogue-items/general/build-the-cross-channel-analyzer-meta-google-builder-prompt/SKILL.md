---
name: build-the-cross-channel-analyzer-meta-google-builder-prompt
description: Use when a developer or coding AI will build a module that compares Meta and Google Ads results side by side. The prompt makes a read-only function that checks spend balance, double-counted sales against your store totals, audience overlap, missing lift tests and mixed messages, then scores the channel mix only on what it could check. It never changes budgets.
---

# Meta and Google comparison coding prompt

This is a prompt you paste into a coding AI (Claude Code, Cursor, Codex or similar) that can read and edit your project. It builds one read-only analysis module that puts Meta and Google Ads results next to each other. It recommends. It never changes a budget, a bid or an account.

It is for people building software. If you only want the comparison done on your numbers, use the Meta and Google budget comparison reviewer instead.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Google Ads Quality Score tool planner](https://useaiblocks.com/prompts/build-the-quality-score-triage-module-builder-prompt).
- The [Google search term code planner](https://useaiblocks.com/prompts/google-search-term-code-prompt).
- The [Video ad analysis code planner](https://useaiblocks.com/prompts/build-the-video-performance-analyzer-builder-prompt).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.
<!-- /needs -->

## What you need first

- A project with **code you can edit**, and a coding AI with access to it.
- **Meta and Google Ads results** the module can read: Google campaign cost, conversions and conversion value; Meta ad set cost, conversions and conversion value. If your project already has code that fetches these, the prompt reuses it. If it does not, the AI builds the module to take typed rows as input, so it still works and can be tested on sample rows. Fetching live data needs read-only access to both ad accounts (for example a Google Ads API developer token and a Meta token that can read ads). Setting those up is a separate job.
- **Your store's total sales for the same dates** (optional): from Shopify or your shop. It makes the double-count check possible. Without it that check is skipped and said so.
- **A target blended ROAS** (optional). Without it the ROAS part of the score is skipped.
- **The same date range, time zone and currency** for both platforms. If they differ, the module stops and says so.

## Paste this into your coding AI

Fill in the angle brackets first.

```
Build a read-only cross-channel analyzer that compares Meta and Google Ads performance and returns budget, attribution-overlap and channel-strategy findings. It must never change a budget, bid or account.

First, look at my project: language, folder layout, how tests run, whether there is already a result type for findings, and whether code already fetches Google Ads or Meta data. Tell me what you found. If something I need is missing, list it and build the part that does not depend on it.

## What to build

Function: analyzeCrossChannel(input) returns DiagnosticOutput. Put it in <the folder where my analysis code lives>. Use my project's language and style.

Input:
- google: campaign rows { name, cost, conversions, conversionValue }
- meta: ad set rows { name, cost, conversions, conversionValue }
- dateRange: one start and end date, one time zone, one currency for everything
- priorPeriod (optional): the same two row sets for the period before, for trends
- storeSales (optional): total store sales for the same dates and currency
- targetBlendedRoas (optional)
- topAdText (optional): the main ad copy of the top-spend Google and Meta ads
- thresholds: configurable, with the starting values below. They are starting assumptions I must review, not facts.
  dominantSpendShare = 0.70, doubleCountGap = 0.30, messagingOverlap = 0.30, maxShiftPct = 10

If google and meta use different currencies or date ranges, return one high-severity finding "inputs-do-not-match" and stop.

If the project has no result type yet, use these two:
  Finding = { checkId, severity: critical|high|medium|low|info, title, recommendation, evidence, impact?: { amount, currency, basis } }
  DiagnosticOutput = { findings, summary, notEvaluated: [{ check, reason }], dateRange, currency }

## Checks
a. Channel balance: if one platform has more than dominantSpendShare of spend and its ROAS is below the blended ROAS, emit "channel-misallocation" (high). Recommend testing a shift of no more than maxShiftPct of spend toward the other channel. State both ROAS figures and the current split. ROAS is an average, not a promise about extra spend, so word it as a test.
b. Double counting: if platform-reported conversion value added together is more than storeSales by doubleCountGap or more, emit "double-counted-conversions" (high). Show reported, actual and the ratio. Use store sales as the source of truth for blended ROAS. If storeSales is missing, add this to notEvaluated. Do not guess.
c. Audience overlap signal: needs priorPeriod. If Meta retargeting CPM fell while Google brand-search impressions rose, emit "audience-overlap" (medium) and call it a signal, not proof. Without priorPeriod or those row types, add it to notEvaluated.
d. Lift tests: if a lift or holdout test is not recorded for a platform (the input says so), emit "no-incrementality-test" (low). If the input does not say, add it to notEvaluated.
e. Mixed messages: compare the main words in the top Google and Meta ad text after removing common words. If less than messagingOverlap of the words match, emit "messaging-inconsistency" (medium). Call it a rough check. Without topAdText, add it to notEvaluated.

Every finding includes evidence numbers and, where it can be worked out from the inputs, a money impact in the account currency with the basis. If it cannot be worked out, say "impact not calculable" instead of guessing.

## Blended ROAS
- Platform-reported blended ROAS = (Meta value + Google value) / (Meta cost + Google cost).
- Store blended ROAS = storeSales / (Meta cost + Google cost), only if storeSales is given.
Report both and label them. Never mix them in one number.

## Channel-mix score (0 to 100)
Points: blended ROAS against target 40, attribution discipline 25, budget balance 20, lift-test discipline 15.
- Score only the parts that could be checked. Show the points earned out of the points possible, for example "52 of 75 possible".
- Missing data is never full marks and never zero. List each skipped part in notEvaluated.
- Grade from the percent earned: A 90 or more, B 80, C 70, D 60, F below 60. These are starting assumptions, and the grade is shown only when at least 60 of the 100 points could be checked.

## Output summary
platforms { meta and google: spend, conversions, conversionValue, roas }, blendedRoas (both kinds), storeAttributionRatio (if storeSales), channelMixScore { earned, possible, grade }, topRecommendations (up to five, ranked by severity then money impact), notEvaluated.

## Failure handling
If one platform has no rows, return one high-severity finding "data-unavailable" for it, skip the checks that need it, and still run the rest. Do not fail the whole run.

## Tests
Write tests with sample rows only, no real accounts:
- each check with a sample that triggers it and a sample that does not
- double counting with storeSales present and absent
- score and grade at the edges, including when a part is skipped
- audience overlap skipped when priorPeriod is missing
- mismatched currency or dates stops the run

## Rules
- Read-only. Do not call any ad API from this module.
- Do not install packages, change config, add a schedule or run against a live account. Ask me first.
- Do not invent numbers. Say what you ran and what you did not.

## When you are done, show me
1. The function signature and the types
2. A sample DiagnosticOutput from the test rows
3. The test results (say if you could not run them)
4. A list of the assumptions and thresholds I need to review
```

## Check the result

- The thresholds are listed for you to review, not hidden in the code.
- Missing data is listed under notEvaluated, and the score shows points earned out of points possible.
- Nothing in the module can change an account.
- The tests pass on sample rows. Run a live account only when you say so, and keep it read-only.

## After it works

A weekly run suits this kind of comparison, because you need at least seven days of paired data. Add a schedule only if you want one. Ask the AI to propose it, then approve it.
