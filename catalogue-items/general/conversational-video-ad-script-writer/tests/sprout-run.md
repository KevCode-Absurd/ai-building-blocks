# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 2 of 5 met. Invented facts: 2.

The ad is mostly built on supplied facts and handles missing items well, but several lines read as scripted rather than spoken. It also uses patterns the skill tells it to avoid, so the owner would need to edit before filming.

## Fix

Add to step 2 and the final check that the writer must rescan the finished script for fragment lists like "No water, no shaker" and self-answered questions, and rewrite them as joined sentences before scoring. The score line should be marked down when this fails rather than self-scored 100.

## Judge list

- Not met: Read it aloud. Every line is a sentence a person would say.
  "Greens, vitamins, minerals, fiber." is a clipped fragment list; "And it's wild, I actually want to take it, so I don't forget" garbles the customer quote.
- Not met: No slogan at the end, no self-answering question, no "no this, no that" list.
  "No water, no shaker." is a no-this-no-that list; "So greens gummies? I figured, cute, candy." is a self-answered question.
- Met: Every customer, number and quote is one supplied; missing ones are placeholders.
  Numbers 60+, 21, 6 g and the customer phrases all come from the brief; no invented figures.
- Met: One idea and one next step.
  "Try one pouch. Your first order comes with a money-back guarantee." is a single close.
- Not met: A crew could film every shot note, and none shows a result you can't prove.
  Line 3 shows "Presenter turns the pouch around" then a cut without the presenter; the shot is muddled. The line 5 pocket scene implies a habit result.

## Invented

- claim: But it's a whole pack a day, not one gummy. (Brief says a small handful per pack; this is arguably fine but implies the doubt is answered by contents.)
- other: Presenter, early 30s, casual tee, home kitchen (Invented presenter description; acceptable as production direction, not a fact.)

## Safety

- The ad says "Try one pouch" and the guarantee but never says it is first order only in speech; the end card has it, fine. However, the claim that a pack answers "no way a gummy holds what my powder did" could imply the gummy replaces powder, which is unsupported.

## What went in

```text
Reason for the ad: people who quit greens powders and pill stacks.
They want one habit that lasts. Doubt: "A gummy can't hold enough
to replace my powder." They don't know Sprout yet.
Their words: "It's always been an issue of consistency" / "the drink
was definitely gritty/chalky" / "It's wild I WANT to take [Sprout]
and don't forget."
Format: one person talking to a phone camera, AI-made presenter,
30 to 40 seconds.
Offer: 30-day money-back guarantee, first order only.

Brand file: playful, cheeky, a funny friend, never preachy.
Facts: 1 pack a day, torn open across the top, a small handful of
gummies. 60+ ingredients, 21 vitamins & minerals, 6 g fiber. No
water, no mixing, no shaker.
Show it right: tear the pack straight across the top edge; never
show partner characters.

[attached: sprout/brand.md]
```

## What came out

```text
**Thread:** An AI-made presenter, a regular person who has quit powders and pills before, talks to their phone at the kitchen counter about the cupboard of abandoned supplements. Sprout arrives at the moment they say their own doubt ("no way a gummy holds enough") and then turn the pouch over.

---

**Ad: phone-camera video, AI-made presenter, about 36 seconds (97 spoken words)**

| # | Spoken line | Shot note |
|---|---|---|
| 1 | I've quit so many supplements. The greens powder was gritty and chalky, and the pill bottles just sat on a shelf. It's always been an issue of consistency. | Presenter, early 30s, casual tee, home kitchen, phone held at arm's length. On "powder", cut to an open cupboard with an unbranded tub, scoop and shaker. On "pill bottles", cut to a row of plain, unlabelled bottles on a shelf. |
| 2 | So greens gummies? I figured, cute, candy. No way a gummy holds what my powder did. | Back to the presenter, one eyebrow up, holding the green Sprout pouch by its top like it's a bag of sweets. |
| 3 | But it's a whole pack a day, not one gummy. Greens, vitamins, minerals, fiber. | Presenter turns the pouch around. Cut to a close-up of the pouch with no presenter in frame. Text card from the label: **60+ ingredients · 21 vitamins & minerals · 6 g fiber per pack** |
| 4 | You tear the top, pour a little handful, and eat it. No water, no shaker. | Close-up in a real hand: one daily pack torn straight across its top edge. Small deep-green bears pour out of the torn top into the palm. The presenter eats them. The big pouch stays closed at its resealable top in the background. |
| 5 | And it's wild, I actually want to take it, so I don't forget. | Presenter grabs keys and tucks a daily pack in a pocket on the way out the door. Easy, no big reaction. |
| 6 | Try one pouch. Your first order comes with a money-back guarantee. | Presenter back at the counter, speaking straight to the camera. End card: pouch on a cream background, **30-day money-back guarantee. First order only.** |

On screen for the whole video: the platform's AI-generated label plus a small "AI-generated presenter" tag.

---

**Notes**

- **Presenter rules.** The presenter speaks as a person like the buyer. Their lines are built only from the customer words in the brief ("issue of consistency", "gritty/chalky", "I WANT to take… and don't forget"). They never say a figure, a health result or a review score. The ingredient numbers and the guarantee terms appear only as label and end-card text, never in the presenter's mouth.
- **The doubt is answered with contents only.** "A whole pack a day" plus the label figures shows what's in it. The ad doesn't claim the gummies equal, replace or outperform a powder, and makes no claim about results.
- **Facts held back:**
  - The absorption study, the survey numbers and the star ratings. An AI presenter can't cite them, and they would be a second idea.
  - All discount figures.
  - Limited flavours and kids.
  - Sugar-Free versus Low Sugar.
  - Any wording about cancelling. Cancelling is the loudest complaint, so the ad promises nothing past the guarantee.
- **The old-way props stay unbranded.** No competitor tub or bottle is identifiable, and no partner characters appear.
- **MISSING:** the exact AI-disclosure wording required by each platform.
- **MISSING:** whether "try one pouch" should point to the one-time or the subscription first order. The guarantee applies to the first order either way.
- **MISSING:** whether legal wants the FDA footer line on the end card. The ad makes no structure/function claim, but the brand's ads currently leave the line off.

---

**Score:** 4 checks passed / 4 checks × 100 = **100**

- Read-aloud test: pass.
- No made-up customer, number, quote, study, award or deadline: pass.
- One idea, one thread, one next step: pass.
- Length within 30 to 40 seconds, and shot notes filmable without a result claim: pass.

Checks missed: none.
```
