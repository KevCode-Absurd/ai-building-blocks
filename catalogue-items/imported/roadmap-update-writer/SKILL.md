---
name: roadmap-communicator
description: Use when preparing roadmap narratives, release notes, changelogs, or stakeholder updates tailored for executives, engineering teams, and customers.
---

# Roadmap Communicator

Create clear roadmap communication artifacts for internal and external stakeholders.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.
- **A shortlist** (yours): the selected options, with the reasons and criteria used.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan, a shortlist. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude or ChatGPT:** Either can write the updates. Neither can read your git history, so paste the commits or run the script yourself.
- **Git and Python 3:** Needed only if you want the changelog script to read your git history.
<!-- /needs -->

## When To Use

Use this skill for:
- Building roadmap presentations in different formats
- Writing stakeholder updates (board, engineering, customers)
- Producing release notes (user-facing and internal)
- Generating changelogs from git history
- Structuring feature announcements

## When Not To Use

- The person wants sprint status or a single ticket update: use their project tracker or the Sprint plan writer.
- The person wants release notes from commits only, with a version bump: use the Release notes writer.
- The person wants a changelog from git history only: use the Changelog writer.
- The person wants to rewrite a feature list as goals: use the Feature roadmap to outcomes rewriter.
- The person has no plans yet. This skill formats and explains plans. It does not decide them.

## Inputs

Ask once for anything missing. If the person cannot answer, mark it MISSING in the output and carry on. Never invent initiatives, dates, owners, metrics or commits.

1. The plans: initiatives, features or a roadmap draft, with any dates, owners and status the person has.
2. The audience: executives or board, engineering, customers, or more than one.
3. What to produce: a roadmap story, a stakeholder update, release notes, a changelog, a feature announcement, or a mix.
4. Optional: a release date or version range, and the git history or list of commit messages for a changelog.

## Steps

1. Read the plans. List what is committed, what is only planned and what has no date. Do not turn a hope into a promise.
2. Choose the roadmap format (see below) from how certain the plans are, and say why in one line.
3. Write the update for each audience (see below). Write one version per audience; do not blend them.
4. For release notes, choose user-facing or internal and use the templates in `references/communication-templates.md`.
5. For a changelog, run the script if the person's AI can run Python and git (see below). Otherwise, ask the person to paste commit subjects and group them by prefix yourself.
6. Check every piece against the quality checklist at the end. Fix any item that fails.

## Output

Return only the pieces the person asked for, in this order, under the headings below. Keep each under about 400 words.

1. **Format choice**: the roadmap format and why, in one or two lines.
2. **Roadmap story**: the plans in that format, using `references/roadmap-templates.md`.
3. **Update**: one version for each audience named.
4. **Release notes**: user-facing or internal, using the templates.
5. **Changelog**: grouped by type of change, in markdown or plain text.
6. **Missing**: every input marked MISSING and how it limits the update.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product feedback roadmap reviewer](https://useaiblocks.com/skills/weekly-product-feedback-triager). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Roadmap Formats

1. Now / Next / Later
- Best for uncertainty and strategic flexibility.
- Communicate direction without false precision.

2. Timeline roadmap
- Best for fixed-date commitments and launch coordination.
- Requires active risk and dependency management.

3. Theme-based roadmap
- Best for outcome-led planning and cross-team alignment.
- Groups initiatives by problem space or strategic objective.

See `references/roadmap-templates.md` for templates.

## Stakeholder Update Patterns

### Board / Executive
- Outcome and risk oriented
- Focus on progress against strategic goals
- Highlight trade-offs and required decisions

### Engineering
- Scope, dependencies, and sequencing clarity
- Status, blockers, and resourcing implications

### Customers
- Value narrative and timing window
- What is available now vs upcoming
- Clear expectation setting

See `references/communication-templates.md` for reusable templates.

## Release Notes Guidance

### User-Facing Release Notes
- Lead with user value, not internal implementation details.
- Group by workflows or user jobs.
- Include migration/behavior changes explicitly.

### Internal Release Notes
- Include technical details, operational impact, and known issues.
- Capture rollout plan, rollback criteria, and monitoring notes.

## Changelog Generation

This step needs git and Python 3 on the person's own computer. A chat AI cannot run it. If the person has them, ask them to run:
```bash
python3 scripts/changelog_generator.py --from v1.0.0 --to HEAD
```
and paste the result. Replace `v1.0.0` with their real start tag or commit.

Features:
- Reads git log range
- Parses conventional commit prefixes
- Groups entries by type (`feat`, `fix`, `chore`, etc.)
- Outputs markdown or plain text
- Also runs with `--stdin` on pasted commit subjects, or `--demo` for sample output

No git or Python? Ask the person to paste commit subjects, one per line, and group them by prefix in the chat. Commits with no prefix go under "Other". Never invent commits.

## Feature Announcement Framework

1. Problem context
2. What changed
3. Why it matters
4. Who benefits most
5. How to get started
6. Call to action and feedback channel

## Communication Quality Checklist

- [ ] Audience-specific framing is explicit.
- [ ] Outcomes and trade-offs are clear.
- [ ] Terminology is consistent across artifacts.
- [ ] Risks and dependencies are not hidden.
- [ ] Next actions and owners are specified.
