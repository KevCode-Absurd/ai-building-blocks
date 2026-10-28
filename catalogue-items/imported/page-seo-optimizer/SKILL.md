---
name: seo-optimization
description: Optimize a webpage for search engines by analyzing on-page elements, improving technical performance, and implementing structured data for maximum visibility. Use when the user requests seo optimization or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# SEO Optimization

This skill enables an AI agent to perform comprehensive search engine optimization on any webpage or website. The agent audits on-page factors (title tags, meta descriptions, headings, internal links), evaluates technical SEO health (Core Web Vitals, mobile-first indexing, crawlability), and implements structured data markup. The goal is to produce actionable recommendations that improve organic search rankings and click-through rates.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your page** (yours): the landing page's link, or its text and a screenshot.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your page. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Rules for numbers

Never estimate or invent a measurement. If you cannot open the page, or cannot measure speed, Core Web Vitals, render-blocking files or competitor content, ask the user to paste the page text and a PageSpeed Insights report, and mark each missing figure `MISSING:`. Give competitor comparisons only when the user supplies competitor data.

## Workflow

1. **Crawl and inventory the page.** Fetch the target URL and parse the full HTML document. Extract the title tag, meta description, canonical URL, Open Graph tags, all heading elements (H1–H6), images with alt attributes, and every internal and external link. Record the HTTP status code, response time, and redirect chain if applicable.

2. **Analyze on-page SEO elements.** Evaluate the title tag for length (50–60 characters), keyword placement, and uniqueness. Check the meta description for length (150–160 characters) and compelling call-to-action language. Verify there is exactly one H1 tag that contains the primary keyword, and that H2–H4 tags form a logical content hierarchy. Flag missing alt text on images and broken internal links.

3. **Evaluate technical SEO factors.** Assess Core Web Vitals — Largest Contentful Paint (LCP < 2.5s), Interaction to Next Paint (INP < 200ms), and Cumulative Layout Shift (CLS < 0.1). Check mobile-friendliness by analyzing the viewport meta tag and responsive layout. Verify the existence and correctness of `robots.txt`, XML sitemap, canonical tags, and hreflang tags for international sites. Identify render-blocking resources and unused CSS/JS.

4. **Implement structured data markup.** Generate JSON-LD schema markup appropriate to the page type — Article, Product, FAQ, BreadcrumbList, Organization, or LocalBusiness. Validate the markup against Google's Rich Results requirements. Ensure the schema references match the visible page content to avoid structured data penalties.

5. **Audit internal linking and content depth.** Map the internal link graph to identify orphan pages and shallow content clusters. Recommend anchor text improvements and suggest new internal links that strengthen topical authority. Evaluate content length and keyword use. Compare with top-ranking competitors only if the user supplies competitor pages or data; otherwise mark those figures `MISSING:` and do not guess.

6. **Generate a prioritized SEO report.** Produce a structured report with findings organized by impact (critical, high, medium, low). Include before/after code snippets for recommended changes, a plain effort label for each fix (low, medium or high) and its priority. Do not predict ranking gains or traffic. No one can promise them. Provide a checklist format so engineers and content teams can track completion.

## Usage

Provide the agent with the URL of the webpage to optimize and, optionally, the target keyword. The agent will return a full audit report with actionable fixes.

**Prompt:** `Optimize the following page for the keyword "project management tools": https://example.com/blog/best-pm-tools`

## Examples

The names, numbers, dates and counts in these two examples are made-up placeholders to show the layout. They are not real data. Never copy them into a real page.

### Example 1: Blog Post On-Page Optimization

**Request:** Optimize `https://acme.com/blog/remote-work-tips` for the keyword "remote work tips".

**Before — HTML head:**
```html
<head>
  <title>Blog Post | Acme Co</title>
  <meta name="description" content="Read our latest blog post.">
</head>
```

**After — Optimized HTML head:**
```html
<head>
  <title>15 Remote Work Tips That Boost Productivity in 2025 | Acme Co</title>
  <meta name="description" content="Discover 15 remote work tips to stay productive, manage your time, and avoid burnout. [Add a claim here only if you can source it.]">
  <link rel="canonical" href="https://acme.com/blog/remote-work-tips">
  <meta property="og:title" content="15 Remote Work Tips That Boost Productivity">
  <meta property="og:description" content="Practical remote work tips for staying productive.">
  <meta property="og:type" content="article">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "15 Remote Work Tips That Boost Productivity in 2025",
    "author": { "@type": "Person", "name": "Jane Smith" },
    "datePublished": "2025-03-10",
    "description": "Practical remote work tips for staying productive and avoiding burnout."
  }
  </script>
</head>
```

### Example 2: Technical SEO Audit Findings

**Request:** Run a technical SEO audit on `https://acme.com`.

**Audit Report:**

| Priority | Issue | Details | Fix |
|----------|-------|---------|-----|
| Critical | Missing XML sitemap | No sitemap found at `/sitemap.xml`; [share of pages not indexed, from Search Console] | Generate and submit sitemap to Search Console |
| Critical | LCP = [measured value] on mobile | Hero image is [file size] uncompressed PNG | Convert to WebP, add `width`/`height`, add `fetchpriority="high"`. Never lazy-load the main (LCP) image; use `loading="lazy"` only for images below the fold (web.dev, Optimize LCP) |
| High | Duplicate title tags | [count] pages share the title "Acme Co — Home" | Write unique, keyword-rich titles for each page |
| High | Missing canonical tags | [count] pages lack `<link rel="canonical">`, which can cause duplicate-page problems | Add self-referencing canonicals to every page |
| Medium | No `robots.txt` | Entire site crawlable including `/admin` and `/staging` | Create `robots.txt` disallowing private paths |
| Low | Images missing alt text | [count] of [total] images have empty `alt` attributes | Add descriptive alt text with relevant keywords |

## Best Practices

- **Write for humans first, search engines second.** Keyword stuffing degrades user experience and triggers ranking penalties. Aim for natural keyword use. A density of 1–2% is the author's rough guide, not a rule.
- **Prioritize Core Web Vitals.** The current metrics are LCP, INP (which replaced FID) and CLS. Google recommends good Core Web Vitals and says page experience aligns with what its ranking systems reward, but good scores alone do not guarantee rankings (Google Search Central, Core Web Vitals). Compress images, defer non-critical JS, set explicit dimensions on media elements, and do not lazy-load the main image.
- **Use self-referencing canonical tags on every page.** This prevents duplicate content issues caused by URL parameters, trailing slashes, or session IDs.
- **Build topical authority through internal linking.** Link related content in clusters around pillar pages. Use descriptive anchor text instead of generic "click here" links.
- **Validate structured data with Google's Rich Results Test.** Incorrect schema can result in manual actions. Always match schema fields to visible on-page content.
- **Monitor changes in Search Console weekly.** Track impressions, clicks, average position, and coverage errors after deploying SEO fixes to measure impact.

## Edge Cases

- **Single-page applications (SPAs):** JavaScript-rendered content may not be crawled. Use server-side rendering, static rendering or hydration. Google calls dynamic rendering a workaround, not a long-term solution. Use the URL Inspection tool to verify Google sees the full DOM.
- **Multilingual sites:** Each language version needs its own unique title, meta description, and hreflang annotations. Incorrect hreflang mappings can cause the wrong language to appear in SERPs.
- **Paywalled or gated content:** If you want gated content in search, mark it with Google's paywalled-content structured data (`isAccessibleForFree`) so it is not mistaken for cloaking. Use `<meta name="robots" content="noindex">` only on pages you do not want in search at all.
- **Pagination:** Google no longer uses `rel="next"` and `rel="prev"`. Link each page to the next with normal `<a href>` links, give each page its own URL (for example `?page=2`) and its own self-referencing canonical. Do not point every page's canonical to page 1 (Google Search Central, pagination guide).
- **Rapidly changing content:** For news or e-commerce sites with frequent changes, keep the XML sitemap current with accurate `lastmod` dates. Do not use the Indexing API for these pages: Google allows it only for pages with `JobPosting` or `BroadcastEvent` embedded in a `VideoObject` (Google Indexing API quickstart).

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [SEO auditor](https://useaiblocks.com/skills/seo-auditor).
- The [Title and meta tag writer](https://useaiblocks.com/skills/title-and-meta-tag-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
