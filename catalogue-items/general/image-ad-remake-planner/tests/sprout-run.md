# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable carousel plan: every locked word is placed in order, the turn lands on a swipe, and the prompts stay faithful to the brand file without inventing anything. It honestly flags what it could not see or verify (photos, frames, offer currency, the 21 vs 20+ count) and leaves decisions to the owner.

## Judge list

- Met: Read the cards and the post text in order. They match the original word for word.
  Cards 1–5 carry the five lines verbatim; card 5 adds the offer unchanged; "The remake has 48, all on the cards, in order and unchanged."
- Met: The reveal has its own card, so it lands on a swipe.
  "The turn gets its own card (card 3), so it lands on the swipe from card 2."
- Met: Each card has a headline of 7 words or fewer or is flagged, with at most 3 other things to read.
  Cards 1 (9) and 4 (11) flagged "Headline over 7 words, kept whole"; card 5 has headline plus a two-line offer only.
- Met: No new claim, number or offer appears anywhere, including in the prompts.
  Prompts end "No text"; pouch details ("28 Daily Packs", no white burst for Low Sugar) come from brand.md; CTA left as a platform setting.
- Met: The product matches your photos, with your real pack laid on.
  Photos unseen, so correctly marked: "This step is still to do: the images aren't made and I haven't seen the photos."

## What went in

```text
Original ad: a 20-second narrated video (an earlier Sprout script,
not a live ad).
1 "Greens powder takes a scoop, water and a shaker."
2 "Then the shaker needs washing."
3 "A Sprout pack takes one tear."
4 "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6
   grams of fiber."
5 "One tear. That's the routine."
Offer on screen: "$29.99 first order with text sign-up. Renews at
$49.99 every 4 weeks." Post text: none on file.
New format: carousel, 4:5, Instagram feed.
Product: glossy deep green stand-up pouch, big yellow wordmark,
yellow bear face top right. Photos: pouch front, daily pack in a
hand. The daily pack tears straight across its top edge only.
Colors: deep forest #002C17, warm cream #FFF7DF. Font: Work Sans.
Brand file: attached (brand.md).

[attached: sprout/brand.md]
```

## What came out

```text
I can't make pictures in this chat, so you get the prompts, and the end of this plan says how to turn them into images.
The pouch-front and pack-in-hand photos are named but not attached, so I haven't seen them. The product's look comes from your message and brand.md, and the pack overlay is still to do.

## 1. Laid out

No frames were attached, so the original pictures are unknown (MISSING). The parts below come from the script.

| # | Time | Words (spoken / on screen) | Job |
|---|---|---|---|
| 1 | MISSING | "Greens powder takes a scoop, water and a shaker." | Opening / problem (the old way) |
| 2 | MISSING | "Then the shaker needs washing." | Problem, made worse |
| 3 | MISSING | "A Sprout pack takes one tear." | Turn |
| 4 | MISSING | "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6 grams of fiber." | Proof |
| 5 | MISSING | "One tear. That's the routine." | Payoff / close |
| On screen | first appears: MISSING | "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks." | Offer |

## 2. The beat that sells

**The beat:** the step count flips on line 3. The powder routine takes a scoop, water, a shaker and then washing up. Sprout takes one tear. The beat rests on **order (a turn)** and on **sound** (narration).

- **Carousel fit:** good. The turn gets its own card (card 3), so it lands on the swipe from card 2. The narration moves onto the cards as on-image lines.
- **Risk:** the turn only lands for people who swipe. Cards 1 and 2 show the rival routine and no Sprout product. Anyone who sees only card 1 gets the problem without the product (see Checks missed).
- **Risk:** the original has no spoken call to action. None is added on the image. A Meta CTA button (e.g. "Shop Now") is a platform setting for the owner to choose.

## 3. Layout

**Size:** 4:5, 1080 x 1350, Instagram feed. Five cards share one size and one look:
- solid deep forest #002C17 headline band;
- warm cream #FFF7DF type in Work Sans Bold;
- bright, sunny photo below the band.

| Card | Zone map (top to bottom, % of height) |
|---|---|
| 1 | 0–26% solid #002C17 band with headline, two lines, cream, 72 px · 26–100% photo, busiest detail kept in 40–90% |
| 2 | 0–20% #002C17 band with headline, one line, 80 px · 20–100% photo |
| 3 | 0–20% #002C17 band with headline, one line, 80 px · 20–100% photo, torn edge of the pack at about 45–55% |
| 4 | 0–32% #002C17 band with headline, three lines, 64 px · 32–100% photo, palm of gummies at about 50–85% |
| 5 | 0–18% #002C17 band with headline, 80 px · 18–80% photo on cream gradient, pouch centred · 80–100% solid #002C17 offer panel with two lines, cream, Work Sans Medium, 34 px |

## 4. Card table

| Card | Line (locked) | Words | Flag | Picture |
|---|---|---|---|---|
| 1 | "Greens powder takes a scoop, water and a shaker." | 9 | Headline over 7 words, kept whole | Kitchen counter. A scoop of green powder is held over an open shaker, next to an unbranded tub and a glass of water. |
| 2 | "Then the shaker needs washing." | 5 | none | The same kitchen. A shaker with green residue sits under a running tap in the sink. |
| 3 | "A Sprout pack takes one tear." | 6 | none | A hand tears a Sprout daily pack straight across its top edge. |
| 4 | "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6 grams of fiber." | 11 | Headline over 7 words, kept whole. The brand's own site also says "20+" and "over 20" vitamins and minerals, so check the count is consistent. | Small opaque deep-green gummy bears pour from the torn top of the pack into an open palm. |
| 5 | "One tear. That's the routine." + offer "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks." | 5 + 12 | Offer flags, see Notes | The Sprout pouch front, closed, on a cream gradient. A torn daily pack and a few gummies sit in front of it. |

## 5. Image prompts

All prompts are 4:5, 1080 x 1350. Use the product photos as references when you generate.

**Card 1**
> Bright, sunny home kitchen counter, morning light from a window, candy-bright colours, never clinical. Caught in one frame: an adult's hand holds a plastic scoop heaped with fine green powder over an open clear shaker bottle, a few specks of powder in the air. Beside it: a plain, unbranded tub of greens powder with its lid off and a glass of water. No logos or brand marks on any item. Eye-level, medium close-up. Keep the top quarter of the frame as plain, uncluttered wall for words added later. No text.

**Card 2**
> The same bright kitchen. Caught in one frame: a clear shaker bottle with green powder residue streaked inside sits under a running kitchen tap in a sink, water splashing in, a sponge beside it. No logos or brand marks. Slightly high angle, close-up. Keep the top fifth of the frame calm and plain for words added later. No text.

**Card 3**
> Bright, sunny home setting, soft daylight, warm cream tones in the background. Caught in one frame: an adult's two hands tear a small flat Sprout single-serve daily pack straight across its top edge, mid-tear, the strip just separating. Match the daily pack exactly to the attached pack-in-hand photo. Tear across the top edge only, never the side, bottom or a corner. Close-up, pack centred. Keep the top fifth of the frame plain for words added later. No text.

**Card 4**
> Bright, sunny home setting, soft daylight. Caught in one frame: small opaque, soft matte, deep-green gummy bears, each about thumbnail height, pour out of the torn top edge of a small flat Sprout daily pack into an open adult palm. A few bears are mid-air, a small handful already in the palm. Match the pack to the attached pack-in-hand photo. Close-up, palm in the lower half. Keep the top third of the frame plain for words added later. No text.

**Card 5**
> Product shot on a soft two-colour gradient of warm cream (#FFF7DF) into pale sunny yellow. Centre: a glossy deep green stand-up foil pouch, closed at its resealable top and never torn. It has a big yellow wordmark, a yellow bear face top right and "28 Daily Packs" at the bottom, with no white burst (Low Sugar), matched exactly to the attached pouch-front photo. In front: one small flat daily pack, torn straight across its top, with a few small opaque deep-green matte gummy bears scattered beside it. Bright, candy-like light, gentle shadow. Keep the top sixth and bottom fifth of the frame plain for words added later. No text.

## 6. Post words

- **Primary text:** empty. No post text is on file (flagged). No lines were moved here, because every line sits on a card.
- **Carousel card headline fields:** empty. The original has no lines for them.

## 7. Edit step

**Real pack overlay**
- Cards 3, 4 and 5: cut the real daily pack and the real pouch out of their photos. Lay each over the generated one, matching angle and scale, so every label word is right.
- The pouch reads "28 Daily Packs". The daily pack's label is MISSING.
- This step is still to do: the images aren't made and I haven't seen the photos.

**Where the words go**
- Each headline goes in its #002C17 band, cream #FFF7DF, Work Sans Bold, left-aligned with 64 px margins:
  - card 1: two lines at 72 px;
  - cards 2, 3 and 5: one line at 80 px;
  - card 4: three lines at 64 px.
- The card 5 offer goes in the bottom #002C17 panel, Work Sans Medium, 34 px, as two lines:
  - "$29.99 first order with text sign-up."
  - "Renews at $49.99 every 4 weeks."
- All type is 34 px or more.

**Contrast check**
- Cream #FFF7DF on deep forest #002C17 is about 14.3:1, which passes 4.5:1.
- No words sit on the photos.

## 8. Notes

**Word count:** the original has 48 words (lines 9 + 5 + 6 + 11 + 5, offer 12). The remake has 48, all on the cards, in order and unchanged.

**Number style:** line 4 keeps the script's spelling, "sixty-plus" and "6 grams". The brand writes "60+" and "6g". Switching is the owner's choice.

**Flags:**
- Card 1 and card 4 headlines are over 7 words. They are kept whole.
- Line 4 count: the site says 21 vitamins and minerals in one place and "20+" or "over 20" elsewhere. Make sure the landing page matches 21.
- The offer comes from an earlier script, not a live ad. $29.99 first order and $49.99 renewal match prices seen on the site in late Sept to mid Oct 2026. Several other discounts are live at the same time (52%, 55%, 58%, 61% off). Confirm the offer is current before launch. The words are left as they are.
- The site's small print says the $29.99 price assumes the SMS discount "reserved for new customers only". The card says "with text sign-up" but not "new customers only". Nothing is added; the owner decides.
- The powder comparison uses a generic, unbranded tub and shaker. No rival brand is shown, and powder never appears in Sprout's pack.
- No narrator or person appears. Hands are generic adults, and there are no children.
- The pouch is shown as Low Sugar, with no white burst, to match the $29.99 Low Sugar price. Confirm.

**MISSING:**
- MISSING: original frames, timings and on-screen picture for each part. Pictures are built from the lines and the brand file.
- MISSING: when the offer first appears on screen. It is placed on the last card.
- MISSING: post text for the primary text field.
- MISSING: the daily pack's look and label text word for word (colour, print). Prompts point to the pack-in-hand photo.
- MISSING: the pouch's full label text, word for word, beyond the wordmark, the bear face and "28 Daily Packs", including any Low Sugar marking.

## 9. Checks missed

- Glance test, cards 1 and 2: no Sprout product appears, so a stranger can't name the product from the image alone. It relies on the Instagram account name. The owner can place the pouch, soft-focus, at the edge of these cards, though that softens the turn.
- Product matches its photos with the real pack laid on: not done yet. The images aren't made and the photos weren't seen.

**To make the pictures:**
- **ChatGPT or Gemini:** paste each prompt into a chat with the two product photos attached, and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompts into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, the prompts can be sent to that image API and the files saved. OpenAI or Google bills each picture.

Next, do you want to check it before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker)? Other options are [Article headline image ads](https://useaiblocks.com/skills/article-headline-image-ad-maker), the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer) for the empty post text, or the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer). You can also type your own.
```
