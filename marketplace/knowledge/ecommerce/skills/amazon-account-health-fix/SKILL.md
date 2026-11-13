---
name: amazon-account-health-fix
description: "An account health repair file for an Amazon seller: every red or at-risk item on the Account Health dashboard (order defect rate, late shipment, cancellations, valid tracking, policy violations, IP complaints, authenticity, safety, review abuse, listing policy) with its real cause traced to orders and listings, the operational fix, the documents to gather, and a plan of action written in Amazon's three-part form ready for the client to approve and submit. Writes only true statements and real documents, and stops practices that caused the problem before appealing. Use when a metric crosses Amazon's line, when listings or the account are deactivated, when a warning or IP complaint arrives, or as a monthly health check."
---

# Fix Amazon account health

**You get:** a repair file with one row per account health issue (metric or policy, cause, fix, owner, date, documents), plus a ready-to-submit plan of action for each issue that needs one, written as root cause, actions taken and prevention, with an evidence list, for the client to approve before anything is sent to Amazon.

## When to use

- A metric on the Account Health dashboard is at risk or over Amazon's line.
- Listings, an ASIN or the whole account are deactivated or under review.
- A policy warning, IP complaint, authenticity or safety complaint arrives.
- The Featured Offer drops and the cause looks like seller performance.
- As a monthly check before problems start.

## Not for

- Featured Offer loss from price, stock or rival offers: use `win-the-buy-box`.
- Building reviews the right way from the start: use `get-early-amazon-reviews`.
- Stockouts and FBA planning: use `plan-fba-inventory`.
- Card or bank chargebacks on the store's own site: use `win-chargeback-disputes`.

## What you need

Required:

1. **Account Health dashboard** screenshot or export, with each item's status and the dates.
2. **Every notice from Amazon** about the issue: the full email or Performance Notification text, word for word.
3. **The orders behind the metric**: order reports filtered to the defect, late, cancelled or untracked orders, with dates, carrier and tracking.
4. **For product complaints**: the ASINs named, supplier invoices, test reports, certificates, labels and photos.
5. **For IP complaints**: the rights owner's name, complaint ID, and the brand's own trademark or authorisation papers.

Optional: Voice of the Customer page, A-to-z claims and chargeback list, negative feedback list, shipping settings.

Reading is level 1. Changing shipping settings or listings is level 2. A plan of action, appeal, dispute evidence or reply to a rights owner goes to Amazon only with the client's fresh yes, even at level 3. Never ask for or use the client's password; the client signs in.

## Before you start: the gates

1. **Stop the cause first.** Whatever caused the issue (late dispatch, a review scheme, a wrong product, a listing claim) stops before any appeal. Fail: no appeal; Amazon reads the actions taken section, and "we will" is weaker than "we did".
2. **Every statement true, every document real.** No invented root causes, no edited or made-up invoices, no admission of something that did not happen. Fail: stop; a false document can end the account.
3. **Know the deadline.** Note any response date in the notice. Fail: if it is under 48 hours, file the shortest true plan now and add detail later if Amazon allows.
4. **Legal questions go to a lawyer.** IP disputes and product safety issues can carry legal risk; share general practice only.

## Steps

1. **List every item.** One row per dashboard item and notice: what it is, current value, Amazon's line, window, status, deadline.
2. **Check each metric against Amazon's line.**
   - Order defect rate (negative feedback, A-to-z claims, chargebacks): keep under 1% [AMZ-6444].
   - Late shipment rate, seller-fulfilled only, 10 or 30 days: under 4% [AMZ-6443].
   - Pre-fulfilment cancel rate, seller-fulfilled only, 7 days: under 2.5% [AMZ-6443].
   - Valid tracking rate, seller-fulfilled only, 30 days, per category: over 95% [AMZ-6443].
   Breaking these or selling policies can mean deactivation, loss of Featured Offer eligibility and withheld funds [AMZ-6444]. Seller performance also feeds Featured Offer selection [AMZ-6442].
3. **Trace each metric to orders.** Pull the orders behind the number and group by cause:
   - **Late shipments:** handling time set shorter than the warehouse can meet; weekend orders; carrier pick-up missed; ship confirmation entered late.
   - **Cancellations:** stock not synced between channels; price errors.
   - **Invalid tracking:** wrong carrier name, tracking not uploaded, unsupported carrier.
   - **Order defects:** product problems (read the feedback words), late or damaged delivery, unanswered buyer messages before an A-to-z claim.
4. **Fix the operation, then measure.** Set handling time to what the warehouse meets on its worst normal day; sync stock across channels or keep a buffer; upload tracking with the exact carrier name; answer buyer messages within 24 hours; move persistently late SKUs to FBA. In the US, a seller who cannot ship on time must tell the buyer and offer to wait or cancel for a refund [CXP-6160].
5. **Policy and product issues.** For each notice, name the policy in Amazon's words and the exact ASIN.
   - **Listing policy or restricted product:** fix or remove the claim or listing; attach the corrected text.
   - **Authenticity:** gather supplier invoices that cover the units sold in the period Amazon names, with supplier contact details. A supplier who will not confirm is a supplier to drop.
   - **Safety:** test reports and certificates for the product. For India, the Legal Metrology declarations on the pack [COG-6264] and the BIS licence if a Quality Control Order applies [COG-6266].
   - **IP complaint:** if the brand did infringe (used a rival's mark, image or design), remove it and ask the rights owner to withdraw the complaint. If the complaint is wrong (the brand owns the mark or bought genuine stock), send the rights owner the evidence and ask for withdrawal; reply in Amazon's form with the facts. Never make a counter-complaint without basis.
   - **Review abuse:** stop every banned practice: incentives, packaging requests, asking reviewers to change reviews, outside messaging [AMZ-6448]. In the US, fake and insider reviews are also banned by federal rule [MCR-6045]. Say plainly what was done and what stopped, with dates.
6. **Write the plan of action** in three parts, short and factual:
   - **Root cause:** the specific failure, with numbers ("12 of 310 orders shipped late in 30 days because handling time was 1 day while dispatch ran 2 days on weekends").
   - **Actions taken:** what has already changed, with dates and evidence ("On 4 Nov set handling time to 2 days; on 5 Nov added Saturday dispatch").
   - **Prevention:** what keeps it from coming back, who checks, how often.
   No blame on Amazon or buyers, no emotion, no promises the business cannot keep, no copied templates.
7. **Attach evidence.** Only documents that prove a line in the plan, named clearly (`invoice-supplier-2026-09.pdf`). Remove prices from invoices only where Amazon's instructions allow; otherwise send as issued.
8. **Get the client's yes, then submit.** Show the plan beside the notice. Submit through the Account Health page or the notice's appeal link. Log the date and case ID.
9. **Follow up.** Watch the dashboard and email daily until resolved. If Amazon asks for more, answer only what it asks. If refused twice the same way, change the approach (new evidence or a clearer root cause) rather than resending.
10. **India notes (Amazon.in).** The same metrics apply to self-shipped orders. Cash-on-delivery refusals are a delivery issue; keep promised dates honest by pincode. GST invoices must match the seller's GSTIN; a mismatch can block payouts.
11. **US notes.** State consumer and product safety rules can apply to recalled or restricted products; a lawyer advises on recall duty.
12. **Set the monthly check.** First Monday of each month: dashboard, each metric against its line, open notices, Voice of the Customer complaints.

## Checks before you hand it over

- Every dashboard item and notice has a row with cause, fix, owner and date.
- Each metric is compared with Amazon's stated line and window.
- Each root cause is backed by order data or documents, with numbers.
- Actions taken are already done, with dates; nothing is only promised.
- Every attached document is real, relevant and named.
- No statement blames Amazon or buyers; no invented cause.
- Nothing sent to Amazon or a rights owner without the client's fresh yes.

## Output

**One-screen summary:** account status, items at risk or failed, deadlines, the cause of each in one line, plans ready for approval, and what the client must decide today.

**Repair table:** Item | Type (metric, policy, IP, authenticity, safety, reviews) | Value vs line | Window | Cause | Orders or ASINs affected | Fix | Owner | Done date | Documents | Plan of action needed (yes or no) | Deadline.

**Plan of action (one per issue):**

> **Issue:** [notice name, ASIN or metric, notice date]
> **Root cause:** [specific failure with numbers]
> **Actions taken:** [dated changes already made, with evidence file names]
> **Prevention:** [process, owner, check frequency]
> **Attached:** [file list]

**Log:** Date | Action | Case ID | Amazon reply | Next step.

## Common mistakes

- **Appealing before fixing.** Gate 1 stops the cause first.
- **Vague root causes ("human error").** Step 6 names the failure with numbers.
- **Edited invoices or made-up documents.** Gate 2 bans them.
- **Short handling times to look fast.** Step 4 sets what the warehouse meets.
- **Ignoring IP complaints or filing angry counter-claims.** Step 5 handles them with evidence through the rights owner.
- **Resending the same appeal.** Step 9 changes the approach after two refusals.

## Sources

- AMZ-6443: late shipment, cancel and valid tracking targets and windows.
- AMZ-6444: order defect rate under 1% and policy consequences.
- AMZ-6442: seller performance feeds Featured Offer selection.
- AMZ-6448: banned review practices.
- MCR-6045: US ban on fake and insider reviews.
- CXP-6160 and CXP-6160: US mail order rule on shipping promises and delays.
- COG-6264 and COG-6266: India pack declarations and BIS marks.

What makes this skill ours: every metric is traced to the actual orders behind it before any words are written; the plan of action reports changes already made, with dates and numbers; documents must be real and only those that prove a line go in; and nothing reaches Amazon or a rights owner without the client's fresh yes.
