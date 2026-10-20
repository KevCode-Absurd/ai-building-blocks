# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, honest price ad that answers the price doubter's two doubts with both prices side by side, every number traced to the brand file and the SMS condition kept beside the $29.99. The owner gets a ready-to-build plan with a sensible launch checklist; the only soft spot is that the ad never names Low Sugar, though the $29.99 first price applies to that variant only.

## Judge list

- Met: One-sentence argument; picture and every line argue the same thing
  "$29.99 first box. $49.99 after." / "No guessing: after your first box, Sprout is $49.99 every 4 weeks." / "$49.99 after box one"
- Met: Ad type's proof is in inputs; ruled-out types each have a reason
  Checked fact built on brand-file price table; "Ruled out: The offer: P1 and S1 already run it... Their words: the 20 reviews are not in the message"
- Met: Image headline 7 words or fewer, at most three other things to read
  "Headline: $29.99 first box. $49.99 after. (5)" plus exactly three other lines, 19 words total
- Met: Every character count shown and within limit
  First line (66), headlines (20), (24), (26); counts verified correct
- Met: Customer quotes word for word, sourced, never beside a face
  No customer quotes used; reviews correctly reported as not received
- Met: Offer in exact words; anything unbackable listed as MISSING
  Footer SMS wording and "This policy applies only to your initial purchase" quoted; cancel phrase and reviews listed under MISSING

## What went in

```text
Business facts: Sprout brand file (pasted: products, prices,
offers, fine and risky claims, buyers, voice, look)
Customer research: all 20 reviews (pasted)
Buyer: the price doubter. Knows the brand, maybe from a store
shelf, thinks it costs too much. Doubts: "Which discount is
real?" "Will the price jump after the first order?"
Offer: Sprout Original, Low Sugar. $29.99 first box with the
text sign-up, then $49.99 every 4 weeks ($1.78/day, site's
figure). 30-day money-back, first order only. "Pause Or Cancel
Any Time."
Plan: words on the image and feed copy. One ad, 4:5.
Photos: pouch on gradient (1), gummies in a palm (2).
Other ads in the batch: P1 image "'Sprout is too expensive':
here's 61% off to prove otherwise"; S1 image "Trusted by 1M+:
Take 61% OFF".

[attached: sprout/brand.md]
```

## What came out

```text
## Ad 1: Both prices, out loud

Argument: The price doubter should start a Sprout Original subscription because the site states both prices up front: $29.99 for the first box with the text sign-up, then $49.99 every 4 weeks for 28 packs ($1.78/day).

Buyer: The price doubter. Knows Sprout, maybe from a store shelf, and thinks it costs too much. | Ready | Question: Can I believe it? (named doubts: "Which discount is real?" "Will the price jump after the first order?")

Claim: $29.99 for the first box with the text sign-up, then $49.99 every 4 weeks for 28 packs, which is $1.78/day (source: brand file, Prices and offers table, Sprout Original Low Sugar 28 packs, captured late Sept to mid Oct 2026. The SMS condition comes from the footer small print. $1.78/day is the site's own figure, and $49.99 ÷ 28 = $1.785.)
- Facts considered for the "because":
  - "up to 61% off" was rejected. The site shows several different percentages at once.
  - 30-day money-back was kept for the feed copy. It is first order only.
  - 6 g fiber was rejected. It doesn't answer the price doubt.
  - $1.78/day was kept as the second read.
  - The two prices side by side were chosen. They answer both doubts, and no rival can say them word for word.

Offer:
- **What you get:** Sprout Original, Low Sugar, 28 daily packs every 4 weeks.
- **Today:** $29.99 for the first box with the text sign-up discount. Footer wording: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- **After:** $49.99 every 4 weeks ($1.78/day).
- **Guarantee:** 30-day money-back. "This policy applies only to your initial purchase."
- **Stopping:** "Pause Or Cancel Any Time." (wording as you supplied it)
- **Action:** Shop now.

Code: Checked fact · Designed · Ready | Skeleton: Big type | Size: 4:5 (1440 x 1800)

Ruled out:
- **The offer:** P1 and S1 already run it, both on "61% off". The store also shows 49%, 52%, 55%, 58% and 61% at once, so no percentage can go in this ad.
- **Their words:** the 20 reviews are not in the message. A quote has to be exact and sourced.
- **The occasion:** the birthday price cut has no end date ("indefinitely").
- **What is it? / Is it for me? types:** this buyer already knows the product.

### Picture and layout
Picture must show:
- Both prices, set in the same size and weight. The later price must not be shrunk.
- What the number counts (28 packs, every 4 weeks) right beside it.
- The real closed adult Low Sugar pouch, small, with a few gummies in front.

Reading order: picture (the price block plus the pouch), then the first read (both prices), then the second read (28 packs every 4 weeks, $1.78/day), then the third read (Pause Or Cancel Any Time).

Zones, 4:5 at 1440 x 1800:
| Height | What sits there |
|---|---|
| 0–8% | Empty cream top margin. |
| 8–50% | First read. "$29.99 first box." on line 1 and "$49.99 after." on line 2. Chunky display font, about 190 px, deep forest green #002C17, left-aligned with a 6% side margin. "with text sign-up" sits directly under "$29.99" at 48 px, Work Sans medium. This block is the main element, about 42% of the frame. |
| 50–60% | Second read. "28 packs every 4 weeks ($1.78/day)" at 64 px, Work Sans bold, forest green #00582D. |
| 60–92% | Pouch from photo 1 in the right 45%, about 28% of frame height, with a few gummies scattered in front. Left 50% is empty cream. The third read "Pause Or Cancel Any Time." sits there at 48 px, kelly green #007E40, aligned to the pouch's mid-height. |
| 92–100% | Empty margin. |

Photos needed:
- Photo 1 (pouch on gradient) is the only product source.
- Photo 2 (gummies in a palm) is not used. The product stays small in this type.
- MISSING: a photo confirming which pouch in photo 1 is the Low Sugar adult Original. The Sugar-Free pouch has a white burst and must not be used.

### Words on the image (19 words)
Headline: $29.99 first box. $49.99 after. (5)

Other:
- with text sign-up (3), placed under $29.99
- 28 packs every 4 weeks ($1.78/day) (6)
- Pause Or Cancel Any Time. (5)

All type is 48 px or larger on the 1440 px canvas.

### Feed copy
First line: No guessing: after your first box, Sprout is $49.99 every 4 weeks. (66)

Rest:
- Your first box is $29.99 with the text sign-up discount for new customers.
- That's 28 daily packs. From box two it's $49.99 every 4 weeks, which the site puts at $1.78 a day.
- Pause Or Cancel Any Time. Our 30-day money-back guarantee covers your first order only.
- Rip. Tip. Enjoy.

Headlines:
- $49.99 after box one (20)
- $1.78 a day from box two (24)
- Know the price after box 1 (26)

Description: none. Price and terms stay in the image and the primary text.

Button: Shop Now

### Image prompt
I can't draw pictures here, so this is the prompt to paste into an image tool.

4:5 image, 1440 x 1800, for a feed ad.
- **Background:** a flat, bright, warm cream (#FFF7DF), with a soft gradient into pale sunflower yellow toward the lower right. Sunny, candy-like, never clinical.
- **Product:** use reference photo 1 as the pouch. Keep its glossy deep-green stand-up foil shape, yellow wordmark, yellow bear face top right, "28 Daily Packs" at the bottom, colours and label exactly as photographed. The pouch is closed and upright, with the resealable top intact. It is never torn and never opened at the side or bottom.
- **Placement:** put the pouch in the right 45% of the frame, between 60% and 92% of the height, filling about 28% of the frame height.
- **Props:**
  - about eight small opaque, soft-matte deep-green gummy bears (thumbnail height) scattered on the surface in front of the pouch
  - a small white ceramic dish holding a few more of the same bears
  - the corner of a folded sunflower-yellow cotton napkin at the lower right edge
- **Light and shadow:** soft daylight from the upper left, gentle short shadows.
- **Angle:** camera slightly above eye level, straight on.
- **People:** none, no hands, no children.
- **Empty space:**
  - the top 60% of the frame must be completely empty cream, for type to be added later
  - the left half between 60% and 92% stays empty too
- **No text:** render no text, letters, numbers, logos or badges anywhere except what is printed on the pouch itself.
- **Nothing else:** no partner brands, no cartoon characters, no other products.

Set all words afterwards in Canva:
- Fonts: chunky display font for the prices, Work Sans for the rest.
- Run the blur check: the price block should read as the biggest shape, the pouch second.

To finish it:
- **ChatGPT or Gemini:** paste this prompt and ask for the picture (GPT Image or Nano Banana). Free plans have tight daily limits.
- **Higgsfield:** paste it into its image tool.
- **Claude Code:** with OPENAI_API_KEY or GEMINI_API_KEY saved, the prompt can be sent to that API and the file saved. Each picture is billed.

### Proof and gaps
**Sources**
- Brand file prices table: $29.99 first order, $49.99 every 4 weeks, $1.78/day, 28 packs.
- Footer SMS small print.
- FAQ guarantee wording: "This policy applies only to your initial purchase."
- Brand voice line "Rip. Tip. Enjoy."
- Product look rules: pouch never torn, no partner marks.

**Inferred**
- The buyer's awareness level (Ready) comes from your description. The review text did not arrive, so the ad is a test.

**Against the batch**
- P1 and S1 both argue a percentage off (61%). P1 is the offer, aimed at the price doubter. S1 is the offer or social proof.
- This ad is Checked fact · Designed · Ready and argues the renewal price stated plainly, with no percentage.
- It tests whether showing the price after box one wins more of the price doubters than percent-off does.
- The batch's dress codes weren't given, so I couldn't prefer the least-used dress.

**MISSING**
- customer research: the 20 reviews say "pasted" but none came through.
- source: the exact phrase "Pause Or Cancel Any Time." is not in the brand file. Its wording is taken from your message.
- photo: confirmation that photo 1 is the Low Sugar adult pouch.
- fact: grams of sugar in Low Sugar.

**Check before launch**
- **First-order price conflict.** The how-it-works page shows a first order of $45.33 ("GET 49% OFF"), while the product page and the birthday banner say $29.99. Confirm what a new customer sees today, with and without the SMS sign-up.
- **Birthday banner vs footer.** The banner says "Subs Now Start at $29.99… indefinitely", but the footer limits $29.99 to the SMS discount. Make sure the ad's "with text sign-up" matches the live checkout.
- **Prices are dated.** They were captured Sept to Oct 2026, so recheck $29.99, $49.99 and $1.78/day on the day of launch.
- **Cancel wording.** "Pause Or Cancel Any Time" must match the site exactly. Cancelling is the loudest complaint on review sites, so add nothing beyond it.
- **Other batch ads.** P1 and S1 lean on "61%", which is one of five conflicting discount figures, and S1's "Trusted by 1M+" has no source in the brand file.
- **FDA line.** The brand's ads don't carry the FDA line the site footer has. Check whether this placement needs it.

### Checks missed
CHECKS MISSED:
- The Checked fact type asks for a source line beside the number. The image names what the number counts (28 packs, every 4 weeks) but not where the price comes from ("sprout.example"); that was dropped to stay near 20 words.
- The 20 reviews never arrived, so the claim couldn't be tested against buyers' own words.
- Batch dress codes are unknown, so the least-used-dress rule wasn't applied.
- The blur check is described for the layout but can't be run until the image and type exist.
```
