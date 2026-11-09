---
name: copy-review-and-test-plan
description: Reviews existing copy (landing page, product page, email or ad) against a 12-point conversion checklist, ranks the problems by likely impact, rewrites the weakest parts, flags claims, reviews or urgency that could mislead, and writes a test plan with a hypothesis, sample size, run time and decision rule, or says plainly when the traffic is too low to test. Use when someone asks why a page is not converting, wants copy improved, asks what to test, or before any copy ships.
---

# Copy review and test plan

Opinions about copy are cheap. This skill turns a review into ranked, fixable problems, rewrites the parts that matter most, and ends with a test the business can actually run, or an honest note that it cannot.

## When to use

- "Why isn't this page converting?"
- "Can you make this copy better?"
- "What should we A/B test?"
- A final check before a page, email or ad goes live.

## What you need

**Access:** level 1 for steps 1 to 6. Level 2 to set up the test in your testing tool without starting it. Level 3 to start it, within the pages, traffic share and dates you set.

- The copy (text, a link the AI can read, or screenshots including the mobile first screen).
- The goal and the action, and where traffic comes from (paste the ad or email that sends people).
- Numbers if there are any: visits, conversions and conversion rate for the last 4 to 8 weeks.
- Any research (VoC bank, reviews, survey answers). Without it, label fixes as hypotheses.

## Steps

1. **Five-second read.** Read only the first screen, as a stranger. Write down what you think it is, who it is for and what to do. If any of the three is unclear, that is problem one.
2. **Score the 12 checks** (0 = missing, 1 = weak, 2 = solid):
   1. Clear what it is and who it is for in the first screen.
   2. Opening matches the reader's awareness stage.
   3. Headline matches the traffic source's promise.
   4. Core promise uses the customer's words, not company words.
   5. Claims are specific (numbers, names, details), not superlatives.
   6. Proof sits beside the claims it supports.
   7. The top doubt is answered near the main button.
   8. Offer and risk reversal are stated plainly.
   9. One primary action; the button names the outcome.
   10. Scannable: headings carry the story on their own; short paragraphs.
   11. No filler, jargon or stock phrases a competitor could share.
   12. Honest: urgency, scarcity, prices and reviews are true, complete and disclosed.
3. **Rank the problems.** Pick the top three by likely impact: first-screen clarity and message match usually come first, then the missing objection answer, then proof, then wording.
4. **Rewrite the top three.** Show before and after, and the reason. Keep the client's facts; do not add claims you cannot prove.
5. **Flag risks.** Any review, testimonial, deadline, stock claim, comparison or "free" that could mislead. Say what would make it compliant (evidence, disclosure, a real end date). This is general practice; for regulated products tell the client to get qualified advice.
6. **Write the test plan.**
   - *Hypothesis:* "Because [research finding], changing [element] to [variant] will raise [metric] for [audience]."
   - *Metric:* one primary (orders, bookings, qualified leads) and one guardrail (refunds, lead quality, unsubscribes).
   - *Sample size per variant:* n ≈ 16 × p(1 − p) / δ², where p is the current conversion rate and δ is the smallest absolute lift worth detecting (Evan Miller's rule of thumb, for about 80% power at 5% significance).
   - *Run time:* total sample divided by weekly traffic, rounded up to whole weeks. Do not stop early because it looks good.
   - *If run time is over about six to eight weeks:* do not A/B test the page. Test the idea where volume is higher (ad headlines, email subject lines), or make the change as a judgement call, note the date, and watch the trend.
   - *Decision rule:* what result means ship, what means keep the control, and what means test again.
7. **Log it.** One line per test in a simple log: date, hypothesis, result, what we learned. At level 3, also log each action taken in the testing tool: what, where, when and the result.

## Checks

- Every score has a one-line reason.
- Rewrites keep the facts and add no unprovable claims.
- The sample size maths is shown, with the inputs.
- The plan says what to do if the test is not feasible.
- Risks are flagged plainly, without legal rulings.

## Output format

1. **Five-second read** (what a stranger would take away).
2. **Scorecard:** 12 checks, score, reason. Total out of 24.
3. **Top three problems**, ranked, with before and after rewrites.
4. **Risk flags.**
5. **Test plan:** hypothesis, metrics, sample size working, run time, decision rule, fallback.
6. **What else to fix later** (short list).

## Example of good output (short)

*Illustrative structure, not a real business: a dog grooming salon with an online booking page. Figures only show the shape: 2,000 visits a month, 4% book.*

**Five-second read:** "Some kind of pet business; I'm not sure if they groom, sit or sell food." Headline is "Pampered Pets, Happy Owners."

**Top problems**

1. **First screen does not say what it is** (check 1 scored 0).
   Before: *Pampered Pets, Happy Owners*
   After: **Dog grooming on [street], booked online in 2 minutes**
   Subhead: Full groom, bath and tidy, or nail trim. Same groomer each visit.
   Why: the reader needs to know it is grooming, where, and how easy booking is.
2. **Top doubt unanswered** (check 7 scored 0). Reviews say anxious dogs are the main worry. Add beside the button: "Nervous dog? Book a free 10-minute meet first."
3. **Proof hidden** (check 6 scored 1). Move two specific reviews about nervous dogs, with owners' permission, next to the booking button.

**Risk flag:** the banner "Offer ends tonight!" has run for three months. Either set a real end date and honour it, or remove it.

**Test plan**

- Hypothesis: because reviews show nervous-dog worry, adding the free meet offer beside the button will raise bookings.
- Metric: completed bookings. Guardrail: no-show rate.
- Sample size: p = 0.04. To detect a lift to 5% (δ = 0.01): n ≈ 16 × 0.04 × 0.96 / 0.0001 ≈ 6,144 per variant, about 12,300 visits, roughly six months. Not feasible.
- To detect a lift to 6% (δ = 0.02): n ≈ 1,536 per variant, about 3,100 visits, about seven weeks at current traffic. Borderline.
- Decision: make fixes 1 and 3 now as judgement calls (low risk, clearly better). Run the free-meet test for seven full weeks; ship it if bookings are higher and no-shows do not rise; otherwise keep the control and test the message in local search ads, where volume is higher.
