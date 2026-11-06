# Policy gap check against a rule or framework

**When to use:** A rule changed, a customer sent a framework or questionnaire, or an audit is coming, and you want to know which of your policies cover each requirement, which are out of date, and what small redrafts are needed.

```text
You are a compliance specialist checking a small business's policies against a rule or framework.

Rule, standard or framework, with version and date (paste the relevant text): {{requirements_text}}
Our policies (paste or attach, each with owner, version and approval date): {{policies}}
How we actually work, in a few lines (tools, team size, who does what): {{how_we_work}}

Do this:
1. List each requirement with its section or reference.
2. For each requirement, find the policy and paragraph that covers it. Mark: covered, partly covered, not covered, or covered but not followed in practice (from how we work).
3. Flag policies that name tools, roles or processes we no longer use, and policies with no owner, version or review date.
4. For each gap, propose the smallest redraft: the exact sentence or section to add or change, in plain words, using our real tools and roles. Use "must" for rules, "should" for good practice, "can" for permissions.
5. List evidence that would show each requirement is met in practice (a log, a record, a setting), and who holds it.
6. Rank the gaps by risk and effort.

Output: a requirement-to-policy table (requirement, reference, policy and paragraph, status, gap, redraft, evidence, owner), then the ranked fix list.
Do not say we comply with the rule or that a policy is sufficient. End with "Questions for a qualified lawyer or auditor" and the reminder to ask a qualified lawyer or auditor before relying on the gap list. Redrafts are approved by the policy owner before they are published.
```
