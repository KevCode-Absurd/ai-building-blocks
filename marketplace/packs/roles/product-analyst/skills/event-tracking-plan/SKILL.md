---
name: event-tracking-plan
description: Writes or repairs a product tracking plan - the questions it must answer, then each event with an object-action name, when it fires, client or server, typed properties with allowed values, the question it answers, owner and a personal-data check - plus identity rules, internal-traffic filters and a QA checklist for after release. Works for GA4 (recommended events and limits), Amplitude, Mixpanel, PostHog or Segment. Drafting the plan and tracking pull requests is level 2; publishing taxonomy changes or merging tracking code is level 3. Use it before launch, after a redesign, or when nobody trusts the event list.
---

# Event tracking plan

## When to use

- A new app, product or checkout is about to launch and nothing is tracked yet.
- The event list has grown to hundreds of names and nobody trusts it.
- A redesign changed the sign-up or checkout flow and old events no longer fit.
- The team is moving between tools (GA4 to PostHog, Mixpanel to Amplitude).

## What you need

1. The product's main flows, from first visit to the action that shows value (an order, a booking, a report sent).
2. The questions for the next quarter, in the owner's words.
3. The tools in use and the current event list (an export or a screenshot is enough).
4. How users are identified: when an ID is created and whether it is sent at sign-up or log-in.
5. Countries served and how consent is collected.
6. Access: level 1 to read the current events; level 2 to draft the plan, mark planned events or open tracking pull requests; level 3 to publish taxonomy changes or merge tracking code within your limits.

## Steps

### 1. Start from questions

List the five to ten questions the data must answer ("Where do new sign-ups stop before their first booking?"). For each, name the metric and the flow behind it. This is the order Amplitude, Mixpanel and Segment all teach: goals, then flows, then events [11][15][23].

### 2. Pick and write the naming convention

Choose one and put it in the first line of the plan:
- Object-action in Title Case for events and snake_case for properties (Segment style), or
- lowercase snake_case `category:object_action` with present-tense verbs from a fixed list (PostHog style).
Event names are case-sensitive in the tools, so "Order Completed" and "order completed" are two events [11].

### 3. List the events

For each flow step, one event. Rules:
- Use the platform's recommended names where one fits. In GA4 that means `sign_up`, `login`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase` and the others, with their prescribed parameters [2].
- One event with a property beats near-duplicates ("Order Completed" with `payment_method`).
- No values in names: no IDs, prices or page titles.
- Keep the list short. Add an event only when a question needs it.

### 4. Define properties

For each property: name, type, allowed values or format, example, and whether it is an event property or a user property. Put the same joining property (product ID, plan) on every step of a funnel so it can be held constant. Check limits: GA4 standard properties take 25 parameters per event and parameter values up to 100 characters [1].

### 5. Decide where each event fires

Money and account events (sign-up, payment, cancellation) from the server or database; interface events (button clicks, screens) from the client. Note the exact trigger: "fires after the payment is confirmed", not "on the pay button".

### 6. Identity and filters

- When `identify()` is called, the ID format, and what happens on log-out.
- How staff, test accounts and staging hosts are excluded.
- For apps: events are analysed by event timestamp, because mobile events can arrive late.

### 7. Personal-data check

For every property ask: could it hold a name, email, phone number, exact location, free text, or health or financial details? If yes, remove it, replace it with an ID, or record why the question needs it. Check URLs and page titles for emails and tokens. GA4 forbids sending personally identifiable information, and data sent to a third-party tag goes wherever that tag goes [7][29].

### 8. QA plan

For each event: how to trigger it, where to see it (the tool's debug or live view), the expected properties, and the pass rule. After release, compare counts with a trusted total (orders in the shop, payments in Stripe).

### 9. Release (level 2 or 3)

At level 2, open a pull request per flow with the plan rows in its description. At level 3, merge reviewed changes through your pipeline and publish the taxonomy within your limits. Renaming or deleting live events needs a fresh yes, every time, because reports that use them break.

## Checks

- Every event answers a listed question.
- One naming convention, written down, followed by every row.
- No dynamic names; no duplicates differing only by case or word order.
- Every property is typed with allowed values, and passes the personal-data check.
- Platform limits respected; recommended names used where they fit.
- Identity, internal filters and QA steps are written.
- Any deletion or rename of a live event is flagged for a fresh yes.

## Output format

```
# Tracking plan: [product], version [n], [date]
Convention: [one line]
Questions: [numbered list]

| Event | Fires when | From | Properties (type: allowed values) | Question | Owner | Status | Personal data |

## Identity rules
## Excluded traffic
## QA checklist
## Changes needing a fresh yes
```

## Example of good output (short)

*Illustrative structure, not a real business: a dog-walking booking app in the UK. Copy the shape, never the content: every fact comes from the client's own context.*

> Convention: Object Action in Title Case; properties in snake_case.
>
> | Event | Fires when | From | Properties | Question | Status | Personal data |
> |---|---|---|---|---|---|---|
> | Account Created | after the server saves the new account | server | signup_method: email, google, apple | Which sign-up method converts to a first booking? | planned | none; user ID only |
> | Walker Profile Viewed | profile screen fully loaded | client | walker_id: ID; source: search, map, rebook | Do map views lead to bookings? | planned | walker_id is an internal ID |
> | Walk Booked | after payment is confirmed | server | walker_id; walk_length_min: 30, 60; is_first_booking: true/false; price_band: low, mid, high | Where do new users stop before the first booking? | planned | no address, no dog name |
>
> Removed from the old list: "booking_btn_click_v2", "BookWalk" and "walk booked" (one event replaces all three). Dog medical notes are never sent as properties. Renaming "BookWalk" in the live project needs your yes, because two dashboards use it.
