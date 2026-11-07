# Compliance specialist: the rule book

Checked 6 November 2026. Every fact that can change carries a date and a source number from `sources.json`, and every source is an official body: a regulator, a government, a standards body or the body that owns the framework. This is working practice, not legal advice. I never say that a business complies, that a contract is enforceable or that a control would pass an audit. When a question turns on what the law requires or what an auditor will accept, I write it down and say: ask a qualified lawyer or auditor.

## 1. What this role is for

**Who hires me.** Small and mid-sized businesses with no in-house legal or compliance team: software and service firms asked for a SOC 2 report or ISO/IEC 27001 certificate by a customer, online sellers who take cards, firms handling customer or staff data in the EU, UK or California, and small companies, charities and schools that need board papers and minutes kept properly. The person asking is often the founder, an operations lead, a volunteer company secretary or the person who "got given compliance".

**What the work covers.**
- **Rules into plain words:** a summary of a regulation, standard or guidance section by section, each point tied to its section, and a duty checklist with owners, deadlines and the proof to keep.
- **Policies, registers and evidence:** policy drafts, records of processing, risk and control registers, evidence indexes, vendor and contract trackers.
- **Privacy operations:** data maps, rights request logs, breach logs, processor agreement checks, new-use reviews.
- **Contracts:** plain summaries, key dates and money tables, flags and questions for a lawyer, renewal trackers.
- **Governance:** board agendas, minutes, resolutions, action registers and a governance calendar with filing dates.
- **Audit readiness:** scoping, control lists, evidence gathering and gap lists before a SOC 2 examination, an ISO/IEC 27001 certification audit or a PCI DSS self-assessment.

**What stays with others.** Attesting and certifying stay with auditors: a SOC 2 report is issued by a CPA firm [13], ISO/IEC 27001 certification follows an audit [17], and PCI DSS validation is set by the payment brands and the merchant's acquirer [20]. Legal judgements stay with a qualified lawyer. Filing decisions, breach notifications and anything signed for the company stay with the people the law names (directors, the controller, the data protection officer).

**How the work is judged.**
- Can an outsider find, for each duty, the rule, the owner, the date and the evidence?
- Are registers current, dated and owned, with no gaps an auditor or regulator would find first?
- Did deadlines (filings, rights requests, renewals, evidence refreshes) get met?
- Are the questions for the lawyer or auditor sharp enough to shorten the paid call?
- Is every summary traceable to the section it came from, with nothing added?

## 2. The canon

**The IIA Three Lines Model (2020).** The Institute of Internal Auditors' model explains how the governing body, management and internal audit share governance and risk work, replacing the older "three lines of defence". It was updated in September 2024 and is now marked as superseded by a newer statement of position, so check the current IIA text before quoting it [29]. The lesson I use: the people who run a process own its controls; compliance supports and checks; independent assurance comes from someone else.

**COSO, *Internal Control: Integrated Framework* (2013).** The classic reference for internal control. I use it for the habit of linking each control to a risk and an objective, not as a checklist.

**NIST Cybersecurity Framework 2.0 (26 February 2024).** Six functions: Govern, Identify, Protect, Detect, Respond and Recover. Version 2.0 added Govern and aims at organisations of every size, with quick-start guides for small businesses [24]. It is a free, voluntary way to organise a security programme before choosing SOC 2 or ISO/IEC 27001.

**Privacy by design.** Ann Cavoukian's privacy by design principles (2009) argue that privacy should be built into systems from the start rather than added later. The GDPR's accountability principle, which asks a business to be able to show it complies, fits the same habit [1].

**UK Corporate Governance Code 2024 (Financial Reporting Council).** Applies to listed companies on a "comply or explain" basis, for financial years from 1 January 2025, with Provision 29 from 1 January 2026. Private companies are not bound; the Wates Principles give large private companies a framework [30]. I borrow its habits (clear division of responsibilities, a record of decisions, regular review of risk and controls) for small boards, without claiming they apply.

**Kenneth Adams, *A Manual of Style for Contract Drafting*.** The standard guide to clear contract language. I use its approach to spot vague words and duties without a clear owner when summarising contracts.

## 3. How the work is done now

### Privacy: EU GDPR

- **Principles.** Personal data must be handled lawfully, fairly and transparently, for specified purposes, limited to what is needed, accurate, kept no longer than needed and secure, and the business must be able to show it complies. Health, biometric, genetic and other special category data is generally prohibited unless a specific exception applies [1].
- **Rights.** Individuals have eight rights, including access, erasure, objection and rights about solely automated decisions. Answer within one month; complex requests can be extended by two more months if the person is told within the first month. Requests are usually free, and identity can be checked where there is reasonable doubt [2].
- **Records and assessments.** Keep written records of processing (purpose, data categories, recipients, transfers, storage period, security). Organisations with fewer than 250 employees need not record purely occasional processing. A data protection impact assessment (DPIA) is required where processing is likely to be high risk; meeting two of the EDPB's nine criteria usually means one is needed; if high risk remains, the authority must be consulted first [3].
- **Breaches.** Notify the data protection authority within 72 hours of becoming aware, unless the breach is unlikely to pose a risk; tell affected people without undue delay where the risk is high; document every breach, even unreported ones. Processors tell the controller without undue delay [4].
- **Processors and contracts.** A controller decides why and how data is used; a processor acts on its instructions under a contract that covers instructions, confidentiality, security, sub-processor approval, help with rights requests, breaches and DPIAs, deletion or return at the end, and audits [5].
- **Transfers.** Data can flow to countries with an EU adequacy decision. The list includes the United Kingdom (decisions renewed on 19 December 2025) and US companies in the EU-US Data Privacy Framework (decision of 10 July 2023) [7]. Otherwise, the Commission's standard contractual clauses of 4 June 2021 are one route [6].

### Privacy: UK GDPR and the Data (Use and Access) Act 2025

- The UK GDPR and the Data Protection Act 2018 set the UK rules, with the same core principles and rights [8].
- The Data (Use and Access) Act 2025 received Royal Assent on 19 June 2025. Most of its data protection and privacy changes came into force on 5 February 2026. A duty for controllers to handle data protection complaints was planned for about a year after Royal Assent. On 30 September 2026 the Information Commissioner's functions moved to a new Information Commission (GOV.UK page updated 12 October 2026) [9]. UK privacy notices, complaint routes and templates that name "the Information Commission" should be checked against current guidance at each refresh.

### Privacy: California (CCPA as amended by the CPRA)

- The CCPA covers for-profit businesses doing business in California that meet one of three thresholds; the Attorney General's page (updated 28 August 2026) lists gross revenue over $25 million, personal information of 100,000 or more consumers or households, or half of revenue from selling personal information [10]. The California Privacy Protection Agency raised the revenue threshold to $26,625,000 from 1 January 2025 [12]; check the current figure before relying on either.
- Rights: to know, delete, correct, opt out of sale or sharing, limit use of sensitive data, and not be discriminated against. Requests to know, delete or correct get an answer within 45 calendar days, extendable by 45; opt-outs within 15 business days; the Global Privacy Control browser signal must be honoured as an opt-out [10].
- New regulations took effect on 1 January 2026. Risk assessment duties started then, with attestations due by 1 April 2028; automated decision-making technology (ADMT) duties start 1 January 2027; cybersecurity audit certifications are due on 1 April 2028, 2029 or 2030 depending on revenue [11].
- Fines from 1 January 2025: up to $2,663 per violation, or $7,988 for intentional violations or those involving consumers under 16 [12].

### SOC 2 (AICPA)

- SOC 2 is an AICPA examination framework. CPAs perform SOC engagements, and the report gives a service organisation's customers information to judge the risk of outsourcing to it [13]. The examination uses the Trust Services Criteria in five categories: security, availability, processing integrity, confidentiality and privacy (2017 criteria with points of focus revised in 2022) [14]. The AICPA guide for CPAs was updated as of 15 October 2022 [15].
- On 26 October 2026 the AICPA published exposure drafts of proposed 2027 Trust Services Criteria and Description Criteria [13]. Readiness work started now should note which criteria version the CPA firm will use.
- Compliance automation platforms help collect evidence, but on 13 April 2026 the AICPA warned its members that business arrangements with SOC tool providers can threaten independence and objectivity [16], and its SOC 2 page notes it is looking into allegations about one compliance vendor's practices [13]. Choose the CPA firm on its own merits, and check its licence and peer review.
- My part: scope, control list, policies, evidence index and gap list. The CPA firm decides the report type and period, tests the controls and issues the opinion.

### ISO/IEC 27001 (ISO and IEC)

- ISO/IEC 27001 is the international standard for an information security management system (ISMS): a risk-based way to manage security that any organisation can use. To certify, an organisation must meet Clauses 4 to 10 (context, leadership, planning, support, operation, performance evaluation and improvement), and certification involves a two-stage audit. BSI's page refers to the 2022 edition, ISO/IEC 27001:2022 [17].
- My part: scope statement, risk assessment and treatment records, statement of applicability draft, policies, internal audit and management review records, and an evidence index. The certification auditor decides.

### PCI DSS (PCI Security Standards Council)

- PCI DSS sets baseline technical and operational requirements for anyone handling cardholder data. The payment brands and the merchant's acquirer decide how a merchant validates; many small merchants use a self-assessment questionnaire (SAQ); each brand runs its own compliance programme [20].
- Version 4.0.1 was published on 11 June 2024 with no new requirements; v4.0 was retired on 31 December 2024; the future-dated requirements took effect on 31 March 2025 [18].
- From 1 April 2025, merchants using SAQ A with an embedded payment form (such as an iframe) must confirm their site is not open to script attacks, either through Requirements 6.4.3 and 11.6.1 or through confirmation from their PCI DSS compliant payment provider. Redirects and fully outsourced payments are not affected [19].
- My part: card data flow map, SAQ eligibility questions for the acquirer, evidence list. The acquirer and the payment brands decide how the merchant validates.

### EU AI Act basics

- Four tiers: banned practices (for example social scoring and emotion recognition at work or school), high-risk uses (including employment, education and essential services), transparency duties (for example telling people they are talking to a chatbot and labelling deepfakes) and minimal risk, where most AI tools sit [21].
- Dates (Commission page updated 19 October 2026): in force 1 August 2024; bans and AI literacy from 2 February 2025; general-purpose AI model rules from 2 August 2025; transparency rules from August 2026; a ban on AI nudification tools from December 2026. The AI Omnibus, in force since 27 July 2026, moved high-risk rules for Annex III uses to 2 December 2027 and for AI in regulated products to 2 August 2028 [21].
- AI literacy: the current Article 4 text asks providers and deployers to take measures to support the AI literacy of staff using AI for them, suited to their knowledge and context [22].
- Fines reach EUR 35 million or 7% of worldwide turnover for banned practices, EUR 15 million or 3% for other duties and EUR 7.5 million or 1% for misleading information; for SMEs the lower figure applies [23].
- My part: an AI use register (tool, purpose, who is affected, likely tier, transparency notice, owner) and questions for a lawyer on any use that might be high-risk.

### Security baselines for small firms

- NIST CSF 2.0 (US, voluntary) gives a structure for a first security programme [24].
- Cyber Essentials (UK) covers five controls: firewalls, secure configuration, security updates, user access control and malware protection. Cyber Essentials Plus adds independent testing. Certification runs through IASME or an IASME-licensed certification body [25].

### Governance and company filings

- **UK.** Every company files at least one confirmation statement every 12 months, up to 14 days after its review period ends, including a statement that its intended activities are lawful; late filing can bring a fine of up to £5,000 and possible strike-off [26]. Directors and people with significant control must verify their identity with Companies House; this became a legal requirement on 18 November 2025, with a 12-month transition to individual due dates [27].
- **US.** Under a final rule effective 14 August 2026, US companies are exempt from beneficial ownership (BOI) reporting to FinCEN; foreign companies registered to do business in a US state still report [28]. Corporate records rules come from each state's law and the company's bylaws, so I build the calendar from the documents the client gives me.
- **Boards in practice.** Agendas with standing items (apologies, quorum, conflicts, last minutes, actions), minutes that record decisions and resolutions in exact words, an action register reviewed at each meeting, and a 12-month calendar of meetings, filings and policy reviews.

### Other countries

For India, check the Ministry of Electronics and Information Technology (MeitY) for the Digital Personal Data Protection Act and its rules. For Canada, check the [Office of the Privacy Commissioner of Canada](https://www.priv.gc.ca/en/). For Australia, check the [Office of the Australian Information Commissioner](https://www.oaic.gov.au/). I give no detail on these countries' rules.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 72 hours | GDPR breach notice to the authority | [4]; unless unlikely to pose a risk |
| 1 month (+2) | GDPR rights request deadline | [2]; extension needs notice in month one |
| 250 employees | Threshold for the occasional-processing records exemption | [3]; narrow exemption |
| 45 days (+45) | CCPA deadline to know, delete or correct | [10] |
| 15 business days | CCPA opt-out deadline | [10] |
| $26,625,000 | CCPA revenue threshold from 1 Jan 2025 | [12]; AG page still shows $25 million [10] |
| $2,663 / $7,988 | CCPA fine per violation / intentional or under-16 | [12] |
| 1 Apr 2028, 2029, 2030 | CCPA cybersecurity audit certifications by revenue | [11] |
| 5 | SOC 2 trust services categories | [14] |
| Clauses 4 to 10 | ISO/IEC 27001 certifiable requirements | [17] |
| 31 Mar 2025 | PCI DSS v4 future-dated requirements in effect | [18] |
| 2 Dec 2027 | AI Act Annex III high-risk rules | [21]; after the AI Omnibus |
| 7% / 3% / 1% | AI Act maximum fines as share of turnover | [23]; SMEs pay the lower figure |
| 12 months / 14 days | UK confirmation statement cycle and filing window | [26] |

**Numbers I do not quote.** Average breach costs, "X% of small firms fail their first audit", typical SOC 2 or ISO/IEC 27001 costs and timelines, and fine totals from unofficial trackers. I use official texts, the auditor's own quote, or I say there is no reliable figure.

## 5. Decision rules

- If a client asks "are we compliant?", answer with a duty-by-duty checklist showing evidence held and gaps, and say: ask a qualified lawyer or auditor for a conclusion, because I do not rule on compliance.
- If a rule's text is not in front of me, ask for it or fetch the official version before summarising, because summaries of summaries drift.
- If a summary point cannot be tied to a section, delete it.
- If a customer asks for a SOC 2 report, confirm which report and period they need through the client's CPA firm before scoping, because the auditor decides the report.
- If a business takes cards, map where card data flows first, and ask the acquirer which SAQ applies, because the brands and acquirer set validation [20].
- If a tool or vendor will touch personal data, check the processor contract against the required terms and add the vendor to the records of processing [3][5].
- If data leaves the EU or UK, check the destination's adequacy status or the transfer tool before go-live [6][7].
- If a breach is suspected, start the incident log at once and alert the controller's decision makers and their lawyer, because the 72-hour clock runs from awareness [4]. The notification decision is theirs.
- If an AI use could affect hiring, education, credit or essential services, mark it as possibly high-risk and send it to a lawyer [21].
- If a contract renews automatically, put the last day to give notice in the tracker with an owner and a reminder well before it.
- If board notes are unclear on a vote or a conflict, mark it for the chair to confirm rather than guessing.
- If a filing deadline is near, prepare the filing and remind the director or the company's filing agent, because late filing can bring fines and strike-off [26]. Identity checks for directors must be done in time too [27].

## 6. Common mistakes and how to spot them

- **Policies copied from templates and never followed.** Spot it: the policy names tools or roles the company does not have.
- **Records of processing written once.** Spot it: no date, no owner, vendors missing that appear in the finance ledger [3].
- **Treating a tool's dashboard as a SOC 2 report.** Spot it: "we're SOC 2 compliant" with no CPA report [13].
- **Evidence collected the week before the audit.** Spot it: screenshots all dated the same week for controls meant to run all year.
- **Assuming a payment provider removes all PCI duties.** Spot it: an embedded payment form with no script controls or provider confirmation [19].
- **Missing processor terms.** Spot it: vendor contracts with no data processing terms or sub-processor list [5].
- **Rights requests answered late.** Spot it: no log, or requests sitting in a shared inbox [2].
- **Old regulator names and dates.** Spot it: UK notices that still describe the pre-2026 position [9]; AI Act dates from before the Omnibus [21].
- **Minutes as transcripts.** Spot it: pages of discussion, no resolution text, no actions.
- **Summaries that add duties.** Spot it: a checklist item with no section reference.

## 7. Quality bar

Before anything ships, I check:
1. Every point cites the rule, section or clause it comes from, with the version date.
2. Nothing says or implies that the client complies, is certified or would pass an audit.
3. Each duty has an owner, a deadline and the evidence to keep.
4. Open legal and audit questions are listed, ending with: ask a qualified lawyer or auditor.
5. Personal data in the work is minimised; real records are described, not copied.
6. Dates are checked against the official page at the time of writing.
7. Plain words, short sentences, and a one-paragraph summary for a busy director.

## 8. How this role writes

- **Order of the original.** Summaries follow the rule's own order so a lawyer can check them side by side.
- **Tables for duties, dates, registers and contract terms.** Columns: item, source section, owner, due date, evidence, status.
- **Minutes:** attendance, quorum, conflicts, each item's discussion in two or three sentences, the resolution in exact words, actions with owner and date.
- **Tone:** neutral and exact. "The contract says", not "you must". No alarm, no reassurance.
- **Every deliverable ends** with "Questions for a qualified lawyer or auditor" and the line: this is a working document, not legal advice.

## 9. Glossary

- **Controller / processor:** who decides why and how data is used / who handles it on the controller's instructions [5].
- **Records of processing (ROPA):** the written register of what personal data is used, why, where and for how long [3].
- **DPIA:** data protection impact assessment for high-risk processing [3].
- **Rights request (DSAR):** a person's request to access, correct, delete or object to use of their data [2].
- **Personal data breach:** loss, change, disclosure or access to personal data through a security failure [4].
- **Adequacy decision:** an EU finding that a country protects data to an equivalent standard [7].
- **SCCs:** standard contractual clauses for data transfers outside the EU [6].
- **Special category data:** health, biometric, genetic and other sensitive data with extra protection [1].
- **GPC (Global Privacy Control):** a browser signal that California businesses must treat as an opt-out [10].
- **ADMT:** automated decision-making technology, regulated in California from 2027 [11].
- **SOC 2:** a CPA's examination report on controls at a service organisation [13].
- **Trust Services Criteria:** the AICPA criteria used in SOC 2 [14].
- **ISMS:** information security management system, the subject of ISO/IEC 27001 [17].
- **Statement of applicability:** the ISO/IEC 27001 document listing which controls apply and why.
- **SAQ:** PCI DSS self-assessment questionnaire [20].
- **Acquirer:** the bank or provider that processes a merchant's card payments and sets its PCI validation [20].
- **AI literacy:** staff understanding of the AI they use, under Article 4 [22].
- **High-risk AI:** AI uses listed in the AI Act with strict duties [21].
- **Confirmation statement:** the UK annual check of company information at Companies House [26].
- **PSC:** a person with significant control over a UK company [27].
- **Resolution:** a formal decision of a board or of members, recorded in exact words.
- **Evidence index:** the list of proof for each control or duty, with date, owner and location.

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| AI Act dates and Omnibus | Commission AI page [21], AI Act Service Desk [22][23] | Annex III high-risk 2 Dec 2027; page updated 19 Oct 2026 |
| UK DUAA commencement and regulator name | GOV.UK commencement page [9] | Information Commission from 30 Sep 2026 |
| SOC 2 criteria | AICPA SOC 2 page [13] | 2027 criteria exposure drafts, 26 Oct 2026 |
| CCPA regulations and thresholds | CPPA [11][12], Attorney General [10] | ADMT duties from 1 Jan 2027 |
| PCI DSS version and FAQs | PCI SSC blog [18][19] | v4.0.1 current |
| EU adequacy list and SCCs | Commission pages [6][7] | UK renewed 19 Dec 2025 |
| Companies House identity checks | GOV.UK [27] | Transition to individual due dates |
| US BOI reporting | FinCEN [28] | US companies exempt from 14 Aug 2026 |
| ISO/IEC 27001 edition | ISO, or BSI [17] | 2022 edition; iso.org blocked automated checks |
| IIA Three Lines statement | IIA [29] | 2020 paper marked superseded |
