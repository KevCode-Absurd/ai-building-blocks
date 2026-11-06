---
name: browser-extension-build
description: Builds, fixes or reviews a small Manifest V3 browser extension for Chrome, Edge or Firefox that saves a team repeated clicks on sites they own or are allowed to automate. Chooses the fewest parts (content script, popup, service worker or event page, options page), asks for the narrowest permissions such as activeTab, keeps all code in the package, sends no data anywhere unless the brief says where, and gives load-unpacked test steps. Use it for internal tools, Manifest V2 to V3 moves, broken extensions and permission reviews.
---

# Browser extension build

## When to use

- A team repeats the same clicks every day on a site they own or are allowed to automate: copying data between two of their own web apps, filling a form from a template, adding a button to an internal tool.
- An old Manifest V2 extension stopped working in Chrome.
- An extension broke after a site changed its layout.
- A permissions and data-handling review before publishing.

Not for scraping sites against their terms, collecting browsing data, ad injection, tracking, or anything hidden from the user. Publishing to the extension stores needs level 3 access to the owner's developer account; without it, the owner publishes.

## What you need

1. The job as a short story: who clicks what, on which site, how often, and what they want instead.
2. Confirmation that the site is the client's own or one they are allowed to automate.
3. Browsers to support: Chrome, Edge, Firefox.
4. The page structure: saved HTML of the target page or screenshots with the elements named. Remove personal data first.
5. For a fix or move: the current `manifest.json`, scripts and console errors.

**Access:** level 1 to read the current extension and saved pages; level 2 to put the files on a branch or open a pull request; level 3 to submit to the extension stores from the owner's developer account, within your limits.

## Steps

### 1. Write the story and the clicks it replaces

One sentence: "When a support agent opens a ticket in our helpdesk, they want a button that copies the order number into our order tool." List the clicks today and after.

### 2. Choose the fewest parts

| Part | Use it when |
|---|---|
| Content script | You need to read or change the page the user is on |
| Popup | The user starts the action from the toolbar |
| Background service worker (Chrome) or event page (Firefox) | You need to react to browser events or pass messages |
| Options page | Users must set preferences |

Leave out anything the story does not need.

### 3. Ask for the fewest permissions

- Prefer `activeTab`: access to the current tab only after the user clicks the extension, with no install warning.
- If the tool must run without a click, use host permissions limited to the exact sites, such as `https://helpdesk.example.com/*`, never `<all_urls>`.
- Add `storage` only if settings must be saved; `scripting` only if injecting on click.
- Explain each permission in one plain sentence for the README and the store listing.

### 4. Write every file in full

- `manifest.json` with `"manifest_version": 3`.
- All logic inside the package. No remote scripts and no `eval` of fetched code; fetching data or settings is fine.
- Settings in `chrome.storage` (or `browser.storage` in Firefox).
- No network calls unless the brief names the destination and says why.

### 5. Cope with pages that change

Wait for elements to appear, handle missing elements without throwing, never block or break the page, and keep selectors in one place so they are easy to update.

### 6. Handle Firefox differences

Firefox supports Manifest V3 but uses event-driven background scripts, not service workers. Since Firefox 127 it shows host permissions at install, but users can revoke them later, so check permissions before use and ask again if needed.

### 7. Test steps

- Chrome: open `chrome://extensions`, turn on Developer mode, Load unpacked, choose the folder.
- Firefox: open `about:debugging`, This Firefox, Load Temporary Add-on, choose `manifest.json`.
- Try each feature, check the page console and the service worker console, test on a page where the target element is missing.

## Checks before handing over

- Every API used exists in Manifest V3 for the target browsers.
- Permissions are the narrowest that work, and each has a one-line reason.
- No remote code; no data leaves the browser unless the brief says where.
- The file tree matches the manifest; every file referenced exists.
- Site names and selectors come from the brief or the saved page, not guesses.
- For store publishing: a single clear purpose and, if user data is handled, a privacy policy is needed. The owner publishes, or I do with level 3 access.

## Output format

1. The story and clicks saved.
2. Parts chosen and why.
3. Permissions table: permission, why, what the user sees at install.
4. File tree and every file in full.
5. Load and test steps for each browser.
6. README text for the team: what it does, permissions in plain words, settings, troubleshooting.
7. Not verified, and what to watch when the site changes.

## Example of good output (short)

*Made-up business for illustration: "Northgate Plumbing Supplies", using its own helpdesk and order tool.*

> **Story.** When an agent opens a ticket, they click "Open order" in the toolbar and the order opens in our order tool. Saves four clicks and one copy-paste per ticket.
>
> | Permission | Why | Install warning |
> |---|---|---|
> | `activeTab` | Read the order number from the open ticket only when you click | None |
> | `scripting` | Run the small script that reads the number | None with activeTab |
>
> No host permissions, no storage, no network calls. The order tool opens with `chrome.tabs.create` using the address in the brief.
>
> **Not verified.** I worked from a saved copy of the ticket page. If the helpdesk changes the order number field, update `SELECTORS.orderNumber` in `content.js`.
