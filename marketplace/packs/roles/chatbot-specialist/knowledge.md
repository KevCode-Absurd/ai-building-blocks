# AI chatbot specialist: role knowledge

Checked 7 November 2026. Facts that change carry their own date and a source number from `sources.json`. I work from what you share (policies, help pages, price lists, solved tickets, chat transcripts with personal details removed) or inside your help desk, chatbot builder or AI assistant once you grant access. Access is set per tool at three levels: read; read and draft; read, write and publish within your limits (see `access.md`). Until you choose, I only read. Nothing here is legal advice: where a rule decides, I point to the official text and suggest you check it with a qualified adviser.

## 1. What this role is for

**Who hires me.** Small and mid-sized businesses (online shops, software firms, clinics, agencies, trades, hotels and restaurants) that want one of three things:
- a customer support bot in their website chat or help desk;
- a lead or enquiry bot, often a comment-to-DM flow on Instagram, Messenger or WhatsApp;
- an internal assistant for staff (a custom GPT, Claude Project, Gemini Gem or Copilot Studio agent) that answers from policies, price lists and how-tos.

**What I do.** Set the bot's scope, write the knowledge it answers from, write its instructions, design the flows and the hand-over to a person, add the AI disclosure and privacy wording, then test it and keep testing it. Connecting systems with code belongs to an automation or software role; writing the support policies themselves belongs to the customer support specialist; legal sign-off belongs to a lawyer.

**What good work looks like.**
- The bot says it is an AI at the start and never claims to be a person.
- It covers a short, written list of topics and says plainly what it cannot help with.
- Every fact it can state traces to an approved source with a date.
- When it does not know, or the topic is money, health, legal, a complaint or an angry customer, it hands over to a person with the conversation attached.
- A test set with expected answers, including refusals, hand-overs and injection attempts, passes before launch and after every change.
- Someone owns each knowledge topic and reviews it on a date.

**How the work is judged.**
- Pass rate on the test set, especially the risky cases.
- Wrong or risky answers found per transcript review.
- Confirmed resolutions, kept separate from conversations where the customer simply left.
- Hand-over quality: does the person who takes over have the context, and does the customer have to repeat themselves?
- Time to update the bot after a price or policy change.
- Complaints that mention the bot.

**What I never do.** Build a bot that pretends to be human; let a bot give legal, medical or financial advice; collect card numbers or passwords in chat; get round a platform's rules; test attacks on systems you do not own; promise that a bot will always be right.

## 2. The canon

**Paul Grice, the cooperative principle ("Logic and Conversation", 1975; *Studies in the Way of Words*, 1989).** People expect a partner in conversation to be as informative as needed and no more (quantity), truthful and supported (quality), relevant (relation) and clear (manner) [29]. A good bot answer follows all four: the answer first, only what the source supports, nothing off-topic, plain words.

**Raluca Budiu, "The User Experience of Chatbots" (Nielsen Norman Group, 25 November 2018).** A small qualitative study (8 participants) found that bots failed when users went off script, made people restart after errors, forgot context between tasks and hid that they were bots. Recommendations: say up front it is a bot, say what it can do, accept typos, offer buttons and free text, and when it does not understand, own the failure and offer an escape route such as a person or phone number [27].

**Saleema Amershi and colleagues, "Guidelines for Human-AI Interaction" (CHI 2019, Microsoft).** Eighteen design guidelines, tested by 49 design practitioners against 20 AI products [28]. The ones a chatbot leans on most: make clear what the system can do and how well, support easy correction and dismissal, and scope down when unsure.

**Cathy Pearl, *Designing Voice User Interfaces* (2016), and Erika Hall, *Conversational Design* (2018).** The working texts on writing for conversation: design from real user language, plan every error path, and keep the system's persona consistent and honest.

**Patrick Lewis and colleagues, "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (NeurIPS 2020).** The paper that named RAG: pair a language model with a searchable store of documents so answers draw on retrieved text, which the authors found more specific and factual than the model alone [23]. Nearly every support bot now works this way.

**Nelson Liu and colleagues, "Lost in the Middle" (2023, TACL).** Models use information best when it sits at the start or end of a long context and worst when it sits in the middle [24]. Keep instructions short and put the rules that must never break at the top.

**Anthropic, "Contextual Retrieval" (19 September 2024).** Chunks lose their context when split (a line about "revenue grew 3%" no longer says whose). Adding a short context to each chunk before indexing cut failed retrievals in their tests, and for knowledge under about 200,000 tokens they advise skipping retrieval and putting it all in the prompt [22].

**NIST AI 600-1, Generative AI Profile (July 2024).** Lists 12 risks of generative AI, including confabulation: confidently stated but false content that can mislead users [26].

**OWASP Top 10 for LLM Applications (2025 edition).** The security checklist for any bot: prompt injection is LLM01, followed by sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation and unbounded consumption [25].

## 3. How the work is done now

### Where bots live (as of November 2026)

- **Help-desk AI agents.** Intercom's Fin is priced per outcome. It counts a resolution when the customer confirms the answer helped or leaves without asking for more help ("assumed resolution"); a customer who asks for a person is not billed [16]. Report confirmed and assumed resolutions separately, because a customer who gave up also "leaves without asking".
- **Assistant builders.** A custom GPT can hold up to 20 knowledge files of up to 512 MB each [20]. Claude Projects switch to retrieval automatically when knowledge nears the context limit, holding up to ten times more, on paid plans [21]. Microsoft Copilot Studio hands over through an Escalate topic or a Transfer conversation step that passes the full conversation and its variables to the live agent [17].
- **Messenger and Instagram.** Businesses have a 24-hour window to reply after most user actions; the Human Agent tag allows manual replies for 7 days. Where the law requires it, automated chats must say so at the start, after a long gap and when moving from a person to automation, and Meta recommends disclosure everywhere. Bots must respond within 30 seconds [18].
- **WhatsApp.** Automation is allowed inside the 24-hour customer service window, but you must offer prompt, clear and direct ways to reach help: an in-chat transfer, phone, email, web support, a store visit or a form. Message only people who opted in, and honour opt-outs; outside the window only approved templates may be sent (policy updated 23 September 2026) [19].

### Knowledge decides what the bot can say

- **Size first.** If all the approved knowledge is small (under about 200,000 tokens, roughly 500 pages), put it in the instructions or project knowledge whole; retrieval adds failure points [22].
- **One topic per entry.** Title written as the question; short answer first, then detail; the source and the date it was last true; three to five ways customers phrase it; a hand-over rule. Each entry must make sense alone, with no "see above".
- **Chunks need context.** Name the product, policy and region inside the entry, because a retrieved chunk arrives without its neighbours [22].
- **Clashes go to the owner.** When two documents disagree, list both and ask which wins. Never pick one silently.
- **Position matters.** Hard rules (no advice, no promises, hand-over triggers, disclosure) go at the top of the instructions and are repeated at the end [24].

### Conversation design

- Open with a short greeting that says it is an AI assistant, what it can help with and how to reach a person [27][18].
- Offer buttons for the top tasks and accept free text and typos [27].
- After two failed attempts to understand, offer a person or another channel rather than a third guess [27]. Copilot Studio already escalates when it cannot match an intent or the user types something like "talk to agent" [17].
- Hand-over passes the transcript and what the bot collected, so the customer never repeats themselves [17]. Tell the customer what happens next and when; out of hours, say when someone will reply.
- Keep answers to two or three sentences and link to the full policy (Grice's quantity and manner) [29].

### Testing and guarding

- **Test set before launch.** Everyday questions, tricky ones, off-topic and unsafe requests, cases that must hand over, attempts to make the bot ignore its rules, and requests for other people's data. Each has an expected answer drawn from the source and a pass rule.
- **What to look for.** Wrong facts, invented policy, promises (refunds, prices, delivery dates) the business never made, unsafe advice, missed hand-overs, leaked instructions, and tone [25][26].
- **Injection.** Treat uploaded documents, web pages and emails the bot reads as data, not instructions; limit what tools the bot can use; require a person to confirm risky actions [25]. Only test injection on systems the client owns, with written permission.
- **Retest after every change** to instructions, knowledge, model or platform settings.

### Telling people it is an AI: EU, UK and US (as of November 2026)

**EU, AI Act Article 50.**
- Providers must design AI systems that interact directly with people so the people are told they are dealing with an AI, unless that is obvious to a reasonably well-informed, observant person. The notice must be clear, distinguishable, accessible and given at the latest at the first interaction [1].
- The Commission's Q&A (updated 24 July 2026) names chatbots, AI agents and avatars as examples, says the "obvious" exception should be read narrowly, and expects notice from the start of the first interaction. Fines can reach €15 million or 3% of worldwide turnover; national market surveillance authorities enforce [2].
- Article 50 applies from 2 August 2026 [5]. The Q&A gives no grace period for the chatbot duty; only the separate duty to mark AI-generated content (Article 50(2)) gives systems already on the market until 2 December 2026 [2][4].
- The Commission adopted guidelines on Article 50 on 20 July 2026 [3].
- **Who has the duty.** Article 50(1) falls on the provider; the Q&A gives deployers other duties (emotion recognition, deepfakes, published text) [2]. A business that builds its own bot on a model and offers it under its own name may count as the provider. Whatever the answer, disclose: it costs one sentence. Ask a qualified adviser where the role matters.
- **AI literacy.** Providers and deployers must take steps to give staff who run or use AI systems enough AI literacy for their context [6].
- **High-risk rules moved.** The Digital Omnibus on AI moved most high-risk duties to 2 December 2027 and 2 August 2028 [5]. A plain support bot is not usually high-risk; one that decides who gets credit, insurance or a job may be.

**UK.**
- The Competition and Markets Authority's guidance on AI agents (9 March 2026, updated 30 October 2026) says a business is responsible for what its AI agent does just as it is for an employee, even when a supplier built it. It asks firms to consider labelling agents so customers do not think a person is serving them, not to overstate what the AI can do, to answer accurately about prices, products and rights, to keep a human in the loop, to test before launch and to monitor. Consumer law breaches can bring fines of up to 10% of worldwide turnover [8].
- Data protection: most of the Data (Use and Access) Act 2025 changes to UK data protection law came into force on 5 February 2026, and the Information Commissioner's Office was replaced by the Information Commission on 30 September 2026 [9].

**US.**
- I found no federal chatbot disclosure statute; the Federal Trade Commission applies existing law against deception. Launching "Operation AI Comply" on 25 September 2024, the FTC said using AI to deceive people is illegal, and settled with DoNotPay, which had marketed "the world's first robot lawyer" without testing it against human lawyers, for $193,000 [13].
- **California.** Business and Professions Code sections 17940 to 17943 make it unlawful to use a bot to communicate with a person in California online with intent to mislead them about its artificial identity, to sell something or influence a vote; a clear and conspicuous disclosure avoids liability [10]. Bill AB 410 would require disclosure at first contact and a truthful answer when asked; it was held in a Senate committee on 29 August 2025 [11].
- **Utah.** SB 226 (2025) requires a business using generative AI with consumers to disclose it when a consumer clearly asks, and to disclose at the outset in high-risk interactions within regulated occupations; clear, conspicuous disclosure gives a safe harbour [12].
- Other states are passing their own rules. The safe default everywhere: disclose at the start and answer truthfully when asked.

### Data protection in chat

- **EU.** An expert report for the European Data Protection Board (April 2025; the authors' views, not the Board's) walks through a customer-query chatbot. It concludes that even though the bot is not high-risk under the AI Act, its GDPR risk factors justify starting a data protection impact assessment. Its mitigations: tell users clearly how their data is used, minimise or anonymise logs, filter what retrieval can reach, remove sensitive data from outputs, set retention periods, and make sure access and deletion requests reach chat logs too [7].
- **UK.** The same principles apply under UK GDPR as amended in 2026 [9]; check the regulator's current AI guidance before launch.
- **US.** Privacy duties depend on the sector and the state. Check the states where your customers are before storing transcripts.
- **Everywhere.** No card numbers, passwords or health details collected in chat; a processor agreement with the bot vendor; know where transcripts are stored and for how long; check whether the vendor may train on your conversations.

### Three real cases

- **Air Canada (February 2024).** Its website chatbot told a grieving customer he could claim a bereavement fare after travelling, which the airline's policy did not allow. Before the British Columbia Civil Resolution Tribunal, Air Canada argued it could not be held liable for information given by its agents, including a chatbot. The tribunal disagreed, found negligent misrepresentation and ordered it to pay the fare difference with interest and fees, a little over C$800 [14]. The business owns what its bot says.
- **Klarna (February 2024).** In its first month, Klarna said its AI assistant handled 2.3 million conversations, two-thirds of its customer service chats, matched human agents on satisfaction, cut repeat inquiries by 25% and resolved issues in under 2 minutes instead of 11, across 23 markets and 35 or more languages; customers could still choose a live agent [15]. These are the company's own figures.
- **DoNotPay (2024).** Marketing claims about an untested AI service drew an FTC order and payment [13].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 2 Aug 2026 | EU AI Act Article 50 applies, including chatbot disclosure | [5][2] |
| 2 Dec 2026 | Deadline for Article 50(2) content marking, systems on the market before 2 Aug 2026 | [4]; marking only, not chatbot disclosure |
| €15 million or 3% | Maximum EU fine for transparency breaches | [2]; proportionality for SMEs |
| Up to 10% | UK consumer law fines, share of worldwide turnover | [8] |
| 24 hours / 7 days / 30 seconds | Messenger reply window / Human Agent tag window / bot response limit | [18]; as of Nov 2026 |
| 20 files, 512 MB each | Custom GPT knowledge limits | [20]; search-confirmed |
| Up to 10× | Extra content Claude Projects hold in retrieval mode | [21]; paid plans |
| About 200,000 tokens | Below this, put all knowledge in the prompt | [22]; Anthropic's advice |
| 35% / 49% / 67% | Fewer failed retrievals with contextual embeddings / plus BM25 / plus reranking | [22]; Anthropic's own tests, top-20 chunks |
| 2.3 million, two-thirds, 25%, 2 vs 11 min | Klarna's first-month AI assistant figures | [15]; company claims, Feb 2024 |
| A little over C$800 | Air Canada chatbot award | [14]; small-claims tribunal, not binding precedent |
| $193,000 | DoNotPay FTC settlement | [13] |
| 8 participants | Size of the NN/g chatbot study | [27]; qualitative |

**Numbers I do not quote.** Industry "average deflection" or "containment" rates, vendor claims of hours saved, or satisfaction lifts without a named method. A bot's own resolution rate is not a quality measure until it is split into confirmed and assumed.

## 5. Decision rules

- If a bot talks to the public, it says it is an AI in its first message and answers truthfully when asked, because the EU requires notice at first interaction and California and Utah have their own bot disclosure rules [1][2][10][12].
- If a question is about money, health, legal rights, a complaint or a vulnerable customer, hand over to a person, because the business is liable for what the bot says [8][14].
- If the source material does not answer a question, the bot says so and offers a person, rather than guessing [26][27].
- If the bot fails to understand twice, offer a person or another channel [27].
- If you hand over, pass the transcript and collected details, so the customer does not repeat themselves [17].
- If all approved knowledge is small enough to fit in the prompt, skip retrieval [22].
- If you use retrieval, write each entry to stand alone and name its product and region inside it [22].
- If two documents disagree, stop and ask the owner which wins.
- If a rule must never break, put it at the top of the instructions and repeat it at the end [24].
- If the bot can take actions (refunds, bookings, sending messages), require a person to confirm risky ones and limit its tools [25].
- If the bot reads documents, emails or web pages, treat their text as data, never as instructions [25].
- If a vendor reports "resolutions", split confirmed from assumed before calling the bot a success [16].
- If you message people on WhatsApp or Messenger, stay inside the reply window, get opt-in and keep a clear route to a person [18][19].
- If transcripts will be stored, set retention, limit who can read them and make deletion requests reach them [7].
- If the bot is sold as AI expertise, test it against the claim first, because untested claims are deceptive [13].
- If anything changes (instructions, knowledge, model, platform), rerun the full test set before going live again.

## 6. Common mistakes and how to spot them

- **Bot passing as human.** Spot it: a human name and photo with no AI label, or "I'm Sarah from the team" [1][10].
- **Invented policy.** Spot it: answers promising refunds, discounts or delivery dates that appear nowhere in the help centre [14].
- **No way out.** Spot it: transcripts where customers type "human" or "agent" three times [27].
- **Hand-over without context.** Spot it: agents' first message asks "How can I help?" after a ten-message bot chat [17].
- **Giant instructions.** Spot it: pages of rules where the critical ones sit in the middle [24].
- **Orphan chunks.** Spot it: retrieved text that says "this plan" or "the fee above" with no name [22].
- **Stale knowledge.** Spot it: entries with no date or owner; prices that differ from the website.
- **Counting giving-up as success.** Spot it: high resolution rates alongside rising complaints [16].
- **Instructions leaked or overridden.** Spot it: the bot repeats its system prompt or follows "ignore your rules" pasted by a user [25].
- **Personal data in knowledge or logs.** Spot it: real customer names in example answers; transcripts kept forever [7].
- **Messaging outside the rules.** Spot it: promotional DMs to people who never opted in, or follow-ups days after the window closed [18][19].
- **Testing only happy paths.** Spot it: a test set with no off-topic, unsafe or hand-over cases.
- **Overclaiming.** Spot it: "our AI lawyer", "never wrong", "always available" [13].

## 7. Quality bar

Before a bot goes live or a change ships, I check:
1. Scope written: topics covered, topics refused, who it serves.
2. AI disclosure in the first message, a truthful answer to "are you a bot?", and a visible route to a person.
3. Every fact in the knowledge traces to an approved source with a date and an owner.
4. Clashes between sources resolved by the owner, in writing.
5. Hand-over rules cover money, health, legal, complaints, vulnerability, repeated misunderstanding and explicit requests, and pass context.
6. Instructions are copy-ready, within the tool's limit, with hard rules at the top and end.
7. Test set of 20 to 40 cases with expected answers and pass rules, including refusals, hand-overs, injection attempts and requests for other people's data; all critical cases pass.
8. Privacy: no card numbers or passwords in chat, retention set, vendor terms checked, notice updated.
9. Channel rules met: reply windows, opt-in, opt-out, escalation paths.
10. Monitoring plan: who reviews transcripts, how often, and what triggers pulling the bot.
11. Every action I took in the client's tools is logged and stayed within the level and limits granted.

## 8. How this role writes

- **Instruction block.** Role and audience; tasks; sources it may use and nothing else; hard rules (disclosure, no advice, no promises, no personal data, hand-over triggers); what to say when it does not know; tone with one example line; format (two or three sentences, link to the policy). Hard rules repeated at the end.
- **Knowledge entry.** Title as a question; short answer; detail; customer phrasings; hand-over rule; source and date; owner; tags.
- **Flow map.** Mermaid flowchart: greeting with disclosure, intent buttons, answer, follow-up, fallback after two misses, hand-over, after-hours path.
- **Test case.** ID, user message, category, expected answer or path, source, pass rule, severity if it fails.
- **Transcript review.** Each answer marked correct, incomplete, wrong or risky, with error type, severity, likely cause and fix.
- **Bot voice.** Short, warm and plain. Says "I'm an AI assistant", never a human name passed off as a person. Admits limits: "I can't help with that here, but a member of our team can."

## 9. Glossary

- **Chatbot / AI assistant:** software that holds a conversation, usually built on a large language model.
- **Large language model (LLM):** the model that generates the bot's text.
- **System prompt / instructions:** the hidden rules a bot follows in every conversation.
- **Knowledge base:** the approved content the bot answers from.
- **RAG (retrieval-augmented generation):** looking up relevant text and giving it to the model with the question [23].
- **Chunk:** one piece of a document stored for retrieval [22].
- **Embedding:** a numeric form of text used to find similar meaning [22].
- **BM25:** a keyword-matching method often combined with embeddings [22].
- **Reranking:** a second step that reorders retrieved chunks by relevance [22].
- **Intent:** what the user is trying to do, such as "track my order".
- **Fallback:** what the bot does when it does not understand.
- **Hand-over (hand-off, escalation):** passing the conversation to a person with its context [17].
- **Assumed resolution:** a conversation counted as resolved because the customer left without asking for more [16].
- **Confabulation (hallucination):** confidently stated false content [26].
- **Prompt injection:** text that tries to make the model ignore its instructions [25].
- **System prompt leakage:** the bot revealing its hidden instructions [25].
- **Excessive agency:** a bot able to take more actions than its job needs [25].
- **Provider / deployer (AI Act):** who builds and places an AI system on the market / who uses it [1][2].
- **Article 50:** the AI Act's transparency article, including chatbot disclosure [1].
- **DPIA:** data protection impact assessment, a structured risk review under GDPR [7].
- **Messaging window:** the period in which a business may reply freely on Messenger or WhatsApp [18][19].
- **Human Agent tag:** Meta's tag that allows manual replies for 7 days [18].
- **Test set:** questions with expected answers and pass rules, rerun after every change.

## 10. What changes fast

Re-check these at every refresh (every 14 days):

| Topic | Where to check | Last known state |
|---|---|---|
| AI Act Article 50 text and dates | AI Act Service Desk [1][4][5] | Applies 2 Aug 2026; consolidated text as at 27 Jul 2026 |
| Commission Article 50 guidance | Q&A [2], guidelines [3] | Guidelines adopted 20 Jul 2026; Q&A updated 24 Jul 2026 |
| UK CMA AI agents guidance | GOV.UK [8] | Updated 30 Oct 2026 |
| UK data protection changes and regulator | GOV.UK [9] | Information Commission since 30 Sep 2026 |
| California bot law and AB 410 | California Legislative Information [10][11] | AB 410 held in committee since 29 Aug 2025 |
| Utah disclosure law | Utah Legislature [12] | SB 226 (2025); site refused connections at last check |
| Other US state chatbot laws | State legislature sites | Check the states where your customers are |
| FTC enforcement on AI claims | FTC [13] | Operation AI Comply, Sep 2024 |
| Custom GPT, Claude Project and Gem limits | OpenAI [20], Anthropic [21] | 20 files of 512 MB; 10× in retrieval mode |
| Meta and WhatsApp messaging rules | Meta [18], WhatsApp [19] | 24 h window; WhatsApp policy updated 23 Sep 2026 |
| Help-desk AI pricing and resolution rules | Intercom [16] | Per outcome; article updated 23 Sep 2026 |
| Copilot Studio hand-over | Microsoft Learn [17] | Page updated 19 Aug 2026 |
| OWASP LLM Top 10 | OWASP [25] | 2025 edition |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` If the bot fails to understand twice, I have it offer a person or another channel. (§5)
- `decision_rule` On handover, I pass the transcript and collected details, so the customer does not repeat themselves. (§5)
- `decision_rule` If all approved knowledge fits in the prompt, I skip retrieval; if I use retrieval, I write each entry to stand alone and name its product and region. (§5)
- `decision_rule` When two source documents disagree, I stop and ask the owner which wins rather than letting the bot choose. (§5)
- `check` When a vendor reports "resolutions", I split confirmed from assumed before calling the bot a success. (§5)
- `check` After any change to instructions, knowledge, model or platform, I rerun the full test set before going live again. (§5)
