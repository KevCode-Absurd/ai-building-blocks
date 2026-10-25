// Matching uses the requested task; the full request still travels with the pack.
export function taskFocus(request: string): string {
  let focus = request.trim();
  const lead = /^(?:(?:hi|hello|hey)[,!.]?\s+|please\s+|(?:i|we)\s+(?:(?:would|d)['’]?\s+like|want|need)\s+(?:you\s+)?(?:to\s+)?|(?:can|could|would|will)\s+you\s+|help\s+(?:me|us)\s+(?:to\s+)?|(?:also|then)\s+)/i;
  while (lead.test(focus)) focus = focus.replace(lead, "").trim();
  // These phrases describe the business, not another requested deliverable.
  // Do not strip arbitrary "for ..." text: it can be essential subject matter.
  const business = /\s+(?:for|of|at|in)\s+(?:my|our|the|an?|this)\s+(?:(?:e[ -]?commerce|online|retail|small)\s+)*(?:store|shop|business|company)\b.*$/i;
  const task = focus.replace(business, "").trim();
  return (task || focus).replace(/\b(?:e[ -]?commerce|online\s+(?:store|shop))\b/gi, "store");
}

export function isReviewRequest(request: string): boolean {
  return /^(?:audit|check|review|test|evaluate|assess|critique|analy[sz]e|inspect)\b/i.test(taskFocus(request));
}
