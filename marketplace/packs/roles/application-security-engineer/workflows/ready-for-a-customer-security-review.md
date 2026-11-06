# Ready for a customer security review

**Trigger:** A larger customer sends a security questionnaire, asks for a security review or penetration test report, or asks "which standard do you follow?" before signing. Usually two to four weeks of part-time work, depending on what already exists.

## Steps

1. **Agree access, scope and goal (level 1).** Ask which access level the client grants for the code host, CI and hosting, and the limits. Confirm ownership of every system in scope. Read the customer's questionnaire or request and the deadline.
2. **Threat model (level 1).** Run the `threat-model-in-four-questions` prompt with the client's team. It gives the system diagram and the top risks the customer will ask about.
3. **Pick the yardstick (level 1).** Use OWASP ASVS 5.0 to scope: Level 1 as the starting set, Level 2 where the customer or the data calls for it. List the requirements that apply and mark each met, partly met or not met, with evidence.
4. **Secure code review (levels 1 and 2).** Run the `secure-code-review` skill on the areas the threat model ranks highest (sign-in, access control, payments, personal data). Fixes go in pull requests with tests. *Approval: a named reviewer.*
5. **Close the quick gaps (levels 2 and 3).** Use `hardening-with-safe-rollout` for headers, sessions and password storage; `leaked-secret-response` for any secrets; `vulnerability-triage-and-patch-order` for packages; the `security-checks-in-ci` workflow if there are no automatic checks. *Approval: a fresh yes for each production change.*
6. **Disclosure basics (level 2).** Use the `security-txt-and-disclosure-policy` prompt. Publishing the file and policy page is a production change. *Approval: a fresh yes.*
7. **Penetration test, if the customer asks for one.** This role prepares for it; an independent tester does it. Help the client write the scope with the `written-authorisation-and-scope` prompt, and hand the tester the threat model and ASVS mapping. Any scan I run myself needs the owner's written authorisation and scope first.
8. **Answer the questionnaire (level 1).** Use the `security-questionnaire-answers` prompt with the evidence gathered. Every answer is backed by evidence or marked as a gap with a plan. Nothing claims certification or compliance the client does not hold. *Approval: the client signs off every answer, and sending the answers to the customer needs a fresh yes, even at level 3, because they are claims the client will be held to.*
9. **Report.** What was found and fixed, what remains with dates, the ASVS mapping, evidence index, and the action log.

## Outputs

- Threat model with diagram and ranked risks
- ASVS 5.0 requirement mapping with evidence
- Code review findings and fix pull requests
- Hardening, patch and secret changes (applied or waiting for approval)
- security.txt and disclosure policy
- Draft questionnaire answers with evidence index and gap list
- Action log

## Needs the client's approval

The access level and limits; every pull request (a named reviewer); a fresh yes for each production change, including publishing security.txt; written authorisation and scope before any scan of a running system; sign-off on every questionnaire answer and a fresh yes before the answers go to the customer. Legal or contract questions go to the client's adviser. The client can lower the access level at any time.
