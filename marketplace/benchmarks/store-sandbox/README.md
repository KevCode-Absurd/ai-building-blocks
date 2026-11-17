# Private store sandbox

A functioning local storefront and deterministic commerce/messaging backend for agent completion benchmarks. This is **our store sandbox**, not Shopify, Klaviyo, a payment gateway, or evidence of live-provider verification. No external account writes, messages, payments, tracking pixels or fulfillment occur.

Node 24 builtins only. No installation or credentials required for the server/domain tests. Chrome UI tests use an existing Playwright package; they do not install browsers. Generic code and the synthetic fixture are repository-safe. Keep all real-brand configuration, media, provenance, screenshots and runtime state outside the repository.

## Run

From the repository root:

```powershell
node marketplace/benchmarks/store-sandbox/server.mjs --state ../implementation-evidence/store-demo/state --port 4318
```

For a private brand adapter, supply JSON matching `fixture.json` and selected asset files:

```powershell
node marketplace/benchmarks/store-sandbox/server.mjs --state ../implementation-evidence/private-store/state --seed ../implementation-evidence/private-store/seed.json --assets ../implementation-evidence/private-store/assets --port 4318
```

Open `http://127.0.0.1:4318/`. Use the exact IP origin, not `localhost`. Routes: `#home`, `#collection`, `#product/<product-id>`, `#cart`, `#checkout`, `#orders`, `#order/<order-id>`, `#lab`.

The browser creates its own dataset and synthetic customer/cart, retaining their IDs in `localStorage['private-store-session']`. New browser contexts create fresh datasets. The test console's **Create a fresh isolated dataset** preserves the previous dataset for audit. Do not delete or reset another benchmark's state. API agents should create a new dataset for every independent trial and save its ID in their private evidence.

Stop with Ctrl+C. The state directory has a single-writer `server.lock`. A second process cannot use it. After an unclean process termination, confirm its recorded PID is no longer running before removing that one stale lock file. Do not remove live locks. Restart the server against the same directory for order/inventory readback. Dataset files are individually persisted by synchronous atomic replacement before successful responses.

## HTTP contract

Base: `http://127.0.0.1:4318`. Every mutation requires `Content-Type: application/json`. Monetary amounts are integer **minor units** (INR paise), quantities are positive integers. Dataset IDs scope every resource. `Idempotency-Key` is required for reservation, payment, cancellation and refund requests; optional for other mutations. Keys are dataset-wide, 1–120 ASCII letters/digits/colon/underscore/hyphen. Repeating a key and identical operation/payload returns its original result; conflicting reuse returns 409. Retain the original key when retrying a request after uncertain transport failure.

| Method | Endpoint | Body / result |
| --- | --- | --- |
| GET | `/api/ready` | Local provider, readiness, simulation boundaries |
| POST | `/api/datasets` | `{}` → `{id,provider,simulated}` |
| GET | `/api/datasets/:ds/catalog` | Brand, products, variants, synthetic prices/current available stock |
| POST | `/api/datasets/:ds/customers` | `{email:"buyer@example.test",sms:"+15550100001",consent:{email:true,sms:false}}` |
| PATCH | `/api/datasets/:ds/customers/:id` | Any of `{consent:{email:boolean,sms:boolean},unsubscribed:{email:boolean,sms:boolean},openSupport:boolean}` |
| POST | `/api/datasets/:ds/carts` | `{customerId}` |
| PATCH | `/api/datasets/:ds/carts/:id` | `{items:[{variantId,quantity}]}`; empty array removes all items |
| POST | `/api/datasets/:ds/reservations` | `{cartId}` → held reservation with immutable items/total and 15-minute expiry; requires key |
| POST | `/api/datasets/:ds/payments` | `{reservationId,outcome:"approved"|"declined"}` → `{payment,order}`; requires key |
| POST | `/api/datasets/:ds/reservations/:id/cancel` | `{}`; releases held stock, requires key |
| POST | `/api/datasets/:ds/orders/:id/cancel` | `{}`; full simulated refund and restock, requires key |
| POST | `/api/datasets/:ds/orders/:id/refund` | `{}`; full simulated refund and restock, requires key |
| GET | `/api/datasets/:ds/orders/:id/receipt` | Independently generated receipt from persisted order state |
| GET | `/api/datasets/:ds/state` | Full dataset export: orders, inventory, customers, carts, holds, payments, refunds, events, outbox, flows, audit, keys |
| GET | `/api/datasets/:ds/{customers,carts,reservations,orders,events}` | Collection objects keyed by ID; append `/:id` for individual record |
| GET | `/api/datasets/:ds/{outbox,payments,refunds,audit}` | Arrays of server records |
| GET | `/api/datasets/:ds/flows` | Current configuration |
| PATCH | `/api/datasets/:ds/flows/:type` | `{enabled,channels:["email","sms"],delayMs,recentBuyerDays}`; fields optional |
| POST | `/api/datasets/:ds/flows/run` | `{}` → process due messages using current exclusions; explicit local test worker |
| POST | `/api/datasets/:ds/clock/advance` | `{ms:3600000}` → advance only this dataset's clock |
| POST | `/api/datasets/:ds/events` | `{id,type,customerId,referenceId}` → idempotent validated lifecycle event |

Example sequence: create dataset → customer → cart → set cart items → reserve → payment → GET receipt → GET state. Use **fresh keys** for distinct operations. Available variant IDs come from catalog, never guessed live SKUs. Products retain source-observed identities only when supplied in a private adapter; all synthetic variant IDs/stock/prices are explicitly marked.

Inventory is decremented atomically at reservation. Overlapping holds cannot oversell. Held carts cannot be edited. Approval commits the hold and converts the cart. Decline or expiry releases stock. A converted cart cannot be checked out again. Full cancellation/refund restores stock once even with distinct subsequent retry keys. There is no partial-refund, shipping, real tax or fulfillment model. Holds are expired lazily on the next dataset read/mutation; the test clock control can trigger expiry deterministically.

## Lifecycle messages

Supported types are `welcome`, `cart_abandoned`, `post_purchase`. Defaults: welcome immediately, abandoned cart after one hour, post-purchase after one day; both channels configured. Events are automatically enrolled on customer creation, cart updates and successful payment. An explicit event must refer to the matching customer/cart/order; welcome reference is the customer ID. Replaying events or submitting aliases for the same lifecycle trigger does not enqueue duplicate messages. Cart versions distinguish edits even within the same millisecond.

The explicit `flows/run` endpoint is the local worker. It never contacts a transport. Outbox statuses are `pending`, `recorded`, `suppressed`; **recorded is not delivered**. Each record has `transport:"local-only"` and `externalDelivery:false`. It contains synthetic destination/content only when recording is permitted. No external links appear in messages; `unsubscribePath` identifies the PATCH customer endpoint to set the relevant `unsubscribed` field to true.

Each channel requires explicit consent and a synthetic destination. Consent defaults false. Unsubscribed channels and open support cases suppress all messages. Welcome and abandoned-cart flows exclude recent buyers (default seven days). Post-purchase intentionally includes the qualifying buyer, but suppresses a cancelled/refunded order; its recent-buyer exclusion is inapplicable. Abandoned-cart messages also suppress converted/empty/superseded carts. Disabling a flow/channel suppresses pending messages at processing time. Settings affect new enrollment delays; already scheduled due times remain unchanged. Consent and exclusions are rechecked at processing time. Suppressed/recorded messages remain terminal; changing consent later does not replay them.

## Isolation and boundaries

Only loopback `127.0.0.1` is bound. Exact Host checks, cross-origin/cross-site rejection, JSON-only mutations and no CORS protect against browser drive-by requests. CSP permits only local scripts/styles/images/fonts/connects and forbids framing or remote forms. Only the three UI files and selected asset basenames explicitly referenced in seed are served. Source captures, seed, filesystem paths, private brand files and financial exports are not static routes. Full dataset exports intentionally contain **synthetic** test data only. Customer creation accepts `@example.test` emails and `+1555010XXXX` numbers and ignores real-name/address/card fields.

This is a trusted-local-process benchmark tool, not an internet-facing authenticated multitenant service. Anyone with local machine access and a dataset ID can operate that dataset. Never tunnel/deploy it, bind a public interface, or introduce actual customer/payment data. Test clock, configuration and dataset controls are explicit sandbox APIs; there is no generic filesystem write, dataset deletion, shell execution or live-provider adapter.

## Verification

```powershell
node --test marketplace/benchmarks/store-sandbox/store.test.mjs
node marketplace/benchmarks/store-sandbox/ui-test.mjs --playwright ../benchmark-runtime/node_modules/playwright --output ../implementation-evidence/store-demo/ui-evidence
```

For a private brand UI test, append `--seed <private-seed.json> --assets <private-assets-directory>`. Output/state/screenshots stay at the explicit output path. Each UI test starts its own ephemeral loopback server/dataset and closes its Chrome/server afterward. It preserves its state directory for inspection; it does not modify a shared benchmark server. Chrome runs with `chromiumSandbox:true`, a temporary profile, and no `--no-sandbox`. Environments that deny local networking/browser startup need an approved specific script invocation, not relaxed Chrome security.

Backend tests cover concurrency/oversell, atomic rollback, idempotency conflicts, declines, expiration, refunds/cancellation and restart persistence, consent/channel suppression, duplicate events, flow delays, recent buyers, cart changes, returned orders, dataset isolation, synthetic-contact validation, single-writer locks, exact Host, cross-origin rejection, asset isolation and independent receipts. Browser tests cover actual desktop/mobile rendering, image loads, unavailable variants, add-to-cart, declined/approved checkout, receipt readback, refund/restock and local outbox. No live-provider success should be inferred from passing these tests.
