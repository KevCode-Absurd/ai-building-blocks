# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A complete, careful set of prompts: it respected the approvals given ahead, kept the lock lines consistent, honoured the brand's tear-top and never-torn-pouch rules, and flagged the offer mess with the SMS and first-order conditions. Minor nits: Stage 0 sits inside the storyboard file rather than first, and the product line calls #00582D "deep forest green" when brand.md names that hex "forest green".

## Judge list

- Met: Stopped for approval after avatar card, sheets and storyboard, unless approved ahead
  "File 1: Avatar card [approved ahead]", "File 3 ... [approved ahead]", "File 4: Storyboard (approve)" as the input requested.
- Met: Material sentence word for word in every prompt; doll card in every frame she's in
  Lock lines defined once; every frame and clip carries [Material sentence]; [Doll card] in frames 1, 2, 5a, 5b, 7, absent where no doll.
- Met: Every object names its material and a real colour
  "a pale grey-white crocheted tumbler holding beige-grey felted gritty sludge, with a silver-grey crocheted spoon"; pill bottles "white bodies with grey caps".
- Met: Each clip has one camera move and one yarn change, written as yarn behaves
  Clip 4: "the strands wind around each other into one thicker yarn, turning as they go"; Clip 7: arm bends at elbow, hand "as one piece".
- Met: No frame asks for a close-up of a face
  Close-ups are "only her two mitten hands and jumper cuffs" or the strands/pack; continuity: "no face close-ups".
- Met: Label lines short, in quotes, and match the pack
  Label lines on the pouch: "Sprout", "28 Daily Packs" — matches the input's label note and brand.md.

## What went in

```text
Script (from the knitted wool script skill), about 30 s.
Show plan: join, plying. Six leaf-green strands twist into one
yarn that runs into a crocheted daily pack.
1 "Fiber powder. Gritty, every single morning."  She stirs a glass.
3 "Here's six grams of fiber, the easy way."  Six strands, close.
4 "Six strands. One pack."  THE TURN: plying.
5 "Rip. Tip. Enjoy."  Hands tear the pack across the top.
(lines 2, 6 to 8: pills, pouch, offer and close)
Cast note: one crocheted doll. Sketch: a woman about 40, medium
build, shoulder-length dark brown yarn hair in loose waves, a
mustard stockinette jumper, grey rib-knit trousers.
Photos attached: pouch front, side and top. Label: "Sprout" in
yellow, a yellow bear face top right, "28 Daily Packs" at the
bottom. Tear only straight across the top.
Video tool: 8-second clips, takes an end frame, no sound.
Brand file: attached (brand.md).
Approvals: take the avatar card and sheets as approved, and write
every stage now.

[attached: sprout/brand.md]
```

## What came out

```text
I can't make pictures or video in this chat; I'm writing the prompts. The finishing steps are at the end.

I can't see the attached pouch photos here. The pouch's look and label words come from your message and brand.md, and the product sheet's match to the real pack is **still to check**.

---

## File 1: Avatar card `[approved ahead]`

| Field | Detail |
|---|---|
| Role in the story | The powder quitter (brand.md buyer 1). She is tired of a gritty morning fiber drink, finds the easy way, and ends the ad relaxed. |
| Age range | About 40, an adult. |
| Build | Medium. |
| Hair | Shoulder-length dark brown yarn, loose waves. |
| Embroidered features | Small dark brown eyes, short brows and a small smile line, all embroidered `[inferred]`. Light tan crocheted skin `[inferred]`. |
| Clothes | Mustard stockinette jumper, grey rib-knit trousers, deep forest green #002C17 crocheted flat shoes `[inferred]`. |
| Hands | Simple crocheted mitten shapes with a stitched thumb. |
| Props | A crocheted tumbler and spoon (shot 1), crocheted pill bottles (shot 2), a Sprout daily pack (shots 5a, 5b, 8). |
| Voice | None on screen. The narrator is off screen. The doll never speaks. |
| Never changes | Hair length and colour, jumper colour and knit, trouser colour and knit, shoes, mitten hands, face embroidery. |
| Not | A child, a real or famous person, a customer, an expert or the founder. |

---

## File 2: Reference image prompts and the pick

All four prompts open with the material and the word doll. They use the draft material sentence, which is the same wording that was locked in stage 3.

**Ref A**
A crocheted doll of a woman about 40, standing full length and facing the camera, arms relaxed at her sides, a calm neutral pose. Medium build, light tan crocheted skin, shoulder-length dark brown yarn hair in loose waves, small embroidered dark brown eyes, short embroidered brows, a small embroidered smile line. She wears a mustard stockinette jumper, grey rib-knit trousers and deep forest green #002C17 crocheted flat shoes. Her hands are simple crocheted mitten shapes with a stitched thumb. Plain warm cream #FFF7DF stockinette knitted wall behind her, with a garter-stitch floor in oak brown. A small handmade world made entirely of wool: walls in stockinette knit, rugs in garter stitch, wood in rib knit, every object crocheted, powder and steam in felted wool, all worked in one chunky worsted-weight yarn with a soft fuzzy halo, in warm cream #FFF7DF, forest green #00582D, deep forest green #002C17, kelly green #007E40, leaf green, sunflower yellow #FFCC2E and oak brown, lit by soft window light from the left, with shallow focus so the set reads small. Eye level with the doll, full shot.

**Ref B:** the same as A, with one change. Instead of "a calm neutral pose", use "turned three-quarter to the right, weight on one hip, head tilted slightly, a relaxed friendly pose."

**Ref C:** the same as A, with one change. Use "arms crossed loosely, shoulders a little dropped, a tired but warm pose."

**Ref D:** the same as A, with one change. Use "one mitten hand raised at chest height, palm up, as if holding something small."

**Avoid field (all four):** human skin, photograph, plastic toy, clay, knitting needles, hands of a maker.

**Pick: Ref B**, to be confirmed once it's made. The three-quarter turn shows the hair waves, the jumper's stockinette texture and the rib of the trousers all at once. The relaxed pose fits a funny-friend brand better than a stiff front view. It is also the angle most shots use, because the camera stays on the counter's front side.

---

## File 3: Sheet prompts and lock lines `[approved ahead]`

### Lock lines

These are repeated word for word in every later prompt.

**Material sentence**
A small handmade world made entirely of wool: walls in stockinette knit, rugs in garter stitch, wood in rib knit, every object crocheted, powder and steam in felted wool, all worked in one chunky worsted-weight yarn with a soft fuzzy halo, in warm cream #FFF7DF, forest green #00582D, deep forest green #002C17, kelly green #007E40, leaf green, sunflower yellow #FFCC2E and oak brown, lit by soft window light from the left, with shallow focus so the set reads small.

**Doll card**
A crocheted doll of a woman about 40, medium build, light tan crocheted skin, shoulder-length dark brown yarn hair in loose waves, small embroidered dark brown eyes, short embroidered brows and a small embroidered smile line, wearing a mustard stockinette jumper, grey rib-knit trousers and deep forest green #002C17 crocheted flat shoes; her hands are simple crocheted mitten shapes with a stitched thumb.

**Motion sentence**
Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

**Product line**
The Sprout pouch: a crocheted stand-up pouch in deep forest green #00582D with a soft sheen, closed flat at its resealable top, a big sunflower yellow #FFCC2E "Sprout" wordmark in intarsia across the front, a small sunflower yellow bear face in intarsia top right, and "28 Daily Packs" in sunflower yellow along the bottom.

**Daily pack line**
A palm-sized flat crocheted daily pack sachet in forest green #00582D, plain with no lettering.
- This is `proposed`. The real daily pack's look is not on file, so it carries no label words.

**Gummy line**
Small opaque deep forest green #00582D crocheted gummy bears, soft matte, each about the size of the doll's thumbnail.

### Character sheet (image 1 = the woman; built from Ref B)

Character turnaround sheet. [Doll card] The sheet shows:
- front, three-quarter left, three-quarter right, side and back, all full length;
- **tired pose:** shoulders dropped, head tilted down, one mitten hand resting on a counter edge;
- **glancing-away pose:** head turned to her left, shoulders still;
- **easy pose:** upright, shoulders relaxed, head lifted, holding a small sachet in her left hand;
- **small wave:** right forearm raised, mitten hand open;
- **scale view:** the doll standing beside the Sprout pouch, the pouch top at her waist (`proposed`).

Plain warm cream #FFF7DF stockinette wall and oak brown garter floor. [Material sentence] Eye level with the doll, even spacing, no text.

### Product sheet (image 2 = the Sprout pouch)

Product sheet: [Product line] The sheet shows:
- the pouch from the front, from the side (a slim gusset and a flat top seam) and from the top (the resealable top closed flat);
- beside it, [Daily pack line] shown whole, and shown torn straight across its top edge;
- [Gummy line], a small cluster in front.

Plain warm cream #FFF7DF stockinette backdrop. [Material sentence] Straight-on camera, true proportions. Label lines on the pouch: "Sprout", "28 Daily Packs".

- **Low Sugar or Sugar-Free:** Low Sugar is shown, with no white burst (`proposed`).
- **Full label, word for word, for the edit:**
  - front: "Sprout" (yellow);
  - a yellow bear face (graphic, top right);
  - "28 Daily Packs" (at the bottom; colour `proposed` yellow).
  - The rest of the label is `MISSING`.
- **Match to the real pack:** still to check against the photos.

### Set sheet 1: Kitchen (image 3) `[inferred]` (no room list was given)

An empty small kitchen:
- warm cream #FFF7DF stockinette walls;
- a window on the left with a cream #FFF7DF crocheted frame and pale sky-blue felted glass;
- an oak brown rib-knit counter running across the frame;
- deep forest green #002C17 stockinette cupboard doors below the counter;
- a forest green #00582D garter-stitch rug on an oak brown garter floor;
- a sunflower yellow #FFCC2E crocheted fruit bowl at the far right of the counter;
- an oak brown rib-knit wall shelf at the right;
- a pale grey-white crocheted tumbler holding beige-grey felted gritty sludge, with a silver-grey crocheted spoon in it;
- five crocheted pill bottles on the shelf, white bodies with grey caps, no labels.

[Material sentence] Eye level with the counter front, wide shot, no doll.

### Set sheet 2: Product backdrop (image 4)

An empty tabletop set:
- a soft two-colour knitted gradient wall, warm cream #FFF7DF at the top blending into kelly green #007E40 at the bottom, worked in stockinette stripes that fade into each other;
- an oak brown rib-knit tabletop;
- a few loose [Gummy line] scattered at the front edge.

[Material sentence] Eye level, medium shot, no doll, no pouch.

**How to attach the sheets:** attach them to every later prompt and name each by its job. Image 1 is the woman, image 2 is the Sprout pouch and daily pack, image 3 is the kitchen, image 4 is the product backdrop.

---

## File 4: Storyboard (approve)

### Script locked (stage 0)

- **Show job:** join. **Technique:** plying.
- **The turn:** it starts in shot 4 with six separate leaf-green strands and ends with one thicker yarn running into a crocheted daily pack. This is the one yarn-made scene change.
- **Claims:** "six grams of fiber" matches the label's 6 g prebiotic fiber. Line 1 names a category ("fiber powder"), not a brand.

| Shot | Line | Seconds | Note |
|---|---|---|---|
| 1 | 1 "Fiber powder. Gritty, every single morning." | 4 `proposed` | |
| 2 | 2 (pills) | 3 `proposed` | from summary |
| 3 | 3 "Here's six grams of fiber, the easy way." | 4 `proposed` | |
| 4 | 4 "Six strands. One pack." | 5 `proposed` | THE TURN |
| 5a | 5 "Rip." | 2.5 `proposed` | |
| 5b | 5 "Tip. Enjoy." | 2.5 `proposed` | |
| 6 | 6 (pouch) | 3 `proposed` | from summary |
| 7 | 7 (offer) | 3 `proposed` | from summary |
| 8 | 8 (close) | 3 `proposed` | from summary; end card |

**Avoid field (every frame):** human skin, photograph, plastic toy, clay, knitting needles, hands of a maker.

### Shot 1

**Frame prompt**
Image 1 is the woman, image 3 is the kitchen. [Doll card] She stands at the counter, shoulders dropped and head tilted down toward a pale grey-white crocheted tumbler of beige-grey felted gritty sludge. Her right mitten hand holds a silver-grey crocheted spoon in the glass, and her left hand rests on the counter edge, in a weary pose. The setting is the small kitchen: warm cream #FFF7DF stockinette walls, an oak brown rib-knit counter, the window at the left. [Material sentence] Eye level with the doll, medium shot from the counter's front. No label lines.

**Shot card**
- Framing: medium shot.
- Camera: locked-off.
- Action: her right forearm stirs the spoon in two slow circles.
- Line: "Fiber powder. Gritty, every single morning."
- Length: 4 s.
- Sound: none (voice-over only).

### Shot 2 (from summary)

**Frame prompt**
Image 1 is the woman, image 3 is the kitchen. [Doll card] She stands at the right end of the counter facing screen right toward the oak brown rib-knit wall shelf. The shelf is crowded with five crocheted pill bottles with white bodies and grey caps and no labels. Her arms hang at her sides and her shoulders are slumped, in an unimpressed pose. The setting is the small kitchen: warm cream #FFF7DF stockinette walls. [Material sentence] Eye level with the doll, medium shot from the counter's front. No label lines.

**Shot card**
- Framing: medium shot.
- Camera: locked-off.
- Action: her head turns slowly from the shelf toward screen left, away from the bottles.
- Line: line 2 (words to come).
- Length: 3 s.
- Sound: none.

### Shot 3

**Frame prompt**
Image 3 is the kitchen. Six leaf-green crocheted yarn strands lie side by side on the oak brown rib-knit counter, running from the left edge of the frame toward the right, slightly apart and fluffy at their ends. The counter is in the small kitchen, with a warm cream #FFF7DF stockinette wall softly out of focus behind. [Material sentence] Close-up at counter height. No label lines.

**Shot card**
- Framing: close-up.
- Camera: slow dolly in.
- Action: the strands lie still while the camera closes in.
- Line: "Here's six grams of fiber, the easy way."
- Length: 4 s.
- Sound: none.

### Shot 4 (THE TURN; the frame shows the moment just before the change)

**Frame prompt**
Image 2 is the Sprout daily pack, image 3 is the kitchen. Six separate leaf-green crocheted yarn strands run in parallel across the oak brown rib-knit counter from the left. At the right they lead to [Daily pack line], which lies flat and whole on the counter. The strands are about to twist together. The setting is the small kitchen, with a warm cream #FFF7DF stockinette wall softly out of focus behind. [Material sentence] Close-up at counter height, the strands and the pack both in frame. No label lines.

**Shot card**
- Framing: close-up.
- Camera: locked-off.
- Action: the six strands ply into one thicker leaf-green yarn, winding from left to right, and the yarn runs into the bottom edge of the daily pack.
- Line: "Six strands. One pack."
- Length: 5 s.
- Sound: none.
- End frame: one thick plied leaf-green yarn running into the whole daily pack.

### Shot 5a

**Frame prompt**
Image 1 is the woman, image 2 is the Sprout daily pack. [Doll card] Close-up of only her two mitten hands and jumper cuffs. Her left hand holds [Daily pack line] upright, still whole. Her right hand pinches the pack's top edge, ready to tear straight across, in an eager, light grip. Behind is the oak brown rib-knit counter of the small kitchen, softly out of focus. [Material sentence] Close-up of hands and the pack, at counter height. No label lines.

**Shot card**
- Framing: close-up of the hands.
- Camera: locked-off.
- Action: her right hand draws to the right, and a strip peels away straight across the top edge.
- Line: "Rip."
- Length: 2.5 s.
- Sound: none.
- Pack state: torn from this shot onward.

### Shot 5b

**Frame prompt**
Image 1 is the woman, image 2 is the Sprout daily pack. [Doll card] Close-up of only her two mitten hands and jumper cuffs. Her left hand holds [Daily pack line], torn straight across its top edge and tilted down over her open right palm. The first [Gummy line] are at the torn opening. Behind is the oak brown rib-knit counter of the small kitchen, softly out of focus. [Material sentence] Close-up of hands and the pack, at counter height. No label lines.

**Shot card**
- Framing: close-up of the hands.
- Camera: locked-off.
- Action: the gummies slide out of the torn top into her palm until a small handful sits there.
- Line: "Tip. Enjoy."
- Length: 2.5 s.
- Sound: none.

### Shot 6 (from summary)

**Frame prompt**
Image 2 is the Sprout pouch, image 4 is the product backdrop. [Product line] It stands upright and centred on the oak brown rib-knit tabletop, with a few [Gummy line] scattered in front. The backdrop is a soft knitted gradient wall, warm cream #FFF7DF at the top into kelly green #007E40 at the bottom. [Material sentence] Eye level with the pouch, medium shot. Label lines: "Sprout", "28 Daily Packs".

**Shot card**
- Framing: medium shot.
- Camera: slow dolly in.
- Action: the pouch and the gummies stay still.
- Line: line 6 (words to come).
- Length: 3 s.
- Sound: none.

### Shot 7 (from summary)

**Frame prompt**
Image 1 is the woman, image 2 is the Sprout pouch, image 4 is the product backdrop. [Doll card] She stands at screen left beside [Product line], whose top reaches her waist. A few [Gummy line] lie in front. Her arms are relaxed and her head is lifted, in an easy, pleased pose. The backdrop is the knitted gradient wall, warm cream #FFF7DF into kelly green #007E40, over the oak brown rib-knit tabletop. [Material sentence] Eye level with the doll, full shot. Label lines: "Sprout", "28 Daily Packs".

**Shot card**
- Framing: full shot.
- Camera: locked-off.
- Action: her right arm bends at the elbow into a small wave.
- Line: line 7 (offer; words to come).
- Length: 3 s.
- Sound: none.

### Shot 8 (from summary; end card)

**Frame prompt**
Image 2 is the Sprout pouch, image 4 is the product backdrop. [Product line] It stands at screen right on the oak brown rib-knit tabletop, with a few [Gummy line] in front. The left half of the frame is clear knitted gradient wall, warm cream #FFF7DF into kelly green #007E40, left empty for end-card text. [Material sentence] Eye level with the pouch, medium shot. Label lines: "Sprout", "28 Daily Packs".

**Shot card**
- Framing: medium shot.
- Camera: locked-off hold.
- Action: nothing moves.
- Line: line 8 (close; words to come).
- Length: 3 s.
- Sound: none.

### Continuity

- **Camera:** always on the counter's front side (the 180° line). The light always comes from the left.
- **Eyelines:** in shot 2 she looks screen right to the shelf, then away screen left. In shot 7 she faces the camera at three-quarter.
- **Hands:** the right hand holds the spoon (shot 1) and does the tearing (5a). The left hand holds the pack (5a, 5b).
- **Daily pack:** whole in shots 4 and 5a start, torn from the end of 5a onward.
- **Pouch:** closed at its resealable top in every shot and never shown torn.
- **Faces:** no face close-ups.

---

## File 5: Clip prompts

The tool takes an end frame. The turn (shot 4) gets one, and so do shots 5a and 5b to lock the pack's state.

### Clip 1 (shot 1, 4 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 1.
- **Doll:** [Doll card].
- **Camera:** locked-off.
- **0 to 4 s:** her right crocheted forearm makes two slow circles, stirring the silver-grey crocheted spoon in the pale grey-white crocheted tumbler. The beige-grey felted sludge stays thick.
- **Stays fixed:** her head, torso, left hand and the counter. [Material sentence]
- **End state:** the spoon is back where it started, and her head is still tilted down.
- **Narration:** "Fiber powder. Gritty, every single morning."

### Clip 2 (shot 2, 3 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 2.
- **Doll:** [Doll card].
- **Camera:** locked-off.
- **0 to 3 s:** her head turns slowly from the pill shelf on the right toward screen left. The yarn hair moves with the head as one piece.
- **Stays fixed:** her shoulders, arms, the five white-and-grey crocheted pill bottles and the shelf. [Material sentence]
- **End state:** her head is turned away from the shelf.
- **Narration:** line 2 (words to come).

### Clip 3 (shot 3, 4 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 3.
- **Camera:** slow dolly in.
- **0 to 4 s:** the camera moves steadily closer to the six leaf-green crocheted strands on the oak brown rib-knit counter.
- **Stays fixed:** all six strands lie still and apart. [Material sentence]
- **End state:** the strands fill the frame.
- **Narration:** "Here's six grams of fiber, the easy way."

### Clip 4 (shot 4, THE TURN, 5 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 4.
- **End frame:** one thick plied leaf-green yarn running across the counter into the bottom edge of [Daily pack line], lying flat and whole.
- **Camera:** locked-off.
- **0 to 1 s:** the six leaf-green strands draw toward each other.
- **1 to 4 s:** the strands wind around each other into one thicker yarn, turning as they go, from the left edge toward the pack.
- **4 to 5 s:** the plied yarn runs into the bottom edge of the pack and settles.
- **Stays fixed:** the daily pack, the counter and the light. [Material sentence]
- **End state:** one plied yarn into one whole pack.
- **Narration:** "Six strands. One pack."

### Clip 5a (shot 5a, 2.5 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 5a.
- **End frame:** the same hands, the pack torn straight across its top edge, and the strip in her right hand.
- **Doll:** [Doll card].
- **Camera:** locked-off.
- **0 to 2.5 s:** her right mitten hand draws to the right, and a strip of the sachet peels away straight across the top edge.
- **Stays fixed:** her left hand and the body of the pack. [Material sentence]
- **End state:** the pack is open at the top only.
- **Narration:** "Rip."

### Clip 5b (shot 5b, 2.5 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 5b.
- **End frame:** a small handful of [Gummy line] resting in her right palm, and the torn pack still tilted above.
- **Doll:** [Doll card].
- **Camera:** locked-off.
- **0 to 2.5 s:** the gummy bears slide one after another out of the torn top into her open palm.
- **Stays fixed:** both hands and the tilted pack. [Material sentence]
- **End state:** a small handful in her palm.
- **Narration:** "Tip. Enjoy."

### Clip 6 (shot 6, 3 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 6.
- **Camera:** slow dolly in.
- **0 to 3 s:** the camera moves gently toward [Product line].
- **Stays fixed:** the pouch, its closed top, the gummies and the gradient wall. [Material sentence]
- **End state:** the pouch fills the centre, with "Sprout" clear.
- **Narration:** line 6 (words to come).

### Clip 7 (shot 7, 3 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 7.
- **Doll:** [Doll card].
- **Camera:** locked-off.
- **0 to 3 s:** her crocheted right arm bends slowly at the elbow and the hand rises into a small wave, moving as one piece.
- **Stays fixed:** her head, torso, left arm, the pouch and the gummies. [Material sentence]
- **End state:** her right hand is raised at shoulder height.
- **Narration:** line 7 (offer; words to come).

### Clip 8 (shot 8, 3 s)

Wool stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; stitches stay in place and the fuzz stays soft.

- **Start frame:** shot 8.
- **Camera:** locked-off.
- **0 to 3 s:** a held shot of [Product line].
- **Stays fixed:** everything. [Material sentence]
- **End state:** the same as the start, with the left half clear for text.
- **Narration:** line 8 (close; words to come).

**Takes:** make 2 or 3 takes of each clip and keep the one with the cleanest stitches and the truest label.

---

## File 6: Edit list

### Order and cuts

1. Clip 1, 0:00 to 0:04.
2. Clip 2, 0:04 to 0:07.
3. Clip 3, 0:07 to 0:11.
4. Clip 4, 0:11 to 0:16.
5. Clip 5a, 0:16 to 0:18.5.
6. Clip 5b, 0:18.5 to 0:21.
7. Clip 6, 0:21 to 0:24.
8. Clip 7, 0:24 to 0:27.
9. Clip 8, 0:27 to 0:30.

Straight cuts throughout. Cut 5a to 5b on the strip leaving the frame. Trim each 8-second clip to its slot, using the cleanest stretch.

### Captions

Use the narration word for word, in Work Sans bold, deep forest green #002C17 on a cream #FFF7DF pill:
- "Fiber powder. Gritty, every single morning."
- "Here's six grams of fiber, the easy way."
- "Six strands. One pack."
- "Rip. Tip. Enjoy."
- Lines 2, 6, 7 and 8 once their words exist.

### Label overlay

Place the real pouch label from the front photo over shots 6, 7 and 8 if "Sprout" or "28 Daily Packs" comes out garbled. Never add label lines beyond the real ones.

### Voice

- Use an ElevenLabs stock library voice: adult, warm and playful (`proposed`). Never a cloned voice.
- Pace it to the slots above, with a [short pause] after "Gritty," and between "Rip." "Tip." "Enjoy."
- The dolls never speak, so there is no lip-sync.

### Sound

- The video tool makes no sound, so all sound is added in the edit.
- Optional soft wool rustle under shot 4 (`proposed`).
- Music only if the brand uses it, kept low under the voice.

### End card (shots 8, and 7 if the offer is said there)

- Text: the offer that is live on the day, in Work Sans bold on the left half.
- Badge: sunflower yellow #FFCC2E.
- Button: kelly green #007E40.

### Safe zones

- Keep all text in the centre of the frame.
- Stay clear of the top 14%, the bottom 35% and the right-hand button column.

### MISSING

- `MISSING:` exact narration words for line 2 (pills), line 6 (pouch), line 7 (offer) and line 8 (close). A `proposed` close from the brand's own lines is "Tastes like a treat, works like a supplement."
- `MISSING:` the offer live on the day. Several conflicting offers are live at once (52%, 55%, 49%, 58%, 61%, "$20 off", "Subs Now Start at $29.99"). Pick one and confirm it on the site that day.
  - If you use $29.99, add the condition that it applies to new customers who use the SMS sign-up discount.
  - If you mention the guarantee, say it covers the first order only.
- `MISSING:` the real daily pack's design (colour and print). It is shown plain forest green (`proposed`).
- `MISSING:` the real pouch size, to set the doll scale. The pouch top at her waist is `proposed`.
- `MISSING:` Low Sugar or Sugar-Free pouch. Low Sugar is shown (`proposed`). It is also the better choice for a fiber and gut message.
- `MISSING:` the full label text beyond "Sprout", the bear face and "28 Daily Packs", and the colour of "28 Daily Packs".
- `MISSING:` the platform and aspect ratio. 9:16 is `proposed`.
- `MISSING:` whether the brand uses music in its ads.
- Product photos: listed but not visible to me. Check the product sheet against the real pouch before shots 6 to 8.

### Final check

- Every line is said.
- "six grams of fiber" matches the label's 6 g.
- No body is shown getting better.
- The pouch is never torn.
- The daily pack is torn only straight across the top.

---

## File 7: Checks missed

CHECKS MISSED: none

---

## How to finish it

- **Pictures first:** make each start frame (and the end frames for clips 4, 5a and 5b) from its frame prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, with the sheets attached as images 1 to 4. Then animate each picture with its clip prompt.
- **Higgsfield:** paste each clip prompt into its video tool and pick Seedance, Kling or Veo. You can also connect Higgsfield to Claude so Claude makes the clips there. It runs on paid credits.
- **Gemini:** paid Google AI plans include Veo video in the Gemini app, with a few clips a day.
- **Claude Code:** with a key from a video service that offers Seedance, Kling or Veo, I can send each clip prompt there and save the files. Pictures alone need an OpenAI key (platform.openai.com/api-keys) or a Google key (aistudio.google.com/apikey). Each picture is billed.

Next, would you like to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? It takes the image prompts. You can also tell me something else you'd like to do.
```
