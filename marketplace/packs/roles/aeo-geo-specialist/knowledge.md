# AEO and GEO specialist: role knowledge

Researched and checked on 6 November 2026. This field changes every few weeks, so every platform fact says when it was true. Numbers in square brackets, like [3], point to entries in `sources.json`. "Practitioner view" marks common professional opinion that no platform has confirmed.

## 1. What this role is for

An AEO and GEO specialist helps a business get named, linked and described correctly when people ask AI systems for answers: Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Microsoft Copilot, Claude and Gemini. AEO means answer engine optimisation. GEO means generative engine optimisation, the name used by the first academic paper on the subject [24]. Google says both are simply SEO, because its AI features are built on the same ranking and quality systems as Search [1]. Treat this role as a specialism on top of good SEO, not a replacement for it.

Who hires it: brands in considered purchases (software, travel, health services, financial products, B2B services, ecommerce), local businesses that live on recommendations, and publishers whose clicks have fallen as AI summaries spread.

Good work has four parts:

1. **Access on purpose.** The crawlers that feed AI answers can reach the site, and the owner has made a deliberate choice about AI training crawlers.
2. **Clear, consistent facts.** What the brand is, sells, costs and stands for is stated plainly on its own site and matches what trusted third-party sources say.
3. **Pages worth quoting.** Key pages give direct, specific, sourced answers and add something no one else has.
4. **Honest measurement.** Visibility is measured by sampling many runs of real buyer questions, alongside the few platform reports that exist, never by one screenshot.

How it is judged: the share of tracked prompts where the brand is mentioned or cited, measured over many runs; how accurately AI systems describe the brand; AI referral traffic and the leads or sales it brings; impressions in Google's Generative AI report and citations in Bing's AI Performance report. It is not judged by "rank number one in ChatGPT", because the order of AI answers changes nearly every time [30].

A note on honesty: this field is full of hype. Most published "AI ranking factors" are correlations from vendors who sell tracking tools. The platforms publish little beyond crawler rules and eligibility. This kit says where evidence is thin, and so should you.

## 2. The canon

- **Pranjal Aggarwal, Vishvak Murahari, Tanmay Rajpurohit, Ashwin Kalyan, Karthik Narasimhan and Ameet Deshpande, "GEO: Generative Engine Optimization" (KDD 2024; first posted November 2023)** [24]. The authors built GEO-bench, 10,000 queries across many domains, and tested nine ways of editing a source page on a GPT-3.5 answer engine fed the top five Google results, then on Perplexity. Adding quotations, statistics and citations to sources, and improving fluency, raised a source's visibility by up to about 40%. Keyword stuffing did not help. Lower-ranked sources gained the most. Limits: a simulated engine, 2023-era models, and visibility measured as words credited to a source, not clicks or sales.
- **Mahe Chen, Xiaoxuan Wang, Kaiwen Chen and Nick Koudas, "Generative Engine Optimization: How to Dominate AI Search" (University of Toronto, September 2025)** [25]. AI search engines leaned much more on earned media (independent third-party sources) than on brand-owned or social content, more so than Google's classic results. Engines differed in source diversity, freshness and how much phrasing changed answers. The advice: earn third-party coverage and write claims that machines can scan and check.
- **Pew Research Center, July 2025** [26]. Browsing data from 900 US adults in March 2025. Covered in section 4.
- **Rand Fishkin (SparkToro) and Patrick O'Donnell (Gumshoe), January 2026** [30]. Repeated identical prompts rarely produced the same brand list. This is why measurement in this kit samples many runs and reports shares, not ranks.
- **Jeremy Howard, the llms.txt proposal (September 2024)** [21]. See section 3.
- **Google, "Optimizing your website for generative AI features on Google Search" (May 2026)** [1][2]. Google's own guide, including a myth-busting list aimed at AEO and GEO claims.
- **Krishna Madhavan (Microsoft Bing), "Optimizing your content for inclusion in AI search answers" (October 2025)** [19]. The most practical platform guidance on page structure.
- **Practitioners worth following:** Mike King (iPullRank) on query fan-out and what he calls relevance engineering; Lily Ray on AI search quality, spam and misinformation; Kevin Indig (Growth Memo) on how people use AI Overviews; Rand Fishkin on zero-click search and the limits of AI tracking.

## 3. How the work is done now

### What each platform documents about choosing sources (as of 6 November 2026)

**Google AI Overviews and AI Mode.** Both retrieve pages from the Search index using Google's core ranking systems (Google calls this grounding) and use query fan-out, running related searches across subtopics [1][3]. They can use different models, so their links differ [3]; Ahrefs notes AI Overviews moved to Gemini 3 in January 2026 [27]. Eligibility: the page must be indexed and able to show with a snippet, with no extra technical requirements [3]. Since 31 August 2026 the site must also be set to "Include" in Search Console's Search generative AI setting. Include is the default; Exclude removes the site's links and content from AI Overviews, AI Mode and Discover's AI features, usually within one to two days, and does not change normal ranking or AI training [4]. Snippet controls (`nosnippet`, `data-nosnippet`, `max-snippet`) and noindex limit what can appear [3]. Google-Extended does not affect Search [6]. Google says you do not need llms.txt, AI text files, special markup, chunked content, rewriting for AI, or special schema; that seeking inauthentic mentions does not help; and that making a page for every fan-out query is scaled content abuse [1].

**ChatGPT search (OpenAI).** OAI-SearchBot crawls for ChatGPT's search features. Sites that disallow it will not appear in ChatGPT search answers, though they may still show as navigational links; robots.txt changes take about 24 hours [11]. GPTBot gathers training data. ChatGPT-User fetches pages when a user asks, and robots.txt may not apply to it. OAI-AdsBot checks ad landing pages [11]. OpenAI's publisher FAQ says any public site can appear, asks sites not to block OAI-SearchBot, and says ChatGPT adds `utm_source=chatgpt.com` to referral links [12]. OpenAI has not published how it ranks sources. Outside evidence: a September 2026 analysis by Peec, a tracking vendor, infers that ChatGPT now uses its own index plus at least eight outside providers, including Microsoft's Web IQ (which Microsoft has confirmed), Google results gathered through third-party scrapers, and Yelp and Tripadvisor for local data; Bing appeared mainly in Deep Research [13]. Treat that as informed inference, not fact.

**Perplexity.** PerplexityBot indexes pages for Perplexity's search results and is not used to train foundation models. Perplexity-User fetches pages for a user's question and generally ignores robots.txt. Changes take up to 24 hours [14]. Perplexity says it searches the web in real time and gives numbered citations, but names no ranking criteria [15]. In August 2025 Cloudflare reported that Perplexity used undeclared crawlers to reach test sites that had blocked it, and stopped treating Perplexity as a verified bot; in the same test ChatGPT-User respected the block [16]. Lesson: robots.txt is a request, not a wall.

**Microsoft Copilot and Bing.** Bing Webmaster Tools added an AI Performance report in public preview on 10 February 2026. It shows total citations, the average number of cited pages, sample "grounding queries" and citation counts per page, across Copilot, Bing's AI summaries and some partner integrations [18]. Microsoft's guidance: its AI systems break pages into smaller pieces and choose the pieces that best answer, so use clear headings, question-and-answer pairs, lists, tables and self-contained answers with specific facts; do not hide key answers in tabs, PDFs or images; use IndexNow to report changes; keep Bing Places listings current; and nothing guarantees selection [18][19]. In September 2023, for what was then Bing Chat (now Copilot), Bing said the NOCACHE meta tag limits chat answers to the URL, title and snippet, and NOARCHIVE keeps content out of chat answers and AI training while leaving pages in Bing search [20]. Confirm the tags still behave this way before relying on them.

**Claude (Anthropic).** ClaudeBot collects content that may be used for training. Claude-SearchBot indexes pages to improve search results. Claude-User fetches pages when a user asks. Blocking each in robots.txt has the matching effect, Anthropic honours robots.txt and `Crawl-delay`, and it advises against IP blocking because its bots then cannot read robots.txt [17]. Anthropic also honours a general machine-readable "no AI training" signal, rolling out over time, with ClaudeBot-specific rules taking priority [17]. Anthropic does not publish how Claude's search chooses sources.

**Gemini.** Google-Extended is a robots.txt token that controls whether Google may use crawled content to train Gemini models and to ground answers in Gemini Apps and Vertex AI. It does not affect Google Search inclusion or ranking [6]. On 30 October 2026 Google said sites that allow Google-Extended stay eligible for Gemini Apps grounding and clicks, and that in 2027 it plans to honour a shared AI-training opt-out token from the IETF AIPREF draft, treating it as a Google-Extended disallow when Google-Extended is not named [7].

### Crawler access at a glance

| Token | Owner | What it does | If you block it |
|---|---|---|---|
| Googlebot | Google | Search, including AI Overviews and AI Mode | Google cannot crawl your pages for Search or its AI features. Never block it for AEO reasons [3] |
| Google-Extended | Google | Gemini training and Gemini Apps grounding | No effect on Search or AI Overviews [6] |
| OAI-SearchBot | OpenAI | ChatGPT search index | Not shown in ChatGPT search answers [11] |
| GPTBot | OpenAI | Model training | Content not used for training [11] |
| ChatGPT-User | OpenAI | Fetches for a user's request | robots.txt may not apply [11] |
| PerplexityBot | Perplexity | Perplexity search index | Not surfaced in Perplexity results [14] |
| Perplexity-User | Perplexity | Fetches for a user's request | Generally ignores robots.txt [14] |
| ClaudeBot | Anthropic | Training | Future content left out of training [17] |
| Claude-SearchBot | Anthropic | Search index | Less visible in Claude's search answers [17] |
| Claude-User | Anthropic | Fetches for a user's request | Not fetched for user questions [17] |
| bingbot (plus NOCACHE, NOARCHIVE) | Microsoft | Bing search | Bing cannot crawl your pages; the 2023 meta tags gave finer control over chat answers and training [20] |

Practitioner view for most businesses: allow the search and user-fetch agents, because they bring visibility and clicks; treat training crawlers as a separate business decision about content licensing and control. Check the CDN or firewall too: bot-blocking settings there can block crawlers the robots.txt allows.

### Entity and brand signals

Practitioner view: AI systems name brands they can confirm across many sources. Ahrefs found that branded web mentions had the strongest link with brand visibility in AI Overviews (a Spearman correlation of 0.664 in a study of 75,000 brands), far above backlinks (0.218); that is a correlation, not proof of cause [28]. Chen and colleagues found AI engines lean on earned media [25]. In practice:

- Keep one canonical facts page (usually About) with founding date, location, leadership, what you sell, who it is for, prices or price ranges, and proof such as awards or certifications. Every profile should match it.
- Add Organization structured data to the home or About page with name, URL, logo, `sameAs` links to official profiles, address and identifiers. Google says it helps tell organisations apart and has no required properties [9].
- Keep names, descriptions, addresses and phone numbers consistent across Google Business Profile, Bing Places, LinkedIn, review sites, industry directories and, where the brand is genuinely notable, Wikipedia and Wikidata (following their own rules on conflicts of interest).
- Earn coverage in the places AI cites for your category: independent reviews, "best of" lists from credible publishers, trade press, original research others quote.
- When an AI system states something wrong, find which cited page says it and fix it at the source: your own outdated page, a directory listing or a third-party article.

### Content that is easy to quote

- **Answer first.** Put a one- or two-sentence direct answer under a heading phrased the way people ask, then the detail.
- **Self-contained passages.** Each paragraph or table should make sense on its own if lifted out [19].
- **Specific, checkable facts.** Numbers with dates and sources, named experts and short attributed quotations were the strongest methods in the GEO tests [24].
- **Something original.** Google warns that summaries of existing content and commodity listicles add little; first-hand experience and original data stand out [1].
- **Visible HTML text.** Not only images, PDFs or collapsed tabs [19].
- **Fresh and dated.** Show when facts were checked; tell Bing about changes through IndexNow [18].
- **No page per variation.** Pages built for every fan-out query count as scaled content abuse [1].

Microsoft encourages question-and-answer pairs and snippable chunks [19], while Google says chunking and special phrasing are not needed [1]. They do not really conflict: a page clearly organised for people works for both.

### Structured data

Structured data helps machines read a page and powers rich results. Google says it is not required for its AI features and that there is no special schema for them, though it remains worth using for rich results [1]. Microsoft says schema helps its systems interpret content with more confidence [19]. Mark up only what people can see.

### llms.txt: a proposal, not a standard

Jeremy Howard proposed llms.txt on 3 September 2024: a Markdown file at `/llms.txt` that lists a site's key pages for language models to use at answer time. Its own site calls it a proposal open to community input [21]. Evidence on use, as of November 2026:

- Google says Google Search does not use llms.txt; making one neither helps nor harms Search visibility [1].
- Ahrefs (June 2026, 137,210 sites with its analytics installed): 28% had a valid file, an upper bound because the sample is technical; 97% of those files received no requests at all in May 2026 [22].
- SE Ranking (reported November 2025, about 300,000 domains): about 10% adoption and no measurable link between having the file and how often a domain is cited in AI answers [23].
- None of the OpenAI, Perplexity, Anthropic or Microsoft pages in this kit's sources say they use llms.txt to choose sources.

Decision: it is cheap to make and may help coding agents read developer documentation. Never sell it as a visibility fix.

### Measuring AI visibility

Use four kinds of evidence together:

1. **Platform reports.** Google Search Console's Generative AI performance report shows impressions in AI Overviews and AI Mode by page, country, device and date; impressions only, no clicks, with a 1,000-row table limit; live for all sites by 31 August 2026 [5]. Bing's AI Performance report shows citations and grounding queries [18]. This research found no comparable site-owner report from ChatGPT, Perplexity, Claude or Gemini as of November 2026.
2. **Referral traffic.** GA4's default AI Assistant channel (medium `ai-assistant`) groups visits from assistants such as ChatGPT, Gemini, Deepseek, Copilot and Grok; clicks from AI Overviews and AI Mode stay in Organic Search [10]. ChatGPT adds `utm_source=chatgpt.com` [12]. App clicks often arrive with no referrer and show up as Direct.
3. **Prompt sampling.** A fixed set of 30 to 100 real buyer questions, run repeatedly on each engine in clean sessions. Record whether the brand is mentioned, linked or cited, its position, rivals named, sentiment, factual accuracy and cited domains. Because answers vary from run to run, report the share of runs with the sample size [30].
4. **Server logs.** Requests from OAI-SearchBot, PerplexityBot, Claude-SearchBot and the user-fetch agents show what is crawled and fetched.

Third-party trackers (for example Profound, Peec AI, Otterly.AI, Semrush's AI Visibility Toolkit and Ahrefs Brand Radar) automate sampling. They query through APIs or scripted sessions, which may differ from what logged-in users see. Google notes that no outside tool has access to its internal ranking or AI systems [8].

### The myths

- **"You need llms.txt."** No platform in this kit says it uses it to pick sources, and studies find no citation effect [1][22][23].
- **"AI needs special schema."** Google says no [1].
- **"Chop content into tiny chunks."** Google says not needed [1]; clear sections are enough.
- **"We can get you ranked number one in ChatGPT."** Lists change nearly every run [30].
- **"GEO replaces SEO."** AI Overviews draw on the Search index [1]. In March 2026 Ahrefs found 37.9% of AI Overview citations ranked in the top 10 for the query and another 31.2% in positions 11 to 100 [27]. Rankings still matter, just less directly.
- **"Seed mentions on Reddit and forums."** Google says inauthentic mentions do not help and its spam systems also feed AI features [1]; communities ban it too.
- **"Block AI bots to protect your traffic."** Blocking search bots removes you from those answers; training bots are a separate choice.
- **"This tool shows Google's AI data."** No outside tool has it [8].

## 4. Benchmarks and numbers

Quote each with its date and caveat.

- **Pew Research Center (22 July 2025; March 2025 data, 900 US adults)** [26]: about 18% of Google searches showed an AI summary; people clicked a traditional result on 8% of visits with a summary and 15% without; about 1% clicked a link inside the summary; 26% of visits with a summary ended the browsing session against 16% without. Summaries appeared on 53% of searches of 10 words or more and 8% of one- or two-word searches. Caveats: Google only, a panel, correlation.
- **Seer Interactive (4 November 2025; June 2024 to September 2025; 3,119 queries, 42 clients)** [29]: organic CTR on informational queries with AI Overviews fell 61%, from 1.76% to 0.61%. In Q3 2025, brands cited in the AI Overview had about 35% higher organic CTR and 91% higher paid CTR than brands not cited. Caveat: Seer says it cannot prove citation causes the higher CTR.
- **Ahrefs (2 March 2026; 863,000 results pages)** [27]: 37.9% of URLs cited in AI Overviews ranked in the top 10 for the same query, 31.2% in positions 11 to 100 and 31.0% beyond 100, down from about 76% in July 2025. Caveats: AI Overviews moved to Gemini 3 in January 2026 and Ahrefs changed its parser.
- **Ahrefs (26 May 2025)** [28]: branded web mentions correlated with AI Overview brand visibility at 0.664, backlinks at 0.218.
- **GEO paper (2024)** [24]: up to about 40% more visibility for a source in a simulated engine.
- **SparkToro and Gumshoe (January 2026)** [30]: the same brand list came back less than 1 in 100 times; in one headphone test the leading brands appeared in 55% to 77% of responses.
- **llms.txt:** 28% valid files and 97% unrequested in Ahrefs' sample [22]; about 10% adoption and no citation link in SE Ranking's [23].
- **Perplexity crawling (Cloudflare, August 2025):** 20 to 25 million daily requests from the declared user-fetch agent and 3 to 6 million from undeclared crawlers [16].
- **Time for crawler rules to take effect:** about 24 hours for OpenAI [11], up to 24 hours for Perplexity [14], one to two days for Google's generative AI Exclude setting [4].

## 5. Decision rules

- If the site is not well indexed and ranking in Google and Bing, fix SEO first, because AI Overviews draw on Google's Search index [1] and Microsoft says SEO basics remain necessary for its AI answers [19].
- If a client wants out of AI training but still wants AI visibility, block the training agents (GPTBot, ClaudeBot, Google-Extended) and allow the search and user agents, because they are separate controls [6][11][17].
- If Search Console's generative AI setting is on Exclude, confirm the owner chose that on purpose, because it removes the site from AI Overviews and AI Mode [4].
- If an AI system states a wrong fact about the brand, trace the cited source and fix it there before touching your own wording.
- If the brand is missing from answers in its category, list the domains those answers cite and earn a place on them, because AI engines favour earned media [25].
- If a page is cited but sends no clicks, give the reader a reason to click: a tool, original data, pricing, booking.
- If anyone proposes a page for every query variation, refuse, because Google treats it as scaled content abuse [1].
- If you report visibility, report a share of runs with the run count, never a single rank [30].
- If a vendor promises guaranteed AI rankings or access to Google's AI data, treat it as a red flag [8].
- If llms.txt comes up, make one only when it is cheap and useful for agents, and say plainly it is not a ranking tool [1][22].
- If a tactic would mislead users or fake popularity (fake reviews, planted forum posts, hidden prompts aimed at AI), do not do it.

## 6. Common mistakes and how to spot them

- **Blocking Googlebot or bingbot to "stop AI".** Spot it in robots.txt and in falling Search impressions.
- **A CDN bot setting that blocks AI crawlers the owner wanted to allow.** Spot it in server logs with no OAI-SearchBot or PerplexityBot hits, or blocked responses.
- **Measuring with one screenshot.** Spot it in reports with no run counts or dates.
- **Reporting "AI rank".** Spot it in tool dashboards showing position as if it were stable.
- **Key facts only in images, PDFs or tabs.** Spot it by viewing the page with JavaScript off and reading the HTML.
- **Inconsistent facts across profiles.** Spot it by comparing the About page, Business Profile, LinkedIn and top directories line by line.
- **Thin "AI-optimised" FAQ pages copied across the site.** Spot them as near-duplicate Q&A blocks; Google counts this kind of mass production as scaled content [1].
- **Treating all AI traffic as one channel.** AI Overview and AI Mode clicks are Organic Search in GA4; assistants are AI Assistant [10].
- **Ignoring Bing.** Copilot citations show in Bing Webmaster Tools [18].

## 7. Quality bar

Before shipping an audit, plan or report, check that:

- Every platform claim cites the platform's own documentation with a date, or is labelled as a vendor study or practitioner view.
- Visibility figures state the prompt set, engines, run count, dates, location, and logged-in or logged-out state.
- Crawler advice separates search, user-fetch and training agents and shows the exact robots.txt lines.
- Factual errors found in AI answers are traced to sources, with a fix for each.
- No recommendation breaks Google's spam policies or a community's rules, or fakes mentions or reviews.
- The client knows what is unknown, especially for engines that publish nothing.
- You state what you could not check (no logs, no Search Console access).

## 8. How this role writes

- **Visibility audits:** a summary of the share of answers mentioning the brand, by engine, against named rivals; then the prompt table, the cited-domain table, the facts-accuracy table and a ranked fix plan.
- **Crawler reviews:** current robots.txt, a recommended version, and a decision table for each agent with the business reason.
- **Fortnightly check notes:** short. What moved beyond normal run-to-run noise, new cited sources, new errors, actions.
- **Tone:** plain and careful with certainty. "In 34 of 50 runs" beats "always". Calls vendor numbers vendor numbers.
- **Conventions:** engine name with mode and date (for example "ChatGPT search, logged out, 2026-11-04"); prompts quoted exactly; robots.txt shown in code blocks.

## 9. Glossary

- **AEO:** answer engine optimisation; getting a brand into AI-written answers.
- **AI Assistant channel:** GA4's default channel for visits from AI chat tools.
- **AI Mode:** Google's conversational search mode with cited links.
- **AI Overview:** Google's AI summary at the top of some results pages.
- **AIPREF:** an IETF working group drafting shared AI-use preference signals.
- **Citation:** a link to a source shown with an AI answer.
- **Earned media:** coverage about a brand on independent third-party sites.
- **Entity:** a thing a system can identify uniquely, such as a company, person or product.
- **GEO:** generative engine optimisation; the academic term for the same work.
- **Google-Extended:** robots.txt token for Gemini training and Gemini Apps grounding.
- **Grounding:** feeding retrieved web pages to a model so its answer is based on them.
- **Grounding query:** in Bing's report, the phrase the AI used to retrieve a cited page.
- **IndexNow:** a protocol for telling Bing and other participating engines about changed URLs.
- **llms.txt:** a proposed Markdown file listing key pages for language models.
- **Mention:** the brand's name in an AI answer, with or without a link.
- **NOCACHE / NOARCHIVE:** Bing meta tags that limit use of content in chat answers and training.
- **OAI-SearchBot:** OpenAI's crawler for ChatGPT search.
- **Prompt set:** the fixed list of buyer questions used to measure visibility.
- **Query fan-out:** running many related searches to build one AI answer.
- **RAG:** retrieval-augmented generation; answering with retrieved documents.
- **Share of answers:** the percentage of sampled runs that mention or cite the brand.
- **User-fetch agent:** a bot that visits a page because a user asked, such as ChatGPT-User.

## 10. What changes fast

Re-check every 14 days:

- Google's AI optimisation guide [1] and AI features page [3]; the Search Console generative AI setting [4] and report [5].
- The Gemini model behind AI Mode and AI Overviews, and Google's I/O and blog announcements.
- Crawler documentation for OpenAI [11], Perplexity [14] and Anthropic [17], including new user agents and IP list changes.
- OpenAI's publisher FAQ [12] and any new publisher reporting from OpenAI, Perplexity, Anthropic or Google Gemini.
- Bing's AI Performance report features [18].
- The AIPREF training signal and Google's 2027 support plans [7].
- GA4's AI Assistant channel definition [10].
- llms.txt adoption studies [22][23] and any platform statement about using it.
- Citation-overlap and click-through studies [26][27][29]; note method changes between versions.
- Tracker features and prices listed in `access.md`.
