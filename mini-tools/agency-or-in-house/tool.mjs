// Agency or in-house. The single source of truth for this mini tool.
//
// Maths: the agency costs its retainer plus a share of your ad spend each month. An in-house hire costs salary x (1 +
// on-costs) / 12 plus their tools each month, plus a one-off cost to recruit and train. Both are added up over the months
// you compare. The gap is the hire's total minus the agency's. The ad spend where the two cost the same over those months
// = (hire a month + one-off / months - retainer) / the agency's share. Standard make-or-buy cost sums, written in our own words.

export default {
  slug: "agency-or-in-house",
  name: "Agency or employee cost comparison",
  /** The plain name, used where the tool talks about itself. */
  short: "Agency or employee cost comparison",
  headline: "Agency or employee cost comparison",
  summary: "Enter agency fees, ad spend and hiring costs. Compare marketing costs over your chosen period and where the cheaper option changes.",
  question: "At our ad spend, does an agency or an employee cost less?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "The agency" },
    { id: "hire", label: "The in-house hire" },
    { id: "compare", label: "How long you compare over" },
  ],
  inputs: [
    { id: "retainer", label: "Agency retainer a month", unit: "money", example: 3000, min: 0, max: 1e9, step: 250, help: "The fixed monthly fee. Use 0 if they charge only a share of ad spend.", where: "The agency's proposal or your last invoice.", tools: ["The agency's proposal", "Your accounts software"] },
    { id: "agencyShare", label: "Agency's share of ad spend", unit: "percent", example: 10, min: 0, max: 100, step: 1, help: "Many agencies charge a share of what you spend on ads, on top of the retainer. Use 0 if yours does not.", where: "The agency's proposal.", tools: ["The agency's proposal"] },
    { id: "adSpend", label: "Your ad spend a month", unit: "money", example: 20000, min: 0, max: 1e10, step: 1000, help: "What you spend on ads in a normal month. The agency's share is taken from this.", where: "Your ads accounts, last 3 months, divided by 3.", tools: ["Meta Ads Manager", "Google Ads", "Your accounts software"] },
    { id: "salary", label: "Salary for the in-house role, a year", unit: "money", example: 60000, min: 0, max: 1e9, step: 1000, section: "hire", help: "The yearly pay you would offer, before tax.", where: "Job ads for similar roles, or a pay survey for your area.", tools: ["Job boards", "A pay survey"] },
    { id: "oncost", label: "Extra costs on top of salary", unit: "percent", example: 25, min: 0, max: 200, step: 5, section: "hire", help: "Employer taxes, benefits and equipment, as a share of salary. These differ by country.", where: "Your accountant, or your payroll costs divided by pay.", tools: ["Your accountant", "Your payroll provider"] },
    { id: "toolsMonth", label: "Tools the hire needs a month", unit: "money", example: 400, min: 0, max: 1e9, step: 50, section: "hire", help: "Design, reporting, research and ad tools the agency would otherwise bring.", where: "The tools' pricing pages.", tools: ["Your card statements"] },
    { id: "hireOneOff", label: "One-off cost to recruit and train", unit: "money", example: 5000, min: 0, max: 1e9, step: 500, section: "hire", help: "Recruiter or job ad fees, your time interviewing, training. Use 0 if there are none.", where: "Recruiter quotes and the invoices from your last hire.", tools: ["Recruiter quotes", "Your accounts software"] },
    { id: "months", label: "Months you compare over", unit: "count", example: 12, min: 1, max: 120, step: 1, integer: true, section: "compare", help: "The one-off hiring cost is spread over these months. 12 is a fair start.", where: "How long you expect the arrangement to last.", tools: [] },
  ],
  outputs: [
    { id: "agencyMonth", label: "Agency cost a month", unit: "money", formula: "retainer + adSpend * agencyShare / 100", sum: "{retainer} + {adSpend} × {agencyShare} = {=}", means: "Retainer plus their share of your ad spend." },
    { id: "feeShareOfSpend", label: "Agency fee as a share of your ad spend", unit: "percent", formula: "IF(adSpend > 0, agencyMonth / adSpend * 100, NA())", none: "No ad spend", sum: "{agencyMonth} ÷ {adSpend} = {=}", means: "At a low spend, a retainer is a big share of every ad dollar." },
    { id: "agencyTotal", label: "Agency cost over the period", unit: "money", formula: "agencyMonth * months", sum: "{agencyMonth} × {months} = {=}", means: "What the agency costs over the months you chose." },
    { id: "inHouseMonth", label: "In-house cost a month", unit: "money", formula: "salary * (1 + oncost / 100) / 12 + toolsMonth", sum: "{salary} × (100% + {oncost}) ÷ 12 + {toolsMonth} = {=}", means: "Pay, the employer's extra costs and tools, before the one-off cost." },
    { id: "inHouseTotal", label: "In-house cost over the period", unit: "money", formula: "inHouseMonth * months + hireOneOff", sum: "{inHouseMonth} × {months} + {hireOneOff} = {=}", means: "The monthly cost over the months you chose, plus recruiting and training once." },
    { id: "gap", label: "The hire costs this much more than the agency", unit: "money", about: "The in-house total minus the agency total. Below zero, the hire costs less.", formula: "inHouseTotal - agencyTotal", sum: "{inHouseTotal} − {agencyTotal} = {=}", means: [
      { if: "gap > 0", text: "Above zero: the agency costs {=} less over the period." },
      { if: "gap < 0", text: "Below zero: the hire costs {=:abs} less over the period." },
      { text: "Both cost the same." },
    ] },
    { id: "gapMonth", label: "The gap, each month", unit: "money", formula: "gap / months", sum: "{gap} ÷ {months} = {=}", means: "The same gap spread over each month." },
    { id: "breakEvenSpend", label: "Ad spend a month where both cost the same", unit: "money", formula: "IF(agencyShare > 0, (inHouseMonth + hireOneOff / months - retainer) / (agencyShare / 100), NA())", none: "The agency fee does not change with spend", sum: "({inHouseMonth} + {hireOneOff} ÷ {months} − {retainer}) ÷ {agencyShare} = {=}", means: [
      { if: "NOT(HAS(breakEvenSpend))", text: "With no share of ad spend, the agency costs the same at any spend, so the gap never flips." },
      { if: "breakEvenSpend <= 0", text: "At or below zero: the agency costs more at any ad spend." },
      { text: "Above this ad spend the hire costs less. Below it, the agency does." },
    ] },
  ],
  answer: [
    [
      { if: "AND(gap > 0, HAS(breakEvenSpend))", text: "Over {months} months the agency costs {agencyTotal} and an in-house hire {inHouseTotal}, so the agency costs {gap} less, or {gapMonth} a month. Above {breakEvenSpend} a month of ad spend, the hire becomes cheaper." },
      { if: "gap > 0", text: "Over {months} months the agency costs {agencyTotal} and an in-house hire {inHouseTotal}, so the agency costs {gap} less, or {gapMonth} a month. The agency fee does not move with ad spend, so the gap stays the same at any spend." },
      { if: "AND(gap < 0, HAS(breakEvenSpend))", text: "Over {months} months the agency costs {agencyTotal} and an in-house hire {inHouseTotal}, so the hire costs {gap:abs} less, or {gapMonth:abs} a month. Below {breakEvenSpend} a month of ad spend, the agency would be cheaper." },
      { if: "gap < 0", text: "Over {months} months the agency costs {agencyTotal} and an in-house hire {inHouseTotal}, so the hire costs {gap:abs} less, or {gapMonth:abs} a month. The agency fee does not move with ad spend, so the gap stays the same at any spend." },
      { text: "Over {months} months the agency and an in-house hire both cost {agencyTotal}. Pick on skills, speed and control, since the money is the same." },
    ],
    [
      { if: "HAS(feeShareOfSpend)", text: "The agency's fee is {feeShareOfSpend} of your ad spend." },
    ],
  ],
  compare: { input: "adSpend", label: "At other ad spends", values: [10000, 20000, 50000], outputs: ["agencyMonth", "gap"] },
  next: [
    { slug: "seo-and-ai-search-agency-vetter", why: "Before you sign, check the agency's proposal for red flags and the questions to send." },
    { slug: "key-hire-gap-finder", why: "If you hire, make sure marketing is the gap that unblocks growth." },
    { if: "gap < 0", slug: "job-spec-writer", why: "Write the job so the right person applies." },
  ],
  sources: [
    { what: "In-house cost", how: "Salary plus the employer's extra costs and tools, plus a one-off cost to recruit and train. A standard fully loaded cost sum." },
    { what: "Ad spend where both cost the same", how: "(Hire a month + one-off ÷ months − retainer) ÷ the agency's share of spend. A standard break-even sum." },
  ],
  notes: [
    "Cost is one side. An agency brings several people and tools on day one; a hire brings focus and knows your business. Weigh both.",
    "Employment costs differ by country, so check the extra costs with an accountant.",
    "Your own time managing either choice is not counted. Add it to the monthly costs if you want it priced.",
  ],
};
