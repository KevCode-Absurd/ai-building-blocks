import {describe,lowerFirst,trimDescription} from '../../src/lib/seo-meta.mjs';
const tails=[
  'Read the inputs and full instructions, check any supporting files, then choose a skill to copy or download for your AI.',
  'Read the inputs and full instructions before choosing a skill to copy or download for your AI.',
  'Read the inputs and full steps, then copy or download the skill for your AI.',
  'Read the inputs and full instructions before choosing a skill.',
  'Read the inputs and full instructions.',
  'Read each skill’s inputs and steps.',
  'Read the full steps.',
];
/** Keep the actual job, page and item names; a changed sort order must not leave thin search copy. */
export function hubDescription(name,n,items,pg,pages){
  if(!items?.length)throw Error('A job description needs its actual published items');
  let candidates;
  if(n===1){const {name:item,summary=''}=items[0];candidates=[`The ${item}, a free AI skill. ${summary}`,`Free: the ${item}. ${summary}`,`The ${item}. ${summary}`].map(text=>text.trim());}
  else{
    const lead=pg?`Page ${pg+1} of ${pages}: free AI skills and workflows to ${lowerFirst(name)}, including`:`${n} free AI skills and workflows to ${lowerFirst(name)}, including`;
    const names=items.slice(0,5).map(item=>item.name);
    candidates=names.map((_,index)=>`${lead} ${names.slice(0,names.length-index).join(', ')}.`);
  }
  const complete=candidates.find(text=>text.length>=120&&text.length<=155);if(complete)return complete;
  const base=candidates.find(text=>text.length<=155)??trimDescription(candidates.at(-1));
  const description=describe({summary:base,more:[items[0].summary].filter(Boolean),tail:tails}).text;
  if(description.length<120||description.length>155)throw Error('The job description needs more specific source copy');
  return description;
}
