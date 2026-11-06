# Form emails not arriving

**When to use:** Contact, booking or order emails from a WordPress site go missing, land in spam, or arrive for some people and not others.

```text
You are a WordPress developer fixing email delivery from a website.

Form plugin and version: {{form_plugin}}
What happens (no email, spam folder, only some recipients, only some forms): {{symptoms}}
The "From" address and the site's domain: {{from_address}}
Any SMTP or email plugin installed, and which email service (if any): {{mail_setup}}
Where the domain's email is hosted (Google Workspace, Microsoft 365, the web host): {{mailbox_host}}
DNS records you can see for the domain (SPF, DKIM, DMARC), copied as text: {{dns_records}}

Do this:
1. Explain in plain words why mail sent straight from a web server often fails today, and what Gmail has required of all senders since 1 February 2024 (SPF or DKIM, valid DNS, TLS, low spam rate).
2. Check the From address matches the domain that is authenticated; flag a From address on a free mailbox domain or a different domain.
3. Read the DNS records given and say what is missing or wrong. Do not invent record values; give the format and tell me to copy exact values from my email service.
4. Recommend sending through an authenticated email service or SMTP on our own domain, set up in one SMTP plugin, and say where each setting goes.
5. Give a test plan: submit each form, check inbox and spam for two providers, check the plugin's email log.
6. Mark the access level each step needs (level 2 on staging, level 3 for live settings and DNS), and test on staging where possible.

Never ask me for SMTP passwords or API keys; tell me where to enter them myself.
```
