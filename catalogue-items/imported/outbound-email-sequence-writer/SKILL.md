---
name: sales-email-sequences
description: Design multi-touch outbound email sequences with personalized messaging, timing cadences, and conversion-aware copy for prospecting or re-engagement. Use when the user needs a coordinated sales campaign across several touches; use email-drafting for a single message or reply.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Sales Email Sequences

Design end-to-end outbound email sequences that move prospects from cold outreach to booked meetings. This skill builds persona-targeted messaging across multiple touches — intros, follow-ups, value-adds, and breakup emails — with personalization tokens, subject line variants, and send-timing cadences optimized for reply rates.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand brain** (its buyers part), made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **An email flow** (yours): an email/SMS flow: trigger, timing, messages, segments.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
3. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for a buyer brief, your brand brain, an email flow. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Define ICP and Persona** — Establish the ideal customer profile (industry, company size, revenue range, geography) and the target persona (title, seniority, responsibilities, pain points). This determines tone, vocabulary, value framing, and which proof points resonate.

2. **Craft the Core Value Proposition** — Distill your product's relevance to this persona into a single compelling statement. Focus on a specific, measurable outcome (e.g., "reduce month-end close from 10 days to 3") rather than feature lists. This value prop threads through every email in the sequence.

3. **Write the Email Sequence** — Build a multi-touch sequence: an opening email that earns attention with a relevant hook, follow-ups that introduce new angles or proof points, a value-add email offering a resource, and a breakup email that creates urgency through finality. Each email should be 50–120 words in the body.

4. **Add Personalization Tokens** — Insert dynamic fields for prospect name, company, industry, recent trigger events (funding rounds, job changes, earnings calls), and any known tech stack details. Personalization beyond `{{first_name}}` often helps reply rates, so test it on your own list.

5. **Set Timing and Cadence** — Define send days, times, and intervals between touches. A common rule of thumb for B2B is Tuesday–Thursday sends between 8–10 AM local time, with 2–4 day gaps between early touches and longer gaps (5–7 days) before the breakup. These are starting points to test, not proven results.

6. **Add the compliance lines** — Every email carries an opt-out line and the sender's real name and company. Confirm you have a lawful basis to contact this person before sending (for example consent or a clear business interest under your local law). Remove aggressive urgency from regulated industries.

7. **Never invent proof** — Use only figures, customer results, surveys and reports you can source. If you have none, leave a bracket such as [your verified result] and say it needs filling in. List unfilled brackets under `MISSING:`.

## Usage

Specify the target persona, your product/service, the core pain point you solve, and desired sequence length. Optionally include trigger events or specific personalization data.

**Example prompt:**
> Create a 5-email cold outreach sequence targeting VP of Engineering at Series B+ SaaS companies. We sell an automated code review platform that cuts PR review time by [your verified figure]. Include subject lines, body copy, and send timing for each email.

## Examples

All numbers, customer results, surveys and reports in these two examples are made-up placeholders that show the layout. Never reuse them. Replace each with your own sourced figure, or take the line out.

### Example 1: 5-Email Cold Outreach Sequence (B2B SaaS)

**Target:** VP of Engineering at Series B+ SaaS companies (100–500 employees)
**Product:** Automated code review platform
**Value prop:** [your verified result, for example the change in PR review time]

---

**Email 1 — The Hook (Day 1, Tuesday 9:00 AM)**

Subject: `{{company}}'s PR bottleneck`

Hi {{first_name}},

Saw {{company}} just shipped {{recent_launch}} — congrats. Curious if your team is feeling the review bottleneck that usually comes with scaling engineering velocity post-Series B.

Our platform plugs into your existing GitHub workflow and automates [your verified share] of code review — [your verified result, with where it comes from].

Worth a 15-min look? I can show you results from {{similar_company}} in your space.

Best,
{{sender_name}}

---

**Email 2 — Social Proof (Day 3, Thursday 8:30 AM)**

Subject: `How {{similar_company}} [your verified result]`

{{first_name}}, quick follow-up.

[A real customer result you have permission to share, with before and after numbers.]

Happy to share their playbook — no strings.

{{sender_name}}

---

**Email 3 — Value-Add (Day 7, Monday 9:00 AM)**

Subject: `Code review benchmarks for {{industry}} teams`

{{first_name}},

We just published [your own report or data, with its date and sample size].

Key finding: [one finding from that report, stated exactly as it appears there].

Here's the report: [link]

Useful regardless of whether we chat — but if the data resonates, I'd love to show how we help teams move from bottom to top quartile in weeks.

{{sender_name}}

---

**Email 4 — New Angle (Day 11, Friday 8:00 AM)**

Subject: `Developer satisfaction at {{company}}`

{{first_name}},

One thing that doesn't show up in cycle-time metrics: developer frustration. [A survey result you can source, with who was asked and when.]

If retention and developer experience are on your radar this year, automating the review bottleneck is low-hanging fruit with outsized impact.

Open to a quick call next week?

{{sender_name}}

---

**Email 5 — Breakup (Day 16, Wednesday 9:00 AM)**

Subject: `Closing the loop`

{{first_name}},

I've reached out a few times and haven't heard back — totally understand if the timing isn't right.

I'll leave you with this: {{company}} can [your real trial offer, if you have one]. If review speed becomes a priority, you'll know where to find us.

Wishing you and the {{company}} team a strong quarter.

{{sender_name}}

---

### Example 2: 3-Email Re-Engagement Sequence (Dormant Leads)

**Target:** Marketing Directors who attended a webinar 90+ days ago but went dark.

**Email 1 — Re-engage with New Value (Day 1)**

Subject: `A lot's changed since {{webinar_name}}`

Hi {{first_name}},

You joined our {{webinar_name}} session back in {{month}} — since then, we've launched [your real new features, only ones that exist today].

Any of those hit a current pain point? Happy to do a 15-minute walkthrough tailored to {{company}}'s stack.

{{sender_name}}

**Email 2 — Peer Success Story (Day 5)**

Subject: `{{peer_company}}: [your verified result]`

{{first_name}},

Since we last connected, {{peer_company}} (similar size and vertical to {{company}}) rolled out our attribution model. Result: [a real, approved customer result].

[Offer a real case study or video only if you have one] — want me to send it over?

{{sender_name}}

**Email 3 — Breakup with Offer (Day 10)**

Subject: `Last note from me`

{{first_name}},

Don't want to clutter your inbox. If priorities have shifted, no worries — I'll close out this thread.

One parting offer: [a real offer you run, with its length, cost and end date].

Link to book: [link]

Either way, wishing {{company}} a strong quarter.

{{sender_name}}

## Best Practices

These are rules of thumb, not proven results. Test them on your own list.

- Keep body copy under 120 words. Shorter emails are usually easier to answer.
- Personalize beyond first name; reference company news, tech stack, or a recent trigger event.
- Each email should introduce a new angle (social proof, data, empathy, resource) rather than repeating the same pitch.
- Try subject lines under 6 words, and compare them with longer ones.
- Send from a real person's address, never a generic team alias.
- A/B test the first email's subject line and opening line before scaling the sequence.

## Edge Cases

- **No trigger events available** — Fall back to industry-level trends or publicly available company metrics (headcount growth, job postings, tech stack signals).
- **Prospect replies mid-sequence** — Any reply (positive, negative, or out-of-office) should halt the automated sequence and route to a human rep immediately.
- **Multi-threaded deals** — When targeting multiple personas at the same company, stagger sequences by 3–5 days and vary the value prop angle to avoid the contacts comparing notes on identical emails.
- **Regulated industries (healthcare, finance)** — Remove aggressive urgency language, add compliance-safe disclaimers, and ensure CAN-SPAM / GDPR opt-out links are present.
- **Very small TAM (< 200 accounts)** — Increase manual personalization depth significantly; generic sequences burn through a limited addressable market too quickly.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Cold email pre-send checker](https://useaiblocks.com/skills/cold-email-pre-send-checker). It takes the email flow.
- The [Cold email claim checker](https://useaiblocks.com/prompts/cold-email-claim-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
