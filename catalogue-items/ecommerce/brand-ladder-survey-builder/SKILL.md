---
name: brand-ladder-survey-builder
description: Use when you want to know where your store ranks against rivals in your buyers' minds. It builds a short buyer survey, a scoring sheet and a read-out that shows which brands buyers name first, where you rank on six attributes, where you lead, and what you can claim. It also plans a theme test and a repeat survey.
---

# Brand ladder survey builder

You build a short survey that shows where a store sits in its buyers' minds compared with rivals. Buyers name the brands they think of in order (the ladder), then rate you and each rival on six attributes. You write the survey script, the scoring sheet and the read-out layout. You do not invent results.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Competitors** (yours): the brands buyers compare you with.

**Makes it better (optional):**
- **Brand file** (its buyers part), made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand file, read:** `index.md`, `facts.json`, `offers.json`, `references.md`. Take the buyers, the main promise, approved claims only, and the options buyers weigh. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for competitors, your brand file, your question. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Google Forms:** A free way to build and send the survey and collect answers in a sheet.
- **Shopify post-purchase survey apps:** Ask the survey right after an order so you reach real buyers. These apps are usually paid. Google Forms with an emailed link is a free way to do the same.
- **Any good chat AI:** Writes the survey and works out the ranks on the answers you paste in.
<!-- /needs -->

## What you need
- **Category and rivals** (required): what you sell and the three to seven rivals buyers would think of. Build the rival list from your reviews, search results for your category, or what buyers say when asked who else they considered.
- **Who the buyers are, and a way to reach 50 to 200 of them** (required): an email list, a post-purchase survey, or a paid panel.
- **Six attributes buyers care about** (strongly advised): if the person has none, you propose them in step 3.
- **Two candidate themes** (optional): two ways you could position the store, for the theme test.

Does not fit: a store with no way to reach at least 50 buyers. With small samples the error is wide, so look only for big gaps. Splitting audiences by region or channel for the theme test needs enough volume. A small store can test themes one after the other and compare. The test numbers in this method come from one 1980s direct-mail service case.

## Steps
1. **Define the category and the rival list.** People rarely name more than about seven brands in a category they care about, and one or two in a category they do not. Keep the rival list to what buyers will really know.
2. **Ask for unprompted recall first.** The first question, before any brand name appears anywhere in the survey: "Name every brand you can think of in this category, in order." This gives the ladder: who comes to mind first, and how many brands buyers hold at all.
3. **Choose six attributes.** Take the usual reasons to buy in your category (for example range, service, quality, size, delivery speed, price). Add one or two that come from your own story (for example local, a specialist, handmade). The source's bank used four traditional attributes and two local ones.
4. **Ask for ratings.** Ask buyers to rate you and each rival from 1 to 10 on each of the six attributes. This is the semantic differential method. Add a "don't know this brand" choice so people do not rate a brand they have never met.
5. **Write the survey script.** Recall question first, then ratings, then two or three questions about the buyer (how often they buy, which brand they bought last), then a thank-you. Keep it short enough to finish in a few minutes.
6. **Sample.** 50 to 200 buyers, from an email list, a post-purchase survey or a paid panel. Say the sample size on the read-out.
7. **Rank, don't average.** For each attribute, rank you against the rivals. Find the attributes where you are already first, even if you are last on the traditional ones. In the source's case, a bank was last on all four classic bank attributes and first on two local ones, so it built on the local position.
8. **Start with what buyers already give you,** not what you wish they said. A claim should rest on a place where buyers already rank you high, or where you can show proof.
9. **To choose between two themes,** run each one in a matched audience for about 13 weeks. Measure awareness before and after, and sales. In the source's case, awareness more than doubled (23 to 47 percent) under the theme that fit the existing mental picture, and stayed flat (27 to 25 percent) in the other, even though both raised sales. A small store may run the themes one after the other and compare.
10. **Repeat the same survey.** The source's bank case repeated the research after fifteen months, with the same questions. Plan to repeat it 12 to 15 months later as a starting point, asking the same kind of buyers, to see whether your rank moved.
11. **Keep ego out.** The answer comes from the market, not from the marketing manager or the founder.
12. **Write the read-out.** Where you rank, where you lead, what to claim, what not to claim, and what to test next.

## What you hand back
Use these labels in this order:

```
SURVEY SCRIPT
Intro: <one line, no brand names>
Q1 (unprompted): Name every brand you can think of in <category>, in order.
Q2 to Q7 (ratings 1 to 10, plus "don't know this brand"): <attribute 1> ... <attribute 6>
  for each of: <your store>, <rival 1> ... <rival n>
Q8 to Q10 (about the buyer): <how often they buy> | <last brand bought> | <how they found us>
Thank-you: <...>
Sample: <50 to 200 buyers from: email list | post-purchase | panel>

SCORING SHEET
Ladder: brand | times named first | times named at all | average position
Ratings: attribute | you (average) | rank among brands | first-ranked brand | gap to first
Rank, don't average: <attributes where we rank first>

READ-OUT
Where we rank on the ladder: <...>
Where we lead: <attributes>
What to claim (and the proof): <...>
What not to claim: <...>
Sample: <n> | error is wide, so only large gaps count

THEME TEST (optional)
Theme A: <...> | Theme B: <...> | audiences: <matched | in turn> | length: about 13 weeks
Measure: awareness before and after, and sales
REPEAT PLAN: same survey in 12 to 15 months, same questions
CHECKS MISSED: <none | list>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Market size and survey planner](https://useaiblocks.com/skills/market-size-and-survey-planner). It takes the document.
- The [Research theme synthesizer](https://useaiblocks.com/skills/research-theme-synthesizer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Checks
- Q1 comes before any brand name is shown.
- Exactly six attributes, with at least one tied to the store's own story.
- Every rating question has a "don't know" choice.
- The scoring sheet ranks; it does not only average.
- The read-out states the sample size and says only large gaps count.
- Every claim on "what to claim" rests on a place where buyers already rank the store high, or on proof the owner holds.
- Comparative claims against named rivals are flagged for the owner to check against advertising rules in their market with a qualified person.
- The 1980s test numbers are labelled as one case.

## If something is missing
- No rival list: `MISSING: rivals buyers would think of`. Offer to propose a list the owner must check.
- No way to reach buyers: `MISSING: a way to reach 50 to 200 buyers`.
- No attributes: propose six and mark them `[proposed]`.
- No themes: skip the theme test and say so.

## Avoid
- Showing rival or brand names before the recall question.
- Averaging scores so the places where you lead disappear.
- Reading small gaps from a small sample.
- Claiming a lead the buyers did not give you.
- Treating the theme test numbers as a benchmark.
- Letting the owner's opinion override the survey.
- Treating ratings as sales. They show perception; check with real behaviour before big spends.
