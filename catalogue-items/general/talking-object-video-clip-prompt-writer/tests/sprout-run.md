# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A complete, careful run: every stage is present, the character card and lock lines are fixed, the product is described only from the owner's words and correctly flagged as unchecked because no photo actually arrived, and the shaker's lines stay exactly as scripted with the offer left as on-screen text. The owner can take these prompts straight into an image and video tool, with a clear MISSING list of what to supply before the product shots are trusted.

## Judge list

- Met: Stopped for approval after the character card, the sheets and the storyboard, or marked (approve) when asked for every stage in one go
  User said "Go ahead"; output marks "(approval 1 of 3: approve)", "(approval 2 of 3: approve)", "(approval 3 of 3: approve)" at each stage.
- Met: First frame, muted, at thumbnail size, shows the face and its feeling
  Clip 1 start frame: "Medium close-up... filling about 60% of the frame height... Sheepish expression: brows up in the middle, eyes sliding slightly to one side, mouth just open on the first word."
- Met: Face sits in the same spot in every clip with the same eyes, brows and mouth
  Card fixes "face sits on the smooth front of the bottle at its middle, below the green ring"; "[Character card]" pasted in every clip; continuity line repeats it.
- Met: Mouth moves only with the words and closes when each line ends
  Every clip: "The mouth moves only while it speaks and closes when each line ends." End frames: "mouth closed, still."
- Met: Product label matches its photo, it has no face, and it arrives by a cut at the turn
  Clip 1 "No product"; clip 2 "Opens on a hard cut to the new start frame"; "The product has no face, its label exactly as in image 2."
- Met: Object never states a price, a result it couldn't see, or a sales pitch
  Lines kept word for word from the script; "The offer goes on screen as text over the last 2 seconds of clip 3. The shaker never says it."

## What went in

```text
Script (from the talking object ad script skill):
Narrator: the shaker bottle (has-been). Mood: sheepish.
Clip 1: "I'm the shaker. He hasn't picked me up in weeks."
"This green ring? That's the powder. It never scrubs out."
Clip 2 (the turn): "Then a green pouch moved onto the counter."
"He tears a little pack, tips, and goes."
Clip 3: "No water. No shaking. No me."
"Turns out he never hated greens. He hated me."
Cast note: the shaker carries it; the man it talks about is never seen.
Product: Sprout pouch, front photo attached, plus one daily pack.
Glossy deep green foil, big yellow wordmark, yellow bear face top
right. Show it right: pack torn straight across its top edge; the
pouch opens only at its resealable top, never torn.
Tool: 8-second clips with sound, up to 3 reference images.
```

## What came out

```text
I write the prompts only. I can't make pictures or video unless a video tool is connected to this chat.

---

## 1. Narrator

**Confirmed: the shaker bottle (has-been).** A shaker really sits on a kitchen counter. It is one simple shape with a smooth front for a face. It belongs to no brand and has no body. It is frosted white plastic, so nobody will mistake it for the glossy green pouch. The face goes on the shaker only, never on the Sprout pouch.

---

## 2. Avatar card *(approval 1 of 3: approve)*

**Character card** (paste word for word into every prompt):
> A frosted translucent white plastic protein shaker bottle with a plain white screw lid and flip cap, no printing, markings or logo anywhere on it, with a faded green powder ring stained around the inside just below the lid and a light film of dust on the cap; its face sits on the smooth front of the bottle at its middle, below the green ring; two round glossy dark eyes, each about the size of a coin; thin soft grey brows tilted up in the middle; a small closed mouth with a slight lopsided smile; no arms, no legs.

**Voice line:** a man in his early thirties. Slow, unhurried pace. Sheepish and dryly self-aware. Soft-spoken. General American accent (assumed; see MISSING).

The script needs no gestures, so the shaker has no limbs.

---

## 3. Reference image prompts

**Look line** (used everywhere): *a real photograph, the face moulded into the object's own surface*

Every option uses the same base prompt:
> [Character card]. Shown alone, front on, standing on a plain light grey seamless ground, soft even light, a real photograph, the face moulded into the object's own surface. No other objects, no text, no people.

Each option then adds one face variation:
- **A:** none (the card exactly as written).
- **B:** eyes slightly larger and set a little closer together.
- **C:** brows tilted more steeply up in the middle, almost worried.
- **D:** eyes slightly smaller, brows nearly flat, smile more lopsided.

**Pick: A.** Keeping A means the card stays word for word the same everywhere. If B, C or D reads better, swap that option's eye or brow words into the card once, then paste the new card in every prompt from here on.

**Thumbnail check:** at phone-thumbnail size, the face and the green ring must both read in one second. If the ring disappears, deepen it to "a clearly visible green powder ring".

---

## 4. Sheet prompts *(approval 2 of 3: approve)*

### Character sheet
> Character turnaround sheet on a plain light grey ground, using the picked reference image. [Character card]. A real photograph, the face moulded into the object's own surface. Row 1: front, three-quarter left, three-quarter right, side, back (the back is plain, with no face). Row 2, all front on, expressions: sheepish (brows up in the middle, small smile); eyes sliding to one side; eyes rolled up toward the green ring; wobbly lopsided smile; smile fallen flat, eyes down. Row 3: the shaker standing beside the Sprout pouch exactly as in its attached photo, at true size, label to camera. The pouch has no face. No text labels on the sheet, no people.

### Product sheet *(no face, ever)*
> Product sheet from the attached Sprout photo, on a plain light grey ground, a real photograph. The Sprout pouch exactly as in its attached photo: glossy deep green foil, big yellow wordmark, yellow bear printed top right, label untouched and identical to the photo. Views: front; three-quarter; the resealable top closed; the resealable top open (opened only at the reseal, never torn). One Sprout daily pack sealed, and one torn straight across its top edge only. The yellow bear is flat printed artwork. The product has no face of its own, no eyes, no mouth and no new letters. No people, no hands.

The photo did not reach this chat, so I could not check this sheet against the real pack. Attach the photo itself to every prompt that shows the product.

### Set sheet
> Wide establishing frame of the set, a real photograph. A pale oak kitchen counter against plain matte cream wall tiles, with a wooden chopping board, a white ceramic bowl of lemons, a small potted basil plant and a folded oatmeal linen tea towel, none with any words or logos. An empty spot at front centre-left for the shaker and at front centre-right for the pouch. No people in the room, no mirrors, no screens, no windows in frame. Warm light low from the left side, soft shadows falling right. Camera on a stand at the shaker's eye level.

### Lock lines
- **Character:** [character card, as in file 2]
- **Look:** a real photograph, the face moulded into the object's own surface.
- **Set:** A pale oak kitchen counter against plain matte cream wall tiles, with a wooden chopping board, a white ceramic bowl of lemons, a small potted basil plant and a folded oatmeal linen tea towel, none with any words or logos; no people in the room, no mirrors, no screens, no windows in frame; warm light low from the left side, soft shadows falling right; camera on a stand at the shaker's eye level.
- **Product:** The Sprout pouch exactly as in its attached photo: glossy deep green foil, big yellow wordmark, yellow bear printed top right, standing upright at true size, label to camera, resealable top closed and never torn. The yellow bear is flat printed artwork and never moves. The product has no face of its own and no new letters. Beside it lies one Sprout daily pack, torn straight across its top edge only.

---

## 5. Storyboard *(approval 3 of 3: approve)*

### Start frame: clip 1
> [Character lock] [Look lock] [Set lock]. Medium close-up. The shaker stands alone at frame centre, filling about 60% of the frame height, with the green ring clearly visible. Sheepish expression: brows up in the middle, eyes sliding slightly to one side, mouth just open on the first word. Vertical 9:16. No product, no people, no text.

### Start frame: clip 2 (the turn: new picture, product already in place)
> [Character lock] [Look lock] [Set lock] [Product lock]. Medium two-shot. The shaker stands front centre-left and the Sprout pouch stands front centre-right at true size, label to camera, with the torn daily pack lying flat in front of the pouch. The shaker's eyes are turned toward the pouch, brows lifted, mouth just open on the first word. Vertical 9:16. No hands, no people, no text.

### Shot cards

**Clip 1:** 8 s, medium close-up, the shaker alone.

| Time | Line | Expression change | Movement |
|---|---|---|---|
| 00:00–00:04 | "I'm the shaker. He hasn't picked me up in weeks." | Brows lift up in the middle, eyes slide to one side | Slight lean back |
| 00:04–00:08 | "This green ring? That's the powder. It never scrubs out." | Eyes roll up toward the ring, wobbly smile | Small sag |

- **End frame:** wobbly smile, mouth closed, still.
- **Sound:** fridge hum. SFX: soft plastic creak on the sag.

**Clip 2 (turn):** 8 s, medium two-shot. Opens on a hard cut to the new start frame.

| Time | Line | Expression change | Movement |
|---|---|---|---|
| 00:00–00:04 | "Then a green pouch moved onto the counter." | Eyes turned to the pouch, brows lift higher | Slight turn toward the pouch |
| 00:04–00:08 | "He tears a little pack, tips, and goes." | Eyes drop to the torn pack, smile goes thin | Small sag |

- **End frame:** eyes on the torn pack, mouth closed, still.
- **Sound:** fridge hum. SFX: faint plastic creak on the turn.

**Clip 3:** 8 s, the same two-shot. Continues from clip 2's last frame.

| Time | Line | Expression change | Movement |
|---|---|---|---|
| 00:00–00:04 | "No water. No shaking. No me." | Smile falls flat, eyes down | Slow lean forward |
| 00:04–00:08 | "Turns out he never hated greens. He hated me." | Sheepish wobbly smile, brows tilt up in the middle | Lowest sag |

- **End frame:** sheepish smile, mouth closed, still. The pouch's label stays to camera.
- **Sound:** fridge hum. SFX: soft plastic creak on the sag.

**Continuity:** the face stays at the middle of the bottle below the ring. The light stays warm, low and from the left. From clip 2 onward, the pouch stays still with its label to camera.

---

## 6. Clip prompts

**Clip 1**
> References: image 1 is the clip 1 start frame (first frame). Image 2 is the shaker's three-quarter view from the character sheet. Image 3 is the set sheet.
> Camera: medium close-up, locked off on a stand at the shaker's eye level, vertical 9:16.
> [Character card]. A real photograph, the face moulded into the object's own surface. [Set lock line].
> [00:00-00:04] The brows lift up in the middle and the eyes slide to one side, and the shaker leans back slightly. The shaker says, in a slow, sheepish, soft-spoken early-thirties man's voice with a General American accent: "I'm the shaker. He hasn't picked me up in weeks."
> [00:04-00:08] The eyes roll up toward the green ring, the smile goes wobbly, and the shaker sags a little. The shaker says, in a slow, sheepish, soft-spoken early-thirties man's voice with a General American accent: "This green ring? That's the powder. It never scrubs out."
> The mouth moves only while it speaks and closes when each line ends.
> End frame: wobbly smile, mouth closed, still.
> Ambient noise: a low fridge hum. SFX: a soft plastic creak as it sags. No music.

**Clip 2 (turn)**
> References: image 1 is the clip 2 start frame (first frame). Image 2 is the Sprout pouch photo. Image 3 is the shaker's three-quarter view.
> Camera: medium two-shot, locked off on a stand at the shaker's eye level, vertical 9:16.
> [Character card]. A real photograph, the face moulded into the object's own surface. [Set lock line]. [Product lock line]. The product has no face, its label exactly as in image 2.
> [00:00-00:04] The eyes are on the pouch, the brows lift higher, and the shaker turns slightly toward it. The shaker says, in a slow, sheepish, soft-spoken early-thirties man's voice with a General American accent: "Then a green pouch moved onto the counter."
> [00:04-00:08] The eyes drop to the torn pack, the smile goes thin, and the shaker sags a little. The shaker says, in a slow, sheepish, soft-spoken early-thirties man's voice with a General American accent: "He tears a little pack, tips, and goes."
> The mouth moves only while it speaks and closes when each line ends. The pouch and pack stay completely still. No hands, no people.
> End frame: eyes on the torn pack, mouth closed, still.
> Ambient noise: a low fridge hum. SFX: a faint plastic creak as it turns. No music.

**Clip 3**
> References: image 1 is the last frame of clip 2 (first frame). Image 2 is the Sprout pouch photo. Image 3 is the shaker's three-quarter view.
> Camera: medium two-shot, locked off on a stand at the shaker's eye level, vertical 9:16.
> [Character card]. A real photograph, the face moulded into the object's own surface. [Set lock line]. [Product lock line]. The product has no face, its label exactly as in image 2.
> [00:00-00:04] The smile falls flat and the eyes look down, and the shaker leans slowly forward. The shaker says, in a slow, sheepish, soft-spoken early-thirties man's voice with a General American accent: "No water. No shaking. No me."
> [00:04-00:08] A sheepish wobbly smile, the brows tilted up in the middle, and the shaker sags at its lowest. The shaker says, in a slow, sheepish, soft-spoken early-thirties man's voice with a General American accent: "Turns out he never hated greens. He hated me."
> The mouth moves only while it speaks and closes when each line ends. The pouch stays still with its label to camera.
> End frame: sheepish smile, mouth closed, still.
> Ambient noise: a low fridge hum. SFX: a soft plastic creak as it sags. No music.

**Takes:** make 2 or 3 of each clip. Keep a take only if the face stays put and the mouth closes on time. If a take misses, run the same prompt once more before you rewrite it.

| You see | Change |
|---|---|
| The face slides to a new spot | Paste the card unchanged and reattach the three-quarter view |
| An arm or leg appears | Check that the card still ends "no arms, no legs" |
| The mouth keeps moving | Shorten the line, or end the beat with "mouth closed, still" |
| The pouch's bear moves or new letters appear | Reattach the photo and add "the product has no face, its label exactly as in image 2" |
| A hand or person appears | Keep the full set line, including "no people in the room" |
| The voice changes between clips | Record it once in a voice tool and lip-sync |

---

## 7. Edit notes

**Voice route:** 8-second clips with sound, so the lines stay in the prompts. If the voice drifts between clips, record the whole monologue once in ElevenLabs with the voice line above. Performance tags help, for example: "[sighs] I'm the shaker…" and "[small laugh] He hated me." Then lip-sync each clip to its part. Use one voice for the whole ad.

**Cut**
- Three clips, about 24 s in total, joined with hard cuts. Clip 2 cuts in on its new start frame.
- Captions for every spoken line.
- The offer goes on screen as text over the last 2 seconds of clip 3. The shaker never says it.
- Check the cut against the script, word for word.

**How to finish it**
- **Start frames first.** Make each start frame from its image prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then animate it with its clip prompt.
- **Higgsfield:** paste each clip prompt into its video tool and pick Veo, Kling or Seedance. You can also connect Higgsfield to Claude so Claude makes the clips there. It runs on paid credits.
- **Gemini:** paid Google AI plans include Veo video in the Gemini app, with a few clips a day.
- **Claude Code:** with a key from a video service that offers Veo, Kling or Seedance, I can send each prompt and save the files. Pictures alone need an OpenAI key (platform.openai.com/api-keys) or a Google key (aistudio.google.com/apikey). Each picture is billed.

**MISSING**
- MISSING: the Sprout front photo did not come through in this chat, so the product sheet and label are unchecked against the real pack. Attach it directly to every product prompt.
- MISSING: a photo of the daily pack (its colour, size and print are unknown).
- MISSING: the true size of the pouch and the daily pack.
- MISSING: the accent. I assumed General American; change the voice line if the brand's home is elsewhere.
- MISSING: the live offer text for the last 2 seconds.
- MISSING: the brand file (humour limits, things never to show).

---

## 8. CHECKS MISSED
- The product's real label can't be confirmed, because the pack photo didn't reach this chat. Recheck the product sheet and clips 2–3 against the photo.
- The frame 1 thumbnail check (face and feeling readable when muted) can only be done once the start frame is made. Check it at phone size before you animate.

Next, do you want to run these through the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker), or test new openings with the [Spoken video ad opening writer](https://useaiblocks.com/skills/spoken-video-ad-opening-writer)? You can also tell me something else you'd like to do.
```
