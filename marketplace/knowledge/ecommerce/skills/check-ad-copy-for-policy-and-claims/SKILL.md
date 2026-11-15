---
name: check-ad-copy-for-policy-and-claims
description: "Checks every line of an ad (primary text, headlines, descriptions, on-screen text, voice-over, captions, landing page promise) against Meta, Google and TikTok ad rules and against the advertising law in each market where it runs (for example FTC rules in the US, the ASA and CAP Code in the UK, EU consumer law), and returns a line-by-line sheet: the claim type, the risk (block, fix, pass), the evidence on file, the rule it touches, and a safe rewrite that keeps the selling point where the evidence allows. Covers result and health claims, comparisons, prices and 'was' prices, free offers, urgency, reviews and testimonials, personal attributes, AI and creator disclosure. Use before any ad goes live, after a rejection, or when a category has strict rules."
---

# Ad copy policy and claims check

**You get:** a line-by-line check sheet for each ad (every sentence, headline and spoken line), each marked block, fix or pass, with the claim type, the evidence held, the platform rule or law it touches, and a ready rewrite; plus a one-screen summary listing what must change before launch and what needs a lawyer or the client's proof.

## When to use

- Any new ad copy before it is loaded, especially in health, beauty, supplements, baby, finance-like (pay later, EMI) or environmental claims.
- An ad or account was rejected or restricted and the cause is in the words.
- Sale, review, comparison or story ads, which carry legal as well as platform risk.
- Copy translated into another language, before it runs.

## Not for

- The full pre-launch check of hook, clarity, proof, CTA and sizes: use `prelaunch-ad-check` (this skill is its deep claims pass).
- Building a comparison ad and its claims sheet: use `comparison-ads-that-stay-legal`.
- Appealing a rejection or restriction: use `fix-rejected-ads-and-account-restrictions`.
- Legal advice: this check flags risk and points to the rule; a lawyer decides hard cases.

## What you need

Required:

1. **The ad copy**, every field and every spoken line, per platform, with the landing URL.
2. **Proof file**: for each factual claim, the evidence (test report, certificate, review export, sales data, price history), with date. `product-claims-profile` builds this.
3. **Markets**: where the ad runs (US, UK, EU countries, Canada, Australia, other).
4. **Product category** and any licences or certifications.

Optional: past rejection messages, the creator or AI disclosure plan, the offer terms box.

If the proof file is missing, the check still runs: every factual claim without proof is marked "fix: proof needed". Read-only work. Editing live ads needs draft access and the client's yes.

## Before you start: the gates

1. **Every line is in the sheet.** Spoken lines, on-screen text and captions count as ad copy. Fail: get the full script before checking.
2. **The landing page is live** and shows the price, offer and claims the ad makes. A promise the page breaks is bait and switch [ADC-6147].
3. **Out of scope flagged.** Prescription drugs, alcohol, gambling, weapons, adult products, financial services or political issues: stop and send to the client's lawyer and the platform's restricted category process.

## Steps

### 1. Split the copy into claim lines

One row per sentence, headline, caption or spoken line. Mark the field and platform.

### 2. Classify each line

| Type | Example |
|---|---|
| Fact | "100% cotton", "made in Jaipur" |
| Result | "softer skin in 7 days" |
| Health or body | "reduces joint pain", "for acne" |
| Comparison | "better than X", "#1", "best-selling" |
| Price or offer | "49.99" in the store's currency, "was 79.99", "free gift", "buy 1 get 1" |
| Urgency or scarcity | "ends tonight", "only 5 left" |
| Testimonial or review | quotes, "10,000 happy customers" |
| Personal attribute | "Are you overweight?", "Struggling with debt?" |
| Environmental | "eco-friendly", "plastic-free" |
| Disclosure | ad label, paid partnership, AI-made |
| Mechanism | "our patented formula", "unique technology" |
| Opinion or puffery | "the comfiest tee you'll own" |

### 3. Test each type against its rule

**Facts and results.** Verifiable claims need proof the store can produce on demand; research cited in an ad should name its source and date, and regulators such as the FTC in the US and the ASA in the UK expect documentary evidence that backs the exact claim made. No proof: block or rewrite to what the proof says. Obvious humour or hyperbole is allowed; "puffery" stops being safe once it states a measurable result.

**Health and body.** Disease words (cure, treat, heal, prevent, acne, diabetes, eczema) on non-medical products: block. Rewrite to cosmetic or comfort language the evidence supports ("helps skin feel less dry"). Check category rules in each market; supplements and cosmetics carry extra limits. For sensitive health topics, avoid graphic before-and-after imagery; illustration is safer [MCR-0020].

**Personal attributes (Meta).** Meta's Advertising Standards bar copy that asserts or implies a viewer's personal attributes (health, weight, finances, religion and others). "Are you overweight?" fails; "For anyone who wants a lighter breakfast" passes. Check the current Meta standard, as wording changes.

**Comparisons and rankings.** "#1", "best", "best-selling" need current proof for the market and period named. Naming a competitor: send to `comparison-ads-that-stay-legal`. A "unique mechanism" needs a real product difference to stand [AVT-0014].

**Prices and offers.** A "was" price must be one genuinely charged [OFF-6145]. "Free" only if the buyer pays nothing beyond delivery, stated; buy-one-get-one only if the paid item is at its usual price. Prices shown should include charges most buyers must pay: UK and EU rules expect VAT and unavoidable fees in the price shown, and in the US, where sales tax is usually added at checkout, fixed mandatory fees still belong in the price, since hidden add-on fees (drip pricing) are a target for regulators.

**Urgency and scarcity.** End dates must be real and kept. "Only X left" needs stock records for the moment it ran [ADC-6147]. Resetting countdowns: block.

**Reviews and testimonials.** Real buyers only, not altered in meaning, insiders disclosed, no incentives tied to positive reviews [MCR-6021]. Referring to or showing a real person needs their permission; many markets also protect a person's name and likeness. AI avatars may not present a testimonial that is fake [MCR-6021], and AI-made people must never pose as customers; apply each platform's AI disclosure label.

**Disclosure.** Creator and advertorial-style ads must say they are ads; put the label where buyers see it before they engage, at the start of the caption on social media, as both the FTC and the ASA expect it up front.

**Google editorial.** No misused capitals or symbols, gimmicky repetition or spacing, phone numbers in text; the business or product must be named [ADC-6142]. A required disclaimer in a responsive search ad is pinned to a slot that always shows [GAD-6140].

**Environmental.** "Eco-friendly", "sustainable", "biodegradable" need specific proof; rewrite to the exact fact ("packed in recycled card, 80% recycled content" if certified).

### 4. Rate each line

- **Block:** banned by platform rule or law as written, or a health or result claim with no proof.
- **Fix:** allowed if reworded, qualified or proven.
- **Pass:** proven fact, honest opinion, or compliant offer.

### 5. Write the safe rewrite

For each block or fix, write a rewrite that keeps as much selling power as the evidence allows. Never weaken a true, proven line just to be safe; honest hedges ("helps", "for most buyers") are fine where they match the evidence. Then re-check the rewrite against step 3.

### 6. Check translations and spoken lines

Run the same rules on every language version the ad runs in, including mixed-language copy; meaning can drift in translation. Spoken claims in videos count the same as written ones.

### 7. Record what the client must prove or ask

List every claim whose proof the client must supply, and every line that needs a lawyer (comparisons naming rivals, health claims, "Made in USA", financial terms).

### 8. Rate platform-rule findings by what fixes them

For Meta ads, sort every platform-rule finding into one of three ratings, alongside the claim rating in step 4:

- **Would reject:** the ad itself breaks a ban (for example a cure claim for a listed disease, a put-down about the reader's body, a close-up of pinched skin to show fat, flashing or strobing video).
- **Needs a restriction:** the ad is fine once something outside it is set, such as an 18+ age limit, a licence, a country limit, a "Paid for by" label for social issue ads, or payer and beneficiary fields for ads shown in the EU.
- **Warning:** likely to lower delivery or invite review.

A finding that depends on the landing page, targeting or account history is never "would reject" on the copy alone; list it under what still needs checking. Health, diet and weight-loss ads run 18+, and results claims need a stated time frame. Lead forms may not ask for health, finances, ID numbers, religion or similar personal details. Paid creator posts need the partner tagged with the branded content tool.

Give a verdict per ad: Ready, Fix first, or Likely rejected. Rewrite only what a finding names; add no new claims. Meta reviews image, video, text, targeting and landing page, usually within 24 hours, and an edited ad is reviewed as new [ADC-6082]. For Google text, also flag misused capitals, gimmicky symbols or spacing, a phone number in the text, or no clear business name [ADC-6142]. The rules change; check the live policy page before calling a line safe.

## Checks before you hand it over

- Every line of every field, including spoken lines and captions, has a row.
- Each row has a type, a rating, the rule or law named, and the evidence held.
- Every block and fix has a rewrite, and each rewrite was re-checked.
- Prices, "was" prices, free offers and urgency lines are checked against the live page and records.
- Testimonials and reviews are confirmed real, unaltered in meaning and permitted.
- Disclosure labels (ad, partnership, AI) are present where needed.
- Lines needing a lawyer or client proof are listed, not guessed.
- No live ad was edited without the client's yes.
- Platform findings carry one of would reject, needs a restriction or warning, and nothing landing-page dependent is rated would reject.

## Output

**1. One-screen summary:** count of block, fix, pass; the changes that must happen before launch; proof the client must supply; lines for a lawyer.

**2. Check sheet:**

| Ad | Platform | Field | Line | Type | Rating | Rule or law | Evidence held | Problem | Safe rewrite | Rewrite re-checked |
|---|---|---|---|---|---|---|---|---|---|---|
| Ad 3 | Meta | Primary text | "Clears acne in 7 days" | Health, result | Block | Disease claim, no proof | None | Treats a condition | "Gentle daily wash for oily skin" | Y |

**3. Proof request list:** claim, evidence needed, owner, due date.

## Common mistakes

- **Checking only the headline.** Gate 1 and step 1 include every spoken and on-screen line.
- **Deleting strong true claims out of fear.** Step 5 keeps proven lines.
- **Trusting puffery to cover a measurable result.** Step 3.
- **Letting a reviewer's health claim through because it is a quote.** Step 3, reviews and health.
- **Forgetting the page.** Gate 2: the page must back the ad.
- **Checking English only.** Step 6.
- **Rejecting copy for a landing page problem.** Rate what the copy alone does; list page and targeting checks separately.

## Sources

- ADC-6142: Google editorial rules.
- GAD-6140: pin required disclaimers to always-shown slots.
- MCR-6021: FTC reviews and testimonials rule.
- OFF-6145: genuine former prices only.
- MCR-0020: illustration for sensitive health topics.
- AVT-0014: a mechanism claim needs a real product difference.
- ADC-6082: Meta reviews each ad, edits are reviewed as new.

What makes this skill ours: spoken lines, captions and translations are checked like headlines; every rating names the rule and the evidence on file; each block comes with a rewrite that keeps the selling point the proof allows instead of a vague hedge; and each market's ad rules (FTC in the US, ASA and CAP Code in the UK, EU consumer law and others) sit side by side in one sheet.

## Selling in India

- Research cited in an ad needs its source and date in the ad itself [ADC-6146].
- Referring to a real person needs their permission [ADC-6146].
- On social media, the ad label goes at the start of the post [ADC-6146].
- Prices quoted to Indian buyers include charges most buyers pay, such as GST and fixed fees [ADC-6147]. Drip pricing, bait and switch, false urgency and disguised ads are named dark patterns [ADC-6147].
- Run the same checks on Hinglish and regional language versions.

Sources for this section:
- ADC-6146: ASCI substantiation, free offers, permission, social labels.
- ADC-6147: ASCI dark patterns: drip pricing, bait and switch, false urgency, disguised ads.
