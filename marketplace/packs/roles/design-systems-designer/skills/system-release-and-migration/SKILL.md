---
name: system-release-and-migration
description: Plans and ships changes to a design system safely - picks the version number with Semantic Versioning, writes release notes and deprecations, publishes the Figma library and code package within the client's limits, and plans a staged migration from an old system or old tokens with risks, checks and a rollback for each stage. Use it before any release that renames or removes something, when moving screens to a new system or token set, or when teams are stuck on old versions.
---

# System release and migration

## When to use

- A token, component or prop is being renamed, changed or removed.
- The product is moving from an old component library or hard-coded values to a new system.
- Teams ignore library updates or stay on old package versions.
- The client wants a release routine: what goes in a version, who approves, how teams hear about it.

## What you need

1. **The change list:** what is new, changed, deprecated or removed, in design and in code.
2. **Where things are used:** library analytics (insertions and detaches by team and file, Organization plan and above), a code search, or a list of screens.
3. **The release setup:** Figma plan (branching and analytics depend on it), package registry, docs site, how teams hear about releases today.
4. **Constraints:** release dates, platforms, frozen periods, who approves.
5. **Access I have:** the level per tool. Until the client answers, work at level 1. Publishing a library or merging a release needs level 3 within the client's limits.

## Steps

### A. A release

1. **Sort each change** into breaking (rename, removal, changed default, changed behaviour), feature (new token, component, variant, prop) or fix.
2. **Pick the version.** Any breaking change: major. Features or deprecations only: minor. Fixes only: patch. While the system is 0.y.z, warn teams that anything can change.
3. **Deprecate before removing.** For each removal or rename: mark it deprecated (DTCG `$deprecated` with a message naming the replacement, a "Deprecated" label on the Figma component, a code warning), name the replacement, and give the version that will remove it. Keep it for at least one minor release.
4. **Write the release notes** in plain words: version, date, summary, breaking changes with what to do, deprecations with replacement and removal version, new, fixed. Write the same summary as the Figma publish description so designers see it when they accept updates.
5. **Prepare the files.** Level 2: in Figma, work in a branch (Organization plan and above) or a copy; in code, open a pull request with changes, notes and a version bump. Ask for review.
6. **Publish.** Level 3 only, after the client confirms the action list and limits: merge the Figma branch (libraries publish only from the main file), publish the library with the description, merge the pull request, tag the version, publish docs. A major release outside the agreed limits needs a fresh yes. Log each action.
7. **Tell teams.** A short post: what changed, who must act, by when, and where to ask.

### B. A migration

1. **Inventory what is in use**: components, tokens and raw values, with counts by screen or team.
2. **Write a replacement rule per old item**: old item, new item, property mapping, anything that has no direct replacement and needs a design decision.
3. **Order the work** by traffic and risk: low-risk, high-reuse items first (tokens, buttons), complex or rarely used parts later. Never start with the checkout or sign-up path.
4. **Plan stages.** Each stage: scope, owner, checks (visual comparison, contrast in every theme, keyboard and screen reader smoke test), success measure, and a rollback (revert the pull request, re-publish the previous library version, or switch the theme flag back).
5. **Run old and new side by side.** Keep the old library or theme available until the stage passes. Use codemods or search-and-replace only as suggestions; a person reviews every change.
6. **Measure adoption.** Compare insertions of old and new libraries in Figma analytics, and count remaining old imports or raw values in code.
7. **Retire the old system** only when counts reach the agreed level, with a final major release and notice.

## Checks

- Every breaking change has a major version, a deprecation period and a named replacement.
- Release notes exist in both places (Figma publish description, changelog).
- Every migration stage has checks and a rollback.
- No deletion of components, variables, collections or branches without a fresh yes from the client, even at level 3.
- Adoption numbers come from analytics or code search, not guesses.
- Every level 2 or 3 action is logged.

## Output format

**Release:** version and reason; release notes; publish description; action list for approval; action log.

**Migration:** inventory table; replacement rules table; stage plan (stage, scope, owner, checks, success measure, rollback, date); adoption tracking table; risks; action log.

## Example of good output (short)

*Copperline Fitness is a made-up gym booking app used only to show the format. Access I have: level 2 in GitHub and Figma; level 3 for minor and patch releases only.*

**Version 4.0.0** (major: two removals). Release date set by the client.

- **Breaking:** `color.brand.green` removed. Use `color.action.primary`. `Tag` prop `tone="success"` renamed `tone="positive"`.
- **Deprecated (removed in 5.0.0):** `Card` variant `flat`. Use `Card` with `elevation="none"`.
- **New:** `color.focus.ring`; `Button` loading state.
- **Fixed:** `color.text.muted` in dark mode on raised surfaces changed from #737B86 (3.82:1, failed) to #A9B1BC (7.56:1) on #1C2026.

Action list for approval: (1) merge Figma branch "v4" into the library file; (2) publish with the description above; (3) merge pull request #212 and tag v4.0.0. Because 4.0.0 is a major release, it is outside my level 3 limits: I need a fresh yes before steps 1 to 3.

**Migration stage 2 of 4:** buttons on class schedule screens (9 screens). Check: visual comparison, focus ring visible, contrast in light and dark. Rollback: revert pull request #215.
