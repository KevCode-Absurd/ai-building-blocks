# /ugc-script — Skill Prompt

**Generates a 30-second UGC script with opener, middle, and close. Enforces format choice, awareness stage fit, and script hygiene rules.**

---

## The Prompt

```
You are the UGC Script Generator. Produce a 30-second UGC script for the product below.

INPUTS
Product: [NAME]
Category: [CATEGORY]
Price: [PRICE]
Awareness stage: [Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware]
Target persona: [ONE SENTENCE]
Format: [Testimonial | Unboxing | Tutorial | Lifestyle | Problem-Solution | Confession | Comparison | Bold Claim | POV | Anti-Hype]
Hero outcome: [THE SPECIFIC RESULT THE CUSTOMER GETS]
Proof point (if any): [NUMBER / RATING / BEFORE-AFTER / NONE]
Creator persona: [ONE SENTENCE — who is on camera]
Platform: [Reels | TikTok | YouTube Shorts]

RULES
1. Total runtime 25-30 seconds when read naturally.
2. Opener is 0-3 seconds. Must earn the next 5 seconds.
3. Middle is 3-20 seconds. Carries story + proof.
4. Close is 20-30 seconds. One clean sentence + CTA.
5. No em dashes. Replace with commas or periods.
6. Contractions ON (I'm, you're, it's, won't). Not (I am, you are, it is, will not).
7. One idea per sentence. If there is a comma + "and", split.
8. No banned words: game-changer, revolutionary, life-changing, unlock, leverage, level up, skyrocket.
9. Specificity > adjectives. Use $48 not "expensive". Day 14 not "two weeks".
10. Opener tactic must match stage guardrail (see below).

STAGE GUARDRAILS
- Unaware: Opener = Curiosity or Relatability. Avoid Bold Claim, Contrast.
- Problem Aware: Opener = Confession, Relatability, or Curiosity.
- Solution Aware: Opener = Bold Claim or Contrast.
- Product Aware: Opener = Bold Claim.
- Most Aware: Opener = Bold Claim + Offer.

OUTPUT FORMAT

Format: [FORMAT NAME]
Awareness stage: [STAGE]
Target runtime: 30 seconds

OPENER (0-3s):
"[Exact words the creator says]"
Intent: [WHY this earns the next 5 seconds]

MIDDLE (3-20s):
"[Exact words, split into 2-4 short sentences]"
B-roll direction: [WHAT to cut to during middle]
Proof beat: [WHERE in the middle to drop the specific number / visual]

CLOSE (20-30s):
"[Exact words — one clean sentence + CTA]"
CTA: [Link in bio | Link in comments | Search [brand] | Swipe up]

Shot list:
- Shot 1: [camera angle + framing for opener]
- Shot 2: [b-roll for middle]
- Shot 3: [camera angle for close]

Caption overlay (if any): [Text that appears on screen, matching tactic]

Quality gate:
- No em dashes: [PASS/FAIL]
- Contractions used: [PASS/FAIL]
- Runtime estimate: [X seconds]
- Banned words: [PASS/FAIL]
- Stage-appropriate opener: [PASS/FAIL]
- Proof point included: [PASS/FAIL if applicable]
```

---

## Example run

Input:
```
Product: Barrier Repair Serum
Price: $48
Awareness stage: Problem Aware
Target persona: Woman 30-45 with cyclical flaking and breakout pattern
Format: Confession
Hero outcome: Skin stays calm for a full day
Proof point: Day 14 photo
Creator persona: 34-year-old mom, no makeup, bathroom POV
Platform: Reels
```

Expected output (abbreviated):

```
Format: Confession
Awareness stage: Problem Aware
Target runtime: 30 seconds

OPENER (0-3s):
"I was wrong about my skincare for six years."
Intent: Confession disarms ad resistance. Specific number (6 years) earns trust.

MIDDLE (3-20s):
"I kept buying serums. None of them worked past week 2.
Then my sister sent me this.
Day 14, my face stopped flaking for the first time since my 20s.
The thing I did not expect was the redness went with it."
B-roll direction: Shelf of old products, then new bottle, then close-up of skin on day 14.
Proof beat: Day 14 photo at 12-second mark.

CLOSE (20-30s):
"I am not sponsored. I bought this. If your skin is doing what mine was, try this one."
CTA: Link in comments.

Shot list:
- Shot 1: Bathroom mirror, no makeup, eye contact with camera
- Shot 2: Cabinet of old serums cutting to new bottle
- Shot 3: Close to camera, hand on bottle, direct delivery

Caption overlay: "I was wrong about serums for 6 years."

Quality gate:
- No em dashes: PASS
- Contractions used: PASS
- Runtime estimate: 28 seconds
- Banned words: PASS
- Stage-appropriate opener: PASS (Confession on Problem Aware)
- Proof point included: PASS (Day 14 visual at 12s)
```

---

## Variations

### Variation A — 3 versions of the same script

```
/ugc-script x3

[INPUTS AS ABOVE]

Give me 3 versions of the same script. Same format. Same awareness stage. Differ only on the opener hook (use 3 different tactics).
```

### Variation B — Shot-only (no dialog)

```
/ugc-script shot-only

Product: [NAME]
Format: [FORMAT]
Duration: 30s

Just the shot list and b-roll direction. No dialog. I have a scripted voiceover.
```

### Variation C — Dialog-only (no shots)

```
/ugc-script dialog-only

[INPUTS]

Just the spoken lines. Opener, middle, close. No shot list, no direction notes.
```

### Variation D — UGC across 3 formats

```
/ugc-script spread

Product: [NAME]
Awareness stage: [STAGE]
Persona: [PERSONA]

Write the same product pitch as 3 different UGC formats:
1. Testimonial
2. Problem-Solution
3. Comparison

Keep the hero outcome consistent. Change only the structure and opener.
```

### Variation E — Creator brief (for the person on camera)

```
/ugc-script creator-brief

Product: [NAME]
Format: [FORMAT]
Runtime: 30s

Write this as a brief for the creator (not the script itself). Include:
- What to wear
- Setting / location
- Hook beat (what they say in first 3s)
- Middle beats (what they cover and in what order, bullet form)
- Close + CTA
- What NOT to say

Creator writes their own words from the beats.
```
