---
name: define-my-content-pillars
description: "Find the three to five subjects someone can post about repeatedly, from what they have published and know first-hand. Use when someone asks what to post about or has run out of ideas."
category: marketing
risk: safe
source: "https://github.com/prateeks367/voicemoat-skills/tree/7623a3effbee426554e8c5df55e77f3479fd0ec0/skills/define-my-content-pillars"
source_repo: prateeks367/voicemoat-skills
source_type: official
date_added: "2026-10-04"
license: MIT
license_source: "https://github.com/prateeks367/voicemoat-skills/blob/7623a3effbee426554e8c5df55e77f3479fd0ec0/LICENSE"
author: prateeks367
tags: [linkedin, twitter, content-strategy, personal-brand, social-media]
tools: [claude, cursor, gemini, codex]
---

# Define my content pillars

Running out of ideas is almost never a shortage of ideas. It is a missing
answer to "what am I the person for", so every post starts from nothing.

Pillars fix that by making the question smaller. Not "what should I post today"
but "which of my four subjects, and what about it".

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- Use when someone asks what they should post about on Twitter/X or LinkedIn.
- Use when someone says they have run out of ideas.
- Use when someone wants content pillars or themes.
- Use when someone is starting an account and does not know where to aim.
- Do not use it to plan dates or write posts.

## Step 1: gather the evidence, not the aspiration

Ask for both, because they are usually different:

- **Ten to fifteen posts they have already written**, ordinary ones. What they
  actually return to is more honest than what they think they write about.
- **What they want to be known for**, in their own words.

Then the question people skip: **who is reading, and what do they want?** A
pillar nobody needs is a diary entry.

If they have no posts yet, work from what they do for a living, what people ask
them, and what they argue about.

## Step 2: cluster what is already there

Group the posts by subject. Report the actual distribution, including the
uncomfortable parts: they think they write about hiring and eleven of fifteen
posts are about tooling. That gap is the most useful thing in this exercise.

## Step 3: test each candidate pillar against four questions

A pillar earns its place only if all four hold:

1. **Can you write fifty posts about this?** If it runs out at five, it is a
   topic, not a pillar.
2. **Do you know something first-hand?** Not "have opinions about". Have done.
3. **Does the reader want it?** Interesting to you is not sufficient.
4. **Would someone else write it differently?** If your version is
   interchangeable with the generic version, it will read as filler.

Say plainly which candidates fail and on which question.

## Step 4: land on three to five, and make them specific

"Marketing" is not a pillar. "Why small teams should not run paid ads before
they have organic proof" is.

For each pillar give:

- A one-line definition
- The angle only this person can take
- Five seed ideas, to prove the pillar has depth rather than asserting it
- One thing it is not, to keep the edges sharp

Three to five. Two is monotony, seven is no focus at all.

## Step 5: say what to drop

The valuable half of this exercise is subtraction. Name the subjects they
should stop posting about, and why: no first-hand knowledge, no audience
interest, or indistinguishable from everyone else.

## Example

```text
User: I have run out of things to post about. Here are fifteen of my LinkedIn
posts. I want to be known for helping small teams hire.

Agent:
1. Clusters the posts and reports the real split, for example that most of
   them are about tooling rather than hiring.
2. Tests each candidate pillar against the four questions and says which fail.
3. Returns three to five pillars, each with a one-line definition, the
   person's angle, five seed ideas and one thing it is not.
4. Names the subjects to stop posting about, and why.
```

## Limitations

- It does not plan dates or write the posts themselves.
- Without the connector, it only sees the posts the person chose to paste, which skews toward the ones they liked.
- It does not pick a pillar the person has no first-hand knowledge of.
- **Optional connector.** The closing section describes a hosted VoiceMoat MCP connector. Nothing above needs it. It needs a paid VoiceMoat plan (Pro or Enterprise) and the user's own sign-in (OAuth, no API keys). When its tools are called, post text and account data are read from or sent to voicemoat.com. Without it, this skill makes no network calls.

## What changes when VoiceMoat is connected

Optional, and it needs a paid VoiceMoat plan (Pro or Enterprise). Skip this section unless the user has that plan and has connected it. The skill works fully without it.

Step 2 is only as good as the fifteen posts someone chose to paste, and people
paste the ones they liked, which quietly skews the whole thing.

- `list_posts` and `get_post` supply the real history rather than a
  self-selected sample, including the posts they would not have shown you.
- `get_analytics` and `list_posts` give the engagement behind each post, so
  once the posts are grouped a pillar can be tested against what the audience
  actually responded to instead of what the writer enjoyed writing.
- `get_voice_insights` returns the vocabulary and patterns that recur across
  everything they have written, which often names a pillar they did not know
  they had.
- `get_post_ideas` fills each agreed pillar with seeds in their own voice, so
  step 4 is generated rather than guessed.

Once the pillars are set, the plan-my-week skill turns them into a dated
calendar.

VoiceMoat is at voicemoat.com. The connector needs the Pro or Enterprise plan.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Social content calendar maker](https://useaiblocks.com/skills/standing-social-calendar-maker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
