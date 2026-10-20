# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, well-structured audit that catches the real problems in this ad (the health question opener, the 61% and gifts mismatch, the missing SMS and renewal terms) and rates each at the right severity. It invents nothing, uses MISSING where only the owner can choose, and correctly treats the image as unseen, so the owner can act on it straight away.

## Judge list

- Met: Every finding quotes the exact line or points to the exact spot.
  "Main text: 'Feeling off in your gut lately?'", "Headline: 'Fix the Hot Girl Tummy'", "On-image text: 'up to 61% OFF'", "Ad set: target age not set yet"
- Met: Nothing that depends on targeting or the landing page is rated "would reject".
  Findings 4, 5, 6: "This rests on the landing page, so it is rated a warning." Finding 2 is "Needs a restriction".
- Met: The fixes remove the problem. None of them hides a claim in code words, misspellings or symbols.
  "Cut the question", "MISSING: new headline, the owner writes it", "Use the one discount checkout really gives (owner's choice, marked MISSING)"
- Met: Groups that don't apply to your ad aren't padded in.
  Findings stay in personal attributes, health and wellness, commercial practices/relevance; PASSED is a once-over scan as step 1 directs, no invented findings.
- Met: The score's sum matches the findings, and the rewritten ad adds no new claim or offer.
  "100 - 40 (1 would reject) - 15 (1 needs a restriction) - 20 (4 warnings x 5) = 25"; rewrite adds only page-copied SMS and renewal terms.
- Met: The note about checking Meta's live policy page is there.
  "not Meta's decision. Check the live policy page (transparency.meta.com/policies/ad-standards) before relying on it."

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
VERDICT  likely rejected
Main reason: The main text opens by asking about the viewer's gut health, and the offer on the image ("up to 61% OFF + 4 FREE gifts") does not match the product page.

COMPLIANCE SCORE
Now: 100 - 40 (1 would reject) - 15 (1 needs a restriction) - 20 (4 warnings x 5) = 25
After the fixes: 100 - 0 = 100 (every finding can be cleared once the owner fills the MISSING choices)

FINDINGS
1 Privacy and personal attributes | Main text: "Feeling off in your gut lately?" | Would reject
  The opening question says or implies the viewer has a health issue (their gut). The rule's own examples, "Do you have diabetes?" and "Tired of your acne?", are rejected for the same reason.
  Fix: Cut the question. Start with the line that describes the product: "Sprout supports digestion with 6g of fiber..."

2 Health and wellness (restricted): 18+ | Ad set: target age not set yet | Needs a restriction
  Sprout is a supplement, so the ad must run only to people 18 and over.
  Fix: Set the ad set's age to 18+.

3 Health and wellness: sensational result with no qualifier, remark on bodies | Headline: "Fix the Hot Girl Tummy" | Warning
  "Fix" promises a result with no qualifier and no time frame. Pairing the tummy with "Hot Girl" ties the problem to how a body looks. A reviewer could read the headline as a result promise or as a comment on bodies.
  Fix: Replace the headline. No line already in the ad can stand in, so the owner writes it (see the rewrite).

4 Prohibited commercial practices (and Relevance): price or discount the shop doesn't charge | On-image text: "up to 61% OFF" | Warning
  The product page shows 52% in the bar and "up to 55%" in the badge. 61% appears nowhere on the page. This is rated a warning only because it rests on the landing page, which sits outside the ad. Against the page you gave, the figure does not match, and fixing it is the top priority.
  Fix: Use the one discount checkout really gives (owner's choice, marked MISSING).

5 Prohibited commercial practices (and Relevance): "free" gift the shop doesn't give | On-image text: "+ 4 FREE gifts" | Warning
  The product page shows no gifts. This rests on the landing page, so it is rated a warning.
  Fix: Remove the gift claim unless the gifts really ship with this offer and appear on the page (owner's choice, marked MISSING).

6 Prohibited commercial practices: subscription terms not shown before purchase | On-image offer, with no terms beside it | Warning
  The page shows the discount only applies with the SMS sign-up, and the subscription renews at $49.99 each 4 weeks. The ad shows neither. This rests on the landing page, so it is rated a warning.
  Fix: Put the page's terms beside the offer, copied word for word: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." and "Renews at $49.99 each 4 weeks."

RESTRICTIONS TO SET OUTSIDE THE AD
- Age: 18+ (supplement, under Health and wellness).
- Countries: MISSING: target countries not set. Leave out any country where this supplement or its claims are not allowed.
- EU: if the ad runs in the EU, fill in the payer and beneficiary fields.

THE AD WITH THE FIXES IN
Format: Facebook image ad
Image: the pouch on a soft green gradient, gummies in front (unchanged)
On-image text [CHANGED]: "MISSING: the real discount checkout charges (the page shows 52% in the bar and up to 55% in the badge; the owner picks one)" + "MISSING: whether 4 free gifts exist on this offer; cut this part if they don't"
On-image terms [CHANGED, added beside the offer, copied from the page]: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only." "Renews at $49.99 each 4 weeks."
Main text [CHANGED, opening question cut]: Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins to help keep your gut balanced without powders or prep.
Headline [CHANGED]: MISSING: new headline, the owner writes it (no promise to fix a condition, no remark about bodies or looks)
Button: Shop now (unchanged)

PASSED
- Suicide, self-injury and eating disorders: no weight before-and-after and no body images in the described picture.
- Adult nudity and sexual content: the described image shows only the pouch and gummies.
- Profanity, bullying, violence, hateful conduct: none in the words.
- Misinformation and vaccine discouragement: no cure or anti-vaccine claim.
- Other restricted goods: no claim to treat or cure a disease. The ad does not present the supplement as a medicine once the headline is replaced.
- Format rules: no lead form, and not a video.

COULD NOT CHECK
- The image itself: only a description was given. Not checked: which flavour pouch is shown, any small print, and any other text in the picture. If the pouch is the cartoon-movie tie-in flavour, Intellectual property applies and the partner's written OK is needed for every mark shown.
- "6g of fiber": not on the product page text you gave. Check it against the nutrition label.
- Checkout price and whether the 4 gifts exist: the product page text only, not the checkout.
- Target countries (Locally illegal) and the age setting: not set yet.
- The ad link: whether it goes to sprout.example/products/sprout and nowhere else (Business assets and data).
- No proof-and-claims.md, so banned or pending claims from your own list were not checked.

This is a reading of Meta's published Advertising Standards, not Meta's decision. Check the live policy page (transparency.meta.com/policies/ad-standards) before relying on it.

Would you like to plan what to test next with the Ad test brief writer (https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this audit report.
```
