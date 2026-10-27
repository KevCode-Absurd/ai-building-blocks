---
name: marketing-claims-review
description: >
  Review marketing copy for claims that need substantiation, reframing, or cutting.
  Use when the user says "review this marketing copy", "check these claims",
  "can we say this", "is this puffery or a problem", or pastes marketing content
  (landing pages, emails, ads, taglines).
argument-hint: "[paste copy, or file path]"
---

# /marketing-claims-review

1. Plugin only: load `~/.claude/plugins/config/claude-for-legal/product-legal/CLAUDE.md` → Marketing claims standards. In a plain chat, skip this and use the claims standards the user pastes (see the plain chat note below).
2. Apply the claim taxonomy and review workflow below.
3. Extract every claim. Classify: puffery / factual / comparative / implied / absolute.
4. For each non-puffery claim: substantiation check, suggested fix.
5. Output: claim-by-claim with calls, suggested revision if short enough.

```
/product-legal:marketing-claims-review
[paste landing page copy]
```

---

## AI Blocks note: plain chat (read this first)

The steps below were written for a lawyer's plugin that has saved settings, matter folders and a paid legal research tool (Westlaw or similar). In a plain chat you have none of these. So:

- If there is no saved `CLAUDE.md` standards file, use the claims standards the user pastes. If they paste none, say so and use the claim taxonomy below with every call marked as unverified.
- Skip "Matter context", "Load standards" and any step that reads a plugin file or writes to a matter folder.
- Skip the legal research tool steps. Do not search a database you do not have. If your AI can search the web, tag results `[web search — verify]`.
- Without a research tool, name only the kind of rule that may apply (for example "FTC rules on endorsements"). Do not give section numbers, case names or dates from memory. Tag each rule `[verify]` and tell the user to check it at the issuing authority before relying on it.
- Always end the result with: "This is a risk check, not legal advice. Have a lawyer confirm anything high-stakes before it runs." This applies to every result, not only the ones marked "Ready to ship".
- Never state a claim is substantiated unless the user gave you the proof.
- In a plain chat, treat the person as a non-lawyer. Show "Ready to ship: Yes" only when the user supplied proof for every non-puffery claim, and still end with the lawyer line above. Never say "Ready to ship: Yes" on the user's word alone that proof exists.

---

## Plugin only (skip this block in a plain chat)

These steps need the lawyer's plugin, its saved settings and a research tool. In a plain chat, do none of them.

- **Matter context.** If matter workspaces are enabled in the plugin's practice-level CLAUDE.md, ask which matter this is for, load that matter's `matter.md`, and write outputs to its folder under `~/.claude/plugins/config/claude-for-legal/product-legal/matters/`. Never read another matter's files unless cross-matter context is on.
- **Load standards.** Read the `## Marketing claims` section of `~/.claude/plugins/config/claude-for-legal/product-legal/CLAUDE.md`: the comparative claims policy (allowed with substantiation, discouraged or never), the substantiation standard and the list of commonly rejected claims. If comparative claims are "never", flag all of them. If "allowed with substantiation", check for the substantiation.
- **Work-product header and next-steps tree.** Use the ones defined in that file's `## Outputs` section.
- **Legal research tool.** If a research tool is configured and returns few or no results, report what was found and stop. Do not fill the gap from web search or model memory without asking the user first.

## Purpose

Marketing wants to say the product is the best. Legal needs it to be true, or at least not provably false. This skill finds the claims that will get a demand letter from a competitor or an inquiry from a regulator, and suggests how to keep the energy while fixing the exposure.

## Rules for any rule or case you cite (all modes)

- Say which advertising and substantiation rules may apply to the specific claim, for example FTC rules, NAD practice, state consumer-protection law, sector rules for health, finance or children's products, and the platform's own ad policy. Cite only the ones a quoted claim actually triggers. Do not list every guideline.
- Without a research tool, give no section numbers, case names or dates from memory. Name the official source (the FTC website, the NAD, the platform's ad policy page) and tell the user to confirm the rule there.
- Tag every rule you name: `[settled]` for a stable, well-known principle (such as FTC Act section 5), `[verify]` for anything else from memory, `[verify-pinpoint]` for a subsection, CFR part or case paragraph, which carries the highest risk of error. Keep source tags such as `[web search — verify]` or `[user provided]` as they are.
- Ask what proof exists for the specific claim: who measured it, when, how many, and on what like-for-like basis. Some proof on file is not the same as proof for this claim.
- Flag implied and comparative claims for closer checking.
- If you cannot verify a current rule, flag it for a lawyer. Do not state a rule you have not confirmed.

## Claim taxonomy

The categories below are structural patterns the reviewer should be able to recognize. Whether a given phrase is actionable depends on the currently operative rule in the applicable jurisdiction, the specific substantiation available, and the audience — research that before concluding.

### Vague / subjective claims

Subjective assertions with no measurable content. Whether they are actionable depends on jurisdiction, context, and audience — research before concluding.

| Example |
|---|
| "The best way to manage your projects" |
| "You'll love it" |
| "Revolutionary" |

### Specific factual claims

Measurable, specific, a reasonable person might rely on it.

| Example | Substantiation to look for |
|---|---|
| "50% faster than [competitor]" | Benchmark data, disclosed methodology, date |
| "Trusted by 10,000 companies" | Actual count (not cumulative signups — *currently* trusted) |
| "Saves 5 hours per week" | Study or customer data, disclosed sample |
| "Enterprise-grade security" | What does that mean? SOC 2? Spell it out or it's a promise |
| "HIPAA compliant" | BAA available, actually configured for it — this is a contractual promise |

### Comparative claims (heightened scrutiny)

Naming a competitor or implying one. Research the applicable rules for comparative advertising in the relevant jurisdictions and media before clearing.

| Example | Fix pattern |
|---|---|
| "Faster than Slack" | Either name Slack with head-to-head data you can defend, or abstract to "faster than legacy chat tools" with substantiation |
| "The only platform that does X" | False if anyone else does X — "The first platform to..." (if true) or drop "only" |
| "[Competitor] can't do this" | Show your feature. Let the viewer compare. |

Per `~/.claude/plugins/config/claude-for-legal/product-legal/CLAUDE.md` — if comparative claims are "never," flag all of them. If "allowed with substantiation," check for the substantiation.

### Implied claims

Not stated outright but a reasonable reader infers it. Research the treatment of implied claims under the applicable advertising regime — implied claims often carry the same substantiation burden as express ones.

| Example | Implication | Fix |
|---|---|---|
| "Finally, a secure alternative" | Competitors are insecure | "Finally, security you can verify" |
| Customer logos without context | These companies endorse us | "Customers include..." is fine; "Trusted by..." implies more |
| "Built for healthcare" | HIPAA compliant | Clarify or qualify |

### Absolute claims

No room for error. One counter-example makes them false. Research whether qualifications cure the issue in the applicable jurisdiction.

| Example | Fix pattern |
|---|---|
| "Never goes down" | "99.9% uptime" (with SLA that defines it) |
| "100% accurate" | A specific, substantiated percentage tied to a benchmark |
| "Guaranteed" | Only if you actually offer a guarantee with terms — this creates warranty exposure |
| "Always" / "Every" | "Typically" / "Most" |

## The review

### Step 1: Extract every claim

Read the copy. List every sentence or phrase that asserts a fact, makes a comparison, or promises something. Ignore pure puffery in the list.

### Step 2: Classify and check

For each claim:

```markdown
**Claim:** "[exact quote]"
**Type:** [Specific factual | Comparative | Implied | Absolute]
**Substantiation on file:** [Yes — link | No | Unknown]
**Call:** [✅ Fine | ⚠️ Needs substantiation | ⚠️ Needs rewording | 🔴 Cut]
**Suggested fix:** "[alternative phrasing that keeps the energy]"
**Why:** [one line]
```

### Step 3: Check against the product

Does the product actually do what the copy says? Not a philosophical question — check the PRD or ask the PM.

Common drift: marketing copy written from an early spec, product changed, nobody updated the copy.

### Step 4: Output

Plugin only: prepend the work-product header from the plugin's CLAUDE.md `## Outputs`. In a plain chat, start with the title line below.

```markdown
[WORK-PRODUCT HEADER — per plugin config ## Outputs]

# Marketing Review: [Campaign/Asset name]

**Reviewed:** [date]
**Asset:** [landing page / email / ad / etc.]

---

## Summary

[N] claims reviewed. [N]✅ [N]⚠️ [N]🔴

**Ready to ship:** [Yes | With changes below | No — rewrite needed]

> **Before emitting "Ready to ship: Yes" (i.e., approving a claim for external use / publication):** In the plugin, read `## Who's using this` in its CLAUDE.md. In a plain chat, treat the person as a non-lawyer. If the Role is Non-lawyer:
>
> > Approving a marketing claim for publication is a legal act — once published, substantiation gaps and comparative-claim exposure become enforcement or competitor-challenge risk. Have you reviewed this with an attorney? If yes, proceed. If no, here's a brief to bring to them:
> >
> > [Generate a 1-page summary: asset, claims approved, claim types (specific factual / comparative / implied / absolute), substantiation on file for each, any implied claims flagged, and the three things to ask the attorney before the copy goes live.]
> >
> > If you need to find a lawyer: your professional regulator's referral service is the fastest starting point (state bar in the US; SRA/Bar Standards Board in England & Wales; Law Society in Scotland/NI/Ireland/Canada/Australia; or your jurisdiction's equivalent).
>
> Do not proceed past this gate to "Ready to ship: Yes" without an explicit yes. "With changes below" and "No — rewrite needed" do not require the gate — those are review calls, not approvals.

---

## Claim-by-claim

[All the claim blocks from Step 2, grouped: 🔴 first, then ⚠️, then ✅]

---

## Suggested revision

[For short assets — under 50 words, or a tweet, headline, one-liner, tagline, short ad — the output in this block is the actual revised copy with the fixes applied inline, not a description of what changed. The reader should be able to copy-paste this block into the asset.
For longer assets (>50 words but <300 words), show the revised copy with fixes applied inline.
For longer assets (300+ words), summarize the changes as a bulleted diff ("Strip Claim 1. Rewrite Claim 3 to drop 'any.' Soften Claim 4 for regulated-domain risk.") rather than pasting the whole asset.
A meta-description of changes is never an acceptable output for a short asset — when the asset is one line, the output should BE the revised one line.]

---

## Substantiation needed before ship

| Claim | Need | From whom |
|---|---|---|
| [claim] | [data type] | [PM / data team / eng] |

---

## Citation check

Any FTC rules, NAD decisions, state UDAP statutes, sector regulations, or platform policies cited in this review were generated by an AI model and have not been verified against a primary source. Before relying on a specific rule to clear or reject copy, verify it against a legal research tool (Westlaw, CourtListener, or your firm's research platform) for accuracy and current effective date — endorsement guides, platform rules, and state UDAP regimes all update frequently. Source tags on each citation (e.g., `[FTC site]`, `[web search — verify]`) show where it came from; `verify` tags carry higher fabrication risk and should be checked first.
```

## Disclosure overlays

Copy that involves any of the fact patterns below sits inside an additional disclosure regime. Research the currently operative disclosure requirements in the applicable jurisdictions (including any platform policies and sector-specific rules) and verify currency — these regimes are updated frequently.

- **Testimonials / reviews** — material connections between the speaker and the advertiser are typically disclosable; research the current form and placement rules
- **Influencer content** — research the current tagging, clarity, and conspicuousness requirements for the channel and audience
- **"Results may vary" / atypical results** — research whether a disclosure (and what form) is required when shown results aren't representative
- **Free trial / auto-renewal / negative option** — research the current conspicuousness and consent requirements for auto-conversion terms

## Close with the next-steps decision tree

End with next steps (plugin: the decision tree from CLAUDE.md `## Outputs`; plain chat: a short list such as gather proof, send to a lawyer, rewrite and re-check). Customize the options to what this skill just produced — the five default branches (draft the X, escalate, get more facts, watch and wait, something else) are a starting point, not a lock-in. The tree is the output; the lawyer picks.

## What this skill does not do

- It doesn't write the marketing. It fixes what's wrong with it. The suggested rewrites keep the energy, but the marketer owns the voice.
- It doesn't substantiate claims. It identifies which ones need it and who has the data.
- It doesn't review design or imagery — words only. If an image implies a claim (competitor logo with a red X through it), flag it, but visual review is a human judgment.
