---
name: meta-signal-health-check
description: Check whether a business sends Meta clean, complete conversion data through the Meta pixel and Conversions API. Covers which events fire, value and currency, browser and server redundancy, deduplication by event ID, event coverage, event match quality, freshness, Aggregated Event Measurement, CRM lead-quality signals and consent, then writes a fix spec a developer can follow. Use before any campaign launch or scale-up, when Meta and the shop disagree on sales, or after a site, theme, checkout or consent-tool change.
---

# Meta signal health check

## When to use

- Before launching or scaling any conversion campaign.
- Meta reports more or fewer purchases or leads than the shop or CRM, by more than usual.
- After a site rebuild, new theme, checkout change, new consent banner, or a new app that touches tracking.
- Event match quality has dropped or Events Manager shows diagnostics warnings.

## Why it matters

Meta optimises toward the events you send. If the purchase event fires twice, the system learns that weak traffic converts. If it fires half the time, the system starves. Only events that match a Meta account count for attribution and optimisation, so match quality directly affects results.

## What you need

- Events Manager screenshots or **Use events dataset** access: overview, each key event's detail page, event match quality, deduplication, diagnostics, data freshness.
- How events are sent: platform integration (for example Shopify's Meta channel), a partner integration, Conversions API Gateway, server-side tag manager, or custom code.
- Shop or CRM totals by day for the last 30 days.
- The consent banner tool and settings, if the business serves regions that need consent.
- For leads: how leads move through the CRM, and the stages that mean "qualified" and "won".

**Access:** level 1 for the whole check; level 3 only for Events Manager settings on the fix list you confirm. Code changes on your site stay with your developer.

## Steps

### 1. Map the events
List every event that reaches the dataset: name, source (browser, server or both), volume over 7 days, and whether it carries value and currency. Mark the one or two events campaigns actually optimise for. Flag custom events that duplicate standard ones, and test or staging traffic.

### 2. Reconcile against the truth
For the last 30 days, compare Meta's count of the main event to shop orders or CRM leads, day by day. Write the ratio. A stable ratio is workable; a jumping ratio means something breaks on some days or some devices.

### 3. Redundancy and deduplication
- Key events should arrive from both the browser (pixel) and the server (Conversions API). Meta calls this a redundant setup and recommends it.
- Each browser and server copy must share the same event name and the same event ID. Meta keeps one when both arrive within 48 hours.
- The fallback method (fbp or external_id) only works when the browser event arrives first. Duplicates from the same source (two pixels, or two server integrations) are not removed at all. Look for two integrations sending the same event.
- In Events Manager, check the deduplication view for the main event.

### 4. Coverage
Meta's guide is an event coverage ratio of about 75% of Conversions API events to pixel events. Below that, find the gap: is the server sending only some events, or only on some pages?

### 5. Match quality
- Read event match quality (scored out of 10, web events only) for each key server event.
- List which customer information parameters are sent: hashed email, hashed phone, hashed first and last name, city, postcode, country, external ID, client IP address, client user agent, fbc (click ID cookie) and fbp (browser ID cookie).
- The fastest gains are usually email and phone on purchase and lead events, external ID, and passing fbc and fbp from the browser to the server.
- Hashing: customer details must be normalised and hashed (SHA-256) before sending unless a Meta SDK or partner does it.
- Consent: the business must have lawful permission to share customer data. Flag any region where the banner blocks events but the server sends them anyway. That is a question for the client's legal adviser, not a setting to change quietly.

### 6. Required fields and freshness
Website server events need action_source, event_source_url and client_user_agent. Check data freshness: events should arrive in real time or close to it, not in a nightly batch.

### 7. Aggregated Event Measurement
As of Meta's help page on 6 November 2026, web events no longer need an eight-event priority list, value sets, the old AEM tab or domain verification for event setup. Confirm the client is not still trying to manage a priority list that no longer exists. Meta says domain verification may still be needed for other reasons, so do not remove it without checking Meta's current guidance.

### 8. Lead quality signals (lead businesses)
Is the CRM sending later stages back (qualified lead, sale) through Conversions API for CRM or a partner such as Zapier or Salesforce? If yes, which stage do campaigns optimise for? If no, recommend it: optimising for raw form fills invites junk leads.

### 9. Test
Use the Test Events tool with a real test purchase or lead. Confirm one browser event, one server event, same event ID, deduplicated, with value, currency and customer parameters.

## Checks before you send it

- Every problem names the event, the evidence and the exact fix.
- The fix spec is something a developer can follow without guessing: event name, trigger, parameters, where the event ID comes from (for example the order ID), and how to test.
- You have not asked for passwords, tokens or raw customer data in chat.
- You state what you could not see.

## Output format

1. **Verdict:** Healthy, Fix before scaling, or Broken. One sentence why.
2. **Event map table:** event, source, 7-day volume, value, dedup status, match quality.
3. **Reconciliation:** Meta versus shop or CRM, ratio, stable or not.
4. **Problems ranked:** problem, evidence, impact, fix, owner (client, developer, platform app).
5. **Developer spec:** one block per fix.
6. **Retest plan:** what to check 7 days after the fix.

## Example of good output (short)

> **Verdict: Fix before scaling.** Purchases are sent by both the Shopify Meta channel and a custom server script, so about a third of orders count twice.
>
> | Event | Source | 7-day volume | Value | Dedup | EMQ |
> |---|---|---|---|---|---|
> | Purchase | Browser + 2 server routes | 412 (shop: 301) | Yes | Partial | 6.1 |
> | Lead (newsletter) | Browser only | 96 | No | n/a | n/a |
>
> **Fix 1 (developer):** switch off the custom server Purchase script; keep the Shopify channel route. Confirm event_id equals the Shopify order ID on browser and server copies. **Test:** place one test order; Test Events should show one browser and one server Purchase with the same event_id, marked deduplicated.
>
> **Fix 2 (client decision):** add hashed email and phone to the server Purchase event. Your privacy notice must cover this; please confirm with whoever handles your legal questions.
