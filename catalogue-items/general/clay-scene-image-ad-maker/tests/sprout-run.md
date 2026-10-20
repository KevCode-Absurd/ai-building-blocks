# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable plan: the squashed powder tower reads at a glance, the only on-image claim is the approved one word for word, and the offer terms are stated correctly in the feed copy. It correctly treated the pouch photo as absent, flagged every unknown (label lines, pack and gummy look, cancel terms) as MISSING rather than guessing, and honoured the brand's tear-across-the-top rule.

## Judge list

- Met: You can say in one sentence what the object is and what changed it.
  "What changed is the steps. What changed it is the pouch." Tower of tub, scoop, shaker becomes one torn pack.
- Met: There's one moment, one changing object and one character at most.
  "There is no character on the before side, so only one character appears." Split set, one tower, "One moment only."
- Met: The picture shows nothing beyond your approved claims.
  "No body, symptom or health change is shown or claimed." Set shows only the routine and the approved line.
- Met: The headline is 7 words or fewer, with at most 3 other things to read, each at 30 px or more and 4.5:1 contrast.
  "No tub. No scoop. No shaker." 88 px, ~14.3:1; one small line at 32 px, ~8.1:1 (contrast figures check out).
- Met: The product keeps its real label, and nothing is sculpted as letters.
  "the real pouch photo, composited and lit to match"; "No clay letters"; prompt forbids text except the printed label.

## What went in

```text
Idea: people who quit greens powder. The tub, the scoop, the
shaker, then the tub sits half used.
Buyer: 28 to 45, office job, has quit powders. Wants one habit
that lasts.
Product: Sprout daily greens gummies. Pouch of 28 daily packs.
Tear one pack straight across the top, tip the gummies into your
palm. Pouch: glossy deep green, big yellow wordmark, "28 Daily
Packs".
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack.
Colours: forest green #00582D, deep forest #002C17, cream #FFF7DF,
sunflower #FFCC2E. Type: Work Sans bold.
Offer: $29.99 first order with text sign-up, renews at $49.99
every 4 weeks.
Photos: [pouch front]
```

## What came out

```text
I can't make images here (no image tool is connected), so you'll get the prompt to paste, plus how to finish it at the end.

## 1. Fit, changing object, frame

**Fit:** Good. Quitting greens powder is a small everyday problem, and the proof rests on the routine, not on a person you have to believe.

**Changing object:** the morning routine as one clay tower.
- **Before:** a tall, leaning tower of a powder tub, a scoop stuck on its rim and a shaker on top. The shaker has a green crust and there's a crumb spill at the base. The tub is visibly half full, shown by a dull fill line pressed into the clay.
- **Changing:** the tower squashes down, shoulders bulging, and the three pieces press into one mass. (This state is only in the plan. The still shows before and after.)
- **After:** the mass is flattened into one slim daily pack, torn straight across the top, tipping into an open palm.

**Glance test:** A stranger sees a tall, grey, wobbling pile of three things on the left and one small pack in a hand on the right, with the pouch beside it. What changed is the steps. What changed it is the pouch.

**Frame:** a split set. Your buyer has already quit powders, so they know the problem and are comparing fixes.
- **Left:** the before, greyed and cool.
- **Right:** the after, in brand colours.
- One moment only.

## 2. Set

**Finish:** handled. Soft thumbprints on every surface and slightly rounded edges.

**Pieces (4):**
1. An office kitchenette counter slab running across both halves.
2. The tower (left).
3. A plain mug with no logo (left, behind the tower).
4. The pouch (right).

**Stand-ins:**
- Water in the shaker: clear gel.
- Spilled powder: fine sifted crumbs of grey-green clay.
- Mug steam: one thin wisp of cotton wool.
- Gummies: see MISSING.

**Palettes:**
- **Before:** greyed and cool. Slate blue-grey, dull sage and putty.
- **After:** brand colours. Forest green #00582D counter edge, cream #FFF7DF backdrop, sunflower #FFCC2E accents, deep forest #002C17 shadows.

**Character (after side only):** A clay adult, 7 heads tall, average slim build, warm tan clay. Short dark brown hair as one swept shape. Cream button-down shirt and navy trousers. Black bead eyes, and one mark: a blank lanyard badge. Standing relaxed, shoulders down, looking at the open palm with a small closed-mouth smile. There is no character on the before side, so only one character appears.

**Product:** the real pouch photo, composited and lit to match the set's key light (from the left).
- It stands on the right half of the counter, front to camera, within reach of the character's hand.
- It is left out of the before side.
- No clay letters.

## 3. Layout

**Size:** 4:5, 1080 x 1350.

| Zone | x % | y % | Content |
|---|---|---|---|
| Headline band | 0–100 | 0–19 | Plain cream backdrop, headline |
| Split line | 50 | 21–85 | Soft seam where cool light meets warm light (no drawn line) |
| Tower (largest thing) | 10–42 | 22–84 | Before tower on counter, mug behind at 30–40 x |
| Character | 60–92 | 24–85 | After character, palm at 62–74 x, 50–60 y (brightest spot) |
| Pouch | 52–64 | 60–84 | Real pouch, front to camera |
| Counter | 0–100 | 78–86 | Slab across both halves |
| Small line band | 0–100 | 87–100 | Forest green band, small line |

## 4. Words on the image

1. **Headline:** "No tub. No scoop. No shaker."
   - Work Sans Bold, 88 px.
   - Deep forest #002C17 on cream #FFF7DF.
   - Contrast about 14.3:1.
2. **Small line:** "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack"
   - Work Sans Bold, 32 px, two lines.
   - Cream #FFF7DF on forest green #00582D.
   - Contrast about 8.1:1.

That's the headline (6 words) plus one other thing to read. There's no button on the image, because the offer has renewal terms that belong in the text.

## 5. Image prompt

> Photograph of a handmade stop-motion claymation tabletop set, 4:5 vertical, matte modelling clay with a handled finish: soft visible thumbprints and slightly rounded edges on every surface. Shallow depth of field so it reads as a miniature. One soft key light from the left with a gentle fill from the right. Plain cream backdrop (#FFF7DF), smooth and empty across the top fifth of the frame.
>
> A clay office kitchenette counter runs across the whole frame near the bottom. The scene is a split set on the same counter. The left half is lit cool and greyed (slate blue-grey, dull sage, putty). The right half is lit warm in forest green #00582D, sunflower yellow #FFCC2E, cream and deep forest #002C17. The two halves meet in a soft seam of light, with no drawn line.
>
> LEFT HALF: the largest object in the frame is a tall, leaning clay tower. It is a cylindrical greens powder tub with a dull fill line pressed in at half height, a clay scoop stuck on its rim, and a clay shaker bottle balanced on top. The shaker holds clear gel for water and has a crusted green ring. Fine grey-green clay crumbs are spilled at the base. A plain clay mug sits behind it with one thin wisp of cotton wool steam. There is no character on this side.
>
> RIGHT HALF: one clay adult, 7 heads tall, average slim build, warm tan clay, short dark brown hair as one swept shape, cream button-down shirt, navy trousers, black bead eyes, and a blank lanyard badge. They stand relaxed with shoulders down and a small closed-mouth smile, looking at their open palm. Above the palm they hold one slim flat daily pack torn straight across the top, tipping toward the palm. The palm is the brightest spot in the frame. On the counter beside them, within reach and front to camera, stands the pouch from the attached product photo, reproduced exactly: glossy deep green, big yellow wordmark, "28 Daily Packs", with every label word as printed, lit from the left to match the set.
>
> No text, letters, logos or numbers anywhere except the pouch's own printed label. No speech bubbles, no arrows.

## 6. Feed copy

**First line (63 characters):** Quit greens powder? Your daily greens now fit in one torn pack.

**Primary text:**

> Quit greens powder? Your daily greens now fit in one torn pack.
>
> Tear one pack straight across the top and tip the gummies into your palm. That's the whole routine. 1 pack: 60+ ingredients, 21 vitamins & minerals, and 6g fiber.
>
> Sprout daily greens gummies come in a pouch of 28 daily packs. Get your first order for $29.99 when you sign up for texts. Renews at $49.99 every 4 weeks. MISSING: how to cancel or skip.

**Headline (22 characters):** Daily greens, no scoop

**Button:** Get Offer

## 7. Notes

**Claims used:**
- "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack: your approved claim, used word for word.
- "No tub. No scoop. No shaker." and "tear one pack, tip the gummies into your palm": a description of the format and how it's used, from your product notes. This is not a health claim.
- The squashing tower is plainly a metaphor for fewer steps. The real function (tearing a pack and tipping it into the palm) is shown as it really happens.
- No body, symptom or health change is shown or claimed. Nothing promises the habit will last.

**MISSING:**
- MISSING: product photo. "[pouch front]" came through as a placeholder, not an image, so I couldn't check the pouch's shape, colours or label. Attach the real photo before making the image.
- MISSING: every label line on the pouch front. Only the wordmark and "28 Daily Packs" were given. Until the full label is typed out, use the real photo for the pouch, never a recreated label.
- MISSING: what a single daily pack looks like (colour, print, size). Until it's given, the pack in hand is a plain slim shape.
- MISSING: what the gummies look like (colour, shape, how many per pack). Until it's given, they stay hidden by the fingers of the open palm.
- MISSING: the pouch's real size next to a person. I placed it between the character's waist and shoulder.
- MISSING: cancel or skip terms for the subscription.

## 8. CHECKS MISSED

- The product's label can't be confirmed exact as printed, because no readable pouch photo or full label text was given.

---

**To make the picture:**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** paste the prompt into a chat with the real pouch photo attached, or paste this whole skill there.
- **Higgsfield:** use its image tool.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API.

Set the headline and small line afterwards in Canva or Figma, in Work Sans Bold.

**What next?** Check it with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), test more first lines with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer), make another image with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker), or write the page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer). Or type your own.
```
