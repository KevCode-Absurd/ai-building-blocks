# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief follows the layout and uses the story's objects: cold coffee, bitten toast, lunchbox lid and cereal bowls. It keeps the product and people out, and flags the one inferred object.

## Judge list

- Met: Nobody is in the frame, and nothing suggests harm or an emergency.
  "nobody in frame"; prompt ends "No text, logos, packaging, clocks or people." Chair pushed back "in a hurry" is mild, not an emergency.
- Met: You can name the trace, the clock and the gap without being told.
  Trace: cold coffee; clock: lunchbox lid; gap: pushed-back chair. Each is labelled with one object.
- Met: It looks lived in, with clutter that has nothing to do with the story.
  "phone charger cable trailing off the counter, a hair tie on the table, a folded school letter"
- Met: Nothing says whose home it is.
  No names, logos or personal items; "Family kitchen" is generic. Text banned in image.
- Met: There's no product and no second, happier photo.
  No Sprout pack in prompt or scene; only a single photo brief.

## What went in

```text
Story ad (approved, built on review 15):
By 8:15 the kitchen is empty. Two cereal bowls in the sink, a
lunchbox lid left on the counter, and at my place, a full mug of
coffee gone cold and a slice of toast with one bite out of it.
That was my breakfast most school days.
Now I grab a Sprout pack on the way out. Tear the top, eat the
small handful of gummies on the way. 21 vitamins and minerals,
6 g prebiotic fiber. Or as one mum put it: "So easy to grab and
eat on my way to the billion things I have to do as a mom."

Buyer: the busy parent, 30 to 45, mostly mums.
Brand look: bright, sunny, real homes. Never clinical.
```

## What came out

```text
I can't draw pictures here, so this hands back the prompt for you to run in an image tool.

```
SCENE              An empty, sunny family kitchen just after the school run. A full mug of coffee and a bitten slice of toast sit at a chair pushed back from the table.
ROOM AND HOUR      Family kitchen, about 8:15 on a school-day morning. Bright low sun slants through the window across the table, with soft shadows.
THE TRACE          A full mug of coffee gone cold, with no steam, at her place at the table
EXTRA TRACE        A slice of toast on a plate with one bite taken out of it
THE CLOCK          A plastic lunchbox lid left on the counter after the school run
THE GAP            The chair at her place pushed back at an angle, as if she got up in a hurry
CAMERA             In the kitchen doorway at adult eye level, the view she'd get walking back in after the school run.
ORDINARY CLUTTER   Two cereal bowls in the sink, a phone charger cable trailing off the counter, a hair tie on the table, a folded school letter
WORDS ON THE IMAGE None.
LINE UNDER IMAGE   Breakfast, most school days (27)
FLAGS              Cold coffee, bitten toast, lunchbox lid and the two cereal bowls come from the approved story ad (built on review 15), not from separate buyer research. The pushed-back chair is [inferred].
IMAGE PROMPT       Square 1:1 phone photo of a real, lived-in family kitchen around 8:15 on a school morning, nobody in frame. Bright low morning sun streams through the window across a wooden table. At one place sits a full mug of coffee, no steam, beside a plate with a slice of toast with one bite taken. That place's chair is pushed back at an angle. A plastic lunchbox lid lies on the counter. Two cereal bowls in the sink, a phone charger cable, a hair tie and a folded school letter nearby. Shot from the doorway at adult eye level, slight tilt, light grain in the shadows, everyday mess, unretouched. No text, logos, packaging, clocks or people.
CHECKS MISSED      none
```

Gaps you can fill in later:
- MISSING: buyer research beyond review 15. A few more parents describing skipped breakfasts would back up the scene.
- MISSING: brand brain. It isn't needed while the product stays out of the picture.

To make the picture, paste the image prompt into ChatGPT (GPT Image) or Gemini (Nano Banana) and ask for the image. You can also use Higgsfield's image tool.
```
