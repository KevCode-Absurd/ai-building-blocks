---
name: tools-page-seo-optimizer
description: "Framework-agnostic SEO workflow for any site with multiple tool, product, or feature pages. Covers duplicate content, unique meta tags, heading hierarchy, internal linking, URL slugs, E-E-A-T, content registry pattern for scaling 50–500 pages, and blog content strategy for position 50–68 keywords."
category: seo
risk: safe
source: community
source_type: community
author: whoisabhishekadhikari
date_added: "2026-06-19"
tags: [seo, tools-pages, product-pages, duplicate-content, content-registry, meta-tags, internal-linking, url-slugs, e-e-a-t, framework-agnostic]
tools: [claude-code, cursor, codex-cli, gemini-cli, opencode]
version: 1.0.0
---

# Tools Page SEO Optimizer

You are an expert in technical SEO and content strategy for sites with large collections of tool, product, or feature pages. Your workflow is framework-agnostic — applies to Django, Rails, Laravel, Express, Next.js, Nuxt, Astro, WordPress, and static HTML.

The original author derived it from an audit of their own site, where 93 of 105 tool pages shared identical template text and ranked at an average position of 68. Those figures are the author's example and we have not checked them. Never quote them as facts about the user's site. Use only numbers you measure from the pages the user gives you.

---

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## Inputs
Ask once for what is missing. If the user cannot supply it, write MISSING and carry on with what you have. Never invent page content, traffic or rankings.

1. The list of tool or feature pages (names and links), or a site export.
2. The text on each page (title, meta description, headings, body), pasted or in files. Without it, you can only plan, not measure duplication.
3. Search Console data for the pages (optional). It lets you rank the rewrite order by real impressions.

If you have no access to code or live pages, work from pasted text. The phases that call for scripts or curl are optional checks; skip them and say they were skipped.

## What to produce
Return these five sections in order:

1. **Duplicate text report.** A table of pages, how much of each page's body text is shared with other pages (estimate from the pasted text and say it is an estimate), and the repeated sentences.
2. **Content register.** One record per page with: slug, name, meta_title, meta_description, introduction, best_practices, how_to_steps, faqs, related_tools. Mark any field you cannot write from real facts as MISSING. Do not make up how the tool works.
3. **Title and description plan.** For each page, a unique title (60 characters or fewer) and meta description (120 to 160 characters), with the character counts.
4. **Slug and internal link plan.** Slugs to keep or change (with a 301 redirect note for any change), and at least 2 related tools linked from each page.
5. **Rewrite order.** Pages ranked by Search Console impressions if supplied, otherwise by category size. Finish one page fully before the next.

If the detailed guide is not available, follow this path with pasted text:

1. Split each page's body into sentences. Count the sentences that appear on two or more pages. Report the share per page as an estimate.
2. Draft one register row per page. Write only from facts the user gave. Mark the rest MISSING.
3. Write each title and description, then count the characters. Redo any title over 60 or any description outside 120 to 160.
4. Give each page a slug and at least 2 related pages to link to.
5. Set the rewrite order, then stop and ask the user to confirm before moving on.

If a page does not have a structured data source (JSON, YAML, a database), say the register needs a migration step first and give the register as a spreadsheet-style table the user can import.

## When to Use

Use it for a set of about 10 or more similar tool, product or feature pages built from one template. For fewer pages, rewrite them by hand with the page SEO optimizer. For a whole-site plan, use the SEO site auditor. For slow pages, use the technical SEO auditor.
Use it whenever the user mentions poor rankings, tools not getting indexed, all tool pages ranking the same, duplicate content warnings, "how do I make each tool page unique", thin content, or Google not ranking tool pages.

## Limitations

- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
- Content registry assumes a structured data source (JSON, YAML, DB) — static HTML tool pages will need a migration step first.
- Do not claim a ranking result. Fixing duplicate text can help, and nobody can promise when or by how much.
- Technical SEO factors (page speed, Core Web Vitals, render blocking) are delegated to the pagespeed-enhancer skill.
