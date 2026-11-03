// Shared by the browser report (lib/chunk-recovery.ts) and the server that logs it (server/client-error.ts), which
// cleans again because a browser cannot be trusted. Keeps the shape of an error message, never its data: addresses
// other than our own hashed code files, quoted text, emails and numbers are replaced, and odd characters dropped.
export function safeErrorText(message: unknown): string {
  if (typeof message !== "string") return "";
  return message.slice(0, 2_000)
    .replace(/https?:\/\/[^\s"'()]+/g, url => { const m = /\/assets\/[\w.-]+\.(?:js|css)/.exec(url); return m ? m[0] : "<url>"; })
    .replace(/(["'`])(?:(?!\1).){0,200}\1/g, "<text>")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "<email>")
    .replace(/\d+/g, "#")
    .replace(/[^\w\s<>#().,:;/'-]/g, "")
    .replace(/\s+/g, " ").trim().slice(0, 200);
}
