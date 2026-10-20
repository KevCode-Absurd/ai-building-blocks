# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable plan: the review-named shaker is the has-been, the bubble is short and in character, and every fact on the image comes straight from the brief with the offer terms shown. It correctly admitted it couldn't see the photos and left the label check and pouch scale as open edit-step items.

## Judge list

- Met: Shown for 2 seconds, someone can say what the object is fed up about and what the product is.
  Shaker in the rack, sheepish face, bubble "Honestly, I'm why it never stuck." with the Sprout pouch at the right edge, front on.
- Met: The bubble has 7 words or fewer, says "I" or "me", and never says "you".
  Bubble (6 words): "Honestly, I'm why it never stuck." First person, no "you".
- Met: There are at most 3 other things to read, in type big and dark enough to read on a phone.
  Three lines: product name at 40 px, no-shaker line at 32 px, offer line at 30 px, cream/yellow on solid #002C17 band.
- Met: The object says nothing it couldn't have seen, and every fact matches your claims.
  Shaker admits its own fault only; offer line and "No water. No mixing. No shaker." and the 60+/21/6g claim copy the brief word for word.
- Met: The product matches your photos, has no face, and has your real pack laid over it.
  "I also can't see the attached photos"; prompt says "no face added"; edit step lays the real pouch over and checks label words.

## What went in

```text
Problem: has quit greens powders again and again; the routine
never sticks. Buyer has tried other fixes. Runs in the Instagram
feed.
Buyer's moment: the kitchen sink in the morning, shaker in the
drying rack, half-used tub in the cupboard.
Their words: "Plus not having to clean a shaker bottle or extra
dishes for greens stuff in powder form, is absolutely excellent!"
(review 6)
Product: Sprout Superfood Gummies. Glossy deep green stand-up
pouch, big yellow wordmark "Sprout", yellow bear face top right,
"28 Daily Packs" at the bottom. Photos attached: front, side, top.
Also true: no water, no mixing, no shaker.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. Voice: playful, cheeky. Jokes are fine; no guilt.
Colors: deep forest #002C17, warm cream #FFF7DF, sunflower #FFCC2E.
Offer: $29.99 first order with the text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
I can't make images in this chat, so this hands back the prompt for you to run. I also can't see the attached photos, so the pouch's look and label words come from your description, and checking the pack against the real photos stays in the edit step.

```
NARRATOR  Frosted shaker bottle in the drying rack (has-been)
True: it sits in the rack by the sink every morning; review 6 names it  Readable: tall plain cylinder with a screw lid, face on the smooth side away from the measure marks  At stake: being retired for good  Fair: plain unbranded screw-top shaker, no rival shape, logo or colours, nothing like a pouch
State: frosted clear plastic, a dried green-grey ring a third of the way up inside, a clump of powder caked in the base, green flecks on the lid threads, water beads on the outside

MOOD  sheepish  Light: warm morning light, low from a window on the left
EXPRESSION  brows tilted up in the middle, eyes sliding sideways toward the pouch, mouth a small crooked pressed line, lid tipped slightly forward like a lowered head, looking toward the product

LAYOUT   4:5, 1080 x 1350
0 to 22 % bubble, upper left, tail to the shaker's mouth | 22 to 78 % shaker in rack (left, about half the frame) and pouch (right edge, front on) | 78 to 100 % small lines on a solid #002C17 band

WORDS ON THE IMAGE
Bubble (6 words): "Honestly, I'm why it never stuck."
1: "Sprout Superfood Gummies"  Source: brand / pack wordmark
2: "No water. No mixing. No shaker."  Source: brief, "also true"
3: "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks."  Source: brief, offer

IMAGE PROMPT  A real photograph, vertical 4:5. A tall, plain, unbranded frosted-clear plastic shaker bottle with a screw lid stands upside-right in a wire dish-drying rack beside a kitchen sink. A simple face is moulded into the shaker's own plastic on its smooth side, away from the measuring marks: two shallow pressed-in eyes and a small pressed-in mouth, the same frosted material. Brows tilted up in the middle, eyes sliding sideways to the right toward a pouch, mouth a small crooked pressed line, lid tipped slightly forward like a lowered head. Inside, a dried green-grey ring a third of the way up and a clump of caked powder in the base; green flecks on the lid threads; water droplets on the outside. Around it, only a plain mug and a plate in the rack, a steel sink, a plain tiled wall, no text or labels anywhere in the room, no people, no other faces. Warm early-morning light coming low from a window on the left, soft long shadows. At the right edge, standing on the counter, sharp and facing the camera at true scale: a glossy deep forest-green stand-up pouch with a large yellow "Sprout" wordmark, a small printed yellow bear face top right (flat label art, not animated) and "28 Daily Packs" at the bottom, printing intact and undistorted, with no face added. The shaker fills about half the frame, left of centre, from 22% to 78% of the height. The top 22% above and to the left of the shaker is an empty, calm patch of plain wall for a speech bubble. The bottom 22% is a plain, uncluttered countertop strip, kept empty for text.

POST WORDS  Primary text Your shaker's taking it well, mostly. Sprout gummies give you 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack, with no water, no mixing, no shaker. | Headline field Greens, minus the shaker | Button Shop now
EDIT STEP   Add the bubble upper left: white fill, thin #002C17 outline, tail to the shaker's mouth, words in #002C17 at 44 px or more. Cut the real pouch out of the front photo and lay it over the pouch in the picture at true scale, then check every label word ("Sprout", "28 Daily Packs") against the real photos. Fill the bottom 22% with solid #002C17. Put the product name in #FFCC2E at 40 px, the no-shaker line in #FFF7DF at 32 px, and the offer line in #FFF7DF at 30 px or more over two lines. Check the offer against the live offer on the day. Check contrast: #FFF7DF and #FFCC2E on #002C17, and #002C17 on white, are all well above 4.5:1. For a 1:1 version, recompose at 1080 x 1080 rather than crop.
CHECKS MISSED  Product label not checked against the photos (photos not visible here). True scale of pouch next to shaker not confirmed (pouch size unknown).
MISSING: real pouch dimensions (height and width) to set true scale against the shaker
MISSING: offer end date
```

To make the picture, paste the image prompt into ChatGPT (GPT Image) or Gemini (Nano Banana), or into Higgsfield's image tool. In Gemini, attach your pouch photos as references. Free plans have tight daily limits.

Want to check this ad with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker) before it goes live, or write the [landing page](https://useaiblocks.com/skills/ad-matched-landing-page-writer) to match? Or tell me what you'd rather do.
```
