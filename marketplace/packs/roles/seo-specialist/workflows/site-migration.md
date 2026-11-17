# Site migration

**Trigger:** any change to domain, URL structure, platform or CMS, HTTPS setup, or a redesign that changes templates or navigation. Start at least six weeks before launch for small sites and longer for large ones. Google's own guide is "Site moves with URL changes" in Search Central.

**Goal:** move without losing the search visibility the old site earned, and catch problems before Google does.

## Steps

### Before launch

1. **Benchmark** (level 1; tools: Google Search Console, GA4, Bing Webmaster Tools). Export 16 months of clicks and impressions by page and query, organic conversions by landing page, the Page Indexing summary and Core Web Vitals. Save them; the old property data will be your baseline.

2. **Inventory every old URL** (level 1; tools: Screaming Frog SEO Spider crawl, XML sitemaps, Search Console page export, GA4 landing pages, backlink tool export from Ahrefs or Semrush, server logs if available). Include images, PDFs and URLs that only have backlinks.

3. **Map old to new.** One row per old URL: old URL, new URL, status (same, moved, merged, removed), reason. Every old URL with traffic, links or conversions must map to its closest new equivalent. Removed pages with no equivalent return 404 or 410, never a mass redirect to the home page. Flag any mapping that changes the page's topic.

4. **Check the new site on staging** (run the **technical-seo-audit** skill on staging). Look for: noindex or password left on purpose for staging (and a plan to remove it), canonicals pointing at the staging host, missing titles or H1s, content dropped from templates, internal links pointing at old URLs, structured data lost, worse lab performance (not a field Core Web Vitals verdict), hreflang errors, JavaScript-only content or links.

5. **Compare crawls.** Crawl old live and new staging. Compare page counts per template, titles, word counts, internal links to money pages and structured data. Explain every big difference.

6. **Prepare redirects** (level 2: load them on staging only). Server-side 301 or 308, straight to the final URL, no chains, preserving query parameters where they matter. Test the full redirect list against staging with a crawler in list mode.

7. **Agree the launch plan:** date (avoid peak season), who flips what, a rollback plan, and who checks the site in the first hour.

### Launch day

8. **Go live and test immediately.** Verify that the current authorization covers this exact release and switch; reuse that grant while its scope remains valid. The team named in the launch plan flips it unless the plan names me. robots.txt allows crawling; no sitewide noindex; canonicals use the live host; the redirect list returns 301 to 200 with no chains or 404s; key pages render; analytics fires.

9. **Tell Google and Bing** (level 3 for sitemaps; the Change of Address tool requires explicit authority for this move, reusing an existing valid grant). Submit the new XML sitemap in Search Console and Bing Webmaster Tools; verify the new property if the domain changed; use the Change of Address tool only for a domain or subdomain move. Keep the old sitemap available for a short time so Google sees the redirects.

### After launch

10. **Monitor daily for two weeks, then weekly for three months.** Page Indexing for the new site, crawl errors, the redirect list, server logs for Googlebot hitting 404s, clicks and impressions by template compared with the benchmark, organic conversions. Expect some movement for a few weeks or more on a medium site.

11. **Fix fast** (level 3, within the URL map). Missing redirects, broken internal links and template errors found in the first days are cheap to fix; found in month three they are expensive.

12. **Keep redirects** for at least a year, and longer for URLs with valuable backlinks. Ask the sites with the most valuable links to update them to the new URLs.

## Outputs

- Benchmark export pack.
- URL map and redirect file.
- Staging audit with a go or no-go list.
- Launch-day checklist with results.
- Weekly post-launch report until traffic is back within normal range of the benchmark.

## What needs the client's approval

At level 3, after the client confirms the action list and limits once, I can load the agreed redirect list, submit sitemaps, and fix missing redirects and broken internal links after launch, all within the URL map. I log each change.

Confirm these decisions before acting if they are not already explicitly covered by the current valid authorization. Ask again only when scope, consequences or conditions materially change:

- The URL map, especially removed and merged pages.
- The launch date, the rollback plan and the switch itself.
- Any page removed without a redirect.
- The go or no-go decision after the staging audit.
- The Change of Address tool, and any change outside the URL map.
