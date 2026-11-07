# TikTok ads media buyer: what the role knows

Checked 2026-11-07. Sources are numbered [n] and listed in sources.md with the date each was checked.

**How the TikTok facts were checked.** TikTok's help centre, business blog and API docs refuse automated page fetches. So each TikTok page cited here was confirmed through search results that show that exact page, which the kit's rules allow. The facts are TikTok's own words as of November 2026, but menus and limits change often, so check the screen in Ads Manager when it matters. A few newer product launches still rest on Social Media Today trade summaries, labelled as summaries. Rules come from EU, UK and US regulators.

For general paid-media method (auction thinking, lift tests, creative concepts and hooks), see the sibling kits `meta-media-buyer` and `ad-creative-strategist`. This file covers what is different about TikTok.

## 1. What this role is for

A business hires a TikTok ads media buyer to turn short vertical video into sales or sign-ups at a cost it can afford. The buyer plans the campaign, keeps the tracking honest, briefs creators, tests hooks one change at a time, moves budget to what sells, and keeps every ad inside TikTok's rules and the law on disclosure and AI labels.

Who hires it: shops selling to under-35s, apps, venues and events, brands with creators who already post about them, and brands selling through TikTok Shop.

What good work looks like:

- **Maths first.** The most the business can pay per sale or sign-up comes from price and margin, shown in the plan.
- **Creative is the main lever.** Several distinct hooks and formats in every test, each with a name, a kill rule and a log entry.
- **Clean signal.** Pixel and Events API send key events once, deduplicated, with consent where the law needs it [18][19].
- **Creators treated fairly.** Clear briefs, honest disclosure, their agreement before their post becomes an ad, and the client pays them.
- **Honest reporting.** Platform numbers are checked against the shop, the attribution window is named, and premium formats are judged on business effect, not price alone [9][20].

How the role is judged: cost per sale or sign-up against margin, how fast the account learns which hooks work, how stable results are, and trust. A good buyer acts only within the access level and limits the client set, logs every change, and says when the data cannot answer a question.

## 2. The canon

**Byron Sharp, *How Brands Grow* (2010).** Growth comes mostly from reaching more buyers, including light ones, and being easy to recall. On TikTok that argues for broad delivery and distinctive brand cues early in each video.

**Eugene Schwartz, *Breakthrough Advertising* (1966).** People sit at different levels of awareness, and each level needs a different opening. Hook tests work best when hooks are written for different awareness levels, not just reworded.

**Les Binet and Peter Field, *The Long and the Short of It* (IPA, 2013).** Short-term sales activity and long-term brand building do different jobs. On TikTok, judging every ad on next-day sales starves the reach that makes later sales cheaper.

**Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (2020).** Decide the main metric and stop rule before a test starts, and distrust lucky early winners. The Meta kit's canon covers this and the case for lift tests in more depth.

**TikTok and Ebiquity, UK econometrics (reported February 2026) [20].** An econometric study of UK brands for TikTok, isolating TikTok's contribution to sales. Its practical advice: keep ads under 25 seconds, show the brand in the first 2 seconds, and match format to objective rather than to the lowest price. It was commissioned by TikTok, so treat its numbers as a reason to test.

## 3. How the work is done now

### 3.1 Objectives, Smart+ and manual campaigns (as of November 2026)

**Objectives.** TikTok groups them in three stages [6]:

- **Awareness:** Reach, to show the ad to as many people as possible.
- **Consideration:** Traffic (visits to a website or app), Video views, and Community interaction (followers, profile visits and LIVE promotion).
- **Conversion:** App promotion, Lead generation, and Sales, which sells from TikTok Shop, a website or an app.

Pick the objective for the action the business is paid for. Under-18 audiences change what is available (section 3.8).

**Smart+** is TikTok's AI-run campaign type. A trade summary of TikTok's 23-page guide (January 2026) says Smart+ predicts who is likely to respond, so ads reach relevant people without manual audience settings, and that the guide also covers manual campaigns and multiple asset groups [1]. Changes since then, all from trade summaries:

- **January 2026:** Auto-select recommends creatives from the brand's existing ads and from eligible creator content in TikTok One. Ad previews show every creative combination before launch. Smart+ gained duplication, draft mode, automated rules and bulk editing [2].
- **May 2026 (TikTok World):** more manual control options, and Music Autofix, which flags music that cannot be used [3].
- **October 2026 (Advertising Week):** Smart+ extended to automate search ads across keywords and creative, and Smart+ Creative Selection groups image, video, AI-made and creator assets [4].

**Manual campaigns** remain for when you need to control a choice yourself [1].

How to choose: Smart+ suits accounts with working tracking, enough conversions for the system to learn from, and a steady supply of creative. Manual set-ups suit a clean test of one question, a narrow constraint the client insists on, or an account whose tracking is not yet trusted. Draft mode in Smart+ [2] is useful at access level 2.

### 3.2 Identity, Spark Ads, Business Center and creators (as of November 2026)

- **No more custom identity.** TikTok's January 2026 blog says Custom Identity, which let ads run without an official account, is phased out in early 2026, and new campaigns launch from a verified TikTok profile linked in Business Center [10]. TikTok's backend tests found 59.3% of advertisers saw cost per acquisition fall by at least 10% after linking accounts; that is TikTok's own claim [10].
- **Spark Ads** promote existing organic posts as ads: the brand's own posts, or a creator's post with the creator's agreement [11].
- **Spark authorisation steps** [11]. The creator opens the post, taps the three dots, opens Ad settings, turns on ad authorisation, picks how long it lasts (7, 30, 60 or 365 days) and generates a code to send. The buyer goes to Tools, then Creative library, then Spark ads posts, clicks Apply for Authorization, pastes the code and searches. Up to 20 codes can be added at once. Duets and Stitches need codes from both creators. The time can be extended only before the code expires. Never ask a creator for their login.
- **Business Center roles** [12]. Every member is an Admin (full access) or Standard (only the assets assigned to them), and only Admins assign access. On an ad account, Admin manages finance, settings and permissions; Operator manages finance and creates and edits campaigns; Analyst views ads and results. Business Center is also where the client links TikTok accounts for Spark Ads [10][12].
- **Creator sourcing.** TikTok One holds creator content that Smart+ can draw on [2]. Symphony Agent (June 2026) can write creator briefs and invite creators to pitch [5].
- **Disclosure.** When a creator is paid or given product, the relationship must be clear. The US FTC says to disclose in the video itself, spoken and on screen, in plain words such as "ad" or "sponsored", and not to rely on a platform tool alone [26]. The UK ASA updated its influencer guide on 23 October 2026, with the CMA [27]. TikTok's own disclosure settings must be used as well; check their current names in the app.
- **Money.** Paying creators is the client's decision and the client's payment. The buyer prepares fee proposals and contracts for approval.

### 3.3 Creative, specs and Symphony (as of November 2026)

**Auction in-feed specs** [7]:

- **Shape:** vertical 9:16 recommended, at least 540 x 960 pixels; 16:9 and 1:1 also accepted.
- **File:** MP4 or MOV, up to 500 MB, bitrate at least 516 kbps, and the video must have sound.
- **Length:** up to 10 minutes for non-Spark ads; Spark Ads keep the length of the post.
- **Text:** the ad caption shows up to 4 lines before "See more", with about 100 characters suggested for most languages; links in it are not clickable. The display name is one line, up to 20 characters in most languages.
- **Safe zone:** it shrinks as the caption grows and changes with shape and add-ons, so lay out text with TikTok's own safe-zone files.

Reserved formats such as TopView have their own spec pages; read the one for the format you buy.

TikTok's Symphony suite generates and adapts creative. As reported in May 2026: video and image generation on Dreamina Seedance 2.0, Voiceover Avatars that use licensed actors' likenesses in over 30 languages, Product Avatars that present a product, and translation [3]. Symphony Agent (June 2026) builds video ads from trending examples or from campaign details, with results that vary by prompt and capacity [5].

What the evidence says about creative [20]:

- Keep ads under 25 seconds and show the brand in the first 2 seconds.
- Average play duration tracked with revenue per thousand impressions in the Ebiquity work, so how long people keep watching is a useful early signal.

### 3.4 Labels for AI-generated content (as of November 2026)

- **Ads.** TikTok lists AI-generated, synthetic or manipulated media as a mandatory ad disclaimer: images, video or audio made wholly by AI, or real footage heavily changed by AI. The advertiser ticks "This ad contains AI-generated content" in Ads Manager, and the choice stays unless the video or image is changed [16]. TikTok added the disclosure tool in 2024 [14].
- **TikTok Shop LIVE.** AI-generated voices, pre-recorded clips and screen recordings are not allowed in shopping LIVEs [17].
- **EU AI Act.** From 2 August 2026, Article 50 requires deployers to disclose deepfake images, audio or video, and providers to mark synthetic content in a machine-readable way, with providers of systems already on the market given until 2 December 2026 for the marking duty [24][25].

Practice: tick the AI disclosure for any ad where AI made or changed a realistic person, voice or scene, including Symphony avatars, and keep the file's Content Credentials intact.

### 3.5 Pixel and Events API (as of November 2026)

TikTok's own Google Tag Manager templates show how its tracking works [18][19]:

- **Browser:** the TikTok Pixel needs its base code on the site. The web template maps standard GA4 events to TikTok events: purchase to CompletePayment, sign_up to CompleteRegistration, begin_checkout to InitiateCheckout, view_item to ViewContent, add_to_cart to AddToCart [18].
- **Server:** the Events API template sends events server to server to TikTok's v1.3 endpoint, signed with an access token. It runs only in a server-side container [19].
- **Deduplication:** both templates carry an event_id so the same event sent by Pixel and Events API is counted once. Use the same ID (for example the order number) on both [18][19].
- **Matching:** email and phone are lowercased, trimmed and hashed with SHA-256 before sending; an external ID is hashed too. The server template stores TikTok's click ID (ttclid) from the landing URL in a first-party cookie for 30 days and reads the _ttp browser cookie [19]. The Pixel hashes plain email and phone itself when advanced matching is on [18].
- **Testing:** a test event code sends events to the test view instead of live data [19].
- **Consent:** neither template contains consent logic [18]. Consent has to come from the site's consent tool and tag manager settings.

Shop plug-ins can install the Pixel for you; check what each one sends.

### 3.6 Measurement (as of November 2026)

- **Attribution windows.** Click-through windows of 1, 7, 14 or 28 days, and view-through of 1 or 7 days or off. The default for web campaigns using the Pixel or Events API is 7-day click and 1-day view [9]. Name the window on every export and report, and never compare two accounts on different windows.
- **Premium formats.** The TikTok and Ebiquity econometrics found premium formats (TopView and Pulse) produced 3 to 4 times the revenue per thousand impressions of Brand Auction, and TopFeed about twice the impact at about twice the cost [20]. Judge formats on business effect per impression, not on cost per impression alone. This is a TikTok-commissioned UK study.
- **Ground truth.** Check platform-reported sales against shop orders for the same dates. When spend is large enough, use a holdout or lift test (method in the Meta kit).

### 3.7 Access and AI agents (as of November 2026)

Map access levels to Business Center roles [12]: level 1 is Analyst; levels 2 and 3 need Operator, because Analyst cannot build anything. Ads Manager has no draft-only role, so level 2 is held by the agreement and the action log. Operator can also manage finance, so the buyer agrees in writing not to touch billing. The client stays Admin.

**TikTok for Business MCP Server** (also called TikTok Ads MCP) is TikTok's official server for AI agents [13]:

- About 400 tools for campaigns, reporting, catalogues, creative, audiences and Business Center admin. A second address starts with about 40 core tools and finds the rest when needed.
- The client authorises it with their TikTok for Business account after reviewing the permissions asked for. No developer account is needed. The link lasts 30 days, then must be authorised again.
- It is listed as a connector in Claude and other AI apps. TikTok says the Claude directory version leaves out some tools, such as finance management.
- TikTok's Agentic Hub offers ready-made AI Skills that work with the server.

The docs describe no agent spend cap, so the client's budgets in Ads Manager and the level 3 limits are the only brakes. Set them before connecting at level 2 or 3.

### 3.8 Policy, teens and regulation (as of November 2026)

- **Ad policy list.** TikTok sorts industries as Prohibited, Restricted or Allowed. Some are banned in every market, such as animals and animal products, adult products and services, gambling, tobacco, drugs, weapons, counterfeit goods and political ads. Restricted industries run in some markets only on conditions: 18+ age targeting, certificates, or required information. Each country adds its own list [8]. Before planning anything in health, weight, finance, alcohol, dating or gambling, read the handbook for each market and involve the client's adviser where needed.
- **Teens (US).** From 30 June 2024, TikTok stopped personalised targeting of US users aged 13 to 17; advertisers can reach them only through broad options such as location, language and device [14]. The year comes from the post's date.
- **Teens (other regions).** When an audience includes under-18s in listed regions, including North America, the EEA and the UK, TikTok removes detailed options such as gender, interests, household income and zip code. Age, language, location and device remain [15].
- **EU.** The Digital Services Act bans targeted ads to children and ad targeting on sensitive data, and requires ads to show who placed them and why [22]. In December 2025 the European Commission accepted TikTok's commitments to show full ad content and links in its ad repository, update it within 24 hours, and share targeting criteria [23].
- **US ownership.** Since January 2026 the US app is run by TikTok USDS Joint Venture LLC. The algorithm is retrained on US data, and the updated US privacy policy allows on-platform data to be used for off-platform ads [21].

### 3.9 Cookie consent for the Pixel: UK and EU (as of November 2026)

- **EU.** The European Data Protection Board says tracking pixels, tracking links and identifiers hashed on the device and collected by site code fall under Article 5(3) of the ePrivacy Directive (guidelines adopted 7 October 2024) [28]. Its cookie banner taskforce (17 January 2023) said no consent-requiring tag may fire before a positive action, banners need a reject option, pre-ticked boxes are invalid, and legitimate interest cannot justify placing the tag [29].
- **UK.** The Data (Use and Access) Act 2025 keeps the PECR ban on device storage and access unless an exception applies; the new exception in the government factsheet covers statistics on how a service is used, and none is named for advertising [30]. The UK regulator's guidance is the final word. Since 30 September 2026 that regulator is the Information Commission, which took over the ICO's functions and still uses the ICO name ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator)). Its [storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) (final 29 April 2026, confirmed from search results) says the statistics exception does not cover online advertising.

In practice: fire the Pixel only after consent where needed, make sure the Events API respects the same choice, and treat this as practice, not legal advice.

## 4. Benchmarks and numbers

No independent all-industry TikTok cost or click averages could be verified this release. Use the account's own history.

TikTok-reported or TikTok-commissioned figures, to frame a test, never as a target:

- 59.3% of advertisers saw cost per acquisition fall at least 10% after linking accounts [10].
- Premium formats 3 to 4 times the revenue per thousand impressions of Brand Auction (UK econometrics) [20].

Platform numbers worth remembering: default attribution 7-day click and 1-day view [9]; in-feed files up to 500 MB and 10 minutes [7]; Spark codes last 7 to 365 days [11]; MCP authorisation lasts 30 days [13]; ttclid cookie kept 30 days by TikTok's server template [19]; ads under 25 seconds and brand in the first 2 seconds (Ebiquity advice) [20].

## 5. Decision rules

- **If** tracking is missing or double counting, **fix the Pixel and Events API with a shared event_id before spending more**, because the system optimises on what you send [18][19].
- **If** the client wants to judge TikTok on one ad, **test at least three distinct hooks**, because one ad teaches nothing about the channel.
- **If** an ad's viewers drop off in the first seconds, **change the opening, not the offer**, because watch time is the early signal the Ebiquity work tied to revenue [20].
- **If** a creator's organic post already performs, **ask the creator for a Spark code and agree the fee and disclosure first**, because the post keeps its proof and the creator keeps control of their account [11].
- **If** AI made or changed a realistic person, voice or scene, **tick the AI disclosure**, because TikTok requires it and the EU AI Act requires deepfake disclosure from August 2026 [16][24].
- **If** the product or offer is restricted or the audience may include under-18s, **read the market's ad policy handbook and use only broad targeting for teens**, because TikTok removes detailed targeting when under-18s are in the audience and the EU bans targeted ads to children [8][15][22].
- **If** two reports disagree, **check both use the same attribution window first**, because a 28-day click window credits more sales than a 1-day one [9].
- **If** Smart+ results look good but the shop disagrees, **compare platform sales with shop orders by day before scaling**, because attribution can over-credit.
- **If** a premium format is offered, **judge it on business effect per thousand impressions, not cost per thousand**, because the TikTok-commissioned econometrics found higher impact at higher cost [20].
- **If** you connect an AI agent through TikTok's MCP server, **set budgets and level 3 limits first and diarise the 30-day reauthorisation**, because the docs describe no agent spend cap [13].
- **If** the site serves UK or EU visitors, **fire the Pixel only after consent**, because pixels fall under ePrivacy rules [28][30].

## 6. Common mistakes and how to spot them

- **One polished ad.** A single TV-style ad, judged after a few days.
- **Hooks that differ by one word.** The test log shows "new" hooks with the same first line.
- **Double-counted purchases.** Platform purchases exceed shop orders; Pixel and Events API lack a shared event_id [18][19].
- **Pixel firing before consent.** Network requests to TikTok before the banner is answered [29].
- **Missing AI label.** Symphony avatars or AI voiceovers running without the AI disclosure [16].
- **Creator disclosure left to the platform tool.** No spoken or on-screen "ad" in a paid creator video [26].
- **Teen targeting assumptions.** Plans that rely on interest targeting for under-18s [14][15].
- **Expired Spark codes.** Ads stop when a creator's code runs out; the expiry date is not in the plan [11].
- **Too much access.** An agent or freelancer given Admin when Analyst or Operator would do [12].
- **Account sprawl.** Ads still planned under a custom identity, or accounts not linked in Business Center [10].
- **Judging formats on price.** Premium formats dismissed on cost per thousand alone [20].

## 7. Quality bar

Before shipping a plan, brief, change list or report, an expert checks:

1. Break-even cost per sale or sign-up is shown, with the maths.
2. Pixel and Events API send the main events once, with event_id, value and currency, after consent where needed [18][19].
3. At least three distinct hooks are in test, each named, with a kill rule and a log row, and each file meets the current spec [7].
4. Every creator ad has the creator's code, its expiry date, a disclosure in the video, and a fee the client approved [11][26].
5. AI-made realistic people, voices or scenes carry the AI disclosure [16].
6. Targeting respects teen and EU limits; restricted products checked against the market's handbook [8][15][22].
7. Every result names its attribution window [9].
8. Every change has a reason, an expected effect, a review date, and either the client's yes or a place inside the limits set for level 3, and is in the change log.

## 8. How this role writes

- **Test log:** hook name, format, length, first two seconds as its own line, result, decision. This sits at the heart of every report.
- **Weekly note:** the one ad to scale and the one to stop first, then spend, results, cost per result, watch-time trend, what changed and why, what I need.
- **Creator brief:** what to film, the first two seconds, what not to say, disclosure rules, the Spark code steps and how long the code must last.
- **Change request:** a numbered list the client answers "yes 1, 3; no 2".

Tone: quick, friendly and clear, with the numbers right. Never promise a result; name the attribution window when quoting one.

## 9. Glossary

- **AIGC disclosure:** the Ads Manager setting that marks an ad as containing AI-generated content [16].
- **Attribution window:** how many days after a click or view a sale is credited to the ad [9].
- **Business Center:** TikTok's tool for managing ad accounts, assets and who can use them [12].
- **Custom Identity:** the old option to run ads without an official account, phased out in early 2026 [10].
- **Deduplication:** counting one event once when Pixel and Events API both send it [18][19].
- **event_id:** the shared ID used for deduplication [19].
- **Events API:** TikTok's server-to-server route for conversion events [19].
- **GMV Max:** a TikTok campaign type for shop sales (GMV means gross merchandise value); its insights were expanded in May 2026 [3].
- **Hook:** the first seconds of an ad, written to stop the scroll.
- **Kill rule:** a stop rule set before a test.
- **MCP server:** a standard way for AI apps to use a tool; TikTok's lets agents work in Ads Manager [13].
- **Operator and Analyst:** Business Center ad account roles; Operator builds and edits, Analyst only views [12].
- **Pixel:** TikTok's website tag [18].
- **Smart+:** TikTok's AI-run campaign type [1].
- **Spark Ads:** ads that promote an existing organic post [11].
- **Spark code:** the code a creator generates to let a brand run their post as an ad [11].
- **Symphony:** TikTok's suite of AI creative tools [3][5].
- **TikTok One:** TikTok's hub for creator content and partnerships [2].
- **TopView:** one of TikTok's premium first-in-feed placements [3][20].
- **ttclid:** TikTok's click ID, stored in a first-party cookie [19].

## 10. What changes fast

Re-check at every refresh (this kit reviews every 14 days):

- Objectives, Smart+ features and controls [1][2][3][4][6].
- Specs, safe zones and attribution options [7][9].
- Symphony tools and AI disclosure rules [3][5][16][17].
- Events API version and template behaviour [18][19].
- The MCP server's tools, permissions and 30-day authorisation [13].
- Teen, policy and EU ad rules, the ad repository, and the AI Act timeline [8][14][15][22][23][25].
- UK and EU consent guidance, especially the Information Commission's cookie page [28][30].

Least sure: the US teen rule's year is inferred from the post's date [14]; the attribution default was read from search results of TikTok's pages [9]; the agent-related trade summaries [3][4] describe launches TikTok's own pages have not fully matched.
