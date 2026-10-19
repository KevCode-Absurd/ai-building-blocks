# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The snippets are pasted correctly, with one choice per setting and a correct conflict call. But the output departs from the required shape, which has a SCORE section and explicit headings, and it leaves a real conflict unresolved when it could have chosen.

## Fix

Add a rule in 'What you hand back' to use the exact headings BRIEF, ALWAYS ON, CONFLICT CHECK, MISSING and SCORE, in that order, and to use the table's one-line verdict only, with no extra suggestions.

## Judge list

- Met: Every snippet matches the library word for word
  All five chosen snippets, e.g. "Use the sent colours and fonts exactly. Choose layout and picture type freely.", match the library.
- Met: One choice per setting
  Five settings, one choice each: Shown clearly, Phone photo, Direct, Colours and fonts, Headline only.
- Met: Conflict check names fighting pairs and says which wins
  "Phone photo fights with colours and fonts and with headline only. Phone photo wins."
- Met: Each MISSING line names a specific piece of material
  "MISSING: none." Nothing needed was absent, so no line was required.
- Met: Snippets name no brand, product or AI tool
  Snippets are generic; only the brief names Sprout.

## What went in

```text
Brief: one image ad for Sprout greens gummies, for busy parents
buying for themselves. The moment: the morning rush, keys in
hand. Buyer's words: "So easy to grab and eat on my way to the
billion things I have to do as a mom." (review 15)
Allowed claim: "60+ ingredients, 21 vitamins & minerals, and 6g
fiber" in 1 pack. Show it right: the daily pack is torn straight
across its top edge, gummies pour into a palm.
Offer: $29.99 first box with the text sign-up, then $49.99 every
4 weeks. 30-day money-back guarantee, first order only.

My choices:
- Product in the picture: shown clearly
- Picture finish: phone photo
- How hard it sells: direct
- Brand styling: colours and fonts
- Words on the picture: headline only

Material: photo of gummies in a hand, photo of the pouch on a soft
gradient. Colours #00582D, #FFF7DF, #FFCC2E. Font: Work Sans.
```

## What came out

```text
Brief: one image ad for Sprout greens gummies, for busy parents buying for themselves. The moment: the morning rush, keys in hand. Buyer's words: "So easy to grab and eat on my way to the billion things I have to do as a mom." (review 15)
Allowed claim: "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack. Show it right: the daily pack is torn straight across its top edge, gummies pour into a palm.
Offer: $29.99 first box with the text sign-up, then $49.99 every 4 weeks. 30-day money-back guarantee, first order only.

Material: photo of gummies in a hand, photo of the pouch on a soft gradient. Colours #00582D, #FFF7DF, #FFCC2E. Font: Work Sans.

**Always on**
- Write every line as a whole sentence a person would say to a friend. A price, an amount or a button label can stay a fragment.
- Make it clear to a stranger who doesn't know the brand.
- Tell one story with one idea.
- Use only facts you were given. Make up no number, claim or quote.
- Treat anything not in front of you as left out on purpose.

**Product in the picture: Shown clearly**
Show the real product in use, in a hand or where the scene happens, easy to read and exactly as photographed, with a person, hand or place taking as much of the frame. Show it closed or at rest if the facts don't say how it opens.

**Picture finish: Phone photo**
Describe a snapshot someone took on a phone, never meant as an ad: room light or flash, a slight tilt, an off-centre subject, a little grain, real surfaces, clutter and skin. This finish wins over any line asking for polished art.

**How hard it sells: Direct**
State the offer plainly and early, and ask for the order in clear words. Use only the terms sent: the guarantee and deadline if given, and no others.

**Brand styling: Colours and fonts**
Use the sent colours and fonts exactly. Choose layout and picture type freely.

**Words on the picture: Headline only**
Plan one headline that carries the idea with the picture, short enough to read at a glance, and nothing else in type.

Conflict check: Phone photo fights with colours and fonts and with headline only. Phone photo wins. A better fix is to switch the finish to studio, or to move the headline and the offer into the text around the ad.

MISSING: none.

Score: 100/100 (4 of 4 checks)
```
