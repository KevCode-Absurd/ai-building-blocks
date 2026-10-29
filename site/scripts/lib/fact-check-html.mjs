import {factCheckView} from '../../src/lib/fact-checks.ts';
export function factCheckHtml(checks,esc){
  if(!Array.isArray(checks)||!checks.length)return '';
  const rows=checks.map(check=>({check,view:factCheckView(check)}));
  return `<details class="task-more fact-checks"><summary>Source dates and checks${rows.some(row=>row.view.needsCheck)?'<span class="small"> · details need a check</span>':''}</summary><p class="small">Each record covers the named details. Review the full instructions and current sources before using changing rules or APIs.</p><ul>${rows.map(({check,view})=>`<li><strong>${esc(view.label)}</strong><p>${esc(check.scope)}</p>${view.notes.length?`<p class="small">${esc(view.notes.join(' '))}</p>`:''}<p class="small">${check.sources.map((url,n)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Source ${n+1}</a>`).join(' · ')}</p></li>`).join('')}</ul></details>`;
}
