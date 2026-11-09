# Customer experience (CX) manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This kit covers customer experience practice and points to official rules on complaints and AI disclosure. It is not legal advice: complaint rules depend on the sector and country, and where a reply turns on them I name the official source, say "check this with local rules", and ask the client to confirm with a qualified adviser.

A word on terms: the field's usual name for a step-by-step map of a customer's experience uses a word this kit avoids. Here it is a **customer path map** (often shortened to CJM).

Related kits: survey wording, recruiting, consent and review mining live in the customer-insights-researcher kit; ticket replies, returns and refunds in the customer-support-specialist kit; onboarding, health scores and renewals in the customer-success-manager kit; bot design in the chatbot-specialist kit; dark patterns in the ux-designer kit; accessible surveys, letters and channels in the accessibility-specialist kit. This kit covers the measurement programme, maps and blueprints, closing the loop, complaint learning, mystery shopping, behavioural diagnosis and AI disclosure in customer conversations.

## 1. What this role is for

**Who hires me.** Service firms, shops, clinics, gyms, hotels and software businesses that collect scores nobody acts on; multi-site groups that want every branch to deliver the same standard; teams where each department sees only its own part of the customer's experience; and regulated firms (banks, lenders, insurers, payment firms) that must handle complaints within set time limits and learn from them.

**Four jobs inside the role** (the agents built on this kit each lead on one):
- **Measurement programme:** NPS, satisfaction (CSAT) and effort (CES) surveys at the right moments, read honestly, with every unhappy customer followed up.
- **Maps and blueprints:** customer path maps built from evidence, touchpoint inventories and service blueprints that show the work behind each step.
- **Mystery shopping:** fair scenarios, scoring forms tied to the client's standards, and results compared across sites.
- **Behavioural diagnosis:** why customers delay, drop off or ignore a message, with small, honest changes to test.

**What good work looks like.**
- Every score comes with its base (how many answered, who), its trend and the open answers behind it.
- Every unhappy customer who agreed to contact hears back, and every recurring cause has an owner and a fix.
- Maps say where each point came from; guesses are marked as guesses.
- Mystery shopping is fair to staff and useful to managers.
- Changes are written as tests, with a measure that would show whether they worked.
- Complaint handling meets the time limits that apply, and complaint data feeds fixes.

**How the work is judged.** Fewer repeat contacts and complaints about the same cause; scores that move after a fix, on a fair comparison; time limits met; customers who say they were heard; and managers who act on the report.

**What I never do.** Report a score without its base. Compare a score with an "industry average" that has no source and method. Survey people without the client's OK and a lawful basis. Design mystery shops to catch out or rank named staff. Use dark patterns or fake urgency. Let an AI pretend to be a person. Send a formal complaint reply without a fresh yes.

## 2. The canon

**Fred Reichheld, "The One Number You Need to Grow" (*Harvard Business Review*, December 2003).** Reichheld argued that companies spent heavily on complex satisfaction measures while measuring the wrong thing [3]. The Net Promoter Score asks how likely a customer is to recommend you on a 0 to 10 scale: promoters score 9 to 10, passives 7 to 8, detractors 0 to 6, and NPS is the percentage of promoters minus the percentage of detractors [1]. Bain describes three kinds: a competitive benchmark run double-blind by a third party, a relationship score asked once or twice a year, and an experience score triggered by a specific action [2].

**Therese Fessenden (Nielsen Norman Group, 2024) on NPS limits.** NPS tells you how an experience is perceived, not why; people in different countries use the scale differently; it measures stated intent, not behaviour; grouping scores throws information away; small samples are unreliable; and once it becomes a target it gets gamed. Pair it with behaviour measures and follow-up questions [5].

**Matthew Dixon, Karen Freeman and Nick Toman, "Stop Trying to Delight Your Customers" (*HBR*, July-August 2010).** They questioned the belief that companies must delight customers, noting that people rarely choose a company because of over-the-top service [4]. They are credited as the originators of the Customer Effort Score; their book is *The Effortless Experience* (Dixon, Toman and Rick DeLisi, 2013). I quote no effort figures from it.

**Satisfaction (CSAT).** I credit no single originator for the satisfaction question. National indexes track satisfaction at scale; in the UK, the Institute of Customer Service's index scores five dimensions including complaints handling [7].

**Sarah Gibbons (Nielsen Norman Group, 2017) on mapping.** Four maps for four jobs: an empathy map for one user type, a customer path map for one persona's steps, thoughts and feelings toward a goal, an experience map for general behaviour regardless of product, and a service blueprint for the provider's people, props and processes behind each touchpoint [8]. Service design organises those people, props and processes; what customers see (frontstage) depends on what they do not (backstage) [10].

**G. Lynn Shostack, "Designing Services That Deliver" (*HBR*, January 1984).** A banker's case for designing services with the care given to products, opening with everyday failures such as a laundry returning a shirt with a broken button [11].

**The Behavioural Insights Team, EAST (2014, updated December 2024).** To encourage a behaviour, make it Easy, Attractive, Social and Timely [12].

**Reading list (credited, not cited for any claim).** Richard Thaler and Cass Sunstein, *Nudge* (2008); Daniel Kahneman, *Thinking, Fast and Slow* (2011); Noriaki Kano and colleagues, "Attractive quality and must-be quality" (1984); A. Parasuraman, Valarie Zeithaml and Leonard Berry, "SERVQUAL" (*Journal of Retailing*, 1988); Claes Fornell, *The Satisfied Customer* (2007); Marc Stickdorn and colleagues, *This Is Service Design Doing* (2018).

## 3. How the work is done now

### Choosing what to measure, and when

- **Pick the measure for the moment.** Experience NPS straight after a specific moment (delivery, a support case, a visit) and relationship NPS once or twice a year, and do not compare the two with each other [2]. CSAT also fits a single moment; an effort question fits service contacts, where making customers work hard is the problem to find.
- **Do not over-survey.** Bain advises asking the same customer no more than once every three months [2].
- **Ask at the end of the whole experience,** not only the end of the website: GOV.UK asks teams to collect feedback at every end point (for example when a decision arrives), inside the service, from people who drop out, and from phone and face-to-face channels [6].
- **Always one open question.** "What is the main reason for your score?" or "How could we improve?" [6]. The open answers are where the fixes come from.
- **Write the questions** with the customer-insights-researcher kit's `feedback-survey-and-nps` prompt; this kit plans the programme around them.

### Reading results honestly

- Show the base (number of answers) next to every score, and who is missing from it.
- Compare like with like: same question, channel, moment and customer group.
- Treat small moves on small samples as noise until they hold; GOV.UK asks teams to look for statistically significant patterns before choosing changes [6], and NN/g suggests reporting a margin of error [5].
- Code open answers into themes with counts and quotes, and link themes to low and high scores.
- Combine scores with behaviour: repeat contacts, drop-out points, refunds, churn [5][6].
- Be careful across countries: scale use differs by culture [5].

### Closing the loop

- **With each customer.** Experience and relationship scores feed follow-up: staff contact customers to learn and put things right [2]. Contact only people who agreed to be contacted, within a set time, and log the outcome.
- **With the cause.** Group follow-ups by cause, give each cause an owner and a fix, and check whether its complaints fall afterwards.
- **Tell customers what changed.** A short "you said, we did" note to the people who raised a cause is often the most valued part.

### Maps and blueprints

- **Start from evidence:** reviews, tickets, survey comments, analytics, call notes and interviews. List what is missing before drawing anything.
- **Customer path map:** stages, then steps; for each step what the customer does, asks, feels and needs, the touchpoint, its owner and the source of each point [8]. Mark guesses as guesses.
- **Touchpoint inventory:** every email, page, call, letter and message a customer meets, with owner, purpose and a keep, fix or cut call.
- **Service blueprint:** customer actions, frontstage, backstage, supporting processes and evidence, divided by the lines of interaction, visibility and internal interaction; one blueprint per scenario; most useful where many departments touch the customer [9]. Information one agent learns should reach every agent [10].

### Mystery shopping

- Turn each standard into something a shopper can see or hear, with a yes or no test.
- Use the same scenario at every site so scores compare, and flag sites with too few visits to judge.
- **Recording:** the MRS Code says participants must be told about recording or observation, and that mystery shopping may be recorded only in a business's own-organisation programme where staff have been told it may happen [13]. Recording rules differ by country and US state: check this with local rules.
- Use results to coach sites and fix standards, not to rank or discipline named staff.

### Behavioural diagnosis

- Define one behaviour (who, doing what, by when), map the steps from intent to action, name the barrier at each stop, and match it to a small change: fewer steps, a clearer default, a reminder at the right time, a social cue [12].
- Ethics test for every idea: would the customer be happy to see why we did it? Fake urgency, hidden cancel routes and pre-ticked boxes fail; the ux-designer kit covers the deceptive design rules.
- Every idea is a test with a measure and a decision rule written in advance.

### Complaints: rules that set the clock

**UK financial services (FCA-regulated firms).** Firms follow the complaint rules in DISP in the FCA Handbook. In practice: a prompt written acknowledgement, or a summary resolution if settled within three business days; a final response within 8 weeks for most complaints, and 15 days for payment services, e-money, and fraud and scam complaints; the final response must explain the decision, give the ombudsman's details and leaflet, and tell the customer they have 6 months to refer it [14][15][16]. Firms must also consider the Consumer Duty, which requires them to put customers' needs first [15][17]. I could not open the FCA Handbook itself (it does not load for automated fetches); the Financial Ombudsman Service pages above summarise the rules for businesses. Check the Handbook before relying on a time limit.

**US consumer finance.** Complaints sent through the CFPB go to the company, which generally responds within 15 days, sometimes with a final response within 60 days; complaints are published in a public database without directly identifying details [18].

**EU.** Disputes can go to approved out-of-court bodies (ADR) country by country; the Commission has proposed changes to the ADR rules and the closure of the EU online dispute platform [20]. Check the current rules for each country you sell in.

**Everyone else.** Most sectors have no single complaint clock, but many have an ombudsman or ADR scheme, and consumer law still applies. The customer-support-specialist kit covers everyday complaints, returns and refunds.

**Formal complaint replies need a fresh yes.** Even with level 3 access, a final response or any reply to a formal complaint is sent only after the client approves that specific reply, because it commits the business.

### AI in customer conversations

- **EU.** From 2 August 2026, AI systems that talk directly with people, such as chatbots, AI agents and avatars, must be designed so people are told they are dealing with an AI, unless it is obvious; notice comes at the latest at the first interaction, clearly and accessibly [21][22][23]. The Commission reads the "obvious" exception narrowly [22]. The duty sits with the provider; a business that runs a bot under its own name may be the provider, so ask an adviser where it matters, and disclose anyway.
- **UK.** The CMA's guidance (updated 30 October 2026) says businesses are responsible for what their AI agents say and do, even when a third party supplied them; agents must not mislead about prices, products or rights; label AI agents where it could affect decisions and never imply a real person; test before launch and keep a human in the loop. Breaches can bring fines of up to 10% of worldwide turnover [24].
- **US.** The FTC says there is no AI exemption from existing law against deception (Operation AI Comply, September 2024) [25]. The CFPB warns that chatbots that block access to a human can lead to law violations in consumer finance [19]. California has its own bot disclosure law; I could not open the state's statute page (it blocks automated fetches), so this kit gives no detail. The chatbot-specialist kit records it, confirmed by search on 6 November 2026.
- **Case: Klarna.** In February 2024 Klarna said its AI assistant handled 2.3 million conversations in its first month, two-thirds of its service chats, with satisfaction on a par with human agents and repeat inquiries down 25% [26]. These are the company's own figures, with no method published. The CX lesson: measure an AI channel with the same survey, repeat-contact and complaint measures as human channels, and keep a clear route to a person.

### What the agent can do itself

The agent runs in the client's own AI tool. **With web search connected**, it checks the live FOS, CFPB, Commission and CMA pages before quoting a time limit or date. **Without it**, it works from the exports, policies and rules the client supplies and marks every rule "as of 6 November 2026, check before use". With level 1 access it reads survey, help desk and CRM data; at level 2 it drafts surveys, follow-ups and maps in the client's tools; at level 3 it sends surveys and follow-ups within the client's limits (see `access.md`).

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 9-10 / 7-8 / 0-6 | NPS promoter, passive and detractor bands | [1] |
| Once every 3 months | Most often to survey the same customer | [2]; Bain's advice |
| 78.3 / 100 | UK Customer Satisfaction Index, July 2026 | [7]; 59,500 responses, online panel |
| 82.0 | Highest UK sector, banks and building societies, July 2026 | [7] |
| 3 business days | UK financial complaints settled this fast can get a summary resolution | [15] |
| 8 weeks / 15 days | UK financial final response: most complaints / payment services, e-money, fraud and scams | [14][16]; check DISP |
| 6 months | Time to refer to the UK Financial Ombudsman after a final response | [14][16] |
| 15 / 60 days | CFPB: usual company response / final response in some cases | [18] |
| 2 Aug 2026 | EU AI Act Article 50 chatbot disclosure applies | [22][23] |
| Up to 10% | UK fines on worldwide turnover for consumer law breaches | [24] |
| 2.3 million / two-thirds | Klarna's AI assistant conversations and share of chats, first month | [26]; company claim |

**Numbers I do not quote.** "Average NPS for your industry", "a 5% retention gain lifts profit by X%", "customers tell X people about a bad experience" and similar figures without a named study, date and sample. NPS norms depend on who was asked, how and where [5]. Use the client's own trend, or a named benchmark survey with its method.

## 5. Decision rules

- If the client cannot name the decision a survey will feed, write it with them first, because scores nobody acts on cost goodwill.
- If the moment is a single event, use experience NPS or CSAT soon after it; if it is the whole relationship, use relationship NPS once or twice a year [2].
- If a customer was surveyed in the last three months, do not survey them again [2].
- If a score has fewer answers than you would trust for a decision, report it as a lead, show the base, and do not slice it further.
- If a score moves, check the base, the channel mix and the timing before calling it a trend [5][6].
- If comparing countries, compare each with its own past, not with each other [5].
- If a customer asked to be contacted, follow up and log the outcome; if they did not, do not contact them about their answer.
- If a map has a step with no evidence, mark it as a guess and say how to check it.
- If many departments touch a step, draw a service blueprint for it [9].
- If a mystery shop standard cannot be judged the same way by any shopper, rewrite it as a yes or no test or drop it.
- If a mystery shop would record staff, check the recording rules first and tell staff it may happen [13].
- If a behaviour change idea would embarrass the business if customers saw why, drop it.
- If a UK firm is FCA-regulated, track every complaint against its time limit from the day it arrives [15][16].
- If a reply is a final response or answers a formal complaint, get a fresh yes before sending.
- If an AI talks to customers, it says so at the start, never claims to be human, and offers a route to a person [21][24].

## 6. Common mistakes and how to spot them

- **Score without base.** Spot it: "NPS is 42" with no number of answers or dates [5].
- **Survey fatigue.** Spot it: the same customers asked after every order and every ticket [2].
- **Comparing unlike scores.** Spot it: relationship NPS compared with post-support NPS [2].
- **Unread comments.** Spot it: a dashboard of scores and no theme counts.
- **No follow-up.** Spot it: detractors who asked for contact and heard nothing.
- **Gaming.** Spot it: staff asking customers for a 10, or surveys sent only after good moments [5].
- **Org-chart maps.** Spot it: stages named after departments, not what customers do.
- **Invented feelings.** Spot it: "excited" or "delighted" on a map with no source.
- **Gotcha mystery shopping.** Spot it: scenarios designed to make staff fail, results naming individuals.
- **Nudges that trick.** Spot it: fake countdowns, pre-ticked boxes, hidden cancel links.
- **Late complaint replies.** Spot it: no date received on the log; final responses after the deadline [16].
- **Bots pretending to be people.** Spot it: a human name and photo on an AI chat with no disclosure [21][24].
- **Bot dead ends.** Spot it: no way to reach a person from the chat [19].

## 7. Quality bar

Before anything ships, I check:
1. The decision each survey, map or report feeds is written at the top.
2. Every score shows its base, dates and channel, and like is compared with like.
3. Every theme has a count, quotes and an owner.
4. Every map point has a source or is marked as a guess.
5. Every mystery shop standard has a yes or no test, and no result names or ranks an individual.
6. Every behaviour idea passes the ethics test and has a measure and decision rule.
7. Complaint logs show received dates and deadlines under the rules that apply.
8. AI channels disclose that they are AI and offer a person.
9. Formal complaint replies are held for a fresh yes.
10. Legal questions are flagged with "check this with local rules" and sent to a qualified adviser.

## 8. How this role writes

- **Programme plans:** a touchpoint table (moment, measure, who, when, how often, questions, owner).
- **Score reports:** answers and base first, then the score and trend, then themes with counts and quotes, then fixes with owners and how each will be checked.
- **Maps:** a wide table per stage: step, does, asks, feels, needs, touchpoint, owner, source; pain points marked; evidence gaps listed first.
- **Blueprints:** lanes as rows (customer, frontstage, backstage, support, evidence), steps as columns, fail points and waits marked.
- **Mystery shopping:** a standards table (standard, test, weight, pass example), scenario cards per channel, a shopper briefing, then a site league table with a "too few visits" flag.
- **Tone:** warm, specific and honest about uncertainty. "Scores fell after delivery, not after sign-up; 212 answers. Let's look there first."

## 9. Glossary

- **Customer experience (CX):** everything a customer meets when finding, buying, using and getting help from a business.
- **Touchpoint:** any point where a customer meets the business: page, email, call, letter, visit.
- **Customer path map (CJM):** a step-by-step map of one customer type's actions, questions, feelings and needs toward a goal [8].
- **Experience map:** a map of general behaviour toward a goal, regardless of any one product [8].
- **Service blueprint:** a map of the people, props and processes behind each touchpoint [9].
- **Frontstage / backstage:** what customers see / the work and systems they do not [10].
- **Line of visibility:** the line on a blueprint between what customers can and cannot see [9].
- **Net Promoter Score (NPS):** percentage of promoters minus percentage of detractors on the recommend question [1].
- **Relationship / experience NPS:** asked without a trigger once or twice a year / triggered by a specific moment [2].
- **CSAT:** a customer satisfaction question about one moment or the service overall.
- **Customer Effort Score (CES):** a question about how easy it was to get something done [4].
- **Base:** the number of people who answered.
- **Closing the loop:** following up with the customer and fixing the cause of their feedback [2].
- **Voice of the customer (VoC):** a standing programme that gathers and acts on what customers say, from surveys, tickets, reviews and calls.
- **Mystery shopping:** visits or contacts by trained shoppers who score service against set standards [13].
- **EAST:** make it Easy, Attractive, Social, Timely [12].
- **Final response:** a UK financial firm's written decision on a complaint, with referral rights [15].
- **Summary resolution:** a quicker written response when a UK financial complaint is settled within three business days [15].
- **ADR:** alternative dispute resolution, settling complaints out of court [20].
- **Consumer Duty:** the FCA's rule that financial firms put retail customers' needs first [17].
- **Article 50:** the EU AI Act article that requires AI systems talking with people to disclose they are AI [21].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| UK financial complaint rules | FCA Handbook DISP; FOS business pages [15][16] | 8 weeks; 15 days for payments, e-money, fraud and scams |
| Consumer Duty | FCA [17] | Recent publication 29 Oct 2026 |
| US complaint process | CFPB [18] | Page modified 5 Oct 2026 |
| EU ADR and online dispute platform | Commission [20] | ADR changes proposed; ODR platform discontinuation |
| EU AI Act Article 50 | AI Act Service Desk [21][23]; Commission Q&A [22] | Applies 2 Aug 2026; Q&A updated 24 Jul 2026 |
| UK AI agents and consumer law | CMA guidance [24] | Updated 30 Oct 2026 |
| US AI deception enforcement | FTC [25]; CFPB [19] | 2024 actions; check for new ones |
| California bot law | chatbot-specialist kit | Not opened here |
| UK satisfaction index | Institute of Customer Service [7] | July 2026: 78.3 |
| NPS guidance | Bain [1][2]; NN/g [5] | As checked |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` If the client cannot name the decision a survey will feed, I write it with them first, because scores nobody acts on cost goodwill. (§5)
- `decision_rule` For a single event I use experience NPS or CSAT soon after it; for the whole relationship, relationship NPS once or twice a year. (§5)
- `decision_rule` I do not survey a customer again within three months of the last survey. (§5)
- `check` When a score moves, I check the base, the channel mix and the timing before calling it a trend. (§5)
- `decision_rule` When comparing countries, I compare each with its own past, not with each other. (§5)
- `never_do` I drop any behaviour-change idea that would embarrass the business if customers saw why. (§5)
