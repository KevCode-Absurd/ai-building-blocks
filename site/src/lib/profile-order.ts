// Order picks by the owner's saved org context (lib/business.ts). Pure functions, no storage, no network:
// the org context never leaves the browser, so this runs only on the client with the saved answers.
// Use it where a list of skills, specialists or tools is shown: matching items move up, the rest keep their order.

/** The org context answers this reads. Any saved `Business` object fits. */
export type ProfileLike = { reach?: string; area?: string; goal?: string; sells?: string; buyer?: string };
export type Reach = "local" | "online" | "both";

export const REACH_CHOICES: { id: Reach; label: string; md: string }[] = [
  { id: "local", label: "Near me, in my town or area", md: "Local" },
  { id: "online", label: "Online, anywhere", md: "Online" },
  { id: "both", label: "Both", md: "Local and online" },
];

/** Five plain goals for the setup question. The saved value is the label, so the org context reads naturally. */
export const GOAL_CHOICES = [
  "More customers or bookings",
  "More sales online",
  "Marketing that sounds like me",
  "Less time on admin",
] as const;

const LOCAL = /\b(local|near me|nearby|google business profile|business profile|google maps?|maps listing|service area|reviews?|walk-?ins?|foot ?traffic|bookings?|appointments?|neighbou?rhood|in-store|shop ?front|storefront|salon|clinic|restaurant|caf[eé]|trades?(?:people|man)?|plumb\w*|electrician|dentist|gym)\b/i;
const ONLINE = /\b(e-?commerce|online store|online shop|shopify|woocommerce|amazon|etsy|product pages?|pdp|checkout|cart|dropship\w*|d2c|dtc|subscriptions?|marketplace)\b/i;
const GOALS: [RegExp, RegExp][] = [
  // [what the goal says, what a matching item says]
  [/\b(customers?|clients?|leads?|bookings?|enquir\w*|inquir\w*|calls?|patients?)\b/i, /\b(leads?|customers?|clients?|bookings?|enquir\w*|inquir\w*|outreach|prospect\w*|referrals?|reviews?|follow-?ups?|local seo)\b/i],
  [/\b(sales|sell|revenue|orders?|shop|store)\b/i, /\b(sales|sell\w*|revenue|conversion\w*|checkout|offers?|pricing|upsell\w*|product pages?|abandoned cart|orders?)\b/i],
  [/\b(marketing|content|posts?|social|sounds? like|voice|brand)\b/i, /\b(content|posts?|social|captions?|copy\w*|blog|newsletters?|emails?|video|ads?|brand voice|hooks?)\b/i],
  [/\b(admin|time|busywork|paperwork|inbox|organi[sz]e)\b/i, /\b(admin|automat\w*|inbox|email triage|schedul\w*|invoic\w*|bookkeep\w*|spreadsheets?|sops?|process\w*|checklists?|templates?)\b/i],
];

/** How well an item's text fits the org context. 0 when nothing matches or nothing is saved. */
export function profileScore(text: string, p: ProfileLike): number {
  if (!text) return 0;
  let score = 0;
  const reach = p.reach as Reach | undefined;
  if (reach === "local" || reach === "both") { if (LOCAL.test(text)) score += 2; }
  if (reach === "online" || reach === "both") { if (ONLINE.test(text)) score += 2; }
  // A local-only business gets online-store picks after the rest, not hidden.
  if (reach === "local" && ONLINE.test(text) && !LOCAL.test(text)) score -= 1;
  const goal = p.goal?.trim() ?? "";
  if (goal) for (const [wants, item] of GOALS) if (wants.test(goal) && item.test(text)) { score += 1; break; }
  return score;
}

/** True when the org context has anything that changes the order. */
export const ordersPicks = (p: ProfileLike) => !!(p.reach || p.goal?.trim());

/** The same items, best fits for this org context first. Stable: equal scores keep their original order,
 *  and with nothing saved the list comes back unchanged. `textOf` gives the words to match (name, summary, tags). */
export function orderByProfile<T>(items: readonly T[], p: ProfileLike, textOf: (item: T) => string): T[] {
  if (!ordersPicks(p)) return [...items];
  return items.map((item, i) => ({ item, i, s: profileScore(textOf(item), p) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map(x => x.item);
}
