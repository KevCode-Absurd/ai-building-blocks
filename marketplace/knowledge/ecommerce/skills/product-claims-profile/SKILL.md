---
name: product-claims-profile
description: "Build one product's selling profile, pulled once and reused by every ad, page, email and image prompt: how it works, every claim sorted into proven, supported, customer-reported, opinion or banned (each with its evidence), counted customer quotes, objections with the review that answers each, who buys it, real proof, the product's colours as hex codes from real photos, its visual words, and the top three themes to sell on. Applies category claim rules for supplements, cosmetics and other regulated goods in the US, UK, EU, Canada and Australia. Use before new ads or a page for a product, when copy keeps making claims nobody can back, or before a launch. Read access only."
---

# Product claims and proof profile

**You get:** one product's selling profile: a claims table sorted by proof tier with allowed wording, customer quotes, objections, proof and visuals blocks, three themes, and a JSON file other skills can read.

One product, one file, with every claim tied to its evidence. Ads, pages and image prompts then pull from the same checked source instead of each writer inventing a fresh promise. The core of this skill is the split between what the store can prove and what it would merely like to say.

## When to use

- Before new ads, a new product page or an email series for a product.
- Copy for this product keeps making claims nobody can show evidence for.
- A supplement, cosmetic, personal care or other regulated product is about to be advertised.
- Before a launch, to fix the claims before anything is made.
- Ads were rejected for health or personal-attribute claims.

## Not for

- The store-wide folder of facts, customers and proof: use `store-knowledge-folder` (this profile reads it first).
- Meta concepts and copy: use `store-meta-concepts`, which takes this profile's allowed claims.
- New product photos: use `store-meta-product-photos`.
- A legal opinion. This skill applies general practice and points to official guidance; anything close to the line goes to a regulatory professional.

## What you need

**Required**

- The product page URL (captured with date) and the product's row from `02-products.csv` in the store folder: price paid, gross profit per purchase, days of stock cover.
- Product images: the store's real photos of every variant.
- Reviews for this product: review app export (rating, title, body, date, verified flag, photo link). Fewer than 20 reviews: also read the top three rival products' reviews on Amazon or their sites.
- The ingredient list or materials spec, the label artwork, and any test reports, certificates, clinical or lab studies the store holds.

**Optional**

- Post-purchase survey answers, support tickets tagged to this product, return reasons.
- Supplier specification sheets.

**When something is missing.** Ask once for the evidence files. A claim with no evidence file stays out of "proven", whatever the owner says. Without the products row, run gate 1 here.

**Access.** Level 1, read, for the whole job. Nothing is published or changed.

## Before you start: the gates

1. **Gross profit per purchase is known.** Read it from the store folder or compute it: price paid minus landed cost, shipping and pack, payment fees, returns cost (and failed delivery cost where pay on delivery is offered). Fail: build the profile but mark the theme ranking in step 8 "not ranked: gross profit unknown".
2. **The product can be bought today.** Live, in stock, at the stated price. If stock cover is below reorder lead time, write "Protect: do not push new demand" at the top; the profile still gets built.
3. **The category is known.** Name it: general goods, apparel, food, dietary or health supplement, cosmetic, personal care, device, or children's product. Regulated categories run step 5 in full. Fail (unclear): treat it as regulated.

## Steps

### 1. Write how it works, in one chain

Write the mechanism as a chain: the problem, why it happens, which part of the product acts on that cause, and the result the buyer feels. Each link names its evidence. Every part of the product should map to one link in the chain; a page that names a cause the product does not act on reads as a scam [LPG-0028], and in health categories the cause itself needs substantiation. Where no link can be evidenced, say so and keep the claim at the level the evidence allows.

### 2. List every claim the store already makes

Collect claims from the product page, packaging, ads, emails and marketplace listings, word for word with source and date. Include implied claims: a before and after photo claims a result; "dermatologist" in a headline claims expert approval.

### 3. Sort each claim into one of five tiers

| Tier | Meaning | Use in buyer copy |
|---|---|---|
| Proven | Evidence on file about this product (lab test, certificate, product study, measured spec) | Yes, worded no stronger than the evidence |
| Supported | Evidence about an ingredient or material at the dose or grade used, not the product itself | Yes, as an ingredient fact, never as a product result |
| Customer-reported | Said by real customers in reviews or surveys | Yes, as a quote with name or source, not as the brand's promise |
| Opinion | Taste or style the brand may state ("our softest tee") | Yes, if it cannot be read as a measurable fact |
| Banned | Disease, drug-like or unprovable claims, fake numbers, rival claims the store cannot back | Never |

Write the evidence in the row: file name, date, what exactly it shows, and the strongest sentence it supports. A comparison ("97% versus a category average of 12%", "more than brand X") needs a source for both numbers, or it drops to Banned. A distinctive claim that is non-obvious but true beats a common one everybody makes [BRD-0021], so mark any proven claim no rival can make.

### 4. Bank customer words and count them

Read every review by hand and paste quotes verbatim with stars and date [AVT-0007]. Tag each: outcome, before, failed fixes, who I am, objection, use. Count each tag. Buyers who already paid for fixes that failed are the highest intent; note those quotes and the fixes they name [AVT-0009]. In 3-star reviews, look for opposite complaints (too simple, too complex); do not chase either side [AVT-0008].

### 5. Apply the category claim rules

General practice, not a ruling; check the official guidance on the day.

**United States**
- All claims need a reasonable basis before they run (FTC Act). Health claims need competent and reliable scientific evidence, usually human studies on the claimed benefit (FTC Health Products Compliance Guidance).
- Dietary supplements may make structure or function claims ("supports restful sleep") with substantiation, the FDA disclaimer on the label, and notice to FDA within 30 days of first marketing. They may not claim to diagnose, treat, cure or prevent a disease.
- Cosmetics are judged by intended use. A claim to change the body's structure or function ("regrows hair", "repairs collagen", "heals acne") makes the product a drug in the law's eyes. Sunscreen, anti-dandruff and antiperspirant claims are drug claims with their own rules.
- Reviews and testimonials: no fake or AI-written reviews, no suppressing bad ones (FTC rule on consumer reviews and testimonials, 2024), and a testimonial result implies it is typical unless the copy says what most buyers can expect.

**United Kingdom and European Union**
- Objective claims need documentary evidence held before the ad runs (UK CAP Code, enforced by the ASA; the EU unfair commercial practices rules).
- Food and supplement health claims must match an authorised claim on the GB or EU nutrition and health claims register, in wording close to the approved text. Claims to prevent, treat or cure a disease are for licensed medicines only.
- Cosmetics claims must be truthful, evidenced and not imply a medical effect (UK and EU cosmetics rules and the common criteria for cosmetic claims).
- Influencer and creator posts need a clear "ad" label (ASA and CMA guidance in the UK, and matching rules across the EU).

**Canada and Australia**
- Canada: natural health products need a Health Canada licence and may claim only what the licence allows; ads must not mislead under the Competition Act.
- Australia: therapeutic claims fall under the TGA, and misleading claims under the Australian Consumer Law, enforced by the ACCC.

**Other markets**
- Use your market's labelling, product safety and ad disclosure rules; the five evidence tiers still apply.

**Meta and Google policy.** Copy may not imply the viewer has a condition ("your acne"), and health claims must follow each platform's healthcare policy [GAD-0025].

Move any claim that breaks a rule to Banned and write the nearest allowed wording beside it. Also list the lines that must appear wherever certain claims run (for example the supplement disclaimer, usage warnings, "results vary" where a testimonial shows a result).

### 6. Pair every objection with an answer

List objections from 1 to 3 star reviews, questions on the page, support tickets and return reasons, with counts. For each, pick one real review or one proof row that answers it. One testimonial per main objection is the target [LPG-0053]; three or four hand-picked ones placed by the add-to-cart button do the most work [LPG-0005]. An objection with no answer is a gap for the product or the page team.

### 7. Record proof and visuals

- **Proof:** review count and average rating on the capture date; press with the outlet's actual quote (a bare logo now reads as padding [LPG-0037]); certificates and tests with links. Under about 80 reviews, more reviews is the cheapest proof gain [LPG-0062]; note it.
- **Palette:** sample hex values from the real product photos (label background, main product colour, cap or trim) with any colour picker, avoiding shadows and highlights. Two to five values with what each is.
- **Visual words:** shape, texture, material, finish, size against a hand, what is in the box, and where the product's colour differs from the packaging's. Add the framings that would misrepresent it (shown as the wrong format, wrong size, a variant the store does not sell). Image tools and photographers use these.

Gaps are store problems, not research failures: "no third-party proof", "no review answers the price doubt", "page never says how it works". List them for the owner.

### 8. Rank the top three themes

A theme is one buyer, one problem or desire, and one proven or supported claim. Score each candidate on: count of customer quotes behind it (step 4), the strongest tier of claim behind it (proven beats supported beats customer-reported), and whether rivals already make it. Pick three. A theme resting only on Opinion or Customer-reported claims can run, but say so. Give each theme its allowed claim wording, two customer quotes, the proof row and the objection it must answer. Also name one or two themes to avoid for this product and why (for example countdown pressure for a buyer group whose reviews show distrust of hype). Date the profile and set a recheck 90 days on, or sooner when the formula, label or price changes.

## Checks before you hand it over

1. Every claim row has a tier, a source and evidence, or is Banned.
2. No Supported claim is worded as a product result.
3. Regulated categories show the rule checked for each claim, with the official source named.
4. Every customer quote is verbatim with stars, date and source.
5. Each main objection has a named answering review or proof row, or is listed as a gap.
6. Hex values come from the real product photos, not the website theme.
7. The top three themes each rest on a quote count and at least one non-Banned claim.
8. The plain one-pass answer (a product summary written from the page alone) would miss at least the claim tiers and the objection pairs.

## Output

1. **One-screen summary first:** product, price paid, gross profit per purchase, stock status; the mechanism chain in one line; the three themes; the three strongest proven claims; the banned claims the team keeps using, with allowed wording.
2. **Claims table:** claim as used, where used, tier, evidence (file, date, what it shows), allowed wording, rule checked.
3. **Customer words:** quote, tag, stars, date, source, permission to use in ads (unknown until confirmed).
4. **Objections table:** objection, count, source, answering review or proof, gap (yes or no).
5. **Proof table** and **visuals block** (hex values with labels, visual words, links to the truth set images).
6. **Themes:** three rows with buyer, problem or desire, claim wording, two quotes, proof row, objection to answer; then themes to avoid, required lines, and the store's gaps.
7. A `product-profile-<sku>.json` with the same keys for other skills to read.

## Common mistakes

- **Turning an ingredient study into a product promise.** Step 3 keeps Supported claims as ingredient facts.
- **Treating the product page as evidence.** Step 2 collects claims; step 3 needs a file behind each.
- **Health words in cosmetics copy.** Step 5 moves drug-like wording to Banned with an allowed rewrite.
- **Quoting the rare miracle review as typical.** Step 5 notes the typical-results rule.
- **Objections with no answer.** Step 6 pairs each with a real review or proof, or flags the gap.
- **Palette from the website, not the product.** Step 7 samples the real photos.

## Sources

- [LPG-0028]: every product part maps to the named cause.
- [BRD-0021]: good claims are non-obvious but true.
- [AVT-0007]: paste review quotes verbatim, by hand.
- [AVT-0009]: buyers of failed fixes are the highest intent.
- [AVT-0008]: do not chase contradicting 3-star complaints.
- [GAD-0025]: health claims must meet platform and regulator rules.
- [LPG-0053]: one testimonial per main objection.
- [LPG-0005]: three or four objection-answering reviews by the button.
- [LPG-0037]: press logos need the outlet's quote.
- [LPG-0062]: up to about 80 reviews is where conversion moves most.

Official guidance named in step 5: FTC Health Products Compliance Guidance; FDA rules on structure or function claims and cosmetic versus drug claims; FTC rule on consumer reviews and testimonials; UK CAP Code and ASA rulings, the GB and EU nutrition and health claims registers, UK and EU cosmetics claims criteria, CMA influencer guidance, Health Canada natural health product rules, TGA and ACCC guidance.

What makes this skill ours: it sorts every claim into five evidence tiers and refuses to let an ingredient study become a product promise; it applies each market's category rules claim by claim with an allowed rewrite; it pairs each counted objection with a real answering review; and it ranks themes by quote counts and claim strength, gated on the product's gross profit and stock.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. India's category rules for step 5:
- No advertising that claims to treat the diseases listed under the Drugs and Magic Remedies (Objectionable Advertisements) Act.
- Cosmetics may not claim drug effects (Drugs and Cosmetics Act and Cosmetics Rules 2020). AYUSH products follow their own rules.
- Health supplements and nutraceuticals follow FSSAI's regulations and its Advertising and Claims Regulations: health claims need scientific substantiation, disease risk reduction claims need approval, and nothing may claim to cure.
- All ads must be substantiated under the ASCI Code; misleading ads fall under the Consumer Protection Act 2019 and the CCPA guidelines on misleading advertisements (2022). Influencer posts need clear disclosure.
