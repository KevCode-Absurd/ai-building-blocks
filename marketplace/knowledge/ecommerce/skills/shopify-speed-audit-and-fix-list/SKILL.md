---
name: shopify-speed-audit-and-fix-list
description: "A speed check of a Shopify store's key page templates (home, top collection, top product, top landing page, cart) on mobile first, using real-user field data and repeated lab runs, that finds what makes each page slow (hero image, app scripts, layout shift, heavy collection grids, fonts, video) and ranks every fix by impact on the failing metric, pages reached and effort. Each fix is tried on an unpublished theme copy with before and after lab numbers, and field numbers are re-read 28 days after release. Free tools only. Use when Core Web Vitals fail, after a theme or app change, before a big traffic push, or when the owner asks 'is the site slow?'."
---

# Shopify speed audit and fix list

**You get:** a speed scorecard for 5 key templates (field LCP, INP and CLS on mobile and desktop, plus median lab numbers), the cause behind each failing metric, and a fix list of 8 to 15 items ranked by impact and effort, each with before and after lab numbers from an unpublished theme copy, the owner, and the date to re-read field data.

## When to use

- PageSpeed Insights or Search Console shows Core Web Vitals failing on mobile.
- A theme, app or page builder change went live and pages feel slower.
- Before a sale or a big increase in paid traffic.
- The owner sees a low speed score and wants to know what actually matters.

## Not for

- Removing apps and leftover app code in depth: use `remove-app-bloat`.
- Image and video file rules and settings: use `image-and-video-speed-pass`.
- Building a native theme section to replace an app: use `shopify-theme-section-builder`.
- A mobile usability walk-through beyond speed: use `mobile-conversion-audit`.

## What you need

Required:

1. **Live store URL** and the 5 templates to test: home, top collection, top product (by sessions), top paid landing page, and the cart (drawer or page). Get the top pages from Shopify Analytics or GA4 landing page reports.
2. **Field data:** PageSpeed Insights for each URL and for the whole origin; Search Console Core Web Vitals report if the store has it; Shopify's web performance report in Analytics where the plan shows it.
3. **Theme and app list:** current theme name and version, installed apps, and which ones add anything to the storefront.
4. **Staff access to duplicate the theme** (draft access, level 2) to test fixes on an unpublished copy.

Optional: GA4 conversion by device for the same pages, a list of recent theme or app changes with dates.

Read access (level 1) is enough to measure. Testing fixes needs draft access to an unpublished theme copy. Publishing the copy, removing apps or changing live settings needs the client's yes.

## Before you start: the gates

1. **Judge on field data.** The target is Core Web Vitals at the 75th percentile of real page loads, split by mobile and desktop: LCP 2.5 seconds or less, INP 200 ms or less, CLS 0.1 or less [SPD-6183]. The 0 to 100 lab score is a diagnostic, not the goal. Old checklists quoting "FID under 100 ms" are out of date; INP replaced it in 2024.
2. **Know the lag.** Field data is a rolling 28-day sample, so a fix shows in lab numbers at once but in field numbers only weeks later [SPD-0005]. Plan the re-read date.
3. **Never edit the live theme.** All fixes are built and measured on a duplicate.
4. **Speed is not always the bottleneck.** If all three field metrics pass on mobile for the top templates, say so and point to `storefront-conversion-audit`; do not invent work.

## Steps

### 1. Measure each template

For each of the 5 URLs:

- Record **field** LCP, INP and CLS for mobile and desktop at the URL level, or origin level if the URL has too little traffic (say which).
- Run **lab** tests 3 times on mobile and record the median of LCP, total blocking time, CLS, total page weight and number of requests. Single runs vary too much to compare.
- Note the **LCP element** (the hero image, product image or a heading) and whether it is lazy-loaded.

### 2. Find the cause of each failing metric

**Slow LCP (loading)**
- Hero or first product image lazy-loaded or faded in: the most common Shopify cause; load the first image eagerly with high fetch priority [SPD-0006].
- Oversized images: camera originals or 5000 px uploads; Shopify serves WebP or AVIF automatically, but does not compress on upload [SPD-6184]. Hand file rules to `image-and-video-speed-pass`.
- Render-blocking scripts in the theme head: code an app pasted into the head blocks rendering, while app scripts loaded through Shopify's script mechanism load async [SPD-0011].
- Web fonts: more than two families or weights, or fonts loaded from a third party without a swap fallback (practitioner default: two families, preload the one used above the fold).

**Poor INP (responsiveness)**
- Heavy app scripts running on every tap (reviews, chat, upsell, tracking widgets); stores with fewer third-party services score far better on mobile [SPD-0001].
- Slow variant pickers, cart drawers and filters built with heavy scripts.
- Quick view on collection pages preloading full product data for every card [SPD-0012].

**High CLS (layout shift)**
- An app injecting a bar or badge after load (free-shipping bars, review stars, banners) [SPD-0007].
- Images without set width and height; late-loading fonts that change text size.

### 3. Follow the fix order

Work in this order unless the measurements say otherwise: images first, then third-party scripts, then theme and hosting issues; never lazy-load images above the fold [SPD-0002]. Leftover code from removed apps sits in many older themes; search theme files for each removed app's name [SPD-0009]. Embedded video players are often the heaviest single item; a click-to-load thumbnail saves close to a megabyte per player [SPD-0010].

### 4. Rate each fix

For every fix:

- **Impact:** which metric it moves and by how much on the theme copy (lab before and after, median of 3 runs).
- **Reach:** share of sessions that load that template (home, collection, product, landing, cart).
- **Effort:** hours, and who can do it (owner in admin, developer, app vendor).
- **Risk:** what could break (tracking pixels, reviews display, upsell offers).

Score = impact (3 if it moves a failing metric across the threshold, 2 if it moves it more than 20%, 1 otherwise) x reach share / effort hours. Sort by score. Never defer or remove tracking pixels as a speed fix without the client knowing the cost; defer non-essential app scripts instead [SPD-0009].

### 5. Build and measure on the theme copy

Duplicate the live theme, apply the top fixes one at a time, and record lab numbers after each. Preview on a real mid-range phone too. If a fix breaks a feature (reviews, cart drawer, tracking), roll it back and note it. Check tracking still fires (purchase test in test mode, or the pixel helper) before handing over.

### 6. Hand over, release, and re-read

Give the client the fix list with before and after lab numbers. After they approve and publish, record the release date and re-read field data 28 days later [SPD-0005]. Read conversion before and after by device for the same pages; published case studies tie faster LCP to higher sales [SPD-0004], but the store's own read decides, and no revenue forecast is promised.

### 7. India and US notes

- **India:** test on throttled slow 4G and a mid-range Android; many buyers are on patchy mobile data, so page weight under about 2 MB on product pages is a sensible working target (practitioner default). Check COD, pincode and WhatsApp widgets, which often load heavy scripts on every page.
- **US:** check consent banners and tracking tags (several pixels plus a tag manager) for main-thread time, and test Safari on iPhone, where some app scripts behave differently.

## Checks before you hand it over

- All 5 templates have field data (or are marked origin-level) and median-of-3 lab numbers.
- Each failing metric has a named cause with evidence (LCP element, script name, shifting element).
- Every fix shows before and after lab numbers from the theme copy.
- Fixes are ranked by impact x reach / effort, with owner and risk.
- Tracking was checked after fixes; no pixel removed without the client knowing.
- The field re-read date (28 days after release) is set.
- Nothing published, removed or changed live without the client's yes.

## Output

**One-screen summary:** pass or fail for each Core Web Vital on mobile at the origin, the worst template, the top 3 fixes with their lab gains, and the re-read date.

**Scorecard:**

| Template | URL | Field LCP (m / d) | Field INP (m / d) | Field CLS (m / d) | Lab LCP median | Lab TBT median | Page weight | Requests | LCP element | Pass |
|---|---|---|---|---|---|---|---|---|---|---|

**Fix list:**

| # | Fix | Template(s) | Metric | Cause and evidence | Lab before | Lab after | Reach | Effort (hours) | Score | Owner | Risk | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Release log:** Fix, Published date, Field re-read date, Field result, Conversion before and after by device.

## Common mistakes

- **Chasing the 0 to 100 score.** Gate 1 judges on field Core Web Vitals.
- **One lab run.** Step 1 uses the median of 3.
- **Lazy-loading everything.** Step 2 and Step 3 load the hero eagerly.
- **Fixing on the live theme.** Gate 3 and Step 5 use a copy.
- **Expecting field numbers to move next day.** Gate 2 and Step 6 set a 28-day re-read.
- **Speed fixes that break tracking.** Step 5 checks pixels before handover.

## Sources

- SPD-0001: fewer third-party services, better mobile scores.
- SPD-0002: fix order: images, then scripts, then hosting.
- SPD-0004: published cases tie LCP gains to sales.
- SPD-0005: field data is a rolling 28-day sample.
- SPD-0006: lazy-loaded hero is the most common slow LCP cause.
- SPD-0007: app bars injected after load cause layout shift.
- SPD-0009: leftover app code; defer non-essential scripts, never pixels.
- SPD-0010: click-to-load video saves close to a megabyte.
- SPD-0011: code pasted into the theme head blocks rendering.
- SPD-0012: quick view preloads product data for every card.
- SPD-6183: Core Web Vitals thresholds at the 75th percentile.
- SPD-6184: Shopify image limits and automatic WebP or AVIF.

What makes this skill ours: five templates chosen by real sessions, judged on field Core Web Vitals (with INP, not the retired FID) rather than a lab score; every fix measured on an unpublished theme copy with median-of-3 lab numbers before anyone publishes; fixes scored by metric crossed x reach / hours; tracking checked after each fix; and a 28-day field re-read built in.
