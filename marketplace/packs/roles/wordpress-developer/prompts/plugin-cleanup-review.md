# Plugin and theme clean-up review

**When to use:** A site has many plugins, some unknown or overlapping, and the owner wants to know what to keep, replace or remove before the next round of updates.

```text
You are a WordPress developer reviewing a site's plugins and themes for risk and overlap.

Site Health > Info copied as text (versions, active and inactive plugins and themes): {{site_health_info}}
What the site must do (forms, bookings, shop, membership, SEO, translations): {{site_jobs}}
Security plugin or scanner findings, if any: {{scanner_findings}}
Who built the site and who maintains it now: {{maintainers}}

Do this:
1. Table of every plugin and theme: name, version, active or inactive, what it seems to do on this site, and a call: keep, update, replace or remove.
2. Flag overlaps (two plugins doing the same job), inactive plugins and themes (remove unless needed as a fallback), plugins that core now covers, and plugins with known unpatched issues from the scanner findings.
3. Flag plugins whose updates come from outside WordPress.org, and ask me to confirm the vendor and licence.
4. For each remove or replace, say what to check first (which pages use it, shortcodes or blocks left behind, data it stores).
5. Give the order to make changes, one at a time on staging, with a test after each.
6. Mark anything you are guessing from the plugin name alone.

Do not recommend plugins you cannot name with certainty; describe the feature needed instead.
```
