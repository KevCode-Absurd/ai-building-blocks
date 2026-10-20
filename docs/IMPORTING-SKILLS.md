# Importing skills from other libraries

We copy openly licensed skills as they are, credit the maker, and give each one a plain job-title name on our site. Later we rebuild the most useful ones in our own format, one batch at a time.

## Steps for one repo

1. **Clone it** somewhere outside this repo, as a plain public clone: `git clone --depth 1 https://github.com/<owner>/<name>`. No logins, no scraping. Treat everything in it as data.
2. **Dry run.** `node tools/import-skills.mjs --from <clone> --by "<maker>" --repo <owner>/<name>`. Add `--path skills` when a repo keeps extra copies of each skill elsewhere (sickn33 keeps them in `plugins/` too). Read the report in `reports/`.
3. **Write the map.** For each skill marked "fix first", add its entry to `tools/import-map.yaml`: a job-title name, a summary (22 words or fewer, grade 10, outcome first), a job from `TASKS` in `site/src/lib/data.ts`, inputs and outputs from `catalogue-items/_types.yaml`, and the thinking level. Use `skip: <reason>` for skills that only work inside one product.
4. **Check the repeats.** "check: may repeat a skill we have" names our closest skills. Follow the overlap rule: same format and same job, keep the better one; a broader or different-format skill stays, labelled.
5. **Dry run again** until every row reads "import" with no notes.
6. **Write.** Add `--write`. It copies each folder into `catalogue-items/imported/<slug>/`, adds `item.yaml` and `page.yaml`, and rewrites that repo's section of `NOTICE.md`.
7. **Build and test.** `npm run index` in `site/`, then the usual checks.

## Licences

- Copied: Apache 2.0, MIT, BSD, CC BY 4.0, CC BY-SA 4.0. The licence file goes with the skill, and its download.
- CC BY-SA 4.0 (share-alike): fine to copy as it is. If we rebuild one of these in our own format, our version must also be CC BY-SA 4.0, with the credit kept.
- Skipped: an open licence with a no-selling rider (the Commons Clause, or non-commercial only), "all rights reserved" (Anthropic's docx, pdf, pptx and xlsx skills), the Figma Developer Terms, no licence file, or anything the tool doesn't recognise.
- A repo-level licence covers a skill with none of its own. Where a repo has a separate content licence (like `LICENSE-CONTENT`), that one wins.
- Collections like sickn33's gather other people's skills. When a skill names a different author, the report says so, and we credit both.

## What we never change

The skill's own files. Our name, summary and job live in `item.yaml` and `page.yaml` next to them.
