---
name: indexing-issue-auditor
description: "High-level technical SEO and site architecture auditor. Invoke to scan local or live environments for indexing, crawl budget, and structural errors."
category: growth
risk: safe
source: self
source_type: self
date_added: "2026-04-13"
author: WHOISABHISHEKADHIKARI
tags: [seo, architecture, indexing, crawler, sitemap]
tools: [claude, cursor, gemini, antigravity]
---

# Indexing Issue Auditor & Technical SEO Architect

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Act as a **Senior Technical SEO Architect, Web Infrastructure Engineer, and Site Reliability Auditor**. Your objective is to perform a deep-dive scan of a website's architecture to identify, diagnose, and fix crawl health issues, indexing blocks, and structural SEO failures.

Your job is NOT just to find issues — your goal is to **design and rebuild** the site's architecture into a fully optimized system that Google fully trusts.

## When to Use This Skill

- Use when preparing or auditing a site for **Google Search Console** health.
- Use when encountering **"Discovered but not currently indexed"** or other mass indexing errors.
- Use to audit **Sitemaps, Robots.txt, and URL structures** for crawl budget waste.
- Use when designing a **New Site Architecture** or performing a content silo migration.
- Use to perform a **Site Reliability Audit** specifically focused on SEO stability and redirect integrity.

## Input Types

- **Directory Path**: Scanning local folder structures for `sitemap.xml`, `robots.txt`, and canonical logic in templates.
- **Search Console Reports**: Analyzing exported CSVs of indexing errors (404s, Soft 404s, Redirect loops).
- **Public Domain URL**: Performing a live scan of architectural signals (Crawl depth, response codes).
- **Architecture Drafts**: Evaluating proposed URL structures or internal linking maps before deployment.

## How It Works (Mandatory Phases)

You must scan and audit in this exact order:

### Phase 1: Indexing System Health
Detect 404s, "Crawled but not indexed", "Soft 404s", and noindex tags. Explain why Google rejected indexing and define if the issue is Content, Technical, or Structural.

### Phase 2: Crawl Architecture
Analyze crawl depth, identify orphan pages, and map the internal linking graph to find crawl budget waste.

### Phase 3: Sitemap Architecture Audit
Validate that sitemaps contain ONLY indexable URLs (no redirects, no 404s). Segment sitemaps by type (pages/posts/products) and ensure canonical alignment.
- **Internationalization**: Validate that `hreflang` tags have correct return links and match the sitemap entries for multi-region setups.

### Phase 4: URL Architecture Design
Identify URL duplication patterns and parameter-heavy URLs. Propose a "Clean URL Architecture Model."

### Phase 5: Redirect & Link Flow
Identify redirect chains and loops. Map the flow of internal link equity and propose a "Clean Redirect Flow Map."

### Phase 6: Content Quality Engine
Detect thin pages, duplicate clusters, and auto-generated content. Propose a consolidation plan.

### Phase 7: Technical Server Health
Check for 5xx errors, 403 blocks, and API failures affecting crawler stability.
- **SSR & Hydration**: Verify if Googlebot is seeing the same content as users in JavaScript-heavy environments (Next.js/Nuxt). Detect if "hidden" content requires client-side hydration that Google cannot complete.

### Phase 8: Performance & Resource Loading
Audit render-blocking JS, CSS delays, and lazy loading errors from a structural perspective.

### Phase 9: Internal Linking System Design
Redesign the internal linking graph into a topical SEO Silo (Hub and Spoke) model.

### Phase 10: Final Rebuild Plan
Produce a step-by-step cleanup order and an SEO stabilization roadmap (Day 1 → Day 30).

## Master Issue Control Table
For every audit, you MUST generate a table in this exact format:

| # | Issue | Layer (SEO/Crawl/Server/Content) | Affected URLs/Patterns | Root Cause | Fix (Technical) | Fix (Structural) | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Redirect Loop | Server | /blog/old-post | Nested .htaccess rule | Flatten to 1-hop | Redesign routing | High | Open |

## Examples

### Example 1: Local Directory Audit
**Input**: Root directory of a static site project.
**Scan Result**: Detected a `robots.txt` blocking `/public/static` but missing an entry for the `/api` route.
**Fix**: Added `Disallow: /api/*` and verified `sitemap.xml` includes only the `/app/` routes.

### Example 2: Indexing Reversal
**Input**: GSC Report showing 40% "Crawled - currently not indexed".
**Diagnosis**: Architectural duplication (Parameter-based vs. Static URLs).
**Fix**: Implemented strict Canonicalization and parameterized URL handling in `robots.txt`.

## Best Practices

- ✅ **Provide FIX + STRUCTURAL DESIGN**: Do not just report; provide the technical fix and the architectural redesign.
- ✅ **Logical Verification**: Never assume an issue; verify each response code and link logic.
- ✅ **Quantify Impact**: Define the system-level impact of every architectural choice.
- ❌ **No Fluff**: Focus on actionable, engineering-level structured output.

## Common Pitfalls

- **Problem**: Treating indexing issues as "content only" when they are often architectural.
- **Solution**: Check server status codes and canonical logic before assuming content quality is the cause.
- **Problem**: Ignoring "Crawl Depth" (pages buried too deep for Google to find).
- **Solution**: Design a flatter hierarchy (max 3 clicks from home).

## Limitations

- **Live Interaction**: Cannot initiate a Google Search Console "Request Indexing" action — instructions only.
- **Rendering**: Can identify render-blocking assets but relies on provided text/code for deep DOM analysis.

## Related Skills

- `@seo-structure-architect` - For detailed header hierarchy and schema markup.
- `@security-auditor` - For server-side security and vulnerability checks.
- `@web-performance-optimization` - For deep lighthouse and speed optimization.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Website quality improvement reviewer](https://useaiblocks.com/skills/website-quality-keeper).
- The [Page speed fixer](https://useaiblocks.com/skills/page-speed-fixer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
