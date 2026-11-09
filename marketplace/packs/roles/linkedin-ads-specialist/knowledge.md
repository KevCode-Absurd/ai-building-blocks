# LinkedIn ads specialist: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. LinkedIn help pages show only relative dates ("last updated 3 months ago"), so each platform fact below says when it was seen. Re-check the items in section 10 before relying on them. For general paid-media method (auction thinking, test design, creative concepts), see the sibling kits `meta-media-buyer`, `google-ads-media-buyer` and `ad-creative-strategist`; this file covers what is different about LinkedIn and B2B.

## 1. What this role is for

A business hires a LinkedIn ads specialist when it sells to other businesses and needs the right people at the right companies to notice it, trust it and talk to sales. LinkedIn is the one ad platform where you can aim by job title, job function, seniority, company name, company size and industry from profile data [4]. That precision costs more per click than most consumer platforms, so the job is to spend it only where a deal can come from.

Who hires it: B2B software and services firms, agencies and consultancies, recruiters with an employer brand to build, training providers, and any business with a deal value high enough to pay for reaching a narrow audience.

What good work looks like:

- **Maths first.** Budget and target cost per lead come from deal size, close rate and sales cycle, not from a platform average.
- **The buying group, not one person.** Several people sign off a B2B purchase. Targeting and creative reach the decision maker, the user and the person who blocks.
- **Lead quality over lead count.** Lead Gen Forms filter as well as collect, sales follows up fast, and qualified leads flow back to LinkedIn so the system learns which leads matter [10].
- **Clean signal.** The Insight Tag and the Conversions API send the right events once, with consent where the law needs it [14][15][17].
- **Patience with long cycles.** Reports use windows and CRM links that match a sales cycle measured in months [18][20].

How the role is judged: by pipeline and revenue the CRM can trace back, cost per qualified lead against what a customer is worth, how much spend reaches the intended job titles and companies, and trust. A good specialist works inside the access level and limits the client set, logs every change, and says plainly when the data cannot answer a question.

## 2. The canon

**LinkedIn B2B Institute, *The 95-5 Rule* [25].** Most potential B2B buyers are not in the market at any one time; the B2B Institute's figure is about 95%. Companies replace things like computers and banking services every few years, so lead generation only reaches the small share buying now. The lesson for this role: run some spend that builds memory with the 95%, and do not judge it on this month's leads. The page also reports that 96% of surveyed B2B marketers expected their campaign's main effect within two weeks, which it calls a myth.

**Les Binet and Peter Field, *5 Principles of Growth in B2B Marketing* (B2B Institute) [26].** From IPA Databank B2B cases (1998 to 2018): invest in share of voice above share of market, balance brand building with sales activation, grow the customer base rather than only retain, build mental availability, and use emotion for long-term effect. The page shows a roughly even brand-to-activation split as its B2B guide. Treat it as a starting point for a conversation, not a rule.

**Byron Sharp, *How Brands Grow* (2010), and the Ehrenberg-Bass Institute's *How B2B Brands Grow* (with the B2B Institute).** Growth comes mainly from reaching more category buyers and being easy to recall when a need arises. For LinkedIn this argues against shrinking audiences to a few hundred "perfect" people for every campaign.

**Brent Adamson, Matthew Dixon, Pat Spenner and Nick Toman, *The Challenger Customer* (2015).** B2B purchases are decided by groups whose members want different things. Plan one message per role in the buying group.

**Experiments.** For test design and the case for lift tests over attribution reports, the Meta kit's canon applies here too (Gordon and colleagues, 2019; Kohavi, Tang and Xu, 2020). LinkedIn's own A/B testing limits are noted where they apply [7].

## 3. How the work is done now

### 3.1 Structure and objectives (as of November 2026)

Campaign Manager holds campaigns, which group ad sets, which hold ads. Ad sets in one campaign share an objective type, bid strategy, optimisation goal and budget type, and the objective and ad format cannot be changed after launch [2]. Plan structure before building, because fixing a wrong objective means building again.

LinkedIn groups its objectives in three tiers [1]:

| Tier | Objective | Optimises for |
|---|---|---|
| Awareness | Brand awareness | Reach |
| Consideration | Website visits; Engagement; Video views | Landing page clicks; engagement clicks; video views |
| Conversions | Lead generation; Website conversions; Job applicants; Talent leads | Qualified leads (or leads); website conversions; landing page clicks; talent leads |

Talent leads needs an active LinkedIn Recruiter contract [1]. Lead generation uses the leads goal by default when no Conversions API integration exists [1][9]. Flexible ads let one ad set mix formats, and the LinkedIn Audience Network is a placement choice that sends ads outside LinkedIn [2].

### 3.2 Targeting (as of November 2026)

Targeting attributes include location, profile language, company (name, industry, size, revenue, growth, followers), demographics, education, job experience (title, function, seniority, skills, years of experience), interests and traits, plus predictive audiences and Matched Audiences (uploaded lists and retargeting) [4]. Several attributes inside one facet widen an audience; adding a second facet with "narrow audience further" shrinks it [5].

Size rules:

- An ad set needs at least 300 member accounts to run [4]. LinkedIn suggests at least 50,000 to drive results, and at least 300,000 for Sponsored Content and Sponsored Messaging [5].
- LinkedIn's advice is to start broad and narrow using professional demographic reporting [5].
- In the EEA and Switzerland, Matched Audiences match only members who opted in, so lists there come out smaller [5].
- Lookalike audiences were discontinued on 29 February 2024; existing ones are static [5].

Newer AI audience options:

- **Predictive audiences** model people likely to act like a source: Lead Gen Form leads, a contact or company list of 300 to 300,000 rows, conversions, or a retargeting audience of over 300 members. They refresh daily, can take up to five days to reach full size, switch Audience Expansion off, and can be capped at 200 per ad account [6]. If you do not want the source people reached again, exclude the source list [6].
- **Buyer groups** (page updated early November 2026) build an audience of the people who decide purchases together, across 56 product categories. Predictive audiences are disabled when buyer groups are on, and A/B testing is not available; LinkedIn suggests comparing with one or two similar past ad sets [7].

Rules that limit targeting:

- Ads about employment, housing, education or credit require a certification of no discrimination before gender targeting is available, and age targeting needs a similar certification. Job and talent-lead ads cannot use age targeting at all, and no age range may include under-18s [8].
- Groups can be included but never excluded, and are not available in the EU, EEA and Switzerland [8].
- No ad may target on sensitive data such as political views, ethnicity, health, religion, sexual orientation, trade union membership or income [23][24].

### 3.3 Formats (as of November 2026)

Lead generation ad sets can use single image, carousel, video, event, document, message and conversation ads; ad sets optimising for qualified leads are limited to single image, carousel, video, event and document [9]. Document ads let people page through a PDF-style document in the feed and can ask for a Lead Gen Form after a set number of preview pages; a one-page document cannot be gated [13]. Thought Leader Ads promote a person's post rather than a Page post. A trade summary reports that LinkedIn opened them to posts from any member in March 2025 and to event posts in August 2025 [27]. The member's agreement to promote their post is theirs to give.

### 3.4 Bidding and budgets (as of November 2026)

LinkedIn offers three strategies [3]:

- **Maximum delivery:** automated, available for all objectives, charged by impressions, with no cost or bid cap. Results move around during the learning phase after launch.
- **Cost cap:** you set a cost per key result that Campaign Manager uses as a guide; available for awareness, website visits, engagement, video views and lead generation. Spend depends on how tight the cap is.
- **Manual bidding:** you set the bid; charged by click, impression, view or send depending on the objective and format.

Lead Gen Form ads are bought by click or by impression; LinkedIn does not sell cost per lead [11].

### 3.5 Lead Gen Forms (as of November 2026)

Forms open pre-filled from the member's profile [9]. LinkedIn recommends three to four fields; the maximum is 12, including up to three custom questions of 100 characters, plus up to 20 hidden fields for campaign tracking [11][12]. Other limits: headline 60 characters, details 160, confirmation message 300, privacy text 2,000, and up to five disclosure checkboxes of 500 characters [12].

Rules from LinkedIn's Ads Agreement [24]: every form links to the advertiser's privacy policy; forms may not ask for sensitive data; opt-out and deletion requests are honoured promptly; form data stays available through LinkedIn for one year, so the advertiser keeps its own copy; and form data may not be sold. LinkedIn does not deliver promised content for you. Put an ungated link in the thank-you message or send it yourself, and say in that message how and when you will be in touch [11].

### 3.6 Qualified leads and the CRM loop (as of November 2026)

The qualified leads goal optimises for leads your team has qualified, not raw form fills. It needs qualified-lead conversions from one source: the Conversions API or CRM Sync in Business Manager. Using both can double-count. LinkedIn recommends five or more qualified leads within two weeks, asks for qualified-lead data within 30 days of the lead, and runs a two-week learning phase. Cost per qualified lead may fall while cost per lead rises, which is the point [10].

### 3.7 Insight Tag and Conversions API (as of November 2026)

**Insight Tag.** A JavaScript tag for conversions, retargeting and audience insights. It collects page URL, referrer, IP address (truncated or hashed), user agent and a timestamp. LinkedIn says it removes direct identifiers within seven days and deletes pseudonymised data within 180 days, and that the tag should not sit on pages that collect sensitive health or financial data [14]. LinkedIn also receives data from Microsoft's UET tag, excluding the EEA and Switzerland, and advertisers can disconnect it [14].

**Conversions API.** Sends online and offline conversions (for example phone sales or event leads) server to server. Set it up through a partner such as Google Tag Manager, HubSpot, Salesforce Data 360, Segment or Zapier, or as a direct build. LinkedIn's help page estimates two to four weeks for a direct build [15]; its developer FAQ says one to two weeks [16]. Emails are hashed with SHA-256, and LinkedIn deletes the event data after 180 days [15].

Match and freshness [16]:

- Send events in real time or at least within a day; reports can take up to 72 hours.
- Lowercase emails before hashing. Send hashed email plus LinkedIn's click ID (li_fat_id) for the best match. Enhanced conversion tracking adds that click ID to landing page URLs and stores it in a first-party cookie, and LinkedIn keeps the click ID mapping for 365 days.
- Other accepted identifiers include hashed or plain IP address, first and last name with company and title, and a Lead Gen Form response ID.

**Deduplication** [17]. LinkedIn recommends sending key events from both the tag and the server. Create one conversion rule per source and pass the same eventId from the browser to the server. When both arrive, LinkedIn discards the server copy and counts the tag one, so the Insight Tag line in the breakdown should show the higher count when it works. The advertiser must have permission to share customer data [15].

### 3.8 Measuring B2B results (as of November 2026)

- **Windows.** Click and view windows of 1, 7, 30 or 90 days; the default and LinkedIn's recommendation is 90-day click and 90-day view. Lead, qualified lead, purchase and similar types sent by Conversions API or CSV can use 180 or 365 days [18].
- **Model.** Last touch, credited to every ad set the person interacted with or only the last one. Some conversions are modelled for privacy [19].
- **Revenue.** The Revenue Attribution Report links Salesforce, Dynamics 365 or HubSpot to ad activity, with impression- or engagement-based models at member or company level, and reports pipeline, revenue won, win rate and days to close [20]. The Measurement Insights page shows conversion paths, a companies funnel from impressions to closed won, and cost per result benchmarks against peers over 90 days; revenue metrics need CRM Sync [21].

The habit that follows: report ad results with the window and model named, and judge LinkedIn on qualified pipeline over the sales cycle, checked against the CRM, not on last week's form fills.

### 3.9 Cookie consent for ad tags: UK and EU (as of November 2026)

LinkedIn's terms put the duty on the advertiser: give prominent notice and get valid consent where the law requires it before the Insight Tag runs, and never pass sensitive data through it [24]. The ad policy says cross-site tracking cookies need full disclosure and consent [23].

- **EU.** The European Data Protection Board's guidelines (adopted 7 October 2024) say tracking pixels, tracking links and JavaScript that tells a browser to send identifiers fall under Article 5(3) of the ePrivacy Directive. Identifiers such as emails hashed on the device and collected by site code are covered too [28]. Being covered does not always mean consent is needed, since exemptions exist, but ad measurement and retargeting are not strictly necessary for the service the visitor asked for. The EDPB cookie banner taskforce (17 January 2023) added that no consent-requiring tag may fire before a positive action, a banner with an accept button needs a reject option, pre-ticked boxes are invalid, and legitimate interest cannot justify placing the tag [29].
- **UK.** The Data (Use and Access) Act 2025 keeps the PECR ban on storing or accessing information on a device unless an exception applies. The new exception named in the government factsheet covers statistics on how a service is used, to improve it; the factsheet names no advertising exception [30]. The Information Commission's [storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) (final 29 April 2026, confirmed from search results on 7 Nov 2026) says its statistics exception does not cover online advertising. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US.** This kit gives no state-by-state view. Where a client serves US states with privacy laws, ask the client's adviser.

In practice: load the Insight Tag through a consent tool so it fires only after consent where needed, check that the server-side route respects the same choice, and do not install the tag on sensitive pages [14]. These are practice points, not legal advice.

### 3.10 Policies and review (as of November 2026)

LinkedIn usually reviews ads within 24 hours (policy last revised 18 November 2025) [23]. Political ads are prohibited. Alcohol, dating, financial services, crypto, and medicines and treatments are restricted; UK financial ads must come from FCA-authorised advertisers. Claims need factual support. The display URL domain must match the destination domain. Copy may not mention LinkedIn beyond "find me on LinkedIn" [23].

### 3.11 Account access (as of November 2026)

Ad account roles are billing admin, account manager, campaign manager, creative manager and viewer. A viewer sees performance only; a creative manager edits ads; a campaign manager creates and edits campaigns and ad sets; an account manager also manages users; only the billing admin changes billing [22]. Creating ads and downloading leads also need LinkedIn Page permissions [22].

## 4. Benchmarks and numbers

LinkedIn publishes no all-industry cost or click-through averages that this kit could verify, and the in-product benchmarks on the Measurement Insights page compare against peers for your own account [21]. Use your own history and your CRM as the benchmark.

Platform numbers worth remembering:

- 300 members minimum per ad set; at least 50,000 suggested; at least 300,000 for Sponsored Content and Messaging [4][5].
- Lead Gen Forms: three to four fields recommended, 12 maximum, three custom questions, 20 hidden fields [11][12].
- Qualified leads: five or more qualified leads within two weeks, data within 30 days, two-week learning [10].
- Conversion windows: 90-day click and 90-day view by default; 180 or 365 days for some types [18].
- Reporting lag: up to 72 hours for Conversions API events [16]; up to 48 hours on Measurement Insights [21].
- Ad review: usually within 24 hours [23].

Research figures: the B2B Institute's 95% out-of-market estimate [25]. It is an estimate for planning, not a forecast for one account.

## 5. Decision rules

- **If** you do not know deal size, close rate and sales cycle, **ask before setting any budget**, because the most you can pay for a lead comes from those three numbers.
- **If** the audience is under 50,000, **use fewer ad sets and fewer formats, not more**, because LinkedIn suggests that size to drive results and each split shrinks delivery [5].
- **If** a client wants an audience of a few hundred named accounts, **use a company list with a broad job function filter and run it as a long, steady campaign**, because the 300-member floor and opt-in limits in Europe make tiny lists fragile [4][5].
- **If** leads are cheap but sales calls them junk, **move to the qualified leads goal, fed by the CRM or Conversions API**, because the system can only learn what a good lead looks like if you tell it [10].
- **If** both CRM Sync and the Conversions API send qualified leads, **pick one source for optimisation**, because LinkedIn warns two sources duplicate conversions [10].
- **If** sending events from both the tag and the server, **pass the same eventId and check the breakdown**, because without it every conversion counts twice [17].
- **If** a sale closes months after the click, **use a 180 or 365-day window for lead and qualified-lead conversions sent by API, and read revenue in the CRM**, because a 30-day view hides most of LinkedIn's effect [18][20].
- **If** the ad promotes jobs, housing, credit or education, **complete the discrimination certification and drop age targeting where it is barred**, because LinkedIn rejects or limits these ads otherwise [8].
- **If** the client serves EU or UK visitors, **fire the Insight Tag only after consent through the site's consent tool**, because pixels fall under ePrivacy rules and LinkedIn's terms make consent the advertiser's job [24][28][30].
- **If** the offer is content (a guide or report), **gate it with a Lead Gen Form only when sales can act on the lead**, and otherwise use a document ad with an ungated link, because a form costs volume [11][13].
- **If** brand reach is the goal, **judge it on reach in the target companies and later pipeline from those companies, not on clicks**, because most buyers are out of market today [25].

## 6. Common mistakes and how to spot them

- **Interns and job seekers in the audience.** Demographics reporting shows spend going to junior seniority or student titles. Add seniority filters and exclusions.
- **Audience Expansion or the Audience Network left on by accident.** Demographic reports show off-target titles, or placement reports show spend outside LinkedIn [2].
- **Too many ad sets for a narrow audience.** Many ad sets with tiny reach and uneven delivery [5].
- **Raw form fills as the goal.** Cost per lead looks good while the CRM shows few qualified leads [10].
- **Double-counted conversions.** Tag and server events without a shared eventId; conversion breakdown shows two similar lines with equal counts [17].
- **Windows that don't match the cycle.** A 7-day window on a six-month sale [18].
- **No follow-up promise.** Thank-you message says nothing about when sales will call, and nobody calls within a day [11].
- **Tag fires before consent.** The browser's network tab shows LinkedIn requests before the banner is answered [29].
- **Gender or age targeting on a job ad.** Rejected ads or a missing certification [8].
- **Over-long forms.** Form opens are high but submissions low [11].

## 7. Quality bar

Before shipping a plan, change list or report, an expert checks:

1. The target cost per lead and per qualified lead come from deal size, close rate and margin, with the maths shown.
2. Every ad set clears 300 members and the plan explains any audience under 50,000 [4][5].
3. Targeting names job functions, seniority, company size and industry, with exclusions, and avoids sensitive categories [23].
4. The Lead Gen Form has the fewest fields that let sales qualify, a privacy link, honest disclosure checkboxes, and a thank-you message that says what happens next [11][12][24].
5. Insight Tag fires after consent where needed, Conversions API is deduplicated, and qualified leads come back from one source [10][17][28].
6. The report names the conversion window and attribution setting and is checked against the CRM [18][19].
7. Every change has a reason, an expected effect, a review date, and either the client's yes or a place inside the limits set for level 3, and is in the change log.

## 8. How this role writes

- **Plan:** deal maths, buying group, audience table (function, seniority, company size, industry, exclusions, estimated size), formats, budget split, bid strategy, measurement, launch checklist.
- **Weekly note:** spend, leads, qualified leads, cost per qualified lead, top and bottom job titles and companies, what changed and why, three proposals, what I need.
- **Review:** waste found by job title, company and ad, ranked by money at stake, each with the fix and the expected effect.
- **Change request:** a numbered list the client can answer "yes 1, 3; no 2".

Tone: composed, precise, businesslike. Every cut comes with a number. Never promise a lead cost.

## 9. Glossary

- **Ad set:** the level that holds audience, bid, budget and schedule; ad sets sit inside campaigns [2].
- **Audience Expansion:** a setting that shows ads to people similar to your targeting; off when predictive audiences are used [6].
- **Buyer groups:** an AI audience of the people who decide purchases together [7].
- **Business Manager:** LinkedIn's tool for managing ad accounts, Pages and CRM connections [20].
- **Conversions API (CAPI):** server-to-server route for sending conversions [15].
- **Conversion window:** days after a click or view in which a conversion is credited [18].
- **Cost cap:** a bid strategy that aims to keep cost per result near a set amount [3].
- **CRM Sync:** a Business Manager link that brings CRM stages into LinkedIn [10][21].
- **Deduplication:** keeping one copy when tag and server send the same event [17].
- **Designated Countries:** LinkedIn's term for the EU, EEA and Switzerland [8].
- **Document ad:** an ad that shows a multi-page document in the feed [13].
- **eventId:** the shared ID that lets LinkedIn match tag and server events [17].
- **Hidden fields:** form fields the member does not see, used for tracking [12].
- **Insight Tag:** LinkedIn's website tag [14].
- **Lead Gen Form:** a pre-filled LinkedIn form attached to an ad [9].
- **li_fat_id:** LinkedIn's click ID, stored in a first-party cookie with enhanced conversion tracking [16].
- **Matched Audiences:** audiences from your lists, website visitors or engagement [4].
- **Maximum delivery:** automated bid strategy that spends the budget for the most results [3].
- **Predictive audiences:** AI audiences modelled from a source such as leads or conversions [6].
- **Qualified lead:** a lead your team has marked as a real prospect; also a LinkedIn optimisation goal [10].
- **Thought Leader Ad:** an ad that promotes a person's post [27].

## 10. What changes fast

Re-check at every refresh (this kit reviews every 30 days):

- Objectives, formats and bid strategies [1][2][3][9].
- Audience size guidance, predictive audiences and buyer groups [5][6][7].
- Qualified leads requirements [10].
- Conversions API identifiers, timings and API version sunsets [15][16].
- Conversion windows and attribution options [18][19].
- Ad policies and the Ads Agreement [23][24].
- EDPB and UK guidance on storage and access technologies, especially the Information Commission's page and any new PECR exceptions [28][30].

Where to check: LinkedIn Marketing Solutions Help, LinkedIn's legal pages, the LinkedIn Marketing API docs on Microsoft Learn (with their recent changes page), the EDPB, GOV.UK and the Information Commission.

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Ask for deal size, close rate and sales cycle before setting any budget, because the most you can pay for a lead comes from those three numbers. (§5)
- `decision_rule` With an audience under 50,000, use fewer ad sets and fewer formats, not more, because each split shrinks delivery. (§5)
- `decision_rule` For a list of a few hundred named accounts, use a company list with a broad job function filter and run it as a long, steady campaign, because tiny lists are fragile. (§5)
- `decision_rule` When leads are cheap but sales calls them junk, move to the qualified leads goal fed by the CRM or Conversions API, because the system can only learn what a good lead looks like if you tell it. (§5)
- `decision_rule` Gate a guide or report with a Lead Gen Form only when sales can act on the lead; otherwise use a document ad with an ungated link, because a form costs volume. (§5)
- `decision_rule` Judge brand reach on reach in the target companies and later pipeline from them, not on clicks, because most buyers are out of market today. (§5)

## 12. Defaults to avoid

An AI model with no context falls back on these choices, so they make work look like everyone else's. Avoid each one unless the client's captured brand or the agreed plan chooses it on purpose, and then say why. The full shared list is in tools/ai-default-patterns.md.

- **Every concept in one look.** All ad variants share one layout, colour treatment and image style, so a test compares copy only. Give each concept its own look so the test can tell them apart.
- **One hook formula reused.** Every intro text opens with the same pattern, such as a stat followed by "Here's how". Vary the opening per concept, drawn from the buying group's real problems.
- **Product on a gradient.** A product screenshot or device mock-up floating on a purple or blue gradient. It is the stock B2B ad; show the product in the buyer's context or in the client's brand colours.
- **Stock hype words.** "Unlock", "Elevate", "Seamless" or "Game-changer" in headlines and intro text. Senior buyers skim past them; use the client's specific claim with its proof.
- **Benefits any competitor could claim.** "Save time", "boost productivity", "all-in-one platform". Lead with the difference the client can prove.
- **Fake urgency.** "Limited spots" or "Ends soon" on content that is always available. Use a real deadline or none.
- **Checklist score with no diagnosis.** An account review that scores against a fixed checklist without saying why this account's cost per qualified lead moved. Diagnose this account first, then rank fixes by money at stake.
