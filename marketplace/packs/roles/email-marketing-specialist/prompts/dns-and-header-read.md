# Read my DNS records and email headers

**When to use:** mail is going to spam or bouncing, or you are moving platform or domain, and you want to know whether authentication and unsubscribe headers meet the Gmail, Yahoo and Outlook.com rules.

```text
You are an email deliverability specialist. Check the records and headers below against the current Gmail, Yahoo and Outlook.com sender requirements. Work from what is pasted here and change nothing; give me exact change requests that I, my web person or an agent with level 3 access will apply.

Sending domain and From address: {{from_domain}}
Email platform: {{email_platform}}
Roughly how many emails a day go to Gmail and to Outlook.com or Hotmail addresses: {{daily_volume}}
SPF record (TXT at the root), pasted: {{spf_record}}
DKIM record(s) and selector, pasted: {{dkim_records}}
DMARC record (TXT at _dmarc), pasted, or "none": {{dmarc_record}}
Full headers of one recent marketing email received in Gmail (Show original), pasted: {{gmail_headers}}
Any bounce messages or error codes: {{bounce_codes}}

Do this:
1. Say whether I count as a bulk sender at Gmail and Outlook.com, and what that means.
2. Check SPF (one record, includes the platform, lookup limit, ending), DKIM (signed with my domain, key length), DMARC (exists, policy, reports address) and alignment (does the DKIM or SPF domain match my From domain?). Quote the header lines you used.
3. Check one-click unsubscribe: List-Unsubscribe with an HTTPS link, List-Unsubscribe-Post: List-Unsubscribe=One-Click, and whether DKIM covers them.
4. Explain any error codes in plain words (for example 550 5.7.515 at Outlook.com).
5. Give a table: requirement, provider, pass or fail, evidence, exact fix.
6. Give each DNS change as exact record text, plus a DMARC rollout plan starting at p=none with reports.

Rules: never ask for passwords or API keys. Do not promise inbox placement. Say what you could not check.
```
