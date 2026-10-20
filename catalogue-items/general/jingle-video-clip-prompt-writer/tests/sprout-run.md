# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, complete run: it says it can't see the photos, builds the product look only from brand.md, keeps every sung line to approved brand facts, and lays a clean 15-bar storyboard with beat-timed clips. The owner gets usable prompts for every stage plus an honest list of gaps (offer line, hero pouch, music/animation sign-off) rather than guesses.

## Judge list

- Met: Stopped for approval after avatar card, sheets, and track+storyboard, unless approved ahead
  "File 1: Avatar card `[approved ahead]`", "File 3 ... `[approved ahead]`", "File 4 ... `(approve)`" matches the input's approvals.
- Met: Music prompt comes before the storyboard, and every cut sits on a bar line of the grid
  Music prompt opens File 4, then bar grid (2.0 s a bar); cuts at 0, 2, 4 ... 28 s all on bar lines.
- Met: Music prompt starts singing at 0 seconds and ends on the sung tag
  "No instrumental intro: vocals begin at 0 seconds on the first downbeat ... End on the tag with a clean stop at 30 seconds"
- Met: Animated lead and pack match their sheets in every shot
  Every frame uses "[LEAD from image 1]" and "pouch/pack from image 3"; hold line "Same lead as image 1. Same product as image 3."
- Met: Mouths closed in every non-singing shot, pack on screen within 5 seconds
  "Every shot also gets 'mouth stays closed', because no shot sings"; S1 at 0-2 s shows torn pack and pouch.

## What went in

```text
Song script (from the song ad script skill), 30 s, 120 BPM:
[Hook] Rip it, tip it, out the door / A handful of greens and
nothing more
[Verse] Lunch box packed and the kettle's on / Keys in my hand
and the morning's gone / That chalky shake? Still in the sink /
No time to scrub, no time to think
[Hook] (same)  [Lift] Twenty-one vitamins and minerals (2 bars) /
Tastes like a treat, works like a supplement (2 bars)
[Hook] (same)  [Tag] Rip. Tip. Sprout.
Sound: bright indie pop, warm female lead, handclaps, jangly
guitar. Cast note: unseen singer; one animated adult woman, the
busy parent, on screen.
Photos attached: pouch front, side and top; one daily pack. Pack
torn straight across its top edge; the pouch opens only at its
resealable top. Colours: forest green, warm cream, sunflower.
Tools: one-box music tool; video clips up to 8 s with timed
prompts and an end frame; no mouth sync.
Brand file: attached (brand.md).
Approvals: take the avatar card and sheets as approved, and write
every stage now. I'll make the track and tell you if it drifts.

[attached: sprout/brand.md]
```

## What came out

```text
I write the prompts only. No video tool is connected here, so no pictures, track or clips get made in this chat.

I can't see the pouch and pack photos in this chat. The product's look and label words below come from brand.md, and the product sheet's match to the real pack is still to check.

One question: has Sprout OK'd music and animation in its ads? Everything is written below, but nothing should be made in a tool until it has. `MISSING: the brand's OK for music and animation`

---

## File 1: Avatar card `[approved ahead]`

| Field | Lead |
|---|---|
| Role in the song | The busy parent on a school-morning rush. She packs the lunch, grabs the keys, rips and tips one pack, and is out the door. She never sings, speaks or gives a testimonial. She is not shown as a customer, founder or expert. |
| Age range | Late 30s (made-up adult, about 35 to 42) |
| Look | Original soft 3D cartoon look. Medium build with rounded friendly shapes and a round face. Light olive skin, large expressive dark-brown eyes, quick warm closed-mouth smile. Chestnut-brown wavy hair in a messy high bun. |
| Two clothing colours | Sunflower yellow (chunky knit cardigan) and warm cream (crew-neck top, wide-leg trousers, plain sneakers) |
| Signature item | Plum-purple scrunchie holding the bun |
| Props | Plain kelly-green lunch box. Key ring with a round sunflower-yellow fob. Plain cream canvas tote on her right shoulder. One Sprout daily pack and the Sprout pouch (from the product sheet). |
| Hands (never swap) | Daily pack and keys: left hand. Gummies: right palm. The right fingers do the tear. |
| Voice | She has no on-screen voice. The song is sung by an unseen made-up singer: a warm, bright, mid-range female voice with a smile in the tone, crisp consonants and light natural vibrato. It is not cloned and not modelled on any real person. |
| Never changes | Face, eye size and colour. Bun and plum scrunchie. Yellow cardigan over cream top, trousers and sneakers. No logos or print on clothes, no jewellery. Hand roles. Mouth closed in every shot. |

---

## File 2: Reference image prompts and the pick

Common to all four: `[LOOK] Full-body reference of [LEAD], alone, on a plain warm-cream seamless backdrop, soft floor shadow, no props, no text, no logos.`

- **A:** Standing front three-quarter, weight on one hip, relaxed closed-mouth smile, arms loose.
- **B:** Mid-stride to frame right, glancing back over her left shoulder, bun bouncing, cardigan swinging, bright closed-mouth smile.
- **C:** Standing, both hands cupped in front of her chest as if holding something small, eyes crinkled in delight, mouth closed.
- **D:** Laughing with mouth closed, shoulders lifted, eyes squeezed shut, one hand on her hip.

**Pick: B.** This is provisional, so confirm it once the images exist. B shows the card's energy: a parent in motion, moving left to right like the edit will. It also sits on the 120 BPM bounce of the song, and it shows the bun, scrunchie and cardigan swing clearly for the sheets. If B drifts from the card (extra colours, a logo, a smaller-eyed face), fall back to C, which matches the "handful" action.

---

## File 3: Sheets and lock lines `[approved ahead]`

**Image numbering used in every prompt from here on:**

| Image | Sheet |
|---|---|
| Image 1 | Character sheet |
| Image 2 | Kitchen set sheet |
| Image 3 | Product sheet |
| Image 4 | Front door and front path set sheet |

### Lock lines (paste word for word wherever [LEAD] or [LOOK] appears)

**LEAD:** Animated adult woman, late 30s, original soft 3D cartoon look, medium build, round face, light olive skin, large expressive dark-brown eyes, chestnut-brown wavy hair in a messy high bun tied with a plum-purple scrunchie, sunflower-yellow chunky knit cardigan over a warm-cream crew-neck top, warm-cream wide-leg trousers and plain cream sneakers, no logos, no jewellery, mouth closed.

**LOOK:** Bright, sunny, candy-like original soft 3D animation with matte rounded surfaces and simple clean shapes, in forest green #00582D, warm cream #FFF7DF, sunflower yellow #FFCC2E, kelly green #007E40, with small plum #581E5A accents; warm low morning sunlight from frame left (through a window indoors), soft shadows; never muted, never clinical; no text anywhere except the product's own printing.

### Character sheet prompt (from the picked image B)

`[LOOK] Character turnaround sheet of [LEAD from image B], plain warm-cream backdrop, evenly spaced, no text labels:`
- Top row: front, three-quarter left, three-quarter right, side profile, back. The bun and scrunchie are visible from the back.
- Action row:
  - Left hand holding a small flat daily pack while right fingers tear straight across its top edge.
  - Left hand tipping the torn pack so small deep-green gummy bears pour into her cupped right palm.
  - Both hands clicking a plain kelly-green lunch box shut.
  - Left hand lifting a key ring with a round yellow fob off a hook.
  - Right forearm sliding objects aside on a counter.
  - Mid-stride to frame right with a cream tote on her right shoulder.
  - Right hand tossing one gummy bear up and catching it.
- Mouth: closed in every pose. The singer is unseen, so no singing mouth is needed.
- Scale row: her standing beside the Sprout pouch from image 3 on a counter, with the pouch about the height of her forearm. Her palm holds about 6 to 8 thumbnail-sized bears. `[inferred]`

### Product sheet prompt (from the real photos: pouch front, side and top, and one daily pack)

`[LOOK, but lit evenly] Product reference sheet built from the attached photos, printing kept exactly as photographed, no new words, no changed logo, plain warm-cream backdrop:`
- **Pouch:** front, side and top.
  - Glossy deep forest-green stand-up foil pouch with the big yellow wordmark, a yellow bear face top right and "28 Daily Packs" at the bottom.
  - Shown closed, then open only at its resealable top.
  - Never torn, creased or cut.
- **Daily pack:** front and back.
  - Sealed, torn straight across its top edge, and tipped with gummies pouring from the torn top.
  - Never torn at the side, bottom or a corner.
- **Gummies:** small opaque deep-green bears, soft matte finish, about thumbnail height, loose in a small pile.

Gaps on this sheet:
- `MISSING: which pouch is the hero, Low Sugar or Sugar-Free.` The Sugar-Free pouch adds a white burst.
- `MISSING: the daily pack's look and printing`, which is not in brand.md. Take it from the photo only.
- `MISSING: real sizes of pouch and pack.`
- The match to the real pack is still to check.

### Set sheet prompts (empty, no people, no product)

- **Image 2, kitchen:** `[LOOK] Empty sunny family kitchen, wide and medium views. Plain cream cabinets and a forest-green tiled splashback. A plain cream countertop, a sink under a window at frame left, and a plain kettle on the hob. A plain wall shelf. A key hook by a doorway at frame right. Floor, walls and every surface plain and unmarked, no text.`
- **Image 4, front door and front path:** `[LOOK] Empty front hallway with a plain kelly-green front door. A view through the open door onto a sunny front step. A garden path and a pavement running left to right with low rounded hedges. Plain sky, all surfaces plain and unmarked, no house numbers, no signs, no text.`
- **Product hero backdrop (no sheet needed):** a plain soft gradient from warm cream to sunflower yellow.

---

## File 4: Music prompt, take rule, bar grid, storyboard `(approve)`

### Music prompt (one-box tool, paste as one block)

> 30-second bright indie pop jingle at 120 BPM in 4/4, D major `[inferred]`, warm bright mid-range female lead vocal with a smile in the tone and crisp, clear diction. Instruments are jangly clean electric guitar, handclaps on beats 2 and 4, a bouncy picked bass, light live drums and a little tambourine. No instrumental intro: vocals begin at 0 seconds on the first downbeat with the hook.
>
> Arrangement in order, 15 bars:
> - Hook, bars 1-2 (0-4 s)
> - Verse, bars 3-6 (4-12 s), a touch lighter with guitar and claps
> - Hook, bars 7-8 (12-16 s)
> - Lift, bars 9-12 (16-24 s), building with fuller drums
> - Hook, bars 13-14 (24-28 s), full band
> - Tag, bar 15 (28-30 s), three short punchy sung hits on the downbeats, with a final handclap
>
> End on the tag with a clean stop at 30 seconds, with no fade and no tail. Sing every word exactly as written, clearly enough to read along.
>
> Lyrics:
> - [Hook] Rip it, tip it, out the door / A handful of greens and nothing more
> - [Verse] Lunch box packed and the kettle's on / Keys in my hand and the morning's gone / That chalky shake? Still in the sink / No time to scrub, no time to think
> - [Hook] Rip it, tip it, out the door / A handful of greens and nothing more
> - [Lift] Twenty-one vitamins and minerals / Tastes like a treat, works like a supplement
> - [Hook] Rip it, tip it, out the door / A handful of greens and nothing more
> - [Tag] Rip. Tip. Sprout.

### Take rule

1. Make 3 to 5 whole takes and pick one.
2. Never join sections from different takes, because tempo feel, key and voice change between takes.
3. Trim nothing but silence before the first sung note.

### Bar grid

Seconds per bar = 240 ÷ 120 = **2.0 s**. A beat is 0.5 s.

The Lift's 2 + 2 bars come from the script. The hook (1 bar per line), verse (1 bar per line) and tag (1 bar) counts are `[inferred]`.

| Bars | Seconds | Section |
|---|---|---|
| 1-2 | 0-4 | Hook |
| 3-6 | 4-12 | Verse |
| 7-8 | 12-16 | Hook |
| 9-12 | 16-24 | Lift |
| 13-14 | 24-28 | Hook |
| 15 | 28-30 | Tag |

The storyboard below sits on this script grid. Once the chosen take exists:
- Find the downbeat where singing starts. It should be at 0.0 s after trimming silence.
- Check that bars 7, 9, 13 and 15 land at 12, 16, 24 and 28 s.
- If the take drifts, tell me and I'll re-time every cut to the take's real word times.

### Continuity rules

- **Direction:** the action moves left to right (kitchen, then door at frame right, then the path running right). The camera stays on the counter-front side of that line in every shot.
- **Hands:** pack and keys are always in her left hand. Gummies are always in her right palm.
- **Daily pack state:**
  - Sealed until S1, where it is torn.
  - After S1 it is torn or out of frame.
  - In S14 a pack tears itself in that shot.
- **Pouch:** always closed at its resealable top and never torn.
- **Mouth:** closed in every shot. She never eats on screen.

### Frame prompts

**S1, bar 1**
`[LOOK] SHOT: extreme close-up, hands only; [LEAD from image 1] left hand holds a sealed daily pack while right fingertips are mid-tear straight across its top edge; kitchen counter from image 2, plain and unmarked; Sprout pouch from image 3 standing closed and soft-focus behind; daily pack from image 3.`

**S2, bar 2**
`[LOOK] SHOT: medium close-up, chest up; [LEAD from image 1] left hand tips the torn daily pack, deep-green gummy bears mid-pour into her cupped right palm, closed-mouth smile; kitchen from image 2, window light from frame left; torn daily pack and gummies from image 3.`

**S3, bar 3**
`[LOOK] SHOT: wide, full kitchen; [LEAD from image 1] both hands clicking a plain kelly-green lunch box shut, mid-snap; kitchen from image 2 with the plain kettle steaming on the hob behind; plain cream countertop; no product in shot.`

**S4, bar 4**
`[LOOK] SHOT: medium, waist up, three-quarter from frame left; [LEAD from image 1] left hand lifting the yellow-fob keys off the hook as she turns toward the doorway at frame right, bun swinging; kitchen doorway from image 2; cream tote on her right shoulder; no product in shot.`

**S5, bar 5**
`[LOOK] SHOT: high angle, close, looking down into the sink; no lead; a plain unmarked shaker bottle lying in the sink with grey-green sludge clinging inside, a plain unmarked powder tub beside it on the counter edge; sink from image 2.`

**S6, bar 6**
`[LOOK] SHOT: close, side-on along the counter at counter height; [LEAD from image 1] right forearm mid-slide pushing the plain shaker and powder tub out of frame left, left hand setting the Sprout pouch down upright in their place; counter from image 2, plain and unmarked; Sprout pouch from image 3, closed.`

**S7, bar 7**
`[LOOK] SHOT: wide from inside the hallway; [LEAD from image 1] left hand with keys pulling the kelly-green front door open, mid-step out to frame right, right palm loosely cupped around gummy bears, sunlight flooding in; hallway and door from image 4; gummies from image 3.`

**S8, bar 8**
`[LOOK] SHOT: close-up on her right palm at chest height, her smiling face soft-focus above; [LEAD from image 1] lifting the palm of deep-green gummy bears slightly toward camera, mid-motion; sunny front step from image 4; gummies from image 3.`

**S9, bars 9-10**
`[LOOK] SHOT: medium, centred product hero; no lead; Sprout pouch from image 3 standing closed, a small scatter of deep-green gummy bears in front, simple rounded kale leaf, spinach leaf, strawberry and beet shapes mid-bounce into frame around it; plain cream-to-sunflower gradient backdrop, plain floor.`

**S10, bar 11**
`[LOOK] SHOT: medium close-up, slightly low; [LEAD from image 1] holding her cupped right palm of gummies close, eyes squeezed shut in delight, shoulders mid-wiggle, mouth closed; garden path from image 4; gummies from image 3.`

**S11, bar 12**
`[LOOK] SHOT: wide, side-on across the plain wall shelf; no lead; a row of plain unmarked pill bottles and a plain powder tub mid-slide off frame left while the Sprout pouch from image 3 glides in to centre, closed; kitchen shelf from image 2.`

**S12, bar 13**
`[LOOK] SHOT: wide, low angle from the pavement; [LEAD from image 1] mid-stride left to right down the sunny path, keys in left hand, cream tote on right shoulder, right hand loosely closed, closed-mouth grin; path and hedges from image 4; no product in shot.`

**S13, bar 14**
`[LOOK] SHOT: medium close, three-quarter from frame left; [LEAD from image 1] right hand tossing one deep-green gummy bear up, bear at the top of its arc, eyes on it, mouth closed; pavement from image 4, plain sky; gummy from image 3.`

**S14, bar 15**
`[LOOK] SHOT: frontal medium-close product end card, generous empty space above and below; no lead; Sprout pouch from image 3 standing closed at centre-left; a daily pack from image 3 at centre-right, sealed at start, then torn straight across its top edge and tipping gummy bears out of the top onto the plain floor; cream-to-sunflower gradient backdrop.`

### Shot cards

| Shot | Bars | Seconds | Lyric | Picture | Singing? | Framing | Camera |
|---|---|---|---|---|---|---|---|
| S1 | 1 | 0-2 | Rip it, tip it, out the door | Pack torn across top edge, pouch behind (product at 0 s) | No | Extreme close-up | Locked off |
| S2 | 2 | 2-4 | A handful of greens and nothing more | Bears pour into right palm | No | Medium close-up | Slow push in |
| S3 | 3 | 4-6 | Lunch box packed and the kettle's on | Lunch box snaps shut, kettle steams | No | Wide | Locked off |
| S4 | 4 | 6-8 | Keys in my hand and the morning's gone | Keys off hook, turn to door | No | Medium | Slow pan right |
| S5 | 5 | 8-10 | That chalky shake? Still in the sink | Sludgy shaker in sink | No | High-angle close | Locked off |
| S6 | 6 | 10-12 | No time to scrub, no time to think | Old things pushed aside, pouch set down | No | Side-on close | Locked off |
| S7 | 7 | 12-14 | Rip it, tip it, out the door | Door opens, she steps out | No | Wide | Locked off |
| S8 | 8 | 14-16 | A handful of greens and nothing more | Palm of bears lifted | No | Close-up | Slow push in |
| S9 | 9-10 | 16-20 | Twenty-one vitamins and minerals | Pouch hero, leaf and berry shapes bounce in | No | Medium hero | Slow push in |
| S10 | 11 | 20-22 | Tastes like a treat | Delighted wiggle, palm close | No | Medium close-up, low | Locked off |
| S11 | 12 | 22-24 | works like a supplement | Pill bottles and tub slide off, pouch slides in | No | Wide side-on | Locked off |
| S12 | 13 | 24-26 | Rip it, tip it, out the door | Striding down the path | No | Wide, low | Slow track right |
| S13 | 14 | 26-28 | A handful of greens and nothing more | Tosses one bear up | No | Medium close | Locked off |
| S14 | 15 | 28-30 | Rip. Tip. Sprout. | Pack rips, tips, bears spill by the pouch | No | Frontal medium-close | Locked off |

---

## File 5: Clip prompts

All clips:
- Start frame is the first shot's frame. End frame is the second shot's frame where one is listed.
- Attach images 1 to 4 as named.
- Make each clip at its length, or the next length the tool allows, then cut on the bar line.
- Clip time starts at 00:00 on that clip's first downbeat. Beats fall at 0.0, 0.5, 1.0 and 1.5 s of each bar.

**Hold line, pasted in every clip:**
> Same lead as image 1. Same product as image 3. Real-time speed. Surfaces stay plain. No music, voice or song made in this clip.

Every shot also gets "mouth stays closed", because no shot sings.

**Clip A: S1 + S2 (0-4 s).** Start: S1 frame. End: S2 frame.
- `[00:00-00:02]` Extreme close-up, locked off. On beat 1 her right fingertips tear the daily pack straight across its top edge. On beat 3 her left hand tips it. The pouch stays closed behind. Mouth stays closed.
- `[00:02-00:04]` Cut to medium close-up, slow push in. On beat 1 green bears start pouring from the torn top into her right palm. On beat 3 she looks up with a closed-mouth smile. Mouth stays closed.
- Hold line.

**Clip B: S3 + S4 (4-8 s).** Start: S3 frame. End: S4 frame.
- `[00:00-00:02]` Wide, locked off. On beat 1 both hands snap the lunch box shut. On beat 3 the kettle puffs steam. Mouth stays closed.
- `[00:02-00:04]` Cut to medium, slow pan right. On beat 1 her left hand lifts the keys off the hook. On beat 3 she turns toward the doorway at frame right, bun swinging. Mouth stays closed.
- Hold line.

**Clip C: S5 + S6 (8-12 s).** Start: S5 frame. End: S6 frame.
- `[00:00-00:02]` High-angle close, locked off. The shaker sits still. On beat 3 a slow drip of grey-green sludge slides down inside it. No lead.
- `[00:02-00:04]` Cut to side-on close, locked off. On beat 1 her right forearm slides the shaker and tub out of frame left. On beat 3 her left hand sets the closed pouch down upright in their place. Mouth stays closed.
- Hold line.

**Clip D: S7 + S8 (12-16 s).** Start: S7 frame. End: S8 frame.
- `[00:00-00:02]` Wide, locked off. On beat 1 her left hand pulls the door open and sunlight floods in. On beat 3 she steps out to frame right. Mouth stays closed.
- `[00:02-00:04]` Cut to close-up, slow push in. On beat 1 her right palm of bears rises toward camera. On beat 3 it settles. Mouth stays closed.
- Hold line.

**Clip E: S9 (16-20 s).** Start: S9 frame. No end frame.
- `[00:00-00:04]` Medium hero, slow push in. The closed pouch stands still. On beats 1 and 3 of each bar one rounded shape (kale leaf, spinach leaf, strawberry, then beet) bounces into place around it. The bears stay put. No lead.
- Hold line.

**Clip F: S10 + S11 (20-24 s).** Start: S10 frame. End: S11 frame.
- `[00:00-00:02]` Medium close-up, low, locked off. On beat 1 she squeezes her eyes shut in delight. On beat 3 her shoulders do a small wiggle. Mouth stays closed.
- `[00:02-00:04]` Cut to wide side-on, locked off. On beat 1 the pill bottles and tub slide off frame left. On beat 3 the closed pouch glides in to centre and stops. No lead.
- Hold line.

**Clip G: S12 + S13 (24-28 s).** Start: S12 frame. End: S13 frame.
- `[00:00-00:02]` Wide, low, slow track right. She strides left to right with a step landing on each beat. Mouth stays closed.
- `[00:02-00:04]` Cut to medium close, locked off. On beat 1 her right hand tosses one bear up. On beat 3 she catches it in her right palm and grins. Mouth stays closed.
- Hold line.

**Clip H: S14 (28-30 s).** Start: S14 frame, with the pack sealed. No end frame.
- `[00:00-00:02]` Frontal medium-close, locked off. On beat 1 ("Rip") the daily pack tears straight across its top edge. On beat 2 ("Tip") it tips. On beat 3 ("Sprout") bears spill from the top onto the floor beside the closed pouch. On beat 4 everything holds still.
- Hold line.

**Takes:** make 2 or 3 takes of each clip and pick the one where the lead and pouch match images 1 and 3. Check that the tear is straight across the top and the mouth never opens.

---

## File 6: Edit list

- **Lay the chosen take full length**, trimmed only of silence before the first note. Aspect is 9:16 `[inferred]`.
- **Cut points**, snapped to the take's real downbeats. Re-time if the take drifts.

  | Cut at | Into |
  |---|---|
  | 0.0 s | S1 |
  | 2.0 s | S2 |
  | 4.0 s | S3 |
  | 6.0 s | S4 |
  | 8.0 s | S5 |
  | 10.0 s | S6 |
  | 12.0 s | S7 |
  | 14.0 s | S8 |
  | 16.0 s | S9 |
  | 20.0 s | S10 |
  | 22.0 s | S11 |
  | 24.0 s | S12 |
  | 26.0 s | S13 |
  | 28.0 s | S14 |
  | 30.0 s | Clean end on the stop |

- **Lip-sync shots:** none. The singer is unseen and every mouth stays closed. No sync tool is needed.
- **Captions (optional):** one lyric line per bar, appearing on each line's downbeat, in Work Sans bold, warm cream on a forest-green pill.
  - Spell the Lift line out as "Twenty-one vitamins and minerals", as sung.
  - Leave the tag uncaptioned so the offer has the space.
- **Offer text:** over the tag, 28.0 to 30.0 s.
  - Optional early entry at 27.0 s if 2 s reads too fast.
  - Kelly-green button shape #007E40, cream text.
  - Line: `[OFFER LINE]`. `MISSING: which current offer to run.` brand.md shows several conflicting live discounts (52%, 55%, 49%, 58%, 61%, $29.99).
  - If you pick "Subscriptions start at $29.99", add its condition: "First order, with new-customer text discount. Renews at $49.99 every 4 weeks."
  - Don't add the money-back guarantee unless you also say it is first order only. Don't promise an easy cancel.
- **Safe zone:** keep all words in the centre of the frame.
  - Clear of roughly the top 14%, the bottom 35% (caption and CTA area) and the right-hand 12% (buttons).
  - Check against each platform's current template.
  - The product's own printing in S9 and S14 also sits inside this zone.
- **Final check:**
  - Every line is sung as written.
  - "Twenty-one vitamins and minerals" matches the approved 21 count.
  - "Tastes like a treat, works like a supplement" is the brand's own line.
  - The tag "Rip. Tip. Sprout." adapts the brand line "Rip. Tip. Enjoy.", so confirm it with the brand.
  - No result is sung or shown. No "supports" claim is sung, so no FDA line is needed for these words; confirm with the brand's reviewer.
  - The product is on screen at 0 s.
  - No artist is named and no voice is cloned.
  - No child, no tie-in characters, no partner marks.
- **Gaps:**
  - `MISSING: the brand's OK for music and animation.` Nothing should be made until it's given.
  - `MISSING: which current offer line to put on screen.`
  - `MISSING: Low Sugar or Sugar-Free hero pouch.`
  - `MISSING: the daily pack's printed look, and real pouch and pack sizes.` Take these from the photos. The product sheet's match to the real pack is still to check.
  - `MISSING: names of the music and video tools, so music rights can be checked for ads and the shortest clip length the video tool allows is known.`
  - `[inferred]`: bar counts for hook, verse and tag; key of D major; 9:16 aspect; pouch-to-forearm scale.

**To finish it:**
1. Make each start frame from its prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, with images 1 to 4 attached.
2. Animate each frame with its clip prompt in one of these:
   - **Higgsfield:** use its video tool and pick Seedance, Kling or Veo. It runs on paid credits. You can also connect Higgsfield to Claude so Claude makes the clips there.
   - **Gemini:** paid Google AI plans include Veo video in the Gemini app, with a few clips a day.
   - **Claude Code:** with a key from a video service offering Seedance, Kling or Veo, I can send each prompt there and save the files. Pictures alone need an OpenAI key (platform.openai.com/api-keys) or a Google key (aistudio.google.com/apikey), and each picture is billed.

---

## File 7: Checks missed

CHECKS MISSED:
- The track isn't made yet, so the storyboard sits on the script's 120 BPM grid. It still needs re-timing to the chosen take's real downbeats.
- The cuts aren't yet checked against bar lines of the chosen take, because the take doesn't exist yet.

---

Next, would you like to turn this into a full shot list with the [Video ad shot list maker](https://useaiblocks.com/skills/video-ad-shot-list-maker)? Or type what you'd rather do.
```
