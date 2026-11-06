# From agreed wireframe to build-ready screens

**Trigger:** a flow or feature has agreed wireframes (or a clear screen list) and needs its visual design specified before build. Usually one to three weeks of elapsed time for a handful of screens, most of it review rounds.

## Steps

1. **Intake and access (access.md questions).** Confirm platforms, breakpoints, dark mode, brand rules, the main task, and any accessibility level named in a contract or law. Ask which access level the client grants in each tool (design file, repo, site builder, issue tracker) and record it as "Access I have". Until they answer, work at level 1.
2. **Foundations (skill: ui-foundations-and-component-sheet; prompt: type-scale-from-brand).** If the product has none, set type, spacing, grid, colour roles, radius and elevation, plus a component style sheet for the parts these screens use. If a design system exists, read it and list gaps.
   - Level 2: build styles, variables (light and dark modes) and a component sheet in a "DRAFT" page or branch of the Figma file.
   **Approval point 1:** the client agrees the foundations and component sheet.
3. **Contrast and dark mode (skill: contrast-and-dark-mode-check).** Every pair in both themes, with fixes. Level 1; level 2 to add the modes in Figma.
4. **Screen specs (skill: screen-visual-spec; prompt: states-matrix-for-a-component for any new part).** Reading order, element tables, every state, every breakpoint, dark mode. For iOS or Android, run the platform-fit-check prompt.
   - Level 2: annotate frames in the "DRAFT" page or branch.
   **Approval point 2:** the client signs off the screens, including states and dark mode.
5. **Handoff (prompt: developer-handoff-notes).** Notes per screen with units, tokens, states, breakpoints and open questions.
   - Level 2: open a pull request with theme or CSS variable changes; prepare build tickets as a draft list or import file.
   - Level 3: after the client confirms the action list and limits, move the approved frames into the shared file pages they named, merge the approved theme pull request, and create the tickets; log each action.
6. **Build check (skill: ui-review-before-after).** When the developer has built the screens, compare with the spec and write before-and-after notes for any difference.
   **Approval point 3:** the client decides which differences must be fixed before launch.

## Outputs

- Foundations sheet and component style sheet (or a gap list against the existing system).
- Contrast table and dark mode role map.
- Screen specs with every state and breakpoint.
- Developer handoff notes and build tickets.
- Post-build review with before-and-after notes.
- Action log of every change made in the client's tools (level 2 or 3).

## Needs the client's approval

- The access level for each tool, and the limits for level 3 (files, screens, repos, sites, kinds of change, dates).
- Foundations and component sheet (point 1).
- Final screens including states and dark mode (point 2).
- Which post-build differences to fix (point 3).
- A fresh yes each time for deleting frames, pages, components or styles, or for changing screens outside the named set.
- Any new font or icon licence, which the client buys.
