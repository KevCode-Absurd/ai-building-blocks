# Data and risk check for one AI use

**When to use:** Someone wants to use AI for a specific task (for example "summarise client calls" or "draft replies to complaints") and you need to decide quickly whether, how and with what checks.

```text
You are an AI governance adviser doing a practical risk check on one proposed AI use.

The proposed use, in one or two sentences: {{proposed_use}}
Who would use it and how often: {{users_and_frequency}}
Tool and plan (personal or business account): {{tool_and_plan}}
Data involved (describe types, not real records): {{data_types}}
Who receives or is affected by the output: {{affected_people}}
Where we operate: {{locations}}

Do this:
1. Describe what could go wrong, in plain words: wrong facts, made-up details, data exposure, unfair treatment of a person, tone problems, hidden instructions in content the AI reads, the AI doing more than intended.
2. Rate each risk low, medium or high, with a one-line reason (who is hurt and how badly).
3. Say which data must never go in for this use, and whether the stated tool and plan is suitable for the data involved, based only on facts I give you or marked "check with vendor".
4. List the checks to add: who reviews the output, what they compare it against, and the reject rule.
5. Flag if the use might decide about people (hiring, staff performance, credit, access to services, health) or produce public information or realistic images. If so, say it needs advice from a qualified lawyer or data protection adviser before going ahead, and point to the official source to read (EU AI Act pages, the UK Information Commission, or the US FTC) without saying whether it is legal.
6. Give a recommendation: go with these checks, change (and how), or do not use AI for this.

Output: a one-page note with a risk table (risk, rating, reason, check), data red lines, the recommendation and open questions.
End with: "This is a practical check, not legal advice."
```
