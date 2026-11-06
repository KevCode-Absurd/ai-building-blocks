# Amazon PPC specialist: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Amazon renames its ad tools and moves menus often, so every platform fact below says when it was true. Most of it comes from Amazon Ads' own public guides and product pages. The detailed Amazon Ads help centre and the ad policy pages did not load for automated reading on 6 Nov 2026, so where a rule lives only there, this file says so and tells you where to read it. For the wider Amazon business (listings, fees, Vine, account health), see the Amazon marketplace manager kit; this kit covers the ads.

## 1. What this role is for

A seller or brand hires an Amazon PPC specialist to make Amazon Ads pay. The job covers Sponsored Products, Sponsored Brands and display ads (formerly Sponsored Display; Amazon's page doesn't date the rename) [1][2][3]: building campaigns, choosing keywords and product targets, setting bids and budgets, reading the search term report, adding winners and negatives, and judging each product's ad cost against what that product can afford.

Who hires it: brands with 5 to 200 products whose ACOS "looks fine" but whose profit doesn't; founders launching a product who need a launch, growth and defend plan; sellers with years of messy automatic campaigns; agencies and marketplace managers who want a second pair of eyes on spend.

What good work looks like:

- Every product has a break-even ACOS worked out from its own margin before any campaign is judged [17].
- The account is built so you can read it: campaigns by product or tight product group, separate automatic and manual campaigns, and one match type per ad group where that helps control [11][14].
- Search terms are harvested on a rhythm: converting terms move to exact match, wasteful terms become negatives, each with a rule you can see [11][12][15].
- Bids and budgets move by rules tied to each product's phase (launch, growth, defend), not by mood.
- Work happens at the access level the client grants for each tool: read, read and draft, or read, write and publish within set limits. Spend above the agreed cap and any new ad account always need a fresh yes.

How it is judged: profit after ad cost per product, not one blended ACOS; TACOS trend (ad spend over total sales) to see whether ads lift total sales or just buy sales that would have come anyway [13]; wasted spend removed; and a clean change log that explains every bid and budget move.

## 2. The canon

There is no classic textbook for Amazon PPC. The working canon is Amazon's own guides, a few simple pieces of maths, and the advertising law that applies to every ad.

**Amazon Ads' guides as the rule book.** Amazon publishes how targeting, match types, negatives, bidding strategies and reports work, and changes the tools several times a year [11][12][13][14]. An expert reads the official wording, dates it, and re-checks it at each refresh rather than trusting old blog posts.

**Break-even ACOS.** Amazon Ads' own ACOS guide states the core rule: ACOS has to stay below your profit margin, or the ad spend costs more than the sale earns [17]. Break-even ACOS is profit before ads divided by price. Everything else in this kit sits on that number.

**TACOS and the total-sales view.** Amazon's guide for authors tells them to track TACOS, ad spend as a share of total sales, alongside sales growth [13]. Practitioners use it for every seller: a falling TACOS with rising total sales suggests ads are helping organic sales; a rising TACOS with flat total sales suggests ads are replacing sales you would have had.

**The harvest cycle.** Amazon's own sequence: run an automatic campaign for about two weeks, read its search term report, add the terms that convert as manual keywords (often exact match), add terms that don't convert as negatives, then repeat [11][15]. Most of the craft is doing this patiently and consistently.

**Patience over panic.** Amazon reports that sellers who kept a Sponsored Products campaign running for 12 months averaged 11.2% higher ROAS than in their first month (Amazon internal data, 2019 to 2021) [15], and that new campaigns often show high ACOS simply because they are new [17]. Treat both as reasons to give a change time to settle, not as forecasts.

**Incrementality on brand terms.** JLab, the audio brand, cut bids by 50% on its seven highest-spending branded keywords over three months from early 2023 and reduced its ad budget by 30% while product page traffic held steady, according to Amazon Ads' case study [23]. The lesson: spend on your own brand name may buy sales you would have made anyway. Test it before cutting it, because a rival may bid on your name.

**Advertising law.** The US Federal Trade Commission requires ads to be truthful and backed by proof before they run [27]; the UK CAP Code requires evidence for objective claims and treats unqualified superlatives as comparisons [28]; the EU Unfair Commercial Practices Directive bans misleading practices, and Directive (EU) 2024/825 on green claims applies from 27 September 2026 [29]. Sponsored Brands headlines and video are ads in law, so "best", "#1" and "eco" claims need proof.

## 3. How the work is done now

### Where the work happens (as of Nov 2026)

Amazon has merged its tools. Its Amazon Ads Agent page (checked 6 Nov 2026) describes one buying surface that combines the ads console and Amazon DSP, with existing campaigns, reports and settings carried over [5]. Amazon first showed this as the Campaign Manager beta on 10 November 2025, with an AI helper (Ads Agent) that can make bulk bid changes [6]; for DSP campaigns built from a media plan, Ads Agent launches them only after the advertiser approves [7]. Amazon's guides now tell you to create reports from the measurement and reporting area of Amazon Ads Agent [13][25]. Menu names may still differ by account and country, so describe steps by what they do, not only by where a button sits.

The Amazon Ads MCP Server opened in beta on 2 February 2026 for Amazon Ads partners with active API credentials. It lets an AI agent create, update or delete campaigns, run reports, manage account settings and see billing data [9]. It can make live changes, so this role uses it only at the level the client grants and inside written limits.

### The three ad types

- **Sponsored Products:** cost-per-click ads for single listings, shown in and beside shopping results and on product pages, and in some placements off Amazon; image or video [1]. Needs a Professional selling plan and a product that can win the Featured Offer and is in stock [12][22]. Adult, used, refurbished and closed-category products are not eligible [1][19].
- **Sponsored Brands:** a brand headline with logo and several products, or video, linking to a Brand Store or a product page; billed per click or per 1,000 viewable impressions (vCPM) [2]. Sellers need Brand Registry [2][19]. Amazon's playbook adds Sponsored Brands once Sponsored Products is live, and reports that brand owners using it saw 23% higher sales after 13 weeks (Amazon internal data, Jan 2025) [18]. Reserve share of voice sells fixed top-of-search placement on branded keywords for a set price; once such a campaign starts it cannot be changed or cancelled (terms last updated 11 Sep 2026) [21].
- **Display ads (formerly Sponsored Display):** as of Nov 2026 Amazon's page says Sponsored Display "is now known as display ads"; existing campaigns keep running under Display, Video and Audio in Amazon Ads Agent [3]. Self-service display buys on CPC or vCPM with no minimum; managed service has a minimum spend [4]. Sellers need Brand Registry [22].

**Prompts.** Since 25 March 2026 in the US, Sponsored Products and Sponsored Brands campaigns carry AI "prompts" that answer shopper questions in results and on detail pages, sometimes opening Rufus. Campaigns are enrolled automatically, prompts are billed under the campaign's CPC settings, they can be paused one by one, and there is a Prompts report [8]. Check this report monthly: it is spend you did not set up.

### Targeting (Sponsored Products, as of Nov 2026)

**Automatic targeting** matches ads to searches and products from your listing. Four groups can be bid separately: close match, loose match, substitutes (similar products' pages) and complements (related products' pages) [11].

**Manual keyword targeting** uses three match types [11][19]:

- **Broad:** the words in any order, with plurals, variations, synonyms and related terms; the exact keyword may not appear at all.
- **Phrase:** the full phrase in the same order, including plurals.
- **Exact:** word for word, including plurals. The narrowest, and in Amazon's words it tends to have the highest conversion rates.

Keywords are not case-sensitive, can be up to 10 words and 80 characters, and may use only letters, numbers and spaces [11]. Amazon suggests at least 25 to 30 keywords per campaign to start [14][15], and bidding highest on exact, lower on phrase and lowest on broad [11].

**Manual product targeting** aims at named products (ASINs) or whole categories, which you can narrow by brand, price, star rating and Prime eligibility [11].

**Negatives** come as negative phrase and negative exact keywords, plus negative products, at campaign or ad group level, in automatic and manual campaigns [11][19]. Amazon's guidance: look at a term once it has at least 20 clicks before making it negative, and let negatives run two weeks or more before changing strategy again [11].

Two rules that catch people out: you cannot change a campaign's targeting type after launch, and an ad group holds up to 1,000 products [11]. Sponsored Brands uses the same broad, phrase and exact match types [16][19].

### Bidding

Sponsored Products has three campaign bidding strategies [12][13]:

- **Dynamic bids, down only:** Amazon lowers your bid when a click is less likely to sell.
- **Dynamic bids, up and down:** Amazon raises bids by up to 100% for the top of the first page of results and up to 50% for other placements, and lowers them when a sale is less likely.
- **Fixed bids:** Amazon uses your bid as set.

On top, **placement adjustments** for top of search, rest of search and product pages can raise the bid by up to 900% [12]. The final cost per click comes from an auction on your adjusted bid plus other factors, and never exceeds the maximum adjusted bid [12][26]. Amazon suggests "up and down" for automatic campaigns and "down only" when you are protecting return on spend [11].

Sponsored Brands can use automated bidding for placements below top of search (not for video); without it, you raise the base bid by a percentage for top of search and rest of search [16]. Sponsored Brands also allows bid adjustments for audiences such as people who bought from your brand [2].

### Budgets

- Sponsored Products and Sponsored Brands have a minimum daily budget of 1.00 USD (or local equivalent) [19]. Amazon recommends starting at about 10 USD, 10 GBP or 10 EUR a day [12][14].
- Daily budgets are not paced through the day, so a small budget can run out by mid-morning [1][19].
- The daily budget is averaged over the month: a single day may spend more, but the month's total stays within daily budget times days [13].
- Sponsored Brands can use a daily or a lifetime budget, chosen at set-up and not switchable later; the lifetime minimum is 100 USD [16][19].
- Budget rules raise budgets on a schedule (for events) or when a campaign meets a performance threshold such as ROAS [24]. Each rule is a standing instruction to spend more, so it needs the client's yes like any cap change.
- Billing: new accounts start with a credit limit of 50 USD that steps up to 500 USD; the previous month's balance is charged on the third day of the month [19].

### Reports

The Sponsored Products reports are: search term, targeting, advertised product, campaign, placement, performance over time and search term impression share [25]. The search term report lists shopper searches that produced at least one click [12]. Amazon uses last-touch attribution [19]; the attribution window shows in the report's column names, so read it there rather than assuming.

### Structure that works

Amazon's own guidance: keep one product category per campaign, group products of similar price and conversion rate in an ad group (they share bids), pair an automatic and a manual campaign for each product group, use portfolios to group campaigns, and leave campaigns running with no end date [12][14]. Many practitioners go further and split manual campaigns by match type, so exact-match bids can be set without moving broad bids. Choose a naming pattern that puts product, ad type, targeting and match type in the name, so anyone can read a report row at a glance.

### Before ads: the listing gate

Amazon says to advertise products that are in stock, can win the Featured Offer, and have a strong detail page; its best-practice guide suggests products with five or more reviews and a rating of 3.5 stars or higher [12]. Ads send shoppers to the listing; they cannot fix a weak one.

## 4. Benchmarks and numbers

Use these to set expectations, never as targets. Each has a source, a date and a caveat.

- **Video in Sponsored Products:** +67% click-through rate and +9% conversion rate versus campaigns without video [1]. *Caveat:* Amazon internal data, US, June 2026; no method published.
- **Running time:** 11.2% higher ROAS after 12 months of continuous running versus the first month [15]. *Caveat:* Amazon data from 2019 to 2021; survivors only.
- **Sponsored Products adoption:** 34% more sales growth four weeks after starting, versus non-users [22]. *Caveat:* Amazon data, Sep 2023 to Aug 2024, 21 marketplaces; not a controlled test.
- **Sponsored Brands:** 23% higher sales after 13 weeks [18]. *Caveat:* Amazon internal data, Jan 2025.
- **Ads Agent beta:** median 18% lower CPM and 16% lower CPA for closed-beta users [10]. *Caveat:* Amazon's figures for DSP-side users, Sep to Oct 2025.
- **Case studies:** Made for Locs reports 10x ROAS from Sponsored Products and testing; Marvis a 62.6% new-to-brand share [1]; Loftie a ROAS of 5.66 and ACOS of 17.68% on Sponsored Brands [2]. *Caveat:* chosen by Amazon, mostly undated, and none shows the brand's margin.

No trustworthy public source gives a "good ACOS", "average CPC" or "average conversion rate" for Amazon across categories. Amazon itself says the right ACOS depends on the business [17]. Use the client's margin and history.

## 5. Decision rules

- If you don't have a product's price, fees and landed cost, don't call its ACOS good or bad; ask for them, because break-even ACOS is the only fair yardstick [17].
- If a product's ACOS sits above its break-even ACOS for a full review period after launch, cut bids, narrow match types or pause the losing targets, because each ad sale then loses money [17].
- If a product is in a planned launch phase, allow ACOS above break-even only for an agreed time and budget, written down before launch, because "launch" without an end date becomes a permanent loss.
- If a search term has converted at or below target ACOS, add it as an exact-match keyword in a manual campaign and consider a negative exact in the source campaign, because that gives you a direct bid on it [12][15].
- If a term has at least 20 clicks and no sales, and its meaning doesn't fit the product, add it as a negative, because Amazon's own threshold for judging is 20 clicks [11].
- If a term is relevant but has fewer clicks than that, leave it on a watch list, because one or two clicks prove nothing.
- If you add negatives, wait two weeks or more before changing the strategy again, because the effect needs time to show [11].
- If a campaign runs out of budget every day and is profitable, propose a higher budget; if it is unprofitable, fix bids first, because more budget only scales the loss [12].
- If branded keywords take a large share of spend, test lower bids on them, because sales may continue without the ads, as JLab found [23].
- If you need fixed spend on top of search for brand terms, check the reserve share of voice terms first, because it cannot be changed or cancelled once it starts [21].
- If a product loses the Featured Offer or goes out of stock, expect its ads to stop and don't raise bids to compensate, because the ads won't serve [12].
- If an AI tool or MCP connector can write to the account, set it to the level the client granted and write the limits down, because Amazon's MCP server can create, change and delete campaigns [9].
- If any change would push spend above the agreed cap, open a new ad account, start a budget rule, or commit to reserve share of voice, stop and ask first, because these commit money.

## 6. Common mistakes, and how to spot them

- **One blended ACOS.** Spot it: a report that says "ACOS 22%" with no per-product line. Three products can carry the account while two lose money on every ad sale.
- **No break-even.** Spot it: targets like "get ACOS under 30%" with no margin behind them [17].
- **Auto campaigns left alone for years.** Spot it: one automatic campaign with all products, no negatives, and search terms nobody has read [11].
- **Over-broad negatives.** Spot it: a negative phrase like "set" that also blocks "knife set" in a kitchen account. Check every negative against converting terms first.
- **The same term in five places.** Spot it: one search term getting clicks from several campaigns at different bids. Harvest to exact, then add negative exact where it came from.
- **Judging too early.** Spot it: keywords paused after three days, or negatives added after two clicks [11][15].
- **Mixed targeting in one ad group.** Spot it: keywords and product targets together, which Amazon advises against [11].
- **Budget rules nobody remembers.** Spot it: budgets that jump during events with no record of who set the rule [24].
- **Prompts spend unseen.** Spot it: no one has opened the Prompts report since March 2026 [8].
- **Claims in Sponsored Brands creative that can't be proved.** Spot it: "best", "#1", "eco-friendly" or "clinically proven" in a headline or video with no file of evidence [27][28][29].

## 7. Quality bar: what an expert checks before shipping

1. Does every product in scope have price, fees, cost, profit before ads and break-even ACOS, dated?
2. Is every number traced to a report and a date range?
3. Do campaign names follow one pattern that names product, ad type, targeting and match type?
4. Is each harvested keyword backed by its search term data, and each negative checked against terms that convert?
5. Are bidding strategy and placement adjustments stated for each campaign, with a reason [12]?
6. Is every proposed bid or budget change inside the client's limits, or flagged as needing a yes?
7. Are "losing money" and "not yet proven" kept apart?
8. Are Sponsored Brands headlines and video claims true and provable, and checked against Amazon's ad policies in a browser [20][28]?
9. Is there a dated log of every change (what, where, when, result) and how to undo it?
10. Does the plan say when each change will be reviewed and what result would reverse it?

## 8. How this role writes

**Deliverables.**

- *Per-product table:* price, fees, landed cost, profit before ads, break-even ACOS, actual ACOS, TACOS, status (profitable, break-even, losing, not yet proven).
- *Structure map:* campaign and ad group names, targeting, match types, starting bids, budgets and bidding strategy.
- *Harvest and negatives lists:* CSV ready for bulk upload, each row with the rule that put it there.
- *Bid and budget rules:* launch, growth and defend phases with the conditions that move a product between them.
- *Change log and change request:* numbered items, each with current value, new value, reason, expected effect and review date.

**Tone and conventions.** Calm and exact. Lead with the per-product number, then the action. Dates on every figure. Separate what the data shows from what you think. No promises of rank or sales. At levels 1 and 2, every change is a proposal for the client; at level 3, actions within the limits are logged as done.

## 9. Glossary

- **ACOS:** advertising cost of sales; ad spend divided by ad-attributed sales [17].
- **ROAS:** return on ad spend; ad sales divided by ad spend, the inverse of ACOS [17].
- **Break-even ACOS:** profit before ads divided by price; the ACOS at which ad sales make zero profit.
- **TACOS:** total advertising cost of sales; ad spend divided by all sales [13].
- **ASIN:** Amazon's product ID, used for product targeting and negatives.
- **Featured Offer:** the offer shown in the buy box; Sponsored Products ads need it [12].
- **Automatic targeting:** Amazon chooses searches and products from your listing, in four groups [11].
- **Close match, loose match, substitutes, complements:** the four automatic targeting groups [11].
- **Broad, phrase, exact match:** keyword match types from widest to narrowest [11].
- **Negative phrase, negative exact:** keyword exclusions; negative products exclude ASINs [11].
- **Search term report:** shopper searches that got at least one click on your ads [12].
- **Harvesting:** moving searches that convert into manual campaigns as keywords.
- **Dynamic bids (down only, up and down):** Amazon adjusts your bid in the auction by likelihood of a sale [12][13].
- **Placement adjustment:** a percentage increase for top of search, rest of search or product pages, up to 900% [12].
- **Portfolio:** a folder for grouping campaigns, for example by brand or season [12].
- **Budget rule:** an automatic budget increase on a schedule or a performance threshold [24].
- **Reserve share of voice:** pre-bought top-of-search Sponsored Brands placement on branded keywords [2][21].
- **vCPM:** cost per 1,000 viewable impressions, used by Sponsored Brands and display ads [2][4].
- **New-to-brand:** first purchases from your brand in a 12-month look-back [2].
- **Amazon Ads Agent:** Amazon's combined platform for sponsored ads and DSP, as named in Nov 2026 [5].
- **Prompts:** AI answers attached to Sponsored Products and Sponsored Brands ads in the US [8].

## 10. What changes fast

Re-check at each refresh:

- **Platform names and menus:** Amazon Ads Agent, Campaign Manager and where reports live [5][6][13].
- **Ad types:** the display ads rename and what it means for former Sponsored Display campaigns [3][4].
- **Prompts and AI shopping placements:** billing, reporting and countries [8].
- **Bidding rules:** dynamic bid limits and the placement adjustment ceiling [12][13].
- **Targeting rules:** match type behaviour, keyword limits, the negative-keyword guidance [11][19].
- **Budget minimums, credit limits and budget rules** [19][24].
- **The Amazon Ads MCP Server:** who can use it and what it can change [9].
- **Ad policies:** read the Amazon Ads policy pages linked from the ad specs index in a browser at each refresh, because they did not load for automated reading on 6 Nov 2026 [20].
- **Reserve share of voice terms** [21].
- **Advertising law:** FTC guidance [27], the CAP Code [28], and EU rules including green claims from 27 Sep 2026 [29].
