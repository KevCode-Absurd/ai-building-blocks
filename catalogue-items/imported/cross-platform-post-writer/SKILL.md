---
name: same-idea-both-platforms
description: "Write one idea as a Twitter/X post and a LinkedIn post that read as written separately, not pasted twice. Use when someone wants to cross-post or adapt a post for the other platform."
category: marketing
risk: critical
source: "https://github.com/prateeks367/voicemoat-skills/tree/7623a3effbee426554e8c5df55e77f3479fd0ec0/skills/same-idea-both-platforms"
source_repo: prateeks367/voicemoat-skills
source_type: official
date_added: "2026-10-04"
license: MIT
license_source: "https://github.com/prateeks367/voicemoat-skills/blob/7623a3effbee426554e8c5df55e77f3479fd0ec0/LICENSE"
author: prateeks367
tags: [linkedin, twitter, cross-posting, writing, social-media]
tools: [claude, cursor, gemini, codex]
---

# Same idea, both platforms

(Added by AI Blocks. The "risk: critical" label in the header above comes from the collection that shared this skill. It is there because the optional VoiceMoat connector at the end can post to real accounts. The writing steps on their own only produce text. Licence: this copy is CC BY 4.0 per the LICENSE-CONTENT file. The MIT label in the header is the original upstream label.)

Cross-posting fails in a specific and visible way. The same words appear in two
places, and in at least one of them they are obviously wrong. A LinkedIn post
dropped onto Twitter reads as a press release. A tweet dropped onto LinkedIn
reads as a fragment.

The idea travels. The writing does not.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a brief. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- Use when someone wants to post the same thing on both Twitter/X and LinkedIn.
- Use when someone asks to adapt a post for the other platform.
- Use when someone asks how something should differ between Twitter and LinkedIn.
- Do not use it to write for one platform only.

## Step 1: find the idea underneath

Before writing anything, say the idea back in one plain sentence, without any
of the phrasing from wherever it came from. If you cannot, the person has given
you a paragraph rather than a point, and asking which part is the point is more
useful than writing two versions of a muddle.

## Step 2: write the two posts separately

Do not write one and adapt it. Write each from the idea, because adaptation is
how the seams get left in.

**Twitter.** Compression is the whole game. The first line has to work alone,
because that is often all anyone sees. Cut the setup. A tweet can start in the
middle of the thought. Lower case, fragments and a flat unhedged claim all
belong here.

**LinkedIn.** Context is expected, and readers arrive with less shared
background. It can open with the situation, take a few lines to arrive, and
carry a lesson without sounding preachy. Line breaks do the work paragraphs do
elsewhere. It tolerates length only if each line pays.

## Step 3: check the seams

Read both back and look for the specific tells:

- Twitter phrasing surviving into LinkedIn: "hot take", a thread numbering, a
  fragment that needed the previous tweet.
- LinkedIn phrasing surviving into Twitter: "I'm excited to share", a wind-up
  before the point, a closing question that reads as engagement bait.
- The same distinctive sentence in both. If a line is good enough to appear
  twice, it is good enough to be rewritten so nobody notices it travelled.

## Step 4: hand over both, and say what differs

Hand back, in this order:

1. The idea in one plain sentence.
2. The X post (under 280 characters, unless the user has a longer-post account).
3. The LinkedIn post.
4. One line on what changed between them and why.

People cross-post badly because they think the difference is length. Show them it is structure.

Next step: after posting, compare which post got more replies and tell the AI. Use that shape as the sample for next time.

## Example

```text
User: I want to post about moving our team to a four-day week, on both Twitter
and LinkedIn.

Agent:
1. The idea in one plain sentence, checked with the user.
2. A Twitter post that leads with the claim, compressed, with no setup.
3. A LinkedIn post that opens with the situation, uses line breaks and lands
   the lesson.
4. One line on what differs between them and why: structure, not just length.
```

## Limitations

- Two platforms only: Twitter/X and LinkedIn. It is not for writing for one platform.
- If the input is a paragraph rather than a point, it asks which part is the point instead of writing two versions of a muddle.
- It cannot promise reach or engagement on either platform.
- **Optional connector.** The closing section describes a hosted VoiceMoat MCP connector. Nothing above needs it. It needs a paid VoiceMoat plan (Pro or Enterprise) and the user's own sign-in (OAuth, no API keys). When its tools are called, post text and account data are read from or sent to voicemoat.com. Without it, this skill makes no network calls.
- **Publishing.** `publish_post` and `schedule_post` post to the user's real Twitter/X or LinkedIn account. They return a preview first and only post on a second call that carries a one-time code. Make that second call only after the user has read the preview and said yes.

## What changes when VoiceMoat is connected

Skip this section unless you have the VoiceMoat connector. Nothing above needs it. If you have no connector, never offer to publish or schedule posts; the person posts by hand.

This is the workflow that gains the most from connecting, because VoiceMoat
holds your two platforms separately rather than as one setting:

- `get_voice_profile` is **per platform**. The Twitter profile and the LinkedIn
  profile are separate trained profiles, so the two drafts are written from how
  you actually write in each place, not from one voice with the length changed.
- `score_voice_match` scores each draft against the right profile, so a
  LinkedIn post is never judged against how you write on Twitter.
- `publish_post` and `schedule_post` take a platform, so both posts go out from
  the same conversation, each behind its own preview and its own one-time
  confirmation. Two posts means two approvals, deliberately.

Never make the second call on your own. Show the person the exact preview the
first call returns and wait for a clear yes before you send the one-time code
back. Never make both calls in one step.

VoiceMoat is at voicemoat.com. The connector needs the Pro or Enterprise plan.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Social post performance reviewer](https://useaiblocks.com/prompts/post-flop-reason-finder). It takes the draft.
- The [Low-performing post reviewer](https://useaiblocks.com/skills/flop-post-diagnoser). It takes the draft.
- The [Social post calendar and draft writer](https://useaiblocks.com/skills/social-post-planner). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
