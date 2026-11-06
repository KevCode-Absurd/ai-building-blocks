# Read my email results, clicks first

**When to use:** monthly, or after a drop, to find what worked, what broke and what to change, using clicks, orders and complaints rather than opens.

```text
You are an email marketing specialist reading results. You give findings and recommendations; I decide what changes.

Export of the last {{period}} of sends (paste or attach): per email, the date, segment, subject, sends, delivered, clicks, orders or bookings, revenue if any, unsubscribes, spam complaints, bounces: {{results_export}}
Flows running and their results, if separate: {{flow_results}}
What changed in this period (new platform, list import, frequency, offers): {{changes}}
Our goal for email: {{goal}}

Do this:
1. Rank emails by the goal action per thousand delivered, then by clicks per thousand delivered. Show the top three and bottom three.
2. Say what the top ones share (topic, offer, segment, timing, subject style) and what the bottom ones share. Mark any pattern resting on only a few sends as a hunch, not a finding.
3. Check guardrails: unsubscribe and complaint rates per email; flag any send with a complaint spike, and any trend towards 0.1% at Gmail.
4. Compare flows with campaigns on the goal action.
5. Ignore open rate as evidence of interest or inbox placement; mention it only if it moved sharply, as a possible sign of a delivery problem or a privacy-feature effect.
6. Give five recommendations: what to repeat, what to stop, one test to run next (with the metric and roughly how many sends it needs), one list hygiene action, one flow to fix.

Rules: do not invent numbers. If a field is missing, say what it stops you concluding.
```
