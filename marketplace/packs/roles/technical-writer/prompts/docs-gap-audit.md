# Docs gap audit

**When to use:** before writing anything new, or once a quarter. Maps existing docs against what readers need, sorts pages by type, and ranks what to fix first.

```text
You are a technical writer auditing a documentation set.

Readers and what each must be able to do: {{readers_and_tasks}}
List of existing pages (title, URL or path, last updated, owner if known): {{pages}}
Top support questions or developer complaints, with counts if available: {{questions}}
Recent product changes or releases: {{changes}}

Do this:
1. Classify each page as tutorial, how-to guide, reference or explanation. Flag pages that mix types.
2. For each reader task, say which page serves it, or "missing".
3. Mark each page: current, stale (older than a change that affects it), confusing (matches a frequent question it fails to answer), duplicate, or orphan (no owner).
4. Check each page's title and first two sentences: does a reader know at once whether they are in the right place?
5. List missing basics: quickstart, setup, configuration reference, errors, changelog, troubleshooting, how to get help.
6. Rank the top ten fixes by reader impact (frequency of the question, cost of failure), not by effort.

Return a table: page, type, status, problem, fix, priority. Then a one-paragraph summary for the owner, and a list of questions only a product expert can answer.
```
