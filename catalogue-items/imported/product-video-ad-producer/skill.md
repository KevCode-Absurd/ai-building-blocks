---
name: product-video-ad
description: 商品短视频广告。卖点 → 分镜脚本 → 分段生成 → 拼接加字幕成片。当用户说「做条广告」「短视频」「投流素材」「分镜脚本」「带货视频」时使用。
---

# product-video-ad — 商品短视频广告

> **English summary (added by AI Blocks).** This file is written in Chinese. Steps: (1) Ask the user for the product, the main selling points, the audience and the platform. Do not write the shots before you have them. (2) Write a shot script with the length, the picture and the caption for each shot, and let the user approve it in chat before anything is made. (3) Run a dry run, which shows each shot's plan and costs nothing. (4) Generate one clip per shot with the video model. This needs a paid video model key (fal or Replicate) and Node, and each clip costs money. Redo only a failed shot. (5) Join the clips with ffmpeg and add captions made from the shot lengths. Voice and music are added later in a video editor. Every caption must be a real, approved claim or offer. Never make up a price, a discount or a result.

从卖点到成片：写分镜 → 逐镜生成 → 拼接 → 上字幕。

和 Product photo to clip maker（main-image-video）的分工：那个是主图位的 3 秒单镜，
这个是**多镜串联的完整广告**，15–30 秒，用于投流。

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand file**, made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.
- **Product photos** (yours): clear photos of the real product, from more than one angle. Attach them.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand file.
3. This one.

**From the brand file, read:** `index.md`, `look.json`, `offers.json`, `facts.json`. Take how the product looks, the colours, fonts and photo style, and the exact words allowed on the picture: approved claims and offer terms. Leave out review quotes and research notes. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a buyer brief, your brand file, product photos. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## 一、能力边界

| 能做 | 说明 |
| --- | --- |
| 分镜脚本 | 卖点 → 镜头序列，含时长、画面、字幕 |
| 逐镜生成 | 每个镜头独立生成，失败只重跑那一个 |
| 自动拼接 | ffmpeg 串成成片，编码不一致时自动重编码 |
| 字幕 | 按分镜时长自动生成 SRT，烧录或封装 |
| 品牌一致 | `--brand` 让全片色调运镜统一 |

| 不能做 | 说明 |
| --- | --- |
| 配音配乐 | 脚本给文案，配音配乐请用剪辑软件 |
| 精确卡点 | 生成模型的时长是档位，卡音乐点请后期调 |
| 真人口播 | 用 Creator testimonial video 或 Talking product video ad（ugc-testimonial 技能不在本库中） |

---

## 二、分镜结构

15 秒带货视频的通用骨架，四段：

| 段 | 时长 | 干什么 | 画面 |
| --- | --- | --- | --- |
| 钩子 | 0–3s | 让人停下来 | 最强视觉冲击：使用场景、痛点对比、意外角度 |
| 卖点 | 3–9s | 说清为什么买 | 2–3 个特写，一个卖点一个镜头 |
| 场景 | 9–13s | 让人代入 | 真实使用场景，模特或环境 |
| 落点 | 13–15s | 给行动理由 | 商品全貌 + 价格/优惠字幕 |

**一个镜头只讲一件事。** 一个镜头塞两个卖点，两个都记不住。

---

## 三、分镜文件

> Note for English readers (added by AI Blocks): every value in brackets in the sample below is a placeholder. Fill each caption only with a real, approved claim or offer from the user. Do not run an ad with a discount or result you do not have.

```json
{
  "shots": [
    { "id": "s1", "seconds": 3, "image": "[product-photo.jpg]",
      "prompt": "Slow push-in on [PRODUCT in use], [LIGHT AND SETTING].",
      "caption": "[HOOK CAPTION, a real claim]" },
    { "id": "s2", "seconds": 3, "image": "[product-photo.jpg]",
      "prompt": "Macro pan across [KEY DETAIL], light catches the surface.",
      "caption": "[SELLING POINT 1, a real claim]" },
    { "id": "s3", "seconds": 4, "image": "[product-photo.jpg]",
      "prompt": "[PRODUCT in a real use scene], moving naturally.",
      "caption": "[USE-CASE CAPTION]" },
    { "id": "s4", "seconds": 3, "image": "[product-photo.jpg]",
      "prompt": "Product laid flat, slow top-down pull-back, clean and calm.",
      "caption": "[YOUR APPROVED OFFER OR CALL TO ACTION]" }
  ]
}
```

`caption` 会按 `seconds` 累加自动排时间轴生成 SRT，不用手对时间码。

---

## 四、工具调用

Before you run: this step needs a paid video model key (fal or Replicate), Node and, to join clips, ffmpeg. Every clip you make costs money.

```bash
export DLAZY_VIDEO_MODEL=<你账号里可用的视频模型 ID>

node scripts/video.mjs --mode storyboard --task product-video-ad \
  --board examples/board.json --outdir out/ad --subtitles --brand examples/brand.yaml

# 先看计划，不计费
node scripts/video.mjs --mode storyboard --task product-video-ad \
  --board examples/board.json --outdir out/ad --dry-run
```

产出：

```
out/ad/s1.mp4 … s4.mp4     每个镜头
out/ad/captions.srt        字幕
out/ad/concat.txt          拼接清单
out/ad/final.mp4           成片
out/ad/final-sub.mp4       带字幕成片
```

某个镜头失败不影响其他镜头——重跑那一个，再手动拼一次即可。

---

## 五、执行流程

1. **先要卖点，不要直接写分镜**。问用户：主推什么、给谁看、投哪个平台。
2. **写分镜给用户确认**。文字确认比生成完再改便宜一个数量级。
3. **`--dry-run` 看一遍**。确认每镜的 prompt 和参考图对得上。
4. **跑**。逐镜生成，失败的单独补。
5. **看成片**。不满意就改单个镜头重跑，别整条重来。

---

## 六、Prompt 写法

每镜遵循：**运镜 + 主体 + 环境 + 保真约束**

```
<Camera move>. <Subject action>. <Environment>.
Keep the product identical to the reference image.
No text overlay in the frame, no watermark. Photorealistic, cinematic.
```

**关键：`No text overlay in the frame`。** 字幕是后期加的，
让模型自己画文字必然出乱码。

---

## 七、常见问题

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 镜头之间商品不一致 | 每镜独立生成，模型各画各的 | 全部镜头传同一张商品参考图，并用 `--brand` |
| 拼接后画面跳 | 各镜编码参数不同 | 脚本会自动重编码兜底；仍跳就统一各镜的尺寸 |
| 字幕没烧进去 | ffmpeg 没带 libass | 脚本自动降级为软字幕轨，播放器可开关 |
| 没装 ffmpeg | — | 片段照常生成，用输出的 `concat.txt` 事后补拼 |
| 成片太长 | 分镜时长加起来超了 | 投流素材 15 秒最稳（作者的经验，未附来源；以你自己的数据为准） |

---

## Tips

- **前 3 秒决定一切**。钩子镜头值得多跑几版挑一条。
- **字幕写口语**。「零下十度只穿了这一件」比「优质保暖面料」有效得多。
- **竖版 9:16**。投流素材几乎都是竖版，生成时就按竖版出，别事后裁。

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Talking-product video ad writer](https://useaiblocks.com/workflows/talking-product-video-ad).
- The [Product photo video maker](https://useaiblocks.com/skills/product-photo-to-clip-maker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
