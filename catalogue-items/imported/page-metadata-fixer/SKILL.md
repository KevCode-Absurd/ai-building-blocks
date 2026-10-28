---
name: fixing-metadata
description: "Audit and fix HTML metadata including page titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, favicons, JSON-LD structured data, and robots directives."
risk: critical
source: https://github.com/ibelick/ui-skills/tree/main/skills/fixing-metadata
source_repo: ibelick/ui-skills
source_type: community
date_added: 2026-07-01
license: MIT # AI Blocks: this is the author's own header, kept as written. sickn33's collection shares this copy under CC BY 4.0 (see LICENSE-CONTENT).
license_source: https://github.com/ibelick/ui-skills/blob/main/LICENSE
---


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
- **Claude Code:** Reads your whole project and makes small, scoped edits to the right files.
- **Any good chat AI:** Works well if you paste in the head section of a few pages.
<!-- /needs -->

## When not to use (added by AI Blocks)

- You want new title and description wording that wins clicks. Use the Title and meta tag writer, then come back here to place the tags.
- You want a full SEO review of page content, speed and links. Use the SEO auditor or the Technical SEO auditor.
- Your pages have no public web address yet. Social and search checks need a live address, so put them online first.

## Before you run it (added by AI Blocks)

Ask once for anything missing. Never invent it.

0. Start by asking for the site code or head sections, and the live domain, before you run the audit.
1. The pages to check: the site code, the page's HTML, or the page addresses. If you only have addresses and cannot open them, ask for the HTML of the head section.
2. The live domain, for absolute addresses in canonical and share-card tags. If it is missing, write `<DOMAIN>` in the fix and say so.
3. Wording the person wants for titles and descriptions (optional). If none, keep the existing wording and flag weak or missing ones rather than writing new claims.

Do not invent ratings, reviews, prices or organisation details in structured data. Mark anything you could not check as "not checked".

## Output (added by AI Blocks)

Return these parts, in this order:

1. **Audit table.** One row per page and tag: found, missing, duplicated or clashing, with the priority from the rules below.
2. **Fixes.** The smallest code change for each problem, shown as the exact tag or line, grouped by file. Touch metadata only.
3. **Agreement check.** Whether the title, description, canonical address and og:url match for each page.
4. **Not checked.** Anything you could not verify, such as how a share card renders on a live address. If the site is offline, say so and tell the person to run the share-card check after launch.

Then give a next step: publish, paste the live address into each social platform's preview checker, and request a re-index in Google Search Console if the canonical changed.

## Licence note (added by AI Blocks)

Added by AI Blocks. Licence: this skill follows the MIT licence in its original header and the included LICENSE file. Keep the source notices and author credits. We also retain the collection's LICENSE-CONTENT file.

## When to Use

Use this skill when you need audit and fix HTML metadata including page titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, favicons, JSON-LD structured data, and robots directives. Use when adding SEO metadata, fixing social share previews, reviewing Open Graph tags, setting up canonical URLs, or checking robots directives.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Link preview fixer](https://useaiblocks.com/skills/link-preview-fixer).
- The [SEO auditor](https://useaiblocks.com/skills/seo-auditor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Workflow

1. Identify pages with missing or incorrect metadata (titles, descriptions, canonical, OG tags)
2. Audit against the priority rules below — fix critical issues (duplicates, indexing) first
3. Ensure title, description, canonical, and og:url all agree with each other
4. Verify social cards render correctly on a real URL, not localhost. This needs the page to be online. If the site is not published yet, say "not checked" and ask the user to run this step after launch.
5. Keep diffs minimal and scoped to metadata only — do not refactor unrelated code
## when to apply

Reference these guidelines when:
- adding or changing page titles, descriptions, canonical, robots
- implementing Open Graph or Twitter card metadata
- setting favicons, app icons, manifest, theme-color
- building shared SEO components or layout metadata defaults
- adding structured data (JSON-LD)
- changing locale, alternate languages, or canonical routing
- shipping new pages, marketing pages, or shareable links

## rule categories by priority

| priority | category | impact |
|----------|----------|--------|
| 1 | correctness and duplication | critical |
| 2 | title and description | high |
| 3 | canonical and indexing | high |
| 4 | social cards | high |
| 5 | icons and manifest | medium |
| 6 | structured data | medium |
| 7 | locale and alternates | low-medium |
| 8 | tool boundaries | critical |

## quick reference

### 1. correctness and duplication (critical)

- define metadata in one place per page, avoid competing systems
- do not emit duplicate title, description, canonical, or robots tags
- metadata must be deterministic, no random or unstable values
- escape and sanitize any user-generated or dynamic strings
- every page must have safe defaults for title and description

### 2. title and description (high)

- every page must have a title
- use a consistent title format across the site
- keep titles short and readable, avoid stuffing
- shareable or searchable pages should have a meta description
- descriptions must be plain text, no markdown or quote spam

### 3. canonical and indexing (high)

- canonical must point to the preferred URL for the page
- use noindex only for private, duplicate, or non-public pages
- robots meta must match actual access intent
- previews or staging pages should be noindex by default when possible
- paginated pages must have correct canonical behavior

### 4. social cards (high)

- shareable pages must set Open Graph title, description, and image
- Open Graph and Twitter images must use absolute URLs
- prefer correct image dimensions and stable aspect ratios
- og:url must match the canonical URL
- use a sensible og:type, usually website or article
- set twitter:card appropriately, summary_large_image by default

### 5. icons and manifest (medium)

- include at least one favicon that works across browsers
- include apple-touch-icon when relevant
- manifest must be valid and referenced when used
- set theme-color intentionally to avoid mismatched UI chrome
- icon paths should be stable and cacheable

### 6. structured data (medium)

- do not add JSON-LD unless it clearly maps to real page content
- JSON-LD must be valid and reflect what is actually rendered
- do not invent ratings, reviews, prices, or organization details
- prefer one structured data block per page unless required

### 7. locale and alternates (low-medium)

- set the html lang attribute correctly
- set og:locale when localization exists
- add hreflang alternates only when pages truly exist
- localized pages must canonicalize correctly per locale

### 8. tool boundaries (critical)

- prefer minimal changes, do not refactor unrelated code
- do not migrate frameworks or SEO libraries unless requested
- follow the project's existing metadata pattern (Next.js metadata API, react-helmet, manual head, etc.)

## review guidance

- fix critical issues first (duplicates, canonical, indexing)
- ensure title, description, canonical, and og:url agree
- verify social cards on a real URL, not localhost
- prefer stable, boring metadata over clever or dynamic
- keep diffs minimal and scoped to metadata only

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
