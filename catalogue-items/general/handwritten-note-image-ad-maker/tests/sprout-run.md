# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run gives a clear, usable brief for a photographed handwritten envelope, with the four lines copied exactly from the approved story. It recommends writing it by hand, supplies a fallback image prompt, and marks the gaps instead of guessing.

## Judge list

- Met: The note is the narrator's own, not from a doctor, expert or customer.
  Note lifted from the approved story: the narrator's own envelope list; 'Their past self. It's an old note found later.'
- Met: No signature with a full name, and no claim about the product.
  Four lines of quits only; 'No other writing anywhere. No logos, brand names, products or people.'
- Met: Every word is spelled exactly as given.
  Four lines match the input exactly: 'greens powder: gritty' through 'probiotics: stopped'.
- Met: It looks like real handwriting, not calligraphy or a font.
  'ordinary adult's legible, slightly uneven handwriting... no handwriting font'; best route is writing it by hand.
- Met: Short enough to read on a phone without zooming.
  '12 words, 4 lines' (at most 5 lines, 5 to 20 words).

## What went in

```text
Story ad (approved, built on reviews 1, 3 and 5):
Clearing out a drawer, I found the back of an envelope in my own
handwriting:
  greens powder: gritty
  pills: made me gag
  multivitamin gummies: forgot
  probiotics: stopped
Four tries. Four quits. The issue was never what was in them. It
was sticking with it.
Sprout is one daily pack: tear the top, eat the small handful of
gummies inside. 60+ ingredients, 21 vitamins and minerals, 6 g
prebiotic fiber.

Buyer: the quitter who wants to stick, 28 to 45.
```

## What came out

```text
I can't draw in this chat, so this is the brief and the image prompt, with how to finish it at the end.

**1. Scene**
An old envelope in a messy kitchen drawer, with a short handwritten list of supplements someone gave up on.

**2. Who it was for**
Their past self. It's an old note found later.

**3. Paper and place**
- **Paper:** the back of a used white envelope, creased where it was folded in half, edges gone a little soft.
- **Where it lies:** on top of the clutter in a half-open kitchen drawer, shot from above.
- **Light:** ordinary daylight from a window, slightly cool, with a soft shadow from the drawer's front edge.
- **Within reach:** rubber bands, two AA batteries, a takeaway menu, a spare key. A hand may hold one corner of the envelope at the frame edge.
- **Format:** square 1:1. Unretouched phone photo. No product, no brand.

**4. The hand**
- Blue ballpoint, a little faded with time.
- An ordinary adult's handwriting: legible, slightly uneven, letters not all the same size, lines drifting a touch.
- No crossing-out, because the story has none.

**5. Words on the image** (12 words, 4 lines)
1. greens powder: gritty
2. pills: made me gag
3. multivitamin gummies: forgot
4. probiotics: stopped

**6. Blank version**
The same creased envelope back in the same drawer clutter, with nothing written on it and a blue ballpoint lying beside it.

**7. Line under the image**
Found this in a drawer. (23 characters)

**8. Flags**
- **Lifted or written:** the words are lifted exactly from the approved story, not written for the image.
- **Check letter by letter:** "multivitamin", "probiotics", "gritty", "gag", and the colon after each item.
- MISSING: brand brain (`voice-and-look.md` photo style). The drawer and light are set from the story alone, so swap them if the brand's photo style says otherwise.
- MISSING: buyer's own words. The caption is a plain description, not the buyer's own line.

**9. How to make it**

*Best: by hand.* Takes five minutes and gets every letter right.
1. Turn over a used envelope and fold it in half once, then flatten it.
2. Write the four lines in blue ballpoint at normal speed, without neatening.
3. Lay it on the clutter in a real kitchen drawer.
4. Shoot it from above on your phone in daylight, square, with no filter.

*Fallback: image prompt.*
> Phone photo, square 1:1, looking down into a half-open kitchen drawer in ordinary daylight. On top of everyday clutter (rubber bands, two AA batteries, a takeaway menu, a spare key) lies the back of a used white envelope, creased from being folded in half, edges slightly soft. Written on it in faded blue ballpoint, in an ordinary adult's legible, slightly uneven handwriting, exactly four lines: "greens powder: gritty / pills: made me gag / multivitamin gummies: forgot / probiotics: stopped". No other writing anywhere. No logos, brand names, products or people. Natural phone-camera grain, soft shadow from the drawer edge, unretouched, no handwriting font.

*To finish it:*
- **ChatGPT or Gemini:** paste the prompt into a chat and ask for the picture, then check each letter. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. Each picture is billed by OpenAI or Google.

**10. Checks missed**
None.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? It takes the image prompt. Or tell me what you'd rather do next.
```
