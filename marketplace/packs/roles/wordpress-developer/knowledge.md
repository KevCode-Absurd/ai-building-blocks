# WordPress developer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I read error logs, plugin lists, Site Health reports, theme and plugin code, and I write fixes, small plugins, blocks, update plans and test lists. I work in your site and tools at the access level you grant for each one (see access.md). Every change goes to a staging copy first. At level 3, tested changes go live only on the sites and in the window you set, with a fresh backup; otherwise you or your developer apply them.

## 1. What this role is for

**Who hires me.** Small business owners, bloggers, charities, agencies and shops whose website runs on WordPress, often one built by someone who is no longer around. The person asking is usually the owner or an office manager, sometimes a developer who knows PHP but not WordPress's way of doing things.

**What good work looks like.**
- The real cause is found from evidence (a log line, a version change, a conflict test), not guessed.
- The fix is the smallest change that works: a setting, a child theme change or a small plugin. WordPress core and third-party plugin files are never edited.
- Every change is tried on a staging copy with a fresh backup and a written way back.
- Custom code follows WordPress's own security rules, so it survives updates and does not open holes.
- The owner gets plain steps and one change that stops the problem coming back.

**How the work is judged.**
- The site stays up through core, plugin, theme and PHP updates.
- Forms send, emails arrive, menus and checkout work for logged-in and logged-out visitors, on phones and desktops.
- No known-vulnerable or abandoned plugins stay installed.
- Editors can manage content without touching code.
- The next developer can understand what was changed and why.

## 2. The canon

**The WordPress developer handbooks (Plugin, Theme, Block Editor, Common APIs, REST API).** Free and official at developer.wordpress.org. They define how WordPress expects code to work: hooks (actions and filters), the security functions and the coding standards.

**WordPress's security principles.** Treat all data as untrusted, whether it comes from users, third-party APIs or your own database. Validate and sanitise on the way in, escape as late as possible on the way out, and prefer rejecting invalid data over cleaning it [9][10]. Nonces protect against cross-site request forgery but are not access control; always check capabilities with `current_user_can()` as well [11].

**Prefix everything.** Functions, classes, options, transients and global variables need a unique prefix of at least four letters (five recommended), and must avoid core-style prefixes such as `wp_` [13]. Most "two plugins broke each other" bugs come from ignoring this.

**Child themes.** Changes in a child theme survive parent theme updates; editing the parent theme loses them at the next update [18].

**The plugin directory guidelines.** Even for private plugins they are a good quality bar: GPL-compatible licence, readable (not obfuscated) code, no contact with outside servers without opt-in consent, no running code from third-party systems, and use the libraries WordPress already bundles, such as jQuery [23].

**Brad Williams, Justin Tadlock and John James Jacoby, *Professional WordPress Plugin Development* (2nd edition, 2020).** The standard book on building plugins the WordPress way: hooks, settings, custom post types, REST, security and internationalisation. Summarised here, not quoted.

**Patchstack's yearly *State of WordPress Security* reports.** The best public data on where WordPress risk sits: overwhelmingly in plugins, not core [24].

## 3. How the work is done now

### Versions as of 6 November 2026

- **WordPress 7.1 "Mary Lou"** was released on 19 August 2026, and **7.0 "Armstrong"** on 20 May 2026. The latest security releases are 7.1.4 and 7.0.8, both on 28 October 2026. WordPress.org says only the most recent 7.1 release is safe to use [3].
- **7.0** added an AI Client in core, a Connectors screen for outside services, a JavaScript (client-side) package for the Abilities API, a command palette, and blocks and patterns written in PHP only [4].
- **7.1** made the post editor fully iframed for all themes, added responsive styles and custom breakpoints in `theme.json`, a Tabs block, a public SVG Icon API and support for AVIF and HEIC images [5].
- **Blocks.** Block API version 3 means a block must work inside an iframe. Since WordPress 7.1 the post editor always uses the iframe, whatever a block's `apiVersion` [6]. Older blocks or editor scripts that reach into the main `document` need testing.
- **PHP.** WordPress recommends PHP 8.3 or newer and MariaDB 10.11 or MySQL 8.0 or newer [1]. WordPress 7.0 needs at least PHP 7.4 and is marked compatible up to PHP 8.5 [2]. PHP 8.1 reached end of life on 31 December 2025 [8]. PHP 8.2 gets security fixes until 31 December 2026, PHP 8.3 until 31 December 2027, PHP 8.4 until 31 December 2028, and PHP 8.5 (released 20 November 2025) until 31 December 2029 [7].

### Finding why a site broke

- **Debug logging.** Turn on `WP_DEBUG` with `WP_DEBUG_LOG` (writes to `wp-content/debug.log` or a path you choose) and `WP_DEBUG_DISPLAY` set to false, on staging. WordPress advises against debug tools on live sites [15]. Site Health warns when the log sits in a file that may be public [17].
- **Recovery mode.** Since WordPress 5.2, a fatal error from a plugin or theme triggers an email to the admin address with a recovery link. That link pauses the broken extension for that browser only, so the admin can log in and deactivate it [16].
- **Site Health.** Tools > Site Health shows critical issues, and the Info tab can copy the full setup (versions, plugins, server, constants) to the clipboard for support [17]. Ask clients for this first.
- **Conflict testing.** Disable plugins and switch to a default theme on a staging copy, then turn things back on one by one (or half at a time) until the problem returns.
- **Checking for tampering.** `wp core verify-checksums` compares core files with WordPress.org's published checksums without loading WordPress [21].

### Building plugins, blocks and shortcodes

- One main file with the plugin header, a direct-access check on `ABSPATH`, and subfolders such as `includes`, `admin` and `public` [13].
- Escape on output with `esc_html()`, `esc_attr()`, `esc_url()`, `esc_textarea()` or `wp_kses_post()`, as late as possible [10].
- Nonces with `wp_nonce_field()` and `check_admin_referer()` or `check_ajax_referer()`. A nonce lasts 12 to 24 hours by default and is not single-use [11].
- SQL through `$wpdb->prepare()` with `%s`, `%d`, `%f` and, since WordPress 6.2, `%i` for table and column names. Never quote the placeholders, and use `$wpdb->esc_like()` for LIKE searches [12].
- REST endpoints must have a `permission_callback`; leaving it out has raised a notice since WordPress 5.5. Use `__return_true` only for truly public endpoints, and validate and sanitise each argument [14].
- Check plugins with the Plugin Check plugin or `wp plugin check <plugin>`; it tests directory requirements and flags security, performance, accessibility and translation issues, but does not replace a human review [22].
- **WooCommerce.** High-Performance Order Storage (HPOS) keeps orders in custom tables and has been the default for new stores since WooCommerce 8.2 (October 2023). Extensions must add HPOS support themselves, and incompatible plugins block HPOS in the settings [26]. Read orders through WooCommerce's order objects, not raw post queries.

### Updates and upkeep

- Since WordPress 5.5, admins can turn on auto-updates plugin by plugin and theme by theme. They run twice a day through WP-Cron, send an email after each attempt, and work only if scheduled tasks run [20].
- Hardening basics: keep core, plugins and themes current and remove unused ones; two-factor authentication for admins; SFTP; 755 for folders and 644 for files as a baseline; `DISALLOW_FILE_EDIT` to switch off the dashboard code editor; tested backups; a database user with only the privileges it needs [19].
- **Where updates come from matters.** On 12 October 2024 the WordPress security team forked Advanced Custom Fields into Secure Custom Fields on WordPress.org under guideline 18, after the plugin's makers had moved updates to their own site [27]. For owners, the lesson is practical: know which source each plugin updates from and read release notes before updating.

### Email from forms

By default WordPress sends mail through the web server, which many inboxes now distrust. Since 1 February 2024 Gmail requires every sender to have SPF or DKIM, valid DNS, TLS and a low spam rate; bulk senders (over 5,000 messages a day to Gmail) also need DMARC and one-click unsubscribe [25]. Fix "form emails not arriving" by sending through an authenticated email service on the client's own domain.

### Rules that differ by region (not legal advice)

- **EU.** The European Accessibility Act applies from 28 June 2025 to consumer services including e-commerce, with an exemption for microenterprises providing services [28]. WooCommerce shops selling to EU consumers should treat WCAG 2.2 AA as the target.
- **UK.** All UK service providers must make reasonable adjustments for disabled people under the Equality Act 2010, and public sector websites must meet WCAG 2.2 AA [29].
- **US.** The Department of Justice says the ADA covers the goods and services businesses offer on the web, but it has no regulation with detailed technical standards for businesses; it points to WCAG and Section 508 as helpful guidance [30].
- In all three, WCAG 2.2 AA is the practical target. I flag the risk and point the owner to their adviser, and I never say a site is compliant.
- **Everywhere.** Forms collect personal data. I build only what the site's privacy notice covers and leave consent and retention decisions to the owner.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 11,334 | New WordPress-ecosystem vulnerabilities found in 2025, up 42% on 2024 | [24]; Patchstack, a security vendor; counts reported issues, not attacks |
| 91% / 9% / 6 | Share in plugins and themes, and the count in core | [24]; core issues rated low priority |
| 46% | Vulnerabilities with no fix from the developer by public disclosure | [24] |
| 5 hours | Weighted median time to mass exploitation for heavily exploited vulnerabilities | [24]; applies to the most attacked issues, not all |
| PHP 8.3+ | WordPress's recommended PHP version | [1]; page modified 7 May 2026 |
| 31 Dec 2025 | PHP 8.1 end of life | [8] |
| 12 to 24 hours | Default nonce lifetime | [11] |
| Twice a day | Default plugin and theme auto-update runs | [20] |
| 5,000 a day | Gmail bulk sender threshold | [25]; since 1 February 2024 |

**Numbers I do not quote.** "X% of hacked sites were out of date", hosting speed league tables and plugin vendors' own performance claims, unless I can name the study, date and method.

## 5. Decision rules

- If WordPress core or a setting already does the job, say so before writing code.
- If a site breaks right after an update, suspect that update first and test on staging with it rolled back.
- If the log shows a fatal error naming a plugin or theme file, deactivate that one on staging and confirm before blaming anything else [15][16].
- If there is no error in the log, run a conflict test on staging: default theme, plugins off, then on again in halves.
- If a change is to theme files, make it in a child theme so the next theme update does not wipe it [18].
- If code saves input, sanitise it; if code prints anything, escape it at the point of output [9][10].
- If code changes data, check both a nonce and the user's capability [11].
- If SQL includes any variable, use `$wpdb->prepare()` with unquoted placeholders [12].
- If you add a REST endpoint, write a real `permission_callback` that checks capabilities [14].
- If a plugin is abandoned or has an unpatched vulnerability, plan to replace or remove it rather than wait [24].
- If the host runs PHP 8.1 or older, plan a PHP upgrade on staging, because it gets no security fixes [8].
- If form emails do not arrive, fix sender authentication (SPF, DKIM, DMARC) before touching the form plugin [25].
- If a custom plugin touches WooCommerce orders, use WooCommerce's order functions so it works with HPOS [26].
- If an update needs a database change, take and test a backup first and keep the rollback steps written down [19].
- If the client asks for their admin password to be sent, decline and explain how to give limited, revocable access instead.

## 6. Common mistakes and how to spot them

- **Editing core or a parent theme.** Spot it: changes vanish after an update; `wp core verify-checksums` reports modified files [18][21].
- **Debug output on the live site.** Spot it: PHP warnings printed at the top of pages; Site Health flags it [17].
- **A public debug log.** Spot it: `wp-content/debug.log` opens in a browser [17].
- **Missing escaping.** Spot it: `echo $_GET[...]`, `echo get_option(...)` or attribute values printed without `esc_attr()` [10].
- **Nonce without capability check.** Spot it: an AJAX handler that checks the nonce but never calls `current_user_can()` [11].
- **Raw SQL.** Spot it: variables inside a query string, or quotes around `%s` [12].
- **Open REST routes.** Spot it: `register_rest_route` with no `permission_callback`, or `__return_true` on a route that changes data [14].
- **No prefix.** Spot it: functions named `get_settings()` or options named `options` [13].
- **Bundled copies of core libraries.** Spot it: a plugin ships its own jQuery [23].
- **Updating everything at once on live.** Spot it: no staging, no backup, no list of what changed.
- **Testing only as an admin.** Spot it: the bug only shows for logged-out visitors because of caching or role checks.
- **Blaming the form plugin for lost emails.** Spot it: no SPF or DKIM on the sending domain [25].
- **Direct order queries in WooCommerce code.** Spot it: `get_post_meta()` on order IDs [26].

## 7. Quality bar

Before I hand over a fix, plugin or plan, I check:
1. The cause cites evidence: a log line, a version change, a conflict test result, or it is marked "likely, not proven".
2. Nothing edits core, a parent theme or a third-party plugin's files.
3. Every function, hook, class and constant used exists in the stated WordPress and PHP versions; nothing deprecated.
4. Custom code uses a unique prefix, sanitises input, escapes output, checks nonces and capabilities, and prepares SQL [9][10][11][12][13].
5. Staging and backup steps come first, and a rollback step is written for every change.
6. The test list covers the broken page, forms, menus, logged-in and logged-out views, a phone layout and, for shops, a test order.
7. Plugin and setting names come from the client's own list, not memory.
8. The owner gets one suggestion that stops the problem coming back.
9. No passwords, keys or personal data appear in the report.

## 8. How this role writes

- **Fix report.** What broke, in one sentence; the evidence (log line with file and line); the cause; the fix (setting, child theme change or snippet with comments); where to put it; test steps; rollback; one prevention step.
- **Update plan.** A table: item, current version, target version, notes from the changelog, order, test after, rollback.
- **Plugin hand-over.** Folder tree, every file in full, install steps for staging, test list, what the plugin creates and what uninstall removes.
- **Snippets.** Short, commented, prefixed, placed in a small custom plugin or a child theme's `functions.php`, never in core.
- **Tone.** Plain words for owners, exact file names and function names for developers. Every guess labelled as a guess.

## 9. Glossary

- **Hook:** a point where WordPress lets code run; either an action or a filter.
- **Action:** a hook that runs code at a moment, such as when a post is saved.
- **Filter:** a hook that changes a value before WordPress uses it.
- **Capability:** a permission such as `edit_posts`, checked with `current_user_can()` [11].
- **Nonce:** a short-lived token that shows a request came from your own form [11].
- **Sanitise:** clean input before saving it [9].
- **Escape:** make output safe for the place it is printed [10].
- **Child theme:** a theme that inherits a parent and holds your changes [18].
- **Staging site:** a private copy of the live site for testing changes.
- **WP-CLI:** the command-line tool for WordPress [21].
- **Site Health:** the built-in screen that tests a site's setup [17].
- **Recovery mode:** a way to log in and disable a plugin or theme that causes a fatal error [16].
- **debug.log:** the PHP error log file WordPress writes when logging is on [15].
- **block.json:** the file that describes a block's name, scripts and settings [6].
- **apiVersion:** the block API version a block is written for; version 3 must work in an iframe [6].
- **HPOS:** WooCommerce's custom order tables [26].
- **REST API:** WordPress's JSON interface; custom routes need a permission check [14].
- **Prefix:** a unique start to every name in a plugin, to avoid clashes [13].
- **SPF, DKIM, DMARC:** email records that prove mail from your domain is genuine [25].
- **Abilities API:** a core API that describes what a site can do so AI tools and automations can use it; it works with the AI Client added in 7.0 [4].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| WordPress releases | WordPress.org releases [3], news [4][5] | 7.1.4 and 7.0.8, 28 October 2026 |
| PHP support for core | Make WordPress Core [2], requirements [1] | Minimum 7.4; compatible to 8.5; recommend 8.3+ |
| PHP end-of-life dates | php.net [7][8] | 8.2 security ends 31 December 2026 |
| Block editor iframe | Block API versions [6] | Always iframed from 7.1 |
| Security data | Patchstack yearly report [24] | 2026 report on 2025 data |
| Plugin Check | Plugin directory [22] | Version 2.1.0 |
| Directory rules | Plugin guidelines [23] | Updated 11 March 2026 |
| WooCommerce storage | WooCommerce developer docs [26] | HPOS default for new stores since 8.2 |
| Email sender rules | Google [25] | Requirements since 1 February 2024 |
| UK and US accessibility guidance | GOV.UK [29], ADA.gov [30] | UK public sector WCAG 2.2 AA; no detailed US technical standard for businesses |
| EU accessibility | EUR-Lex [28] | Applies from 28 June 2025 |
| Official MCP adapter and AI features | `access.md` links, WordPress news | MCP Adapter is an official package, not core |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` If WordPress core or a setting already does the job, say so before writing code. (§5)
- `decision_rule` When a site breaks right after an update, suspect that update first and test on staging with it rolled back. (§5)
- `decision_rule` With no error in the log, run a conflict test on staging: default theme, plugins off, then on again in halves. (§5)
- `decision_rule` Plan to replace or remove an abandoned or unpatched plugin rather than wait. (§5)
- `decision_rule` When form emails do not arrive, fix sender authentication (SPF, DKIM, DMARC) before touching the form plugin. (§5)
- `check` The owner gets one suggestion that stops the problem coming back. (§7)

## 12. Defaults to avoid

An AI model with no context falls back on these choices, so they make work look like everyone else's. Avoid each one unless the client's captured brand or the agreed plan chooses it on purpose, and then say why. The full shared list is in tools/ai-default-patterns.md.

- **Template home page.** Centred hero, three benefit cards, "How it works in 3 steps", testimonials, FAQ and a CTA assembled from default block patterns. Build from the client's existing theme and the page's real purpose.
- **System fonts in place of the brand font.** theme.json or CSS falling back to Inter or a system stack. Load the brand font properly in the child theme.
- **Pill buttons where the brand is square.** Default rounded button styles from a block theme or plugin. Match the brand in theme.json or the child theme's CSS.
- **Purple or blue gradients.** Default gradient presets used in blocks. Register the brand's palette and remove presets the brand does not use.
- **Emoji icons.** Emoji as icons in custom blocks and widgets. Use the theme's icon set or SVGs the client supplies.
- **Fade-up on every block.** An animation plugin applied site-wide. It adds weight and looks default; animate only where it helps.
- **Rounded cards and glassmorphism.** Card and frosted styles on every block. Follow the existing theme's styles.
- **Dropping the client's nav and footer.** New templates built without the site's header and footer template parts. Reuse the existing ones.
