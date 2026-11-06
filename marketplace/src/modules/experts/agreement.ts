// The founding expert agreement, in plain words. A DRAFT: counsel reviews it before payouts start.
// Only the points from the business plan are here. Do not add legal terms without counsel.

export interface AgreementSection { id: string; heading: string; body: string }
export interface Agreement {
  version: string;
  status: "draft";
  title: string;
  draft_notice: string;
  sections: AgreementSection[];
}

export function foundingAgreement(version: string, rates: { standard: number; founding: number; foundingLimit: number; takedownDays: number }): Agreement {
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  return {
    version,
    status: "draft",
    title: "Founding expert agreement (draft)",
    draft_notice: "This is a draft in plain words. A lawyer will review it before any payouts start, and the final wording may change. Hiring is free for buyers right now, so there is nothing to pay out.",
    sections: [
      {
        id: "ownership",
        heading: "Your method stays yours",
        body: "You keep ownership of your method and your examples. Joining does not hand them over to AI Blocks.",
      },
      {
        id: "use",
        heading: "How we use your agent",
        body: "AI Blocks may run your agent for buyers. We may show results from your agent's work with the buyer's details taken out.",
      },
      {
        id: "earnings",
        heading: "What you earn",
        body: `Hiring is free for buyers right now, so there is no pay yet. If we add paid work later, you earn ${pct(rates.standard)} of the net amount from jobs on the platform. The first ${rates.foundingLimit} approved experts get a founding rate of ${pct(rates.founding)}.`,
      },
      {
        id: "confidential",
        heading: "Buyer data stays private",
        body: "Buyer data stays confidential.",
      },
      {
        id: "ending",
        heading: "Either side can end it",
        body: `You or AI Blocks can end this agreement. When it ends, your agent comes down within ${rates.takedownDays} days.`,
      },
    ],
  };
}
