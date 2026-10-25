# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Non-brand alpha has150 impressions,60 clicks,$60 cost and zero conversions. A branded beta has the same numbers. No previous run exists.

## Result

With the configured example rules, alpha is a zombie:60 clicks>=50, cost60>=50 and zero conversions. Beta remains under the brand exemption because its cost is below the configured exception. Report the tier and spend distribution, but mark movement unavailable on the first run. Any ad-group restructuring remains a recommendation.

## Check

- {"name":"Alpha matches the zombie rule first","passed":true}
- {"name":"brand protection applies to beta","passed":true}
- {"name":"no movement history is invented","passed":true}
- {"name":"no account change","passed":true}
