# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A usable, well-structured strip plan that sticks to the one approved claim, the given offer terms and the buyer's own words, with sensible layout maths and a paste-ready prompt. The owner should fix the inferred gummy colour (real gummies are deep green, not yellow) and make sure the drawn torn item is the small daily pack, not the big pouch, before generating.

## Judge list

- Met: Cover the words: you can still tell what was wrong and what changed
  Panel 1 "cloudy shaker bottle with green clumps... powder spilled... one sweat drop"; panel 3 "counter is clean... shaker sits dry and capped", gummies in palm.
- Met: Only one claim appears anywhere, including any cutaway
  "The approved line... stays in the feed text only, so the image carries one claim"; "No cutaway: there's no source for how it works."
- Met: Headline 7 words or fewer, at most 3 other things to read, each 30 px+ and 4.5:1
  "Greens without the shaker." 72 px; caption 40 px; label 36 px; all #002C17/#FFF7DF, "Contrast about 14:1" (checks out).
- Met: Drawn product has no letters, strip ends on the real product photo
  "no letters or logo text"; "Panel 4 (bottom right): an empty bordered cream frame"; "Your real pouch-front photo... placed inside the same border in Canva."
- Met: No drawn person says the product worked, none is an expert or a child
  Hero is "an adult office worker in their 30s"; no dialogue or balloons; "No words, letters... or speech balloons anywhere".

## What went in

```text
Idea: quitting greens powder because the routine is a chore.
Buyer: 28 to 45, office job, has quit powders. Their words: "I've
been choking on [a big-name greens powder] for the last few years",
"not having to clean a shaker bottle".
Product: Sprout daily greens gummies. One daily pack, torn straight
across the top, gummies tipped into a palm. Pouch: glossy deep
green, big yellow wordmark, yellow bear face top right.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. Visible result: none.
Offer: $29.99 first order with text sign-up, renews at $49.99 every
4 weeks.
Colours: cream #FFF7DF, deep forest #002C17. Type: Work Sans bold.
Photos: [pouch front] [daily pack in a hand]
```

## What came out

```text
I can't draw in this chat, so you'll get the image prompt and the steps to make the picture at the end.

**1. Fit and claim**
- **Fit:** Yes. This is a short problem-and-fix routine story: powder and shaker become one pack. It doesn't rely on a real person, and nobody judges gummies by how they pour.
- **Claim:** Your daily greens come in one tear-open pack, with no powder and no shaker to clean.
  - Source: your product description (one daily pack, torn across the top, gummies tipped into a palm).
  - The approved line "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack stays in the feed text only, so the image carries one claim.
- **No cutaway:** there's no source for how it works.

**2. Hero, ink line and palette**
- **Hero line:** an adult office worker in their 30s with a short black bob, round black glasses, a slate-blue cardigan and grey trousers.
- **Ink line:**
  - Bold, even black outlines and flat fills.
  - One shadow tone, which is a 30% halftone dot of the base colour.
  - Thin black panel borders and even cream gutters.
- **Palette:**
  - Black ink.
  - Cream #FFF7DF for backgrounds.
  - Slate blue #6E7F99 (inferred) for the hero and props.
  - Deep forest #002C17 for the pouch, and as halftone sludge in panel 1.
  - Pouch yellow #F5C400 (inferred) for the bear face, the gummies and a thin outline on the pouch.
- **Standing out:** the yellow appears only on the product, so the product is the brightest thing in its panel.

**3. Panels**
1. **Set and grow.** It's a morning office kitchen counter.
   - The hero shakes a cloudy shaker bottle with green clumps stuck to its sides. Powder is spilled on the counter.
   - The hero's mouth is pulled tight, with one sweat drop.
   - There are no words in this panel.
2. **Turn.** This is a close-up at the same counter.
   - The hero's hands tear the deep green daily pack straight across the top. The pack is large and centred.
   - The dirty shaker is pushed to the panel edge and cropped.
   - The caption box sits top left.
3. **Land.** This is the same counter, changed.
   - The yellow gummies are tipped into the hero's open palm, and the hero holds a coffee mug in the other hand.
   - The hero looks relaxed.
   - The counter is clean, and the shaker sits dry and capped on a back shelf.
   - There are no words in this panel. It shows only an easier routine, with no body result.
4. **Photo panel.**
   - Your real pouch-front photo, with the daily-pack-in-hand photo inset, is placed inside the same border in Canva.
   - It carries one label.

**4. Layout**
- **Size:** 4:5, 1080 x 1350.
- **Grid:** 2 x 2, read left to right and top to bottom. The cells are equal and the gutters are even.
- **Zone map (percent of width and height):**

| Zone | Width | Height |
|---|---|---|
| Headline band, cream | 0–100% | 0–17% |
| Panel 1 | 4–49% | 18–57% |
| Panel 2 | 51–96% | 18–57% |
| Panel 2 caption box | 53–80% | 20–27% |
| Panel 3 | 4–49% | 59–98% |
| Cell 4, photo | 51–96% | 59–98% |
| Cell 4 label box | 53–94% | 89–96% |
| Gutters | 2% | 2% |
| Outer margin | 4% at the sides | 2% at the bottom |

**5. Words on the image** (all set in Work Sans Bold in Canva)
- **Headline:** "Greens without the shaker."
  - 72 px, deep forest #002C17 on cream #FFF7DF.
  - Contrast about 14:1.
- **Panel 2 caption:** "Tear. Tip. Done."
  - 40 px, #002C17 on a cream #FFF7DF box with a thin black border.
  - Contrast about 14:1.
- **Cell 4 label:** "1 pack a day"
  - 36 px, cream #FFF7DF on a deep forest #002C17 box.
  - Contrast about 14:1.

That's 4 words in the headline and 2 other things to read. There's no button on the image.

**6. Image prompt**
```
A 4:5 flat ink comic page, 1080x1350. Top 17% is a plain empty cream (#FFF7DF) band. Below it, a 2x2 grid of four equal panels with thin black borders and even cream gutters, read left to right, top to bottom. Style: bold even black outlines, flat colour fills, one shadow tone as halftone dots, limited palette of black, cream #FFF7DF, slate blue #6E7F99, deep forest green #002C17, and bright yellow #F5C400. Simple cartoon features, not realistic faces.

Hero (same in every panel): an adult office worker in their 30s with a short black bob, round black glasses, slate-blue cardigan, grey trousers.

Panel 1 (top left): morning office kitchen counter. The hero shakes a cloudy plastic shaker bottle with green clumps stuck to the sides, green powder spilled on the counter, mouth pulled tight, one sweat drop. Muted colours only, no yellow.

Panel 2 (top right): close-up at the same counter. The hero's hands tear a glossy deep green daily pouch straight across the top; the pouch is large and centred, with a small yellow bear face top right and a thin yellow outline, drawn from the attached pouch photo with its exact shape and colours but no letters or logo text. The dirty shaker is cropped at the panel edge. Leave a plain cream rectangle empty in the top-left corner.

Panel 3 (bottom left): the same counter, clean. Bright yellow gummies tipped into the hero's open palm, a coffee mug in the other hand, relaxed face. A dry capped shaker sits on a back shelf. The gummies and the torn green pack are the brightest things in the panel.

Panel 4 (bottom right): an empty bordered cream frame, nothing drawn inside.

No words, letters, numbers, logos or speech balloons anywhere in the image.
```

**7. Feed copy**
- **First line:** Gave up on greens powder? Your daily greens now come in one tear-open pack.
- **Primary text:**

  > Gave up on greens powder? Your daily greens now come in one tear-open pack.
  >
  > No scooping, no clumps, no shaker bottle to scrub before work. Tear the Sprout daily pack straight across the top, tip the gummies into your palm, done.
  >
  > Each pack: 60+ ingredients, 21 vitamins & minerals, and 6g fiber.
  >
  > Get your first order for $29.99 when you sign up for texts. Renews at $49.99 every 4 weeks. MISSING: how to cancel or skip.

- **Headline:** One pack. No scooping. (22 characters)
- **Button:** Shop Now

**8. Notes**
- **Buyer words used:** "not having to clean a shaker bottle" is turned into "no shaker bottle to scrub" and acted out in panels 1 and 3. "Choking on" sets the grimace in panel 1.
  - Neither phrase is quoted, because they aren't marked as verified reviews.
  - The competitor's name is left out.
- **Claims left out:**
  - Any health or energy result, because there's no visible result.
  - Any comparison with powders on nutrition.
  - Any cutaway.
- **Photos:** I couldn't view the attached photos, so the drawn pack follows your description. Check the shape, the green and the bear-face position against the real pouch.
- **MISSING:**
  - Banned-claims list.
  - Gummy colour (yellow is inferred).
  - Exact pouch yellow hex (inferred).
  - Gummies per pack.
  - Cancel or skip terms for the renewal.
  - What the text sign-up requires.
  - Verified review phrases.

**9. Checks missed**
- The drawn pack hasn't been checked against the real photos, because I couldn't view them.
- The finished picture hasn't been checked, because none has been made yet.

**To make the picture:**
- **ChatGPT or Gemini:** paste the prompt with your pouch photo attached and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana, and free plans have daily limits. You can also paste this whole skill there.
- **Higgsfield:** use its image tool, or connect it to Claude.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. Each picture is billed.
- **Finishing in Canva:** set the three text pieces and drop your pouch photo into cell 4.

Next, do you want to check it with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), make a second ad with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker), test more first lines with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer), or write the page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer)? You can also type your own.
```
