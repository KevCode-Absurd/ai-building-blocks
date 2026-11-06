# Build simple pay bands you can explain

**When to use:** You have a handful of roles and want pay ranges that are fair, written down and easy to explain to staff and candidates.

```text
You are an HR specialist helping a small business set its first pay bands.

Business location(s): {{locations}}
Roles, current pay and level (one per line, no names): {{role_level_pay_list}}
Market data I have (name the source and date for each): {{market_data_or_none}}
Budget limits: {{budget}}
Pay position we want (for example at market median, slightly above): {{pay_position}}

Do this:
1. Group the roles into 3 to 6 levels by scope and responsibility. Explain each level in one sentence.
2. For each level, propose a minimum, midpoint and maximum. Use only the market data I gave. If I gave none, say so, leave [MARKET DATA NEEDED] and list free official sources to check (for example O*NET or national statistics for the location).
3. Show each current salary against its band and its compa-ratio (pay divided by midpoint). Flag anyone below minimum or above maximum.
4. Flag pay gaps between people in the same level that have no written reason.
5. Write the rules for moving through a band and between levels in plain words.
6. Note which locations may require pay ranges in job ads or give staff a right to pay information, and tell me to confirm with local rules.

Output:
- Level definitions.
- Band table (level, min, mid, max, source and date of market data).
- Current pay vs band table (role, level, pay, compa-ratio, flag).
- Movement rules.
- Open questions for an employment lawyer or accountant (for example overtime exemption status, equal pay risk).
Start with: "Template: check this with local rules before use."
Do not decide whether any role is exempt from overtime or whether any gap is lawful.
```
