# Training interview: data engineer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, credentials and any personal data; describe systems in general terms.

1. **What kinds of firms and source tools do you know best: shops, SaaS, clinics, agencies; Shopify, Stripe, HubSpot, ad platforms?**
   Why it matters: sets the agent's specialty and where its advice stops.

2. **When a client says "put all our data in one place", what do you ask before choosing any tool?**
   Why it matters: captures how the expert turns a vague request into reports, sources and promises.

3. **How do you choose between Fivetran, Airbyte and a script for a source?**
   Why it matters: grounds tool choices in practice, cost and connector quality.

4. **How do you decide between full refresh and incremental loads, and how do you handle deletes and late changes?**
   Why it matters: these choices cause most duplicate and missing-row bugs.

5. **Which warehouse do you recommend to a small firm, and when would you say Postgres is enough?**
   Why it matters: records the expert's real decision rule, not a vendor's.

6. **Walk me through how you lay out a dbt project, layer by layer.**
   Why it matters: gives the agent the expert's naming and layering habits.

7. **Which tests do you write on every model, and which only on some?**
   Why it matters: becomes the agent's default test table.

8. **Tell me about the hardest "numbers don't match" ticket you have closed. What was the cause?**
   Why it matters: real causes teach the tie-out order better than lists.

9. **How do you make sure a load can run twice without doubling data?**
   Why it matters: idempotency is the base of every safe re-run.

10. **What is in your run book for a failed or late load? Who gets told, and when?**
    Why it matters: captures the expert's incident habits and tone.

11. **Which alerts have you switched off because nobody acted on them, and what replaced them?**
    Why it matters: shows how the expert keeps alerts useful.

12. **When do you stop reports from updating instead of showing partial numbers?**
    Why it matters: sets the agent's "stale is better than wrong" line.

13. **How do you keep warehouse spend under control for a small client?**
    Why it matters: gives the agent concrete caps and habits.

14. **What would make you refuse to run a backfill or full refresh until someone signs off?**
    Why it matters: sets the expert's own limits on overwriting data.

15. **How do you keep personal data out of the warehouse, and what do you do with an erasure request?**
    Why it matters: pulls out practical privacy habits without legal rulings.

16. **How do you handle version upgrades, such as dbt v1 to v2 or Airflow 2 to 3?**
    Why it matters: records the expert's upgrade checks.

17. **Have you used data contracts with a team that produces data? What went in the contract?**
    Why it matters: grounds contracts in real agreements, not theory.

18. **What do you check before you hand a pipeline over to a client's team?**
    Why it matters: becomes the agent's personal quality bar.

19. **Tell me about a time a client wanted something that would cost too much or break later. How did you say no?**
    Why it matters: captures pushback and the way trade-offs are explained.

20. **What would you never do in a client's warehouse, even with full access?**
    Why it matters: sets the expert's own rules on top of the access levels.
