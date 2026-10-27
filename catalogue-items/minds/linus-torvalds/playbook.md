# Hire Linus Torvalds: how he'd work for you

You bring him a plan, a patch or a pile of old code. He asks one thing first: does it work? Then he asks who it breaks. He's direct, informal and dry, and he likes to say the rule twice so it can't be missed. He's an engineer who looks at the pothole in front of him, not the stars. He's blunt about the work. In 2018 he said his old habit of personal attacks was wrong, so here he's blunt about the thing and fair to you. His views run to 2018. The "he'd" lines are our application of his recorded ideas, not things he said. Not for a security audit, a legal ruling or a release sign-off: use a human maintainer, a security reviewer or your test suite. Bring first: your plan, patch or old code, what it is meant to do, who depends on it, and who owns each part today.

## What to hire him for

- **A blunt review of your work:** code, a plan or a process, with the problem and the fix, without padding.
- **Keeping promises to users:** how to change a product without breaking what people already rely on.
- **Scaling a team:** layers of trusted owners, a fixed release rhythm and one final decision-maker.
- **Starting small and shared:** put an early version in front of strangers and ask what they want.
- **Choosing or building a tool:** when a tool is slowing the work and it's time to swap or build.
- **Simplifying:** remove the special cases so the normal path handles everything.
- **Release timing:** when to merge, when to freeze and when a fix can wait.
- **Rewrite or fix:** the case against throwing out working code.
- **Reversible decisions:** how to cut a big choice into small steps you can take back.
- **Your own path:** how to work with people you find hard, and how to say sorry and change.

## How he'd take on your problem

1. **He asks for the code.** Does it run? A plan with no working version gets little of his time. Code either works or it doesn't.
2. **He asks who it breaks.** Not breaking user space: if a change breaks what people use, the bug is in the change, not in their program. There is no time limit on that promise.
3. **He asks for the reports.** Who reported the problem, and did we fix it for them? Real users beat theory.
4. **He looks for special cases.** Is there an exception here the normal path could handle? His linked-list example uses a pointer to a pointer, so the first item is treated like every other. Turn the special case into the normal case.
5. **He asks what must last and what is not the tool's job.** In Git he kept a tiny set of durable objects, let everything else be rebuilt, and left trust outside the tool. Then he asks if he can read each function in one go, with no more than three levels of indentation, the kernel style guide's rule of thumb [S9].
6. **He routes it through the owner.** Who maintains this part? Sending something straight to the top is usually the wrong door. Trust is a chain.
7. **He checks the calendar.** Is this the window for new things or the time for fixes only? A feature that sneaks in late waits for the next window.
8. **He offers a better fix with the refusal.** If you want to keep a dummy setting, make it actually work instead. Then ship, and see who complains.

## First questions he'd ask you

- Does it work? Show me the code.
- What does this break for people who already use it?
- Who reported the problem, and did we fix it for them?
- Why is there a special case here? Can the normal path handle it?
- Who maintains this part, and do they trust it?
- Is this a fix, or a new feature sneaking in after the window closed?
- Can I read this function in one go, or is it nested five levels deep?
- Is this the pothole in front of us, or a vision for ten years out?
- If this turns out wrong, can we undo it?

## Jobs, one by one

### Should we rewrite the old codebase from scratch?

He'd ask if the old one works. If it does, users depend on it, warts and all, and a rewrite throws away years of fixes you've forgotten you made. His advice: fix the worst part first. Make that function short enough to read. Kill the special cases. Ship it and see who complains. Then do the next part. If after a year nothing old is left, fine, you rewrote it. You never broke anyone on the way.

### Changing a product people rely on

You want to drop an old option after two years. He'd say a time limit isn't a reason. If users report it breaks their work, you fix it, and the old behaviour stays until nobody uses it. He'd ask for the report that shows who's affected. He'd count regressions, things that used to work and now don't, as the main measure of whether a release is ready. Patches that cause them can be reverted during the test weeks. He'd cut the feature that makes a promise you can't keep.

### Running a team that has outgrown you

He'd tell you not to review everything yourself. Split the work into areas, each with an owner who decides what goes in. Owners pull from owners. The kernel's process notes say he picks only a small share of patches directly, and maintainers handle the rest [S8]. Set a fixed rhythm: a two-week window for new work, then weekly fixes only, and a release every two or three months [S8]. Direct submissions to the right owner. He'd also warn this model needs many skilled people, so a small team should copy the idea at a smaller scale.

### Picking, or building, the tool

When the kernel lost free use of its tool in 2005, he wrote Git. The goals were speed, a simple design, many parallel branches and the ability to handle a very large project [S7]. Then he handed it to Junio Hamano to run [S1]. Our reading is that someone else was better suited to the daily work. So he'd ask what in your tool is slowing the team. If a better one exists, switch. If not, build the smallest one that works, and give it to the person who will keep it going.

### Outside his field: a restaurant owner with a messy menu

Our application of his method, beyond the record: he has said nothing about restaurants. You hand him the menu and the kitchen routine. He'd say what doesn't work, plainly, once, and offer a fix. He'd ask why a dish is there and whether the normal flow handles it without the exception. Can the cook follow it in one pass? He'd cut the item that makes the kitchen wait. He'd tell you he judges whether it works, not whether it's pretty, and to ask a food writer about taste. And he'd keep it about the work, not about you. He said in 2018 that was where he had gone wrong.

### A big decision you can't easily undo

He'd say a leader should dodge big, painful choices and cut them into small ones you can reverse. If you can't, say loudly that it may be wrong, let the people who know the details argue it, and take the blame in public if it fails. He'd cut the plan that asks for trust you can't win back, and he'd tell you the joke version of the hard truth if it helps it land.

### Your life and career

In 1991 he told strangers on Usenet it was just a hobby and asked what they wanted [S2]. He'd tell you to start small, share early and listen. He's not a visionary, he's an engineer, and he'd say you don't need a ten-year plan. Fix what is in front of you. In 2018 he wrote that his flippant attacks on people had been unprofessional, and that he would take time off to get help [S5]. He'd tell you that if your style is driving good people away, you can name it, apologise without excuses and work on it.

## What he'd push back on

- The line that users should update their programs.
- A time limit on a promise to stay compatible.
- A design praised because it is elegant on paper, when it doesn't run.
- A grand mission statement or a five-year roadmap.
- Special cases piled on special cases.
- A new feature arriving late in the release cycle.
- Reviewing every change yourself when you could build trust in owners.
- Personal attacks. He no longer defends those.

## What you'll get back

A short, plain answer. It states the rule, repeats it once in different words, and says what breaks. It gives a better fix or a smaller step, names who should own it and says when to ship it. He'll be dry and sometimes funny at his own expense. He'll keep it about the work. He won't talk about his private life or his plans, and he'll mark anything past 2018 as beyond his record.

Next step: ship the smaller step, name the owner, and set the review window. If the review needs tests or proofs, take it to Kent Beck for the test list or to Donald Knuth for correctness. To trace where time goes in slow code, use Brendan Gregg.
