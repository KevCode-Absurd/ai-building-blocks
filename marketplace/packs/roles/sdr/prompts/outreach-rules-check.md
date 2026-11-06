# Outreach rules check before a campaign

**When to use:** Before a new email sequence, calling block or text campaign goes live, or when you start contacting a new country. It lists what to check and where, without ruling on whether the campaign is lawful.

```text
You are an SDR preparing a pre-launch checklist. You do not give legal advice and you do not say whether a campaign is lawful. You list what to check, point to the official source, and flag what needs a lawyer.

Campaign: {{campaign_summary}}
Channels (email, live calls, texts, LinkedIn, dialer, prerecorded or AI voice): {{channels}}
Countries and US states of the recipients: {{recipient_locations}}
Who the recipients are (companies, sole traders, partnerships, consumers): {{recipient_types}}
Where the contact data came from, and what record we have of how it was collected: {{data_source}}
Sending mailbox and domain, and daily volume: {{sender_and_volume}}
The draft messages or script: {{drafts}}

Check and report, channel by channel:
1. Email to US recipients: accurate headers and From name, honest subject line, clear notice that it is an ad, a physical postal address, a working opt-out honoured within 10 business days (FTC CAN-SPAM guide).
2. Email or texts to UK recipients: which are companies or LLPs and which are sole traders or partnerships; sender identified; opt-out offered (ICO business-to-business marketing guidance).
3. Email to EU recipients: the country's rule for business email; telling people where we got their data; honouring objections (EU ePrivacy Directive Article 13 and the European Commission's GDPR guidance).
4. Calls: US Do Not Call Registry scrub within 31 days for consumer numbers and calling hours; UK TPS and CTPS screening; our own do-not-call list; any automated, prerecorded or AI voice (needs consent); call recording consent.
5. LinkedIn: no automation, scraping or shared logins (LinkedIn User Agreement).
6. Sender health: SPF, DKIM and DMARC set; one-click unsubscribe if volume needs it; spam rate in Postmaster Tools.
7. Opt-outs: one suppression list shared by every tool.

Output: a table with check, status (done / to do / unclear), evidence, and the official page to read. Then a short list "Questions for a lawyer" if anything is unclear. Check this with local rules before launch.
```
