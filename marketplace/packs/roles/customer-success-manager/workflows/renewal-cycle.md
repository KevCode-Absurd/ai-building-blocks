# Renewal cycle

**Trigger:** A customer's renewal date falls inside the planning window (often about 90 days out for annual contracts; set it from the contract's notice period and any legal notice window). Runs per customer or as a monthly batch.

## Steps

1. **Check the terms.** Read the contract or plan terms, notice period, price, how the customer signed up and where they are. Flag consumer rules that apply by place (for example California notice windows, UK and EU rules). *Check this with local rules before sending; ask a qualified adviser if the terms are unclear.*
2. **Mark risk.** Pull the health score and the reasons. Risky renewals get a person's call before any email (the `health-score-and-save-plan` skill).
3. **Plan the steps.** Use the `renewal-and-price-change` skill to set dates for the check-in, value recap, renewal conversation and final reminder.
4. **Write the recap and notices.** Value recap from checkable facts only; renewal notices stating what renews, the date, the amount and how to cancel. *Approval: owner approves the notice templates once, and any change to price or terms every time.*
5. **Send on schedule.** At level 2, drafts are queued for the owner to send. At level 3, notices go out on the planned dates to the agreed customers, and every send is logged.
6. **Handle replies.** Questions answered from the terms; plan changes the customer asks for applied at level 3 within limits; cancellation requests processed promptly, with one fitting offer if there is one (the `fair-cancel-flow-and-win-back` skill). *Approval: discounts above the cap, refunds and contract changes.*
7. **Upgrade where it fits.** Only for customers whose use points to a higher plan, in a separate message that follows marketing rules.
8. **Close out.** Record the result (renewed, changed plan, cancelled, reason), update the renewal date and forecast, and note lessons for the next cycle.

## Outputs

- Renewal calendar and risk notes
- Value recaps and sent or drafted renewal notices
- Logged replies, plan changes and cancellations
- Renewal results and forecast update

## Needs the client's approval

Notice templates, any price change, discounts or credits above the cap, refunds, contract or term changes, and messages to customers outside the agreed list.
