---
name: email-copy-from-store-history
description: "Writes subject lines, preview text, openers, bodies and calls to action for a store's campaign or flow email, using the patterns that actually earned clicks and orders in the store's own send history rather than generic formulas. Pulls past campaigns, tags each subject and body by pattern, finds which patterns beat the store's median on click rate and revenue per recipient (not opens, which privacy features inflate), then drafts the email and runs a spam-trigger, compliance and claim check on every line. Ends with a split test sized for the list. Platform-neutral, Klaviyo names as the example. Use for any campaign or flow email once the store has a few months of sends."
---

# Email copy from the store's own history

**You get:** one finished email (eight subject lines, preview text, opener, body and call to action) built from patterns in the store's own send history, with a claims check table and a test plan.

Write the email the store's own data says will work, then check every line for spam triggers and claims that cannot be backed up. Klaviyo names are used as the example.

## When to use

- A campaign or flow email needs writing and the store has three or more months of sends.
- Campaign clicks have flattened and the team keeps reusing the same subject styles.
- A new writer or agency needs to learn the store's voice and what its list responds to.
- A sale, launch or restock email must be accurate on price, dates and claims.

## Not for

- Choosing which flows to build: use `email-sms-flow-plan`.
- Timing the post-purchase sequence: use `post-purchase-repeat-sequence`, then write each message here.
- Deliverability and list problems: use `email-account-health-audit`. Copy cannot fix a damaged sender reputation.
- Deep claim work on a product (health, efficacy, comparison claims): use `product-claims-profile` first.

## What you need

Required (read access, level 1):

1. **The email's job**: goal, segment, offer (or none), the one action wanted, send date.
2. **Send history**, last 6 to 12 months, per campaign: subject, preview text, send date and hour, segment, recipients, open rate, click rate, placed order rate, revenue per recipient, unsubscribe rate, spam complaint rate. From the campaign report export, or the campaign values report through an official connector. Flow message stats help too.
3. **Brand voice**: five real lines from emails or the site that the owner likes.
4. **Offer facts**: exact prices, discount, start and end date and time, exclusions, stock limits.
5. **Proof**: reviews export and any approved claims list.

Optional: the email platform's Apple privacy open filter setting, past A/B test results, top customer questions from support.

With fewer than 20 past campaigns, skip step 3's pattern ranking, write from the brief and voice, and say so. Drafting in the platform needs draft access (level 2); scheduling or sending needs a client yes.

## Before you start: the gates

1. **Gross profit per order.** Needed if the email carries a discount. Pass when the discount's gross profit per order is known from `store-meta-math` or `offer-bundle-threshold-design`. Fail: write the email without the discount, or stop and get the number.
2. **Inbox health.** If campaigns to engaged subscribers open under about 30% or click under 0.5%, the problem is deliverability, not copy [EML-0014]. Hand off to `email-account-health-audit` and say so.
3. **Data trust.** Note whether opens exclude Apple privacy opens. If not, opens are inflated and only clicks and revenue are used to judge patterns [EML-0013].
4. **Capacity.** One writer, one approver named. The approver signs off claims.

## Steps

### 1. Export and clean the history

Keep campaigns sent to similar segments; a send to 14-day engagers is not comparable with a send to the full list. Drop sends under about 1,000 recipients from the pattern work (practitioner default, test it). Note each send's day and hour.

### 2. Tag every send

Use one fixed tag list so results add up over time. One send can carry several tags.

- **Subject:** open question, curiosity gap ("the step most people skip"), plain benefit or result, deadline, offer, product name, first person or founder, number, emoji, length (under 30, 30 to 50, over 50 characters).
- **Opener (first two lines):** admission ("We got this wrong at first"), number or fact, story start, straight to the point, bold claim.
- **Body shape:** problem, sharpen, answer; before, after, how; three-review proof stack; personal founder note with a P.S.; education; product highlight; image-led.
- **Call to action:** plain action ("Shop the kit"), benefit ("Get calmer skin"), deadline, first person ("Send me the guide").

### 3. Find the store's own winners

For each tag, compare median click rate and median revenue per recipient with the store's overall median. Judge by unique clicks first [EML-0014]; use opens only as a tie-breaker when the open filter is on. Call a pattern a winner only with five or more sends and a gap bigger than the usual swing between similar sends. Write the top three and bottom three patterns in one table.

Track revenue per recipient by send type; plain-text founder emails with no product link have still driven large revenue at some brands [EML-0057], so do not assume designed emails win here until the store's data says so.

### 4. Set the email's shape

- Mix across the month: education, proof, brand or community, and product highlights in roughly equal shares, with one or two sale emails a month [EML-0016].
- One micro-topic per email [EML-0022].
- About 70% useful or entertaining content, at most 30% pitch, for frequent sends to an engaged list [LPG-0015].
- One ask and one main link destination.

### 5. Write the subject lines and preview

Write eight subjects: five from the store's winning patterns, two from untested patterns, one plain control. Each subject under about 45 characters for mobile. Preview text adds what the subject leaves out; never repeats it.

Pattern guard rails:

- A number or fact opener needs a real, sourced number; never a blank to fill with a guess.
- Deadline and scarcity subjects only when the deadline or stock limit is real.
- "You left something behind" and first-name subjects belong in triggered flows, not broadcast campaigns.
- Vague curiosity ("Quick question", "Can I be honest?") must pay off in the first line or it trains readers to ignore the store.
- Cart emails: a plain reminder first; an incentive only later and only if the gross profit check allows it.

### 6. Write the opener and body

- Open with curiosity, proof or a promise, not the category's shared pain; every brand in a category uses the same pains [LPG-0045].
- Write at grade 5 to 8 reading level [ORG-0024]: short sentences, common words.
- Proof: one review that answers one known objection, with first name and date [EML-0033].
- Offers: show whichever number is bigger, money saved or percent off [OFF-0017]. Above about 100 order value, a money-off amount tends to read bigger [OFF-0026].
- Cut AI tells such as "it's not X, it's Y" lines [MCR-0016]. Read the draft beside the five brand lines and fix anything that sounds different.
- Call to action: a verb plus the outcome ("Get my refill"), one button, repeated once at most.

### 7. Run the spam and compliance check

Inbox filters now weigh sender reputation and engagement far more than single words, but some patterns still hurt. Fail any line with:

- All caps words, more than one exclamation mark, or currency symbols in the subject.
- Phrases that read as scam bait: "act now", "100% free", "risk-free" without terms, "you've been selected", "winner".
- Image-only emails, or one image with almost no text.
- Link shorteners, or link text that does not match where it goes.
- A subject that misleads about the content. US and UK rules require honest subjects, a working unsubscribe and the sender's postal address; follow the platform's compliance guide for each market.

### 8. Run the claim check

Every claim a reader will act on gets a source line in a hidden check table:

| Line | Claim | Source | Status |
|---|---|---|---|
| "Ends Sunday midnight" | Deadline | Offer brief, date | Pass |

- Prices, discounts and "up to" figures match the offer brief exactly; "up to 50% off" needs items really at 50% off.
- Deadlines are real and kept; no resetting timers.
- Health, efficacy, "best", "number one" and "clinically proven" claims need the claims list or are cut.
- Reviews are real and unedited except for length.
- Stock claims ("only 40 left") match the store's stock that day.

Remove any line without a source; never footnote it.

### 9. Plan the test

For campaigns, split 50/50 by hand and judge on revenue [EML-0061], or on click rate when the list is under about 10,000 (practitioner default, test it). Flows need about 1,000 recipients per variant [EML-0061]. Test one thing: the subject first, then the opener. Log the result back into the tag table so the next email learns from it.

## Checks before you hand it over

- The pattern table uses clicks and revenue per recipient, with send counts, not opens alone.
- Eight subjects, each under about 45 characters, with preview text that adds new information.
- One ask, one main link, one micro-topic.
- Every claim has a source line; any discount has its gross profit check.
- Spam and compliance check passed line by line.
- Reading level checked at grade 8 or lower.
- Nothing scheduled or sent without a client yes.

## Output

1. **One-screen summary:** the email's job, the recommended subject and preview, the winning patterns it uses, and the test.
2. **Pattern table:** Tag, Sends, Median click rate, Median revenue per recipient, Versus store median, Verdict.
3. **The email:** eight subjects (marked recommended, test, control), preview text, opener, body, call to action, footer notes.
4. **Check table:** Line, Claim, Source, Status; plus spam and compliance pass or fail.
5. **Test plan:** Variant, Segment, Split, Primary metric, Read date.

## Common mistakes

- **Judging subjects by opens.** Privacy features inflate opens [EML-0013]. Step 3 uses clicks and revenue.
- **Copying formula lists.** Step 3 ranks the store's own patterns.
- **Blaming copy for an inbox problem.** Gate 2 hands that off.
- **Leading with pain.** Step 6 opens with curiosity, proof or promise.
- **Loose offer maths.** Step 8 checks every number against the brief.
- **Testing three things at once.** Step 9 tests one.

## Sources

- EML-0013: Apple privacy opens and attribution windows.
- EML-0014: judge by unique clicks; floors that flag inbox trouble.
- EML-0016, EML-0022: campaign mix and one micro-topic.
- EML-0033: reviews that answer objections.
- EML-0057: plain-text founder emails and revenue per recipient.
- EML-0061: test sizes and judging on revenue.
- LPG-0015: about 70% content, 30% pitch.
- LPG-0045: open with curiosity, proof or promise.
- MCR-0016: cut "it's not X, it's Y" lines.
- OFF-0017, OFF-0026: show the bigger discount number.
- ORG-0024: grade 5 to 8 reading level.

What makes this skill ours: the patterns come from the store's own clicks and revenue per recipient, not opens or a formula list; any discount must pass a gross profit check before it goes in; and every price, deadline, stock count and product claim is traced to a source or cut.
