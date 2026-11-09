---
name: plugin-security-hardening
description: Reviews custom WordPress plugin or theme code for the flaws that cause most WordPress vulnerabilities (missing capability checks, missing nonces, unsanitised input, unescaped output, raw SQL, open REST routes, unsafe file uploads, direct file access) and returns the code fixed with WordPress's own security functions, a finding-by-finding table, a test for each fix and the risks left for a human reviewer. Use it before releasing a plugin, after a security plugin or report flags custom code, or when you inherit a plugin nobody has reviewed.
---

# Plugin security hardening

## When to use

- Before installing a custom or freelancer-built plugin on a live site.
- A security scanner, host or researcher flagged custom code.
- You inherited a plugin or a theme `functions.php` full of AJAX handlers and forms.
- AI-written WordPress code that nobody has reviewed.

This is a code review and fix pass, not a penetration test. I do not scan or attack live sites, and I never say code "is secure".

## What you need

1. The plugin or theme code: the main file and every file with forms, AJAX handlers, REST routes, shortcodes, admin pages or database queries.
2. WordPress and PHP versions.
3. Who should be able to use each feature (user roles), and which features are public.
4. Any scanner report or vulnerability notice, with the affected version.

Remove API keys, licence keys and passwords from the code before sharing. If any were committed, rotate them.

**Access:** level 1 to read the code; level 2 to apply the fixes on a branch or a staging copy and run the test steps there; level 3 to ship the fixed version to the live site, within your limits and after a fresh backup.

## Steps

### 1. Map the entry points

List every place outside input reaches the code:
- `add_action( 'wp_ajax_...' )` and `wp_ajax_nopriv_...` handlers (nopriv means logged-out visitors can call it).
- `register_rest_route()` calls.
- `admin_post_` handlers and admin page form submissions.
- Shortcode attributes and block attributes.
- Direct reads of `$_GET`, `$_POST`, `$_REQUEST`, `$_COOKIE`, `$_FILES`, `$_SERVER`.
- PHP files that can be loaded directly by URL.

### 2. Check each entry point against the five rules

| Rule | What to look for | Fix |
|---|---|---|
| Who may do this? | No `current_user_can()` before an action that changes data or shows private data | Add the narrowest capability check, such as `manage_options` for settings or `edit_post` with the post ID |
| Did the request come from our form? | No nonce, or a nonce checked without a capability check | `wp_nonce_field()` plus `check_admin_referer()`, or `check_ajax_referer()` for AJAX, and keep the capability check |
| Is the input clean? | Raw superglobals saved or used | `wp_unslash()` then the right sanitiser: `sanitize_text_field()`, `absint()`, `sanitize_email()`, `sanitize_key()`, `esc_url_raw()`, `wp_kses_post()`; reject invalid values |
| Is the output safe? | `echo` of variables, options or meta without escaping | Escape at output: `esc_html()`, `esc_attr()`, `esc_url()`, `esc_textarea()`, `wp_kses_post()` |
| Is the SQL prepared? | Variables in query strings, quoted placeholders | `$wpdb->prepare()` with unquoted `%s`, `%d`, `%f`, `%i`; `$wpdb->esc_like()` for LIKE |

### 3. Check the special cases

- **REST routes:** every route needs a `permission_callback`. `__return_true` is only for data that is truly public and read-only.
- **nopriv AJAX:** confirm logged-out access is intended; if so, rate-limit or validate tightly and never change site settings.
- **File uploads:** use `wp_handle_upload()`, check file type with `wp_check_filetype_and_ext()`, limit types to what the feature needs, and never trust the file name.
- **Direct file access:** every PHP file starts with `defined( 'ABSPATH' ) || exit;`.
- **Redirects:** use `wp_safe_redirect()` for user-supplied destinations.
- **Options and transients:** prefixed names; no secrets stored in plain options without the owner knowing.
- **Remote requests:** use `wp_remote_get()` and `wp_remote_post()`, check responses, and never run returned code.

### 4. Fix and test

For each finding, give the fixed code and a test (with level 2 access, apply both on staging or in a pull request): a manual step (log in as a Subscriber and call the AJAX action; it should fail with a 403 or `-1`) or an automated test if the plugin has PHPUnit tests.

### 5. Rank and report

Rank findings: must fix (data change or exposure without a capability check, SQL injection, stored cross-site scripting, arbitrary upload), should fix, and note. Recommend running Plugin Check on staging and a human review for anything handling payments or personal data.

## Checks before handing over

- Every entry point from step 1 appears in the findings table, even if it passed.
- Every fix uses a real WordPress function that exists in the stated version.
- Capability checks use the narrowest capability that works.
- No fix silently changes behaviour for legitimate users; behaviour changes are listed.
- Each fix has a test step.
- No claim that the code is secure; the report says what was reviewed and what was not.
- No keys, passwords or personal data appear in the report.

## Output format

1. Summary: the most serious findings in plain words.
2. Entry point map.
3. Findings table: ID, file and line, rule broken, severity, fix, test.
4. Fixed files in full, or diffs for large files.
5. What was not reviewed (files not shared, third-party libraries).
6. Next steps: staging test, Plugin Check run, version bump and changelog line.

## Example of good output (short)

*Illustrative structure, not a real business: a bookshop with a custom "reserve a book" plugin. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary.** Any visitor, even logged out, can delete reservations: the `wp_ajax_nopriv_[business]_delete` handler has no nonce and no capability check. Two admin screens print customer names without escaping.
>
> | ID | File:line | Rule | Severity | Fix | Test |
> |---|---|---|---|---|---|
> | F1 | `includes/ajax.php:41` | Who may do this? | Must fix | Remove the nopriv hook; add `check_ajax_referer( '[business]_delete' )` and `current_user_can( 'manage_options' )` | Logged out: request returns `-1`. Subscriber: 403. Admin: works. |
> | F2 | `admin/list.php:77` | Is the output safe? | Must fix | `echo esc_html( $reservation->name );` | Save a name containing `<b>` and confirm it shows as text |
> | F3 | `includes/db.php:19` | Is the SQL prepared? | Must fix | `$wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", $id )` | Request with `id=1 OR 1=1` returns one row or none |
