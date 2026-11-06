// Fake model replies for this module (MODEL_MODE=fake): believable, deterministic judges for tests and the local demo.
//   evaluation.rubric    passes every criterion with a real quote from the draft, unless the draft contains FAILCHECK
//   evaluation.pairwise  prefers the draft with more sections and detail (the same answer in both orders)
//   evaluation.policy    finds no unsupported claims
import { registerFake } from "../../core/models.ts";
import { parseJson } from "../../core/db.ts";
import { extractTag } from "./prompts.ts";

/** Lines of the draft that make good quotes: exact substrings, markdown marks trimmed from the start, at most 120 characters. */
function quotableLines(draft: string): string[] {
  return draft.split("\n")
    .map(line => line.trim().replace(/^(?:[#>*\-+]+|\d+[.)])\s*/, "").trim())
    .filter(line => line.length >= 8 && draft.includes(line))
    .map(line => {
      if (line.length <= 120) return line;
      const cut = line.slice(0, 120);
      return cut.slice(0, Math.max(40, cut.lastIndexOf(" "))).trim();
    });
}

registerFake("evaluation.rubric", req => {
  const draft = extractTag(req.prompt, "draft") ?? "";
  const criteria = parseJson<{ id: string }[]>(extractTag(req.prompt, "criteria"), []);
  if (/FAILCHECK/.test(draft)) {
    const marker = draft.split("\n").find(l => l.includes("FAILCHECK"))?.trim() ?? "FAILCHECK";
    return { data: { criteria: criteria.map(c => ({ id: c.id, pass: false, evidence: marker, note: "Not met. The draft has the FAILCHECK test marker, so the test checker fails it." })) } };
  }
  const quotes = quotableLines(draft);
  return {
    data: {
      criteria: criteria.map((c, i) => ({
        id: c.id,
        pass: quotes.length > 0,
        evidence: quotes.length ? quotes[i % quotes.length] : "",
        note: quotes.length ? "Met. The quoted line shows it." : "Not met. The draft is empty.",
      })),
    },
  };
});

function fakeQuality(text: string): number {
  if (/FAILCHECK/.test(text)) return -1;
  const headings = (text.match(/^#{1,4}\s/gm) ?? []).length;
  const bullets = (text.match(/^\s*(?:[-*+]|\d+[.)])\s/gm) ?? []).length;
  return headings * 200 + bullets * 40 + text.trim().length;
}

registerFake("evaluation.pairwise", req => {
  const a = fakeQuality(extractTag(req.prompt, "draft_a") ?? "");
  const b = fakeQuality(extractTag(req.prompt, "draft_b") ?? "");
  if (Math.abs(a - b) < 20) return { data: { winner: "tie", reason: "Both drafts cover the brief about as well as each other." } };
  const winner = a > b ? "A" : "B";
  return { data: { winner, reason: `Draft ${winner} covers more of the brief, with clearer sections and more detail.` } };
});

registerFake("evaluation.policy", () => ({ data: { flags: [] } }));
