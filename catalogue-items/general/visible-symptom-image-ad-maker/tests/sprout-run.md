# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly refused to brief a stomach photo, which would have broken platform body-shaming rules, and handed over a usable lunchbox scene with an accurately counted caption. Its flags on 'feel lighter', 'less bloated' and 'fix' give the owner practical guardrails without inventing anything about Sprout.

## Judge list

- Met: The gate answers are shown, and a stop comes with a hand-off you can use.
  "Where: stomach, stop" ... "HAND-OFF problem-moment-image-ad-maker ... lunchbox with the lid pushed half open ... Line idea: 'The lunchbox came home full' (27)" (count is exact)
- Met: The person is made up, shows no face, and nothing says they're a customer.
  Hand-off scene has "no person is in frame"; no body photo briefed, so nothing shows a face or customer.
- Met: It's never the "before" of a before-and-after.
  Stop result; hand-off shows an untouched lunchbox only, no body or after shot.
- Met: No disease is named, and your copy doesn't say the product treats or cures it.
  "Keep 'supports digestion and gut health' as written. Never use 'fix', 'cure', 'flat stomach'"; no disease named anywhere.
- Met: The skin looks real, with no retouching and no product on it.
  Not applicable: the gate stopped the body photo, so no skin is depicted; nothing contradicts the rule.

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
```
GATE
Where:          stomach, stop
Words:          yes. A line can name the moment ("By 3pm, the waistband pinches") without saying the reader has it
Feels fine:     no. A swollen stomach under trousers invites body shame and comparison, even at an ordinary amount

When it stops:
WHY IT STOPS  Where: the sign is on the stomach, which stops the body photo whatever the other answers are. Feels fine also fails.
HAND-OFF  problem-moment-image-ad-maker. Show the workaround from the story: early evening on a kitchen counter, a work lunchbox with the lid pushed half open and the lunch still untouched inside. A work bag and keys are dropped beside it, under ordinary kitchen light, and no person is in frame. Line idea: "The lunchbox came home full" (27)
FLAGS  Keep "supports digestion and gut health" as written. Never use "fix", "cure", "flat stomach" or "beat bloating". "Less bloated" and "feel lighter" should stay inside the reviewer's quote, attributed, and never be restated as a brand promise. "Feel lighter" can read as a weight-loss claim, so don't pair it with any body image. "If your stomach is sensitive" comes close to telling the reader what they have; "if you have a sensitive stomach" is no safer, so consider "for sensitive stomachs, start with Low Sugar". Keep the opening in first person ("my stomach") and never switch it to "your".
MISSING: brand brain (product look, allowed on-image words). Buyer research in the buyer's own words.
```

Want to take the lunchbox moment into the Problem moment image ad maker next, or type your own next step?
```
