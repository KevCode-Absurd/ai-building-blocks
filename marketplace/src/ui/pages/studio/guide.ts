// What each studio step asks of the expert, how long it takes, and what happens next. Plain words, grade 8 to 9.
import type { AgentSummary, StepId } from "../../../modules/studio/service.ts";

export interface StepGuide { n: number; title: string; time: string; todo: string; next: string }

export const STEP_ORDER: StepId[] = ["interview", "examples", "markup", "build", "test", "publish"];

export const GUIDE: Record<StepId, StepGuide> = {
  interview: {
    n: 1, title: "Interview", time: "About 3 to 5 hours. Stop and come back whenever you like.",
    todo: "Answer questions about how you do this job. The interviewer may ask one follow-up after an answer. Then we draft your playbook from your answers, and you edit it until it sounds like you.",
    next: "Your playbook becomes your agent's method: the steps it follows and the bar it checks against.",
  },
  examples: {
    n: 2, title: "Examples", time: "About 2 to 3 hours.",
    todo: "Add 3 to 5 pieces of past work. For each one, paste the brief, say who it was for, and paste the finished work. Confirm you have the right to use it.",
    next: "Your agent learns your structure and choices from them. Buyers never see them, and your agent never copies them.",
  },
  markup: {
    n: 3, title: "Mark up plain AI", time: "About 1 hour.",
    todo: "We ask plain AI to do one of this job's sample briefs. Select each passage you would never send to a client, and say why.",
    next: "Your reasons become rules. The passages become things your agent must avoid.",
  },
  build: {
    n: 4, title: "Build", time: "About 15 minutes, plus a minute or two to build.",
    todo: "Build a version of your agent from your playbook, examples and markup. Then read its rules and checklist.",
    next: "You get a draft version to try on the test bench. You can rebuild as often as you need.",
  },
  test: {
    n: 5, title: "Test bench", time: "About 4 to 6 hours, over a few rounds.",
    todo: "Run your agent on the sample briefs, next to plain AI. Edit your agent's drafts the way you would, and say why. Approve the rules we suggest from your edits, then rebuild.",
    next: "Approved rules go into your next version. Repeat until you would send its drafts to a client.",
  },
  publish: {
    n: 6, title: "Publish", time: "About 10 minutes.",
    todo: "Publish the version you are happy with. A published version can never change, so every job it does can be traced back to it.",
    next: "Your agent moves to testing. The AI Blocks team checks it, puts it live, and emails you.",
  },
};

export const STATUS: Record<AgentSummary["status"], { label: string; tone: "neutral" | "info" | "good" | "bad"; text: string }> = {
  draft: { label: "Draft", tone: "neutral", text: "Not published yet. Only you can see it." },
  testing: { label: "Testing", tone: "info", text: "Published. The AI Blocks team is checking it before buyers can hire it." },
  live: { label: "Live", tone: "good", text: "Live. Buyers who hire for this job can be matched with it." },
  retired: { label: "Retired", tone: "bad", text: "Taken off the marketplace. Buyers are not matched with it." },
};
