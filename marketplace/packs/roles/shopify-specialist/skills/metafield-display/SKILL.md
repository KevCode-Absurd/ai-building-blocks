---
name: metafield-display
description: Shows product details stored in Shopify metafields or metaobjects - size charts, care notes, ingredients, materials, lowest prior prices - on the storefront. Plans the fields and their types, connects them in the theme editor with dynamic sources where the theme supports it, and writes a small Liquid block or snippet only where it does not, with set-up, test and undo steps. Use when a store needs the same kind of detail on many products without pasting it into every description.
---

# Metafield display

Metafields hold structured product details once, in a field, instead of buried in each description. This skill plans those fields and gets them onto the page with the least code possible.

Access levels for this skill: level 1 (read) to plan fields and write code for the owner; level 2 (read and draft) to connect fields and add code on an unpublished duplicate theme; level 3 (read, write and publish) to create metafield definitions, fill in values on live products and publish the theme, within the owner's limits.

## When to use

- A size chart, care guide, ingredient list, material, origin or dimensions that differ per product.
- The same detail shown in more than one place (product page, quick view, comparison table).
- An EEA store that needs to show the lowest price of the previous 30 days for frequent discounts.
- A theme migration where details are stuck inside product descriptions.

Not for: data that belongs in variants (size and colour options that change price or stock), or anything that must be edited by customers.

## What you need

- **Access I have**: the level and limits the owner grants for the store, written down. Until then, level 1.
- **The details to show**, with three or four real product examples, including one where the detail is missing.
- **Theme name and version.** Online Store 2.0 themes can connect metafields to section and block settings in the theme editor (dynamic sources). Vintage themes usually need a code edit.
- **Who fills the fields in**, and how many products need them. That decides whether a bulk import is needed.
- **Existing metafields**: a screenshot of the product metafield definitions in the admin, so you do not create duplicates.
- **Markets**: whether the store sells to the EEA, if any price wording is involved. Price rules here are general information; the owner checks their own obligations with an adviser.

## Steps

1. **Model the data.** For each detail, pick the simplest type that fits:
   - one line of text (material, origin);
   - multi-line text (care notes);
   - rich text (short formatted guides);
   - a number with a unit, or dimension and weight types (sizes, weights);
   - a file reference (a size chart image or PDF);
   - a metaobject reference, when many products share the same structured entry (one "fabric" entry with name, care and origin, used by forty products).
   Write the namespace and key in the plan, for example `custom.care_notes`. Keep keys short, lowercase and stable; renaming later breaks templates.
2. **Create definitions, not loose values (level 3, or the owner).** Definitions add a field to the product page in the admin and validate what goes in. Staff need product permissions to manage them. Give exact names, types and validation rules; with level 3 access I create them after the owner's yes, otherwise the owner or their team does.
3. **Try the no-code route (level 2 on the duplicate).** On an Online Store 2.0 theme, open the theme editor on a duplicate theme, select a text or rich text setting in the product template, and connect it to the metafield as a dynamic source. If that shows the detail where it should be, stop. No code.
4. **If the theme cannot do it, write a small block or snippet.** Read the field, check for a value, and output nothing when it is empty:
   - Text types: output the value, escaped; for multi-line text, keep line breaks with `newline_to_br`.
   - Rich text and other structured types: use `metafield_tag`, which renders the field as HTML for its type.
   - File references: pass the image through `image_url` and `image_tag` with real widths.
   - Metaobject and list references return objects, not text. Check shopify.dev's metafield reference for the exact access path for the type before writing code; it is the most common source of blank output.
5. **Place it where the shopper looks.** Size and fit near the size selector; care and materials in an expandable panel; dimensions near the price on furniture. Product pages should answer the shopper's question on the page.
6. **Plan the data entry.** For a handful of products, fill the fields in the admin. For many, plan a CSV export and import or a bulk editor session, with one tester product first. Writing values on live products needs level 3 access within the owner's limits; a bulk import that overwrites existing values needs a fresh yes.
7. **Write install, test and undo steps.** Undo is simple when the display is a setting connection (disconnect it) or a separate block file (remove the block, delete the file). The metafield values stay safe in the admin either way.
8. **Go live (level 3, or the owner).** Publish the duplicate theme with a backup of the live one kept, log each action, and check a product with the field and one without on the live store.

## Checks

- Each detail has one definition with the right type; no duplicates under different keys.
- Empty fields render nothing: no empty heading, no stray label.
- The no-code dynamic source route was tried first and the result is recorded.
- Text output is escaped; rich text renders as intended.
- Size chart images are sized and have alt text.
- Works on phone and desktop, on a product with the field and one without.
- Any price wording for EEA shoppers was checked by the owner against the official guidance.
- Every action stayed within "Access I have" and is in the log.

## Output format

1. **Field plan**: table of detail, type, namespace.key, example value, who fills it in.
2. **Route**: dynamic source (with click path) or code.
3. **Code**, if needed: one fenced block per file with its path.
4. **Data entry plan**: manual or bulk, with the tester product.
5. **Test table** and **undo steps**.

## Example of good output (short)

*Alder & Loom is a made-up business used only to show the format: a small linen clothing store on an Online Store 2.0 theme.*

**Field plan**

| Detail | Type | Key | Example | Filled by |
|---|---|---|---|---|
| Care notes | Multi-line text | `custom.care_notes` | Wash at 30 degrees. Line dry. | Owner |
| Fabric | Metaobject reference (Fabric: name, weight, origin) | `custom.fabric` | Mid-weight linen, Lithuania | Owner, once per fabric |
| Size chart | File reference (image) | `custom.size_chart` | size-chart-dresses.png | Owner |

**Route:** care notes connect to the theme's collapsible tab text setting as a dynamic source; no code. The size chart needs a small block, because the theme's tab only accepts text.

```liquid
{% comment %} blocks/size-chart.liquid (theme with a blocks folder) {% endcomment %}
{%- assign chart = product.metafields.custom.size_chart.value -%}
{%- if chart != blank -%}
  <details class="size-chart" {{ block.shopify_attributes }}>
    <summary>{{ block.settings.label | escape }}</summary>
    {{ chart | image_url: width: 1200 | image_tag: loading: 'lazy', alt: block.settings.alt_text, sizes: '(min-width: 750px) 600px, 100vw' }}
  </details>
{%- endif -%}

{% schema %}
{
  "name": "Size chart",
  "settings": [
    { "type": "text", "id": "label", "label": "Label", "default": "Size chart" },
    { "type": "text", "id": "alt_text", "label": "Image description", "default": "Size chart with chest, waist and length in centimetres" }
  ],
  "presets": [{ "name": "Size chart" }]
}
{% endschema %}
```

**Test:** the linen dress (has a chart) shows the panel; the scarf (no chart) shows nothing. **Undo:** remove the block in the theme editor and delete the file; the metafield values stay in the admin.
