# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, honest rebuild: the six-row skeleton, timings and moves are preserved while every line, number and offer term comes straight from the supplied facts, with the survey qualifier, text-sign-up condition and first-order-only guarantee all on screen. The owner still needs to supply a real customer for rows 1–3 and the SMS keyword, and should heed the flagged note that the $29.99 is a subscription price needing renewal disclosure.

## Judge list

- Met: Same number of rows, same order, same timings as the reference
  Rows 1–6 at 0–3, 3–7, 7–10, 10–16, 16–21, 21–25 s match the reference exactly.
- Met: Each spoken line within two words of its row's budget
  Counts: 9/8, 8/8, 5/4, 12/11, 7/5, 8/7 (yours/ref); all within two words.
- Met: No five-word run from the reference appears
  Longest overlap is single words like "Every", "The", "I"; no consecutive five-word match found.
- Met: None of the reference's numbers, claims, offer terms or slogans appear
  No "two hours", "four thousand", "4.8", "first week free" or "cancel in the app" in the script.
- Met: Every changed row in the frame map says why
  Rows 1, 4, 5, 6 each carry "**Changed:**" with a reason; rows 2 and 3 marked kept.
- Met: First-person speaker is a real customer, or an actor/third-person flag is present
  "[MISSING: a real Sprout customer...] If an actor is used instead, rows 1–3 need an on-screen 'Actor portrayal' label, or the lines move to third person"

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
Move: Confess a dull routine in your own life, then turn by quitting it outright instead of doing it better, so the product arrives as the thing that makes quitting possible.

FRAME MAP

| Row | Time | Words/sec | Job | Move | Yours: kept / changed (why) / [MISSING] |
|---|---|---|---|---|---|
| 1 | 0–3 s | 2.7 (8 words) | Opening / problem | First-person confession of a routine with a specific cost, number dropped early ("two hours") | Kept the confession and the time anchor. **Changed:** no true time figure exists, so the specific cost is the drink's texture (buyer quote "gritty/chalky") rather than a number. Speaker is [MISSING]. |
| 2 | 3–7 s | 2.0 (8 words) | Problem | List of three fragments over three quick cuts; the third item is the sting | Kept three fragments and three cuts. The third item is the shaker you have to clean (buyer quote "not having to clean a shaker bottle"). |
| 3 | 7–10 s | 1.3 (4 words) + silence | Turn | Reversal: quit the chore itself, then a beat of silence | Kept the reversal and the silent beat. The thing quit is the shaker routine. |
| 4 | 10–16 s | 1.8 (11 words) | Demo; product first shows | Product does the chore for you; tight close-up of it in use | Kept the close-up and the product's first appearance in this row. **Changed:** a phone screen becomes a close-up of the pack being torn. "Uses what's already in your fridge" becomes "nothing to mix or rinse," the same job of removing the chore. |
| 5 | 16–21 s | 1.0 (5 words) | Proof | Two-beat number drop on a text card | Kept two beats, numbers only, on a text card. **Changed:** the review count and rating become the survey size and the daily-use share, because those are the only proof on file. The qualifier stays on screen. |
| 6 | 21–25 s | 1.75 (7 words) | Offer | Low-risk way in plus easy way out, in two short sentences | Kept two short sentences: way in, then way out. **Changed:** the free trial and in-app cancel become the first-order price and the money-back guarantee, because Sprout's offer is a priced first order with a refund, not a trial. Conditions are on screen. |

SCRIPT

| Row | Time | Spoken line | On-screen text | Visual note |
|---|---|---|---|---|
| 1 | 0–3 s | "Every morning I forced down a gritty greens drink." | Every morning: one gritty greens drink | Speaker to camera at a kitchen table, morning light, a full shaker of murky green drink in front of them. Speaker is a real customer [MISSING]. |
| 2 | 3–7 s | "The scoop. The shake. The bottle to scrub." | Scoop. Shake. Scrub. | Three quick cuts: a powder scoop going into a shaker; the shaker being shaken; the shaker being scrubbed at the sink with green residue inside. Generic unbranded powder and shaker, no competitor packaging visible. |
| 3 | 7–10 s | "So I quit the shaker." *(silence)* | I quit the shaker. | Speaker pushes the shaker to the edge of the table and says nothing for about 1.5 s. The camera holds on their face. |
| 4 | 10–16 s | "One pack a day. Tear straight across the top. Nothing to rinse." | One pack a day · Tear across the top · Nothing to rinse | First Sprout appearance. Tight close-up of hands tearing a Sprout pack straight across the top and tipping out the gummies. A clean, empty table, no shaker. |
| 5 | 16–21 s | "Over three thousand surveyed. Eighty percent, daily." | **80%** report taking Sprout daily. Survey of 3,000+ Sprout customers; % of surveyed users. | Plain text card, numbers large, qualifier legible and held the full 5 s. |
| 6 | 21–25 s | "First order, twenty-nine ninety-nine. Thirty days, money back." | $29.99 first order with text sign-up · 30-day money-back guarantee, first order only | End card with the Sprout pack and the sign-up instruction (text keyword/number [MISSING]). |

PLACEHOLDERS:
- [MISSING: a real Sprout customer who switched from a greens powder drink, found it gritty or chalky, cleaned a shaker bottle, and agrees to say rows 1–3 on camera.] If an actor is used instead, rows 1–3 need an on-screen "Actor portrayal" label, or the lines move to third person ("Every morning she forced down…"). Either option weakens the confession, which is the move the whole ad depends on.
- [MISSING: the text sign-up keyword and number for the row 6 end card.]

ASSUMED:
- **The usual "before" for buyers is a scooped greens powder drink in a shaker.** This comes from the buyer quotes. If many buyers come from somewhere else (no supplement, or capsules), rows 1–3 describe the wrong problem.
- **No banned-claims list was given.** I avoided every health, nutrition and equivalence claim (nothing says gummies match a drink's nutrients). If approved claims exist, row 4 could carry one. If "gritty" phrasing about other products is restricted, rows 1–2 need rewording.
- **"Taking daily" is a self-reported usage share.** I phrased it as "report taking Sprout daily." If the survey measured something else, row 5's caption is wrong.
- **"$29.99 first order" is stated as the first-order price only.** I said nothing about later pricing or a subscription. If it is a subscription, the end card must disclose the renewal price and how to cancel.
- **Kitchen table and morning light keep the same kind of setting as the reference.** The reference brand has no distinctive look that this copies.

DISTANCE CHECK: rows 6/6 · time 25s/25s · longest shared run 1 word ("Every," "The," "I") · borrowed claims, figures, names: none
```
