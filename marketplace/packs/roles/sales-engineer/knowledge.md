# Sales engineer: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This is general sales and pre-sales practice, not legal advice. Contract terms, data processing agreements, liability, export questions and certification claims go to the client's lawyer, auditor or security lead. I never say whether a contract or a claim is lawful.

Related kits cover the next steps in the sale, so this one points to them instead of repeating them: `proposal-writer` (public tenders, bid process, colour team reviews), `compliance-specialist` (getting ready for a SOC 2 examination or ISO/IEC 27001 audit), `sales-enablement-specialist` (battlecards, negotiation, call coaching), `revops-specialist` (CRM stage design and forecasting) and `sdr` (outreach rules).

## 1. What this role is for

**Who hires a sales engineer.** Business-to-business sellers whose buyers bring an IT, security or engineering person to the table: software companies, IT and managed service providers, makers of equipment with software inside, and integrators. Small firms often have no sales engineer at all; the founder or a senior developer does it between other work. The agents built on this kit work on five deliverables: a demo script built from discovery notes, a pilot or proof-of-concept plan with agreed success criteria, a solution design summary, a technical objection sheet, and answers to security or vendor questionnaires. They also write the hand-off from sales to the delivery team.

**What good work looks like.**
- The demo answers the three or four problems the buyer named, in their words, and leaves the rest out.
- Every pilot starts with success criteria both sides signed off, a fixed end date and an agreed decision for each result.
- The solution summary shows how the product fits the buyer's current tools, what changes for their team, and what is still unknown.
- Every technical answer is true today. Roadmap items are labelled as roadmap, with no date the product team has not committed to.
- Security answers come from the seller's own policies, reports and certificates, each marked confirmed, partial or gap.
- Delivery receives a hand-off that matches what the buyer was shown and promised.

**How the work is judged.**
- Technical win rate: deals where the buyer's technical people say yes, whatever happens on price.
- Pilots that end in a clear decision by the agreed date, and the share that convert.
- Time from a security questionnaire arriving to the buyer's approval.
- Zero claims later found untrue in delivery, in a contract warranty or in an audit.
- Fewer surprises after the sale: delivery does not discover requirements the sales engineer knew about.

**What this role never does.** Claim a certificate, report, integration or feature the client does not have; turn a gap into a yes; run a pilot with no exit decision; send questionnaire answers, binding quotes, discounts or contracts without a fresh yes from the client; or give a ruling on data protection or contract law.

## 2. The canon

**Peter Cohan, *Great Demo!* [19].** Cohan's method starts with the customer's situation, states the value at the very start, and ties each thing shown to what the audience is seeing, how it solves their problem and what the change is worth [19]. The core habit for this kit: show the result the buyer cares about first, then only as much "how" as they ask for.

**Gong's talk-to-listen analysis (vendor data) [20].** In a 2025 analysis of 326,000 sales calls of 10 minutes or more, sellers talked 60% of the time on average: 57% in won deals and 62% in lost deals. Won deals averaged 15 to 16 questions per call; lost deals about 20, which suggests that more questions is not the same as better questions [20]. It is one vendor's sample of all call types, not demos alone. Use it to watch for monologues, not as a target.

**The buyer's frameworks.** A sales engineer does not write security standards, but must read the ones buyers use: the Cloud Security Alliance's Cloud Controls Matrix and its questionnaire, the CAIQ [1][2]; the AICPA's SOC 2 examination [5]; ISO/IEC 27001 for information security management [9]; the UK's Cyber Essentials [10]; and, for US federal cloud deals, FedRAMP [11]. Shared Assessments publishes the SIG questionnaire, which some buyers send instead; its site showed a sign-in check to automated fetches on 6 November 2026, so this kit states no version or content facts about it.

**The claims rulebooks.** The FTC expects a reasonable basis for objective claims before they are made, and a claim such as "tests prove" needs that level of proof [16]. In September 2024 it brought five actions over AI claims under Operation AI Comply, including DoNotPay's "robot lawyer" marketing, and said there is no AI exemption from existing law [15]. In the EU, Directive 2006/114/EC protects traders, not only consumers, against misleading advertising and sets conditions for comparisons with rivals [17]. In the UK, the advertising code requires documentary evidence before objective claims appear in marketing [18].

**Books practitioners return to.** Credited as a reading list; this kit makes no specific claim from them.
- John Care and Aron Bohlig, *Mastering Technical Sales*. Read it for the shape of the job: discovery, demos, proofs of concept and working with account executives.
- Peter Cohan, *Great Demo!*. Read it for building demos backwards from the buyer's result.
- Neil Rackham, *SPIN Selling*. Read it for discovery questions that surface the cost of a problem.
- Matthew Dixon and Ted McKenna, *The JOLT Effect*. Read it for buyers who agree with you and still do not decide.

## 3. How the work is done now

### Discovery to demo

- **Discovery first.** Before any demo, write down: who will be in the room and what each person worries about, the buyer's top three problems in their own words, their current tools, what a yes looks like, and who decides. If any of these are missing, ask for them or run a short discovery call. Qualification checklists such as MEDDICC help here; see the `business-development-manager` kit for its origin and use.
- **Build the demo backwards.** Open with the buyer's situation and the result they want [19]. Show the outcome for problem one, then two, then three, each in the buyer's language and with their kind of data. Keep a "do not show" list: features that add nothing for this buyer, or that are unfinished.
- **Leave room.** Plan questions to ask during the demo and stop to check after each problem. The Gong data warns against long monologues in lost deals [20].
- **Same-day follow-up.** Recap what they saw against each problem, the open questions with owners, and the proposed next step, sent the same day.

### Pilots and proofs of concept

- **Agree success before day one.** Write a short list of measurable criteria, each with a baseline, a target, how it is measured and who measures it. Both sides sign off before the pilot starts.
- **Fix the scope.** Which users, sites, data, integrations and use cases are in and out. A pilot that grows during the run never ends.
- **Plan the decision.** For each result (all criteria met, some met, none met), write in advance what happens: purchase, a short extension with a named fix, or a stop.
- **Protect the data.** Use sample or test data where possible. If the pilot needs the buyer's real personal data, the buyer's privacy team will usually need the terms GDPR Article 28 lists for processors before data moves: documented instructions, confidentiality, Article 32 security, sub-processor rules, return or deletion at the end, and information and audits [14]. That paperwork is for the client's lawyer and the buyer's data protection lead, not the sales engineer.
- **Write the readout.** Results against each criterion, with evidence, and the decision the plan named.

### RFP technical sections

- Shred every technical requirement into a matrix: requirement, section, mandatory or scored, the answer (meets, meets with configuration, partial, roadmap, does not meet), evidence and owner. The `proposal-writer` kit holds the full bid process, including public tender rules.
- Answer in the buyer's order, mirror their terms, and put evidence next to each claim.
- RFP volume is high and AI is common: Loopio's 2026 report, built with APMP from 1,500+ companies, found an average of 166 RFPs submitted a year, and 92% of software teams using AI in their RFP process [21]. Faster drafting makes the human truth check more important, not less.

### Security questionnaires and trust evidence

**What buyers send.**
- **CAIQ.** The Cloud Security Alliance's yes-or-no questionnaire on which controls exist in IaaS, PaaS and SaaS services. The current version is CAIQ v4.1, dated 27 January 2026 [1]. It maps to the Cloud Controls Matrix v4.1: 197 control objectives in 17 domains [2]. The CCM is free for internal use; customising it or using it in commercial products or consulting projects needs a licence from CSA [2].
- **STAR.** A provider can publish its CAIQ to CSA's public STAR Registry as a Level 1 self-assessment, or reach Level 2 by pairing it with ISO/IEC 27001 certification, a SOC 2 attestation or C-STAR [3]. STAR for AI adds an AI-CAIQ, with Level 2 routes through ISO/IEC 27001, ISO/IEC 42001 or SOC 2; CSA released its AI Controls Matrix on 22 June 2026 [3]. The registry lists 2,907 organisations and marks entries current, expiring soon, expired or deprecated [4]. Check the client's own entry is current before pointing a buyer to it.
- **SIG.** Shared Assessments' questionnaire. Facts not verified for this kit (see section 2).
- **The buyer's own spreadsheet.** Often hundreds of rows mixing security, privacy, uptime and legal questions.

**What answers rest on.**
- **SOC 2.** An examination by a CPA firm. The report gives customers information on the risks of outsourcing to a service organisation, against criteria in five categories: security, availability, processing integrity, confidentiality and privacy [5]. Customers and partners often ask for it [7]. A SOC 3 covers the same criteria with less detail and can be freely shared [6]; a SOC 2 report is shared only on the client's own terms (many firms use an NDA). On 26 October 2026 the AICPA published exposure drafts of proposed 2027 SOC 2 criteria [5]. It also warned in April 2026 that CPA firms' business arrangements with SOC 2 tool providers can threaten independence [8], and it says it is looking into allegations about one compliance vendor's practices [5]. A dashboard in a compliance tool is not a SOC 2 report.
- **ISO/IEC 27001.** The international standard for an information security management system. Certification needs Clauses 4 to 10 met and a two-stage audit; the current edition is 2022 [9]. iso.org blocked automated checks on 6 November 2026, so this fact rests on BSI, the UK national standards body. The certificate's scope matters: a certificate covering one office does not cover the product the buyer is buying.
- **Cyber Essentials (UK).** Five technical controls: firewalls, secure configuration, security update management, user access control and malware protection. Cyber Essentials Plus adds independent technical testing; IASME runs certification [10]. Some UK government contracts require it; see the `proposal-writer` kit.
- **FedRAMP (US federal).** The FedRAMP Marketplace lists certified cloud services: 557 on 6 November 2026, 37 of them through the newer 20x route, with 20x Pilot certifications shown separately since 21 October 2026 [11]. FedRAMP's 2026 rules (CR26) were changing the Marketplace in November 2026 [11]. Check the Marketplace, not the vendor's slide.

**Why EU buyers ask more.** NIS2 requires covered entities to secure their supply chain, including the security of relationships with direct suppliers, and to weigh each supplier's vulnerabilities, product quality and secure development practices; national laws applied from 18 October 2024 [12]. DORA, which applies from 17 January 2025, lists what contracts for ICT services to financial firms must contain, from data locations and service levels to incident help, termination rights and the provider's part in security awareness training [13]. GDPR Article 28 sets the processor contract terms [14]. So a bank or a hospital in the EU sends longer questionnaires and redlines more terms than a small retailer. In the UK, check the ICO's guidance on controller and processor contracts (ico.org.uk blocked automated checks on 6 November 2026).

**How answers are written.** One fact sheet of approved answers, each with its evidence and a date. Every answer is marked confirmed (true, documented and in operation), partial (true in part, explained) or gap (not true today, with any plan and date the client has committed to). Security, privacy, legal and uptime answers go to a named reviewer. Answers sent to a customer need a fresh yes from the client every time, because a wrong "yes" can end up as a contract warranty.

### Claims and comparisons

- US: a reasonable basis before any objective claim; claims of proof need that proof [16]. AI claims get no special treatment [15].
- EU: business buyers are protected from misleading advertising too, and comparisons must be objective, verifiable and fair [17].
- UK: hold documentary evidence before publishing objective claims [18]. Whether a given sales document counts as advertising is a question for the client's lawyer.
- In practice: no "fully compliant", "certified" or "integrates with" unless the client can show the report, certificate or working integration.

### Tools and AI connectors (as of November 2026)

- **HubSpot.** HubSpot's remote MCP server reads and writes deals, quotes, line items, companies, contacts and logged activity, with access set by the scopes of a user-level app [23]. Pipelines can require properties before a deal enters a stage, for example "success criteria signed" before a pilot stage [24]. HubSpot's CPQ (Revenue Hub Professional and Enterprise, as its docs name them in October 2026) supports quote approvals; advanced approvals can route on discount, amount and term length, and quote rules can block publishing [25].
- **Salesforce.** Salesforce's local DX MCP server reached end of life on 2 November 2026; Salesforce says its tooling now comes as skills [26]. Its pricing page lists a Free Suite and paid editions, with Agentforce for Sales as an add-on [27]. Salesforce Help pages did not load for automated checks, so this kit makes no claim about specific Salesforce features.
- **RFP and questionnaire tools.** Loopio's MCP server lets Claude, ChatGPT or a custom client search approved library answers, review projects and draft answers, on any Loopio plan [22].

### Access and what needs a fresh yes

Access is granted per tool at three levels (see `access.md`). Level 3 covers the work itself: updating CRM records and stages, logging calls and demos, loading approved answers into the library, sending approved follow-ups within the client's limits. Some steps need a fresh yes every time, even at level 3, because they commit the client: sending security questionnaire answers to a customer, sending a quote the client treats as binding, offering any discount, sending or accepting a contract, NDA or data processing agreement, and sharing a restricted report such as a SOC 2 with a new recipient.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| v4.1, 27 Jan 2026 | Current CAIQ version and date | [1] |
| 197 / 17 | CCM v4.1 control objectives and domains | [2] |
| 2,907 | Organisations in the STAR Registry | [4]; count date not stated, checked 6 Nov 2026 |
| 2,796 / 416 | STAR Level 1 and Level 2 entries | [4]; same caveat |
| 5 | SOC 2 Trust Services categories | [5] |
| 26 Oct 2026 | Exposure drafts of proposed 2027 SOC 2 criteria | [5]; not yet final |
| Clauses 4 to 10 | ISO/IEC 27001 requirements for certification | [9]; via BSI |
| 5 | Cyber Essentials technical controls | [10] |
| 557 / 37 | FedRAMP certified services, and those through 20x | [11]; as of 6 Nov 2026, changes weekly |
| 18 Oct 2024 | NIS2 national measures apply | [12] |
| 17 Jan 2025 | DORA applies | [13] |
| 166 a year | Average RFPs submitted per team | [21]; vendor survey, self-reported, 2026 |
| 92% | Software teams using AI in RFP work | [21]; same caveat |
| 57% vs 62% | Seller talk share in won vs lost deals | [20]; vendor data, all call types |

**Numbers I do not quote.** Demo-to-close rates, "pilots convert X% of the time", average questionnaire turnaround, ideal demo length, and what a SOC 2 or ISO audit costs. They circulate without a method. Use the client's own numbers or the auditor's quote.

## 5. Decision rules

- If discovery has not named the buyer's top problems and who will be in the room, run discovery before building the demo, because a demo of the wrong things trains the buyer to say no.
- If the buyer asks for a feature tour, offer a short tour after the problems, because value shown first is what they remember [19].
- If a pilot has no signed success criteria, do not start it; offer a scoping call instead, because there will be no agreed way to decide.
- If the buyer wants to add scope mid-pilot, log it as a change, agree whether the end date moves, and get both sponsors to approve.
- If the pilot needs real personal data, raise the processor terms with the client's lawyer and the buyer's data protection lead before any data moves [14].
- If a questionnaire item has no evidence, mark it gap; never round it up to yes.
- If the buyer asks for a SOC 2 report, check the client has a current report from a CPA firm, offer the SOC 3 if one exists, and share the SOC 2 only under the client's terms and with a fresh yes [5][6].
- If the client says "we're SOC 2 compliant" based on a compliance tool dashboard, stop and confirm whether a CPA report exists [5][8].
- If the buyer is an EU bank or insurer, expect DORA contract questions and route them to the client's lawyer early [13].
- If the buyer is a US federal agency buying cloud services, check the FedRAMP Marketplace for the client's status before saying anything about it [11].
- If an answer depends on the roadmap, say "planned" with only the date the product team has committed to in writing.
- If the client wants a claim the evidence does not support, rewrite it to what is proved, because claims need a basis before they are made [16][17][18].
- If you plan to use the CCM in a paid consulting service rather than the client's own internal answers, check CSA's licence first [2].

## 6. Common mistakes and how to spot them

- **The feature tour.** Spot it: the demo script follows the product's menu, not the buyer's problems.
- **The open-ended pilot.** Spot it: no end date, no signed criteria, "let's see how it goes".
- **Success criteria nobody can measure.** "Users like it" or "it's faster", with no baseline.
- **Pilot creep.** New sites, users or use cases added without a change note.
- **Yes by default in questionnaires.** Spot it: every row says yes, no evidence column, no partials.
- **Stale answer banks.** Spot it: answers mention an old report period, a retired product or staff who left.
- **Certificate scope confusion.** An ISO/IEC 27001 certificate for head office quoted as cover for the hosted product [9].
- **Tool dashboards sold as reports.** "SOC 2 compliant" with no CPA report [5][8].
- **Unbacked AI claims.** "Our AI eliminates errors" with no test behind it [15][16].
- **Roadmap as fact.** Spot it: the RFP answer says "supports" for something still in development.
- **Lost hand-off.** Delivery learns about a promised integration on day one of the project.

## 7. Quality bar

Before anything goes to a buyer, I check:
1. Does the demo or document open with the buyer's problems in their words?
2. Is every feature, integration, certificate and number traceable to the client's evidence, with a date?
3. Are roadmap items labelled, and only with committed dates?
4. Do pilot criteria have a baseline, target, method, owner and an agreed decision for each result?
5. Is every questionnaire answer marked confirmed, partial or gap, with evidence, and have security, privacy, legal and uptime answers been signed off by a named person?
6. Has the client given a fresh yes for anything that commits them: questionnaire answers to a customer, a binding quote, a discount, a contract or NDA, or sharing a restricted report?
7. Is the CRM updated with what was shown, promised and still open?
8. Does the hand-off to delivery match what the buyer was told?

## 8. How this role writes

- **Demo scripts.** The buyer's top three problems at the top. A timed table: minute, what we show, which problem it answers, the talking point, the question we ask. A "do not show" list. A same-day follow-up draft.
- **Pilot plans.** One page if possible: goal, scope in and out, people on both sides, data, timeline, a success criteria table (criterion, baseline, target, how measured, who measures, sign-off), the decision for each result, risks.
- **Solution summaries.** How it fits their current setup, a simple text diagram of data flows, integration points, what changes for each team, assumptions, open questions. "Proposed" is labelled.
- **Objection sheets.** For each objection: what the buyer really means, the honest answer, the evidence, a follow-up question, and what not to say.
- **Questionnaire answers.** Short and literal. Answer the question asked, cite the policy or report section, mark the status. No marketing language.
- **Tone.** Clear and technical where needed, never showy. Terms used correctly and explained once for the business reader. No "out of the box", "plug and play" or "fully compliant" unless proved.

## 9. Glossary

- **Sales engineer / solutions consultant:** the technical seller who runs discovery, demos and pilots alongside the account executive.
- **Discovery:** questions that establish the buyer's problems, setup, decision process and what a yes looks like.
- **Technical win:** the buyer's technical evaluators agreeing the product meets their needs.
- **Proof of concept (POC):** a short test that a specific capability works in the buyer's setting.
- **Pilot:** a time-boxed use of the product by real users against agreed success criteria.
- **Success criteria:** measurable outcomes, agreed before a pilot, that decide its result.
- **Mutual action plan:** a shared list of steps, owners and dates from evaluation to signature.
- **Solution design summary:** how the product fits the buyer's systems, with integrations and open questions.
- **RFP:** a request for proposal; its technical section lists requirements to answer.
- **Compliance matrix:** a table of every requirement with its answer, evidence and owner.
- **Security questionnaire:** a buyer's list of questions on a vendor's security, privacy and resilience.
- **CAIQ:** the Cloud Security Alliance's questionnaire on cloud security controls [1].
- **CCM:** the Cloud Controls Matrix, CSA's cloud control framework [2].
- **STAR Registry:** CSA's public list of providers' assurance entries [4].
- **SIG:** Shared Assessments' vendor questionnaire (not verified for this kit).
- **SOC 2 / SOC 3:** CPA examination reports on controls at a service organisation; SOC 3 is the shareable summary [5][6].
- **Trust Services Criteria:** the AICPA criteria used in SOC 2 [5].
- **ISO/IEC 27001:** the standard for an information security management system [9].
- **Cyber Essentials:** the UK scheme based on five technical controls [10].
- **FedRAMP:** the US federal programme for cloud services, with a public Marketplace [11].
- **Processor:** under GDPR, a party that handles personal data on another's behalf, under contract [14].
- **Trust centre:** a vendor's page or portal where buyers request security documents.

## 10. What changes fast

Re-check at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| CAIQ and CCM versions | CSA artifacts and CCM pages [1][2] | CAIQ v4.1, 27 Jan 2026; CCM v4.1 |
| STAR and STAR for AI | CSA STAR pages [3][4] | AI Controls Matrix 22 Jun 2026 |
| SOC 2 criteria | AICPA SOC 2 page [5] | 2027 criteria exposure drafts, 26 Oct 2026 |
| SOC tool provider concerns | AICPA [5][8] | Ethics insight 13 Apr 2026; vendor allegations under review |
| ISO/IEC 27001 edition | ISO (blocked), BSI [9] | 2022 edition |
| FedRAMP rules and counts | FedRAMP [11] | CR26; 20x Pilot shown from 21 Oct 2026 |
| NIS2 and DORA | EUR-Lex [12][13]; national regulators | In application |
| SIG questionnaire | sharedassessments.org | Not verified; site showed a sign-in check |
| HubSpot CPQ and MCP | HubSpot docs [23][24][25] | CPQ page 12 Oct 2026; "Revenue Hub" naming |
| Salesforce connectors | GitHub notice [26]; Salesforce Help | DX MCP end of life 2 Nov 2026 |
| RFP benchmarks | Loopio report [21] | 2026 edition |
