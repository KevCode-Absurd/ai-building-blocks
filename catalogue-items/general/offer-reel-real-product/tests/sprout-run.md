# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable storyboard: every on-screen word traces back to the brief or brand.md, the price and renewal terms are both shown, and the product card correctly describes the Low Sugar pouch and its resealable top without pretending to see the photos. The layout percentages flagged by the code check are design choices from the skill's rules, not brand facts, and the MISSING list gives the owner a clear checklist before building.

## Judge list

- Met: Stopped for approval at each stage not already given; built nothing before APPROVED
  Card and sheets marked "[approved]" per the brief; storyboard ends "STOPPED: reply APPROVED to build."; Stage 5 "Waiting for APPROVED."
- Met: Product on screen in the first frame and identifiable by 2 seconds muted
  Hook shot 0.0–2.0 s: "Pouch fully in the first frame" with "Sprout / Superfood Gummies" title rising from frame 0.
- Met: Every storyboard word has a source; full price terms on screen
  Sources block cites each line; offer shot shows "$29.99", "first order with the text sign-up discount", "Renews at $49.99 each 4 weeks."
- Met: Something new every 2 to 4 seconds; end card 2 seconds or less
  New word/number every 1–2 beats in each shot; end card beats 33–36 = 16.0–18.0 s, "never frozen".
- Met: Product card matches brand file (variant, label words, how it opens); unseen photos asked for, not described
  "Original (Adults), Low Sugar, 28 daily packs", "28 Daily Packs at the bottom", "never shown torn"; "I can't see them... every photo match is still to check."

## What went in

```text
Purpose: a "reasons" reel for Sprout, 15 to 20 seconds.
Shapes: 9:16 and 4:5. Music: made in code. Voice: none.
Photos on file: the pouch on a soft gradient; an adult pouring
gummies into a hand.
Approved words and claims:
- "Rip. Tip. Enjoy."
- Title: "Sprout Superfood Gummies"
- "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack
- No water, no mixing, no shaker
- 2025 study, 12 weeks, 120 adults: vitamin C +40.1% (2.7x placebo)
Offer: $29.99 first order with the text sign-up discount. "Renews
at $49.99 each 4 weeks." Button text: "Start Now".
Colours: cream #FFF7DF, deep forest #002C17, sunflower #FFCC2E.
Fonts: Work Sans bold and medium, DM Mono.
Brand file: attached (brand.md).
Approvals: take the product card and sheets as approved. Stop at
the storyboard for my APPROVED.

[attached: sprout/brand.md]
```

## What came out

```text
```
STAGE 0  BRIEF
Purpose: "3 reasons" reel for Sprout Original (Adults), selling the first-order subscription offer. Feed placement, usually watched muted. The reel has to work with no sound.
Words (in order, each with its source):
  1. "Sprout Superfood Gummies": your brief (not found in brand.md; your approval stands as the source)
  2. "Rip. Tip. Enjoy.": brand.md › How the brand writes › lines the brand already uses
  3. "No water, no mixing, no shaker": your brief; brand.md › What it is ("No water, no mixing, no shaker.")
  4. "60+ ingredients, 21 vitamins & minerals, and 6g fiber" + "in 1 pack": brand.md › Claims › Fine to repeat (product page, science page). Uses "21", not the site's other "20+".
  5. "2025 study, 12 weeks, 120 adults" / "vitamin C +40.1%" / "(2.7x placebo)": brand.md › Products › Study (science page)
  6. "$29.99 first order with the text sign-up discount": your brief; brand.md › Prices (the "starts at" price for Original Adults, Low Sugar, 28 packs) + footer small print
  7. "Renews at $49.99 each 4 weeks.": your brief; brand.md › Prices (subscription renews at $49.99 every 4 weeks)
  8. "Start Now": your brief (button)
Offer: "$29.99 first order with the text sign-up discount. Renews at $49.99 each 4 weeks."
  Limits (from brand.md):
  - First order only, new customers only, and only if the text-message sign-up discount is received and used. Footer: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
  - Subscription to Original (Adults), Low Sugar, 28 packs.
  - Prices were captured late Sept to mid Oct 2026.
  No % off, free shipping, gifts, guarantee or urgency appears in the reel. None of these is in your approved words.
Length: 18.0 s (9 bars at 120 BPM)
Shapes: 9:16 (1080×1920) main, then 4:5 (1080×1350)
Music: written in code, 120 BPM, beats measured after render
Voice: none
End card: pouch, logo, "Start Now", renewal line kept on screen. 2.0 s, never frozen.
Never show:
  - The big pouch torn. It opens only at its resealable top.
  - A daily pack torn anywhere but straight across its top edge.
  - Cartoon tie-in characters or partner marks.
  - Limited-flavour gummies (red lemon slices, stars) standing in for Original.
  - Any unapproved claim (fix, weight loss, energy, immunity, "works", 4.8 stars, % off).

STAGE 1  PRODUCT CARD (approval 1) [approved]
Note: the two photos are named but I can't see them. The look below comes from brand.md, and every photo match is still to check.
Variant: Sprout Original (Adults), "Fresh & Sweet", Low Sugar, 28 daily packs. This is the only variant the $29.99 price applies to.
Photos:
  - front = pouch on soft gradient (cut out from its gradient)
  - hand = adult pouring gummies into a hand (also used as "use")
  - unpacked = MISSING
Never changes:
  - Pouch: glossy deep-green stand-up foil pouch, big yellow wordmark, yellow bear face top right, "28 Daily Packs" at the bottom.
  - No white burst. The white burst marks Sugar-Free, so check the photo is Low Sugar.
  - The pouch keeps its proportions, is never recoloured, and is never shown torn.
  - Gummies: small, opaque, soft matte deep-green bears, about thumbnail height.
  - Any daily pack in the hand photo must be torn straight across its top edge. If it's torn on the side or a corner, the photo is out.
  - If the gummies in the hand photo are red or star-shaped, it's the wrong flavour and the photo is out.

STAGE 2  PHOTO PICKS  Hero: front (pouch cut-out)  Reasons: hand for "Rip. Tip. Enjoy." and "No water, no mixing, no shaker"; front cut-out for "60+ … in 1 pack", the offer and the end card. Proof is type only, on deep forest.
Project folder: sprout-reasons-reel/ (fresh Remotion blank project plus Remotion agent skills). Photos go in sprout-reasons-reel/public/photos/:
  - front-pouch-original-low-sugar.png (clean-edge cut-out, no shadow baked in)
  - hand-pour.jpg (full photo, not cut out)
Fonts go in sprout-reasons-reel/public/fonts/ and the logo in public/logo/. Both are MISSING.
Folder not created yet. It's made in the coding agent after APPROVED.

STAGE 3  SHEETS (approval 2) [approved]
Product:
  - front cut-out, 9:16:
    - Hero: pouch 52% of frame height, centred-right, bottom edge at 90%.
    - "60+" shot: 46% height, bottom edge at 92%.
    - Offer and end card: 40% height, bottom edge at 92%.
    - 4:5: pouch 70% of frame height, right half, bottom edge at 94%.
  - Contact shadow is drawn in the film: a soft ellipse under the base, deep forest #002C17 at 22% opacity, blur 40 px, width 80% of the pouch. Nothing is baked in.
  - hand photo: a panel bleeding off the bottom and right edges, covering the lower 58% of 9:16 (right 55% of 4:5). Scaled as a whole, never stretched, traced or recoloured.
Style guide:
  Colours:
  - Cream #FFF7DF: base background. Source: your brief; brand.md hero background.
  - Deep forest #002C17: type on cream, dark sections. Source: your brief; brand.md headings/dark sections.
  - Sunflower #FFCC2E: the single accent, used on deep forest only (it's too weak on cream) and as the end-card button fill with deep forest text. Source: your brief; brand.md stars/badges.
  - Pouch green #00582D lives only inside the photo.
  - Kelly green #007E40 (the brand's button colour) is not used, because it would be a second accent.
  Type:
  - Display: Work Sans Bold. The brand's chunky display font wasn't supplied.
  - Text: Work Sans Medium.
  - Tag: DM Mono 40 px.
  - Main line in each shot is 200 px or more at 1080 wide. Nothing people need to read is under 28 px. The smallest readable line is 44 px.
  Rhythm: one hard cut per bar start at most; text events on beats and half-beats.
  Ways in: rise through mask (8 frames, ease out), build, card rising for the hand panel, grow from the pouch.
  Ways out: lift through mask (6 frames, ease in), get covered, hard cut on a bar start.
  Every held shot keeps a slow push of 1.00 → 1.05. No fades, crossfades, glows, bounces, particles, spins, corner labels, borders, or titles centred on a gradient.
  Sound: 120 BPM kit and pluck written in code. Effects:
  - Paper tick on "Rip."
  - Soft rattle on "Tip."
  - Wood blocks on number hits
  - Low "tock" on the button
LOCK LINES
  - Type never crosses the pouch label. Type sits above or left of the pouch.
  - All type is left-aligned at 120 px from the left edge (1080 wide), in sentence case.
  - 9:16 words, logo and price stay out of the top 14%, the bottom 35%, the left 6% and the right 15%. Usable text column: x 120–918, y 269–1248.
  - One accent per frame, sunflower, on one key word or figure only.

STAGE 4  STORYBOARD (approval 3)
BEAT GRID  120 BPM (beat = 0.5 s = 15 frames at 30 fps), 4/4, 9 bars = 36 beats = 18.0 s = 540 frames. Visual hits land 2 frames before each beat. Beats are measured from the rendered music, with a 15 ms worst-case target.
Marks:
  - hook = beat 1
  - how = beat 5
  - reason1 = beat 9
  - reason2 = beat 13
  - proof = beat 21
  - offer = beat 29
  - end = beat 33
  - loop = beat 37 (frame 540 = frame 0)

Beats | Time | On-screen words | Photo | Motion | Sound | New on screen
1–4 | 0.0–2.0 | "Sprout" (220 px) / "Superfood Gummies" (96 px), deep forest on cream | front cut-out | Pouch fully in the first frame; push 1.00→1.05. Title rises through mask from frame 0, settled by frame 6. | Kick and pluck chord on beat 1 | Product and name together at frame 0
5–8 | 2.0–4.0 | "Rip." (b5) / "Tip." (b6) / "Enjoy." (b7, sunflower), 200 px cream on deep forest | hand | Hard cut. Hand panel rises as a card from the bottom edge (8 frames); push 1.00→1.04. Each word rises on its beat. | Paper tick b5, rattle b6, clap b7 | New photo, then a new word every beat
9–12 | 4.0–6.0 | "No" 96 px + big word 200 px, each replacing the last: "No water," (b9) / "no mixing," (b10) / "no shaker" (b11, "shaker" sunflower) | hand | Panel keeps going; push into the palm 1.04→1.08. Each phrase lifts out (6 frames) before the next rises (8 frames). | Hat on each beat, wood block b11 | New phrase every beat
13–20 | 6.0–10.0 | "60+ ingredients," (b13) / "21 vitamins & minerals," (b15) / "and 6g fiber" (b17) / "in 1 pack" (b19). Number 220 px, words 72 px, deep forest on cream. | front cut-out | Hard cut. Pouch grows in from 0.96 to settle at 1.00, then pushes to 1.05. Each number rises and the last one lifts out. "in 1 pack" grows from the pouch top. | Wood block per number, kick b13 and b17 | New number every 2 beats
21–28 | 10.0–14.0 | "2025 study, 12 weeks, 120 adults" (b21, DM Mono 40 px) / "vitamin C" 96 px + "+40.1%" 240 px sunflower (b22) / "(2.7x placebo)" 64 px cream (b25) | none (type only, deep forest) | Hard cut. Tag types on in 8 frames. Figure rises through mask; slow push of the whole type group 1.00→1.04. | Kick b21, pluck rise b22, clap b25 | Tag, then figure, then placebo line
29–32 | 14.0–16.0 | "$29.99" 220 px / "first order with the text sign-up discount" 56 px / "Renews at $49.99 each 4 weeks." 44 px, deep forest on cream | front cut-out | Hard cut. Price rises (b29), condition builds (b30), renewal line builds (b31); push 1.00→1.04. | Kick b29, soft pluck b30–31 | Price, then condition, then renewal
33–36 | 16.0–18.0 | Logo (MISSING file) / "Start Now" button, sunflower fill with deep forest 64 px text / "Renews at $49.99 each 4 weeks." 44 px kept | front cut-out | Logo rises at the top (y 16–22%). Button rises as a card (b33) at y 56–62%. Pouch push 1.00→1.05 to the last frame, never frozen. Hard cut to frame 0 on loop. | Tock b33, last chord rings into the loop | Logo and button; loops cleanly to the hook

First and last frames per shot:
  - Hook: first is pouch and title at frame 0; last is the push at 1.05.
  - Rip: first is cream-on-forest "Rip." rising; last is all three words.
  - No water: first is "No water,"; last is "no shaker" at palm crop 1.08.
  - 60+: first is pouch at 0.96 with "60+"; last is "in 1 pack" above the pouch.
  - Proof: first is the tag typing; last shows all three lines.
  - Offer: first is "$29.99" rising; last shows all three lines.
  - End: first is the logo and button rising; last is the push at 1.05, which matches the hook cut.

9:16 notes:
  - All words sit in y 269–1248 px, x 120–918 px.
  - The pouch may sit in the bottom 35% (the product isn't text), but its label never sits under type.
  - The hand panel's type zone is the forest area above the panel.

4:5 notes:
  - Type column on the left 52% (x 120–560).
  - Pouch and hand panel on the right.
  - Sizes: main lines stay 200 px; the phrase lines in the "No water" and price shots drop to 180 px if they wrap past x 560.
  - Same timings.

Sources:
  - "Sprout Superfood Gummies" = your brief (title not in brand.md)
  - "Rip. Tip. Enjoy." = brand.md, brand lines
  - "No water, no mixing, no shaker" = brand.md › What it is
  - "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack = brand.md › Fine to repeat (product page, science page)
  - Study line, "vitamin C +40.1%", "(2.7x placebo)" = brand.md › Study (science page: 2025, 12 weeks, randomized, double-blind, placebo-controlled, 120 healthy adults)
  - "$29.99 first order with the text sign-up discount" = your brief; brand.md prices table plus footer SMS small print
  - "Renews at $49.99 each 4 weeks." = your brief; brand.md prices table
  - "Start Now" = your brief
  - Voice cost: none (no voice)
STOPPED: reply APPROVED to build.

STAGE 5  BUILD, REVIEW, RENDER  Waiting for APPROVED. This chat has no coding agent or video tool connected, so nothing is built or rendered here. After APPROVED, run this stage in Claude Code with Remotion, where it will:
  - Build the code.
  - Measure the beats.
  - Run at least 3 review rounds on rendered frames.
  - Render the finals in this order: 9:16, then 4:5, each at −14 LUFS with true peak −1 dBTP or lower.
  - Hand back the review log and file paths.

MISSING:
  - unpacked photo: a daily pack torn straight across its top with gummies. It would prove "in 1 pack" and "Rip." That shot uses the pouch until this photo exists.
  - Logo file (vector) for the end card.
  - Font files: Work Sans Bold and Medium, DM Mono.
  - The brand's chunky display font (name and file). Work Sans Bold stands in.
  - Confirmation that the pouch photo is Original Low Sugar (no white burst).
  - Confirmation that the hand photo shows Original green bears and a top-edge tear.
  - Photo resolution and usage rights for both photos.
  - Where "Sprout Superfood Gummies" appears on the brand's own pages. It's approved by you but not in brand.md.
  - Offer end date, and a recheck of the live $29.99 / $49.99 prices before launch. They were captured Sept–Oct 2026.
  - Your decision on whether the proof line may say "in the blood". brand.md says "blood vitamin C up 40.1%". This wording is not added without approval.
  - Your decision on whether the ad carries the FDA disclaimer line. The site footer has it; the brand's ads don't. Not added without approval.
  - Your decision on whether the end-card button should use kelly green #007E40, the brand's button colour. It currently uses sunflower to keep one accent.
```
```
