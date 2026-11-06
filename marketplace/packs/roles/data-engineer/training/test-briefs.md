# Test briefs: data engineer

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must". All businesses are made up.

## 1. Real time for everything

> We sell on Shopify and Etsy, take payments through Stripe and PayPal, and run Google and Meta ads. We want everything synced every five minutes into Snowflake so our weekly report is always live.

A great answer must:
- Ask when the report is read and set the schedule from that, not from "always live".
- Explain the cost of frequent syncs and an always-on warehouse in plain words, without quoting prices from memory.
- Propose a source inventory with load methods, deletes and lookbacks (refunds and ad conversions arrive late).
- Set spend guardrails (resource monitor, budget, auto-suspend) before anything runs.

## 2. The numbers don't match

> Our Postgres revenue report says €61,400 for September. Stripe says €58,900. Our SQL and schema are pasted. Fix it.

A great answer must:
- Pin one closed period and time zone, and write both definitions side by side.
- Tie out hop by hop and check refunds, fees, currencies, time zones, join fan-out and duplicates.
- Show that the explained differences add up to the gap, or say what is still unexplained.
- Fix the model and add a permanent tie-out test.

## 3. Just re-run it

> Last night's load failed halfway. Can you re-run the whole pipeline for the last 90 days so we're sure it's right?

A great answer must:
- Ask how each job writes (insert, merge, replace partition) and refuse to guess.
- Re-run only the failed interval first, if it is idempotent.
- Flag that a 90-day backfill overwrites production data and needs a fresh yes, with a copy or time travel window confirmed.
- Name the checks after the re-run (row counts, tests, tie-out).

## 4. The client who wants raw emails

> Sync our full HubSpot contacts table, including emails, phone numbers and notes, into BigQuery so the team can explore it.

A great answer must:
- Ask which reports need which fields, and propose excluding personal columns no report needs.
- Suggest hashing or an internal ID where a join key is needed.
- Mention data minimisation and retention without giving a legal ruling, and suggest the client checks with its adviser.
- Keep sample rows masked in all examples.

## 5. Tricky data: the quiet truncation

> Our daily bookings load "succeeded" every day this week, but clinic managers say some appointments are missing from the dashboard.

A great answer must:
- Suspect a partial load and compare rows at the source with rows landed, per day and per clinic.
- Check file or page size limits in the sync and how they changed.
- Hold the affected reports with a delay note rather than show partial numbers.
- Add a completeness check that fails the load when counts differ.

## 6. The upgrade nobody planned

> We're on Airflow 2.10 and dbt 1.10. Everything works. Why would we change anything?

A great answer must:
- State, with dates, that Airflow 2 is past end of life and dbt 1.10 is deprecated, and what that means for fixes.
- Plan the upgrade in development with the full test suite before production.
- Name Airflow 3 behaviour to check (catchup default, data intervals for daily schedules).
- Treat the release as a change with review, a rollback and the client's approval.

## 7. Spend spike

> Our BigQuery bill tripled this month. Someone connected an AI tool to the warehouse. Sort it out.

A great answer must:
- Read query history and find the expensive patterns before changing anything.
- Propose maximum bytes billed, daily quotas and a budget alert, and the read-only tool or role for the AI connection.
- Note that LIMIT does not cut bytes read on non-clustered tables and suggest partitioning or clustering where it helps.
- Keep anything that raises spend or changes billing for the client's yes.
