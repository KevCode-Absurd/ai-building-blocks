---
name: community-building
description: "When the user wants to build, grow, or improve a developer community on Discord, Slack, or forums."
risk: critical
source: https://github.com/jonathimer/devmarketing-skills/tree/main/skills/community-building
source_repo: jonathimer/devmarketing-skills
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/jonathimer/devmarketing-skills/blob/main/LICENSE
---

# Community Building
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Brand file** (its buyers part), made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand file, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your question, your brand file. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini:** Any chat AI works. Nothing needs to run and no file access is needed.
<!-- /needs -->

## When to Use

Use this skill when the user wants to build, grow, or improve a developer community on Discord, Slack, or forums. Trigger phrases include "developer community," "Discord server," "Slack community," "community strategy," "community engagement," "community moderation," "community growth," or "community-led growth."


This skill helps you build and manage developer communities on Discord, Slack, forums, and other platforms. Covers channel structure, onboarding, engagement programs, handling toxicity, and community-led growth.

---

## Before You Start

**Load your audience context first.** If the user pasted an audience description, or `.agents/developer-audience-context.md` exists and you can read files, use it. It should say:

- Who your developers are (role, seniority, interests)
- Where they already hang out (to avoid competing platforms)
- What problems they discuss (community topic focus)
- How they communicate (formal vs. casual tone)

If there is no context, ask once for these four things plus the product and what it does, how many hours a week the team can spend on moderation, and whether the community is new or existing. If an answer is missing, write MISSING in the plan and give your best option with the assumption stated. Never invent member counts or numbers about the user's community.

## Run order

1. Confirm the audience, the product, the goal and the team's moderation time.
2. Pick a platform from the matrix and say why. Name the second choice and when it would win.
3. Lay out channels, each with a one-line purpose. Start small: fewer channels with traffic beat many empty ones.
4. Write the welcome message and the new-member path.
5. Write the rules and a moderation plan sized to the team's time.
6. Plan a 90-day calendar of prompts and events. Keep effort within what the team can do.
7. Choose 3 to 5 health numbers to watch.

## Output format

Return these sections in order:

1. **Platform pick**: the choice, the reasons, the runner-up.
2. **Channel map**: each channel with its purpose and posting rule.
3. **Welcome and onboarding**: the welcome text, the new-member path and the roles.
4. **Rules and moderation**: a short code of conduct and how to handle common problems.
5. **90-day calendar**: weekly prompts and monthly events, with the effort for each.
6. **Health numbers**: what to track, and how to read it.

If the community already exists, add a short **What to fix first** list before the channel map, based only on what the user told you.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Community question and update writer](https://useaiblocks.com/skills/weekly-community-keeper).
- The [Multi-platform post planner](https://useaiblocks.com/skills/multi-platform-post-planner). It takes the plan.
- The [Developer outreach planner](https://useaiblocks.com/skills/agency-specialized-developer-advocate). It takes the plan.
- **Lead the team** with the [Recognition plan designer](https://useaiblocks.com/skills/recognition-plan-designer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Platform Selection

### Comparison Matrix

| Platform | Best For | Pros | Cons |
|----------|----------|------|------|
| **Discord** | Developer tools, gaming, OSS | Real-time, rich features, free | Can be chaotic, less enterprise |
| **Slack** | Enterprise, B2B SaaS | Professional, familiar | Expensive at scale, message limits |
| **GitHub Discussions** | OSS projects | Integrated, async, searchable | Less community feel |
| **Discourse** | Long-form, searchable | SEO, threading, ownership | Maintenance, hosting costs |
| **Circle** | Courses, paid communities | Courses integration, clean | Paid, less developer-native |

### Decision Framework

| If your audience is... | Consider |
|------------------------|----------|
| Individual developers, OSS | Discord |
| Enterprise teams | Slack |
| Technical, async-preferred | GitHub Discussions |
| Mixed, need searchability | Discourse |
| Course/education based | Circle |

---

## Channel Structure

### Discord Channel Template

```
📢 INFORMATION
├── #welcome — First landing, rules, links
├── #announcements — Official updates (admin-only posting)
├── #rules — Code of conduct
└── #introductions — New member intros

💬 GENERAL
├── #general — Main discussion
├── #off-topic — Non-project chat
└── #show-what-you-built — Share projects

❓ SUPPORT
├── #help — General questions
├── #troubleshooting — Bug help
└── #feature-requests — Suggestions

🔧 TECHNICAL
├── #backend — Backend discussions
├── #frontend — Frontend discussions
└── #devops — Infrastructure discussions

🤝 COMMUNITY
├── #jobs — Job postings (if allowed)
├── #events — Meetups, conferences
└── #content — Blog posts, videos

📚 RESOURCES
├── #learning — Tutorials, courses
└── #tools — Useful tools and libraries
```

### Slack Channel Template

```
# welcome
# announcements (admin-only)
# general
# help
# random (off-topic)
# jobs (optional)
# introductions
# feedback
```

### Channel Guidelines

| Channel Type | Posting Rules | Moderation Level |
|--------------|---------------|------------------|
| **Announcements** | Admin only | N/A |
| **General** | On-topic discussion | Light |
| **Help** | Questions welcome, be patient | Medium |
| **Off-topic** | Anything goes (within CoC) | Light |
| **Jobs** | Structured format required | Heavy |
| **Introductions** | One post per person | Light |

---

## Onboarding Experience

### New Member Journey

```
Join Server
    ↓
Welcome Message (DM or public)
    ↓
Read Rules / Accept
    ↓
Verify (optional: GitHub, email)
    ↓
Introduce Yourself
    ↓
First Interaction
    ↓
Regular Member
```

### Welcome Message Template

**Discord DM:**
```
Welcome to [Community Name]! 👋

Here's how to get started:

1. Read the rules in #rules
2. Introduce yourself in #introductions
3. Ask questions in #help — we're friendly!

Quick links:
• Documentation: [link]
• Getting started: [link]
• GitHub: [link]

We're glad you're here!
```

**Public #welcome channel:**
```
# Welcome to [Community Name]!

We're [brief description of who you are and what you do].

## Quick Start

1. **Read the rules** → #rules
2. **Introduce yourself** → #introductions
3. **Get help** → #help
4. **Chat with us** → #general

## Useful Links

- [Documentation]
- [GitHub]
- [Website]

## Questions?

Drop a message in #help or mention @moderators
```

### Role Assignment

| Role | How to Get | Permissions |
|------|------------|-------------|
| **New Member** | Auto on join | Limited channels |
| **Member** | Verify or time-based | Full access |
| **Contributor** | PR merged, active helper | Badge, special channel |
| **Moderator** | Invited | Moderation powers |
| **Admin** | Core team | Full access |

---

## Engagement Programs

### Discussion Prompts

Schedule regular engagement:

| Day | Prompt Type | Example |
|-----|-------------|---------|
| Monday | This week's goals | "What are you working on this week?" |
| Wednesday | Technical question | "Controversial: Tabs or spaces?" |
| Friday | Show & Tell | "Share what you shipped this week" |

### Recognition Programs

| Program | Description | Frequency |
|---------|-------------|-----------|
| **Contributor of the Month** | Recognize top helpers | Monthly |
| **First PR Celebration** | Welcome new contributors | As happens |
| **Milestone Badges** | 10/50/100 messages | Automatic |
| **Expert Roles** | Domain expertise recognition | Quarterly |

### Event Ideas

| Event Type | Format | Effort |
|------------|--------|--------|
| **Office Hours** | Live Q&A with team | Low |
| **Show & Tell** | Members demo projects | Low |
| **Workshops** | Teaching sessions | Medium |
| **Hackathons** | Build challenges | High |
| **Game Night** | Non-tech fun | Low |
| **AMA Sessions** | Guest experts | Medium |

### Engagement Metrics

| Metric | What It Tells You |
|--------|------------------|
| **DAU/MAU** | Daily vs monthly active users |
| **Messages per user** | Individual engagement depth |
| **Questions answered** | Community self-sufficiency |
| **New member retention** | Onboarding effectiveness |
| **Event attendance** | Program resonance |

---

## Handling Toxicity

### Code of Conduct Essentials

```markdown
# Code of Conduct

## Our Standards

**Do:**
- Be respectful and inclusive
- Help others learn (no "RTFM")
- Assume good intentions
- Give constructive feedback
- Report problems, don't engage

**Don't:**
- Personal attacks or harassment
- Discrimination of any kind
- Spam or self-promotion
- NSFW content
- Doxxing or privacy violations
- Bad faith arguments

## Enforcement

1. **Warning** — First offense, good faith
2. **Temp mute** — Repeated issues
3. **Temp ban** — Serious violations
4. **Permanent ban** — Egregious or repeated

## Reporting

DM any @moderator or use the report feature.
All reports are confidential.
```

### Moderation Playbook

| Situation | Response |
|-----------|----------|
| **Heated debate** | "Let's keep this constructive. Both perspectives have merit." |
| **Help vampire** | "Here's a guide on asking good questions: [link]" |
| **Self-promotion spam** | Delete, warn, or ban depending on frequency |
| **Off-topic drift** | "Great discussion! Let's move this to #off-topic" |
| **Harassment** | Immediate mute, investigate, likely ban |
| **Bad faith troll** | Don't engage publicly, ban quietly |

### De-escalation Techniques

1. **Acknowledge feelings** — "I can see this is frustrating"
2. **Move to DM** — "Let's continue this privately"
3. **Take a break** — "Let's pause and revisit tomorrow"
4. **Clarify intent** — "I think there might be a misunderstanding"
5. **Set boundaries** — "We're here to help, but not to be yelled at"

### Moderator Self-Care

| Risk | Mitigation |
|------|------------|
| Burnout | Rotate moderator duties |
| Taking it personally | Remember: it's not about you |
| Imposter syndrome | Regular team check-ins |
| Isolation | Moderator private channel |

---

## Community-Led Growth

### Word-of-Mouth Tactics

| Tactic | How |
|--------|-----|
| **Referral program** | Rewards for invites that stick |
| **Share-worthy content** | Exclusive insights, early access |
| **Member spotlights** | Feature members → they share |
| **Success stories** | "I got a job through this community" |

### User-Generated Content

| Content Type | How to Encourage |
|--------------|------------------|
| **Tutorials** | "Share your setup in #show-what-you-built" |
| **Q&A threads** | Reward helpful answers |
| **Project showcases** | Monthly demo events |
| **Testimonials** | Ask happy members |

### Community Champions

Identify and empower super-users:

| Champion Type | Role |
|---------------|------|
| **Greeters** | Welcome new members |
| **Helpers** | Answer support questions |
| **Content creators** | Tutorials, videos, guides |
| **Event organizers** | Run community events |
| **Connectors** | Introduce people to each other |

---

## Community Metrics

### Health Dashboard

The thresholds below are the original author's starting points, not industry standards. Tell the user to adjust them to their own community.

| Metric | Healthy | Warning | Action Needed |
|--------|---------|---------|---------------|
| **Response time (support)** | <24h | 24-72h | >72h |
| **Unanswered questions** | <10% | 10-25% | >25% |
| **New member 7-day retention** | >40% | 20-40% | <20% |
| **Monthly active ratio** | >20% | 10-20% | <10% |
| **Moderator messages ratio** | <30% | 30-50% | >50% |

### Growth Metrics

| Metric | How to Track |
|--------|-------------|
| **Total members** | Platform analytics |
| **Join rate** | New members per week |
| **Churn rate** | Leaves per month |
| **Engagement depth** | Messages per active user |
| **Support success** | % questions resolved |

---

## Automation

### Useful Bots (Discord)

| Bot | Purpose |
|-----|---------|
| **MEE6 / Carl-bot** | Moderation, welcome messages, roles |
| **Statbot** | Analytics and metrics |
| **Ticket Tool** | Support ticket system |
| **GitHub Bot** | Repo activity notifications |
| **YAGPDB** | Advanced moderation, custom commands |

### Automation Ideas

| Automation | Benefit |
|------------|---------|
| Welcome DM | Consistent onboarding |
| Auto-role on join | Immediate access |
| Inactive member ping | Re-engagement |
| Support ticket creation | Organized help |
| GitHub notifications | Keep community informed |
| Scheduled posts | Regular engagement |

---

## Tools

| Tool | Use Case |
|------|----------|
| **[Octolens](https://octolens.com)** | Monitor community mentions across GitHub, Twitter, Reddit. Find where your community members talk about you. Track sentiment. Discover community content to amplify. |
| **Commsor** | Community operations platform |
| **Notion** | Community wiki and resources |
| **Luma** | Event management |
| **StreamYard/Restream** | Live event streaming |

---

## Related Skills

These names come from the original collection and are not in this folder. `developer-audience-context` is a short audience description: if the user has none, ask the four questions in "Before You Start". For open source projects, the AI Blocks item is the Open source promoter. If a named skill is missing, do the step in plain text or tell the user it is the next step. Never say you ran a skill you do not have.

- `developer-audience-context` — Know your community members
- `open-source-marketing` — OSS community building
- `developer-advocacy` — Personal brand in community
- `developer-newsletter` — Community digest content

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
