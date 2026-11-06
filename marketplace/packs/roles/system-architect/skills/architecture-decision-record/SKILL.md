---
name: architecture-decision-record
description: Writes an architecture decision record (ADR) in Michael Nygard's format, with context, the options considered in a trade-off table, the decision, status and consequences, numbered for the repository and linked to the decision it replaces. Use it whenever a team makes or revisits a hard-to-reverse technical choice (database, cloud, tenancy, framework, API style, build or buy), or when nobody can remember why something was decided.
---

# Architecture decision record

## When to use

- A choice is hard or costly to reverse: data store, cloud provider, tenancy model, public API style, authentication approach, build or buy, monolith or services.
- A decision is being argued for the second time.
- A new engineer asks "why do we do it this way?" and nobody knows.
- An old decision no longer fits and needs to be replaced on the record.

Skip it for choices that are cheap to change (a library you can swap in a day, a naming convention). Too many ADRs bury the important ones.

## What you need

1. The question being decided, in one sentence.
2. The forces: requirements, quality goals, constraints (team, budget, deadline, compliance), and anything political or organisational.
3. The options on the table, including "do nothing" or "keep what we have".
4. Facts for each option: cost, effort, risks, team experience. Mark guesses as guesses.
5. The existing ADR folder and numbering, if any, and any decision this one replaces.

**Access:** level 1 to read the existing ADR folder; level 2 to open a pull request with the new record; level 3 to merge it after the named deciders accept it, within your limits.

## Steps

### 1. Frame the decision

Write the title as a short noun phrase with the number: "ADR-007: Use PostgreSQL row-level security for tenant isolation". Write the question it answers underneath in one sentence.

### 2. Write the context neutrally

Describe the forces as facts, without arguing for an option yet. Include the conflicts honestly: "We need tenant isolation strong enough for healthcare clients, but we have one database and two engineers." Name the quality scenarios this affects.

### 3. Compare the options

Use a table with options as columns and the forces as rows. Always include a reversibility row and an effort row. Keep each cell short and give a reason.

### 4. State the decision

One or two full sentences in active voice: "We will..." Then the main reason. Avoid "we might" or "consider".

### 5. List the consequences

All of them: good, bad and neutral. What becomes easier, what becomes harder, what new work it creates (migrations, monitoring, training), and what would make the team revisit it (a trigger, such as "a client requires a dedicated database" or "query time passes 500 ms at p95").

### 6. Set the status

One of: proposed, accepted, deprecated, superseded by ADR-NNN. If this decision replaces an older one, update the old record's status to "superseded by" this one; never delete the old record.

### 7. File it

Save as `docs/adr/NNNN-short-title.md` (or the team's existing path), with the next unused number. Numbers are never reused. Link it from the design doc. At level 2, file it as a pull request (level 2); at level 3, merge it once the deciders accept it (level 3). At level 1, hand the file to the team.

## Checks before handing over

- The title names the decision, not the problem.
- The context would make sense to someone who joins in a year.
- At least two real options were compared, including keeping the status quo.
- The decision is a clear "we will" sentence.
- Consequences include at least one downside and one revisit trigger.
- It fits on one or two pages.
- Status is set, and any superseded record is updated.
- No secrets, keys, customer names or personal data are in the record.

## Output format

```markdown
# ADR-NNNN: [Decision as a short noun phrase]

Status: proposed | accepted | deprecated | superseded by ADR-NNNN
Date: YYYY-MM-DD
Deciders: [names or roles]

## Context
[Forces, constraints and quality goals, written neutrally.]

## Options considered
| | Option A | Option B | Option C |
|---|---|---|---|
| [Force 1] | | | |
| [Force 2] | | | |
| Effort | | | |
| Reversibility | | | |

## Decision
We will [decision], because [main reason].

## Consequences
- Easier: ...
- Harder: ...
- New work: ...
- Revisit if: ...
```

## Example of good output (short)

> # ADR-007: Use one shared database with row-level security for tenant isolation
>
> Status: accepted. Date: 2026-11-06. Deciders: CTO, lead engineer.
>
> **Context.** We serve 40 small clinics and expect 300 within two years. Clinics must never see each other's records. We have two engineers and one PostgreSQL database. Two prospects asked about data isolation in their security questionnaires; none has asked for a dedicated database.
>
> | | Shared DB, tenant column in code | Shared DB with row-level security | Database per clinic |
> |---|---|---|---|
> | Isolation | Depends on every query being right | Enforced by the database too | Strongest |
> | Cost at 300 clinics | Lowest | Lowest | Highest, 300 databases |
> | Effort | Low now, risky later | Medium: policies and tests | High: automation needed |
> | Reversibility | Easy | Medium | Hard to merge back |
>
> **Decision.** We will keep one shared database and enforce tenant isolation with row-level security policies plus a tenant check in the app, because it gives database-level protection at low cost for our size.
>
> **Consequences.** Every table with clinic data needs a policy and a test that proves one clinic cannot read another's rows. Some reporting queries get slower and need indexes on the tenant column. Revisit if a client contractually requires a dedicated database or if tenant count passes 2,000.
