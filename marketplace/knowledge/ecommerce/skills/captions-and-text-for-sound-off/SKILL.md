---
name: captions-and-text-for-sound-off
description: "Captions and on-screen text for one video ad so it makes its point with the sound off, inside every placement's safe zone. Starts with a muted watch that records what a viewer understands at three seconds, ten seconds and the end, then writes two layers: word-accurate burned-in captions and a short headline layer that carries the point, proof and disclosure. Sets size, contrast and position rules, checks each placement's buttons and crops on a phone with the platform's own overlay, supplies a caption file for platforms that accept one, and handles other languages and scripts your buyers read. Use before any video ad launches, when ads lean on a voice most people never hear, or when text keeps getting hidden by buttons."
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
4. **Fonts licensed** for ads, or use a free font with an open licence (the Noto family covers most of the world's scripts).
5. **Money.** Gross profit per order is known from delivered costs [MEA-0037], so the text's offer can be checked against what the store can afford.

## Steps

### 1. Watch it muted

Watch the ad on a phone with sound off. Write down what you understand at 3 seconds, at 10 seconds and at the end. Then write what the ad needs a viewer to understand at each point. Every gap is a line of text to add.

Then score the muted watch, shot by shot. For each shot, write only what can be seen (people, product, text, movement) and one line on what a silent viewer learns from it. Run five checks:

| Check | Pass when |
|---|---|
| Main claim | The ad's main claim shows as a picture, a demonstration or written text, not only in the voice |
| Opening | The first shot is a striking picture of the problem or the product, not a logo, an empty scene or a face talking with no picture of the point |
| Product and brand | The product is clearly seen and the brand name or logo appears on screen (note the shot for each) |
| Sells before it entertains | The product and its benefit show up before or alongside any joke or story; the funny part would not stand without the product |
| Every spoken point has a picture | No spoken line carries meaning that no shot shows |

Score = checks passed / checks counted x 100, with the sum shown. The muted watch passes only if the main claim, opening and product and brand checks all pass, whatever the score. For each spoken line with no picture, write a replacement shot or a text line using only what the product and the script already contain. If the fix needs a new shot, send it back to `cut-raw-footage-into-ad-variants` before captions go on.

### 2. Write the headline layer first

This layer carries the point. Rules:

- **Opening text:** five to eight plain words, in words the buyer uses [ORG-0016]. On most direct-response video ads, the opening copy does more work than the visual or the audio [MCR-0063]; music-led and fashion ads are the exception.
- Treat it as one of three hook levers with the spoken line and the first visual; they must say the same thing [MCR-0028].
- **Middle:** one line per proof moment ("Same shirt, 30 washes later"), shown while the proof is on screen.
- **End:** product name, the live offer exactly as on the page, and where to buy.
- **Disclosure:** short and plain ("Paid partnership", "Customer received free product"), on screen in the first seconds and readable.
- Video reviews get a short text headline so muted viewers know what the customer is saying [LPG-0049].

Pick the middle moments in this order, and stop once a muted viewer can say what it is, why it matters and what to do next:

1. **The name:** the product name or a plain description, the first time it is clearly in view, set beside it, never across it.
2. **The proof:** the one number or fact the script gives, shown while it is said.
3. **The missable step:** in a demo, a step a muted viewer could miss, in 2 to 4 words.
4. **The next step:** the offer, guarantee or action at the end, unless a caption already covers it.

Rules for each line: the shortest unbroken phrase from the approved script or copy that makes sense alone, usually 2 to 4 words, and preferably the words spoken in that scene so what is read matches what is heard. No feelings ("so good"), nothing a caption already says, and nothing over a stretch where the picture does the work (a pour, a reveal, a wordless opener). Time it to come in just after the matching words begin and to stay at least 1.5 seconds, at no more than about 15 characters a second. Ceiling: one text line per 6 to 8 seconds, so two for a 15-second ad and three to five for 30 seconds; a ceiling, not a target. If the opening is captioned, keep the first 1.5 seconds free of extra text. Changing only the overlay on a proven hook is a cheap new variant to test [MCR-6743].

### 3. Write the captions

- Transcribe the voice word for word. Auto-captions are a start; a person checks every word, product name, number and unit.
- Remove filler words only if the meaning stays the same. Never change what a customer or creator said.
- Break lines at natural pauses: one or two lines, about 32 to 42 characters each (practitioner default; test readability at phone size).
- Show each caption long enough to read twice. If a line flashes by, split the sentence.
- **Reading speed:** characters on screen divided by seconds shown stays at 17 characters a second or less. If a group runs faster, split it or let it start a little early; never change the words to make it fit.
- **Group by phrase:** fill a line before breaking it, and break at the biggest phrase boundary that fits (after punctuation, then before "and", "but", "so" or a preposition). Never split an article from its noun, a name, a pronoun from its verb, a verb from its object, or a number from its unit.
- **Never across a cut:** a caption group never runs over a cut. If a sentence spans two clips, each clip gets its own group.
- A sound that carries meaning (a pack ripping, a laugh) may get a short cue in brackets.
- Numbers as digits, units written as spoken.
- AI-made captions do not need an AI disclosure; YouTube lists caption creation as a minor use [MCR-6064].

### 4. Set the style

- **Size:** caption text at least the height of a thumbnail's fingertip on a phone. Practitioner default: 48 px or larger on a 1080 px wide frame for captions, bigger for the headline. Check on a real phone, not a desktop preview.
- **Contrast:** dark text on a light box or light text on a dark box. Aim for the 4.5 to 1 contrast ratio the web accessibility standard (WCAG) asks for body text.
- **Weight:** medium or bold. No thin script fonts.
- **Brand font, measured for real:** load the actual font file (.ttf or .otf) before measuring line length; a font name alone is not enough, and the editor never falls back to Arial or another family. If the file is missing, ask once and mark the font checks blocked. Letters in a brand colour with a thin outline or soft shadow in a darker brand colour so they read on any background.
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
- **Scripts:** decide per audience which language and script to use (Arabic reads right to left; Chinese, Japanese and Korean need larger sizes and shorter lines). Use a font that renders the script correctly, including joined letters. Do not mix two scripts in one line.
- **US:** a Spanish version only where the store serves Spanish-speaking buyers, with Spanish support on the landing page.
- **Canada, Belgium, Switzerland and other multilingual markets:** a version per official language the store serves; in Quebec, French must be at least as prominent as English.

### 7. Upload the caption file

Export an SRT file per language. Upload it wherever the platform accepts caption files for ads (Meta Ads Manager and YouTube do). Keep burned-in captions too: uploaded captions are often off by default for viewers.

Deliver three files per version: the clean video with no text, the captioned video, and the SRT, whose words and times match the burned-in captions exactly. Keep the clean file; the next opener test or language version starts from it.

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
- The muted-watch score shows its sum, and the main claim, opening and product and brand checks all pass.
- No caption runs over 17 characters a second or across a cut; the text layer stays under its ceiling.
- The real brand font file was used; no fallback font appears.

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
- MCR-6743: changing only the overlay on a hook makes a new variant.
- MEA-0037: gross margin uses delivered cost.
- ORG-0016: on-screen hook text five to eight words.

What makes this skill ours: it starts and ends with a muted test by a fresh viewer, not a style checklist; it writes a headline layer that carries the point before word-for-word captions; safe zones are checked frame by frame with each platform's own overlay rather than one remembered number; and language and script choice is decided per audience.

## Selling in India

- Choose per audience between Hindi in Devanagari, Hinglish in Latin letters, or a regional language. Many urban buyers read Hinglish faster than Devanagari; small-town buyers may prefer their own script. Check conjunct letters render.
