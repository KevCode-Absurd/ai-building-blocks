# First traction for SaaS and software

Variant playbook for the SaaS growth lead. It applies the Bullseye method from Gabriel Weinberg and Justin Mares, *Traction* (2015) [1], in our own words, to software sold by subscription. Read `orchestrator.md` first: it explains the traction goal, the critical path, cheap tests, the channel team and approvals. The authors have not reviewed or endorsed this kit.

## 1. Who this is for

Founders of B2B and prosumer SaaS, from pre-launch to roughly the first two million in annual recurring revenue. Many are technical founders who can build almost anything but have never sold or marketed. Typical situations:

- the product works, a few friends use it, and nobody else has heard of it;
- there are sign-ups but few of them pay;
- one channel worked by luck (a launch post, a big customer) and then went quiet.

The job here is the first hundred paying customers, and a channel that keeps bringing more. Software has advantages most businesses lack: it can be tried before buying, it can plug into other products, and a free tool can be a slice of it. It also has a trap: building feels productive, so founders keep building instead of selling. Weinberg and Mares's advice to split time evenly between product and traction applies with full force [1][2].

## 2. Intake questions

1. What does the product do, for whom, and what do buyers use instead today (a rival, a spreadsheet, nothing)?
2. What stage are you at: pre-launch, free users only, or paying customers? How many paying accounts, and what is monthly recurring revenue?
3. How do people buy: free trial, free plan, or a demo with you? Monthly or annual? What are the price points?
4. Who uses the product, and who signs off the payment? Job title and company size for each.
5. What is the activation moment, the first action that shows a new user the value? Do you track it?
6. Where did each of your paying customers come from? List them one by one if you can.
7. What traction goal do you need, by when, and why that number (raise a round, pay yourself, hire)?
8. How many hours a week can the founders give to traction? Who can write, who can sell, who can speak?
9. How much cash can go into tests this quarter, and how much can you lose without hurting runway?
10. Which tools do your buyers already live in (Slack, Shopify, HubSpot, an app store), and do you integrate with any of them?
11. Which rivals do buyers compare you with? When you ask ChatGPT, Gemini or Perplexity for tools like yours, who gets named?
12. What tracking exists (web analytics, product analytics, CRM, billing)? For each tool, which access level will you grant: 1 read, 2 read and draft, or 3 read, write and publish within limits you set?
13. Which countries do you sell to, and are you willing to do cold outreach there?

## 3. The numbers that matter for SaaS

Track these from week one, by channel wherever possible. All formulas use the same date range and the same source tag.

- **Visitor-to-signup rate** = new sign-ups ÷ unique visitors.
- **Activation rate** = new accounts that reach the activation event within your chosen window (for example 7 or 14 days) ÷ new sign-ups in that cohort.
- **Trial-to-paid rate** = trials that become paying accounts ÷ trials started, by cohort.
- **Sign-up-to-paid rate** = paying accounts from a cohort ÷ sign-ups in that cohort.
- **ARPA** (average revenue per account per month) = monthly recurring revenue ÷ paying accounts.
- **Gross margin %** = (revenue − cost to serve: hosting, support, third-party fees) ÷ revenue.
- **CAC by channel** = (cash spent + tools + paid help + founder hours × an agreed hourly value) ÷ new paying accounts from that channel. Count founder time: in early SaaS it is usually the biggest cost.
- **CAC payback (months)** = CAC ÷ (ARPA × gross margin %).
- **Allowable CAC** = ARPA × gross margin % × the payback months you can afford. Runway and funding decide that last number, not a rule of thumb.
- **Allowable cost per sign-up** = allowable CAC × sign-up-to-paid rate. This turns a sign-up test into a money test.
- **Net new MRR** = new MRR + expansion − contraction − churned MRR.
- **Logo churn** = accounts lost in the month ÷ accounts at the start of the month.
- **Demo show rate** = demos held ÷ demos booked. **Demo close rate** = deals won ÷ demos held.
- **AI answer share** = buying questions where an AI assistant names you ÷ buying questions checked. Use the same 20 questions, the same assistants and a logged-out browser each month, and save screenshots.

Worked example (made-up numbers, to show the maths only): ARPA 50, gross margin 80%, and you can afford a 12-month payback. Allowable CAC = 50 × 0.8 × 12 = 480. If 4% of sign-ups become paying, allowable cost per sign-up = 480 × 0.04 = 19.20.

## 4. Channel ranking for SaaS

A starting order before the brainstorm. Re-rank for each product: a developer tool and an HR tool for small shops will differ.

1. **Sales, founder-led** (`sales`): *usually inner ring*. The first customers need conversations, and those conversations teach you the buyer's words.
2. **Community building** (`community-building`): *usually inner ring*. Buyers ask for help in Reddit, Slack groups, Indie Hackers and product forums, and a useful answer can be a first customer.
3. **SEO plus AI answers** (`seo-aeo-geo`): *usually inner ring*. Comparison, alternatives and use-case pages catch buyers mid-search, and the same pages feed AI answers.
4. **Content marketing** (`content-marketing`): *usually inner ring*. Founder posts and teardowns build trust where buyers read, and cost time rather than cash.
5. **Free tools as marketing** (`engineering-as-marketing`): *usually inner ring*. A grader, calculator or template can be a free slice of the product.
6. **Existing platforms** (`existing-platforms`): *usually inner ring*. Integration marketplaces, Product Hunt and review sites put you where buyers already look.
7. **Partnerships and business development** (`business-development`): *test when ready*. Integration partners and agencies can bring customers, but they want proof you are worth their name.
8. **Creators, newsletters and podcasts** (`creators-and-newsletters`): *test when ready*. Niche newsletter sponsorships are quick to read once you know which message converts.
9. **Email marketing** (`email-marketing`): *test when ready*. Onboarding and trial emails lift activation, but they need sign-ups to work on.
10. **Viral loops and referral** (`viral-and-referral`): *test when ready*. Works when using the product involves inviting others; otherwise wait for happy customers.
11. **Search ads** (`search-ads`): *test when ready*. High intent, but crowded categories are costly, so only after activation works and tracking reaches paid accounts.
12. **Speaking, podcast guesting and webinars** (`speaking-engagements`): *test when ready*. Strong for founders who can teach; slow to book.
13. **Affiliate and creator commissions** (`affiliate-programs`): *test when ready*. Needs known payback before you can promise a commission.
14. **Social and display ads** (`social-and-display-ads`): *rarely first*. Costly while the ideal customer and message are still guesses.
15. **Publicity** (`publicity`): *rarely first*. A launch is rarely news; save press for real data or a story.
16. **Unconventional PR** (`unconventional-pr`): *rarely first*. Stunts fit consumer products better; customer thank-yous are cheap and worth doing anyway.
17. **Trade shows** (`trade-shows`): *rarely first*. Costly, but worth a look for vertical SaaS where an industry meets at one event.
18. **Offline events** (`offline-events`): *rarely first*. Useful for local or tight professional groups; slow to scale.
19. **Offline ads** (`offline-ads`): *rarely first*. Hard to track to a sign-up and rarely cheap.

## 5. The first 90 days

**Week 1.** Agree the traction goal and critical path. Agree the access level for each tool (level 1 until the client says otherwise), connected through official connectors or the tool's own sign-in. Add a source field to sign-up and a "how did you hear about us?" question. Define the activation event. List every paying customer with their source.

**Week 2.** Brainstorm all 19 channels with one test idea each. Interview five paying customers: how they found you, what they compared, what nearly stopped them. Run the 20 buying questions in two or three AI assistants as a baseline.

**Week 3.** Rank into rings and pick the inner three. Write test cards with go and stop numbers from section 3. Brief the three specialists. Client approves cards, drafts and lists.

**Week 4.** Launch round one. Typical mix: a founder outreach batch (`sales`), answering real questions in one community (`community-building`), and three comparison or alternatives pages (`seo-aeo-geo`). At level 3 access the lead launches these within the agreed limits and logs each action; at level 2 it builds them for the client to publish.

**Week 5.** Monday numbers. Change one thing per test at most. Founder handles every reply personally.

**Week 6.** Midpoint check with the client. Second outreach batch to the segment that replied best. Request indexing for new pages and log their first impressions in Search Console.

**Week 7.** Read round one against go and stop. Write one decision per channel.

**Week 8.** Round two: rerun what was unclear with one change, and replace what stopped with a middle-ring channel (an integration marketplace listing, a newsletter sponsorship).

**Week 9.** If sign-ups arrive but do not activate, spend this week on onboarding: the product half of the time split. Email specialist drafts the onboarding emails.

**Week 10.** Focus decision. The winning channel's specialist writes a 90-day plan. Keep one small middle-ring test alive.

**Week 11.** Make the winner a routine: weekly quotas, templates, and a tracker that shows CAC and payback.

**Week 12.** Raise volume within the allowable CAC. Watch activation and churn of the new cohort, not just sign-ups.

**Week 13.** Review against the goal. Re-run the 20 AI questions. Re-rank all 19 channels and agree next quarter's goal.

## 6. A cheap test menu for the top 6

### 1. Founder-led outreach (`sales`)
Write 50 short, personal emails or LinkedIn messages to one tight customer profile, each referring to something specific about that company. Offer a 20-minute call, not a demo.
- **Cost:** no cash beyond a contact tool on a free plan; about a day of founder time per batch.
- **Time:** two weeks.
- **Go:** enough calls that fit the profile to fill your critical-path milestone, and at least one call that turns into a trial or a paid pilot.
- **Stop:** no replies that fit the profile after two batches with different openings.
Rules: CAN-SPAM covers business email in the US [10]; in the UK, sole traders count as individuals [11]; in the EU, check data protection and ePrivacy rules [12].

### 2. Useful answers in one community (`community-building`)
Pick one place where buyers ask for help. Answer 20 real questions over four weeks without linking unless asked or allowed, and keep a profile that says what you build.
- **Cost:** time only, about 30 minutes a day.
- **Time:** four weeks.
- **Go:** tracked sign-ups from the community at or below the allowable cost per sign-up, counting your time.
- **Stop:** no sign-ups, or moderators object.

### 3. Three comparison or alternatives pages (`seo-aeo-geo`)
Write honest "X vs Y" and "alternatives to X" pages for the rivals buyers named in intake.
- **Cost:** two to four days of writing.
- **Time:** six to twelve weeks to read; check impressions in Search Console weekly and the 20 AI questions monthly.
- **Go:** impressions climbing for the target searches, and any sign-ups from the pages.
- **Stop:** no impressions after the read period, which usually means the pages are not indexed or not wanted.

### 4. Founder posts (`content-marketing`)
Thirty days of posts on the one platform where buyers read, each with one lesson and one call to action.
- **Cost:** time only.
- **Time:** 30 days.
- **Go:** sign-ups or calls traced to posts, with time cost inside the allowable CAC.
- **Stop:** no conversations started after 30 days.

### 5. A free tool in two weeks (`engineering-as-marketing`)
Ship one calculator, grader or template that does a step buyers take before buying, with a sign-up next step.
- **Cost:** about two weeks of build time.
- **Time:** two weeks to build, four to read.
- **Go:** tool users sign up and activate at least as well as other sign-ups.
- **Stop:** few completed uses, or users who never activate.

### 6. Two integration marketplace listings (`existing-platforms`)
List in the two marketplaces your buyers use most, with screenshots and a clear first use case.
- **Cost:** listing work; some marketplaces review apps first, so check the rules.
- **Time:** approval time plus four weeks.
- **Go:** installs that become paying accounts at or below the allowable CAC.
- **Stop:** installs that never activate, or approval blocked.

## 7. Real early-traction stories

- **Zapier.** The founders searched software forums for people asking how to connect two apps, then emailed them. That is how they found their first paying user, who in December 2011 paid a beta fee into a founder's personal PayPal before Zapier could take payments [4]. The team says it sent more than 25,000 messages to users before launch [5]. Channels: community and founder-led sales.
- **Stripe.** Paul Graham describes the "Collison installation": instead of sending a link, the founders asked for the prospect's laptop and set Stripe up on the spot [3]. Channel: founder-led sales that did not need to scale.
- **Plausible Analytics.** Its first paying subscriber came on 14 May 2019, and it took 324 days to reach $400 in monthly recurring revenue. A blog post on 8 April 2020 got the attention of Hacker News and more than 50,000 readers within days, and the co-founder says it changed the company's traction. By October 2021 it reported $500k in annual recurring revenue, with no paid ads and no affiliate programme [6]. Channels: content and community.
- **Tally.** The form builder began 2021 at about $233 in monthly recurring revenue and 1,000 users, launched on Product Hunt in March, shared milestones on Indie Hackers, and ended the year at $8.5k and 16,700 users [7]. Channels: existing platforms and community.
- **Buffer.** Co-founder Leo Widrich said in 2012 that about 150 guest posts in roughly nine months brought around 100,000 users [8]. In 2026 terms: content placed in other people's publications.
- **HubSpot.** Its free Website Grader launched in 2006 and had been used by over four million people by December 2011, according to HubSpot's own release [9]. Channel: free tools.

## 8. Budget guidance

- Time is the main budget in early SaaS. Agree founder hours first, then cash.
- Set each test's cash cap from the allowable CAC: enough to win the handful of customers needed to read the test, and no more. If you cannot afford even that, choose time-based channels.
- Do not buy ads until activation works. Paying to send people into an onboarding that loses them measures the onboarding, not the channel.
- Free plans of tools are enough for tests. Commit to paid tools, annual contracts or agencies only after a channel passes its go number.
- When a channel wins, raise spend in steps and re-check CAC payback at each step, because costs usually rise as you reach colder buyers.
- Keep a small, fixed share of effort on middle-ring tests during focus, so the next channel is ready.

## 9. Common traps for SaaS

- **Building instead of selling.** One more feature feels safer than fifty emails. Hold the weekly traction hours.
- **Counting sign-ups.** Sign-ups that never activate are not traction. Judge channels on activated and paying accounts.
- **Copying rivals' channels.** If every rival buys the same keywords, those clicks are the dearest. Look for the channel they ignore [1].
- **Judging SEO in two weeks.** Use impressions and AI answer checks as early signals, and give pages time.
- **Spamming communities.** Self-promotion against a group's rules gets you banned and remembered. Help first.
- **Cold email without rules.** Check CAN-SPAM, PECR and EU rules before the first batch [10][11][12], and honour opt-outs.
- **Too many tests.** Three at once is the limit for a small team.
- **No source tracking.** Without a source on every sign-up you will not know which test worked.
- **Stopping a channel after one weak tactic.** Change the offer or audience once before giving up.

## 10. Sources

1. *Traction*, Gabriel Weinberg and Justin Mares. Penguin (Portfolio Penguin), 2015. https://www.penguin.co.uk/books/289806/traction/9780241242537.html (checked 2026-11-06)
2. Product & Growth: The 50% Rule of Growing a Startup, Gabriel Weinberg (excerpt from *Traction*). Startup Grind, 1 Sep 2014. https://www.startupgrind.com/blog/the-50-rule/ (checked 2026-11-06)
3. Do Things that Don't Scale, Paul Graham. paulgraham.com, Jul 2013. https://paulgraham.com/ds.html (checked 2026-11-06)
4. The Anatomy of Sales at a Startup or How Andrew Warner Became Our First Paying Customer. Zapier blog. https://zapier.com/blog/anatomy-of-sale-or-how-andrew-warner-became-our-first-paying-user (checked 2026-11-06)
5. Why We Sent 25,000 Messages to Users Before We Launched. Zapier blog. https://zapier.com/blog/why-we-sent-25000-messages-users-we-launched (checked 2026-11-06)
6. How we bootstrapped our Google Analytics alternative to $500k ARR, Marko Saric. Plausible Analytics blog, 25 Oct 2021. https://plausible.io/blog/bootstrapping-saas (checked 2026-11-06)
7. 2021: from $233 to $8.5k MRR, Marie Martens. Tally blog, 16 Jan 2022. https://blog.tally.so/2021-from-233-to-8k-mrr/ (checked 2026-11-06)
8. How guest posting propelled one site from 0 to 100,000 customers. Search Engine Watch, 26 Jul 2012. https://www.searchenginewatch.com/2012/07/26/how-guest-posting-propelled-one-site-from-0-to-100000-customers (checked 2026-11-06; the site blocks automated fetches, confirmed from a search result showing this page)
9. HubSpot launches comprehensive free Marketing Grader tool after grading 4 million websites. PR Newswire, 6 Dec 2011. https://prnewswire.com/news-releases/hubspot-launches-comprehensive-free-marketing-grader-tool-after-grading-4-million-websites-135091323.html (checked 2026-11-06)
10. CAN-SPAM Act: A Compliance Guide for Business. US Federal Trade Commission. https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business (checked 2026-11-06)
11. Business-to-business marketing. UK Information Commissioner's Office. https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/ (checked 2026-11-06; the site blocks automated fetches, confirmed from a search result showing this page)
12. Can data received from a third party be used for marketing? European Commission. https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/can-data-received-third-party-be-used-marketing_en (checked 2026-11-06)
