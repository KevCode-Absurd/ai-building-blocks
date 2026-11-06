# SEO plus AI answers (AEO and GEO)

Channel 7 of 19. Book chapter it updates: Search engine optimisation. Checked 2026-11-06.

Gabriel Weinberg and Justin Mares, *Traction* (Portfolio, 2015) [1], framed SEO as a choice between a few high-volume terms (the "fat head") and many specific, low-volume ones (the "long tail"). This file restates that in our own words and adds AI answers. The authors have not reviewed or endorsed this kit.

## 1. What this channel is now

One channel, two surfaces: search results (links and the local map pack) and AI-written answers (Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Copilot, Claude, Gemini). AEO and GEO are names for the second. As of November 2026:

- **Google calls it SEO.** Its AI features run on the Search index and core ranking systems. It says sites need no llms.txt, special schema or chopped-up content, and that pages for every query variation made mainly to sway rankings or AI answers are scaled content abuse [2].
- **Fewer clicks.** In Pew's March 2025 data (900 US adults), 18% of Google searches showed an AI summary; people clicked a normal result on 8% of those visits against 15% without one, and links inside the summary got about 1% [4]. Ahrefs linked AI Overviews with a 58% lower click-through rate for the top result (desktop, December 2023 against December 2025; a correlation) [5].
- **New reports.** Since 31 August 2026 Search Console shows AI Overview and AI Mode impressions, not clicks, for sites with enough of them [3]. Bing's AI Performance report (preview from 10 February 2026) counts Copilot citations [7]. GA4's AI Assistant channel holds visits from ChatGPT, Gemini, Copilot and similar; AI Overview and AI Mode clicks stay in Organic Search [8].
- **Access.** Block OpenAI's OAI-SearchBot and you drop out of ChatGPT search answers; robots.txt changes take about 24 hours [6].
- **Answers wobble.** Across 60 to 100 runs of the same prompt, the same brand list came back less than 1% of the time, though how often a brand appeared was steadier than its position [9].
- **Local.** Google ranks local results on relevance, distance and prominence; reviews feed prominence, and nobody can pay for local rank [10].

## 2. When it works and when it doesn't

It works when people already search for the problem in words you can name, when you can answer better than what ranks (first-hand detail, real prices, original data), and when buyers compare before buying, because "best X for Y" questions are where AI answers name brands. It compounds over months.

It doesn't work for a category nobody searches for yet, when you need customers this month, for queries a summary fully answers [4], or, locally, when searchers are too far away [10]. A new site enters through the long tail, rarely the fat head.

## 3. Cheap tests

Test search and AI answers separately; they move on different clocks. Set go and stop lines with the client first. Target cost per lead = the most the client can pay for a lead, from the variant playbook. Lines below are platform facts or sums from the client's figures, not industry averages.

**Test 1 (search): Page-two refresh.** In Search Console, pick five pages averaging position 11 to 20 for queries you want. Improve each answer, rewrite the title, link to it from strong pages, and request indexing.
- Cost: no spend; one to two days.
- Time: six weeks after re-crawl.
- Go: non-branded clicks to the five pages beat their six-week baseline three weeks running, with at least one lead or sale.
- Stop: no change in impressions or position after six weeks.

**Test 2 (search): Long-tail question pages.** Publish one page each for five to ten questions customers ask that no good page answers yet.
- Cost: no spend; three to five days.
- Time: eight weeks.
- Go: impressions for at least half the pages, and cost per lead (hours × hourly cost ÷ leads) at or under target.
- Stop: most pages unindexed or with zero impressions at eight weeks.

**Test 3 (AI answers): Share-of-answers baseline and fix.** Run 20 real buyer questions five times each in ChatGPT search, Google AI Mode and Perplexity, in clean sessions. Record whether you are named and which sites are cited. Fix wrong facts at their source and earn mentions on two or three cited sites, then re-run.
- Cost: no spend by hand; a day plus outreach.
- Time: six to eight weeks.
- Go: the share of runs naming you rises by more than the spread between baseline runs, and AI Assistant visits convert.
- Stop: no change after two rounds of fixes and zero AI referral visits.

**Test 4 (AI answers): Referral value check.** Read 90 days of the GA4 AI Assistant channel and add an "AI assistant" option to "How did you hear about us?".
- Cost: free; one hour.
- Time: 30 days.
- Go: AI Assistant visitors convert at or above the site average.
- Stop: zero AI visits and nobody picks the option.

## 4. The numbers to watch

- **Non-branded clicks** = Search Console clicks minus brand-name queries.
- **Click-through rate** = clicks ÷ impressions.
- **Share of answers** = runs naming or citing you ÷ total runs, per engine, with the run count [9].
- **AI referral conversion rate** = AI Assistant key events ÷ AI Assistant sessions [8].
- **Cost per organic lead** = (hours × hourly cost + tools) ÷ leads from search and AI referrals.
- **Index rate** = test pages indexed ÷ test pages published.

## 5. Tools

- Google Search Console, Bing Webmaster Tools, Google Analytics 4, Google Business Profile, Bing Places: free.
- Google Keyword Planner: free inside a Google Ads account.
- Ahrefs Free (formerly Ahrefs Webmaster Tools): free for verified sites. Ahrefs and Semrush suites: paid.
- Screaming Frog SEO Spider: free up to 500 URLs; paid licence above that.
- AI visibility trackers such as Profound, Peec AI and Otterly.AI: paid.
- Access: the lead's brief sets a level per tool. Level 1 reads Search Console, Bing Webmaster Tools and analytics; level 2 drafts page changes in the CMS, not yet live; level 3 publishes page changes within the client's caps, and every action is logged. Robots.txt and site settings always need a new yes.

## 6. Common mistakes

- Topics from tool volumes that no customer would ask.
- One near-identical page per town or query variation [2].
- "We rank first in ChatGPT" from one screenshot [9].
- Blocking OAI-SearchBot by accident in robots.txt or a CDN bot setting [6].
- Judging SEO after two weeks, or running it a year with no stop line.
- Counting AI Overview clicks as AI traffic [8], or ignoring Bing's citation data [7].

## 7. By business type

### General
Start with the questions your inbox and sales calls already answer, and give each a page with a straight answer near the top. Keep one facts page (what you sell, where, for whom, price ranges) and make every profile match it. Run Test 2 first because it costs only writing time, then Test 4 to learn whether AI tools send anyone at all.

### SaaS
Buyers ask "best tool for X", "X vs Y" and "X alternatives", so build honest comparison, alternatives and integration pages, plus templates and docs that crawlers can read without a login. AI referrals can matter more than their traffic suggests: Ahrefs got 12.1% of its sign-ups from 0.5% of visits [11]. Track the AI Assistant channel and ask how people found you during onboarding, as Tally does [12]. Start with Tests 3 and 4.

### Ecommerce
Category and product pages carry most demand, so run the page-two refresh on your best categories before writing blog posts. Add Product structured data that matches the visible price and stock. Stop filter combinations (size, colour, price) from becoming thousands of thin crawlable URLs. Write buying guides for "which one should I get" questions, and keep price, shipping and returns facts identical on your site, marketplaces and feeds so AI answers repeat the right ones.

### Local
Your Business Profile comes first: right categories, services, hours, photos and a steady flow of genuine reviews, because Google ranks on relevance, distance and prominence [10]. Then build one page per real service and area with local proof such as jobs done, prices and photos, never a template copied across towns. For Test 3, ask "best [service] in [town]" in AI Mode and ChatGPT, note which listing and review sites they cite, and make sure your details there match.

### Coaching
People search for your name, your method and the problem you solve. Write an About page with credentials, who you help and your offer, and use the same bio on LinkedIn, podcast pages and speaker pages so AI tools describe you consistently. Turn the questions prospects ask on discovery calls into case-based answers. Podcast guest spots put your name on other sites, which feeds Test 3. If your topic touches health or money, state your qualifications plainly.

## 8. Real examples

- **Ahrefs.** On 16 June 2025 Ahrefs reported that AI search brought 0.5% of its visits over 30 days but 12.1% of its sign-ups, mostly from ChatGPT. The author called it one site's data and doubted the rate would hold at scale [11].
- **Tally.** On 10 June 2025 the form builder's co-founder wrote that ChatGPT had become its top referral source that year, with over 2,000 tracked sign-ups from AI tools in recent months. Her best guess: ChatGPT's April 2025 update drew more on forums, Reddit and blog mentions, where Tally had spent years answering questions [12].

## 9. Sources

1. *Traction: How Any Startup Can Achieve Explosive Customer Growth*, Gabriel Weinberg and Justin Mares. Penguin (Portfolio Penguin). https://www.penguin.co.uk/books/289806/traction/9780241242537.html (checked 2026-11-06)
2. Optimizing your website for generative AI features on Google Search. Google Search Central. https://developers.google.com/search/docs/fundamentals/ai-optimization-guide (checked 2026-11-06)
3. Generative AI performance report (Search). Search Console Help. https://support.google.com/webmasters/answer/16984139 (checked 2026-11-06)
4. Google users are less likely to click on links when an AI summary appears in the results. Pew Research Center, 22 Jul 2025. https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/ (checked 2026-11-06)
5. Update: AI Overviews Reduce Clicks by 58%. Ahrefs, Ryan Law, 4 Feb 2026. https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/ (checked 2026-11-06)
6. Overview of OpenAI crawlers. OpenAI. https://developers.openai.com/api/docs/bots (checked 2026-11-06)
7. Introducing AI Performance in Bing Webmaster Tools Public Preview. Microsoft Bing Webmaster blog, 10 Feb 2026. https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview (checked 2026-11-06)
8. [GA4] Default channel group. Google Analytics Help. https://support.google.com/analytics/answer/9756891 (checked 2026-11-06)
9. AI Recommendations Change With Nearly Every Query: Sparktoro. Search Engine Journal, Matt G. Southern, 30 Jan 2026. https://www.searchenginejournal.com/ai-recommendations-change-with-nearly-every-query-sparktoro/566242/ (checked 2026-11-06)
10. Tips to improve your local ranking on Google. Google Business Profile Help. https://support.google.com/business/answer/7091 (checked 2026-11-06)
11. Does AI Search Traffic Convert Better Than Traditional Search? For Ahrefs, Yes: 0.5% of Visitors Drove 12.1% of Signups. Ahrefs, Patrick Stox, 16 Jun 2025. https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/ (checked 2026-11-06)
12. From 2 to $3M ARR: How We Bootstrapped Tally With a Tiny Team. Tally blog, Marie Martens, 10 Jun 2025. https://blog.tally.so/from-2-to-3m-arr-how-we-bootstrapped-tally-with-a-tiny-team/ (checked 2026-11-06)
