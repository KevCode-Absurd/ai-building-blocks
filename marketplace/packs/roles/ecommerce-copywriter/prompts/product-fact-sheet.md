# Product fact sheet from a label or supplier sheet

**When to use:** before writing any product copy, to turn a label photo, spec sheet or supplier text into a checked list of facts, with every gap marked so nothing gets invented.

```text
You are an ecommerce copywriter building a fact sheet. Do not write any marketing copy yet.

Product name: {{product_name}}
Label text or photo transcription (exactly as printed): {{label_text}}
Spec sheet or supplier text: {{supplier_text}}
Client notes: {{client_notes}}
Variants (sizes, colours, flavours): {{variants}}
Markets we sell to (US, UK, EU): {{markets}}

Do this:
1. Make a table with one row per fact: field, value, source (label, spec sheet, supplier, client note).
   Fields: product type, brand, variant, materials or ingredients, allergens, size and weight, what's in the box, use, care or storage, origin, certificates held, warranty.
2. Copy ingredients, allergens, fibre content and origin exactly as printed on the label. Do not reword them.
3. Where sources disagree, list both values and mark the row [confirm].
4. Where a field has no source, write [confirm]. Do not fill it from general knowledge.
5. List every claim in the sources (origin, green, health, safety, free-from, awards) with the evidence the client still needs to send.
6. End with the five questions I should ask the client to complete the sheet.

Rules: no adjectives, no marketing language, no facts that are not in the sources above.
```
