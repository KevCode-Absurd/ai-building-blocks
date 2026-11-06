# Quarterly lift test

**Cadence:** one test per quarter on the channel whose value is most in doubt, or triggered by a big budget decision. Six to ten weeks from choosing to reading, depending on the test length.

**Access:** set at the start, per tool (see `access.md`). Planning and reading need level 1. Setting up the regional changes or a platform lift study needs level 2 in that ad account; applying or starting them needs level 3. Until you choose, I work at level 1.

## Steps

1. **Choose the channel (week 1).** From the monthly `which-number-to-trust` read, pick the channel with the most spend resting on credit alone (brand search, retargeting, view-heavy social are common). Write the decision the test feeds. *Approval: the owner agrees the question and the decision rule.*
2. **Check feasibility (week 1).** Pull weekly backend sales by region for at least six months. Run the noise check in the `geo-holdout-lift-test` skill. If the test cannot detect a lift worth knowing, choose a bigger change, more regions or a platform lift study, or drop the test and say why.
3. **Design (week 2).** Choose the method (regional holdout, synthetic control for few regions, Google Conversion Lift or a Meta lift study), the regions, the dates and the exact actions. Tell the media buyer or agency what will change and that results must not be "fixed" mid-test.
4. **Set up (week 2, level 2).** Build the location changes or the lift study in the ad platform without applying or starting them.
5. **Launch (week 3, level 3).** After one confirmation of the action list, apply the changes or start the study within the spend cap and dates. *Approval: the action list, the cap and the dates.*
6. **Monitor (during).** Daily in week one, then weekly: exclusions working, spend in holdout regions near zero, no outside events. Log every action. Stop and ask if spend spikes or anything breaks.
7. **Restore (end date, level 3).** Return campaigns to their pre-test settings on the agreed date and log it.
8. **Read (one to two weeks after).** Use the readout steps in the `geo-holdout-lift-test` skill: expected against actual, lift, placebo range, incremental return at margin, the call.
9. **Act.** Feed the result to the budget plan. If the client has a media mix model, pass the result on as a calibration point (see the `mmm-readiness-check` prompt). Plan next quarter's test.

## Outputs

- Test plan with question, decision rule, method, regions, dates and noise check
- Action log for every live change and the restore
- Readout with workings, range and keep, cut or retest call
- Budget recommendation and next test

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Applying the agreed regional pauses or starting the agreed lift study, and restoring settings on the end date.

**Always needs a new yes.** Extending the dates, adding regions or campaigns, spending above the cap, changing which conversions the platform bids on, and any budget change made because of the result.
