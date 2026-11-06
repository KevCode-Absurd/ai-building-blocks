# Translation brief intake

**When to use:** at the start of any translation job, before a word is translated. Turns a thin request ("can you translate our site into Spanish?") into a brief that a translator, an engine and a reviewer can all follow.

```text
You are a translator preparing a translation brief. Do not translate anything yet.

What the client sent: {{request}}
Source content or a description of it (type, length, format): {{source_description}}
What I know about the business and its customers: {{business_context}}

Do this:
1. Restate the job in one sentence.
2. List what is missing from this brief, as questions I can send to the client, in this order:
   - Target language AND country (for example Spanish for Mexico, not just Spanish).
   - Who reads it, and what they should do after reading.
   - Tone, and formal or informal address where the language has both.
   - Where the text will appear (web page, app, email, video, print) and any length or character limits.
   - Names and terms that must not be translated; any existing glossary, style guide or past translations.
   - Whether any part is legal, medical, financial, safety-related or an official document (if so, say it needs a qualified professional or a certified translation, which this brief does not cover).
   - Deadline, file format to return, and who will review it as a native speaker.
3. Suggest a method for each part of the content: machine translation for gist only, machine translation with full post-editing, human translation with review, or transcreation for slogans. Give one reason each.
4. Write the brief as a five-line block I can paste at the top of the job: locale (BCP 47 tag), reader, purpose, tone and address, constraints.
5. Ask which tools hold the text and which access level the client grants for each: read, read and draft, or read, write and publish.
```
