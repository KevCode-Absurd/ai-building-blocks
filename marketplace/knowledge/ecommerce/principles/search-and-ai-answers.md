# Search and AI answers: craft principles

This book is for the search trade in a store: SEO for Google and Bing, and the newer work of getting a store named and quoted correctly in AI answers (ChatGPT, Gemini, Perplexity, Copilot, Google's AI Overviews and AI Mode). Product copywriters and PR people whose pages and mentions feed both use it too. Read it before the job, write to it, and check the draft against the review checklist before hand-over.

## What great looks like

- Every target page is chosen by the gross profit its queries can bring, and the plan shows that number.
- Collections and product pages are fixed before the blog, and every blog post either sells or feeds a money page.
- Every money page has one indexable URL, sends its selling facts in the HTML and can be read by Google, Bing and the AI search crawlers.
- Each page answers its main question in its first two to four sentences, with numbers that have a source.
- The plan names the third-party pages AI answers cite for the category and how the brand earns a fair place on each.
- Product facts read the same on the site, in the feeds, on the brand-facts page and on third-party profiles.
- Nothing is bought, faked, mass-produced or hidden: no paid links, planted posts, fake reviews or scaled thin pages.
- Results are read as non-brand organic orders, AI mentions per assistant and survey answers, against a baseline and, where possible, a control.

## The principles

### 1. Target buying queries first, and rank pages by the gross profit their queries can bring

**Why it works:** Informational posts rank easily but convert near zero; collections and product pages meet a shopper already choosing. In one agency's data, stores past about 50 products got 80% or more of organic revenue from collections; after two years of blogging, one puzzle store went from under $2,000 a month to over $10,000 with about 40 collections.

**How to apply:** From Search Console and a keyword tool, keep commercial and transactional terms. For a low-authority store, screen for over 1,000 monthly searches, difficulty under 40 and cost per click above $1. Map each term to one page and size it: searches x top-three click share x conversion rate x gross profit per order. Without store data, use the agency's organic rates: 5 to 15% on product pages, 2 to 5% on collections. Warn the owner: one client saw little until month 12.

**Judge it by:** The plan lists pages with a gross profit figure for each, and collections lead. Weak work ranks by search volume or opens with blog topics.

**Breaks when:** The store sells one product, niche terms under 500 searches still convert, or buyers research for weeks and guides must earn links first.

**From:** SEO-0001, SEO-0003, SEO-0008, AEO-0019

### 2. Build each collection to rank: a keyword-first title under 60 characters, 36 to 48 products and 500 to 1,000 words below the grid

**Why it works:** Collections match commercial searches because the shopper wants to compare. The grid is the answer; copy below it gives search engines context without pushing products off the first screen.

**How to apply:** Title tag: the primary keyword first, then a modifier (for women, buy online). H1: just the keyword. Intro: one or two sentences. Below the grid, a buying guide: how to choose, sizes and materials, the top three questions from tickets, links to sub-collections. Show 36 to 48 products per page while speed holds, rather than 20 thin paginated pages. On mobile, show four products with prices on the first screen. Search visitors arrive with intent, so put proof (rating and review count) near the top, not long education.

**Judge it by:** Each top collection has its own title, H1, intro and guide on one named keyword. Weak work copies one paragraph across collections or puts 800 words above the grid.

**Breaks when:** The theme is too slow for 48 products, the collection holds five products and long copy is filler, or demand is mostly brand-name searches.

**From:** SEO-0005, SEO-0003, LPG-0059, LPG-0050

### 3. Give each searched variant its own sub-collection, and keep unsearched filters out of the index

**Why it works:** Shoppers search one product many ways (oversized hoodies, hoodies under $50). One broad collection bets on one hard term; sub-collections each win a softer one. Filter URLs with no demand waste crawling and make near duplicates.

**How to apply:** Per category, list modifiers with commercial intent and difficulty under about 35, then search each: if other stores' collections rank, build it; if only giant brands rank, skip it. Build 5 to 10, each with its own title, H1, intro and guide, even when products overlap. One keyword per page; never aim a product page and a collection at the same term. Link parent and children both ways. Leave other filter combinations as filters, blocked from crawling or canonicalised to the parent, per Google's faceted navigation guidance. A UK skincare store builds vegan face serum, never serum plus 30ml plus pink.

**Judge it by:** A keyword map with one page per term, each sub-collection with real demand and unique copy, and indexed filter URLs not piling up. Weak work makes clone pages with one word swapped, or indexes every filter.

**Breaks when:** Every sub-collection would show the same two products, or nobody searches the category.

**From:** SEO-0012, SEO-6464, https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation

### 4. Give each money page one indexable URL, chosen by redirects and canonicals, never robots.txt or noindex

**Why it works:** When one product sits at many URLs, link signals split and Google may pick a version you did not want. Google rates redirects and rel canonical as strong signals and sitemaps as weak.

**How to apply:** Work the page indexing report from the top-selling pages down. Many Shopify themes link products through collection paths; remove "within: collection" from the grid snippet so grids link to /products/ URLs, then rebuild breadcrumbs from a metafield, since the fix breaks the defaults. Merge colour and size variants into one product unless a variant has its own searches; canonicalise other variant and parameter URLs to it. Noindex only pages that should never be in Search, such as Shopify's auto-made vendor and tag pages. Sitemap only canonical URLs; URL Inspection shows the canonical Google chose.

**Judge it by:** A crawl shows internal links going to one URL per product, and Google's chosen canonical matches the declared one on the top pages. Weak work sorts the fix list by issue count instead of the profit at stake.

**Breaks when:** Signals conflict (links, sitemap or hreflang point elsewhere) and Google picks its own version, or the theme already links clean URLs.

**From:** SEO-0004, SEO-6464, SEO-0007

### 5. Protect URLs that already earn: redirect changed URLs one to one and keep out-of-stock products live

**Why it works:** A URL's rankings and links take years to build; deleting it, or redirecting everything to the homepage, throws that away. AI assistants guess or misremember URLs, so they add broken landings of their own.

**How to apply:** Before any handle change, theme change or migration, export every URL with clicks or links in the last 12 months and map each straight to its new URL, with no chains. Temporarily out of stock: keep the page, mark it out of stock in markup and feeds, and offer back-in-stock alerts and similar products. Gone for good: redirect to the nearest true replacement or parent collection; otherwise return 404 or 410. AI assistants send visitors to 404s 2.87 times more often than Google, so monthly, filter AI-referred sessions that hit a 404 and redirect each URL to the closest real page.

**Judge it by:** The redirect sheet covers every URL that earned clicks or links, with no chains. Weak work deletes sold-out products or sends all old URLs to the homepage.

**Breaks when:** The store is new with no earning URLs yet. A yearly sale page is better kept live at one URL than rebuilt each year.

**From:** SEO-6464, AEO-0008, https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

### 6. Let AI search crawlers in on purpose, and send every selling fact in the server HTML

**Why it works:** Assistants can only recommend what their crawlers fetch and their search indexes hold. Many AI crawlers skip JavaScript, so app-loaded reviews, FAQs and specs are invisible to them, and ChatGPT's live answers draw heavily on Bing's index.

**How to apply:** Check robots.txt and the CDN or firewall bot rules: Ahrefs found about 5.9% of 140 million sites block GPTBot, often through a default CDN setting such as Cloudflare's AI bot block. OpenAI's OAI-SearchBot controls appearing in ChatGPT search, GPTBot gathers training data and ChatGPT-User fetches pages for users; each is set separately and changes take a day. Keep Common Crawl's CCBot open unless the owner opts out. Open top pages with JavaScript off and move whatever vanishes into server-rendered HTML. Submit the sitemap to Google Search Console and Bing Webmaster Tools.

**Judge it by:** An access table per bot with the owner's decision, and a JavaScript-off check that still shows reviews and specs. Weak work says "allow all bots" without checking the CDN.

**Breaks when:** The owner opts out of training (block GPTBot, keep OAI-SearchBot), or the crawler renders scripts (the source names Gemini). Bot security belongs to the security specialist.

**From:** AEO-0028, AEO-0008, AEO-6466, AEO-0002, SEC-0001

### 7. Treat product feeds as search pages: searched terms in the first 70 title characters, and prices that match the page

**Why it works:** Google's free listings and Shopping, and AI shopping channels, read structured product data rather than page prose. A price mismatch between feed and page gets products disapproved and can suspend the account.

**How to apply:** Write feed titles as product type, then key attributes (material, colour, size, use), with the brand last if shoppers do not know it; Google allows 150 characters, but buyers often see 70 or fewer. Supply GTINs; they also unlock Merchant Center's price benchmark. Use a main image with no overlays, watermarks or added logos, near 1500 x 1500 pixels. Run one feed per currency. On Shopify, agentic storefronts let buyers buy inside ChatGPT, Google AI Mode and Gemini, Copilot and Meta; products need Shopify Catalog eligibility (a title, an image, a price above zero) and completed terms, privacy and refund policies.

**Judge it by:** Zero price mismatches, complete policies and titles that start with the searched term. Weak work leaves the default export with brand-first titles.

**Breaks when:** The store is not on Shopify (other catalog routes apply). Channels and settings change fast, so recheck the help pages before each audit.

**From:** GAD-6123, GAD-6122, GAD-0009, GAD-6043, GAD-6170, PRD-6482, AEO-0003, AEO-6467

### 8. Order each product page for fast answers: a 50 to 150 word summary, benefits, an HTML specs table, detail, FAQs, reviews

**Why it works:** Shoppers want a quick answer, and machines read attributes more reliably from a table than a paragraph. The mobile first screen must still say what it is, why this one, why now and why trust you.

**How to apply:** H1 with the product's search term. First mobile screen: rating above the title, price, add to cart and risk reducers. Then a 50 to 150 word summary of the outcome and who it is for; benefits; specs in an HTML table with units (size, materials, compatibility, care); a 500 to 1,000 word description for considered products; FAQs only for the top real objections; then reviews. Alt text is specific ("navy wool jumper, side view"), never a keyword list.

**Judge it by:** An HTML specs table with units, a summary that answers what and why in two sentences, and specific alt text. Weak work pastes the maker's copy found on every other site, or puts specs only in images.

**Breaks when:** The product is a simple impulse buy, or most traffic is paid social and length slows buyers (keep long text below the buy box, in tabs that render in HTML).

**From:** SEO-0007, LPG-6617, LPG-0034, SEO-6463

### 9. Collect real reviews until each key product passes about 80, and serve them in the page HTML where crawlers and assistants can read them

**Why it works:** Reviews move conversion and feed what assistants say about a product. In Blue Sense's data, going from no reviews to about 80 to 100 roughly doubled conversion; past about 80 the count matters less and photo reviews that back the claim matter more. Reviews loaded by script after the page loads are invisible to most AI crawlers.

**How to apply:** Ask every buyer after delivery, and sort photo and video reviews first. Run the JavaScript-off test to confirm reviews render in HTML. Mark up only reviews visible on the page. Keep reviews and replies current on the third-party review site AI answers cite for the brand. Never pay for positive reviews, hide negative ones, write fake or AI reviews, or hide incentives: the FTC's 2024 rule bans these, and Google bars them from markup.

**Judge it by:** Review count per top product, a JavaScript-off check that shows them, and incentives disclosed. Weak work relies on star widgets that vanish without JavaScript.

**Breaks when:** The product is new and must sell on other proof first, or the reviews live on a marketplace with its own rules.

**From:** LPG-6616, LPG-0062, AEO-0002, MCR-6045, SEO-6465

### 10. Size link building from the referring-domain gap to ranking rivals, and earn every link

**Why it works:** In competitive niches, rivals above you usually have more sites linking to them, and on-page work alone will not close that gap. Google's spam policies list buying or selling links for ranking as link spam.

**How to apply:** Average the referring domains of the rivals ranking for your main terms. In one example a store had 105 against an average of 203, a gap of 98: about 4 a month over 24 months, so aim for 6 to 8 because rivals keep earning. For the first 3 months, send about 50 to 75% of links to the homepage and the rest to collections ranking 4 to 10. Earn them with original data (surveys, test results), expert quotes for journalists and product for honest reviews. In many niches 10 to 20 relevant links move a page.

**Judge it by:** A monthly target tied to the gap and a list of assets worth linking to. Weak work buys link insertions or guest posts, which practitioners price at $100 to $400 each and Google treats as spam.

**Breaks when:** Rivals have few links (on-page work wins first), or anchors repeat the exact keyword at volume, which can trigger penalties.

**From:** SEO-0006, SEO-0002, SEO-6461

### 11. Point internal links at money pages on purpose: clean product URLs, collection links high in every guide, and product-page breadcrumbs tested for conversion

**Why it works:** Internal links tell search engines which pages matter and pass strength from pages that earn links (the homepage, guides) to pages that sell. But every link on a product page is also a way out.

**How to apply:** Link each guide to its collection or product in the first 100 to 200 words, plus 3 to 5 related links with 2 to 4 word anchors that describe the target. Link parent collections to sub-collections and back. Link grids to /products/ URLs. Use breadcrumbs on collections. On product pages, test them: True Classic lost revenue after adding category breadcrumbs to product pages, because links away from the product gave shoppers more ways to wander off. If breadcrumbs hurt, keep a light text trail below the buy box, with its markup.

**Judge it by:** A crawl shows the top collections receiving the most internal links, with descriptive anchors. Weak work uses "click here" anchors or stuffs the footer with links.

**Breaks when:** The store is tiny and every page is two clicks from home, or the product page serves mostly paid traffic, where conversion matters more than crawl paths.

**From:** SEO-0011, SEO-0004, LPG-0071

### 12. Put one product cluster's whole effort into a 90-day quarter, and spend most of the budget on the few pages that can win

**Why it works:** Spread across a whole store, effort is too thin to reach the top anywhere. Graphite's analysis found about 1 in 20 landing pages drives about 85% of organic traffic, so a few excellent pages beat many cheap ones.

**How to apply:** Pick the cluster with the most gross profit at stake (a US supplement store might choose creatine). Baseline its URLs in Search Console, Bing Webmaster Tools and analytics. Build topics from the bottom of the funnel first: X versus Y, alternatives to a rival, best X for a use. Ground idea lists in about five rival URLs, and expect about a fifth of AI-made ideas to be poor. Give the likely winners original data, expert input and real photos. Review at day 90 and pick the next cluster.

**Judge it by:** One cluster, a baseline and a short page list with most hours on the top few. Weak work lists 50 topics across every category.

**Breaks when:** The store has one category (the site is the cluster), the cluster's demand peaks outside the quarter, or the team is big enough to run two clusters at once.

**From:** SEO-0009, SEO-0013

### 13. Write blog posts only in four selling formats: you versus a rival, alternatives to a rival, best X for a use, and buying guides

**Why it works:** Lifestyle and seasonal posts earn a few clicks and no orders. Comparison and best-for posts meet people already choosing, and pages of this shape take a large share of AI citations.

**How to apply:** Start with 10 to 15 posts on rivals people search for by name. Link the matching collection or product in the first 100 to 200 words, add 3 to 5 related links with 2 to 4 word anchors, and give a clear verdict for each use. Every rival claim must be true, current and sourced; compare on facts (price, size, materials, warranty), never insults. A Canadian drinkware store might compare its bottle with a named rival in a table of measured hours each keeps drinks cold.

**Judge it by:** Each post maps to a buying query and a money page, and every rival claim carries a source and date. Weak work writes "10 tips for summer" posts, or comparisons that never say which to buy.

**Breaks when:** No rivals are searched by name, the results for the query are all collections (build one instead), or claims would breach advertising or trademark rules.

**From:** SEO-0011, AEO-0006, AEO-0030

### 14. Never publish pages at scale that add nothing; edit AI-assisted drafts by hand and add facts only the store has

**Why it works:** Google's spam policies name scaled content abuse, including generative AI pages without added value. Sites that jump from about 100 to over 1,000 AI-written pages in weeks often rise and then fall within about three months, and recovery can take 2 to 3 years. Graphite found only about 10 to 12% of ranking or cited pages were fully AI-written.

**How to apply:** Use AI for research, outlines and first drafts. Before publishing, add what only the store knows: test results, return reasons, fit notes, original photos, staff expertise and real prices. Publish at a measured pace tied to the cluster plan. Treat a vendor promising 300 to 500% AI visibility gains from volume as a warning sign.

**Judge it by:** Every new page carries at least one fact or asset not found on rival pages. Weak work ships hundreds of same-shaped "what is" pages with no store data.

**Breaks when:** Pages are built from unique structured data, such as compatibility tables or location pages with real stock, which can work at scale.

**From:** AEO-0018, AEO-0033, SEO-6461, SEO-0013

### 15. Map the sources AI answers cite for your buying questions, and earn a place on the most-cited ones first

**Why it works:** Assistants summarise many sources, and the brand named most often across them tends to be named first. In Ahrefs' study of 75,000 brands, branded web mentions correlated with AI Overview visibility at 0.664, more than backlinks did, and listicles made up 43.8% of cited pages.

**How to apply:** Choose five core buying questions. For each, record about 30 classic search results and the sources AI answers cite (about 50 each, about 250 in all). Remove duplicates, then count and rank domains and pages. Then pick a move per source: pitch the list's editor, update the review profile, join the thread openly, or send product to the reviewer. A useful first target is a place on about 20% of the top 10 cited domains. New brands can appear fast, since a citation can follow a mention within days.

**Judge it by:** A citation sheet with counts and an outreach list ranked by citation frequency. Weak work says "do more PR" with no list, or buys placements without disclosure.

**Breaks when:** Answers cite mostly marketplaces or one big publisher, or paid inclusion is restricted (health, finance). Re-map each quarter.

**From:** AEO-0001, AEO-0007, AEO-0029, AEO-0034, AEO-0022

### 16. On Reddit and forums, work the threads assistants cite, as a named team member comparing on facts

**Why it works:** In one growth team's tracking, Reddit moved ChatGPT most, and the one steady citation pattern was others discussing the brand next to an alternative. One negative comment can stay in answers for months.

**How to apply:** For each core buying question, list the threads assistants cite, with age and open or locked status; in one audit the only cited thread was eight years old and locked, so new posts changed nothing. Pick communities where buyers gather and where the problem is discussed. Post from a named account that states the connection, answer the question and compare with a named alternative on facts. Go narrow first: a US running brand takes best shoe for flat feet before best running shoe. Check brand threads weekly; answer negative ones early with facts and a fix.

**Judge it by:** A thread sheet marking which are cited, and disclosed posts that compare on facts. Weak work buys post volume or says "our product is great".

**Breaks when:** The category has no active communities, or they ban brand posts. Undisclosed posting breaks Reddit rules and FTC endorsement guidance. Reddit once fell out of OpenAI results, so spread effort.

**From:** AEO-0027, AEO-0014, AEO-0024, AEO-0029

### 17. Trace every wrong AI fact about the brand to its source, fix that source, and publish one brand-facts page

**Why it works:** Assistants fill gaps with whatever they find. In an Ahrefs test with a made-up brand, Gemini and Perplexity repeated planted false details in 37 to 39% of answers; ChatGPT cited the official FAQ in 84%.

**How to apply:** Ask each assistant about the brand's reviews, price, ingredients, shipping and returns. Log every wrong or old fact and the page it cites, then fix that page: reply to reviews and invite real customers on the cited review site (Trustpilot is often cited), correct old listings, answer the cited thread. Publish a dated brand-facts page in plain HTML: what products contain and do not, prices, shipping regions, returns, certifications. When an assistant answers from memory, repeat the fact across the site, founder videos and third-party articles; in one case the answer changed after about two years.

**Judge it by:** A fix list linking each wrong fact to its source, owner and correction. Weak work sends one press release.

**Breaks when:** The brand is large with consistent coverage, or the "fact" is not true, which makes the work deception. Review requests follow each site's rules; the FTC's 2024 rule bans paying for positive reviews.

**From:** AEO-0011, AEO-0014, AEO-0017, MCR-6045

### 18. Answer the specific follow-up questions no page answers yet, in the wording assistants search with

**Why it works:** Chat prompts run about 25 words against about 6 for a Google search, and many ask about fit, compatibility or use that no page answers, so the first clear answer can be the only citation. Assistants also rewrite prompts into sub-searches (fan-out queries), often adding the year, a use case or review sites.

**How to apply:** Collect real questions from support tickets, chats, reviews, returns and site search. Read the sub-search wording in the searches Perplexity shows, or in ChatGPT's network log in the browser's developer tools, and use it in titles, URLs, H1s and first sentences. Host answers in a help subfolder (/help/), not a subdomain, so they share the store's authority. A UK camera accessory store might answer whether its grip fits a named camera body, with a yes, a photo and the product link.

**Judge it by:** Each page names the real question behind it, and titles match observed sub-search wording. Weak work writes generic "what is X" pages.

**Breaks when:** Products are simple with few pre-sale questions, or the help platform is stuck on a subdomain and a proxy is not worth it. Fan-out wording shifts with model updates, so recheck it.

**From:** AEO-0031, AEO-0016

### 19. Write guides as answer capsules: the buyer's question as a heading, then a self-contained 20 to 25 word answer

**Why it works:** Answer engines lift passages, not whole pages. A short answer that makes sense alone is easy to quote and to credit. In Ahrefs' study of 174,000 pages cited in AI Overviews, word count barely mattered (correlation 0.04) and over half of cited pages were under 1,000 words.

**How to apply:** Phrase H2s as real questions from tickets and Search Console (which size for a 10 kg dog). Answer in 20 to 25 words, 50 at most, with the specific fact, range or verdict. Follow with a comparison table, then detail. Link each number to its source. Put 60 to 70% of a guide in this shape, and open the page with a 2 to 4 sentence direct answer. Add original data the store has (return rates by size, test results).

**Judge it by:** The first sentence under each heading still answers when read alone. Weak work uses headings like "Introduction", opens answers with "it depends" or pads word count.

**Breaks when:** The piece is a lookbook or brand essay where a question skeleton reads as robotic, or the answer needs approved health or safety wording.

**From:** AEO-0023, AEO-0030, AEO-0009, AEO-0021

### 20. Plan and report each assistant as its own channel, because each draws from different sources

**Why it works:** Ahrefs found only 7 of the 50 most-cited domains appear in all three of Google AI Overviews, ChatGPT and Perplexity. Graphite found ChatGPT's citations overlap Google's results about 35% and Perplexity's about 70%, so a strong Google ranking does not ensure a ChatGPT mention.

**How to apply:** Track mention share per assistant. Classic Google SEO serves AI Overviews and AI Mode. For ChatGPT, add Bing indexing and third-party mentions; in one growth team's experience, Reddit discussion moved ChatGPT most. Perplexity leans on third-party sources and can cite a fresh page the next day, against about 30 to 45 days for ChatGPT. Expect only 30 to 40% of tactics to carry across engines. Over 45% of AI Overview citations change at each refresh, about every two days, so read trends over weeks, never single runs.

**Judge it by:** A table with one row per assistant, its mention share and the tactics aimed at it. Weak work reports "AI visibility up 20%" without naming an assistant.

**Breaks when:** Shares move with model updates and data deals, so re-measure rather than reuse these numbers after about six months. Categories with little Reddit talk get less from Reddit work.

**From:** AEO-0012, AEO-0032, AEO-0024, AEO-0026

### 21. Refresh the pages you want cited on a set schedule, with real changes, not new dates

**Why it works:** Answer engines favour current sources. In Ahrefs' data, AI-cited content was about 25.7% fresher than classic top results, and 76% of ChatGPT's top-cited pages had been refreshed within the previous 30 days. One growth lead also saw citations fade after some months.

**How to apply:** List the 10 to 20 pages that earn, or should earn, citations: buying guides, comparisons, the brand-facts page and top collections. Every one to two months, update what really changed: prices, stock, new products, test results, rival changes, review counts, and the year in titles where buyers search with it. Show a visible updated date with a one-line note of what changed. Re-check citations two to six weeks later.

**Judge it by:** A refresh log showing what changed on each page and when. Weak work bumps dates with no content change, which can mislead readers and is unlikely to help.

**Breaks when:** The topic is truly static (care basics, sizing rules), or the page is transactional, where product data and reviews matter more than freshness.

**From:** AEO-0009, AEO-0021, AEO-0026, AEO-0030

### 22. Mark up only what is true and visible on the page, and never sell markup as an AI shortcut

**Why it works:** Google uses product, offer and review markup to show price, stock, shipping and ratings in results, but never guarantees the rich result. Google says AI Overviews and AI Mode need no special files, AI text files or schema; a page must simply be indexed and able to show a snippet. FAQ rich results stopped showing in Google from 7 May 2026.

**How to apply:** On product pages, mark up name, image, brand, GTIN, price, currency, availability, shipping and returns, and an aggregate rating from user reviews shown on the page, following Google's merchant listing guidance. Add breadcrumb markup where breadcrumbs are visible. Validate with the Rich Results Test. Keep FAQ blocks, because buyers and assistants read the plain text, but never add or pad them for a snippet.

**Judge it by:** Every marked-up value matches the visible page and the feed exactly. Weak work marks up ratings the page does not show, or sells an "AI schema" or llms.txt project as the main fix.

**Breaks when:** Other search engines and assistants may still read FAQ markup, and Google changes features, so recheck its Search Gallery before any markup project.

**From:** SEO-6465, SEO-6160, AEO-6460, https://developers.google.com/search/docs/appearance/structured-data/merchant-listing

### 23. Publish each priority comparison on YouTube too, so the brand fills more results and more AI sources

**Why it works:** One page can rank only once on a results page; the same topic as a video and an article on another strong domain can take more spots. YouTube is about 5.6% of AI Overview citations, and YouTube mentions correlated 0.737 with ChatGPT visibility in Ahrefs' 75,000-brand study.

**How to apply:** For each top comparison or best-for topic, make a site article, a YouTube video with a clear spoken verdict and a written description, and, where the founder is active there, a LinkedIn article. Title each with the same buying question, and have the team share them so each gets indexed. One speaker took 5 of the top 30 results for one topic this way. Embed the video on the article with a light embed so speed holds.

**Judge it by:** Each priority topic has two or more owned assets with matching titles and the same verdict. Weak work posts a video with no spoken answer or description.

**Breaks when:** LinkedIn content looks out of place for a consumer category and does not rank, the copies are thin duplicates, or engines tighten on third-party platform content.

**From:** SEO-0010, AEO-0007, AEO-0022, SPD-0010

### 24. When clicks fall but rankings hold, compare click-through rate with position before you change any page

**Why it works:** Since about 2024 many pages keep their spot but lose clicks, because a rival's snippet got better or an AI Overview now answers the query above the result. AI Overviews show on about 21% of keywords but about 58% of question queries, and 99.9% of the keywords that trigger them are informational.

**How to apply:** In Search Console, chart CTR against position by page over 6 to 12 months. If position is steady and CTR fell, look at the results page: a stronger rival snippet means rewrite the title and description; an AI Overview means change the goal to being named inside it. Check Search Console's generative AI report for heavy AI impressions on that page. If clicks fell with position, look first for an update, a technical change or seasonality. Advise stores against Google's AI Overviews opt-out: being quoted beats being absent.

**Judge it by:** The diagnosis shows position, CTR and impressions for the same pages and dates. Weak work blames "a Google update" with no page data.

**Breaks when:** The site earns from page views rather than sales, so AI answers cost revenue, or the report is not yet available on the property.

**From:** AEO-0005, AEO-0019, AEO-0004

### 25. Measure search by non-brand organic orders and AI influence by three signals together, because clicks alone undercount both

**Why it works:** Brand searches grow when ads and PR create demand, so counting them flatters SEO. Only about 28% of AI mentions carry a link (10.7% in AI Overviews), and shoppers who see a brand in an answer often search for it or type the URL. At Ahrefs, AI referrals were 0.5% of visits but 12.1% of sign-ups.

**How to apply:** Split Search Console and GA4 organic data into brand and non-brand queries, and report non-brand clicks, orders and gross profit. For AI, track three things: AI referral sessions through a GA4 custom channel matching AI domains, read as a trend; a fixed panel of buying questions run monthly per assistant, logging whether the store is named; and a how-did-you-hear question with ChatGPT and AI assistant as visible options, in rotated order. Discount tracker answers given without a web search, and compare logged-in and logged-out runs.

**Judge it by:** The report shows non-brand organic and AI as separate lines against a baseline. Weak work headlines total organic sessions.

**Breaks when:** Order volume is low and survey shares are noisy. The Ahrefs and Gamma figures are software sign-ups, not store orders.

**From:** AEO-0010, AEO-0020, AEO-0025, AEO-0015, MEA-6356

### 26. Test search and AI tactics against a control group of pages or questions, not a before-and-after chart

**Why it works:** AI answers vary from run to run and assistant use keeps rising, so visibility drifts up on its own; rankings also move with season and updates. Without a control, any tactic looks like it worked.

**How to apply:** Build a set of about 200 buying questions from search terms, paid search terms, rivals' paid terms, tickets and Reddit. Split them into two matched groups of about 100. Apply the change (answer capsules, a refresh, a source pitch) to one group only, and track both for a couple of weeks before and after. For page changes, do the same with similar pages: rewrite titles on half the comparable collections and compare CTR with the untouched half over the same weeks. Expect most tests to show no clear winner; even in well-run A/B testing only about 10 to 20% do.

**Judge it by:** The test names its control, dates and metric before it starts. Weak work offers one screenshot of a new mention as proof.

**Breaks when:** The category is too narrow to form two comparable groups, or a brand-wide change (a big press mention) lifts the control too.

**From:** AEO-0035, CRO-0012

### 27. Give each country or language version reciprocal hreflang tags and its own currency feed, and present as local in each market

**Why it works:** Without correct hreflang, search engines may show the wrong country version, with the wrong currency and delivery terms, and Google ignores tags that are not reciprocal. Buyers also distrust stores that look foreign; in the US they fear tariffs, slow delivery and customs.

**How to apply:** Each version lists itself and every other version, using ISO 639-1 language codes with optional ISO 3166-1 alpha 2 regions (en-GB works, GB alone does not), plus x-default as the fallback. Pick one method (HTML tags, headers or sitemap) and keep it consistent. Translate for real, since untranslated copies count as duplicates. Run one Merchant Center feed per currency; a single-currency feed shows converted prices and loses clicks. A UK brand entering the US should run a US site with US spelling, sizes and prices, and never lead with being foreign.

**Judge it by:** A hreflang check shows no missing return tags, and each market's results show local currency. Weak work ships one English page with a currency switcher and no hreflang.

**Breaks when:** The store sells in one language and one country, or the engine handles language signals differently from Google.

**From:** SEO-6462, GAD-6170, LPG-6612

### 28. Keep money pages inside Core Web Vitals on mobile, fixing the hero image and app scripts first

**Why it works:** Speed rarely decides ranking alone, but it directly lifts conversion: one published case saw a 31% LCP gain lift sales 8%. A page passes at LCP 2.5 seconds or less, INP 200 ms or less and CLS 0.1 or less, measured at the 75th percentile of real loads.

**How to apply:** Check field data per template (home, collection, product) in Search Console or PageSpeed Insights. Field data is a rolling 28-day sample, so judge a fix weeks later, not the same day. On Shopify, the most common cause of slow LCP is a lazy-loaded or faded-in hero image: load it eagerly with high fetch priority. Count third-party services: across 1,533 Shopify stores, those with 0 to 5 scored a median 74 on mobile, those with 21 to 30 scored 44. Hand the full speed audit to the page speed specialist.

**Judge it by:** Field data per template, with the fix tied to the template that sells most. Weak work shows a lab score screenshot and calls it done.

**Breaks when:** The page serves the wrong intent; a fast page that does not match the search still loses.

**From:** SPD-6183, SPD-0006, SPD-0001, SPD-0004, SPD-0005

## Working from the org context

- Read the buyers' own words first (reviews, tickets, chats, survey answers). Their terms become keywords, question headings and first sentences; a term buyers use beats the brand's internal product name.
- Keep the voice. Title tags and meta descriptions may lead with the keyword, but intros, guides and answers use the brand's voice and reading level.
- Quote product facts and approved claims word for word. The brand-facts page and markup use only facts in the org context; flag a missing fact instead of guessing it.
- Use what sells to set priority: best sellers and the highest-margin collections get pages and links first. Winning ad angles can become collection intros and comparison angles.
- Build on the design system. New collection, guide and help pages use the existing templates; propose template changes (a specs table, server-rendered reviews) as a theme fix list.
- Check that offers and policies match everywhere: shipping, returns and guarantees must read the same on the page, in markup, in feeds and on the brand-facts page.
- Where the brand does something that hurts search (brand-first product names, script-loaded reviews, handles changed without redirects), propose the change with the profit at stake and a test. Never change it silently.
- Write back what you learn: new buyer questions, terms that rank, wrong facts found in AI answers and the sources that carried them.

## Review checklist

- [ ] Is every target page tied to buying intent and a gross profit figure?
- [ ] Do collections and product pages come before blog work in the plan?
- [ ] Does each keyword map to exactly one page, with no product page and collection aimed at the same term?
- [ ] Does each money page have one indexable URL, chosen by redirect or canonical, with that URL in the sitemap?
- [ ] Does every changed or removed URL that earned clicks or links have a direct, one-step redirect?
- [ ] Is each AI crawler allowed or blocked by a recorded decision, with CDN and firewall rules checked as well as robots.txt?
- [ ] Do reviews, specs and FAQs still show on top pages with JavaScript off?
- [ ] Is the sitemap submitted to both Google and Bing?
- [ ] Do feed titles lead with the searched term, and do feed prices match the page exactly?
- [ ] Does each guide or answer page open with a direct answer, and does each heading's first sentence answer on its own?
- [ ] Does every number on the page link to a source, and is every rival claim true, sourced and dated?
- [ ] Is there a citation map for the core buying questions, with an outreach list ranked by citation count?
- [ ] Is every wrong AI fact traced to its source, with a fix and an owner?
- [ ] Is community work aimed at threads assistants actually cite, from named accounts that state the connection?
- [ ] Does structured data match the visible page and the feed, with no markup sold as an AI shortcut?
- [ ] Are links earned, with none bought or placed to pass ranking credit?
- [ ] Does every new page carry at least one fact or asset rival pages do not have?
- [ ] Are results reported as non-brand organic orders and per-assistant AI mentions, against a baseline?
- [ ] Is any claimed win tested against a control group or matched pages?
- [ ] Do hreflang tags list every version both ways, with one feed per currency for multi-currency stores?

## Common failures

- Ranking pages by search volume and writing informational blog posts that bring traffic and no orders. Fix: rank by gross profit per query and build collections first.
- Cloning one collection into dozens of near-identical pages with a word swapped. Fix: build a sub-collection only for a searched modifier, with copy no other page has.
- Deleting sold-out or discontinued products and losing their rankings. Fix: keep returning products live, and redirect gone products to the closest real replacement.
- Adding schema, an AI text file or FAQ markup and calling it AI optimisation. Fix: get pages indexed, put facts in the HTML and earn mentions on the sources answers cite.
- Leaving reviews and FAQs in script widgets that AI crawlers never see. Fix: run the JavaScript-off test and render them in the page HTML.
- Publishing hundreds of AI-written pages in weeks. Fix: publish fewer pages, edited by hand, each with facts only the store has.
- Buying links or placing undisclosed paid mentions and planted forum posts. Fix: earn links and mentions with data, samples, expert input and honest participation.
- Reporting one blended AI visibility score from tracker runs that never searched the web. Fix: report per assistant, discount no-search answers and add a how-did-you-hear survey.
- Paying for new Reddit posts when the only thread assistants cite is old and locked. Fix: list the cited threads first and post only where it can change the answer.
- Counting brand searches as SEO wins. Fix: split brand from non-brand and report non-brand orders and gross profit.
- Claiming a lift from a before-and-after chart. Fix: name a control group and the dates before the change ships.
- Writing comparison posts that never pick a winner or make unsourced claims about rivals. Fix: compare on sourced facts and give a clear verdict for each use case.
