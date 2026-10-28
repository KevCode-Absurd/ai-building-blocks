// Attribution for AI Blocks' generated navigation. Source licences remain unchanged.
export const ADDED = 'We added Before you start and After this sections that link to other AI Blocks steps.';
export const REFRESHED = 'We refreshed those generated sections from the catalogue inputs and next-step links.';

export function generatedSectionCredit(yaml, refreshed = false) {
  let next = yaml;
  if (!next.includes(ADDED)) next = next.replace(/^(\s*used: )(["']?)(Copied|Shared) (as it is, )?(under [^\r\n]*?)(["']?)(\r?\n)/m,
    (_, lead, q1, verb, _asIs, rest, q2, end) => `${lead}${q1}${verb} ${rest} ${ADDED}${q2}${end}`);
  if (refreshed && next.includes(ADDED) && !next.includes(REFRESHED)) next = next.replace(ADDED, `${ADDED} ${REFRESHED}`);
  return next === yaml ? null : next;
}

function parts(text, nl) {
  const lines = text.split(/\r?\n/), body = [], notices = [];
  let fence = null, skipBlank = false;
  for (const line of lines) {
    const marker = line.trimStart().match(/^(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = { character: marker[1][0], length: marker[1].length };
      else if (marker[1][0] === fence.character && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      body.push(line); skipBlank = false; continue;
    }
    if (!fence && /^Changed by AI Blocks \(\d{4}-\d{2}-\d{2}\): /.test(line)) {
      notices.push(line); skipBlank = body.at(-1) === ''; continue;
    }
    if (skipBlank && line === '') { skipBlank = false; continue; }
    skipBlank = false; body.push(line);
  }
  return { body: body.join(nl).replace(/\s+$/, ''), notices };
}

export function apacheGeneratedNotice(text, nl, previous, date = new Date().toISOString().slice(0, 10)) {
  const { body, notices } = parts(text, nl);
  const previousBody = parts(previous, nl).body;
  const changed = body.replace(/\s+/g, ' ').trim() !== previousBody.replace(/\s+/g, ' ').trim();
  const notice = `Changed by AI Blocks (${date}): refreshed the generated Before you start and After this guidance from catalogue metadata.`;
  if ((changed || !notices.length) && !notices.includes(notice)) notices.push(notice);
  return body + nl + nl + notices.join(nl) + nl;
}
