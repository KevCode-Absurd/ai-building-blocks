# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 6 met. Invented facts: 0.

With no founder words on file, the run did the right thing: it refused to script a story, excluded the paid athlete, and delivered a usable interview guide plus a bracketed brief with no invented facts. It fails only because the cost of the decision cannot yet be said plainly, and it over-marked MISSING for per-pack amounts, the study source and offer terms that are in the brand file.

## Fix

In step 3 (interview mode), add: before writing MISSING, pull any needed amounts, study source and offer terms from the brand facts, and state that in interview mode the cost check counts as pending (not failed) while it is a bracketed question for the founder.

## Judge list

- Met: The ad tells one decision, and you learn something you didn't know about the product.
  "The decision chosen: single-serve daily packs instead of a tub" — one decision throughout, built to teach amount per pack.
- Not met: The cost of the decision is said plainly.
  Line 4: "[Say plainly what the packs cost you compared with a tub...]" — cost is still a bracketed question, as the run admits.
- Met: Every fact traces to the founder's words or your brand file. Anything else is a bracketed question.
  Study, guarantee and daily packs are from input; reasons and costs are bracketed; examples marked "Only say this if it's true."
- Met: No line has the founder calling the product "great" or "the best".
  No quality words in any scripted line; "Nothing here says Sprout 'replaces your powder.'"
- Met: Every shot is tagged, and none needs a generated person.
  All eight pictures tagged "(to film)"; "No AI avatar and no AI voice."
- Met: Each founder claim has a test, a count or a quote beside it, or has been toned down.
  "We had it studied" paired with on-screen study numbers; guarantee "stated as is"; packs "shown on camera being filled and opened."

## What went in

```text
Idea: a founder ad on why Sprout is made the way it is.
Founder material: none on file. No founder words, no footage.
The brand page has a paid spokesperson (a former pro athlete).
Product decisions on file (facts, no reasons given):
- Single-serve daily packs instead of a tub
- Pectin base, no gelatin; vegan
- Methylfolate, not folic acid
- Every gummy as Low Sugar or Sugar-Free
- A 2025 study of the product: 12 weeks, 120 adults, vitamin C
  +40.1% (2.7x placebo), folate +20.5% (2.9x placebo)
Buyer doubt: "A gummy can't hold enough to replace my powder."
Guarantee: 30-day money-back, first order only.
Video, 60 seconds.
```

## What came out

```text
**The ad can't be made yet.** Nobody on file can appear as the founder. The paid spokesperson, a former pro athlete, is not a founder and can't tell a founder's decision. We need the real founder's consent to appear, filmed by them or by the brand, plus their own answers. Their answers come first.

`MISSING: the founder's identity, role, and consent to appear as themselves`
`MISSING: any founder words`
`MISSING: any footage or photos (workshop, packing table, testing, sourcing)`

---

## Interview guide

**The decision chosen:** single-serve daily packs instead of a tub. It is the only decision on file that speaks to the buyer's doubt about amount ("A gummy can't hold enough to replace my powder"). We have the fact but not the reason or the cost, so we ask for both.

**Note for whoever films:**
- Chat off camera for a few minutes before recording.
- After each answer, wait. Leave pauses unfilled, because the best line often comes after a silence.
- Ask the founder to answer in full sentences that name the subject, so each answer works as a clip on its own. For example: "We put each day in its own pack because…"
- Use whatever words they use for things, not the brand's.
- Film on a phone, at the packing table if there is one.

**Questions**
1. Tell me about the day you decided Sprout wouldn't come in a tub. Start with "We didn't use a tub because…"
2. How many gummies go into one day's pack, and why that number? Start with "Each pack holds…"
3. Tell me about what the packs cost you compared with a tub: money, packing time, machines, anything. Start with "The packs cost us…"
4. How do you explain to someone on a powder that a day's pack gives them enough? Use the words you'd use across a counter.
5. Tell me about the first time you saw a full day of Sprout laid out next to a scoop of powder. What did you notice?
6. Why did you have the product studied, and what did you want to find out? Start with "We had Sprout studied because…"
7. Tell me about a customer who switched from a powder. What did they say, in their words?
8. How would you ask someone to try their first month? Say it the way you'd say it to a friend.

---

## Brief shape (60 seconds, about 140 words once answered)

| Line | Move | Words or [question] | Picture (tag) | On-screen text |
|---|---|---|---|---|
| 1 | Opening: the choice, as an admission | [Say the moment you decided against a tub. Start with "We didn't put Sprout in a tub because…"] | Founder at the packing table, one daily pack in hand (to film) | [Founder name], [role]. `MISSING` |
| 2 | The usual way | [Say what most gummy brands do instead of daily packs, and what goes wrong with it. Category level, no brand names.] | A plain, unbranded tub beside a scoop of powder (to film) | — |
| 3 | The choice | "So we put each day in its own pack." [Say how many gummies are in one pack, and why that number.] | Hands filling or sealing a daily pack (to film) | [Gummies per pack]. `MISSING` |
| 4 | The cost | [Say plainly what the packs cost you compared with a tub: money, time or machines.] | Stack of packs at the packing table (to film) | — |
| 5 | What you get | [Say what one pack means for someone used to a powder scoop.] | A pack torn open, gummies laid out beside a scoop of powder (to film) | [Key amounts per pack]. `MISSING` |
| 6 | Proof | "We had it studied. Twelve weeks, a hundred and twenty adults." | Label close-up as it's named (to film) | 2025 study, 12 weeks, 120 adults: vitamin C +40.1% (2.7x placebo), folate +20.5% (2.9x placebo). Source: `MISSING` |
| 7 | Guarantee | "Your first order comes with thirty days to get your money back." | Founder at the packing table (to film) | 30-day money-back, first order only |
| 8 | Ask | [Say how you'd ask someone to try their first month.] | Founder hands a pack toward camera (to film) | [Offer and where to buy]. `MISSING` |

### Extra openings (record each separately; film the main part once)
- **The cost:** [Start with what the packs cost you. For example: "Packs cost us more than a tub ever would." Only say this if it's true.]
- **The moment it began:** only if the founder took a powder or gummies themselves first. [Say what you were taking before Sprout and what was wrong with it.] If they weren't a customer first, drop this opening.

*A process opening isn't offered because there is no real footage. A credential opening isn't offered because no credential is on file.*

---

## Notes

**Questions for the founder** (each bracket above)
- Why not a tub, and the moment the decision was made.
- What most gummy brands do instead (category level).
- Gummies per pack, and why that number.
- What the packs cost: money, time or machines.
- What one pack means for someone used to a powder.
- How they'd ask someone to try.

**Other missing facts**
- `MISSING: amounts per pack (which nutrients, how much)`
- `MISSING: the study's source, who ran it, and what was measured (for example, blood levels)`
- `MISSING: offer and CTA destination`
- `MISSING: product photos`

**Claims softened or held**
- Nothing here says Sprout "replaces your powder." The founder answers the doubt in their own words in line 5, and the per-pack amounts on screen back it.
- The study results appear as on-screen text from the study, not as the founder's own result. The film doesn't say the study shows Sprout matches powder, and it doesn't credit any single ingredient for the folate result.

**Proof behind each claim**
- **Daily packs:** shown on camera being filled and opened.
- **"Enough per day":** the per-pack amounts on screen. `MISSING` until supplied.
- **The study:** 12 weeks, 120 adults, vitamin C +40.1% (2.7x placebo), folate +20.5% (2.9x placebo). It needs a citation before airing.
- **Guarantee:** 30-day money-back, first order only, stated as is.

**Decisions held for other ads**
- **Methylfolate, not folic acid:** could pair with the folate result once the reason and cost are given.
- **Pectin base, vegan:** needs a reason and a cost.
- **Low Sugar or Sugar-Free:** needs a reason and a cost.

These suit a 2 to 3 minute version once each has the founder's reason and its own proof.

---

## Casting and wardrobe note

- **Who appears:** only the real Sprout founder, as themselves, filmed for real, with their consent. No AI avatar and no AI voice. The former pro athlete spokesperson does not appear in this ad and must not deliver the founder's decision. `MISSING: founder name, role, consent`
- **Where they film:** at the packing table where daily packs are filled, not at a desk.
- **What they wear:** their usual work clothes, plain, with no other brand's logo.
- **What's in reach:**
  - daily packs, sealed and torn open
  - a full day's gummies laid out
  - a plain unbranded tub
  - a scoop of powder
  - the label, ready for the close-up
- **Next steps:** the shot list skill turns this brief into a real-camera shot list once the answers are in. For a still instead, use `handwritten-note-image-ad-maker` with the founder's own words.

---

## Score: 67 / 100

4 of 6 checks passed: 4 ÷ 6 × 100 = 67.

- **Missed: one decision with its cost said plainly.** The cost is still a bracketed question until the founder answers.
- **Missed: each founder claim has stronger proof beside it.** The study needs its source, and the "enough per day" point needs the per-pack amounts.
```
