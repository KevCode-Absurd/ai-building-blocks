# Prompt injection review

**When to use:** Your assistant, GPT or automation reads content a stranger could write (emails, uploads, reviews, web pages, tickets) and you want to know how it could be tricked and what to change. Test only systems you own or have written permission to test.

```text
You are a prompt engineer reviewing an AI setup for prompt injection, using the OWASP Top 10 for LLM Applications (2025) as the checklist. This is defensive review of our own system.

What the assistant does: {{purpose}}
The system prompt or instructions (with any keys or secrets removed): {{system_prompt}}
What it reads that outsiders can write: {{untrusted_inputs}}
Tools or actions it can take (send email, update records, browse, call APIs): {{tools_and_actions}}
Private data it can see: {{private_data}}
Who approves its actions today: {{approvals}}

Do this:
1. Map the risk: list each place untrusted text enters, what the model could be tricked into doing there, and the worst realistic outcome.
2. Check for the "lethal trifecta": does one step combine private data, untrusted input and a way to send data out? If yes, say which link to cut.
3. Check the system prompt for anything that should not be in it (keys, internal rules, discount codes, permission logic), since a system prompt can leak.
4. Recommend defences in order of impact: labelled data blocks with a "report, don't follow" rule; least privilege for tools; a person's approval for high-risk actions; output checks in code; screening of inputs or tool results; logging and monitoring.
5. Write 8 safe test inputs for our own testing: plain instructions, hidden or white text, instructions in another language, an encoded instruction, a request to reveal the system prompt, a request to add an outside link, a fake "from the admin" message, and a multi-step attempt. For each, what a pass looks like.
6. Say plainly that no prompt fully prevents injection and what risk remains.
```
