# Ethan Marcotte: what he knew and believed

Built from public sources, last checked 2026-10-23. Tagged passages concern public work. All example redesigns, review sheets and career exercises are original applications written by us.

## In one paragraph

Ethan Marcotte is identified by A List Apart as a web designer working at the intersection of design and code. His 2025 interview describes responsive work, design systems and writing about design labor. The dated interview was reviewed for the living status used here; no birth year is asserted. [S1][S5] His 2010 Responsive Web Design article joins flexible grids, flexible images and media queries with a broader argument for adapting to a variable medium. [S2] Later interviews connect that approach to content priorities, working prototypes, specific user conditions and the organization of design work. [S3][S4] His daily value is to stop a team treating one attractive screenshot as the whole experience. The useful question is how content, interaction and responsibility behave when the user's conditions change.

## Core ideas

### 1. Flexibility needs deliberate adaptation

The 2010 article shows that a fluid layout alone can still encounter stress points, such as cramped navigation or images growing too large. Marcotte combines flexible foundations with media queries to adapt the arrangement. It is a historical explanation of a method, not current browser-support evidence or a requirement to copy its old syntax. [S2]

Our original exercise resizes a service page using real headings, long names and an image with meaningful detail. Note the point where the content stops working, not merely a familiar device width. Describe the required change: perhaps a second column no longer leaves readable lines, or a row of links needs another arrangement. The output is a content stress log and a small layout proposal. A breakpoint earns its place by solving an observed problem, rather than because a device category has a conventional number attached to it.

### 2. Start from what users need to know

In the 2022 content-design interview, Marcotte discusses the Boston Globe redesign as a team project where readers needed access to the same information across devices. He links small-screen thinking with asking which information is most valuable, rather than assuming a smaller screen means a lesser user need. [S4]

For our appointment page, list the essential tasks: understand eligibility, find the location, choose a time and know what to bring. Arrange the content so those tasks remain available in a narrow view. Do not hide instructions merely to make a layout fit. If some information becomes secondary, explain why using evidence about the task. Return a priority outline with real text and a reason for each position. This makes content decisions reviewable before a designer spends time polishing a composition that cannot accommodate them.

### 3. Review a working experience early

In the 2014 Q&A, Marcotte describes the growing role of browser prototypes and bringing devices into design reviews. His point is that no single fixed image is the canonical version. The explanation also identifies collaboration between design and development as important to responsive work. [S3]

An original review uses one complete page section with representative content. Ask participants to inspect it at several relevant widths and input conditions, then perform a task. Record problems in terms of the experience: the action becomes hard to find, the label is cut off or the heading no longer matches the reading order. The output is a shared issue list and the next prototype change. It should not become a visual vote on which screenshot each participant prefers. Designers and developers need the same working evidence to discuss the tradeoff.

### 4. Discuss conditions directly instead of guessing from device labels

The 2014 interview challenges using “mobile” as shorthand for a small touchscreen on a poor connection. Marcotte points to screen size, input mode, network quality and processing capability as distinct concerns. His examples show why a device category cannot reliably stand in for all of them. [S3]

Our test matrix lists the conditions relevant to the actual service: narrow viewport, zoomed text, keyboard input and a constrained network scenario. Choose what the task warrants and make untested cases visible. A desktop user may still need keyboard access or have a slow connection. A phone user may have excellent bandwidth. Return a review matrix whose rows state the condition and the user task tested. Do not imply that sampling a few conditions proves universal usability or full accessibility; it is a way to organize evidence and reveal missing work.

### 5. A design system includes relationships and governance

The 2022 interview describes organizations already having an implicit system of products and standards before formalizing a design system. Marcotte discusses shared foundations with room for local needs and the usefulness of principles for evaluating quality. These are his reflections in that conversation, not a single prescribed governance model. [S4]

For our shared form pattern, map which teams use it, which decisions are shared and who can approve a change. Compare a central library update with a locally adapted version. The output is a short ownership and contribution note beside the component example. It explains what must remain consistent, what may vary and where exceptions are discussed. A library can be technically reusable while organizationally difficult to change. The exercise addresses that friction without assuming every team needs a large design-system department or the same release process.

### 6. Write important career boundaries before the moment of pressure

In the 2025 interview, Marcotte credits advice from a friend to write down lines he did not want to cross while circumstances were calmer. He describes using such criteria in a difficult employment decision. This is a personal public account, not universal instruction to resign when work becomes uncomfortable. [S5]

Our career exercise lists the user's non-negotiable practical needs, work they would decline and evidence that would signal a boundary has been crossed. Beside each, write what could be clarified, negotiated or planned before making a decision. The output is a private decision sheet and questions for an appropriate conversation. It should include real constraints such as income, access and support, without pretending the profile can settle them. Calm criteria can support judgment; they do not remove uncertainty or the consequences of acting.

## How he decides

The working sequence reconstructed here is to start with meaningful content and tasks, observe the design under varied conditions and make team decisions against shared principles. The public sources support those concerns without establishing one universal Marcotte process. [S2][S3][S4]

For an original redesign memo, write the user's task, the content required and the conditions that expose difficulty. Build the smallest working example that can reveal the problem. Have design, development and a content owner inspect the same example. Assign each observed issue a decision and owner. If a proposed solution removes information or changes interaction, treat that as a substantive choice rather than a visual adjustment. Return the next prototype and a record of unresolved conditions. The result should make it easier to learn from actual behavior, instead of trying to specify every future screen in advance.

## Where he stood

The original responsive essay treats the web as a medium with variable contexts rather than a fixed page. It also allows that specific audience needs can justify a separate experience. [S2] The later content interview links accessibility and mobile-first thinking with looking beyond one's own default working environment. [S4] His 2025 conversation connects design work with values and the conditions under which people perform it. [S5]

An original life application is a community event page. Ask what someone needs while planning at home and what they need while arriving: time, address, access information and a contact route. Preserve the essentials across screen sizes and supply a useful printable or saved version when the task calls for it. This transfers the context question to a volunteer's everyday work. It does not assume a responsive layout alone makes the event or its information accessible.

## Their work and record

A List Apart records Marcotte's 2010 article and other design writing. Its author page is useful for publication history, but its old claim about the latest book is not treated as current. [S1] The 2014 Q&A discusses responsive projects and the second edition of Responsive Web Design. [S3] The 2025 interview identifies his later design-system work and writing about labor. [S5] This profile uses actual article passages and interview answers rather than labeling show notes as his own words. His personal site returned an access error during research and is not listed as an independently read source.

## Where he was wrong or criticised

The checked material does not establish a particular external criticism to repeat. A useful qualification is inside the responsive argument: different user goals can sometimes justify different experiences. [S2] Responsive design is therefore not a universal answer that removes audience research. The 2014 interview also treats performance as a planning issue, rather than assuming flexibility automatically produces a fast site. [S3]

Our application should challenge several overclaims. A page that resizes neatly may still have an inaccessible control, excessive downloads or missing essential content. A browser prototype that works in one environment does not certify every browser. A shared component can spread a bad pattern as efficiently as a good one. These are questions for the actual implementation and users. Use the historical method to organize investigation, then obtain current evidence for any present compatibility, conformance or performance claim.

## Blind spots to watch

This profile is particularly useful for layout reasoning, content priority and collaboration around an adaptable experience. It supplies less detail for diagnosing a low-level rendering defect or conducting a complete accessibility audit. Identify when the task needs another specialty and preserve the relevant evidence for that handoff.

Career applications also need care. A public account of one person's decision does not reveal the user's finances, contractual duties or support network. Help articulate criteria and practical next conversations rather than borrowing the author's authority to make the decision for them. Keep the profile's compassion concrete through the work and its consequences, not through a reassuring tone alone.

## Short phrases on the record

No direct quotations are used. The test matrices, content outlines and decision sheets are original applications.
