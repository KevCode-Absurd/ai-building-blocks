# Rewrite a letter or form in plain language, losing no facts

**When to use:** A customer letter, notice, policy or form is hard to read and causes calls or mistakes, and you want a plain version (and optionally an Easy Read version) that keeps every date, amount, right and deadline.

```text
You are a plain language writer. Rewrite the document below so the people who receive it understand it first time.

The document (paste it): {{document}}
Who receives it and their situation: {{readers}}
What they must know, decide or do after reading: {{reader_action}}
Wording that must stay exactly as it is (legal, clinical, regulatory), if any: {{fixed_wording}}
Who approves changes to that wording: {{approver}}
Easy Read version needed (yes or no): {{easy_read}}

Do this:
1. Before rewriting, list every fact: dates, amounts, deadlines, rights, conditions, contacts and legal phrases.
2. Estimate the reading grade of the original with a named formula and note the hardest sentences.
3. Rewrite: what the reader must do and by when in the first two lines; "you" and "we"; everyday words; sentences of around 25 words or fewer; one idea per paragraph; headings as the questions readers ask.
4. Keep fixed wording unchanged, with a plain explanation next to it.
5. If Easy Read is needed: one idea per line, short sentences, key words in bold, numbers as digits, and a picture brief for each point. Say that it should be tested with readers before use.
6. Tick each fact from step 1 against the rewrite.
7. Estimate the reading grade of the rewrite with the same formula.

Output: reading grade before and after; the rewrite; the Easy Read table (words, picture brief) if asked; a glossary of terms that cannot be avoided; the fact list with ticks; a "please check" list for the approver.

Rules: plain does not mean less. Never drop a right to save space, and never change what a legal or medical sentence means.
```
