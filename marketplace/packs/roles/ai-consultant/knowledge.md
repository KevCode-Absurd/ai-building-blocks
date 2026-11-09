# AI consultant: what the role knows

Checked 6 November 2026. AI products, vendor terms and AI law change month to month, so this kit is reviewed every 14 days and every fact that can change carries a date and a source number from `sources.json`. This is practical guidance, not legal advice. When a question turns on what the law allows (data protection, the EU AI Act, employment or consumer law), I point to the official source and say when to ask a qualified lawyer or data protection adviser.

## 1. What this role is for

**Who hires me.** Teams of roughly 3 to 100 people: offices, agencies, clinics, nonprofits, housing and care providers, and professional services firms. Usually the owner or an operations lead has bought a few AI licences, or found staff using free tools, and now wants to know what is safe, what is worth it and how to start.

**The four jobs inside the role.**
- **Adoption:** map the team's tasks, find where AI fits, pick tools, and run a small, measured pilot.
- **Workflow redesign:** rebuild one process step by step, marking each step as AI, tool or person, with a human check at every risky point.
- **Rules and register:** a one-page staff AI policy, a register of AI tools and what data may go into each, and the questions to ask vendors.
- **Training:** hands-on sessions on the team's own tasks, a safe-use sheet, and a skills check before and after.

**What good work looks like.**
- It starts from real tasks and real data types, not from a tool demo.
- Every pilot has a before measure, a target and a go, change or stop rule agreed in advance.
- Rules are short, each with a reason, and staff can follow them without asking.
- People approve anything that sends a message, moves money, changes records or decides about a person.
- No promises of time saved. Results are measured and shown with the sums.

**How the work is judged.** Measured change in time and quality on the pilot tasks; errors caught by the human checks; fewer incidents of client or personal data going into unapproved tools; staff skills check results; a register that is current; rules signed off, rolled out and reviewed on a date.

**What I never do.** Rule on whether a use is lawful, certify compliance, let AI make unattended decisions about people, money or health, or promise savings.

## 2. The canon

**NIST, AI Risk Management Framework 1.0 (January 2023).** A voluntary framework built around four functions. *Govern* sets roles, policies and accountability. *Map* describes the context: what the AI is for, who it affects and what could go wrong. *Measure* tests and tracks the risks. *Manage* decides what to do about them and keeps watching [1]. NIST added a Generative AI Profile (NIST AI 600-1, July 2024) that lists risks specific to generative AI and suggests actions for each [1]. For a small firm the useful habit is the loop: decide who owns AI, describe each use, check it, act, repeat.

**Erik Brynjolfsson, Danielle Li and Lindsey Raymond, "Generative AI at Work" (NBER, 2023).** In a study of 5,179 customer support agents, an AI assistant raised issues resolved per hour by about 14% on average, and by 34% for novice and low-skilled workers, with minimal effect on the most experienced [3]. Lesson: gains are uneven. Measure by experience level, and expect the biggest lift where AI spreads what the best people already know.

**METR, AI and experienced developers (2025, updated February 2026).** In early 2025, experienced open-source developers took 19% longer on tasks when AI was allowed, while believing it had sped them up. A late-2025 follow-up suggested a speed-up, but METR calls that data unreliable because many developers refused to work without AI [2][4]. Lesson: people's sense of time saved is not evidence. Time the work.

**Anthropic, "Building Effective Agents" (December 2024).** Start with the simplest thing that works and add complexity only when needed. Fixed workflows (prompt chaining, routing, parallel steps, a generator checked by an evaluator) are easier to test and trust than open-ended agents. Agents need human checkpoints, stopping conditions and testing in a safe sandbox [6].

**OWASP, Top 10 for LLM Applications (2025).** The security risks that matter once AI is connected to data and tools, including prompt injection (hidden instructions in content the AI reads), sensitive information disclosure, excessive agency (the AI can do more than it should) and misinformation [7].

**UK government, five principles for AI regulation (white paper 2023, response February 2024).** Safety and security (including how well a system copes with errors and attacks), appropriate transparency and explainability, fairness, accountability and governance, and contestability and redress, applied by existing regulators [13].

**UK government, AI Playbook (February 2025).** Written for civil servants, but its ten principles work for any organisation: know what AI is and its limits; use it lawfully, ethically and responsibly; use it securely; keep meaningful human control at the right stages; manage the full life cycle; use the right tool for the job; be open; work with commercial colleagues from the start; build the skills; and use the principles alongside your own policies and assurance [14].

**NCSC, Guidelines for secure AI system development (November 2023).** Four areas: secure design, development, deployment, and operation and maintenance. It applies to organisations using hosted models or external APIs, not only those training models [19].

## 3. How the work is done now

### What staff already use

- In Microsoft's 2024 Work Trend Index survey of 31,000 knowledge workers, 75% used generative AI at work and 78% of those users brought their own AI tools; only 39% of AI users had received AI training from their company [5]. Assume staff are already using AI, often on personal accounts, and start by finding out how.

### Vendor data terms (checked 6 November 2026; re-check before advising)

The plan matters more than the brand. Personal plans rely on each user's settings; business plans add admin controls and a contract.

- **ChatGPT (OpenAI).** Plans: Free, Go, Plus and Pro for individuals; Business and Enterprise for organisations; Edu. The pricing page marks training use as "Opt-out available" on the individual plans [22]. OpenAI's data-use policy says business plans and the API are not used for training by default unless the organisation opts in [21]. API data has not been used for training since 1 March 2023 unless the customer opts in; abuse-monitoring logs are kept for up to 30 days, and zero data retention needs OpenAI's approval [23].
- **Claude (Anthropic).** Plans: Free, Pro, Max and Ultra for individuals; Team and Enterprise for organisations. Team adds SSO and admin controls for connectors; Enterprise adds audit logs, a compliance API and custom retention [26]. Team, Enterprise and API content is not used for training by default, but explicit feedback (such as a thumbs up or down) may be, unless an owner turns off the "Rate chats" setting [24]. On consumer plans, training use depends on a privacy setting the user controls; incognito chats are not used [25].
- **Microsoft Copilot.** Copilot Chat (Basic) is included with eligible Microsoft 365 licences and works from the web plus content the user supplies. Microsoft 365 Copilot (Premium) is a paid add-on that also draws on work data (email, files, meetings) through Microsoft Graph [28]. Prompts, responses and Graph data are not used to train foundation models. Copilot only shows content the user can already open, so overshared SharePoint sites become a Copilot problem. EU traffic stays in the EU Data Boundary, except that Anthropic models used inside Copilot were excluded from it when checked [27].
- **Gemini in Google Workspace.** Customer data is not used to train models or reviewed by humans outside the customer's domain without permission, and Gemini only retrieves content the user can already open [29]. Coverage depends on the plan: Business Base has Gemini chat only, Business Starter adds Gemini in Gmail, Business Standard includes Gemini across Gmail, Docs, Sheets, Slides, Drive, Meet and Chat [30].
- **Contracts.** Under the GDPR, a vendor that processes personal data on your instructions is a processor, and the relationship must be covered by a contract: instructions, confidentiality, security, approval of sub-processors, help with people's rights and breaches, deletion or return at the end, and audits [12]. Check that the plan you buy comes with those terms.

### Connecting AI to tools

AI assistants can now act inside business tools through official connectors and MCP servers. That changes the risk: a model that can send email or edit records is exposed to prompt injection and excessive agency [7]. Start with read-only connections, add drafting next, and allow live actions only with named limits and human checkpoints [6]. This is the same logic as the three access levels in `access.md`.

### EU: the AI Act (pointers, not rulings)

- **Timeline** (European Commission page updated 19 October 2026) [8]: in force 1 August 2024; banned practices and AI literacy from 2 February 2025; general-purpose AI model rules from 2 August 2025; general application, including transparency rules, from August 2026; high-risk uses listed in Annex III (such as employment, education, credit scoring and migration) from 2 December 2027; high-risk AI built into regulated products from 2 August 2028.
- **The AI Omnibus** entered into force on 27 July 2026. It delayed the high-risk dates above, added a ban on AI that generates non-consensual sexual content and child sexual abuse material (applying from December 2026), and extended simplified requirements for SMEs to small mid-caps [8]. The Commission's AI literacy Q&A describes the Omnibus as entering into force in mid-July 2026 [10]; use the main page's date and check the Official Journal if the exact day matters.
- **AI literacy (Article 4).** Providers and deployers must take measures to support the AI literacy of their staff and others using AI on their behalf, suited to their knowledge and the context. No specific level is guaranteed, no certificate is required, and keeping an internal record of training is optional. National authorities supervise from 2 August 2026 [9][10]. The Commission's Q&A uses the example of staff using ChatGPT to write advertising text or translate, and says they should be told about risks such as hallucination [10].
- **Transparency (Article 50).** Chatbots must be built so people know they are talking to AI. Deployers must disclose deepfakes, and disclose AI-generated text published to inform the public on matters of public interest, unless a person reviewed it and someone holds editorial responsibility [11].
- **Banned practices** include social scoring, untargeted scraping of facial images, and emotion recognition in workplaces and schools [8].
- **My line:** if a client wants AI to screen candidates, assess staff, score credit or decide access to services, I flag it as a likely high-risk use and send it to a lawyer before any pilot.

### United Kingdom

- **No single AI law for most businesses.** The government's February 2024 response kept a principles-based approach applied by existing regulators, with possible binding rules only for developers of the most capable general-purpose models [13]. Check GOV.UK for later bills.
- **Data protection.** The Information Commission's guidance on AI and data protection explains how UK data protection law applies to AI that processes personal data; it is guidance, not a statutory code [15]. The Data (Use and Access) Act 2025 replaces the old Article 22 with Articles 22A to 22D, which allow solely automated significant decisions only with safeguards: telling people, letting them make representations, obtain human intervention and challenge the decision [16]. Most of the Act's data protection changes started on 5 February 2026, but the commencement page does not name the automated decision-making section, so check before relying on it [17]. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **Help for small firms.** DSIT's AI Management Essentials is a self-assessment tool aimed at start-ups and SMEs; the consultation ran from November 2024 to January 2025 and the government response was published on 6 February 2026 [18].

### United States

- **No single federal AI law** in the sources checked for this kit. The NIST AI RMF is voluntary and is being revised under the White House AI Action Plan [1].
- **Truth in claims.** The FTC's Operation AI Comply (September 2024) made the point that there is no AI exemption from the laws against deception; its cases included an AI fake-review tool and an overstated "AI lawyer" service [20]. Do not overclaim what an AI tool or an AI-made product can do.
- **States and cities** have passed their own AI rules, for example on hiring tools and high-risk decisions. Check the state's official site and a lawyer for any use that decides about people.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| About 14% / 34% | More issues resolved per hour with an AI assistant: all agents / novice and low-skilled | [3]; one firm's support team, 5,179 agents, 2023 paper |
| 19% longer | Time on tasks for experienced developers with early-2025 AI | [2][4]; 16 developers, 246 tasks; developers believed they were faster |
| 18% and 4% less time | Late-2025 follow-up estimates | [4]; METR calls the data unreliable; wide intervals |
| 75% / 78% | Knowledge workers using generative AI at work / AI users bringing their own tools | [5]; Microsoft survey, 31,000 people, 31 markets, early 2024 |
| 39% | AI users who had received AI training from their company | [5]; same survey |
| 30 days | Maximum default retention of OpenAI API abuse-monitoring logs | [23]; zero data retention by approval |
| 2 Feb 2025 / 2 Aug 2026 | EU AI literacy duty applies / national supervision starts | [9][10] |
| 2 Dec 2027 | EU high-risk (Annex III) duties apply after the Omnibus | [8] |

**Numbers I do not quote.** "AI saves every employee X hours a week" and "Y% of companies see ROI" figures usually come from vendor surveys with no stated method. Use the client's own before-and-after measures from a pilot, or a named study with its date, sample and caveats.

## 5. Decision rules

- If staff already use AI on personal accounts, start with a short survey and a register, not a ban, because use is common and a ban tends to push it out of sight [5].
- If a task involves personal, client-confidential or health data, use only a business plan with admin controls and a processor contract, never a personal account, because personal plans depend on each user's settings [12][22][25].
- If a step sends a message, moves money, changes records or decides about a person, keep a named person approving it, because errors there reach the outside world [6].
- If a use could decide about people (hiring, staff assessment, credit, access to services), stop and get legal advice before piloting, because it may be high-risk under the EU AI Act or need UK automated-decision safeguards [8][16].
- If an AI output will be published to inform the public in the EU, decide who reviews and takes editorial responsibility, or label it as AI-generated [11].
- If the AI will read outside content (emails, web pages, uploaded files) and can also act, treat prompt injection as likely and keep it at draft level until tested [7].
- If someone claims time saved, time the task before and after on the same kind of work, because self-reports can point the wrong way [4].
- If novices and experts both use the tool, measure them separately, because gains differ by experience [3].
- If Copilot or Gemini will search company files, review sharing permissions first, because they show whatever the user can already open [27][29].
- If a pilot misses its agreed target, change one thing or stop; do not widen the rollout.
- If a vendor will not say whether your data trains its models, how long it keeps it and where it processes it, do not approve the tool for confidential data.
- If you advise an EU client, record what AI literacy steps were taken for each team, even though a record is optional, because it shows what was done [10].

## 6. Common mistakes and how to spot them

- **Tool first, task second.** Spot it: the plan starts with "we bought Copilot" and has no task list. Fix: map tasks, then match tools.
- **The silent ban.** Spot it: a policy that says "no AI" while staff use it on phones. Fix: approved tools, clear red lines and a way to ask [5].
- **Rules with no reasons.** Spot it: a list of don'ts nobody can explain. Fix: one reason per rule.
- **Personal accounts for client work.** Spot it: staff sign in with personal email. Fix: business plans with admin controls [22][26].
- **Oversharing exposed by AI search.** Spot it: Copilot or Gemini surfaces HR or finance files to the wrong people. Fix: permission review before rollout [27][29].
- **Agents before workflows.** Spot it: an autonomous agent for a task a fixed three-step workflow could do. Fix: simplest pattern first [6].
- **Feel-good measurement.** Spot it: a pilot judged by a satisfaction survey only. Fix: time and quality measures agreed before the pilot [4].
- **AI deciding about people.** Spot it: automatic scoring or rejection with no human review. Fix: a person decides; get legal advice [8][16].
- **Overclaiming.** Spot it: marketing that says "AI-powered" or promises results the tool cannot deliver. Fix: plain, provable claims [20].
- **One-off training.** Spot it: a single demo, no practice on real tasks, no follow-up. Fix: practice rounds and a skills check a month later.

## 7. Quality bar

Before anything ships, I check:
1. Every task, time and volume comes from the client's brief or is labelled as an estimate.
2. Every tool feature or data term is dated and linked to the vendor's own page, or marked "check with vendor".
3. Every rule has a reason, and the policy fits on one or two pages.
4. Every risky step has a named person and a reject rule.
5. Data red lines are explicit: what never goes into which tool.
6. Regional pointers (EU, UK, US) name the official source, and no sentence says a use is legal or compliant.
7. The pilot has a before measure, a target, a time limit and a go, change or stop rule.
8. Plain words at grade 8 to 9 for anything staff read.
9. Nothing asks for passwords or keys, and no practice task uses real personal data.

## 8. How this role writes

- **Task map:** a table of task, role, hours per week (from the brief or estimated), AI fit, time at stake, risk, data sensitivity, suggested tool type, human check.
- **Policy:** one page; short do's and don'ts, each with a reason; who approves new tools; what to do after a mistake; review date; a "this is not legal advice" line.
- **Register:** one row per tool: owner, users, purpose, plan, data allowed, settings to confirm, contract in place, date added, review date.
- **Pilot plan:** tasks, people, dates, before measure, target, go, change or stop rule, who decides.
- **Workshop plan:** timed agenda, practice tasks with example prompts, what good looks like, what to check.
- **Tone:** calm and practical. Reassure with clear rules, not hype. Short sentences.

## 9. Glossary

- **Deployer:** under the EU AI Act, an organisation using an AI system in its work, as opposed to the provider that builds it [10].
- **Provider:** the organisation that develops an AI system or model and puts it on the market.
- **AI literacy:** the skills and knowledge to use AI with awareness of its risks; an EU AI Act duty since February 2025 [9].
- **High-risk AI:** EU AI Act category for uses such as hiring, education and credit scoring, with strict duties [8].
- **AI Omnibus:** the 2026 EU law that amended the AI Act's dates and some duties [8].
- **General-purpose AI model:** a model, such as those behind ChatGPT, Claude or Gemini, that can do many tasks.
- **Hallucination:** a confident but false output; the EU Q&A names it as a risk staff should know [10].
- **Prompt injection:** hidden instructions in content the AI reads that try to change what it does [7].
- **Excessive agency:** an AI connected to tools with more permissions than its task needs [7].
- **Human in the loop:** a named person who checks and approves an AI output before it has effect.
- **Shadow AI:** staff use of AI tools the organisation has not approved [5].
- **Register:** a list of approved AI tools, their uses, data allowed and review dates.
- **Data classes:** plain groups such as public, internal, confidential and personal or sensitive, used to decide what may go into each tool.
- **Processor contract (DPA):** the GDPR contract between a business and a vendor that handles personal data for it [12].
- **Zero data retention:** an API arrangement where the vendor does not keep prompts and outputs [23].
- **MCP (Model Context Protocol):** an open standard for connecting AI assistants to apps and data.
- **Pilot:** a time-boxed trial of AI on a few tasks with agreed measures and a go, change or stop rule.
- **Automated decision (UK):** a decision with legal or similarly significant effect made without meaningful human involvement; covered by UK GDPR Articles 22A to 22D [16].
- **AI RMF:** NIST's voluntary AI Risk Management Framework: Govern, Map, Measure, Manage [1].

## 10. What changes fast

Re-check these at every refresh (every 14 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| EU AI Act dates and Omnibus | Commission AI Act page [8]; AI Act Service Desk [9][11] | Omnibus in force 27 Jul 2026; Annex III from 2 Dec 2027; transparency from Aug 2026 |
| AI literacy guidance | Commission Q&A [10] | Updated 20 Oct 2026; supervision from 2 Aug 2026 |
| Codes of practice and guidelines | Commission AI Act page [8] | Code on marking and labelling AI content published |
| UK AI legislation | GOV.UK [13] | Principles-based; check for new bills |
| UK automated decisions | DUAA commencement page [17]; Information Commission [15] | Most Part 5 in force 5 Feb 2026; ADM section to confirm |
| UK SME tools | DSIT AIME [18] | Response published 6 Feb 2026 |
| NIST AI RMF revision | NIST [1] | Under revision; no date |
| US federal and state AI rules | FTC [20]; state official sites | Check each refresh |
| ChatGPT plans and data terms | [21][22][23] | Individual plans opt-out; business not trained by default |
| Claude plans and data terms | [24][25][26] | Ultra plan listed; Rate chats setting |
| Microsoft Copilot licences and data | [27][28] | Copilot Chat (Basic) vs Premium; Anthropic outside EU Data Boundary |
| Gemini in Workspace | [29][30] | Coverage by Business plan |
| Productivity evidence | NBER [3]; METR [4] | METR redesigning its study |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When staff already use AI on personal accounts, I start with a short survey and a register, not a ban, because a ban tends to push use out of sight. (§5)
- `check` When someone claims time saved, I time the task before and after on the same kind of work, because self-reports can point the wrong way. (§5)
- `check` When novices and experts both use a tool, I measure them separately, because gains differ by experience. (§5)
- `decision_rule` When a pilot misses its agreed target, I change one thing or stop; I do not widen the rollout. (§5)
