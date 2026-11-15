# Lifecycle flows: welcome, cart, browse, post-purchase and win-back

The automated flows your store needs (welcome, abandoned cart, browse abandon, post-purchase and win-back) built in Klaviyo in draft, tested end to end, switched on one at a time with your yes, guarded so old customers are not flooded, and read at 14 and 30 days.

**Starts from:** A store with no flows yet, a retention fix from the monthly review, a lesson that a flow is weak, or you asking for a flow to be built or rebuilt.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Imogen (imogen-retention) | intake.md | intake-complete | no | read |
| 2 | What buyers need after they buy | LaToya (latoya-post-purchase) | post-purchase-brief.md | care-review | no | draft |
| 3 | Flow plan and guards | Imogen (imogen-retention) | flow-plan.md | plan-review, compliance-review | yes | draft |
| 4 | Write every email and text | Lucia (lucia-email-copy) | flows-copy.md | copy-lint, readability, copy-review | no | draft |
| 5 | Build the flows in draft | Morag (morag-email-sms) | build-record.md | none | yes, the plan | publish |
| 6 | Test each flow end to end | Morag (morag-email-sms) | tests.md, render/ | render-check, flow-test-review | no | read |
| 7 | Go-live card | Imogen (imogen-retention) | go-live.md | compliance-review, card-complete | yes | draft |
| 8 | Switch the flows on | Morag (morag-email-sms) | launch-record.md | none | yes, the plan | publish |
| 9 | 48 hour flood check | Morag (morag-email-sms) | results/early-check.md | none | no | read |
| 10 | 14 day readout | Imogen (imogen-retention) | results/readout-14.md, numbers.json | numbers-check | no | read |
| 11 | 30 day readout and call | Imogen (imogen-retention) | results/readout-30.md, numbers.json | numbers-check, readout-review | no | read |
| 12 | Act on the call | Morag (morag-email-sms) | results/act.md | none | yes, the plan | publish |
| 13 | Write down what we learned | Imogen (imogen-retention) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Audits what exists before anything is built: which flows are live, in draft or missing, how each performed over the last 90 days, the store's real reorder gap by product, cart and browse events coming into Klaviyo, consent counts by channel and region, and what customers ask after they buy. It reads Klaviyo through a read-only connection only. The gap we are solving and the audience for each flow are written down. Missing facts become questions for you.

- **Needs:** context/org-context/ (customers, voice, design, claims, do's and don'ts); context/goals.json; context/learnings.md; Klaviyo flows, flow results and metrics for the last 90 days (read-only connector or your export); shop orders for the last 12 months (warehouse view shop_orders_daily or a Shopify export); the task that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, each existing flow has its status, and missing facts are answered questions, not guesses)
- **Done when:** intake.md lists every existing flow with its status and results, the reorder gap by main product, event and consent counts, the gap each new flow solves, and the questions you answered.

### 2. What buyers need after they buy

Maps the weeks after an order from the buyer's side: when it arrives, the first use, the questions people ask support, when a review request makes sense (after delivery and first use, asked of every buyer, not only happy ones), and when a reorder or a matching product is natural. This becomes the job list for the post-purchase emails and texts.

- **Needs:** intake.md; last 90 days of support ticket themes and return reasons; delivery times by region from the shipping data; context/org-context/ customers and claims
- **Makes:** post-purchase-brief.md
- **Checks:** care-review (the timeline matches real delivery times, the top support questions are answered in the right message, and the review request goes to every buyer after delivery)
- **Done when:** post-purchase-brief.md gives a timeline from order to reorder with one job per touch, tied to real delivery times and the top support questions.

### 3. Flow plan and guards

Writes the logic for each flow before any copy: the trigger, the filters, the exit rules (purchase, unsubscribe, or entering a more relevant flow), the timing, the channel for each step, any offer and its cap, the holdout, and the measures. It adds guards so turning a flow on cannot flood past customers: the flow starts with new events only and does not add past profiles, a win-back only takes people past their usual reorder gap and not emailed in the last few days, everyone in another active flow is suppressed, recent buyers never get cart or last chance messages, and texts go only to SMS-subscribed profiles inside quiet hours. It gives the expected number of people entering each flow per day from the last 30 days of events.

- **Needs:** intake.md; post-purchase-brief.md; context/learnings.md
- **Makes:** flow-plan.md
- **Checks:** plan-review (every trigger, filter, exit and guard can be built in Klaviyo as written, no flow adds past profiles, and recent buyers cannot get cart or last chance messages); compliance-review (each flow sends only to profiles with the right consent for its channel and region, footers and unsubscribe are present, offers and deadlines are real, and texts respect quiet hours)
- **Done when:** flow-plan.md has, for each flow, the trigger, filters, exits, suppression, timing, channel, offer and cap, holdout, flood guard and expected entries per day, all possible in Klaviyo as written.
- **You sign off:** You read each flow's trigger, exits, timing, offer and cap, holdout and guards, and the expected entries per day. Reply yes with the code to approve the plan. Switching any flow on needs a separate yes later.

### 4. Write every email and text

Writes each message in each flow: subject, preview, body, button and sign-off for emails, and the text with its character count and opt-out line for texts. Each message does one job from the plan, works on its own for someone who skipped the last one, and helps before it asks. Welcome keeps the sign-up promise in the first email. Win-back makes it easy to say no. No invented urgency, reviews or numbers.

- **Needs:** flow-plan.md (signed off); post-purchase-brief.md; context/org-context/ voice and claims
- **Makes:** flows-copy.md
- **Checks:** copy-lint (the copy checker exits 0); readability (the readability checker exits 0 for a consumer audience); copy-review (each message does one job with one action, helps before it asks, stays in the brand voice, and every claim is proven)
- **Done when:** flows-copy.md has every message in the plan with its flow, step, day, job, final subject line and main action, and every claim is marked with its proof.

### 5. Build the flows in draft

Shows you a build plan of exact Klaviyo tool calls, then on your yes creates the templates and each flow in draft status, with the triggers, filters, timing and exits from the plan. Klaviyo creates flows in draft unless a status is set, and this plan never sets one. It sends a test of each message to your own address and number only, then reads every flow back.

- **Needs:** flow-plan.md (signed off); flows-copy.md; Klaviyo connector at level 2 or 3 (see access/klaviyo.md)
- **Makes:** build-record.md
- **Goes live:** Through the Klaviyo connector: templates and flows created in draft status, plus test sends to your own email address and phone number. No customer receives anything at this stage.
- **Done when:** Every step of the build plan ran once and was read back, each flow reads back as draft, and build-record.md lists flow ids, message ids and the tests sent.

### 6. Test each flow end to end

Walks each flow with your own test profile and a test order: the trigger fires, the timing is right, a purchase exits the cart and browse flows, recent buyers are filtered out, links and codes work, texts arrive inside quiet hours, and STOP and HELP replies work. It renders every email at phone and desktop width. Anything that fails is fixed in draft and tested again.

- **Needs:** build-record.md; flow-plan.md; flows-copy.md
- **Makes:** tests.md, render/
- **Checks:** render-check (every email renders without errors and reads at phone width); flow-test-review (the tests cover every trigger, exit, filter, link, code and text reply in the plan, and each one passed on the date shown)
- **Done when:** tests.md shows a pass for every trigger, exit, filter, link, code and text reply in the plan, with the date and test profile used.

### 7. Go-live card

Lists exactly what will switch on: each flow by name and id, who can enter, the expected entries per day, the flood guard, the holdout, any offer and its cap, and the test results. Flows switch on one at a time, starting with welcome and cart, so a problem shows up early. The compliance reviewer checks footers, consent and offer terms first.

- **Needs:** tests.md; flow-plan.md (signed off); build-record.md
- **Makes:** go-live.md
- **Checks:** compliance-review (each flow sends only to profiles with the right consent for its channel and region, footers and unsubscribe are present, offers and deadlines are real, and texts respect quiet hours); card-complete (every flow on the card has an id, entry rule, expected volume, flood guard and a test pass, and nothing differs from the signed-off plan)
- **Done when:** go-live.md lists each flow with id, entry rule, expected entries per day, flood guard, holdout, offer cap and a test pass, in switch-on order.
- **You sign off:** You check each flow on the card, its expected volume and its guards. Reply yes with the code to approve switching on exactly these flows in this order.

### 8. Switch the flows on

Shows you the switch-on plan: one status change per approved flow, in the approved order. On your yes it switches on each flow and reads back its status before the next. It never adds past profiles to a flow. If a read-back is wrong, it stops and tells you.

- **Needs:** go-live.md (signed off); Klaviyo connector at level 3
- **Makes:** launch-record.md
- **Goes live:** Through the Klaviyo connector: a status change to live for each approved flow, one at a time. Messages start to go to customers who trigger a flow from this step; text messages use paid credits.
- **Done when:** Each status change ran once, each flow reads back as live, and launch-record.md lists flow ids, the time each went live and the plan code.

### 9. 48 hour flood check

Two days after go-live, compares the real number of people entering each flow with the expected number, and reads bounces, complaints, unsubscribes and text opt-outs. If a flow takes in more than twice the expected number, or complaints jump, it drafts a plan to set that flow back to draft and asks you at once.

- **Needs:** launch-record.md; go-live.md; Klaviyo flow reports (read)
- **Makes:** results/early-check.md
- **Done when:** early-check.md gives entries per flow against the estimate, the guardrail rates, and either all clear or a pause plan waiting for your yes.

### 10. 14 day readout

Fourteen days after go-live, reads each flow: entries, share reaching the goal, orders and revenue per recipient, unsubscribes and complaints, against the account's old flows and the holdout where there is one. It is an early read; it changes nothing unless a guardrail broke.

- **Needs:** launch-record.md; Klaviyo flow reports (read); warehouse view shop_orders_daily
- **Makes:** results/readout-14.md, numbers.json
- **Checks:** numbers-check (every rate and total in the readout recomputes from the figures pulled from Klaviyo and the shop)
- **Done when:** readout-14.md gives each flow's numbers with inputs and date range, and says whether anything needs action before day 30.

### 11. 30 day readout and call

Thirty days after go-live, makes one call per flow: keep, change one message, or switch off, quoting the deciding number, its date range and the holdout gap. Klaviyo's attributed orders are checked against shop orders, so a tracking fault is not mistaken for a win.

- **Needs:** results/readout-14.md; Klaviyo flow reports (read); warehouse view shop_orders_daily; context/goals.json
- **Makes:** results/readout-30.md, numbers.json
- **Checks:** numbers-check (every rate and total in the readout recomputes from the figures pulled from Klaviyo and the shop); readout-review (each number matches its source for the stated dates, Klaviyo orders are checked against shop orders, and each call is supported by the holdout or baseline)
- **Done when:** readout-30.md gives one call per flow with the deciding number, the holdout or baseline it beat or missed, and the gap between Klaviyo and shop orders.

### 12. Act on the call

For a switch-off call, shows you a plan to set that flow back to draft. For a change call, the new message goes through copy and test again before a plan swaps it in. On your yes it makes the change and reads it back. A keep call needs no plan.

- **Needs:** results/readout-30.md
- **Makes:** results/act.md
- **Goes live:** Through the Klaviyo connector: a flow set back to draft, or one approved message swapped in a live flow. Never deletes a flow.
- **Done when:** act.md records each call, the plan code if there was one, and what was read back after the change.

### 13. Write down what we learned

Adds one dated lesson per flow to context/learnings.md: what the flow does, what worked, what did not, how sure we are and what to test next. A lesson from too few entries is marked as a hunch. The next retention intake must read these.

- **Needs:** results/readout-30.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (each lesson is supported by its evidence, its confidence fits the number of entries, and a writer could use it on the next flow)
- **Done when:** learning.md holds one lesson per flow with its evidence and confidence, and the same lessons are appended to context/learnings.md.

## Where you step in

- **Flow plan and guards:** You read each flow's trigger, exits, timing, offer and cap, holdout and guards, and the expected entries per day. Reply yes with the code to approve the plan. Switching any flow on needs a separate yes later.
- **Build the flows in draft:** approve the exact plan of live changes
- **Go-live card:** You check each flow on the card, its expected volume and its guards. Reply yes with the code to approve switching on exactly these flows in this order.
- **Switch the flows on:** approve the exact plan of live changes
- **Act on the call:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json (for most stores, repeat purchase rate or flow revenue per recipient).
- Flow numbers: share of people who enter each flow and reach its goal (first order, recovered cart, second order, return purchase), and how long it takes.
- Guardrails: unsubscribe rate, spam complaint rate, text opt-outs, and discount cost per order where a flow carries an offer.
- Lift: orders from each flow against its holdout, where the list is big enough to hold one.
