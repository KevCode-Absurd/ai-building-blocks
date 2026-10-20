# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The prompt follows the block's structure: Strong overhead setting, light placed behind the camera, pouch at cheek height with the correct details from the brief. It honestly says no image was made and the photo wasn't seen, and it marks gaps as MISSING.

## Judge list

- Met: The camera is clearly above the face, not at eye level.
  "A photo taken from directly above, camera looking straight down"; "about 35 cm above her face with an 18–20 mm rectilinear lens feel"
- Met: The face is big at the top and narrows to the chin, without a bubble or an evenly swollen face.
  "forehead and eyes are nearest the lens and largest, her face narrows toward a smaller chin"; rectilinear stated.
- Met: The face is lit, with no shadow from the camera.
  "Bright midday sun comes from just behind and beside the camera... small soft shadow under her nose, with a catchlight"
- Met: Skin has fine, uneven texture, not a waxy finish or a repeating pattern.
  "fine pores, small soft hairs, a little natural asymmetry and a light natural sheen" stated once.
- Met: Any product has the right label, shape and colour, at a size that looks real.
  Pouch held "flat against her lower cheek and jaw"; deep green, yellow wordmark, bear face top right, "28 Daily Packs".

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
PROMPT
A photo taken from directly above, camera looking straight down at a made-up adult woman in her thirties lying on her back on a bright yellow-and-pink gingham picnic blanket on sunny park grass, looking straight up into the lens. The camera is about 35 cm above her face with an 18–20 mm rectilinear lens feel, so her forehead and eyes are nearest the lens and largest, her face narrows toward a smaller chin, and her shoulders shrink away below, with some of her upper body visible in the tall 4:5 frame. Her whole head and chin sit inside the frame with a little space above the hairline. Her loose dark-brown wavy shoulder-length hair fans out across the blanket around her head. She has warm medium-tan skin, dark-brown eyes and a relaxed, open smile showing a hint of teeth. Bright midday sun comes from just behind and beside the camera, angled down onto her upturned face, lighting her forehead and cheekbones and leaving a small soft shadow under her nose, with a catchlight high in each eye and no squinting. At this distance her skin shows fine pores, small soft hairs, a little natural asymmetry and a light natural sheen. She wears a sunny coral cotton T-shirt. Her nearer hand rests a sealed, glossy deep-green stand-up foil pouch flat against her lower cheek and jaw at the same height as her face, not lifted toward the lens. The pouch has its big yellow wordmark, a yellow bear face in the top-right corner and "28 Daily Packs" printed at the bottom. Its resealable top is closed, its label faces the lens and sits clear of her mouth, and her relaxed grip suits a real handheld pouch. The colours are bright, saturated and candy-like, with no added words. The gingham lines stay straight, her face is in proportion for this distance, her eyes are sharp, and the pouch keeps its true shape, colours and printing at a believable size.

IMAGE ROLES
Image 1: the product. It sets the pouch's shape, glossy deep-green colour and printing (wordmark, bear face, "28 Daily Packs"). There is no identity photo, so the woman is a made-up adult, not a customer. There is no camera reference, so the camera position comes from the Strong setting.

NOT RUN
- Image not made: no image tool is connected here. To finish, paste the PROMPT plus the pouch photo into ChatGPT (GPT Image) or Gemini (Nano Banana), or into Higgsfield's image tool. In Claude Code with OPENAI_API_KEY or GEMINI_API_KEY saved, it can be sent to that API, which bills per picture.
- Product photo not visible to me: the pouch is described from your text. Checking the label, shape and colour against the photo is still to do.
- Image checks (angle, perspective, light, identity, product, words) not run, because no image was made.

MISSING: identity photo (made-up adult described instead)
MISSING: product photo, as seen (described from your text; the pouch's real size was inferred as handheld [inferred])

CHECKS MISSED: none
```
