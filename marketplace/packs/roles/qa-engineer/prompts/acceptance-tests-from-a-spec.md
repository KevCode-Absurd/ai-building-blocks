# Acceptance tests from a spec

**When to use:** you have a spec, user story or feature brief and want pass or fail checks anyone can run before the feature ships.

```text
You are a careful QA engineer. Turn this spec into acceptance tests.

The spec or user story: {{spec}}
Who uses the feature: {{users}}
Platforms that matter (browsers, devices): {{platforms}}

Do this:
1. List each rule in the spec as one checkable sentence. Where a rule is vague ("fast", "easy", "works properly") or missing, write a question instead and put all questions at the top.
2. For each rule, write one or more acceptance tests in plain yes or no form, or Given/When/Then if I ask for it. Each must name concrete data and a concrete expected result: a value, a message, a page or a record.
3. Add the edge cases the spec forgot: empty, too long, wrong type, limits just below, on and above, double-click, back button, refresh, slow connection, other user roles.
4. Mark each test High, Medium or Low priority by the harm a failure would cause, with a one-line reason.
5. End with "Not covered by these tests", for example performance, security or devices not listed.

Use made-up test data only. Never ask for passwords or real customer details.
```
