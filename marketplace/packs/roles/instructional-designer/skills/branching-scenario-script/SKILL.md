---
name: branching-scenario-script
description: Writes a branching scenario for practising hard conversations and decisions - 2 to 4 goals as behaviours, tempting wrong choices drawn from real mistakes, a map of 3 to 6 decision points with paths that rejoin and an ending for every path, scenes under about 120 words, choices in the words a real person would say, consequences and feedback that names the skill, a Mermaid flowchart whose ids match the script, build notes for Twine (Twee 3), Rise, Storyline or live role-play, accessibility notes and a facilitator debrief. Use it for manager, HR, customer service, safety, data and ethics decisions, or to turn a linear role-play into practice with consequences. Right answers come from the client's policy, never from legal judgement. Builds in the client's authoring tool only with level 2 access, and publishes only with level 3.
---

# Branching scenario script

## When to use

- Learners must practise a judgement call or a conversation: an absence review, a refund without a receipt, a client spreadsheet sent under deadline pressure, a safety stop.
- A linear role-play or slide deck tells people the rule but never lets them choose.
- A module needs a realistic practice block that fits in 10 to 15 minutes.

Do not use it to write legal or HR rulings into "right answers", to depict real staff or customers, or to replace expert sign-off on safety, legal or clinical decisions.

## Access needed

- **Level 1 (read):** the policy or method, anonymised real cases, the learner profile, the target tool.
- **Level 2 (read and draft):** build the scenario as a draft in Twine, Rise or Storyline, or save the Twee file and map in the client's documents.
- **Level 3 (read, write and publish):** publish the approved scenario to the agreed course or LMS area within the client's limits. Replacing a live version with learner records needs a new yes. Log every action.

## What you need

1. The situation, the learners and the setting (role, experience, live or self-paced).
2. The policy, method or standard that defines good practice, with its version.
3. Common mistakes, from managers, QA reviews or complaints, with names removed.
4. Time available and the target tool: Twine, Rise, Storyline, or live facilitation.
5. Who confirms the right answers.

## Steps

### 1. Write the goals as behaviours

2 to 4, observable: "acknowledges the customer's frustration before explaining the rule", "asks what the absence means for the team before raising the policy".

### 2. Collect the tempting mistakes

List what real people do wrong and why it is tempting (it is faster, it avoids conflict, it feels kind). These become the wrong choices. A wrong choice nobody would pick teaches nothing.

### 3. Sketch the map first

3 to 6 decision points, 2 to 4 choices each. Let paths rejoin so the scenario stays buildable, and give every path an ending: strong, mixed or poor. Give every scene a short id (S1, S2a) before writing a word.

### 4. Write the scenes

Each scene under about 120 words: what happens, what the other person says, and the decision. Use realistic, neutral names that are not those of real staff or customers.

### 5. Write the choices, consequences and feedback

- Choice: something a real person might say, in their words.
- Consequence: what the other person does next, shown in the story.
- Feedback: names the skill or the policy rule and section, briefly. Save longer teaching for the debrief.

### 6. Check right answers against the source

Every "strong" choice must match the client's policy or method. Anything the designer adds is marked [confirm with your team]. Where a choice touches law (employment, data protection, safety), the client's expert decides.

### 7. Draw the Mermaid map

```
flowchart TD
  S1{"S1: Agent says the refund system is down"} -->|"Offer a manual refund now"| S2a
  S1 -->|"Ask the customer to call back"| S2b
```

Ids must match the script exactly. Avoid a node named lowercase `end`, and avoid ids starting with `o` or `x` right after a link, because Mermaid reads them as special edges.

### 8. Write build notes for the tool

- **Twine:** a Twee 3 file with a `StoryTitle` passage, a `StoryData` passage (ifid, format, start), and one passage per scene named by its id; links in the chosen story format's syntax.
- **Rise:** one scenario block per decision chain, with the character, scene text and feedback per choice.
- **Storyline:** a slide per scene, buttons per choice, triggers to the next slide, a results variable if scored.
- **Live role-play:** facilitator cues, when to pause, and what to ask.

### 9. Add accessibility notes and a debrief

Choices as real buttons reachable by keyboard; no timers on decisions, or a way to turn them off; scene images with alt text or decorative marking; no meaning carried by colour alone. Debrief guide with 3 to 5 discussion points tied to the goals.

## Checks

- Every path ends; no dead ends or loops without exit.
- Ids match across script, map and build notes.
- Wrong choices are tempting and come from real mistakes.
- Right answers trace to the client's policy; additions are marked.
- No real names; no legal rulings.
- Accessibility notes included.
- At level 2 or 3, only the named scenario was changed, and the log is updated.

## Output format

1. Goals and learner context.
2. Scenario map (Mermaid) and a scene list with ids.
3. Script: scene, choices, consequence, feedback, ending type.
4. Build notes for the chosen tool (Twee 3 file if Twine).
5. Accessibility notes.
6. Debrief guide.
7. Confirm with your team.

## Example of good output (short)

*Illustrative structure, not a real business: an outdoor retailer; refund without a receipt, policy v2 section 3. Copy the shape, never the content: every fact comes from the client's own context.*

> **S2 (after the customer says "I bought it here last week, I just lost the receipt"):**
> The customer puts the jacket on the counter. "It's falling apart already. I'm not leaving without my money."
>
> - **A:** "That sounds really frustrating. Let me check what I can do without the receipt." → S3a. *Feedback: you acknowledged the feeling first, which calms the conversation (goal 1).*
> - **B:** "Sorry, no receipt, no refund. That's the policy." → S3b (customer raises their voice). *Feedback: policy v2 section 3 allows a store-credit option without a receipt; quoting a rule that is not there escalates things.*
> - **C:** "Fine, here's a cash refund." → S3c (manager later flags a breach). *Feedback: cash refunds need a receipt or card match under section 3.1.*
>
> Ending S5-mixed: the customer accepts store credit but says they will not come back. Debrief point: what could have kept them?
