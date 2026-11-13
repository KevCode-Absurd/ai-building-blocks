---
name: recommendation-scorekeeping
description: "Keeps score on the ad and store recommendations an AI agent or team made, so the store learns which kinds of advice actually worked. Uses one plain log the owner can read: what was recommended, the prediction, whether it was done, and what happened to gross profit, judged against what would likely have happened anyway. Grades each one hit, partial, miss, too small to tell or not done, then shows accuracy by recommendation type against a fair base rate, captures the owner's feedback, and turns repeated patterns into written rules the owner approves. Use monthly, or whenever a batch of review dates has passed."
---

# Recommendation scorekeeping

**You get:** a recommendation log CSV grading each past ad and store call against gross profit, an accuracy table by type, proposed rules, and a recommendation on the agent's limits.

Advice is cheap; advice that has been right before is worth acting on. This skill grades every past recommendation on profit, in a log the owner can read in five minutes, and turns what the grades show into rules for the next run.

## When to use

- Monthly, alongside `monthly-store-performance-report`.
- A batch of review dates from the decision log or the change audit log has passed.
- The owner asks "is the AI's advice any good?"
- Before giving an agent wider limits, to see whether its calls earn them.

## Not for

- Making new recommendations: use the skill that made them (`daily-ad-account-review`, `store-meta-budget`, `store-meta-audit`).
- Approving changes: use `ad-change-approval-gate`.
- Reading a designed A/B test: use `store-meta-test`, then log its result here.

## What you need

Required:

1. **The recommendation log**: from `daily-ad-account-review` (decision log) and `ad-change-approval-gate` (change audit log), or any list with date, what was recommended, by whom, and the prediction.
2. **Results after each review date**: the platform export for the affected campaign or ad set, and Shopify orders for the same dates.
3. **Gross profit per purchase** from `store-meta-math`, to grade on profit.
4. **The owner's feedback**: approvals, rejections and any reasons they gave.

Optional: a list of store events in the period (sales, stock-outs, site changes, press), to spot confounders.

Access: level 1 throughout. This skill reads and writes the log only.

## Before you start: the gates

1. **Gross profit per purchase known.** Fail: grade on store-basis cost per purchase only, and mark every grade "not profit-graded". Clicks, CTR and platform ROAS are never the grading metric.
2. **Enough time passed.** A recommendation is graded only after its review date and once refunds for the period have mostly landed: Shopify books refunds on the refund date, so a quick grade can look better than the truth [MEA-0011]. Practitioner default: wait 14 days past the review date for a store with a 30-day return window, or accrue returns at the expected rate.
3. **A prediction exists.** A recommendation with no stated prediction cannot be graded. Log it as "no prediction" and count it in the summary; it is a process failure, not a miss.

## Steps

### 1. Clean the log

One row per recommendation. Fill missing fields from the source logs. Split bundles into rows only if each part had its own prediction. Assign each row a type from a short fixed list:

budget raise, budget cut, pause or cut ad, new ad or concept, bid or cap change, structure change, tracking fix, landing page or offer change, audience or exclusion change, other.

### 2. Measure what happened on profit

For each row that was done: contribution = store-basis purchases x gross profit per purchase minus spend, for the affected campaign or area, in the review window and the same length before the change.

### 3. Estimate what would have happened anyway

A change in a number is not the effect of the recommendation. Use the best available comparison, in this order:

1. **A control:** a holdout, a matched campaign left unchanged, or a test cell.
2. **The rest of the account:** effect = change in the affected area minus change in comparable unchanged campaigns over the same dates, practitioner default.
3. **The prior trend:** the same metric's movement in the 4 weeks before.

Note confounders from the event list. A sale, a stock-out or a site change in the window lowers the grade's confidence. Use a top-down check if the whole store moved: change history, cross-channel shift weighted by spend, then sessions x conversion rate x order value [MEA-0018].

### 4. Set the noise band

Below about 1,000 a day of Meta spend, day-to-day swings are normal [ADC-0064]. Noise band = the typical week-to-week swing of the graded metric over the 8 weeks before the change, practitioner default. An effect smaller than twice the noise band is "too small to tell", not a hit or a miss.

### 5. Grade each row

| Grade | When |
|---|---|
| Hit | Effect outside the noise band, in the predicted direction, size within the predicted range |
| Partial | Right direction, outside the noise band, size well short of or far above the range |
| Miss | Effect outside the noise band, in the wrong direction |
| Too small to tell | Effect inside the noise band |
| Not done | Not approved or not carried out; grade the owner's reason instead (step 7) |

Scale recommendations get one extra check: the marginal cost of the extra sales against break-even, not the average [ADC-0049]. A raise that held average cost but bought its extra sales above break-even is a miss on profit.

Grades come from the arithmetic above, never from a model's opinion. An AI may write the one-line explanation of a grade; it may not choose the grade.

Alerts are graded too. For each monitor threshold (frequency, cost spike, tracking gap), count false alarms (fired, nothing was wrong) and misses (a real problem it did not flag). Many false alarms means loosen or add a waiting period; misses mean tighten.

### 6. Show accuracy by type, against a fair base rate

For each type: count, hits, partials, misses, too small to tell, and hit rate = hits / (hits + partials + misses).

Compare with a fair base rate, not 100%. In well-run testing only about 10 to 20% of tests produce a significant winner [CRO-0012], and a 30 to 35% win rate counts as very good [CRO-0020]. So a 30% hit rate on bold calls can be strong, while a 60% hit rate on "pause clearly broken ad" calls is weak.

Also show calibration when predictions carry a confidence: group rows by stated confidence (low, medium, high) and compare each group's hit rate. High-confidence calls that hit no more often than low ones mean the confidence labels are noise.

Guard against cherry-picking: grade every row, not the memorable ones. Checking the result again and again until it looks good inflates false wins [CRO-0017]; grade once, on the review date's data. Grading on one pre-set metric avoids the inflation that comes with checking several [CRO-0010].

### 7. Capture the owner's feedback

Add three columns: "Owner said" (their words, short), "Answer kind" and "Owner's reason for no". Answer kinds, as logged by `ad-change-approval-gate`: yes; no, wrong diagnosis; right problem, wrong action; already known. They teach different things: "right problem, wrong action" keeps the warning and changes the action, so it must not make the agent ignore the signal; "already known" means the alert is too obvious or too frequent. A no caused by bad data is a data fix, not a grade on the advice. An owner's standing policy ("no raises before a sale") becomes a rule at once, labelled as policy.

### 8. Turn patterns into rules

Propose a rule when at least 6 graded rows of the same type and context point the same way and the type's hit rate sits well away from its base rate, practitioner default; fewer rows make rules from luck. Two kinds:
- **Correction:** the type hits well below its base rate. The rule says what to stop or tighten, and when it does not apply.
- **Keep:** the type hits well above its base rate. The rule names the signals that came before the right calls, so they survive a change of agent or prompt.

Each rule is one line: scope, the rule, the evidence (row IDs), status and review date. Shape, not content: "Budget raises above 30% on ad sets under 50 purchases a week: do not propose; 5 of 7 missed (rows 12, 19, 33, 41, 52)." Rules stay inside this store; never copy them to another business.

Status runs proposed, active (owner said yes), trusted (held through two monthly checks), retired. Each month, check every active rule against the month's rows: still holds, unclear, or contradicted. A contradicted rule, or one that misses twice in a row, goes back to proposed. Keep all rules, any status, in one list at the top of the log.

### 9. Report

Write the summary for the owner: grades this period, hit rate by type against the base rate, total contribution change from hits and misses (with the method), the rules proposed, and one sentence on whether the agent's limits should widen, stay or narrow. Pass any narrowing or widening to `ad-change-approval-gate`.

## Checks before you hand it over

- Every row past its review date has a grade, or a stated reason why not.
- Every grade uses contribution on the store basis, never clicks or platform ROAS.
- Each effect is net of the comparison in step 3, with the comparison named.
- The noise band is shown for each graded metric.
- Hit rates sit beside a base rate from the cards.
- Each proposed rule cites at least 6 row IDs (or is labelled owner policy) and waits for the owner's yes.
- Every grade came from the arithmetic, not from a model's judgement.
- The owner can read the summary and rule list without opening the raw log.

## Output

**Summary, one screen:** rows graded, hit rate by type against base rate, contribution gained and lost from graded calls, the strongest and weakest type, rules proposed, and the limits recommendation.

**File "recommendation-log.csv"** (the owner's log): ID, Date, Source skill, Type, Recommendation, Prediction (metric, direction, range, by when), Confidence, Approved (yes or no), Owner said, Answer kind, Owner's reason for no, Done on, Review date, Contribution before, Contribution after, Comparison used, Effect, Noise band, Grade, Confounders, Lesson.

**Table "Accuracy by type":** Type, Rows, Hits, Partials, Misses, Too small to tell, Not done, Hit rate, Base rate, Contribution effect.

**List "Rules":** ID, Kind (correction, keep, policy), Status (proposed, active, trusted, retired), Scope, Rule, Evidence rows, Approved on, Last monthly check, Review date.

## Common mistakes

- **Grading on clicks or platform ROAS.** Gate 1 grades on contribution.
- **Calling every change an effect.** Step 3 subtracts what would have happened anyway.
- **Grading too early.** Gate 2 waits for refunds [MEA-0011].
- **Treating noise as a result.** Step 4 sets the band [ADC-0064].
- **Expecting most advice to win.** Step 6 compares with a fair base rate [CRO-0012].
- **Rules from one memorable case.** Step 8 needs 6 graded rows and the owner's yes.

## Sources

- ADC-0049: judge scaling on marginal cost.
- ADC-0064: short-window swings are noise.
- CRO-0010: extra metrics inflate false wins.
- CRO-0012, CRO-0020: realistic win rates.
- CRO-0017: repeated peeking inflates false positives.
- MEA-0011: refunds land on the refund date.
- MEA-0018: top-down check when the whole store moved.

What makes this skill ours: every grade on store contribution after subtracting what would have happened anyway; a noise band that refuses to call small moves wins; hit rates read against a fair base rate; and rules the owner approves, backed by row IDs, that retire themselves when they fail.
