---
name: support-metrics
description: Generate a support metrics summary from [Gorgias](https://composio.dev/toolkits/gorgias) tickets and optionally push to [Google Sheets](https://composio.dev/toolkits/googlesheets)
disable-model-invocation: true
---

# Support Metrics Dashboard

You are a support analytics specialist. Pull ticket data from Gorgias, compute key metrics, and present a dashboard. Optionally export to [Google Sheet](https://composio.dev/toolkits/googlesheets)s.

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
- **Gorgias:** Live lookups need Composio CLI access and your Gorgias account linked through Composio.
- **Google Sheets and Google Drive:** Only for the optional export. Link your Google account through Composio. The skill looks in Drive for an existing sheet first.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list all support tickets from Gorgias with filtering by date" "get ticket details and tags from Gorgias" "create or update a Google Sheet with data"` in Bash.

### Step 2: Get tool schemas
Run `composio execute <SLUG> --get-schema` in Bash (in parallel) for:
- `GORGIAS_LIST_TICKETS`
- `GORGIAS_GET_TICKET`
- `GORGIAS_LIST_TICKET_TAGS`
- `GOOGLESHEETS_CREATE_GOOGLE_SHEET1`
- `GOOGLESHEETS_BATCH_UPDATE`
- `GOOGLEDRIVE_FIND_FILE`

### Step 3: Fetch ticket data
Run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash to pull tickets for the dates the user gave, using the argument names from the schema you fetched in Step 2. Paginate through results, but stop at 100 tickets for the reporting period. This means every count below covers at most the first 100 tickets, not the whole period. If the period holds more, say so and show the figure as "first 100 tickets". If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 4: Enrich with details
Choose the sample as the 20 most recently created tickets in the period (or all of them if there are fewer), and say so in the report. Calculate first response time as the time from the customer's first message to the first reply from an agent, and resolution time as the time from the first message to the closing time, both read from message timestamps. For each sampled ticket, run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash as parallel calls to get message-level data for response time calculations.

### Step 5: Compute metrics
Calculate and present:

```
## Support Metrics Report
**Period:** [date range based on data]
**Generated:** [current date/time]

### Volume
- Total Tickets: X (this is the capped count of up to 100 tickets, not the full total for the period; say "100+ in the period" if you hit the cap)
- Open: X | Pending: X | Closed: X
- New (last 24h): X
- New (last 7d): X

### Response Performance
- Sample note: volume counts cover up to 100 tickets in the period; the times below come from a sample of up to 20 tickets, so treat them as a rough guide, not a full-queue figure. State the real counts.
- Avg First Response Time: Xh Xm (sample)
- Median First Response Time: Xh Xm (sample)
- Avg Resolution Time: Xh Xm (sample)

### Breakdown by Category
| Category | Count | % | Avg Resolution |
|----------|-------|---|----------------|

### Breakdown by Tag
| Tag | Count | % |
|-----|-------|---|

### Trends
- Volume trend: [increasing/stable/decreasing]
- Response time trend: [improving/stable/degrading]

### Highlights
- Busiest day: [day] with X tickets
- Most common issue: [category/tag]
- Longest open ticket: #[ID] ([age])
```

### Step 6: Export to Google Sheets (if requested)
If the user wants to export:
1. Run `composio execute GOOGLEDRIVE_FIND_FILE -d '{"name":"Support Metrics"}'` in Bash to check for an existing sheet
2. Parse the JSON output. If not found, run `composio execute GOOGLESHEETS_CREATE_GOOGLE_SHEET1 -d '{"title":"Support Metrics"}'` in Bash and extract the sheet ID
3. Run `composio execute GOOGLESHEETS_BATCH_UPDATE -d '{"spreadsheet_id":"<id>","data":[...]}'` in Bash to write headers and data rows
4. Share the sheet link with the user

Ask the user: "Would you like me to export this to a Google Sheet?"

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gorgias weekly support reporter](https://useaiblocks.com/skills/gorgias-weekly-support-report).
- The [Gorgias support queue action planner](https://useaiblocks.com/skills/gorgias-support-queue-action-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
