# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 6 of 6 met. Invented facts: 0.

The run gives a usable GPT Image prompt under the limit. It keeps the lock lines word for word, quotes the approved words with their place, and shows the big pouch closed. It says honestly that the photos weren't seen and lists the missing facts.

## Judge list

- Met: Every attached photo has one stated role.
  Image 1 = the real pouch; Image 2 = the real daily pack; Image 3 = layout to follow for structure only.
- Met: Lock lines appear word for word, pack not swapped or simplified.
  Keep line repeats all five lock lines verbatim, and the subject block repeats the pouch lines.
- Met: Approved words appear once, in quotes, with place, or clear space is asked for.
  Words: "Rip. Tip. Enjoy." top left, large bold rounded sans-serif, colour #00582D.
- Met: No rejected idea, research note or placeholder made it into the prompt.
  Shaker, "Tear. Pour. Done." and "HEADLINE HERE" appear only under LEFT OUT, not in the prompt.
- Met: Camera is a real position and hands say which one holds what.
  Counter height, 40 cm away; right hand tips the pack into the cupped left palm.
- Met: Anything it couldn't know is marked MISSING and product shown closed until answered.
  MISSING lists photos unseen, bear count, pack size. The big pouch is shown closed.

## What went in

```text
Approved scene: kitchen counter in daylight. An adult hand tears
a daily pack across the top and pours the gummies into the other
palm. The Sprout Original pouch stands behind, label to camera.
Approved text: "Rip. Tip. Enjoy." top left, forest green #00582D.
Size: 4:5. Tool: GPT Image. Prompt limit: 1,000 characters.

Images: 1 = adult pouch, front on. 2 = a daily pack, torn across
the top. 3 = layout sketch (headline box says "HEADLINE HERE").

Lock lines (from the truth sheet): glossy deep green stand-up foil
pouch; big yellow wordmark, yellow bear face top right; "28 Daily
Packs" at the bottom; small opaque deep-green bears, soft matte;
daily pack torn straight across the top only.
Rules: the big pouch opens only at its resealable top, never torn.
Photos bright, sunny, candy-like. Never clinical.

Notes: we rejected a version with a shaker bottle in it. Also
tried "Tear. Pour. Done." Make it pop, really bright, vibrant,
super bright and fun.
```

## What came out

```text
I can't make images here, so this hands back the prompt only. Images 1–3 weren't attached, so I haven't seen them. The product's look comes from your lock lines, and matching it to the photos is left for the first-image check.

```
PROMPT (about 970 characters, prompt text only, without the block labels; under 1,000)
1 Use and shape:   A 4:5 photo for a social ad. Image 3 is layout only.
2 Subject:         An adult right hand tips a daily pack torn straight across the top only, pouring small opaque deep-green bears, soft matte, into the cupped left palm. Behind, the closed pouch, label to camera: glossy deep green stand-up foil pouch; big yellow wordmark, yellow bear face top right; "28 Daily Packs" at the bottom.
3 Place:           Pale oak kitchen counter by a window; hands lower right, pouch standing behind at left; clear space top left.
4 Camera, light:   Counter height, 40 cm away, sharp throughout. Morning sun from the left, crisp shadows, saturated colour, glossy foil highlights.
5 Words:           Words: "Rip. Tip. Enjoy." top left, large bold rounded sans-serif, colour #00582D. Only these words.
Keep:              Match Images 1 and 2 exactly: glossy deep green stand-up foil pouch; big yellow wordmark, yellow bear face top right; "28 Daily Packs" at the bottom; small opaque deep-green bears, soft matte; daily pack torn straight across the top only. Labels as printed, uncovered.

IMAGES     Image 1 = the real pouch (copy its shape, colours and printing); Image 2 = the real daily pack (copy its shape, colours, printing and tear); Image 3 = layout to follow for structure only. All three are named but not seen, so the photo match is still to do.
LEFT OUT   Shaker bottle version (rejected). "Tear. Pour. Done." (rejected copy). "HEADLINE HERE" (placeholder in the layout sketch). "Pop, really bright, vibrant, super bright, fun, candy-like" became morning sun, crisp shadows, saturated colour and glossy highlights. "Never clinical" became a warm oak counter. The pouch's resealable top was kept as "closed pouch", since it isn't opened in this scene.
           Added, not in the brief: pale oak counter, window, morning sun from the left, right hand pours into the left palm, pouch at left behind the hands, counter-height camera 40 cm away, bold rounded sans-serif font.
CHECK THE FIRST IMAGE (pass or fail)
[ ] Product: the pouch and daily pack match Images 1 and 2 side by side and zoomed in (shape, glossy deep green foil, yellow wordmark, bear face top right, "28 Daily Packs" spelt right at the bottom). The daily pack is torn straight across the top only. The bears are small, opaque, deep green and matte. Size against the hands looks believable.
[ ] Words: "Rip. Tip. Enjoy." appears once, top left, in #00582D, spelt right, with no extra text, badges or stray letters.
[ ] Action: bears pour from the torn top of the daily pack into the palm in one believable amount. The big pouch stays closed and untorn.
[ ] Hands: adult hands, five fingers each, and a grip a hand can make. The left palm is cupped under the pour. No finger covers either label.
[ ] Light: sun comes from the left on both products. The shadows match, the foil reflects only this kitchen, and the pouch stands on the counter.
[ ] Camera: counter height, about 40 cm away, pouch at left behind the hands, clear space top left.
FAILURE NOTE  Asked: none yet. Got: none yet (fill in once the first image is back).
MISSING    photo role: Images 1–3 not seen; no in-hand photo for true size; no close-up of the bears | product fact: how many bears are in one daily pack (one real amount); the daily pack's colour, material and printing; how big the pouch and daily pack are against a hand
CHECKS MISSED  none
```

To finish it: paste the prompt with Images 1–3 into ChatGPT (GPT Image) or Gemini, or into Higgsfield's image tool. In Claude Code with `OPENAI_API_KEY` saved, I can send it to the OpenAI image API and save the file. OpenAI bills each picture.

Next, would you like to check the image before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? Bring this image prompt. You can also name something else.
```
