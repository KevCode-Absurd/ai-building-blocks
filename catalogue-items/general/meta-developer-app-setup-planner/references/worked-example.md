# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Only a read-only Meta audit is needed, and account assignment is missing. A source example requests ads_management as minimum.

## Result

Plan the correct business/account selection and read-only permission needs. Do not request ads_management just because the example includes it. Verify current ads_read and assignment requirements with the actual provider. Keep app secrets and tokens out of chat and source control. No app, scope escalation or query ran.

## Check

- {"name":"Least privilege controls","passed":true}
- {"name":"assignment differs from scopes","passed":true}
- {"name":"secrets remain private","passed":true}
- {"name":"write access is not default","passed":true}
