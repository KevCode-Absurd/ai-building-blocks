---
name: buyer-identity-segment-finder
description: Use when you have reviews or survey answers and want to know which kinds of buyer you really have. It finds the "I am a" and "as a" self-descriptions, counts how often each repeats, sizes the groups roughly, maps them from broad to narrow, and picks one group to build for.
---

# Buyer identity segment finder

You help a store owner find the buyer groups already hiding in their reviews and survey answers. People often say who they are when they review ("I am a nurse and I'm on my feet all day"). You count those self-descriptions, rank the groups, and say what to change for the one chosen.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
This skill runs on its own. What's below makes the result better, but none of it is required.

**Works best with** (or they can paste their own instead):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In Claude Code, look in the project too for these by name.
2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with customer words, your question. They can attach them, paste them, or say where they are (in Claude Code, a file path). Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.
3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once, merge steps that give the same thing, and aim for under 700 words unless the job truly needs more. In CHECKS MISSED, name only the checks that failed, or write “none”.

**Tools that do this best:**
- **Any good chat AI:** Reads and counts the self-descriptions in the reviews you paste.
- **Google Forms:** A free way to send the three-question survey and collect open answers.
- **Shopify post-purchase survey apps:** Ask the questions right after an order so answers keep coming.
<!-- /needs -->

## What you need
- **Reviews** (required): your own, a rival's, or reviews of similar products on larger brands or marketplaces. If you have few of your own, use the larger ones. The person pastes them. Strip reviewer names before you start.
- **Survey answers** (optional): replies from your buyers to the three questions in step 3.
- **Rising trends or hobbies in your niche** (optional).

Does not fit: no reviews and no buyers yet. Use the Forum and review avatar digger or the Untapped avatar finder first. Narrowing pays most when the market is crowded and buyers have already tried many products. A brand-new market may need a broader message. All sizes here are rough: test with ad spend before betting on one.

Privacy: count identities, not people. Keep the identity phrase and the product-related words. Never keep reviewer names, profile links, photos or any detail that could point to one person.

## Steps
1. **Gather the reviews.** Use your own first. With few reviews, add reviews of similar products from larger brands and from generic marketplaces. Include a rival's reviews too.
2. **Search for self-descriptions.** Look for "I am a", "I'm a", "as a" and other ways people say who they are: nurse on her feet all day, teacher, dietician, new mother, night-shift worker. Pull the sentence around each one. Keep what the product does for them in their words.
3. **Ask your buyers.** Send existing buyers a short, free-form survey (a free form tool is enough):
   - How would you describe yourself, such as your role or what you do?
   - What is going on in your life or work that made you look for this?
   - How does the product help you in that situation?
   Make the answers open text, not tick boxes. A post-purchase survey, and a follow-up email, keeps answers coming; apps for this exist for Shopify. Ideas for rewards and a non-buyer version are in the Buyer research plan with survey.
4. **Count the repeats.** Group the self-descriptions into identities and count how often each appears. An avatar here means a group that keeps growing in your reviews and survey. If dates are given, note which identities are rising and which are old.
5. **Map the market like nesting dolls.** Start broad and go narrower one step at a time. The source's example: athletic wear, then gym-goers, then gym subcultures such as female-only, alternative and entrepreneur lifters. Place each identity on the map.
6. **Size check.** A niche inside a market of 100 million people can be tiny and still work. A niche inside a market of only 20,000 people may be too small to promote. Those figures are one speaker's illustration. Give each group a rough size note (large, medium, small) and say what the note rests on, such as forum activity, search interest or your own count. If you have nothing, write `[unsized]`.
7. **Watch for new hobbies and trends.** Note any rising hobby or subculture in your reviews or the wider content in your niche (the source's example is cornhole). Decide whether to be the first brand to serve it. Being first is a bet, so say what evidence would back it.
8. **Rank the groups and pick one.** Rank by repeat count, growth, fit with what the product really does, and size. Pick one.
9. **List what changes for it.** The ad, the primary text, the page and the product photos. Everything should speak to that one group.
10. **Hand back the 3-question survey** so the person can keep counting.

## What you hand back
Use these labels in this order:

```
IDENTITIES FOUND
<identity> | count: <n> | trend: <rising | steady | old | unknown> | example words: "<phrase, no names>"
(one row per identity, highest count first)

NESTING MAP
<broad market> > <narrower> > <narrower> > <group>

SEGMENT RANKING
1. <group> | repeats: <n> | size note: <large/medium/small/unsized> because <...> | fits product: <yes/partly/no>
Pick: <group> because <...>

WHAT CHANGES FOR THE PICK
Ad: <...>
Primary text: <...>
Page: <...>
Product photos: <...>

SURVEY (3 questions)
1. <...>
2. <...>
3. <...>

NEXT: <one step, such as the cheapest ad test for the pick>
CHECKS MISSED: <none | list>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Understand your buyers** with the [Job spec writer](https://useaiblocks.com/skills/job-spec-writer). It takes the shortlist.
- **Write the ad copy** with the [Candid line writer](https://useaiblocks.com/skills/candid-line-writer). It takes the shortlist.
- **Study competitor ads** with the [Competitor ad gap finder](https://useaiblocks.com/skills/competitor-ad-gap-finder). It takes the shortlist.
- The [Brand facts accuracy fixer](https://useaiblocks.com/skills/brand-facts-accuracy-fixer). It takes the document.
- The [Email setup health checker](https://useaiblocks.com/skills/email-setup-health-checker). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Checks
- Every identity row has a count and at least one phrase from the pasted text, with no names.
- Counts match the number of times a phrase was found, not a guess.
- Each size note says what it rests on.
- The pick fits what the product really does. Nothing is stretched to suit a group.
- The list of changes covers ad, text, page and photos.
- Health, money and legal claims in the "what changes" list carry a line telling the owner to check with a qualified person.

## If something is missing
- No reviews pasted: `MISSING: reviews`. Give the survey and the search steps only.
- No survey answers: carry on with reviews and say the counts come from reviews only.
- No dates: write the trend as `unknown`.
- No size evidence: write `[unsized]`. Never invent a number of people.

## Avoid
- Counting one person twice because they reviewed twice.
- Choosing the identity with the best story but a count of one.
- Narrowing so far that you cannot reach enough buyers.
- Trusting the survey alone. Compare with what groups actually buy.
- Saving reviewer names.
