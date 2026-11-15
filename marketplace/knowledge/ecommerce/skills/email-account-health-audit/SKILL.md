---
name: email-account-health-audit
description: "Audits a store's email and SMS account for the set-up problems that quietly lose sales: sending domain and authentication, attribution and smart-sending settings, engaged segments and list cleaning, missing or mis-triggered flows, sign-up forms, and the store integrations that feed them. Reads settings and flow numbers through the platform's API or official connector with read-only access, or from exports and screenshots, then sizes each gap in gross profit a month using the store's own revenue per recipient, marked as attributed rather than proven. Works on Klaviyo, Shopify Email or Omnisend, with Klaviyo field names as the example. Use when taking over an email account, when opens or email revenue fall, or once a quarter."
---

# Email account health audit

**You get:** a checklist table of email and SMS setup checks with pass or fail and money at stake, a flow table, a numbered change list for approval and an audit CSV file.

A checked list across account settings, list health, flows, forms and integrations, with a gross profit figure on each gap. Klaviyo names are used as the example; Omnisend and Shopify Email have close equivalents.

## When to use

- Taking over a store's email and SMS account from another agency or person.
- Opens, clicks or email-attributed revenue have fallen for three or more weeks.
- Messages are landing in spam or promotions tabs more than before.
- Quarterly check, or before a big sale when list health matters most.

## Not for

- Planning which flows to build and in what order: use `email-sms-flow-plan`.
- Writing the emails themselves: use `email-copy-from-store-history`.
- The post-purchase repeat sequence in detail: use `post-purchase-repeat-sequence`.
- Store-wide conversion leaks: use `storefront-conversion-audit`.

## What you need

Required (read access, level 1):

1. **Account data, one of two ways:**
   - **API or connector (preferred):** the platform's official connector or MCP server, or a read-only private API key the owner creates and keeps in an environment variable on their own machine. Klaviyo private keys can be set to read-only. Never ask for the key in chat.
   - **Manual:** exports and screenshots of Flows (status, trigger, message count), Lists and segments (with counts and definitions), Sign-up forms (views, submit rate), Settings: Domains, Attribution, Smart sending, Integrations.
2. **Last 90 days of flow and campaign performance:** recipients, open rate, click rate, unsubscribe rate, spam complaint rate, bounce rate, placed orders, revenue. In Klaviyo: the Flow performance and Campaign performance reports, or the flow and campaign values report endpoints.
3. **Gross margin and gross profit per order** from `store-meta-math`.
4. **The sending domain** (for a public DNS lookup of SPF, DKIM and DMARC).

Optional: the store's Shopify Analytics sessions, subscription app name, SMS provider, and markets with stricter consent rules.

Everything in this audit is read-only. Changing a setting or flow needs draft access (level 2) and a client yes for each change; turning on any send needs a separate yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when known. Fail: size gaps in attributed revenue only and label every figure "revenue, not profit".
2. **Attribution honesty.** Note the account's attribution window and whether Apple privacy opens and bot clicks are excluded. Default open-based windows work like view-through credit, so attributed revenue mostly measures how hard the account sends [EML-0056]. Every revenue figure in this audit is called "attributed" unless a holdout shows more.
3. **Capacity.** Ask who will make fixes and how many hours they have. Rank within that.
4. **Consent rules.** Name the markets. SMS and email consent, quiet hours and unsubscribe rules differ by country; flag anything that looks non-compliant and point to the platform's compliance guide, without giving a legal ruling.

## Steps

### 1. Pull the data

API path, in Klaviyo terms: Accounts (sender details), Flows with status and trigger, Lists and Segments with profile counts and definitions, Forms, Metrics (Placed Order, Started Checkout, Added to Cart, Viewed Product, Active on Site), and the flow and campaign values reports for 90 days. Manual path: the same from exports and screenshots. Record each value with its date.

### 2. Account settings

Pass or fail:

- Branded sending domain set up, not the platform's shared domain. Practitioner default, test it.
- SPF, DKIM and DMARC records present on the sending domain (free DNS lookup). Gmail and Yahoo require authentication, a DMARC record and one-click unsubscribe for bulk senders, and expect spam complaints under 0.3%.
- DMARC policy read in context, not reset to a template. No record yet: add one at policy none with a reports address (rua) that goes to its own inbox, and tighten to quarantine, then reject, only once the reports show the store's own mail passing. A record already at quarantine or reject: never lower it to match a checklist. Read recent DMARC reports; if a real sender of the store's mail (the email tool, the store platform, the inbox provider) fails, fix that sender's SPF or DKIM alignment. Lowering the policy is a short stop-gap only when real mail is being blocked, and it is the owner's call. No reports visible: mark the check "not seen" and recommend no policy change.
- Attribution window short enough for the product and excluding Apple privacy opens and bot clicks; for impulse products, consider 3 days [EML-0013] [EML-0043].
- Smart sending on for campaigns, off for flows [EML-0043].
- Reply-to address monitored by a person.
- UTM tracking on for campaigns and flows.
- Opt-in rule set per market: single or double opt-in is a consent decision, not a growth trick. Buyers who ticked marketing consent at checkout can skip a second confirmation where local rules allow; follow the platform's consent guide.
- Send-time optimisation is optional for campaigns; flows keep their set delays.

### 3. List health

- Engaged definition: a real open or click within 180 days, or a sign-up or site visit within 14 days; sunset after 180 days of nothing [EML-0011]. A stricter rule: unengaged after 120 days with at least 6 emails received [EML-0042]. Use the 180-day rule for stores sending under three campaigns a week, the 120-day rule above that.
- Hard bounces suppressed at once; soft bounces after 4 [EML-0042]. Anyone who marked a message as spam is suppressed and never re-added.
- Campaigns to a 90-day engaged segment open at 50% or more; opens steadily under 30 to 35% signal inbox trouble [EML-0059].
- Share of list engaged at 50% or more, with dormant profiles re-warmed in slices of about 10% per send [EML-0052].
- If engaged opens sit below 40% and authentication passes, plan the 6-week repair: three campaigns a week only to 14-day engagers until opens hold 50%, then widen to 30, 60 and 90 days [EML-0021].

### 4. Flows

Check each core flow exists, is live, and has the right trigger:

| Flow | Pass when |
|---|---|
| Welcome | Live, triggered by list sign-up, discount email first if one is promised [EML-0060] |
| Browse abandon | Triggered by Viewed Product, first message 30 minutes to 2 hours after [EML-0064] |
| Added to cart | Its own flow on Added to Cart, first email 30 to 45 minutes after; about 90% of audited stores only had Checkout Started [EML-0018] |
| Checkout abandon | First email 15 to 60 minutes after, not the 4-hour default [EML-0064] |
| Post-purchase | Splits new from returning buyers [EML-0053] |
| Win-back | Starts near twice the store's average days between orders [EML-0019] |
| Sunset | Exists and suppresses after the engaged window |

Also check:

- **Re-entry filters.** Welcome runs once per person ever. Abandonment and browse flows use "not in this flow in the last 7 to 14 days" (practitioner default, test it), not "ever", or repeat abandoners never get a reminder again. Every flow exits on Placed Order.
- **Preview text** is written on every email, not left to pull the first line.
- Abandonment discounts held until late in the flow with a real expiry [EML-0044]; subscribers excluded from sale campaigns if the store sells subscriptions [EML-0001]; if the store uses Shopify's own email app, its abandonment automation skips anyone sent a cart, checkout or browse email in the last 14 days [EML-0009].

### 5. Sign-up forms

Most audited pop-ups convert 2 to 3% of visitors; a well-set form reaches 8 to 12% [EML-0040] [EML-0026]. Pass when the form converts over 5% (practitioner default, test it), fires after a short delay rather than at once, and asks for SMS on the second step with the same offer [EML-0038].

### 6. Integrations

- Store integration syncing orders, checkouts, added-to-cart and product views; on-site tracking enabled in the theme.
- Catalogue sync current (prices and stock match the store).
- Subscription, reviews and SMS consent data syncing where those apps exist.
- One source of truth for SMS consent; no duplicate sends from two tools.
- Ad audience sync (Meta custom audiences, Google customer match) live where the client uses it, with recent buyers syncing so ads can exclude them [ADC-0015].

### 7. Campaign cadence

Two to three campaigns a week under about 50,000 monthly store revenue, three to four above, four to five above 200,000, adding sends only while engaged opens stay over 30% [EML-0041]. Flag accounts sending once a week to the whole list or daily to everyone.

### 8. Size each gap in gross profit

For a flow that exists but underperforms:

Gap a month = monthly recipients x (target revenue per recipient minus current) x gross margin.

Use the store's own best period or best similar flow as the target, not an outside benchmark. For a missing flow, estimate monthly entrants from the trigger metric (for example Added to Cart events without an order), and plan on half the conversion rate of the store's closest existing flow (practitioner default, test it). Label every figure "attributed, upper bound". For the largest gap, recommend a holdout split to confirm it.

For a deliverability problem, size the drop: campaign revenue in the 90 days before opens fell minus the last 90 days, times gross margin.

### 9. Rank and write the fix list

Order: authentication and deliverability first (nothing else works without inbox placement), then broken or missing triggers, then list hygiene, then forms, then cadence. Inside each group, rank by gross profit a month.

## Checks before you hand it over

- Every line is pass, fail or "not checked", with the value found and its date.
- Every money figure says gross profit or "revenue, not profit", and "attributed".
- Targets come from the store's own data, not outside averages.
- Authentication result comes from a real DNS lookup, not the platform's badge alone.
- No API key, password or token was asked for or repeated.
- No setting, flow or send was changed without a client yes.
- The top fixes fit the stated hours.

## Output

1. **One-screen summary:** inbox health in one line, the three biggest gaps with gross profit a month, and the first fix to make this week.
2. **Checklist table:** Area, Check, Found (value and date), Pass or fail, Fix, Hours, Gross profit a month (attributed), Card.
3. **Flow table:** Flow, Status, Trigger, First delay, Messages, Recipients (90 days), Revenue per recipient, Target, Gap a month.
4. **Change list for approval:** numbered, each small enough for a yes or no.
5. **File:** `email-health-audit.csv`.

## Common mistakes

- **Trusting attributed revenue as profit.** Open-based windows inflate it [EML-0056]. Gate 2 labels it.
- **Fixing flows before deliverability.** Step 9 puts inbox placement first.
- **One abandonment flow on Checkout Started.** Step 4 checks for a separate added-to-cart flow [EML-0018].
- **Mailing the whole list to lift revenue.** It burns reputation; step 3 keeps sends to engaged profiles.
- **Outside benchmarks as targets.** Step 8 uses the store's own best period.
- **Asking for the API key.** The owner keeps it; the agent reads through a connector or the owner runs the script.

## Sources

- EML-0001: exclude subscribers from sale campaigns.
- EML-0009: Shopify Messaging 14-day suppression.
- EML-0011, EML-0042: engaged and unengaged definitions; bounce rules.
- EML-0013, EML-0043, EML-0056: attribution and smart sending settings.
- EML-0018, EML-0019, EML-0044, EML-0053, EML-0060, EML-0064: flow triggers, timing and splits.
- EML-0021, EML-0052, EML-0059: deliverability floors and repair.
- EML-0026, EML-0038, EML-0040: sign-up form rates and SMS step.
- EML-0041: campaign cadence by store size.
- ADC-0015: exclude existing customers from prospecting audiences.

What makes this skill ours: every gap is sized in gross profit with the store's own best period as the target and labelled as attributed, not proven; deliverability is fixed before anything else; and the API path is read-only through a connector or a key the owner keeps, never pasted into chat.
