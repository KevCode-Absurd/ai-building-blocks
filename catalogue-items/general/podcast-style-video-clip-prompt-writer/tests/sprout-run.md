# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 1 of 6 met. Invented facts: 1.

The cast cards and voice lines are strong and the approval stop is correct, but the owner gets only a bounced script and two avatars, with no sheets, storyboard, clips or finishing notes. The script check is arguably too strict (the three-part label line is one approved claim, and the 'stick to' quote is a real review on file), and the MISSING lines ask for brand facts that were already available.

## Fix

In Stage 0, add: 'A single approved label line (e.g. 60+ ingredients, 21 vitamins & minerals, 6 g fiber) counts as one fact, and a review quote attributed to reviews is not a result claim.' In 'If something is missing', add: 'Read the business brand and review files before writing MISSING: brand file.'

## Judge list

- Met: The run stopped for your yes after the cast cards, the sheets and the storyboard.
  "Approval 1 of 3: waiting for approval of both cast cards and both voice lines before stage 2." Sheets and storyboard not yet reached.
- Not met: Each line comes from the right mouth, and the listener's mouth stays closed.
  No storyboard or clip prompts produced; run ended at approval 1, so no beats or 'mouth closed' instructions exist.
- Not met: The two people look clearly different and keep their sides in every clip.
  Cast cards differ on all seven points (38 stocky bearded vs 29 slim glasses), but no clips exist to show sides held.
- Not met: The two voices stay apart and the same throughout.
  "low baritone, slow" vs "bright mid-range alto, quick" defined, but no clip prompts carry them through.
- Not met: The product is on the table in every frame, label unchanged, nothing in front of it.
  No product sheet, product line, opening frame or clips produced.
- Not met: The disclosure line and the offer text are in the finishing notes, and nobody says the offer.
  Script check notes "The offer is not spoken", but no finishing notes, disclosure line or offer text produced.

## Invented

- claim: MISSING: brand file (buyer's room and light, how "Sprout" is said, never-show list) (Sprout's brand.md was on file with US home market, room/photo style and the never-show list; treating it as absent is unsupported.)

## What went in

```text
Script (from the podcast clip script skill, 30 s, myth-bust):
Belief: they think a gummy can't hold enough; by the end they
think one pack holds more than they guessed.
Product entry: on the table from frame 1.
Muted opener: "Can a gummy hold enough?"
Disclosure: "Dramatization", plus the AI label.
Cast note: two made-up adults who look like the buyer, neither an
expert.
Clip 1: Host: "A gummy can't hold enough to replace my powder."
  Guest: "It's a whole pack. About twenty grams, a small handful."
  Host: "So, a handful of candy."
Clip 2: Guest: "Sixty-plus ingredients. Twenty-one vitamins and
  minerals. Six grams of fiber." Host: "Twenty-one. At full
  amounts?" Guest: "Vitamins, about a hundred percent of daily
  value. Minerals, about a quarter."
Clip 3: Guest: "The reviews keep saying 'the one thing I've been
  able to stick to.'" Host: "Okay. Send me that."
Product: Sprout pouch, front photo attached; as tall as a mug and
a half. Displayed, not handled.
Tool: 10-second clips with speech, 3 reference images.
```

## What came out

```text
# File 1: Script check

**Result: does not pass. Send these lines back to the podcast clip script skill. No lines have been changed here.**

| Clip | Speaker | Line | Rule broken | What the rewrite needs |
|---|---|---|---|---|
| 2 | Guest | "Sixty-plus ingredients. Twenty-one vitamins and minerals. Six grams of fiber." | One fact per turn. This turn has three. | Keep one fact, for example the 21 vitamins and minerals, because the Host's next line picks up "Twenty-one." Move the other facts out, or into their own turns in another clip. |
| 2 | Guest | "Vitamins, about a hundred percent of daily value. Minerals, about a quarter." | One fact per turn. This turn has two amounts. It also pushes the clip past 10 s: clip 2 runs about 11 s of speech before any pauses, so the last word gets cut off. | One amount per turn. Clip 2 must fit inside 10 s and end on a turn. |
| 3 | Guest | "The reviews keep saying 'the one thing I've been able to stick to.'" | No speaker claims a result. Sticking to a routine is a result, here spoken through reviews, and "keep saying" claims many of them. | Either replace it with a product fact that serves the belief (one pack holds more than they guessed), or supply the exact review wording, its source and how often it appears, so it can be shown as a quoted review rather than spoken as a claim. |

**Lines that pass:**
- Clip 1, all three turns. Each turn has one speaker and one fact. "My powder" is the Host's doubt about another product, not a claim of using Sprout.
- Clip 2, Host: "Twenty-one. At full amounts?"
- Clip 3, Host: "Okay. Send me that."
- The offer is not spoken.
- Clips 1 and 3 end where a turn ends.

**Timing at 10-second clips:**
- Clip 1: about 8 s. A silent reaction fills the remaining time.
- Clip 2: about 11 s or more. Too long, as noted above.
- Clip 3: about 6 s, and this will change with the rewrite.

The storyboard and clip prompts (stages 4 and 5) wait for the revised lines. The cast, reference images and sheets do not depend on them.

---

# File 2: Avatar cards

**Cast cards** (paste word for word into every later prompt)

- `HOST (left): looks about 38, broad-shouldered stocky build, deep brown skin with warm undertones, close-cropped black hair, short neat black beard and no glasses, plain mustard-yellow crewneck sweatshirt with no print, a small healed scar through the left eyebrow`
- `GUEST (right): looks about 29, slim narrow-shouldered build, fair skin with light freckles across the nose, shoulder-length wavy auburn hair tucked behind one ear, thin round tortoiseshell glasses and no beard, plain forest-green cotton button-up shirt with sleeves rolled to the forearm and no print, a small dark mole on the right cheekbone`

The two cards differ on all seven points: age, build, skin, hair, glasses or beard, top, and mark. Both are ordinary peers in plain clothes. There are no words, logos, coats, lanyards or titled books.

**Voice lines** (unchanged in every clip)

- `HOST VOICE: about 38, low baritone, slow and deliberate pace, dry, warmly skeptical, General American accent`
- `GUEST VOICE: about 29, bright mid-range alto, quick even pace, matter-of-fact, lightly amused, General American accent`

The two voices differ in pitch (low against mid) and in pace (slow against quick). Neither is modelled on a real person, show or creator.

**MISSING lines**

- `MISSING: accent. The brand file is missing. Using General American as the brand's home accent, inferred from "fiber" and "daily value". Replace this if the brand file says otherwise.`
- `MISSING: brand file (buyer's room and light, how "Sprout" is said, never-show list). Needed for the set sheet in stage 3.`
- `MISSING: buyer review doubts (store add-on). Needed if the clip 3 rewrite draws on reviews.`

**Approval 1 of 3:** waiting for approval of both cast cards and both voice lines before stage 2.
```
