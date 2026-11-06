# Production migration with a backup gate

**Trigger:** Any schema or data change that will run on a production database: a new feature's tables, a column rename or type change, a new constraint or index on a busy table, a data move from an old layout to a new one, or a clean-up that deletes rows.

## Steps

1. **Agree access and limits (level 1).** Ask which access level the client grants for the database, the host and the code repository, and the limits: which databases, which kinds of change, which time windows, until when. Write it down as "Access I have". Remind the client that at level 3 every production migration and every destructive step still needs its own fresh yes and a tested backup.
2. **Read the current state (level 1).** Schema, migration history, table sizes, traffic by hour, database version, how migrations reach production, and the backup set-up.
3. **Design the change (level 1).** Use the `schema-design-from-business-rules` skill for new tables and rules. For changes to live tables, plan expand and contract across releases where a rename, type change or required column is involved.
4. **Classify every statement (level 1).** Use the `migration-risk-check` prompt: safe, locking or destructive; lock taken; rewrite or copy; whether it runs inside a transaction on this database; lower-risk alternatives (concurrent index builds, `NOT VALID` then `VALIDATE`, `ALGORITHM=INPLACE, LOCK=NONE`, the SQLite 12-step rebuild, batched backfills).
5. **Write the migration (level 2).** Up and down, check queries before and after with expected results, a lock timeout for the session where the database supports one, and backfills in resumable batches. Destructive steps go in their own migration. Open a pull request or a PlanetScale deploy request. *Approval: a named reviewer on the client's team.*
6. **Rehearse on a copy (level 2).** Run up, down and up again on a development database or branch with production-like volume. Time each step and note any lock waits. Run the app's tests against the migrated schema.
7. **Prove the backup (level 2).** Run the `backup-and-restore-drill` skill unless a restore was tested recently enough for the client's comfort. Record the backup that will be used if things go wrong and how long a restore takes.
8. **Ask for the go-ahead (level 3 gate).** Show the action list: each migration with its class, expected locks and time, the window, check queries, rollback, the backup and its restore result. *Approval: a fresh yes for this migration. Each destructive step gets its own fresh yes, after a fresh backup is taken and a restore of it has been tested.*
9. **Run it (level 3).** Through the client's pipeline or migration tool, not by hand. Watch locks, error rates and replication lag while it runs. Stop and ask if anything is unexpected.
10. **Check and report.** Run the after-checks, compare with expected results, check indexes are valid, and report: what ran, when, how long, results, and the action log. Destructive contract steps wait for a later release and repeat steps 7 to 10.

## Outputs

- Change table with class, locks, timings and rollback for each statement
- Migration files (up and down), backfill script and check queries
- Rehearsal log from the copy
- Restore record for the backup used as the safety net
- Production action list, signed off with the fresh yes
- Post-run report with the action log

## Needs the client's approval

The access level and limits; every pull request or deploy request (a named reviewer); a fresh yes for every production migration, after the action list and a tested restore are shown; a separate fresh yes and a fresh, restore-tested backup for every destructive step (drop, truncate, delete, overwriting backfill); any change to users, roles, permissions or backup settings; and anything outside the agreed window. The client can lower the access level at any time.
