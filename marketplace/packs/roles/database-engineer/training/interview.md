# Training interview: database engineer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, real schemas under confidentiality, credentials and customer data; describe systems in general terms.

1. **Which databases, versions, hosts and ORMs do you know best, and what work do you turn down?**
   Why it matters: sets the agent's specialty and the limits of its advice.

2. **When a client describes their business, how do you get from that to tables? Walk me through a recent one.**
   Why it matters: captures the expert's real modelling method, not a textbook one.

3. **Which business rules do you insist on putting in the database, and which do you leave to the app?**
   Why it matters: grounds the agent's choice between constraints and code.

4. **How do you decide what happens on delete for each foreign key?**
   Why it matters: records the reasoning behind cascade, restrict and soft deletes.

5. **What types and naming habits do you use, and which ones have burned you?**
   Why it matters: gives the agent practical defaults and the traps behind them.

6. **Tell me about a migration on a big, busy table. What did you do to avoid locking it?**
   Why it matters: captures engine-specific techniques for live changes.

7. **How do you plan a rename or type change that spans several releases?**
   Why it matters: records the expert's expand-and-contract routine.

8. **What does your backup set-up look like for a small business, and how do you test restores?**
   Why it matters: sets the agent's standard for backups that actually work.

9. **Tell me about a time a restore did not go as planned. What was missing?**
   Why it matters: gives the agent real gaps to check for.

10. **How do you read a query plan? Which lines do you look at first?**
    Why it matters: captures the expert's reading order for EXPLAIN output.

11. **When do you add an index, and when do you refuse to?**
    Why it matters: tunes the agent's index advice and its awareness of write costs.

12. **How do you find and fix N+1 queries in the ORMs you know?**
    Why it matters: records framework-specific fixes and tests.

13. **How do you write a report query so it does not double count?**
    Why it matters: captures grain and join habits for business questions.

14. **How do you check that a query's answer is right?**
    Why it matters: becomes the agent's tie-out routine.

15. **What access do you usually get to a client's database, and what do you never do without asking?**
    Why it matters: aligns the agent's habits with the three access levels and the fresh-yes rules.

16. **How do you handle a client who wants a change run on production right now, with no backup?**
    Why it matters: shows how the expert holds the safety line while keeping the client.

17. **What do you check every month on a database you look after?**
    Why it matters: shapes the agent's health check.

18. **How do you keep personal data out of development copies and examples?**
    Why it matters: sets the agent's privacy habits for samples and fixtures.

19. **Tell me about the hardest database job you have done. What went wrong and what did you learn?**
    Why it matters: gives the agent a real story of judgement under pressure.

20. **What do people new to databases get wrong most often?**
    Why it matters: tunes the agent's reviews to the mistakes clients really make.
