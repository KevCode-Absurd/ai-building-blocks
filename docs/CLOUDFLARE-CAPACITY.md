# Hosting capacity

Checked against official Cloudflare documentation on 2026-10-21.

- Pages Free allows 20,000 deployed files. The build uses a 19,000-file buffer by default.
- Pages paid plans allow 100,000 files; Cloudflare requires `PAGES_WRANGLER_MAJOR_VERSION=4`. Set `CF_PLAN=pages-paid` only after verifying that the Pages project has an eligible plan. The build then uses a 95,000-file buffer. Other values, including the old ambiguous `paid`, keep the conservative free limit.
- Workers Paid starts at $5 per month, with usage charges possible. Workers Static Assets is a separate deployment product with its own limits. A Workers subscription does not itself upgrade a Pages project's file capacity.
- The expanded production build currently contains 18,547 files, including the 2,230-file saved example app. It fits Pages Free without a billing change. No upgrade or purchase was made. Dynamic request/CPU needs should be evaluated from actual account usage before buying capacity.

Keep per-skill supporting files in ZIPs rather than publishing each as a separate URL. The example app is now bundled under `/example-app/` so its link works without a separate host. There are 453 files left before the conservative build buffer; watch growth before the next large import. When this build approaches the buffer, first review asset growth, then compare an eligible Pages plan with migration to Workers Static Assets.

Sources: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/).
