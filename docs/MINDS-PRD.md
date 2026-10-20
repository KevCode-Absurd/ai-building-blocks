# PRD · Minds, the council, and clearer skill pages

**Status:** approved to build, 20 Oct 2026. Kevin: "come up with a plan first, create a PRD around the plan, start executing it step by step."

This PRD covers five changes. The first three tidy every skill page. The fourth adds a new part of the library. The fifth lets the workflow builder carry your own instructions.

1. **Thinking level.** Every skill shows how much thinking it needs (low, medium or high), so people can use a cheaper model when that's enough.
2. **A skeleton, not a sample.** The page shows the shape of what you'll get, with `<placeholders>`, near the top. We stop showing the full sample run made from a test brand.
3. **Broad areas.** Marketing, Design, Writing, Coding and so on sit above the narrow jobs, because the library will grow well past ads.
4. **Minds and the council.** 151 well-known people, each built from public sources into a data set and a personality. You can use one on its own ("write this like Shakespeare") or seat several on a council that argues a problem and gives you a decision.
5. **Start, end and your own notes in the builder.** Every workflow starts at a Start node and ends at an End node. Tap any step to see what it does and add your own instructions, such as a role ("Peter Thiel acts as my investor"). Those notes travel with the download.

---

## 1 · Thinking level (the barometer)

**Why:** a short reformatting job runs fine on a small, cheap model. An audit of a landing page or a six-stage script needs the strongest one. People waste tokens when they don't know which they need.

**What it shows:** a gauge with three zones and one line under it. No model names, because those change every few months.

| Level | What it says on the page | Rough fit today (for us, not shown) |
|---|---|---|
| **Low** | "A fast, low-cost model does this well." | Haiku, GPT Luna, GPT Terra |
| **Medium** | "A mid-level model is enough. Use your best one for big launches." | Sonnet, GPT Terra |
| **High** | "Use your strongest model, with extended thinking on if you have it." | Opus, GPT Astra, GPT Sol |

**How a skill gets its level** (judged per skill, written in `page.yaml` as `thinking: low | medium | high` plus `thinking_why`, one line):

- **High:** it judges or scores work (audits, checkers, analysts), reads pictures or data closely, runs many stages, or must keep many hard rules at once (accurate product images, long multi-clip scripts).
- **Medium:** it writes or plans with a handful of checks (most writers, planners, makers).
- **Low:** it reshapes or lists what you give it, with few judgement calls.

The level shows in the page header next to the skill's level of difficulty, and on cards as a small three-bar mark. The SKILL.md doesn't change, so test results stay valid.

## 2 · A skeleton, not a sample

**Why:** the full sample output was made from one test brand. It reads as artificial, and it's about someone else's business. A skeleton applies to everyone.

**What changes on a skill page:**

- A new section, **"What you'll get"**, sits right after the header, before "What it does". It has three parts, read top to bottom:
  1. **Better with** (suggestions, never required): the files and earlier skills that make it better, plus any tool it can pull data from. Links to the skills that make each one.
  2. **The output**: the skeleton in a code box, in the order the AI hands it back. What comes first, what comes next. Each gap is a `<placeholder>`.
  3. **Then you could** (suggestions): what to do next with it, linked. You can stop there, or build your own workflow.
- **"See it work" goes.** The test input stays in `page.yaml` because the tester uses it, but the page doesn't show it.
- The longer "Before you start" and "What to do next" sections stay lower down for detail, since they hold the step-by-step chain.

Every `output_shape` in the catalogue is already generic (no test-brand facts). A check in `tools/lint-pages.mjs` keeps it that way.

## 3 · Broad areas

**Why:** today's groups ("Run Meta ads", "Make product photos") suit an ads library. Once Minds and other skills arrive, narrow labels like "video editing" won't scale.

**What changes:** one row of broad areas above today's groups. Today's groups sit inside the areas, and one group can sit in two areas.

| Area | Holds today | Holds later |
|---|---|---|
| Marketing | Write copy that sells, Run Meta ads, Create ads, Turn visitors into buyers, Know your market, Grow on social | Email, SEO |
| Design | Create ads, Make product photos | Brand identity, UI |
| Business | Know your market, Set up AI for your work | Strategy, finance, ops |
| Writing, Sales, Coding, Science, Arts, Thinking, Leadership | Minds | Skills as we add them |

Minds use the same ten areas: Business, Sales, Marketing, Leadership, Design, Writing, Arts, Coding, Science, Thinking.

## 4 · Minds and the council

### 4.1 Where it lives

A new top-level section, **Minds**, at `/minds`, next to Prompts, Skills and Workflows.

- It isn't a skill in the usual sense. A skill does one job. A mind is a way of thinking you can point at many jobs.
- `/people` is already taken by people's shared spaces, so the new section can't be called People there. **Recommendation:** call it **Minds**. If you'd rather it be People, we rename the community page to `/makers`.

### 4.2 What one mind is made of

One folder per person: `catalogue-items/minds/<slug>/`.

| File | What it holds | Size |
|---|---|---|
| `mind.yaml` | Name, area, years, living or not, one line on what they're known for, 6 to 10 use cases, 2 or 3 suggested council seats, who they pair well with, and the source list | Short |
| `knowledge.md` | **The data set.** Their main ideas and frameworks, how they decide, where they stand on the questions they kept coming back to, their best-known work and examples (summarised), where they were wrong or criticised, and their blind spots. Every claim is tagged with a source number. | 1,500 to 2,500 words |
| `personality.md` | **How they think and talk.** Their voice (sentence length, words, tone), how they argue, the questions they always ask, how they react to a weak idea, short phrases they're known for, what they'd never say, and how to play them without turning them into a cartoon. | 600 to 1,000 words |
| `SKILL.md` | Built by `tools/build-minds.mjs` from the three files above. "Think and write like X", with the rules in §5. | Generated |

**How the files reach the AI:** each mind's `SKILL.md` carries the personality and the data set in it, so one file is enough in any chat. In Claude Code, the council skill reads the folders directly. A council download is a zip: the council `SKILL.md`, plus one folder per chosen mind.

### 4.3 How we get and clean the data

There are no scrapers and no logins. Each source is a single public page, read by hand.

1. **Pick sources, best first:**
   - Their own words, in public: letters (Bezos's and Buffett's shareholder letters), essays (Paul Graham), public talks and interviews with published transcripts, and public-domain books (Project Gutenberg for Shakespeare, Austen, Twain, Franklin, Marcus Aurelius and others).
   - Then good secondary sources: encyclopedia entries, obituaries, university pages and well-known biographies, used for facts.
   - Then well-known summaries of their books, used only to check our own summary.
2. **Write it in our own words.** The data set summarises ideas. It doesn't copy text.
   - For copyrighted work, quotes stay under 15 words, with at most five per mind, each with its source.
   - Public-domain work can be quoted more, but still briefly.
3. **Clean it:**
   - Merge repeats.
   - Drop gossip and private life unless it shaped their work.
   - Mark anything disputed as disputed.
   - Date anything that may have changed (a living person's current views).
   - Check that the living flag and the years are right.
4. **Tag every claim** `[S1]`, `[S2]`, matching the numbered list in `mind.yaml`.

`docs/MODELS.md` sets the model and reasoning level for each step. Transcripts you send get cleaned by Haiku, facts get pulled out by Sonnet, and Opus writes the data set and personality. A different model, Fable, grades the tests. It also lists the GPT models to swap in later.

### 4.4 How we know it's good

Each mind gets five test prompts in `mind.yaml`:

- two "use it alone" tasks (for example "write a sonnet about a delayed train" for Shakespeare),
- two "advise me" questions,
- one trap: a question that tempts it to invent a quote or claim an opinion they never held.

The tester (the same batch tool as skills) runs them, and a judge grades five things:

1. It sounds like them.
2. It's grounded in `knowledge.md`.
3. It invents no quotes.
4. It marks anything beyond the record.
5. It's useful.

We run a pilot of 6 minds first, check it, then build the rest.

### 4.5 The council skill: "Advisory council"

One skill. Pick up to 7 minds, give each a seat, and they work your problem together.

1. **The problem.** You say what you're deciding and what a good outcome is. Your files help (brand brain, numbers), but none is required.
2. **Seats.** For each mind it suggests a seat (Bezos: "Operations and the customer"; Hormozi: "Offers and pricing"; Munger: "Devil's advocate"). You keep it or type your own. You're the chair and make the final call.
3. **Opening round.** Each member answers in their own voice, from their data set, in under 150 words.
4. **Cross-examination.** Each member answers the one they disagree with most.
5. **Peer review.** Each member ranks the others' answers without knowing who wrote them, so names don't sway the score. This idea is borrowed from Karpathy's LLM Council, and we credit it.
6. **The chair's brief.** You get:
   - the recommended decision,
   - the strongest dissent, kept, not smoothed over,
   - what would change the call,
   - the first three steps.

In Claude Code, each member can run as its own subagent. In a chat, one model plays every member in turn, and the skill keeps their voices apart.

**On the site:** a council is a workflow in the builder. It runs Start → the Advisory council skill → the chosen minds side by side → End. Tap a mind to see its suggested seat, then keep it or type your own role and notes (§6b). "Start a council" on `/minds` opens the builder with this already laid out. The download is a handoff pack like any other: built by plain code, so it's the same every time.

## 5 · Rules every mind follows (safety and honesty)

These go in every mind's `SKILL.md`:

- It's an AI playing a public figure from their public work. It never claims to be them, and it isn't endorsed by them or their estate. The page says so too.
- It never invents a quote. When it goes beyond the record, it says "beyond the record" (or similar) in one line.
- **Living people:** no private life, no claims about their current plans, and no speaking for them on new events. The data set has a "last checked" date.
- **Investors** (Buffett, Munger, Dalio, Graham): they explain their frameworks. They give no personal investment advice and no buy or sell calls.
- No health, legal or money advice beyond general principles. Political figures stick to leadership lessons from their record, not today's politics.
- No song lyrics, and no long passages from copyrighted books.

## 6 · The 151

The machine list is `catalogue-items/minds/_roster.yaml`, with a suggested seat for each. By area:

- **Business (21):** Jeff Bezos, Steve Jobs, Elon Musk, Bill Gates, Warren Buffett, Charlie Munger, Sam Walton, Henry Ford, Walt Disney, Sara Blakely, Phil Knight, Richard Branson, Ratan Tata, Indra Nooyi, Oprah Winfrey, Paul Graham, Naval Ravikant, Jensen Huang, Ray Dalio, Benjamin Graham, Peter Thiel
- **Sales (10):** Alex Hormozi, Dale Carnegie, Zig Ziglar, Robert Cialdini, Chris Voss, Brian Tracy, Joe Girard, Mary Kay Ash, Neil Rackham, Jim Rohn
- **Marketing (14):** David Ogilvy, Claude Hopkins, Eugene Schwartz, Gary Halbert, Bill Bernbach, Joseph Sugarman, Seth Godin, Al Ries, Rory Sutherland, Byron Sharp, Gary Vaynerchuk, Russell Brunson, MrBeast, Mary Wells Lawrence
- **Leadership (12):** Sun Tzu, Winston Churchill, Abraham Lincoln, Nelson Mandela, Mahatma Gandhi, Peter Drucker, Andy Grove, Clayton Christensen, Michael Porter, Jim Collins, Simon Sinek, John Wooden
- **Design (11):** Dieter Rams, Jony Ive, Paul Rand, Saul Bass, Massimo Vignelli, Charles and Ray Eames, Zaha Hadid, Frank Lloyd Wright, Don Norman, Coco Chanel, Paula Scher
- **Writing (16):** William Shakespeare, Jane Austen, Ernest Hemingway, Mark Twain, Maya Angelou, Charles Dickens, George Orwell, Agatha Christie, Stephen King, Toni Morrison, Rumi, Emily Dickinson, Oscar Wilde, Edgar Allan Poe, J.R.R. Tolkien, Rabindranath Tagore
- **Arts (20):** Leonardo da Vinci, Pablo Picasso, Vincent van Gogh, Frida Kahlo, Salvador Dalí, Andy Warhol, Katsushika Hokusai, Alfred Hitchcock, Stanley Kubrick, Akira Kurosawa, Hayao Miyazaki, Christopher Nolan, Jerry Seinfeld, Mozart, Beethoven, Quincy Jones, Rick Rubin, A. R. Rahman, David Bowie, Robert McKee
- **Science (14):** Albert Einstein, Isaac Newton, Marie Curie, Richard Feynman, Charles Darwin, Nikola Tesla, Carl Sagan, Galileo Galilei, Stephen Hawking, Jane Goodall, Srinivasa Ramanujan, Thomas Edison, Katherine Johnson, Rosalind Franklin
- **Coding (13):** Alan Turing, Ada Lovelace, Grace Hopper, Linus Torvalds, Donald Knuth, Steve Wozniak, John Carmack, Andrej Karpathy, Margaret Hamilton, Tim Berners-Lee, Kent Beck, Demis Hassabis, Fei-Fei Li
- **Thinking (20):** Socrates, Aristotle, Confucius, Lao Tzu, Marcus Aurelius, Seneca, Friedrich Nietzsche, Niccolò Machiavelli, Benjamin Franklin, Adam Smith, John Maynard Keynes, Daniel Kahneman, Carl Jung, Viktor Frankl, Nassim Nicholas Taleb, Yuval Noah Harari, Brené Brown, Joseph Campbell, Thich Nhat Hanh, Bruce Lee

The mix: 99 who have died (many in the public domain) and 52 living, about 25 women, and people from every continent but Antarctica. Living flags and years are checked again as each mind is built.

## 6a · The second 100: business builders (added 2026-10-20)

Most people come here to run or grow something, so the next 100 are people who built businesses, mostly founders:

- **Entrepreneurs (55, area business):** Howard Schultz, Ray Kroc, Estée Lauder, Madam C.J. Walker, Andrew Carnegie, John D. Rockefeller, Konosuke Matsushita, Akio Morita, Soichiro Honda, Kazuo Inamori, Masayoshi Son, Jack Ma, Reed Hastings, Brian Chesky, Patrick Collison, Tobi Lütke, Marc Andreessen, Reid Hoffman, Mark Zuckerberg, Larry Page, Sam Altman, Yvon Chouinard, Anita Roddick, Ingvar Kamprad, Herb Kelleher, Arianna Huffington, Whitney Wolfe Herd, Melanie Perkins, Daniel Ek, N. R. Narayana Murthy, Aliko Dangote, Strive Masiyiwa, Stewart Butterfield, Drew Houston, Michael Dell, Tony Hsieh, Dietrich Mateschitz, Mark Cuban, Daymond John, Barbara Corcoran, Jason Fried, Pieter Levels, Sahil Lavingia, Tim Ferriss, Noah Kagan, Ben Horowitz, Eric Ries, Steve Blank, Guy Kawasaki, Ruth Handler, Milton Hershey, Taiichi Ohno, Brunello Cucinelli, Bernard Arnault, Marty Cagan
- **Marketers (17):** Philip Kotler, Jack Trout, Leo Burnett, Lee Clow, Dan Wieden, George Lois, Helen Lansdowne Resor, Rosser Reeves, Ann Handley, Neil Patel, Rand Fishkin, April Dunford, Donald Miller, Dan Kennedy, Jay Abraham, Sean Ellis, Andrew Chen
- **Designers (14):** Milton Glaser, Stefan Sagmeister, Jessica Walsh, Tibor Kalman, Susan Kare, Raymond Loewy, Michael Bierut, Debbie Millman, Aaron Draplin, Marty Neumeier, Tinker Hatfield, Virgil Abloh, Kenya Hara, Josef Müller-Brockmann
- **Sellers (7):** Jeffrey Gitomer, Mark Roberge, Aaron Ross, Jill Konrath, Matthew Dixon, Jeb Blount, Elmer Wheeler
- **Operators and strategists (7, area leadership):** Satya Nadella, Lisa Su, Mary Barra, Ed Catmull, Kim Scott, Patty McCord, Hamilton Helmer

That brings the roster to 251. Same files, rules and tests as the first 151.

Then 52 more on the craft side (added the same day): **15 copywriters** (John Caples, Robert Collier, Victor Schwab, John E. Kennedy, Bill Jayme, David Abbott, Howard Gossage, Phyllis K. Robinson, Shirley Polykoff, Gary Bencivenga, Clayton Makepeace, John Carlton, Drayton Bird, Joanna Wiebe, Luke Sullivan), **9 marketers** (Mark Ritson, Les Binet, Paul Feldwick, Bob Hoffman, Jonah Berger, Chip Heath, Dharmesh Shah, Scott Galloway, Peep Laja), **11 designers** (Herb Lubalin, Alan Fletcher, Otl Aicher, Wim Crouwel, April Greiman, David Carson, Neville Brody, Ellen Lupton, Erik Spiekermann, Jakob Nielsen, Steve Krug) and **17 authors** (Malcolm Gladwell, Daniel Pink, Cal Newport, James Clear, Adam Grant, Stephen Covey, Robert Greene, Ryan Holiday, Morgan Housel, William Zinsser, Anne Lamott, Steven Pressfield, Julia Cameron, Kurt Vonnegut, Virginia Woolf, Leo Tolstoy, Ursula K. Le Guin). The roster is now 303.

## 6c · Faces

Every mind has a 16 by 16 pixel portrait in black and white, drawn by the site from a few traits (`catalogue-items/minds/_avatars.yaml`, renderer `site/src/lib/face.ts`). It shows the look people picture from public photos, like a turtleneck, round glasses or wild white hair. It's never a likeness or a joke. Each face is outlined in black so every skin tone reads on the pale backdrop. It shows on the minds wall and cards, on the mind's page, on the council bar and on builder nodes. Faces blink now and then, except for people who turn motion off.

## 6b · Start, end and your own notes in the builder

Kevin, 20 Oct: "you have a start node in the beginning and an end node … once you save the workflow, the end node automatically gets appended", and "if they tap it, they can add more stuff to the skill … that gets pushed as instructions when they download the workflow".

- **Start node.** Always on the canvas, first, and can't be deleted. It holds what the whole workflow is for (the goal) and any notes for every step.
- **End node.** Added automatically when you save, after the last steps, and wired to every step that has nothing after it. It says what you get at the end. Steps that run side by side (four council members at once) all lead into it.
- **Side by side.** Two or more steps that hang off the same step run in parallel. The handoff pack says so ("steps 2 to 5 can run at the same time"), and in Claude Code each one can be a subagent.
- **Your notes on a step.** Tap a step to open its panel. It shows what the skill does, what it takes and gives, and two fields:
  - **Role:** a short line, such as "My investor", with suggestions for minds (their seats).
  - **Extra instructions:** free text, such as "Push back hard on the price".
- **Where the notes go.** The pack's `HANDOFF.md` lists each step with its role and notes, and `workflow.json` carries them. Each step's `skills/<slug>/SKILL.md` gets a short "Your notes for this step" section at the top, so the notes still apply when the skill runs alone. The skill files in the library don't change.
- **Saving and sharing.** Notes save with the workflow in the browser, and they go with it when you add it to your space or share it.

## 6d · Hire them: playbooks and enrichment (added 2026-10-20)

Kevin, 20 Oct: the point of a mind is "basically hiring them". For example, hiring Ratan Tata for advice on your manufacturing, Claude Hopkins to write your copy, or the best designers to look at a video editor's work. "Knowing the specific facts is not very important"; what matters is how they'd think about your problem, in their voice.

- **playbook.md** is the fourth file and the most important one: "Hire <Name>: how they'd work for you". It covers:
  - the jobs to hire them for
  - their method as 5 to 8 steps
  - the first questions they'd ask
  - 4 to 7 jobs, one by one, always including one outside their field and one on life and career
  - what they'd push back on
  - what you get back

  The house style is `ratan-tata/playbook.md`. It's written from knowledge.md, so it needs no web research, and it never quotes beyond the short phrases list. SKILL.md puts it first. The mind page shows a "Hire <Name>" section with the jobs, the steps and the first questions.
- **Enrichment** for minds with a thin record: more sources in their own words, a "Real decisions" section, views dated over time, and a voice drawn from evidence (`check-minds --enriched`). It comes after the playbook and matters most where the voice is guesswork.
- **Pilot, 20 Oct.** Ten minds were scored before and after by blind Sonnet judges on the subscription. Each mind had 7 tests: its 5 own tests plus 2 hire tests (a candle shop with flat sales, and a video editor whose clients don't return).

  | Measure | Before | After |
  |---|---|---|
  | "Would you pay for this advice?" | 3.8 | 4.4 |
  | Same, on the hire tests | 3.8 | 4.5 |
  | Specific | 3.9 | 4.5 |
  | Distinctive | 3.8 | 4.2 |
  | Voice | 3.8 | 4.0 |

  The after version won 48 of 70 head to head, lost 6 and tied 16. Bernbach gained no new sources and still won 6 of 7, so the playbook alone moves the score. Voice gained least, so the thin-voice minds get a further pass.
- **Cost rule (Kevin, 20 Oct):** no Claude API credits. Tests and judging run as subagents on the subscription. Each job gets the cheapest model that does it well: Haiku for checks and sweeps, Sonnet for writing, research and judging, and Opus only for design work.

## 6e · Later: minds on steps, overseers and team councils (Kevin, 20 Oct)

Not built yet. This is the next builder round, after 6b.

- **A mind on any step.** Assign a person to a step: the copy step written like Claude Hopkins, the prompt designed by a great prompt writer, the script by Shakespeare. The step's skill does the job, and the mind's playbook and voice shape how it's done. Steps connect as they do now.
- **An overseer for a whole workflow.** One mind sits above the workflow, checks each step's output against its method and sends weak work back once before it moves on.
- **Team councils.** You sit at the top with up to six minds below you. A council runs in one of two modes, chosen when you set it up:
  - **Split by expertise.** The task is broken into parts, each part goes to the mind best suited to it, and one final answer pulls the parts together.
  - **Decide together.** Every mind gets the whole task, they argue it among themselves (the current Advisory council rounds) and hand you one agreed output.
- **In the pack.** The assigned mind, the overseer and the council mode go into `workflow.json` and `HANDOFF.md`, and the mind's folder ships with the step, so it still works in any chat.

## 7 · Build order

| Step | What | Who |
|---|---|---|
| 1 | Finish the skill retest (label `2026-10-20-v5`) and report | Batch tool |
| 2 | Thinking level on all 162 skills, plus the gauge on pages and cards | Main session |
| 3 | "What you'll get" skeleton section; drop "See it work" | Main session |
| 4 | Broad areas row in the library | Main session |
| 5 | Mind format, `tools/build-minds.mjs`, the council skill | Main session |
| 6 | Pilot: 6 minds (Bezos, Hormozi, Ogilvy, Shakespeare, da Vinci, Feynman), then review | One subagent |
| 7 | The other 145 minds, in parallel batches by area | Subagents |
| 8 | Builder: Start and End nodes, a role and notes per step, carried into the pack | Main session |
| 9 | `/minds` pages; the council is built in the builder (Start → minds side by side → End) | Main session |
| 10 | Mind tests (five prompts each) through the batch tester | Batch tool, Claude credits |

**Not in this round:** voices or avatars, minds chatting live on the site (we don't run models on the site), or user-made minds. User-made minds come later through spaces.
