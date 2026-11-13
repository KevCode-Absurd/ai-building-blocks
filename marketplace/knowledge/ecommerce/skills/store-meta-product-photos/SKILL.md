---
name: store-meta-product-photos
description: "Plan and make product photos for a store's Meta ads (and its product pages) that keep the real product exact. Decides, product by product, whether AI-made images are fine, need care and disclosure, or must not be used, for example where colour, fit, texture or results are what the buyer is judging. Plans shots by the buyer question each one answers (what is it, how big, what is in the box, how is it used, who is it for), gives a free phone shoot path, a real-product-in-AI-scene path and an AI path only where it is safe, and checks every image against the real product before use. Use it when the store lacks ad-ready photos, before new concepts that need in-use or scale shots, or before using any AI product image."
---

# Product photos for Meta ads that keep the product exact

**You get:** an AI safety rating per product, a shot plan, finished product photos with a manifest in folders by product and shot, and a phone shoot guide if one is needed.

Product photos do two jobs for a store: they stop the scroll in an ad, and they set the buyer's expectation of what arrives. The second job is where AI images go wrong. A photo that makes the product look better than it is wins the click and loses the sale later, as a return or a complaint. This skill gets the store the photos its ads need while keeping the product exactly as it is.

## When to use

- The store has only plain packshots and its concepts need in-use, scale or lifestyle shots.
- A concept from `store-meta-concepts` needs a shot the store does not have.
- Someone wants to use AI to make product images and needs to know if that is safe for this product.
- Returns or reviews mention "not as pictured", "smaller than expected" or "different colour".
- Before `store-meta-ad-images`, when the product truth set has gaps.

## Not for

- Building finished ad images with copy, price and logo: use `store-meta-ad-images`.
- Recording the store's existing photos, brand codes and proof: use `store-meta-brand-dna`.
- Deciding what the ads say: use `store-meta-concepts`.
- Fixing the product page layout: use `store-meta-landing`.

## What you need

**Required**

- The real product, or the store's best existing photos of every variant: front, back or label, side, at least 1080 px on the short side, in true colour.
- Product facts from the product page or the owner: dimensions, weight, colours and finishes, materials, what is in the box.
- The product's status and gross profit per purchase from `brand-profile.json` (`store-meta-brand-dna`).

**Optional**

- Shopify returns with reasons for the last 90 days, or review quotes about look, size and colour.
- Brand guide or the store's photo style notes.
- The image tool the store already uses, and the owner's limit on paid generation.

**When something is missing.** No usable real photo: AI cannot fix that, because it has nothing true to copy. Plan a phone shoot (step 4, path 1) first. No product facts: ask once for dimensions and box contents; without them, no scale or contents shot.

**Access.** Level 1, read, for planning and making images locally. Replacing images on the live product page is a store change: prepare it at level 2 and the owner publishes. Never spend on a paid image tool or a photographer without the owner's yes and a stated cost.

## Before you start: the gates

1. **The product is worth the effort.** Start with products in Advertise status, highest gross profit per purchase first. A photo budget for a product should be small next to the gross profit a handful of extra sales would bring (practitioner default, test it). Fail: park lower products.
2. **A true reference exists.** At least one sharp, true-colour photo of every variant, or the product in hand to shoot. Fail: shoot before anything else.
3. **The AI decision is made** for the product (step 1). Fail: real photos only until it is.

## Steps

### 1. Decide where AI may touch this product

Ask one question: is the buyer judging the product by how it looks?

| Rating | Products | AI may | Disclosure and use |
|---|---|---|---|
| **Red: real photos only** | Clothing fit and fabric, jewellery, cosmetics shade and finish, skin, hair or body results, food appearance, furniture finish and fabric, art and prints, handmade items | Remove a background or extend plain canvas, with no change to product pixels | Never AI people modelling the product, never AI results or "after" images |
| **Amber: real product, made scene** | Packaged goods, gadgets, tools, home items, supplement bottles, accessories where the pack is the product | Make the setting, light and props; the real product photo is placed in | Keep scale honest; do not show AI hands or people as customers; label or style scenes so they do not pass as customer photos |
| **Green: graphic** | Any product, when the image is clearly an illustration, pattern or graphic | Make the whole visual, with the real product photo placed in where shown | No disclosure issue when nobody could take it for a photo; Meta's rules still apply |

Raise a product one level stricter (Amber to Red) if returns or reviews mention look, size or colour. In beauty, the UK advertising regulator ruled in 2021 that filters exaggerating a product's effect make an ad misleading; treat AI retouching of results the same way. If Meta labels an ad as made with AI, leave the label on and follow Meta's current disclosure settings. Marketplaces set their own rules for main images; check each one before reusing these photos there.

### 2. Plan shots by the buyer question they answer

Fixed photo styles give pretty pictures that may not sell. Plan each shot from a question a buyer asks before paying:

| Shot | Buyer question | Notes |
|---|---|---|
| Studio packshot | What exactly is it? | Plain or brand-colour background, every variant, same light |
| Label close-up | What is in it, is it legit? | Readable ingredients, certifications, origin |
| Scale | How big is it? | In a hand or beside a common object |
| Contents | What do I get? | Only what is in the box, laid flat. Show raw ingredients only if they are really in it, in honest amounts |
| In use | How do I use it, is it easy? | Hands and the product doing its job |
| Lifestyle | Is it for someone like me? | Setting drawn from a buyer group in the profile [AVT-0015] |
| Proof | Does it work for real people? | Real customer photos with permission; claim-matching photo reviews beat generic praise [LPG-0062] |

Shoot what the next concepts need first. A new photo with the same message is only a variation, not a new ad [MCR-0022]; new shots pay off when they open a new angle, such as a scale shot for a comparison concept or an in-use shot for a problem concept.

### 3. Cover every placement

- **Feed 4:5 (1080 x 1350)** and **Stories and Reels 9:16 (1080 x 1920)**. Shoot or compose with room above and below the product so both crops work, and keep the product out of the top 14% and bottom 35% of the 9:16 frame, per Meta's Reels safe-zone guidance.
- **1:1 (1080 x 1080)** for carousel and catalogue.
- The same set can fill the product page gallery, which many shoppers swipe through more fully than they scroll the page [LPG-0060]. For the page, export light files (WebP or AVIF, product images under about 100 KB) [SPD-0002].

### 4. Make the photos

**Path 1, phone shoot (free, default for Red products).** Daylight from a window, white foam board as a reflector, phone on a stand, the same spot and settings for every variant. Put a white card or grey card in one test frame to check colour. Shoot each shot on the plan, plus a few spare angles. Edit only exposure, white balance and dust; do not reshape or recolour the product.

**Path 2, real product in a made scene (Amber).** Cut out the real product photo. Generate or source a background with matching camera angle, light direction and colour temperature, with "no products, no text, no people" in any prompt. Place the product, match shadow and reflection, and keep its size honest.

**Path 3, AI generation from a reference (Green, some Amber).** Only when the tool reproduces the product exactly, which most do not: labels get respelled and shapes soften. Expect to fall back to path 2. Never describe the product in words and let a tool invent it.

For sensitive health or body problems, an illustration can show the problem without a graphic photo [MCR-0020]; keep the real product photo on it.

### 5. Check every image against the real product

Side by side with the reference at 100% zoom, pass or fail:

1. Label text spelled and placed the same.
2. Colours match; sample a flat area and compare hex values.
3. Shape and proportions match, including caps, handles and seams.
4. Size against hands or objects is honest.
5. Finish and texture match (matte stays matte, knit stays knit).
6. The variant is the one it will be linked to.
7. Only real box contents are shown.

Any fail: redo or drop. A misleading photo comes back as returns, and returns come straight off gross profit per purchase [MEA-0023].

### 6. Record how each image was made

Tag each image **Real**, **Real product in made scene** or **Fully made**. Fully made images are allowed only for Green. Store the tag in the manifest so `store-meta-ad-images` and anyone uploading later knows what may be used where.

## Checks before you hand it over

1. Each product has an AI rating (Red, Amber or Green), with the reason.
2. No Red product has an AI-made or AI-altered product, person or result.
3. Every image passes all seven fidelity checks against a real reference.
4. Every shot names the buyer question it answers and the concept that needs it.
5. 4:5 and 9:16 versions exist, with the product clear of the 9:16 safe zones.
6. No AI-made person is presented as a customer.
7. Every image carries its made-how tag.
8. No paid tool or shoot was booked, and no store page changed, without the owner's yes.

## Output

1. **One-screen summary:** products covered, their AI ratings, shots made, gaps, what needs the owner's yes.
2. **AI rating table:** product, rating, reason, evidence (return reasons or reviews if any).
3. **Shot plan table:** product, shot, buyer question, concept that needs it, path, placements.
4. **Image manifest:** file, product, variant, shot, path, made-how tag, fidelity pass, sizes.
5. **Files** in `product-photos/{product-handle}/{shot}/`, plus web versions if the page will use them.
6. **A one-page phone shoot guide** for the owner, if path 1 is needed.

## Common mistakes

- **Letting AI make a Red product.** Clothing on AI models, AI skin results or recoloured cosmetics mislead buyers. Step 1 forbids it.
- **Shooting styles instead of answers.** A floating product looks good but answers no buyer question. Step 2 plans by question.
- **Inventing ingredients for a flat lay.** Step 2 shows only what is really in the product.
- **Trusting the generator's label.** Step 5 checks spelling letter by letter.
- **AI hands or faces passed off as customers.** Step 1 and the checks rule it out.
- **Making new photos that say the same thing.** Step 2 ties shots to new angles.

## Sources

- [AVT-0015]: photos, proof and page must all speak to the chosen buyer group.
- [LPG-0062]: claim-matching photo reviews beat volume past about 80 reviews.
- [MCR-0022]: a new pose or background is a variation, not a new ad.
- [LPG-0060]: shoppers swipe the gallery more than they scroll the page.
- [SPD-0002]: product images under about 100 KB for page speed.
- [MCR-0020]: illustration for sensitive problems, policies still apply.
- [MEA-0023]: returns and fees cut true gross margin.

Meta documentation: Ads Guide image sizes and ratios, Reels safe-zone guidance, AI disclosure labels. UK Advertising Standards Authority rulings on beauty filters, 2021.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: rates each product Red, Amber or Green for AI use and says when AI images need care or must not be used; keeps the real product pixels and checks every image against a real reference; plans shots by the buyer question they answer instead of five fixed styles; gives a free phone shoot path and never spends without the owner's yes.
