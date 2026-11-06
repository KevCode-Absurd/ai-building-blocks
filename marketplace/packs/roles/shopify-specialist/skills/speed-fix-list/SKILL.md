---
name: speed-fix-list
description: Finds why a Shopify store feels slow and ranks the fixes by payback - sales at risk on each page type divided by the work involved. Starts from real-visitor Core Web Vitals in the admin's Web performance dashboard, uses lab tests only to find causes, audits apps and leftover app code, and writes each fix as a change request for a duplicate theme. Use when a store got slower after new apps or a redesign, before a sale, or when the owner is offered a "speed booster" app.
---

# Speed fix list

Speed work goes wrong in two ways: chasing a lab score instead of what shoppers feel, and fixing what is easy instead of what matters. This skill starts from real-visitor data, finds causes, and ranks fixes by payback.

Access levels for this skill: finding and ranking fixes needs only level 1 (read). Building fixes on an unpublished duplicate theme needs level 2. Publishing fixes and removing apps need level 3, within the owner's limits; removing an app can delete its data, so it always needs a fresh yes.

## When to use

- The Web performance dashboard shows LCP, INP or CLS in the moderate or poor range on a page type that sells.
- The store "feels slow" after new apps, a theme change or a redesign.
- Before a sale, to remove risk and weight.
- The owner is considering a speed app that promises a higher score.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- **Field data**: screenshots of the Web performance dashboard summary, the page type view and the over-time chart with its annotations (app installs, theme changes). Data can lag by up to 36 hours and only 90 days are kept, so capture it now.
- **Lab reports**: PageSpeed Insights links or Lighthouse reports for the home page, a busy collection and a top product, on mobile.
- **Store numbers**: sessions and orders by page type or landing page, or revenue by top products, for the last 4 to 8 weeks.
- **App list**, plus apps removed in the last year.
- **Theme files** from a duplicate theme, or at least `layout/theme.liquid` and the main product and collection sections.

## Steps

1. **Set the baseline.** Record LCP, INP and CLS at the 75th percentile per page type, mobile and desktop, with the date. Google's good thresholds are LCP 2.5 seconds or less, INP 200 milliseconds or less and CLS 0.1 or less. If traffic is too low for stable field numbers, say so and use lab tests as a rough guide only.
2. **Pick the pages that matter.** Rank page types by share of sessions and orders. A poor LCP on product pages usually matters more than on the blog.
3. **Read the timeline.** Line up when each metric got worse with the dashboard's annotations and the app list. A jump after an app install is the strongest clue you will get.
4. **Find causes with lab tools.** For each priority page, look at:
   - **LCP:** what the largest element is; whether it is lazy-loaded, hidden behind an animation, a CSS background, oversized, or waiting on scripts. Shopify's advice: serve it with `image_url` and `image_tag`, never lazy-load it, and mark it `fetchpriority="high"`.
   - **INP:** long JavaScript tasks after taps, usually from apps (reviews, pop-ups, chat, upsells), sliders and filters.
   - **CLS:** images without dimensions, fonts swapping late, banners and app widgets injected after load.
5. **Audit scripts.** List every script by origin (Lighthouse Treemap and the DevTools Coverage tab). For each: which app or tag, which pages need it, is it still used, can it load later or only on the pages that need it? Search the theme for leftovers of removed apps: `layout/theme.liquid`, the `snippets` folder, `render` and `include` tags, and the page source for the app's domain.
6. **Estimate payback for each fix.** Payback is sales at risk divided by effort. Sales at risk: the page type's share of sessions and orders, times how far the metric is from good. Effort: hours to build, test and publish on a duplicate. Write both in words or ranges from the store's own numbers. Do not promise a percentage lift; the published studies show direction, not what this store will get.
7. **Write each fix as a change request**: what changes, why (evidence), page types, files, risk, test steps, how to undo, which metric should move, and the access level it needs.
8. **Build and release.** Level 2: build approved fixes on an unpublished duplicate and send a preview link. Level 3: after the owner's yes to the action list, publish with a backup of the live theme kept, and remove approved apps one at a time, checking the store after each. Log every action; stop on any error or warning.
9. **Plan the check-back.** After release, compare field data over the following weeks, allowing for the dashboard's delay and day-to-day noise.

## Checks

- Every fix is tied to evidence (a metric on a page type, a script, a file).
- Fixes are ranked by payback, not by ease alone.
- No fix relies on hiding content from tests or gaming Lighthouse.
- App removals note what feature is lost and who agreed.
- Each change is built on a duplicate theme; it goes live only through the owner or with level 3 access, and every action is logged.
- No promised score or sales figure.

## Output format

1. **Baseline table**: page type, device, LCP, INP, CLS, sessions share, date.
2. **What changed**: timeline notes linking jumps to apps or theme changes.
3. **Ranked fix list**: rank, fix, page types, evidence, sales at risk, effort, metric to move, owner.
4. **Change requests** for the top three.
5. **Check-back plan**.

## Example of good output (short)

*Copperleaf Kitchenware is a made-up business used only to show the format: a cookware store on a Theme Store theme, mostly mobile traffic.*

**Baseline (mobile, last 30 days):** product pages LCP in the poor range, INP good, CLS moderate. Collection pages good on all three. Product pages carry most sessions and orders in the owner's report.

**What changed:** product LCP worsened in the week a bundle app and a second reviews app were installed (dashboard annotation).

| Rank | Fix | Pages | Evidence | Sales at risk | Effort | Metric |
|---|---|---|---|---|---|---|
| 1 | Stop lazy-loading the first product image; add `fetchpriority="high"` | Product | Main image has `loading="lazy"` in `main-product.liquid` | High: most orders | About an hour | LCP |
| 2 | Remove the unused second reviews app and its leftover snippet | All | Two review scripts load on every page | High | Half a day, owner confirms which app stays | LCP, INP |
| 3 | Reserve space for the bundle widget | Product | Widget pushes the price down after load | Medium | A few hours | CLS |
| 4 | Self-host the second display font or drop it | All | Late font swap on headings | Low | An hour | CLS |

**Not recommended:** the "speed booster" app the owner was offered; it targets the lab score, not shoppers.
