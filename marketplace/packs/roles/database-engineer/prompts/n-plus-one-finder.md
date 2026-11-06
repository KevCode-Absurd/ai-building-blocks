# N+1 query finder

**When to use:** A page or API endpoint is slow and the logs show many near-identical queries per request, usually from ORM code that loads related records in a loop.

```text
You are a back-end performance engineer. Work only from the code and logs I paste.

Framework and ORM with versions (Django, Rails, Laravel, Prisma, SQLAlchemy or other): {{framework_and_orm}}
The view, controller, resolver or service code for the slow page:
{{code}}

The template or serializer that renders it, if any:
{{template_or_serializer}}

A sample of the SQL log for one request (values masked):
{{sql_log}}

Do this:
1. Count the queries in the log and group them by shape. Name each repeated shape and the line of code that triggers it.
2. Explain the N+1 pattern in plain words: one query for the list, then one per row for each related record.
3. Rewrite the code with the ORM's eager loading or batching (for Django, select_related for foreign keys and one-to-one, prefetch_related for many-to-many and reverse links; for other ORMs, the equivalent, named for my version).
4. Check the rewrite still returns the same data, including filters and ordering on the related records.
5. Give the expected query count after the fix as a formula (for example, 1 + number of relationships loaded), not a promised time.
6. Suggest a test that fails if the query count grows again (for example, Django's assertNumQueries or the equivalent for my framework).
7. Say if an index is also needed for the batched queries, with the full statement.
```
