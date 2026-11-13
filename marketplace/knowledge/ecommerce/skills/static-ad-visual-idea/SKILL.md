---
name: static-ad-visual-idea
description: "Decide the creative idea of a static ad before any image prompt is written, so it avoids the default centred-product look. Works in a fixed order: the buyer's felt problem or desire in their own words, the angle, the headline, the one-line reason why, how the image will stop the scroll, the visual idea and its tension, how headline and image play off each other, the style, and the product's role. Then checks the idea against the store's own ad history so it is not a repeat of a loser or a near-copy of a live ad, keeps it inside ad policy, and hands a decided concept to the prompt or production step. Logs each idea with its later results. Use for cold-audience statics, when statics look generic, or when a reference ad needs a fresh idea of the store's own."
---

# The visual idea behind a static ad

**You get:** one concept card for a static ad that sets the buyer's problem, angle, headline, reason why and visual idea, with five test results, a history check and a log row, before any prompt is written.

Most weak statics fail before the image exists: nobody decided what the picture should make the buyer feel. This skill makes that decision, writes it down and checks it against what the store already knows.

## When to use

- A cold-audience static is next, and drafts keep coming out as a product in the middle of a nice background.
- The owner shares an ad from another brand and wants "something like this" that is the store's own.
- A concept is approved but nobody can say what the image should show.
- Statics get attention but no sales, and the image may be stopping the wrong people.

## Not for

- Choosing angles and writing the full copy set: use `store-meta-concepts`.
- Picking a ready-made structure fast: use `proven-static-formats`.
- Producing the finished file with real type: use `layered-static-production`.
- Compiling the image prompt: use `ad-image-prompt-compiler`.

## What you need

**Required**

- The brief: product, buyer group, angle if chosen, offer if any, landing page URL.
- Real customer words: reviews export (CSV: rating, body, date) and any post-purchase survey answers. Read them by hand; automated summaries strip the wording you need [AVT-0007].
- The proof table (claims allowed, with sources), from `store-meta-brand-dna`.
- Real product photos.

**Optional**

- Meta Ads Manager export, last 180 days, ad level, with thumbnails: ad name, spend, purchases, cost per purchase, CTR (link).
- A reference ad, as a file or Ad Library link.

**When something is missing.** No reviews or survey: ask once; otherwise use support emails or product questions, and mark the idea low confidence. No ads export: skip the history check and say so.

**Access.** Read only. Output is a concept document. Nothing is generated or launched.

## Before you start: the gates

1. **Gross profit per purchase known** for the product, with a target cost per purchase. Fail: stop; an idea for a product that loses money on each order is wasted work.
2. **Cash and capacity.** The idea can be made with what the store has: a free editor, a phone, an image tool, or a designer. Fail: limit ideas to ones that need only the real product photo and type.
3. **Tracking.** The history check needs store-side purchases per ad. Fail: run the check on spend and counts only and label it.
4. **Proof.** At least one claim the idea rests on has a proof row. Fail: choose an idea that needs no claim (a scene, a use moment) or stop.

## Steps

### 1. Find the felt problem or desire

From the reviews and survey, copy three to five exact phrases about the moment before buying: what went wrong, what they wanted, what they tried. Pick one. If several phrases name the same self-description ("as a nurse"), that marks a buyer group worth its own ad [AVT-0016].

### 2. Choose the angle and the opening

Angle options: reframe (the cause is not what they think), proof, desire, comparison, humour. If every rival opens on the same pain, open with curiosity, proof or a promise instead [LPG-0045]. That card comes from long-form ads and advertorials and fails for buyers already searching for a fix, so in a static treat it as a test. It does not conflict with weighting broad accounts toward problem-aware buyers [MCR-0057]: that card is about who the ad is for, the first about how it opens.

### 3. Write the headline and the reason-why line first

- The headline names the buyer's problem or desire, or makes a true, non-obvious claim. Non-obvious but true beats clever [BRD-0021].
- It is either fully clear or a deliberate curiosity gap [MCR-0024]; a curiosity headline must go to a page that explains, not the product page [MCR-0019].
- One support line carries the mechanism or reason why, from the proof table.
- Never imply the viewer has a condition ("your hair loss"); name the situation instead. Never hide a banned word with symbols to slip past review.

### 4. Choose how the image stops the right people

| Stop type | What it does | Watch out for |
|---|---|---|
| Impossible or scale | Size or physics the eye cannot pass | Must link to the product's job |
| Visible problem | The problem made visible in an object or scene | No body shaming; health policy |
| Humour | An absurd, literal version of the problem | Must not mock the buyer |
| Stakes | What is lost if nothing changes | No fear claims the store cannot prove [MCR-0004] |
| Information look | Looks like a chart, note or diagram, not an ad | The data must be real |

The stop must filter for buyers, not just grab attention; broad attention trains delivery toward non-buyers [MCR-0026], and a high CTR from a striking image can still sell nothing [MCR-0029]. An attention hook followed by a pitch only buyers-ready care about is a mismatch [MCR-0015].

### 5. Decide the visual idea, its tension, and the pairing

- **Visual idea:** one sentence a stranger could picture ("a phone charger cable tied in a knot around a sleeping person's wrist").
- **Tension:** what is unexpected about it, in five words or fewer.
- **Pairing**, pick one: the image raises a question the headline answers; the headline raises a question the image answers; or the image twists what the headline says. If the image only repeats the headline, the idea is not done.
- For sensitive health problems, an illustration can show the problem without graphic images and still follow policy [MCR-0020].
- Borrow visual cues from far-off fields to look fresh, as long as the product stays clear [BRD-0003].

### 6. Choose style and the product's role

- Style follows the register: photo for real and urgent, illustration for sensitive or light, diagram for proof, phone-shot for native.
- Product role follows awareness. For cold, problem-aware buyers, the product can be a small inset. For product-aware buyers or impulse products where seeing it is the reason to buy, the product is big and early. Keep one awareness stage per ad [MCR-0056].

### 7. Test the idea before any prompt

Pass all five:

1. **Half-second test:** shown for half a second at phone size, a stranger can say what the picture is about.
2. **Without the headline:** the image still points at the problem or desire.
3. **True:** every claim has a proof row; no AI person is presented as a customer.
4. **Policy:** no personal-attribute callouts, no unprovable health or money claims, no fake urgency.
5. **Makeable:** the capacity in gate 2 can produce it this week.

A fail sends you back to step 5, once. A second fail means a different stop type.

### 8. Check it against the store's own history

1. Tag past ads by stop type, visual idea and pairing on fixed fields [MCR-0051].
2. An idea that spent at least 3 times target cost per purchase and missed target [ADC-0039] is a known loser; do not remake it unless the angle or buyer changed.
3. An idea close to a live ad (same stop type, same scene, same buyer) adds no reach; change it.
4. Prefer stop types the account has not tested.

### 9. Hand it over and log it

Write the concept card (Output, item 2) and pass it to `layered-static-production` for real type, or to `ad-image-prompt-compiler` for a single image. Add a row to `visual-idea-log.csv`. When results come in, record store-side purchases and cost per purchase at 3 times target cost per purchase of spend.

## Checks before you hand it over

1. The headline uses or is built from a real customer phrase, quoted with its source.
2. Headline and support line were written before the visual idea.
3. The pairing is one of the three; the image does not just repeat the headline.
4. All five tests in step 7 pass, with a note per test.
5. The history check found no known loser or near-copy, or the change is stated.
6. Every claim has a proof row; nothing implies the viewer has a condition.
7. Nothing was generated or launched.

## Output

1. **One-screen summary:** the idea in one sentence, the headline, why it should stop this buyer, and a second idea to run beside it in one line.
2. **Concept card:** product, buyer group, customer phrase and source, angle, opening, headline (with character count), reason-why line, stop type, visual idea, tension, pairing, style, product role and size, awareness stage, landing page, proof rows.
3. **Test notes:** the five tests, pass or fail, one line each.
4. **History check:** similar past ads, their spend and results, and how this idea differs.
5. **`visual-idea-log.csv`** row.

## Common mistakes

- **Starting with "a cool image".** Steps 1 to 3 fix the words first.
- **Stopping everyone.** Step 4 requires a stop that filters for buyers.
- **A picture of what the headline says.** Step 5 requires a pairing.
- **Implying the viewer's condition.** Step 3 and test 4 block it.
- **Remaking a known loser.** Step 8 checks the store's own history.
- **Product hidden for product-aware buyers.** Step 6 sizes the product by awareness.

## Sources

- [AVT-0007]: read reviews by hand and paste exact quotes.
- [AVT-0016]: self-identifying review phrases mark buyer groups.
- [LPG-0045]: open with curiosity, proof or promise when rivals all lead with pain.
- [MCR-0057]: weight broad accounts toward problem-aware buyers.
- [BRD-0021]: good ideas are non-obvious but true.
- [MCR-0024]: a static is clear or a deliberate curiosity gap.
- [MCR-0019]: curiosity statics need a page that explains.
- [MCR-0004]: fear hooks need evidence the product addresses the cause.
- [MCR-0026]: a hook must filter for buyers.
- [MCR-0029]: high CTR can be a false winner.
- [MCR-0015]: attention hook with a buyer-ready body is a mismatch.
- [MCR-0020]: illustration for sensitive health problems, within policy.
- [BRD-0003]: borrow design ideas from distant industries.
- [MCR-0056]: one awareness stage per ad.
- [MCR-0051]: tag every ad on the same fields.
- [ADC-0039]: judge after 3 times target cost per purchase.

What makes this skill ours: headlines built from exact customer phrases before any picture; a stop type that must filter for buyers rather than grab everyone; a history check that blocks remakes of the store's own losers and near-copies of live ads; a log that ties each idea to store-side results.
