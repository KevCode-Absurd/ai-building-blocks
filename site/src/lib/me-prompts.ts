// The route (a) prompt from docs/ME-FILE-PRD.md §5: the person's own AI drafts their me.md from what it remembers,
// after asking first, or interviews them. The same text is the "Ask your AI what it knows about you" prompt
// (catalogue-items/general/me-md-from-ai-memory) and is in the starter pack (public/templates/me-md-prompts.md).
export const MAKE_ME_PROMPT = `Help me write my me.md: one short file that tells any AI who I am, so I don't have to explain myself again.

First, ask me this and wait for my answer: "May I use what I remember about you and our past chats to draft your me.md? Yes or no."

If I say yes:
- Draft each section below from your memory of me and our past chats.
- Put "(from memory, please check)" after every fact you take from memory.
- Don't guess. Leave a section empty if you know nothing for it.

If I say no, interview me instead. Ask at most 12 short questions, one at a time, in the order of the sections. I can skip any question, or say "enough" to stop.

The sections, in this order:
- Core: my name, what I do, who it's for, my top 3 goals right now, how I like answers (length, tone, format) and what never to do. About 1,200 characters at most.
- Work: my role, my company or clients, my skills and the tools I use.
- Projects: one line each, with status, next step, an "as of" date and an "expires" date 30 days later.
- Voice: a few lines on how I write: tone, sentence length, words I use and words I avoid. Describe my style. Don't paste my writing.
- Preferences: formats, units, language, spelling, time zone and working hours.
- Background: education, past roles and what I'm known for.
- Life: only if I ask for it.
- Never: topics, claims or styles to avoid.
- Where to look: places to check for live facts instead of copying them, like a notes page, my calendar or my recent posts.
- Sources and dates: where each section came from and when.

Before you show me the file, check it:
- Remove passwords, keys, ID numbers, bank or card details, health details and private facts about other people.
- Date every section. Give Projects an "expires" date.
- Cut Core to about 1,200 characters.

Then show me the whole file in one Markdown block named me.md, and ask me to approve or fix it. When I approve it, give me two next steps: save it in AI Blocks (open Your me.md, then paste or upload it), and set it up in your AI (useaiblocks.com/me-md).
`;
