// Deterministic policy rules: text a buyer must never receive. Each match is skipped when the buyer's own brief
// contains it (their facts, their contact details, their reviews). The model check for unsupported claims is in service.ts.
import type { PolicyResult } from "../../core/types.ts";

export type PolicyFlag = PolicyResult["flags"][number];
export type PolicyCode = "placeholder" | "guarantee" | "fake_review" | "contact_details" | "regulated_advice" | "unsupported_claim";

/** What the buyer gave us, normalised for "is this in the brief?" checks. */
export interface Known { norm: string; digits: string }

interface Pattern {
  re: RegExp; // must be global
  /** True when the match is fine because the brief supports it. Default: the matched text is in the brief. */
  exempt?: (m: RegExpMatchArray, known: Known) => boolean;
  /** Only for placeholder rules: skip when the job type or brief asks for placeholders. */
  leftoverOnly?: boolean;
}
interface Rule { code: PolicyCode; message: string; patterns: Pattern[] }

/** One plain instruction per flag code, used in rerun feedback. */
export const POLICY_FIX: Record<PolicyCode, string> = {
  placeholder: "Replace the placeholder with real content from the brief, or remove it.",
  guarantee: "Remove the promise of guaranteed results. Say what the product or service does instead.",
  fake_review: "Remove reviews, ratings and testimonials the brief does not give. Use only the proof in the brief.",
  contact_details: "Remove contact details that are not in the brief.",
  regulated_advice: "Do not give personal medical, legal, tax or investment advice. Describe the offer, or tell the reader to ask a qualified professional.",
  unsupported_claim: "Remove the claim, number or name, or change it to match the brief.",
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const onlyDigits = (text: string) => text.replace(/\D+/g, "");

export function knownFrom(...parts: (string | null | undefined)[]): Known {
  const text = parts.filter(Boolean).join("\n");
  return { norm: normalizeText(text), digits: onlyDigits(text) };
}

const inBrief = (s: string | undefined | null, known: Known) => !!s && known.norm.includes(normalizeText(s));
const wordInBrief = (word: string | undefined, known: Known) => {
  const w = normalizeText(word ?? "").replace(/[^a-z0-9' -]/g, "");
  if (w.length < 2) return false;
  return new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9])`).test(known.norm);
};
/** Exempt when it is too short to be a phone number, or the brief has the same digits. */
const phoneInBrief = (m: RegExpMatchArray, known: Known) => {
  const d = onlyDigits(m[0]);
  return d.length < 8 || known.digits.includes(d) || (d.length > 10 && known.digits.includes(d.slice(-10)));
};
const mentionsRatings = (known: Known) => /stars?|rating|rated|review/.test(known.norm);

// A name after a dash: "Sarah K.", "**Dr. Lee**", "Jess Moreno".
const NAME = String.raw`\**([A-Z][\w.'’-]*(?:[ \t]+[A-Z][\w.'’-]*){0,3})`;
const DASH = String.raw`(?:[—–~]|--)`; // em dash, en dash, tilde or double hyphen
const QUOTE = String.raw`["“]([^"”\n]{12,400})["”]`;

const RULES: Rule[] = [
  {
    code: "placeholder",
    message: "Placeholder text is still in the draft.",
    patterns: [
      { re: /\[\s*insert\b[^\]\n]{0,80}\](?!\()/gi, leftoverOnly: true },
      { re: /\[\s*(?:add|enter|put|paste)\b[^\]\n]{0,60}\bhere\s*\](?!\()/gi, leftoverOnly: true },
      { re: /\blorem ipsum\b/gi },
      { re: /\bas an ai(?:\s+(?:language\s+)?(?:model|assistant))?\s*,?\s+i\b/gi },
      { re: /\bas an? (?:large )?language model\b/gi },
      { re: /\bTODO\b/g },
    ],
  },
  {
    code: "guarantee",
    message: "The draft promises guaranteed results.",
    patterns: [
      { re: /\b100\s?%\s+guaranteed?\b/gi },
      { re: /\bguaranteed\s+(?:results?|success|sales|rankings?|returns?|income|profits?|leads|growth|savings|approval|weight loss|to\s+(?:work|win|rank|grow|double|triple|increase|boost|sell|get|make|earn))\b/gi },
      { re: /\bresults?\s+(?:are\s+)?guaranteed\b/gi },
      { re: /\b(?:we|i)\s+guarantee\s+(?:you|that|results?|success|it|your)\b/gi },
      { re: /\bguarantees?\s+(?:you(?:'ll| will)?|that you|results?|success)\b/gi },
      { re: /\brisk[- ]free\b/gi },
    ],
  },
  {
    code: "fake_review",
    message: "The draft has a review, rating or testimonial that the brief does not give.",
    patterns: [
      // "Best app ever." - Sarah K.   (same line)
      { re: new RegExp(`${QUOTE}[ \\t]*(?:${DASH}|-)[ \\t]*${NAME}`, "g"), exempt: (m, k) => wordInBrief(m[2]?.split(/\s+/)[0], k) || inBrief(m[1], k) },
      // "Best app ever."\n— Sarah K.   (next line)
      { re: new RegExp(`${QUOTE}[ \\t]*\\n[ \\t]*(?:>[ \\t]*)?${DASH}[ \\t]*${NAME}`, "g"), exempt: (m, k) => wordInBrief(m[2]?.split(/\s+/)[0], k) || inBrief(m[1], k) },
      // > Best app ever.\n> — Sarah K.
      { re: new RegExp(`^>[ \\t]*([^\\n]{12,400})\\n(?:>[ \\t]*)?${DASH}[ \\t]*${NAME}`, "gm"), exempt: (m, k) => wordInBrief(m[2]?.split(/\s+/)[0], k) || inBrief(m[1], k) },
      { re: /[★⭐]{3,}/g, exempt: (_m, k) => /\bstars?\b|★|⭐/.test(k.norm) },
      { re: /\b([1-5](?:\.\d)?)\s*(?:\/\s*5|out of 5)?\s+stars?\b/gi, exempt: (m, k) => inBrief(m[0], k) || (mentionsRatings(k) && inBrief(m[1], k)) },
      { re: /\b(?:rated|rating of|average of|scored)\s+([1-5](?:\.\d)?)(?:\s*(?:\/|out of)\s*5)?\b/gi, exempt: (m, k) => inBrief(m[0], k) || (mentionsRatings(k) && inBrief(m[1], k)) },
      { re: /\b(\d[\d,]*\+?)\s+(?:(?:five|5)[- ]star\s+)?(?:reviews|ratings|testimonials)\b/gi, exempt: (m, k) => inBrief(m[0], k) || inBrief(m[1].replace(/\+$/, ""), k) },
    ],
  },
  {
    code: "contact_details",
    message: "The draft has contact details that are not in the brief.",
    patterns: [
      { re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, exempt: (m, k) => /\.(?:png|jpe?g|gif|svg|webp|pdf)$/i.test(m[0]) || inBrief(m[0], k) },
      { re: /(?<![\w\d])(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?!\d)/g, exempt: phoneInBrief },
      { re: /(?<![\w\d+])\+\d{1,3}(?:[\s.-]?\(?\d{1,4}\)?){2,5}(?!\d)/g, exempt: phoneInBrief },
    ],
  },
  {
    code: "regulated_advice",
    message: "The draft gives medical, legal, tax or investment advice.",
    patterns: [
      // medical
      { re: /\b(?:cures?|heals?|treats?|reverses?|prevents?)\s+(?:your\s+)?(?:cancer|diabetes|depression|anxiety|arthritis|asthma|dementia|alzheimer'?s|adhd|autism|eczema|psoriasis|insomnia|obesity|hypertension|high blood pressure|heart disease|infections?|covid(?:-19)?|disease|illness)\b/gi },
      { re: /\b(?:stop|start|quit|skip|increase|decrease|reduce|double|lower)\s+(?:taking\s+)?(?:your\s+)?(?:medication|medicine|meds|prescriptions?|insulin|antidepressants?|blood thinners?|dosage)\b/gi },
      { re: /\b(?:no need to|don't need to|do not need to|never need to)\s+(?:see|visit|call|ask)\s+(?:a|your)\s+(?:doctor|physician|gp|therapist|pharmacist)\b/gi },
      { re: /\binstead of (?:seeing |visiting |asking )?(?:a |your )?(?:doctor|physician|gp|therapist)\b/gi },
      // legal
      { re: /\byou (?:do not|don't|won't|will not) need (?:a |an )?(?:lawyer|attorney|solicitor)\b/gi },
      { re: /\byou (?:will|are sure to|are certain to) win (?:your|the|this) (?:case|lawsuit|claim|dispute)\b/gi },
      { re: /\byou (?:should|must|need to) (?:sue|file (?:a )?(?:lawsuit|suit|legal claim))\b/gi },
      // tax
      { re: /\b(?:avoid|evade|dodge|skip) (?:paying )?(?:any )?(?:income )?tax(?:es)?\b/gi },
      { re: /\byou can (?:deduct|write off|claim)\b[^.\n]{0,60}\b(?:tax(?:es)?|irs|hmrc|tax return)\b/gi },
      { re: /\b(?:completely |100% )?tax[- ]free\b/gi },
      // investment
      { re: /\b(?:you should|we recommend(?: that you)?|i recommend(?: that you)?|now is the time to)\s+(?:buy|sell|short|invest in|put your (?:money|savings) (?:in|into))\b/gi },
      { re: /\b(?:safe|sure|certain)\s+(?:returns?|profits?|gains)\b/gi },
      { re: /\b(?:will|is going to|are going to)\s+(?:double|triple|10x)\s+your\s+(?:money|investment|savings|portfolio)\b/gi },
      { re: /\bthis (?:is|counts as|constitutes) (?:medical|legal|tax|financial|investment) advice\b/gi },
    ],
  },
];

const MAX_FLAGS = 25;

/**
 * Run every rule on the draft. known = the brief, spec and answers. allowPlaceholders = the job type or brief asks for
 * placeholders the buyer fills in (e.g. "[invoice number]"), so only leftovers like "lorem ipsum" are flagged.
 */
export function runPolicyRules(draft: string, known: Known, opts: { allowPlaceholders?: boolean } = {}): PolicyFlag[] {
  const flags: PolicyFlag[] = [];
  const seen = new Set<string>();
  for (const rule of RULES) {
    // Text spans already flagged for this rule, so two patterns on the same words make one flag.
    const spans: [number, number][] = [];
    for (const p of rule.patterns) {
      if (p.leftoverOnly && opts.allowPlaceholders) continue;
      for (const m of draft.matchAll(p.re)) {
        const excerpt = m[0].trim().slice(0, 200);
        if (!excerpt) continue;
        const exempt = p.exempt ? p.exempt(m, known) : inBrief(m[0], known);
        if (exempt) continue;
        const start = m.index ?? 0, end = start + m[0].length;
        if (spans.some(([s, e]) => start < e && end > s)) continue;
        const key = `${rule.code}:${rule.code === "contact_details" && !excerpt.includes("@") ? onlyDigits(excerpt) : normalizeText(excerpt)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        spans.push([start, end]);
        flags.push({ code: rule.code, message: rule.message, excerpt });
        if (flags.length >= MAX_FLAGS) return flags;
      }
    }
  }
  return flags;
}

/** True when the job type or brief expects placeholders for the buyer to fill in. */
export function placeholdersExpected(...texts: (string | null | undefined)[]): boolean {
  return texts.some(t => !!t && /\bplaceholders?\b/i.test(t));
}
