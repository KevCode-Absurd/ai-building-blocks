# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A complete, usable six-stage plan: one locked camera for every rung, the brand's tear and pouch rules baked into every product shot, and the unseen photos handled honestly with MISSING lines instead of a made-up pack. Small slips remain: the Q and offer line timings don't match the 2.3 words/second rule, the peak hold adds no extra second, and the set sheet asks the image tool for an exact count of three shelves.

## Judge list

- Met: Approval points after avatar card, sheets and storyboard, each saying what to check
  "(approve) Check the character sheet against the avatar card, and check the product sheet print by print against the real pouch and pack"
- Met: Every step framed the same way, only the growing thing changes
  "STEP CAMERA Locked wide at chest height from across the room... The skeleton stands on one mark... Only the tubs change." F2–F5 all "step camera"
- Met: Skeleton has the same eyes, bones and proportions in every image
  [CHARACTER] in every prompt; hold line "Same skeleton as image 1. Bones stay joined and rigid" in all eight clips
- Met: No calendar, clock, sign or number inside any picture
  Dial in shares ("a quarter", "three-quarters"); labels and offer added in edit. Nit: set sheet asks for "three plain shelves"
- Met: Product matches its photos, label and all, and opens the way the brand shows it
  "Recreate the pouch and the daily pack exactly as in the attached photos"; "torn straight across the top edge only"; "The pouch is never torn"

## What went in

```text
Script (from the skeleton ad script skill):
Q "How many half-used tubs can one cupboard hold?"
1 TUB 1 "Tub one. Two scoops, then the chalky taste wins."
2 TUB 5 "Tub five. The shelf starts to bend."
3 TUB 12 "Tub twelve. The door needs a hip to shut."
4 TUB 20 "Tub twenty. The cupboard gives up."
T "Or skip the tub. Rip. Tip. Enjoy."
C "Sprout gummies. Sixty-plus ingredients in one daily pack."
O "First order, $29.99 with text sign-up."
Cast note: the default skeleton, no clothes, no onlookers.
Photos attached: pouch front, side and top; one daily pack. Pack
torn straight across its top edge only; the pouch opens only at
its resealable top, never torn.
Colours: forest green #00582D, warm cream #FFF7DF, sunflower
yellow #FFCC2E. Tools: 5-second clips, 3 references, end frame
yes. Music: not stated.
```

## What came out

```text
```
STAGE 0  SCRIPT IN   Dial half-used tubs piling up in the cupboard | Labels TUB 1, TUB 5, TUB 12, TUB 20 | Place one cupboard, a tall standing cupboard against a plain wall [inferred: style and room around it]
         Product enters T "Or skip the tub. Rip. Tip. Enjoy." (the daily pack, then the pouch at C)
         Lines (seconds are estimates at 2.3 spoken words a second, no narration yet):
         Q "How many half-used tubs can one cupboard hold?" 3.5s estimate | claims none
         1 "Tub one. Two scoops, then the chalky taste wins." 3.9s estimate | claims none
         2 "Tub five. The shelf starts to bend." 3.0s estimate | claims none
         3 "Tub twelve. The door needs a hip to shut." 3.9s estimate | claims none
         4 "Tub twenty. The cupboard gives up." 2.6s estimate | claims none
         T "Or skip the tub. Rip. Tip. Enjoy." 3.0s estimate | claims none
         C "Sprout gummies. Sixty-plus ingredients in one daily pack." 3.5s estimate | claim: sixty-plus ingredients (source MISSING)
         O "First order, $29.99 with text sign-up." 3.5s estimate | claim: offer, used word for word on the end card
         The place stays the same for every line. The script's words are kept: "tubs", "cupboard", "shelf", "door", "daily pack". Nothing is added.

STAGE 1  AVATAR CARD (approve)
         Role the one living the habit: buys tub after tub and never finishes one
         Look a lanky adult cartoon skeleton with warm ivory bones in a soft matte finish and big round cartoon eyes set in the sockets, white with dark pupils
         Item none (cast note: no clothes) | Props plain white tubs with plain white lids, one plain scoop, the Sprout daily pack, the Sprout pouch
         Voice none: the jaw stays closed and the narrator is off screen | Never changes bone colour, eye style, proportions, no clothes, jaw closed, bones stay joined
         Onlookers none
         (approve) Check that the look, the props and "no clothes, no onlookers" match what you want before you make any reference image.

STAGE 2  REFERENCE IMAGES  [CHARACTER] [LOOK] SHOT: full-body straight-on studio view; the skeleton standing alone, arms relaxed at its sides, calm friendly eyes looking at camera; plain mid-grey background, nothing else in frame. [CLEAN]
         Make 4. Pick: the one whose pupils stay clear and readable when you shrink it to the size the skeleton fills in the wide step camera (about a third of the frame height). Eyes carry every reaction in this ad, so small, faint or off-centre pupils are out. Choose round, high-contrast eyes over finer bone detail.

STAGE 3  SHEETS AND LOCK LINES (approve)
         CHARACTER A lanky adult cartoon skeleton with warm ivory bones in a soft matte finish and big round cartoon eyes set in the sockets, white with dark pupils; no clothes, no signature item; jaw closed.
         LOOK Soft stylised 3D cartoon render; forest green #00582D cupboard, warm cream #FFF7DF walls, sunflower yellow #FFCC2E cupboard handle, white tubs; soft daylight from a window off frame left.
         CLEAN Plain unmarked white tubs with plain white lids, a smooth plain green cupboard with blank doors and shelves, blank cream walls, a bare plain floor.
         (The render style in LOOK is [inferred]. Paste all three lines unchanged wherever a prompt says [CHARACTER] [LOOK] [CLEAN].)
         Character sheet  Attach the picked image as image 1. [CHARACTER] [LOOK] SHOT: character turnaround sheet on plain mid grey; the same skeleton as image 1 shown front, three-quarter left, three-quarter right, side and back; then a reaction row, with eyes first and then the whole pose: squint with head pulled back (step 1), wide eyes with hands lifted (step 2), hip pushed out sideways with a strained squint (step 3), shoulders dropped and arms hanging with drooping eyes (step 4), soft smiling curved eyes holding a small pack (turn); then one view of its open right palm with the Sprout daily pack lying across it to show size. [CLEAN]  Size note: daily pack and pouch size MISSING, so set the pack against the palm from the real pack before you lock it.
         Product sheet  The photos you named aren't visible to me, so I haven't described the pouch or pack and this sheet must be checked against the real pack. Attach the pouch front, side and top photos and the daily pack photo. Prompt: "Product reference sheet on plain mid grey. Recreate the pouch and the daily pack exactly as in the attached photos, with all printing, colours and words unchanged. Pouch: front, side and top, resealable top closed. Daily pack: front, plus one view torn straight across its top edge only. The pouch is never torn." Use as image 3.
         Set sheet  Attach nothing. [LOOK] SHOT: locked wide at chest height from across the room; a tall standing cupboard on frame right with its single door hinged on its right edge and swung open toward camera-right, three plain shelves inside, a lone tub on the middle shelf, the rest of the shelves empty; an empty patch of floor at frame left where the skeleton will stand; no figure in frame. [CLEAN]  Use as image 2.
         (approve) Check the character sheet against the avatar card, and check the product sheet print by print against the real pouch and pack, before you make any frame.

STAGE 4  STORYBOARD (approve)
         STEP CAMERA Locked wide at chest height from across the room, 9:16 [inferred]. The cupboard fills the right half of the frame, door hinged right. The skeleton stands on one mark at frame left, head to feet in frame, turned three-quarter toward the cupboard. The camera stays on this side of the action (180° line) in every step shot. Only the tubs change.
         Attach to every frame: "image 1 is the skeleton, image 2 is the cupboard, image 3 is the Sprout pouch and daily pack" (leave image 3 out when the product isn't in shot). Build each frame from the sheets, never from an earlier frame.
         F1 [CHARACTER] [LOOK] SHOT: step camera; the skeleton on its mark, right hand on the closed cupboard door's handle, mid-pull, eyes curious and looking up at the door; the cupboard from image 2 with its door closed; no product. [CLEAN]
         Card 1: Q (caption) | door closed | step camera | reach for handle, door opens to the lone tub, head tilts | "How many half-used tubs can one cupboard hold?" | 4s | soft door click
         F2 [CHARACTER] [LOOK] SHOT: step camera; the skeleton on its mark holding a plain scoop of pale powder up near its face in its right hand, eyes squinting hard, head pulled back; the door open, a lone open tub on the middle shelf, the rest of the shelves empty; scoop, tub; no product. [CLEAN]
         Card 2: TUB 1 | a lone tub on the middle shelf | step camera | scoop raised, hard squint, scoop lowered back into the tub | "Tub one. Two scoops, then the chalky taste wins." | 4s | scoop scrape, lid tap
         F3 [CHARACTER] [LOOK] SHOT: step camera; the skeleton on its mark, right hand just letting go of a tub it has pushed onto the middle shelf, eyes wide, hands lifting away; tubs crowding about a quarter of the cupboard, the middle shelf bowing down at its centre; tubs; no product. [CLEAN]
         Card 3: TUB 5 | a quarter full, middle shelf bowing | step camera | tub pushed on, shelf bows, eyes widen | "Tub five. The shelf starts to bend." | 3s | wood creak
         F4 [CHARACTER] [LOOK] SHOT: step camera; the skeleton on its mark with its hip pushed sideways against the outside of the nearly shut door, both hands flat on the door, strained squint; the door almost closed, tubs bulging out of the gap and stacked to the door's edge, the cupboard about three-quarters full; tubs; no product. [CLEAN]
         Card 4: TUB 12 | three-quarters full, tubs at the door edge | step camera | hands on door, hip bump, door clicks shut, it leans on it | "Tub twelve. The door needs a hip to shut." | 4s | thump, latch click
         F5 [CHARACTER] [LOOK] SHOT: step camera; the skeleton on its mark, shoulders dropped, arms hanging, eyes drooping, tubs rolling around its feet; the door swung wide open, the cupboard overflowing, tubs spilling off every shelf onto the floor; tubs; no product. [CLEAN]
         Card 5: TUB 20 (peak) | overflowing onto the floor | step camera | door bursts open, tubs tumble, shoulders drop and hold | "Tub twenty. The cupboard gives up." | 5s | creak, tumbling plastic thuds, then quiet
         F6 [CHARACTER] [LOOK] SHOT: close-up at chest height from the same side; the skeleton's left hand holding the Sprout daily pack from image 3 upright, right fingers pinching its top corner mid-tear, eyes brightening at the top of frame; the spilled tubs soft and out of focus behind; daily pack exactly as image 3, sized against its hand. [CLEAN]
         Card 6: turn, "Rip." | spilled tubs behind | close-up | pinch corner, tear straight across the top edge only, eyes brighten | "Or skip the tub. Rip." | 3s | crisp tear
         F7 [CHARACTER] [LOOK] SHOT: close-up at chest height from the same side; the skeleton tilting the torn daily pack over its open right palm, gummies sliding into the palm, eyes curving into a smile; spilled tubs soft behind; daily pack from image 3, torn straight across its top edge only, gummies as in image 3. [CLEAN]
         Card 7: turn, "Tip. Enjoy." | spilled tubs behind | close-up | tilt pack, gummies drop into palm, smiling eyes | "Tip. Enjoy." | 3s | soft patter of gummies
         F8 [CHARACTER] [LOOK] SHOT: medium on the cupboard's cleared middle shelf from the same side; the skeleton's right hand setting the Sprout pouch from image 3 down upright, resealable top closed, the torn daily pack lying beside it; pouch and pack exactly as image 3, sized against its hand. [CLEAN]
         Card 8: close + end card | shelf cleared to the pouch and pack | medium, locked | hand sets pouch down, lets go, holds | "Sprout gummies. Sixty-plus ingredients in one daily pack." / "First order, $29.99 with text sign-up." | 5s + 4s held end card | soft set-down tap
         Continuity: the skeleton keeps its mark in F1 to F5. The right hand works the door, scoop and tubs. The left hand holds the pack and the right hand tears and receives the gummies. The pack is whole until F6 and torn only from F6 on. The pouch is never torn and stays closed.
         (approve) Flick through F1 to F8 and check the same camera and mark in F1 to F5, the tub growth, and the pack and pouch against the product sheet before you make any clip.

STAGE 5  CLIP 1 (4s, start F1)  Attach images 1 and 2. [CHARACTER] [LOOK] Beat 1 the skeleton grips the door handle with its right hand. Beat 2 the door swings open to reveal a lone tub on the middle shelf.
         Beat 3 its head tilts and its eyes look up at the empty shelves. [CLEAN] Camera locked off. End frame none (the next step comes on the cut). HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 2 (4s, start F2)  Attach images 1 and 2. [CHARACTER] [LOOK] Beat 1 the skeleton holds the scoop of powder up near its face. Beat 2 its eyes squint hard and its head pulls back.
         Beat 3 it lowers the scoop back into the tub. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 3 (3s, start F3)  Attach images 1 and 2. [CHARACTER] [LOOK] Beat 1 the skeleton pushes a tub onto the crowded middle shelf. Beat 2 the shelf bows down slowly at its centre.
         Beat 3 its eyes go wide and its hands lift away. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 4 (4s, start F4)  Attach images 1 and 2. [CHARACTER] [LOOK] Beat 1 the skeleton leans both hands on the nearly shut door. Beat 2 it bumps its hip into the door and the door clicks shut.
         Beat 3 it leans back against the door with half-closed, relieved eyes. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 5 (5s, start F5)  Attach images 1 and 2. [CHARACTER] [LOOK] Beat 1 the cupboard door swings wide open. Beat 2 tubs tumble off the shelves and roll around the skeleton's feet.
         Beat 3 its shoulders drop, its arms hang, its eyes droop, and it holds still. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 6 (3s, start F6, end F7)  Attach images 1, 2 and 3. [CHARACTER] [LOOK] Beat 1 its right fingers pinch the daily pack's top corner. Beat 2 it tears the pack straight across the top edge only.
         Beat 3 its eyes brighten. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain. Daily pack stays exactly as image 3.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 7 (3s, start F7)  Attach images 1, 2 and 3. [CHARACTER] [LOOK] Beat 1 the skeleton tilts the torn pack over its open right palm. Beat 2 the gummies slide into its palm.
         Beat 3 its eyes curve into a smile. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain. Pack stays torn only across its top edge, as image 3.  SOUND Sound: quiet room tone and small prop sounds only.
         CLIP 8 (5s, start F8)  Attach images 1, 2 and 3. [CHARACTER] [LOOK] Beat 1 the skeleton's hand sets the pouch upright on the shelf. Beat 2 the hand lets go and slides out of frame.
         Beat 3 the pouch and pack sit still. [CLEAN] Camera locked off. HOLD Same skeleton as image 1. Bones stay joined and rigid. Jaw stays closed. Real-time speed. Surfaces stay plain. Pouch stays closed at its resealable top, printing exactly as image 3.  SOUND Sound: quiet room tone and small prop sounds only.
         TAKES Make 2 or 3 takes of each clip and pick the one where the bones stay joined and only the tubs move.
         VOICE Record all eight lines first, in one take, in a stock voice (for example from the ElevenLabs library), never a cloned voice. Use a short pause tag after "Rip." and after "Tip.". The skeleton never speaks, so there is no lip-sync. Then cut each clip to its line and redo the timings below.
         EDIT Q caption "How many half-used tubs can one cupboard hold?" at 0.0s (estimate). Label TUB 1 at 4.0s, TUB 5 at 8.0s, TUB 12 at 11.0s, TUB 20 at 15.0s (all estimates). Hold the TUB 20 peak one extra second (15.0–20.0s). Turn 20.0–26.0s. Close 26.0–31.0s.
              Freeze the last frame of clip 8 as the end card at 31.0–35.0s with "First order, $29.99 with text sign-up." word for word from the current offer. Run captions under every spoken line. Keep all labels, captions and offer text inside the platform's safe zone, clear of the side buttons and the bottom caption area.
              Music not stated, so none until the brand confirms it uses music. If yes: light under the climb (0–15s), a hard stop at the TUB 20 peak, back in for the close (20s on).
              All times are estimates until the narration exists. Final check: every label right, "sixty-plus" kept off the frames until sourced, the pack torn only across its top edge, the pouch only ever closed.
         MAKE I write the prompts only. No video tool is connected here, so no picture or clip comes from this chat. Make each first frame from its prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then animate that frame with its clip prompt.
              In Higgsfield, paste each clip prompt into its video tool and pick Seedance, Kling or Veo (paid credits), or connect Higgsfield to Claude so Claude makes the clips there. Paid Google AI plans include Veo in the Gemini app, a few clips a day.
              In Claude Code, with a key from a video service that offers Seedance, Kling or Veo, each clip prompt can be sent and the files saved. Pictures alone need an OpenAI key (platform.openai.com/api-keys) or a Google key (aistudio.google.com/apikey), and each picture is billed.
         MISSING: source for "Sixty-plus ingredients" (keep the line out of the ad until sourced)
         MISSING: label text on the pouch and daily pack, word for word (photos not visible to me)
         MISSING: real size of the pouch and daily pack against a hand
         MISSING: how the gummies look (the gummies are drawn only from the real photos)
         MISSING: whether the brand uses music
         MISSING: confirmation that "First order, $29.99 with text sign-up." is the current offer
CHECKS MISSED  The product matches its photos: not verified, because the attached photos weren't visible to me. Check the product sheet against the real pouch and pack before any frame.
```
```
