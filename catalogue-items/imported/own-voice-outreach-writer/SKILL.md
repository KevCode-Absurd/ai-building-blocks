---
name: outreach-composer
description: >
  Writes prospect outreach and follow-up sequences that sound like the owner
  wrote them, not like an AI did. Learns a voice profile from the owner's own
  sent mail, grounds every message in something specific about that prospect,
  builds the follow-up sequence behind it, queues every send for approval, and
  logs each touch to the CRM. Runs draft-only when no mail connector is
  available, so the copy can be pasted anywhere. Use this whenever the owner
  needs to reach out to prospects or customers — including phrasings like
  "write this cold email," "draft a follow-up," "reach out to these leads,"
  "what do I say to them," "I need a sequence for this list," "nudge the people
  who didn't reply," or "write it but don't make it sound like a robot." Reach
  for it whenever outreach copy is the deliverable, even for a single message.
allowed-tools: Read, WebFetch
---

# Outreach Composer

Write outreach the owner would actually send under their own name.

The single most repeated condition owners set is some version of "without sounding like a bot." Owners will not send copy that embarrasses them, so a message that reads as generated is worth nothing regardless of how well structured it is. Voice fidelity is the product here, not a finishing touch.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your lead list** (yours): your leads or open deals, exported from your CRM or a sheet.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Your lead list** with the [Prospect account researcher](https://useaiblocks.com/skills/prospect-list-builder). It uses your brand brain.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your lead list. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Step 1 — Learn the voice before writing anything

Read [the shared voice profile](../../shared/voice-profile.md) first. If a profile already exists there, use it and skip to Step 2 — rebuilding it every time wastes the owner's patience and produces drift.

If there is no profile, build one from evidence:

- **Gmail or Microsoft 365** — pull 15 to 30 of the owner's own sent messages to customers and prospects. This is the best source by a wide margin. Confirm the mailbox is the owner's first (`../../shared/tenant-scope.md`); another tenant's sent mail would teach the wrong voice.
- **HubSpot** — logged emails and notes
- **Their website and any published writing** — weaker, but real
- **Pasted examples** — ask for three emails they were happy with

Then extract the specific, imitable traits: sentence length, greeting and sign-off habits, contractions, whether they use exclamation marks, how direct the ask is, what they call their own product, regionalisms, and the things they never do. Save the profile so every later run inherits it.

**Without any sample, say so and ask for three.** Writing in a guessed voice produces exactly the generic copy the owner is trying to avoid.

## Step 2 — Ground each message in something real

A personalized email is not one with the company name merged into a template. It is one that could only have been sent to that person.

For each prospect, find the specific hook. Use only the prospect's own website, press releases, public posts they made, and details they shared with the owner. Do not scrape profile pages or collect private contact details. Check a site's terms before copying from it. In order of strength:

1. The buying signal from `lead-finder` — a permit filed, a location opened, a role posted
2. A shared connection or customer
3. Something specific about their business the owner can genuinely speak to
4. A relevant result the owner produced for a similar customer

If no hook exists beyond category fit, write a shorter, plainly cold message and say it is cold. A fake-warm opener is worse than an honest cold one, because it reads as a mail merge and destroys credibility in the first line.

**Apollo or Clay, when connected, can fill in the contact and company detail that makes a thin hook usable** — role, tenure, company size, tech stack — the kind of specific that keeps a message from reading as generic. Enrichment data, not a hook on its own. This data comes from the person's own Apollo or Clay account, which is a paid service. Some contacts come back marked "inferred", meaning the tool guessed the address from a pattern. Check every inferred address by hand before you use it. Collect only business contact details that the person can use under the opt-out rules where they send. Do not collect private details.

## Step 3 — Write the sequence

Read `reference/sequence_patterns.md` for structure by scenario. Defaults:

- **Cold outreach** — 4 messages over 3 weeks
- **Warm or referral** — 3 messages over 2 weeks
- **Post-meeting follow-up** — 2 messages over 10 days
- **Re-engagement of a quiet customer** — 3 messages over 4 weeks

Each message in a sequence must add something new. A follow-up whose entire content is "just bumping this" trains people to ignore the sender. Give every touch a fresh reason to exist: a different angle, a relevant result, a genuinely useful piece of information, or a clean close-out.

Length rule: first message under 120 words. Owners in this segment sell to people who read on their phone between jobs.

## Step 4 — Self-check against the slop test

Before showing anything, run every draft against `reference/slop_test.md`. It catches the specific patterns that make copy read as machine-written.

The fastest checks:

- Would the owner say this sentence out loud? If not, rewrite it.
- Could this message be sent to any other company with two words changed? If yes, it is not personalized.
- Does it open with a compliment about the prospect's business? Delete it — everyone does this and everyone recognizes it.
- Is there a phrase here the owner has never used in their life? Cut it.

This step is not optional and it is not a formality. It is the difference between copy that gets sent and copy that gets rewritten by hand, which is the outcome the skill exists to prevent.

## Step 5 — Present for approval

Show the full sequence before anything queues. Follow `reference/output_template.md`.

Present message one in full, then the rest of the sequence with subject lines and the angle each takes. Owners want to read the first one closely and skim the shape of the rest.

**Deliver per the owner's stored output preference — never default to a markdown file.** Check the `## Business context` block's `Output preference` (shared style guide rule, `../../shared/artifact-style.md`):

- **Visual artifact (the default):** an HTML page in the house style — one card per prospect or sequence, each message as a copy block so any single message can be copied and sent by hand.
- **docx / md / notion / canva preference:** deliver the same content in that form — a DOCX or markdown file, a Notion page created via the connector (named destination, never overwriting), or a Canva Doc created via the Canva connector (a new design each run, named with the date; tables become lists); fall back to the visual artifact if Notion or Canva is not connected — and say that is why.
- **Best for skill:** use the visual artifact — the copy blocks are the point.

Chat keeps the recap and the approval question in every case.

Then ask what to change. Expect edits — the first pass is a proposal, not a delivery. Fold every edit back into the voice profile, because a correction made once should not have to be made again.

## Step 6 — Queue sends, with approval, one gate at a time

Sending email under the owner's name is the highest-consequence action in this skill.

- **Never send without an explicit yes** for that specific batch
- **State exactly what will happen** before asking: how many messages, to whom, on what schedule, from which account
- **Never send to a contact marked "inferred"** without flagging it separately. Bounces at volume damage the owner's sending domain for months, and that damage reaches their real customer mail
- **Approval for message one is not approval for the sequence.** Confirm the follow-ups separately, or set them to draft and let the owner release each

**Mailchimp is a drafting destination, not a send route.** When it is connected, an approved
sequence can be saved into Mailchimp as campaign content for the owner to schedule there.
Three things govern that:

- **It cannot send.** Nothing this skill puts into Mailchimp goes out on its own. The owner presses send in Mailchimp.
- **Its planner refuses single campaigns.** Mailchimp's campaign planner only produces multi-channel plans — email plus SMS plus social. A one-off email is written here, in the owner's voice, and saved as content. Do not route a single message through the planner and do not report a refusal as a failure.
- **Do not assume you can read the audience list.** Treat the contact list as unavailable unless a call actually returns it. Build the recipient list from the CRM or the owner's own file, as today.

**Without a mail connector, run draft-only.** Produce the copy formatted to paste anywhere. This is a complete outcome, not a degraded one — plenty of owners prefer to send from their own client anyway.

## Step 7 — Log it

Log every touch to HubSpot when connected: what was sent, when, to whom, and where it sits in the sequence. Without a CRM, keep the record in a file so the next run knows who has already been contacted.

Contacting someone twice with the same opener is a visible, avoidable mistake.

## What not to do

- **Do not write before learning the voice.** Everything downstream depends on it.
- **Do not open with flattery about their business.** It is the single clearest tell.
- **Do not send a follow-up that says only "checking in."** Every touch earns its place.
- **Do not merge a company name into a template and call it personalized.**
- **Do not send anything without an explicit approval for that batch.**
- **Do not claim results the owner has not actually produced.** Invented case studies in outreach are a serious problem, not an exaggeration.

## After the send

The sequence is approved, queued or drafted, and every touch is logged. The natural next step is "update the CRM" — `crm-autopilot` keeps the next-step queue current as replies come in. Also nearby: "leads are going cold" (`speed-to-lead`) to catch the responses fast, and "find me customers" (`lead-finder`) when this list runs dry. Offer at most three, and skip any offer the owner already declined this session.

## Reference files

- [`../../shared/voice-profile.md`](../../shared/voice-profile.md) — the owner's voice, shared by every skill that writes in their name
- `reference/sequence_patterns.md` — structure and cadence by scenario
- `reference/slop_test.md` — the checklist that catches machine-written copy
- `reference/output_template.md` — how sequences are presented for approval
- `reference/gotchas.md` — the failure modes that get owners to stop using this

## Using a tool that isn't listed

The connectors named in this skill are the tested paths, not a wall. If the owner wants this flow to use a tool that isn't connected or listed, offer `build-connector` — it checks the connector directory first and connects through Zapier otherwise, never hand-building against a raw API. Once the connection exists, the tool joins this skill like any other optional connector, under the same approval gates.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Cold email pre-send checker](https://useaiblocks.com/skills/cold-email-pre-send-checker). It takes the email flow.
- The [Follow-up email sequence writer](https://useaiblocks.com/prompts/follow-up-email-sequence-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
