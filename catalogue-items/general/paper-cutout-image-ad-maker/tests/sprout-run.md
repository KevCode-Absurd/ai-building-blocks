# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable plan: one clear swap picture, one signal on the torn edge, honest offer terms in the feed copy, and no invented figures or health claims. It correctly caught that no torn-pack photo was supplied, though a couple of MISSING lines (source for the approved line, one pack per day) are over-cautious given the brand file already covers them.

## Judge list

- Met: You can say the point in one breath, and the proof picture fits the claim's verb.
  One "but": "...but it means measuring, shaking, a gritty, chalky drink and a shaker bottle to scrub after, therefore Sprout..."; verb "takes fewer steps", row of old objects vs pack alone.
- Met: The headline is 7 words or fewer, with at most 3 other things to read.
  "Greens, minus the shaker." (4 words) plus "Scoop. Shake. Scrub.", "Tear. Eat.", "$29.99 first order".
- Met: Every word is 30 px or larger on a 1080 px frame, with its contrast stated at 4.5:1 or more.
  84 px / 14.3:1, 40 px / 10.8:1, 44 px / 14.3:1, 32 px / 14.3:1; ratios check out for the given hex colours.
- Met: There's one signal, and it points at the part that matters.
  "One sunflower #FFCC2E hand-cut paper ring, used once. It circles the torn top edge of the pack, which is the single step."
- Met: The prompt asks for no text, and the product comes from your photo.
  "No text, letters, numbers or logos anywhere except the existing printing on photo 1... keep its shape, colours and every word of its printing exactly"

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
**1. Point, verb, proof picture**

- **Point:** You want your greens every day and expect a scoop of powder to be the easy way, but it means measuring, shaking, a gritty, chalky drink and a shaker bottle to scrub after, therefore Sprout daily greens gummies come in one daily pack you tear and eat.
- **Claim's verb:** "takes fewer steps"
- **Proof picture:** The old steps sit in a row on one side: a half-used tub with its scoop, a shaker bottle and a bottle brush. On the other side the product sits alone: one Sprout pack torn straight across the top, with gummies tipped into a palm beside it.

**2. Paper kit**

- **Material:** The ground is heavyweight cream paper, #FFF7DF. Every piece is scissor-cut, with visible paper thickness and soft, short shadows.
- **Signal:** One sunflower #FFCC2E hand-cut paper ring, used once. It circles the torn top edge of the pack, which is the single step.
- **Photo treatment:** The Sprout pack and the gummies-in-palm stay in full colour from the real photos. All old-way photos (tub, shaker) are black and white. The bottle brush is cut from flat grey paper.

**3. Layout**

- **Size:** 4:5, 1080 x 1350. Recompose for 1:1 rather than cropping. In 1:1, the before row runs across the top half and the after block sits bottom right.
- **Zone map (top to bottom):**
  - **4–15% Headline.** A calm cream band, left-aligned, with 80 px side margins.
  - **18–47% Proof, before.** Tub with scoop, shaker and bottle brush in an even row across the left 75% of the width. They rest on a strip of greyed paper, #D9D9D4.
  - **49–55% Label 1.** A grey #D9D9D4 paper strip directly under the before row, left-aligned.
  - **58–90% Proof, after / product.** The torn Sprout pack, front on, upright, about 40% of the frame width, set right of centre (centre at about 64% across). The gummies-in-palm sits overlapping its lower right corner. The sunflower ring circles the torn top edge.
  - **70–76% Label 2.** A deep forest #002C17 paper strip to the left of the pack, pointing toward it.
  - **92–97% Small line.** Offer line on the cream ground, bottom left.
- The proof spans 18–90% of the height and is off centre, weighted right in the lower half. The product is the only full-colour object, so the eye finds it first.

**4. Words on the image** (set in a design tool, never in the image)

| Element | Text | Type | Colour / background | Contrast |
|---|---|---|---|---|
| Headline | "Greens, minus the shaker." | Work Sans Bold, 84 px | #002C17 on cream #FFF7DF | 14.3:1 |
| Label 1 | "Scoop. Shake. Scrub." | Work Sans Bold, 40 px | #002C17 on grey strip #D9D9D4 | 10.8:1 |
| Label 2 | "Tear. Eat." | Work Sans Bold, 44 px | #FFF7DF on forest strip #002C17 | 14.3:1 |
| Small line | "$29.99 first order" | Work Sans Medium, 32 px | #002C17 on cream #FFF7DF | 14.3:1 |

- That is one headline (4 words) plus 3 other things to read.
- Nothing is under 30 px.
- No text sits on sunflower.

**5. Image prompt**

```
A paper cutout collage photographed flat from directly above, filling a 4:5 vertical frame edge to edge. Even, soft overhead light, no hotspots, short soft shadows under every piece showing real paper thickness. Ground: heavyweight cream paper (#FFF7DF) with a faint natural fibre texture. All pieces are scissor-cut with slightly uneven hand-cut edges, a thin white paper border around each photo cutout.

Top 15% of the frame: empty cream paper, nothing on it.

Upper middle band (18–47% down): a horizontal row of three objects, evenly spaced across the left three-quarters of the frame, resting on a long strip of light grey paper (#D9D9D4). From left: photo 3 is a half-used tub of greens powder with a scoop inside, keep its shape, cut out, black and white; photo 4 is a plastic shaker bottle, keep its shape, cut out, black and white; then a bottle brush cut from flat mid-grey paper. No brand marks on any of them.

Just below that row (49–55%): a blank strip of light grey paper (#D9D9D4), left-aligned, about half the frame wide. Leave it completely blank.

Lower right (58–90%): photo 1 is the Sprout daily greens pack torn straight across the top; keep its shape, colours and every word of its printing exactly, full colour, upright and front on, about 40% of the frame width, centred about 64% across. Photo 2 is gummies tipped into a palm; keep it exactly as photographed, full colour, cut out, overlapping the lower right corner of the pack. One hand-cut ring of sunflower yellow paper (#FFCC2E) circles only the torn top edge of the pack.

To the left of the pack (70–76%): a blank strip of deep forest green paper (#002C17), pointing toward the pack. Leave it completely blank.

Bottom 8%: empty cream paper.

No text, letters, numbers or logos anywhere except the existing printing on photo 1. All strips stay blank. Not a digital vector illustration: real photographed paper with thickness, cut edges and shadows. Only the Sprout pack and the gummies are in colour; everything else is black, white, grey or cream.
```

**6. Feed copy**

- **First line:** No scoop, no gritty sip, no shaker to scrub: tear one Sprout pack and eat. (76 characters)
- **Primary text:**
  No scoop, no gritty sip, no shaker to scrub: tear one Sprout pack and eat.

  If you've quit greens powders over the chalky taste and the bottle in the sink, Sprout daily greens gummies come in one daily pack. Tear it across the top, tip the gummies into your palm, and that's it.

  Your first order is $29.99 when you sign up for texts. It then renews at $49.99 every 4 weeks.
- **Headline:** Greens in one daily pack (24 characters)
- **Button:** Get Offer

**7. Notes**

- **Figures:** None are used on the image or in the copy. Once the source is on file, you can add this approved line to the primary text: "Each pack: 60+ ingredients, 21 vitamins & minerals, and 6g fiber." Its source (supplement facts panel or lab test) needs to be recorded first.
- **Offer:** $29.99 and $49.99 are taken from the offer as given. The renewal sits in the primary text, not only in the description.
- **No image until:** photo 1 (the torn pack) arrives, because the signal sits on the torn edge and the pack must not be redrawn.
- **Missing items:**
  - MISSING: source for "60+ ingredients, 21 vitamins & minerals, and 6g fiber".
  - MISSING: photo of the daily pack torn straight across the top. Only the pouch front was given, and the tear can't be faked on it.
  - MISSING: background-removed cutout of the pack, label sharp.
  - MISSING: plain photos of a greens powder tub with scoop and a shaker bottle, with no brand marks. Fallback is to cut both from grey paper instead.
  - MISSING: cancellation and skip terms for the 4-week renewal, to add to the primary text.
  - MISSING: banned claims list from the brand file. Confirm "chalky"/"gritty" may be used about powders in general.
  - MISSING: confirmation that one pack is the full daily serving.
```
