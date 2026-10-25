# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Video A has1000 impressions,200 views and100 finishes. Video B has500 impressions. Minimum impressions are configured at1000.

## Result

For A, calculate200/1000=20% view rate and100/200=50% finishes among views, naming both denominators. B is below the configured sample gate and should not be compared as equally reliable. Missing view-through conversion windows prevent causal revenue claims. This is a diagnostic specification, not an account run.

## Check

- {"name":"A view rate is20%","passed":true}
- {"name":"finishes among views are50%","passed":true}
- {"name":"B is below the gate","passed":true}
- {"name":"attribution gaps remain explicit","passed":true}
