---
name: license-analysis
description: Analyze open-source license compatibility, obligations, and compliance risks across project dependencies. Use when the user requests license analysis or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# License Analysis

Analyze open-source license compatibility and obligations across a project's dependency tree. This skill identifies all licenses in use, checks for compatibility conflicts, flags copyleft infection risks, and generates a compliance report with actionable recommendations. It covers permissive licenses (MIT, BSD, Apache-2.0), weak copyleft (LGPL, MPL), strong copyleft (GPL, AGPL), and proprietary/mixed licensing scenarios.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

> Added by AI Blocks: you can only read the files the person pasted. If a lock file is missing, mark every package you cannot see as unverified. Do not guess a license from a package name.

1. **Scan Dependencies** — Parse the project's dependency manifest (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, etc.) and resolve the full transitive dependency tree. Identify every direct and indirect dependency, including optional, dev, and peer dependencies. Note any dependencies without declared licenses or with SPDX expressions indicating dual licensing.

2. **Identify Licenses** — For each dependency, extract the license from the SPDX identifier in the package metadata, the LICENSE file in the package, or the license field in the manifest. Normalize license names to SPDX identifiers. Flag packages with no license (all rights reserved by default), custom/proprietary licenses, or ambiguous multi-license declarations that require choice.

3. **Check Compatibility Matrix** — Evaluate pairwise license compatibility based on the project's intended distribution model (SaaS, distributed binary, open-source library, internal tool). Permissive licenses (MIT, BSD, ISC) are broadly compatible. Apache-2.0 has a patent grant that conflicts with GPLv2 (but not GPLv3). Copyleft licenses (GPL, AGPL) impose distribution obligations that may conflict with proprietary licensing of the combined work. AGPL triggers obligations even for network use.

4. **Flag Copyleft Risks** — Identify any dependency licensed under GPL, AGPL, LGPL, or MPL and evaluate whether the usage pattern (static linking, dynamic linking, separate process, network interaction) triggers copyleft obligations. A GPL library statically linked into a proprietary application requires the entire application to be GPL-licensed. LGPL allows dynamic linking without copyleft infection. AGPL extends copyleft to network interactions.

5. **Generate Compliance Report** — Produce a structured report containing: license inventory table, compatibility analysis, risk flags with severity, required attributions and notices, and specific recommendations for resolving any conflicts. Include a bill of materials suitable for inclusion in project documentation or legal review.

## Usage

Provide your project's dependency manifest or list of dependencies along with your project's license and distribution model. Specify whether the project is distributed as source, binary, SaaS, or internal-only.

**Example prompt:**
```
Analyze the licenses in my Node.js project. Here's my package.json dependencies. The project is MIT-licensed and distributed as an npm package. Flag any compatibility issues.
```

## Examples

### Example 1: Node.js Dependency Tree Analysis

_Layout only. Every package, version, licence and risk below is a placeholder. It is not a real scan. Fill each one from the files the person pasted, and never copy placeholder text into a real report._

**Input:** A [PROJECT TYPE] distributed as [DISTRIBUTION MODEL] under [YOUR PROJECT LICENSE]. Key dependencies from package.json:

```json
{
  "dependencies": {
    "[PACKAGE 1]": "[VERSION RANGE]",
    "[PACKAGE 2]": "[VERSION RANGE]",
    "[PACKAGE 3]": "[VERSION RANGE]"
  }
}
```

**Output:**

**License Inventory**

| Package | Version | License | Category | Risk |
|---------|---------|---------|----------|------|
| [PACKAGE 1] | [VERSION] | [SPDX ID or "unverified"] | [Permissive / Weak copyleft / Strong copyleft / Unknown] | [None / Low / Medium / High] |
| [PACKAGE 2] | [VERSION] | [SPDX ID or "unverified"] | [CATEGORY] | [RISK] |
| [PACKAGE 3] | [VERSION] | [SPDX ID or "unverified"] | [CATEGORY] | [RISK] |

**Transitive Dependency Summary:** [TOTAL] packages scanned. [COUNT] MIT, [COUNT] Apache-2.0, [COUNT] BSD-2-Clause, [COUNT] ISC, [COUNT] LGPL-2.1, [COUNT] unlicensed, [COUNT] unverified.

**Risk Flags:**

- **[LICENSE] — [PACKAGE], Severity: [LEVEL]** — [How the package is used (linked, separate process, network), what the licence requires, and what to document.]

- **Unlicensed or unverified package: [PACKAGE], Severity: [LEVEL]** — No license file or SPDX identifier found in the pasted files. Without a license, no permission to use is granted. Action: check the package's own LICENSE file, pin a version that has a clear license, or find an alternative.

**Required Attributions:** Include LICENSE files or notices for all [TOTAL] packages. License-scanning tools can help generate a THIRD-PARTY-NOTICES file. Check the tool's own terms and any account or cost first.

### Example 2: Mixed License Compatibility Analysis

**Input:** A proprietary commercial desktop application (closed-source) that wants to incorporate three libraries: an MIT-licensed utility library, an Apache-2.0 data parser, and a GPL-3.0 charting library.

**Output:**

**Compatibility Matrix**

| | MIT | Apache-2.0 | GPL-3.0 | Proprietary (your project) |
|---|---|---|---|---|
| **MIT** | Compatible | Compatible | Compatible (one-way) | Compatible |
| **Apache-2.0** | Compatible | Compatible | Compatible with GPL-3.0 only | Compatible |
| **GPL-3.0** | Can use MIT code in GPL | Can use Apache in GPL-3.0 | Compatible | **INCOMPATIBLE** |
| **Proprietary** | Can use MIT | Can use Apache-2.0 | **INCOMPATIBLE** | — |

*Note: Apache-2.0 and GPL-2.0 are not compatible, so this table lists Apache-2.0 with GPL-3.0 only. If a dependency is GPL-2.0-only, treat it as incompatible with Apache-2.0 code.*

**Analysis:**

> Note from AI Blocks: the conclusions in this example are illustrations of the method, not legal findings. Whether a licence reaches your whole application depends on how the code is linked and shipped. Have a qualified lawyer confirm the result for your real licences and distribution model.

- **MIT utility library → Proprietary project: COMPATIBLE.** MIT permits use in proprietary software. Obligation: include the MIT license text and copyright notice in your distribution.

- **Apache-2.0 data parser → Proprietary project: COMPATIBLE.** Apache-2.0 permits proprietary use. Obligations: include the Apache-2.0 license, NOTICE file if present, and state any modifications to Apache-licensed files. The patent grant protects you from patent claims by the Apache-2.0 contributors.

- **GPL-3.0 charting library → Proprietary project: INCOMPATIBLE.** GPL-3.0 requires that the combined work be distributed under GPL-3.0 with complete source code. This directly conflicts with proprietary/closed-source distribution. Including this library makes your entire application subject to GPL-3.0.

**Recommendations:**
1. **Replace the GPL-3.0 charting library** with an MIT or Apache-2.0 alternative. Options: Chart.js (MIT), Apache ECharts (Apache-2.0), Plotly.js (MIT).
2. **If the GPL library is essential**, evaluate whether it can be isolated into a separate process communicating via IPC or network API. The FSF's position is that this may avoid copyleft infection if the components are genuinely separate programs, though this interpretation is debated and legally untested.
3. **Consider purchasing a commercial license** — some GPL projects offer dual licensing with a proprietary option for a fee.

## Best Practices

- Scan the full transitive dependency tree, not just direct dependencies — copyleft risks often hide several levels deep in the dependency graph.
- Treat "no license" as "all rights reserved" — the absence of a license does not mean permissive; it means you have no legal permission to use, copy, or distribute.
- Distinguish between distribution models: SaaS (AGPL triggers, but GPL usually doesn't), npm package (GPL triggers for downstream users), internal tool (most copyleft obligations don't apply to internal use).
- Automate license scanning in CI/CD using tools like license-checker (free) or FOSSA, Snyk and WhiteSource (paid services that need an account) to catch new issues as dependencies are added.
- Keep a pre-approved license allowlist (e.g., MIT, BSD, Apache-2.0, ISC) and require manual review for anything outside the list.
- Document all license obligations in a THIRD-PARTY-NOTICES file shipped with your distribution.

## Safety Boundaries

- Treat the output as informational drafting or issue spotting, not legal advice.
- Identify the governing jurisdiction and relevant effective date; verify changing requirements against current primary sources.
- Do not claim that language is compliant, enforceable, or complete. Flag uncertainty and recommend qualified counsel for material decisions.
- Do not file, publish, accept, sign, or send legal terms without the user reviewing and explicitly authorizing that action.

## Edge Cases

- **Dual-licensed packages (e.g., MIT OR Apache-2.0)** — When a package offers a choice via SPDX OR expressions, you may select the most compatible license. Document which license you chose and apply only that license's obligations.
- **SSPL and Commons Clause** — MongoDB's SSPL and the Commons Clause are not OSI-approved licenses. They restrict SaaS use and commercial use respectively. Treat them as proprietary restrictions even though the source code is available.
- **License changes between versions** — A dependency may change licenses across versions (e.g., Elasticsearch moved from Apache-2.0 to SSPL in v7.11). Pin to a known-good licensed version and monitor for license changes in updates.
- **Fonts, images, and non-code assets** — Creative Commons licenses on assets have different compatibility rules than software licenses. CC-BY-SA is share-alike (similar to copyleft) and CC-BY-NC prohibits commercial use. Don't assume code license scanning covers bundled assets.
- **Snippets from Stack Overflow or AI-generated code** — Stack Overflow content is CC-BY-SA 4.0 licensed. Substantial code snippets copied verbatim carry share-alike obligations. AI-generated code may have unclear provenance. Document the source of non-original code segments.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Project secrets and package risk review](https://useaiblocks.com/skills/weekly-dependency-and-security-sweep).
- The [Offline dependency risk reviewer](https://useaiblocks.com/skills/dependency-risk-auditor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
