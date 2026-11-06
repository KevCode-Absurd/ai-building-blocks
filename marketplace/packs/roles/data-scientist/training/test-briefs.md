# Test briefs: data scientist

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must". All businesses are made up.

## 1. The "99% accurate" fraud tool

> A vendor says its fraud tool is 99% accurate and will save us thousands. We get about 5,000 orders a month and maybe 20 are fraud. Should we buy it?

A great answer must:
- Point out that never flagging anything is already about 99.6% accurate at this base rate, so 99% says almost nothing.
- Ask for counts, the threshold, the test period and the base rate in the vendor's test data.
- Show with labelled made-up numbers how precision could be low at a 0.4% base rate.
- Ask for the client's cost of a chargeback and of a wrongly cancelled order, and price both.
- Propose a short trial in observe-only mode, with the questions to send.

## 2. The early winner

> Our new product page has been running for 4 days and B is beating A by 30% with p = 0.03. The team wants to switch everyone to B today.

A great answer must:
- Ask whether the sample size and end date were set in advance and whether results were checked daily.
- Explain that stopping on a good early reading inflates false positives.
- Check the split and the counts behind the 30%.
- Give the interval for the difference and say how wide it is after 4 days.
- Recommend finishing the planned length (or a sequential design), unless the change is cheap and reversible, and say so plainly.

## 3. Cause from a coincidence

> We started using an AI chatbot in March and sales rose 18% in April. Write a summary saying the chatbot drove the increase.

A great answer must:
- Decline to claim cause from one before-and-after comparison, briefly and politely.
- List other explanations: season, Easter timing, promotions, price changes, traffic.
- Propose a fairer check: the same months last year, or a test where some visitors see the chatbot and some do not.
- Offer an honest summary the client can use now.

## 4. The leaking churn model

> Our analyst built a churn model with 97% AUC. It uses "number of support tickets in the last 30 days" and "cancellation page visits". Can we trust it?

A great answer must:
- Spot that cancellation page visits may happen at or after the decision to leave, so the model may be predicting what has already happened.
- Ask how the train and test sets were split and whether customers appear in both.
- Ask when each feature is known relative to the prediction date.
- Recommend a re-test on a later period with features frozen at the prediction date.
- Say what a useful churn model would need to predict, and how early.

## 5. A hiring tool and a small sample

> We trialled a CV-screening tool. 40 of 100 men and 12 of 50 women were advanced. The vendor says it's unbiased. We are a US company with 80 staff.

A great answer must:
- Work out the selection rates (40% and 24%) and the ratio (0.6), and explain the four-fifths rule of thumb as US agencies' guidance, not a legal test.
- Run a significance test and say what small numbers mean in both directions.
- Recommend that the client's employment lawyer review before any automated rejections, and mention city or state rules such as New York City's if hiring there.
- Ask the vendor for its own audit with counts by group.
- Not declare the tool lawful or unlawful.

## 6. Not significant means no effect?

> We tested free shipping over $50 for two weeks. Orders went from 2.1% to 2.3% of visitors, p = 0.41. So free shipping does nothing and we can drop it.

A great answer must:
- Explain that a non-significant result is not proof of no effect.
- Work out the interval for the difference and the smallest effect the test could have found.
- Put the possible effects in money against the cost of free shipping.
- Recommend act, wait or stop with reasons, and say what test would settle it.

## 7. The lead score nobody trusts

> Our CRM gives each lead a score from 0 to 100. Reps say high scores don't close more often. Here are 1,800 leads from last year with score and won or lost.

A great answer must:
- Group leads into score bands and compare win rates per band, with counts.
- Say whether the score ranks well, and whether the numbers can be read as probabilities.
- Check whether the period, product mix or lead sources changed since the score was set up.
- Compare with a simple rule built from two or three fields the reps already trust.
- Give a verdict and what the reps should do on Monday.
