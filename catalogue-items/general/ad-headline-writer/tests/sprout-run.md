# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Four clean, on-brief image lines, each under 40 characters with correct counts, built only from the facts supplied and wisely leaving out the jargon word methylfolate. The owner could put these on the Kids ad image as is, and line 3 is a sensible first test against the "just candy" doubt.

## Judge list

- Met: A stranger understands every line without decoding.
  All four lines are plain speech; the run even dropped methylfolate because "A stranger would likely need to look it up".
- Met: No two lines use the same way in.
  Plain gain, exact fact, their question, their words: one each across lines 1 to 4.
- Met: Each line picks out the reader by what they do or feel, not by a label.
  "no fight at the table", "Candy?", "the only one they love eating": all situation or doubt, no labels.
- Met: Every number, date and quote comes from what you gave it.
  "6-gummy", "ages 2 to 13" and the trimmed quote "The only one they love eating" are all in the run input.
- Met: Every question line is answered by a fact you supplied.
  "Candy? No synthetic dyes or sweeteners" is answered by the supplied free-from fact.

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
**Level: Solution aware.** They've tried other kids' green options but don't know Sprout Kids. Each line may say what's different about this one. Each line may not explain the category or restate what the picture shows.

1. **Strawberry Burst, no fight at the table**
   - Way in: Plain gain
   - Aimed at: Parents who face a daily standoff over the healthy stuff
   - Characters: 39
   - Glance test: Pass. A stranger would read it as a strawberry kids' product that ends the mealtime fight.

2. **One 6-gummy pack a day, ages 2 to 13**
   - Way in: Exact fact
   - Aimed at: Parents who want one simple daily routine that works for every child in the house
   - Characters: 36
   - Glance test: Pass. A stranger would read it as one small pack a day for kids from toddler to 13.

3. **Candy? No synthetic dyes or sweeteners**
   - Way in: Their question
   - Aimed at: Parents who look at gummies and suspect they're sweets in disguise
   - Characters: 38
   - Glance test: Pass. A stranger would read it as a gummy that isn't made like candy.

4. **"The only one they love eating"**
   - Way in: Their words. The quote is from a customer on the brand site, Kids page.
   - Aimed at: Parents who've already tried the other green options and watched them get refused
   - Characters: 31
   - Glance test: Pass. A stranger would read it as a parent saying their kids actually eat this one, unlike the others.

**Test first: Line 3.** It answers the buyer's main doubt head-on with a fact on file.

**Ways in skipped:** News. There is no dated news on file.

MISSING: dated news (new format, price or finding) for News
MISSING: what the gummies contain beyond methylfolate (nutrients, sugar per pack) for a stronger answer to "Is this just candy?"

Methylfolate was left out of every line. A stranger would likely need to look it up, so it fails the glance test.
```
