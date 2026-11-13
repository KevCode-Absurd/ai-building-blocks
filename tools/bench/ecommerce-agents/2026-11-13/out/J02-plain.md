# Bombas TikTok ads: 30-day launch plan

**Goal:** learn, for $30,000, whether TikTok can win new customers at or below Meta's $38 per first order. Day 30 gives a clear answer: yes, no, or one more month.

## The numbers we work to

| Measure | Value |
|---|---|
| Contribution per first order before ads | $62 x 55% - $7 = **$27.10** |
| First-order break-even cost | $27.10 (ROAS 2.29) |
| Meta today | $38 per first order (ROAS 1.63, first-order loss $10.90) |
| TikTok target | **$38 or less** |
| TikTok ceiling | **$45** (first-order loss $17.90) |
| First orders $30,000 buys | 789 at $38, 667 at $45 |

**Assumptions**
- Bombas already accepts a $10.90 first-order loss on Meta because repeat orders pay it back. TikTok is held to the same standard, so the target is parity with Meta.
- The $45 ceiling gives a new channel some room, because its tracking under-reports in the first month. Above $45 it is not competitive.
- All $30,000 is media. Creator fees and editing are paid separately.
- TikTok uses the same offers and prices as Meta, so the comparison is fair.
- Meta spend stays flat for these 30 days. Otherwise we cannot read the lift in total new customers.
- Set-up runs Monday to Thursday of week 0. Day 1 is the first day of spend. A late-November launch means holiday ad costs, so if Meta's cost moves in the same weeks, TikTok is judged against that figure.

## 1. Account and tracking set-up (week 0)

1. Create a TikTok Business Center on a company email. Add the ad account in USD and the store's time zone, billing and two admins.
2. Install the TikTok app on Shopify and connect the ad account. Set data sharing to the highest level so the pixel and the server-side Events API both send events.
3. Confirm these events fire with value and currency: ViewContent, AddToCart, InitiateCheckout, CompletePayment. Use the Pixel Helper and Test Events in Events Manager. Place one real order, then refund it. **No launch until CompletePayment shows the correct value.**
4. Turn on advanced matching (hashed email and phone).
5. Verify the bombas.com domain.
6. Link the organic TikTok account for Spark Ads. Get an authorization code for each creator video. Confirm the rights cover paid use for at least 60 days.
7. Upload the Shopify past-buyer list as a custom audience to exclude, so we pay for new customers.
8. Tag every ad with UTMs: utm_source=tiktok, utm_medium=paid, utm_campaign, utm_content=ad name.
9. Add "TikTok" as an answer to the post-purchase survey question "How did you first hear about us?" If there is no survey, add one before day 1.
10. Attribution: 7-day click, 1-day view. Report click-only next to it.

## 2. Campaign structure

Keep it small. $1,000 a day buys about 26 orders a day at $38. More ad groups would starve each one of the purchases it needs to learn.

| Campaign | Set-up | Role |
|---|---|---|
| **A. Scale** | Smart+ sales campaign, optimize for CompletePayment, US, broad (18+, no interests), past buyers excluded | Proven ads only. Starts day 11. |
| **B. Test** | Manual sales campaign, CompletePayment, US, broad, past buyers excluded, one ad group per batch | Every new ad starts here. |

- Placements: TikTok only where the campaign type allows. Turn off Pangle.
- No retargeting. Meta already retargets site visitors, so TikTok retargeting would mostly claim Meta's orders.
- Fewer than 10 purchases by day 3 (about 55 expected) means check tracking first.

## 3. Creative: how much and what kind

**Volume:** 16 ads at launch, then 8 new ads on days 8, 15 and 22: 40 ads in total. TikTok ads tire within weeks, so the pool must keep refilling.

**Launch set (16)**
- 4 existing creator videos as Spark Ads. (Assumption: "a few" means about 4.)
- 4 re-cuts of those videos with a new first 2 seconds.
- 8 new phone-shot ads from creators or staff, made in week 0.

**Concepts.** Each batch covers at least 4 of these, with 2 hook versions each.

| Concept | What it shows |
|---|---|
| First wear | A creator puts them on, walks, works out, and reacts on camera. |
| Problem and fix | Socks that slip, thin heels, sore feet after a long shift. Then Bombas. Use only claims already on the product pages. |
| Drawer swap | Throwing out worn, odd socks and restocking with a multipack. Fits the $62 order. |
| The giving story | One item donated for every item bought. Lead with the product, then the giving. |
| Reviews read aloud | Real reviews from bombas.com, used with permission. Never written for the ad. |
| Gifting | Socks as a holiday gift or stocking filler, timed to the season. |

**Specs:** 9:16, 1080 x 1920, 15 to 30 seconds, captions and sound on, product in the first 3 seconds. Keep text clear of the bottom fifth and right edge. Send traffic to the best-selling multipack page, not the home page.

## 4. Budget phasing

| Days | Per day | Phase total | A. Scale | B. Test |
|---|---|---|---|---|
| 1 to 10 | $700 | $7,000 | $0 | $700 (2 ad groups of 8 ads, $350 each) |
| 11 to 20 | $1,000 | $10,000 | $700 | $300 |
| 21 to 30 | $1,300 | $13,000 | $1,050 | $250 |
| **Total** | | **$30,000** | | |

**Gates**
- **Day 10:** move to phase 2 only if TikTok's cost per first order is $55 or less and at least 2 ads have met the promote rule. If not, hold at $700 a day, launch the next batch and check again on day 14.
- **Day 20:** move to phase 3 only if the days 11 to 20 cost is $45 or less. If not, hold at $1,000 a day. Unspent budget goes back to Meta.

## 5. Kill and scale rules

Check at the same time each day. Change any campaign's budget no more than once every 48 hours.

**Kill a test ad when:**
- It has spent $76 (2x target) with no purchase.
- It has spent $114 (3x target) and costs more than $57 per purchase.
- After 3,000 impressions, under 25% watch 2 seconds. Recut the opening and retest. 25% is a working line to adjust after week 1.

**Promote a test ad when:** it has at least 4 purchases at $38 or less each, with click-through at or above its ad group average. Move it into Campaign A using the same Spark post, so its likes and comments carry over.

**Scale Campaign A on its 3-day cost per purchase:**
- $38 or less: raise budget 20%, up to the phase cap.
- $38 to $45: hold.
- Above $45 for 3 days: cut 20% and replace tired ads.

**Retire a scale ad when** its click-through falls 30% below its first 3 days, or its 7-day cost per purchase rises above $45. Replace it from the test winners.

## 6. Day 30: did TikTok earn more budget?

Judge days 11 to 30 only. Use three reads, because each misses something:

1. **TikTok Ads Manager:** cost per purchase, 7-day click and 1-day view.
2. **Shopify:** first-time-customer orders with utm_source=tiktok. This counts clicks only, so it will look worse than read 1.
3. **Post-purchase survey:** new customers who answer "TikTok".

Then a **blended check:** Shopify new customers per day in days 11 to 30 against the 20 days before launch, with Meta flat. Compare the change with the same weeks last year to allow for the holidays. If TikTok claims orders but new customers did not rise, it is taking credit, not creating customers.

| Days 11 to 30 result | Decision for month 2 |
|---|---|
| Cost $38 or less, and survey and blended new customers both rose | **Earn more.** $45,000 next month, same rules, 8 to 10 new ads a week. |
| Cost $38 to $45, or the blended lift is unclear | **One more month** at $30,000. Double creative output. Same rules. |
| Cost above $45, or no blended lift | **Stop.** Return the budget to Meta. Keep the best ads for organic posts. |

On day 30 the media buyer sends one page: spend, first orders, cost per first order on all three reads, the blended check, the top 5 ads, and the decision from the table above.
