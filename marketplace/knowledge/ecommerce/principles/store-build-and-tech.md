# Store build and technology: craft principles

This book is for the people who build and run the store itself: store setup, theme code, page speed, apps, tracking, fraud and bot defence. Read it before any job that touches settings, theme files, scripts, tags or access; build the work to it; and run the review checklist on the draft before hand-over.

## What great looks like

- Every order is counted once in every tool, and each tool's purchases are matched to store orders by day.
- The store is proven by real test orders on every payment path, market and phone, not by settings that look saved.
- Each storefront app has a named job, a speed cost, a monthly fee and a reason it beats a theme-native option.
- The first image on each template loads early; nothing above the fold is lazy-loaded or animated in.
- Speed is judged on mobile field data at the 75th percentile, read about 28 days after a release, never on a lab score alone.
- No theme change reaches the live store without an unpublished copy, a phone test and the owner's yes.
- Prices, product facts, reviews and policies sit in the first HTML a crawler receives.
- Every bot and AI agent has a deliberate allow, limit or block decision, written down.
- Fraud defence leans on the platform's screening first, then on rules built from the store's own pattern, so real buyers are not blocked.
- Every critical tool has two owners, two-step login for every user, and access sized to the job.

## The principles

### 1. Count each order once, with one ID on every copy, and reconcile every platform to store orders by day

**Why it works:** Ad platforms bid on what they are told. If Meta sees 70 of 100 real sales, a true 3% conversion rate reads as about 2%, so the store loses auctions it should win; at 200, smart bidding chases sales that never happened. In over 1,000 Blue Sense audits, broken measurement was the main growth block in about 30% of brands.

**How to apply:** Send the store's real order ID as transaction_id; an empty ID makes GA4 merge those orders into one. Share one event_id between the Meta pixel and server event. Keep one primary purchase action in Google Ads; a GA4-imported primary undercounts by about 20%. Never fire an event from both an app pixel and a custom pixel, and set the Meta test event code through a Debug Mode lookup so it never ships live. Then lay 14 to 30 days of purchase events received (Events Manager, GA4) beside store orders in one time zone, never attributed purchases, which windows and view-through distort.

**Judge it by:** A daily capture-rate table per platform, with a cause for every day that leaves that platform's usual band. Weak work says "tags fire".

**Breaks when:** Very low order volume makes daily gaps noisy; read weekly instead.

**From:** MEA-6223, MEA-0006, MEA-0017, MEA-6227, MEA-0005, ADC-6171, MEA-0046, MEA-6303

### 2. Put express wallets at the top of checkout, make guest checkout the default and show every cost before the buyer reaches it

**Why it works:** Baymard's average documented cart abandonment is 70.22%, and extra costs lead the reasons at 40%, ahead of slow delivery (20%) and card distrust (19%). Because CAC is ad spend divided by sessions times conversion rate, lifting conversion from 1% to 2% halves CAC with no new spend.

**How to apply:** Put Shop Pay, Apple Pay and Google Pay at the top of checkout and, where the theme allows, on the product page. Shopify reports a 1.91x higher mobile checkout-to-order rate with Shop Pay, partly because returning buyers choose it. Count every field a guest sees on a phone; Baymard says most stores need 8, against an average of 11.3. Hide address line 2 and company name unless needed. Show shipping, duties and the delivery promise on the product page and cart, and keep extra charges added at checkout under about 10% of order value.

**Judge it by:** A phone checkout screenshot scored line by line, and mobile completion for new and returning buyers before and after.

**Breaks when:** The store cannot use Shop Pay (gateway or country), or B2B buyers pay by invoice.

**From:** CRO-6180, CRO-6610, SET-0008, CRO-6181, LPG-6613, LPG-0063

### 3. Prove the store with real test orders on every payment path, market and phone before launch and after every settings change

**Why it works:** Each setting looks saved in the admin, but only an order shows whether they work together. A wrong zone, a missing tax region or a box weight left out only appears on a real order, then repeats on every order until someone notices.

**How to apply:** In test mode, place orders with the provider's published test cards to a home address, another region and each foreign market, then repeat on a phone. Check tax, shipping and duties lines, policy links at checkout, the confirmation email, label and shipping notice. Save every box as a package with its empty weight and outer size and assign it per product, or calculated rates undercharge every parcel. Shopify bills labels to the card on file, so reconcile them against card statements, not payouts.

**Judge it by:** A test order log with one row per path (card, each wallet, each market, each device) and a pass or fail with proof. Weak work ticks "payments set up".

**Breaks when:** Some payment methods have no test mode; then place one small real order and refund it.

**From:** SET-0003, SET-0007, SET-0006, SET-0004, SET-6204

### 4. Fix site search with the store's own search terms before redesigning the search box

**Why it works:** Baymard's 2026 benchmark rates 46% of desktop sites and 58% of mobile sites mediocre or worse on search. Non-product queries such as returns, shipping or size guide fail on 66% of sites, abbreviations on 54%, compatibility on 44%, while exact product names fail on only 12%. Searchers are high intent, so a zero-result page loses a ready buyer.

**How to apply:** Export the store's search terms and sort them into these types. Run the top terms of each type on a phone. Add synonyms and misspellings, redirect policy words (returns, track order) to the right page, and put features, compatibility and problem words into tags or metafields so search can find them. In GA4's purchase journey, check the product view rate; if it sits below about 50%, the problem is finding products, not the product page. Keep the main menu at about 7 items or fewer and cut links that click maps show nobody uses.

**Judge it by:** A list of the top 20 zero-result or wrong-result terms, each fixed and retested.

**Breaks when:** The store has under about 20 products and few searches; then menu and collection fixes matter more.

**From:** CRO-6182, LPG-0040, LPG-0007, LPG-0039

### 5. Authenticate the store's sending domain with one SPF record, DKIM for every sender and a DMARC record before the first campaign

**Why it works:** Gmail requires anyone sending 5,000 or more messages a day to personal Gmail accounts to pass SPF and DKIM, publish DMARC (a policy of none is allowed) and align the From domain, and to keep the spam rate below 0.30%. Failing them costs the inbox for every flow at once, and the store builder owns the DNS.

**How to apply:** List every tool that sends as the brand's domain (store notices, email platform, help desk, reviews). Authenticate the domain in each so it adds DKIM keys of 1024 bits or longer. Merge all senders into one SPF record: a domain with two SPF records fails, and SPF allows at most 10 DNS lookups. Publish DMARC at p=none with a report address, read the reports, then tighten. Confirm one-click unsubscribe headers in marketing mail and watch Postmaster Tools.

**Judge it by:** A DNS screenshot with one SPF record, a DKIM record per sender and DMARC, and a test email whose headers show SPF, DKIM and DMARC passing.

**Breaks when:** The store sends under 5,000 a day, so Google's bulk rules do not bind yet; set it up anyway, because changing DNS on a large live list is riskier.

**From:** EML-6340; https://www.rfc-editor.org/rfc/rfc7208

### 6. Hold storefront apps to a script budget, and make each paid app beat its fee and its speed cost

**Why it works:** Shopify's hosting and caching do not cover app scripts, which load on every page and fight for the main thread. Across 1,533 Shopify stores, those loading 0 to 5 third-party services had a median mobile score of 74; at 21 to 30 it was 44. Beauty stores loaded a median of 31 and ranked last.

**How to apply:** List every third-party domain on each template; Shopify's rule of thumb is that a store with over 20 installed apps has some it no longer uses. For each app, name its job, fee, claimed gross profit and speed cost, measured by blocking its domains and re-running the test (in one demo, five common apps cost about 20 lab points). Remove what does not earn its keep, then search the theme for its name, since removal often leaves script tags behind. Defer render-blocking scripts and retest the feature. Never defer analytics or ad pixels, and check none is installed twice. On WooCommerce, unload shop scripts on pages with no cart.

**Judge it by:** A table of apps with keep, defer or remove and the measured cost of each. Weak work names apps by reputation.

**Breaks when:** An app drives clear, tested revenue; then optimise how it loads rather than remove it.

**From:** SPD-0001, SPD-0011, SPD-0009, SPD-0014

### 7. Build simple bars, badges, size charts and FAQs in the theme, and keep apps for jobs the theme cannot do

**Why it works:** Apps that inject an element after the page renders push content down, which is the usual cause of large layout shift on Shopify. Apps that load reviews and FAQs by JavaScript also leave an empty placeholder in the HTML, so most AI crawlers, which do not run scripts, never read them.

**How to apply:** For each visual feature an app provides (announcement bar, shipping bar, badge, size chart, FAQ), check for a native theme section. If one exists, move the feature there and remove the app. If not, build an Online Store 2.0 section the team can edit, with content in metafields or metaobjects. To find a layout shift, step through a speed test's filmstrip, inspect the element that moves and search the theme for its class. Check mobile and desktop separately.

**Judge it by:** CLS under 0.1 on both devices, and the feature visible with JavaScript turned off. Weak work reserves no space and calls the shift "minor".

**Breaks when:** The job is truly complex (subscriptions, loyalty ledgers, review collection), which is what apps are for.

**From:** SPD-0007, AEO-0002, AEO-0003

### 8. Load the first image on each template early with high priority, and lazy-load everything below the fold

**Why it works:** The Largest Contentful Paint element is usually the hero on home and collection pages and the main product image on product pages. Many themes and apps put lazy loading or a fade-in on every image, including that first one, which tells the browser it does not matter. In one practitioner's audits this is the most common reason LCP fails on Shopify, with heavy script blocking next.

**How to apply:** In PageSpeed Insights, find the LCP element on each key template. If it has loading=lazy, a lazy class or an entrance animation, change the theme logic so only the first slide or main image uses loading=eager and fetchpriority=high, with no animation. Keep lazy loading on grids and anything further down. Serve the first image through responsive sizes and compress it hardest. On product pages, render the main image and buy button first; load reviews and widgets after.

**Judge it by:** The LCP element named per template, with its loading attributes shown before and after. Field LCP at p75 under 2.5 seconds.

**Breaks when:** The page's LCP is text, not an image; then fonts and render-blocking CSS are the lever.

**From:** SPD-0006, SPD-0002, SPD-6183

### 9. Upload images at about 2,000 px and 100 to 200 KB, and let the platform resize and choose the format

**Why it works:** Shopify does not compress on upload and only lightly when serving; in one test a 9.8 MB upload was served at about 6.1 MB. A whole page should weigh roughly 2 to 3 MB, so one camera original breaks the budget. Shopify's CDN already serves WebP or AVIF where the browser supports it.

**How to apply:** Set an upload rule: product images near 2,048 px on the long side (Shopify's square guidance), full-width banners up to 3,000 px, compressed before upload to under 500 KB and ideally 100 to 200 KB. Do not convert to WebP by hand on Shopify. Swap animated GIFs for short MP4. Check the theme outputs srcset widths so phones get a small file. Without automatic resizing, export at twice the rendered size; one demo cut 161 KB to about 11 KB with AVIF at about 50% quality. Always set width and height.

**Judge it by:** No key-template image served above about 200 KB on mobile, and a written upload rule. Weak work re-compresses compressed files.

**Breaks when:** Shoppers zoom to inspect texture or colour (fabric, jewellery); keep zoom images sharper and load them on tap.

**From:** SPD-0008, SPD-6184, SPD-6185, SPD-0013

### 10. Judge speed on mobile field data at the 75th percentile, and read it again about 28 days after release

**Why it works:** Core Web Vitals pass when LCP is 2.5 seconds or less, INP 200 ms or less and CLS 0.1 or less, at the 75th percentile of real page loads. The Lighthouse score is one simulated visit, so a page can pass the lab and fail the field. Field data is a rolling 28-day window, so a fix shows there only weeks later.

**How to apply:** Read field data for the top templates and the origin, mobile first. Use median-of-3 lab runs only to find causes and confirm a change on a theme copy. Log the release date and give the verdict on field numbers four weeks later. Quote INP, never the retired FID. When a page lacks field data, say so and use origin data.

**Judge it by:** A scorecard of field LCP, INP and CLS per template and device, with the date of the next read. Weak work celebrates a lab score of 90.

**Breaks when:** The store has too little traffic for any field data; then use repeated lab runs on throttled mobile and say the result is provisional.

**From:** SPD-6183, SPD-0005, SPD-0004

### 11. Rank speed fixes by the sessions each template carries and the size of its failure, not by how easy they are

**Why it works:** A 0.5 second gain on a page with 10,000 monthly visits beats 2 seconds on a page with 100. Vodafone found a 31% better LCP gave 8% more sales, but that is one case, not a forecast.

**How to apply:** Pick five templates by real sessions: home, top collection, top product, top paid landing page, cart. For each failing metric, find the cause and size the fix by sessions reached. Common heavy hitters: standard YouTube embeds (a click-to-load thumbnail of about 15 KB saves close to 1 MB), autoplay video on mobile, and quick view that preloads full data for 20 to 30 grid items (load on click, or remove it). On self-hosted or headless stores, never cache cart, checkout or account pages, keep UTMs out of cache keys, and aim for an 80% cache hit rate.

**Judge it by:** A fix list ranked by sessions times expected gain, each item with an owner and the metric it should move. Then conversion measured on that page before and after. Weak work starts with the easiest fix on the least visited page.

**Breaks when:** All three vitals already pass at p75; further work gives small returns.

**From:** SPD-0004, SPD-0010, SPD-0012, SPD-0003

### 12. Build discount codes so they cannot give away more than the offer was planned to cost

**Why it works:** Shopify's native percentage codes cannot cap the amount saved. At a $1,000 order, a 30% sitewide code gives away $300, which can wipe out contribution on large baskets. Stacking with free shipping is a toggle that is easy to leave on.

**How to apply:** Before a promotion, model the discount cost at the 90th percentile order, not the average. Where order sizes vary widely, use fixed-amount tiers by spend (for example $50 off $300, $120 off $600) instead of a percentage, add a capping app, or limit percentage codes to lower-priced collections. Set once per customer, an end date, and a deliberate yes or no on combining with other discounts and free shipping. Place a test order with the code at a large basket to confirm the total.

**Judge it by:** A one-line cost model per code at the 90th percentile basket, and the combination settings written out.

**Breaks when:** Average orders are low and narrow, so a cap rarely binds; or the platform adds native caps.

**From:** SET-0001

### 13. Open a market only when its checkout charges in local currency with duties settled, and its delivery promise is real

**Why it works:** Without Shopify Payments, currency apps convert prices only up to the cart; checkout still charges the base currency, which surprises buyers and adds card fees. Duties not collected at checkout are billed on delivery, which drives refused parcels. Tax-inclusive pricing is expected in the EU and UK.

**How to apply:** Check that Shopify Payments supports the business country before setting up Markets. If not, pick a base currency most buyers know, such as USD or EUR, and state the charge currency in the cart. Add HS codes and country of origin to every product, then turn on duty collection per market. Use tax-inclusive pricing where buyers expect it. Send Merchant Center one feed per currency; a single-currency feed is auto-converted with tax added and shows an odd price. Every hreflang version must list itself and all others. For small, light products with real revenue in one country, compare a local store and warehouse with cross-border fees. Pay-on-delivery rules and other India-specific setup go to Ishita (ishita-india-commerce).

**Judge it by:** A test order per market showing local currency, tax and duties lines, and a delivery promise.

**Breaks when:** Revenue in a market is too small to justify duty setup; sell there plainly as cross-border with clear terms.

**From:** SET-0002, SET-6204, SET-0004, SEO-6462, SET-0009, GAD-0049

### 14. Change the theme only on an unpublished copy, keep a log of every code edit, and publish only with the owner's yes

**Why it works:** A broken theme on a sale day loses revenue by the minute, and silent breaks (a missing pixel, a dead cart button) can run for weeks. Shopify says editor settings carry over to an updated theme, but conflicting code edits must be copied across by hand.

**How to apply:** Duplicate the live theme, work on the copy and share a preview link. Keep a change log: file, change, reason, how to undo. Run Theme Check, test each edited section in the editor and on a real phone, and compare median-of-3 mobile lab runs with the live theme. Shopify's Theme Store bar is an average Lighthouse performance score of 60 and accessibility of 90 across home, collection and product pages; a change should not drop below it. Before a theme update, carry over every code edit in the log.

**Judge it by:** A preview link, a change log and before and after numbers. Weak work edits the live theme.

**Breaks when:** An emergency fix (checkout broken, a price wrong) must go live first; log it and back-port it to the copy the same day.

**From:** SPD-0009, SEO-0004, SPD-0007; https://help.shopify.com/en/manual/online-store/themes/managing-themes/updating-themes; https://shopify.dev/docs/storefronts/themes/store/requirements

### 15. On a migration, redirect every old URL with traffic or links to its closest new page, one hop, and keep the redirects for at least a year

**Why it works:** A move loses rankings and sales mainly through URLs that 404 or all point to the home page. Google treats a 301 as a strong signal, and says a medium site can take a few weeks or more to settle.

**How to apply:** Build the old URL list from the sitemap, a crawl, analytics landing pages and Search Console links. Rank by clicks, revenue and links, and map each to its closest new page; never send many to the home page. Redirect straight to the final URL, no chains. On Shopify, import the map as a redirect CSV (up to 100,000 on most plans); a redirect fires only when the old URL no longer loads a live page, so a leftover page silently cancels it. Update canonicals, hreflang and internal links; move gift card balances, subscriptions and consent records. Then watch rankings, organic traffic and orders daily for 30 days.

**Judge it by:** A redirect map covering every URL with traffic, each old URL crawled after cut-over and returning one 301 to a live page, and a 30-day watch log.

**Breaks when:** The domain and URL paths stay the same; then the work shrinks to data and settings.

**From:** SEO-6464, AEO-0008; https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes; https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect

### 16. Give each product one URL and keep its facts in structured product data, not in theme text or app widgets

**Why it works:** Search engines, Merchant Center and AI shopping tools read product data, not your design. Shopify's global catalog, which feeds AI shopping channels, is built only from back-end data: title, description, variants and metafields. Many themes also link products through collection paths, so one product lives at many URLs and splits its link signals.

**How to apply:** Remove "within: collection" from the product grid links so they point to /products/ URLs, then rebuild breadcrumbs from a product metafield that stores the primary collection. Merge true duplicates with a 301, point near-duplicates to the main page with rel canonical, and list only canonical URLs in the sitemap; never use robots.txt or noindex to pick a canonical. Store specs, sizes and care in clearly named metafields. Delete stale metafields left by old apps, which can flow into the catalog. Complete the terms, privacy and refund policy pages, since Shopify's agentic channels need all three.

**Judge it by:** One URL per product, facts readable in the product export, and no orphan app metafields.

**Breaks when:** A non-Shopify platform handles URLs differently; apply the same rules through its own canonical and redirect tools.

**From:** SEO-0004, SEO-6464, AEO-0003, AEO-6467

### 17. Put prices, stock, reviews and key answers in the first HTML the server sends

**Why it works:** Most AI crawlers read only the HTML present when the page is first served. Google Merchant Center compares the feed price with the price in the page HTML and structured data, and prices added by script after load can trigger mismatches. Mismatches disapprove products, and repeated ones can suspend the account.

**How to apply:** Open each key template with JavaScript turned off and reload. Whatever disappears (reviews, FAQs, price, stock status) is invisible to those crawlers. Fetch the page with an AI crawler's user agent to confirm it is reachable. Pick review and FAQ apps that render into the HTML, or put the top answers in the theme template. Before any sale, schedule the feed update for the same minute site prices change, and confirm the sale price is in the HTML, not only in a script. If prices change often, push the feed at least every 6 hours and turn on automatic item updates in Merchant Center. Validate product schema after every theme or app change.

**Judge it by:** A no-JavaScript screenshot of the product page that still shows price, stock, rating and the top three answers, and zero price-mismatch items in Merchant Center diagnostics.

**Breaks when:** A crawler renders JavaScript (Google's own does); the rule still holds for the many that do not.

**From:** AEO-0002, GAD-6122, AEO-0028, GAD-0005

### 18. Decide crawler and AI agent access bot by bot, and recheck it after every theme, CDN or platform change

**Why it works:** Ahrefs found about 5.9% of 140 million sites blocking GPTBot, often by accident through old templates or a CDN setting that blocks AI bots by default. A blocked assistant cannot read the store, so it cannot recommend it. OpenAI runs separate crawlers: OAI-SearchBot decides whether a site appears in ChatGPT search, GPTBot gathers training data, and each robots.txt rule is independent.

**How to apply:** Read /robots.txt and the CDN or firewall bot rules. List each agent (search and citation bots, training bots, user-triggered fetchers, known scrapers) and set allow, rate-limit or block with a reason. A brand may block training bots and still allow search bots; to stay in ChatGPT search, OAI-SearchBot must be allowed, and robots.txt changes take about 24 hours to apply. Where an operator publishes its IP ranges, check claimed user agents against them before trusting a rule. In analytics, find AI-referred visits that hit 404 pages (assistants send 2.87 times more 404 visits than Google Search) and 301 each to the closest real page.

**Judge it by:** A one-page access table per bot, with the date checked. Weak work allows or blocks "all AI bots".

**Breaks when:** The store is under active scraping or attack; tighten first, then reopen search bots once verified.

**From:** SEC-0002, AEO-6466, SEC-0001, AEO-0008

### 19. Fire ad and analytics tags on the consent update, and send nothing a visitor has not agreed to

**Why it works:** A pixel set to fire on page initialisation runs before the visitor answers the cookie banner. It is blocked, and when the visitor accepts, nothing re-fires it, so the landing page and every one-page visit are never recorded. That shrinks audiences and distorts landing page and ad reports. Firing without consent is a legal risk.

**How to apply:** Trigger each tag on the consent platform's update event so it fires on the same page the moment consent is given. Make server-side tags check the same consent state, so no data leaves without it. In Google's consent mode, set all four signals (ad_storage, analytics_storage, ad_user_data, ad_personalization) to denied by default, scoped to the regions where the banner shows; add wait_for_update (Google's example is 500 ms) so a slow banner can answer before tags fire, and send the update command on the page where consent is given. Turn on Google enhanced conversions only where the privacy notice and consent cover hashed email and phone.

**Judge it by:** A test: clear the consent cookie, load a landing page, confirm the tag is blocked, accept, and confirm it fires on that same first page and on the server.

**Breaks when:** A market needs no prior consent for analytics; still document the choice per market.

**From:** MEA-0007, MEA-6126; https://developers.google.com/tag-platform/security/guides/consent

### 20. Fix event basics before buying server-side tracking, and buy it for durability, not for a promised lift

**Why it works:** Meta's Conversions API Gateway only copies an event after the browser pixel fires, so when a blocker stops the pixel, both copies are lost. One practitioner puts the real recovery at 1 to 2%, not the 13% Meta cites. Blue Sense tried repeatedly to measure the lift from server-side tools costing a couple of thousand dollars a month and could not separate it from weekly noise.

**How to apply:** First get deduplicated pixel plus Conversions API events, real order values on every purchase, and healthy match quality. Send the real order revenue to Google, with enhanced conversions on. Move to full server-side tagging above about $50,000 a month in spend, or to enrich values with back-end data. Send Conversions API events within 7 days of event_time, because one older event fails the whole request; batch slow events on their own.

**Judge it by:** A written reason for the tool, its monthly cost, and the capture-rate change it is expected to show against store orders.

**Breaks when:** Tracking is visibly broken (purchases missing in Events Manager); then the fix shows clearly in results and pays.

**From:** MEA-0001, MEA-0046, MEA-6285, MEA-0016, MEA-6085

### 21. Separate bot sessions from buyers before reading any conversion rate

**Why it works:** Shopify's session count includes bot traffic that GA4 filters, so Shopify sessions run higher and its conversion rate lower. GA4 removes declared bots automatically, cannot be told to stop, and cannot show how much it removed. A one-day conversion dip is often a bot spike, not a site problem.

**How to apply:** Track conversion rate from both sources and compare the trend. When Shopify sessions jump and GA4 does not, open sessions by location and sort by city; a spike from one city often means a server hitting the site. Look for one-page sessions with zero engagement and odd sources. Build revenue per visitor as net sales plus shipping collected, divided by GA4 sessions, and keep the method fixed month to month. Treat a conversion change as real only when it also shows in the bot-filtered source.

**Judge it by:** Every reported conversion drop shows whether it appears in both sources, with the bot check written out.

**Breaks when:** GA4 is badly installed or heavily blocked by consent, so it undercounts more than Shopify overcounts; check both first.

**From:** MEA-0012, MEA-6203, MEA-6284

### 22. Name every link so GA4 files the visit in the right channel

**Why it works:** GA4 decides the channel from the medium. It files a visit as Paid Social only when the source is a known social site and the medium matches cp, ppc, retargeting or paid. Any other medium becomes Organic Social, so paid spend hides as free traffic. Values are case sensitive, so "Google" and "google" split into two rows.

**How to apply:** Write one lowercase UTM sheet for the team: source, medium and campaign on every link, with the medium list mapped to GA4's channel rules. Add utm_content to tell creatives apart and utm_id where a campaign ID exists. Keep Google Ads auto-tagging on; Google calls the gclid it adds required for conversion tracking, and GA4 gives it priority over manual tags. Give WhatsApp, creators and QR codes their own channel in a custom group.

**Judge it by:** A channel report with no paid spend under Organic or (not set), and a sheet anyone can copy from.

**Breaks when:** The store does not use GA4 for decisions; still keep UTMs clean, because GA4 is the backup when platform tracking fails.

**From:** MEA-6221, MEA-6220, MEA-6225, MEA-6296

### 23. Choose the testing setup the store's traffic and plan can support, and never let a test tool slow every page

**Why it works:** Client-side test tools show the original page before the variant, which can inflate the variant's result. The usual fix, an anti-flicker snippet, hides the page for up to 3 to 4 seconds. Since Shopify's checkout extensibility rollout in August 2024, client-side tools cannot test the checkout at all.

**How to apply:** Size testing from monthly orders: under 30, research only; 30 to 300, one big test aimed at a 20% or bigger lift; 300 to 3,000, regular tests for 10 to 20% lifts. Use client-side tools only for visual tests on home, product and cart pages. Use server-side tests or Shopify Rollouts for pricing, search or anything where flicker or speed matters. Send checkout ideas to the cart, shipping threshold messages or product page trust; on Plus, use Checkout Blocks or Functions. Remove the test snippet when no test is running.

**Judge it by:** A test plan that states orders per month, the smallest lift it can detect and the tool's speed cost.

**Breaks when:** The store has very high traffic and an engineering team; it can run many tests at once server-side.

**From:** CRO-0008, CRO-0016, CRO-0011

### 24. Let the platform's fraud screening and risk-based 3D Secure work first, then add rules only for what gets through

**Why it works:** Card testing now spreads small attempts across thousands of stores through residential proxies, so per-IP blocks are weaker than they were. Shopify says its Payments screening blocks about 90% of card testing on guest card checkouts and helped approve 13% more good sales. Shopify Payments applies 3D Secure only to higher-risk payments, and an authenticated payment moves fraud chargeback liability to the card issuer.

**How to apply:** On Shopify Payments, keep address verification off at first; Shopify turns it off by default because its own analysis already screens risk, and turning it on can raise false declines. Read the order risk reports to see what fraud actually gets through. Then automate in Shopify Flow: capture low-risk orders, alert on medium, hold high-risk orders for review, and cancel known fraud patterns. On another gateway, ask what card testing screening it runs, and confirm PCI DSS, tokenisation and 3DS 2.0 support.

**Judge it by:** Every rule names the pattern it catches, from the store's own orders, and what good orders it might block.

**Breaks when:** The store is under an active attack; tighten everything until it stops, then roll back.

**From:** SEC-6200, SEC-0005, SEC-0003

### 25. Track chargeback rate weekly and act at 0.5%, well before processors flag you at 0.9%

**Why it works:** Shopify's guide says most processors flag a store whose chargeback rate passes about 0.9% of transactions and can stop taking its cards above 1%. Each chargeback costs about $128 in fees and handling on top of the lost goods. A run of small, odd orders is card testing, the early warning before chargebacks arrive weeks later.

**How to apply:** Count chargebacks as a share of transactions every week and set an internal alert at about 0.5%. When it rises, check whether risk-based 3DS is on before adding friction for everyone. Fight disputes by reason code: for fraud, AVS and CVV results, IP and device data and 3DS records; for item not received, tracking and delivery proof. On Shopify Payments the response usually has 7 to 21 days, submits on the due date even if empty, can take up to 75 days to decide, and has no appeal.

**Judge it by:** A weekly line with rate, count and cause, and a fight-or-accept call on each dispute.

**Breaks when:** Your processor or card scheme sets different thresholds; confirm them in writing.

**From:** SEC-0004, SEC-6201

### 26. Use a CAPTCHA only as a step-up after a limit trips, and set login limits at about 10 times the most extreme real user

**Why it works:** A CAPTCHA does not stop a determined bot: human solving services have sold about 1,000 solves for $0.50, while each challenge costs a real shopper about 10 seconds and blocks some disabled users. Rate limits stop brute force and credential stuffing, but one office or mobile carrier can put about 100 people behind one IP.

**How to apply:** Count login attempts per username and per IP. Set each limit about ten times above the most extreme real behaviour, and raise it if real customers get blocked. When a limit trips, slow the response or show a challenge so a real person can go on. Use score-based checks for routine traffic. Gate by action, not by visitor: let anyone browse, and add checks at checkout, account changes, loyalty redemption and gift card balance lookups. Add breached-password checks and a second factor for new devices.

**Judge it by:** No CAPTCHA on the normal path to purchase, and a written limit per endpoint with its reason.

**Breaks when:** Attacks come from many residential IPs at low rates; per-IP limits miss them, so lean on platform screening.

**From:** SEC-0010, SEC-0011

### 27. Give every critical tool two owners and two-step login for every user, and size each person's access to the job

**Why it works:** One owner who loses a login can lock the business out of its ads, store or domain. Meta lets a business portfolio require two-factor login for everyone and always needs at least one admin. Shopify collaborators do not count toward the plan's user limit, which tempts owners to add many and forget them.

**How to apply:** Map every tool the store depends on: store, domain, email, Meta, Google, payments, 3PL. Give each two trusted owners. Set two-step login for all users, not just the owner; Shopify Payments will not activate without it, and its verification stalls most often on names that do not match ID. Give agencies partner or collaborator access, never shared passwords; rotate the collaborator code after each project and review access monthly. Never store card numbers in notes, emails or sheets, which is how a Shopify store breaks its own PCI duty.

**Judge it by:** An access map with owner, role and review date per tool, and one offboarding list across all.

**Breaks when:** The owner is the only trusted person; the second owner must then be family or an adviser, not a freelancer.

**From:** SEC-6084, SEC-6202, SEC-0006, SET-0005

### 28. Build to WCAG 2.2 AA, because buyers who cannot use the store cannot buy and EU law now requires it

**Why it works:** Missing labels, low contrast and tiny tap targets stop some shoppers outright and slow everyone on a phone. The European Accessibility Act has applied to e-commerce services for EU consumers since 28 June 2025; its standard, EN 301 549, builds on WCAG AA. Microenterprises providing services (under 10 staff and up to EUR 2 million turnover) are exempt from its duties, but their buyers still need a usable store.

**How to apply:** Check the main path (home, collection, product, cart, checkout) with a keyboard only and with a screen reader. Every image needs alt text that names the product and variant. Text contrast must be at least 4.5:1, tap targets at least 24 by 24 CSS pixels, and form fields need visible labels and clear errors. Variant pickers, drawers and pop-ups must work by keyboard. Aim for a Lighthouse accessibility average of 90, then test by hand, since automated scores miss many problems.

**Judge it by:** A keyboard-only video of a full purchase, and a fix list per template.

**Breaks when:** Never on the main buying path; the exemption only changes the legal risk.

**From:** https://www.w3.org/TR/WCAG22/; https://www.ccpc.ie/business/enforcement/accessibility/european-accessibility-act-guidelines-for-microenterprises/; https://shopify.dev/docs/storefronts/themes/store/requirements

### 29. Give the store's AI assistant read access only, and route every money or account action to a fixed system or a human

**Why it works:** A public chatbot that can issue discounts, approve refunds or change addresses can be talked into it. OWASP names this risk excessive agency: damage from too much function, permission or autonomy. Text the assistant reads, such as reviews or product questions, can also carry hidden instructions.

**How to apply:** Let the assistant read the catalogue, policies and, after login, the buyer's own order status. Give it no write power over prices, discounts, refunds or addresses; hand those to deterministic rules or a person, with approval for anything high impact. Check permissions in the system it calls, not in the model. Rate-limit per session and IP, cap reply length and spend, and alert on cost spikes, which also catch bots routing their own work through your endpoint. Always offer a clear path to a human, which WhatsApp's policy requires for automated chats.

**Judge it by:** A permissions table for the assistant with read or write per action, and a tested attempt to talk it into a discount that fails.

**Breaks when:** A hosted support tool already enforces these limits; then check them rather than build them.

**From:** CRO-6361; https://genai.owasp.org/llmrisk/llm062025-excessive-agency/

### 30. Back up store data and theme code before every risky change, and know which exports cannot be restored

**Why it works:** Shopify's backup page points merchants to CSV exports or a backup app; it describes no built-in restore. A bulk edit gone wrong, an app that rewrites products or a deleted collection cannot be undone from the admin. A CSV export is a record, not always a restore: Shopify says orders cannot be imported through the admin, and issued gift cards, discount codes, saved reports and visitor data do not transfer.

**How to apply:** Export products, customers, orders, discount codes and gift card codes to CSV before any bulk edit, import, app install that writes data, or migration. Download the live theme before every publish. Where orders or metafields must be restorable, use a backup app that writes back through the API, and test one restore on a single product. Keep the theme change log beside the backups.

**Judge it by:** A dated backup taken before each risky change, a note of what each backup can and cannot restore, and one tested restore on record.

**Breaks when:** The catalogue is tiny and rarely changes; a monthly export and theme download may be enough.

**From:** https://help.shopify.com/en/manual/shopify-admin/duplicate-store; SET-0003

## Working from the org context

- Read the brand's design system first: fonts, colours, spacing and components. Build new sections from those tokens so a fix never looks like a bolt-on app.
- Read what ran and won. If a past test or theme change lifted sales, keep its elements; never remove a winning block to save a few kilobytes without measuring both sides.
- Read the buyers' own words for what they look for. Use those words in search synonyms, menu labels, metafield names and alt text.
- Read the brand's markets, payment mix and delivery promise. Every setup choice (currency, wallets, duties, shipping zones) starts from where buyers actually are.
- Read the brand's offers and margins before touching discount settings, app fees or tracking tools, so every cost is weighed in gross profit.
- Read the policies and the delivery promise, and make sure the store says the same thing on product pages, cart, checkout and emails.
- Keep the brand's voice in every message the system shows: errors, empty search results, cookie banners, 404 pages and chatbot replies.
- Where the store's build lags (slow template, double-counted events, open admin access), propose the change with its cost, its gain in one number and how to undo it, then wait for the owner's yes.
- Write back what you learn: the app list, tracking setup, access map and speed baseline go into the org context so the next job starts from facts.

## Review checklist

- [ ] Does each platform's received purchase count match store orders by day, with a named cause for any day outside its usual band?
- [ ] Does every purchase carry the store's real order ID, and do the pixel and server events share one event_id?
- [ ] Is there exactly one primary purchase action in Google Ads, and no event fired by both an app and a custom pixel?
- [ ] Is there a test order log covering every payment method, market and a phone?
- [ ] Are express wallets at the top of checkout, guest checkout the default, and all costs shown before checkout?
- [ ] Does every storefront app have a job, a fee and a measured speed cost, with leftover code from removed apps deleted?
- [ ] Is the first image on each key template loaded eagerly with no animation, and everything below the fold lazy-loaded?
- [ ] Are speed verdicts based on mobile field data at p75, with a date set to re-read them about 28 days after release?
- [ ] Was every theme change built on an unpublished copy, logged, tested on a phone and approved by the owner?
- [ ] Do price, stock, reviews and key answers show with JavaScript turned off?
- [ ] Is there a written allow, limit or block decision for each crawler and AI agent?
- [ ] Do tags fire on the consent update and stay blocked without consent?
- [ ] Are bot sessions checked in both Shopify and GA4 before any conversion rate is reported?
- [ ] Do fraud rules come from the store's own order pattern, each with what it might wrongly block?
- [ ] Is the chargeback rate tracked weekly with an alert below the processor's line?
- [ ] Does every critical tool have two owners and two-step login for all users?
- [ ] Is a dated backup in place before every bulk edit, import or migration?
- [ ] Can a keyboard-only user complete a purchase?
- [ ] Does a test email from the brand's domain show SPF, DKIM and DMARC passing, with only one SPF record in DNS?

## Common failures

- Reporting a Lighthouse score as the result. Fix: report field LCP, INP and CLS at p75 on mobile, and use lab runs only to find causes.
- Lazy-loading every image, including the hero. Fix: load the first image eagerly with high priority and lazy-load the rest.
- Adding an app for every small feature. Fix: build bars, badges, size charts and FAQs as theme sections, and keep apps for complex jobs.
- Uninstalling an app and calling the job done. Fix: search the theme for its leftover scripts and delete them.
- Declaring tracking fixed because tags fire. Fix: match each platform's purchases to store orders by day and explain every gap.
- Running a pixel through an app and again through a custom pixel or GTM. Fix: pick one source per event and remove the other.
- Selling server-side tracking on a promised lift. Fix: fix deduplication and order values first, and buy it for durability with a stated cost.
- Blocking all bots, or all AI bots, by default. Fix: decide per agent, allow search and citation bots where the brand wants visibility, and verify user agents.
- Putting a CAPTCHA on login and checkout for everyone. Fix: use rate limits and platform screening, and show a challenge only after a limit trips.
- Editing the live theme for a "small" change. Fix: use an unpublished copy, a change log and the owner's yes.
- Treating a settings screen as proof. Fix: place test orders on every path and market and keep the log.
- Launching a migration without a full redirect map. Fix: map every URL with traffic or links to its closest new page and watch for 30 days.

