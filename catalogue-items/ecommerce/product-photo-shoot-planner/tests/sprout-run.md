# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

A well-built style sheet and a clean nine-frame grid that correctly stops for the owner's go-ahead, with the arrival frame honestly dropped as MISSING. The one real miss is the glass of water (and a dish of spirulina powder) as recurring props, which cut against Sprout's whole pitch of no water, no powder, no shaker.

## Fix

In step 3 Props, add: "Check each prop against the brand's 'never shows' list and the enemy it names; never use a thing the brand positions against (e.g. a glass of water or any powder for a 'no water, no powders' product)."

## Judge list

- Met: The product looks identical in every frame (label, shape, colours, finish).
  "All printing is copied exactly from Image 1"; every frame names the same deep green pouch; colour plan "never the pouch or gummies".
- Met: The light, lens and finish lines are word for word the same in every prompt.
  No prompts yet; run correctly stops at step 5 gate. Style sheet headed "identical in every prompt" with one light, lens and finish line.
- Met: No two frames share job, distance and angle.
  Use frames: 03 close/eye, 05 mid/high, 09 wide/low; all nine job-distance-angle triples differ; all three distances, four angles used.
- Not met: Props are real things the product contains or is used with, with no other brand's mark.
  "a clear glass of water" in frames 02 and 06; brand says "No water, no mixing, no shaker". Spirulina powder dish also echoes the chalky-powder enemy.
- Met: There are no words in any photo except those printed on the product.
  Frame 08 keeps "open cream space above for words added later"; no frame adds text, logos or marks.

## What went in

```text
Product: Sprout Original (Adults), Low Sugar. Attached: the pouch
front on, and gummies in an open hand. Glossy deep green stand-up
foil pouch, big yellow wordmark, yellow bear face top right. The
84-pack size is 3 pouches.

Brand colours: forest green #00582D; deep forest green #002C17;
cream #FFF7DF (hero background); kelly green #007E40 (buttons);
sunflower yellow #FFCC2E (stars, badges); plum #581E5A (banner).
Photo style: bright, sunny, candy-like. Everyday adults at home or
outdoors. Never clinical, never muted.
Ingredients include organic kale, spinach and spirulina. "Just grab
and go."

For: Instagram feed, 4:5. Photos only.
```

## What came out

```text
## Product (truth sheet)
- **Product:** Sprout Original (Adults), Low Sugar.
- **Pouch:** glossy deep green stand-up foil pouch, big yellow wordmark, yellow bear face top right. All printing is copied exactly from Image 1 (pouch front).
- **Gummies:** shape, colour and surface copied exactly from Image 2 (gummies in an open hand).
- **84-pack:** 3 identical pouches.
- **Contains:** organic kale, spinach and spirulina, among other ingredients.
- **To confirm before go ahead:**
  - Does the pouch have a zip or tear notch?
  - Is anything printed on the gusset or sides that would show at an angle?

`MISSING: photo` of the outer pack or shipping box. The **arrival** frame is dropped.

## Style sheet (identical in every prompt)
- **Colour plan:** Warm against cool. The ground is cream #FFF7DF with sunflower yellow #FFCC2E as the second warm surface, set against the cool deep green pouch. This gives the clearest edge. Green grounds are excluded because the pouch would melt into them. The colour plan colours the scene only, never the pouch or gummies.
- **Light:** direct mid-morning sun from 10 o'clock, high and slightly to the product's left, small and hard, with a large white card at 3 o'clock for fill; the sun's glint sits on the pouch's left edge, off the wordmark and bear face.
- **Lens:** 50 mm full-frame look at f/4; 100 mm macro at f/5.6 for close frames.
- **Surfaces:**
  - cream seamless paper sweep (#FFF7DF)
  - matte sunflower-yellow painted tabletop (#FFCC2E)
  - pale oak table, used as a kitchen counter against a cream wall indoors and as a patio table outdoors
- **Props:** fresh curly kale leaves, baby spinach leaves, a small cream ceramic dish of spirulina powder, a clear glass of water, a cream canvas tote.
- **Finish:** bright, clean contrast with open shadows; high, candy-bright saturation true to the pouch's real colours; fine, light film grain; real texture, no glossy computer-rendered look.

## Frame list (9 frames, 4:5 feed)

| # | Job | Distance | Angle | What it shows |
|---|---|---|---|---|
| 01 | Identity (test frame) | Mid | Eye level | Pouch standing upright, front on, on the cream sweep. Crisp sun shadow, nothing else in frame. |
| 02 | Scale | Mid | High (45°) | An adult hand holds the pouch beside a glass of water on the oak counter. The pouch is about the height of the glass. The whole hand is visible and no finger covers the label. |
| 03 | Use | Close | Eye level | An open adult palm holds two gummies, matching Image 2. The pouch stands soft-focus behind. |
| 04 | Substance | Close | Straight down | Macro of a few gummies on the sunflower tabletop, showing true texture, with a kale leaf and spinach leaves at the edges. |
| 05 | Use | Mid | High (45°) | "Grab and go": an adult hand slips the pouch into the cream tote on the oak counter, label facing camera. |
| 06 | Place | Wide | Eye level | A sunny home kitchen with the oak counter and cream wall. The pouch sits beside the glass of water and the spirulina dish. No people. |
| 07 | Range | Mid | Straight down | Three pouches (the 84-pack) laid side by side on the sunflower tabletop, framed by kale and spinach. |
| 08 | Ad base | Wide | High (45°) | One pouch small in the lower third of the cream sweep, with open cream space above for words added later. |
| 09 | Use | Wide | Low | An everyday adult outdoors on a sunny patio at the oak table, tote on the shoulder, holding the pouch. Shot from below against a bright sky. |

**Grid check:**
- Distances: wide 06, 08, 09; mid 01, 02, 05, 07; close 03, 04.
- Angles: all four are used.
- No two frames share job, distance and angle.
- Identity, scale, a close frame and an ad base are all included.
- Use and substance are weighted because the product is eaten.

Reply **"go ahead"** to start the prompts with frame 01. Answers on the pouch zip/notch and side printing are welcome too.
```
