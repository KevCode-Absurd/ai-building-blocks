# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, usable edit plan: timeline maths is correct, the off-script health claim is cut cleanly at line boundaries, the price and renewal terms stay together, and every unknown time or shot is marked MISSING rather than guessed. The owner gets two versions ready for an editor, with a clear list of what to supply (destination, pack photos, word times) before the cut is final.

## Judge list

- Met: Every claim, number and offer on screen is in your approved copy.
  End card: "First order is $29.99 with the text sign-up. It renews at $49.99 every 4 weeks." Captions carry only body lines.
- Met: The product looks right in every shot it appears in, label readable, opened the way it really opens.
  "Close: pack torn straight across the top edge"; "Pouch to lens, name readable (held 3 s to read)"; pack photos flagged MISSING.
- Met: Each caption matches what's actually said after the cuts.
  "8.5-13.6 21 vitamins and minerals and 6 grams / of fiber, in one pack." re-timed; "It renews" edge marked MISSING, not guessed.
- Met: Off-script lines, like a creator's own health claim, are cut, not kept.
  "body 13.0-15.8 'Honestly it fixed my stomach.' It uses 'fix' and states a health result, so it is on the never-say list."
- Met: The ending carries only your approved terms. No added urgency or discount.
  "No discount, deadline, guarantee or 'link in bio' added." Destination marked MISSING rather than invented.
- Met: The plan says it's a plan, and lists any missing shots.
  "This is a plan. No edited file exists yet." followed by nine MISSING lines including in points and pack screenshots.

## What went in

```text
Footage (a real customer, filmed from our brief, all 9:16):
H1 hookA.mp4 4 s. 0.4 "I quit greens powder more times than I
   can count." (ends 3.6)
H2 hookB.mp4 5 s. 0.3 "If your greens powder lives at the back
   of the cupboard, watch this." (ends 4.4), holds up a pack
B  body.mp4 32 s. To camera, pack in hand. 0.9 "Okay, um, so."
   2.6 "This is one day." 4.0 "You tear the top, tip it out."
   7.9 "21 vitamins and minerals and 6 grams of fiber, in one
   pack." 13.0 "Honestly it fixed my stomach." 15.8 "First order
   is $29.99 with the text sign-up. It renews at $49.99 every 4
   weeks." (ends 22.6), then looks off camera.
X1 tear.mp4 6 s. Pack torn straight across its top edge, close.
X2 pour.mp4 5 s. Gummies tip into her palm, close.
X3 pouch.mp4 4 s. Pouch held to the lens, name readable.
No music supplied.
Approved script: both hooks and the body lines from the brief.
Never say: "fix", or any health result.
Need: two versions (H1 + body, H2 + body), 9:16 and 4:5, under
30 seconds, captions.
```

## What came out

```text
```
CUT LIST (V1: H1 hookA + body, 9:16 master, 22.4 s)
#  source           in-out (s)                           timeline          shows                                                         audio                                             on-screen text
1  hookA.mp4        0.4-3.6                              0.0-3.2           Customer to camera                                            hookA line, sync                                  caption
2  body.mp4         2.6-4.0                              3.2-4.6           To camera, pack in hand (sealed)                              body sync, "This is one day."                     caption
3  tear.mp4         MISSING: in = start of tear action;  4.6-MISSING       Close: pack torn straight across the top edge (cutaway)       body.mp4 runs on unbroken (src 4.0 ->)            caption
                    out = in + (time to "tip")                             ("tip" starts)
4  pour.mp4         MISSING: in = start of pour;         MISSING-8.5       Close: gummies tip into palm (cutaway)                        body.mp4 runs on unbroken (-> src 7.9)            caption
                    out = in + remaining time to 8.5
5  body.mp4         7.9-13.0                             8.5-13.6          To camera, pack in hand                                       body sync, "21 vitamins ... in one pack."         caption
6  pouch.mp4        MISSING: 3.0 s window where the      13.6-16.6         Pouch to lens, name readable (cutaway; held 3 s to read)      body.mp4 audio src 15.8-18.8 (offer line starts)  caption (kept clear of the name)
                    name is sharp and still
7  body.mp4         18.8-22.6                            16.6-20.4         To camera, lip sync on the renewal terms                      body sync, offer line to its end at 22.6          caption
8  end card         -                                    20.4-22.4         Approved offer text + destination                             room tone / silence                               "First order is $29.99 with the text sign-up.
                                                                                                                                                                                                   It renews at $49.99 every 4 weeks."
                                                                                                                                                                                                   + MISSING: destination
Body audio track: src 2.6-13.0 -> TL 3.2-13.6; src 15.8-22.6 -> TL 13.6-20.4 (one audio join, at line boundaries).

CUT LIST (V2: H2 hookB + body, 9:16 master, 23.3 s)
#  source           in-out (s)                           timeline          shows                                                         audio                                             on-screen text
1  hookB.mp4        0.3-4.4                              0.0-4.1           Customer holds up pack (sealed)                               hookB line, sync                                  caption
2  body.mp4         2.6-4.0                              4.1-5.5           To camera, pack in hand (sealed)                              body sync, "This is one day."                     caption
3  tear.mp4         MISSING: as V1                       5.5-MISSING       Close: tear (cutaway)                                         body.mp4 runs on unbroken (src 4.0 ->)            caption
                                                                           ("tip" starts)
4  pour.mp4         MISSING: as V1                       MISSING-9.4       Close: pour into palm (cutaway)                               body.mp4 runs on unbroken (-> src 7.9)            caption
5  body.mp4         7.9-13.0                             9.4-14.5          To camera, pack in hand                                       body sync                                         caption
6  pouch.mp4        MISSING: 3.0 s readable window       14.5-17.5         Pouch to lens, name readable                                  body.mp4 audio src 15.8-18.8                      caption (clear of the name)
7  body.mp4         18.8-22.6                            17.5-21.3         To camera, renewal terms in sync                              body sync to 22.6                                 caption
8  end card         -                                    21.3-23.3         Approved offer text + destination                             room tone / silence                               as V1, + MISSING: destination
Body audio track: src 2.6-13.0 -> TL 4.1-14.5; src 15.8-22.6 -> TL 14.5-21.3.

Cut:
- body 0.9-2.6 "Okay, um, so." Set-up filler.
- body 13.0-15.8 "Honestly it fixed my stomach." It uses "fix" and states a health result, so it is on the never-say list. The cut falls at the line's start and the next line's start, so no word is clipped. Row 6 cuts away on the audio join, so there is no visible jump cut.
- body after 22.6. She looks off camera.
- Hook pre-roll before 0.4 and 0.3, and hook tails after 3.6 and 4.4.
- The unused parts of tear, pour and pouch.
- Row 8 runs only once the destination is supplied. Without it, each version ends on row 7 (V1 20.4 s, V2 21.3 s).

JOINS
V1 hookA -> body:
- Argument: "I quit greens powder..." then "This is one day." This holds only if the pack is clearly in frame at body 2.6. "This" points at it. Confirm from a body screenshot.
- Voice: same customer, same speaker.
- State: hookA shows no pack. Body opens sealed. OK.
- Light, room tone, wardrobe and framing across hookA and body: MISSING screenshots and a listen. Match room tone at TL 3.2.

V2 hookB -> body:
- Argument: "...watch this." then "This is one day." Holds. The pack she holds up carries straight into the pack in hand.
- State: sealed in both. It must be the same pack and version, ideally in the same hand. Confirm from screenshots.
- Light, room tone, wardrobe: MISSING, as V1.

Both versions:
- After the cutaways (rows 3-4: torn pack, gummies in palm), the picture returns to body at src 7.9. If her pack is still sealed there, it reads as a second pack. Confirm, or accept it as a demo cutaway.
- Confirm the hands in tear and pour are hers, or match closely enough not to imply a different person.
- The audio join at src 13.0 / 15.8 sits under the pouch cutaway. Listen for a breath or click, and match room tone.

CAPTION WINDOWS (re-timed to the cut)
V1
0.0-3.2    I quit greens powder more times / than I can count.                 (15.6 cps: marginal, this is the speaker's own pace)
3.2-4.6    This is one day.
4.6-8.5    You tear the top, tip it out.
8.5-13.6   21 vitamins and minerals and 6 grams / of fiber, in one pack.
13.6-MISSING ("It" of "It renews" starts)    First order is $29.99 / with the text sign-up.
MISSING (same edge, no gap)-20.4             It renews at $49.99 / every 4 weeks.

V2
0.0-4.1    If your greens powder lives at the back / of the cupboard, watch this.   (16.6 cps: over 15; cannot slow real speech. Either accept it, or choose V1 as lead)
4.1-5.5    This is one day.
5.5-9.4    You tear the top, tip it out.
9.4-14.5   21 vitamins and minerals and 6 grams / of fiber, in one pack.
14.5-MISSING ("It renews" starts)            First order is $29.99 / with the text sign-up.
MISSING (same edge, no gap)-21.3             It renews at $49.99 / every 4 weeks.

Placement:
- Keep captions inside the app safe area.
- Keep them clear of her face, the pack in hand, the tear and pour hands, and the pouch name in row 6.
- Re-check placement in the 4:5 crop.

Transcript checks (listen for):
- "quit", "greens powder", "cupboard", "watch this"
- "one day"
- "tear the top", "tip it out" (also set the "tip" time here)
- "21", "6 grams", "fiber"
- "$29.99", "text sign-up"
- "It renews" (set its start time here), "$49.99", "every 4 weeks"
- No "um" or "so" left before src 2.6.
- No head of "Honestly" left at src 13.0.
- "First" is not clipped at src 15.8.
- Hook first syllables are not clipped at in 0.4 / 0.3. If they are, pull the in point back by 0.1 s at most, before the word.

SOUND
Voice:
- Customer sync audio carries the whole ad.
- Match room tone at the hook-to-body join and at the src 13.0/15.8 join.
- Check it is clear on a phone speaker.

Effects:
- Natural tear sound from tear.mp4 only if that clip has sync audio. Sit it low under the voice, on the tear frame.
- Nothing else.

Music:
- None. No track was supplied, and none has paid-ad clearance.
- Add one only if it is owned or cleared for paid ads. MISSING if wanted.

CLOSE
- Spoken offer, verbatim: "First order is $29.99 with the text sign-up. It renews at $49.99 every 4 weeks."
- The renewal terms follow the price with no caption gap. The end card repeats both together.
- Action and destination: MISSING. Without them, the close is the offer line only.
- No discount, deadline, guarantee or "link in bio" added.

EXPORT
Per version (V1, V2), 8 files in total:
- 9:16 at 1080x1920: clean copy and captioned copy.
- 4:5 at 1080x1350: clean copy and captioned copy.

Settings:
- H.264 MP4, yuv420p, with audio (AAC).
- Frame rate matches the source: MISSING.
- Keep the source files and the full 9:16 masters.

4:5 crop:
- It removes 570 px of height.
- Reframe per shot so the face, the pack in hand, the tear and pour hands, and the pouch name stay in frame. Check every row.

Copies:
- Clean = no added captions. The end card stays, because it is the close.

Final review:
- Watch the first frame, every join, the demo (rows 3-4), the pouch hold, the offer and the last frame, small, muted and with sound.
- The output is a draft for brand approval.

GAPS
This is a plan. No edited file exists yet.
- MISSING: pack photos and screenshots from every clip, to check packaging, logo, colours and version in rows 1-8.
- MISSING: confirmation that the pouch (pouch.mp4) is the same product and version being sold, and that it is not a different format from the "one pack" day pack.
- MISSING: approved action and destination for the close and end card.
- MISSING: the approved brief text. I have treated "21 vitamins and minerals and 6 grams of fiber, in one pack" and the offer line as approved on your word, without seeing the brief.
- MISSING: transcript times for "tip" (body ~4.0-7.9) and "It renews" (body ~15.8-22.6).
- MISSING: in points for tear.mp4 (tear starts) and pour.mp4 (pour starts), and the 3.0 s window in pouch.mp4 where the name is sharp.
- MISSING: whether her pack is sealed or torn at body src 7.9, and whose hands appear in the cutaways.
- MISSING: source frame rate. Light, room tone and wardrobe match between the hooks and the body.
- MISSING: a music track cleared for paid ads, if music is wanted.

CHECKS MISSED
- Approved claims: the brief wasn't pasted. The vitamins, fiber and offer wording need checking against it.
- Pack true in every shot: no pack photos or screenshots, and the pouch vs day-pack version is unconfirmed.
- Captions match kept speech: two caption edges and the "tip" cutaway point wait on word times. The automatic transcript has not been verified by ear.
- Close carries only approved terms: the destination is missing, so the close is incomplete.
- First frame, joins and close, muted and with sound: no file exists yet. Do this on the first cut.
```
```
