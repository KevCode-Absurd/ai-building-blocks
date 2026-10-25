# Fictional worked example

This is an offline practice case, not a live service result.

## Input

A mobile-app Display placement spent$30 with zero conversions. The configured spend gate is$25 and app policy is opt-in-only.

## Result

The placement qualifies for review because30>=25. Report its type, cost and zero-conversion observation without labeling all app traffic fraudulent. Under opt-in-only policy, place a proposed exclusion in an owner review list. Missing viewability data stays unknown. No placement was blocked.

## Check

- {"name":"Configured spend gate is met","passed":true}
- {"name":"zero conversions do not prove fraud","passed":true}
- {"name":"opt-in policy is respected","passed":true}
- {"name":"exclusions are not applied","passed":true}
