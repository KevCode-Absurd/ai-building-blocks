// Original local utilities. Inputs are data: no evaluation, fetching or account writes.
import { parseCsv, csvToJson } from './csv-utils.mjs';

const define = (slug, short, category, summary, help, example, run, extension = 'txt') => ({ slug, short, category, summary, help, example, run, extension });
const lines = text => text.replace(/\r\n?/g, '\n').split('\n');
const csv = rows => rows.map(row => row.map(cell => {
  const text = String(cell ?? '');
  // Spreadsheet applications may execute formula-looking CSV cells. Prefix those cells.
  const safe = /^[\s]*[=+\-@]/u.test(text) ? "'" + text : text;
  return /[",\n\r]/u.test(safe) ? '"' + safe.replaceAll('"', '""') + '"' : safe;
}).join(',')).join('\r\n');
const table = text => {
  const rows = parseCsv(text);
  if (!rows.length || !rows[0].length) throw Error('Add a table with a header row.');
  if (rows.some(r => r.length !== rows[0].length)) throw Error('Every row must have the same number of cells.');
  return rows;
};
const object = text => {
  const x = JSON.parse(text);
  if (!x || typeof x !== 'object' || Array.isArray(x)) throw Error('Enter a JSON object.');
  return x;
};
const httpUrl = value => {
  const u = new URL(value);
  if (!['http:', 'https:'].includes(u.protocol)) throw Error('Use an absolute http or https URL.');
  if (u.username || u.password) throw Error('Remove account credentials from the URL.');
  return u;
};
const jsonText = value => JSON.stringify(value, null, 2);
function safeJson(text) {
  // Reject numbers that JSON.parse would round or turn into Infinity.
  const stripped = text.replace(/"(?:[^"\\]|\\.)*"/gs, '""');
  for (const token of stripped.match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g) ?? []) {
    const n = Number(token);
    const normalized = value => {
      const match = value.match(/^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      let digits = (match[2] + (match[3] ?? '')).replace(/^0+/, '');
      if (!digits) return match[1] + '0';
      let power = BigInt(match[4] ?? '0') - BigInt((match[3] ?? '').length);
      while (digits.endsWith('0')) { digits=digits.slice(0,-1);power++; }
      return `${match[1]}${digits}e${power}`;
    };
    if (!Number.isFinite(n) || normalized(token) !== normalized(JSON.stringify(n))) throw Error('Quote numbers whose exact digits cannot survive JSON conversion, including large identifiers or long decimals.');
  }
  return JSON.parse(text);
}
const exactNote = 'Comparisons are exact and case-sensitive. Empty lines are retained. Original input stays editable.';
export const NEXT_TOOLS = [
  define('duplicate-line-remover', 'Duplicate line remover', 'personal', 'Remove repeated lines while keeping the first occurrence and its original order.', exactNote, 'Alpha\nBeta\nAlpha\nGamma', text => [...new Set(lines(text))].join('\n')),
  define('line-sorter', 'Line sorter', 'personal', 'Put a list in deterministic character order while retaining repeated entries.', 'Sorts by Unicode code point. Numbers stay text, so 10 comes before 2. Empty lines sort first.', 'Pear\nApple\nBanana', text => lines(text).sort((a,b) => {
    const x=[...a],y=[...b];for(let i=0;i<Math.min(x.length,y.length);i++){const n=x[i].codePointAt(0)-y[i].codePointAt(0);if(n)return n;}return x.length-y.length;
  }).join('\n')),
  define('text-line-comparer', 'Text line comparer', 'work', 'Compare two texts and see added and removed lines, including repeated line counts.', 'Enter JSON with before and after strings. This compares line counts, not moved lines or character edits.', '{"before":"Review\nSend","after":"Review\nApprove\nSend"}'.replaceAll('\n', '\\n'), text => {
    const x = object(text); if (typeof x.before !== 'string' || typeof x.after !== 'string') throw Error('Provide before and after text strings.');
    const counts = s => { const m = new Map(); for (const l of lines(s)) m.set(l, (m.get(l) ?? 0)+1); return m; };
    const a = counts(x.before), b = counts(x.after), out = [];
    for (const l of new Set([...a.keys(), ...b.keys()])) { const n = (b.get(l) ?? 0)-(a.get(l) ?? 0); if(n) out.push(`${n > 0 ? '+' : '-'} ${Math.abs(n)} × ${l}`); }
    return out.join('\n') || 'No line-count differences.';
  }),
  define('csv-markdown-table', 'CSV to Markdown table', 'work', 'Turn a CSV table into a Markdown table with escaped pipes and visible line breaks.', 'The first row becomes headings. Each row must have the same width. Raw HTML is escaped.', 'Task,Owner\nReview,Alex\nShare,Sam', text => {
    const rows = table(text), esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\\','\\\\').replaceAll('|','\\|').replaceAll('\n','<br>');
    return [rows[0], rows[0].map(()=>'---'), ...rows.slice(1)].map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n');
  }, 'md'),
  define('json-array-to-csv', 'JSON to CSV converter', 'operations', 'Convert a JSON array of flat records to CSV with a complete heading list.', 'Use flat objects with string, number, boolean or null values. Quote large IDs. Formula-like CSV cells get a protective apostrophe.', '[{"id":"0012","name":"Alex"},{"id":"0013","name":"Sam","active":true}]', text => {
    const rows = safeJson(text); if (!Array.isArray(rows) || !rows.length || rows.some(r=>!r || typeof r!=='object' || Array.isArray(r))) throw Error('Enter a nonempty JSON array of objects.');
    const keys=[...new Set(rows.flatMap(Object.keys))]; if(!keys.length) throw Error('Records need at least one field.');
    for(const r of rows) if(Object.values(r).some(v=>v!==null && typeof v==='object')) throw Error('Nested objects or arrays need flattening before conversion.');
    return csv([keys,...rows.map(r=>keys.map(k=>Object.hasOwn(r,k) ? r[k] : ''))]);
  }, 'csv'),
  define('csv-column-profiler', 'CSV column profiler', 'operations', 'See missing cells, distinct values and sample values for every CSV column.', 'Uses exact text values. Whitespace-only cells count as missing. No automatic type conversion or quality score.', 'name,team\nAlex,Design\nSam,\nAlex,Design', text => {
    const rows=csvToJson(text); if(!rows.length) throw Error('Add at least one data row under unique headings.');
    return jsonText({rows:rows.length,columns:Object.keys(rows[0]).map(k=>({column:k,missing:rows.filter(r=>!r[k].trim()).length,distinct:new Set(rows.map(r=>r[k])).size,samples:[...new Set(rows.map(r=>r[k]))].slice(0,5)}))});
  }, 'json'),
  define('csv-transposer', 'CSV row and column swapper', 'operations', 'Swap the rows and columns of a rectangular CSV table.', 'All rows need the same width. Formula-like output cells get a protective apostrophe before spreadsheet use.', 'Metric,January,February\nOrders,10,12\nReturns,1,2', text => { const rows=table(text); return csv(rows[0].map((_,i)=>rows.map(r=>r[i]))); }, 'csv'),
  define('csv-duplicate-row-remover', 'CSV duplicate row remover', 'operations', 'Remove exact repeated CSV records while keeping headings and first-seen order.', 'Comparison uses every cell exactly as written. Formula-like output cells get a protective apostrophe.', 'name,team\nAlex,Design\nAlex,Design\nSam,Support', text => { const [head,...rows]=table(text), seen=new Set(); return csv([head,...rows.filter(r=>{const key=JSON.stringify(r);if(seen.has(key))return false;seen.add(key);return true;})]); }, 'csv'),
  define('tsv-to-csv', 'TSV to CSV converter', 'operations', 'Convert a plain tab-separated table to CSV with quoted output cells.', 'Plain TSV only: tabs separate cells and newlines separate rows. Quoted multiline TSV is unsupported. Formula-like cells are protected.', 'name\tteam\nAlex\tDesign\nSam\tSupport', text => {
    const rows=lines(text); if(rows.at(-1)==='')rows.pop(); const cells=rows.map(r=>r.split('\t'));
    if(!cells.length || cells.some(r=>r.length!==cells[0].length))throw Error('Use a rectangular plain TSV table.');
    if(cells.some(r=>r.some(c=>c.includes('"'))))throw Error('Quoted TSV is unsupported. Use unquoted plain TSV.'); return csv(cells);
  }, 'csv'),
  define('json-lines-validator', 'JSON Lines validator', 'operations', 'Check each nonempty line as JSON and report its line number and value type.', 'Blank lines are errors in JSON Lines. A final newline is allowed. Values are inspected locally and never executed.', '{"id":1}\n{"id":2}', text => {
    const rows=lines(text); if(rows.at(-1)==='')rows.pop(); if(!rows.length) throw Error('Add at least one JSON value.');
    return rows.map((line,i)=>{try{const x=JSON.parse(line);return `Line ${i+1}: valid ${x===null?'null':Array.isArray(x)?'array':typeof x}`;}catch{throw Error(`Line ${i+1} is not valid JSON.`);}}).join('\n');
  }),
  define('json-array-to-json-lines', 'JSON array to JSON Lines', 'operations', 'Put each JSON array entry on its own line for logs and data imports.', 'Quote large identifiers to preserve precision. Nested values remain inside their own entry.', '[{"name":"Alex"},{"name":"Sam"}]', text => { const x=safeJson(text);if(!Array.isArray(x))throw Error('Enter a JSON array.');return x.map(v=>JSON.stringify(v)).join('\n'); }, 'jsonl'),
  define('json-path-inventory', 'JSON path inventory', 'operations', 'List JSON Pointer paths and value types without copying values into the result.', 'Uses RFC 6901 pointer escaping. The empty string is the root. Maximum nesting depth is 100.', '{"project":{"owner":"Alex"},"tasks":["Review","Share"]}', text => {
    const x=JSON.parse(text), result=[];const visit=(v,p,d)=>{if(d>100)throw Error('JSON nesting exceeds 100 levels.');result.push({pointer:p,type:v===null?'null':Array.isArray(v)?'array':typeof v});if(v&&typeof v==='object')for(const [k,z] of Object.entries(v))visit(z,p+'/'+k.replaceAll('~','~0').replaceAll('/','~1'),d+1);}; visit(x,'',0);return jsonText(result);
  }, 'json'),
  define('url-query-inspector', 'URL query inspector', 'operations', 'Read a URL’s host, path, fragment and query values, including repeated keys.', 'Use an absolute http or https URL without credentials. This tool does not visit the URL.', 'https://example.com/search?tag=design&tag=work&q=hello%20world#results', text => {const u=httpUrl(text.trim());return jsonText({origin:u.origin,path:u.pathname,query:[...u.searchParams].map(([key,value])=>({key,value})),fragment:u.hash.slice(1)});}, 'json'),
  define('url-query-builder', 'URL query builder', 'operations', 'Add encoded query parameters to a web URL while preserving repeated values.', 'Enter JSON with url and params. Params is an object of text or arrays of text. Supplied keys replace existing values.', '{"url":"https://example.com/search","params":{"q":"design & work","tag":["guide","sample"]}}', text => {
    const x=object(text), u=httpUrl(x.url); if(!x.params || typeof x.params!=='object' || Array.isArray(x.params))throw Error('Provide a params object.');
    for(const [k,v] of Object.entries(x.params)){const vals=Array.isArray(v)?v:[v];if(vals.some(z=>typeof z!=='string'))throw Error('Parameter values must be strings or arrays of strings.');u.searchParams.delete(k);for(const z of vals)u.searchParams.append(k,z);}return u.href;
  }),
  define('utm-link-builder', 'UTM campaign link builder', 'ads', 'Build a campaign URL with source, medium and campaign names you supply.', 'Enter JSON with url, source, medium and campaign; content and term are optional. This creates a link, without visiting or publishing it.', '{"url":"https://example.com/guide","source":"newsletter","medium":"email","campaign":"autumn-guide"}', text => {
    const x=object(text),u=httpUrl(x.url);for(const k of ['source','medium','campaign'])if(typeof x[k]!=='string'||!x[k].trim())throw Error(`Add a nonempty ${k}.`);
    for(const k of ['source','medium','campaign','term','content'])if(x[k]!==undefined){if(typeof x[k]!=='string')throw Error(`${k} must be text.`);u.searchParams.set('utm_'+k,x[k].trim());}return u.href;
  }),
  define('url-list-deduplicator', 'URL list deduplicator', 'ads', 'Normalize web URLs and remove exact normalized duplicates from a link list.', 'One absolute URL per line. Preserves queries, fragments and path case; lowercases hosts and normalizes default ports. Links are not visited.', 'https://EXAMPLE.com:443/guide\nhttps://example.com/guide\nhttps://example.com/about', text => [...new Set(lines(text).filter(s=>s.trim()).map((s,i)=>{try{return httpUrl(s.trim()).href;}catch{throw Error(`Check URL on nonempty line ${i+1}.`);}}))].join('\n')),
  define('unicode-character-inspector', 'Unicode character inspector', 'design', 'See Unicode code points, invisible whitespace and character counts in pasted text.', 'Lists Unicode code points, not visual grapheme clusters. Inspection is limited to 10,000 code points.', 'Hello\u00a0world 👋', text => {const chars=[...text];if(chars.length>10000)throw Error('Use at most 10,000 code points.');return chars.map((c,i)=>`${i+1}\tU+${c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}\t${JSON.stringify(c)}`).join('\n');}),
  define('html-text-escaper', 'HTML text escaper', 'design', 'Escape text for display inside an HTML text node without interpreting markup.', 'Escapes ampersands, angle brackets and both quote styles. This is text escaping, not an HTML sanitizer or URL validator.', '<p title="Example">Design & work</p>', text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')),
  define('markdown-heading-outline', 'Markdown heading outline', 'work', 'Extract a heading outline from Markdown while ignoring fenced code examples.', 'Supports ATX headings beginning with 1–6 hash marks. Setext headings and HTML are outside this check.', '# Report\n\n## Findings\n\n### Evidence\n\n## Next steps', text => {
    const out=[];let fence=null;for(const line of lines(text)){const f=line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);if(f){if(!fence)fence={c:f[1][0],n:f[1].length};else if(f[1][0]===fence.c&&f[1].length>=fence.n&&!f[2].trim())fence=null;continue;}if(fence)continue;const m=line.match(/^\s{0,3}(#{1,6})[ \t]+(.+?)\s*$/);if(m)out.push('  '.repeat(m[1].length-1)+'- '+m[2].replace(/[ \t]+#+[ \t]*$/,''));}return out.join('\n')||'No ATX headings found.';
  }),
  define('markdown-link-inventory', 'Markdown link inventory', 'work', 'List inline Markdown link labels and destinations for a manual source review.', 'Basic inline links only, with destinations without spaces or parentheses. Reference links and code are not fully parsed. No availability check is performed.', '[Source](https://example.com/report)\n[Appendix](./appendix.md)', text => jsonText([...text.matchAll(/(?<!!)\[([^\]\n]+)\]\(([^\s()]+)\)/g)].map(m=>({label:m[1],destination:m[2]}))), 'json'),
  define('plain-list-to-checklist', 'List to Markdown checklist', 'personal', 'Turn one task per line into an editable Markdown checklist.', 'Removes existing bullet or checkbox prefixes. Empty lines are ignored. Tasks are never marked complete automatically.', 'Review the brief\n- Check the figures\nShare the draft', text => lines(text).map(s=>s.trim()).filter(Boolean).map(s=>'- [ ] '+s.replace(/^(?:[-*+]\s+(?:\[[ xX]\]\s*)?|\d+[.)]\s+)/,'')).join('\n'), 'md'),
  define('reading-session-scheduler', 'Reading session scheduler', 'personal', 'Split a reading list into sessions using your reading speed and available minutes.', 'Enter JSON with wordsPerMinute, minutesPerSession and items: each has title and words. Assumes sequential reading; setup and breaks use separate time.', '{"wordsPerMinute":200,"minutesPerSession":20,"items":[{"title":"Chapter 1","words":3000},{"title":"Chapter 2","words":5500}]}', text => {
    const x=object(text), cap=x.wordsPerMinute*x.minutesPerSession;if(!Number.isFinite(cap)||cap<=0||!Number.isFinite(x.wordsPerMinute)||x.wordsPerMinute<=0||!Number.isFinite(x.minutesPerSession)||x.minutesPerSession<=0||!Array.isArray(x.items)||!x.items.length)throw Error('Provide positive reading speed, session minutes and a nonempty items array.');
    if(x.items.some(i=>typeof i.title!=='string'||!i.title.trim()||!Number.isSafeInteger(i.words)||i.words<0))throw Error('Each item needs a title and a nonnegative safe whole-word count.');
    const total=x.items.reduce((s,i)=>s+i.words,0);if(!Number.isSafeInteger(total)||Math.ceil(total/cap)>10000||!Number.isFinite(total/x.wordsPerMinute))throw Error('Use a finite reading duration that fits within 10,000 sessions.');
    let session=1,used=0;const out=[];for(const i of x.items){let left=i.words;while(left>0){const take=Math.min(left,cap-used);out.push({session,title:i.title,words:take,minutes:take/x.wordsPerMinute});left-=take;used+=take;if(used>=cap){session++;used=0;}}}return jsonText({totalWords:total,totalMinutes:total/x.wordsPerMinute,sessions:out});
  }, 'json'),
  define('time-log-summarizer', 'Time log summarizer', 'work', 'Total logged minutes by project and show each project’s share of recorded time.', 'CSV headings project,minutes. Minutes must be finite and nonnegative. This summarizes your records without estimating unlogged time.', 'project,minutes\nResearch,45\nWriting,60\nResearch,30', text => {
    const rows=csvToJson(text), totals=new Map();if(!rows.length)throw Error('Add at least one logged row.');for(const r of rows){const n=Number(r.minutes);if(!r.project?.trim()||!r.minutes?.trim()||!Number.isFinite(n)||n<0)throw Error('Use project,minutes headings and nonnegative numeric minutes.');const t=(totals.get(r.project)??0)+n;if(!Number.isFinite(t))throw Error('Minutes are too large.');totals.set(r.project,t);}const total=[...totals.values()].reduce((a,b)=>a+b,0);if(!Number.isFinite(total))throw Error('Total minutes are too large.');return jsonText({totalMinutes:total,projects:[...totals].map(([project,minutes])=>({project,minutes,hours:minutes/60,sharePercent:total?100*(minutes/total):0}))});
  }, 'json'),
  define('meeting-action-register', 'Meeting action register', 'work', 'Turn explicit meeting actions into a table that flags missing owners and due dates.', 'CSV headings action,owner,due,status. Dates use YYYY-MM-DD or stay empty. Ownership comes from your input, not inference; nothing is sent or scheduled.', 'action,owner,due,status\nReview draft,Alex,2026-10-30,open\nConfirm budget,,,open', text => {
    const rows=csvToJson(text);if(!rows.length)throw Error('Add at least one action.');return jsonText(rows.map((r,i)=>{if(!['action','owner','due','status'].every(k=>Object.hasOwn(r,k))||!r.action.trim())throw Error('Use action,owner,due,status headings and a nonempty action.');if(r.due&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.due)||!Number.isFinite(Date.parse(r.due))||new Date(r.due).toISOString().slice(0,10)!==r.due))throw Error(`Check the due date on row ${i+2}.`);return {...r,id:i+1,missing:[...(!r.owner.trim()?['owner']:[]),...(!r.due?['due date']:[])]};}));
  }, 'json'),
  define('csv-column-selector', 'CSV column selector', 'operations', 'Keep and reorder chosen CSV columns without changing cell text.', 'Enter JSON with csv text and a columns array of exact header names. Headers must be unique. Formula-like output cells are protected.', '{"csv":"name,team,id\\nAlex,Design,0012\\nSam,Support,0013","columns":["id","name"]}', text => {
    const x=object(text);if(typeof x.csv!=='string'||!Array.isArray(x.columns)||!x.columns.length||x.columns.some(k=>typeof k!=='string')||new Set(x.columns).size!==x.columns.length)throw Error('Provide csv text and a nonempty array of distinct column names.');const [head,...rows]=table(x.csv);if(new Set(head).size!==head.length||head.some(k=>!k.trim()))throw Error('Use unique nonempty CSV headings.');const indices=x.columns.map(k=>{const i=head.indexOf(k);if(i<0)throw Error(`Unknown column: ${k}`);return i;});return csv([x.columns,...rows.map(r=>indices.map(i=>r[i]))]);
  }, 'csv'),
];

export function runNextTool(slug, input) {
  const tool = NEXT_TOOLS.find(t=>t.slug===slug);
  if (!tool) throw Error('Unknown utility.');
  if (input.length > 1_000_000) throw Error('Use at most 1,000,000 characters per input.');
  return tool.run(input);
}
