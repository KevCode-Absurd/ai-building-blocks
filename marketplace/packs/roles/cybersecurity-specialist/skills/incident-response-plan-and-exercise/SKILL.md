---
name: incident-response-plan-and-exercise
description: Writes a one-page what-to-do-if-hit plan for a small business or store (who decides, who to call, first steps, what to save, how to talk if email is down, how to tell customers, how to recover to minimum viable operations), adds the region's reporting routes for the client's adviser to confirm, and runs a 45 to 60 minute tabletop exercise to test it, using NIST SP 800-61 Rev. 3, the NCSC's response and recovery guidance and Exercise in a Box. Use it when there is no plan, after a near miss, before cyber insurance renewal, or yearly. During a live incident it gives the first steps and the facts log; containment actions in the client's tools happen only at level 3, and isolating devices, deleting data or changing admin roles need a fresh yes every time.
---

# Incident response plan and exercise

## When to use

- The business has no written plan for a cyber incident, or one nobody has read.
- After a near miss: a fake invoice nearly paid, a mailbox taken over, a ransom note on one machine.
- Before an insurance renewal, or when a customer or supplier asks for one.
- Once a year, to rehearse.
- During a live incident, for the first steps and a clean facts log while the client calls their IT firm or a specialist.

Do not use it to run a full forensic investigation, negotiate with or pay attackers, or decide legal reporting. Serious incidents need a specialist incident response firm; in the UK the NCSC recommends an NCSC-assured one.

## Access needed

- **Level 1 (read):** contacts, insurance notification terms, backup arrangements, past incident notes, sign-in and alert logs during an incident.
- **Level 2 (read and draft):** the plan, contact sheet, customer message templates and exercise pack in the agreed folder.
- **Level 3 (read, write and publish):** during an incident and within the agreed limits, take containment steps the plan lists, such as signing out sessions, blocking sign-in for a compromised account or turning on stricter checkout protection, and log each one. Isolating a device, wiping or deleting anything, changing admin roles, and sending messages to customers, regulators or insurers need a fresh yes every time.

## What you need

1. Who decides in an incident, and a deputy.
2. Phone numbers: IT firm, insurer's incident line, bank, payment provider, lawyer or adviser, key suppliers.
3. What the business must keep running (taking payments, booking, answering phones) and for how long it can manage without each system.
4. Where backups are and when a restore was last tested.
5. Where the business operates and what personal data it holds.
6. The insurance policy's notification section, if there is one.

## Steps

### 1. Agree what counts as an incident

Use the NCSC's plain definition: unauthorised access, or an attempt, to the organisation's IT systems, whether malicious or accidental. List examples staff will recognise: a ransom note, a mailbox sending spam, a fake payment made, a lost laptop, a website defaced, card-testing orders.

### 2. Name roles

Decider, deputy, the person who talks to staff, the person who talks to customers, the person who logs facts. In a small business one person may hold two roles; write that down.

### 3. Write first steps

In order, each with who does it:
1. Note the time and what was seen. Start the facts log.
2. Call the IT firm or decider by phone; assume email may be watched.
3. Contain: disconnect affected devices from the network rather than power them off, unless they cannot be disconnected (a fresh yes from the decider, every time); block sign-in and sign out sessions for affected accounts; for stores, hold fulfilment of suspect orders.
4. Save evidence: screenshots, messages with headers, sign-in logs, order and payment records. Do not wipe or rebuild yet.
5. Call the insurer's incident line if there is a policy, before spending on recovery.
6. Do not pay, reply to or negotiate with the attacker.

### 4. Add who to tell

Write the routes for the client's adviser to confirm:
- **UK:** for a live attack, the 24/7 line 0300 123 2040 (reports go to the Report Fraud Analysis Service); significant attacks to the NCSC; personal data breaches assessed against the Information Commission's guidance.
- **US:** IC3 for cybercrime; state breach laws; FTC notice within 30 days for businesses under the Safeguards Rule when 500 or more consumers are affected.
- **EU:** the data protection authority within 72 hours of becoming aware of a reportable personal data breach; NIS2 rules if the business is in scope.
Mark each [confirm with your adviser]. The clock may start when the business becomes aware, so the facts log matters.

### 5. Plan how to talk

If email is down or watched: a phone tree and a backup channel. Draft holding messages for staff, customers and suppliers, each with a "we will never ask you for" line, because breaches of contact details lead to follow-on scams. Sending any external message needs a fresh yes.

### 6. Plan recovery

Restore core functions to minimum viable operations first (for example taking payments by phone, a paper booking sheet), then restore from known-good backups, then rebuild more securely. Change any passwords or keys that may be exposed through their owners' own consoles. Record what failed and why.

### 7. Fit it on one page

Print it, store a copy offline, and put the phone numbers on paper.

### 8. Run a tabletop exercise

45 to 60 minutes with the people named in the plan. Use a scenario from NCSC Exercise in a Box or write one for the business: a scenario, three or four "injects" that change the situation, and questions at each step ("Who do you call? What do you save? What do you tell customers?"). Note where people hesitated or the plan was silent.

### 9. Fix and repeat

Update the plan with what the exercise found. Book the next exercise.

## Checks

- One page, plain words, phone numbers in place or as blanks to fill.
- Every step names who does it.
- Isolation, deletion, admin changes and external messages are marked "needs a fresh yes".
- Evidence is saved before anything is wiped or rebuilt.
- Reporting routes are marked [confirm with your adviser], with no legal ruling.
- No password, code or key appears in the plan or the log.
- The exercise produced at least one change to the plan, or says why not.

## Output format

1. **One-page plan:** roles, first steps, who to call, what to save, how to talk, recovery order.
2. **Contact sheet** with blanks.
3. **Facts log template:** time, what was seen, what was done, by whom, result.
4. **Holding messages** for staff, customers and suppliers.
5. **Tabletop pack:** scenario, injects, questions, notes sheet.
6. **After-exercise actions** with owners.

## Example

*Made-up example: "Millbrook Lettings" is invented for illustration.*

**If our computers or email are attacked (one page, extract):**

| Step | Who | What |
|---|---|---|
| 1 | Whoever spots it | Note the time. Tell Priya by phone (07700 900123). Do not email about it. |
| 2 | Priya | Call our IT firm (number on the sheet). Start the facts log. |
| 3 | IT firm, with Priya's yes | Disconnect affected PCs from the network. Do not switch off unless they cannot be disconnected. |
| 4 | IT firm | Block sign-in for affected accounts and sign out sessions. Save sign-in logs and screenshots. |
| 5 | Priya | Call the insurer's incident line before paying anyone for recovery. |
| 6 | Priya | With our adviser, decide on reports: [UK: Information Commission for personal data; NCSC for a significant attack; confirm]. |

**Never:** pay or reply to the attacker; wipe a PC before evidence is saved; email clients until Priya approves the message.

**Tabletop inject 2:** "It is 10:40. A tenant phones to ask why they got an email from us with new bank details for rent." Questions: Who answers tenants today? What do we tell them? Who checks which mailbox sent it?
