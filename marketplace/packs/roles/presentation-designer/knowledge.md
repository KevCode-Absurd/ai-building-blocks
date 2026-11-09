# Presentation and layout designer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked.

## 1. What this role is for

A presentation and layout designer arranges words, numbers and images on slides and pages so people can follow them, fill them in or pick them off a shelf. The role covers four kinds of work that share one craft:

- **Slides:** pitch decks, sales decks, talks, webinars, training decks and the company template everyone else builds from.
- **Documents for reading and filling in:** workbooks, worksheets, checklists, lead magnets, ebooks and creator media kits.
- **Book covers:** front, spine and back for print, the ebook cover, and briefs for the illustrator or AI art.
- **Business forms:** job sheets, order forms, inspection forms, intake and feedback forms, on paper or online.

Who hires it: founders with a text-heavy pitch, consultants and speakers, small teams where every deck looks different, coaches and creators selling PDFs, self-published authors, and trades or clinics whose forms come back half-filled.

What good work looks like:

- Each slide or page makes one point the audience gets at a glance. Duarte's Glance Test asks whether people grasp a slide's main point in 3 seconds or less [2].
- Every word, number, logo and quote comes from the client's brief. Nothing is invented to fill a layout.
- It builds cleanly in the client's tool and passes the printer's or platform's file checks first time.
- People can use it: read it from the back of the room, fill in the box by hand, find the field on a phone, read it with a screen reader.
- A team can reuse it: named layouts, a type scale and colour roles, with notes on when to use each.

How it is judged: by whether the audience understood and acted (the pitch got a second meeting, the form came back complete, the cover reads at small size in an online store), by how quickly the client's team can build from the template, and by first-time acceptance at the printer or store.

## 2. The canon

These are the ideas practitioners lean on, summarised in my own words and credited.

**Nancy Duarte, *slide:ology* and *Resonate* [1][2].** Visual thinking is a skill that can be learned. A slide is a glance medium, not a document: if the audience must read, they stop listening. Duarte's *Resonate*, taught as a course at Stanford's business school, adds the story shape behind a talk [1]. Her Glance Test is the quickest check in the trade: one point per slide, contrast and white space pointing at it, and visuals that support it rather than decorate [2].

**Garr Reynolds, *Presentation Zen* [3].** Simplicity and restraint: cut what does not serve the message, plan the story away from the software first, and let speaker and slides do different jobs. Detail belongs in a handout or the speaker notes, not on the slide.

**Michael Alley and the assertion-evidence approach (Penn State) [6].** Replace the default topic heading and bullet list with a sentence headline that states the takeaway, supported by visual evidence (a photo, diagram or chart). The headline tells the audience what to conclude; the visual shows why.

**Edward Tufte, *The Visual Display of Quantitative Information* (1983; 2nd edition 2001) and *The Cognitive Style of PowerPoint* [4][5].** Show the data, not decoration: maximise the ink that carries data, use small multiples to compare like with like, and watch for designs that make the data look bigger or smaller than it is [4]. Tufte also argues that slideware templates and fragmented bullets often weaken the reasoning in a presentation [5]. The working lesson: when the argument is complex, send a document and use slides to discuss it.

**Richard E. Mayer, multimedia learning [7].** Over more than 100 experiments, Mayer and colleagues arrived at 12 design principles for learning from words and pictures [7]. The ones designers use most, in my words: cut extra material that does not support the point (coherence); highlight what matters (signalling); do not put the same words on screen that the speaker is saying (redundancy); put labels next to the parts they describe (spatial contiguity); and break complex material into steps (segmenting).

**Barbara Minto, *The Pyramid Principle* (written 1987, reissued 2002) [8].** Lead with the answer, then group the supporting points under it, and open with situation, complication and question [8]. A deck's headlines, read in order, should tell the whole story on their own.

**The Financial Times Visual Vocabulary [9].** Pick a chart by the relationship you want to show: deviation, correlation, ranking, distribution, change over time, magnitude, part-to-whole, spatial or flow. Column charts must start at zero [9].

**Caroline Jarrett, *Forms that Work* [11], and the GOV.UK Design System [12].** A form is a conversation: ask only what you need, in the order people think about it, in words they understand. GOV.UK's patterns put it into rules: one thing per page online, know why you ask each question, mark optional fields "(optional)" rather than using asterisks, and keep hint text to one short sentence [12].

**Pitch structure: Sequoia Capital [10].** Sequoia's outline for a business plan is a common spine for pitch decks: company purpose, problem, solution, why now, market potential, competition, business model, team, financials, vision [10]. It sets order, not slide count.

## 3. How the work is done now

**Intake for any job.** Collect the content (final text, data, images), the audience and where they meet it (a room, a call, a phone, a printed page, a shop thumbnail), the tool that will build the final file, the brand (colours as hex, fonts and their licences, logo files), the output specs (slide size, page size, printer or store specs), and the access level for each tool (see access.md).

**Slides (as of November 2026).**

- *Size and set-up.* New PowerPoint decks default to widescreen 16:9 at 13.333 x 7.5 inches; changing size later forces a choice between Maximize and Ensure Fit, which can break layouts, so set the size first [17].
- *Masters and layouts.* A template is a set of named layouts (title, section, statement, two-column, chart, image, quote, closing) built on the slide master. Built-in layouts also give screen readers a consistent reading order [16].
- *Type.* Microsoft's accessibility guidance asks for 18 pt or larger text and sans serif fonts, and warns against all capitals and heavy italics or underlining [16]. Rooms, screens and distances vary, so test at the real size.
- *Contrast.* WCAG 2.2 asks for at least 4.5:1 contrast for normal text and 3:1 for large text, which it defines as 18 pt, or 14 pt bold [19].
- *Accessibility basics.* A unique title on every slide (it can sit off the slide if hidden), alt text on meaningful images, decorative images marked as such, colour never the only cue, a checked reading order, captions on video, and the Accessibility Checker run before saving as PDF [16].
- *Fonts.* Embedding a font keeps the look on machines that lack it, but font makers set whether a font can be embedded at all (non-embeddable, preview and print, editable, installable). Embed all characters if others will edit [18].
- *Charts.* Use the client's numbers only. Choose by the point (FT Visual Vocabulary [9]), title the chart with its takeaway (assertion-evidence [6]), and cut gridlines, 3D and legends where direct labels will do [4].
- *Pitch decks.* Follow a clear spine such as Sequoia's [10], with each headline stating a claim the next slide supports. No invented market sizes, logos or traction.
- *Talks.* Big type, one idea per slide, images and charts doing the work, and the detail moved into speaker notes [3][7].

**Workbooks, lead magnets, ebooks and media kits.** Plan pages before styling: cover, how to use, sections, worksheets, closing page with the call to action, every page numbered. Set a style system (margins, grid, type scale with font names, heading styles, colour roles in hex, callout boxes, line spacing). Size writing spaces for real handwriting, keep home-printed pages light on ink, and list each field of a fillable PDF with its type and size so whoever builds it in their PDF editor can add it. For media kits, place only the audience numbers, partners and rates the client gives. For accessible PDFs, plan the reading order and alt text before export. E-books are within the scope of the EU's European Accessibility Act [20], so ebooks sold in the EU need accessibility checked with the publisher or distributor; the UK and US have their own rules to check.

**Book covers (as of November 2026).**

- *Amazon KDP paperbacks:* spine width = page count x 0.002252 in for white paper, 0.0025 in for cream, 0.002347 in for premium colour and 0.002252 in for standard colour; bleed of 0.125 in (3.2 mm) on the top, bottom and outside edges; spine text only for books over 79 pages; one PDF with back, spine and front; images at 300 DPI; CMYK; KDP adds a barcode if you do not supply one [21]. KDP's cover calculator gives the exact size and a template from the binding, paper, trim and page count [22].
- *KDP ebooks:* ideal cover 2,560 x 1,600 px (height to width 1.6:1), minimum 1,000 x 625 px, JPEG or TIFF, RGB, under 50 MB; add a thin grey border to very light covers; the author must hold the rights to everything on it [23].
- *IngramSpark (File Creation Guide dated 24 August 2026):* PDF/X-1a:2001 or PDF/X-3:2002; 0.125 in (3 mm) bleed on the three trim edges; 300 ppi; CMYK with total ink no higher than 240%; use the cover template generator from the dashboard, and do not resize the barcode it places; ebooks in EPUB 3.0 [25].
- *AI cover art:* KDP asks authors to disclose AI-generated images when publishing, even after substantial edits [24]. In the US, prompts alone do not make AI output protectable by copyright; human creative changes or arrangement can be [26]. So a cover built mostly from AI art may give the author weaker rights in the image; the type, layout and any hand-made changes are where human authorship sits.
- *Genre signals:* readers judge a cover in a glance at small size. Describe what the genre expects (type style, image type, colour mood) in words, and never copy a real cover.

**Business forms.** List every field with its label, type, options, required or optional, check rule and help text, grouped in the order people fill it in. Label every control, with labels to the right of checkboxes and radio buttons and above or left of other fields [13]. Online: one thing per page where it helps, ask each thing once, mark optional rather than required, short hint text, plain error messages [12]. Use the tool's own checks: Google Forms validates numbers, text, length and patterns and shows your error text [14]; Jotform can show, hide, require or skip fields and route emails by answer [15]. Leave a marked space for legal, consent or terms wording the client supplies, never write it; and ask only for personal data the form needs [12]. Never design a form that collects card numbers or passwords.

**AI tools inside design tools (as of November 2026).** Canva's MCP server lets an AI assistant create and edit designs, search a user's designs, use brand kits and templates, and export PDF, PNG, JPG, PPTX or MP4 [27]. Figma's MCP server can write native content to the canvas, including Figma Slides, as a beta that is free for now and will become a usage-based paid feature [28]. Google Slides work happens through Drive sharing: Viewer, Commenter or Editor, and owners can stop editors re-sharing [29].

## 4. Benchmarks and numbers

These are platform rules and research findings, each with its date and caveat. There is no reliable public benchmark for "ideal slide count" or "words per slide"; use the time slot and the Glance Test instead.

- **3 seconds** for the Glance Test (Duarte) [2]. *Caveat:* a practitioner rule of thumb, not a measured study.
- **4.5:1 and 3:1** minimum contrast for normal and large text (WCAG 2.2 AA) [19]. *Caveat:* a web standard, widely used for slides and PDFs; projectors in bright rooms need more.
- **18 pt or larger** text (Microsoft accessibility guidance) [16]. *Caveat:* a floor for readable documents and slides, not a target for a large room.
- **16:9, 13.333 x 7.5 in** PowerPoint default [17].
- **12 principles from more than 100 experiments** (Mayer) [7]. *Caveat:* mostly lab studies of learning, which carry over best to training and teaching decks.
- **KDP:** spine factors per page and 0.125 in bleed [21]; ebook cover 2,560 x 1,600 px ideal [23]. **IngramSpark:** 0.125 in (3 mm) bleed, 300 ppi, 240% total ink [25]. *Caveat:* printers change specs; always use the current calculator or template for the exact book.

## 5. Decision rules

- If a slide carries two messages, split it; if it carries none, cut it or merge it, because each slide should pass a 3-second glance [2].
- If the topic heading is a label ("Results"), rewrite it as the takeaway ("Repeat orders doubled after the price change"), because the headline should say what to conclude [6].
- If the speaker will say it, take it off the slide and put it in the notes, because on-screen text that repeats speech gets in the way [7].
- If the point is change over time, use a line; comparing amounts, a bar or column starting at zero; a single fact, one big number; part of a whole with few parts, a stacked bar or simple pie, because the chart should match the relationship [9].
- If the audience must study detail (a board pack, a complex model), send a document and use slides to discuss it, because slides fragment complex reasoning [5].
- If the deck will be shared without the speaker, add a short "read-alone" version or speaker notes, because the presented version will not stand on its own.
- If text fails the contrast check, change the colours, not the font weight, because the ratio is what counts [19].
- If the client's font cannot be embedded or licensed for the use, pick a fallback now and name it in the build notes [18].
- If the page count is missing for a print cover, ask for it before laying out the spine, because spine width depends on it [21][25].
- If the book is under 80 pages on KDP, keep the spine free of text [21].
- If the printer offers a template, lay out to it, because the printer's rule beats any general rule [22][25].
- If cover art is AI-generated, tell the author to disclose it on KDP and explain the weaker copyright position [24][26].
- If a form asks for something nobody uses, cut it; if people type the same answers again and again, turn it into options [12].
- If a field is optional, label it "(optional)"; do not mark required fields with asterisks [12].
- If a form needs legal, consent or terms wording, leave a labelled space for the client's approved text.
- If a number, logo, quote or partner is not in the brief, mark it [add] instead of inventing it.

## 6. Common mistakes, and how to spot them

- **The document deck.** Spot it: full sentences in bullets, nine-point footnotes, the speaker reading the slides.
- **Topic headlines.** Spot it: read the headlines alone and they say nothing ("Overview", "Market", "Next steps").
- **Decoration over data.** Spot it: 3D charts, gradients behind numbers, a legend you must match by colour [4].
- **Truncated axes that exaggerate.** Spot it: a column chart whose axis starts above zero [9].
- **Low contrast.** Spot it: grey text on photos, brand colours that fail 4.5:1 [19].
- **No reading order.** Spot it: a screen reader reads the footer first; slides without titles [16].
- **Fonts that vanish.** Spot it: the deck looks different on the client's laptop; boxes instead of characters [18].
- **Wrong spine.** Spot it: spine width typed from memory, not the calculator; text on a thin spine [21][22].
- **Missing bleed or wrong colour mode.** Spot it: background stops at the trim line; an RGB cover sent for print [21][25].
- **A copied cover.** Spot it: the brief says "make it look like that bestseller".
- **Forms that ask too much.** Spot it: date of birth on a feedback form; free text where a tick box would do [12].
- **Asterisk soup.** Spot it: every field marked required, half of them not really [12].
- **Writing spaces too small.** Spot it: print a page and try writing an address in the box by hand.
- **Invented proof.** Spot it: placeholder logos, made-up follower counts, a testimonial nobody gave.

## 7. Quality bar: what an expert checks before shipping

1. Does every slide or page pass the Glance Test: one point, readable in 3 seconds [2]?
2. Read the headlines alone: do they tell the whole story in order [8]?
3. Is every number, logo, quote and name from the brief, with gaps marked [add]?
4. Do charts match the point, start at zero where needed, and carry a takeaway title [9]?
5. Contrast meets 4.5:1 (normal) and 3:1 (large) [19]; text is 18 pt or larger in documents and much larger for rooms [16].
6. Slide titles, alt text, reading order and the Accessibility Checker are done [16].
7. Fonts are licensed for the use and embedded or with named fallbacks [18].
8. Print files match the current printer spec: size from the calculator or template, bleed, colour mode, resolution, PDF standard [21][22][25].
9. Forms: every field has a label, a reason and a type; optional marked; legal text left for the client [12][13].
10. Build notes let someone else rebuild the file in the named tool, and the access log matches what was done.

## 8. How this role writes

**Deliverables.**

- *Layout plan:* a table per slide or page with number, headline (the one message), layout type, zones and what goes in each, visual or chart spec, speaker notes or reader notes.
- *Style system:* page or slide size, grid and margins, type scale (title, headline, body, caption, with font names and sizes), colour roles in hex with contrast results, image rules, icon and callout styles.
- *Master layout list:* name, when to use it, zones, and a one-line example.
- *Cover spec:* trim, page count, paper, spine width with the formula used, full wrap size with bleed, zones and type sizes for front, spine and back, barcode area, the printer's file checklist.
- *Artist or AI brief:* scene, mood, colours, space for title, full wrap size, rights questions.
- *Form build table:* field, label, type, options, required or optional, check rule, help text, show-if rule.
- *Build notes:* step by step in the client's tool, with fonts, fallbacks and export settings.

**Tone and conventions.** Plain, exact and measurable: sizes in points, pixels, millimetres or inches, colours in hex, and one decision per line. Notes to the client sit apart from the content placed on the page.

## 9. Glossary

- **Glance Test:** can the audience get the slide's point in 3 seconds or less [2].
- **Assertion-evidence:** a sentence headline stating the takeaway, supported by visual evidence [6].
- **Slide master and layouts:** the base slide and the named arrangements built from it.
- **Type scale:** the fixed set of sizes for title, headline, body and caption.
- **Grid:** the columns and margins that every element lines up to.
- **Colour roles:** colours named by job (text, background, accent, warning), each with a hex value.
- **Contrast ratio:** the difference in brightness between text and background, written as a ratio such as 4.5:1 [19].
- **Alt text:** a short description of an image for people who can't see it [16].
- **Reading order:** the order a screen reader moves through items on a slide or page [16].
- **Data-ink:** the ink in a chart that shows data, as against decoration [4].
- **Small multiples:** a series of small charts with the same scale, for comparison [4].
- **Trim size:** the finished page size of a printed book.
- **Bleed:** extra image beyond the trim line, cut off in printing, so colour reaches the edge [21].
- **Spine width:** the thickness of the book's spine, set by page count and paper [21].
- **Full wrap:** back cover, spine and front cover laid out as one image, plus bleed [21].
- **CMYK and RGB:** the colour modes for print (ink) and screens (light).
- **DPI or PPI:** dots or pixels per inch; print images usually need 300 [21][25].
- **PDF/X:** PDF standards for print files, such as PDF/X-1a:2001 [25].
- **EPUB:** the standard ebook file format; IngramSpark asks for EPUB 3.0 [25].
- **Hint text:** a short line under a form label that helps people answer [12].
- **Conditional logic:** rules that show, hide or require fields based on earlier answers [15].
- **Response validation:** a form rule that checks an answer's format and shows an error if it fails [14].
- **Fillable PDF:** a PDF with fields people can type into on screen.

## 10. What changes fast

Re-check at each refresh:

- **Printer and store specs:** KDP cover, ebook and AI content pages and the cover calculator [21][22][23][24]; IngramSpark's File Creation Guide [25].
- **Tool connectors:** Canva's and Figma's MCP servers, plans and beta status [27][28]; Google Drive sharing [29].
- **Office features:** PowerPoint slide size, accessibility and font embedding guidance [16][17][18].
- **Accessibility rules:** WCAG versions [19] and the European Accessibility Act's guidance for e-books [20].
- **Form tools:** Google Forms and Jotform logic and validation [14][15]; GOV.UK Design System patterns [12].
- **AI and copyright:** US Copyright Office AI guidance for cover art [26].
- **Pitch structure** advice from investors such as Sequoia [10].

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Split a slide that carries two messages, and cut or merge one that carries none, because each slide should pass a 3-second glance. (§5)
- `decision_rule` Rewrite label headings ("Results") as the takeaway ("Repeat orders doubled after the price change"), because the headline should say what to conclude. (§5)
- `decision_rule` If the speaker will say it, take it off the slide and put it in the notes, because on-screen text that repeats speech gets in the way. (§5)
- `decision_rule` When the audience must study detail (a board pack, a complex model), send a document and use slides to discuss it, because slides fragment complex reasoning. (§5)
- `decision_rule` If the deck will be shared without the speaker, add a short read-alone version or speaker notes. (§5)
- `decision_rule` Label optional form fields "(optional)" rather than marking required fields with asterisks. (§5)

## 12. Defaults to avoid

An AI model with no context falls back on these choices, so they make work look like everyone else's. Avoid each one unless the client's captured brand or the agreed plan chooses it on purpose, and then say why. The full shared list is in tools/ai-default-patterns.md.

- **Same slide template every time.** A centred title, then three cards, then a "how it works in 3 steps" slide, whatever the content. Choose each layout from that slide's one message.
- **Purple or blue gradients.** Gradient backgrounds as the default "modern" look. Use the client's palette and template.
- **System fonts in place of the brand font.** Inter, Geist or a default font replacing the client's typeface. Use the brand font, or name a fallback in the build notes (section 5).
- **Emoji icons.** Emoji standing in for icons on bullets and cards. Use the client's icon style or none.
- **Glassmorphism and rounded cards everywhere.** Frosted panels and rounded cards around every block of text. Let the headline and the grid carry the hierarchy.
- **Generic stock-style images.** Stock photos of handshakes, laptops or skylines. Use the client's real images, a chart, or nothing.
- **"Trusted by" rows with no logos.** A logo strip with placeholders or partners nobody supplied. Use only logos in the brief and mark gaps [add] (section 5).
- **Build animation on every slide.** Every element fading up in turn, the deck version of fade-up on every block. Animate only where it helps the speaker reveal a point.
- **Dropping the client's master.** Rebuilding the deck in a fresh template instead of the client's master layouts. Work inside their masters, the way a website keeps the client's nav and footer.
