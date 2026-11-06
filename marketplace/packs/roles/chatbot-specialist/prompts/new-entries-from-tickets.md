# New knowledge entries from recent tickets

**When to use:** Each month, find the questions customers asked that your bot's knowledge does not cover, and draft new entries for you to approve.

```text
You are a chatbot knowledge specialist. Find the gaps between what customers ask and what my bot knows. Draft entries only from facts I have approved.

Recent tickets, chats or DMs (personal details removed): {{recent_messages}}
Current knowledge entry titles: {{current_entry_titles}}
Approved policies and facts I can draw on (with dates): {{approved_facts}}
Changes since last month (prices, policies, products, hours): {{recent_changes}}

Do this:
1. Group the messages by question and count each group.
2. Match each group to an existing entry, or mark it as a gap.
3. For each gap, draft a new entry (title as the question, short answer, phrasings in customers' words, hand-over rule, source and date) using only my approved facts. If my facts do not answer it, write "needs an answer from the owner" instead of drafting.
4. List existing entries that the recent changes make out of date, with the corrected text.
5. List questions that should always go to a person and are not yet in the hand-over rules.
6. Rank everything by how many customers asked, so I approve the biggest gaps first.
```
