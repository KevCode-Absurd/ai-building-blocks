# Partner programme launch

**Trigger:** The client wants to start a referral, reseller or distributor programme, or rebuild one that is not producing sales.

**Cadence:** One run of about six to ten weeks from design to the first partners' 30-day review; the timing depends on the client's lawyer.

**Access:** On the first run, ask which level the client grants for the CRM, the partner tool, the website and email, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the agreed limits.

## Steps

1. **Gather facts.** Price, margin per sale after delivery, support and refunds, buyers, existing partners and what they were promised, markets (countries and US states). Ask for exports at level 1.
2. **Design.** Run the `partner-programme-design` skill: margin working, partner types, deal, tiers, rules, how the deal ends. *Approval: the client agrees the deal and the discount and commission range I may offer without asking again.*
3. **Price wording check.** Run the `resale-price-wording-check` prompt on every draft that mentions prices, discounts or funds.
4. **Lawyer and accountant.** Write the `partner-deal-summary` prompt output for each partner type. *Approval: the client's lawyer turns it into the agreement; a qualified accountant advises on payout tax forms. Nothing is signed or sent as binding without the client's fresh yes.*
5. **Set up tools.** [L2] Partner properties and deal registration fields in the CRM, partner groups and offers in the partner tool, a draft programme page. [L3] Switch them on after the client approves.
6. **Launch pack.** Run the `partner-launch-pack` prompt. [L2] Draft the page and announcement. [L3] Publish the page and send the announcement to the approved list. *Approval: the client approves the page, the list and the launch date.*
7. **Recruit.** Run the `partner-recruitment-pitch` prompt for the first partner type. [L3] Send to the approved list and log replies. A new list needs a fresh yes.
8. **Onboard.** Run the `partner-onboarding-and-scorecard` skill, steps 1 and 2, for each new partner. [L3] Approve partners who meet the written criteria and send the welcome steps.
9. **30-day review.** For each partner: training done, first customers named, first deal registered or not, blockers. Report to the client with next steps.

## Outputs

- Programme design with margin working
- Price-wording-checked documents
- Deal summaries for the lawyer
- CRM and partner tool set-up
- Launch pack, published page and announcement
- Recruitment emails and replies log
- Onboarded partners and their 30-day review

## Needs the client's approval

The access levels; the deal and the agreed range; every agreement before signing or sending as binding; the launch page, list and date; any new recruitment list; partner approvals outside the written criteria; and every payment, which the client releases. Prices resellers charge are never set by the programme.
