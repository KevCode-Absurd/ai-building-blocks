---
name: social-media-posting
description: Create, adapt, and schedule social media content across platforms with platform-specific formatting, engagement hooks, and strategic posting cadence. Use when the user requests social media posting or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Social Media Posting

This skill enables an AI agent to create and manage social media content across major platforms — Twitter/X, LinkedIn, Instagram, and Facebook. The agent adapts messaging to each platform's unique format constraints, audience expectations, and algorithmic preferences. It handles copy writing, hashtag strategy, scheduling, and content calendar creation to maintain a consistent and engaging social media presence.

If you have a content plan from an earlier step (such as a give-before-ask sequence), use it to decide what each post must do. If you have a brand brain, use it for the voice.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **Brand brain**, made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **A plan** (yours): the goals, steps, constraints and dates for this work.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for a brief, your brand brain, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Define the campaign objective and audience.** Clarify the goal for the social content: brand awareness, engagement, lead generation, event promotion, or product launch. Identify the target audience segment and which platforms they are most active on. A B2B product launch prioritizes LinkedIn and Twitter/X, while a D2C brand focuses on Instagram and Facebook.

2. **Draft platform-adapted copy.** Write distinct versions of each message tailored to platform constraints and norms. The platform rules below are rough guides that change often. Mark each as unverified and tell the user to check the platform's current help page. Twitter/X posts use concise hooks within 280 characters with 1–3 hashtags. LinkedIn posts can run 1,300+ characters with paragraph breaks, professional tone, and no more than 3–5 hashtags. Instagram captions support up to 2,200 characters and rely heavily on hashtags (up to 30) and emoji for discoverability. Facebook posts perform best at 40–80 words with a direct question or call-to-action.

3. **Craft engagement hooks and CTAs.** Open every post with an attention-grabbing first line — a surprising statistic, a bold claim, or a direct question. The first line is the only part visible before "see more" on most platforms. End with a clear call-to-action: comment, share, click link, or tag someone. Use line breaks and whitespace to improve readability on mobile.

4. **Build a hashtag and mention strategy.** Suggest trending and niche hashtags relevant to the content topic. A plain chat cannot see live trends, so check every hashtag on the platform yourself before you use it. On Twitter/X, use 1–3 targeted hashtags inline. On LinkedIn, place 3–5 hashtags at the end of the post. On Instagram, use a mix of high-volume, medium and niche hashtags (rough guides, not fixed thresholds) for maximum reach. Tag relevant accounts, partners, or influencers to extend organic visibility.

5. **Schedule posts at optimal times.** Ask the user for their own post analytics first. If they have none, use the starting guesses below and label them as untested guesses, not measured for this audience. Twitter/X peaks at 8–10 AM and 12–1 PM weekdays; LinkedIn performs best Tuesday–Thursday 7–9 AM; Instagram engagement peaks Wednesday and Friday 11 AM–1 PM; Facebook sees highest reach Tuesday–Friday 9 AM–12 PM. Adjust for the target audience's timezone and test alternative windows quarterly. Platform timing advice and hashtag limits change often, so treat the numbers in steps 2, 4 and 5 as a rough guide (last reviewed October 2026) and re-check them every few months.

6. **Create a weekly content calendar.** Plan 5–7 days of posts in advance, balancing content types: educational (40%), engaging/entertaining (30%), promotional (20%), and community/UGC (10%). Assign each post a platform, publish time, copy, media asset requirements, and campaign tag for tracking.

## Usage

Before you start, gather the launch date, the platforms you really use, and any past post results. Provide the agent with the campaign goal, key message, target platforms, and any brand voice guidelines. The agent returns platform-specific post copy, hashtags, scheduling recommendations, and a weekly calendar.

**Prompt:** `Create a social media campaign for the launch of our new AI writing assistant. Target platforms: Twitter/X, LinkedIn, and Instagram. Launch date: March 15. Tone: professional but approachable.`

## Examples

> Both examples are made-up samples that show the layout. The product, features, offers, numbers and results in them are not real. Replace every bracketed item and every number, client, feature and result with your own verified facts before you post.

### Example 1: Multi-Platform Product Launch Campaign

**Request:** Announce the launch of [PRODUCT NAME], a [type of product] for [your audience], across Twitter/X, LinkedIn, and Instagram.

**Twitter/X (278 characters):**
```
Remote work is amazing — until your focus disappears by 10 AM.

We built [PRODUCT NAME] to fix that.

🎯 [Feature 1]
📊 [Feature 2]
⚡ [Feature 3]

[Your offer] → [your link]

#RemoteWork #Productivity
```

**LinkedIn (642 characters):**
```
After [NUMBER OF YEARS] of [your real experience], our team noticed a pattern: the hardest part isn't collaboration — it's protecting deep focus time.

So we built [PRODUCT NAME].

It's [what it is, in your words] that helps [your audience]:
→ [Real benefit 1]
→ [Real benefit 2]
→ [Real benefit 3]

We're opening it up to [your offer].

If you lead a distributed team or struggle with context switching, I'd love your feedback.

Try it here: [your link]

#ProductLaunch #RemoteWork #Productivity
```

**Instagram Caption (with image post):**
```
Your focus is your superpower. 🎯

Meet [PRODUCT NAME] — [one line on what it does for your audience].

✨ What you get:
→ [Real benefit 1]
→ [Real benefit 2]
→ [Real benefit 3]

Link in bio to get early access ([your offer])

.
.
.
[your hashtags, checked on the platform first]
```

### Example 2: Weekly Social Media Content Calendar

**Request:** Plan one week of posts for a B2B marketing agency's LinkedIn and Twitter/X accounts.

| Day | Platform | Type | Topic | Post Summary | Time |
|-----|----------|------|-------|-------------|------|
| Mon | LinkedIn | Educational | SEO tip | "[NUMBER] on-page SEO fixes [your real result]" | 8:00 AM ET |
| Mon | Twitter/X | Engagement | Industry poll | "What's the #1 channel driving leads for your B2B this year?" (poll) | 12:00 PM ET |
| Tue | LinkedIn | Case study | Client win | "How we helped [client] [your real result]" | 7:30 AM ET |
| Tue | Twitter/X | Educational | Thread | "[NUMBER] LinkedIn ad mistakes you have seen in real audits (thread)" | 9:00 AM ET |
| Wed | LinkedIn | Thought leadership | Industry trend | "AI won't replace marketers. Marketers who use AI will." | 8:00 AM ET |
| Wed | Twitter/X | Engaging | Meme/humor | Relatable marketing meme with commentary | 1:00 PM ET |
| Thu | LinkedIn | Promotional | Service highlight | "Our [QUARTER] content strategy sprint is open for [NUMBER] clients" | 7:30 AM ET |
| Thu | Twitter/X | Community | Retweet + comment | Amplify a client's post with added insight | 10:00 AM ET |
| Fri | LinkedIn | Educational | Carousel | "The anatomy of a LinkedIn post that [your real result]" | 8:00 AM ET |
| Fri | Twitter/X | Engagement | Question | "What's one marketing tool you can't live without? I'll go first:" | 11:00 AM ET |

## Best Practices

- **Lead with a hook in the first line.** On every platform, only the first 1–2 lines are visible before truncation. Use a bold statement, number, or question to stop the scroll. Avoid starting with "We're excited to announce" — that's a scroll-past.
- **Adapt tone and format per platform.** LinkedIn rewards professional storytelling and data-driven insights. Twitter/X rewards conciseness and wit. Instagram rewards visual quality and community engagement. Never cross-post identical copy.
- **Post consistently rather than frequently.** Three high-quality posts per week outperform daily low-effort posts. Algorithms reward engagement rate (likes + comments / impressions), not raw volume.
- **Use native content over external links when possible.** Many people report that platform algorithms deprioritize posts with outbound links (unverified, platform rules change; check the platform's current help page). Post the content natively (text, images, carousels) and add the link in the first comment or as "link in bio" on Instagram.
- **Engage in the first 30 minutes after posting.** Reply to every comment and engage with related content immediately after publishing. Early engagement signals tell the algorithm to distribute the post more widely.
- **Track performance weekly and iterate.** Monitor impressions, engagement rate, link clicks, and follower growth per platform. Double down on content types and topics that outperform benchmarks and retire underperforming formats.

## Edge Cases

- **Character limit overflows.** Twitter/X hard-limits at 280 characters (URLs count as 23 characters regardless of length). If the message is too long, split into a thread with a clear "(1/3)" format and hook the first tweet to encourage thread reads.
- **Platform API rate limits and outages.** When posting programmatically, respect each platform's rate limits. The numbers in the original skill (Twitter/X: 300 tweets per 3 hours, LinkedIn: 100 shares a day) are undated and unsourced, so check each platform's current developer docs. Posting by code needs API access and a developer account on each platform, and some tiers are paid. Implement retry logic with exponential backoff and queue failed posts for rescheduling.
- **Regulated industries.** Financial services, healthcare, and legal social posts may require compliance review and disclaimers. Build an approval workflow and pre-approved template library to maintain velocity without compliance risk.
- **Crisis or sensitive news events.** Pause all scheduled promotional posts during major crises or tragedies. Review the queue and hold anything that could appear tone-deaf. Resume with empathetic or neutral content first.
- **Hashtag hijacking or misuse.** Monitor trending hashtags before using them. A hashtag that appears relevant may have been co-opted for a political or controversial topic. Always check the current conversation around a hashtag before including it.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Social post calendar and draft writer](https://useaiblocks.com/skills/social-post-planner). It takes the draft.
- The [Multichannel content publishing planner](https://useaiblocks.com/skills/agency-marketing-multi-platform-publisher). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
