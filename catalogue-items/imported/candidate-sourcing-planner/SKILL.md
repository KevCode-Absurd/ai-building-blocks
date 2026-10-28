---
name: sourcing-plan
description: Create a comprehensive sourcing strategy for a role - channels, communities, keywords, target companies
---

# Sourcing Plan Generator

Create a comprehensive, actionable sourcing plan for the specified role. The plan defines where to source, how to prioritize channels, which communities to target, and what the overall strategy should be.

**Input:** $ARGUMENTS - either a role name/description or a path to a JD file.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A persona** (yours): a buyer grounded in real review language: problem, trigger, wants, doubts, words they use.
- **The job description** (yours): the role's title, team, duties and level, as a job post or plain notes.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A persona** with the [Ideal candidate profiler](https://useaiblocks.com/skills/ideal-candidate-profiler). Bring the job description, a document (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a persona, the job description. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Process

### Step 1: Understand the Role

If $ARGUMENTS is a file path, read the JD. If it's a role name, ask clarifying questions:
- What level/seniority?
- What team/department?
- What location(s)?
- Any specific requirements?

Check `.claude/talent-sourcing.local.md` for company context, preferred channels, and existing templates. If that file is not there, ask the user to paste their company notes and preferred channels.

### Step 2: Ensure Candidate Persona Exists

A persona is required before building the sourcing plan. Check for `roles/[role-name]/persona.md`.

- **If persona exists:** Read it and use it to inform channel selection, company targeting, and messaging strategy.
- **If persona doesn't exist:** Flag this as a blocker. Ask the user to paste their candidate profile, or to build one first (for example with the ideal candidate profiler) before you go on. Do not build a persona inline.
- In a plain chat there is no `roles/` folder. Ask the user to paste the persona instead.

### Step 3: Identify Sourcing Channels

Rank channels by expected effectiveness for this specific role:

**Direct sourcing channels:**
- LinkedIn Recruiter / Sales Navigator
- TheOrg org charts (HIGH for sales/GTM and executive roles; public pages. Bulk scraping may break the site's terms, so read pages by hand)
- Xing (DACH market; requires account for deep search; HIGH for SME/Mittelstand)
- GitHub / GitLab (for technical roles)
- Portfolio sites (for design/creative roles)
- Google X-Ray across platforms (LinkedIn, GitHub, Stack Overflow, TheOrg, Xing). Search-engine searches only; do not scrape the results in bulk
- Employee directories (RocketReach, Apollo, ZoomInfo; name + title confirmation). These are paid services and need their own licence and personal-data checks
- Company career and team pages (leadership discovery, team sizing via open roles)
- Press, news, company blogs (push factors: layoffs, restructuring, new hires)

**Community channels:**
- Relevant Slack/Discord communities
- Reddit communities
- Professional associations
- Alumni networks

**Event channels:**
- Conferences and meetups
- Hackathons and competitions
- Webinars and workshops
- Industry trade shows

**Content channels:**
- Tech blogs and publications
- Podcast guests
- YouTube/Twitch creators
- Newsletter authors

**Referral channels:**
- Internal employee referrals
- External network referrals
- Alumni referrals from target companies
- Advisor/investor networks

### Step 4: Map Target Companies

Build a prioritized target company list as three circles. You do not need another skill for this. For a deeper map, use the Talent pool mapper.
- Circle 1: Direct competitors. Companies that sell to the same buyers or build the same product. List 5 to 10 the user names or you can name from what they told you.
- Circle 2: Adjacent companies. Same industry or customers, different product. List 5 to 10.
- Circle 3: Transferable talent sources. Companies in other sectors with the same skills or the same kind of job. List 3 to 5.
- For each company, note in one line why people there might move (size, pay, growth, recent news the user gave you). Do not invent news.

### Step 5: Define Search Strategy

For each prioritized channel:
- Specific search approach
- One sample search string per channel, built from the persona's titles, skills and locations. For example: ("job title" OR "similar title") AND (skill 1 OR skill 2) AND "city". Check the syntax on each platform.
- Expected volume and quality: say it is an estimate, based on the user's own past results if they have them. Never state a number as fact.
- Time investment estimate: hours per week for that channel (searching, reading profiles, noting leads). Add them up for the week and say if it fits the user's time.

### Step 6: Create Timeline

Sequence weekly activities by **company-fit tier**, not just by channel. Target companies where candidates are most likely to join (based on company-size fit, push factors, and comp positioning) in week 1, then expand to lower-probability pools in later weeks. This front-loads conversion rate and generates early pipeline momentum. Channel diversity still matters, but within each week, prioritize outreach to high-fit companies before broad sweeps.

Week-by-week sourcing plan:
- Week 1: [Highest-fit companies and channels, both primary geographies if parallel]
- Week 2: [Expansion to medium-fit companies, community channels]
- Week 3: [Community engagement]
- Week 4: [Assessment and pivot]

## Output

Generate a complete sourcing plan document and save it to the appropriate role directory. If a role directory doesn't exist, suggest creating one:

```
roles/[role-name]/sourcing-plan.md
```

### Sourcing Plan Structure

```markdown
# Sourcing Plan: [Role Title]
**Created:** [Date]
**Hiring Manager:** [If known]
**Target Start Date:** [If known]
**Priority:** [High/Medium/Low]

## Candidate Persona Summary
[Brief persona description]

## Channel Strategy

### Priority 1 (Start Immediately)
| Channel | Approach | Expected Yield | Time/Week |
|---------|----------|---------------|-----------|

### Priority 2 (Week 2+)
| Channel | Approach | Expected Yield | Time/Week |
|---------|----------|---------------|-----------|

### Priority 3 (If Needed)
| Channel | Approach | Expected Yield | Time/Week |
|---------|----------|---------------|-----------|

## Target Companies
[Concentric circle map]

## Search Strings
[Ready-to-use Boolean strings per platform]

## Weekly Plan
[Week-by-week activities]

## Success Metrics
- Target pipeline size: [number]
- Target response rate: [percentage]
- Target time-to-fill: [weeks]

## Risks & Mitigations
[Identified challenges and backup plans]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Candidate outreach drafter](https://useaiblocks.com/skills/candidate-outreach-drafter).
- The [Ideal candidate profiler](https://useaiblocks.com/skills/ideal-candidate-profiler).
- The [Talent pool mapper](https://useaiblocks.com/skills/talent-pool-mapper).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
