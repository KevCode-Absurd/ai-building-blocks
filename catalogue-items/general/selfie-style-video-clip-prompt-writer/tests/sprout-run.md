# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The run did exactly what the skill asks: checked the script, flagged what needs confirming, asked for the real photos and the accent, offered three presenters and stopped for approval. Nothing was made up as a Sprout fact and the presenter is clearly a made-up adult, so the owner can approve and move to reference images.

## Judge list

- Met: The run stopped for your yes after the presenter card, the sheets and the storyboard.
  "Approval 1 of 3: please approve or change the presenter and voice cards" – stopped correctly; sheets and storyboard not yet reached.
- Met: The presenter looks the same in every clip, and the room and light don't change.
  No clips yet (paused at approval 1 as the skill requires); card fixes "Never changes: hair length and the ear tuck, the watch..."
- Met: Every scripted word is said, unchanged, and nobody claims a result they couldn't have had.
  "the words stay as approved"; beat 4 flagged for caption attribution "so it never reads as her own result."
- Met: The product looks like its photos and opens only the brand's way.
  "The pouch opens only at its resealable top. The script never opens it, so it stays closed on the counter." Photos requested before stage 3.
- Met: No prompt contains a film word like "cinematic" or "bokeh".
  No image or clip prompts written yet; cards contain no film words.
- Met: The AI label and the disclosure line are in the edit.
  Edit not reached; presenter card opens "A made-up adult woman" and input disclosure acknowledged. Nothing contradicts.

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
I can write every prompt here, but I can't make pictures or video in this chat because no video tool is connected.

---

## File 1: Lines sent back

**Lines sent back: none.**

No line has the presenter claiming her own result, how long she's used it, a purchase or a personal story.

Before the edit, these need to be confirmed (the words stay as approved):
- **Beat 4:** "'The one thing I've been able to stick to.'" Keep this only if it is a real, documented customer review, quoted word for word. Because the presenter speaks the "I've", the on-screen caption should attribute it ("— verified customer"). That way it never reads as her own result.
- **Beat 3:** "Twenty-one vitamins and minerals in that handful" must match the daily pack label exactly, for the serving shown.
- **Beat 2:** "can't do what a scoop of powder does" sets up a comparison with greens powder. The brand's claims team should confirm they can support it.
- **Beat 5:** "twenty-nine ninety-nine if you sign up by text" must match the live offer on the day the ad runs. It will also go on screen as edit text.

**Photos and handling: enough for the script.**
- **In hand:** "Daily pack in a hand" covers the tear.
- **Contents:** "Gummies in a palm" shows the contents out of the pack, so the tip-out can be drawn from a real photo.
- **Pouch:** The pouch opens only at its resealable top. The script never opens it, so it stays closed on the counter.

**Missing:**
- `MISSING: the photo files themselves`. I only have the labels [pouch front], [daily pack in a hand] and [gummies in a palm]. Please attach the images before stage 3. Until then I can't check the product sheet against the real pack, the gummies' shape and colour, or the label words.
- `MISSING: pouch and daily pack size` (height × width, or "fits in a palm").
- `MISSING: the brand's never-show list`.
- `MISSING: presenter accent`. Which accent should she have? US? UK? Something else?

---

## File 2: Avatar card

**Three presenter options**, from the buyer: a busy adult who bought a greens powder and stopped using it, caught in the morning rush.

1. **A.** Early 30s office worker in a fitted knit and trousers, coat already on one arm, quick and dry.
2. **B.** Early 30s nurse or shift worker in a plain zip fleece over scrubs, warm and matter-of-fact.
3. **C.** Early 30s hybrid worker in a shirt and soft jacket, lanyard tucked away, relaxed and a bit wry.

Cards drafted for **A** (recommended: the coat makes "about to leave for work" readable at a glance). Swap to B or C and I'll rewrite them.

**Presenter card**
> A made-up adult woman, apparent age 32. Shoulder-length dark brown hair, straight, tucked behind her right ear. Dark brown eyes. Medium-tan skin tone. Plain oatmeal crew-neck knit, no words or logos; charcoal wool coat with no visible branding, worn open. Small particular details: a thin silver watch on her left wrist with a round face, a small gap between her two front teeth, a single plain gold stud in each ear. Never changes: hair length and the ear tuck, the watch on the left wrist, the oatmeal knit and charcoal coat, no makeup change, no other jewellery.

**Voice card**
> Woman, early 30s. Pace: brisk but clear, like she's talking on her way out the door. Traits: dry, friendly, a little conspiratorial on the hook. Accent: `MISSING: please confirm`.

---

**Approval 1 of 3:** please approve or change the presenter and voice cards (or pick B or C), and confirm the accent. I'll write the reference image prompts once you approve.
```
