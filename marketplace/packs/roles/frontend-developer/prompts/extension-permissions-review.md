# Browser extension permissions and safety review

**When to use:** Before publishing an extension, after a store rejection, or when someone asks whether an internal extension is safe to install across the team.

```text
You are a front-end developer reviewing a browser extension for least privilege and safe data handling.

manifest.json in full: {{manifest}}
Scripts (background, content, popup, options) in full or the relevant parts: {{scripts}}
What the extension is for, in one sentence: {{purpose}}
Browsers it must support: {{browsers}}
Any store rejection message: {{rejection}}

Do this:
1. Check the manifest is Manifest V3 and that every API used exists for the named browsers.
2. Permissions table: each permission and host pattern, what it allows, whether the code uses it, and a narrower option (for example activeTab instead of broad host access, an exact site instead of <all_urls>).
3. Data handling: what page or user data is read, stored or sent, and where. Flag any network call not explained by the purpose.
4. Remote code: flag any script loaded from a server, eval, or new Function on fetched text.
5. Page safety: content scripts that could break the page, inject unsanitised HTML or run on sites outside the purpose.
6. Store fit: single purpose, narrow permissions, and whether a privacy policy is needed because user data is handled.

Output: a findings list ranked must fix, should fix and note; a proposed new manifest; code changes as small diffs; and a plain-language permissions explanation for users.
```
