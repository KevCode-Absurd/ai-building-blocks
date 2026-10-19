# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 2.

A well-structured, honest plan: good moment, clean approved-claim headline, full offer terms with renewal, and a proper label-overlay step. But it ignored the brand file's Look section, inventing a hex code and orange gummies that contradict the real deep-green bears, and marked those facts MISSING when they were on file.

## Fix

In 'If something is missing', add: 'Before writing MISSING for a colour, gummy shape or hex value, read the brand file's Look section and use what it gives; only infer when the file is silent.'

## Judge list

- Met: Shown for 2 seconds, someone can say what the product is and the one idea.
  "Pouch centred and large, occupying 24–80%" with headline "6g fiber. In a gummy you'll eat."; one towel-lift moment, no doll.
- Met: The headline has 7 words or fewer, with at most 3 other things to read.
  "6g fiber. In a gummy you'll eat." (7 words); other items are small line, offer, button: exactly 3.
- Met: Every object in the prompt has a material word and a real color.
  "deep green crocheted stand-up pouch", "oatmeal stockinette tea towel", "honey-brown ribbed knitted counter", "amber-orange crocheted gummies", "pale cream felted wool".
- Met: Nothing shows a body getting better, and no face is in close-up.
  No doll in the scene; "No body is shown, nothing is mended"; avoid field lists "human skin, face".
- Not met: The product matches your photos, with your real label laid over it.
  Run itself marks it missed: "could not be verified. No product photos came through"; gummies made amber-orange though brand file says deep-green bears.

## Invented

- other: #1F4D2E or the brand hex (Hex not in files; brand.md gives forest green #00582D, which the run said was MISSING.)
- claim: three small amber-orange crocheted gummies (Brand file says gummies are small opaque deep-green bears; marked inferred but the fact was on file and contradicted.)

## Safety

- Gummies pictured amber-orange when Sprout's gummies are deep-green bears; the ad would misrepresent the product's look and the run does not flag the contradiction.

## What went in

```text
Selling idea: six grams of prebiotic fiber, in a gummy you'll
actually eat.
Buyer: the gut-fix seeker, woman, 25 to 55. Has tried fiber
powders and probiotics. Doubts: "Will this upset my stomach more?"
Runs in the Instagram feed.
Product: Sprout Low Sugar, pouch of 28 daily packs; 6 g prebiotic
fiber per pack. Pouch: glossy deep green, big yellow wordmark
"Sprout", yellow bear face top right, "28 Daily Packs" at the
bottom. Photos attached: front, side, top.
Approved: "Supports digestion and gut health." "60+ ingredients,
21 vitamins & minerals, and 6g fiber."
Never: "fix" the tummy, any result as a promise.
Brand note: point gut-sensitive buyers to Low Sugar.
Offer: $29.99 first order with text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
No image tool is connected here, so this is the prompt and plan, not the picture.

**1. Moment plan**
- **Moment:** The buyer has tried powders and probiotics, so she is comparing fixes. The yarn change is caught halfway: a knitted tea towel half drawn back from the Sprout Low Sugar pouch on a kitchen counter, with three crocheted gummies in front.
- **Show job:** Reveal.
- **Technique:** Blanket lift. The towel is mid-pull, bunched at the pouch's right side, so the whole pouch is uncovered.
- **Fabrics:**
  - Wall: stockinette, warm cream.
  - Counter: rib, honey-brown, for wood grain.
  - Tea towel: stockinette, oatmeal with one tomato-red stripe.
  - Pouch: tight crochet, deep green, stuffed firm. "Sprout" wordmark and bear face in yellow intarsia.
  - Gummies: crochet. Colour is inferred.
  - Quiet area: felted wool, pale cream.
  - Yarn: one worsted thickness throughout.
- **Implied sentence:** "Sprout Low Sugar is a pouch of daily packs, and it's a gummy, not a powder." This is backed by product facts (28 daily packs, gummy format). No body is shown, nothing is mended, and there is no before and after.

**2. Layout:** 4:5, 1080 x 1350
- **0–24%:** Quiet area, pale cream felted wool with no stitches. Holds the headline and small line.
- **24–84%:** Picture. Pouch centred and large, occupying 24–80%, with the towel bunched at the right and gummies at the front edge on the counter.
- **84–100%:** Solid deep-green brand patch. Holds the offer line and button.
- **1:1 version:** Recompose as quiet area 0–22%, pouch 22–82% (shifted left, towel right), green patch 82–100%. Never stretch.

**3. Words on the image**
- **Headline:** "6g fiber. In a gummy you'll eat." (7 words). "6g fiber" is from the approved claim; "gummy" is a product fact.
- **Small line:** "Supports digestion and gut health." Approved claim, word for word.
- **Offer:** "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks." From the brand file's offer; check against the live offer on the day.
- **Button:** "Shop Low Sugar"
- **Type:** All type 30 px or more. Headline about 72 px, small line 36 px, offer 30 px (two lines), button 34 px.

**4. Image prompt**
> A deep green crocheted stand-up pouch, stuffed firm and standing upright at the centre of a small knitted kitchen counter, as an oatmeal stockinette tea towel with one tomato-red stripe is half drawn back from it and bunched in soft folds against its right side; three small amber-orange crocheted gummies sit on the counter in front of the pouch. Setting: a miniature knitted kitchen, warm cream stockinette wall behind, honey-brown ribbed knitted counter with the rib running like wood grain. Yarn: one worsted thickness throughout; the pouch in tight deep green crochet with a soft sheen, a big yellow intarsia wordmark across its upper middle and a small yellow intarsia bear face in the top right corner; the gummies in tight amber-orange crochet. Light: soft window daylight from the left, gentle shadows to the right. Camera: eye level, medium shot of the pouch, shallow focus so the set reads miniature; the top quarter of the frame is a calm, empty stretch of pale cream felted wool with soft fuzz and no stitches, and the bottom sixth of the frame is plain counter edge left clear. Label lines on the pouch: "Sprout" and "28 Daily Packs".

**Avoid field:** human skin, face, photograph, plastic toy, clay, glossy plastic, knitting needles, hands of a maker, text, letters, extra logos

**5. Post words**
- **Primary text:** "Six grams of prebiotic fiber per daily pack, in a gummy you'll actually eat. Gut-sensitive? Start with Sprout Low Sugar, made to support digestion and gut health."
- **Headline field:** "6g fiber. In a gummy you'll eat."
- **Button:** Shop Now

**6. Edit step**
- **Label overlay:** Cut the real pouch out of the front photo and lay it over the crocheted pouch, or lay the real label area over it. "Sprout", the bear face and "28 Daily Packs" must match exactly. Keep the crocheted edges and the towel folds visible around it so it still sits in the wool world.
- **Where the words go:**
  - Headline and small line: deep green (#1F4D2E or the brand hex) on the cream felted area.
  - Offer and button: cream or yellow type on the solid green patch. The button is a yellow pill with green text.
  - Nothing sits over stitches.
- **Contrast check:** Measure each pair with a contrast checker. Each must reach 4.5:1 or more. Deep green on cream should land around 9:1. Check the yellow button against the green patch and darken the green if it's under 4.5:1.
- **Offer check:** Check the $29.99, $49.99 and 4-week terms against the live offer on the day it runs.

**7. Score:** 83/100 (5 of 6 checks)
- Missed: "true shape and real label" could not be verified. No product photos came through in this chat, so pouch shape, proportions and the position of "Low Sugar" are taken from your description, not the photos.

**8. MISSING**
- `MISSING:` product photos (front, side, top). The plan is built from your description only. Please attach them so shape, proportions and label lines can be checked.
- `MISSING:` where and how "Low Sugar" appears on the pouch. It's not in the label description, so it's left out of the stitched label lines.
- `MISSING:` gummy shape and colour. Amber-orange rounded gummies are `inferred`.
- `MISSING:` brand colour hex values. The deep green and yellow are taken from the pouch description.
- `MISSING:` offer end date.

**To make the picture**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** Paste the image prompt into a chat and ask for the picture. Free plans have tight daily limits, and Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** With `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, it can send the prompt to that API and save the file. Get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. Each picture is billed.
```
