# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 1.

A disciplined first turn: it refused to reconstruct the unpasted script, marked script, light keys, photos and daily-pack label as MISSING, kept the cast note intact, flagged its own additions as proposals, and stopped correctly after the avatar card. The one slip is adding a guessed colour to a pouch label line and attributing it to the user's text, which would otherwise be typed into every product shot.

## Fix

In Stage 3 (Product sheet) and 'If something is missing', add: 'Type a label line's colour only when it was given; if not, write MISSING: colour for <line>, never a guess with a confirm request.'

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "Stopping here. Please approve or change the avatar card" — stopped after stage 1 as required; later stops not yet reached.
- Met: Every frame in the same story part has the same light key, word for word.
  No frames written yet; light keys listed as "MISSING" per part rather than invented.
- Met: The look line and casting card never change between prompts.
  One look line and one "Prompt prefix" defined; no later prompts to diverge.
- Met: No shot has more than two people, and every product shot spells out each label line or says MISSING.
  "the daily pack faces away from camera in every shot and is marked MISSING"; no shots written yet.
- Met: No studio, film or character names anywhere.
  Look line is "Stylised 3D animated feature look..." with no studio, film or character named.

## Invented

- other: "28 Daily Packs" in yellow at the bottom (Neither the run input nor brand.md gives the colour of this line; it is labelled "from your text" though a confirm request follows.)

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
I write the prompts only; no video tool is connected here, so no images or clips will be generated in this chat.

## Stage 0: Script in

**MISSING: script text.** Lines 1–7 weren't pasted, along with their timings and any claims. I won't reconstruct them from the title. Please paste the locked script word for word.

**MISSING: light keys.** These are said to be "as given in the script," but they weren't included. Please paste one key per part, giving direction, colour and shadow hardness.

| Part | Place | Lines | Light key |
|---|---|---|---|
| And | Hallway | 1, 2 | MISSING |
| But | Kitchen | 3, 4 | MISSING |
| Therefore | Front door | 5, 6, 7 | MISSING |

**Look line (draft, locked at Stage 3):**
"Stylised 3D animated feature look, real-looking light on designed, softly exaggerated shapes, true materials (knitted wool, canvas, painted wood, glossy foil), shallow lens with soft background falloff."

**Product notes:**
- The photos appear as placeholders ([pouch front], [daily pack in a hand], [gummies in a palm]). I can't see the images themselves, so the product sheet can't yet be checked against the real pack. Please attach them directly.
- **Pouch label (from your text):** big yellow wordmark "Sprout" on glossy deep green, yellow bear face top right, "28 Daily Packs" in yellow at the bottom. Please confirm the colour of the bottom line.
- **MISSING: daily pack label words.** I won't invent them. Until you send them, the daily pack faces away from camera in every shot and is marked MISSING.
- **Tool:** 8-second clips with 2 reference images. Each shot will attach the character sheet and the product sheet. The set comes in through the start frame.

## Stage 1: Avatar card (approval 1)

**MUM: lead, silent**
- **Role:** the buyer, a busy parent. She carries the whole ad without speaking.
- **Rough age:** late thirties.
- **Build:** slim, average height, relaxed upright posture.
- **Face shape:** soft oval face, gently rounded cheeks, warm brown eyes, straight brows, light freckles across the nose. *(My proposal. Change it if you like.)*
- **Hair:** dark curly hair tied up in a loose high bun, a few curls free at the temples.
- **Clothes:** rust-coloured chunky knit jumper, dark straight jeans, white canvas trainers. *(The jeans and trainers are my proposal.)*
- **One item:** natural canvas tote bag, always on her **left** shoulder.
- **Voice:** none. She is silent.
- **Product hand:** **right** hand, because the tote takes her left.
- **Never changes:** the curly up-do with loose temple curls, the rust jumper, the tote on the left shoulder, the right hand holding the product, and the soft oval face with freckles.
- **Prompt prefix:** "stylised animated woman, late thirties, slim, soft oval face, light freckles, dark curly hair tied up in a loose high bun with free curls at the temples, rust chunky knit jumper, dark jeans, natural canvas tote on her left shoulder"

**NARRATOR: voice only, never on screen**
- **Voice:** warm adult voice, mid pitch, unhurried even pace, neutral accent. *(This is a proposal. Tell me the gender and accent you want.)*
- It is designed from this card, never cloned, and laid on in the edit with no lip-sync.

**Question:** does a child or any second person appear in the script? Every cast member must be an invented adult. If a child is in the script, tell me how they're shown, and we'll agree an approach before the storyboard.

**Stopping here.** Please approve or change the avatar card, and paste the script lines, light keys, photos and daily pack label text. I'll then write the Stage 2 reference image prompts.
```
