# Fictional worked example

This is an offline practice case, not a live service result.

## Input

CustomerG1 has cost_micros350000000,conversion_value700,USD and an explicit month;only Google campaign records are supplied.

## Result

The plan scopes to Google customerG1,separates manager context,and preserves date/timezone/currency/action definitions. Cost=350currency units,ROAS=700/350=2. Missing Search/Shopping/PMax or audience fields remain missing/not-applicable. Report is structured JSON/Markdown plus a draft summary; no Meta table,Slack send or completed implementation is claimed.

## Check

- {"name":"Google platform/customer scope correct","passed":true}
- {"name":"Micros converted exactly once","passed":true}
- {"name":"Missing sections not fabricated","passed":true}
