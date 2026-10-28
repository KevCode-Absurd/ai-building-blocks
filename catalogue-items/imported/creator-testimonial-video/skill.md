---
name: ugc-testimonial
description: UGC 口播种草视频。商品 + 人设 → 口播脚本与成片，达人自拍质感。当用户说「口播视频」「种草视频」「达人风格」「UGC」「真人推荐」时使用。
---

# ugc-testimonial — UGC 口播种草

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Brand brain** (its products part), made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `voice-and-look.md`, `offers.md`, `proof-and-claims.md`. Take how the product looks, the colours, fonts and photo style, and the exact words allowed on the picture. Leave out review quotes and research notes. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for your brand brain. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## English summary (added by AI Blocks)

The instructions below are in Chinese. This summary is in English.

**What it does.** You give a product and a persona. It writes a 15-second spoken script and a shot list, then shows how to make handheld, creator-style clips with your own video model.

**Rules, read first.**
- These videos are acted demos. Never present them as a real buyer's review, never use a customer's or a public figure's face, and label the video as AI-made wherever the platform asks.
- Every product claim in the script must be true for your product and checked by you. The Chinese sample lines in this file are placeholders only, such as 「[你核实过的具体说法]」 ("a claim you have checked"). Replace them with your own checked facts.
- Only use a face image of a person who gave written consent. If you have none, leave the face out and use hand and product shots.

**When not to use.** Do not use this for health, medical, financial or other regulated products, or any claim that needs proof. Have your compliance reviewer write and approve the claims, and use a real, consented buyer video instead.

**Requirements.** To make video you need an AI that can run code, Node.js, and a paid video-model key from fal or Replicate (the original skill is set up for the dLazy service). Each clip costs money, so set a spending limit in your fal or Replicate account first. The `--dry-run` step is free: it only prints what would be sent. The paths assets/model/face-a.jpg and docs/flat-lay/... are examples, so point them at your own files. The brand-kit skill the original links to is not included here. The command reads the shot list in examples/ugc-board.json. Its image fields (examples/face.jpg and examples/shot-detail.jpg) are not included: change each one to the path of your own file, and use a face image only if the person gave written consent. The --brand option and model.reference setting are optional. If you skip them, the clips will not share one face.

**Steps.**
1. Decide the persona: who is speaking, in what setting, and why a viewer would trust them.
2. Write the script and check it with the user. The words matter more than the picture.
3. Lock one face: use the same reference image in every talking shot (or leave the face out).
4. Run `--dry-run`, read the plan and the cost, then run it for real.
5. Join the clips, add captions, and add a voiceover, because lip sync is weak.
6. Next, have a person check the captions and every claim, and check the platform's ad policy and AI-label rule before you publish.

投流素材里转化最好的一类往往不是精致广告，而是**看起来像真人随手拍的推荐**。

这个技能生成那种质感：手持、家里的光、说人话。

---

## 一、能力边界

| 能做 | 说明 |
| --- | --- |
| 口播脚本 | 商品 + 人设 → 一段能照着念的话 |
| 分镜 | 口播镜头 + 商品特写的交替结构 |
| UGC 质感 | 手持轻晃、室内自然光、非专业构图 |
| 多人设 | 同一商品换人设出多版做 A/B |

| 不能做 | 说明 |
| --- | --- |
| 对口型 | 生成模型做不好唇形同步，成片建议配旁白而不是同期声 |
| 冒充真人 | 不要声称是真实买家评价，见下方「合规」 |

---

## 二、合规先说

UGC 风格 ≠ 伪造评价。生成的内容**不能声称是真实买家的真实使用体验**。

| 可以 | 不可以 |
| --- | --- |
| AI 生成的演示型口播 | 冒充具名真实买家的评价 |
| 「我来演示一下这件怎么搭」的场景演绎（只说可核实的产品事实） | 伪造好评截图、伪造买家秀、「我穿了一周」这类冒充真实使用经历的台词 |
| 按平台要求标注 AI 生成 | 隐瞒 AI 生成身份（部分平台强制标注） |

各平台对 AI 生成内容的标注要求不同，投放前确认目标平台的规则。

---

## 三、人设与脚本

**人设三要素**：谁、什么场景、为什么可信。

| 人设 | 开场白范式 |
| --- | --- |
| 通勤白领 | 「每天挤地铁，我需要一件不用打理的……」 |
| 学生党 | 「预算两百，我对比了五家……」 |
| 宝妈 | 「带娃根本没时间收拾自己，所以……」 |
| 健身人群 | 「练完一身汗，这件……」 |

**脚本骨架（15 秒）**

```
0-3s   钩子：说一个具体的痛点，不说商品
3-8s   转折：为什么这个能解决 —— 给一个可验证的细节
8-12s  展示：镜头切到商品特写
12-15s 落点：给一个行动理由，语气随意
```

**写口播的三条铁律**

1. **说具体的**。「特别暖和」无效，「[你核实过的具体细节]」有效。（方括号内是占位符，必须换成你核实过的事实。）
2. **留犹豫**。真人说话有停顿和自我修正，全是完美长句就假了。
3. **不念参数**。参数放字幕，嘴里说感受。

---

## 四、工具调用

```bash
export DLAZY_VIDEO_MODEL=<你账号里可用的视频模型 ID>

node scripts/video.mjs --mode storyboard --task ugc-testimonial \
  --board examples/ugc-board.json --outdir out/ugc --subtitles
```

分镜里交替口播镜头与商品镜头：

```json
{
  "shots": [
    { "id": "talk1", "seconds": 4, "image": "assets/model/face-a.jpg",
      "prompt": "Handheld selfie-style shot, young woman talking to camera in a bright apartment, slight natural camera shake, warm window light, casual home background. She is wearing the olive cable-knit sweater.",
      "caption": "[你核实过的具体说法]" },
    { "id": "detail1", "seconds": 3, "image": "docs/flat-lay/garment-flatlay.jpg",
      "prompt": "Handheld close-up of the sweater texture, phone-camera look, natural indoor light.",
      "caption": "[你核实过的具体说法]" },
    { "id": "talk2", "seconds": 4, "image": "assets/model/face-a.jpg",
      "prompt": "Handheld selfie-style shot, same woman, she pulls the collar up and smiles, same apartment.",
      "caption": "[你核实过的具体说法]" }
  ]
}
```

**关键 prompt 词**：`handheld`、`selfie-style`、`slight natural camera shake`、
`phone-camera look`、`natural indoor light`、`casual` —— 这些制造「不专业」的质感。
不要写 `cinematic`、`professional lighting`、`studio`，那会把 UGC 感抹掉。

---

## 五、执行流程

1. **先定人设**。问用户卖给谁，人设跟着买家画像走。
2. **写脚本给用户确认**。口播文案比画面更决定转化。
3. **锁脸**。多个口播镜头必须是同一个人，用同一张参考图（`model.reference`，原技能在 brand-kit 里，此处未包含，请自备经书面同意的人像）。
4. **`--dry-run` 过一遍**，再真跑。
5. **配旁白**。生成的视频不做唇形同步，成片后用剪辑软件配一条旁白，比同期声自然。

---

## 六、常见问题

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 看起来还是像广告 | prompt 里有 `cinematic` / `professional` | 换成 handheld / phone-camera look |
| 几个镜头不是同一个人 | 没锁脸 | 用 `--brand` 带 `model.reference` |
| 嘴型对不上 | 模型不做唇形同步 | 别用同期声，配旁白；或改用不露脸的手持镜头 |
| 表情僵硬 | 人脸是视频模型弱项 | 缩短口播镜头，多用商品特写切换 |

---

## Tips

- **口播镜头短、商品镜头长**。人脸生成越久越容易崩，3–4 秒一切。
- **同一脚本换人设出三版**做 A/B，投流看数据说话。
- **字幕必须有**。大部分人静音刷视频。

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Video ad on-screen text planner](https://useaiblocks.com/skills/video-ad-text-overlays). It takes the script and video ads.
- The [Selfie-style video clip prompt writer](https://useaiblocks.com/skills/selfie-style-video-prompts). It takes the script.
- The [Spoken video ad opening writer](https://useaiblocks.com/skills/spoken-video-ad-opening-writer). It takes the video ads.
- **Check it before it goes live** with the [Sound-off commercial checker](https://useaiblocks.com/skills/sound-off-commercial-checker). It takes the script.
- The [Meta ad policy checker](https://useaiblocks.com/skills/meta-ads-compliance-checker). It takes the script.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
