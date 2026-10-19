# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 6 met. Invented facts: 0.

The shot table is tight, correct and shoot-ready: timings match the brisk pace, every cut changes angle and size, the pack is torn straight across and tipped into a palm as the brand requires, and every unknown is flagged MISSING rather than guessed. It stops at approval 3 as the skill instructs, so the owner gets no clip prompts, edit list or score yet, which leaves criterion 5 undemonstrated.

## Fix

Resolve the conflict between 'Stop for approval after stages 1, 3 and 4' and an output shape and judge list that expect Stage 5: either state that when lock lines arrive pre-approved the run may draft Stage 5 as 'provisional pending approval 3', or trim the judge list and output shape to what Stage 4 produces.

## Judge list

- Met: Used approved lock lines or stopped and asked; no face invented inside a clip
  "Identity: man about 32, short dark curly hair..." copied verbatim; "I wrote no new cast or sheets here."
- Met: Shot 1 is already mid-action; no walk-in, sit-down or hello
  Shot 1: "his right hand, already rising as the shot opens, lifts the pack to chest height"
- Met: Every cut changes both camera angle and shot size
  Cut table: "1→2 eye level → high, medium → extreme close-up ... 4→5 overhead → profile, extreme close-up → wide"; 4 sizes, 5 positions.
- Met: One action per shot, described as what moves; product appears only when words reach it
  Tear and tip split into shots 2 and 3; pack enters on "It's one little pack a day"; pouch only in storyboard shot 1.
- Not met: Clip prompts describe the motion, not the whole scene again
  No clip prompts written: "approve this clip plan... before I write the start and end frames, clip prompts". Stopped at approval 3 as the skill requires, so unverifiable.
- Met: Shot times add up to the words at the stated pace, within 10%
  "23 spoken words... brisk at 3.0 words a second, 7.7 s"; shots total 8.0 s (4% over).

## What went in

```text
Lines for this clip: "It's one little pack a day. Tear the top,
tip them out. Twenty-one vitamins and minerals in there. No
water, no shaker."
Approved lock lines (from the storyboard skill):
Identity: man about 32, short dark curly hair, light brown skin,
trimmed stubble, plain grey T-shirt.
Product: glossy deep green stand-up foil pouch, big yellow
wordmark, yellow bear face top right, closed at its resealable
top. Daily pack torn straight across its top edge only.
Set: home kitchen counter in the morning, window light from the
left; front hallway by the door.
Storyboard frame for this clip: him at the counter, pouch beside him.
Speaker pace: brisk. Tool: 8-second clips, timed shots in one
prompt, takes a start and an end frame. Look: live action.
```

## What came out

```text
No video tool is connected to this chat, so I'll write the prompts and you make the clips.

**1. Cast in**
- Approvals 1 and 2 of 3: the lock lines and storyboard frame came marked approved. I wrote no new cast or sheets here.
- **Identity:** man about 32, short dark curly hair, light brown skin, trimmed stubble, plain grey T-shirt.
- **Product:** glossy deep green stand-up foil pouch, big yellow wordmark, yellow bear face top right, closed at its resealable top. Daily pack torn straight across its top edge only.
- **Set:** home kitchen counter in the morning, window light from the left; front hallway by the door.

**2. Clip plan and film plan**

*Clip plan:* one clip, 8.0 s.
- Clip 1 (0.0–8.0): the full script, four sentences.
- The voice ends at about 7.7 s. The last 0.3 s is the tail of the walk in shot 5, not a held picture.

*Film plan:*
- **Kitchen counter (shots 1–4):** morning window light from the left. He picks up one daily pack, tears it, tips the contents into his palm and sets the empty pack down.
- **Front hallway by the door (shot 5):** the cutaway that pictures "no water, no shaker." He eats them on his way out with nothing in his other hand.
- **Shot 1 is the storyboard frame:** him at the counter with the pouch beside him.
- **The pouch:** it appears only in shot 1, as where the pack came from. After that the daily pack is the object.
- **What we see per idea:**
  - "One pack a day": one pack lifted.
  - "Tear / tip": hands.
  - "Twenty-one… in there": the contents in his palm.
  - "No water, no shaker": eating them while walking out.

**3. Shot table: Clip 1**

| # | start-end | size | camera position | move and where it stops | fills the frame | place | objects | one action | words under it |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.0–2.0 | medium | eye level, across the counter facing him | slow push in, stops at chest-up | his face and the pack held at chest height. Foreground: the closed pouch soft at the left edge. Background: the window, with the curtain edge stirring | kitchen counter | daily pack (front to camera, fingers on the bottom edge clear of print), closed pouch | his right hand, already rising as the shot opens, lifts the pack to chest height while he speaks to camera | "It's one little pack a day." |
| 2 | 2.0–3.2 | extreme close-up | high, looking down over his hands | locked off | the top edge of the pack between two pinching hands. Foreground: the counter edge. Background: the soft counter top | kitchen counter | daily pack | both hands tear the top straight across in one firm pull, ending with the strip held in his left fingers | "Tear the top," |
| 3 | 3.2–4.6 | close-up | low, camera on the counter by his left elbow looking up | slight hand-held drift, settles on the palm | the tilted torn pack and his cupped left palm. Foreground: the fruit bowl rim soft. Background: window light | kitchen counter | torn daily pack, contents | his right hand tips the torn pack and the contents drop into his left palm | "tip them out." |
| 4 | 4.6–6.3 | extreme close-up | overhead, straight down | locked off | his open left palm with the contents spread, and the counter beside it. Foreground: none. Background: counter grain. Moving layer: his right hand | kitchen counter | contents in palm, empty torn pack | his right hand lays the empty torn pack flat on the counter beside the open palm | "Twenty-one vitamins and minerals in there." |
| 5 | 6.3–8.0 | wide | profile, from the hallway wall | track alongside him, stops at the front door | the whole hallway, with him mid-stride toward the door. Foreground: a coat on a hook near the lens, swaying as he passes. Background: the front door | front hallway | contents in left palm, right hand empty | his left hand tips the contents from his palm into his mouth as he walks | "No water, no shaker." |

**Voice line**
- 23 spoken words ("twenty-one" counted as two), brisk at 3.0 words a second, 7.7 s.
- We see him say the first sentence on camera in shot 1. His voice runs over shots 2–5.

**Continuity note (end frame)**
- He is in the front hallway at the door, profile, left hand dropping from his mouth, both hands empty.
- The empty torn pack is on the kitchen counter, out of this frame.
- The pouch is not in the hallway.

**Cut checks**

| Cut | Angle | Size |
|---|---|---|
| 1→2 | eye level → high | medium → extreme close-up |
| 2→3 | high → low | extreme close-up → close-up |
| 3→4 | low → overhead | close-up → extreme close-up |
| 4→5 | overhead → profile | extreme close-up → wide, plus a place change |

This uses 4 sizes and 5 positions. Moves are in 3 of 5 shots.

**MISSING**
- `MISSING:` photo of one daily pack (front and back). The lock lines describe only its torn top, so shots 1–4 couldn't be checked against it.
- `MISSING:` what comes out of the pack and a photo of it out of the pack: gummies, tablets or other, plus shape, colour and count. "Tip them out" is written as the contents falling into his palm.
- `MISSING:` the brand's own words for how it's opened and taken. The "tear straight across, tip into palm, eat on the go" steps are my reading of the script.
- `MISSING:` sign-off on the "Twenty-one vitamins and minerals" claim.
- `MISSING:` the brand's "never show" list.
- `MISSING:` the live offer, and whether this is the last clip of the ad. That decides if shot 5 may hold.
- **Pouch photo:** attach it to shot 1 only. Sending the pouch as "the product" in later shots risks the tool tearing the pouch instead of the daily pack.

Approval 3 of 3: approve this clip plan and shot table, or send changes, before I write the start and end frames, clip prompts, edit list and score.
```
