---
name: pick-a-lean-app-stack
description: "Picks the few apps a Shopify store needs at its current stage, free and built-in options first, with a short do-not-install list and the reason for each. Sorts every job (reviews, email and SMS, support, shipping and tracking, COD and India checkout, analytics, upsells) into built-in, free app, paid app or not yet, checks each candidate for speed cost, data permissions, lock-in and exit path, and sets a monthly budget cap tied to gross profit. Use for a new store choosing apps, a store with a long app list and a slow theme, or before adding any paid app."
---

# A lean app stack

**You get:** a one-page app stack for the store's stage (usually 5 to 9 apps), each line with job, choice, free alternative, monthly cost, scripts added, permissions and exit plan, plus a do-not-install list and a monthly app budget cap, ready for the client to approve.

## When to use

- A new store is about to install its first apps.
- The app list has grown past what anyone can explain, and costs keep rising.
- A vendor is pitching a paid app and the owner wants a second opinion.
- The store is moving stage (first sales, steady sales, scaling) and its needs changed.

## Not for

- Finding and removing apps and leftover code that slow the current theme: use `remove-app-bloat`.
- A full speed audit: use `shopify-speed-audit-and-fix-list`.
- Reviewing what installed apps can access and who installed them: use `lock-down-store-staff-and-app-access`.
- Choosing a helpdesk in depth: use `set-up-helpdesk-and-response-times`.

## What you need

Required:

1. **Installed apps list** from Settings, Apps (name, monthly charge from the billing page, date installed).
2. **Monthly orders and gross profit per order** (`store-meta-math`).
3. **Stage**, from the last 3 months of orders: pre-launch, first sales (under about 300 orders a month), steady, or scaling. These bands are a practitioner default; adjust to the store.
4. **Market**: India, US or both, and payment mix (COD share for India).

Optional: PageSpeed Insights for home and top product page, list of jobs the team does by hand each week.

Reading the app list is level 1. Installing or uninstalling is a live change: draft the list, the client approves each install and removal.

## Before you start: the gates

1. **Gross profit per order known.** Each paid app must return more gross profit than it costs [MEA-0037]. Fail: allow only built-in and free tools until it is known.
2. **Cash cap.** The client names the most they will spend on apps a month. Fail: use 1% to 3% of monthly gross profit as a working cap (practitioner default, test it) and say so.
3. **One job, one app.** Two apps doing one job (two review apps, two popup tools) is an automatic fail; pick one before adding anything.

## Steps

### 1. List the jobs, not the apps

Write the jobs the store has to get done this quarter. Typical ones: take payment, ship and track, collect reviews, send email and SMS, answer customers, show bundles or upsells, report numbers, prevent fraud, and for India, COD control and WhatsApp updates. A job nobody does yet does not need an app yet.

### 2. Fill each job from the cheapest layer that works

Check the layers in order and stop at the first that does the job:

1. **Built into Shopify or the theme**: cart drawer, collections, discounts, gift cards, basic analytics, order risk analysis.
2. **Shopify's own free apps**: Search and Discovery (filters, related products), Forms (sign-ups), Inbox (chat), Flow (automations and risk routing), Email (small lists), Translate and Adapt (languages).
3. **Free tier of a trusted app** with a clear limit.
4. **Paid app**, only when the free layers fail a named need.

### 3. Stage guide

Practitioner default, test it:

- **Pre-launch and first sales:** payments, shipping, one reviews tool, one email tool, chat or WhatsApp, analytics. India adds a COD control and a GST invoice tool. About 5 to 7 apps.
- **Steady:** add an upsell or bundle tool if the offer model says it pays (`offer-bundle-threshold-design`), a helpdesk if tickets pass what one inbox handles, and a returns portal.
- **Scaling:** subscriptions if repeat use exists, a server-side tracking route, and inventory planning. An ERP rarely makes sense before about $30M to $50M revenue [OPS-0011].

### 4. Check each candidate on five tests

Score pass or fail; one fail removes the app unless the client accepts it in writing.

1. **Pays for itself.** Expected added gross profit a month (extra orders or order value x margin) is greater than the fee plus usage charges.
2. **Speed.** Most app scripts enter through the theme head; code pasted straight into the head blocks rendering [SPD-0011]. Apps that inject elements after load cause layout shift; prefer theme-native sections [SPD-0007]. Quick-view style features can load data for every product on a grid [SPD-0012]. Ask: does it load on every page or only where used?
3. **Visible to search and AI.** Review and FAQ widgets loaded by JavaScript after page load are invisible to most AI crawlers [AEO-0002]. Prefer apps that render reviews in the page or as structured data.
4. **Permissions.** Read the access the app asks for at install. An upsell app does not need customer data export; a review app does not need to edit orders.
5. **Exit path.** Can the data (reviews, subscribers, subscriptions) be exported to CSV? Does uninstalling leave code? Uninstalled apps often leave script tags in theme files [SPD-0009].

### 5. Watch the checkout

Since checkout extensibility, scripts cannot run in the checkout on most plans, and client-side tools cannot test it [CRO-0016]. Do not buy an app whose main promise is changing the checkout unless it is built as a checkout extension and the plan supports it.

### 6. India notes

- COD control (order limits, pincode blocks, OTP or confirmation) is usually worth a paid tool once COD orders are a real share; compare against doing it with Flow and tags first. Rules belong in `cut-rto-on-cod-orders`.
- WhatsApp messages need an approved business provider; pick one with template approval and opt-in handling (`sms-and-whatsapp-compliance-setup`).
- GST invoices: Shopify does not make them, so one invoice tool is required.

### 7. US notes

- Sales tax: use Shopify's built-in tax before any tax app; add one only if the accountant needs filings automated.
- SMS: pick a provider that handles consent and quiet hours.

### 8. Write the do-not-install list

Name each kind of app the store should not add now, with the reason: fake sales popups or "someone just bought" notices that are not real (misleading claims), countdown timers that reset, a second popup tool, page builders on a store with a working theme, any app that asks for full access without a reason, and anything bought to fix a problem nobody has measured.

### 9. Set the review rhythm

Monthly: app bill against the cap, each app's job still needed, and scripts still loading for apps that were removed. Hand removals to `remove-app-bloat`.

## Checks before you hand it over

- Each job has exactly one tool; no duplicates.
- Every paid app shows expected gross profit added and beats its fee.
- Every line shows the free or built-in alternative considered.
- Every app has a data export path and an uninstall clean-up note.
- Total monthly app cost is under the client's cap.
- The do-not-install list has at least 4 lines with reasons.
- No app is installed or removed without a client yes.

## Output

**One-screen summary:** stage, number of apps (now and proposed), monthly cost (now and proposed), the 3 biggest changes, and the cap.

**App stack table:**

| Job | Choice | Layer (built-in, Shopify free, free tier, paid) | Free alternative checked | Monthly cost | Pays back how | Loads on (all pages, some, none) | Permissions asked | Export and exit | Decision |
|---|---|---|---|---|---|---|---|---|---|

**Do-not-install list:** App type, Why not, What to do instead.

**Change list for approval:** numbered installs and removals, each with the clean-up step.

## Common mistakes

- **Apps before jobs.** Step 1 lists jobs first.
- **Paying for what Shopify already does.** Step 2 checks built-in and Shopify's free apps before any paid one.
- **Ignoring script cost.** Step 4, test 2, asks where each app loads [SPD-0011].
- **Reviews nobody can crawl.** Step 4, test 3 [AEO-0002].
- **Uninstall and forget.** Leftover code keeps loading [SPD-0009]; step 9 checks monthly.
- **Fake urgency apps.** Step 8 bans them.

## Sources

- MEA-0037: gross margin uses delivered cost.
- OPS-0011: ERP threshold around $30M to $50M revenue.
- SPD-0007: apps that inject elements after load cause layout shift.
- SPD-0009: uninstalled apps leave script tags.
- SPD-0011: how app scripts enter the theme head.
- SPD-0012: quick view preloads product data.
- AEO-0002: JavaScript-loaded review widgets are invisible to AI crawlers.
- CRO-0016: checkout extensibility limits checkout scripts and testing.

What makes this skill ours: apps are chosen job by job from the cheapest layer that works; every paid app has to beat its fee in gross profit; each one is checked for speed, crawlability, permissions and exit; and there is a written do-not-install list, including fake urgency tools.
