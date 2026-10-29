import {loadSkillText,loadSkillZip,pathOf,type Block} from './data';
import {inspectSkillArchive} from './workflow-execution';

/** Keep the chosen reading order and every supporting file in one portable download. */
export async function buildSkillSelectionZip(blocks:Block[]){
  if(!blocks.length)throw Error('Choose at least one skill to download.');
  const {strToU8,unzipSync,zipSync}=await import('fflate');
  const files:Record<string,Uint8Array>={};
  const unique=[...new Map(blocks.map(block=>[block.slug,block])).values()];
  const order=unique.map((block,index)=>({step:index+1,slug:block.slug,name:block.name,url:`https://useaiblocks.com${pathOf(block)}`,file:`${block.slug}/SKILL.md`}));
  for(const block of unique){
    if(!/^[a-z0-9][a-z0-9-]{0,119}$/.test(block.slug))throw Error('Choose a skill from the library.');
    if(block.hasFiles){
      const bytes=await loadSkillZip(block.slug);
      if(!bytes)throw Error(`Couldn't load the complete files for ${block.name}. Check your connection and try again.`);
      inspectSkillArchive(bytes,block.slug);
      const contents=unzipSync(bytes);
      if(!contents[`${block.slug}/SKILL.md`]?.length)throw Error(`Couldn't load the complete files for ${block.name}. Check your connection and try again.`);
      Object.assign(files,contents);
    }else{
      const text=await loadSkillText(block.slug);
      if(!text)throw Error(`Couldn't load ${block.name}. Check your connection and try again.`);
      files[`${block.slug}/SKILL.md`]=strToU8(text);
    }
  }
  files['skill-order.json']=strToU8(JSON.stringify(order,null,2)+'\n');
  files['README.md']=strToU8([
    '# Your selected skills','',
    'Unzip this pack. Give the complete folders to your AI and ask it to read the skills in the order below. Bring the inputs each skill asks for.','',
    ...order.map(row=>`${row.step}. [${row.name}](${row.url}): \`${row.file}\``),'',
    'Each skill includes its supporting files where provided. This order is your choice; check that you have the inputs needed before running each step.','',
  ].join('\n'));
  return new Blob([zipSync(files,{level:6})],{type:'application/zip'});
}
