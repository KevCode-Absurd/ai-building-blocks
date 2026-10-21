# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest plan: three per-pack facts straight from the brand file, a short testable headline, the vitamin-count conflict flagged, and every unattached asset marked MISSING rather than described. The owner gets a buildable HTML spec for both sizes and a clear list of what to supply before it can run.

## Judge list

- Met: Every spot marked keep has a named source you can check.
  "60+ ingredients" in 1 pack (product page, science page); "6g prebiotic fiber" (product page, science page); background "Warm cream #FFF7DF"; logo kept as MISSING slot.
- Met: Nothing from the reference survives except the layout.
  "Skeleton, eye path and flat-colour move kept. Words, labels and colours not carried over (colours unknown)."
- Met: Every line of copy has a label and a source, and quotes match word for word.
  "One pack. Zero powder. | 4 | Our line"; "60+ / ingredients | 2 | Fact | Product page, science page". No customer quotes used.
- Met: The brand name isn't typed anywhere; plan places the real logo or says it's missing.
  "Brand name: never typed"; logo slot reads "[MISSING: logo]" in both sizes.
- Met: Headline is 7 words or fewer, with no more than 3 other things to read.
  "Headline length: 4 words, within 7. Reading load: headline plus 3 things." Label 4 dropped for this reason.
- Met: The verdict follows the rule.
  "The main spot passes: 3 labels, each a fact on file. 2 of 9 spots change or drop... so it is the same ad."

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
I can't make images in this chat, so you'll get the plan, a ready-to-fill HTML build for both sizes, and one optional image prompt.

# Reference 1: centre-and-labels ad (from your description)

## 1. Kit check

| Item | Status |
|---|---|
| Brand facts | `sprout/brand.md`, captured Sept to Oct 2026 |
| Logo file | **MISSING: logo** |
| Photo: gummies poured into a hand | Exists, not attached. **MISSING: photo file** |
| Photo: pouch on soft gradient | Exists, not attached. Not used here (see Assets). |
| Photo: one daily pack torn across the top, pouring into a palm | **MISSING: photo**. This is the best fit for "one daily pack". |
| Typefaces | Work Sans Bold and Medium (free Google Fonts) `[inferred: installed]`. The chunky display font is unnamed in the file, so it is not used. |
| Image tool | None in this chat |

## 2. Reading the reference

- **Working from:** your description only. I haven't seen the image, so its colours, type, line style and spacing are unknown.
- **Code:** Look inside · Designed · New `[audience inferred]`
- **Skeleton:** Centre and labels
- **Eye path:** headline at the top, then the product dead centre, then the four labels (left top, left bottom, right top, right bottom), then the small logo
- **Share of frame** `[inferred from description]`: about 30% picture, 15% words, 55% flat space
- **The move that makes it work:** one object alone on a flat colour, with thin lines tying each short label to it. Every claim visibly belongs to the thing in the middle.
- **Main spot:** the labels. They carry the point, which is what's inside.

## 3. Spot test

*Keep* means the spot does the same job, filled with Sprout's own proof. *Change* means its job or form changes.

| Spot | What it claims | Proof needed | Proof on hand | Verdict |
|---|---|---|---|---|
| Flat colour background | Nothing | A brand colour | Warm cream #FFF7DF | **Keep.** Sprout cream, not the reference's colour. |
| Product, dead centre | "This is the thing" | A real photo of the exact variant at a usable angle | Hand-pour photo (exists, not attached). No photo of a single daily pack. | **Change.** Use the gummies in a cupped palm, cut out onto the cream, instead of a packshot. The pouch photo would show 28 packs against "one pack" labels, and its gradient breaks the flat colour. |
| Label 1 | Contents of one pack | Published fact | "60+ ingredients" in 1 pack (product page, science page) | **Keep** |
| Label 2 | Contents of one pack | Published fact | "21 vitamins & minerals" (product page, science page). The home page and ingredients panel say "20+" or "over 20". | **Keep, flagged.** Confirm 21 on the panel. If not confirmed, use "20+", which is true either way. |
| Label 3 | Contents of one pack | Published fact | "6g prebiotic fiber" (product page, science page) | **Keep** |
| Label 4 | Contents of one pack | Published fact | Facts exist (kale, spinach, spirulina; methylfolate) | **Drop.** A headline plus four labels breaks the glance rule (headline plus at most 3 more). Moved to a test variant. |
| Thin leader lines | Ties a label to the product | Nothing | n/a | **Keep**, 3 lines |
| Headline across the top | Our point | Room at phone size | 4-word line fits | **Keep**, new words |
| Small logo at the bottom | Who it's from | The real logo file | **MISSING: logo** | **Keep**, as a marked empty slot |

## 4. Verdict

- The main spot passes: 3 labels, each a fact on file.
- 2 of 9 spots change or drop (the product and label 4), so it is the same ad.
- There are no fixed choices to protect.
- **Switches recorded:**
  - Packshot becomes a hand of gummies.
  - Four labels become three.
  - "One pack" moves into the headline so the labels read as per-pack facts.

## 5. Plan (approve)

**Direction (word for word):** "Use this to show what's in one daily pack, for people who quit greens powders."

**New code:** Look inside · Designed · New

**Product variant:** Sprout Original (Adults), deep-green matte bears.
- The 60+, 21 and 6 g facts are the Adult pack (about 20 g).
- Kids packs (15 g, 6 gummies) and limited flavours (red lemon slices, stars) must not be in the photo.

**Zones, 4:5 (1080 x 1350)**

| % from top | Content |
|---|---|
| 0–8 | Margin |
| 8–24 | Headline, 2 lines, centred |
| 29–81 | Hand of gummies, centred. Labels at about 35% and 59% on the left, 47% on the right. |
| 81–88 | Space |
| 88–93 | Logo, centred |
| 93–100 | Margin |

**Zones, 9:16 (1080 x 1920), composed on its own**

| % from top | Content |
|---|---|
| 0–14 | Covered band. Cream only. |
| 15.6–27 | Headline |
| 30–59 | Hand of gummies. Labels at about 31%, 47% and 40%. |
| 60.5–63.5 | Logo, clear of the bottom band at 65% |
| 65–100 | Covered band. Cream only, no words. |

**Lines in reading order**

| # | Line | Words | Label | Source |
|---|---|---|---|---|
| 1 | One pack. Zero powder. | 4 | Our line | Format is gummies in single packs (product page FAQ). Written to test, not proof. |
| 2 | 60+ / ingredients | 2 | Fact | Product page, science page |
| 3 | 21 / vitamins & minerals | 4 | Fact | Product page, science page. Panel check needed. |
| 4 | 6 g / prebiotic fiber | 3 | Fact | Product page, science page |

- **Words to read:** headline plus 3 things, 13 words in all. Each label pairs a big number with small words.
- **Conditions:** none needed. No offer, rating or health claim appears.

**Claims table**

| Line | Label | Source | Keep or cut |
|---|---|---|---|
| One pack. Zero powder. | Our line | Product page FAQ (format) | Keep |
| 60+ ingredients | Fact | Product page, science page | Keep |
| 21 vitamins & minerals | Fact | Product page, science page | Keep if the panel says 21. Otherwise "20+". |
| 6 g prebiotic fiber | Fact | Product page, science page | Keep |
| "Replaces your powder" or any match to a powder | None | No proof on file | Cut |
| "100% of daily needs per gummy" | None | Wrong unit (it is per pack) | Cut |
| Star rating, "35,000+ studies", discounts | None | Conflicting or off-type | Cut |

**Assets table**

| Slot | Source |
|---|---|
| Background #FFF7DF | Set in the design. Nothing generated. |
| Centre: cupped palm of gummies | Real file **MISSING** (exists). Remove the background by hand first. Generative clean-up only as a fallback (prompt below). Never generate the gummies. |
| Preferred centre: one pack torn across the top, gummies in the palm | **MISSING: photo** |
| Logo | **MISSING: logo** |
| Type | Work Sans 700 and 500 `[inferred]` |

**Risks**
1. **Handful size.** "One pack" is only true if the hand holds about one pack (about 20 g, "a small handful"). Confirm with whoever shot it.
2. **Variant.** The photo must be Adult Original bears.
3. **Panel count.** 21 must match the ingredients panel, or switch to 20+.
4. **Floating hand.** A cut-out palm can look odd. Judge it at full size. The torn single-pack photo is the fix.
5. **Sugar options.** Confirm 60+, 21 and 6 g hold for both Low Sugar and Sugar-Free.
6. **Answers part of the doubt only.** The ad shows contents. It does not prove a gummy "holds enough to replace my powder", and nothing on it should claim that.

**Test variant (later, change one spot):** swap label 1 to "Kale, spinach, spirulina + more". This is a Fact from the ingredients panel; "organic" is left out because its reach on the panel is unclear.

## 6. Optional image prompt (fallback only)

Use this if a manual background removal isn't possible. It is an edit of the real photo, with the photo attached.

> Edit the attached photo only. Keep the hand and every gummy exactly as photographed: same count, shape, deep-green matte colour, position and lighting. Do not add, remove, reshape or recolour any gummy. Remove the background and replace it with a flat, even colour #FFF7DF. Crop to the cupped palm and gummies, cut just below the wrist with a clean edge. Add a soft, short drop shadow beneath the hand. No text, no logo, no packaging, no extra objects. Output 2160 x 2160 px.

**Check before use:** put the output beside the original at 200% zoom. If the count, shape or colour differs in any way, it fails.

## 7. Build (HTML, type set over the photo, both sizes)

```html
<!-- Sprout · Look inside · v1 · fill MISSING slots, then export each .board at 2x -->
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@500;700&display=swap" rel="stylesheet">
<style>
  .board{position:relative;width:1080px;background:#FFF7DF;font-family:'Work Sans',sans-serif;color:#002C17;overflow:hidden;margin:40px}
  .r45{height:1350px}.r916{height:1920px}
  .hl{position:absolute;left:0;right:0;text-align:center;font-weight:700;font-size:104px;line-height:1.0;letter-spacing:-1px}
  .prod{position:absolute;object-fit:contain}
  .lab{position:absolute;width:270px}
  .lab .n{font-weight:700;font-size:88px;line-height:1}
  .lab .w{font-weight:500;font-size:36px;line-height:1.15}
  .L{text-align:right}.R{text-align:left}
  .logo{position:absolute;left:50%;transform:translateX(-50%);width:220px;height:66px;border:3px dashed #007E40;display:flex;align-items:center;justify-content:center;font:500 30px 'Work Sans';color:#007E40}
  svg{position:absolute;inset:0}
</style>

<!-- 4:5 -->
<div class="board r45">
  <div class="hl" style="top:108px">One pack.<br>Zero powder.</div>
  <!-- MISSING: photo of gummies in a cupped palm (Adult Original), cut out -->
  <img class="prod" src="MISSING-hand-gummies-cutout.png" style="left:340px;top:390px;width:400px;height:700px">
  <div class="lab L" style="left:50px;top:470px"><div class="n">60+</div><div class="w">ingredients</div></div>
  <div class="lab L" style="left:50px;top:790px"><div class="n">21</div><div class="w">vitamins &amp;<br>minerals</div></div>
  <div class="lab R" style="left:770px;top:630px"><div class="n">6 g</div><div class="w">prebiotic<br>fiber</div></div>
  <svg width="1080" height="1350"><g stroke="#007E40" stroke-width="3" fill="#007E40">
    <line x1="332" y1="520" x2="480" y2="610"/><circle cx="480" cy="610" r="7"/>
    <line x1="332" y1="840" x2="490" y2="790"/><circle cx="490" cy="790" r="7"/>
    <line x1="760" y1="680" x2="610" y2="700"/><circle cx="610" cy="700" r="7"/>
  </g></svg><!-- end dots must land on gummies: adjust to the photo -->
  <div class="logo" style="top:1188px">[MISSING: logo]</div>
</div>

<!-- 9:16: covered bands 0–269 px and 1248–1920 px hold no words or logo -->
<div class="board r916">
  <div class="hl" style="top:300px">One pack.<br>Zero powder.</div>
  <img class="prod" src="MISSING-hand-gummies-cutout.png" style="left:345px;top:575px;width:390px;height:560px">
  <div class="lab L" style="left:55px;top:600px"><div class="n">60+</div><div class="w">ingredients</div></div>
  <div class="lab L" style="left:55px;top:905px"><div class="n">21</div><div class="w">vitamins &amp;<br>minerals</div></div>
  <div class="lab R" style="left:765px;top:765px"><div class="n">6 g</div><div class="w">prebiotic<br>fiber</div></div>
  <svg width="1080" height="1920"><g stroke="#007E40" stroke-width="3" fill="#007E40">
    <line x1="337" y1="650" x2="480" y2="740"/><circle cx="480" cy="740" r="7"/>
    <line x1="337" y1="955" x2="490" y2="900"/><circle cx="490" cy="900" r="7"/>
    <line x1="755" y1="815" x2="615" y2="830"/><circle cx="615" cy="830" r="7"/>
  </g></svg>
  <div class="logo" style="top:1160px">[MISSING: logo]</div><!-- bottom edge 1226 px, inside 1248 -->
</div>
```

## 8. Checks

**Passed on the plan and code:**
- **Headline length:** 4 words, within 7.
- **Reading load:** headline plus 3 things.
- **Type size:** smallest is 36 px, above 30.
- **Contrast:** #002C17 on #FFF7DF is about 14:1.
- **9:16 safe zones:** all words and the logo sit between 300 and 1226 px.
- **Spelling:** checked letter by letter: "One pack." "Zero powder." "60+" "ingredients" "21" "vitamins & minerals" "6 g" "prebiotic fiber".
- **Brand name:** never typed.
- **Sources:** no badge, "#1", deadline or unsourced number.

**Pending until the photo and logo are placed** (not yet looked at, so not passed):
- Product side by side with its photo, zoomed in
- Line end dots land on gummies
- No clipping when rendered
- Logo is the real mark, uncovered
- Blur test: the labels and hand show right after the headline

## 9. Review deck (outline)

| Slide | Contents |
|---|---|
| 1 | Reference (your description, as text) beside the 4:5 and 9:16 builds |
| 2 | Copy with labels (section 5 table) |
| 3 | Claims table |
| 4 | Assets and risks |
| 5 | Note history: v1, no notes yet |
| 6 | Empty notes box |

For each note, mark how far it reaches: this image, this layout, this product or every ad. Each new version changes one spot.

## 10. Where everything came from

- **Reference:** your verbal description. Skeleton, eye path and flat-colour move kept. Words, labels and colours not carried over (colours unknown).
- **Copy:**
  - Headline: Our line.
  - Labels: Facts from `brand.md` (product page, science page).
- **Colours:** brand file. Cream #FFF7DF, deep forest #002C17, kelly green #007E40.
- **Type:** Work Sans 700 and 500 `[inferred]`. Display font not used (unnamed).
- **Assets:** none placed yet. No generated product or person.
- **Switches:**
  - Packshot becomes a hand of gummies.
  - Four labels become three.
  - "One pack" goes into the headline.
- **Revision log:** v1, plan and build spec, no owner notes yet.

## Gaps to fill before this runs

- `MISSING: logo` (vector or high-res file)
- `MISSING: photo`: gummies poured into a hand (exists, attach it). Confirm it is Adult Original and about one pack's handful.
- `MISSING: photo`: one daily pack torn across the top, pouring into a palm (preferred centre)
- `MISSING: source`: ingredients panel showing 21 vitamins and minerals (else use "20+")
- `MISSING: source`: confirmation that 60+, 21 and 6 g apply to both Low Sugar and Sugar-Free
- `MISSING: typeface`: the brand's display font name, if you want it for the headline

To get the picture once the photo is attached: paste the prompt in section 6 into ChatGPT (GPT Image) or Gemini (Nano Banana), or into Higgsfield's image tool. In Claude Code with `OPENAI_API_KEY` or `GEMINI_API_KEY` set, it can be sent to that API; each picture is billed.

What next? Check it before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), plan what to test with the [Image ad gap finder](https://useaiblocks.com/skills/image-ad-gap-finder), or score your prompts with the [Old vs new ad prompt scorer](https://useaiblocks.com/skills/old-vs-new-ad-prompt-scorer). Or type your own.
```
