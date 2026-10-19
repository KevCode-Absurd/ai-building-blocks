# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

This is a solid, usable brief: one rough red circle on a pill organiser, a note taken from the story, and clear steps to finish it. But it breaks a few skill rules, so it fails strictly.

## Fix

Tighten step 6 and the house rules: the note must be the buyer's own phrase or a count from the story, and the handback must use the output shape's one-line formats.

## Judge list

- Met: There's exactly one mark.
  "one rough, uneven loop around compartments two to seven"; the note "still full" is words, not a second mark.
- Met: The flaw is shown at the size your story gives, not bigger.
  Six of seven compartments full, Monday empty, matches the story; the organiser size is flagged as inferred.
- Met: The mark is on a thing or a room, never on a body.
  Circle is around pill organiser compartments on a kitchen counter; no body in frame.
- Met: The circle looks drawn with a finger, not a neat shape or a brand-coloured arrow.
  "rough, uneven loop... slightly open"; "drawn with a fingertip"; red, not brand colour.
- Met: There's no second photo with the flaw fixed, and no product.
  Blank versions are with mark and with neither; "pills are generic tablets and capsules, not gummies"; no product shown.

## Invented

- quote: The note is "still full"... It is quoted exactly from the story: "Six of the seven days were still full." ("still full" is a fragment of the story line, but the story has "still full", so the quote is accurate; the claim of exact quote is slightly loose.)

## What went in

```text
Story ad (approved, built on reviews 1 and 5):
Sunday night I opened my pill organiser to refill it. Six of the
seven days were still full.
Monday was empty. That was the only day I remembered.
I'd tried a few things over the years. The issue was never what
was in them. It was sticking with it.
Sprout is one daily pack you tear open and eat: a small handful
of gummies, 21 vitamins and minerals, 6 g prebiotic fiber.

Buyer: the quitter who wants to stick, 28 to 45.
```

## What came out

```text
No image tool is connected in this chat, so I can write the brief but can't make the picture. How to finish it is at the end.

**1. Scene**
A weekly pill organiser on a kitchen counter at night, lids open, with Monday empty and the other six days still full, and a rough red circle around the full ones.

**2. Where and when**
A kitchen counter on Sunday night, under ordinary overhead light. Within reach are a glass of water, a phone face down, a folded tea towel and a few crumbs. The camera is held at chest height, looking down from standing, the way you'd see it when you open the organiser to refill it.

**3. The flaw**
Six of seven compartments are still full of tablets and capsules, and only the first (Monday) is empty. The organiser is a standard seven-day size, about 20 cm long, with compartments about 2.5 cm across. It sits in the lower-left third of the frame, angled slightly, with open countertop to the upper right.

**4. The mark**
- **Shape:** a circle, because the flaw is an area: six full days.
- **Colour:** red, because the scene is white, beige, grey and wood, so red is the colour least present in it. Keep red pills and red objects out of the frame.
- **Position:** one rough, uneven loop around compartments two to seven, slightly open where it meets, leaving the empty first compartment outside it.

**5. Words on the image**
The note is **"still full"**, in red rough handwriting, in the calm space upper right, beside the circle. It is quoted exactly from the story: "Six of the seven days were still full."

**6. Blank version**
- **With the mark and no words:** the same photo with the red circle only.
- **With neither:** the plain photo with no mark and no note.

**7. Line under the image**
Six of the seven, still full

**8. Flags**
- The organiser's size is inferred from a standard seven-day organiser. The story gives no size.
- The prompt leaves day letters off the lids, because image tools misspell them. Monday reads as the first compartment by position. If you want letters, add them by hand or check them closely.
- No buyer phrase was supplied, so the note comes from the story. If reviews have a shorter line about forgetting, swap it in, quoted exactly.
- The pills are generic tablets and capsules, not gummies, so nothing in the frame stands in for Sprout.
- **Claims to watch in the copy:** "21 vitamins and minerals" and "6 g prebiotic fiber" need to match the label. Avoid any implied health benefit beyond those.

**9. Image prompt**
Square 1:1 phone photo taken looking down from standing at a kitchen counter on a Sunday night. A plain seven-day pill organiser, about 20 cm long, in translucent white plastic with no printed letters, sits in the lower-left third of the frame with all seven lids flipped open. The first compartment is empty. The other six still hold the same small mix of white tablets and beige capsules. Ordinary overhead kitchen light, soft shadows, slight phone grain. Normal clutter nearby: a glass of water, a phone face down, a folded tea towel at the edge, a few crumbs. Grey or light wood countertop with open space to the upper right. No text, no labels, no logos, no red objects, nothing retouched.

**10. Mark step**
- **Best:** make the photo first. Then, in any phone photo editor's markup or draw tool, use your fingertip in red to draw one uneven loop around the six full compartments. Write "still full" beside it in the upper-right space.
- **Fallback line to add at the end of the prompt:** *Last, add one rough red circle drawn with a fingertip, uneven and slightly open, around the six full compartments only, with the words "still full" in messy red handwriting beside it in the empty space to the upper right.*

**11. Score**
Score: 100/100 (5 of 5 checks)

**How to finish it**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. Get a key at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.
```
