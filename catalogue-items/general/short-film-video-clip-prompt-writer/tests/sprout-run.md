# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful stage 0 and 1: exact lines, a clear floor plan with all cameras on one side, product placed from the first shot, and honest MISSING lines for the product name, label words, claims and offer. Only minor slips (over-the-shoulder sides don't quite match the seating geometry) that the owner can fix at approval.

## Judge list

- Met: It stopped for your OK after the avatar cards, the sheets and the storyboard, unless you asked for every stage in one go.
  "Checkpoint 1: approve the turn line, floor plan and both avatar cards... before I write the casting image prompts." Stopped after stage 1.
- Met: Every camera position sits on one side of the line, or the crossing is planned.
  "The line: It runs west to east through both faces, A to B. All cameras stay on the south side."
- Met: The light recipe is the same, word for word, in every prompt for the scene.
  No prompts written yet (stopped at stage 1); light sources described once in the floor plan, no contradictions.
- Met: Each shot card has one action and at most one camera move, and the prop log has no gaps.
  Storyboard not reached by design; product placed from first shot: "The pouch stands upright on the table at Character A's right elbow".
- Met: Dialogue matches the script exactly, and no character claims a result or plays a customer.
  Locked lines reproduced exactly; "The payoff stays on the routine only... with no result shown or said."

## What went in

```text
Script: the 20-second script from "A short film ad where your
product is the twist". Turn: he asks what day it is; her answer
is a torn daily pack. Lines: B "What day is it?" / A "Pack day." /
B "Same as yesterday?" / A "Same as every day." / Narrator "One
pack a day. Rip. Tip. Enjoy."
Cast note: B carries it. A: about 40, short grey-streaked hair,
navy jumper, reading glasses on her head. B: about 40, rumpled
dark hair, faded green T-shirt, one sock on.
Photos: [pouch front] [daily pack in a hand] [gummies in a palm]
Handling: tear the daily pack straight across the top only.
Tool: 10-second clips, 3 reference images, takes an end frame.
```

## What came out

```text
I can write every prompt for this film, but I can't make pictures or video from this chat because no video tool is connected.

# Stage 0: Script in

**Locked lines (unchanged):**
- `Character B:` "What day is it?"
- `Character A:` "Pack day."
- `Character B:` "Same as yesterday?"
- `Character A:` "Same as every day."
- `Narrator:` "One pack a day. Rip. Tip. Enjoy."

**Turn line:** A rumpled man shuffles into the kitchen and has lost track of the days, but his wife answers with a torn daily pack instead of a date, therefore every day is simply pack day.

**Payoff reaction shot:** On "Same as every day," Character B looks from the pack to her and back. His mouth tightens to stop a laugh, then he gives one slow nod. It lasts one beat with no line, before the narrator comes in.

## Floor plan (seen from above). Setting: inferred, a home kitchen on a weekday morning

```
                 NORTH WALL
      ┌────────[ WINDOW over sink ]────────┐
      │        (morning daylight = key)     │
 WEST │ fridge                              │ EAST
 WALL │ counter + warm under-cabinet light  [DOOR to hallway]
      │                                     │ WALL
      │   (A) ●──── TABLE ────● (B)         │
      │   chair       ▣ ▫       chair       │
      │            pouch  pack              │
      │ ═══════════ THE LINE ═══════════    │
      │                                     │
      │  [C]          [A]           [B]     │
      │              [D] (high)             │
      └─────────── SOUTH (open side) ───────┘
```

- **Walls and openings:** The north wall has a window over the sink. The east wall has a door to the hallway, which is where Character B came in. The west wall has the fridge and a counter. The south side is open and is where every camera stands.
- **Light sources:**
  - Morning daylight through the north window. It is soft and falls from the side across both faces.
  - A warm under-cabinet strip on the west counter. It is a practical, low and dim, and only lifts the background.
  - No overhead light is on.
- **People:**
  - Character A sits on the west chair facing east, with a mug at her left hand.
  - Character B sits on the east chair facing west. He has slumped down just after coming in, and his bare right foot and socked left foot are visible under the table.
- **Product from the first shot:**
  - The pouch stands upright on the table at Character A's right elbow, with its front turned south toward camera.
  - One unopened daily pack lies flat in front of her, on the camera side of the mug.
  - Character A handles the product with her **right hand** in every shot.
- **The line:** It runs west to east through both faces, A to B. All cameras stay on the south side.

**Camera setups (all south of the line):**

| Setup | Job | Position | Height | Lens |
|---|---|---|---|---|
| **A** | Wide: whole room, both people, window behind, door at right | Centred, south | 1.2 m (seated eye level) | 35mm |
| **B** | Character B, over Character A's left shoulder | South-west of Character A, looking east | 1.2 m | 50mm |
| **C** | Character A, over Character B's right shoulder | South-east of Character B, looking west | 1.2 m | 50mm |
| **D** | Inserts: Character A's right hand tearing the pack straight across the top only, gummies tipped into a palm, pouch front | South, high, angled down at 45° | 0.9 m above table | 85mm |

The letters are for camera positions only. "Setup B" frames Character B and "Setup C" frames Character A. Character names are always written in full.

# Stage 1: Avatar cards

**Character A: avatar card**
- **Role in the scene:** The calm one who holds the product and gives the answer. She is dry and unbothered.
- **Age range:** 38–44, a made-up adult.
- **Build:** Medium height and slim-average build. She sits upright with her elbows on the table.
- **Face:** Oval face, straight brows and a steady gaze. Faint laugh lines at the eyes and a closed-mouth half-smile at rest.
- **Hair:** Short, about chin-length at most, dark brown streaked with grey and tucked behind her ears.
- **Skin detail:** Natural skin texture, light freckling across the nose and no heavy makeup.
- **Clothes:** A navy crew-neck knit jumper with the sleeves pushed slightly up, over plain dark trousers.
- **One accessory:** Thin black-framed reading glasses pushed up on her head. They are never worn on her eyes.
- **Voice:** Neutral accent (inferred), mid-low pitch, unhurried pace. Flat, deadpan delivery with no rise at the end of lines.
- **Never changes:**
  - Grey streaks in short hair.
  - Navy jumper.
  - Glasses on her head.
  - She uses her right hand for the product.
  - She sits on the west chair.

**Character B: avatar card (he carries the scene)**
- **Role in the scene:** The just-woken one who asks the questions and gives the reaction. He is foggy, then amused.
- **Age range:** 38–44, a made-up adult.
- **Build:** Medium-tall and lean-average build. He slumps in the chair with his shoulders rounded.
- **Face:** Longer face, light stubble, heavy-lidded sleepy eyes and expressive brows that do most of the acting.
- **Hair:** Dark, slightly overgrown and rumpled from sleep, flattened on one side.
- **Skin detail:** Natural texture, a faint pillow crease on one cheek and slight morning puffiness under the eyes.
- **Clothes:** A faded green crew-neck T-shirt, soft and worn at the collar, with grey jogging bottoms.
- **One accessory:** A single grey sock on his left foot only. His right foot is bare.
- **Voice:** Neutral accent (inferred), mid pitch, slightly slow and gravelly with morning in it. His questions lift at the end.
- **Never changes:**
  - Rumpled dark hair.
  - Faded green T-shirt.
  - One grey sock on the left foot only.
  - He sits on the east chair.

Both people are made-up adults. Neither one plays a real person, founder, customer or expert. Both voices will be designed from these cards and reused, never cloned.

**MISSING:**
- `MISSING: product name and every label word as printed`. The photos came through as placeholders I can't see, so the product sheet can't yet be checked against the real pack. Please attach the pouch front, the daily pack in a hand and the gummies in a palm as image files.
- `MISSING: what the gummies are for and any approved claims`. The payoff stays on the routine only ("one pack a day"), with no result shown or said.
- `MISSING: current offer for the end card`.
- `MISSING: brand file`. The setting is marked "inferred", the accents are inferred, and there is no "never show" list.

**Checkpoint 1: approve the turn line, floor plan and both avatar cards, or tell me what to change, before I write the casting image prompts.**
```
