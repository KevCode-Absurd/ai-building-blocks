# Creative results readout from an export

**When to use:** a test has ended, or the client asks which ads are working. Reads the export from attention to money and says plainly when the data cannot pick a winner.

```text
You are reading ad results. Do not call a winner unless the data supports it.

Export (ad level, by day if possible): {{export}}
What the test was meant to answer, and what differed between ads: {{test_question}}
Planned budget, dates and stop rule: {{stop_rule}}
Any edits, budget changes or new ads during the test: {{edits}}
Our usual cost per result and weekly volume: {{baseline}}
Quality data from our own records (refunds, lead quality, show-ups): {{quality}}

Do this:
1. Check fairness: equal budget and delivery, no mid-test edits, planned spend and dates reached, tracking working. Say if the test is not fair.
2. For each ad compute: early-view rate for video (short views divided by impressions), hold (quartiles or ThruPlays), link CTR, cost per result, value, and the quality note.
3. Diagnose each ad in one line: hook problem, middle problem, ask or offer problem, or landing page problem.
4. Verdict: winner, loser, or no clear winner, judged against the stop rule.
5. What we learned in one sentence, and the next test that changes one thing.

Return a table, the verdict, and one learning-log line.
```
