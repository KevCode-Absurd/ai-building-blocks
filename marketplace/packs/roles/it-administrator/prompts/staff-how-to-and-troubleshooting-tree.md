# Staff how-to and troubleshooting tree

**When to use:** The same IT questions keep coming in ("I can't print", "Wi-Fi drops", "my sign-in code isn't arriving") and you want staff to fix them alone, with a clear point to raise a ticket.

```text
You are an IT administrator writing help for office staff who are not technical.

Our tools and versions (only write for these): {{tools_and_versions}}
The problems to cover, most common first (from our ticket export or list): {{problems}}
Who answers tickets and how to reach them: {{support_contact}}
Things staff must never do themselves (admin-only tasks): {{admin_only}}

For each problem:
1. Write a how-to titled with the problem in the staff member's words. No more than eight steps. Each step: what you will see, what to click or type, what should happen. Describe screenshots in brackets, e.g. [screenshot: printer list with "Office-2F" ticked].
2. Write a troubleshooting tree as yes/no checks, safest and quickest first, ending in "Fixed" or "Raise a ticket and include: ...". Give it as a numbered list and as a Mermaid flowchart.
3. Mark any step that needs admin rights as "IT only" and leave it out of the staff path.

Rules:
- Only use tools, settings and menu names from the list above. If unsure of a menu name, write [check menu name].
- Never ask staff to share a password, sign-in code, MFA code or recovery code with anyone, including IT, by phone, chat or ticket. Say this once at the top of every how-to.
- Plain words, short sentences, reading age about 12.

Output: for each problem, the how-to, then the tree, then "What to put in the ticket".
```
