---
name: database-backup
description: Create, schedule, and verify database backups with support for full, incremental, and point-in-time recovery strategies. Use when the user requests database backup or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: AI Agent Skills Community
  version: 1.0.0
---

# Database Backup

This skill enables an AI agent to plan and execute database backup strategies across PostgreSQL, MySQL, and MongoDB. The agent selects the appropriate backup type (full, incremental, differential, or point-in-time), generates backup scripts with compression and encryption, configures automated scheduling via cron or similar tools, defines retention policies, and verifies backup integrity through restore tests.

## Workflow

1. **Assess backup requirements:** Determine the database type, size, acceptable data loss window (Recovery Point Objective), and acceptable downtime (Recovery Time Objective). Identify whether the backup must be consistent (application-level locks or snapshots) and whether the database can tolerate brief locking during the backup.

2. **Select backup strategy:** Choose the appropriate backup type based on requirements. Full backups capture the entire database and are simplest to restore but slowest to create. Incremental backups capture only changes since the last backup, saving time and storage. Differential backups capture changes since the last full backup, offering a middle ground. Point-in-time recovery (PITR) uses write-ahead logs or oplogs to restore to any moment, providing the lowest RPO.

3. **Generate backup scripts:** Produce shell scripts that invoke the correct backup tool for the target database. Include compression (gzip, lz4, or zstd), optional encryption (GPG or OpenSSL), timestamped filenames, and error handling with exit codes. Script should log output for monitoring.

4. **Configure scheduling and retention:** Set up automated execution using cron, systemd timers, or a task scheduler. Define a retention policy (e.g., keep 7 daily, 4 weekly, 12 monthly backups) and implement cleanup of expired backups to manage storage usage.

5. **Verify backup integrity:** After each backup, verify the file is non-empty and checksums are valid. Periodically perform a test restore to a staging environment to confirm the backup is actually recoverable. Alert on verification failures.

6. **Document and monitor:** Record the backup schedule, retention policy, storage location, and restore procedure. Set up monitoring alerts for missed backups or backup failures using tools like Prometheus, Datadog (a paid service), or simple email notifications.

## Supported Technologies

- **PostgreSQL:** pg_dump, pg_basebackup, WAL archiving for PITR
- **MySQL:** mysqldump, mysqlpump, Percona XtraBackup, binlog for PITR
- **MongoDB:** mongodump, mongorestore, filesystem snapshots, oplog for PITR
- **Compression:** gzip, lz4, zstd, pigz
- **Encryption:** GPG, OpenSSL AES-256
- **Storage:** Local disk (free), AWS S3, Google Cloud Storage, Azure Blob Storage (these cloud services need an account and may cost money)

## Usage

Provide the agent with your database type, name, and connection details. Specify your RPO/RTO requirements, preferred storage destination, and whether you need encryption. The agent will generate a complete backup solution including scripts, scheduling, retention policy, and verification steps.

## Examples

The database name, user and folder names below are placeholders. Replace them with yours. The scripts take full dumps. Point-in-time recovery needs WAL archiving (PostgreSQL), binary logs (MySQL) or the oplog on a replica set (MongoDB) to be switched on first. Give the backup user the least rights it needs.

### Example 1: PostgreSQL Full Backup with Cron Schedule

**Request:** Set up a nightly full backup of a PostgreSQL database with 30-day retention, compressed and uploaded to a local backup directory.

```bash
#!/usr/bin/env bash
# pg_backup.sh — Nightly PostgreSQL full backup
set -euo pipefail

DB_NAME="production"
DB_USER="backup_user"
BACKUP_DIR="/var/backups/postgresql"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of database '${DB_NAME}'..."
# -Fc is the custom format, which is already compressed, so no gzip step
pg_dump -U "$DB_USER" -h localhost -Fc "$DB_NAME" > "$BACKUP_FILE"

# Verify the backup file is non-empty
if [ ! -s "$BACKUP_FILE" ]; then
    echo "[$(date)] ERROR: Backup file is empty. Aborting." >&2
    exit 1
fi

# Write a checksum next to the backup so you can verify it later with: sha256sum -c <file>.sha256
sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup complete: ${BACKUP_FILE} (${FILE_SIZE})"

# Clean up backups older than retention period
find "$BACKUP_DIR" -name "${DB_NAME}_*.dump*" -mtime +${RETENTION_DAYS} -delete
echo "[$(date)] Expired backups removed (older than ${RETENTION_DAYS} days)."
```

**Cron entry (runs daily at 2:00 AM):**

```
0 2 * * * /usr/local/bin/pg_backup.sh >> /var/log/pg_backup.log 2>&1
```

### Example 2: MongoDB Backup and Restore Procedure

**Request:** Back up a MongoDB replica set and document the restore procedure.

**Backup script:**

```bash
#!/usr/bin/env bash
# mongo_backup.sh — MongoDB replica set backup
set -euo pipefail

: "${MONGO_URI:?Set MONGO_URI through the secret manager or environment}"
BACKUP_DIR="/var/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_DIR="${BACKUP_DIR}/dump_${TIMESTAMP}"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting mongodump..."
mongodump --uri="$MONGO_URI" --oplog --out="$DUMP_DIR"

# Compress the dump directory
tar -czf "${DUMP_DIR}.tar.gz" -C "$BACKUP_DIR" "dump_${TIMESTAMP}"
tar -tzf "${DUMP_DIR}.tar.gz" >/dev/null

# Refuse cleanup unless the resolved path is the expected timestamped child.
case "$DUMP_DIR" in
  "$BACKUP_DIR"/dump_[0-9]*) rm -rf -- "$DUMP_DIR" ;;
  *) echo "Refusing unsafe cleanup path: $DUMP_DIR" >&2; exit 1 ;;
esac

echo "[$(date)] Backup complete: ${DUMP_DIR}.tar.gz"

# Retain only the last 14 backups
ls -t ${BACKUP_DIR}/dump_*.tar.gz | tail -n +15 | xargs -r rm --
```

**Restore procedure:**

```bash
# 1. Extract the backup archive
tar -xzf /var/backups/mongodb/dump_<TIMESTAMP>.tar.gz -C /tmp/

# 2. Restore to the target MongoDB instance
: "${RESTORE_MONGO_URI:?Set RESTORE_MONGO_URI through the secret manager or environment}"
: "${RESTORE_TARGET_CONFIRMED:?Set RESTORE_TARGET_CONFIRMED=yes only after verifying the target is the authorized restore environment}"
[ "$RESTORE_TARGET_CONFIRMED" = "yes" ] || { echo "Restore target is not confirmed" >&2; exit 1; }
mongorestore --uri="$RESTORE_MONGO_URI" \
  --oplogReplay --drop /tmp/dump_<TIMESTAMP>/

# 3. Verify collections and document counts
mongosh --eval "db.adminCommand({listDatabases: 1})"
```

## Best Practices

- **Test restores regularly** — a backup you have never restored is a backup you cannot trust. Schedule monthly restore drills to a staging environment.
- **Encrypt backups at rest and in transit** using GPG or AES-256, especially when storing offsite or in cloud storage. Never store encryption keys alongside the backups.
- **Use the --oplog flag (MongoDB) or WAL archiving (PostgreSQL)** to enable point-in-time recovery, which dramatically reduces potential data loss.
- **Store backups in a separate failure domain** — a different server, availability zone, or cloud region — so a single infrastructure failure does not destroy both the database and its backups.
- **Monitor backup jobs with alerts** — silence is not success. Alert on missing backups, zero-byte files, or checksums that do not match.
- **Document the full restore procedure** with exact commands, expected timings, and who is responsible, so recovery can happen under pressure without guesswork.

## Safety and Permissions

- Start with configuration inspection and a restore plan. Do not install schedules, delete expired backups, upload data, or start a restore without explicit authorization for the named environment.
- Treat restore commands such as `--drop` as destructive. Resolve and independently verify the destination, confirm it is the intended isolated restore target, capture a pre-restore recovery point where applicable, and stop if identity is ambiguous.
- Keep credentials out of scripts, command output, logs, and generated examples. Prefer secret-manager injection or protected client configuration with least-privilege backup and restore identities.
- Preserve the source backup and its checksum throughout a restore drill. Never report recoverability from archive listing or checksum verification alone; validate a representative restore and application-level invariants.

## Edge Cases

- **Large databases exceeding disk space:** For databases larger than available local storage, stream backups directly to object storage (e.g., `pg_dump | gzip | aws s3 cp - s3://bucket/backup.gz`) to avoid local disk exhaustion.
- **Active write traffic during backup:** `pg_dump` already takes a consistent snapshot of the database in a single transaction, so writes during the dump do not make it inconsistent (the `--snapshot` flag is only for sharing a snapshot between several dumps). For MongoDB use `--oplog` to get a consistent point-in-time backup while writes continue. For MySQL, use Percona XtraBackup for hot backups of InnoDB without locking.
- **Backup of encrypted databases:** If Transparent Data Encryption (TDE) is enabled, ensure the encryption keys are backed up separately and that the backup process captures encrypted data in a restorable format.
- **Cross-region replication lag:** When backing up from a replica, verify replication lag is zero or near-zero before starting the backup to avoid capturing stale data.
- **Backup credential rotation:** Store credentials in a secrets manager (Vault, AWS Secrets Manager) rather than hardcoding them in scripts, and ensure backup scripts can handle credential rotation without manual updates.
