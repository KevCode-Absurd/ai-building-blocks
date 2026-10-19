# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 6 met. Invented facts: 4.

The plan keeps the words locked, flags the probiotics error and the offer conflicts, and uses MISSING lines properly. But the word count is probably wrong, the output drops the required 'Word check' line and the layout deviates from the shape, and picture notes add unsourced layout direction.

## Fix

In the Notes step, require a literal 'Word check: n of n words, in order, none changed' line with a recount of the post text, and keep the output headings exactly as in the shape. Also forbid layout details (text zones, timings) beyond the original's description.

## Judge list

- Met: Shot table lines match the original word for word, in order
  Shot table: A "'Sprout is too expensive':" then B "here's 61% off to prove otherwise"; post text kept in the slots table.
- Not met: Notes give a word count that matches the original
  Says 10 and 55 words; headline is 10 words but post text is about 53 without emoji. Also no 'Word check ... in order' line.
- Not met: No new claim, number or offer appears anywhere, including picture notes
  Invents timings 0:04/0:09 and claims '$29.99 is about 55% off'; 'Original' variant assumed. 'Text in top third' is added direction.
- Met: Product looks like the photos (shape, colours, label)
  Pouch: "glossy deep green #00582D... yellow wordmark, yellow bear face top right"; gradient matched to the product photo.
- Met: No real person, child or other character recreated
  "Who carries it: the product alone." No people shown.
- Met: Lines that break a claim rule are flagged, not changed
  Flags "probiotics", "whole-food ingredients", the 61% mismatch, and leaves wording as is.

## Invented

- number: $29.99 is about 55% off the $66.65 one-time price, and $20 off the $49.99 subscription (The 55% is arithmetic (~55%), but the '$20 off $49.99' framing is a speculative match; $29.99 is exactly 49.99-20, which is fine, so only the wording is loose.)
- claim: The brand file's safe wording is "60+ ingredients" (The brand file lists this as fine to repeat, not as 'safe wording'; a minor framing, not an invented fact.)
- number: Word count: Post text 55 / total 65 (The count is not clearly verified and is likely off, presented as exact.)
- other: Text sits in the top third, clear of the 9:16 UI zones (Layout direction not in the original; the P1 image isn't on file.)

## What went in

```text
Original ad: P1 Too expensive (image ad)
On-image line (from ads.md):
  "'Sprout is too expensive': here's 61% off to prove otherwise"
Post text (a real Sprout main text from ads.md; which ad it ran
with wasn't captured, so it's paired with P1 here; its 4 emoji
are not shown):
  Big news: your first order of [Sprout] just got a lot more
  affordable. $29.99 for your first order, that's less than
  $1.10/day for 60+ whole-food ingredients, 21 vitamins &
  minerals, and gut-supporting probiotics in one daily gummy
  pack. $20 off your first order +$5 off for every extra person
  Third-party tested. Online-exclusive offer. Shop [Sprout].
Picture (the P1 image is not on file; described from the brand
file's Look section): the green pouch on a soft 2-colour
gradient, gummies scattered in front.

New format: 15-second video, 9:16, live action
Product photo: the pouch on a soft gradient
Claims list: Sprout brand file (pasted)

[attached: sprout/brand.md, sprout/ads.md]
```

## What came out

```text
# Video remake plan: P1 "Too expensive", as a 15-second 9:16 live-action video

## 1. Laid out

The plan is built from the on-image line and post text in `ads.md` and the picture description in the brand file's Look section. **The P1 image itself is not on file.** No picture note could be checked against the original. That includes where the line sits, its size, the gradient colours and how the gummies are scattered.

| Part | Picture (as described) | Words | Job |
|---|---|---|---|
| A | Headline, first half, read first | "'Sprout is too expensive':" | Opening and problem: the buyer's objection, quoted in their own words |
| B | Headline, second half | "here's 61% off to prove otherwise" | Turn and offer |
| C | The green pouch on a soft 2-colour gradient, gummies scattered in front | (no words; part of line B) | Proof by product presence |
| Post text | Above the ad | Full main text (see section 4) | Offer detail and call to action ("Shop [Sprout].") |

The reading order assumes the headline is read before the product, which is the usual order for a text-led still. This is unconfirmed without the image.

## 2. The beat that sells

The beat is the turn. The price objection is quoted back in the buyer's voice, then answered with "61% off". It rests on **order**: objection first, answer second.

- **Live action can carry it.** The colon break gives a natural two-step reveal, and nothing depends on a believable face.
- **Sound-off risk:** none. The plan is on-screen text only, so a muted feed loses nothing.
- **Length risk:** a single-line still is being stretched to 15 seconds. The gap between the objection and the answer must stay short, or the turn goes slack. The plan reveals the answer at 0:04 and holds the full line to the end, rather than padding with new words.

## 3. Shot table

All words are on-screen text, laid over in the edit, because video tools misspell words. There is no voice-over and no lip-sync. There are no hands and no people, because the original shows none. The product sits centre frame in every shot, as in the original.

| Part | Time | Original words (on screen) | New picture note |
|---|---|---|---|
| A | 0:00–0:04 | "'Sprout is too expensive':" | Vertical frame. The deep-green Sprout pouch (Original) stands upright, centre frame, on a soft 2-colour gradient matched to the product photo. Small deep-green gummy bears lie scattered in front. The camera holds still. Text sits in the top third, clear of the 9:16 UI zones. |
| B | 0:04–0:09 | "here's 61% off to prove otherwise" | Same set. A slow push-in on the pouch. Line B appears under line A, and line A stays on screen. The pouch stays closed and is never shown torn. |
| C | 0:09–0:15 | (lines A and B stay on screen; no new words) | Push-in ends on the pouch front: the yellow wordmark, the bear face top right and "28 Daily Packs" at the bottom are all legible. The gummies stay sharp in the foreground. The full line holds to the end. |

## 4. Slots table

| Slot | Limit | Line used |
|---|---|---|
| On-screen line A | MISSING: characters-per-line limit (none given) | "'Sprout is too expensive':" |
| On-screen line B | MISSING: characters-per-line limit (none given) | "here's 61% off to prove otherwise" |
| Post text | None given | Big news: your first order of [Sprout] just got a lot more affordable. $29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack. $20 off your first order +$5 off for every extra person Third-party tested. Online-exclusive offer. Shop [Sprout]. |

The headline is split at its own colon. Both halves keep their wording and order, and they end on screen together as one line. No slot is empty.

## 5. Cast note and hand-off

**Who carries it: the product alone.** The original has no presenter or character, so no person is added. There is no avatar stage.

- **Product:** the Sprout Original pouch from its photo. It is glossy deep green #00582D, a stand-up foil pouch with a big yellow wordmark, a yellow bear face top right and "28 Daily Packs" at the bottom.
- **Gummies:** small, opaque, soft-matte deep-green bears, about thumbnail height.
- **Not shown:** no daily pack, no tearing and no pouring, because the original shows none.

**Next skill: the storyboard skill (live action).** Hand it this locked script: two on-screen lines, timed as in section 3, and the post text as written. It builds the product sheet and storyboard, and writes the clip prompts from its approved sheets. The picture notes above are notes, not prompts.

## 6. Notes

**Word count**

| Item | Original | Remake |
|---|---|---|
| On-screen line | 10 | 10 |
| Post text | 55 | 55 |
| **Total** | **65** | **65** |

**Changes**
- **Still turned into video:** the headline is revealed in two steps at its colon, in reading order.
- **Timing:** there is no original timing to scale. The split is 4 s, 5 s and 6 s, set by reading order.
- **Motion:** only a slow push-in. The pouch is not opened.
- **Text:** laid over in the edit, not generated in-camera.
- **Call to action:** none added. "Shop [Sprout]." stays in the post text only, as in the original.

**Product source**
- The pouch comes from the supplied product photo, which shows it on a soft gradient.
- The gummy look and the pouch printing come from the brand file Look section. No gummy photo is on file.

**Pairing**
- The post text's link to P1 wasn't captured. It is paired here at the owner's request.
- The `ads.md` copy carries 4 emoji: 💚 after "affordable.", and ✅ before "$20 off", before "+$5 off" and before "Third-party tested."
- They are left out, as supplied. The owner decides whether to restore them.

**Flags (reported, not changed)**
- **Offer: "61% off".** All the ads say 61%. The site shows 52%, 55%, 49% or 58%, depending on the page, and other ads say "up to 61%". P1 drops the "up to". Current offer terms weren't supplied, so it can't be confirmed as live.
- **Offer conflict inside the ad.** The post text's "$29.99 for your first order" and "$20 off your first order" don't match 61% off any captured price. $29.99 is about 55% off the $66.65 one-time price, and $20 off the $49.99 subscription.
- **First-order terms.** $29.99 applies only with the new-customer SMS discount, according to the footer small print. The subscription renews at $49.99 every 4 weeks ($1.78/day). Neither appears in the ad. This is the price doubter's main worry.
- **"probiotics" in the post text.** The product has prebiotic fiber and no probiotics. This looks like a real error. It is left as written for the owner.
- **"whole-food ingredients".** The brand file's safe wording is "60+ ingredients". "Whole-food" isn't on the fine-to-repeat list.
- **"less than $1.10/day".** This matches the first-order price only ($1.07/day).
- **FDA line.** The site footer carries it and the ads don't. None is added here.
- **Product rule.** If the storyboard stage adds any opening action, the big pouch opens only at its resealable top. Any daily pack is torn straight across the top edge only.

**MISSING**
- `MISSING:` the P1 image (layout, text position and size, gradient colours, gummy arrangement).
- `MISSING:` characters-per-line limit for on-screen text.
- `MISSING:` current offer terms behind "61% off".
- `MISSING:` which pouch variant P1 showed (Low Sugar, or Sugar-Free with the white burst). Original Low Sugar is assumed.
- `MISSING:` photos of the gummies out of the pack.
- `MISSING:` the gradient colours from the product photo, to name in the notes.

## 7. Score

**83 / 100** (5 of 6 checks passed: 5 ÷ 6 × 100 = 83)

- **Missed: "The product notes match its photos."** The gummy notes come from the brand file description, not a photo, and the P1 image isn't on file to confirm the scene.
```
