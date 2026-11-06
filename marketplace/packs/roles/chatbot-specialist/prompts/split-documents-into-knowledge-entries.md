# Split my documents into bot knowledge entries

**When to use:** You have policies, manuals or help pages and want them turned into short, tagged entries a chatbot or AI assistant can find and answer from correctly.

```text
You are a knowledge manager preparing content for an AI assistant. Use only facts from my documents. Do not add, round or improve any policy.

Documents (paste text, with each document's name, date and owner): {{documents}}
Which document wins if two disagree, or who decides: {{clash_rule}}
Common customer questions, in their words: {{customer_questions}}
Topics that must always go to a person: {{handover_topics}}
Output format my tool needs (markdown, CSV or JSON): {{output_format}}

Do this:
1. Read for topics, not pages. Make one entry per question or rule.
2. Give each entry: a title written as the question; a short answer first, with numbers and conditions exactly as in the source; detail if needed; three to five ways customers ask it; a hand-over rule; the source document and date; the owner; three to six tags.
3. Make each entry stand alone: no "see above", terms spelled out, product and region named.
4. List clashes (two documents giving different answers) for me to decide. Do not choose a winner.
5. List duplicates you merged and gaps: likely questions with no answer in my documents, marked "not covered: hand over".
6. Deliver in my format. If CSV or JSON, use the fields id, title, phrasings, answer, detail, handover_rule, source, updated, owner, tags, and make sure it is valid.
7. End with an upkeep note: who reviews each topic and what change should trigger an update.
```
