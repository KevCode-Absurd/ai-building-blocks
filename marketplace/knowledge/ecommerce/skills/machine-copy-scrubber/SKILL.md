---
name: machine-copy-scrubber
description: "Clean store copy that reads as machine-written (product pages, ads, emails, collection text, social captions) and rewrite it toward the brand's own voice. Flags stock phrases, formulaic contrasts, three-part lists, rhythm that never varies and punctuation tells, measures reading grade and sentence spread before and after, rewrites using the brand's real lines and customers' own words as the model, and proves no fact, price, claim or legal line changed. Use before any AI-drafted copy goes live, when a page or email reads generic, or when building a store's house style. Read access only; publishing needs the owner's yes."
---

# Machine-sounding copy scrubber

**You get:** clean, ready-to-paste store copy rewritten in the brand's voice, with before and after reading numbers, a flag table of every changed line, a facts kept table and a voice check.

Shoppers have learned the sound of machine copy, and once they hear it they trust the page less. This skill finds the tells, rewrites toward how this brand and its customers actually talk, and checks that nothing true was lost on the way. It never makes copy longer and never adds a fact.

## When to use

- AI-drafted copy is about to go on a product page, ad, email or collection page.
- A page or email "sounds like everyone else" and the owner cannot say why.
- Several writers or tools have made the store's copy uneven.
- Building a house style list for the store's writers and tools.
- Before a fresh-reader test of two drafts, to remove the obvious tells first.

## Not for

- Writing new copy from nothing: use `store-meta-concepts` for ads; this skill edits drafts.
- Checking whether claims are provable: use `product-claims-profile`; this skill keeps claims as they are and flags risky ones.
- The brand's voice rules themselves: they live in `store-knowledge-folder` (`03-voice-and-look.md`).
- Legal text (terms, privacy, subscription terms, required disclaimers): never rewritten here.

## What you need

**Required**

- The draft copy, with where it will run (product page, Meta ad primary text, email, SMS, collection page, social caption).
- Five to ten real brand lines, written by people: older site copy, the founder's own posts or emails, packaging text. Prefer lines from before the store used AI tools.
- Ten or more customer quotes from reviews, verbatim (from `store-knowledge-folder` if it exists).

**Optional**

- The store's banned words list and any brand guide.
- Past winning ads or emails with their numbers, to see which voice already sells.

**When something is missing.** Without real brand lines, use customer quotes as the voice model and say so. Without customer quotes either, scrub the patterns only and mark the result "voice not matched: no samples".

**Access.** Level 1, read. Deliver the rewrite as a file or a draft. Putting it live (theme, ads, email platform) needs draft access to stage it and the owner's yes to publish.

## Before you start: the gates

1. **Facts in the draft are sourced.** Every price, number, claim, ingredient, delivery time and policy in the draft must match the live store or a dated source. Fail: list the mismatches first; scrub the rest, but nothing ships until they are fixed.
2. **Offer lines make money.** If the copy names a discount or bundle, its break-even ROAS must be known from the product's gross profit per purchase; a 30% discount can roughly triple it [OFF-0065]. Fail: flag the offer line "not checked against margin" for the owner.
3. **Testing is possible, or not.** If the owner wants proof the rewrite sells better, check monthly orders: under about 30, research only; 30 to 300, only a big-swing test; more, a normal split test [CRO-0011]. Fail (too few orders): ship on the fresh-reader check in step 7 and say a sales test is not possible.

## Steps

### 1. Measure the brand's voice

From the real brand lines and customer quotes, record: average sentence length, how much it varies, reading grade, use of contractions, "you" versus "we", words they repeat, and words they never use. Write three voice traits, each backed by one real line. Customer words outrank invented ones because they carry the feeling copy needs [AVT-0007].

### 2. Flag the machine patterns

Mark each hit in the draft with its line and category. Practitioner list, our own, extend it per store:

| Category | What to look for |
|---|---|
| Stock phrases | elevate, unlock, seamless, game-changer, look no further, whether you're X or Y, in today's busy world, take it to the next level, curated, crafted with care, designed with you in mind |
| Formulaic contrast | "it's not just X, it's Y", "not X but Y", "say goodbye to X, say hello to Y"; viewers read the "not X, it's Y" pattern as machine copy [MCR-0016] |
| Forced threes | lists of three adjectives or three benefits in sentence after sentence |
| Echo stacks | two or more lines in a row on the same skeleton or opening word ("More comfort. More support. More sleep."; "No fillers. No dyes. No nonsense.") |
| Staccato runs | three very short sentences of the same length in a row ("It works. It lasts. You'll love it.") |
| Empty openers | "Imagine...", "Picture this", a rhetorical question that the next line answers, or one used to move between sections |
| Reveal tricks | "The result?", "Here's the thing:", "The secret?" |
| Hedges and boosters | truly, incredibly, simply, effortlessly, may help support |
| Pain-first default | every piece opens on the same category pain; machine copy leans on it, while curiosity, proof and promise open stronger for cold readers [LPG-0045] |
| Rhythm | every sentence 12 to 20 words; every paragraph two or three sentences; no short punch lines |
| Punctuation and layout | em dashes used as pauses, stacked colons, emoji used as bullet points, more than one exclamation mark per piece, title case on every line, every sentence on its own line |

An em dash is always flagged. Other punctuation is flagged only if the brand's real lines never use it. Emoji: allowed only where the platform and the brand's own posts use them (social captions, some ad text), never in product pages, long emails or policy text.

**Do not flag accurate qualifiers.** "Most customers", "may help", "in our tests" are not machine tells when the claim needs them; removing them can turn a lawful claim into an unsupported one. Hedges are cut only when they add nothing ("truly", "simply").

### 3. Measure the draft

Record reading grade (Flesch-Kincaid; any free readability checker), average sentence length, the spread of sentence lengths, pattern hits per 100 words, and word count. Targets by format:

- Ad hooks and on-screen text: five to eight words, at or below a grade 5 reading level [ORG-0016], for short video and similar.
- Ads, emails, product pages and social posts read on screens: grade 5 to 8 [ORG-0024].
- Long pre-sell pages for mass-market cold traffic: about grade 5, in full flowing sentences [LPG-0047].
- Premium, technical or expert buyers: allow a higher grade; precise terms beat simple ones there, as both cards note in their limits.

### 4. Rewrite toward the brand

Rewrite only the flagged lines and the lines needed to fix rhythm. Rules:

- Swap stock phrases for the brand's or the customers' own words. If a customer said it better, use their phrase (as their quote, or as plain copy if it is a common phrase, not a personal story).
- Replace the contrast pattern with the plain positive statement.
- Break forced threes and echo stacks: keep the one benefit that matters to this buyer, and make each following line add something new (a fact, a consequence, a proof) instead of repeating the frame.
- Mix sentence length: some very short, a few longer.
- Keep every fact, number, price, claim and product name exactly. Never add a fact, a statistic or a testimonial.
- Keep it no longer than the draft; shorter is usually better.

AI may help reword, but it works from the brand's library of real lines; people supply the original ideas [ORG-0025].

### 5. Check facts survived

Run a diff of the draft and the rewrite. List every number, price, unit, claim, ingredient, guarantee, delivery promise and product name in the draft, and confirm each appears unchanged in the rewrite. Any change is reverted unless it fixes a gate 1 mismatch, which is then noted.

### 6. Check platform fields

For ads and messages, recount characters after the rewrite: Meta primary text shows about 125 characters before "more" (recommended, not a limit), headlines about 27 to 40; an SMS segment holds 160 standard characters and one emoji drops it to 70. Email subject lines are best under about 50 characters so phones show them whole (practitioner default, test it).

### 7. Fresh-reader check

Give a reader who has not seen your work the original and the rewrite, unlabelled, in both orders. Ask which sounds like a person who knows the product, which is clearer, and which they would trust. If they pick the original, find out why and fix once more. Mostly machine-made pages rarely do well in search either; human-edited copy is the safer standard [AEO-0033].

## Checks before you hand it over

1. Pattern hits per 100 words fell, and no em dash remains.
2. Reading grade is inside the target band for the format, or the reason it is not is stated.
3. The rewrite is no longer than the draft.
4. Every fact, number, price and claim in the draft appears unchanged (diff attached).
5. Five real brand lines sit beside five rewritten lines, and they sound alike to a fresh reader.
6. Character counts meet the platform's fields.
7. Legal text and required disclaimers were not touched.
8. Nothing was published.

## Output

1. **One-screen summary first:** before and after numbers (grade, average sentence length, length spread, pattern hits per 100 words, word count), the fresh reader's pick, and anything that failed gate 1 or 2.
2. **The clean copy**, ready to paste, in the platform's field layout (for an ad: primary text, headline, description with character counts; for an email: subject, preview text, body).
3. **Flag table:** line number, original text, pattern category, rewrite.
4. **Facts kept table:** item, in draft, in rewrite, same (yes or no).
5. **Voice check:** five real brand lines beside five rewritten lines.
6. Optional: the store's house pattern list, updated with any new tells found, for `store-knowledge-folder`.

## Common mistakes

- **Rewriting toward generic "good copy".** Step 1 measures this brand's voice and step 4 writes toward it.
- **Losing a fact in the polish.** Step 5 diffs every number and claim.
- **Making it longer.** Step 4 caps length at the draft's.
- **One grade target for everything.** Step 3 sets the band by format and buyer.
- **Swapping one stock phrase for another.** The replacement comes from real brand or customer words.
- **Touching legal lines.** They are out of scope and checked untouched.
- **Scrubbing honest qualifiers.** Step 2 keeps qualifiers a claim needs; bolder is not better if it is no longer true.

## Sources

- [MCR-0016]: the "not X, it's Y" pattern reads as AI copy.
- [LPG-0045]: machine copy defaults to opening on pain.
- [ORG-0016]: hook text five to eight words, grade 5 or below.
- [ORG-0024]: screen copy at grade 5 to 8.
- [LPG-0047]: long cold-traffic pages at about grade 5.
- [AVT-0007]: customer words, verbatim, carry the feeling.
- [ORG-0025]: people write the originals; AI remixes the library.
- [AEO-0033]: few fully AI pages rank; human-edited is safer.
- [OFF-0065]: discount lines change break-even ROAS.
- [CRO-0011]: whether a test is possible depends on monthly orders.

What makes this skill ours: it rewrites toward the brand's measured voice and customers' own words rather than a generic style; it proves with a diff that no fact, price or claim changed; it sets the reading grade by format and buyer instead of one number; and it checks any offer line against the product's margin before the copy ships.
