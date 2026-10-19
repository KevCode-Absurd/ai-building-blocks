# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 6 of 6 met. Invented facts: 4.

The prompt is solid and keeps the lock lines, the words and the sealed pouch, and it flags missing photos honestly. But it ignores the required output shape: it uses a numbered markdown layout instead of the PROMPT/IMAGES/LEFT OUT/SCORE format, and it adds scene details the brief never approved.

## Fix

In the hand-back step, require the exact output shape block (PROMPT (<chars>), numbered 1-5 lines, Keep, IMAGES, LEFT OUT, CHECK, MISSING, SCORE) instead of free numbered sections. Also add a rule that scene details not in the approved ad, such as counter material and time of day, must be flagged or left out.

## Judge list

- Met: Every attached photo has one stated role.
  Image 1 real pouch; Image 2 real daily pack; Image 3 "not sent. Its only job is the layout".
- Met: Lock lines appear word for word, pack not swapped or simplified.
  Keep line repeats all five lock lines verbatim, including "daily pack torn straight across the top only".
- Met: Approved words appear once, in quotes, with place, or clear space asked.
  Top left, large bold rounded sans-serif text "Rip. Tip. Enjoy." in colour #00582D.
- Met: No rejected idea, research note or placeholder made it into the prompt.
  Shaker, "Tear. Pour. Done." and "HEADLINE HERE" listed under Left out; none in prompt.
- Met: Camera is a real position, and hands say which one holds what.
  "Counter height, 50 cm away"; "right hand tilts the daily pack... cupped left palm".
- Met: Anything it couldn't know is marked MISSING, and product shown closed until answered.
  MISSING lines for photo files, in-hand photo, bear close-up, bear count, pack colour/printing; pouch shown sealed.

## Invented

- other: pale wood counter (Scene detail not in the approved brief, which only said kitchen counter in daylight.)
- other: Bright morning sun from the left (Brief said daylight only; morning and left direction were added, though it is a reasonable translation.)
- other: rounded sans-serif text, large bold (Font look was not approved, though the skill asks for a font look.)
- claim: I got descriptions of all three photos, not the photos themselves. (The run input gave only text labels for the photos, not descriptions, so this is slightly off but it is honest about not seeing them.)

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
I can write and check this prompt, but I can't make the picture because no image tool is connected in this chat.

**1. Prompt** (966 characters, under the 1,000 limit; recount in your tool before pasting)

```
A 4:5 photo for a social ad. Image 1: the real pouch. Image 2: the real daily pack.

An adult's right hand tilts the daily pack, torn straight across the top only, pouring small opaque deep-green bears, soft matte, into the cupped left palm. Behind stands the sealed glossy deep green stand-up foil pouch, label to camera: big yellow wordmark, yellow bear face top right, "28 Daily Packs" at the bottom.

Sunny kitchen, pale wood counter; hands centre-right, pouch behind on the right.

Counter height, 50 cm away, natural lens. Bright morning sun from the left, soft shadows, saturated candy colour.

Top left, large bold rounded sans-serif text "Rip. Tip. Enjoy." in colour #00582D.

Keep both packs exactly as in Images 1 and 2: glossy deep green stand-up foil pouch; big yellow wordmark, yellow bear face top right; "28 Daily Packs" at the bottom; small opaque deep-green bears, soft matte; daily pack torn straight across the top only. Labels as printed and fully visible.
```

**2. Images**
- Image 1: the real product (the pouch). Copy its shape, colours and printing. It stands sealed.
- Image 2: the real product (the daily pack). Copy its shape, colours, printing and tear line.
- Image 3: not sent. Its only job is the layout, and the "Top left" line covers that. Sending it would risk "HEADLINE HERE" showing up in the picture.
- I got descriptions of all three photos, not the photos themselves. So I can't confirm that the lock lines match them, and I can't run the side-by-side checks yet.

**3. Left out**
- The shaker-bottle version and "Tear. Pour. Done." are rejected.
- "HEADLINE HERE" is placeholder text.
- "Pop, really bright, vibrant, super bright, fun" became visible cues: morning sun, saturated candy colour and a pale wood counter.
- Tool and limit settings aren't part of the scene.
- The tearing moment is shown as the pour, with the tear already made, because one still can show only one action.

**4. Check** (run on the first image, zoomed in, beside Images 1 and 2)
1. Product: is the pouch shape, gloss, green, yellow wordmark, bear face and "28 Daily Packs" exact? Is the pouch sealed at its resealable top and not torn? Does the daily pack match Image 2? Is the size believable against the hands? (Pending.)
2. Words: is "Rip. Tip. Enjoy." present once, spelt exactly, top left, in #00582D, with no other added text? (Pending.)
3. Action: is the pour coming from the straight top tear only, with a believable single-serving amount landing in the palm? (Pending.)
4. Hands and faces: are both hands whole and natural, with a real grip? Are both labels fully visible, with no stray letters or logos? (Pending.)
5. Light: does the sun come from the left with soft shadows on both packs? Does the pouch reflect only the kitchen? Is the pouch resting on the counter? (Pending.)
6. Camera: is it at counter height, about 50 cm away, with the hands centre-right and the pouch behind on the right? (Pending.)

**5. Missing**
- MISSING: photo role: Images 1 and 2 themselves. I need the actual files, not descriptions.
- MISSING: photo role: product in a hand, for true size of the pouch and the daily pack.
- MISSING: photo role: close-up of the bears (surface and colour).
- MISSING: product fact: how many bears are in one daily pack. The prompt says "pouring" without a number until this arrives.
- MISSING: product fact: the daily pack's colour and printing. It isn't in the lock lines, so the prompt relies on Image 2 alone.

**6. Score**
- Prompt: 100/100 (5 of 5 checks passed). One caveat on check 1: the image roles rest on your descriptions, not on photos I opened.
- First image: not scored yet. It will be scored on the 6 lines in section 4 once you have it.

**To make it**
- **ChatGPT:** attach Images 1 and 2, paste the prompt, and ask for the picture (GPT Image). Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** paste the prompt into its image tool with the two photos, or connect Higgsfield to Claude.
- **Claude Code:** with `OPENAI_API_KEY` saved (get one at platform.openai.com/api-keys), the prompt can be sent to the OpenAI image API and the file saved. OpenAI bills each picture.

Make one image, run section 4 on it, then fix one thing at a time.
```
