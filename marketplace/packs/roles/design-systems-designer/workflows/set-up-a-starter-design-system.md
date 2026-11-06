# Set up a starter design system

**Trigger:** a product with drift and no system, or a team about to add dark mode, a second brand or a native app. Usually four to eight weeks of elapsed time for tokens, the core components and docs, depending on review speed.

## Steps

1. **Intake and access (access.md questions).** Confirm platforms, framework, Figma plan, where values live today, who approves, and the main user task. Ask which access level the client grants in each tool (Figma, token tool, docs, repo, issue tracker) and record it as "Access I have". Until they answer, work at level 1.
2. **Audit (skill: design-system-audit).** Inventory, counts, near-duplicate groups, keep, merge or remove calls, and component gaps. Level 1; level 2 if the client wants the inventory board in their Figma file or FigJam.
   **Approval point 1:** the client agrees the proposed smaller set and the ranked fix list.
3. **Tokens (skill: design-token-set; prompt: dark-mode-from-light-palette if needed).** Primitives, semantic tokens, themes, contrast table and the mapping from every old value. Output in the formats the team's tools read.
   - Level 2: open a pull request with the token files; build the variables in a branch or "DRAFT" page of the Figma file.
   - Level 3: after the client confirms the action list and limits, merge the approved pull request and publish the library update; log each action.
   **Approval point 2:** the client approves token names, theme values and the contrast table before anything goes live.
4. **Core components (skill: component-spec-and-docs).** Start with the parts on the main task path: button, input, select, checkbox and radio, link, alert, card, modal. One spec and docs page each, mapped to Figma properties and code props. Same levels as step 3.
5. **Docs.** A home page (what the system is, how to get it, how to ask for changes), a page per token group and per component, and a contribution page with the bar a new component must meet (evidence that several teams need it, research, accessibility testing). Level 2: unpublished pages or a docs branch. Level 3: publish within limits.
6. **First release (skill: system-release-and-migration; prompt: library-release-notes).** Version 1.0.0 when the client agrees the system is stable enough for teams to depend on; until then 0.y.z with a warning that anything may change.
   **Approval point 3:** the client approves the release notes and the publish action list.
7. **Adoption plan.** Pick one team and one flow to move first, set the measure (library insertions and detaches, remaining raw values in code), and agree a monthly check (workflow: monthly-design-system-health-check).

## Outputs

- Audit report with counts and the agreed smaller set.
- Token files (DTCG JSON plus the team's formats), contrast table and mapping table.
- Component specs and docs pages for the core set.
- Version 0.y.z or 1.0.0 release notes and team message.
- Adoption plan with measures.
- Action log of every change made in the client's tools (level 2 or 3).

## Needs the client's approval

- The access level for each tool, and the limits for level 3 (files, libraries, repos, docs spaces, kinds of release, dates).
- The smaller set from the audit (point 1).
- Token names, theme values and contrast results (point 2).
- Release notes and publish actions (point 3).
- A fresh yes each time for deleting anything, for a major release outside the limits, and for publishing to a wider audience.
- Plan upgrades or new seats: the client decides and buys; I can prepare the comparison.
