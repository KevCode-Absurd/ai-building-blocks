# Training interview: prompt engineer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, real customer data, API keys and anything under a confidentiality agreement; describe prompts and documents in general terms.

1. **What kinds of prompts do you write most: extraction, assistants, classification, images, video?**
   Why it matters: sets the agent's specialty and the limits of its advice.

2. **Walk me through the last prompt you took from first brief to daily use.**
   Why it matters: reveals the real sequence of work and where time goes.

3. **How do you turn "make it better" into a target you can measure?**
   Why it matters: captures how the expert sets pass criteria before writing.

4. **How do you build a test set when the client only sends three examples?**
   Why it matters: gives the agent practical ways to find hard cases.

5. **Tell me about a prompt that passed your tests and still failed in real use. What did the tests miss?**
   Why it matters: turns a real gap into a test the agent always adds.

6. **How do you choose examples for inside the prompt, and how many?**
   Why it matters: records the expert's judgement on variety, order and number.

7. **When do you use structured output, and how do you handle fields the document does not state?**
   Why it matters: captures the null-not-guess habit and its edge cases.

8. **What checks do you run in code after extraction, and which errors do they catch?**
   Why it matters: shows how the expert stops "valid but wrong" data.

9. **How do you write a rubric for a model grader, and how do you know the grader is right?**
   Why it matters: sets the agent's standard for judgement-based scoring.

10. **How do you decide which part of a prompt to change after a failed run?**
    Why it matters: captures the one-change-at-a-time discipline and its shortcuts.

11. **What changed in your prompts when you moved to a newer model?**
    Why it matters: records migration lessons the vendors' docs leave out.

12. **How do you design a prompt that reads customer emails or web pages so it can't be hijacked?**
    Why it matters: grounds the agent's injection defences in practice.

13. **Tell me about an injection or jailbreak attempt you saw. What stopped it, or what would have?**
    Why it matters: gives the agent a real attack pattern and response.

14. **What do you refuse to put in a system prompt?**
    Why it matters: sets the agent's line on secrets and internal rules.

15. **How do you keep a product looking right across a set of AI images?**
    Why it matters: captures the expert's consistency method: references, style blocks, checks.

16. **Which faults do image tools make most with your clients' products, and what fix prompts work?**
    Why it matters: builds the agent's library of fix prompts.

17. **How do you handle text that must appear in an image or video?**
    Why it matters: records workarounds for a known weak spot.

18. **How do you plan a short AI video when tools and limits change month to month?**
    Why it matters: teaches the agent to check the tool before fixing shot timings.

19. **When has a client asked for an image or prompt you refused or changed, and why?**
    Why it matters: sets the agent's boundaries on misleading images, real people and other brands.

20. **How do you store and version prompts so a client can maintain them without you?**
    Why it matters: shapes the agent's handover format.

21. **How do you estimate the cost of running a prompt, and when has cost changed your design?**
    Why it matters: links prompt choices to model choice and budget.
