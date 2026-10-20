# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A usable, well-grounded ad plan: the pouch is described exactly from the brand file, the words stay inside the approved claims, the renewal price is disclosed, and the contrast ratios check out. It correctly says the photos weren't visible and lists real gaps, though it skipped the closing next-step suggestion and has a minor button mismatch ("Shop Low Sugar" on image vs "Shop Now" in post).

## Judge list

- Met: Shown for 2 seconds, someone can say what the product is and the one idea.
  Pouch "filling about 35% of the frame width" with "Sprout" wordmark; headline "6g fiber you'll actually eat." One yarn change (plying).
- Met: The headline has 7 words or fewer, with at most 3 other things to read.
  "Headline (5 words) | 6g fiber you'll actually eat." plus small line, offer, button: exactly 3 more.
- Met: Every object in the prompt has a material word and a real color.
  "honey-brown rib knit", "cream stockinette", "crocheted in warm cream", "felted kelly-green and forest-green wool roving", "deep-green crocheted bears".
- Met: Nothing shows a body getting better, and no face is in close-up.
  "Doll: None... nothing touches a body." Avoid field lists "faces, belly, body". Yarn change is on a tabletop.
- Met: The product matches your photos (or brand file's description, when photos can't be seen), with your real label laid over it.
  "glossy-looking deep green... big yellow intarsia wordmark... yellow crocheted bear face at top right"; "Cut the real Low Sugar pouch out... lay it over".

## What went in

```text
Selling idea: six grams of prebiotic fiber, in a gummy you'll
actually eat.
Buyer: the gut-fix seeker, woman, 25 to 55. Has tried fiber
powders and probiotics. Doubts: "Will this upset my stomach more?"
Runs in the Instagram feed.
Product: Sprout Low Sugar, pouch of 28 daily packs; 6 g prebiotic
fiber per pack. Pouch: glossy deep green, big yellow wordmark
"Sprout", yellow bear face top right, "28 Daily Packs" at the
bottom. Photos attached: front, side, top.
Approved: "Supports digestion and gut health." "60+ ingredients,
21 vitamins & minerals, and 6g fiber."
Never: "fix" the tummy, any result as a promise.
Brand note: point gut-sensitive buyers to Low Sugar.
Offer: $29.99 first order with text sign-up, renews at $49.99
every 4 weeks.
Brand file: attached (brand.md).

[attached: sprout/brand.md]
```

## What came out

```text
I can't draw pictures in this chat, so you'll get a prompt to paste into an image tool. Only `brand.md` reached me. I can't see the front, side or top photos, so the pouch's look and label words come from your brief and the brand file, and the match against the photos still needs checking.

## 1. Moment plan
- **Fit:** Wool suits a gut subject. Yarn can make the gummies look less tasty, so they stay small and simple and the words carry "you'll actually eat."
- **Moment:** The buyer is comparing fixes (powders, probiotics), so the picture shows the yarn change caught halfway.
- **Show job:** Join.
- **Technique:** Plying.
  - At the far left, six loose, fluffy strands of green wool roving.
  - Midway across the table they twist into one thick, tidy plied cord.
  - The cord curves right to a crocheted bowl of small deep-green gummy bears.
  - The gummies pour from a daily pack torn straight across its top edge.
  - The Sprout pouch stands closed behind the bowl.
- **Fabrics:**
  - Rib knit for the wooden tabletop.
  - Cream stockinette for the back wall.
  - Felted cream wool for the quiet area.
  - Tight crochet for the pouch, daily pack, bowl and gummies.
  - Roving and plied yarn for the strands.
  - One yarn thickness (DK weight) throughout, except the roving.
- **Doll:** None. A product close-up reads faster, and nothing touches a body.
- **Sentence it implies:** "One Sprout pack brings 6 g of fiber together in a few gummies."
- **Source:** Approved claim "60+ ingredients, 21 vitamins & minerals, and 6g fiber". The brand file says 1 pack holds 6 g of prebiotic fiber.
- **What it does not imply:** No body is shown and nothing heals. There is no before and after.

## 2. Layout
**Size:** 4:5, 1080 x 1350 (Instagram feed).

| Zone | Height | What goes there |
|---|---|---|
| Quiet area | 0–24% | Smooth felted cream wool, no stitches. Headline and small line. |
| Picture | 24–86% | Roving strands at left plying into a cord across the centre. Bowl and torn daily pack front right, at about 60–80%. Pouch standing behind them on the right, at about 30–80%, filling about 35% of the frame width. |
| Solid band | 86–100% | Deep forest green #002C17. Offer line at left, button at right. |

For 1:1 (1080 x 1080), recompose instead of stretching:
- Quiet area 0–22%.
- Shorten the strands so they start at 15% from the left.
- Pouch and bowl at 22–86%.
- Band at 86–100%.

## 3. Words on the image
| Item | Text | Source |
|---|---|---|
| Headline (5 words) | 6g fiber you'll actually eat. | "6g fiber": approved claim. "Actually eat": your selling idea. |
| Small line | Supports digestion and gut health. | Approved claim, word for word |
| Offer | $29.99 first order with text sign-up. Renews at $49.99 every 4 weeks. | Your offer. The brand footer says the price is for new customers using the SMS discount. |
| Button | Shop Low Sugar | Brand note: point gut-sensitive buyers to Low Sugar |

**Type sizes:** headline 72 px, small line 36 px, offer 30 px (two lines), button 34 px.

**Fonts:** Work Sans bold for the headline, Work Sans medium for the rest.

## 4. Image prompt
> A crocheted Sprout supplement pouch standing upright on a knitted tabletop, beside a small crocheted bowl filled with tiny crocheted deep-green gummy bears that pour from a small flat crocheted daily pack torn straight across its top edge. From the far left, six loose, fluffy strands of felted kelly-green and forest-green wool roving run across the table and twist, halfway along, into one thick, neat plied green yarn cord that curves to the base of the bowl. The left half of the strands is loose and airy, the right half tightly plied.
>
> Setting: a tiny cosy kitchen corner. The tabletop is warm honey-brown rib knit like wood grain. The back wall is cream stockinette knit that fades upward into a smooth, stitchless stretch of felted cream wool across the top quarter of the frame.
>
> Yarn: DK-weight wool throughout.
> - Pouch: tight crochet in glossy-looking deep green, shaped as a stand-up pouch with a resealable top that is closed and not torn. It carries a big yellow intarsia wordmark and a yellow crocheted bear face at top right. The bottom line is in yellow.
> - Daily pack: small, flat and crocheted in deep green.
> - Gummies: small, soft, matte, opaque deep-green crocheted bears, about thumbnail height, stuffed firm.
> - Bowl: crocheted in warm cream.
>
> Light: soft window daylight from the left, gentle shadows.
>
> Camera: eye level, close-up of the product and bowl, shallow focus so the set reads miniature. The loose strands at left soften slightly out of focus. The top 24% stays an empty, evenly lit cream felted area. The bottom 14% stays plain and dark for a colour band added later.
>
> Label lines on the pouch: "Sprout" (large) and "28 Daily Packs" (bottom).

**Avoid field:** human skin, hands, people, faces, photograph, plastic toy, clay, knitting needles, hands of a maker, cartoon character, partner logos, extra text, torn pouch, belly, body, white burst.

## 5. Post words
- **Primary text:** Done with chalky fiber powders? Sprout packs 6g prebiotic fiber, plus 21 vitamins & minerals, into a small handful of Low Sugar gummies, and supports digestion and gut health.
- **Headline field:** 6g fiber you'll actually eat
- **Button:** Shop Now

## 6. Edit step
**1. Real label overlay**
- Cut the real Low Sugar pouch out of the front photo and lay it over the crocheted pouch. Match its angle and add a soft shadow, so "Sprout", the bear face and "28 Daily Packs" are exact.
- Do the same for the daily pack, from a real pack photo.
- Make sure there is no Sugar-Free white burst.

**2. Words**
- Headline and small line go on the felted cream quiet area, top left, with 64 px side margins.
- Fill the band at the bottom with solid #002C17. Put the offer at left in cream #FFF7DF and the button at right as a kelly green #007E40 pill with cream text.

**3. Contrast**

| Pairing | Ratio | Result |
|---|---|---|
| #002C17 on #FFF7DF (headline, small line) | about 14:1 | Pass |
| #FFF7DF on #002C17 (offer) | about 14:1 | Pass |
| #FFF7DF on #007E40 (button) | about 4.8:1 | Pass |

No word sits on stitches.

**4. Offer**
- Check the price and terms against the live site on the day the ad runs. Discounts on the site change often.

**5. Making the picture**
- **ChatGPT or Gemini:** Paste the prompt in and ask for the picture. Free plans have tight daily limits. Nano Banana in Gemini can take your three pouch photos as references.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** Save an `OPENAI_API_KEY` or `GEMINI_API_KEY`, and the prompt can be sent to that image API. Each picture is billed.

## 7. Checks missed
- Product true shape: the crocheted pouch and daily pack are unchecked against your photos, which I couldn't see. Check them in the overlay.

## 8. MISSING
- MISSING: product photos (front, side, top). They were named but not visible here, so the pouch match still needs checking.
- MISSING: the daily pack's look and label words. Deep green is `inferred` from the pouch.
- MISSING: an exact colour code for the pouch's deep green and its yellow wordmark. The prompt uses plain colour names.
- MISSING: grams of sugar in Low Sugar. It is needed before any "Low Sugar" line answers the "upset my stomach" doubt.
- MISSING: the offer's end date.
```
