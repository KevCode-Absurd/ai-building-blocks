---
name: international-seo-hreflang
description: "The search set-up for a store selling in more than one country or language: a decision on subfolders, country domains or a separate store, the hreflang plan with correct language and region codes and an x-default, checks that every version lists itself and all others, translated and localised pages (titles, handles, product copy, alt text, policies) instead of copied English, sitemaps per domain, a no-forced-redirect rule, and per-country feeds. Built on Shopify Markets, tested in page source and Search Console, ranked by the gross profit each market can earn. Use when opening a second country, when the wrong country's pages show in Google, when hreflang errors appear, or before translating the store."
---

# SEO for selling in more than one country

**You get:** a market structure decision (subfolders, domains or separate store) with the runner-up, an hreflang map for every market version, a translation and localisation list by page, a test log showing tags are reciprocal and valid, and a one-screen summary, ready for the client to approve.

## When to use

- The store is adding a second country or language in Shopify Markets.
- Google shows the US pages to UK or Australian buyers (or the other way round), with the wrong currency.
- Search Console or a crawler reports hreflang errors ("no return tags", unknown codes).
- The store plans to translate pages and wants them to rank in that language.

## Not for

- Opening a country commercially (margin, duties, shipping, payments): use `set-up-markets-and-currencies` first; this skill follows it.
- Per-country Merchant Center feeds and titles: use `write-product-feed-titles-that-match-searches`.
- Ad copy in other languages: use `write-ad-copy-in-indian-languages` only for India, owned by Ishita (`ishita-india-commerce`).
- General crawl and index issues: use `technical-seo-audit-shopify`.

## What you need

Required (read access, level 1):

1. **Markets set-up** from Shopify admin (Settings, Markets): each market, its countries, language, currency, domain or subfolder.
2. **Market launch sheet** from `set-up-markets-and-currencies`, including the go or no-go margin check per country.
3. **Search Console** for the domain property, with country filters on Performance.
4. **Translation status** per language (Shopify's Translate and Adapt app or the translation app in use).
5. **Keyword research per country and language**: buyers in the UK, US and Australia use different words for the same product.

Optional: Bing Webmaster Tools, a crawler that reports hreflang, GA4 by country.

Domain, subfolder and language settings need draft or publish access as agreed: the client approves every change to domains, redirects and language publishing.

## Before you start: the gates

1. **Market earns money.** Pass when the market's landed gross profit per order is positive after duties, shipping and fees (from `set-up-markets-and-currencies`) [MEA-0037]. Fail: no SEO investment in that market.
2. **Content will really be localised.** Google treats localised versions as duplicates only if the main content stays untranslated [SEO-6462]. Fail: if the client will not translate a language, do not publish that language version; use one English version with region targeting instead.
3. **Prices and taxes correct per market.** Tax-inclusive pricing where buyers expect it, duties decided [SET-0004] [SET-6204]. Wrong prices in search results cost trust and feed approvals.
4. **One feed per currency** if Shopping runs in more than one country; a single-currency feed gets auto-converted and underperforms [GAD-0049].

## Steps

### 1. Choose the structure

| Option | Use when | Trade-off |
|---|---|---|
| Subfolders on one domain (example.com/en-gb/) | Default for most stores | All links strengthen one domain; simplest |
| Country domains (example.in, example.co.uk) | Strong local brand or legal reasons, or the domain is already established | Each domain builds strength alone; more set-up |
| Separate Shopify store | Different catalogue, prices, fulfilment or legal entity per country | Separate admin; hreflang still links matching pages |

Recommend one, with the runner-up in a line. Shopify Markets supports subfolders and domains in one store; check in page source after set-up that it outputs the alternate tags for each market.

### 2. Build the hreflang map

For each market version, set the code: ISO 639-1 language, optionally an ISO 3166-1 alpha 2 region; never a region alone [SEO-6462].

| Market | URL pattern | hreflang |
|---|---|---|
| Canada, English | /en-ca/ | en-CA |
| Canada, French | /fr-ca/ | fr-CA |
| Germany, German | /de-de/ | de-DE |
| US, English | / (primary) | en-US |
| UK, English | /en-gb/ | en-GB |
| Fallback | / or language chooser | x-default |

Rules: each version lists itself and every other version, or Google ignores the tags [SEO-6462]; use one method (HTML tags from Shopify, or the sitemap) and keep it consistent; x-default points to the page for buyers who match no market. Same-language markets (en-GB and en-US) still need tags when prices, currency or delivery differ.

### 3. Check canonicals line up

Each market page canonicals to itself, not to the primary-market page. A canonical pointing to the US version tells Google to drop the UK one [SEO-6464]. Test product, collection, home, blog and policy templates.

### 4. Localise, not just translate

For each language market, list and translate: SEO titles and meta descriptions, H1s, URL handles (where the app supports it), product and collection copy, image alt text, menus, policies, and FAQ answers. Then localise:

- Words buyers really search in that country (from the per-country keyword research): "trainers" in the UK, "sneakers" in the US.
- Units, sizes and currency in copy (cm and kg in most countries, inches and pounds in the US).
- Delivery promises and payment options (including pay on delivery) per market, only as true.
- Machine translation is fine as a first draft; a native speaker reviews the top 20 pages by profit and every policy page before publishing.

### 5. No forced redirects

Do not auto-redirect visitors by IP address to their country version; crawlers mostly visit from one country and would never see the others. Use a suggestion banner or country selector instead (practitioner default, and Shopify's own country selector supports this). Keep each market URL reachable directly.

### 6. Sitemaps and Search Console

Shopify generates sitemaps per international domain (Shopify Help Center, sitemap page). Submit each in Search Console and Bing. For domains, verify each one; for subfolders, use country filters in the Performance report to read each market.

### 7. Test

- View source on 5 page types per market: alternate tags present, codes valid, self-reference present, x-default present.
- A crawler with hreflang reports, or a manual check of 20 URLs: every pair links both ways.
- URL Inspection on one page per market: Google's chosen canonical is that market's URL.
- Search Google from each country (VPN or Search Console country filter) for the brand and a top product: the right version shows.

### 8. Market notes

- **UK, EU and Australia:** prices shown include VAT or goods and services tax. In countries with more than one language (Canada, Belgium, Switzerland), add each language version only with real translated pages and support capacity in that language. If the store also sells on a country domain (.co.uk, .de, .com.au), decide whether it becomes that market's domain or redirects to the subfolder.
- **US:** one English version can serve the US and Canada only if prices and currency are the same; otherwise separate markets with en-US and en-CA.

### 9. Measure

At 8 to 12 weeks: impressions and clicks per country in Search Console, the share of each country's clicks landing on its own version, and GA4 orders and gross profit per market. Fix markets where most clicks still land on another country's pages.

## Checks before you hand it over

- Structure recommended with a runner-up and a reason.
- Every hreflang code is a valid language, or language plus region; none is a region alone.
- Every version lists itself and all others; x-default set.
- Each market page's canonical points to itself.
- No language version is published with untranslated main content.
- No forced IP redirects.
- Each domain's sitemap is submitted.
- Nothing published or redirected without the client's yes.

## Output

1. **One-screen summary:** markets, structure chosen and runner-up, languages published, open translation work, test results, when to read results.
2. **hreflang map** (`hreflang-map.csv`): Market, Language, Region, hreflang code, URL pattern, x-default (yes or no), Canonical rule, Sitemap URL.
3. **Localisation list:** Page or template, Language, Translated (yes or no), Localised terms changed, Native reviewer, Status.
4. **Test log:** URL, market, tags found, reciprocal (yes or no), canonical, Google's chosen canonical, result.

## Common mistakes

- **Region-only codes like "IN".** Step 2 uses language first.
- **One-way tags.** Step 7 checks both directions; one-way tags are ignored.
- **Canonical to the main market.** Step 3 keeps each market self-canonical.
- **Copied English under a translated menu.** Gate 2 and step 4 block it.
- **IP redirects.** Step 5 uses a selector instead.
- **Investing in a market that loses money.** Gate 1 checks landed margin first.

## Sources

- GAD-0049: one Merchant Center feed per currency.
- MEA-0037: gross margin is delivered cost.
- SET-0004: tax-inclusive pricing and duties per market.
- SET-6204: charging duties at Shopify checkout needs HS codes and the right carrier.
- SEO-6462: hreflang reciprocity, codes, x-default and untranslated duplicates.
- SEO-6464: canonical signals.

What makes this skill ours: no market gets SEO work until its landed gross profit is positive; a language is published only when its main content is truly translated and reviewed; same-language markets with different prices still get their own tags; and the test log proves reciprocity and Google's chosen canonical for each market.

## Selling in India

- English (en-IN, at /en-in/) is usually the first market version; add hi-IN (/hi-in/) or regional languages only with real translated pages and support in that language.
- Prices shown include GST; state COD availability only where true.
- If the store also sells on a .in domain, decide whether it becomes the India market domain or redirects to the subfolder.
