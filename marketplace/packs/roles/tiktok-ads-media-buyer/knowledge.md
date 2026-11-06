# TikTok ads media buyer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked.

**Read this first.** On 2026-11-06 TikTok's own help centre, business blog, newsroom and API docs refused automated fetches. So platform facts here come from three kinds of source: TikTok's own code on GitHub [9][10], a partner's documentation [11], and trade summaries from Social Media Today, labelled as summaries. Rules come from EU, UK and US regulators. Facts that could not be confirmed this way are left out and listed in section 10, to check inside TikTok Ads Manager before relying on them: the current objective list, creative specs, the advertising policy list, attribution windows and Spark Ads authorisation steps.

For general paid-media method (auction thinking, lift tests, creative concepts and hooks), see the sibling kits `meta-media-buyer` and `ad-creative-strategist`. This file covers what is different about TikTok.

## 1. What this role is for

A business hires a TikTok ads media buyer to turn short vertical video into sales or sign-ups at a cost it can afford. The buyer plans the campaign, keeps the tracking honest, briefs creators, tests hooks one change at a time, moves budget to what sells, and keeps every ad inside TikTok's rules and the law on disclosure and AI labels.

Who hires it: shops selling to under-35s, apps, venues and events, brands with creators who already post about them, and brands selling through TikTok Shop.

What good work looks like:

- **Maths first.** The most the business can pay per sale or sign-up comes from price and margin, shown in the plan.
- **Creative is the main lever.** Several distinct hooks and formats in every test, each with a name, a kill rule and a log entry. TikTok's own research partner found relevance beats sheer volume [13].
- **Clean signal.** Pixel and Events API send key events once, deduplicated, with consent where the law needs it [9][10].
- **Creators treated fairly.** Clear briefs, honest disclosure, their agreement before their post becomes an ad, and the client pays them.
- **Honest reporting.** Platform numbers are checked against the shop, and premium formats are judged on business effect, not price alone [12].

How the role is judged: cost per sale or sign-up against margin, how fast the account learns which hooks work, how stable results are, and trust. A good buyer acts only within the access level and limits the client set, logs every change, and says when the data cannot answer a question.

## 2. The canon

**Byron Sharp, *How Brands Grow* (2010).** Growth comes mostly from reaching more buyers, including light ones, and being easy to recall. On TikTok that argues for broad delivery and distinctive brand cues early in each video.

**Eugene Schwartz, *Breakthrough Advertising* (1966).** People sit at different levels of awareness, and each level needs a different opening. Hook tests work best when hooks are written for different awareness levels, not just reworded.

**Les Binet and Peter Field, *The Long and the Short of It* (IPA, 2013).** Short-term sales activity and long-term brand building do different jobs. On TikTok, judging every ad on next-day sales starves the reach that makes later sales cheaper.

**Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (2020).** Decide the main metric and stop rule before a test starts, and distrust lucky early winners. The Meta kit's canon covers this and the case for lift tests in more depth.

**TikTok and Ebiquity, UK econometrics (reported February 2026) [12].** An econometric study of UK brands for TikTok, isolating TikTok's contribution to sales. Its practical advice: keep ads under 25 seconds, show the brand in the first 2 seconds, and match format to objective rather than to the lowest price. It was commissioned by TikTok, so treat its numbers as a reason to test.

**Warc and TikTok, creative and AI study (reported July 2026) [13].** A survey of 400 marketers in the UK, US, Australia and Brazil. Marketers found AI useful for making assets but weaker for scripts. The report's message: relevance to the audience's culture matters more than output volume.

## 3. How the work is done now

### 3.1 Smart+ and manual campaigns (as of November 2026)

**Smart+** is TikTok's AI-run campaign type. A trade summary of TikTok's 23-page guide (January 2026) says Smart+ predicts who is likely to respond, so ads reach relevant people without manual audience settings, and that the guide also covers manual campaigns and multiple asset groups [1]. Changes since then, all from trade summaries:

- **January 2026:** Auto-select recommends creatives from the brand's existing ads and from eligible creator content in TikTok One. Ad previews show every creative combination before launch. Smart+ gained duplication, draft mode, automated rules and bulk editing [2].
- **May 2026 (TikTok World):** more manual control options, and Music Autofix, which flags music that cannot be used [3].
- **October 2026 (Advertising Week):** Smart+ extended to automate search ads across keywords and creative, and Smart+ Creative Selection groups image, video, AI-made and creator assets [4].

**Manual campaigns** remain for when you need to control a choice yourself [1]. The detailed list of objectives, bid options and settings could not be confirmed from TikTok's own pages this release; read them in Ads Manager when planning.

How to choose: Smart+ suits accounts with working tracking, enough conversions for the system to learn from, and a steady supply of creative. Manual set-ups suit a clean test of one question, a narrow constraint the client insists on, or an account whose tracking is not yet trusted. Draft mode in Smart+ [2] is useful at access level 2.

### 3.2 Identity, Spark Ads and creators (as of November 2026)

- **No more custom identity.** TikTok phased out Custom Identity, which let ads run without an official account, with removal due in early 2026. Ads now run from a TikTok account, linked to the ad account in Business Center [5]. TikTok's own backend tests found 59.3% of advertisers saw cost per acquisition fall by at least 10% after linking accounts; that is TikTok's claim [5].
- **Spark Ads** promote existing organic posts as ads: the brand's own posts, or a creator's post with the creator's agreement, shown in the feed or as TopView [5][6]. They have existed since July 2021 [6]. The exact authorisation steps for a creator's post could not be confirmed this release; follow the current flow in Ads Manager, and never ask a creator for their login.
- **Creator sourcing.** TikTok One holds creator content that Smart+ can draw on [2]. Symphony Agent (June 2026) can write creator briefs and invite creators to pitch [7].
- **Disclosure.** When a creator is paid or given product, the relationship must be clear. The US FTC says to disclose in the video itself, spoken and on screen, in plain words such as "ad" or "sponsored", and not to rely on a platform tool alone [25]. The UK ASA updated its influencer guide on 23 October 2026, with the CMA [26]. TikTok's own disclosure settings must be used as well; check their current names in the app.
- **Money.** Paying creators is the client's decision and the client's payment. The buyer prepares fee proposals and contracts for approval.

### 3.3 Creative and Symphony (as of November 2026)

TikTok's Symphony suite generates and adapts creative. As reported in May 2026: video and image generation on Dreamina Seedance 2.0, Voiceover Avatars that use licensed actors' likenesses in over 30 languages, Product Avatars that present a product, and translation [3]. Symphony Agent (June 2026) builds video ads from trending examples or from campaign details, with results that vary by prompt and capacity [7].

What the evidence says about creative [12][13]:

- Keep ads under 25 seconds and show the brand in the first 2 seconds.
- Average play duration tracked with revenue per thousand impressions in the Ebiquity work, so how long people keep watching is a useful early signal.
- Use AI for assets and variations; keep humans on the idea and the script.

Exact specs (sizes, lengths, safe zones, caption limits) could not be confirmed from TikTok's own pages this release. Check the spec sheet in Ads Manager before production.

### 3.4 Labels for AI-generated content (as of November 2026)

- **Ads.** Since July 2024 Ads Manager has had a self-disclosure toggle that puts an AIGC label on AI-generated ads, and AI avatars or virtual influencers that sell products must be labelled [14].
- **Organic and Spark posts.** TikTok requires users to label realistic AI content [16]. It reads C2PA Content Credentials to label AI content made with other tools, and attaches Content Credentials to content made on TikTok (May 2024) [15]. It is testing invisible watermarks on content made with its own tools (November 2025) [16]. TikTok says it had labelled over 3 billion videos by July 2026 [17].
- **TikTok Shop LIVE.** AI-generated voices and recordings in place of live speech are banned in shopping livestreams (June 2026) [18].
- **EU AI Act.** From 2 August 2026, Article 50 requires deployers to disclose deepfake images, audio or video, and providers to mark synthetic content in a machine-readable way, with providers of systems already on the market given until 2 December 2026 for the marking duty [23][24].

Practice: switch the AIGC disclosure on for any ad where AI made or changed a realistic person, voice or scene, including Symphony avatars, and keep the file's Content Credentials intact.

### 3.5 Pixel and Events API (as of November 2026)

TikTok's own Google Tag Manager templates show how its tracking works [9][10]:

- **Browser:** the TikTok Pixel needs its base code on the site. The web template maps standard GA4 events to TikTok events: purchase to CompletePayment, sign_up to CompleteRegistration, begin_checkout to InitiateCheckout, view_item to ViewContent, add_to_cart to AddToCart [9].
- **Server:** the Events API template sends events server to server to TikTok's v1.3 endpoint, signed with an access token. It runs only in a server-side container [10].
- **Deduplication:** both templates carry an event_id so the same event sent by Pixel and Events API is counted once. Use the same ID (for example the order number) on both [9][10].
- **Matching:** email and phone are lowercased, trimmed and hashed with SHA-256 before sending; an external ID is hashed too. The server template stores TikTok's click ID (ttclid) from the landing URL in a first-party cookie for 30 days and reads the _ttp browser cookie [10]. The Pixel hashes plain email and phone itself when advanced matching is on [9].
- **Testing:** a test event code sends events to the test view instead of live data [10].
- **Consent:** neither template contains consent logic [9]. Consent has to come from the site's consent tool and tag manager settings.

Platform plug-ins do much of this for you. The WooCommerce plug-in, for example, installs the Pixel and turns on Advanced Matching, which sends hashed email, phone, name and location [11].

### 3.6 Measurement (as of November 2026)

TikTok's attribution windows and reporting defaults could not be confirmed this release; read the attribution setting on every export and name it in reports. What is known:

- The TikTok and Ebiquity econometrics found premium formats (TopView and Pulse) produced 3 to 4 times the revenue per thousand impressions of Brand Auction, and TopFeed about twice the impact at about twice the cost [12]. Judge formats on business effect per impression, not on cost per impression alone. This is a TikTok-commissioned UK study.
- Check platform-reported sales against shop orders for the same dates. When spend is large enough, use a holdout or lift test (method in the Meta kit).

### 3.7 Access, Business Center and AI agents (as of November 2026)

Business Center controls who can reach the ad account, catalogue, audiences, Pixel and activity logs. Agencies are added as members and given access to named assets [11].

AI agents: TikTok announced an Ads MCP server at TikTok World in May 2026 that lets third-party AI tools such as Claude and ChatGPT manage campaigns [3]. In June 2026 it launched an Agentic Hub of "AI Skills" from TikTok and partners (HubSpot, Wix, Constant Contact, Mobvista), linked to that server [8]. In October 2026 it described a protocol for connecting third-party AI apps to the ads system [4]. None of the summaries describe permission controls or spend limits for agents, so confirm them in TikTok's own documentation before connecting at level 2 or 3.

### 3.8 Policy, teens and regulation (as of November 2026)

- **Teens (US).** Since 1 July 2024 US advertisers can reach teens only through broad options: location, language and device [14].
- **EU.** The Digital Services Act bans targeted ads to children and ad targeting on sensitive data, and requires ads to show who placed them and why [21]. In December 2025 the European Commission accepted TikTok's commitments to show full ad content and links in its ad repository, update it within 24 hours, and share targeting criteria [22]. TikTok joined the European Advertising Standards Alliance in February 2026 [19].
- **US ownership.** Since January 2026 the US app is run by TikTok USDS Joint Venture LLC. The algorithm is retrained on US data, and the updated US privacy policy allows on-platform data to be used for off-platform ads [20].
- **Review.** A partner's documentation says ad reviews typically finish within 24 hours [11].
- **Ad policy list.** TikTok's restricted and prohibited categories could not be read this release. Before planning anything in health, weight, finance, alcohol, dating, gambling or anything aimed at under-18s, read the current policy in Ads Manager and get the client's adviser involved where needed.

### 3.9 Cookie consent for the Pixel: UK and EU (as of November 2026)

- **EU.** The European Data Protection Board says tracking pixels, tracking links and identifiers hashed on the device and collected by site code fall under Article 5(3) of the ePrivacy Directive (guidelines adopted 7 October 2024) [27]. Its cookie banner taskforce (17 January 2023) said no consent-requiring tag may fire before a positive action, banners need a reject option, pre-ticked boxes are invalid, and legitimate interest cannot justify placing the tag [28].
- **UK.** The Data (Use and Access) Act 2025 keeps the PECR ban on device storage and access unless an exception applies; the new exception in the government factsheet covers statistics on how a service is used, and none is named for advertising [29]. The ICO's guidance is the regulator's word; its site refused automated fetches for this release, so check it directly.

In practice: fire the Pixel only after consent where needed, make sure the Events API respects the same choice, and treat this as practice, not legal advice.

## 4. Benchmarks and numbers

No independent all-industry TikTok cost or click averages could be verified this release. Use the account's own history.

TikTok-reported or TikTok-commissioned figures, to frame a test, never as a target:

- 59.3% of advertisers saw cost per acquisition fall at least 10% after linking accounts [5].
- Premium formats 3 to 4 times the revenue per thousand impressions of Brand Auction (UK econometrics) [12].
- Over 3 billion videos labelled as AI-generated by July 2026 [17].

Platform numbers worth remembering: ttclid cookie kept 30 days by TikTok's server template [10]; catalogue ads need at least six approved products in the WooCommerce plug-in [11]; ads under 25 seconds and brand in the first 2 seconds (Ebiquity advice) [12].

## 5. Decision rules

- **If** tracking is missing or double counting, **fix the Pixel and Events API with a shared event_id before spending more**, because the system optimises on what you send [9][10].
- **If** the client wants to judge TikTok on one ad, **test at least three distinct hooks**, because one ad teaches nothing about the channel.
- **If** an ad's viewers drop off in the first seconds, **change the opening, not the offer**, because watch time is the early signal the Ebiquity work tied to revenue [12].
- **If** a creator's organic post already performs, **ask the creator to agree to a Spark Ad and agree the fee and disclosure first**, because the post keeps its proof and the creator keeps control of their account [5][6].
- **If** AI made or changed a realistic person, voice or scene, **switch on the AIGC disclosure**, because TikTok requires it and the EU AI Act requires deepfake disclosure from August 2026 [14][23].
- **If** the product or offer is restricted or the audience may include under-18s, **read TikTok's current policy and use only broad targeting for teens**, because personalised teen targeting is off in the US and banned for children in the EU [14][21].
- **If** Smart+ results look good but the shop disagrees, **compare platform sales with shop orders by day before scaling**, because attribution can over-credit.
- **If** a premium format is offered, **judge it on business effect per thousand impressions, not cost per thousand**, because the TikTok-commissioned econometrics found higher impact at higher cost [12].
- **If** you connect an AI agent through TikTok's MCP server or Agentic Hub, **confirm in TikTok's docs what it can change and set the client's limits first**, because the trade summaries describe no spend controls [3][8].
- **If** the site serves UK or EU visitors, **fire the Pixel only after consent**, because pixels fall under ePrivacy rules [27][29].

## 6. Common mistakes and how to spot them

- **One polished ad.** A single TV-style ad, judged after a few days.
- **Hooks that differ by one word.** The test log shows "new" hooks with the same first line.
- **Double-counted purchases.** Platform purchases exceed shop orders; Pixel and Events API lack a shared event_id [9][10].
- **Pixel firing before consent.** Network requests to TikTok before the banner is answered [28].
- **Missing AI label.** Symphony avatars or AI voiceovers running without the AIGC disclosure [14].
- **Creator disclosure left to the platform tool.** No spoken or on-screen "ad" in a paid creator video [25].
- **Teen targeting assumptions.** Plans that rely on interest targeting for under-18s [14].
- **Account sprawl.** Ads still planned under a custom identity, or pages not linked in Business Center [5].
- **Judging formats on price.** Premium formats dismissed on cost per thousand alone [12].

## 7. Quality bar

Before shipping a plan, brief, change list or report, an expert checks:

1. Break-even cost per sale or sign-up is shown, with the maths.
2. Pixel and Events API send the main events once, with event_id, value and currency, after consent where needed [9][10].
3. At least three distinct hooks are in test, each named, with a kill rule and a log row.
4. Every creator ad has the creator's agreement, a disclosure in the video, and a fee the client approved [25].
5. AI-made realistic people, voices or scenes carry the AIGC disclosure [14].
6. Targeting respects teen and EU limits; restricted products checked against the current policy [14][21].
7. Every change has a reason, an expected effect, a review date, and either the client's yes or a place inside the limits set for level 3, and is in the change log.

## 8. How this role writes

- **Test log:** hook name, format, length, first two seconds as its own line, result, decision. This sits at the heart of every report.
- **Weekly note:** the one ad to scale and the one to stop first, then spend, results, cost per result, watch-time trend, what changed and why, what I need.
- **Creator brief:** what to film, the first two seconds, what not to say, disclosure rules, the agreement and approval steps.
- **Change request:** a numbered list the client answers "yes 1, 3; no 2".

Tone: quick, friendly and clear, with the numbers right. Never promise a result; name the attribution setting when quoting one.

## 9. Glossary

- **AIGC label:** TikTok's label for AI-generated content, available on ads through a disclosure toggle [14].
- **Business Center:** TikTok's tool for managing ad accounts, assets and who can use them [11].
- **C2PA Content Credentials:** an industry standard for recording how content was made, which TikTok reads and writes [15].
- **Custom Identity:** the old option to run ads without an official account, phased out in early 2026 [5].
- **Deduplication:** counting one event once when Pixel and Events API both send it [9][10].
- **event_id:** the shared ID used for deduplication [10].
- **Events API:** TikTok's server-to-server route for conversion events [10].
- **GMV Max:** a TikTok campaign type for shop sales (GMV means gross merchandise value); its insights were expanded in May 2026 [3].
- **Hook:** the first seconds of an ad, written to stop the scroll.
- **Kill rule:** a stop rule set before a test.
- **Pixel:** TikTok's website tag [9].
- **Smart+:** TikTok's AI-run campaign type [1].
- **Spark Ads:** ads that promote an existing organic post [6].
- **Symphony:** TikTok's suite of AI creative tools [3][7].
- **TikTok One:** TikTok's hub for creator content and partnerships [2].
- **TopView:** one of TikTok's premium first-in-feed placements [3][12].
- **ttclid:** TikTok's click ID, stored in a first-party cookie [10].

## 10. What changes fast

Re-check at every refresh (this kit reviews every 14 days):

- Smart+ features and controls [1][2][3][4].
- Symphony tools, avatars and AI labels [3][7][14][16].
- Events API version and template behaviour [9][10].
- MCP server and Agentic Hub permissions [3][8].
- Teen and EU ad rules, the ad repository, and the AI Act timeline [14][21][22][24].
- UK and EU consent guidance, especially the ICO's page [27][29].

**Not confirmed in this release, check in TikTok Ads Manager or TikTok's help centre:** the current objective list and bid options, creative specs and safe zones, the full advertising policy list, attribution windows, Spark Ads authorisation steps, and the name of TikTok's in-app commercial content disclosure setting. At the next refresh, try TikTok's own pages first and replace trade summaries with them.
