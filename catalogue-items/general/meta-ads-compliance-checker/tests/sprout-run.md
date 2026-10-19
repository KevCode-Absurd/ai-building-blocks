# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 3 of 5 met. Invented facts: 2.

The output is a useful, well-sourced check that catches the main issues: the health-implying opener, the 61% vs 52/55% mismatch, the unshown gifts and the subscription terms. It marks missing target age and countries correctly, but the 'Likely rejected' verdict leans on a judgement call and the Passed list is padded.

## Fix

In Step 6 and the 'Check before you hand it back' list, add: list only groups that plausibly apply to this ad in Passed, and justify a 'Likely rejected' verdict only from breaches visible in the ad itself.

## Judge list

- Met: Every finding quotes the exact line or points to the exact spot.
  Findings cite 'Feeling off in your gut lately?', 'Fix the Hot Girl Tummy', 'up to 61% OFF', '+ 4 FREE gifts'.
- Not met: Nothing that depends on targeting or the landing page is rated "would reject".
  Verdict 'Likely rejected' rests on finding 1 'Would reject'; the main reason also cites the landing-page discount mismatch. The 'Fix' headline is rated Warning only.
- Met: The fixes remove the problem without hiding a claim in code words or symbols.
  Fix: 'Drop the question and describe the product instead'; headline fix is report-only, no code words.
- Not met: Groups that don't apply aren't padded in.
  Passed lists Suicide/eating disorders, nudity, profanity, misinformation, restricted goods, format rules, which are mostly irrelevant padding for a supplement ad.
- Met: The note about the policy date and checking Meta's live pages is there.
  'as of 19 October 2026... check the live page before relying on any finding.'

## Invented

- claim: Meta's own example, where "Tired of your acne?" breaks the rule (This example is in the skill's add-on, so it is fine, though it is presented as Meta's own example.)
- claim: Meta requires subscription terms to be clearly shown before purchase (This is in the skill's rule table, so it is not invented.)

## Safety

- Finding 1 is rated 'Would reject' for 'Feeling off in your gut lately?' This is a defensible reading, but it is a judgement call that the output presents as a firm rejection.

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
**Verdict:** Likely rejected.
**Main reason:** The opening line "Feeling off in your gut lately?" implies the viewer has a health problem, which Meta's privacy and personal attributes rule bans. The discount and gift offer also don't match the landing page.

---

## Findings

**1. Privacy and personal attributes: implying the viewer's health**
- **Where:** Main text, first line: "Feeling off in your gut lately?"
- **Problem:** The question tells the viewer they have a digestive health issue. This matches Meta's own example, where "Tired of your acne?" breaks the rule.
- **Seriousness:** Would reject.
- **Fix:** Drop the question and describe the product instead. The rest of the sentence already does this: "Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins…"

**2. Health and wellness, and privacy and personal attributes: the headline**
- **Where:** Headline: "Fix the Hot Girl Tummy"
- **Problems:**
  - "Fix" frames a digestive symptom as something the supplement corrects, which edges toward a treatment claim.
  - "Tummy" can be read as a remark about how a stomach looks, which edges toward a body put-down.
  - "Hot Girl" may be read as addressing the viewer's gender and body.
- **Seriousness:** Warning. A reviewer could read it either way.
- **Fix:** Report only. Whether to keep this hook, and what claim replaces it, is the owner's decision. Any new wording should stay within claims the brand can support and should not describe the viewer or their body.

**3. Prohibited commercial practices, and relevance: discount not matching the shop**
- **Where:** On-image text: "up to 61% OFF"
- **Problem:** The landing page shows three other figures:
  - The announcement bar says "Save 52% + free shipping on your first order".
  - The badge says "GET UP TO 55% OFF".
  - The pop-up says "55% Off".

  None of them say 61%. The page footer also says the $29.99 price "assumes customer has received and uses promotional SMS discount", which the ad doesn't mention.
- **Seriousness:** Warning. Because this depends on the landing page and checkout, it can't be "would reject" on its own. A reviewer comparing ad to page may still treat it as a breach.
- **Fix:** Put the discount the shop actually charges at checkout on the image, along with any condition such as the SMS sign-up. The owner needs to confirm which figure is real.

**4. Prohibited commercial practices, and relevance: free gifts not shown on the page**
- **Where:** On-image text: "+ 4 FREE gifts"
- **Problem:** The product page shows no gifts.
- **Seriousness:** Warning. It depends on what checkout actually delivers.
- **Fix:** Remove "4 FREE gifts" unless every buyer from this ad receives them. If they do, show the gifts on the landing page.

**5. Prohibited commercial practices: subscription terms**
- **Where:** The ad itself shows an offer with no mention of a subscription. On the landing page, "Renews at $49.99 each 4 weeks" appears only in small print under the button. The page note says Subscribe & Save is selected by default, but that was inferred, not seen.
- **Problem:** Meta requires subscription terms to be clearly shown before purchase. The ad's discount only applies to the first box, and the renewal price sits apart from the offer.
- **Seriousness:** Warning. It depends on the landing page and checkout.
- **Fix:**
  - On the page, put the renewal price and how to cancel beside the $29.99 offer, not only under the button.
  - Consider stating in the ad that the discount is on the first subscription box.

---

## Restrictions to set outside the ad

- **Age: set 18+.** Sprout is a supplement, so the health and wellness rule requires it. `MISSING: target age` (not set yet).
- **Countries: decide and check each one for local rules.** `MISSING: target countries` (not set yet).
- **EU fields: fill in payer and beneficiary** if the EU is included.

---

## Passed

- **Suicide, self-injury and eating disorders:** No weight before-and-after images, no thin-body imagery, no extreme dieting.
- **Adult nudity and sexual content:** The image is a pouch and gummies on a gradient. "Hot Girl" is not sexual content in itself.
- **Profanity, bullying, violence, hateful conduct:** None found.
- **Misinformation:** No miracle cure or debunked claim. The "Fix" wording is covered under finding 2.
- **Other restricted goods (drugs):** The ad presents a daily supplement, not a medicine. The only edge is "Fix", in finding 2.
- **Intellectual property:** This ad shows only the Sprout pouch, with no tie-in characters or other brands' marks.
- **Format rules:** It is an image ad, with no lead form and no video.

---

## Could not check

- **The "6g of fiber" claim:** The product page doesn't state a fiber amount; only inulin is listed. `MISSING: proof-and-claims.md` and the nutrition label.
- **Checkout:** The actual price charged, whether the 61% and the gifts are honoured, and whether the subscription is pre-selected. The landing page was read 13 Oct 2026, and the default selection was inferred, not seen.
- **Advertiser name and Page:** Needed for the relevance check.
- **Refund terms:** The ad doesn't mention them, so there is no conflict in the ad. Note that the page's guarantee covers the first order only.
- **Business assets:** Link destination, cloaking and account status.
- **Locally illegal content:** Can't be checked until countries are set.

---

This is a reading of Meta's published Advertising Standards (transparency.meta.com/policies/ad-standards) as of 19 October 2026. It is not Meta's decision. Meta can change the rules without notice, so check the live page before relying on any finding.
```
