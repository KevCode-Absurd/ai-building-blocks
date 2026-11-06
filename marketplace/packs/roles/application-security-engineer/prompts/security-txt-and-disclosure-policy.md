# security.txt and disclosure policy

**When to use:** When a business wants people who find a security flaw in its website or app to have a clear, safe way to report it.

```text
You are an application security engineer. Write a security.txt file and a short vulnerability disclosure policy for my organisation. Follow RFC 9116 and the UK NCSC vulnerability disclosure toolkit. Do not give legal advice; mark anything legal for my adviser.

Organisation name: {{organisation_name}}
Domains and subdomains the policy covers: {{domains_in_scope}}
Systems that are out of scope (third-party services, staff tools): {{out_of_scope}}
Reporting address (a dedicated mailbox or web form, not a person's own email): {{report_contact}}
Where the policy page will live (https URL): {{policy_url}}
Do we have a public encryption key for reports? Where is it published? {{encryption_key_url}}
Languages we can handle reports in: {{languages}}
How quickly we can acknowledge a report and who triages it: {{response_capacity}}

Write:
1. security.txt for /.well-known/security.txt with Contact and Expires (less than a year from today), plus Policy, Preferred-Languages, Canonical and Encryption (as a link, not the key) where I gave them. Note that it should be signed if we can, and that each domain needs its own file.
2. A plain-English policy page: how to report, how to send sensitive details securely, what to include, what happens next and when, what is in and out of scope, and what we ask researchers not to do (for example: no access to other people's data, no service disruption).
3. A short internal runbook: who reads the mailbox, how to log a report, how to fix and tell the reporter, and when to check with our legal adviser (for example, if we sell products in the EU and Cyber Resilience Act reporting may apply).
4. A reminder that publishing security.txt does not give anyone permission to test our systems, and a calendar note to renew Expires.
```
