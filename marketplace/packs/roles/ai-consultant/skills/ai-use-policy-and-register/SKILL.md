---
name: ai-use-policy-and-register
description: Writes a one-page staff AI use policy (allowed uses, data that never goes in, how to check outputs, when to disclose AI use, who approves new tools, what to do after a mistake) and builds a register of every AI tool with its owner, users, purpose, plan, data allowed, settings to confirm with the vendor and review date. Sorts the business's data into plain classes with examples, and adds EU, UK and US pointers to official guidance without legal rulings. Use it when an owner finds staff pasting client data into free tools, before rolling out Copilot, ChatGPT, Claude or Gemini, or when a client or funder asks for an AI policy.
---

# AI use policy and register

## When to use

- Staff are using AI tools and nobody has said what is allowed.
- A business is about to roll out an AI tool to everyone.
- A client contract, funder or insurer asks "do you have an AI policy?"
- An incident happened: client data went into a free tool, or an AI-written message went out with an error.

This skill writes practical rules and a register. It does not decide whether a use is lawful, certify compliance, or change tool settings on its own. Every policy carries the line: *This is practical guidance, not legal advice. Check data protection and AI rules with a qualified adviser.*

## What you need

1. **The tools in use or wanted,** who uses them, for what, and on which plan (personal or business). Include what staff actually do, such as pasting client emails.
2. **The data the business holds:** client files, staff records, health or children's data, financial data, commercial secrets.
3. **Where the business and its clients are:** EU, UK, US states, other countries.
4. **External rules:** client contracts, professional codes, funder or insurer conditions.
5. **Who decides:** the owner, a data protection lead, IT support.
6. **Access I have:** the level the client grants in each tool (1 read, 2 read and draft, 3 read, write and publish). Steps 1 to 7 need level 1 only (reading admin settings pages or exports the client shares). Step 8 needs level 2 or 3. Until the client answers, work at level 1.

## Steps

1. **Inventory the tools.** For each: name, plan, who uses it, for what, how people sign in (personal email or work account), whether it connects to company data (email, files, CRM).
2. **Sort the data into four plain classes,** with two real examples each from this business:
   - **Public:** already published (website text, published prices).
   - **Internal:** not secret but not public (internal procedures, meeting notes without personal details).
   - **Confidential:** client or commercial information (contracts, quotes, client documents).
   - **Personal or sensitive:** anything about an identifiable person; extra care for health, children, finances, criminal records, and staff records.
3. **Decide which classes may go into each tool,** based on the plan and the vendor's own dated terms: whether inputs train models by default, how long data is kept, where it is processed, whether a processor contract is available, and whether there are admin controls. Personal plans: public data only, unless the business has checked each user's settings. Business plans with admin controls and a contract: up to the class the owner approves. Mark every setting to confirm with the vendor, with a link to the vendor's page and the date checked.
4. **Write the rules** as short do's and don'ts, each with a reason. Cover at least:
   - Use only approved tools, signed in with work accounts. *Reason: business plans have controls and a contract.*
   - Never paste passwords, API keys, card numbers or ID numbers into any AI tool. *Reason: they can be stored and exposed.*
   - Data red lines per tool, from step 3.
   - Check every output before use: facts, numbers, names, links and tone. AI can be confidently wrong. *Reason: you are responsible for what you send.*
   - A person approves anything that is sent to clients, moves money, changes records or decides about a person.
   - Disclose AI use where it matters: chatbots that talk to the public, AI-made images or video that look real, and AI-written public information that no one reviewed (in the EU these are covered by the AI Act's transparency rules from August 2026). Follow client or funder rules on disclosure.
   - Ask before trying a new tool: who to ask and how long approval takes.
   - What to do after a mistake: stop, tell the named person, record what happened, no blame for reporting.
5. **Add the regional pointers (no rulings).**
   - **EU:** the AI Act's AI literacy duty (staff using AI should get suitable training; no certificate needed), transparency rules, and high-risk uses such as hiring and credit scoring. Point to the European Commission's AI Act pages and the AI literacy Q&A.
   - **UK:** the Information Commission's guidance on AI and data protection, and the Data (Use and Access) Act changes on automated decisions. Point to the Information Commission and GOV.UK.
   - **US:** the FTC's position that there is no AI exemption from laws against deception; NIST's voluntary AI Risk Management Framework; state rules to check with a lawyer.
6. **Build the register:** tool, owner, users or teams, purpose, plan, sign-in method, data classes allowed, connected data sources, settings to confirm, processor contract in place (yes, no, unknown), date added, review date, notes.
7. **Draft the roll-out:** a short staff message, an FAQ with the questions staff will ask, where the policy lives, and a review date. Suggest a short training session on the team's own tasks.
8. **Act only at the right level.** Level 1: deliver the policy, register and message. Level 2: create the policy page and register sheet in the client's workspace as unshared drafts, and draft the staff message without sending. Level 3: after the client confirms the action list and limits, publish the policy page, share the register with the named owners, send the staff message to the named list, or change the tool settings the client listed (for example turning off feedback sharing or a connector). Log each action. Ask again before changing any setting not on the list, removing users, or sending to a new audience.

## Checks

- Every tool and habit comes from the client's brief; nothing is assumed.
- Every rule has a reason and fits on one or two pages in total.
- Every vendor term is dated and linked, or marked "check with vendor".
- The policy never says the business is compliant, and carries the not-legal-advice line.
- Nothing asks staff to share passwords or monitors staff in ways they have not been told about.
- The register has an owner and a review date for every tool.

## Output format

1. One-page policy: purpose, approved tools, data red lines, do's and don'ts with reasons, disclosure, approvals, mistakes, review date, not-legal-advice line.
2. Data classes with examples.
3. Register table.
4. Settings and questions to confirm with each vendor.
5. Regional pointers with links.
6. Staff message and FAQ.
7. Action log (if any level 2 or 3 work).

## Example of good output (short)

*Illustrative structure, not a real business: an eight-person accountancy practice in England. Copy the shape, never the content: every fact comes from the client's own context. Access I have: level 1 (tool list and two admin screenshots).*

> **Our AI rules (version 1, 6 Nov 2026, review 6 May 2027). This is practical guidance, not legal advice. Check data protection and AI rules with a qualified adviser.**
> - Use Copilot Chat signed in with your work account. *Your work account keeps prompts inside our Microsoft 365 contract.*
> - Never put client tax records, bank details or National Insurance numbers into any AI tool. *These are personal and financial data we must protect.*
> - Check every figure an AI gives you against the source document. *AI can produce numbers that look right and are wrong.*
> - A partner approves any AI-drafted letter before it goes to a client.

| Tool | Owner | Plan | Data allowed | Settings to confirm | Review |
|---|---|---|---|---|---|
| Copilot Chat | Office manager | Included with Microsoft 365 | Public, internal | Work sign-in enforced; web search on or off | May 2027 |
| ChatGPT (personal accounts) | None | Free | Public only | Training opt-out per user | Replace or remove |
