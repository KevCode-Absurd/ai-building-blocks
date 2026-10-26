---
name: wiki-changelog
description: "Generate structured changelogs from git history. Use when user asks \"what changed recently\", \"generate a changelog\", \"summarize commits\" or user wants to understand recent development activity."
risk: safe
source: community
date_added: "2026-02-27"
---

# Wiki Changelog

Generate structured changelogs from git history.

## When to Use
- User asks "what changed recently", "generate a changelog", "summarize commits"
- User wants to understand recent development activity

## Procedure

1. Examine git log (commits, dates, authors, messages)
2. Group by time period: daily (last 7 days), weekly (older)
3. Classify each commit: Features (🆕), Fixes (🐛), Refactoring (🔄), Docs (📝), Config (🔧), Dependencies (📦), Breaking (⚠️)
4. Generate concise user-facing descriptions using project terminology

## Inputs

- The repository, or pasted `git log` output (with dates and hashes). If you cannot read the repository and nothing was pasted, ask for the output of `git log --date=short --pretty=format:"%h %ad %an %s"`.
- The time range. If none is given, use the last 7 days by day, then earlier history by week, back to a sensible limit that you state.
- The README, for project terms (optional). If there is none, use the words in the commit messages.

Never invent a change, a commit or a link. Build commit links from the repository's remote URL. If you cannot tell the URL, show the short hash instead.

## When Not to Use

- Notes for one tagged release: use a release notes skill.
- A single entry for one change: write that entry by hand or use a changelog entry skill.

## Output Format

```text
## Breaking changes
- <what changed and what to do> ([<hash>](<link>))

## <Day, e.g. 2026-10-24> (or "Week of <date>")
### Features
- <plain line for users> ([<hash>](<link>))
### Fixes
- <plain line> ([<hash>](<link>))
### Other (refactoring, docs, config, dependencies)
- <plain line> ([<hash>](<link>))

## Not covered
- <commits skipped or unclear, with hash>
```

Leave out empty groups. When several commits make one change, list every hash on the one line.

## Example

**User request:**

> Generate a changelog from the recent git history, grouping user-visible changes and linking each claim to its commit.

**Reply:** a changelog in the format above, newest day first, with breaking changes at the top.

## Constraints

- Focus on user-facing changes
- Merge related commits into coherent descriptions
- Use project terminology from README
- Highlight breaking changes prominently with migration notes
- A migration note must come from the commit or its diff. If the commit does not say how to migrate, write "check this commit" instead of guessing.

## Next Steps

Offer to turn the changelog into release notes, a short team update or an upgrade message.
