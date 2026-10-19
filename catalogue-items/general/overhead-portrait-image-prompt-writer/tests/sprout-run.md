# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The prompt follows the skill closely: overhead camera at a stated distance, sensible light, product at face height with its real label details, and no added words. It is honest that no image was made and that the woman is a made-up adult, so the owner can paste it straight into an image tool.

## Judge list

- Met: The camera is clearly above the face, not at eye level.
  "A photo taken from directly above, looking straight down"; camera "about 35 cm above her face" with rectilinear lens.
- Met: The face is big at the top and narrows to the chin, without a bubble or an evenly swollen face.
  "forehead and eyes are nearest the lens and largest, her face narrows toward a smaller chin"; rectilinear lens named.
- Met: The face is lit, with no shadow from the camera.
  "sunlight comes from just behind and beside the camera... so the camera's shadow falls clear of her"
- Met: Skin has fine, uneven texture, not a waxy finish or a repeating pattern.
  "fine pores, small soft hairs, her own natural asymmetry and a light natural sheen" said once.
- Met: Any product has the right label, shape and colour, at a size that looks real.
  Pouch at cheek and jaw at face height, wordmark, bear face and "28 Daily Packs" described, label clear of mouth.

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
**Prompt**

A photo taken from directly above, looking straight down at a made-up adult woman in her thirties lying on her back on a bright yellow-and-pink gingham picnic blanket in a sunny park, looking straight up into the lens with a relaxed, open smile. She has warm medium-brown skin, dark shoulder-length curly hair spread loosely across the blanket around her head, and full brows. The camera is about 35 cm above her face with an 18 to 20 mm lens feel and a rectilinear lens. Her forehead and eyes are nearest the lens and largest, her face narrows toward a smaller chin, and her shoulders and a coral-pink t-shirt shrink away below, with some of her body visible down the tall 4:5 frame. Her whole head and chin sit inside the frame. Bright sunlight comes from just behind and beside the camera, angled down onto her upturned face, so the camera's shadow falls clear of her. The light catches her forehead and cheekbones, leaves a small shadow under her nose, and puts catchlights high in both eyes. Her skin shows fine pores, small soft hairs, her own natural asymmetry and a light natural sheen. Patches of saturated green grass and a scatter of bright candy-coloured picnic items sit at the blanket edges, all in a sunny, cheerful palette. One hand rests a glossy deep green stand-up foil pouch upright against her lower cheek and jaw, at face height and not raised toward the lens. The front faces the lens and stays clear of her mouth, showing the big yellow wordmark, the yellow bear face at top right and "28 Daily Packs" printed along the bottom. The pouch is sealed at its resealable top, and her relaxed grip suits its real size. There are no added words beyond the pouch's own printing. The gingham lines stay straight, the face is in proportion for this distance, her eyes are sharp, and the pouch keeps its true shape, colours and size.

**Image roles**
- Image 1 is the product: keep its shape, glossy deep green foil, yellow wordmark, yellow bear face top right, "28 Daily Packs" at the bottom, and its resealable top as the only opening.
- No identity image: the woman is a made-up adult, not a customer or reviewer.
- No camera reference image: strength set to Strong (about 35 cm, 18 to 20 mm feel).

MISSING: identity photo. The woman is a made-up adult described in the prompt.

Not run: image generation and inspection (steps 9 and 10). No image was made or checked.
```
