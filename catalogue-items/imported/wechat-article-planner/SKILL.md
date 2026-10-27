---
name: wechat-official-account-strategist
description: "Grow WeChat Official Accounts (微信公众号) with high-conversion content strategy, title formulas, article architecture, and Mini-Program integration."
category: marketing
risk: safe
source: community
source_repo: demo112/yunqu-ai-skills
source_type: community
date_added: "2026-05-13"
author: yundu-ai
tags: [wechat, chinese-market, content-strategy, marketing, 公众号, 微信]
tools: [claude, cursor, gemini]
---

# WeChat Official Account Strategist

## Overview

Expert strategist for WeChat Official Accounts (微信公众号), China's most powerful content marketing channel (the author gives a figure of 1.3 billion users, which is not checked here). Creates high-conversion article strategies with proven title formulas, reading-flow optimization, and Mini-Program integration paths.

This skill understands the unique WeChat ecosystem: closed garden distribution, Moments sharing mechanics, subscription vs. service account differences, and the critical role of the first fold (首屏) in reader retention.

## When to Use This Skill

- Use when creating articles for WeChat Official Accounts
- Use when planning WeChat content strategy or editorial calendar
- Use when optimizing article open rates and sharing rates
- Use when designing WeChat-driven sales funnels
- Use when converting readers to Mini-Program users or private traffic (私域流量)

## How to Run It

Work in this order, and ask once for anything missing:

1. Ask for the inputs: the topic, the account type (subscription or service), the target readers, the goal (sales or followers), and any real data or customer quotes to use. If the user has none, write MISSING and do not invent any.
2. Check the account type and say what it means for how often they can post. Posting limits change, so tell the user to confirm the current limits with WeChat.
3. Write 5 to 6 title options with the formulas in Step 2. Mark the one you recommend.
4. Lay out the article with the structure in Step 3, section by section.
5. Add sharing hooks and one call to action.
6. Return the result in the output template below.

### Output template

```
Account type check: <type, what it means for posting>
Title options: <5 to 6 titles, recommended one marked>
Article outline: <first fold, ramp, core, emotional peak, call to action, one or two lines each>
Sharing hooks: <1 to 3 pull quotes, 1 suggested forwarding text>
Call to action: <one low-effort next step>
Posting time tips: <suggested times in China time, labelled as a rule of thumb>
Facts the user must add: <data, quotes, sources>
```

Keep the whole plan to about one page.

## How It Works

### Step 1: Account Type Analysis

Identify the account type and its constraints:
- **Subscription Account (订阅号)**: 1 push per day, folded in subscription folder
- **Service Account (服务号)**: 4 pushes per month, appears in main chat list
- **Enterprise Account**: Internal communication and CRM

### Step 2: Title Engineering

Apply proven title formulas for WeChat:

1. **Curiosity Gap**: "为什么XXX却YYY？" (Why X but Y?)
2. **Counter-intuitive**: "一直以为XXX，原来YYY" (Always thought X, turns out Y)
3. **Social Proof**: "XXX万人都在用的..." (X million people use this; only use a number the user can prove)
4. **Urgency**: "再不看就晚了！" (Read before it's too late)
5. **Value Promise**: "看完这篇，你就懂了..." (After reading this, you'll understand)
6. **Identity**: "XXX的人，都有一共性" (People who X share this trait)

### Step 3: Article Architecture

Structure for WeChat's reading behavior:
1. **First Fold (首屏)** - Hook + value promise (visible without scrolling)
2. **Ramp (铺垫)** - Build context, establish credibility
3. **Core Content (核心)** - Deliver the promised value
4. **Emotional Peak (情感高潮)** - Create sharing motivation
5. **CTA (行动呼唤)** - Clear next step (follow, share, click Mini-Program)

### Step 4: Distribution Optimization

Optimize for WeChat's sharing mechanics:
- **Moments (朋友圈)**: Craft share-worthy pull quotes
- **Direct Share (转发)**: Provide suggested forwarding text
- **In-article search**: Place keywords for WeChat's article search index

## Examples

### Example 1: Tech Company Thought Leadership

*Layout example only. The survey of 10 directors is a made-up placeholder. In a real plan, use only research the user actually did, and never invent findings or numbers.*

```
Title: 程序员35岁危机？我和10个技术总监聊了聊，发现一个规律
Structure:
  首屏: 35岁真的会失业吗？数据说话...
  铺垫: 调研背景，10位总监的行业分布
  核心: 3个关键发现，打破刻板印象
  高潮: "真正淘汰你的不是年龄，是..."
  CTA: 关注公众号，回复"职场"获取完整报告
```

### Example 2: E-commerce Product Launch

*Layout example only. The one-month use and the third-week moment are placeholders. Use only results and experiences the user supplies. Never invent testimonials or before-and-after results.*

```
Title: 用了这款面霜一个月，同事问我是不是做了医美
Structure:
  首屏: 真实使用对比图描述
  铺垫: 皮肤困扰和选品过程
  核心: 成分分析+使用感受+效果时间线
  高潮: "最让我惊喜的是第三周..."
  CTA: 点击小程序链接，限时优惠
```

## Best Practices

- Never invent testimonials, research findings, numbers or before-and-after results. Use only facts the user provides.
- For beauty, health or money topics, avoid efficacy or medical-sounding claims the user cannot source, and have the copy checked against Chinese advertising law before posting
- Write the first fold as if it is the only thing readers will see (many stop there)
- Use short paragraphs (2-3 sentences) for mobile readability
- Include 1 image every 300-500 words to break up text
- End with a specific, low-friction CTA
- Maintain consistent voice across articles to build brand recognition
- Post at peak hours: 7-9am, 12-1pm, 8-10pm (China time). This is the author's rule of thumb. Check your own account's read data.

## Limitations

- This skill generates text strategy; actual graphic design and layout require additional tools
- WeChat algorithm updates may change optimal strategies
- Industry-specific regulations (finance, health, education) may require compliance review

## Security and Safety Notes

- This skill generates content strategy and copy. It does not access WeChat APIs or accounts.
- All content should comply with Chinese advertising law, WeChat platform rules, and industry-specific regulations.

## Common Pitfalls

- **Problem:** High open rate but low completion rate
  **Solution:** Strengthen the first fold hook and reduce article length. WeChat readers have 3-5 minute attention windows.

- **Problem:** Low sharing rate
  **Solution:** Add an emotional peak before the CTA. People share content that makes them look smart or caring, not content that sells.

## Related Skills

- `xiaohongshu-content-strategist` - For short-form visual content on Xiaohongshu
- `chinese-market-content-engineer` - For multi-platform Chinese content strategy
