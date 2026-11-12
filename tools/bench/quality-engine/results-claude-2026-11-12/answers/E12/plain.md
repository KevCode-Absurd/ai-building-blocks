# Decision memo: End-of-lesson recap screen

**Team:** Learning
**Decision needed:** Ship the recap screen to all learners, or not
**Note:** All figures are hypothetical exercise numbers, not Duolingo data.

## Summary

- **Recommendation: Don't ship as built. Run one follow-up test (described below) before deciding.**
- Day-7 retention rose slightly (54.1% to 54.6%). The reported p = 0.08 doesn't meet our usual bar, and that p-value needs checking: at 400,000 learners per arm, a simple test would put this gap far past significance.
- Lessons per learner per week fell 4.5% (11.2 to 10.7). That's the clearest effect in the test, and it's a cost.
- Most learners (63%) skipped the recap. Among those who viewed it, accuracy on the missed words rose from 71% to 79% in the next session. That figure doesn't yet prove the recap caused the gain, because we have no control comparison for it.
- Shipping now would lock in a known engagement loss in exchange for a learning gain we haven't shown. Not shipping costs us little, since the feature can come back once we have better evidence.

## The result

| Metric | Control | Test | Change |
|---|---|---|---|
| Day-7 retention | 54.1% | 54.6% | +0.5 pts (p = 0.08, as reported) |
| Lessons per learner per week | 11.2 | 10.7 | −0.5 (−4.5%) |
| Recap skip rate | — | 63% | — |
| Next-session accuracy on missed words (viewers only) | — | 71% → 79% | +8 pts, within group |

The test ran for four weeks with 400,000 learners in each arm.

## How to read each metric

**Day-7 retention.** A 0.5-point gain would be worth having. But the reported p-value doesn't fit the sample size. With 400,000 learners per arm and a rate near 54%, the standard error of the difference is about 0.11 points. That would make a 0.5-point gap roughly 4.5 standard errors from zero, with p well below 0.001. A p of 0.08 suggests the analysis was different from a plain comparison of proportions. It might use clustering, a variance correction, a sequential-testing adjustment, or a smaller analyzed group (for example, only learners who joined in week one). Before anyone cites this number, we should confirm which method was used. Until then, treat retention as "possibly slightly up, not confirmed."

**Lessons per learner per week.** This is the most reliable result. A 4.5% drop across 400,000 learners is very unlikely to be noise, though we should confirm the variance. Two explanations matter:

- *Time cost.* The recap adds a screen to every lesson. If learners keep a fixed daily time budget, they finish fewer lessons. If so, total minutes might be flat and the loss is partly a counting effect.
- *Friction.* An extra screen at the moment of finishing may make "one more lesson" less likely. That is a real engagement loss.

We can tell these apart by checking minutes per learner, and by splitting the lesson drop between learners who viewed recaps and those who skipped them. If skippers also lost lessons, even a skippable screen is costing us.

**Skip rate.** 63% skipping means most learners don't value the recap as built. Whatever benefit exists reaches about a third of the test arm. It also means the average effect on the whole arm is diluted.

**Accuracy among viewers.** This is the most encouraging number and the weakest evidence. Three problems:

1. *No control comparison.* We measured the same learners before and after. We didn't compare control learners' next-session accuracy on *their* most-missed words.
2. *Regression to the mean.* By design, these are the words a learner got wrong most. Accuracy on the worst words tends to rise next time anyway, through practice, spaced review, or simple luck in the first session.
3. *Self-selection.* Learners who chose to view the recap may be more motivated. They'd likely improve faster with or without it.

The real effect could be the full 8 points, a fraction of it, or close to zero. We can't tell from this test.

## The trade-off between learning and engagement

This test puts two goals in tension. The recap aims to help people learn: show the missed words and reinforce them. The cost shows up in engagement: fewer lessons, which feeds streaks, XP and the habits that keep people coming back.

We shouldn't treat the lesson count as sacred. If learners do 4.5% fewer lessons but remember more, that may be a good trade. But that argument only holds if the learning gain is real and lasting. Right now we have a measured cost and an unmeasured benefit. The burden of proof sits with the learning claim.

There's also a middle path. The value of the recap is putting missed words back in front of the learner. That doesn't have to happen on an extra screen at the end of a lesson. It could happen inside the next lesson, as practice. That might keep most of the learning value without the friction.

## Risks

**If we ship now:**
- We lock in a roughly 4.5% drop in lessons per week across all learners. That could affect streaks, leaderboard activity and long-term retention in ways a 4-week test can't show.
- We'd be claiming a learning win we haven't proven. If it turns out to be regression to the mean, we'd have paid an engagement cost for nothing.
- A screen most people skip adds clutter to the moment that should feel most rewarding.

**If we don't ship:**
- If the learning gain is real, we delay a benefit for the third of learners who use the recap.
- We may give up a small retention gain, if the 0.5-point lift holds up.
- The team may read "not shipped" as "learning features lose to engagement." We should be clear that this is about evidence, not priorities.

Not shipping is the cheaper mistake to make. It's fully reversible, and a follow-up test costs a few weeks.

## Recommendation

Don't ship the recap as built. Before the next test, do three things:

1. Confirm how the retention p-value was calculated.
2. Break down the lesson drop by viewers vs. skippers, and check minutes per learner.
3. Compute next-session accuracy on most-missed words for control learners, so we have a real baseline for the 71% → 79% figure.

If step 3 shows a clear learning gain over control and step 2 shows the lesson drop is mostly a time effect, we should reconsider shipping. Otherwise, move to the follow-up test.

## Follow-up test

**Design:** Three arms, about 4–6 weeks, randomized at the learner level.

- **A. Control:** no recap.
- **B. Current recap:** end-of-lesson screen, as tested.
- **C. Built-in review:** no extra screen. The three most-missed words return as exercises early in the learner's next lesson.

**Primary metric:** next-session accuracy on each learner's most-missed words, compared across *all* learners in each arm, not just those who viewed a recap. That removes both self-selection and regression to the mean.

**Guardrails:**
- Lessons per learner per week: no more than a 1% drop vs. control
- Minutes per learner per day
- Day-7 and day-14 retention

**Also measure:** accuracy on the same words a week later, to see whether the gain lasts. Split results by new vs. experienced learners and by baseline accuracy. The recap may help struggling learners most, which would support a targeted launch.

**Decision rule:** Ship arm C if it beats control on learning and stays inside the lesson guardrail. Ship arm B only if it clearly beats C on learning. Ship neither if no arm beats control on learning.
