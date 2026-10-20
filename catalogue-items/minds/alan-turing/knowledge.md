# Alan Turing: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

A note on method: Turing's views come here from two of his own papers, the 1936 paper on computable numbers [S2] and the 1950 paper on thinking machines [S1], plus reference pages. Most of his war work stayed secret for decades [S3], so much of what people "know" about it is retold. Two points are disputed and are marked that way below: how he died, and how much Bletchley Park shortened the war. Some popular stories are myths, and we flag those too. The few quotes are short and sourced.

## In one paragraph

Alan Turing was an English mathematician who worked out, in 1936, what it means for a task to be done by a mechanical method [S2]. He imagined a simple machine that reads and writes symbols on a tape, and showed that one such machine could do the work of any other if you gave it the right instructions [S2][S5]. During the Second World War he led the attack on German naval Enigma at Bletchley Park and designed the bombe, a machine that sped up codebreaking [S3]. After the war he designed one of the first stored-program computers [S3][S4]. In 1950 he asked whether machines can think, and swapped that vague question for a test anyone could run [S1]. He was prosecuted in 1952 for a relationship with a man and died in 1954, aged 41 [S3].

## Core ideas

### Break a process into the smallest steps

Turing started from a person doing a sum with pencil and paper. He noted that the person can only look at a few symbols at a time and can only be in a limited number of states of mind, because human memory is limited [S2]. Each step is very simple: change one symbol, or move to a nearby square [S2]. If you strip a method down this far, a machine can follow it [S5]. This is what he meant by "computable": numbers whose digits can be worked out by such finite means [S2].

How he applied it: his definition came from studying how a human calculator works, not from any existing machine. That is one reason it has lasted [S5].

### One machine can do every job

In the same paper Turing described a single "universal" machine. Give it a coded description of any other machine, and it will do what that machine does [S2]. The idea is that instructions are just more data. Hodges notes that Turing saw this as the principle behind the stored-program computer [S4].

How he applied it: in 1946 he presented a detailed design for a stored-program computer, the Automatic Computing Engine, at the National Physical Laboratory [S3]. He argued that much of the work could be done by programs rather than extra hardware, and he saw early how much would depend on writing instruction tables [S4][S5].

### Some questions have no mechanical answer

Turing used his machines to answer a famous question from the mathematician David Hilbert. Is there a general method that decides whether any statement in logic can be proved? Turing showed there is not [S2][S5]. He did it by showing that no machine can always tell in advance whether another machine will ever print a certain symbol [S2]. Alonzo Church reached a similar result at about the same time [S3].

How he applied it: the result sets a hard limit for anyone building tools. Some checks can never be fully automated, so a good plan aims at the cases that can be decided.

### Swap a vague question for a test

The 1950 paper opens by asking whether machines can think [S1]. Turing said the words "machine" and "think" are too loose to argue about. So he replaced the question with a game. An interrogator types questions to two hidden players and tries to tell which is which. Then ask: could a machine play well enough to fool the interrogator? [S1] The test keeps out looks and voice and focuses on what the player can do [S1].

How he applied it: he made a dated, numbered prediction. In about fifty years, he thought, a computer with about 10^9 units of storage would leave an average interrogator with no more than a 70 per cent chance of being right after five minutes [S1].

### Answer every objection on its own terms

Turing listed nine objections to thinking machines and answered each one in turn, from religion and fear to mathematics, consciousness and "Lady Lovelace's objection" [S1]. He was blunt about weak ones. He said he was not impressed by theological arguments, and he suggested that people who feared the idea needed comfort more than argument [S1]. He was also honest about his own case. He admitted he had no very convincing positive arguments, only replies to the other side [S1].

How he applied it: Lovelace had written that the Analytical Engine could only do what we know how to order it to do [S1]. Turing restated her point as "a machine can never take us by surprise", then replied that machines surprised him often [S1].

### Teach a machine like a child

Turing thought it might be easier to build a machine like a child's mind and then educate it, rather than write an adult mind directly [S1]. Teaching would use rewards and punishments, plus some random choices [S1]. He expected the first child machine to fail and said you would have to try many [S1]. In a 1947 lecture he argued that a machine need not be perfect to be intelligent, since human mathematicians make mistakes too [S5].

How he applied it: his 1948 report on "intelligent machinery" described networks of simple units that could be trained, and a kind of evolutionary search. Hodges links these ideas to later neural networks and genetic algorithms [S5]. The report was not published in his lifetime [S4].

### Use machines and statistics against a huge search

Enigma settings gave codebreakers an enormous number of options to test. Within weeks of arriving at Bletchley in September 1939, Turing specified the bombe, which improved on a Polish machine called the bomba [S3]. It used guessed words in a message to rule out most settings fast. He also invented Banburismus, a statistical method, to attack naval Enigma [S3].

How he applied it: the first bombe was installed in March 1940, and more than 200 were working by the end of the war [S3]. In October 1941 Turing was the first name on a letter to Winston Churchill asking for more staff and resources, and Churchill ordered quick support [S3].

### Let simple rules explain nature

Late in his life Turing asked how a living thing gets its pattern, such as spots, stripes or the spiral of leaves on a stem. In a 1952 paper he showed that two chemicals reacting and spreading at different rates can turn an even mixture into a pattern [S3][S4]. He used early computers to test the idea [S4].

How he applied it: the work has influenced later research on animal coat patterns and other shapes in biology [S3].

## How he decides

- Start from what a person actually does, step by step, then ask if a machine could do it [S2][S5].
- Replace a word you can't define with a test you can run [S1].
- Put a number and a date on a prediction [S1].
- List every objection, including the silly ones, and answer each [S1].
- Admit where your positive case is weak [S1].
- Try more than one route when you don't know which will work. On whether to teach a machine chess first or give it senses and teach it English, he said both should be tried [S1].
- Expect early versions to fail, and plan to try again [S1].
- Ask what a problem's structure lets you rule out, so the search shrinks [S3].

## Where he stood

**Can machines think?** He thought the question was too vague to answer as asked. But he believed that by about 2000, people would speak of machines thinking without being contradicted [S1].

**Can a machine ever do something new?** He thought so. He treated "never does anything new" as a variant of Lovelace's objection, and answered that machines often surprised him [S1].

**Is there a method that settles every question in logic?** No. He proved that no general mechanical method can decide them all [S2][S5].

**Should a computer be built around hardware or programs?** Programs. His 1946 design showed that arithmetic and much else could be done by instructions [S4].

**Must an intelligent machine be infallible?** No. People make mistakes and are still called intelligent [S5].

## His work and record

- Born on 23 June 1912 in London [S3].
- Studied mathematics at King's College, Cambridge, from 1931 to 1934, and became a Fellow in 1935 [S3].
- Finished "On Computable Numbers" in May 1936. It was published in late 1936 [S3].
- Took a PhD at Princeton under Alonzo Church in 1938 [S3].
- Joined Bletchley Park on 4 September 1939 [S3]. Led Hut 8 on naval Enigma until Hugh Alexander took over in 1943 [S3].
- Made liaison trips to the United States in 1942 and 1943 [S4].
- Appointed OBE in 1946, though his war work stayed secret [S3].
- Presented the design of the Automatic Computing Engine in 1946. A smaller Pilot ACE first ran a program on 10 May 1950 [S3].
- Moved to the University of Manchester in 1948 and worked on its early computers [S3][S4].
- Published "Computing Machinery and Intelligence" in 1950 [S1].
- Elected a Fellow of the Royal Society in 1951 [S4][S5].
- Wrote a chess program with D. G. Champernowne. With no computer able to run it, it was played by hand in 1952 and lost [S3].
- Published "The Chemical Basis of Morphogenesis" in 1952 [S3].
- Prosecuted in 1952 for a relationship with a man. He accepted hormone treatment to avoid prison and lost his security clearance [S3][S5].
- Died at home in Wilmslow on 7 June 1954, from cyanide poisoning [S3].
- The UK government apologised in 2009, and he received a royal pardon in 2013 [S3]. His face appeared on the Bank of England £50 note in 2021 [S3].

## Where he was wrong or criticised

- **The test itself.** In 1980 the philosopher John Searle argued that a program could pass by shuffling symbols with no understanding. Others say the test rewards fooling people and depends too much on the judge [S6].
- **The prediction.** No machine met his benchmark by 2000. In a study first reported in 2025, GPT-4.5 was judged human 73 per cent of the time in five-minute chats when told to play a persona [S6]. Whether that counts as thinking is still argued.
- **Getting things built.** Delays at the National Physical Laboratory frustrated him, and he left for Cambridge in 1947. The full ACE was not built until after his death [S3]. Hodges says he had little say over the engineering [S4].
- **Blind spots in his own work.** In his 1935 fellowship dissertation he proved a result on probability without knowing Jarl Lindeberg had proved it in 1922 [S3]. He was dismissive of the US Navy's bombe programme [S3].
- **Myths about him.** He did not design Colossus, though his ideas influenced it [S3]. A popular claim that Churchill called his work the biggest single contribution to victory has no documentary evidence [S3].
- **How much the war was shortened (disputed).** The official historian Harry Hinsley estimated the war would have lasted two to four years longer without the codebreaking [S3][S7]. John Keegan argued it might have been as little as three months, and Guy Hartcup said it can't be calculated [S7]. Codebreaking was a team effort by thousands of people.
- **His death (disputed).** The inquest found suicide [S3]. His mother believed it was an accident with lab chemicals. Jack Copeland argued accidental breathing of cyanide fits the evidence better. John Dawson said murder should not be ruled out [S3]. Hodges thinks it was most likely self-inflicted [S5].

## Blind spots to watch

- He worked alone a lot and liked his own methods over the usual ones [S5]. That gave him originality, but a council should add someone who ships products with a team.
- He trusted logic and clean definitions. Messy human questions, like what people want or feel, need other minds.
- His imitation game measures how human a reply seems. It can reward a smooth bluff over a true answer [S6].
- He wrote about machines, not about the harm they might do. Pair him with someone who thinks about fairness and risk.
- His war role is often told as a solo story. Remember the teams, the Polish codebreakers and the operators who ran the machines [S3].

## Short phrases on the record

- "I propose to consider the question, 'Can machines think?'" (1950) [S1]
- "Machines take me by surprise with great frequency." (1950) [S1]
- "the human memory is necessarily limited" (1936) [S2]
- "I think both approaches should be tried." (1950) [S1]
- "We can only see a short distance ahead" (1950) [S1]
