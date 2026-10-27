---
name: buyer-identity-segment-finder
description: Use when you have reviews or survey answers and want to know which kinds of buyer you really have. It finds the "I am a" and "as a" self-descriptions, counts how often each repeats, sizes the groups roughly, maps them from broad to narrow, and picks one group to build for.
---

# Buyer identity segment finder

You help a store owner find the buyer groups already hiding in their reviews and survey answers. People often say who they are when they review ("I am a nurse and I'm on my feet all day"). You count those self-descriptions, rank the groups, and say what to change for the one chosen.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Any good chat AI:** Reads and counts the self-descriptions in the reviews you paste.
- **Google Forms:** A free way to send the three-question survey and collect open answers.
- **Shopify post-purchase survey apps:** Ask the questions right after an order so answers keep coming. Many of these apps charge a monthly fee, so check the price. A Google Form is the free way.
<!-- /needs -->

## What you need
- **Reviews** (required): your own, a rival's, or reviews of similar products on larger brands or marketplaces. If you have few of your own, use the larger ones. The person pastes them. Strip reviewer names before you start.
- **Survey answers** (optional): replies from your buyers to the three questions in step 3.
- **Rising trends or hobbies in your niche** (optional).

Does not fit: no reviews and no buyers yet. Use the Forum and review avatar digger or the Untapped avatar finder first. Narrowing pays most when the market is crowded and buyers have already tried many products. A brand-new market may need a broader message. All sizes here are rough: test with ad spend before betting on one.

Privacy: count identities, not people. Keep the identity phrase and the product-related words. Never keep reviewer names, profile links, photos or any detail that could point to one person.

## Steps
1. **Gather the reviews.** Use your own first. With few reviews, add reviews of similar products from larger brands and from generic marketplaces. Include a rival's reviews too. Copy or export only reviews you can already see and may use. Do not scrape sites.
2. **Search for self-descriptions.** Look for "I am a", "I'm a", "as a" and other ways people say who they are: nurse on her feet all day, teacher, dietician, new mother, night-shift worker. Pull the sentence around each one. Keep what the product does for them in their words.
3. **Ask your buyers.** Send existing buyers a short, free-form survey (a free form tool is enough):
   - How would you describe yourself, such as your role or what you do?
   - What is going on in your life or work that made you look for this?
   - How does the product help you in that situation?
   Make the answers open text, not tick boxes. A post-purchase survey, and a follow-up email, keeps answers coming. The free way is a Google Form linked in the order confirmation or a follow-up email. Shopify post-purchase survey apps also exist, but many charge a monthly fee, so tell the owner to check the price. Ideas for rewards and a non-buyer version are in the Buyer research plan with survey.
4. **Count the repeats.** Group the self-descriptions into identities and count how often each appears. An avatar here means a group that keeps growing in your reviews and survey. If dates are given, note which identities are rising and which are old.
5. **Map the market like nesting dolls.** Start broad and go narrower one step at a time. The source's example: athletic wear, then gym-goers, then gym subcultures such as female-only, alternative and entrepreneur lifters. Place each identity on the map.
6. **Size check.** A niche inside a market of 100 million people can be tiny and still work. A niche inside a market of only 20,000 people may be too small to promote. Those figures are one speaker's illustration, not data. Give each group a rough size note (large, medium, small) and say what the note rests on, such as the number of members in a forum or group the owner names, a search-volume tool the owner uses (some are paid), or your own count of repeats. If you have nothing, write `[unsized]`.
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
- The [Market size and survey planner](https://useaiblocks.com/skills/market-size-and-survey-planner). It takes the document.
- The [Customer feedback and brand reviewer](https://useaiblocks.com/skills/monthly-customer-voice-keeper).
- The [Research theme synthesizer](https://useaiblocks.com/skills/research-theme-synthesizer). It takes the document.
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
