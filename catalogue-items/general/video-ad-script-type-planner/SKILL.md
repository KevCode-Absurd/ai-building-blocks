---
name: video-ad-script-type-planner
description: Use when you want several truly different video ad scripts from the same research. Picks script types from 14 in four groups (talk, show, story, teach) that fit how much the buyer knows and what you can prove, spreads the batch so each ad holds attention and sells a different way, and sets each script's starting and ending tone. Scores the batch out of 100 against its own checks.
---

# Video ad script type planner

Write four scripts from one round of research with one recipe and you get one ad four times. A script type is a different shape for the same truth: a different thing for the viewer to watch, a different beat doing the selling, a different way in. Types from different groups look like different ads to viewers and to the ad platform.

This skill picks types and gives each one's recipe. Pair it with a script-writing skill. The type sets the opening, beat order, person and tense, and the selling beat. The rules on facts never change.

Every type uses the same nine beats (opening, problem, promise, how it works, doubt, proof, offer, guarantee, call to action), in the order taught in Blue Sense Digital's public masterclass "How To Write Meta Ads That Scale", and says where it changes that order.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Check for these first. The result is much better with them.

**Needed:**
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**The steps before this one** (do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
2. This one.

How to check:
- **In Claude Code,** look in the project first for these by name, or ask for their path.
- **In a chat,** ask once: "Do you have a buyer brief, customer words? Attach or paste them here." If they're already in this project's files, use those.
- **If one is missing,** say so before you start, in one line: the result will be much better with it, with the link to make it once and reuse it. Next time they can attach it (or, in Claude Code, give its path). Then carry on with what you have and mark each gap with `MISSING:`.

**Tools that do this best:**
- **Any good chat AI:** Claude, ChatGPT and Gemini all follow this skill well, so use the one you already have.
- **Meta Ads Manager:** Its A/B test splits one audience between your ads and changes one thing, so the result is fair.
<!-- /needs -->

## What you need
- **Concept** (required): the buyer, the reason they buy, the offer.
- **Awareness and length** (required): how much the buyer knows (unaware of the problem, aware of it, aware of fixes, aware of you, ready to buy), and the length.
- **What you can supply** (required): points from the buyer's timeline (Before, Trigger, Tries, Last doubt, After), a true cause, process facts, a real customer account, something you can film working, time points, offer terms, a real shortcoming.
- **How many scripts** (optional): default 4.

## Steps
1. **Shortlist.** Skip any type whose needs aren't met; never fake a need. Skip types that don't suit the buyer's awareness, and types too long for the ad (stories need about 45 seconds or more; a time-lapse needs 60 or more).

| Group | Type | Selling beat | Opens on | Suits buyers | Needs |
|---|---|---|---|---|---|
| Talk | Straight case | strongest beat | Before, said to "you" | aware of the problem or of fixes | a Before point |
| | Doubt first | doubt | the Last doubt, granted | aware of fixes or of you | a Last doubt |
| | Flaw first | doubt | a real shortcoming | aware of you or of fixes | a real shortcoming |
| | Offer up front | offer | the terms | aware of you, or ready | terms worth leading with |
| Show | Show it working | proof | the demo, mid-action | aware of fixes or of you | a result you can film |
| | Day in use | proof | a moment of an ordinary day | aware of fixes or of you | when and how it's used |
| | Line-up | proof | the options and the tests | aware of fixes | a real test or checkable facts |
| | Making of | how it works | a decision in making it | aware of fixes or of you | a real process fact |
| Story | Mirror | problem | a scene from their life | unaware of the problem | a habit from before they knew why |
| | Turning point | problem | the Trigger day | unaware, or aware of the problem | a real Trigger with stakes |
| | Tries in a row | how it works | the first try | aware of the problem or of fixes | two Tries |
| | Someone noticed | proof | another person noticing | aware of the problem | a real customer account |
| Teach | The real cause | how it works | what most people don't know | aware of the problem or of fixes | one true cause |
| | Time-lapse | how it works | the first point in time | aware of the problem or of fixes | time points you can back |

2. **Spread the batch.** Take one type from each group where the needs allow. Use at least three different selling beats in a batch of four. No two scripts may open on the same timeline point or the same fact. If a group has no type that qualifies, take a second type from another group with a different selling beat, and say why.
3. **Load each type's recipe** from `references/types.md` and write the script with the paired writing skill.
4. **Set the tone.** Each script gets a starting tone (opening and problem) and an ending tone (offer and call to action). The turn happens at the promise and how it works, which stay plain and clear.

| Starting tones | Ending tones |
|---|---|
| fed up, worried, curious, amused, matter of fact | relieved, confident, pleased, proud, matter of fact |

Rules: the starting tone must match something research shows customers feel, and it only works on a true fact (worry with nothing at stake is made-up urgency). Stay with what people do about the problem, never with how bad they are (no pity, no shame, no claim the viewer has a condition). The brand's voice wins: if it rules out worry, take the nearest allowed tone and say so. Words carry the tone, not adjectives; the pictures follow it. The doubt beat is respectful; proof, offer and guarantee are steady and exact.

5. **Score it.** Run the checks in "Check before you hand it back" and fix any that fail. Then score the batch: checks passed divided by checks, times 100, rounded (4 of 5 passed is 80). Show the score, the sum, and one line for each check still missed.

## What you hand back
```
Batch: <n> scripts
1. <type> (<group>) | selling beat: <beat> | opens on: <point or fact> | tone: <start> -> <end> | needs met: <fact and source>
...
Spread: groups used, selling beats used, no shared openings
Skipped types and why
```
Then the scripts, if a writing skill is paired. Last, the score out of 100, with the sum and one line for each check still missed.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, ask in one short question what they want to do next. Offer these, and say they can type their own:
- **Set up AI to work for you** with the [AI step handoff planner](https://useaiblocks.com/skills/ai-step-handoff-planner). It takes the plan.
- **Write the ad copy** with the [Story image ad writer](https://useaiblocks.com/skills/story-image-ad-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Check before you hand it back
- Each script would be called a different ad from its neighbours.
- Each type's needs are met by facts that were supplied, named with their source.
- At least three selling beats and, where possible, all four groups.
- No two scripts open on the same point or fact.
- No example from the recipes appears in a script.

## If something is missing
Write `MISSING: <need>` and skip the type. A "Someone noticed" or "Turning point" type without a real account turns into filming notes for a real customer, with blanks for their details.

## Avoid
- Faking a process fact, shortcoming, test or customer story to fit a type.
- Picking types because they sound fresh rather than because they fit.
