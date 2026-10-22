// Structural regression cases across topics beyond the earlier 20-case study.
// These assert routing/coverage contracts, not human-rated deliverable quality.
export const GENERAL_CASES = [
  { id: "wedding-budget", goal: "Create a wedding budget with editable cost categories and unknown prices left blank", general: true, excludes: ["ad-test-budget", "brand.*budget"] },
  { id: "travel", goal: "Write a travel itinerary for a three-day family trip", general: true, excludes: ["company-policy-explainer"] },
  { id: "volunteers", goal: "Make a volunteer schedule using availability I will supply", general: true, excludes: ["accrual", "email-cadence"] },
  { id: "fundraiser", goal: "Organize a school fundraiser with a plan and responsibilities", general: true, excludes: ["vocabulary-tier"] },
  { id: "moving", goal: "Create an apartment moving checklist with a packing timeline", general: true },
  { id: "garden", goal: "Prepare a vegetable garden planting calendar for my location", general: true },
  { id: "club", goal: "Draft a neighborhood book club constitution", general: true },
  { id: "pet-care", goal: "Write pet care instructions for a cat sitter", general: true },
  { id: "seating", goal: "Design an office seating plan from a supplied floor map", general: true },
  { id: "science-fair", goal: "Draft a science fair parent invitation letter", general: true },
  { id: "incident", goal: "Create an incident response runbook", includes: ["incident-runbook-writer", "request-acceptance-checker"] },
  { id: "faq", goal: "Draft a product FAQ from verified product facts", includes: ["request-acceptance-checker"] },
  { id: "grant", goal: "Prepare a grant proposal", includes: ["request-acceptance-checker"] },
  { id: "compound-and", goal: "Draft a product FAQ and create an incident response runbook", includes: ["incident-runbook-writer", "hard-questions-faq-writer"] },
  { id: "compound-plus", goal: "Prepare a grant proposal plus create a wedding budget", general: true, includes: ["request-deliverable-drafter"] },
  { id: "negative-landing", goal: "Write a travel itinerary; do not build a landing page", general: true, excludes: ["landing-page", "seo"] },
  { id: "negative-email", goal: "Don't send emails but create a volunteer schedule", general: true, excludes: ["email"] },
  { id: "newline", goal: "Draft a product FAQ\nCreate an incident response runbook", includes: ["incident-runbook-writer", "hard-questions-faq-writer"] },
  { id: "specialist-plus-general", goal: "Build a landing page and create a wedding budget", general: true, includes: ["react-landing-page-builder", "request-deliverable-drafter"] },
  { id: "general-plus-specialist", goal: "Create a wedding budget and build a landing page", general: true, includes: ["react-landing-page-builder", "request-deliverable-drafter"] },
];
