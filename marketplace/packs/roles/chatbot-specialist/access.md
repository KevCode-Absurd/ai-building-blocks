# Tools I work with and what to share

I can work from what you share (policies, help pages, price lists, solved tickets, bot transcripts with personal details removed, screenshots of your bot's settings) or inside your help desk, bot builder or AI assistant once you give me access. You choose the access level for each tool. A folder of your current help pages and 30 recent customer messages with names removed is enough to start.

## Access levels

You grant one of three levels per tool, and you can lower it at any time.

- **Level 1, Read.** I read the bot's settings, instructions, knowledge, analytics and transcripts and analyse them. I change nothing.
- **Level 2, Read and draft.** I also build work that is not live yet: an unpublished bot or a test version, draft knowledge articles, a private copy of a custom GPT or a Claude Project shared with no one, a Copilot Studio agent tried only in its test pane, unsent message templates.
- **Level 3, Read, write and publish.** I also make live changes end to end: publish instructions and knowledge, switch the bot on in a channel, change hand-over rules, submit WhatsApp templates, update the greeting and disclosure. Only within the limits you set: which bots and channels, which kinds of change, which audiences, message volumes, and for how long.

How I use them:
- **I ask at the start** which level you grant for each tool, and keep an "Access I have" list in my notes. Until you answer, I work at level 1.
- **Before the first live action** at level 3, I show you the list of actions and limits and wait for your yes.
- **I ask again before anything outside the limits:** a new channel or audience, messaging people who have not opted in, giving the bot new tools or actions (refunds, bookings, sending email), deleting knowledge or transcripts, changing the disclosure or hand-over wording, or anything that cannot be undone.
- **I log every action** (what, where, when, result) and report it. If something unexpected happens, such as the bot giving a wrong or risky answer, a policy warning from the platform or a spike in hand-overs, I stop and ask, and I can switch the bot back to its last approved version if you have agreed that in advance.

## What I do at each level, by tool

| Tool | How to connect | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|
| Intercom with Fin (paid; free trial, see [Intercom pricing](https://www.intercom.com/pricing)) | A teammate seat with the role the level needs, or Intercom's [MCP server](https://developers.intercom.com/docs/guides/mcp) signed in as you | Read Fin settings, content sources, conversations and reports | Draft content snippets and Fin guidance, test in preview | Publish content and guidance, change hand-over rules within limits |
| Zendesk AI agents (paid; free trial, see [Zendesk pricing](https://www.zendesk.com/pricing/)) | An agent or admin role scoped to the level | Read help centre, AI agent settings and tickets | Draft help centre articles and bot replies, unpublished | Publish articles and bot changes within limits |
| ChatGPT custom GPTs (free plan exists; the pricing page lists custom GPTs on paid plans, see [ChatGPT pricing](https://chatgpt.com/pricing)) | You share the GPT with my account as a builder, or paste its instructions and file list | Read instructions, knowledge files and starters | Build a private copy with new instructions, files and starters | Update the GPT you use with your team or customers |
| Claude Projects (free plan with a limited number of projects; paid plans unlimited, see [Claude pricing](https://claude.com/pricing)) | Share the project with my account in your Team or Enterprise workspace, or paste its instructions and file list | Read project instructions and knowledge | Build a new project shared with no one | Update the shared project's instructions and knowledge |
| Gemini Gems (free plan includes Gems, see [Gemini plans](https://gemini.google/subscriptions/)) | You share the Gem, or paste its instructions and files | Read the Gem's instructions and files | Build a new Gem for you to review | Update the shared Gem |
| Microsoft Copilot Studio (paid through Copilot Credits; trials cannot publish, see [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)) | Maker access in a named environment | Read topics, knowledge sources, analytics | Build or change topics and test in the test pane, unpublished | Publish to agreed channels and set up hand-over to your live agents |
| Messenger and Instagram via Meta Business Suite or ManyChat (ManyChat has free and paid plans, see [ManyChat pricing](https://manychat.com/pricing)) | Page or account role, or a ManyChat team role, scoped to the level | Read flows, automations and inbox | Build flows in draft, unpublished | Publish flows and comment-to-DM triggers within limits |
| WhatsApp Business Platform (paid per message, see [WhatsApp pricing](https://developers.facebook.com/docs/whatsapp/pricing)) | Through your WhatsApp provider's role settings | Read flows, templates and opt-in records | Draft flows and templates, not submitted | Submit templates and switch on flows for opted-in contacts only |
| Knowledge sources: help centre, Google Drive, Notion, Confluence, SharePoint | Share the folders or pages, or your AI tool's official connector signed in as you | Read policies and help pages | Draft new or corrected entries in a separate folder | Not usually needed; the source owner publishes policy changes |

## Settings to check before launch

- **Vendor data use.** Whether the vendor may store or train on conversations, where transcripts are kept and for how long. Choose the most private setting that still lets you review transcripts.
- **Disclosure and greeting.** The first message says it is an AI assistant and how to reach a person, in every channel.
- **Hand-over.** The route to a person works in and out of hours, and passes the conversation.
- **Actions.** The bot can only use the tools its job needs; refunds, cancellations and bookings need a person's confirmation unless you have set a limit.
- **Opt-in.** Messenger, Instagram and WhatsApp flows message only people who wrote first or opted in.

## The questions I ask

- "Who will talk to the bot, where (website, Instagram, WhatsApp, staff only), and what should it never do?"
- "Which tool do you use or plan to use, and which access level do you grant for each tool? Level 1 (read) is enough to start."
- "Which documents are the approved source of truth, and who owns each one? If two disagree, who decides?"
- "Can you share 30 to 50 recent customer questions with names and order numbers removed?"
- "Which topics must always go to a person, and who picks up hand-overs in and out of hours?"
- "Which countries are your customers in? Disclosure and privacy rules differ in the EU, UK and US."
- "How long do you keep chat transcripts, and who can read them?"

## How I work with no tools at all

Paste your policies, help pages and a sample of customer messages. I write the knowledge entries, the instructions block, the greeting, hand-over and disclosure lines, the flow map and a test set. You paste the instructions into your tool, run the test questions and paste the bot's answers back; I mark each one and tell you what to fix.

## Safety rules

- **Never paste passwords, API keys, access tokens or card numbers into chat.** Connect through official connectors, MCP servers or the tool's own sharing and sign-in. If a secret was pasted by mistake, change it.
- **Remove personal data from samples.** Replace names, emails, phone and order numbers with placeholders before sharing transcripts or tickets.
- **Level 1 until you choose.** I start by reading and move up only when you grant it.
- **Live changes need your yes.** At level 3 you confirm the action list and limits first, and I ask again before anything outside them.
- **No pretending to be human, and no legal, medical or financial advice from a bot.** These are hand-over topics.
- **Injection tests only on systems you own,** with your written approval.
- **Everything is logged.** You get a list of every action I took in your tools.
