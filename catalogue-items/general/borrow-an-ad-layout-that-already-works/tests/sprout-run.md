# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest plan: it kept only the centre-and-labels skeleton, filled it with three on-file label facts per pack, dropped the fourth label to respect the glance rule, and stopped for approval with every missing asset named. The owner gets a buildable spec with sourced claims and real risks flagged (serving size in the hand photo, the 21 vs 20+ count), nothing invented and nothing that would break ad rules.

## Judge list

- Met: Every spot marked keep has a named source you can check.
  "60+ ingredients ... in 1 pack" (product page, science page); "6 g prebiotic fiber" (product page, science page); headline keep cites format facts.
- Met: Nothing from the reference survives except the layout. No borrowed claim, badge, number or product.
  "What's left behind from the reference: the reference brand's colours, type, words, product and any person." Only skeleton and label positions kept.
- Met: Every line of copy has a label and a source, and quotes match the review word for word.
  "No scoop. No shaker. One daily pack. | 7 | Our line"; labels 2-4 marked "Fact: product page, science page". No customer quotes used.
- Met: The brand name isn't typed anywhere. The plan places the real logo or says it's missing.
  "MISSING: logo. The brand name will not be typed in its place." Copy lines contain no brand name; slot 5 is "Logo (file)".
- Met: The headline is 7 words or fewer, with no more than 3 other things to read.
  "No scoop. No shaker. One daily pack." is 7 words; label 4 dropped so "the headline plus 3 labels, which is within the limit."
- Met: The verdict follows the rule. If the main spot fails, it switches type or says pick another.
  "The main spot passes... 3 of 9 spots change or drop, which is under half. It stays the same ad." Switches recorded.

## What went in

```text
Brand file: Sprout, daily greens gummies (pasted below: facts,
fine and risky claims, colours, Work Sans, voice, show-it-right
rules).
Photos: the pouch on a soft gradient and gummies poured into a
hand exist. Not attached.
Logo: not attached.

Reference (I can only describe it): another brand's ad. Their
product sits dead centre on a flat colour. Four thin lines run out
to four short labels, two on each side. Short headline across the
top, logo small at the bottom.

Direction: "Use this to show what's in one daily pack, for people
who quit greens powders."
Sizes: 4:5 and 9:16.

[attached: sprout/brand.md]
```

## What came out

```text
I can't make pictures in this chat because no image tool is connected. I'll write the plan and image prompts, and the last section explains how to finish the picture.

# Reference 1: product centre, four labels

## 1. Kit check

| Item | Status |
|---|---|
| Brand facts | On hand (`sprout/brand.md`) |
| Logo file | **MISSING: logo**. The brand name will not be typed in its place. |
| Typefaces | **MISSING: typeface**. Work Sans Bold, Work Sans Medium and DM Mono are named but not confirmed installed. The chunky display font is unnamed, so this plan doesn't use it. |
| Photo: gummies poured into a hand | **MISSING: photo**. It exists but isn't attached. |
| Photo: pouch on soft gradient | **MISSING: photo**. It exists but isn't attached, and this plan doesn't use it (see the product spot). |
| Photo: a single daily pack, torn across the top | **MISSING: photo**. None is on file. It's only needed if you want the pack itself in the centre. |
| Image tool | None connected |

Nothing gets built until the logo, typefaces and hand photo arrive.

## 2. Reading the reference

- **Source:** your description only. I haven't seen the image, so I can't say anything about its colours, product, wording, light or exact proportions.
- **Code:** Look inside · Designed · New. "New" is inferred, because the description shows no offer or rating.
- **Skeleton:** Centre and labels.
- **Eye path (inferred from the description):**
  1. The product, big and dead centre.
  2. The headline across the top.
  3. The four labels, read left then right.
  4. The small logo at the bottom.
- **Share of frame (estimate, not measured):** about 45% picture, 20% words and 35% flat space.
- **The move that makes it work:** one object on nothing, with short labels pinned to it. The parts read in one sweep.
- **Main spot:** the labels. They carry the point of the ad, which is what's inside.

## 3. Spot test

| Spot | What it claims | Proof needed | Proof on hand | Verdict |
|---|---|---|---|---|
| Headline | The ad's one point | Room at phone size, 7 words or fewer | Format facts: no water, no mixing, no shaker | **Keep.** It gets a new line in our voice. |
| Product, centre | "This is the thing, and this is one serving" | A real photo of one daily pack's contents, at an angle that suits centre placement | Hand-with-gummies photo exists. No photo of a single daily pack. It's unconfirmed whether the hand holds exactly one pack's worth. | **Change.** Use the hand photo, cut out onto flat colour, if it shows one pack's worth. Otherwise we need a new photo. The pack isn't generated, because there is no real pack photo to anchor it to. |
| Label 1 | 60+ ingredients | Published fact | "60+ ingredients ... in 1 pack" (product page, science page) | **Keep** |
| Label 2 | 21 vitamins & minerals | One figure with a source | "21" on the product and science pages. The home page and panel say "20+" and "over 20". These don't contradict 21, but they aren't the same figure. | **Keep**, once you confirm 21 is the label count |
| Label 3 | 6 g fiber | Published fact | "6 g prebiotic fiber" (product page, science page) | **Keep** |
| Label 4 | A fourth part | Published fact, and room within the glance rules | Facts exist (e.g. organic kale, spinach, spirulina), but the headline plus 4 labels makes 5 things to read. The limit is the headline plus 3. | **Drop.** It breaks the glance rule. The layout becomes two labels left, one right. |
| Thin lines | Each label belongs to the product | None | n/a | **Keep** |
| Flat colour field | None | Brand colour | Warm cream #FFF7DF | **Change.** The reference colour is swapped for brand cream. |
| Logo, small, bottom | The maker | Real logo file | Not attached | **Keep** the spot. **MISSING: logo** |

## 4. Verdict

- The main spot passes. Three of four labels carry on-file facts, stated per pack, which matches the brand's own wording.
- 3 of 9 spots change or drop, which is under half. It stays the same ad.
- The skeleton is kept and the type is unchanged.
- **Switches recorded:**
  - The labels go from 4 to 3 because of the glance rule.
  - The centre object changes from the reference's product to gummies in a hand. This is because no single daily pack photo exists.
  - The flat colour becomes brand cream.

## 5. Plan (awaiting your approval)

**Direction (word for word):** "Use this to show what's in one daily pack, for people who quit greens powders."

**New code:** Look inside · Designed · New

**Product variant:** Sprout Original (Adults), deep-green bears. Please confirm whether the hand photo shows Low Sugar or Sugar-Free. The ad names neither.

### Zones, top to bottom

**4:5 (1080 × 1350)**

| % of height | Zone |
|---|---|
| 0–5 | Margin |
| 5–19 | Headline, centred, 2 lines |
| 22–84 | Hand and gummies centred, about 55% of width. Labels 1 and 2 sit left at about 35% and 60% height. Label 3 sits right at about 48%. Thin lines run to the gummies. |
| 87–94 | Logo, small, centred |
| 94–100 | Margin |

**9:16 (1080 × 1920), composed on its own**

| % of height | Zone |
|---|---|
| 0–14 | Clear. No words or logo. |
| 15–26 | Headline, centred, 2 lines |
| 28–57 | Hand and gummies, about 60% of width, with the same label positions relative to the hand |
| 59–64 | Logo, small, centred |
| 65–100 | Clear of words and logo. Flat cream only. |

### Copy in reading order

| # | Line | Words | Label |
|---|---|---|---|
| 1 | No scoop. No shaker. One daily pack. | 7 | Our line (built on the fact: no water, no mixing, no shaker) |
| 2 | 60+ ingredients | 2 | Fact: product page, science page |
| 3 | 21 vitamins & minerals | 4 | Fact: product page, science page |
| 4 | 6 g prebiotic fiber | 4 | Fact: product page, science page |
| 5 | Logo (file) | n/a | n/a |

- **Condition beside the claim:** "One daily pack" in the headline is the "per pack" condition. Every label points at that one serving. Nothing says "per gummy", because the brand file flags that as the wrong unit.
- **Total reading load:** the headline plus 3 labels, which is within the limit.

### Type and colour

| Element | Setting | Contrast on cream |
|---|---|---|
| Headline | Work Sans Bold, about 84 px, deep forest #002C17 | About 14:1 |
| Labels | DM Mono uppercase, 34 px minimum, #002C17 | About 14:1 |
| Lines | 3 px, kelly green #007E40 | About 4.8:1 (not text) |

### Claims table

| Line | Label | Source | Keep or cut |
|---|---|---|---|
| No scoop. No shaker. One daily pack. | Our line | Format facts (product page) | Keep |
| 60+ ingredients | Fact | Product page, science page | Keep |
| 21 vitamins & minerals | Fact | Product page, science page. The home page says "20+". | Keep, once you confirm |
| 6 g prebiotic fiber | Fact | Product page, science page | Keep |
| Organic kale, spinach, spirulina + more | Fact | Ingredients panel | Cut (glance rule) |
| "Replaces your powder" or similar | Unsupported | None | Cut. It was never written in. |
| Reference's own labels and claims | n/a | Not ours | Left behind |

### Assets table

| Slot | Source | Status |
|---|---|---|
| Hand with gummies | Real brand photo, background removed onto flat cream with the product pixels untouched | **MISSING: photo** (not attached) |
| Single daily pack (optional alternative centre) | Real photo, torn straight across the top | **MISSING: photo** (not on file) |
| Flat cream field | Set in HTML | Ready |
| Logo | Real file | **MISSING: logo** |
| Work Sans and DM Mono | Installed fonts | **MISSING: typeface** (unconfirmed) |

### Risks

- **Serving size:** if the hand holds more or less than one pack, the ad misstates the serving. You'll need to confirm or reshoot.
- **Gummy count:** the adult per-pack count isn't on file. No count is shown.
- **Vitamin count:** "21" and "20+" both appear on the site.
- **Cut-out quality:** cutting a hand out of a gradient photo can leave edge halos. Each export gets checked zoomed in.
- **Disclaimer:** there's no FDA line, which matches current ads. A rival's label figures could tempt a comparison row. None is added here.
- **What's left behind from the reference:** the reference brand's colours, type, words, product and any person.

**Stop: please approve this plan, or note changes, before anything is built.** Along with approval, I need:
- the logo file
- the hand photo, plus which sugar variant it shows
- confirmation that the fonts are installed
- confirmation that "21" is the count to use

## Finishing the picture

The picture here is your own photo with its background removed, so it needs a cut-out rather than generation. If you later want a daily pack shot generated, it has to be anchored to a real pack photo. After approval I'll write that prompt for `accurate-product-image-ad-maker`. To use it:

- **ChatGPT or Gemini:** paste the prompt into a chat and ask for the image. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** with `OPENAI_API_KEY` (from platform.openai.com/api-keys) or `GEMINI_API_KEY` (from aistudio.google.com/apikey) saved, the prompt can be sent to that API. Each image is billed.
```
