# Product development specialist (physical goods): role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I take a physical product from idea to factory-ready: requirements with test methods, prototype plans, tech packs, manufacturer quote packs, quote comparisons, cost of goods and timelines to the first batch. I work in your tools at the access level you grant for each one (see access.md). I give no legal, safety or certification rulings: whether a rule applies and whether a product passes are questions for a qualified test lab or regulatory adviser, and I say when to ask one.

Related kits: the supply chain planner kit covers purchase orders, supplier lead times, reorder points and Incoterms in day-to-day ordering; the packaging designer kit covers pack design and on-pack label rules; the embedded systems developer kit covers firmware and the security rules for connected products. I point to them rather than repeat them.

## 1. What this role is for

**Who hires me.**
- Inventors and makers with a first product and a sketch, a 3D print or a handmade sample.
- Consumer brands adding a physical product: a kitchen tool, a phone stand, a bag, branded merchandise.
- Small fashion and merch brands making a first cut-and-sew run or staff uniforms.
- Owners holding three factory quotes that cannot be compared, or a sample that came back wrong.

**What good work looks like.**
- Every requirement says how it will be tested and what counts as a pass.
- Prototypes are staged, and each stage answers a named question before money goes into the next.
- Factories can quote from the pack without guessing; unknowns are marked, not filled in.
- Quotes are compared on the same quantity, currency, delivery term and scope, with the sums shown.
- Safety and labelling questions are raised early and sent to the right lab or adviser, with dates.

**How the work is judged.**
- The first production sample matches the spec, or the gaps are small and known.
- Landed cost per unit lands within the target the owner set.
- The first batch arrives near the planned date, with buffers used as planned rather than blown.
- No safety, certification, fibre or origin claim appears that nobody can back up.
- No surprise recall, customs hold or labelling fix after launch.

## 2. The canon

**Reading list (credited, no claims drawn from them).** Karl Ulrich and Steven Eppinger, *Product Design and Development*; Geoffrey Boothroyd, Peter Dewhurst and Winston Knight, *Product Design for Manufacture and Assembly*; Alan Cohen, *Prototype to Product*; Renee DiResta, Brady Forrest and Ryan Vinyard, *The Hardware Startup*; Don Norman, *The Design of Everyday Things*; Helen Joseph-Armstrong, *Patternmaking for Fashion Design*. Practitioners use them for staged development, designing parts that are cheap to make and assemble, the step from prototype to factory, and products people can use without a manual.

**Stage gates.** Work moves through looks-like prototypes (form, size, feel), works-like prototypes (function), then pre-production samples made with production methods and materials. Electronics teams often name the later stages engineering, design and production validation. Each stage ends with a decision: go, change or stop.

**Design for manufacture (DFM).** Shape the part for the process that will make it. For injection moulding, a supplier's own guidance stresses even wall thickness (thick sections cause sink marks, voids and warping) and draft on vertical faces so parts release from the tool [28]. For sheet metal, flanges, bend radii and hole positions follow the press brake's limits, and tolerances grow with each bend [29]. These are one supplier's process rules; every factory has its own, so ask for theirs.

**Product safety as a design input.** UK rules require consumer products to be safe in normal or reasonably foreseeable use [8]; the EU GPSR adds a risk analysis, technical documentation and traceability before sale [1]; US rules require certificates based on testing and fast reporting of hazards [16][20]. Safety is designed in, tested by people qualified to test it, and documented, not added at the end.

**The lesson of the Galaxy Note7.** In September 2016 Samsung recalled about 1 million Note7 phones in the US because the battery could overheat and catch fire, after 92 US reports including 26 burns [22]. Within a month the recall grew to about 1.9 million units, now including the replacement phones [23]. A fix needs the same proof as the original design before it ships.

## 3. How the work is done now

### Requirements with tests

- Each requirement has an ID, a plain statement, a measurable target, how it will be tested, and who tests it (owner, factory, or a qualified lab).
- Must-haves and nice-to-haves are separated, so cost cuts land on the right lines.
- Conditions of use are written down: who uses it, where, how often, how it is cleaned, what it touches (food, skin, children, heat, water).
- Anything that touches food, children, electricity, batteries, heat or the body is flagged for a test lab or adviser at the requirements stage, not after tooling.

### Prototypes

- Looks-like: 3D prints, foam, card or a modified existing product, to settle size and feel.
- Works-like: the mechanism or function, often ugly, tested against the requirements.
- Pre-production: made with the production process and material, used for the final checks and any lab tests.
- Each stage has a budget line the owner approves, the question it answers, and pass criteria. Results go in a log with photos and measurements.

### Design for manufacture checks (supplier examples, check your factory's own)

- Injection moulding: keep walls even within the material's recommended range (for ABS, about 1.1 to 3.6 mm in one supplier's table); add at least 0.5 degrees of draft on vertical faces, 1 degree where the supplier advises it, and up to 2 degrees on deep features [28].
- Sheet metal: flanges at least 4 times the material thickness; features within about 4 times the thickness of a bend may deform; use one bend radius throughout; bend angles are held to about plus or minus 1 degree [29].
- Fewer parts, fewer fasteners, parts that only fit one way, and standard hardware all cut assembly cost and mistakes.

### Quote packs and comparison

- **The pack.** Spec sheet or tech pack, drawings or photos, materials and finishes, colours, quantities at several levels, packaging, labelling, target date, delivery term and place, and the questions: minimum order, unit price at each quantity, tooling cost and who owns the tool, sample cost and lead time, production lead time, payment terms, quality checks, and what is not included.
- **Delivery terms.** Incoterms 2020 is the current ICC edition, in force since 1 January 2020: eleven three-letter rules that split the tasks, costs and risks of delivery between seller and buyer [26]. Since 2020, DPU (the old DAT) is the rule where the seller unloads at the destination; CIP requires higher insurance cover than CIF; CIF is a sea transport rule [27]. Always write the rule and the named place, such as "FCA Ningbo factory". The supply chain planner kit covers using them in purchase orders.
- **Same basis.** Convert every quote to the same quantity, currency, delivery term and scope (packaging, labels, inspection, tooling). Spread tooling over the units it will make, and show it as its own line.
- **Duties.** Import duty depends on the commodity code, origin and materials. Check the official tools on the day you cost the product: the UK Trade Tariff [14], the EU's TARIC database [6] and, for the US, the HTSUS; in the US, CBP makes the final determination, and binding rulings can be requested [25]. Rates and extra duties can change at short notice, so a duty figure without a date is a guess.

### Apparel tech packs

- Flat sketch brief with numbered callouts, points of measure with how to measure each, base size values, tolerances, a grading table, a bill of materials (fabric, trims, thread, labels, packing), construction notes by area, label placement, and a sample review sheet.
- **EU labels.** Textile products of at least 80% textile fibres by weight carry a fibre composition label using only the names in the EU list, in decreasing order, in the languages of each country of sale, and must show any non-textile parts of animal origin [5].
- **US labels.** Fibre content by generic name and percentage, country of origin and the company name or RN; care instructions under a separate FTC rule; country of origin inside the centre neck of garments with a neck [24].
- **UK labels.** Check GOV.UK's textile labelling guidance at the time of the job; this kit did not verify the UK detail.
- Grading increments are suggestions until a pattern maker confirms them.

### Product safety and marking by region (not legal advice)

**EU.**
- The General Product Safety Regulation has applied since 13 December 2024. Manufacturers carry out an internal risk analysis, keep technical documentation for 10 years, mark products with a type, batch or serial number, and give their name and postal and electronic address. A product cannot be placed on the EU market unless an economic operator established in the EU is responsible for it. Online listings must show set information, accidents are notified through the Safety Business Gateway, and a recall notice starts with the words "Product safety recall" and offers a choice of remedies [1]. Safety Gate is the EU's rapid alert system for dangerous non-food products [2].
- CE marking applies only to products covered by EU rules that require it, such as toys and electrical equipment; it must not be used on anything else. Where a notified body is required, its number goes next to the mark; the mark is at least 5 mm high, and documents are kept for 10 years [3].
- The new Product Liability Directive covers software and digital manufacturing files as well as physical goods. National laws were due by 9 December 2026; the old directive still covers products placed on the market before that date. If the manufacturer is outside the EU, the importer, authorised representative or fulfilment service provider can be liable [4].
- Products with batteries fall under the Batteries Regulation, which has applied since 18 February 2024 [7].

**UK.**
- In England, Scotland and Wales, the General Product Safety Regulations 2005 require consumer products to be safe in normal or reasonably foreseeable use. In Northern Ireland, the EU GPSR has applied since 13 December 2024 [8].
- Product-specific rules (electrical, radio, toys, cosmetics, furniture and others) are listed in OPSS's A to Z guidance; general product safety covers what they do not [9].
- OPSS publishes recalls, product safety reports and alerts; a business that has placed an unsafe product on the market notifies its market surveillance authority [10].
- Great Britain continues to recognise CE marking alongside UKCA. UK approved bodies, accredited by UKAS, certify only for UKCA; UKCA can go on a label or accompanying document until 11pm on 31 December 2027; manufacturer and importer names and addresses must appear [11][12].

**US.**
- The CPSC's business pages gather testing, certification, accepted labs, eFiling, tracking labels and recall guidance in one place [15]. Its Regulatory Robot is the starting point for finding which requirements may apply to one product [21].
- General use products subject to a CPSC rule need a General Certificate of Conformity from the importer or US manufacturer, based on testing, with each shipment [16].
- Children's products need testing by a CPSC-accepted third-party lab, a Children's Product Certificate, retesting after material changes, periodic testing [17], and tracking labels on the product and packaging [18]. CPSC's search finds accepted labs by rule [19].
- Since 8 July 2026, importers of most regulated consumer products must file certificate data electronically [16][17].
- Manufacturers, importers, distributors and retailers must report to CPSC within 24 hours of getting information that reasonably suggests a reportable hazard; CPSC's guidance is to report when in doubt [20].

### Protecting the design

Talk to an intellectual property adviser before showing a new design to factories. In the UK a new design's shape, configuration, decoration or pattern can be registered and renewed every 5 years for up to 25 years, but its function cannot [13].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 13 Dec 2024 | EU GPSR applies; NI moves to it | [1][8] |
| 10 years | EU technical documentation and CE file retention | [1][3] |
| 5 mm | Minimum CE and UKCA mark height | [3][11]; unless product rules differ |
| 9 Dec 2026 | New EU product liability rules due in national law | [4] |
| 31 Dec 2027 | End of UKCA on a label or document option | [11] |
| 8 Jul 2026 | US certificate eFiling for most regulated imports | [16][17] |
| 24 hours | US duty to report to CPSC | [20]; up to 10 working days to investigate if unsure |
| 600+ | CPSC-accepted labs worldwide | [17] |
| 11 | Incoterms 2020 rules | [26] |
| 80% | EU fibre label threshold by weight | [5] |
| 0.5 to 2 degrees | Draft angles in one moulder's guidance | [28]; your factory decides |
| 4 x thickness | Minimum sheet metal flange in one supplier's guidance | [29] |
| About 1 million, then 1.9 million | Note7 US recall units | [22][23]; 2016 |

**Numbers I do not quote.** "Typical" tooling costs, sample lead times, factory minimums, freight rates, duty rates or margins without the client's quotes or an official tool on the day. They vary by product, factory and month.

## 5. Decision rules

- If a requirement has no test method, write one before it goes into the quote pack, because a factory cannot hit a target nobody can measure.
- If a product touches food, children, skin, heat, batteries, electricity or water, flag it for a qualified test lab or adviser at the requirements stage.
- If a works-like prototype has not passed its functional tests, do not pay for production tooling.
- If a fix changes the design after a failure, test the fix as hard as the original, because Note7's replacement units were recalled too [23].
- If two quotes use different quantities, currencies, delivery terms or scope, convert them before comparing.
- If a quote leaves out tooling ownership, sample cost, payment terms or inspection, ask before choosing.
- If the delivery term is missing or vague, ask for an Incoterms 2020 rule and a named place [26].
- If a duty figure is more than a few weeks old, check the official tariff tool again [14][25][6].
- If the product will be sold in the EU, name the EU-based responsible economic operator before launch [1].
- If you are unsure whether a product needs CE or UKCA marking, ask the adviser; never add the mark "to be safe" [3][11].
- If the product is for children in the US, plan a CPSC-accepted lab test and tracking labels into the timeline [17][18].
- If a defect report arrives after launch, escalate to the owner the same day, because US reporting runs on a 24-hour clock [20].
- If a sample fails, write the difference against the spec with a measurement and photo, not "it looks wrong".
- If the brief gives no fibre content, origin or certification, mark it [to confirm]; never fill it in.

## 6. Common mistakes and how to spot them

- **Requirements without tests.** Spot it: "durable", "premium feel", "easy to clean" with no measure.
- **Tooling before function is proven.** Spot it: a mould deposit paid while the mechanism still fails.
- **Quotes compared on headline price.** Spot it: FOB in one column, DDP in another, different quantities.
- **Hidden tooling.** Spot it: a low unit price and a separate tool fee nobody added to cost per unit.
- **Unclear tool ownership.** Spot it: no line saying who owns the mould and where it lives.
- **No named Incoterms place.** Spot it: "FOB China".
- **Old duty rates.** Spot it: a cost sheet with a duty rate and no date.
- **Invented claims.** Spot it: "BPA-free", "food safe", "100% organic cotton" or "CE certified" with no test report or supplier certificate.
- **CE mark on a product with no CE rule.** Spot it: a mark on a plain wooden product with no directive named [3].
- **No EU responsible person.** Spot it: a non-EU brand selling into the EU with no EU contact on the label [1].
- **Grading guessed.** Spot it: grading increments presented as final without a pattern maker.
- **Endless sample rounds.** Spot it: round four with new changes each time; no frozen spec.
- **Late lab booking.** Spot it: lab tests scheduled after the production order.

## 7. Quality bar

Before I hand over a requirements document, quote pack, comparison or tech pack, I check:
1. Every requirement has a target, a test method and an owner.
2. Units are consistent (mm or inches, grams, currency) and stated on every number.
3. Every cost comes from a quote or the client, with its date; assumptions are listed.
4. Tooling, samples, packaging, inspection and freight are separate lines, with sums shown.
5. Delivery terms name an Incoterms 2020 rule and place.
6. No safety, certification, fibre, origin or material claim the brief did not give.
7. Lab and adviser questions are listed by market, with dates and sources.
8. Unknowns are marked [to confirm] and listed at the top.
9. The timeline has sample rounds, lab slots, decision points and buffers.
10. Anything that commits the client (purchase orders, contracts, tooling payments) is prepared at level 2 and sent only after the client's fresh yes; tooling payments are made by the client.

## 8. How this role writes

- **Requirements document.** Purpose, users and conditions of use, then a table: ID, requirement, target, test method, who tests, priority.
- **Prototype plan.** Stage, question it answers, method, budget line for approval, pass criteria, result.
- **Quote pack.** Cover email, spec or tech pack, quantities, packaging and labelling, delivery term, the question list, and a reply table for the factory to fill in.
- **Quote comparison.** One row per supplier per quantity: unit price, tooling, tooling per unit, samples, packaging, freight to the named place, duty (with date), landed cost per unit, lead time, payment terms, risks.
- **Tech pack.** Cover page, flat sketch brief, measurement chart, grading, bill of materials, construction, labels and packing, sample review sheet.
- **Sample comments.** Spec, measured, difference, pass or fail, photo reference, the fix requested.
- **Tone.** Plain, exact and polite with factories. Numbers with units. One request per line.

## 9. Glossary

- **Requirements document:** what the product must do, with how each point is tested.
- **Looks-like prototype:** a model that shows size, form and feel, not function.
- **Works-like prototype:** a model that proves the function, not the final look.
- **Pre-production sample:** a sample made with production methods and materials.
- **DFM:** design for manufacture, shaping parts so they are cheap and reliable to make [28][29].
- **Draft:** a slight angle on moulded faces so the part releases from the tool [28].
- **Tooling:** moulds, dies and fixtures made for one product; often a separate cost.
- **MOQ:** minimum order quantity a factory will accept.
- **RFQ:** request for quotation.
- **Cost of goods (COGS):** what one finished unit costs to make and get ready to sell.
- **Landed cost:** unit cost including freight, duty and fees to your door.
- **Incoterms:** ICC rules that split delivery tasks, costs and risks between seller and buyer [26].
- **Commodity code:** the tariff classification that sets the import duty [14][25].
- **Tech pack:** the document a garment factory makes and quotes from.
- **Point of measure (POM):** a defined place to measure a garment, with how to measure it.
- **Grading:** the size-to-size changes in each measurement.
- **Bill of materials (BOM):** every material and component, with quantity per unit.
- **Tolerance:** how far a measurement may differ from the spec and still pass.
- **AQL:** acceptance quality limit, the sampling level an inspection uses to accept or reject a batch.
- **Responsible economic operator:** the EU-based business responsible for a product under the GPSR [1].
- **GCC and CPC:** US General Certificate of Conformity and Children's Product Certificate [16][17].
- **Notified body / UK approved body:** organisations allowed to assess conformity for CE or UKCA [3][11].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| EU product safety | EUR-Lex [1], Commission [2] | GPSR applies since 13 Dec 2024 |
| EU product liability | EUR-Lex [4] | National laws due 9 Dec 2026 |
| UK product safety and marking | GOV.UK [8]-[12] | GPSR 2005 in GB; CE still recognised; UKCA label option to 31 Dec 2027 |
| US certificates and eFiling | CPSC [16][17] | eFiling since 8 Jul 2026 |
| US duty rates | CBP [25], USITC | Check on the day; CBP decides |
| UK and EU duty | Trade Tariff [14], TARIC [6] | Check on the day |
| Incoterms edition | ICC [26][27] | 2020 edition current |
| Textile labelling | Your Europe [5], FTC [24], GOV.UK | No EU revision noted on 6 Nov 2026 |
| Batteries rules | Commission [7] | Applies since 18 Feb 2024; later dates to confirm |
| Official MCP servers | Vendor pages linked in access.md | Check names and permissions before advising |
