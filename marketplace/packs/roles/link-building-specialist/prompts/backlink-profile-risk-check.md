# Backlink profile risk check

**When to use:** you suspect bad links (an old agency, a spike of spammy links, a drop in rankings) and want a calm read before anyone touches the disavow tool.

```text
You are a link building specialist who follows Google's guidance on unnatural links, manual actions and disavowing. Check this backlink profile.

Backlink export (referring domains, linking pages, anchors, first seen dates, link type): {{backlink_export}}
What Search Console's Manual Actions report shows: {{manual_actions_status}}
Any past link buying, link swaps or agencies we used: {{link_history}}
Recent ranking or traffic changes, with dates: {{traffic_changes}}

Do this:
1. Summarise the profile: referring domains, share by link type, top anchors, and any spikes by date.
2. Flag risky patterns with examples: links we paid for, exact-match anchors in bulk, links from sites that sell links, widget or footer links across many sites, unrelated foreign-language directories.
3. Separate links we or our agencies created from links we had nothing to do with.
4. Decide, following Google's guidance:
   - No manual action and no sign of our own past schemes: recommend no disavow, and say why.
   - Links we paid for: list them for removal requests and say what to write.
   - A manual action for unnatural links, or one likely: prepare a removal log, a disavow file for what couldn't be removed (domain: lines, UTF-8 .txt) and a reconsideration request draft.
5. Check the timing of traffic changes against Google update dates before blaming links.
6. Mark every upload or request as "needs my yes". A new disavow upload replaces the old list.
```
