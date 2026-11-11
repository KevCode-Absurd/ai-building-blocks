# Clarity rules (editor pass)

In blind tests, length did not predict clarity (r = -0.03). Density did: long-sentence share (r = -0.67), parentheses (r = -0.63), average sentence length (r = -0.53), method talk (r = -0.47).

## BASE RULE
When the clearest draft is a plain one and the expert drafts' extra substance can be added to it, build on the clear draft and graft the substance in, rather than cutting an expert draft down. Add each expert fact, guard or tool as its own short sentence, bullet or table row in the right section. A graft that needs a long sentence goes in a table or appendix.

## 1. Answer first
- The first two sentences answer the request. No date line, audience list, method note or "what we won't do" list before it.
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
- Under 300 words: no headings, short paragraphs.
- 300-1,200: 3-6 headings phrased as reader questions; bullets for lists.
- Over 1,200: summary first, numbered sections, each opening with its point; paragraphs under 80 words.

## 6. Tables help when
- Comparing 2+ options on 2+ attributes, schedules, price ladders, if-then decision rules, who-does-what.
- Not for reasoning. Cells under 15 words; one sentence above says what it shows.

## 7. Cut or move
- Method talk: how the work was made, files, "checked live", inline sign-off stamps, review tags. Open items go in one short "To confirm" box at the end.
- Repeated blocks (the same disclaimer in every variant): say shared lines once. Where each piece runs alone and the law or platform needs a disclosure in it, keep a short one fitted to that piece.
- Build specs, tokens, rosters and sources go after the content.

## 8. Check
Run `node tools/quality/readability.cjs <final> --audience <a>`. Fix exit 1; meet the editor targets. The final's long-sentence share and parentheses rate must not exceed the plain draft's. Read customer copy aloud.
