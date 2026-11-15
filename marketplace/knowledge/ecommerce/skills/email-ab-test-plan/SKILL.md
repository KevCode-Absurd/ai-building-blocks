---
name: email-ab-test-plan
description: "An email and SMS test plan sized to the store's list: which tests the list can actually read (with the sample-size sum shown), the order to test in (flow delays and offers before subject lines), one decision metric per test, how long each runs, and how to read the result on revenue per recipient after costs, with checks for uneven splits, peeking and attribution windows. Small lists get pooled tests across several sends or flow tests that build up over weeks instead of one-off campaign splits. Platform-neutral, Klaviyo names as the example. Use before running any email or SMS split test, when tests keep ending 'inconclusive', or when subject lines are the only thing ever tested."
---

# Email A/B test plan

**You get:** a ranked test list for the next quarter, each test with its hypothesis, the metric that decides it, the sample needed per variant against what the list can supply, how long it runs, and the reading rule, plus a results log that records gross profit per recipient, not just opens.

## When to use

- The team tests subject lines every week and nothing changes in revenue.
- Tests keep coming back "inconclusive" or flip when re-run.
- A new welcome offer, flow timing or SMS step needs proof before it rolls out.
- The owner asks whether a change "worked" and the only evidence is one campaign.

## Not for

- Store page and checkout tests: use `design-store-ab-test` and `read-store-ab-test-result`.
- Popup offer and trigger tests in detail: use `grow-email-and-sms-list-with-popups` (this skill sizes them).
- Writing the variant copy: use `email-copy-from-store-history` or `write-subject-lines-and-preview-text`.
- Proving email adds sales at all: hold out a share of the list as in step 6, or use `measure-channel-lift-with-holdouts` for channel-level proof.

## What you need

Required (read access, level 1):

1. **Campaign and flow results**, last 90 days: recipients, click rate, placed order rate, revenue per recipient, unsubscribe rate, per send and per flow message.
2. **List sizes** by segment (from `build-klaviyo-segments`) and monthly entrants per flow.
3. **Gross profit per order** and cost per SMS or WhatsApp message.
4. **The attribution window** set in the email tool.

Optional: past test results, the monthly calendar.

If results are missing, run one month of sends unchanged to get a baseline first. Setting up tests needs draft access (level 2); every test send needs the client's yes.

## Before you start: the gates

1. **Baseline known.** Pass when the store has the click rate and placed order rate for the segment or flow being tested. Fail: collect a month of baseline.
2. **Sample possible.** Pass when step 2 shows the list can reach the needed sample in the time allowed. Fail: pool, switch to a flow test, or test a bigger change.
3. **One decision metric.** Each extra metric used to call a winner raises false positives: about 5% with one, 10% with two, 14% with three [CRO-0010]. Pass when one metric is written before launch.
4. **Same attribution for both arms.** Both variants use the same window, with bot clicks and Apple privacy opens excluded [EML-0013].

## Steps

### 1. Rank the test ideas

Rank by expected gross profit: chance of winning x likely lift x gross profit per order x recipients exposed, minus the effort to build [CRO-0013]. In practice, test in this order:

1. **Flow delays.** Changing when a flow message goes often moves orders more than changing its words; a site-abandon email at 4 hours beat 30 minutes on placed orders despite fewer opens [EML-0023].
2. **Offers.** Welcome offer depth, discount versus gift, money versus percent. One apparel brand found 10% to 20% off lifted results a lot and 20% to 30% added nothing [EML-0058].
3. **Flow structure.** Number of messages, SMS added or not, plain-text versus designed.
4. **Campaign content.** Product focus, proof type, length.
5. **Subject lines last.** Opens are inflated by privacy features; judge subject lines on clicks, never opens.

### 2. Size each test

Standard approximation for 80% power at 5% significance, two variants:

Sample per variant = 16 x p x (1 minus p) / d squared

where p is the baseline rate and d is the absolute difference to detect.

| Metric | Baseline p | Lift to detect | d | Per variant |
|---|---|---|---|---|
| Click rate | 2% | 20% relative | 0.4 points | about 19,600 |
| Placed order rate | 0.1% | 20% relative | 0.02 points | about 400,000 |

Revenue per recipient needs even more: in web tests it took about six times the traffic of a conversion-rate test [CRO-0014]. So:

- **Campaign split tests** on lists under about 40,000 engaged contacts can read click rate, not orders. Use click rate to decide, and confirm the order effect by repeating the winner.
- **Flow tests** accumulate: about 1,000 recipients per variant is a practical floor for flow tests [EML-0061]; run them until the sample above is reached for the chosen metric, however many weeks it takes.
- **Pooled campaign tests:** run the same change (say plain-text versus designed) across 4 to 8 sends and pool the results.
- **Form tests:** about 3,000 to 5,000 impressions per variant over 15 days [EML-0061].

### 3. Set the run time

- Flows: at least one full week, in practice two, to cover the weekly cycle [CRO-0015], and until the sample is reached.
- Campaigns: a manual 50/50 split judged on revenue, read after the attribution window closes [EML-0061]. Do not let the tool send the "winner" to the rest of the list after a few hours on opens.
- Decide the end date and sample before launch. Stopping the first time a result looks significant raised false positives from 5% to about 26% in one analysis [CRO-0017].

### 4. Read the result

1. **Check the split.** If one arm got noticeably more recipients than planned, the split is broken; a chi-square check on recipient counts flags it, and a mismatched test should not be trusted [CRO-0007].
2. **Read the one metric.** Win, lose, or no difference at the planned sample.
3. **Put it in money:** gross profit per recipient = placed order rate x gross profit per order after any discount, minus message cost per recipient (SMS and WhatsApp). An offer that wins on orders can lose on gross profit.
4. **Expect most tests to lose or tie.** Only about 10 to 20% of well-run tests produce a clear winner, and claims of huge lifts should be re-tested [CRO-0012].
5. **No difference at full sample** means the effect is smaller than the test could see; stop and move on [CRO-0015].

### 5. SMS and WhatsApp tests

Sample sizes are the same sums; costs differ. Test send time, offer, and SMS versus image MMS (which costs more per message [EML-0024]). Decide on gross profit per recipient after message cost. Where buyers use WhatsApp, test it against SMS for the same journey step only among people opted in to both.

### 6. Hold out a slice for the big question

Attributed email revenue is not proof that email added sales [EML-0056]. Once a quarter, hold out 5 to 10% of a flow's entrants (welcome, post-purchase or win-back) for its whole length, and compare orders per entrant. This answers "does this flow add sales?", which no A/B test between two versions can.

## Checks before you hand it over

- Every test has one written decision metric.
- Each test's sample per variant is shown against what the list can supply.
- Campaign tests on small lists decide on clicks, with order effects confirmed by repeat.
- End date and sample are fixed before launch; no early stopping.
- Both arms use the same attribution window.
- Results are put in gross profit per recipient after message costs.
- Subject lines are never judged on opens.
- No test was sent without a client yes.

## Output

1. **One-screen summary:** the next three tests, why each comes first, the sample each needs and when each will be read.
2. **Test plan sheet:** Rank, Test, Hypothesis, Flow or campaign, Segment, Decision metric, Baseline, Lift to detect, Sample per variant, Available per week, Weeks to run, End date, Owner, Client approval.
3. **Results log:** Test, Dates, Recipients A and B, Split check, Metric A and B, Result (win, lose, no difference), Gross profit per recipient A and B, Decision, Rolled out on.
4. **Holdout log:** Flow, Holdout share, Entrants, Orders per entrant held out and sent, Lift.

## Common mistakes

- **Testing subject lines on opens.** Step 1 puts them last and judges on clicks.
- **Calling winners on a few hundred recipients.** Step 2 sizes every test first.
- **Letting the tool pick a winner in two hours.** Step 3 waits for the window.
- **Peeking and stopping early.** Step 3 fixes the end before launch.
- **Winning on orders, losing on profit.** Step 4 reads gross profit per recipient.
- **Using A/B tests to prove email works.** Step 6 uses a holdout.

## Sources

- CRO-0010: more decision metrics, more false positives.
- CRO-0013: rank tests by expected gross profit.
- CRO-0014: revenue per visitor needs about six times the traffic.
- CRO-0015: run full weeks; inconclusive at full power means stop.
- CRO-0017: peeking inflates false positives.
- CRO-0007: check for sample ratio mismatch.
- CRO-0012: most tests do not win.
- EML-0023: test flow delays first.
- EML-0058: welcome offer depth test.
- EML-0061: minimum email test sizes.
- EML-0013: attribution window and exclusions.
- EML-0024: SMS and MMS cost.
- EML-0056: attributed revenue is not incremental.

What makes this skill ours: every test is sized with the sum shown before it runs, so small lists stop chasing order effects they cannot see; flow timing and offers are tested before subject lines; results are read in gross profit per recipient after message costs; and a separate holdout answers whether a flow adds sales at all.
