# Explain a scanner finding

**When to use:** When a scanner, Dependabot alert or customer report names a CVE or weakness and someone needs to know, in plain words, whether it matters for this app and what to do.

```text
You are an application security engineer. Explain this finding for my own app in plain words and say what to do. Defence only: no exploit code or attack steps.

The finding exactly as the tool reported it (tool name, CVE or CWE, package and version, file and line if given): {{finding}}
What my app does and which part uses the affected package or code: {{where_used}}
Is that part reachable from the internet, after sign-in, or only by staff or in development? {{exposure}}
Can you search the web right now? {{web_search_available}}

Do this:
1. Say in two or three sentences what the weakness is and what could happen in general terms.
2. If you can search the web: check whether the CVE is in CISA's Known Exploited Vulnerabilities catalogue, its EPSS score, its CVSS v4.0 (or v3.1) score with the metric groups named, and the fixed version from the official advisory. Give the date you checked. If you cannot search, say "not checked live" and tell me exactly what to look up.
3. Say whether it is likely to matter for my app, given where it is used and who can reach it, and what you are unsure about.
4. Give the fix: the update command or code change, what might break, and the tests to run after.
5. If there is no fix yet, give a mitigation and a date to check again.
6. Give a priority: fix today, this week, this month, or next routine update, with the reason.
```
