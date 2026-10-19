# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A usable, well-scoped plan: one clear habit claim in the brand's open lane, the offer and renewal stated honestly, no health claims, and photos flagged as placeholders so no image is made yet. One thing to check in production: the torn daily pack is drawn with the big pouch's green-and-bear look, which the brand file says should never appear torn, so confirm the daily sachet's actual look before drawing.

## Judge list

- Met: Cover the words: you can still tell what was wrong and what changed
  Panel 1: leaking shaker of "lumpy green sludge", "three stacked dirty shakers"; Panel 3: "tipping gummies... into an open palm", "The sink is empty".
- Met: Only one claim anywhere, including any cutaway
  Claim "greens without the scoop, shake and shaker"; "There is no cutaway"; the 60+ ingredients line is explicitly left out as "a second claim".
- Met: Headline 7 words or fewer, at most 3 other items, 30 px+, 4.5:1+
  "Greens without the shaker" (4 words), three others at 40/40/36 px, all cream on #002C17 or reverse, "~14.5:1".
- Met: Drawn product has no letters; strip ends on the real photo
  "a plain solid yellow band where the logo sits. No letters on it"; Cell 4 "real product photo of the daily pack in a hand... not drawn".
- Met: No drawn person says it worked, no expert or child
  "one adult office worker", "No other people", "No words, letters... speech balloons"; result shown only as an easier morning.

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
No image tool is connected in this chat, so I'll write the prompt but can't draw the picture.

## 1. Fit and claim
- **Fit:** Yes. This is a short problem-and-fix story about a routine, and the gummies are drawable. The offer has long terms (text sign-up, then a renewal price), so it stays off the image and goes in the feed copy.
- **Claim:** *Your daily greens without the scoop, shake and shaker to scrub: tear the pack, tip it into your palm.*
- **Source:** How the product is used, from the brand brief ("one daily pack, torn straight across the top, gummies tipped into a palm"). The framing comes from the buyer's words "not having to clean a shaker bottle."

## 2. Hero, ink line, palette
- **Hero line:** *One adult office worker in their thirties, short dark curly hair, soft grey cardigan over a cream shirt, round black glasses, simple dot eyes and a line mouth.*
- **Ink line:** Bold even black outlines, flat fills, one soft shadow tone, no halftone, thin black panel borders, even white-cream gutters.
- **Palette (drawn panels):** black ink, cream #FFF7DF, warm grey #B9B2A3 (inferred), pouch green (from photo, about #1E6B3A, inferred), pouch yellow (from photo, about #FFC72C, inferred). The green and yellow appear only on the product, so the pouch is always the most saturated thing in its panel. Deep forest #002C17 is used only for lettering and the headline band, both set in a design tool.

## 3. Panels
- **Panel 1 (set and grow):** A morning kitchen counter. The hero is in work clothes with their bag on one shoulder and is shaking a clear shaker bottle full of lumpy green sludge. The lid has leaked, green powder dust has spilled from a plain unlabeled tub, and a sink behind them holds three stacked dirty shakers. The large thing is the clumpy shaker. Feeling symbol: one sweat drop.
- **Panel 2 (turn):** The same counter. The shaker is pushed to the edge. The hero holds the Sprout daily pack up large in the foreground and tears it straight across the top. The pouch is glossy deep green with a yellow bear face at top right and a solid yellow band where the wordmark sits. It carries no letters. The large thing is the pouch. There is no cutaway, because no source for how it works was given. This panel is wordless.
- **Panel 3 (land):** The same kitchen, changed. The hero has their coat on and stands by the door, tipping gummies from the torn pack into an open palm, relaxed and half-smiling. The sink is empty and one clean shaker sits upside down on the drying rack, unused. No result on the body is shown, only an easier morning. The large thing is the palm of gummies.
- **Cell 4 (photo panel):** The real product photo of the daily pack in a hand, inside the same thin border, placed in a design tool. It is not drawn.

## 4. Layout
- **Size:** 4:5, 1080 x 1350. It is a 2 x 2 grid read left to right, top to bottom, under a headline band. Outer margin is 32 px and gutters are 24 px throughout.
- **Zone map:**

| Zone | x | y |
|---|---|---|
| Headline band (deep forest #002C17) | 0–100% | 0–16% |
| Panel 1 | 3.0–48.9% | 17.2–56.5% |
| Panel 2 | 51.1–97.0% | 17.2–56.5% |
| Panel 3 | 3.0–48.9% | 58.3–97.6% |
| Cell 4, photo | 51.1–97.0% | 58.3–97.6% |

- **Caption boxes:**
  - Panel 1 caption: top 14% of panel 1, cream box with a thin black rule.
  - Panel 3 caption: top 14% of panel 3, same style.
  - Photo label: bottom 14% of cell 4, deep forest strip.
- **1:1 (1080 x 1080), recomposed:** Drop the band. The grid fills the frame with the same margins and gutters. The headline replaces the photo label on the deep forest strip at the foot of cell 4, so the reading count stays the same. Re-crop the photo for the new cell; don't stretch it.

## 5. Words on the image (Work Sans Bold, set in a design tool)
| Words | Where | Size | Colour | Contrast |
|---|---|---|---|---|
| "Greens without the shaker" (4 words) | Headline band | 64 px | Cream #FFF7DF on #002C17 | ~14.5:1 |
| "Scoop. Shake. Choke. Scrub." | Panel 1 caption | 40 px | #002C17 on cream #FFF7DF | ~14.5:1 |
| "Tear. Tip. Done." | Panel 3 caption | 40 px | #002C17 on cream #FFF7DF | ~14.5:1 |
| "One pack a day" | Cell 4 label strip | 36 px | Cream #FFF7DF on #002C17 | ~14.5:1 |

That is the headline plus 3 other things to read. Panel 2 is wordless. The offer button lives in the feed, not on the image.

## 6. Image prompt
```
Three flat ink comic panels in a 2x2 grid on a 4:5 canvas (1080x1350). Leave the top 16% of the canvas as a plain flat empty cream (#FFF7DF) band. Below it, four equal panels with thin black borders and even 24 px cream gutters, read left to right, top to bottom. The bottom-right panel is an EMPTY bordered frame filled with plain flat cream; draw nothing inside it.

Style: bold even black outlines, flat colour fills, one soft shadow tone, no halftone, no gradients. Palette: black, cream #FFF7DF, warm grey #B9B2A3, and only on the product a glossy deep green and a warm yellow taken from the attached pouch photo. Simple, friendly, uncluttered backgrounds.

Hero (same in every panel): one adult office worker in their thirties, short dark curly hair, soft grey cardigan over a cream shirt, round black glasses, simple dot eyes and a line mouth. No other people.

Panel 1 (top left): morning kitchen counter. The hero, bag on one shoulder, shakes a clear shaker bottle full of lumpy green sludge. The lid leaks and green powder dust spills from a plain unlabeled tub. Behind them, a sink holds three stacked dirty shaker bottles. One small sweat drop by the hero's head. The clumpy shaker is the largest object.

Panel 2 (top right): same counter, shaker pushed to the edge. In the foreground, large, the hero tears a small daily pouch straight across the top. Draw the pouch from the attached photo: glossy deep green, a yellow bear face at top right, a plain solid yellow band where the logo sits. No letters on it. The pouch is the brightest, most saturated thing in the panel.

Panel 3 (bottom left): same kitchen. The hero, coat on, stands by the door, relaxed with a small smile, tipping gummies from the torn green pouch into an open palm. The sink is empty. One clean shaker sits upside down on a drying rack. The palm with gummies is the largest object.

No words, letters, numbers, logos, captions, speech balloons or sound effects anywhere in the image. Do not imitate any named artist or comic.
```
Attach the pouch-front and daily-pack-in-hand photos with the prompt.

## 7. Feed copy
- **First line (80 characters):** Your daily greens, now a gummy you tip into your palm. No scoop, no shaker.
- **Primary text:**
  > Your daily greens, now a gummy you tip into your palm. No scoop, no shaker.
  >
  > If you've quit powders because of the clumps and the sink full of bottles, Sprout comes in one tear-open pack a day. Tear, tip, done.
  >
  > Get your first order for $29.99 when you sign up for texts. Your plan then renews at $49.99 every 4 weeks. [MISSING: cancellation terms]
- **Headline (18 characters):** First order $29.99
- **Button:** Shop now

## 8. Notes
- **Buyer words used:** "choking" became the panel 1 caption "Choke". "Not having to clean a shaker bottle" shaped the claim, headline and panel 3. The big-name competitor is never named or drawn, and the tub is unlabeled.
- **Claims left out:** "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack. It's approved, but it's a second claim, so it belongs in a second ad. There are no comparisons to powders on nutrition, and no body results.
- **Couldn't check:** The photos came through as placeholders, so I planned from your description. Pouch colours, the bear face placement and the gummies' colour and shape are inferred.
- **MISSING:**
  - The real product photos: pouch front and daily pack in a hand, label sharp. No image should be made until these are attached.
  - Gummy colour and shape.
  - Cancellation terms for the renewal.
  - Whether any buyer phrase comes from a verified review. None is used as a quote until it's confirmed.

## 9. Score
**Score: 100/100 (5 of 5 checks)**

## Finishing the picture
- **ChatGPT or Gemini:** Paste the image prompt into a chat with both product photos attached and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** With `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. Get keys at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.

After you have the panels, letter the words and place the real pack photo in cell 4 in a design tool.
```
