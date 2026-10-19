---
name: video-ad-script-line-checker
description: Use when you want a video ad script checked line by line before filming, or a guide while writing one. Applies 12 groups of checks (truth, fit, delivery, then one group per beat from opening to call to action) and returns each weak line with the check it breaks, a fix from the business's own facts, and a score out of 100 before and after the fixes.
---

# Video ad script line checker

A set of checks for video ad scripts that sell, for any product. They describe; they don't dictate. Load only the groups the task needs.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
This skill runs on its own. What's below makes the result better, but none of it is required.

**Makes it better (optional):**
- **A video ad script**, made by the [Video ad script writer from customer quotes](https://useaiblocks.com/skills/video-ad-script-writer-from-customer-quotes): the script, beat by beat, with on-screen text.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A video ad script** with the [Video ad script writer from customer quotes](https://useaiblocks.com/skills/video-ad-script-writer-from-customer-quotes). Bring customer words. It uses your brand brain and your offer and buying reasons.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In Claude Code, look in the project too for these by name.
2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with a video ad script. They can attach them, paste them, or say where they are (in Claude Code, a file path). Name the recommended steps above as a suggestion, with their links. Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.
3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` and never invent a fact to fill it. List the gaps at the end so they can fill them in later.

**Tools that do this best:**
- **Any good chat AI:** Claude, ChatGPT and Gemini all follow this skill well, so use the one you already have.
<!-- /needs -->

## What you need
- **Script** (required): the script you're judging or writing, one line per row if possible.
- **Business facts** (optional): product facts, allowed claims, brand voice. Without them, fixes that need a fact are marked MISSING.
- **Groups wanted** (optional): default is the groups the task needs (table below).
- **Reordered or kept** (optional): used up and bought again, or bought once and owned. Several checks differ.
- **Length and speaker** (optional): for the pace check.

## Steps
1. Read `references/principles.md` for the groups you need.
2. Label each line of the script with its beat. Note any beat that's missing.
3. Run the checks. Treat each as a test, not a template. The business's own voice, facts and limits win wherever they differ.
4. For each weak line, quote it, cite the check code, say what's wrong in one line, and give a fix that uses only the facts you were given.
5. Count spoken words and compare them with the budget for the length.
6. Rank the problems: Truth first (they can get the ad rejected or mislead), then the opening, then the rest in beat order.
7. **Score it.** Start at 100. Take off 15 for each Truth problem, 5 for each other weak line, 5 for each missing beat, and 5 if the spoken words run over budget. Stop at 0. Then score it again as if every fix were made; a fix marked MISSING still counts against it. Show both sums, so anyone can check them. Used as a guide, score the finished script the same way.

| Task | Groups |
|---|---|
| Full review before filming | all 12 |
| Writing from research | Fit, then the nine beats |
| Borrowing a reference ad's shape | Truth, Fit, Problem, Promise, How it works, Proof, Offer |
| Picking a length or format | Delivery, Offer, Call to action |
| Polishing for speech | Delivery |

## What you hand back
Used to judge: one block per weak line (`line | check | what's wrong | fix`), then missing beats, the word count against budget, a list of MISSING facts, and the score now and after the fixes, each with its sum. Used as a guide: no separate review; the script follows the checks, and the score comes at the end.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Plan what to test** with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Check before you hand it back
- Every check you cite exists in the reference, and the reason matches it.
- Every quoted line is really in the script.
- No example from the reference appears as a fact.
- Every fix rests on a fact you were given.
- The score's sum matches the problems found, line for line.

## If something is missing
Reordered or kept not given: write `MISSING: reordered or kept`, apply both versions of the checks that differ, and name the difference. A fix that needs a fact you don't have: write `MISSING: <fact>` instead of filling it in.

## Avoid
- Using the reference's examples as copy. They're made up.
- Flagging style choices the brand's voice allows.
