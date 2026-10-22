/** Editorial starting points, not claims of audience-wide suitability or model testing. */
export const AUDIENCE_STARTERS = [
  {
    id: "students", name: "Students",
    goal: "Learn a topic, check your understanding or prepare an application.",
    bring: "Your syllabus or notes, what you already know, your deadline and the rules for AI use on your course.",
    slugs: ["topic-learning-roadmap", "study-understanding-check", "research-paper-reading-guide", "research-paper-evidence-review", "research-literature-comparison", "exam-study-roadmap-builder", "adaptive-tutor", "resume-job-application-builder"],
  },
  {
    id: "workers", name: "Workers",
    goal: "Prepare meetings, turn notes into actions and make clearer documents.",
    bring: "The source notes or files, who will use the result, its due date and what you may share with your AI tool.",
    slugs: ["executive-meeting-brief", "executive-action-register", "executive-email-draft", "executive-daily-digest", "plain-english-editor", "spreadsheet-checker", "set-up-a-documentation-system-and-write-sops-that-pass-a-check", "resume-job-application-builder"],
  },
  {
    id: "small-businesses", name: "Small businesses",
    goal: "Handle customer replies, invoices and the work you repeat every week.",
    bring: "Your offer, approved policies, actual sales or invoice data, your budget and an example of the result you need.",
    slugs: ["website-brand-brain-builder", "invoice-checker", "get-a-late-invoice-paid-and-keep-the-customer", "angry-customer-reply-checker", "solved-ticket-help-page-writer", "set-up-a-documentation-system-and-write-sops-that-pass-a-check", "vendor-comparison-writer", "recurring-kpi-report-maker"],
  },
  {
    id: "enterprise", name: "Enterprise teams",
    goal: "Review policies, suppliers and processes with evidence and named reviewers.",
    bring: "Approved source documents, their owner and date, your access and retention rules, and the person who signs off the result.",
    slugs: ["company-policy-explainer", "vendor-risk-reviewer", "vendor-scorecard-builder", "ai-vendor-terms-checker", "procurement-agent-architecture-plan", "people-risk-register-builder", "set-up-a-documentation-system-and-write-sops-that-pass-a-check", "data-quality-scorecard-maker"],
  },
  {
    id: "startups", name: "Startups",
    goal: "Test an idea, plan runway and prepare a product or investor brief.",
    bring: "Your customer evidence, stage, actual costs and cash, target outcome and the assumptions you still need to test.",
    slugs: ["startup-idea-tester", "startup-canvas-builder", "startup-runway-forecaster", "startup-financial-model-builder", "investor-pitch-scriptwriter", "startup-metrics-picker", "customer-onboarding-planner", "research-paper-evidence-review"],
  },
] as const;

export const WORK_STARTERS = [
  {
    id: "presentations", name: "Presentations and slide decks",
    goal: "Turn sourced content into a deck you can edit and present.",
    bring: "Your source material, audience, purpose, time limit, slide count and required file format. Check every rendered slide before sharing.",
    slugs: ["storyboard-to-powerpoint-deck-builder", "editable-slide-deck-builder", "presentation-builder", "html-slide-deck-maker", "markdown-slide-deck-maker", "conference-talk-slide-maker", "board-deck-builder", "finance-deck-quality-checker"],
  },
  {
    id: "case-competitions", name: "Case competitions and case studies",
    goal: "Build a clear recommendation, supporting analysis and slides for questions.",
    bring: "The case brief, judging rubric, source data, team analysis, presentation limits and competition rules for AI use. Keep practice figures labelled.",
    slugs: ["case-competition-slide-deck-builder", "case-first-story-builder", "competitor-landscape-deck", "financial-model-builder", "pitch-arc-planner", "editable-slide-deck-builder", "finance-deck-quality-checker", "plain-english-editor"],
  },
  {
    id: "research-documents", name: "Research papers and documents",
    goal: "Draft from your findings, check citations and prepare a document for review.",
    bring: "Your research question, actual findings, permitted sources, citation style, required sections and academic or workplace AI rules. Verify every citation and never invent results.",
    slugs: ["research-paper-writer", "research-paper-evidence-review", "research-literature-comparison", "citation-and-bibtex-fixer", "research-paper-figure-maker", "document-file-generator", "libreoffice-document-builder", "case-first-story-builder"],
  },
  {
    id: "equity-research", name: "Stock valuation and equity research",
    goal: "Build a sourced company report and test how valuation changes with assumptions.",
    bring: "The ticker and exchange, research cutoff, price timestamp, currency, annual and quarterly filings, share count and valuation assumptions. Reconcile units, periods and enterprise-to-equity value.",
    slugs: ["equity-research-valuation-report-builder", "company-fair-value-modeler", "company-stock-analyst", "financial-statement-analyst", "cost-of-capital-calculator", "valuation-method-comparer", "dcf-model-builder-for-india", "earnings-recap-writer"],
  },
] as const;

export const STARTER_PATHS = [...AUDIENCE_STARTERS, ...WORK_STARTERS];
export const starterFor = (id: string) => STARTER_PATHS.find(a => a.id === id);
export const isAudienceStarter = (slug: string, id: string) => !id || !!starterFor(id)?.slugs.some(s => s === slug);
export const starterTemplate = (id: string) => id === "equity-research" ? "/templates/equity-research-brief.txt" : id === "research-documents" ? "/templates/research-writing-brief.txt" : ["presentations", "case-competitions"].includes(id) ? "/templates/presentation-brief.txt" : "/templates/work-context.txt";
