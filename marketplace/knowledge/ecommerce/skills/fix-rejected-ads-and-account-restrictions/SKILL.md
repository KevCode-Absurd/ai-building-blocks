---
name: fix-rejected-ads-and-account-restrictions
description: "A fix sheet for every rejected Meta ad and every restricted ad account, Page or business portfolio: what was hit and where, the most likely cause traced to the exact line, image or landing page, the fix or the decision to ask for another review, a short factual appeal text ready to paste into Account Quality, and the change to every similar ad and to the pre-launch check so it does not happen again. Never gets around a restriction with new accounts. Covers the personal attributes rule that rejects most health and beauty hooks, landing page problems, and claim rules in the US, UK, EU and other markets. Use the day an ad is rejected or an account is restricted."
---

# Fix rejected ads and account restrictions

**You get:** a fix sheet with one row per rejection or restriction (what, where, cause, fix or appeal, evidence), appeal texts ready to paste, a list of other live and draft ads with the same problem, and the rules added to the store's pre-launch check.

## When to use

- One or more ads show "Rejected" in Ads Manager.
- Account Quality shows a restricted ad account, Page, Instagram account or business portfolio.
- Ads keep getting rejected for the same policy and the owner wants it to stop.
- Delivery stopped and the cause is not budget or billing.

## Not for

- Checking new copy before launch: use `check-ad-copy-for-policy-and-claims`, which takes this skill's lessons.
- Setting up backup admins and assets so a restriction cannot stop sales: use `meta-account-backup-and-access-plan`.
- Ads that are approved but not spending: use `store-results-drop-diagnosis` or `daily-ad-account-review`.
- Legal advice on whether a claim is lawful: this skill shares general rules; a lawyer decides.

## What you need

Required:

1. **Account Quality view** (business.facebook.com, Account Quality) for every affected asset: the asset, the policy named, the date, and any "request review" option. Screenshots are fine.
2. **The rejected ads**: ad ID, media, primary text, headline, landing URL, and the policy shown in Ads Manager.
3. **Ads Manager export** of all live and draft ads (text, headline, URL), to find the same pattern elsewhere.
4. **Rejection history**, last 90 days, if the account has had others.
5. **The live landing pages**, opened on a phone.

Optional: proof files for product claims (test reports, licences, certificates), the store's business documents for verification.

If 1 is missing, ask for screenshots; never ask for a login or password. Reading needs level 1. Editing ads and sending review requests need level 2 and the client's yes for each appeal, because an appeal is a formal statement for the business.

## Before you start: the gates

1. **No workarounds.** Pass when the plan uses only edits and Meta's review process. Fail: never create a new ad account, Page or business portfolio to get around a restriction; a restricted asset cannot be used to advertise [ADC-6082], and dodging it puts every other asset at risk.
2. **The claim is true.** Pass when every claim in the ad can be proved with a document the store holds. Fail: the fix is to change the claim, not to appeal.
3. **Product is allowed.** Pass when the product is not prohibited and any restricted category (supplements with drug-like claims, alcohol, weight loss) has its required authorisations. Fail: stop and tell the client which rule applies.
4. **Account security.** Pass when no unknown people, payment methods or ads appear in the business. Fail: treat it as a hack first; secure logins with `meta-account-backup-and-access-plan`, then appeal.

## Steps

### 1. Sort what was hit

| Level | Where it shows | Effect |
|---|---|---|
| Ad rejected | Ads Manager, ad status | That ad does not run |
| Ad account restricted | Account Quality | No ads run from that account |
| Page or Instagram restricted | Account Quality | No ads with that identity |
| Business portfolio restricted | Account Quality | All its assets may stop |
| Person's profile restricted | Account Quality, Facebook | That person cannot manage ads |

Work top-down from the biggest effect: business, then account, then Page, then ads.

### 2. Find the cause in the ad

Meta's review checks images, video, text, targeting and the landing page [ADC-6082]. Check each against the most common store causes:

| Cause | What it looks like | Fix |
|---|---|---|
| Personal attributes | "Do you have acne?", "your belly fat", "Are you tired of..." | Describe the product or speak in third person: "Made for skin that breaks out" [MCR-6023] |
| Health and body claims | Cure words, guaranteed results, extreme before and after | Remove the claim, or keep only what the store can prove; an illustration with a persona headline avoids graphic images [MCR-0020] |
| Landing page | Broken link, page differs from ad, price or offer not found, pop-up blocking content | Fix the page, then resubmit |
| Misleading offer | "Free" with hidden conditions, a countdown that resets, a "was" price never charged | Match the ad to the real terms |
| Brand and people | Other brands' logos, celebrity faces without rights | Remove or get written rights |
| Format | Flexible format or enhancements building a version nobody approved [ADC-0065] | Turn off; resubmit the approved version |

If you can point to the line or image that breaks the rule, it is a fix. If you cannot, it is a request for review.

### 3. Fix or request review

- **Fix:** edit the ad. An edited ad is treated as new and reviewed again [ADC-6082]. Build the edit once, check it, then submit; repeated rejected resubmissions add to the account's record.
- **Request review:** use the option in Account Quality [ADC-6082]. One request per item; wait for the answer (review usually takes up to 24 hours for ads, longer for accounts).
- **Restricted account or business:** complete any identity or business verification Meta asks for, confirm two-factor login is on for every admin [SEC-6084], then request review once.

### 4. Write the appeal

Short, factual, no emotion, no threats. Template:

> Ad ID [ID], rejected under [policy name] on [date]. The ad promotes [product] sold at [URL]. It does not [what the policy prohibits]: the text describes the product's features ("[quote line]") and does not address the viewer's personal traits. The landing page shows the same product, price and terms. We have reviewed our other ads against this policy. Please review again.

For an account restriction:

> Ad account [ID] in business [name and ID] was restricted on [date]. We are [legal business name], selling [products] at [domain]. Our admins use two-factor login, and we found no unknown users or payment methods. We have reviewed our recent ads against the Advertising Standards and [changes made]. Please review the restriction.

Fill every bracket with facts from the inputs. The client approves each appeal before it is sent.

### 5. Clean every similar ad

Search the full export for the same pattern (for example "your", "you have", "are you", cure words, the same landing URL). List every live and draft ad that matches. Fix them before Meta finds them; each new rejection adds to the record that can lead to restriction [ADC-6082].

### 6. Stop it repeating

- Add each cause as a rule to the store's pre-launch check in `check-ad-copy-for-policy-and-claims`, with the banned pattern and a passing rewrite.
- Keep a rejection log: date, ad, policy, cause, fix, outcome.
- If ads are approved but delivery is capped by the number of ads a Page can run, that is a limit, not a policy problem; add Pages ahead of heavy launches [ADC-0045].
- For stores at high spend, a second ad account in the same verified business keeps sales going during a review; one practitioner keeps about 10% of spend on one above 250,000 a month [ADC-0038]. This is for continuity, never for dodging a restriction.

### 7. Market notes

- **UK, EU and other markets:** the UK CAP code (enforced by the ASA) and EU consumer rules require claims to be truthful and backed by evidence, and health product claims face extra law; avoid "cure" and disease words for supplements and cosmetics. Other markets have their own ad codes; check the one for each country you sell in. Ads in other languages are reviewed too; translate the fix into each language version.
- **US:** the FTC expects claims to be backed before they run, and endorsements to be real and disclosed. A rejected testimonial ad is a prompt to check the testimonial is genuine and permitted.

## Checks before you hand it over

- Every rejected ad and restricted asset has a row with its level and policy.
- Each cause points to a named line, image or page, or is marked "request review".
- No step creates a new account, Page or business to get around a restriction.
- Every appeal is factual, filled with real IDs and dates, and approved by the client.
- All similar live and draft ads are listed and fixed.
- New rules are added to the pre-launch check with passing rewrites.
- The rejection log is updated.

## Output

**Summary (one screen):** what is blocked, sales impact (ads or accounts down), the fixes, appeals waiting for the client's yes, and the one most important change.

**Fix sheet:** Asset, Level, ID, Policy, Date, Cause (line, image or page), Fix or review, Similar ads found, Status.

**Appeal texts:** one per item, filled, with Approved (Y/N) and Sent date.

**Rule additions:** Pattern, Why it fails, Passing rewrite, Added to check (date).

## Common mistakes

- **Resubmitting the same ad again and again.** Step 3 fixes once or asks for review once.
- **"Your skin", "your weight" hooks.** Step 2 rewrites them out of the second person [MCR-6023].
- **Fixing only the rejected ad.** Step 5 cleans every match.
- **Ignoring the landing page.** Step 2 checks it; review includes it [ADC-6082].
- **New accounts to escape a restriction.** Gate 1 forbids it.
- **Appealing before securing a hacked business.** Gate 4 secures first [SEC-6084].

## Sources

- ADC-0038: a backup ad account at high spend.
- ADC-0045: Page ad limits at high volume.
- ADC-0065: flexible ads can build unapproved versions.
- ADC-6082: what review checks, edits, review requests and restrictions (proposed card).
- MCR-6023: personal attributes rule with examples (proposed card).
- MCR-0020: illustration plus persona headline for sensitive health topics.
- SEC-6084: two-factor setting and business admins (proposed card).

What makes this skill ours: each rejection is traced to the exact line, image or page before anyone resubmits; the fix sweeps every similar live and draft ad, not just the one Meta caught; appeals are short factual templates the client approves; and restrictions are never dodged with new accounts.

## Selling in India

- ASCI's code requires claims to be truthful and backed by evidence, and health product claims face extra law (such as the Drugs and Magic Remedies Act); avoid "cure" and disease words for supplements and cosmetics.
- Regional-language ads are reviewed too; translate the fix into each language version.
