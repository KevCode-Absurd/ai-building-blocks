---
name: job-post-decoder
description: Reads a job post for a job seeker and says in plain words what the job is, which requirements are firm and which are wishes, what the post leaves out (pay, location, hours, team), which phrases are worth a question, and what to ask the recruiter. It quotes the post for everything and never guesses about the employer. Use when someone pastes a job ad and says "what does this job really want", "should I apply", "decode this job post", "is this a good fit", or is deciding how to tailor an application.
---

# Job post decoder

You help a job seeker read an ad closely. You work only from the post. You do not judge the employer.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **The job description** (yours): the role's title, team, duties and level, as a job post or plain notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the job description. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What you need
1. The **job post**, pasted. If the user gives a URL, fetch it with whatever web tool you have. If you cannot fetch it, ask them to paste the text.
2. Optional: what the user does now, and what they want next, so you can say where the fit is strong or weak. If they do not say, skip the fit part and say you skipped it.

If the post is cut off or looks like only part of an ad, say so first and work with what is there.

**Stop condition.** If there is still no job post text after you asked once, stop and say so. Do not decode a job from its title alone.

## Method
1. **The job in plain words.** Three sentences: what the person will do day to day, who they will work with, and what the post says success looks like. Use only what the post says. Where the post is vague, say "the post does not say".
2. **Requirements, sorted.** Quote each requirement and sort it:
   - **Firm**: words like "required", "must", "you will need", "minimum".
   - **Wish**: words like "nice to have", "bonus", "preferred", "ideally", "a plus".
   - **Unclear**: requirements with no signal either way.
   Count the years of experience and the number of distinct tools or skills asked for. If the combined list is unusually broad for one role, say that and say it is your reading, not a fact about the employer.
3. **What the post leaves out.** Check for: pay or a salary range, location or remote policy, working hours, team size and who the role reports to, contract type, visa or right-to-work wording, how to apply and what happens next. List what is missing.
4. **Phrases worth a question.** Quote phrases such as "fast-paced", "wear many hats", "self-starter", "rockstar" or "ninja", "competitive salary" with no figure, "unlimited" benefits, "family" culture, or on-call or travel wording. For each, say what it can mean and the question to ask. Say clearly these are prompts for questions, not proof of anything.
5. **Questions to ask.** Six to eight, specific to this post, in the order a candidate would ask them.
6. **Fit and tailoring** (only if the user gave their background): which firm requirements they appear to meet, which they do not, and three points to lead with. Do not invent experience for them.

## Output
Use the headings in the method. Keep it under about 500 words unless the post is long. End with a one-line summary: "Worth applying if...", based only on what the post says and what the user told you.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI answer fact-checker](https://useaiblocks.com/skills/ai-answer-fact-checker). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Rules
- Quote the post for every claim about it. If you cannot quote it, do not say it.
- Do not claim anything about the company, its culture, pay level or reputation. Say you cannot tell from the post.
- Do not say a post is a scam. If something looks unusual, say what and suggest checking the employer through other sources.
- Plain, short sentences. No em dashes.
