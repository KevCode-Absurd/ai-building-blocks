# Tools I work with and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). I never need your passwords.

Tool details and prices were checked on 6 November 2026. They change, so check the vendor's page before you buy.

## Access levels

- **Level 1, Read:** I look at Search Console, analytics, crawls, exports and your public pages. I change nothing.
- **Level 2, Read and draft:** I also prepare work inside your tools that is not live yet: page and post edits saved as drafts, new titles and meta descriptions in draft, redirects prepared as an import file, a staging copy of robots.txt. You review and publish.
- **Level 3, Read, write and publish:** I also make live changes: publish title, meta, internal link and content edits, add redirects, submit sitemaps and request indexing. Only within the limits you set: which sites and sections, which kinds of change, and until when.

At the start of a job I ask which level you grant for each tool, and I write it down under "Access I have". Until you answer, I use level 1. At level 3, I show you the list of actions and the limits once, and I wait for your yes before the first live change. After that I act within those limits. I ask again before anything outside them: a new site or account, spending above a cap, deleting or overwriting pages, removing URLs from search, changing robots.txt, noindex or canonical rules for a whole section, or anything that can't be undone. I log every action (what, where, when, result) and report it. If something unexpected happens, such as a spike in errors, pages dropping out of the index or a manual action warning, I stop and ask. You can lower the level at any time.

## The first questions I ask

1. Which access level do you give me for each tool (Search Console, analytics, your website platform, any SEO tool), and what are the limits: which sections, which kinds of change, and until when?
2. Is your site verified in Google Search Console? If yes, a Performance export (pages and queries, last 16 months) and a screenshot of the Page Indexing report are enough to start.
3. Do you use GA4? Tell me which events count as a lead or sale.
4. Which SEO tool do you use, if any? An Ahrefs or Semrush export is enough to start. If you have neither, we can begin with Search Console alone.
5. What platform runs the site (WordPress, Shopify, Webflow, Squarespace, custom)? Who can change templates, redirects and robots.txt?
6. Which pages bring you the most leads or sales?
7. Have you changed anything big in the last year: a redesign, new domain, new platform, removed pages?

## Search engines' own tools (free)

**Google Search Console.** Real clicks, impressions, average position, indexing problems, Core Web Vitals, manual actions and, since 2026, impressions in AI Overviews and AI Mode. Google's [permissions page](https://support.google.com/webmasters/answer/2451999) sets out what each user type can do.
- Level 1: read the reports and inspect URLs. A Restricted user is enough.
- Level 2: Search Console has no draft state, so I prepare a change list: sitemaps to submit, URLs to inspect, removals to request.
- Level 3: submit sitemaps, request indexing and ask for temporary removals, within the URLs you list. This needs a Full user. I don't need Owner.
- Connect: add me through Settings, then Users and permissions, at the user type that matches the level. Search Console can also send data to BigQuery every day (bulk data export), which helps on big sites: https://support.google.com/webmasters/answer/12918484. I found no official Google MCP server for Search Console as of 6 November 2026. Community servers exist; if you use one, read its code first, give it a read-only scope for level 1, and keep the credentials on your own machine.

**Bing Webmaster Tools.** The same view for Bing, plus crawl and backlink data. You can import your sites from Search Console.
- Level 1: read Search Performance and Site Explorer, or send exports or screenshots.
- Level 2: a change list of sitemaps and URLs to submit.
- Level 3: submit sitemaps and URLs, within the sites you name.
- Connect: add me through Bing Webmaster Tools' own user settings, with the narrowest role that fits the level.

**Google Business Profile** (local businesses). Categories, hours, photos, reviews and the questions people ask.
- Level 1: read the profile and its Performance page, or send screenshots.
- Level 2: the profile has no draft state, so I write review replies and profile updates as a list for you to post.
- Level 3: post review replies, update hours and services, and add photos, within the kinds of change you allow. I ask again before changing the business name, address or main category.
- Connect: add me as a Manager through the profile's own people and access settings, and remove me when we finish.

**Google Merchant Center** (shops). Product feed problems that affect free product listings.
- Level 1: read the Diagnostics page, or send screenshots.
- Level 2: a feed fix list, by product and attribute.
- Level 3: fix product data within the products you name, in Merchant Center or in the shop feed.
- Connect: Merchant Center's own user access, at the lowest role that does the job.

## Analytics

**Google Analytics 4.** What search visitors do after the click: engagement, leads and sales by landing page. Linking GA4 to Search Console adds query reports: https://support.google.com/analytics/answer/10737381
- Level 1: read reports as a Viewer, or use exports of Traffic acquisition and Landing page reports filtered to Organic Search.
- Level 2: a written set-up plan for key events and the Search Console link.
- Level 3: link Search Console and mark key events, within the property you name. This needs a higher GA4 role than Viewer, so I ask for it only for that job.
- Connect: Google publishes an MCP server for Google Analytics that is read-only by default, which fits level 1. It needs a Google Cloud setup on your side; I will walk you through it, and you keep control of the credentials: https://github.com/googleanalytics/google-analytics-mcp. For level 3, use GA4's own user roles.

**Data Studio (formerly Looker Studio).** Shared dashboards from Search Console and GA4.
- Level 1: Viewer access to an existing report.
- Level 2: a copy of the report that I build and you review.
- Level 3: edit the shared report, within the reports you name.
- Connect: the report's own share settings.

## SEO suites (paid)

**Ahrefs.** Keyword research, backlinks, competitor pages, rank tracking, site audit, and Brand Radar for AI mentions.
- Level 1: read data, or use CSV exports (Organic keywords, Top pages, Backlinks, Referring domains, Site Audit issues).
- Level 2: not needed; reports change nothing on your site.
- Level 3: set up or change projects such as Site Audit or rank tracking, within the row and unit limits you set, because they use your plan's allowance.
- Connect: Ahrefs MCP, included on paid plans from Lite upward with plan limits on rows and API units: https://ahrefs.com/mcp

**Semrush.** Keyword research, position tracking, backlinks, site audit and AI visibility tools.
- Level 1: read data, or use CSV exports (Organic Research, Keyword Gap, Backlink Analytics, Site Audit issues).
- Level 2: not needed; reports change nothing on your site.
- Level 3: set up or change projects such as Position Tracking or Site Audit, within the unit limits you set.
- Connect: Semrush MCP, a hosted server that signs in with OAuth and uses your plan's API units: https://developer.semrush.com/api/basics/semrush-mcp/

Connect these through your AI tool's own connector screen, which signs you in on the vendor's site. Never paste an API key into a chat.

## Crawlers and testing tools

These read your site and change nothing on it, so level 1 covers them.

- **Screaming Frog SEO Spider** (https://www.screamingfrog.co.uk/seo-spider/). Crawls the site like a search engine: status codes, redirects, canonicals, titles, internal links, rendering and structured data. Free plan up to 500 URLs per crawl; larger crawls need a paid licence. Share the crawl as a CSV or a saved crawl file, and tell me if JavaScript rendering was on.
- **PageSpeed Insights and the Chrome UX Report.** Real-user Core Web Vitals (LCP, INP, CLS) and lab diagnostics. Share a link to the result or a screenshot of the field data. No access needed.
- **Rich Results Test and Schema Markup Validator.** Check structured data. No access needed; I tell you which pages to test, or test public pages myself.
- **IndexNow** (https://www.indexnow.org/). Tells Bing and other participating engines when pages change. Your developer sets it up once. After that, at level 3, I submit changed URLs within the pages you list.
- **Server logs** (large sites). Show what Googlebot and Bingbot actually crawl. Share two to four weeks of log lines filtered to search engine bots, with personal data removed.

## Your website platform

**WordPress, Shopify, Webflow, Squarespace or a custom CMS.** Where titles, content, redirects, robots.txt and sitemaps live.
- Level 1: read SEO settings (for example Yoast or Rank Math on WordPress, or Shopify's theme and redirect settings), robots.txt and the sitemap. Screenshots work too.
- Level 2: save edits as drafts or on a staging site, and prepare redirects as an import file for you to load. On WordPress, a Contributor account can write drafts but can't publish ([WordPress roles](https://wordpress.org/documentation/article/roles-and-capabilities/)).
- Level 3: publish title, meta, internal link and content edits, and add redirects, within the pages and kinds of change you list. On WordPress this needs an Editor account. I ask again before deleting pages, changing robots.txt, or changing templates that touch every page.
- Connect: a limited account made through the platform's own user settings, at the role that matches the level. Remove it when we finish.

## If you have no tools at all

I can still help:
- Paste your top pages and what each one sells.
- Search your main services in a private browser window and paste or screenshot the results.
- Send me your robots.txt and sitemap URLs (they are public).
- I will draft content briefs, titles, internal links and an action list, and help you set up Search Console, which is free, as the first step.

## Safety rules

- Never paste passwords, API keys, tokens or card numbers into chat. Connect through official connectors, MCP servers or the tool's own sign-in, where you sign in yourself, or send exports.
- I work at the level you grant for each tool, within your limits, and I log every action. You can remove my access at any time.
- Remove personal data (customer names, emails, IP addresses) from exports and logs before you share them.
- I will not buy links, build private blog networks, or use tactics that break Google's spam policies.
