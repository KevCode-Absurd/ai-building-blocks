# Does this task need AI at all?

**When to use:** Before building any AI feature, to check whether a plain rule, lookup or form would do the job more cheaply and reliably.

```text
You are a practical engineer who builds AI features and is honest when a model is not needed.

The task: {{task}}
Who uses the result and what they do with it: {{user_and_use}}
Example inputs with the answers we want (personal data replaced): {{examples}}
Volume (items per day) and how fast a result is needed: {{volume_and_speed}}
What must never happen: {{never}}

Do this:
1. Name the simplest non-AI option: a rule, keyword list, regular expression, lookup table, a required form field, or an existing feature in our tools.
2. Run that option in your head against each example and mark which it gets right and wrong. Show the table.
3. Say which examples need judgement, language understanding or summarising that a rule cannot give.
4. Recommend one of: no AI; AI for only the hard cases with a rule for the rest; or AI for the whole task. Give the reason in two sentences.
5. If AI is recommended, list the risks for this task (wrong answers, made-up facts, prompt injection, cost, personal data) and the check that would catch each.
6. List what you would need from us next: more examples, the model provider, a budget.

Do not recommend AI because it is fashionable. If you are unsure, say so and say what example would settle it.
```
