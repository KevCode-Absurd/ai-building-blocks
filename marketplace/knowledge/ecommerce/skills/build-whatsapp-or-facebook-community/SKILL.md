---
name: build-whatsapp-or-facebook-community
description: "A buyer community for a store on WhatsApp (Community, group or channel) or a Facebook Group, set up with a written purpose, joining rules, house rules, a moderator rota, a weekly post rhythm, member perks that cost less than they earn, and a 90-day test that compares members' repeat orders with similar buyers who did not join. Picks the platform by market (WhatsApp first in India, Facebook Groups often in the US), keeps joining opt-in only, and plans regional-language posts and COD-to-prepaid nudges for India. Use when the store has repeat-purchase products and wants more second and third orders, a place for launches and feedback, or a home for its best customers."
---

# Customer community on WhatsApp or Facebook

**You get:** a community ready to open: platform choice, purpose line, join flow, house rules, moderator rota, a 4-week post calendar, member perks with their cost, and a 90-day test sheet that shows whether members reorder more than similar non-members.

## When to use

- The store sells things people rebuy or collect (consumables, refills, fashion drops, hobby kits) and second orders are the weak point.
- Loyal buyers keep messaging the brand with photos, tips and questions and there is nowhere to put them.
- Launches need a warm group for first looks and feedback before the public sees them.
- In India, buyers already live on WhatsApp and the store wants a channel that is not one-to-one support.

## Not for

- WhatsApp Business API setup, templates and broadcast campaigns: use `set-up-whatsapp-marketing`.
- Points, tiers and rewards: use `design-loyalty-program`.
- Rewards for bringing friends: use `design-referral-program`.
- Customer support routing and response times: use `set-up-helpdesk-and-response-times`.

## What you need

Required (read access, level 1):

1. **Shopify order export, last 12 months**, with Customer ID, Created at, Total, Line items, Payment method (COD or prepaid in India), Shipping state or city.
2. **Repeat facts**: share of buyers with a second order, median days between first and second order. Use `cohort-repeat-and-ltv-analysis` if not known.
3. **Gross profit per order** by product, from `build-sku-profit-sheet`.
4. **Moderator capacity**: who will run it and how many hours a week.
5. **Opt-in list or route**: customers who have agreed to be contacted, and on which channel.

Optional: top reviews and photos, upcoming launches, festival or seasonal dates, the store's WhatsApp Business number.

If repeat facts are missing, compute them from the order export before planning perks. Creating the group, writing the welcome post and drafting invites need draft access (level 2). Sending any invite to customers, posting and opening the group need the client's yes.

## Before you start: the gates

1. **Repeat potential.** Pass when at least one product is rebought or collected. Fail: a community for a one-time purchase rarely pays; suggest a post-purchase email flow instead.
2. **Gross profit per repeat order is known**, so perks can be priced. Fail: compute it first.
3. **Moderator hours.** Someone named can give at least 3 to 5 hours a week and reply within one working day (practitioner default, test it). Fail: do not open; an unanswered group hurts trust.
4. **Consent.** Only people who chose to join are in. Never bulk-add buyers from the order export: it breaks WhatsApp's rules, gets numbers blocked and breaks privacy law (India's Digital Personal Data Protection Act needs clear consent; no legal ruling here). Fail: build an opt-in route first.
5. **Privacy of numbers.** In WhatsApp, check in the app who can see members' phone numbers in the format you choose, and tell members before they join. Fail: use an announcement-only format or a Facebook Group.

## Steps

### 1. Choose the platform

| Market and buyer | Pick | Why |
|---|---|---|
| India, most buyers on WhatsApp | WhatsApp Community with an announcement group plus 1 or 2 topic groups | Buyers already there; announcements reach everyone |
| India, very large or one-way updates | WhatsApp Channel plus a small buyers group | Channel for drops, group for the top buyers |
| US or global, buyers on Facebook | Facebook Group with membership questions | Search, threads, member posts |
| Small, high-value buyers | Private group of 50 to 200 top customers | Close feedback loop |

Check WhatsApp's current group and community size limits in the app before planning, since they have changed over time.

### 2. Write the purpose and who it is for

One line a member would repeat: "For people who [use the product] to [do the job] better." Choose who can join: verified buyers only is the default, because it keeps the group about real use and makes perks safe to give. Owned channels like this sit beside one main social platform and email, not instead of them [ORG-0022].

### 3. Write the join flow

- **Invite points:** post-purchase email or WhatsApp utility message after delivery, the order status page, a QR card in the box, a story on Instagram.
- **Ask:** one line on what members get, one line on the rules, and a join button.
- **Facebook Group:** 2 or 3 membership questions, one of them the order number or email, and agreement to the rules.
- **WhatsApp:** invite link sent only to buyers who asked, or shown in the box and on the order page.

### 4. Write the house rules

Six to eight short rules, pinned: purpose; be kind; no selling or links by members; no spam or forwards; no personal data in posts; no medical, legal or money advice, and product questions get answers from the team; photos and videos you post may be reshared only after we ask you; how to leave. Add what moderators will remove and that complaints go to support with a link.

### 5. Set the moderator rota

Name the owner and a backup, the hours they check, the reply target, and what they escalate (order problems to support, safety or abuse to the client). Use `comment-and-dm-reply-rules` for ready answers.

### 6. Build the weekly rhythm

Four posts a week to start (practitioner default, test it):

| Day | Post | Purpose |
|---|---|---|
| Monday | How-to or tip for getting more from the product | Use, so they run out and rebuy |
| Wednesday | Question or poll to members | Feedback and voice of the buyer |
| Friday | Member showcase, shared only with permission (see `repost-customer-content-with-rights`) | Proof and belonging |
| Once a month | First look at a launch, or a founder Q and A | Reason to stay |

Most posts give value. Content that serves members without selling builds loyalty: customers who engaged with one retailer's off-site content showed 3.5 times the lifetime value of ad or affiliate customers [ORG-0031]. Offers come at most once a fortnight.

### 7. Design member perks

Prefer early access, restock alerts, member-only bundles and service over deeper discounts. Price each perk: cost per member x members who use it must be below the extra gross profit you expect from members' repeat orders. Expiring points or credits can bring people back; one Indian brand used coins that expire 60 days after purchase, with reminders [CXP-0019]. A fixed weekly budget to fix bad experiences and surprise top buyers is a proven pattern [CXP-0022]. Weight feedback from the most loyal and the most unhappy members over the middle [AVT-0021].

### 8. Plan the first 30 days

Week 1: invite the top 50 to 100 buyers by gross profit first, then open wider. Week 1 posts: welcome, rules, introductions prompt. Weeks 2 to 4: the rhythm from step 6, one launch first look. Keep a log of questions; they feed product pages and FAQs.

### 9. Set the 90-day test

Stage it against a control: start with the top buyers, compare their 90-day reorder rate with similar buyers who were not invited, and widen only if members beat the control [WLD-0007]. Track: joins, share active each week, member reorder rate at 30, 60, 90 days, control reorder rate, gross profit difference, perk cost, moderator hours. For stores under about 10 to 20 million a year, the first-to-second order step is usually where growth is held back [EML-0053], so judge the community mainly on that.

### 10. India and US notes

- **India:** post in the language members write in; Hindi or a regional language group can sit beside an English one. Announce prepaid-only perks to move COD buyers to prepaid where `returns-and-rto-cost-analysis` shows COD returns cost more. WhatsApp marketing messages sent through the API follow template rules; automated journeys beat broadcasts by a wide margin [EML-0048], so do not turn the group into a broadcast list. Festival first looks fit well.
- **US:** Facebook Groups suit hobby, parenting, fitness and home buyers; use membership questions and post approval for the first month. Keep SMS separate; group membership is not SMS consent.

## Checks before you hand it over

- Platform choice states the market reason.
- Join flow is opt-in only; no bulk adds from order data.
- House rules are 6 to 8 lines and include the reshare-permission rule.
- A named moderator and backup have hours and a reply target.
- Four weeks of posts are written, mostly giving value, with offers at most once a fortnight.
- Every perk has a cost and the gross profit it must beat.
- A control group and 90-day reorder test are set up before opening.
- Nothing is sent to customers without the client's yes.

## Output

1. **One-screen summary:** platform and why, purpose line, who can join, moderator, perks and cost, the 90-day test and what counts as a win.
2. **Setup sheet**: Platform, Name, Description, Purpose line, Join questions, Invite points, Rules (pinned text), Moderator, Backup, Hours, Reply target.
3. **Post calendar, weeks 1 to 4**: Date, Day, Post type, Text, Media, Language, Link (if any), Owner.
4. **Perk sheet**: Perk, Who gets it, Cost per use, Expected uses, Total cost, Gross profit it must beat.
5. **Test sheet**: Cohort (member or control), Buyers, Reorders at 30, 60, 90 days, Reorder rate, Gross profit, Perk cost, Net difference.

## Common mistakes

- **Adding every buyer to a WhatsApp group.** The consent gate makes joining opt-in only.
- **Opening without a moderator.** The hours gate stops it.
- **Turning the group into an offer feed.** Step 6 keeps offers to once a fortnight.
- **Discount perks that eat margin.** Step 7 prices every perk against gross profit.
- **Calling it a success on member count.** Step 9 judges on reorder rate against a control.
- **Resharing members' photos without asking.** Rule 4 and the reshare skill handle permission.

## Sources

- AVT-0021: weight the most loyal and most unhappy customers' feedback.
- CXP-0019: expiring loyalty coins with reminders in India.
- CXP-0022: a fixed weekly budget to fix and surprise.
- EML-0048: WhatsApp journeys beat broadcasts in India.
- EML-0053: first-to-second order is the usual growth limit.
- ORG-0022: one hero platform plus owned channels.
- ORG-0031: content-engaged customers show higher lifetime value.
- WLD-0007: stage retention bets against a control group.

What makes this skill ours: the community has to prove itself on reorder rate against a control group, not on member count; every perk is priced against gross profit; joining is strictly opt-in with phone-number privacy checked; and India gets WhatsApp formats, language groups and COD-to-prepaid perks.
