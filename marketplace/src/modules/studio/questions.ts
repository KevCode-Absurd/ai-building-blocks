// The interview question bank, built per job type. Owner: studio module.
// Adapted from the guided interview in site/src/agents/expert-agent-capture.mjs (case, procedure, decision,
// counterfactual, uncertainty, critique), rewritten in plain words and tied to the job type's own checklist.
import type { JobType } from "../../core/types.ts";

export interface BankQuestion {
  id: string;
  text: string;
  help: string;
  required: boolean;
}

/** Follow-up the interviewer may ask when an answer is thin (used by the fake and as a hint to the live model). */
export const FOLLOW_UP_HINTS: Record<string, string> = {
  case: "What did the finished work look like, and how did the client react to it?",
  method: "Which step takes you the longest, and what do you do in it that others skip?",
  quality_bar: "Which of those checks catches the most problems before you send the work?",
  great_terrible: "Can you describe one line from great work and one line from terrible work?",
  decisions: "Give one example of a brief where that fact changed your plan. What did you do differently?",
  red_lines: "If a client pushed for it anyway, what would you offer them instead?",
  missing_info: "Which missing fact makes you stop and ask before you start?",
  counterfactual: "What is the first sign that tells you a job is that kind of case?",
};

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function questionBank(jt: JobType): BankQuestion[] {
  const job = lower(jt.title);
  const core: BankQuestion[] = [
    {
      id: "case", required: true,
      text: `Think of one real ${job} job you did. Who was it for, what did they need, and what did they give you to start with?`,
      help: "Pick a typical job, not your best one. Leave out client names and private details.",
    },
    {
      id: "method", required: true,
      text: "Walk through how you did that job, step by step. What did you look at first, what came next, and what did you check before you sent it?",
      help: "Number the steps if it helps. This becomes your agent's method.",
    },
    {
      id: "quality_bar", required: true,
      text: `What must be true before a ${job} is good enough to send? List the checks you always make.`,
      help: "Your agent checks its own work against this list before anyone sees it.",
    },
    {
      id: "great_terrible", required: true,
      text: `What does great ${job} look like, and what does terrible ${job} look like? What is the biggest difference?`,
      help: "Be specific. Describe the words, the structure or the choices, not just the feeling.",
    },
    {
      id: "decisions", required: true,
      text: "Which facts in a brief change how you do the work? What would someone with less experience miss?",
      help: "For example the reader, the price, the deadline or the stage of the business.",
    },
    {
      id: "red_lines", required: true,
      text: "What would you never write or do in this job, even if a client asked for it?",
      help: `These become hard rules for your agent. This job already rules out: ${jt.not_for.join("; ")}.`,
    },
    {
      id: "missing_info", required: true,
      text: "When a brief leaves out something important, what do you do? Which gaps do you fill yourself, and which do you ask about?",
      help: "Buyers often skip details. Your agent needs to know when to assume and when to flag.",
    },
    {
      id: "counterfactual", required: false,
      text: "Go back to the job from the first question. If one key fact had been different, when would you have done the opposite?",
      help: "This teaches your agent where your rules stop working.",
    },
  ];
  // Job-type questions: the checklist items buyers care about most (critical first, then by weight), at most three.
  const top = [...jt.rubric]
    .sort((a, b) => Number(b.critical) - Number(a.critical) || b.weight - a.weight)
    .slice(0, 3)
    .map((c): BankQuestion => ({
      id: `rubric_${c.id}`, required: false,
      text: `Buyers check this before they accept the work: "${c.text}" How do you make sure your work passes?`,
      help: "Say what you do, and what you look for when you check.",
    }));
  return [...core, ...top];
}
