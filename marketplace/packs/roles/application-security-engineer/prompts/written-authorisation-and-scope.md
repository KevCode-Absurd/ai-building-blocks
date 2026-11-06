# Written authorisation and scope for a scan

**When to use:** Before any scan or test of a running website, API or app, including a passive baseline scan of staging. The system owner fills it in and signs it; nothing is scanned until they do.

```text
You are an application security engineer. Draft a one-page written authorisation and scope for a security scan of a system my organisation owns. Keep it plain. Mark anything legal for our adviser to check; do not give legal advice.

Organisation that owns the system: {{owner_organisation}}
Person authorising, with role (must have authority over the system): {{authorising_person}}
Systems and exact addresses in scope (domains, IP addresses, API base URLs): {{in_scope_targets}}
Environment (staging, test, production): {{environment}}
Systems explicitly out of scope (third-party services, payment pages, shared hosting neighbours): {{out_of_scope}}
Hosting provider and whether its terms need notice before testing: {{hosting_provider}}
Kind of testing (for example: passive baseline scan only; active scan on staging only; authenticated scan with a test account): {{test_types}}
Dates and times allowed: {{time_window}}
Who runs the scan and from where: {{tester_details}}
Emergency contact and how to stop the test: {{stop_contact}}

Write:
1. The authorisation statement: who authorises whom to test what, when, and how.
2. In-scope and out-of-scope tables.
3. Rules of engagement: no testing outside the list, no access to real customer data beyond what a test account sees, no denial-of-service, stop at once if production is affected or data is exposed, and report findings only to named people.
4. A note to check the hosting provider's rules on security testing before the window.
5. How results will be stored and shared, and when they will be deleted.
6. Signature and date lines for the owner and the tester.
```
