---
name: product-review-analysis
description: "Product review analysis and customer feedback intelligence. Pain point identification, praise pattern analysis, feature request extraction, sentiment analysis, and product improvement insights. Use when the user asks about review analysis, customer feedback, product reviews, or sentiment analysis."
metadata: {"nexscope":{"emoji":"⭐","category":"ecommerce"}}
---

# Review insight finder

Turn a set of customer reviews into three ranked lists: what people complain about, what they praise, and what they ask for. Then turn those into fixes and into wording for your product page.

## What you hand back

One report in the layout under "Output Format". Every count, percent and quote comes from the reviews the user gave you. Nothing comes from outside.

## When to use it and when not to

Use it when the user has 30 or more reviews of one product, or one brand, from any platform.

Do not use it for:
- Fewer than about 30 reviews. Read them by hand, or say the sample is too small for percents and give themes without them.
- One review that needs a reply. Use the Customer review reply writer.
- Buying reasons only. Use the Review reason spotter.
- Low-star app reviews for a Shopify app. Use the Low-star review triager.
- Checking whether reviews are real. Use the Fake review spotter.

## Inputs

- The reviews, pasted or as a file. Best with a star rating and a date for each. Review text alone works, but then skip the star and time checks and say so.
- The product name.
- Competitor reviews (optional), pasted by the user. Never fetch or scrape reviews yourself. If the user wants competitor reviews and has none, ask them to paste some.
- The platform they came from (optional).

If something needed is missing, ask once, then go on with what you have and mark the gap MISSING. Never make up a review, a rating or a quote.

## Steps

1. **Count and clean.** State how many reviews you were given and how many you used. Set aside empty reviews and obvious duplicates, and say how many. Do not claim any review is fake. You cannot tell that from text alone. If the user wants an authenticity check, point to the Fake review spotter. If there are fewer than about 30 reviews, say so and do not give percents.
2. **Read the star spread and the mood.** Give the count of reviews at each star level and the average, if ratings were given. Say whether the mood is positive, mixed or negative, with the reason. If dates were given, say whether the mood is improving, steady or falling, comparing the earlier half with the later half. If there are no dates, write "no dates given".
3. **Tag every review.** Give each review one main theme (the thing it is mostly about) and, if there is one, one more. Use short, plain theme names such as "arrives damaged" or "easy to set up". Write each theme the same way every time. Mark each tag as complaint, praise or request.
4. **Count the themes.** Count how many reviews carry each theme. Give both the count and the share of all reviews used (count out of the total, and the percent). Rank the lists by count. Check that your counts add up.
5. **Pull real quotes.** For each of the top five complaints and top five praise themes, give one or two quotes copied word for word from the reviews, trimmed to the relevant part. Never rewrite a quote. If no quote fits, leave it blank.
6. **List the requests.** Collect asks such as "I wish it came in blue" or "needs a longer cord". Rank by how many reviews asked. Note any gap where several reviews ask for something the product does not do.
7. **Compare with competitors (only if reviews were pasted).** Run steps 3 and 4 on each competitor on its own. Then show where customers praise them for something that your reviews complain about, and the reverse. Say how many reviews each brand has, so the user can weigh the comparison.
8. **Turn it into fixes and words.** Suggest up to five fixes, ranked by how many customers raised the issue and how easy it looks to fix. Mark each fix as a suggestion, and say who would do it (product, support, or page copy). Give up to five phrases customers use, taken word for word, that could go on the product page or in ads.
9. **Say what the data cannot tell you.** For example: reviews show only people who chose to write one, they do not show how many people bought, and you cannot work out revenue, market size or the effect on rating from them. Do not give figures for those.

## Rules

- Use only what is in the reviews. Do not add market size, revenue potential, development cost or effort scores. If asked, say these need other data.
- Do not give a "rating impact" such as "-0.4 stars" unless you can work it out from the star ratings given, and show the working.
- Say which counts are small. A theme in 3 reviews is a hint, not a pattern.
- Keep customer quotes private to the user's work. Do not add names or details that could identify a reviewer.

## Output Format

### Review insight report: <product>

**What I used:** <number> reviews from <platform or "not given">, <date range or "no dates given">. Set aside: <number> empty or duplicate.

**Star spread and mood**
| Stars | Reviews |
|---|---|
| 5 / 4 / 3 / 2 / 1 | <count each> |
Average: <number or "no ratings given">. Mood: <positive / mixed / negative> because <reason>. Trend: <improving / steady / falling / no dates given>.

**Complaints, ranked**
| Rank | Theme | Reviews | Share | Quote |
|---|---|---|---|---|
| 1 | <theme> | <count> | <percent> | "<word for word>" |

**Praise, ranked**
| Rank | Theme | Reviews | Share | Quote |
|---|---|---|---|---|

**Requests, ranked**
| Rank | Request | Reviews | Quote |
|---|---|---|---|

**Against competitors** (only if reviews were pasted)
| Brand | Reviews | Top praise | Top complaint |
|---|---|---|---|
Where customers prefer them: <list>. Where customers prefer you: <list>.

**Fixes to consider, ranked**
1. <fix> | Why: <count and theme> | Who: <product / support / page copy>

**Customer words for your page or ads**
- "<word for word>"

**What this cannot tell you:** <list>

## Next steps

Offer one: reply to the worst reviews with the Customer review reply writer; turn the praise into proof for ads with the Review quote ad card planner; or check the praise for real buying reasons with the Review reason spotter.

---

Method from the Nexscope AI skill `product-review-analysis` (MIT licence). See LICENSE.
