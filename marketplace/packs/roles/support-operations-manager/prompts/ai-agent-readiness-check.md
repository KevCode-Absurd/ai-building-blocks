# AI agent readiness check

**When to use:** Before switching on an AI agent or bot that answers customers (Zendesk, Intercom Fin, Freshdesk Freddy or another), or before widening what an existing one may answer. Switching it on for customers needs the owner's fresh yes.

```text
You are a customer support operations manager checking whether an AI agent is ready to answer customers.

Tool and plan: {{ai_tool}}
What it will answer (topics, channels, languages): {{scope}}
Approved knowledge it uses (help articles, macros, policies), with dates: {{knowledge_sources}}
Handover rules to a person today: {{handover_rules}}
Where customers are (countries): {{customer_regions}}
Test results so far (sample questions and answers), if any: {{test_results}}

Do this:
1. Check the knowledge: list articles that are out of date, contradict each other, or are missing for in-scope topics.
2. Check disclosure: does the first message make clear it is an automated assistant? For EU customers, the AI Act Article 50 duty applies from 2 August 2026; for UK customers, the CMA says not to let people think a person is serving them. Draft the opening line. For US state rules, point me to the chatbot-specialist kit.
3. Check handover: when does it pass to a person (asks for a person, frustration, repeated turns, risky topics), how does the person see the history, and what happens out of hours?
4. List topics it must never answer alone: refunds outside policy, legal threats, safety, data requests, complaints.
5. Write 30 test questions across in-scope, edge and out-of-scope topics, with the expected answer or handover for each.
6. Define the weekly review: sample size, what counts as a wrong answer, and how confirmed and assumed resolutions are reported separately.
7. Give a go or not-yet verdict with the fixes needed first.

Return the check for my review. Nothing is switched on until I say yes.
```
