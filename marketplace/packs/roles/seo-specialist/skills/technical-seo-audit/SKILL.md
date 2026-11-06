---
name: technical-seo-audit
description: Runs a technical SEO audit of a website from a crawl export, Search Console exports and a few live checks, then ranks the fixes by business impact. Covers crawling, indexing, canonicals, redirects, rendering, internal links, structured data, Core Web Vitals (with INP), mobile, hreflang and HTTPS. Use when a client asks "what is wrong with my site technically", before a redesign or migration, after an unexplained drop in indexed pages, or as the first job with a new client.
---

# Technical SEO audit

A technical audit answers one question: can search engines reach, render, index and understand the pages that make this business money? Everything else is secondary. This skill produces a short summary, a ranked fix table and the evidence behind each line. It does not produce a 200-row list of tool warnings.

## When to use

- First job with a new client, to find blockers before content or link work.
- Before a redesign, platform change or migration (pair with the site-migration workflow).
- After a fall in indexed pages, a sudden traffic drop on one template, or a manual action.
- Once or twice a year as a health check on large sites.

Not for: content quality reviews (use the seo-content-brief skill) or traffic drops with no technical signs (use search-traffic-drop-diagnosis first).

## What you need

**Access:** level 1 for every step, because the audit changes nothing. Level 2 or 3 only if the client wants me to make the fixes afterwards, as access.md sets out.

Ask for these. Exports and screenshots are enough; never ask for passwords.

1. **Money pages:** the 10 to 30 URLs or templates that bring leads or sales. If the client does not know, take the top landing pages by conversions from GA4.
2. **A full crawl export** from Screaming Frog SEO Spider (or Sitebulb, Ahrefs Site Audit, Semrush Site Audit), with JavaScript rendering on if the site uses a JavaScript framework. Include response codes, indexability, canonicals, meta robots, titles, H1s, word count, inlinks, crawl depth and structured data.
3. **Search Console exports:** Page Indexing report (reasons table and example URLs), Performance report by page for the last 3 and 16 months, Core Web Vitals report, Sitemaps report and any Manual actions or Security issues.
4. **robots.txt, the XML sitemap URLs** and the CMS or platform name (WordPress, Shopify, Webflow, custom).
5. **Server log sample** (optional, large sites only): two to four weeks of Googlebot requests.

If you only get a URL, run what you can from public checks (robots.txt, sitemap, a small crawl, URL Inspection screenshots the client sends) and label the audit "partial".

## Steps

### 1. Frame the site
List templates (home, category, product, service, location, article, tag, search, filter pages) and how many URLs each has. Note which templates hold the money pages. Compare crawled HTML pages with pages Google reports as indexed: a big gap either way is the first lead.

### 2. Crawlability
- Read robots.txt line by line. Flag any `Disallow` that blocks money pages, CSS or JavaScript needed to render, or the whole site.
- Status codes: list 4xx and 5xx URLs that receive internal links or traffic; list redirect chains (more than one hop) and redirect loops.
- Check that the sitemap lists only canonical, indexable 200 URLs and is referenced in robots.txt or submitted in Search Console.

### 3. Indexability
- Group the Page Indexing "not indexed" reasons by count and template. Prioritise: "Excluded by noindex" on pages that should rank; "Crawled, currently not indexed" (often thin or duplicate pages); "Duplicate, Google chose different canonical than user"; "Soft 404"; "Blocked by robots.txt" on pages you want indexed.
- For three examples per reason, use URL Inspection (at level 1 in Search Console, or screenshots from the client) to see Google's chosen canonical and the rendered HTML.

### 4. Canonicals and duplication
- Every indexable page should have an absolute, self-referencing canonical. Flag canonicals pointing to redirected, noindexed or 404 URLs, and conflicts between canonical tags, sitemaps and internal links.
- Find duplicate sources: HTTP and HTTPS, www and non-www, trailing slashes, uppercase, tracking parameters, filter and sort parameters, printer pages, and session IDs. Redirects and canonical tags are strong signals; sitemaps are weak; never use robots.txt or noindex to choose a canonical.

### 5. Rendering
For each main template, compare the raw HTML with the rendered HTML (crawler with rendering on, or URL Inspection's rendered view). Flag main content, links, titles or canonicals that only appear after JavaScript runs or after a click. Links must be `<a href>` elements to be followed.

### 6. Architecture and internal links
- Crawl depth: money pages deeper than three or four clicks from the home page.
- Orphans: pages in the sitemap or analytics with no internal links.
- Inlinks: money pages with fewer internal links than low-value pages such as tags.
- Anchor text: generic ("click here") or identical exact-match anchors sitewide.

### 7. Structured data
Test each template's markup (Rich Results Test or the Schema Markup Validator, via screenshots or the crawler's extraction). Flag errors on types Google still supports, markup describing content not on the page, review markup without visible reviews, and missing Organization or LocalBusiness markup on the home or About page. Do not recommend FAQ or HowTo markup for rich results; Google limited FAQ results to well-known government and health sites and dropped HowTo in 2023.

### 8. Page experience and Core Web Vitals
Use field data first (the Search Console Core Web Vitals report or CrUX via PageSpeed Insights). Thresholds at the 75th percentile: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less. Report which templates fail on mobile and the likely cause (large hero image, render-blocking scripts, heavy third-party tags, layout shifts from ads or fonts, long JavaScript tasks for INP). Also check mobile layout, intrusive pop-ups and HTTPS with no mixed content.

### 9. International and local (if relevant)
- Hreflang: return tags, matching language and region codes, canonical in the same language, x-default.
- Local: one crawlable page per real location with consistent name, address and phone details.

### 10. Rank the fixes
Score each issue on four things, 1 to 3 each: **impact** (money pages or traffic affected), **confidence** (evidence strength), **effort** (inverted: 3 = quick), **risk** (inverted: 3 = safe to change). Sort by total. Anything that blocks indexing of money pages is critical whatever its score.

## Checks before you ship

- Every finding has evidence: example URLs, counts and a screenshot or export reference.
- Every fix says what to change, where, who does it (developer, content editor, client) and how to verify it worked.
- No finding is a raw tool warning without a reason it matters.
- Risky changes (robots.txt, canonicals, redirects, sitewide templates) carry a test-on-staging note.
- Nothing you recommend breaks Google's spam policies.
- You state what you could not check (for example, no log files).

## Output format

1. **Summary** (5 to 8 lines): overall verdict, the three to five fixes that matter, the business impact in plain words.
2. **Fix table:** priority | issue | evidence | pages affected | fix | owner | effort | how to verify.
3. **Template notes:** one short paragraph per template.
4. **Not checked / needs access.**
5. **Re-check date:** usually 4 to 6 weeks after fixes ship.

## Example of good output (made for this kit, not a real client)

> **Summary.** Google can crawl the site, but 41% of the 620 service-area pages are "Crawled, currently not indexed". They share 90% of their text and differ only in the town name. These pages bring no leads. The 18 pages that do bring leads are fine, but six sit four clicks deep.
>
> | Priority | Issue | Evidence | Fix | Owner | Verify |
> |---|---|---|---|---|---|
> | Critical | Sitewide `noindex` on /services/ template after the May release | 18 money pages show "Excluded by noindex" since 2026-05-14 | Remove the tag from the template; request indexing for the 18 URLs | Developer | URL Inspection shows "Indexable"; impressions return within 2 weeks |
> | High | 255 near-duplicate town pages | Page Indexing export; crawl shows 90% similar content | Merge into 12 real area pages with local detail; 301 the rest | Content + developer | Fewer excluded URLs; area pages gain impressions |
> | Medium | Money pages four clicks deep | Crawl depth report | Link the six pages from the main menu and home page | Developer | Crawl depth of 2 or less |
