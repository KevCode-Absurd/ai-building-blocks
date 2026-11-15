# Landing pages and conversion: craft principles

This book is for the people who build and fix the pages that ads, emails and searches send shoppers to: landing page writers, store UX designers, conversion testers and page speed specialists. Read it before the job, write and build to it, and run the review checklist on the draft before hand-over.

## What great looks like

- The first phone screen repeats the ad's promise in the ad's own words and answers what it is, why this one, why now and why trust you.
- Every proof element answers one named buyer doubt counted from the store's own surveys, reviews or tickets, and traces to a real source.
- The first price a shopper sees is what they pay today, or the gap is stated next to the button.
- Every fix carries a gross profit per month figure and a ship, test or research call made from that page's own orders.
- Every test is sized before launch, runs whole weeks, is read once at its planned sample and is judged on profit per visitor.
- Paid landing templates pass Core Web Vitals in mobile field data: LCP 2.5 seconds or less, INP 200 ms or less, CLS 0.1 or less.
- No fake timer, stock count, review, press logo or guarantee the business cannot honour appears anywhere.
- A shopper can buy with a keyboard or a screen reader, and every tap target fits a thumb.
- The page sounds and looks like the brand, in its buyers' words, not like a theme demo.

## The principles

### 1. Judge every page and every fix on gross profit per visitor, not conversion rate

**Why it works:** Cost per new customer equals ad spend divided by sessions times conversion rate, so lifting conversion from 1% to 2% halves it with no extra spend. But conversion rate alone is easy to game (pause cold ads and it jumps), and a bigger default pack can raise order value while losing profit.

**How to apply:** First work out gross profit per visitor: conversion rate times order value times margin. Before advising more cold spend, check conversion rate as a plain number times order value reaches 250 to 300: 3% at $100 gives 300, which only breaks even at a $3 click. Blended conversion falls as cold spend grows (cold 1%, warm 4%, blended 2.8% in one example), so compare cold with cold. Size each fix as visitors reached times lift times gross profit per order. Blue Sense sees Meta CPMs rise about 20 to 30% a year, so pages must win that back to hold cost per purchase.

**Judge it by:** Each fix shows monthly gross profit with its working. Weak work quotes a conversion lift with no traffic, margin or period.

**Breaks when:** The lift came from warmer traffic, or a tactic raises returns and chargebacks; check 365-day value by angle.

**From:** CRO-6610, MEA-6283, MEA-0015, MEA-0047, OFF-0047, CRO-6607, OFF-0015, MEA-6331, CRO-6609

### 2. Find the leaking step in the funnel before touching any page

**Why it works:** Much page work goes into pages that are not the leak. A fix at the wrong step cannot move orders, however good it looks.

**How to apply:** Pull the funnel by device: view product, add to cart, begin checkout, purchase. One agency's benchmarks from 150+ brands: view product 50 to 70%, add to cart 12 to 20%, begin checkout 40 to 60%, purchase 45 to 60%, with view product the weakest step in 90 to 95% of audits. A common shape is 4 add to carts to 2 checkouts to 1 purchase; the best low-ticket stores reach 2 to 1 to 1. Clean the data first: filter GA4's key event rate to purchase, and remember Shopify sessions include bots that GA4 filters. Split revenue into sessions, conversion and order value; a 5% order value dip plus a 4% conversion dip is usually noise. Compare each product with its own product type, not the store average.

**Judge it by:** The findings name the step, the device and the orders lost per month. Weak work says improve the product page with no funnel behind it.

**Breaks when:** Single-product stores where view rate is near 100% by design; broken or doubled GA4 events; high-ticket categories with low add-to-cart rates by nature.

**From:** LPG-0040, MEA-0008, MEA-0002, MEA-0012, MEA-0009

### 3. Match the page to the ad that sent the visitor and to how much that visitor already knows

**Why it works:** A click is a promise. If the page opens on a different claim, the shopper must decide again whether to stay, and most leave. Better conversion also feeds Meta's predicted action rate, which trims CPMs only slightly.

**How to apply:** Write the first screen from the ad: same claim, same product shot, same offer. The ad's first frame, text, headline and the page top work as one hook, so make them one claim. Route by awareness: unaware and curiosity ads to an advertorial, listicle or quiz; persona and problem-aware ads to a persona page that opens on the symptom the ad ended on; product-aware and retargeting traffic to the product page. IM8 splits its 708 ads across all three.

**Judge it by:** Side by side, the ad's claim and offer sit in the page's first phone screen. Weak work sends every ad to one product page headed with the product name.

**Breaks when:** One page serves many ads (match the top two or three by spend); an all bottom-funnel account, like Gorilla Mind's, needs no pre-lander; a curiosity hook can win in feed but fail as a page promise.

**From:** ADC-6218, LPG-6607, LPG-6605, LPG-0067, LPG-6610, ADC-6170

### 4. Make the first phone screen answer four questions, in order of persuasive weight

**Why it works:** Across one agency's audits about 60% of visitors never scroll past the hero, and most scan rather than read. The first screen decides whether the rest is ever seen.

**How to apply:** Answer what it is, why this one, why now and why trust you, stacked as value proposition, proof, price, then button. Put the star rating with its count above the title, show image thumbnails, and keep price, add to cart and one risk reducer in the first screen. Use two kinds of proof there: the rating at the top and a short customer quote near the button. Where one size or pack suits most buyers, drop the picker and default to the bundle. The why-now line must be true: a real delivery date, or a split such as four payments of $12.

**Judge it by:** A screenshot at 390 px wide shows all four answers and the button with no scrolling. Weak work is the default theme: name, price, a variant picker, and the button below the fold.

**Breaks when:** Known brands whose visitors arrive sold; apparel, where size choice is essential; technical products where specs lead.

**From:** LPG-6617, LPG-6618, LPG-0034, LPG-0036, LPG-0038, LPG-0041

### 5. Headline the outcome, not the product name, and test the first screen before anything below it

**Why it works:** Shoppers buy results, and a product name adds nothing the ad did not say. Agencies credit their largest page lifts (60 to 80% from headlines, up to 130% from above-the-fold tests) to the first screen, the only part everyone sees.

**How to apply:** Run each line through a 'so what?' test until it names an outcome, then add the feature: firmer skin in four weeks, using a triple peptide complex. A stranger must grasp it in 5 seconds. Set it 3 to 4 times body size on desktop (48 to 57 px over 16 px body), smaller on mobile so the button stays up. Find headlines in ads first: change only the ad headline across 4 or 5 angles to one page, then rewrite the page top around the winner. On the page, test the headline first, the hero image second.

**Judge it by:** The headline states a result buyers name in reviews, in the brand's voice. Weak work reads 'Hydra Serum 30 ml'.

**Breaks when:** Buyers shop on specs, or the brand name is the reason to buy; if search needs the name in the H1, keep it and add the promise beside it.

**From:** LPG-6621, LPG-6611, LPG-0016, LPG-0010, MCR-0080, LPG-6625

### 6. Show the real total before the cart, and keep costs added at checkout under about 10% of the order

**Why it works:** Surprise costs top Baymard's list. Among checkout leavers who were not just browsing, 40% blamed extra costs and 12% not seeing the total up front. In the UK, the DMCC Act requires mandatory fees to be in the price shown up front.

**How to apply:** Put delivery cost and timing on the product page. Keep shipping, tax and fees added at checkout under about 10% of order value; one presenter's tests found no material conversion effect below that. For subscriptions and prepay bundles, show what is charged today and how often. A per-month price that becomes a $300 to $400 quarterly charge in the cart drives buyers away, and Blue Sense believes it breaks pricing rules in some US states. US recurring billing law requires all material terms before billing details, express consent and a simple way to cancel.

**Judge it by:** The first price seen and today's charge match, or the gap is stated by the button. Weak work shows a monthly price and bills quarterly.

**Breaks when:** Per-month pricing is the norm and the full charge shows before the button; at low order values real shipping tops 10%, so bundle or raise the threshold.

**From:** CRO-6180, LPG-0063, OFF-6623, LPG-6622, OFF-6610, LPG-6624, OFF-6304

### 7. Give each winning concept its own page once it has the spend to feed it

**Why it works:** A page listing every benefit tries to persuade everyone and lowers belief for each buyer. Every angle also hits a spend ceiling, and a new angle with its own page opens new buyers for the same product.

**How to apply:** A concept is persona plus offer plus angle; one supplement can carry about 15 angles. When a concept wins in ads, build a page that leads with that one benefit and that persona's proof, with a named bundle and matched email flow where they fit. Blue Sense says a concept with its own bundle and page can scale 2 to 3 times. Grüns sells one gummy under six angles, each with its own ads and page. A US teeth whitening brand whose brides concept wins might build a 14-day wedding bundle and page. Ambassador ads go to a page built from that person's shoot, as Alo did with Jisoo.

**Judge it by:** Each concept above the spend line has its own page, with its benefit in the headline. Weak work sends every concept to one page with eight benefit icons.

**Breaks when:** A concept spends too little to read its page; the team cannot keep pages current (match the top two or three); usage rights exclude website use of a creator's image.

**From:** LPG-6623, LPG-0064, MCR-6734, MCR-6672, MCR-6838, LPG-6629

### 8. Ask buyers what almost stopped them, then put each answer where that doubt arises

**Why it works:** The reasons buyers nearly walked away are the reasons other visitors did. Analytics shows where people leave; only their words show why.

**How to apply:** Add a two-question post-purchase survey: what made you buy today, and what almost stopped you. One agency sees 85 to 90% completion with no incentive. Add an on-page friction survey timed at about 60% of average session length. Where orders are too few to test, this research is the evidence; add 3 to 5 user tests per round. Reach non-buyers with a guaranteed store credit plus a prize draw, and phone people who abandoned checkout. Count the answers, then place them: the top three objections in the FAQ, and 3 or 4 hand-picked reviews answering them beside the bundle picker and button. HexClad answers the durability doubt with a lifetime warranty against rivals' 1 to 3 years.

**Judge it by:** Each objection the page answers carries a count from the store's own data. Weak work copies a generic shipping FAQ from the theme.

**Breaks when:** A few orders a week give too few answers; surveys miss non-buyers, so add exit surveys, reviews and tickets; a survey that fires early or covers the button hurts mobile sales.

**From:** LPG-0042, CRO-0018, LPG-0005, LPG-6615, AVT-0025, MCR-0043

### 9. Fix in this order: clarity, copy, offer, proof, friction

**Why it works:** An unclear page wastes every visit, whatever the offer. The offer has the biggest effect but is hardest to change, so clarity is the fast win. Small tweaks win about 0.1% conversion, which pays only at very large scale.

**How to apply:** Clarity first: can a stranger say in 5 seconds what it is and who it is for? Then copy (outcomes in the buyer's words), offer (bundle, guarantee, threshold), proof, and last friction (fields, fees, steps). One agency draws the line at about 300,000 sessions a month: below it, take big swings (a new landing page, a product page redesign, a new cart threshold), not small isolated tests; Blue Sense puts the point where small tweaks pay at about $40M a year online. When a store is far below goal, read its store, ads and pages before blaming the ad account: structure changes are worth only about 10 to 20%.

**Judge it by:** The fix list is grouped by lever, early levers done first. Weak work lists button colour tests for a page with no reviews.

**Breaks when:** The page is clear and the problem is a weak or overpriced offer; go straight to the offer. Big redesigns bundle changes, so you learn less about which part worked.

**From:** CRO-6615, CRO-6616, CRO-0019, CRO-6620

### 10. Decide test, ship or research from the page's own orders before building any variant

**Why it works:** Most stores lack the traffic to read a split test, and a test that cannot reach its sample produces noise that looks like a result.

**How to apply:** Use monthly orders as the guide: under 30, research only; 30 to 300, one big-swing test aimed at 20%+ lifts over 2 to 4 weeks; 300 to 3,000, tests for 10 to 20% lifts; 3,000 and up, several variants at once. At a 2% baseline with 95% confidence and 80% power, detecting a 10% relative lift needs about 1,600 conversions per variant; 20% needs about 420; 5% about 6,300. Run whole weeks, at least one and in practice two. Write the stop rule first: stopping the first time a test hits significance raises false positives from 5% to 26.1%. Check every test for sample ratio mismatch; about 6% of Microsoft's experiments had one. Feed landing page tests cold paid traffic only, since email sends skew results.

**Judge it by:** The plan states orders, sample, weeks and stop rule before any build. Weak work starts a test on a page with 40 orders a month.

**Breaks when:** A very large effect or a high conversion rate reads on less traffic; the metric is an early step with many more events than orders.

**From:** CRO-0011, CRO-0005, CRO-0015, CRO-0017, CRO-0007, CRO-6613, CRO-0003

### 11. Choose proof that backs the exact claim you advertise, one piece per objection

**Why it works:** Proof works by removing one specific doubt. In Blue Sense's view, five reviews about the advertised benefit beat 400 generic ones, and trust badges and security seals close nobody on their own.

**How to apply:** Write down the main claim and the top five objections, then pick a testimonial from a different customer type to answer each. Going from 0 to about 80 reviews roughly doubled conversion in one presenter's stores; past that, count barely matters but claim-matching photo reviews do, so sort photo and video reviews first. Aim for about four before-and-after examples across different buyers where the category allows. Retitle the review section around a real customer count and the outcome, and give each video review a text headline for sound-off viewers. With about 30 reviews or fewer, feature quotes, not counts. Disclose any review incentive, and never tie one to a good rating.

**Judge it by:** Each objection maps to a named reviewer whose words answer it. Weak work is a carousel of five-star reviews that say only that they love it.

**Breaks when:** There are too few reviews to filter by claim (collect targeted ones first); local rules or marketplaces restrict incentives; regulated categories restrict before and afters.

**From:** LPG-6620, LPG-0053, LPG-0027, LPG-0062, LPG-6616, LPG-0049, LPG-0005

### 12. Put risk reducers in the line directly under the button, and promise only what the business honours

**Why it works:** The moment before the click is the moment of most fear. A guarantee placed there answers the fear where it happens, not three scrolls away.

**How to apply:** Under add to cart, state free returns, the guarantee and delivery in one line; agencies report 30 to 60% lifts, with no sample sizes. When buyers object to price against rivals, move trust elements above the price (one store gained 32%). Make the guarantee specific, matched to how long the product takes to work (90 days for a hair cycle), in the ad's own words. One practitioner finds a 180-day guarantee on cheap consumables draws fewer claims than 30 days, because buyers forget the date. With no promotion running, swap the cart's discount box for a trust bar; Boom gained about $40,000 a month. In the US, say money-back guarantee only if the full price is refunded on request, with any condition stated clearly.

**Judge it by:** The words under the button match the real policy pages exactly. Weak work shows a satisfaction-guaranteed badge over a 14-day, unused-only policy.

**Breaks when:** The margin cannot fund the terms or they drive returns on low-margin items; extra badges push the button down; influencer and email codes need the code box.

**From:** LPG-0038, LPG-0017, OFF-6653, OFF-0060, LPG-0058, OFF-6501

### 13. Build the bundle picker with three options, the saving in money in each title, and a set default

**Why it works:** Too many choices stall a decision, and shoppers will not do maths to find a saving. A saving in money is concrete; a percentage in small grey text is ignored.

**How to apply:** Offer three packs (1, 3, 5 rather than 1, 2, 3, 5, 10); a drinks brand saw conversion rise 53% and order value 13.5%. Put the saving in each title in money, such as 3 pack, save $10; one agency test lifted conversion 25% and revenue per visitor about 28.6%. Preselect the middle tier, show its price per unit against the single, and make it the offer the ads name, as True Classic does with its 6-pack. Read the test on profit per session: a 40% order value gain can be only a 10 to 20% revenue per session gain.

**Judge it by:** Three options, money savings in titles, a real single-unit reference price, a profit-per-session readout. Weak work shows five pills with a tiny grey percentage.

**Breaks when:** Buyers need exact quantities (tyres, device refills) or are B2B; cheap items where a percentage reads bigger; luxury brands where saving labels cheapen. These lifts have no sample sizes.

**From:** LPG-0006, LPG-0020, LPG-0008, LPG-0021, LPG-0035, OFF-0027, CRO-6607

### 14. Use the cart to raise order value with one relevant offer per slot and a reward ladder

**Why it works:** In the cart the shopper has already decided. Small adds priced well below the main item feel trivial, and a visible next reward turns spending more into progress.

**How to apply:** Give the progress bar more than one unlock, free shipping then a gift, so shoppers who already qualify still have a reason to add. True Classic offers free shipping at $100, a free shirt at $150 and free joggers at $200; with multi-packs and other work, its order value rose from $36 to $112. Set each step from the store's own order value spread. Use one offer per slot, relevant over cheap, from high-margin products, readable in 2 to 3 seconds, and judge it on gross margin added. Expect 5 to 15% take rates in cart. At checkout sell a low-effort add-on such as $4.99 shipping protection (about 30% take, where allowed and opt-in). One-click post-purchase offers reach 35 to 40% at some operators.

**Judge it by:** Each add-on is often bought with the main item in the store's own baskets. Weak work shows three random bestsellers in the cart drawer.

**Breaks when:** Nothing relevant exists to add; thin margins mean the gift erases the gain; steps sit so high almost nobody reaches them; local rules restrict protection fees.

**From:** LPG-0001, LPG-0072, CRO-6619, CRO-6618, OFF-0010

### 15. Make checkout short and familiar: express pay first, guest by default, about eight fields

**Why it works:** At checkout every field and choice is a chance to quit. In Baymard's research, a required account and a long checkout are each named by 17 to 18% of leavers, and 19% did not trust the site with card details.

**How to apply:** Put the express wallets the store's buyers use at the top; Shopify reports Shop Pay converts mobile checkouts to orders 1.91 times as often as its regular checkout, partly because loyal buyers choose it. Make guest checkout the default. Cut fields toward eight: Baymard found the average checkout had 11.3 in 2024. Where the platform allows, restate the guarantee and a few reviews, as IM8 does. On Shopify, Basic plans and up can reorder, hide or rename payment methods with customization apps. Before launch and after changes, place test orders on a phone to several addresses. Client-side tools cannot split test Shopify's checkout since August 2024.

**Judge it by:** On a real phone, fields and steps are counted and every expected payment method is there. Weak work forces an account, asks 14 questions and shows an empty coupon box.

**Breaks when:** A market needs an extra delivery field; the platform locks the layout; Shop Pay is not offered there.

**From:** LPG-6613, CRO-6181, CRO-6180, SET-0008, SET-6187, LPG-6608, SET-0003, CRO-0016

### 16. Make every proof element checkable, and build proof rivals cannot copy

**Why it works:** Shoppers know logos and anonymous reviews can be faked, so bare proof reads as fake. Fakes are also illegal: the FTC rule in force since 21 October 2024 bans fake and AI-written reviews, undisclosed insider reviews and hiding negative ones, and the UK's DMCC Act bans fake reviews too.

**How to apply:** Put the outlet's real quote under each press logo (one agency claims a 38% lift, no sample). Show reviewer name, photo and review source, not reviews hidden in carousels. In a crowded category, reviews and badges are table stakes; IM8 stands apart with an ambassador wall and a science stack (a nine-person advisory board, one completed trial, three underway). A young brand can add a founder video: about 45 seconds lifted one lead page from 10% to 15% form conversion (no sample). Review markup must match reviews visible on the page.

**Judge it by:** Every review, logo and count traces to a source the reviewer can open. Weak work shows five 'as seen in' logos with no quotes and an unsourced happy-customer count.

**Breaks when:** Buyers of intimate products will not share names or faces (use verified-buyer labels); a truly famous outlet persuades with its logo alone; a video pushes the button below the fold.

**From:** LPG-0037, LPG-6606, LPG-0023, MCR-6045, MCR-6021, SEO-6465, Cooley on the DMCC Act: https://www.cooley.com/news/insight/2025/2025-04-14-new-uk-consumer-law-regime-comes-into-force

### 17. Treat the product image gallery as a second landing page

**Why it works:** In Boom's data more shoppers swipe through the whole gallery than scroll the whole page. On a phone the gallery is where attention goes, so it must sell, not just show.

**How to apply:** Plan the slots in order: the hero shot, then the main benefit, how it works, proof (a real review with photo), size or what is in the box, and the guarantee. Each slot answers a doubt counted from reviews, returns or tickets. Boom's gallery rebuild added nearly $40,000 a month, about $0.50 more revenue per paid visitor, and an uncollapsed guarantee mattered most to older buyers. Keep the first image free of text, since shopping feeds often use it, and repeat any overlay words in page text. Hold each image near 100 to 200 KB so the gallery does not slow the page.

**Judge it by:** Swipe the gallery with the rest of the page hidden: it still makes the case. Weak work shows six angles of the same bottle on white.

**Breaks when:** Fashion or design-led brands, where shoppers expect clean imagery and overlays read cheap; technical products, where specs must lead.

**From:** LPG-0060, LPG-0034, SPD-0002, SPD-0008

### 18. Put a pre-sell page before the product only when the product needs explaining and the angle is proven

**Why it works:** A product that takes about three minutes to explain cannot be sold in a product page's first screen to someone who has never heard of it. A pre-sell page teaches first, so the product page only has to close.

**How to apply:** Use an advertorial, listicle or long lander when the product needs explaining (a mechanism, a new ingredient, a low-trust category) and an ad to a plain product page has already proven the avatar, desire, angle and mechanism, near break-even on about $1,000 of spend. Curiosity statics and unaware ads need such a page; sent to a product page, they look like failures. An ad that barely sells needs a long lead, with the product hidden for 50 to 60% of the page. Pick the format by obstacle: story for low trust, expert for permission, buyer's guide for scepticism, case study for will it work for me. Keep one editorial identity and label it as advertising.

**Judge it by:** The format names its obstacle, and the angle was proven first. Weak work builds an advertorial for a cheap impulse item.

**Breaks when:** The product is simple or impulse-priced; traffic is warm or branded; the page fakes a news site, breaching platform rules and consumer law.

**From:** LPG-0004, LPG-0030, LPG-6632, MCR-0024, LPG-0029, LPG-0003, LPG-0044, LPG-6628

### 19. Write the advertorial so the story never breaks and every part of the product answers the root cause

**Why it works:** Readers stay while it reads as a story and leave when it turns into a pitch. A root cause that the product's parts do not answer reads as a scam.

**How to apply:** Follow hook, lived pain, failed fixes, root cause, mechanism, proof story, objections, price, guarantee, close. Name a root cause rivals ignore and map each product part to it one to one. Mark every sentence where story stops and pitch starts, and rewrite it inside the story. Open on curiosity, proof and promise, not the pain the whole category shares, which AI copy defaults to; one curiosity element per headline, two at most. Anchor price against what readers already spent on failed fixes. Show a sticky button only after the paragraph that introduces the product. Use a soft button such as Check availability, with a line above it telling readers to click, and at least two calls to action.

**Judge it by:** No paragraph breaks the story, and each product part maps to the cause. Weak work runs 150 words of story, then a feature list.

**Breaks when:** Technical buyers want specs; health claims need evidence; invented doctors, composite stories or staged comments breach FTC and CMA rules and platform standards.

**From:** LPG-0025, LPG-0028, LPG-0012, LPG-0045, LPG-0027, LPG-0013, LPG-0011

### 20. When paid traffic lands on a collection, merchandise the first rows daily

**Why it works:** On a grid, shoppers judge the store by the first products they see. A top product missing the popular sizes wastes the click.

**How to apply:** About 75% of Alo's paid traffic lands on category pages, and the top six products decide how the grid performs, so give someone the daily job of checking their size and colour stock and re-sorting. On mobile, show four products (two by two) in the first screen with prices, labelling a few as bestseller or new; Boom gained about $30,000 a month. Expect roughly 10% more drop-off per row of two, so order by demand. In a new market where nobody knows the brand, send ads to the home-market best seller's product page instead. Quick view that preloads data for 20 to 30 thumbnails slows the grid; load it on click.

**Judge it by:** The first screen shows four in-stock bestsellers with prices. Weak work opens on a banner and a filter bar, with products starting on the second screen.

**Breaks when:** Products need size choice before quick add, which raises returns; luxury catalogues where editorial banners sell; single-product stores.

**From:** LPG-0069, LPG-6630, LPG-0059, LPG-0041, LPG-6631, SPD-0012

### 21. Pass Core Web Vitals in field data on the phone templates that paid traffic lands on

**Why it works:** Faster pages sell more: Vodafone's 31% better LCP lifted sales 8%, and Rakuten 24's speed work lifted conversion 33%. Google's pass line is LCP 2.5 seconds or less, INP 200 ms or less and CLS 0.1 or less at the 75th percentile, mobile and desktop judged apart.

**How to apply:** Pick templates by real sessions and judge them on field data, not the 0 to 100 lab score. Field data is a rolling 28-day sample, so a fix shows there only weeks later. Fix images first, then third-party scripts, then hosting. Shopify serves WebP or AVIF but does not compress uploads, so upload about 2,000 px wide and under 500 KB, ideally 100 to 200 KB. Shopify's most common slow LCP is a lazy-loaded or faded-in hero: load it eagerly with high fetch priority, and never lazy-load the first screen.

**Judge it by:** Field LCP, INP and CLS per template, before and after. Weak work celebrates a lab score of 95 while field LCP fails.

**Breaks when:** Low-traffic pages lack field data, so use origin data or lab tests and say so; pages already passing gain less from more work.

**From:** SPD-6183, SPD-0004, SPD-0005, SPD-0002, SPD-0006, SPD-0008, SPD-6184

### 22. Measure each app's speed cost, then defer or remove what does not pay

**Why it works:** Third-party code is the largest speed cost most stores control. Across 1,533 Shopify stores, those with 0 to 5 third-party services had a median mobile score of 74; those with 21 to 30 scored 44.

**How to apply:** List every script on each landing template and measure each app's cost by blocking its domains and re-running the test. Uninstalled apps can leave script tags behind, so search the theme for each removed app's name. Defer non-essential app scripts, but never tracking pixels. Layout shift on Shopify usually comes from an app injecting an element after load, such as a free shipping bar; use theme-native sections instead. Swap standard video embeds for lite embeds that load a thumbnail of about 15 KB until clicked, saving close to 1 MB. Make every change on an unpublished copy of the theme.

**Judge it by:** Each script has a measured cost and a keep, defer or remove call. Weak work removes apps by reputation and breaks tracking.

**Breaks when:** Video is the main selling element and must play in the first screen (optimise its format and poster instead); an app proves its revenue in a holdout (load it later rather than remove it).

**From:** SPD-0001, SPD-0009, SPD-0011, SPD-0007, SPD-0010

### 23. Cut product page elements that take under about 1% of clicks, and links that lead away from the buy button

**Why it works:** Every link off the product is another way to wander off and forget to buy, and clutter pulls attention from the button.

**How to apply:** Keep the main menu under 7 items. In click maps, remove elements under about 1% of clicks (one store's wishlist took 0.09%, call an expert 0.36%) and enlarge or move up what buyers already click. True Classic lost revenue when it added category breadcrumbs to product pages. For stores with several categories, image menus beat text lists: one agency test showed conversion up 60.7% and revenue per visitor up 92%. Put a bestsellers row at the top of the mobile menu and move contact and FAQ links lower; Boom gained nearly $50,000 a month. An element with a high click share that few visitors reach is a strong candidate to move up.

**Judge it by:** Every element on the product template earns clicks or does a reading job. Weak work keeps the theme's wishlist, compare, share buttons and breadcrumbs.

**Breaks when:** Elements work without clicks (returns notes, size help, review summary); low traffic makes click shares unstable, so wait for several thousand sessions per page; large catalogues need deep menus; keep breadcrumb markup for search.

**From:** LPG-0007, LPG-0043, LPG-0071, LPG-0039, LPG-0061, CRO-0022

### 24. Time pop-ups to intent, never to the first seconds, and size the offer to how far the shopper got

**Why it works:** A pop-up in the first 3 to 5 seconds interrupts someone who has not seen the product. On mobile, Google says pop-ups that cover the main content on arrival from search can lower how the page ranks.

**How to apply:** Trigger on exit intent on desktop, after add to cart, or at the scroll depth where heatmaps show the drop (for example where about 50% leave the description). On mobile, where exit intent does not exist, use inactivity or a back-button signal. Size the offer by stage: generous for browsers, small for cart abandoners, and no discount at checkout, where risk reversal or shipping help works, since checkout abandoners often buy within 2 to 3 days anyway. When collecting phone numbers, put the SMS disclosure above the box and never make consent a condition of buying.

**Judge it by:** No pop-up fires before the product is seen, and offers differ by stage. Weak work shows the same discount after 3 seconds on every page.

**Breaks when:** The brand does not discount, since pop-up codes train buyers to wait; returning customers learn to trigger codes.

**From:** LPG-0009, LPG-0022, OFF-6688, OFF-0009, EML-6327, Google Search Central: https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials

### 25. Make every quiz question win a small yes, seed a belief or answer an objection

**Why it works:** A quiz turns browsing into a run of small commitments and makes the result feel personal. A question that does none of those jobs only adds a reason to quit.

**How to apply:** Aim for about 8 to 12 questions, easiest first; high-volume brands run 15 to 25 with teaching screens between. Put no more than 2 or 3 questions of one format in a row. Treat the first three as the hook and test them first: one variant moved pass-through from about 70% to 85%. Target about 30% of starters reaching the result (25% is acceptable). Normal drop-off is 1 to 2% per question; a spike to about 4% flags one to soften or cut. Route by situation, as Lovevery asks expecting, baby, gift or already subscribed. Show a dated progress forecast only where the brand can back it.

**Judge it by:** Each question is tagged with its job, and drop-off is reported per question. Weak work asks filler questions and recommends one product to everyone.

**Breaks when:** Simple impulse products; warm buyers who know what they want; health quizzes that make medical claims; low traffic where a 1 to 2 point gap is noise.

**From:** LPG-0056, LPG-0031, LPG-0032, CRO-0004, LPG-6626, LPG-0018

### 26. Read results honestly: most tests lose, big lifts shrink, and one product never gets two prices

**Why it works:** Only about 10 to 20% of well-run tests produce a significant winner (10% across about 20,000 Optimizely experiments). At that rate and 80% power, about 1 in 5 significant wins is false.

**How to apply:** Treat a 30 to 35% win rate as very good; Boom's programme found 13 winners in 135 tests. Mature pages gain 1 to 5%, so re-test any claim above 50%. Choose one decision metric before launch; each extra one raises false positives (about 5%, 10% and 14% for one, two and three). Revenue per visitor needs about six times the traffic of a conversion test, so read conversion first with profit as the guardrail. Client-side tools can flicker the original page and inflate a lift. Never split-test two prices for one product: Amazon's 2000 DVD test ended in refunds to 6,896 customers; test price by country or product for four weeks or more, on contribution margin per session. Give every readout one verdict: win, lose, inconclusive or invalid.

**Judge it by:** The readout names the planned metric, the sample reached and the verdict. Weak work reports a 70% lift from 90 orders.

**Breaks when:** The change only repairs something broken or missing; fix it without testing.

**From:** CRO-0012, CRO-0020, CRO-0010, CRO-0014, CRO-0008, CRO-0009, CRO-6608

### 27. Log every test as a written hypothesis, and keep a winners register that no redesign may overwrite

**Why it works:** Most tests lose, so the profit sits in shipped winners that keep paying. They are easy to lose: Ezra Firestone reported proven winners overwritten by a redesign after a leadership change, then reinstated.

**How to apply:** Write each test as: because we saw this evidence, this change will cause this effect for this segment, measured by this metric, worth shipping at the planned lift or more. Name the segments to read in advance (mobile or desktop, new or returning); a blended win can hide a mobile loss. Log sample, sample ratio check and verdict; a fully powered inconclusive test means the effect is smaller than planned, so stop. Check every redesign or theme change against the winners register before launch. After one full pass on the five levers, reopen a page only when its offer, persona or angle changes.

**Judge it by:** Each test has a hypothesis line, metric, planned lift and verdict; each redesign brief lists the winners it keeps. Weak work is a new theme that drops last year's winning trust bar.

**Breaks when:** Repairs need no test, only a note. Stores too small to test keep a dated change log with before and after periods.

**From:** CRO-0020, CRO-0010, CRO-6616, CRO-0015

### 28. Use urgency, scarcity and was-prices only when they are true and you can prove them

**Why it works:** False urgency wins a sale once, costs trust with every repeat buyer and can cut lifetime profit through returns and chargebacks. The UK CMA can now fine up to 10% of global turnover, and took undertakings from Wowcher over countdown timers. In the EU, an announced price cut must show the lowest price of at least the previous 30 days as the prior price.

**How to apply:** Run a timer only if the offer really ends then for everyone. Show stock counts only from live inventory. A was-price must be a price really charged, and for EU shoppers the 30-day lowest. Near-permanent deep discounts with same-day deadlines speed sales but make the store a discount brand for good. Use true reasons to act now: a real sale end, a holiday cutoff from real transit data, or a restock (Bloom sold $1.36 million in 12 hours on one restock day).

**Judge it by:** Every urgency or price claim has a record a reviewer can check. Weak work adds a cart timer that resets on reload.

**Breaks when:** Rules differ by market and change, so recheck each; for stores selling in India, which has its own dark pattern rules, go to Ishita (ishita-india-commerce).

**From:** LPG-0001, OFF-6661, WLD-0012, CRO-6609, CMA guidance: https://www.gov.uk/government/publications/unfair-commercial-practices-cma207, Directive (EU) 2019/2161: https://eur-lex.europa.eu/eli/dir/2019/2161/oj

### 29. Price each market in its own currency, with duties and tax settled before payment, so the price never grows after the cart

**Why it works:** Shoppers abroad fear duties, slow shipping and returns they cannot afford, and a foreign-looking page raises all three doubts at once.

**How to apply:** Non-US brands selling in the US should present as local: a US site, US copy, no home-country domain. US shoppers expect delivery in about two days; if you cannot meet that, state real times on the page, or expect more tickets and refunds. Charge in the shopper's currency through checkout: without Shopify Payments, converter apps change prices only up to the cart. Collect duties at checkout where possible (it needs HS codes and a carrier that ships duties paid), so no bill arrives on delivery. Show tax-inclusive prices where buyers expect them, such as the UK and EU. Keep feed prices identical to page prices, since Merchant Center disapproves mismatches, and run one feed per currency.

**Judge it by:** A shopper in each target market sees local currency, real delivery times and the final price before paying. Weak work shows home-currency prices with a vague duties note.

**Breaks when:** Origin is the selling point (native ingredients, for example), as long as shipping and duties still feel local; a market earns too little to justify the setup.

**From:** LPG-6612, CXP-6609, SET-0002, SET-6204, SET-0004, GAD-6122, GAD-6170

### 30. Build the buying path to WCAG 2.2 level AA so every shopper can read, tap and pay

**Why it works:** Low contrast, tiny targets and unlabelled icon buttons stop real buyers: older shoppers, people on small phones in sunlight, and screen reader users. In the EU, the European Accessibility Act has covered e-commerce services since 28 June 2025, with an exemption for service microenterprises (under 10 staff and 2 million euros turnover or balance sheet).

**How to apply:** Keep text contrast at 4.5 to 1 or more (3 to 1 for large text). Make tap targets at least 24 by 24 CSS pixels, with more room for main buttons. Give every image and icon button a text label, so add to cart and colour swatches make sense read aloud. Make the cart drawer, variant picker and size guide work by keyboard, with visible focus. Show form errors in words that say how to fix them, never by colour alone. Test the buy path by keyboard and with a phone screen reader, then run an automated checker.

**Judge it by:** A reviewer reaches payment by keyboard alone and hears sensible labels. Weak work has grey small print and an unlabelled cart icon.

**Breaks when:** Standard versions and national laws differ and change; check each EU market's law, and treat this as craft, not legal advice.

**From:** W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/, Directive (EU) 2019/882: https://eur-lex.europa.eu/eli/dir/2019/882/oj

## Working from the org context

- Read the buyers' own words first: phrases from reviews, surveys and tickets become headlines, review picks and FAQ questions. Never headline in words no buyer used when buyer words exist.
- Read what ran and what won: winning ads, angles and personas decide which pages to build and what their first screens say. A winning ad headline is a tested page headline.
- Keep the voice and design system exactly: type scale, colours, button style, photo style and the brand's names for its products. Improve structure inside the system; never swap it for a template's look.
- Keep every real term as written: return window, guarantee, delivery times, prices and approved claims. The page may say them more clearly, never more generously than the policy.
- Read offers and margins: bundle tiers, thresholds and add-ons are chosen against the gross margin the brain records, not theme defaults.
- Read the funnel and device split before judging any page; if the brain lacks them, ask before proposing fixes.
- Where the brand does something that costs sales (a product-name headline, a hidden guarantee, five bundle options), propose the change with its evidence and expected gross profit, and keep the current version as the control.
- Where positioning rules out a tactic (no discounts, no pain framing for an aspirational label), respect it and use the nearest honest lever, such as free shipping and easy returns stated plainly.
- Write new buyer phrases, objection counts and test results back to the brain so the next page starts from them.

## Review checklist

- [ ] Does the first phone screen repeat the claim and offer of the ad or email that sends traffic to it?
- [ ] Is the destination right for the traffic's awareness (pre-sell, persona page, product page or collection)?
- [ ] Does the first screen at 390 px answer what it is, why this one, why now and why trust you, with the button visible?
- [ ] Is the headline an outcome a buyer would say, in the brand's voice?
- [ ] Does each answered objection carry a count from the store's own surveys, reviews or tickets?
- [ ] Does every review, logo, count and before-and-after trace to a real, checkable source?
- [ ] Do the words under the button match the real return, guarantee and delivery policy exactly?
- [ ] Is the first price shown the amount charged today, or is the gap stated by the button?
- [ ] Does the bundle picker show three or fewer options, savings in money and a real reference price?
- [ ] Is every timer, stock count and was-price true and backed by a record, including the EU 30-day rule where it applies?
- [ ] Is every fix sized in gross profit per month with its working?
- [ ] Was the ship, test or research call made from the page's own monthly orders?
- [ ] Does every test plan state the hypothesis, metric, sample, whole-week run time and stop rule before launch, and was any redesign checked against the winners register?
- [ ] Do the landing templates pass field LCP, INP and CLS on mobile, or does the plan say what fixes them?
- [ ] Was each app's speed cost measured, with tracking pixels left working?
- [ ] Can the buy path be completed by keyboard and screen reader, with contrast and tap targets at WCAG 2.2 AA?
- [ ] Do shoppers in each target market see local currency, real delivery times and the final price before paying?
- [ ] Is the page in the brand's own design system, with no copied look from another brand?

## Common failures

- Every ad points to the same product page headed with the product name. Fix: route by awareness and concept, and write the first screen from the ad.
- Reporting conversion lifts with no traffic, margin or period. Fix: size every change in gross profit per visitor and per month.
- Running split tests on stores that cannot reach a sample, then calling noise a winner. Fix: decide test, ship or research from monthly orders, and write the stop rule first.
- Generic proof: one-line rave reviews, bare press logos, invented customer counts, AI-written testimonials. Fix: one named, sourced review per counted objection; remove anything that cannot be traced.
- Fake urgency: resetting timers, made-up stock counts, permanent same-day deadlines. Fix: use only true deadlines, live stock and real restocks, or leave urgency out.
- A headline price that grows at the cart through fees, quarterly billing or prepay maths. Fix: show today's charge and the schedule before the button, and keep checkout add-ons under about 10% of order value.
- Copying a big brand's funnel or page look without its demand or rights. Fix: borrow structure only, check what feeds the brand's results, and build in the client's own design system.
- Speed reports built on the lab score while field LCP fails, or app removal that breaks tracking. Fix: judge on field Core Web Vitals per template and measure each script before cutting it.
- Removing low-click elements that do a reading job, such as returns notes and size help. Fix: cut on click share only elements whose job is a click.
