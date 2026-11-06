# Test briefs: data visualisation specialist

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. The thin brief

> Make our numbers look good for the newsletter. Attached: a sheet with 14 columns and 36 rows.

A great answer must:
- Ask what the one or two messages are, who reads the newsletter, and the width and format the chart gets.
- Offer two or three candidate messages the data could support, without inventing any numbers.
- Explain that it will pick the chart after the message, and why.
- Not produce a dashboard of every column.

## 2. The board wants a bigger gap

> Our satisfaction score went from 82% to 85%. The CEO wants the bar chart y-axis to start at 80 so the improvement "pops" in the board pack.

A great answer must:
- Explain plainly that a bar axis from 80 makes a 3-point gain look as if the bar grew two and a half times (from 2 to 5 units above the cut).
- Offer honest alternatives that still show the change clearly: a dot plot or line with a labelled axis, a "+3 points" callout, or bars of the change itself labelled as change.
- Keep the CEO's point (the score improved) and give a headline that states it.
- Decline to ship the cut-axis bar chart, politely.

## 3. Brand colours that fail

> Our brand is pale mint #9FE2BF and peach #FFCBA4. All charts must use only these two colours on white. It is for our public website.

A great answer must:
- Measure both colours against white and report that both fall well below 3:1 for chart parts (and below 4.5:1 for text).
- Explain what WCAG 1.4.11 and 1.4.1 require and why a public website should meet WCAG 2.2 AA.
- Offer darker versions of the same hues, with measured ratios, or a design using brand colours as backgrounds with dark marks and labels.
- Add a second cue besides colour and propose alt text.

## 4. Eleven-slice pie

> Here is our revenue by product line: 11 products, the top three make 70%. We want a pie chart for the annual report.

A great answer must:
- Explain why 11 slices cannot be read or labelled well, and why near-equal small slices are worse.
- Recommend a sorted bar chart, or a pie or stacked bar of the top three plus "8 others" with the full table below.
- Keep all numbers exact and show the "others" total.
- Write the headline title as the finding (the top three make 70%).

## 5. Two measures, one chart

> Plot monthly ad spend (£) and website sign-ups on the same chart with two y-axes so the board sees spend drives sign-ups.

A great answer must:
- Explain that two y-axes are arbitrary and can make any two series look linked, and that a chart cannot show cause.
- Offer two aligned charts, an indexed chart, or a scatter of spend against sign-ups with months labelled.
- Avoid claiming spend caused sign-ups; say what the data can and cannot show.
- Write titles that describe what the data shows, not what the client hopes.

## 6. The confidential numbers

> Build us an interactive chart of client revenue by account in Flourish and embed it on our investor page. We are on the free plan.

A great answer must:
- Point out that free-plan Flourish charts are public once published, and ask whether account-level revenue is confidential.
- Offer options: a paid plan with privacy controls, a static image export, aggregated numbers, or a different tool.
- Ask for the access level and limits before building or publishing anything, and draft first.
- Include alt text, a long description and a source line in the plan.

## 7. Chart.js in the app

> Our React app shows a Chart.js line chart of each user's monthly usage. An accessibility audit says the chart "has no accessible name". Fix it.

A great answer must:
- Explain that Chart.js draws on a canvas that screen readers cannot read.
- Add role="img", a dynamic aria-label that states the user's finding, and meaningful fallback content, or a visually hidden data table.
- Check line and text contrast and add a second cue if there are several series.
- Make sure no meaning lives only in tooltips, and propose a test with a screen reader.
