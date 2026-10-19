# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A disciplined first pass: the script is kept word for word, the floor plan and camera setups are geometrically sound and all on one side of the line, and the casting cards follow the cast note without inventing brand facts. It stopped where the skill says to and listed every missing input (real photos, label words, offer, never-show list) instead of guessing, so the owner knows exactly what to send next.

## Judge list

- Met: It stopped for your OK after the avatar cards, the sheets and the storyboard.
  "**Stop.** Please approve or change the avatar cards... I won't write the casting image prompts until you approve." Later stops not yet reached.
- Met: Every camera position sits on one side of the line, or the crossing is planned.
  "The line runs east to west across the table... Every setup sits on the south side of it." Shoulder geometry checks out.
- Met: The light recipe is the same, word for word, in every prompt for the scene.
  Not reachable: run correctly halted at approval 1 before Stage 3; no prompts yet exist to diverge. Key light set once.
- Met: Each shot card has one action and at most one camera move, and the prop log has no gaps.
  Not reachable: storyboard (Stage 4) not started because the skill forbids it before approval 1. Nothing violated.
- Met: Dialogue matches the script exactly, and no character claims a result or plays a customer.
  "Character B: "What day is it?" Character A: "Pack day."" — all five lines verbatim; "He never holds the product." no result claims.

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
I can't make pictures or video in this chat (no video tool is connected), so I'll write every prompt for you to run.

## Stage 0: Script in

**Script (locked, unchanged)**
- Character B: "What day is it?"
- Character A: "Pack day."
- Character B: "Same as yesterday?"
- Character A: "Same as every day."
- Narrator: "One pack a day. Rip. Tip. Enjoy."

**Turn line**
A sleepy weekday kitchen and B has completely lost track of the days, but A answers not with a weekday but by holding up a daily pack she has just torn open, therefore the one-pack-a-day habit is the only calendar either of them needs.

**Payoff reaction shot:** after "Same as every day," hold on B for about 1.5 seconds. He looks at the torn pack, looks down at his one socked foot, and then gives one slow nod of defeat. A's mouth tightens as she stops herself laughing.

**Running time:** 20 seconds, split into two 10-second clips. The cut falls after "Same as yesterday?"

**Floor plan (from above), setting inferred: a small home kitchen, early morning**
- **North wall:** a counter with a kettle, and a window above the sink. Low, soft morning sun comes through this window. It is the **key light**, falling from the north-east.
- **East wall:** a hallway door, standing open. B enters here, then stops.
- **South side:** open room, where the camera sits. A ceiling pendant over the table is **off**. A practical under-cabinet strip on the north counter is **on**, giving a warm, low fill.
- **Centre:** a small square wooden table, running east to west.
  - **A** sits on the west side of the table, facing east toward B. The window is at her left shoulder.
  - **B** stands at the east end, by the hall door, facing west toward A. He has one hand on the back of the chair in front of him.
  - **Product, set from the first frame:** the pouch stands upright beside A's mug, on her right. One sealed daily pack lies flat in front of her.
- **The line** runs east to west across the table, from A to B. Every setup sits on the **south** side of it.

**Camera setups (all on the south side)**
- **A: Wide.** The whole kitchen, both people, the pouch on the table and the window. The camera sits 1.2 m high at the south wall, on a 28mm lens, square to the table.
- **B: B's single.** Over A's right shoulder, with A soft in the foreground. The camera sits at 1.5 m, B's standing eye height, on a 50mm lens.
- **C: A's single.** Over B's left shoulder, with B soft in the foreground. The camera sits at 1.15 m, A's seated eye height, on a 50mm lens.
- **D: Inserts.** A's hands, the daily pack and the pouch. The camera sits 25 cm above the tabletop, angled 35° down from the south side, on a 90mm lens.

No other setups are needed.

## Stage 1: Avatar cards

**Character A (the deadpan answer)**
- **Role:** knows the routine and answers with the pack, not a weekday. She is calm and dry, and holds back a smile.
- **Age range:** about 40 (38 to 42).
- **Build:** medium height and slim.
- **Face:** oval face with straight, level brows and fine smile lines at the eyes. She wears no makeup look.
- **Hair:** short, cropped hair, dark brown with visible grey streaks at the temples. It is neat but not styled.
- **Skin detail:** fair-to-light olive skin with faint freckles across the nose and natural texture. It is not retouched.
- **Clothes:** a navy crew-neck knit jumper, slightly loose, with sleeves pushed to mid-forearm.
- **Accessory:** tortoiseshell reading glasses pushed up on top of her head.
- **Voice:** neutral British English, mid-low pitch, slow and flat pace. Each line is clipped short.
- **Never changes:** the grey streaks, the navy jumper, and the glasses on her head (never on her face). She tears the pack with her right hand only. She stays seated the whole time.

**Character B (carries the scene)**
- **Role:** half-awake and lost in time. He asks the questions and gets the reaction beat.
- **Age range:** about 40 (38 to 42).
- **Build:** tall and slightly broad. His shoulders are relaxed and a little slumped.
- **Face:** square jaw with a day of dark stubble and heavy-lidded, sleepy eyes. Faint pillow crease on his left cheek.
- **Hair:** rumpled dark brown hair, flattened on the right side, sticking up at the crown.
- **Skin detail:** light-medium skin with slight redness at the nose and natural texture. It is not retouched.
- **Clothes:** a faded, washed-out green crew-neck T-shirt with a slightly stretched collar, and grey jogging bottoms.
- **Accessory:** one grey sock on his left foot only. His right foot is bare.
- **Voice:** neutral British English, mid-pitch, slightly gravelly morning voice, slow and puzzled pace. His questions rise at the end.
- **Never changes:** one sock on the left foot only, the rumpled hair flattened on the right, and the green T-shirt. He stays standing at the east end. He never holds the product.

Both are made-up adults, not based on any real person, founder, customer or expert.

**Missing items**
- `MISSING: real product photos.` The [pouch front], [daily pack in a hand] and [gummies in a palm] came through as placeholders, not images. Please attach the actual photos. Until then, the product sheet can't be checked against the real pack.
- `MISSING: product name and every label word as printed` (pouch and daily pack).
- `MISSING: brand file.` The kitchen setting and morning light are marked "inferred."
- `MISSING: approved and banned claims.` The narrator line claims no result, so the payoff shows only the routine (tear straight across the top, tip into the palm), with no visible effect.
- `MISSING: current offer and price` for the end card.
- `MISSING: "never show" list.`

**Stop.** Please approve or change the avatar cards (and send the real photos and label words). I won't write the casting image prompts until you approve.
```
