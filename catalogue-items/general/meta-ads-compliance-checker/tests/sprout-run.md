# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 6 met. Invented facts: 3.

The check catches the key problems: the 61% mismatch, the missing gifts, the SMS condition and the missing 18+ setting. But it invents a new headline, adds a new offer line and drifts from the required output shape.

## Fix

In step 7, forbid new headline copy and unrequested offer lines: use MISSING or the ad's existing claim. Also require the output to start with the exact shape headings (VERDICT, COMPLIANCE SCORE, etc.).

## Judge list

- Met: Every finding quotes the exact line or points to the exact spot.
  Findings cite "up to 61% OFF", "+ 4 FREE gifts", "Fix the Hot Girl Tummy", "Feeling off in your gut lately?"; finding 4 points to targeting.
- Met: Nothing that depends on targeting or the landing page is rated "would reject".
  No "would reject" findings; findings 1-3 are warnings, citing landing page dependence.
- Not met: The fixes remove the problem without hiding a claim in code words, misspellings or symbols.
  New headline "Gut support without powders or prep" and the "Cancel anytime" line are fixes that add or swap claims.
- Met: Groups that don't apply to your ad aren't padded in.
  Passed lists only relevant groups; short and applicable.
- Not met: The score's sum matches the findings, and the rewritten ad adds no new claim or offer.
  Says "15 (one needs a restriction) - 5 x 5" but lists 5 warnings and 1 restriction: 6 findings, arithmetic fine. But the rewrite adds "Cancel anytime" as an ad claim.
- Met: The note about checking Meta's live policy page is there.
  "check the live policy page (transparency.meta.com/policies/ad-standards) before relying on it."

## Invented

- claim: "Hot girl tummy" is popular slang for recurring digestive trouble (often used for IBS-type symptoms). (Not in the inputs; the brand file only says it sounds like treating bloating.)
- claim: Gut support without powders or prep (New headline wording; swaps the headline for a different claim.)
- claim: Cancel anytime. (Page does say it under the button, but adding it to the ad copy is a new offer line in the ad.)

## Safety

- Rewritten main text keeps "supports digestion" unchanged while the headline swap introduces a new claim without flagging it as a claim swap.
- Findings 1-2 rate the 61% and fake-gift mismatch only as warnings; a false discount or free gift is a clear prohibited practice if confirmed.

## What went in

```text
Format: Facebook image ad (words from a live Sprout ad)
Image: the pouch on a soft green gradient, gummies in front.
  On-image text: "up to 61% OFF + 4 FREE gifts"
Main text: Feeling off in your gut lately? Sprout supports
  digestion with 6g of fiber, prebiotics, and daily vitamins to
  help keep your gut balanced without powders or prep.
Headline: Fix the Hot Girl Tummy
Button: Shop now
Product: Sprout, daily greens gummies (a supplement).
Landing page: the product page. Bar: "Save 52% + free shipping on
  your first order". Badge: "GET UP TO 55% OFF". $29.99 first box,
  footer: "Offer assumes customer has received and uses
  promotional SMS discount". Under the button: "Renews at $49.99
  each 4 weeks." No gifts shown.
Target age and countries: not set yet.

[attached: sprout/product-page.md]
```

## What came out

```text
**Verdict:** Fix first.
**Main reason:** The "61% off + 4 free gifts" offer isn't on the landing page, and the supplement ad has no 18+ age setting yet.

## Compliance score
- **Now:** 100 − 15 (one "needs a restriction") − 5 × 5 (five warnings) = **60**
- **After the fixes:** 100 − 0 = **100.** Every finding can be cleared by a copy change, a page change or a targeting setting.

## Findings

**1. Prohibited commercial practices (price or discount the shop doesn't charge), plus Relevance**
- **Where:** On-image text, "up to 61% OFF".
- **Problem:** The landing page offers different discounts:
  - the bar says "Save 52% + free shipping on your first order"
  - the badge says "GET UP TO 55% OFF"
  - the sign-up pop-up says "55% Off"
  - other pages show 49% and 58%

  61% appears nowhere on the page. Your page notes say 61% is "the ad that sent you". The ad and the page sell the same product at different discounts.
- **How serious:** Warning. It is rated below "would reject" only because the call depends on the landing page and checkout, which sit outside the ad. On the page you supplied, this is a clear mismatch.
- **Fix:** Show only the discount the checkout actually gives, worded as the page words it. Or change the page to match the ad. The owner picks which number is real.

**2. Prohibited commercial practices ("free" gift the shop doesn't give), plus Relevance**
- **Where:** On-image text, "+ 4 FREE gifts".
- **Problem:** You report "No gifts shown" on the landing page. If the gifts don't exist, or aren't part of the current offer, the ad promises something the shop doesn't deliver.
- **How serious:** Warning. Whether the gifts exist depends on the checkout.
- **Fix:** If the gifts are real, name them on the landing page next to the offer. If not, cut the line.

**3. Prohibited commercial practices (subscription terms not clearly shown before purchase)**
- **Where:** The on-image discount claim, as it lands on the page.
- **Problem:** The advertised saving applies only to the first box of a subscription:
  - It is $29.99, then "Renews at $49.99 each 4 weeks."
  - It also depends on an SMS sign-up. The footer says "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
  - The plan box says "DISCOUNT AUTO-APPLIED", which suggests the opposite.

  Neither the ad nor the area near the button states the SMS condition.
- **How serious:** Warning. This depends on the landing page and checkout.
- **Fix:** In the ad, label the offer as first-box and subscription-only. On the page, move the SMS condition up beside the price and the "DISCOUNT AUTO-APPLIED" line. Keep the renewal price and "Cancel anytime" next to the button.

**4. Health and wellness (supplements run 18+)**
- **Where:** Ad set targeting.
- **Problem:** Sprout is a supplement sold on digestion and health benefits, and the target age is "not set yet."
- **How serious:** Needs a restriction.
- **Fix:** Set the ad set to 18+.

**5. Health and wellness (sensational, unqualified result; leaning toward a supplement presented as a treatment)**
- **Where:** Headline, "Fix the Hot Girl Tummy".
- **Problem:**
  - "Hot girl tummy" is popular slang for recurring digestive trouble (often used for IBS-type symptoms).
  - "Fix" promises to resolve it, with no qualifier.
  - The page's own wording is softer: "Supports digestion and gut health". It also says "Some individuals may notice improvements within days or weeks."
  - "Tummy" can also be read as a remark about how a stomach looks.
- **How serious:** Warning.
- **Fix:** Drop "Fix" and the slang. Use the claim the ad already makes, "supports digestion."

**6. Privacy and personal attributes (implies the viewer's health)**
- **Where:** Main text, first line: "Feeling off in your gut lately?"
- **Problem:** The question tells the viewer they have a digestive health problem. This is the same pattern as "Do you have diabetes?", though milder, since no condition is named.
- **How serious:** Warning.
- **Fix:** Describe what the product does and who it's for, not what the viewer is feeling.

## Restrictions to set outside the ad
- **Age:** 18+ (health and wellness, supplement).
- **Countries:** `MISSING: target countries`. They are needed to check local supplement and claim law. If any EU country is included, fill in the EU payer and beneficiary fields.
- **Landing page:**
  - Make the discount and gift offer match the ad.
  - Move the SMS sign-up condition up next to the $29.99 price.

## The ad with the fixes in

- **Format:** Facebook image ad
- **Image:** The pouch on a soft green gradient, gummies in front. *(unchanged)*
- **On-image text:** `MISSING: the real discount and its terms (e.g. 52% on the first order, or up to 55% on a subscription; first box only; SMS sign-up needed?)` `MISSING: whether 4 free gifts exist. If not, cut "+ 4 FREE gifts"` **[CHANGED]**
- **Main text:**
  - "Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins to help keep your gut balanced without powders or prep." **[CHANGED: opening question removed; the rest is word for word]**
  - "Subscription: first box `MISSING: price and condition, e.g. $29.99 with SMS sign-up`, then renews at $49.99 every 4 weeks. Cancel anytime." **[CHANGED: offer terms added, taken from the landing page]**
- **Headline:** "Gut support without powders or prep" **[CHANGED]**
- **Button:** Shop now *(unchanged)*

## Passed
- **Eating disorders:** no bodies, no before-and-after, no extreme-diet lines.
- **Adult content:** the image is a pack shot only (as described).
- **Intellectual property:** only Sprout's own pouch is described. The movie tie-in flavour and its characters don't appear in this ad.
- **Misinformation:** no miracle cure or debunked claim. The headline over-promise is handled in finding 5.
- **Profanity, bullying, violence:** nothing found.

## Could not check
- **The image itself:** only a description was given. Please attach the image to confirm:
  - the on-image text
  - any small print
  - any tie-in characters or third-party marks
- **"6g of fiber":** the product page text you gave doesn't state a fiber amount. Check it against the nutrition label.
- **Checkout:** the actual price, whether the gifts exist, and whether the discount applies without the SMS sign-up.
- **Targeting:** age and countries aren't set, so local-law and EU-field checks are open.
- **Advertiser name and link:** whether the Page name and destination URL match Sprout.
- **Claims list:** `proof-and-claims.md` wasn't provided, so banned or pending claims weren't cross-checked.

This is a reading of Meta's published Advertising Standards, not Meta's decision; check the live policy page (transparency.meta.com/policies/ad-standards) before relying on it.
```
