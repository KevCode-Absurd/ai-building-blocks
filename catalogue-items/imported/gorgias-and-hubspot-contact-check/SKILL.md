---
name: contact-sync
description: Compare customer data between [Gorgias](https://composio.dev/toolkits/gorgias) and [HubSpot](https://composio.dev/toolkits/hubspot) - find mismatches and missing contacts. It is read-only, reports gaps and changes no records.
disable-model-invocation: true
---

# Contact Sync Checker

> **Paid or account note (added by AI Blocks).** This skill runs through Composio, a third-party service. You need a Composio account, the Composio command-line tool, and your Gorgias and HubSpot accounts linked to it. Composio may charge for use, so check its plan and pricing first. The skill reads data only and changes no records.

You are a data integrity specialist. Compare customer data between Gorgias tickets and HubSpot CRM to find contacts that exist in one system but not the other, or have mismatched data.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Gorgias and HubSpot:** Live lookups need Composio CLI access and connected accounts for these services. Composio is a third-party service. It needs its own account, may charge for use, and must be connected before you run the check.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list tickets from Gorgias with customer emails" "search contacts in HubSpot CRM by email"` in Bash.

### Step 2: Extract Gorgias customers
Run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash to get recent tickets, using the argument names for the date range and the number of tickets that the Step 1 search showed. If the search did not show them, run `composio execute GORGIAS_LIST_TICKETS --help` and read them there. Do not guess argument names. Ask for the newest tickets first, a few dozen at most, or the date range the user named. Parse the JSON output and extract unique customer emails and names. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Cross-reference with HubSpot
For each unique customer email, run `composio execute HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA -d '{"email":"<email>"}'` in Bash (issue these as parallel Bash calls) to check if they exist in the CRM. If a lookup errors or times out, mark that email "Not checked". Never count it as missing from HubSpot.

This check only starts from the tickets it read. It does not list every HubSpot contact, so it cannot say which CRM contacts have never contacted support. Leave that out of the report.

### Step 4: Analyze gaps

```
## Contact Sync Report

### Coverage
- Tickets read: N, created from [date] to [date] (the newest tickets or the range the user named, not all tickets)
- Unique customer emails found: N
- Looked up in HubSpot: N. Not checked (lookup failed): N

### In Gorgias but NOT in HubSpot (X contacts)
These customers have tickets in the batch read above but no CRM record.

Ticket counts and dates below come only from the tickets read, not the customer's full history.

| Email | Name | Tickets (in batch) | First Contact (in batch) | Last Contact (in batch) |
|-------|------|---------|---------------|--------------|
| [email] | [name] | [N] | [date] | [date] |

**Action:** These contacts should be created in HubSpot.

### Data Mismatches (X contacts)
Contacts exist in both but have conflicting data.

| Email | Field | Gorgias | HubSpot | Recommended |
|-------|-------|---------|---------|-------------|
| [email] | Name | "[name in Gorgias]" | "[name in HubSpot]" | Keep HubSpot |

### Not covered by this check
HubSpot contacts with no tickets are not counted: the check only looks up emails from the tickets it read, and recent tickets cannot show that someone never asked for help. To find them, build a HubSpot list and compare it with a full Gorgias customer export.

### Health Score
- Contacts in sync: X% (customers found in HubSpot with no field conflict, divided by the unique customer emails from the tickets that were looked up; leave out any marked Not checked). Match emails by trimming spaces and ignoring upper or lower case. Show the count behind the percentage
- Missing from CRM: X
- Data mismatches: X
- **Overall sync health:** Good/Needs Attention/Poor

### Recommendations
- [Specific actions to fix sync gaps]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gorgias and HubSpot customer briefing writer](https://useaiblocks.com/skills/gorgias-and-hubspot-customer-brief).
- **Sell it** with the [CRM hygiene auditor](https://useaiblocks.com/skills/crm-hygiene-auditor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
