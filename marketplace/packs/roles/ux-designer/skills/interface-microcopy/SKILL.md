---
name: interface-microcopy
description: Writes or rewrites the words inside a product - buttons, labels, hints, error messages, empty states, confirmations and onboarding steps - so each one says what happened, why it matters and what to do next, in the users' own words. Builds a term list so the same thing has the same name everywhere, checks accessibility of the wording, and returns a before-and-after table with character counts. Use it for apps, dashboards, online stores and checkout flows, and for teams shipping with placeholder text. Not for legal terms, consent wording without legal review, or translation.
---

# Interface microcopy

## When to use

- A flow ships with placeholder or developer-written text ("Error 422", "Submit", "No data").
- Users get stuck at the same message, or support gets the same question about one screen.
- A product uses three names for one thing ("workspace", "project", "account").
- A new onboarding flow needs welcome text, step prompts and empty states.

Not for legal terms, privacy notices or consent wording without the client's legal review, not for translation, and never for claims or features the product cannot support.

## What you need

1. **The screens:** screenshots, a prototype, or the current strings (a spreadsheet or a strings file export).
2. **Who is there and what they are trying to do** on each screen.
3. **The product's voice:** any voice notes, brand guide or three adjectives; if none, plain, calm and direct.
4. **Limits:** character limits per element, platform conventions, fixed terms and legal text.
5. **Evidence:** support tickets, search terms, session notes or analytics for the screens in question, if any.
6. **Access I have:** the level the client grants in each tool (1 read, 2 read and draft, 3 read, write and publish). Steps 1 to 8 need level 1 only. Step 9 needs level 2 or 3. Until the client answers, work at level 1.

## Steps

1. **Map the moments.** List every piece of text on the screens in scope with its location and type (button, label, hint, error, empty state, confirmation, tooltip, onboarding step). Note what the user is trying to do at that moment.
2. **Build the term list first.** List every noun the product uses for its objects and actions. Pick one term per thing, preferring the word users use in tickets and search. Flag every clash. All rewrites follow this list.
3. **Write buttons that name the result.** Verb first, specific object: "Save changes", "Send invoice", "Pay £24.00", "Delete 3 photos". Not "Submit", "OK" or "Yes". In confirm dialogs, the buttons repeat the action ("Delete project" / "Keep project"), not "Yes" / "No".
4. **Write labels and hints.** Labels are short and visible above the field; never use placeholder text as the only label. Hints say the format before the user types ("For example, 12 03 1990"). Ask only for what is needed, and say why if it is not obvious.
5. **Write errors with three parts:** what happened, why it matters (only if not obvious), and what to do next. Put it next to the field and repeat the same words in any error summary. Use the words of the question ("Enter how many hours you work a week"). Never blame ("You forgot", "Illegal"), never joke when the user is blocked, avoid "invalid", "oops", "please" and "sorry" in validation messages, and keep what the user typed. Say "sorry" only when the product failed seriously.
6. **Write empty states.** Say what belongs here, and offer one clear first step ("No invoices yet. Create your first invoice to see it here." + "Create invoice").
7. **Write confirmations and success messages.** Say what happened and what happens next ("Invoice sent to accounts@client.example. We'll tell you when it's paid."). For destructive actions, say what will be lost and whether it can be undone.
8. **Check accessibility and plain language.** No colour-only cues ("fields in red"), no "click here" or "learn more" links without context, link and button text that makes sense read alone, no instructions that depend on position ("the button on the right"), sentence case, front-loaded key words, short sentences, grade 8 to 9 reading level. Check every string against its character limit.
9. **Apply changes only at the right level.**
   - Level 1: hand over the table.
   - Level 2: put the new strings into a copy of the design file, a draft branch, or a pull request in the client's code repository for review; do not merge or publish.
   - Level 3: after the client confirms the list and limits (which screens, which repo or CMS, when), publish the copy changes or merge the approved pull request. Log each action. Ask again before changing legal text or anything outside the agreed screens.

## Checks

- Every message answers what happened and what to do next.
- Every button names the result; no "Submit", "OK" or "Click here".
- Every term matches the term list; clashes are flagged.
- Every string fits its limit; counts shown.
- No promise the product cannot keep, no invented features, numbers or policies.
- Legal and consent text is flagged for legal review, not rewritten as final.
- Any level 2 or 3 action is in the action log.

## Output format

1. Term list: term to use, terms to avoid, where each appears.
2. Microcopy table: location, type, old text, new text, reason, character count and limit.
3. Notes for designers and developers (placement, states, error summary).
4. Open questions (facts only the client can confirm).
5. Action log (if any level 2 or 3 work).

## Example of good output (short)

*Illustrative structure, not a real business: an invoicing app. Voice: plain and calm. Access I have: level 1 (screenshots and a strings export). Copy the shape, never the content: every fact comes from the client's own context.*

**Term list:** use "client" (not "customer" or "contact"); use "invoice" (not "bill"); use "send" (not "dispatch" or "issue").

| Location | Type | Old | New | Reason | Chars / limit |
|---|---|---|---|---|---|
| New invoice, due date | Error | "Invalid date" | "Enter a due date after the invoice date" | Says how to fix it, uses the field's words | 39 / 60 |
| New invoice, footer | Button | "Submit" | "Send invoice" | Names the result | 12 / 20 |
| Invoices list, empty | Empty state | "No data" | "No invoices yet. Create one and it will show here." | Says what belongs and the first step | 50 / 80 |
| Delete dialog | Buttons | "Yes" / "No" | "Delete invoice" / "Keep invoice" | Buttons repeat the action | 14 / 20, 12 / 20 |
