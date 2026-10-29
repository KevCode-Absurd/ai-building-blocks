import {factCheckView,type FactCheck} from './lib/fact-checks';

export default function FactCheckNotes({checks}:{checks?:FactCheck[]}) {
  if(!checks?.length)return null;
  const rows=checks.map(check=>({check,view:factCheckView(check)}));
  return <details className="task-more fact-checks" data-testid="fact-checks">
    <summary>Source dates and checks{rows.some(row=>row.view.needsCheck)&&<span className="small"> · details need a check</span>}</summary>
    <p className="small">Each record covers the named details. Review the full instructions and current sources before using changing rules or APIs.</p>
    <ul>{rows.map(({check,view},index)=><li key={index} data-testid="fact-check-row">
      <strong>{view.label}</strong><p>{check.scope}</p>
      {view.notes.length>0&&<p className="small">{view.notes.join(' ')}</p>}
      <p className="small">{check.sources.map((url,n)=><span key={url}>{n?' · ':''}<a href={url} target="_blank" rel="noopener noreferrer">Source {n+1}</a></span>)}</p>
    </li>)}</ul>
  </details>;
}
