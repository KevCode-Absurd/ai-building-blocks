// Live model providers: selection, fallback, avoidProvider, structured output, cost maths and logging.
// Every provider call goes through a mocked global fetch; nothing leaves the machine.
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import type { Env } from "../src/env.ts";
import { callModel, callProvider, LIVE_MODELS, ModelError, modelCandidates, usageCostMicroUsd, type ModelRequest } from "../src/core/models.ts";
import { testEnv } from "./helpers.ts";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

interface Call { url: string; headers: Record<string, string>; body: any }

/** Replace fetch with a script: each handler answers one call, in order. */
function mockFetch(...handlers: ((call: Call) => Response | Promise<Response>)[]): Call[] {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    const call: Call = { url: String(url), headers: (init?.headers ?? {}) as Record<string, string>, body: JSON.parse(String(init?.body ?? "{}")) };
    calls.push(call);
    const handler = handlers[calls.length - 1];
    if (!handler) throw new Error(`unexpected fetch #${calls.length} to ${call.url}`);
    return handler(call);
  }) as typeof fetch;
  return calls;
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const anthropicOk = (text: string, usage = { input_tokens: 1000, output_tokens: 500 }) => () => json({ model: "claude-sonnet-5-5", content: [{ type: "thinking", thinking: "" }, { type: "text", text }], stop_reason: "end_turn", usage });
const openaiOk = (text: string, usage = { input_tokens: 1000, output_tokens: 500 }) => () => json({
  model: "gpt-6.1-sol", status: "completed", usage,
  output: [
    { type: "message", role: "assistant", phase: "commentary", content: [{ type: "output_text", text: "thinking out loud" }] },
    { type: "message", role: "assistant", phase: "final_answer", content: [{ type: "output_text", text }] },
  ],
});
const geminiOk = (text: string) => () => json({ modelVersion: "gemini-3.1-pro-preview", candidates: [{ finishReason: "STOP", content: { parts: [{ text: "hmm", thought: true }, { text }] } }], usageMetadata: { promptTokenCount: 1000, candidatesTokenCount: 400, thoughtsTokenCount: 100 } });

const ALL_KEYS = { ANTHROPIC_API_KEY: "sk-ant-test", OPENAI_API_KEY: "sk-openai-test", GEMINI_API_KEY: "gem-test" };
const envWith = (keys: Partial<Env>) => ({ MODEL_MODE: "live", ...keys } as unknown as Env);
const req = (over: Partial<ModelRequest> = {}): ModelRequest => ({ purpose: "test.write", tier: "standard", system: "You write.", prompt: "Write a line.", ...over });

test("cost maths: micro-USD from usage and the price table", () => {
  const sonnet = LIVE_MODELS["claude-sonnet-5-5"];
  assert.equal(usageCostMicroUsd(sonnet, { input: 1000, output: 500, cached: 0, cacheWrite: 0 }), 7000); // 1000 x $2/M + 500 x $10/M
  assert.equal(usageCostMicroUsd(sonnet, { input: 0, output: 0, cached: 1000, cacheWrite: 1000 }), 100 + 2500); // cache read $0.10/M, write 1.25 x $2/M
  const haiku = LIVE_MODELS["claude-haiku-5-5"];
  assert.equal(usageCostMicroUsd(haiku, { input: 50_000, output: 1000, cached: 0, cacheWrite: 0 }), 5500);
  assert.equal(usageCostMicroUsd(haiku, { input: 120_000, output: 1000, cached: 0, cacheWrite: 0 }), (12_000 + 500) * 5); // long prompts cost 5x
  assert.equal(usageCostMicroUsd(LIVE_MODELS["gpt-6-astra"], { input: 3, output: 1, cached: 0, cacheWrite: 0 }), 80);
});

test("tier map: Anthropic first, GPT and Gemini fallbacks; judges prefer another family", () => {
  const env = envWith(ALL_KEYS);
  assert.deepEqual(modelCandidates(env, "small").map(m => m.id), ["claude-haiku-5-5", "gpt-6-luna", "gemini-3.5-flash-lite"]);
  assert.deepEqual(modelCandidates(env, "standard").map(m => m.id), ["claude-sonnet-5-5", "gpt-6.1-sol", "gemini-3.1-pro-preview"]);
  assert.deepEqual(modelCandidates(env, "premium").map(m => m.id), ["claude-opus-5-5", "gpt-6-astra", "gemini-3.1-pro-preview"]);
  assert.equal(modelCandidates(env, "judge")[0].provider, "openai");
  assert.deepEqual(modelCandidates(env, "judge", "openai").map(m => m.provider), ["gemini", "anthropic"]);
  assert.ok(modelCandidates(env, "judge", "anthropic").every(m => m.provider !== "anthropic"));
  assert.deepEqual(modelCandidates(envWith({ GEMINI_API_KEY: "g", OPENAI_API_KEY: " " }), "standard").map(m => m.id), ["gemini-3.1-pro-preview"]);
});

test("Anthropic call: headers, effort, no sampling settings, text only from text blocks, cost", async () => {
  const calls = mockFetch(anthropicOk("Hello there."));
  const res = await callProvider(envWith(ALL_KEYS), req({ temperature: 0.2, maxTokens: 1000 }));
  assert.equal(res.text, "Hello there.");
  assert.equal(res.provider, "anthropic");
  assert.equal(res.model, "claude-sonnet-5-5");
  assert.equal(res.inputTokens, 1000);
  assert.equal(res.outputTokens, 500);
  assert.equal(res.costMicroUsd, 7000);
  const c = calls[0];
  assert.equal(c.url, "https://api.anthropic.com/v1/messages");
  assert.equal(c.headers["x-api-key"], "sk-ant-test");
  assert.equal(c.headers["anthropic-version"], "2023-06-01");
  assert.equal(c.body.model, "claude-sonnet-5-5");
  assert.equal(c.body.system, "You write.");
  assert.deepEqual(c.body.messages, [{ role: "user", content: "Write a line." }]);
  assert.equal(c.body.output_config.effort, "medium");
  assert.ok(c.body.max_tokens > 1000, "reasoning headroom on top of the caller's budget");
  assert.equal(c.body.temperature, undefined);
});

test("skips providers without a key and uses the OpenAI Responses API final answer", async () => {
  const calls = mockFetch(openaiOk("Final text.", { input_tokens: 1000, output_tokens: 200, input_tokens_details: { cached_tokens: 400 } } as any));
  const res = await callProvider(envWith({ OPENAI_API_KEY: "sk-openai-test" }), req());
  assert.equal(res.text, "Final text.");
  assert.equal(res.provider, "openai");
  assert.equal(calls[0].url, "https://api.openai.com/v1/responses");
  assert.equal(calls[0].headers.authorization, "Bearer sk-openai-test");
  assert.equal(calls[0].body.instructions, "You write.");
  assert.equal(calls[0].body.store, false);
  assert.equal(calls[0].body.text, undefined);
  assert.equal(res.costMicroUsd, 600 * 2 + 400 * 0.1 + 200 * 10);
});

test("falls back on 429, 5xx and timeouts, and keeps going down the list", async () => {
  const timeout = () => { throw new DOMException("The operation timed out.", "TimeoutError"); };
  const calls = mockFetch(() => json({ error: { message: "slow down" } }, 429), timeout, geminiOk("From Gemini."));
  const res = await callProvider(envWith(ALL_KEYS), req());
  assert.equal(res.text, "From Gemini.");
  assert.equal(res.provider, "gemini");
  assert.equal(res.outputTokens, 500, "thinking tokens count as output");
  assert.deepEqual(calls.map(c => new URL(c.url).hostname), ["api.anthropic.com", "api.openai.com", "generativelanguage.googleapis.com"]);
  assert.equal(calls[2].headers["x-goog-api-key"], "gem-test");

  const again = mockFetch(() => json({}, 529), openaiOk("After overload."));
  const res2 = await callProvider(envWith({ ANTHROPIC_API_KEY: "a", OPENAI_API_KEY: "o" }), req());
  assert.equal(res2.text, "After overload.");
  assert.equal(again.length, 2);

  mockFetch(() => { throw new TypeError("fetch failed"); }, openaiOk("After a network error."));
  const res3 = await callProvider(envWith({ ANTHROPIC_API_KEY: "a", OPENAI_API_KEY: "o" }), req());
  assert.equal(res3.text, "After a network error.");
});

test("a bad request stops without fallback, and errors never echo provider bodies", async () => {
  const secret = "SECRET-PROMPT-TEXT sk-ant-leaked";
  mockFetch(() => new Response(JSON.stringify({ error: { message: secret } }), { status: 400 }));
  await assert.rejects(callProvider(envWith(ALL_KEYS), req()), (err: unknown) => {
    assert.ok(err instanceof ModelError);
    assert.equal(err.code, "provider_rejected");
    assert.ok(!err.message.includes("SECRET") && !err.message.includes("sk-ant"));
    return true;
  });
  mockFetch(() => json({ error: secret }, 500), () => json({ error: secret }, 503), () => json({ error: secret }, 502));
  await assert.rejects(callProvider(envWith(ALL_KEYS), req()), (err: unknown) => {
    assert.ok(err instanceof ModelError && err.retryable && !err.message.includes("SECRET"));
    return true;
  });
});

test("a key the provider rejects falls back to the next provider", async () => {
  const calls = mockFetch(() => json({}, 401), openaiOk("Second provider."));
  const res = await callProvider(envWith(ALL_KEYS), req());
  assert.equal(res.text, "Second provider.");
  assert.equal(calls.length, 2);
});

test("avoidProvider is never called, even when it is the only key left", async () => {
  const calls = mockFetch(geminiOk("{\"score\": 1}"));
  const res = await callProvider(envWith(ALL_KEYS), req({ tier: "judge", avoidProvider: "openai", json: true }));
  assert.equal(res.provider, "gemini");
  assert.deepEqual(res.data, { score: 1 });
  assert.equal(calls[0].body.generationConfig.responseMimeType, "application/json");
  await assert.rejects(callProvider(envWith({ ANTHROPIC_API_KEY: "a" }), req({ tier: "judge", avoidProvider: "anthropic" })), /No AI provider is set up/);
});

test("judges default to a non-Anthropic model", async () => {
  const calls = mockFetch(openaiOk("{\"pass\": true}"));
  await callProvider(envWith(ALL_KEYS), req({ tier: "judge", json: true }));
  assert.equal(calls[0].body.model, "gpt-6.1-sol");
  assert.deepEqual(calls[0].body.text.format, { type: "json_object" });
});

test("structured output: each provider gets the schema in its own form, then the reply is parsed", async () => {
  const schema = {
    type: "object",
    properties: { title: { type: "string", maxLength: 80 }, tags: { type: "array", items: { type: "string" }, maxItems: 3 } },
    required: ["title", "tags"],
  };
  const answer = JSON.stringify({ title: "Hi", tags: ["a"] });

  const a = mockFetch(anthropicOk(answer));
  const ra = await callProvider(envWith(ALL_KEYS), req({ json: true, schema }));
  assert.deepEqual(ra.data, { title: "Hi", tags: ["a"] });
  const sent = a[0].body.output_config.format;
  assert.equal(sent.type, "json_schema");
  assert.equal(sent.schema.additionalProperties, false);
  assert.equal(sent.schema.properties.title.maxLength, undefined, "length limits are moved into the description");
  assert.match(sent.schema.properties.title.description, /maxLength/);
  assert.equal(schema.properties.title.maxLength, 80, "the caller's schema is not changed");

  const o = mockFetch(openaiOk(answer));
  await callProvider(envWith({ OPENAI_API_KEY: "o" }), req({ json: true, schema }));
  assert.equal(o[0].body.text.format.type, "json_schema");
  assert.equal(o[0].body.text.format.strict, false, "not strict: the schema leaves objects open");
  const strictSchema = { ...schema, additionalProperties: false };
  const o2 = mockFetch(openaiOk(answer));
  await callProvider(envWith({ OPENAI_API_KEY: "o" }), req({ json: true, schema: strictSchema }));
  assert.equal(o2[0].body.text.format.strict, true);

  const g = mockFetch(geminiOk("```json\n" + answer + "\n```"));
  const rg = await callProvider(envWith({ GEMINI_API_KEY: "g" }), req({ json: true, schema }));
  assert.deepEqual(g[0].body.generationConfig.responseJsonSchema, schema);
  assert.deepEqual(rg.data, { title: "Hi", tags: ["a"] });
});

test("a schema the provider rejects is retried once without structured output", async () => {
  const calls = mockFetch(() => json({}, 400), anthropicOk("{\"ok\": true}"));
  const res = await callProvider(envWith({ ANTHROPIC_API_KEY: "a" }), req({ json: true, schema: { type: "object", properties: { ok: { type: "boolean" } } } }));
  assert.deepEqual(res.data, { ok: true });
  assert.ok(calls[0].body.output_config.format);
  assert.equal(calls[1].body.output_config.format, undefined);
  assert.match(calls[1].body.system, /matching this JSON schema/);
});

test("free-form objects are not sent to Anthropic as a schema", async () => {
  const calls = mockFetch(anthropicOk("{\"spec\": {}}"));
  await callProvider(envWith({ ANTHROPIC_API_KEY: "a" }), req({ json: true, schema: { type: "object", properties: { spec: { type: "object" } } } }));
  assert.equal(calls[0].body.output_config.format, undefined);
  assert.match(calls[0].body.system, /JSON schema/);
});

test("broken JSON, cut-off replies and refusals fall back, and their cost is still counted", async () => {
  mockFetch(anthropicOk("not json at all"), () => json({ status: "incomplete", usage: { input_tokens: 10, output_tokens: 10 }, output: [] }), geminiOk("{\"a\": 1}"));
  const res = await callProvider(envWith(ALL_KEYS), req({ json: true }));
  assert.deepEqual(res.data, { a: 1 });
  const gemini = usageCostMicroUsd(LIVE_MODELS["gemini-3.1-pro-preview"], { input: 1000, output: 500, cached: 0, cacheWrite: 0 });
  assert.equal(res.costMicroUsd, 7000 + (10 * 2 + 10 * 10) + gemini);

  mockFetch(() => json({ content: [], stop_reason: "refusal", usage: { input_tokens: 100, output_tokens: 0 } }));
  await assert.rejects(callProvider(envWith({ ANTHROPIC_API_KEY: "a" }), req()), (err: unknown) => {
    assert.ok(err instanceof ModelError);
    assert.equal(err.code, "provider_refused");
    assert.equal(err.costMicroUsd, 200);
    return true;
  });
});

test("no keys: a plain not-configured error", async () => {
  await assert.rejects(callProvider(envWith({}), req()), (err: unknown) => err instanceof ModelError && err.code === "not_configured");
});

test("callModel in live mode logs provider, model and cost, including billed failures", async () => {
  const t = await testEnv({ MODEL_MODE: "live", ...ALL_KEYS, DAILY_MODEL_CAP_USD: "5" });
  mockFetch(anthropicOk("Logged."));
  await callModel(t.env, req({ jobId: "job_x", runId: "run_x" }));
  mockFetch(() => json({ content: [{ type: "text", text: "cut" }], stop_reason: "max_tokens", usage: { input_tokens: 1000, output_tokens: 100 } }), () => json({}, 503), () => json({}, 503));
  await assert.rejects(callModel(t.env, req()));
  const rows = await t.sql("SELECT provider, model, cost_micro_usd, ok, job_id FROM model_calls ORDER BY ok DESC");
  assert.deepEqual(rows[0], { provider: "anthropic", model: "claude-sonnet-5-5", cost_micro_usd: 7000, ok: 1, job_id: "job_x" });
  assert.equal(rows[1].ok, 0);
  assert.equal(rows[1].cost_micro_usd, 3000, "the cut-off reply was billed");
});

test("callModel keeps the daily cap in live mode", async () => {
  const t = await testEnv({ MODEL_MODE: "live", ...ALL_KEYS, DAILY_MODEL_CAP_USD: "0.001" });
  await t.sql("INSERT INTO model_calls (id, day, purpose, provider, model, cost_micro_usd, ok, created_at) VALUES ('mc_1', ?, 'x', 'anthropic', 'm', 1000, 1, 'x')", new Date().toISOString().slice(0, 10));
  mockFetch();
  await assert.rejects(callModel(t.env, req()), /today's limit/);
});
