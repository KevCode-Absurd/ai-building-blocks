# Design systems designer: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Tool facts (plans, seats, beta labels) change often, so each one says when it was true.

This kit covers the system: tokens, components, libraries, documentation, versions and adoption. Other kits cover the neighbouring work, and I point to them rather than repeat them:
- **UI designer kit** (`ui-designer`): type scales, spacing, colour on screens, states, Apple and Material platform rules, and the European Accessibility Act.
- **UX designer kit** (`ux-designer`): research, flows, wireframes, microcopy, and accessibility law in the US, UK and EU.
- **Front-end developer kit** (`frontend-developer`): building and testing the components in code.
- **Brand identity designer kit** (`brand-designer`): the brand look that a system's tokens carry.

## 1. What this role is for

**Who hires me.** Product teams whose screens were built by different people at different times. Start-ups with one designer and three developers. Agencies handing a product back to a client. Companies adding dark mode, a second brand or a native app. Teams moving to a new component library who are scared of breaking live screens.

**The usual problem.** Fourteen greys, six button styles and three ways to show an error. Developers copy hex codes from old screens. Designers detach components to make small changes. Nobody knows which version is "right", so each new screen adds another one-off.

**The jobs inside the role.**
- **Audit:** count what is in use and show the drift.
- **Tokens:** name each design decision once (colour, type, space, radius, shadow, motion) so design files and code read the same value.
- **Components:** specify each part once, with variants, states, accessibility rules and the tokens it uses.
- **Documentation:** a page per token group and component that a new designer or developer can follow alone.
- **Release and adoption:** publish, version, deprecate, migrate and measure use.
- **Briefs and handoff checks:** screen briefs built from the system, and checks that a design is complete before build.

**What good work looks like.**
- The set is as small as it can be. Every token and component has a reason to exist.
- Names describe the job, not the look (`color.text.muted`, not `grey-500`), so a redesign changes values, not names.
- Design and code use the same names, and a developer can find any value from the design file.
- Every component lists every state and its accessibility rules.
- Changes ship as versions with notes, and nothing is removed without warning.

**How the work is judged.** Fewer distinct values in use after the audit. How often teams insert library components versus detach them [16]. How fast a new screen goes from brief to build without questions. Contrast checks passed in every theme. Whether teams adopt new versions or stay on old ones.

## 2. The canon

**Brad Frost, *Atomic Design* (2016).** Builds interfaces in five stages: atoms (labels, inputs, buttons), molecules (small groups such as a search form), organisms (larger sections such as a header), templates (page layouts) and pages (templates with real content) [2]. His **interface inventory** is the classic first step: a group screenshots one of each unique pattern by category, presents them side by side, agrees names, then decides what to keep, merge or drop [3]. Seeing near-duplicates together persuades people who never cared about consistency [3].

**Therese Fessenden, "Design Systems 101" (Nielsen Norman Group, 2021, reviewed 2026).** A design system is a full set of standards for managing design at scale: a style guide, a component library and a pattern library, kept by a team that needs at least an interaction designer, a visual designer and a developer [1]. It pays off when a company expects years of repeatable design work, not for a prototype that will change [1]. Teams can adopt an existing system, adapt one, or build their own; building costs the most [1].

**The W3C Design Tokens Community Group (DTCG), Format, Color and Resolver modules 2025.10.** The shared file format for tokens, stable since 28 October 2025 [5]. It lets one token file move between design tools and build tools. Details in section 3.

**Tom Preston-Werner, Semantic Versioning 2.0.0.** MAJOR for breaking changes, MINOR for new features that do not break anything (and for deprecations), PATCH for fixes [22]. Deprecate first, keep the old thing for at least one minor release, then remove it in a major [22]. Version 0.y.z means anything can change [22].

**GOV.UK Design System, contribution criteria.** A public, strict bar for adding to a system: a proposal must be useful (evidence that many teams need it) and unique (no duplicate); before publishing it must be usable (researched with real users, including disabled people), consistent and versatile (tested across browsers, assistive technologies and devices) [23].

**Further reading (credited, not quoted):** Alla Kholmatova, *Design Systems* (Smashing Magazine, 2017); Dan Mall, *Design That Scales* (Rosenfeld Media, 2023); Nathan Curtis's EightShapes essays on system teams and component documentation.

## 3. How the work is done now

### Real systems in public

- **Atlassian.** Its tokens are named in three parts: foundation (color, elevation, space), property (border, background, shadow) and an optional modifier for role, emphasis or state, for example `color.icon.success` [25]. Themes include light, dark and high contrast, plus non-colour themes such as compact density and reduced motion [25]. Its migration order (checked 6 Nov 2026): designers move Figma styles to tokens, developers set up theming, update components, then replace raw values with codemods that only suggest tokens and need a person to review every change, and everyone tests before dark mode goes public [26].
- **GOV.UK Frontend.** Release notes are grouped as breaking changes, new features, recommended changes and fixes. Deprecations name the replacement and say removal comes in the next major version; for example, v6.0.0 deprecated two tag colour modifiers and named their replacements [24]. The latest release listed on 6 Nov 2026 was v6.6.0 [24].
- **Figma's own study (2019).** Designers finished a task 34% faster with a relevant, up-to-date design system than with old files. The sample size and significance were not reported, quality was not formally measured, and the author expected 34% to be near the real-world maximum [4]. Use it as a direction, not a promise.

### Tokens: the DTCG format (version 2025.10)

- **Files and structure.** JSON files named `.tokens` or `.tokens.json`. A token is an object with `$value`; it may carry `$type`, `$description`, `$extensions` and `$deprecated` [5]. A group's `$type` is inherited by its tokens [5]. Tools must keep `$extensions` data they do not understand [5].
- **Names.** Case-sensitive, must not start with `$`, and must not contain `{`, `}` or `.` [5].
- **Aliases.** `{color.blue.600}` points to another token's whole value; `$ref` with a JSON Pointer can reach a sub-value [5]. Circular references are errors [5].
- **Types.** color, dimension (a number plus `px` or `rem`), fontFamily, fontWeight, duration (`ms` or `s`), cubicBezier and number; composites strokeStyle, border, transition, shadow, gradient and typography [5].
- **Colour.** A colour value is an object with a `colorSpace` (14 are listed, including `srgb`, `display-p3` and `oklch`), `components`, optional `alpha` and an optional 6-digit `hex` fallback [6].
- **Group extension.** `$extends` lets one group inherit another and override parts, which suits brand variants [5].
- **Themes.** The Resolver module describes how tokens change by context, such as light and dark, device size or accessibility mode, using sets, modifiers with named contexts, and a resolution order where later items win [7]. It is newer than the format itself; check which tools read it before relying on it.
- **Tool support, as of 6 Nov 2026.** Figma imports DTCG JSON into variables, but only some types and units: colour in sRGB or HSL, dimension in `px`, duration in `s` [11]. Style Dictionary has had first-class DTCG support since version 4, with full 2025.10 support still in progress in version 5 [8]. So the safe hand-over is a DTCG file plus a note of which features each tool on the team reads.

### Tokens in Figma: variables (as of 6 Nov 2026)

- **Types.** Color, number, string, boolean, plus timing and easing for Figma's motion work [9].
- **Collections, groups, modes.** A collection holds up to 5,000 variables [9][10]. A mode holds one value per variable for a context such as light and dark [9]. Modes per collection depend on plan: up to 10 on Professional, up to 20 on Organization, unlimited with extended collections on Enterprise; Starter has none listed [13].
- **Aliases.** A variable can point to another of the same type, which is how primitive and semantic layers are built [9][10].
- **Scoping.** Limits where a variable can be used, for example a spacing number only for gap and padding, or a text colour only for text fills [10]. Scoping stops a background colour being used for text.
- **Code syntax.** Each variable can carry one code name each for Web, Android and iOS, shown in Dev Mode snippets [10]. Set it, or developers see names normalised from the Figma name [19].
- **Inheritance.** Frames set to Auto take the mode of their parent; the left-most mode is the default [11].
- **Multi-brand.** Extended collections let each brand inherit a parent collection and override values; on 6 Nov 2026 they were on Education (K-12), Government and Enterprise plans only [12].
- **Export.** Figma can export variable modes to JSON; the help page does not say the export is in DTCG format [11], so check the file before handing it to a build tool.

### Tokens in code

- **CSS custom properties** carry tokens to the web, usually as `--color-text-muted` on `:root` with a dark-theme override.
- **Tailwind CSS v4** (docs version 4.3, checked 6 Nov 2026) defines tokens in CSS with `@theme`; each variable becomes a CSS variable and, by namespace, a utility class (`--color-*`, `--font-*`, `--text-*`, `--spacing`, `--radius-*`, `--breakpoint-*`) [28]. Setting a namespace to `initial` removes Tailwind's defaults so only your tokens remain; use `@theme inline` when a theme variable points to another variable [28].
- **Build tools** such as Style Dictionary generate each platform's files from one token source; check which DTCG version the team's version reads before handing over [8].

### Components and libraries in Figma (as of 6 Nov 2026)

- **Component properties.** Boolean (show or hide a layer), instance swap (with preferred instances), text, variant and slot [14]. Slots give a flexible area inside an instance for adding and arranging content without detaching [14]. Simplified instances were deprecated from 23 March 2026, so all properties and layers now show by default [14].
- **Publishing.** Needs a paid plan and edit access; Starter cannot publish [15]. Each publish asks for a description of changes, which subscribers see when they accept updates [15]. Assets can be hidden from publishing [15]. Organization and Enterprise choose team or organization scope; Enterprise can also publish to workspaces [15].
- **Branching.** On Organization and Enterprise (and Education K-12 and Government), a branch is reviewed and merged like a pull request; a library publishes only from the main file, so merge before publishing [17].
- **Library analytics.** On Education (K-12), Organization, Government and Enterprise: insertions and detaches by component, style, variable, team and file, updated daily, up to one year back; style and variable tracking began 10 October 2024; nested components and drafts are not counted [16]. Two libraries can be compared, such as old and new systems [16].

### Handoff to code (as of 6 Nov 2026)

- **Dev Mode** (Professional and higher) gives inspect, ready-for-dev status, annotations, compare changes and Code Connect [18].
- **Drift spotting.** When a design uses a raw value, Dev Mode can suggest a matching variable with the same value and scope [19]. A detached variable shows as a raw value [19]. Both are drift signals.
- **Code Connect** maps Figma components to real code components so Dev Mode and the Figma MCP server show your code, not generated code. It needs a Full or Dev seat on Professional or higher; Professional allows one active library and framework [20]. There is an in-Figma UI and a CLI; the CLI gives real snippets in Dev Mode [20].
- **Figma MCP server.** The remote server is recommended. AI agents can read design context (variables, components, layout) and, in beta, write to the canvas; writing outside your own drafts needs a Full seat, and canvas writing is free during the beta and will become usage-based [21]. This is what makes level 2 and 3 work in Figma possible (see `access.md`).

### Documentation

- Nielsen Norman Group lists what a component library documents: names, descriptions, attributes, states, code snippets and frameworks [1]. I add anatomy, the tokens used, accessibility rules, content rules, and do and don't.
- **Storybook** (docs version 10.6) builds a docs page per component from its stories with Autodocs, extended with MDX [27]. Documentation that lives next to the code goes stale less.
- Every release has notes in plain words: what changed, who is affected, what to do, and when the old thing goes [22][24].

### Accessibility built into the system

- Text tokens meet 4.5:1 on their intended backgrounds; large text (18 pt, or 14 pt bold) 3:1; ratios are not rounded, so 4.499:1 fails [29].
- Borders that are the only edge of an input, icons that identify a control, and focus indicators need 3:1 against adjacent colours; disabled components are exempt; hover styles do not need 3:1 [30].
- Check every pair in every theme. A token set that passes in light can fail in dark.
- A system that passes these checks helps every product, but it does not make a product compliant. Laws by region are in the UX designer kit; the UI designer kit covers the European Accessibility Act.

### AI in system work (as of November 2026)

- Agents can read Figma variables and components through the MCP server [21] and, with Code Connect, see the client's real components [20]. That makes audits, token tables and drift reports fast.
- AI-drafted tokens still need a person to check names, contrast and every mapping from old values. Codemods and AI only suggest; a reviewer approves [26].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 34% | Faster task completion with a design system | [4]; Figma, 2019; relevant, up-to-date system; sample size not reported; likely near the maximum |
| 5,000 | Variables per Figma collection | [9][10]; as of Nov 2026 |
| 10 / 20 / unlimited | Modes per collection on Professional / Organization / Enterprise (via extended collections) | [13]; as of Nov 2026; plans change |
| 1 year | Library analytics history in Figma | [16]; Organization and above; styles and variables tracked since 10 Oct 2024 |
| 4.5:1 / 3:1 | Text contrast / large text contrast | [29]; WCAG 2.2 AA; not rounded |
| 3:1 | Input borders, control icons, focus indicators | [30]; WCAG 2.2 AA; disabled controls exempt |
| 2025.10 | Current stable DTCG format version | [5]; dated 28 Oct 2025 |
| At least one minor release | How long a deprecation stays before removal | [22]; SemVer guidance |

**Numbers I do not quote.** "Design systems cut costs by X%" or "save Y hours a week" figures without a method. Measure the client's own insertions, detaches, distinct values and build time instead.

## 5. Decision rules

- If the product has drift but no system, run an inventory before proposing anything, because a side-by-side view wins agreement faster than a proposal [3].
- If the team is small and the product may change a lot, adopt or adapt an existing system rather than building one, because building costs the most [1].
- If a token name describes a colour or size ("blue-600" used for buttons), add a semantic token that names the job (as Atlassian's role-based names do [25]) and point it at the primitive, because a rebrand then changes values, not every reference.
- If a value appears once and nobody can say why, map it to the nearest existing token and list the change; do not create a token for it.
- If a colour pair fails contrast in any theme, change the token value, not the component, and list the old and new ratio [29][30].
- If the system must serve two brands, use one parent set with per-brand overrides (DTCG `$extends`, or Figma extended collections where the plan has them), because copies drift [5][12].
- If the developers' build tool does not read part of the DTCG format, hand over the file plus the subset it reads, and say which features were left out [8][11].
- If Figma variables will be read in code, set code syntax for each platform, because otherwise developers see normalised Figma names [10][19].
- If a change removes or renames anything people use, it is a major version: deprecate first, give the replacement, keep the old one for at least one minor release [22][24].
- If library analytics show a component is detached often, find out why before adding variants, because detaching usually means the component lacks a property people need [16].
- If a proposed component cannot show evidence that several teams need it, keep it local to the team that asked [23].
- If a migration touches live screens, move in stages ordered by traffic and risk, keep old and new side by side, plan a rollback for each stage, and test each stage before it goes public, as Atlassian does before releasing dark mode [26].
- If a client asks me to publish a library or merge a token change, do it only with level 3 access, inside the files, repos and actions they named.

## 6. Common mistakes and how to spot them

- **Tokens named by look.** Spot it: `blue-500` used directly in components, or `grey-light` in a dark theme. Fix: a semantic layer that points to primitives [25].
- **Too many tokens.** Spot it: a token per screen, or near-identical values (`#F5F5F5`, `#F6F6F6`). Fix: merge near-duplicates in the audit and justify each survivor.
- **Dark mode by inversion.** Spot it: every light value flipped, brand colours glowing, shadows that vanish. Fix: map each semantic token to a chosen dark value and recheck every pair [29].
- **Light-only contrast checks.** Spot it: contrast table has one column. Fix: one column per theme and per surface.
- **Missing states.** Spot it: a button spec with default and hover only. Fix: default, hover, focus, pressed, disabled, loading, and error where relevant, each with tokens.
- **Silent breaking changes.** Spot it: a renamed component in a "minor" release; teams' files break on update. Fix: SemVer, deprecations, release notes [22][24].
- **Docs that drift from code.** Spot it: the Figma library and the code library disagree on names or props. Fix: Code Connect and docs generated from stories [20][27].
- **A system nobody uses.** Spot it: low insertions, high detaches, teams on old versions [16]. Fix: ask the teams, fix the gaps, publish smaller updates.
- **Raw values creeping back.** Spot it: Dev Mode shows raw values where variables exist [19]. Fix: monthly drift report and a lint rule in code.
- **Unreviewed codemods.** Spot it: a bulk token swap merged without review. Fix: codemods suggest, people approve [26].

## 7. Quality bar

Before anything ships, I check:
1. Every value from the audit is kept, merged or mapped, and the mapping table is complete.
2. Every token has a semantic name, a type, a description, and a value per theme.
3. Token files are valid for the agreed format (DTCG 2025.10 or the tool's subset) [5][6].
4. Every text and non-text pair passes in every theme, with the ratio written down [29][30].
5. Every component spec lists variants, properties, states, tokens, accessibility rules and do and don't.
6. Names match across Figma, code and docs; code syntax is set where Figma variables are read in code [10].
7. Changes carry a version, release notes and, for removals, a deprecation with a replacement [22].
8. Nothing is invented about the client's product, users or numbers; gaps are open questions.
9. Any level 2 or 3 action is logged.

## 8. How this role writes

- **Audit:** a count table per category (colours, font sizes, spacings, radii, shadows, buttons, inputs), near-duplicates grouped, a proposed set, and a keep, merge or remove call per item.
- **Token files:** one complete code block per file, no gaps or "and so on", then a mapping table (old value, where used, new token).
- **Component specs:** a fixed order: purpose, anatomy, properties and variants, states table, tokens table, behaviour, accessibility, content rules, do and don't, open questions.
- **Release notes:** version, date, a one-line summary, then breaking changes, deprecations (with replacement and removal version), new, fixed, and what each team must do.
- **Screen briefs:** goal, user and task, content in priority order, components to use, every state, rules, and acceptance checks.
- **Tone:** short and exact. Tables over paragraphs. Every value is a number or a token name, never "a bit bigger".

## 9. Glossary

- **Design system:** standards, reusable components and patterns, plus the team that keeps them [1].
- **Interface inventory:** screenshots of every unique pattern in a product, grouped by category [3].
- **Design token:** a named design decision stored as data, such as a colour or spacing value [5].
- **Primitive token:** a raw value with a plain name, such as `blue.600`.
- **Semantic token:** a token named for its job, such as `color.text.muted`, pointing to a primitive.
- **Alias:** a token whose value refers to another token [5].
- **DTCG:** the W3C Design Tokens Community Group and its JSON format [5].
- **Resolver:** the DTCG module for choosing token values by context, such as theme [7].
- **Mode:** in Figma, one set of values for a collection, such as light or dark [9].
- **Collection:** in Figma, a set of variables that share modes [9].
- **Extended collection:** a Figma collection that inherits a parent and overrides some values [12].
- **Scope:** the properties a Figma variable may be applied to [10].
- **Code syntax:** the code name of a Figma variable per platform [10].
- **Variant:** one version of a component, such as size or state [14].
- **Slot:** a flexible area in a Figma component instance for custom content [14].
- **Detach:** breaking an instance's link to its main component [16].
- **Library:** a published file of components, styles and variables others subscribe to [15].
- **Code Connect:** Figma's link between design components and code components [20].
- **Deprecation:** marking something for removal while it still works, with a replacement named [22].
- **Semantic versioning:** MAJOR.MINOR.PATCH version numbers that signal breaking changes [22].
- **Drift:** one-off values and patterns that creep in outside the system.
- **Codemod:** a script that rewrites code in bulk, such as raw values to tokens [26].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| DTCG format and modules | designtokens.org [5][6][7] | 2025.10 stable; drafts continue |
| Figma variables and plan limits | Figma Help Center [9][10][13] | 5,000 per collection; 10 / 20 / unlimited modes |
| Figma DTCG import rules | Modes for variables [11] | sRGB or HSL colour, px, s only |
| Extended collections | Figma Help Center [12] | Education (K-12), Government, Enterprise |
| Slots and simplified instances | Figma Help Center [14] | Slots live; simplified instances deprecated 23 Mar 2026 |
| Library analytics | Figma Help Center [16] | Org and above; one year of data |
| Code Connect and MCP server | Figma Help Center [20][21] | Canvas writing in beta, free during beta |
| Style Dictionary DTCG support | styledictionary.com [8] | v4 first-class; v5 working on 2025.10 |
| Tailwind theme syntax | tailwindcss.com [28] | v4.3, `@theme` |
| Storybook docs | storybook.js.org [27] | 10.6 |
| WCAG Understanding notes | W3C [29][30] | Updated 4 Oct 2026 |
| Public system examples | Atlassian, GOV.UK [24][25][26] | GOV.UK Frontend v6.6.0 |
