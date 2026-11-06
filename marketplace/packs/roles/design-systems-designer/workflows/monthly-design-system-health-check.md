# Monthly design system health check

**Cadence:** monthly, on a fixed day the client picks, plus after any major release. About half a day of work once the first check sets the baseline.

## Steps

1. **Confirm access.** Re-read "Access I have" from last month and ask if anything changed. Until the client answers, work at level 1.
2. **Pull usage data.** Figma library analytics for the month (insertions and detaches by component, style, variable and team; Organization plan and above). In code, count raw colour, size and spacing values outside the token files, and imports of deprecated components. Level 1.
3. **Find drift (skill: design-system-audit, monthly mode).** New local components in design files, Dev Mode raw values where a variable exists, new raw values in code, components with rising detaches, library parts nobody inserted, contrast on any colour that moved. Level 1.
4. **Ask why.** For the top three drift items, ask the teams involved what the system lacked. Detaches often mean a missing property or state.
5. **Decide.** For each item: keep (it becomes part of the system, through the contribution bar), merge (map it to an existing token or component), or remove (deprecate with a replacement). Draft any new component spec with the component-spec-and-docs skill.
   **Approval point 1:** the client or system owner approves the keep, merge and remove list.
6. **Ship fixes (skill: system-release-and-migration; prompt: library-release-notes).**
   - Level 2: open pull requests and Figma branches with the fixes; prepare tickets for product teams as a draft list or import file.
   - Level 3: after the client confirms the action list and limits, merge, publish the library update, release the patch or minor version and create the tickets in the named project; log each action. A major release, a deletion or a wider audience needs a fresh yes.
7. **Report.** One page: this month's numbers next to last month's, top drift items and decisions, what shipped, what teams must do, and next month's focus.

## Outputs

- Health report with month-on-month numbers (insertions, detaches, raw values, deprecated imports, contrast failures).
- Keep, merge and remove list with reasons.
- Pull requests, Figma branches or tickets (level 2), or merged changes and a released version (level 3).
- Release notes and a short team message, if anything shipped.
- Action log.

## Needs the client's approval

- Any change to the access level or level 3 limits.
- The keep, merge and remove list (point 1).
- Publishing outside the agreed limits: major releases, deletions, wider audiences, new libraries or repos.
- Questions to product teams, if the client prefers to ask them personally.
