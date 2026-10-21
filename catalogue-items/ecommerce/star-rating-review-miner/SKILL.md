---
name: star-rating-review-miner
description: Use when you have competitors' reviews and want to turn each star level into something different. 1-star reviews give broken trust markers, 3-star reviews give product gaps, and "I spent thousands and it did not work" lines give phrases from buyers who are ready for a better fix.
---

# Star-rating review miner

You read competitor reviews one star level at a time, because each level teaches something different. You sort what you find into three lists: broken trust markers, product gaps and hot-lead phrases. You work only from text the person pastes, in the buyers' exact words.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
This skill runs on its own. What's below makes the result better, but none of it is required.

**Works best with** (or they can paste their own instead):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In Claude Code, look in the project too for these by name.
2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with customer words. They can attach them, paste them, or say where they are (in Claude Code, a file path). Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.
3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once, merge steps that give the same thing, and aim for under 700 words unless the job truly needs more. In CHECKS MISSED, name only the checks that failed, or write “none”.

**Tools that do this best:**
- **Amazon reviews:** The largest source of star-rated reviews for physical products, sortable by star.
- **Any good chat AI:** Reads the pasted reviews and applies the star rules to each group.
<!-- /needs -->

## What you need
- **Competitor reviews, by star rating** (required): at least 100 across the products you are studying, so repeats show up. The person pastes them, with the star level kept. Strip reviewer names as you read.
- **Your own reviews** (optional): to compare what your buyers say with what rivals' buyers say.
- **Who you sell to** (strongly advised): one line, so you can tell if a reviewer is in your market.

Does not fit: fewer than about 100 reviews across the set, because a single complaint is not a pattern. Not a tool for scraping or counting reviews with a script. The method is reading by hand and keeping exact words. The Amazon product edge finder in the library is a script-based tool for rival weak spots and selling points. This skill adds the star-by-star rules and the three lists.

Privacy: public reviews only. Keep the words, not the people. No usernames, profile links or photos.

## Steps
1. **Set up three working areas** for 1-star, 3-star, and 1-star plus 5-star reviews. Keep the star level with each pasted review.
2. **Read the 1-star reviews of competitors.** Log each exact failure point and each bit of physical friction. The source's example is a brace the buyer could not take off fast enough. Write what happened, in the buyer's words.
3. **Log repeated claims buyers no longer believe.** When many 1-star reviews say a promise did not hold, that promise is a broken trust marker. It is a claim to avoid making in the same way, or to answer with proof.
4. **Read the 3-star reviews only for structural gaps and level problems.** The source's example is a book review that says it suits beginners but is too basic. A 3-star review often says what the product did not cover. If you are going after beginners, study how the product speaks to them. If your buyers are more advanced, you need more advanced material.
5. **Scan the 1-star and 5-star reviews for hot-lead lines.** Look for variants of "I spent thousands of dollars and it did not work". The writer has looked for a fix, spent time and money, and still has the problem. They are hunting for something better. The source says to lean in on a line like this, whether in a review or a call, because it may describe your best customer.
6. **When two reviews contradict, do not chase both.** For example, one says "too technical" and another says "not scientific enough". Note the split, then choose which group is yours.
7. **Do not build for every complaint.** Ask whether the reviewer is in your market. Sometimes the market is simply not your market. File the complaint away and move on. Chasing every comment pulls the product in many directions.
8. **Copy exact words by hand.** Keep the buyer's phrasing. Do not summarise with a script or let an AI paraphrase it, because that removes the vocabulary and the feeling.
9. **Sort into three lists.**
   - Broken trust markers: answer them on your page.
   - Product gaps: feed them to product and offer decisions.
   - Hot-lead phrases: feed them to ad hooks.
10. **Say what repeats.** For each item, give how many reviews say it. One review is a note, not a finding. Mark the item `[single]` if only one review says it.

## What you hand back
Use these labels in this order:

```
REVIEWS READ: <n total> | 1-star: <n> | 3-star: <n> | 5-star: <n> | products: <n>
Enough to see repeats (100 or more): <yes | no, so findings are leads>

BROKEN TRUST MARKERS  (answer on your page)
1. Claim buyers no longer believe: "<exact words>" | seen in: <n> reviews | how to answer: <proof or a different claim>

PRODUCT GAPS  (feed product and offer)
1. Gap: <structural gap or level problem> | evidence: "<exact words>" | seen in: <n> | in my market: <yes/no/unsure>

HOT-LEAD PHRASES  (feed ad hooks)
1. "<exact words>" | what it signals: <tried and failed, still looking>

SPLITS NOTED
<contradiction> | group I pick: <...>
SET ASIDE
<complaints not in my market>
CHECKS MISSED: <none | list>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Understand your buyers** with the [Switch friction remover](https://useaiblocks.com/skills/switch-friction-remover). It takes the audit report.
- **Plan what to test** with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer). It takes the audit report.
- **Read your ad results** with the [Campaign keep-or-change checker](https://useaiblocks.com/skills/campaign-keep-or-change-checker). It takes the audit report.
- The [AI recommendation gap finder](https://useaiblocks.com/skills/ai-recommendation-gap-finder). It takes the audit report.
- The [Test idea ranker](https://useaiblocks.com/skills/test-idea-ranker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Checks
- Every item is an exact quote from the pasted text, with a count. No names.
- Singles are marked `[single]`, not listed as patterns.
- Each list item has a use: answer on the page, product decision, or ad hook.
- Contradictions are noted and a group is picked, not both chased.
- No item is a claim the skill made up. If it did not read it, it is not on the list.
- A broken trust marker used on your page is answered with real proof, or the claim is dropped. Health, money and legal claims carry a line telling the owner to check with a qualified person.

## If something is missing
- No star levels on the pasted reviews: `MISSING: star rating for each review`. Then you cannot apply the star rules; say so.
- Under about 100 reviews: continue, mark findings as leads, and write `MISSING: more reviews (about 100 across the set)`.
- No line on who the buyer is: `MISSING: who you sell to`, and mark "in my market" as unsure.

## Avoid
- Putting rivals' reviews or failures in your ads. Naming a competitor's flaws can break ad rules or the law. Use the trust markers to shape your own page and claims, and check platform rules before any comparison.
- Quoting a reviewer back as a customer testimonial.
- Treating a single angry review as a pattern.
- Fixing a product for a reviewer who is not your buyer.
- Letting a script or an AI rewrite the reviews before you read them.
