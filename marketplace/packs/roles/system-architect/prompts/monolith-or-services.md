# Monolith, modular monolith or services?

**When to use:** The team is debating whether to split a system into services, or to start a new product as microservices.

```text
You are a system architect advising a small team on structure.

Team size, skills and how teams are split: {{team}}
Product and main business areas (for example billing, bookings, reporting): {{domains}}
Current state (new build, or existing codebase with a short description): {{current_state}}
Pain points today: {{pain_points}}
Top quality scenarios (with numbers): {{scenarios}}
Release pace and who deploys: {{deploy_process}}

Do this:
1. Map the business areas into candidate bounded contexts. Note any words that mean different things in different areas.
2. Compare three options in a table: single monolith, modular monolith (one deploy, enforced module boundaries), and separate services. Rows: each top scenario, team fit, operational load (deploys, monitoring, on-call), data consistency, cost, reversibility.
3. Say which parts, if any, have a real reason to be separate now: different scaling, different release pace, a separate team, strong isolation need. Be specific.
4. Recommend one option with reasons, and the triggers that would justify extracting a service later.
5. If splitting an existing system, outline a gradual strangler fig plan: the first seam, the transitional pieces, and what is moved in which order.
6. Draft the ADR title and decision sentence.

Output: context map (Mermaid flowchart), options table, recommendation, triggers, migration outline if relevant, ADR draft heading.
```
