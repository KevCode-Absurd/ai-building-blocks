/** Who an item is for. "owner": a small business owner, marketer or freelancer can use it as it is. "specialist":
 *  it needs a developer, engineer, investor or researcher (code, servers, valuation models, academic papers).
 *  Specialist items stay findable; search ranks owner items first unless the request is a specialist's.
 *  Reviewed exceptions live in catalogue-items/classification.yaml under `audience:` and reach each block as
 *  `block.audience`; everything else follows its job. No network, no model. */
export const SPECIALIST_TASKS = new Set([
  'build-software', 'test-and-fix-code', 'ship-and-host', 'secure-code', 'engineer-systems', 'manage-it',
  'connect-tools', 'make-skills', 'money-and-investing', 'research-topics',
]);
/** Item ids that belong to a developer tool family. */
const SPECIALIST_PREFIX = /^(?:copilot|github|kubernetes|terraform|aws|azure|gcp|docker|postgres|mysql|mongodb|redis|react|nextjs|vue|angular|svelte|django|flask|rails|laravel|rust|golang|python|typescript|javascript|java|kotlin|swift|dotnet|csharp)-/;

/** @param {{slug: string, task?: string, audience?: string}} block */
export function audienceOf(block) {
  if (block.audience === 'owner' || block.audience === 'specialist') return block.audience;
  return SPECIALIST_TASKS.has(block.task ?? '') || SPECIALIST_PREFIX.test(block.slug) ? 'specialist' : 'owner';
}

/** A request in a specialist's words: code, servers, data engineering, investing or academic research. */
export const SPECIALIST_REQUEST = /\b(?:code|coding|codebase|repo|repository|api|apis|sdk|cli|developer|developers|engineer\w*|devops|deploy\w*|docker|kubernetes|k8s|terraform|aws|azure|gcp|server\w*|database\w*|sql|postgres\w*|python|javascript|typescript|react|node|rust|golang|java|kotlin|swift|bug|bugs|debug\w*|test suite|unit tests?|pull requests?|git|github|copilot|mcp|llm|model training|fine.tun\w*|invest\w*|valuation|dcf|stocks?|portfolio|equity|academic|literature review|research papers?|thesis|dissertation|scientific|firmware|circuit|pcb|antenna)\b/i;
