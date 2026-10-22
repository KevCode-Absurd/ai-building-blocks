import type { ComposerEnv, ComposerStore } from "./composer.ts";

export const MAX_VOICE_BYTES = 44 + 16000 * 2 * 300;
const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } });
const hash = async (value: string | Uint8Array) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", typeof value === "string" ? new TextEncoder().encode(value) : value))].map(b => b.toString(16).padStart(2, "0")).join("");

// A canonical PCM stream bounds actual billable duration by sample count.
// Browser duration fields and compressed-file metadata are untrusted.
export function voiceDuration(bytes: Uint8Array) {
  if (bytes.length < 32044 || bytes.length > MAX_VOICE_BYTES) throw Error("Record between one second and five minutes.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (at: number, n: number) => String.fromCharCode(...bytes.slice(at, at + n));
  if (tag(0, 4) !== "RIFF" || view.getUint32(4, true) !== bytes.length - 8 || tag(8, 8) !== "WAVEfmt " || view.getUint32(16, true) !== 16 || view.getUint16(20, true) !== 1 || view.getUint16(22, true) !== 1 || view.getUint32(24, true) !== 16000 || view.getUint32(28, true) !== 32000 || view.getUint16(32, true) !== 2 || view.getUint16(34, true) !== 16 || tag(36, 4) !== "data" || view.getUint32(40, true) !== bytes.length - 44 || (bytes.length - 44) % 2) throw Error("The recording format could not be read. Please record again.");
  return (bytes.length - 44) / 32000;
}
async function readAudio(request: Request) {
  const reader = request.body?.getReader(); if (!reader) throw Error("No recording received.");
  const chunks: Uint8Array[] = []; let length = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > MAX_VOICE_BYTES) { await reader.cancel(); throw Error("Record up to five minutes at a time."); } chunks.push(value); }
  const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; } return bytes;
}
export async function handleTranscription(request: Request, env: ComposerEnv, store: ComposerStore | null, ip: string, provider: typeof fetch = fetch) {
  const enabled = env.WORKFLOW_COMPOSER_ENABLED === "true" && !!env.OPENAI_API_KEY && !!env.WORKFLOW_SALT && !!store;
  if (request.method === "GET") return json(200, { enabled });
  if (request.method !== "POST") return json(405, { error: "Use POST to transcribe a recording." });
  if (!enabled || !store) return json(503, { error: "Voice input is temporarily unavailable. You can still type your request." });
  if (request.headers.has("origin") && request.headers.get("origin") !== new URL(request.url).origin) return json(403, { error: "Open voice input on this site." });
  if (request.headers.get("content-type")?.split(";")[0] !== "audio/wav") return json(415, { error: "Send a WAV recording." });
  const requestId = request.headers.get("idempotency-key") ?? "";
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) return json(400, { error: "Start a new voice request." });
  let audio: Uint8Array, duration: number;
  try { audio = await readAudio(request); duration = voiceDuration(audio); } catch (error) { return json(400, { error: (error as Error).message }); }
  const ipHash = await hash(env.WORKFLOW_SALT! + ip);
  const id = await hash(JSON.stringify(["voice", ipHash, requestId]));
  if (await store.get(id)) return json(409, { error: "That recording has already been submitted. Please record again." });
  // The global atomic composer budget also covers voice. Never store audio or
  // transcripts in the usage ledger, or count voice as account workflows.
  const reserve = Math.ceil(duration) * .006 / 60 * 1.25;
  const cap = Math.min(25, Number(env.WORKFLOW_DAILY_CAP_USD || 2));
  if (!Number.isFinite(cap) || cap <= 0 || !await store.claim({ id, fingerprint: await hash(audio), day: new Date().toISOString().slice(0, 10), ip: ipHash, user_id: "voice:" + ipHash, charge: reserve, status: "pending", result: null }, cap)) return json(429, { error: "The voice allowance is reached. You can still type your request." });
  let rejectedBeforeTranscription = false;
  try {
    const form = new FormData(); form.set("model", "whisper-1"); form.set("response_format", "json");
    form.set("file", new Blob([audio], { type: "audio/wav" }), "request.wav");
    const response = await provider("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: form, signal: AbortSignal.timeout(60000) });
    if (!response.ok) { rejectedBeforeTranscription = [400, 401, 403, 404, 413, 422, 429].includes(response.status); throw Error("Transcription unavailable"); }
    const data = await response.json() as { text?: unknown };
    if (typeof data.text !== "string") throw Error("Invalid transcription");
    await store.finish(id, Math.ceil(duration) * .006 / 60, "done", null);
    return json(200, { text: data.text.trim().slice(0, 10000) });
  } catch {
    // Billing may be unknown after a transport failure: retain the reservation.
    await store.finish(id, rejectedBeforeTranscription ? 0 : reserve, "failed", null);
    return json(502, { error: "The recording could not be transcribed. Please try again or type your request." });
  }
}
