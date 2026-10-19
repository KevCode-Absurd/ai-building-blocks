# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable set and prompt: the reference is read fully, the jar and its sweets are dropped, brand colours replace the reference's, and both frame sizes have a clear quiet area with the label kept clear of glint and shadow. The only soft spot is leaving the pouch as "sealed or with its top open", which hands one decision to the image model, and no test picture was made so the product match is unverified.

## Judge list

- Met: All five parts of the reading are filled in. None says "unclear".
  Light, Camera, Set, Frame, Finish all filled, e.g. "Key: low morning sun at 3 o'clock (camera right), about 25–30° above the sill."
- Met: The prompt never mentions the reference's product, brand or words.
  Prompt Roles: "Image 3 is the look reference: take only its light, camera and framing. Take nothing else from it." No jar or sweets named.
- Met: In the picture, the printed words match your real photo letter for letter.
  No picture made; prompt enforces "copy its shape, colours and printing exactly, including the yellow wordmark... and '28 Daily Packs'".
- Met: The product's shadow falls the same way as the rest of the scene.
  "A crisp shadow falls left across the cream sill" and "The tumbler's shadow and the dish's shadow fall left" with sun from right.
- Met: There's real empty space where words will go, and it survives in every size you asked for.
  3:2: "left 55% ... open, sunlit cream wall"; 4:5: "top 35% and the left side stay open cream wall".

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
**MISSING: job.** You gave the uses (email header, Facebook ad) but not the picture's job (identity, in use, texture or in its place). This set is built as **in its place**: the pouch living on the kitchen sill as part of the morning routine. That is what the reference implies. Tell me if you want a different job. The pouch's true size isn't given, so its scale comes only from Image 1 against a standard tumbler.

---

## 1. Product, written down

- **Product:** Sprout Original (Adults), Low Sugar gummies.
- **Pack:** glossy deep green foil stand-up pouch.
  - Large yellow wordmark, yellow bear face top right, "28 Daily Packs" at the bottom.
  - Resealable top is the only opening. Gummies come out of the top only.
- **Gummies:** as in the open-hand photo. Copy their shape and colour from it; never invent flavours or colours.
- **How people meet it:** eaten, one daily pack, by adults. It lives in the kitchen.
- **Shape:** an upright pack with a flat face, so it suits a near-level camera.
- **Surface:** shiny foil, so it will mirror the scene. It reflects only this sill, wall, window and sun.

## 2. Reading the reference as its set

- **Light**
  - **Key:** low morning sun at 3 o'clock (camera right), about 25–30° above the sill. A small, hard source, warm white.
  - **Fill:** soft bounce from the pale wall and sill. Shadow side light grey, never black.
  - **Shadows:** crisp-edged, falling left along the sill, mid-dark.
- **Camera**
  - **Position:** just above sill height, near level, a slight downward tilt.
  - **Distance and lens:** close, with a normal-to-short-tele feel (no wide distortion).
  - **Focus:** the subject is sharp with shallow focus. The garden through the window falls to soft blur.
- **Set**
  - **Place and surface:** a kitchen windowsill with a white painted sill and white wall.
  - **Background:** a window with a blurred garden behind it.
  - **Props:** the glass jar of sweets, which is the reference's own subject. No other props.
- **Frame**
  - **Subject:** in the right third, filling about a third of the frame height.
  - **Open area:** bright empty wall on the left.
  - **Motion:** none, a still life.
- **Finish:** clean, bright and high-key. Crisp contrast from the hard sun, natural saturation, no visible grain. Fresh morning mood.

## 3. Keep, swap, drop

- **Keep**
  - All the light: hard sun from the right, crisp shadows left, soft wall bounce.
  - The camera: sill height, close, shallow focus, garden blurred.
  - The frame: subject in the right third, bright quiet area left.
- **Swap**
  - White wall and sill become cream #FFF7DF.
  - The blurred garden becomes lush green leaning toward forest #00582D, with a few soft sunflower-yellow #FFCC2E blooms.
  - The glass jar becomes a small cream ceramic dish holding one day's gummies, set just left of the pouch. This is today's serving and gives scale to the gummies.
  - A plain clear tumbler of water sits behind the pouch on the right, partly hidden. It stands for the morning routine and gives scale to the pouch.
- **Drop**
  - The jar and its sweets, and any label, brand, words or logo on them.
  - No people or hands. The reference has none, and the job doesn't need them.
- **How the product is shown:** pouch upright, front face square to camera, whole and uncut, sealed or with its top open. Gummies appear only in the dish, as one serving.
- **Size:** the pouch at its true size from Image 1 against a standard tumbler. Gummies at true size against the dish.
- **Angle:** near level suits the upright pouch. Raise the camera slightly so the dish's gummies are visible.
- **Quiet area:**
  - **3:2:** left 55% of the frame, sunlit cream wall.
  - **4:5:** top 35% plus the left side, wall and the top of the window.
- **Brand colours win:** cream, forest green and sunflower yellow replace the reference's white and neutral greens. The result is bright and saturated, never muted.
- **Product safety in the sun:**
  - The sun's glint on the foil sits on the pouch's right edge or shoulder, never on the wordmark, bear face or "28 Daily Packs."
  - The tumbler's shadow and the dish's shadow fall left, away from the label.

## 4. The prompt

**Roles:**
- Image 1 is the real product pouch: copy its shape, colours and printing exactly, including the yellow wordmark, the yellow bear face top right and "28 Daily Packs" at the bottom.
- Image 2 is the real gummies: copy their shape, colour and finish exactly.
- Image 3 is the look reference: take only its light, camera and framing. Take nothing else from it.

**Scene:**
- A sunny kitchen windowsill early in the morning. The sill and wall are painted a warm cream.
- Behind the window, a lush green garden in deep forest greens with a few sunflower-yellow blooms, all softly out of focus.
- On the sill sit a small plain cream ceramic dish holding one day's serving of gummies, and a plain clear glass tumbler of water.

**Product in the scene:**
- The Sprout stand-up pouch stands upright on the sill in the right third of the frame, front face square to camera, whole and uncut, at its true size against the tumbler. The tumbler stands just behind it, slightly to the right.
- The dish of gummies sits on the sill just left of the pouch's base.
- The pouch is lit by the scene's sun from the right. A crisp shadow falls left across the cream sill.
- Its glossy green foil reflects only this sunlit sill, cream wall and window. One small bright glint sits on its right edge, clear of all printing.
- No hands, no people.

**Camera and light:**
- Camera just above sill height, nearly level, tilted down slightly.
- Close, with a natural normal-to-short-telephoto perspective and shallow depth of field.
- Pouch and gummies tack sharp. The garden is a soft, creamy blur.
- Hard, low morning sunlight from camera right, about 30° high, warm white.
- Crisp, defined shadows falling left. Soft bounce from the cream wall keeps the shadow side light and open.

**Finish:**
- A bright, sunny, candy-fresh palette: cream #FFF7DF, forest green #00582D, sunflower yellow #FFCC2E.
- Clean highs, crisp contrast, rich but natural saturation, no grain.
- Cheerful and warm, never clinical, never muted.

**Keep:**
- The pouch and gummies exactly as in Images 1 and 2, whole and uncut.
- No added words, logos or marks anywhere; the tumbler and dish are unmarked.
- No shadow, glint or prop crossing the wordmark, bear face or "28 Daily Packs."

**Frame, 3:2 email header version:**
- Wide 3:2 frame.
- Pouch in the right third, about 60% of frame height.
- The left 55% stays an open, sunlit cream wall and sill with only soft shadow, as clear space for words.

**Frame, 4:5 Facebook ad version:**
- Vertical 4:5 frame.
- Pouch lower right, about 50% of frame height, the label large enough to read at thumbnail size.
- The top 35% and the left side stay open cream wall and soft window light, as clear space for words.
```
