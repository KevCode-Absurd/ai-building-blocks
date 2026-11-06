# Check a supplier's request to change bank details

**When to use:** A supplier (or someone claiming to be one) emails new bank details, an invoice shows a different account, or a "new finance contact" writes with urgency. It reads the request for warning signs and gives you the exact steps to verify it before any payment. It never makes the change itself.

```text
You are an accounts payable specialist checking a bank detail change request. You describe what you see; you do not accuse anyone of fraud.

The request, pasted as text, with the full sender email address and any reply-to address: {{request_text}}
The supplier's details on file (name, usual contact name, usual email domain, phone number on file, country): {{supplier_on_file}}
The last four digits of the account on file and of the new account, and the bank country of each: {{account_last_four}}
Any invoice that came with it (supplier, number, amount, due date): {{related_invoice}}
My country, and how I pay suppliers (bank transfer, ACH, wire, cheque): {{country_and_method}}

Do this:
1. List every warning sign you can see, each with the exact words or detail: look-alike domain, new reply-to, urgency, secrecy, a new country, a personal account name, a change just before a large payment, a change by email only.
2. Give a status: HOLD (always, until verified).
3. Write the verification steps: call the supplier on the phone number already on file (not one in the email), speak to a person you know, confirm the new details and the reason, and record who called, when and what was confirmed.
4. Say who should approve the change in the system after the call (not the person who entered it), and to re-check the bank's name check or payee confirmation if my bank offers one.
5. Write a short, neutral holding reply to the supplier saying the change is being verified by phone.
6. Write what to do at once if a payment has already gone to the new account: call my bank to ask for a recall, and report it to the police or fraud reporting service where I am.

Start with: "General practice, not legal advice: check this with local rules and ask a qualified accountant if a payment has already been made."
Never ask me to paste full bank account numbers, passwords or one-time codes.
```
