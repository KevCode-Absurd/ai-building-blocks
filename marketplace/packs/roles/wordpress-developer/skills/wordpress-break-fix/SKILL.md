---
name: wordpress-break-fix
description: Finds why a WordPress site or page broke (white screen, critical error message, broken menu or layout, admin lock-out, feature gone after an update) from the error log, Site Health info, plugin list and recent changes, then gives a safe test path on a staging copy, the smallest fix (setting, child theme change or commented snippet, never a core edit), a test list and a rollback. Use it when something on a WordPress site stopped working, especially after an update or on a site built by someone who has left.
---

# WordPress break-fix

## When to use

- White screen, "There has been a critical error on this website", or a recovery mode email.
- A menu, page builder layout, form or slider stopped working.
- Something broke right after a core, plugin, theme or PHP update.
- The admin area will not load or keeps logging you out.
- A site built by someone who is no longer around, with no notes.

Not for speed tuning, new site builds, or WooCommerce checkout and payment logic.

## What you need

1. What broke, where, and for whom (logged-in, logged-out, mobile, one browser).
2. When it started and what changed just before: updates, new plugin, host move, PHP change, new code snippet.
3. The error: the recovery mode email text, the `debug.log` lines from around the time, or the host's PHP error log. Remove email addresses and IP addresses first.
4. Site Health > Info copied to text (WordPress version, PHP version, active theme, active plugins with versions).
5. Screenshots of the broken page and, if relevant, the browser console.
6. Whether a staging copy and a recent backup exist.

Never send passwords or hosting logins. If I work in the site, you connect me as access.md describes.

**Access:** level 1 to read logs and Site Health; level 2 to run the test path and try the fix on staging; level 3 to apply the tested fix on the live site, within your limits and after a fresh backup.

## Steps

### 1. Restate the bug

One sentence: "Since updating Plugin X on Tuesday, the contact page shows a critical error for everyone." If the client cannot say what changed, ask about updates, host emails and anyone else with access.

### 2. Read the log for the first real error

Scan from the time the problem started. Ignore repeated notices and deprecation warnings at first. Find the first `PHP Fatal error` or `Uncaught` line and note the file path, line number and function. The path shows the culprit: `wp-content/plugins/<name>/`, `wp-content/themes/<name>/`, or `wp-content/mu-plugins/`.

If there is no log, give the safe steps to turn logging on in `wp-config.php` on staging:

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );      // writes wp-content/debug.log
define( 'WP_DEBUG_DISPLAY', false ); // never show errors to visitors
```

Remind them to turn it off afterwards and not to leave the log in a public place.

### 3. List likely causes, ranked by evidence

Common causes and their tell-tale signs:

| Cause | Evidence |
|---|---|
| Plugin or theme update | Fatal error in that plugin's folder, started at the update time |
| PHP version change | Errors about removed functions or type errors in older plugins |
| Plugin conflict | No fatal error; breaks only when two plugins are both active |
| Caching | Works logged in, broken logged out; fixed by clearing cache |
| Memory or time limits | "Allowed memory size exhausted" or timeouts in the log |
| Custom snippet | Error in the child theme's `functions.php` or a snippets plugin |
| Database or URL change | Redirect loops, mixed content, missing images after a move |

A cause that needs code or settings I have not seen becomes a question, not a claim.

### 4. Give a safe test path

On a staging copy (or with a fresh backup if no staging exists). With level 2 access I run these steps myself; otherwise I give them to you:
1. If the admin is locked out, use the recovery mode link from the email, or rename the suspect plugin's folder by SFTP to deactivate it.
2. Switch to a default theme and test.
3. Turn plugins off, then back on in halves until the problem returns; the last half holds the culprit.
4. Roll back the suspect plugin to its previous version if the update caused it.

### 5. Write the smallest fix

- A setting change, a plugin rollback or replacement, a child theme change, or a short snippet in a small custom plugin.
- Every snippet is commented, prefixed and uses functions that exist in the site's WordPress and PHP versions.
- Never edit core files or a third-party plugin's files; the next update would undo it.

### 6. Test and roll back

Give the test list (below), then a rollback step for every change: restore the backup, reactivate the old version, remove the snippet. **Level 3:** apply the tested fix on live in the agreed window, run the test list there, and log each step.

### 7. Prevent a repeat

One suggestion, such as a staging site, an update routine, removing an abandoned plugin, or moving off an end-of-life PHP version.

## Checks before handing over

- The cause cites a log line or test result, or is marked "likely, not proven".
- Every step that deletes, resets or overwrites data has a backup first.
- No core or third-party plugin file is edited.
- Plugin and theme names come from the client's list.
- The test list covers the broken page, forms, menus, logged-in and logged-out views and a phone layout.
- Debug display is off on live and logging is switched off afterwards.
- Jargon is explained once in plain words.

## Output format

1. The bug in one sentence.
2. Evidence: the log lines that matter, with file and line.
3. Likely causes, ranked, with the evidence for each.
4. Safe test path on staging.
5. The fix, with exact steps or the snippet and where it goes.
6. Test list.
7. Rollback.
8. One prevention step.

## Example of good output (short)

*Illustrative structure, not a real business: a yoga studio site with a class booking plugin. Copy the shape, never the content: every fact comes from the client's own context.*

> **Bug.** Since the automatic plugin updates on 2 November, the Timetable page shows a critical error for all visitors.
>
> **Evidence.** `debug.log`, 2 Nov 03:14: `PHP Fatal error: Uncaught Error: Call to undefined function studio_get_classes() in wp-content/themes/[business]-child/functions.php:88`. The child theme calls a function the booking plugin removed in its new version.
>
> **Fix.** On staging, wrap the call in a check and switch to the plugin's documented replacement once confirmed in its changelog. Until then, the guarded version stops the fatal error:
>
> ```php
> // [Business]: guard against the booking plugin removing this helper (2 Nov update).
> if ( function_exists( 'studio_get_classes' ) ) {
>     $[business]_classes = studio_get_classes();
> }
> ```
>
> **Rollback.** Restore `functions.php` from the backup taken before the change, or roll the booking plugin back one version.
>
> **Prevention.** Turn off auto-updates for the booking plugin and update it monthly on staging first.
