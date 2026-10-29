import type { CommunityContent, SafetyFinding, SafetyReport } from "../lib/community.ts";
export const SCANNER_VERSION = "community-static/1";
// Submitted instructions are untrusted data. Never execute or fetch their contents.
const rules: { id: string; severity: SafetyFinding["severity"]; pattern: RegExp; message: string }[] = [
  { id: "instruction-override", severity: "block", pattern: /(?:ignore|disregard|override|bypass)\s+(?:(?:all|any|the|your|previous|prior|system|developer|safety|security)\s+){1,5}(?:instructions?|rules?|prompts?|checks?|polic(?:y|ies))/i, message: "Attempts to override assistant or safety instructions." },
  { id: "hidden-action", severity: "block", pattern: /(?:do not|don't|never)\s+(?:tell|inform|notify|ask)\s+(?:the\s+)?user|(?:run|execute|send|upload)\s+(?:silently|secretly)|hide\s+(?:this|these|the)\s+(?:action|instruction|command)/i, message: "Requests hidden actions or bypasses user awareness." },
  { id: "credential-exfiltration", severity: "block", pattern: /(?:send|upload|post|exfiltrat\w*|transmit).{0,120}(?:api[ _-]?keys?|credentials?|passwords?|session[ _-]?tokens?|private[ _-]?keys?|\.env\b)|(?:credentials?|passwords?|api[ _-]?keys?).{0,100}(?:https?:\/\/|webhook)/i, message: "May transmit credentials or private configuration." },
  { id: "credential-material", severity: "block", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-(?:proj-)?[a-zA-Z0-9_-]{24,}|AKIA[A-Z0-9]{16}|gh[pousr]_[a-zA-Z0-9]{30,})\b/, message: "Contains possible live credentials. Remove secrets before sharing." },
  { id: "destructive-command", severity: "block", pattern: /\brm\s+-[a-z]*r[a-z]*f\b|\b(?:format\s+[a-z]:|del\s+\/s|remove-item\b.{0,100}-recurse)|\b(?:drop\s+(?:database|table)|truncate\s+table)\b/i, message: "Contains destructive file or database commands." },
  { id: "remote-execution", severity: "block", pattern: /(?:curl|wget|invoke-webrequest|iwr)\b[^\n]{0,200}\|\s*(?:sh|bash|powershell|iex|invoke-expression)\b|\b(?:eval|exec)\s*\(\s*(?:atob|base64|decode)/i, message: "Downloads or decodes a payload for immediate execution." },
  { id: "encoded-payload", severity: "block", pattern: /(?:-enc(?:odedcommand)?\s+[a-z0-9+/=]{16,}|[a-z0-9+/]{500,}={0,2}|(?:\\x[0-9a-f]{2}){12,})/i, message: "Contains an encoded payload that cannot be reviewed as plain text." },
  { id: "active-markup", severity: "block", pattern: /<\s*(?:script|iframe|object|embed)\b|javascript\s*:|on(?:error|load)\s*=/i, message: "Contains active browser content." },
  { id: "external-access", severity: "review", pattern: /https?:\/\/|\b(?:fetch|requests\.(?:get|post)|socket|webhook)\s*\(/i, message: "Review external destinations, data sent and required permissions." },
  { id: "process-execution", severity: "review", pattern: /\b(?:subprocess|child_process|os\.system|shell\s*=\s*True|invoke-expression|exec\s*\(|eval\s*\()/i, message: "Review process execution in an isolated environment." },
];
export async function scanCommunity(content: CommunityContent): Promise<SafetyReport> {
  return scanSourceFiles([{ path: "listing.txt", content: `${content.title}\n${content.description}\n${content.author}` }, { path: "SKILL.md", content: content.instructions }, ...content.files], content);
}

/** Shared static review of source text. No code execution, downloads or sharing-licence assumptions. */
export async function scanSourceFiles(files: { path: string; content: string }[], digestContent: unknown = files): Promise<SafetyReport> {
  const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(digestContent))))].map(x => x.toString(16).padStart(2, "0")).join("");
  const findings: SafetyFinding[] = [];
  for (const file of files) {
    if (/\.(py|js|mjs|ts|sh|ps1)$/i.test(file.path)) findings.push({ rule: "executable-source", severity: "review", file: file.path, line: 1, message: "Code requires isolated behavior testing and human source review." });
    const normalized = file.content.normalize("NFKC").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "");
    if (normalized !== file.content) findings.push({ rule: "hidden-unicode", severity: "review", file: file.path, line: 1, message: "Inspect invisible or compatibility characters." });
    for (const rule of rules) {
      const match = rule.pattern.exec(normalized);
      if (match) findings.push({ rule: rule.id, severity: rule.severity, file: file.path, line: normalized.slice(0, match.index).split("\n").length, message: rule.message });
    }
  }
  return { version: SCANNER_VERSION, digest, checkedAt: new Date().toISOString(), findings, blocked: findings.some(f => f.severity === "block") };
}
