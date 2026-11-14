# Intake: ask or start

Every brief gets the same readiness check. A specific brief starts at once; a brief with a gap that changes the work gets one short message of questions first. Never ask by habit, and never guess where a wrong guess changes the work.

## The readiness check

Read the brief, `context/` and the brand brain, then check these six. For each, write in the working contract where the answer came from, or "missing".

1. **The ask:** what to make, how many, in what format.
2. **Who it is for** and what they must do after seeing it.
3. **What good looks like** to this owner: the result they want, a priority they named, or a past piece they liked.
4. **Brand context**, when the job needs it: first look in attached files, the project, a claude.ai Project and the AI Blocks account. Then run `node tools/brand-brain.mjs ask --for <kind>` (or `brand-file.mjs ask`). It says whether a brand brain is saved, thin or missing, and gives the exact questions: the brand brain, the material they already have (old ad copy, creative folders or Drive links, email exports, reviews) and access to their numbers. When the tools are not in this pack, ask the questions in `tools/quality/FOUNDATION.md` step 1 as written. Buyer-facing work (ads, copy, emails, pages) with no brand brain and no material is always a gap that changes the work.
5. **Facts only the owner knows** that the work depends on: offer and discount limits, dates, budget, stock, channels, legal limits.
6. **Limits:** length, must-include, never-include.

Then decide:

- **Start** when all six are answered, or the only gaps are ones a top practitioner would fill the same way. Write those as at most three assumption lines and begin.
- **Ask** when any gap would change what you make if you guessed wrong. Typical: two readings of the ask, no idea what good looks like for a plan or campaign, no brand brain for buyer-facing work, a missing offer limit or date.

## How to ask

One message, before any work. Only the gaps, at most five questions, each with choices or a default so one word answers it, and "you decide" always allowed. Say what you already have from the brief, so nothing repeats.

> Before I start, four quick questions (or say "you decide"):
> 1. Do you have a brand brain (a brand file, guide or folder)? a) Yes: attach it or paste a link b) No: send your store URL and I will build one and keep it
> 2. What can I learn your voice and look from: old ad copy, a creative folder or Drive link, email exports? Or say "use public" and I will use your Ad Library, site and Instagram.
> 3. What matters most here? a) more repeat orders this month b) sounds like us c) fewer COD refusals d) other
> 4. Is a discount allowed? If yes, the most you will give.
>
> From your brief I have: Shopify, India, 40% cash on delivery, 3 emails, 120 days since last order.

Write the answers to `context/intake.md` (`node tools/make-rubric.mjs template` gives the shape). The brief's own asks and limits go there too.

## Spec and rubric

Always run `node tools/make-rubric.mjs` before you build. When you asked questions, or you had to assume something that changes the work, show the spec sheet and `context/rubric.md` together in one short message and ask "Go, or change anything?" When the brief already answered everything, do not stop: start, and give the spec and rubric with the finished work.

At hand-over, give the scorecard in your own message, after the work and never inside it, and run `node tools/make-rubric.mjs check <scorecard file>`.

## When nobody can answer

A test, an API call or a person who says they cannot reply: never ask. Still build the brand brain from the material on hand before buyer-facing work (`tools/quality/FOUNDATION.md`); only the questions are skipped. Pick the assumption a top practitioner would pick, record it in the contract, and finish the work: no blanks, placeholders or brackets. Show the reader at most three assumptions, one line each, near the top or next to the item they affect, outside any text meant to be published or sent. Never add a "To confirm" list, open questions or a request for a yes, a sign-off or a choice. Where law or a platform needs a sign-off, write one line next to that item.

When an assumption sets the success measure, choose the one that fits the real decision and say so.
