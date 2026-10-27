---
name: platform-compliance
description: 上架前平台合规校验与自动修复。待上架图 → Amazon / TikTok Shop / Temu / Shopee / 淘宝 各平台的通过或驳回风险报告，可一键修成合规图。当用户说「会不会被驳回」「合规检查」「白底不达标」「主图规格」「传上去被拒」时使用。
---

**Working in a chat (added by AI Blocks).** This file is in Chinese. Read it and reply in English. It links to other skills (detect-task, flat-lay, batch-image, remove-watermark, item-repair and run_loop) that are not in this folder, so skip those steps. The platform limits in the table are a snapshot, copied when AI Blocks imported this skill on 20 Oct 2026, and not re-checked since. A pass or reject here can be wrong for today's store rules. Tell the user to confirm each limit in the store's own seller image guide (search the store's seller help for "product image requirements") before they rely on it, and say so in the report.

## English summary (added for this catalogue)

In short, the Chinese sections below say this:

1. Confirm the platform (Amazon, TikTok Shop, Temu, Shopee, Shopify or Taobao). Ask if the user has not said.
2. Run the check first, without `--fix`: `python3 scripts/check_listing.py <photo> --platform <platform>` (needs Python and `pip install Pillow`). Read the problems out to the user.
3. Sort the problems. Size, white background, how much the product fills the frame and file weight can be fixed with `--fix <folder>`, which saves new copies and leaves the originals alone. Text, watermarks and damaged products cannot be fixed here: they go back to a photo editor or the image tool.
4. After a fix, the script checks the new file again. Report that result.
5. The limits in section 2 are a snapshot from 20 Oct 2026. Tell the user to confirm each one in the store's own seller image guide.

Sections: 1 is what it can and cannot do, 2 is the rule table, 3 is the commands, 4 is the step order, 5 is prompt lines that avoid problems when you make the image, 6 is troubleshooting.

Other skills named in this file (detect-task, flat-lay, batch-image, remove-watermark, item-repair, run_loop) are not included here. Skip any step that needs them.

---

# platform-compliance — 上架前合规校验

图片好不好看是一回事，**平台收不收**是另一回事。

这个技能只回答后者：这张图传上去会不会被驳回，卡在哪一条，怎么改。

和 detect-task（本目录未包含 / not included） 的分工：
detect-task 用视觉模型判断「像不像真的」，主观、要花算力；
本技能读像素做客观判定，不花算力、毫秒级、结论可复现。**两个都过才叫能投。**

---

## 生成效果示例

*(English: this section shows output from the original author's own test photo. The file names such as docs/flat-lay/example-output.jpg are not in this folder, and the numbers are the author's, not a result for your photo. Use your own photo path.)*

拿本仓库 flat-lay（本目录未包含 / not included） 的实际产出图，按 Amazon 主图规则检：

```bash
python3 scripts/check_listing.py docs/flat-lay/example-output.jpg --platform amazon
```

**真实输出**

```
docs/flat-lay/example-output.jpg  ·  Amazon 主图  ·  有驳回风险
  1024×1536 JPEG 0.25MB · 背景 RGB(208, 208, 208) · 主体占比 100.0%

  ! 分辨率              最长边 1536px，达标但不足以触发放大镜
  ✓ 画面比例             1024:1536
  ✗ 纯白背景             边缘仅 0.0% 为纯白，背景基色约 RGB(208, 208, 208)
  ✓ 主体占比             包围盒占画面 100.0%
  ✓ 透明通道             无 alpha
  ✓ 边框               无描边
  ✓ 文件格式             JPEG
  ✓ 文件体积             0.25 MB
  ✓ 色彩模式             RGB
  ? 文字 / 水印 / 拼图     像素层判不了，交给 detect-task 或人工过一眼
```

这张图肉眼看是「浅灰棚拍背景」，很干净，但 **Amazon 主图要求精确 RGB(255,255,255)**，
208 的灰会被判不合格。这类问题人眼几乎发现不了，机检一秒钟出结论。

一键修：

```bash
python3 scripts/check_listing.py docs/to-3d/example-output.jpg --platform amazon --fix out/
```

```
out/example-output-fixed.jpg  ·  Amazon 主图  ·  通过
  1600×1402 JPEG 0.50MB · 背景 RGB(255, 255, 255) · 主体占比 85.1%
```

压白底 → 按 85% 目标重构画布 → 补到 1600px → 存合规 JPEG，一步到位。

---

## 一、能力边界

| 能做 | 说明 |
| --- | --- |
| 客观规格判定 | 背景纯度、主体占比、分辨率、比例、透明通道、描边、格式、体积、色彩模式 |
| 多平台规则 | Amazon / TikTok Shop / Temu / Shopee / Shopify / 淘宝，可自定义 |
| 自动修复 | 压白底、按目标占比重构画布、补分辨率、压到体积上限 |
| 批量 | 一次传多张，或配合 batch-image（本目录未包含 / not included） 整批过 |
| 退出码 | 0 = 可投；1 = 有驳回风险，便于接进 CI 或流水线 |

| 不能做 | 去哪 |
| --- | --- |
| 判断有没有文字 / 水印 / 拼图 | detect-task（本目录未包含 / not included） 的视觉模型 |
| 判断商品有没有崩 | detect-task（本目录未包含 / not included） |
| 去水印 | remove-watermark（本目录未包含 / not included） |
| 修图、去褶皱 | item-repair（本目录未包含 / not included） |

**自动修复的边界**：`--fix` 只做几何与色彩层面的合规化，它不会替你修图。
如果原图本身是糊的、崩的、带水印的，修完还是糊的崩的带水印的。

---

## 二、平台规则

| 平台 | 纯白底 | 最长边（下限 / 建议） | 主体占比 | 比例 | 体积上限 | 最后核对 |
| --- | --- | --- | --- | --- | --- | --- |
| `amazon` | 是 | 1000 / 1600 | ≥ 85% | 不限 | 10 MB | 2026-10-20（复制，未再核对） |
| `tiktok-shop` | 否 | 800 / 1600 | ≥ 60% | 1:1 或 3:4 | 5 MB | 2026-10-20（复制，未再核对） |
| `temu` | 是 | 800 / 1350 | ≥ 70% | 1:1 | 3 MB | 2026-10-20（复制，未再核对） |
| `shopee` | 否 | 500 / 1024 | ≥ 55% | 1:1 | 2 MB | 2026-10-20（复制，未再核对） |
| `shopify` | 否 | 1024 / 2048 | 不限 | 不限 | 20 MB | 2026-10-20（复制，未再核对） |
| `taobao` | 是 | 800 / 1200 | ≥ 70% | 1:1 | 3 MB | 2026-10-20（复制，未再核对） |

*(English: the last column says each row was copied on 20 Oct 2026 and not re-checked since. The table is a snapshot. Before you trust a pass, confirm every limit in that store's own seller image guide.)*

**平台规则会变。** 上表是可机检的子集，以各平台最新官方文档为准。
需要改用自己的口径，写一份 JSON 用 `--rules` 传入，字段说明见
[`references/platform-specs.md`](references/platform-specs.md)。

---

## 三、工具调用

```bash
# 单张
python3 scripts/check_listing.py main.jpg --platform amazon

# 整批 + 机器可读
python3 scripts/check_listing.py out/*.jpg --platform temu --json

# 校验并自动修复到 fixed/
python3 scripts/check_listing.py raw.png --platform amazon --fix fixed/

# 自定义规则
python3 scripts/check_listing.py main.jpg --platform amazon --rules my-rules.json
```

只依赖 Pillow：

```bash
pip install Pillow
```

**参数约定**

| 参数 | 取值 | 理由 |
| --- | --- | --- |
| `--platform` | 目标平台 | 决定用哪套阈值，默认 `amazon` |
| `--json` | 接流水线时加 | 输出结构化结果，含每项的实测值与阈值 |
| `--fix <dir>` | 想自动改时加 | 产物另存，不覆盖原图 |
| 退出码 | `0` / `1` | 有驳回风险时非零，方便 `&&` 串联 |

---

## 四、执行流程

*(English, the core steps: 1. Confirm the platform. 2. Run `check_listing.py` without `--fix` and read the problems to the user. 3. Fix size, white background, frame fill and file weight with `--fix <folder>`. Send text, watermark and damage problems back to a photo editor. 4. Read the automatic re-check of the fixed copy. 5. Tell the user to confirm the limits in the store's own seller guide before upload.)*

1. **确认平台**。用户没说就问，或按店铺主战场默认（跨境 → `amazon`，国内 → `taobao`）。
2. **先检后修**。直接跑一次不带 `--fix` 的校验，把问题念给用户听——
   有些问题（比如主体占比不够）修复会裁掉画面，得让用户先知道。
3. **区分两类问题**：
   - 几何 / 色彩类（白底、占比、分辨率、体积）→ `--fix` 能解决。
   - 内容类（水印、文字、商品崩坏）→ 回到对应的生成或修图技能重做。
4. **修完复检**。`--fix` 后脚本会自动对产物再检一遍，确认真的过了。
5. **接回生成侧**。反复不合规时，把约束写进 prompt 而不是每次事后修：
   见下方「把合规前置到生成」。

---

## 五、把合规前置到生成

事后修不如一次生对。这几句追加到生成 prompt 末尾，能显著降低不合格率：

| 目标 | 追加句 |
| --- | --- |
| 纯白背景 | `Pure seamless white background, RGB 255,255,255, no gradient, no vignette, no shadow cast on the backdrop.` |
| 主体占比 | `The product fills at least 88% of the frame, tight crop, minimal empty margin on all sides.` |
| 无文字水印 | `No text, no logo, no watermark, no inset images, no borders anywhere in the frame.` |
| 方图 | `Square 1:1 composition, product centered.` |

*(English: the original skill run_loop did this automatically. It is not included here. Do it by hand: if a check fails, add the matching line above to your image prompt and generate again, then re-check.)*

---

## 六、常见问题

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 肉眼纯白，机检说不是 | 棚拍浅灰墙（RGB 200–245）或轻微渐变 | `--fix` 压白，或生成时按上表加约束句 |
| 主体占比总不够 | 生成时留白太多 | prompt 里写 `tight crop`；或 `--fix` 重构画布 |
| PNG 传上去变黑底 | 透明通道被平台转成黑色 | 永远压平为白底 JPEG，`--fix` 会自动做 |
| 修完占比还是差一点 | 方图平台下，长条商品的占比有物理上限 | 脚本已取可达上限；接受它，或改用非方图平台的坑位 |
| 文字水印项永远是 `?` | 像素层测不了 | 交给 detect-task，或人工过一眼 |

---

## Tips

- **把它接进 CI**：`check_listing.py out/*.jpg --platform amazon` 退出码非零就拦下，
  比人工抽检可靠。
- **先检一张再跑整批**：整批生成前拿一张过一遍合规，能省掉一整批的返工。
- **不同坑位不同规则**：主图严、细节图松。别拿主图的阈值去卡详情页配图。
