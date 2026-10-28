---
name: untapped-avatar-finder
description: Use when you sell a crowded product and rivals already own the obvious buyer. It maps who rivals sell to, finds three or four buyer groups nobody serves from Amazon review stories, checks how big each is on Reddit, picks one, and sharpens it into layers to test.
---

# Untapped avatar finder

You help a store owner find a buyer group that a crowded product is not yet sold to, with evidence. You map who rivals talk to, find other groups in real review stories, check each group's size in public forums, rank them, and pick one. A hunch is not evidence: one story is not a market.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Competitors** (yours): the brands buyers compare you with.
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, competitors, customer words. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Meta Ad Library:** Shows what rivals say and who they seem to talk to, free and public.
- **Amazon reviews:** Long life stories from buyers show other groups who already buy the product.
- **Reddit search:** Shows how many people discuss the same problem, which is your size check.
- **Any good chat AI:** Compares the groups and ranks them against your notes.
<!-- /needs -->

## What you need
- **Product name and the problem it solves** (required).
- **Three to five rivals** (strongly advised): names or Meta Ad Library links for the brands that are winning.
- **Amazon links** (strongly advised) for the top-reviewed product, or a similar one.
- **Customer data** (optional): who buys from you now, and their order values.
- No brand files are needed. For the next skills below, bring only the chosen group and its evidence.
- Cost: the Meta Ad Library, Amazon reviews and Reddit search are free. Traffic tools (step 2) and deep research (step 14) are optional and may need a paid plan or account.
- The person pastes what they find (ad notes, review stories, forum threads). Use only what is pasted. If your AI can open pages, say so, and still show the source for each claim.

Does not fit: a product that is already unusual, in a new category, or one with no rivals to learn from. Skip it if the product cannot truly help the new group. Do not stretch claims to fit a group. The rule behind this skill: if the product is not truly different, change who you sell to, not what you claim. A new mechanism needs a physically different product, which is rare for products bought from suppliers.

Privacy: public posts and reviews only. Label each candidate with a tag or first name only. Never keep reviewer names, profile links or photos. Do not contact anyone.

## Steps
1. **Name the problem the product solves** in one line. Everything below follows it.
2. **Map the rivals' buyers.** In the Meta Ad Library, search the product. For each winning brand, write down the age range, gender, desires and selling points shown in the ads. In video ads, note who appears on screen and what they say. A traffic tool can show how big the rival is (visits, average order value). Most such tools are paid (they need an account and a plan) and are optional. The rival map still works from the Meta Ad Library and public signals alone. Repeat for as many successful rivals as you can. The group most of them share is the one to avoid.
3. **Open the Amazon reviews** of the top-reviewed product or a similar one. Sort by top reviews and, if you can, filter to reviews with photos or video. People who add pictures tend to write long stories.
4. **Look for long life stories.** The best reviews say who the writer is and what they went through. Each different story is a candidate group. The sources' examples: new mothers after surgery, men over 65. Short reviews rarely help.
5. **Tag each candidate** with a tag or a first name only, for example "Candidate 1, new mother".
6. **Check the size on Reddit.** Search the situation plus the word Reddit, for example "post C-section weight gain Reddit". Many threads about the same problem mean many people. A single thread means you may have found one person.
7. **Write each candidate's picture from the threads.** The beliefs they hold (for example "only surgery flattens it"), the fixes they tried, and how they feel. Quote the words, with no names.
8. **Choose one.** Pick the group with strong evidence, many threads, a clear wish for what your product does, and no brand talking to them yet. Check the last point in the Ad Library: if nobody is advertising to them, that is the opening. If you cannot show all four, say what is missing.
9. **Carve a layer.** Do not take a slice of the whole market. Take a small group inside it and aim to own all of it. Add layers one at a time. A fat burner for everyone, then for women, then for women over 40: each layer makes the message sharper. The source's examples of this: supplements for women at one life stage, a thinking supplement for entrepreneurs, a pillowcase for people with acne. Layers built around a health condition or a body goal are the riskiest. Never write a claim that the product treats, cures or fixes a health problem, or that it earns a person money. Mark any such layer "claims need a qualified-person check" and use only what the product's maker can back up.
10. **Rank the layers** by three things: how strong the pain is, whether they can pay, and whether the group is still large enough. People tend to underestimate how big a group is, so do not cut a layer on a feeling. A source's example showed that a narrower group can have a more painful, higher-value problem. That is one marketer's illustration, not a rule. Treat any price or pain guess here as something to test.
11. **Run the contrast check.** Look at the top rivals' ads and ask what the polar opposite would be. Does the chosen layer stand apart from them in who it talks to and how?
12. **Write a one-sentence offer line** for the top pick: who it is for, what they get, what makes it different for them.
13. **Plan the test.** Test the top two or three layers with separate ad angles, not separate products. An ad test is what confirms the pain and buying power guesses. A small segment inside a proven market is safer than a brand-new category, because the demand is already shown.
14. **Optional deep research (may be a paid feature).** Only after you have a pick, you may run a deep-research prompt on that one group and read every source it cites. It can be slow and the report long. Treat its findings as ideas to check, not facts.

## What you hand back
Use these labels in this order:

```
RIVAL BUYERS
Brand | age range | gender | desires | selling points | source (ad link or note)
<one row per rival>
Shared group to avoid: <...>

CANDIDATES  (3 to 4)
<tag> | story in one line | quote | belief | tried | feeling | where found
SIZE CHECK
<tag> | search used | threads found (few / some / many) | note

PICK
<tag> because: <evidence> | <threads> | <wish for the product> | <nobody speaking to them yet, checked in Ad Library: yes/no>
Not picked: <tag, why>

LAYERS (ranked)
1. <layer> | pain: <strong/medium/weak> | can pay: <yes/maybe/no> | size: <large/medium/small> | evidence: <...>
OFFER LINE (top pick): <one sentence>
CONTRAST: <what is the opposite of rivals, and does this layer stand apart>
TEST PLAN: <angle per layer, what result decides>
CLAIMS NOTE: <what the product may not claim for this group>
CHECKS MISSED: <none | list>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Forum buyer researcher](https://useaiblocks.com/skills/forum-and-review-avatar-digger). It takes the buyer profile.
- The [Buyer profile reviewer](https://useaiblocks.com/skills/avatar-fit-checker). It takes the buyer profile.
- The [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). It takes the buyer profile.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Checks
Run these before handing back. Fix any that fail, or list them under `CHECKS MISSED:`.
- Each rival row has a source. Any age, gender or desire taken from a guess is marked `[guess]`.
- Each candidate has a real quote, a belief and a tried fix. No names, links or photos.
- The size check shows what was searched and what was found, not just "big market".
- The pick meets all four tests or says which one it lacks.
- The test plan changes the angle, not the product.
- No claim for the new group goes beyond what the product really does. Health, money and legal claims carry a line telling the owner to check with a qualified person.

## If something is missing
- No rivals given: `MISSING: rival brands or Ad Library links`. Ask for three, or say the rival map cannot be done.
- No review stories pasted: `MISSING: Amazon review stories`. Give the steps and stop at that point; never write a story.
- No Reddit threads: `MISSING: forum threads for the size check`, and the candidate stays `[unsized]`.
- No ads seen for a group: say "not checked", not "nobody is advertising".

## Avoid
- Choosing a group from a single story, or because it sounds clever.
- Stretching the product's claims to suit a sad or hopeful story.
- Treating any rule of thumb or example here as a measured figure.
- Starting a deep-research run before the pick. It is slow and it repeats what you tell it.
- Splitting into groups so small that you cannot reach enough people.
