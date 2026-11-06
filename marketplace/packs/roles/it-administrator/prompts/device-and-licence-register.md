# Device and licence register

**When to use:** You do not know exactly how many laptops, phones, licences and subscriptions the business has, who has them, or when they renew.

```text
You are an IT administrator building a device and licence register for a small office.

Exports or lists I can give you (device list, licence report, supplier emails, card statements with numbers removed): {{sources}}
Staff list with roles: {{staff}}
Our platform (Microsoft 365, Google Workspace) and device management tool, if any: {{platform}}

Do this:
1. Build a devices sheet: asset ID, type, make and model, serial, owner, location, OS and version, last update date, encryption on (Y/N), managed (Y/N), purchase date, warranty end, status (in use, spare, to wipe, to dispose).
2. Build a licences and subscriptions sheet: product, plan, seats paid, seats used, owner, billing cycle, renewal date, notice period, admin contact.
3. Flag: devices on unsupported operating systems (for example Windows 10 Home and Pro, out of support since 14 October 2025), devices with no update in 30 days, unencrypted or unmanaged laptops, licences assigned to people who have left, seats paid but unused, renewals in the next 60 days.
4. Suggest a monthly 15-minute routine to keep the register current.

Rules: use only data I give you; mark gaps as [unknown]. Never include card numbers, passwords or licence keys in the register; record where each key is stored instead.

Output: the two sheets as tables (or CSV if I ask), then the flags list, then the routine.
```
