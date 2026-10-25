# A/B Test Design Worksheet

**One test per worksheet. Fill every field. Incomplete worksheets = inconclusive tests. Run this before you launch any A/B.**

---

## HEADER

- **Test name:** ___
- **Test ID:** ___
- **Designed by:** ___
- **Date drafted:** ___
- **Launch date:** ___
- **Planned end date:** ___

---

## 1. Hypothesis

**State your hypothesis as a single sentence with a predicted direction.**

Template:
> "If I change ___, then ___ will improve/decrease because ___."

Example:
> "If I change the hook opener from Bold Claim to Confession, then hook rate will improve because Problem Aware buyers respond better to vulnerability than authority."

Your hypothesis:
> ___

---

## 2. The ONE variable

**The golden rule: change exactly ONE variable. Everything else must be identical.**

What is the single variable?
- [ ] Hook (opening line / visual)
- [ ] Caption tactic
- [ ] Voiceover
- [ ] Visual category
- [ ] Copy framework (PAS, Social Proof, etc)
- [ ] Format (static vs UGC vs video)
- [ ] Landing page (LP1 vs LP2)
- [ ] CTA text
- [ ] Offer
- [ ] Audience (LAL-1 vs LAL-3)
- [ ] Placement (Feed only vs Feed+Reels)

**If you checked more than one, you do not have an A/B test. You have a confound.**

Single variable isolated: ___

---

## 3. Variants

### Variant A (control)
Description: ___
Hook / caption / copy (exact): ___
Visual (description): ___
Format: ___
Landing page: ___
CTA: ___
Offer: ___
Audience: ___

### Variant B (challenger)
Description: ___
Hook / caption / copy (exact — DIFFER ONLY ON THE ONE VARIABLE): ___
Visual (description): ___
Format: ___
Landing page: ___
CTA: ___
Offer: ___
Audience: ___

**Diff check:**
| Element | A | B | Same? |
|---|---|---|---|
| Hook | | | |
| Caption | | | |
| Voiceover | | | |
| Visual | | | |
| Format | | | |
| LP | | | |
| CTA | | | |
| Offer | | | |
| Audience | | | |

Only ONE row in this table should say different. Every other row must say same.

---

## 4. Primary metric

**The ONE metric that decides the winner.**

Choose based on what the test variable most directly affects:

| Variable changed | Primary metric |
|---|---|
| Hook (opening line or visual) | Hook rate (3-sec plays / impressions for video; CTR for static) |
| Caption | CTR |
| Voiceover | Hold rate (thru-plays / 3-sec plays) |
| Visual category | Hook rate |
| Copy framework | CTR + CVR (both) |
| Format | ROAS |
| LP | CVR (purchases / LP sessions) |
| CTA | CTR on LP / bounce rate |
| Offer | CVR + AOV |
| Audience | CPA |
| Placement | CPM + CVR |

Primary metric: ___

**Secondary metrics** (watch but do not decide the winner):
- ___
- ___

---

## 5. Minimum detectable effect (MDE)

**How big a change would matter?**

Example: "Hook rate goes from 22% to 26% (an absolute +4 points, or +18% relative)."

MDE for this test: ___

If the result is smaller than your MDE, you have no winner. Ties are ties.

---

## 6. Sample size / spend required

Use a sample-size calculator (or the rule-of-thumb below) to decide how much you need to spend per variant before making a decision.

### Rule-of-thumb by primary metric

| Metric | Min spend per variant | Min conversions per variant |
|---|---|---|
| Hook rate | $200 OR 10,000 impressions | — |
| CTR | $300 OR 15,000 impressions | — |
| CVR | $500 OR 30 purchases per variant | 30 |
| ROAS | $1,000 OR 50 purchases per variant | 50 |
| CPA | $500 OR 30 purchases per variant | 30 |

Minimum spend per variant for this test: $___
Minimum days to reach that spend: ___

---

## 7. Test structure

Pick the testing structure:

- [ ] **Split test (recommended)** — Meta's native A/B test tool. Budget and audience are split evenly. Cleanest.
- [ ] **Same campaign, 2 ad sets** — OK for single-variable creative tests. Let Meta CBO split naturally.
- [ ] **Same ad set, 2 ads** — OK for hook tests only. Meta will preference one quickly, so move fast.

Chosen structure: ___

### Settings
- Budget per variant: $___/day
- Duration: ___ days
- Audience: ___ (same for both)
- Placement: ___ (same for both)
- Bid strategy: ___ (same for both)

---

## 8. What you will do if...

### Variant A wins
[specific action]

### Variant B wins
[specific action]

### No significant difference (tie)
[specific action — usually: accept no winner, try a bigger MDE next time]

### Both underperform vs current best
[specific action — do not adopt either]

---

## 9. Guardrails

- [ ] If CPA on either variant exceeds [X] before reaching minimum spend, pause that variant
- [ ] If total test spend exceeds [Y] without decision, end the test
- [ ] If a variant creates a brand-safety issue (comments, complaints), pause immediately

---

## 10. Learning to log

After the test concludes, document:

1. **Variable tested:** ___
2. **Winner:** ___
3. **Magnitude:** ___ (actual lift vs MDE)
4. **Confidence:** ___ (significant / directional / inconclusive)
5. **New hypothesis unlocked:** ___ (what this result suggests testing next)

**Every test should unlock the next test.** Tests without learning logs are wasted spend.

---

## 11. Anti-patterns

Avoid these:

1. **Testing 3+ variables at once** (not an A/B test, a mess)
2. **Ending the test early** because one variant looks good at day 2 (wait for minimum sample)
3. **Running too many tests at once** (creative diversity gets muddled)
4. **Not documenting the loser** (the loser teaches as much as the winner)
5. **Letting Meta's ad-level budget optimization decide the winner** when you wanted an equal split (use split test tool instead)
6. **Testing within a sale / promo window** (noise overwhelms signal)
7. **Testing on an already-fatigued audience** (results are noisy and mostly about the wrong thing)

---

## 12. Good test examples

- **Hook test:** Same product, same body copy, same LP. Ad A opens with "I was wrong about serums"; Ad B opens with "89% of women see results by day 14". Primary metric: Hook rate + CTR.
- **LP test:** Same ad, same audience. LP A leads with Before/After hero; LP B leads with Ingredient Hero. Primary metric: CVR.
- **Tactic test:** Same product, same visual, same LP. Caption A = Confession; Caption B = Bold Claim. Primary metric: CTR + CVR.

---

## 13. Bad test examples (don't do these)

- Ad A = UGC testimonial with urgency hook on LP1. Ad B = static product image with lifestyle hook on LP2. (Changed 4 variables.)
- Run a test for 2 days and adopt the winner. (Noise.)
- Test two audiences with different creative. (Two variables confounded.)
- "Test" by running 2 ads and letting Meta decide. (That is not a test — that is auction optimization.)

---

## 14. Sign-off

Before launching:

- [ ] Hypothesis is a single testable sentence with direction
- [ ] Exactly one variable differs
- [ ] Primary metric is defined
- [ ] MDE is defined
- [ ] Minimum sample size / spend is calculated
- [ ] Test structure chosen
- [ ] Guardrails set
- [ ] What-if decisions pre-made
- [ ] Launch date + end date on calendar
- [ ] Learning log template ready

Only launch when all 10 boxes are checked.
