# Fictional worked example

This is an offline practice case, not a live service result.

## Input

There is an MCC but no Google Cloud project or OAuth client. The user wants a plan only.

## Result

Plan the correct Google identity/project, Ads API enablement, consent settings, suitable OAuth client and redirects, plus developer access where applicable. Keep credentials outside version control. The next phase is refresh-token consent and a safe read query; do not call authentication complete after merely specifying client credentials.

## Check

- {"name":"Cloud setup precedes refresh","passed":true}
- {"name":"identity is checked","passed":true}
- {"name":"secrets are stored privately","passed":true}
- {"name":"authentication is not falsely complete","passed":true}
