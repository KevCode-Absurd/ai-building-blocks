---
name: model-and-ai-claim-review
description: Reviews a model, score or AI accuracy claim (fraud app, lead score, churn prediction, a vendor's "98% accurate") for a business decision - writes down the decision and the cost of each mistake, explains how the model works in plain words, rebuilds the confusion matrix from counts, recomputes accuracy, precision, recall and false alarm rate, reruns them at the client's own volume and base rate, prices the mistakes, checks threshold, calibration, leakage, drift and results by group, compares a simple rule, and ends with rely, use with a check, or do not rely, plus questions for the vendor. Use it before buying or renewing an AI tool, or when a team does not trust a score.
---

# Model and AI claim review

## When to use

- A vendor pitch with an accuracy, precision or "AI-powered" claim.
- A fraud, churn, lead or risk score the team uses but does not trust.
- A results table (counts of hits, misses and false alarms) that needs reading.
- Deciding whether a model is worth its fee, or whether a simple rule would do.

Not for: building or training production models (AI engineer), legal advice on AI or discrimination law, or making credit, insurance, health or hiring decisions about people.

## What you need

1. **The decision the model feeds** and what happens to a flagged case (blocked, reviewed, offered a discount, called).
2. **The cost of each mistake** in the client's terms: a miss (fraud that gets through, a churner not contacted) and a false alarm (a good order cancelled, a discount wasted).
3. **The claim or the counts:** a vendor page, a results table, or the model's flags and outcomes for a recent period.
4. **The client's volume and base rate:** cases per month and how many are really positive.
5. **Any group information** if the model scores people, and the client's reason for holding it.
6. **Access:** level 1 to read the tool's reports or exports. Changing a threshold or rule in the live tool is level 3, within the limits you set.

## Steps

### 1. Write down the decision and the costs

One line each. If the client does not know a cost, give a range and show how the answer changes across it.

### 2. Explain the model in plain words

What goes in, what comes out (a label, a score, a probability), how the cut-off is set, and when it was last trained. If the vendor will not say what goes in, note it as a risk.

### 3. Build the two-by-two table

From the counts: caught (true positives), missed (false negatives), false alarms (false positives), correct passes (true negatives). Then show each sum:
- Accuracy = (caught + correct passes) ÷ all.
- Precision = caught ÷ all flagged.
- Recall = caught ÷ all real positives.
- False alarm rate = false alarms ÷ all real negatives.
- Base rate = all real positives ÷ all.
Also work out the accuracy of a model that never flags anything. If it beats or matches the model, say so.

### 4. If there is only a claim, list what it leaves out

Base rate in the test data, test period, whether testing came after training, the threshold, the counts, results by segment and a baseline. Turn each gap into a question.

### 5. Rerun on the client's numbers

Apply the model's recall and false alarm rate to the client's monthly volume and base rate. Precision will fall if the client's base rate is lower than the vendor's test data. Use natural frequencies: "of every 100 orders flagged, about N are real fraud".

### 6. Price the mistakes

Cost with the model = misses × miss cost + false alarms × false alarm cost + fee. Compare with no model and with a simple rule. Then try other actions on a flag (manual review instead of automatic cancel) and other thresholds if the score allows, and pick the cheapest.

### 7. Check calibration and ranking (scores and probabilities)

Group cases into bands (deciles if volume allows) and compare the average score with the real rate in each band. If "70%" cases are positive far less than 70% of the time, the score ranks but is not a probability.

### 8. List the weak points

- Test data unlike the client's (another country, season, product mix).
- Small samples behind the claim.
- Leakage: a feature that is only known after the outcome, or a random split on time-ordered data.
- Drift: when it was last checked against new outcomes.
- A threshold set for another business's costs.

### 9. Check results by group (if the model scores people)

Where the client lawfully holds group data, compare selection rates, recall and false alarm rates by group, with the counts. Flag gaps and small groups. Any legal question goes to the client's adviser; run the `responsible-ai-risk-check` skill for a fuller review.

### 10. Try a simple rule

From the client's own data, a few clear rules (order value over X and new customer and mismatched address, for example), tested on the same period. Report how much of the model's benefit the rule gets.

### 11. Verdict and questions

Rely on it, use it with a check, or do not rely on it, and why, in three sentences. Then at least five questions for the vendor or analyst, each answerable with numbers.

## Checks

- Every rate is recomputed from counts, with the sum shown.
- The base rate and the "never flag" accuracy are stated.
- Costs come from the client; ranges are tested where unknown.
- No accuracy figure is invented or assumed.
- Each term is defined once.
- Group results show counts, and small groups are flagged.
- The verdict follows from the costs, not from the accuracy headline.

## Output format

1. **Verdict** (one line) and the reasons.
2. **The decision and costs.**
3. **How it works,** in plain words.
4. **The table and rates,** with sums.
5. **On your numbers:** monthly outcomes and money, versus no model and a simple rule.
6. **Weak points** and group results.
7. **Questions to ask.**

## Example of good output (short)

*Made-up business: Copperleaf Outdoor, an online shop. One month of the fraud app's results, as counted by the client.*

> **Verdict: do not rely on automatic cancels; use the flags for a manual check.**
>
> | | Really fraud | Really fine |
> |---|---|---|
> | Flagged | 12 caught | 68 false alarms |
> | Not flagged | 6 missed | 3,914 correct passes |
>
> Accuracy = (12 + 3,914) ÷ 4,000 = 98.2%. But a "never flag" rule scores 99.6%, because only 18 of 4,000 orders (0.45%) were fraud. Precision = 12 ÷ 80 = 15%: of every 20 flagged orders, 3 are fraud. Recall = 12 ÷ 18 = 67%.
>
> **Money (your costs: $90 per chargeback, $35 per wrongly cancelled order).** With auto-cancel: 6 × $90 + 68 × $35 = $2,920 a month before the app fee. With no app: 18 × $90 = $1,620. With a 3-minute manual check on flagged orders (your estimate $3 each): 6 × $90 + 80 × $3 = $780.
>
> **Ask the vendor:** the base rate in their test data; whether the test period came after training; the threshold and whether you can change it; results for shops of your size; how often the model is retrained.
