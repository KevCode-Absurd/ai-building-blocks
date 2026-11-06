---
name: product-page-copy
description: Writes the full copy for one product or a batch of up to 20 from a checked fact sheet - titles for each surface (product page, SEO title, Google feed, marketplace), bullets, a description, a specs table, care or storage notes, an FAQ from real shopper questions, and alt text - with character counts and every unconfirmed fact marked [confirm]. Use when someone asks for product descriptions, product titles, a product page rewrite, or copy for new stock, including food products where ingredients and allergens must match the label.
---

# Product page copy

Product copy fails in two ways: it is thin (shoppers can't tell if it fits their need) or it is invented (it promises things the product can't back up). This skill builds copy from a fact sheet, so every line is both useful and true.

## When to use

- "Write descriptions for these 15 new products."
- "Our product pages are just the supplier text. Fix them."
- "We need titles for Google Shopping."
- A food or drink product page, a gift box or a bundle.

## What you need

**Access:** level 1 to read products, reviews and questions. Level 2 to put the copy into draft products or an import sheet. Level 3 to publish on the products you named, within your limits. New origin, green, health or "free from" claims need a fresh yes every time.

- The label, packaging photos, spec sheet or supplier sheet for each product.
- Variants (sizes, colours, flavours) and what differs between them.
- 20 or more reviews or pre-sale questions, if the product has any. For a new product, reviews of a similar product.
- The surfaces the copy will appear on (store, Google feed, a marketplace) and the markets (US, UK, EU).
- The brand voice in a few lines, or two product pages the client likes.

## Steps

1. **Build the fact sheet.** One row per product or variant: name, type, brand, variant, materials or ingredients, allergens, size and weight, what's in the box, use, care or storage, origin, certificates held, warranty. Write the source next to each fact (label, spec sheet, supplier, client note). Mark anything else [confirm]. For food, copy ingredients and allergens exactly as printed, keeping the label's emphasis on allergens.
2. **List the shopper questions.** From reviews and support emails, list the questions people ask before buying (fit, size, compatibility, taste, how long it lasts, how to use it, delivery). Keep their words. Pick the top five for this product.
3. **Pick the one main benefit.** Ask: what does a buyer get from this that matters most, and which fact proves it? If two products in the range share a main benefit, find the real difference between them and lead with that.
4. **Write the titles, one per surface.**
   - *Product page title:* the product type and the main differentiator, in plain words.
   - *SEO title:* up to 60 characters where possible, main search term first, brand at the end.
   - *Google feed title:* brand, product type, key attribute, variant, within 150 characters with the key details in the first 70. No price, sale, shipping or shop name.
   - *Marketplace title:* follow that marketplace's own rules. For Amazon, use the Amazon marketplace manager kit.
   Show the character count for each.
5. **Write three to five bullets.** Each starts with a benefit and ends with a fact the shopper can check. Keep them parallel in form. No bullet repeats the title.
6. **Write the description.** Short paragraphs. The first two sentences say what it is, who it suits and the main benefit; the rest covers use, materials, care and anything the bullets didn't. For a Google feed version, keep only product facts, with no links, comparisons, accessories or store policies.
7. **Add the specs table and care or storage notes.** Same fields and units for every variant.
8. **Write the FAQ.** Answer the top five shopper questions in one to three sentences each. If the answer isn't in the fact sheet, write the question and [confirm] instead of an answer.
9. **Write alt text** for each image: what it shows that matters to a shopper ("Back view of the jacket showing the zipped vent"). Decorative images get an empty alt. If an image shows a size chart or nutrition panel, put that information in text on the page too.
10. **Run the claim check.** Any origin, environmental, health, safety, "free from", award, review or price claim goes through the claims-and-label-check skill before it ships.
11. **If AI helped draft,** check every fact against the fact sheet. For Google feeds, note that AI-generated titles and descriptions go in the `structured_title` and `structured_description` attributes.

## Checks

- Every fact has a source in the fact sheet, or is marked [confirm].
- Ingredients, allergens and materials match the label word for word.
- Each title is within its surface's limit, with product type and variant intact.
- Variants use the same fields, units and names as the store's filters.
- No supplier sentences reused; no lines shared word for word with another product.
- No adjectives standing in for facts ("premium", "high quality") without the fact next to them.
- Alt text describes; it doesn't list keywords.

## Output format

For each product:

1. **Fact sheet** (table: field, value, source).
2. **Titles** (surface, title, character count).
3. **Bullets.**
4. **Description** (store version; feed version if needed).
5. **Specs table** and **care or storage**.
6. **FAQ.**
7. **Alt text** (image, alt text).
8. **Open questions** ([confirm] items) and **claims to check**.

For a batch, also give one import-ready table (handle, title, SEO title, meta description, body, alt text) in the store's CSV column names.

## Example of good output (short)

*Hollow Lane Preserves is a made-up business used only to show the format. The product facts below are invented for this example.*

**Fact sheet (extract)**

| Field | Value | Source |
|---|---|---|
| Product | Seville orange marmalade, thick cut | Label |
| Size | 340 g jar | Label |
| Ingredients | Sugar, Seville oranges (40%), water, lemon juice | Label |
| Allergens | None of the 14 declared on label | Label |
| Storage | Refrigerate after opening, use within 6 weeks | Label |
| Origin of oranges | [confirm] | Client note says "Spain", not on label |

**Titles**

| Surface | Title | Characters |
|---|---|---|
| Product page | Thick-Cut Seville Orange Marmalade | 34 |
| SEO title | Thick-Cut Seville Orange Marmalade, 340 g - Hollow Lane | 55 |
| Google feed | Hollow Lane Seville Orange Marmalade, Thick Cut, 340 g Jar | 58 |

**Bullets**

- Sharp and bitter-sweet: made with Seville oranges, 40% of the recipe.
- Chunky peel you can see: thick-cut, as the name says.
- Four ingredients: sugar, Seville oranges, water, lemon juice.
- Keeps well: refrigerate after opening and use within 6 weeks.

**FAQ (extract)**

- *Where are the oranges from?* [confirm]
- *Is it suitable for vegans?* [confirm] The label lists no animal ingredients; ask the maker before stating it.

**Claims to check:** "Spanish oranges" is an origin claim. Hold it until the client confirms and the label or supplier paperwork supports it.
