# Mobile app marketer: role knowledge

Checked 6 November 2026. Platform facts carry their date and a source number from `sources.json`. I get apps found in the App Store and Google Play and keep people coming back: store listings, keyword plans, screenshot stories, listing tests, custom pages, in-app events, Apple Ads and Google App campaigns, push notifications and in-app messages. With your access I work in App Store Connect, Play Console, your ad accounts and your messaging tool at the level you choose (see `access.md`).

Two neighbouring kits hold detail I don't repeat here. The `mobile-app-developer` kit covers builds, privacy labels, the Data safety form, App Tracking Transparency, review rules for binaries, phased releases and the EU trader rules. The `growth-marketer` kit covers growth models, experiment sizing, cohorts and unit economics. I point to them where they apply.

## 1. What this role is for

**Who hires me.** Indie and small studios, subscription apps (fitness, budgeting, learning, meditation), local businesses with an app (food delivery, booking, loyalty), and agencies that need app store skills for one client. The app often has good reviews but few installs, a listing nobody has touched since launch, or users who turned notifications off in week one.

**What good work looks like.**
- Every field fits the store's limit and targets a named keyword, taken from what users actually type and say in reviews.
- Screenshots tell one story: the main benefit first, then the top features, then proof.
- Changes are tested with the stores' own tools, one asset at a time, and judged against a rule agreed before the test.
- Ads, custom pages and in-app events send each audience to the page that matches what they were shown.
- Notifications are asked for at a moment that makes the value obvious, and each message has a trigger, an audience, a cap and a stop rule.
- Nothing fakes proof: no bought reviews, no rewards for ratings, no false urgency.

**How the work is judged.**
- Product page conversion rate in App Analytics, and store listing visitors to installers in Play Console.
- Ranks for the target keywords (needs a rank tool or the client's own tracking).
- Notification opt-in rate, push open and action rates, and opt-outs or disables.
- Return rates after day 1, 7 and 30 from the client's own analytics.
- Cost per install, and better, cost per paying user, for paid campaigns.
- The rating trend and the share of reviews that mention the problems we fixed.

## 2. The canon

**Apple's App Review Guidelines** (last updated 16 October 2026) [1]. For marketers the key parts are 2.3.7 (accurate metadata, 30-character names, no stuffing with trademarks, popular app names or prices), 2.3.3 and 2.3.4 (screenshots show the app in use; previews are screen captures), 4.5.4 (marketing push needs explicit opt-in and an in-app way to opt out), 5.6.1 (use Apple's review prompt, no custom review prompts, keep review replies on topic) and 5.6.3 (no manipulating charts, search, reviews or referrals).

**Apple's product page guide** [2] and **Google's store listing pages** [17][18]. The limits, the keyword rules and what each field does.

**Google Play's policy centre.** Metadata [19], User Ratings, Reviews and Installs [22] and Ads [23]. Most listing rejections and warnings trace back to one of these three.

**Platform permission guidance.** Apple's article on asking permission for notifications [16] and Android's notification permission page [24]. Both say the same thing in different words: ask in context, after people see why.

**Reading list (credited, no claims drawn from them here).** Sean Ellis and Morgan Brown, *Hacking Growth* (2017); Alistair Croll and Benjamin Yoskovitz, *Lean Analytics* (2013); Nir Eyal, *Hooked* (2014), read with an eye on where habit design turns into pressure. The `growth-marketer` kit summarises the growth canon.

## 3. How the work is done now

### 3.1 The two product pages (as of 6 November 2026)

| Field | App Store | Google Play |
|---|---|---|
| Name | 30 characters [1][2] | 30 characters [17][19] |
| Second line | Subtitle, 30 characters [2] | Short description, 80 characters [17] |
| Keywords | Hidden field, 100 characters, commas, no spaces [2] (100 bytes in App Store Connect [3]) | No separate keyword field [17] |
| Long text | Description, 4,000 characters [3] | Full description, 4,000 characters [17] |
| Changeable any time | Promotional text, 170 characters; does not affect search rank [2][3] | Any listing field; experiments and custom listings go through review [20][21] |
| Screenshots | Up to 10 [2] | Up to 8 per device type; games need at least three 16:9 or 9:16 [18] |
| Video | Up to 3 previews, up to 30 seconds each [2] | One YouTube video; first 30 seconds autoplay muted [18] |

- **What needs a new version.** On the App Store, the subtitle and description change when you submit a new version; promotional text does not [2]. So most App Store listing work rides with an app update, which the developer and client schedule.
- **Search.** Keywords and the app name drive where an App Store app appears, and ratings influence rank [2]. In search results, the first one to three screenshots show when there is no preview video [2].
- **Apple keyword rules.** Don't repeat words already in the name or subtitle in the keyword field, and skip plurals of included words, category names, the word "app", competitor names and trademarks [2]. Improper keywords are a common rejection reason [2].
- **Play wording rules.** No emojis or repeated special characters in the title, icon or developer name; no ranking, price or promotion claims such as "#1" or "10% off"; no anonymous testimonials; no keyword lists [19]. The feature graphic guidance also says to avoid words like "Best", "Top", "New" and "Free", and calls to action like "Download now" [18].
- **Screenshot rules.** Apple: show the app in use, not title art, a login page or a splash screen [1]. Play: tagline text should not take more than 20% of an image, and the video should mostly show the real app with core features in the first 10 seconds [18].

### 3.2 Testing the product page

**Apple product page optimization (PPO)** [4][5]
- Up to three treatments against the original: icon, screenshots and previews. Shown on iOS and iPadOS 15 or later.
- You choose the share of traffic in the test; it is split across treatments, and each person sees the same version throughout.
- A test runs up to 90 days or until you stop it. One test at a time, and it can't be changed once started.
- Treatment metadata is approved by App Review. Tests without alternate icons can be submitted without a new app version; alternate icons must already be in the app binary.
- Apple suggests waiting until a treatment is better or worse than the baseline with at least 90% confidence. Applying a treatment ends the test.
- A new app version released during a test can affect results if it changes the tested assets [4].
- Not available for custom product pages [4].

**Google Play store listing experiments** [20]
- One default graphics experiment (icon, feature graphic, screenshots) or up to five localized experiments, which can also test descriptions.
- Up to two variants against the current listing. You set the audience share, the minimum detectable effect and the confidence level.
- The page names its metrics as unique user install clicks, open clicks and pre-registration clicks. Experiments stop after 6 months. Published apps only.

### 3.3 Different pages for different audiences

**Apple custom product pages** [6][7]
- Up to 70 per app, each with its own screenshots, previews, promotional text and keywords, and a unique URL.
- They must be approved, and can be submitted independent of an app update. Editing an approved page keeps its URL.
- Assigned keywords (from the latest approved version, unique per page) let a page appear in search for those terms.
- Deep links to the matching screen work for iOS and iPadOS 18 or later.
- App Analytics shows each page's impressions, downloads and conversion after at least five first-time downloads.
- Apple Ads can build up to 35 ad variations from custom product pages [11].

**Google Play custom store listings** [21]
- Up to 50, each with its own name, icon, descriptions and graphics. Contact details, privacy policy and category stay shared.
- Audiences: country (one custom listing per country at a time), pre-registration, churned users, lapsed users (no open in 28 days), buyer groups, lapsed buyers (no purchase in 180 days), ads traffic, search keywords and custom audiences.
- Ads-traffic listings currently show only on AdMob, not Play search ads. Listings are not translated for you.

### 3.4 In-app events on the App Store

An in-app event is a timed happening inside the app: a challenge, competition, live event, major update, new season, premiere or special event [9].
- Up to 15 approved and 10 published at once. Each lasts up to 31 days and can be promoted up to 14 days before it starts [9].
- Event name 30 characters, short description 50, long description 120. No specific prices in the text [9].
- Cards appear on the product page, in search and in editorial and personalised placements, and people can ask to be notified when it starts [8].
- Submitted for review independent of an app version [9]. Apple lists daily tasks, price promotions and general awareness as poor candidates [9].

### 3.5 Paid acquisition

**Apple Ads** (renamed from Apple Search Ads on 14 April 2025 [11])
- Placements: Today tab, Search tab, search results and product pages [10]. Pricing is cost per tap, with manual bidding or Maximize Conversions (announced 25 February 2026) for search results [10][11].
- Search results ads can show at the top or further down; you can't pick the position, and relevance as well as bid decides whether an ad shows [12]. Apple announced on 17 December 2025 that more ads would appear further down results in early 2026 [11].
- Maximize Conversions is designed for post-launch campaigns; apps on pre-order use manual bids [12].
- On 8 June 2026 Apple announced that advertisers would be able to upload their own creative for Today tab and search results ads later in 2026 [11]. Check the account for whether it is live.
- Eligible new developers get a 100 USD credit [10].

**Google App campaigns** [26]
- You supply text, images, video and a starting bid and budget; Google builds ads across Search, Google Play, YouTube, the Display Network and Discover.
- Subtypes: installs, engagement (people who already have the app) and pre-registration. The app must be on Google Play or the App Store.

**Spend.** At level 3 I launch and adjust campaigns only within the budget cap and accounts you set. Spending above the cap needs your yes; billing and payment methods stay with you.

### 3.6 Measuring installs on iOS without tracking

- **AdAttributionKit** (iOS 17.4 and later): ad networks register with Apple, sign their ads and receive postbacks. There are three conversion windows, one winning postback and up to five non-winning postbacks for installs, plus re-engagement postbacks. Apple sets a data tier per conversion to keep crowds anonymous. No App Tracking Transparency prompt is needed [14].
- **SKAdNetwork** is the older API; Apple now says to use AdAttributionKit for app ad campaigns [15].
- **Apple Ads** has its own AdServices API, with attribution data kept up to 21 days. Apple says AdAttributionKit covered 77% of referral-based App Store conversions (November 2024 data). Apple Ads registered with AdAttributionKit on 10 April 2025, starting with SKAdNetwork versions 1 to 3, with the AdAttributionKit API to follow at an unstated later date [13].
- **In practice.** Agree the conversion values with the developer before launch (for example: opened, finished onboarding, started trial, paid), expect coarse and delayed data, and never promise person-level attribution on iOS. The ATT prompt itself belongs to the developer kit.

### 3.7 Ratings and reviews

- **Apple:** use the system review prompt; custom review prompts are not allowed [1]. It can show up to three times in 365 days [2]. Apps may not make a rating the price of using a feature [1]. Replies stay on topic, with no marketing or personal data [1].
- **Google Play:** the In-App Review API has an unpublished time-bound quota, so never put it behind a button, and never ask "Do you like the app?" before it [25]. Play bans incentives, forced or deceptive pop-ups, paid reviews and automated inflation; a notification offering a discount for a high rating is a listed violation [22].
- **Both stores** treat manipulated ratings as a serious breach; Apple says it may remove a developer from its program [1].

### 3.8 Push and in-app messages

- **Android.** From Android 13 (API level 33) notifications need a runtime permission and are off by default for new installs. Apps that still target 12L or lower lose control of when the dialog appears. Google's examples of good moments: tapping an alert bell, following someone, placing a food order [24].
- **iOS.** Ask in a context that shows why, not automatically at first launch; only the first request shows the prompt. Provisional authorization delivers quiet trial notifications to Notification Center, where people choose Keep or Turn Off [16].
- **Marketing push.** Apple requires explicit opt-in with consent wording in the app, plus an in-app opt-out, for promotions [1]. Play bans ads that look like notifications [23]. People can see how many notifications an app sends each day and switch them off [24].
- **The message map.** For each message: the trigger (an event the app tracks), audience, timing and time zone, frequency cap, goal, the screen it opens, and the stop rule (acted, or ignored several in a row). In-app messages follow the same map, with when they show and when they stop.

### 3.9 Real examples (vendor-reported figures)

- **CBS Sports and State of Survival.** Apple reports a 20% conversion increase for a CBS Sports March Madness custom page, and a 33% increase with 14% lower cost per install for a State of Survival page aimed at role-playing fans [7]. Apple gives no method.
- **Fetch.** Apple Ads published a case study on 28 August 2025 reporting a 51x increase in downloads during the Super Bowl [11].
- **Rakuten.** Apple Ads reports a 669% increase in first-time buyers from Search tab ads [10].

These are the vendor's own case studies. Use them to show what a tool can do, not as a forecast.

### 3.10 Rules by region (not legal advice)

- **US.** The FTC announced on 14 August 2024 a rule banning fake reviews, rewards conditioned on positive (or negative) sentiment, undisclosed insider reviews, review suppression and fake social media indicators, with civil penalties for knowing violations [27].
- **UK.** The CMA published fake reviews guidance (CMA208) on 4 April 2025, following legal changes in April 2025 [28].
- **EU.** In the 2021 sweep, authorities checked 223 sites with reviews and found at least 55% potentially breached the Unfair Commercial Practices Directive [29].
- **Everywhere.** Push consent, data use and children's apps are for the client's adviser. Trader status and privacy labels are in the `mobile-app-developer` kit.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 30 / 30 / 100 / 170 | App Store name / subtitle / keywords / promotional text limits | [2]; characters, keywords 100 bytes in [3] |
| 30 / 80 / 4,000 | Play name / short / full description limits | [17] |
| 10 / 3 x 30 s | App Store screenshots / previews | [2] |
| 8 per device type | Play screenshots | [18] |
| 3 treatments, 90 days, 90% | Apple PPO limits and suggested confidence | [5] |
| 2 variants, 6 months | Play experiment limits | [20] |
| 70 / 50 | Apple custom product pages / Play custom store listings | [6][21] |
| 15 / 10 / 31 / 14 | In-app events approved / published / days long / days of promotion | [9] |
| 3 per 365 days | Apple review prompt | [2] |
| 1.6% and +2.5 points | Apple's average default page conversion and average uplift from custom pages | [7]; Apple's figures, no method, no date |
| 77% | Share of referral-based App Store conversions in AdAttributionKit | [13]; Apple data, November 2024 |
| 21 days | AdServices attribution data kept | [13] |
| Android 13 (API 33) | Notification permission required | [24] |

**Numbers I do not quote.** Average push open rates, "best time to send", average opt-in rates or industry conversion rates, unless a named study with a date and method is in front of me.

## 5. Decision rules

- If the App Store listing needs new words, put them in promotional text now and in the subtitle, keywords and description with the next app version, because only promotional text changes without a version [2].
- If a word already appears in the name or subtitle, leave it out of the keyword field, because repeats waste the 100 characters [2].
- If you want to test the icon on the App Store, plan it with the developer, because alternate icons must ship in the binary first [5].
- If two changes are ready, test one at a time, because both stores split traffic per test and a mixed change can't be read [5][20].
- If an Apple test hasn't reached the confidence Apple suggests, keep it running or stop it as a draw; don't apply it on a hunch [5].
- If an ad, email or social post talks to one audience, send it to a matching custom page or custom listing, because the page then repeats what they were promised [6][21].
- If something real happens in the app with a start and end date, make it an in-app event; if it's a daily task or a price cut, don't [9].
- If the app targets Android 12L or lower, ask the developer to raise the target before planning the permission moment, because otherwise the system picks the moment [24].
- If a message is promotional on iOS, check the in-app marketing consent and opt-out exist first [1].
- If someone asks for more reviews, add the system prompt after a success moment, never a reward or a pre-question [1][22][25].
- If a campaign runs on iOS, agree the AdAttributionKit conversion values with the developer before launch [14].
- If a vendor case study is used in a pitch, label it as the vendor's figure.

## 6. Common mistakes and how to spot them

- **Keyword waste.** Spot it: the keyword field repeats the app name, includes "app" or plurals of words already there [2].
- **Promotional text used for keywords.** Spot it: a list of search terms in the 170 characters; it doesn't affect rank [2].
- **Screenshots that are posters.** Spot it: the first image is a logo or splash with no app on screen [1].
- **Ranking claims.** Spot it: "#1", "Best" or "Free" on Play graphics or in the title [18][19].
- **Two changes in one test.** Spot it: a variant with a new icon and new screenshots.
- **Stopping at the first good day.** Spot it: a treatment applied before the confidence Apple suggests [5].
- **Ads to the default page.** Spot it: a campaign about one feature sending people to a page that leads with another.
- **Permission on first launch.** Spot it: the system dialog before the person has seen anything [16][24].
- **Marketing push without consent wording.** Spot it: promotions sent to everyone who allowed notifications for order updates [1].
- **Rating bait.** Spot it: "Enjoying the app? Rate 5 stars for a reward" or a "Rate us" button calling the review API [22][25].
- **Over-trusting iOS attribution.** Spot it: a report that claims per-person install sources from iOS ads [14].
- **Untranslated custom listings.** Spot it: a country listing shown in the default language only [21].

## 7. Quality bar

Before anything goes to the client, I check:
1. Every field is within its limit for that store and language, counted, not guessed.
2. Each line names the keyword it targets, and no keyword is wasted on repeats.
3. No claim the app can't back up, no ranking or price claims, no competitor names or trademarks.
4. Screenshots tell one story and show the real app; captions are readable at thumbnail size.
5. Each test has one change, a hypothesis, the metric, the stopping rule and who decides.
6. Each custom page or listing names its audience and the ad or link that sends people there.
7. Each message has trigger, audience, timing, cap, goal, deep link and stop rule, and respects quiet hours and time zones.
8. Permission screens give an honest reason and a "Not now" path.
9. No fake or rewarded reviews anywhere in the plan.
10. Every action that needs level 3 or a fresh yes is listed for the client.

## 8. How this role writes

- **Listing sheets.** One table per store and language: field, limit, text, character count, target keyword.
- **Keyword maps.** Theme, keyword, source (reviews, rival listing, search suggestion), where it goes in each store, keep or drop.
- **Screenshot plans.** Frame by frame: the caption, what the screen shows, and the point of the frame in the story.
- **Test cards.** Hypothesis, asset changed, store tool, audience share, metric, stopping rule, decision.
- **Message maps.** One row per message: trigger, audience, timing, cap, copy (title and body with counts), deep link, goal, stop rule.
- **Copy.** Plain words, the benefit first, specific over clever. "See every bill due this week" beats "Take control of your finances".

## 9. Glossary

- **ASO:** App store optimisation, the work of getting an app found and installed from store search and browse.
- **Product page:** an app's listing on the App Store [2].
- **Store listing:** an app's page on Google Play [17].
- **Promotional text:** the 170-character App Store line that can change any time without a new version [2].
- **Keyword field:** Apple's hidden 100-character list of search terms [2].
- **PPO:** product page optimization, Apple's test of icons, screenshots and previews [4].
- **Treatment:** one alternate version of the product page in a PPO test [5].
- **Store listing experiment:** Google Play's A/B test of listing assets [20].
- **Custom product page:** an extra App Store page for an audience, with its own URL and keywords [6].
- **Custom store listing:** an extra Play listing for an audience such as a country or lapsed users [21].
- **In-app event:** a timed happening in an app shown as a card on the App Store [8].
- **Apple Ads:** Apple's ad platform, renamed from Apple Search Ads in April 2025 [11].
- **CPT:** cost per tap, how Apple Ads charges on the App Store [10].
- **App campaign:** Google Ads campaign type for app installs, engagement or pre-registration [26].
- **AdAttributionKit:** Apple's privacy-preserving attribution framework for app ads [14].
- **Postback:** the signed message an ad network receives after a conversion [14].
- **Conversion value:** a number the app sets to tell ad networks how far a new user got [14].
- **Provisional authorization:** iOS quiet trial notifications without a prompt [16].
- **POST_NOTIFICATIONS:** Android's runtime permission for notifications since Android 13 [24].
- **Frequency cap:** the most messages one person gets in a period.
- **Stop rule:** the condition that ends a message sequence for one person.

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| App Review Guidelines | Apple [1] | Updated 16 Oct 2026 |
| Product page fields and limits | Apple [2][3]; Play [17][18] | As in section 3.1 |
| PPO and custom product pages | Apple [4]-[7] | 3 treatments; 70 pages |
| In-app events limits | Apple [9] | 15 approved, 10 published |
| Play experiments and custom listings | Play [20][21] | 2 variants; 50 listings |
| Apple Ads placements and features | Apple Ads [10]-[12] | Maximize Conversions; own creative announced |
| Attribution | Apple [13]-[15] | Apple Ads on SKAdNetwork 1 to 3; AdAttributionKit API later |
| Play policies | Play [19][22][23] | As summarised |
| Notification permission | Apple [16]; Android [24] | Android 13 runtime permission |
| Review rules by region | FTC [27]; CMA [28]; EU [29] | Rules in force |
