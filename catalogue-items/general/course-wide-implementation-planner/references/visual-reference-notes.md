# Thirty-check worker readiness review

Treat these as checks to perform, never as a claim that this starter passed them.

1. Credentials come from secret settings, not code.
2. Local environment files are ignored by version control.
3. Bot and app credentials have an owner and rotation policy.
4. Database service credentials have an owner and rotation policy.
5. Unneeded shared credentials are revoked.
6. Bot writes are limited to authorized workspace destinations.
7. Row-level access policies cover agent tables.
8. Privileged database use is logged and reviewed.
9. Delegation is limited by the registry.
10. The system has a daily hard spending limit.
11. Each paid agent has its own explicit cap.
12. The coordinator's use has a separate cap.
13. Reservations and actual costs reconcile after each run.
14. Hard-stop incidents alert the responsible owner.
15. Internal channels are explicitly allowed.
16. Client-facing channels are denied unless explicitly in scope.
17. Destination checks are enforced in code.
18. The response filter checks secrets and personal data.
19. Mutations require a valid applicable authorization.
20. Proposals expire and stale approvals are rejected.
21. Approve and reject callbacks are authenticated and tested.
22. Risk policies exist for every high-impact action.
23. Backups exist and a restore rehearsal passes.
24. Migrations have review and rollback plans.
25. Findings retain the correct client scope.
26. Unhandled errors are captured.
27. Worker restart incidents are observable.
28. Scheduled jobs are observed during a bounded rehearsal.
29. Orphan recovery reports what it recovered.
30. A documented stop control blocks new work and handles in-flight work deliberately.

Rehearse startup, health/echo jobs, one synthetic monitor finding, proposal/rejection, scoped task creation and cost reconciliation in an isolated environment before live use. Name the launch owner, monitoring period, stop control and rollback path.
