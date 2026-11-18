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
2. Choose a source-preserving layout first. If a new scene is needed, brief a separate product-free background with compatible camera angle and light; retain the untouched original in the editable composition. Follow the host's authorized image tools and their instructions, including the installed imagegen skill where available; keep any native-subscription-only restriction and no paid API when forbidden. If the allowed tools cannot preserve a clean cutout, use the complete original photograph in a designed panel. Do not invent scale cues without dimensions and a real scale reference.
3. For a reference-image edit, write exactly what may change and the critical product features that must remain. State that the prompt cannot guarantee unchanged pixels. Compare actual returned output with the exact original at full size and in matched detail crops: silhouette, settings/prongs/bezel edges, connectors, visible stone count/arrangement, facets, colour, finish, label and logo. Then check contact shadow, crop and actual resolution. Record fail for changed features and blocked for features too soft or hidden to compare. A larger file is not new captured detail.
4. Say how to save it: as a new file, keeping the original; with metadata kept on export.
5. For EU customers, flag whether a realistic scene might need an AI label, for me to check with an adviser.
6. Access: at level 1, give me the brief and checks. At level 2, upload the checked result to a draft. At level 3, publish it within my limits only after I approve this specific AI image, and log it.

Rules: never change how the product looks; never use AI to hide a flaw. Exclude any identity-drifting result from the finished product variants, even for private review; a disclaimer does not cure it. Keep rejected attempts separate only as evidence, deliver an actual editable layout using the unchanged source, and specify the real photograph needed for each unsupported angle or detail. Do not infer SKU, materials or rights from appearance. Use workflows/verified-media-delivery.md for the per-file evidence and handoff.
```
