# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 0 of 5 met. Invented facts: 2.

The avatar card is solid and the run stopped for approval as the skill says, but the output only covers stages 0 and 1, so the music, sheets, storyboard, clips and score are all absent. It also wrongly says the photos were not received and asks for facts already in the brand file, which would frustrate the owner.

## Fix

In 'What you need' and stage 0, tell it to treat attached photos and the brand file as the product facts already given before writing MISSING, and to read claims against the brand file; the stop after stage 1 should still show stage 0 and 1 only if that is intended, so the judge list should be limited to stages reached.

## Judge list

- Not met: Stopped for approval after avatar card, sheets, and track with storyboard
  Stopped after the avatar card, which is correct so far, but the later stops were never reached; the run ends at approval 1.
- Not met: Track made before storyboard, every cut on a bar line
  Run ends at stage 1; no music prompt, take rule or storyboard was produced.
- Not met: Music prompt starts singing at 0 seconds and ends on the sung tag
  No music prompt was written. Only a note that 'Singing starts at 0 s with the hook.'
- Not met: Lead and pack match their sheets in every shot
  No sheets or shots were produced; the run stopped at the avatar card.
- Not met: Mouths closed in non-singing shots and pack on screen within 5 seconds
  No shots exist. The avatar card says 'her mouth stays closed in every shot' but nothing was built.

## Invented

- other: Lyric bar layout: hook 2 bars, verse 4 bars, 15 bars total with 1 bar per line (Marked inferred, but the input gives no bar counts; it is a reasonable derivation, not a fact.)
- other: Avatar details: chestnut curly bob, claw clip, cardigan, props (Creative design choices for a made-up lead, which is the card's job, not facts.)

## Safety

- It claims the product photos did not come through, though the input says they were attached; it should have said it could not see them or asked once rather than asserting they are absent.
- The 'works like a supplement' and 'a handful of greens' lines are flagged as needing sources, but the brand file already clears 'Tastes like a treat, works like a supplement' and the 21 vitamins; the flag is an over-ask, not a misleading claim.

## What went in

```text
Song script (from the song ad script skill), 30 s, 120 BPM:
[Hook] Rip it, tip it, out the door / A handful of greens and
nothing more
[Verse] Lunch box packed and the kettle's on / Keys in my hand
and the morning's gone / That chalky shake? Still in the sink /
No time to scrub, no time to think
[Hook] (same)  [Lift] Twenty-one vitamins and minerals (2 bars) /
Tastes like a treat, works like a supplement (2 bars)
[Hook] (same)  [Tag] Rip. Tip. Sprout.
Sound: bright indie pop, warm female lead, handclaps, jangly
guitar. Cast note: unseen singer; one animated adult woman, the
busy parent, on screen.
Photos attached: pouch front, side and top; one daily pack. Pack
torn straight across its top edge; the pouch opens only at its
resealable top. Colours: forest green, warm cream, sunflower.
Tools: one-box music tool; video clips up to 8 s with timed
prompts and an end frame; no mouth sync.
```

## What came out

```text
I can write every prompt here, but I can't make pictures, music or video because no generation tool is connected to this chat.

---

## Stage 0: Script in (fixed from here on)

| Item | Read |
|---|---|
| BPM | 120, so 1 bar = 240 ÷ 120 = **2.0 s** |
| Length | 30 s = **15 bars** |
| Hook | 2 bars (1 bar per line), sung 3 times: bars 1–2, 7–8, 13–14. *Bar count per line `inferred`.* |
| Verse | 4 bars (1 bar per line): bars 3–6 |
| Lift | 4 bars (2 bars per line, as written): bars 9–12 |
| Tag | 1 bar: bar 15, "Rip. Tip. Sprout." |
| Who sings | Unseen singer. The lead's mouth stays closed in every shot. |
| Sound | Bright indie pop, warm female lead vocal, handclaps, jangly guitar. Singing starts at 0 s with the hook. |
| Product use | Daily pack torn straight across its top edge. The pouch opens only at its resealable top. |
| Colours | Forest green, warm cream, sunflower |
| Tools | One-box music tool. Video clips up to 8 s, with timed prompts and an end frame. No mouth sync. |

**Claims and brand lines sung in the lyric (these must be sung exactly as written and backed by a source):**
- "Twenty-one vitamins and minerals": needs the label panel or a source.
- "Works like a supplement": this is a function claim and needs a source. Without one, it may need rewording before the music prompt.
- "A handful of greens": a quantity or equivalence claim that needs a source.
- "Tastes like a treat": a taste opinion. Confirm the brand is happy with it.
- "Sprout": brand name, sung in the tag.

**Open items:**
- MISSING: whether the brand uses music and animation. **Please confirm before any song or image is made.**
- MISSING: product photos. No images came through in this chat (pouch front, side and top, and one daily pack). Please re-attach them. Until then the product sheet can't be checked against the real pack.
- MISSING: label text, word for word (pouch and daily pack).
- MISSING: product name as printed. "Sprout" is `inferred` from the tag.
- MISSING: sources for the claims above.
- MISSING: offer line for the tag.

---

## File 1: Avatar card (approval 1)

**Name on file:** The Lead (busy parent)

- **Role in the song:** A busy parent racing through a weekday morning. She packs lunch, grabs her keys, ignores the shake glass in the sink, then rips a daily pack, tips it into her bottle and heads out the door. She is on screen throughout and never sings, because the singer is unseen. She gives no testimonial and is never shown as a customer, founder or expert.
- **Age range:** Made-up adult, mid-30s to early 40s.
- **Look, in plain words:**
  - Soft, rounded build of average height.
  - Short, curly bob of dark chestnut-brown hair, with one curl that always falls over her forehead.
  - Large, expressive, warm brown eyes.
  - Small nose and rosy cheeks.
  - Simple rounded animated style. No named studio's style.
- **Two clothing colours:**
  - Forest-green knit cardigan.
  - Warm-cream T-shirt with matching cream trousers.
- **Signature item:** A sunflower-yellow claw clip, worn high on the back of her curls in every shot.
- **Props:**
  - Lunch box: plain cream, with a green lid.
  - Kettle: plain cream.
  - Keys on a single plain ring.
  - Clear, plain water bottle with a green cap.
  - Tall glass with a chalky white smear inside, left in the sink.
  - Sprout daily pack and pouch, taken from the product sheet once the photos arrive.
- **Voice:**
  - The lead does not sing and her mouth stays closed in every shot.
  - The song's unseen vocal is a warm, bright female mid-range voice: light and smiling, with a little breath on held notes and a clear, friendly delivery.
  - The vocal is described by tone only. It names no artist and is not a cloned or real person's voice.
- **What never changes:**
  - Curly chestnut bob with the forehead curl.
  - Sunflower claw clip.
  - Forest-green cardigan over a cream T-shirt and trousers.
  - Large brown eyes and rounded build.
  - She holds the daily pack and the bottle in her **right** hand, and her keys in her **left**.
  - She never speaks, sings, mouths words or states a result.

---

**Stopped for approval 1.** Please reply "yes" to the avatar card, or tell me what to change. Please also answer the brand music and animation question and re-attach the product photos. Nothing will be made until both are settled.
```
