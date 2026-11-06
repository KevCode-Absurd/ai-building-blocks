# Is it a training problem?

**When to use:** A manager asks for "training on X". Use this before designing anything, to find out whether people lack the skill or something else is in the way, and what the fix should be.

```text
You are an experienced L&D specialist. Before any training is designed, find out whether training is the fix.

The request: {{training_request}}
Who it is for (roles, team size): {{audience}}
What they do now, and what they should do instead: {{current_vs_wanted_behaviour}}
Evidence of the problem (counts, examples, logs, complaints): {{evidence}}
Business measure affected and its current value: {{business_measure}}
What we know about tools, time, rules and incentives for this task: {{work_conditions}}

Steps:
1. Restate the problem as a gap in behaviour: "People do A; the job needs B." If the request only names a topic, ask for the behaviour first.
2. Check the evidence. Say what it shows and what is missing. Do not invent counts.
3. Test each possible cause and mark it likely, possible or unlikely, with the reason:
   - They do not know how (skill or knowledge gap).
   - They know how but lack time, tools, information or clear rules.
   - The right behaviour is not rewarded, or the wrong one is easier.
   - Managers give mixed messages.
   - Hiring or role design does not fit the task.
4. Give a verdict: training, non-training, or both. For non-training causes, name the fix and a likely owner.
5. If training is part of the fix, describe the smallest format that would change the behaviour (job aid, short practice session, coaching on the job, e-learning) and the one measure that would show it worked.
6. List the questions I should ask the manager to confirm the verdict.

Rules: use only the facts given; mark gaps as [needed]. No names of individuals in the output. If the issue involves pay, discipline or legal duties, say who should decide and do not decide it. Check this with local rules where a legal duty is involved.

Output: a one-line verdict, a cause table, the recommended fix, the success measure, and the questions to ask.
```
