# Fictional worked example

This is an offline practice case, not a live service result.

## Input

A keyword costs$50: expected CTR AVERAGE, relevance ABOVE, landing page BELOW. Another keyword has null component data.

## Result

Treat AVERAGE as non-below for this house matrix. The first keyword goes to the landing-page issue bucket with cost evidence and a page-review recommendation. The second is NOT EVALUATED because subcomponents are missing. Keep eligible and total spend denominators separate rather than calling missing data healthy.

## Check

- {"name":"Landing-page diagnosis wins","passed":true}
- {"name":"AVERAGE is not BELOW","passed":true}
- {"name":"null data is not graded","passed":true}
- {"name":"coverage denominators are visible","passed":true}
