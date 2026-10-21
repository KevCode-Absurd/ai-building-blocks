import {Marked} from 'marked';
const escape = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function safeHref(value, image=false) {
  if(typeof value!=='string')return false;
  const decoded=value.replace(/&#(x[0-9a-f]+|[0-9]+);?/gi,(_,n)=>String.fromCodePoint(Math.min(0x10ffff,parseInt(n.replace(/^x/i,''),/^x/i.test(n)?16:10)))).replace(/&colon;/gi,':').replace(/&tab;/gi,'\t').replace(/&newline;/gi,'\n');
  if(/[\u0000-\u0020\u007f\\]/.test(decoded)||decoded!==decoded.trim()||decoded.startsWith('//'))return false;
  if(/^https?:\/\//i.test(decoded)){try{const u=new URL(decoded);return !u.username&&!u.password;}catch{return false;}}
  if(!image&&/^mailto:[^:]+$/i.test(decoded))return true;
  return !decoded.split(/[?#]/,1)[0].includes(':')&&!decoded.startsWith('&');
}
export const markdown = new Marked({gfm:true,renderer:{
  html:({text})=>escape(text),
  link(token){const body=this.parser.parseInline(token.tokens);return safeHref(token.href)?`<a href="${escape(token.href)}"${token.title?` title="${escape(token.title)}"`:''}>${body}</a>`:body;},
  image(token){return safeHref(token.href,true)?`<img src="${escape(token.href)}" alt="${escape(token.text)}"${token.title?` title="${escape(token.title)}"`:''}>`:escape(token.text);}
}});
