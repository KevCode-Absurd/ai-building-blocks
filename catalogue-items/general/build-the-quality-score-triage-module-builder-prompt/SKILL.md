---
name: build-the-quality-score-triage-module-builder-prompt
description: Use when a developer or coding AI will build a read-only module that sorts Google Ads keywords by what is dragging Quality Score down. The prompt gives the full eight-row diagnosis table, groups keywords by ad group and cause, ranks them by wasted spend and returns one fix per group. It skips keywords with no sub-score data instead of calling them healthy.
---

# Quality Score review coding prompt

This is a prompt you paste into a coding AI (Claude Code, Cursor, Codex or similar) that can read and edit your project. It builds one read-only module that reviews Google Ads Quality Score keyword by keyword and groups the problems by cause.

Quality Score is Google's 1 to 10 rating of a keyword. It has three parts: expected click rate, ad relevance and landing page experience. Each part is rated below average, average or above average. The module reads those parts and tells you which one to fix first.

If you only want a review of your own numbers, not software, use the Google Ads store account auditor.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Simple code coach](https://useaiblocks.com/skills/simple-code-coach). It takes the code change.
- The [Breaking change reviewer](https://useaiblocks.com/skills/breaking-change-reviewer). It takes the code change.
- The [Pull request writer](https://useaiblocks.com/skills/pull-request-writer). It takes the code change.
- The [Code change reviewer](https://useaiblocks.com/skills/code-change-reviewer). It takes the code change.
- The [Bug root cause finder](https://useaiblocks.com/skills/bug-root-cause-finder). It takes the code change.
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
- **Keyword data** for a date range, with cost, the Quality Score and its three parts. Google Ads gives you these through its API. Fetching them live needs a Google Ads API developer token and read access to the account. Setting that up is a separate job: see the Google Ads token and access check planner. Without access, the prompt builds the module to take typed keyword rows, so it still works and can be tested on sample rows.
- **A spend floor**: the cost below which a keyword is too small to bother with. Pick one that suits your account. The prompt starts at 25 in your account currency.
- Enough keywords for the result to mean something. A small account may only produce a handful of groups. That is fine.

## Paste this into your coding AI

Fill in the angle brackets first.

```
Build a read-only Quality Score review module that groups Google Ads keywords by what is dragging their Quality Score down and says what to fix first. It must never change a keyword, ad or account.

First, look at my project: language, folder layout, how tests run, whether a result type for findings already exists, and whether code already fetches Google Ads keyword data. Tell me what you found. If something I need is missing, list it and build the part that does not depend on it.

## What to build

Function: reviewQualityScore(input) returns DiagnosticOutput. Put it in <the folder where my analysis code lives>, in my project's language and style.

Input:
- keywords: rows of { keywordText, adGroup, campaign, cost, qualityScore, expectedCtr, adRelevance, landingPageExperience }
  The three parts are one of BELOW_AVERAGE, AVERAGE, ABOVE_AVERAGE, or null when Google gave no rating.
- dateRange and currency
- minSpendForFlag: configurable, starts at <25> in account currency. A starting assumption I must review.
- maxKeywordsPerGroup: configurable, starts at 50. Only caps how many are listed.
- severityBands: configurable cost bands for severity, starting at critical above <1000>, high <250 to 1000>, medium <50 to 250>, low below <50>, in account currency. Starting assumptions I must review.

If the project has no result type yet, use:
  Finding = { checkId, severity: critical|high|medium|low|info, title, recommendation, affectedKeywords, evidence }
  DiagnosticOutput = { findings, summary, notEvaluated, dateRange, currency }

## Steps
1. Drop keywords with cost below minSpendForFlag. Count them as "below the spend floor" in the summary.
2. A keyword with null in any of the three parts is "not evaluated". Never call it healthy. Count it and list how much spend it holds.
3. Treat AVERAGE as not flagged (the same as ABOVE). A keyword is flagged only for a BELOW part.
4. Diagnose each remaining keyword with this table. B means BELOW_AVERAGE. A means AVERAGE or ABOVE_AVERAGE.

   | Expected CTR | Ad relevance | Landing page | Diagnosis |
   |---|---|---|---|
   | B | B | B | complete-overhaul |
   | B | A | A | ctr-issue |
   | A | B | A | relevance-issue |
   | A | A | B | landing-page-issue |
   | B | B | A | ad-problem |
   | A | B | B | ad-plus-lp-issue |
   | B | A | B | ctr-plus-lp-issue |
   | A | A | A | healthy (no finding) |

   These eight rows cover every combination, so no fallback rule is needed.
5. Group by ad group and diagnosis. Make one finding per group, with the affected keywords listed. This turns "rewrite the same ad for 30 keywords" into one action.
6. Within each diagnosis, sort groups by total cost, highest first.
7. checkId is "qs-" plus the diagnosis. Severity comes from the group's total cost and severityBands.
8. Use these recommendation texts:
   - complete-overhaul: "Pause or rebuild. Split the ad group into single-theme groups, rewrite the ads and fix the landing page."
   - ctr-issue: "Test new ad copy. Check pinned headlines, add extensions, try keyword insertion."
   - relevance-issue: "Make the ads match the keywords more closely. Split the ad group by theme or add headlines that use the keyword."
   - landing-page-issue: "Check the landing page for speed, mobile use and whether it matches the keyword. Consider a category page instead of the home page."
   - ad-problem: "Rewrite the ads for this ad group."
   - ad-plus-lp-issue: "Both the ad and the landing page need work. Start with the landing page, which often moves the score most."
   - ctr-plus-lp-issue: "New ad copy and a landing page review. Do both soon if the cost is high."
   These are starting advice, not promises that the score will rise.

## Summary block
- distribution: count of keywords per diagnosis, plus healthy, below spend floor and not evaluated
- spendShareLowQs: the share of evaluated spend on keywords with Quality Score below 7. Show the numerator and denominator in money. If Quality Score is null for a keyword, leave it out and say how much spend that is.
- topGroups: ad group, diagnosis, cost, keyword count

## Tests
Write tests with sample rows only, no real accounts:
- each of the eight table rows at least once
- AVERAGE treated as not flagged
- null parts give "not evaluated", never healthy
- spend floor filter
- severity bands at their edges
- ad group roll-up and sort order

## Rules
- Read-only. Do not call the Google Ads API from this module. Fetching is separate.
- No findings for healthy keywords.
- Do not install packages, change config, add a schedule or run against a live account. Ask me first.
- Do not invent numbers. Say what you ran and what you did not.

## When you are done, show me
1. The function signature and types
2. A sample DiagnosticOutput from the test rows
3. The test results (say if you could not run them)
4. A list of the thresholds and assumptions I need to review
```

## Check the result

- Keywords with no sub-score data are listed as not evaluated, not healthy.
- Every threshold is a setting you can see, with your own number in it.
- Nothing in the module can change an account.
- The tests pass on sample rows.

## After it works

Quality Score moves slowly, so a monthly review is plenty. Weekly runs mostly show noise. Run the module on a live account only when you say so, and keep it read-only. If you want a monthly schedule, ask the AI to propose one, then approve it yourself.
