# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 1.

A tidy, usable plan: the Build/glazing idea fits the selling line, every painted ingredient is on the list, the offer terms are exact and the contrast maths checks out. The one real error is calling the pouch 'greens powder' in the image prompt, which would paint the brand as the thing it sells against unless the owner catches it.

## Fix

In step 7 (image prompt), add: 'Name the product's format exactly as the brand file does (e.g. gummy packs) and never use a competitor's format word (powder, pill) for the product.'

## Judge list

- Met: Shown for 2 seconds, someone can say what the product is and the one idea.
  "bands of greens funnel down into its top" plus headline "A whole shelf of greens. One pack." gives one moment, one idea.
- Met: The headline has 7 words or fewer, with at most 3 other things to read.
  "Headline (7 words): 'A whole shelf of greens. One pack.'" then small line, offer, button: exactly 3 more.
- Met: The words sit on bare paper, big and dark enough to read on a phone.
  "Forest green on the cream quiet area, about 64 px"; small line "30 px or larger"; offer on a solid #00582D band, 8.1:1.
- Met: The implied sentence is something your claims let you say, and nothing shows a body changing.
  "One small pack holds a lot of different greens" sourced to the approved 60+ ingredients claim; painted greens all on the list; no body shown.
- Not met: The product matches your photos, with your real label laid over it.
  Prompt says "stand-up pouch of greens powder"; Sprout is gummies. Overlay step exists, but photos unread and the pouch is misdescribed.

## Invented

- claim: A painted deep forest-green glossy stand-up pouch of greens powder (Sprout is a pouch of gummy packs, not powder; powder is the enemy the brand names, so the generated pouch would be wrong.)

## What went in

```text
Selling idea: a whole shelf of greens in one small pack.
Buyer: the quitter who wants to stick, 28 to 45. Gave up greens
powders ("gritty/chalky"). Knows the fixes, not Sprout. Runs in
the Instagram feed.
Product: Sprout Low Sugar, 28 daily packs. Glossy deep green
stand-up pouch, big yellow wordmark "Sprout", yellow bear face top
right, "28 Daily Packs" at the bottom. Photos attached: front,
side, top.
Ingredients include organic kale, spinach, spirulina, chlorella,
wheatgrass, broccoli and beet; acai, goji, pomegranate.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. Never say: fix, energy or immunity results, weight loss.
Colors: forest green #00582D, warm cream #FFF7DF, sunflower
yellow #FFCC2E.
Offer: $29.99 first order with the text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
I can't draw the picture in this chat because no image tool is connected, so this is the plan and the prompt.

**1. Moment plan**
- **Moment:** The buyer already knows the other greens products, so the picture shows the painted change caught halfway. A shelf's worth of painted greens builds up in see-through glazes and gathers into one small Sprout pouch. Three layers are finished and the fourth is still being laid down.
- **Show job:** Build (many parts adding up).
- **Technique:** Glazing, wet-on-dry. There are four see-through layers, and each overlap is a shade deeper than the one beneath it. The pouch itself is painted crisp.
- **Sentence the picture implies:** "One small pack holds a lot of different greens."
- **Source:** The approved claim "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack. Every greens ingredient painted is on your list: kale, spinach, spirulina, chlorella, wheatgrass and broccoli.
- **Left out on purpose:**
  - Beet, acai, goji and pomegranate are left out because red and purple glazed over green turns brown.
  - The painting makes no texture claim, so it says nothing about grit or chalk.
  - No energy, immunity, weight or body change is shown.

**2. Layout: 4:5, 1080 x 1350**
- **0–24% (quiet area):** Bare warm-cream paper. It holds the headline and the small line, and there is no paint in it.
- **24–60% (picture):** Glazed greens in overlapping translucent bands that sweep down and inward. The fourth glaze is half laid and its edge is still wet.
- **50–88% (product):** The Sprout pouch, upright and slightly right of centre, with the crispest edges in the frame. The bands of greens funnel down into its top.
- **88–100% (solid band):** A flat forest green #00582D band holding the offer line and the button.
- **1:1 version (1080 x 1080):** Recompose it rather than cropping. Quiet area top 0–22%, glazes 20–55%, pouch 45–86%, green band 86–100%. Shrink the glaze bands, not the pouch.

**3. Words on the image**
- **Headline (7 words):** "A whole shelf of greens. One pack."
  - Forest green on the cream quiet area, about 64 px.
- **Small line:** "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack"
  - Source: approved claim, word for word.
  - Forest green on the cream quiet area, 30 px or larger.
- **Offer:** "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks."
  - Source: your offer and its terms.
  - Cream on the green band, 30 px or larger, on two lines.
- **Button:** "Shop Sprout"
  - Sunflower yellow #FFCC2E pill with forest green text, or yellow text straight on the green band.

**4. Image prompt**

> A painted deep forest-green glossy stand-up pouch of greens powder, upright in the lower centre-right of the frame, painted crisp and sharp-edged in wet-on-dry watercolour, with the crispest edges in the whole picture. Above and around it, a whole shelf's worth of painted watercolour greens: painted kale leaves, painted spinach leaves, painted broccoli florets, painted wheatgrass blades, and painted blue-green swirls of spirulina and chlorella. They are arranged as four overlapping translucent glazed bands that sweep down and funnel into the top of the pouch. Each overlap is a shade deeper green. Three glazes are dry and the fourth is half laid, its leading edge still wet and shining. Setting: plain warm-cream watercolour paper, no surface or background objects. Paint: cold-press watercolour paper with light granulation in the greens. Analogous palette only: sap green, viridian blue-green, yellow-green, plus the pouch's deep forest green and sunflower yellow. No red or purple. Light: soft, even daylight, with the bare paper as the brightest light. Framing: 4:5 vertical. The top quarter of the frame is completely bare cream paper with no paint. A plain flat area runs along the bottom edge. Painted pouch label: a large yellow wordmark "Sprout", a small yellow bear face top right, and "28 Daily Packs" at the bottom.

**Avoid field:** photograph, 3D render, plastic, brush, hand of a painter, desk, text, letters, red, purple, brown, person, face, child.

**5. Post words**
- **Primary text:** "Kale, spinach, spirulina, broccoli and more in one small daily pack: 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack. First order $29.99 with text sign-up, then $49.99 every 4 weeks."
- **Headline field:** "A whole shelf of greens, one pack"
- **Button:** Shop Now

**6. Edit step**
- **Real pack overlay:** Lay the real pouch, cut out from the front photo, over the painted one. Match its size and angle so "Sprout", the bear face and "28 Daily Packs" are exact. Keep a soft painted edge or shadow so it sits in the painting.
- **Where the words go:** The headline and small line go on the top cream quiet area. The offer and button go on the flat #00582D band. If paper grain shows behind the headline, lay a flat #FFF7DF patch under it, so no words sit on texture.
- **Contrast check:**
  - Forest green #00582D on cream #FFF7DF: about 8.1:1, passes.
  - Cream on forest green: about 8.1:1, passes.
  - Sunflower yellow #FFCC2E on forest green: about 5.7:1, passes.
  - Never use yellow on cream: it fails.
  - Re-check the final exported file.
- **Final checks:**
  - Check the price and terms against the live offer on the day the ad runs.
  - Run the 2-second phone glance test: can a stranger name the product and the idea?

**7. Score: 83/100 (5 of 6 checks)**
- Missed: "Product has its real label." Your photos didn't come through, so I couldn't check the pouch's shape, colours or label text against them. This passes once the overlay is made from the real photos.

**8. Missing**
- MISSING: product photos (front, side, top). They didn't come through, so please re-send them. The label and shape above come from your description only.
- MISSING: the full ingredient list. Only the listed greens are painted.
- MISSING: the offer's end date.
- MISSING: whether "Low Sugar" is printed on the pouch, and where. It isn't painted and isn't used as a claim.

**To make the picture:**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** Paste the prompt into a chat and ask for the picture. Free plans have tight daily limits.
- **Codex:** It can make the picture on a paid ChatGPT plan.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you save an API key as `OPENAI_API_KEY` or `GEMINI_API_KEY`, I can send the prompt to that image API and save the file. Keys are at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.
```
