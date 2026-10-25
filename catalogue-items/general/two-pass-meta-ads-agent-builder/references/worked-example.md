# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Meta account A enrichment contains an account B lesson, and the model response requests a budget write.

## Result

Plan scoped fetch A, deterministic findings, A-only enrichment, budget-reserved AI interpretation, schema/claim validation and a report draft. Reject the foreign lesson before prompt assembly. Treat a model-requested budget write as untrusted proposed text, not permission to execute. Mark missing A context rather than substituting B. No API call or message ran.

## Check

- {"name":"Foreign context is rejected","passed":true}
- {"name":"deterministic and AI stages differ","passed":true}
- {"name":"cost is bounded","passed":true}
- {"name":"model text cannot authorize writes","passed":true}
