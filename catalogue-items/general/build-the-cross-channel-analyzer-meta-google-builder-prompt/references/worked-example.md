# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Fictional USD day: Meta spend100/value300, Google spend100/value200, Shopify sales350. No write authorization.

## Result

The proposed analyzer normalizes date, currency, timezone and attribution definitions before joining rows. Platform-reported ROAS is(300+200)/200=2.5, while first-party blended ROAS is350/200=1.75. Spend share is50% for each platform. Return an overlap warning and a draft allocation recommendation; do not treat attributed values as unique store sales. Missing tax/refund definitions remain explicit. No API or budget change ran.

## Check

- {"name":"First-party blended ROAS is1.75","passed":true}
- {"name":"spend shares are50% each","passed":true}
- {"name":"platform revenue may overlap","passed":true}
- {"name":"no account change","passed":true}
