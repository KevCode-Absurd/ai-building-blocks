---
name: captions-and-text-for-sound-off
description: "Captions and on-screen text for one video ad so it makes its point with the sound off, inside every placement's safe zone. Starts with a muted watch that records what a viewer understands at three seconds, ten seconds and the end, then writes two layers: word-accurate burned-in captions and a short headline layer that carries the point, proof and disclosure. Sets size, contrast and position rules, checks each placement's buttons and crops on a phone with the platform's own overlay, supplies a caption file for platforms that accept one, and handles Hindi, Hinglish and regional scripts. Use before any video ad launches, when ads lean on a voice most people never hear, or when text keeps getting hidden by buttons."
---

# Captions and on-screen text for sound-off viewing

**You get:** a caption and text sheet for one video ad: a muted-watch record, a timed headline layer, a word-accurate caption file (SRT), style rules for size, contrast and position, and a safe-zone check for each placement, ready for the editor to apply.

## When to use

- A video ad is about to launch and nobody has watched it muted.
- The ad's point lives in the voice, and the voice is all most feed viewers never hear.
- Text keeps landing under the platform's buttons, captions or profile name.
- The store runs ads in more than one language or script.

## Not for

- Writing the openers themselves: use `ad-opener-writer`.
- Cutting the ad: use `cut-raw-footage-into-ad-variants`.
- Making extra sizes of an ad: use `resize-ads-for-every-placement`.
- Checking the claims in the text: use `check-ad-copy-for-policy-and-claims` (this skill only places approved claims).

## What you need

Required:

1. **The edited video** (or a locked cut) and its script.
2. **Approved claims list** (`product-claims-profile`).
3. **Placements** it will run in: Reels, Stories, feed, TikTok, Shorts, in-stream.
4. **Brand fonts and colours**, or permission to use a plain system font.
5. **Language and script** of each version.

Optional: the account's past opener results, and the brand's voice guide (`brand-voice-guide`).

Access: read only. Uploading caption files into Ads Manager is draft access (level 2); the ad launches only with the client's yes.

## Before you start: the gates

1. **The cut is locked.** Captions timed to a cut that changes will drift. Fail: wait for the lock.
2. **Claims approved.** Every number or result in the text is on the approved list. Text cannot add claims the voice did not make.
3. **Disclosure known.** If a creator or customer was paid, gifted or told they might be featured, the disclosure goes on screen, early, not only in the caption field [MCR-6060].
4. **Fonts licensed** for ads, or use a free font with an open licence (the Noto family covers Indian scripts).
5. **Money.** Gross profit per order is known from delivered costs [MEA-0037], so the text's offer can be checked against what the store can afford.

## Steps

### 1. Watch it muted

Watch the ad on a phone with sound off. Write down what you understand at 3 seconds, at 10 seconds and at the end. Then write what the ad needs a viewer to understand at each point. Every gap is a line of text to add.

### 2. Write the headline layer first

This layer carries the point. Rules:

- **Opening text:** five to eight plain words, in words the buyer uses [ORG-0016]. On most direct-response video ads, the opening copy does more work than the visual or the audio [MCR-0063]; music-led and fashion ads are the exception.
- Treat it as one of three hook levers with the spoken line and the first visual; they must say the same thing [MCR-0028].
- **Middle:** one line per proof moment ("Same shirt, 30 washes later"), shown while the proof is on screen.
- **End:** product name, the live offer exactly as on the page, and where to buy.
- **Disclosure:** short and plain ("Paid partnership", "Customer received free product"), on screen in the first seconds and readable.
- Video reviews get a short text headline so muted viewers know what the customer is saying [LPG-0049].

### 3. Write the captions

- Transcribe the voice word for word. Auto-captions are a start; a person checks every word, product name, number and unit.
- Remove filler words only if the meaning stays the same. Never change what a customer or creator said.
- Break lines at natural pauses: one or two lines, about 32 to 42 characters each (practitioner default; test readability at phone size).
- Show each caption long enough to read twice. If a line flashes by, split the sentence.
- Numbers as digits, units written as spoken.
- AI-made captions do not need an AI disclosure; YouTube lists caption creation as a minor use [MCR-6064].

### 4. Set the style

- **Size:** caption text at least the height of a thumbnail's fingertip on a phone. Practitioner default: 48 px or larger on a 1080 px wide frame for captions, bigger for the headline. Check on a real phone, not a desktop preview.
- **Contrast:** dark text on a light box or light text on a dark box. Aim for the 4.5 to 1 contrast ratio the web accessibility standard (WCAG) asks for body text.
- **Weight:** medium or bold. No thin script fonts.
- **One position** for captions through the ad; the headline layer may move to avoid the product.
- Never cover the product, the face during an emotional line, or the proof.

### 5. Check every safe zone

Each placement covers parts of the frame with buttons, names, captions or progress bars:

- **Reels, Stories, TikTok, Shorts (9:16):** keep text off the top band (profile name and close button), the bottom third (caption text and call-to-action button) and the right edge (like and share buttons). Widely used figures for Meta Reels ads are about 14% top, 35% bottom and 6% each side kept clear; confirm against the safe-zone template in Meta's current Ads Guide on the day.
- **TikTok:** check with the safe-zone overlay in TikTok's own creative tools; the right-side buttons sit lower and wider than on Reels.
- **Feed 4:5:** the 9:16 file is cropped top and bottom. Text placed for 9:16 must also sit inside the centre 1080 x 1350 area.
- **In-stream and YouTube:** the bottom carries the skip button and progress bar.

Export a still at each key moment, lay the platform's overlay on it, and fix anything covered.

### 6. Make language versions

- Each language is its own caption file and headline layer, checked by a fluent reader.
- **India:** decide per audience between Hindi in Devanagari, Hinglish in Latin letters, or a regional language. Many urban buyers read Hinglish faster than Devanagari; small-town and regional buyers may prefer their own script. Use a font that renders the script correctly, including conjunct letters. Do not mix two scripts in one line.
- **US:** a Spanish version only where the store serves Spanish-speaking buyers, with Spanish support on the landing page.

### 7. Upload the caption file

Export an SRT file per language. Upload it wherever the platform accepts caption files for ads (Meta Ads Manager and YouTube do). Keep burned-in captions too: uploaded captions are often off by default for viewers.

### 8. Run the final muted test

A person who has not seen the ad watches it muted on a phone, then says what it is selling, the main benefit and what to do next. If any answer is wrong, fix the headline layer and test again.

## Checks before you hand it over

- The muted viewer named the product, the benefit and the action correctly.
- Opening text is eight words or fewer and matches the first visual and spoken line.
- Captions match the voice word for word, with names and numbers checked.
- No text sits under any placement's buttons, names or crop lines.
- Contrast passes on every line, on a phone, outdoors brightness included.
- Disclosure is on screen early where required.
- Every claim in text is on the approved list; the offer matches the live page.
- Each language version was checked by a fluent reader.

## Output

**One-screen summary:** ad name, placements, languages, the muted-watch result before and after, and any line that was cut or changed.

**Headline layer:**

| In | Out | Text | Position | Purpose (hook, proof, offer, disclosure) |
|---|---|---|---|---|
| 0:00.0 | 0:02.5 | | Upper middle | Hook |

**Caption file:** one SRT per language, named `adname_lang.srt`.

**Style card:** font, size, weight, text colour, box colour and opacity, contrast ratio, caption position.

**Safe-zone check:** Placement, Frame checked, Overlay used, Covered items found, Fixed (Y or N).

**Muted-test record:** Tester, Date, What it sells, Main benefit, Next action, Pass or fail.

## Common mistakes

- **Captions only, no point.** Word-for-word captions of a slow intro still say nothing. Step 2 writes the headline layer first.
- **Text under the buttons.** Step 5 checks each placement with the platform's overlay.
- **Auto-captions shipped as is.** Product names and numbers come out wrong. Step 3 has a person check every word.
- **Text adding claims.** Gate 2 keeps text inside the approved list.
- **Disclosure only in the post caption.** Gate 3 puts it on screen.
- **Mixed scripts in one line.** Step 6 picks one script per version.

## Sources

- LPG-0049: video reviews need a text headline for muted viewers.
- MCR-0028: a hook is spoken line, text and visual.
- MCR-0063: opening copy carries most of a video hook.
- MCR-6060: disclosures on screen and spoken, early.
- MCR-6064: AI captions are a minor use with no disclosure needed.
- MEA-0037: gross margin uses delivered cost.
- ORG-0016: on-screen hook text five to eight words.

What makes this skill ours: it starts and ends with a muted test by a fresh viewer, not a style checklist; it writes a headline layer that carries the point before word-for-word captions; safe zones are checked frame by frame with each platform's own overlay rather than one remembered number; and Indian script choice (Devanagari, Hinglish or regional) is decided per audience.
