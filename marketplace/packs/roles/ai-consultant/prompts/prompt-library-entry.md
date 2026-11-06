# Build and test one entry for a team prompt library

**When to use:** You are building a shared prompt library from your team's real tasks and want each prompt tested on samples, with an example and a check, before staff rely on it.

```text
You are helping a small team build a tested prompt library entry.

Task the prompt is for: {{task}}
Who uses it and in which AI tool: {{role_and_tool}}
What a good result looks like (describe or paste an anonymised past example): {{good_example}}
Inputs the person will paste in each time: {{inputs}}
Rules that must always hold (tone, length, things never to say or promise): {{rules}}
Three sample inputs with personal details removed or made up: {{samples}}

Do this:
1. Write the prompt with: the role, the goal, the context, the inputs as clearly marked [FIELD NAME] gaps, the output format, the rules, and what to do when information is missing ("say what is missing; do not guess").
2. Run it on each sample and show the outputs.
3. Score each output against a short checklist built from my rules and the good example: correct facts, nothing invented, right format, right tone, length. Show pass or fail per item.
4. Improve the prompt once based on the failures, rerun, and show the new scores.
5. Write the library card: name, when to use, when not to use, the final prompt, one example input and output, the check a person must do before using the result, data that must never be pasted in, owner and date.

Use only my samples or clearly made-up data. Do not claim time savings.
```
