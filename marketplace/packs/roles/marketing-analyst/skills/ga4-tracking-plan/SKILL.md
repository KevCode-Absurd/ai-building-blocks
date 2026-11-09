---
name: ga4-tracking-plan
description: Writes a GA4 tracking plan a developer or agency can build from without a meeting - every event with its name, trigger, parameters, where it fires, whether it is a key event and how to test it - plus UTM rules that land every campaign in the right GA4 channel, and a ranked fix list when checking an existing set-up. Use when GA4 only shows page views, when forms, calls or bookings are not counted, when purchases do not match the store, when UTMs are spelled many ways, or before a new site, store or campaign goes live.
---

# GA4 tracking plan

A tracking plan turns "we want to see what works" into a table someone can build and test. It follows Google's rules for names and limits, uses Google's recommended events where they fit, and keeps personal data out.

## When to use

- A new site, store, app or booking flow is about to launch.
- GA4 shows page views but no sales, leads or bookings.
- GA4 purchases do not match the store's order count.
- Campaign traffic lands in Unassigned, "(not set)" or the wrong channel.
- An agency or developer asks "what exactly should we track?"

## What you need

1. What counts as success: purchases, booked calls, forms, sign-ups, phone clicks.
2. A site map or list of key pages and steps to each success.
3. The platform (Shopify, WordPress, Webflow, Squarespace, custom) and how tags are added now (platform app, Tag Manager, code).
4. For a check of an existing set-up: the GA4 events list, a Tag Manager container export or a list of tags, and the backend count of sales or leads for the same dates.
5. The channels you pay for and a sample of recent campaign links.
6. Where customers live, so consent rules can be flagged.

**Access:** level 1 to read GA4, Tag Manager and the store; level 2 to build the tags and triggers in an unpublished Tag Manager workspace and test them in preview; level 3 to publish the tested workspace, mark key events and add unwanted referrals, within the limits you set. Changing a consent banner always needs a fresh yes.

## Steps

### 1. List the successes and their paths
For each success, write the path step by step: product page, cart, checkout, purchase; or service page, form, thank-you page. Each success becomes a key event. Keep the list short: what the business would pay to get more of.

### 2. Name events
- Use Google's recommended events first. Online sales: view_item, add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase, refund. Leads: generate_lead, qualify_lead, working_lead, disqualify_lead, close_convert_lead, close_unconvert_lead.
- Custom names only when nothing fits, in lowercase snake_case.
- Follow GA4's rules: start with a letter; letters, numbers and underscores only; no reserved prefixes such as ga_, google_ or firebase_; names case sensitive.
- Keep event and parameter names to 40 characters and values to 100 (page_location allows more). No more than 25 parameters per event. A key event with a name over 40 characters is not reported as a key event.

### 3. Specify each event
For every event write: trigger (click, form submit, page view with a rule, server call), parameters with example values, where it fires (platform setting, Tag Manager, site code, server), key event yes or no, and who builds it. For purchase: transaction_id (unique, to stop double counting), value without shipping and tax, currency as a three-letter code, and items with item_id or item_name.

### 4. Remove personal data
Check every parameter and URL. No names, emails, phone numbers or free-text fields that might hold them. Form events send the form name, not the answers.

### 5. Write UTM rules
- Every tagged link carries utm_source, utm_medium and utm_campaign, in lowercase.
- Pick mediums that match GA4's channel rules: "cpc" or "paid_social" style values for paid traffic (the paid rule matches mediums containing "cp", or "ppc", "retargeting" or starting with "paid"); "email" for email; "affiliate" for affiliates; "referral" for partner links.
- Set allowed values for source per channel, and a campaign pattern with a date, for example `2026-03_spring_sale`.
- Write at least five filled example links for the client's real channels.
- Never put UTMs on links within your own site; they can replace the real source with your own label in reports.

### 6. Fix credit leaks
List payment providers, booking tools and login domains as unwanted referrals. Confirm cross-domain set-up if checkout sits on another domain.

### 7. Check consent
Note where customers live, whether a consent banner exists, and whether Google's consent mode is set (basic or advanced). Flag that EU visitors must consent before non-essential cookies. Do not rule on what the law requires; point to official guidance.

### 8. For an existing set-up: compare and rank
Compare the current events and tags with the plan. List what is missing, duplicated, misnamed or firing on the wrong trigger. Compare GA4 purchases with backend orders for the same dates. Rank fixes by money at stake: purchase and lead tracking first, then channel credit, then nice-to-have events.

### 9. Write the test list and build order
For each event: the action to take, where to look (DebugView, Tag Assistant preview, the platform's test tool) and what should appear, once. Then say who builds each part and in what order.

## Checks

- Every success has exactly one key event, and each fires once per real action.
- Every name passes GA4's rules and limits.
- No parameter, URL or UTM value can hold personal data.
- Every paid medium in the UTM rules fits a GA4 paid channel rule.
- Payment and booking domains are on the unwanted referral list.
- Each event has a test line and an owner.
- Data retention is set to 14 months.
- The access level used for each step is written down.

## Output format

1. Successes and key events (one line each, with the business reason)
2. Event table: event, trigger, parameters with example values, where it fires, key event, owner
3. UTM rules: allowed sources and mediums per channel, campaign pattern, five or more example links
4. Unwanted referrals and cross-domain notes
5. Consent notes by region (to check, not legal advice)
6. Fix list, ranked (for an existing set-up)
7. Test list
8. Build order and access level per step

## Example of good output (short)

*Illustrative structure, not a real business: a Shopify shop selling knitting kits. Copy the shape, never the content: every fact comes from the client's own context.*

| Event | Trigger | Parameters (example) | Fires from | Key event |
|---|---|---|---|---|
| view_item | Product page view | currency: GBP; value: 34.00; items: [{item_id: "KIT-114", item_name: "Beginner sock kit"}] | Store's Google app (confirm in DebugView) | No |
| add_to_cart | Add to cart button | as view_item, plus quantity | Store's Google app | No |
| purchase | Order confirmation | transaction_id: "#4012"; value: 68.00; currency: GBP; items: [...] | Store's Google app | Yes |
| generate_lead | Wholesale form submit | form_name: "wholesale" | Tag Manager, form submit trigger | Yes |

**UTM rule:** newsletter links use `utm_source=newsletter&utm_medium=email&utm_campaign=2026-03_spring_kits`. Instagram ads use `utm_source=instagram&utm_medium=paid_social`. Not `utm_medium=instagram`, which lands in Unassigned.

**Fix #1 (most money at stake):** GA4 shows 212 purchases in February against 171 Shopify orders. The purchase event fires from both the Shopify app and an old Tag Manager tag. Remove the Tag Manager purchase tag (level 2: in a workspace; level 3: publish after the test below).

**Test:** place a test order; in DebugView expect one purchase event with transaction_id "#test-001"; in Tag Assistant expect no second purchase tag.
