# Give your agents access to PageSpeed Insights and CrUX

Your speed agent (Arjun) and the theme developer (Yaroslav) measure how fast your store is. Two Google sources do this. The Chrome UX Report (CrUX) is real-visitor data from Chrome users over the last 28 days. PageSpeed Insights runs a lab test (Lighthouse) on a page and shows CrUX data next to it where Google has enough visits. Both read public pages only. Facts were checked on 15 November 2026.

## What the agents do with it at each level

| Level | What the agents do |
|---|---|
| 1, read | Read CrUX field data for your store and key pages, read up to 40 weeks of weekly history, and run lab tests on public pages and theme preview links. This is all the speed work needs. |
| 2, draft | Nothing more here. Fixes are drafted on an unpublished Shopify theme copy (see the Shopify guide). |
| 3, publish | Not used. These tools change nothing on your store. |

## What you need first

- A Google Cloud project where you can create an API key. Both APIs are free to use; the CrUX quota cannot be raised by paying.
- Nothing from your store: these tools read public pages. A theme preview link works for lab tests while it is shared.
- Shopify's own Web performance dashboard has no API. When the agent asks, send screenshots of it from your Shopify admin.

## Way 1, in Claude

There is no official Google connector for PageSpeed Insights or CrUX in Claude's directory. Two ways work:

- **Links you share (any Claude plan).** Open https://pagespeed.web.dev, test each page the agent lists, on Mobile, and share the report link or a screenshot with the date. The agent reads the field data block and the lab results.
- **Chrome DevTools MCP (Claude Code).** Google's Chrome team publishes an official DevTools server that can record a performance trace of a page in Chrome, and can add CrUX field data for the address. Install it in Claude Code with:
  `/plugin marketplace add ChromeDevTools/chrome-devtools-mcp`
  then `/plugin install chrome-devtools-mcp@chrome-devtools-plugins`.
  It can see and change what is in that Chrome window, so use it on your public pages and preview links only, and not in a browser profile where you are signed in to your admin, bank or email. Usage statistics go to Google by default; add `--no-usage-statistics` to turn that off, and `--no-performance-crux` if you do not want trace addresses sent to CrUX. Set its tools that type, click or run scripts to Needs approval, and check the exact names in your tool list.

## Way 2, for Claude Code scripts and hosted agents: one API key

1. In the Google Cloud console, pick or create a project.
2. Open APIs and services > Library and turn on the Chrome UX Report API and the PageSpeed Insights API.
3. Go to APIs and services > Credentials > Create credentials > API key.
4. Open the new key and restrict it: under API restrictions, allow only the Chrome UX Report API and the PageSpeed Insights API. Check the exact wording in your console.
5. Put the key in your host's secret store. Google says a CrUX key is safe to use in request addresses, but keep it out of project files and chats anyway, so nobody else uses your quota.

What the agents call:

- CrUX: `POST https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=KEY` with `origin` (whole store) or `url` (one page), and `formFactor` of `PHONE`, `DESKTOP` or `TABLET`. Limit: 150 queries a minute per project. Data is a 28-day rolling average, updated daily around 04:00 UTC with no guarantee.
- CrUX History: `POST https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord?key=KEY`. Up to 40 weekly periods (`collectionPeriodCount` 1 to 40), updated each Monday, with data to the Saturday before.
- PageSpeed Insights: `GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=PAGE&strategy=MOBILE&key=KEY`. With no `category`, only Performance is run.
- Lighthouse can also run locally (for example with Lighthouse CI) with no key. The agents run each page 3 to 5 times and keep the middle result.

## Safety switches on Google's side

- These APIs only read public data. A key restricted to them cannot reach anything else in your Google account.
- You can delete or rotate the key at any time.

## Check it works

Ask the agent: "Get CrUX field data for my store's origin on phones, and run one PageSpeed Insights test on my home page on mobile."

A good answer gives p75 LCP, INP and CLS for phones with the collection period dates, says whether each is in the good range (LCP 2.5 s, INP 200 ms, CLS 0.1), and gives the lab LCP and CLS for the home page with the test date. If CrUX has no data, it says the store has too few Chrome visits for field data, which is normal for small stores, rather than guessing.

## Take access away

1. In the Google Cloud console, go to APIs and services > Credentials.
2. Delete the API key (or regenerate it if you want to keep using it elsewhere).
3. Remove the key from your host's secret store.
4. For Chrome DevTools MCP, uninstall the plugin in Claude Code with `/plugin` and close the Chrome window it used.

## What stays manual, and why

- Shopify's Web performance dashboard: no API, so you send screenshots.
- Small stores and new pages often have no page-level CrUX data. The agents then use store-level data and lab tests, and say so.
- Lab tests guide fixes; field data at 28 days is the result. The agents never present one as the other.

## Sources

- CrUX API, Chrome for Developers, https://developer.chrome.com/docs/crux/api (checked 15 November 2026)
- CrUX History API, Chrome for Developers, https://developer.chrome.com/docs/crux/history-api (checked 15 November 2026)
- PageSpeed Insights API, get started, https://developers.google.com/speed/docs/insights/v5/get-started (checked 15 November 2026)
- PageSpeed Insights runPagespeed reference, https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed (checked 15 November 2026)
- Chrome DevTools MCP, https://github.com/ChromeDevTools/chrome-devtools-mcp (checked 15 November 2026)
- Core Web Vitals thresholds, web.dev, https://web.dev/articles/vitals (from the 15 November 2026 connector research; not re-read for this guide)
- Testing for performance on Shopify themes, https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance (from the 15 November 2026 connector research; not re-read for this guide)
