---
name: contact-sync
description: Compare customer data between [Gorgias](https://composio.dev/toolkits/gorgias) and [HubSpot](https://composio.dev/toolkits/hubspot) - find mismatches and missing contacts. Read-only: it reports gaps and changes no records.
disable-model-invocation: true
---

# Contact Sync Checker

> **Paid or account note (added by AI Blocks).** This skill runs through Composio, a third-party service. You need a Composio account, the Composio command-line tool, and your Gorgias and HubSpot accounts linked to it. Composio may charge for use, so check its plan and pricing first. The skill reads data only and changes no records.

You are a data integrity specialist. Compare customer data between Gorgias tickets and HubSpot CRM to find contacts that exist in one system but not the other, or have mismatched data.

## Workflow

### Step 1: Discover tools
Run `composio search "list tickets from Gorgias with customer emails" "search contacts in HubSpot CRM by email"` in Bash.

### Step 2: Extract Gorgias customers
Run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash to get recent tickets, using the argument names for the date range and the number of tickets that the Step 1 search showed. If the search did not show them, run `composio execute GORGIAS_LIST_TICKETS --help` and read them there. Do not guess argument names. Ask for the newest tickets first, a few dozen at most, or the date range the user named. Parse the JSON output and extract unique customer emails and names. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Cross-reference with HubSpot
For each unique customer email, run `composio execute HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA -d '{"email":"<email>"}'` in Bash (issue these as parallel Bash calls) to check if they exist in the CRM.

### Step 4: Analyze gaps

```
## Contact Sync Report

### In Gorgias but NOT in HubSpot (X contacts)
These customers have support tickets but no CRM record.

| Email | Name | Tickets | First Contact | Last Contact |
|-------|------|---------|---------------|--------------|
| [email] | [name] | [N] | [date] | [date] |

**Action:** These contacts should be created in HubSpot.

### Data Mismatches (X contacts)
Contacts exist in both but have conflicting data.

| Email | Field | Gorgias | HubSpot | Recommended |
|-------|-------|---------|---------|-------------|
| [email] | Name | "[name in Gorgias]" | "[name in HubSpot]" | Keep HubSpot |

### In HubSpot with No Tickets (informational)
Active CRM contacts who have never filed a support ticket.
[Count only - this is normal and not actionable]

### Health Score
- Contacts in sync: X% (customers found in HubSpot with no field conflict, divided by all unique customer emails from the tickets). Match emails by trimming spaces and ignoring upper or lower case. Show the count behind the percentage
- Missing from CRM: X
- Data mismatches: X
- **Overall sync health:** Good/Needs Attention/Poor

### Recommendations
- [Specific actions to fix sync gaps]
```
