# Fix a broken WordPress site safely

**Trigger:** Something on the site stopped working: a critical error, a white screen, a recovery mode email, a broken form or layout, or an admin lock-out. Usually hours to two days of elapsed time.

**Access:** level 1 to read logs and Site Health; level 2 to work on a staging copy; level 3 to pause a plugin or apply the fix on live, only on the sites, kinds of change and time window the owner set, and with a fresh backup.

## Steps

1. **Contain.** If visitors see an error, pause the failing plugin. With level 3 access I do it through the connected site; otherwise the owner uses the recovery mode link from the admin email, or asks the host. No code changes on live yet. *Approval: the owner agrees to pause the plugin, knowing which feature goes offline.*
2. **Gather evidence (level 1).** Use the `explain-the-error-log` prompt with the log lines, Site Health > Info and the list of recent changes. Personal data is removed before sharing.
3. **Make or refresh a staging copy (level 2)** with a fresh backup. If no staging exists, the owner or host creates one, or I do with the host's staging tool; a backup that has been restored at least once is the minimum.
4. **Diagnose (level 2 on staging).** Run the `wordpress-break-fix` skill: first real error, ranked causes, conflict test on staging.
5. **Write the fix.** The smallest change: setting, plugin rollback or replacement, child theme change or a snippet in a small custom plugin. If custom plugin code is involved, run the `plugin-security-hardening` skill on the changed code.
6. **Test on staging (level 2).** The test list from the skill: the broken page, forms (email arrives), menus, logged-in and logged-out views, phone layout, and a test order for shops.
7. **Apply to live (level 3).** Take a fresh backup, then apply the change in a quiet period, following the written steps, with the rollback ready. With level 3 access I apply it and log each step; otherwise the owner or their developer applies it. *Approval: the owner confirms the fix and the time window before the first live change.*
8. **Check live and close.** Run the test list on live, turn off debug logging, clear caches, and record what happened. If a test fails, roll back and report.
9. **Prevent a repeat.** One change, such as a staging routine, removing an abandoned plugin or a PHP upgrade plan with the `safe-update-plan` skill. *Approval: the owner decides whether to adopt it.*

## Outputs

- Evidence summary with the log lines that matter
- Cause, with how it was proven
- Fix with exact steps or code, tested on staging
- Rollback steps
- Short incident note and one prevention step
- Action log: every change on staging and live, with time and result

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** pausing the failing plugin, applying the tested fix on live in the agreed window, clearing caches, and rolling back if a test fails.
- **Always needs a new yes:** any plugin removal or replacement, any PHP or core version change, database changes on live, restoring a backup over live, changes to users or passwords, and the prevention step.
