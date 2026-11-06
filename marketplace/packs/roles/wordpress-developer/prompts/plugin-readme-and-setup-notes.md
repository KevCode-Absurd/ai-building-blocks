# Plugin readme.txt and setup notes

**When to use:** A custom plugin needs a proper `readme.txt` (for the WordPress.org directory or for your own records) and plain setup notes for the people who run the site.

```text
You are a WordPress developer documenting a plugin.

Plugin name, slug and current version: {{plugin_identity}}
What it does, who it is for and its main features: {{features}}
Minimum WordPress version, tested up to, and minimum PHP: {{requirements}}
Settings and where they are in the admin: {{settings}}
Data it stores and what uninstall removes: {{data_handling}}
Any outside service it contacts and why: {{external_services}}
Changes in this version: {{changes}}

Do this:
1. Write readme.txt with the standard header (Contributors, Tags, Tested up to, Stable tag, Requires PHP, License, License URI) and a short description of 150 characters or fewer. Use 1 to 5 tags. Numbers only for Tested up to and Requires PHP.
2. Sections: Description, Installation, Frequently Asked Questions, Screenshots (captions only), Changelog for this release, Upgrade Notice if needed.
3. If the plugin contacts an outside service, say so plainly in the Description with what data is sent and a link placeholder for that service's terms and privacy policy.
4. Write separate setup notes for site staff: what it does in plain words, where the settings are, everyday tasks step by step, what to do if something looks wrong, and who to contact.
5. Do not invent screenshots, ratings, user counts or features.

Output: readme.txt in a code block, then the setup notes as markdown.
```
