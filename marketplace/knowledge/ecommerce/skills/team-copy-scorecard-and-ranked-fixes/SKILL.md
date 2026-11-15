---
name: team-copy-scorecard-and-ranked-fixes
description: "Reviews every live piece of the store's copy as one buyer path (top ads, the product pages they land on, the homepage first screen, advertorials and the key emails) and scores each out of 100 on five things a copy chief checks: awareness match to its traffic, one big idea with a mechanism, proof under each claim, the top objections answered in order, and the brand's own voice in buyers' words. Maps the promise, numbers and offer each piece makes so the gaps between ad, page and email show up, ranks the fixes by the gross profit flowing through each piece, and rewrites the top three for the teammate who owns that channel, every new line tied to a file. Read access only; rewrites are drafts, and nothing is published, sent or spent without the owner's yes. Use monthly, or when ads, pages, product copy and emails seem to make different promises."
---

# Team copy scorecard with ranked fixes

**You get:** a scorecard of every live piece of copy (ads, product pages, homepage first screen, advertorials, key emails) scored out of 100 on awareness match, big idea, proof, objections and voice; a promise map showing where ad, page and email disagree on the promise, the numbers or the offer; the fixes ranked by the monthly gross profit each piece touches; and rewrites of the top three, each handed to the teammate who owns that channel.

A buyer meets the store as one path: an ad, a page, an email, then maybe a second page. When the ad promises one thing, the page opens on another and the email talks about a third, the buyer stops trusting all three. Each teammate's copy can look fine alone and still lose sales as a set. This review reads the path the way the buyer does, scores each piece against the same five tests, and fixes the costly gaps first.

## When to use

- Monthly, as the copy chief's standing review of the team's live work.
- Ads, product pages and emails read like three different brands.
- A new promise, offer or mechanism has won, and older pieces still carry the old one.
- Different ads quote different numbers for the same thing (customer counts, ratings, results) [MCR-6609].
- The account runs many ads and nobody has checked whether their claims contradict each other [MCR-6750].
- Before a big sale or launch, so every channel says the same thing.

## Not for

- Checking ads against platform policy and the law: use `check-ad-copy-for-policy-and-claims`.
- Matching every ad, page and email to awareness stage from traffic data, with new drafts per stage: use `awareness-stage-message-match`.
- Judging ad creative (visuals, hooks, fatigue) on results: use `store-meta-creative-review`.
- Finding why a page loses buyers from analytics and recordings: use `storefront-conversion-audit`.
- Writing a new long page: use `long-form-sales-page-for-a-hero-product` or `advertorial-story-page`.
- Building the claims sheet: use `product-claims-profile`.

## What you need

Required (read access, level 1):

1. **The live pieces, with their results, last 30 days:**
   - Ads: the top 10 by spend across Meta, TikTok and Google, with primary text, headline, the first three seconds of video or the image text, spend and purchases.
   - The landing pages those ads send to: product pages of the top 5 products by revenue, any advertorial or listicle, and the homepage first screen, with sessions and conversion rate (purchase only).
   - Emails and SMS: welcome series, cart and browse abandon, and the last three campaigns, with recipients and placed order rate.
2. **The org context**: voice, words to use and avoid, buyer types in their own words.
3. **The claims sheet** from `product-claims-profile`, and the current offer and guarantee terms.
4. **Gross profit per order** for each product in scope.
5. **Customer words**: a reviews export and the top support ticket and return reasons.

Optional: post-purchase survey answers, past scorecards, the swipe file of past winners.

Access: level 1, read. Rewrites are delivered as drafts in a file; with level 2 they may be left as drafts in the ad account, store or email tool. Nothing is published, sent or spent without the owner's yes, and each rewrite goes live through the teammate who owns that channel.

Missing input: ask once. Without results data, score the pieces but rank fixes by traffic share only and mark the ranking "partial". Never guess a piece's results.

## Before you start: the gates

1. **Money gate.** Gross profit per order is known for the products in scope [MEA-0037]. Fail: score the copy, but do not rank fixes by money; rank by sessions or recipients and say so.
2. **Truth gate.** The claims sheet and the live offer are current. Fail: any claim you cannot check is marked "unchecked", never "pass".
3. **Path gate.** You can tell which ad sends to which page and which email follows (UTM tags, flow triggers). Fail: review pieces one by one and mark the promise map "partial".

## Steps

### 1. Lay out the buyer paths

Group the pieces into paths a buyer really travels: ad, landing page, the email or SMS that follows, and the page the email links to. Each top ad is the start of one path. Record each piece's traffic stage from its source: cold prospecting, retargeting, search term, email segment.

### 2. Pull each piece's promise in one line

For every piece write four short lines: the one promise it makes, the mechanism it gives (or "none"), the numbers it states, and the offer it shows. Use its own words. A piece with five promises gets "no single promise" [MCR-6706].

### 3. Build the promise map

Put the four lines side by side along each path and mark each gap:

- **Promise gap:** the ad promises one outcome, the page opens on another. The top of the page should repeat the ad's claim; the first frame, the text, the headline and the page top are seen as one hook [ADC-6218] [LPG-0067].
- **Number gap:** two pieces state different counts, ratings, results or prices for the same thing [MCR-6609].
- **Offer gap:** the price, bundle, discount or guarantee differs between ad, page, email and checkout.
- **Stage gap:** a piece speaks to a different awareness stage from the traffic it gets, or mixes stages [MCR-6719] [MCR-0056].
- **Clash:** two ads make claims that contradict each other [MCR-6750].

### 4. Score each piece on five tests

Score each test 0 to 4 against the anchors below. Add the five and multiply by 5 for a score out of 100.

| Test | 4 (strong) | 2 (part) | 0 (fails) |
|---|---|---|---|
| Awareness match | Opens for its traffic's stage and holds it | Right stage, but jumps to the pitch | Wrong or mixed stage |
| Big idea | One promise, a named mechanism, a reason it is new | One promise, no mechanism | No promise, or many |
| Proof | Strong proof (demonstration, third party, specific reviews) under each claim [MCR-6712] | Proof present but generic or far from its claim | Claims with no proof, or a claim bigger than its proof |
| Objections | Its top doubts answered in the order buyers raise them [MCR-6698] | Some answered, out of order or only in the FAQ | None answered |
| Voice | The brand's voice, buyers' own words, nothing a rival could sign [MCR-6689] | On brand, but category language | Off brand or generic |

Use 1 and 3 for in-between cases, with a one-line reason. Run a "so what?" on the piece's main line; if the answer never reaches the buyer's life, the big idea score is 2 at most [MCR-6716]. Score a piece's job, not its length: a 15-second ad is not marked down for leaving out the mechanism if its landing page carries it.

### 5. Rank the fixes by money

For each piece, work out the monthly gross profit flowing through it: monthly orders attributed to the piece (or its path) times gross profit per order. Multiply by the points it lost (100 minus its score) and divide by 100. That gives one index in money for every piece, so ads, pages and emails rank in the same unit. Show the working in one line per piece. Add each promise-map gap to the fix list of the piece that causes it; a gap on a path counts once, on the piece that must change. Break ties toward the piece earliest in the path, since every later piece inherits its promise.

### 6. Rewrite the top three

For the three highest-ranked fixes, write the rewrite in full:

- Keep what scored 4. Change only what lost points.
- Use the winning promise and its words across the path, so ad, page and email agree.
- Every new claim comes from the claims sheet or the customer words, with its file.
- Write to the channel's limits (character counts for ads, the first screen for a page, subject and preview text for email).
- Name the teammate who owns it: kofi-ad-copy for ads, georgia-product-copy for product pages, annabel-landing-pages for landing pages and advertorials, lucia-email-copy for email and SMS.

### 7. Log it

Add each piece's score to the running scorecard so the next review shows movement. Add any line that has clearly worked (top spend at good cost, top placed order rate) to the swipe file for this brand, with its result and date. Send any claim marked "unchecked" or "too big for its proof" to meenakshi-compliance.

## Checks before you hand it over

- Every live piece in scope is scored, with a one-line reason per test.
- Every score shows its sum (five tests, times 5).
- Every promise-map gap names the two pieces and quotes both lines.
- The ranking uses one money unit and shows its working.
- Each rewrite keeps the strong parts, tells the same promise as its path, and ties every new claim to a file.
- No invented review, number, result, deadline or stock line in any rewrite.
- Each rewrite names its channel owner. Nothing was published, sent or spent.

## Output

**One-screen summary first:** the three costliest gaps in two lines each (what to fix and why, with the monthly gross profit it touches), the team's average score against last month, and the one promise every channel should carry.

**Scorecard:** Piece, Channel, Traffic stage, Score out of 100, Weakest test.

**Promise map:** Path, Piece, Promise, Numbers, Offer, Gap.

**Fix ranking:** Rank, Piece, Points lost, Monthly gross profit through it, Index.

**Rewrites:** for each of the top three, before and after, the claim files, and the owner.

## Common mistakes

- **Scoring pieces alone.** Step 3 reads the path as the buyer does; a fine page can fail its ad.
- **Ranking by taste.** Step 5 ranks by the money flowing through each piece.
- **Rewriting everything.** Step 6 rewrites three and keeps what scored 4.
- **Two numbers for one fact.** Step 3 flags every number gap.
- **Marking a short ad down for a missing mechanism.** Step 4 scores the piece's job on its path.
- **A rewrite with a new claim and no file.** Step 6 ties every claim to the claims sheet.

## Sources

- MEA-0037: gross margin is the delivered cost to the door.
- MCR-6609, MCR-6750: consistent proof numbers; contradicting claims across many ads.
- MCR-6706: one promise, not five.
- ADC-6218, LPG-0067: first frame, text, headline and page top as one claim; carry the ad's words into the page.
- MCR-6719, MCR-0056: one awareness stage per piece.
- MCR-6712: the proof ladder.
- MCR-6698: six objections in order.
- MCR-6689, MCR-6716: cut what a rival could say; the so-what test.

What makes this skill ours: copy is judged as the path a buyer travels, not piece by piece; every gap names both pieces and quotes them; fixes rank in one money unit, so an email and an ad can be compared; and the top three are rewritten for the teammate who owns each channel, with every claim tied to a file.

## Selling in India

- Include WhatsApp messages and the COD confirmation message in the buyer path; check that the COD fee and delivery promise match across ad, page and message.
