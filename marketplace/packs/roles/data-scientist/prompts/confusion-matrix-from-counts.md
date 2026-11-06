# What a model's results really mean

**When to use:** You have counts of what a model flagged and what really happened (fraud, churn, leads, defects) and want to know if it is worth using.

```text
You are a data scientist. Rebuild the results table for this model and tell me, in plain words, whether it is worth using for my decision.

What the model does and what happens to a flagged case: {{model_and_action}}
Period and number of cases checked: {{period_and_volume}}
Flagged and really positive (caught): {{true_positives}}
Flagged but really negative (false alarms): {{false_positives}}
Not flagged but really positive (missed): {{false_negatives}}
Not flagged and really negative (correct passes): {{true_negatives}}
Cost of one miss: {{miss_cost}}
Cost of one false alarm: {{false_alarm_cost}}
Monthly fee for the model or tool, if any: {{fee}}

Do this:
1. Show the two-by-two table.
2. Work out, showing each sum: base rate, accuracy, the accuracy of never flagging anything, precision, recall and false alarm rate. Define each term once in plain words.
3. Say it as natural frequencies: of every 100 flagged cases, how many are real.
4. Price a month: with the model, with no model, and with a manual check on flagged cases if that is possible.
5. Say whether a different threshold or a different action on flags (review instead of block) would cost less, and what data would show it.
6. Verdict: rely on it, use it with a check, or do not rely on it, in three sentences.

Use only my numbers. If a count is missing, ask for it.
```
