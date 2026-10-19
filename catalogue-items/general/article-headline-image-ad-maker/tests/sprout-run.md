# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable brief: the on-image line is cut straight from the approved ad, the photo is a candid sink-and-shaker scene with no product or brand marks, and the scent check honestly scores 50 while telling the owner exactly what to change on the product page. Its only caution is that it could not verify spelling on an image that doesn't exist yet, which it flags rather than claims.

## Judge list

- Met: The line on the photo matches the page's first screen, or the scent check says how to fix it.
  "Words: fix... Add a first line that names the situation, e.g. 'Every evening, shaker soaking in the sink'" and "Open the page on the same sink and shaker photo."
- Met: It's 7 words or fewer, and every letter is right on the finished picture.
  "Every evening, shaker soaking in the sink" (7 words); prompt spells it identically and flags the letter check as pending until an image exists.
- Met: It says only what your copy supports. No invented number and no named expert.
  Line is cut from the story's "Every evening ended the same way: the shaker soaking in the sink"; no numbers, no expert.
- Met: Nothing looks like a newspaper. There is no masthead, outlet name, byline or date.
  "Leave out: script fonts, the brand font, masthead, byline and date." Prompt: "No other text, no logos".
- Met: The line under the image is different from the line on it.
  "One pack, no shaker to rinse" (28 characters), distinct from the on-image line and supported by "No water, no shaker."

## What went in

```text
Story ad (approved, built on reviews 4 and 6):
I'd been choking on a greens powder for years. Every evening
ended the same way: the shaker soaking in the sink, a green film
that wouldn't rinse out.
This year I gave it up. Sprout is one daily pack: tear the top,
eat the small handful of gummies inside. 60+ ingredients, 21
vitamins and minerals, 6 g prebiotic fiber. No water, no shaker.
30-day money-back guarantee on your first order.

Ad links to: the Sprout product page.
First screen: title "Sprout Superfood Gummies", under it "60+
potent ingredients to revive whole body vitality in great tasting
gummies." First image: the pouch on a soft gradient.

[attached: sprout/product-page.md]
```

## What came out

```text
No image tool is connected here, so this is the brief and prompt. The picture itself is made elsewhere (see the end).

**1. Scene**
"Someone's kitchen sink at night, a greens shaker left soaking with green gunk still stuck inside."

**2. Where and when**
- **Place:** a home kitchen sink.
- **Time:** evening, after dinner, under the warm ceiling light.
- **Within reach:**
  - An unlabelled clear plastic shaker bottle half-sunk in grey-green water.
  - Its lid upside down on the counter edge.
  - A worn sponge, a tea towel and a dish rack with a couple of plates.

**3. The photo**
The moment the story opens on: the shaker that "wouldn't rinse out," shot from standing height and slightly above, as if on a phone.
- The faint green film is visible on the inside walls of the shaker.
- The light is everyday and nothing is retouched.
- **Clear area:** the plain, matte off-white wall above the sink fills the top third. There is nothing on it.
- There is no product, no person and no brand mark.

**4. Words on the image**
"Every evening, shaker soaking in the sink" (7 words)

- **Where it came from:** written from the story's opening ("Every evening… the shaker soaking in the sink"). It is a plain caption line with a time cue, cut from the story's own words.
- **Flag:** the page headline "Sprout Superfood Gummies" is a product name with no situation in it. The line under it ("revive whole body vitality") is a health claim, so neither can be used.
- **The page should change to match:** open with this line or the same situation, or build a separate page for this ad.

**5. Type and place**
- **Position:** one line, centred on the wall in the top third, well clear of the bottom.
- **Type:** plain heavy sans-serif, sentence case, near-black on off-white.
- **Size:** big enough to read at arm's length on a phone.
- **Leave out:** script fonts, the brand font, masthead, byline and date.

**6. Blank version**
The same photo, sink, shaker and empty off-white wall, with no words at all.

**7. Line under the image**
"One pack, no shaker to rinse" (28 characters). It is supported by the ad's "No water, no shaker."

**8. Scent check**
- **Words: fix.** The page's first screen says "Sprout Superfood Gummies / 60+ potent ingredients to revive whole body vitality."
  - Add a first line that names the situation, e.g. "Every evening, shaker soaking in the sink," or "Gave up the greens shaker."
  - Drop "revive whole body vitality."
- **Scene: fix.** The page opens on the pouch on a soft gradient, and the ad opens on a sink and a shaker.
  - Open the page on the same sink and shaker photo.
  - Move the "Vs Powders" reviews (now at the very bottom) up near the button.
  - Not checked by eye: this is based on a description, not a screenshot. MISSING: screenshot of the first screen on a phone.
- **Promise: fix.** The ad promises no water and no shaker, while the page's first screen promises "vitality." Three facts in the ad also don't line up with the page:
  - "21 vitamins and minerals" in the ad, but "over 20" in the page's ingredients panel. Pick one number.
  - "6 g prebiotic fiber": MISSING: where the page states this. It wasn't seen in the captured page text.
  - The guarantee: the ad correctly says "first order only." The plan box just says "30-Day Money-Back Guarantee." Add "on your first order" there so the page keeps the ad's promise.

**9. Image prompt**
> Candid smartphone photo, square 1:1, of a home kitchen sink in the evening under warm ordinary ceiling light. A clear unlabelled plastic shaker bottle lies half-sunk in grey-green water in the basin, a faint green film stuck to its inside walls. Its lid sits upside down on the counter edge beside a worn sponge, a tea towel and a dish rack with two plates. A plain matte off-white wall fills the top third. Centred on that wall, one line of large heavy near-black sans-serif text in sentence case: "Every evening, shaker soaking in the sink". No other text, no logos, no people, no brand colours, natural clutter, not retouched.

**10. Score: 50/100**
(0 scent matches + 4 checks passed) / 8 × 100 = 50.
- **Words missed:** the page title is a product name with a vitality claim under it, not this situation.
- **Scene missed:** the page opens on the pouch on a gradient, not the sink and shaker.
- **Promise missed:** the first screen promises "vitality," not the shaker swap. Its vitamin count (over 20) doesn't match the ad's 21, and the 6 g fiber wasn't found on the captured page.
- **Spelling check not passed yet:** no image exists. Check every letter of "Every evening, shaker soaking in the sink" on the finished picture, and make it again if anything is off.

---

**To make the picture:**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image, Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** save an OpenAI or Google key as `OPENAI_API_KEY` or `GEMINI_API_KEY` and I can send the prompt to that image API and save the file.
  - Get a key at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google).
  - OpenAI or Google bills each picture.
```
