# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, usable story ad: the push is honestly marked thin, the one quote is verbatim and attributed, the scene details are flagged as inferred, and the word and character counts are exact. The owner gets a clear picture brief, a story that stays inside the allowed claims, and a plain warning that the teaching page must be built before it runs.

## Judge list

- Met: Cover the product name; picture and first line still make sense
  "The fiber powder tub is two-thirds full." under a shelf of half-used tubs reads as a post without any brand name.
- Met: First 125 characters pick up what the picture makes people wonder
  Wonder: "Why does someone keep buying these and never finish one?" Opening: "Neither one ran out. They just stopped getting opened."
- Met: Every quoted phrase matches a review word for word
  "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved." matches review 8 exactly; "15 years" matches review 7.
- Met: Nobody speaks in first person unless real and agreed
  "The brand, in third person... retelling one customer word for word"; the only first person is a real quoted customer, attributed.
- Met: Teaching page: no price, discount or product page link in the story
  Close: "we put together a plain guide to why fiber routines stall"; no price, discount or link anywhere.
- Met: Word count fits the length asked (short, 120 to 260)
  Claimed 195 words; manual count of the story gives 195.

## What went in

```text
Buyer: the gut-fix seeker, 25 to 55, mostly women. Bloating and
irregularity. Has tried fiber powders and probiotics.

Customer words:
7. "My bowel movements are normal for the 1st time in 15 years!"
8. "The prebiotics do their job, but not aggressively, and I feel
   like my overall digestion has improved." (brand site)
9. "[Sprout] have been the solution to my problems with
   regularity." (retailer)
10. "Feel lighter, less bloated and overall good." (retailer)

Product: Sprout, a daily pack of greens gummies, 6 g prebiotic
fiber. Low Sugar or Sugar-Free.
Allowed: "Supports digestion and gut health." Survey line, always
"of surveyed users": "67% ... experienced better, more regular
digestion."
Never: "fix", treats IBS, a result in a set time.
Narrator: nobody has agreed. Destination: a teaching page, not
built yet. Length: short.
```

## What came out

```text
PUSH       pass, but thin. No single moment is described. It rests on how long the problem lasted, "My bowel movements are normal for the 1st time in 15 years!" (quote 7, MISSING: source), and on the buyer note that she has tried fiber powders and probiotics. So the push is built from the fixes she tried and dropped.
NARRATOR   The brand, in third person, describing the frame and retelling one customer word for word. Nobody has agreed to narrate, so there is no first person and no "you" story about the reader's body.
SHAPE      Down and back up: one fix after another, then a gentler one. It rests on quote 7 ("15 years", the long run of failed fixes), quote 8 ("do their job, but not aggressively", set against harsher fixes) and the buyer note on powders and probiotics tried.

PICTURE
Trace:     thing
Skill:     tried-before-products-image-ad-maker
Scene:     A pantry shelf holding two half-used fiber powder tubs (one open, with a dry scoop inside), a barely started probiotic bottle and a glass with cloudy residue. Labels are blank or turned away.
Wonder:    Why does someone keep buying these and never finish one?
Starter prompt: Candid phone photo, slightly overhead, of a kitchen pantry shelf in soft morning light. Two unbranded fiber powder tubs, one open with a dry scoop resting inside. A small probiotic bottle, nearly full, with its cap off beside it. A drinking glass with cloudy residue at the bottom. Labels blank or turned away. A real, slightly cluttered home, natural colours, no people, no text, no logo, no product.

STORY  (opener: describe the frame / short / 195 words)
The fiber powder tub is two-thirds full. The probiotic bottle beside it is barely started. Neither one ran out. They just stopped getting opened.

It usually starts the same way. Bloated by mid-afternoon, never quite regular, and a new tub bought to finally sort it out.

The powder made sense. Fiber is the advice everyone gives. But it meant scooping, stirring and drinking something gritty every single morning, and the mornings it got skipped added up. The probiotics were easy to take and hard to tell were doing anything.

So the tubs moved to the back, and trying something new started to feel like buying the next one to sit beside them.

Sprout is a daily pack of greens gummies with 6 g of prebiotic fiber, in Low Sugar or Sugar-Free. There's nothing to mix. It supports digestion and gut health.

One customer wrote on our site: "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved."

67% of surveyed users experienced better, more regular digestion.

If that shelf looks familiar, we put together a plain guide to why fiber routines stall, and what to look for next.

LINE UNDER THE PICTURE   Three tries, none finished (plain caption with a count, 26 characters)
OTHER OPENINGS  1. It was the second fiber tub that year, and the first one wasn't empty. / Gummies in, scoop out (the swap, 21 characters)  2. "The prebiotics do their job, but not aggressively." That's how one customer put it. / but not aggressively (buyer's own line, 20 characters)
PAGE      MISSING: the teaching page isn't built, and the ad must not run until it is. Its first screen must show the same shelf of half-used tubs and open on "The fiber powder tub is two-thirds full." It should teach why fiber routines stall before it sells, say plainly that it's from Sprout (not dressed as an article or a news outlet), and bring in the product, the survey line and the offer only near the end.
FLAGS     Permissions: quote 8 is used word for word from the brand site. Confirm it may run in ads. Quote 7 is left out because it has no source; it can be used once the source is confirmed. Quote 9 is left out because "solution to my problems" sits too close to the banned "fix". Quote 10 is left out because "less bloated" goes beyond the allowed claims. Inferred: paragraphs 2 to 4 (scooping, gritty, skipped mornings, tubs moved to the back) are [inferred] from the buyer note, not quoted. Claims used: "Supports digestion and gut health" (verbatim); the survey line with "of surveyed users"; 6 g prebiotic fiber; Low Sugar or Sugar-Free. MISSING: survey size, date and method; brand photo style and colours; offer and guarantee (not needed for a teaching page). The words "fix", IBS and any timeline are avoided throughout. Picture: I can't make images here. Paste the starter prompt into ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield's image tool. A real phone photo of a real shelf would beat a generated one.
TESTS     1. The same story with two pictures: the half-used tubs shelf (thing) against an empty kitchen bench at 7 a.m. with a scoop left by the sink (place). Judge on how many readers reach the offer on the teaching page, then on sales, against other new-customer ads, not retargeting.  2. The winning picture with opening 1 (the date) against the original frame opener, judged the same way.
CHECKS MISSED  none
```
