---
name: listing-optimizer
description: 主图 A/B 组与转化复盘。商品图 + 卖点 → 多组对照主图 + 每组的差异假设 + 复盘模板。当用户说「A/B 测试」「主图优化」「提点击率」「哪版更好」「换个版本试试」时使用。
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

## English summary (added for this catalogue)

The rest of this file is in Chinese. Follow it as written. In short:

1. Ask which number the user wants to improve: clicks or sales. They often pull in opposite directions.
2. Pick one thing to test per round: background, shot distance, with or without a model, text on the image, model look, or colour tone. If the user wants to change three, queue three rounds.
3. Write a hypothesis for each version before any image is made, and have the user confirm it.
4. Make a control (A) and a test (B) with two prompts that differ in one place only. Make 3 images per version and pick the best one.
5. Check every image against the marketplace's main image rules, so a rejected image does not spoil the test. Run the bundled check, `python3 scripts/check_listing.py <your images> --platform <marketplace>` (needs Python and the Pillow library). It reads image size, background and other things a program can measure. Its rules are a snapshot, so also read the marketplace's own main image help page before you upload.
6. Give the user a results sheet to fill in with impressions, clicks and sales. This skill does not connect to a store and cannot say who won. Do not call a winner on low traffic. Wait about two weeks.
7. What to do with the result: keep the winning image as the new control, queue the next single-variable round (one thing changed again), and ask the user to record each finished test (variable, winner, the numbers they saw, the date) in one place they can find later, such as a spreadsheet or their brand file. If the test was too close to call, run it longer or pick a stronger variable. Do not claim a result the user's own numbers do not show.

How to follow the steps without reading Chinese: all six steps are above. The commands in section 3 and the sheet in section 4 are the only parts you need to run or copy. Their English notes sit above each one in italics. Describe everything to the user in English.

Needs before you start: the image commands call a paid image API (OpenAI, Gemini, fal or Replicate), so an API key is needed and each image may cost money. They also need Node and Python. The user must supply: a product photo (the commands call it `docs/flat-lay/garment-flatlay.jpg`), a pose reference photo for clothing (optional), and a brand file (`examples/brand.yaml` is the bundled sample; the user can edit it or leave it out). Every path and product detail in the commands, such as the olive sweater and SKU A001, is a placeholder to replace with the user's own product. The linked platform-compliance and brand-kit skills are not part of this item, so skip the brand-kit step (the last tip). Use `scripts/check_listing.py` for the automatic check.

How to read the Chinese sections: section 1 says what the skill can and cannot do. Section 2 lists the variables you can test. Section 3 holds the image commands. Section 4 is the review sheet. Section 5 is the step order (the six steps above). Section 6 is a troubleshooting table. Write your replies to the user in English.

---

# listing-optimizer — 主图 A/B 与复盘

其他技能交付的是**图**，这个技能交付的是**一次可复盘的实验**。

区别在于：随便多生成几张不叫 A/B。A/B 要求每组之间**只有一个变量不同**，
并且事先写下你预期哪组会赢、为什么。否则跑完也不知道是什么在起作用。

---

## 一、能力边界

*(English: what the skill can do, in a table: one-variable test sets, a written hypothesis per version, a compliance check on each image, and a review sheet. What it cannot do: read your store data, or judge whether a result is statistically sound.)*

| 能做 | 说明 |
| --- | --- |
| 单变量对照组 | 一次只改一个维度，其余保持一致 |
| 假设记录 | 每组附「预期效果 + 理由」，跑完能复盘 |
| 合规校验 | 每张自动过 `scripts/check_listing.py`（本目录自带），避免因驳回污染数据。注意：原文提到的 platform-compliance 技能不在本目录里 |
| 复盘模板 | 产出可填数据的对照表 |

| 不能做 | 说明 |
| --- | --- |
| 接平台数据 | 不连后台，点击率转化率要你自己填回来 |
| 判断统计显著性 | 样本量不够时别下结论，见「常见问题」 |

---

## 二、可测的变量

*(English: the variables you can test, one per round: background, shot distance, with or without a model, text on the image, the model, colour tone. Do not change three at once.)*

一次实验只动一个：

| 变量 | A（对照） | B（实验） | 假设 |
| --- | --- | --- | --- |
| 背景 | 纯白 | 生活场景 | 场景图代入感强，点击率更高 |
| 景别 | 全身 | 半身特写 | 小屏上特写更清楚 |
| 有无模特 | 平铺图 | 模特上身 | 服装类上身图更有说服力 |
| 文案 | 无文字 | 左上角卖点标 | 文字提升信息密度（注意平台是否允许） |
| 模特 | 亚洲面孔 | 欧美面孔 | 跟目标市场匹配 |
| 色调 | 冷白 | 暖调 | 暖调在家居类更讨喜 |

**别一次改三个。** 三个变量一起动，赢了也不知道是哪个赢的。

---

## 三、工具调用

*(English: the image commands. Replace the placeholders before you run them: the olive cable-knit sweater is a sample product, and `docs/flat-lay/garment-flatlay.jpg` and `docs/flat-lay/pose-reference.jpg` are sample file names. Use your own product and files. Each command makes 3 images through a paid image API, so run one command and check what it cost before you run more.)*

生成对照组 —— 两条命令只差一处 prompt：

```bash
# A 组：纯白背景（对照）
node scripts/gen.mjs --task listing-optimizer --brand examples/brand.yaml \
  --prompt 'E-commerce main image of the olive cable-knit sweater on a model. Pure seamless white background, RGB 255,255,255. Full body, product fills 88% of the frame. No text, no watermark.' \
  --images docs/flat-lay/garment-flatlay.jpg docs/flat-lay/pose-reference.jpg \
  --batch 3 --save out/ab/A-white.jpg

# B 组：生活场景（只改这一处）
node scripts/gen.mjs --task listing-optimizer --brand examples/brand.yaml \
  --prompt 'E-commerce main image of the olive cable-knit sweater on a model. Warm minimal apartment interior, soft window light. Full body, product fills 88% of the frame. No text, no watermark.' \
  --images docs/flat-lay/garment-flatlay.jpg docs/flat-lay/pose-reference.jpg \
  --batch 3 --save out/ab/B-lifestyle.jpg
```

每组出 `--batch 3` 挑一张最好的，避免拿单次生成的运气当结论。

合规校验（被驳回的图会污染实验数据）：

```bash
python3 scripts/check_listing.py out/ab/*.jpg --platform amazon
```

---

## 四、复盘模板

*(English: the review sheet. Fill in the SKU, platform, dates and variable. Write the hypothesis before the test runs. Leave the view, click and sales columns blank until the test ends. The SKU A001 and the dates below are examples, so replace them with yours.)*

生成时就把这张表建好，投放后填数据：

```markdown
## 实验：主图背景 白底 vs 生活场景
- SKU：A001 军绿麻花针织衫
- 平台 / 坑位：Amazon 主图
- 起止：2026-09-01 ~ 2026-09-14
- 变量：背景（其余保持一致：同模特、同景别、同色调、无文字）

| 组 | 图 | 假设 | 曝光 | 点击 | 点击率 | 加购 | 转化率 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A 对照 | A-white.jpg | 白底信息干净，符合平台预期 | | | | | |
| B 实验 | B-lifestyle.jpg | 场景图代入感强，点击率更高 | | | | | |

**结论**：
**下一步**：
```

**「假设」必须在跑之前写。** 事后编理由是复盘最常见的自欺。

---

## 五、执行流程

*(English: the six steps in order. They match the English summary at the top.)*

1. **问清楚要优化什么指标**。点击率和转化率的优化方向经常相反——
   猎奇主图能提点击率，但会拉低转化率并推高退货。
2. **选一个变量**。用户想改三样时，告诉他排队做三轮。
3. **写假设**，让用户确认。
4. **生成 + 合规校验**。
5. **给出复盘模板**，明确说清数据要用户自己填回来。
6. **样本量不够别下结论**。见下。

---

## 六、常见问题

*(English: a troubleshooting table. Two versions look too alike: pick a stronger variable. B seems to win but traffic is low: wait for more views, and be careful when the gap is under 10 percent. Clicks went up but sales fell: the image promises too much. More than one thing differs: compare the two prompts and keep only one difference.)*

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 两组差异很小 | 变量选得太弱（比如只调了一点色温） | 换更有区分度的变量 |
| 数据看着 B 赢但不确定 | 曝光量太小 | 每组至少几千次曝光再看；差异小于 10% 时更要谨慎 |
| 点击率涨了转化率掉了 | 主图过度承诺 | 主图要准确，别为点击率牺牲一致性 |
| 组间不止一个变量不同 | prompt 改动没控制住 | 两条 prompt diff 一遍，确认只差一处 |

---

## Tips

- **一次一个变量，一轮两周**。急着一周出结论通常是自欺。
- **先测大变量**。有没有模特、白底还是场景，这类差异远大于色温微调。
- **赢的那版存进 你自己的品牌文件（原文提到的 brand-kit 技能不在本目录里）**，让它成为之后的默认，实验成果才会沉淀。

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Make product photos** with the [Marketplace photo rule checker](https://useaiblocks.com/skills/marketplace-photo-rule-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
