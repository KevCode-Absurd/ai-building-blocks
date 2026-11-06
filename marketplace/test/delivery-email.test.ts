// sendEmail (Cloudflare Email Sending through the EMAIL binding) and the line-diff helper.
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Env } from "../src/env.ts";
import { notify, parseAddress, sendEmail, textToHtml } from "../src/core/email.ts";
import { applyLineDiff, diffStats, editsRecord, lineDiff, summarizeDiff } from "../src/modules/delivery/diff.ts";
import { testEnv } from "./helpers.ts";

const baseEnv = { APP_ORIGIN: "https://agents.test", EMAIL_FROM: "AI Blocks <agents@useaiblocks.com>" } as unknown as Env;

test("sendEmail returns false when there is no EMAIL binding", async () => {
  assert.equal(await sendEmail(baseEnv, "buyer@example.com", "Hi", "Text"), false);
});

test("sendEmail sends a plain-text and HTML message from the configured sender", async () => {
  const sent: any[] = [];
  const env = { ...baseEnv, EMAIL: { async send(m: unknown) { sent.push(m); return { messageId: "abc" }; } } } as Env;
  assert.equal(await sendEmail(env, "Buyer@Example.com", "Your draft\r\nis ready", "Read it here.\n\nhttps://agents.test/jobs/job_1"), true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "buyer@example.com");
  assert.deepEqual(sent[0].from, { name: "AI Blocks", email: "agents@useaiblocks.com" });
  assert.equal(sent[0].subject, "Your draft is ready");
  assert.equal(sent[0].text, "Read it here.\n\nhttps://agents.test/jobs/job_1");
  assert.match(sent[0].html, /<a href="https:\/\/agents.test\/jobs\/job_1">/);
});

test("sendEmail throws with the Cloudflare error code, and notify records the failure", async () => {
  const env = { ...baseEnv, EMAIL: { async send() { throw Object.assign(new Error("sender domain not verified"), { code: "E_SENDER_NOT_VERIFIED" }); } } } as Env;
  await assert.rejects(sendEmail(env, "buyer@example.com", "Hi", "Text"), /E_SENDER_NOT_VERIFIED: sender domain not verified/);
  await assert.rejects(sendEmail(env, "not an address", "Hi", "Text"), /not valid/);
  const t = await testEnv({ EMAIL: env.EMAIL });
  await notify(t.env, { toEmail: "ops@example.com", kind: "test", subject: "Hi", text: "Text" });
  const [n] = await t.sql("SELECT status, error FROM notifications");
  assert.equal(n.status, "failed");
  assert.match(n.error, /E_SENDER_NOT_VERIFIED/);
});

test("parseAddress and textToHtml", () => {
  assert.deepEqual(parseAddress("AI Blocks <agents@useaiblocks.com>"), { name: "AI Blocks", email: "agents@useaiblocks.com" });
  assert.deepEqual(parseAddress("agents@useaiblocks.com"), { name: "", email: "agents@useaiblocks.com" });
  assert.equal(parseAddress("evil@x.com\r\nBcc: a@b.com"), null);
  assert.equal(parseAddress("nope"), null);
  assert.equal(textToHtml("a <b> & c").includes("a &lt;b&gt; &amp; c"), true);
});

test("lineDiff round-trips and counts changes", () => {
  const a = "one\ntwo\nthree\nfour\nfive";
  const b = "one\n2\nthree\nfive\nsix";
  const ops = lineDiff(a, b);
  assert.equal(applyLineDiff(a, ops), b);
  assert.deepEqual(diffStats(ops), { added: 2, removed: 2 });
  assert.match(summarizeDiff(ops), /- two\n\+ 2\n- four\n\+ six/);
  for (const [x, y] of [["", "new"], ["old", ""], ["same\ntext", "same\ntext"], ["a\nb\nc", "c\nb\na"], ["x\r\ny", "x\ny\nz"]]) {
    assert.equal(applyLineDiff(x, lineDiff(x, y)), y.replace(/\r\n/g, "\n"), `${x} -> ${y}`);
  }
  assert.equal(editsRecord("drf_1", "same", "same"), null);
  assert.equal(editsRecord("drf_1", "same", undefined), null);
  assert.equal(editsRecord("drf_1", "a", "b")!.added, 1);
  assert.throws(() => applyLineDiff("other text", ops), /diff_does_not_apply/);
});

test("lineDiff finds the smallest change on random texts", () => {
  let seed = 7;
  const rand = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
  const lcs = (a: string[], b: string[]) => {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    return dp[0][0];
  };
  for (let round = 0; round < 300; round++) {
    const a = Array.from({ length: rand(12) }, () => "abcd"[rand(4)]);
    const b = Array.from({ length: rand(12) }, () => "abcd"[rand(4)]);
    const ops = lineDiff(a.join("\n"), b.join("\n"));
    assert.equal(applyLineDiff(a.join("\n"), ops), b.join("\n"));
    const { added, removed } = diffStats(ops);
    const A = a.join("\n").split("\n"), B = b.join("\n").split("\n");
    assert.equal(added + removed, A.length + B.length - 2 * lcs(A, B), `${a} -> ${b}`);
  }
});

test("lineDiff stays fast on long drafts", () => {
  const a = Array.from({ length: 3000 }, (_, i) => `Line ${i} of the draft.`).join("\n");
  const b = a.replace("Line 10 of", "Line ten of").replace("Line 2990 of", "Changed 2990 of");
  const started = Date.now();
  const ops = lineDiff(a, b);
  assert.ok(Date.now() - started < 2000);
  assert.equal(applyLineDiff(a, ops), b);
  assert.deepEqual(diffStats(ops), { added: 2, removed: 2 });
});
