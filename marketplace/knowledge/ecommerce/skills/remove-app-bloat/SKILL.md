---
name: remove-app-bloat
description: "Lists every app and piece of leftover code that loads on a Shopify storefront, measures what each one costs in page weight, main-thread time and layout shift with free browser tools, weighs that against what the app earns and costs a month, and decides keep, replace with a native feature, or remove. Then gives a safe cleanup plan: export app data first, work on a theme copy, remove leftover snippets and script tags, test checkout, tracking and key flows, publish with a rollback ready, and re-measure. Use when the store has many apps, after uninstalling apps, when speed tests blame third-party code, or when app bills keep growing."
---

# Remove app bloat

**You get:** an app and code inventory (every app and leftover snippet that touches the storefront, with its measured weight and speed cost, monthly bill and what it earns), a keep, replace or remove decision for each with the reason, a step-by-step cleanup plan with data exports and rollback, and before and after speed numbers.

## When to use

- The store has more than about 10 apps, or nobody knows what half of them do.
- Speed tests list many third-party scripts, or layout jumps when bars and badges load.
- Apps were uninstalled but the theme still loads their code.
- Monthly app bills have grown and the owner wants to cut without breaking sales.

## Not for

- Choosing the right apps for a new or young store: use `pick-a-lean-app-stack`.
- A full speed audit of every template: use `shopify-speed-audit-and-fix-list`.
- Staff and app permission reviews: use `lock-down-store-staff-and-app-access`.
- Building a native section to replace an app: use `shopify-theme-section-builder`.

## What you need

Required:

1. **Installed apps list** (Shopify admin > Settings > Apps and sales channels) with each app's monthly charge from the billing page.
2. **Theme access** to view code and duplicate the theme (draft access, level 2).
3. **Live store URL** and the top 5 templates by sessions (home, top collection, top product, top landing page, cart).
4. **What each app is for**, from the owner or team: who uses it, what breaks without it.
5. **App results where reported:** reviews collected, upsell revenue, email signups, chats handled.

Optional: past uninstalled apps (from staff memory or old invoices), any custom code added by agencies.

Measuring needs only read access (level 1). Duplicating the theme and editing the copy needs draft access. Uninstalling apps, cancelling plans, deleting code from the live theme and publishing need the client's yes, app by app.

## Before you start: the gates

1. **Know what each app does before judging it.** An app with no known owner or purpose is not removed until someone checks for hidden uses (checkout rules, subscriptions, tracking, fulfilment sync, tax).
2. **Data is exported first.** Reviews, subscriber lists, loyalty points, subscription contracts, wishlist data and form entries are exported or migrated before any uninstall. Fail: no uninstall.
3. **Never edit the live theme directly.** Work on a duplicate; keep the current live theme as the rollback.
4. **Tracking stays intact.** Meta, Google and other pixels are not removed as a speed fix; defer non-essential app scripts instead [SPD-0009].
5. **Subscriptions and checkout apps** (recurring billing, checkout customizations, payment rules) need a migration plan, not a removal, unless the client confirms they are unused.

## Steps

### 1. Build the inventory

List every app and its storefront footprint:

- **App embeds:** Theme editor > App embeds (toggles).
- **App blocks:** sections and blocks added through the theme editor.
- **Code in theme files:** search theme files (layout/theme.liquid, snippets, sections, assets) for each app's name and domain; most older app code enters through the head [SPD-0011]. Snippets named after apps are a common sign.
- **Leftover code from removed apps:** uninstalling an app often leaves its script tags or snippets in the theme [SPD-0009]; Shopify's help centre also notes that some apps leave code that is not removed automatically.
- **Scripts with no app:** any third-party domain loading on the page that no current app explains (old pixels, chat widgets, agency scripts).

### 2. Measure each app's cost

With free tools, on mobile settings, for the top templates:

- **PageSpeed Insights:** the third-party code section lists each provider's transfer size and main-thread time.
- **Chrome DevTools Network panel:** filter by each app's domain for requests and kilobytes.
- **Block and compare:** in DevTools, block an app's domains and re-run the lab test 3 times; the change in median LCP, total blocking time and CLS is that app's speed cost.
- **Layout shift:** apps that inject bars, badges or pop-ups after load are the usual cause of shift [SPD-0007].

As context, a large Shopify sample found stores with 0 to 5 third-party services had a median mobile score of 74, against 44 for stores with 21 to 30 [SPD-0001]. The store's own block-and-compare numbers decide.

### 3. Weigh what each app earns

For each app: monthly bill + speed cost (as measured) against what it earns or saves. Use the app's own reports with care; apps tend to credit themselves for sales that would have happened. Where an app claims revenue (upsells, pop-ups, recommendations), ask for its take rate and order value added, and check it against a holdout or an off week where the app allows it.

### 4. Decide keep, replace or remove

| Decision | When |
|---|---|
| **Keep** | Earns clearly more than its bill and speed cost, and nothing native does the job |
| **Keep, but slim** | Needed, but loads on every page: limit it to the pages that use it, defer its script, turn off unused features |
| **Replace** | A theme feature, a Shopify free app or a small native section does the same job with less code (for example a free-shipping bar, size chart, FAQ accordion, trust icons, simple product badges, quick view [SPD-0012]) |
| **Remove** | Unused, duplicated by another app, or costs more than it earns |
| **Clean up** | Leftover code from apps already uninstalled |

Order the work: leftover code and unused apps first (no business risk), then slimming, then replacements, then removals of apps that earn something.

### 5. Plan each cleanup safely

For each app being removed or replaced:

1. Export its data and store the file with a date.
2. Cancel or downgrade the plan in the app first if needed; note that uninstalling may still bill the current cycle, and charges billed outside Shopify must be cancelled with the vendor.
3. On the duplicate theme: turn off its app embed, remove its blocks, delete its snippets and the lines that include them, and remove its script tags. Keep a note of every file and line changed.
4. Build any replacement (native section via `shopify-theme-section-builder`).
5. Test on the copy: home, collection, product (each variant type), cart drawer, discount codes, checkout in test mode, account pages, and that pixels still fire purchase events.
6. After the client's yes: uninstall the app, publish the copy, keep the old theme unpublished as rollback for 14 days.

### 6. Re-measure

Run the same lab tests (median of 3) on the published theme and compare with Step 2. Re-read field Core Web Vitals 28 days after release, since field data is a rolling sample [SPD-0005]; the target is LCP 2.5 seconds or less, INP 200 ms or less and CLS 0.1 or less at the 75th percentile [SPD-6183]. Track monthly app spend before and after.

### 7. Keep it clean

Add a rule to the store's notes: every new app gets an owner, a purpose, a 30-day review date and a speed check before and after install. Review the inventory every quarter.

### 8. India and US notes

- **India:** COD verification, pincode checker, WhatsApp chat and one-click checkout apps often each load scripts on every page; keep the ones that earn, limit them to product, cart and checkout-related pages, and check they do not duplicate one another.
- **US:** consent banners, accessibility overlays and several review or loyalty widgets are common; check whether the theme or one app can cover what three apps do now. Keep any consent tool the store's privacy obligations need.

## Checks before you hand it over

- Every app and every third-party script on the storefront is in the inventory, including leftovers.
- Each app's speed cost comes from block-and-compare or provider data, not guesswork.
- Each decision states the reason and what replaces the app's job, if anything.
- Data exports are listed for every app being removed.
- The cleanup plan uses a theme copy, lists every file changed and keeps a rollback.
- Pixels and purchase tracking were tested after cleanup.
- No uninstall, cancellation or publish without the client's yes, app by app.

## Output

**One-screen summary:** number of apps and leftover scripts found, monthly app spend, apps to remove or replace, expected lab gain on mobile, monthly savings, and the first 3 actions.

**Inventory and decision sheet:**

| App or script | Purpose | Owner | Pages loaded on | Requests | KB | Main-thread time | LCP or CLS cost (block test) | Monthly bill | Earns or saves (evidence) | Decision | Replacement | Data to export | Risk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Cleanup plan:** #, App, Step, File or setting, Done on copy (yes or no), Tested (flows listed), Approved, Published date.

**Before and after:** Template, Lab LCP, TBT, CLS, page weight (before, after), Field re-read date.

## Common mistakes

- **Uninstalling and assuming the code is gone.** Step 1 searches theme files for leftovers.
- **Losing reviews or subscriber data.** Gate 2 exports first.
- **Removing tracking for a better score.** Gate 4 keeps pixels and defers other scripts.
- **Trusting an app's own revenue claim.** Step 3 checks with a holdout or off week.
- **Editing the live theme.** Gate 3 and Step 5 use a copy with rollback.
- **Removing an app that runs a hidden job.** Gate 1 checks every app's purpose first.

## Sources

- SPD-0001: fewer third-party services, higher mobile scores.
- SPD-0005: field data is a rolling 28-day sample.
- SPD-0007: apps injecting elements cause layout shift.
- SPD-0009: leftover app script tags; defer non-essential scripts, never pixels.
- SPD-0011: code pasted into the theme head blocks rendering.
- SPD-0012: quick view preloads product data for every card.
- SPD-6183: Core Web Vitals thresholds at the 75th percentile.

What makes this skill ours: each app's speed cost is measured by blocking its domains and re-running the lab test, not guessed from its reputation; app revenue claims are checked with a holdout or off week; data exports, a theme copy, a full flow test and a 14-day rollback come before any uninstall; and leftover code from apps removed years ago is hunted down file by file.
