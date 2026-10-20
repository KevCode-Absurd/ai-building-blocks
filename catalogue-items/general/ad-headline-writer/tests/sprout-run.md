# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Four short, honest image lines built only from the facts the owner gave, with the main doubt ("Is this just candy?") answered by a real free-from fact and the customer quote used word for word. It correctly flagged that the picture wasn't attached, skipped methylfolate rather than guess what it does, and listed clear MISSING gaps to fill later.

## Judge list

- Met: A stranger understands every line without decoding.
  "Candy? No synthetic dyes or sweeteners." / "One pack a day. Nothing to measure." Plain words; methylfolate dropped as it "fails the glance test".
- Met: No two lines use the same way in.
  Line 1 their words, line 2 their question, line 3 exact fact, line 4 plain gain.
- Met: Each line picks out the reader by what they do or feel, not by a label.
  "parents who've tried other green options their kids refused", "busy parents rushing through breakfast"; no label or condition used.
- Met: Every number, date and quote comes from what you gave it.
  "ages 2 to 13", "One pack a day", and the quote "The only one they love eating" all in the input; character counts verified correct.
- Met: Every question line is answered by a fact you supplied.
  Line 2 "Candy? No synthetic dyes or sweeteners." answered by the supplied "Free from synthetic dyes and synthetic sweeteners".

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
**Level: solution aware.** They've tried other kids' "green" options but don't know Sprout Kids. Lines may say what's different about this one. No deal or urgency.

*The picture was described, not attached, so step 5 was checked against your description, not the image.*

1. **"The only one they love eating"**
   - Way in: their words, quoted word for word from the brand site's Kids page
   - Aimed at: parents who've tried other green options their kids refused
   - Characters: 31
   - Glance test: pass on the image. The pack and gummies in the picture show what's on offer. Off the image, the line wouldn't say what it is.
2. **Candy? No synthetic dyes or sweeteners.**
   - Way in: their question, answered by "free from synthetic dyes and synthetic sweeteners"
   - Aimed at: parents worried this is just sweets
   - Characters: 39
   - Glance test: pass
3. **Vegan, and made for ages 2 to 13**
   - Way in: exact fact. For the buyer, one product covers kids from 2 to 13 and fits a plant-based home.
   - Aimed at: parents with kids anywhere from toddler to 13
   - Characters: 32
   - Glance test: pass
4. **One pack a day. Nothing to measure.**
   - Way in: plain gain from 1 pack a day, 6 gummies. It's pre-portioned, so there's no counting or arguing over how many.
   - Aimed at: busy parents rushing through breakfast
   - Characters: 35
   - Glance test: pass

**Test first: line 2.** It answers the main doubt, "Is this just candy?", with a fact on file.

**Ways in skipped:**
- News: no dated news was supplied.
- Exact fact on methylfolate: "methylfolate" fails the glance test (a stranger would look it up), and nothing on file says what it means for the child.

MISSING: dated news (new format, price or finding) for news
MISSING: what methylfolate does for the child, in plain words, for exact fact
MISSING: product type and nutrient list (e.g. whether it's a multivitamin) to say plainly what's on offer off the image

CHECKS MISSED: none

Next, would you like to check these with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), write the ad copy with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer), make image ads with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker), or write the landing page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer)? You can also type your own next step.
```
