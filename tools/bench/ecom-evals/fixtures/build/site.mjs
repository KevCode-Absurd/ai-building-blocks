// Site, search and tracking fixtures: E09 Pela Amazon listing, E10 Fellow landing page CRO audit,
// E11 Pela landing page build, E12 Sleepy Owl homepage, E20 Fellow SEO audit, E21 Ritual AEO audit,
// E22 Pela AI answers, E29 KraveBeauty tracking, E30 Fellow product page copy.
import { csv, md, round, sum, fact, check, days, rng } from "./lib.mjs";

// ---------------------------------------------------------------- E09 Pela, Amazon listing (3 signals)
export function E09() {
  const T = "E09", B = "Pela";
  md(T, "current amazon listing", B, `
# Current Amazon listing: Pela compostable case for iPhone 17 (test data)

- **Title (182 characters):** Pela Case Honey Bee Print Eco-Friendly Phone Case 100% Compostable Biodegradable Plant Based Cute Floral Design Women Gift Protective Cover for Apple iPhone 17
- **Price:** $59.99 USD. Sold by Pela, fulfilled by Amazon.
- **Bullets:**
  1. 100% COMPOSTABLE AND BIODEGRADABLE: made from plants, breaks down in your backyard.
  2. CUTE PRINTS: our Honey Bee print is a customer favourite.
  3. ECO-FRIENDLY GIFT: the perfect gift for nature lovers.
  4. PROTECTIVE: raised edges.
  5. SATISFACTION GUARANTEED.
- **Images (7):** 1 the back of the case on a white background, no phone in it; 2 to 4 print close-ups; 5 the case in soil with leaves; 6 a lifestyle photo of a woman holding a coffee; 7 a box shot.
- **A+ content:** brand story only.
- **Not stated anywhere on the listing:** MagSafe compatibility, drop height, the phone model in the first 40 characters of the title.
`);
  csv(T, "search term report, last 30 days", B, "Amazon Brand Analytics and Sponsored Products search terms for this ASIN.", [
    { search_term: "iphone 17 case", impressions: 412000, clicks: 3900, orders: 78, conversion_rate: "2.0%" },
    { search_term: "iphone 17 case magsafe", impressions: 228000, clicks: 2100, orders: 19, conversion_rate: "0.9%" },
    { search_term: "compostable phone case iphone 17", impressions: 18400, clicks: 610, orders: 85, conversion_rate: "13.9%" },
    { search_term: "eco friendly iphone 17 case", impressions: 26500, clicks: 540, orders: 41, conversion_rate: "7.6%" },
    { search_term: "pela case iphone 17", impressions: 9100, clicks: 1150, orders: 228, conversion_rate: "19.8%" },
    { search_term: "cute iphone 17 case", impressions: 151000, clicks: 1400, orders: 22, conversion_rate: "1.6%" },
  ]);
  csv(T, "customer questions and review themes", B, "Customer questions and review themes on this listing, last 6 months.", [
    { theme: "Question: does it work with MagSafe chargers and wallets?", count: 46, type: "question" },
    { theme: "Question: what drop height is it rated for?", count: 12, type: "question" },
    { theme: "Review: 1 to 2 stars, MagSafe wallet falls off", count: 31, type: "review" },
    { theme: "Review: 5 stars, survived drops on concrete", count: 58, type: "review" },
    { theme: "Review: 5 stars, love the print", count: 74, type: "review" },
    { theme: "Review: 3 stars, case did not break down in my backyard compost after 6 months", count: 9, type: "review" },
  ]);
  md(T, "product facts", B, `
# Product facts (test data)

- Models: iPhone 17, 17 Pro, 17 Pro Max. Each model is its own child ASIN.
- The printed compostable case does not have built-in magnets. A MagSafe module ($12 on our site) adds them. The Clear MagSafe case is a different product.
- Drop testing: passed an internal 6 ft (1.8 m) drop test on 26 drops. No third-party drop certificate.
- Material: plant-based biopolymer. The standards we cite (ASTM D6400, EN 13432) are for industrial composting. We have no home-compost certificate.
- Amazon rating: 4.4 from 1,930 ratings. Average price of the top 10 "iphone 17 case" listings: $21.
`);
}

// ---------------------------------------------------------------- E10 Fellow, landing page CRO audit (3 signals)
export function E10() {
  const T = "E10", B = "Fellow";
  md(T, "ode gen 2 page snapshot", B, `
# Ode Brew Grinder Gen 2 product page, as it is today (test data)

Sections from top to bottom on a phone:
1. Hero: autoplay video of the grinder (file size 9.2 MB), product name, price, variant picker. The variant picker opens on "Gen 2 with SSP burrs, $599.95" by default; the core grinder at $399.95 is the second option.
2. Add to cart button, then "Free US shipping over $75" and "2-year warranty" in small grey text.
3. "Designed for brew" paragraph (180 words). It says the grinder is for pour over, drip, French press and cold brew.
4. A static image titled "Ode vs Opus" showing both grinders side by side. It is an image only; it does not link anywhere.
5. Specs table (31 rows).
6. Reviews (4.6 stars, 1,214 reviews).
7. FAQ (6 questions; none about espresso).
`);
  csv(T, "ga4 funnel by device, last 30 days", B, "GA4 funnel for sessions that viewed the Ode Gen 2 page, 16 Oct to 14 Nov 2026.", [
    { device: "mobile", sessions: 41200, add_to_cart: 1650, begin_checkout: 1080, purchases: 371, conversion_rate: "0.90%" },
    { device: "desktop", sessions: 17800, add_to_cart: 960, begin_checkout: 700, purchases: 463, conversion_rate: "2.60%" },
  ]);
  csv(T, "ga4 by landing variant, last 30 days", B, "GA4 sessions that landed on the Ode page, by the variant in the landing URL.", [
    { landing_variant: "SSP burrs ($599.95, the default)", sessions: 38900, add_to_cart_rate: "3.1%", purchases: 410 },
    { landing_variant: "Core ($399.95)", sessions: 20100, add_to_cart_rate: "6.9%", purchases: 424 },
  ]);
  csv(T, "page speed, field data", B, "Chrome UX Report style field data for the Ode page, last 28 days.", [
    { device: "mobile", largest_contentful_paint_p75: "4.8 s", interaction_to_next_paint_p75: "180 ms", cumulative_layout_shift_p75: 0.04 },
    { device: "desktop", largest_contentful_paint_p75: "1.9 s", interaction_to_next_paint_p75: "90 ms", cumulative_layout_shift_p75: 0.02 },
  ]);
  csv(T, "exit survey, last 30 days", B, "One-question exit survey on the Ode page: 'What stopped you buying today?' (612 answers).", [
    { answer_theme: "Can it grind for espresso? / Do I need Opus instead?", share: "27%" },
    { answer_theme: "Price, just looking", share: "24%" },
    { answer_theme: "Comparing with other grinders", share: "16%" },
    { answer_theme: "Waiting for Black Friday", share: "14%" },
    { answer_theme: "Shipping time", share: "4%" },
    { answer_theme: "Other", share: "15%" },
  ]);
  csv(T, "tap map summary, mobile", B, "Tap map summary for the Ode page on mobile, last 14 days.", [
    { element: "Variant picker", share_of_sessions_tapping: "41%" },
    { element: "\"Ode vs Opus\" image (not a link)", share_of_sessions_tapping: "18%" },
    { element: "Reviews tab", share_of_sessions_tapping: "22%" },
    { element: "FAQ", share_of_sessions_tapping: "9%" },
  ]);
  csv(T, "blog traffic", B, "Sessions on the coffee blog, last 30 days.", [
    { page: "How to dial in a pour over", sessions: 52000, bounce_rate: "81%", purchases: 40 },
    { page: "Best water temperature for coffee", sessions: 31000, bounce_rate: "86%", purchases: 12 },
  ]);
}

// ---------------------------------------------------------------- E11 Pela, landing page build (held-out, 2 signals)
export function E11() {
  const T = "E11", B = "Pela";
  md(T, "black friday offer", B, `
# Black Friday offer from the owner (test data)

- Buy one compostable case, get one free, 27 Nov to 1 Dec 2026, US and Canada stores.
- Both cases can be any model and any print, so a buyer can get one for a friend.
- Hero product: the printed compostable case for iPhone 17, 17 Pro and 17 Pro Max ($75 CAD in Canada; see the brand's facts for current prices).
- Landed cost of one printed case: $9.40 USD. Average shipping cost: $6.10 per order.
- The owner's words: "Build me the landing page for this. Our ads will send people straight to it."
`);
  csv(T, "ad traffic plan", B, "Expected landing page traffic by source for Black Friday, from last year's results.", [
    { source: "Instagram and Facebook ads, gift angle", share_of_sessions: "48%", device_mobile: "93%" },
    { source: "Instagram and Facebook ads, protection angle", share_of_sessions: "23%", device_mobile: "91%" },
    { source: "Email", share_of_sessions: "19%", device_mobile: "72%" },
    { source: "Search", share_of_sessions: "10%", device_mobile: "64%" },
  ]);
  csv(T, "return reasons and reviews, last 6 months", B, "Return reasons and top review phrases for printed iPhone cases, last 6 months.", [
    { item: "Return reason: MagSafe wallet or charger does not stick", share: "41% of returns" },
    { item: "Return reason: ordered the wrong phone model", share: "22% of returns" },
    { item: "Return reason: print looked different", share: "14% of returns" },
    { item: "Review phrase: survived drops on concrete", share: "most common 5-star phrase" },
    { item: "Review phrase: bought one for my sister too", share: "second most common 5-star phrase" },
  ]);
  md(T, "product facts", B, `
# Product facts (test data)

- Printed compostable cases have no built-in magnets. The MagSafe module ($12) adds them.
- Internal 6 ft (1.8 m) drop test passed. No third-party drop certificate.
- The compostability standards we cite (ASTM D6400, EN 13432) are for industrial composting. We have no home-compost certificate and give no home-compost time frame.
- Pela 360 takes back old cases.
`);
}

// ---------------------------------------------------------------- E12 Sleepy Owl, homepage (2 signals)
export function E12() {
  const T = "E12", B = "Sleepy Owl Coffee";
  md(T, "current homepage", B, `
# Current homepage, top to bottom on a phone (test data)

1. Announcement bar: "Free gift on orders above Rs 999".
2. Hero carousel with 4 slides that rotate every 4 seconds: (1) Hazelnut Cold Brew Packs, (2) Matcha premix, (3) Protein Coffee, (4) brand film.
3. "Shop by category" tiles: Instant, Ground, Hot Brew Bags, Cold Brew, Premixes, Merch.
4. Brand story block (220 words).
5. "Find us on Blinkit, Zepto and Instamart" button row.
6. Bestsellers row (Cold Brew Packs are the 5th card).
7. Instagram feed. 8. Footer.
`);
  csv(T, "homepage analytics, last 30 days", B, "GA4 and Shopify, homepage sessions on mobile, 16 Oct to 14 Nov 2026.", [
    { metric: "Homepage sessions on mobile", value: "118,000 (84% of homepage sessions)" },
    { metric: "Hero slide clicks: slide 1 / 2 / 3 / 4", value: "4.1% / 1.2% / 2.0% / 0.6%" },
    { metric: "Share of homepage exits that clicked a quick commerce button", value: "34%" },
    { metric: "Cold Brew Packs share of site revenue", value: "61%" },
    { metric: "Scroll depth reaching the Bestsellers row", value: "29% of mobile sessions" },
  ]);
  csv(T, "conversion by delivery region, last 30 days", B, "Site sessions and orders by region.", [
    { region: "Delhi NCR (2 to 3 day delivery)", sessions: 41000, orders: 1640, conversion_rate: "4.0%" },
    { region: "Rest of India (5 to 7 day delivery)", sessions: 99000, orders: 1730, conversion_rate: "1.7%" },
  ]);
  csv(T, "site search terms, last 30 days", B, "Top on-site search terms.", [
    { term: "cold brew", searches: 6200 }, { term: "hazelnut", searches: 2100 }, { term: "delivery time", searches: 1800 },
    { term: "matcha", searches: 1500 }, { term: "protein", searches: 900 },
  ]);
}

// ---------------------------------------------------------------- E20 Fellow, SEO audit (held-out, 3 signals)
export function E20() {
  const T = "E20", B = "Fellow";
  csv(T, "search console queries, last 3 months", B, "Google Search Console performance by query, 15 Aug to 14 Nov 2026, US.", [
    { query: "fellow", clicks: 182000, impressions: 401000, ctr: "45.4%", position: 1.1, note: "Clicks down 9% vs the 3 months before; down 8% in the same months of 2025" },
    { query: "fellow stagg", clicks: 41000, impressions: 98000, ctr: "41.8%", position: 1.2, note: "" },
    { query: "pour over kettle", clicks: 290, impressions: 48300, ctr: "0.6%", position: 11.4, note: "Ranking URL: /collections/kettles" },
    { query: "electric gooseneck kettle", clicks: 2100, impressions: 39000, ctr: "5.4%", position: 4.8, note: "" },
    { query: "best coffee grinder", clicks: 640, impressions: 61000, ctr: "1.0%", position: 9.7, note: "Two URLs swap: /blogs/brew/best-coffee-grinder and /products/ode-brew-grinder-gen-2" },
    { query: "burr grinder", clicks: 1300, impressions: 27000, ctr: "4.8%", position: 6.2, note: "" },
    { query: "how to make pour over coffee", clicks: 5100, impressions: 88000, ctr: "5.8%", position: 3.9, note: "" },
    { query: "espresso machine for beginners", clicks: 120, impressions: 22000, ctr: "0.5%", position: 18.3, note: "" },
  ]);
  csv(T, "search console pages, last 3 months", B, "Search Console performance by page.", [
    { page: "/collections/kettles", clicks: 9800, impressions: 210000, position: 7.9, words_of_copy: 35 },
    { page: "/collections/grinders", clicks: 4100, impressions: 120000, position: 9.2, words_of_copy: 28 },
    { page: "/products/stagg-ekg-pro", clicks: 22000, impressions: 260000, position: 3.1, words_of_copy: 640 },
    { page: "/products/ode-brew-grinder-gen-2", clicks: 8700, impressions: 190000, position: 5.4, words_of_copy: 720 },
    { page: "/blogs/brew/best-coffee-grinder", clicks: 1900, impressions: 76000, position: 10.8, words_of_copy: 1900 },
  ]);
  csv(T, "crawl summary", B, "Site crawl and server log summary, last 30 days.", [
    { finding: "URLs crawled", value: 2310 },
    { finding: "Googlebot hits on /products/coffee-* URLs that return 404 (expired coffee drops)", value: 1240 },
    { finding: "Expired coffee drop URLs with external backlinks", value: 63 },
    { finding: "Product pages missing Product structured data", value: 0 },
    { finding: "Collection pages with under 50 words of copy", value: 9 },
    { finding: "Average mobile LCP on collection pages", value: "2.3 s" },
  ]);
}

// ---------------------------------------------------------------- E21 Ritual, AEO audit (3 signals)
export function E21() {
  const T = "E21", B = "Ritual";
  const prompts = [
    ["best multivitamin for women", 4, 4, "Named; facts correct"],
    ["is ritual multivitamin worth it", 4, 4, "2 of 4 say Ritual 'does not publish third-party testing', citing a 2021 Reddit thread"],
    ["ritual vs other vitamin subscriptions", 4, 4, "3 of 4 quote a 2023 price"],
    ["best vegan prenatal vitamin", 4, 0, "Not named; answers name brands whose pages list vegan, folate form and DHA source in a short FAQ"],
    ["prenatal with methylfolate and DHA", 4, 1, "Named once"],
    ["best supplement for perimenopause", 6, 0, "Not named; answers cite 3 comparison articles from 2025 and 2026"],
    ["perimenopause supplement that is third-party tested", 4, 0, "Not named"],
    ["synbiotic vs probiotic", 4, 2, "Named as an example"],
  ].map(([p, asked, named, note]) => ({ prompt: p, answers_checked: asked, ritual_named: named, note }));
  csv(T, "ai answers log, nov 2026", B, "We asked each prompt in ChatGPT, Gemini, Perplexity and Google AI Overviews (and two more runs for perimenopause) on 10 to 12 Nov 2026.", prompts);
  csv(T, "sources the answers cited", B, "Pages cited in the answers above, with how often.", [
    { source: "reddit.com thread, 2021, 'Ritual testing?'", times_cited: 7, what_it_says: "Claims no third-party testing (out of date)" },
    { source: "ritual.com product pages", times_cited: 9, what_it_says: "Ingredients; no short FAQ; no 'vegan' line near the top" },
    { source: "Three 2025 to 2026 'best perimenopause supplements' articles", times_cited: 10, what_it_says: "Do not list Ritual" },
    { source: "ritual.com/pages/third-party-testing", times_cited: 0, what_it_says: "Page does not exist; testing info sits in a footer PDF" },
  ]);
  md(T, "product facts", B, `
# Product facts for this test (test data)

- Women's Multivitamin 18+, Prenatal and Perimenopause Health are third-party tested, and the certificates are on file. The site shows them only in a PDF linked from the footer.
- Prenatal and Perimenopause Health are vegan. The Prenatal page mentions vegan in paragraph 6.
- Current subscription prices: Women's 18+ $33, Prenatal $39, Perimenopause Health $39.
- Claims: every benefit needs the FDA asterisk and disclaimer; never say a product treats or prevents a condition.
`);
}

// ---------------------------------------------------------------- E22 Pela, AI answers (held-out, 1 signal)
export function E22() {
  const T = "E22", B = "Pela";
  csv(T, "ai answers log, nov 2026", B, "18 answers from ChatGPT, Gemini, Perplexity and Google AI Overviews, 10 to 12 Nov 2026.", [
    { prompt: "what is pela", answers: 4, problem_answers: 3, note: "3 say Pela makes a kitchen food recycler, linking pela.earth" },
    { prompt: "pela phone case review", answers: 4, problem_answers: 1, note: "1 links pela.earth/products/... which lands on lomi.com" },
    { prompt: "best compostable phone case", answers: 4, problem_answers: 1, note: "1 names Pela but links to a page that redirects to lomi.com" },
    { prompt: "pela vs casetify", answers: 3, problem_answers: 0, note: "All say Pela costs more; facts correct" },
    { prompt: "is pela case really compostable", answers: 3, problem_answers: 0, note: "Correct; mention industrial composting" },
  ]);
  csv(T, "cited urls and status", B, "Pela URLs cited in the answers and in top backlinks, checked on 13 Nov 2026.", [
    { url: "https://pela.earth/", http_status: "301 to https://lomi.com/", times_cited_or_linked: 11 },
    { url: "https://pela.earth/products/eco-friendly-iphone-case", http_status: "301 to https://lomi.com/", times_cited_or_linked: 6 },
    { url: "https://pela.earth/pages/pela-360", http_status: "301 to https://lomi.com/", times_cited_or_linked: 2 },
    { url: "https://pelacase.com/", http_status: "200", times_cited_or_linked: 4 },
  ]);
  csv(T, "backlinks summary", B, "Referring domains by target host.", [
    { target_host: "pela.earth", referring_domains: 1840 }, { target_host: "pelacase.com", referring_domains: 2950 },
  ]);
}

// ---------------------------------------------------------------- E29 KraveBeauty, tracking (held-out, 2 signals)
export function E29() {
  const T = "E29", B = "KraveBeauty";
  const r = rng(2929), d = days("2026-10-16", 30), rows = [], shop = [], ga = [];
  let sumMeta = 0, sumShopMeta = 0;
  d.forEach((day, i) => {
    const after = day >= "2026-10-28";
    const shopMeta = Math.round(30 + r() * 6);
    const renewals = Math.round(7 + r() * 3);
    const browser = Math.round(shopMeta * 1.05);
    const server = Math.round(shopMeta * 1.0) + renewals;
    const dedup = after ? 0 : Math.round(browser * 0.92);
    const reported = after ? browser + server : browser + server - dedup;
    sumMeta += reported; sumShopMeta += shopMeta;
    rows.push({ date: day, browser_purchase_events: browser, server_purchase_events: server, deduplicated_events: dedup, purchases_reported_in_ads_manager: reported, server_events_with_event_id: after ? "0%" : "96%" });
    shop.push({ date: day, one_time_orders: Math.round(70 + r() * 10), first_subscription_orders: Math.round(12 + r() * 4), subscription_renewal_orders: renewals, orders_with_meta_utm: shopMeta });
    ga.push({ date: day, ga4_purchases: Math.round((shop[i].one_time_orders + shop[i].first_subscription_orders) * 0.88) });
  });
  fact(T, "meta_reported", sumMeta); fact(T, "shopify_meta_utm", sumShopMeta);
  csv(T, "meta events manager, daily", B, "Meta Events Manager purchase events, 16 Oct to 14 Nov 2026.", rows);
  csv(T, "shopify orders, daily", B, "Shopify orders by type, same dates. Renewal orders are created by the subscription app.", shop);
  csv(T, "ga4 purchases, daily", B, "GA4 purchase events (browser only, consent mode on). GA4 does not see renewal orders.", ga);
  md(T, "change log", B, `
# Change log (test data)

- 2026-10-28: theme update (new product page and checkout extensions). The developer replaced the custom pixel code.
- 2026-10-28: subscription app updated; it now sends a server-side Purchase event to Meta for every order it creates, including renewals.
- 2026-10-01: consent banner turned on for all visitors in the EU and UK.
`);
}

// ---------------------------------------------------------------- E30 Fellow, product page copy (2 signals)
export function E30() {
  const T = "E30", B = "Fellow";
  md(T, "stagg ekg pro spec sheet", B, `
# Stagg EKG Pro spec sheet (test data, store's own figures for this test)

- Capacity: 0.9 L (about 4 cups of brewed coffee from one fill).
- Heats to a set temperature, holds it for up to 60 minutes. Temperature set in single degrees, C or F.
- Gooseneck spout for a slow, steady pour. Built-in brew timer.
- Finishes: Matte Black, Matte White ($179.95); wood handle ($199.95); Studio Edition ($229.95).
- Warranty: 2 years, US and Canada.
- Safety marks: not confirmed for this test. Do not claim any.
`);
  csv(T, "return reasons, last 6 months", B, "Return reasons for Stagg EKG Pro.", [
    { reason: "Smaller than I expected", share: "31%" }, { reason: "Changed mind", share: "22%" },
    { reason: "Wanted a faster boil", share: "15%" }, { reason: "Defect", share: "9%" }, { reason: "Other", share: "23%" },
  ]);
  csv(T, "review phrases, last 6 months", B, "Most used phrases in 4 and 5 star reviews, with counts.", [
    { phrase: "precise to the degree", count: 212 }, { phrase: "pours like a dream", count: 188 },
    { phrase: "looks great on my counter", count: 160 }, { phrase: "hold mode is a game changer", count: 97 },
    { phrase: "wish it held more water", count: 64 },
  ]);
  md(T, "current page copy", B, `
# Current page copy (test data)

**Headline:** Stagg EKG Pro
**Subhead:** The kettle, perfected.
**Body:** Our most advanced kettle yet. Elevate your ritual with precision temperature control, a counterbalanced handle and timeless design. Experience the difference.
**Bullets:** Precision temperature control. Hold mode. Brew timer. Premium materials.
`);
}
