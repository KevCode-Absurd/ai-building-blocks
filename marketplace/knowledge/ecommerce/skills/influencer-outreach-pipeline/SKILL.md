---
name: influencer-outreach-pipeline
description: "Runs creator outreach from a vetted shortlist to a signed deal and a correctly labelled post: send batches from the owner's own email or DMs after the owner's yes, a fixed follow-up rhythm, one tracking sheet with a stage for every creator, gifting and paid terms capped by profit per order, a short deal summary for each yes, and a disclosure check on every live post against FTC rules in the US, ASA and CMA rules in the UK, and the rules of each creator's market. Use after a shortlist and message pack exist, when outreach is spread across team inboxes and nobody knows who replied, or when posts went live without labels."
---

# Influencer outreach pipeline

**You get:** a pipeline sheet with one row per creator and a stage for each (drafted, approved, sent, follow-up 1, follow-up 2, replied, terms agreed, shipped, posted, label checked, results), a send plan in batches, a deal summary for every yes, and a weekly one-screen status.

## When to use

- A vetted shortlist and message pack exist and the store is ready to start sending.
- Messages went out from several team accounts and replies are lost.
- Creators said yes but nobody wrote down what they agreed to post, when, or for what.
- Posts went live without a clear label, or with only a platform tag.

## Not for

- Finding and vetting creators: use `find-and-vet-influencers`.
- Writing the first messages, follow-ups and reply templates: use `write-influencer-outreach`. This skill sends and tracks them.
- The full contract and usage rights: use `influencer-contract-and-usage-rights`.
- Gifting at scale with no posting ask: use `plan-influencer-gifting-campaign`.
- Measuring sales from each creator: use `track-creator-sales`.
- TikTok Shop affiliate invites: use `tiktok-shop-creator-affiliate-outreach`.

## What you need

Required:

1. **Shortlist** with fit score, median views, suggested deal and profit cap, from `find-and-vet-influencers`.
2. **Message pack** for each creator, from `write-influencer-outreach`.
3. **Gross profit per order** for the product, from `build-sku-profit-sheet`.
4. **Sender:** the named person and the accounts that send (business email, Instagram, YouTube), plus a postal address for email footers.
5. **Round budget:** cash for fees and units for gifts, and the stock to back a good post.

Optional: a discount code or affiliate link per creator, a short media kit, past creator results.

Access: the owner connects their own email, DM and sheet tools; the agent never asks for passwords. Level 1 reads past threads. Level 2 saves drafts and updates the sheet. Level 3 sends approved messages from the owner's accounts. Every send batch needs the owner's yes in chat; every payment is made by the owner.

## Before you start: the gates

1. **Every offer under its cap.** Pass: each creator's fee or commission plus gift cost is at or under expected orders times gross profit per order. Fail: change the deal type before sending.
2. **Disclosure line in every offer.** Pass: each message pack states the label the creator must use where they post. Fail: do not send.
3. **Claims list agreed.** Pass: creators get a short list of what they may and may not say, from `product-claims-profile`. Fail: write it first. In some markets, creators who give health, nutrition or money advice must hold and state relevant qualifications; others may show the product but not advise.
4. **Allowed contact routes only.** Pass: business email or DM routes the creator lists publicly. Fail: no scraped personal numbers, no bulk WhatsApp broadcasts.

## Steps

### 1. Build the sheet before the first send

One tab, one row per creator. Stages run left to right, and every cell that moves a creator forward gets a date. Columns are in the output section. Merge any past threads from team inboxes first, so nobody is messaged twice.

### 2. Send in batches

- Batch of 10, best fit first. Show the owner the 10 names, the channel and the exact text, and send only after their yes.
- Send from one named person per creator. A creator should never hear from two people at the store.
- Email rules: a real sender name, a subject line that says what the email is about, the store's postal address, and a plain line on how to opt out. Honour an opt-out at once and mark the row closed. US law on commercial email has no exception for business-to-business messages, and opt-outs must be processed within 10 business days.
- DMs: one message, no attachments in the first touch, no links except a product page if asked.

### 3. Follow up on a fixed rhythm

| Day | Action |
|---|---|
| 0 | First message (batch approved) |
| 3 or 4 | Follow-up 1: one new reason, under 50 words |
| 10 or 11 | Follow-up 2: polite close, the offer stands |
| 11+ | Mark closed, no reply. Note one line on why it may have failed |

Practitioner default; check reply rates per batch and change one thing at a time (the hook, the offer or the channel).

Send the next batch when the last one reaches day 4, so replies stay manageable.

### 4. Handle replies the same day

- **Yes:** move to terms (step 5). Ask for audience insight screenshots dated within 30 days if the deal includes a fee.
- **Rate question:** answer with the number from the pack. If they quote above the cap, offer product plus commission or a floor-or-commission deal once.
- **No:** thank them, mark closed, and add a check-back date next season if they were polite and a good fit.
- **Agency or manager:** move the row to the manager's email and restart terms there.

### 5. Agree terms in one summary

Before anything ships or anyone is paid, write and send (after the owner's yes) a short deal summary:

```
Creator: [name, handle, platform]
Deal: [gift only / gift + [x]% commission / flat fee [amount] / floor or commission]
Deliverables: [number] [format] on [platform], live by [date]
Must show: [the product in use, the one approved point]
Must not say: [claims list]
Label: [exact wording and placement for their market]
Code or link: [code, UTM link]
Usage rights: [none / organic repost / paid ads for [days]], priced as a flat fee
Payment: [when and how, paid by the owner]
Product: [units, ship date, tracking]
```

Then use `influencer-contract-and-usage-rights` for the agreement. Creators who keep products may need tax paperwork in some countries; flag it to the owner.

### 6. Ship and confirm

Log the parcel and tracking. Message the creator on delivery day with the summary in one line and the label wording again.

### 7. Check every post for the label

Open each live post within 24 hours.

**US (FTC):**
- The relationship is stated in the post itself, in plain words ("Ad", "Sponsored", "Thanks to [brand] for the free product"), not hidden in hashtags, at the end, behind "more", or only in the bio.
- Images and Stories: the label is on the image, long enough to read.
- Video: the label is both said and shown on screen in the video.
- Live: repeated through the stream.
- A platform tag alone is not enough. Creators outside the US who reach US buyers follow the same rules. Free products count as a relationship.

**UK (ASA and CMA):**
- A clear label such as "Ad" or "Advert", or the platform's paid partnership tag plus a clear label.
- Upfront and prominent, before people engage, not buried in hashtags, not only in the bio.
- On a picture or video with no caption, the label is laid over the content.
- Video and Stories: the label shows long enough to read, on every Story frame that is part of the ad.
- Live streams: said at the start and repeated through the stream, and in the caption if the video stays up.
- Audio and podcasts: said at the start and at each ad read.
- In the language of the post.
- Free products, gifts, discounts and affiliate links all count as a relationship.

**EU and other markets:**
- Follow the same pattern: a clear label, up front, in the language of the post. Check the local ad rules; some countries, such as France, have their own influencer law with set labels, and health, nutrition and money advice may need stated qualifications.
- Virtual influencers should also say they are not a real person.

The brand shares the responsibility in every market. If a post misses, draft a polite fix request the same day (after the owner's yes) and log it; if it is not fixed, ask for the post to be edited or removed and do not pay further fees.

### 8. Weekly status

Every week: sent, replied, reply rate by batch, yes count, terms agreed, posted, labels passed, cash committed against budget, and the next batch. Hand posted content to `track-creator-sales` and winning posts to `run-creator-partnership-ads`.

## Checks before you hand it over

- Every creator is on one row with one owner and a date in every stage reached.
- No message went out without the owner's yes on that batch.
- Follow-ups stop at two; opt-outs are closed at once.
- Every yes has a deal summary with deliverables, dates, label wording and usage rights.
- Every fee or commission sits under that creator's profit cap.
- Every live post has a pass or fix-requested label check for its market.
- Payments are made by the owner, not the agent.

## Output

**One-screen weekly status:** batch results, yeses, posts live, label pass rate, cash committed against budget, next batch names.

**Pipeline sheet** (`creator-pipeline.csv`):

| Creator | Handle and platform | Tier | Market | Store contact | Channel | Offer and cap | Drafted | Approved | Sent | Follow-up 1 | Follow-up 2 | Reply | Terms agreed | Shipped and tracking | Live date and link | Label check | Fix requested | Code or link | Orders | Next step |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Deal summaries:** one block per yes, in the format from step 5.

## Common mistakes

- **Many senders.** Step 2 gives every creator one contact at the store.
- **Chasing forever.** Step 3 stops after two follow-ups.
- **Terms in a DM thread.** Step 5 writes one summary before anything ships.
- **Trusting the platform tag.** Step 7 checks the label in the post itself.
- **Label not on screen long enough.** Step 7 checks each market's rules on how long the label shows.
- **Paying before the label passes.** Step 7 holds further fees until it is fixed.

## Sources

- FTC, Disclosures 101 for Social Media Influencers: https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
- FTC, CAN-SPAM Act compliance guide for business: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- ASA and CMA, Influencers' guide to making clear that ads are ads: https://www.asa.org.uk/resource/influencers-guide.html

What makes this skill ours: the pipeline starts only from a vetted shortlist and a profit-capped offer; every send is a batch the owner approved, from the owner's own accounts; terms are written once before anything ships; and every post is checked against the label rules of the creator's market, including label timing in video, before any further fee is paid.

## Selling in India

ASCI rules for Indian creators:
- Permitted labels: Advertisement, Ad, Sponsored, Collaboration, Partnership, Employee, Free gift, Affiliate, or the platform's paid partnership tags. Upfront, not buried in hashtags or only in the bio; laid over content with no caption.
- Video label time: at least 3 seconds for videos of 15 seconds or less; one third of the length for videos over 15 seconds and under 2 minutes; the whole section about the brand for videos of 2 minutes or more.
- Live streams: said at the start and the end. Audio: said at the start, the end, and before and after each break.
- In English or the language of the post. Health, nutrition and money advice: qualifications stated upfront. Virtual influencers say they are not a real person.
- Creators who keep products may need tax paperwork.

Source: ASCI, Guidelines for Influencer Advertising in Digital Media (with addenda on health and financial influencers): https://www.ascionline.in/social/wp-content/uploads/2025/04/ASCI-Influencer-Guidelines.pdf
