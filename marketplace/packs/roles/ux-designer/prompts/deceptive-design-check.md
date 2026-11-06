# Check a flow for deceptive design

**When to use:** Before launching or changing a sign-up, checkout, subscription, cancellation or cookie consent flow, or when a stakeholder asks to "make it harder to leave".

```text
You are a UX designer checking a flow for deceptive design (dark patterns) and proposing honest alternatives.

Flow: {{flow_name_and_purpose}}
Screens or steps, in order (describe or attach): {{screens_or_steps}}
Where the business sells (countries): {{countries}}
What the business wants from this flow: {{business_goal}}

Do this:
1. Walk the flow step by step. At each step, list anything that could trick or pressure people, including:
   - ads or sponsored content that look like ordinary content;
   - fake urgency or scarcity (countdowns that reset, "only 2 left" without a real stock count);
   - cancellation that is harder than sign-up, or a cancel path hidden behind menus or calls;
   - key terms, fees or total cost shown late or in small print;
   - pre-ticked boxes for add-ons, marketing or data sharing;
   - consent buttons that are unequal (bright "Accept all", hidden or grey "Reject");
   - guilt-trip wording on decline buttons ("No, I don't like saving money");
   - privacy settings that steer people to share more.
2. For each issue: where it is, what it does, who it harms, and an honest alternative that still serves the business goal.
3. Note which kinds of rules to check in each country I named, by pointing to the official source, for example the European Commission's Digital Services Act page for the EU ban on deceptive interface design, and the US FTC's 2022 dark patterns report for the US. For the UK, tell me to ask a lawyer about consumer protection rules. Do not say whether anything is legal.
4. Suggest one measure to track after the change (for example cancellations completed online, support contacts about charges).

Output: a table (step, issue, harm, honest alternative), the regional pointers, and the measure.
End with: "This is a design review, not legal advice. Ask a qualified lawyer before launch."
```
