---
name: page-speed-diagnosis
description: Reads PageSpeed Insights, Lighthouse, WebPageTest or Chrome DevTools results for a page, explains Core Web Vitals (LCP, INP, CLS) in plain words, separates field data from lab data, finds the biggest costs (images, scripts, fonts, render-blocking files, slow server response) and returns fixes ranked by expected gain and effort, with platform-specific steps, a risk note for each and a before-and-after benchmark plan. Use it when a site feels slow, fails Core Web Vitals in Search Console, or before and after a redesign.
---

# Page speed diagnosis

## When to use

- The site feels slow on phones, or Search Console reports pages failing Core Web Vitals.
- Before a redesign or replatform, to set a baseline.
- After a release, to check nothing got slower.
- When an agency or plugin vendor promises a "score of 100" and the owner wants a straight answer.

At level 1 I work from the reports you send, or record a trace myself if you connect the Chrome DevTools MCP server. I change hosting or site settings only with level 3 access, within your limits. I never promise a score.

## What you need

1. The page URLs that matter most (home, a top landing page, a product or service page, checkout or contact).
2. A PageSpeed Insights result for each, mobile and desktop, as screenshots or the JSON export. Field data matters most.
3. Optional: Lighthouse or WebPageTest runs, a DevTools performance trace, or the Core Web Vitals report from Search Console.
4. The platform (WordPress, Shopify, Webflow, React app, static site), the host and CDN, and a list of plugins, apps or third-party scripts.
5. Any recent changes: new theme, new app, new tracking tag, new hero video.

**Access:** level 1 for the reports and traces; level 2 to make fixes on a branch or a staging copy; level 3 to put tested fixes live, within your limits.

## Steps

### 1. Separate field from lab

Field data (Chrome UX Report, last 28 days, real visits) gives the verdict. Lab data (one simulated Lighthouse run) helps find causes and varies between runs. If there is no field data, say so and rely on repeated lab runs. Never compare a mobile lab score with a desktop one.

### 2. Read the three metrics

Explain each in one plain sentence with the client's numbers:

| Metric | Good at the 75th percentile | Plain meaning |
|---|---|---|
| LCP | 2.5 s or less | How long until the main image or headline shows |
| INP | 200 ms or less | How quickly the page reacts to taps and clicks |
| CLS | 0.1 or less | How much the page jumps while loading |

### 3. Find the LCP cause

Identify the LCP element from the report. Break the time into its four parts: time to first byte, load delay, load duration and render delay. Each points to a different fix:
- **Slow first byte:** server, caching, redirects, CDN.
- **Long load delay:** the image is lazy-loaded, set as a CSS background, injected by JavaScript or not discoverable in the HTML.
- **Long load duration:** the file is too large, in an old format or served from a slow origin.
- **Long render delay:** render-blocking CSS or scripts, web fonts, long JavaScript tasks.

### 4. Find the INP cause

Look for long tasks, heavy third-party scripts (chat widgets, tag managers, A/B testing tools), large hydration costs in JavaScript frameworks, and event handlers that do too much work before the screen updates. Note which interaction is slow if the report shows it.

### 5. Find the CLS cause

Images, ads and embeds without reserved space, late-loading fonts that change text size, banners injected above content, and cookie bars that push the page down.

### 6. Rank the fixes

For each fix give: what to change, expected gain (high, medium or low, tied to which metric), effort (hours or days), risk, and exact steps for the platform. Order easy big wins first. Typical early wins:
- Stop lazy-loading the hero image; add `fetchpriority="high"` to it; size and compress it.
- Add `width` and `height` to images.
- Remove or delay scripts the business no longer uses.
- Preload the brand's key font file and subset it. Never swap the brand font for a system font without the client's say-so: it changes how the brand looks.

**Level 2:** make the chosen fixes on a branch or a staging copy. **Level 3:** put them live after testing, within your limits, and log each change.

### 7. Plan the benchmark

Same pages, same device profile, same location, at least three runs, record the median. Note that field data takes up to 28 days to reflect a fix.

## Checks before handing over

- Every number quoted comes from the client's reports, with the date of the run.
- Field and lab data are labelled and never mixed in one comparison.
- No promised score or guaranteed gain; gains are "expected" and tied to a metric.
- Each fix names its risk (for example, delaying a script may break a form).
- Every fix is tested on a staging copy first (level 2); live changes need level 3 and stay within the client's limits.
- Plugin, app or theme names come from the client's list, not from memory.

## Output format

1. Summary: pass or fail per page, and the one biggest problem in plain words.
2. Metrics table per page: field values, lab values, date of each.
3. LCP element and its four-part breakdown.
4. Ranked fix list: fix, metric, expected gain, effort, risk, steps.
5. What I could not tell from the reports.
6. Benchmark plan and when to re-check field data.

## Example of good output (short)

*Illustrative structure, not a real business: a three-chair dental practice on WordPress. Figures only show the shape. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary.** The home page fails Core Web Vitals on mobile because of LCP: 4.1 s at the 75th percentile in field data (PageSpeed Insights, 3 November). INP (150 ms) and CLS (0.04) pass. The LCP element is the hero photo, which is lazy-loaded and 1.8 MB.
>
> | # | Fix | Metric | Expected gain | Effort | Risk |
> |---|---|---|---|---|---|
> | 1 | Remove `loading="lazy"` from the hero image and add `fetchpriority="high"` | LCP | High | 30 min | Low |
> | 2 | Export the hero at the largest displayed width as WebP or AVIF | LCP | High | 1 hour | Low; check it still looks sharp |
> | 3 | Remove the unused booking widget script from pages without booking | INP, LCP | Medium | 1 hour | Medium; confirm with reception which pages use it |
>
> **Not known from these reports.** Server response time from other countries; whether the slider plugin is used on other pages.
