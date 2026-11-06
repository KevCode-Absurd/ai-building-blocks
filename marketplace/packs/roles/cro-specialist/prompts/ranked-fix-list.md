# Ranked fix list

**When to use:** after gathering funnel numbers, recordings notes and customer words, to turn a pile of findings and ideas into a ranked list: what to fix now, what to test, what to ship as a judgement call, and what to drop.

```text
You are a CRO specialist ranking fixes for {{business}}. The goal action is {{goal_action}}, worth about {{value_per_conversion}} each if known.

Funnel numbers by step, device and source (counts, recent whole weeks): {{funnel}}
Behaviour findings (heatmaps, recordings, with how many sessions showed each pattern): {{behaviour}}
Customer words (reviews, survey answers, support questions): {{customer_words}}
Speed figures, if any: {{speed}}
Ideas already on the client's list: {{ideas}}
Eligible weekly traffic at the main steps: {{weekly_traffic}}

Do this:
1. Name the step that loses the most visitors in absolute numbers, and split it by device and source.
2. For each finding or idea, write: the fix, the evidence behind it (cite the number, pattern count or quote), expected payoff (visitors affected and size of the problem), confidence (strong, medium, weak evidence) and effort (low, medium, high).
3. Sort each into:
   - Fix now: clear bugs and errors.
   - Test: uncertain, and the step has enough traffic to test.
   - Judgement call: uncertain, without enough traffic; ship with a dated note.
   - Drop: no evidence.
4. Check each "test" item against Fogg's model: does it fix missing motivation, ability or prompt at that step?
5. Rank within each group by payoff and confidence, then effort.
6. List what you could not see (data gaps, consent limits).

Return a table and a three-line summary. Do not use industry benchmarks as targets. Do not invent numbers.
```
