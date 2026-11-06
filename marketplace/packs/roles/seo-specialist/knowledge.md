# SEO specialist: role knowledge

Researched and checked on 6 November 2026. Platform facts say when they were true. Numbers in square brackets, like [3], point to entries in `sources.json`. Anything marked "practitioner view" is common professional opinion, not a platform statement.

## 1. What this role is for

An SEO specialist helps a business win customers from unpaid search results in Google and Bing. Small and mid-sized businesses hire one when organic traffic drops, before a redesign or domain change, when a new site or product launches, or when paid search has become too costly to carry growth alone. Typical clients are local service firms, online shops, software companies, clinics, publishers and B2B firms with long sales cycles.

The job has four parts:

1. **Access.** Make sure search engines can crawl, render, index and understand the pages that matter, and cannot waste time on the ones that do not.
2. **Relevance.** Match each important page to a real search need and make it the most useful answer for that need.
3. **Trust.** Help the site show who stands behind it, why they know the subject, and earn links and mentions by being worth citing.
4. **Measurement.** Report honestly what search brings in, what changed, and what to do next.

Good work is judged on business results first: qualified organic visits, leads, calls and sales, split into branded and non-branded searches. Next come leading signals: impressions and clicks for target topics, index coverage of the pages that earn money, and visibility in Google's AI features. It is not judged on audit-tool health scores, keyword counts or pages published.

In 2026 an honest SEO also resets expectations. Clicks per search are falling on many informational queries that show AI Overviews: Ahrefs linked an AI Overview with a 58% lower click-through rate for the top result, December 2023 against December 2025 [30]. A flat traffic line can hide real gains in visibility, and the reverse.

## 2. The canon

- **Sergey Brin and Larry Page, "The Anatomy of a Large-Scale Hypertextual Web Search Engine" (Stanford, 1998).** Links work as votes, weighted by the importance of the page that casts them, and the words in a link describe its target. Google still lists link analysis and PageRank among its core ranking systems [4].
- **Andrei Broder, "A taxonomy of web search" (SIGIR Forum, 2002).** Web queries are informational, navigational or transactional. Search intent work today, including the "commercial investigation" bucket that keyword tools add, grows from this short paper.
- **Google Search Central documentation.** The primary canon. Search Essentials and the spam policies [2] set the rules. "Creating helpful, reliable, people-first content" [8] gives Google's self-assessment questions and its Who, How and Why test. The SEO Starter Guide [11] lists what not to waste time on.
- **Google's Search Quality Rater Guidelines, edition dated 11 September 2025** [9]. The fullest public account of what Google means by quality: the main content, the reputation of the site and its authors, E-E-A-T with trust at the centre, extra care for "Your Money or Your Life" topics, and the Lowest rating for pages that are scaled, copied or paraphrased with no added value, however they were made. Raters do not set rankings; Google uses their ratings to check whether its systems work [8].
- **Eric Enge, Stephan Spencer and Jessie Stricchiola, *The Art of SEO* (O'Reilly, 4th edition, 2023).** The standard practitioner textbook, covering research, site architecture, technical work, links and measurement.
- **The 2024 Content Warehouse API leak.** In late May 2024 Rand Fishkin (SparkToro) and Mike King (iPullRank) published analyses of leaked internal Google API documentation. Google confirmed the documents were real but warned against conclusions drawn from out-of-context or outdated material [12]. The lasting lesson: Google stores click-based signals (a system called NavBoost) and site-level signals, so pages that satisfy searchers and sites with a good reputation matter. The leak does not show how anything is weighted [12].
- **Practitioners worth following.** Aleyda Solis (technical and migration checklists), Lily Ray (E-E-A-T and core update analysis), Glenn Gabe (core update case studies), Kevin Indig (search economics), Barry Schwartz (daily search news) and Brian Dean (the Skyscraper Technique: build a better resource than the one people already cite, then tell those who cite the old one).

## 3. How the work is done now

### Google's ranking systems and the 2024 to 2026 updates

Google runs many ranking systems at once, including BERT, MUM, RankBrain, neural matching, passage ranking, reliable information, reviews, original content, freshness, link analysis and spam detection [4]. The helpful content system, launched in 2022, became part of the core ranking systems in March 2024 and is now listed as retired as a separate system [4]. There is no longer a separate "helpful content update". Helpfulness is judged inside every core update.

Dated history (start dates from Google's Search Status Dashboard [1] unless noted):

- **March 2024:** core update from 5 March, finished 19 April, plus three new spam policies: scaled content abuse, site reputation abuse and expired domain abuse. Google first expected a 40% cut in low-quality, unoriginal content in results, then reported 45% after the rollout; that is Google's own figure [3]. Site reputation abuse enforcement began 5 May 2024 [3].
- **Rest of 2024:** spam update from 20 June; core updates from 15 August, 11 November and 12 December; spam update from 19 December [1]. On 19 November 2024 Google said site reputation abuse applies even when the host site has some involvement in or oversight of the third-party content [5].
- **2025:** core updates from 13 March, 30 June and 11 December; spam update from 26 August [1]. In June 2025 Google dropped seven structured data features from results, with no ranking effect [20].
- **2026:** a Discover-only core update from 5 February; a spam update from 24 March and a core update from 27 March; a core update from 21 May; spam updates from 24 June, 18 August and 24 September [1]. A new spam policy against "back button hijacking" (scripts that stop people returning to the page they came from) was announced on 13 April and enforced from 15 June 2026 [7]. From 30 August 2026 Google changed how it enforces the site reputation policy inside the European Economic Area: affected sections may be ranked separately from the rest of the site there, while manual actions still apply to results shown outside the EEA [6].

What core updates mean in practice: they reassess quality across the web, so there is no single thing to fix. Sites that lose usually have thin, unoriginal or search-first content, weak signs of who stands behind them, or a worse page experience than the sites that replaced them. Recovery generally follows real improvement and often only shows at a later core update (practitioner view). Google's guidance is to compare a site's pages against its self-assessment questions rather than chase single signals [8].

### Quality, E-E-A-T and AI-written content

E-E-A-T (experience, expertise, authoritativeness and trust) is not a ranking factor in itself; Google says trust matters most and the other three feed it [8][11]. The rater guidelines tell raters to find out who runs the site, who wrote the page, what their reputation is, and whether the page shows first-hand experience [9]. Google rewards quality however content is produced, and using automation mainly to manipulate rankings breaks its spam policies [10]. Google suggests accurate bylines, an AI disclosure where readers would expect one, and not crediting AI as the author [10]. Scaled content abuse covers mass-produced pages made by AI, people or both [2][3]. The rater guidelines tell raters to give the Lowest rating when they strongly suspect scaled content abuse, even if they cannot tell how the pages were made [9].

### Keyword research and search intent

Keyword work starts with the customer and the live results page, not with a tool's volume figure.

1. **Seeds from customer language:** sales calls, support tickets, reviews, site search logs and the Search Console query report.
2. **Expand** with a keyword tool (Ahrefs, Semrush or Google Keyword Planner). Tool volumes are estimates; Search Console shows real impressions but leaves out rare queries for privacy [26].
3. **Group** terms that one page should answer. The practical test: if the same URLs rank for both terms, they share an intent and belong on one page. If the results differ, they are separate pages.
4. **Classify intent** from the results Google actually shows: informational, commercial investigation, transactional, navigational or local. The result types (shopping units, map pack, videos, forum threads, an AI Overview) show which format wins.
5. **Prioritise** by business value, chance of winning and effort, not volume. For most small businesses a 50-search-a-month query that converts beats a 5,000-search question that never will.
6. **Map** one primary intent to one URL and record it in a keyword map, so two pages do not compete for the same query.

### Site architecture and internal links

- Keep important pages a few clicks from the home page, grouped by topic: hub pages link to detail pages and back.
- Internal links are the strongest signal a site owner fully controls. Google asks for crawlable `<a href>` links, descriptive anchor text, every important page linked from at least one other page, and says there is no ideal number of links [22].
- Use readable, stable URLs. Keywords in URLs and domain names add little ranking value [11]. Google says choose subdomains or subfolders by what suits the business [11]; many practitioners prefer subfolders for content that should share the main site's strength (practitioner view).
- Faceted navigation on shops (filters for size, colour and price) is the classic crawl trap. Link only to facet pages that deserve to rank, canonicalise the rest, and block useless parameter combinations from crawling.

### Technical SEO

**Crawling and indexing.** robots.txt controls crawling, not indexing: a blocked URL can still be indexed without its content [17]. A noindex tag only works if Google can crawl the page and see it. The Search Console Page Indexing report and URL Inspection tool show what Google indexed and why. Crawl budget only matters for big or fast-changing sites; Google's rough guide is 1 million or more pages changing weekly, 10,000 or more changing daily, or many URLs stuck at "Discovered, currently not indexed" [23]. For everyone else a current sitemap and regular Page Indexing checks are enough [23].

**Canonicals.** Redirects and `rel="canonical"` are strong signals; listing a URL in a sitemap is a weak one; Google picks the final canonical [17]. Do not use robots.txt or noindex to choose canonicals, do not send mixed signals, use absolute URLs and self-referencing canonicals, and link internally to the canonical version [17].

**Structured data.** JSON-LD is recommended. Mark up only content people can see. Markup makes a page eligible for rich results but never guarantees them, and spammy markup can bring a manual action that removes rich result eligibility [18]. FAQ rich results have been limited to well-known government and health sites since August 2023, and HowTo rich results were withdrawn in September 2023 [19]. In June 2025 Google dropped seven more result types, including Course Info, Claim Review and Vehicle Listing [20]. Still worth adding where they fit: Organization, LocalBusiness, Product, Article, BreadcrumbList, VideoObject, Event and JobPosting.

**Core Web Vitals.** Three field metrics, judged at the 75th percentile of real page loads: Largest Contentful Paint 2.5 seconds or less, Interaction to Next Paint 200 milliseconds or less, Cumulative Layout Shift 0.1 or less [13]. INP replaced First Input Delay as a Core Web Vital in 2024 [13], and an INP above 500 milliseconds counts as poor [14]. Google says good page experience aligns with what its ranking systems reward, but relevance comes first and there is no single page experience signal [15]. Treat Core Web Vitals as a tie-breaker and a conversion fix, not a ranking lever on its own.

**JavaScript.** Google can render JavaScript, but critical text and links should appear in the rendered HTML. Check with URL Inspection's rendered view before blaming content.

### Content and briefs

The content brief is the SEO's main handoff to writers: query group and intent, reader, an angle that adds something new (first-hand data, experience, a tool), questions to answer, internal links, author credentials and the facts that need sources. Google's own test is whether someone who came to the site directly would find the page useful and leave satisfied [8]. Its warning signs include writing to a word count, chasing trends outside your expertise, summarising others without adding value and changing dates to look fresh [8]. Google says length alone does not affect ranking [11].

### Local SEO

Google says local results depend mainly on relevance, distance and prominence; prominence includes links and the number of reviews and ratings; and there is no way to pay for a better local ranking [24]. The work: verify and complete the Business Profile (categories, hours, attributes, photos), reply to reviews, keep name, address and phone details consistent on the site and in major directories, build one page per real location or service area with genuine local detail, and earn local links and press. Bing has its own listing service, Bing Places for Business.

### Links: earning them versus schemes

Google treats links made mainly to manipulate rankings as link spam. That includes buying or selling links that pass ranking credit, excessive link swaps, automated link building, keyword-rich links in paid articles, low-quality directories and widely spread footer or widget links [2]. Paid or sponsored links must carry `rel="sponsored"` or `rel="nofollow"`, and user-generated links `rel="ugc"` [22]. Repurposing an expired domain for its old reputation is also a breach [2].

Ethical link earning means publishing things worth citing and telling the right people: original data, free tools, expert comment for journalists, local news, real partnerships, and reclaiming unlinked brand mentions. The practitioner rule: if a link would still be worth having when it passed no ranking credit, it is probably fine.

### AI features in Google Search

AI Overviews and AI Mode use query fan-out, running related searches across subtopics, so they can link to a wider set of pages than the classic results [29]. Eligibility needs nothing special: the page must be indexed and eligible to show with a snippet [29]. Snippet controls (`nosnippet`, `data-nosnippet`, `max-snippet`) and noindex limit what can appear [29]. In Search Console, clicks on links inside an AI Overview count as clicks, and an AI Overview takes one position that all its links share [25]. Since 31 August 2026 Search Console's Generative AI performance report has been open to all sites; it shows impressions, but not clicks, in AI Overviews and AI Mode, and may not appear for sites with very few such impressions [28]. Deeper work on AI answers, crawler access and citations belongs to the AEO and GEO specialist kit.

### Measurement

Search Console is the only first-party source of Google Search data: clicks, impressions, click-through rate and average position, by query, page, country, device and search appearance [25]. Know its limits: the table shows at most 1,000 rows, rare queries are left out of tables but kept in chart totals, data usually arrives within two to three days, and days run on Pacific Time [26]. The API and the BigQuery bulk export give more rows. GA4 shows what visitors do after the click. Linking it to Search Console adds query and landing-page reports, with no more than 16 months of Search Console history and about 48 hours' delay [27]. Good reports split branded from non-branded queries, compare like periods (year on year for seasonal businesses), annotate updates and site releases, and tie search to conversions. Bing Webmaster Tools gives a similar view of Bing.

### Site migrations

Google's process for a move with URL changes [21]: list every old URL, map each to its closest new equivalent, use server-side 301 or 308 redirects with no chains, never send many old URLs to the home page, update canonicals and internal links, submit a new sitemap, use the Change of Address tool only for domain or subdomain moves, keep redirects at least a year, and expect rankings to move for a few weeks or more [21]. The SEO's real value is catching failure before launch (see the site-migration workflow).

## 4. Benchmarks and numbers

Use these only with their date and caveat. Prefer the client's own data.

- **Core Web Vitals pass rates** (HTTP Archive Web Almanac 2025, July 2025 Chrome field data): 48% of mobile origins and 56% of desktop origins had good Core Web Vitals overall; on mobile, 62% had good LCP, 77% good INP and 81% good CLS [16]. Caveat: origin-level data from Chrome users only.
- **AI Overviews and click-through rate** (Ahrefs, 4 February 2026): across 300,000 keywords, an AI Overview correlated with a 58% lower click-through rate for the top-ranking page, comparing December 2023 with December 2025 [30]. Caveat: desktop only, a modelled estimate and a correlation, not proof of cause.
- **March 2024 core update:** Google reported 45% less low-quality, unoriginal content in results [3]. Caveat: Google's own measure, not independently checked.
- **Search Console limits:** 1,000 table rows and a two to three day lag [26]; 16 months of history in GA4 [27].
- **Time to see change:** some changes show in hours, others take months; Google suggests waiting a few weeks before judging [11].

There is no reliable, current "average click-through rate by position". Published curves differ widely by industry, device and results-page layout. Use the client's own Search Console data instead.

## 5. Decision rules

- If traffic drops, confirm it is real before touching the site (tracking changes, seasonality, a reporting delay), because many "drops" are measurement or demand changes.
- If a drop starts during a core update on the Status Dashboard, wait for the rollout to finish, then compare losing pages with the pages that replaced them, because core updates reassess quality relative to other sites [1][8].
- If a drop hits one section or template, look for a technical cause first (noindex, canonical, robots.txt, rendering, redirects), because those break whole groups of pages at once.
- If two pages swap places for the same query, merge or clearly separate them and keep one canonical, because they split each other's signals.
- If a page has high impressions but a low click-through rate in positions one to five, rewrite the title and snippet, and check whether an AI Overview or other feature takes the click, before rewriting the page.
- If a valuable page sits in positions 8 to 20, improve that page and link to it from strong pages before writing a new one.
- If a client wants hundreds of near-identical location or AI-written pages, decline unless each page has unique, useful substance, because scaled content abuse applies however pages are made [2].
- If anyone sells links that pass ranking credit, refuse, because link schemes break spam policies and risk a manual action [2].
- If the site has fewer than about 10,000 pages, ignore crawl budget and fix indexing and quality first [23].
- If URLs change, map and redirect every one with a 301 and keep the redirects at least a year [21].
- If a Core Web Vital fails, fix it where it hurts users or sales, and do not promise ranking gains from it alone [15].
- If structured data will not produce a supported rich result, add it only when it describes visible content and helps machines understand the page, and never mark up reviews that are not on the page [18].
- If the topic touches health, money, safety or legal matters, require a named expert author or reviewer and primary sources, because raters hold these pages to the highest standard [9].
- If a tactic only works because Google has not noticed it yet, do not use it on a client's main domain.

## 6. Common mistakes and how to spot them

- **Using robots.txt to remove pages.** They can stay indexed as bare URLs. Spot it as "Indexed, though blocked by robots.txt" in Page Indexing.
- **Launching with staging settings.** A leftover sitewide noindex or `Disallow: /` sinks traffic within days. Spot it by checking robots.txt and meta robots on launch day.
- **Redirecting everything to the home page in a migration.** Google treats this like a missing page. Spot it as many-to-one rows in the redirect map.
- **Chasing tool scores.** Hundreds of "issues" fixed, no traffic change. Spot it when the fix list is not ranked by pages that earn money.
- **Thin, near-duplicate pages** for locations or product variants. Spot them under "Crawled, currently not indexed" or "Duplicate, Google chose different canonical than user".
- **Keyword cannibalisation.** Spot it when the Search Console query report shows two URLs alternating for one query.
- **Unedited AI content at scale.** Spot it in pages with the same structure and generic advice; raters would give them the Lowest rating [9].
- **Reading average position as a rank.** It is an average over every impression [25]; new pages ranking low for many queries can drag it down while traffic rises.
- **Buying guest posts with keyword anchors.** Spot sudden exact-match anchors from unrelated sites in the backlink profile.
- **Review markup on pages that show no reviews**, or self-written reviews [18].
- **Ignoring Bing.** Bing Webmaster Tools is free and also shows how Bing-powered products see the site.

## 7. Quality bar

Before shipping an audit, brief, plan or report, an expert checks that:

- Every recommendation names the pages, the cause, the evidence (export row, URL Inspection result, screenshot) and the expected effect, ranked by business value and effort.
- Platform claims link to Google's or Microsoft's documentation or are labelled "practitioner view". Nothing says "Google confirmed" without a link.
- Numbers come from the client's own data where possible, with date ranges, filters and branded or non-branded splits stated.
- Nothing breaks the spam policies, and nothing needs passwords or API keys pasted into chat.
- Risky changes (robots.txt, redirects, canonicals, sitewide templates) are tested on staging or a sample first and have a rollback plan.
- The client can see exactly what they must approve, who does the work and how long it takes.
- A measurement plan exists: the baseline, what to watch and when to judge (usually 4 to 12 weeks, longer around core updates).

## 8. How this role writes

- **Audits:** a short summary first (three to five findings that matter, with the business impact), then a ranked fix table (issue, evidence, pages, fix, owner, effort, priority), then appendices. Severity: critical (blocks indexing or revenue), high, medium, low.
- **Content briefs:** one page, from query group and intent to the success measure (see the seo-content-brief skill).
- **Monthly reports:** short. What changed, why we think it changed, what we will do next. Annotated charts, branded and non-branded split, conversions next to clicks. Never rankings alone.
- **Tone:** plain, specific and calm. Says "likely" and "we do not know yet" when that is true. Explains a technical term once, then uses it.
- **Conventions:** full URLs, dates in YYYY-MM-DD, Search Console filters stated, "average position" rather than "rank", every recommendation with an owner.

## 9. Glossary

- **AI Overview / AI Mode:** Google's AI-written answers at the top of results, and its separate conversational search mode. Both cite web pages.
- **Average position:** Search Console's average of the topmost position a site held across impressions; not a fixed rank.
- **Canonical URL:** the version of a page Google treats as the main one when several URLs show the same content.
- **Core update:** a broad change to Google's ranking systems, announced on the Status Dashboard and rolled out over days or weeks.
- **Core Web Vitals:** LCP (loading), INP (responsiveness) and CLS (visual stability), measured from real Chrome users.
- **Crawl budget:** how many URLs Google can and wants to crawl on a site; only a concern for very large or fast-changing sites.
- **E-E-A-T:** experience, expertise, authoritativeness and trust; a quality concept from the rater guidelines, not a single ranking factor.
- **Hreflang:** markup that tells search engines which language or country version of a page to show.
- **Keyword cannibalisation:** two or more pages on one site competing for the same query.
- **Manual action:** a penalty applied by a Google reviewer, shown in Search Console.
- **NavBoost:** a Google system that uses click data, described in the 2024 documentation leak [12].
- **noindex:** a meta tag or HTTP header that asks search engines not to index a page.
- **Query fan-out:** an AI search technique that runs many related searches to build one answer.
- **Rich result:** a search result with extra features, such as stars, prices or images, made possible by structured data.
- **robots.txt:** a file that tells crawlers which paths they may fetch; it controls crawling, not indexing.
- **Scaled content abuse:** mass-producing pages mainly to rank, by any method.
- **Search intent:** what the searcher is trying to do: learn, compare, buy, find a site or find a place.
- **Site reputation abuse:** third-party pages published on a host site mainly to borrow its ranking strength.
- **Soft 404:** a page that says "not found" or is empty but returns a success code.
- **Structured data / JSON-LD:** code that labels page content (product, price, organisation) for machines.
- **YMYL:** "Your Money or Your Life" topics, where poor content could harm health, finances or safety.

## 10. What changes fast

Re-check these at every refresh (every 30 days):

- **Update dates and new policies:** the Search Status Dashboard [1] and the Search Central blog.
- **Spam policies page** [2]: new policies were added in 2024 and 2026, and enforcement rules changed for the EEA in August 2026 [6][7].
- **Rater guidelines edition date** [9].
- **Supported structured data features** [19][20] and the Search Gallery.
- **Core Web Vitals metrics and thresholds** [13][14], and the yearly Web Almanac figures [16].
- **Search Console reports and limits** [25][26][28], especially the Generative AI report, which only shows impressions as of November 2026.
- **AI Overview click-through studies** [30]: re-check yearly and note method changes.
- **GA4 channel definitions and the Search Console link** [27].
- **Tool features, prices and official connectors** listed in `access.md`.
