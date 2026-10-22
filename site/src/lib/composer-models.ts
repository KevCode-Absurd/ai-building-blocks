export type Provider = "openai" | "gemini" | "anthropic" | "deepseek";
export type Model = { id: string; label: string; provider: Provider; input: number; output: number; cached: number; note?: string };
// Standard USD / million tokens, checked 2026-10-22. DeepSeek uses conservative peak rates.
export const MODELS: Model[] = [
  { id: "gpt-6-luna", label: "GPT-6 Luna", provider: "openai", input: .1, output: .5, cached: .01 },
  { id: "gpt-6.1-sol", label: "GPT-6.1 Sol", provider: "openai", input: 2, output: 10, cached: .1 },
  { id: "gpt-6-astra", label: "GPT-6 Astra", provider: "openai", input: 10, output: 50, cached: 1 },
  { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite", provider: "gemini", input: .3, output: 2.5, cached: .03 },
  { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash", provider: "gemini", input: .75, output: 3.75, cached: .075, note: "Promotional rates through 2026-12-31; double afterward." },
  { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview", provider: "gemini", input: 2, output: 12, cached: .2 },
  { id: "claude-haiku-5-5", label: "Claude Haiku 5.5", provider: "anthropic", input: .1, output: .5, cached: .01, note: "Short prompts up to 100k tokens." },
  { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", provider: "anthropic", input: 2, output: 10, cached: .1 },
  { id: "claude-opus-5-5", label: "Claude Opus 5.5", provider: "anthropic", input: 4, output: 20, cached: .2 },
  { id: "claude-fable-5-1", label: "Claude Fable 5.1", provider: "anthropic", input: 10, output: 50, cached: .25 },
  { id: "deepseek-flash", label: "DeepSeek V4.1 Flash", provider: "deepseek", input: .3, output: 1.2, cached: .006, note: "Peak rates; off-peak is half." },
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", provider: "deepseek", input: 1.32, output: 3.96, cached: .044, note: "Peak rates; off-peak is half." },
];
export const KEY_NAMES = { openai: "OPENAI_API_KEY", gemini: "GEMINI_API_KEY", anthropic: "ANTHROPIC_API_KEY", deepseek: "DEEPSEEK_API_KEY" } as const;
export const planOutputLimit = (model: Model) => model.id === "gpt-6-luna" ? 8000 : 5000;
export type Usage = { input: number; output: number; cached: number; cacheWrite: number };
export function usageCost(model: Model, u: Usage, at = new Date()): number {
  let multiplier = 1;
  if (model.id === "gemini-3.8-flash" && at >= new Date("2027-01-01T00:00:00Z")) multiplier = 2;
  if (model.provider === "deepseek") { const h = at.getUTCHours(), day = at.getUTCDay(); if (day === 0 || day === 6 || !(h >= 1 && h < 4 || h >= 6 && h < 10)) multiplier = .5; }
  const long = model.id === "claude-haiku-5-5" && u.input + u.cached + u.cacheWrite > 100000 ? 5 : 1;
  return (u.input * model.input + u.output * model.output + u.cached * model.cached + u.cacheWrite * model.input * 1.25) / 1e6 * multiplier * long;
}
export type ModelResult = { text: string; usage: Usage; cost: number; latencyMs: number; finish: string; actualModel: string };
export class ProviderError extends Error {
  status: number; billable: ModelResult | null; unbilled = false; providerCode?: string;
  constructor(message: string, status = 502, billable: ModelResult | null = null) { super(message); this.status = status; this.billable = billable; }
}
export async function callModel(model: Model, key: string, prompt: { system: string; user: string }, schema: unknown, maxOutput = 5000, fetcher: typeof fetch = fetch): Promise<ModelResult> {
  let url: string, body: unknown, headers: Record<string, string> = { "content-type": "application/json" };
  if (model.provider === "openai") {
    url = "https://api.openai.com/v1/responses"; headers.authorization = `Bearer ${key}`;
    body = { model: model.id, instructions: prompt.system, input: prompt.user, reasoning: { effort: model.id === "gpt-6-luna" ? "none" : "low" }, max_output_tokens: maxOutput, store: false, text: { format: { type: "json_schema", name: "workflow_plan", strict: true, schema } } };
  } else if (model.provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages"; headers["x-api-key"] = key; headers["anthropic-version"] = "2023-06-01";
    body = { model: model.id, system: prompt.system, messages: [{ role: "user", content: prompt.user }], max_tokens: maxOutput, output_config: { effort: "low", format: { type: "json_schema", schema } } };
  } else if (model.provider === "gemini") {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent`; headers["x-goog-api-key"] = key;
    body = { systemInstruction: { parts: [{ text: prompt.system }] }, contents: [{ role: "user", parts: [{ text: prompt.user }] }], generationConfig: { maxOutputTokens: maxOutput, thinkingConfig: { thinkingLevel: "LOW" }, responseMimeType: "application/json", responseJsonSchema: schema } };
  } else {
    url = "https://api.deepseek.com/chat/completions"; headers.authorization = `Bearer ${key}`;
    body = { model: model.id, messages: [{ role: "system", content: prompt.system + "\nReturn JSON matching this schema: " + JSON.stringify(schema) }, { role: "user", content: prompt.user }], max_tokens: maxOutput, thinking: { type: "disabled" }, response_format: { type: "json_object" } };
  }
  const start = Date.now();
  let response: Response;
  try { response = await fetcher(url, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(120000) }); }
  catch { throw new ProviderError("The model connection timed out or could not be reached. Try again later."); }
  // Do not return provider bodies: some errors can echo request content or credentials.
  if (!response.ok) {
    const rejected = new ProviderError(`The model provider returned HTTP ${response.status}.`, response.status);
    rejected.unbilled = [400, 401, 403, 404, 413, 422, 429].includes(response.status);
    const error = await response.json().catch(() => null) as any;
    const code = error?.error?.code ?? error?.error?.type;
    if (["rate_limit_exceeded", "insufficient_quota", "credit_balance_exhausted"].includes(code)) rejected.providerCode = code;
    throw rejected;
  }
  const d = await response.json() as any;
  let text = "", usage: Usage = { input: 0, output: 0, cached: 0, cacheWrite: 0 }, finish = "", actualModel = d.model ?? d.modelVersion ?? model.id;
  if (model.provider === "openai") {
    // Responses can contain both commentary and final JSON. Combining them corrupts JSON.
    const messages = (d.output ?? []).filter((o: any) => (!o.type || o.type === "message") && (!o.role || o.role === "assistant"));
    const final = messages.filter((o: any) => o.phase === "final_answer").at(-1) ?? messages.filter((o: any) => !o.phase).at(-1);
    text = (final?.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("");
    usage.cached = d.usage?.input_tokens_details?.cached_tokens ?? 0; usage.input = (d.usage?.input_tokens ?? 0) - usage.cached; usage.output = d.usage?.output_tokens ?? 0; finish = d.status;
  } else if (model.provider === "anthropic") {
    text = (d.content ?? []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("");
    usage = { input: d.usage?.input_tokens ?? 0, output: d.usage?.output_tokens ?? 0, cached: d.usage?.cache_read_input_tokens ?? 0, cacheWrite: d.usage?.cache_creation_input_tokens ?? 0 }; finish = d.stop_reason;
  } else if (model.provider === "gemini") {
    text = (d.candidates?.[0]?.content?.parts ?? []).filter((p: any) => !p.thought).map((p: any) => p.text ?? "").join("");
    usage.cached = d.usageMetadata?.cachedContentTokenCount ?? 0; usage.input = (d.usageMetadata?.promptTokenCount ?? 0) - usage.cached; usage.output = (d.usageMetadata?.candidatesTokenCount ?? 0) + (d.usageMetadata?.thoughtsTokenCount ?? 0); finish = d.candidates?.[0]?.finishReason ?? "blocked";
  } else {
    text = d.choices?.[0]?.message?.content ?? ""; usage.cached = d.usage?.prompt_cache_hit_tokens ?? 0; usage.input = (d.usage?.prompt_tokens ?? 0) - usage.cached; usage.output = d.usage?.completion_tokens ?? 0; finish = d.choices?.[0]?.finish_reason;
  }
  const result = { text, usage, cost: usageCost(model, usage), latencyMs: Date.now() - start, finish, actualModel };
  if (!text || !["completed", "end_turn", "STOP", "stop"].includes(finish)) throw new ProviderError("The model did not finish a complete workflow. Try a smaller request or another model.", 502, result);
  return result;
}
