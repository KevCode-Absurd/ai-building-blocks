---
name: plan-influencer-gifting-campaign
description: "A product seeding plan: who gets product and how many units, what to ask for (and what not to), the gift note and disclosure line, tracking codes and links per creator, a dispatch and follow-up calendar, and a payback sheet that says after 30 and 60 days whether the round paid for itself in profit and reusable content. Use before sending free product to creators, when past gifting produced few posts, or when the owner wants to know what a seeding round really costs."
---

# Influencer gifting campaign

**You get:** a seeding plan for one round (usually 20 to 100 creators): the recipient list with units and cost, the ask and gift note, a code and link per creator, a dated dispatch and follow-up calendar, and a payback sheet with the 30-day and 60-day verdict rule.

## When to use

- The store wants creators to try the product before any paid deal.
- A launch needs early posts and real reactions.
- Past gifting sent lots of product and got few posts, and nobody knows why.
- The owner asks "did the last seeding round pay off?"

## Not for

- Finding and checking the creators: run `find-and-vet-influencers` first.
- Paid deals with fees and deliverables: use `write-influencer-outreach` and `influencer-contract-and-usage-rights`.
- Free samples requested through TikTok Shop's affiliate center: use `tiktok-shop-creator-affiliate-outreach`.
- Gifts to customers to drive reorders: use `post-purchase-repeat-sequence`.

## What you need

Required:

1. **Shortlist** with fit scores and who has agreed to receive product, from `find-and-vet-influencers` and `write-influencer-outreach`.
2. **Landed cost per unit** and packaging cost, from `calculate-landed-cost-per-unit`.
3. **Shipping cost** per parcel by zone or pincode band.
4. **Gross profit per order** for the gifted product, from `build-sku-profit-sheet`.
5. **Stock**: units free for gifting without risking orders.

Optional: past gifting results; what a comparable UGC video costs the store to buy (for valuing content).

Access: building codes, links and draft orders needs draft access (level 2) in Shopify. Creating real zero-value orders, sending product and messaging creators each need the client's yes.

## Before you start: the gates

1. **Round cost fits cash.** Total cost = units x (landed cost + packaging + shipping) + any TDS or tax handling. Pass when the client approves that total as cash out. Fail: cut the list.
2. **Gross profit per order known.** Needed for the payback sheet. Fail: run `build-sku-profit-sheet`.
3. **Disclosure ready.** A gift is a material connection, even unsolicited, so any post needs a label: US plain words in the post [ORG-6405], India an ASCI label [ORG-6406]. Fail: no dispatch without the note in step 4.
4. **Product works on first use.** If the benefit takes weeks, the ask and timing must allow it (step 3).

## Steps

### 1. Choose the round type

| Type | Who | Units | When |
|---|---|---|---|
| Wide seeding | 50 to 100 nano and micro | 1 each | Cheap product, broad buyer, need many posts |
| Tight seeding | 15 to 30 micro and mid with high fit | 1 to 2 each | Considered purchase, need quality reactions |
| Pre-pay test | 10 to 20 high-fit creators | 1 each | Trying creators before paid deals |

Wide seeding suits products cheap enough to send in volume [ORG-0009]. Expect most recipients not to post: one brand found about 2 in 100 gifted recipients made good content unprompted, and moved those into paid work [ORG-0033]. Plan the round on that kind of rate, not on hope.

### 2. Gift only to people who opted in

Ask first ("Can I send you one to try?") and send only to yeses. Free product earns more when the person asked for it and gave a little effort, such as filling an address form [OFF-0057]. Unrequested parcels mostly get ignored.

### 3. Set the ask

Default: **no posting obligation.** Say: "No need to post. If you love it and share it, please tag us and label it." This keeps goodwill and is honest.

Add a light ask only when the product is cheap and the round is wide: "If you post, a 15 to 30 second video showing it in use helps us most." For slow-benefit products (skincare, supplements), ask for a check-in at day 14 to 21, not a day-1 review. Never ask for a positive review or tie anything to a positive opinion; endorsements must reflect honest views and real use [MCR-6025].

### 4. Write the gift note

One card in the box and the same text in a message:

- Thanks and why you picked them (one line).
- How to use it for the best result (two lines).
- "No posting needed. If you share, please label it 'Gifted' or 'Ad' at the start, and tag us."
- Their personal code and link (step 5).
- Who to message with questions.

Keep unboxing cost sensible; a branded moment can cost under 0.50 US dollars per parcel at the basic level [CXP-0008].

### 5. Set up tracking per creator

- **Code:** one per creator (STORE-NAME10), with a small buyer discount only if the profit sheet allows it. Codes leak to coupon sites, so treat code sales as a floor, not the full picture.
- **Link:** a UTM link per creator built with `set-up-utm-tracking-for-all-channels` (utm_source = platform, utm_medium = creator, utm_campaign = round name, utm_content = handle).
- **Survey:** add "a creator I follow" with a free-text name to the post-purchase survey; channel shares in survey answers are a check on what codes miss [MEA-0045].
- **Posts log:** a sheet where the team logs every post found (link, date, views at 7 days).

### 6. Dispatch and follow-up calendar

- Day 0: dispatch, tracking number sent.
- Delivery day + 3: "Did it arrive OK? Any questions on using it?" Nothing about posting.
- Day 21: one check-in for slow-benefit products.
- Day 30: first payback read.
- Day 60: final verdict and rebook list.

### 7. Read payback

At day 30 and day 60, for the round and per creator:

- **Cost:** units x (landed cost + packaging + shipping) + any fees.
- **Sales profit:** attributed orders (codes + links + survey names) x gross profit per order.
- **Content value:** for each post the store has written rights to reuse, what a comparable UGC video would cost to buy. A post that beats about 5 times the account's usual views has earned a place in ads [ORG-0035].
- **Verdict:** paid off when sales profit + content value is at or above cost. Practitioner default: if sales profit alone covers at least half the cost and content fills the gap, repeat the round type.

Rebook list: creators who posted, drew good comments or sales, and labelled correctly go to paid deals via `write-influencer-outreach`.

### 8. India and US notes

- **India:** send prepaid, never COD. Use a courier that covers the creator's pincode reliably. Products creators keep can fall under Section 194R TDS at 10%; log the value per creator per financial year and check the threshold with the accountant [FIN-6423]. Ask health and nutrition creators not to give advice unless they hold and state a qualification [ORG-6420].
- **US:** a gifted post counts as an endorsement even if the creator was not asked to post, so the label request in the note matters [ORG-6405]. Reposting a creator's video in ads needs a written licence; organic tagging does not give it.

## Checks before you hand it over

- Every recipient said yes to receiving the gift.
- The ask says posting is optional and never asks for a positive review.
- Every parcel has a note with the label request and a personal code and link.
- Total round cost is shown and approved as cash out.
- Payback rule (sales profit + content value against cost) is written down before dispatch.
- India parcels are prepaid and logged for TDS.
- No dispatch, order or message happened without the client's yes.

## Output

**One-screen summary:** round type, number of creators, units, total cost, expected posting rate used for planning, payback rule and the two dates it gets read.

**Recipient sheet:** Creator, Handle, Tier, Fit score, Opted in (date), Units, Unit cost, Packaging, Shipping, Total cost, Code, UTM link, Dispatch date, Delivered date, Posted (Y/N, link), Label used (Y/N), Views at 7 days, Attributed orders, Gross profit, Content reuse right (Y/N), Rebook (Y/N).

**Gift note:** full text, in each language used.

**Calendar:** the five dated touchpoints above.

**Payback tab:** Round cost, Sales profit, Content value, Total value, Verdict at day 30, Verdict at day 60.

## Common mistakes

- **Sending to people who never asked.** Step 2 gifts only to opted-in creators.
- **Hidden strings.** Step 3 removes the posting obligation and never asks for positive reviews.
- **No tracking.** Step 5 gives every creator a code, a link and a survey option before dispatch.
- **Judging on views.** Step 7 judges on profit plus reusable content.
- **Counting content you cannot use.** Only posts with written reuse rights get a content value.
- **COD gifts in India.** Step 8 sends prepaid only.

## Sources

- ORG-0009: seeding at scale suits cheap products.
- ORG-0033: about 2 in 100 gifted recipients make good content unprompted.
- OFF-0057: free product pays when people request it.
- MCR-6025: endorsements must be honest and from real use.
- CXP-0008: unboxing cost bands per order.
- MEA-0045: post-purchase survey as a channel check.
- ORG-0035: posts with about 5 times usual views belong in ads.
- ORG-6405: FTC disclosure including free products.
- ORG-6406: ASCI labels; unsolicited gifts count.
- ORG-6420: ASCI health influencer qualifications.
- FIN-6423: India TDS on products creators keep.

What makes this skill ours: the payback rule (sales profit plus reusable content against full landed cost) is set before a single parcel ships; gifts go only to creators who asked and carry no posting obligation, which keeps reactions honest and legal; the plan assumes a realistic posting rate instead of hoping for one; and India parcels are prepaid and logged for TDS.
