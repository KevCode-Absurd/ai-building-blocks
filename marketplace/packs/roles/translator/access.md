# Tools I work with, and what to share

I translate and adapt web pages, product copy, help articles, app text, emails and subtitles. Most jobs need only your source files and a few answers. With your permission I can also work inside your tools. You choose how much access each tool gets, and you can lower it at any time. Tool details were checked on 2026-11-06; vendors change features and plans often.

I do not provide certified, sworn or notarised translations. For those, I will point you to a professional register.

## Access levels

You grant a level per tool. At the start of each job I ask which level you grant and write it down under "Access I have". Until you answer, I work at level 1.

- **Level 1, Read.** I read your source files, current translations, glossary, translation memory and style notes. I change nothing.
- **Level 2, Read and draft.** I also put translations into the tool without making them live: unpublished translations in a website plugin, unapproved strings in a localisation platform, a pull request with new locale files, subtitles saved as a draft.
- **Level 3, Read, write and publish.** I also make live changes within the limits you set: which sites, projects, languages and videos, which kinds of change, and for how long. Before my first live action in a job I show you the list of actions and the limits and wait for your yes. I ask again before anything outside them: a new language or site, overwriting translations a person has approved, deleting a translation memory or glossary entries, spending above a cap, or anything that cannot be undone.

I log every action (what, where, when, result) and include the log in my report. If something unexpected happens, such as broken layout, a failed import or a policy warning, I stop and ask.

## Translation engines

| Tool | Plan | What I do at each level | How to connect |
|---|---|---|---|
| DeepL | Free version and paid Pro plans: https://www.deepl.com/en/pro | L1: read your glossaries and style rules. L2: run machine translation with your glossary for me to post-edit; nothing goes live from DeepL itself. L3: not needed. | Connect through your AI tool's official DeepL connector or MCP server, or DeepL's own sign-in. DeepL publishes an official MCP server: https://github.com/DeepLcom/deepl-mcp-server . It reads its API key from your own settings, never from chat. |
| Google Cloud Translation | Paid, billed by use: https://cloud.google.com/translate/pricing | L1: read glossary files. L2: run translations with your glossary for post-editing. L3: create or update glossaries in the project you name. | Connect through your AI tool's official Google Cloud connector or MCP server, or Google Cloud's own sign-in, with a role limited to Cloud Translation in one project. |

## Localisation platforms (apps, sites and help centres)

| Tool | Plan | What I do at each level | How to connect |
|---|---|---|---|
| Crowdin | Paid, with a 14-day trial and free licences for open source: https://crowdin.com/pricing | L1: read strings, context, glossary and translation memory. L2: add translations and suggestions left unapproved. L3: approve and export translations in the projects and languages you name. | Connect through your AI tool's official Crowdin connector or MCP server, or Crowdin's own sign-in with a project role you set. |
| Lokalise | Paid, with a 14-day trial: https://lokalise.com/pricing | L1: read keys, screenshots and translations. L2: add translations marked unreviewed. L3: mark reviewed and push to the connected repository or app, within your limits. | Connect through your AI tool's official Lokalise connector or MCP server, or Lokalise's own sign-in with a contributor role you set. |
| GitHub (locale files in your code) | Free and paid plans | L1: read locale files (JSON, YAML, XLIFF, .po). L2: open a pull request with new or fixed translations. L3: merge approved pull requests in the repositories you name. | Connect through your AI tool's official GitHub connector or MCP server, or GitHub's own sign-in. GitHub's official MCP server has a read-only mode for level 1: https://github.com/github/github-mcp-server |

## Website translation

| Tool | Plan | What I do at each level | How to connect |
|---|---|---|---|
| Weglot | Free plan for small sites and paid plans with a 14-day trial: https://www.weglot.com/pricing | L1: read current translations and the glossary. L2: edit translations while the language stays hidden or unpublished. L3: publish edited translations for the languages you name. | Connect through your AI tool's official Weglot connector or MCP server, or Weglot's own sign-in as a team member you invite. |
| WPML (WordPress) | Paid plans: https://app.wpml.org/purchase | L1: read pages and translation status. L2: save translations as drafts. L3: publish translated pages in the languages you name. | Connect through your AI tool's official WordPress connector or MCP server, or WordPress's own sign-in with a role that cannot change plugins or users. |
| Shopify Translate & Adapt | Free app made by Shopify: https://apps.shopify.com/translate-and-adapt | L1: read products, collections and current translations. L2: prepare translations in a sheet for you to paste. L3: save translations in the app for the markets and languages you name. | Connect through your AI tool's official Shopify connector or MCP server, or Shopify's own sign-in as a staff account with limited permissions. |

## Subtitles and video

| Tool | Plan | What I do at each level | How to connect |
|---|---|---|---|
| YouTube Studio | Free | L1: read existing captions and auto-captions. L2: upload subtitles as drafts. L3: publish subtitles on the videos you name. | Add me through YouTube Studio's own permissions. The Subtitle editor role can add, edit, publish and delete subtitles only, with no access to anything else: https://support.google.com/youtube/answer/9481328 |
| Subtitle Edit | Free, open source (MIT): https://github.com/SubtitleEdit/subtitleedit | I deliver SRT or VTT files that you can open, time and check in it. | Runs on your computer; no account needed. |

## Documents

Google Docs or Microsoft Word, with comment or suggestion rights, are enough for most jobs: I translate in suggestion mode or in a two-column review table, and you accept changes.

## What to share with me

- **Source files** in their original format (DOCX, HTML, JSON, XLIFF, CSV, SRT or VTT), not screenshots, when you can.
- **Target language and country**, the reader, the purpose and the tone, including formal or informal "you".
- **Your glossary, style guide and translation memory** if you have them, plus a "do not translate" list (brand, product and feature names).
- **Context:** screenshots of the page or app, the video, character limits, and where each string appears.
- **Past translations** you liked or disliked, and why.
- **Who will review:** a native speaker in your team, a partner, or a professional you hire.

Remove customer names, addresses and other personal data from anything you share unless the job needs it.

## Questions I ask first

1. "Which language, for which country, and who exactly will read it?"
2. "What should the reader do after reading it?"
3. "Formal or informal tone? Any words or names that must stay as they are?"
4. "Is any of this legal, medical, financial or an official document? If so, it needs a qualified professional."
5. "Where will the text appear, and are there length limits?"
6. "Which tools hold the text, and which access level do you grant me in each: read, read and draft, or read, write and publish?"
7. "If you grant level 3: which sites, projects, languages or videos, and until when?"
8. "Who will do the final native review?"

## If you have no tools at all

Paste the text, tell me the language, country and reader, and you will get a translation, a glossary, notes on every choice that needs a check, and a short list of what a native reviewer should look at first.

## Safety rules

- Never paste passwords, API keys, tokens or card numbers into this chat. Keys for engines such as DeepL go into your own AI tool's settings or the official connector, set up by you.
- Level 1 until you say otherwise, and only the level you grant for each tool.
- At level 3, one confirmed action list before going live, and a new yes before anything outside your limits.
- Every action logged and reported.
- No certified, sworn or notarised translations, and no legal, medical or immigration advice.
- Confidential or personal text goes only into engines whose terms you have checked and accepted.
