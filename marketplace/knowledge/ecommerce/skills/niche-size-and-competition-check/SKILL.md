---
name: niche-size-and-competition-check
description: "A verdict on one niche: roughly how big buyer demand is (as a range, from free data such as Keyword Planner, Google Trends, Merchant Center Popular products, marketplace listings and forum threads), who owns it today and how tightly, what it would cost a new store to win a buyer there, and whether the store can win: enter, enter only with a named angle, or avoid. Every number is labelled as measured, estimated or proxy, with sources and dates. Use before a new store picks its niche, before an existing store enters a new category or country, or when someone claims a market is huge or saturated."
---

# Niche size and competition check

**You get:** a two-page niche report: a demand range with its working, a map of who owns the niche and how tightly, the likely cost to win a buyer against the gross profit the store would earn, and a verdict (enter, enter with a named angle, or avoid) with the one angle that could work.

## When to use

- A founder is choosing between two or three niches for a new store.
- An existing store is thinking about a new category or a new country.
- Someone says a market is "huge" or "saturated" and the owner wants evidence.
- Before paying for stock, branding or a website in a new space.

## Not for

- Finding individual products to sell: use `find-trending-products`.
- Proving buyers will pay for one product: use `validate-demand-before-buying-stock`.
- Studying one rival product: use `competitor-product-teardown`.
- Choosing the next marketplace for an existing range: use `choose-next-marketplace`.

## What you need

Required:

1. **The niche in one line:** product type, buyer, country (for example "posture correctors for desk workers, UK").
2. **Expected price and delivered costs** (or supplier quotes) to work out gross profit per order.
3. **Cash limit** for entering.

Optional: a Google Ads account with billing set up (Keyword Planner's keyword ideas need it); a Merchant Center account; marketplace seller access; any past ad data from the store.

Access: read only (level 1). Nothing is spent. If a small paid search or ad test would settle a question, draft it and hand it to `validate-demand-before-buying-stock` for the client's yes.

## Before you start: the gates

1. **Gross profit per order estimated** from delivered costs, not product cost alone [MEA-0037]. Fail: get rough quotes first; a niche verdict without margin is a guess.
2. **Label every number.** Each figure is one of: measured (platform data), estimated (a formula on measured data), or proxy (a hint, such as review counts). The report keeps these labels.
3. **One country at a time.** The US, UK, Germany and Australia behave differently; size them separately.
4. **Regulation.** Note any licence, label or certification the niche needs. Fail when the store cannot meet it.

## Steps

### 1. List how buyers search for it

Write 20 to 50 phrases buyers use, from marketplace search suggestions, Reddit and forum threads, reviews of current products and Google's "People also ask". Include terms in the languages your buyers use, and mixed-language or slang terms. Split into: problem phrases ("lower back pain from sitting"), product phrases ("posture corrector"), and brand phrases.

### 2. Size demand as a range

- **Search volume.** Keyword Planner gives estimated monthly searches; where it shows a range rather than a figure, keep the range. Sum product and problem phrases separately.
- **Direction and season.** Google Trends over 5 years and 12 months. Trends is a share of sampled searches on a 0 to 100 scale, so it shows direction and season, never volume [PRD-6480].
- **Marketplace pull.** Count listings and read the "bought in past month" lines Amazon shows on many listings (a rounded floor, label it proxy). Note best-seller ranks with the date.
- **Google Shopping.** Merchant Center Popular products shows popular and rising brands and price ranges by category and country, weekly [PRD-6481].
- **Forum depth.** Search "<problem> Reddit" and count separate threads with real buyers; many separate threads suggest a real group, a handful suggests a small one [AVT-0013].

Estimate monthly buyers only as a range: (buying-intent searches a month x a click share of 2 to 5% x a conversion rate of 1 to 3%), stating that click share and conversion are assumptions (practitioner defaults, test them). Never present the top of the range as the size.

### 3. Map who owns it

For the top 10 sellers across Google, the main marketplace and Meta:

- Brand, price band, review count, rating, years selling, channels.
- Live Meta ads now, from the Ad Library, which holds only running ads for ordinary advertisers [PRD-6483].
- Share: what share of the top 10's reviews (a proxy) sit with the top 3.

Count live advertisers properly, because a raw Ad Library count flatters or hides a crowd:

- Search the exact product term, two or three other words buyers use, and the wider niche term (the other products the same buyer could pick instead), with the country set to the market, active ads only, over the last 7 to 14 days. Date the search; counts change week to week.
- Count distinct stores, not pages, since one store can run several pages. Remove ads in a language the market does not buy in, ads for a different product, and big retailers that sell everything. Write the count before and after.
- For each rival note the number of live ads, the oldest ad's start date, whether it is a one-product store, and its offer (bundle, free gift, subscription or plain). Ads started in the last few days prove nothing yet; put those rivals on a watch list and look again in a week.
- Read it: fewer than about 5 stores advertising the exact product in the last week is open, 10 or more is crowded (one practitioner's beginner thresholds; test them). Zero advertisers anywhere does not mean an open niche; it can mean nobody has made it pay. At least one rival running several ads for more than a week is the proof someone pays to sell it.
- The Ad Library shows Meta advertisers only, so count Amazon and TikTok Shop sellers by hand.

Read the shape:

| Shape | Signs | Meaning |
|---|---|---|
| Owned | top 3 hold most reviews and ads, strong brands | Hard; need a sharp angle |
| Fragmented | many small sellers, no clear leader | Room for a brand |
| Sameness | everyone looks and sounds alike | Room if the store brings a shift buyers already want [PRD-0001] |
| Empty | little demand, few sellers | Check step 2 again; may be too small |

On Amazon, signs a niche can be entered: top listings with 300 reviews or fewer, listings at least 8 months old, few images [AMZ-0006].

### 4. Estimate the cost to win a buyer

- Floor cost per buyer = cost per click divided by conversion rate; for example 0.70 at 3% gives about 23, 1 at 2% gives 50 [MEA-0019]. Use Keyword Planner's top-of-page bid range for the cost per click, and label it.
- Rivals with higher order value, margin or repeat can outbid the store in auctions even with weaker ads [ADC-0057]. Note which incumbents have those.
- Compare with the store's gross profit per first order. If the floor is above it and the product does not repeat, the niche fails on economics, whatever its size.

### 5. Find the angle

A new store wins most often by serving a narrower buyer first: start on the most specific buyer situation and widen once it converts [AVT-0012]. If the product is the same as a large rival's, pick a buyer group the rival ignores rather than claiming a new mechanism [AVT-0014]. Two cheap sources of an angle: a plain one-product rival can often be beaten with a better offer and page, so name the offer gap; and a sub-category with strong search but a weak average rating (a rule of thumb from one demo: below about 3.8 stars) shows demand with weak products. Products rated 4.1 to 4.3 stars that still sell well point to the same gap, with their 1-star complaints as the fix list [AMZ-0002]. Keep a rating gap only when two kinds of evidence agree, such as review text and search volume, and drop any gap that rests on one forum post. Write one angle in one line: buyer, situation, why current options fail them, why the store can serve them. If no angle can be written with evidence, the verdict is avoid or test only.

### 6. Write the verdict

- **Enter:** demand range is enough for the store's revenue goal at a believable share, cost per buyer sits under gross profit, and the niche is fragmented or open.
- **Enter with angle:** demand is there but the niche is owned or same-looking; entry only through the named angle.
- **Avoid:** cost per buyer above gross profit with no repeat case, demand too small for the goal, or a rule the store cannot meet.

Name the revenue goal check: monthly orders needed for the goal divided by the top of the buyer range. If the store needs more than a small share of the niche in year one (practitioner default: over 5%, test it), call it out.

### 7. Market notes

- Every market: much demand runs through marketplaces (Amazon, Walmart, Etsy, eBay, Zalando, bol, Mercado Libre, as fits the country); size those as well as Google. Price bands, return rates and failed deliveries change the gross profit. Where TikTok is not available, use Instagram and YouTube search instead.
- US: Amazon and TikTok Shop often lead demand for new products; Merchant Center data covers Google. Check category rules (FDA, CPSC) before entering.
- UK and EU: Amazon and local marketplaces such as Zalando or bol often lead; check product safety and labelling rules (UKCA or CE marking, the EU General Product Safety Regulation) before entering.

## Checks before you hand it over

- Every number carries a label (measured, estimated, proxy), a source and a date.
- Demand is a range with the working shown.
- No Trends score is described as volume.
- The ownership table covers at least two channels.
- Live advertiser counts show the before and after count once non-rivals are removed, with the search date; brand-new ads sit on a watch list, not in the proof.
- Any rating gap used for the angle is backed by two kinds of evidence.
- Cost per buyer is compared with delivered gross profit per first order.
- The angle names a buyer, a situation and evidence.
- The verdict is one of three, with one runner-up option.

## Output

**One-screen summary:** the niche, demand range, ownership shape, cost per buyer against gross profit, the angle, the verdict, and the next step (usually a demand test).

**Demand table:** Phrase group, Monthly searches (range, label), Trend direction, Season peak, Marketplace signals, Forum thread count, Source and date.

**Ownership table:** Seller, Channel, Price band, Reviews, Rating, Years selling, Live Meta ads (count, date), Notes.

**Economics table:** Cost per click (range), Conversion assumption, Cost per buyer floor, Gross profit per first order, Repeat case (yes or no), Result.

**Verdict box:** Enter, Enter with angle, or Avoid; the angle in one line; share of niche needed for the goal; next step and owner.

## Common mistakes

- **One big number.** Step 2 gives a labelled range.
- **Trends as volume.** Step 2 reads Trends for direction only.
- **Crowded means bad.** Step 3 separates owned from same-looking niches.
- **Reading zero advertisers as an open niche.** Step 3 asks for proof that someone pays to sell it.
- **Size without cost to win.** Step 4 compares cost per buyer with gross profit.
- **An angle with no evidence.** Step 5 needs a buyer, situation and proof.
- **Sizing a marketplace-led country from Google only.** Step 7 adds marketplaces.

## Sources

- MEA-0037: delivered gross margin.
- PRD-6480: Google Trends is relative, 0 to 100.
- PRD-6481: Merchant Center Popular products.
- PRD-6483: Meta Ad Library shows running ads.
- AVT-0013: confirm a buyer group's size by separate forum threads.
- PRD-0001: same-looking categories plus a missed shift.
- AMZ-0006: signs of beatable Amazon listings.
- AMZ-0002: 4.1 to 4.3 star products that still sell, and their 1-star complaints.
- MEA-0019: cost per buyer floor.
- ADC-0057: rivals with better unit economics win auctions.
- AVT-0012: start on the narrowest buyer situation.
- AVT-0014: same product, win an unserved buyer.

What makes this skill ours: every figure is labelled measured, estimated or proxy so a hint never passes as a fact; the verdict turns on cost to win a buyer against delivered gross profit, not on size alone; crowded niches are split into owned and same-looking; and marketplace-led countries are sized across marketplaces, not just Google.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Much demand runs through Amazon.in, Flipkart, Meesho and Nykaa; size those as well as Google. Include regional language and Hinglish terms. Price bands and COD refusal rates change the gross profit. TikTok is not available; use Instagram and YouTube search instead.
