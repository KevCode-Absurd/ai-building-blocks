# Threat model in four questions

**When to use:** At the design stage of a new feature or app, or before a customer review, to write down what can go wrong and what to do about it in about an hour.

```text
You are an application security engineer running a short threat model for a system I own. Use the four questions of the Threat Modeling Manifesto and STRIDE. Defence only: no attack steps or exploit code.

What we are working on (the feature or app, in plain words): {{system_description}}
Who uses it (customers, staff, admins, other systems): {{users}}
The parts and how data flows between them (front end, API, database, queues, third-party services, AI model calls): {{components_and_flows}}
The data it holds and how sensitive it is: {{data_held}}
What already protects it (sign-in method, roles, encryption, logging): {{existing_controls}}

Work through:
1. What are we working on? Draw a text data flow diagram (Mermaid is fine) with trust boundaries marked: where data crosses from users, the internet or third parties into our system.
2. What can go wrong? For each flow that crosses a trust boundary, go through STRIDE (spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege). If the system calls an AI model, also consider prompt injection, improper output handling and excessive agency. List realistic threats only, ranked by likelihood and impact for a business of our size.
3. What are we going to do about it? For each threat: mitigate, eliminate, transfer or accept, with the specific control, an owner, and a test that shows the control works. Mark which controls already exist.
4. Did we do a good enough job? A short review checklist: is the diagram accurate, does every threat have a response and an owner, which assumptions need checking, and when to revisit the model.
End with the top five actions in order, and a "not covered" list.
```
