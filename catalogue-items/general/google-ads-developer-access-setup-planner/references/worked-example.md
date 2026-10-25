# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Cloud OAuth credentials exist, but the course-named refresh-token script is absent from the selected repository.

## Result

Do not run an assumed generate-google-ads-token script. Inspect the repository and specify the authorization-code flow, state, authorized redirect and offline access using the active provider contract. Store the refresh token securely after the owner completes consent. Plan a bounded read-only probe afterward; no token or query was generated here.

## Check

- {"name":"Missing dependency is explicit","passed":true}
- {"name":"OAuth flow is specified rather than executed","passed":true}
- {"name":"storage is private","passed":true}
- {"name":"route follows cloud setup","passed":true}
