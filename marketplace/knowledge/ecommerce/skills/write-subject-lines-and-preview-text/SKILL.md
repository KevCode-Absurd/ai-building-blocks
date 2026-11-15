---
name: write-subject-lines-and-preview-text
description: "Ten subject line and preview text pairs for one email send, sorted into five angles (plain, benefit, curiosity, proof, offer or deadline), each with its character count, the line in the email that pays it off, a spam and honesty check, and a pick of the recommended pair and the test pair. Every pair is checked against Gmail sender rules and US email law for misleading subjects, fake Re: or Fwd:, false urgency and claims the email cannot back. Use for any campaign or flow email that is written but needs better subject lines, or when the store keeps reusing the same three styles."
---

# Subject lines and preview text

**You get:** ten subject line and preview text pairs for one send, grouped into five angles with two pairs each, every pair with its character counts, the email line that pays it off, a pass on the spam and honesty check, and a recommended pair plus a test pair, ready to paste into the email platform.

## When to use

- An email is written and needs subject lines that earn clicks, not just opens.
- Subject lines across the last month all use the same shape ("New!", "Don't miss out").
- A test needs a fair challenger to the store's usual style.
- A flow email has run for months with its first-draft subject.

## Not for

- Finding which subject patterns won in the store's past sends: use `email-copy-from-store-history`, then use its winners here.
- Writing the email body: use the skill for that email type, such as `write-promo-campaign-email` or `write-welcome-series`.
- Planning which tests to run across the program: use `email-ab-test-plan`.
- Fixing low opens caused by inbox placement: use `email-account-health-audit`.

## What you need

Required (read access, level 1):

1. **The finished email**: body, offer terms if any, segment and send date.
2. **Sender name** the email goes out under.
3. **Recent subjects**: the last 20 campaign subject lines with click rate and revenue per recipient, from the campaign report.
4. **Brand voice**: five real lines the owner likes.

Optional: past A/B test results on subjects, the store's winning patterns from `email-copy-from-store-history`.

No access beyond read is needed. Pasting the chosen pair into a draft needs draft access (level 2); sending needs the client's yes.

## Before you start: the gates

1. **The email exists.** Subject lines are written last, from the body. Fail: write the body first.
2. **Inbox health.** If engaged campaign opens sit under about 30% or clicks under 0.5%, the problem is placement, not subjects [EML-0014]; hand off and say so.
3. **Data trust.** Apple privacy features inflate opens; judge past subjects on clicks and revenue per recipient [EML-0013].
4. **Facts.** Every number, deadline or claim a subject could use is in the email and sourced.

## Steps

### 1. Pull the payoff lines

Read the email and list the three to five lines a reader would care most about: the offer, the most useful fact, the best review, the deadline, the product news. Every subject must be paid off by one of these lines in the first screen of the email. A subject the email does not pay off is cut.

### 2. Check the sender name

The sender name is read before the subject. Use the brand name, or "[Person] at [Brand]" for plain-text founder emails. Gmail does not allow subject or message content in the display name [EML-6340]. Keep the same sender name across sends so readers recognise it.

### 3. Write two pairs per angle

| Angle | What it does | Use when |
|---|---|---|
| Plain | Says what the email is | Always; it is the control |
| Benefit | States what the reader gets | Product, how-to, new arrival |
| Curiosity | Opens a question the email answers in its first lines | Education, story, founder |
| Proof | Leads with a real review, number or result | Best sellers, new buyers |
| Offer or deadline | States the offer and its real end | Only when the email has an offer |

If the email has no offer, replace that angle with a second curiosity or benefit pair. Draw on the store's own winning patterns first where they exist.

Writing rules:

- **Length:** aim for under about 45 characters for the subject so the key words show on a phone (practitioner default, test it). Put the words that matter first.
- **Preview text:** 40 to 90 characters (practitioner default). It adds what the subject leaves out and never repeats it. Never leave it empty, or the inbox shows the first text in the email, often "View in browser".
- **Specific beats clever:** product names, real numbers, a named problem.
- **Curiosity must pay off fast:** the answer is in the first two lines, or readers learn to ignore the store.
- **Proof must be real:** a number comes from the store's data or reviews app; a quote is exact.
- **Personal tags** (first name) only in flows where the name field is reliable, with a fallback.
- **Voice:** read each pair beside the five brand lines; rewrite any that sound like a different company. Cut "it's not X, it's Y" lines [MCR-0016].

### 4. Run the honesty check

Fail any pair that:

- misleads about the content or sender; US law bans deceptive subject lines [EML-6341];
- starts with "Re:" or "Fwd:" when it is not a reply or forward [EML-6340];
- claims urgency or scarcity that is not true: no "last chance" before the last day, no "almost gone" without stock data [ADC-6147];
- implies an existing order, account problem or payment issue that does not exist ("Your order", "Action needed");
- makes a health, result or "best" claim the claims list does not support.

### 5. Run the spam check

Inbox filters weigh sender reputation and reader engagement far more than single words, and a subject that draws spam reports hurts every later send; Gmail asks bulk senders to keep spam reports under 0.10% and never reach 0.30% [EML-6340]. Fail any pair with:

- all-caps words, more than one exclamation mark, or several currency symbols;
- scam-bait phrases: "act now", "100% free", "risk-free" without terms, "you've been selected", "winner", "guaranteed";
- more than one emoji, or an emoji that replaces a word;
- misleading punctuation such as "..." hiding the point.

### 6. Pick the recommended pair and the test pair

- **Recommended:** the pair that best matches the store's winning pattern and the email's job.
- **Test:** the strongest pair from a different angle, so the test teaches something.
- **Test rules:** for campaigns, split 50/50 by hand and judge on revenue, not opens [EML-0061]; on lists under about 10,000, judge on click rate (practitioner default, test it). For flows, about 1,000 recipients per variant [EML-0061]. Test one thing: the subject, with the same preview, sender and send time.
- Log the result with the angle so the store builds its own pattern table.

### 7. Market notes

- **Other languages:** subjects in the store's main language by default; if the list has a segment in another language, write that segment's pairs in that language with the same honesty checks, never machine-translated without a native read. Show amounts in the store's currency exactly as on site.
- **US:** subject lines must match content [EML-6341]; the email must also say it is an ad and carry the postal address, which the body skill checks.

## Checks before you hand it over

- Ten pairs, two per angle, each with subject and preview character counts.
- Every pair points to the line in the email that pays it off.
- No pair repeats subject words in its preview.
- Honesty check passed: no misleading content, fake reply prefix, false urgency or unsupported claim.
- Spam check passed for every pair.
- One recommended and one test pair, from different angles, with the test metric named.
- Nothing sent without the client's yes.

## Output

1. **One-screen summary:** the recommended pair, the test pair, why each, and the metric and read date.
2. **Pairs table:**

| # | Angle | Subject | Chars | Preview | Chars | Pays off with | Honesty | Spam |
|---|---|---|---|---|---|---|---|---|
| 1 | Plain | [...] | [n] | [...] | [n] | "[line from email]" | Pass | Pass |
| 2 | Plain | ... | | | | | | |
| 3 to 10 | Benefit, Curiosity, Proof, Offer or deadline | ... | | | | | | |

3. **Sender name** to use.
4. **Test plan:** Variant A, Variant B, Segment, Split, Metric, Read date.
5. **Cut list:** pairs that failed a check and why, so writers learn the rule.

## Common mistakes

- **Writing subjects before the email.** Gate 1 makes the body come first.
- **Judging by opens.** Gate 3 and step 6 use clicks and revenue.
- **Curiosity with no payoff.** Step 1 ties every subject to a line.
- **Preview that repeats the subject.** Step 3 makes it add new information.
- **Testing two similar subjects.** Step 6 tests different angles.
- **"Re:" tricks and fake urgency.** Step 4 removes them.

## Sources

- ADC-6147: false urgency is misleading (proposed).
- EML-0013: Apple privacy opens inflate open rates.
- EML-0014: inbox trouble floors; judge by unique clicks.
- EML-0061: test sizes; judge campaigns on revenue.
- EML-6340: Gmail sender rules, spam rate and Re: prefixes (proposed).
- EML-6341: US ban on deceptive subject lines (proposed).
- MCR-0016: cut contrast lines that read as AI.

What makes this skill ours: every subject must be paid off by a named line in the email; angles are spread so the test teaches the store something; Gmail's and US law's honesty rules are checked pair by pair, not just a spam word list; and results are judged on clicks and revenue, never inflated opens.
