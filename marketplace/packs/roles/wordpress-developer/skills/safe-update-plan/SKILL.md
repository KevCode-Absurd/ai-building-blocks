---
name: safe-update-plan
description: Plans a safe update of WordPress core, themes, plugins and PHP for a live site, with a backup check, staging first, an update order, what to test after each step, how to roll back, and which plugins to replace or remove because they are abandoned, vulnerable or duplicated. Also plans PHP version moves (for example off PHP 8.1, which reached end of life on 31 December 2025) and readiness checks for the iframed editor in WordPress 7.1. Use it when updates have piled up, a host announces a PHP change, or before a big release.
---

# Safe update plan

## When to use

- Updates have piled up and the owner is scared to press the button.
- The host is moving the site to a newer PHP version, or the site still runs an end-of-life PHP version.
- A major WordPress release is out and the site uses custom blocks, a page builder or old plugins.
- A plugin clean-up: too many plugins, overlaps, or plugins nobody remembers installing.

## What you need

1. Site Health > Info copied to text: WordPress, PHP and database versions, active theme, every plugin with its version.
2. The list of available updates (Dashboard > Updates screenshot).
3. Whether a staging copy exists and how backups are taken and restored (host tool, plugin, manual).
4. Custom code: child theme, custom plugins, code snippets plugin, must-use plugins.
5. What the site must keep doing: forms, bookings, shop checkout, memberships, logins.
6. The host's PHP options and any deadline.

**Access:** level 1 to read Site Health, updates and backup status; level 2 to take a backup, run the plan on staging and test after each step; level 3 to run the confirmed steps on the live site in the agreed window, within your limits.

## Steps

### 1. Check the backup is real

A backup only counts if it has been restored. Ask when the last restore test was. If never, plan one on staging before anything else.

### 2. Build the inventory

For each plugin and theme record: current version, latest version, last updated date in the directory, whether it is still listed, known vulnerabilities from the client's security plugin or a public database, and what the site uses it for. Mark each one keep, update, replace or remove.

Red flags:
- Not updated in a long time, or closed in the directory.
- Unpatched vulnerability.
- Two plugins doing the same job.
- A plugin installed for one small feature that core or a short snippet now covers.
- Updates delivered from outside WordPress.org without the owner knowing why.

### 3. Check PHP and WordPress compatibility

- Compare the site's PHP version with php.net's supported versions. PHP 8.1 and older get no security fixes.
- Check WordPress's PHP compatibility table for the target core version.
- For each plugin, check "Requires PHP" and "Tested up to" in its directory listing or readme, and the changelog for breaking changes.
- For custom code, search for patterns that break on newer PHP (dynamic properties, removed functions, stricter types) and list them with before-and-after code.
- For custom blocks and editor scripts, check they work in the iframed post editor, which WordPress 7.1 always uses.

### 4. Set the order

Typical order, each step on staging first:
1. Full backup and restore test.
2. Remove plugins marked remove (after confirming nothing uses them).
3. Update plugins and theme one by one, starting with those that have security fixes.
4. Update WordPress core.
5. Change PHP version.
6. Replace plugins marked replace, one at a time.

Change one thing at a time so a failure points to one cause.

### 5. Write the test after each step

A short, repeatable list: home page, a key landing page, every form (submit and check the email arrives), menus on phone and desktop, search, login and logout, editor opens and saves a post, and for shops a full test order.

### 6. Write the rollback for each step

Plugin: reinstall the previous version from the backup or the directory's previous versions. Core: restore the backup. PHP: switch back in the host panel. Write who does it and how long it takes.

### 7. Plan the live run

Quiet time, maintenance window agreed, same order as staging, tests after each step, and a decision point: if a test fails and the fix is not obvious within the agreed time, roll back. **Level 3:** I run the live steps myself after the owner confirms the steps and the window, and log each one; otherwise the owner or developer runs them.

### 8. Set the routine

How often to update (security updates promptly, others on a monthly routine), which plugins can safely auto-update, and which need staging first.

## Checks before handing over

- The plan starts with a tested backup.
- Every plugin in Site Health is in the inventory with a keep, update, replace or remove call.
- Every version and date fact not from the client's data is marked "confirm on the official page".
- Each step has a test and a rollback.
- No plan promises zero downtime or a fixed finish time.
- Nothing is done on live before staging; the owner confirms the live steps and window, and at level 3 I run only those.

## Output format

1. Summary: risk level, top three risks, and the recommended path.
2. Backup and restore check.
3. Inventory table: item, current, latest, status, call, reason.
4. PHP and compatibility notes, with before-and-after code for custom code.
5. Ordered steps, each with test and rollback.
6. Live run plan and decision point.
7. Ongoing routine.

## Example of good output (short)

*Illustrative structure, not a real business: a bed and breakfast with a booking form. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary.** Medium risk. The site runs PHP 8.1 (no security fixes since 31 December 2025), WordPress 6.8, and 23 plugins, 4 of which overlap. Path: test a restore, remove 4 plugins, update the rest on staging, update core to the latest 7.1 release, then move to PHP 8.3.
>
> | Plugin | Current | Latest | Status | Call | Reason |
> |---|---|---|---|---|---|
> | Old Slider Pro | 3.2 | 3.2 | Not updated in years | Replace | Used on home page only; a core Cover block can replace it |
> | Contact Form plugin | 5.8 | 6.1 | Active | Update | Changelog lists a security fix |
> | Second SEO plugin | 2.0 | 2.4 | Active | Remove | Duplicates the main SEO plugin |
>
> **Step 5, PHP 8.3 on staging.** Test: booking form submits and email arrives; calendar loads on phone. Rollback: switch PHP back to 8.1 in the host panel (5 minutes, owner or host).
