---
name: supplier-due-diligence-and-sanctions-check
description: Checks a supplier before award and at renewal - identity and company record, owners and controllers, sanctions screening against the OFAC SDN and consolidated lists, the UK Sanctions List and the EU consolidated list (including companies owned by listed people), capacity, certificates, references, forced labour and modern slavery risk, and payment red flags - and returns a risk rating, an evidence log and the questions still open. Use it for every new supplier, before any award, when ownership or the lists change, and in the yearly supplier review. A possible match stops the process for the client and their adviser. Adding a supplier as a payee needs a fresh yes.
---

# Supplier due diligence and sanctions check

A supplier that cannot deliver costs time. A supplier that is sanctioned, or owned by someone who is, can cost far more. This skill runs proportionate checks, records what was checked and when, and stops at anything that needs a human decision.

Ask a qualified adviser or lawyer about any possible sanctions match, forced labour finding or legal question. This skill does not decide them.

## When to use

- Before awarding any new supplier, and before adding them to the accounting system.
- At contract renewal, and at least yearly for active suppliers.
- When a supplier's owners, name, address or bank details change.
- When sanctions lists change in a way that touches the supplier's country or sector.
- When a large customer asks the client for supply chain or modern slavery answers.

## What you need

1. Supplier details: legal name, trading names, company number, registered and operating addresses, country, website, directors and owners as declared.
2. For goods: manufacturer, factory address and ship-from party if different from the seller.
3. The client's countries of operation and sale, which decide the lists and rules that apply.
4. Supplier answers to the vetting questions from the RFQ.
5. Certificates, test reports, insurance certificates and references supplied.
6. Research mode: with web search connected, I check registers and lists live and cite them; without it, I give the client the exact searches to run and record the results they send.

## Steps

### 1. Set the depth
Rate the purchase by spend, how critical it is and the supplier's country and sector. Low risk: identity, sanctions and red flags. Medium: add owners, capacity and references. High: add financial checks, site or video audit, certificates verified with the issuer, and supply chain tracing.

### 2. Confirm identity
Match the legal name, number and address to the official register. In the UK, Companies House search shows company data, officers, filed documents and disqualified directors. For US federal suppliers, SAM.gov holds the Unique Entity ID. Flag mismatches between the quote, the invoice details and the register.

### 3. Find owners and controllers
Ask in writing for every owner, the owners of any company that owns it, and anyone who controls it in other ways. Sanctions rules reach companies that are not listed themselves: OFAC treats a company owned 50% or more, in total, by blocked persons as blocked; UK guidance covers companies where a designated person holds more than 50% or otherwise has control. Unclear ownership is itself a finding.

### 4. Screen against the right lists
- **US:** OFAC Sanctions List Search or the SDN and consolidated list files.
- **UK:** the UK Sanctions List (the OFSI Consolidated List closed on 28 January 2026).
- **EU:** the consolidated financial sanctions list and the EU Sanctions Map.
- Screen the supplier, its trading names, directors and owners, and for goods the manufacturer and ship-from party. Use the legal name and the local-language name if there is one.
- For each search record the list, date, exact search terms, number of results and the decision on each result.

### 5. Handle results
- **No result:** record it with the date.
- **A possible match:** compare other identifiers (date of birth, address, registration number, nationality). A name match alone is not a match.
- **A match you cannot rule out:** stop. Do not award, pay or contact the supplier about it. Hand the evidence to the client and their adviser, who decide whether to contact the authority named on the list.

### 6. Check capacity, quality and product rules
What they make or deliver now, capacity against the client's volume, quality checks, certificates and test reports (verify with the issuer for high-risk items), references from similar customers. For US consumer goods, check the certificate of conformity and, for children's products, testing by a CPSC-accepted lab. Ask a qualified person for other markets' product rules.

### 7. Check forced labour and modern slavery risk
For goods and labour-heavy services: where materials come from, subcontractors, worker recruitment fees, and the supplier's own policy. If the client imports into the US, materials with a link to Xinjiang or the UFLPA Entity List need tracing documents. If the client or its customer publishes a UK modern slavery statement, record what was checked for the "due diligence" and "risk assessment" sections.

### 8. Check payment red flags
Payment to a personal account, a bank in a different country from the supplier with no reason, pressure to pay fast, or bank details changed by email. Any of these goes to the client's bank-change check (see the `ap-ar-specialist` kit). I never add or change bank details.

### 9. Rate and record
Give a rating (clear, clear with conditions, hold, do not proceed) with the reasons and open questions. Save the evidence log. Set the next review date.

### 10. Onboard (fresh yes)
At level 2, prepare the supplier record marked inactive, with the checks attached. Making the supplier active and payable, and entering bank details, needs the client's fresh yes and is done by the client or their finance team.

## Checks

- The depth matches the risk, and the reason is written down.
- Owners were asked for in writing, and gaps are findings.
- Every person and company in the chain that matters was screened against every list that applies.
- Every search has a date, terms and a recorded decision.
- No possible match was cleared on a name alone.
- No supplier was contacted about a possible match.
- Nothing was paid, and no bank detail was added or changed.

## Output format

1. Summary: supplier, depth, rating, conditions, next review date.
2. Identity and ownership table with sources.
3. Screening log: list, date, terms, results, decision, reviewer.
4. Capacity, quality and product rules findings.
5. Forced labour and modern slavery findings.
6. Red flags and open questions.
7. Draft supplier record (level 2), inactive.

## Example of good output (short)

*Illustrative structure, not a real business: a US homeware brand vetting a cotton towel maker. Copy the shape, never the content: every fact comes from the client's own context.*

> **Rating: hold.** Identity confirmed; owners not fully declared; cotton origin not traced.
>
> | Check | Result | Source and date |
> |---|---|---|
> | Company record | Name and address match | National register, 12 Mar |
> | Owners | 60% declared (one person); 40% "investment company", unnamed | Supplier email, 11 Mar |
> | OFAC SDN and consolidated | No result for company, director or declared owner | OFAC search, 12 Mar, terms: legal name, trading name, director |
> | UK and EU lists | No result | Same terms, 12 Mar |
> | Cotton origin | "Mixed sources" | Supplier answer |
>
> **Open questions:** name the 40% owner and its owners; trace the cotton to the spinning mill with documents.
> **Next step:** no award until both are answered; re-screen the named owner.
>
> Ask a qualified adviser or lawyer about any possible sanctions match.
