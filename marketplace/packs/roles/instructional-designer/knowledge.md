# Instructional designer: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This is general design practice. It is not legal advice on accessibility law, consumer law or email marketing rules, which differ by country and by who the client is. Where a decision turns on the law, I point to the official guidance and say when to ask a lawyer or an accessibility specialist.

## 1. What this role is for

**Who hires an instructional designer.** L&D and HR teams with more content than time; software firms that want customers to learn the product without opening a support ticket; experts, coaches and freelancers who teach and want a course people finish; product makers who teach new owners by email; franchise and dealer networks. The agents built on this kit split the work six ways:

- course outlines planned back from a result, with lessons, practice and a final project;
- screen-by-screen e-learning storyboards and self-paced lesson pages, ready to build in Rise, Storyline or an LMS;
- branching scenarios for hard conversations and decisions, with a scenario map and build notes for Twine, Rise or Storyline;
- training and how-to video scripts with captions;
- email, text and chat micro-courses;
- customer academies tied to support ticket topics, with certification exams.

**What good work looks like.**
- Every lesson serves something the learner must be able to do, written as an action, and every action has practice and a check.
- Content comes from the client's material. Anything added is marked for the subject expert to confirm.
- Screens are short, practice comes often, and feedback explains why.
- It works for everyone: captions, alt text, keyboard access, readable contrast, no time traps, and text short enough to read on a phone.
- It runs in the client's platform: the right package type, tested before launch.
- Course promises match what the course teaches.

**How the work is judged.** Completion, and more importantly whether learners can do the task afterwards; scores on practice and checks; drop-off points; support tickets on the topics taught; accessibility defects found in review; build time saved because the storyboard was clear.

**What this role never does.** Publish a course or send a course email without the client's OK at the right access level; write right answers that are really legal or HR rulings; certify or accredit a course; promise income, jobs or health results; use real staff or customer names in scenarios; build safety-critical training without the client's expert signing it off.

## 2. The canon

**Robert Gagné, nine events of instruction.** A lesson sequence most designers still use as a checklist: gain attention, state the objectives, recall what learners already know, present the content, guide them, get them to perform, give feedback, assess, and help them keep and transfer it. The common modern source is Gagné, Briggs and Wager's *Principles of Instructional Design* (4th edition, 1992) [23].

**Richard Mayer, multimedia learning.** Mayer studies how people learn from words and pictures. His team ran more than 100 experiments over two decades and distilled 12 principles for designing online learning [24]. His book with Ruth Colvin Clark, *e-Learning and the Science of Instruction* (4th edition, 2016), turns them into design guidance [24]; read the principles there rather than from second-hand lists. This kit's own working rules follow the same spirit: cut anything that does not serve the goal, put words next to the picture they explain, do not fill a screen with text that repeats the narration word for word, let learners control the pace, and write in a conversational voice.

**Philip Guo, Juho Kim and Rob Rubin, video engagement (2014).** The largest study of its kind at the time: 6.9 million video sessions across four edX courses. Median engagement was at most 6 minutes whatever the video's length, viewers often stopped less than halfway through videos over 9 minutes, and tutorial videos were watched for only 2 to 3 minutes. They recommend planning videos in chunks under 6 minutes [25]. **Real example:** edX's own video producers had pushed instructors toward short chunks before the study, met resistance from lecturers used to hour-long classes, and then used the data to make their case [25].

**Item-writing guidance.** University teaching centres publish the shared rules for multiple-choice questions: one clear question in the stem, plausible distractors based on real mistakes, parallel options of similar length, one best answer, few negatives, sparing "all of the above" [30].

**Reading list (credited, not quoted).** M. David Merrill, "First Principles of Instruction" (problem-centred learning with activation, demonstration, application and integration); Grant Wiggins and Jay McTighe, *Understanding by Design* (backward design: results first, then evidence, then learning activities); Lorin Anderson and David Krathwohl's revision of Bloom's taxonomy (verbs for the level of thinking a goal needs); Cathy Moore, *Map It* (action mapping and scenario-based practice). The shared idea: design from what people must do, and make practice look like the real job.

## 3. How the work is done now

### Designing from performance

- Start with the result: who the learner is, where they start, and what they can do at the end, in one sentence. Then write 2 to 5 goals as actions you could watch ("issue a prorated refund in the billing screen"), never topics.
- For each goal, decide the evidence first (a task, a scenario decision, a project), then the practice that builds to it, then the minimum content needed. Write the knowledge check before the screens that prepare for it.
- Sequence from easy to hard. One idea per lesson, a worked example, practice, feedback and a check. Long policies stay as references; only what learners must act on goes in the module.

### E-learning storyboards and authoring tools

- A storyboard is a numbered table: screen, on-screen text, narration, visual, interaction, feedback, and build notes (layout, alt text, what is a click, a tab or a drag). A developer should be able to build from it without questions.
- As of November 2026, Articulate sells **Articulate 360 AI**, a per-seat annual subscription that includes Rise and Storyline, with a 14-day trial [19]. Other tools are listed in `access.md`. Tool names and plan names change; check the vendor's page.

### Packaging for the LMS: SCORM, xAPI and cmi5

- **SCORM** covers two things: a zip package with an `imsmanifest.xml` file the LMS imports, and run-time calls that report completion, score and bookmarks [12]. **SCORM 1.2** (October 2001) is still the most widely adopted; among **SCORM 2004** editions, the 3rd edition (October 2006) is the most used, and the 4th (March 2009) adds more sequencing options [13]. LMSs interpret SCORM differently, so a package that works in one can misbehave in another [12].
- **xAPI** records activity as "actor, verb, object" statements sent to a Learning Record Store (LRS), and can track mobile, offline, simulation and on-the-job activity outside an LMS [14]. It is an IEEE standard (IEEE 9274.1.1-2023) [14]; ADL's repository says the current version is xAPI 2.0 [16].
- **cmi5** (released 2016) is an xAPI profile that adds the rules an LMS needs to launch and track xAPI content, so it can replace SCORM where the LMS supports it [15].
- Support varies by platform. For example, TalentLMS lists SCORM 1.2, Tin Can (the earlier name for xAPI) and cmi5 on all its plans as of November 2026 [18]. Always ask the client which standard and version their LMS supports, then test.
- **Test before launch** in SCORM Cloud, which lets you upload, preview and debug SCORM, AICC, xAPI and cmi5 packages on a free trial plan; it shows what happens on import and launch but does not certify strict conformance [17]. Then test once more in the client's own LMS with a test learner.

### Branching scenarios

- Sketch the map before writing scenes: 3 to 6 decision points, 2 to 4 choices each, and where paths rejoin, so the scenario stays buildable. Every path ends: strong, mixed or poor. Wrong choices are the mistakes real people make, not silly options.
- Consequences show what happens next in the story; feedback names the skill or rule. Right answers come from the client's policy, never from the designer's opinion of the law.
- **Twine** is free and open source; version 2.12.1 was released on 6 October 2026. It publishes a single HTML file and offers the Harlowe, SugarCube, Chapbook and Snowman story formats [20]. Scenarios can be written as **Twee 3** text: each passage starts with `:: Passage name [tags]`, and special passages `StoryTitle` and `StoryData` hold the title, a required `ifid`, the story format and the start passage; files are UTF-8 with a `.twee` or `.tw` extension [21].
- A **Mermaid** flowchart makes the map reviewable in any Markdown tool: `flowchart TD`, decisions as `{text}`, choices as labelled links `A -->|choice| B`. Watch two traps in the docs: a node called lowercase `end` breaks the chart, and a node id starting with `o` or `x` right after a link turns the arrow into a circle or cross [22].

### Training videos and captions

- One task per video, under 6 minutes, opening with what viewers will learn and closing with a recap of the steps [25]. In the edX study, speaking rates ranged from 48 to 254 words a minute with a mean of 156, and energy mattered more than speed [25]. Time scripts by reading them aloud.
- Write the visual information into the narration ("click Save, the green button at the bottom right") so most videos need no separate audio description. WCAG 2.2 requires captions at Level A and audio description for prerecorded video at Level AA, unless all important visual information is already in the audio [1][4][5]. Provide a transcript too [5].
- Caption files: WebVTT is the W3C format (Candidate Recommendation Draft, 20 May 2026): a `WEBVTT` header, then cues timed `00:01:02.000 --> 00:01:05.500` [27]. SRT is the other common format; check which one the platform accepts. As a style reference, Netflix's English guide allows 42 characters per line, two lines and up to 20 characters a second for adult programmes [26].

### Accessible e-learning (WCAG 2.2 from W3C)

- **Which version.** WCAG 2.2 was published on 5 October 2023 and updated on 12 December 2024. W3C encourages using the latest version, and content that meets 2.2 also meets 2.1 and 2.0. WCAG 2.2 is now also ISO/IEC 40500:2025 [2].
- **The criteria that trip up e-learning most often** [1][3]: captions (1.2.2) and audio description (1.2.5); contrast of at least 4.5:1, or 3:1 for large text (1.4.3); everything usable by keyboard (2.1.1); time limits that can be turned off, adjusted or extended (2.2.1), which matters for timed quizzes; no focus hidden behind sticky bars (2.4.11, new in 2.2); a single-pointer alternative to drag-and-drop (2.5.7, new); click targets at least 24 by 24 CSS pixels (2.5.8, new); no re-entering answers already given (3.3.7, new); and log-ins without memory puzzles (3.3.8, new).
- **Alt text** follows W3C's decision tree: empty alt for decoration, the function for buttons and links, a short description for informative images, and the data elsewhere on the page for charts [6].
- **The law where clients are** (summaries, not advice):
  - **US:** the ADA Title II rule adopts WCAG 2.1 AA for state and local governments' web content and apps, including content that contractors provide; an interim final rule of 20 April 2026 moved compliance to 26 April 2027 for governments serving 50,000 or more people and 26 April 2028 for smaller ones [7]. **Real example:** under a 2015 settlement with the US Department of Justice, edX agreed to make its website, apps and learning platform meet WCAG 2.0 AA within 18 months, to name an accessibility coordinator within 30 days, to give course creators best-practice guidance, and to have content providers certify each course against a checklist before launch [8].
  - **UK:** public sector websites and apps should meet WCAG 2.2 AA and publish an accessibility statement; intranets and extranets are covered [11].
  - **EU:** the European Accessibility Act applies from 28 June 2025 [10]. It covers services such as e-commerce, e-books and banking; e-learning is not on its list by name [9]. A page where consumers buy a course may count as e-commerce. That is a question for the client's lawyer.

### Email and chat micro-courses

- One small skill per lesson, a task the reader can do in about ten minutes, and a quick check. Plain-text emails read well on phones.
- **US:** marketing emails must have honest headers and subject lines, a postal address and a working opt-out honoured within 10 business days; penalties can reach $53,088 per email (FTC figure updated January 2024) [28]. Course lessons someone signed up for can still carry commercial content, so build every course email to these rules.
- **UK and EU:** consent rules for marketing email differ; check the national regulator's guidance. Send only to people who signed up.

### AI in course production

- EU transparency rules took effect in August 2026: people must be told when they are dealing with a chatbot, generative AI content must be identifiable, and deepfakes must be labelled [29]. If a course uses an AI tutor, a synthetic voice or an AI avatar of a real person, say so on screen and check the details with the client's lawyer.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| at most 6 min | Median time viewers watched any edX video, whatever its length | [25]; four math and science edX courses from Fall 2012; measures engagement, not learning |
| under half | Share of a video over 9 minutes most viewers watched | [25]; same caveat |
| 2 to 3 min | Viewing time for tutorial videos | [25]; same caveat |
| 156 wpm | Mean speaking rate in edX videos (range 48 to 254) | [25] |
| 4.5:1 / 3:1 | Minimum contrast for normal / large text, WCAG AA | [1] |
| 24 x 24 CSS px | Minimum click target, WCAG 2.2 AA, with exceptions | [3] |
| 20 seconds | Minimum warning to extend a time limit under 2.2.1 | [1] |
| 42 chars, 2 lines, 20 cps | Netflix caption style for adult English programmes | [26]; a house style, not a legal rule |
| Oct 2001 / Oct 2006 / Mar 2009 | SCORM 1.2 / 2004 3rd edition / 2004 4th edition | [13] |
| 26 Apr 2027 / 26 Apr 2028 | ADA Title II compliance dates after the April 2026 extension | [7] |
| 28 Jun 2025 | European Accessibility Act applies | [10] |
| 10 business days | Time to honour an email opt-out under CAN-SPAM | [28] |
| $53,088 | Maximum US penalty per non-compliant email | [28]; figure updated January 2024 |

**Numbers I do not quote.** "Hours of development per hour of e-learning" averages: the figures that circulate come from old practitioner surveys I could not open, so I estimate from the client's own past projects instead. Average course completion rates: they vary too much by audience, price and purpose. "People remember 10% of what they read and 90% of what they do": the learning pyramid has no study behind it. "Attention spans of 8 seconds": no traceable source.

## 5. Decision rules

- If a goal is a topic ("understand GDPR"), rewrite it as an action the learner must do, because a topic cannot be practised or checked.
- If the client wants a long policy turned into a short module, put only what learners must act on into the module and keep the rest as a linked reference, because screens of policy text are not learning.
- If the skill is a judgement call or a hard conversation, use a branching scenario rather than slides and a quiz, because decisions are learned by making them.
- If a video runs past 6 minutes, split it, because engagement drops whatever the length [25].
- If a screen shows something the narration does not say, add it to the narration or the text alternative, because blind learners and audio-only learners miss it otherwise [4][5].
- If an interaction relies on dragging, add a click or keyboard alternative, because WCAG 2.2 requires a single-pointer option [1].
- If a quiz is timed, let learners turn off or extend the limit unless timing is essential to what is being assessed [1].
- If the client does not know which package standard their LMS needs, ask the LMS admin or vendor, then test in SCORM Cloud and their LMS before launch [12][17].
- If the LMS supports it and the client wants to track learning outside courses, consider xAPI or cmi5; otherwise SCORM 1.2 is the safest default for wide support [13][15].
- If a scenario's right answer depends on law (employment, data, safety), take the answer from the client's policy and have their expert sign it off; never decide it yourself.
- If a course uses an AI voice, avatar or tutor for EU learners, disclose it on screen [29].
- If a course is sold, promise only what the course teaches, and say who it is not for.

## 6. Common mistakes

- **Topic goals.** Spot it: goals start with "understand", "know" or "be aware of". Fix: action verbs and a standard.
- **Page-turners.** Spot it: ten screens of text before any practice. Fix: practice at least every few screens.
- **Quiz of trivia.** Spot it: questions test recall of definitions, not decisions. Fix: scenario questions tied to each goal [30].
- **Feedback that says only "Correct!"** Fix: say why, and why the other options are wrong.
- **Silly distractors.** Spot it: one option is obviously absurd. Fix: use real mistakes [30].
- **Dead-end branches.** Spot it: a path with no ending, or ids that do not match between script and map.
- **Video lectures.** Spot it: a 25-minute screen recording. Fix: one task per video, under 6 minutes [25].
- **Accessibility at the end.** Spot it: captions, alt text and keyboard testing added after the build. Fix: write them into the storyboard [5].
- **Untested packages.** Spot it: the course is uploaded straight to the live LMS. Fix: SCORM Cloud, then a test learner in the LMS [17].
- **Invented content.** Spot it: steps, menu names or rules not found in the client's material. Fix: mark [confirm with your team].
- **Over-promising launch copy.** Spot it: income or job claims. Fix: describe what learners will be able to do.

## 7. Quality bar

Before anything ships, I check:
1. Does every goal have practice and a check, and does every screen serve a goal?
2. Does every fact, step and button name match the client's material, with additions marked?
3. Is on-screen text short enough to read on a phone, and is narration timed by reading aloud?
4. Are captions, transcripts, alt text, contrast, keyboard access, target size, timing and drag alternatives covered for WCAG 2.2 AA?
5. Do scenario ids match between script, map and build notes, and does every path end?
6. Is the package type confirmed with the client's LMS and tested?
7. Are real names removed and AI use disclosed where needed?
8. Do marketing claims promise only what the course teaches?

## 8. How this role writes

- **Storyboards:** numbered tables, one row per screen, with on-screen text kept short and narration in a separate column.
- **Scripts:** two columns, narration on the left and what is on screen on the right, with start times.
- **Scenarios:** scenes under about 120 words, choices in the words a real person would say, feedback that names the skill.
- **Tone:** plain, warm and direct; second person; short sentences; no jargon learners would not use at work.
- **Build notes:** exact and boring: what is clickable, what triggers what, alt text, focus order.
- **Hand-offs:** each deliverable ends with "Confirm with your team" items and "Build notes".

## 9. Glossary

- **Instructional design (ID):** planning learning so people can do something new, then checking they can.
- **Learning objective:** what the learner will be able to do, written as an action with a standard.
- **Backward design:** planning from results to evidence to activities.
- **Storyboard:** the screen-by-screen plan a developer builds from.
- **Authoring tool:** software that builds e-learning, such as Rise, Storyline or Captivate [19].
- **LMS (learning management system):** the platform that hosts courses, enrols learners and records results.
- **SCORM:** the older e-learning packaging and tracking standard (1.2 and 2004) [12][13].
- **imsmanifest.xml:** the file inside a SCORM package that tells the LMS what to import [12].
- **xAPI (Experience API, formerly Tin Can):** a standard for recording learning activity as statements [14].
- **LRS (Learning Record Store):** where xAPI statements are stored [14].
- **cmi5:** an xAPI profile with LMS launch and tracking rules [15].
- **Branching scenario:** practice where each choice leads to a different consequence.
- **Twee:** the plain-text format for Twine stories [21].
- **Mermaid:** a text syntax that draws flowcharts in Markdown tools [22].
- **Distractor:** a wrong option in a multiple-choice question [30].
- **WCAG:** W3C's Web Content Accessibility Guidelines; 2.2 is current [2].
- **Level AA:** the conformance level most laws and policies point to [1].
- **Captions:** text of speech and important sounds, synchronised with video [1].
- **Audio description:** narration of important visual information [4].
- **Alt text:** a text alternative for an image [6].
- **WebVTT:** the W3C caption file format [27].
- **Micro-course:** a short course sent in small lessons by email, text or chat.

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| WCAG version and ISO status | W3C overview [2] | 2.2 (updated 12 Dec 2024); ISO/IEC 40500:2025; WCAG 3 an early draft |
| ADA Title II dates | ADA.gov [7] | 26 Apr 2027 and 26 Apr 2028 after the 20 Apr 2026 extension |
| UK public sector rules | GOV.UK [11] | WCAG 2.2 AA; page updated 30 Sep 2024 |
| European Accessibility Act scope | Commission page [9], national laws | Applies from 28 Jun 2025; e-learning not listed by name |
| xAPI version | ADL repository [16], IEEE | xAPI 2.0 current; IEEE 9274.1.1-2023 |
| Authoring tool plans | Articulate [19] and other vendors | Articulate 360 AI includes Rise and Storyline |
| LMS package support | TalentLMS [18], client's LMS | SCORM 1.2, Tin Can and cmi5 on all TalentLMS plans |
| Twine version | twinery.org [20] | 2.12.1, 6 Oct 2026 |
| Mermaid syntax | Mermaid docs [22] | 12.3.0 |
| WebVTT status | W3C [27] | Candidate Recommendation Draft, 20 May 2026 |
| CAN-SPAM penalty | FTC [28] | $53,088 per email (Jan 2024) |
| EU AI transparency | Commission AI Act page [29] | In effect since Aug 2026; page updated 19 Oct 2026 |
