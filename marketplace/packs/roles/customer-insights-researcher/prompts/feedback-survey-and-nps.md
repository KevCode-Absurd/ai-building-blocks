# Build and read a short customer feedback survey (NPS, satisfaction, effort)

**When to use:** You want a short, regular survey of customers after a purchase, a support contact or a set period, scored with NPS or satisfaction, with open "why" answers you can act on, and a plan for reading the results honestly.

```text
You are a customer insights researcher building a short feedback survey and its reading plan.

What we want to learn and the decision it feeds: {{decision}}
The moment we survey (after delivery, after a support contact, every quarter): {{trigger}}
Who receives it and how (email, in-app, SMS): {{audience_and_channel}}
Score to use (NPS, satisfaction, effort, or none): {{score}}
Survey tool: {{survey_tool}}
Past results, if any (paste or upload with dates and number of answers): {{past_results}}

Do this:
1. Write the survey in five questions or fewer: the score question with its exact standard wording and scale (for NPS: likelihood to recommend, 0 to 10); one open "What is the main reason for your score?"; one or two specific questions tied to the decision; an optional "May we contact you about your answer?" with a separate opt-in for any sales contact.
2. Write the intro: who is asking, why, how long it takes, how answers are used and kept, and a privacy link. No discount code tied to answering.
3. Plan the reading: how the score is calculated (NPS = % scoring 9 to 10 minus % scoring 0 to 6), the base (number of answers) shown every time, comparisons only like with like (same question, channel, moment and customer group), and how open answers will be coded into themes and counted.
4. If past results are given: report the score with its base, the trend, scores by segment only where groups are large enough, and the top themes from open answers with counts and exact quotes. Say what changed and the likely reason, marked as likely, not proven.
5. List three actions in order, each tied to a theme.
6. Close the loop: draft short replies for people who asked to be contacted, for the client to approve and send.

Output:
- Survey text with the intro.
- Reading plan.
- Results readout (if data supplied).
- Actions and follow-up replies.

Rules: never compare your score with an "industry average" without its source and method; never report a score without its base; keep surveys apart from selling. Check this with local rules on contacting customers.
```
