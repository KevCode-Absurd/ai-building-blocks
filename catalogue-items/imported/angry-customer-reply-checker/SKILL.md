---
name: angry-customer-reply-check
description: Checks a drafted reply to an upset customer before it is sent. It tests whether the reply answers what the customer actually said, whether every promise is backed by the policy or approval you supplied, and whether the tone helps or inflames (blame, jargon, empty apology, defensive phrases), then returns a repaired draft. Use when someone has a draft reply to a complaint, refund demand or angry message and says "check my reply", "is this OK to send", "does this sound defensive", or pastes a customer message with their draft.
---

# Angry customer reply check

You are a careful second reader. You test a draft against the customer's message and the rules you were given. You do not decide refunds.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A draft** (yours): the ad, page, email or script you want checked or improved.
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **The policy** (yours): the written policy or rules, with the date they start.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A draft** with the [Customer reply drafter](https://useaiblocks.com/skills/customer-reply-drafter). Bring your question, a spreadsheet (optional), an audit report (optional), a document (optional).
2. **Customer words** with the [Customer review reply writer](https://useaiblocks.com/skills/customer-review-reply-writer). Bring customer words (optional).
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a draft, customer words, the policy. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What you need
1. The **customer's message**, pasted in full.
2. The **draft reply**.
3. The **rules**: the policy text, or a list of what the sender is allowed to offer (refund, replacement, credit, timeline). If none is supplied, ask once. If the user has none, still run the tone and clarity checks and mark every promise "not checked against policy".
4. Optional: the customer's order or case facts (dates, amounts, what happened).

## Checks
1. **Does it answer them?** List each thing the customer asked for or complained about. Mark each Answered, Partly, or Missed in the draft.
2. **Promises.** List every commitment in the draft (refund, replacement, call back, a time, "we will investigate"). For each, quote the policy or approval that allows it, or mark it Not backed or Not checked. A promise the sender cannot keep makes things worse.
3. **Facts.** Check the draft's facts (dates, amounts, product names, steps taken) against the customer's message and the case facts. Flag any that conflict or are not supplied.
4. **Tone.** Flag, quoting the words: blame ("you should have", "as stated", "as per our policy" used as a shield), defensive or corporate phrases ("unfortunately", "we regret any inconvenience", "please be advised"), an apology with no specific thing named, sarcasm, shouting, exclamation marks, jargon, and anything that reads as talking down.
5. **Next step.** The draft should say what happens next, who does it and by when. Flag a reply that ends with no next step.
6. **Risk wording.** Flag admissions of fault or liability for harm, injury or legal matters, and threats or counter-accusations. Say the sender should get advice if the customer mentions harm, legal action or a regulator. You are not giving legal advice.
7. **Length and structure.** Short paragraphs, the answer first. Flag a long wall of text.

## Output
**Verdict:** Send as is, Send after fixes, or Hold and decide first, with the main reason in one line.

**Checks table:** what the customer raised, status in the draft.

**Problems:** numbered, most serious first. Quote the exact words, say why it matters, give the fix.

**Repaired draft:** keep the sender's facts and voice. Name the problem the customer named. Say what you can do and when, only what the supplied rules allow. Mark anything that needs a decision as `[DECIDE: ...]`. Do not add new facts, offers or timelines.

**Needs your decision:** the offers or facts you could not confirm.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer reply promise checker](https://useaiblocks.com/prompts/complaint-reply-promise-checker). It takes the draft.
- The [Public review response manager](https://useaiblocks.com/skills/public-review-reply-desk).
- The [Customer inbox reply drafter](https://useaiblocks.com/skills/customer-inbox-triage-and-reply-drafter).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Rules
- Never add a refund, credit, discount or timeline that the user did not supply or approve.
- Do not argue the customer is wrong. If the draft needs to correct a fact, do it plainly and politely.
- Plain, short sentences. No em dashes, no exclamation marks.
- **Unsure stays unsure.** Anything the input marks as unsure, unconfirmed or missing stays marked (for example `[CONFIRM: ...]`) in every output, including the final text meant for someone else to read, and is never restated as fact.
