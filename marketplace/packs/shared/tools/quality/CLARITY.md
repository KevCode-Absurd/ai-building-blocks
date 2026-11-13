# Clarity rules (editor pass)

Clarity means finding, understanding and doing the job with little effort. Sentence and length measures can flag editing work; they do not prove clarity or justify losing useful content.

## BASE RULE
Start from the plain draft's correct useful content. Keep a private coverage ledger while editing. Preserve the actual action, actor, condition, decision and evidence that make it usable. Improve hierarchy, phrasing and layout before removing substance. Add an indispensable expert fact as its own sentence, bullet, field or row where it is used. An appendix must not hide an action the reader needs now.

## 1. Answer first
- The first two sentences answer the request. No date line, audience list, method note or "what we won't do" list before it.
- Follow the first-screen rule in WORK-METHOD.md: the first screen holds the decision, the numbers the owner asked for by name, every piece of bad news and the first move this week.
- Over 1,200 words: open with a one-screen summary (5-7 bullets or a two-column table).
- Meet the reader's actual objection head-on before adding guards.

## 2. Reading grade (prose only, `readability.cjs`)
- Consumers: 8 or below (aim 6-8).
- Business readers: 10 or below (aim 7-9).
- Specialists: 12 or below. Terms are fine; long sentences are not.

## 3. Sentences
- One idea each. Average 14 words or fewer; at most 3% over 30 words.
- Break "Label: a; b; c" runs into bullets or table rows.
- At most three numbers per sentence, each with its meaning ("8 g, about 2 teaspoons").
- At most 1.5 parentheses per 100 words. Cut or split asides.
- No slash stacks ("$x / $y / $z") or dot-separated strings. Use a table.

## 4. Words
- No invented acronyms or internal codes. Spell it out; define a real acronym once.
- Plain verbs. Cut filler: "it is important to note", "leverage", "robust", "in order to", "comprehensive".
- Give reasoning the way a person says it: "I can't tell which way is right, so the test checks both."
- Hedge once, where the doubt lives. No stacked caveats or defensive asides.

## 5. Scannability by length
- Under 300 words: short paragraphs; use headings or labels when they help locate a needed part.
- 300-1,200: a few useful headings and bullets for lists; preserve a requested native format.
- Over 1,200: summary first, numbered sections, each opening with its point; paragraphs under 80 words.

## 6. Tables help when
- Comparing 2+ options on 2+ attributes, schedules, price ladders, if-then decision rules, who-does-what.
- Avoid packing long reasoning into cells. If a useful field needs more space, use a narrower table or a repeatable record; do not delete the field or its condition to meet a word target.

## 7. Cut or move
- Method talk: how the work was made, files, "checked live", inline sign-off stamps, review tags, notes to the writer.
- Open items: decide each one with the assumption a top practitioner would pick. Where it changes what to do, state it in one assumption line next to the part it affects (at most three in the piece). No confirm lists, open questions or requests for the owner's yes.
- Repeated blocks (the same disclaimer in every variant): say shared lines once. Where each piece runs alone and the law or platform needs a disclosure in it, keep a short one fitted to that piece.
- Build specs, tokens, rosters and sources go after the content.

## 8. Check
Run `node tools/quality/readability.cjs <final> --audience <a>`. Review its warnings against the reader and job; required terms and operating detail can justify an exception, recorded privately. Check that concrete actions, evidence and conditions survive the edit. Read customer copy aloud. A fresh reader must find no material loss of usefulness or clarity.
