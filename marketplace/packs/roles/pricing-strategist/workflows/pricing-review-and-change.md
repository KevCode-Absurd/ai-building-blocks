# Pricing review and change

**Trigger:** once a quarter, or when costs jump, margins slip, a rival moves, or the owner asks "should we raise prices?". Ends with a decision and, if approved, a change carried out safely. General practice: check this with local rules at each step that touches how prices are shown or what customers signed up to.

## Steps

1. **Access and scope.** Ask which access level the client grants for the sheet, store, billing, CRM and accounting tools, and the limits. Write "Access I have". Level 1 until they answer. Confirm which products or plans are in scope and whether existing customers are included.
2. **Cost floor.** Pull costs from the accounting tool or the client's figures (level 1). Build the floor for each product or plan with the **price-recommendation** skill, step 1.
3. **What happened since last time.** Run the **price-test-and-readout** skill on any price change or promotion in the period, with a comparison group.
4. **Rivals and buyers.** Update rival prices on the same basis from public sources the client provides. If buyer evidence is thin, run the **buyer-pricing-questions** prompt and pause until answers come back.
5. **Options.** Run the **price-recommendation** skill for each product or plan in scope; run the **tiers-and-packaging** skill if the plan structure itself needs to change.
6. **Discounts.** Review discounts given in the period against the policy with the **discount-and-promotion-rules** skill; tighten the policy if discounts leaked below floors.
7. **Decision meeting.** Present options with margin, break-even volume and risk. The client decides. Record the decision, the price list, floors and dates.
8. **New buyers first.** Level 2: create new prices unused and a pricing page draft. Level 3: apply the approved prices for new buyers on the approved date. Run the **price-display-check** prompt on every page, email and ad first.
9. **Existing customers (only if approved).** Read the customer terms; check this with local rules and ask a qualified lawyer about notice and consent. Run the **price-rise-letter** prompt. Get the client's fresh yes before sending the notice, and again before moving any subscription or contract to the new price.
10. **Watch and report.** Until at least one full billing or buying cycle has passed after the change: cancellations, downgrades, complaints, refunds, win rate and contribution. Log every action. Stop and ask if cancellations or complaints spike.

## Outputs

- Access table and scope.
- Cost floors and the readout of the last period's changes.
- Rival comparison on one basis and the buyer evidence summary.
- Price options with margins, and the decision record.
- Updated discount policy, if needed.
- Checked price displays and the new pricing page.
- Price rise letter and key-account version, if approved.
- Action log and a post-change report.

## What needs the client's approval

- The access level and limits for each tool.
- The price decision, price list, floors and dates.
- At level 3, the action list and limits before the first live change.
- A fresh yes every time for: sending a price rise notice, moving existing customers to a new price, any new "was" price or deadline, binding quotes, and discounts below the floor.
- Refunds above the client's limit, credits and payouts stay with the client.
