---
name: main-image-video
description: 静态主图转主图视频。一张商品图 → 3–5 秒可上架的主图短视频。当用户说「主图视频」「图转视频」「让图动起来」「加个视频」时使用。
---

> **Read this first (added by AI Blocks).** This file is written in Chinese. Follow the same steps and answer the user in English. The `docs/` example photos are not included. The scripts in `scripts/` need Node, ffmpeg for captions or joining, and a paid video model API key, so treat them as optional. The default route: write the video prompt, then the user gives it and their photo to a video tool they already use (for example Veo in Gemini or Kling; check each tool's price and limits first). Do not claim a clip was made unless a video tool made it. The clip step needs a paid video model API key (fal or Replicate), so run the dry run first. ffmpeg is only for captions or joining clips. The skills it names (product-video-ad, item-repair, material-enhancement, platform-compliance, batch-image) are not in this library; for photo fixes use the Product photo retoucher, and check video length, shape and file size against the store's own current rules.

# main-image-video — 主图视频

主图坑位旁边那个视频位，大多数店铺是空的。它不需要重新拍，
**一张已有的主图就能生成**。

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Product photos** (yours): clear photos of the real product, from more than one angle. Attach them.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for product photos. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## 一、能力边界

| 能做 | 说明 |
| --- | --- |
| 图生视频 | 一张商品图 → 3–5 秒运动镜头 |
| 运镜控制 | 推、拉、环绕、俯仰、微距扫过 |
| 材质动态 | 面料飘动、金属反光扫过、液体晃动 |
| 批量 | 配合 Product photo batch maker 整批出 |

| 不能做 | 说明 |
| --- | --- |
| 长视频 | 超过 8 秒请用多镜头视频广告流程分镜串联（product-video-ad 技能不在本库中） |
| 口播 | 用真人口播视频的流程（ugc-testimonial 技能不在本库中） |
| 改商品 | 视频模型会放大原图的瑕疵，先用 Product photo retoucher 修好 |

---

## 二、先配后端

视频模型 ID 因后端而异，**必须显式指定**，脚本不会替你猜：

```bash
export DLAZY_VIDEO_MODEL=<你账号里可用的视频模型 ID>
```

拼接与字幕需要 ffmpeg（本技能的单镜模式用不到，分镜才需要）。
完整说明见 [`references/video-backends.md`](references/video-backends.md)。

---

## 三、工具调用

```bash
node scripts/video.mjs --mode clip --task main-image-video \
  --image docs/flat-lay/example-output.jpg \
  --prompt 'Slow push-in on the model. The cable-knit sweater fibers catch the light softly. Subtle natural body sway. Camera stays level, no cuts.' \
  --seconds 3 \
  --save out/sku001-main.mp4

# 先看会发什么，不计费
node scripts/video.mjs --mode clip --task main-image-video --image x.jpg \
  --prompt '...' --dry-run
```

**参数约定**

| 参数 | 取值 | 理由 |
| --- | --- | --- |
| `--image` | 一张主图 | 竖版 3:4 或方图，分辨率越高越好 |
| `--seconds` | `3` ~ `5` | 主图位视频普遍偏短，超过 5 秒完播率掉得快 |
| `--brand` | `brand.yaml` | 让运镜与色调跟全店一致 |

---

## 四、Prompt 模板

**结构：运镜 + 主体动态 + 环境动态 + 约束**

```
<Camera move>. <What the product does>. <What the environment does>.
Keep the product identical to the reference image — same shape, color, texture, logo placement.
No cuts, no text overlay, no watermark. Photorealistic.
```

**运镜词表**

| 目标 | 英文 |
| --- | --- |
| 缓推 | `slow push-in` |
| 缓拉 | `slow pull-back reveal` |
| 环绕 | `smooth 30-degree orbit around the product` |
| 俯冲 | `gentle top-down tilt` |
| 微距扫过 | `macro pan across the surface texture` |

**材质动态词表**

| 品类 | 英文 |
| --- | --- |
| 针织 / 毛呢 | `fibers catch the light, fabric breathes subtly` |
| 真丝 / 雪纺 | `fabric ripples in a gentle draft` |
| 金属 / 珠宝 | `specular highlight sweeps across the metal` |
| 玻璃 / 液体 | `liquid settles, light refracts through the glass` |
| 皮革 | `soft sheen shifts across the grain` |

---

## 五、执行流程

1. **先检查静态图**。视频模型会放大原图的一切瑕疵。原图有崩就先修，别指望视频救。
2. **确认后端**。`DLAZY_VIDEO_MODEL` 没设就先问用户用哪个模型。
3. **单张试跑**。视频比图贵得多，先跑一条 3 秒的看运镜对不对。
4. **确认后再批量**。
5. **过一遍平台规格**。视频也有规格要求（时长、比例、体积），
   本库的平台检查只校验静态图，视频请人工对照平台文档。

---

## 六、常见问题

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 商品在动的过程中变形 | 运动幅度给太大 | 换成 `slow` / `subtle` 系的词，缩短时长 |
| 画面糊 | 原图分辨率不够 | 先换一张更清晰的原图（material-enhancement 技能不在本库中） |
| 模特脸在动的时候崩 | 人脸是视频模型的重灾区 | 改用不露脸的景别，或改成商品特写 |
| 时长对不上 | 多数模型的时长是档位不是连续值 | 按模型支持的档位取，别硬凑 |
| 报错说没指定模型 | `DLAZY_VIDEO_MODEL` 没设 | 见「先配后端」 |

---

## Tips

- **3 秒够用**。主图位视频不是广告片，讲清楚一个卖点就行。
- **别加文字**。主图视频的文字规则和主图一样严，字幕留给多镜头视频广告流程。
- **首帧就是封面**。用商品最好看的角度做输入图，因为它大概率是静止时显示的那一帧。

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Make product photos** with the [Product photo retoucher](https://useaiblocks.com/skills/product-photo-retoucher).
- The [Marketplace photo rule checker](https://useaiblocks.com/skills/marketplace-photo-rule-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
