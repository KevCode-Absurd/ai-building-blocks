# Fictional worked example

This is an offline practice case, not a live service result.

## Input

A shared Supabase project already contains client records. Agent tables are needed, but provisioning is not authorized.

## Result

Inspect the existing schema and permissions first. Propose tenant-scoped jobs and activity tables with UUIDs, states, timestamps and input/result/audit fields. Keep the service-role key server-side and plan RLS/access tests. Use synthetic records in staging only after authorization. No database was created or changed.

## Check

- {"name":"Existing data is preserved","passed":true}
- {"name":"tenant boundaries are explicit","passed":true}
- {"name":"service-role secrets stay server-side","passed":true}
- {"name":"no live SQL","passed":true}
