# Training interview: AI engineer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, private prompts, customer data and anything under a confidentiality agreement; describe systems in general terms.

1. **Which kinds of AI features have you shipped, and which do you turn down?**
   Why it matters: sets the agent's specialty and the limits of what it will build.

2. **Tell me about a time you told a client they did not need AI. What did you suggest instead?**
   Why it matters: captures the expert's "does this need AI?" judgement.

3. **How do you build a test set when the client sends only three examples?**
   Why it matters: records how the expert fills gaps without inventing the client's standards.

4. **What makes a good pass rule, and when do you accept a model grader instead of code?**
   Why it matters: grounds the agent's eval design in practice.

5. **Walk me through the worst prompt you inherited and how you fixed it.**
   Why it matters: reveals the expert's real tuning sequence.

6. **How do you decide between putting documents in the prompt and building retrieval?**
   Why it matters: sets the agent's default for document assistants.

7. **When retrieval answers are wrong, how do you find out whether retrieval or the answer step failed?**
   Why it matters: captures the debugging order for document features.

8. **Which structured output problems have bitten you: refusals, cut-off output, values that were valid JSON but wrong?**
   Why it matters: tunes the agent's validation and fallback code.

9. **How do you set spending limits for a client, and what happened the first time a cost spiked?**
   Why it matters: records practical cost controls and alerts.

10. **What is your rule for which actions a model may take without a person?**
    Why it matters: sets the agent's approval boundaries.

11. **Tell me about a prompt injection you found or tested. How did you fix the design, not just the prompt?**
    Why it matters: captures real defences beyond "ignore instructions" lines.

12. **How do you handle a model retirement or an automatic switch to a newer model?**
    Why it matters: records the expert's change routine for vendor updates.

13. **What do you log, and what do you refuse to log?**
    Why it matters: sets the agent's privacy defaults.

14. **How do you choose a model for a task, and when do you move to a smaller one?**
    Why it matters: grounds model choice in cost and test results rather than brand.

15. **What does your handover look like when the client's team will maintain the feature?**
    Why it matters: shapes the agent's launch notes and documentation.

16. **How do you explain a pass rate to a non-technical owner who wants "100% accurate"?**
    Why it matters: captures the expert's honest framing of AI quality.

17. **Which vendor docs or tools do you check every time, and which do you no longer trust?**
    Why it matters: keeps the agent's sources current and grounded.

18. **What data rules have changed how you built something for a client in the EU or UK?**
    Why it matters: records regional considerations the agent should raise early.

19. **What is the most common mistake you see in AI code written by other developers or by AI tools?**
    Why it matters: adds checks the agent should run on any existing AI code.

20. **Tell me about a launch you stopped or delayed. What was the blocker and how did the client react?**
    Why it matters: shows how the expert holds a quality bar under pressure.
