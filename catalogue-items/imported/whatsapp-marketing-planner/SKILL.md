---
name: whatsapp-marketing
description: Build a WhatsApp marketing strategy — WhatsApp Business setup, broadcast campaigns, automated flows, customer service, drip sequences, and conversational marketing. Use when the user says "WhatsApp marketing", "WhatsApp Business", "WhatsApp campaigns", "WhatsApp broadcasts", "WhatsApp automation", "WhatsApp drip", "market on WhatsApp", "WhatsApp for business", "WhatsApp chatbot", "WhatsApp customer service", "WhatsApp API", "messaging marketing India", or wants to use WhatsApp as a marketing and customer communication channel. Especially relevant for brands in India, the Middle East, Southeast Asia, Brazil, and Africa.
metadata:
  version: 1.0.0
---

# WhatsApp Marketing

You are a WhatsApp marketing strategist. Your job is to build a WhatsApp channel that drives sales, retains customers, and delivers support — using the world's most-used messaging app as a direct line to the customer.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A business profile** (yours): a sourced business profile with buyer, offer, activation, growth goal, stage and limits; missing private metrics remain unknown.

**Makes it better (optional):**
- **Brand brain**, made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for a business profile, your brand brain. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Before You Start

Check if `.agents/brand-context.md` exists. Read it. WhatsApp marketing must match the brand's voice precisely — it's the most personal channel a brand can use, and the wrong tone feels intrusive immediately.

---

## WhatsApp Marketing Overview

WhatsApp is widely used worldwide. In India, Brazil, and much of Southeast Asia, it's a primary communication platform, often more than email or SMS (check current figures for your market before you quote any).

*The figures in this file (open, response and conversion rates, user counts) are rough estimates from the original author. They are not verified. Do not present them as data, and give no benchmark unless the user supplies a source.*

**Open rates**: often quoted as very high (unverified; vs. much lower for email)
**Response rates**: often quoted as much higher than email (unverified)
**Why it works**: Users chose to opt in and treat WhatsApp as personal — messages from brands they trust get opened first

**The risk**: It's the most personal channel. Spam or off-brand tone gets immediate blocks.

---

## WhatsApp Marketing Options

**Option 1 — WhatsApp Business App (free)**
Best for: Small businesses, <1,000 customers, manual messaging
- Business profile setup
- Quick replies and labels
- Broadcast lists (up to 256 contacts)
- Catalog of products
- Limitation: Manual, doesn't scale, no automation

**Option 2 — WhatsApp Business API**
Best for: Medium to large businesses, automation, scale
- Access via BSP (Business Solution Provider): Wati, Interakt, AiSensy, Zoko, Twilio
- Unlimited broadcasts to opted-in customers
- Automated flows and chatbots
- CRM integration
- Requires WhatsApp approval + template pre-approval

---

## Information to Gather

1. **Business size and volume** — how many customers/contacts?
2. **Primary goal** — sales, support, retention, or all?
3. **Market** — India, Middle East, Southeast Asia, Brazil, global?
4. **Current setup** — WhatsApp Business App or API?
5. **Budget** — for BSP platform + messaging costs?
6. **Existing customer database** — do they have opted-in contacts?
7. **Industry** — any compliance restrictions (finance, healthcare)?

---

## Output: WhatsApp Marketing Strategy

---

### 01 — SETUP AND COMPLIANCE

**WhatsApp Business profile setup:**
- Business name (must match registered business name)
- Profile photo (logo, professional headshot, or brand image)
- Business description (clear, what you do + hours)
- Business category
- Website and email linked
- Business hours set correctly

**Opt-in requirements (critical — non-compliance = ban). This is general guidance, not legal advice. Check WhatsApp's current policy and your local rules on opt-in wording and review requests before you send:**
WhatsApp requires explicit opt-in before messaging any customer.

**Opt-in collection methods:**
- Website widget ("Chat with us on WhatsApp" + opt-in checkbox)
- QR code at point of sale / packaging / print
- "Send us a message on WhatsApp" CTA in email/SMS
- Click-to-WhatsApp ads (Meta Ads → WhatsApp) — opt-in built into the flow
- Checkout opt-in ("Receive order updates on WhatsApp")

**What to say at opt-in:**
"By subscribing, you agree to receive marketing messages from [Brand] on WhatsApp. You can unsubscribe at any time by replying STOP."

**Opt-out:**
- Always include unsubscribe option in campaigns ("Reply STOP to unsubscribe")
- Process opt-outs immediately
- Never re-add someone who opted out

---

### 02 — MESSAGE TEMPLATES (API ONLY)

WhatsApp requires pre-approved templates for outbound messages. Template categories:

**Marketing templates** (for promotions, product launches):
- Must be pre-approved by WhatsApp
- Include opt-out option
- Personalization variables allowed: {{name}}, {{order_id}}, etc.

**Utility templates** (for transactional messages):
- Order confirmations, shipping updates, appointment reminders
- Higher approval rate — approved within hours typically

**Authentication templates** (for OTPs):
- Login verification codes
- Very high approval rate

**Template best practices:**
- Keep under 160 characters where possible
- Include the brand name naturally ("Hi {{name}}, [Brand] here...")
- Clear value in the first line
- One CTA per message
- Include opt-out phrase in marketing templates

---

### 03 — CAMPAIGN TYPES AND FLOWS

**Broadcast campaigns** (one-to-many):

| Campaign | Trigger | Message type |
|----------|---------|-------------|
| Product launch | New product live | Marketing template |
| Flash sale | Sale start | Marketing template |
| Abandoned cart | 1–2 hrs after cart abandonment | Marketing template (a sales reminder is promotional; confirm the category with your business service provider before sending) |
| Back in stock | Product restocked | Marketing template |
| Seasonal offer | Festival / holiday | Marketing template |
| Loyalty reward | Customer milestone | Marketing template |

**Automated flows** (triggered, one-to-one):

**Welcome flow** (new opt-in):
- Message 1 (immediate): Welcome + what to expect from this channel
- Message 2 (day 2): Brand story or hero product
- Message 3 (day 5): Best offer or most popular product

**Post-purchase flow:**
- Message 1: Order confirmation (utility)
- Message 2 (shipping): Dispatch notification with tracking (utility)
- Message 3 (day 7): How are you liking it? + review request. Review requests must follow WhatsApp's policy and your local review rules. In many countries it is not allowed to pay or reward people for positive reviews, or to ask only the happy customers. Ask every buyer, offer no reward for a good rating, and check the rules where you sell. This message is promotional, so send it only to opted-in contacts and confirm its template category with your provider.
- Message 4 (day 30): Replenishment reminder (consumable products)

**Abandoned cart flow:**
- Message 1 (1 hr): "You left something behind" — cart reminder
- Message 2 (24 hrs): Add social proof or answer objection
- Message 3 (48 hrs): Offer an incentive only if you have one to give (for example a discount or free shipping). Marketing template, opted-in contacts only.

**Win-back flow** (inactive customers, 60+ days):
- Message 1: "We miss you" — genuine, not pushy
- Message 2 (5 days): New arrival or what's changed
- Message 3 (10 days): Best offer, last attempt

---

### 04 — CONVERSATIONAL COMMERCE

WhatsApp is the best channel for conversational selling — especially in India and emerging markets where customers prefer to chat before buying.

**Catalog setup:**
- Add full product catalog to WhatsApp Business
- Products browse-able without leaving WhatsApp
- Direct "Add to Cart" and checkout (where available)
- Keep catalog updated — out-of-stock products removed

**Sales conversation flow:**
1. Customer enquires about product
2. Bot qualifies (which product, size, use case?)
3. Bot shows relevant products from catalog
4. Customer selects → payment link sent directly in chat
5. Order confirmed via WhatsApp

**Chatbot vs. human handoff:**
- Bot handles: FAQs, product info, order status, standard enquiries
- Human takes over: Complaints, complex queries, high-value orders
- Trigger handoff clearly: "Let me connect you with a team member"
- Set SLA for human response: within 2 hours during business hours

---

### 05 — CONTENT STRATEGY FOR WHATSAPP

WhatsApp content is different from email or social. Rules:

**What works:**
- Short, direct messages (under 160 characters ideal)
- Personal tone — like a message from a friend
- Rich media: images, videos, voice notes, PDFs
- One CTA per message
- Emojis to add warmth (not excessive)
- Interactive buttons (quick replies, call-to-action)

**What doesn't work:**
- Long paragraphs — won't be read
- Multiple products in one message — confusing
- Over-formal corporate language — kills the channel's intimacy
- Sending too frequently — start with a low number of broadcasts per month, watch your unsubscribe rate, and set your own limit from it
- Sending without clear value — immediate unsubscribes

**Rich media usage:**
- Images: product photos, offers, event invites
- Video: product demos, tutorials, brand stories (30 sec max)
- Voice notes: Founder messages, personal touches (test them on a small group first)
- PDFs: Lookbooks, menus, price lists, certificates

---

### 06 — WHATSAPP METRICS

**The original author's benchmark figures were unverified guesses, so they are removed. Do not invent benchmarks. Leave the "Your baseline" column blank until the user has their own campaign results, and use only figures the user supplies with a source.**

| Metric | Your baseline (fill from your own campaigns) | What it shows |
|--------|-----------|--------------|
| Delivery rate | [YOUR RATE] | List health |
| Open rate | [YOUR RATE] | Message timing + list quality |
| Read rate | [YOUR RATE] | Headline and preview quality |
| Reply rate | [YOUR RATE] | Message relevance + CTA clarity |
| Click rate (links) | [YOUR RATE] | Offer and CTA strength |
| Unsubscribe rate | [YOUR RATE] | Frequency + relevance (a rising rate is a problem) |
| Conversion rate | [YOUR RATE] | Offer + funnel quality |

**Monitor weekly:**
- Unsubscribe rate per campaign (if spiking, messaging is off)
- Response time to inbound messages (impacts trust)
- Unanswered messages (bot gaps to fix)

---

### 07 — PLATFORM RECOMMENDATIONS BY SCALE

*Check current pricing with each provider before you decide. The original author's dollar figures were unverified and are removed. These tools are paid services (the API route needs a paid account with a Business Solution Provider, and each message may cost extra).*

| Business size | Platform | Monthly cost |
|--------------|----------|-------------|
| <500 contacts | WhatsApp Business App | Free |
| 500–5,000 | Wati / AiSensy | [CHECK PROVIDER PRICE] |
| 5,000–50,000 | Interakt / Zoko | [CHECK PROVIDER PRICE] |
| 50,000+ | Twilio / custom API | [CHECK PROVIDER PRICE] |

**India-specific BSPs** (best support, pricing in INR):
- **Interakt** — strong for DTC and e-commerce
- **AiSensy** — good chatbot builder, affordable
- **Wati** — popular, good integrations with Shopify
- **Zoko** — strong catalog + conversational commerce

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [WhatsApp support reply writer](https://useaiblocks.com/skills/whatsapp-support-reply-assistant).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Related Skills

- **email-marketing**: Complement WhatsApp with email for complete owned channel coverage
- **d2c-marketing**: WhatsApp as core DTC retention channel
- **ugc-strategy**: Use WhatsApp to collect reviews and customer content
- **brand-voice**: WhatsApp tone must match brand voice
- **brand-context**: Foundation context for all brand work
