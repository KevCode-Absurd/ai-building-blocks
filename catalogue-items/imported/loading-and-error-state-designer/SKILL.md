---
name: ux-feedback
description: Add appropriate user feedback states (loading, success, error, empty) to a component or page
risk: critical
source: https://github.com/bitjaru/styleseed/tree/main/engine/.claude/skills/ss-feedback
source_repo: bitjaru/styleseed
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/bitjaru/styleseed/blob/main/LICENSE
---

# UX Feedback States Generator
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code, Cursor or Codex:** They can read and edit your project files, so the states land in your real code.
- **Any good chat AI:** You can paste one component and copy back the new code.
<!-- /needs -->

## When to Use

Use this skill when you need add appropriate user feedback states (loading, success, error, empty) to a component or page.


## When NOT to use

- For only the words inside a state: write the wording separately, then drop it into the states.
- For accessibility problems in states that already exist: run an accessibility review.
- For a brand-new component: build the component first, then come back here.
- For analytics or error-logging plumbing: this skill covers what the user sees only.
- For static content that loads nothing and saves nothing: it needs no states.

## Inputs

Ask once, in one message, for anything not given:
- The component or page code, or its path (required). If you cannot read the user's files, ask them to paste the code.
- What data it loads and what actions it runs, such as a fetch, a form submit or a delete (required if it is not clear from the code)
- The design style or component library in use (optional). Match what is already in the code.

If the code is missing, ask for it and stop. Never invent data fields, API names or components that are not in the code.

## Instructions

1. Read the target file and identify all data-dependent areas. Skip areas that load nothing and save nothing.

2. Look for a design-language or style file in the project (for example `DESIGN-LANGUAGE.md`, a Storybook, or a tokens file). If one exists, follow its rules for loading, empty and error states. If none exists, use the rules below and match the look already in the code.

3. For each data-dependent area, implement ALL 4 states.

The code examples below are React with Tailwind classes and are from the original author's design system. Names such as `bg-card`, `bg-surface-muted`, `text-text-secondary`, `EmptyState` and `Button` are examples. Swap in your own components and tokens. For another framework, keep the same rules and write the states in that framework.

### State 1: Loading (Skeleton)
```tsx
// Skeleton must match the final layout shape
<div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)]">
  <div className="flex items-center gap-2 mb-3">
    <div className="size-7 bg-surface-muted rounded-lg animate-pulse" />
    <div className="h-3 w-16 bg-surface-muted rounded animate-pulse" />
  </div>
  <div className="h-9 w-24 bg-surface-muted rounded-lg animate-pulse mb-3" />
  <div className="h-3 w-12 bg-surface-muted rounded animate-pulse" />
</div>
```
Rules:
- Wait 300ms before showing the skeleton, so fast loads skip it. Once it shows, keep it up for at least 300ms, so it does not flash.
- Use a soft pulse (1.5s cycle)
- Match skeleton shapes to real content dimensions
- Never use spinners inside cards

### State 2: Empty (Zero Data)
```tsx
<EmptyState
  icon={PackageIcon}
  title="No activity yet"
  description="Create your first project to get started."
  action={<Button>Create Project</Button>}
/>
```
Rules:
- Center-aligned in the card
- Icon: 32px, a quiet (tertiary) text color
- Title: 14px, a secondary text color
- Say why it is empty, and always suggest a next action
- Zero values show as "0" (don't hide or dash)

### State 3: Error (Load Failed)
```tsx
<div className="flex flex-col items-center justify-center py-8 text-center">
  <AlertCircle className="size-8 text-destructive mb-3" />
  <p className="text-[14px] text-text-secondary mb-4">Couldn't load the data</p>
  <Button variant="brandGhost" size="sm" onClick={retry}>Try again</Button>
</div>
```
Rules:
- Partial failure: only the affected card shows the error, the rest loads normally
- Full page failure: a full-screen empty-style message with retry
- Error message: plain language, blame the system, not the user
- Always provide a retry button

### State 4: Success (Action Feedback)
```tsx
// Toast notification for action confirmations
toast("Changes saved")

// With undo for destructive actions
toast("Item deleted", { action: { label: "Undo", onClick: handleUndo } })
```
Rules:
- Info toast: 3s display
- Action toast (with undo): 5s display
- If the app has a bottom navigation bar, place the toast above it
- One toast at a time (a new one replaces the old one)
- If the project has no toast component, use its existing alert or banner pattern. Do not add a new library without asking.

4. Implementation pattern:
```tsx
function DataCard({ data, isLoading, error }) {
  if (isLoading) return <DataCardSkeleton />
  if (error) return <DataCardError onRetry={refetch} />
  if (!data || data.length === 0) return <DataCardEmpty />
  return <DataCardContent data={data} />
}
```

5. Respect reduced motion. Turn off the pulse when the user prefers reduced motion.

6. Check your work. Re-read the changed code and confirm that each data-dependent area has all four states, that retry calls the real reload function, and that nothing else in the file changed. If you can run the app, test it with a slow request and a failed request.

## Output format

```
Changed: <file paths>
States added
| Area | Loading | Empty | Error | Success |
| <component or section> | <skeleton name> | <message and action> | <message and retry> | <toast text> |
Skipped: <areas with no data, and why>
Open questions: <wording you guessed, missing reload function, no toast component>
How to test: <how to force a slow, empty and failed load>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Interface microcopy writer](https://useaiblocks.com/skills/interface-microcopy-writer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
