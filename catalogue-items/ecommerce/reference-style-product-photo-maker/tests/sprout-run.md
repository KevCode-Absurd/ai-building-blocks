# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable prompt: it keeps the reference's sun, camera and framing, swaps the jar for the real pouch and a dish of gummies, pushes to brand colours, and gives a text-safe quiet area for both sizes. Nothing is invented, the pouch is kept closed and front-on as the brand requires, and the owner gets clear steps to make the image elsewhere.

## Judge list

- Met: All five parts of the reading are filled in. None says "unclear".
  Light, Camera, Set, Frame and Finish each filled; inferred lines marked "(guess)", none says "unclear".
- Met: The prompt never mentions the reference's product, brand or words.
  Prompt: "Image 3 is the look reference: take only its light, camera and framing." No jar, sweets or label named in the prompt.
- Met: In the picture, the printed words match your real photo letter for letter.
  No picture made; prompt asks "copy its shape, colours and printing exactly" and "printing unaltered". Judged on prompt.
- Met: The product's shadow falls the same way as the rest of the scene.
  "Morning sun from the right... The pouch and dish cast crisp, short shadows falling left across the sill."
- Met: There's real empty space where words will go, and it survives in every size you asked for.
  3:2: "The left half is calm, empty cream wall"; 4:5: "The left side and the top third are calm, empty cream wall."

## What went in

```text
Product: Sprout Original (Adults), Low Sugar. Attached: the pouch
front on, and gummies in an open hand. Glossy deep green stand-up
foil pouch, big yellow wordmark, yellow bear face top right, "28
Daily Packs" at the bottom. Opens only at its resealable top.

Reference (attached): a photo I like of a glass jar of sweets on a
white kitchen windowsill. Hard morning sun from the right, crisp
shadows falling left. Jar sharp, a garden behind the window
blurred. Shot from just above sill height, close. Jar in the right
third, bright empty wall on the left.

For: an email header (3:2) and a Facebook image ad (4:5), with
words added later.

Brand look: cream #FFF7DF, forest green #00582D, sunflower yellow
#FFCC2E. Bright, sunny, candy-like. Never clinical, never muted.
```

## What came out

```text
No image tool is connected in this chat, so I'll write the prompts, and you'll make the pictures elsewhere (see the end).

**Product spec (short):** Sprout Original (Adults), Low Sugar. A glossy deep green foil stand-up pouch with a big yellow wordmark, a yellow bear face at top right and "28 Daily Packs" at the bottom. It opens only at its resealable top. People meet it by eating it: a few gummies in an open hand, taken daily, at home.

## The reading

I read the reference from your description, so lines marked *(guess)* are inferred.

**Light**
- Key light is hard morning sun from about 3 o'clock, low *(guess)*, small source and warm *(guess)*.
- Fill is a soft bounce off the white wall and sill *(guess)*.
- Shadows fall left, crisp, mid-dark *(darkness is a guess)*.

**Camera**
- Height is just above the sill, angled slightly down, close.
- Lens feel is normal to short-long *(guess)*.
- The jar is sharp. Focus is shallow, and the garden behind is blurred.

**Set**
- Place is a kitchen windowsill. Surface is a white painted sill.
- Background is the window with a blurred garden.
- Props: the glass jar of sweets, which is the reference's own product. No other props are known *(guess)*.

**Frame**
- The subject sits in the right third and fills about a third of the picture *(guess)*.
- The open area is the bright empty wall on the left.
- There is no motion.

**Finish**
- Palette is whites with soft garden greens *(guess)*.
- Contrast is high from the hard sun and saturation is moderate *(guess)*.
- Grain is none to slight *(guess)*.
- Mood is fresh and morning.

## Keep, swap, drop

**Keep**
- Hard low sun from the right, with crisp shadows falling left.
- Camera just above sill height, close, with shallow focus and a blurred garden.
- Subject in the right third, with open wall on the left.

**Swap**
- The glass jar becomes the Sprout pouch, standing upright and closed on the sill, front-on.
- Add one prop from real use: a small sunflower-yellow ceramic dish beside the pouch on the left. It holds the gummies exactly as they appear in the hand photo, with the same shape, colour and count.
- The white wall becomes cream #FFF7DF.
- The garden blur leans toward forest green #00582D.
- The sunlight's warmth is pushed toward sunflower yellow #FFCC2E.

**Drop**
- The jar, its sweets and any label or brand on it.
- Any words or people from the reference.

**Settle**
- **How it's shown:** the pouch is closed and upright, with its daily serving of gummies in a dish. I have no photo of a single daily pack, so none is shown.
- **Scale:** the dish gives the familiar size. Confirm the pouch's real height so the dish can be sized against it.
- **Angle:** a stand-up pouch suits a near-level camera. Keep it front-on, because only the front was photographed.
- **Quiet area:** the cream wall on the left in both sizes. In 4:5 the quiet area also runs along the top.
- **Shiny foil:** the pouch reflects only this scene, meaning the window and the sun. The sun's hot spot sits low on the right edge, clear of the bear face and the wordmark.

## Prompt

**Roles:** Image 1 is the real product, the Sprout Original (Adults) Low Sugar pouch: copy its shape, colours and printing exactly. Image 2 is the gummies in an open hand: copy only the gummies' shape, colour and look. Image 3 is the look reference: take only its light, camera and framing.

**Scene:** A sunny kitchen windowsill in early morning. The sill is smooth painted cream, and the wall behind the left side of the sill is plain cream (#FFF7DF). Through the window on the right is a garden, fully out of focus as soft forest-green and sunlit yellow-green shapes. A small glossy sunflower-yellow ceramic dish sits on the sill just left of the pouch, holding a few gummies exactly like those in Image 2.

**Product in the scene:** The pouch stands upright and closed on the sill in the right third, front facing the camera. It fills about a third of the frame height-wise and is whole, with nothing cut off. Morning sun from the right lights it, with a natural glossy foil sheen. The one bright highlight sits low on the right edge, never on the bear face, wordmark or "28 Daily Packs". The pouch and dish cast crisp, short shadows falling left across the sill. No hands.

**Camera and light:** Shot from just above sill height, angled slightly down, close, with a normal-to-short telephoto feel. The pouch and its printing are pin sharp, and focus falls off quickly so the garden melts into blur. Key light is hard, low, warm morning sun from camera right. Soft fill comes from the bright cream wall and sill, so the front of the pouch reads clearly.

**Finish:** Bright, sunny, candy-like. Cream highlights, rich forest greens, warm sunflower-yellow light. Clean, high-key, saturated but natural, with fine detail and no muddy tones. Never clinical, never muted.

**Keep:**
- The product exactly as in Image 1, whole and uncut, with printing unaltered.
- No added words, logos, marks or labels anywhere.
- No people.
- A clear, empty cream area for text, as set out in the frame line below.
- The frame size and shape exactly as stated.

**Frame, email header:** 3:2 landscape. The pouch and dish are in the right third. The left half is calm, empty cream wall and sill.

**Frame, Facebook ad:** 4:5 portrait. The pouch and dish are in the lower right third. The left side and the top third are calm, empty cream wall.

Make the 3:2 first as the test. Check it at full size beside the pouch photo: the printing, the bear face and the shadow direction. Then make the 4:5.

SCORE 100/100 (4 of 4 checks)

## How to finish it

- **ChatGPT or Gemini:** paste the prompt into a chat with the pouch photo, the hand photo and the reference attached in that order, then ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt and the three images into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, the prompt can be sent to that image API and the file saved. Get a key at platform.openai.com/api-keys or aistudio.google.com/apikey. Each picture is billed by OpenAI or Google.
```
