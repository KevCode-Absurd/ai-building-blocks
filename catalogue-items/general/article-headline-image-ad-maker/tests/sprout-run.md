# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable brief: the line is lifted straight from the approved ad, the photo is candid and brand-free, and the scent check correctly tells the owner the product page must change (new first line, same photo, drop the vitality claim, add the first-order limit to the plan box). It also catches the real 21 vs over-20 mismatch and flags the fiber claim as not seen on the page rather than assuming it.

## Judge list

- Met: The line on the photo matches the page's first screen, or the scent check says how to fix it.
  "Words: fix. ... add a first line above the title: 'Every evening ended the same way.'" plus scene and promise fixes.
- Met: It's 7 words or fewer, and every letter is right on the finished picture.
  "Every evening ended the same way." Word count: 6; the image prompt repeats it spelled identically.
- Met: It says only what your copy supports. No invented number and no named expert.
  "cut word for word from the approved story ad"; no numbers or experts on the image.
- Met: Nothing looks like a newspaper. There is no masthead, outlet name, byline or date.
  "no masthead, outlet name, byline or date" and prompt ends "no other text".
- Met: The line under the image is different from the line on it.
  "No shaker. One daily pack." (26 characters) vs "Every evening ended the same way."

## What went in

```text
Story ad (approved, built on reviews 4 and 6):
I'd been choking on a greens powder for years. Every evening
ended the same way: the shaker soaking in the sink, a green film
that wouldn't rinse out.
This year I gave it up. Sprout is one daily pack: tear the top,
eat the small handful of gummies inside. 60+ ingredients, 21
vitamins and minerals, 6 g prebiotic fiber. No water, no shaker.
30-day money-back guarantee on your first order.

Ad links to: the Sprout product page.
First screen: title "Sprout Superfood Gummies", under it "60+
potent ingredients to revive whole body vitality in great tasting
gummies." First image: the pouch on a soft gradient.

[attached: sprout/product-page.md]
```

## What came out

```text
## 1. Scene
A plastic shaker bottle soaking in a kitchen sink at night, with a green film inside it that won't rinse out. Above it, one line of text: "Every evening ended the same way."

## 2. Where and when
- **Place:** an ordinary home kitchen sink with a tiled backsplash.
- **Time:** about 9 pm, under the overhead kitchen light. It is warm and slightly uneven.
- **Within reach:**
  - a sponge and a dish-soap bottle with its label turned away
  - a tea towel over the tap
  - a mug left from dinner
  - a few drops on the steel

## 3. The photo
**The moment:** shot on a phone from standing height, looking down and slightly forward. A clear plastic shaker lies on its side in shallow, cloudy water. Its lid and mixing ball sit beside it. Green residue streaks the inside walls and has gathered at the bottom.

**What stays out:**
- No hands.
- No person.
- No product. It wasn't asked for.
- No brand marks on anything.

**The clear area:** the plain pale tiled backsplash fills the top third and stays empty for the words. The sink and shaker sit in the middle and lower part of the frame.

**Format:** square 1:1. The bottom stays free of anything important.

## 4. Words on the image
**"Every evening ended the same way."**
- **Word count:** 6.
- **Where it came from:** cut word for word from the approved story ad ("Every evening ended the same way: …").

**Flag:** the page's headline is "Sprout Superfood Gummies", which is a product name with no situation in it. So the line was written from the story instead. The page should change to match (see the scent check).

## 5. Type and place
- **Position:** one line, centred on the backsplash in the top third, with a clear margin from the edges.
- **Type:** plain heavy sans-serif in sentence case, near-black (#1A1A1A) on the pale tile. It should be big enough to read at arm's length, about 8–9% of the frame height.
- **What to leave out:**
  - no script
  - no brand font
  - no brand colour
  - no masthead, outlet name, byline or date
  - no second line

## 6. Blank version
The same photo, framing and light, with no words. The backsplash is left empty.

## 7. Line under the image
**"No shaker. One daily pack."** (26 characters)

This is "the swap": the old step goes out and the new one comes in. The ad supports it with "No water, no shaker" and "one daily pack".

## 8. Scent check

**Words: fix.**
- **The problem:** the first screen opens on "Sprout Superfood Gummies" and "revive whole body vitality". That is a product name plus a risky claim the study doesn't support (page issue 6), and neither matches the ad.
- **Fix option 1:** add a first line above the title: "Every evening ended the same way." Follow it with a line naming the swap.
- **Fix option 2:** build a separate article-style page for this ad that opens on that line.
- **Either way:** drop "revive whole body vitality" from the first screen.

**Scene: fix.**
- **The problem:** the first image is the pouch on a soft gradient, a studio pack shot.
- **Fix:** open the page on this same shaker-in-the-sink photo, or one from the same moment.
- **Also:** move the "Vs Powders" review cards up from the bottom, so the powder-quitter story continues straight away (page issue 10).
- **Note:** what the phone first screen shows was not captured. **(inferred)** The announcement bar, gallery and title likely fill it, so the new line and photo must sit above the gallery.

**Promise: fix.**
- **What matches:** the ad promises one daily gummy pack in place of a powder, and the page's Directions match that. "60+ ingredients" also matches.
- **Vitamin count:** the ad says "21 vitamins and minerals", but the ingredients panel says "over 20" (page issue 7). Make the page say 21 everywhere.
- **Guarantee:** the ad correctly says "first order". The plan box says only "30-Day Money-Back Guarantee", and the limit is buried in the last FAQ (page issue 4). Add "on your first order" to the plan box.
- **Fiber:** `MISSING: where the page states "6 g prebiotic fiber".` It was not seen in the page text. Confirm it is on the page, or remove it from the ad.

## 9. Image prompt
Candid smartphone photo, square 1:1, of a home kitchen sink at night under warm, uneven overhead light. A clear plastic shaker bottle lies on its side in shallow cloudy water, with green powder residue streaked inside and settled at the bottom. Its lid and mixing ball sit beside it. A sponge, an unbranded dish-soap bottle and a used mug are nearby, with water drops on steel. Shot from standing height, slightly downward, unretouched, everyday clutter. The top third is a plain pale tiled backsplash. Centred on it, one line of plain heavy sans-serif text in near-black, sentence case: "Every evening ended the same way." No logos, no brand names, no people, no other text.
```
