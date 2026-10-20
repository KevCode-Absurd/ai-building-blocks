# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A usable, on-brand concept: the crusted shaker next to a clean palm of gummies makes the washing-up point without words, and the headline, support line and colours all come from the input. One thing to verify when the photo is attached: the run assumes the daily pack carries a large "Sprout" wordmark (it flagged this as still to do), and the treatment says gummies "sit at rest" while the prompt says they "pour".

## Judge list

- Met: Cover the headline. The picture alone shows the problem.
  "a used plastic shaker bottle... A dried, chalky green ring is crusted around the inside wall" beside a clean palm of gummies: mess reads without words.
- Met: You can say in one sentence why the picture is unexpected and why it's relevant.
  "side by side (with one exact detail: the dried green crust ring and gritty specks...)" and "Concludes: is the opposite of"; CHECK yes/yes.
- Met: The product is in the ad, small and matching your real photo, not pasted in a corner.
  "one Sprout daily pack torn straight across the top... held in the scene and lit by the same window light, never pasted on."
- Met: The picture shows the problem or its cause, never a result like a changed body or a before-and-after.
  Crusted shaker is the cause; "They are not shown 'working' and there is no result."
- Met: The headline names a moment or a gain, not a condition the reader has.
  "Greens with nothing to wash (job: gain)"
- Met: The prompt mentions the problem before the product.
  Prompt opens with the sink and crusted shaker; the daily pack appears only after "On the right".

## What went in

```text
Problem: review 6, "Plus not having to clean a shaker bottle or
extra dishes for greens stuff in powder form, is absolutely
excellent!" and review 3, "the drink was definitely
gritty/chalky."
Moment: a weekday morning at the sink.

Product: Sprout, daily greens gummies. Tear a pack, eat the
gummies. No water, no mixing. 6 g prebiotic fiber.
Brand line: "No more gagging on pills, sloshing chalky powders, or
cleaning messy counters."
Never: "fix", weight or energy results, before-and-after.

Photos: the adult pouch on a soft gradient; one daily pack torn
straight across the top, gummies pouring into a palm.
Look: deep forest green #002C17, sunflower yellow #FFCC2E. Work
Sans bold. Photos are bright and sunny, never clinical.
Offer: none.
```

## What came out

```text
I can't make images here (no image tool is connected), so this is the concept and prompt. I also can't see your two product photos; I worked from your descriptions and marked the photo check as still to do.

```
ONE THOUGHT  "I get my greens and there's no shaker to wash." ("Plus not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!", review 6; "the drink was definitely gritty/chalky.", review 3)
MOMENT       Kitchen sink, a weekday at about 7am: a used shaker bottle with a dried green, chalky ring inside, its lid and a powder scoop beside it, waiting to be washed
TWIST        side by side (with one exact detail: the dried green crust ring and gritty specks on the shaker wall)
             Concludes: is the opposite of
CHECK        Unexpected: yes  Relevant: yes
HEADLINE     Greens with nothing to wash  (job: gain)
SUPPORT      "No more sloshing chalky powders, or cleaning messy counters." (brand line, trimmed)
LINE UNDER   Tear, eat, done. No shaker.
LOOK         photo, because the point is "this mess is real". The crust has to read as true, and the brand's photos are bright and sunny.

FRAME (4:5)
Focal point / The split across the counter edge: the crusted shaker in the sink (left) against an open palm of gummies over a dry, clean counter (right)
Words / Top fifth, on the plain sunlit pale wall above the sink. Headline in Work Sans bold, deep forest green #002C17. Support line smaller beneath it in the same green. One sunflower yellow #FFCC2E underline bar under the headline.
Product / Lower right on the dry counter: one Sprout daily pack torn straight across the top, gummies pouring into an adult palm. The pack is held in the scene and lit by the same window light, never pasted on.
Scale / The shaker stands about 20 cm tall beside the sink tap. The daily pack is palm-sized, and the gummies are the size of a fingertip.
Colours / Scene in bright, warm morning light. Brand colours only in the words: #002C17 and #FFCC2E.

PRODUCT TREATMENT
Built from the photo of the torn daily pack with gummies pouring into a palm. It keeps the pack's shape, colours and large "Sprout" wordmark, and leaves out all small print. The adult pouch is left out, so the scene has one product and one focal point. The gummies sit at rest in the palm. They are not shown "working" and there is no result.

IMAGE PROMPT
Bright, sunny photograph of a home kitchen on a weekday morning, warm window light, 4:5 vertical. On the left, in a white sink under the tap, stands a used plastic shaker bottle about 20 cm tall. A dried, chalky green ring is crusted around the inside wall, with gritty green specks stuck to the plastic. Its lid and a powder scoop lie beside it in the sink, dusted with green residue. On the right, on a dry, spotless light counter, an adult hand holds a small daily snack pack torn straight across the top, and gummies pour into the open palm. The pack must match the attached product photo exactly: same shape, same colours, same large "Sprout" wordmark, with no small print. No glass, no water, no spoon on the right side. The two halves sit side by side so the messy sink and the clean palm read as opposites. Only the hand and forearm show, with no face. The top fifth of the frame is a plain, pale sunlit wall left empty for text. In that area, in bold Work Sans, deep forest green #002C17: "Greens with nothing to wash". Beneath it, smaller, same green: "No more sloshing chalky powders, or cleaning messy counters." Add a short sunflower yellow #FFCC2E bar under the headline. Simple, uncluttered, one focal point, nothing else on the counter.

MISSING:  the two product photos themselves (attach them to the image tool so the pack is matched, not guessed); the platform each review came from
Not used: "6 g prebiotic fiber" (true, but it pulls focus from the washing-up gain and isn't needed on the image); adult pouch on gradient (a second product would add a second focal point); "gagging on pills" part of the brand line (off the moment); merged and swapped-in twists (side by side already lands)
CHECKS MISSED: none
Still to do: product true to its photo. I couldn't see the photos, so check that the generated pack matches the real one in shape, colours and wordmark.
```

**To make the picture:** paste the image prompt into ChatGPT (GPT Image) or Gemini (Nano Banana) with your daily-pack photo attached. You can also paste this whole skill there so it writes and makes the picture in one go. Higgsfield's image tool works too. In Claude Code, with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send it to that API and save the file; OpenAI or Google bills each picture. If the "Sprout" wordmark comes out garbled, don't remake the same image. Drop the support line and leave only the headline.

Next, would you like to check it with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), make a second ad with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker), write the copy with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer), or write the page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer)? You can also type your own.
```
