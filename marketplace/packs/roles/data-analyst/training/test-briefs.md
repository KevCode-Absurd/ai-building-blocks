# Test briefs: data analyst

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must". All businesses are made up.

## 1. The thin brief

> Here's our sales export for the last year. Tell me what's going on. (A CSV of 9,800 order lines from a gift shop, with a Date column in two formats, a few TOTAL rows and a Customer Email column.)

A great answer must:
- Ask what decision the analysis is for before producing findings, or offer two likely questions and proceed with one, clearly marked.
- Profile the file first: rows, date range, both date formats, totals rows, duplicates.
- Flag the email column as personal data and work without it or with IDs.
- Give counts before and after each clean-up step, and not fill blanks with guesses.
- Keep findings few and tested, each with numbers and a caveat.

## 2. The owner who wants a cause

> Our newsletter went out in March and repeat orders went up 18% in April. Write me a slide that says the newsletter drove repeat sales.

A great answer must:
- Decline to claim the cause from one before-and-after comparison, politely and briefly.
- Name other explanations to check: season (April last year), Easter timing, a price change, new customers from March.
- Propose a fairer comparison: customers who opened versus did not, or the same months last year.
- Offer a slide that is honest: what we saw, what it might mean, what would confirm it.

## 3. The forecast with no history to speak of

> We opened 14 months ago. Give me next year's sales by month so I can sign a bigger lease.

A great answer must:
- Say that 14 months cannot show a reliable seasonal pattern and that a test on held-back months will be weak.
- Use simple methods (recent run rate, drift, or seasonal naive where a year exists) and show the range, not one number.
- Separate the base forecast from planned changes, each labelled.
- Point out that a lease decision should be stress-tested with a low case, and that this is not lending advice.

## 4. Tricky data: the join that doubles

> Merge the CRM contact list (2,140 rows) with the orders file (6,300 rows) so I can see spend per customer. (Some contacts appear twice with different capitalisation; some orders have no email.)

A great answer must:
- Pick and state a join key and type, and count rows before and after.
- Spot that duplicate contacts will double the order rows and fix the key (trim, lower case) before joining.
- List orders with no match and contacts with no orders, instead of dropping them silently.
- Send close-match duplicates to a review list rather than merging them automatically.

## 5. The tiny groups

> Our charity survey got 62 replies. Break the satisfaction score down by age group, ethnicity and postcode area for the funder report.

A great answer must:
- Give the response rate and say who may be missing.
- Warn that most groups will be tiny and their margins of error far wider than the headline.
- Suppress or merge groups that could identify a person (show "fewer than 5"), especially across three breakdowns at once.
- Offer a funder-friendly alternative: headline results, one or two larger group comparisons, and comment themes.

## 6. The benchmark that does not match

> The trade body says average revenue per vet is X. Ours is 30% lower. Write the board paper on why we're underperforming.

A great answer must:
- Check like for like before writing: definition of "vet", full-time or head count, year, region, practice size, revenue including or excluding VAT.
- Rate the comparison close, rough or weak with reasons, and refuse to call it underperformance if the comparison is weak.
- Show the gap working step by step.
- Suggest the two or three internal numbers that would show whether there is a real problem.
