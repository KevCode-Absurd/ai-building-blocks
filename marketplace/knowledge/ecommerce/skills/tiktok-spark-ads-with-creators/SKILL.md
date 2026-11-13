---
name: tiktok-spark-ads-with-creators
description: "Sets up TikTok Spark Ads from creators' own posts: which posts to pick, a written usage deal with fee, period and disclosure, the authorization code or in-app request that lets the store run the post without anyone's login, code expiry tracking, links with one UTM per creator, comment handling, and a fair side-by-side test of creator posts against the store's own brand-made ads read on store orders. Use when creators have posted about the product and the store wants to put spend behind those posts, when brand-made TikTok ads have stalled, or before paying a creator for ad usage."
---

# TikTok Spark Ads with creators

**You get:** a Spark Ads pack: a shortlist of creator posts with why each was picked, a signed-off usage sheet per creator (fee, code period, disclosure, link), the drafted campaign with creator and brand-made ads in two equal ad groups, and a results sheet with the winner rule, ready for the owner to approve.

## When to use

- Creators (paid, gifted or organic fans) have posted videos about the product.
- Brand-made TikTok ads are tiring and the store wants a different face and voice.
- The store is about to pay a creator and needs the usage terms right.
- A creator post is doing far better than the creator's usual posts.

## Not for

- Finding and messaging creators: use `write-influencer-outreach` or `plan-influencer-gifting-campaign`.
- TikTok Shop affiliate videos in Shop ads: use `tiktok-shop-gmv-max-ads` and `tiktok-shop-creator-affiliate-outreach`.
- Meta partnership ads: use `run-creator-partnership-ads`.
- Sales and payout tracking per creator over time: use `track-creator-sales`.

## What you need

Required:

1. **Creator posts**: links, with each creator's handle and their last 10 posts' views.
2. **Allowed cost per purchase** from `store-meta-math`.
3. **A working TikTok ads account** with pixel passing (see `launch-tiktok-ads-first-campaign`).
4. **Brand-made ads** on the same products: 3 to 5 videos for the comparison.
5. **The owner's budget** for the test and for creator fees.

Optional: the creator's audience country and gender split (creators can screenshot it), past creator payments, Shopify orders with discount codes per creator.

Access: creators send codes or approve requests in their own app; the store never asks for a creator's password. Entering codes and drafting ads needs level 2. Paying creators, launching ads and replying to comments as the brand need the owner's yes.

## Before you start: the gates

1. **Allowed cost per purchase is known.** Fail: compute it first; no winner rule can be set.
2. **The post is honest.** The creator really used the product and the result shown is what buyers can generally expect; any payment, free product or other link is disclosed [MCR-6025]. Fail: do not run it.
3. **No fake proof.** No scripted "customer" who is not one, and no AI person passed off as a buyer [MCR-6021]. Fail: drop the post.
4. **Disclosure is switched on.** Paid or gifted posts carry TikTok's content disclosure setting on the post itself. Fail: ask the creator to switch it on before authorizing.
5. **Claims are allowed.** Health, before-and-after and comparison lines pass `check-ad-copy-for-policy-and-claims`. Fail: pick another post.
6. **Market.** TikTok is blocked in India; India stores use Spark Ads only for buyers abroad, and follow disclosure rules in that buyer's country.

## Steps

### 1. Pick the posts

Score each candidate post:

- **Outlier:** views about five times the creator's usual post views earn a place in ads [ORG-0035].
- **Buyer fit:** the creator's audience matches the store's buyers by country, age and gender; off-target audience share lowers value [ORG-0041].
- **Product shown clearly** in the first seconds, with use, not just unboxing.
- **Comments** with buyer questions ("where do I get this") are a good sign; comments about the creator, not the product, are not.
- **New angle:** creators often find angles the brand never used, worth copying into brand-made ads later [MCR-0035].

Pick 3 to 5 posts. View count alone is not the test.

### 2. Agree usage in writing

One short usage sheet per creator, agreed by message or email:

| Term | Default |
|---|---|
| Posts covered | Exact links |
| Code period | The longest the creator agrees to; the app offers set periods up to a year (check on the day) |
| Fee | Flat fee, or flat plus performance bonus; a starting point is the creator's last 10 posts' average views x a target cost per thousand views [ORG-0041] |
| Disclosure | Content disclosure switched on before the code is sent |
| Comments | Who replies, and that neither side deletes buyer questions |
| Changes | Spark runs the post as is; recuts need raw files and a separate right |
| End | What happens when the period ends or either side stops |

### 3. Get the authorization

Two paths, both without logins:

- **Code:** the creator turns on ad authorization for that video in the TikTok app, picks the period, and sends the code. The store enters it in Ads Manager and confirms the post shows the right video.
- **Request:** the store sends an authorization request through TikTok's creator tools and the creator approves it in the app.

Log each code: creator, post, start date, end date. Set a reminder two weeks before expiry.

### 4. Set the link and tracking

Each Spark ad gets the call-to-action button and the landing page. Use one UTM per creator (utm_content set to the creator handle, lower case) so `track-creator-sales` can count orders per creator. A creator discount code is optional; codes leak to coupon sites, so do not rely on them alone.

### 5. Draft the fair test

| Ad group | Ads | Budget |
|---|---|---|
| A: Creator Spark | 3 to 5 creator posts | Equal, about 2 x allowed cost per purchase a day each, $20 minimum [ADC-0063] |
| B: Brand-made | 3 to 5 brand ads on the same products and angles | Same |

Same objective (purchase), targeting, placement, landing page and dates. Equal ad group budgets, not one shared budget, so delivery cannot starve one side. On Meta, the same ad run through a person's handle often beats the brand page [ADC-0003] and creator-handle ads can take a large share of spend [ADC-0011]; this test finds out whether that holds for the store on TikTok.

### 6. Write the winner rule before launch

Run 7 to 14 days. Read on store-attributed purchases and new customers, not only TikTok's count.

- **Creator side wins:** cost per new customer at least 20% lower (practitioner default, test it) and each side has about 20 or more purchases.
- **No clear winner:** fewer purchases than that, or a smaller gap. Small differences need far more purchases to detect [CRO-0005]; keep both and extend.
- Pause any single ad that spent three times the allowed cost with no purchase [ADC-0039].

### 7. Run the comments

Spark ads keep the post's likes and comments. Check comments daily: answer buyer questions from the brand account, hide spam and abuse, never delete fair complaints. Share recurring questions with the creator and the store's product page owner.

### 8. Close out

Pay creators as agreed. Rebook creators whose posts beat the brand side. Renew codes for winners before they expire. Move the winning angles into briefs for brand-made ads.

## Checks before you hand it over

- Each picked post has its outlier score and buyer-fit note.
- Each creator has a usage sheet with fee, code period and disclosure agreed.
- Disclosure is on for every paid or gifted post.
- Every code is logged with its end date.
- Each creator has a unique UTM.
- Both ad groups have equal budgets and identical settings.
- The winner rule names the purchase count and the gap.
- No payment, launch or brand reply went out without the owner's yes.

## Output

**One-screen summary:** posts picked, total creator fees, test budget and dates, the winner rule, and (at the end) the result with the next booking decision.

**Creator usage sheet** (`spark-creators.csv`): Creator, Post link, Usual views, Post views, Outlier ratio, Audience fit, Fee, Bonus, Code period, Code start, Code end, Disclosure on (yes or no), UTM, Agreed by.

**Campaign draft:** settings table per ad group (Objective, Optimisation event, Targeting, Placement, Budget, Ads, Landing URL).

**Results sheet** (`spark-test-results.csv`): Ad group, Ad, Spend, CTR, 6-second view rate, TikTok purchases, Store purchases, Store new customers, Cost per new customer, Decision.

## Common mistakes

- **Picking by views.** Step 1 scores outlier ratio, buyer fit and product clarity.
- **No written terms.** Step 2 sets fee, period and disclosure before the code.
- **Codes expiring mid-scale.** Step 3 logs end dates with reminders.
- **Unfair test.** Step 5 uses equal budgets and identical settings.
- **Calling a winner on a handful of orders.** Step 6 requires purchase counts first.
- **Undisclosed paid posts.** Gate 4 blocks them.

## Sources

- ADC-0003: posts through a person's handle often beat the brand page.
- ADC-0011: creator-handle ads can carry a large share of spend.
- ADC-0039: judge after three times target cost.
- ADC-0063: TikTok ad group budget near two times cost per purchase, $20 floor.
- CRO-0005: small differences need many conversions.
- MCR-0035: creators find angles the brand missed.
- MCR-6021: US ban on fake testimonials.
- MCR-6025: honest use and disclosed connections for endorsers.
- ORG-0035: outlier posts belong in ads.
- ORG-0041: price creator deals from views and audience fit.

What makes this skill ours: posts are picked on outlier ratio and buyer fit rather than raw views; every creator has a written usage sheet with code expiry tracked; creator posts are tested against brand-made ads in equal ad groups and judged on store new customers; and disclosure and honest-use rules are hard gates, not afterthoughts.
