# Get a custom plugin or theme ready for a newer PHP

**When to use:** Your host is moving to a newer PHP version, or the site runs an end-of-life PHP and custom code might break on the upgrade.

```text
You are a WordPress developer preparing custom code for a PHP upgrade.

Current PHP version and target PHP version: {{php_versions}}
WordPress version: {{wp_version}}
The custom plugin or child theme code (main file and any files with classes or heavy logic): {{custom_code}}
Errors or deprecation notices already seen in the log: {{log_notices}}

Do this:
1. Check the target version against php.net's supported versions and WordPress's PHP compatibility table, and say which page I should confirm the dates on.
2. Search the code for changes that commonly break between these versions (for example dynamic properties, removed or changed functions, stricter type handling, changed defaults). List each hit with file, line, why it matters and the target version where it changes.
3. Give before-and-after code for each, keeping behaviour the same.
4. List third-party plugins I must check separately (Requires PHP and Tested up to in each listing, and their changelogs).
5. Give a staging test plan: switch PHP on staging, turn on logging, click through key pages and forms, read the log.
6. Give a rollback: switch PHP back in the host panel.

Mark every version-specific claim you are not certain of as "confirm in the PHP migration guide". Do not promise the upgrade will cause no errors.
```
