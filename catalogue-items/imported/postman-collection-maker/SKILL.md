---
name: postman-collection-generator
description: "Generate complete, import-ready Postman Collection v2.1 JSON files from natural language API descriptions or cURL commands."
risk: critical
source: https://github.com/LambdaTest/agent-skills/tree/main/api-skill/postman/postman-collection-generator
source_repo: LambdaTest/agent-skills
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/LambdaTest/agent-skills/blob/main/LICENSE
---

# Postman Collection Generator
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your API spec** (yours): the API's endpoints, data shapes, sign-in method and errors, such as an OpenAPI file.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your API spec. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

Use this skill when you need generate complete, import-ready Postman Collection v2.1 JSON files from natural language API descriptions or cURL commands. Use this skill whenever the user describes an API in plain English ("I have a REST API with these endpoints..."), pastes cURL commands, or asks to "create a Postman collection".


Generates a valid, import-ready **Postman Collection v2.1** JSON from:
- Natural language API descriptions
- cURL commands (one or many)
- Mixed input (some endpoints described, some as cURL)

---

## When not to use

- The API already has an OpenAPI file: import that file into Postman directly.
- The API is GraphQL or SOAP: this skill follows REST habits, so build those requests by hand.
- You want automated tests or a live run: add tests in Postman after you import the collection.

## Gather first

- The endpoints, as a plain description or cURL commands.
- The base URL and the sign-in type (bearer token, basic, API key or none).
- Sample request bodies, if you have them.
- Never ask for real tokens, passwords or API keys. Leave their values empty in the environment file for the user to fill in inside Postman.

---

## Step 1 — Extract API Information

Parse the user's input and extract for **each endpoint**:

| Field | Source |
|---|---|
| Name | Described name or inferred from path |
| Method | Explicit or inferred (GET for fetches, POST for creates, etc.) |
| URL | Full URL or path; use `{{base_url}}` variable for the host |
| Headers | From cURL `-H` flags or described headers |
| Auth | Bearer token, Basic, API Key, or None |
| Body | From cURL `-d` / `--data` / `--data-urlencode` / `-F`, or a described payload. Keep the encoding: JSON stays `raw`, URL-encoded stays `urlencoded`, multipart stays `formdata` (see the cURL table) |
| Query params | From URL `?key=value` or described filters |

If input is ambiguous, make reasonable REST conventions and note assumptions at the end.

---

## Step 2 — Build the Collection JSON

Use this exact v2.1 structure:

```json
{
  "info": {
    "name": "<Collection Name>",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_postman_id": "<generate a UUID v4>",
    "description": "<brief description>"
  },
  "variable": [
    { "key": "base_url", "value": "<extracted base URL or placeholder>", "type": "string" }
  ],
  "auth": <collection-level auth if shared across requests, else null>,
  "item": [ <request items or folders> ]
}
```

### Request item structure:
```json
{
  "name": "Get Users",
  "request": {
    "method": "GET",
    "header": [
      { "key": "Content-Type", "value": "application/json" }
    ],
    "url": {
      "raw": "{{base_url}}/users",
      "host": ["{{base_url}}"],
      "path": ["users"],
      "query": []
    },
    "body": null,
    "auth": null,
    "description": ""
  },
  "response": []
}
```

### Body (when present):
```json
"body": {
  "mode": "raw",
  "raw": "{\n  \"key\": \"value\"\n}",
  "options": { "raw": { "language": "json" } }
}
```

URL-encoded body (from `--data-urlencode`, or `-d 'a=1&b=2'` without a JSON content type):
```json
"body": {
  "mode": "urlencoded",
  "urlencoded": [
    { "key": "a", "value": "1" },
    { "key": "b", "value": "2" }
  ]
}
```

Multipart body (from `-F`):
```json
"body": {
  "mode": "formdata",
  "formdata": [
    { "key": "name", "value": "value", "type": "text" }
  ]
}
```

### Grouping:
- Group related endpoints into **folders** using the `item` array nested inside an item with `"name"` but no `"request"` key.
- Use logical grouping: by resource (Users, Orders) or by feature.

---

## Step 3 — Environment Variables

Always extract these into a companion **Postman Environment** file:
- `base_url` — the API host
- Any tokens, API keys, or IDs mentioned

```json
{
  "id": "<uuid>",
  "name": "<Collection Name> Environment",
  "values": [
    { "key": "base_url", "value": "<value>", "enabled": true },
    { "key": "api_key", "value": "", "enabled": true }
  ],
  "_postman_variable_scope": "environment"
}
```

---

## Step 4 — Output

1. Output the **Collection JSON** in a code block labeled `collection.json`
2. Output the **Environment JSON** in a code block labeled `environment.json`
3. List any **assumptions** made (inferred methods, placeholder values, etc.)
4. Provide **import instructions**:
   > Import via Postman → File → Import → paste or upload the JSON

---

## cURL Parsing Reference

| cURL flag | Maps to |
|---|---|
| `-X POST` | method |
| `-H "Key: Value"` | header |
| `-d '{"a":1}'` with `-H "Content-Type: application/json"` | body `mode: raw`, language json |
| `-d 'a=1&b=2'` with no JSON content type | body `mode: urlencoded` (curl's default for `-d` is `application/x-www-form-urlencoded`, per the curl manual at curl.se/docs/manpage.html) |
| `--data-urlencode 'a=b c'` | body `mode: urlencoded`, with the decoded value (`b c`) as the value; Postman encodes it when sending |
| `-F 'a=1'` / `--form` | body `mode: formdata` (multipart/form-data) |
| `-u user:pass` | Basic auth |
| `--oauth2-bearer <token>`, or `-H "Authorization: Bearer <token>"` | Bearer auth, with the value as `{{token}}` |
| `?key=val` in URL | query params |

---

## Quality Checklist

Before outputting, verify:
- [ ] Schema URL is exactly `https://schema.getpostman.com/json/collection/v2.1.0/collection.json`
- [ ] All URLs use `{{base_url}}` variable, not hardcoded hosts
- [ ] JSON is valid (no trailing commas, balanced braces)
- [ ] Every request has at least `method`, `url`, and `header` fields
- [ ] Auth tokens are variables (`{{token}}`), not hardcoded values
- [ ] Each body keeps the cURL encoding: `--data-urlencode` and plain `-d key=value` become `urlencoded`, `-F` becomes `formdata`, JSON becomes `raw`


---

## After Completing the Postman Collections

Once the API design output is delivered, ask the user:

"Would you like me to write an OpenAPI spec for this collection? (yes/no)"

If the user says **yes**:
- Write the OpenAPI spec by hand from the collection output above. Mark any value you had to guess.

If the user says **no**:
- End the task here

---

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [API spec writer](https://useaiblocks.com/skills/api-spec-writer).
- The [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
