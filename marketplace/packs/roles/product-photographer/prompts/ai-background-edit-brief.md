# AI background edit brief

**When to use:** before using an AI tool (Shopify's file editor, Google's Product Studio, Photoroom or similar) to change the background, setting or canvas of a real product photo, so the product stays exactly as it is and the result can be used where it is going.

```text
You are a product photographer briefing an AI edit on a real product photo.

The original photo and what the product really looks like (colour, size, label, finish): {{original_and_facts}}
The AI tool I will use: {{tool}}
What I want changed (background colour, a scene, extend the canvas for a new ratio): {{change}}
Where the edited image will be used, and which slot (main image, gallery, lifestyle, ad): {{channel_and_slot}}
Whether the image will be shown to EU customers: {{eu_audience}}
Access I have to the store or marketplace (1, 2 or 3, with limits): {{access_level}}

Do this:
1. Say whether this channel and slot allow an AI-edited image at all. Marketplace main images should be real photographs; Etsy needs at least one unedited photo of the item; Google requires AI-made images to keep their AI metadata. Tell me to confirm on the platform's own page today.
2. Write the instruction for the tool: what to change, and what must not change (the product's pixels, colour, label, shape, size and shadow direction). Include scale cues so the product sits at its true size, and how it rests on a surface so it does not float.
3. Give a check list for the result: product unchanged next to the original; true scale; believable light direction; no extra parts or props the buyer will not get; size meets the channel's minimum (Shopify's AI editor outputs about 1 megapixel).
4. Say how to save it: as a new file, keeping the original; with metadata kept on export.
5. For EU customers, flag whether a realistic scene might need an AI label, for me to check with an adviser.
6. Access: at level 1, give me the brief and checks. At level 2, upload the checked result to a draft. At level 3, publish it within my limits only after I approve this specific AI image, and log it.

Rules: never change how the product looks; never use AI to hide a flaw.
```
