---
name: ai-feature-responsible-launch
description: Plans and checks an AI feature (chatbot, assistant, summariser, recommender, image or text generator) before it ships - what it must and must never do, failure-case tests, human review and a way for users to report problems, AI Act Article 50 transparency for EU users (telling people they are talking to AI, marking generated content, deepfake and public-interest text disclosure), provider or deployer role, personal data and impact assessment flags, NIST AI RMF and UK AI assurance checks, and marketing claims kept within what testing showed. Produces a launch readiness note with open legal questions for the client's adviser. Use before building or launching any feature that uses AI.
---

# AI feature: responsible launch

AI features fail in ways normal features do not: confident wrong answers, outputs nobody expected, and promises the product cannot keep. This skill makes those risks visible before launch and turns them into tests, disclosures and limits. It does not decide whether a feature is lawful; it lists the questions and the official guidance, and the client confirms with a qualified adviser.

## When to use

- A spec includes a chatbot, assistant, AI search, summaries, recommendations, scoring of people, or generated text, images, audio or video.
- A vendor's AI tool is being added to the product.
- Marketing wants to describe what the AI can do.

## What you need

- What the feature does, who uses it and where they are (EU, UK, US).
- The model or vendor, and whether the client builds the AI system or only uses a vendor's tool.
- What data goes in (especially personal data) and what comes out.
- Who sees outputs and what decisions they inform.
- **Research mode:** with web search connected, open the current Commission AI Act pages, the Article 50 FAQ, NIST and GOV.UK pages and date them. Without it, use the knowledge file (checked 6 Nov 2026) and mark each rule "confirm current rule".
- **Access I have:** level 1 for the review. Drafting test cases or issues needs level 2. Turning the feature on for users needs level 3 within the limits, after the client's go.

## Steps

1. **Write the job and the limits.** What the feature must do, for whom, and a list of what it must never do (for example: give medical or legal advice, make up prices, act on a payment, reveal another user's data).
2. **Map the risks** using the NIST AI RMF characteristics as prompts: valid and reliable; safe; secure and resilient; accountable and transparent; explainable; privacy-enhanced; fair with harmful bias managed. Note where they trade off.
3. **Build failure-case tests:** common questions, edge cases, attempts to make it break the "never" list, inputs in other languages, and questions it should decline. Set the pass rule for each before testing.
4. **Decide human oversight:** who reviews which outputs, when a person takes over, and how users report a bad answer. Make the report path one click or one message.
5. **Work out the AI Act role and duties for EU users.** Is the client a provider (places an AI system on the market under its own name) or a deployer (uses one under its authority)? Then check Article 50:
   - AI that talks directly to people: tell them at the start of the first interaction that it is AI, unless that is plainly obvious (read narrowly).
   - Systems that generate audio, images, video or text: providers mark outputs in a machine-readable way.
   - Deepfakes: deployers disclose them.
   - AI-generated text published to inform the public on matters of public interest: disclose, unless a person reviewed it and someone holds editorial responsibility.
   - Article 50 applies from 2 Aug 2026; systems already on the market have until 2 Dec 2026 for marking only.
   Flag any high-risk use (for example employment or education decisions) for the client's adviser at once.
6. **Check personal data.** Purpose, lawful basis, what users are told, privacy-friendly defaults, and whether profiling or evaluating people calls for a data protection impact assessment. Note what the vendor does with inputs.
7. **UK and US checks.** UK: walk the five principles (safety and security; transparency; fairness; accountability; contestability and redress) and pick the assurance techniques that fit (risk assessment, bias audit, performance testing). US: use the NIST AI RMF functions (Govern, Map, Measure, Manage) to assign owners.
8. **Check the claims.** Every sentence marketing will say about the AI must match what testing showed. The FTC has acted against untested AI claims, such as a "robot lawyer" that the FTC said was never tested to perform like a human lawyer.
9. **Plan the rollout:** staff first, then a small group behind a feature flag, with the metrics and the stop rule; how to switch it off.
10. **Write the launch readiness note** and the open legal questions for the client's adviser.
11. **Access steps.** Level 2: file the test cases and disclosure tasks as unassigned issues; create the flag switched off. Level 3: after the client's go, turn the flag on for the agreed group only and watch the stop rule; ask again before widening it.

## Checks

- A written "never" list, and tests against it with pass rules set in advance.
- A visible AI notice at the first interaction where Article 50 applies.
- A user report path and a named reviewer.
- Personal data purpose and defaults recorded; impact assessment flagged where needed.
- Claims match test results.
- A stop rule and a working switch-off.
- Legal questions listed for the adviser, not answered.

## Output format

1. **Access I have.**
2. **Feature summary:** job, users, markets, provider or deployer (to confirm).
3. **"Never" list** and risk map.
4. **Test plan and results table:** case, expected, actual, pass or fail.
5. **Transparency plan:** notice text, where it appears, marking approach.
6. **Data notes** and impact assessment flag.
7. **Claims check:** claim, evidence, keep or cut.
8. **Rollout and stop rule.**
9. **Open questions for the adviser** and official pages to read.

## Example of good output (short)

*Illustrative structure, not a real business: a ferry operator with a chatbot on its booking site answering timetable and luggage questions, with users in Ireland and the UK. Copy the shape, never the content: every fact comes from the client's own context.*

**Role:** the ferry firm deploys a vendor's chatbot but places it on its site under its own brand; whether it counts as provider or deployer is for its adviser to confirm. **Never list:** quote fares (the booking engine does that), promise refunds, give medical advice for travel.

**Notice (first message):** "Hi, I'm [Business]'s AI assistant. I can help with timetables and luggage. For bookings and refunds, I'll pass you to our team."

| Test case | Expected | Pass rule |
|---|---|---|
| "Can I get a refund for tomorrow?" | Hands over to staff | No refund promise |
| "Is the 08:00 sailing on?" | Points to live status page | No made-up status |
| Question in Irish | Answers or hands over | No made-up content |

**Claims check:** "Answers any question instantly" - cut; "Answers timetable and luggage questions, any time" - keep after tests pass.

**Open questions for the adviser:** provider or deployer; whether chat logs hold personal data and for how long.
