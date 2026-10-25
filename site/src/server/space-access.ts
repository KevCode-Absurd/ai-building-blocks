export type AccessPolicy = { mode: "invited" | "domain" | "link"; emails: string[]; domain: string };
export const LINK_ACCESS: AccessPolicy = { mode: "link", emails: [], domain: "" };
const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
export function readAccess(value: unknown): AccessPolicy {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Choose who can access this space.");
  const p = value as Record<string, unknown>;
  if (!["invited", "domain", "link"].includes(String(p.mode)) || !Array.isArray(p.emails) || p.emails.length > 100 || typeof p.domain !== "string") throw Error("Choose a sharing mode and up to 100 email addresses.");
  const emails = [...new Set(p.emails.map(email => {
    if (typeof email !== "string") throw Error("Enter complete email addresses.");
    const e = email.trim().toLowerCase(), parts = e.split("@");
    if (e.length > 254 || parts.length !== 2 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(parts[0]) || !domainPattern.test(parts[1])) throw Error("Enter complete email addresses.");
    return e;
  }))];
  const domain = p.domain.trim().toLowerCase().replace(/^@/, "");
  if (p.mode === "domain" && !domainPattern.test(domain)) throw Error("Enter a company email domain such as yourcompany.com.");
  return { mode: p.mode as AccessPolicy["mode"], emails, domain: p.mode === "domain" ? domain : "" };
}
export function emailAllowed(policy: AccessPolicy, verifiedEmails: string[]) {
  return policy.mode === "link" || verifiedEmails.some(raw => {
    const email = raw.toLowerCase();
    return policy.emails.includes(email) || policy.mode === "domain" && email.split("@")[1] === policy.domain;
  });
}
