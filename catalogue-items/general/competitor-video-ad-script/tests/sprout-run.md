# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, honest remake: the six-row skeleton and timings are kept, every line is new, and only the facts the owner supplied are used, with the survey qualifier and the first-order-only guarantee limit kept on screen. The owner gets a shootable script plus clear gaps to fill (a real customer, a time figure, whether the $29.99 order renews) before it goes live.

## Judge list

- Met: Same number of rows, same order, same timings as the reference
  Six rows at 0–3, 3–7, 7–10, 10–16, 16–21, 21–25 s, matching the reference exactly.
- Met: Each spoken line within two words of its row's budget
  Ref/yours: 8/9, 8/9, 4/4, 11/10, 5/7, 7/9. All within two.
- Met: No five-word run from the reference
  Longest shared run is 'Then I stopped' (3 words); 'Every … I' and 'The … The …' patterns don't reach five.
- Met: None of the reference's numbers, claims, offer terms or slogans appear
  No 'two hours', 'four thousand', '4.8', 'first week free' or 'cancel in the app'; all figures are Sprout's.
- Met: Every changed row in the frame map says why
  Row 1: 'no real time figure'; row 4: 'no Sprout equivalent'; row 6: subscription vs first order. Rows 3 and 5 are terse but follow from row 1.
- Met: First-person speaker is a real customer, or flagged
  '[MISSING: a real Sprout customer … agreed to say rows 1–3]' plus 'Actor portrayal' label or third-person rewrite offered.

## What went in

```text
Reference: a 25-second ad for a meal-planning app (described, not
the brand's own). Person to camera at a kitchen table.
1 (0-3 s) "Every Sunday I spent two hours planning dinners."
2 (3-7 s) "The list. The shop. The meal nobody ate."
  Three quick cuts.
3 (7-10 s) "Then I stopped planning." Beat of silence.
4 (10-16 s) "The app plans the week from what's already in your
  fridge." Phone screen close-up.
5 (16-21 s) "Four thousand reviews. Average 4.8." Text card.
6 (21-25 s) "First week free. Cancel in the app." End card.

Product facts: Sprout daily greens gummies. One pack a day, torn
straight across the top. Survey of 3,000+ customers: "80% taking
daily" (of surveyed users). Offer: $29.99 first order with text
sign-up; 30-day money-back, first order only.
Buyer quotes: "the drink was definitely gritty/chalky", "not
having to clean a shaker bottle".
```

## What came out

```text
Move: She owns up to a daily chore, then quits it, so the product's pitch is that it removes the chore entirely.

FRAME MAP
Row | Time | Words/sec | Job | Move | Yours: kept / changed (why) / [MISSING]
1 | 0–3 s | 8 words / 3 s = 2.7 | Opening | Confession of a ritual with its cost dropped early ("two hours") | Kept: first-person confession, recurring ritual. Changed: the weekly planning becomes the daily greens shake (buyer quote: "the drink was definitely gritty/chalky"). The early number is dropped because there is no real time figure. Swap: "every morning" carries the cost through frequency. See PLACEHOLDERS.
2 | 3–7 s | 8 / 4 = 2.0 | Problem | List of three fragments over three quick cuts, with the sting last | Kept: three fragments, three cuts, sting last. The sting is the shaker to clean (buyer quote: "not having to clean a shaker bottle").
3 | 7–10 s | 4 / 3 = 1.3 (≈1.5 s spoken, ≈1.5 s silence) [inferred] | Turn | "I stopped doing it", then a beat of silence | Kept: quitting line, silence. Changed: "planning" becomes "mixing".
4 | 10–16 s | 11 / 6 = 1.8 | Demo (product first shows) | The product does the job with no effort, in a product close-up | Kept: product first appears in row 4, close-up. Changed: the reference's "uses what's already in your fridge" angle has no Sprout equivalent. Swap: same "no effort" move on a true fact (one pack a day, torn straight across the top).
5 | 16–21 s | 5 / 5 = 1.0 | Proof | Two short numbers on a text card | Kept: two-number text card. Changed: review count and rating become the survey figure, with its qualifier on screen.
6 | 21–25 s | 7 / 4 = 1.8 | Offer | Easy way in plus easy way out | Kept: entry plus exit. Changed: the reference is a subscription app (free week, cancel in app). Sprout is a first order with a money-back guarantee. Translated as entry = $29.99 first order by text, exit = 30-day money-back, first order only.

SCRIPT
Row | Time | Spoken line | On-screen text | Visual note
1 | 0–3 s | "Every morning I shook up a gritty greens drink." (9 words) | "Every morning: a gritty greens drink" + small "Actor portrayal" if not a real customer | Person to camera, mid-shot, seated at a kitchen counter in morning light. Sprout's own set and palette, not a copy of the reference's kitchen-table look.
2 | 3–7 s | "The scoop. The chalky sip. The shaker to scrub." (9 words) | "Scoop. Sip. Scrub." | Three quick cuts: (a) powder scoop tipping into a shaker, (b) a sip and a small wince, (c) scrubbing residue out of the shaker at the sink.
3 | 7–10 s | "Then I stopped mixing." (4 words, then silence) | "Then I stopped mixing." | She sets the shaker in the sink and lets go. Hold on her face in silence for about 1.5 s.
4 | 10–16 s | "One pack a day. Tear it straight across the top." (10 words) | "1 pack a day. Tear across the top. No shaker." | Close-up of hands tearing a Sprout pack straight across the top. Cut to the empty counter where the shaker used to sit. First appearance of the product.
5 | 16–21 s | "Over three thousand surveyed. Eighty percent, daily." (7 words) | "80% take it daily*". Footnote: "*Survey of 3,000+ Sprout customers; % of surveyed users taking daily." | Plain text card in Sprout's brand colours and type, numbers large.
6 | 21–25 s | "First order twenty-nine ninety-nine by text. Thirty-day money back." (9 words) | "$29.99 first order when you sign up by text" / "30-day money-back guarantee, first order only" / Sprout logo | End card with the pack beside the text.

PLACEHOLDERS:
- [MISSING: a real Sprout customer who used a shaker greens drink every morning and has agreed to say rows 1–3]. Without this, the rows need an on-screen "Actor portrayal" label or a rewrite in third person ("Every morning she shook up…"). The third-person version weakens the confession move.
- [MISSING: a real figure for time or effort spent mixing and cleaning, from your survey]. It would restore the reference's early number in row 1, e.g. "minutes a day". Do not use a figure without a source.
- [MISSING: whether the first order converts to a repeat order or subscription]. If it does, row 6 must state that on screen.

ASSUMED:
- Shots are built from your written description, not pictures. Framing, cut pace and the reference's set could not be checked for rows 1–6. If the reference's look is more distinctive than described, row 1's set may need to move further from it.
- Row timings follow your stated spans. The speech and silence split inside row 3 is inferred. If her line runs longer, the silence shortens and the turn loses force.
- The speaker's "before" is a powder greens drink in a shaker. This is drawn from the two buyer quotes. If most Sprout buyers didn't come from powders, rows 1–3 speak to a minority.
- Row 2's "chalky sip" describes the speaker's own old drink, not a named competitor. Naming or showing another brand's tub would turn it into a comparison claim.
- No brand voice was given. The tone mirrors the reference (plain, dry, first person).
- No health or taste claims were made because none were provided. Row 4 states only the pack and tear facts.

DISTANCE CHECK: rows 6/6 · time 25s/25s · longest shared run 3 words ("Then I stopped") · borrowed claims, figures, names: none

CHECKS MISSED: none. Check 6 passes only as flagged: rows 1–3 need a consenting real customer, or the "Actor portrayal" label must stay on screen.

Next, would you like to check this script before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), tighten it for reading aloud with the [Ad script read-aloud editor](https://useaiblocks.com/skills/ad-script-read-aloud-editor), or turn it into image ads with the [Image ad remake planner](https://useaiblocks.com/skills/image-ad-remake-planner)? You can also type your own next step.
```
