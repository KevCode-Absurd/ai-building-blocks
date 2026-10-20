# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A tight, usable brief that shows exactly the four things the story names, with only the wear the story states and every inference flagged. The owner gets a paste-ready prompt, honest MISSING notes, and a sensible reminder to confirm the narrator's consent before it runs.

## Judge list

- Met: Every object is a generic kind with no readable label.
  "plain opaque jar" ... "All labels turned to the wall" ... prompt ends "No people, no text, no logos, no readable labels."
- Met: It shows only the things your story names, with the use the story describes.
  Four objects: greens tub "a third full, plastic scoop stuck upright in dried, caked powder", three gummy jars, multivitamin "lid resting loose". Lid-off inferred and flagged.
- Met: The camera is where your buyer would find these things.
  "phone held at chest height, angled slightly down, as if the door has just been pulled open" beside the kettle, matching the story.
- Met: It looks like a real cupboard, familiar and not disgusting.
  "A box of tea bags turned side-on, an unlabelled honey jar, a tin of beans at the back, a spare mug." Nothing gross.
- Met: There's no person and no product.
  "No people" in prompt; "Sprout is left out because it wasn't asked for."

## What went in

```text
Story ad (approved; narrator: a customer who agreed, built on
review 5, example only):
The cupboard by the kettle: every supplement I've given up on.
A greens powder tub, a third full, the scoop stuck in dried
powder. Probiotic gummies. B12 gummies. Multivitamin gummies,
lid left loose.
I stopped buying the separate ones. Now it's one Sprout daily
pack: 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic
fiber, in a small handful of gummies. Tear the top, eat them.
```

## What came out

```text
I can't make the picture here (no image tool is connected), so you'll get the ready-to-paste prompt.

```
SCENE             A kitchen cupboard by the kettle, opened to show a crusted greens powder tub and three gummy supplement jars that were never finished.
WHERE AND WHEN    Home kitchen wall cupboard beside an electric kettle; mid-morning [inferred]; ordinary window daylight with soft shadows [inferred]; phone held at chest height, angled slightly down, as if the door has just been pulled open.
HOW GIVEN UP      left half full, because the story's own details are a tub a third full with the scoop stuck in dried powder and a lid left loose: bought, tried, dropped, not used up or worn out.
THE OBJECTS       1) Greens powder tub, front left on the shelf, lid off [inferred, so the fill shows], a third full, plastic scoop stuck upright in dried, caked powder. 2) Probiotic gummies jar, plain opaque jar, closed, in a row to the right. 3) B12 gummies jar, plain opaque jar, closed, next in the row. 4) Multivitamin gummies jar, plain opaque jar, at the end of the row, lid resting loose and askew. All labels turned to the wall.
AROUND IT         A box of tea bags turned side-on, an unlabelled honey jar, a tin of beans at the back, a spare mug. The kettle edge is just visible below the cupboard.
WORDS ON IMAGE    none
LINE UNDER IMAGE  The cupboard by the kettle (buyer's own line, 26 characters)
FLAGS             Inferred: the greens tub lid being off, the time of day, the light, the jar colours and shapes, and all the surrounding items. MISSING: fill levels for the three gummy jars, so they are shown as opaque and closed with no fill visible. Rival risk: gummy jars and greens tubs have recognisable category shapes, so keep them plain, unbranded, labels turned away, with no distinctive lid colours. The story is built on review 5 and marked "example only", so confirm the narrator's consent before it runs. Sprout is left out because it wasn't asked for.
IMAGE PROMPT      Square 1:1 casual phone photo, slightly high angle, looking into a kitchen wall cupboard just opened beside an electric kettle, mid-morning window daylight, soft shadows, unretouched. On one shelf: a plain greens powder tub with its lid off, a third full, a plastic scoop stuck upright in dried, caked green powder. Beside it, three plain opaque supplement gummy jars in a row, labels turned to the wall; two closed, the last with its lid resting loose and askew. Around them: a box of tea bags turned side-on, an unlabelled honey jar, a tin of beans at the back, a spare mug. Ordinary clutter. No people, no text, no logos, no readable labels.
CHECKS MISSED     none
```

**To finish it:** paste the image prompt into ChatGPT (GPT Image) or Gemini (Nano Banana) and ask for the picture. You could also paste it into Higgsfield's image tool. In Claude Code, with `OPENAI_API_KEY` or `GEMINI_API_KEY` set, the prompt can be sent to that image API, which bills per picture. The most believable version is a real cupboard photographed on your phone with the labels turned away.

**Gaps to fill later:**
- MISSING: how full the gummy jars were.
- MISSING: how long each item lasted and why it was dropped, in the buyer's words.
- MISSING: the brand brain, for photo style.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker), using this image prompt? Or tell me what you'd rather do next.
```
