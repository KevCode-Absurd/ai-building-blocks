# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A correct, careful first stage: it checked the script for lines a fake presenter can't say, kept the pouch sealed because only a front photo exists, built a clear presenter and voice card, and stopped for approval exactly where the skill says. It was slightly over-cautious asking for the customer quote's source and currency when both sit in Sprout's files, but asking is harmless and the later stages (sheets, storyboard, clips, edit) are still to come.

## Judge list

- Met: The run stopped for your yes after the presenter card, the sheets and the storyboard.
  "Approval 1 of 3: please approve or change the presenter and voice cards." Stopped correctly; sheets and storyboard not yet reached.
- Met: The presenter looks the same in every clip, and the room and light don't change.
  No clips yet (stopped at approval 1); card fixes "Never changes: the left parting and tucked side, the oatmeal jumper, the watch".
- Met: Every scripted word is said, unchanged, and nobody claims a result they couldn't have had.
  "None sent back"; words kept; flagged beat 4 quote must be a real review (it is: reviews.md #1).
- Met: The product looks like its photos and opens only the brand's way.
  "The pouch has only a front photo, so it stays on the counter, sealed and untouched"; tear/tip allowed from in-hand and palm photos.
- Met: No prompt contains a film word like "cinematic" or "bokeh".
  No prompts written yet; the presenter card contains no film words.
- Met: The AI label and the disclosure line are in the edit.
  Edit stage not reached; run notes "on-screen offer text gets added in the edit" and presenter is "Not based on any real person's photo".

## What went in

```text
Approved script (from the selfie-style script skill):
1 HOOK "Quick question. How full is the greens tub at the back of
  your cupboard?"
2 DOUBT "You've probably figured a few gummies can't do what a
  scoop of powder does."
3 SHOW [DEMO] "Here's the daily pack. Tear it across the top, tip
  it out. Twenty-one vitamins and minerals in that handful. No
  water, no shaker to wash."
4 HONEST RESULT "One customer put it like this. 'The one thing
  I've been able to stick to.'"
5 HAND-OFF "It's on their site. First order's twenty-nine
  ninety-nine if you sign up by text."
Cast note: a made-up AI presenter, early 30s, about to leave for work.
Disclosure: platform AI label, "AI presenter" on screen in beat 1.
Photos: [pouch front] [daily pack in a hand] [gummies in a palm]
Handling: tear the daily pack straight across the top edge only;
gummies pour from the torn top into a palm; the pouch opens only
at its resealable top.
Tool: 4, 6 or 8 second clips with speech.
```

## What came out

```text
# 1. Lines sent back

**None sent back.** No line has the presenter claim their own result, how long they've used the product, a purchase or a personal story.

Conditions on the approved lines (the words stay as written):

- **Beat 4, "One customer put it like this. 'The one thing I've been able to stick to.'"** This works only if a real customer wrote these exact words. A made-up quote would be a testimonial from someone who doesn't exist. `MISSING: source of the customer quote (the real review, verbatim, on file).`
- **Beat 3, "Twenty-one vitamins and minerals in that handful."** This has to match the pack label word for word. It gets checked against the product sheet in stage 3.
- **Beat 5, "First order's twenty-nine ninety-nine if you sign up by text."** The price and terms have to match the live offer at edit time. The on-screen offer text gets added in the edit. `MISSING: currency and the live offer terms.`
- **Photos:** you supplied the pack in a hand and the gummies in a palm, so the tear and tip can be shown. The pouch has only a front photo, so it stays on the counter, sealed and untouched. The greens tub in beat 1 is only spoken about and never appears on screen.

---

# 2. Avatar card

**Three presenter options** (early 30s, about to leave for work):

- **A.** A woman in her early 30s who works in an office. Her coat is on the chair and her keys are on the counter. She is dry and quick, with no time to waste.
- **B.** A man in his early 30s who cycles to work. His rucksack is by the door and his sleeves are rolled. He is easy-going and a bit sceptical.
- **C.** A woman in her early 30s who works some days at home and some at the office. Her laptop bag is half-zipped. She is warm and matter-of-fact.

**Pick: A**

## Presenter card
A made-up adult woman, apparent age 32. Not based on any real person's photo.
- **Hair:** shoulder-length dark brown, straight with a slight wave, parted on the left, left side tucked behind her ear.
- **Eyes:** hazel-brown.
- **Skin tone:** light olive.
- **Clothes:** a plain oatmeal crew-neck knit jumper, sleeves pushed to the mid-forearm. No words, logos or patterns.
- **Small details:** a thin steel watch with a round face on her left wrist; a small nick through the outer end of her right eyebrow; short, unpainted nails.
- **Never changes:** the left parting and tucked side, the oatmeal jumper, the watch on her left wrist, no other jewellery, the same light everyday make-up.

## Voice card
- **Age:** early 30s.
- **Pace:** quick and conversational. She slows a little on the demo line.
- **Traits:** dry, warm, a little wry.
- **Accent:** `MISSING: accent.` "Cupboard" and "sign up by text" read as British. Please confirm which accent you want, for example neutral southern English or general American.

---

**Approval 1 of 3:** please approve or change the presenter and voice cards. Please also answer the three MISSING items: the quote source, the currency and offer terms, and the accent. Stage 2 (reference image prompts) starts after that.
```
