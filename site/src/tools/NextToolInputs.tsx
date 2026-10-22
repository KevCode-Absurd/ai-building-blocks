import { useState } from 'react';
import './next-tool-inputs.css';

type Props = { slug: string; example: string; onChange: (value: string) => void };
type TextFields = Record<string, string>;
export const HAS_FIELDS = new Set(['utm-link-builder', 'reading-session-scheduler', 'text-line-comparer', 'csv-column-selector', 'url-query-builder']);
export const FIELD_HELP: Record<string, string> = {
  'utm-link-builder': 'Enter your destination and campaign names. The link is created locally; this tool does not visit or publish it.',
  'reading-session-scheduler': 'Add reading items and their word counts. Sessions follow your list order. Allow separate time for breaks and setup.',
  'text-line-comparer': 'Paste each version below. The result compares exact line counts, including duplicates; moving a line does not count as an edit.',
  'csv-column-selector': 'Paste your CSV and list the headings to keep, one per line, in the order you want. Formula-like CSV output cells get a protective apostrophe.',
  'url-query-builder': 'Enter a destination and query parameters as key=value lines. Repeat a key for multiple values. Supplied keys replace existing values; other keys and fragments stay intact.',
};

export default function NextToolInputs({ slug, example, onChange }: Props) {
  const initial = JSON.parse(example);
  const [fields, setFields] = useState<TextFields>((): TextFields => {
    if (slug === 'reading-session-scheduler') return { wordsPerMinute: String(initial.wordsPerMinute), minutesPerSession: String(initial.minutesPerSession) };
    if (slug === 'csv-column-selector') return { csv: initial.csv, columns: initial.columns.join('\n') };
    if (slug === 'url-query-builder') return { url: initial.url, params: Object.entries(initial.params).flatMap(([key,value]) => (Array.isArray(value) ? value : [value]).map(v=>`${key}=${v}`)).join('\n') };
    return Object.fromEntries(Object.entries(initial).map(([k,v]) => [k,String(v)]));
  });
  const [items, setItems] = useState<{title:string; words:string}[]>(slug === 'reading-session-scheduler' ? initial.items.map((i:{title:string;words:number})=>({title:i.title,words:String(i.words)})) : []);
  const emit = (next: TextFields, readingItems = items) => {
    setFields(next);
    if (slug === 'reading-session-scheduler') onChange(JSON.stringify({ wordsPerMinute: Number(next.wordsPerMinute), minutesPerSession: Number(next.minutesPerSession), items: readingItems.map(i=>({title:i.title,words:i.words.trim() ? Number(i.words) : null})) }));
    else if (slug === 'csv-column-selector') onChange(JSON.stringify({csv:next.csv,columns:next.columns.replace(/\r\n?/g,'\n').split('\n').filter(Boolean)}));
    else if (slug === 'url-query-builder') {
      const params = new Map<string,string[]>();
      for(const line of next.params.replace(/\r\n?/g,'\n').split('\n').filter(Boolean)) { const i=line.indexOf('=');if(i<0){onChange(JSON.stringify({url:next.url,params:null}));return;}const key=line.slice(0,i);params.set(key,[...(params.get(key)??[]),line.slice(i+1)]); }
      onChange(JSON.stringify({url:next.url,params:Object.fromEntries(params)}));
    } else onChange(JSON.stringify(next));
  };
  const change = (key: string, value: string) => emit({...fields,[key]:value});
  const field = (key:string,label:string,multiline=false,type='text') => <label key={key}>{label}{multiline ? <textarea data-testid={`field-${key}`} value={fields[key]??''} onChange={e=>change(key,e.target.value)} spellCheck={false} /> : <input data-testid={`field-${key}`} type={type} value={fields[key]??''} onChange={e=>change(key,e.target.value)} spellCheck={false} />}</label>;
  if (slug === 'utm-link-builder') return <>
    {field('url','Destination URL',false,'url')}
    {field('source','Campaign source, such as newsletter')}
    {field('medium','Campaign medium, such as email')}
    {field('campaign','Campaign name')}
    {field('content','Content label, optional')}
    {field('term','Search term, optional')}
  </>;
  if (slug === 'text-line-comparer') return <>{field('before','Original text',true)}{field('after','Revised text',true)}</>;
  if (slug === 'csv-column-selector') return <>{field('csv','Your CSV table',true)}{field('columns','Headings to keep, one per line',true)}</>;
  if (slug === 'url-query-builder') return <>{field('url','Destination URL',false,'url')}{field('params','Parameters, one key=value per line',true)}</>;
  const updateItems = (next: typeof items) => {setItems(next);emit(fields,next);};
  return <>
    {field('wordsPerMinute','Reading speed, words per minute',false,'number')}
    {field('minutesPerSession','Available minutes per session',false,'number')}
    <fieldset className="next-tool-reading"><legend>Your reading list</legend>{items.map((item,index)=><div className="next-tool-reading-item" key={index}>
      <label>Item {index+1} title<input data-testid={`reading-title-${index}`} value={item.title} onChange={e=>updateItems(items.map((v,i)=>i===index?{...v,title:e.target.value}:v))} /></label>
      <label>Item {index+1} word count<input data-testid={`reading-words-${index}`} type="number" min="0" step="1" value={item.words} onChange={e=>updateItems(items.map((v,i)=>i===index?{...v,words:e.target.value}:v))} /></label>
      <button className="btn btn-dark btn-sm" onClick={()=>updateItems(items.filter((_,i)=>i!==index))}>Remove item {index+1}</button>
    </div>)}</fieldset>
    <button className="btn btn-dark btn-sm" onClick={()=>updateItems([...items,{title:'',words:''}])}>Add reading item</button>
  </>;
}
