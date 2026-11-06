# Training interview: embedded systems developer

The coach asks these one at a time, follows up on short answers and asks for a real example each time. Remind the expert to leave out client names, private code, keys and anything under a confidentiality agreement; describe devices in general terms.

1. **Which boards, chips and frameworks do you know best, and which do you turn down?**
   Why it matters: sets the agent's specialty and the limits of its advice.

2. **Walk me through how you start a new gadget, from the first message to the first working test.**
   Why it matters: captures the expert's real order of work, which the agent should copy.

3. **What goes in your pin table, and how do you check it against the code?**
   Why it matters: the pin table is the deliverable most errors trace back to.

4. **Tell me about a time a 5 V part met a 3.3 V board. What happened, and what do you do now?**
   Why it matters: records the voltage-level checks the expert never skips.

5. **How do you decide between Arduino, ESP-IDF, Zephyr, FreeRTOS on another chip, or a Raspberry Pi?**
   Why it matters: grounds platform advice in trade-offs the expert has lived with.

6. **How do you keep a program responsive while it reads sensors, logs and talks to the network?**
   Why it matters: shows the expert's patterns for timers, tasks and queues.

7. **What is the hardest reset or freeze you have tracked down? How did you find it?**
   Why it matters: reveals the real diagnosis sequence for hardware-plus-software faults.

8. **When a device resets at random, what do you check first, and what do you leave until later?**
   Why it matters: tunes the agent's ranking of causes.

9. **How do you size stacks and heaps, and what do you log to tune them?**
   Why it matters: captures RTOS habits the agent should pass on.

10. **How do you pin library, core and SDK versions so a build works next year?**
    Why it matters: sets the agent's standard for reproducible builds.

11. **What mistakes do you see most in AI-written firmware?**
    Why it matters: tunes the agent's checks for invented functions and unsafe patterns.

12. **How do you design over-the-air updates so a bad release does not brick devices?**
    Why it matters: records rollback, self-test and rollout rules from experience.

13. **Tell me about an update that went wrong in the field. What did you change afterwards?**
    Why it matters: surfaces the stop triggers and checks the expert now insists on.

14. **When do you turn on secure boot and flash encryption, and how do you rehearse it?**
    Why it matters: these steps are permanent, so the agent needs the expert's caution.

15. **How do you explain UK, EU and US security and marking rules to a small client without giving legal advice?**
    Why it matters: sets the line between preparing facts and making rulings.

16. **What do you hand to a test lab before a radio or EMC test, and what do they usually ask for?**
    Why it matters: makes the agent's lab handover complete.

17. **How do you keep Wi-Fi passwords and keys out of code, repos and chat?**
    Why it matters: protects clients and matches the kit's safety rules.

18. **What does your Raspberry Pi "start on boot" setup look like, and how do you check it is healthy?**
    Why it matters: captures service, logging and SD card habits.

19. **How do you write a wiring guide for a beginner customer? Show me one you are proud of.**
    Why it matters: sets the tone and layout of the agent's guides.

20. **Which jobs do you refuse, and how do you say no?**
    Why it matters: records limits such as mains wiring, safety systems and tracking people.

21. **What does "done" mean to you on a gadget job? What do you check before you hand it over?**
    Why it matters: becomes the agent's personal quality bar.
