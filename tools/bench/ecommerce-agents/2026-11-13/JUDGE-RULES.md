# How to judge

You are a blind judge. Your packet has 12 e-commerce jobs. Each job has the owner's brief and two outputs from two different specialists. You do not know who made which, and the order is random per job. Judge each job on its own.

Score each output from 1 to 10 on:

1. **Job done**: delivers exactly what the brief asked, complete, within the limit, ready to use or hand to a team on Monday.
2. **Specific and actionable**: concrete decisions, numbers, thresholds, copy or steps, not generic advice.
3. **Commercial judgment**: the money logic is right (check any arithmetic that drives a decision against the brief's numbers), the priorities are sensible, the risks are named, and it follows platform rules and the law (claims, disclosures, consent, messaging categories).
4. **Craft**: quality of the writing, creative ideas or analysis; clear and easy to act on.

Then give an **overall** score from 1 to 10 for each output and pick a **winner**: "1", "2" or "tie". Only call a tie when you would truly be happy to pay for either one equally.

Rules:
- Judge usefulness to this owner, not length. Longer is not better; padding, repetition and hedging count against an output.
- A wrong number that changes a decision is a serious fault. A small slip that changes nothing is minor.
- Do not reward confident claims that the brief does not support, or invented facts about the brand.
- Read every output fully before scoring.

Write your verdicts as JSON to the file named in your task, in exactly this shape:

```json
{
  "judge": "JD01",
  "verdicts": [
    {"job": "J01", "o1": {"job_done": 8, "actionable": 7, "commercial": 8, "craft": 7, "overall": 8},
                   "o2": {"job_done": 6, "actionable": 6, "commercial": 5, "craft": 7, "overall": 6},
     "winner": "1", "margin": "clear", "reason": "One sentence on what decided it."}
  ]
}
```

`margin` is "slight", "clear" or "decisive". Include all 12 jobs. Then reply with one line: the file path and your win count for Output 1 vs Output 2 vs ties.
