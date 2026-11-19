# Reading a D2C brand's marketing from the outside

A teardown answers one owner question: how does this brand get and keep buyers, and what should my store copy, beat or avoid? Think like an operator. "They run Meta ads" is useless. "About 430 ads are live; the four oldest have run 200+ days and all open on the same taste claim; every one lands on a hidden three-pack priced 22% under the single bottles [E21, E7]" is the job.

Work from evidence, in this order: the deterministic scorecard, then the engine, then each lane, then the gaps, then the hand-offs. Every claim cites an evidence id. An inference starts with "Likely" and still cites what it rests on.

## 1. Find the engine first

Most D2C growth comes from one to three channels feeding one offer. Signs of the engine:
- **Paid social at scale**: hundreds of live Meta ads, 20+ launched a month, several ads alive 60+ days, an attribution tool (Northbeam, Triple Whale, Elevar server-side) and a post-purchase survey (Fairing, KnoCommerce). Big creative volume means creative is the targeting: broad audiences, many angles.
- **Subscription**: selling plans on the hero product, a subscription app (Skio, Recharge, Stay AI, Loop), "subscribe and save" in the announcement bar, a subscribe-only price on ads. Subscription turns a one-off CAC into a repeat stream, so they can pay more per first order than a one-off store can.
- **Creators and affiliates**: Superfiliate, Social Snowball, impact.com, ShareASale, Everflow, Euka (TikTok Shop creators), a partners or collab subdomain, other pages running ads for the brand. Creator content usually becomes the ad library.
- **Retail and distribution**: store locators, stockist pages, autocomplete like "brand near me", "brand target", "brand costco". DTC then works as the brand showroom and data source.
- **Content and search**: hundreds of blog posts updated recently, comparison pages, recipes or guides, llms.txt. Rare as the engine for a young brand; common as a moat for an older one.

The loop is the insight. Typical shapes: creators make content, the best becomes Meta and TikTok ads, ads land on a bundle or subscription offer, Klaviyo and SMS bring buyers back, a loyalty or referral program compounds; or: retail builds awareness, search and Amazon capture it, DTC holds the subscription and the community.

## 2. Paid: Meta

- **Volume and velocity**: the Ad Library `estimated_total_count` (live ads) and launches per week in the sample. 100+ live ads and steady weekly launches is a creative-volume strategy; under 10 is testing or brand-only.
- **Winners**: live ads with the oldest start dates. Nobody keeps paying for a loser for 60+ days. Lead with these, quote their headline or opening line exactly, name the angle.
- **Angles** to classify: problem and agitation, social proof, before and after, founder story, offer, demo, comparison or us-versus-them, ingredient or how-it-is-made, listicle, testimonial, POV skit, unboxing, kid or pet reaction, taste test, licensed character or collab, seasonal.
- **What they test now**: the newest ads. Many near-identical new ads with one changed headline is copy testing; new products or characters is launch support.
- **Landing**: homepage, product page, collection, a hidden offer-only product (tags like hidden, upsell, landing) or a `/pages/` landing page. Hidden products and dedicated pages mean a mature, offer-led funnel.
- **Other pages running the brand's ads**: creator, affiliate or partner pages (partnership ads). Name them.
- **Killed ads** (INACTIVE sample): angles they stopped are as useful as winners.

## 3. Paid: Google and the rest

- Google Ads Transparency gives creative counts for 30 days, formats and dates per advertiser. Text means search (brand defence, category and competitor terms). Image and video mean Shopping, Performance Max, YouTube and Demand Gen.
- Other advertisers pointing at the domain are affiliates, coupon sites, resellers or people arbitraging the brand. Many individual names is an affiliate program leaking onto search.
- A Google Ads tag with few creatives means paused, regional or under another legal entity: say which you cannot tell.
- TikTok, Pinterest, Snap, AppLovin, Reddit and CTV pixels prove intent. A TikTok Shop creator tool (Euka) plus a TikTok pixel suggests TikTok Shop and creator affiliates. There is no public global TikTok ad library: link the EU library and Creative Center.

## 4. Offer, pricing and merchandising

- **Price ladder**: median, quartiles and bands. Where are most products? Is there an entry product under the median and a premium anchor above it?
- **AOV levers**: free-shipping threshold divided by median price (1.5x to 2.5x pushes a second unit), bundles and kits, quantity breaks, subscribe-and-save depth, gift with purchase, Rebuy or cart upsells, Rokt thank-you offers.
- **Discount posture**: share of products with a compare-at price and the median depth. Always-on compare-at pricing is anchoring; deep discounts on many products is a clearance or promo-led brand.
- **Entry offer**: the first-order discount, quiz, free gift or bundle the homepage and ads push. Track it over time in the Wayback snapshots.
- **Hidden or offer-only products**: ad offers, bundle components and post-purchase upsells. Price them against the main products.

## 5. Products and launches

- Launch cadence (publish dates of current products), limited editions, collabs and licensed characters, kids or pet lines, seasonal drops, merch. Frequent drops feed ads and email with newness.
- Hero concentration: does one product (or one flavour family) dominate the best-seller or homepage order and the ad headlines?
- Product searches in autocomplete show which products the market already knows.

## 6. Site and conversion

- Product page anatomy on the hero products: rating and review count, subscription selector, guarantee, comparison block, ingredients or specs, how to use, press, UGC or video, quantity breaks, pay later, urgency.
- Testing and upsell tools (Intelligems, Shoplift, VWO, Rebuy, UpCart, AfterSell), quiz tools, search and personalisation. Two or more testing tools is a team that tests prices and pages.
- Speed of the hero product page when measured.

## 7. Retention

- Klaviyo plus an SMS tool (Postscript, Attentive) is a mature lifecycle program; Retention.com or Wunderkind means they email anonymous visitors.
- Subscription app and plan discounts; loyalty (Smile, LoyaltyLion, Yotpo) and referral (Friendbuy, Talkable, Social Snowball) pages and tools.
- Email content itself is not on the site: Milled shows past campaigns. Never sign up with real details.

## 8. Creators, affiliates, social and community

- Affiliate and creator tools, ambassador or partner pages, creator microsites, partner pages in the ad sample.
- Linked social accounts; YouTube cadence and median views from the public feed. Instagram and TikTok reach need the platform pages: record them as unknown unless the owner shares data.

## 9. SEO and AI search

- Sitemap shape: products, collections, pages, blog posts and how many were updated in 90 days.
- Comparison, quiz, science and store-locator pages.
- Autocomplete themes: comparisons name the competitive set; review, legit, side effects and worth-it searches name the objections ads and product pages must answer; deal searches show coupon demand (affiliate leakage); retailer names show distribution.
- AI search: llms.txt present, AI crawlers allowed or blocked.

## 10. Positioning over time

Compare Wayback titles, headings, announcement bars and offers. A changed headline or category word is a repositioning; a new offer in the announcement bar is a new entry offer. Ads and pages usually follow within months.

## 11. Where they are weak

Gaps the owner can take, each grounded: an empty price band, a hero product with thin reviews, a pixel installed but almost no ads on that channel, an objection in autocomplete nobody answers, no comparison pages while shoppers search "vs", a stale blog, a category the autocomplete shows demand for that they do not sell. Weakness is not unknown: say "not seen" when that is all you know.

## 12. Hand-offs to the owner's agents

The report ends with a brief for each agent who should act. Use the lane map in evidence.md (it lists which agents need which evidence). Brief at least six agents across lanes. Each hand-off:
- **What they do**: the competitor's play in that lane, cited.
- **Take**: what to copy, adapted to the owner's store, product, price and customer (from the owner's org context when shared).
- **Beat them**: where the owner can do better.
- **Brief**: a paste-ready job with numbers (how many ads, which price, how often, by when) and the evidence ids to read.

If the owner shared their store or org context, make every Take and Brief specific to it: their products, price points, voice and markets. If not, write for a store in the same category and say so once.

## Never

- Invent spend, revenue, ROAS, conversion rates or results. Never present a pixel as live spend.
- Treat unknown as absent.
- Copy the competitor's ad copy, images or brand into the owner's work. Quote ads only to analyse them.
- Get around a block, log in, sign up, add to cart or buy on the competitor's site.

## Sources

1. [Meta Ad Library](https://www.facebook.com/ads/library/), Meta, checked 2026-11-19. Live and inactive ads per page, start dates, estimated counts.
2. [Google Ads Transparency Center](https://adstransparency.google.com/), Google, checked 2026-11-19. Creatives, formats and dates per advertiser and domain.
3. [Shopify robots.txt.liquid](https://shopify.dev/docs/storefronts/themes/seo/robots-txt), Shopify, checked 2026-11-19. Default crawl rules for Shopify stores.
4. [Selling plans (subscriptions) in Shopify](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/selling-plans), Shopify, checked 2026-11-19. How subscription plans appear on product data.
5. [Web pixels API](https://shopify.dev/docs/api/web-pixels-api), Shopify, checked 2026-11-19. How apps load pixels on Shopify storefronts.
6. [Wayback Machine CDX API](https://archive.org/developers/wayback-cdx-server.html), Internet Archive, checked 2026-11-19. Homepage snapshots over time.
7. [REM: Reverse Engineer Marketing](https://github.com/dansugc/reverse-engineer-marketing), DansUGC, MIT licence, checked 2026-11-19. The evidence-contract idea this agent builds on for D2C.
