---
name: get-recommended-by-ai-assistants
description: "A ranked change list that makes ChatGPT, Gemini, Perplexity, Copilot and Google's AI answers name the store's products when buyers ask: a baseline of what assistants say today for the store's real buying questions, then fixes in three layers. Found: crawlers and CDN settings allow the assistants in and pages read without JavaScript. Matched: product facts, spec tables and best-for pages use the words assistants search with. Chosen: the third-party pages assistants actually cite (lists, reviews, forums, videos) are corrected or earned honestly, and an official brand facts page fixes wrong claims. Each change names the products it serves, ranked by gross profit, with no fake accounts, paid mentions without disclosure or hidden instructions to AI. Use when buyers say they asked an assistant, when rivals are named and the store is not, or when assistants describe the store wrongly."
---

# Get recommended by AI assistants

**You get:** a baseline table of 20 to 40 buying questions across assistants (named or not, cited sources), a ranked change list in three layers (found, matched, chosen) with owner and effort, a third-party source work queue, a brand facts page draft, and a one-screen summary, ready for the client to approve.

## When to use

- Buyers mention ChatGPT or another assistant in the how-did-you-hear survey, or the owner wants that channel.
- Assistants name rivals for the store's category and never the store.
- An assistant describes the store's prices, policies or products wrongly.
- Organic search clicks fall while AI Overviews appear on the store's queries.

## Not for

- Feeds, catalog eligibility and policies for AI shopping agents: use `product-data-for-ai-shopping`.
- Writing the answer pages this plan calls for: use `answer-pages-for-buyer-questions`.
- The monthly re-check after changes ship: use `track-ai-answer-visibility`.
- Comparison pages: use `build-comparison-page`.

## What you need

Required (read access, level 1):

1. **Live URL** and robots.txt; CDN or firewall bot settings (screenshot from the owner if the agent has no access).
2. **Top products** with gross profit per order and stock cover.
3. **Buyer questions**: support tickets, reviews, site search, Search Console queries with "best", "vs", "for", "which".
4. **Rival list**: the 3 to 5 brands buyers compare the store with.
5. **Store facts**: prices, shipping, returns, origin, materials, certifications, each with its source.

Optional: how-did-you-hear survey results, GA4 referral data, a paid AI visibility tracker the client already uses.

Changes to the site need draft access (level 2); outreach, forum posts, PR and any paid placement need the client's explicit yes before anything is sent or published.

## Before you start: the gates

1. **Products worth recommending.** Pass when the target products have positive gross profit per order and stock [MEA-0037]. Fail: drop them from the question set.
2. **Truthful basis.** Every fact the store wants assistants to repeat has a source. No claim goes out that the product page cannot back.
3. **Honest tactics only.** No fake accounts or reviews (the US bans fake and AI-generated reviews [MCR-6045]), no undisclosed paid mentions, no hidden text or instructions aimed at AI crawlers, which is cloaking or hidden text under Google's spam policies [SEO-6461].
4. **Measurement exists.** A how-did-you-hear question that lists AI assistants is live, or is added now [AEO-0020].

## Steps

### 1. Baseline: what assistants say today

Write 20 to 40 real buying questions for the store's best-profit products: "best X for Y", "X vs Y", "is [store] good", "where to buy X in [country]". Run each in ChatGPT (search on), Perplexity, Gemini, Copilot and Google (AI Overview or AI Mode), in a clean session, twice. Record: store named (yes or no), position, products named, description accuracy, rivals named, and every cited URL. Discount answers given without a web search, which show no citations [AEO-0015]. Assistants cite different sources [AEO-0012], so keep platforms separate.

### 2. Found: let assistants in

- robots.txt allows OAI-SearchBot (needed to appear in ChatGPT search answers [AEO-6466]), Googlebot, Bingbot, PerplexityBot and Claude's crawlers. Blocking GPTBot (training) is the owner's choice and does not remove the store from ChatGPT search [AEO-6466].
- CDN and firewall AI-bot settings, which can block crawlers that robots.txt allows; many sites block GPTBot by accident [SEC-0002].
- Key text renders without JavaScript: reviews, FAQs, specs, sizing [AEO-0002]. Test with JavaScript off.
- Sitemaps submitted to Google and Bing [AEO-0028].
- For Google's AI features no special file or schema is needed; pages must be indexed and snippet-eligible [AEO-6460]. Treat llms.txt as optional and unproven, never as a fix.

### 3. Matched: say what buyers ask, in plain facts

- Read the sub-searches assistants run for the baseline questions and reuse that wording in page titles, H1s and first sentences, including "best X for Y" collection pages [AEO-0016].
- Replace vague copy with facts an assistant can match: size, material, capacity, compatibility, who it suits, price, delivery time. A complete spec table with units on each product page serves buyers, search and assistants at once.
- Open key pages with a 2 to 4 sentence direct answer and a table [AEO-0030]; answer narrow fit and use questions on help pages in a subfolder [AEO-0031] (hand to `answer-pages-for-buyer-questions`).
- Product pages, comparisons and buying guides earn most AI citations, not general blog posts [AEO-0006].

### 4. Chosen: fix the sources assistants trust

Assistants recommend what many cited sources agree on; the store wins by being mentioned across those sources, not by one page ranking first [AEO-0034].

- From the baseline, list the third-party pages cited for each question: "best X" lists, review sites, marketplace pages, forum threads, videos. Fix those specific sources before paying for generic placements [AEO-0014].
- "Best X" lists drive many recommendations; pitch the editors with real facts, samples and a reason to include the store [AEO-0029]. Any paid or affiliate inclusion must be disclosed by the publisher.
- Branded mentions across the web, and YouTube mentions for ChatGPT, track AI visibility more closely than backlinks [AEO-0022]. A product video answering a buying question, with the product named aloud, is a fair asset.
- Forums: staff may answer real questions in buyer communities, saying plainly who they work for, comparing fairly with named rivals [AEO-0027]. No fake accounts, no vote buying.
- Each assistant leans on different sources (forums matter more for ChatGPT; Google's AI follows search ranking) [AEO-0024], so pick the sources per platform from the baseline.

Build the source work queue as one ranked sheet:

- **Rank domains** by how many baseline questions cite them, then by how many assistants cite them. Mark rows that also sit in Google's top 10 for the same question; they count twice. One "best X" roundup cited on many questions beats ten blogs cited once [AEO-0001].
- **Tier each source.** Tier 1 editorial (roundups, review sites, comparison posts, creator reviews); tier 2 community (Reddit, forums, Q and A); tier 3 the store's own channels (video, marketplace listings, guides). For physical products, expect lifestyle, home, parenting and review publishers more than tech sites, but trust the baseline.
- **Opportunity tick.** Mark yes only when the site takes outside submissions, has a named editor or contact, or already lists stores like this one, and the store has a real product or fact to offer. Everything else is marked no and left alone, so effort goes where inclusion is possible.
- **Price it honestly.** Record costs as quoted, example or unknown; count free product at landed cost against gross profit; any paid or affiliate inclusion is disclosed by the publisher. Never ask a direct rival to list the store; go to independent roundups and reviewers.
- **Coverage marker.** Record the share of the top 10 cited sources that mention the store today. Practitioners use about 20% coverage as a rough sign that answers start to move; treat it as a marker to test, not a target to promise.
- **Recheck.** Mentions get edited out, so recheck live mentions monthly and rerun the full question set each quarter.

### 5. Correct wrong facts

Publish an official brand facts page: what the store sells, prices or ranges, shipping, returns, origin, ownership, certifications, each dated. In one test, ChatGPT cited an official FAQ far more than planted fake sources [AEO-0011]. Then repeat the corrected fact on product pages, the About page, social profiles and third-party profiles; repetition across sources shifted what an assistant said over time [AEO-0017].

### 6. Rank the change list

Score each change: products served x gross profit per order x number of baseline questions it affects, divided by effort. Found fixes come first (they unblock everything), then matched, then chosen. Each change has an owner, an access level and the client's approval point.

### 7. Market notes

- **All markets:** ask the questions in each language the store sells in, including mixed-language forms buyers really type; put delivery times, returns and payment facts (such as pay on delivery where offered) on the brand facts page; marketplace listings (Amazon, Walmart, Etsy, Zalando and others) are often the cited source, so correct them first.
- **US:** review platforms and editorial "best of" lists dominate; FTC rules apply to any paid or gifted review.

### 8. Measure honestly

Plan a control: apply changes to half the baseline questions and leave half untouched, then compare after a few weeks [AEO-0035]. Read AI-referred sessions in GA4, but most AI mentions carry no link, so the survey matters more [AEO-0020] [MEA-0045]. Hand the monthly check to `track-ai-answer-visibility`.

## Checks before you hand it over

- Baseline covers at least 20 questions on at least 3 assistants, with cited URLs.
- OAI-SearchBot and Googlebot allowed in robots.txt and at the CDN.
- Key product facts readable with JavaScript off.
- Every change names its products and their gross profit per order.
- Third-party work targets sources actually cited in the baseline.
- Every source in the queue has a question count, an assistant count, a tier and an opportunity tick; costs are marked quoted, example or unknown.
- Current coverage of the top 10 cited sources is recorded as the starting point.
- No fake accounts, undisclosed paid mentions or hidden AI instructions anywhere in the plan.
- Brand facts page: every fact sourced and dated.
- Nothing sent, posted or published without the client's yes.

## Output

1. **One-screen summary:** share of questions where the store is named now, the 5 highest-ranked changes, sources to work on, what needs the client's yes.
2. **Baseline table:**

| Question | Assistant | Search used (yes or no) | Store named | Position | Products named | Accuracy issue | Rivals named | Cited URLs | Date |
|---|---|---|---|---|---|---|---|---|---|

3. **Change list:** Layer (found, matched, chosen), Change, Products served, Gross profit per order, Questions affected, Effort, Owner, Access needed, Approval needed, Status.
4. **Source work queue:** Cited URL, Type, Tier, Questions citing it, Assistants citing it, In Google top 10 (yes or no), Opportunity (yes or no), What it says, Fix or pitch, Contact route, Cost (quoted, example, unknown), Disclosure note. Plus one line: coverage of the top 10 cited sources today.
5. **Brand facts page draft** with sources and dates.

## Common mistakes

- **Tactics before access.** Step 2 fixes crawlers and rendering first.
- **Trusting one run.** Step 1 runs twice per platform and discounts no-search answers.
- **Generic PR.** Step 4 targets the exact sources assistants cite.
- **Chasing every cited site.** Step 4's opportunity tick drops sites that take no outside input.
- **Grey tactics.** Gate 3 bans fake accounts, undisclosed payments and hidden prompts.
- **One plan for all assistants.** Step 4 picks sources per platform.
- **Counting only clicks.** Step 8 uses the survey and a control set.

## Sources

- AEO-0001: map cited domains for core questions and target the most cited.
- AEO-0002: JavaScript-loaded content is invisible to most AI crawlers.
- AEO-0006: product, comparison and guide pages earn most citations.
- AEO-0011: an official brand facts FAQ is cited over planted sources.
- AEO-0012: cited domains differ by platform and churn.
- AEO-0014: fix the specific cited sources first.
- AEO-0015: discount answers given without web search.
- AEO-0016: reuse assistant sub-search wording.
- AEO-0017: repeating a corrected fact shifts assistant answers.
- AEO-0020: AI referrals are undercounted; ask buyers.
- AEO-0022: branded mentions track AI visibility.
- AEO-0024: separate playbooks per assistant.
- AEO-0027: honest forum participation.
- AEO-0028: crawler access and sitemaps first.
- AEO-0029: pitch the cited "best X" lists.
- AEO-0030: direct answers and tables.
- AEO-0031: help pages for narrow questions in a subfolder.
- AEO-0034: win by being mentioned across cited sources.
- AEO-0035: test with a control group.
- AEO-6460: no special files or schema for Google's AI features.
- AEO-6466: OAI-SearchBot controls ChatGPT search visibility.
- MCR-6045: US ban on fake and AI-generated reviews.
- MEA-0037: gross margin is delivered cost.
- MEA-0045: check channels with a post-purchase survey.
- SEC-0002: AI crawlers often blocked by accident.
- SEO-6461: hidden text and cloaking are spam.

What makes this skill ours: every change is tied to products with real gross profit and stock; third-party work comes only from sources the assistants actually cited for the store's questions; tactics that fake people, hide paid mentions or plant hidden AI instructions are ruled out; and results are judged against an untouched control set and the how-did-you-hear survey, not clicks.

## Selling in India

- Include questions in Hinglish and in the regional languages the store sells in, and "where to buy X in India".
- Put "COD available" and delivery-time facts on the brand facts page.
- Marketplace listings (Amazon.in, Flipkart, Nykaa) are often the cited source, so correct them first.
