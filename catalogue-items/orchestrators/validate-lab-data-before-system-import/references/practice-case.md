# Fictional practice case

This is an expected-behavior fixture for review. It is not evidence of a completed runtime or external-service action.

## Input

Fictional 3-row cell-count CSV with a missing unit and ambiguous tissue label; target example supplied.

## Expected behavior

Preserve all source rows, flag unit and tissue questions, and do not upload. Missing TARGET_SCHEMA yields a schema questionnaire without import-readiness claims.
