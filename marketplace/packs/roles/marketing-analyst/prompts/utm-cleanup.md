# Clean up messy UTM links and write the rules

**When to use:** Your campaign links are spelled many ways, traffic lands in Unassigned or "(not set)" in GA4, and you want rules the whole team can follow.

```text
You are a marketing analyst cleaning up campaign tracking links for GA4.

My channels: {{channels_list}}
My campaign links from the last quarter (one per line): {{links}}
Who creates links (team, agency, tools): {{link_creators}}

Do this:
1. Parse every link. Make a table: original link, utm_source, utm_medium, utm_campaign, utm_content, problems found.
2. Flag problems: missing source, medium or campaign; mixed case (GA4 values are case sensitive); spaces or odd characters; a medium that fits no GA4 default channel (for example medium = the platform name); UTMs on links to pages within my own site; personal data in any value.
3. For each problem medium, say which GA4 channel it lands in now (often Unassigned) and which it should land in.
4. Write the rules:
   - Always utm_source, utm_medium, utm_campaign, all lowercase, underscores not spaces.
   - Allowed source values per channel.
   - Allowed medium values per channel, chosen to match GA4's default channel rules (paid traffic: a medium containing "cp", or "ppc", "retargeting" or starting with "paid"; email: "email"; affiliates: "affiliate"; organic social: "social"; partner links: "referral").
   - Campaign pattern: yyyy-mm_short_name.
   - utm_content for the creative or link position.
5. Rewrite every link to follow the rules. Show old and new side by side.
6. Give a simple link-builder sheet layout: columns, dropdown lists, the formula that joins them.

Output:
- Problem table, ranked by how much traffic each problem likely affects (if I gave traffic numbers; otherwise by how often it appears).
- The rules on one page.
- Rewritten links.
- Link-builder sheet layout.
Do not invent traffic numbers. If a channel's correct medium is unclear, ask me.
```
