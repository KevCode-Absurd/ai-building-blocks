# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest brief: it rejects the requested 61% caption bar for well-evidenced reasons (unsourced stat, clashes with the 61% discount), grounds the picture in the story's 3pm desk moment, and flags every gap as MISSING including the weak landing page. The owner can hand the prompt straight to an image tool; the only soft spot is that an empty desk sorts gut sufferers less sharply than the runner-up cupboard shot, which the test will reveal.

## Judge list

- Met: The picture builds on a moment quoted from your story, not on the product.
  "Every day at 3pm I'd push my chair back from my desk and wait for my stomach to settle." drives an empty-desk scene; product left out.
- Met: Someone with the problem would know what it's about with no caption.
  "Afternoon-stomach sufferers recognise the pause without a caption." Plausible via the 3pm desk moment, though the sort is subtle; the runner-up sorts harder.
- Met: Someone without it would scroll past, and nothing says what the reader has.
  "Others see an empty office and scroll on. Nothing names a condition." Prompt bans medicine, supplements, text, people.
- Met: The story's first line answers what the picture makes people wonder.
  "Why is that chair pushed back..." picked up by "Every day at 3pm I'd push my chair back from my desk..." within 125 characters.
- Met: The runner-up shows a different kind of evidence, so the test can teach you something.
  "tried-before-products-image-ad-maker (trace: on a thing)" against the chosen place trace.
- Met: Any swap from the skill you asked for is explained.
  "Changed from fact-caption-image-ad-maker because: The fact has no source on file... footnote... only says 'Source'" plus three more reasons.

## What went in

```text
Story ad (approved; narrator: a customer who agreed, example only):
Every day at 3pm I'd push my chair back from my desk and wait
for my stomach to settle.
I'd tried fiber powders. I'd tried probiotics. Nothing stuck.
Sprout is a daily pack of gummies with 6 g prebiotic fiber. It
supports digestion and gut health. One reviewer with IBS wrote
that the prebiotics "do their job, but not aggressively."
If your stomach is sensitive, start with Low Sugar.

Buyer: the gut-fix seeker, 25 to 55, mostly women.
Picture wanted: the caption bar, with "61% of Americans
experience weekly digestive issues" (product page).
Brand rule: "supports", never "fix".

[attached: sprout/product-page.md]
```

## What came out

```text
## 1. Push

**"Every day at 3pm I'd push my chair back from my desk and wait for my stomach to settle."**

This is the story's first line, in the customer narrator's voice. It names the day ("every day"), the time (3pm), the place (her desk) and the thing in hand (the chair she pushes back).

## 2. Trace and skill

**Where the evidence lives:** in a place. The moment leaves one trace a phone could catch: a desk chair rolled back from a desk in the middle of a workday.

**Skill:** `empty-room-image-ad-maker`

**Changed from `fact-caption-image-ad-maker` because:**
- **The fact has no source on file.** On the product page, the footnote for "61% of Americans experience weekly digestive issues" only says "Source" (Issues you can see, #11). A caption-bar picture is only honest with a sourced fact. `MISSING: the source behind the 61% digestive-issues stat`
- **The number clashes with the offer.** The ad funnel already uses "61%" as a discount figure ("the ad that sent you says 61%"). A 61% stat on the picture would be read as a sale.
- **It's far from the push.** The push is about 3pm at a desk, not a national statistic.
- **It names the reader's problem.** A digestive-issues stat on the image tells the viewer what they have, which breaks the "nothing says what the reader has" rule.

## 3. Runner-up

`tried-before-products-image-ad-maker` (trace: on a thing).

The story supports it with "I'd tried fiber powders. I'd tried probiotics. Nothing stuck." The picture would show a half-used, unbranded tub of fiber powder with the scoop dried inside, next to a nearly full generic probiotic bottle at the back of a kitchen cupboard. It would use no rival's pack, shape or label.

## 4. The brief

`MISSING: the gate, steps and hand-back order of empty-room-image-ad-maker.` That skill was not supplied. The brief below follows the family checks and house rules only. Check it against the skill's own gate before generating.

**Scene:** An ordinary home-office or open-plan desk in mid-afternoon. Nobody is in the frame. The office chair is rolled back about an arm's length from the desk and turned slightly away, as if someone pushed back and is sitting it out.

**What shows the day stopped:**
- The laptop is open, and the screen is softly blurred.
- A mug of coffee is half-drunk.
- A glass of water is untouched.
- A lunch container is closed, pushed to the back corner.

**What it must not show:**
- Nobody holding their stomach.
- No pills, medicine, powders or the product.
- No wording on any surface.

**Time cue:** Low, warm-white afternoon light from a side window. A plain analogue wall clock with no brand or numerals text, its hands near 3:00. This is optional; drop it if it looks staged.

**Format:** 1:1 square, phone-captured look from standing height, slightly off-level. The usual mess stays in: a tangled charger cable, a lanyard, a couple of blank sticky notes, a pen. Not retouched.

**Words on image:** none.

**Product:** left out (not asked for).

**People:** none.

**Image prompt:**
> Square 1:1 smartphone photo taken from standing height, slightly tilted, of an ordinary work desk in mid-afternoon with no one present. An office chair has been rolled back about a metre from the desk and swivelled slightly away from it. On the desk: an open laptop with a softly blurred, unreadable screen, a half-drunk mug of coffee, a full glass of water, a closed plastic lunch container pushed to the back corner, a tangled phone charger cable, a lanyard, two blank yellow sticky notes and a pen. Plain analogue wall clock in the background, hands near 3:00, no text on its face. Soft side light from a window, natural slight shadows, everyday clutter, true-to-life colours, mild phone-camera noise, no retouching. No people, no hands, no logos, no brand names, no readable text anywhere, no medicine, no supplements, no food packaging labels, no green colour theme, no graphics or overlays.

**Fixes, one at a time:**
- If the clock looks staged, remove it.
- If the chair reads as tidy, push it further back and turn it more.
- If any text appears on screens or objects, blur it.
- After two failed tries, switch to the runner-up idea rather than changing the facts.

## 5. What it makes people wonder

**Why is that chair pushed back from the desk in the middle of the afternoon?**

The story's opening picks this up in its first 88 characters, well inside 125: "Every day at 3pm I'd push my chair back from my desk and wait for my stomach to settle."

## 6. Line under the picture

**"3:00 pm. Chair pushed back."**

This is a plain caption: what's in the frame, plus the time. It is 27 characters.

## 7. Test

Run the same story with the empty-desk picture against the old-things-that-failed cupboard picture. Judge first on how many readers reach the Subscribe & Save offer on the page, then on sales.

---

**Check before hand-back**

**Stop:** Passes. An empty desk with the chair shoved back looks off between friends' posts, and it's a scene this buyer lives.

**Sort:** Passes. Afternoon-stomach sufferers recognise the pause without a caption. Others see an empty office and scroll on. Nothing names a condition.

**Follow:** The first line passes. The landing page fails.
- The product page does not open on this moment. It opens on a stack of discount banners and "revive whole body vitality", and gut health is the third bullet.
- The reviews sit at the very bottom.
- `MISSING: a landing page (or anchor) that opens on digestion and the afternoon-stomach moment`

**Story facts not found on the product page:**
- `MISSING: source for "6 g prebiotic fiber"`. The page lists inulin but gives no gram amount.
- `MISSING: permission on file for the IBS reviewer quote`

**Brand rule:** The story uses "supports", never "fix". This passes.

**House rules:** No logo, price, button, app look, child or product, and no words on the image.
```
