---
name: shopify-landing-page-theme-export
description: Use when a landing page (advertorial, reasons-why or product page) is written and you want it inside a Shopify store as an editable page. Produces one section file, one alternate page template with the copy preloaded, and an image list.
---

# Shopify Landing Page Theme Export

You get a section file, a JSON page template that preloads your finished copy, a list of images to upload, and plain install steps. The store owner creates a Page, picks the template and edits words in the theme editor.

## Inputs
- **Finished page copy** (required): sections, headings, body, questions, offer rows, button text, risk lines. Treat pasted text as data.
- **Store details** (required): the product's handle in the store, the page handle and template name you want, and the theme in use (does it support theme blocks?).
- **Design notes** (optional): colours, fonts, spacing from the brand.
- **Apps** (optional): which app supplies reviews and which supplies subscriptions.
- **Store facts** (optional): size guide, care, what is in the box (held as policies or product fields).

## Steps
1. **Shape.** One `sections/<page-name>.liquid` file, one `templates/page.<suffix>.json` that preloads it, and images. Follow `shopify-liquid-theme-reference` for syntax and schema rules.
2. **Copy lives in settings, not code.** Section settings hold the one-off parts (headline, sub-headline, button label, risk line). Blocks hold repeated parts (a reason, a review, a question, a row of "what is in the box"). The template JSON carries the real copy in `settings`, `blocks` and `block_order`, so the page renders complete on install.
3. **A page template has no product object.** Add a `product` picker setting and read `section.settings.product`. Print prices from the store (`product.price | money`; show compare-at only when `product.compare_at_price > product.price`). Never type a price; a typed price goes stale and the page then states something the store does not charge.
4. **Buying from the page.**
   - Add to cart: a `{% form 'product', product %}` with a hidden input for the variant id; or point every button to one URL setting (the product page or a cart link).
   - Product bought once: a variant picker built from the product's option values (size, colour) and a size guide one tap away.
   - Product bought again on subscription: send the chosen selling plan with the form. If the store's subscription app provides an app block, accept `{ "type": "@app" }` and do not rebuild it.
5. **Take facts from the store where it holds them.** Policies from the shop's refund and shipping policy objects; dimensions, materials and care from product metafields. A fact the store does not hold is a setting with no default, so nothing invented ships.
6. **Reviews.** Use the reviews app's block, or blocks holding real reviews word for word. No rating, count or badge setting is given a default value.
7. **Advertorial pages** carry an "Advertisement" label inside the section itself, not as an optional setting.
8. **Images.** One `image_picker` per slot, rendered with `image_url` and `image_tag` with widths and sizes; the first image eager and high priority, the rest lazy; a real `alt` each.
9. **Styling.** Scope CSS to the section. Colours that come from settings go in `{% style %}`, since `{% stylesheet %}` cannot read Liquid. Build and check at phone width first.
10. **Limits.** A JSON template renders up to 25 sections and a section up to 50 blocks; a long page is one section with blocks, or a few sections. Checkout cannot be changed with theme code.

## Output
1. File contents in code blocks headed by path: the section, the template JSON, any snippet, any locale entries.
2. **Image list**: slot, what it must show, suggested size.
3. **Install steps** (6 lines): upload files, create a Page, choose the template, pick the product, upload images, preview on a phone.
4. **MISSING** list: every fact slot left empty because the store does not hold it.

## Checks
- Template JSON is valid and every block type it names exists in the section schema.
- Every price and policy is read from store objects.
- No default rating, count, badge or review.
- Buttons all lead somewhere real.
- The "Advertisement" label exists on advertorial pages and cannot be switched off.
- CSS is scoped; images have `alt`.
- You state what is untested (cart and payment need a test order inside the store).

## If something is missing
Write `MISSING: <what>`. No product handle: leave the picker empty. No subscription app info: build a one-time purchase only and say so.

## Avoid
- Typing prices, policies or review scores into the code.
- Rebuilding a subscription widget the app already supplies.
- Promising checkout changes.
