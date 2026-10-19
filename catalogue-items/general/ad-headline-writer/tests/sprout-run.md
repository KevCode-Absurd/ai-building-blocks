# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Four clean, on-brief image lines that stay inside the supplied facts, answer the 'just candy' doubt with an approved claim, and quote the review accurately with its source. The owner could put these on the image as-is; only the layout headings differ slightly from the template.

## Judge list

- Met: A stranger understands every line without decoding
  "Candy? No synthetic dyes or sweeteners." and "One pack a day. Nothing to measure." need no decoding; line 3's "they" is clear on a kid's-hand image.
- Met: No two lines use the same way in
  Plain gain, exact fact, their words, their question: four lines, four distinct ways in; news skipped and noted.
- Met: Each line picks out the reader by what they do or feel, not by a label
  "parents wary that kids' gummies are sweets in disguise", "busy parents rushing a morning routine"; no label or condition used.
- Met: Every number, date and quote comes from what you gave it
  "ages 2–13", "One pack a day", "6 gummies" and "The only one they love eating." all appear in the run input; character counts verified correct.
- Met: Every question line is answered by a fact you supplied
  "Candy? No synthetic dyes or sweeteners." answered by the supplied 'free from synthetic dyes and synthetic sweeteners' fact.

## What went in

```text
Buyer: busy parents, mostly mums, with picky eaters at home. They
want no fight at the table. Doubt: "Is this just candy?" They've
tried other kids' green options, but don't know Sprout Kids.
Facts: Sprout Kids, 1 pack a day, 6 gummies, Strawberry Burst
flavour, ages 2 to 13. Methylfolate, not folic acid. Free from
synthetic dyes and synthetic sweeteners. Vegan.
Customer quote (brand site, Kids page): "I have tried all of the
'green' options for the kids and this is the only one they love
eating. They think it's a treat."
Count and limits: 4 lines for the image, under 40 characters each
Picture: a small hand taking gummies from a torn yellow Sprout Kids
pack at a breakfast table
```

## What came out

```text
**Level: Solution aware.** They've tried other kids' "green" options but don't know Sprout Kids. The line may say what's different about this way of solving it; it shouldn't introduce the problem from scratch.

*Note: step 5 was checked against your description of the picture, not the image itself.*

1. **Vegan strawberry gummies for ages 2–13**
   - Way in: Plain gain
   - Aimed at: parents choosing for kids aged 2 to 13
   - Characters: 38/40
   - Glance test: Pass. The words add vegan, flavour and age range, none of which the picture shows.

2. **One pack a day. Nothing to measure.**
   - Way in: Exact fact (1 pack a day, 6 gummies)
   - Aimed at: busy parents rushing a morning routine
   - Characters: 35/40
   - Glance test: Pass. The words add the dose, and the torn pack already on screen backs it up.

3. **"The only one they love eating."**
   - Way in: Their words (exact excerpt, brand site, Kids page)
   - Aimed at: parents who've already tried other "green" options
   - Characters: 32/40
   - Glance test: Pass. The words add a verdict the picture can't give.

4. **Candy? No synthetic dyes or sweeteners.**
   - Way in: Their question ("Is this just candy?"), answered by the dye- and sweetener-free fact
   - Aimed at: parents wary that kids' gummies are sweets in disguise
   - Characters: 39/40
   - Glance test: Pass. The gummies on screen raise the doubt, and the words answer it.

**Test first:** Line 4. It meets the buyer's main doubt head-on with a fact on file.

**Ways in skipped:** News. No dated, new material was supplied.

MISSING: dated news (new format, price or finding) for News

**Score: 4/4 checks passed = 100/100**
- No checks missed.
```
