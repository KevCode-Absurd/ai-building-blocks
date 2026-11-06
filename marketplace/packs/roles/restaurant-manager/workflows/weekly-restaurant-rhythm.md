# Weekly restaurant rhythm

**Cadence:** Every week, on the same quiet day (often Monday or Tuesday morning).

**Trigger:** The owner starts weekly reviews, a new manager takes over, or the same problems keep coming back.

**Access:** Level 1 (read) on the till, booking tool, logs, reviews and rota is enough to write the review. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "reply to 4 and 5 star Google reviews and routine 1 to 3 star reviews; publish the rota in Square and notify affected staff; update Google hours; nothing else").

## Steps

1. **Collect.** Pull covers, sales, item sales, ticket times, labour hours, the waste log, shift logs and new reviews for the week. Note any review or log entry about illness or an allergic reaction and send it to the owner at once.
2. **Review.** Run the `weekly-restaurant-review` skill: last week's fixes, numbers, themes, causes and three fixes with owners, dates and measures. [L2] Save it as a draft in the agreed place.
3. **Prep pars.** If run-outs or waste are in the top themes, rerun the `prep-par-levels` prompt for the affected items and update the prep lists with the `kitchen-checklists-prep-and-station-guides` skill.
4. **Reviews.** Run the `restaurant-review-replies` prompt. [L3] Post the routine replies within the limits. Hold the rest for the owner. *Approval: the owner approves every reply to a formal complaint, illness or allergy report, each time.*
5. **Rota.** Run the `rota-draft-against-covers` prompt for next week. [L2] Build it in the rota tool without publishing. *Approval: the owner checks the flagged lines against local rules and approves the rota.* [L3] Publish and notify the affected team.
6. **Online housekeeping.** [L3] Update sold-out items, Google hours and special hours, and menu changes already approved. Check allergen notes match the signed-off record: check this with your local food safety authority.
7. **Stock orders.** [L2] Draft next week's orders from pars and counts, within the confirmed budget. *Approval: the owner says yes to each order before it is sent, every week.*
8. **Publish the review.** [L3] Post the one-page review to the agreed channel, with the action log at the foot.

## Outputs

- One-page weekly review with three fixes
- Updated prep pars and prep lists (when needed)
- Review replies posted, drafted or held
- Rota draft with flags, then the published rota
- Online housekeeping done and logged
- Draft stock orders for the owner's yes
- Action log of every live change

## Needs the client's approval

The three fixes and their owners; each rota before publishing; each stock order before it is sent; replies to formal complaints, illness or allergy reports and legal threats; any new menu item, price or allergen line; anything outside the agreed limits. Paying suppliers, refunds above the owner's limit, pay and staffing decisions stay with the owner.
