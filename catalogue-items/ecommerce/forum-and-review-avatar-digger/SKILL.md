---
name: forum-and-review-avatar-digger
description: Use when you have a product and no clear picture of who buys it or why. It plans a 60 minute hand-research hour on public forums and Amazon reviews, marks up the quotes you paste, and writes a one-page sketch of a real buyer in their own words.
---

# Forum and review avatar digger

You help a store owner or marketer find out who really buys, in the buyer's own words. The research is done by the person, by hand, in one timed hour. You write the search phrases, keep the clock, mark up what they paste and write the one-page buyer sketch. You never fill gaps with guesses.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
This skill runs on its own. What's below makes the result better, but none of it is required.

**Works best with** (or they can paste their own instead):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In Claude Code, look in the project too for these by name.
2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with your question. They can attach them, paste them, or say where they are (in Claude Code, a file path). Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.
3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once, merge steps that give the same thing, and aim for under 700 words unless the job truly needs more. In CHECKS MISSED, name only the checks that failed, or write “none”.

**Tools that do this best:**
- **Reddit search:** The largest library of buyers describing their problems in their own words, with comments that add detail.
- **Amazon reviews:** Buyers tell their whole story after buying, and long reviews with photos usually hold the most.
- **Meta Ad Library:** Shows what rivals say and who they seem to talk to, which helps you choose the starting group.
- **Any good chat AI:** Keeps the clock, writes the search phrases and marks up the quotes you paste.
<!-- /needs -->

## What you need
- **Product and the problem it solves** (required). One or two sentences.
- **A starting group** (strongly advised): the age range and gender of your biggest competitor's buyers, or the buyer profile an earlier step picked for you. If they don't have it, tell them how to get a rough one: a website traffic tool, the competitor's ads in the Meta Ad Library, or asking a chat AI. Mark any number you could not check as `[guess]`.
- **The posts and reviews** (required for the second half): the person reads them and pastes them in. If your AI can open pages, it may help find threads, but the person still reads them.
- **Customer data** (optional): an order export, if the store already sells, to find its best customers.

Does not fit: a brand-new category with almost no forum chatter (use customer calls instead), or a product nobody discusses in public. One hour gives one buyer sketch, not a finished report. Repeat the hour for each buyer group.

Privacy rule for all public reading: collect words, not people. Never keep usernames, profile names, links to profiles, photos, locations or any detail that could point to one person. Do not message anyone you read. Use the phrases in your own ads, not whole posts, and never present a quote as a customer testimonial.

## Steps
1. **Warm up (optional, 10 to 15 minutes, before the clock starts).** Answer who, what, when, where, why.
   - Who: who are the people who truly fit your offer, not who you assume? For a new offer, look at what rivals' ads say about who they target. For an existing store, find the top 20 percent of customers by spend and look for what they share: age, place, values.
   - What: split it in two. Miracles are their wants, dreams and goals. Miseries are their fears, frustrations and problems.
   - When: life events that change buying (new baby, move, new job, divorce, marriage) and their daily schedule.
   - Where: where they read, watch and talk, online and offline.
   - Why: the deeper reason the benefit matters to them.
   - Type the niche into Google and read the autocomplete suggestions; keep typing a promising phrase to get more. On Amazon, read the autocomplete, the book titles and subtitles (they are written with care to appeal to the buyer) and the reviews. Review counts are only a rough sign of sales.
   - In the Meta Ad Library, open each rival's page transparency list. Ads that repeat, and those low in the list, have probably run longest and may be profitable. That is not certain, so check before you assume.
2. **Pick a starting group.** Use the biggest competitor's top buyer group (for example women 45 to 65). It is where to start looking, not the buyer.
3. **Run the 30-second test.** Ask: can you say, in 30 seconds, who the buyer is, their hopes, their situation, their problem, and the one thing they would wish for if they could snap their fingers? If not, that is why you are doing the research.
4. **Set a timer for 60 minutes.** The source plan is 30 minutes on public forums (Reddit first) and 30 on Amazon reviews. The same speaker also says forums should get most of the effort, about 80 percent, because they hold the most detail. Both are one person's rule. Start with 30 and 30. If the reviews are thin, spend the spare time on forums.
5. **Write the search phrases as the buyer would type them.** Produce 10, in the buyer's voice, each ending with the word Reddit or the name of the niche forum. Cover the problem, the feeling and the fixes already tried. The sources' examples: "my cat won't drink water Reddit" and "hair loss making me less attractive Reddit". Tell the person to act as the buyer while typing.
6. **Read and paste, by hand.** Read each post and its comments word for word. Paste whole posts or lines into one document, with spacing and no structure yet. This is meant to be slow. Do not run a script or an AI over the reviews to summarise them first: it strips the feeling and the vocabulary. Remove usernames as you paste.
7. **Mark up the quotes** (you may do this once they paste them, but only on text they pasted). Bold three things:
   - Feelings: embarrassed, guilty, afraid, ashamed.
   - Fixes already tried, by name: "minoxidil" and "a hair transplant clinic", not "treatments".
   - Situation: single, 31, low confidence; third cat, lost two already.
   Note the mind state for each group. Frustration, fear, shame and depression each need different copy.
8. **Look for confession forums** (r/offmychest is the source's example). One post there can carry a whole ad.
9. **Switch to Amazon for the second 30 minutes.** Read reviews of the same product and similar products. Same pasting, same marking. To split competitor reviews by star rating, point them to the Star-rating review miner.
10. **Write the one-page buyer sketch.** Who they are, what happened, what they tried, what they fear, what they would wish for, and 10 phrases in their words. Every line rests on a pasted quote. A line with no quote is marked `[guess]`.
11. **Hold the sketch next to today's ads and page.** List every line the buyer would not say that way. Use their words ("feel uglier") not the marketer's ("look worse").
12. **Say what comes next.** Repeat the hour for a second group, or check ads and page against this sketch with the Avatar fit checker. Hook writing belongs to the ad copy skills.

## What you hand back
Use these labels in this order:

```
SEARCH PHRASES
1. <phrase as the buyer would type it>
...10

QUOTE FILE  (no names, no links)
Group: <tag only, for example "empty nester, 55">
"<exact words>" | from: <forum or review site> | FEELING: <word> | TRIED: <named fix> | SITUATION: <detail>
(one line per quote)

BUYER SKETCH  (one page)
Starting group: <age range, gender> [checked | guess]
Who they are:       <person-level, not only age and gender>
What happened:      <their story>
What they tried:    <named fixes>
What they fear:     <the deepest one first>
Mind state:         <frustration | fear | shame | depression | other>
What they'd wish for: <the snap-your-fingers outcome>
10 phrases in their words:
1. "<phrase>"
...
Gaps (marked [guess]): <what still has no quote>
NEXT: <one next step>

CHECKS MISSED: <none | list>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Understand your buyers** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). It takes the customer words.
- **Make video ads** with the [Video ad script writer from customer quotes](https://useaiblocks.com/skills/quote-video-ad-script). It takes the customer words and brand brain.
- **Plan what to test** with the [Story ad test planner](https://useaiblocks.com/skills/story-ad-test-planner). It takes the customer words and brand brain.
- **Write the ad copy** with the [Story image ad writer](https://useaiblocks.com/skills/story-image-ad-writer). It takes the customer words and brand brain.
- **Make image ads** with the [Image ads that stop strangers scrolling](https://useaiblocks.com/workflows/scroll-stopping-image-ads). It takes the customer words and brand brain.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Checks
Run these before handing back. Fix any that fail, or list them under `CHECKS MISSED:`.
- Every line in the sketch has a pasted quote behind it, or is marked `[guess]`.
- The quote file has no usernames, profile links, photos or locations.
- Fixes already tried are named, not grouped as "supplements" or "treatments".
- The 10 phrases are the buyer's words, not marketing words.
- The sketch could not describe a different product's buyer: it holds a person-level situation, not just age and gender.
- Nothing about market size, results or numbers was invented.
- If the problem is a health, money or legal one, the sketch records feelings and history only. It does not claim the product treats or cures anything. Anyone writing claims from it should check them with a qualified person.

## If something is missing
- No product or problem: `MISSING: product and the problem it solves`.
- No pasted posts yet: give the plan, the 10 search phrases and the marking rules, and write `MISSING: pasted forum posts and reviews` where the quote file and sketch would go. Never write quotes yourself.
- No starting group: say how to find one and mark the group `[guess]`.

## Avoid
- Writing a buyer from memory or from what an AI "knows". The sketch comes from pasted words.
- Treating one loud post as the market. One story is one story; the Untapped avatar finder checks size.
- Saving names, profile links or photos.
- Quoting a post whole in a public ad, where the writer could be recognised.
- Stretching the product's claims to match a sad story. A health or money claim needs care.
- A persona written as a form: "Sarah, 34, likes yoga". That is a demographic, not a buyer.
