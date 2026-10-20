# Donald Knuth: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

Donald Knuth is alive, and views can change. Everything below comes from his own public writing, from his 1974 Turing Award lecture [S1] to a note he wrote in 2026 [S6], plus reference pages. Each view is dated to the text it comes from. His books and papers are in copyright, so this is our summary, with a few short quotes. Nothing here covers his private life, his health or his plans, and nothing tells you what he thinks about events after his last dated note.

## In one paragraph

Donald Knuth is an American computer scientist and professor emeritus at Stanford [S8]. Since the 1960s he has been writing *The Art of Computer Programming*, a multi-volume account of the central methods of programming [S7][S8]. He is often called the father of the analysis of algorithms, the study of how much time and space a method really needs [S8]. When he disliked how his books looked in print, he built his own typesetting system, TeX, and its font tool, METAFONT [S8][S9]. He also invented literate programming, where a program is written as an explanation for people, with the code woven in [S5][S8]. His 1974 lecture argued that programming is an art as well as a science, and that its chief goal is beautiful programs [S1]. In 2026 he wrote that an AI model had solved a problem he was stuck on, and that he would have to revise his views on generative AI [S6].

## Core ideas

### Programming is an art as well as a science

In his 1974 lecture Knuth traced the word "art" back to the Latin for skill [S1]. He offered a test. Science is what we understand so well that we can teach it to a computer. Whatever we don't yet understand that well is still an art [S1]. On that view, turning an art into a science means learning how to automate it, and doing so improves the art [S1].

How he applied it: he named his books *The Art of Computer Programming* and defended the title in the lecture. Programming, he said, uses knowledge, needs skill, and produces objects of beauty [S1].

### Aim for beautiful programs

Knuth said the chief goal of his work as a teacher and author was to help people write beautiful programs [S1]. He compared writing a program to composing poetry or music [S1]. He said there is no single best style, and that it is a mistake to force people into one mould [S1].

How he applied it: he described the thrill of reading Stan Poley's SOAP II assembler listing in 1958. Seeing how elegant a system program could be is what got him hooked on programming [S1].

### A good program is correct, changeable and kind to users

In the same lecture he listed what makes a program good. First, it works correctly. Second, it is easy to change later. Both come from being easy to read [S1]. A good program also treats its users gracefully when they make mistakes. Writing clear error messages and forgiving input formats is a real art [S1].

How he applied it: he asked machine and system designers for tools that are a pleasure to use, so that even routine work feels good [S1].

### Measure before you optimise

Knuth defended efficiency, but warned that programmers waste time worrying about it in the wrong places and at the wrong times [S1]. That is the setting of his famous line on premature optimisation [S1]. He said nearly everybody has the wrong idea about where their program's real bottlenecks are [S1].

How he applied it: he praised new tools that measure where a program spends its time, line by line, and predicted they would become standard practice [S1].

### Write programs for people to read

Literate programming joins a programming language with a documentation language. The program is written as an explanation addressed to human beings, and the code appears inside it [S5]. He also describes such a program as a kind of hypertext, rather like the World Wide Web [S5]. Knuth says the approach makes programs more robust, more portable and easier to maintain, and more fun to write [S5].

How he applied it: he wrote TeX and METAFONT this way, and collected his essays on the method in the 1992 book *Literate Programming* [S5]. He first built it in a system called WEB, later adapted for C as CWEB [S8].

### Small limits sharpen skill

Knuth noticed that people take more pleasure in work done with limited tools [S1]. He suggested setting artificial limits on purpose, with "toy" programs, to push your abilities. Hard small problems, tackled with full energy, sharpen you for the real ones [S1]. He also defended programs written just for fun, such as the race among Stanford students to write the shortest program that prints its own source code [S1].

How he applied it: the program he was proudest of in 1974 was a compiler he wrote for a small computer with only 4,096 words of memory. He said doing that under such tight limits made a person feel like a real virtuoso [S1].

### Pay for every error, and fix it

Knuth sends a reward to the first person who finds each error in his books: $2.56, which he calls one hexadecimal dollar [S4][S7]. He wants readers' help, but sets clear limits, such as not taking comments on commas [S7]. For TeX, bug rewards started at $2.56 and doubled each year up to $327.68 [S9]. After fraud on his bank account he stopped sending real checks, around 2008, and now credits finders at a made-up Bank of San Serriffe [S8][S9].

How he applied it: TeX was frozen at version 3, and later releases only fix bugs. Each fix adds a digit to the version number, which is creeping toward pi. His plan is that after his death it becomes exactly pi and any bugs left become features [S9].

### Protect deep work

Knuth stopped using email on 1 January 1990. He said email suits people whose job is to be on top of things, while his job is to dig deep [S2]. He answers postal mail in batches, about every six months [S2]. He retired early because he worked out that finishing his books needed at least 20 years of full-time work, done in long, uninterrupted stretches on one subject at a time [S3].

How he applied it: he stopped travelling to conferences and giving talks so he could keep working on the books [S3].

## How he decides

- Ask first whether it is correct. Then whether it is easy to change [S1].
- Measure where the time goes before you optimise [S1].
- Write the explanation and the code together, for a human reader [S5].
- Respect other people's style when it works for them [S1].
- Do one big thing at a time, in long blocks, and batch the rest [S2][S3].
- Reward people who find your mistakes, and keep a public record of errors [S4][S7].
- When something is truly finished, freeze it and only fix bugs [S9].
- Prove code correct, and still test it. In a 1977 memo he warned that code he had proved but not tested might still have bugs [S4].
- When a computer or an AI finds an answer, still ask for a proof anyone can check. He wrote out the proof that Claude's construction works, and welcomed a formal check of it in the Lean proof tool [S6].

## Where he stood

**Is programming a science or an art?** Both, as of 1974. The two sides help each other [S1].

**Will machines write programs for us?** In 1974 he doubted that automatic programming would ever be fully achieved, though he called the research very important [S1]. In 2026 he wrote that Claude Opus 4.6 had found a construction, for odd sizes, for an open problem he had worked on for several weeks, and that he would have to revise his opinions about generative AI [S6].

**Should efficiency matter?** Yes, at the right time and place. Much worry about it is wasted effort in the wrong spots [S1].

**Who is a program for?** People, first. A program should read like an explanation addressed to human beings [S5].

**Should trivial software ideas be patented?** He strongly opposes patents on obvious solutions, and has written to patent offices on the subject [S8].

## His work and record

- Born on 10 January 1938 in Milwaukee, Wisconsin [S8].
- Earned BS and MS degrees at Case Institute of Technology in 1960, and a PhD in mathematics at Caltech in 1963 [S8].
- Agreed in 1962 to write a book that became *The Art of Computer Programming*. Volume 1 appeared in 1968 and Volume 3 in 1973 [S8].
- Joined Stanford in 1969 [S8].
- Won the Turing Award in 1974, for his work on the analysis of algorithms, programming language design and his books [S1].
- Received galley proofs he disliked on 30 March 1977 and began designing TeX. TeX82 was rewritten from scratch in 1982 [S9].
- Introduced literate programming in 1984 [S8].
- Stopped using email on 1 January 1990 [S2].
- Became professor emeritus in 1993 [S8].
- Received the Kyoto Prize in 1996, among many other awards [S8].
- Published Volume 4A in 2011 and Volume 4B at the end of 2022 [S8]. Fascicle 7, on constraint satisfaction, came out in 2025 [S7].
- Wrote "Claude's Cycles" in February 2026, revised in April 2026, about an AI-assisted solution to a problem from his next volume [S6].

## Where he was wrong or criticised

- **The word count episode.** In 1986 Jon Bentley asked him to show off literate programming. Knuth wrote a long, careful program to list the most common words in a text. Doug McIlroy replied that six lines of Unix shell commands did the job, and said Knuth had shown how to program intelligibly but not wisely [S10]. Hillel Wayne argues the critique was unfair, since Knuth was asked to demonstrate a method, not to compete [S10].
- **TeX is hard to work with.** Its syntax can be changed on the fly, so almost nothing but TeX can read TeX input. Some font metric choices led to layers of workarounds, and it has had less success outside technical fields [S9].
- **Changing his mind on AI.** His 1974 doubt about automatic programming [S1] sits next to his 2026 surprise [S6]. He has said in writing that he will need to revise his view.
- **Slow pace.** The book series began in 1962 and Volume 4 is still in progress, with Volumes 5 to 7 planned [S7][S8]. Some later volumes are planned only if they are still relevant [S7].

## Blind spots to watch

- His standards suit work meant to last decades. A small team shipping next week may not need a literate, proved and frozen program.
- He builds from scratch. The McIlroy episode shows the cost when existing tools would do [S10].
- His deep-work rules assume he can turn away email, meetings and travel [S2][S3]. Most people can't. Borrow the principle, not the full rule.
- He writes for readers who enjoy mathematics. Pair him with someone who writes for beginners or for product users.
- His AI views are dated. Check the date before repeating them [S6].

## Short phrases on the record

- "premature optimization is the root of all evil" (1974 lecture) [S1]
- "help people learn how to write beautiful programs" (1974 lecture) [S1]
- "my role is to be on the bottom of things" (email page) [S2]
- "Beware of bugs in the above code" (1977 memo, cited in his FAQ) [S4]
- "addressed to human beings rather than to a computer" (Literate Programming page) [S5]
