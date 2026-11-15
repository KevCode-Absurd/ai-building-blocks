---
name: bilingual-supplier-messages
description: "Supplier messages in English and Simplified Chinese, each with an English back-translation, a note on tone, what a likely reply means, and a log of every message sent with the owner's yes: first enquiries, RFQ chasers, sample requests, price and MOQ asks, payment terms, PO confirmations, delay chasers, defect claims and price-rise pushback, ready for Alibaba.com chat, Accio, 1688 through a sourcing agent, WeChat or email. Use when you write to factories in China and need the message to land in Chinese, or when you cannot read a Chinese reply with confidence."
---

# Supplier messages in English and Simplified Chinese

**You get:** each message drafted in English and Simplified Chinese with a back-translation, a reply guide for the phrases factories use, a message log, and a rule for confirming every key term by email.

## When to use

- The factory's sales contact writes poor English and the owner's messages keep getting misread.
- A 1688 or WeChat contact replies only in Chinese.
- A price, MOQ, payment or defect message must be exact, with numbers that cannot be misread.
- A reply came back in Chinese and the owner wants to know what it really commits to.

## Not for

- Planning the negotiation (targets, gives, walk-away): use `negotiate-moq-and-price`.
- The first RFQ pack and comparison: use `write-rfq-and-compare-quotes` and `accio-and-alibaba-sourcing-prompts`.
- Contract or NNN wording: use `purchase-order-and-supply-terms` and `nnn-agreement-for-china-factories`, and a lawyer.
- Suppliers outside China: write in plain English with the same rules from step 1.

## What you need

Required:

1. **What the message must do**, in one line (for example "ask for 6.10 dollars FOB at 1,000 units if we commit to 3,000 a year").
2. **The facts to carry**: spec version, quantities, prices with currency and Incoterm, dates.
3. **The channel**: Alibaba.com chat, Accio, 1688 via the owner's sourcing agent, WeChat or email.
4. **The thread so far**, if any.

Optional: the supplier's past replies, the contact's name and role, the negotiation plan.

Wenhao drafts at level 2. Every message is sent only with the owner's yes on that message, from the owner's account or by the sourcing agent the owner chose. No message agrees a price, places an order or promises a payment.

## Before you start: the gates

1. **One ask per message.** Pass: the message asks for one thing. Fail: split it; long multi-ask messages get partial answers.
2. **Numbers checked.** Pass: every number matches the spec, quote and plan. Fail: fix it before translating; a wrong number in Chinese is still a wrong number.
3. **Owner's yes.** Pass: the owner approved this exact text. Fail: keep it as a draft.

## Steps

### 1. Write the English for translation

- Short sentences, one idea each. No idioms, jokes or "ASAP".
- Numbers in digits with units and currency: "1,000 pcs", "6.10 USD per pc FOB Ningbo".
- Dates as 2027-03-15 in English and 2027年3月15日 in Chinese.
- Name the Incoterm and place every time, and say if the price includes Chinese VAT: 含税 (tax included) or 不含税 (tax excluded). China charges 13% VAT on most goods, and a 含税 price is not comparable with an export price.
- Say "this is not an order" on every price message.

### 2. Translate, then back-translate separately

Write the Chinese in plain business Mandarin, polite but direct: 您好 to open, 谢谢 to close, 合作 (cooperation) to frame long-term interest. Then back-translate the Chinese into English without looking at the original, and compare. Any number, date, unit or condition that changed is fixed before sending. For anything that goes into a contract, have a person who does not work for the factory check the Chinese, because in a bilingual China contract the Chinese text usually controls.

### 3. Use the right template

**Price and MOQ ask**

English: "Thank you for your quote. We plan a first order of [1,000] pcs and about [3,000] pcs a year. Another quote we hold is [5.80] USD per pc FOB [Ningbo], same spec version [3]. If we [commit to 3,000 pcs in 12 months], can you offer [6.10] USD per pc FOB [Ningbo] at [1,000] pcs? Please reply in writing. This is not an order."

中文：「您好，谢谢您的报价。我们第一单计划订购[1,000]件，全年预计约[3,000]件。我们收到的另一个报价是每件[5.80]美元，FOB[宁波]，规格书版本相同（第[3]版）。如果我们[承诺12个月内订购3,000件]，您能否在[1,000]件时报每件[6.10]美元，FOB[宁波]？请书面回复。这不是正式订单。」

**Sample request**

English: "Please make [2] samples to our spec, version [3]. Please tell us the sample fee, the courier cost, the making time, and if the sample fee is refunded when we place the bulk order."

中文：「请按照我们的规格书（第[3]版）制作[2]个样品。请告知样品费、快递费、打样时间，以及下大货订单时样品费是否可以退还。」

**Delay chaser**

English: "Our PO [123] has a ship date of [2027-03-15]. Please confirm today the real ship date and how many pcs are finished and packed."

中文：「我们的订单[123]约定出货日期为[2027年3月15日]。请今天确认实际出货日期，以及目前已完成并包装好的数量。」

**Defect claim**

English: "Inspection on [date] found [14] major defects in [200] samples, over the agreed limit of [10]. Photos attached. Please confirm by [date] how you will sort or rework the goods. Re-inspection is at your cost, as agreed in PO [123]."

中文：「[日期]的验货在[200]个抽样中发现[14]个主要缺陷，超过约定的[10]个上限。照片见附件。请在[日期]前确认您将如何挑选或返工。按照订单[123]的约定，复检费用由贵方承担。」

Write other messages (first enquiry, payment terms, PO confirmation, price-rise pushback) in the same shape: facts, one ask, a reply-by date, "this is not an order" where a price is named.

### 4. Read the reply for what it commits to

| Phrase | Literal | What it means for you |
|---|---|---|
| 可以 | Can, OK | A yes, but get the number in writing |
| 没问题 | No problem | Friendly, not a commitment until written in a PI or PO |
| 我们尽量 | We will try our best | Not a promise; ask for a date |
| 要跟老板商量一下 | Need to discuss with the boss | Price may move; wait, do not raise your offer |
| 这个价格做不了 | Cannot do this price | Ask what would change: quantity, material, packing |
| 差不多 | About the same | Not exact; ask for the number |
| 现货 | In stock | Stock goods, not made to your spec |
| 起订量 | MOQ | Ask if it is per colour or per order |
| 交期 | Lead time | Ask from deposit or from sample approval |
| 定金 / 尾款 | Deposit / balance | Check the split and when the balance is due |
| 开模费 / 模具费 | Mould fee | Ask who owns the mould, in writing |
| 打样 / 样品费 | Sampling / sample fee | Ask if refunded on bulk order |
| 大货 | Bulk production | The real order, not the sample |
| 验货 | Inspection | Confirm the standard and who pays a re-inspection |
| 贸易公司 / 源头工厂 | Trading company / source factory | Check with a video walk of the line |

Give the owner the reply translated in full, then one line: what was agreed, what was not, and the next ask.

### 5. Confirm key terms by email and keep the record

Chinese courts accept WeChat and email records, but a disputed screenshot may need checking against the original data, so keep chats on the device and confirm every agreed price, quantity, date and payment term in one short email after the chat. On Alibaba.com, keep the talk in Alibaba.com chat so the record sits with the Trade Assurance order.

### 6. Log every message

Date, channel, contact, message type, English text, Chinese text, back-translation, owner's yes (who and when), reply summary, next step.

## Checks before you hand it over

- Each message has one ask, numbers in digits, currency, Incoterm and place.
- The back-translation matches the English on every number, date and condition.
- 含税 or 不含税 is stated wherever a price appears.
- Price messages say they are not an order.
- The owner approved the exact text before it was sent.
- Agreed terms are confirmed by email and logged.

## Output

**Message card (per message):** purpose, channel, English, 中文, back-translation, tone note, what a likely reply means, owner's yes.

**Reply read-out:** full translation, what is agreed, what is not, next ask.

**Message log (`supplier-messages.csv`):**

| Date | Supplier | Channel | Type | English | Chinese | Back-translation | Approved by | Reply summary | Next step |
|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Machine-translating long English.** Step 1 writes short sentences first.
- **Trusting the translation.** Step 2 back-translates without looking.
- **Taking 没问题 as a contract.** Step 4 asks for it in writing.
- **Comparing a 含税 price with an export price.** Step 1 asks which it is.
- **Leaving terms in chat only.** Step 5 confirms them by email.

## Sources

- COG-0003: let factories know you hold other quotes.
- COG-0005: exact numbers, never vague words.
- COG-6265: Alibaba.com protection only on platform-paid orders.
- Harris Sliwoski, Only the Chinese Language Matters in Your China Contract: https://harris-sliwoski.com/chinalawblog/silly-rabbit-only-the-chinese-language-matters-in-your-china-contract/
- China Justice Observer, WhatsApp/WeChat Messages as Evidence to Chinese Courts: https://www.chinajusticeobserver.com/a/whatsapp-wechat-messages-as-evidence-to-chinese-courts
- Value-Added Tax Law of the People's Republic of China (LexisNexis China, English): https://www.lexiscn.com/law/law-english-1-5601651-T.html
- Accio Work Help Center: https://www.accio.com/wow/doc-help-center.html
- Alibaba.com Trade Assurance, Payment: https://tradeassurance.alibaba.com/ta/Payment.htm

What makes this skill ours: every message carries one ask with numbers that survive translation; a separate back-translation catches drift before sending; the reply guide says what each common phrase really commits to; and every agreed term is confirmed by email and logged with the owner's yes.
