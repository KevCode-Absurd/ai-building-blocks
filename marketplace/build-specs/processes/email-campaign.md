# Email or SMS campaign, from plan to readout

One email or text campaign sent to a consented segment you approved, at the time and with the send strategy you approved, then read at 24 and 72 hours against shop orders, leaving a dated lesson for the next send.

**Starts from:** A growth plan task, a date on the email calendar (a launch, a restock, a sale), a lesson from an earlier readout, or you asking for a campaign.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Imogen (imogen-retention) | intake.md | intake-complete | no | read |
| 2 | Campaign plan and segment | Imogen (imogen-retention) | plan.md, cost-estimate.json | plan-review | yes | draft |
| 3 | Write the email or text | Lucia (lucia-email-copy) | copy.md | copy-lint, readability, copy-review | no | draft |
| 4 | Images and layout | Ayaka (ayaka-ad-design) | design/images.md, email.html, spend.json | logo-contrast, render-check, design-review, spend-within-budget | no | draft |
| 5 | Build the draft, count and test | Morag (morag-email-sms) | build-record.md | consent-gate, build-review | yes, the plan | publish |
| 6 | Send approval card | Morag (morag-email-sms) | approval.md | compliance-review, card-complete | yes | draft |
| 7 | Schedule the send | Morag (morag-email-sms) | send-record.md | none | yes, the plan | publish |
| 8 | 24 hour read: did it land safely? | Morag (morag-email-sms) | results/readout-24h.md, numbers.json | numbers-check | no | read |
| 9 | 72 hour readout | Imogen (imogen-retention) | results/readout-72h.md, numbers.json | numbers-check, readout-review | no | read |
| 10 | Write down what we learned | Imogen (imogen-retention) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects every fact the campaign needs before anyone writes: who it is for, the gap or moment we are solving (a new product, a lapsed group, a restock), the offer and its true terms, what past sends taught us, how many people have email or text consent, and which connectors we can reach. It reads Klaviyo through a read-only connection only. Anything missing becomes a question for you.

- **Needs:** context/org-context/ (customers, voice, design, claims, do's and don'ts); context/goals.json; context/learnings.md; Klaviyo campaign and flow results for the last 90 days (read-only connector or your export); shop orders for the last 90 days (warehouse view shop_orders_daily or a Shopify export); the email calendar and the task that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, consent counts come from Klaviyo or an export, and missing facts are answered questions, not guesses)
- **Done when:** intake.md names the audience, the gap, the one message, the offer and its terms, the consent counts by channel and region, the last three similar sends and what they taught us, and the questions you answered.

### 2. Campaign plan and segment

Writes the plan in one page: the one goal, the offer and any cap, the channel (email, text or both), the segment rules, the exclusions, the send date and time in the subscriber's time zone, the send strategy, and the decision rule for the readout. The segment always includes the consent gate: email goes only to profiles whose email marketing consent is subscribed, and texts only to profiles whose SMS consent is subscribed. Never subscribed is not consent. It excludes recent buyers of the same product, people in an active flow that would collide, people who complained, and anyone over the frequency cap you set. If images are needed that we do not already hold, it estimates their cost.

- **Needs:** intake.md; context/learnings.md; context/org-context/ consent and frequency rules
- **Makes:** plan.md, cost-estimate.json
- **Checks:** plan-review (the segment rules can be built in Klaviyo as written, the consent gate and exclusions are present, the send time has a time zone, and nobody would go over the frequency cap)
- **Costs money:** Sets the image budget for this campaign, if new images are needed. Most campaigns reuse your real product photos and cost nothing here.
- **Done when:** plan.md has one goal, the offer with its terms, written segment and exclusion rules that include the consent gate, the send time with its time zone, the send strategy, and the decision rule for the readout.
- **You sign off:** You read the goal, offer, segment rules, exclusions, send date and any image budget. Reply yes with the code to lock them. This is not yet the yes to send; that comes later, with the real recipient count.

### 3. Write the email or text

Writes the subject line, preview text, body, button text and sign-off for the email, and the text message if there is one. One idea and one main action per message. The subject is honest, with no fake Re: or Fwd: and no invented urgency. A text names the brand, stays inside one or two segments where it can, and ends with how to opt out. Every claim, price and deadline is marked with its proof.

- **Needs:** plan.md (signed off); context/org-context/ voice and claims; context/learnings.md
- **Makes:** copy.md
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up numbers, subject, preview and text inside their limits)); readability (the readability checker exits 0 for a consumer audience); copy-review (the subject is honest and specific, the opening pays it off, there is one idea and one action, the voice matches the Org context, and every claim is proven)
- **Done when:** copy.md has one subject line, preview text, body, button text and sign-off per message, any text message with its character count and opt-out line, and every claim marked with its proof.

### 4. Images and layout

Picks or makes the images the email needs. It uses your real product photos first. If a new scene is needed, it generates only the background and lays your real product cutout and real logo on top with an editing tool, so neither is redrawn by a model. It fits the layout to the saved template and checks it reads with images turned off. If the plan needs no new images, it writes one line saying which existing images are used.

- **Needs:** plan.md; copy.md; your real product photos and logo; context/org-context/ design rules; the Klaviyo template in use
- **Makes:** design/images.md, email.html, spend.json
- **Checks:** logo-contrast (every image with the logo has a logo contrast ratio of at least 3 to 1); render-check (the email renders without errors and the screenshots show the words and button readable at phone width); design-review (the product is the real one, the email reads with images off, the button is clear, and the layout follows the Org context design rules); spend-within-budget (money spent on image generation (spend.json) is at or under the approved estimate (cost-estimate.json))
- **Costs money:** only inside the budget you approved at plan; it stops before going over.
- **Done when:** design/images.md lists each image with its source, email.html renders on phone and desktop widths, the words match copy.md exactly, and spend.json records any generation cost.

### 5. Build the draft, count and test

Shows you a build plan of exact Klaviyo tool calls, then on your yes creates the template, the segment with its consent gate, and the campaign as a draft. A Klaviyo campaign stays a draft until a send job runs, so nobody gets anything. It then runs Klaviyo's recipient estimate and sends one test to your own address only, never to a customer. It reads everything back and records the estimate.

- **Needs:** plan.md (signed off); copy.md; email.html; Klaviyo connector at level 2 or 3 (see access/klaviyo.md)
- **Makes:** build-record.md
- **Checks:** consent-gate (the segment read back from Klaviyo matches plan.md, it only includes profiles subscribed to the channel being sent, and every exclusion from the plan is applied); build-review (the test email or text matches copy.md word for word, links and codes work, and the unsubscribe link and footer are present)
- **Goes live:** Through the Klaviyo connector: a template, a segment and a campaign created as a draft, a recipient estimate, and one test send to your own address. No customer is sent anything at this stage.
- **Done when:** Every step of the build plan ran once and was read back, the campaign reads back as a draft, build-record.md gives the campaign id, segment ids and the recipient estimate, and you received the test.

### 6. Send approval card

Puts the exact send on one card: the channel, the segment names and ids, the excluded segments, the recipient estimate, the subject line, a screenshot of the test, the send date and time with its time zone, the send strategy (static, set at least 30 minutes ahead so it can still be stopped), whether smart sending is on, and for texts the quiet hours. The compliance reviewer checks the footer, the unsubscribe link, the postal address, honest headers, offer terms and text consent before the card reaches you.

- **Needs:** build-record.md; plan.md; copy.md; the test you received
- **Makes:** approval.md
- **Checks:** compliance-review (honest sender and subject, a working unsubscribe, the postal address, real offer terms, consent fits each region (CAN-SPAM, PECR, ePrivacy), and texts respect consent and the 8 a.m. to 9 p.m. local time rule); card-complete (the card shows channel, audience, exclusions, recipient estimate, send time with time zone and static strategy, and nothing on it differs from the signed-off plan)
- **Done when:** approval.md shows the channel, audience, exclusions, recipient estimate, subject, test screenshot, send time with time zone, send strategy, smart sending setting and the compliance PASS on one page.
- **You sign off:** You check the audience, the count, the send time and the strategy on the card. Reply yes with the code to approve exactly that send. If the count, time or segment changes after this, the code stops working and you get a new card.

### 7. Schedule the send

Shows you the schedule plan: one send job for the approved campaign, static strategy, at the approved time. Before the call it reads the recipient estimate again; if it moved by more than a tenth from the card, it stops and asks you. On your yes it schedules the send and reads back the status. Until the send time you can still cancel; Klaviyo lets a scheduled campaign go back to draft only when the send is more than 15 minutes away, and a cancelled campaign must be cloned to send again. A sent email or text cannot be called back.

- **Needs:** approval.md (signed off); Klaviyo connector at level 3
- **Makes:** send-record.md
- **Goes live:** Through the Klaviyo connector: one send job for the approved campaign with a static send time at least 30 minutes ahead. Text messages use paid message credits from this step.
- **Done when:** The send job ran once, the campaign reads back as scheduled for the approved time, and send-record.md gives the campaign id, the time, the strategy and the final recipient estimate.

### 8. 24 hour read: did it land safely?

One day after the send, reads delivery, bounces, spam complaints, unsubscribes and clicks from Klaviyo reporting (its reporting calls are rate limited, so it pulls once). It does not judge sales yet. If complaints or bounces jumped, it says so first and pauses any follow-up send in the plan until you decide. If the send time was more than a day after scheduling, this read waits until 24 hours after the send.

- **Needs:** send-record.md; Klaviyo campaign report (read)
- **Makes:** results/readout-24h.md, numbers.json
- **Checks:** numbers-check (every rate and total in the readout recomputes from the figures pulled from Klaviyo and the shop)
- **Done when:** readout-24h.md gives recipients, delivered, bounce, complaint, unsubscribe and click rates with their inputs, compared with the last three similar sends, and any problem with its next step.

### 9. 72 hour readout

Reads orders and revenue from the campaign against the decision rule written in the plan, and checks Klaviyo's attributed orders against shop orders for the same dates, so a tracking fault is not mistaken for a win. Where a holdout was set, it compares the two groups. It quotes each number with its date range and attribution window.

- **Needs:** results/readout-24h.md; Klaviyo campaign report (read); warehouse view shop_orders_daily; plan.md decision rule; context/goals.json
- **Makes:** results/readout-72h.md, numbers.json
- **Checks:** numbers-check (every rate and total in the readout recomputes from the figures pulled from Klaviyo and the shop); readout-review (each number matches its source for the stated dates, Klaviyo orders are checked against shop orders, and the call follows the rule written in the plan)
- **Done when:** readout-72h.md gives orders, revenue per recipient, click rate and the guardrails, the gap between Klaviyo and shop orders, and a call against the plan's decision rule.

### 10. Write down what we learned

Adds one dated lesson to context/learnings.md: what was sent (segment, offer, subject angle, send time, channel), what happened, how sure we are, and what to try next. A lesson from a small segment or one send is marked as a hunch, not a rule. The next email intake must read it.

- **Needs:** results/readout-72h.md; plan.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the sample, and a writer could use it on the next brief)
- **Done when:** learning.md holds one lesson with its evidence (recipients, dates, the metric and its change) and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Campaign plan and segment:** You read the goal, offer, segment rules, exclusions, send date and any image budget. Reply yes with the code to lock them. This is not yet the yes to send; that comes later, with the real recipient count.
- **Build the draft, count and test:** approve the exact plan of live changes
- **Send approval card:** You check the audience, the count, the send time and the strategy on the card. Reply yes with the code to approve exactly that send. If the count, time or segment changes after this, the code stops working and you get a new card.
- **Schedule the send:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json (for most stores, placed-order revenue per recipient or orders from the campaign).
- Campaign numbers: click rate, orders and revenue per recipient, checked against shop orders for the same dates.
- Guardrails: unsubscribe rate, spam complaint rate and bounce rate. Gmail asks bulk senders to keep the spam rate below 0.1% and never reach 0.3%.
- Cost: any image generation spend against the estimate you approved, and text message credits used.
