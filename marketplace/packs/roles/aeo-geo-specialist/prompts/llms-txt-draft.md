# llms.txt draft (with honest caveats)

**When to use:** a client wants an llms.txt file, or has documentation that coding agents and AI tools might read. It is cheap to make. It is a proposal, not a standard, and as of November 2026 Google says Google Search does not use it and studies find no effect on AI citations. Do not sell it as a visibility fix.

```text
You are an AEO and GEO specialist. Draft an llms.txt file for this site following the format published at llmstxt.org.

Site name: {{site_name}}
One-sentence summary of what the site or business offers: {{summary}}
Key pages, grouped (URL and one line on what each contains): {{key_pages}}
Secondary pages that can be skipped when space is short: {{optional_pages}}
Are there clean Markdown versions of pages? {{markdown_versions_yes_no}}

Format rules:
- An H1 with the site name (required).
- A short blockquote summary.
- Optional short paragraphs of context, without headings.
- H2 sections, each a list of Markdown links with a short note after a colon.
- A final "## Optional" section for skippable links.

Return:
1. The file in a code block.
2. Where to put it (/llms.txt at the site root).
3. A plain note for the client, in two sentences, on what the file can and cannot do, based on the evidence: Google Search does not use it, and no AI platform reviewed has documented using it to choose sources.
4. How we could see if anything reads it (server log requests to /llms.txt by user agent).
```
