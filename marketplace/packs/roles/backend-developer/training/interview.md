# Training interview: back-end developer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, private code, keys, customer data and anything under a confidentiality agreement; describe systems in general terms.

1. **Which languages, frameworks, databases and providers do you know best, and what do you turn down?**
   Why it matters: sets the agent's specialty and the limits of its advice.

2. **How do you write an endpoint contract, and who do you agree it with before coding?**
   Why it matters: captures the expert's contract-first habit and its format.

3. **Tell me about a race condition you found in production. How did you prove it and fix it?**
   Why it matters: records real techniques for collisions, not textbook ones.

4. **When do you use a row lock, a unique constraint, a conditional update or a different isolation level?**
   Why it matters: grounds the agent's choice of concurrency tool.

5. **How do you implement idempotency keys, and where do you store them?**
   Why it matters: captures practical storage, expiry and error-handling choices.

6. **Walk me through the hardest webhook bug you fixed: duplicates, missing events or wrong order.**
   Why it matters: reveals the expert's debugging order for integrations.

7. **How do you test webhooks locally and in a sandbox?**
   Why it matters: records the tools and fixtures the agent should suggest.

8. **What is your retry rule for outbound calls, and how did a retry storm bite you?**
   Why it matters: tunes the agent's backoff, limits and layering.

9. **How do you design error responses that a front-end developer can act on?**
   Why it matters: shapes the agent's error format and messages.

10. **Tell me about a migration that went wrong or nearly did. What do you always do now?**
    Why it matters: adds checks the agent runs before schema changes.

11. **How do you change a column on a large, busy table without downtime?**
    Why it matters: captures the expert's expand-and-contract routine.

12. **What does your go-live checklist look like for a payment integration?**
    Why it matters: shapes the agent's go-live and rollback steps.

13. **Which actions do you never take without a fresh yes from the client, even with full access?**
    Why it matters: sets the agent's approval boundaries at level 3.

14. **How do you keep card data and live keys out of code, tests and chat?**
    Why it matters: records safe handling the agent should insist on.

15. **What do you check first when an API suddenly returns 500s after a deploy?**
    Why it matters: captures the incident order the agent should follow.

16. **How do you decide what to log, and what do you refuse to log?**
    Why it matters: sets privacy and debugging defaults.

17. **What reconciliation jobs have saved you, and how often do they run?**
    Why it matters: grounds the agent's advice on catching missed events.

18. **Which provider docs or changelogs do you check every time, and which surprised you?**
    Why it matters: keeps the agent's sources current.

19. **How do you explain "the database decides who gets the last seat" to a non-technical owner?**
    Why it matters: captures the expert's plain-language explanations.

20. **Tell me about a client who wanted something unsafe, like refunds sent automatically. How did you handle it?**
    Why it matters: shows how the expert holds a line while still solving the problem.
