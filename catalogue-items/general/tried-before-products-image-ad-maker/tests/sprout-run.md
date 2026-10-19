# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 5 met. Invented facts: 0.

The photo brief is usable and mostly faithful to the story, with sensible rival-lookalike warnings and inferred details flagged. However, it departs from the required output shape and adds some details the story did not give.

## Fix

Add a rule to the hand-back step: use the exact output shape headings and the LINE UNDER IMAGE format "(which line, characters)", with no bold numbering or extra sections. Also add a rule to show only the use the story states and use plain closed jars for unstated items instead of inventing fill levels.

## Judge list

- Met: Every object is a generic kind with no readable label.
  Jars "turned label-away"; "plain matte tub"; "No readable text, no logos"; flags warn against branded shapes.
- Not met: It shows only the things your story names, with the use the story describes.
  Story names probiotic, B12 and multivitamin gummies; output adds partial fills and "a few gummies visible" (inferred). Fills are flagged as inferred.
- Met: The camera is where your buyer would find these things.
  "Phone held at chest height looking slightly up into the shelf, as if the door has just swung open."
- Met: It looks like a real cupboard, familiar and not disgusting.
  Tea bags, mugs, spare light bulb; dried powder crust is ordinary, not gross.
- Met: There's no person and no product.
  "No people"; "the Sprout pack is left out, since the brief didn't ask for it."

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
**1. Scene**
Someone's kitchen cupboard by the kettle, door just opened, with a greens powder tub and three jars of gummies pushed together on the shelf.

**2. Where and when**
Upper kitchen cupboard beside the kettle, weekday morning. Flat daylight from a nearby window mixes with warm under-cabinet light. Phone held at chest height looking slightly up into the shelf, as if the door has just swung open. The edge of the open door is visible at one side and the kettle top is just in frame below.

**3. How it was given up**
Left half full. The story gives amounts and states of use ("a third full", "scoop stuck in dried powder", "lid left loose"). Each one was bought, tried and dropped, not used until it failed. They aren't hidden either: they sit in a cupboard used daily, which is the point.

**4. The objects** (four, exactly as the story names)
- **Greens powder tub:** front and centre with the lid off and set beside it. About a third full of green powder. A plastic scoop is stuck upright in dried, caked powder, with a crust of powder on the rim.
- **Probiotic gummies jar:** behind it to the left, turned label-away. Plain round jar, partly full (fill level inferred).
- **B12 gummies jar:** next to it, smaller, also turned away and slightly out of focus. Partly full (inferred).
- **Multivitamin gummies jar:** at the front right with its lid sitting loose and askew, not screwed on. A few gummies are visible near the top (inferred).

**5. Ordinary things around it**
A box of tea bags, a jar of instant coffee turned away, a couple of mismatched mugs, a tin of something on the shelf above, a spare light bulb in its sleeve and a teaspoon resting on the shelf edge.

**6. Words on the image**
None.

**7. Line under the image**
The cupboard by the kettle

**8. Flags**
- **Inferred:** the fill levels of the three gummy jars, the light, the time of day and all the ordinary items. The story only gives the greens tub at a third full, the scoop in dried powder and the multivitamin lid left loose.
- **Rival look-alike risk:**
  - Gummy jars shaped like bears, or with bright branded lids, could read as specific brands. Keep them plain round jars with neutral white or amber bodies.
  - Bear-shaped gummies could point to known brands. Use generic round or square gummies.
  - Greens tubs in a distinctive dark green or black with a gold lid resemble known brands. Use a plain matte tub.
- **Labels:** all packs must be turned away, cropped or out of focus. No made-up labels either.
- **Product:** the Sprout pack is left out, since the brief didn't ask for it.
- **Honest photo option:** since the narrator is a customer who agreed, a photo of their real cupboard with labels turned away would be the strongest choice.
- **Format:** square 1:1. Use 4:5 only if this runs solely in the Feed.

**9. Image prompt**
Candid phone photo, square format, looking slightly up into an open kitchen cupboard beside a kettle, the edge of the cupboard door in frame. On the shelf: a plain matte tub of green powder, lid off beside it, about a third full, a plastic scoop stuck upright in dried, caked powder. Behind it three plain round supplement jars of gummies, all turned label-away or blurred. The front jar's lid sits loose and crooked. Around them are a box of tea bags, mismatched mugs, a spare light bulb and a teaspoon. Flat morning daylight with slight phone noise and an ordinary lived-in clutter. No readable text, no logos, no people.
```
