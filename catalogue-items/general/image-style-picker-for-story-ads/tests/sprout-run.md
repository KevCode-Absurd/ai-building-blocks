# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 6 of 6 met. Invented facts: 1.

A strong, usable brief. It picks the 3pm desk moment, explains why the 61% caption was dropped, and gives a clean prompt, a different-trace runner-up and honest flags on weak spots. It stays within the files and the rules (no logo or product, no health claim, no child).

## Judge list

- Met: Picture builds on a moment quoted from the story, not the product
  PUSH quotes "Every day at 3pm I'd push my chair back from my desk"; product left out.
- Met: Someone with the problem would know what it's about with no caption
  Hand on stomach, pushed-back chair, half-eaten lunch carry the gut meaning; the run flags a tiredness risk.
- Met: Someone without it would scroll past, and nothing says what the reader has
  "Words on the image: none"; no stat or caption naming a condition.
- Met: Story's first line answers what the picture makes people wonder
  Wonder line picked up by the story's opening 3pm line; the story begins on the same moment.
- Met: Runner-up shows a different kind of evidence
  Runner-up is tried-before-products (on a thing) vs. the moment skill.
- Met: Any swap from the skill asked for is explained
  "Changed from fact-caption-image-ad-maker because" lists three reasons.

## Invented

- other: 3:04 pm. Chair pushed back. (Caption time is invented, but it is an illustrative caption on a made-up image, not a Sprout fact.)

## What went in

```text
Story ad (approved; narrator: a customer who agreed, example only):
Every day at 3pm I'd push my chair back from my desk and wait
for my stomach to settle.
I'd tried fiber powders. I'd tried probiotics. Nothing stuck.
Sprout is a daily pack of gummies with 6 g prebiotic fiber. It
supports digestion and gut health. One reviewer with IBS wrote
that the prebiotics "do their job, but not aggressively."
If your stomach is sensitive, start with Low Sugar.

Buyer: the gut-fix seeker, 25 to 55, mostly women.
Picture wanted: the caption bar, with "61% of Americans
experience weekly digestive issues" (product page).
Brand rule: "supports", never "fix".

[attached: sprout/product-page.md]
```

## What came out

```text
I can't draw pictures in this chat, so you'll get the image prompt to run elsewhere.

```
PUSH
"Every day at 3pm I'd push my chair back from my desk and wait for my stomach to settle." (story ad, line 1, narrated by the customer)

TRACE AND SKILL
Only a moment (3pm at the desk, the pause before getting back to work) -> problem-moment-image-ad-maker. Changed from fact-caption-image-ad-maker because:
(1) the 61% stat's footnote on the product page only says "Source", so it isn't a sourced fact on file;
(2) those words aren't in the story, and the story opens on the 3pm desk moment, not a statistic, so Follow fails;
(3) the push leaves no trace in the room itself, so the place skill doesn't fit either. The moment is the evidence.

RUNNER-UP
tried-before-image-ad (on a thing): a half-used tub of generic fiber powder and a probiotic bottle with a few capsules left, pushed to the back of a kitchen shelf. It comes from "I'd tried fiber powders. I'd tried probiotics. Nothing stuck."

THE BRIEF
Note: the problem-moment skill file isn't in this chat. This brief is built from its line in step 2 ("the moment itself") plus "People and fixes", and that skill's own checks weren't run.

Moment: Mid-afternoon on a workday. A woman has rolled her desk chair back about a foot from her desk and stopped working. She sits a little forward and still, waiting for her stomach to settle. It is a quiet pause, not pain.

Who: A made-up woman, about 40. Seen from behind and to one side, so we get her shoulders, the side of her face turned down and away, and one hand resting flat and loosely low on her stomach over her shirt. Her other forearm rests on her thigh. She is not acting hurt. She is not a customer and is never called one.

Where: An ordinary home-office corner or a shared-office desk. It has a laptop showing a generic blurred spreadsheet, a mug, a phone face-down, and a lunch container pushed to one side with half the food left. There is a cardigan over the chair back and a few loose papers. This is the normal mess of a working day.

Light: Flat afternoon daylight from a side window. It is slightly uneven, with no studio look.

Framing: Square 1:1. It looks like a coworker or a housemate snapped it from a few steps behind, at chest height on a phone, slightly off-level. The chair's pushed-back gap is clearly visible between the desk edge and her knees.

Words on the image: none. The time goes in the line under the picture.

Product: left out (not asked for).

Never show: any logo, brand colour, price or badge; any fiber or probiotic product; a child; a real app or screen; a grimace or doubled-over pose; anything that says what the reader has.

Skin and hands: Her cheek and the back of her hand show a little real texture at phone distance, with fine lines, slightly uneven tone and natural pores. There is no plastic shine and no over-sharpening. Her hand rests with natural weight on the fabric, at true size, with a soft contact shadow.

Fixes: Change one thing at a time (waxy skin, a staged pose, blown-out window light, a readable or branded screen) and keep the rest. After two tries, change the idea, not the facts.

Stop: It is unexpected in a feed because it shows someone not working at a work desk, with a visible gap. It is relevant because the gut-fix seeker knows that pause.
Sort: People with afternoon stomach trouble read the hand, the untouched lunch and the pushed-back chair with no caption. Others see a tired coworker and scroll on.
Follow: The story's first line describes exactly this picture. The landing page does not start on this moment (see CHECKS MISSED).

Image prompt:
"Candid smartphone photo, square 1:1, taken from a few steps behind and to the side at chest height, slightly off-level. A woman of about 40 sits in an office desk chair that has been rolled back about a foot from her desk, leaving a clear gap between the desk edge and her knees. She leans slightly forward, still and quiet, head turned down and away from the camera. One hand rests flat and loosely low on her stomach over a plain shirt, and the other forearm rests on her thigh. Her expression is calm, waiting, not in pain. On the desk: an open laptop with a blurred generic spreadsheet, a ceramic mug, a phone face-down, loose papers, and a lunch container pushed aside with half the food uneaten. A cardigan hangs over the chair back. Flat mid-afternoon daylight from a side window, slightly uneven, ordinary indoor colour. Natural skin texture on her cheek and the back of her hand: fine lines, uneven tone, visible pores, no retouching, no plastic shine. Her hand rests with real weight and a soft contact shadow on the fabric. Everyday clutter, nothing styled. No text, no logos, no brand names, no readable screens, no products, no other people."

WHAT IT MAKES PEOPLE WONDER
Why has she stopped and rolled back from her desk in the middle of the afternoon? / picked up by: "Every day at 3pm I'd push my chair back from my desk and wait for my stomach to settle."

LINE UNDER THE PICTURE
3:04 pm. Chair pushed back. (plain caption, 27 characters)

TEST
The same story with the 3pm desk moment against the shelf of dropped fiber powder and probiotics. Judge first on how many readers reach the plan box on the page, then on sales.

CHECKS MISSED
- Follow: the product page opens on the announcement bar, "Sprout Superfood Gummies" and "60+ potent ingredients", not on the afternoon gut moment. Digestion is only the third bullet, so the click doesn't land on the same moment.
- Sort: a still woman at a desk could read as tiredness. Only the hand on her stomach and the half-eaten lunch carry the gut meaning, so watch for this in the test.
- problem-moment-image-ad-maker's own gate and checks were not run (its file isn't in this chat).
```

**To finish the picture:**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** save an `OPENAI_API_KEY` or `GEMINI_API_KEY` and the prompt can be sent to that API, which bills each picture.

**Gaps to fill later:**
- MISSING: a named source for the 61% stat, if you want the caption idea back.
- MISSING: the brand brain's photo style and allowed on-image words.
- MISSING: the buyer's own words about the afternoon moment.
- MISSING: a source on file for "6 g prebiotic fiber". It isn't on the product page as captured.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? Bring the image prompt. Or type your own next step.
```
