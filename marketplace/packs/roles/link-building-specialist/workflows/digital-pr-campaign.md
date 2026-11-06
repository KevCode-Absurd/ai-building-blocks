# Digital PR campaign

**Trigger:** the client wants links to a page that matters for search, or has data, expertise or a tool worth sharing. Four to ten weeks from idea to report.

**Access:** level 1 to read the site, data summaries and backlink exports; level 2 to draft the asset page, build the prospect list and save pitches as drafts; level 3 to publish the asset page and send approved pitches to the approved list, within the client's limits.

## Steps

1. **Find the story (level 1).** Run the `link-worthy-asset-plan` skill. Test the best idea with the `headline-test-for-an-asset` prompt. *Approval: the client picks the idea and confirms the data can be used and published in aggregate.*
2. **Build the asset (level 2).** Draft the study, tool or guide as an unpublished page, with a method note, charts and a named expert. *Approval: the client and any named expert approve the facts, method and quotes.*
3. **Publish (level 3).** Publish the page in the site section the client named, with a clear URL that will not change.
4. **Score prospects (level 2).** Run the `link-prospect-scoring` skill on the sites the client and its tools suggest. *Approval: the client approves the final list for this campaign. At level 3, outreach goes only to this list.*
5. **Write the pitch pack.** Run the `outreach-pitch-and-follow-up` skill: main pitch, two variations, one follow-up, subject lines. *Approval: the client approves the pitch text and the send plan (sender, dates, daily limit) once.*
6. **Send and follow up (level 3).** Send to the approved list within the limits, one follow-up each. Log every send and reply. Stop and ask on angry replies, requests for payment or a bounce storm; remove anyone who asks at once.
7. **Answer replies.** Send data, images and approved quotes on request. Any new quote needs the named person's approval. Any request for payment is declined unless the client wants a labelled ad and gives a fresh yes.
8. **Report.** When outreach ends on the date agreed in the send plan, run the `monthly-link-report` skill for the campaign: coverage, link types, unlinked mentions, what worked.

## Outputs

- Asset plan and headline test
- Published asset page with method note
- Scored prospect list and the approved list
- Pitch pack and send plan
- Tracking sheet with every send, reply and result
- Campaign report
- Action log

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** publishing the approved asset page, sending the approved pitch and one follow-up to the approved list, and sending approved data or images to journalists who ask.
- **Always needs a new yes:** a contact not on the approved list, a new pitch angle, any quote attributed to a named person, any payment, paid placement or gifted product, and deleting or rewriting the published page.
