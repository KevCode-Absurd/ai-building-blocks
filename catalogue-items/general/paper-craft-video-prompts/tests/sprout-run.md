# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A complete, usable set of prompts: all six stages run, lock lines reused, every frame placed inside the paper world, claims and offer taken word for word from the script, and the unseen photos honestly flagged rather than described. The one thing to fix before shooting is that it tears and pops up the big pouch where the script says 'the daily pack' (the brand never shows the pouch torn), though it did flag this ambiguity under MISSING.

## Judge list

- Met: Stopped for approval after avatar card, sheets and storyboard, or marked each 'approved in advance'
  "STAGE 1  AVATAR CARD (approved in advance)", "STAGE 3 ... (approved in advance)", "STAGE 4  STORYBOARD (approved in advance)"
- Met: Material and motion sentences word for word the same in every prompt
  Lock lines defined once; every frame carries [MATERIAL], every clip opens [MOTION] with rule "paste that lock line here, word for word." Stage 2 draft is allowed.
- Met: Every frame names a camera spot inside the scene, and every object names its paper or card
  "Camera: low in the back-seat footwell, looking up at the seat"; "kraft-paper lunchboxes", "cream card bowl", "quilled-paper bears", "card floor".
- Met: Each clip has one camera move and one paper change, written as paper moves
  Clip 3: "locked-off ... paper arm pivots at the elbow pin"; Clip 4 is one pop-up (cover/page opens, pouch stands), though the 0–1 s cover swing is a slight preamble.
- Met: Label lines on the card pack are short, in quotes, and match your pack
  "Label lines: \"Sprout\", \"28 Daily Packs\"" on every product frame; matches the input label.

## What went in

```text
Script (from the paper world script skill), about 30 s.
Show plan: reveal, pop-up. Flat-cut figure on layered planes,
matte card, kraft lunchboxes, scissor-cut edges.
1 "Lunchboxes. Permission slip. One missing shoe." Card kitchen.
2 "Your own vitamins? Still on the shelf." Card shelf, plain tub.
3 "So put them where your day already goes." Paper planner.
4 "One pack, right there." THE TURN: the page turns, the daily
  pack stands up from the fold.
5 "Rip. Tip. Enjoy." Paper hands tear the pack across the top.
6 "Sixty-plus ingredients, twenty-one vitamins and minerals, six
  grams of fiber." The pouch on a card car seat.
7 "First order $29.99 with the text sign-up." Held. On screen:
  renews at $49.99 every 4 weeks.
Cast note: one flat-cut paper woman, an invented adult about 40.
Photos attached: pouch front, side and top. Label: "Sprout" in
yellow, a yellow bear face top right, "28 Daily Packs" at the
bottom. Gummies: small deep-green bears. Tear only across the top.
Colors: forest green #00582D, cream #FFF7DF, sunflower #FFCC2E.
Video tool: 8-second clips, takes an end frame, no sound.
Approvals: all three given in advance. Run every stage in one go.
```

## What came out

```text
STAGE 0  SCRIPT IN   Turn: reveal, pop-up. Starts on Shot 4's closed paper planner page lying flat on the kraft counter, ends with the card pouch standing upright from the fold. Paper scene change: one, in Shot 4. The planner page opens from flat to upright and the pouch stands up across the fold.
         Build: flat-cut figure on layered planes, matte card, kraft lunchboxes, scissor-cut edges.
         Lines (about 30 s total):
         1 "Lunchboxes. Permission slip. One missing shoe." 4 s, no claims.
         2 "Your own vitamins? Still on the shelf." 3 s, no claims.
         3 "So put them where your day already goes." 3 s, no claims.
         4 "One pack, right there." 5 s, no claims.
         5 "Rip. Tip. Enjoy." 4 s, cut as 5a (2 s) and 5b (2 s). Usage only, no claims.
         6 "Sixty-plus ingredients, twenty-one vitamins and minerals, six grams of fiber." 6 s.
           Claims: Sixty-plus ingredients / twenty-one vitamins and minerals / six grams of fiber. Use them word for word.
         7 "First order $29.99 with the text sign-up." 5 s.
           Offer claim: First order $29.99 with the text sign-up.
           On screen: renews at $49.99 every 4 weeks.

STAGE 1  AVATAR CARD (approved in advance)
         Role: busy parent whose morning is already full. She finds the pack placed in her planner.
         Age: invented adult, about 40.
         Look: a flat-cut paper woman.
           Face: warm tan matte card, cut as simple shapes. Two small dark-brown card ovals for eyes, one curved cut-card line for a smile, no nose detail.
           Hair: dark-brown cut-card hair in a low bun. [proposed: tan and brown are outside the brand palette]
         Clothes: cream #FFF7DF card sweater with scissor-cut cuffs, forest-green #00582D card trousers, kraft-paper flat shoes.
         Props: kraft-paper lunchboxes, a cream paper permission slip, one kraft-paper shoe, a forest-green card planner.
         Voice: none on screen. The narrator is off screen and the figure never speaks.
         Never changes:
         - pinned at shoulders, elbows and knees;
         - hands stay flat;
         - the same face shapes, bun and clothes colours;
         - always paper, never a real person;
         - a second person appears only as paper hands, if at all.

STAGE 2  REFERENCE IMAGES
         Prompt: A flat-cut paper figure of an invented woman about 40, standing straight against plain cream #FFF7DF card.
           Face: warm tan matte card, cut as simple shapes, with two small dark-brown card oval eyes and one curved cut-card smile line.
           Hair: dark-brown cut-card hair in a low bun.
           Clothes: cream card sweater with scissor-cut cuffs, forest-green #00582D card trousers, kraft-paper flat shoes.
           Joints: small paper pins at shoulders, elbows and knees. Hands are flat card.
           Material (draft): flat-cut paper world built in layered planes of matte card stock and kraft paper, every edge scissor-cut, one low warm light from the left so the figure casts a soft shadow on the card behind.
           Avoid: vector, 3D render, plastic, clay, desk, scissors, maker's hands, real photograph.
         Make 4.
         Pick: take the one where the face reads as cut shapes rather than a drawn face, the pins show clearly at every joint, the hands are flat, and the shadow falls on the card behind. Those four things match the card's "never changes" line and make the figure easy to pose later. Number the picked image "image 1 is the woman".

STAGE 3  SHEETS AND LOCK LINES (approved in advance)
         Rule for every later prompt: [MATERIAL], [MOTION], [FIGURE] and [PRODUCT] each mean "paste that lock line here, word for word."

         MATERIAL: Flat-cut paper world built in layered planes with pop-up folds: matte card stock in forest green #00582D, cream #FFF7DF and sunflower #FFCC2E with kraft paper accents, every edge scissor-cut, one low warm light from the left so every layer casts a soft shadow on the layer behind, the paper scene filling the frame on every side.

         MOTION: Paper stop-motion animated on twos: each pose holds for two frames, about 12 new poses a second; every piece stays rigid and flat.

         FIGURE: a flat-cut paper woman about 40 with a warm tan card face of simple cut shapes, a dark-brown cut-card bun, a cream card sweater, forest-green card trousers and kraft-paper shoes, pinned at shoulders, elbows and knees, hands flat.

         PRODUCT: the Sprout stand-up pouch cut and folded from matte card, forest-green [inferred] front panel, "Sprout" in sunflower-yellow card letters, a sunflower-yellow cut-card bear face at top right, "28 Daily Packs" at the bottom, a straight tear line across the top only.

         Character sheet:
         - Prompt: A flat-cut paper figure of [FIGURE], shown on one sheet of plain cream card from five views: front, three-quarter left, three-quarter right, side and back.
         - Pins: marked at shoulders, elbows and knees.
         - Gestures: right arm raised, holding a cream paper permission slip; right paper hand resting flat on a card planner; both paper hands at chest height, holding a card pouch; right wrist tipped forward.
         - Size: she stands beside the card pouch [PRODUCT], which comes to about her elbow height when held. [inferred: real size MISSING]
         - Add [MATERIAL] to the prompt.
         - Avoid: vector, 3D render, clay, scissors, maker's hands.
         - Label it "image 1 is the woman".

         Product sheet:
         - Prompt: [PRODUCT], shown front, side and top on plain cream card, at the true pouch proportions from the photos. Small deep-green cut-card gummy bears lie beside it. Add [MATERIAL].
         - Busy label: use a printed photo of the real pouch, cut out and set in the scene, so every word stays exact.
         - Full label for the edit: "Sprout" (yellow), a yellow bear face at top right, "28 Daily Packs" (bottom). Any other label text is MISSING.
         - Label it "image 2 is the Sprout pouch".
         - Photo check: I could not see the attached pouch photos, so this sheet has not been checked against the real pack. It is still to do.

         Set sheet:
         - Each set prompt opens with "Empty", then the set below, then [MATERIAL].
         - Card kitchen (image 3): layered card cupboards, a kraft-paper counter, a forest-green card window with cream paper curtains. Camera spot: standing inside the kitchen at the woman's eye level, facing the counter.
         - Card shelf (image 4): the same kitchen's upper card shelf holding a plain cream card tub with no label. Camera spot: low inside the kitchen, looking up at the shelf from counter height.
         - Paper planner (image 5): a forest-green card planner lying closed on the kraft counter. Camera spot: straight down from above the counter, inside the kitchen.
         - Card car (image 6): the back seat of a card car interior, with a cream card car seat and forest-green card seat belt straps, and a kraft-paper window frame showing layered card trees. Camera spot: low in the back-seat footwell, looking up at the seat.

STAGE 4  STORYBOARD (approved in advance)
         Avoid field on every frame (if your tool has one): vector, 3D render, plastic, clay, desk, scissors, maker's hands, real photograph.

         F1  [FIGURE] stands at the counter with her right arm raised, holding a cream paper permission slip. Two kraft-paper lunchboxes sit open in front of her, and one kraft-paper shoe lies alone on the card floor. Setting: the card kitchen (image 3). [MATERIAL]
             Camera: standing inside the kitchen at her eye level, three-quarter front from her left.
         Card 1: medium | locked-off | her right arm pivots at the elbow to lift the slip | "Lunchboxes. Permission slip. One missing shoe." | 4 s | none

         F2  A plain cream card tub with no label sits on the upper card shelf. A thin layer of cream paper dust lies on its lid. Setting: the card kitchen shelf (image 4). [MATERIAL]
             Camera: low inside the kitchen at counter height, looking up at the shelf.
         Card 2: close | slow dolly in through the shelf layers | no paper change | "Your own vitamins? Still on the shelf." | 3 s | none

         F3  [FIGURE]'s right paper hand reaches toward a forest-green card planner lying closed on the kraft counter. Setting: the card kitchen counter (image 5). [MATERIAL]
             Camera: straight down from above the counter, inside the kitchen.
         Card 3: top-down medium | locked-off | her right arm pivots at the elbow until the flat hand rests on the planner | "So put them where your day already goes." | 3 s | none

         F4  The forest-green card planner lies closed on the kraft counter, its cover edge lifted a few millimetres, just before it opens. Setting: the card kitchen counter (image 5). [MATERIAL]
             Camera: straight down from above the counter, inside the kitchen.
         F4-END  The planner lies open flat. Upright across the fold stands [PRODUCT], with its shadow falling across the cream card page. Setting: the card kitchen counter (image 5). [MATERIAL]
             Camera: straight down from above the counter. Label lines: "Sprout", "28 Daily Packs".
         Card 4: top-down close | locked-off | the page opens from flat to upright and the card pouch fixed across the fold stands up, its shadow growing | "One pack, right there." | 5 s | none

         F5a  Two flat paper hands hold [PRODUCT] by its top corners, sealed, above the kraft counter. Setting: the card kitchen (image 3). [MATERIAL]
             Camera: low at the counter, facing the pouch front. Label lines: "Sprout", "28 Daily Packs".
         Card 5a: close | locked-off | the right paper hand slides along the tear line and the top strip of card separates cleanly | "Rip." | 2 s | none

         F5b  The right paper hand holds the torn-open [PRODUCT] upright above a cream card bowl on the kraft counter. Setting: the card kitchen (image 3). [MATERIAL]
             Camera: low at the counter. Label lines: "Sprout", "28 Daily Packs".
         Card 5b: close | locked-off | the paper hand pivots at the wrist pin to tip the pouch, and three small deep-green quilled-paper bears slide out into the bowl | "Tip. Enjoy." | 2 s | none

         F6  The torn-open [PRODUCT] sits on the cream card car seat, front facing out, with two small deep-green quilled-paper bears beside it. Setting: the card car (image 6). [MATERIAL]
             Camera: low in the back-seat footwell, looking up at the seat. Label lines: "Sprout", "28 Daily Packs".
         Card 6: medium close | slow dolly in through the window, seat and pouch layers | no paper change | "Sixty-plus ingredients, twenty-one vitamins and minerals, six grams of fiber." | 6 s | none

         F7  [FIGURE]'s right paper hand holds the torn-open [PRODUCT] front-on, centred on cream card. Setting: the card kitchen wall, layered behind (image 3). [MATERIAL]
             Camera: inside the kitchen at her hand height, square to the pouch front. Label lines: "Sprout", "28 Daily Packs".
         Card 7: close, held | locked-off | no paper change | "First order $29.99 with the text sign-up." | 5 s | none. End card text goes on in the edit.

         Continuity:
         - 180° line: the camera stays on the woman's left and front side in every kitchen shot. She always faces screen right.
         - Eyelines: when she appears, she looks screen right toward the counter.
         - Hands: the right paper hand lifts the slip (F1), touches the planner (F3), tears and tips (F5a, F5b) and holds the pouch (F7). The left hand only steadies.
         - Product state: the pouch is sealed through F5a. It is torn from F5a's end onward (F5b, F6, F7).
         - Look: the pouch's card colours and label lines are identical in every frame.

STAGE 5  CLIP 1 (4 s, start F1, end none)
         [MOTION] Camera: locked-off.
         0 to 4 s: the paper woman's right arm pivots at the elbow pin, lifting the cream paper permission slip to chest height in small rigid steps. Her flat hand stays flat.
         Fixed: lunchboxes, shoe, kitchen layers, her body and face.
         End state: slip held at chest height.
         Carries: "Lunchboxes. Permission slip. One missing shoe."

         CLIP 2 (3 s, start F2, end none)
         [MOTION] Camera: slow dolly in through the paper shelf layers. Near card layers pass faster than far ones.
         0 to 3 s: the camera moves toward the plain cream card tub.
         Fixed: the tub, the shelf and the paper dust do not move.
         End state: the tub fills the centre of the frame.
         Carries: "Your own vitamins? Still on the shelf."

         CLIP 3 (3 s, start F3, end none)
         [MOTION] Camera: locked-off.
         0 to 3 s: the paper arm pivots at the elbow pin and lowers until the flat card hand rests on the planner cover.
         Fixed: the planner stays closed. The counter does not move.
         End state: the hand rests flat on the planner.
         Carries: "So put them where your day already goes."

         CLIP 4 (5 s, start F4, end F4-END)
         [MOTION] Camera: locked-off.
         0 to 1 s: the planner cover swings open on its fold.
         1 to 4 s: the page opens from flat to upright. The card pouch fixed across the fold stands up and its shadow grows across the cream page.
         4 to 5 s: hold.
         Fixed: the counter, the planner's spine and the pouch's label lines.
         End state: the pouch stands upright and square to the camera.
         Carries: "One pack, right there."

         CLIP 5a (2 s, start F5a, end none)
         [MOTION] Camera: locked-off.
         0 to 2 s: the right paper hand slides along the top edge and the top strip of the card pouch tears away along the straight tear line, leaving a scissor-cut-clean edge.
         Fixed: the pouch body and its label stay rigid.
         End state: the pouch is open at the top.
         Carries: "Rip."

         CLIP 5b (2 s, start F5b, end none)
         [MOTION] Camera: locked-off.
         0 to 2 s: the paper hand pivots at the wrist pin, tipping the open card pouch forward. Three small deep-green quilled-paper bears slide out into the cream card bowl.
         Fixed: the bowl, the counter and the pouch's flat shape.
         End state: three bears in the bowl, pouch tipped.
         Carries: "Tip. Enjoy."

         CLIP 6 (6 s, start F6, end none)
         [MOTION] Camera: slow dolly in through the paper layers: window trees, then seat, then pouch. Near layers pass faster than far ones.
         0 to 6 s: the camera moves toward the pouch front.
         Fixed: the pouch, the bears and the seat do not move. No extra objects appear.
         End state: the pouch front fills the lower centre of the frame.
         Carries: "Sixty-plus ingredients, twenty-one vitamins and minerals, six grams of fiber."

         CLIP 7 (5 s, start F7, end none)
         [MOTION] Camera: locked-off.
         0 to 5 s: hold. Only the layer shadows stay as they are.
         Fixed: the hand, the pouch and the label.
         End state: same as the start frame.
         Carries: "First order $29.99 with the text sign-up."

         Takes: make 2 or 3 takes of each clip and pick one. Run a missed prompt once more before rewriting it.

         VOICE:
         - Record the narrator separately in a stock library voice, for example ElevenLabs. Never use a cloned voice. There is no lip-sync.
         - Add pause tags after "Lunchboxes." and "Permission slip.", and between "Rip." "Tip." "Enjoy."
         - The video tool makes no sound, so there is no ambient line. Music goes in only if the brand uses it (MISSING), low under the voice.

         EDIT:
         - Order: 1, 2, 3, 4, 5a, 5b, 6, 7. Cut on each narration line, using hard cuts.
         - Captions: each line word for word.
         - Shot 6: add the claim text on screen word for word only, if you want it there.
         - Label overlay: if "Sprout" or "28 Daily Packs" comes out wrong, place the real label from the pouch photo over F4-END, 5a, 6 and 7.
         - End card on Shot 7, as text:
           "First order $29.99 with the text sign-up"
           "Renews at $49.99 every 4 weeks"
           Take both from the offer that is live that day.
         - Safe zone: keep all text clear of the platform's buttons and caption area. The platform is MISSING.
         - Making it: this chat has no image or video tool connected, so these are prompts only.
           1. Make each start frame and F4-END in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, attaching images 1 to 6.
           2. Animate each frame with its clip prompt. Paste it into Higgsfield's video tool (Seedance, Kling or Veo, paid credits) or use Veo in a paid Gemini plan.
           3. Alternatively, in Claude Code with a video-service key, Claude can send the prompts for you and save the files.

         MISSING:
         - The attached pouch photos were not visible to me. The product sheet, the pouch's true shape and its base colour (forest green is inferred) all still need checking against the real pack.
         - Any label text beyond "Sprout", the bear face and "28 Daily Packs".
         - The pouch's real size next to the figure.
         - Whether "pack" in lines 4 and 5 means the pouch or a single daily pack inside it. The pouch is used, [inferred].
         - Brand file: things never to show, an approved claims list (claims are taken from the script word for word), music use, and fonts for captions and the end card.
         - The target platform, for safe zones.
         - Figure skin and hair colours are proposed.

CHECKS MISSED: The pouch's true shape and real label lines are not verified against the photos. The photos were not visible, so the product sheet check is still to do.
```
