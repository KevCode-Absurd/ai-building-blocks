---
name: backup-and-restore-drill
description: Checks how a database is backed up (PostgreSQL pg_dump and WAL archiving with point-in-time recovery, MySQL mysqldump with binary logs, SQLite online backup or VACUUM INTO, or a host's settings on Amazon RDS, Supabase, Neon or PlanetScale), finds the gaps (no restore ever tested, backups deleted with the instance, roles or storage files missing, archiving that fails silently), then restores a backup into a scratch database, compares row counts and key totals with production and records how long it took. Reads settings at access level 1; runs the restore drill on a scratch database at level 2; changes production backup settings only at level 3 within limits, and never deletes a backup or snapshot without a fresh yes. Use it before any risky migration and on a regular schedule.
---

# Backup and restore drill

## When to use

- Before a production migration or a destructive change, when nobody can say when a restore last worked.
- When a business moves hosts or changes plans and backup settings may have changed.
- On a schedule (for example quarterly) as part of a database health check.
- After an incident, to prove the backups would have saved the day.

## What you need

1. Database, version and host (self-managed, Amazon RDS, Supabase, Neon, PlanetScale or other).
2. How backups are taken today, where they are kept, how long they are kept, and who gets the failure alerts.
3. How much data the business could lose (in time) and how long it could be down, in its own words.
4. Somewhere to restore: a scratch server, a new instance or a branch, sized like production.
5. Access: level 1 to read backup settings and logs. Level 2 to restore into a scratch database or branch. Level 3 to change production backup settings within your limits. Deleting any backup, snapshot or instance needs a fresh yes every time.

## Steps

### 1. Write down what exists

A table: what is backed up (which databases, roles and users, files or object storage), how (method), how often, where it is kept, how long, whether it is encrypted, who is alerted on failure, and when a restore was last tested and how long it took.

### 2. Check the method against the database

- **PostgreSQL logical:** `pg_dump` takes a consistent snapshot of one database without blocking normal reads and writes. Roles and tablespaces are not in it; add `pg_dumpall --globals-only`. Custom or directory format allows `pg_restore` and parallel restores.
- **PostgreSQL point-in-time:** a base backup plus continuous WAL archiving restores to any moment after the base backup. The archive command must return success only when the file is safely stored, must not overwrite existing files, and the archiver must be monitored; failed archiving fills the WAL disk and a full disk stops the server. Incremental base backups need every earlier backup they depend on.
- **MySQL:** `mysqldump --single-transaction` for an online InnoDB dump; binary logs (on by default in 8.4) for point-in-time recovery; copying InnoDB data files is not a backup; back up a replica to spare the source.
- **SQLite:** never copy the file while the app is writing; use the online backup API, `VACUUM INTO` or `sqlite3_rsync`.
- **Hosts:** on Amazon RDS, automated backups allow point-in-time recovery within the retention period but are deleted with the instance unless "Retain automated backups" is chosen; manual snapshots survive. On Supabase, daily backups are kept 7, 14 or up to 30 days by plan, free projects need their own exports, the point-in-time add-on replaces daily backups, Storage files are not in the database backup, and a restore takes the project offline while it runs. Check the host's current docs on the day.

### 3. List the gaps

Typical gaps: no restore ever tested; roles or extensions missing from the dump; files and uploads not backed up; backups kept in the same account or region as production with the same people able to delete both; retention shorter than the time it takes to notice a problem; failure alerts going nowhere; backups deleted with the instance.

### 4. Run the drill (level 2)

1. Pick the newest backup and, if point-in-time recovery exists, a target time.
2. Restore into the scratch database or branch. On PostgreSQL text dumps, use `ON_ERROR_STOP` or `--single-transaction` so a failure does not leave a half-loaded database; create roles first.
3. Time each stage: download, restore, recovery, `ANALYZE`.
4. Compare with production: row counts per table, key totals (orders, payments, members) for a fixed period, the latest timestamp in busy tables, and a few known records.
5. Run the application's smoke tests or key queries against the restored copy.
6. Delete the scratch copy afterwards only if the client agreed it in advance as part of the drill.

### 5. Record the result

A restore record: backup used, target time, where restored, time per stage, comparisons with pass or fail, problems found, and who watched.

### 6. Fix the gaps (level 2 or 3)

Write the fixes: add a globals dump, add file storage backups, move a copy to a separate account or region, lengthen retention, route alerts to a person, turn on "retain automated backups". At level 3, apply the settings changes within the client's limits after their yes on the list. Turning off a backup method, shortening retention or deleting old backups needs its own fresh yes.

## Checks

- Every database, the roles and the files are covered by some backup.
- A restore was run end to end and timed, not just listed.
- Restored counts and totals were compared with production and recorded.
- Backup failures alert a named person.
- At least one copy cannot be deleted by the same account that could delete production.
- No backup, snapshot or instance was deleted without a fresh yes.
- No real customer data left the client's systems during the drill.

## Output format

1. Current backup table.
2. Gap list, most serious first.
3. Restore record with timings and comparisons.
4. Fix list, with which need level 3 and which need a fresh yes.
5. Next drill date.

## Example of good output (short)

*Illustrative structure, not a real business: a bike hire business running PostgreSQL 17 on a single server. Copy the shape, never the content: every fact comes from the client's own context.*

> | Check | Result |
> |---|---|
> | Nightly `pg_dump -Fc` to object storage, 14 copies | Present |
> | Roles and grants (`pg_dumpall --globals-only`) | **Missing**: restore failed to recreate the app role's grants |
> | Bike photos in object storage | **Not backed up** |
> | Restore to scratch server | 41 min (download 6, restore 31, ANALYZE 4) |
> | Rentals, payments, customers row counts vs production at dump time | Match |
> | Payments total for October | Match |
>
> **Fix first:** add the globals dump to the nightly job and re-run the drill; then back up the photo bucket to a second account.
