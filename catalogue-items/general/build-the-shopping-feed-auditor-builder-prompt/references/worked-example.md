# Fictional worked example

This is an offline practice case, not a live service result.

## Input

A PMax product has40 clicks,$120 cost, zero conversions and no supplied category benchmark.

## Result

Do not recommend a pause from this fixture because40<50. Show the$120 cost and campaign type. A missing category cohort prevents calculation of an internal median. Check available feed fields and disapprovals, then return a data gap and observation recommendation without inventing benchmark values.

## Check

- {"name":"Fewer than50 clicks blocks a pause","passed":true}
- {"name":"no invented median","passed":true}
- {"name":"PMax context is retained","passed":true}
- {"name":"no bid or pause action","passed":true}
