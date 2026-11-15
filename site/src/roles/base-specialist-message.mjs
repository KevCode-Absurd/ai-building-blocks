// "Copy as one message" for a specialist: setup, the questions it asks first and its core method in one chat
// message. The published pack (base-specialist.mjs) stays generic. The owner's org context is passed in by the
// browser at click time and never reaches our servers.
import {MESSAGE_LIMIT,SITE,ACTION_RULE,bullets,numbered,fitMethod,brandBlock} from '../lib/one-message.mjs';

const take=(rows,n)=>(rows??[]).filter(Boolean).slice(0,n);

/** @param {any} role a role view or full profile
 *  @param {{method?:string|null, brandFile?:string, limit?:number}} [opts]
 *  method: the primary method's SKILL.md (null when it could not load); brandFile: meFor(...) text from the browser. */
export function specialistMessage(role,{method=null,brandFile='',limit=MESSAGE_LIMIT}={}){
 const lead=role.resources?.find(r=>r.slug===role.lead);
 const leadUrl=SITE+(lead?.path??`/roles/${role.id}`);
 const e=role.expertise??{};
 const checks=take((role.evaluation?.rubric??[]).map(c=>c.criterion).filter(c=>!c.startsWith('Delivers: ')),8);
 const head=[
  `Please work as my ${role.name.toLowerCase()} in this chat. This one message has what you need: how to start, what to ask me and the method to follow.`,
  `## The job\n${role.summary}`+(role.deliverables?.length?`\n\nWhat you can hand back:\n${bullets(take(role.deliverables,6))}`:''),
  `## How to start\n${numbered([
   'If I have not said what I need yet, ask: "What would you like me to do, and what would you like back?"',
   `Ask only for what is missing, in one short list:\n${bullets(['What job should you do, and what is out of scope?','What should you hand back, and what makes it good enough?','Which facts, files or examples can you use?',...take(role.inputs,4).map(i=>`If the job needs it: ${i}`)])}`,
   `Do not ask again for anything I already gave you${brandFile?', including my org context at the end of this message':''}. Never make up facts, numbers, prices or quotes.`,
   'Then do the work here in the chat, step by step, and show me the result.',
  ])}`,
  role.capabilities?.length?`## How an expert does this\n${numbered(take(role.capabilities,6).map(c=>`${c.name}: ${c.description}`))}`:'',
  e.principles?.length?`Rules to follow:\n${bullets(take(e.principles,6))}`:'',
  e.pitfalls?.length?`Mistakes to avoid:\n${bullets(take(e.pitfalls,5))}`:'',
 ].filter(Boolean);
 const tail=[
  `## Check before you hand back\n${bullets([...checks,'Every part I asked for is there and complete.','Say which checks you could not run and why.'])}`,
  `## Limits\n${bullets([...take(role.limits,5),ACTION_RULE])}`,
  brandBlock(brandFile),
  `Source: ${SITE}/roles/${role.id}. Everything stays in this chat; nothing runs anywhere else.`,
 ].filter(Boolean);
 const join=parts=>parts.join('\n\n');
 const title=`## The method: ${lead?.name??'primary method'}`;
 const fixed=join([...head,title,...tail]).length+4;
 const note=(full)=>full?'':`(This is a shorter version, cut to fit one message. The full method is at ${leadUrl}. For every method and source file, download the full specialist pack.)`;
 // Leave room for the note, then give the method what is left. A method that can't load still leaves a working message.
 const budget=Math.max(0,limit-fixed-260);
 const fit=method?fitMethod(method,budget):{text:'',shortened:true};
 const body=fit.text?`${fit.text}\n\n${note(!fit.shortened)}`.trim():`Read the method at ${leadUrl} if you can open links. If you can't, follow "How an expert does this" above.`;
 const text=join([...head,`${title}\n${body}`,...tail])+'\n';
 return {text,chars:text.length,limit,shortened:fit.shortened||!fit.text,fits:text.length<=limit,methodLoaded:!!method};
}
