---
name: policy-redraft
description: Produce a proposed marked-up policy redraft that closes a policy gap the user describes. A first draft for internal review — not for direct application to approved policy documents. Use when the user says "redraft the policy", "draft the policy fix" or "mark up the policy".
argument-hint: "[GAP-ID or gap description]"
---

# /policy-redraft

**Working outside the original plugin.** This copy needs only three pasted inputs: (1) a description of the gap, (2) the current approved policy text, (3) the text of the rule. Ignore any mention below of `/regulatory-legal:` commands, plugin config files (CLAUDE.md), a gap tracker (gap-tracker.yaml), matter workspaces or other skills. They are not included, and you must not look for them, load them or claim to have updated them. Treat the policy library and practice profile as empty and say so in the reviewer note. If you cannot write files, show the redraft memo in the chat instead of saving a dated file. Never claim you saved a file or updated a tracker you cannot reach.

1. Ask for the three inputs above if any is missing.
2. Verify the rule is current. If you can't verify, emit the `⚠️ RULE STATUS UNVERIFIED` banner.
3. Produce a marked-up redraft of the affected policy section(s): smallest-possible edit, `[verify]` tags carried through, inline comments explaining WHY each change was made.
4. Output a Policy Redraft Memo. Write it to a new file named `[policy-name]-proposed-redraft-[YYYY-MM-DD].md` (or show it in the chat). Never write to the source policy document.
5. This skill does not close the gap. It closes when the policy owner applies and approves the redraft.

---

> This skill produces a **proposal**, not an edit. It writes to a new file with a clearly-marked draft filename. It never writes over a source policy document, and it never marks a gap closed — the gap closes when the redraft is applied AND approved by the policy owner.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.
- **The policy** (yours): the written policy or rules, with the date they start.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **An audit report** with the [Privacy policy drift checker](https://useaiblocks.com/skills/privacy-policy-drift-checker). Bring your question, the policy (optional), an audit report (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for an audit report, the policy. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose

This skill takes the next step (the gap and what needs to change are described by the user) and produces a marked-up redraft of the affected policy section — small, specific, flagged — as a first draft for the policy owner's review.

## Hard guardrails — read these first

These are the load-bearing rules. If any of them would be violated, stop and ask.

1. **This is a PROPOSAL, not an edit.** Never write directly to a source policy document. The output goes to a new file at `[policy-name]-proposed-redraft-[YYYY-MM-DD].md`, not `[policy-name].md`.
2. **Never mark the gap closed.** Gaps close when the redraft is APPLIED AND APPROVED — that is the policy owner's action, not yours. If the user says "close the gap now that you've redrafted it," decline: "I produce the proposal. The gap closes when you've reviewed, applied, and approved the change."
3. **"Apply this for me" is not in scope.** If the user asks you to apply the redraft to the source policy: "I don't apply policy changes — that's the policy owner's action after review and approval. I produce the proposal."
4. **Confirm the policy version before redrafting.** If the user gives you a file, ask: "Is this the approved version of the policy, and is it the latest? A redraft against an outdated policy creates divergence." If they paste text, trust but flag in the reviewer note.
5. **Smallest-possible edit.** Strike a word before a sentence, a sentence before a paragraph, a paragraph before a section. Only touch sections affected by the gap. Don't restyle the policy.
6. **Carry `[verify]` tags through.** Any effective date, threshold, citation, or requirement that came from model knowledge or an unverified source gets tagged in the redraft itself, not just in the memo.

## Step 1: Gather inputs

Three inputs are required. If any is missing, ask — don't infer.

### 1a. The gap

One of:
- A gap described in the user's message — capture the requirement, the regulation, and the affected policy.
- A summary of what needs to change that the user pastes in.

### 1b. The current policy text

One of:
- A file path — read it, then ask: "Is this the approved version of the policy, and is it the latest? A redraft against an outdated policy creates divergence." Note the answer in the reviewer note.
- Pasted text — trust but flag in the reviewer note: "Policy text was pasted directly; I assumed it was the current approved version. Confirm before applying."
- Neither — ask for one. Do not guess at the policy text from web search.

### 1c. The rule text

One of:
- A fetched regulation — note the source with a provenance tag.
- Pasted rule text from the user — tag `[user provided]`.

If the rule text is partial or ambiguous, do not fill the gap yourself: offer the user the options (paste full text, point at primary source, web-search-with-verify-tag, or stop), and wait.

## Step 2: Verify the rule is current

Check whether the rule is still in force. Red flags that the rule may not be in force:

- The applicability/compliance date has passed by more than 30 days with no confirmation it wasn't delayed.
- The rule is more than 12 months old.
- The rule is a politically contentious final rule (major rulemakings are frequently challenged).

When you see a red flag, check (via research MCP, web search if enabled, or the Federal Register docket) for: delays, stays, injunctions, rescission proposals, vacatur, or amendments. If you can verify the rule is in force, proceed. If you cannot verify:

> `⚠️ RULE STATUS UNVERIFIED — I could not confirm this rule is currently in force. Final rules are frequently stayed, enjoined, delayed, or rescinded after publication. Do not apply this redraft until you confirm the rule's status at the Federal Register docket or with outside counsel.`

Emit that banner above the work-product header. Tag every effective/compliance date in the redraft as `[effective date per published rule — status unverified]`.

## Step 3: Produce the redraft

A marked-up version of the affected policy section.

### Redline granularity — smallest possible edit

- Strike a word before a sentence.
- Strike a sentence before a paragraph.
- Strike a paragraph before a section.
- Only touch sections affected by the gap. Don't restyle the whole policy.

### Conventions

- Struck text: `~~struck text~~`
- Inserted text: **inserted text**
- Each change carries an inline comment explaining WHY — the rule, the cite, the gap being closed:

  > `[Change: added biometric identifiers to the PII definition per COPPA 2025 amendments, 16 CFR 312.2 (effective Apr 22 2026) [verify]]`

- Any effective date, threshold, citation, or requirement that came from model knowledge or an unverified source gets a `[verify]` tag inline — not just in the change summary.
- Carry source tags through from the diff: `[Federal Register]`, `[web search — verify]`, `[model knowledge — verify]`, `[user provided]`. Don't strip them when moving from the diff to the redraft.

### Scope discipline

If a section of the policy isn't affected by the gap, leave it alone. A redraft that touches sections outside the gap looks like the AI opined on things it wasn't asked to opine on, and makes the review harder.

If you see a second gap while redrafting — a provision that's clearly out of step with the rule but wasn't in the original gap — don't silently fix it. Flag it in the reviewer note: "While redrafting for [GAP-ID], I noticed [other provision] appears to have a related issue with [requirement]. Not included in this redraft. Consider a follow-on gap."

## Step 4: Output — Policy Redraft Memo

```markdown
[WORK-PRODUCT HEADER — "Draft for review by the policy owner. Not legal advice."]

> **⚠️ Reviewer note**
> - **Sources:** [Research connector: CourtListener ✓ verified | not connected — cites from training knowledge, verify before relying]
> - **Read:** [sections of the policy reviewed; what wasn't read]
> - **Flagged for your judgment:** [N items marked `[review]` inline | none]
> - **Currency:** [rule status verified against [source], [date] | unverified — see banner above]
> - **Before relying:** confirm this is the current approved version of the policy; verify rule status and effective date; get the policy owner's review; follow your policy-change approval process; record the change in your own tracker only when applied and approved.

## Policy Redraft: [Policy name]

**Gap:** [GAP-ID or short description]
**Regulation:** [name, citation, effective date]
**Policy:** [name, last-updated date]
**Status:** PROPOSAL — not yet reviewed or approved

### Bottom line

[One sentence: what the gap is. One sentence: what the redraft does. One sentence: what needs review.]

### Marked-up policy section(s)

[The redlined text, with inline `[Change: ...]` comments. Only the affected sections.]

### Change summary

| # | Provision | Current | Proposed | Why | Verify |
|---|---|---|---|---|---|
| 1 | §2.1 PII definition | "…names, addresses, SSNs…" | "…names, addresses, SSNs, biometric identifiers…" | COPPA 2025 amendments expand PII to cover biometrics | [Federal Register] |
| 2 | §4.3 Retention period | "30 days" | "14 days" | New rule imposes 14-day cap | `[verify — model knowledge]` |

### Before applying — checklist

- [ ] Confirm this is the current approved version of the policy being redrafted.
- [ ] Verify the rule status and effective date (Federal Register docket, or outside counsel).
- [ ] Get the policy owner's review.
- [ ] Follow your policy-change approval process.
- [ ] Record the change in your own gap list only when it is applied and approved — not before.

---

**What next? Pick one and I'll help you build it out:**

1. **Apply and get sign-off** — you review, circulate to the policy owner and walk it through your approval process. The policy owner applies the change. Record it in your own gap list once approved.
2. **Get more info on [X]** — if a specific change needs more grounding (a cite verified, a threshold checked, a jurisdiction question resolved), tell me which one and I'll dig in.
3. **Escalate to [owner / GC]** — if the redraft raises something above the policy-owner's authority, I'll draft a short escalation with the facts, the proposed change, and what decision is needed.
4. **Watch and wait** — if the rule's status is uncertain or the policy owner is unavailable, set a date to revisit it.
5. **Something else** — tell me what you'd do with it.
```

## Filename

The output file name makes clear it's a draft. Use:

`[policy-name]-proposed-redraft-[YYYY-MM-DD].md`

Not `[policy-name].md`. Not `[policy-name]-v2.md`. The word "proposed-redraft" and the date are load-bearing — they prevent the draft from being mistaken for the current version.

Write to the current working directory or a location the user names. Do not write to the policy library source directory.

## If a fact is missing

- **Policy owner not given:** still produce the redraft. Note in the reviewer note that no owner was named, so the approval path is unclear.
- **Policy text not given and the gap does not name a specific policy:** stop and ask: "I need the current policy text to redraft. Paste the text of the affected policy."

## Close with the next-steps decision tree

Included in the output template above. Customize the options to what the redraft actually produced — if the rule status is unverified, option 2 (get more info) moves up; if the policy owner isn't set, option 3 (escalate) gets specific.

## What this skill does not do

- Apply the redraft to the source policy. That's the policy owner's action.
- Mark the gap closed. Gaps close when the redraft is applied and approved.
- Rewrite the whole policy. Smallest-possible edit to close the gap.
- Produce multi-policy redrafts. One gap, one policy, one memo. A `:package` command for multi-policy fan-out is a future skill.
- Produce the "apply" workflow. An `:apply` command with an approval gate is a future skill.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Company policy explainer](https://useaiblocks.com/skills/company-policy-explainer). It takes the policy.
- The [GDPR privacy checker](https://useaiblocks.com/skills/gdpr-privacy-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
