---
name: cut-raw-footage-into-ad-variants
description: "An edit plan that turns one shoot into five video ads that differ on purpose: three openers on one body so the opener can be read, a short cut and a long cut so length can be read, and a different ending so the close can be read. Logs the footage against the claims it proves, picks the strongest body take, writes a timed cut sheet for each ad, sets pacing, export and naming rules, and says how to judge the five on store gross profit rather than click rate. Works with any editor, free or paid. Use when raw creator or founder footage has arrived, when an editor keeps returning one ad per shoot, or when a test needs variants that can actually be compared."
---

# Five ads from one shoot

**You get:** an edit plan for five video ads from one shoot: a footage log, a variant matrix (opener x length x ending), a timed cut sheet per ad, export settings and a naming row for each, ready to hand to any editor.

## When to use

- Raw footage from a creator, the founder or staff has arrived and needs to become ads.
- The editor returns one polished ad per shoot and nothing to test.
- Past variants changed everything at once, so nobody could tell what worked.
- A shoot planned with `plan-ugc-shoot-at-home` needs its edit.

## Not for

- Writing new openers: use `ad-opener-writer`.
- Finished organic Reels and Shorts from long recordings: use `short-video-edit-pipeline`.
- Finding where live ads lose viewers: use `video-ad-retention-fix`.
- Captions and on-screen text styling: use `captions-and-text-for-sound-off`.
- Extra sizes for every placement: use `resize-ads-for-every-placement`.

## What you need

Required:

1. **All raw files** at original quality, with the shot list from the shoot.
2. **The script** the footage was shot from and its target buyer.
3. **Approved claims list** (`product-claims-profile`).
4. **Signed usage terms** for paid ads on the planned platforms.
5. **Gross profit per order** from `store-meta-math`.
6. **Live product page URL** with today's price and offer.

Optional: the account's past opener results, the tag sheet from `creative-naming-and-tagging-system`, and licensed music from `music-and-sound-for-ads`.

Access: read only for files and the ad account. Uploading finished ads is draft access (level 2) and goes through `ad-launch-prepublish-check`; nothing runs without the client's yes.

## Before you start: the gates

1. **Money.** Gross profit per order is known from delivered costs [MEA-0037]. Fail: stop; variants cannot be judged without it.
2. **Rights.** Paid ad use covers every platform and the full test period. Fail: edit for organic only and say so.
3. **Claims.** Every spoken line and on-screen claim is on the approved list. Lines outside it are cut, not captioned around.
4. **Budget to read five.** The test budget can give each variant enough spend to reach the store's break-even cost per purchase at least once. If not, edit three (the three-opener set) and hold the rest.
5. **Disclosure.** If the speaker was paid or gifted, the disclosure take is in the footage [MCR-6060]. Fail: ask for a pickup line before editing.

## Steps

### 1. Log the footage

Watch everything once at normal speed with sound. For each usable clip, log: clip ID, start and end time, what happens, which claim it proves, energy (low, medium, high), and any problem (focus, noise, product hidden). Mark the single best take of each body line and each opener. Note any moment that is honest and specific, such as a small doubt or a precise detail; those often become the best openers.

Give each usable moment one job: stop the scroll, name the problem or benefit, show the product or how it works, prove it, or ask for the action. If a job has no footage, name the pickup shot that would fill it rather than covering the gap with an unrelated picture. Record each clip's source in and out seconds; every later cut point and caption edge is taken from the real speech, never from the script's estimate, so no cut or caption lands in the middle of a word.

If any take was made or changed by an AI tool, watch it right through, including the middle and the last word: mouth timing, teeth and jaw, the exact words, the same voice, and faces, clothes or background people nobody asked to change. Pick a clean take or name a reshoot; music and fast cuts do not fix a broken performance.

### 2. Pick the body

Build one body from the best takes: problem, product in use, proof, honest verdict, ask. Keep the viewer's sense of being sold low early and raise it slowly; sudden jumps from story to pitch cause the biggest drop-offs [MCR-0027]. If the product needs explaining, keep 4 to 6 seconds of how it works before the product is named [MCR-0014]. This body is fixed for variants 1 to 3 so only the opener changes.

### 3. Choose three openers

Pick the three most different openers from the log, not three wordings of one. Treat each as three levers: spoken line, on-screen text and first visual [MCR-0028]. Each must:

- Show the topic in the first frame, not unrelated b-roll [ORG-0017].
- Filter for the buyer, not just stop the scroll; a broad attention grab trains delivery toward non-buyers [MCR-0026].
- Bridge into the first body line without a jump.

**Check every join** before you lock an opener onto the body: pronouns ("this", "it" must point at something already seen), the argument (the body answers the doubt the opener raised), the voice and energy, the product's state (sealed or opened), the light, the room sound and the music. If a join fails, record or pick a one-line bridge rather than stapling the opener on [MCR-6715]. When the hook changes to reach a new buyer or awareness stage, the body must change too; a new hook on a word-for-word old body is a mismatch [MCR-6626].

### 4. Build the variant matrix

Five ads, each with a job:

| Ad | Opener | Length | Ending | What it reads |
|---|---|---|---|---|
| V1 | A | Full body, usually 30 to 45 s | Soft ask | Control |
| V2 | B | Same as V1 | Same as V1 | Opener B against A |
| V3 | C | Same as V1 | Same as V1 | Opener C against A |
| V4 | A | 15 to 20 s cut | Same as V1 | Length |
| V5 | A | Same as V1 | Offer or proof ending | Ending |

V1 to V3 differ only in the opener. V4 and V5 each change one more thing from V1. If the account already knows its best opener, use it as A.

Beyond the first five: with sound scripts, more openers on fewer bodies usually beats more bodies with few openers, because most viewers leave during the opener [MCR-6863]. A founder or creator shoot planned as 10 openers and 3 bodies gives 30 ads from a few minutes of recording [MCR-6773]. Release them in later rounds of 2 to 4 openers per body so each gets enough spend to read.

### 5. Cut the short version

Only about 15% of viewers reach the second half of a video ad, so the first half carries the sale [MCR-0077]. Build the short cut by keeping opener, the single strongest proof shot, product name and ask. Never speed up footage to fit; drop beats instead. If the story collapses without its build-up, skip V4 and say so; make V5 with a second ending instead. A long ad cut down in the edit often plays weak because its bridges no longer fit; if the short version needs new joins, flag that it needs its own short script and pickup lines rather than forcing it [MCR-6729].

### 6. Write the endings

- **Soft ask (V1 to V4):** the speaker in their own words, plus the product name and where to buy on screen.
- **Offer ending (V5 option):** the live offer exactly as on the product page today, with its end date if it has one. No invented deadlines.
- **Proof ending (V5 option):** a real review line with first name and source, or the store's real review count, never a rounded-up number.
- If a price has renewal or subscription terms, they go in the same caption as the price or the very next one, with no gap. Never crop off an instruction, a condition or a disclosure, and no transition hides the label or cuts into a demo.

### 7. Set pacing

- In talking sections, change the frame every 2 to 4 seconds with a punch-in, a proof cut or text. Practitioner default; test it on the store's own retention data.
- Cut on the pauses the creator left. Keep breaths that sound natural.
- Do not cover the speaker with product shots every few seconds; constant cutaways remind the viewer it is an ad and break the story [MCR-0027].
- Keep proof shots as filmed: no cut inside a before and after.

### 8. Add sound and text

Hand captions and on-screen text to `captions-and-text-for-sound-off` and music to `music-and-sound-for-ads`. Each ad must make its point muted. Put the disclosure on screen in the first seconds and keep the spoken line [MCR-6060].

### 9. Export

- 9:16 at 1080 x 1920 for Reels, Stories, TikTok and Shorts.
- 4:5 at 1080 x 1350 for feeds, re-framed so face and product stay centred, not just cropped.
- H.264 or the platform's listed codec, 30 frames a second, the platform's file size limit checked on the day.
- Even loudness across all five; practitioner default about minus 14 LUFS, then check on a phone speaker.
- MP4 in the yuv420p colour format with audio, which every placement plays. Deliver each shape as a clean copy (no added text) and a captioned copy, and keep the source files. Watch the first and last frame of every export small and muted, and listen at each cut for clicks, doubled audio or music that starts abruptly.
- Music must be cleared for paid ads, not only for organic posts.

### 10. Name, tag and hand over

Name each ad with the store's pattern and tag opener, body, length, ending, creator and setting [MCR-0051]. Hand the five to `ad-launch-prepublish-check`. Optional pre-test: post opener cuts as trial Reels with the ask removed and read retention before paying for reach [MCR-0041].

### 11. Say how to judge

Judge each variant on store-side cost per purchase against the store's break-even, then on gross profit per ad after the shoot cost [MCR-0023]. Click rate alone can crown a false winner that sends curious viewers who never buy [MCR-0029]. Compare V1 to V3 for the opener, V1 to V4 for length and V1 to V5 for the ending. Call nothing on a few days of small spend.

Languages: if the store runs ads in more than one language, the language is a sixth variable. Keep it out of this set: make five in one language and a matching set later. If pay on delivery is offered, an offer ending can mention it only if the product page shows it today.

## Checks before you hand it over

- V1 to V3 share the exact same body and ending; only the opener differs.
- V4 and V5 each differ from V1 in one thing only.
- Every claim spoken or shown is on the approved list.
- Offer, price and review numbers match the live page and real review data on the day.
- Each ad passes a muted watch: the point is clear without sound.
- Disclosure appears on screen early and is spoken where required.
- Exports exist in 9:16 and 4:5 with names and tags filled in.
- Nothing was uploaded or launched without the client's yes.
- Every opener's join was checked (pronouns, argument, product state, light, sound), and no cut or caption lands mid-word.
- Any AI-made or AI-changed take was watched end to end before use.

## Output

**One-screen summary:** product, shoot date, body used, the three openers in one line each, what each variant tests, production cost to log, and the read-out rule.

**Footage log:** Clip ID, In, Out, What happens, Claim proved, Energy, Problem, Best take (Y or N).

**Cut sheet per ad:**

| Time | Clip ID | Spoken line | On-screen text | Visual note | Sound |
|---|---|---|---|---|---|
| 0:00 to 0:03 | O2_take1 | | | First frame shows product in use | |

**Variant sheet:** Ad name, Opener, Body, Length, Ending, Aspect ratios, Disclosure (Y or N), Tags, Status.

**Read-out row:** Ad name, Spend, Store purchases, Cost per purchase, Break-even cost per purchase, Gross profit after spend and production, Verdict.

## Common mistakes

- **Five ads that change everything.** Nothing can be learned. Step 4 changes one thing at a time.
- **Short cuts made by speeding up.** It sounds fake. Step 5 drops beats instead.
- **Fake urgency in the ending.** Step 6 uses only the live offer and its real end date.
- **Cutting away from the speaker constantly.** Step 7 keeps the story intact.
- **Judging on clicks.** Step 11 judges on store purchases and gross profit.
- **Rounded-up proof.** Step 6 uses exact review counts.

## Sources

- MCR-0014: explain the mechanism before naming the product.
- MCR-0023: gross profit per ad after production cost.
- MCR-0026: hooks must filter for buyers.
- MCR-0027: raise the sense of being sold gradually.
- MCR-0028: a hook is spoken line, text and visual.
- MCR-0029: high click rate can be a false winner.
- MCR-0041: pre-test cuts as trial Reels.
- MCR-0051: tag every ad on the same fields.
- MCR-0077: about 15% reach the second half.
- MCR-6060: disclosures on screen and spoken, early.
- MCR-6626: a new hook for a new buyer needs a matching body.
- MCR-6715: stitched hooks break at the bridge.
- MCR-6729: write each length as its own script.
- MCR-6773: 10 hooks and 3 bodies make 30 ads.
- MCR-6863: more hooks on fewer bodies.
- MEA-0037: gross margin uses delivered cost.
- ORG-0017: first frame shows the topic.

What makes this skill ours: the five variants are designed as three clean reads (opener, length, ending) instead of five random edits; every ending uses only the live offer and real review counts; and the read-out judges each ad on store purchases and gross profit after the shoot cost, not on click rate.
