---
name: pick-a-lean-app-stack
description: "Picks the few apps a Shopify store needs at its current stage, free and built-in options first, with a short do-not-install list and the reason for each. Sorts every job (reviews, email and SMS, support, shipping and tracking, local payments and checkout, tax invoices, analytics, upsells) into built-in, free app, paid app or not yet, checks each candidate for speed cost, data permissions, lock-in and exit path, and sets a monthly budget cap tied to gross profit. Use for a new store choosing apps, a store with a long app list and a slow theme, or before adding any paid app."
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
4. **Market**: which countries the store sells to, and payment mix (cards, wallets, buy now pay later, local methods, pay on delivery share where used).

Optional: PageSpeed Insights for home and top product page, list of jobs the team does by hand each week.

Reading the app list is level 1. Installing or uninstalling is a live change: draft the list, the client approves each install and removal.

## Before you start: the gates

1. **Gross profit per order known.** Each paid app must return more gross profit than it costs [MEA-0037]. Fail: allow only built-in and free tools until it is known.
2. **Cash cap.** The client names the most they will spend on apps a month. Fail: use 1% to 3% of monthly gross profit as a working cap (practitioner default, test it) and say so.
3. **One job, one app.** Two apps doing one job (two review apps, two popup tools) is an automatic fail; pick one before adding anything.

## Steps

### 1. List the jobs, not the apps

Write the jobs the store has to get done this quarter. Typical ones: take payment, ship and track, collect reviews, send email and SMS, answer customers, show bundles or upsells, report numbers, prevent fraud, and where they apply, pay on delivery control, tax invoices and WhatsApp or SMS updates. A job nobody does yet does not need an app yet.

### 2. Fill each job from the cheapest layer that works

Check the layers in order and stop at the first that does the job:

1. **Built into Shopify or the theme**: cart drawer, collections, discounts, gift cards, basic analytics, order risk analysis.
2. **Shopify's own free apps**: Search and Discovery (filters, related products), Forms (sign-ups), Inbox (chat), Flow (automations and risk routing), Email (small lists), Translate and Adapt (languages).
3. **Free tier of a trusted app** with a clear limit.
4. **Paid app**, only when the free layers fail a named need.

Before any paid app, check what Shopify's free layer covers today (it changes, so re-check in the app store): Search and Discovery covers filters, recommendations, predictive search and synonyms, so an old paid filter app can usually go; Translate and Adapt covers two languages; Shopify's free bundles app keeps stock in sync but has limits on bundle types; Shopify's free subscriptions app suits goods bought again and again (coffee, supplements, skincare), not one-off purchases; Inbox covers chat until the catalogue and question volume justify an AI chat tool; Shopify Messaging includes a monthly allowance of free emails, and abandoned checkout emails are always free. Paid tools still earn a place for complex discounts or advanced bundles: the rule is add on need, not ban.

**Start from three must-haves only:** reviews, email, and tracking or analytics. Every other app has to show the job it does.

### 3. Stage guide

Practitioner default, test it:

- **Pre-launch and first sales:** payments, shipping, one reviews tool, one email tool, chat or WhatsApp, analytics. Some markets add a pay on delivery control or a tax invoice tool. About 5 to 7 apps.
- **Steady:** add an upsell or bundle tool if the offer model says it pays (`offer-bundle-threshold-design`), a helpdesk if tickets pass what one inbox handles, and a returns portal.
- **Scaling:** subscriptions if repeat use exists, a server-side tracking route, and inventory planning. An ERP rarely makes sense before about $30M to $50M revenue [OPS-0011].

### 4. Check each candidate on five tests

Score pass or fail; one fail removes the app unless the client accepts it in writing.

1. **Pays for itself.** Expected added gross profit a month (extra orders or order value x margin) is greater than the fee plus usage charges.
2. **Speed.** Most app scripts enter through the theme head; code pasted straight into the head blocks rendering [SPD-0011]. Apps that inject elements after load cause layout shift; prefer theme-native sections [SPD-0007]. Quick-view style features can load data for every product on a grid [SPD-0012]. Ask: does it load on every page or only where used?
3. **Visible to search and AI.** Review and FAQ widgets loaded by JavaScript after page load are invisible to most AI crawlers [AEO-0002]. Prefer apps that render reviews in the page or as structured data.
4. **Permissions.** Read the access the app asks for at install. An upsell app does not need customer data export; a review app does not need to edit orders.
5. **Exit path.** Can the data (reviews, subscribers, subscriptions) be exported to CSV? Does uninstalling leave code? Uninstalled apps often leave script tags in theme files [SPD-0009].

Then vet the maker of every app that stays or is new (practitioner bar, adjust if the client chooses):

- Rated 4 stars or better, ideally 4.5, on at least 100 reviews.
- Recent reviews read for repeated complaints (support silence, billing surprises, broken after theme updates).
- The developer's other apps looked at; one well-kept app from an unknown maker is a risk to note.
- The Built for Shopify badge, where the app category has it.
- A demo store and a reply from support before install, where possible.

A newer app with few reviews can be right when it offers a rare feature; mark it "risk chosen by client" rather than failing it silently.

### 5. Watch the checkout

Since checkout extensibility, scripts cannot run in the checkout on most plans, and client-side tools cannot test it [CRO-0016]. Do not buy an app whose main promise is changing the checkout unless it is built as a checkout extension and the plan supports it.

### 6. Market notes: payments, invoices and messaging

- Pay on delivery control (order limits, postcode blocks, confirmation calls or messages), where the store offers it, is usually worth a paid tool once those orders are a real share; compare against doing it with Flow and tags first. Rules belong in `cut-rto-on-cod-orders`. Card stores need fraud filters instead, and Shopify's built-in fraud analysis comes first.
- WhatsApp messages need an approved business provider; pick one with template approval and opt-in handling (`sms-and-whatsapp-compliance-setup`).
- Tax invoices: where local law needs a tax invoice Shopify does not make, one invoice tool is required. UK and EU stores selling across borders need VAT handled per country; check Shopify's built-in VAT settings and the EU One Stop Shop before any app.
- Local payment methods (iDEAL, Klarna, Afterpay, Bancontact and the like) usually come through the payment provider, not a separate app.

### 7. US notes

- Sales tax: use Shopify's built-in tax before any tax app; add one only if the accountant needs filings automated.
- SMS: pick a provider that handles consent and quiet hours.

### 8. Write the do-not-install list

Name each kind of app the store should not add now, with the reason: fake sales popups or "someone just bought" notices that are not real (misleading claims), countdown timers that reset, a second popup tool, page builders on a store with a working theme, any app that asks for full access without a reason, and anything bought to fix a problem nobody has measured.

### 8b. Install in order, one at a time

Install one app at a time, as the need appears, never a batch. After each install: turn it on in the theme's app embeds (Online Store, Themes, Customize, App embeds), or it will not show; check the page on a phone; and run PageSpeed on the page it loads on, three runs averaged, against the number before. If the score or the LCP got worse, ask whether the job is worth it before the next install. Review apps: set the request email delay by how long the product takes to try (days for a consumable, weeks for skincare or a mattress), brand the request email before sending to past buyers, and choose "hold reviews until approved" if the client wants control.

**Before cutting or swapping a review or email app,** export the reviews and the email flows and lists first. Replacing one without an export can lose years of reviews or break every automated flow at once.

### 8c. Score the stack

Score how light and safe the stack is, out of 100 (our own scale): start at 100; take off 10 for each dead app (disabled, never switched on or no longer used, which is the first thing to cut), 10 for each paid app a free built-in already covers, 5 for each kept app below the vetting bar, and 5 for any app with no stated job. Stop at 0, show the sum, and list any check you could not run as not run rather than passed. Give the score now and after the change list.

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
- Every kept or new app shows its vetting result (rating, review count, recent complaints, maker, badge) or "risk chosen by client".
- The stack score shows its sum, now and after the changes.
- Any review or email app on the cut or swap list has an export step before removal.

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
- **Installing five apps in one afternoon.** Step 8b installs one at a time and measures speed after each.
- **Forgetting the app embed.** Step 8b switches it on in the theme, or the app silently does nothing.
- **Swapping a review app without an export.** Step 8b exports reviews and flows first.

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

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. COD control (order limits, pincode blocks, OTP or confirmation) is usually worth a paid tool once COD is a real share of orders. GST invoices: Shopify does not make them, so one GST invoice tool is required. WhatsApp updates need an approved provider.
