# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable brief and prompt that stays faithful to the story's own words, keeps the amount honest and flags every scene detail it invented as inferred. The only nit is the caption line lacks the shape's parenthetical type and character count, though the line itself lands at 27 characters.

## Judge list

- Met: One residue, in the research amount, not exaggerated
  "one morning's spill. That is a thin, loose scatter around the scoop with a few small clumps, not a heap."
- Met: Odd or unpleasant, never graphic or medical
  "A dusting of green powder spilled on a kitchen counter" — a spill, nothing bodily or medical.
- Met: Giveaway container or surface partly in shot
  "plain white plastic measuring scoop with green residue inside, cut off by the frame... rim of a plain unlabeled tub, mostly out of shot."
- Met: No product, pack, logo, text, arrow or circle
  "No people, no text, no labels, no logos." Product left out; tub generic and unlabeled.
- Met: Looks like a cheap phone photo, not a studio close-up
  "Harsh on-camera flash from above, flat and slightly overexposed... Unretouched, realistic, everyday." Mug ring and crumbs add room mess.

## What went in

```text
Story ad (approved, built on review 6 and the brand's line about
messy counters):
This is my counter at 7am. A dusting of green powder around the
scoop, every morning, and a wet cloth to wipe it up before work.
I liked what was in the powder. I didn't like the mess.
Sprout is a small handful of gummies in a daily pack. One
reviewer said not having to clean a shaker bottle or extra dishes
"is absolutely excellent!" 60+ ingredients, 21 vitamins and
minerals, 6 g prebiotic fiber.

Buyer: the quitter who wants to stick, 28 to 45.
```

## What came out

```text
I can't draw pictures here, so you'll get the brief and a ready-to-paste prompt, with how to make the picture at the end.

**1. Scene**
A dusting of green powder spilled on a kitchen counter next to a scoop, caught under phone flash.

**2. Where and when**
A kitchen counter at 7am on a weekday. Within reach are a plain measuring scoop, the rim of an open tub, a folded damp dishcloth, a faint mug ring and a few crumbs.

**3. The residue**
- **What it is:** green powder, "a dusting", in the story's own words.
- **How much:** one morning's spill. That is a thin, loose scatter around the scoop with a few small clumps, not a heap.
- **Where it was found:** on the counter around the scoop. The scoop, still green inside, is cut off by the top edge. The rim of an unlabeled tub sits in one corner.

**4. Framing and light**
The shot is close, looking almost straight down, the way you'd hold a phone over a spill. The powder fills about 40% of the frame. The light is a hard on-camera flash because the story is a complaint ("I didn't like the mess"), and it should read as proof sent to a friend. The damp cloth at the bottom edge is the one sign of the daily wipe-up.

**5. Words on the image**
None.

**6. Line under the image**
Every single morning, this.

**7. Flags**
- **Amount:** taken from the story ("a dusting… every morning"). No research figure was given, so I kept it to one morning's spill. Nothing was enlarged.
- **Residue description:** MISSING: review 6 and the buyer's own words about the mess. "Green powder" and "a dusting" come from the story only.
- **Brand brain:** MISSING: no brand brain was supplied, so there are no checks on allowed words or photo style.
- **[inferred]:** the laminate counter, the white scoop, the grey dishcloth, the mug ring and the crumbs.
- **Product:** left out because you didn't ask for it. The tub is generic and unbranded, not a rival's pack.

**8. Image prompt**
Square 1:1 phone photo looking almost straight down at a kitchen counter at 7am. Harsh on-camera flash from above, flat and slightly overexposed. A light dusting of fine green powder, one scoop's worth of spill, scattered loosely across pale laminate with a few tiny clumps, filling about 40% of the frame. At the top edge, a plain white plastic measuring scoop with green residue inside, cut off by the frame. In one corner, the open rim of a plain unlabeled tub, mostly out of shot. At the bottom right edge, a folded damp grey dishcloth. A faint mug ring and crumbs nearby. No people, no text, no labels, no logos. Unretouched, realistic, everyday.

**9. Checks missed**
None.

---

**To make the picture:**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. You can also paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. You can get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? It takes the image prompt. Or tell me what you'd like to do next.
```
