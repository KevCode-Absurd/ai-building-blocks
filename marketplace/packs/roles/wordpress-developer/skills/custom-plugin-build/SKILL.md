---
name: custom-plugin-build
description: Builds a small, single-purpose WordPress plugin, block (with block.json) or shortcode that editors can manage without touching code, using hooks and filters, a unique prefix, capability checks, nonces, sanitised input, escaped output and prepared SQL, with clean activation and uninstall behaviour, translation-ready text, staging install steps and a test list. Use it to replace a heavy plugin you use for one feature, add a custom post type or settings page, or give editors a reusable block.
---

# Custom plugin build

## When to use

- The site uses a large plugin for one small feature.
- Editors need a custom content type (team members, locations, events) or a settings page.
- A reusable block or shortcode for something editors add often.
- A small integration on a WordPress hook, such as adding fields to a form email.

Not for whole themes, page builder layouts, or WooCommerce checkout, payment or tax logic. WooCommerce display hooks are fine.

## What you need

1. What editors need to do, where the feature appears and who may use it (which user roles).
2. WordPress and PHP versions, active theme, and the plugins that touch the same area (from Site Health > Info).
3. Example content: what a typical item contains, with made-up data.
4. Design notes or a screenshot of where it shows.
5. Whether the plugin should keep or delete its data when uninstalled.

**Access:** level 1 to read site details and any existing code; level 2 to install and test the plugin on staging or open a pull request; level 3 to install or update it on the live site, within your limits and after a fresh backup.

## Steps

### 1. Check core first

Can a core block, pattern, custom field, menu or setting do it? If yes, say so and stop. Less code is less to maintain.

### 2. Plan the plugin

- One main file with the plugin header (name, description, version, requires at least, requires PHP, licence, text domain).
- A unique prefix of at least four letters for every function, class, option, transient, hook name and post type key, for example `hlbike_` for a made-up "Harbour Lane Bikes".
- Only the files the feature needs: `includes/`, `admin/`, `public/`, `blocks/`, `languages/`, `uninstall.php`.
- Exit at the top of every PHP file if `ABSPATH` is not defined.

### 3. Register on the right hooks

| Feature | Hook |
|---|---|
| Post types and taxonomies | `init` |
| Blocks from `block.json` | `init`, with `register_block_type()` pointing at the folder |
| Shortcodes | `init`, with `add_shortcode()` |
| Settings pages | `admin_menu` and `admin_init` (Settings API) |
| REST routes | `rest_api_init` |
| Front-end scripts and styles | `wp_enqueue_scripts`, only on pages that need them |

Use only functions that exist in the stated WordPress version; mark anything newer as "requires WordPress X".

### 4. Make every entry point safe

- **Capabilities:** check `current_user_can()` before showing admin screens or changing data. Do not rely on `is_admin()`, which only says you are in the admin area.
- **Nonces:** add `wp_nonce_field()` to forms and check with `check_admin_referer()`; use `check_ajax_referer()` for AJAX. Nonces are not access control, so keep the capability check too.
- **Input:** sanitise on save with the right function (`sanitize_text_field()`, `absint()`, `sanitize_email()`, `esc_url_raw()`, `wp_kses_post()` for limited HTML). Reject what is not valid.
- **Output:** escape late, at the point of printing (`esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`).
- **SQL:** prefer WordPress APIs (`WP_Query`, `get_posts()`, options and meta functions). If raw SQL is needed, use `$wpdb->prepare()` with unquoted `%s`, `%d`, `%f` or `%i` placeholders.
- **REST:** every route has a `permission_callback` that checks capabilities, plus `validate_callback` and `sanitize_callback` for each argument.

### 5. Blocks

Write `block.json` with `apiVersion` 3 so the block works in the iframed editor, which WordPress 7.1 always uses. Use `useBlockProps()` in the editor and on save. For blocks that show live data, use a PHP render callback (dynamic block) so saved content does not go stale.

### 6. Activation and uninstall

- Activation: create defaults or flush rewrite rules once, not on every load.
- Uninstall: `uninstall.php` removes options and custom tables only if the owner chose "delete data"; otherwise leave it and say so.

### 7. Translation and markup

Wrap all user-facing text in translation functions with the plugin's text domain. Keep markup simple with plain class names so the theme's styles apply.

### 8. Self-check, then hand over

Run the checks below. Run Plugin Check (`wp plugin check <plugin>`) on staging with level 2 access, or recommend it, and say it does not replace a human review. **Level 3:** install it on the live site after staging tests pass, within your limits, and log it.

## Checks before handing over

- The prefix is used on every global name.
- Every WordPress function used exists in the stated version and is not deprecated.
- Every form and AJAX handler checks a nonce and a capability.
- Every saved value is sanitised; every printed value is escaped.
- No raw SQL without `$wpdb->prepare()`.
- No bundled copies of libraries WordPress already ships.
- No calls to outside servers unless the brief names them and the owner agreed.
- No invented settings, hooks or plugin names.
- Staging install steps and a test list are included.

## Output format

1. What the plugin does, and why core alone was not enough.
2. Folder tree.
3. Every file in full.
4. Install steps for a staging copy (upload zip or folder, activate, where to find the feature).
5. Test list: editor tasks, logged-in and logged-out views, the active theme, a phone layout, a plugin update, uninstall.
6. Data the plugin creates and what uninstall removes.
7. Not verified.

## Example of good output (short)

*Made-up business for illustration: "Harbour Lane Bikes", replacing a large directory plugin used only for a shop locations list.*

> **What it does.** Adds a "Locations" content type with address, phone and opening hours, and a "Locations list" block. Core blocks could not hold structured opening hours for reuse on several pages.
>
> ```
> hlbike-locations/
>   hlbike-locations.php
>   includes/post-type.php
>   includes/meta.php
>   blocks/locations-list/block.json
>   blocks/locations-list/render.php
>   uninstall.php
>   languages/
> ```
>
> **Safety notes.** Meta saved with `sanitize_text_field()` after `check_admin_referer( 'hlbike_save_location', 'hlbike_location_nonce' )` and `current_user_can( 'edit_post', $post_id )`. Block output escaped with `esc_html()` in `render.php`.
>
> **Uninstall.** Keeps locations unless "Delete data on uninstall" is ticked in Settings > Locations.
