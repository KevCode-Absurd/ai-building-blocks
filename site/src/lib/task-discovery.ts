/** Reviewed everyday phrases. These mappings aid discovery; they never claim a task has run. */
export type TaskStarter = { slug: string; name: string; give: string; get: string; match: RegExp; example?: string; exampleLabel?: string };
export const TASK_STARTERS: readonly TaskStarter[] = [
  { slug: "rough-notes-to-minutes-writer", name: "Tidy meeting notes", give: "Rough notes or a transcript", get: "Decisions, action items and open questions", exampleLabel: "Example notes", example: "We agreed to use the plain draft. The project lead will send it for review. The due date is still open.", match: /\b(meeting (notes|minutes)|tidy (my )?notes|notes (to|into) minutes|summari[sz]e (a |my |the )?meeting)\b/i },
  { slug: "plain-english-editor", name: "Make a draft clearer", give: "Your draft", get: "A clear rewrite that keeps your meaning", exampleLabel: "Example draft", example: "We are reaching out to inform you that the team is in the process of reviewing your request. We will get back to you when the review is complete.", match: /\b(plain (english|words)|make (this|my draft|it) (easier to read|clearer)|clearer (draft|writing)|simplify (this|my writing)|remove jargon)\b/i },
  { slug: "executive-email-draft", name: "Draft an email reply", give: "An email thread and your goal", get: "A reply draft and facts to check", match: /\b((draft|write) (an? |my )?(email|reply)|email reply|reply to (an? |this )?email)\b/i },
  { slug: "landing-page-30-point-checker", name: "Review a landing page", give: "Your landing page", get: "A checklist of issues to review", match: /\b((review|check|audit) (my |a |the )?(landing page|sales page)|landing page (review|audit|check))\b/i },
];

export function reviewedTask(query: string) {
  return TASK_STARTERS.find(task => task.match.test(query.trim()));
}
