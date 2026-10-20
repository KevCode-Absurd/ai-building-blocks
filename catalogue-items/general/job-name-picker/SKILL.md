---
name: job-name-picker
description: Use when you are naming a product, range or service and want the name to say the job it does. Writes the job in the customer's words, drafts names in four routes, tests each with a stranger test, a stretch test and a lookalike test, ranks the top three and writes a hire-it-when line and a not-for line. Ends with any checks it missed.
---

# Job name picker

A name that tells people what job to hire it for does work that advertising otherwise has to do. It comes to mind when the need shows up, and it tells the wrong buyer to look elsewhere. This skill takes a job spec and writes names that carry the job, then tests them. It does not check trademarks or domain names, which you must do yourself.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
This skill runs on its own. What's below makes the result better, but none of it is required.

**Works best with** (or they can paste their own instead):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand brain** (its products part), made by the [Website brand brain builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **Plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Website brand brain builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
3. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In Claude Code, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with a buyer brief, your brand brain, plan. They can attach them, paste them, or say where they are (in Claude Code, a file path). Name the recommended steps above as a suggestion, with their links. Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.
3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once, merge steps that give the same thing, and aim for under 700 words unless the job truly needs more. In CHECKS MISSED, name only the checks that failed, or write “none”.

**Tools that do this best:**
- **Any good chat AI:** Drafting names and scoring them against fixed tests is text work any strong chat AI does with this skill.
- **A trademark search tool:** This skill cannot check if a name is free to use, so you need to do it before you commit.
<!-- /needs -->

## What you need

- **A job spec** (required): the circumstance, the progress and the struggle. "Job spec writer" makes one.
- **Your product** (optional): what it is and what it does, and any names you have in mind.
- **The experience plan** (optional): from "Job experience mapper".

## Steps

1. **Write the job in the customer's words.** In eight words or fewer, no brand terms, as they might say it to a friend. If the spec has several jobs, choose one. One name serves one job. Say which job each other product or variant needs its own name for.
2. **Draft ten names in four routes.** (1) Action and object, such as a verb plus the thing. (2) The moment or place, such as the time of day or the room. (3) A plain label of the result. (4) A coined word that sounds like the action. Write at most three names for the coined route, since coined words cost more to explain. Write a few words on what each name says about the job.
3. **Run the stranger test.** For each name, imagine someone who has never heard of you reading it alone, with no logo or picture. Write what they would guess it is for. Score 2 if the guess matches the job, 1 if close, 0 if not. Drop any name scoring 0.
4. **Run the stretch test.** Does the name suggest jobs you do not do, or limit you to a form of the product you may change? Score 2 if it does neither, 1 if one risk, 0 if both. A name that promises the wrong job brings the wrong buyer, and a poor review.
5. **Run the lookalike test.** Does it read like a category placeholder, such as "premium" or "pro" plus a common noun? Does it sound like a rival's name? Score 2 for a clear difference, 1 for some overlap, 0 for a clone. You cannot check trademarks or domain names here, so write `MISSING: trademark and domain check` and tell the owner to run one.
6. **Run the maker test.** Would the name work if the company name were removed? A job name must carry the job on its own. If it needs the company name to make sense, drop it.
7. **Rank the top three.** Add the scores. Break ties with the stranger test. Show the sums. Name any winner that scores 0 on a test and say what to fix.
8. **Write the lines that go with the name.** For each top name write a hire-it-when line in the form "Hire it when ..." using the circumstance, and a not-for line that tells the wrong buyer to look elsewhere, from the job spec. Keep both under fifteen words.
9. **Guard against blur.** List the features, variants or extensions that would pull the name away from the job. Write a rule for the team: add a variant only if it serves the same job in the same circumstance, otherwise give it its own name.
10. Check it. Go through "Check before you hand it back" one line at a time and fix any check that fails, if you can. Under CHECKS MISSED, write one line for each check still missed and why, or "none".

## What you hand back

The job in eight words or fewer. Ten names with what each says. A scores table for the stranger, stretch, lookalike and maker tests. The top three with sums. A hire-it-when line and a not-for line for each. The blur rule. `MISSING:` lines, including the trademark and domain check. Last, CHECKS MISSED: one line per check missed, or "none".

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Decide what to do** with the [Findings and guesses separator](https://useaiblocks.com/skills/findings-and-guesses-separator). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Check before you hand it back

- The job line has eight words or fewer and uses the customer's words.
- There are ten names across the four routes, no more than three coined.
- Every name has all four test scores, and the sums are shown.
- No top name scored 0 on the stranger test.
- Each top name has a hire-it-when line and a not-for line.
- The trademark and domain check is marked as not done.

## If something is missing

Write `MISSING: <what> for <step>`. Do not claim a name is free to use. Do not invent search volume or market data.

## Avoid

- Naming after the maker, a founder or a technology.
- Using a category word with "premium" or "pro" in front.
- Stuffing one name with several jobs.
- Picking by how clever it sounds to the team.
