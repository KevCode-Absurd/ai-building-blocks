// Narrow, repeatable setup for the existing AI Blocks Clerk production instance.
// Credentials stay in memory. Conflicting records stop the operation before writes.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
const account = "31c814d2c58a11163d3187f505f0b9c5";
const zone = "7cecfe8f7b9dae26dfa20e121b4dd43d";
const records = [
  ["clerk.useaiblocks.com", "frontend-api.clerk.services"],
  ["accounts.useaiblocks.com", "accounts.clerk.services"],
  ["clkmail.useaiblocks.com", "mail.ma76vgd9y5er.clerk.services"],
  ["clk._domainkey.useaiblocks.com", "dkim1.ma76vgd9y5er.clerk.services"],
  ["clk2._domainkey.useaiblocks.com", "dkim2.ma76vgd9y5er.clerk.services"],
];
assert(process.argv.length === 2 || process.argv.length === 3 && process.argv[2] === "--apply", "Use no arguments to inspect, or --apply to add missing records.");
const apply = process.argv[2] === "--apply";
const credential = await fs.readFile(path.join(process.env.APPDATA, "xdg.config/.wrangler/config/default.toml"), "utf8");
const token = credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
assert(token, "Wrangler authentication is unavailable.");
async function api(route, method = "GET", body) {
  const response = await fetch("https://api.cloudflare.com/client/v4" + route, {
    method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000),
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw Error(JSON.stringify({ status: response.status, errors: data.errors?.map(({ code, message }) => ({ code, message })) }));
  return data.result;
}
const zoneInfo = await api(`/zones/${zone}`);
assert.equal(zoneInfo.name, "useaiblocks.com"); assert.equal(zoneInfo.account.id, account);
assert.equal(zoneInfo.status, "active");
const plan = [];
for (const [name, content] of records) {
  const existing = await api(`/zones/${zone}/dns_records?name=${encodeURIComponent(name)}`);
  assert(existing.length <= 1, `Multiple records exist at ${name}; review manually.`);
  if (existing.length) {
    assert.equal(existing[0].type, "CNAME", `Conflicting record type at ${name}; unchanged.`);
    assert.equal(existing[0].content.replace(/\.$/, ""), content, `Conflicting target at ${name}; unchanged.`);
  }
  plan.push({ type: "CNAME", name, content, proxied: false, ttl: 1,
    action: !existing.length ? "create" : existing[0].proxied ? "disable-proxy" : "preserve", id: existing[0]?.id ?? null });
}
for (const record of plan) if (apply && record.action !== "preserve") {
  const { type, name, content, proxied, ttl } = record;
  const result = await api(`/zones/${zone}/dns_records${record.id ? "/" + record.id : ""}`, record.id ? "PATCH" : "POST", { type, name, content, proxied, ttl });
  assert.equal(result.name, name); assert.equal(result.content, content); assert.equal(result.proxied, false);
}
if (apply) for (const { name, content } of plan) {
  const check = await api(`/zones/${zone}/dns_records?name=${encodeURIComponent(name)}`);
  assert.equal(check.length, 1); assert.equal(check[0].type, "CNAME");
  assert.equal(check[0].content.replace(/\.$/, ""), content); assert.equal(check[0].proxied, false);
}
const report = { checkedOn: new Date().toISOString(), application: "app_3L2Q3RkQnbjquiEQz5YhiWV8Orz", productionInstance: "ins_3L2TdCKd8bXEAZMvttmcS3nVDbj", zone: zoneInfo.name, applied: apply, verified: apply, records: plan };
await fs.writeFile(`reports/clerk-dns-${apply ? "applied" : "plan"}.json`, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
