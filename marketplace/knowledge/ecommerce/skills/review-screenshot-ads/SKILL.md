---
name: review-screenshot-ads
description: "Builds testimonial and review-screenshot ads only from verified buyer reviews: picks 6 to 10 reviews that each answer one buying objection, records each one's source, order match and permission, lays them out as review cards, screenshot-style ads and review walls, and applies strict edit rules (trim only, never reword, show name, date and source). Covers the US fake-review rule, UK and EU consumer and advertising rules, typical-results disclosure and how to ask customers for permission. Use when the store has real reviews and wants proof-led ads, or before reusing a review someone found online."
---

# Ads made from real reviews

**You get:** a review evidence log of 6 to 10 approved reviews (source, order match, permission, objection answered), plus 4 to 6 finished ad specs (review card, screenshot-style, review wall, quote-on-product) with exact words, layout and placement sizes, ready to build and run once the client approves.

## When to use

- The store has a few hundred real reviews and its ads carry little proof.
- Buyers hesitate on one or two clear doubts (fit, taste, does it work, is it worth the price) that reviews already answer.
- A team member wants to use a review from Instagram, Amazon or a DM in an ad.
- A competitor runs review-led ads and the store wants a rule-safe version of its own.

## Not for

- Finding angles in reviews: use `mine-ad-angles-from-reviews`.
- Writing ad copy around reviews: use `write-review-based-ad-copy`.
- Video testimonials: use `customer-testimonial-videos`.
- Collecting more reviews: use `build-review-collection-system`.
- Reposting a customer's photo or video post: use `repost-customer-content-with-rights`.

## What you need

Required:

1. **Reviews export** from the review app (Judge.me, Loox, Okendo, Yotpo or Shopify Product Reviews): review id, product, rating, title, body, reviewer name, email, date, verified flag, photo or video URL. The review platform must be the store's own or a named marketplace.
2. **Shopify orders export** (Name, Email, Created at, Lineitem name) to match each review to a real order.
3. **Objection list:** top reasons people do not buy, from support tickets, post-purchase surveys or returns. If none exists, take it from 3-star reviews.
4. **Product claims profile** (`product-claims-profile`) so no review is used to sneak in a claim the store cannot make.

Optional: past ad results by proof type, reviewer photos at full size.

Read access is enough. Emailing customers for permission is a message to customers, so drafts go to the client and are sent only on their yes.

## Before you start: the gates

1. **Gross profit per order is known** for the product the ads sell [MEA-0037]. Fail: compute it first; proof ads still need a product worth pushing.
2. **Every review is real and verifiable.** Pass: it matches an order in the export, or carries the platform's verified-buyer flag. Fail: the review is not used. Fake or AI-made reviews and testimonials, undisclosed staff reviews and suppressing bad ones are banned in the US [MCR-6045].
3. **Permission is on file** for any review shown with a name, face or photo outside the review widget. Pass: the reviewer agreed in writing (email reply, form tick) or the review app's terms grant marketing use and the store has checked them. In the UK and EU, data protection law expects the reviewer's consent before a name or photo is used in ads, and the CAP Code asks that testimonials be genuine and backed by proof on request. Fail: ask, or use first name and initial with no photo only if the app's terms allow it.
4. **The claim inside the review is allowed.** A review saying "cured my eczema" cannot be used for a cosmetic. Fail: skip that review.

## Steps

### 1. Map objections to reviews

For each top objection, search the export for reviews that answer it in the buyer's own words. Keep the exact quote; do not paraphrase at the research stage [AVT-0007]. Pick one review per objection, so a five-objection product carries five different reviews [LPG-0053]. Prefer:

- reviews that name the doubt and then resolve it ("I thought it would be too small, but...");
- reviews with a photo that shows the claim (fit on a body, texture, size in hand) [LPG-0062];
- reviewers who look like different buyer groups, from what the review says, not from guessing.

### 2. Verify and log

For each pick, fill the evidence log: review id, source, order number match, date, rating, permission status, objection answered, and any claim in it with its status in the claims profile. Screenshot the review in place on its platform, with the URL and date, and keep the screenshot.

### 3. Edit rules: trim only

- You may cut words from the start or end of a review and mark cuts with "...".
- You may fix nothing else: no spelling fixes that change meaning, no merged reviews, no new words.
- The trimmed quote must keep the reviewer's meaning. If the full review says "great taste but it upset my stomach", the ad cannot show "great taste" alone. A reviewer is not liable for a marketer's misleading changes, which means the store is [MCR-6025].
- Keep the star rating the reviewer gave. Never show five stars on a four-star review.

### 4. Typical results

If a review reports a standout result (lost 8 kg, sold out in a day, hair grew back), the ad must also say what most buyers can expect, or the review is not used. The US guidance says an ad showing results that are not typical must disclose the generally expected results [MCR-6025]. If the store has no data on typical results, pick a review that describes the experience, not a number.

### 5. Choose formats

| Format | Best for | Layout |
|---|---|---|
| Review card | one objection, cold buyers | stars, quote in large type, first name and initial, "Verified buyer", product photo |
| Screenshot-style | proof that looks unedited | a clean rebuild of the review app's look, or a real screenshot; never a fake app or fake platform interface |
| Review wall | many small doubts | 4 to 6 short quotes in a grid, each with stars and name |
| Quote on product | premium brands | product photo, one short quote, small attribution |
| Customer photo plus quote | fit, size, texture | the reviewer's own photo, with permission |

Show reviewer name, photo and source; anonymous reviews and bare logos now read as fake [LPG-0037]. "Verified buyer" appears only when the platform or order match proves it.

Never fake a third-party interface, such as a made-up Amazon, Google or Trustpilot screen, or imply a platform rating the store does not have. If a review came from Amazon, say "Review on Amazon" and link nothing that suggests Amazon endorses the ad.

### 6. Write the specs

For each ad: format, review id, the exact trimmed quote, attribution line, star count, headline (if any, outside the quote), visual, placement sizes. Headline words must be the store's, not dressed as a quote. Hand sizes to `resize-ads-for-every-placement`.

### 7. Ask for permission the right way

Draft a short email or WhatsApp message for the client to send: what review, where it will appear (ads on Meta, Google, site), how long, how the name will show, and an easy yes or no. No discount or gift in exchange for a positive review; any thank-you gift goes to every reviewer whether they agree or not, and is disclosed if the review was given in return for something [MCR-6045]. Record the reply in the log.

### Market notes

- **UK and EU:** the CAP Code and the EU consumer rules ask that claims be truthful and provable on request, that testimonials be genuine and held on file, and that references to a person have their permission. In every market, for health, beauty and food claims, a review cannot make a claim the product is not allowed to make. WhatsApp permission messages go only to customers who opted in to WhatsApp from the store.
- **US:** the FTC rule on reviews (16 CFR Part 465) applies to ads, emails and the site [MCR-6045]. Keep the evidence log for as long as the ad runs, and longer.

## Checks before you hand it over

- Every review in an ad matches an order or a verified-buyer flag, with a dated screenshot.
- Written permission is on file for each name, face or photo used outside the review widget.
- Quotes are trimmed only, cuts are marked, meaning is unchanged and the star count is the reviewer's own.
- Each ad answers one named objection.
- Standout results show the typical result, or the review is not used.
- No fake platform interface and no "verified" label without proof.
- No review makes a claim the claims profile bans.
- No reviewer was paid or rewarded for a positive review.

## Output

**One-screen summary:** objections covered, reviews chosen, permissions still pending, ads ready, and any review that was rejected and why.

**Review evidence log:**

| Review id | Product | Rating | Exact quote (trimmed) | Full review link and screenshot | Order match | Date | Permission (how, when) | Objection answered | Claim check |
|---|---|---|---|---|---|---|---|---|---|

**Ad specs:**

| Ad | Format | Review id | Quote on image | Attribution line | Stars | Headline | Visual | Sizes | Typical-result line |
|---|---|---|---|---|---|---|---|---|---|

**Permission message draft:** subject or first line, the quote, where it will appear, duration, how the name shows, reply options.

## Common mistakes

- **Polishing the quote.** Step 3 allows trimming only and keeps the meaning.
- **Five reviews that all say "love it".** Step 1 picks one review per objection.
- **"Verified" on everything.** Step 2 checks each review against an order.
- **Standout results with no context.** Step 4 adds the typical result or drops the review.
- **Fake platform screenshots.** Step 5 rebuilds only the store's own review look, or uses a real screenshot.
- **Asking for permission with a discount.** Step 7 keeps thank-yous separate from the review's tone.

## Sources

- MCR-6045: fake, AI-made, insider and suppressed reviews are banned in the US.
- MCR-6025: honest opinion; disclose typical results; marketer edits are the marketer's risk.
- LPG-0053: one testimonial per objection.
- LPG-0037: show reviewer name, photo and source; anonymous reads fake.
- LPG-0062: claim-matching photo reviews matter more than count past about 80.
- AVT-0007: keep exact buyer words.
- MEA-0037: gross margin is the delivered cost to the door.

What makes this skill ours: each review is matched to a real order and logged with a dated screenshot before design starts; the edit rule is trim-only with meaning kept; standout results need the typical result beside them; and permission is asked without any reward tied to a positive review.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. The ASCI Code (Chapter I, point 3) asks for permission to refer to a person and for proof of claims on request.
