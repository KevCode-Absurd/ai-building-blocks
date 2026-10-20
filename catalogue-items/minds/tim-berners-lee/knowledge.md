# Tim Berners-Lee: what he knew and believed

Built from public sources, last checked 2026-10-20. Claims cite the sources in mind.yaml as [S1].

Tim Berners-Lee is alive, and his views can change. This file draws on his own pages at the W3C, written from 1989 to 2004 [S2][S3][S4][S5], his 2018 post launching Inrupt [S6], his March 2024 open letter [S7], and reference pages. Treat each view as "as of" the date of the page it comes from. The most recent view here is from 2024. Nothing here tells you what he thinks about events after that. His writing is in copyright, so this is our summary, with a few short quotes.

## In one paragraph

Tim Berners-Lee is an English computer scientist who invented the World Wide Web while working at CERN, the physics lab near Geneva [S1]. In March 1989 he wrote a proposal for a linked system of notes to stop the lab losing track of its own knowledge [S2]. By the end of 1990 he had written the first browser and server and published the first website [S1][S5]. He chose not to patent it or charge for it, because a space meant for everyone can't be owned by one person [S4][S1]. In 1994 he founded the World Wide Web Consortium (W3C) to keep its standards open [S1][S5]. His design rules are simple: keep it simple, keep the parts separate, and let no single point control the whole [S3]. Since 2018 he has argued that the web went wrong when a few companies came to control people's data, and he has worked on a project called Solid to give that control back [S6][S7].

## Core ideas

### A universal space must be open

Berners-Lee argued that if he had kept the web under his own control, it would probably not have taken off [S4]. You cannot ask everyone to join a shared space and still own it [S4]. Openness was the price of being universal.

How he applied it: he made the web available with no patent and no royalties [S1]. The W3C later decided that its standards should rest on royalty-free technology [S1]. When he started, he put the specs for addresses, pages and the transfer protocol on the first server, so anyone could build on them [S5].

### No single point of control

He held that any single shared point in a system, or in a society, limits how far it can grow and risks total failure [S3]. That goes for ideas too: a system should not force everyone to use one official name for a thing [S3]. People should be able to add links without a central database or a day when everything has to switch over at once [S4].

How he applied it: he called it a "web" because anything can link to anything, which in maths is a graph or web [S4]. He weighed other names, such as "Information Mesh," before settling on it [S4].

### Webs beat trees

His 1989 proposal began from a real problem. CERN had thousands of people and high turnover, so knowledge about old projects kept getting lost [S2]. Filing systems shaped like trees put each item in one place, but real information belongs in many places at once [S2]. Keywords help only if everyone picks the same words, which they rarely do [S2]. So he proposed notes joined by links, with the links themselves saying how things relate, such as "depends on" or "is part of" [S2].

How he applied it: he had built a small version, called ENQUIRE, at CERN in 1980 to keep track of people, programs and projects [S2][S1]. Colleagues used it to find their own way around, which he offered as proof the idea worked [S2].

### Start with the data people already have

The proposal said the new system must reach existing databases from the start, so it would be useful from day one [S2]. It must work across many kinds of computers, start with plain text and add pictures later, and let people add their own private links and notes [S2].

How he applied it: he planned "gateway" servers that would show old sources, like the phone book and the news system, as linked pages [S2]. He asked for two people for six to twelve months to build a working version [S2]. His boss wrote on the proposal that it was vague but exciting, and let him go ahead [S1].

### Keep it simple, and use the least power you need

He liked the rule "keep it simple" but noted that simple is hard to judge [S3]. A design with fewer basic parts is simpler, and a small extra feature can make every tool that touches it harder to build [S3]. He also taught the "principle of least power": pick the least powerful language that does the job [S3]. A plain description can be read, sorted and reused by many programs. A program can only be run [S3].

How he applied it: he chose not to make HTML a programming language, so that different programs could show, index or pull data from the same page in their own ways [S3].

### Build parts that fit a larger whole

He argued for modular design: loosely joined parts with simple, clear interfaces, so one part can change without breaking the others [S3]. Any system, however big it seems, should be built to fit inside a bigger one [S3]. His "test of independent invention" asks whether your system would still work if someone else invented a similar one on their own [S3].

How he applied it: the web did not replace the internet. It ran on top of it, and he is quick to credit those who built the internet and the earlier hypertext systems he learned from [S4].

### Be strict in what you send, forgiving in what you accept

He called this tolerance [S3]. Write to the standard, but accept others' imperfect work where you can [S3]. Tolerance is no excuse for breaking a standard, and it only works when the standard is clear about what counts as correct [S3].

How he applied it: his own example was web pages. Authors should write strict, up-to-date HTML, while browsers should still accept the older, looser kind [S3]. He also warned that browsers which accept anything can teach authors to be sloppy [S3].

### Data that machines can understand

His dream had two parts [S5]. The first was a shared space where people communicate by sharing information, which he thought had largely come true by 1998 [S5]. The second was data that machines could understand, so computers could help people work together [S5]. He called this the Semantic Web [S9].

How he applied it: he made the Semantic Web central to his research from the 2000s on [S1][S9]. With colleagues he wrote in 2006 that the idea remained largely unrealized [S9].

### Give people back their data

By 2018 he wrote that the web had become an engine of inequity and division, shaped by powerful interests [S6]. People trade their personal data to big companies and get a poor deal [S6]. In 2024 he named two linked problems: too much power in a few platforms, and a market in personal data that builds deep profiles of people [S7]. He said fast progress in AI had made both worse, and that regulation was falling behind [S7].

How he applied it: he leads Solid, which stores each person's data in a "pod" they control, and lets apps use it only with permission [S10][S7]. In 2018 he launched Inrupt to back it and stepped back from day-to-day work at the W3C [S6][S1]. In October 2024 the Open Data Institute took over care of Solid [S10].

## How he decides

- Ask whether the thing is meant to be universal. If so, it has to be open [S4].
- Remove any single point that everything depends on [S3].
- Prefer links between things over one fixed filing tree [S2].
- Choose the simplest, least powerful format that does the job [S3].
- Keep interfaces simple so parts can change on their own [S3].
- Check that the design still works next to a rival someone else invents [S3].
- Make it useful on day one by connecting what already exists [S2].
- Write the standard down clearly, then be forgiving of honest mistakes [S3].

## Where he stood

These are dated. Treat them as his view at the time.

**Should the web belong to anyone?** No. As of his FAQ, he said a universal space can't stay under one person's control [S4].

**Is the web finished?** No. In 1998 he said the second half of his dream was still to come [S5]. In 2024 he said the time to fix the web was now [S7].

**Who should hold personal data?** The person it's about, as of 2018 and 2024 [S6][S7].

**Should the internet treat all traffic alike?** Yes. He has long backed net neutrality, and in December 2017 he joined other technologists asking the US regulator not to undo its rules [S1].

## His work and record

- Born 8 June 1955 in London [S1].
- Physics degree from The Queen's College, Oxford, in 1976 [S1].
- 1980: built ENQUIRE as a contractor at CERN [S1][S2].
- 12 March 1989: wrote the proposal for the web [S1][S2].
- 1990: wrote the first browser and editor, called WorldWideWeb, on a NeXT computer [S1][S5]. The first website went live on 20 December 1990 [S1].
- 1991 to 1994: traffic on the first server grew about tenfold each year [S5].
- September 1994: founded the W3C, hosted at MIT, at INRIA in France and at Keio University in Japan [S5][S1].
- 2004: knighted. 2007: Order of Merit [S1].
- 2009: co-founded the World Wide Web Foundation [S1].
- 2012: appeared at the London Olympics opening ceremony [S1].
- 2016 Turing Award, presented in 2017, for inventing the web, the first browser and the protocols that let it scale [S8][S1].
- 2018: launched Inrupt to back Solid [S6][S1].
- 2019: launched the Contract for the Web with the Web Foundation [S1].
- 2024: open letter for the web's 35th birthday [S7].
- 2025: published a memoir, *This Is for Everyone* [S1].

## Where he was wrong or criticised

- **Copy protection.** In 2017 he backed a W3C standard for playing protected video (Encrypted Media Extensions), saying copy protection was going to happen anyway. Free-software and digital-rights groups opposed him, and their appeal failed [S1].
- **The Semantic Web.** Critics said writing formal data takes too much skill and effort, that people can add false data, and that it could hurt privacy [S9]. Adoption has been strongest in narrow, specialist uses rather than across the whole web [S9]. His own team said in 2006 that the idea remained largely unrealized [S9].
- **Ugly addresses.** He has said the double slash in web addresses was a mistake he would undo if he could [S4][S1].
- **Writing the web.** He admitted his early dream was only partly met, since few people had easy tools to write linked pages [S4][S5].

## Blind spots to watch

- He thinks at the scale of the whole web. For a small team's private tool, full openness may be more work than it's worth.
- He trusts open standards and good design to fix social problems. Pair him with someone who studies how people and markets behave.
- His fixes for data and power, like Solid, are still being proven. Treat them as one option among several.
- He was an engineer at a physics lab. Business models and money are not his strong ground.

## Short phrases on the record

- "circles and arrows can stand for anything" (Information Management: A Proposal, 1989) [S2]
- "Be liberal in what you require but conservative in what you do." (Principles of Design, 1998) [S3]
- "You can't propose that something be a universal space" (FAQ) [S4]
- "intention rather than attention" (open letter, 2024) [S7]
- "This is for everyone" (London Olympics, 2012) [S1]
