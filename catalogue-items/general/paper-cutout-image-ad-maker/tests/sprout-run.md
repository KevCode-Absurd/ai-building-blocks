# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A usable, careful plan: the point, proof picture, single signal, type sizes and feed copy all follow the rules, and the only facts used are the ones the owner supplied. It rightly refused to show a torn pack it hadn't seen, kept the pouch closed and listed every gap as MISSING, so the owner knows exactly what to supply next.

## Judge list

- Met: You can say the point in one breath, and the proof picture fits the claim's verb.
  "takes fewer steps": "old steps sit as a row of objects on the left... The Sprout pack sits alone on the right." One "but", if a bit wordy.
- Met: The headline is 7 words or fewer, with at most 3 other things to read.
  "No scoop. No shaker. One pack." (6 words) plus two strips and one small line: "a headline plus 3 other things to read".
- Met: Every word is 30 px or larger on a 1080 px frame, with its contrast stated at 4.5:1 or more.
  Sizes 84, 36, 36, 30 px; contrast "14.3:1" for #002C17 on #FFF7DF, which checks out.
- Met: There's one signal, and it points at the part that matters.
  "A single sunflower (#FFCC2E) paper ring circles the Sprout pack. Nothing else points."
- Met: The prompt asks for no text, and the product comes from your photo.
  "No text, letters or numbers anywhere except the words already printed on the product in photo 1"; "Keep its shape, colours and every printed word exactly as photographed."

## What went in

```text
Point: the powder routine has too many steps; a pack has one.
Buyer: has quit greens powders. Words: "gritty/chalky", "not having
to clean a shaker bottle". Old way: a half-used tub and a shaker.
Product: Sprout daily greens gummies. One daily pack, torn straight
across the top, gummies tipped into a palm.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack.
Photos: pouch front, gummies in a hand.
Colours: cream #FFF7DF, deep forest #002C17, sunflower #FFCC2E.
Type: Work Sans bold and medium.
Offer: $29.99 first order with text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
I can't make the picture here, so you'll get the prompt to paste into an image tool.

## 1. Point, verb, proof picture
- **Point:** You scoop greens powder into a shaker every morning and expect an easy healthy habit, **and** it should take a minute, **but** it's scoop, shake, chug, then scrub the bottle, **therefore** Sprout puts your daily greens in one pack you open and chew.
- **Claim's verb:** "takes fewer steps"
- **Proof picture:** The old steps sit as a row of objects on the left: the half-used tub, a scoop, the shaker and a scrub sponge. The Sprout pack sits alone on the right. Order comes from the row itself, with no arrows or numbers.

## 2. Paper kit
- **Material:** The ground is cream paper (#FFF7DF) with a fine fibre texture. The old-way objects are scissor-cut, with visible paper thickness and soft short shadows.
- **Old way:** The tub, scoop, shaker and sponge are cut from plain warm-grey and mid-grey papers. They have no brand marks or printing, and they look greyed out and dull.
- **Signal:** A single sunflower (#FFCC2E) paper ring circles the Sprout pack. Nothing else points.
- **Photo treatment:** The product comes from the real photos in full colour. There are no other photos.
- **Type:** No words are drawn on the paper. Type is set afterwards in Work Sans.

## 3. Layout
**Size:** 4:5, 1080 x 1350. If you also want 1:1 (1080 x 1080), recompose it: shorten the old row's height and keep the same order.

| Zone (top to bottom) | % of height | What sits there |
|---|---|---|
| Headline band | 0–16% | Calm cream paper, nothing else |
| Proof | 16–68% | Left, x 4–54%: the old row in a slight upward diagonal (tub, scoop, shaker, sponge). Right, x 58–96%: the Sprout pack front-on inside the sunflower ring, with photo 2 (gummies in a hand) tucked low against its lower-right edge. |
| Labels | 68–78% | Two blank deep forest (#002C17) paper strips, one under each side |
| Product | sits inside the proof zone, right side, front-on | Pouch label sharp and facing camera |
| Small line | 80–92% | Blank cream area for the claim line |
| Margin | 92–100% | Clear cream |

- **Proof size:** The proof fills about 52% of the height and sits off centre, with the old row taking the larger, left share.
- **Slot A:** Slot A is the product position. `MISSING: photo of the daily pack torn open`. Until you supply it, photo 1 (the pouch) goes there, **closed and unchanged**.

## 4. Words on the image
| Text | Font / size | Colour | Background | Contrast |
|---|---|---|---|---|
| "No scoop. No shaker. One pack." (headline, 6 words) | Work Sans Bold, 84 px | Deep forest #002C17 | Cream #FFF7DF | 14.3:1 |
| "Scoop, shake, chug, scrub" (left strip) | Work Sans Medium, 36 px | Cream #FFF7DF | Deep forest strip | 14.3:1 |
| "One pack. Just chew." (right strip) | Work Sans Medium, 36 px | Cream #FFF7DF | Deep forest strip | 14.3:1 |
| "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack" (small line, two lines, centred) | Work Sans Medium, 30 px | Deep forest #002C17 | Cream #FFF7DF | 14.3:1 |

That is a headline plus 3 other things to read. The offer stays in the feed copy.

## 5. Image prompt
```
A paper cutout collage photographed flat from directly above, filling a 4:5 frame (1080 x 1350). Ground: cream paper #FFF7DF with fine visible fibre texture. Even, soft overhead light; every cut piece shows real paper thickness and a soft, short shadow. Photographed paper, not a digital vector look.

Top 16% of the frame: plain empty cream paper, nothing on it.

Middle band (16% to 68% of the height):
Left side (x 4–54%): a row of four scissor-cut paper objects rising in a gentle diagonal from left to right: a half-used powder tub with its lid off and a little grey-green powder inside, a small powder scoop, a tall shaker bottle, and a kitchen scrub sponge. Cut from plain warm-grey and mid-grey papers so they look dull and greyed out. No logos, no brand marks, no printing on them.
Right side (x 58–96%): [SLOT A] photo 1 is the Sprout daily greens pouch, shown front-on. Keep its shape, colours and every printed word exactly as photographed. Keep it closed and unchanged; do not tear, open or redraw it. Cut it out cleanly with a thin white paper edge. Around it, one ring cut from sunflower-yellow #FFCC2E paper. This ring is the only pointer in the image. Photo 2 is gummies in a hand. Keep the hand and gummies exactly as photographed. Cut it out and place it low against the pouch's lower-right edge, slightly overlapping, in full colour.

Below the middle band (68–78%): two blank deep forest #002C17 paper strips, one centred under the left row and one under the pouch.
Below that (80–92%): plain empty cream paper.

No text, letters or numbers anywhere except the words already printed on the product in photo 1. The strips stay blank. No arrows, dashed lines, numbered circles or connecting lines. No other photos, no people's faces, no other brands.
```

## 6. Feed copy
- **First line (78 characters):** Scoop, shake, chug, scrub. Your greens routine has four steps. Sprout has one.
- **Primary text:**
  Scoop, shake, chug, scrub. Your greens routine has four steps. Sprout has one.

  No measuring, and no shaker bottle to clean. Sprout daily greens gummies come in one daily pack: open it and chew. 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack.

  Sign up for texts and your first order is $29.99. After that it renews at $49.99 every 4 weeks. `MISSING: how to cancel or skip, and what one order contains`
- **Headline (24 characters):** Greens in one daily pack
- **Button:** Shop Now

## 7. Notes
- **Figures:**
  - "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack" uses the approved claim wording you gave. `MISSING: the label or lab document behind it, on file`
  - "four steps" is a count of the objects shown, not a measured figure.
- **Change from your brief:** I didn't show a torn pack with gummies tipped into a palm. I haven't seen the photos, and your facts name both a pouch and a daily pack, so it isn't confirmed which one tears or how. The pouch stays closed, and the gummies come only from your hand photo.
- `MISSING: photo of the daily pack torn open` (for Slot A)
- `MISSING: confirmation of whether the pouch and the daily pack are the same item`
- `MISSING: the actual photo files`. The pouch front and gummies-in-hand photos were described, not attached, so I couldn't check label words, shape or sharpness.
- `MISSING: plain photos of the old way`. The tub, scoop, shaker and sponge are drawn as generic paper cutouts instead.
- `MISSING: cancellation and skip terms, and the number of packs per 4-week order`
- "Gritty/chalky" is left out on purpose. It would be a second "but", and there's no approved texture or taste claim.
- **To finish it:**
  - **ChatGPT (GPT Image) or Gemini (Nano Banana):** Paste the prompt with both photos attached. Free plans have tight daily limits.
  - **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude.
  - **Claude Code:** Save `OPENAI_API_KEY` (platform.openai.com/api-keys) or `GEMINI_API_KEY` (aistudio.google.com/apikey) and I can send the prompt and save the file. Each picture is billed by OpenAI or Google.
  - Set all type afterwards in Canva or Figma in Work Sans.

## 8. Checks missed
- Product exact from its photo: I couldn't verify this because the photos weren't attached. Check that the label words weren't redrawn once the image is rendered.
- Every figure has a source: the approved claim has no label or lab document on file yet.

Next, do you want to check the copy with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), make another image ad with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker), sharpen the first line with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer), or write the page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer)? Or say what you'd rather do.
```
