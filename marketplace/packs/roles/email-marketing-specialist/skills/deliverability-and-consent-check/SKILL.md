---
name: deliverability-and-consent-check
description: Checks a sender against the Gmail, Yahoo, Outlook.com and iCloud sender rules as of November 2026 from DNS records, message headers and sending results the client pastes in, then checks how contacts were collected against US, UK and EU consent rules. Returns each problem with the exact fix, a DMARC rollout, and a warm-up or recovery plan with numbers to watch. Use when opens or clicks drop suddenly, mail lands in spam, the client moves platform or domain, or before a first big send.
---

# Deliverability and consent check

Inbox placement rests on three things: proving who you are (authentication), sending mail people want (consent and engagement), and behaving steadily (volume and list hygiene). This skill checks all three from what the client can paste or export. It never needs a login. It is general guidance, not legal advice.

## When to use

- Opens, clicks or orders from email fell suddenly, or customers say mail is in spam.
- Bounces with codes such as 550 5.7.515 (Outlook.com) or 4.7.x / 5.7.x (Gmail).
- A move to a new email platform, sending domain or subdomain.
- Before a first send to a large or old list.
- A yearly check of consent wording and sign-up forms.

## What you need

- **DNS records** for the sending domain, pasted as text: SPF (TXT at the root), DKIM (the selector the platform gave), DMARC (TXT at `_dmarc`). A free DNS lookup tool or the domain host's DNS page shows them. No passwords.
- **Full headers of one recent marketing email** received at a Gmail address (Show original) and one at an Outlook.com address if possible. Look for the `Authentication-Results`, `List-Unsubscribe` and `List-Unsubscribe-Post` lines.
- **Sending results for the last 60 days:** sends, bounces (hard and soft, with codes), unsubscribes, complaints, clicks and orders, by mailbox provider if the platform shows it.
- **Postmaster data:** screenshots of Gmail Postmaster Tools (compliance status, spam rate) and Microsoft SNDS, if the client has them.
- **List sources:** how contacts were collected, the sign-up form wording, and any imports with dates.
- **Volume:** typical daily sends to Gmail, Yahoo and Outlook.com addresses.

**Access:** level 1 for the whole check; level 2 to prepare platform settings or a sunset flow switched off; level 3 to change platform settings, pause sends, or change the DNS records named on the fix list you confirm.

## Steps

1. **Classify the sender.** Roughly how many messages a day go to personal Gmail and to Outlook.com addresses? Near or over 5,000 a day means the bulk sender rules apply at Gmail (and the status is permanent once reached) and at Outlook.com. Yahoo applies bulk rules too. Treat any sender close to that line as bulk.
2. **Check authentication.**
   - *SPF:* one record only, starting `v=spf1`, including the email platform, ending in `~all` or `-all`, under the 10-lookup limit.
   - *DKIM:* the platform signs with the client's own domain (custom DKIM), not only the platform's; key length 1024 bits or more, 2048 preferred by Gmail.
   - *DMARC:* a record exists at `_dmarc.domain`; at least `p=none`; a `rua` address to receive reports.
   - *Alignment:* in the headers, `dmarc=pass`, and the DKIM `d=` domain or SPF domain matches the From domain.
   - *Reverse DNS and TLS:* usually handled by the platform; confirm in headers (TLS shown in the Received lines).
3. **Check unsubscribing.** Headers include `List-Unsubscribe` with an HTTPS link and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, covered by the DKIM signature. A visible unsubscribe link sits in the body. Unsubscribes are processed within 48 hours (Gmail's recommendation) and 2 days (Yahoo); never longer than 10 business days in the US. No login required.
4. **Read the numbers.** Complaint rate at Gmail: under 0.1% is the aim, 0.3% is the line not to reach. Hard bounces: who are they and where did they come from? Codes: 550 5.7.515 at Outlook.com means authentication requirements not met; 5.7.x at Gmail is a permanent failure, 4.7.x temporary. Clicks and orders by provider: a drop at one provider points to a problem there. Ignore opens as evidence of inbox placement; Apple preloads images.
5. **Check consent and list sources.** For each source: how consent was given, where it is recorded (date, source), and which region the contacts are in.
   - *US:* opt-out law, but purchased or scraped lists still harm placement and are refused by iCloud and Yahoo's guidance.
   - *UK:* consent for individuals and sole traders, or the soft opt-in for own customers with an opt-out offered; charities have their own soft opt-in for details collected from 5 February 2026.
   - *EU:* opt-in, with an exception for own customers and similar products.
   Flag pre-ticked boxes, consent buried in terms, and imports of unknown origin.
6. **Find the likely cause.** Usually one of: broken or missing authentication; a bad import; a sudden volume jump; mailing long-quiet contacts; a change of domain or platform without warm-up; content or frequency that drives complaints.
7. **Write the fixes.** Exact record text for each DNS change, marked as a change request the client or their web person applies. A DMARC rollout: `p=none` with reports for at least a week, fix any legitimate service that fails, then quarantine for a small share, then widen. Mention that RFC 9989 (May 2026) removes the `pct` tag even though some provider pages still show it.
8. **Plan the restart or warm-up.** Pause mail to quiet contacts. Restart with the most recent clickers and buyers. Raise volume in steps over several weeks (M3AAWG suggests about six weeks on average for a new domain). Spread sends through the day. Slow down at the first rise in deferrals, bounces or complaints.
9. **Set weekly numbers to watch** and the date to re-check.

## Checks

- Every DNS fix is exact text, not a description, and is a change request for the client.
- The plan never relies on opens to judge inbox placement.
- No advice to mail contacts without a consent basis, buy lists, or rotate domains to dodge filters.
- Regions are named for every consent finding; "check with your own legal adviser for anything unclear" appears where the law is uncertain.
- Restart volumes come from the client's own engaged counts, not a generic table.
- Nothing promises inbox placement.

## Output format

1. **Verdict** in three lines: bulk or not, the main problem, the first fix.
2. **Requirements table:** requirement, provider, status (pass, fail, unknown), evidence, fix.
3. **DNS change requests:** current record, new record, why.
4. **Consent table:** source, region, basis, status, action.
5. **Recovery or warm-up plan:** week by week audience and volume, and stop signals.
6. **Numbers to watch weekly** and the re-check date.
7. **What I could not check** (for example, no Postmaster access).

## Example of good output (short)

*Illustrative structure, not a real business: a UK physio clinic sending about 1,500 marketing emails a week through an email platform. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Verdict:** Not a bulk sender at Gmail. Main problem: there is no DMARC record and DKIM is signed with the platform's domain, so the mail cannot pass DMARC; clicks from Outlook.com and Hotmail addresses have halved since March while Gmail clicks held steady. First fix: set up custom DKIM for [domain], then publish DMARC at p=none.

| Requirement | Provider | Status | Evidence | Fix |
|---|---|---|---|---|
| SPF passes | All | Pass | `spf=pass` in Gmail header | None |
| DKIM aligned with From | All | Fail | `d=platformmail.example` | Add the platform's DKIM CNAMEs for your domain |
| DMARC record | All | Missing | No TXT at `_dmarc` | Add `v=DMARC1; p=none; rua=mailto:dmarc@[domain]` |
| One-click unsubscribe | Gmail, Yahoo | Pass | Both headers present | None |

**Consent finding:** 300 contacts came from a 2023 open-day sign-in sheet with no marketing wording. UK: individuals need consent or the soft opt-in; neither is shown. Action: do not mail them marketing; invite them through the next open day with clear wording.

**Restart:** weeks 1 and 2, patients who clicked or booked in the last 90 days only; week 3, add the last 6 months; week 4 onward, normal list minus anyone with no click or booking in 12 months, who go to the sunset flow. Stop and review if bounces or complaints rise in any week.
