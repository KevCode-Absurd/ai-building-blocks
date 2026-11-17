# Store speed fix, from field data to a checked release

Your store's slowest page types made faster for real visitors: a baseline from Chrome's real-visitor data, the causes found, the fixes you picked built on an unpublished theme copy, proven before and after, published on your yes, and re-checked with real-visitor data 28 days later.

**Starts from:** A monthly speed review, a site results readout that flagged speed, a new app or theme update that slowed the store, or you asking why the store feels slow.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Arjun (arjun-page-speed) | intake.md | intake-complete | no | read |
| 2 | Real-visitor baseline | Arjun (arjun-page-speed) | baseline/field.md, numbers.json | field-numbers, field-review | no | read |
| 3 | Lab tests, middle of several runs | Arjun (arjun-page-speed) | baseline/lab.md | lab-numbers | no | read |
| 4 | Causes and fix list | Arjun (arjun-page-speed) | fix-list.md, change-requests.md | diagnosis-review | yes | draft |
| 5 | Build the fixes on an unpublished copy | Yaroslav (yaroslav-shopify-dev) | build-record.md | theme-check, code-review | yes, the plan | publish |
| 6 | Before and after, for your sign-off | Arjun (arjun-page-speed) | before-after.md, preview/page.html, release-plan.md | before-after-numbers, render, visual-review | yes | draft |
| 7 | Publish the fixes | Yaroslav (yaroslav-shopify-dev) | publish-record.md | none | yes, the plan | publish |
| 8 | Check the live store | Arjun (arjun-page-speed) | live-check.md | live-verify | no | read |
| 9 | Real-visitor re-check after 28 days | Arjun (arjun-page-speed) | results/field-28.md | recheck-numbers, recheck-review | no | read |

## Stage by stage

### 1. Gather what we know

Collects the facts before any test runs: which page types earn the most (home, top collections, top products, landing pages), what changed recently (apps installed or removed, theme updates, new tracking tags), the current app list, the theme and version, and which tools we can reach. Shopify's own Web performance dashboard has no API, so it asks you for screenshots of it. Gaps become questions for you.

- **Needs:** context/org-context/ (customers, design, do's and don'ts); context/goals.json; context/learnings.md; Shopify connector or CLI (read): theme, app list, top pages by sales; screenshots of the Web performance dashboard in your Shopify admin; the task that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, recent changes have dates, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md lists the pages to test with their sales share, recent changes with dates, the app list, the theme and version, the access we have, and the questions you answered.

### 2. Real-visitor baseline

Reads Chrome's real-visitor data (CrUX) for the store and for each chosen page, on phones and desktops, plus up to 40 weeks of weekly history to see when things changed. Field data is a 28-day window and runs about 2 days behind, so it records the exact window. Pages with too few visits for page-level data are read at store level and marked so.

- **Needs:** intake.md; CrUX API and CrUX History API, with the key in the host's secret store
- **Makes:** baseline/field.md, numbers.json
- **Checks:** field-numbers (every figure in field.md matches its saved CrUX response in numbers.json); field-review (each number names its window, device and level (page or store), thresholds are read at the 75th percentile, and field and lab data are never mixed)
- **Done when:** field.md gives p75 LCP, INP and CLS by page and device with the collection window, marks which are page-level and which store-level, and shows the weekly trend with dates of known changes.

### 3. Lab tests, middle of several runs

Runs Lighthouse on each chosen page for phones 3 to 5 times with the same settings and keeps the middle result, because single runs jump around. It saves the raw reports so the after test can be run the same way. Lab tests find causes; they do not replace real-visitor data.

- **Needs:** baseline/field.md; local Lighthouse or Lighthouse CI, or the PageSpeed Insights API
- **Makes:** baseline/lab.md
- **Checks:** lab-numbers (every median in lab.md is the middle of its saved runs)
- **Done when:** lab.md gives the median LCP, CLS and total blocking time per page with the run count, device setting and date, and names where the raw reports are saved.

### 4. Causes and fix list

Finds what makes each slow page slow: a lazy-loaded main image, images without sizes, render-blocking app scripts, heavy fonts, leftover code from removed apps, layout shifts from late banners. Ranks fixes by sales at risk on that page type divided by the work, and writes each as a change request for an unpublished theme copy, with its risk and undo. Any app removal is listed on its own, because removing an app can delete its data and lose a feature.

- **Needs:** baseline/field.md; baseline/lab.md; intake.md
- **Makes:** fix-list.md, change-requests.md
- **Checks:** diagnosis-review (each cause is shown in the lab report or the theme code, each fix can be built on a theme copy as written, and app removals are listed apart with what is lost)
- **Done when:** fix-list.md ranks each fix with its cause, page types, expected gain, effort, risk and undo, and change-requests.md has one request per fix.
- **You sign off:** You pick which fixes to make this time, and decide on any app removal knowing what feature is lost. Reply yes with the code to approve the list as written, or say which to drop. Each app removal needs its own yes later, one at a time.

### 5. Build the fixes on an unpublished copy

Shows you a build plan, then on your yes makes the approved fixes on an unpublished copy of your live theme, keeping a copy of every original file. Nothing shoppers see changes. It runs Theme Check on the result.

- **Needs:** change-requests.md (signed off); an unpublished copy of the live theme; Shopify connector at level 2, or the Shopify CLI in Claude Code
- **Makes:** build-record.md
- **Checks:** theme-check (Theme Check reports no new errors on the changed files); code-review (only the approved fixes were made, originals are saved, nothing was removed that a section or app still needs, and no new script was added)
- **Goes live:** Nothing goes live. Through the Shopify connector or the Shopify CLI (shopify theme push to the named unpublished theme): the changed theme files are written to the unpublished copy only.
- **Done when:** Every step of the build plan ran once and was read back, and build-record.md lists the theme copy id and each file changed with its original saved.

### 6. Before and after, for your sign-off

Runs the same lab test, same pages, same settings, same run count, on the theme copy's preview and on the live theme, and puts the medians side by side. Renders each changed page at phone and desktop sizes from saved copies, so a fix that broke the look is caught. If delivering a patch, run node tools/verify-patch.mjs <patch> <before-directory> <after-directory>: apply the exact diff to an isolated baseline and verify the resulting file bytes match the delivered fixed files. A missing Git executable means this check did not run. Then writes the release plan it will show you: which files go live and how, and how to undo.

- **Needs:** build-record.md; baseline/lab.md; preview link of the theme copy
- **Makes:** before-after.md, preview/page.html, release-plan.md
- **Checks:** before-after-numbers (every before and after median and difference recomputes from the saved runs); render (each changed page renders at phone and desktop sizes with no HORIZONTAL OVERFLOW); visual-review (the changed pages look the same as the live pages except for planned changes, and nothing shifts as the page loads)
- **Done when:** before-after.md shows the median of the same number of runs for each page before and after, every fix is shown to help or is dropped, and the renders show no visual change except the planned ones. Any delivered patch has a successful applicability and exact-result check; browser measurements alone cannot establish that a diff applies.
- **You sign off:** You see the before and after table, the page pictures and the release plan. Reply yes with the code to send it to publish, or say what to change.

### 7. Publish the fixes

Shows you the publish plan and runs it on your yes. The safer way pushes only the changed files to the live theme, so content edits made on the live theme since the copy was taken are kept. The other way publishes the whole copy after a backup copy of the live theme exists. If you use only the Shopify connector, which cannot write to or publish the live theme, you publish from the theme library and the agent checks it. Undo: push the saved originals back, or republish the backup theme.

- **Needs:** release-plan.md (signed off); Shopify CLI in Claude Code, or you for the publish step
- **Makes:** publish-record.md
- **Goes live:** Through the Shopify CLI: shopify theme push to the live theme id with --only for each changed file and --nodelete, which needs --allow-live; or shopify theme publish for the fixed copy after a backup copy exists. Shoppers get the faster pages from this step.
- **Done when:** Every step of the publish plan ran once and was read back, and publish-record.md lists the live theme id, the files changed, the backup theme id and the time.

### 8. Check the live store

Straight after publishing, runs the lab test on the live pages the same way as before, opens each on a phone-sized render, and checks a shopper can still add to cart and reach checkout. If anything broke, it stops and shows you the undo plan.

- **Needs:** publish-record.md; before-after.md
- **Makes:** live-check.md
- **Checks:** live-verify (the live pages match the preview, add to cart and the path to checkout work on phone and desktop, and only the planned files changed)
- **Done when:** live-check.md gives live lab medians next to the preview results, the cart and checkout test result, and an undo plan for anything that failed.

### 9. Real-visitor re-check after 28 days

Once a full 28-day window has passed since release, plus about 2 days for the data to arrive, reads CrUX again for the same pages and devices and compares with the baseline. Also reads conversion rate and add-to-cart rate for the changed page types from GA4 as a guardrail. Adds a dated lesson to context/learnings.md on which fixes paid off.

- **Needs:** baseline/field.md; publish-record.md; CrUX API; GA4 through the Analytics MCP
- **Makes:** results/field-28.md
- **Checks:** recheck-numbers (every before and after figure recomputes from its saved CrUX and GA4 inputs); recheck-review (the after window starts after the release date, both windows are 28 days, and the lesson credits only fixes the data supports)
- **Done when:** field-28.md gives p75 LCP, INP and CLS before and after by page and device with both windows, the guardrail read, and the lesson appended to context/learnings.md.

## Where you step in

- **Causes and fix list:** You pick which fixes to make this time, and decide on any app removal knowing what feature is lost. Reply yes with the code to approve the list as written, or say which to drop. Each app removal needs its own yes later, one at a time.
- **Build the fixes on an unpublished copy:** approve the exact plan of live changes
- **Before and after, for your sign-off:** You see the before and after table, the page pictures and the release plan. Reply yes with the code to send it to publish, or say what to change.
- **Publish the fixes:** approve the exact plan of live changes

## How we judge it

- Main number from context/goals.json first. For a speed job, the target is the share of phone visits that pass all three Core Web Vitals.
- Real-visitor speed at the 75th percentile on phones, by page type: LCP 2.5 seconds or less, INP 200 milliseconds or less, CLS 0.1 or less.
- Guardrail: conversion rate and add-to-cart rate for the changed page types do not fall after release.
