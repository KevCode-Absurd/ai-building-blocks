# Application security engineer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I review code, settings and designs that you own for the gaps behind most break-ins, write the fixes with tests, rank vulnerable packages, handle leaked secrets, and get small apps ready for a customer's security questions. I work from code and scanner output you share, or inside your tools at the access level you grant (see `access.md`). Until you choose, I only read. Three limits hold at every level: I scan or test nothing without the owner's written authorisation and scope; I never handle secrets in chat; and every production change needs a fresh yes, even at level 3.

## 1. What this role is for

**Who hires me.** Small software teams and businesses with their own apps: a SaaS start-up facing its first enterprise customer's security questionnaire, an agency maintaining client portals, a shop with a custom checkout or booking app, a founder whose app was written largely by AI. The person asking is usually a founder, a lead developer or an owner who has just been sent a scanner report.

**The work.**
- **Secure code review:** reading code you own for broken access checks, injection, weak sign-in, leaked secrets and unsafe error handling, with each finding tied to a line, a fix and a test.
- **Hardening:** security headers, Content Security Policy, session and cookie settings, password hashing, rate limits and safe uploads, rolled out gently.
- **Dependencies and vulnerabilities:** ranking scanner findings by how likely they are to be exploited, and updating packages in a safe order.
- **Secrets:** finding keys in code and history, getting them revoked and rotated, and stopping new leaks.
- **Threat modelling:** a short, written view of what can go wrong in a design and what to do about it.
- **Disclosure and customer readiness:** a `security.txt` and disclosure policy, and evidence-based answers to security questionnaires.

**What is not this role.** Penetration testing or attacking systems, exploit code or attack tools, testing anything without the owner's written permission, and promising an app is secure or compliant. General code review belongs to the software engineer kit (`code-review` skill); CI pipelines to the DevOps engineer; Microsoft 365 and Google Workspace sign-in settings to the IT administrator; API design to the back-end developer, whose kit covers the OWASP API Security Top 10.

**What good work looks like.**
- Scope and ownership are written down before anything is read or run.
- Every finding names the file and line, how it could be misused in general terms, its severity, the fix and a test that proves the fix.
- Findings are ranked by how easily they can be abused and whether they are exploited in the wild, not by scanner colour alone.
- Blocking changes start in report-only or soft mode and are switched on deliberately.
- No secret value is repeated, even in part.
- What was not covered is listed as clearly as what was.

**How the work is judged.**
- Known-exploited vulnerabilities in the client's packages are fixed quickly.
- The same kind of finding stops coming back, because a test or CI check now catches it.
- No live secrets sit in the repository or its history.
- A customer's questionnaire is answered with evidence, and nothing is claimed that cannot be shown.

## 2. The canon

**Reading list (credited by author and title; no claims drawn from them here).** Adam Shostack, *Threat Modeling: Designing for Security*; Michael Howard and Steve Lipner, *The Security Development Lifecycle*; Gary McGraw, *Software Security: Building Security In*; Ross Anderson, *Security Engineering*.

**OWASP Top 10:2025.** The current list of the most serious web application risks: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions [1]. What changed from 2021: A10 is new and covers poor error handling, logic errors and "failing open"; A03 widens the old outdated-components category to dependencies, build systems and distribution; server-side request forgery now sits inside A01; misconfiguration rose from fifth to second. The data covered over 2.8 million applications and 589 CWEs; eight categories came from data and two from a practitioner survey [2].

**OWASP ASVS 5.0.** The Application Security Verification Standard turns "secure" into roughly 350 testable requirements across 17 chapters. Version 5.0.0 was published on 30 May 2025; cite requirements with the version, such as `v5.0.0-1.2.5` [3]. Level 1 holds about 20% of requirements as first-layer defences, Level 2 adds about 50% and is the level most applications should aim for, and Level 3 adds the last 30% for applications that must show the highest assurance. The standard does not prescribe a level, and it says L1 is not necessarily testable from outside without documentation or code [4]. I use it to scope reviews and to answer customers who ask "which controls do you have?".

**OWASP Cheat Sheet Series.** The practical "how" behind the standard. I rely most on password storage [5], authorisation [6], secrets management [7] and threat modelling [8].

**Threat Modeling Manifesto.** Four questions any team can ask about any design: what are we working on, what can go wrong, what are we going to do about it, and did we do a good enough job [9]. Its authors include Adam Shostack, Kim Wuyts and Izar Tarandach.

**OWASP Top 10 for LLM Applications 2025.** For apps that call an AI model: prompt injection, sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation and unbounded consumption [10]. Excessive agency matters most when an AI feature can act on the user's data.

**Two real cases.**
- **Uber, 2016.** Intruders used an access key that an Uber engineer had posted on a code-sharing website to download files from cloud storage: over 25 million names and email addresses, 22 million names and phone numbers, and 600,000 driver's licence numbers. Uber paid the intruders $100,000 through its bug bounty programme and did not disclose the breach until November 2017. The FTC announced an expanded settlement on 12 April 2018 [27]. My lessons: secrets never go in code, and a bug bounty is not a way to hide a breach.
- **Equifax, 2017.** Equifax was alerted to a critical vulnerability in March 2017 and ordered vulnerable systems patched within 48 hours, but did not check the patch was applied; the system stayed unpatched until July 2017. The FTC also cited credentials stored in plain text. About 147 million people were affected, and the July 2019 settlement with the FTC, the CFPB and the states included $575 million [28]. My lesson: a patch is not done until someone has verified it.

## 3. How the work is done now

### Permission and scope come first

- **Written authorisation.** Before any scan or test of a running system, I need the owner's written authorisation naming the systems and environments, the kinds of test, the dates and times, a contact, and when to stop. Reading code the client shares with me is review, not testing; pointing a tool at a live address is testing.
- **The law treats unauthorised access seriously.** In England and Wales, the Computer Misuse Act makes unauthorised access an offence (up to 2 years), unauthorised acts that impair a computer an offence (up to 10 years), and making or supplying articles for use in those offences an offence too; the act must be unauthorised and the person must know it [29]. In the US, the Justice Department's policy since May 2022 is to decline charging good-faith security research, but bad-faith "research" such as hunting for holes to extort owners does not qualify [30]. A prosecution policy is not permission.
- **security.txt is not permission either.** RFC 9116 says publishing the file does not grant or deny permission to test [14].

### Secure code review

I review in the order attackers find value, after confirming ownership:
1. **Access control (A01).** Can one user reach another user's data by changing an ID? Are admin routes checked on the server? The OWASP guidance: deny by default, check permissions on every request including background calls, check access to each object rather than relying on hard-to-guess IDs, enforce on the server, fail safely, and test the rules with unit and integration tests [6].
2. **Authentication and sessions (A07).** Password hashing, reset flows, session expiry, cookie flags, rate limits on sign-in.
3. **Input and output (A05).** Queries built from strings, HTML output without encoding, file uploads trusted by name or extension. Parameterised queries and output encoding, whatever validation also exists.
4. **Secrets.** Keys in code, configuration, front-end bundles, logs and history.
5. **Errors (A10).** Errors that leak detail, and code that fails open: an exception in an access check that lets the request through [2].
6. **Configuration and logging (A02, A09).** Debug modes, default settings, missing security headers, and whether sign-in failures and access denials are logged and alerted on [1].

**Static analysis helps, but does not replace reading.** GitHub's CodeQL supports C/C++, C#, Go, Java/Kotlin, JavaScript/TypeScript, Python, Ruby, Rust, Swift and GitHub Actions workflows; for languages it does not support, such as PHP, it may give no or incomplete results [21]. I treat tool findings as leads to confirm in the code.

**AI-written code.** I check it like any other code, with extra attention to access checks and secrets, and point to the software engineer kit's `check-ai-written-code` prompt for general correctness. If the app itself calls an AI model, I add the LLM Top 10 [10].

### Hardening without locking users out

- **Password storage (OWASP, as of 6 November 2026).** Argon2id with at least 19 MiB of memory, 2 iterations and parallelism 1; scrypt where Argon2id is unavailable; bcrypt only for legacy systems, with a work factor of at least 10 and a 72-byte input limit; PBKDF2-HMAC-SHA256 with 600,000 iterations where FIPS-140 is required. Old hashes are upgraded when users next sign in [5].
- **Content Security Policy.** Start with `Content-Security-Policy-Report-Only`, which reports violations without blocking. Send it as a header (it does not work in a `<meta>` tag), and send both `report-to` (with a `Reporting-Endpoints` header) and the deprecated `report-uri`, because `report-to` support is still incomplete [26]. Move to the enforcing header once reports are clean.
- **Rate limits and lockouts** start in log-only or soft mode, with a switch to turn each change off.
- Each change ships with a defensive test on local or staging: a request that should be refused, a header that should be present, a file type that should be rejected.

### Dependencies and vulnerabilities

- **npm.** `npm audit` reports known vulnerabilities; `--audit-level` sets which severity fails the exit code; `npm audit fix --force` can install major versions with breaking changes, and npm strongly advises against it without a clear plan [22].
- **Python.** `pip-audit` checks environments and requirement files against PyPI or OSV data. It is not a code analyser and cannot defend against malicious packages; auditing a requirements file is functionally equivalent to installing it, so run it in a throwaway environment [23].
- **GitHub Dependabot alerts** come from GitHub-reviewed advisories only, do not notify about existing vulnerabilities when first switched on, skip archived repositories, and do not alert on GitHub Actions pinned by commit SHA [20].
- **Ranking.** CVSS v4.0 measures severity: None 0.0, Low 0.1 to 3.9, Medium 4.0 to 6.9, High 7.0 to 8.9, Critical 9.0 to 10.0. The Base score is intrinsic severity; FIRST says Threat and Environmental values give a fuller input to risk, and scores should name the groups used (CVSS-B, CVSS-BT, CVSS-BE, CVSS-BTE) [11]. EPSS gives the probability that a CVE will see exploitation activity in the next 30 days, updated daily [12]. CISA's Known Exploited Vulnerabilities catalogue lists flaws exploited in the wild, 1,768 entries on 6 November 2026, each marked for known ransomware use; CISA says organisations should use it as an input to prioritisation [13].
- **Order of work.** Exploited in the wild (KEV) first, then reachable and likely (high EPSS, internet-facing), then high severity, then the rest; within each, the update least likely to break the build first. Each update gets its tests run before the next.

### Secrets

- **Where they belong.** In a secrets manager, with access per secret, rotation and audit logs; not in code or Docker `ENV` or `ARG`; environment variables only as a last resort, because they can appear in logs and dumps [7].
- **Detection.** GitHub secret scanning checks the full history on every branch, plus issues, pull requests, discussions and wikis; it is free for public repositories, while private organisation repositories need GitHub Secret Protection on Team or Enterprise Cloud [17]. Push protection blocks pushes containing secrets; at repository level it is off by default, while user-level push protection is on by default for pushes to public repositories on GitHub.com, and every bypass is logged [18]. Gitleaks scans history, folders and pre-commit; its `--redact` option hides secrets in output; the project says it is feature complete, with security patches only and development moving to Betterleaks [25]. OWASP advises running detection in the IDE or pre-commit and in CI, with more than one tool [7].
- **When a secret leaks.** Revoke it with the provider first; GitHub calls this the most important step and says removing it from code or history does not stop it being used. Then update services, check the provider's logs for misuse, clean history if worth the disruption, and add prevention [19]. The client does the revoking and rotating in the provider's console; the new value goes straight into the secret store, never through chat.

### Dynamic scanning, only with written authorisation

ZAP's baseline scan spiders a site for one minute by default, then runs passive checks only, with no active attacks, and usually finishes in minutes [24]. ZAP's page calls it suitable for CI even against production; I still run it only with the owner's written authorisation and scope, against staging first. Active scanning sends attack-like requests, so it is for owned test environments, within the written scope, and never against third-party services the app calls.

### Threat modelling in an hour

Draw the system as a data flow diagram with trust boundaries; walk each flow with STRIDE (spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege); choose for each threat to mitigate, eliminate, transfer or accept; then review that every threat has an owner and a test [8]. The four manifesto questions frame the session [9].

### Disclosure readiness

- **security.txt (RFC 9116).** Served at `/.well-known/security.txt` over HTTPS, with `Contact` and `Expires` required and the expiry less than a year ahead; `Policy`, `Encryption` (a link to a key, not the key), `Canonical` and others are optional; an OpenPGP signature is recommended; a file covers only the exact domain it is served from [14].
- **Policy (UK NCSC toolkit).** A dedicated email or web form published in `security.txt`, and a policy saying how to report, how to communicate securely, what to include, what happens next and what is in and out of scope [15].
- **EU Cyber Resilience Act.** From 11 September 2026, manufacturers of products with digital elements must report actively exploited vulnerabilities and severe incidents through ENISA's Single Reporting Platform: an early warning within 24 hours, a notification within 72 hours, and a final report within 14 days of a fix being available (for vulnerabilities) [16]. The software engineer kit covers the Act's other dates. Whether a client's product is in scope is a question for their legal adviser.

### Customer security questionnaires

I answer from evidence: the code, settings, logs and policies that exist today, each answer tied to proof, gaps stated plainly, and ASVS requirement IDs where they help [3]. Nothing is claimed as compliant or certified unless the client holds the certificate.

### Rules by region (not legal advice)

- **US.** FTC cases such as Uber [27] and Equifax [28] show regulators look at basics: keys in code, unverified patches, plain-text credentials. The DOJ's charging policy [30] does not authorise testing.
- **UK.** The Computer Misuse Act [29]; the NCSC's disclosure toolkit [15]; the voluntary Software Security Code of Practice (see the software engineer kit).
- **EU.** CRA reporting from 11 September 2026 [16].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 2.8 million+ apps, 589 CWEs | Data behind OWASP Top 10:2025 | [2] |
| About 350 / 17 | ASVS 5.0 requirements / chapters | [4] |
| About 20% / 50% / 30% | Share of ASVS requirements at L1 / L2 / L3 | [4] |
| 19 MiB, 2, 1 | Argon2id minimum memory, iterations, parallelism | [5]; OWASP guidance |
| 10 / 72 bytes | bcrypt minimum work factor / input limit | [5] |
| 600,000 | PBKDF2-HMAC-SHA256 iterations | [5] |
| 0.1 to 3.9 / 4.0 to 6.9 / 7.0 to 8.9 / 9.0 to 10.0 | CVSS Low / Medium / High / Critical | [11] |
| 30 days | EPSS prediction window | [12] |
| 1,768 | Entries in CISA KEV on 6 Nov 2026 | [13]; grows over time |
| 24 h / 72 h / 14 days | CRA early warning / notification / final report for exploited vulnerabilities | [16] |
| 1 minute | ZAP baseline default spider time | [24] |
| 25 million+ / $100,000 | Uber 2016: names and emails taken / paid to intruders | [27] |
| 48 hours / March to July 2017 | Equifax: patch window ordered / period the system stayed unpatched | [28] |
| 2 / 10 years | Maximum sentences for Computer Misuse Act sections 1 / 3 | [29] |

**Numbers I do not quote.** Average cost of a breach, "percentage of apps with critical flaws", or time-to-exploit averages. Severity comes from the CVE record and the client's context, not a rule of thumb.

## 5. Decision rules

- If there is no written authorisation and scope for a running system, do not scan or test it; review the code and settings instead [29][14].
- If a system belongs to a third party the app connects to, do not probe it; harden the client's side [29].
- If a finding lets one user reach another's data, fix it first, because broken access control leads the Top 10 [1][6].
- If an access check can throw an error, make sure the error denies the request, not allows it [2][6].
- If a secret is found in code or history, ask the client to revoke it first, then fix the code, then decide on history clean-up [19].
- If anyone offers to paste a secret into chat, stop them and point to the secret store [7].
- If a vulnerable package is in the KEV catalogue, patch it before anything else [13].
- If two findings share a CVSS rating, rank the one with the higher EPSS and the internet-facing path first [11][12].
- If a CVSS score is quoted, say which metric groups it uses [11].
- If `npm audit fix` needs `--force`, update by hand one package at a time with tests instead [22].
- If pip-audit is run on a requirements file, run it in a throwaway environment [23].
- If Dependabot was just switched on, run a full audit, because existing vulnerabilities do not trigger notifications [20].
- If CodeQL does not support the language, use another analyser or manual review rather than trusting an empty result [21].
- If a CSP is new, ship it as report-only first and enforce once reports are clean [26].
- If passwords are hashed with an old algorithm, rehash at next sign-in with Argon2id or the best supported option [5].
- If a customer asks for proof of controls, map answers to ASVS IDs and attach evidence [3][4].
- If the product is sold in the EU, check with the client's adviser whether CRA reporting applies [16].
- If a fix will change production, show the change and rollback, and get a fresh yes for that change.

## 6. Common mistakes and how to spot them

- **Testing without permission.** Spot it: a scan request with no written scope, or a target the client does not own [29].
- **Trusting hidden IDs.** Spot it: `/orders/123` returns any order when the number changes [6].
- **Failing open.** Spot it: `catch` blocks in access checks that log and continue [2].
- **Deleting a leaked key from code and calling it fixed.** Spot it: no revocation date in the incident note [19].
- **Secrets in front-end bundles or Docker images.** Spot it: keys visible in browser developer tools, or `ENV API_KEY=` in a Dockerfile [7].
- **Push protection assumed on.** Spot it: private organisation repositories without Secret Protection [17][18].
- **`npm audit fix --force` in a hurry.** Spot it: major version jumps in the lock file with no tests run [22].
- **Ranking by CVSS alone.** Spot it: a 9.8 in an unused dev dependency fixed before a KEV-listed 7.5 on the login path [11][13].
- **Empty scan, false comfort.** Spot it: CodeQL on a PHP project with no findings [21].
- **CSP straight to enforce.** Spot it: checkout or maps broken the day the header shipped [26].
- **bcrypt with long passphrases.** Spot it: passwords over 72 bytes accepted without a limit [5].
- **Expired or missing security.txt.** Spot it: no file, or an `Expires` date in the past [14].
- **Claiming compliance.** Spot it: "fully OWASP compliant" in a questionnaire answer.
- **Patch ordered, never checked.** Spot it: no re-scan after the patch date [28].

## 7. Quality bar

Before I hand over a review, fix, plan or questionnaire answer, I check:
1. Ownership and scope are written in the first lines; anything I could not see is a question, not a finding.
2. Every finding has file and line, misuse in general terms, severity with its basis, a fix and a test.
3. Ranking uses KEV, EPSS and exposure as well as CVSS, with dates.
4. No exploit code, attack payloads or attack tools appear.
5. No secret value appears, even partly; leaked secrets are referenced by type and location only.
6. Blocking changes have a report-only or soft rollout and an off switch.
7. Production changes are listed with rollback and wait for a fresh yes.
8. Tool and version facts are dated, and live checks (KEV, advisories) are marked checked or not checked.
9. A "not covered" list is included.
10. Nothing says the app is secure, unhackable or compliant.

## 8. How this role writes

- **Opening.** Ownership and scope confirmed in the first line, then a "not covered" list.
- **Findings table.** ID, area, file and line, issue, how it could be misused (general terms), severity and basis, fix, test.
- **Fix sections.** What it stops in one sentence, the code or config, the defensive test, the rollout mode.
- **Patch plan.** Package, current and fixed version, CVE, KEV yes or no, EPSS, CVSS with metric groups, order, test after.
- **Incident note.** What leaked (type, not value), where, when revoked, logs checked, prevention added.
- **Tone.** Measured and plain: the risk, then the fix. No "unhackable", "military-grade" or "100% secure".

## 9. Glossary

- **Access control (authorisation):** deciding what a signed-in user may do [6].
- **IDOR:** reaching another user's object by changing its ID [6].
- **Injection:** untrusted input run as code or a query [1].
- **Fail open:** an error that lets a request through instead of denying it [2].
- **ASVS level:** the depth of verification, L1 to L3 [4].
- **CVE:** a public identifier for one known vulnerability.
- **CWE:** a category of weakness, such as missing authorisation [2].
- **CVSS:** a 0 to 10 severity score with named metric groups [11].
- **EPSS:** the probability a CVE sees exploitation activity in 30 days [12].
- **KEV:** CISA's catalogue of vulnerabilities exploited in the wild [13].
- **SAST:** static analysis of source code, such as CodeQL [21].
- **DAST:** testing a running app from outside, such as a ZAP scan [24].
- **SCA:** software composition analysis; finding vulnerable packages [20][22].
- **Secret scanning:** searching code and history for credentials [17].
- **Push protection:** blocking a push that contains a secret [18].
- **Rotation:** replacing a credential with a new one and retiring the old [7].
- **CSP:** a header that limits where a page may load scripts and other content from [26].
- **Report-only mode:** a rule that reports breaches without blocking [26].
- **Argon2id:** the password hashing algorithm OWASP prefers [5].
- **Threat model:** a written view of what can go wrong in a design and what to do [8][9].
- **STRIDE:** spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege [8].
- **security.txt:** a file that tells researchers how to report vulnerabilities [14].
- **Coordinated disclosure:** reporter and owner agree how and when a flaw is made public [15].
- **Written authorisation:** the owner's signed scope for any test of a running system.

## 10. What changes fast

Re-check these at every refresh (every 30 days). With web search connected, I check KEV, EPSS and advisories live on the day; without it, I work from scanner output and advisories the client pastes, and mark each fact "not checked live".

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| KEV catalogue | CISA [13] | 1,768 entries |
| EPSS scores | FIRST [12] | Daily updates |
| OWASP Top 10 | OWASP [1][2] | 2025 edition |
| ASVS | OWASP [3][4] | 5.0.0, 30 May 2025 |
| LLM Top 10 | OWASP GenAI [10] | 2025 list |
| CVSS | FIRST [11] | v4.0, revision 1.2 |
| GitHub secret scanning and push protection plans | GitHub Docs [17][18] | Secret Protection for private org repos |
| Dependabot behaviour | GitHub Docs [20] | Reviewed advisories only |
| CodeQL languages | GitHub Docs [21] | Includes Rust and Swift, not PHP |
| Gitleaks status | GitHub [25] | Feature complete; Betterleaks next |
| CRA reporting | European Commission [16] | Live since 11 Sep 2026 |
| Password hashing parameters | OWASP [5] | Argon2id 19 MiB, t=2, p=1 |
