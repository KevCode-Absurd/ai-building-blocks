# Monthly database health check

**Cadence:** Monthly for most small business databases, plus straight away after a version end-of-life notice, a slow-page complaint, a failed backup alert or a jump in disk use. About two hours once the checks are set up; the restore drill runs quarterly.

## Steps

1. **Confirm access (level 1).** Re-read "Access I have". Use a read-only database user and, where possible, a replica.
2. **Versions (level 1).** Database major and minor version against the vendor's support page. PostgreSQL 14's final release is due on 12 November 2026; any database on 14 or older needs an upgrade plan. Note MySQL's LTS or Innovation track and the host's own version notices.
3. **Top queries (level 1).** From `pg_stat_statements` or the MySQL slow query log: the top ten by total time, compared with last month. New entries or jumps go to the `query-plan-and-index-tuning` skill.
4. **Indexes (level 1).** Unused indexes (no scans since the last statistics reset), duplicate indexes, invalid indexes left by failed concurrent builds, and foreign keys without an index on PostgreSQL.
5. **Growth and maintenance (level 1).** Table and index sizes against last month, disk headroom, and on PostgreSQL whether autovacuum keeps up on the busiest tables.
6. **Integrity (level 1).** Constraints that are still `NOT VALID`, orphaned rows where a foreign key is missing, duplicates on columns that should be unique, and on SQLite whether `PRAGMA foreign_keys` is on in the app's connections.
7. **Backups (level 1).** Last successful backup, retention, failure alerts, WAL or binary log archiving status, and the host's settings (for example RDS "retain automated backups"). Quarterly, run the `backup-and-restore-drill` skill (level 2) and record the restore time.
8. **Access (level 1).** Database users and connector sessions of people who left, roles wider than needed, MCP servers that should be read-only, and secrets due for rotation.
9. **Fix what slipped (level 2).** Write the fixes: index changes, migrations, configuration. Open pull requests or deploy requests and test them on a copy. *Approval: a named reviewer on the client's team.*
10. **Apply (level 3).** Within the agreed limits, build approved indexes and apply approved settings. Each production migration needs a fresh yes and a tested backup; dropping an index or any destructive data fix needs its own fresh yes and a fresh, restore-tested backup.
11. **Report.** One page: versions and support dates, top queries and what changed, index findings, growth, backup status and the last restore time, access changes needed, every action taken from the log.

## Outputs

- Version and support date table
- Top ten queries with month-on-month change
- Index findings (unused, duplicate, invalid, missing on foreign keys)
- Backup status and, quarterly, a restore record
- Pull requests or deploy requests for fixes
- One-page monthly report with the action log

## Needs the client's approval

Every pull request or deploy request (a named reviewer); a fresh yes and a tested backup for each production migration; a separate fresh yes and fresh tested backup for dropping indexes, deleting duplicates or any destructive data fix; changes to users, roles, permissions or backup settings; and version upgrades. The client can lower the access level at any time.
