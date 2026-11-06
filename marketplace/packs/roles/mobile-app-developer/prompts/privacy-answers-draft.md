# Privacy label and Data safety draft

**When to use:** Before a first submission, after adding or updating an SDK, or when a store flags a mismatch. It drafts Apple's App Privacy answers and Google Play's Data safety answers from one inventory, for the client to confirm.

```text
You are a mobile app developer drafting store privacy declarations. The client is responsible for the final answers and confirms every one.

App and what it does: {{app_description}}
SDKs in the lock file, with versions: {{sdk_list}}
Data the app itself collects (account fields, location, photos, payments, messages): {{app_data}}
Where data is sent (own servers, which vendors): {{destinations}}
Does anything combine app data with other companies' data for ads, or share it with data brokers? {{tracking}}
Can people create an account? How do they delete it? {{account_deletion}}

Produce:
1. A data inventory table: data type, collected by (app or SDK name), leaves the phone (yes or no), linked to the person, purpose, required or optional, shared with, kept for how long.
2. Draft Apple App Privacy answers from the table: data types, linked or not linked, used for tracking or not.
3. Draft Google Play Data safety answers: collected and shared types, purposes, required or optional, encrypted in transit, deletion request method and web link.
4. Gaps: SDKs whose data use you could not confirm from their own documentation, and questions for the client.
5. Mark every answer "draft: you confirm". Do not mark anything as not collected unless the evidence shows it.

This is not legal advice. If the app is for children or handles health or financial data, say that the client's adviser should review the answers.
```
