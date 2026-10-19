# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

A solid brief with one clear wrong-use mismatch taken straight from the approved story, with no product or invented facts. It follows the shape and is ready to paste into an image tool.

## Judge list

- Met: Exactly one mismatch, nothing competes
  "Wrong use: a shaker bottle doing a pen cup's job." The green ring supports the same mismatch.
- Met: Story's first two lines explain it
  Closed by "My old shaker bottle holds pens now. / There's still a green ring at the bottom."
- Met: Hints at nothing that didn't happen in the story
  Dried green ring is in the story; "not mould or sludge" keeps it plain.
- Met: No product and no shock value
  "No product is in the picture." Shaker is plain, unbranded; ring is a dried tint.
- Met: Line under image doesn't give answer away; words come from copy
  Line under image: "My old shaker holds pens now." Words on image are lifted from line 2 ("There's still a green ring").

## What went in

```text
Story ad (approved, built on reviews 1 and 3):
My old shaker bottle holds pens now.
There's still a green ring at the bottom.
I was paying $94 a month for a greens powder that was gritty and
chalky, and I rinsed that shaker every morning until I didn't.
The issue was never what was in the powder. It was sticking with
it.
Sprout is one daily pack: tear the top, eat the small handful of
gummies inside. 60+ ingredients, 21 vitamins and minerals, 6 g
prebiotic fiber. No water, no shaker.

Words on the image: yes, if they help.
```

## What came out

```text
I can't draw the picture in this chat because no image tool is connected, so this is the brief and prompt only.

**1. Scene**
An old, see-through shaker bottle on a desk, full of pens, with a faint green ring stuck at the bottom.

**2. The mismatch**
Wrong use: a shaker bottle doing a pen cup's job. Lines 1–2 close it: "My old shaker bottle holds pens now. / There's still a green ring at the bottom." Line 1 says the shaker is retired, and the ring shows what it used to hold. Line 4 ("I rinsed that shaker every morning until I didn't") fills in the rest.

**3. Where and when**
- **Place:** A home desk or work corner.
- **Time:** Mid-afternoon, with daylight from a window.
- **Surroundings:** Ordinary mess, such as the edge of a notebook, a charging cable, a coaster and a sticky note.
- **Kept out:** No gym gear, no supplement tubs and no kitchen.

**4. Framing**
- **Distance:** Close, from just above eye level, so you can see the pens and the ring through the plastic.
- **Position:** The shaker sits in the left third of the frame.
- **Ring:** It must be readable but not gross. It's a dried tint, not mould or sludge.
- **Format:** Square 1:1.

**5. Words on the image**
"There's still a green ring" (5 words, lifted from line 2). It's set small in white, low in the frame, like a caption added in a phone story editor. It pulls the eye to the ring and raises the question of what was in it, without giving the answer.

**6. Blank version**
The same photo with no caption. Use the prompt below without its last sentence.

**7. Line under the image**
My old shaker holds pens now. (28 characters)

**8. Flags**
- The words on the image are lifted word for word from line 2.
- The line under the image is lifted from line 1 with "bottle" cut to fit the length.
- The desk setting and afternoon light are inferred, because no buyer's moment was given.
- No product is in the picture.
- The shaker must be plain and unbranded.

**9. Image prompt**
> Casual smartphone photo, square 1:1, of a used translucent plastic shaker bottle with its lid off, sitting on a home desk and filled with ballpoint pens, a highlighter and a pencil. A faint dried green ring tints the inside bottom of the bottle, clearly visible through the plastic. Ordinary desk clutter around it: edge of a notebook, a charging cable, a coaster. Soft afternoon window light, natural shadows, slight phone-camera grain, unretouched. Shaker in the left third, shot close from just above eye level. No logos, no brand names, no text on the bottle, no people, no packaging. Small white caption text near the bottom, like a phone story editor: "There's still a green ring".

**10. Score**
Score: 100/100 (5 of 5 checks)

**To make the picture:**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** Paste the image prompt into a chat and ask for the picture. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** Save an `OPENAI_API_KEY` (platform.openai.com/api-keys) or `GEMINI_API_KEY` (aistudio.google.com/apikey), and the prompt can be sent to that image API and the file saved. OpenAI or Google bills each picture.
```
