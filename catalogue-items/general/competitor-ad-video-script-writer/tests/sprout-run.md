# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, shootable 25-second script that keeps the reference's skeleton while using only the gummy, survey and offer facts supplied, with the first-person lines properly flagged as actor portrayal. The one gap (survey date and source) is marked MISSING, and the subscription-renewal risk is called out in ASSUMED rather than glossed over.

## Judge list

- Met: Same number of rows, same order, same timings as the reference
  Six rows at 0–3, 3–7, 7–10, 10–16, 16–21, 21–25 s; DISTANCE CHECK: "rows 6/6 · time 25s/25s"
- Met: Each spoken line within two words of its row's budget
  Ref 8/8/4/11/5/7 words vs yours 9/9/5/12/5/7, all within one word.
- Met: No five-word run from the reference appears
  "Every morning I choked down a gritty greens drink" vs "Every Sunday I spent two hours"; longest shared run is single words.
- Met: None of the reference's numbers, claims, offer terms or slogans appear
  No "two hours", "four thousand", "4.8", "first week free" or "cancel in the app" anywhere in the script.
- Met: Every changed row in the frame map says why
  Row 5: "Changed the proof type from a review rating to survey adherence, because that is the only proof provided."
- Met: First-person speaker is a real customer, or flagged (actor note / third person)
  Row 1 lower third "Actor portrayal"; ASSUMED: "Rows 1–3 are flagged... Otherwise keep the 'Actor portrayal' label or switch to third person"

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
Move: A first-person confession of a tiresome daily habit flips on a quiet "I quit" beat, so the product reads as the end of a chore and not a better way to do it.

**FRAME MAP**

| Row | Time | Words/sec | Job | Move | Yours: kept / changed (why) / [MISSING] |
|---|---|---|---|---|---|
| 1 | 0–3 s | 2.7 (8 w) | Opening / problem | Confession of a routine with a specific cost ("two hours") | Kept the confession. Changed the cost: there is no time figure in the facts, so the specific cost is the buyer's own complaint ("gritty/chalky"). |
| 2 | 3–7 s | 2.0 (8 w) | Problem | List of three fragments over three quick cuts, with the last item as the sting | Kept the three fragments and cuts. The sting is now the shaker to wash, from buyer words. |
| 3 | 7–10 s | 1.3 (4 w) | Turn | Short "I quit" line, then a beat of silence | Kept the line and the silence. New wording so the reference's key line isn't echoed. |
| 4 | 10–16 s | 1.8 (11 w) | Demo; product first shows | Close-up of the product in hand while one line explains how it works | Kept the close-up and the single line. Changed the hook from "uses what you already have" to "one pack, nothing to wash", which calls back to row 2. |
| 5 | 16–21 s | 1.0 (5 w) | Proof | Two numbers dropped on a text card | Kept the two-number card. Changed the proof type from a review rating to survey adherence, because that is the only proof provided. Card carries the "of surveyed users" qualifier. |
| 6 | 21–25 s | 1.8 (7 w) | Offer | Low-risk entry plus an easy way out | Kept low risk plus an exit. Translated "free week / cancel in app" (subscription) into "$29.99 first order / 30-day money-back". The guarantee is the exit. |

**SCRIPT**

| Row | Time | Spoken line | On-screen text | Visual note |
|---|---|---|---|---|
| 1 | 0–3 s | "Every morning I choked down a gritty greens drink." (9 w) | "Every morning: a gritty greens drink" + lower third "Actor portrayal" (unless a consented customer) | One person to camera, medium close-up, seated at a kitchen counter in morning light. Holds an unbranded glass of murky green drink. No competitor packaging. |
| 2 | 3–7 s | "The mixing. The chalky sip. The shaker to wash." (9 w) | "Mix. Sip. Scrub." | Three quick cuts, about 1.3 s each: (a) shaking an unbranded shaker bottle; (b) a wincing sip; (c) scrubbing the shaker at the sink. |
| 3 | 7–10 s | "So I ditched the shaker." (5 w), then about 1.5 s of silence | "So I ditched the shaker." | Back to camera. They set the shaker on a cupboard shelf and close the door. Hold on their face in silence. |
| 4 | 10–16 s | "One pack a day, torn straight across the top. Nothing to wash." (12 w) | "1 pack a day · tear across the top · nothing to wash" | First product shot. Close-up of hands tearing one Sprout pack straight across the top and tipping the gummies into a palm. The empty counter shows no shaker. |
| 5 | 16–21 s | "3,000-plus surveyed. 80% taking daily." (5 w) | Card: "80% of surveyed users taking Sprout daily" / footnote: "Survey of 3,000+ Sprout customers. [MISSING: survey date and who ran it]" | Full-screen text card in Sprout's own type and colours. |
| 6 | 21–25 s | "$29.99 by text. First order, 30-day money-back." (7 w) | End card: "Sprout · $29.99 first order with text sign-up · 30-day money-back guarantee, first order only" | End card with the Sprout pack and the text-to-join prompt. |

**PLACEHOLDERS:**
- Row 5 footnote: [MISSING: survey date and who ran it]. Fill it with the survey date, who ran it and how users were selected, so the 80% figure can be sourced on screen.

**ASSUMED:**
- **Pictures not checked.** No reference pictures were provided, and the reference is described, not shown. The framing, the three cuts, the phone close-up and the card styles for all 6 rows come from the text. If the real shots differ (for example, row 2 isn't three cuts), the visuals need re-matching.
- **What the buyer quotes refer to.** "Gritty/chalky" and "cleaning a shaker bottle" are assumed to describe a powdered greens drink buyers used before Sprout. If they describe something else, rows 1–2 lose their factual basis.
- **"Nothing to wash."** This assumes the pack format needs no utensils or mixing. If it does, row 4 needs a different callback.
- **Who speaks the first-person lines.** Rows 1–3 are flagged. They are true only if spoken by a real customer who has agreed to say them. Otherwise keep the "Actor portrayal" label or switch to third person ("She choked down…"), which weakens the confession.
- **Offer type.** This assumes $29.99 is a one-off first-order price. If it starts a subscription, the renewal terms must go on the end card, and row 6's exit should mention cancelling.
- **Meaning of the 80% figure.** This assumes "80% taking daily" means self-reported adherence among surveyed users and is not an efficacy result. Nothing in the script implies a health outcome.

**DISTANCE CHECK:** rows 6/6 · time 25s/25s · longest shared run 1 word ("Every", "The", "I", "First") · borrowed claims, figures, names: none

**SCORE:** 6/6 checks = 100 out of 100 · missed: none
```
