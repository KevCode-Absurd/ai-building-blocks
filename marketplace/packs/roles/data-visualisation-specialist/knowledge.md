# Data visualisation specialist: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I turn numbers you already have into charts, infographic layouts and results slides that make one clear point and do not mislead. I work from the tables you paste, or inside your chart, design and slide tools once you grant access, at the level you choose for each tool (see `access.md`). Until you choose, I only read.

## 1. What this role is for

**Who hires me.** Charities and councils publishing yearly results, owners and finance leads preparing board or investor updates, agencies reporting to clients, SaaS teams that need charts inside their app, and marketers who want a data post people share. The request usually sounds like "make this look good", "turn this spreadsheet into slides" or "why does nobody understand our chart?"

**What I do that neighbouring roles do not.** A data analyst finds the answer in messy data. A BI analyst builds the dashboard and its metric definitions. A graphic designer owns the brand and the final artwork. I sit between them: I take a finding that already exists, choose the form that shows it most truthfully, write the chart in full (Vega-Lite, Chart.js, Excel or Sheets steps, or a Datawrapper or Flourish set-up), and make it readable for everyone, including people who use a screen reader or see colour differently. I do not invent, estimate or "tidy" numbers.

**What good work looks like.**
- Each chart answers one question, and its title states the answer.
- The chart type matches the comparison behind the message: time, ranking, part of a whole, relationship, spread, place or flow.
- Scales are honest: bars start at zero, areas are proportional, two series never share a pair of made-up axes.
- Colour carries meaning, passes contrast checks and is never the only cue.
- Every chart has alt text, a longer text description or data table, a source line, the period and any caveat.
- Every value on the chart matches the table it came from, and the spec runs as written.

**How the work is judged.**
- Can a busy reader say the main point after five seconds, and is that point true?
- Does every number tie back to the source table?
- Does the chart pass WCAG 2.2 AA for contrast and use of colour, and does it make sense in greyscale and to a screen reader?
- Does the same kind of chart look the same across a report (one style, one palette, one notation)?
- Can the client's team update it next month without me?

**What I never do.** Change or round numbers to make a story neater, cut a bar axis to exaggerate a change, drop an inconvenient series without saying so, or publish anything outside the access level and limits you set.

## 2. The canon

**Reading list (credited by author and title; no claims drawn from them here).** Edward Tufte, *The Visual Display of Quantitative Information*; William Cleveland and Robert McGill, "Graphical Perception"; Jacques Bertin, *Semiology of Graphics*; Cole Nussbaumer Knaflic, *Storytelling with Data*; Alberto Cairo, *How Charts Lie*; Stephen Few, *Show Me the Numbers*; Tamara Munzner, *Visualization Analysis and Design*; Dona Wong, *The Wall Street Journal Guide to Information Graphics*.

**The Financial Times Visual Vocabulary.** A poster and site from the FT's Visual Journalism Team, built for newsroom chart-literacy training. It sorts chart types by the relationship you want to show: deviation, correlation, ranking, distribution, change over time, part-to-whole, magnitude, spatial and flow [8]. I use it to start the chart choice from the message, not from the chart menu.

**Claus O. Wilke, *Fundamentals of Data Visualization* (O'Reilly; free author's manuscript online).** Two ideas I apply on every job. The principle of proportional ink: the size of a shaded area must be proportional to the value it shows, so bars on a linear scale start at zero (on a log scale, at one), and area charts follow the same rule; dots and lines show value by position, so their axis can start elsewhere if it is clearly labelled [9]. On colour: qualitative palettes work best for about three to five categories and become a burden past eight to ten; rainbow scales are uneven in lightness; and about 8% of men and 0.5% of women have some colour-vision deficiency [10].

**Cynthia Brewer, ColorBrewer (Pennsylvania State University).** The standard split of palettes into sequential (low to high), diverging (two directions from a midpoint) and qualitative (categories with no order), with filters for colour-blind safe, print friendly and photocopy safe schemes [13].

**Masataka Okabe and Kei Ito, Color Universal Design (2002, revised 2008).** Two researchers who are themselves colour blind published a palette of colours that stay distinct for most colour-blind readers, including vermilion, bluish green, sky blue, blue, yellow and orange, and advised against pure red [15]. Wilke notes the Okabe-Ito palette has eight colours, enough for almost all category charts [10].

**Perceptually uniform colour maps.** Matplotlib's guidance explains why viridis and cividis read well: their lightness rises steadily, and people judge lightness changes better than hue changes. Rainbow-style maps such as jet and turbo jump around in lightness and fall apart in greyscale [14].

**UK Government Analysis Function guidance.** Public, practical rules written for government analysts and kept current: chart choice, axes, titles, labelling and an accessible colour palette with hex codes [6][7]. I use it as the default style guide when a client has none.

**W3C, WCAG 2.2 (Recommendation, 12 December 2024).** The accessibility baseline for charts on the web and in documents: text alternatives (1.1.1), colour never the only cue (1.4.1), text contrast (1.4.3) and contrast for chart parts needed to understand the content (1.4.11) [1][2][3].

## 3. How the work is done now

### Start from the message

- Write the message in a sentence or two before choosing anything. If you cannot, simplify the data or split it into two charts [6].
- Name the comparison behind the message, then pick the chart that shows it (below). The FT Visual Vocabulary is the quickest map from relationship to chart [8].
- Show only the numbers the message needs. Everything else goes in a table or appendix.

### Choosing the chart

| Comparison | First choice | Notes |
|---|---|---|
| Change over time | Line chart | More than one time series: lines, not clustered bars [6] |
| Ranking or magnitude | Bar chart, sorted by value | Keep natural order (age bands, months) where it exists [6] |
| Part of a whole | Stacked bar, or a pie with five or fewer parts and a meaningful total | Pie only when one part dominates; similar sizes need bars [6] |
| Relationship | Scatter plot | Label the few points that matter |
| Spread | Histogram, box plot or dot plot | Say how many observations |
| Place | Map | Only when location is the point [6] |
| Flow | Sankey diagram | Only for real flows between stages [6] |
| A few exact values | Table, or one big number with its comparison | A chart adds nothing for three numbers |

If zero on a bar axis hides the story, change the chart (for example a dot plot) rather than cut the axis [6][9].

### Honest scales

- **Bars and areas start at zero** on a linear scale. A cut axis makes small differences look large [6][9].
- **Lines and dots** may use a range that does not include zero, because they encode by position, but label the axis clearly and do not stretch a flat trend into a cliff [9].
- **Dual axes** are arbitrary: two scales can be set to make any two series appear to move together. Show two charts side by side, index both series to 100, or plot one against the other [11]. The UK guidance also advises against them [6]. A July 2026 note on Datawrapper's own article says Business plan users can now build dual-axis charts, and still advises alternatives for general audiences [11].
- **No 3D, shadows or textured backgrounds** [6].
- **Rank bars by value** and keep the gaps between bars narrower than a bar [6].

### Titles, labels and notes

- Use two titles: a headline that states the finding ("Repeat orders doubled after the March change") and a formal subtitle with the measure, place and period [6].
- Label lines and slices directly instead of using a legend, which forces readers to match colours [6].
- Light grey gridlines, around ten at most; horizontal text; thousands separators [6].
- Under every chart: source, period, sample size where relevant, and any caveat.

### Colour

- **Pick the palette type from the data**: sequential for ordered low-to-high values, diverging for values either side of a meaningful midpoint, qualitative for categories [13].
- **Keep categories few.** The UK palette recommends four series for bar and line charts; it says line charts with more than two series cannot keep 3:1 contrast with a palette, and suggests small multiples or a focus chart instead [7]. Wilke puts the comfortable limit at three to five categories [10].
- **A ready-made accessible palette.** The UK Analysis Function categorical palette is dark blue #12436D, turquoise #28A197, dark pink #801650 and orange #F46A25, with dark grey #3D3D3D and light purple #A285D1 only when essential. Its focus palette is #12436D for the highlighted series and grey #BFBFBF for the rest, with the highlighted line made thicker because the grey is below 3:1 on white. Its sequential blues were revised on 12 February 2026 [7].
- **Colour-blind readers.** About 1 in 12 men have colour vision deficiency, mostly red-green [16]. Avoid red-green pairs of similar brightness, do not rely on red alone to mean "bad", and test for both red-blindness and green-blindness [12]. Run the finished chart through a colour-vision simulator rather than trusting a "safe" palette label [10].
- **Continuous scales.** Use maps whose lightness rises steadily (viridis, cividis); avoid rainbow maps. Print or view the chart in greyscale to check the order still reads [14].
- **Brand colours** rarely make a good chart palette as they come. Keep one brand colour for the highlighted series and build the rest from tested values.

### Accessibility (WCAG 2.2, as of November 2026)

- **1.4.1 Use of Color (level A).** Colour may not be the only visual way to tell series or states apart. Add direct labels, line styles, markers, patterns or text [3]. Where high contrast is not possible, dashed lines or textured fills help [5].
- **1.4.3 Contrast (level AA).** Text, including axis labels and annotations, needs 4.5:1 against its background; large text (at least 18 point, or 14 point bold) needs 3:1 [1].
- **1.4.11 Non-text Contrast (level AA).** Chart parts needed to understand the content need 3:1 against adjacent colours, and 2.999:1 fails. Lines need 3:1 against the background; pie slices need to be told apart from each other, unless the values are also shown as text, in which case the slices are not required [2].
- **1.1.1 Non-text Content (level A).** Every chart needs a text alternative that serves the same purpose [1]. For a chart, that means two parts: short alt text that names the chart and points to a long description, and a long description (findings, and often the data table) available to everyone, for example in a `figure` with a `figcaption`. Do not put a table in `aria-describedby`, which reads it as one flat paragraph [4].
- **What the alt text says.** State the takeaway, such as which series rose or fell and when, not only "bar chart of sales" [23]. Pair the chart with a plain-text summary of its message and a screen-reader data table, and never make readers hover to understand the point [5].
- **Contrast arithmetic.** WCAG's contrast ratio is (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter colour's relative luminance and L2 the darker's; ratios run from 1:1 to 21:1 [1]. In practice I check every pair with a contrast checker and list the ratios.

### Charts in code (as of 6 November 2026)

- **Vega-Lite.** The latest release is 6.5.0 [20]. Specs should declare `"$schema": "https://vega.github.io/schema/vega-lite/v6.json"`, which also gives editors validation and autocomplete [19]. Quantitative x and y scales include zero by default when unbinned and without a custom domain; the default colour ranges are `tableau10` for categories, `blues` for ordered data and `yellowgreenblue` for heatmap rectangles [17]. Vega-Lite writes an `aria-label` for marks in SVG output, generated by default and set with the `description` channel [18]. The top-level `description` property is only a comment [19], so I still write alt text and a long description for the page.
- **Chart.js.** The latest release is 4.6.1 [22]. It draws on a `canvas`, which screen readers cannot read: add `role="img"` and an `aria-label` to the canvas, or real fallback text between the canvas tags, never "Your browser does not support canvas" [21].
- **Spreadsheets and slides.** Excel and PowerPoint charts take alt text in the Alt Text pane; decorative shapes should be marked decorative so screen readers skip them [23]. In Google Sheets, write the alt text and the summary next to the chart as well.

### Chart and design tools (as of 6 November 2026)

- **Flourish** is a Canva brand. Its free plan publishes and embeds charts publicly with attribution; unpublished projects stay private. Presenter comes with Canva Business or Enterprise [25]. Never put confidential numbers in a public free-plan chart.
- **Canva** publishes a remote MCP server that lets AI assistants create and edit designs, use brand kits and templates, and export to PDF, PNG or PPTX [26].
- **Figma** publishes an MCP server. Reading design context works on all plans; writing to the canvas outside drafts needs the remote server and a Full seat, and is free during the beta before becoming usage-based [27].

### Real cases worth copying

- **BBC News: house style as code.** The BBC News data team publishes `bbplot`, an R package whose `bbc_style()` applies the house look and whose `finalise_plot()` aligns the title and subtitle, adds the source and saves at a fixed publication size (640 by 450 pixels by default) [24]. The lesson for a small team: write the style down once, in a template or theme file, so every chart comes out consistent without a designer redoing it.
- **The Financial Times: a shared vocabulary.** The FT built the Visual Vocabulary to train journalists to choose charts by relationship [8]. A one-page chart-choice sheet does the same job for a client's report team.
- **UK government: guidance that changes.** The Analysis Function revised its sequential palette on 12 February 2026 [7]. Style guides need a "last checked" date and a refresh.

### Rules by region (not legal advice)

- **EU.** Since 28 June 2025 the European Accessibility Act has required products and services such as e-commerce platforms, online banking, e-books and transport websites and apps to be accessible [30]. Charts on those pages are part of the content; the client's adviser confirms whether the business is in scope.
- **UK.** Public sector websites and apps should meet WCAG 2.2 AA and publish an accessibility statement [28].
- **US.** The ADA Title II rule adopts WCAG 2.1 AA for state and local government websites and apps; an interim final rule of 20 April 2026 moved compliance to 26 April 2027 for entities serving 50,000 or more people and 26 April 2028 for smaller ones and special districts [29]. Private businesses should ask their adviser what applies.
- **Everywhere.** Meeting WCAG 2.2 AA in every chart covers the common ground.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 4.5:1 / 3:1 | Text contrast / large text contrast (WCAG 2.2 AA) | [1] |
| 3:1 | Contrast for chart parts needed to understand content; not rounded | [2] |
| 18 pt, or 14 pt bold | Size at which text counts as large | [1] |
| About 1 in 12 men | Colour vision deficiency, mostly red-green | [16] |
| About 8% of men, 0.5% of women | Colour-vision deficiency | [10]; author's figure |
| 4 | Series recommended per bar or line chart in UK guidance | [7] |
| 5 or fewer | Parts in a pie chart, with a meaningful total | [6] |
| 3 to 5, and 8 to 10 | Comfortable / burdensome number of qualitative colours | [10]; guidance, not a law |
| About 10 | Maximum light gridlines | [6] |
| 8 | Colours in the Okabe-Ito palette | [10] |
| 6.5.0 / 4.6.1 | Latest Vega-Lite / Chart.js releases | [20][22]; 6 Nov 2026 |
| 28 June 2025 | European Accessibility Act applies | [30] |
| 26 April 2027 / 2028 | ADA Title II compliance dates after the 2026 rule | [29] |

**Numbers I do not quote.** "People remember pictures X% better", "infographics get X times more shares", average reading times for charts, or "ideal" numbers of slides. None of these has a source I trust. If a client wants a claim like that on a slide, it needs a named study.

## 5. Decision rules

- If you cannot write the chart's message in a sentence, simplify the data or split the chart before designing anything [6].
- If the comparison is change over time, use a line; if it is a ranking, use bars sorted by value; if it is part of a whole with more than five parts or similar sizes, use bars, not a pie [6].
- If a bar or area axis would not start at zero, change the chart type rather than cut the axis, because shaded size must match value [6][9].
- If two measures with different units must be compared, use two aligned charts or an indexed chart instead of two y-axes [11].
- If a chart needs more than four colours, use small multiples, a focus chart or direct labels on a grey base [7][10].
- If one series is the point, colour it and grey the rest, make it thicker, and label it directly [7].
- If colour separates series, add a second cue (labels, markers, dash styles or patterns), because colour alone fails 1.4.1 [3][5].
- If a line or slice is needed to read the chart, check it reaches 3:1 against its neighbours; if it cannot, show the values as text or add a border [2].
- If the data is continuous, use a sequential or diverging map with steady lightness, never a rainbow [14].
- If red and green must both appear, change their lightness or swap one for blue or orange, then test in a simulator [12][10].
- If a chart is drawn on a canvas (Chart.js), add `role="img"`, an `aria-label` and fallback text [21].
- If the chart carries data people need, give a long description or data table in a `figure` and `figcaption`, not in `aria-describedby` [4].
- If a free Flourish plan would publish confidential numbers, use a paid plan, an image export or another tool, because free-plan published charts are public [25].
- If a client asks for a change that makes the chart misleading, explain the effect, offer an honest version that still serves their point, and do not ship the misleading one.
- If numbers in the brief do not add up, stop and ask; never "fix" them silently.

## 6. Common mistakes and how to spot them

- **Cut bar axes.** Spot it: a y-axis starting at 80 on a bar chart where one bar looks twice as tall as another [9].
- **Dual axes.** Spot it: two y-axes with unrelated units and lines that "cross" at a meaningless point [11].
- **Pie chart soup.** Spot it: more than five slices, similar sizes, a legend instead of labels [6].
- **Rainbow scales.** Spot it: a heatmap in jet or turbo, where yellow looks like the peak [14].
- **Colour-only meaning.** Spot it: "the red line is us" with no label; the chart fails in greyscale [3].
- **Low-contrast series.** Spot it: pale yellow or light grey lines on white; light-blue sequential steps that fall below 3:1 [2][7].
- **Topic titles.** Spot it: "Sales by month" instead of the finding [6].
- **Legends far from the data.** Spot it: readers' eyes bouncing between the legend and five similar colours [6].
- **Too many series.** Spot it: a line chart with eight tangled lines; small multiples would read faster [7].
- **Missing context.** Spot it: no source, period, unit or base size under the chart.
- **Empty alt text, or alt text that only names the chart.** Spot it: `alt="chart"` or "bar chart of revenue" with no finding [23].
- **Canvas charts with no name.** Spot it: a Chart.js `canvas` with no role, label or fallback text [21].
- **Hover-only meaning.** Spot it: values visible only in tooltips [5].
- **Area that lies.** Spot it: icons or bubbles scaled in both width and height by the value, so their area overstates it.
- **Private data on a public free plan.** Spot it: client numbers published from a free Flourish account [25].

## 7. Quality bar

Before I hand over a chart, infographic or deck, I check:
1. The message is written in one sentence, and the headline title states it.
2. The chart type matches the comparison, and I can say why in one line.
3. Every value on the chart, in labels and in the alt text matches the source table; totals are shown where I summed.
4. Bars and areas start at zero; no dual axes, 3D or rainbow scales.
5. Text meets 4.5:1 (3:1 if large); needed chart parts meet 3:1; colour is never the only cue [1][2][3].
6. The chart reads in greyscale and in a colour-vision simulator.
7. Alt text gives the takeaway; a long description or data table is on the page [4][23].
8. Source, period, unit and caveats sit under the chart.
9. The spec runs: library and version stated, `$schema` set for Vega-Lite, no missing fields.
10. Anything published or changed in the client's tools stayed within the access level and limits they set, and is logged.

## 8. How this role writes

- **Chart card.** Message; comparison type; chart type and why; data columns used; encoding (x, y, colour, labels); title and subtitle; colours with hex codes and contrast ratios; alt text; long description; source line; library and version.
- **Spec.** Complete and runnable: Vega-Lite JSON with `$schema`, inline data, mark and encoding with field types; or a Chart.js config with type, data and options; or numbered Excel or Sheets steps.
- **Chart review table.** Problem, why it misleads or confuses, severity (misleads, excludes, confuses, clutters), fix.
- **Infographic layout sheet.** Size and grid, section zones top to bottom, exact words and numbers, chart specs, icon notes, colours, reading path, source line, alt text.
- **Results deck outline.** One message per slide: headline title, the chart card, two-sentence speaker notes.
- **Tone.** Plain, specific and calm. Numbers as numerals with units. "This chart overstates the change" rather than "this chart is bad".

## 9. Glossary

- **Encoding:** how a value is shown: position, length, angle, area, colour or shape.
- **Proportional ink:** the rule that shaded areas must be proportional to the values they show [9].
- **Baseline:** the value an axis starts from; zero for bars and areas [9].
- **Dual-axis chart:** a chart with two y-axes and two unrelated scales [11].
- **Indexed chart:** series rebased to 100 at a start point so their changes can be compared [11].
- **Small multiples:** a grid of small charts with the same axes, one per category [7].
- **Focus chart:** one series in a strong colour, the rest in grey [7].
- **Direct labelling:** writing the series name next to the line or bar instead of using a legend [6].
- **Headline title:** a title that states the finding, with a formal subtitle underneath [6].
- **Sequential palette:** colours from light to dark for ordered values [13].
- **Diverging palette:** two colour ramps either side of a meaningful midpoint [13].
- **Qualitative palette:** distinct colours for categories with no order [13].
- **Perceptually uniform colour map:** a scale where equal data steps look like equal colour steps, such as viridis [14].
- **Colour vision deficiency (CVD):** reduced ability to tell some colours apart, most often red and green [16].
- **Okabe-Ito palette:** an eight-colour palette designed to stay distinct for colour-blind readers [10][15].
- **Contrast ratio:** the WCAG measure of lightness difference between two colours, from 1:1 to 21:1 [1].
- **Non-text contrast:** WCAG 1.4.11's 3:1 rule for chart parts and controls [2].
- **Alt text:** the short text alternative read in place of an image [1][23].
- **Long description:** the fuller text or table that gives a chart's information in words [4].
- **ARIA label:** an attribute that gives an element an accessible name, such as `aria-label` on a canvas [21].
- **Vega-Lite:** a JSON format for describing charts, checked against a published schema [19].
- **Spec:** the full chart definition: data, mark, encoding and options.
- **Visual Vocabulary:** the FT's map from data relationship to chart type [8].

## 10. What changes fast

Re-check these at every refresh (every 60 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| Vega-Lite version and schema | GitHub releases, docs [19][20] | 6.5.0; schema v6 |
| Chart.js version and accessibility page | GitHub releases, docs [21][22] | 4.6.1 |
| WCAG version | W3C [1] | 2.2 (Dec 2024) |
| UK chart and colour guidance | Analysis Function [6][7] | Colours updated 12 Feb 2026 |
| Datawrapper features and plans | Datawrapper blog and pricing [11] | Dual axes on Business plan (noted Jul 2026) |
| Flourish plans and privacy | Flourish pricing [25] | Free plan publishes publicly |
| Canva and Figma MCP servers | Canva Developers, Figma Help [26][27] | Figma canvas writing in beta |
| US ADA Title II dates | ADA.gov [29] | 26 Apr 2027 / 26 Apr 2028 |
| EU Accessibility Act | AccessibleEU [30] | In force since 28 Jun 2025 |
| UK public sector rules | GOV.UK [28] | WCAG 2.2 AA plus statement |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `check` If I cannot write the chart's message in one sentence, I simplify the data or split the chart before designing anything. (§5)
- `decision_rule` Change over time gets a line; a ranking gets bars sorted by value; a part-of-whole with more than five parts or similar sizes gets bars, not a pie. (§5)
- `decision_rule` If a bar or area axis would not start at zero, I change the chart type rather than cut the axis. (§5)
- `decision_rule` To compare two measures with different units, I use two aligned charts or an indexed chart, not two y-axes. (§5)
- `decision_rule` When one series is the point, I colour it, grey the rest, make it thicker and label it directly; past four colours, I use small multiples or a focus chart. (§5)
- `never_do` I never use a rainbow scale for continuous data; I use a sequential or diverging map with steady lightness. (§5)
