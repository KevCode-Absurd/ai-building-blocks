# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The avatar card is solid, consistent with the cast note, and it rightly asked for the script, light keys and pack label words instead of guessing. But it skipped Stage 0 entirely: no LIGHT PLAN block and no look line, which is one of the three consistency anchors the whole process depends on, and the STAGE headings are missing.

## Fix

In Stage 0 add: "Always output the STAGE 0 LIGHT PLAN and LOOK line before the avatar card, even when the script or light keys are missing; write MISSING per part for the light keys and still write the look line."

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "I won't start the reference image prompts until you approve." Stopped at approval 1; later stages correctly not begun.
- Met: Every frame in the same story part has the same light key, word for word.
  No frames produced yet (stopped at stage 1); light keys flagged "MISSING: light keys". Nothing to violate.
- Met: The look line and casting card never change between prompts.
  Single casting line "used word for word in every later prompt"; no later prompts exist. Look line was never written, though.
- Met: No shot has more than two people, and every product shot spells out each label line or says MISSING.
  No shots yet; "the daily pack is shown with its label side turned away and marked MISSING".
- Met: No studio, film or character names anywhere.
  "not based on any real person, customer, expert or known character"; none named.

## What went in

```text
Script: the 28-second narrated script from "An ad that looks like
an animated movie". Parts: And (hallway, lines 1 and 2), But
(kitchen, lines 3 and 4), Therefore (front door, lines 5 to 7).
Light keys as given in the script.
Cast note: the mum carries it, silent, with a narrator. Casting:
a stylised animated woman, late thirties, slim, dark curly hair
tied up, rust jumper, canvas tote on her left shoulder.
Photos: [pouch front] [daily pack in a hand] [gummies in a palm]
Pouch label: big yellow wordmark "Sprout" on glossy deep green,
yellow bear face top right, "28 Daily Packs" at the bottom.
Daily pack label words: not captured.
Tool: 8-second clips, 2 reference images.
```

## What came out

```text
**Avatar card: approval 1**

| Field | Lock |
|---|---|
| **Role** | The mum, the lead who carries the ad. She is silent and on screen in every part (And, But, Therefore). |
| **Casting line** (used word for word in every later prompt) | a stylised animated woman, late thirties, slim, soft oval face, dark curly hair tied up in a loose high bun, rust jumper, straight dark-indigo jeans, white trainers, canvas tote on her left shoulder |
| **Rough age** | Late thirties |
| **Build** | Slim, average height, relaxed posture |
| **Face shape** | Soft oval, warm brown eyes, natural brows |
| **Hair** | Dark curly hair tied up in a loose high bun, with a few curls loose at the temples |
| **Clothes** | Rust jumper (crew neck, cuffs slightly pushed up), straight dark-indigo jeans, white trainers |
| **Carried item** | Canvas tote, always on her **left** shoulder |
| **Hands** | The tote stays on the left, so the product is held in her **right** hand in every shot. |
| **Voice** | None. She is silent. The narrator is off screen and is added in the edit, with no lip-sync. |
| **Never changes** | Curly hair in the high bun, rust jumper, tote on the left shoulder, product in the right hand, soft oval face, and the same jeans and trainers |
| **Rules** | She is an invented adult and not based on any real person, customer, expert or known character. There is no second person. If one is added later, they get their own card, and no shot holds more than two people. |

**MISSING**
- `MISSING: script text`. I need lines 1 to 7 word for word, the length of each line, and any claims. These let me split the parts and run the final check.
- `MISSING: light keys`. You said they are "as given in the script," but they weren't included. I need the source, colour and shadow hardness for the hallway (And), the kitchen (But) and the front door (Therefore).
- `MISSING: daily pack label words`. Please send every line of text with its colours. Until then, the daily pack is shown with its label side turned away and marked MISSING. I won't invent any text for it.
- `MISSING: how it's used`. I need the steps in order, such as tearing open the daily pack and how many gummies are taken. I'll show one step per shot.
- `MISSING: "never show" list and approved claims`.
- `MISSING: pouch side and top photos`. The front photo is enough for the pouch sheet, but the side and top views would be marked MISSING without them.

**Approval needed:** please approve or edit this avatar card and send the missing items. I won't start the reference image prompts until you approve.
```
