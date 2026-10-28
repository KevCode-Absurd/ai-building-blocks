---
name: linkedin-profile
description: Use when someone wants their LinkedIn profile audited or rewritten — headline, About section, experience bullets, Featured, banner, recommendations — or says "fix my headline", "my profile gets views but nothing happens", "optimize my LinkedIn profile", "what should my About section say". Scores the headline on five dimensions, audits the whole profile 0-100 and ranks fixes by points per hour, and assembles an About section that survives the "…see more" fold.
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: marketing
  updated: 2026-08-25
---

# LinkedIn Profile — audit, then rewrite the parts that pay

A profile is not a CV. A CV is read by someone who already decided to consider you; a
profile is read by someone deciding whether to. Three readers, in descending volume: the
**scanner** (three seconds, from your comment on someone else's post — sees photo and
headline only), the **evaluator** (forty seconds — headline, half the About, Featured), the
**decider** (minutes — everything). Almost all traffic is the scanner. Almost all conversion
is the decider.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a buyer brief. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

**1. Audit before rewriting.** Ask them to describe their profile section by section, or
have them fill [`assets/profile_worksheet.md`](assets/profile_worksheet.md), then:

```bash
python3 scripts/profile_completeness_auditor.py --input profile.json --output human
```

Exit 0 STRONG / 2 INCOMPLETE / 3 WEAK. It ranks every gap by **points per hour** and prints
a first-hour plan — usually Featured, Open To, and skills, which cost minutes and recover
real points. Start there, not with the About section they wanted to agonise over.

**2. Headline next — it is the only string that travels.** It rides along with every comment,
search result, and invitation.

```bash
python3 scripts/headline_scorer.py --headline "..." --output human
```

Five dimensions at 20 points: audience, outcome, proof, searchability, clarity. Exit 0 SHIP
(≥75) / 2 SHARPEN / 3 REWRITE. It also checks the 220-character cap and whether the first
~60 characters — the part that survives in search results and invitation previews — carry
anything.

Iterate here. Two or three passes is normal; the stop condition is exit 0, or the user
saying they would say it out loud to a peer.

**3. About section — write to the fold.** LinkedIn collapses it after roughly 265-300
characters. Collect the five parts from the user, then assemble:

```bash
python3 scripts/about_section_builder.py --input about.json --output human
```

It refuses a fold that cuts mid-sentence, a fold carrying no audience and no proof, a
missing call to action, and anything over 2,600 characters.

**4. Experience, Featured, recommendations.** Rewrite duty lists as outcomes. Pin one
artifact a stranger could evaluate in sixty seconds. Ask for two specific recommendations by
naming the project and offering a first draft.

## Rules

- **Never invent a credential, a metric, or a role.** Every number on a profile is checkable
  by someone. If the proof does not exist, the claim is qualitative or it is absent.
- **First person.** A profile in third person reads as a press release someone else wrote.
- **The fold is the section.** Whatever sits above "…see more" is what most readers get.
- **Front-load the headline.** The strongest segment first; everything after is a bonus.
- **Do not fetch anything.** The user describes their own profile; nothing is scraped.

## Scripts

| Script | Role |
|---|---|
| [`scripts/headline_scorer.py`](scripts/headline_scorer.py) | Headline 0-100 on audience / outcome / proof / searchability / clarity, plus the 220-char cap and front-load check. |
| [`scripts/profile_completeness_auditor.py`](scripts/profile_completeness_auditor.py) | Whole profile 0-100 across 14 weighted checks; fixes ranked by points per hour with a first-hour plan. |
| [`scripts/about_section_builder.py`](scripts/about_section_builder.py) | Assembles the About section from named parts and refuses a broken fold, a missing CTA, or an over-length section. |

## References and assets

- [`references/profile_architecture.md`](references/profile_architecture.md) — what each section is for, and the three readers (7 sources)
- [`references/headline_and_positioning.md`](references/headline_and_positioning.md) — the 220 characters that follow you everywhere (7 sources)

- [`assets/profile_worksheet.md`](assets/profile_worksheet.md) — fillable section-by-section worksheet
- [`assets/example_profile.json`](assets/example_profile.json) — input shape for the auditor

## If you cannot run the scripts

AI Blocks note: the scripts above need an AI that can run Python. If yours cannot, do the same checks by hand in chat. Score the headline on the five dimensions, work through the profile checklist in the same order, and count the characters before the "…see more" fold yourself. Say in your reply that you scored by hand, not by script.

## Distinct from

- **`linkedin-strategy`** — what to post and how often. This is who you are before you post.
  If the audience answer is fuzzy, run `positioning_brief.py` there first; the headline
  falls out of a good brief in ten minutes.
- **`product-team/`, `c-level-advisor/`** — career and role strategy. This writes the profile,
  not the career plan.

---

**Version:** 1.0.0

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Low-performing post reviewer](https://useaiblocks.com/skills/flop-post-diagnoser). It takes the draft and audit report.
- The [Social post performance reviewer](https://useaiblocks.com/prompts/post-flop-reason-finder). It takes the draft.
- The [Voice-matched post writer](https://useaiblocks.com/skills/voice-matched-post-writer). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
