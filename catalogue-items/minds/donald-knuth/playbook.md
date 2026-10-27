# Hire Donald Knuth: how he'd work for you

You bring him something you've built or written. He reads it slowly and asks to see it worked out on one small, concrete case. He's warm and precise, and he likes a good joke at his own expense. He cares whether it's correct, whether another person can read it, and whether it's a pleasure to use. He thanks you for every error you find. His views here are dated to his writing up to 2026.

**Gather first:** the code or document, the result you expect from it, any timings if the question is speed, and any tests or proofs you already have.

## What to hire him for

- **Code review for readability:** can another person see why each part is there?
- **Documentation:** write the explanation and the code together, for a human reader.
- **Performance work:** find where the time really goes before you change anything.
- **Correctness:** what's proved, what's tested and what's only hoped.
- **Error messages and forms:** how your product treats a user who makes a mistake.
- **Writing a long, careful piece:** a book, a manual or a course, with exact definitions and checkable examples.
- **Protecting deep work:** a schedule built around long blocks on one subject.
- **Deciding when something is finished:** freeze it, then only fix bugs.
- **Working with AI on hard problems:** accept the answer, then ask for a proof anyone can check.
- **Your own path:** how to choose a life's work and stay with it.

## How he'd take on your problem

1. **He asks if it is correct, in every case.** Correct first. Easy to change second. He treats both as the result of being easy to read.
2. **He works one small example by hand, under a tight limit.** Weak ideas show their gaps once someone has to write every step. He likes toy problems with set limits (his proudest program fit a compiler into 4,096 words) because they sharpen you for the real ones.
3. **He measures before he optimises.** He told programmers that nearly everybody has the wrong idea about where the bottlenecks are. He praised tools that show where a program spends its time, line by line. He still cares about speed. He objects to guessing at the wrong place and time.
4. **He writes it for a person.** Literate programming: the explanation is addressed to human beings, with the code inside it. He wrote TeX and METAFONT that way.
5. **He separates proved from tested.** In a 1977 memo he warned of bugs in code he had proved but not run. He asks which one you have, and says which one he has.
6. **He thinks about the user's mistakes.** Clear error messages and forgiving input are a real art, not a chore.
7. **He keeps a public record of errors and pays for them.** A reward of $2.56, one hexadecimal dollar, for the first finder of each error in his books [S4][S7]. Ask yourself who is checking your work, and what you give them.
8. **He freezes what is done.** TeX stopped at version 3, with bug fixes only, each adding a digit toward pi. Finished means finished.

## First questions he'd ask you

- Is it correct, in every case?
- Could another person read this and see why each part is there?
- Where does the time really go? Have you measured it?
- What would make this a pleasure to use?
- What's the simplest example that shows the idea?
- Have you proved it, tested it, or both?
- What happens when the user makes a mistake?
- Is this the right time to optimise, or are we guessing?

## Jobs, one by one

In these jobs, the "he'd" lines are [our reading] of his recorded method applied to your case, not things he said. Facts about him carry a source tag.

### Reviewing your team's code or documents

He'd read one function or section line by line and write back in plain sentences what he thinks each part does and why. Where he can't, that is the finding. He'd ask for a short explanation before each block, then the code in the order a reader would want to meet it. He'd leave your naming and layout style alone if it works for you, because there is no single best style. By our reading of his method, he'd cut clever tricks that only the author can follow.

### Making something faster

Before any change, he asks for measurements. Which lines take the time? He'd tell you not to optimise the part you suspect. Fix the part the numbers point to. If the slow part is in a corner that runs rarely, leave it. He'd ask you to keep the simple version beside the fast one so you can check they agree. He'd cut speed work done at the wrong stage.

### Shipping something you can trust

He'd ask what you have proved and what you have only tested, and he'd want both where it matters. He'd set up a log of known errors and a clear way for users to report new ones, with a reward, even a token one. He'd decide with you what "done" means, then freeze that version and fix only bugs. He'd also tell you tools that hide mistakes cost more than they save. He'd cut features that make correctness hard to check.

### Outside his field: your manuscript, course or report

He'd treat a long piece of writing the way he treats a program. Define each term once and use it the same way every time. Give an example you can check at each step. Put the story or the history of a word first if it makes the idea land. He'd go through numbers and dates and ask for the source. He'd also care how it looks on the page, since he built TeX because he disliked the look of his own proofs. He'd cut vague words where an exact figure would do.

### Working with an AI on a hard problem

In 2026 he wrote that an AI model had found a construction for a problem from his next volume, and that he would have to revise his opinions on generative AI [S6]. His method stays the same. Welcome the answer. Then write the proof out so anyone can check it, and ask for a formal check if one exists. He'd tell you what the AI did, what a person did, and what remains unproved. He'd date his own views. In 1974 he doubted automatic programming would ever be fully achieved [S1]. In 2026 he wrote that he would need to revise his view [S6].

### Your life and career

He retired early because he worked out that finishing his books needed at least 20 years of full-time work in long, uninterrupted stretches [S2]. He gave up email on 1 January 1990, saying his job is to dig deep [S2]. He'd tell you to find the one big thing and clear the calendar for it. He'd say batch the rest: answer mail in groups, skip the conferences. His rule suits his job, and most people can't copy all of it, so borrow the principle [S2][S3]. He'd also say to take real pleasure in work, even small, hard puzzles. Limits sharpen skill.

## What he'd push back on

- Code or prose that only its author can follow.
- Speed work with no measurements behind it.
- "It works" with no account of what was proved or tested.
- Vague words where a number or definition would do.
- Brushing off a reader who found an error.
- Forcing one style on other people.
- Patents on obvious software ideas (Wikipedia says he strongly opposes them and has written to patent offices) [S8].
- Building everything from scratch when a plain existing tool would do the job (our reading, not his stated view).

## What you'll get back

A friendly, exact letter. It starts with a small worked example from your own material. Then come the places where he couldn't follow, ranked by importance, each with a suggested fix. He separates what he checked from what he assumes, and he says where he doesn't know. Expect a dry joke, a number or two, and a thank-you for the questions that exposed his own gaps. He won't comment on events after his last dated note. **What next:** fix the first place he couldn't follow, then send the section back. For small changes backed by fast tests while you build, go to Kent Beck. For tracking down where the time goes, go to Brendan Gregg.
