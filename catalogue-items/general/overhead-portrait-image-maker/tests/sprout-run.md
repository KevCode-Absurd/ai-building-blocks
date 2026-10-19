# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The prompt itself is strong: correct overhead strength, light placed behind the camera, pouch matched to the brand file and shown closed at its resealable top, a made-up adult clearly flagged with no customer or result claims. The only slip is structural: sections are out of the shape's order and the NOT RUN items (no image made, product photo not checked) are scattered in the preamble instead of under their heading.

## Fix

In 'What you hand back', add: use the output shape's headings in its order every time, and always include a NOT RUN section listing the image step and any photo check that didn't run, even when that is the only thing skipped.

## Judge list

- Met: The camera is clearly above the face, not at eye level.
  "photo taken from directly above, looking straight down at an adult woman ... looking straight up into the lens"
- Met: The face is big at the top and narrows to the chin, without a bubble or an evenly swollen face.
  "forehead and eyes sit nearest the lens and look largest. Her face narrows gently toward a smaller chin" plus "rectilinear lens"
- Met: The face is lit, with no shadow from the camera.
  "sun comes from just behind and to one side of the camera and angles down onto her upturned face ... catchlights high in both eyes"
- Met: Skin has fine, uneven texture, not a waxy finish or a repeating pattern.
  "fine pores, small soft hairs, her own slight asymmetry and a light natural sheen" said once
- Met: Any product has the right label, shape and colour, at a size that looks real.
  "glossy deep green stand-up foil pouch ... big yellow wordmark, the yellow bear face at top right and '28 Daily Packs' ... true size ... against her lower cheek"

## What went in

```text
Brief: an adult woman in her thirties lying on a picnic blanket in
a sunny park, looking straight up into the lens, relaxed, smiling.
Holding our pouch beside her lower cheek. 4:5. No words.

Product photo attached: glossy deep green stand-up foil pouch, big
yellow wordmark, yellow bear face top right, "28 Daily Packs" at
the bottom. Opens only at its resealable top.

Brand look: bright, sunny, candy-like. Never clinical, never muted.
No identity photo. No camera reference photo.
```

## What came out

```text
I can write the prompt, but I can't make the picture here because no image tool is connected to this chat.

MISSING: identity photo. The woman below is a made-up adult.

Your product photo isn't visible to me in this chat, so the pouch is described from your brief. Step 1 couldn't check it against the photo. Attach the photo as Image 1 when you generate.

**Image roles**
- Image 1 is the product. Keep its exact shape, glossy deep green foil, big yellow wordmark, yellow bear face at top right, "28 Daily Packs" at the bottom, and the resealable top.
- No identity image. The person is newly described.
- No camera reference image.

**Prompt**
A bright, sunny photo taken from directly above, looking straight down at an adult woman in her mid-thirties lying on her back on a bubblegum-pink and white gingham picnic blanket in a sunlit park, looking straight up into the lens. The camera is about 35 cm above her face with an 18–20 mm lens feel, and it is a rectilinear lens. Her forehead and eyes sit nearest the lens and look largest. Her face narrows gently toward a smaller chin, and her shoulders and upper body shrink away below. Her face fills about two thirds of the frame width, with her whole head, hairline and chin in frame. The tall 4:5 frame shows her shoulders and a little of her upper body. Warm late-morning sun comes from just behind and to one side of the camera and angles down onto her upturned face. It lights her forehead and cheekbones and leaves only a small soft shadow under her nose, with bright catchlights high in both eyes. Her shoulder-length dark brown wavy hair fans out across the blanket around her head, and a few blades of green grass show at the blanket's edge. She has warm medium-brown skin, seen naturally up close with fine pores, small soft hairs, her own slight asymmetry and a light natural sheen. She wears a simple white cotton top with thin straps and has a relaxed, open, happy smile. In one hand she holds a glossy deep green stand-up foil pouch, upright and resting against her lower cheek and jaw at face height. It is shown at its true size, with a relaxed grip that suits a pouch of 28 daily packs. The front faces the lens and stays clear of her mouth, with the big yellow wordmark, the yellow bear face at top right and "28 Daily Packs" along the bottom all printed exactly as on the real pouch. The resealable top is closed, and nothing spills out. The colours are candy-bright, saturated and cheerful. No added words. The gingham lines stay straight, the face is in proportion for this distance, the eyes are sharp and the pouch's printing is crisp.

**Score: 100 / 100** (5 of 5 checks passed, 5 / 5 × 100). This scores the prompt, not an image.
- The pouch details come from your description, not the photo. Check the label against Image 1 once the image is made.

**To make the picture**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** Paste the prompt with the pouch photo attached and ask for the image. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude can make it there.
- **Claude Code:** Save an `OPENAI_API_KEY` (platform.openai.com/api-keys) or a `GEMINI_API_KEY` (aistudio.google.com/apikey), and I can send the prompt to that image API and save the file. OpenAI or Google bills each picture.
```
