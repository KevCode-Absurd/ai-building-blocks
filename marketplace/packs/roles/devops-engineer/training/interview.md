# Training interview: DevOps engineer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, private code, keys, account IDs, customer data and anything under a confidentiality agreement; describe systems in general terms.

1. **Which CI tools, clouds, hosting platforms and infrastructure tools do you know best, and what work do you turn down?**
   Why it matters: sets the agent's specialty and the limits of its advice.

2. **When a team says "we deploy by hand", what are the first five things you ask?**
   Why it matters: captures the expert's intake order.

3. **Walk me through the last manual deploy you turned into a pipeline. What did you automate first, and what did you leave manual on purpose?**
   Why it matters: gives the agent a realistic sequence and its limits.

4. **How do you write a Dockerfile you trust? What do you check in someone else's?**
   Why it matters: records concrete Dockerfile habits and red flags.

5. **How do you pin versions, and how do you keep pinned things up to date without breaking the build?**
   Why it matters: balances safety against drift in the agent's advice.

6. **How do you handle secrets in pipelines? Tell me about a leaked secret you dealt with.**
   Why it matters: grounds the agent's secret handling and rotation steps.

7. **What permissions do you give pipelines and people, and how do you gate production?**
   Why it matters: sets the agent's least-privilege defaults and approval habits.

8. **How do you read a Terraform plan before apply? What makes you stop?**
   Why it matters: captures the expert's review method for infrastructure changes.

9. **What does your rollback plan look like for code, for data and for DNS?**
   Why it matters: makes rollback plans concrete rather than "redeploy".

10. **Tell me about a release that went wrong. What was the first sign, and what would have caught it earlier?**
    Why it matters: records real failure signals and stop rules.

11. **How do you decide between a big-bang release, a canary, a percentage rollout and a feature toggle?**
    Why it matters: tunes the agent's release strategy choices for small teams.

12. **How do you run a database migration on a live system without losing data?**
    Why it matters: grounds backup-first and expand-then-contract habits.

13. **When a cloud bill jumps, where do you look first, second and third?**
    Why it matters: gives the agent a cost investigation order.

14. **Which savings do you recommend often, and which ones have backfired?**
    Why it matters: teaches the agent to weigh savings against outage risk.

15. **How do you set budgets and alerts so someone actually acts on them?**
    Why it matters: makes alerting advice practical, not theoretical.

16. **When did you last test a restore, and what surprised you?**
    Why it matters: records real restore-test lessons.

17. **How do you run the first hour of an incident on a small team?**
    Why it matters: captures roles and habits that fit teams without an on-call rota.

18. **How do you keep a postmortem blameless when people are upset or a manager wants a name?**
    Why it matters: teaches the agent to hold the blameless line with tact.

19. **What makes an incident action actually get done?**
    Why it matters: improves the agent's action lists and follow-up.

20. **How do you write release notes and customer updates that people trust?**
    Why it matters: shapes the agent's tone for non-technical readers.

21. **What do you ask before you accept access to a client's cloud account or pipeline?**
    Why it matters: shapes the agent's access questions, limits and budget cap.

22. **Tell me about the hardest DevOps job you have done for a small business. What would you do differently?**
    Why it matters: gives the agent a story-based sense of trade-offs and judgement.
