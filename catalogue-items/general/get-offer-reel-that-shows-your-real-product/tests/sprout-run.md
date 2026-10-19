# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 2 of 5 met. Invented facts: 0.

The run correctly refuses to render, lays out a careful brief and product card, uses only the approved words and offer, and stops at approval 1 without inventing anything. Its weakness is that it ignores Sprout's own brand file, marking variant (Original, 28 packs), opening method (resealable top), label words, guarantee wording and the never-show rules as MISSING and giving no sources for the approved lines, so the owner must re-answer questions already in their files and criteria 3 to 5 remain unverified.

## Fix

In Stage 0 add: "Before writing MISSING, pull variant, pack count, label words, how it opens, guarantee wording, never-show rules and the source page for each approved word from the brand file; write MISSING only for facts the brand file and input both lack."

## Judge list

- Met: Stopped for approval on product card, sheets and storyboard; built nothing before APPROVED
  "Approval 1 of 3: please approve or correct the product card above... Stage 2... starts once it's approved." Nothing built.
- Met: Product on screen in the first frame; identifiable by 2 seconds with sound off
  "Opening (by 2 s): pouch + 'Sprout Superfood Gummies'" and "watched muted, so every message is on screen" (plan only; storyboard not yet made).
- Not met: Every word in the storyboard has a source next to it; full price terms on screen
  No storyboard yet; brief lists words "as supplied" with no sources, though brand file sources them (product page, science page, FAQ).
- Not met: Something new every 2 to 4 seconds; end card 2 seconds or less
  Only a plan: "End card (≤2 s, never frozen)". No beat grid or shot list exists to verify cadence.
- Not met: Review log shows at least three rounds, every score 8 or more
  Stage 5 not reached; no review log exists in the output.

## What went in

```text
Purpose: a "reasons" reel for Sprout, 15 to 20 seconds.
Shapes: 9:16 and 4:5. Music: made in code. Voice: none.
Photos on file: the pouch on a soft gradient; an adult pouring
gummies into a hand.
Approved words and claims:
- "Rip. Tip. Enjoy."
- Title: "Sprout Superfood Gummies"
- "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack
- No water, no mixing, no shaker
- 2025 study, 12 weeks, 120 adults: vitamin C +40.1% (2.7x placebo)
Offer: $29.99 first order with the text sign-up discount. "Renews
at $49.99 each 4 weeks." Button text: "Start Now".
Colours: cream #FFF7DF, deep forest #002C17, sunflower #FFCC2E.
Fonts: Work Sans bold and medium, DM Mono.
```

## What came out

```text
I can't render video in this chat. This reel is built in code (Remotion) by a coding agent such as Claude Code, so no image or video model is used and nothing is generated.

---

## File 1: The filled brief (Stage 0)

**Brand / product:** Sprout Superfood Gummies
**Reel's job:** "3 reasons" reel
**Length:** 15 to 20 s (working target ~18 s, set on the beat grid at Stage 4)
**Shapes:** 9:16 (main), 4:5
**Placement:** `MISSING: placement.` Assumed to be a paid social feed, watched muted, so every message is on screen.
**Audience:** `MISSING: audience.` Assumed to be adults buying for themselves. The pour photo shows an adult.
**Music:** written in code, beat-measured
**Voice:** none

**Approved words, in order as supplied (no new copy will be written):**
1. "Rip. Tip. Enjoy."
2. Title: "Sprout Superfood Gummies"
3. "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack
4. "No water, no mixing, no shaker"
5. Proof: 2025 study, 12 weeks, 120 adults: vitamin C +40.1% (2.7x placebo)
6. Offer: $29.99 first order with the text sign-up discount
7. "Renews at $49.99 each 4 weeks."
8. Button: "Start Now"

**Proposed reel mapping (to confirm at Stage 4):**
- **Opening (by 2 s):** pouch + "Sprout Superfood Gummies"
- **Ritual line:** "Rip. Tip. Enjoy." over the pour photo
- **Reason 1:** "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack, over the pouch
- **Reason 2:** "No water, no mixing, no shaker", over the pour-into-hand photo
- **Reason 3 / proof:** study figure with its source on screen
- **Offer:** $29.99 first order with the text sign-up discount, renews at $49.99 each 4 weeks
- **End card (≤2 s, never frozen):** pouch, logo, "Start Now"

**Brand look:**
- Colours: cream #FFF7DF (ground), deep forest #002C17 (type), sunflower #FFCC2E (assumed to be the single accent)
- Display font: Work Sans Bold. Text font: Work Sans Medium. DM Mono is proposed for figures (40.1%, 2.7x, $29.99) and the source line.
- `MISSING: font files` (.ttf/.otf/.woff2 for Work Sans Bold, Work Sans Medium, DM Mono, plus licence confirmation for video use)
- `MISSING: logo file` (vector SVG or transparent PNG, with light and dark versions if they exist)

**Photos on file:**
- Pouch on soft gradient → `front` (needs a clean cut-out. The gradient can't stay baked in.)
- Adult pouring gummies into a hand → `hand` / `use`

**Questions to answer in one round:**
1. **Study source:** who ran it, its title or citation, and where it is published. What exactly rose by 40.1%? Was it blood or plasma vitamin C level? Give the exact approved on-screen wording. Without a citable source, the proof shot is dropped.
2. **"in 1 pack":** is that wording part of the approved line, or a note? Please send the exact line as it should appear.
3. **Offer terms:** what is the text sign-up discount called, and how does someone get it (text a keyword to a number? sign up on site)? When does the offer start and end? Are there other terms such as cancel anytime, shipping, or limits? Should "Renews at $49.99 each 4 weeks." appear on the same screen as $29.99? I recommend it does.
4. **Accent:** confirm sunflower #FFCC2E is the single accent.
5. **Photos:**
   - `MISSING: pouch front on a clean or plain background` (or a high-res original I can cut out cleanly)
   - `MISSING: unpacked shot` (gummies out of the pouch, on their own)
   - `MISSING: "Rip" photo` (the pouch being torn open), if you want "Rip. Tip. Enjoy." shown as three moments. Otherwise the line sits over the pour photo.
   - Resolution and original files for the pour photo
6. **Product details for the card:** flavour or variant name, pouch size and count, the exact front-label words, and how it opens (tear notch? zip?).
7. **Guarantee wording:** is there one, and may it be used?
8. **Never-show list:** for example, children taking the product, health-cure language, competitor shakers.
9. **Reference video:** do you have one? If so, only its rhythm is borrowed.
10. **End-card action:** is "Start Now" the full action, or should a URL or text number sit with it?
11. **Placement and audience:** confirm the feed or platform and who it's for.

Any photo, claim, or offer detail that doesn't arrive drops its shot. Nothing will be invented.

---

## File 2: The product card (Stage 1)

**Product (the avatar):** Sprout Superfood Gummies pouch
**Exact variant:** `MISSING: flavour/variant and pack size`

**Photo jobs:**
| Job | File | Use in reel |
|---|---|---|
| `front` | pouch on soft gradient (cut out) | opening, Reason 1, end card |
| `hand` / `use` | adult pouring gummies into a hand | "Rip. Tip. Enjoy.", Reason 2 |
| `unpacked` | `MISSING` | would back "60+ ingredients…" (what's inside) |
| `rip` | `MISSING` (optional) | "Rip." beat |

**What never changes (every frame):**
- **Proportions:** the pouch scales as a whole. It is never stretched, cropped through the label, or redrawn.
- **Label words:** exactly as photographed. On-screen type never crosses the label. `MISSING: label text to verify against`.
- **Colours:** the photo's colours as shot. No recolouring or grading toward brand tokens.
- **How it opens:** shown only as the photos show it. `MISSING: opening method`.
- **Gummies:** only the real ones from the pour photo, never drawn, duplicated or animated as particles.
- **Shadow:** a soft contact shadow is added in the film, not baked into the cut-out.

---

**Approval 1 of 3:** please approve or correct the product card above and answer the brief questions. Stage 2 (photo picks and cut-outs) starts once it's approved.
```
