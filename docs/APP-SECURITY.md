# App security

The Workers router and all three Pages API adapters enforce `src/server/api-security.ts` before accessing D1, reading the catalogue for composition, or calling a provider. These controls require a deployment; changing local configuration does not change a live Worker.

## Turnstile

The browser requests public configuration from `GET /api/security`. A fresh managed widget appears for AI composition, commenting and creating a space. Its token travels in `x-turnstile-token`, never a URL. The server calls Cloudflare Siteverify and requires successful verification, the exact request hostname and the correct action:

| Request | Action |
| --- | --- |
| `POST /api/compose` | `compose` |
| `POST /api/comments` | `comment` |
| `POST /api/spaces` | `create_space` |

Cloudflare rejects expired and reused tokens. Missing configuration, dummy sitekeys, verification outages and malformed replies fail closed. Team comments use the same verification. Existing owner-authorized space changes still require the owner key and are subject to write throttling, without another challenge for every edit. Free assembly and static browsing need no widget.

Set a real `TURNSTILE_SITE_KEY` variable and a matching `TURNSTILE_SECRET_KEY` Worker secret separately for production and staging. The secret must never enter frontend code, logs, screenshots or source control. The widget hostname list and `API_ALLOWED_HOSTS` must match the intended environment. Browser-side `required:false` is accepted only on loopback; the emulator additionally requires `SECURITY_LOCAL=true`, which is never set in a deployed configuration.

## API throttling

| Binding | Approximate requests per IP per 60 seconds |
| --- | ---: |
| `API_READ_LIMITER` | 120 |
| `API_WRITE_LIMITER` | 30 |
| `AI_LIMITER` | 3 additional checks for composition POSTs |

Read and write buckets are shared across API paths, so changing a query or endpoint does not reset the bucket. Only Cloudflare's `CF-Connecting-IP` is used; client identity headers are ignored. Denials return HTTP 429, `Retry-After: 60` and `Cache-Control: no-store`. Missing or failing bindings return HTTP 503. Foreign browser origins are rejected on writes.

Cloudflare's native rate-limit bindings are approximate and local to each Cloudflare location. They do not replace the existing atomic D1 daily AI allowance, per-IP attempt count, output limits or duplicate-request reservations. IP limits can affect shared networks. These checks run inside the Worker, so denied requests can still incur Worker request charges.

The production zone also has an active included WAF rate-limit rule, **AI Blocks API flood protection**, configured on 22 October 2026. It matches `(starts_with(http.request.uri.path, "/api/") or http.request.uri.path eq "/api")`, counts by IP, and blocks for 10 seconds when traffic exceeds 60 requests in 10 seconds. This outer protection runs before the Worker. It uses the domain's included rule slot; no plan upgrade was purchased and no existing rule was replaced. Static pages and download paths are outside this expression. The zone rule does not cover the separate staging `workers.dev` hostname, which has the private gate and native API bindings.

Production and staging use distinct limiter namespaces. Do not reuse namespaces for unrelated apps.

## Domain routing

The deployment owner attaches `useaiblocks.com` and `www.useaiblocks.com` as Worker Custom Domains only after the staging checks pass. Cloudflare manages their DNS records and certificates. The included Single Redirect rule **AI Blocks www to primary domain** matches only `www.useaiblocks.com`, returns 301 to `https://useaiblocks.com` plus the original path, and preserves the query string. It was explicitly approved and activated on 22 October 2026; it takes effect when the hostname is connected. The five Clerk DNS-only CNAMEs remain separate.

Google Workspace Business Base is configured for `hello@useaiblocks.com`. Google confirmed domain ownership, Gmail activation and SPF/DKIM setup on 22 October 2026. The root MX points to `smtp.google.com` with priority 1; root SPF authorizes `_spf.google.com`; Google's DKIM selector is `google._domainkey`. The five Clerk DNS-only records remain separate. DMARC at `_dmarc` starts with `p=none`, relaxed alignment and aggregate reports to the business mailbox. This monitors authentication and does not yet request quarantine or rejection. Review real Google and Clerk sender alignment before gradually enforcing the policy. Email MX/TXT and Clerk verification records stay DNS-only.

## Private staging and disabled previews

Production has `workers_dev:false` and `preview_urls:false`, and runs application code before assets only on API paths. API hostname checks reject alternate hosts even if accidentally exposed.

Staging retains only its named `workers.dev` hostname, disables version previews, sets `PREVIEW_PROTECTED=true`, and uses `assets.run_worker_first:true`. Every application route, including static files and downloads, requires the `x-preview-access` header matching the strong `PREVIEW_ACCESS_TOKEN` Worker secret or the short-lived browser session described below. Missing or invalid preview credentials deny access before assets and databases; preview access never bypasses Turnstile.

For a normal browser, the private staging Worker also serves `GET /__preview/login`. Submit the existing preview credential through its password form to obtain a 15-minute `__Host-ai_preview` cookie. The cookie contains a random nonce and signed, host-bound timestamps; it does not contain the preview credential. It is `Secure`, `HttpOnly`, `SameSite=Strict` and host-only. Login requires an exact same-origin POST, a trusted Cloudflare IP, the existing write limiter and a bounded form body. The login page forbids scripts and framing, withholds cross-origin referrers and is never cached. Its `Referrer-Policy: same-origin` preserves the browser's native form `Origin` header; `no-referrer` would turn it into `null` and break the exact-origin check. Null and foreign origins remain rejected. Query parameters are rejected. `POST /__preview/logout` clears the cookie. These routes and cookie authorization require the private flag and one exact allowed `workers.dev` hostname, and are disabled for production. The login and logout pages are the only public staging exceptions; all application data still requires a valid header or session cookie. Session access still requires fresh Turnstile tokens for protected writes.

The deployment owner keeps the staging credential in the ignored `site/.wrangler/staging-secrets.json`. Test tools load it in process memory. Inject the header only for requests to the verified staging origin. **Never use a browser-wide extra header:** that would also send it to Turnstile and other third parties. Disable Playwright traces, videos and HAR capture when testing private staging, and keep owner/share fixture keys in ignored local files. Never put preview credentials into URLs or screenshots.

The staging browser login is for brief owner verification. For ongoing team access, configure an identity-aware gateway such as Cloudflare Access rather than distributing the staging secret.

## Verification

- `npm run test:unit` includes API security and router checks: direct calls, verification failures and hostname/action mismatch, rate-limit denial/outage, private asset/API access, cross-origin writes and local-only bypass boundaries.
- `npx playwright test e2e/api-security.spec.ts e2e/turnstile-cleanup.spec.ts --config playwright.stable.config.ts --workers 2` runs nine local UI cases with a synthetic widget: fresh tokens, retry, cancel, comments, space creation, outages, free assembly, mobile layout and recovery when SDK cleanup throws. It makes no paid model calls and does not validate the real Cloudflare widget. Widget cleanup is best effort; its failure cannot prevent the verification promise from resolving or rejecting.
- Live staging checks must separately confirm denied unauthenticated access, valid preview access, real widget-created comment/space persistence, and a bounded no-token rate-limit probe. Keep AI disabled for these checks. If Cloudflare presents an interactive CAPTCHA, the user must complete it.

References: [Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [rate-limit binding behavior](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [workers.dev configuration](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).
