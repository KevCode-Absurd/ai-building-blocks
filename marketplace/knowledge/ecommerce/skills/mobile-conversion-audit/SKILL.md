---
name: mobile-conversion-audit
description: "A phone-first walk through the whole store the way most buyers see it: arriving from an ad or search, browsing, choosing a variant, adding to cart, paying and tracking the order, on a real mid-range phone over mobile data. Records every blocker with a screenshot, rates it blocker, major or minor, ties it to the store's own mobile versus desktop numbers, and hands over a fix list in order of gross profit at stake, with who fixes it. Covers low-end Android and slow networks for India and iPhone and wallet checkouts for the US. Use when mobile converts far below desktop, after a theme change, or before sending more paid social traffic."
---

# Mobile conversion audit

**You get:** a phone journey log with screenshots of 5 buyer paths, a blocker list (every issue rated blocker, major or minor) and a fix list of 10 to 20 items in order of gross profit at stake, each with the page, the fix, the owner and whether it is a repair or a test.

## When to use

- Mobile conversion is well below desktop and most traffic is mobile.
- A new theme, app or page builder went live and nobody has tried it on a cheap phone.
- Paid social spend is about to rise (almost all of it lands on phones).
- Support hears "the site doesn't work on my phone" or buyers send screenshots.

## Not for

- A full data-led audit of every page type on all devices: use `storefront-conversion-audit`.
- Checking only the pages Meta ads land on: use `store-meta-landing`.
- Measuring and fixing speed in depth: use `shopify-speed-audit-and-fix-list`.
- Checkout leaks in detail: use `fix-checkout-drop-off`.

## What you need

Required (read access, level 1):

1. **Mobile versus desktop numbers, last 30 days:** sessions, add-to-cart rate, checkout rate, conversion rate, order value. Shopify Analytics (by device type) or GA4 (Reports > Tech, or an exploration by device category, purchase event only).
2. **Top 5 mobile landing pages** by sessions, and the top 3 traffic sources on mobile.
3. **Live store URL** and current ads or links that send mobile traffic.
4. **Gross profit per order**, from `build-sku-profit-sheet` or `store-meta-math`.
5. **Two real phones:** a mid-range Android (for India, a phone in the price band most buyers own) and an iPhone. Free fallback when a phone is missing: Chrome DevTools device mode with network throttling, labelled as emulated.

Optional: session recordings filtered to mobile, support tickets mentioning phone or app, review text mentioning the website.

If device numbers are missing, still do the walk and rank by severity only, and say so. Fixes need draft access (level 2) on an unpublished theme copy; publishing needs the client's yes. Test orders on the live store only with the client's yes; prefer test mode.

## Before you start: the gates

1. **Gross profit per order known** [MEA-0037]. Fail: compute it, or rank by severity alone and mark the list unranked.
2. **Device data is trustworthy.** GA4 conversion rate must be filtered to purchase [MEA-0002]; Shopify sessions include bots, which sit heavily in desktop [MEA-0012]. Fail: use GA4 sessions with purchase only.
3. **Mobile matters here.** Pass when mobile is at least half of sessions or of paid clicks. If not, keep the walk short and point to `storefront-conversion-audit`.
4. **Nothing is live-edited.** All fixes are built on a theme copy.

## Steps

### 1. Size the mobile gap

Mobile gap in gross profit a month = mobile sessions x (desktop conversion - mobile conversion) x mobile share you could realistically close (working figure 25%, marked) x gross profit per order. Do the same step by step (add to cart, checkout, order) to see where mobile falls behind. This number caps what the fix list can claim.

### 2. Walk 5 buyer paths on a real phone

Clear cookies, use mobile data (or throttle to slow 4G), and screen-record each path:

1. From the top paid social ad to its landing page, to purchase.
2. From a Google search for the store's main product type, to purchase.
3. From the homepage, through the menu, to a collection, to a product.
4. A return visit with an item already in cart.
5. Order status or tracking page after a test order (if allowed).

### 3. Check each screen against the mobile checklist

**First screen of every landing page**
- Does the visitor see what it is, the price, and a way to act? On product pages: image thumbnails, rating near the title, price, add to cart and a risk reducer within the first screen [LPG-0034]; a risk reducer line directly under the button [LPG-0038].
- Does the hero image load first and fast? A lazy-loaded or faded-in hero is the most common slow-load cause on Shopify [SPD-0006].
- Does anything jump as the page loads? App bars injected after load cause most layout shift [SPD-0007].
- Core Web Vitals for the page from field data: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less at the 75th percentile [SPD-6183].

**Pop-ups and overlays**
- Anything covering the screen in the first 3 to 5 seconds is a blocker on mobile; trigger on exit, after add to cart or at scroll depth instead [LPG-0022]. Check the close button is reachable and large. Check chat bubbles and cookie banners do not cover add to cart.

**Menu and collections**
- New visitors open the menu first: bestsellers at the top, contact and FAQ lower [LPG-0061]. Collection grids show about four products on the first screen with prices and a few labels [LPG-0059]. Filters open and close without losing scroll position.

**Product page**
- Gallery swipes smoothly; many shoppers swipe the whole gallery rather than scroll the page, so the images must carry the selling points [LPG-0060]. Variant and size pickers are tappable; selected state is obvious; out-of-stock variants are marked before tapping.
- Tap targets at least 44 by 44 points (Apple's guidance; Google's is 48 by 48). Text at least 16 px; no sideways scroll; no zoom needed.
- Sticky add to cart, if any, does not hide content or the cookie banner's buttons.

**Cart and checkout**
- Cart drawer opens, shows totals and shipping estimate, and does not trap the back button.
- Express wallets visible above the form (Shop Pay reports a higher mobile checkout-to-order rate [SET-0008]); keyboard type matches the field (number pad for phone and pincode or zip); address autocomplete works.

**After purchase**
- Thank-you and order status pages load and show the delivery estimate and support route.

### 4. Log every issue

For each issue: screenshot, device, path, page, what happened, and severity:
- **Blocker:** the buyer cannot continue (button hidden, form will not submit, page breaks, pop-up cannot close).
- **Major:** the buyer can continue but meets doubt, delay or extra effort (slow hero, hidden price or shipping, jumping layout, tiny tap targets).
- **Minor:** polish (spacing, image crop, label wording).

### 5. Find how many buyers each issue touches

Exposure = share of mobile sessions that hit that page or step (from the top landing pages and funnel). An issue on the top paid landing page touches far more buyers than one on a FAQ page.

### 6. Rank the fixes

Gross profit at stake a month = mobile sessions exposed x severity factor x gross profit per order x mobile conversion. Severity factors are working figures to tune: blocker 0.5, major 0.1, minor 0.02 (practitioner default, test it). The total across all fixes must not exceed the mobile gap from Step 1; scale down if it does. Blockers go first whatever the number. Mark each fix "repair" (ship once checked on the theme copy) or "test" (big changes, where the store has volume; see `design-store-ab-test`).

### 7. India and US notes

- **India:** test on a low-memory Android over slow mobile data; check pages in any regional language version; pincode checker usable with the number pad; COD and UPI options visible on the phone checkout; WhatsApp support button does not cover add to cart.
- **US:** test Safari on iPhone with Apple Pay; check the tax and shipping note in the cart; check accessibility basics (contrast, labels on icons), since buyers rely on screen readers too.

## Checks before you hand it over

- All 5 paths were walked on a real phone or are labelled emulated.
- Every issue has a screenshot, device, page and severity.
- The mobile gap in gross profit is shown, and the fix list total does not exceed it.
- Blockers are first; each fix names the page, the change and the owner.
- Core Web Vitals come from field data where it exists, not only a lab score.
- No fix was published to the live theme without the client's yes.

## Output

**One-screen summary:** mobile versus desktop conversion, the mobile gap in gross profit a month, number of blockers, majors and minors, and the top 5 fixes.

**Journey log:** Path, Step, Device, Network, Screenshot link, What happened, Time to usable screen (seconds).

**Fix list:**

| # | Page | Issue | Severity | Device | Sessions exposed a month | GP at stake a month | Fix | Repair or test | Owner | Effort | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|

**Appendix:** field Core Web Vitals for the top 5 mobile landing pages (LCP, INP, CLS, pass or fail).

## Common mistakes

- **Auditing on a desktop browser shrunk to phone width.** Step 2 uses real phones on mobile data, or labels emulation.
- **Reading desktop bots as a mobile problem.** Gate 2 uses GA4 purchase-only data.
- **Treating every issue as equal.** Steps 4 to 6 weight severity by how many buyers see it.
- **Overclaiming.** Step 6 caps the list at the measured mobile gap.
- **Pop-ups judged on desktop.** Step 3 checks what they cover on a phone in the first seconds.
- **Fixing live.** Gate 4 keeps changes on a theme copy until the client approves.

## Sources

- LPG-0022: no pop-ups in the first 3 to 5 seconds.
- LPG-0034: mobile product page first screen.
- LPG-0038: risk reducers under the call to action.
- LPG-0059: mobile collection grid shows four products.
- LPG-0060: shoppers swipe the gallery more than they scroll.
- LPG-0061: bestsellers at the top of the menu.
- MEA-0002: GA4 conversion rate filtered to purchase.
- MEA-0012: Shopify sessions include bots.
- MEA-0037: gross margin is delivered cost.
- SET-0008: Shop Pay and mobile checkout-to-order rate.
- SPD-0006: lazy-loaded hero slows LCP.
- SPD-0007: app bars cause layout shift.
- SPD-6183: Core Web Vitals thresholds at the 75th percentile.

What makes this skill ours: five scripted buyer paths on a real mid-range phone over mobile data, not a resized desktop window; every issue weighted by how many mobile sessions see it and capped by the store's measured mobile gap in gross profit; and India checks (low-end Android, pincode, COD, UPI, WhatsApp buttons) sit beside US Safari and wallet checks.
