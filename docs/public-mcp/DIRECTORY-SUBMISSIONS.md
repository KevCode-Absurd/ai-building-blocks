# Listing the public MCP server in AI directories

Where the public server (`https://useaiblocks.com/mcp`, no sign-in, read-only) is listed, and the exact text to paste into each portal. Keep this file in step with what was actually submitted.

| Directory | Status | How it's updated |
|---|---|---|
| Official MCP Registry (`com.useaiblocks/library`) | Published by `node tools/publish-mcp-registry.mjs publish` | Bump `version` in `server.json`, then run the script again. The domain proof is served at `/.well-known/mcp-registry-auth`; the private key lives outside the repo in `.mcp-registry-ed25519.pem` next to the repo folder. |
| Claude Connectors Directory | Kevin submits at claude.ai/directory/manage (needs a paid Claude plan and his sign-in) | Edit the listing in the same portal |
| ChatGPT apps directory | Kevin verifies his identity or business in the OpenAI Platform dashboard first, then submits | Edit in the OpenAI dashboard |

Directories that copy from the official registry (Glama, PulseMCP, and others) pick the server up on their own.

## Before submitting anywhere

- Every tool has a `title` and explicit `readOnlyHint`, `destructiveHint`, `idempotentHint` and `openWorldHint` (all tools are read-only). Checked by `site/test/public-mcp-v2.test.mjs`.
- Docs: https://useaiblocks.com/api-and-mcp
- Privacy policy: https://useaiblocks.com/privacy (the "Connected AI (API and MCP)" item says what the server receives)
- Terms: https://useaiblocks.com/terms
- Support: hello@useaiblocks.com, https://useaiblocks.com/support
- Safety method: https://useaiblocks.com/how-we-check-safety
- Icon: https://useaiblocks.com/icon-512.png (512 × 512 PNG)
- Test it as a custom connector in Claude and in ChatGPT and call every tool once before you submit. Both portals ask you to confirm this.

## Claude Connectors Directory (claude.ai/directory/manage → Submit new → MCP connector)

**1. Connection:** `https://useaiblocks.com/mcp` (one URL for everyone).

**2. Tools:** they sync from the server. Expect them all under read-only.

**3. Listing**

- **Server name (≤100):** AI Blocks
- **One-liner (≤200):** Find free, safety-checked AI skills, workflows and prompts for business tasks, and load the right one into Claude when you need it.
- **Description (≤2,000):**

  AI Blocks is a free library of AI building blocks for business work: skills, prompts, workflows and specialist agents for marketing, sales, ecommerce, finance, operations and more.

  Connect it once and ask Claude for help with a task. Claude searches the library, picks the best match, and loads only that item's instructions when it needs them. For a bigger job, it can plan a multi-step workflow from library steps and check that each step's output fits the next step's input.

  What you can ask:
  - "Find a skill to write ad angles from my customer reviews."
  - "Plan a workflow for a weekly sales report I can check."
  - "What's new in the library this week for ecommerce?"

  It's read-only and needs no account. It never changes anything in your accounts or on your computer; your own Claude does the work with your files and tools. Every item is scanned for harmful code and hidden instructions, and each item's page lists its safety guardrails (useaiblocks.com/how-we-check-safety). Imported items credit their original authors and licences.

- **Categories:** Productivity; Business; Marketing (pick the closest the portal offers)
- **Documentation URL:** https://useaiblocks.com/api-and-mcp
- **Privacy policy URL:** https://useaiblocks.com/privacy
- **Support contact:** hello@useaiblocks.com
- **Icon:** icon-512.png
- **Slug (permanent):** ai-blocks

**4. Use cases:** finding a ready-made skill or prompt for a business task; planning a multi-step workflow from tested steps; loading one item's full instructions just in time. Users need nothing first: no account, plan or setup. Reads data only.

**5. Company:** AI Blocks (operated by Kevin Mark), https://useaiblocks.com, contact hello@useaiblocks.com.

**6. Authentication:** No authentication. (The personal and company endpoints use OAuth and are separate; don't list them here.)

**7. Data handling:** our own API. No personal health data. No sponsored content.

**8. Test & launch:** "No account is needed. Add https://useaiblocks.com/mcp as a custom connector and ask: 'Use AI Blocks to find a skill for writing product descriptions, then load it.' search_library returns matches, get_skill loads one. For plan_workflow, ask: 'Plan a workflow to turn customer reviews into ad copy.'" Confirm you ran every tool.

**9. Compliance:** seven acknowledgements. Read each one; the relevant facts are that it makes no financial transactions, generates no media, and collects no conversation data.

## ChatGPT apps directory

Before submitting, Kevin must verify as an individual or business in the OpenAI Platform dashboard (general settings). We can't do that step for him.

- **Name:** AI Blocks (don't add "MCP" or "Plugin")
- **Description:** Find free AI skills, workflows and prompts for business tasks, and load the right one into ChatGPT when you need it. Read-only, no account needed.
- **Example prompts:**
  1. Find a skill to write ad angles from my customer reviews.
  2. Plan a workflow for a weekly sales report I can check.
  3. Load the AI Blocks onboarding plan skill and use it for my new hire.
- **Privacy policy:** https://useaiblocks.com/privacy
- **Support:** hello@useaiblocks.com
- **Test account:** none needed (no sign-in).
- Test in ChatGPT on desktop and mobile before submitting, as OpenAI requires.

## Risks a reviewer may raise

- **Minds of real, living people.** The public server can return "minds" built from public sources about real people. OpenAI's rules say to use only intellectual property you own or have permission to use, and both companies ban impersonation. If a reviewer objects, the fastest fix is to leave minds out of the public server's results. Decide this before submitting.
- **"Not a feature ChatGPT already has."** OpenAI rejects apps that duplicate built-in features. Lead with the library and workflow checks, not general chat.
