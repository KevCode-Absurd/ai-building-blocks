---
name: measurement-and-attribution-plan
description: Sets up measurement a growth team can trust and checks what each channel really added. Audits key events, UTM tagging, CRM source fields and a "how did you hear about us?" question; checks consent set-up for US, UK and EU visitors; reconciles what ad platforms and analytics claim against backend orders, bookings or billing; and designs a holdout or geo test to measure lift. Use before launching growth tests, when tools disagree about results, when a channel's credit looks too good, or when deciding whether to keep spending on brand search or retargeting.
---

# Measurement and attribution plan

Every tool reports its own version of the truth. Ad platforms credit themselves, analytics loses visitors who decline cookies, and customers who heard about you from a friend show up as "direct". This skill builds a plan that makes the numbers add up, says where they cannot, and tests what a channel actually added.

Access levels for this skill:

- **Level 1 (read):** audit GA4, Tag Manager, ad accounts, CRM and the store or billing system; build the reconciliation.
- **Level 2 (read and draft):** prepare key events, tags and UTM templates in an unpublished Tag Manager workspace or a draft, and draft the CRM field change for whoever runs it.
- **Level 3 (read, write and publish):** publish the tracking changes and pause or restart campaigns for a holdout test, only within the limits the client set, after one yes to the action list. A change to consent banners or conversion goals always needs a fresh yes.

## When to use

- Before the first round of growth tests.
- Ad platforms together claim more sales than the business made.
- A large share of traffic is "direct" or "(not set)".
- Someone asks "Is brand search / retargeting / this creator actually working?"
- After a consent banner, site or checkout change.

## What you need

- **Access I have** per tool, written down. Until the client answers, level 1.
- The list of actions that matter (purchase, booked call, sign-up, activation) and where each is recorded.
- Exports for the same date range (4 to 8 weeks): backend orders or bookings, GA4 key events by source, each ad platform's conversions, email platform conversions.
- The countries where customers are, and the consent banner set-up.
- Any "how did you hear about us?" answers, raw.

## Steps

1. **List the events.** For each action that matters: name, where it fires (site, app, CRM, booking system), whether it is a GA4 key event, and which ad platforms import it. In GA4, an event marked as a key event can become a Google Ads conversion shared by both products.
2. **Check tagging.** Pull GA4 traffic by source and medium. Flag "(not set)", odd capitalisation, and paid traffic arriving as organic or direct. Write the UTM rules: always utm_source, utm_medium and utm_campaign, lowercase, one naming list. Build links with Google's Campaign URL Builder.
3. **Add self-reported source.** A required "How did you hear about us?" question at the point of purchase, booking or sign-up, with a short list plus "other (tell us)". Mirror the list in the CRM source field.
4. **Check consent by region.**
   - EU: consent is needed before non-essential cookies; check tags do not fire before an answer.
   - EEA, UK, Switzerland: Google's EU user consent policy applies to Google products; check consent mode is set up and which mode (basic or advanced) is in use.
   - UK: check the client's banner against the Information Commission's current guidance under the Data (Use and Access) Act 2025.
   - US: if the business is covered by California's CCPA, check the "Do Not Sell or Share" link and that Global Privacy Control signals are honoured.
   Flag issues for the client and their adviser; do not give legal rulings.
5. **Reconcile.** Build one table: backend total; GA4 key events; each platform's claimed conversions; the sum of platform claims; self-reported shares. Explain each gap (consent, ad blockers, view-through credit, overlap, different time windows). The backend total is the anchor.
6. **Pick the questionable channel.** Usually brand search, retargeting, or a channel that claims a lot but rarely shows up in self-reported answers.
7. **Design a lift test.** Cheapest first:
   - *On-off holdout:* pause the channel for set weeks and compare total backend results with the weeks around them, allowing for season.
   - *Geo holdout:* pause in matched regions only, keep it on elsewhere.
   - *Platform lift study:* if the ad platform offers one for the account.
   Write the decision rule first: what drop in backend results would mean the channel earns its spend.
8. **Plan the long view.** If the client spends across several channels over a long period with real variation, note that open-source mix models (Google's Meridian, Meta's Robyn) exist and can be calibrated with experiments. For most small businesses, holdouts first.
9. **Write the plan and the action list,** marking each step's access level and approvals.

## Checks

- Every action that matters has one home and one definition.
- UTM rules are written down and lowercase.
- The reconciliation uses the same date range for every source.
- Gaps are explained, not hidden.
- Consent issues are flagged with the official source to check, not ruled on.
- Any pause of a live campaign is level 3, inside the agreed limits, with a yes before it starts.
- The lift test has a decision rule written before it starts.

## Output format

1. **Event map:** action, where it fires, key event (yes or no), imported to which platforms.
2. **Tagging fixes and UTM rules.**
3. **Consent findings** by region, with the source to check.
4. **Reconciliation table** and the explanation of each gap.
5. **Lift test card:** channel, method, dates, decision rule, access level and approvals.
6. **Action log template:** what, where, when, result.

## Example of good output (short)

*Illustrative structure, not a real business: an online tea shop selling in the UK and EU. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Reconciliation, 1 to 28 September**

| Source | Purchases |
|---|---|
| Store backend (orders, refunds removed) | 1,000 |
| GA4 key event "purchase" | 860 |
| Meta Ads claimed | 420 |
| Google Ads claimed (of which brand search 210) | 380 |
| Email platform claimed | 250 |
| Sum of platform claims | 1,050 |

**Gaps:** GA4 is 14% below the backend; the consent banner shows a 22% decline rate for EU visitors, which explains most of it. Platform claims add up to more than real orders because each counts orders the others also touched, and Meta includes view-through credit. Self-reported answers: friend or family 24%, Instagram 28%, Google search 26%, newsletter 12%, other 10%.

**Questionable channel:** brand search claims 210 orders, but those buyers were already searching for the shop by name and might have clicked the free result below the ad.

**Lift test card:** pause brand search in weeks 2 and 4 of October, keep it on in weeks 1 and 3. Watch backend orders from buyers who answered "Google search", and organic clicks on the brand name in Search Console. Decision rule (agreed with the owner): if orders in off weeks fall by less than the brand search spend could pay for at the target CAC, cut brand search to a low cap; otherwise keep it. **Access:** level 3 granted for Google Ads, limited to pausing and enabling the two brand campaigns on those dates. Action list confirmed by the owner on 30 September.

**Consent:** UK banner to be checked by the owner against the Information Commission's current cookie guidance; EU tags fire only after consent, confirmed in Tag Assistant.
