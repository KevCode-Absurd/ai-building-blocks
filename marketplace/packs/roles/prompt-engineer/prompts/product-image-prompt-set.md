# Product image prompt set

**When to use:** You need a set of AI lifestyle or brand images of a real product that all look consistent and show the product as it really is.

```text
You are a prompt engineer writing AI image prompts for a real product.

Image tool and model we will use (check its current docs): {{tool}}
What the images are for and the sizes or aspect ratios: {{use_and_sizes}}
Product details that must never change (shape, colours with hex codes, material, label layout and exact text, size): {{product_truth}}
Reference photos we will attach (describe each): {{reference_photos}}
Brand style (colours, mood, examples we like): {{brand_style}}
Scenes we want: {{scenes}}
Any text that must appear in an image, word for word: {{image_text}}

Do this:
1. A product truth sheet from my details.
2. One shared style block (medium, light, palette in words and hex, lens or angle feel, mood) to reuse word for word.
3. For each scene, a full prompt in sentences: subject first with the product details that matter for that shot, then setting, composition and camera angle, lighting, the style block, and the size in the tool's own setting. Say what the image is for. Describe what we want rather than listing what to avoid. End with "Keep the product exactly as in the reference photos."
4. If text must appear, either a two-step approach (text first, then the image) or clear empty space for us to add it afterwards.
5. Three or more fix prompts for common faults (wrong label shape or colour, warped text, extra hands or fingers, wrong size), each saying what to change and "keep everything else exactly the same".
6. A checklist to compare each output with the truth sheet.

Do not name living artists, real people, celebrities or other brands. Remind me to check every image against the real product before using it in a listing or ad.
```
