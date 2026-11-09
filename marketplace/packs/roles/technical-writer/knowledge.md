# Technical writer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked.

## 1. What this role is for

A small business hires a technical writer when people cannot get something to work without help. Customers open the same support tickets every week. A new developer needs the founder on a call to run the project. An API gets sign-ups but few working integrations. A product comes back as a return because the setup steps were confusing.

The job is to turn what experts know into instructions a stranger can follow the first time, and to keep those instructions true as the product changes. The usual deliverables: help centre articles and FAQs, getting-started guides, READMEs and setup guides, docstrings and decision records, API references and quickstarts, release notes, and manuals, quick start cards and assembly steps for physical products.

What good work looks like:

- It starts from a reader and a task: who is reading, what they are trying to do, and what they already know.
- Every fact comes from the product, the code, the spec or a subject expert. Anything unconfirmed is marked, never guessed.
- Steps are numbered, one action each, with what the reader should see after the important ones.
- Each page has one type and one job: learn, do, look up or understand.
- It is accurate against the current version, and someone owns keeping it that way.
- It is plain, scannable, accessible and easy to translate.

How it is judged: whether readers finish the task without help (fewer tickets on the topic, faster time to a first working call, fewer setup returns), whether it matches the product today, and whether experts and new users both trust it.

## 2. The canon

Each idea is summarised in my own words and credited.

**John M. Carroll, *The Nurnberg Funnel* (MIT Press, 1990) [10].** Carroll's research on how people learn software led to *minimalism*: people want to act, not read, so let them start real tasks at once; cut long overviews; build in ways to notice and recover from errors; and treat each section as something a reader may land on alone. Modern help centres and quickstarts are minimalism in practice.

**Daniele Procida, Diátaxis [11][12].** Diátaxis sorts documentation into four types by what the reader needs: *tutorials* (learning by doing), *how-to guides* (doing a real task), *reference* (facts to look up while working) and *explanation* (understanding why) [11]. Mixing types is the commonest structural fault: a tutorial that stops to explain theory, or a reference page full of steps. Procida developed it from earlier work at Divio, first for software product documentation [12].

**Docs as code, as described by Write the Docs [13].** Documentation lives in plain-text markup in version control, changes go through pull requests and review, and automated tests check it, so writers and developers share ownership. Teams can refuse to merge a feature without its docs. Write the Docs lists adoption talks from Google, Microsoft, AWS, the UK Government Digital Service and others [13]. GitHub runs its own documentation this way in a public repository, in Markdown, accepting outside contributions to content files [14].

**The Google developer documentation style guide [1][2][3].** A widely used reference for developer docs. It describes itself as guidelines, not rules, and puts a project's own style first [1]. Its pages on procedures [2] and API reference comments [3] are the most useful starting points for this role. Credited here by name; read it at the source rather than copying it.

**The Microsoft Writing Style Guide [4][5].** Microsoft's online guide replaced the *Microsoft Manual of Style* and covers voice, word choice, bias-free writing and global communication [4]. Its tips for global readers and machine translation are short and practical [5]. Credited by name; read it at the source.

**Plain language, from official sources [6][7][8][9].** In the US, the Plain Writing Act of 2010 requires government content for the public to be written for its audience, and Digital.gov now hosts the federal plain language guides that replaced PlainLanguage.gov [6][7]. In the UK, GOV.UK makes plain English mandatory and gives concrete limits [8]. In the EU, the Commission's translation service publishes *How to write clearly* in 24 languages [9]. ISO 24495-1 is the international plain language standard (named only; iso.org blocks automated reading).

**Knowledge-Centered Service (KCS), Consortium for Service Innovation [23].** KCS treats support knowledge as a by-product of solving cases: capture it while solving, structure it with a simple template, reuse it, and improve it every time it is used (the Solve Loop), then manage content health and measure it (the Evolve Loop) [23]. It is the best-known method for help centres that stay current.

**Michael Nygard, architecture decision records (2011) [22].** Record each significant decision in a short, numbered file in the repository: title, context, decision, status, consequences. Never delete one; mark it superseded [22].

**Nielsen Norman Group on scanning [24].** When a page gives no strong cues, readers scan in an F shape and miss what sits on the right and lower down. Put the key point first, start headings with words that carry information, use lists, and write descriptive links [24].

**Further reading (no claims drawn from these).** Jared Bhatti and co-authors, *Docs for Developers* (Apress, 2021). Mark Baker, *Every Page Is Page One* (XML Press, 2013). Gretchen Hargis and co-authors, *Developing Quality Technical Information* (IBM Press). Standards to know by name only: ISO/IEC/IEEE 26514 (user documentation), IEC/IEEE 82079-1 (instructions for use of products), ANSI Z535.6 (product safety information in manuals, US), ASD-STE100 Simplified Technical English, and OASIS DITA.

## 3. How the work is done now

**Facts first, from the source.** Before writing, list the facts the material supports: commands, settings, variables, ports, versions, button and menu names, part numbers, limits, error codes. Only these go into the docs. Every gap gets a marker such as [to confirm] and goes on a question list for the expert. AI drafting has made this step more important, not less: a fluent page with an invented flag or a wrong button name is worse than a gap.

**Pick the type, then the structure.** Decide whether each page is a tutorial, how-to, reference or explanation [11], and use one template per type.

**Write procedures that work.** Introduce a procedure with a full sentence, number the steps, and generally use one step per action [2]. Say where before what ("In **Settings**, select **Billing**"), put the result in a separate sentence, mark optional steps as optional, and document one accessible method that works by keyboard [2]. Use the product's exact labels, in bold. Write in active voice and present tense [7], and split sentences over about 25 words [8].

**Docs as code.** For software, docs live next to the code in Markdown or another plain-text format, change through pull requests reviewed by an engineer, and build into a site with a preview for each change [13]. A prose linter (for example Vale, which ships Google and Microsoft style packages) catches style slips in review. A README should say what the project does, why it is useful, how to get started, where to get help and who maintains it; GitHub truncates READMEs over 500 KiB and builds an outline from headings, so put long material in separate pages [15].

**API references.** Most HTTP APIs are described in an OpenAPI document; version 3.2.1 is dated 10 September 2026, and its description fields accept CommonMark [16]. The description should generate the reference, so the spec and the docs cannot drift. A complete API reference has:

1. *Overview:* what the API does, base URLs, environments, versioning.
2. *Authentication:* how to get credentials, scopes, expiry, and where keys go (headers, never URLs or chat).
3. *Quickstart:* get access, make one call, see a response, each step with a copyable example.
4. *Endpoints:* for each one, a one-line purpose, method and path, a parameters table (name, location, type, required, default, description), request and response examples, and the errors it can return.
5. *Errors:* a consistent format. RFC 9457 defines a standard JSON error body with type, status, title, detail and instance fields [17]; Google's AIP-193 adds that messages should help a technical user fix the problem and point to troubleshooting docs [18].
6. *Pagination, rate limits, idempotency and webhooks,* where they apply.
7. *Changelog and deprecation policy* (below).

For code-level reference, document every public class and method: what it does first, then parameters, return value, exceptions and required permissions, and for deprecations, name the replacement [3]. In Python, docstrings start with a one-line summary written as a command, then a blank line and detail [21]; other languages have their own conventions (JSDoc, PHPDoc, C# XML comments).

**Release notes and changelogs.** Keep a Changelog sets the common shape: newest version first, an Unreleased section, changes grouped as Added, Changed, Deprecated, Removed, Fixed and Security, and dates as YYYY-MM-DD [20]. Breaking changes get a migration note: what changed, who is affected, the steps to move over, and the date the old behaviour ends.

**Help centres from tickets.** Group tickets by the question they really ask, count each group, and write the biggest first. Title each article the way customers ask it, answer in the first two sentences, then give steps, the result to expect, one common mistake and a way to reach a person. Following KCS, link articles to the cases that use them and fix them whenever someone finds them wrong [23].

**Manuals for physical products.** Write from the specs, the parts list, photos or a prototype and real support questions. One action per step with a picture brief where needed, so words and drawings say the same thing; warnings placed at the step where the hazard arises; a troubleshooting table built from returns. Rules differ by market, and a compliance expert must check safety wording:

- *EU:* manufacturers must supply instructions and safety information in a language consumers easily understand, and importers and distributors must check the language rules of each country of sale [26]. The Machinery Regulation (EU) 2023/1230 applies from 20 January 2027 and sets out when instructions may be supplied in digital form [27].
- *UK (Great Britain):* the General Product Safety Regulations 2005 require consumer products to be safe in normal or reasonably foreseeable use; the government guidance was last updated on 13 December 2024 [19].
- *US:* rules depend on the product category; ANSI Z535.6 is the usual reference for safety messages in manuals (named only). Ask the client's compliance expert which rules apply.

**Accessible and global by default.** WCAG 2.2 requires text alternatives for images (1.1.1), headings and labels that describe their topic (2.4.6), and labels or instructions where users enter data (3.3.2); at its highest level it asks for a simpler version when text needs more than lower secondary reading ability (3.1.5) [25]. For readers whose first language is not English, and for machine translation, keep sentences short, keep words like "that" and "the", use one term per concept and avoid idioms [5].

**Docs for AI tools, as of November 2026.** AI assistants now read documentation on users' behalf. The llms.txt proposal suggests a Markdown index at /llms.txt and clean .md versions of pages; it is a proposal, not a ratified standard [30]. Clear structure, one topic per page, complete examples and accurate OpenAPI descriptions help both people and agents. In Postman's 2025 survey, 24% of respondents said they design APIs with AI agents in mind [29].

## 4. Benchmarks and numbers

Use these to frame expectations, never as targets. Each has a source, a date and a caveat.

- **Developers rely on docs.** In the 2025 Stack Overflow Developer Survey, 67.8% of those who answered the learning question had used technical documentation to learn to code in the past year. For learning AI-related coding, AI tools (52.5%) were used more than technical documentation (42.5%) [28]. *Caveat:* a self-selected survey of Stack Overflow users.
- **API documentation pain.** Postman's 2025 State of the API report (over 5,700 respondents) says 55% struggle with inconsistent documentation and 41% use AI to generate API documentation [29]. *Caveat:* vendor survey; definitions are the vendor's.
- **Literacy and plain English (UK).** GOV.UK states about 1 in 6 adults in England have very poor literacy, and cites a study in which 80% of people preferred clear English for legal documents [8]. *Caveat:* figures as quoted by GOV.UK; check the underlying studies before reusing them in a pitch.
- **Sentence and paragraph limits (GOV.UK).** Split sentences over 25 words; keep paragraphs to five sentences or fewer [8]. *Caveat:* a house rule for public content, a good default elsewhere.
- **Scanning.** The F-pattern was first described in 2006 eyetracking research and was still observed on desktop and mobile in 2017; the article was reviewed in August 2026 [24]. *Caveat:* it describes behaviour on poorly structured pages, not a law.
- **README size.** GitHub truncates README content over 500 KiB [15].

No source I could check gives a trustworthy figure for "tickets saved per article" or "cost per page" for small businesses. Measure the client's own ticket counts by topic before and after.

## 5. Decision rules

- If you do not know who reads the page and what they must do afterwards, ask before writing, because structure follows the task.
- If a fact is not in the material, mark it [to confirm] and ask; never fill it from memory or guesswork.
- If a page mixes learning, doing, looking up and explaining, split it by type [11].
- If a procedure step contains two actions, split it, unless they are one menu path [2].
- If the same question appears in tickets again and again, write or fix that article first, before anything new.
- If docs live away from the code, propose moving them into the repository with review on each change, because docs drift when nobody sees them change [13].
- If an API has an OpenAPI description, generate the reference from it and fix the spec rather than hand-editing the output [16].
- If error responses are inconsistent, document what exists honestly and recommend a single format such as RFC 9457 [17].
- If a change breaks existing users, write a migration note with an end date, not just a changelog line [20].
- If a warning concerns safety, place it at the step where the hazard arises and send the wording to the client's compliance expert [26].
- If a product is sold in several EU countries, confirm the language each country requires before layout [26].
- If an image carries information, give it alt text that says the same thing [25].
- If the content will be translated, write short sentences with one term per concept [5].
- If someone asks you to publish to a live help centre or docs site, do it only with level 3 access and within the agreed limits.

## 6. Common mistakes, and how to spot them

- **Writing from memory, not the source.** Spot it: commands or button names that do not exist in the current product.
- **Mixed page types.** Spot it: a "getting started" page that lists every setting.
- **Steps that hide actions.** Spot it: "Configure the settings and save" with no detail; steps with three verbs.
- **No expected result.** Spot it: the reader cannot tell whether a step worked.
- **Wrong or stale labels.** Spot it: screenshots that do not match the live product.
- **Walls of text.** Spot it: long paragraphs, headings like "Overview" and "Details", links called "click here" [24].
- **API reference without errors or auth.** Spot it: endpoints with only a happy-path example.
- **Docs out of sync with releases.** Spot it: the changelog mentions a feature the docs do not.
- **Secrets in examples.** Spot it: real keys, tokens or customer data in code samples.
- **Warnings only at the front.** Spot it: a safety page at the start of a manual and no warnings at the risky steps.
- **Jargon without definition.** Spot it: terms a new user could not explain, used without a first-use explanation [8].
- **Images as the only carrier of meaning.** Spot it: no alt text; "see the diagram" with no words [25].

## 7. Quality bar: what an expert checks before shipping

1. Is the reader and their task named, and does the page serve that task only?
2. Is every fact traceable to the code, spec, product or a named expert, with open items marked?
3. Does each procedure have numbered steps, one action each, exact labels and expected results [2]?
4. Did someone follow the steps on a clean setup (a new account, a fresh clone, an unboxed product) and succeed?
5. For APIs: are auth, every parameter, examples and errors documented, and do examples run against a test account [16][17]?
6. Is the page type clear, with one heading structure that works as a table of contents [11][15]?
7. Is it plain: short sentences, active voice, defined terms [7][8]?
8. Is it accessible: alt text, descriptive headings and links [25]?
9. Are there no secrets, real customer data or internal-only links?
10. Is there an owner and a review date, and does the changelog match?

## 8. How this role writes

**Deliverables.**

- *Docs plan:* readers, tasks, page list by type, owner and review cadence.
- *Pages:* Markdown (or the client's format), one topic each, with front-loaded titles.
- *API reference and quickstart:* generated from OpenAPI where possible, with runnable examples.
- *Question list:* every [to confirm] item with who can answer it.
- *Test record:* who followed the steps, on what setup, and what failed.
- *Changelog entry and migration notes* for each release.
- *For manuals:* the manual, a picture brief per illustrated step, warnings list for compliance review, troubleshooting table.

**Tone and conventions.** Second person, active voice, present tense. Imperative verbs in steps. Exact UI labels in bold; code, commands and file names in code formatting. Sentence-case headings that say what the section does. Notes to the client separate from the docs.

## 9. Glossary

- **Diátaxis:** a framework of four documentation types: tutorial, how-to guide, reference, explanation [11].
- **Tutorial:** a lesson that teaches by doing a guided task [11].
- **How-to guide:** steps to reach a specific goal for someone who knows the basics [11].
- **Reference:** factual description to look up while working [11].
- **Explanation:** background that helps a reader understand why [11].
- **Minimalism:** an instruction design approach that lets users act at once and recover from errors [10].
- **Docs as code:** writing and reviewing docs with the same tools as software [13].
- **README:** the first file in a project, saying what it is and how to start [15].
- **Docstring:** documentation written inside code for a function, class or module [21].
- **OpenAPI:** a standard, machine-readable description of an HTTP API [16].
- **Endpoint:** one API operation, a method plus a path.
- **Quickstart:** the shortest path from nothing to one working result.
- **Problem details:** the RFC 9457 standard format for API error responses [17].
- **Changelog:** a dated, human-readable list of changes per version [20].
- **Semantic versioning:** MAJOR.MINOR.PATCH version numbers that signal the type of change; a changelog says whether a project follows it [20].
- **Deprecation:** marking a feature for removal, with its replacement and end date.
- **ADR:** an architecture decision record [22].
- **KCS:** Knowledge-Centered Service, a method for capturing and improving support knowledge [23].
- **Plain language:** writing the intended reader can find, understand and use [6].
- **Alt text:** a text alternative for an image [25].
- **Picture brief:** instructions for an illustrator on what a drawing must show.
- **llms.txt:** a proposed Markdown index that helps AI tools read a site [30].

## 10. What changes fast

Re-check at each refresh:

- **OpenAPI releases** and tooling support: spec.openapis.org [16].
- **Style guides:** Google and Microsoft update pages often [1][4].
- **Plain language guidance:** Digital.gov, GOV.UK and EU pages move and change [6][8][9].
- **Accessibility:** WCAG versions and how EU and UK rules point to them [25].
- **EU product rules:** the Machinery Regulation start date and any Commission guidance on digital instructions; Your Europe pages [26][27]; GB product safety guidance [19].
- **Developer and API surveys,** reissued yearly [28][29].
- **AI-facing docs:** the status of llms.txt and documentation platforms' AI features [30].
- **Tools:** docs platforms, help desks and their MCP servers and plans. Check vendor pages before recommending one.

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Ask who reads the page and what they must do afterwards before writing, because structure follows the task. (§5)
- `decision_rule` Split a page that mixes learning, doing, looking up and explaining by type. (§5)
- `decision_rule` When the same question appears in tickets again and again, write or fix that article first, before anything new. (§5)
- `decision_rule` When docs live away from the code, propose moving them into the repository with review on each change, because docs drift when nobody sees them change. (§5)
- `decision_rule` When error responses are inconsistent, document what exists honestly and recommend a single format such as RFC 9457. (§5)
- `check` Someone follows the steps on a clean setup (a new account, a fresh clone, an unboxed product) and succeeds. (§7)
