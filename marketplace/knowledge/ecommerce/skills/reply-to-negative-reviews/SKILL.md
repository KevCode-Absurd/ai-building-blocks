---
name: reply-to-negative-reviews
description: "Public replies to the store's one to three star reviews on its own site, Google, marketplaces and social pages, each one written to fix the buyer's problem, show future buyers how the store behaves, and follow each platform's rules. Sorts reviews by type (product fault, delivery, expectation gap, service, fake or abusive), writes a reply of under 80 words per review with a private follow-up, decides when to report a review instead, and logs the cause so it gets fixed. Never offers anything for a changed or removed review. Use when bad reviews sit unanswered, replies sound defensive, or a run of complaints follows a bad batch or carrier problem."
---

# Reply to negative reviews

**You get:** a reply sheet with a public reply (under 80 words) and a private follow-up for every unanswered one to three star review, a report list for reviews that break platform rules, and a cause log, ready for the client to approve and post.

## When to use

- One to three star reviews sit unanswered on the store, Google or a marketplace.
- Existing replies argue with buyers or paste the same apology.
- A defective batch or carrier failure is producing a cluster of bad reviews.
- Before a launch or sale, when new buyers will read the reviews closely.

## Not for

- Getting more reviews: use `build-review-collection-system`.
- Calming a buyer still in an open ticket: use `handle-angry-customer-escalations` first, then reply in public.
- Amazon reviews and seller feedback rules: follow `get-early-amazon-reviews` for what Amazon allows sellers to do.
- Turning reviews into ad angles: use `mine-ad-angles-from-reviews`.

## What you need

Required (read access, level 1):

1. **Reviews export**: platform, date, rating, reviewer name, text, photos, order number if linked, existing reply. From the review app's CSV, Google Business Profile, marketplace seller reports or a manual copy.
2. **Order and ticket records** for each reviewer you can match: what they bought, delivery scans, contacts, refunds.
3. **Live policies**: returns, refunds, warranty, shipping.
4. **Five real brand lines** for voice.

Optional: product fault notes from the warehouse, carrier issue dates.

Posting replies needs publish access (level 3) to each platform, or the client posts from the sheet. Either way the client approves every public reply before it goes up; replies are public and stay there.

## Before you start: the gates

1. **Platform rules.** On Google, a business may not offer incentives for reviews or for removing a negative one, may not discourage negative reviews and may not ask only happy customers [CXP-6300]. In the US, the FTC bans using threats or intimidation to get a review removed or changed, and a store may hide reviews on its own site only under rules applied equally to good and bad ones [CXP-6301]. Fail: any planned step that breaks these is dropped.
2. **The buyer's problem first.** If the reviewer has an open problem, solve it privately before or alongside the public reply.
3. **Facts checked.** Each reply states only what the order record shows. If you cannot match the reviewer to an order, the reply asks them to get in touch rather than guessing.
4. **Privacy.** No order numbers, addresses, health details or purchase history in a public reply.

## Steps

### 1. Pull and sort

Collect every one to three star review without a reply, newest first. Tag each with one type:

| Type | Sign | Reply goal |
|---|---|---|
| Product fault | Broke, leaked, defective, wrong size made | Own it, fix it, say what changed |
| Delivery | Late, lost, damaged in transit | Own the delivery, fix it, no carrier blame |
| Expectation gap | "Smaller than I thought", "did not work for me" | Thank, explain who it suits, offer the return route |
| Service | Ignored, rude, slow refund | Apologise for the service, fix it, name the change |
| Not a buyer or fake | No matching order, competitor, spam | Report under platform rules; short neutral reply only if it stays up |
| Abusive | Slurs, threats, personal attacks | Report; do not engage |

### 2. Fix the problem privately first

For each review with a matched order and an open problem, act through the support desk: replace, refund or explain, within the support caps. Low effort for the buyer matters more than a grand gesture [CXP-0009]. Do not expect the fix to turn the reviewer into a fan; a recovery that beats expectations is rare [CXP-0011]. The aim is a fair outcome other readers can see.

Never ask the buyer to change or remove the review in exchange for the fix. Once the problem is solved, you may tell them it is solved; whether they update the review is their choice.

### 3. Write the public reply

Write for the next buyer reading, not just the reviewer. Under 80 words. Four parts:

1. **Thank and name the issue** in plain words. "Thank you for telling us the lid cracked in transit."
2. **Own our part** once, without excuses or blaming the carrier, the customer or a "glitch".
3. **Say what we did or will do**, as a fact: "We have sent a replacement" or "Please reply to the email we sent today so we can sort a replacement."
4. **Say what changed** if it applies: "We have moved to a sturdier box since March." Only if true.

Sign with a first name and role. Vary the wording; the same pasted reply on 30 reviews reads as fake. Bare, anonymous-looking replies hurt trust the same way anonymous reviews do [LPG-0037].

For expectation gaps, explain who the product is for and who it is not for, kindly. This helps the next buyer pick right and cuts returns.

Never argue facts in public. If the reviewer is wrong (for example, says they never got a refund that shows processed), reply: "We have sent you the details by email; please check and reply there if anything is still wrong."

### 4. Report what breaks the rules

Use each platform's own reporting tool for reviews that are fake, off-topic, from a competitor, abusive or contain private data. Record the report date and outcome. Do not report a review just because it is negative; that does not meet platform rules and on the store's own site, removing it can break US rules [CXP-6301].

### 5. Watch for clusters

If three or more reviews in 30 days name the same fault, stop replying one by one. Flag a cluster to the owner with the dates and order numbers, and send it to `turn-support-tickets-into-insights`. Then write one honest reply pattern for the cluster that names the fix and its date.

### 6. Post, then follow up

After client approval, post the replies, newest and most-read first (store product pages, then Google, then marketplaces). Reply to new negative reviews within 2 business days (practitioner default, test it). Recheck reported reviews after 14 days.

### 7. Why it matters beyond the reviewer

Reviews and the replies under them are what buyers and AI assistants read about the store; assistants often cite review profiles, so fixing those sources pays [AEO-0014]. A clear, fair reply under a one star review can reassure buyers more than another five star review.

### 8. India and US notes

- **India:** many reviews arrive in Hindi, Hinglish or a regional language; reply in the same language and script when the store can do so accurately. Complaints about COD delivery or failed delivery attempts are common; own the delivery and offer the next step. Keep phone numbers out of public replies; point to the store's support WhatsApp or email.
- **US:** do not use review replies to push sales or discount codes, and never ask an employee or relative to post counter-reviews; insider reviews must be disclosed under FTC rules.

## Checks before you hand it over

- Every unanswered one to three star review has a type and either a reply or a report.
- Each reply is under 80 words, has the four parts, and no two replies are identical.
- No reply contains private data or blames the buyer, carrier or a glitch.
- No step offers anything for changing or removing a review.
- Reports are only for reviews that break platform rules.
- Clusters of three or more of the same fault are flagged to the owner.
- Every reply is approved by the client before posting.

## Output

**One-screen summary:** count of open negative reviews by type and platform, clusters found, and replies ready to post.

**Reply sheet:** Platform, Review date, Rating, Reviewer, Review excerpt, Type, Matched order (yes or no), Private action taken, Public reply, Word count, Approved (yes or no), Posted date.

**Report list:** Platform, Review, Rule broken, Report date, Outcome.

**Cause log:** Fault, Reviews, Date range, Owner, Fix, Fix date.

## Common mistakes

- **Defending instead of fixing.** Step 2 fixes privately first; step 3 owns it.
- **Copy-paste replies.** Step 3 bans identical wording.
- **Trading credit for a removed review.** Gate 1 and step 2 forbid it.
- **Reporting honest bad reviews.** Step 4 reports only rule breakers.
- **Missing the pattern.** Step 5 turns clusters into a product or shipping fix.
- **Sharing order details in public.** Gate 4 keeps them private.

## Sources

- AEO-0014: AI assistants cite review profiles; fix those sources.
- CXP-0009: low effort beats delight in service.
- CXP-0011: recovery that beats expectations is rare.
- CXP-6300: Google bans incentives, gating and discouraging bad reviews.
- CXP-6301: FTC review rule on suppression and equal moderation.
- LPG-0037: anonymous-looking proof reads as fake.

What makes this skill ours: replies are written for the next buyer and sorted by review type; the problem is fixed privately before any public word; nothing is ever traded for a changed review, under Google and FTC rules; and clusters become a product or shipping fix rather than more apologies.
