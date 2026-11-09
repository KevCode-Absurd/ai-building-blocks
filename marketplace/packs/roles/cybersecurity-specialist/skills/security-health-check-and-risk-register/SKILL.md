---
name: security-health-check-and-risk-register
description: Runs a plain-language security health check for a small business from a question set the owner answers (no passwords), scores each gap by likelihood and impact in words the owner agrees, builds a risk register with owners, decisions and review dates in the spirit of NIST IR 8286 Rev. 1, maps fixes to the six NIST CSF 2.0 functions so Detect, Respond and Recover are not forgotten, and turns the top fixes into a 90-day plan with effort, cost band and the access level each step needs. Use it for offices, clinics, agencies, trades, charities and small online stores of 1 to 100 people, at the start of an engagement or at each quarterly review. Applies agreed settings only with level 3 access within the change list, and never scans or tests systems without the owner's written authorisation.
---

# Security health check and risk register

## When to use

- A small business asks "where are we weak, and what do we fix first?"
- A new client engagement starts and there is no risk register.
- A quarterly review is due.
- After an incident or near miss, to reset priorities.
- A supplier, insurer or customer asks what the business does about security.

Do not use it to certify the business against a standard, to give insurance or legal advice, or to scan and test systems. It works from answers, exports and settings the client shares.

## Access needed

- **Level 1 (read):** answers to the question set; user export with MFA status; settings screenshots or reader-role access to Microsoft 365, Google Workspace and the store.
- **Level 2 (read and draft):** the register, plan and change list in the agreed folder.
- **Level 3 (read, write and publish):** apply agreed items from the change list (for example turn on two-step sign-in requirements, tighten sharing defaults, enable mail protections) within the limits set. Admin role changes, isolating devices and deleting data need a fresh yes every time.

## What you need

1. Answers to the question set below. Rough answers are fine; "don't know" is an answer.
2. The platforms: email and files (Microsoft 365, Google Workspace, other), store and payment provider, accounting and payroll.
3. Who the IT firm, web host and key suppliers are.
4. Past incidents or near misses, in the owner's words.
5. Where the business operates and what data it holds (customer, health, payment, children's).

**Question set (never includes passwords):**
- How many staff and devices? Who owns each device?
- Does every person have their own email login? Is two-step sign-in on for all of them, and for every admin?
- How many people are admins? Who else could get in if the main admin were locked out?
- Do staff use a password manager?
- Are devices set to update automatically? Any computers on systems that no longer get updates?
- What is backed up, where, how often, and when did you last restore something?
- Who can pay invoices or change a supplier's bank details, and how is a change checked?
- How do staff report a suspicious email or call? Has anyone reported one this year?
- Is there a written plan for a cyber incident, with phone numbers on paper?
- For stores: how many staff logins, which apps are installed, any odd order patterns?

## Steps

### 1. Collect and confirm

Read the answers and exports. Confirm anything that looks contradictory. Mark unknowns: an unknown is often a gap.

### 2. Score each gap

For each gap, describe likelihood and impact in words the owner agrees (for example "likely, because phishing is common" and "severe, because payments could be redirected"). Do not invent numeric scores; if the client uses a scale, use theirs. The UK breaches survey shows phishing is the most common attack, so gaps around email, MFA and payment checks usually rank high.

### 3. Build the risk register

One row per risk: asset, threat, likelihood, impact, existing controls, decision (reduce, accept, transfer, avoid), owner, next action, review date. Accepting a risk is the owner's decision, recorded with a reason.

### 4. Map to CSF 2.0

Tag each action Govern, Identify, Protect, Detect, Respond or Recover. Check the plan has at least one action in each function. Common gaps: no owner (Govern), no asset list (Identify), no one reads alerts (Detect), no incident plan (Respond), no tested restore (Recover).

### 5. Pick the first fixes

Free, high-impact basics first: MFA on email and admin accounts, a call-back rule for payment changes, a reporting route for phishing, automatic updates, a tested backup, a one-page incident plan. Then paid tools if gaps remain. For MFA, admin and backup set-up details, use the `it-administrator` kit.

### 6. Write the 90-day plan

A table: fix, risk it reduces, owner, effort, cost band (free, low, needs a quote), access level needed, due week. Spread the work so the owner can keep it up.

### 7. Agree and act

Show the plan and change list. At level 3, after the owner's yes, apply the agreed items and log each one. Anything outside the list, any admin role change, any device isolation and any deletion waits for a fresh yes.

### 8. Set the review

Put the next review date on the register. Each review compares this quarter's answers with last quarter's.

## Checks

- No password, code, key or token was asked for or recorded.
- Every register row has a decision, an owner and a review date.
- Likelihood and impact are in words the owner agreed, not invented numbers.
- Each CSF function has at least one action, or the gap is named.
- The first fixes are free basics unless the owner already has them.
- Every plan item names the access level it needs.
- Reporting duties (GDPR, US state laws, FTC Safeguards Rule, sector rules) are flagged for the client's adviser, not decided.
- No scanning or testing is planned without the owner's written authorisation.

## Output format

1. **Health check summary:** three lines first: biggest risk, quickest win, what I need from you.
2. **Scored question list** with plain reasons.
3. **Risk register** table.
4. **CSF map:** actions by function, gaps named.
5. **90-day plan** table.
6. **Change list** for level 3 items, with "needs a fresh yes" flags.
7. **Next review date.**

## Example

*Illustrative structure, not a real business: a dental practice. Copy the shape, never the content: every fact comes from the client's own context.*

**Summary:** Biggest risk: payment-change fraud, because any of three staff can update supplier bank details from an email. Quickest win: two-step sign-in on all six mailboxes this week (free). I need: the name of your IT firm contact and who should own the register.

**Risk register (extract):**

| Risk | Asset | Likelihood | Impact | Controls now | Decision | Owner | Next action | Review |
|---|---|---|---|---|---|---|---|---|
| Supplier bank details changed by a fake email | Payments | Likely (phishing is common, details are public) | Severe (lab invoices are large) | None | Reduce | Practice manager | Call-back rule on a known number; two people approve changes | Feb 2027 |
| Ransomware locks patient system | Patient records | Possible | Severe | Nightly backup to a drive that stays plugged in | Reduce | IT firm | Offline copy, restore test | Feb 2027 |

**90-day plan (extract):**

| Fix | Owner | Effort | Cost band | Access level | Week |
|---|---|---|---|---|---|
| Two-step sign-in on all mailboxes | IT firm | 2 hours | Free | Level 3 in Microsoft 365, after your yes | 1 |
| Call-back rule and two-person approval | Practice manager | 1 hour | Free | None (process) | 1 |
| One-page incident plan, rehearsed | Owner and me | 2 hours | Free | Level 2 | 4 |
