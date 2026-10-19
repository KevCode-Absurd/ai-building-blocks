# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly stopped at the body gate because the sign is on the stomach, explained why clearly, and handed off a usable snapshot moment with a 27-character line. Everything it said traces to the input or the skill's own rules, so the owner can act on it without checking anything.

## Judge list

- Met: The gate answers are shown, and a stop comes with a hand-off you can use.
  "Where is it? The stomach. This fails" ... "Hand-off to problem-moment-image-ad-maker" with moment and line idea.
- Met: The person is made up, shows no face, and nothing says they're a customer.
  "There's no person, or at most a made-up adult's hand at the edge unclipping the lid."
- Met: It's never the 'before' of a before-and-after.
  "would also suggest a before-and-after next to the copy's 'feel lighter, less bloated'" — named the risk and avoided it.
- Met: No disease is named, and your copy doesn't say the product treats or cures it.
  No disease named; run flags "supports, never fix" limit and the line idea makes no claim.
- Met: The skin looks real, with no retouching and no product on it.
  "flat indoor light or phone flash" ... "The product is left out." Only a hand at the edge, nothing retouched.

## What went in

```text
Story ad (approved, built on reviews 8 and 10):
By 3pm, every day, my stomach was swollen and tight under my work
trousers.
So I started skipping lunch. Most days the lunchbox came home
full.
I'd tried fiber powders and probiotics. Sprout is a daily pack of
gummies with 6 g prebiotic fiber, and it supports digestion and
gut health. One reviewer wrote: "Feel lighter, less bloated and
overall good." Start with Low Sugar if your stomach is sensitive.

Buyer: the gut-fix seeker, 25 to 55, mostly women.
Brand limits: "supports", never "fix".
```

## What came out

```text
**Gate**
- **Where is it?** The stomach. This fails, because stomach is on the stop list.
- **Can the words stay off the reader?** Yes. The opening is first person ("my stomach was swollen"), and a line under the picture can name the moment instead of the reader's body.
- **Would someone without it feel fine?** Not reliably. A swollen stomach pressed against trousers invites body comparison and shame, and platforms read it as a hint about the viewer's body.

**Why it stops**
The sign sits on the torso, a body area this picture can't show. Any close-up of a tight waistband or swollen belly would also suggest a before-and-after next to the copy's "feel lighter, less bloated." That copy also needs care under the brand's "supports, never fix" limit.

**Hand-off to `problem-moment-image-ad-maker`**
- **Moment:** It's early evening on a kitchen counter. A work lunchbox sits open with the lunch untouched inside. Next to it are a commuter tote, a lanyard or keys, and the room's ordinary clutter. The light is flat indoor light or phone flash. There's no person, or at most a made-up adult's hand at the edge unclipping the lid. The product is left out.
- **Line idea:** "The lunchbox came home full" (27 characters)
```
