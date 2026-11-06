# Tools I work with and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). Much of this work needs no logins at all: I can run buyer questions through the AI tools myself and read your public pages and robots.txt. I never need your passwords.

Tool details and prices were checked on 6 November 2026. This market moves fast, so check the vendor's page before you buy.

## Access levels

- **Level 1, Read:** I look at Search Console, Bing Webmaster Tools, analytics, tracker exports, logs and your public pages. I change nothing.
- **Level 2, Read and draft:** I also prepare work that is not live yet: page rewrites and About page facts saved as drafts in your CMS, a new robots.txt or llms.txt on staging or as a file, bot rules written but not switched on, outreach emails saved as drafts. You review and publish.
- **Level 3, Read, write and publish:** I also make live changes: publish page rewrites and fact fixes, update robots.txt and bot rules, update business listings, and send correction requests and outreach. Only within the limits you set: which sites, pages and bots, which kinds of change, which contacts, and until when.

At the start of a job I ask which level you grant for each tool, and I write it down under "Access I have". Until you answer, I use level 1. At level 3, I show you the list of actions and the limits once, and I wait for your yes before the first live change. After that I act within those limits. I ask again before anything outside them: a new site or account, spending above a cap, deleting or overwriting pages, blocking or allowing a crawler that wasn't on the agreed list, changing the Search generative AI setting, contacting someone new, or anything that can't be undone. I log every action (what, where, when, result) and report it. If something unexpected happens, such as pages dropping out of the index, crawlers suddenly blocked, or a security warning, I stop and ask. You can lower the level at any time.

## The first questions I ask

1. Which access level do you give me for each tool (Search Console, Bing, analytics, your website and CDN, any tracker), and what are the limits: which pages, which bots, which kinds of change, and until when?
2. Which AI tools do your customers use to research purchases like yours? If you do not know, we start with Google AI Overviews and AI Mode, ChatGPT and Perplexity.
3. Do you want your content used to train AI models? This is separate from appearing in AI answers, and both answers are fine.
4. Is your site verified in Google Search Console and Bing Webmaster Tools? Screenshots of the Generative AI report and the AI Performance report are enough to start.
5. Do you use GA4? Tell me which events count as a lead or sale.
6. Who controls your CDN or firewall (for example Cloudflare), and has anyone switched on a setting that blocks AI bots?
7. Do you already pay for an AI visibility tracker? An export of its prompts and results saves time.
8. What do AI tools get wrong about you today?

## First-party reports (free)

**Google Search Console.** The Generative AI performance report shows impressions (not clicks) for your pages in AI Overviews and AI Mode. Settings > Search generative AI controls whether your site appears in those features at all (Include is the default).
- Level 1: read the reports, or send exports and a screenshot of the Search generative AI setting.
- Level 2: a change list of sitemaps to submit and URLs to inspect.
- Level 3: submit sitemaps and request indexing, within the URLs you list. Only an owner can change the Search generative AI setting, so that change always needs a new yes from you.
- Connect: add me through Settings, then Users and permissions, at the narrowest user type that fits the level.

**Bing Webmaster Tools.** The AI Performance report (public preview since February 2026) shows how often Copilot and Bing's AI summaries cite your pages, and the grounding queries behind them.
- Level 1: read AI Performance and Search Performance, or send exports or screenshots.
- Level 2: a change list of sitemaps and URLs to submit.
- Level 3: submit sitemaps and URLs, within the sites you name.
- Connect: Bing Webmaster Tools' own user settings, with the narrowest role that fits the level.

**Google Analytics 4.** The AI Assistant channel shows visits from tools such as ChatGPT, Gemini and Copilot, and what those visitors do. AI Overview and AI Mode clicks stay in Organic Search.
- Level 1: read reports as a Viewer, or send exports of Traffic acquisition by session default channel group and landing pages for the AI Assistant channel.
- Level 2: a written set-up plan for channel groups, key events and saved reports.
- Level 3: create a custom channel group or saved report and mark key events, within the property you name. This needs a higher GA4 role than Viewer.
- Connect: Google publishes an MCP server for Google Analytics that is read-only by default, which fits level 1: https://github.com/googleanalytics/google-analytics-mcp. For level 3, use GA4's own user roles.

**Google Business Profile and Bing Places** (local businesses). The facts AI tools often repeat: hours, address, categories, services.
- Level 1: read the listings, or send screenshots.
- Level 2: neither has a draft state, so I write the updates as a list for you to make.
- Level 3: update hours, services and descriptions, within the kinds of change you allow. I ask again before changing the business name, address or main category.
- Connect: add me as a Manager through each listing's own access settings, and remove me when we finish.

## The AI engines themselves

No access needed. I run your buyer questions in Google (AI Overviews and AI Mode), ChatGPT with search, Perplexity, Microsoft Copilot, Claude and Gemini, in clean sessions with no personal history, several times each. All I need is your list of real customer questions and the country or city to test from. If you want results as your customers see them when logged in, run the questions yourself and paste the answers with their sources.

## AI visibility trackers (paid)

These automate the prompt runs. They usually query through APIs or scripted sessions, which can differ from what logged-in people see, and none has access to Google's internal ranking or AI systems. For each one:

- Level 1: read results, or send CSV exports of prompts, mentions, citations and sources.
- Level 2: a proposed prompt list for you to load.
- Level 3: add, change or remove tracked prompts, within the prompt count and plan limits you set, because extra prompts can cost more.
- Connect: the tool's own team invite, or its official connector where one exists (below).

| Tool | What it covers (per its own site) | Connector |
|---|---|---|
| **Profound** (https://www.tryprofound.com/) | Visibility and citations across ChatGPT, Perplexity, Claude, Gemini, Microsoft Copilot, DeepSeek and Google AI Overviews; bot and referral analytics. Paid. | Team invite |
| **Peec AI** (https://peec.ai/) | Visibility, position and sentiment across ChatGPT, Perplexity, Gemini and Google AI Mode. Paid. | Team invite |
| **Otterly.AI** (https://otterly.ai/) | Mentions and citations across ChatGPT, Perplexity, Google AI Overviews and AI Mode, Gemini, Copilot and Claude. Paid. | Offers an API and MCP integration |
| **Semrush AI Visibility Toolkit** (https://www.semrush.com/kb/1493-ai-toolkit) | AI visibility score, prompt tracking and brand performance for ChatGPT and Google AI Mode. Paid. | Semrush MCP (https://developer.semrush.com/api/basics/semrush-mcp/) |
| **Ahrefs Brand Radar** (https://ahrefs.com/brand-radar) | Mentions, citations and AI share of voice across AI Overviews, AI Mode, ChatGPT, Perplexity, Gemini, Copilot and Claude. Paid. | Ahrefs MCP (https://ahrefs.com/mcp) |

Connect the Ahrefs and Semrush MCP servers through your AI tool's connector screen, which signs you in on the vendor's own site.

## Your site, CDN and logs

**robots.txt and llms.txt.** Which AI crawlers are allowed, and any notes for AI tools.
- Level 1: read them; robots.txt is public. Tell me about any subdomains.
- Level 2: a new version on staging or as a file, with each change explained.
- Level 3: publish the new file, within the bots and rules you agreed. I check it the same day and log the change.
- Connect: your website platform or hosting, as below.

**CDN or firewall bot settings** (Cloudflare, Akamai, Fastly, a security plugin). These can block AI crawlers that robots.txt allows.
- Level 1: read the bot management settings and custom rules, or send screenshots.
- Level 2: rules written out, or saved but not switched on, for you to review.
- Level 3: change bot rules within the bots and sites you name. I ask again before any change that could block search engines or real visitors.
- Connect: the CDN's own member roles, at the narrowest role that can do the job. Never share the account owner's login.

**Your website platform** (WordPress, Shopify, Webflow or another CMS). Where the pages that AI tools quote live.
- Level 1: read key pages, to check facts are in plain text, not only in images, PDFs or tabs. Public pages need no access.
- Level 2: save page rewrites, fact fixes and schema as drafts. On WordPress, a Contributor account can write drafts but can't publish ([WordPress roles](https://wordpress.org/documentation/article/roles-and-capabilities/)).
- Level 3: publish rewrites and fact fixes within the pages you list. On WordPress this needs an Editor account. I ask again before deleting or merging pages.
- Connect: a limited account made through the platform's own user settings, at the role that matches the level. Remove it when we finish.

**Server or CDN logs.** Which AI bots actually visit and what they get back. Level 1 only: share two to four weeks of lines filtered to AI user agents, with personal data such as the IP addresses of people removed.

**Screaming Frog SEO Spider** (https://www.screamingfrog.co.uk/seo-spider/). Crawls your site with JavaScript rendering off and a chosen user agent, to see roughly what a crawler that does not run scripts receives. It changes nothing on your site. Share a crawl export as CSV, or I can run a small crawl of public pages myself.

Each AI company documents its crawlers and IP lists on its own site: OpenAI (https://developers.openai.com/api/docs/bots), Perplexity (https://docs.perplexity.ai/guides/bots), Anthropic (https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) and Google (https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers).

## Outreach email

**Your email** (for correction requests and outreach to sites that AI tools cite).
- Level 1: read replies you forward to me.
- Level 2: save messages as drafts in your email for you to send.
- Level 3: send messages in your name, only to the contacts and with the wording you approved, and log each one.
- Connect: your AI tool's own email connector, if it has one, signed in by you.

## If you have no tools at all

I can still do most of the work:
- Give me your website, your main competitors and 20 questions customers ask before they buy.
- I will run them through the AI tools, show who gets named and which sources are cited, check your robots.txt and key pages, and list the wrong facts and the fixes.
- Then we set up Search Console and Bing Webmaster Tools, which are free, so you get first-party data from then on.

## Safety rules

- Never paste passwords, API keys, tokens or card numbers into chat. Connect through official connectors, MCP servers or the tool's own sign-in, where you sign in yourself, or send exports.
- I work at the level you grant for each tool, within your limits, and I log every action. You can remove my access at any time.
- Remove personal data from logs and exports before sharing.
- I will not create fake reviews, fake accounts, planted forum posts or hidden text aimed at AI systems.
