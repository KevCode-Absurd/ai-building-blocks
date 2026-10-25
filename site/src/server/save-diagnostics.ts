import { safeDiagnostic, type DiagnosticCode, type DiagnosticStage } from "../lib/save-diagnostics.ts";
export type SaveFailureReporter = (stage: DiagnosticStage, code: DiagnosticCode) => void;
/** Only closed-schema fields reach the logger. The request itself is never logged. */
export function saveRequestDiagnostics(method: string, sink: (line: string) => void = line => console.error(line)) {
  const requestId = crypto.randomUUID(), started = Date.now();
  let stage: DiagnosticStage = "http", code: DiagnosticCode = "http_error";
  const report: SaveFailureReporter = (nextStage, nextCode) => { stage = nextStage; code = nextCode; };
  return { report, finish(response: Response) {
    const headers = new Headers(response.headers);
    headers.set("x-save-request-id", requestId);
    if (!response.ok) {
      headers.set("x-save-error-code", code); headers.set("x-save-error-stage", stage);
      // Logging must never change a completed save or its response.
      try { sink(JSON.stringify(safeDiagnostic({ at: Date.now(), event: "failure", operation: method as "GET" | "PUT", stage, code, status: response.status, requestId, elapsedMs: Date.now() - started, attempt: 0 }))); } catch {}
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  } };
}
