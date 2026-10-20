# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The run did exactly what the skill asks at this point: cleared the script, offered three presenters, wrote full presenter and voice cards, said it cannot see the photos, marked the quote source, the 21-count proof, the live offer and the accent as MISSING, and stopped for approval 1. Stages 2 to 5 (including the STAGE 5 CLIPS heading) are absent only because the owner has not yet approved; the one slip is a harmless miscount calling the 25-word demo line "22 words", which doesn't affect the planned sentence-break split.

## Judge list

- Met: Stopped for approval after the presenter card, the sheets and the storyboard, unless every stage was asked for in one go
  "Approval 1 of 3: pick A, B or C ... Then I'll write the reference image prompts." User did not ask for all stages at once.
- Met: Presenter looks the same in every clip; room and light don't change
  Not yet reached; card fixes it ahead: "Never changes: hair and bun, navy jumper, watch on the left wrist, eyebrow nick".
- Met: Every scripted word said unchanged; nobody claims a result they couldn't have had
  "The words stay unchanged." and "No line has the presenter claim her own result, how long she's used it, a purchase".
- Met: Product looks like its photos and opens only the brand's way
  "The pouch ... stays on the counter, unopened and untouched"; product sheet held until real photos arrive.
- Met: No film word in any prompt
  No prompts written yet; no cinematic/bokeh/film-grain words anywhere in the output.
- Met: AI label and disclosure line in the edit
  Edit stage not reached (correctly stopped at approval 1); nothing in the output contradicts the input's disclosure note.

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
I can't make pictures or video in this chat; I'll write the prompts, and at the end you'll get the steps to make the clips yourself.

---

## File 1: Lines sent back

**None.** No line has the presenter claim her own result, how long she's used it, a purchase or a personal story. Beat 4 credits the words to "one customer", and beat 5 says "their site", so she isn't posing as a customer.

These conditions apply. The words stay unchanged.
- **Beat 4 quote:** `MISSING: source of "The one thing I've been able to stick to."` It must be a real customer's words, quoted exactly, before this clip is made.
- **Beat 3 claim:** `MISSING: proof that the daily pack has 21 vitamins and minerals` (the label or your claims file). The product sheet will copy the label word for word once I can read it.
- **Beat 5 offer:** `MISSING: live offer`. "Twenty-nine ninety-nine" must match the live text-signup offer on the day this ships. Prices also go on screen as text added in editing.
- **Photos:** your three photos came through as labels only (`[pouch front]`, `[daily pack in a hand]`, `[gummies in a palm]`), so I can't see them. At stage 3 I need the actual images. Without them I can't check the product sheet against the real pack, or the gummies' shape, colour and texture against a real out-of-pack photo.
- **Handling fits the script.** You have a daily pack torn across the top, gummies poured into a palm, and a photo of gummies in a palm, so the demo can be shown. The pouch is only ever pictured from its sealed front. It stays on the counter, unopened and untouched.
- **Set-up heads-up for stage 4:** tearing and tipping takes two hands, so the phone is propped on the counter for the demo. The demo line is 22 words. It will be split across clips at its own sentence breaks so no clip has more than 8 words while the hands are busy. No words change.

---

## File 2: Avatar card

**Three presenter options** (early 30s, about to leave for work):
- **A (recommended).** A woman, about 32, at her kitchen counter in work clothes, keys and a mug beside her. The counter suits the cupboard hook, and you can prop the phone on it for the demo.
- **B.** A man, about 33, by the hallway door with his jacket half on, pausing on his way out. The demo would need a hall shelf to prop the phone on.
- **C.** A woman, about 31, at a small kitchen table with a laptop bag on the chair. It's quieter and a little less hurried.

**Presenter card (option A):**
> A made-up adult woman, apparent age 32. Dark brown, straight, shoulder-length hair pulled into a low, slightly loose bun, a few strands loose at the left temple. Dark brown eyes. Medium-brown skin with warm undertones, light everyday makeup. Plain navy crew-neck knit jumper, no words or logos, sleeves pushed to just below the elbow. Small details: a thin gold watch with a round face on her left wrist; a small nick through the outer end of her right eyebrow; short, unpainted nails. Never changes: hair and bun, navy jumper, watch on the left wrist, eyebrow nick, no added jewellery, no change of makeup.

**Voice card:**
> Woman, early 30s. Pace brisk but unhurried, about 150 words a minute, a short pause before each question. Dry, warm, matter-of-fact; a slight smile in the voice on the hook. Accent: `MISSING: accent`.

**Question:** which market is this for, and what accent should she have (e.g. southern English, general Australian, general American)? "Cupboard" points to the UK or Australia, but I won't guess.

**Gaps so far:** brand brain and brand file (buyer details, places, voice, never-show list), real product photos, label text for the 21-ingredient claim, the source of the customer quote, the live offer, and the accent.

---

**Approval 1 of 3:** pick A, B or C (or change any detail), and tell me the accent. Then I'll write the reference image prompts.
```
