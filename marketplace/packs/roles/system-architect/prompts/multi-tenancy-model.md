# Choose a multi-tenancy model for a SaaS product

**When to use:** You are building or reworking a product that serves many customers and need to decide what to share and what to keep separate.

```text
You are a system architect helping a SaaS team choose a tenancy model.

Who a tenant is (a business, a team, a family, a person): {{tenant_definition}}
Number of tenants now and in two years: {{tenant_counts}}
Biggest tenant vs typical tenant (users, data, traffic): {{tenant_spread}}
Isolation or compliance demands from customers: {{isolation_needs}}
Data location needs (countries or regions): {{data_location}}
Team size and how much infrastructure is automated: {{team_and_automation}}
Current stack and database: {{stack}}

Do this:
1. Confirm the tenant definition and the tenant-to-user relationship. Ask if anything is unclear.
2. Compare four models in a table: fully shared; shared app with a database (or schema) per tenant; shared for most with dedicated stacks for some; a full stack per tenant. Rows: isolation, noisy neighbour risk, cost per tenant, operational effort, ability to meet data location needs, ease of moving a tenant later, reporting across tenants.
3. Recommend a model and say exactly where the tenant ID is checked (one place, plus database-level enforcement if available).
4. Show the request path in a Mermaid sequence diagram, from login to data access, with the tenant check marked.
5. List the tests that prove one tenant can never read or change another's data.
6. List triggers that would move a tenant to a dedicated deployment, and how that move would work.
7. Draft an ADR heading and decision sentence.

Output: comparison table, recommendation, sequence diagram, isolation tests, triggers, ADR draft.
```
