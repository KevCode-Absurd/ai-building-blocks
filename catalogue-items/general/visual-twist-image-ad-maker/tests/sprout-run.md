# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 6 of 6 met. Invented facts: 3.

The concept is strong and on-brief: a relevant, unexpected sink scene with the product present and no result claims. But it departs from the required output shape and misuses MISSING and scoring.

## Fix

In the Hand back/Output step, require the exact output-shape labels (ONE THOUGHT, MOMENT, TWIST, CHECK, HEADLINE, etc.) and say a MISSING line only for facts absent from the inputs and files, and the score only counts checks truly failed.

## Judge list

- Met: 1. Cover the headline. The picture alone shows the problem.
  Dirty shaker with gritty green ring in sink, dry hands pouring gummies above; the chore shows without words.
- Met: 2. One sentence on why unexpected and why relevant.
  "The gummies sit right where the washing-up happens" (unexpected); "exact moment in review 6" (relevant).
- Met: 3. Product in ad, small, matching photo, not pasted in corner.
  Pack in pouring hand and pouch upright on counter at sink edge, "logo readable at thumbnail size"; built from photos.
- Met: 4. Picture shows problem or cause, never a result.
  Shows dirty shaker and dry hands; no body change or before-and-after. Never list respected.
- Met: 5. Headline names a moment or gain, not a reader condition.
  "Greens with no shaker to wash" (job: Gain), 6 words.
- Met: 6. Prompt mentions the problem before the product.
  Prompt opens with the sink and used shaker with gritty ring before the Sprout pack.

## Invented

- number: 20 characters ("No water. No mixing." is actually 20 characters, so worked out and fine.)
- number: top 30% (Layout choice for the frame, not a Sprout fact.)
- other: MISSING: source for "6 g prebiotic fiber" (6 g is in the brand file; claiming it was unsourced is a wrong MISSING call, though harmless.)

## What went in

```text
Problem: review 6, "Plus not having to clean a shaker bottle or
extra dishes for greens stuff in powder form, is absolutely
excellent!" and review 3, "the drink was definitely
gritty/chalky."
Moment: a weekday morning at the sink.

Product: Sprout, daily greens gummies. Tear a pack, eat the
gummies. No water, no mixing. 6 g prebiotic fiber.
Brand line: "No more gagging on pills, sloshing chalky powders, or
cleaning messy counters."
Never: "fix", weight or energy results, before-and-after.

Photos: the adult pouch on a soft gradient; one daily pack torn
straight across the top, gummies pouring into a palm.
Look: deep forest green #002C17, sunflower yellow #FFCC2E. Work
Sans bold. Photos are bright and sunny, never clinical.
Offer: none.
```

## What came out

```text
I can't draw the picture in this chat because no image tool is connected, so this gives you the plan and the prompt.

## Concept card: Sprout, "no shaker"

**One thought:** After one look, the buyer thinks: "Greens, and no shaker bottle to clean."
- Quote, review 6: *"Plus not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!"*
- Quote, review 3: *"the drink was definitely gritty/chalky."* This drives the residue detail below.

**Moment:** A weekday morning at the kitchen sink, in sunlight. A used greens shaker bottle stands in the basin with half an inch of grey-green water. A dried, gritty green ring sits at the waterline, and clumped powder sticks to the wire whisk ball.

**Twist:** Side by side, with one exact detail. The detail is the chalky green ring and clumps on the whisk ball, which no stock photo would bother with. Directly above the sink, a pair of dry hands holds a freshly torn Sprout daily pack and pours gummies into an open palm. The shaker waits below, unwashed.
- **Conclusion:** *this is the opposite of that.* One way you scrub. The other way your hands stay dry.
- I chose side by side over plain because a dirty shaker alone looks like a powder brand's own "before" shot. Putting the gummies over it is what makes the point.

**Two-by-two:**
- **Unexpected? Yes.** The gummies sit right where the washing-up happens, and the hands are dry above wet dishes.
- **Relevant? Yes.** This is the exact moment in review 6.
- **Result:** keep.

**Headline (job: Gain):** "Greens with no shaker to wash" (6 words)

**Support line (brand's own words, excerpted):** "No more sloshing chalky powders, or cleaning messy counters."

**Line under the image:** "No water. No mixing." (20 characters)

**Look:** Photo. The point is "this is real": the residue and the chore have to look true. It is bright and sunny with warm morning window light, never clinical, matching the brand's photos.

**Frame (4:5 Feed):**
- **Focal point:** the palm catching gummies, lower-middle of the frame. The shaker sits just below it in the sink.
- **Quiet area for words:** the top 30%. This is a plain, sunlit pale wall or window frame above the sink, out of focus. The headline goes there in Work Sans Bold, forest green #002C17. The support line sits beneath it, smaller, in the same green. A sunflower yellow #FFCC2E underline goes under "no shaker".
- **Product position:**
  - The torn daily pack is in the pouring hand, with its front print toward camera.
  - The adult pouch stands upright on the dry counter at the right edge of the sink. Its front faces camera, and its logo is readable at thumbnail size.
- **Scale:** the shaker is a standard gym shaker, roughly the height of the tap spout. The hands are adult-sized. Gummy size and colour must match the product photo.

**Product treatment:**
- **Pouring hands and pack:** built from the photo of the daily pack torn straight across the top, with gummies pouring into a palm. Keep the straight tear, pack colours, logo and large print.
- **Pouch:** built from the adult pouch photo, moved off its gradient into the kitchen. Keep its shape, colours and large print.
- **Small print:** left out, never invented.
- **Hands:** a made-up adult's, with no face shown. They are not presented as a customer.

**Image prompt:**
> Bright, sunny photograph, 4:5 vertical, of a kitchen sink on a weekday morning, warm sunlight from a window. In the sink basin stands a used plastic greens shaker bottle with a little grey-green water inside, a dried, gritty green ring at the waterline and clumps of green powder stuck to the wire whisk ball. Directly above the sink, a pair of dry adult hands (no face visible) holds a Sprout daily gummy pack torn straight across the top and pours gummies into an open palm, the hands, pack and gummies matching the attached product photo exactly in shape, colour and large print, small print left blank. On the dry counter at the right edge of the sink, the Sprout adult pouch stands upright facing camera, matching the attached pouch photo, logo clearly readable. The palm with gummies is the single sharp focal point; the shaker is just below it. Few objects, clean counter, nothing else in the sink. The top 30% of the frame is a plain, softly out-of-focus sunlit pale wall left empty for text. In that area, in bold Work Sans, deep forest green #002C17: "Greens with no shaker to wash", with a sunflower yellow #FFCC2E underline beneath "no shaker". Below it, smaller, same green: "No more sloshing chalky powders, or cleaning messy counters." No other text in the image.

`MISSING: product photo` I worked from your descriptions, not the files. I couldn't check the pouch and pack print, colours, the tear shape, or gummy size and colour. Attach both photos to the image tool with the prompt.
`MISSING: source for "6 g prebiotic fiber"`

`Not used:`
- 6 g prebiotic fiber: it had no source, and it isn't this ad's one thought.
- The "gagging on pills" part of the brand line: it's off this moment.
- A News headline: no new fact is on file.
- The offer: there is none.

**Score: 80/100 (4 of 5 checks)**
- Missed: product true to its photo. This can't be confirmed until the actual photos are attached and the output is compared against them.

---

**To make the picture:**
- **ChatGPT or Gemini:** paste the prompt and attach both product photos. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt and the photos into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` (platform.openai.com/api-keys) or `GEMINI_API_KEY` (aistudio.google.com/apikey) saved, I can send the prompt and photos to that API and save the file. OpenAI or Google bills each picture.
- **If a word comes out garbled:** shorten that line rather than remaking the same image.
```
