---
name: store-page-tests-and-custom-pages
description: Plans and runs store page tests and audience pages on both stores - Apple product page optimization tests and Google Play store listing experiments (one change per test, hypothesis, audience share, stopping rule), Apple custom product pages and Google Play custom store listings matched to ads, links and audiences, and App Store in-app events for real happenings in the app. Sets up drafts at access level 2; starts and stops tests, applies winners and publishes pages and events from the agreed list only at level 3 within the client's limits. Use it after a listing rewrite, before a campaign, for a seasonal moment, or when one page has to serve very different audiences.
---

# Store page tests and custom pages

## When to use

- A new listing or new screenshots are ready and the client wants proof before rolling them out.
- An ad campaign, email or partner link talks to one audience and should land on a page made for it.
- The app has a real event coming: a new season, a challenge, a live session or a big update.
- Lapsed users or a new country need a different first impression.

## What you need

1. The current listing and the candidate assets (icon, screenshots, preview video, text).
2. Page views and conversion for the last 90 days from App Analytics and Play Console, by source and country if possible.
3. The campaigns or links that will send traffic, and who each one targets.
4. For icon tests on the App Store: whether the developer can ship alternate icons in the next binary.
5. Access: level 1 to read results. Level 2 to set up tests, pages and events in draft. Level 3, within the client's limits, to submit and start tests, apply winners and publish pages and events from the agreed list.

## Steps

### 1. Choose the question

Write one hypothesis per test: "If the first screenshot shows the week view instead of the logo, more page visitors will install, because reviews say the week view is why they stay." One change per test: icon, or first screenshot, or short description. Never two.

### 2. Pick the tool (facts as of 6 November 2026)

**Apple product page optimization**
- Up to three treatments against the original; tests icons, screenshots and previews; shown on iOS and iPadOS 15 or later.
- One test at a time, up to 90 days, and it can't be changed once started.
- Treatments are reviewed by App Review. Tests without alternate icons can be submitted without a new app version; alternate icons must already be in the binary.
- Not available on custom product pages. Releasing a new app version that changes the tested assets during a test can spoil results.

**Google Play store listing experiments**
- One default graphics experiment (icon, feature graphic, screenshots) or up to five localized experiments (which can also test descriptions) at once.
- Up to two variants against the current listing. You set audience share, minimum detectable effect and confidence level; Google's defaults aim for the shortest time to a reasonably accurate result.
- Results show as install, open or pre-registration clicks per variant. Experiments stop after 6 months; the app must be published.

### 3. Set the stopping rule before starting

- Apple suggests waiting until a treatment is better or worse than the baseline with at least 90% confidence. Applying a treatment ends the test.
- On Play, wait until the result is no longer "More data needed". A draw means keep the current listing unless the variant is better for another reason.
- Write down: the metric, the confidence needed, the longest you'll wait, and who decides. Use the `growth-marketer` kit's experiment sizing if the client wants a traffic estimate.

### 4. Plan audience pages

**Apple custom product pages**
- Up to 70 per app. Each can change screenshots, previews, promotional text and keywords, and gets its own URL.
- Use keywords unique to each page so the right page appears in search; keywords come from the latest approved version.
- Add a deep link to the matching screen for iOS and iPadOS 18 or later; test it from the Notes app.
- Pages are reviewed, independent of an app update. Metrics show after at least five first-time downloads.
- Apple Ads can use custom pages for ad variations.

**Google Play custom store listings**
- Up to 50. Each can change name, icon, descriptions and graphics.
- Target by country (one custom listing per country), pre-registration, churned users, lapsed users (28 days), buyer groups, lapsed buyers (180 days), ads traffic, search keywords or custom audiences.
- Ads-traffic listings currently show only on AdMob. Translate each listing yourself.

Map each page to one audience and one source: "Ad group: night-shift nurses, Apple Ads Today tab, page 'night-shift'".

### 5. Plan in-app events (App Store)

- Only for real, timed happenings: challenge, competition, live event, major update, new season, premiere, special event. Not daily tasks or price cuts.
- Up to 15 approved and 10 published at once; up to 31 days long; promoted up to 14 days before start.
- Name 30 characters, short description 50, long description 120. No prices in the text.
- Event card image or video 16:9, details image or video 9:16. Deep link with a universal link where possible.
- Choose the purpose (all users, new users, active users, lapsed users) and a priority.

### 6. Act at the right level

- Level 2: build tests, pages, listings and events in draft.
- Level 3, after the client's yes on the action list: submit and start tests; publish pages, listings and events on the agreed list; apply a winner that met the stopping rule.
- Fresh yes every time: deleting a custom product page (permanent), any page that shows a price or offer, and anything needing a new app version.
- Log each start, stop and change with the date.

### 7. Read and report

- Report the result against the rule you wrote, not the best-looking day.
- Note anything that could have skewed it: an app update, a feature on the store, a big campaign.
- Recommend: apply, keep, or test again with a sharper change.

## Checks

- One change per test, with a written hypothesis and stopping rule.
- No App Store test overlaps a version that changes the tested assets.
- Alternate icons are in the binary before an Apple icon test.
- Every custom page or listing has one audience, one traffic source, and unique keywords.
- In-app events are real, timed and free of prices in the text.
- Every asset follows the store rules: real app screens, no ranking or price claims.
- Every live action is on the client's approved list.

## Output format

1. Test card per test: hypothesis, store, tool, asset changed, audience share, metric, stopping rule, longest wait, owner.
2. Audience page plan: page name, audience, traffic source, assets, keywords, deep link.
3. In-app event sheet: badge, dates, name, short and long description with counts, media, deep link, purpose.
4. Action list for level 3, and the fresh-yes items.
5. Results report: outcome against the rule, caveats, next step.

## Example of good output (short)

*Made-up app for illustration: "Nightowl Rest", a sleep app for shift workers.*

> **Test card**
> Hypothesis: a first screenshot showing "Sleep after a night shift" will beat the logo frame for page visitors, because 22 of 80 reviews mention night shifts.
> Store and tool: App Store, product page optimization, one treatment, 50% of traffic.
> Metric: conversion rate. Stopping rule: 90% confidence or 60 days, then call it a draw. Owner: client's marketing lead.
>
> **Audience page**
> | Page | Audience | Source | Keywords | Deep link |
> |---|---|---|---|---|
> | night-shift | Nurses and carers on nights | Apple Ads Today tab, hospital staff newsletter | night shift sleep, day sleep | Wind-down screen |
>
> **In-app event:** badge Challenge, 1 to 14 March, "7-Night Reset" (13), short "Seven wind-downs to reset after nights" (38).
