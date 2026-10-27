---
name: video-hook-and-hold-matrix-reviewer
description: Use view counts to place video ads in a hook and hold matrix. Get fixes for each weak point.
---

# Video hook and hold matrix reviewer

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Ad change decision checker](https://useaiblocks.com/skills/campaign-keep-or-change-checker). It takes the audit report.
- The [TikTok Ads account auditor](https://useaiblocks.com/skills/tiktok-ads-account-auditor). It takes the audit report.
- The [TikTok ad test reader](https://useaiblocks.com/skills/tiktok-ad-test-reader). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## When not to use
- Static or carousel ads. The hook and hold math needs video views. Compare clicks and sales instead.
- Very little spend or very few views. The labels will be unsure. Wait for more data.
- A budget or pause decision. Use your sales and profit numbers. This reads attention only.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your results** (yours): an export from Meta Ads Manager, Google Ads or your store, for set dates.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your results. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.
<!-- /needs -->

## What you need
"Your results" in the box above means the video ad data below.
- Impressions, three-second video views and the later-view count you chose (for example ThruPlay), for each ad (required).
- Video length, spend and conversions for the same dates (required).
- Link clicks or outbound clicks (optional).
- Your own high and low cutoffs for hook and hold (optional).

## Plain meanings
- **Hook rate:** the share of impressions that were watched for three seconds. It shows whether the opening works.
- **Hold rate:** the share of three-second viewers who kept watching to the later point you chose. It shows whether the rest keeps people.
- **The four boxes:** high or low on each. They are ideas to test, not profit verdicts. The old names Winner and DeadWeight are shorthand for attention only.

## Working rules
- Use only the numbers the user gave you. Never invent a count, a claim or a result.
- Show numerators, denominators and dates. A missing field is not calculable: say so, never fill in a zero.
- Treat any threshold here, such as 30 percent hook and 25 percent hold, as a starting guess the user replaces with their own.
- A campaign change is a proposal, never an action you take.

These rules control the method below. If an example assumes a number, replace it with the user's verified setting.

## Method

0. Before any ad is placed in the matrix, ask the user to set their own high and low cutoffs for hook rate and hold rate. If they have none, propose starting guesses and say they are guesses.
1. Read per-ad impressions, reach, actual link clicks, actual outbound clicks if available, spend, three-second video views, the selected later-view/ThruPlay field, video length and conversion/economic evidence for matched dates. Record each field's current definition, attribution, counting basis and unavailable state. A later-view count from a short video is not automatically comparable with a longer video's retention.

2. Calculate source hook rate as three-second view events divided by impressions; source hold rate as the chosen later-view events divided by three-second view events. Show numerators and denominators. Calculate LinkCTR only from link clicks and OutboundCTR only from outbound clicks. Missing fields or zero denominators are not calculable, never zero-filled or substituted.

3. If showing three-second views divided by reach, label it view-events per reached person. It is not the percentage of unique people who watched: repeated view events can make the ratio exceed 100 percent. A value of 200 percent means two counted events per reached person on that input basis, not 200 percent of people. Validate incompatible counting windows or definitions rather than silently cap the number.

4. Declare the account-specific high/low opening and retention thresholds before placing ads in the two-by-two matrix. Source examples such as a 30 percent hook rate and a 25 percent hold rate are unvalidated starting heuristics, not universal standards. Near a threshold or under-observed data can remain uncertain; a forced binary label does not make the evidence reliable.

5. Interpret the quadrants as creative hypotheses: high opening/high retention suggests the attention sequence is working; high opening/low retention suggests inspecting promise-to-body continuity; low opening/high retention suggests testing a new opening while holding the body; low/low suggests reviewing concept, execution and data quality. Legacy names such as Winner or DeadWeight are attention shorthand, not economic verdicts.

6. Return specific creative tests, such as a new first frame or a clearer transition, grounded in the actual accessible media. Do not assert the exact second of a drop-off without time-series evidence. For static/carousel ads use compatible click/conversion evidence and note that hook/hold video metrics are not applicable. A click-to-sales mismatch has several possible causes; it does not by itself prove a landing-page or audience fault.

7. Budget increases, pauses or reallocation require separate actual conversion volume, tracking, contribution/payback targets, delivery context, uncertainty and owner risk limits. High attention does not establish profit and low attention does not automatically justify a pause. Do not prescribe 20 to 30 percent scaling from the quadrant. A CPM rise has multiple possible causes including auction competition, seasonality, targeting, placement and measurement; it does not prove saturation or a platform penalty.

8. Deliver a metric table with counting notes, quadrant or uncertainty, source evidence, creative hypotheses, ranked tests and review plan. Include evidence gaps and explicit checks not run. Qualitative material findings remain useful when dollar impact cannot be priced. Any campaign change stays a proposal unless currently authorized.

## What you hand back
Use these sections, in this order:
1. **Metric table:** per ad, the numerators, denominators, hook rate, hold rate and counting notes.
2. **Cutoffs used:** the high and low lines, and who set them.
3. **Matrix:** each ad's quadrant, or "unsure" near a cutoff or with thin data.
4. **Creative hypotheses:** one line per quadrant that has ads in it.
5. **Ranked tests:** the tests to run first, each with what changes and what to compare.
6. **Review plan:** when to look again and at what number.
7. **CHECKS MISSED:** any check that failed or could not run, such as a missing later-view count, or "none". Add `MISSING:` for inputs not given.

## Final check

Give the requested deliverables, evidence used, assumptions, missing inputs, and the smallest useful next step. Distinguish an idea, a calculation, a proposed action and a completed tool action.
