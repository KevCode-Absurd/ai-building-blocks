# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

A strong, usable plan: the shaker has-been comes straight from review 6, the bubble is tight and in character, every claim and the offer line match Sprout's approved facts, and nothing is invented. It falls short only because the product photos never arrived and the run built the pouch from a description rather than asking for them, so the label can't be confirmed until the overlay is done.

## Fix

In "What you need" and "If something is missing", add: if the brief says photos are attached but none are readable, stop and ask for them before writing the prompt, or leave the product out of the frame as the rule already says.

## Judge list

- Met: Shown for 2 seconds, someone can say what the object is fed up about and what the product is.
  Crusted shaker in drying rack, bubble "Honestly? I'd quit me too.", pouch at edge; glance test stated: "the shaker's embarrassed; it's greens gummies."
- Met: The bubble has 7 words or fewer, says "I" or "me", and never says "you".
  "Honestly? I'd quit me too." is 5 words, uses I and me, no "you".
- Met: There are at most 3 other things to read, in type big and dark enough to read on a phone.
  Product name 40 px, offer line 30 px+, "Shop Sprout" button 34 px, all on solid #002C17 band in cream/yellow.
- Met: The object says nothing it couldn't have seen, and every fact matches your claims.
  Bubble reports only being quit; offer line and "60+ ingredients, 21 vitamins & minerals, and 6g fiber" match the input word for word.
- Not met: The product matches your photos, has no face, and has your real pack laid over it.
  "The attached photos didn't come through... label text and pouch shape are taken from your description and not checked." Run proceeded instead of asking.

## What went in

```text
Problem: has quit greens powders again and again; the routine
never sticks. Buyer has tried other fixes. Runs in the Instagram
feed.
Buyer's moment: the kitchen sink in the morning, shaker in the
drying rack, half-used tub in the cupboard.
Their words: "Plus not having to clean a shaker bottle or extra
dishes for greens stuff in powder form, is absolutely excellent!"
(review 6)
Product: Sprout Superfood Gummies. Glossy deep green stand-up
pouch, big yellow wordmark "Sprout", yellow bear face top right,
"28 Daily Packs" at the bottom. Photos attached: front, side, top.
Also true: no water, no mixing, no shaker.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. Voice: playful, cheeky. Jokes are fine; no guilt.
Colors: deep forest #002C17, warm cream #FFF7DF, sunflower #FFCC2E.
Offer: $29.99 first order with the text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
I can't draw the picture in this chat because no image tool is connected. Below is the image prompt and plan, and the end explains how to turn it into the image.

**1. Narrator**
**The shaker bottle, a has-been.** Review 6 names it ("not having to clean a shaker bottle").
- **True:** The brief puts it in the drying rack by the sink every morning.
- **Readable:** It's one tall cylinder at thumbnail size. The lid band reads as a forehead and the smooth upper body is where a face already seems to be.
- **At stake:** It's being replaced and left in the rack. That's a mild loss, and the joke is on itself.
- **Fair:** It's a generic clear shaker with no logo, shape or colours from any rival. It's clearly not a pouch, and it's not a body part, symptom or screen.
- **Material and state:** Frosted clear plastic with a dried green ring a third of the way up the inside. The wire whisk ball is stuck in a green clump at the bottom, there are powder flecks crusted in the lid threads, and the flip cap is slightly ajar. It's still damp in the drying rack.

**2. Mood and expression**
- **Mood:** Sheepish. It owns up, in a cheeky way, with no guilt on the buyer.
- **Expression:** Brows tilted up in the middle. Eyes slide sideways toward the pouch. The mouth is a small crooked line, pressed shut at one corner and lifted at the other, as if halfway through admitting it.
- **Light:** Warm early-morning light, low from one side through a window left of the sink, with soft long shadows.

**3. Layout**
Size is 4:5 (1080 × 1350). For a 1:1 (1080 × 1080) version, recompose with the shaker and pouch closer together and the bottom band at 18%. Don't stretch the 4:5.

| Zone (top to bottom) | What sits there |
|---|---|
| 0–6% | Clear margin |
| 6–24% | Bubble space, upper left of centre, tail pointing to the shaker's mouth |
| 20–76% | Shaker, left of centre, about half the frame, standing in the drying rack |
| 36–76% | Pouch at the right edge, front to camera, sharp, true scale, in the shaker's eyeline |
| 78–100% | Calm zone: a solid #002C17 band for the small lines |

**4. Words on the image**
- **Bubble:** "Honestly? I'd quit me too." That's 5 words. It's first person, has no "you", and reports only what the shaker has seen: being used, rinsed, then dropped.
- **Product name:** "Sprout Superfood Gummies" (from the brief).
- **Offer line:** "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks." This is from the brand offer. Check it against the live offer on the day the ad goes live.
- **Button:** "Shop Sprout"

**5. Image prompt**
> A real photograph. A frosted clear plastic shaker bottle stands in a metal dish drying rack beside a kitchen sink. A subtle face is moulded into its own plastic on the smooth upper body just below the lid band. The face is pressed-in ridges for brows, two shallow rounded dimples for eyes and a short moulded line for a mouth, with no added parts. A dried green powder ring sits a third of the way up the inside. A wire whisk ball is stuck in a green clump at the bottom, powder flecks are crusted in the lid threads, the flip cap is slightly ajar, and water droplets cling to the outside.
>
> Expression, caught halfway through owning up: brows tilted up in the middle, eyes sliding sideways to the right toward the pouch, mouth a small crooked line pressed shut at one corner and lifted at the other.
>
> Setting: a morning kitchen counter with a plain stone or laminate surface and a softly blurred tiled backsplash. One or two plain unbranded mugs sit drying in the rack. No people, no other faces, and no text or logos on anything else in the scene.
>
> Light: warm, low early-morning light from a window on the left, with soft long shadows to the right.
>
> At the right edge of the frame, standing upright on the counter at true scale next to the shaker, is a glossy deep green stand-up pouch matching the supplied product photo. It has a large yellow "Sprout" wordmark, the printed yellow bear graphic top right and "28 Daily Packs" at the bottom. The pouch faces the camera, is in sharp focus with its printing intact, and has no added face or expression.
>
> Framing: vertical 4:5, eye level with the shaker. The shaker fills about half the frame, left of centre. Leave an empty, uncluttered area of soft wall in the upper left for a speech bubble, near the shaker's face. Keep the bottom fifth of the frame plain and empty for text. No words, letters or speech bubbles in the image.

**6. Post words**
- **Primary text:** "No shaker to rinse. No water, no mixing. 1 pack of Sprout gives you 60+ ingredients, 21 vitamins & minerals, and 6g fiber."
- **Headline field:** "Greens, minus the shaker"
- **Button:** Shop Now

**7. Edit step**
1. **Bubble:** Add a white bubble with a thin #002C17 outline in the upper-left space, tail to the shaker's mouth. Set the line in #002C17 at 44 px or more. Contrast is well over 4.5:1.
2. **Real pack overlay:** Cut the pouch out of the front product photo and lay it exactly over the generated pouch, matching scale, angle and light, so every word on the label is right. Keep the printed bear graphic as printed, with no added expression.
3. **Words on the band:** Lay a solid #002C17 band over the bottom 22%.
   - "Sprout Superfood Gummies" goes in #FFF7DF at 40 px. Cream on forest is about 15:1.
   - The offer line goes in #FFF7DF at 30 px or more, on two lines.
   - "Shop Sprout" goes on a #FFCC2E button with #002C17 text at 34 px. That's about 10:1.
4. **Contrast check:** Run each text and background pair through a contrast checker, and confirm 4.5:1 or more before export.
5. **Glance test:** View it on a phone for 2 seconds. A stranger should be able to say "the shaker's embarrassed; it's greens gummies."

**To make the picture:**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you have an `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. Each picture is billed by OpenAI or Google. Keys are at platform.openai.com/api-keys or aistudio.google.com/apikey.

**8. Score: 83/100 (5 of 6 checks)**
- **Missed: product has its real label.** The attached photos didn't come through in this chat, so the label text and pouch shape are taken from your description and not checked. This passes once the overlay is done from the real front photo.

**9. Missing**
- MISSING: product photos (front, side, top). They weren't visible here, so label text, colours and shape are unchecked.
- MISSING: pouch's real size next to a standard shaker, needed to set true scale.
- MISSING: offer end date, to check the offer line against the live offer.
```
