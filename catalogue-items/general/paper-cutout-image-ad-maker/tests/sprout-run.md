# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable plan: one fewer-steps point, a proof picture that matches it, a single yellow ring on the torn pack, brand colours and type, the offer with its renewal price in the copy, and no invented numbers. The owner should know the run was over-cautious in docking itself for the 60+/21/6g source (the brand file lists product and science pages), and "Same daily greens" in the first line leans toward equivalence with powders, so soften it if the owner wants to be strict.

## Judge list

- Met: You can say the point in one breath, and the proof picture fits the claim's verb.
  "You take a greens powder... but every scoop comes out gritty and chalky... therefore Sprout puts your daily greens in one tear-open pack." Verb "takes fewer steps", row of greyed objects vs pack alone.
- Met: The headline is 7 words or fewer, with at most 3 other things to read.
  "No scoop. No shaker. One pack." (6 words) plus two strips: "Gritty, chalky, then scrub" and "Tear and eat"; no button or offer line.
- Met: Every word is 30 px or larger on a 1080 px frame, with its contrast stated at 4.5:1 or more.
  72 px headline, 34 px labels, all "#002C17 on cream #FFF7DF | 14.3:1" (ratio checks out).
- Met: There's one signal, and it points at the part that matters.
  "One sunflower (#FFCC2E) torn-paper ring, used once. It circles the torn top of the pack"; prompt adds "nothing else is yellow".
- Met: The prompt asks for no text, and the product comes from your photo.
  "No text, letters or numbers anywhere except the pack's own printing; both strips stay blank"; "photo 1 is the Sprout daily pack. Keep its shape, colours and printing exactly".

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
No image tool is connected in this chat, so I'll write the prompt and you'll make the picture elsewhere. The steps for that are in the Notes.

## 1. Point, verb, proof picture

**Point:** You take a greens powder every day and expect an easy habit, but every scoop comes out gritty and chalky and leaves a shaker bottle to scrub, therefore Sprout puts your daily greens in one tear-open pack.

**Claim's verb:** "takes fewer steps." This suits a paper cutout still.

**Proof picture:** The old routine runs as a row of greyed objects across the upper frame: an open, half-used tub, a scoop of powder, a shaker bottle and a sponge. The Sprout daily pack sits alone below and to the right in full colour. Its top is torn straight across and gummies are tipped into an open palm.

## 2. Paper kit

- **Material:** The ground is cream (#FFF7DF) cardstock. Every piece is scissor-cut with slightly uneven edges. Paper thickness shows at every edge, and each piece casts a soft, short shadow.
- **Signal:** One sunflower (#FFCC2E) torn-paper ring, used once. It circles the torn top of the pack.
- **Photo treatment:** The product is in full colour from its real photos: the pouch, the gummies and the palm. The old-way objects (tub, scoop, shaker, sponge) are black and white and greyed down, with no brand marks.

## 3. Layout

**Size:** 4:5, 1080 x 1350. Recompose for a 1:1 version (1080 x 1080) rather than stretching this one: put the row of 4 objects at 14–44% and the pack and palm at 46–94%.

**Zone map (top to bottom):**
| Zone | % of height | What sits there |
|---|---|---|
| Headline | 0–14% | A calm cream band. The headline is set left. No pieces sit here. |
| Proof: old steps | 14–48% | 4 greyed cutouts in a row, left to right: open tub, scoop with a powder heap, shaker bottle, damp sponge. Each overlaps the next slightly, like a queue. |
| Label 1 | 48–54% | A cream paper strip lying under the row, left of centre. |
| Proof: product | 54–92% | The torn daily pack, front on, right of centre at about 55–85% width, filling about 30% of the frame height. The gummies spill into an open palm just below and left of it. The sunflower ring circles the torn top edge. |
| Label 2 | about 72–78% | A cream paper strip at the left of the palm. |
| Small line | 92–100% | Quiet cream margin. Nothing to read. |

Together the row and the pack take up about 75% of the frame and weight to the right. The pack is the easiest thing to find.

## 4. Words on the image (set afterwards in a design tool)

| Text | Where | Type | Colour / ground | Contrast |
|---|---|---|---|---|
| "No scoop. No shaker. One pack." (6 words) | Headline band | Work Sans Bold, 72 px | Deep forest #002C17 on cream #FFF7DF | 14.3:1 |
| "Gritty, chalky, then scrub" | Label 1 strip | Work Sans Medium, 34 px | #002C17 on cream strip | 14.3:1 |
| "Tear and eat" | Label 2 strip | Work Sans Medium, 34 px | #002C17 on cream strip | 14.3:1 |

That is one headline plus 2 other things to read, within the limit of 3. There is no button or offer line on the image. Nothing is under 30 px.

## 5. Image prompt

> A paper cutout collage photographed flat from directly above, filling a 4:5 frame edge to edge. The ground is a sheet of cream cardstock (#FFF7DF). Every piece is scissor-cut with slightly uneven edges, the paper thickness visible along each edge, and a soft short shadow under each piece. Even, diffuse overhead light, no hot spots.
>
> Top 14% of the frame: empty cream paper, nothing placed there.
>
> From 14% to 48% of the height: a row of four black-and-white, greyed-down photo cutouts running left to right and overlapping slightly like a queue: an open, half-used tub of greens powder with its lid set aside, a scoop holding a heap of dull green powder, a plastic shaker bottle, and a damp kitchen sponge. No logos or brand marks on any of them.
>
> Just under that row, left of centre: one blank cream paper strip lying slightly askew.
>
> From 54% to 92% of the height, right of centre: photo 1 is the Sprout daily pack. Keep its shape, colours and printing exactly, every letter unchanged, front on, with its top torn straight across. Below and to its left, photo 2 is the gummies in an open palm. Keep the gummies' colour and shape exactly, in full colour, with the hand cropped at the wrist. To the left of the palm: one more blank cream paper strip.
>
> One torn-paper ring in sunflower yellow (#FFCC2E) circles the torn top edge of the pack, and nothing else is yellow.
>
> Only the pack and the gummies in the palm are in full colour; everything else is cream paper or greyed. No text, letters or numbers anywhere except the pack's own printing; both strips stay blank. Not a vector illustration: real photographed paper with texture and depth.

## 6. Feed copy

- **First line (82 characters):** "Quit greens powders over the grit and the shaker? Same daily greens, one pack."
- **Primary text:**
  > Quit greens powders over the grit and the shaker? Same daily greens, one pack.
  >
  > No more chalky scoops. No more shaker bottle to scrub in the sink. Tear open one Sprout pack and eat your gummies. 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack.
  >
  > Sign up for texts and your first order is $29.99. After that, it renews at $49.99 every 4 weeks.
- **Headline (18 characters):** "Greens in one pack"
- **Button:** Shop Now

## 7. Notes

- **Figure source:** The claim "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack" is on the brand's approved-claims list, but the facts panel or lab document behind it isn't on file. MISSING: the label facts panel (or lab test) for the 60+, 21 and 6g figures.
- **Offer terms:** MISSING: how to cancel or skip, and any limits on the text sign-up price (first order only? new customers only?). Add these to the primary text before it runs.
- **Photos:** The photos were named but not attached, so I couldn't check the label, colours or shape. MISSING: the pouch front photo and the gummies-in-hand photo as files. MISSING: a photo of one daily pack torn straight across the top, so the tear is real and not drawn in; if the "pouch front" is a larger bag rather than the daily pack, this one is needed. MISSING: a clean cutout of the pack with the background removed and the label sharp. Don't make any image until these are given.
- **Old-way photos:** MISSING: plain photos of an open tub, a scoop, a shaker bottle and a sponge, with no brand marks. Without them the tool will invent these objects.
- **Hand:** Keep the hand anonymous, cropped at the wrist with no face, so no real person appears.
- **Making the picture:**
  - **ChatGPT (GPT Image) or Gemini (Nano Banana):** attach the photos, paste the image prompt and ask for the picture. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
  - **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
  - **Claude Code:** with `OPENAI_API_KEY` (platform.openai.com/api-keys) or `GEMINI_API_KEY` (aistudio.google.com/apikey) saved, it can send the prompt to that image API and save the file. OpenAI or Google bills each picture.
  - **Type:** set the headline and both labels afterwards in Work Sans.

## 8. Score

**Score: 83/100 (5 of 6 checks)**
- Missed: "Every figure has a source, or isn't there." The 60+ / 21 / 6g claim has no label or lab source on file. Attach one, or cut the claim from the primary text.
```
