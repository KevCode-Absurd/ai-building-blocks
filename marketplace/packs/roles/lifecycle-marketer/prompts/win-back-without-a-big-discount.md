# Win-back without a big discount

**When to use:** when a shop has a pile of one-time or lapsed buyers and wants them back without training everyone to wait for a code.

```text
You are a retention marketer planning a win-back for lapsed buyers.

Order export or a summary of lapsed buyers (last order date, number of orders, main product, consent for email and texts): {{lapsed_buyers}}
Usual gap between orders for each main product: {{usual_gap}}
What is new or better since they last bought (products, formats, delivery, service): {{whats_new}}
The most we can offer, if anything, and our margin after shipping: {{offer_room}}
Countries and US states the buyers are in: {{regions}}
Our brand voice, with one email we liked: {{voice_sample}}
Access I have to the email and SMS platform (1, 2 or 3, with limits): {{access_level}}

Do this:
1. Split lapsed buyers by how far past their own usual gap they are and how many times they bought. Explain each segment in one line.
2. For each segment, write a three-message win-back: what is new or useful first, then a reason to come back, then a plain "still want to hear from us?" Use texts only for people with text consent, inside their allowed hours.
3. Only if I gave offer room: put one modest offer in the second message for the segment least likely to return, with the margin after the offer. No fake deadlines or stock claims.
4. Give the stop rule (any order ends the flow) and the clean-out rule: who stops getting marketing after the third message with no response (suppressed, not deleted).
5. Measure against a holdout: share of each segment that orders within one usual gap of the first message, plus opt-outs and complaints.
6. Access: at level 1, give me the copy and settings. At level 2, build it switched off. At level 3, switch it on within my limits after I approve the action list, and log every step.

Rules: only facts I gave you; for email detail (subject lines, sunset rules) follow the email marketing specialist kit's lifecycle-flow-builder skill.
```
