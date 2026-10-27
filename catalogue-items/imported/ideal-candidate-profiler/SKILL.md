---
name: persona-research
description: This skill should be used when the user asks to "build a candidate persona", "create an ideal candidate profile", "define who we're looking for", "candidate motivations", "career patterns", "where do candidates hang out", "candidate persona", "ideal profile", or needs to develop a detailed picture of the target candidate beyond just skills and experience requirements.
---

# Persona Research for Recruiting Sourcing

## Purpose

Build detailed candidate personas that go beyond job descriptions. A persona captures not just skills and experience, but motivations, career patterns, online presence, community involvement, and decision-making factors. Personas guide sourcers on where to find candidates, how to engage them, and what resonates with them.

## Persona vs. Job Description

A job description defines **what the company needs**. A persona defines **who the person is**.

| Job Description | Candidate Persona |
|----------------|-------------------|
| 5+ years Python experience | Has been building data pipelines since 2019, progressed from analyst to engineer |
| Experience with distributed systems | Excited about scale problems, follows Kafka/Flink communities |
| Strong communication skills | Active on tech Twitter, writes blog posts, speaks at local meetups |
| Team player | Values collaborative culture, dislikes siloed organizations |

## Persona Components

### 1. Professional Profile

- **Current role & title** - What they're likely called today
- **Career trajectory** - Typical path that leads to this role
- **Years of experience** - Range, not a hard number
- **Education patterns** - CS degree? Bootcamp? Self-taught? PhD?
- **Industry background** - Which sectors have they worked in?
- **Company type history** - Startups? Enterprise? FAANG? Consulting?

### 2. Technical Identity

- **Core skills** - What they consider their primary expertise
- **Adjacent skills** - What they also know but may not lead with
- **Tools & technologies** - Specific tools in their daily workflow
- **Learning trajectory** - What they're currently learning or interested in
- **Technical opinions** - Strong preferences (e.g., "prefers Rust over C++")

### 3. Motivational Drivers

Understanding what makes candidates move is critical for sourcing strategy:

**Career motivations (what attracts them):**
- Technical challenge and complexity
- Impact and mission alignment
- Career advancement opportunity
- Compensation improvement
- Team and leadership quality
- Work-life balance and flexibility
- Learning and growth
- Autonomy and ownership

**Push factors (what makes them leave):**
- Limited growth or promotion ceiling
- Poor management or leadership
- Lack of technical challenge
- Below-market compensation
- Cultural issues or values misalignment
- Burnout or unsustainable pace
- Company instability (layoffs, pivots)
- Remote/return-to-office mandates

### 4. Online Presence & Community

Map where the target persona is active:

**Professional platforms:**
- LinkedIn profile style (detailed vs. minimal)
- GitHub activity (open source contributor? personal projects?)
- Portfolio or personal website
- Technical blog or Medium/Substack

**Community involvement:**
- Conferences attended or spoken at
- Meetup participation
- Open source project contributions
- Online forums (Stack Overflow, Reddit, HackerNews)
- Slack/Discord communities
- Twitter/X tech community

**Content consumption:**
- Podcasts they listen to
- Newsletters they subscribe to
- YouTube channels or courses they follow
- Books or thought leaders they reference

### 5. Decision-Making Profile

How this persona evaluates opportunities:

- **Research process** - Do they actively job search or wait to be approached?
- **Decision timeline** - How long from first contact to accepted offer?
- **Key decision factors** - Top 3 things that determine a yes/no
- **Red flags** - What immediately turns them off?
- **Influencers** - Who do they consult? (Partner, mentors, peers, online communities)
- **Counter-offer vulnerability** - How likely is their current employer to counter?

### 6. Transition Readiness

Describe what the role itself needs in pace, ambiguity and support, so the hiring team knows what to ask. Describe the role only. Do not rate people, or types of people, by company size, tenure, past employers or career path, and do not give any "friction" rating. Those things can stand in for age, national origin or other protected traits. Do not use this section for screening.

**Questions to ask about transition readiness:**
- What did you like about working in a small, fast-moving team? (Ask it. Do not guess from their history.)
- Which parts of this role's pace and ambiguity appeal to you?
- What would you need from us to do well in an early-stage setting?

These are questions for a conversation. Never use company size, past relocation, tenure, career gaps or career pattern to judge a person. Judge candidates on what the role needs, and what they tell you.

Include this section in the persona only as a list of what the role needs and questions to ask. Never as a rating of candidates.

## Persona Building Process

### Step 1: Analyze the Job Description

Extract the core requirements and translate into candidate attributes:
- Hard skills → Technical identity
- Soft skills → Behavioral patterns
- Experience requirements → Career trajectory
- Team context → Cultural fit indicators
- Identify the underlying problems this person solves
- Understand team context and dynamics
- Map seniority expectations to market reality


### Step 2: Interview the Hiring Manager

Key questions to ask (or infer from context):
- "Describe the best person you've worked with in this role"
- "What would make someone fail in this role?"
- "Where did your last successful hire come from?"
- "What's the team culture like?"
- "What career growth does this role offer?"

### Step 3: Research the Market

Do this part by hand, within each platform's terms of use. The AI cannot browse LinkedIn or communities for you, and you should not scrape them. Ask the AI to turn what you found into the persona.

- Review LinkedIn profiles of people currently in similar roles
- Read job postings from competitors for the same profile
- Browse relevant communities to understand the persona's world
- Check conference speaker lists and blog authors in the domain

### Step 4: Identify the Channels

   - Where does this persona spend time online?
   - What communities are they part of?
   - What events do they attend?
   - What content do they consume?

### Step 5: Build the Persona

Describe the role's needs only. Do not use tenure, company size, career gaps or relocation as signals about a person. Combine all inputs into a narrative persona document:
- Give the persona a name (e.g., "Senior SRE Sara") for team reference
- Write in present tense, describing a specific person
- Professional profile (career path, education patterns, company types)
- Technical identity (core and adjacent skills, tools, learning interests)
- Motivational drivers (what attracts, what repels, decision factors)
- Online presence (where they're active, how they present)
- Decision-making profile (how they evaluate opportunities)

### Step 6: Validate with Stakeholders

Share the persona with the hiring manager and team:
- Does this person sound like who they want to hire?
- Are the motivational drivers accurate?
- Are there community/channel insights they can add?
- Iterate based on feedback

## Output Format

## Persona Document Template

```markdown
# Candidate Persona: [Persona Name]
**Role:** [Target Role Title]
**Created:** [Date]

> **Everything below is an assumption.** Every habit, platform, community, event and motive in this persona is a guess built from the job description. Check each one with the hiring manager and with real profiles before you use it. Do not treat it as fact about a real market or a real person.

## Who They Are
[2-3 paragraph narrative description painting a vivid picture of this person.
Label this as an illustrative composite built from the job description, not a
real person or measured data. Include their typical day, what they care about,
and what their career looks like.]

## Professional Profile
- **Current title:** [Typical titles they hold now]
- **Experience:** [X-Y years total, Z+ years in core domain]
- **Career path:** [How they got here - typical trajectory]
- **Education:** [Common patterns - CS degree, bootcamp, self-taught, etc.]
- **Company background:** [Types of companies they've worked at]
- **Industry:** [Sectors they've been in]

## Technical Identity
- Core skills: [list]
- Tools: [list]
- Currently learning: [interests]

***Adjacent Skills (Frequently Co-occurring)***
[Skills they likely also have based on the core skill set]

## What Motivates Them

***Top Attractions (Why They'd Join)***
  1. [Most compelling factor]
  2. [Second factor]
  3. [Third factor]

***Push Factors (Why They'd Leave Current Role)***
  1. [Most common departure trigger]
  2. [Second trigger]
  3. [Third trigger]

***Decision Factors (How They Evaluate Offers)***
  1. [Primary decision criterion]
  2. [Secondary criterion]
  3. [Tertiary criterion]

***Red Flags (Immediate Turn-offs)***
  - [What makes them decline or disengage]

## Where to Find Them

***Online Platforms (By Presence Likelihood)***
1. [Platform + what their presence looks like there]
2. [Platform + typical activity]
3. [Platform + presence type]

***Communities***
- [Specific Slack/Discord communities]
- [Reddit communities]
- [Professional associations]

***Events***
- [Conferences they attend]
- [Meetups they might join]
- [Workshops/courses]

***Content They Consume***
- [Newsletters]
- [Podcasts]
- [Blogs/publications]
- [Thought leaders they follow]

## How to Engage

- **Best first-touch channel:** [Recommendation + list]
- **Messaging themes that resonate:** [What to emphasize]
- **What to avoid:** [Common mistakes in outreach to this persona]
- **Ideal timing:** [When they're most receptive]

## Counter-Offer Risk
[Assessment of how likely their current employer is to counter, and how
to mitigate]

## Alternative Personas
[If the pool is diverse, note 1-2 variant personas that could also
fill this role from a different background]

```

## Additional Resources

### Reference Files

You are **stongly encouraged** to read the reference files

- **`references/persona-templates.md`** - Complete persona templates for different role types (engineering, data/ML, product, design, GTM: sales/AE, SDR/BDR, product marketing, growth/demand gen, customer success, RevOps, partnerships/BD, executive)
- **`references/motivation-frameworks.md`** - Detailed frameworks for understanding candidate motivations and decision-making
